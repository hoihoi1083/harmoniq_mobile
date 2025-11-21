import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const body = await request.json();
		const { sessionId } = body;

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID is required", status: 1 },
				{ status: 400 }
			);
		}

		// Retrieve the checkout session from Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		// Check if payment was successful
		if (session.payment_status === "paid") {
			return NextResponse.json({
				status: 0, // Success
				data: {
					payment_status: session.payment_status,
					customer_email: session.customer_details?.email,
					amount_total: session.amount_total,
					currency: session.currency,
					metadata: session.metadata,
					sessionId: sessionId,
				},
			});
		} else {
			return NextResponse.json({
				error: "Payment not completed",
				status: 1,
				data: {
					payment_status: session.payment_status,
				},
			});
		}
	} catch (err) {
		console.error("Fortune payment verification error:", err);
		return NextResponse.json(
			{
				error: "驗證支付失敗: " + err.message,
				status: 1,
			},
			{ status: 500 }
		);
	}
}
