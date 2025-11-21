import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { genSuccessData, genErrorData } from "../../utils/gen-res-data";
import mongoose from "mongoose";

// Use the same ReportData schema from reportData/route.js
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
		basicReportData: {
			mingLiData: mongoose.Schema.Types.Mixed,
			liuNianData: mongoose.Schema.Types.Mixed,
			jiajuProData: mongoose.Schema.Types.Mixed,
		},
		fourFortuneData: {
			healthFortuneData: mongoose.Schema.Types.Mixed,
			careerFortuneData: mongoose.Schema.Types.Mixed,
			wealthFortuneData: mongoose.Schema.Types.Mixed,
			relationshipFortuneData: mongoose.Schema.Types.Mixed,
		},
		aiGeneratedContent: {
			sessionId: String,
			generatedAt: String,
			generationStatus: String,
			fourFortuneAI: {
				healthFortuneData: mongoose.Schema.Types.Mixed,
				careerFortuneData: mongoose.Schema.Types.Mixed,
				wealthFortuneData: mongoose.Schema.Types.Mixed,
				relationshipFortuneData: mongoose.Schema.Types.Mixed,
			},
			comprehensiveAI: {
				lifeAdvice: mongoose.Schema.Types.Mixed,
			},
			wuxingAnalysis: mongoose.Schema.Types.Mixed,
			lifeStageAnalysis: {
				年柱: mongoose.Schema.Types.Mixed,
				月柱: mongoose.Schema.Types.Mixed,
				日柱: mongoose.Schema.Types.Mixed,
				時柱: mongoose.Schema.Types.Mixed,
			},
		},
		reportStatus: {
			type: String,
			enum: ["generating", "partial", "complete"],
			default: "generating",
		},
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

const ReportData =
	mongoose.models.ReportData ||
	mongoose.model("ReportData", ReportDataSchema);


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");
		const userEmail = searchParams.get("userEmail");
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 12;

		if (!userId && !userEmail) {
			return NextResponse.json(
				genErrorData("User ID or email is required")
			);
		}

		await dbConnect();

		// Build query for reportData collection
		let query = {};
		if (userId) {
			query.userId = userId;
		}

		// Add condition to ensure it's a life report (has AI content or four fortune data)
		query.$or = [
			{
				"aiGeneratedContent.wuxingAnalysis": {
					$exists: true,
					$ne: null,
				},
			},
			{
				"aiGeneratedContent.lifeStageAnalysis": {
					$exists: true,
					$ne: null,
				},
			},
			{
				"aiGeneratedContent.comprehensiveAI": {
					$exists: true,
					$ne: null,
				},
			},
			{
				"fourFortuneData.healthFortuneData": {
					$exists: true,
					$ne: null,
				},
			},
			{
				"fourFortuneData.careerFortuneData": {
					$exists: true,
					$ne: null,
				},
			},
			{
				"fourFortuneData.wealthFortuneData": {
					$exists: true,
					$ne: null,
				},
			},
			{
				"fourFortuneData.relationshipFortuneData": {
					$exists: true,
					$ne: null,
				},
			},
		];

		const skip = (page - 1) * limit;

		// Get total count
		const totalCount = await ReportData.countDocuments(query);

		// Get reports with pagination
		const reports = await ReportData.find(query)
			.sort({ updatedAt: -1, createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select({
				sessionId: 1,
				userId: 1,
				birthDateTime: 1,
				gender: 1,
				language: 1,
				createdAt: 1,
				updatedAt: 1,
				reportStatus: 1,
				basicReportData: 1,
				fourFortuneData: 1,
				aiGeneratedContent: 1,
			})
			.lean();

		// Process reports to extract user info and add computed fields
		const processedReports = reports.map((report) => {
			// Birth info is directly available in reportData
			const birthDateTime = report.birthDateTime;
			const gender = report.gender;
			const sessionId = report.sessionId;

			// Determine report completion status
			const hasAIContent = !!(
				report.aiGeneratedContent &&
				(report.aiGeneratedContent.wuxingAnalysis ||
					report.aiGeneratedContent.lifeStageAnalysis ||
					report.aiGeneratedContent.comprehensiveAI)
			);

			const hasFourFortune = !!(
				report.fourFortuneData &&
				(report.fourFortuneData.healthFortuneData ||
					report.fourFortuneData.careerFortuneData ||
					report.fourFortuneData.wealthFortuneData ||
					report.fourFortuneData.relationshipFortuneData)
			);

			const hasBasicData = !!(
				report.basicReportData &&
				(report.basicReportData.mingLiData ||
					report.basicReportData.liuNianData ||
					report.basicReportData.jiajuProData)
			);

			const reportGenerated =
				hasAIContent || hasFourFortune || hasBasicData;

			// Count available fortune analyses
			let fortuneCount = 0;
			if (report.fourFortuneData?.healthFortuneData) fortuneCount++;
			if (report.fourFortuneData?.careerFortuneData) fortuneCount++;
			if (report.fourFortuneData?.wealthFortuneData) fortuneCount++;
			if (report.fourFortuneData?.relationshipFortuneData) fortuneCount++;

			return {
				...report,
				userInputs: {
					birthday: birthDateTime,
					gender: gender,
				},
				sessionId: sessionId,
				reportGenerated,
				reportType: "life",
				fortuneCount,
				hasAIContent,
				hasFourFortune,
				hasBasicData,
			};
		});

		// Calculate pagination
		const totalPages = Math.ceil(totalCount / limit);
		const hasNextPage = page < totalPages;
		const hasPrevPage = page > 1;

		const pagination = {
			currentPage: page,
			totalPages,
			totalCount,
			hasNextPage,
			hasPrevPage,
		};

		return NextResponse.json(
			genSuccessData({
				reports: processedReports,
				pagination,
			})
		);
	} catch (error) {
		console.error("Error fetching life report history:", error);
		return NextResponse.json(
			genErrorData("Failed to fetch life report history")
		);
	}
}
