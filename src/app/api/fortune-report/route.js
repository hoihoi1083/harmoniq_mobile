import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import FortuneReport from "@/models/FortuneReport";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const body = await request.json();
		const { sessionId } = body;

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID is required", status: 1 },
				{ status: 400 }
			);
		}

		// 🔐 獲取登入用戶會話信息
		const authSession = await auth();
		const loggedInUserEmail = authSession?.user?.email;
		const loggedInUserId = loggedInUserEmail || null;

		console.log("🔐 Auth session info:", {
			hasAuthSession: !!authSession,
			loggedInUserEmail,
			loggedInUserId,
		});

		await dbConnect();

		// First, verify the payment with Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== "paid") {
			return NextResponse.json({
				error: "Payment not completed",
				status: 1,
				paymentRequired: true,
			});
		}

		// Check if report already exists in our database
		let fortuneReport = await FortuneReport.findOne({ sessionId });

		if (fortuneReport) {
			// Get current URL parameters to potentially update user inputs
			const url = new URL(request.url);
			const urlParams = {
				birthday: url.searchParams.get("birthday") || "",
				gender: url.searchParams.get("gender") || "",
				concern: url.searchParams.get("concern") || "",
				problem: url.searchParams.get("problem") || "",
				partnerBirthday: url.searchParams.get("partnerBirthday") || "",
			};

			// Check if we have more complete user inputs from URL
			const hasNewInputs =
				urlParams.birthday || urlParams.concern || urlParams.problem;

			console.log("Found existing report:", {
				sessionId,
				reportGenerated: fortuneReport.reportGenerated,
				currentInputs: fortuneReport.userInputs,
				newUrlParams: urlParams,
				hasNewInputs,
				hasValidCurrentInputs: Boolean(
					fortuneReport.userInputs?.birthday &&
						fortuneReport.userInputs?.concern &&
						fortuneReport.userInputs?.problem
				),
			});

			// If we have new inputs and report isn't generated yet, update the user inputs
			if (hasNewInputs && !fortuneReport.reportGenerated) {
				const metadata = session.metadata || {};
				fortuneReport.userInputs = {
					birthday:
						urlParams.birthday ||
						fortuneReport.userInputs?.birthday ||
						metadata.birthday ||
						"",
					gender:
						urlParams.gender ||
						fortuneReport.userInputs?.gender ||
						metadata.gender ||
						"",
					concern:
						urlParams.concern ||
						fortuneReport.userInputs?.concern ||
						metadata.concern ||
						"",
					problem:
						urlParams.problem ||
						fortuneReport.userInputs?.problem ||
						metadata.specificProblem ||
						metadata.problem ||
						"",
					partnerBirthday:
						urlParams.partnerBirthday ||
						fortuneReport.userInputs?.partnerBirthday ||
						metadata.partnerBirthday ||
						"",
				};
				console.log("Updated user inputs:", fortuneReport.userInputs);
			}

			// Report exists - update access count and return it
			fortuneReport.accessCount += 1;
			fortuneReport.lastAccessedAt = new Date();
			await fortuneReport.save();

			return NextResponse.json({
				status: 0, // Success
				reportExists: true,
				reportGenerated: fortuneReport.reportGenerated,
				data: {
					sessionId: sessionId,
					payment_status: session.payment_status,
					reportContent: fortuneReport.reportContent,
					userInputs: fortuneReport.userInputs,
					reportGeneratedAt: fortuneReport.reportGeneratedAt,
					accessCount: fortuneReport.accessCount,
					canGenerateNew: true, // ALWAYS allow new generation for fresh content
				},
			});
		} else {
			// No report exists - create new record and allow generation
			// Extract user data from URL parameters or session metadata
			const metadata = session.metadata || {};

			// Also get URL parameters from the request if available
			const url = new URL(request.url);
			const urlParams = {
				birthday: url.searchParams.get("birthday") || "",
				gender: url.searchParams.get("gender") || "",
				concern: url.searchParams.get("concern") || "",
				problem: url.searchParams.get("problem") || "",
				partnerBirthday: url.searchParams.get("partnerBirthday") || "",
			};

			const finalUserInputs = {
				// Priority: URL params > metadata > defaults
				birthday: urlParams.birthday || metadata.birthday || "",
				gender: urlParams.gender || metadata.gender || "",
				concern: urlParams.concern || metadata.concern || "",
				problem:
					urlParams.problem ||
					metadata.specificProblem ||
					metadata.problem ||
					"",
				partnerBirthday:
					urlParams.partnerBirthday || metadata.partnerBirthday || "",
			};

			console.log("Creating new report with inputs:", {
				sessionId,
				loggedInUserId,
				urlParams,
				metadata,
				finalUserInputs,
				hasRequiredInputs: Boolean(
					finalUserInputs.birthday &&
						finalUserInputs.concern &&
						finalUserInputs.problem
				),
			});

			fortuneReport = new FortuneReport({
				sessionId: sessionId,
				userId:
					loggedInUserId ||
					session.customer_details?.email ||
					metadata.userId ||
					`guest-${sessionId}`, // Fallback for anonymous users
				userEmail:
					loggedInUserEmail ||
					session.customer_details?.email ||
					metadata.userEmail ||
					null,
				paymentAmount: session.amount_total,
				paymentCurrency: session.currency,
				userInputs: finalUserInputs,
				reportGenerated: false,
				accessCount: 1,
				lastAccessedAt: new Date(),
			});

			await fortuneReport.save();

			return NextResponse.json({
				status: 0, // Success
				reportExists: false,
				reportGenerated: false,
				data: {
					sessionId: sessionId,
					payment_status: session.payment_status,
					reportContent: null,
					userInputs: fortuneReport.userInputs,
					canGenerateNew: true, // Allow first-time generation
				},
			});
		}
	} catch (err) {
		console.error("Fortune report check error:", err);
		return NextResponse.json(
			{
				error: "檢查報告失敗: " + err.message,
				status: 1,
			},
			{ status: 500 }
		);
	}
}

// Update report content after generation
export async function PUT(request) {
	try {
		const body = await request.json();
		const { sessionId, reportContent } = body;

		if (!sessionId || !reportContent) {
			return NextResponse.json(
				{
					error: "Session ID and report content are required",
					status: 1,
				},
				{ status: 400 }
			);
		}

		await dbConnect();

		const fortuneReport = await FortuneReport.findOne({ sessionId });

		if (!fortuneReport) {
			return NextResponse.json(
				{ error: "Report not found", status: 1 },
				{ status: 404 }
			);
		}

		// Update report content and mark as generated
		fortuneReport.reportContent = reportContent;
		fortuneReport.reportGenerated = true;
		fortuneReport.reportGeneratedAt = new Date();
		await fortuneReport.save();

		return NextResponse.json({
			status: 0,
			message: "Report saved successfully",
			data: {
				sessionId: sessionId,
				reportGenerated: true,
				reportGeneratedAt: fortuneReport.reportGeneratedAt,
			},
		});
	} catch (err) {
		console.error("Fortune report update error:", err);
		return NextResponse.json(
			{
				error: "更新報告失敗: " + err.message,
				status: 1,
			},
			{ status: 500 }
		);
	}
}
