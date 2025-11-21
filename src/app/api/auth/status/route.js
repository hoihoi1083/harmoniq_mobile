import { NextResponse } from "next/server";
import { cookies } from "next/headers";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		// Check for session token in cookies or headers
		const cookieStore = cookies();
		const sessionToken = cookieStore.get("session_token")?.value;

		if (!sessionToken) {
			return NextResponse.json({ loggedIn: false });
		}

		// Decode and validate session token
		const user = await validateSessionToken(sessionToken);

		if (!user) {
			return NextResponse.json({ loggedIn: false });
		}

		return NextResponse.json({
			loggedIn: true,
			user: {
				id: user.userId,
				name: user.name,
				avatar: user.avatar,
			},
		});
	} catch (error) {
		console.error("Auth status check error:", error);
		return NextResponse.json({ loggedIn: false });
	}
}

async function validateSessionToken(token) {
	try {
		// Decode the session token
		const payload = JSON.parse(Buffer.from(token, "base64").toString());

		// Check if token is expired
		if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
			return null;
		}

		// In production, verify JWT signature here

		return payload;
	} catch (error) {
		console.error("Token validation error:", error);
		return null;
	}
}
