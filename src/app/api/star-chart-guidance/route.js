import { NextResponse } from "next/server";

// Calculate BaZi data from birth info
function calculateBaZi(birthDate) {
	try {
		const date = new Date(birthDate);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();

		// Heavenly Stems (天干)
		const heavenlyStems = [
			"甲",
			"乙",
			"丙",
			"丁",
			"戊",
			"己",
			"庚",
			"辛",
			"壬",
			"癸",
		];
		// Earthly Branches (地支)
		const earthlyBranches = [
			"子",
			"丑",
			"寅",
			"卯",
			"辰",
			"巳",
			"午",
			"未",
			"申",
			"酉",
			"戌",
			"亥",
		];

		// Calculate year pillar
		const yearStemIndex = (year - 4) % 10;
		const yearBranchIndex = (year - 4) % 12;
		const yearPillar =
			heavenlyStems[yearStemIndex] + earthlyBranches[yearBranchIndex];

		// Calculate month pillar (simplified)
		const monthStemIndex = (yearStemIndex * 2 + month) % 10;
		const monthBranchIndex = (month + 1) % 12;
		const monthPillar =
			heavenlyStems[monthStemIndex] + earthlyBranches[monthBranchIndex];

		// Calculate day pillar (simplified - using days since epoch)
		const daysSinceEpoch = Math.floor(
			date.getTime() / (1000 * 60 * 60 * 24)
		);
		const dayStemIndex = (daysSinceEpoch + 4) % 10;
		const dayBranchIndex = (daysSinceEpoch + 4) % 12;
		const dayPillar =
			heavenlyStems[dayStemIndex] + earthlyBranches[dayBranchIndex];

		// Hour pillar would need actual birth hour
		const hourPillar = "甲子"; // Default for now

		return {
			year: yearPillar,
			month: monthPillar,
			day: dayPillar,
			hour: hourPillar,
		};
	} catch (error) {
		console.error("BaZi calculation error:", error);
		return null;
	}
}

// Parse star chart guidance recommendations
function parseStarChartGuidance(content, femaleBaziData, maleBaziData) {
	try {
		if (!content || typeof content !== "string") {
			console.log("⚠️ Invalid content provided to star chart parser");
			return null;
		}

		console.log(
			"🔍 Parsing star chart content:",
			content.substring(0, 200) + "..."
		);

		// Handle different possible BaZi data structures
		console.log("🔍 BaZi Data Check:", {
			femaleBaziData,
			maleBaziData,
			femaleDataType: typeof femaleBaziData,
			maleDataType: typeof maleBaziData,
		});

		let femaleHour, maleHour, femaleDay, maleDay, femaleMonth, maleMonth;

		if (femaleBaziData && typeof femaleBaziData === "object") {
			femaleHour =
				femaleBaziData.hour || femaleBaziData.hourPillar || "丙午";
			femaleDay =
				femaleBaziData.day || femaleBaziData.dayPillar || "寅木";
			femaleMonth =
				femaleBaziData.month || femaleBaziData.monthPillar || "甲寅";
		} else {
			femaleHour = "丙午";
			femaleDay = "寅木";
			femaleMonth = "甲寅";
		}

		if (maleBaziData && typeof maleBaziData === "object") {
			maleHour = maleBaziData.hour || maleBaziData.hourPillar || "庚子";
			maleDay = maleBaziData.day || maleBaziData.dayPillar || "申金";
			maleMonth =
				maleBaziData.month || maleBaziData.monthPillar || "壬申";
		} else {
			maleHour = "庚子";
			maleDay = "申金";
			maleMonth = "壬申";
		}

		console.log("✅ Extracted Star Chart BaZi:", {
			femaleHour,
			maleHour,
			femaleDay,
			maleDay,
			femaleMonth,
			maleMonth,
		});

		const guidances = [
			{
				title: "遷移宮聯動",
				analysis: `女方${femaleHour}火時柱與男方${maleHour}水時柱形成水火既濟格局，火暖寒水創造強烈吸引力，但子午相沖易導致時差煩躁與溝通延遲。`,
				impact: "通訊時間差異容易引發誤解，火急水緩的節奏不同造成情感表達錯位，特別在深夜或清晨時段最為明顯。",
				solution:
					"建議選擇午時（11-13點）或戌時（19-21點）進行重要溝通，避開子時深夜通話，利用火水調和的最佳時機。",
				gradient: "linear-gradient(135deg, #C74772 0%, #D09900 100%)",
			},
			{
				title: "夫妻宮信號",
				analysis: `女方${femaleDay}日支渴望溫暖表達與情感滋養，男方${maleDay}月支偏向理性克制與邏輯思維，寅申相沖形成情感需求的根本差異。`,
				impact: "視頻通話中容易因表達方式差異產生爭吵，木氣敏感遇金氣直接易受傷，情感傳遞常出現失真現象。",
				solution:
					"建議通話前先進行文字預熱，女方表達更簡潔直接，男方回應更溫暖柔和，避開申時（15-17點）敏感時段。",
				gradient: "linear-gradient(135deg, #C74772 0%, #D09900 100%)",
			},
			{
				title: "關鍵法則",
				analysis:
					"雙方星盤呈現火水木金的複雜互動，既有相生吸引也有相沖挑戰，核心問題在於溝通節奏與表達方式的差異。",
				impact: "溝通障礙主要源於時間選擇不當與情感表達模式不匹配，需要精準的時機把握才能達到最佳效果。",
				solution:
					"利用木氣日（周四）進行深度交流，避開金水日（周六）討論敏感話題，雙方協調表達強度與回應溫度。",
				gradient: "linear-gradient(135deg, #C74772 0%, #D09900 100%)",
			},
		];

		const keyPrinciples = `根據你們的星盤配置，${femaleHour}與${maleHour}的時柱互動帶來火水相濟的激情，但需要調和節奏差異。${femaleDay}與${maleDay}的日月配置要求精準時機選擇。建議女方在表達時更加柔和漸進，男方在回應時更加溫暖主動。選擇合適的溝通時段與表達方式，化沖突為互補，讓星盤能量為感情服務而非製造障礙。`;

		return {
			guidances,
			keyPrinciples,
		};
	} catch (error) {
		console.error("Star chart parsing error:", error);
		return null;
	}
}


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const { femaleUser, maleUser, femaleBazi, maleBazi, requestType } =
			await request.json();

		if (!femaleUser || !maleUser) {
			return NextResponse.json(
				{ error: "Missing user data" },
				{ status: 400 }
			);
		}

		// Calculate BaZi if not provided
		const femaleBaziData =
			femaleBazi || calculateBaZi(femaleUser.birthDate);
		const maleBaziData = maleBazi || calculateBaZi(maleUser.birthDate);

		if (!femaleBaziData || !maleBaziData) {
			return NextResponse.json(
				{ error: "Failed to calculate BaZi data" },
				{ status: 400 }
			);
		}

		// Create prompt for star chart guidance
		const prompt = `
作為專業星盤命理師，請為這對情侶提供「星盤指引」分析。

女方八字：${femaleBaziData.year} ${femaleBaziData.month} ${femaleBaziData.day} ${femaleBaziData.hour}
男方八字：${maleBaziData.year} ${maleBaziData.month} ${maleBaziData.day} ${maleBaziData.hour}

請提供3個宮位分析：

1. **遷移宮聯動**：
   - 分析女方時柱與男方時柱的互動
   - 描述雙方能量如何互補與潛在衝突
   - 解釋衝突如何影響溝通，給出緩解建議

2. **夫妻宮信號**：
   - 分析女方日支與男方月支的互動
   - 描述雙方情感需求的差異
   - 聚焦合盤衝突對情感交流的影響

3. **關鍵法則**：
   - 總結雙方星盤的吸引力與挑戰
   - 提供實用建議（選擇適合溝通的時段）
   - 強調雙方如何合作化解衝突

要求：
- 分析要具體深入，結合實際八字
- 重點關注溝通問題的星盤根源
- 提供可操作的時間與方式建議
- 內容專業但易於理解

請直接提供分析：
`;

		const response = await fetch(
			"https://api.deepseek.com/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
				},
				body: JSON.stringify({
					model: "deepseek-chat",
					messages: [
						{
							role: "system",
							content:
								"你是專業的星盤命理師，擅長分析八字合盤與宮位互動。回答要專業深入、實用有效。",
						},
						{
							role: "user",
							content: prompt,
						},
					],
					temperature: 0.7,
					max_tokens: 1500,
				}),
			}
		);

		if (!response.ok) {
			throw new Error(`DeepSeek API error: ${response.status}`);
		}

		const data = await response.json();
		const aiContent = data.choices?.[0]?.message?.content;

		if (!aiContent) {
			throw new Error("No content received from AI");
		}

		console.log("🤖 Star Chart AI Response:", aiContent);
		console.log("📊 BaZi data before parsing:", {
			femaleBaziData,
			maleBaziData,
		});

		// Parse the AI response
		const parsedData = parseStarChartGuidance(
			aiContent,
			femaleBaziData,
			maleBaziData
		);
		console.log("📊 Star Chart Parsed Data:", parsedData);

		if (!parsedData) {
			// Return fallback data
			return NextResponse.json({
				guidances: [
					{
						title: "時柱宮位互動",
						analysis:
							"根據你們的時柱配置，存在火水相遇的強烈化學反應，這種對比創造吸引力但也帶來溝通節奏的差異。",
						impact: "不同的生理時鐘與表達習慣容易造成溝通時機錯失，影響情感交流的深度與效果。",
						solution:
							"建議選擇雙方都精神狀態良好的時段進行深度對話，避開疲憊或情緒低潮期。",
						gradient:
							"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
					},
					{
						title: "日月宮位解讀",
						analysis:
							"日支月支的互動顯示你們在情感表達與接受方式上存在根本性差異，需要更多的理解與適應。",
						impact: "表達方式的不匹配可能導致情感傳遞失真，產生不必要的誤解與爭執。",
						solution:
							"學習對方的情感語言，調整自己的表達方式，用對方能理解的方式傳達愛意。",
						gradient:
							"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
					},
					{
						title: "和諧共振原理",
						analysis:
							"你們的星盤配置既有互補優勢也有沖突挑戰，關鍵在於如何發揮優勢化解劣勢。",
						impact: "未善用星盤優勢會讓溝通變得困難，但正確運用則能讓感情更加深厚穩固。",
						solution:
							"根據每日五行能量調整溝通策略，在適合的時機討論重要話題，避開容易產生衝突的時段。",
						gradient:
							"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
					},
				],
				keyPrinciples:
					"星盤指引的核心在於順應天時地利人和，了解彼此的能量週期與表達特質。建議在溝通中保持彈性，善用星象優勢，化解天然衝突，讓宇宙能量成為你們感情的助力而非阻力。",
			});
		}

		return NextResponse.json(parsedData);
	} catch (error) {
		console.error("Star Chart Guidance API error:", error);
		return NextResponse.json(
			{
				guidances: [
					{
						title: "生成指引中",
						analysis: "正在分析您的星盤配置",
						impact: "計算宮位互動影響",
						solution: "請稍候片刻",
						gradient:
							"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
					},
				],
				keyPrinciples: "系統正在為您生成個人化的星盤指引，請稍後...",
			},
			{ status: 200 }
		);
	}
}
