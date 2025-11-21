// 📊 Performance Monitoring System
// Immediate Improvement: Track system metrics and user satisfaction

class PerformanceMonitoringSystem {
	constructor() {
		this.metrics = {
			responseTime: [],
			userSatisfaction: [],
			systemHealth: [],
			conversationQuality: [],
			errorRates: [],
		};

		this.realTimeMetrics = {
			currentSession: {
				startTime: Date.now(),
				messageCount: 0,
				averageResponseTime: 0,
				userSatisfactionScore: 0,
				errorCount: 0,
			},
			systemStatus: {
				isHealthy: true,
				lastHealthCheck: Date.now(),
				activeConnections: 0,
				memoryUsage: 0,
			},
		};

		// Performance thresholds
		this.thresholds = {
			responseTime: {
				excellent: 1000, // < 1s
				good: 3000, // < 3s
				fair: 5000, // < 5s
				poor: 10000, // < 10s
			},
			satisfaction: {
				excellent: 0.9,
				good: 0.7,
				fair: 0.5,
				poor: 0.3,
			},
			errorRate: {
				excellent: 0.01, // < 1%
				good: 0.05, // < 5%
				fair: 0.1, // < 10%
				poor: 0.2, // < 20%
			},
		};

		// Initialize monitoring
		this.startMonitoring();
	}

	// Start performance monitoring
	startMonitoring() {
		console.log("📊 Performance monitoring started");

		// Start periodic health checks
		setInterval(() => {
			this.performHealthCheck();
		}, 30000); // Every 30 seconds

		// Start memory monitoring
		if (performance.memory) {
			setInterval(() => {
				this.monitorMemoryUsage();
			}, 10000); // Every 10 seconds
		}

		// Monitor page visibility for accurate metrics
		document.addEventListener("visibilitychange", () => {
			this.handleVisibilityChange();
		});
	}

	// Track response time
	trackResponseTime(startTime, endTime, context = {}) {
		const responseTime = endTime - startTime;

		const measurement = {
			responseTime,
			timestamp: endTime,
			context: {
				messageLength: context.messageLength || 0,
				complexity: context.complexity || "unknown",
				systemLoad: this.getCurrentSystemLoad(),
				userAgent: navigator.userAgent,
			},
		};

		this.metrics.responseTime.push(measurement);
		this.updateSessionMetrics("responseTime", responseTime);

		// Log performance status
		const status = this.getResponseTimeStatus(responseTime);
		console.log(`⏱️ Response time: ${responseTime}ms (${status})`);

		return measurement;
	}

	// Track user satisfaction
	trackUserSatisfaction(satisfactionScore, feedback = {}) {
		const measurement = {
			score: satisfactionScore,
			timestamp: Date.now(),
			feedback: {
				helpful: feedback.helpful || false,
				accurate: feedback.accurate || false,
				clear: feedback.clear || false,
				complete: feedback.complete || false,
				comments: feedback.comments || "",
			},
			context: {
				messageCount: this.realTimeMetrics.currentSession.messageCount,
				sessionDuration:
					Date.now() - this.realTimeMetrics.currentSession.startTime,
			},
		};

		this.metrics.userSatisfaction.push(measurement);
		this.updateSessionMetrics("satisfaction", satisfactionScore);

		console.log(
			`😊 User satisfaction: ${satisfactionScore.toFixed(2)} (${this.getSatisfactionStatus(satisfactionScore)})`
		);

		return measurement;
	}

	// Track conversation quality
	trackConversationQuality(qualityMetrics) {
		const measurement = {
			timestamp: Date.now(),
			coherence: qualityMetrics.coherence || 0,
			relevance: qualityMetrics.relevance || 0,
			helpfulness: qualityMetrics.helpfulness || 0,
			accuracy: qualityMetrics.accuracy || 0,
			culturalSensitivity: qualityMetrics.culturalSensitivity || 0,
			overallScore: this.calculateOverallQuality(qualityMetrics),
			context: {
				topicComplexity: qualityMetrics.topicComplexity || "medium",
				userEngagement: qualityMetrics.userEngagement || 0.5,
				conversationLength: qualityMetrics.conversationLength || 0,
			},
		};

		this.metrics.conversationQuality.push(measurement);

		console.log(
			`💬 Conversation quality: ${measurement.overallScore.toFixed(2)}`
		);

		return measurement;
	}

	// Track errors
	trackError(error, context = {}) {
		const errorMeasurement = {
			timestamp: Date.now(),
			type: error.type || "unknown",
			message: error.message || "",
			severity: error.severity || "medium",
			context: {
				userMessage: context.userMessage || "",
				systemState: context.systemState || "unknown",
				sessionId: context.sessionId || "unknown",
				stackTrace: error.stack || "",
			},
			resolution: {
				wasResolved: false,
				resolutionTime: null,
				resolutionMethod: null,
			},
		};

		this.metrics.errorRates.push(errorMeasurement);
		this.realTimeMetrics.currentSession.errorCount++;

		console.error(`🚨 Error tracked: ${error.type} - ${error.message}`);

		return errorMeasurement;
	}

	// Perform system health check
	performHealthCheck() {
		const healthMetrics = {
			timestamp: Date.now(),
			responseTimeHealth: this.assessResponseTimeHealth(),
			satisfactionHealth: this.assessSatisfactionHealth(),
			errorRateHealth: this.assessErrorRateHealth(),
			systemResourceHealth: this.assessSystemResourceHealth(),
			overallHealth: 0,
		};

		// Calculate overall health
		healthMetrics.overallHealth =
			(healthMetrics.responseTimeHealth +
				healthMetrics.satisfactionHealth +
				healthMetrics.errorRateHealth +
				healthMetrics.systemResourceHealth) /
			4;

		this.metrics.systemHealth.push(healthMetrics);
		this.realTimeMetrics.systemStatus.isHealthy =
			healthMetrics.overallHealth > 0.7;
		this.realTimeMetrics.systemStatus.lastHealthCheck =
			healthMetrics.timestamp;

		// Log health status
		const status = this.getHealthStatus(healthMetrics.overallHealth);
		console.log(
			`🏥 System health: ${(healthMetrics.overallHealth * 100).toFixed(1)}% (${status})`
		);

		return healthMetrics;
	}

	// Monitor memory usage
	monitorMemoryUsage() {
		if (!performance.memory) return;

		const memoryInfo = {
			used: performance.memory.usedJSHeapSize,
			total: performance.memory.totalJSHeapSize,
			limit: performance.memory.jsHeapSizeLimit,
			timestamp: Date.now(),
		};

		this.realTimeMetrics.systemStatus.memoryUsage =
			memoryInfo.used / memoryInfo.limit;

		// Warn if memory usage is high
		if (memoryInfo.used / memoryInfo.total > 0.9) {
			console.warn("⚠️ High memory usage detected");
		}

		return memoryInfo;
	}

	// Get current performance dashboard
	getPerformanceDashboard() {
		const recentMetrics = this.getRecentMetrics(300000); // Last 5 minutes

		return {
			currentSession: this.realTimeMetrics.currentSession,
			systemStatus: this.realTimeMetrics.systemStatus,
			recentPerformance: {
				averageResponseTime: this.calculateAverageResponseTime(
					recentMetrics.responseTime
				),
				averageSatisfaction: this.calculateAverageSatisfaction(
					recentMetrics.userSatisfaction
				),
				errorRate: this.calculateErrorRate(recentMetrics.errorRates),
				conversationQuality: this.calculateAverageQuality(
					recentMetrics.conversationQuality
				),
			},
			trends: this.calculateTrends(),
			recommendations: this.generatePerformanceRecommendations(),
		};
	}

	// Get real-time metrics
	getRealTimeMetrics() {
		return {
			...this.realTimeMetrics,
			timestamp: Date.now(),
			sessionDuration:
				Date.now() - this.realTimeMetrics.currentSession.startTime,
		};
	}

	// Calculate performance trends
	calculateTrends() {
		const recentMetrics = this.getRecentMetrics(3600000); // Last hour
		const olderMetrics = this.getMetricsInRange(
			Date.now() - 7200000,
			Date.now() - 3600000
		); // Previous hour

		return {
			responseTime: this.calculateTrend(
				this.calculateAverageResponseTime(olderMetrics.responseTime),
				this.calculateAverageResponseTime(recentMetrics.responseTime)
			),
			satisfaction: this.calculateTrend(
				this.calculateAverageSatisfaction(
					olderMetrics.userSatisfaction
				),
				this.calculateAverageSatisfaction(
					recentMetrics.userSatisfaction
				)
			),
			errorRate: this.calculateTrend(
				this.calculateErrorRate(olderMetrics.errorRates),
				this.calculateErrorRate(recentMetrics.errorRates)
			),
		};
	}

	// Generate performance recommendations
	generatePerformanceRecommendations() {
		const recommendations = [];
		const dashboard = this.getPerformanceDashboard();

		// Response time recommendations
		if (
			dashboard.recentPerformance.averageResponseTime >
			this.thresholds.responseTime.fair
		) {
			recommendations.push({
				type: "performance",
				priority: "high",
				message: "回應時間較慢，建議優化AI處理流程",
				action: "optimize_response_generation",
			});
		}

		// Satisfaction recommendations
		if (
			dashboard.recentPerformance.averageSatisfaction <
			this.thresholds.satisfaction.good
		) {
			recommendations.push({
				type: "satisfaction",
				priority: "medium",
				message: "用戶滿意度可以提升，建議改善回應品質",
				action: "improve_response_quality",
			});
		}

		// Error rate recommendations
		if (
			dashboard.recentPerformance.errorRate >
			this.thresholds.errorRate.good
		) {
			recommendations.push({
				type: "reliability",
				priority: "high",
				message: "錯誤率偏高，需要檢查系統穩定性",
				action: "investigate_errors",
			});
		}

		// Memory recommendations
		if (this.realTimeMetrics.systemStatus.memoryUsage > 0.8) {
			recommendations.push({
				type: "resources",
				priority: "medium",
				message: "記憶體使用率較高，建議清理暫存",
				action: "cleanup_memory",
			});
		}

		return recommendations;
	}

	// Utility methods
	getRecentMetrics(timeWindow) {
		const cutoff = Date.now() - timeWindow;

		return {
			responseTime: this.metrics.responseTime.filter(
				(m) => m.timestamp > cutoff
			),
			userSatisfaction: this.metrics.userSatisfaction.filter(
				(m) => m.timestamp > cutoff
			),
			conversationQuality: this.metrics.conversationQuality.filter(
				(m) => m.timestamp > cutoff
			),
			errorRates: this.metrics.errorRates.filter(
				(m) => m.timestamp > cutoff
			),
		};
	}

	getMetricsInRange(startTime, endTime) {
		return {
			responseTime: this.metrics.responseTime.filter(
				(m) => m.timestamp >= startTime && m.timestamp <= endTime
			),
			userSatisfaction: this.metrics.userSatisfaction.filter(
				(m) => m.timestamp >= startTime && m.timestamp <= endTime
			),
			conversationQuality: this.metrics.conversationQuality.filter(
				(m) => m.timestamp >= startTime && m.timestamp <= endTime
			),
			errorRates: this.metrics.errorRates.filter(
				(m) => m.timestamp >= startTime && m.timestamp <= endTime
			),
		};
	}

	calculateAverageResponseTime(responseTimeMetrics) {
		if (responseTimeMetrics.length === 0) return 0;
		const sum = responseTimeMetrics.reduce(
			(acc, m) => acc + m.responseTime,
			0
		);
		return sum / responseTimeMetrics.length;
	}

	calculateAverageSatisfaction(satisfactionMetrics) {
		if (satisfactionMetrics.length === 0) return 0;
		const sum = satisfactionMetrics.reduce((acc, m) => acc + m.score, 0);
		return sum / satisfactionMetrics.length;
	}

	calculateErrorRate(errorMetrics) {
		const totalMessages = this.realTimeMetrics.currentSession.messageCount;
		if (totalMessages === 0) return 0;
		return errorMetrics.length / totalMessages;
	}

	calculateAverageQuality(qualityMetrics) {
		if (qualityMetrics.length === 0) return 0;
		const sum = qualityMetrics.reduce((acc, m) => acc + m.overallScore, 0);
		return sum / qualityMetrics.length;
	}

	calculateOverallQuality(metrics) {
		const weights = {
			coherence: 0.2,
			relevance: 0.25,
			helpfulness: 0.25,
			accuracy: 0.2,
			culturalSensitivity: 0.1,
		};

		return Object.entries(weights).reduce((score, [key, weight]) => {
			return score + (metrics[key] || 0) * weight;
		}, 0);
	}

	calculateTrend(oldValue, newValue) {
		if (oldValue === 0) return 0;
		return (newValue - oldValue) / oldValue;
	}

	updateSessionMetrics(type, value) {
		const session = this.realTimeMetrics.currentSession;
		session.messageCount++;

		switch (type) {
			case "responseTime":
				session.averageResponseTime =
					(session.averageResponseTime * (session.messageCount - 1) +
						value) /
					session.messageCount;
				break;
			case "satisfaction":
				session.userSatisfactionScore =
					(session.userSatisfactionScore *
						(session.messageCount - 1) +
						value) /
					session.messageCount;
				break;
		}
	}

	// Status assessment methods
	getResponseTimeStatus(responseTime) {
		const t = this.thresholds.responseTime;
		if (responseTime < t.excellent) return "優秀";
		if (responseTime < t.good) return "良好";
		if (responseTime < t.fair) return "普通";
		if (responseTime < t.poor) return "需改善";
		return "差";
	}

	getSatisfactionStatus(satisfaction) {
		const t = this.thresholds.satisfaction;
		if (satisfaction >= t.excellent) return "優秀";
		if (satisfaction >= t.good) return "良好";
		if (satisfaction >= t.fair) return "普通";
		if (satisfaction >= t.poor) return "需改善";
		return "差";
	}

	getHealthStatus(health) {
		if (health >= 0.9) return "優秀";
		if (health >= 0.7) return "良好";
		if (health >= 0.5) return "普通";
		if (health >= 0.3) return "需改善";
		return "差";
	}

	assessResponseTimeHealth() {
		const recent = this.getRecentMetrics(300000).responseTime;
		const avg = this.calculateAverageResponseTime(recent);

		if (avg < this.thresholds.responseTime.excellent) return 1.0;
		if (avg < this.thresholds.responseTime.good) return 0.8;
		if (avg < this.thresholds.responseTime.fair) return 0.6;
		if (avg < this.thresholds.responseTime.poor) return 0.4;
		return 0.2;
	}

	assessSatisfactionHealth() {
		const recent = this.getRecentMetrics(300000).userSatisfaction;
		const avg = this.calculateAverageSatisfaction(recent);

		if (avg >= this.thresholds.satisfaction.excellent) return 1.0;
		if (avg >= this.thresholds.satisfaction.good) return 0.8;
		if (avg >= this.thresholds.satisfaction.fair) return 0.6;
		if (avg >= this.thresholds.satisfaction.poor) return 0.4;
		return 0.2;
	}

	assessErrorRateHealth() {
		const recent = this.getRecentMetrics(300000).errorRates;
		const rate = this.calculateErrorRate(recent);

		if (rate <= this.thresholds.errorRate.excellent) return 1.0;
		if (rate <= this.thresholds.errorRate.good) return 0.8;
		if (rate <= this.thresholds.errorRate.fair) return 0.6;
		if (rate <= this.thresholds.errorRate.poor) return 0.4;
		return 0.2;
	}

	assessSystemResourceHealth() {
		const memoryUsage = this.realTimeMetrics.systemStatus.memoryUsage;

		if (memoryUsage < 0.5) return 1.0;
		if (memoryUsage < 0.7) return 0.8;
		if (memoryUsage < 0.8) return 0.6;
		if (memoryUsage < 0.9) return 0.4;
		return 0.2;
	}

	getCurrentSystemLoad() {
		// Simplified system load estimation
		const memoryLoad = this.realTimeMetrics.systemStatus.memoryUsage;
		const errorLoad =
			this.realTimeMetrics.currentSession.errorCount /
			Math.max(1, this.realTimeMetrics.currentSession.messageCount);

		return Math.max(memoryLoad, errorLoad);
	}

	handleVisibilityChange() {
		if (document.hidden) {
			console.log("📊 Page hidden, pausing active monitoring");
		} else {
			console.log("📊 Page visible, resuming active monitoring");
		}
	}

	// Export metrics for external analysis
	exportMetrics(format = "json") {
		const exportData = {
			metadata: {
				exportTime: new Date().toISOString(),
				sessionId: this.realTimeMetrics.currentSession.startTime,
				format: format,
			},
			metrics: this.metrics,
			realTimeMetrics: this.realTimeMetrics,
			dashboard: this.getPerformanceDashboard(),
		};

		if (format === "csv") {
			return this.convertToCSV(exportData);
		}

		return JSON.stringify(exportData, null, 2);
	}

	convertToCSV(data) {
		// Simplified CSV export for response times
		const csvLines = ["timestamp,responseTime,satisfaction,errorCount"];

		data.metrics.responseTime.forEach((metric) => {
			csvLines.push(`${metric.timestamp},${metric.responseTime},0,0`);
		});

		return csvLines.join("\n");
	}

	// Reset metrics for new session
	resetSessionMetrics() {
		this.realTimeMetrics.currentSession = {
			startTime: Date.now(),
			messageCount: 0,
			averageResponseTime: 0,
			userSatisfactionScore: 0,
			errorCount: 0,
		};

		console.log("🔄 Session metrics reset");
	}
}

export default PerformanceMonitoringSystem;
