import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";

/**
 * COMBINED COUPLE REPORT API
 * Combines all 6 component data into one complete report
 */

// Use the existing CoupleContent schema
const CoupleContentSchema = new mongoose.Schema(
	{
		sessionId: { type: String, required: true, index: true },
		componentName: { type: String, required: true },
		content: { type: mongoose.Schema.Types.Mixed, required: true },
		// User identification fields
		userId: { type: String, index: true },
		userEmail: { type: String, index: true },
		// Profile information
		birthday: String,
		birthday2: String,
		gender: String,
		gender2: String,
		problem: String,
		savedAt: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

const CoupleContent =
	mongoose.models.CoupleContent ||
	mongoose.model("CoupleContent", CoupleContentSchema);


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get("sessionId");

		if (!sessionId) {
			return NextResponse.json(
				{
					success: false,
					error: "sessionId required",
				},
				{ status: 400 }
			);
		}

		await connectDB();

		// Get all saved components for this session
		const components = await CoupleContent.find({ sessionId }).sort({
			savedAt: 1,
		});

		if (components.length === 0) {
			return NextResponse.json(
				{
					success: false,
					error: "No couple report data found for this session",
				},
				{ status: 404 }
			);
		}

		// Extract metadata from first component
		const metadata = {
			sessionId,
			birthday: components[0].birthday,
			birthday2: components[0].birthday2,
			gender: components[0].gender,
			gender2: components[0].gender2,
			problem: components[0].problem,
			reportGeneratedAt: components[components.length - 1].savedAt,
			totalComponents: components.length,
		};

		// Combine all component data
		const combinedReport = {
			metadata,

			// Component 1: Annual Analysis (compatibility score, annual strategy)
			annualAnalysis:
				components.find(
					(c) => c.componentName === "coupleAnnualAnalysis"
				)?.content || null,

			// Component 2: MingJu Analysis (BaZi compatibility)
			mingJuAnalysis:
				components.find((c) => c.componentName === "coupleMingJu")
					?.content || null,

			// Component 3: God Explain (Ten Gods interaction)
			godExplanation:
				components.find((c) => c.componentName === "coupleGodExplain")
					?.content || null,

			// Component 4: Season Analysis (seasonal fortune)
			seasonAnalysis:
				components.find((c) => c.componentName === "coupleSeason")
					?.content || null,

			// Component 5: Core Suggestions (relationship advice)
			coreSuggestions:
				components.find(
					(c) => c.componentName === "coupleCoreSuggestion"
				)?.content || null,

			// Component 6: Specific Problem Solution (detailed BaZi analysis)
			problemSolution:
				components.find(
					(c) =>
						c.componentName ===
						"enhancedCoupleSpecificProblemSolution"
				)?.content || null,
		};

		// Generate summary
		const summary = {
			compatibilityScore:
				combinedReport.annualAnalysis?.compatibility?.score || "N/A",
			compatibilityLevel:
				combinedReport.annualAnalysis?.compatibility?.level || "N/A",
			user1Element:
				combinedReport.annualAnalysis?.user1Analysis?.dominantElement ||
				"N/A",
			user2Element:
				combinedReport.annualAnalysis?.user2Analysis?.dominantElement ||
				"N/A",
			relationshipAdvice:
				combinedReport.annualAnalysis?.elementInteraction?.advice ||
				"N/A",
			componentsPresent: Object.entries(combinedReport)
				.filter(([key, value]) => key !== "metadata" && value !== null)
				.map(([key]) => key),
			componentsMissing: Object.entries(combinedReport)
				.filter(([key, value]) => key !== "metadata" && value === null)
				.map(([key]) => key),
		};

		return NextResponse.json({
			success: true,
			summary,
			report: combinedReport,
			rawComponents: components.map((c) => ({
				componentName: c.componentName,
				savedAt: c.savedAt,
				contentSize: JSON.stringify(c.content).length,
			})),
		});
	} catch (error) {
		console.error("❌ Error retrieving combined couple report:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message,
			},
			{ status: 500 }
		);
	}
}
