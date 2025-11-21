/**
 * Google Analytics Test Console Script
 *
 * Instructions:
 * 1. Open your browser's developer console (F12)
 * 2. Copy and paste this entire script
 * 3. Press Enter to run
 * 4. Check the console output and your GA Real-time reports
 */

console.log("🔬 Starting Google Analytics Test Suite...");

// Test 1: Check if GA is loaded
function testGALoaded() {
	console.log("\n📊 Test 1: Checking GA Status...");

	if (typeof window !== "undefined" && typeof window.gtag === "function") {
		console.log("✅ Google Analytics is loaded successfully");
		console.log(
			"📋 Tracking ID:",
			process.env.NEXT_PUBLIC_GA_ID || "Check .env file"
		);
		return true;
	} else {
		console.log("❌ Google Analytics is NOT loaded");
		console.log("🔍 Troubleshooting:");
		console.log("   - Check if GoogleAnalytics component is imported");
		console.log("   - Verify NEXT_PUBLIC_GA_ID in .env file");
		console.log("   - Ensure development server is restarted");
		return false;
	}
}

// Test 2: Send test events
function sendTestEvents() {
	console.log("\n🎯 Test 2: Sending Test Events...");

	if (!window.gtag) {
		console.log("❌ Cannot send events - GA not loaded");
		return;
	}

	// Test basic event
	window.gtag("event", "ga_console_test", {
		event_category: "Console_Test",
		event_label: "Basic Event Test",
		value: 1,
	});
	console.log("📤 Sent: Basic event test");

	// Test page view
	window.gtag("event", "page_view", {
		page_title: "Console Test Page",
		page_location: window.location.href,
		page_path: window.location.pathname,
		custom_page_name: "GA Console Test",
	});
	console.log("📤 Sent: Page view test");

	// Test Feng Shui specific event
	window.gtag("event", "feng_shui_console_test", {
		event_category: "FengShui_Analysis",
		analysis_type: "console_test",
		user_language: navigator.language,
		test_timestamp: new Date().toISOString(),
	});
	console.log("📤 Sent: Feng Shui analysis test");

	// Test ecommerce event
	window.gtag("event", "purchase", {
		transaction_id: "console_test_" + Date.now(),
		value: 99.99,
		currency: "HKD",
		items: [
			{
				item_id: "console_test_product",
				item_name: "Console Test Product",
				category: "Test_Products",
				quantity: 1,
				price: 99.99,
			},
		],
	});
	console.log("📤 Sent: E-commerce purchase test");

	console.log("\n✅ All test events sent successfully!");
}

// Test 3: Check current page data
function checkPageData() {
	console.log("\n📄 Test 3: Current Page Data...");
	console.log("🌐 URL:", window.location.href);
	console.log("📍 Path:", window.location.pathname);
	console.log("🎯 Hash:", window.location.hash);
	console.log("🔤 Language:", navigator.language);
	console.log("📱 User Agent:", navigator.userAgent);
	console.log("📺 Screen:", screen.width + "x" + screen.height);
	console.log("🖥️ Viewport:", window.innerWidth + "x" + window.innerHeight);
}

// Test 4: Monitor GA events (development only)
function monitorGAEvents() {
	console.log("\n👂 Test 4: Setting up GA Event Monitor...");

	// Override the original gtag function to log events
	if (window.gtag) {
		const originalGtag = window.gtag;
		window.gtag = function (...args) {
			console.log("📊 GA Event:", args);
			return originalGtag.apply(this, args);
		};
		console.log("✅ GA event monitoring activated");
		console.log("📝 All GA events will now be logged to console");
	} else {
		console.log("❌ Cannot set up monitoring - GA not loaded");
	}
}

// Test 5: Performance check
function performanceCheck() {
	console.log("\n⚡ Test 5: Performance Check...");

	const timing = performance.timing;
	const loadTime = timing.loadEventEnd - timing.navigationStart;
	const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

	console.log("🚀 Page Load Time:", loadTime + "ms");
	console.log("📄 DOM Ready Time:", domReady + "ms");

	// Send performance data to GA
	if (window.gtag) {
		window.gtag("event", "page_performance", {
			event_category: "Performance",
			page_load_time: loadTime,
			dom_ready_time: domReady,
			page_path: window.location.pathname,
		});
		console.log("📤 Sent: Performance data to GA");
	}
}

// Run all tests
function runAllTests() {
	console.log("🚀 Running Complete GA Test Suite...");

	const gaLoaded = testGALoaded();
	checkPageData();

	if (gaLoaded) {
		sendTestEvents();
		performanceCheck();

		// Set up monitoring for future events
		setTimeout(() => {
			monitorGAEvents();
		}, 1000);

		console.log("\n✅ All tests completed!");
		console.log("📈 Check your Google Analytics Real-time reports:");
		console.log("   1. Go to analytics.google.com");
		console.log("   2. Navigate to Reports → Real-time → Overview");
		console.log("   3. Look for the test events in the event stream");
		console.log(
			"   4. Check Reports → Engagement → Events for custom events"
		);
	} else {
		console.log("\n❌ Tests incomplete - GA not loaded properly");
	}
}

// Helper function to check specific event
function testSpecificEvent(eventName, eventData = {}) {
	console.log(`\n🎯 Testing specific event: ${eventName}`);

	if (window.gtag) {
		window.gtag("event", eventName, {
			event_category: "Manual_Test",
			test_timestamp: new Date().toISOString(),
			...eventData,
		});
		console.log(`✅ Event '${eventName}' sent successfully`);
	} else {
		console.log("❌ Cannot send event - GA not loaded");
	}
}

// Export functions for manual use
window.GATest = {
	runAllTests,
	testGALoaded,
	sendTestEvents,
	checkPageData,
	monitorGAEvents,
	performanceCheck,
	testSpecificEvent,
};

// Auto-run all tests
runAllTests();

console.log("\n📖 Available functions:");
console.log("   GATest.runAllTests() - Run all tests again");
console.log(
	"   GATest.testSpecificEvent('event_name', {data}) - Test specific event"
);
console.log("   GATest.monitorGAEvents() - Enable event monitoring");
console.log("   GATest.checkPageData() - Show current page data");
