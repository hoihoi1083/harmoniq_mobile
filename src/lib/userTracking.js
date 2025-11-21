// /src/lib/userTracking.js
"use client";

class FengShuiUserTracker {
	constructor() {
		this.sessionId = this.getOrCreateSessionId();
		this.userId = this.getOrCreateUserId();
	}

	// Generate unique session ID
	getOrCreateSessionId() {
		let sessionId = sessionStorage.getItem("feng_shui_session_id");
		if (!sessionId) {
			sessionId =
				"session_" +
				Date.now() +
				"_" +
				Math.random().toString(36).substr(2, 9);
			sessionStorage.setItem("feng_shui_session_id", sessionId);
		}
		return sessionId;
	}

	// Generate unique user ID (persistent across sessions)
	getOrCreateUserId() {
		let userId = localStorage.getItem("feng_shui_user_id");
		if (!userId) {
			userId =
				"user_" +
				Date.now() +
				"_" +
				Math.random().toString(36).substr(2, 9);
			localStorage.setItem("feng_shui_user_id", userId);
		}
		return userId;
	}

	// Track user actions in your database
	async trackAction(action, data = {}) {
		const trackingData = {
			userId: this.userId,
			sessionId: this.sessionId,
			action: action,
			data: data,
			timestamp: new Date().toISOString(),
			url: window.location.href,
			userAgent: navigator.userAgent,
			screenResolution: `${screen.width}x${screen.height}`,
			deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)
				? "mobile"
				: "desktop",
		};

		try {
			// Send to your API endpoint
			await fetch("/api/track-user-action", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(trackingData),
			});

			// Also send to GA4 for aggregate analysis
			if (typeof window !== "undefined" && window.gtag) {
				window.gtag("event", action, {
					event_category: "feng_shui_user_action",
					event_label: action,
					custom_parameter_1: this.sessionId,
					custom_parameter_2: data.roomType || "",
					custom_parameter_3: data.analysisType || "",
				});
			}
		} catch (error) {
			console.error("Tracking error:", error);
		}
	}

	// Track feng shui analysis progress
	async trackAnalysisProgress(step, details = {}) {
		await this.trackAction("analysis_progress", {
			step: step,
			progress: details.progress || 0,
			roomType: details.roomType || "",
			analysisType: details.analysisType || "",
			timeSpent: details.timeSpent || 0,
		});
	}

	// Track user engagement with feng shui content
	async trackContentEngagement(contentType, engagement = {}) {
		await this.trackAction("content_engagement", {
			contentType: contentType,
			timeOnPage: engagement.timeOnPage || 0,
			scrollDepth: engagement.scrollDepth || 0,
			interactions: engagement.interactions || 0,
		});
	}

	// Track feng shui report generation
	async trackReportGenerated(reportType, reportData = {}) {
		await this.trackAction("report_generated", {
			reportType: reportType,
			roomsAnalyzed: reportData.roomsAnalyzed || 0,
			analysisDepth: reportData.analysisDepth || "basic",
			userSatisfaction: reportData.userSatisfaction || null,
		});
	}

	// Track purchases and conversions
	async trackConversion(conversionType, conversionData = {}) {
		await this.trackAction("conversion", {
			conversionType: conversionType,
			value: conversionData.value || 0,
			currency: conversionData.currency || "HKD",
			products: conversionData.products || [],
		});
	}

	// Get user journey data
	async getUserJourney() {
		try {
			const response = await fetch(`/api/user-journey/${this.userId}`);
			return await response.json();
		} catch (error) {
			console.error("Error fetching user journey:", error);
			return [];
		}
	}
}

// Export singleton instance
export const fengShuiTracker = new FengShuiUserTracker();

export default fengShuiTracker;
