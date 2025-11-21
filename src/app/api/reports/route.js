import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import UserIntent from "@/models/UserIntent";
import { auth } from "@/auth";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET() {
	try {
		const session = await auth();

		if (!session?.user?.email) {
			return NextResponse.json({ error: "未授權訪問" }, { status: 401 });
		}

		await connectDB();

		// 獲取該用戶的所有報告
		const reports = await UserIntent.find({
			userEmail: session.user.email,
			paymentCompleted: true,
		})
			.sort({ createdAt: -1 })
			.select({
				primaryConcern: 1,
				specificQuestion: 1,
				reportGenerated: 1,
				reportContent: 1,
				createdAt: 1,
				updatedAt: 1,
			});

		return NextResponse.json({
			success: true,
			reports: reports || [],
		});
	} catch (error) {
		console.error("獲取報告失敗:", error);
		return NextResponse.json({ error: "獲取報告失敗" }, { status: 500 });
	}
}

// 獲取特定報告
export async function POST(request) {
	try {
		const session = await auth();

		if (!session?.user?.email) {
			return NextResponse.json({ error: "未授權訪問" }, { status: 401 });
		}

		const { reportId } = await request.json();

		if (!reportId) {
			return NextResponse.json({ error: "缺少報告ID" }, { status: 400 });
		}

		await connectDB();

		const report = await UserIntent.findOne({
			_id: reportId,
			userEmail: session.user.email,
			paymentCompleted: true,
		});

		if (!report) {
			return NextResponse.json({ error: "報告不存在" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			report: {
				id: report._id,
				primaryConcern: report.primaryConcern,
				specificQuestion: report.specificQuestion,
				reportGenerated: report.reportGenerated,
				reportContent: report.reportContent,
				createdAt: report.createdAt,
				updatedAt: report.updatedAt,
			},
		});
	} catch (error) {
		console.error("獲取特定報告失敗:", error);
		return NextResponse.json({ error: "獲取報告失敗" }, { status: 500 });
	}
}
