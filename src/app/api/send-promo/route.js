// pages/api/send-promo.js


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	const { email, contentShared } = await request.json(); // Get user's email and shared content

	// Example logic for generating a promotion code
	const promoCode = "HARMONIQ"; // You can generate this dynamically based on your needs

	// Log the shared content for tracking (optional)
	console.log(`User shared: "${contentShared}"`);

	// Respond with the promotion code
	return Response.json({
		message: "Promotion code sent!",
		code: promoCode,
		content: contentShared,
	});
}
