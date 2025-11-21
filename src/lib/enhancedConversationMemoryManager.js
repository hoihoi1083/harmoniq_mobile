// 🧠 Enhanced Conversation Memory System
// Phase 2 Implementation - Advanced conversation context management

import mongoose from "mongoose";

// Enhanced conversation history schema
const ConversationHistorySchema = new mongoose.Schema({
	sessionId: { type: String, required: true, index: true },
	messageId: { type: String, required: true, unique: true },
	timestamp: { type: Date, default: Date.now },
	userMessage: { type: String, required: true },
	assistantResponse: { type: String, required: true },

	// Enhanced context tracking
	contextData: {
		detectedTopic: String,
		confidence: Number,
		emotionalState: String,
		urgencyLevel: String,
		extractedEntities: [String], // Names, dates, specific concerns
		topicTransition: {
			fromTopic: String,
			toTopic: String,
			transitionType: String, // smooth, related, shift, expansion
			smoothness: Number,
		},
	},

	// Quality metrics
	responseQuality: {
		score: Number,
		confidence: String,
		validationPassed: Boolean,
		repairApplied: Boolean,
	},

	// User engagement tracking
	userEngagement: {
		responseTime: Number, // Time to user's next message
		messageLength: Number,
		engagementScore: Number, // 0-1 based on response quality
		satisfactionIndicators: [String], // "thank you", "helpful", etc.
	},
});

// Create conversation history model
const ConversationHistory =
	mongoose.models.ConversationHistory ||
	mongoose.model("ConversationHistory", ConversationHistorySchema);

class EnhancedConversationMemoryManager {
	constructor() {
		this.maxContextLength = 15; // Increased from 10
		this.maxTopicHistory = 8;
		this.contextDecayHours = 24; // Context becomes less relevant after 24 hours

		// Entity recognition patterns
		this.entityPatterns = {
			dates: /(\d{4}[年\-\/]\d{1,2}[月\-\/]\d{1,2})/g,
			names: /(我叫|我是|名字是)([^，。\s]{2,4})/g,
			relationships: /(男友|女友|老公|老婆|伴侶|對象)/g,
			emotions: /(開心|難過|擔心|焦慮|困擾|煩惱|害怕|期待|希望)/g,
			timeframes: /(最近|這幾天|上個月|去年|明年|下個月)/g,
		};

		// Topic relationship mapping for smart transitions
		this.topicRelationships = {
			感情: {
				highly_related: ["人際關係", "因緣"],
				moderately_related: ["子女", "健康"],
				distantly_related: ["財運", "工作"],
				unrelated: ["居家佈局"],
			},
			財運: {
				highly_related: ["工作"],
				moderately_related: ["居家佈局", "因緣"],
				distantly_related: ["人際關係"],
				unrelated: ["感情", "子女", "健康"],
			},
			工作: {
				highly_related: ["財運", "人際關係"],
				moderately_related: ["健康", "因緣"],
				distantly_related: ["感情"],
				unrelated: ["子女", "居家佈局"],
			},
			健康: {
				highly_related: ["居家佈局"],
				moderately_related: ["工作", "感情"],
				distantly_related: ["財運"],
				unrelated: ["人際關係", "子女", "因緣"],
			},
			人際關係: {
				highly_related: ["感情", "工作"],
				moderately_related: ["因緣"],
				distantly_related: ["財運", "子女"],
				unrelated: ["健康", "居家佈局"],
			},
			子女: {
				highly_related: ["感情", "因緣"],
				moderately_related: ["健康"],
				distantly_related: ["人際關係"],
				unrelated: ["財運", "工作", "居家佈局"],
			},
			因緣: {
				highly_related: ["感情", "子女"],
				moderately_related: ["人際關係", "財運", "工作"],
				distantly_related: ["健康"],
				unrelated: ["居家佈局"],
			},
			居家佈局: {
				highly_related: ["健康", "財運"],
				moderately_related: [],
				distantly_related: ["工作"],
				unrelated: ["感情", "人際關係", "子女", "因緣"],
			},
		};
	}

	// Enhanced context preservation with deep analysis
	async preserveConversationContext(
		sessionId,
		userMessage,
		assistantResponse,
		aiAnalysis
	) {
		try {
			// Generate unique message ID
			const messageId = `${sessionId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

			// Extract entities from user message
			const extractedEntities = this.extractEntities(userMessage);

			// Get conversation history for context analysis
			const recentHistory = await this.getRecentHistory(sessionId, 5);

			// Analyze topic transition
			const topicTransition = this.analyzeTopicTransition(
				recentHistory,
				aiAnalysis.detectedTopic
			);

			// Calculate user engagement metrics
			const userEngagement = await this.calculateUserEngagement(
				sessionId,
				userMessage,
				recentHistory
			);

			// Create comprehensive conversation record
			const conversationRecord = new ConversationHistory({
				sessionId,
				messageId,
				userMessage,
				assistantResponse,
				contextData: {
					detectedTopic: aiAnalysis.detectedTopic,
					confidence: aiAnalysis.confidence,
					emotionalState: aiAnalysis.emotionalState,
					urgencyLevel: aiAnalysis.urgencyLevel,
					extractedEntities,
					topicTransition,
				},
				responseQuality: {
					score: aiAnalysis.responseQuality?.score || 0.8,
					confidence:
						aiAnalysis.responseQuality?.confidence || "medium",
					validationPassed:
						aiAnalysis.responseQuality?.passed || true,
					repairApplied:
						aiAnalysis.responseQuality?.repairApplied || false,
				},
				userEngagement,
			});

			await conversationRecord.save();

			// Generate enhanced context for next interaction
			const enhancedContext =
				await this.generateEnhancedContext(sessionId);

			console.log("💾 Enhanced conversation context preserved:", {
				messageId,
				topic: aiAnalysis.detectedTopic,
				transition: topicTransition.transitionType,
				engagement: userEngagement.engagementScore,
			});

			return enhancedContext;
		} catch (error) {
			console.error("🚨 Enhanced context preservation error:", error);
			// Fallback to basic context preservation
			return this.fallbackContextPreservation(
				sessionId,
				userMessage,
				aiAnalysis
			);
		}
	}

	// Advanced entity extraction
	extractEntities(message) {
		const entities = [];

		// Extract different types of entities
		for (const [type, pattern] of Object.entries(this.entityPatterns)) {
			const matches = [...message.matchAll(pattern)];
			if (matches.length > 0) {
				entities.push({
					type,
					values: matches.map(
						(match) => match[0] || match[2] || match[1]
					),
					count: matches.length,
				});
			}
		}

		return entities;
	}

	// Get recent conversation history with context decay
	async getRecentHistory(sessionId, limit = 10) {
		try {
			const cutoffTime = new Date(
				Date.now() - this.contextDecayHours * 60 * 60 * 1000
			);

			return await ConversationHistory.find({
				sessionId,
				timestamp: { $gte: cutoffTime },
			})
				.sort({ timestamp: -1 })
				.limit(limit)
				.lean();
		} catch (error) {
			console.error("🚨 Error fetching conversation history:", error);
			return [];
		}
	}

	// Advanced topic transition analysis
	analyzeTopicTransition(recentHistory, newTopic) {
		if (!recentHistory.length) {
			return {
				transitionType: "new_conversation",
				fromTopic: null,
				toTopic: newTopic,
				smoothness: 1.0,
				explanation: "開始新的對話",
			};
		}

		const lastMessage = recentHistory[0];
		const previousTopic = lastMessage.contextData?.detectedTopic;

		if (!previousTopic || previousTopic === newTopic) {
			return {
				transitionType: "topic_continuation",
				fromTopic: previousTopic,
				toTopic: newTopic,
				smoothness: 0.95,
				explanation: "繼續討論同一話題",
			};
		}

		// Analyze relationship between topics
		const relationship = this.getTopicRelationship(previousTopic, newTopic);

		let transitionType, smoothness;

		switch (relationship) {
			case "highly_related":
				transitionType = "smooth_transition";
				smoothness = 0.9;
				break;
			case "moderately_related":
				transitionType = "related_transition";
				smoothness = 0.7;
				break;
			case "distantly_related":
				transitionType = "topic_shift";
				smoothness = 0.5;
				break;
			default:
				transitionType = "topic_jump";
				smoothness = 0.3;
		}

		// Check for topic oscillation (jumping back and forth)
		const topicOscillation = this.detectTopicOscillation(
			recentHistory,
			newTopic
		);
		if (topicOscillation) {
			smoothness -= 0.2; // Penalize oscillation
		}

		return {
			transitionType,
			fromTopic: previousTopic,
			toTopic: newTopic,
			smoothness: Math.max(smoothness, 0.1),
			explanation: this.generateTransitionExplanation(
				previousTopic,
				newTopic,
				relationship
			),
			oscillationDetected: topicOscillation,
		};
	}

	// Get relationship between two topics
	getTopicRelationship(topic1, topic2) {
		const relationships = this.topicRelationships[topic1];
		if (!relationships) return "unrelated";

		for (const [relationship, topics] of Object.entries(relationships)) {
			if (topics.includes(topic2)) {
				return relationship;
			}
		}

		return "unrelated";
	}

	// Detect topic oscillation pattern
	detectTopicOscillation(recentHistory, newTopic) {
		if (recentHistory.length < 3) return false;

		const recentTopics = recentHistory
			.slice(0, 4)
			.map((msg) => msg.contextData?.detectedTopic)
			.filter(Boolean);

		// Check if newTopic appeared in last 3 messages but not the immediate previous
		const lastTopic = recentTopics[0];
		const hasRecentOccurrence = recentTopics.slice(1).includes(newTopic);

		return hasRecentOccurrence && lastTopic !== newTopic;
	}

	// Generate transition explanation
	generateTransitionExplanation(fromTopic, toTopic, relationship) {
		const explanations = {
			highly_related: `${fromTopic}和${toTopic}有密切關聯`,
			moderately_related: `從${fromTopic}延伸到${toTopic}是合理的`,
			distantly_related: `${fromTopic}和${toTopic}有些關聯`,
			unrelated: `從${fromTopic}轉向${toTopic}是全新的方向`,
		};

		return explanations[relationship] || `話題從${fromTopic}轉到${toTopic}`;
	}

	// Calculate user engagement metrics
	async calculateUserEngagement(sessionId, userMessage, recentHistory) {
		const messageLength = userMessage.length;
		let responseTime = null;
		let engagementScore = 0.5; // Default neutral engagement

		// Calculate response time if we have previous messages
		if (recentHistory.length > 0) {
			const lastMessage = recentHistory[0];
			responseTime =
				Date.now() - new Date(lastMessage.timestamp).getTime();

			// Faster responses indicate higher engagement (within reason)
			if (responseTime < 30000)
				engagementScore += 0.2; // Under 30 seconds
			else if (responseTime < 300000)
				engagementScore += 0.1; // Under 5 minutes
			else if (responseTime > 3600000) engagementScore -= 0.2; // Over 1 hour
		}

		// Message length indicates engagement
		if (messageLength > 50)
			engagementScore += 0.2; // Detailed messages
		else if (messageLength < 10) engagementScore -= 0.1; // Very short messages

		// Detect satisfaction indicators
		const satisfactionIndicators =
			this.detectSatisfactionIndicators(userMessage);
		if (satisfactionIndicators.length > 0) {
			engagementScore += 0.3;
		}

		// Detect frustration indicators
		const frustrationIndicators =
			this.detectFrustrationIndicators(userMessage);
		if (frustrationIndicators.length > 0) {
			engagementScore -= 0.3;
		}

		return {
			responseTime,
			messageLength,
			engagementScore: Math.max(0, Math.min(1, engagementScore)),
			satisfactionIndicators,
			frustrationIndicators,
		};
	}

	// Detect satisfaction indicators in user messages
	detectSatisfactionIndicators(message) {
		const indicators = [];
		const satisfactionPatterns = [
			/謝謝|感謝|太好了|很棒|有幫助|明白了|清楚了/g,
			/讚|👍|好的|收到|了解/g,
		];

		satisfactionPatterns.forEach((pattern) => {
			const matches = message.match(pattern);
			if (matches) {
				indicators.push(...matches);
			}
		});

		return [...new Set(indicators)]; // Remove duplicates
	}

	// Detect frustration indicators
	detectFrustrationIndicators(message) {
		const indicators = [];
		const frustrationPatterns = [
			/不懂|不明白|看不懂|聽不懂|糊塗|困惑/g,
			/重複|又是|還是|一樣的|沒用/g,
			/算了|不要了|不問了|放棄/g,
		];

		frustrationPatterns.forEach((pattern) => {
			const matches = message.match(pattern);
			if (matches) {
				indicators.push(...matches);
			}
		});

		return [...new Set(indicators)];
	}

	// Generate enhanced context for next interaction
	async generateEnhancedContext(sessionId) {
		try {
			const recentHistory = await this.getRecentHistory(
				sessionId,
				this.maxContextLength
			);

			if (!recentHistory.length) {
				return {
					conversationDepth: 0,
					dominantTopics: [],
					emotionalJourney: [],
					engagementTrend: "neutral",
					contextSummary: "新的對話開始",
				};
			}

			// Analyze conversation patterns
			const topicDistribution =
				this.analyzeTopicDistribution(recentHistory);
			const emotionalJourney =
				this.analyzeEmotionalJourney(recentHistory);
			const engagementTrend = this.analyzeEngagementTrend(recentHistory);
			const conversationPatterns =
				this.detectConversationPatterns(recentHistory);

			return {
				conversationDepth: recentHistory.length,
				dominantTopics: topicDistribution.slice(0, 3), // Top 3 topics
				emotionalJourney,
				engagementTrend,
				conversationPatterns,
				contextSummary: this.generateContextSummary(recentHistory),
				recommendations: this.generateContextualRecommendations(
					topicDistribution,
					emotionalJourney,
					engagementTrend
				),
			};
		} catch (error) {
			console.error("🚨 Error generating enhanced context:", error);
			return { conversationDepth: 0, error: "Context generation failed" };
		}
	}

	// Analyze topic distribution in conversation
	analyzeTopicDistribution(history) {
		const topicCounts = {};

		history.forEach((msg) => {
			const topic = msg.contextData?.detectedTopic;
			if (topic) {
				topicCounts[topic] = (topicCounts[topic] || 0) + 1;
			}
		});

		return Object.entries(topicCounts)
			.sort(([, a], [, b]) => b - a)
			.map(([topic, count]) => ({
				topic,
				count,
				percentage: count / history.length,
			}));
	}

	// Analyze emotional journey through conversation
	analyzeEmotionalJourney(history) {
		return history
			.slice(0, 5) // Last 5 messages
			.reverse() // Chronological order
			.map((msg) => ({
				timestamp: msg.timestamp,
				emotionalState: msg.contextData?.emotionalState || "neutral",
				urgencyLevel: msg.contextData?.urgencyLevel || "medium",
			}));
	}

	// Analyze engagement trend
	analyzeEngagementTrend(history) {
		const engagementScores = history
			.slice(0, 5)
			.map((msg) => msg.userEngagement?.engagementScore || 0.5);

		if (engagementScores.length < 2) return "neutral";

		const recent = engagementScores.slice(0, 2).reduce((a, b) => a + b) / 2;
		const earlierScores = engagementScores.slice(2);
		const earlier =
			earlierScores.length > 0
				? earlierScores.reduce((a, b) => a + b) / earlierScores.length
				: 0.5; // Default neutral score if no earlier data

		const trend = recent - earlier;

		if (trend > 0.1) return "increasing";
		if (trend < -0.1) return "decreasing";
		return "stable";
	}

	// Detect conversation patterns
	detectConversationPatterns(history) {
		const patterns = [];

		// Pattern 1: Topic jumping
		const topicChanges = this.countTopicChanges(history);
		if (topicChanges > history.length * 0.6) {
			patterns.push("topic_jumping");
		}

		// Pattern 2: Repetitive questions
		const hasRepetition = this.detectRepetitiveQuestions(history);
		if (hasRepetition) {
			patterns.push("repetitive_questions");
		}

		// Pattern 3: Deep dive
		const dominantTopic = this.analyzeTopicDistribution(history)[0];
		if (dominantTopic?.percentage > 0.7) {
			patterns.push("deep_dive");
		}

		// Pattern 4: Information gathering
		const hasEntityQuestions = history.some(
			(msg) =>
				msg.userMessage.includes("?") || msg.userMessage.includes("？")
		);
		if (hasEntityQuestions && history.length > 3) {
			patterns.push("information_gathering");
		}

		return patterns;
	}

	// Count topic changes in conversation
	countTopicChanges(history) {
		let changes = 0;
		for (let i = 1; i < history.length; i++) {
			const currentTopic = history[i].contextData?.detectedTopic;
			const previousTopic = history[i - 1].contextData?.detectedTopic;
			if (
				currentTopic &&
				previousTopic &&
				currentTopic !== previousTopic
			) {
				changes++;
			}
		}
		return changes;
	}

	// Detect repetitive questions
	detectRepetitiveQuestions(history) {
		const topics = history
			.map((msg) => msg.contextData?.detectedTopic)
			.filter(Boolean);
		const uniqueTopics = new Set(topics);

		// If we have repeated the same topic more than 50% of the time
		return uniqueTopics.size < topics.length * 0.5;
	}

	// Generate context summary
	generateContextSummary(history) {
		const dominantTopic = this.analyzeTopicDistribution(history)[0];
		const latestEmotion =
			history[0]?.contextData?.emotionalState || "neutral";
		const conversationLength = history.length;

		if (conversationLength === 1) {
			return `開始討論${dominantTopic?.topic || "未知主題"}`;
		} else if (conversationLength < 5) {
			return `初步探討${dominantTopic?.topic || "多個主題"}，用戶情緒：${latestEmotion}`;
		} else {
			return `深入討論${dominantTopic?.topic || "多個主題"}（${conversationLength}輪對話），當前情緒：${latestEmotion}`;
		}
	}

	// Generate contextual recommendations
	generateContextualRecommendations(
		topicDistribution,
		emotionalJourney,
		engagementTrend
	) {
		const recommendations = [];

		// Engagement-based recommendations
		if (engagementTrend === "decreasing") {
			recommendations.push({
				type: "engagement",
				action: "vary_response_style",
				reason: "用戶參與度下降",
			});
		}

		// Topic-based recommendations
		if (topicDistribution.length > 3) {
			recommendations.push({
				type: "focus",
				action: "suggest_topic_focus",
				reason: "話題分散，建議聚焦",
			});
		}

		// Emotional-based recommendations
		const recentEmotion =
			emotionalJourney[emotionalJourney.length - 1]?.emotionalState;
		if (recentEmotion === "worried" || recentEmotion === "urgent") {
			recommendations.push({
				type: "emotional_support",
				action: "provide_reassurance",
				reason: "用戶情緒需要支持",
			});
		}

		return recommendations;
	}

	// Fallback context preservation
	fallbackContextPreservation(sessionId, userMessage, aiAnalysis) {
		return {
			conversationDepth: 1,
			dominantTopics: [{ topic: aiAnalysis.detectedTopic, count: 1 }],
			emotionalJourney: [{ emotionalState: aiAnalysis.emotionalState }],
			engagementTrend: "neutral",
			contextSummary: "基本上下文保存",
			recommendations: [],
		};
	}

	// Get conversation insights for analytics
	async getConversationInsights(sessionId) {
		try {
			const history = await this.getRecentHistory(sessionId, 50);

			return {
				totalMessages: history.length,
				averageEngagement: this.calculateAverageEngagement(history),
				topicDistribution: this.analyzeTopicDistribution(history),
				emotionalProgression: this.analyzeEmotionalJourney(history),
				conversationQuality: this.assessConversationQuality(history),
				userSatisfaction: this.estimateUserSatisfaction(history),
			};
		} catch (error) {
			console.error("🚨 Error getting conversation insights:", error);
			return null;
		}
	}

	// Calculate average engagement
	calculateAverageEngagement(history) {
		const scores = history
			.map((msg) => msg.userEngagement?.engagementScore)
			.filter((score) => score !== null && score !== undefined);

		return scores.length > 0
			? scores.reduce((a, b) => a + b) / scores.length
			: 0.5;
	}

	// Assess overall conversation quality
	assessConversationQuality(history) {
		const qualityScores = history
			.map((msg) => msg.responseQuality?.score)
			.filter((score) => score !== null && score !== undefined);

		const averageQuality =
			qualityScores.length > 0
				? qualityScores.reduce((a, b) => a + b) / qualityScores.length
				: 0.5;

		const repairRate =
			history.filter((msg) => msg.responseQuality?.repairApplied).length /
			Math.max(1, history.length);

		return {
			averageQuality,
			repairRate,
			consistencyScore: this.calculateConsistencyScore(history),
		};
	}

	// Calculate consistency score
	calculateConsistencyScore(history) {
		// Measure how consistent topic transitions are
		const transitions = history.slice(1).map((msg, i) => {
			const current = msg.contextData?.detectedTopic;
			const previous = history[i].contextData?.detectedTopic;
			return current === previous ? 1 : 0.5; // Same topic = 1, different = 0.5
		});

		return transitions.length > 0
			? transitions.reduce((a, b) => a + b) / transitions.length
			: 1;
	}

	// Estimate user satisfaction
	estimateUserSatisfaction(history) {
		const satisfactionIndicators = history.flatMap(
			(msg) => msg.userEngagement?.satisfactionIndicators || []
		);

		const frustrationIndicators = history.flatMap(
			(msg) => msg.userEngagement?.frustrationIndicators || []
		);

		const satisfactionScore = Math.max(
			0,
			satisfactionIndicators.length - frustrationIndicators.length
		);
		const averageEngagement = this.calculateAverageEngagement(history);

		return {
			satisfactionScore,
			averageEngagement,
			overallSatisfaction:
				satisfactionScore * 0.3 + averageEngagement * 0.7,
		};
	}
}

export default EnhancedConversationMemoryManager;
