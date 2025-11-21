// 🤖 AI 分群分析儀表板
// 用於監控和優化用戶分群效果

class AIGroupingDashboard {
	constructor() {
		this.analytics = {
			userTypes: {},
			emotionalStates: {},
			serviceDepths: {},
			conversionRates: {},
			satisfactionScores: {},
		};
	}

	// 🎯 生成分群統計報告
	async generateGroupingReport() {
		try {
			// 從 MongoDB 查詢所有用戶分群數據
			const users = await SmartUserIntent.find({
				"aiAnalysis.userType": { $exists: true },
			}).select(
				"aiAnalysis conversationState paymentCompleted createdAt"
			);

			return {
				summary: this.calculateSummaryStats(users),
				userTypeDistribution: this.analyzeUserTypeDistribution(users),
				emotionalStatePatterns: this.analyzeEmotionalPatterns(users),
				serviceDepthPreferences:
					this.analyzeServiceDepthPreferences(users),
				conversionByGroup: this.analyzeConversionByGroup(users),
				recommendations:
					this.generateOptimizationRecommendations(users),
			};
		} catch (error) {
			console.error("🚨 分群報告生成失敗:", error);
			return null;
		}
	}

	// 📊 計算總體統計
	calculateSummaryStats(users) {
		const totalUsers = users.length;
		const groupedUsers = users.filter((u) => u.aiAnalysis?.userType);
		const paidUsers = users.filter((u) => u.paymentCompleted);

		return {
			totalUsers,
			groupedUsers: groupedUsers.length,
			groupingCoverage: (
				(groupedUsers.length / totalUsers) *
				100
			).toFixed(1),
			overallConversionRate: (
				(paidUsers.length / totalUsers) *
				100
			).toFixed(1),
			timeRange: {
				from: users[users.length - 1]?.createdAt,
				to: users[0]?.createdAt,
			},
		};
	}

	// 👥 分析用戶類型分布
	analyzeUserTypeDistribution(users) {
		const distribution = {};
		const conversions = {};

		users.forEach((user) => {
			const userType = user.aiAnalysis?.userType;
			if (userType) {
				distribution[userType] = (distribution[userType] || 0) + 1;
				if (user.paymentCompleted) {
					conversions[userType] = (conversions[userType] || 0) + 1;
				}
			}
		});

		return Object.keys(distribution).map((type) => ({
			userType: type,
			count: distribution[type],
			percentage: ((distribution[type] / users.length) * 100).toFixed(1),
			conversionRate: conversions[type]
				? ((conversions[type] / distribution[type]) * 100).toFixed(1)
				: "0.0",
		}));
	}

	// 😊 分析情緒狀態模式
	analyzeEmotionalPatterns(users) {
		const emotions = {};
		const satisfactionByEmotion = {};

		users.forEach((user) => {
			const emotion = user.aiAnalysis?.emotionalState;
			if (emotion) {
				emotions[emotion] = (emotions[emotion] || 0) + 1;

				// 假設完成付款表示滿意度高
				if (user.paymentCompleted) {
					satisfactionByEmotion[emotion] =
						(satisfactionByEmotion[emotion] || 0) + 1;
				}
			}
		});

		return Object.keys(emotions).map((emotion) => ({
			emotionalState: emotion,
			frequency: emotions[emotion],
			satisfactionScore: satisfactionByEmotion[emotion]
				? (
						(satisfactionByEmotion[emotion] / emotions[emotion]) *
						100
					).toFixed(1)
				: "0.0",
		}));
	}

	// 🎯 分析服務深度偏好
	analyzeServiceDepthPreferences(users) {
		const serviceDepths = {};
		const completionRates = {};

		users.forEach((user) => {
			const depth = user.aiAnalysis?.serviceDepth;
			if (depth) {
				serviceDepths[depth] = (serviceDepths[depth] || 0) + 1;

				// 檢查是否完成了完整流程
				const isCompleted =
					user.conversationState === "ready_for_payment" ||
					user.paymentCompleted;
				if (isCompleted) {
					completionRates[depth] = (completionRates[depth] || 0) + 1;
				}
			}
		});

		return Object.keys(serviceDepths).map((depth) => ({
			serviceDepth: depth,
			requests: serviceDepths[depth],
			completionRate: completionRates[depth]
				? (
						(completionRates[depth] / serviceDepths[depth]) *
						100
					).toFixed(1)
				: "0.0",
		}));
	}

	// 💰 分析各群組轉換率
	analyzeConversionByGroup(users) {
		const groupConversions = {};

		users.forEach((user) => {
			const analysis = user.aiAnalysis;
			if (analysis) {
				const groupKey = `${analysis.userType}-${analysis.urgencyLevel}`;

				if (!groupConversions[groupKey]) {
					groupConversions[groupKey] = { total: 0, converted: 0 };
				}

				groupConversions[groupKey].total++;
				if (user.paymentCompleted) {
					groupConversions[groupKey].converted++;
				}
			}
		});

		return Object.keys(groupConversions).map((groupKey) => {
			const [userType, urgencyLevel] = groupKey.split("-");
			const data = groupConversions[groupKey];

			return {
				userType,
				urgencyLevel,
				totalUsers: data.total,
				conversions: data.converted,
				conversionRate: ((data.converted / data.total) * 100).toFixed(
					1
				),
			};
		});
	}

	// 🎯 生成優化建議
	generateOptimizationRecommendations(users) {
		const recommendations = [];

		// 分析轉換率最低的群組
		const conversions = this.analyzeConversionByGroup(users);
		const lowConversionGroups = conversions
			.filter((group) => parseFloat(group.conversionRate) < 20)
			.sort((a, b) => a.conversionRate - b.conversionRate);

		if (lowConversionGroups.length > 0) {
			recommendations.push({
				type: "conversion_optimization",
				priority: "high",
				title: "低轉換率群組優化",
				description: `${lowConversionGroups[0].userType} (${lowConversionGroups[0].urgencyLevel}緊急度) 群組轉換率僅 ${lowConversionGroups[0].conversionRate}%`,
				action: "建議調整該群組的服務策略和回應方式",
			});
		}

		// 分析最大用戶群組
		const userTypes = this.analyzeUserTypeDistribution(users);
		const largestGroup = userTypes.sort((a, b) => b.count - a.count)[0];

		if (largestGroup) {
			recommendations.push({
				type: "user_experience",
				priority: "medium",
				title: "主要用戶群體優化",
				description: `${largestGroup.userType} 佔用戶總數 ${largestGroup.percentage}%`,
				action: "專門為此群體優化服務流程和內容",
			});
		}

		// 分析情緒狀態處理
		const emotions = this.analyzeEmotionalPatterns(users);
		const lowSatisfactionEmotions = emotions.filter(
			(emotion) => parseFloat(emotion.satisfactionScore) < 30
		);

		if (lowSatisfactionEmotions.length > 0) {
			recommendations.push({
				type: "emotional_support",
				priority: "high",
				title: "情緒支持強化",
				description: `${lowSatisfactionEmotions.map((e) => e.emotionalState).join("、")} 狀態用戶滿意度較低`,
				action: "加強對這些情緒狀態用戶的支持和引導",
			});
		}

		return recommendations;
	}

	// 📈 實時監控指標
	async getRealtimeMetrics() {
		const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

		const recentUsers = await SmartUserIntent.find({
			createdAt: { $gte: last24Hours },
		}).select("aiAnalysis conversationState paymentCompleted");

		return {
			newUsers: recentUsers.length,
			groupedUsers: recentUsers.filter((u) => u.aiAnalysis?.userType)
				.length,
			activeConversations: recentUsers.filter(
				(u) =>
					u.conversationState !== "initial" &&
					u.conversationState !== "ready_for_payment"
			).length,
			conversions: recentUsers.filter((u) => u.paymentCompleted).length,
			topUserType: this.getMostFrequentUserType(recentUsers),
			topEmotionalState: this.getMostFrequentEmotionalState(recentUsers),
		};
	}

	// 🔍 輔助方法
	getMostFrequentUserType(users) {
		const counts = {};
		users.forEach((user) => {
			const type = user.aiAnalysis?.userType;
			if (type) counts[type] = (counts[type] || 0) + 1;
		});

		return Object.keys(counts).reduce(
			(a, b) => (counts[a] > counts[b] ? a : b),
			"未知"
		);
	}

	getMostFrequentEmotionalState(users) {
		const counts = {};
		users.forEach((user) => {
			const state = user.aiAnalysis?.emotionalState;
			if (state) counts[state] = (counts[state] || 0) + 1;
		});

		return Object.keys(counts).reduce(
			(a, b) => (counts[a] > counts[b] ? a : b),
			"未知"
		);
	}
}

// 🎯 API 路由範例 (建議創建 /api/ai-grouping-dashboard)
/*
export default async function handler(req, res) {
    const dashboard = new AIGroupingDashboard();
    
    if (req.method === 'GET') {
        const { type } = req.query;
        
        switch (type) {
            case 'report':
                const report = await dashboard.generateGroupingReport();
                return res.json(report);
                
            case 'realtime':
                const metrics = await dashboard.getRealtimeMetrics();
                return res.json(metrics);
                
            default:
                return res.status(400).json({ error: 'Invalid type parameter' });
        }
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}
*/

export { AIGroupingDashboard };

/* 
🎯 儀表板使用價值：

1. **業務洞察**
   - 用戶行為模式分析
   - 服務效果評估
   - 轉換率優化方向

2. **產品優化**
   - 個人化策略調整
   - 服務流程改進
   - 用戶體驗提升

3. **運營決策**
   - 資源分配優化
   - 目標用戶定位
   - 市場策略調整

4. **AI 模型改進**
   - 分群準確度評估
   - 算法參數調優
   - 新特徵發現
*/
