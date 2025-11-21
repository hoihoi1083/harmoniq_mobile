/**
 * Unified AI Analysis Service
 * Provides centralized AI integration with fallback mechanisms
 */

class AIAnalysisService {
	constructor() {
		this.apiEndpoint = "/api/ai-analysis";
		this.fallbackEnabled = true;
		this.retryAttempts = 3;
		this.timeout = 30000; // 30 seconds
	}

	/**
	 * Generate AI anal		const keyData = {
			birthday: userInfo.birthday,
			concern: userInfo.concern,
			problem: userInfo.problem,
			component: componentType,
		};
		// Use Buffer for UTF-8 safe encoding instead of btoa which only supports ASCII
		return Buffer.from(JSON.stringify(keyData), 'utf-8').toString('base64').replace(/[/+=]/g, "");th automatic fallback
	 */
	async generateAnalysis(prompt, userInfo, componentType) {
		const cacheKey = this.getCacheKey(userInfo, componentType);

		// Check cache first
		const cached = await this.getCachedResult(cacheKey);
		if (cached) {
			return { ...cached, source: "cache" };
		}

		// Validate inputs
		if (!this.validateInputs(prompt, userInfo)) {
			throw new Error("Invalid inputs for AI analysis");
		}

		let lastError = null;

		// Attempt AI generation with retries
		for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
			try {
				const result = await this.callAIAPI(
					prompt,
					userInfo,
					componentType
				);

				// Validate AI response
				const validation = this.validateResponse(
					result,
					componentType,
					userInfo
				);
				if (!validation.isValid) {
					throw new Error(
						`AI response validation failed: ${validation.issues.join(", ")}`
					);
				}

				// Cache successful result
				await this.cacheResult(cacheKey, result);

				return { ...result, source: "ai", attempt };
			} catch (error) {
				lastError = error;
				console.warn(`AI attempt ${attempt} failed:`, error.message);

				if (attempt < this.retryAttempts) {
					await this.delay(1000 * attempt); // Progressive delay
				}
			}
		}

		// Fallback to traditional analysis
		if (this.fallbackEnabled) {
			console.info("Using fallback analysis due to AI failure");
			const fallbackResult = this.getFallbackAnalysis(
				userInfo,
				componentType
			);
			await this.cacheResult(cacheKey, fallbackResult, 60 * 60 * 1000); // Cache for 1 hour
			return {
				...fallbackResult,
				source: "fallback",
				error: lastError?.message,
			};
		}

		throw lastError;
	}

	/**
	 * Call AI API with proper error handling
	 */
	async callAIAPI(prompt, userInfo, componentType) {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.timeout);

		try {
			const response = await fetch(this.apiEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					prompt,
					userInfo: this.sanitizeUserInfo(userInfo),
					componentType,
					options: {
						temperature: 0.7,
						maxTokens: 2000,
					},
				}),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`API請求失敗: ${response.status} - ${errorText || response.statusText}`
				);
			}

			const data = await response.json();

			if (!data || typeof data !== "object") {
				throw new Error("API返回了無效的響應格式");
			}

			return data;
		} catch (error) {
			clearTimeout(timeoutId);

			if (error.name === "AbortError") {
				throw new Error("請求超時，請檢查網路連接後重試");
			}

			if (error.message.includes("fetch")) {
				throw new Error("網路連接失敗，請檢查網路狀態");
			}

			throw error;
		}
	}

	/**
	 * Validate AI response quality
	 */
	validateResponse(response, componentType, userInfo) {
		const validators = {
			completeness: {
				check: () => response.content && response.content.length > 100,
				message: "分析內容過於簡短",
			},

			personalization: {
				check: () => response.content.includes(userInfo.concern),
				message: "分析未針對用戶關注領域",
			},

			actionability: {
				check: () =>
					/建議|方法|步驟|應該|避免|注意/.test(response.content),
				message: "缺乏具體可操作的建議",
			},

			terminology: {
				check: () => /八字|五行|天干|地支|命理/.test(response.content),
				message: "專業術語使用不足",
			},

			structure: {
				check: () => {
					if (componentType === "jiXiong") {
						return (
							response.jixiang &&
							response.xiong &&
							Array.isArray(response.jixiang) &&
							Array.isArray(response.xiong)
						);
					}
					return true;
				},
				message: "響應結構不符合組件要求",
			},
		};

		const results = Object.entries(validators).map(([key, validator]) => ({
			key,
			passed: validator.check(),
			message: validator.message,
		}));

		return {
			isValid: results.every((r) => r.passed),
			issues: results.filter((r) => !r.passed).map((r) => r.message),
			score: results.filter((r) => r.passed).length / results.length,
		};
	}

	/**
	 * Generate fallback analysis using traditional methods
	 */
	getFallbackAnalysis(userInfo, componentType) {
		const fallbackStrategies = {
			jiXiong: () => this.generateTraditionalJiXiong(userInfo),
			season: () => this.generateTraditionalSeason(userInfo),
			coresuggestion: () => this.generateTraditionalCore(userInfo),
			specificsuggestion: () =>
				this.generateTraditionalSpecific(userInfo),
			default: () => this.generateGenericFallback(userInfo),
		};

		const strategy =
			fallbackStrategies[componentType] || fallbackStrategies.default;
		return strategy();
	}

	/**
	 * Traditional JiXiong analysis
	 */
	generateTraditionalJiXiong(userInfo) {
		const concern = userInfo.concern || "財運";

		return {
			content: `基於傳統八字分析的${concern}吉凶評估：

【吉象分析】
1. 根據你的出生時辰，日主得時令之助，基礎運勢穩定
2. 五行中有生助之神，在${concern}方面有貴人相助的機會
3. 時支藏干透出，代表未來發展潛力良好

【凶象提醒】
1. 需注意流年沖克，在重要決策時宜謹慎考慮
2. 五行偏枯之處需要調節，避免過度消耗
3. 人際關係中注意避免小人暗害

建議採用傳統的調和方法，如方位調整、時間選擇等來化解不利因素。`,

			jixiang: [
				{
					title: "日主得助",
					description: "基礎運勢穩定，適合穩步發展",
				},
				{
					title: "貴人運",
					description: `在${concern}領域有貴人相助機會`,
				},
				{
					title: "潛力發展",
					description: "未來發展空間良好，需要耐心培養",
				},
			],

			xiong: [
				{
					title: "流年沖克",
					description: "重要決策需要謹慎，避免衝動行為",
				},
				{
					title: "五行失衡",
					description: "注意身心調節，避免過度消耗",
				},
				{ title: "人際是非", description: "防範小人，保持低調謙遜" },
			],

			isTraditional: true,
		};
	}

	generateTraditionalSeason(userInfo) {
		const concern = userInfo.concern || "財運";
		return {
			content: `傳統四季${concern}分析：根據你的八字特點，提供四季調養建議...`,
			isTraditional: true,
		};
	}

	generateTraditionalCore(userInfo) {
		const concern = userInfo.concern || "財運";
		return {
			content: `傳統${concern}核心建議：基於八字命理原理的調和方法...`,
			isTraditional: true,
		};
	}

	generateTraditionalSpecific(userInfo) {
		const concern = userInfo.concern || "財運";
		const problem = userInfo.problem || "整體運勢";
		return {
			content: `針對${problem}的傳統解決方案：結合${concern}領域的古典智慧...`,
			isTraditional: true,
		};
	}

	generateGenericFallback(userInfo) {
		return {
			content: `基於你${userInfo.birthDateTime}的生辰，提供傳統八字分析建議。建議諮詢專業命理師獲得更詳細的個人化分析。`,
			isTraditional: true,
		};
	}

	/**
	 * Utility methods
	 */
	validateInputs(prompt, userInfo) {
		if (!prompt || typeof prompt !== "string" || prompt.length < 10) {
			return false;
		}
		if (!userInfo || !userInfo.birthDateTime || !userInfo.concern) {
			return false;
		}
		return true;
	}

	getCacheKey(userInfo, componentType) {
		const keyData = {
			birth: userInfo.birthDateTime,
			concern: userInfo.concern,
			problem: userInfo.problem,
			component: componentType,
		};
		return Buffer.from(JSON.stringify(keyData), "utf8")
			.toString("base64")
			.replace(/[/+=]/g, "");
	}

	async getCachedResult(key) {
		try {
			const cached = localStorage.getItem(`ai_cache_${key}`);
			if (cached) {
				const parsed = JSON.parse(cached);
				if (parsed.expiry > Date.now()) {
					return parsed.data;
				}
				localStorage.removeItem(`ai_cache_${key}`);
			}
		} catch (error) {
			console.warn("Cache retrieval error:", error);
		}
		return null;
	}

	async cacheResult(key, data, expiry = 24 * 60 * 60 * 1000) {
		try {
			const cacheData = {
				data,
				expiry: Date.now() + expiry,
				timestamp: Date.now(),
			};
			localStorage.setItem(`ai_cache_${key}`, JSON.stringify(cacheData));
		} catch (error) {
			console.warn("Cache storage error:", error);
		}
	}

	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Clear cache (for debugging or user preference)
	 */
	clearCache() {
		const keys = Object.keys(localStorage).filter((key) =>
			key.startsWith("ai_cache_")
		);
		keys.forEach((key) => localStorage.removeItem(key));
		console.info(`Cleared ${keys.length} cached AI results`);
	}

	/**
	 * Get service statistics
	 */
	getStats() {
		const keys = Object.keys(localStorage).filter((key) =>
			key.startsWith("ai_cache_")
		);
		return {
			cachedResults: keys.length,
			cacheSize: keys.reduce((size, key) => {
				return size + localStorage.getItem(key).length;
			}, 0),
			lastUpdate:
				keys.length > 0
					? Math.max(
							...keys.map((key) => {
								try {
									return JSON.parse(localStorage.getItem(key))
										.timestamp;
								} catch {
									return 0;
								}
							})
						)
					: null,
		};
	}
}

// Export singleton instance
export default new AIAnalysisService();
