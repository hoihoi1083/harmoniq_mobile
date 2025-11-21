// 智能對話管理系統
export class IntentTracker {
	// 檢測用戶關注的主要領域
	static detectPrimaryConcern(message) {
		const concerns = {
			工作: [
				"工作",
				"事業",
				"職場",
				"老闆",
				"同事",
				"升職",
				"轉工",
				"辭職",
				"公司",
				"職業",
				"事業運",
			],
			感情: [
				"感情",
				"愛情",
				"另一半",
				"男朋友",
				"女朋友",
				"老公",
				"老婆",
				"結婚",
				"分手",
				"戀愛",
			],
			財運: [
				"錢",
				"財運",
				"投資",
				"理財",
				"收入",
				"薪水",
				"財富",
				"發財",
				"破財",
				"賺錢",
				"生意",
			],
			子女: [
				"子女",
				"小朋友",
				"孩子",
				"懷孕",
				"生仔",
				"教育",
				"學業",
				"兒子",
				"女兒",
			],
			人際關係: [
				"朋友",
				"人際",
				"社交",
				"關係",
				"人緣",
				"貴人",
				"小人",
				"合作",
			],
			桃花: ["桃花", "單身", "脫單", "姻緣", "相親", "約會", "追求"],
			因緣: ["因緣", "緣分", "命運", "運勢", "機會", "際遇", "天時"],
		};

		for (const [concern, keywords] of Object.entries(concerns)) {
			if (keywords.some((keyword) => message.includes(keyword))) {
				return concern;
			}
		}
		return null;
	}

	// 生成針對特定關注領域的具體問題選項
	static generateSpecificQuestions(concern) {
		const questions = {
			工作: [
				"你最想解決工作上的哪個問題？",
				"• 想知道升職加薪的時機",
				"• 考慮轉工或轉行",
				"• 職場人際關係處理",
				"• 工作壓力和倦怠",
				"• 創業或投資機會",
			],
			感情: [
				"你在感情方面最關心什麼？",
				"• 想知道現有關係的發展",
				"• 如何挽回或改善感情",
				"• 何時會遇到合適的人",
				"• 婚姻時機和對象選擇",
				"• 處理感情糾紛和衝突",
			],
			財運: [
				"你在財運方面想了解什麼？",
				"• 投資理財的最佳時機",
				"• 如何增加收入來源",
				"• 置業買房的時機",
				"• 生意合作和機會",
				"• 避免破財和損失",
			],
			子女: [
				"關於子女，你最想知道什麼？",
				"• 懷孕生子的最佳時機",
				"• 孩子的教育和發展",
				"• 如何改善親子關係",
				"• 孩子的健康和安全",
				"• 子女未來的運勢",
			],
			人際關係: [
				"在人際關係上，你遇到什麼困擾？",
				"• 如何改善職場人際關係",
				"• 處理朋友間的矛盾",
				"• 遇到貴人的機會",
				"• 避免小人和是非",
				"• 擴展社交圈子",
			],
			桃花: [
				"關於桃花運，你想改善什麼？",
				"• 何時會有桃花出現",
				"• 如何提升個人魅力",
				"• 適合的對象類型",
				"• 脫單的最佳時機",
				"• 避免爛桃花",
			],
			因緣: [
				"關於人生方向，你想了解什麼？",
				"• 人生的使命和目標",
				"• 重要的人生轉捩點",
				"• 如何把握機會",
				"• 化解人生困局",
				"• 尋找生命中的貴人",
			],
		};

		return questions[concern] || questions["工作"];
	}

	// 檢查用戶是否確認了建議的問題
	static checkUserConfirmation(message) {
		const confirmWords = [
			"對",
			"是",
			"正確",
			"沒錯",
			"就是",
			"確實",
			"同意",
			"OK",
			"ok",
			"好",
			"係",
		];
		const denyWords = [
			"不是",
			"不對",
			"錯",
			"不同",
			"其他",
			"另外",
			"不一樣",
			"不准確",
		];

		const hasConfirm = confirmWords.some((word) => message.includes(word));
		const hasDeny = denyWords.some((word) => message.includes(word));

		if (hasConfirm && !hasDeny) return "confirmed";
		if (hasDeny) return "denied";
		return "unclear";
	}

	// 從用戶回應中提取具體問題
	static extractSpecificProblem(message, concern) {
		// 如果用戶直接描述問題，提取關鍵內容
		const problemIndicators = [
			"想知道",
			"關心",
			"擔心",
			"希望",
			"問題是",
			"困擾是",
			"煩惱是",
		];

		for (const indicator of problemIndicators) {
			if (message.includes(indicator)) {
				const index = message.indexOf(indicator);
				return message.substring(index).trim();
			}
		}

		// 如果沒有明確指示詞，返回整個消息作為問題描述
		return message.trim();
	}

	// 生成付款連結
	static generatePaymentLink(concern, userId) {
		const serviceMap = {
			工作: "work-analysis",
			感情: "relationship-analysis",
			財運: "wealth-analysis",
			子女: "children-analysis",
			人際關係: "social-analysis",
			桃花: "love-analysis",
			因緣: "destiny-analysis",
		};

		const serviceId = serviceMap[concern] || "general-analysis";
		return `/zh-TW/payment/${serviceId}`;
	}
}

// 對話狀態管理
export class ConversationState {
	static states = {
		INITIAL: "initial",
		CONCERN_DETECTED: "concern_detected",
		ASKING_SPECIFIC: "asking_specific",
		WAITING_CONFIRMATION: "waiting_confirmation",
		PROBLEM_CONFIRMED: "problem_confirmed",
		READY_FOR_PAYMENT: "ready_for_payment",
	};

	// 確定下一個對話狀態
	static getNextState(
		currentState,
		userMessage,
		detectedConcern,
		hasSpecificProblem
	) {
		switch (currentState) {
			case this.states.INITIAL:
				if (detectedConcern) {
					return this.states.CONCERN_DETECTED;
				}
				return this.states.INITIAL;

			case this.states.CONCERN_DETECTED:
				return this.states.ASKING_SPECIFIC;

			case this.states.ASKING_SPECIFIC:
				if (hasSpecificProblem) {
					return this.states.WAITING_CONFIRMATION;
				}
				return this.states.ASKING_SPECIFIC;

			case this.states.WAITING_CONFIRMATION:
				const confirmation =
					IntentTracker.checkUserConfirmation(userMessage);
				if (confirmation === "confirmed") {
					return this.states.READY_FOR_PAYMENT;
				} else if (confirmation === "denied") {
					return this.states.ASKING_SPECIFIC;
				}
				return this.states.WAITING_CONFIRMATION;

			case this.states.READY_FOR_PAYMENT:
				return this.states.READY_FOR_PAYMENT;

			default:
				return this.states.INITIAL;
		}
	}

	// 生成對話回應
	static generateResponse(state, concern, specificProblem, userMessage) {
		switch (state) {
			case this.states.CONCERN_DETECTED:
				const questions =
					IntentTracker.generateSpecificQuestions(concern);
				return {
					message: `我了解你關心${concern}方面的問題。\n\n${questions.join("\n")}\n\n請告訴我你最想了解的是哪一方面？`,
					needsInput: true,
					showPaymentOption: false,
				};

			case this.states.ASKING_SPECIFIC:
				return {
					message: `請詳細描述你在${concern}方面的具體問題或困擾，這樣我可以為你提供更準確的分析。`,
					needsInput: true,
					showPaymentOption: false,
				};

			case this.states.WAITING_CONFIRMATION:
				return {
					message: `我理解你的問題是：「${specificProblem}」\n\n這樣理解正確嗎？如果不正確，請重新描述你的具體問題。`,
					needsInput: true,
					showPaymentOption: false,
				};

			case this.states.READY_FOR_PAYMENT:
				const paymentLink = IntentTracker.generatePaymentLink(concern);
				return {
					message: `好的，我已經記錄了你在${concern}方面的問題：「${specificProblem}」\n\n現在我可以為你生成專業的風水分析報告。報告將包含：\n• 基於你八字的個人分析\n• 針對你具體問題的解決方案\n• 風水佈局和時機建議\n\n點擊下方開始專業分析：`,
					needsInput: false,
					showPaymentOption: true,
					paymentLink: paymentLink,
					concern: concern,
					specificProblem: specificProblem,
				};

			default:
				return {
					message:
						"請告訴我你目前最關心的生活問題，我會為你提供專業的風水指導。",
					needsInput: true,
					showPaymentOption: false,
				};
		}
	}
}

// CommonJS 導出（為了測試）
if (typeof module !== "undefined" && module.exports) {
	module.exports = { IntentTracker, ConversationState };
}
