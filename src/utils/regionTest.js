/**
 * Region Detection Test
 * Simple test to verify region detection and configuration
 */

import {
	getUserRegion,
	detectRegionFromLanguage,
	saveRegionPreference,
	clearRegionPreference,
} from "../utils/regionDetection.js";
import {
	getRegionConfig,
	formatPrice,
	getAllRegions,
} from "../config/regions.js";

// Test function
async function testRegionDetection() {
	console.log("🧪 Starting Region Detection Tests...\n");

	// Test 1: Basic region detection
	console.log("📍 Test 1: Basic Region Detection");
	const region = await getUserRegion();
	console.log("Detected region:", region);
	console.log("✅ Basic detection test completed\n");

	// Test 2: Region configuration
	console.log("⚙️ Test 2: Region Configuration");
	const config = getRegionConfig(region);
	console.log("Region config:", config);
	console.log("✅ Configuration test completed\n");

	// Test 3: Price formatting
	console.log("💰 Test 3: Price Formatting");
	console.log("China:", formatPrice(688, "china"));
	console.log("Hong Kong:", formatPrice(888, "hongkong"));
	console.log("Taiwan:", formatPrice(2888, "taiwan"));
	console.log("✅ Price formatting test completed\n");

	// Test 4: Language detection fallback
	console.log("🈸 Test 4: Language Detection");
	const langRegion = detectRegionFromLanguage();
	console.log("Language-based region:", langRegion);
	console.log("✅ Language detection test completed\n");

	// Test 5: All regions
	console.log("🌍 Test 5: All Available Regions");
	const allRegions = getAllRegions();
	allRegions.forEach((r) => {
		console.log(`${r.flag} ${r.name}: ${r.currency} (${r.code})`);
	});
	console.log("✅ All regions test completed\n");

	// Test 6: Local storage
	console.log("💾 Test 6: Local Storage");
	clearRegionPreference();
	console.log("Cleared preferences");
	saveRegionPreference("hongkong");
	console.log("Saved Hong Kong preference");
	const newRegion = await getUserRegion();
	console.log("Retrieved region:", newRegion);
	clearRegionPreference();
	console.log("Cleared preferences again");
	console.log("✅ Local storage test completed\n");

	console.log("🎉 All tests completed successfully!");

	return {
		detectedRegion: region,
		config: config,
		allRegions: allRegions,
	};
}

// Export for use in browser console or components
export { testRegionDetection };

// Auto-run if in browser environment
if (typeof window !== "undefined") {
	console.log("🌍 Region Detection Test Suite Ready!");
	console.log("Run testRegionDetection() in console to test");

	// Make available globally for easy testing
	window.testRegionDetection = testRegionDetection;
}
