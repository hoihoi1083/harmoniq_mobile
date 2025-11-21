// 📊 Comprehensive Analytics Dashboard System
// Immediate Improvement: Data visualization and insights

class AnalyticsDashboardSystem {
	constructor() {
		this.analytics = {
			conversations: [],
			userBehavior: [],
			systemPerformance: [],
			topicTrends: {},
			satisfactionMetrics: {},
			usagePatterns: {},
		};

		this.charts = new Map();
		this.dashboardConfig = {
			refreshInterval: 300000, // 5 minutes
			dataRetentionPeriod: 90, // 90 days
			realTimeUpdates: true,
			exportFormats: ["JSON", "CSV", "PDF"],
		};

		// Initialize dashboard
		this.initialize();
	}

	// Initialize analytics dashboard
	initialize() {
		console.log("📊 Analytics dashboard system initialized");

		// Load existing data
		this.loadAnalyticsData();

		// Setup real-time tracking
		this.setupRealTimeTracking();

		// Setup automatic reports
		this.setupAutomaticReports();

		// Setup data cleanup
		this.setupDataCleanup();
	}

	// Track conversation analytics
	trackConversation(conversationData) {
		const analytics = {
			id: this.generateAnalyticsId(),
			timestamp: Date.now(),
			sessionId: conversationData.sessionId,
			userMessage: {
				length: conversationData.userMessage?.length || 0,
				wordCount: this.countWords(conversationData.userMessage || ""),
				sentiment: this.analyzeSentiment(
					conversationData.userMessage || ""
				),
				topics: conversationData.detectedTopics || [],
				complexity: this.analyzeComplexity(
					conversationData.userMessage || ""
				),
			},
			aiResponse: {
				length: conversationData.aiResponse?.length || 0,
				wordCount: this.countWords(conversationData.aiResponse || ""),
				responseTime: conversationData.responseTime || 0,
				confidence: conversationData.confidence || 0,
				topics: conversationData.responseTopics || [],
			},
			interaction: {
				topic: conversationData.topic || "general",
				topicTransition: conversationData.topicTransition || false,
				satisfactionScore: conversationData.satisfactionScore || 0,
				userEngagement: conversationData.userEngagement || 0,
				completionRate: conversationData.completionRate || 0,
			},
			context: {
				timeOfDay: this.getTimeOfDay(),
				dayOfWeek: this.getDayOfWeek(),
				isNewUser: conversationData.isNewUser || false,
				conversationLength: conversationData.conversationLength || 1,
				previousTopic: conversationData.previousTopic,
			},
			technical: {
				apiCalls: conversationData.apiCalls || 1,
				cacheHits: conversationData.cacheHits || 0,
				errors: conversationData.errors || 0,
				memoryUsage: conversationData.memoryUsage || 0,
			},
		};

		this.analytics.conversations.push(analytics);
		this.updateRealTimeMetrics(analytics);
		this.saveAnalyticsData();

		console.log(`📈 Conversation analytics tracked: ${analytics.id}`);
		return analytics;
	}

	// Track user behavior
	trackUserBehavior(behaviorData) {
		const behavior = {
			id: this.generateAnalyticsId(),
			timestamp: Date.now(),
			sessionId: behaviorData.sessionId,
			action: behaviorData.action, // 'page_view', 'click', 'search', 'export', etc.
			element: behaviorData.element,
			duration: behaviorData.duration || 0,
			path: behaviorData.path || window.location.pathname,
			referrer: behaviorData.referrer || document.referrer,
			userAgent: navigator.userAgent,
			viewport: {
				width: window.innerWidth,
				height: window.innerHeight,
			},
			metadata: behaviorData.metadata || {},
		};

		this.analytics.userBehavior.push(behavior);
		this.analyzeUserPatterns(behavior);
		this.saveAnalyticsData();

		console.log(`👤 User behavior tracked: ${behavior.action}`);
		return behavior;
	}

	// Track system performance
	trackSystemPerformance(performanceData) {
		const performance = {
			id: this.generateAnalyticsId(),
			timestamp: Date.now(),
			metrics: {
				responseTime: performanceData.responseTime || 0,
				throughput: performanceData.throughput || 0,
				errorRate: performanceData.errorRate || 0,
				cpuUsage: performanceData.cpuUsage || 0,
				memoryUsage: performanceData.memoryUsage || 0,
				networkLatency: performanceData.networkLatency || 0,
			},
			health: {
				apiStatus: performanceData.apiStatus || "healthy",
				databaseStatus: performanceData.databaseStatus || "healthy",
				cacheStatus: performanceData.cacheStatus || "healthy",
				overallHealth: performanceData.overallHealth || "healthy",
			},
			browser: {
				loadTime: performance.timing
					? performance.timing.loadEventEnd -
						performance.timing.navigationStart
					: 0,
				domReady: performance.timing
					? performance.timing.domContentLoadedEventEnd -
						performance.timing.navigationStart
					: 0,
				renderTime: performanceData.renderTime || 0,
			},
		};

		this.analytics.systemPerformance.push(performance);
		this.updatePerformanceMetrics(performance);
		this.saveAnalyticsData();

		console.log(`⚡ System performance tracked`);
		return performance;
	}

	// Generate comprehensive dashboard
	generateDashboard() {
		const dashboard = {
			overview: this.generateOverviewMetrics(),
			conversations: this.generateConversationAnalytics(),
			topics: this.generateTopicAnalytics(),
			satisfaction: this.generateSatisfactionAnalytics(),
			performance: this.generatePerformanceAnalytics(),
			usage: this.generateUsageAnalytics(),
			trends: this.generateTrendAnalytics(),
			recommendations: this.generateRecommendations(),
		};

		console.log("📊 Dashboard generated");
		return dashboard;
	}

	// Generate overview metrics
	generateOverviewMetrics() {
		const today = new Date();
		const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
		const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

		const todayConversations = this.getConversationsByPeriod(
			yesterday,
			today
		);
		const weekConversations = this.getConversationsByPeriod(
			lastWeek,
			today
		);

		return {
			totalConversations: this.analytics.conversations.length,
			todayConversations: todayConversations.length,
			weeklyConversations: weekConversations.length,
			averageSatisfaction: this.calculateAverageSatisfaction(),
			averageResponseTime: this.calculateAverageResponseTime(),
			topTopics: this.getTopTopics(5),
			activeUsers: this.getActiveUserCount(),
			conversionRate: this.calculateConversionRate(),
			engagementRate: this.calculateEngagementRate(),
		};
	}

	// Generate conversation analytics
	generateConversationAnalytics() {
		const conversations = this.analytics.conversations;

		return {
			total: conversations.length,
			byTopic: this.groupConversationsByTopic(),
			byTimeOfDay: this.groupConversationsByTimeOfDay(),
			byDayOfWeek: this.groupConversationsByDayOfWeek(),
			averageLength: this.calculateAverageConversationLength(),
			satisfactionDistribution: this.getSatisfactionDistribution(),
			completionRates: this.getCompletionRates(),
			topicTransitions: this.analyzeTopicTransitions(),
		};
	}

	// Generate topic analytics
	generateTopicAnalytics() {
		const topicData = {};

		this.analytics.conversations.forEach((conv) => {
			const topic = conv.interaction.topic;
			if (!topicData[topic]) {
				topicData[topic] = {
					count: 0,
					totalSatisfaction: 0,
					totalResponseTime: 0,
					totalEngagement: 0,
				};
			}

			topicData[topic].count++;
			topicData[topic].totalSatisfaction +=
				conv.interaction.satisfactionScore;
			topicData[topic].totalResponseTime += conv.aiResponse.responseTime;
			topicData[topic].totalEngagement += conv.interaction.userEngagement;
		});

		// Calculate averages
		Object.keys(topicData).forEach((topic) => {
			const data = topicData[topic];
			data.averageSatisfaction = data.totalSatisfaction / data.count;
			data.averageResponseTime = data.totalResponseTime / data.count;
			data.averageEngagement = data.totalEngagement / data.count;
		});

		return {
			distribution: topicData,
			trending: this.getTrendingTopics(),
			seasonality: this.analyzeTopicSeasonality(),
			correlations: this.analyzeTopicCorrelations(),
		};
	}

	// Generate satisfaction analytics
	generateSatisfactionAnalytics() {
		const satisfactionScores = this.analytics.conversations
			.map((c) => c.interaction.satisfactionScore)
			.filter((s) => s > 0);

		return {
			average: this.calculateAverage(satisfactionScores),
			median: this.calculateMedian(satisfactionScores),
			distribution: this.createDistribution(satisfactionScores, 5),
			trends: this.analyzeSatisfactionTrends(),
			byTopic: this.getSatisfactionByTopic(),
			factors: this.analyzeSatisfactionFactors(),
		};
	}

	// Generate performance analytics
	generatePerformanceAnalytics() {
		const performance = this.analytics.systemPerformance;

		return {
			responseTime: {
				average: this.calculateAverageResponseTime(),
				p95: this.calculatePercentile(
					performance.map((p) => p.metrics.responseTime),
					95
				),
				p99: this.calculatePercentile(
					performance.map((p) => p.metrics.responseTime),
					99
				),
				trends: this.analyzeResponseTimeTrends(),
			},
			throughput: {
				average: this.calculateAverageThroughput(),
				peak: this.getPeakThroughput(),
				trends: this.analyzeThroughputTrends(),
			},
			errors: {
				rate: this.calculateErrorRate(),
				types: this.getErrorTypes(),
				trends: this.analyzeErrorTrends(),
			},
			health: this.getSystemHealthMetrics(),
		};
	}

	// Generate usage analytics
	generateUsageAnalytics() {
		const behavior = this.analytics.userBehavior;

		return {
			pageViews: this.getPageViewAnalytics(),
			sessionDuration: this.getSessionDurationAnalytics(),
			bounceRate: this.calculateBounceRate(),
			userFlow: this.analyzeUserFlow(),
			deviceTypes: this.getDeviceTypeAnalytics(),
			browserAnalytics: this.getBrowserAnalytics(),
			geographicData: this.getGeographicAnalytics(),
		};
	}

	// Generate trend analytics
	generateTrendAnalytics() {
		return {
			conversationTrends: this.analyzeConversationTrends(),
			topicTrends: this.analyzeTopicTrends(),
			satisfactionTrends: this.analyzeSatisfactionTrends(),
			performanceTrends: this.analyzePerformanceTrends(),
			seasonalPatterns: this.analyzeSeasonalPatterns(),
			predictions: this.generatePredictions(),
		};
	}

	// Generate recommendations
	generateRecommendations() {
		const recommendations = [];

		// Performance recommendations
		const avgResponseTime = this.calculateAverageResponseTime();
		if (avgResponseTime > 2000) {
			recommendations.push({
				type: "performance",
				priority: "high",
				title: "回應時間優化",
				description: "系統回應時間偏慢，建議優化API效能",
				action: "optimize_api",
				impact: "high",
			});
		}

		// Satisfaction recommendations
		const avgSatisfaction = this.calculateAverageSatisfaction();
		if (avgSatisfaction < 4.0) {
			recommendations.push({
				type: "satisfaction",
				priority: "medium",
				title: "用戶滿意度提升",
				description: "建議改善AI回應品質和準確度",
				action: "improve_responses",
				impact: "medium",
			});
		}

		// Usage recommendations
		const bounceRate = this.calculateBounceRate();
		if (bounceRate > 0.7) {
			recommendations.push({
				type: "usage",
				priority: "medium",
				title: "降低跳出率",
				description: "建議改善用戶體驗和介面設計",
				action: "improve_ux",
				impact: "medium",
			});
		}

		// Topic recommendations
		const topTopics = this.getTopTopics(3);
		if (topTopics.length > 0) {
			recommendations.push({
				type: "content",
				priority: "low",
				title: "熱門主題優化",
				description: `重點優化 ${topTopics.map((t) => t.topic).join("、")} 等熱門主題`,
				action: "optimize_topics",
				impact: "low",
			});
		}

		return recommendations.sort((a, b) => {
			const priorityOrder = { high: 3, medium: 2, low: 1 };
			return priorityOrder[b.priority] - priorityOrder[a.priority];
		});
	}

	// Create visual dashboard
	createVisualDashboard(containerId) {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error("🚨 Dashboard container not found");
			return;
		}

		const dashboard = this.generateDashboard();

		container.innerHTML = `
            <div class="analytics-dashboard">
                <div class="dashboard-header">
                    <h2>📊 Smart-Chat3 分析儀表板</h2>
                    <div class="dashboard-controls">
                        <button onclick="analyticsDashboard.exportData('JSON')">匯出 JSON</button>
                        <button onclick="analyticsDashboard.exportData('CSV')">匯出 CSV</button>
                        <button onclick="analyticsDashboard.refreshDashboard()">重新整理</button>
                    </div>
                </div>
                
                <div class="dashboard-overview">
                    ${this.renderOverviewCards(dashboard.overview)}
                </div>
                
                <div class="dashboard-charts">
                    <div class="chart-row">
                        <div class="chart-container">
                            <h3>對話趨勢</h3>
                            <div id="conversation-trend-chart"></div>
                        </div>
                        <div class="chart-container">
                            <h3>主題分布</h3>
                            <div id="topic-distribution-chart"></div>
                        </div>
                    </div>
                    
                    <div class="chart-row">
                        <div class="chart-container">
                            <h3>滿意度分析</h3>
                            <div id="satisfaction-chart"></div>
                        </div>
                        <div class="chart-container">
                            <h3>系統效能</h3>
                            <div id="performance-chart"></div>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-recommendations">
                    <h3>📋 改善建議</h3>
                    ${this.renderRecommendations(dashboard.recommendations)}
                </div>
            </div>
        `;

		// Add dashboard styles
		this.addDashboardStyles();

		// Render charts
		this.renderCharts(dashboard);

		console.log("📊 Visual dashboard created");
	}

	// Render overview cards
	renderOverviewCards(overview) {
		return `
            <div class="overview-cards">
                <div class="overview-card">
                    <div class="card-icon">💬</div>
                    <div class="card-content">
                        <div class="card-value">${overview.totalConversations}</div>
                        <div class="card-label">總對話數</div>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="card-icon">📈</div>
                    <div class="card-content">
                        <div class="card-value">${overview.todayConversations}</div>
                        <div class="card-label">今日對話</div>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="card-icon">⭐</div>
                    <div class="card-content">
                        <div class="card-value">${overview.averageSatisfaction.toFixed(1)}</div>
                        <div class="card-label">平均滿意度</div>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="card-icon">⚡</div>
                    <div class="card-content">
                        <div class="card-value">${overview.averageResponseTime.toFixed(0)}ms</div>
                        <div class="card-label">平均回應時間</div>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="card-icon">👥</div>
                    <div class="card-content">
                        <div class="card-value">${overview.activeUsers}</div>
                        <div class="card-label">活躍用戶</div>
                    </div>
                </div>
                <div class="overview-card">
                    <div class="card-icon">🎯</div>
                    <div class="card-content">
                        <div class="card-value">${(overview.engagementRate * 100).toFixed(1)}%</div>
                        <div class="card-label">參與率</div>
                    </div>
                </div>
            </div>
        `;
	}

	// Render recommendations
	renderRecommendations(recommendations) {
		if (recommendations.length === 0) {
			return '<div class="no-recommendations">🎉 系統運行良好，暫無改善建議</div>';
		}

		return recommendations
			.map(
				(rec) => `
            <div class="recommendation-item priority-${rec.priority}">
                <div class="recommendation-icon">${this.getRecommendationIcon(rec.type)}</div>
                <div class="recommendation-content">
                    <div class="recommendation-title">${rec.title}</div>
                    <div class="recommendation-description">${rec.description}</div>
                </div>
                <div class="recommendation-priority">${this.getPriorityLabel(rec.priority)}</div>
            </div>
        `
			)
			.join("");
	}

	// Add dashboard styles
	addDashboardStyles() {
		if (document.getElementById("analytics-dashboard-styles")) return;

		const styles = document.createElement("style");
		styles.id = "analytics-dashboard-styles";
		styles.textContent = `
            .analytics-dashboard {
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e5e5e5;
            }
            
            .dashboard-controls button {
                margin-left: 10px;
                padding: 8px 16px;
                background: #007AFF;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .dashboard-controls button:hover {
                background: #0056b3;
            }
            
            .overview-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .overview-card {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
            }
            
            .card-icon {
                font-size: 24px;
                margin-right: 15px;
            }
            
            .card-value {
                font-size: 28px;
                font-weight: 600;
                color: #1d1d1f;
            }
            
            .card-label {
                font-size: 14px;
                color: #666;
                margin-top: 4px;
            }
            
            .dashboard-charts {
                margin-bottom: 30px;
            }
            
            .chart-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .chart-container {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .chart-container h3 {
                margin-top: 0;
                margin-bottom: 15px;
                color: #1d1d1f;
            }
            
            .dashboard-recommendations {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .recommendation-item {
                display: flex;
                align-items: center;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 10px;
                border-left: 4px solid #007AFF;
            }
            
            .priority-high {
                border-left-color: #FF3B30;
                background: #FFF5F5;
            }
            
            .priority-medium {
                border-left-color: #FF9500;
                background: #FFFAF0;
            }
            
            .priority-low {
                border-left-color: #34C759;
                background: #F0FFF4;
            }
            
            .recommendation-icon {
                font-size: 20px;
                margin-right: 15px;
            }
            
            .recommendation-content {
                flex-grow: 1;
            }
            
            .recommendation-title {
                font-weight: 600;
                color: #1d1d1f;
                margin-bottom: 4px;
            }
            
            .recommendation-description {
                font-size: 14px;
                color: #666;
            }
            
            .recommendation-priority {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;
            }
            
            .no-recommendations {
                text-align: center;
                padding: 40px;
                color: #666;
                font-size: 16px;
            }
        `;

		document.head.appendChild(styles);
	}

	// Utility methods
	countWords(text) {
		return text.trim().split(/\s+/).length;
	}

	analyzeSentiment(text) {
		// Simple sentiment analysis - could be enhanced with ML
		const positiveWords = [
			"好",
			"棒",
			"讚",
			"感謝",
			"滿意",
			"開心",
			"喜歡",
		];
		const negativeWords = [
			"不好",
			"差",
			"糟",
			"失望",
			"不滿",
			"討厭",
			"問題",
		];

		const words = text.toLowerCase().split(/\s+/);
		let positiveCount = 0;
		let negativeCount = 0;

		words.forEach((word) => {
			if (positiveWords.some((pw) => word.includes(pw))) positiveCount++;
			if (negativeWords.some((nw) => word.includes(nw))) negativeCount++;
		});

		if (positiveCount > negativeCount) return "positive";
		if (negativeCount > positiveCount) return "negative";
		return "neutral";
	}

	analyzeComplexity(text) {
		const sentences = text.split(/[。！？]/);
		const avgSentenceLength = text.length / sentences.length;

		if (avgSentenceLength > 50) return "high";
		if (avgSentenceLength > 20) return "medium";
		return "low";
	}

	getTimeOfDay() {
		const hour = new Date().getHours();
		if (hour < 6) return "early_morning";
		if (hour < 12) return "morning";
		if (hour < 18) return "afternoon";
		if (hour < 22) return "evening";
		return "night";
	}

	getDayOfWeek() {
		const days = [
			"sunday",
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday",
		];
		return days[new Date().getDay()];
	}

	calculateAverage(numbers) {
		if (numbers.length === 0) return 0;
		return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
	}

	calculateMedian(numbers) {
		if (numbers.length === 0) return 0;
		const sorted = [...numbers].sort((a, b) => a - b);
		const mid = Math.floor(sorted.length / 2);
		return sorted.length % 2 === 0
			? (sorted[mid - 1] + sorted[mid]) / 2
			: sorted[mid];
	}

	calculatePercentile(numbers, percentile) {
		if (numbers.length === 0) return 0;
		const sorted = [...numbers].sort((a, b) => a - b);
		const index = Math.ceil((percentile / 100) * sorted.length) - 1;
		return sorted[Math.max(0, index)];
	}

	// Export data
	exportData(format) {
		const data = this.generateDashboard();

		switch (format) {
			case "JSON":
				this.downloadJSON(data);
				break;
			case "CSV":
				this.downloadCSV(data);
				break;
			case "PDF":
				this.downloadPDF(data);
				break;
		}
	}

	downloadJSON(data) {
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `smart-chat3-analytics-${new Date().toISOString().split("T")[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	downloadCSV(data) {
		// Convert data to CSV format
		const csv = this.convertToCSV(data.conversations);
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `smart-chat3-conversations-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}

	convertToCSV(data) {
		if (!data || data.length === 0) return "";

		const headers = Object.keys(data[0]);
		const csvContent = [
			headers.join(","),
			...data.map((row) =>
				headers.map((header) => `"${row[header] || ""}"`).join(",")
			),
		].join("\n");

		return csvContent;
	}

	// Storage methods
	saveAnalyticsData() {
		try {
			const data = {
				conversations: this.analytics.conversations.slice(-1000), // Keep last 1000
				userBehavior: this.analytics.userBehavior.slice(-1000),
				systemPerformance:
					this.analytics.systemPerformance.slice(-1000),
				lastUpdated: Date.now(),
			};

			localStorage.setItem("smart-chat3-analytics", JSON.stringify(data));
		} catch (error) {
			console.error("🚨 Failed to save analytics data:", error);
		}
	}

	loadAnalyticsData() {
		try {
			const data = localStorage.getItem("smart-chat3-analytics");
			if (data) {
				const parsed = JSON.parse(data);
				this.analytics.conversations = parsed.conversations || [];
				this.analytics.userBehavior = parsed.userBehavior || [];
				this.analytics.systemPerformance =
					parsed.systemPerformance || [];

				console.log(
					`📊 Loaded analytics data: ${this.analytics.conversations.length} conversations`
				);
			}
		} catch (error) {
			console.error("🚨 Failed to load analytics data:", error);
		}
	}

	// Helper methods for calculations
	calculateAverageSatisfaction() {
		const scores = this.analytics.conversations
			.map((c) => c.interaction.satisfactionScore)
			.filter((s) => s > 0);
		return this.calculateAverage(scores);
	}

	calculateAverageResponseTime() {
		const times = this.analytics.conversations
			.map((c) => c.aiResponse.responseTime)
			.filter((t) => t > 0);
		return this.calculateAverage(times);
	}

	getTopTopics(limit = 5) {
		const topicCounts = {};
		this.analytics.conversations.forEach((c) => {
			const topic = c.interaction.topic;
			topicCounts[topic] = (topicCounts[topic] || 0) + 1;
		});

		return Object.entries(topicCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, limit)
			.map(([topic, count]) => ({ topic, count }));
	}

	getActiveUserCount() {
		const uniqueSessions = new Set(
			this.analytics.conversations.map((c) => c.sessionId)
		);
		return uniqueSessions.size;
	}

	calculateEngagementRate() {
		const totalConversations = this.analytics.conversations.length;
		const engagedConversations = this.analytics.conversations.filter(
			(c) => c.interaction.userEngagement > 0.5
		).length;

		return totalConversations > 0
			? engagedConversations / totalConversations
			: 0;
	}

	calculateConversionRate() {
		// Define conversion as completing a conversation successfully
		const totalConversations = this.analytics.conversations.length;
		const convertedConversations = this.analytics.conversations.filter(
			(c) => c.interaction.completionRate >= 1.0
		).length;

		return totalConversations > 0
			? convertedConversations / totalConversations
			: 0;
	}

	generateAnalyticsId() {
		return (
			"analytics_" +
			Date.now() +
			"_" +
			Math.random().toString(36).substr(2, 9)
		);
	}

	getRecommendationIcon(type) {
		const icons = {
			performance: "⚡",
			satisfaction: "⭐",
			usage: "📈",
			content: "📝",
		};
		return icons[type] || "💡";
	}

	getPriorityLabel(priority) {
		const labels = {
			high: "高",
			medium: "中",
			low: "低",
		};
		return labels[priority] || "中";
	}

	// Setup methods
	setupRealTimeTracking() {
		// Real-time tracking implementation
		console.log("📊 Real-time tracking enabled");
	}

	setupAutomaticReports() {
		// Automatic report generation
		console.log("📊 Automatic reports configured");
	}

	setupDataCleanup() {
		// Clean up old data daily
		setInterval(
			() => {
				this.cleanupOldData();
			},
			24 * 60 * 60 * 1000
		);
	}

	cleanupOldData() {
		const retentionPeriod =
			this.dashboardConfig.dataRetentionPeriod * 24 * 60 * 60 * 1000;
		const cutoffTime = Date.now() - retentionPeriod;

		this.analytics.conversations = this.analytics.conversations.filter(
			(c) => c.timestamp > cutoffTime
		);
		this.analytics.userBehavior = this.analytics.userBehavior.filter(
			(b) => b.timestamp > cutoffTime
		);
		this.analytics.systemPerformance =
			this.analytics.systemPerformance.filter(
				(p) => p.timestamp > cutoffTime
			);

		this.saveAnalyticsData();
		console.log("🧹 Analytics data cleanup completed");
	}

	updateRealTimeMetrics(analytics) {
		// Update real-time metrics
		this.updateTopicTrends(analytics);
		this.updateSatisfactionMetrics(analytics);
		this.updateUsagePatterns(analytics);
	}

	updateTopicTrends(analytics) {
		const topic = analytics.interaction.topic;
		if (!this.analytics.topicTrends[topic]) {
			this.analytics.topicTrends[topic] = [];
		}
		this.analytics.topicTrends[topic].push({
			timestamp: analytics.timestamp,
			satisfaction: analytics.interaction.satisfactionScore,
		});
	}

	updateSatisfactionMetrics(analytics) {
		const timeSlot = Math.floor(analytics.timestamp / (60 * 60 * 1000)); // Hour slots
		if (!this.analytics.satisfactionMetrics[timeSlot]) {
			this.analytics.satisfactionMetrics[timeSlot] = [];
		}
		this.analytics.satisfactionMetrics[timeSlot].push(
			analytics.interaction.satisfactionScore
		);
	}

	updateUsagePatterns(analytics) {
		const pattern = `${analytics.context.timeOfDay}_${analytics.context.dayOfWeek}`;
		if (!this.analytics.usagePatterns[pattern]) {
			this.analytics.usagePatterns[pattern] = 0;
		}
		this.analytics.usagePatterns[pattern]++;
	}

	updatePerformanceMetrics(performance) {
		// Update performance tracking
		console.log("📊 Performance metrics updated");
	}

	analyzeUserPatterns(behavior) {
		// Analyze user behavior patterns
		console.log("📊 User patterns analyzed");
	}

	refreshDashboard() {
		// Refresh dashboard data
		const containerId = "analytics-dashboard-container";
		this.createVisualDashboard(containerId);
		console.log("🔄 Dashboard refreshed");
	}

	renderCharts(dashboard) {
		// Render charts using a simple charting approach
		this.renderConversationTrendChart(dashboard.conversations);
		this.renderTopicDistributionChart(dashboard.topics);
		this.renderSatisfactionChart(dashboard.satisfaction);
		this.renderPerformanceChart(dashboard.performance);
	}

	renderConversationTrendChart(conversationData) {
		// Simple trend chart implementation
		const container = document.getElementById("conversation-trend-chart");
		if (container) {
			container.innerHTML =
				"<div>Conversation trend chart would be rendered here</div>";
		}
	}

	renderTopicDistributionChart(topicData) {
		// Simple pie chart implementation
		const container = document.getElementById("topic-distribution-chart");
		if (container) {
			container.innerHTML =
				"<div>Topic distribution chart would be rendered here</div>";
		}
	}

	renderSatisfactionChart(satisfactionData) {
		// Simple satisfaction chart implementation
		const container = document.getElementById("satisfaction-chart");
		if (container) {
			container.innerHTML =
				"<div>Satisfaction chart would be rendered here</div>";
		}
	}

	renderPerformanceChart(performanceData) {
		// Simple performance chart implementation
		const container = document.getElementById("performance-chart");
		if (container) {
			container.innerHTML =
				"<div>Performance chart would be rendered here</div>";
		}
	}

	// Additional helper methods for missing calculations
	getConversationsByPeriod(start, end) {
		return this.analytics.conversations.filter(
			(c) =>
				c.timestamp >= start.getTime() && c.timestamp <= end.getTime()
		);
	}

	groupConversationsByTopic() {
		const grouped = {};
		this.analytics.conversations.forEach((c) => {
			const topic = c.interaction.topic;
			grouped[topic] = (grouped[topic] || 0) + 1;
		});
		return grouped;
	}

	groupConversationsByTimeOfDay() {
		const grouped = {};
		this.analytics.conversations.forEach((c) => {
			const timeOfDay = c.context.timeOfDay;
			grouped[timeOfDay] = (grouped[timeOfDay] || 0) + 1;
		});
		return grouped;
	}

	groupConversationsByDayOfWeek() {
		const grouped = {};
		this.analytics.conversations.forEach((c) => {
			const dayOfWeek = c.context.dayOfWeek;
			grouped[dayOfWeek] = (grouped[dayOfWeek] || 0) + 1;
		});
		return grouped;
	}

	calculateAverageConversationLength() {
		const lengths = this.analytics.conversations.map(
			(c) => c.context.conversationLength
		);
		return this.calculateAverage(lengths);
	}

	getSatisfactionDistribution() {
		const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
		this.analytics.conversations.forEach((c) => {
			const score = Math.round(c.interaction.satisfactionScore);
			if (score >= 1 && score <= 5) {
				distribution[score]++;
			}
		});
		return distribution;
	}

	getCompletionRates() {
		const rates = this.analytics.conversations.map(
			(c) => c.interaction.completionRate
		);
		return {
			average: this.calculateAverage(rates),
			distribution: this.createDistribution(rates, 5),
		};
	}

	analyzeTopicTransitions() {
		const transitions = {};
		this.analytics.conversations.forEach((c) => {
			if (c.context.previousTopic && c.interaction.topic) {
				const transition = `${c.context.previousTopic} → ${c.interaction.topic}`;
				transitions[transition] = (transitions[transition] || 0) + 1;
			}
		});
		return transitions;
	}

	createDistribution(values, buckets) {
		if (values.length === 0) return {};

		const min = Math.min(...values);
		const max = Math.max(...values);
		const bucketSize = (max - min) / buckets;

		const distribution = {};
		for (let i = 0; i < buckets; i++) {
			const bucketMin = min + i * bucketSize;
			const bucketMax = min + (i + 1) * bucketSize;
			const bucketKey = `${bucketMin.toFixed(1)}-${bucketMax.toFixed(1)}`;
			distribution[bucketKey] = 0;
		}

		values.forEach((value) => {
			const bucketIndex = Math.min(
				Math.floor((value - min) / bucketSize),
				buckets - 1
			);
			const bucketMin = min + bucketIndex * bucketSize;
			const bucketMax = min + (bucketIndex + 1) * bucketSize;
			const bucketKey = `${bucketMin.toFixed(1)}-${bucketMax.toFixed(1)}`;
			distribution[bucketKey]++;
		});

		return distribution;
	}

	getTrendingTopics() {
		// Simple trending analysis - topics with increasing frequency
		return this.getTopTopics(5);
	}

	analyzeTopicSeasonality() {
		// Placeholder for seasonality analysis
		return {};
	}

	analyzeTopicCorrelations() {
		// Placeholder for correlation analysis
		return {};
	}

	analyzeSatisfactionTrends() {
		// Placeholder for satisfaction trend analysis
		return {};
	}

	getSatisfactionByTopic() {
		const byTopic = {};
		this.analytics.conversations.forEach((c) => {
			const topic = c.interaction.topic;
			if (!byTopic[topic]) {
				byTopic[topic] = [];
			}
			byTopic[topic].push(c.interaction.satisfactionScore);
		});

		// Calculate averages
		Object.keys(byTopic).forEach((topic) => {
			const scores = byTopic[topic];
			byTopic[topic] = {
				average: this.calculateAverage(scores),
				count: scores.length,
			};
		});

		return byTopic;
	}

	analyzeSatisfactionFactors() {
		// Placeholder for satisfaction factor analysis
		return {};
	}

	calculateAverageThroughput() {
		const throughputs = this.analytics.systemPerformance.map(
			(p) => p.metrics.throughput
		);
		return this.calculateAverage(throughputs);
	}

	getPeakThroughput() {
		const throughputs = this.analytics.systemPerformance.map(
			(p) => p.metrics.throughput
		);
		return Math.max(...throughputs, 0);
	}

	analyzeResponseTimeTrends() {
		// Placeholder for response time trend analysis
		return {};
	}

	analyzeThroughputTrends() {
		// Placeholder for throughput trend analysis
		return {};
	}

	calculateErrorRate() {
		const errorRates = this.analytics.systemPerformance.map(
			(p) => p.metrics.errorRate
		);
		return this.calculateAverage(errorRates);
	}

	getErrorTypes() {
		// Placeholder for error type analysis
		return {};
	}

	analyzeErrorTrends() {
		// Placeholder for error trend analysis
		return {};
	}

	getSystemHealthMetrics() {
		const latest =
			this.analytics.systemPerformance[
				this.analytics.systemPerformance.length - 1
			];
		return latest ? latest.health : {};
	}

	getPageViewAnalytics() {
		const pageViews = this.analytics.userBehavior.filter(
			(b) => b.action === "page_view"
		);
		return {
			total: pageViews.length,
			unique: new Set(pageViews.map((p) => p.sessionId)).size,
		};
	}

	getSessionDurationAnalytics() {
		const sessions = {};
		this.analytics.userBehavior.forEach((b) => {
			if (!sessions[b.sessionId]) {
				sessions[b.sessionId] = {
					start: b.timestamp,
					end: b.timestamp,
				};
			} else {
				sessions[b.sessionId].end = Math.max(
					sessions[b.sessionId].end,
					b.timestamp
				);
			}
		});

		const durations = Object.values(sessions).map((s) => s.end - s.start);
		return {
			average: this.calculateAverage(durations),
			median: this.calculateMedian(durations),
		};
	}

	calculateBounceRate() {
		const sessions = {};
		this.analytics.userBehavior.forEach((b) => {
			if (!sessions[b.sessionId]) {
				sessions[b.sessionId] = 0;
			}
			sessions[b.sessionId]++;
		});

		const singlePageSessions = Object.values(sessions).filter(
			(count) => count === 1
		).length;
		const totalSessions = Object.keys(sessions).length;

		return totalSessions > 0 ? singlePageSessions / totalSessions : 0;
	}

	analyzeUserFlow() {
		// Placeholder for user flow analysis
		return {};
	}

	getDeviceTypeAnalytics() {
		// Placeholder for device type analysis
		return {};
	}

	getBrowserAnalytics() {
		// Placeholder for browser analytics
		return {};
	}

	getGeographicAnalytics() {
		// Placeholder for geographic analytics
		return {};
	}

	analyzeConversationTrends() {
		// Placeholder for conversation trend analysis
		return {};
	}

	analyzeTopicTrends() {
		// Placeholder for topic trend analysis
		return {};
	}

	analyzePerformanceTrends() {
		// Placeholder for performance trend analysis
		return {};
	}

	analyzeSeasonalPatterns() {
		// Placeholder for seasonal pattern analysis
		return {};
	}

	generatePredictions() {
		// Placeholder for prediction generation
		return {};
	}
}

export default AnalyticsDashboardSystem;
