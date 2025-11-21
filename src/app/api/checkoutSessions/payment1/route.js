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

		// Get square feet and quantity from request body
		const body = await request.json();
		const quantity = Number(body.quantity) || 1;
		const squareFeet = Number(body.squareFeet) || quantity;

		// 📱 MOBILE FIX: Detect if this is from mobile app and use appropriate success URL
		const isMobileRequest = !!(mobileUserEmail || mobileUserId);
		let successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;

		if (isMobileRequest) {
			successUrl += "&mobile=true";
		}

		// Create Checkout Sessions for subscription using PRICE_ID1
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: process.env.PRICE_ID1, // Use PRICE_ID1 for subscription
					quantity,
				},
			],
			mode: "payment",
			allow_promotion_codes: false,
			success_url: successUrl,
			cancel_url: `${origin}/price?payment=cancelled`,
			metadata: {
				userId: userInfo.userId,
				quantity: String(quantity),
				squareFeet: String(squareFeet),
			},
		});
		return NextResponse.json(genSuccessData(session));
	} catch (err) {
		return NextResponse.json(genErrorData("訂閱支付錯誤: " + err.message));
	}
}
