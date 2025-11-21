"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TestHistoricalPage() {
	const [testResults, setTestResults] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedReport, setSelectedReport] = useState(null);

	// Test data structure validation
	const validateReportData = (data) => {
		const checks = [];

		// Check if main structure exists
		checks.push({
			test: "Main Structure",
			passed: !!(data && data._id),
			details: data ? "Report data loaded" : "No report data",
		});

		// Check fourFortuneData
		checks.push({
			test: "Four Fortune Data",
			passed: !!data?.fourFortuneData,
			details: data?.fourFortuneData
				? "Four fortune data exists"
				: "Missing four fortune data",
		});

		// Check individual fortune analyses
		const fortunes = [
			"healthFortuneData",
			"careerFortuneData",
			"wealthFortuneData",
			"relationshipFortuneData",
		];
		fortunes.forEach((fortune) => {
			const fortuneData = data?.fourFortuneData?.[fortune];
			checks.push({
				test: `${fortune} Analysis`,
				passed: !!fortuneData?.analysis,
				details: fortuneData?.analysis
					? `${fortune} analysis exists`
					: `Missing ${fortune} analysis`,
			});
		});

		// Check AI generated content
		checks.push({
			test: "AI Generated Content",
			passed: !!data?.aiGeneratedContent?.fourFortuneAI,
			details: data?.aiGeneratedContent?.fourFortuneAI
				? "AI content exists"
				: "Missing AI content",
		});

		// Check wuxing analysis
		checks.push({
			test: "Wuxing Analysis",
			passed: !!data?.aiGeneratedContent?.wuxingAnalysis,
			details: data?.aiGeneratedContent?.wuxingAnalysis
				? "Wuxing analysis exists"
				: "Missing wuxing analysis",
		});

		return checks;
	};

	// Test API endpoint
	const testAPIEndpoint = async () => {
		setIsLoading(true);
		const results = [];

		try {
			// Test 1: Fetch life history
			console.log("🧪 Testing API endpoint...");
			const response = await fetch(
				"/api/reports/life-history?userEmail=hoihoi1083@gmail.com"
			);
			const data = await response.json();

			results.push({
				test: "API Response",
				passed: response.ok,
				details: response.ok
					? `Got ${data.data?.reports?.length || 0} reports`
					: `Error: ${response.status}`,
			});

			if (data.data?.reports?.length > 0) {
				const report = data.data.reports[0];
				setSelectedReport(report);

				// Validate the report structure
				const validationResults = validateReportData(report);
				results.push(...validationResults);
			}
		} catch (error) {
			results.push({
				test: "API Error",
				passed: false,
				details: error.message,
			});
		}

		setTestResults(results);
		setIsLoading(false);
	};

	// Test component data loading simulation
	const simulateComponentLoading = () => {
		if (!selectedReport) {
			alert("Please run API test first to load report data");
			return;
		}

		const fortuneData =
			selectedReport.fourFortuneData ||
			selectedReport.aiGeneratedContent?.fourFortuneAI;

		console.log("🔍 Testing component data loading simulation:");
		console.log("Health Data:", fortuneData?.healthFortuneData?.analysis);
		console.log("Career Data:", fortuneData?.careerFortuneData?.analysis);
		console.log("Wealth Data:", fortuneData?.wealthFortuneData?.analysis);
		console.log(
			"Relationship Data:",
			fortuneData?.relationshipFortuneData?.analysis
		);

		const componentTests = [
			{
				component: "HealthFortuneAnalysis",
				data: fortuneData?.healthFortuneData?.analysis,
				passed: !!fortuneData?.healthFortuneData?.analysis,
			},
			{
				component: "CareerFortuneAnalysis",
				data: fortuneData?.careerFortuneData?.analysis,
				passed: !!fortuneData?.careerFortuneData?.analysis,
			},
			{
				component: "WealthFortuneAnalysis",
				data: fortuneData?.wealthFortuneData?.analysis,
				passed: !!fortuneData?.wealthFortuneData?.analysis,
			},
			{
				component: "RelationshipFortuneAnalysis",
				data: fortuneData?.relationshipFortuneData?.analysis,
				passed: !!fortuneData?.relationshipFortuneData?.analysis,
			},
		];

		const additionalResults = componentTests.map((test) => ({
			test: `${test.component} Data Loading`,
			passed: test.passed,
			details: test.passed
				? `✅ ${test.component} has analysis data`
				: `❌ ${test.component} missing analysis data`,
		}));

		setTestResults((prev) => [...prev, ...additionalResults]);
	};

	return (
		<div className="container max-w-4xl p-6 mx-auto">
			<div className="mb-6">
				<h1 className="mb-2 text-3xl font-bold">
					Historical Report Data Test
				</h1>
				<p className="text-gray-600">
					Testing historical report loading functionality
				</p>
			</div>

			<div className="grid gap-6">
				{/* Test Controls */}
				<Card>
					<CardHeader>
						<CardTitle>Test Controls</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-4">
							<Button
								onClick={testAPIEndpoint}
								disabled={isLoading}
								className="flex-1"
							>
								{isLoading
									? "Testing..."
									: "Test API & Data Structure"}
							</Button>
							<Button
								onClick={simulateComponentLoading}
								variant="outline"
								className="flex-1"
								disabled={!selectedReport}
							>
								Simulate Component Loading
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Test Results */}
				{testResults.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Test Results</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{testResults.map((result, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 border rounded"
									>
										<div className="flex items-center gap-3">
											<Badge
												variant={
													result.passed
														? "default"
														: "destructive"
												}
											>
												{result.passed
													? "✅ PASS"
													: "❌ FAIL"}
											</Badge>
											<span className="font-medium">
												{result.test}
											</span>
										</div>
										<span className="text-sm text-gray-600">
											{result.details}
										</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Selected Report Preview */}
				{selectedReport && (
					<Card>
						<CardHeader>
							<CardTitle>
								Selected Report Data Structure
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="p-4 overflow-y-auto rounded bg-gray-50 max-h-96">
								<pre className="text-xs">
									{JSON.stringify(selectedReport, null, 2)}
								</pre>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Historical URL Test */}
				<Card>
					<CardHeader>
						<CardTitle>Historical URL Test</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-sm text-gray-600">
							Test the actual historical report page with the
							saved data
						</p>
						{selectedReport && (
							<div className="space-y-2">
								<p className="text-sm">
									<strong>Report ID:</strong>{" "}
									{selectedReport._id}
								</p>
								<Button
									onClick={() => {
										const url = `/report?showHistorical=true&reportId=${selectedReport._id}`;
										window.open(url, "_blank");
									}}
									className="w-full"
								>
									Open Historical Report in New Tab
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
