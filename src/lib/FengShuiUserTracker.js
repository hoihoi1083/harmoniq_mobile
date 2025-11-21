"use client";
import FengShuiMixpanel from "@/lib/mixpanel";

// 風水業務專用的用戶追蹤功能
class FengShuiUserTracker {
	// 用戶註冊完成後調用
	static onUserRegistration(userData) {
		FengShuiMixpanel.identify(userData.userId || userData.email, {
			name: userData.name,
			email: userData.email,
			signupDate: new Date().toISOString(),
			signupMethod: userData.provider || "email",
			language: userData.language || "zh-TW",
			userType: "new_user",
			referralSource: userData.referralSource || "直接訪問",
			// 風水業務專屬屬性
			風水興趣: userData.interests || [],
			註冊原因: userData.signupReason || "探索風水",
			期望服務: userData.expectedServices || ["基礎分析"],
		});

		FengShuiMixpanel.track("用戶註冊完成", {
			註冊方式: userData.provider || "email",
			註冊來源: userData.referralSource || "直接訪問",
			註冊頁面: window.location.pathname,
			註冊時間: new Date().toISOString(),
			是否填寫完整資料: !!(userData.name && userData.interests),
		});

		// 設置用戶首次訪問標記
		if (typeof window !== "undefined") {
			localStorage.setItem(`user_seen_${userData.email}`, "true");
		}

		console.log("🎉 新用戶註冊追蹤完成:", userData.email);
	}

	// 用戶登入時調用
	static onUserLogin(sessionData) {
		const user = sessionData.user;
		const userId = user.email || user.id;

		FengShuiMixpanel.identify(userId, {
			name: user.name,
			email: user.email,
			lastLoginDate: new Date().toISOString(),
			loginProvider: sessionData.provider,
			userType: "returning_user",
			// 更新登入統計
			totalLogins: this.incrementLoginCount(userId),
		});

		FengShuiMixpanel.track("用戶登入", {
			登入方式: sessionData.provider,
			登入時間: new Date().toISOString(),
			登入頁面: window.location.pathname,
			是否記住登入: this.checkRememberLogin(),
			距離上次登入: this.getTimeSinceLastLogin(userId),
		});

		// 設置會話開始時間
		if (typeof window !== "undefined") {
			sessionStorage.setItem("session_start_time", Date.now().toString());
		}

		console.log("🔐 用戶登入追蹤完成:", userId);
	}

	// 追蹤已登入用戶的wind水分析
	static trackAuthenticatedAnalysis(userId, analysisData) {
		// 獲取用戶歷史數據
		const userHistory = this.getUserAnalysisHistory(userId);

		FengShuiMixpanel.trackAnalysisStarted({
			...analysisData,
			// 已登入用戶專屬屬性
			用戶ID: userId,
			歷史分析次數: userHistory.totalAnalysis,
			最喜愛的分析類型: userHistory.favoriteType,
			用戶等級: this.getUserLevel(userHistory.totalAnalysis),
			是否付費用戶: userHistory.isPaidUser,
			上次分析時間: userHistory.lastAnalysisDate,
			分析間隔天數: this.getDaysSinceLastAnalysis(
				userHistory.lastAnalysisDate
			),
		});

		// 更新用戶分析歷史
		this.updateUserAnalysisHistory(userId, analysisData);

		// 更新用戶屬性
		FengShuiMixpanel.setUserProperties({
			總分析次數: userHistory.totalAnalysis + 1,
			最後分析日期: new Date().toISOString(),
			最近分析類型: analysisData.analysisType,
		});
	}

	// 追蹤用戶付費行為
	static trackUserPayment(userId, paymentData) {
		FengShuiMixpanel.trackPayment({
			...paymentData,
			用戶ID: userId,
			是否首次付費: this.isFirstPayment(userId),
			付費決策時間: this.getPaymentDecisionTime(userId),
			從註冊到付費天數: this.getDaysSinceRegistration(userId),
		});

		// 升級用戶等級
		const newUserLevel = this.calculateUserLevel(userId, paymentData);
		FengShuiMixpanel.setUserProperties({
			付費狀態: "已付費",
			首次付費日期: this.isFirstPayment(userId)
				? new Date().toISOString()
				: undefined,
			累積消費金額: this.getTotalSpent(userId) + paymentData.amount,
			用戶等級: newUserLevel,
			付費服務類型: [
				...this.getPaidServices(userId),
				paymentData.serviceType,
			],
		});

		// 追蹤里程碑
		if (this.isFirstPayment(userId)) {
			FengShuiMixpanel.trackMilestone("首次付費", {
				付費金額: paymentData.amount,
				付費服務: paymentData.serviceType,
				從註冊到付費: this.getDaysSinceRegistration(userId) + "天",
			});
		}
	}

	// 追蹤用戶參與度里程碑
	static trackEngagementMilestone(userId, milestoneType, data) {
		const milestones = {
			完成首次分析: { badge: "🏠", description: "風水分析新手" },
			連續7天使用: { badge: "🔥", description: "活躍用戶" },
			完成10次分析: { badge: "⭐", description: "風水愛好者" },
			推薦朋友成功: { badge: "🤝", description: "社區貢獻者" },
			付費升級: { badge: "💎", description: "VIP用戶" },
		};

		const milestone = milestones[milestoneType];

		FengShuiMixpanel.trackMilestone(milestoneType, {
			用戶ID: userId,
			里程碑徽章: milestone.badge,
			里程碑描述: milestone.description,
			達成時間: new Date().toISOString(),
			...data,
		});

		// 更新用戶徽章
		FengShuiMixpanel.setUserProperties({
			[`徽章_${milestoneType}`]: milestone.badge,
			最新里程碑: milestoneType,
			里程碑達成時間: new Date().toISOString(),
		});
	}

	// 工具方法
	static incrementLoginCount(userId) {
		if (typeof window === "undefined") return 1;
		const key = `login_count_${userId}`;
		const count = parseInt(localStorage.getItem(key) || "0") + 1;
		localStorage.setItem(key, count.toString());
		return count;
	}

	static checkRememberLogin() {
		if (typeof window === "undefined") return false;
		return !!localStorage.getItem("remember_login");
	}

	static getTimeSinceLastLogin(userId) {
		if (typeof window === "undefined") return "首次登入";
		const lastLogin = localStorage.getItem(`last_login_${userId}`);
		if (!lastLogin) return "首次登入";

		const daysSince = Math.floor(
			(Date.now() - parseInt(lastLogin)) / (1000 * 60 * 60 * 24)
		);
		localStorage.setItem(`last_login_${userId}`, Date.now().toString());

		return daysSince === 0 ? "今天" : `${daysSince}天前`;
	}

	static getUserAnalysisHistory(userId) {
		if (typeof window === "undefined") {
			return {
				totalAnalysis: 0,
				favoriteType: "未知",
				isPaidUser: false,
				lastAnalysisDate: null,
			};
		}

		const history = localStorage.getItem(`analysis_history_${userId}`);
		return history
			? JSON.parse(history)
			: {
					totalAnalysis: 0,
					favoriteType: "房間風水",
					isPaidUser: false,
					lastAnalysisDate: null,
				};
	}

	static updateUserAnalysisHistory(userId, analysisData) {
		if (typeof window === "undefined") return;

		const history = this.getUserAnalysisHistory(userId);
		history.totalAnalysis += 1;
		history.lastAnalysisDate = new Date().toISOString();

		// 更新最喜愛的分析類型
		const types = history.analysisTypes || {};
		types[analysisData.analysisType] =
			(types[analysisData.analysisType] || 0) + 1;
		history.analysisTypes = types;
		history.favoriteType = Object.keys(types).reduce((a, b) =>
			types[a] > types[b] ? a : b
		);

		localStorage.setItem(
			`analysis_history_${userId}`,
			JSON.stringify(history)
		);
	}

	static getUserLevel(totalAnalysis) {
		if (totalAnalysis >= 50) return "VIP專家";
		if (totalAnalysis >= 20) return "資深用戶";
		if (totalAnalysis >= 10) return "進階用戶";
		if (totalAnalysis >= 3) return "活躍用戶";
		return "新手用戶";
	}

	static getDaysSinceLastAnalysis(lastAnalysisDate) {
		if (!lastAnalysisDate) return 0;
		return Math.floor(
			(Date.now() - new Date(lastAnalysisDate).getTime()) /
				(1000 * 60 * 60 * 24)
		);
	}

	static isFirstPayment(userId) {
		if (typeof window === "undefined") return true;
		return !localStorage.getItem(`first_payment_${userId}`);
	}

	static getTotalSpent(userId) {
		if (typeof window === "undefined") return 0;
		return parseFloat(localStorage.getItem(`total_spent_${userId}`) || "0");
	}

	static getDaysSinceRegistration(userId) {
		if (typeof window === "undefined") return 0;
		const signupDate = localStorage.getItem(`signup_date_${userId}`);
		if (!signupDate) return 0;
		return Math.floor(
			(Date.now() - parseInt(signupDate)) / (1000 * 60 * 60 * 24)
		);
	}
}

export default FengShuiUserTracker;
