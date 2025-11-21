/**
 * Content Quality Validation System
 * Ensures high-quality, consistent, and reliable content across all components
 */

// Quality Metrics Configuration
const QUALITY_METRICS = {
	content: {
		minLength: 200,
		maxLength: 1500,
		requiredElements: [
			"summary",
			"description",
			"keyPoints",
			"suggestions",
		],
		prohibitedContent: ["迷信", "絕對預測", "保證", "100%准確"],
		positivityThreshold: 0.3, // Minimum positive sentiment ratio
	},

	language: {
		maxComplexity: 15, // Average sentence length
		minReadability: 60, // Readability score 0-100
		formalityLevel: "moderate", // casual, moderate, formal
		technicalTermLimit: 5, // Max technical terms per 100 words
	},

	accuracy: {
		factCheckRequired: true,
		sourceVerification: true,
		consistencyCheck: true,
		logicalFlow: true,
	},

	cultural: {
		culturalSensitivity: true,
		traditionalAccuracy: true,
		modernRelevance: true,
		inclusivity: true,
	},
};

// Content Validators
export const ContentValidator = {
	// Structure Validation
	validateStructure: (content) => {
		const issues = [];
		let score = 100;

		try {
			const parsed =
				typeof content === "string" ? JSON.parse(content) : content;

			// Check required fields
			QUALITY_METRICS.content.requiredElements.forEach((element) => {
				if (!parsed[element]) {
					issues.push(`缺少必要元素: ${element}`);
					score -= 20;
				} else if (
					typeof parsed[element] === "string" &&
					parsed[element].length < 10
				) {
					issues.push(`${element} 內容過於簡短`);
					score -= 10;
				}
			});

			// Check array fields
			if (parsed.keyPoints && !Array.isArray(parsed.keyPoints)) {
				issues.push("keyPoints 應為陣列格式");
				score -= 15;
			}

			if (parsed.suggestions && !Array.isArray(parsed.suggestions)) {
				issues.push("suggestions 應為陣列格式");
				score -= 15;
			}

			// Check length constraints
			if (parsed.description) {
				const length = parsed.description.length;
				if (length < QUALITY_METRICS.content.minLength) {
					issues.push(
						`內容過短 (${length}字，最少需要${QUALITY_METRICS.content.minLength}字)`
					);
					score -= 15;
				} else if (length > QUALITY_METRICS.content.maxLength) {
					issues.push(
						`內容過長 (${length}字，最多${QUALITY_METRICS.content.maxLength}字)`
					);
					score -= 10;
				}
			}
		} catch (error) {
			issues.push("JSON格式錯誤");
			score = 0;
		}

		return {
			isValid: issues.length === 0,
			issues,
			score: Math.max(0, score),
			category: "structure",
		};
	},

	// Content Quality Validation
	validateContent: (content) => {
		const issues = [];
		let score = 100;

		const text = extractTextContent(content);

		// Check for prohibited content
		QUALITY_METRICS.content.prohibitedContent.forEach((prohibited) => {
			if (text.includes(prohibited)) {
				issues.push(`包含不當內容: ${prohibited}`);
				score -= 25;
			}
		});

		// Check sentiment balance
		const sentiment = analyzeSentiment(text);
		if (sentiment.positive < QUALITY_METRICS.content.positivityThreshold) {
			issues.push("內容過於消極，需要增加正面元素");
			score -= 15;
		}

		// Check for specificity
		const specificityScore = analyzeSpecificity(text);
		if (specificityScore < 0.5) {
			issues.push("內容過於泛泛而談，缺乏具體性");
			score -= 20;
		}

		// Check for actionability
		const actionabilityScore = analyzeActionability(text);
		if (actionabilityScore < 0.4) {
			issues.push("建議缺乏可操作性");
			score -= 15;
		}

		return {
			isValid: issues.length === 0,
			issues,
			score: Math.max(0, score),
			category: "content",
			metrics: {
				sentiment,
				specificity: specificityScore,
				actionability: actionabilityScore,
			},
		};
	},

	// Language Quality Validation
	validateLanguage: (content) => {
		const issues = [];
		let score = 100;

		const text = extractTextContent(content);

		// Check readability
		const readability = calculateReadability(text);
		if (readability < QUALITY_METRICS.language.minReadability) {
			issues.push(
				`可讀性過低 (${readability}分，需要達到${QUALITY_METRICS.language.minReadability}分)`
			);
			score -= 20;
		}

		// Check sentence complexity
		const complexity = calculateComplexity(text);
		if (complexity > QUALITY_METRICS.language.maxComplexity) {
			issues.push(
				`句子過於複雜 (平均${complexity}字/句，建議不超過${QUALITY_METRICS.language.maxComplexity}字)`
			);
			score -= 15;
		}

		// Check technical terms
		const technicalTerms = countTechnicalTerms(text);
		const technicalRatio = (technicalTerms / text.length) * 100;
		if (technicalRatio > QUALITY_METRICS.language.technicalTermLimit) {
			issues.push("專業術語過多，可能影響理解");
			score -= 10;
		}

		// Check grammar and flow
		const grammarIssues = checkGrammar(text);
		if (grammarIssues.length > 0) {
			issues.push(...grammarIssues);
			score -= grammarIssues.length * 5;
		}

		return {
			isValid: issues.length === 0,
			issues,
			score: Math.max(0, score),
			category: "language",
			metrics: {
				readability,
				complexity,
				technicalRatio,
			},
		};
	},

	// Cultural Sensitivity Validation
	validateCultural: (content) => {
		const issues = [];
		let score = 100;

		const text = extractTextContent(content);

		// Check for cultural sensitivity
		const culturalIssues = checkCulturalSensitivity(text);
		if (culturalIssues.length > 0) {
			issues.push(...culturalIssues);
			score -= culturalIssues.length * 15;
		}

		// Check traditional accuracy
		const traditionalErrors = checkTraditionalAccuracy(text);
		if (traditionalErrors.length > 0) {
			issues.push(...traditionalErrors);
			score -= traditionalErrors.length * 20;
		}

		// Check modern relevance
		const relevanceScore = checkModernRelevance(text);
		if (relevanceScore < 0.6) {
			issues.push("內容與現代生活關聯度不足");
			score -= 15;
		}

		return {
			isValid: issues.length === 0,
			issues,
			score: Math.max(0, score),
			category: "cultural",
			metrics: {
				relevanceScore,
			},
		};
	},

	// Comprehensive Validation
	validateComprehensive: (content, componentName, userInfo) => {
		const validations = [
			ContentValidator.validateStructure(content),
			ContentValidator.validateContent(content),
			ContentValidator.validateLanguage(content),
			ContentValidator.validateCultural(content),
		];

		// Component-specific validation
		const componentValidation = validateComponentSpecific(
			content,
			componentName,
			userInfo
		);
		validations.push(componentValidation);

		const overallScore =
			validations.reduce((sum, v) => sum + v.score, 0) /
			validations.length;
		const allIssues = validations.flatMap((v) => v.issues);

		return {
			isValid: allIssues.length === 0,
			overallScore: Math.round(overallScore),
			validations,
			allIssues,
			recommendation: generateQualityRecommendation(
				overallScore,
				allIssues
			),
		};
	},
};

// Content Enhancement System
export const ContentEnhancer = {
	// Improve content based on validation results
	enhanceContent: (content, validationResult) => {
		let enhanced = { ...content };

		validationResult.validations.forEach((validation) => {
			switch (validation.category) {
				case "structure":
					enhanced = enhanceStructure(enhanced, validation.issues);
					break;
				case "content":
					enhanced = enhanceContentQuality(
						enhanced,
						validation.issues
					);
					break;
				case "language":
					enhanced = enhanceLanguage(enhanced, validation.issues);
					break;
				case "cultural":
					enhanced = enhanceCultural(enhanced, validation.issues);
					break;
			}
		});

		return enhanced;
	},

	// Add missing elements
	addMissingElements: (content) => {
		const enhanced = { ...content };

		if (!enhanced.confidence) {
			enhanced.confidence = calculateContentConfidence(content);
		}

		if (!enhanced.keywords) {
			enhanced.keywords = extractKeywords(extractTextContent(content));
		}

		if (!enhanced.relevance) {
			enhanced.relevance = ["相關組件待確定"];
		}

		if (!enhanced.warnings || enhanced.warnings.length === 0) {
			enhanced.warnings = generateDefaultWarnings(content);
		}

		return enhanced;
	},

	// Improve readability
	improveReadability: (text) => {
		return text
			.replace(/。([^。]{50,})/g, "。\n$1") // Add line breaks for long sentences
			.replace(/，([^，]{30,})/g, "，\n$1") // Break long clauses
			.replace(/[\s\n]{2,}/g, "\n") // Clean up excessive whitespace
			.trim();
	},

	// Enhance positivity
	enhancePositivity: (content) => {
		const enhanced = { ...content };

		// Add positive framing to suggestions
		if (enhanced.suggestions) {
			enhanced.suggestions = enhanced.suggestions.map((suggestion) => {
				if (
					!suggestion.includes("建議") &&
					!suggestion.includes("可以")
				) {
					return `建議您可以${suggestion}`;
				}
				return suggestion;
			});
		}

		// Soften warnings
		if (enhanced.warnings) {
			enhanced.warnings = enhanced.warnings.map((warning) => {
				return warning
					.replace(/避免/g, "建議減少")
					.replace(/禁止/g, "不宜");
			});
		}

		return enhanced;
	},
};

// Quality Monitoring System
export const QualityMonitor = {
	// Track quality metrics over time
	trackQuality: (componentName, content, validationResult) => {
		const metrics = {
			componentName,
			timestamp: Date.now(),
			score: validationResult.overallScore,
			issues: validationResult.allIssues.length,
			categories: validationResult.validations.map((v) => ({
				category: v.category,
				score: v.score,
				issues: v.issues.length,
			})),
		};

		// Store in localStorage for persistence
		const key = "fengshui_quality_metrics";
		const existing = JSON.parse(localStorage.getItem(key) || "[]");
		existing.push(metrics);

		// Keep only last 100 records
		if (existing.length > 100) {
			existing.splice(0, existing.length - 100);
		}

		localStorage.setItem(key, JSON.stringify(existing));

		return metrics;
	},

	// Get quality trends
	getQualityTrends: (componentName = null) => {
		const key = "fengshui_quality_metrics";
		const metrics = JSON.parse(localStorage.getItem(key) || "[]");

		const filtered = componentName
			? metrics.filter((m) => m.componentName === componentName)
			: metrics;

		if (filtered.length === 0) return null;

		const averageScore =
			filtered.reduce((sum, m) => sum + m.score, 0) / filtered.length;
		const recentTrend = filtered.slice(-10);
		const trendDirection =
			recentTrend.length > 1
				? recentTrend[recentTrend.length - 1].score -
					recentTrend[0].score
				: 0;

		return {
			averageScore: Math.round(averageScore),
			totalRecords: filtered.length,
			trendDirection:
				trendDirection > 0
					? "improving"
					: trendDirection < 0
						? "declining"
						: "stable",
			recentScores: recentTrend.map((r) => r.score),
		};
	},

	// Generate quality report
	generateQualityReport: () => {
		const components = [
			"LiuNianKeyWord",
			"MingJu",
			"LiuNianGanZhi",
			"GanZhi",
			"JiXiong",
			"Season",
			"CoreSuggestion",
			"SpecificSuggestion",
		];

		const report = {
			timestamp: Date.now(),
			components: components
				.map((component) => ({
					name: component,
					trend: QualityMonitor.getQualityTrends(component),
				}))
				.filter((c) => c.trend),

			overall: QualityMonitor.getQualityTrends(),

			recommendations: generateQualityRecommendations(),
		};

		return report;
	},
};

// Helper Functions

const extractTextContent = (content) => {
	if (typeof content === "string") {
		try {
			const parsed = JSON.parse(content);
			return [
				parsed.summary,
				parsed.description,
				...(parsed.keyPoints || []),
				...(parsed.suggestions || []),
			].join(" ");
		} catch {
			return content;
		}
	}

	if (typeof content === "object") {
		return [
			content.summary,
			content.description,
			...(content.keyPoints || []),
			...(content.suggestions || []),
		].join(" ");
	}

	return "";
};

const analyzeSentiment = (text) => {
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
};

const analyzeSpecificity = (text) => {
	const specificIndicators = [
		"具體",
		"詳細",
		"明確",
		"準確",
		"特定",
		"實際",
		"例如",
		"比如",
		"建議您",
		"可以考慮",
	];
	const generalIndicators = [
		"一般",
		"通常",
		"可能",
		"或許",
		"大概",
		"也許",
		"基本上",
	];

	const specificCount = specificIndicators.reduce(
		(count, indicator) =>
			count + (text.match(new RegExp(indicator, "g")) || []).length,
		0
	);
	const generalCount = generalIndicators.reduce(
		(count, indicator) =>
			count + (text.match(new RegExp(indicator, "g")) || []).length,
		0
	);

	return specificCount / Math.max(specificCount + generalCount, 1);
};

const analyzeActionability = (text) => {
	const actionWords = [
		"建議",
		"可以",
		"應該",
		"嘗試",
		"開始",
		"停止",
		"增加",
		"減少",
		"改變",
		"保持",
		"實施",
		"執行",
	];
	const actionCount = actionWords.reduce(
		(count, word) =>
			count + (text.match(new RegExp(word, "g")) || []).length,
		0
	);

	return Math.min(actionCount / 10, 1); // Normalize to 0-1 scale
};

const calculateReadability = (text) => {
	const sentences = text.split(/[。！？]/).filter((s) => s.trim().length > 0);
	const words = text.match(/[\u4e00-\u9fa5]+/g) || [];

	if (sentences.length === 0) return 0;

	const avgWordsPerSentence = words.length / sentences.length;
	const avgCharsPerWord =
		text.replace(/[^\u4e00-\u9fa5]/g, "").length / words.length;

	// Simplified readability formula for Chinese
	const score = 100 - avgWordsPerSentence * 2 - avgCharsPerWord * 10;
	return Math.max(0, Math.min(100, score));
};

const calculateComplexity = (text) => {
	const sentences = text.split(/[。！？]/).filter((s) => s.trim().length > 0);
	if (sentences.length === 0) return 0;

	return (
		sentences.reduce(
			(sum, sentence) =>
				sum + sentence.replace(/[^\u4e00-\u9fa5]/g, "").length,
			0
		) / sentences.length
	);
};

const countTechnicalTerms = (text) => {
	const technicalTerms = [
		"八字",
		"干支",
		"五行",
		"流年",
		"命局",
		"格局",
		"用神",
		"忌神",
		"十神",
		"地支",
		"天干",
	];
	return technicalTerms.reduce(
		(count, term) =>
			count + (text.match(new RegExp(term, "g")) || []).length,
		0
	);
};

const checkGrammar = (text) => {
	const issues = [];

	// Check for common grammar issues
	if (text.includes("的的")) issues.push("重複使用「的」");
	if (text.includes("。。")) issues.push("重複標點符號");
	if (text.match(/[，。][A-Za-z]/)) issues.push("中英文標點混用");

	return issues;
};

const checkCulturalSensitivity = (text) => {
	const issues = [];
	const sensitiveTerms = ["命中註定", "無法改變", "絕對", "永遠不會"];

	sensitiveTerms.forEach((term) => {
		if (text.includes(term)) {
			issues.push(`使用了過於絕對的表述：${term}`);
		}
	});

	return issues;
};

const checkTraditionalAccuracy = (text) => {
	const issues = [];

	// Check for common misconceptions
	const misconceptions = [
		{ term: "五行相剋", correct: "五行相克" },
		{ term: "生肖運勢", correct: "生肖特性" },
	];

	misconceptions.forEach(({ term, correct }) => {
		if (text.includes(term)) {
			issues.push(`傳統術語使用錯誤：「${term}」應為「${correct}」`);
		}
	});

	return issues;
};

const checkModernRelevance = (text) => {
	const modernTerms = [
		"現代",
		"當代",
		"今日",
		"目前",
		"現在",
		"實際",
		"生活中",
		"工作",
		"家庭",
	];
	const modernCount = modernTerms.reduce(
		(count, term) =>
			count + (text.match(new RegExp(term, "g")) || []).length,
		0
	);

	return Math.min(modernCount / 5, 1);
};

const validateComponentSpecific = (content, componentName, userInfo) => {
	const issues = [];
	let score = 100;

	const text = extractTextContent(content);

	// Component-specific validation rules
	switch (componentName) {
		case "SpecificSuggestion":
			if (!userInfo.problem || !text.includes(userInfo.problem)) {
				issues.push("未針對用戶的具體問題提供建議");
				score -= 30;
			}
			break;

		case "Season":
			const currentSeason = getCurrentSeason();
			if (!text.includes(currentSeason)) {
				issues.push("未結合當前季節特點");
				score -= 20;
			}
			break;

		case "CoreSuggestion":
			if (
				!text.includes("核心") &&
				!text.includes("重要") &&
				!text.includes("主要")
			) {
				issues.push("缺乏核心重點的強調");
				score -= 15;
			}
			break;
	}

	return {
		isValid: issues.length === 0,
		issues,
		score: Math.max(0, score),
		category: "component_specific",
	};
};

const getCurrentSeason = () => {
	const month = new Date().getMonth() + 1;
	if (month >= 3 && month <= 5) return "春季";
	if (month >= 6 && month <= 8) return "夏季";
	if (month >= 9 && month <= 11) return "秋季";
	return "冬季";
};

const generateQualityRecommendation = (score, issues) => {
	if (score >= 90) return "內容質量優秀，無需調整";
	if (score >= 75) return "內容質量良好，建議微調";
	if (score >= 60) return "內容質量一般，需要改進";
	return "內容質量較差，建議重新生成";
};

const enhanceStructure = (content, issues) => {
	let enhanced = { ...content };

	issues.forEach((issue) => {
		if (issue.includes("缺少必要元素")) {
			const element = issue.split(": ")[1];
			if (!enhanced[element]) {
				switch (element) {
					case "summary":
						enhanced.summary = "分析總結";
						break;
					case "keyPoints":
						enhanced.keyPoints = ["關鍵要點1", "關鍵要點2"];
						break;
					case "suggestions":
						enhanced.suggestions = ["建議1", "建議2"];
						break;
				}
			}
		}
	});

	return enhanced;
};

const enhanceContentQuality = (content, issues) => {
	return ContentEnhancer.enhancePositivity(content);
};

const enhanceLanguage = (content, issues) => {
	let enhanced = { ...content };

	if (enhanced.description) {
		enhanced.description = ContentEnhancer.improveReadability(
			enhanced.description
		);
	}

	return enhanced;
};

const enhanceCultural = (content, issues) => {
	let enhanced = { ...content };

	// Add cultural sensitivity improvements
	if (enhanced.warnings && enhanced.warnings.length === 0) {
		enhanced.warnings = ["以上分析僅供參考，實際情況請以個人努力為主"];
	}

	return enhanced;
};

const calculateContentConfidence = (content) => {
	const text = extractTextContent(content);
	const length = text.length;
	const specificity = analyzeSpecificity(text);

	// Calculate confidence based on content quality indicators
	let confidence = 0.7; // Base confidence

	if (length > 300) confidence += 0.1;
	if (specificity > 0.6) confidence += 0.1;

	return Math.min(0.95, confidence); // Cap at 95%
};

const extractKeywords = (text) => {
	const importantTerms = [
		"五行",
		"八字",
		"運勢",
		"建議",
		"調節",
		"平衡",
		"發展",
		"改善",
	];
	return importantTerms.filter((term) => text.includes(term)).slice(0, 5);
};

const generateDefaultWarnings = (content) => {
	return ["以上分析僅供參考，請結合實際情況理性對待"];
};

const generateQualityRecommendations = () => {
	return [
		"定期檢查內容質量指標",
		"注重文化敏感性和準確性",
		"保持內容的現代相關性",
		"提升建議的可操作性",
	];
};

export default {
	ContentValidator,
	ContentEnhancer,
	QualityMonitor,
	QUALITY_METRICS,
};
