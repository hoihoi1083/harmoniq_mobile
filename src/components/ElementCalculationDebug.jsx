// Element Calculation Debug Component
"use client";

import { useState, useEffect } from "react";
import { EnhancedInitialAnalysis } from "@/lib/enhancedInitialAnalysis";
import getWuxingData from "@/lib/nayin";

const ElementCalculationDebug = () => {
	const [results, setResults] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const runComparison = async () => {
			const testCases = [
				{
					name: "男方",
					birthDateTime: "1996-06-03",
					gender: "male",
				},
				{
					name: "女方",
					birthDateTime: "1999-09-03",
					gender: "female",
				},
			];

			const comparisonResults = [];

			for (const testCase of testCases) {
				console.log(
					`\n📊 Testing ${testCase.name} (${testCase.birthDateTime})`
				);

				let enhancedResult = null;
				let nayinResult = null;

				// Method 1: EnhancedInitialAnalysis (used by AI)
				try {
					const analyzer = new EnhancedInitialAnalysis();
					enhancedResult = await analyzer.calculateBazi(
						testCase.birthDateTime,
						testCase.gender
					);
					console.log("🤖 Enhanced Analysis Result:", enhancedResult);
				} catch (error) {
					console.log("❌ Enhanced Analysis Error:", error.message);
				}

				// Method 2: nayin.js getWuxingData (used by annual analysis)
				try {
					// Add default time if not present
					const birthWithTime = testCase.birthDateTime.includes("T")
						? testCase.birthDateTime
						: `${testCase.birthDateTime}T12:00:00`;

					nayinResult = getWuxingData(birthWithTime, testCase.gender);
					console.log("📊 Nayin Analysis Result:", nayinResult);
				} catch (error) {
					console.log("❌ Nayin Analysis Error:", error.message);
				}

				comparisonResults.push({
					testCase,
					enhancedResult,
					nayinResult,
				});
			}

			setResults(comparisonResults);
			setLoading(false);
		};

		runComparison();
	}, []);

	if (loading) {
		return (
			<div className="p-4">Loading element calculation comparison...</div>
		);
	}

	return (
		<div className="max-w-4xl p-6 mx-auto">
			<h1 className="mb-6 text-2xl font-bold">
				Element Calculation Debug Results
			</h1>

			{results?.map((result, index) => (
				<div
					key={index}
					className="p-4 mb-8 border rounded-lg bg-gray-50"
				>
					<h2 className="mb-4 text-xl font-semibold">
						{result.testCase.name} ({result.testCase.birthDateTime})
					</h2>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{/* Enhanced Analysis Results */}
						<div className="p-3 rounded bg-blue-50">
							<h3 className="mb-2 font-medium text-blue-800">
								Enhanced Analysis (AI)
							</h3>
							{result.enhancedResult ? (
								<div className="space-y-1 text-sm">
									<div>
										Day Stem:{" "}
										{result.enhancedResult.dayStem || "N/A"}
									</div>
									<div>
										Day Element:{" "}
										{result.enhancedResult.dayStemWuxing ||
											"N/A"}
									</div>
									<div>
										Hour Pillar:{" "}
										{result.enhancedResult.hourPillar ||
											"N/A"}
									</div>
									<div>
										Nayin:{" "}
										{result.enhancedResult.nayin || "N/A"}
									</div>
								</div>
							) : (
								<div className="text-red-500">
									Failed to calculate
								</div>
							)}
						</div>

						{/* Nayin Analysis Results */}
						<div className="p-3 rounded bg-green-50">
							<h3 className="mb-2 font-medium text-green-800">
								Nayin Analysis (Annual)
							</h3>
							{result.nayinResult ? (
								<div className="space-y-1 text-sm">
									<div>
										Day Stem:{" "}
										{result.nayinResult.dayStem || "N/A"}
									</div>
									<div>
										Day Element:{" "}
										{result.nayinResult.dayStemWuxing ||
											"N/A"}
									</div>
									<div>
										Hour: {result.nayinResult.hour || "N/A"}
									</div>
									<div>
										Year Nayin:{" "}
										{result.nayinResult.yearNayin || "N/A"}
									</div>
									<div>
										Year Element:{" "}
										{result.nayinResult.yearNayinWuxing ||
											"N/A"}
									</div>
								</div>
							) : (
								<div className="text-red-500">
									Failed to calculate
								</div>
							)}
						</div>
					</div>

					{/* Comparison */}
					<div className="p-3 mt-4 rounded bg-yellow-50">
						<h3 className="mb-2 font-medium text-yellow-800">
							Comparison
						</h3>
						<div className="text-sm">
							{result.enhancedResult && result.nayinResult ? (
								<div>
									<div>
										Day Stem Match:{" "}
										{result.enhancedResult.dayStem ===
										result.nayinResult.dayStem
											? "✅ Yes"
											: "❌ No"}
									</div>
									<div>
										Day Element Match:{" "}
										{result.enhancedResult.dayStemWuxing ===
										result.nayinResult.dayStemWuxing
											? "✅ Yes"
											: "❌ No"}
									</div>
								</div>
							) : (
								<div>
									Unable to compare due to calculation errors
								</div>
							)}
						</div>
					</div>
				</div>
			))}

			<div className="p-4 mt-6 bg-gray-100 rounded">
				<h3 className="mb-2 font-medium">Analysis Summary</h3>
				<ul className="space-y-1 text-sm">
					<li>
						• Enhanced Analysis: Uses BaziCalculator with hardcoded
						hour pillar 戊辰
					</li>
					<li>
						• Nayin Analysis: Uses lunisolar library with actual
						timestamp hour
					</li>
					<li>
						• Element difference likely due to different hour
						calculations affecting pillars
					</li>
					<li>
						• Check browser console for detailed calculation logs
					</li>
				</ul>
			</div>
		</div>
	);
};

export default ElementCalculationDebug;
