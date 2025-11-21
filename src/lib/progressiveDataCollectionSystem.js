// 📊 Progressive Data Collection System
// Phase 2 Implementation - Smart data gathering with adaptive personalization

import mongoose from "mongoose";

// Enhanced user profile schema
const UserProfileSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		profileData: {
			// Basic demographics
			birthData: {
				year: Number,
				month: Number,
				day: Number,
				hour: Number,
				minute: Number,
				timezone: String,
				isLunar: { type: Boolean, default: false },
				confidence: { type: Number, default: 0.0 },
			},

			// Personal characteristics
			personality: {
				communicationStyle: {
					type: String,
					enum: [
						"formal",
						"casual",
						"emotional",
						"analytical",
						"spiritual",
					],
					default: "casual",
				},
				detailPreference: {
					type: String,
					enum: ["brief", "moderate", "detailed", "comprehensive"],
					default: "moderate",
				},
				topicInterests: [
					{
						topic: String,
						frequency: Number,
						lastMentioned: Date,
						importance: Number, // 0-1 scale
					},
				],
				preferredTone: {
					type: String,
					enum: [
						"encouraging",
						"neutral",
						"practical",
						"mystical",
						"scientific",
					],
					default: "encouraging",
				},
			},

			// Consultation history
			consultationHistory: {
				totalSessions: { type: Number, default: 0 },
				averageSessionLength: { type: Number, default: 0 },
				preferredTopics: [String],
				mostAskedQuestions: [String],
				satisfactionRatings: [Number],
				followUpRate: { type: Number, default: 0 },
			},

			// Context preferences
			contextPreferences: {
				includeBackground: { type: Boolean, default: true },
				preferAnalogies: { type: Boolean, default: false },
				wantActionableAdvice: { type: Boolean, default: true },
				culturalSensitivity: {
					type: String,
					enum: ["traditional", "modern", "mixed"],
					default: "mixed",
				},
			},

			// Feedback patterns
			feedbackPatterns: {
				commonPositiveKeywords: [String],
				commonNegativeKeywords: [String],
				responseQualityHistory: [
					{
						score: Number,
						feedback: String,
						timestamp: Date,
						context: String,
					},
				],
				improvementAreas: [String],
			},
		},

		adaptationData: {
			lastUpdated: { type: Date, default: Date.now },
			updateFrequency: { type: Number, default: 0 },
			adaptationScore: { type: Number, default: 0.5 }, // How well we know this user
			confidenceLevel: { type: Number, default: 0.3 },
			learningVelocity: { type: Number, default: 0.1 }, // How quickly we adapt
		},

		privacySettings: {
			dataRetention: {
				type: String,
				enum: ["session", "temporary", "permanent"],
				default: "temporary",
			},
			analyticsConsent: { type: Boolean, default: false },
			personalizationLevel: {
				type: String,
				enum: ["none", "basic", "moderate", "full"],
				default: "moderate",
			},
		},
	},
	{
		timestamps: true,
		collection: "userProfiles",
	}
);

// Create model
const UserProfile =
	mongoose.models.UserProfile ||
	mongoose.model("UserProfile", UserProfileSchema);

class ProgressiveDataCollectionSystem {
	constructor() {
		// Data collection strategies
		this.collectionStrategies = {
			// Natural conversation-based collection
			conversational: {
				patterns: [
					{
						trigger: /我是(\d{4})年.*生/,
						extract: "birthYear",
						confidence: 0.9,
						followUp:
							"太好了！能告訴我具體的出生月日嗎？這樣分析會更準確。",
					},
					{
						trigger: /(農曆|陰曆|國曆|陽曆)/,
						extract: "calendarType",
						confidence: 0.8,
						followUp: "了解！{calendarType}的日期對分析很重要。",
					},
					{
						trigger: /(想要|希望|需要).*(詳細|簡單|快速|深入)/,
						extract: "detailPreference",
						confidence: 0.7,
						followUp: null,
					},
					{
						trigger: /(感覺|覺得|認為).*(準確|不準|有道理|沒用)/,
						extract: "feedbackSentiment",
						confidence: 0.8,
						followUp: "謝謝你的反饋！這幫助我提供更好的建議。",
					},
				],

				// Progressive questioning strategies
				progressiveQuestions: {
					birthData: [
						"為了提供更精準的分析，可以告訴我你的出生年份嗎？",
						"出生月份和日期能幫助我做更詳細的分析，方便分享嗎？",
						"如果知道出生時間，我可以提供更全面的命理分析。",
					],
					preferences: [
						"你比較喜歡詳細的分析還是簡潔的建議？",
						"在風水建議方面，你偏向傳統做法還是現代應用？",
						"你希望我的回答更實用一些，還是包含更多背景知識？",
					],
					context: [
						"這個問題是關於你自己還是幫別人問的？",
						"你之前有接觸過風水或命理分析嗎？",
						"你對這類建議的接受度如何？",
					],
				},
			},

			// Behavioral pattern analysis
			behavioral: {
				// Message patterns
				messageAnalysis: {
					lengthPattern: "long|medium|short",
					questioningStyle: "direct|exploratory|hesitant",
					emotionalTone: "excited|calm|worried|skeptical",
					urgencyLevel: "immediate|normal|casual",
				},

				// Interaction patterns
				interactionAnalysis: {
					sessionTiming: "morning|afternoon|evening|night",
					sessionLength: "quick|normal|extended",
					followUpBehavior: "frequent|occasional|rare",
					topicFocus: "single|multiple|scattered",
				},
			},

			// Feedback-based learning
			feedbackBased: {
				explicit: [
					"這個建議對你有幫助嗎？",
					"你希望我調整回答的風格嗎？",
					"分析的詳細程度如何？需要更多還是更少？",
				],
				implicit: {
					responseTime:
						"quick_response|thoughtful_pause|delayed_response",
					followUpQuestions: "many|few|none",
					topicChanges: "smooth|abrupt|confused",
					satisfactionIndicators:
						"positive_language|neutral|negative_language",
				},
			},
		};

		// Adaptive personalization rules
		this.personalizationRules = {
			communicationStyle: {
				formal: {
					triggers: ["你", "請問", "煩請", "敬請"],
					adaptations: {
						tone: "respectful",
						structure: "organized",
						language: "formal",
					},
				},
				casual: {
					triggers: ["你", "嗨", "哈囉", "謝啦"],
					adaptations: {
						tone: "friendly",
						structure: "conversational",
						language: "relaxed",
					},
				},
				emotional: {
					triggers: ["好擔心", "很緊張", "希望", "害怕"],
					adaptations: {
						tone: "empathetic",
						structure: "supportive",
						language: "comforting",
					},
				},
			},

			contentDepth: {
				brief: {
					maxLength: 200,
					includeBackground: false,
					focusOn: "actionable_advice",
				},
				moderate: {
					maxLength: 400,
					includeBackground: true,
					focusOn: "balanced_explanation",
				},
				detailed: {
					maxLength: 600,
					includeBackground: true,
					focusOn: "comprehensive_analysis",
				},
			},

			culturalAdaptation: {
				traditional: {
					terminology: "classical_terms",
					references: "historical_examples",
					approach: "time_honored_methods",
				},
				modern: {
					terminology: "contemporary_language",
					references: "current_examples",
					approach: "practical_applications",
				},
				scientific: {
					terminology: "analytical_terms",
					references: "logical_explanations",
					approach: "evidence_based",
				},
			},
		};

		// Learning algorithms
		this.learningAlgorithms = {
			// Confidence-based learning
			confidenceBasedUpdate: (
				currentConfidence,
				newEvidence,
				evidenceStrength
			) => {
				const learningRate = 0.1;
				const weightedEvidence = newEvidence * evidenceStrength;
				return (
					currentConfidence +
					learningRate * (weightedEvidence - currentConfidence)
				);
			},

			// Frequency-based importance
			calculateImportance: (frequency, recency, userFeedback) => {
				const frequencyWeight = 0.4;
				const recencyWeight = 0.3;
				const feedbackWeight = 0.3;

				return (
					frequency * frequencyWeight +
					recency * recencyWeight +
					userFeedback * feedbackWeight
				);
			},

			// Adaptation velocity
			calculateAdaptationVelocity: (
				successRate,
				consistency,
				userEngagement
			) => {
				return Math.min(
					1.0,
					successRate * 0.5 + consistency * 0.3 + userEngagement * 0.2
				);
			},
		};
	}

	// Main method: Collect and analyze user data progressively
	async collectAndAnalyze(userId, messageContent, conversationContext) {
		try {
			// Get or create user profile
			const userProfile = await this.getUserProfile(userId);

			// Extract data from current message
			const extractedData = this.extractDataFromMessage(
				messageContent,
				conversationContext
			);

			// Analyze behavioral patterns
			const behavioralInsights = this.analyzeBehavioralPatterns(
				messageContent,
				conversationContext,
				userProfile
			);

			// Update user profile with new data
			const updatedProfile = await this.updateUserProfile(
				userProfile,
				extractedData,
				behavioralInsights
			);

			// Generate personalization recommendations
			const personalizationRecommendations =
				this.generatePersonalizationRecommendations(updatedProfile);

			// Determine next collection strategy
			const nextCollectionStrategy =
				this.determineNextCollectionStrategy(updatedProfile);

			return {
				userProfile: updatedProfile,
				extractedData,
				behavioralInsights,
				personalizationRecommendations,
				nextCollectionStrategy,
				adaptationScore: updatedProfile.adaptationData.adaptationScore,
				confidenceLevel: updatedProfile.adaptationData.confidenceLevel,
			};
		} catch (error) {
			console.error("🚨 Progressive data collection error:", error);
			return this.fallbackDataCollection(userId, messageContent);
		}
	}

	// Extract data from user message using patterns
	extractDataFromMessage(messageContent, conversationContext) {
		const extractedData = {
			birthData: {},
			preferences: {},
			feedback: {},
			context: {},
		};

		// Apply conversational patterns
		this.collectionStrategies.conversational.patterns.forEach((pattern) => {
			const match = messageContent.match(pattern.trigger);
			if (match) {
				extractedData[this.getCategoryForExtraction(pattern.extract)] =
					{
						type: pattern.extract,
						value: this.extractValue(match, pattern.extract),
						confidence: pattern.confidence,
						source: "conversational_pattern",
					};
			}
		});

		// Analyze message characteristics
		extractedData.messageCharacteristics =
			this.analyzeMessageCharacteristics(messageContent);

		// Extract context clues
		extractedData.contextClues = this.extractContextClues(
			messageContent,
			conversationContext
		);

		return extractedData;
	}

	// Analyze behavioral patterns from user interaction
	analyzeBehavioralPatterns(
		messageContent,
		conversationContext,
		userProfile
	) {
		const patterns = {
			communicationStyle: this.detectCommunicationStyle(messageContent),
			engagementLevel: this.calculateEngagementLevel(
				messageContent,
				conversationContext
			),
			preferenceSignals: this.detectPreferenceSignals(messageContent),
			satisfactionIndicators: this.detectSatisfactionIndicators(
				messageContent,
				conversationContext
			),
			learningVelocity: this.calculateLearningVelocity(
				userProfile,
				conversationContext
			),
		};

		return patterns;
	}

	// Detect communication style from message
	detectCommunicationStyle(messageContent) {
		const styles = {
			formal: 0,
			casual: 0,
			emotional: 0,
			analytical: 0,
			spiritual: 0,
		};

		// Formal indicators
		if (/你|請問|煩請|敬請|謝謝你/.test(messageContent)) {
			styles.formal += 0.3;
		}

		// Casual indicators
		if (/你|嗨|哈囉|謝啦|ok|好的/.test(messageContent)) {
			styles.casual += 0.3;
		}

		// Emotional indicators
		if (/擔心|緊張|興奮|開心|難過|害怕|希望/.test(messageContent)) {
			styles.emotional += 0.4;
		}

		// Analytical indicators
		if (/分析|數據|證據|邏輯|科學|客觀/.test(messageContent)) {
			styles.analytical += 0.3;
		}

		// Spiritual indicators
		if (/命運|緣分|天意|菩薩|佛祖|上天/.test(messageContent)) {
			styles.spiritual += 0.3;
		}

		// Return dominant style
		const dominantStyle = Object.entries(styles).sort(
			([, a], [, b]) => b - a
		)[0];

		return {
			style: dominantStyle[0],
			confidence: dominantStyle[1],
			allScores: styles,
		};
	}

	// Calculate user engagement level
	calculateEngagementLevel(messageContent, conversationContext) {
		let engagement = 0.5; // Base level

		// Message length indicates engagement
		if (messageContent.length > 100) engagement += 0.2;
		if (messageContent.length > 200) engagement += 0.1;

		// Question asking indicates interest
		const questionCount = (messageContent.match(/[？?]/g) || []).length;
		engagement += Math.min(0.3, questionCount * 0.1);

		// Follow-up behavior
		if (conversationContext.isFollowUp) {
			engagement += 0.2;
		}

		// Response speed (if available)
		if (conversationContext.responseTime) {
			if (conversationContext.responseTime < 30) {
				// Quick response
				engagement += 0.1;
			}
		}

		return Math.min(1.0, engagement);
	}

	// Detect preference signals
	detectPreferenceSignals(messageContent) {
		const preferences = {};

		// Detail preference
		if (/簡單|快速|簡潔|重點/.test(messageContent)) {
			preferences.detailLevel = { value: "brief", confidence: 0.7 };
		} else if (/詳細|深入|全面|完整/.test(messageContent)) {
			preferences.detailLevel = { value: "detailed", confidence: 0.8 };
		}

		// Cultural preference
		if (/傳統|古法|經典|正統/.test(messageContent)) {
			preferences.culturalApproach = {
				value: "traditional",
				confidence: 0.7,
			};
		} else if (/現代|科學|實用|實際/.test(messageContent)) {
			preferences.culturalApproach = { value: "modern", confidence: 0.7 };
		}

		// Tone preference
		if (/鼓勵|正面|樂觀/.test(messageContent)) {
			preferences.preferredTone = {
				value: "encouraging",
				confidence: 0.6,
			};
		} else if (/實際|現實|客觀/.test(messageContent)) {
			preferences.preferredTone = { value: "practical", confidence: 0.6 };
		}

		return preferences;
	}

	// Detect satisfaction indicators
	detectSatisfactionIndicators(messageContent, conversationContext) {
		const indicators = {
			satisfaction: 0.5,
			specificFeedback: [],
			emotionalState: "neutral",
		};

		// Positive indicators
		if (/謝謝|太好了|很準|有道理|很棒|滿意/.test(messageContent)) {
			indicators.satisfaction += 0.3;
			indicators.emotionalState = "positive";
			indicators.specificFeedback.push("positive_explicit");
		}

		// Negative indicators
		if (/不準|沒用|不對|奇怪|不滿意/.test(messageContent)) {
			indicators.satisfaction -= 0.3;
			indicators.emotionalState = "negative";
			indicators.specificFeedback.push("negative_explicit");
		}

		// Neutral engagement
		if (/了解|知道了|明白|收到/.test(messageContent)) {
			indicators.satisfaction += 0.1;
			indicators.specificFeedback.push("neutral_acknowledgment");
		}

		// Request for clarification (potential confusion)
		if (/什麼意思|不懂|解釋|再說一遍/.test(messageContent)) {
			indicators.satisfaction -= 0.1;
			indicators.specificFeedback.push("clarification_needed");
		}

		indicators.satisfaction = Math.max(
			0.0,
			Math.min(1.0, indicators.satisfaction)
		);
		return indicators;
	}

	// Calculate learning velocity based on user behavior
	calculateLearningVelocity(userProfile, conversationContext) {
		const baseVelocity =
			userProfile.adaptationData?.learningVelocity || 0.1;

		// Factors that affect learning velocity
		const consistencyFactor = this.calculateConsistency(userProfile);
		const feedbackQuality = this.calculateFeedbackQuality(userProfile);
		const engagementHistory = this.calculateEngagementHistory(userProfile);

		return this.learningAlgorithms.calculateAdaptationVelocity(
			consistencyFactor,
			feedbackQuality,
			engagementHistory
		);
	}

	// Update user profile with new data
	async updateUserProfile(userProfile, extractedData, behavioralInsights) {
		try {
			// Update birth data if extracted
			if (
				extractedData.birthData &&
				Object.keys(extractedData.birthData).length > 0
			) {
				userProfile.profileData.birthData = {
					...userProfile.profileData.birthData,
					...this.mergeWithConfidence(
						userProfile.profileData.birthData,
						extractedData.birthData
					),
				};
			}

			// Update communication style
			if (behavioralInsights.communicationStyle) {
				const currentStyle =
					userProfile.profileData.personality.communicationStyle;
				const newStyle = behavioralInsights.communicationStyle.style;
				const confidence =
					behavioralInsights.communicationStyle.confidence;

				if (confidence > 0.6) {
					userProfile.profileData.personality.communicationStyle =
						newStyle;
				}
			}

			// Update preferences
			if (behavioralInsights.preferenceSignals) {
				Object.entries(behavioralInsights.preferenceSignals).forEach(
					([key, value]) => {
						if (value.confidence > 0.5) {
							userProfile.profileData.personality[key] =
								value.value;
						}
					}
				);
			}

			// Update satisfaction tracking
			if (behavioralInsights.satisfactionIndicators) {
				if (
					!userProfile.profileData.consultationHistory
						.satisfactionRatings
				) {
					userProfile.profileData.consultationHistory.satisfactionRatings =
						[];
				}

				userProfile.profileData.consultationHistory.satisfactionRatings.push(
					behavioralInsights.satisfactionIndicators.satisfaction
				);

				// Keep only last 20 ratings
				if (
					userProfile.profileData.consultationHistory
						.satisfactionRatings.length > 20
				) {
					userProfile.profileData.consultationHistory.satisfactionRatings =
						userProfile.profileData.consultationHistory.satisfactionRatings.slice(
							-20
						);
				}
			}

			// Update adaptation metrics
			userProfile.adaptationData.lastUpdated = new Date();
			userProfile.adaptationData.updateFrequency += 1;
			userProfile.adaptationData.learningVelocity =
				behavioralInsights.learningVelocity || 0.1;

			// Calculate new adaptation score
			userProfile.adaptationData.adaptationScore =
				this.calculateAdaptationScore(userProfile);
			userProfile.adaptationData.confidenceLevel =
				this.calculateConfidenceLevel(userProfile);

			// Save updated profile
			await userProfile.save();
			return userProfile;
		} catch (error) {
			console.error("🚨 User profile update error:", error);
			return userProfile; // Return unchanged profile
		}
	}

	// Generate personalization recommendations
	generatePersonalizationRecommendations(userProfile) {
		const recommendations = {
			responseStyle: {},
			contentAdaptation: {},
			interactionStrategy: {},
			nextCollectionFocus: [],
		};

		// Response style recommendations
		const communicationStyle =
			userProfile.profileData.personality.communicationStyle;
		const preferredTone = userProfile.profileData.personality.preferredTone;

		recommendations.responseStyle = {
			tone: preferredTone || "encouraging",
			formality: communicationStyle === "formal" ? "high" : "moderate",
			structure: this.getStructurePreference(userProfile),
			length:
				userProfile.profileData.personality.detailPreference ||
				"moderate",
		};

		// Content adaptation recommendations
		recommendations.contentAdaptation = {
			includeBackground:
				userProfile.profileData.contextPreferences.includeBackground,
			useAnalogies:
				userProfile.profileData.contextPreferences.preferAnalogies,
			culturalApproach:
				userProfile.profileData.contextPreferences.culturalSensitivity,
			focusAreas: this.getTopicFocusAreas(userProfile),
		};

		// Interaction strategy
		recommendations.interactionStrategy = {
			questioningStyle: this.getQuestioningStrategy(userProfile),
			feedbackFrequency: this.getFeedbackFrequency(userProfile),
			proactiveRecommendations:
				this.shouldProvideProactiveAdvice(userProfile),
		};

		// Next data collection focus
		recommendations.nextCollectionFocus =
			this.identifyDataGaps(userProfile);

		return recommendations;
	}

	// Determine next collection strategy
	determineNextCollectionStrategy(userProfile) {
		const adaptationScore = userProfile.adaptationData.adaptationScore;
		const confidenceLevel = userProfile.adaptationData.confidenceLevel;
		const dataGaps = this.identifyDataGaps(userProfile);

		let strategy = "maintenance"; // Default strategy

		if (confidenceLevel < 0.5) {
			strategy = "intensive_collection";
		} else if (adaptationScore < 0.6) {
			strategy = "targeted_collection";
		} else if (dataGaps.length > 0) {
			strategy = "gap_filling";
		}

		return {
			strategy,
			priority: this.calculateCollectionPriority(userProfile),
			suggestedActions: this.getSuggestedCollectionActions(
				strategy,
				dataGaps
			),
			nextQuestion: this.getNextProgressiveQuestion(
				userProfile,
				dataGaps
			),
		};
	}

	// Helper methods
	getCategoryForExtraction(extractType) {
		const categoryMap = {
			birthYear: "birthData",
			birthMonth: "birthData",
			birthDay: "birthData",
			calendarType: "birthData",
			detailPreference: "preferences",
			feedbackSentiment: "feedback",
		};
		return categoryMap[extractType] || "context";
	}

	extractValue(match, extractType) {
		switch (extractType) {
			case "birthYear":
				return parseInt(match[1]);
			case "calendarType":
				return match[1] === "農曆" || match[1] === "陰曆"
					? "lunar"
					: "solar";
			case "detailPreference":
				if (/詳細|深入/.test(match[0])) return "detailed";
				if (/簡單|快速/.test(match[0])) return "brief";
				return "moderate";
			case "feedbackSentiment":
				if (/準確|有道理|很棒/.test(match[0])) return "positive";
				if (/不準|沒用|不對/.test(match[0])) return "negative";
				return "neutral";
			default:
				return match[0];
		}
	}

	analyzeMessageCharacteristics(messageContent) {
		return {
			length: messageContent.length,
			questionCount: (messageContent.match(/[？?]/g) || []).length,
			exclamationCount: (messageContent.match(/[！!]/g) || []).length,
			hasEmoji:
				/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(
					messageContent
				),
			sentiment: this.analyzeSentiment(messageContent),
		};
	}

	analyzeSentiment(text) {
		const positiveWords = /開心|高興|滿意|謝謝|太好|很棒|準確|有用/g;
		const negativeWords = /擔心|緊張|不滿|失望|不準|沒用|奇怪/g;

		const positiveCount = (text.match(positiveWords) || []).length;
		const negativeCount = (text.match(negativeWords) || []).length;

		if (positiveCount > negativeCount) return "positive";
		if (negativeCount > positiveCount) return "negative";
		return "neutral";
	}

	extractContextClues(messageContent, conversationContext) {
		return {
			isFollowUp: conversationContext.isFollowUp || false,
			mentionedTopics: this.extractMentionedTopics(messageContent),
			urgencyIndicators: this.detectUrgencyIndicators(messageContent),
			contextDependence: this.analyzeContextDependence(messageContent),
		};
	}

	extractMentionedTopics(messageContent) {
		const topicKeywords = {
			感情: /愛情|戀愛|結婚|分手|桃花|感情|對象/,
			財運: /錢|財運|投資|工作|收入|財富|事業/,
			健康: /健康|身體|生病|養生|運動/,
			家庭: /家庭|父母|子女|家人|親情/,
			事業: /工作|職業|升遷|老闆|同事|公司/,
		};

		const mentionedTopics = [];
		Object.entries(topicKeywords).forEach(([topic, pattern]) => {
			if (pattern.test(messageContent)) {
				mentionedTopics.push(topic);
			}
		});

		return mentionedTopics;
	}

	detectUrgencyIndicators(messageContent) {
		const urgentPatterns = /緊急|趕快|立刻|馬上|很急|快點/;
		return urgentPatterns.test(messageContent);
	}

	analyzeContextDependence(messageContent) {
		const dependenceIndicators = /這個|那個|剛才|之前|上次|像是/;
		return dependenceIndicators.test(messageContent);
	}

	mergeWithConfidence(existing, newData) {
		const merged = { ...existing };

		Object.entries(newData).forEach(([key, value]) => {
			if (value.confidence > (existing[key]?.confidence || 0)) {
				merged[key] = value.value;
				merged[`${key}_confidence`] = value.confidence;
			}
		});

		return merged;
	}

	calculateAdaptationScore(userProfile) {
		const factors = {
			dataCompleteness: this.calculateDataCompleteness(userProfile),
			interactionHistory: this.calculateInteractionHistory(userProfile),
			feedbackQuality: this.calculateFeedbackQuality(userProfile),
			consistency: this.calculateConsistency(userProfile),
		};

		return (
			Object.values(factors).reduce((sum, score) => sum + score, 0) /
			Object.keys(factors).length
		);
	}

	calculateDataCompleteness(userProfile) {
		const requiredFields = [
			"profileData.birthData.year",
			"profileData.personality.communicationStyle",
			"profileData.personality.detailPreference",
			"profileData.contextPreferences.culturalSensitivity",
		];

		const completedFields = requiredFields.filter((field) => {
			const value = this.getNestedValue(userProfile, field);
			return value !== undefined && value !== null && value !== "";
		});

		return completedFields.length / requiredFields.length;
	}

	getNestedValue(obj, path) {
		return path.split(".").reduce((current, key) => current?.[key], obj);
	}

	calculateInteractionHistory(userProfile) {
		const sessionCount =
			userProfile.profileData.consultationHistory.totalSessions;
		if (sessionCount === 0) return 0;

		// More interactions = better adaptation
		return Math.min(1.0, sessionCount / 10); // Max score at 10+ sessions
	}

	calculateFeedbackQuality(userProfile) {
		const ratings =
			userProfile.profileData.consultationHistory.satisfactionRatings;
		if (!ratings || ratings.length === 0) return 0.5;

		const averageRating =
			ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
		return averageRating;
	}

	calculateConsistency(userProfile) {
		// Measure consistency in user behavior and preferences
		const communicationHistory =
			userProfile.profileData.personality.communicationStyle;
		// This would be more complex in a real implementation
		return 0.7; // Placeholder
	}

	calculateConfidenceLevel(userProfile) {
		const adaptationScore = userProfile.adaptationData.adaptationScore;
		const sessionCount =
			userProfile.profileData.consultationHistory.totalSessions;
		const dataQuality = this.calculateDataCompleteness(userProfile);

		return (
			adaptationScore * 0.4 +
			Math.min(1.0, sessionCount / 5) * 0.3 +
			dataQuality * 0.3
		);
	}

	getStructurePreference(userProfile) {
		const style = userProfile.profileData.personality.communicationStyle;
		const detailLevel =
			userProfile.profileData.personality.detailPreference;

		if (style === "analytical" || detailLevel === "detailed")
			return "organized";
		if (style === "casual") return "conversational";
		return "balanced";
	}

	getTopicFocusAreas(userProfile) {
		return userProfile.profileData.personality.topicInterests
			.sort((a, b) => b.importance - a.importance)
			.slice(0, 3)
			.map((topic) => topic.topic);
	}

	getQuestioningStrategy(userProfile) {
		const communicationStyle =
			userProfile.profileData.personality.communicationStyle;
		const confidence = userProfile.adaptationData.confidenceLevel;

		if (confidence < 0.4) return "gentle_probing";
		if (communicationStyle === "formal") return "respectful_inquiry";
		if (communicationStyle === "casual") return "friendly_questioning";
		return "balanced_approach";
	}

	getFeedbackFrequency(userProfile) {
		const satisfactionHistory =
			userProfile.profileData.consultationHistory.satisfactionRatings;
		const averageSatisfaction =
			satisfactionHistory.length > 0
				? satisfactionHistory.reduce((sum, rating) => sum + rating, 0) /
					satisfactionHistory.length
				: 0.5;

		if (averageSatisfaction < 0.6) return "frequent";
		if (averageSatisfaction > 0.8) return "occasional";
		return "moderate";
	}

	shouldProvideProactiveAdvice(userProfile) {
		const engagementLevel = this.calculateEngagementHistory(userProfile);
		const preferredTone = userProfile.profileData.personality.preferredTone;

		return engagementLevel > 0.7 && preferredTone === "encouraging";
	}

	calculateEngagementHistory(userProfile) {
		const sessionCount =
			userProfile.profileData.consultationHistory.totalSessions;
		const averageSessionLength =
			userProfile.profileData.consultationHistory.averageSessionLength;
		const followUpRate =
			userProfile.profileData.consultationHistory.followUpRate;

		return (
			Math.min(1.0, sessionCount / 5) * 0.4 +
			Math.min(1.0, averageSessionLength / 300) * 0.3 + // 5 minutes = good engagement
			followUpRate * 0.3
		);
	}

	identifyDataGaps(userProfile) {
		const gaps = [];

		// Check for missing birth data
		if (!userProfile.profileData.birthData.year) {
			gaps.push({
				type: "birthData",
				field: "year",
				priority: "high",
				question: "為了提供更精準的分析，可以告訴我你的出生年份嗎？",
			});
		}

		if (
			!userProfile.profileData.birthData.month &&
			userProfile.profileData.birthData.year
		) {
			gaps.push({
				type: "birthData",
				field: "month",
				priority: "high",
				question: "出生月份和日期能幫助我做更詳細的分析，方便分享嗎？",
			});
		}

		// Check for preference gaps
		if (
			userProfile.profileData.personality.detailPreference ===
				"moderate" &&
			userProfile.profileData.consultationHistory.totalSessions > 2
		) {
			gaps.push({
				type: "preferences",
				field: "detailPreference",
				priority: "medium",
				question: "你比較喜歡詳細的分析還是簡潔的建議？",
			});
		}

		return gaps.sort((a, b) => {
			const priorityOrder = { high: 3, medium: 2, low: 1 };
			return priorityOrder[b.priority] - priorityOrder[a.priority];
		});
	}

	calculateCollectionPriority(userProfile) {
		const confidenceLevel = userProfile.adaptationData.confidenceLevel;
		const sessionCount =
			userProfile.profileData.consultationHistory.totalSessions;

		if (confidenceLevel < 0.3) return "high";
		if (confidenceLevel < 0.6 || sessionCount < 3) return "medium";
		return "low";
	}

	getSuggestedCollectionActions(strategy, dataGaps) {
		const actions = [];

		switch (strategy) {
			case "intensive_collection":
				actions.push("Ask direct questions about missing key data");
				actions.push("Use multiple collection methods per interaction");
				actions.push("Provide incentives for data sharing");
				break;

			case "targeted_collection":
				actions.push("Focus on high-priority gaps");
				actions.push("Use natural conversation flow");
				actions.push("Collect one key piece per interaction");
				break;

			case "gap_filling":
				actions.push("Address specific identified gaps");
				actions.push("Use progressive questioning");
				break;

			case "maintenance":
				actions.push("Monitor for preference changes");
				actions.push("Validate existing data accuracy");
				break;
		}

		return actions;
	}

	getNextProgressiveQuestion(userProfile, dataGaps) {
		if (dataGaps.length > 0) {
			return dataGaps[0].question;
		}

		// If no gaps, ask preference validation questions
		const sessionCount =
			userProfile.profileData.consultationHistory.totalSessions;
		if (sessionCount > 3 && sessionCount % 5 === 0) {
			return "這段時間的回答風格如何？有什麼地方可以改進的嗎？";
		}

		return null;
	}

	// Get user profile or create new one
	async getUserProfile(userId) {
		try {
			let profile = await UserProfile.findOne({ userId });

			if (!profile) {
				profile = new UserProfile({
					userId,
					profileData: {
						birthData: {},
						personality: {
							communicationStyle: "casual",
							detailPreference: "moderate",
							topicInterests: [],
							preferredTone: "encouraging",
						},
						consultationHistory: {
							totalSessions: 0,
							averageSessionLength: 0,
							preferredTopics: [],
							mostAskedQuestions: [],
							satisfactionRatings: [],
							followUpRate: 0,
						},
						contextPreferences: {
							includeBackground: true,
							preferAnalogies: false,
							wantActionableAdvice: true,
							culturalSensitivity: "mixed",
						},
						feedbackPatterns: {
							commonPositiveKeywords: [],
							commonNegativeKeywords: [],
							responseQualityHistory: [],
							improvementAreas: [],
						},
					},
					adaptationData: {
						lastUpdated: new Date(),
						updateFrequency: 0,
						adaptationScore: 0.3,
						confidenceLevel: 0.2,
						learningVelocity: 0.1,
					},
					privacySettings: {
						dataRetention: "temporary",
						analyticsConsent: false,
						personalizationLevel: "moderate",
					},
				});

				await profile.save();
			}

			return profile;
		} catch (error) {
			console.error("🚨 Get user profile error:", error);
			throw error;
		}
	}

	// Fallback data collection for error cases
	fallbackDataCollection(userId, messageContent) {
		return {
			userProfile: null,
			extractedData: {
				messageCharacteristics:
					this.analyzeMessageCharacteristics(messageContent),
				contextClues: {
					mentionedTopics:
						this.extractMentionedTopics(messageContent),
				},
			},
			behavioralInsights: {
				communicationStyle:
					this.detectCommunicationStyle(messageContent),
				engagementLevel: 0.5,
			},
			personalizationRecommendations: {
				responseStyle: { tone: "encouraging", formality: "moderate" },
				contentAdaptation: { includeBackground: true },
				interactionStrategy: { questioningStyle: "balanced_approach" },
			},
			nextCollectionStrategy: {
				strategy: "basic_collection",
				priority: "low",
			},
			adaptationScore: 0.3,
			confidenceLevel: 0.2,
		};
	}
}

export default ProgressiveDataCollectionSystem;
