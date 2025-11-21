import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
	genSuccessData,
	genUnAuthData,
	genErrorData,
} from "../../utils/gen-res-data";
import { stripe } from "@/lib/stripe";
import { getUserInfo } from "@/lib/session";

export async function POST(request) {
	// 🔥 MOBILE FIX: Check for mobile user info in headers
	const headersList = await headers();
	const mobileUserEmail = headersList.get("X-User-Email");
	const mobileUserId = headersList.get("X-User-ID");

	// Try to get user info from NextAuth first
	let userInfo = await getUserInfo();

	// If no NextAuth session but mobile headers exist, create user info object
	if (!userInfo && (mobileUserEmail || mobileUserId)) {
		console.log("📱 Using mobile session from headers:", {
			mobileUserEmail,
			mobileUserId,
		});
		userInfo = {
			email: mobileUserEmail,
			userId: mobileUserId || mobileUserEmail,
		};
	}

	if (userInfo == null) return NextResponse.json(genUnAuthData());

	try {
		const headersList = await headers();
		const origin = headersList.get("origin");

		// Get square meters and quantity from request body
		const body = await request.json();
		const quantity = Number(body.quantity) || 1;
		const squareMeters = Number(body.squareMeters) || quantity;

		// 📱 MOBILE FIX: Detect if this is from mobile app and use appropriate success URL
		const isMobileRequest = !!(mobileUserEmail || mobileUserId);
		let successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;

		if (isMobileRequest) {
			successUrl += "&mobile=true";
		}

		// Create Checkout Sessions for China premium using special price
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: process.env.PRICE_ID2_CHINA, // Use China-specific price
					quantity,
				},
			],
			mode: "payment", // One-time payment mode
			allow_promotion_codes: false,
			success_url: successUrl,
			cancel_url: `${origin}/price?payment=cancelled`,
			metadata: {
				userId: userInfo.userId,
				quantity: String(quantity),
				squareMeters: String(squareMeters),
				unit: "sqm",
				region: "china",
			},
		});

		console.log("China premium payment session.url (SQM)", session.url);
		return NextResponse.json(genSuccessData(session));
	} catch (err) {
		console.error("China premium payment error (SQM):", err);
		return NextResponse.json(genErrorData("支付错误: " + err.message));
	}
}
