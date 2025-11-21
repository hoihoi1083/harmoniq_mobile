import { UserActivity } from "@/models/AdminModels";
import dbConnect from "@/lib/mongoose";

// Activity tracking middleware
export class ActivityTracker {
	static async trackActivity(
		userId,
		activityType,
		activityData = {},
		metadata = {},
		options = {}
	) {
		try {
			await dbConnect();

			const activity = new UserActivity({
				userId,
				sessionId: options.sessionId || metadata.sessionId,
				activityType,
				activityData,
				metadata: {
					ipAddress: metadata.ipAddress,
					userAgent: metadata.userAgent,
					deviceType:
						metadata.deviceType ||
						this.detectDeviceType(metadata.userAgent),
					browser:
						metadata.browser ||
						this.detectBrowser(metadata.userAgent),
					platform:
						metadata.platform ||
						this.detectPlatform(metadata.userAgent),
					referrer: metadata.referrer,
					language: metadata.language,
					timezone: metadata.timezone,
				},
				duration: options.duration,
				success: options.success !== false, // Default to true
				errorDetails: options.errorDetails,
			});

			await activity.save();
			return activity;
		} catch (error) {
			console.error("Activity tracking error:", error);
			// Don't throw error to avoid breaking the main application flow
		}
	}

	static detectDeviceType(userAgent) {
		if (!userAgent) return "unknown";

		if (
			/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				userAgent
			)
		) {
			if (/iPad/i.test(userAgent)) return "tablet";
			return "mobile";
		}
		return "desktop";
	}

	static detectBrowser(userAgent) {
		if (!userAgent) return "unknown";

		if (userAgent.includes("Chrome")) return "Chrome";
		if (userAgent.includes("Firefox")) return "Firefox";
		if (userAgent.includes("Safari")) return "Safari";
		if (userAgent.includes("Edge")) return "Edge";
		if (userAgent.includes("Opera")) return "Opera";
		return "unknown";
	}

	static detectPlatform(userAgent) {
		if (!userAgent) return "unknown";

		if (/Windows/i.test(userAgent)) return "Windows";
		if (/Mac/i.test(userAgent)) return "macOS";
		if (/Linux/i.test(userAgent)) return "Linux";
		if (/Android/i.test(userAgent)) return "Android";
		if (/iOS/i.test(userAgent)) return "iOS";
		return "unknown";
	}

	// Helper method to extract metadata from request
	static extractMetadata(request) {
		const userAgent = request.headers.get("user-agent") || "";
		const acceptLanguage = request.headers.get("accept-language") || "";
		const referer = request.headers.get("referer") || "";

		return {
			ipAddress: this.getClientIP(request),
			userAgent,
			deviceType: this.detectDeviceType(userAgent),
			browser: this.detectBrowser(userAgent),
			platform: this.detectPlatform(userAgent),
			referrer: referer,
			language: acceptLanguage.split(",")[0] || "unknown",
			timezone: request.headers.get("timezone") || "unknown",
		};
	}

	static getClientIP(request) {
		const forwarded = request.headers.get("x-forwarded-for");
		const realIP = request.headers.get("x-real-ip");

		if (forwarded) {
			return forwarded.split(",")[0].trim();
		}

		if (realIP) {
			return realIP;
		}

		return "unknown";
	}

	// Track specific activity types
	static async trackLogin(userId, metadata, options = {}) {
		return this.trackActivity(userId, "login", {}, metadata, options);
	}

	static async trackChatStart(userId, sessionId, metadata, options = {}) {
		return this.trackActivity(
			userId,
			"chat_start",
			{ sessionId },
			metadata,
			{ ...options, sessionId }
		);
	}

	static async trackChatMessage(
		userId,
		sessionId,
		messageData,
		metadata,
		options = {}
	) {
		return this.trackActivity(
			userId,
			"chat_message",
			{
				messageLength: messageData.length,
				topic: messageData.topic,
				concern: messageData.concern,
			},
			metadata,
			{ ...options, sessionId }
		);
	}

	static async trackTopicSelection(
		userId,
		sessionId,
		topic,
		metadata,
		options = {}
	) {
		return this.trackActivity(
			userId,
			"topic_selection",
			{ topic },
			metadata,
			{ ...options, sessionId }
		);
	}

	static async trackBirthdayInput(userId, sessionId, metadata, options = {}) {
		return this.trackActivity(userId, "birthday_input", {}, metadata, {
			...options,
			sessionId,
		});
	}

	static async trackPaymentInitiate(
		userId,
		sessionId,
		paymentData,
		metadata,
		options = {}
	) {
		return this.trackActivity(
			userId,
			"payment_initiate",
			{
				amount: paymentData.amount,
				serviceType: paymentData.serviceType,
			},
			metadata,
			{ ...options, sessionId }
		);
	}

	static async trackPaymentComplete(
		userId,
		sessionId,
		paymentData,
		metadata,
		options = {}
	) {
		return this.trackActivity(
			userId,
			"payment_complete",
			{
				amount: paymentData.amount,
				serviceType: paymentData.serviceType,
				transactionId: paymentData.transactionId,
			},
			metadata,
			{ ...options, sessionId }
		);
	}

	static async trackReportGenerate(
		userId,
		sessionId,
		reportData,
		metadata,
		options = {}
	) {
		return this.trackActivity(
			userId,
			"report_generate",
			{
				reportType: reportData.type,
				generationTime: reportData.generationTime,
			},
			metadata,
			{ ...options, sessionId }
		);
	}

	static async trackReportView(userId, sessionId, metadata, options = {}) {
		return this.trackActivity(userId, "report_view", {}, metadata, {
			...options,
			sessionId,
		});
	}

	static async trackPageVisit(userId, page, metadata, options = {}) {
		return this.trackActivity(
			userId,
			"page_visit",
			{ page },
			metadata,
			options
		);
	}

	static async trackError(
		userId,
		sessionId,
		errorData,
		metadata,
		options = {}
	) {
		return this.trackActivity(
			userId,
			"error_occurred",
			{
				errorType: errorData.type,
				errorMessage: errorData.message,
				errorCode: errorData.code,
			},
			metadata,
			{
				...options,
				sessionId,
				success: false,
				errorDetails: errorData.details,
			}
		);
	}
}

// Wrapper function for easy import
export const trackActivity =
	ActivityTracker.trackActivity.bind(ActivityTracker);

export default ActivityTracker;
