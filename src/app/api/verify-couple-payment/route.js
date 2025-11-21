import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const { sessionId } = await request.json();

		if (!sessionId) {
			return NextResponse.json(
				{ error: "Session ID is required" },
				{ status: 400 }
			);
		}

		// Retrieve the session from Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (!session) {
			return NextResponse.json(
				{ error: "Session not found" },
				{ status: 404 }
			);
		}

		// Check if payment was successful
		if (session.payment_status === "paid") {
			return NextResponse.json({
				status: 0, // Success
				message: "Payment verified successfully",
				data: {
					sessionId: session.id,
					paymentStatus: session.payment_status,
					paymentType: session.metadata?.paymentType || "couple",
					metadata: session.metadata,
				},
			});
		} else {
			return NextResponse.json({
				status: 1, // Payment not completed
				message: "Payment not completed",
				data: {
					sessionId: session.id,
					paymentStatus: session.payment_status,
				},
			});
		}
	} catch (error) {
		console.error("Error verifying couple payment:", error);
		return NextResponse.json(
			{
				status: 2, // Error
				error: "Error verifying payment",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}
