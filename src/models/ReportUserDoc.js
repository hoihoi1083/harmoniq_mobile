import mongoose from "mongoose";

const reportUserSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			ref: "User",
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
		isDelete: {
			type: Number,
			default: 0,
		},
		nianzhuData: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
		yuezhuData: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
		rizhuData: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
		shizhuData: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
		yunchengData: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
		jiajuData: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
		mingLiData: {
			type: mongoose.Schema.Types.Mixed,
		},
		liuNianData: {
			type: mongoose.Schema.Types.Mixed,
		},
		jiajuProData: {
			type: mongoose.Schema.Types.Mixed,
		},
		// Four Fortune Analysis Data - Complete Life Report
		fourFortuneAnalysisData: {
			type: mongoose.Schema.Types.Mixed,
		},
		healthFortuneData: {
			type: mongoose.Schema.Types.Mixed,
		},
		careerFortuneData: {
			type: mongoose.Schema.Types.Mixed,
		},
		wealthFortuneData: {
			type: mongoose.Schema.Types.Mixed,
		},
		relationshipFortuneData: {
			type: mongoose.Schema.Types.Mixed,
		},
		// Comprehensive AI Analysis Data
		comprehensiveInterpersonalAdvice: {
			type: mongoose.Schema.Types.Mixed,
		},
		comprehensiveLifeAdvice: {
			type: mongoose.Schema.Types.Mixed,
		},
		// NEW: AI Generated Content - Separate from Template Data
		aiGeneratedContent: {
			type: mongoose.Schema.Types.Mixed,
			default: null,
		},
		// Complete Life Report Status
		lifeReportStatus: {
			type: String,
			enum: ["generating", "partial", "complete"],
			default: "generating",
		},
		reportGeneratedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true, // This adds createdAt and updatedAt automatically
	}
);

const ReportUserDoc =
	mongoose.models.ReportUserDoc ||
	mongoose.model("ReportUserDoc", reportUserSchema);

export default ReportUserDoc;
