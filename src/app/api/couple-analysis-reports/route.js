import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import CoupleAnalysisReport from "@/models/CoupleAnalysisReport";

// POST - Create a new couple analysis report

// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		await dbConnect();

		const reportData = await request.json();
		console.log("📝 Creating new couple analysis report:", {
			userId: reportData.userId,
			sessionId: reportData.sessionId,
			reportType: reportData.reportType,
		});

		// Validate required fields
		if (!reportData.userId || !reportData.sessionId) {
			return NextResponse.json(
				{
					success: false,
					error: "userId and sessionId are required",
				},
				{ status: 400 }
			);
		}

		if (
			!reportData.userProfile?.birthday ||
			!reportData.partnerProfile?.birthday
		) {
			return NextResponse.json(
				{
					success: false,
					error: "Both user and partner birthdays are required",
				},
				{ status: 400 }
			);
		}

		// Create new couple analysis report
		const coupleReport = new CoupleAnalysisReport({
			userId: reportData.userId,
			sessionId: reportData.sessionId,
			language: reportData.language || "zh-CN",
			
			// User Profile
			userProfile: {
				birthday: new Date(reportData.userProfile.birthday),
				gender: reportData.userProfile.gender || "male",
				element: reportData.userProfile.element,
				personality: reportData.userProfile.personality,
				loveStyle: reportData.userProfile.loveStyle,
				baziPillars: reportData.userProfile.baziPillars || [],
				dayMasterElement: reportData.userProfile.dayMasterElement,
			},

			// Partner Profile
			partnerProfile: {
				birthday: new Date(reportData.partnerProfile.birthday),
				gender: reportData.partnerProfile.gender || "female",
				element: reportData.partnerProfile.element,
				personality: reportData.partnerProfile.personality,
				loveStyle: reportData.partnerProfile.loveStyle,
				baziPillars: reportData.partnerProfile.baziPillars || [],
				dayMasterElement: reportData.partnerProfile.dayMasterElement,
			},

			// Compatibility Analysis
			compatibilityAnalysis: {
				overallScore: reportData.compatibilityAnalysis?.overallScore || 75,
				compatibilityLevel: reportData.compatibilityAnalysis?.compatibilityLevel,
				elementInteraction: reportData.compatibilityAnalysis?.elementInteraction,
				relationshipAdvice: reportData.compatibilityAnalysis?.relationshipAdvice,
				developmentAdvice: reportData.compatibilityAnalysis?.developmentAdvice,
				specificAdvice: reportData.compatibilityAnalysis?.specificAdvice,
				strengthsAndChallenges: reportData.compatibilityAnalysis?.strengthsAndChallenges,
			},

			// Problem Analysis
			problemAnalysis: {
				originalProblem: reportData.problemAnalysis?.originalProblem,
				problemCategory: reportData.problemAnalysis?.problemCategory,
				categoryType: reportData.problemAnalysis?.categoryType,
				keyIssues: reportData.problemAnalysis?.keyIssues || [],
				rootCauses: reportData.problemAnalysis?.rootCauses || [],
			},

			// Detailed Solutions by Category
			solutions: {
				// 感情降溫類
				emotionCooling: {
					chartDiagnosis: reportData.solutions?.emotionCooling?.chartDiagnosis,
					emergencyFengShui: reportData.solutions?.emotionCooling?.emergencyFengShui,
					restartChemistry: reportData.solutions?.emotionCooling?.restartChemistry,
				},
				// 特殊情境類
				specialSituation: {
					starChartGuidance: reportData.solutions?.specialSituation?.starChartGuidance,
					fengShuiTransformation: reportData.solutions?.specialSituation?.fengShuiTransformation,
					relationshipMethod: reportData.solutions?.specialSituation?.relationshipMethod,
				},
				// 禁忌破解話術
				tabooBreaking: {
					keyAnalysis: reportData.solutions?.tabooBreaking?.keyAnalysis,
					targetedSuggestions: reportData.solutions?.tabooBreaking?.targetedSuggestions,
					restartChemistry: reportData.solutions?.tabooBreaking?.restartChemistry,
				},
			},

			// Yearly Fortune
			yearlyFortune: {
				currentYear: reportData.yearlyFortune?.currentYear,
				bestTiming: reportData.yearlyFortune?.bestTiming,
				warnings: reportData.yearlyFortune?.warnings,
				monthlyGuidance: reportData.yearlyFortune?.monthlyGuidance || [],
			},

			// Feng Shui Layout
			fengShuiLayout: {
				bedroom: reportData.fengShuiLayout?.bedroom,
				livingRoom: reportData.fengShuiLayout?.livingRoom,
				colors: reportData.fengShuiLayout?.colors,
				items: reportData.fengShuiLayout?.items,
				generalAdvice: reportData.fengShuiLayout?.generalAdvice,
				specificPlacements: reportData.fengShuiLayout?.specificPlacements || [],
			},

			// Additional Analysis Data
			analysisDetails: {
				wuxingAnalysis: reportData.analysisDetails?.wuxingAnalysis,
				usefulGods: reportData.analysisDetails?.usefulGods || [],
				tabooElements: reportData.analysisDetails?.tabooElements || [],
				luckyDirections: reportData.analysisDetails?.luckyDirections || [],
				luckyNumbers: reportData.analysisDetails?.luckyNumbers || [],
			},

			// Report Metadata
			reportMetadata: {
				concern: reportData.reportMetadata?.concern || "感情",
				reportType: reportData.reportMetadata?.reportType || "couple_analysis",
				analysisDepth: reportData.reportMetadata?.analysisDepth || "comprehensive",
				generatedAt: new Date(),
				version: "2.0", // New enhanced version
			},
		});

		// Save the report
		const savedReport = await coupleReport.save();
		
		console.log("✅ Couple analysis report saved successfully!");
		console.log("📄 Report ID:", savedReport._id);
		console.log("👥 Users:", {
			user: reportData.userProfile.gender,
			partner: reportData.partnerProfile.gender,
		});
		console.log("🎯 Problem Category:", reportData.problemAnalysis?.categoryType);
		console.log("💯 Compatibility Score:", savedReport.compatibilityAnalysis.overallScore);

		return NextResponse.json({
			success: true,
			reportId: savedReport._id.toString(),
			message: "Couple analysis report created successfully",
			data: {
				reportId: savedReport._id,
				compatibilityScore: savedReport.compatibilityAnalysis.overallScore,
				problemCategory: savedReport.problemAnalysis.categoryType,
				createdAt: savedReport.createdAt,
			},
		});

	} catch (error) {
		console.error("❌ Failed to save couple analysis report:", error);
		
		// Detailed error logging
		if (error.name === 'ValidationError') {
			console.error("Validation errors:", error.errors);
			return NextResponse.json(
				{
					success: false,
					error: "Validation failed",
					details: Object.keys(error.errors).map(key => ({
						field: key,
						message: error.errors[key].message
					}))
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: "Failed to save couple analysis report",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}

// GET - Retrieve all couple analysis reports for a user (with pagination)
export async function GET(request) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");
		const sessionId = searchParams.get("sessionId");
		const page = parseInt(searchParams.get("page")) || 1;
		const limit = parseInt(searchParams.get("limit")) || 10;
		const skip = (page - 1) * limit;

		let query = {};
		if (userId) query.userId = userId;
		if (sessionId) query.sessionId = sessionId;

		console.log("🔍 Fetching couple analysis reports:", { query, page, limit });

		// Get reports with pagination
		const reports = await CoupleAnalysisReport.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select('_id userId sessionId compatibilityAnalysis.overallScore problemAnalysis.categoryType reportMetadata createdAt');

		// Get total count for pagination
		const totalReports = await CoupleAnalysisReport.countDocuments(query);

		console.log(`📊 Found ${reports.length} reports (${totalReports} total)`);

		return NextResponse.json({
			success: true,
			reports: reports,
			pagination: {
				page,
				limit,
				totalReports,
				totalPages: Math.ceil(totalReports / limit),
				hasNextPage: page < Math.ceil(totalReports / limit),
				hasPrevPage: page > 1,
			},
		});

	} catch (error) {
		console.error("❌ Failed to fetch couple analysis reports:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch reports",
				message: error.message,
			},
			{ status: 500 }
		);
	}
}
