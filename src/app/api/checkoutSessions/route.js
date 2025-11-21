import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
	genSuccessData,
	genUnAuthData,
	genErrorData,
} from "../utils/gen-res-data";
import { stripe } from "@/lib/stripe";
import { getUserInfo } from "@/lib/session";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	const userInfo = await getUserInfo();
	if (userInfo == null) return NextResponse.json(genUnAuthData());
	try {
		const headersList = await headers();
		const origin = headersList.get("origin");

		// 取得前端傳來的 quantity
		const body = await request.json();
		const quantity = Number(body.quantity) || 1;

		// Create Checkout Sessions from body params.
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: process.env.PRICE_ID,
					quantity,
				},
			],
			mode: "payment",
			allow_promotion_codes: true,
			success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/report?canceled=true`,
			metadata: {
				userId: userInfo.userId,
				quantity: String(quantity),
			},
		});return NextResponse.json(genSuccessData(session));
	} catch (err) {
		return NextResponse.json(genErrorData("支付错误" + err.message));
	}
}
