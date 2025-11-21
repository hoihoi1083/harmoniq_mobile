// 🔄 Smart Topic Transition Manager
// Phase 2 Implementation - Intelligent topic switching with smooth transitions

class SmartTopicTransitionManager {
	constructor() {
		// Enhanced transition templates with emotional intelligence
		this.transitionTemplates = {
			// Smooth topic transitions (highly related topics)
			smooth_transition: {
				high_confidence: [
					"很好！從{previousTopic}來看，{newTopic}確實是相關的重點。✨",
					"完美！{previousTopic}和{newTopic}息息相關，讓我為你全面分析。",
					"太棒了！結合{previousTopic}的分析，{newTopic}也是關鍵所在。🎯",
				],
				medium_confidence: [
					"從{previousTopic}延伸到{newTopic}，這樣的分析更全面。",
					"結合{previousTopic}，我來為你看看{newTopic}方面。",
					"{previousTopic}和{newTopic}確實有關聯，一起分析更有意義。",
				],
				low_confidence: [
					"我理解你想從{previousTopic}轉向{newTopic}的分析。",
					"好的，我們將關注點從{previousTopic}移到{newTopic}上。",
					"明白了，讓我們討論{newTopic}方面的問題。",
				],
			},

			// Related topic transitions (moderately related)
			related_transition: {
				high_confidence: [
					"從{previousTopic}到{newTopic}，讓我為你做全面分析！✨",
					"很好的思路！{previousTopic}和{newTopic}確實有關聯。",
					"完全理解！{previousTopic}會影響{newTopic}，我一併為你分析。",
				],
				medium_confidence: [
					"我們從{previousTopic}延伸到{newTopic}的討論～",
					"結合{previousTopic}的分析，{newTopic}也是重要考量。",
					"從{previousTopic}的角度來看，{newTopic}也值得關注。",
				],
				low_confidence: [
					"好的，我們從{previousTopic}轉換到{newTopic}的分析。",
					"明白你想了解{newTopic}，讓我為你分析一下。",
					"收到，我來為你看看{newTopic}方面的情況。",
				],
			},

			// Topic shifts (distantly related or unrelated)
			topic_shift: {
				high_confidence: [
					"我理解你現在想了解{newTopic}，讓我們轉換一下焦點。🔄",
					"好的！從{previousTopic}轉到{newTopic}，我來為你分析。",
					"明白了！{newTopic}也是重要的人生領域，讓我幫你看看。",
				],
				medium_confidence: [
					"我們將焦點從{previousTopic}轉到{newTopic}上。",
					"好的，讓我們討論{newTopic}方面的問題。",
					"收到，我來為你分析{newTopic}的情況。",
				],
				low_confidence: [
					"我想確認一下，你是想了解{newTopic}方面的問題嗎？",
					"你是想從{previousTopic}轉向{newTopic}的諮詢嗎？",
					"讓我確認，你現在關心的是{newTopic}對吧？",
				],
			},

			// Topic continuation (same topic)
			topic_continuation: {
				high_confidence: [
					"繼續我們剛才談到的{previousTopic}，讓我深入為你分析。",
					"接著{previousTopic}的話題，我來提供更詳細的建議。",
					"在{previousTopic}方面，讓我為你做更全面的解析。✨",
				],
				medium_confidence: [
					"我們繼續討論{previousTopic}的問題。",
					"關於{previousTopic}，讓我進一步為你分析。",
					"在{previousTopic}這個話題上，我來深入解答。",
				],
				low_confidence: [
					"你是想繼續了解{previousTopic}的問題嗎？",
					"我們是否繼續{previousTopic}的討論？",
					"你想在{previousTopic}方面了解更多嗎？",
				],
			},

			// Topic oscillation (jumping back to previous topic)
			topic_return: {
				high_confidence: [
					"我注意到你又回到{newTopic}的問題，這確實很重要！",
					"看來{newTopic}是你最關心的重點，讓我再為你詳細分析。",
					"回到{newTopic}的話題，我來給你更深入的建議。🎯",
				],
				medium_confidence: [
					"我們再次討論{newTopic}的問題。",
					"好的，我們回到{newTopic}的分析。",
					"讓我們重新關注{newTopic}方面。",
				],
				low_confidence: [
					"你是想回到{newTopic}的討論嗎？",
					"我們是否回到{newTopic}的話題？",
					"你想再了解{newTopic}的問題嗎？",
				],
			},

			// New conversation start
			new_conversation: {
				high_confidence: [
					"歡迎來到Smart-Chat3！我來為你分析{newTopic}方面的問題。✨",
					"很好！讓我為你做專業的{newTopic}分析。",
					"太棒了！{newTopic}是我的專長領域，讓我幫你看看。🎯",
				],
				medium_confidence: [
					"歡迎來到智能風水顧問！我來為你分析{newTopic}。",
					"好的，讓我為你看看{newTopic}方面的情況。",
					"我來為你分析{newTopic}的問題。",
				],
				low_confidence: [
					"歡迎！你是想了解{newTopic}方面的問題嗎？",
					"你好！我可以為你分析{newTopic}嗎？",
					"請問你想諮詢{newTopic}相關的問題嗎？",
				],
			},
		};

		// Topic relationship mappings with detailed explanations
		this.topicRelationships = {
			感情: {
				人際關係: {
					relationship: "highly_related",
					explanation:
						"良好的人際關係是感情發展的基礎，人緣好自然桃花運佳。",
				},
				因緣: {
					relationship: "highly_related",
					explanation:
						"感情運勢與個人因緣密切相關，機緣到了自然會遇到對的人。",
				},
				子女: {
					relationship: "moderately_related",
					explanation:
						"感情穩定有助於子女運勢，家庭和諧對下一代很重要。",
				},
				健康: {
					relationship: "moderately_related",
					explanation:
						"心理健康會影響感情狀態，身心平衡才能有好的戀愛關係。",
				},
				工作: {
					relationship: "distantly_related",
					explanation: "工作穩定有助於感情發展，但兩者相對獨立。",
				},
				財運: {
					relationship: "distantly_related",
					explanation: "經濟基礎會影響感情，但真愛不完全依賴金錢。",
				},
				居家佈局: {
					relationship: "unrelated",
					explanation:
						"居家風水可以催旺桃花，但與感情問題本身關聯較小。",
				},
			},
			財運: {
				工作: {
					relationship: "highly_related",
					explanation:
						"事業發展直接影響財運，職場運勢好財富自然增長。",
				},
				居家佈局: {
					relationship: "moderately_related",
					explanation: "居家風水佈局可以催旺財運，環境能量很重要。",
				},
				因緣: {
					relationship: "moderately_related",
					explanation: "貴人運和機會運會影響財富累積。",
				},
				人際關係: {
					relationship: "distantly_related",
					explanation: "人脈關係有助於財運發展，但非直接因素。",
				},
				健康: {
					relationship: "distantly_related",
					explanation: "身體健康是事業發展的基礎，間接影響財運。",
				},
				感情: {
					relationship: "unrelated",
					explanation: "感情和財運相對獨立，各有不同的運勢規律。",
				},
				子女: {
					relationship: "unrelated",
					explanation: "子女運勢與個人財運沒有直接關聯。",
				},
			},
			工作: {
				財運: {
					relationship: "highly_related",
					explanation: "職場發展直接影響收入和財富累積。",
				},
				人際關係: {
					relationship: "highly_related",
					explanation: "職場人際關係是事業成功的關鍵因素。",
				},
				健康: {
					relationship: "moderately_related",
					explanation: "工作壓力會影響身心健康，需要平衡。",
				},
				因緣: {
					relationship: "moderately_related",
					explanation: "工作機會往往需要貴人運和好的時機。",
				},
				感情: {
					relationship: "distantly_related",
					explanation: "工作壓力可能影響感情生活，但屬於不同領域。",
				},
				居家佈局: {
					relationship: "distantly_related",
					explanation: "辦公環境風水會影響工作運勢。",
				},
				子女: {
					relationship: "unrelated",
					explanation: "工作運勢與子女運勢相對獨立。",
				},
			},
			健康: {
				居家佈局: {
					relationship: "highly_related",
					explanation: "居住環境直接影響身心健康，風水佈局很重要。",
				},
				工作: {
					relationship: "moderately_related",
					explanation: "工作壓力和環境會影響身體健康。",
				},
				感情: {
					relationship: "moderately_related",
					explanation: "情緒狀態會影響身體健康，心理平衡很重要。",
				},
				財運: {
					relationship: "distantly_related",
					explanation: "經濟壓力可能影響健康，但關聯不強。",
				},
				人際關係: {
					relationship: "distantly_related",
					explanation: "社交壓力可能影響心理健康。",
				},
				因緣: {
					relationship: "unrelated",
					explanation: "健康運勢與因緣機會沒有直接關聯。",
				},
				子女: {
					relationship: "unrelated",
					explanation: "個人健康與子女運勢相對獨立。",
				},
			},
			人際關係: {
				感情: {
					relationship: "highly_related",
					explanation:
						"人際關係好有助於感情發展，社交圈擴大桃花機會。",
				},
				工作: {
					relationship: "highly_related",
					explanation: "職場人際關係直接影響事業發展。",
				},
				因緣: {
					relationship: "moderately_related",
					explanation: "人際網絡有助於遇到貴人和好機會。",
				},
				財運: {
					relationship: "distantly_related",
					explanation: "人脈關係有助於財運，但非主要因素。",
				},
				子女: {
					relationship: "distantly_related",
					explanation: "家庭人際關係會影響子女教育環境。",
				},
				健康: {
					relationship: "unrelated",
					explanation: "人際關係與健康運勢沒有直接關聯。",
				},
				居家佈局: {
					relationship: "unrelated",
					explanation: "居家風水與人際關係相對獨立。",
				},
			},
			子女: {
				感情: {
					relationship: "highly_related",
					explanation: "感情穩定有助於子女運勢，家庭和諧很重要。",
				},
				因緣: {
					relationship: "highly_related",
					explanation: "子女緣分需要好的時機和因緣。",
				},
				健康: {
					relationship: "moderately_related",
					explanation: "父母健康狀態會影響生育和教養能力。",
				},
				人際關係: {
					relationship: "distantly_related",
					explanation: "家庭關係和教育環境會影響子女發展。",
				},
				工作: {
					relationship: "unrelated",
					explanation: "工作運勢與子女運勢相對獨立。",
				},
				財運: {
					relationship: "unrelated",
					explanation: "財運與子女運勢沒有直接關聯。",
				},
				居家佈局: {
					relationship: "unrelated",
					explanation: "居家風水與子女運勢關聯較小。",
				},
			},
			因緣: {
				感情: {
					relationship: "highly_related",
					explanation: "感情需要緣分，好的因緣帶來好的感情機會。",
				},
				子女: {
					relationship: "highly_related",
					explanation: "子女緣分是重要的人生因緣。",
				},
				人際關係: {
					relationship: "moderately_related",
					explanation: "貴人運和人際因緣相關。",
				},
				財運: {
					relationship: "moderately_related",
					explanation: "財運機會需要好的時機和因緣。",
				},
				工作: {
					relationship: "moderately_related",
					explanation: "工作機會往往需要好的因緣和時機。",
				},
				健康: {
					relationship: "unrelated",
					explanation: "健康運勢與因緣機會沒有直接關聯。",
				},
				居家佈局: {
					relationship: "unrelated",
					explanation: "居家風水與因緣運勢相對獨立。",
				},
			},
			居家佈局: {
				健康: {
					relationship: "highly_related",
					explanation: "居住環境直接影響身心健康。",
				},
				財運: {
					relationship: "moderately_related",
					explanation: "風水佈局可以催旺財運。",
				},
				工作: {
					relationship: "distantly_related",
					explanation: "居家辦公環境會影響工作效率。",
				},
				感情: {
					relationship: "unrelated",
					explanation: "居家風水與感情運勢關聯較小。",
				},
				人際關係: {
					relationship: "unrelated",
					explanation: "居家佈局與人際關係沒有直接關聯。",
				},
				子女: {
					relationship: "unrelated",
					explanation: "居家風水與子女運勢相對獨立。",
				},
				因緣: {
					relationship: "unrelated",
					explanation: "居家佈局與因緣機會沒有直接關聯。",
				},
			},
		};

		// Transition smoothness factors
		this.smoothnessFactors = {
			highly_related: 0.9,
			moderately_related: 0.7,
			distantly_related: 0.5,
			unrelated: 0.3,
		};

		// Pattern detection for better transitions
		this.conversationPatterns = {
			topic_jumping: {
				threshold: 3, // 3 topic changes in 5 messages
				windowSize: 5,
				response:
					"我注意到你對多個領域都有關注，讓我先專注在你最關心的{dominantTopic}上。",
			},
			deep_dive: {
				threshold: 0.7, // 70% same topic
				minMessages: 4,
				response:
					"我們已經深入討論{currentTopic}，你還想了解其他相關的方面嗎？",
			},
			oscillation: {
				threshold: 2, // Return to same topic twice
				response:
					"看來{currentTopic}確實是你最關心的重點，讓我為你做更全面的分析。",
			},
		};
	}

	// Analyze and generate smart topic transition
	generateSmartTransition(
		conversationHistory,
		previousTopic,
		newTopic,
		confidence
	) {
		try {
			// Determine transition type
			const transitionAnalysis = this.analyzeTransitionType(
				conversationHistory,
				previousTopic,
				newTopic
			);

			// Check for conversation patterns
			const patterns =
				this.detectConversationPatterns(conversationHistory);

			// Generate appropriate transition response
			const transitionResponse = this.selectTransitionTemplate(
				transitionAnalysis.type,
				previousTopic,
				newTopic,
				confidence,
				patterns
			);

			// Calculate transition smoothness
			const smoothness = this.calculateTransitionSmoothness(
				transitionAnalysis,
				patterns,
				confidence
			);

			// Generate context explanation if needed
			const explanation = this.generateTransitionExplanation(
				previousTopic,
				newTopic,
				transitionAnalysis.relationship
			);

			return {
				transitionType: transitionAnalysis.type,
				transitionResponse,
				smoothness,
				explanation,
				relationship: transitionAnalysis.relationship,
				patterns,
				confidence: confidence,
				needsExplanation: this.needsTransitionExplanation(
					transitionAnalysis.type,
					confidence,
					patterns
				),
			};
		} catch (error) {
			console.error("🚨 Smart transition generation error:", error);
			return this.fallbackTransition(previousTopic, newTopic, confidence);
		}
	}

	// Analyze the type of topic transition
	analyzeTransitionType(conversationHistory, previousTopic, newTopic) {
		// Handle new conversation
		if (!previousTopic || conversationHistory.length === 0) {
			return {
				type: "new_conversation",
				relationship: null,
				explanation: "開始新的對話",
			};
		}

		// Handle same topic continuation
		if (previousTopic === newTopic) {
			return {
				type: "topic_continuation",
				relationship: "same",
				explanation: "繼續同一話題的討論",
			};
		}

		// Check for topic oscillation (return to previous topic)
		const recentTopics = this.extractRecentTopics(conversationHistory, 5);
		const isReturn = recentTopics.slice(1).includes(newTopic);

		if (isReturn) {
			return {
				type: "topic_return",
				relationship: this.getTopicRelationship(
					previousTopic,
					newTopic
				),
				explanation: "回到之前討論過的話題",
			};
		}

		// Analyze relationship between topics
		const relationship = this.getTopicRelationship(previousTopic, newTopic);

		let transitionType;
		switch (relationship.level) {
			case "highly_related":
				transitionType = "smooth_transition";
				break;
			case "moderately_related":
				transitionType = "related_transition";
				break;
			default:
				transitionType = "topic_shift";
		}

		return {
			type: transitionType,
			relationship: relationship,
			explanation: relationship.explanation,
		};
	}

	// Get relationship between two topics
	getTopicRelationship(topic1, topic2) {
		const relationships = this.topicRelationships[topic1];

		if (!relationships || !relationships[topic2]) {
			return {
				level: "unrelated",
				explanation: `${topic1}和${topic2}是相對獨立的領域`,
			};
		}

		return {
			level: relationships[topic2].relationship,
			explanation: relationships[topic2].explanation,
		};
	}

	// Extract recent topics from conversation history
	extractRecentTopics(conversationHistory, count = 5) {
		return conversationHistory
			.slice(0, count)
			.map((msg) => msg.contextData?.detectedTopic)
			.filter(Boolean);
	}

	// Detect conversation patterns
	detectConversationPatterns(conversationHistory) {
		const patterns = [];

		if (conversationHistory.length < 3) return patterns;

		// Pattern 1: Topic jumping
		const topicChanges = this.countTopicChanges(conversationHistory, 5);
		if (topicChanges >= this.conversationPatterns.topic_jumping.threshold) {
			patterns.push({
				type: "topic_jumping",
				severity: topicChanges / 5,
				recommendation: "建議聚焦在主要關注點",
			});
		}

		// Pattern 2: Deep dive
		const topicDistribution = this.analyzeTopicDistribution(
			conversationHistory,
			7
		);
		const dominantTopic = topicDistribution[0];

		if (
			dominantTopic &&
			dominantTopic.percentage >=
				this.conversationPatterns.deep_dive.threshold &&
			conversationHistory.length >=
				this.conversationPatterns.deep_dive.minMessages
		) {
			patterns.push({
				type: "deep_dive",
				topic: dominantTopic.topic,
				depth: dominantTopic.percentage,
				recommendation: "可以探討相關的其他方面",
			});
		}

		// Pattern 3: Topic oscillation
		const oscillations = this.detectTopicOscillations(conversationHistory);
		if (oscillations.length > 0) {
			patterns.push({
				type: "oscillation",
				topics: oscillations,
				recommendation: "專注在最重要的話題上",
			});
		}

		return patterns;
	}

	// Count topic changes in recent conversation
	countTopicChanges(conversationHistory, windowSize) {
		const recentHistory = conversationHistory.slice(0, windowSize);
		let changes = 0;

		for (let i = 1; i < recentHistory.length; i++) {
			const currentTopic = recentHistory[i].contextData?.detectedTopic;
			const previousTopic =
				recentHistory[i - 1].contextData?.detectedTopic;

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

	// Analyze topic distribution
	analyzeTopicDistribution(conversationHistory, windowSize) {
		const recentHistory = conversationHistory.slice(0, windowSize);
		const topicCounts = {};

		recentHistory.forEach((msg) => {
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
				percentage: count / recentHistory.length,
			}));
	}

	// Detect topic oscillations
	detectTopicOscillations(conversationHistory) {
		const topics = conversationHistory
			.slice(0, 8)
			.map((msg) => msg.contextData?.detectedTopic)
			.filter(Boolean);

		const oscillations = [];
		const topicPositions = {};

		// Track topic positions
		topics.forEach((topic, index) => {
			if (!topicPositions[topic]) {
				topicPositions[topic] = [];
			}
			topicPositions[topic].push(index);
		});

		// Find topics that appear multiple times with gaps
		Object.entries(topicPositions).forEach(([topic, positions]) => {
			if (positions.length >= 2) {
				const gaps = positions
					.slice(1)
					.map((pos, i) => pos - positions[i]);
				const hasSignificantGaps = gaps.some((gap) => gap > 1);

				if (hasSignificantGaps) {
					oscillations.push({
						topic,
						occurrences: positions.length,
						lastPosition: positions[0],
					});
				}
			}
		});

		return oscillations;
	}

	// Select appropriate transition template
	selectTransitionTemplate(
		transitionType,
		previousTopic,
		newTopic,
		confidence,
		patterns
	) {
		// Check for pattern-specific responses first
		if (patterns.length > 0) {
			const patternResponse = this.getPatternSpecificResponse(
				patterns,
				newTopic
			);
			if (patternResponse) return patternResponse;
		}

		// Get confidence level for template selection
		const confidenceLevel = this.mapConfidenceLevel(confidence);

		// Get transition templates
		const templates =
			this.transitionTemplates[transitionType]?.[confidenceLevel] ||
			this.transitionTemplates[transitionType]?.["medium_confidence"] ||
			this.transitionTemplates["topic_shift"]["medium_confidence"];

		// Select random template
		const template =
			templates[Math.floor(Math.random() * templates.length)];

		// Replace placeholders
		return template
			.replace(
				/{previousTopic}/g,
				this.getTopicDisplayName(previousTopic)
			)
			.replace(/{newTopic}/g, this.getTopicDisplayName(newTopic));
	}

	// Get pattern-specific responses
	getPatternSpecificResponse(patterns, currentTopic) {
		for (const pattern of patterns) {
			switch (pattern.type) {
				case "topic_jumping":
					const dominantTopic = this.findDominantTopic(patterns);
					if (dominantTopic) {
						return this.conversationPatterns.topic_jumping.response.replace(
							"{dominantTopic}",
							this.getTopicDisplayName(dominantTopic)
						);
					}
					break;

				case "deep_dive":
					return this.conversationPatterns.deep_dive.response.replace(
						"{currentTopic}",
						this.getTopicDisplayName(pattern.topic)
					);

				case "oscillation":
					return this.conversationPatterns.oscillation.response.replace(
						"{currentTopic}",
						this.getTopicDisplayName(currentTopic)
					);
			}
		}
		return null;
	}

	// Find dominant topic from patterns
	findDominantTopic(patterns) {
		const deepDivePattern = patterns.find((p) => p.type === "deep_dive");
		return deepDivePattern?.topic || null;
	}

	// Map AI confidence to template confidence level
	mapConfidenceLevel(confidence) {
		if (confidence >= 0.8) return "high_confidence";
		if (confidence >= 0.5) return "medium_confidence";
		return "low_confidence";
	}

	// Calculate transition smoothness score
	calculateTransitionSmoothness(transitionAnalysis, patterns, confidence) {
		let baseScore =
			this.smoothnessFactors[transitionAnalysis.relationship?.level] ||
			0.5;

		// Adjust for confidence
		baseScore += (confidence - 0.5) * 0.2;

		// Adjust for patterns
		patterns.forEach((pattern) => {
			switch (pattern.type) {
				case "topic_jumping":
					baseScore -= 0.2; // Penalize topic jumping
					break;
				case "oscillation":
					baseScore -= 0.15; // Penalize oscillation
					break;
				case "deep_dive":
					if (transitionAnalysis.type === "topic_continuation") {
						baseScore += 0.1; // Reward continuation in deep dive
					}
					break;
			}
		});

		return Math.max(0.1, Math.min(1.0, baseScore));
	}

	// Generate transition explanation
	generateTransitionExplanation(previousTopic, newTopic, relationship) {
		if (!relationship?.explanation) {
			return `從${this.getTopicDisplayName(previousTopic)}轉向${this.getTopicDisplayName(newTopic)}的分析`;
		}

		return relationship.explanation;
	}

	// Check if transition needs explanation
	needsTransitionExplanation(transitionType, confidence, patterns) {
		// Always explain for low confidence
		if (confidence < 0.6) return true;

		// Explain for topic shifts
		if (transitionType === "topic_shift") return true;

		// Explain when patterns are detected
		if (
			patterns.some(
				(p) => p.type === "topic_jumping" || p.type === "oscillation"
			)
		) {
			return true;
		}

		return false;
	}

	// Get user-friendly topic names
	getTopicDisplayName(topic) {
		const displayNames = {
			感情: "感情運勢",
			財運: "財運發展",
			工作: "事業發展",
			健康: "健康運勢",
			人際關係: "人際關係",
			子女: "子女運勢",
			因緣: "機緣運勢",
			居家佈局: "居家風水",
		};
		return displayNames[topic] || topic || "未知主題";
	}

	// Fallback transition for error cases
	fallbackTransition(previousTopic, newTopic, confidence) {
		return {
			transitionType: "topic_shift",
			transitionResponse: `好的，我來為你分析${this.getTopicDisplayName(newTopic)}方面的問題。`,
			smoothness: 0.5,
			explanation: "基本話題轉換",
			relationship: { level: "unrelated" },
			patterns: [],
			confidence: confidence || 0.5,
			needsExplanation: false,
		};
	}

	// Get transition insights for analytics
	getTransitionInsights(conversationHistory) {
		const insights = {
			totalTransitions: 0,
			smoothTransitions: 0,
			averageSmoothness: 0,
			topicJumping: false,
			deepDiveTopics: [],
			oscillationPatterns: [],
		};

		if (conversationHistory.length < 2) return insights;

		const transitions = [];
		let smoothnessSum = 0;

		// Analyze each transition
		for (let i = 1; i < conversationHistory.length; i++) {
			const current = conversationHistory[i].contextData?.detectedTopic;
			const previous =
				conversationHistory[i - 1].contextData?.detectedTopic;

			if (current && previous) {
				const relationship = this.getTopicRelationship(
					previous,
					current
				);
				const smoothness =
					this.smoothnessFactors[relationship.level] || 0.5;

				transitions.push({
					from: previous,
					to: current,
					smoothness: smoothness,
					relationship: relationship.level,
				});

				smoothnessSum += smoothness;
				if (smoothness >= 0.7) insights.smoothTransitions++;
			}
		}

		insights.totalTransitions = transitions.length;
		insights.averageSmoothness =
			transitions.length > 0 ? smoothnessSum / transitions.length : 0;

		// Detect patterns
		const patterns = this.detectConversationPatterns(conversationHistory);
		insights.topicJumping = patterns.some(
			(p) => p.type === "topic_jumping"
		);
		insights.deepDiveTopics = patterns
			.filter((p) => p.type === "deep_dive")
			.map((p) => p.topic);
		insights.oscillationPatterns = patterns
			.filter((p) => p.type === "oscillation")
			.map((p) => p.topics);

		return insights;
	}
}

export default SmartTopicTransitionManager;
