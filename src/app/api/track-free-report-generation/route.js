import { NextResponse } from "next/server";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const data = await request.json();

		// Log the free report generation for analytics
		console.log("📊 Free Report Generation Tracked:", {
			timestamp: new Date().toISOString(),
			roomType: data.roomType,
			direction: data.direction,
			userInfo: data.userInfo,
			hasUploadedImage: data.hasUploadedImage,
			imageFileName: data.imageFileName,
			locale: data.locale,
			sessionId: data.sessionId,
			isAnonymous: data.isAnonymous,
			analysisResult: data.analysisResult
				? "✅ Analysis data included"
				: "❌ No analysis data",
		});

		// Here you could add database logging, analytics tracking, etc.
		// For now, we'll just return success

		return NextResponse.json({
			success: true,
			message: "Free report generation tracked successfully",
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error tracking free report generation:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Failed to track free report generation",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}
