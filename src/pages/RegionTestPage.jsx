/**
 * Region Detection Test Page
 * Comprehensive testing interface for region detection
 */

import { useState, useEffect } from "react";
import { useRegionDetection, RegionSelector } from "@/hooks/useRegionDetection";
import { getUserRegion, clearRegionPreference } from "@/utils/regionDetection";
import { getAllRegions } from "@/config/regions";

export default function RegionTestPage() {
	const [testResults, setTestResults] = useState([]);
	const [isTestRunning, setIsTestRunning] = useState(false);
	const {
		region,
		regionConfig,
		changeRegion,
		formatPriceForRegion,
		isLoading,
	} = useRegionDetection();

	const addTestResult = (test, result, status) => {
		setTestResults((prev) => [
			...prev,
			{ test, result, status, time: new Date().toLocaleTimeString() },
		]);
	};

	const runFullTest = async () => {
		setIsTestRunning(true);
		setTestResults([]);

		try {
			// Test 1: Clear preferences and detect region
			addTestResult(
				"Clear Preferences",
				"Clearing stored preferences...",
				"running"
			);
			clearRegionPreference();
			addTestResult(
				"Clear Preferences",
				"Preferences cleared",
				"success"
			);

			// Test 2: Fresh detection
			addTestResult(
				"Fresh Detection",
				"Detecting region from IP...",
				"running"
			);
			const detectedRegion = await getUserRegion();
			addTestResult(
				"Fresh Detection",
				`Detected: ${detectedRegion}`,
				"success"
			);

			// Test 3: Test all regions
			const allRegions = getAllRegions();
			for (const region of allRegions) {
				addTestResult(
					`Test ${region.name}`,
					`Price: ${formatPriceForRegion(888, region.key)}`,
					"success"
				);
			}

			// Test 4: Manual selection
			addTestResult(
				"Manual Selection",
				"Testing manual region change...",
				"running"
			);
			changeRegion("china");
			setTimeout(() => {
				addTestResult(
					"Manual Selection",
					"Changed to China successfully",
					"success"
				);
			}, 500);
		} catch (error) {
			addTestResult("Test Failed", error.message, "error");
		} finally {
			setIsTestRunning(false);
		}
	};

	// Mock different locations for testing
	const mockLocation = async (country) => {
		// Override fetch for testing
		const originalFetch = window.fetch;
		window.fetch = async (url) => {
			if (url.includes("ipapi.co")) {
				return {
					ok: true,
					json: async () => ({
						country_code: country,
						country_name: country === "CN" ? "China" : "Hong Kong",
						city: country === "CN" ? "Beijing" : "Hong Kong",
					}),
				};
			}
			return originalFetch(url);
		};

		// Clear preferences and detect
		clearRegionPreference();
		const region = await getUserRegion();

		// Restore original fetch
		window.fetch = originalFetch;

		addTestResult(
			`Mock ${country}`,
			`Simulated ${country} → detected: ${region}`,
			"success"
		);
		return region;
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
					<p>🌍 Loading region detection...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8">
					🧪 Region Detection Test Suite
				</h1>

				{/* Current Status */}
				<div className="bg-white rounded-lg shadow p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">
						📍 Current Status
					</h2>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p>
								<strong>Detected Region:</strong>{" "}
								{regionConfig?.flag} {regionConfig?.name}
							</p>
							<p>
								<strong>Currency:</strong>{" "}
								{regionConfig?.currency} ({regionConfig?.symbol}
								)
							</p>
							<p>
								<strong>Sample Price:</strong>{" "}
								{formatPriceForRegion(888)}
							</p>
						</div>
						<div>
							<p>
								<strong>Locale:</strong> {regionConfig?.locale}
							</p>
							<p>
								<strong>Payment Methods:</strong>{" "}
								{regionConfig?.paymentMethods?.join(", ")}
							</p>
						</div>
					</div>
				</div>

				{/* Manual Selection */}
				<div className="bg-white rounded-lg shadow p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">
						🎛️ Manual Selection
					</h2>
					<div className="flex items-center space-x-4">
						<label className="font-medium">Select Region:</label>
						<RegionSelector
							currentRegion={region}
							onRegionChange={changeRegion}
							className="border-2 border-gray-300 rounded px-3 py-2 bg-white hover:border-green-500"
						/>
						<span className="text-gray-600">
							Current: {regionConfig?.flag} {regionConfig?.name}
						</span>
					</div>
				</div>

				{/* Test Controls */}
				<div className="bg-white rounded-lg shadow p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">
						🚀 Test Controls
					</h2>
					<div className="space-y-4">
						<div className="flex space-x-4">
							<button
								onClick={runFullTest}
								disabled={isTestRunning}
								className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
							>
								{isTestRunning
									? "🔄 Running Tests..."
									: "🧪 Run Full Test Suite"}
							</button>
							<button
								onClick={() => mockLocation("CN")}
								className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
							>
								🇨🇳 Mock China Location
							</button>
							<button
								onClick={() => mockLocation("HK")}
								className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
							>
								🇭🇰 Mock Hong Kong Location
							</button>
						</div>
						<div className="flex space-x-4">
							<button
								onClick={() => {
									clearRegionPreference();
									addTestResult(
										"Clear Storage",
										"Local storage cleared",
										"success"
									);
								}}
								className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
							>
								🗑️ Clear Local Storage
							</button>
							<button
								onClick={() => window.location.reload()}
								className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
							>
								🔄 Refresh Page
							</button>
						</div>
					</div>
				</div>

				{/* Test Results */}
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-4">
						📊 Test Results
					</h2>
					{testResults.length === 0 ? (
						<p className="text-gray-500">
							No tests run yet. Click "Run Full Test Suite" to
							start.
						</p>
					) : (
						<div className="space-y-2">
							{testResults.map((result, index) => (
								<div
									key={index}
									className={`p-3 rounded flex justify-between items-center ${
										result.status === "success"
											? "bg-green-100 text-green-800"
											: result.status === "error"
												? "bg-red-100 text-red-800"
												: "bg-yellow-100 text-yellow-800"
									}`}
								>
									<div>
										<strong>{result.test}:</strong>{" "}
										{result.result}
									</div>
									<span className="text-sm">
										{result.time}
									</span>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Debug Info */}
				<div className="mt-6 bg-gray-100 rounded-lg p-4">
					<h3 className="font-semibold mb-2">🔧 Debug Info</h3>
					<div className="text-sm font-mono">
						<p>Browser Language: {navigator.language}</p>
						<p>All Languages: {navigator.languages?.join(", ")}</p>
						<p>User Agent: {navigator.userAgent}</p>
						<p>
							Local Storage:{" "}
							{localStorage.getItem("userRegion") || "None"}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
