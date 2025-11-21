import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import UserIntent from "@/models/UserIntent";
import { ReportGenerator } from "@/lib/reportGenerator";
import { auth } from "@/auth";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const session = await auth();
		if (!session) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

		await connectMongo();
		const body = await request.json();

		// 查找用戶意圖記錄
		const userIntent = await UserIntent.findById(userIntentId);
		if (!userIntent) {
			return NextResponse.json(
				{ error: "找不到用戶記錄" },
				{ status: 404 }
			);
		}

		// 生成付款ID（實際項目中應該整合真實的付款系統）
		const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

		// 更新用戶意圖記錄
		userIntent.paymentId = paymentId;
		userIntent.paymentStatus = "pending";
		await userIntent.save();

		// 在實際項目中，這裡應該調用 Stripe, PayPal 等付款API
		// 現在我們模擬一個付款URL
		const paymentUrl = `/payment/process?paymentId=${paymentId}&amount=${amount}`;

		return NextResponse.json({
			success: true,
			paymentId,
			paymentUrl,
			message: "付款連結已生成",
		});
	} catch (error) {
		console.error("Payment creation error:", error);
		return NextResponse.json({ error: "付款處理失敗" }, { status: 500 });
	}
}

// 處理付款成功回調
export async function PUT(request) {
	try {
		const { paymentId, status } = await request.json();

		await connectMongo();

		// 查找付款記錄
		const userIntent = await UserIntent.findOne({ paymentId });
		if (!userIntent) {
			return NextResponse.json(
				{ error: "找不到付款記錄" },
				{ status: 404 }
			);
		}

		if (status === "paid") {
			// 更新付款狀態
			userIntent.paymentStatus = "paid";
			await userIntent.save();

			// 生成風水報告
			try {
				console.log("開始生成報告...");
				const reportContent =
					await ReportGenerator.generatePersonalizedReport(
						userIntent
					);

				// 保存報告內容
				userIntent.reportContent = reportContent;
				userIntent.reportGenerated = true;
				await userIntent.save();

				console.log("報告生成完成");

				// 這裡可以發送郵件通知用戶報告已完成
				// await sendReportNotification(userIntent.email, userIntent.name);

				return NextResponse.json({
					success: true,
					message: "付款成功，報告已生成",
					reportReady: true,
				});
			} catch (reportError) {
				console.error("Report generation error:", reportError);

				// 即使報告生成失敗，也要標記付款成功
				return NextResponse.json({
					success: true,
					message: "付款成功，報告生成中，請稍後查看",
					reportReady: false,
				});
			}
		} else if (status === "failed") {
			userIntent.paymentStatus = "expired";
			await userIntent.save();

			return NextResponse.json({
				success: false,
				message: "付款失敗",
			});
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Payment update error:", error);
		return NextResponse.json(
			{ error: "付款狀態更新失敗" },
			{ status: 500 }
		);
	}
}
