"use client";

import { useState, useEffect } from "react";
import { event } from "@/components/GoogleAnalytics";

interface TestResult {
	message: string;
	type: string;
	timestamp: string;
	id: number;
}

declare global {
	interface Window {
		gtag: (...args: any[]) => void;
	}
}

export default function GATestPage() {
	const [testResults, setTestResults] = useState<TestResult[]>([]);
	const [isGALoaded, setIsGALoaded] = useState(false);
	const [gaTrackingId, setGaTrackingId] = useState("");

	useEffect(() => {
		// Check if GA is loaded
		const checkGA = () => {
			if (
				typeof window !== "undefined" &&
				typeof window.gtag === "function"
			) {
				setIsGALoaded(true);
				setGaTrackingId(process.env.NEXT_PUBLIC_GA_ID || "Not found");
				addTestResult(
					"✅ Google Analytics loaded successfully",
					"success"
				);
			} else {
				setIsGALoaded(false);
				addTestResult("❌ Google Analytics not loaded", "error");
			}
		};

		// Check immediately and retry
		checkGA();
		const interval = setInterval(() => {
			if (!isGALoaded) checkGA();
		}, 1000);

		// Cleanup
		return () => clearInterval(interval);
	}, [isGALoaded]);

	const addTestResult = (message, type = "info") => {
		const timestamp = new Date().toLocaleTimeString();
		setTestResults((prev) => [
			...prev,
			{
				message,
				type,
				timestamp,
				id: Date.now() + Math.random(),
			},
		]);
	};

	// Test Functions
	const testPageView = () => {
		if (window.gtag) {
			window.gtag("event", "page_view", {
				page_title: "GA Test Page",
				page_location: window.location.href,
				page_path: "/zh-TW/ga-test",
				custom_page_name: "Google Analytics Test Page",
			});
			addTestResult("📄 Page view tracked", "success");
		} else {
			addTestResult("❌ Cannot track page view - GA not loaded", "error");
		}
	};

	const testButtonClick = () => {
		event({
			action: "button_click",
			category: "Test_Interaction",
			label: "GA Test Button",
			value: 1,
		});
		addTestResult("🔘 Button click tracked", "success");
	};

	const testFormInteraction = () => {
		event({
			action: "form_interaction",
			category: "Form_Test",
			label: "Test Form Field",
			value: 1,
		});
		addTestResult("📝 Form interaction tracked", "success");
	};

	const testFengShuiAnalysis = () => {
		event({
			action: "feng_shui_analysis_test",
			category: "FengShui_Analysis",
			label: "Individual Analysis Test",
			value: 1,
		});
		addTestResult("🎯 Feng Shui analysis tracked", "success");
	};

	const testCoupleAnalysis = () => {
		event({
			action: "couple_analysis_test",
			category: "FengShui_Analysis",
			label: "Couple Analysis Test",
			value: 1,
		});
		addTestResult("💑 Couple analysis tracked", "success");
	};

	const testEcommerce = () => {
		if (window.gtag) {
			window.gtag("event", "purchase", {
				transaction_id: "test_" + Date.now(),
				value: 42.0,
				currency: "HKD",
				items: [
					{
						item_id: "test_feng_shui_report",
						item_name: "Test Feng Shui Report",
						category: "Digital_Product",
						quantity: 1,
						price: 42.0,
					},
				],
			});
			addTestResult("💰 E-commerce purchase tracked", "success");
		}
	};

	const testUserEngagement = () => {
		event({
			action: "user_engagement_test",
			category: "Engagement",
			label: "High Engagement User",
			value: 1,
		});
		addTestResult("👤 User engagement tracked", "success");
	};

	const testLanguageSwitch = () => {
		event({
			action: "language_switch_test",
			category: "User_Preference",
			label: "zh-TW to zh-CN",
			value: 1,
		});
		addTestResult("🌐 Language switch tracked", "success");
	};

	const testErrorTracking = () => {
		event({
			action: "test_error",
			category: "Error_Test",
			label: "Simulated JavaScript Error",
			value: 1,
		});
		addTestResult("⚠️ Error tracking tested", "success");
	};

	const testCustomDimensions = () => {
		if (window.gtag) {
			window.gtag("event", "custom_test", {
				event_category: "Custom_Tracking",
				user_type: "test_user",
				feature_used: "ga_test_page",
				session_quality: "high_engagement",
				user_language: navigator.language,
				device_type: /Mobile|Android|iPhone|iPad/.test(
					navigator.userAgent
				)
					? "mobile"
					: "desktop",
				page_path: window.location.pathname,
			});
			addTestResult("📊 Custom dimensions tracked", "success");
		}
	};

	const runAllTests = async () => {
		setTestResults([]);
		addTestResult("🚀 Starting comprehensive GA test suite...", "info");

		const tests = [
			{ name: "Page View", func: testPageView, delay: 500 },
			{ name: "Button Click", func: testButtonClick, delay: 500 },
			{ name: "Form Interaction", func: testFormInteraction, delay: 500 },
			{
				name: "Feng Shui Analysis",
				func: testFengShuiAnalysis,
				delay: 500,
			},
			{ name: "Couple Analysis", func: testCoupleAnalysis, delay: 500 },
			{ name: "E-commerce", func: testEcommerce, delay: 500 },
			{ name: "User Engagement", func: testUserEngagement, delay: 500 },
			{ name: "Language Switch", func: testLanguageSwitch, delay: 500 },
			{ name: "Error Tracking", func: testErrorTracking, delay: 500 },
			{
				name: "Custom Dimensions",
				func: testCustomDimensions,
				delay: 500,
			},
		];

		for (let i = 0; i < tests.length; i++) {
			const test = tests[i];
			setTimeout(() => {
				addTestResult(`Testing ${test.name}...`, "info");
				test.func();
			}, i * test.delay);
		}

		setTimeout(
			() => {
				addTestResult(
					"✅ All tests completed! Check your GA Real-time reports.",
					"success"
				);
			},
			tests.length * 500 + 1000
		);
	};

	const clearResults = () => {
		setTestResults([]);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-6">
						🔬 Google Analytics Test Suite
					</h1>

					{/* GA Status */}
					<div className="mb-8 p-4 rounded-lg bg-gray-100">
						<h2 className="text-xl font-semibold mb-3">
							📊 GA Status
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center space-x-2">
								<span
									className={`w-3 h-3 rounded-full ${isGALoaded ? "bg-green-500" : "bg-red-500"}`}
								></span>
								<span>
									GA Loaded: {isGALoaded ? "Yes" : "No"}
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<span>Tracking ID: {gaTrackingId}</span>
							</div>
						</div>
					</div>

					{/* Test Controls */}
					<div className="mb-8">
						<h2 className="text-xl font-semibold mb-4">
							🎮 Test Controls
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
							<button
								onClick={runAllTests}
								className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
							>
								🚀 Run All Tests
							</button>
							<button
								onClick={testPageView}
								className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
							>
								📄 Page View
							</button>
							<button
								onClick={testButtonClick}
								className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
							>
								🔘 Button Click
							</button>
							<button
								onClick={testFormInteraction}
								className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
							>
								📝 Form Test
							</button>
							<button
								onClick={testFengShuiAnalysis}
								className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
							>
								🎯 Feng Shui
							</button>
							<button
								onClick={testCoupleAnalysis}
								className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors"
							>
								💑 Couple Test
							</button>
							<button
								onClick={testEcommerce}
								className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
							>
								💰 E-commerce
							</button>
							<button
								onClick={testUserEngagement}
								className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
							>
								👤 Engagement
							</button>
							<button
								onClick={testLanguageSwitch}
								className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
							>
								🌐 Language
							</button>
							<button
								onClick={testErrorTracking}
								className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
							>
								⚠️ Error Test
							</button>
							<button
								onClick={testCustomDimensions}
								className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
							>
								📊 Custom Data
							</button>
							<button
								onClick={clearResults}
								className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
							>
								🗑️ Clear Results
							</button>
						</div>
					</div>

					{/* Test Results */}
					<div className="mb-8">
						<h2 className="text-xl font-semibold mb-4">
							📋 Test Results
						</h2>
						<div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
							{testResults.length === 0 ? (
								<div className="text-gray-500">
									No tests run yet. Click a test button to
									start!
								</div>
							) : (
								testResults.map((result) => (
									<div
										key={result.id}
										className={`mb-1 ${
											result.type === "error"
												? "text-red-400"
												: result.type === "success"
													? "text-green-400"
													: "text-yellow-400"
										}`}
									>
										[{result.timestamp}] {result.message}
									</div>
								))
							)}
						</div>
					</div>

					{/* What You Can Track */}
					<div className="mb-8">
						<h2 className="text-xl font-semibold mb-4">
							📈 What You Can Track
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-blue-50 p-4 rounded-lg">
								<h3 className="font-semibold text-blue-800 mb-2">
									📊 User Behavior
								</h3>
								<ul className="text-sm text-blue-700 space-y-1">
									<li>• Page views and navigation</li>
									<li>• Button clicks and interactions</li>
									<li>• Form submissions and abandonment</li>
									<li>• Scroll depth and time on page</li>
									<li>• Language switching patterns</li>
									<li>• Device and browser usage</li>
								</ul>
							</div>
							<div className="bg-green-50 p-4 rounded-lg">
								<h3 className="font-semibold text-green-800 mb-2">
									🎯 Feng Shui Specific
								</h3>
								<ul className="text-sm text-green-700 space-y-1">
									<li>• Individual analysis requests</li>
									<li>• Couple analysis completions</li>
									<li>• Birthday form submissions</li>
									<li>
										• Chat interactions and AI responses
									</li>
									<li>• Daily limit tracking</li>
									<li>• Report generations and downloads</li>
								</ul>
							</div>
							<div className="bg-purple-50 p-4 rounded-lg">
								<h3 className="font-semibold text-purple-800 mb-2">
									💰 E-commerce
								</h3>
								<ul className="text-sm text-purple-700 space-y-1">
									<li>• Purchase events and revenue</li>
									<li>• Payment flow interactions</li>
									<li>• Product performance tracking</li>
									<li>• Conversion funnel analysis</li>
									<li>• Cart abandonment tracking</li>
									<li>• Customer lifetime value</li>
								</ul>
							</div>
							<div className="bg-orange-50 p-4 rounded-lg">
								<h3 className="font-semibold text-orange-800 mb-2">
									🌍 Acquisition
								</h3>
								<ul className="text-sm text-orange-700 space-y-1">
									<li>
										• Traffic sources (Google, social,
										direct)
									</li>
									<li>
										• Campaign performance (UTM tracking)
									</li>
									<li>• Geographic user distribution</li>
									<li>• Referral website analysis</li>
									<li>• Mobile vs desktop behavior</li>
									<li>• Search keyword performance</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Instructions */}
					<div className="bg-yellow-50 p-6 rounded-lg">
						<h2 className="text-xl font-semibold text-yellow-800 mb-4">
							📋 How to Verify Results
						</h2>
						<div className="space-y-3 text-yellow-700">
							<p>
								<strong>1. Open Google Analytics:</strong> Go to
								analytics.google.com
							</p>
							<p>
								<strong>2. Check Real-time Reports:</strong>{" "}
								Reports → Real-time → Overview
							</p>
							<p>
								<strong>3. Look for Events:</strong> You should
								see events appearing as you click the test
								buttons
							</p>
							<p>
								<strong>4. Check Custom Events:</strong> Reports
								→ Engagement → Events
							</p>
							<p>
								<strong>5. Monitor for 5-10 minutes:</strong>{" "}
								Some events may take a few minutes to appear
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
