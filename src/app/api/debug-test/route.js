import { NextResponse } from "next/server";

// Simple test endpoint to debug what's being received

// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const body = await request.json();

		return NextResponse.json({
			status: 0,
			message: "Test endpoint - showing exactly what was received",
			received: body,
			hasUserId: !!body.userId,
			userIdValue: body.userId,
			allKeys: Object.keys(body),
		});
	} catch (error) {
		return NextResponse.json({
			status: -1,
			error: error.message,
		});
	}
}
