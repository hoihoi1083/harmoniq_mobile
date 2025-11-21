/**
 * Price Page Integration Example
 * Shows how to use region detection in your pricing page
 */

// Add these imports to your price page:
import { useRegionDetection, RegionSelector } from "@/hooks/useRegionDetection";

// Example of how to modify your price page component:
export default function PricePage() {
	// Add region detection hook
	const {
		region,
		regionConfig,
		isLoading,
		changeRegion,
		formatPriceForRegion,
		getStripePriceId,
		currency,
		symbol,
		flag,
	} = useRegionDetection();

	// Your existing code...
	const t = useTranslations();

	// Show loading state while detecting region
	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
					<p>🌍 Detecting your region...</p>
				</div>
			</div>
		);
	}

	// Handle payment with dynamic price ID
	const handlePayment = async (plan = "basic") => {
		const priceId = getStripePriceId(plan);

		if (!priceId) {
			console.error("No Stripe price ID found for:", plan, region);
			return;
		}

		console.log("💳 Processing payment:", {
			plan,
			region,
			currency,
			priceId,
		});

		// Your Stripe checkout code here...
		const response = await fetch("/api/create-checkout", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				priceId: priceId,
				currency: currency,
				region: region,
			}),
		});

		// Handle checkout response...
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Region Selector (optional - for manual override) */}
			<div className="container mx-auto px-4 py-4">
				<div className="flex justify-end">
					<div className="flex items-center space-x-2">
						<span className="text-sm text-gray-600">Region:</span>
						<RegionSelector
							currentRegion={region}
							onRegionChange={changeRegion}
							className="text-sm"
						/>
					</div>
				</div>
			</div>

			{/* Your existing hero section... */}

			{/* Price Cards Section */}
			<div className="container mx-auto px-4">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold mb-2">
						{flag} Pricing for {regionConfig?.name}
					</h2>
					<p className="text-gray-600">
						Prices in {currency} ({symbol})
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
					{/* Basic Plan Card */}
					<div className="bg-white rounded-lg shadow-lg p-8">
						<h3 className="text-xl font-bold mb-4">Basic Plan</h3>

						{/* Dynamic price display */}
						<div className="text-4xl font-bold text-green-600 mb-6">
							{formatPriceForRegion(
								regionConfig?.prices?.basic || 888
							)}
						</div>

						<button
							onClick={() => handlePayment("basic")}
							className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
						>
							Get Started with {symbol}
							{regionConfig?.prices?.basic || 888}
						</button>
					</div>

					{/* Premium Plan Card */}
					<div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
						<h3 className="text-xl font-bold mb-4">Premium Plan</h3>

						{/* Dynamic price display */}
						<div className="text-4xl font-bold text-green-600 mb-6">
							{formatPriceForRegion(
								regionConfig?.prices?.premium || 1588
							)}
						</div>

						<button
							onClick={() => handlePayment("premium")}
							className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
						>
							Get Premium for {symbol}
							{regionConfig?.prices?.premium || 1588}
						</button>
					</div>
				</div>
			</div>

			{/* Debug info (remove in production) */}
			{process.env.NODE_ENV === "development" && (
				<div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-sm">
					<div>Region: {region}</div>
					<div>Currency: {currency}</div>
					<div>Basic Price ID: {getStripePriceId("basic")}</div>
					<div>Premium Price ID: {getStripePriceId("premium")}</div>
				</div>
			)}
		</div>
	);
}

// Don't forget to update your Stripe API route to handle the region parameter:
/*
// In your /api/create-checkout route:
export async function POST(request) {
  const { priceId, currency, region } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId, // Dynamic price ID based on region
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${request.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.headers.origin}/price`,
    metadata: {
      region: region, // Store region for analytics
    },
  });

  return NextResponse.json({ sessionId: session.id });
}
*/
