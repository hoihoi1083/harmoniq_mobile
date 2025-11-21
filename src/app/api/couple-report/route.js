import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import CoupleReportDoc from "@/models/CoupleReportDoc";
import { auth } from "@/auth";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const body = await request.json();
		const {
			sessionId,
			birthday,
			birthday2,
			gender,
			gender2,
			concern,
			problem,
			problemCategory,
			reportContent,
			reportGeneratedAt,
		} = body;

		// Validate required fields
		if (!sessionId || !birthday || !birthday2 || !reportContent) {
			return NextResponse.json(
				{
					status: 1,
					error: "Missing required fields: sessionId, birthday, birthday2, or reportContent",
				},
				{ status: 400 }
			);
		}

		// 🔐 獲取登入用戶會話信息
		const authSession = await auth();
		const loggedInUserEmail = authSession?.user?.email;
		const loggedInUserId = loggedInUserEmail || null;

		console.log("🔐 Couple report auth session info:", {
			hasAuthSession: !!authSession,
			loggedInUserEmail,
			loggedInUserId,
		});

		await connectDB();

		// Create couple report document using Mongoose model
		const coupleReportData = {
			userId: loggedInUserId || `guest-${sessionId}`, // Use logged-in user ID or guest fallback
			sessionId,
			language: "zh-TW",
			userProfile: {
				birthday: new Date(birthday),
				gender: gender || "male",
			},
			partnerProfile: {
				birthday: new Date(birthday2),
				gender: gender2 || "female",
			},
			// reportContent will be set separately after document creation
			compatibilityAnalysis: {
				overallScore:
					reportContent?.coupleAnnualAnalysis?.compatibility?.score ||
					75,
				relationshipAdvice:
					reportContent?.coupleAnnualAnalysis?.advice ||
					reportContent?.coupleMingJu?.relationshipAdvice ||
					"",
				developmentAdvice:
					reportContent?.coupleCoreSuggestion?.developmentAdvice ||
					reportContent?.coupleCoreSuggestion?.advice ||
					"",
				specificAdvice: problem || "感情關係和諧改善建議",
			},
			yearlyFortune: {
				currentYear: reportContent?.coupleSeason?.currentYear || "",
				bestTiming: reportContent?.coupleSeason?.bestTiming || "",
				warnings: reportContent?.coupleSeason?.warnings || "",
			},
			fengShuiLayout: {
				bedroom: reportContent?.coupleCoreSuggestion?.bedroom || "",
				livingRoom:
					reportContent?.coupleCoreSuggestion?.livingRoom || "",
				colors: reportContent?.coupleCoreSuggestion?.colors || "",
				items: reportContent?.coupleCoreSuggestion?.items || "",
				generalAdvice:
					reportContent?.coupleCoreSuggestion?.generalAdvice || "",
			},
			reportMetadata: {
				concern: concern || "感情",
				reportType: "couple_analysis",
				generatedAt: new Date(reportGeneratedAt || new Date()),
			},
		};

		// Insert or update the couple report - using working pattern from test
		let result = await CoupleReportDoc.findOne({ sessionId });

		if (result) {
			// Update existing document
			Object.assign(result, coupleReportData);
		} else {
			// Create new document
			result = new CoupleReportDoc(coupleReportData);
		}

		// Set reportContent using the exact working pattern from our successful test
		if (reportContent) {
			result.reportContent = reportContent;
			result.markModified("reportContent");
		}
		result = await result.save();

		console.log("✅ Couple report saved successfully:", {
			sessionId,
			reportId: result._id,
			problemCategory,
			componentCount: Object.keys(reportContent || {}).length,
		});

		return NextResponse.json({
			status: 0,
			message: "Couple report saved successfully",
			sessionId,
			reportId: result._id,
		});
	} catch (error) {
		console.error("❌ Error saving couple report:", error);
		return NextResponse.json(
			{
				status: 1,
				error: "Internal server error while saving couple report",
			},
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get("sessionId");
		const birthday = searchParams.get("birthday");
		const birthday2 = searchParams.get("birthday2");
		const problem = searchParams.get("problem");

		if (!sessionId && (!birthday || !birthday2)) {
			return NextResponse.json(
				{
					status: 1,
					error: "Either sessionId or both birthday and birthday2 are required",
				},
				{ status: 400 }
			);
		}

		await connectDB();

		let coupleReport;

		if (sessionId) {
			// Find by session ID
			coupleReport = await CoupleReportDoc.findOne({ sessionId });
		} else {
			// Find by birthdays and problem (most recent)
			const query = {
				"userProfile.birthday": new Date(birthday),
				"partnerProfile.birthday": new Date(birthday2),
			};
			if (problem) {
				query["compatibilityAnalysis.specificAdvice"] = problem;
			}

			coupleReport = await CoupleReportDoc.findOne(query).sort({
				createdAt: -1,
			});
		}

		if (!coupleReport) {
			return NextResponse.json({
				status: 0,
				reportExists: false,
				reportGenerated: false,
				message: "No couple report found",
			});
		}

		// Check if report has complete content
		const hasCompleteContent =
			coupleReport.reportContent &&
			Object.keys(coupleReport.reportContent).length > 0;

		return NextResponse.json({
			status: 0,
			reportExists: true,
			reportGenerated: hasCompleteContent,
			data: {
				sessionId: coupleReport.sessionId,
				birthday: coupleReport.userProfile?.birthday,
				birthday2: coupleReport.partnerProfile?.birthday,
				gender: coupleReport.userProfile?.gender,
				gender2: coupleReport.partnerProfile?.gender,
				concern: coupleReport.reportMetadata?.concern,
				problem: coupleReport.compatibilityAnalysis?.specificAdvice,
				problemCategory: coupleReport.problemCategory,
				reportContent: coupleReport.reportContent,
				reportGeneratedAt: coupleReport.reportMetadata?.generatedAt,
				createdAt: coupleReport.createdAt,
			},
		});
	} catch (error) {
		console.error("❌ Error retrieving couple report:", error);
		return NextResponse.json(
			{
				status: 1,
				error: "Internal server error while retrieving couple report",
			},
			{ status: 500 }
		);
	}
}

export async function PUT(request) {
	try {
		const body = await request.json();
		const { sessionId, reportContent } = body;

		if (!sessionId || !reportContent) {
			return NextResponse.json(
				{
					status: 1,
					error: "Missing required fields: sessionId or reportContent",
				},
				{ status: 400 }
			);
		}

		await connectDB();

		// Update the couple report with complete content
		const result = await CoupleReportDoc.updateOne(
			{ sessionId },
			{
				$set: {
					compatibilityAnalysis: {
						overallScore:
							reportContent?.coupleAnnualAnalysis?.compatibility
								?.score || 75,
						relationshipAdvice:
							reportContent?.coupleAnnualAnalysis?.advice ||
							reportContent?.coupleMingJu?.relationshipAdvice ||
							"",
						developmentAdvice:
							reportContent?.coupleCoreSuggestion
								?.developmentAdvice ||
							reportContent?.coupleCoreSuggestion?.advice ||
							"",
						specificAdvice:
							reportContent?.enhancedSolution_emotion_cooling
								?.specificAdvice || "",
					},
					yearlyFortune: {
						currentYear:
							reportContent?.coupleSeason?.currentYear || "",
						bestTiming:
							reportContent?.coupleSeason?.bestTiming || "",
						warnings: reportContent?.coupleSeason?.warnings || "",
					},
					fengShuiLayout: {
						bedroom:
							reportContent?.coupleCoreSuggestion?.bedroom || "",
						livingRoom:
							reportContent?.coupleCoreSuggestion?.livingRoom ||
							"",
						colors:
							reportContent?.coupleCoreSuggestion?.colors || "",
						items: reportContent?.coupleCoreSuggestion?.items || "",
						generalAdvice:
							reportContent?.coupleCoreSuggestion
								?.generalAdvice || "",
					},
					updatedAt: new Date(),
				},
			}
		);

		if (result.matchedCount === 0) {
			return NextResponse.json(
				{
					status: 1,
					error: "Couple report not found",
				},
				{ status: 404 }
			);
		}

		console.log("✅ Couple report updated successfully:", {
			sessionId,
			modifiedCount: result.modifiedCount,
		});

		return NextResponse.json({
			status: 0,
			message: "Couple report updated successfully",
			modifiedCount: result.modifiedCount,
		});
	} catch (error) {
		console.error("❌ Error updating couple report:", error);
		return NextResponse.json(
			{
				status: 1,
				error: "Internal server error while updating couple report",
			},
			{ status: 500 }
		);
	}
}
