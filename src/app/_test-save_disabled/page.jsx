"use client";
import {
	saveComponentContent,
	getSavedContent,
} from "@/utils/simpleCoupleContentSave";

export default function TestSavePage() {
	const testSave = async () => {
		// Test saving some content
		const sessionId = "test_manual_save";
		const content = {
			compatibility: { score: 88 },
			advice: "Manual test save working",
			timestamp: new Date().toISOString(),
		};

		const result = await saveComponentContent(
			sessionId,
			"testComponent",
			content,
			{
				birthday: "1990-05-15",
				birthday2: "1992-08-22",
			}
		);

		console.log("Save result:", result);

		// Test retrieving content
		const retrieved = await getSavedContent(sessionId);
		console.log("Retrieved content:", retrieved);
	};

	const testCoupleAnalysis = () => {
		// Test couple analysis saving
		const user1 = {
			birthDateTime: "1990-05-15",
			gender: "male",
		};
		const user2 = {
			birthDateTime: "1992-08-22",
			gender: "female",
		};

		const sessionId =
			`couple_${user1.birthDateTime}_${user2.birthDateTime}`.replace(
				/[^a-zA-Z0-9]/g,
				"_"
			);
		console.log("Session ID would be:", sessionId);

		const testContent = {
			compatibility: { score: 92 },
			advice: "Test couple analysis content",
			annualInsights: "Sample insights",
		};

		saveComponentContent(sessionId, "coupleAnnualAnalysis", testContent, {
			birthday: user1.birthDateTime,
			birthday2: user2.birthDateTime,
			gender: user1.gender,
			gender2: user2.gender,
		});
	};

	return (
		<div className="p-8">
			<h1 className="text-2xl mb-4">Test Simple Couple Content Save</h1>

			<div className="space-y-4">
				<button
					onClick={testSave}
					className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
				>
					Test Manual Save
				</button>

				<button
					onClick={testCoupleAnalysis}
					className="bg-green-500 text-white px-4 py-2 rounded"
				>
					Test Couple Analysis Save
				</button>
			</div>

			<div className="mt-8">
				<p>Open browser console to see results.</p>
				<p>
					Session ID format: couple_1990-05-15_1992-08-22 →
					couple_1990_05_15_1992_08_22
				</p>
				<p>
					Check API directly:{" "}
					<code>
						/api/couple-content?sessionId=couple_1990_05_15_1992_08_22
					</code>
				</p>
			</div>
		</div>
	);
}
