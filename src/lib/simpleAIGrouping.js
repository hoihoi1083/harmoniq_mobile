// 🤖 簡化版 AI 分組系統 - 立即可用
// 不依賴外部 API，使用規則引擎快速分群

export class SimpleAIGrouping {
	// 🎯 基於關鍵詞和模式的快速分群
	analyzeUser(message, userIntent) {
		const analysis = {
			userType: this.detectUserType(message, userIntent),
			emotionalState: this.detectEmotionalState(message),
			urgencyLevel: this.detectUrgencyLevel(message),
			serviceDepth: this.detectServiceDepth(message, userIntent),
			confidence: 0.8,
		};

		// console.log("🤖 簡化 AI 分群結果:", analysis);
		return analysis;
	}

	// 🎯 檢測用戶類型
	detectUserType(message, userIntent) {
		const newbieKeywords = [
			"不知道",
			"不懂",
			"第一次",
			"新手",
			"怎麼開始",
			"不會",
		];
		const professionalKeywords = [
			"八字",
			"格局",
			"五行",
			"命理",
			"詳細分析",
			"專業",
		];
		const returningKeywords = ["之前", "上次", "記得", "還記得"];

		if (
			userIntent.conversationHistory &&
			userIntent.conversationHistory.length > 3
		) {
			return "回頭客";
		}

		if (newbieKeywords.some((keyword) => message.includes(keyword))) {
			return "新手用戶";
		}

		if (professionalKeywords.some((keyword) => message.includes(keyword))) {
			return "專業用戶";
		}

		return "新手用戶"; // 默認
	}

	// 🎯 檢測情緒狀態
	detectEmotionalState(message) {
		const anxietyKeywords = [
			"焦慮",
			"緊張",
			"擔心",
			"害怕",
			"不安",
			"壓力",
		];
		const sadKeywords = ["難過", "傷心", "痛苦", "失望", "絕望", "分手"];
		const excitedKeywords = ["興奮", "開心", "高興", "期待", "太好了"];
		const confusedKeywords = ["困惑", "不明白", "搞不懂", "迷茫"];

		if (anxietyKeywords.some((keyword) => message.includes(keyword))) {
			return "焦慮";
		}
		if (sadKeywords.some((keyword) => message.includes(keyword))) {
			return "絕望";
		}
		if (excitedKeywords.some((keyword) => message.includes(keyword))) {
			return "興奮";
		}
		if (confusedKeywords.some((keyword) => message.includes(keyword))) {
			return "困惑";
		}

		return "平靜";
	}

	// 🎯 檢測急迫程度
	detectUrgencyLevel(message) {
		const urgentKeywords = ["緊急", "急", "馬上", "立即", "現在", "很重要"];
		const highKeywords = ["重要", "嚴重", "問題很大", "很擔心"];
		const lowKeywords = ["隨便看看", "了解一下", "好奇", "有空"];

		if (urgentKeywords.some((keyword) => message.includes(keyword))) {
			return "緊急";
		}
		if (highKeywords.some((keyword) => message.includes(keyword))) {
			return "高";
		}
		if (lowKeywords.some((keyword) => message.includes(keyword))) {
			return "低";
		}

		return "中";
	}

	// 🎯 檢測服務深度需求
	detectServiceDepth(message, userIntent) {
		const quickKeywords = ["簡單", "快速", "大概", "隨便"];
		const deepKeywords = ["詳細", "深入", "全面", "完整", "專業"];

		if (userIntent.userBirthday && userIntent.partnerBirthday) {
			return "深度服務"; // 雙人分析需要深度
		}

		if (deepKeywords.some((keyword) => message.includes(keyword))) {
			return "深度服務";
		}
		if (quickKeywords.some((keyword) => message.includes(keyword))) {
			return "快速諮詢";
		}

		return "標準分析";
	}

	// 🎯 生成個人化回應策略
	getPersonalizedStrategy(analysis) {
		return {
			tone: this.getToneByEmotion(analysis.emotionalState),
			approach: this.getApproachByUserType(analysis.userType),
			depth: analysis.serviceDepth,
			urgency: analysis.urgencyLevel,
		};
	}

	// 🎯 根據情緒調整語調
	getToneByEmotion(emotionalState) {
		const toneMap = {
			焦慮: "溫暖支持",
			絕望: "關懷鼓勵",
			興奮: "積極回應",
			困惑: "耐心引導",
			平靜: "專業友好",
		};
		return toneMap[emotionalState] || "專業友好";
	}

	// 🎯 根據用戶類型調整方法
	getApproachByUserType(userType) {
		const approachMap = {
			新手用戶: "詳細引導",
			專業用戶: "技術分析",
			回頭客: "直接回應",
		};
		return approachMap[userType] || "詳細引導";
	}

	// 🎯 生成個人化建議
	generateSuggestions(analysis) {
		const suggestions = [];

		if (analysis.userType === "新手用戶") {
			suggestions.push({
				type: "guide",
				content: "💡 我會為你詳細解釋每個步驟，讓你更容易理解",
			});
		}

		if (analysis.emotionalState === "焦慮") {
			suggestions.push({
				type: "support",
				content: "🌸 不用擔心，我們一步步來解決問題",
			});
		}

		if (analysis.serviceDepth === "深度服務") {
			suggestions.push({
				type: "upgrade",
				content: "🔬 建議選擇詳細報告，獲得完整專業分析",
			});
		}

		return suggestions;
	}
}
