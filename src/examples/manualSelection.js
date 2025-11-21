/**
 * Manual Region Selection Example
 * How to add the region selector to your price page
 */

import { useRegionDetection, RegionSelector } from "@/hooks/useRegionDetection";

export default function YourPricePage() {
	const { region, changeRegion, formatPriceForRegion, isLoading } =
		useRegionDetection();

	if (isLoading) {
		return <div>🌍 Detecting region...</div>;
	}

	return (
		<div>
			{/* Add this selector anywhere on your page */}
			<div className="flex items-center space-x-3 mb-6">
				<span className="font-medium">Select Region:</span>
				<RegionSelector
					currentRegion={region}
					onRegionChange={changeRegion}
					className="border-2 border-gray-300 rounded-lg px-3 py-2 bg-white hover:border-green-500 transition"
				/>
			</div>

			{/* Your existing price content */}
			<div className="text-center">
				<h2>Price: {formatPriceForRegion(888)}</h2>
			</div>
		</div>
	);
}
