import mongoose from "mongoose";

const SmartUserIntentSchema = new mongoose.Schema(
	{
		// 用戶基本信息
		userEmail: {
			type: String,
			required: true,
			index: true,
		},

		sessionId: {
			type: String,
			index: true,
		},

		// 關注領域和問題
		primaryConcern: {
			type: String,
			enum: ["工作", "感情", "財運", "子女", "人際關係", "健康", "因緣"],
			required: false,
		},

		relationshipAnalysisType: {
			type: String,
			enum: ["individual", "couple"],
			required: false,
		},

		specificQuestion: {
			type: String,
			maxlength: 500,
		},

		// 對話狀態管理
		conversationState: {
			type: String,
			enum: [
				"initial",
				"concern_detected",
				"asking_specific",
				"waiting_confirmation",
				"problem_confirmed",
				"ready_for_modal",
				"ready_for_report",
				"birthday_collected",
				"birthday_collection",
				"asking_partner_birthday",
				"asking_detailed_report",
				"ready_for_detailed_report",
				"ready_for_payment",
			],
			default: "initial",
		},

		conversationActive: {
			type: Boolean,
			default: true,
		},

		readyForPayment: {
			type: Boolean,
			default: false,
		},

		// 對話歷史
		conversationHistory: [
			{
				role: {
					type: String,
					enum: ["user", "assistant"],
					required: true,
				},
				content: {
					type: String,
					required: true,
				},
				timestamp: {
					type: Date,
					default: Date.now,
				},
				detectedConcern: String,
				state: String,
			},
		],

		// 付款相關
		paymentCompleted: {
			type: Boolean,
			default: false,
		},

		paymentAmount: {
			type: Number,
			min: 0,
		},

		paymentDate: {
			type: Date,
		},

		serviceType: {
			type: String,
			enum: [
				"work-analysis",
				"relationship-analysis",
				"wealth-analysis",
				"children-analysis",
				"social-analysis",
				"love-analysis",
				"destiny-analysis",
			],
		},

		// 用戶生辰八字資料
		birthDate: {
			type: Date,
		},

		userBirthday: {
			type: Date,
		},

		partnerBirthday: {
			type: Date,
		},

		birthTime: {
			type: String,
		},

		gender: {
			type: String,
			enum: ["male", "female"],
		},

		// 報告生成
		reportGenerated: {
			type: Boolean,
			default: false,
		},

		reportContent: {
			baziAnalysis: {
				yearElement: String,
				dayElement: String,
				strengthAnalysis: {
					description: String,
					advice: String,
				},
				personality: String,
			},
			currentSituation: String,
			futureOutlook: String,
			specificAdvice: String,
			fengShuiSolutions: String,
			timingAdvice: String,
			generatedAt: {
				type: Date,
				default: Date.now,
			},
		},
	},
	{
		timestamps: true,
		indexes: [
			{ userEmail: 1, conversationActive: 1 },
			{ userEmail: 1, paymentCompleted: 1 },
			{ createdAt: -1 },
		],
	}
);

// 添加實例方法
SmartUserIntentSchema.methods.isConversationComplete = function () {
	return (
		this.conversationState === "ready_for_payment" || this.paymentCompleted
	);
};

SmartUserIntentSchema.methods.getProgress = function () {
	const states = [
		"initial",
		"concern_detected",
		"asking_specific",
		"waiting_confirmation",
		"asking_detailed_report",
		"ready_for_detailed_report",
		"ready_for_payment",
	];
	const currentIndex = states.indexOf(this.conversationState);
	return {
		current: currentIndex + 1,
		total: states.length,
		percentage: Math.round(((currentIndex + 1) / states.length) * 100),
	};
};

export default mongoose.models.SmartUserIntent ||
	mongoose.model("SmartUserIntent", SmartUserIntentSchema);
