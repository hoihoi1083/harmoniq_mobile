import mongoose from "mongoose";

const fortuneReportSchema = new mongoose.Schema({
	sessionId: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	userId: {
		type: String,
		required: false, // Optional, for logged-in users
		index: true,
	},
	userEmail: {
		type: String,
		required: false, // Optional, for logged-in users
	},

	// Payment Information
	paymentStatus: {
		type: String,
		enum: ["pending", "paid", "expired"],
		default: "paid", // Since we only create this after payment
	},
	paymentAmount: {
		type: Number,
		required: true,
	},
	paymentCurrency: {
		type: String,
		default: "USD",
	},

	// User Input Data
	userInputs: {
		birthday: {
			type: String,
			required: true,
		},
		gender: {
			type: String,
			required: true,
		},
		concern: {
			type: String,
			required: true,
		},
		problem: {
			type: String,
			required: true,
		},
		partnerBirthday: {
			type: String,
			required: false, // For couple analysis
		},
	},

	// Report Generation Status
	reportGenerated: {
		type: Boolean,
		default: false,
	},
	reportGeneratedAt: {
		type: Date,
		required: false,
	},

	// Generated Report Content (cached)
	reportContent: {
		// Five Elements Analysis
		fiveElementAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		// Zodiac Analysis
		zodiacAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		// Liu Nian Keyword Analysis
		liuNianKeyWordAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		// Ming Ju Analysis
		mingJuAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		// Gan Zhi Analysis
		ganZhiAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		// Ji Xiong Analysis
		jiXiongAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		// Season Analysis
		seasonAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		// Core Suggestion
		coreSuggestionAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		// Specific Suggestion
		specificSuggestionAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		// Question Focus Analysis (AI-generated personalized solution)
		questionFocusAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
		// Couple Analysis (if applicable)
		coupleAnalysis: {
			type: mongoose.Schema.Types.Mixed,
			required: false,
		},
	},

	// Access Control
	accessCount: {
		type: Number,
		default: 0,
	},
	lastAccessedAt: {
		type: Date,
		default: Date.now,
	},

	// Metadata
	reportType: {
		type: String,
		default: "fortune",
	},
	reportVersion: {
		type: String,
		default: "1.0",
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Update the updatedAt field before saving
fortuneReportSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

// Create indexes for better performance
fortuneReportSchema.index({ sessionId: 1 });
fortuneReportSchema.index({ userId: 1 });
fortuneReportSchema.index({ userEmail: 1 });
fortuneReportSchema.index({ createdAt: -1 });
fortuneReportSchema.index({ reportGenerated: 1 });

const FortuneReport =
	mongoose.models.FortuneReport ||
	mongoose.model("FortuneReport", fortuneReportSchema);

export default FortuneReport;
