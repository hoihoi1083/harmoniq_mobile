/**
 * Standardized AI Prompt Templates and Management System
 * Provides consistent, high-quality prompts for all AI-enhanced components
 */

// Base Prompt Configuration
const PROMPT_CONFIG = {
	language: "zh-CN",
	tone: "professional",
	maxLength: 2000,
	format: "structured",
	includeWarnings: true,
	personalization: true,
};

// Common Prompt Elements
const COMMON_ELEMENTS = {
	userContext: (userInfo) => `
用戶信息：
- 出生時間：${userInfo.birthDateTime}
- 性別：${userInfo.gender === "male" ? "男" : "女"}
- 關注領域：${userInfo.concern || "未指定"}
- 具體問題：${userInfo.problem || "未指定"}
`,

	analysisContext: (analysisResults) => {
		const context = Object.entries(analysisResults)
			.map(
				([component, result]) =>
					`${component}: ${result.summary || result.description || "已完成"}`
			)
			.join("\n");
		return context ? `\n已完成的分析：\n${context}` : "";
	},

	outputFormat: `
請按以下格式輸出：
{
  "summary": "簡潔的總結（50字以內）",
  "description": "詳細分析內容（500-800字）",
  "keyPoints": ["關鍵要點1", "關鍵要點2", "關鍵要點3"],
  "suggestions": ["具體建議1", "具體建議2", "具體建議3"],
  "warnings": ["需要注意的事項"],
  "confidence": 0.85,
  "relevance": ["相關組件名稱"],
  "keywords": ["關鍵詞1", "關鍵詞2"]
}
`,

	qualityRequirements: `
質量要求：
- 內容準確專業，符合傳統命理學理論
- 語言通俗易懂，避免過於專業的術語
- 建議具體可行，有實際指導意義
- 保持積極正面的導向
- 結合現代生活實際情況
`,
};

// Component-specific Prompt Templates
export const PROMPT_TEMPLATES = {
	// 流年關鍵詞 - LiuNianKeyWord
	LiuNianKeyWord: {
		systemPrompt: `你是一位專業的命理師，擅長分析流年運勢趨勢。請基於用戶的八字信息，分析本年度的關鍵運勢詞彙和重要趨勢。`,

		userPrompt: (userInfo, analysisResults) => `
${COMMON_ELEMENTS.userContext(userInfo)}
${COMMON_ELEMENTS.analysisContext(analysisResults)}

請分析本年度（${new Date().getFullYear()}年）的流年關鍵詞：

分析要點：
1. 結合出生八字分析本年度的運勢特點
2. 識別影響最大的3-5個關鍵詞
3. 解釋每個關鍵詞對用戶的具體影響
4. 提供相應的趨吉避凶建議
5. 特別關注用戶的關注領域：${userInfo.concern}

${COMMON_ELEMENTS.outputFormat}

${COMMON_ELEMENTS.qualityRequirements}

請確保關鍵詞選擇準確，解釋詳細，建議實用。
`,

		fallbackResponse: {
			summary: "本年度運勢平穩，宜積極進取",
			description:
				"根據你的出生信息，本年度整體運勢呈現平穩上升的趨勢。建議保持積極的心態，把握機遇的同時也要注意防範風險。在你關注的領域中，特別要注意平衡發展，不宜過於急進。",
			keyPoints: ["運勢平穩", "積極進取", "平衡發展"],
			suggestions: ["保持積極心態", "把握適當機遇", "注意風險防範"],
			warnings: ["避免過於急進"],
			confidence: 0.7,
			relevance: ["FiveElement", "Zodiac"],
			keywords: ["平穩", "進取", "平衡"],
		},
	},

	// 命局分析 - MingJu
	MingJu: {
		systemPrompt: `你是一位資深的八字命理專家，精通命局分析。請基於用戶的完整八字信息，進行深度的命局分析，揭示其天賦特質和人生潛能。`,

		userPrompt: (userInfo, analysisResults) => `
${COMMON_ELEMENTS.userContext(userInfo)}
${COMMON_ELEMENTS.analysisContext(analysisResults)}

請進行深度命局分析：

分析維度：
1. 天賦特質與性格特點
2. 人生發展潛能與方向
3. 強項與需要加強的領域
4. 人際關係模式
5. 適合的發展道路
6. 針對關注領域的深度見解：${userInfo.concern}

${COMMON_ELEMENTS.outputFormat}

${COMMON_ELEMENTS.qualityRequirements}

請提供深入而具有指導意義的命局分析。
`,

		fallbackResponse: {
			summary: "命局顯示你具有良好的發展潛能",
			description:
				"你的命局結構顯示出均衡發展的特質，具有多方面的才能和適應性。在人際交往中表現穩重，能夠獲得他人信任。建議在你擅長的領域深入發展，同時保持開放的心態學習新事物。",
			keyPoints: ["均衡發展", "多方面才能", "人際關係良好"],
			suggestions: [
				"深入發展優勢領域",
				"保持學習心態",
				"建立良好人際網絡",
			],
			warnings: ["避免過度分散精力"],
			confidence: 0.75,
			relevance: ["FiveElement", "GanZhi"],
			keywords: ["均衡", "才能", "適應"],
		},
	},

	// 流年干支 - LiuNianGanZhi
	LiuNianGanZhi: {
		systemPrompt: `你是精通干支曆法的命理專家，能夠準確分析流年干支對個人運勢的影響。請結合傳統干支理論和現代實際應用。`,

		userPrompt: (userInfo, analysisResults) => `
${COMMON_ELEMENTS.userContext(userInfo)}
${COMMON_ELEMENTS.analysisContext(analysisResults)}

請分析本年度流年干支的影響：

當前年份：${new Date().getFullYear()}年
流年干支：${getCurrentYearGanZhi()}

分析要點：
1. 流年干支與用戶八字的相互關係
2. 對各個人生領域的具體影響
3. 月份運勢的起伏變化
4. 重要時間節點的把握
5. 針對用戶關注領域的詳細分析

${COMMON_ELEMENTS.outputFormat}

${COMMON_ELEMENTS.qualityRequirements}

請結合傳統理論與現代應用，提供實用的分析。
`,

		fallbackResponse: {
			summary: "流年干支影響整體偏正面",
			description:
				"本年度的流年干支與您的八字配合較為和諧，整體運勢呈現穩步上升的趨勢。建議把握春夏季節的發展機遇，秋冬季節則宜穩健保守。在重要決策時選擇吉日良時，有助於提升成功率。",
			keyPoints: ["干支和諧", "穩步上升", "季節性變化"],
			suggestions: ["把握春夏機遇", "秋冬保守穩健", "選擇吉日良時"],
			warnings: ["避免重大衝突時期行動"],
			confidence: 0.8,
			relevance: ["GanZhi", "Season"],
			keywords: ["和諧", "穩步", "季節"],
		},
	},

	// 八字干支 - GanZhi
	GanZhi: {
		systemPrompt: `你是八字命理學的專家，深諳天干地支的奧秘。請基於用戶的出生時間，進行詳細的八字干支分析。`,

		userPrompt: (userInfo, analysisResults) => `
${COMMON_ELEMENTS.userContext(userInfo)}
${COMMON_ELEMENTS.analysisContext(analysisResults)}

請進行完整的八字干支分析：

分析內容：
1. 年柱、月柱、日柱、時柱的具體含義
2. 天干地支之間的相互關係
3. 五行平衡與強弱分析
4. 用神喜忌的確定
5. 大運流年的基本走向
6. 對人生各階段的影響

${COMMON_ELEMENTS.outputFormat}

${COMMON_ELEMENTS.qualityRequirements}

請提供專業而易懂的八字分析。
`,

		fallbackResponse: {
			summary: "八字結構良好，五行較為平衡",
			description:
				"您的八字顯示出良好的基礎結構，各柱之間配合和諧。五行分布相對均衡，無明顯偏枯現象。這種命格特點表明您具有穩定的性格和較強的適應能力，人生發展軌跡相對平穩。",
			keyPoints: ["結構良好", "五行平衡", "發展平穩"],
			suggestions: ["保持現有優勢", "適度調整不足", "把握發展機遇"],
			warnings: ["注意五行過旺或過弱的時期"],
			confidence: 0.8,
			relevance: ["FiveElement", "MingJu"],
			keywords: ["平衡", "穩定", "和諧"],
		},
	},

	// 吉凶分析 - JiXiong
	JiXiong: {
		systemPrompt: `你是一位謹慎專業的命理師，擅長吉凶判斷。請基於綜合信息，客觀分析吉凶趨勢，並提供建設性建議。`,

		userPrompt: (userInfo, analysisResults) => `
${COMMON_ELEMENTS.userContext(userInfo)}
${COMMON_ELEMENTS.analysisContext(analysisResults)}

請進行綜合吉凶分析：

分析角度：
1. 整體運勢的吉凶判斷
2. 各個人生領域的吉凶分布
3. 近期需要特別注意的事項
4. 化解不利因素的方法
5. 增強吉利因素的建議
6. 針對具體問題的吉凶分析：${userInfo.problem}

${COMMON_ELEMENTS.outputFormat}

${COMMON_ELEMENTS.qualityRequirements}

請保持客觀平衡，既不過分樂觀也不過分悲觀。
`,

		fallbackResponse: {
			summary: "整體運勢吉多於凶，宜積極而謹慎",
			description:
				"綜合分析顯示，您的整體運勢呈現吉多於凶的態勢。在積極把握機遇的同時，也要注意防範潛在風險。建議保持謹慎樂觀的心態，做好充分準備再採取行動。",
			keyPoints: ["吉多於凶", "積極謹慎", "機遇與風險並存"],
			suggestions: ["把握吉利時機", "防範潛在風險", "保持謹慎樂觀"],
			warnings: ["避免過於冒進", "注意重要決策時機"],
			confidence: 0.75,
			relevance: ["GanZhi", "LiuNianGanZhi"],
			keywords: ["吉利", "謹慎", "平衡"],
		},
	},

	// 季節調節 - Season
	Season: {
		systemPrompt: `你是精通時令養生和風水調節的專家，能夠結合四季變化和個人命理特點，提供專業的調節建議。`,

		userPrompt: (userInfo, analysisResults) => `
${COMMON_ELEMENTS.userContext(userInfo)}
${COMMON_ELEMENTS.analysisContext(analysisResults)}

請提供季節性調節建議：

當前季節：${getCurrentSeason()}
分析要點：
1. 當前季節對用戶的影響
2. 五行調節的具體方法
3. 生活作息的建議調整
4. 飲食養生的注意事項
5. 環境風水的改善建議
6. 結合關注領域的季節性策略

${COMMON_ELEMENTS.outputFormat}

${COMMON_ELEMENTS.qualityRequirements}

請提供實用的季節調節方案。
`,

		fallbackResponse: {
			summary: "順應季節變化，調節身心平衡",
			description:
				"建議您順應當前季節的自然規律，適當調整生活節奏和習慣。在飲食上多選擇當季食材，在作息上配合日照變化，在環境上營造舒適的季節氛圍。這些調節有助於保持身心平衡。",
			keyPoints: ["順應自然", "調整節奏", "身心平衡"],
			suggestions: ["選擇當季食材", "配合日照作息", "營造季節氛圍"],
			warnings: ["避免過度違背自然規律"],
			confidence: 0.7,
			relevance: ["FiveElement", "LiuNianGanZhi"],
			keywords: ["自然", "平衡", "調節"],
		},
	},

	// 核心建議 - CoreSuggestion
	CoreSuggestion: {
		systemPrompt: `你是一位資深的人生導師，擅長整合多維度信息，提供核心的人生建議。請基於所有可用信息，給出最重要的指導建議。`,

		userPrompt: (userInfo, analysisResults) => `
${COMMON_ELEMENTS.userContext(userInfo)}
${COMMON_ELEMENTS.analysisContext(analysisResults)}

請提供核心人生建議：

整合要點：
1. 基於所有分析結果的核心洞察
2. 最重要的3-5個人生建議
3. 優先級排序和實施步驟
4. 長期發展策略
5. 短期行動計劃
6. 針對關注領域的核心策略

${COMMON_ELEMENTS.outputFormat}

${COMMON_ELEMENTS.qualityRequirements}

請提供最有價值的核心建議，幫助用戶抓住重點。
`,

		fallbackResponse: {
			summary: "專注核心優勢，平衡全面發展",
			description:
				"建議您專注於發揮自身的核心優勢，同時保持各方面的平衡發展。在追求目標的過程中，既要有長遠規劃，也要注重當下的積累。保持開放的心態，持續學習和成長。",
			keyPoints: ["專注優勢", "平衡發展", "長遠規劃"],
			suggestions: ["發揮核心優勢", "制定長遠計劃", "保持學習心態"],
			warnings: ["避免過度分散注意力"],
			confidence: 0.8,
			relevance: ["MingJu", "JiXiong"],
			keywords: ["核心", "平衡", "成長"],
		},
	},

	// 具體建議 - SpecificSuggestion
	SpecificSuggestion: {
		systemPrompt: `你是一位實用主義的顧問，專長於將抽象的命理分析轉化為具體可行的生活建議。請針對用戶的具體問題提供詳細的解決方案。`,

		userPrompt: (userInfo, analysisResults) => `
${COMMON_ELEMENTS.userContext(userInfo)}
${COMMON_ELEMENTS.analysisContext(analysisResults)}

請針對具體問題提供詳細建議：

用戶的具體問題：${userInfo.problem}
關注領域：${userInfo.concern}

分析要求：
1. 問題的深度分析
2. 具體的解決步驟
3. 時間安排和優先級
4. 可能的挑戰和應對方案
5. 成功指標和評估方法
6. 相關資源和工具推薦

${COMMON_ELEMENTS.outputFormat}

${COMMON_ELEMENTS.qualityRequirements}

請提供非常具體和可操作的建議。
`,

		fallbackResponse: {
			summary: "制定清晰計劃，循序漸進解決問題",
			description:
				"建議您將問題分解為具體的小步驟，制定清晰的行動計劃。設定合理的時間節點和成功指標，循序漸進地推進。在執行過程中保持靈活性，根據實際情況適時調整策略。",
			keyPoints: ["分解問題", "制定計劃", "循序漸進"],
			suggestions: ["設定具體目標", "制定時間計劃", "保持執行靈活性"],
			warnings: ["避免急於求成", "注意計劃的可行性"],
			confidence: 0.75,
			relevance: ["CoreSuggestion", "JiXiong"],
			keywords: ["計劃", "循序", "靈活"],
		},
	},
};

// Prompt Enhancement Functions
export const PromptEnhancer = {
	// Add personalization based on user history
	addPersonalization: (basePrompt, userInteractions, preferences) => {
		let enhanced = basePrompt;

		if (preferences.language && preferences.language !== "zh-CN") {
			enhanced += `\n請使用${preferences.language}語言回應。`;
		}

		if (userInteractions.length > 0) {
			const frequentConcerns = userInteractions
				.filter((i) => i.data && i.data.concern)
				.map((i) => i.data.concern)
				.reduce((acc, concern) => {
					acc[concern] = (acc[concern] || 0) + 1;
					return acc;
				}, {});

			const topConcern = Object.entries(frequentConcerns).sort(
				([, a], [, b]) => b - a
			)[0];

			if (topConcern) {
				enhanced += `\n注意：用戶特別關注${topConcern[0]}領域，請在分析中給予額外重視。`;
			}
		}

		return enhanced;
	},

	// Add context from related components
	addCrossComponentContext: (
		basePrompt,
		componentName,
		crossReferences,
		analysisResults
	) => {
		if (crossReferences.length === 0) return basePrompt;

		let contextAddon = "\n相關組件分析結果：\n";
		crossReferences.forEach((ref) => {
			const relatedAnalysis = analysisResults[ref.to];
			if (relatedAnalysis && relatedAnalysis.summary) {
				contextAddon += `${ref.to}: ${relatedAnalysis.summary}\n`;
			}
		});

		return basePrompt + contextAddon;
	},

	// Adjust prompt based on error history
	adjustForErrors: (basePrompt, componentName, errorHistory) => {
		const recentErrors = errorHistory.filter(
			(error) =>
				error.componentName === componentName &&
				Date.now() - error.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
		);

		if (recentErrors.length > 0) {
			const errorTypes = recentErrors.map((e) => e.type);
			if (errorTypes.includes("format_error")) {
				return (
					basePrompt +
					"\n特別注意：請嚴格按照指定的JSON格式輸出，確保所有字段都存在且格式正確。"
				);
			}
			if (errorTypes.includes("length_error")) {
				return (
					basePrompt +
					"\n特別注意：請控制回應長度在指定範圍內，避免過長或過短。"
				);
			}
		}

		return basePrompt;
	},
};

// Prompt Quality Validation
export const PromptValidator = {
	validatePrompt: (prompt) => {
		const issues = [];

		if (prompt.length < 100) {
			issues.push("提示詞過短，可能缺乏足夠的上下文");
		}

		if (prompt.length > 4000) {
			issues.push("提示詞過長，可能影響AI理解");
		}

		if (!prompt.includes("請") && !prompt.includes("分析")) {
			issues.push("缺乏明確的指令");
		}

		if (!prompt.includes("格式") && !prompt.includes("輸出")) {
			issues.push("缺乏輸出格式說明");
		}

		return {
			isValid: issues.length === 0,
			issues,
			score: Math.max(0, 100 - issues.length * 20),
		};
	},

	validateResponse: (response, expectedFormat) => {
		try {
			const parsed = JSON.parse(response);
			const requiredFields = [
				"summary",
				"description",
				"keyPoints",
				"suggestions",
			];
			const missingFields = requiredFields.filter(
				(field) => !parsed[field]
			);

			return {
				isValid: missingFields.length === 0,
				missingFields,
				hasValidStructure: typeof parsed === "object",
			};
		} catch (error) {
			return {
				isValid: false,
				error: "Invalid JSON format",
				hasValidStructure: false,
			};
		}
	},
};

// Helper Functions
const getCurrentSeason = () => {
	const month = new Date().getMonth() + 1;
	if (month >= 3 && month <= 5) return "春季";
	if (month >= 6 && month <= 8) return "夏季";
	if (month >= 9 && month <= 11) return "秋季";
	return "冬季";
};

const getCurrentYearGanZhi = () => {
	const year = new Date().getFullYear();
	const gan = ["庚", "辛", "壬", "癸", "甲", "乙", "丙", "丁", "戊", "己"];
	const zhi = [
		"申",
		"酉",
		"戌",
		"亥",
		"子",
		"丑",
		"寅",
		"卯",
		"辰",
		"巳",
		"午",
		"未",
	];

	const ganIndex = (year - 1980) % 10;
	const zhiIndex = (year - 1980) % 12;

	return gan[ganIndex] + zhi[zhiIndex];
};

// Main Prompt Generator
export const generatePrompt = (
	componentName,
	userInfo,
	analysisResults = {},
	options = {}
) => {
	const template = PROMPT_TEMPLATES[componentName];
	if (!template) {
		throw new Error(
			`No prompt template found for component: ${componentName}`
		);
	}

	let prompt = template.userPrompt(userInfo, analysisResults);

	// Apply enhancements
	if (options.userInteractions) {
		prompt = PromptEnhancer.addPersonalization(
			prompt,
			options.userInteractions,
			options.preferences || {}
		);
	}

	if (options.crossReferences) {
		prompt = PromptEnhancer.addCrossComponentContext(
			prompt,
			componentName,
			options.crossReferences,
			analysisResults
		);
	}

	if (options.errorHistory) {
		prompt = PromptEnhancer.adjustForErrors(
			prompt,
			componentName,
			options.errorHistory
		);
	}

	return {
		systemPrompt: template.systemPrompt,
		userPrompt: prompt,
		fallbackResponse: template.fallbackResponse,
		validation: PromptValidator.validatePrompt(prompt),
	};
};

export default {
	PROMPT_TEMPLATES,
	PromptEnhancer,
	PromptValidator,
	generatePrompt,
	COMMON_ELEMENTS,
	PROMPT_CONFIG,
};
