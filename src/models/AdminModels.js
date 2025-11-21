import mongoose from "mongoose";

// Admin user model for simple authentication
const AdminUserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["admin", "super_admin"],
			default: "admin",
		},
		lastLogin: {
			type: Date,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		loginAttempts: {
			type: Number,
			default: 0,
		},
		lockUntil: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

// Virtual for checking if account is locked
AdminUserSchema.virtual("isLocked").get(function () {
	return !!(this.lockUntil && this.lockUntil > Date.now());
});

// User activity tracking model
const UserActivitySchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			index: true,
		},
		sessionId: {
			type: String,
			index: true,
		},
		activityType: {
			type: String,
			enum: [
				"login",
				"chat_start",
				"chat_message",
				"topic_selection",
				"birthday_input",
				"payment_initiate",
				"payment_complete",
				"report_generate",
				"report_view",
				"page_visit",
				"logout",
				"error_occurred",
			],
			required: true,
		},
		activityData: {
			type: mongoose.Schema.Types.Mixed, // Store various activity-specific data
		},
		metadata: {
			ipAddress: String,
			userAgent: String,
			deviceType: String,
			browser: String,
			platform: String,
			referrer: String,
			language: String,
			timezone: String,
		},
		duration: {
			type: Number, // Duration in milliseconds
		},
		success: {
			type: Boolean,
			default: true,
		},
		errorDetails: {
			type: String,
		},
	},
	{
		timestamps: true,
		indexes: [
			{ userId: 1, createdAt: -1 },
			{ activityType: 1, createdAt: -1 },
			{ sessionId: 1, createdAt: -1 },
		],
	}
);

// System metrics tracking
const SystemMetricsSchema = new mongoose.Schema(
	{
		date: {
			type: Date,
			required: true,
			unique: true,
		},
		metrics: {
			dailyActiveUsers: { type: Number, default: 0 },
			newUsers: { type: Number, default: 0 },
			totalConversations: { type: Number, default: 0 },
			completedConsultations: { type: Number, default: 0 },
			paymentTransactions: { type: Number, default: 0 },
			totalRevenue: { type: Number, default: 0 },
			averageSessionDuration: { type: Number, default: 0 },
			topConcerns: [
				{
					concern: String,
					count: Number,
				},
			],
			userTypeDistribution: {
				新手用戶: { type: Number, default: 0 },
				回頭客: { type: Number, default: 0 },
				專業用戶: { type: Number, default: 0 },
			},
			deviceStats: {
				mobile: { type: Number, default: 0 },
				desktop: { type: Number, default: 0 },
				tablet: { type: Number, default: 0 },
			},
			errorRate: { type: Number, default: 0 },
			responseTime: { type: Number, default: 0 },
		},
	},
	{
		timestamps: true,
	}
);

// Admin action logs
const AdminActionLogSchema = new mongoose.Schema(
	{
		adminId: {
			type: String,
			required: true,
			index: true,
		},
		action: {
			type: String,
			enum: [
				"user_view",
				"user_edit",
				"conversation_view",
				"conversation_moderate",
				"system_setting_change",
				"user_block",
				"user_unblock",
				"data_export",
				"broadcast_message",
				"report_generate",
				"payment_refund",
				"content_edit",
			],
			required: true,
		},
		targetType: {
			type: String,
			enum: ["user", "conversation", "system", "content"],
		},
		targetId: {
			type: String,
		},
		details: {
			type: mongoose.Schema.Types.Mixed,
		},
		ipAddress: {
			type: String,
		},
	},
	{
		timestamps: true,
		indexes: [
			{ adminId: 1, createdAt: -1 },
			{ action: 1, createdAt: -1 },
		],
	}
);

export const AdminUser =
	mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
export const UserActivity =
	mongoose.models.UserActivity ||
	mongoose.model("UserActivity", UserActivitySchema);
export const SystemMetrics =
	mongoose.models.SystemMetrics ||
	mongoose.model("SystemMetrics", SystemMetricsSchema);
export const AdminActionLog =
	mongoose.models.AdminActionLog ||
	mongoose.model("AdminActionLog", AdminActionLogSchema);
