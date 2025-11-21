import { NextRequest, NextResponse } from "next/server";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request: NextRequest) {
	try {
		const {
			userInfo,
			analysisResult,
			locale = "zh-TW",
			timeSpentOnPage = 0,
			referrer = "",
			sessionId = "",
			isAnonymous = true,
		} = await request.json();

		// Log the personal report generation attempt
		console.log("🎯 Personal Report Generation Tracking:", {
			timestamp: new Date().toISOString(),
			userInfo: {
				gender: userInfo?.gender,
				birthDateTime: userInfo?.birthDateTime,
				hasValidData: !!(userInfo?.gender && userInfo?.birthDateTime),
			},
			analysisResult: {
				reportType: analysisResult?.reportType,
				nayin: analysisResult?.nayin,
				wuxingJu: analysisResult?.wuxingJu,
				mingPalace: analysisResult?.mingPalace,
				hasValidAnalysis: !!(
					analysisResult?.nayin && analysisResult?.wuxingJu
				),
			},
			sessionInfo: {
				locale,
				timeSpentOnPage,
				referrer,
				sessionId,
				isAnonymous,
				userAgent: request.headers.get("user-agent") || "",
				ip:
					request.headers.get("x-forwarded-for") ||
					request.headers.get("x-real-ip") ||
					"unknown",
			},
		});

		// Validate required data
		if (!userInfo?.gender || !userInfo?.birthDateTime) {
			console.warn("⚠️ Missing required personal info data");
			return NextResponse.json(
				{
					success: false,
					error: "Missing required personal information",
					received: {
						hasGender: !!userInfo?.gender,
						hasBirthDateTime: !!userInfo?.birthDateTime,
					},
				},
				{ status: 400 }
			);
		}

		if (!analysisResult?.nayin || !analysisResult?.wuxingJu) {
			console.warn("⚠️ Missing required analysis data");
			return NextResponse.json(
				{
					success: false,
					error: "Missing required analysis data",
					received: {
						hasNayin: !!analysisResult?.nayin,
						hasWuxingJu: !!analysisResult?.wuxingJu,
					},
				},
				{ status: 400 }
			);
		}

		// Here you could save to database, send to analytics service, etc.
		// For now, we'll just log and return success

		const trackingData = {
			id: `personal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			type: "personal_report_generation",
			timestamp: new Date().toISOString(),
			data: {
				userInfo,
				analysisResult,
				sessionInfo: {
					locale,
					timeSpentOnPage,
					referrer,
					sessionId,
					isAnonymous,
				},
			},
		};

		// TODO: Save to database or analytics service
		// await saveToAnalytics(trackingData);

		console.log(
			"✅ Personal report generation tracked successfully:",
			trackingData.id
		);

		return NextResponse.json({
			success: true,
			trackingId: trackingData.id,
			timestamp: trackingData.timestamp,
			message: "Personal report generation tracked successfully",
		});
	} catch (error) {
		console.error("❌ Error tracking personal report generation:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
				details:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
