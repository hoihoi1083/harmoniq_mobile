// Quick test to verify unified element calculation
import {
	calculateUnifiedElements,
	formatElementAnalysisForAI,
} from "@/lib/unifiedElementCalculation";

export default function TestElementCalculation() {
	// Test the specific dates from the reported issue
	const testUser1 = { birthDateTime: "1996-06-03", gender: "male" };
	const testUser2 = { birthDateTime: "1999-09-03", gender: "female" };

	let user1Analysis, user2Analysis, formattedAnalysis;

	try {
		user1Analysis = calculateUnifiedElements(
			testUser1.birthDateTime,
			testUser1.gender
		);
		user2Analysis = calculateUnifiedElements(
			testUser2.birthDateTime,
			testUser2.gender
		);
		formattedAnalysis = formatElementAnalysisForAI(
			user1Analysis,
			user2Analysis
		);

		console.log("✅ Unified Element Calculation Test Results:");
		console.log("User 1 (1996-06-03 male):", user1Analysis);
		console.log("User 2 (1999-09-03 female):", user2Analysis);
		console.log("Formatted for AI:", formattedAnalysis);
	} catch (error) {
		console.error("❌ Element calculation error:", error);
	}

	return (
		<div className="max-w-4xl p-6 mx-auto bg-white">
			<h1 className="mb-6 text-2xl font-bold">
				Unified Element Calculation Test
			</h1>

			<div className="space-y-6">
				<div className="p-4 rounded-lg bg-blue-50">
					<h2 className="mb-3 text-lg font-semibold">
						Test Case: 1996-06-03 (Male) & 1999-09-03 (Female)
					</h2>

					{user1Analysis && (
						<div className="mb-4">
							<h3 className="font-medium text-blue-800">
								男方分析結果:
							</h3>
							<div className="ml-4 space-y-1 text-sm">
								<div>
									日主: {user1Analysis.dayMasterStem}
									{user1Analysis.dayMasterElement}
								</div>
								<div>
									年命: {user1Analysis.lifeNayin}(
									{user1Analysis.lifeElement}命)
								</div>
								<div>
									四柱: {user1Analysis.fourPillars.year.stem}
									{user1Analysis.fourPillars.year.branch}{" "}
									{user1Analysis.fourPillars.month.stem}
									{
										user1Analysis.fourPillars.month.branch
									}{" "}
									{user1Analysis.fourPillars.day.stem}
									{user1Analysis.fourPillars.day.branch}{" "}
									{user1Analysis.fourPillars.hour.stem}
									{user1Analysis.fourPillars.hour.branch}
								</div>
							</div>
						</div>
					)}

					{user2Analysis && (
						<div className="mb-4">
							<h3 className="font-medium text-green-800">
								女方分析結果:
							</h3>
							<div className="ml-4 space-y-1 text-sm">
								<div>
									日主: {user2Analysis.dayMasterStem}
									{user2Analysis.dayMasterElement}
								</div>
								<div>
									年命: {user2Analysis.lifeNayin}(
									{user2Analysis.lifeElement}命)
								</div>
								<div>
									四柱: {user2Analysis.fourPillars.year.stem}
									{user2Analysis.fourPillars.year.branch}{" "}
									{user2Analysis.fourPillars.month.stem}
									{
										user2Analysis.fourPillars.month.branch
									}{" "}
									{user2Analysis.fourPillars.day.stem}
									{user2Analysis.fourPillars.day.branch}{" "}
									{user2Analysis.fourPillars.hour.stem}
									{user2Analysis.fourPillars.hour.branch}
								</div>
							</div>
						</div>
					)}

					{user1Analysis && user2Analysis && (
						<div className="p-3 rounded bg-yellow-50">
							<h3 className="mb-2 font-medium text-yellow-800">
								配對結果:
							</h3>
							<div className="text-sm">
								五行配對: {user1Analysis.dayMasterElement}
								{user1Analysis.dayMasterElement === "火"
									? "火"
									: user1Analysis.dayMasterElement}
								男配{user2Analysis.dayMasterElement}
								{user2Analysis.dayMasterElement === "水"
									? "水"
									: user2Analysis.dayMasterElement}
								女
							</div>
						</div>
					)}
				</div>

				{formattedAnalysis && (
					<div className="p-4 rounded-lg bg-gray-50">
						<h3 className="mb-2 font-medium">AI分析格式:</h3>
						<pre className="text-sm whitespace-pre-wrap">
							{formattedAnalysis}
						</pre>
					</div>
				)}
			</div>
		</div>
	);
}
