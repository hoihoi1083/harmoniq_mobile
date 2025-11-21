import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import FortuneReport from "@/models/FortuneReport";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get("sessionId");

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID is required" },
				{ status: 400 }
			);
		}

		await dbConnect();

		const report = await FortuneReport.findOne({ sessionId }).select({
			sessionId: 1,
			reportGenerated: 1,
			reportGeneratedAt: 1,
			accessCount: 1,
			lastAccessedAt: 1,
			paymentStatus: 1,
			createdAt: 1,
		});

		if (!report) {
			return NextResponse.json(
				{ error: "Report not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			status: 0,
			data: {
				sessionId: report.sessionId,
				reportGenerated: report.reportGenerated,
				reportGeneratedAt: report.reportGeneratedAt,
				accessCount: report.accessCount,
				lastAccessedAt: report.lastAccessedAt,
				paymentStatus: report.paymentStatus,
				createdAt: report.createdAt,
				canRegenerateReport: false, // Reports can only be generated once
			},
		});
	} catch (err) {
		console.error("Report status check error:", err);
		return NextResponse.json(
			{ error: "檢查報告狀態失敗" },
			{ status: 500 }
		);
	}
}
