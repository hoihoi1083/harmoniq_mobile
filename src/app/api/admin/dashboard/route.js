import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import UserIntent from "@/models/UserIntent";

// Required for static export with Capacitor
export const dynamic = "force-static";

export async function GET() {
	try {
		await connectDB();

		// 獲取統計數據
		const totalIntents = await UserIntent.countDocuments();
		const paidIntents = await UserIntent.countDocuments({
			paymentCompleted: true,
		});
		const completedReports = await UserIntent.countDocuments({
			paymentCompleted: true,
			reportGenerated: true,
		});

		// 計算收入（假設每份報告 HK$299）
		const totalRevenue = paidIntents * 299;

		// 計算轉換率
		const conversionRate =
			totalIntents > 0
				? Math.round((paidIntents / totalIntents) * 100)
				: 0;

		// 獲取唯一用戶數（基於email）
		const uniqueUsers = await UserIntent.distinct("userEmail");

		// 獲取最近的意圖記錄
		const recentIntents = await UserIntent.find()
			.sort({ createdAt: -1 })
			.limit(20)
			.select({
				userEmail: 1,
				primaryConcern: 1,
				specificQuestion: 1,
				paymentCompleted: 1,
				reportGenerated: 1,
				createdAt: 1,
			});

		return NextResponse.json({
			success: true,
			stats: {
				totalUsers: uniqueUsers.length,
				totalReports: completedReports,
				totalRevenue,
				conversionRate,
			},
			recentIntents,
		});
	} catch (error) {
		console.error("獲取儀表板數據失敗:", error);
		return NextResponse.json({ error: "獲取數據失敗" }, { status: 500 });
	}
}
