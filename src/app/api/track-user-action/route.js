// /src/app/api/track-user-action/route.js
import { NextResponse } from "next/server";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const trackingData = await request.json();

		// Validate required fields
		if (!trackingData.userId || !trackingData.action) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// In a real application, you would save to your database
		// For now, we'll log and return success
		console.log("User Action Tracked:", {
			userId: trackingData.userId,
			sessionId: trackingData.sessionId,
			action: trackingData.action,
			timestamp: trackingData.timestamp,
			url: trackingData.url,
			deviceType: trackingData.deviceType,
			data: trackingData.data,
		});

		// Here you would typically save to your database:
		/*
    await db.userActions.create({
      data: {
        userId: trackingData.userId,
        sessionId: trackingData.sessionId,
        action: trackingData.action,
        actionData: JSON.stringify(trackingData.data),
        timestamp: new Date(trackingData.timestamp),
        url: trackingData.url,
        userAgent: trackingData.userAgent,
        screenResolution: trackingData.screenResolution,
        deviceType: trackingData.deviceType
      }
    });
    */

		return NextResponse.json({
			success: true,
			message: "Action tracked successfully",
		});
	} catch (error) {
		console.error("Tracking API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	return NextResponse.json({
		message: "User tracking API is active",
		methods: ["POST"],
		description: "Track user actions for feng shui analysis",
	});
}
