// 🤖 AI 用戶對話分組服務
// 基於現有 DeepSeek API 擴展用戶分群功能

class ConversationAIGrouping {
	constructor() {
		this.DEEPSEEK_API_KEY =
			process.env.DEEPSEEK_API_KEY || process.env.API_KEY;
		this.DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
	}

	// 🎯 主要功能：分析用戶對話並分群
	async analyzeAndGroupUser(message, userIntent, conversationHistory = []) {
		try {
			const analysisPrompt = this.buildAnalysisPrompt(
				message,
				userIntent,
				conversationHistory
			);

			const response = await this.callDeepSeekAPI([
				{
					role: "system",
					content: analysisPrompt,
				},
				{
					role: "user",
					content: message,
				},
			]);

			const analysis = JSON.parse(response.choices[0].message.content);

			// 更新用戶檔案
			await this.updateUserProfile(userIntent, analysis);

			return analysis;
		} catch (error) {
			console.error("🚨 AI分群分析失敗:", error);
			return this.getFallbackGrouping(userIntent);
		}
	}

	// 🎯 建立分析提示詞
	buildAnalysisPrompt(message, userIntent, conversationHistory) {
		return `你是專業的用戶行為分析師，專門分析風水諮詢對話。

請分析以下用戶對話，返回 JSON 格式的分群結果：

用戶資料：
- 主要關注：${userIntent.primaryConcern || "未明確"}
- 對話狀態：${userIntent.conversationState || "初始"}
- 是否有生日：${!!userIntent.userBirthday}
- 具體問題：${userIntent.specificQuestion || "無"}
- 對話歷史長度：${conversationHistory.length}

當前訊息：${message}

請返回以下 JSON 格式：
{
    "userType": "新手用戶|回頭客|專業用戶",
    "emotionalState": "平靜|焦慮|興奮|困惑|絕望|希望",
    "urgencyLevel": "低|中|高|緊急",
    "conversationPattern": "探索型|問題解決型|決策支持型|學習型",
    "serviceDepth": "快速諮詢|標準分析|深度服務|專家諮詢",
    "personalityType": "理性分析型|感性直覺型|務實行動型|謹慎保守型",
    "engagementLevel": "低|中|高",
    "topicFocus": ["感情", "財運", "工作", "健康", "人際關係", "子女", "因緣"],
    "communicationStyle": "直接|委婉|詳細|簡潔",
    "recommendedApproach": "引導式|支持式|分析式|教育式",
    "confidence": 0.8
}`;
	}

	// 🎯 調用 DeepSeek API
	async callDeepSeekAPI(messages, options = {}) {
		const requestData = {
			model: "deepseek-chat",
			messages: messages,
			temperature: options.temperature || 0.3,
			max_tokens: options.max_tokens || 1000,
			stream: false,
		};

		const response = await fetch(this.DEEPSEEK_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.DEEPSEEK_API_KEY}`,
			},
			body: JSON.stringify(requestData),
		});

		if (!response.ok) {
			throw new Error(`DeepSeek API error: ${response.status}`);
		}

		return await response.json();
	}

	// 🎯 更新用戶檔案
	async updateUserProfile(userIntent, analysis) {
		try {
			// 建立或更新用戶分群資料
			userIntent.aiAnalysis = {
				userType: analysis.userType,
				emotionalState: analysis.emotionalState,
				urgencyLevel: analysis.urgencyLevel,
				conversationPattern: analysis.conversationPattern,
				serviceDepth: analysis.serviceDepth,
				personalityType: analysis.personalityType,
				engagementLevel: analysis.engagementLevel,
				topicFocus: analysis.topicFocus,
				communicationStyle: analysis.communicationStyle,
				recommendedApproach: analysis.recommendedApproach,
				lastAnalyzed: new Date(),
				confidence: analysis.confidence,
			};

			await userIntent.save();
			// console.log("✅ 用戶AI分群檔案已更新:", analysis.userType);
		} catch (error) {
			console.error("🚨 更新用戶檔案失敗:", error);
		}
	}

	// 🎯 備用分群邏輯
	getFallbackGrouping(userIntent) {
		const hasHistory =
			userIntent.conversationHistory &&
			userIntent.conversationHistory.length > 3;
		const hasBirthday = !!userIntent.userBirthday;
		const hasSpecificQuestion = !!userIntent.specificQuestion;

		return {
			userType: hasHistory ? "回頭客" : "新手用戶",
			emotionalState: "平靜",
			urgencyLevel: hasSpecificQuestion ? "中" : "低",
			conversationPattern: hasSpecificQuestion ? "問題解決型" : "探索型",
			serviceDepth: hasBirthday ? "標準分析" : "快速諮詢",
			personalityType: "理性分析型",
			engagementLevel: "中",
			topicFocus: [userIntent.primaryConcern || "綜合運勢"],
			communicationStyle: "直接",
			recommendedApproach: "引導式",
			confidence: 0.6,
		};
	}

	// 🎯 根據分群優化服務策略
	getServiceStrategy(userType, emotionalState, urgencyLevel) {
		const strategies = {
			新手用戶: {
				低: "提供基礎介紹和引導",
				中: "詳細解釋服務內容",
				高: "快速建立信任並提供支持",
			},
			回頭客: {
				低: "提供進階分析選項",
				中: "直接切入核心問題",
				高: "立即提供專業建議",
			},
			專業用戶: {
				低: "提供深度技術分析",
				中: "專業術語溝通",
				高: "專家級諮詢服務",
			},
		};

		return strategies[userType]?.[urgencyLevel] || "標準服務流程";
	}

	// 🎯 生成個人化回應策略
	generatePersonalizedResponse(analysis, message) {
		const {
			userType,
			emotionalState,
			urgencyLevel,
			communicationStyle,
			recommendedApproach,
		} = analysis;

		let responseStrategy = {
			tone: this.getToneByEmotionalState(emotionalState),
			approach: recommendedApproach,
			urgency: urgencyLevel,
			style: communicationStyle,
			depth: this.getDepthByUserType(userType),
		};

		return responseStrategy;
	}

	// 🎯 根據情緒狀態調整語調
	getToneByEmotionalState(emotionalState) {
		const toneMap = {
			平靜: "專業友好",
			焦慮: "溫暖支持",
			興奮: "積極回應",
			困惑: "耐心引導",
			絕望: "情感支持",
			希望: "鼓勵正面",
		};
		return toneMap[emotionalState] || "專業友好";
	}

	// 🎯 根據用戶類型調整回應深度
	getDepthByUserType(userType) {
		const depthMap = {
			新手用戶: "基礎詳細",
			回頭客: "中等深度",
			專業用戶: "專業深度",
		};
		return depthMap[userType] || "中等深度";
	}
}

// 🎯 導出服務 (使用 ES 模組語法)
export { ConversationAIGrouping };

/* 
🎯 使用範例：

const groupingService = new ConversationAIGrouping();

// 在 smart-chat route 中使用
const userAnalysis = await groupingService.analyzeAndGroupUser(
    message, 
    userIntent, 
    conversationHistory
);

// 根據分析結果調整服務策略
const serviceStrategy = groupingService.getServiceStrategy(
    userAnalysis.userType,
    userAnalysis.emotionalState, 
    userAnalysis.urgencyLevel
);

// 生成個人化回應
const responseStrategy = groupingService.generatePersonalizedResponse(
    userAnalysis, 
    message
);
*/
