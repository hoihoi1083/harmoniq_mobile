import mongoose from "mongoose";

// 用戶意圖追蹤模型
const UserIntentSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},

	// 基本資料
	birthday: {
		type: Date,
		required: true,
	},
	birthTime: {
		type: String, // 時辰 (子時, 丑時, etc.)
	},

	// 主要關注領域
	primaryConcern: {
		type: String,
		enum: ["感情", "財運", "工作", "子女", "人際關係", "桃花", "因緣"],
		required: true,
	},

	// 具體問題
	specificQuestion: {
		type: String,
		required: true,
	},

	// 對話記錄
	conversationHistory: [
		{
			timestamp: { type: Date, default: Date.now },
			userMessage: String,
			assistantResponse: String,
			emotion: String,
			intent: String,
		},
	],

	// 付款狀態
	paymentStatus: {
		type: String,
		enum: ["pending", "paid", "expired"],
		default: "pending",
	},
	paymentLink: String,
	paymentId: String,

	// 報告生成狀態
	reportGenerated: {
		type: Boolean,
		default: false,
	},
	reportContent: {
		baziAnalysis: String, // 八字分析
		currentSituation: String, // 現況分析
		futureOutlook: String, // 前景分析
		specificAdvice: String, // 針對性建議
		fengShuiSolutions: String, // 風水解決方案
		personalChanges: String, // 個人改變建議
		timingAdvice: String, // 時機建議
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

// 更新時間中間件
UserIntentSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

// 如果模型已存在，先刪除
if (mongoose.models.UserIntent) {
	delete mongoose.models.UserIntent;
}

export default mongoose.model("UserIntent", UserIntentSchema);
