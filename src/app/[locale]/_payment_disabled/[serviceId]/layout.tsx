// Generate static params for payment pages
export function generateStaticParams() {
	// Return empty array to skip generating these pages in static export
	// These pages require dynamic server-side rendering
	return [];
}

export default function PaymentServiceLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
