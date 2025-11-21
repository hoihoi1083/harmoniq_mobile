/**
 * Meta-Analysis System
 * Provides comprehensive analysis across all components with pattern recognition,
 * insights generation, and holistic recommendations
 */

// // import { useFengShuiReport } from '../contexts/FengShuiReportContext';
// import { ContentValidator } from './ContentQualityValidator';

// Meta-Analysis Configuration
const META_CONFIG = {
	minimumComponents: 3, // Minimum components needed for meta-analysis
	confidenceThreshold: 0.7, // Minimum confidence for insights
	patternThreshold: 0.6, // Minimum pattern strength
	insightCategories: [
		"overall_trend",
		"dominant_elements",
		"cross_component_patterns",
		"temporal_insights",
		"personalized_priorities",
		"risk_opportunities",
	],
};

// Pattern Recognition Algorithms
export class PatternRecognizer {
	// Detect dominant themes across all analyses
	detectDominantThemes(analysisResults) {
		const themes = {};
		const keywords = {};

		Object.values(analysisResults).forEach((analysis) => {
			// Extract themes from content
			const content = analysis.description || analysis.summary || "";
			const extractedThemes = this.extractThemes(content);
			const extractedKeywords = analysis.keywords || [];

			extractedThemes.forEach((theme) => {
				themes[theme] = (themes[theme] || 0) + 1;
			});

			extractedKeywords.forEach((keyword) => {
				keywords[keyword] = (keywords[keyword] || 0) + 1;
			});
		});

		// Sort by frequency and calculate strength
		const sortedThemes = Object.entries(themes)
			.sort(([, a], [, b]) => b - a)
			.map(([theme, count]) => ({
				theme,
				frequency: count,
				strength: count / Object.keys(analysisResults).length,
			}))
			.filter((item) => item.strength >= META_CONFIG.patternThreshold);

		const sortedKeywords = Object.entries(keywords)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([keyword, count]) => ({
				keyword,
				frequency: count,
				relevance: count / Object.keys(analysisResults).length,
			}));

		return {
			dominantThemes: sortedThemes,
			keywords: sortedKeywords,
			themeCount: Object.keys(themes).length,
		};
	}

	extractThemes(content) {
		const themePatterns = {
			財運發展: /財運|財富|金錢|收入|投資|經濟/g,
			事業進展: /事業|工作|職業|升遷|成就|發展/g,
			感情關係: /感情|愛情|婚姻|家庭|人際|關係/g,
			健康養生: /健康|身體|養生|疾病|保健|調理/g,
			學習成長: /學習|成長|知識|智慧|進步|提升/g,
			運勢變化: /運勢|變化|轉變|機遇|挑戰|趨勢/g,
			五行調節: /五行|調節|平衡|補充|克制|生助/g,
			時機把握: /時機|機會|時間|節奏|時運|時期/g,
			環境風水: /環境|風水|方位|佈局|氣場|磁場/g,
			性格特質: /性格|特質|個性|品格|天賦|能力/g,
		};

		const themes = [];
		Object.entries(themePatterns).forEach(([theme, pattern]) => {
			const matches = content.match(pattern);
			if (matches && matches.length > 0) {
				themes.push(theme);
			}
		});

		return themes;
	}

	// Detect cross-component patterns
	detectCrossComponentPatterns(analysisResults) {
		const patterns = [];
		const components = Object.keys(analysisResults);

		// Pattern 1: Consistency across traditional vs AI components
		const traditionalComponents = ["FiveElement", "Zodiac"];
		const aiComponents = components.filter(
			(c) => !traditionalComponents.includes(c)
		);

		const traditionalThemes = this.extractThemesFromComponents(
			analysisResults,
			traditionalComponents
		);
		const aiThemes = this.extractThemesFromComponents(
			analysisResults,
			aiComponents
		);

		const consistencyScore = this.calculateThemeConsistency(
			traditionalThemes,
			aiThemes
		);

		if (consistencyScore > 0.7) {
			patterns.push({
				type: "consistency",
				description: "傳統分析與AI分析結果高度一致",
				strength: consistencyScore,
				confidence: 0.9,
			});
		} else if (consistencyScore < 0.3) {
			patterns.push({
				type: "inconsistency",
				description: "傳統分析與AI分析存在差異，需要進一步確認",
				strength: 1 - consistencyScore,
				confidence: 0.8,
			});
		}

		// Pattern 2: Progressive insights (from basic to specific)
		const progressivePattern =
			this.detectProgressivePattern(analysisResults);
		if (progressivePattern.detected) {
			patterns.push(progressivePattern);
		}

		// Pattern 3: Temporal coherence
		const temporalPattern = this.detectTemporalPattern(analysisResults);
		if (temporalPattern.detected) {
			patterns.push(temporalPattern);
		}

		return patterns;
	}

	extractThemesFromComponents(analysisResults, componentNames) {
		const themes = [];
		componentNames.forEach((componentName) => {
			if (analysisResults[componentName]) {
				const content =
					analysisResults[componentName].description || "";
				themes.push(...this.extractThemes(content));
			}
		});
		return themes;
	}

	calculateThemeConsistency(themes1, themes2) {
		const set1 = new Set(themes1);
		const set2 = new Set(themes2);
		const intersection = new Set([...set1].filter((x) => set2.has(x)));
		const union = new Set([...set1, ...set2]);

		return union.size > 0 ? intersection.size / union.size : 0;
	}

	detectProgressivePattern(analysisResults) {
		// Check if specific suggestions build upon core suggestions
		const coreAnalysis = analysisResults.CoreSuggestion;
		const specificAnalysis = analysisResults.SpecificSuggestion;

		if (coreAnalysis && specificAnalysis) {
			const coreThemes = this.extractThemes(
				coreAnalysis.description || ""
			);
			const specificThemes = this.extractThemes(
				specificAnalysis.description || ""
			);

			const buildsUpon = coreThemes.some((theme) =>
				specificThemes.includes(theme)
			);

			if (buildsUpon) {
				return {
					detected: true,
					type: "progressive",
					description: "具體建議很好地建構在核心建議之上",
					strength: 0.8,
					confidence: 0.85,
				};
			}
		}

		return { detected: false };
	}

	detectTemporalPattern(analysisResults) {
		// Check temporal components for coherent timeline
		const temporalComponents = [
			"LiuNianKeyWord",
			"LiuNianGanZhi",
			"Season",
		];
		const temporalAnalyses = temporalComponents
			.filter((comp) => analysisResults[comp])
			.map((comp) => analysisResults[comp]);

		if (temporalAnalyses.length >= 2) {
			// Simple check for temporal coherence
			const allContent = temporalAnalyses
				.map((a) => a.description || "")
				.join(" ");
			const temporalIndicators = [
				"本年",
				"當前",
				"流年",
				"季節",
				"時期",
				"階段",
			];
			const indicatorCount = temporalIndicators.reduce(
				(count, indicator) => {
					return (
						count +
						(allContent.match(new RegExp(indicator, "g")) || [])
							.length
					);
				},
				0
			);

			if (indicatorCount >= 3) {
				return {
					detected: true,
					type: "temporal",
					description: "時間相關分析形成連貫的時間線",
					strength: Math.min(indicatorCount / 10, 1),
					confidence: 0.8,
				};
			}
		}

		return { detected: false };
	}
}

// Insight Generator
export class InsightGenerator {
	constructor() {
		this.patternRecognizer = new PatternRecognizer();
	}

	generateMetaInsights(analysisResults, userInfo) {
		if (
			Object.keys(analysisResults).length < META_CONFIG.minimumComponents
		) {
			return {
				error: "Insufficient data for meta-analysis",
				minimumRequired: META_CONFIG.minimumComponents,
				available: Object.keys(analysisResults).length,
			};
		}

		const insights = {
			timestamp: Date.now(),
			userInfo: {
				concern: userInfo.concern,
				problem: userInfo.problem,
				gender: userInfo.gender,
			},
			analysis: {
				componentCount: Object.keys(analysisResults).length,
				dominantThemes:
					this.patternRecognizer.detectDominantThemes(
						analysisResults
					),
				crossComponentPatterns:
					this.patternRecognizer.detectCrossComponentPatterns(
						analysisResults
					),
				overallTrend: this.calculateOverallTrend(analysisResults),
				personalizedPriorities: this.generatePersonalizedPriorities(
					analysisResults,
					userInfo
				),
				riskOpportunities:
					this.identifyRiskOpportunities(analysisResults),
				temporalInsights:
					this.generateTemporalInsights(analysisResults),
				actionPlan: this.generateActionPlan(analysisResults, userInfo),
			},
			confidence: this.calculateOverallConfidence(analysisResults),
			recommendations: this.generateMetaRecommendations(
				analysisResults,
				userInfo
			),
		};

		return insights;
	}

	calculateOverallTrend(analysisResults) {
		const sentiments = Object.values(analysisResults).map((analysis) => {
			const content = analysis.description || analysis.summary || "";
			return this.analyzeSentiment(content);
		});

		const averagePositive =
			sentiments.reduce((sum, s) => sum + s.positive, 0) /
			sentiments.length;
		const averageNegative =
			sentiments.reduce((sum, s) => sum + s.negative, 0) /
			sentiments.length;

		let trend = "neutral";
		let trendStrength = 0;

		if (averagePositive > 0.6) {
			trend = "positive";
			trendStrength = averagePositive;
		} else if (averageNegative > 0.4) {
			trend = "challenging";
			trendStrength = averageNegative;
		} else {
			trend = "balanced";
			trendStrength = 1 - Math.abs(averagePositive - averageNegative);
		}

		return {
			trend,
			strength: trendStrength,
			description: this.describeTrend(trend, trendStrength),
			positiveFactor: averagePositive,
			challengeFactor: averageNegative,
		};
	}

	describeTrend(trend, strength) {
		const strengthLevel =
			strength > 0.8 ? "非常" : strength > 0.6 ? "較" : "相對";

		switch (trend) {
			case "positive":
				return `整體運勢呈現${strengthLevel}正面的發展趨勢`;
			case "challenging":
				return `目前面臨${strengthLevel}多的挑戰，需要謹慎應對`;
			case "balanced":
				return `運勢處於${strengthLevel}平衡的狀態，機遇與挑戰並存`;
			default:
				return "運勢趨勢尚需進一步觀察";
		}
	}

	generatePersonalizedPriorities(analysisResults, userInfo) {
		const priorities = [];

		// Priority 1: User's primary concern
		if (userInfo.concern) {
			const concernRelatedAnalyses = Object.entries(
				analysisResults
			).filter(([component, analysis]) => {
				const content = analysis.description || "";
				return this.isRelatedToConcern(content, userInfo.concern);
			});

			if (concernRelatedAnalyses.length > 0) {
				priorities.push({
					priority: 1,
					category: userInfo.concern,
					description: `基於你對${userInfo.concern}的關注，建議優先處理相關建議`,
					relatedComponents: concernRelatedAnalyses.map(
						([comp]) => comp
					),
					actionItems: this.extractActionItems(
						concernRelatedAnalyses
					),
				});
			}
		}

		// Priority 2: Dominant themes
		const dominantThemes =
			this.patternRecognizer.detectDominantThemes(analysisResults);
		if (dominantThemes.dominantThemes.length > 0) {
			const topTheme = dominantThemes.dominantThemes[0];
			priorities.push({
				priority: 2,
				category: topTheme.theme,
				description: `${topTheme.theme}在多個分析中都被強調，建議重點關注`,
				strength: topTheme.strength,
				actionItems: this.generateThemeActionItems(
					topTheme.theme,
					analysisResults
				),
			});
		}

		// Priority 3: Time-sensitive items
		const timeSensitiveItems =
			this.identifyTimeSensitiveItems(analysisResults);
		if (timeSensitiveItems.length > 0) {
			priorities.push({
				priority: 3,
				category: "時機把握",
				description: "存在時間敏感的建議，建議及時行動",
				items: timeSensitiveItems,
			});
		}

		return priorities.sort((a, b) => a.priority - b.priority);
	}

	isRelatedToConcern(content, concern) {
		const concernKeywords = {
			財運: ["財運", "財富", "金錢", "收入", "投資", "經濟"],
			事業: ["事業", "工作", "職業", "升遷", "成就", "發展"],
			感情: ["感情", "愛情", "婚姻", "家庭", "人際", "關係"],
			健康: ["健康", "身體", "養生", "疾病", "保健", "調理"],
			學業: ["學習", "成長", "知識", "智慧", "進步", "提升"],
		};

		const keywords = concernKeywords[concern] || [concern];
		return keywords.some((keyword) => content.includes(keyword));
	}

	extractActionItems(componentAnalyses) {
		const actionItems = [];

		componentAnalyses.forEach(([component, analysis]) => {
			if (analysis.suggestions) {
				actionItems.push(
					...analysis.suggestions.map((suggestion) => ({
						source: component,
						action: suggestion,
						urgency: this.assessUrgency(suggestion),
					}))
				);
			}
		});

		return actionItems.sort((a, b) => b.urgency - a.urgency).slice(0, 5);
	}

	assessUrgency(suggestion) {
		const urgentKeywords = ["立即", "馬上", "盡快", "當前", "本月", "近期"];
		const urgencyScore = urgentKeywords.reduce((score, keyword) => {
			return score + (suggestion.includes(keyword) ? 1 : 0);
		}, 0);

		return urgencyScore / urgentKeywords.length;
	}

	generateThemeActionItems(theme, analysisResults) {
		const themeComponents = Object.entries(analysisResults).filter(
			([component, analysis]) => {
				const content = analysis.description || "";
				return this.extractThemes(content).includes(theme);
			}
		);

		return this.extractActionItems(themeComponents);
	}

	identifyTimeSensitiveItems(analysisResults) {
		const timeSensitive = [];

		Object.entries(analysisResults).forEach(([component, analysis]) => {
			if (analysis.suggestions) {
				analysis.suggestions.forEach((suggestion) => {
					const urgency = this.assessUrgency(suggestion);
					if (urgency > 0.3) {
						timeSensitive.push({
							component,
							suggestion,
							urgency,
						});
					}
				});
			}
		});

		return timeSensitive.sort((a, b) => b.urgency - a.urgency);
	}

	identifyRiskOpportunities(analysisResults) {
		const risks = [];
		const opportunities = [];

		Object.entries(analysisResults).forEach(([component, analysis]) => {
			const content = analysis.description || "";

			// Identify risks
			const riskKeywords = [
				"注意",
				"避免",
				"謹慎",
				"小心",
				"不利",
				"阻礙",
				"困難",
			];
			const riskMatches = riskKeywords.filter((keyword) =>
				content.includes(keyword)
			);

			if (riskMatches.length > 0) {
				risks.push({
					component,
					description: this.extractRiskDescription(
						content,
						riskMatches
					),
					severity: riskMatches.length / riskKeywords.length,
				});
			}

			// Identify opportunities
			const opportunityKeywords = [
				"機會",
				"有利",
				"吉利",
				"順利",
				"提升",
				"改善",
				"發展",
			];
			const opportunityMatches = opportunityKeywords.filter((keyword) =>
				content.includes(keyword)
			);

			if (opportunityMatches.length > 0) {
				opportunities.push({
					component,
					description: this.extractOpportunityDescription(
						content,
						opportunityMatches
					),
					potential:
						opportunityMatches.length / opportunityKeywords.length,
				});
			}
		});

		return {
			risks: risks.sort((a, b) => b.severity - a.severity),
			opportunities: opportunities.sort(
				(a, b) => b.potential - a.potential
			),
		};
	}

	extractRiskDescription(content, riskKeywords) {
		// Extract sentences containing risk keywords
		const sentences = content.split(/[。！？]/);
		const riskSentences = sentences.filter((sentence) =>
			riskKeywords.some((keyword) => sentence.includes(keyword))
		);

		return riskSentences.slice(0, 2).join("。") + "。";
	}

	extractOpportunityDescription(content, opportunityKeywords) {
		const sentences = content.split(/[。！？]/);
		const opportunitySentences = sentences.filter((sentence) =>
			opportunityKeywords.some((keyword) => sentence.includes(keyword))
		);

		return opportunitySentences.slice(0, 2).join("。") + "。";
	}

	generateTemporalInsights(analysisResults) {
		const temporalComponents = [
			"LiuNianKeyWord",
			"LiuNianGanZhi",
			"Season",
		];
		const temporalData = {};

		temporalComponents.forEach((component) => {
			if (analysisResults[component]) {
				temporalData[component] = analysisResults[component];
			}
		});

		if (Object.keys(temporalData).length === 0) {
			return { available: false };
		}

		// Generate timeline insights
		const currentYear = new Date().getFullYear();
		const currentSeason = this.getCurrentSeason();

		return {
			available: true,
			currentYear,
			currentSeason,
			yearlyTrend: this.analyzeYearlyTrend(temporalData),
			seasonalAdvice: this.generateSeasonalAdvice(
				temporalData,
				currentSeason
			),
			timelineRecommendations:
				this.generateTimelineRecommendations(temporalData),
		};
	}

	analyzeYearlyTrend(temporalData) {
		const yearlyComponents = ["LiuNianKeyWord", "LiuNianGanZhi"];
		const yearlyContent = yearlyComponents
			.filter((comp) => temporalData[comp])
			.map((comp) => temporalData[comp].description || "")
			.join(" ");

		if (yearlyContent.length === 0) return null;

		const sentiment = this.analyzeSentiment(yearlyContent);
		const themes = this.extractThemes(yearlyContent);

		return {
			overallSentiment: sentiment,
			dominantThemes: themes.slice(0, 3),
			description: this.describeYearlyTrend(sentiment, themes),
		};
	}

	describeYearlyTrend(sentiment, themes) {
		const trendDescription =
			sentiment.positive > 0.6
				? "積極向上"
				: sentiment.negative > 0.4
					? "需要謹慎"
					: "平穩發展";

		const themeList = themes.length > 0 ? themes.join("、") : "綜合發展";

		return `本年度整體趨勢${trendDescription}，主要關注${themeList}。`;
	}

	generateSeasonalAdvice(temporalData, currentSeason) {
		if (!temporalData.Season) return null;

		const seasonalContent = temporalData.Season.description || "";
		const seasonalSuggestions = temporalData.Season.suggestions || [];

		return {
			currentSeason,
			seasonalFocus: this.extractSeasonalFocus(seasonalContent),
			prioritySuggestions: seasonalSuggestions.slice(0, 3),
			seasonalThemes: this.extractThemes(seasonalContent),
		};
	}

	extractSeasonalFocus(content) {
		const seasonFocusPatterns = {
			春季: "生發調養",
			夏季: "陽氣調節",
			秋季: "收斂調整",
			冬季: "藏精養神",
		};

		const currentSeason = this.getCurrentSeason();
		return seasonFocusPatterns[currentSeason] || "季節調節";
	}

	generateTimelineRecommendations(temporalData) {
		const recommendations = [];

		// Short-term (1-3 months)
		if (temporalData.Season) {
			recommendations.push({
				timeframe: "短期（1-3個月）",
				focus: "季節性調節",
				actions: temporalData.Season.suggestions?.slice(0, 3) || [],
			});
		}

		// Medium-term (3-12 months)
		if (temporalData.LiuNianKeyWord) {
			recommendations.push({
				timeframe: "中期（3-12個月）",
				focus: "年度重點發展",
				actions:
					temporalData.LiuNianKeyWord.suggestions?.slice(0, 3) || [],
			});
		}

		// Long-term (1+ years)
		if (temporalData.LiuNianGanZhi) {
			recommendations.push({
				timeframe: "長期（1年以上）",
				focus: "整體運勢發展",
				actions:
					temporalData.LiuNianGanZhi.suggestions?.slice(0, 3) || [],
			});
		}

		return recommendations;
	}

	generateActionPlan(analysisResults, userInfo) {
		const allSuggestions = Object.entries(analysisResults).flatMap(
			([component, analysis]) =>
				(analysis.suggestions || []).map((suggestion) => ({
					component,
					suggestion,
					urgency: this.assessUrgency(suggestion),
					relevance: this.assessRelevance(suggestion, userInfo),
				}))
		);

		// Categorize by timeframe
		const immediate = allSuggestions
			.filter((item) => item.urgency > 0.6)
			.sort((a, b) => b.relevance - a.relevance)
			.slice(0, 3);

		const shortTerm = allSuggestions
			.filter((item) => item.urgency > 0.3 && item.urgency <= 0.6)
			.sort((a, b) => b.relevance - a.relevance)
			.slice(0, 5);

		const longTerm = allSuggestions
			.filter((item) => item.urgency <= 0.3)
			.sort((a, b) => b.relevance - a.relevance)
			.slice(0, 5);

		return {
			immediate: {
				title: "立即行動（本周）",
				items: immediate,
			},
			shortTerm: {
				title: "短期計劃（本月）",
				items: shortTerm,
			},
			longTerm: {
				title: "長期規劃（3個月以上）",
				items: longTerm,
			},
		};
	}

	assessRelevance(suggestion, userInfo) {
		let relevanceScore = 0.5; // Base relevance

		// Increase relevance if related to user's concern
		if (
			userInfo.concern &&
			this.isRelatedToConcern(suggestion, userInfo.concern)
		) {
			relevanceScore += 0.3;
		}

		// Increase relevance if related to user's specific problem
		if (
			userInfo.problem &&
			suggestion.toLowerCase().includes(userInfo.problem.toLowerCase())
		) {
			relevanceScore += 0.2;
		}

		return Math.min(1, relevanceScore);
	}

	calculateOverallConfidence(analysisResults) {
		const confidences = Object.values(analysisResults)
			.map((analysis) => analysis.confidence || 0.7)
			.filter((conf) => conf > 0);

		if (confidences.length === 0) return 0.5;

		const averageConfidence =
			confidences.reduce((sum, conf) => sum + conf, 0) /
			confidences.length;
		const componentCount = Object.keys(analysisResults).length;

		// Adjust confidence based on number of components
		const completenessBonus = Math.min(componentCount / 8, 1) * 0.1; // Up to 10% bonus for completeness

		return Math.min(0.95, averageConfidence + completenessBonus);
	}

	generateMetaRecommendations(analysisResults, userInfo) {
		const recommendations = [];

		// Recommendation 1: Based on dominant theme
		const dominantThemes =
			this.patternRecognizer.detectDominantThemes(analysisResults);
		if (dominantThemes.dominantThemes.length > 0) {
			const topTheme = dominantThemes.dominantThemes[0];
			recommendations.push({
				type: "focus",
				priority: "high",
				title: `重點關注${topTheme.theme}`,
				description: `在多個分析中都強調了${topTheme.theme}的重要性，建議將此作為近期的主要發展方向。`,
				actionable: true,
			});
		}

		// Recommendation 2: Based on overall trend
		const overallTrend = this.calculateOverallTrend(analysisResults);
		if (overallTrend.trend === "challenging") {
			recommendations.push({
				type: "caution",
				priority: "high",
				title: "謹慎應對當前挑戰",
				description: "目前面臨較多挑戰，建議採取保守策略，穩中求進。",
				actionable: true,
			});
		} else if (overallTrend.trend === "positive") {
			recommendations.push({
				type: "opportunity",
				priority: "medium",
				title: "積極把握發展機遇",
				description: "整體運勢向好，建議主動出擊，把握良好的發展機會。",
				actionable: true,
			});
		}

		// Recommendation 3: Cross-component consistency
		const patterns =
			this.patternRecognizer.detectCrossComponentPatterns(
				analysisResults
			);
		const consistencyPattern = patterns.find(
			(p) => p.type === "consistency"
		);
		if (consistencyPattern) {
			recommendations.push({
				type: "validation",
				priority: "medium",
				title: "分析結果高度一致",
				description: "傳統分析與AI分析結果一致，增強了建議的可信度。",
				actionable: false,
			});
		}

		return recommendations;
	}

	// Helper methods

	analyzeSentiment(text) {
		const positiveWords = [
			"好",
			"吉",
			"利",
			"順",
			"佳",
			"優",
			"強",
			"旺",
			"建議",
			"可以",
			"有助",
			"提升",
			"改善",
		];
		const negativeWords = [
			"壞",
			"凶",
			"不利",
			"阻",
			"弱",
			"衰",
			"避免",
			"禁止",
			"危險",
			"困難",
			"注意",
			"謹慎",
		];

		const words = text.match(/[\u4e00-\u9fa5]+/g) || [];
		const positiveCount = words.filter((word) =>
			positiveWords.some((pw) => word.includes(pw))
		).length;
		const negativeCount = words.filter((word) =>
			negativeWords.some((nw) => word.includes(nw))
		).length;

		const total = positiveCount + negativeCount;
		return {
			positive: total > 0 ? positiveCount / total : 0.5,
			negative: total > 0 ? negativeCount / total : 0.5,
			neutral:
				total > 0
					? 1 - (positiveCount + negativeCount) / words.length
					: 0.5,
		};
	}

	extractThemes(content) {
		return this.patternRecognizer.extractThemes(content);
	}

	getCurrentSeason() {
		const month = new Date().getMonth() + 1;
		if (month >= 3 && month <= 5) return "春季";
		if (month >= 6 && month <= 8) return "夏季";
		if (month >= 9 && month <= 11) return "秋季";
		return "冬季";
	}
}

// Meta-Analysis Hook
export const useMetaAnalysis = () => {
	// const { selectors } = useFengShuiReport();
	const insightGenerator = new InsightGenerator();

	const generateMetaInsights = (userInfo) => {
		// const analysisResults = selectors.getAllAnalyses();
		const analysisResults = {}; // Temporary fallback
		return insightGenerator.generateMetaInsights(analysisResults, userInfo);
	};

	const getPatternAnalysis = () => {
		// const analysisResults = selectors.getAllAnalyses();
		const analysisResults = {}; // Temporary fallback
		const patternRecognizer = new PatternRecognizer();

		return {
			dominantThemes:
				patternRecognizer.detectDominantThemes(analysisResults),
			crossComponentPatterns:
				patternRecognizer.detectCrossComponentPatterns(analysisResults),
		};
	};

	const getActionPlan = (userInfo) => {
		// const analysisResults = selectors.getAllAnalyses();
		const analysisResults = {}; // Temporary fallback
		return insightGenerator.generateActionPlan(analysisResults, userInfo);
	};

	return {
		generateMetaInsights,
		getPatternAnalysis,
		getActionPlan,
	};
};

// Meta-Analysis Components

// Meta-Analysis Summary Component
export const MetaAnalysisSummary = ({ userInfo }) => {
	const { generateMetaInsights } = useMetaAnalysis();
	const insights = generateMetaInsights(userInfo);

	if (insights.error) {
		return (
			<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
				<p className="text-yellow-800">
					需要至少 {insights.minimumRequired}{" "}
					個組件完成分析才能生成綜合洞察。 目前已完成:{" "}
					{insights.available} 個
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Overall Trend */}
			<div className="bg-blue-50 p-4 rounded-lg">
				<h3 className="font-semibold text-blue-900 mb-2">整體趨勢</h3>
				<p className="text-blue-800">
					{insights.analysis.overallTrend.description}
				</p>
				<div className="mt-2 text-sm text-blue-700">
					信心指數: {Math.round(insights.confidence * 100)}%
				</div>
			</div>

			{/* Dominant Themes */}
			{insights.analysis.dominantThemes.dominantThemes.length > 0 && (
				<div className="bg-green-50 p-4 rounded-lg">
					<h3 className="font-semibold text-green-900 mb-2">
						主要主題
					</h3>
					<div className="space-y-1">
						{insights.analysis.dominantThemes.dominantThemes
							.slice(0, 3)
							.map((theme, index) => (
								<div
									key={index}
									className="flex justify-between items-center"
								>
									<span className="text-green-800">
										{theme.theme}
									</span>
									<span className="text-sm text-green-600">
										{Math.round(theme.strength * 100)}%
									</span>
								</div>
							))}
					</div>
				</div>
			)}

			{/* Personalized Priorities */}
			{insights.analysis.personalizedPriorities.length > 0 && (
				<div className="bg-purple-50 p-4 rounded-lg">
					<h3 className="font-semibold text-purple-900 mb-2">
						個人化優先級
					</h3>
					<div className="space-y-2">
						{insights.analysis.personalizedPriorities
							.slice(0, 2)
							.map((priority, index) => (
								<div
									key={index}
									className="border-l-4 border-purple-400 pl-3"
								>
									<div className="font-medium text-purple-800">
										{priority.category}
									</div>
									<div className="text-sm text-purple-700">
										{priority.description}
									</div>
								</div>
							))}
					</div>
				</div>
			)}

			{/* Meta Recommendations */}
			{insights.recommendations.length > 0 && (
				<div className="bg-orange-50 p-4 rounded-lg">
					<h3 className="font-semibold text-orange-900 mb-2">
						綜合建議
					</h3>
					<div className="space-y-2">
						{insights.recommendations.map((rec, index) => (
							<div
								key={index}
								className="border-l-4 border-orange-400 pl-3"
							>
								<div className="font-medium text-orange-800">
									{rec.title}
								</div>
								<div className="text-sm text-orange-700">
									{rec.description}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default {
	PatternRecognizer,
	InsightGenerator,
	useMetaAnalysis,
	MetaAnalysisSummary,
	META_CONFIG,
};
