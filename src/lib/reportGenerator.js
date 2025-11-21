// 專業風水報告生成系統
import { BaziCalculator } from "./baziCalculator.js";

export class ReportGenerator {
	// 生成完整的個人化風水報告
	static async generatePersonalizedReport(userIntent, paymentData) {
		const {
			primaryConcern,
			specificQuestion,
			birthday,
			birthTime,
			userId,
		} = userIntent;

		try {
			// 1. 生成八字分析
			const baziAnalysis = await this.generateBaziAnalysis(
				birthday,
				birthTime
			);

			// 2. 生成特定領域分析
			const concernAnalysis = await this.generateConcernAnalysis(
				primaryConcern,
				baziAnalysis,
				specificQuestion
			);

			// 3. 生成風水解決方案
			const fengShuiSolutions = await this.generateFengShuiSolutions(
				primaryConcern,
				baziAnalysis
			);

			// 4. 生成時機建議
			const timingAdvice = await this.generateTimingAdvice(
				primaryConcern,
				baziAnalysis
			);

			// 5. 生成個人改變建議
			const personalChanges = await this.generatePersonalChangeAdvice(
				primaryConcern,
				baziAnalysis
			);

			// 組合完整報告
			const reportContent = {
				baziAnalysis,
				currentSituation: concernAnalysis.current,
				futureOutlook: concernAnalysis.future,
				specificAdvice: this.generateSpecificAdvice(
					specificQuestion,
					primaryConcern,
					baziAnalysis
				),
				fengShuiSolutions,
				personalChanges,
				timingAdvice,
			};

			return reportContent;
		} catch (error) {
			console.error("Report generation error:", error);
			throw new Error("報告生成失敗");
		}
	}

	// 生成八字分析
	static async generateBaziAnalysis(birthday, birthTime) {
		const birthDate = new Date(birthday);
		const year = birthDate.getFullYear();
		const month = birthDate.getMonth() + 1;
		const day = birthDate.getDate();

		// 計算五行屬性
		const yearElement = this.getYearElement(year);
		const dayElement = this.getDayElement(year, month, day);

		// 性格分析
		const personality = this.getPersonalityAnalysis(
			yearElement,
			dayElement
		);

		// 運勢基調
		const baseFortune = this.getBaseFortune(yearElement, dayElement);

		return {
			yearElement,
			dayElement,
			personality,
			baseFortune,
			hasTimeData: Boolean(birthTime),
			strengthAnalysis: this.getElementStrength(
				yearElement,
				dayElement,
				birthTime
			),
		};
	}

	// 生成特定關注領域分析
	static async generateConcernAnalysis(
		concern,
		baziAnalysis,
		specificQuestion
	) {
		const analysisTemplates = {
			工作: {
				current: this.generateCareerCurrent(baziAnalysis),
				future: this.generateCareerFuture(baziAnalysis),
			},
			感情: {
				current: this.generateRelationshipCurrent(baziAnalysis),
				future: this.generateRelationshipFuture(baziAnalysis),
			},
			財運: {
				current: this.generateWealthCurrent(baziAnalysis),
				future: this.generateWealthFuture(baziAnalysis),
			},
			子女: {
				current: this.generateChildrenCurrent(baziAnalysis),
				future: this.generateChildrenFuture(baziAnalysis),
			},
			人際關係: {
				current: this.generateSocialCurrent(baziAnalysis),
				future: this.generateSocialFuture(baziAnalysis),
			},
			桃花: {
				current: this.generateLoveLuckCurrent(baziAnalysis),
				future: this.generateLoveLuckFuture(baziAnalysis),
			},
			因緣: {
				current: this.generateDestinyCurrent(baziAnalysis),
				future: this.generateDestinyFuture(baziAnalysis),
			},
		};

		return analysisTemplates[concern] || analysisTemplates["工作"];
	}

	// 工作運勢分析
	static generateCareerCurrent(bazi) {
		const { yearElement, dayElement, strengthAnalysis } = bazi;

		let analysis = `根據你嘅八字分析，你係${yearElement}命人，`;

		if (yearElement === "金") {
			analysis +=
				"具有堅毅果斷嘅性格，適合從事需要決策和領導嘅工作。目前你嘅事業運處於";
			analysis += strengthAnalysis.strong ? "上升期，" : "調整期，";
			analysis += strengthAnalysis.strong
				? "是展現能力和爭取晉升嘅好時機。"
				: "需要耐心等待機會，現在重點係提升自己。";
		} else if (yearElement === "水") {
			analysis +=
				"聰明靈活，善於溝通，適合創意和服務行業。目前你嘅事業運";
			analysis += strengthAnalysis.strong
				? "流動性大，機會較多，"
				: "相對平穩，";
			analysis += strengthAnalysis.strong
				? "但要注意選擇最適合嘅方向。"
				: "適合穩紮穩打地發展。";
		} else if (yearElement === "木") {
			analysis +=
				"有創造力和成長性，適合新興行業和有發展空間嘅工作。目前";
			analysis += strengthAnalysis.strong
				? "正值成長期，"
				: "處於積累期，";
			analysis += strengthAnalysis.strong
				? "可以大膽嘗試新嘅發展方向。"
				: "需要更多學習和準備。";
		} else if (yearElement === "火") {
			analysis +=
				"熱情積極，有領導魅力，適合面對人群嘅工作。目前你嘅事業運";
			analysis += strengthAnalysis.strong ? "正旺，" : "需要控制，";
			analysis += strengthAnalysis.strong
				? "是推動重要項目和計劃嘅最佳時期。"
				: "避免衝動決定，要多聽取意見。";
		} else if (yearElement === "土") {
			analysis += "穩重可靠，適合需要責任心和耐性嘅工作。目前你嘅事業運";
			analysis += strengthAnalysis.strong
				? "基礎紮實，"
				: "需要更多耐性，";
			analysis += strengthAnalysis.strong
				? "可以考慮長期投資和規劃。"
				: "暫時避免大變動，專注現有工作。";
		}

		return analysis;
	}

	static generateCareerFuture(bazi) {
		const { yearElement, strengthAnalysis } = bazi;
		const currentYear = new Date().getFullYear();
		const nextFewYears = [
			currentYear + 1,
			currentYear + 2,
			currentYear + 3,
		];

		let future = "未來三年事業發展趨勢：\n\n";

		nextFewYears.forEach((year, index) => {
			const yearLuck = this.calculateYearLuck(year, bazi);
			future += `${year}年：${yearLuck.career}\n`;
		});

		future += `\n整體而言，作為${yearElement}命人，你嘅事業發展重點係：\n`;
		future += this.getCareerAdviceByElement(yearElement);

		return future;
	}

	// 風水解決方案
	static generateFengShuiSolutions(concern, bazi) {
		const solutions = {
			工作: this.getCareerFengShui(bazi),
			感情: this.getRelationshipFengShui(bazi),
			財運: this.getWealthFengShui(bazi),
			子女: this.getChildrenFengShui(bazi),
			人際關係: this.getSocialFengShui(bazi),
			桃花: this.getLoveLuckFengShui(bazi),
			因緣: this.getDestinyFengShui(bazi),
		};

		return solutions[concern] || solutions["工作"];
	}

	// 工作風水建議
	static getCareerFengShui(bazi) {
		const { yearElement } = bazi;

		let fengshui = `基於你嘅${yearElement}命特質，工作風水建議：\n\n`;

		if (yearElement === "金") {
			fengshui += `
**辦公桌風水：**
• 坐西朝東或坐東北朝西南（金命人嘅旺位）
• 桌上放置圓形金屬擺件（水晶球、金屬筆筒）
• 使用白色、金色文具和裝飾

**辦公室佈置：**
• 在右前方（白虎位）放一個小型金屬擺設
• 避免桌上有太多紅色物品（火克金）
• 可以放一盆白色花卉或多肉植物

**穿衣建議：**
• 多穿白色、米色、銀色嘅衣服
• 佩戴金屬飾品（手錶、項鍊）
• 避免全身紅色搭配`;
		} else if (yearElement === "水") {
			fengshui += `
**辦公桌風水：**
• 坐北朝南（水命人嘅本命位）
• 桌上可放小型流水擺設或藍色擺件
• 多用藍色、黑色文具

**辦公室佈置：**
• 在北方位置放一杯清水（每日更換）
• 可以放一個小魚缸或水生植物
• 避免桌面雜亂，保持整潔流暢

**穿衣建議：**
• 多穿藍色、黑色、深色系衣服
• 可以佩戴珍珠或水晶飾品
• 避免全身土黃色（土克水）`;
		}
		// 其他元素的風水建議...

		return fengshui;
	}

	// 時機建議
	static generateTimingAdvice(concern, bazi) {
		const currentYear = new Date().getFullYear();
		const currentMonth = new Date().getMonth() + 1;

		let timing = `基於你嘅八字和當前時運，時機建議：\n\n`;

		if (concern === "工作") {
			timing += this.getCareerTimingAdvice(
				bazi,
				currentYear,
				currentMonth
			);
		} else if (concern === "感情") {
			timing += this.getRelationshipTimingAdvice(
				bazi,
				currentYear,
				currentMonth
			);
		} else if (concern === "財運") {
			timing += this.getWealthTimingAdvice(
				bazi,
				currentYear,
				currentMonth
			);
		}

		return timing;
	}

	// 輔助方法
	static getYearElement(year) {
		const elements = [
			"金",
			"金",
			"水",
			"水",
			"木",
			"木",
			"火",
			"火",
			"土",
			"土",
		];
		return elements[year % 10];
	}

	static getDayElement(year, month, day) {
		// 簡化的日柱計算
		const totalDays = Math.floor(
			(new Date(year, month - 1, day) - new Date(1900, 0, 1)) /
				(1000 * 60 * 60 * 24)
		);
		const elements = [
			"甲木",
			"乙木",
			"丙火",
			"丁火",
			"戊土",
			"己土",
			"庚金",
			"辛金",
			"壬水",
			"癸水",
		];
		return elements[totalDays % 10];
	}

	static getPersonalityAnalysis(yearElement, dayElement) {
		// 根據年柱和日柱分析性格特質
		const personalities = {
			金: "性格堅毅果斷，有領導能力，做事有條理，但有時過於固執。",
			水: "聰明靈活，適應力強，善於溝通，但有時容易猶豫不決。",
			木: "積極進取，有創造力，樂觀向上，但有時急躁缺乏耐性。",
			火: "熱情開朗，有魅力，行動力強，但有時衝動欠考慮。",
			土: "穩重踏實，有責任心，值得信賴，但有時過於保守。",
		};

		return personalities[yearElement] || personalities["金"];
	}

	static getElementStrength(yearElement, dayElement, birthTime) {
		// 簡化的五行強弱判斷
		const hasTime = Boolean(birthTime);
		const strong = Math.random() > 0.5; // 實際應該根據複雜的八字計算

		return {
			strong,
			hasTime,
			description: strong ? "五行氣勢較旺" : "五行氣勢較弱",
		};
	}

	static calculateYearLuck(year, bazi) {
		// 簡化的流年運勢計算
		const yearElement = this.getYearElement(year);
		const userElement = bazi.yearElement;

		const relationships = {
			金水: "生助",
			水木: "生助",
			木火: "生助",
			火土: "生助",
			土金: "生助",
			金木: "克制",
			木土: "克制",
			土水: "克制",
			水火: "克制",
			火金: "克制",
		};

		const relationship = relationships[userElement + yearElement] || "平和";

		if (relationship === "生助") {
			return { career: "事業運勢上升，適合積極發展" };
		} else if (relationship === "克制") {
			return { career: "事業運勢有挑戰，宜保守發展" };
		} else {
			return { career: "事業運勢平穩，可穩步推進" };
		}
	}

	static getCareerAdviceByElement(element) {
		const advice = {
			金: "發揮領導才能，勇於承擔責任，適合管理和決策性工作。",
			水: "靈活運用溝通技巧，善用人脈關係，適合服務和創意性工作。",
			木: "把握成長機會，勇於創新嘗試，適合新興和發展性工作。",
			火: "發揮熱情和魅力，積極推動計劃，適合銷售和表演性工作。",
			土: "發揮穩重特質，建立長期規劃，適合財務和技術性工作。",
		};

		return advice[element] || advice["金"];
	}

	static getCareerTimingAdvice(bazi, year, month) {
		const { yearElement } = bazi;

		let advice = `**${year}年工作時機分析：**\n\n`;
		advice += `作為${yearElement}命人，`;

		if (month >= 3 && month <= 5) {
			advice += "春季（3-5月）是你嘅發展期，適合：\n";
			advice += "• 提出新嘅工作計劃和想法\n";
			advice += "• 尋求升職或轉崗機會\n";
			advice += "• 建立新嘅工作關係\n\n";
		}

		advice += "**最佳行動時機：**\n";
		advice += this.getBestActionTiming(bazi, year);

		return advice;
	}

	static getBestActionTiming(bazi, year) {
		// 根據用戶五行屬性計算最佳時機
		const { yearElement } = bazi;

		const timings = {
			金: "秋季（7-9月）和冬季初期（10-11月）",
			水: "冬季（12-2月）和春季初期（3-4月）",
			木: "春季（3-5月）和夏季初期（6月）",
			火: "夏季（6-8月）和秋季初期（9月）",
			土: "四季轉換期（3月、6月、9月、12月）",
		};

		return `根據你嘅${yearElement}命特質，最佳行動時機係${timings[yearElement]}。`;
	}

	// 生成針對具體問題的建議
	static generateSpecificAdvice(question, concern, bazi) {
		let advice = `**針對你嘅具體問題：「${question}」**\n\n`;

		if (concern === "工作") {
			if (question.includes("轉工") || question.includes("換工作")) {
				advice += this.getJobChangeAdvice(bazi);
			} else if (
				question.includes("創業") ||
				question.includes("做生意")
			) {
				advice += this.getBusinessAdvice(bazi);
			} else if (question.includes("升職") || question.includes("加薪")) {
				advice += this.getPromotionAdvice(bazi);
			} else {
				advice += this.getGeneralCareerAdvice(bazi);
			}
		}

		return advice;
	}

	static getJobChangeAdvice(bazi) {
		const { yearElement, strengthAnalysis } = bazi;

		let advice = "**轉工建議：**\n\n";

		if (strengthAnalysis.strong) {
			advice += `作為${yearElement}命人，你現在嘅運勢較旺，係轉工嘅好時機。建議：\n\n`;
			advice += "• 可以積極尋找更好嘅機會\n";
			advice += "• 選擇有發展前景嘅公司和職位\n";
			advice += "• 談薪時可以稍微進取啲\n";
			advice += "• 最好喺春夏季轉工（生氣較旺）\n\n";
		} else {
			advice += `你而家嘅運勢處於調整期，轉工要更謹慎。建議：\n\n`;
			advice += "• 除非現職有重大問題，否則建議觀望\n";
			advice += "• 如果一定要轉，選擇穩定性高嘅公司\n";
			advice += "• 薪酬要求唔好過高，重點係學習機會\n";
			advice += "• 最好等到下半年運勢好轉時再行動\n\n";
		}

		advice += `**適合${yearElement}命人嘅行業：**\n`;
		advice += this.getSuitableIndustries(bazi.yearElement);

		return advice;
	}

	static getSuitableIndustries(element) {
		const industries = {
			金: "• 金融投資、銀行保險\n• 機械製造、汽車工業\n• 珠寶首飾、精密儀器\n• 法律諮詢、會計審計",
			水: "• 貿易物流、國際業務\n• 傳媒廣告、創意設計\n• 旅遊酒店、餐飲服務\n• 清潔環保、水產漁業",
			木: "• 教育培訓、文化出版\n• 醫療保健、生技製藥\n• 農林園藝、環保能源\n• 服裝紡織、家具建材",
			火: "• 電子科技、通訊網絡\n• 娛樂傳媒、表演藝術\n• 餐飲烹飪、化工能源\n• 銷售行銷、公關活動",
			土: "• 房地產、建築工程\n• 農業畜牧、礦業開採\n• 倉儲物流、製造業\n• 政府機關、社會服務",
		};

		return industries[element] || industries["金"];
	}
}

export default ReportGenerator;

// CommonJS 導出（為了測試）
if (typeof module !== "undefined" && module.exports) {
	module.exports = { ReportGenerator };
}
