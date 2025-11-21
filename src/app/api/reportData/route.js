import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { genSuccessData, genErrorData } from "../utils/gen-res-data";
import mongoose from "mongoose";

// Create a new schema for report data with user identification
const ReportDataSchema = new mongoose.Schema(
	{
		sessionId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		userId: {
			type: String,
			required: false,
			index: true,
			default: null,
		},
		birthDateTime: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			default: "zh-TW",
		},

		// Basic Report Data (from Report.jsx)
		basicReportData: {
			mingLiData: mongoose.Schema.Types.Mixed,
			liuNianData: mongoose.Schema.Types.Mixed,
			jiajuProData: mongoose.Schema.Types.Mixed,
		},

		// Four Fortune Data (from FourFortuneAnalysis.jsx)
		fourFortuneData: {
			healthFortuneData: mongoose.Schema.Types.Mixed,
			careerFortuneData: mongoose.Schema.Types.Mixed,
			wealthFortuneData: mongoose.Schema.Types.Mixed,
			relationshipFortuneData: mongoose.Schema.Types.Mixed,
		},

		// AI Generated Content
		aiGeneratedContent: {
			sessionId: String,
			generatedAt: String,
			generationStatus: String, // 'generating', 'partial', 'complete'

			// Four Fortune AI Data
			fourFortuneAI: {
				healthFortuneData: mongoose.Schema.Types.Mixed,
				careerFortuneData: mongoose.Schema.Types.Mixed,
				wealthFortuneData: mongoose.Schema.Types.Mixed,
				relationshipFortuneData: mongoose.Schema.Types.Mixed,
			},

			// Comprehensive AI Analysis
			comprehensiveAI: {
				lifeAdvice: mongoose.Schema.Types.Mixed,
			},

			// Wuxing Analysis
			wuxingAnalysis: mongoose.Schema.Types.Mixed,

			// Life Stage Analysis (年柱, 月柱, 日柱, 時柱)
			lifeStageAnalysis: {
				年柱: mongoose.Schema.Types.Mixed,
				月柱: mongoose.Schema.Types.Mixed,
				日柱: mongoose.Schema.Types.Mixed,
				時柱: mongoose.Schema.Types.Mixed,
			},
		},

		// Report Status
		reportStatus: {
			type: String,
			enum: ["generating", "partial", "complete"],
			default: "generating",
		},

		// Timestamps
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

// Clear any existing model and create fresh
if (mongoose.models.ReportData) {
	delete mongoose.models.ReportData;
}
const ReportData = mongoose.model("ReportData", ReportDataSchema);

// GET - Retrieve report data by sessionId

// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get("sessionId");

		if (!sessionId) {
			return NextResponse.json(genErrorData("SessionId is required"));
		}

		await dbConnect();
		const reportData = await ReportData.findOne({ sessionId }).select(
			"-__v"
		);

		return NextResponse.json(genSuccessData(reportData));
	} catch (error) {
		console.error("Error fetching report data:", error);
		return NextResponse.json(genErrorData("Error fetching report data"));
	}
}

// POST - Create new report data
export async function POST(request) {
	try {
		const body = await request.json();
		const { sessionId, birthDateTime, gender } = body;

		// console.log("🔑 POST API received userId:", body.userId); // Debug log to verify userId

		if (!sessionId || !birthDateTime || !gender) {
			return NextResponse.json(
				genErrorData(
					"SessionId, birthDateTime, and gender are required"
				)
			);
		}

		await dbConnect();

		// Check if report already exists
		const existingReport = await ReportData.findOne({ sessionId });
		if (existingReport) {
			return NextResponse.json(
				genErrorData("Report with this sessionId already exists")
			);
		}

		const reportData = await ReportData.create({
			sessionId,
			userId: body.userId, // Add userId field for user-specific report tracking
			birthDateTime,
			gender,
			language: body.language || "zh-TW",
			basicReportData: body.basicReportData || {},
			fourFortuneData: body.fourFortuneData || {},
			aiGeneratedContent: body.aiGeneratedContent || {},
			reportStatus: body.reportStatus || "generating",
		});

		console.log(
			"✅ Report data created successfully for session:",
			sessionId
		);
		// console.log("🔍 Created document with userId:", reportData.userId); // Debug log
		// console.log("🔍 Full document keys:", Object.keys(reportData.toObject()));
		// console.log("🔍 Full document:", JSON.stringify(reportData.toObject(), null, 2));
		return NextResponse.json(genSuccessData(reportData));
	} catch (error) {
		console.error("🔥 DETAILED ERROR creating report data:", error);
		console.error("🔥 Error stack:", error.stack);
		console.error("🔥 Error message:", error.message);
		return NextResponse.json(
			genErrorData("Error creating report data: " + error.message)
		);
	}
}

// PATCH - Update existing report data
export async function PATCH(request) {
	try {
		// console.log("🚨 PATCH API CALLED - THIS SHOULD SHOW UP!");
		const body = await request.json();
		// console.log("🚨 REQUEST BODY:", JSON.stringify(body, null, 2));
		const { sessionId } = body;

		if (!sessionId) {
			return NextResponse.json(genErrorData("SessionId is required"));
		}

		// console.log("🔑 API received userId:", body.userId); // Debug log to verify userId
		await dbConnect();

		let reportData = await ReportData.findOne({ sessionId });
		if (!reportData) {
			// Create new report if it doesn't exist
			reportData = await ReportData.create({
				sessionId,
				userId: body.userId, // Add userId for user-specific report tracking
				birthDateTime: body.birthDateTime || new Date().toISOString(),
				gender: body.gender || "male",
				language: body.language || "zh-TW",
			});
			console.log("✅ New report data created for session:", sessionId);
		}

		// Update fields
		if (body.userId) {
			reportData.userId = body.userId; // Update userId for user association
			// console.log("🔑 Setting userId to:", body.userId); // Debug log
		}
		if (body.basicReportData) {
			reportData.basicReportData = {
				...(reportData.basicReportData
					? reportData.basicReportData.toObject()
					: {}),
				...body.basicReportData,
			};
		}
		if (body.fourFortuneData) {
			reportData.fourFortuneData = {
				...(reportData.fourFortuneData
					? reportData.fourFortuneData.toObject()
					: {}),
				...body.fourFortuneData,
			};
		}
		if (body.aiGeneratedContent) {
			reportData.aiGeneratedContent = {
				...(reportData.aiGeneratedContent
					? reportData.aiGeneratedContent.toObject()
					: {}),
				...body.aiGeneratedContent,
			};
		}
		if (body.reportStatus) {
			reportData.reportStatus = body.reportStatus;
		}

		reportData.updatedAt = new Date();
		await reportData.save();

		console.log(
			"✅ Report data updated successfully for session:",
			sessionId
		);
		// console.log("🔍 Final userId in saved document:", reportData.userId); // Debug log
		// console.log("🔍 Final document keys:", Object.keys(reportData.toObject()));
		// console.log("🔍 Final document:", JSON.stringify(reportData.toObject(), null, 2));
		return NextResponse.json(genSuccessData(reportData));
	} catch (error) {
		console.error("🔥 DETAILED ERROR updating report data:", error);
		console.error("🔥 Error stack:", error.stack);
		console.error("🔥 Error message:", error.message);
		return NextResponse.json(
			genErrorData("Error updating report data: " + error.message)
		);
	}
}

// DELETE - Delete report data by sessionId
export async function DELETE(request) {
	try {
		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get("sessionId");

		if (!sessionId) {
			return NextResponse.json(genErrorData("SessionId is required"));
		}

		await dbConnect();
		await ReportData.deleteOne({ sessionId });

		console.log(
			"✅ Report data deleted successfully for session:",
			sessionId
		);
		return NextResponse.json(genSuccessData());
	} catch (error) {
		console.error("Error deleting report data:", error);
		return NextResponse.json(genErrorData("Error deleting report data"));
	}
}
