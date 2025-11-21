// 🎭 Adaptive Tone Personalization System
// Phase 2 Implementation - Dynamic tone adaptation based on user personality and context

class AdaptiveTonePersonalizationSystem {
	constructor() {
		// Comprehensive tone profiles with cultural nuances
		this.toneProfiles = {
			// Encouraging and supportive tones
			encouraging: {
				keywords: ["太好了", "很棒", "完全可以", "一定會", "相信"],
				modifiers: ["✨", "🌟", "💪", "🎯"],
				structure: {
					opening: ["太好了！", "很棒的問題！", "我來為你分析一下～"],
					transition: ["讓我們看看", "從這個角度來說", "更重要的是"],
					emphasis: ["特別要注意", "重點是", "關鍵在於"],
					closing: ["相信會有好結果！", "祝你順利！", "加油！✨"],
				},
				culturalElements: {
					traditional: [
						"天助自助者",
						"好的開始是成功的一半",
						"積善之家必有餘慶",
					],
					modern: [
						"保持正面思維",
						"相信自己的直覺",
						"機會總是留給準備好的人",
					],
				},
			},

			// Professional and formal tones
			professional: {
				keywords: ["分析", "建議", "根據", "專業判斷", "客觀而言"],
				modifiers: ["📊", "📋", "🔍"],
				structure: {
					opening: ["根據分析", "從專業角度來看", "綜合各方面因素"],
					transition: ["進一步分析", "另一方面", "需要考慮的是"],
					emphasis: ["重要提醒", "核心要點", "關鍵因素"],
					closing: [
						"以上是我的專業分析",
						"希望對你有幫助",
						"如有疑問歡迎進一步討論",
					],
				},
				culturalElements: {
					traditional: ["古籍記載", "傳統智慧告訴我們", "依據古法"],
					modern: ["現代研究顯示", "結合當代理論", "科學角度分析"],
				},
			},

			// Warm and empathetic tones
			empathetic: {
				keywords: ["理解", "感受", "關心", "體諒", "陪伴"],
				modifiers: ["💕", "🤗", "❤️", "🌸"],
				structure: {
					opening: [
						"我理解你的感受",
						"這確實是讓人關心的問題",
						"你的擔心很正常",
					],
					transition: [
						"我們一起來看看",
						"讓我陪你分析",
						"慢慢來不急",
					],
					emphasis: ["特別需要注意的是", "這點很重要", "請記住"],
					closing: [
						"希望能減輕你的擔憂",
						"記住你並不孤單",
						"一切都會好起來的💕",
					],
				},
				culturalElements: {
					traditional: [
						"人同此心，心同此理",
						"患難見真情",
						"溫故知新",
					],
					modern: [
						"每個人都有情緒",
						"尋求支持是正常的",
						"關愛自己很重要",
					],
				},
			},

			// Practical and action-oriented tones
			practical: {
				keywords: ["具體", "實際", "可行", "建議", "行動"],
				modifiers: ["🎯", "⚡", "🔧", "📝"],
				structure: {
					opening: ["具體建議如下", "實際做法是", "你可以這樣做"],
					transition: ["接下來", "另外還可以", "進一步的話"],
					emphasis: ["重點執行", "優先處理", "立即行動"],
					closing: ["按這些步驟執行", "記得實際應用", "祝你成功！🎯"],
				},
				culturalElements: {
					traditional: ["知行合一", "腳踏實地", "穩扎穩打"],
					modern: ["落實到行動", "制定具體計劃", "設定可達成目標"],
				},
			},

			// Mystical and spiritual tones
			mystical: {
				keywords: ["緣分", "天意", "命運", "靈性", "宇宙"],
				modifiers: ["🔮", "✨", "🌙", "⭐"],
				structure: {
					opening: [
						"從玄學角度來看",
						"宇宙自有安排",
						"這是緣分的指引",
					],
					transition: [
						"命運的軌跡顯示",
						"靈性層面來說",
						"更深層的意義是",
					],
					emphasis: ["宇宙的訊息", "靈性的指引", "命運的安排"],
					closing: [
						"相信宇宙的安排✨",
						"跟隨內心的聲音",
						"一切都是最好的安排🌙",
					],
				},
				culturalElements: {
					traditional: ["天人合一", "順應天時", "萬物有靈"],
					modern: ["正能量", "心想事成", "吸引力法則"],
				},
			},

			// Casual and friendly tones
			casual: {
				keywords: ["嗨", "超", "蠻", "還不錯", "挺好的"],
				modifiers: ["😊", "👍", "🤔", "💭"],
				structure: {
					opening: ["嗨！", "好問題～", "我覺得"],
					transition: ["然後呢", "還有就是", "另外"],
					emphasis: ["超重要的是", "一定要注意", "記得喔"],
					closing: [
						"希望有幫到你～",
						"加油加油！😊",
						"有問題再問我！",
					],
				},
				culturalElements: {
					traditional: ["老祖宗說", "傳統上來講", "以前的人"],
					modern: ["現在流行", "大家都這樣做", "比較trendy的做法"],
				},
			},

			// Analytical and logical tones
			analytical: {
				keywords: ["數據", "邏輯", "證據", "分析", "客觀"],
				modifiers: ["📊", "🔬", "📈", "⚖️"],
				structure: {
					opening: ["從數據分析來看", "邏輯推論顯示", "客觀分析結果"],
					transition: ["進一步分析", "數據顯示", "邏輯上來說"],
					emphasis: ["關鍵數據", "核心邏輯", "重要證據"],
					closing: ["綜合分析結果📊", "基於邏輯推論", "客觀建議如上"],
				},
				culturalElements: {
					traditional: [
						"古人智慧經過驗證",
						"傳統方法有其道理",
						"歷史數據支持",
					],
					modern: ["科學研究證實", "統計數據顯示", "現代分析方法"],
				},
			},
		};

		// User personality indicators and mapping
		this.personalityIndicators = {
			// Communication style indicators
			communicationStyle: {
				formal: {
					patterns: [/你|請問|煩請|敬請|感謝你/],
					preferredTones: ["professional", "empathetic"],
					confidence: 0.8,
				},
				casual: {
					patterns: [/你|嗨|哈囉|謝啦|超|蠻/],
					preferredTones: ["casual", "encouraging"],
					confidence: 0.7,
				},
				emotional: {
					patterns: [/擔心|緊張|害怕|開心|興奮|難過/],
					preferredTones: ["empathetic", "encouraging"],
					confidence: 0.9,
				},
				analytical: {
					patterns: [/分析|數據|邏輯|證據|客觀|科學/],
					preferredTones: ["analytical", "professional"],
					confidence: 0.8,
				},
				spiritual: {
					patterns: [/命運|緣分|天意|宇宙|靈性|修行/],
					preferredTones: ["mystical", "empathetic"],
					confidence: 0.9,
				},
			},

			// Emotional state indicators
			emotionalState: {
				anxious: {
					patterns: [/擔心|緊張|焦慮|不安|害怕|恐懼/],
					toneAdjustments: {
						primary: "empathetic",
						secondary: "encouraging",
						avoid: ["analytical", "casual"],
					},
				},
				excited: {
					patterns: [/興奮|開心|期待|太好了|太棒了/],
					toneAdjustments: {
						primary: "encouraging",
						secondary: "casual",
						enhance: ["positive_modifiers"],
					},
				},
				confused: {
					patterns: [/不懂|不明白|搞不清楚|什麼意思|解釋/],
					toneAdjustments: {
						primary: "professional",
						secondary: "empathetic",
						emphasis: ["clear_structure", "step_by_step"],
					},
				},
				skeptical: {
					patterns: [/不相信|懷疑|真的嗎|可能嗎|有用嗎/],
					toneAdjustments: {
						primary: "analytical",
						secondary: "professional",
						emphasis: ["evidence_based", "logical_reasoning"],
					},
				},
			},

			// Context sensitivity indicators
			contextSensitivity: {
				urgent: {
					patterns: [/緊急|急|趕快|立刻|馬上/],
					toneAdjustments: {
						primary: "practical",
						structure: "direct",
						emphasis: "immediate_action",
					},
				},
				leisurely: {
					patterns: [/慢慢|不急|有空|隨時|有時間/],
					toneAdjustments: {
						primary: "casual",
						structure: "detailed",
						emphasis: "comprehensive_explanation",
					},
				},
				serious: {
					patterns: [/重要|嚴重|關鍵|決定|影響很大/],
					toneAdjustments: {
						primary: "professional",
						secondary: "empathetic",
						structure: "formal",
					},
				},
			},
		};

		// Dynamic tone adaptation rules
		this.adaptationRules = {
			// Context-based adaptations
			contextual: {
				first_interaction: {
					default_tone: "professional",
					approach: "cautious",
					personalization_level: "low",
				},
				returning_user: {
					adaptation: "use_learned_preferences",
					personalization_level: "high",
				},
				topic_specific: {
					感情: { preferred_tones: ["empathetic", "encouraging"] },
					財運: { preferred_tones: ["practical", "professional"] },
					健康: { preferred_tones: ["empathetic", "practical"] },
					工作: { preferred_tones: ["professional", "practical"] },
					人際關係: {
						preferred_tones: ["empathetic", "encouraging"],
					},
					子女: { preferred_tones: ["empathetic", "encouraging"] },
					因緣: { preferred_tones: ["mystical", "encouraging"] },
					居家佈局: {
						preferred_tones: ["practical", "professional"],
					},
				},
			},

			// User feedback-based adaptations
			feedback_based: {
				positive_feedback: {
					action: "reinforce_current_tone",
					confidence_boost: 0.1,
				},
				negative_feedback: {
					action: "try_alternative_tone",
					confidence_reduction: 0.2,
				},
				confusion_feedback: {
					action: "simplify_and_clarify",
					tone_shift: "more_structured",
				},
				satisfaction_feedback: {
					action: "maintain_consistency",
					learning_boost: 0.15,
				},
			},

			// Time-based adaptations
			temporal: {
				session_progression: {
					early: "more_formal",
					middle: "adapted_to_user",
					late: "more_casual_if_comfortable",
				},
				relationship_development: {
					new_user: "professional_but_warm",
					familiar_user: "personalized_approach",
					long_term_user: "deeply_personalized",
				},
			},
		};

		// Response enhancement strategies
		this.enhancementStrategies = {
			// Emotional intelligence enhancements
			emotional_intelligence: {
				empathy_phrases: {
					understanding: [
						"我理解你的感受",
						"這確實讓人擔心",
						"你的想法很合理",
					],
					validation: [
						"你的擔心是正常的",
						"這個問題很重要",
						"你考慮得很周到",
					],
					support: [
						"我會陪你一起面對",
						"相信你能處理好",
						"你並不孤單",
					],
				},
				emotional_bridging: {
					anxiety_to_hope: "雖然現在感到擔心，但我相信會有轉機",
					confusion_to_clarity: "讓我為你一步步解釋清楚",
					skepticism_to_trust: "我理解你的疑慮，讓我用具體例子說明",
				},
			},

			// Cultural sensitivity enhancements
			cultural_sensitivity: {
				traditional_elements: {
					expressions: ["古人云", "傳統智慧", "祖先的經驗"],
					concepts: ["陰陽平衡", "五行相生", "天人合一"],
					values: ["家和萬事興", "修身齊家", "積善積德"],
				},
				modern_elements: {
					expressions: ["現代觀點", "科學角度", "當代研究"],
					concepts: ["全人發展", "心理健康", "生活品質"],
					values: ["個人成長", "自我實現", "平衡發展"],
				},
			},

			// Personalization depth levels
			personalization_depth: {
				surface: {
					elements: ["name_usage", "basic_tone_matching"],
					confidence_threshold: 0.3,
				},
				moderate: {
					elements: [
						"communication_style_adaptation",
						"topic_preference_incorporation",
					],
					confidence_threshold: 0.6,
				},
				deep: {
					elements: [
						"personality_based_reasoning",
						"emotional_pattern_recognition",
						"predictive_personalization",
					],
					confidence_threshold: 0.8,
				},
			},
		};
	}

	// Main method: Generate adaptive personalized response
	generateAdaptiveResponse(
		userProfile,
		messageContent,
		conversationContext,
		baseResponse
	) {
		try {
			// Analyze current user state
			const userState = this.analyzeCurrentUserState(
				userProfile,
				messageContent,
				conversationContext
			);

			// Determine optimal tone profile
			const optimalTone = this.determineOptimalTone(
				userState,
				conversationContext
			);

			// Generate tone-adapted response
			const adaptedResponse = this.adaptResponseToTone(
				baseResponse,
				optimalTone,
				userState
			);

			// Apply personalization enhancements
			const personalizedResponse = this.applyPersonalizationEnhancements(
				adaptedResponse,
				userProfile,
				userState
			);

			// Add contextual elements
			const contextualizedResponse = this.addContextualElements(
				personalizedResponse,
				conversationContext,
				userState
			);

			// Generate adaptation insights for learning
			const adaptationInsights = this.generateAdaptationInsights(
				userState,
				optimalTone,
				userProfile
			);

			return {
				personalizedResponse: contextualizedResponse,
				toneProfile: optimalTone,
				userState,
				adaptationInsights,
				personalizationLevel:
					this.calculatePersonalizationLevel(userProfile),
				confidence: this.calculateAdaptationConfidence(
					userState,
					userProfile
				),
			};
		} catch (error) {
			console.error("🚨 Adaptive tone personalization error:", error);
			return this.fallbackPersonalization(baseResponse, messageContent);
		}
	}

	// Analyze current user state from multiple signals
	analyzeCurrentUserState(userProfile, messageContent, conversationContext) {
		const state = {
			communicationStyle: null,
			emotionalState: null,
			contextSensitivity: null,
			personalityTraits: [],
			confidence: 0.5,
			consistency: 0.5,
		};

		// Analyze communication style
		state.communicationStyle = this.detectCommunicationStyle(
			messageContent,
			userProfile
		);

		// Analyze emotional state
		state.emotionalState = this.detectEmotionalState(
			messageContent,
			conversationContext
		);

		// Analyze context sensitivity
		state.contextSensitivity = this.detectContextSensitivity(
			messageContent,
			conversationContext
		);

		// Extract personality traits
		state.personalityTraits = this.extractPersonalityTraits(
			messageContent,
			userProfile
		);

		// Calculate consistency with previous interactions
		state.consistency = this.calculateConsistency(state, userProfile);

		// Overall confidence in user state analysis
		state.confidence = this.calculateStateConfidence(state, userProfile);

		return state;
	}

	// Detect communication style from message and history
	detectCommunicationStyle(messageContent, userProfile) {
		const styles = {};

		// Analyze current message patterns
		Object.entries(this.personalityIndicators.communicationStyle).forEach(
			([style, config]) => {
				let score = 0;
				config.patterns.forEach((pattern) => {
					if (pattern.test(messageContent)) {
						score += config.confidence;
					}
				});
				styles[style] = score;
			}
		);

		// Incorporate historical data
		if (userProfile?.profileData?.personality?.communicationStyle) {
			const historicalStyle =
				userProfile.profileData.personality.communicationStyle;
			styles[historicalStyle] = (styles[historicalStyle] || 0) + 0.3;
		}

		// Return dominant style
		const dominantStyle = Object.entries(styles).sort(
			([, a], [, b]) => b - a
		)[0];

		return {
			style: dominantStyle?.[0] || "casual",
			confidence: dominantStyle?.[1] || 0.3,
			allScores: styles,
		};
	}

	// Detect emotional state from message content
	detectEmotionalState(messageContent, conversationContext) {
		const emotions = {};

		Object.entries(this.personalityIndicators.emotionalState).forEach(
			([emotion, config]) => {
				let score = 0;
				config.patterns.forEach((pattern) => {
					const matches = messageContent.match(pattern);
					if (matches) {
						score += matches.length * 0.3;
					}
				});
				emotions[emotion] = score;
			}
		);

		// Consider conversation context
		if (
			conversationContext.previousResponse &&
			conversationContext.userSatisfaction
		) {
			if (conversationContext.userSatisfaction < 0.5) {
				emotions.confused = (emotions.confused || 0) + 0.2;
			}
		}

		const dominantEmotion = Object.entries(emotions).sort(
			([, a], [, b]) => b - a
		)[0];

		return {
			emotion: dominantEmotion?.[0] || "neutral",
			intensity: Math.min(1.0, dominantEmotion?.[1] || 0.2),
			allEmotions: emotions,
		};
	}

	// Detect context sensitivity
	detectContextSensitivity(messageContent, conversationContext) {
		const contexts = {};

		Object.entries(this.personalityIndicators.contextSensitivity).forEach(
			([context, config]) => {
				let score = 0;
				config.patterns.forEach((pattern) => {
					if (pattern.test(messageContent)) {
						score += 0.4;
					}
				});
				contexts[context] = score;
			}
		);

		// Consider timing context
		const currentHour = new Date().getHours();
		if (currentHour >= 22 || currentHour <= 6) {
			contexts.urgent = (contexts.urgent || 0) + 0.1; // Late night might indicate urgency
		}

		const dominantContext = Object.entries(contexts).sort(
			([, a], [, b]) => b - a
		)[0];

		return {
			context: dominantContext?.[0] || "normal",
			intensity: dominantContext?.[1] || 0.1,
			allContexts: contexts,
		};
	}

	// Extract personality traits from analysis
	extractPersonalityTraits(messageContent, userProfile) {
		const traits = [];

		// Analyze openness
		if (/新的|嘗試|探索|學習|了解/.test(messageContent)) {
			traits.push({ trait: "openness", strength: 0.6 });
		}

		// Analyze detail orientation
		if (/詳細|具體|明確|清楚|準確/.test(messageContent)) {
			traits.push({ trait: "detail_oriented", strength: 0.7 });
		}

		// Analyze emotional expressiveness
		if (/感覺|覺得|心情|情緒|感受/.test(messageContent)) {
			traits.push({ trait: "emotionally_expressive", strength: 0.6 });
		}

		// Analyze action orientation
		if (/做|行動|執行|實行|開始/.test(messageContent)) {
			traits.push({ trait: "action_oriented", strength: 0.7 });
		}

		return traits;
	}

	// Calculate consistency with previous interactions
	calculateConsistency(currentState, userProfile) {
		if (!userProfile?.profileData?.personality) {
			return 0.5; // Neutral consistency for new users
		}

		let consistencyScore = 0.5;
		const historicalStyle =
			userProfile.profileData.personality.communicationStyle;

		if (currentState.communicationStyle.style === historicalStyle) {
			consistencyScore += 0.3;
		}

		// Additional consistency checks could be added here

		return Math.min(1.0, consistencyScore);
	}

	// Calculate confidence in user state analysis
	calculateStateConfidence(state, userProfile) {
		let confidence = 0.3; // Base confidence

		// Boost confidence based on analysis strength
		confidence += state.communicationStyle.confidence * 0.3;
		confidence += state.emotionalState.intensity * 0.2;
		confidence += state.contextSensitivity.intensity * 0.1;

		// Boost confidence based on user history
		if (userProfile?.adaptationData?.confidenceLevel) {
			confidence += userProfile.adaptationData.confidenceLevel * 0.2;
		}

		// Boost confidence based on consistency
		confidence += state.consistency * 0.2;

		return Math.min(1.0, confidence);
	}

	// Determine optimal tone based on user state
	determineOptimalTone(userState, conversationContext) {
		const toneScores = {};

		// Get base recommendations from communication style
		const styleConfig =
			this.personalityIndicators.communicationStyle[
				userState.communicationStyle.style
			];
		if (styleConfig?.preferredTones) {
			styleConfig.preferredTones.forEach((tone) => {
				toneScores[tone] = (toneScores[tone] || 0) + 0.4;
			});
		}

		// Adjust based on emotional state
		const emotionConfig =
			this.personalityIndicators.emotionalState[
				userState.emotionalState.emotion
			];
		if (emotionConfig?.toneAdjustments) {
			if (emotionConfig.toneAdjustments.primary) {
				toneScores[emotionConfig.toneAdjustments.primary] =
					(toneScores[emotionConfig.toneAdjustments.primary] || 0) +
					0.5;
			}
			if (emotionConfig.toneAdjustments.secondary) {
				toneScores[emotionConfig.toneAdjustments.secondary] =
					(toneScores[emotionConfig.toneAdjustments.secondary] || 0) +
					0.3;
			}
		}

		// Adjust based on context sensitivity
		const contextConfig =
			this.personalityIndicators.contextSensitivity[
				userState.contextSensitivity.context
			];
		if (contextConfig?.toneAdjustments?.primary) {
			toneScores[contextConfig.toneAdjustments.primary] =
				(toneScores[contextConfig.toneAdjustments.primary] || 0) + 0.3;
		}

		// Topic-specific adjustments
		if (conversationContext.detectedTopic) {
			const topicConfig =
				this.adaptationRules.contextual.topic_specific[
					conversationContext.detectedTopic
				];
			if (topicConfig?.preferred_tones) {
				topicConfig.preferred_tones.forEach((tone) => {
					toneScores[tone] = (toneScores[tone] || 0) + 0.2;
				});
			}
		}

		// Select optimal tone
		const optimalTone = Object.entries(toneScores).sort(
			([, a], [, b]) => b - a
		)[0];

		return {
			primaryTone: optimalTone?.[0] || "encouraging",
			confidence: optimalTone?.[1] || 0.5,
			allScores: toneScores,
			fallbackTone: "professional",
		};
	}

	// Adapt response to selected tone
	adaptResponseToTone(baseResponse, toneProfile, userState) {
		const tone = toneProfile.primaryTone;
		const profile = this.toneProfiles[tone];

		if (!profile) {
			return baseResponse;
		}

		// Structure the response according to tone profile
		let adaptedResponse = "";

		// Add opening
		const opening = this.selectRandomElement(profile.structure.opening);
		adaptedResponse += opening + " ";

		// Process base response content
		const processedContent = this.processToneLanguage(
			baseResponse,
			profile,
			userState
		);
		adaptedResponse += processedContent;

		// Add appropriate closing
		const closing = this.selectRandomElement(profile.structure.closing);
		adaptedResponse += " " + closing;

		// Add tone-appropriate modifiers
		adaptedResponse = this.addToneModifiers(
			adaptedResponse,
			profile,
			userState
		);

		return adaptedResponse;
	}

	// Process language according to tone profile
	processToneLanguage(content, profile, userState) {
		let processedContent = content;

		// Replace neutral phrases with tone-specific ones
		const neutralToToneMapping = {
			建議: this.selectRandomElement(profile.keywords),
			分析: profile.keywords.includes("分析") ? "分析" : "看看",
			問題:
				userState.emotionalState.emotion === "anxious"
					? "擔心的問題"
					: "問題",
		};

		Object.entries(neutralToToneMapping).forEach(
			([neutral, toneSpecific]) => {
				const regex = new RegExp(neutral, "g");
				processedContent = processedContent.replace(
					regex,
					toneSpecific
				);
			}
		);

		return processedContent;
	}

	// Add tone-appropriate modifiers
	addToneModifiers(response, profile, userState) {
		let modifiedResponse = response;

		// Add emojis/modifiers based on tone and emotional state
		if (
			userState.emotionalState.emotion === "excited" &&
			profile.modifiers
		) {
			const modifier = this.selectRandomElement(profile.modifiers);
			modifiedResponse += " " + modifier;
		}

		// Add emphasis markers for important points
		if (userState.contextSensitivity.context === "serious") {
			modifiedResponse = modifiedResponse.replace(
				/(重要|關鍵|注意)/g,
				"**$1**"
			);
		}

		return modifiedResponse;
	}

	// Apply personalization enhancements
	applyPersonalizationEnhancements(response, userProfile, userState) {
		let enhancedResponse = response;

		// Apply emotional intelligence enhancements
		if (userState.emotionalState.emotion !== "neutral") {
			enhancedResponse = this.addEmotionalIntelligence(
				enhancedResponse,
				userState
			);
		}

		// Apply cultural sensitivity enhancements
		if (userProfile?.profileData?.contextPreferences?.culturalSensitivity) {
			enhancedResponse = this.addCulturalElements(
				enhancedResponse,
				userProfile.profileData.contextPreferences.culturalSensitivity
			);
		}

		// Apply depth personalization based on confidence
		const personalizationLevel =
			this.calculatePersonalizationLevel(userProfile);
		enhancedResponse = this.applyDepthPersonalization(
			enhancedResponse,
			personalizationLevel,
			userProfile
		);

		return enhancedResponse;
	}

	// Add emotional intelligence elements
	addEmotionalIntelligence(response, userState) {
		const emotion = userState.emotionalState.emotion;
		const strategies = this.enhancementStrategies.emotional_intelligence;

		let enhancedResponse = response;

		// Add empathy phrases for emotional states
		if (emotion === "anxious") {
			const empathyPhrase = this.selectRandomElement(
				strategies.empathy_phrases.understanding
			);
			enhancedResponse = empathyPhrase + " " + enhancedResponse;
		} else if (emotion === "confused") {
			const clarityPhrase = "讓我為你一步步解釋清楚。";
			enhancedResponse = clarityPhrase + " " + enhancedResponse;
		}

		return enhancedResponse;
	}

	// Add cultural elements
	addCulturalElements(response, culturalPreference) {
		const culturalElements =
			this.enhancementStrategies.cultural_sensitivity;
		let enhancedResponse = response;

		if (culturalPreference === "traditional") {
			// Add traditional expressions occasionally
			if (Math.random() < 0.3) {
				const expression = this.selectRandomElement(
					culturalElements.traditional_elements.expressions
				);
				enhancedResponse = enhancedResponse.replace(
					"分析來看",
					expression + "，分析來看"
				);
			}
		} else if (culturalPreference === "modern") {
			// Add modern expressions occasionally
			if (Math.random() < 0.3) {
				const expression = this.selectRandomElement(
					culturalElements.modern_elements.expressions
				);
				enhancedResponse = enhancedResponse.replace(
					"研究顯示",
					expression + "研究顯示"
				);
			}
		}

		return enhancedResponse;
	}

	// Apply depth personalization
	applyDepthPersonalization(response, level, userProfile) {
		const depthConfig =
			this.enhancementStrategies.personalization_depth[level];
		let enhancedResponse = response;

		if (
			depthConfig.elements.includes("name_usage") &&
			userProfile?.userId
		) {
			// Add personalized addressing (would need user name in profile)
			// This is a placeholder - actual implementation would use stored user preferences
		}

		if (
			depthConfig.elements.includes("personality_based_reasoning") &&
			userProfile
		) {
			// Add reasoning style based on personality
			const communicationStyle =
				userProfile?.profileData?.personality?.communicationStyle;
			if (communicationStyle === "analytical") {
				enhancedResponse = this.addLogicalStructure(enhancedResponse);
			}
		}

		return enhancedResponse;
	}

	// Add logical structure for analytical users
	addLogicalStructure(response) {
		return response.replace(/^(.+)$/gm, (match) => {
			if (
				match.includes("首先") ||
				match.includes("其次") ||
				match.includes("最後")
			) {
				return match;
			}
			return match;
		});
	}

	// Add contextual elements
	addContextualElements(response, conversationContext, userState) {
		let contextualizedResponse = response;

		// Add transition elements for topic changes
		if (conversationContext.topicTransition) {
			const transition =
				conversationContext.topicTransition.transitionResponse;
			contextualizedResponse = transition + " " + contextualizedResponse;
		}

		// Add urgency elements if needed
		if (userState.contextSensitivity.context === "urgent") {
			contextualizedResponse =
				"我立即為你分析： " + contextualizedResponse;
		}

		return contextualizedResponse;
	}

	// Calculate personalization level
	calculatePersonalizationLevel(userProfile) {
		if (!userProfile?.adaptationData?.confidenceLevel) {
			return "surface";
		}

		const confidence = userProfile.adaptationData.confidenceLevel;

		if (confidence >= 0.8) return "deep";
		if (confidence >= 0.6) return "moderate";
		return "surface";
	}

	// Calculate adaptation confidence
	calculateAdaptationConfidence(userState, userProfile) {
		let confidence = userState.confidence;

		// Boost based on user profile completeness
		if (userProfile?.adaptationData?.adaptationScore) {
			confidence += userProfile.adaptationData.adaptationScore * 0.3;
		}

		// Boost based on consistency
		confidence += userState.consistency * 0.2;

		return Math.min(1.0, confidence);
	}

	// Generate adaptation insights for learning
	generateAdaptationInsights(userState, optimalTone, userProfile) {
		return {
			toneSelection: {
				chosen: optimalTone.primaryTone,
				confidence: optimalTone.confidence,
				reasoning: this.generateToneSelectionReasoning(
					userState,
					optimalTone
				),
			},
			userStateAnalysis: {
				communicationStyle: userState.communicationStyle,
				emotionalState: userState.emotionalState,
				contextSensitivity: userState.contextSensitivity,
				consistency: userState.consistency,
			},
			learningOpportunities: this.identifyLearningOpportunities(
				userState,
				userProfile
			),
			improvementSuggestions: this.generateImprovementSuggestions(
				userState,
				optimalTone
			),
		};
	}

	// Generate tone selection reasoning
	generateToneSelectionReasoning(userState, optimalTone) {
		const reasons = [];

		if (userState.communicationStyle.confidence > 0.6) {
			reasons.push(`通訊風格: ${userState.communicationStyle.style}`);
		}

		if (userState.emotionalState.intensity > 0.5) {
			reasons.push(`情緒狀態: ${userState.emotionalState.emotion}`);
		}

		if (userState.contextSensitivity.intensity > 0.4) {
			reasons.push(`情境敏感度: ${userState.contextSensitivity.context}`);
		}

		return reasons.join(", ");
	}

	// Identify learning opportunities
	identifyLearningOpportunities(userState, userProfile) {
		const opportunities = [];

		if (userState.confidence < 0.6) {
			opportunities.push("需要更多用戶互動數據來提高個性化準確度");
		}

		if (userState.consistency < 0.5) {
			opportunities.push("用戶行為模式尚未穩定，需要持續觀察");
		}

		if (!userProfile?.profileData?.personality?.communicationStyle) {
			opportunities.push("缺乏通訊風格歷史數據");
		}

		return opportunities;
	}

	// Generate improvement suggestions
	generateImprovementSuggestions(userState, optimalTone) {
		const suggestions = [];

		if (optimalTone.confidence < 0.7) {
			suggestions.push("考慮收集更多用戶偏好反饋");
		}

		if (userState.emotionalState.emotion === "confused") {
			suggestions.push("提供更清晰的結構化回應");
		}

		if (userState.communicationStyle.confidence < 0.6) {
			suggestions.push("觀察更多通訊模式指標");
		}

		return suggestions;
	}

	// Utility method: Select random element from array
	selectRandomElement(array) {
		if (!Array.isArray(array) || array.length === 0) {
			return "";
		}
		return array[Math.floor(Math.random() * array.length)];
	}

	// Fallback personalization for error cases
	fallbackPersonalization(baseResponse, messageContent) {
		const isFormal = /你|請問|煩請/.test(messageContent);
		const isEmotional = /擔心|緊張|興奮|開心/.test(messageContent);

		let tone = "encouraging";
		if (isFormal) tone = "professional";
		if (isEmotional) tone = "empathetic";

		return {
			personalizedResponse: baseResponse,
			toneProfile: { primaryTone: tone, confidence: 0.3 },
			userState: {
				communicationStyle: {
					style: isFormal ? "formal" : "casual",
					confidence: 0.3,
				},
				emotionalState: {
					emotion: isEmotional ? "emotional" : "neutral",
					intensity: 0.3,
				},
			},
			adaptationInsights: {},
			personalizationLevel: "surface",
			confidence: 0.3,
		};
	}

	// Method to update tone preferences based on user feedback
	updateTonePreferences(userId, feedbackData) {
		// This would update the user's tone preferences in the database
		// Based on explicit or implicit feedback about response quality
		console.log(
			`Updating tone preferences for user ${userId}:`,
			feedbackData
		);
	}

	// Method to get tone statistics for analytics
	getToneStatistics(userProfile) {
		return {
			mostUsedTones: this.getMostUsedTones(userProfile),
			averageConfidence: this.getAverageConfidence(userProfile),
			adaptationTrends: this.getAdaptationTrends(userProfile),
			userSatisfactionByTone: this.getUserSatisfactionByTone(userProfile),
		};
	}

	// Placeholder methods for analytics (would be implemented with actual data)
	getMostUsedTones(userProfile) {
		return ["encouraging", "professional", "empathetic"];
	}

	getAverageConfidence(userProfile) {
		return userProfile?.adaptationData?.confidenceLevel || 0.5;
	}

	getAdaptationTrends(userProfile) {
		return { improving: true, velocity: 0.1 };
	}

	getUserSatisfactionByTone(userProfile) {
		return {
			encouraging: 0.8,
			professional: 0.7,
			empathetic: 0.9,
		};
	}
}

export default AdaptiveTonePersonalizationSystem;
