import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
	genSuccessData,
	genUnAuthData,
	genErrorData,
} from "../../utils/gen-res-data";
import { stripe } from "@/lib/stripe";
import { getUserInfo } from "@/lib/session";
import {
	getRegionalPriceId,
	getLocaleFromRequest,
} from "@/utils/regionalPricing";

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

		// Get square feet, quantity and locale from request body
		const body = await request.json();
		const quantity = Number(body.quantity) || 1;
		const squareFeet = Number(body.squareFeet) || quantity;
		const requestLocale = body.locale;

		// Detect user's locale to determine pricing (use request body locale if provided)
		const locale = requestLocale || getLocaleFromRequest(request);
		console.log(`🌍 Detected locale: ${locale}`);
		console.log(`🔍 Payment2 - Request body locale: ${requestLocale}`);
		console.log(
			`🔍 Payment2 - Headers locale: ${getLocaleFromRequest(request)}`
		);

		// Get the appropriate price ID for fengshui based on locale
		const priceId = getRegionalPriceId(locale, "fengshui");
		console.log(`💰 Using price ID: ${priceId} for fengshui ${locale}`);

		// Create Checkout Sessions for premium using regional price ID
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: priceId, // Use regional price ID
					quantity,
				},
			],
			mode: "payment", // One-time payment mode
			allow_promotion_codes: false,
			success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/price?payment=cancelled`,
			metadata: {
				userId: (userInfo as any).userId || userInfo.id,
				quantity: String(quantity),
				squareFeet: String(squareFeet),
				locale: locale,
				paymentType: "fengshui",
			},
		});
		return NextResponse.json(genSuccessData(session));
	} catch (err) {
		return NextResponse.json(genErrorData("支付錯誤: " + err.message));
	}
}
