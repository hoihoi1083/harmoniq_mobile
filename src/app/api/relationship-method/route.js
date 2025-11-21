import { NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Enhanced BaZi data access with fallbacks
const getBaziInfo = (baziData, field, fallback = "未知") => {
	if (!baziData) return fallback;
	return baziData[field] || fallback;
};

const getBaziPillars = (pillarsData) => {
	if (!pillarsData || !Array.isArray(pillarsData)) {
		return {
			year: { heavenly: "甲", earthly: "子" },
			month: { heavenly: "乙", earthly: "丑" },
			day: { heavenly: "丙", earthly: "寅" },
			hour: { heavenly: "丁", earthly: "卯" },
		};
	}

	return {
		year: pillarsData[0] || { heavenly: "甲", earthly: "子" },
		month: pillarsData[1] || { heavenly: "乙", earthly: "丑" },
		day: pillarsData[2] || { heavenly: "丙", earthly: "寅" },
		hour: pillarsData[3] || { heavenly: "丁", earthly: "卯" },
	};
};

const parseRelationshipMethodResponse = (text) => {
	console.log("📋 Parsing relationship method response:", text);

	try {
		// Clean the text first
		let cleanedText = text
			.replace(/```json\n?/g, "")
			.replace(/```\n?/g, "")
			.trim();

		// First, try to parse as JSON
		const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			try {
				const parsedData = JSON.parse(jsonMatch[0]);
				if (
					parsedData.dailyRituals &&
					Array.isArray(parsedData.dailyRituals)
				) {
					// Validate that we have at least some rituals with proper structure
					const validRituals = parsedData.dailyRituals.filter(
						(ritual) =>
							ritual.title &&
							ritual.steps &&
							Array.isArray(ritual.steps) &&
							ritual.principle
					);

					if (validRituals.length > 0) {
						console.log(
							"✅ Successfully parsed JSON response with",
							validRituals.length,
							"rituals"
						);
						return {
							dailyRituals: validRituals.map((ritual) => ({
								...ritual,
								gradient:
									ritual.gradient ||
									"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
							})),
							communicationAdvice:
								parsedData.communicationAdvice ||
								"建議增加共同活動時間，調整溝通表達方式，建立規律的情感交流儀式。",
						};
					}
				}
			} catch (e) {
				console.log(
					"❌ JSON parsing failed, falling back to text parsing:",
					e.message
				);
			}
		}

		// Fallback to text parsing
		const dailyRituals = [];
		const lines = text.split("\n").filter((line) => line.trim());

		let currentRitual = null;
		let currentSteps = [];
		let currentPrinciple = "";

		for (const line of lines) {
			const trimmed = line.trim();

			// Skip empty lines and metadata
			if (!trimmed || trimmed.includes("```") || trimmed.startsWith("#"))
				continue;

			// Detect ritual title (with ▸ marker)
			if (
				trimmed.includes("▸") &&
				!trimmed.includes("步驟") &&
				!trimmed.includes("原理")
			) {
				// Save previous ritual
				if (currentRitual) {
					dailyRituals.push({
						title: currentRitual,
						steps: [...currentSteps],
						principle: currentPrinciple,
						gradient:
							"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
					});
				}

				// Start new ritual
				currentRitual = trimmed.replace(/[▸*\-]/g, "").trim();
				currentSteps = [];
				currentPrinciple = "";
				continue;
			}

			// Detect steps (numbered 1, 2, 3 or ①②③)
			if (/^[①②③\d+]/.test(trimmed) || trimmed.includes("步驟")) {
				const stepText = trimmed
					.replace(/^[①②③\d+][\.)]\s*/, "")
					.replace(/步驟[:：]/g, "")
					.trim();
				if (stepText && !stepText.includes("原理")) {
					currentSteps.push(stepText);
				}
				continue;
			}

			// Detect principle
			if (
				trimmed.includes("原理") ||
				trimmed.includes("八字") ||
				trimmed.includes("五行") ||
				trimmed.includes("金生水")
			) {
				currentPrinciple = trimmed
					.replace(/原理[:：]/g, "")
					.replace(/解釋[:：]/g, "")
					.trim();
				continue;
			}

			// If we have a current ritual and this looks like content, add it
			if (currentRitual && trimmed.length > 10) {
				if (
					!currentPrinciple &&
					(trimmed.includes("能量") ||
						trimmed.includes("循環") ||
						trimmed.includes("調和"))
				) {
					currentPrinciple = trimmed;
				} else if (currentSteps.length < 3) {
					currentSteps.push(trimmed);
				}
			}
		}

		// Don't forget the last ritual
		if (currentRitual) {
			dailyRituals.push({
				title: currentRitual,
				steps: [...currentSteps],
				principle: currentPrinciple,
				gradient: "linear-gradient(135deg, #C74772 0%, #D09900 100%)",
			});
		}

		// Extract communication advice
		let communicationAdvice =
			"基於八字分析，建議增加共同活動，調整表達方式為正向溝通模式，建立規律儀式來促進能量流動。重點在於打破沉寂模式，重建互動默契。";
		const adviceMatch = text.match(
			/(?:一般溝通建議|溝通建議)[:：]?\s*([^]*?)(?=\n\n|\n$|$)/i
		);
		if (adviceMatch) {
			communicationAdvice = adviceMatch[1].trim();
		}

		const result = {
			dailyRituals:
				dailyRituals.length > 0
					? dailyRituals
					: [
							{
								title: "晨光同頻儀式",
								steps: [
									"每日清晨面向東方，一起深呼吸3分鐘",
									"輪流分享夢境或當日期待，各限時2分鐘",
									"雙手相握默念正向話語，開啟美好一天",
								],
								principle:
									"利用晨光木氣上升，透過金生水能量循環，調和八字中的沉寂氣場",
								gradient:
									"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
							},
						],
			communicationAdvice,
		};

		console.log("📊 Final parsed relationship method result:", result);
		return result;
	} catch (error) {
		console.error("❌ Error parsing relationship method response:", error);

		return {
			dailyRituals: [
				{
					title: "基礎能量同調儀式",
					steps: [
						"每日選定時間一起深呼吸調息",
						"分享當日感受與期待",
						"以正向話語結束互動",
					],
					principle: "透過規律儀式調和能量，針對八字特質進行關係優化",
					gradient:
						"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
				},
			],
			communicationAdvice:
				"建議增加共同活動時間，調整溝通表達方式，建立規律的情感交流儀式，重點在於打破沉悶模式，重建關係活力。",
		};
	}
};


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const requestData = await request.json();
		console.log(
			"💫 Relationship Method API - Received request:",
			requestData
		);

		const {
			femaleUser,
			maleUser,
			femaleBazi,
			maleBazi,
			femalePillars,
			malePillars,
		} = requestData;

		if (!femaleUser || !maleUser) {
			return NextResponse.json(
				{ error: "Missing user data" },
				{ status: 400 }
			);
		}

		// Get BaZi information with fallbacks
		const femaleBaziInfo = getBaziInfo(femaleBazi, "name", "female");
		const maleBaziInfo = getBaziInfo(maleBazi, "name", "male");

		const femalePillarsInfo = getBaziPillars(femalePillars);
		const malePillarsInfo = getBaziPillars(malePillars);

		console.log("📊 BaZi Data:", {
			femaleBaziInfo,
			maleBaziInfo,
			femalePillarsInfo,
			malePillarsInfo,
		});

		// Create structured prompt for relationship method
		const prompt = `你是專業的命理感情顧問，請為這對情侶設計具體的相處心法。

**情侶資料：**
女方：${femaleUser.name}
- 天干地支：年柱 ${femalePillarsInfo.year.heavenly}${femalePillarsInfo.year.earthly}、月柱 ${femalePillarsInfo.month.heavenly}${femalePillarsInfo.month.earthly}、日柱 ${femalePillarsInfo.day.heavenly}${femalePillarsInfo.day.earthly}、時柱 ${femalePillarsInfo.hour.heavenly}${femalePillarsInfo.hour.earthly}

男方：${maleUser.name}  
- 天干地支：年柱 ${malePillarsInfo.year.heavenly}${malePillarsInfo.year.earthly}、月柱 ${malePillarsInfo.month.heavenly}${malePillarsInfo.month.earthly}、日柱 ${malePillarsInfo.day.heavenly}${malePillarsInfo.day.earthly}、時柱 ${malePillarsInfo.hour.heavenly}${malePillarsInfo.hour.earthly}

請以JSON格式回應，包含恰好3個日常儀式：

{
  "dailyRituals": [
    {
      "title": "晨光同頻儀式",
      "steps": [
        "每日清晨面向東方，一起深呼吸3分鐘",
        "輪流分享夢境或當日期待，各限時2分鐘", 
        "雙手相握默念正向話語，開啟美好一天"
      ],
      "principle": "利用晨光木氣上升，透過金生水能量循環，調和八字中的沉寂氣場",
      "gradient": "linear-gradient(135deg, #C74772 0%, #D09900 100%)"
    },
    {
      "title": "午後能量平衡法",
      "steps": [
        "步驟1",
        "步驟2", 
        "步驟3"
      ],
      "principle": "午後原理解釋",
      "gradient": "linear-gradient(135deg, #C74772 0%, #D09900 100%)"
    },
    {
      "title": "夜晚和諧儀式", 
      "steps": [
        "步驟1",
        "步驟2",
        "步驟3"
      ],
      "principle": "夜晚原理解釋",
      "gradient": "linear-gradient(135deg, #C74772 0%, #D09900 100%)"
    }
  ],
  "communicationAdvice": "溝通建議內容"
}

**重要要求：**
- 必須包含恰好3個儀式（早上、下午、晚上各一個）
- 每個儀式的steps陣列必須包含3個具體步驟
- 所有儀式要自然不尷尬，適合日常實踐
- principle要結合五行生剋與八字分析
- 針對他們的八字特質個性化設計

請分析他們的八字配置，提供針對性的相處心法。`;

		console.log("📤 Sending prompt to DeepSeek:", prompt);

		// Make API call to DeepSeek
		const response = await fetch(DEEPSEEK_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
			},
			body: JSON.stringify({
				model: "deepseek-chat",
				messages: [
					{
						role: "system",
						content:
							"你是專業的命理感情顧問，擅長將八字分析與日常相處技巧結合，提供實用的關係改善建議。",
					},
					{
						role: "user",
						content: prompt,
					},
				],
				max_tokens: 2000,
				temperature: 0.7,
			}),
		});

		if (!response.ok) {
			console.error(
				"❌ DeepSeek API error:",
				response.status,
				response.statusText
			);
			throw new Error(`DeepSeek API error: ${response.status}`);
		}

		const data = await response.json();
		console.log("✅ DeepSeek API response:", data);

		const aiResponse = data.choices?.[0]?.message?.content || "";
		console.log("🤖 AI Response:", aiResponse);

		// Parse the response
		const parsedResult = parseRelationshipMethodResponse(aiResponse);
		console.log("📋 Parsed relationship method result:", parsedResult);

		return NextResponse.json(parsedResult);
	} catch (error) {
		console.error("❌ Relationship Method API error:", error);

		// Return fallback data on error
		return NextResponse.json({
			dailyRituals: [
				{
					title: "晨光能量同頻儀式",
					steps: [
						"每日清晨6:30-7:00，面向東方站立3分鐘，深呼吸調息",
						"輪流分享昨夜夢境或今日期待，時間各限2分鐘",
						"以雙手交握結束，默念「木氣生發，愛意流轉」三次",
					],
					principle:
						"利用晨光木氣上升時刻，透過金生水→水生木的能量循環，調和八字中的沉寂氣場，重啟一日活力",
					gradient:
						"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
				},
				{
					title: "午後土金平衡茶禪",
					steps: [
						"下午3-4點選用陶瓷茶具（土），沖泡白茶或烏龍（金氣茶品）",
						"無言靜坐品茶5分鐘，感受彼此存在能量",
						"輪流說出對方今日一個優點，用「我感謝你...」開頭",
					],
					principle:
						"午後土金時段最適合穩定關係能量，透過土生金→金生水循環，化解過度理性的溝通模式",
					gradient:
						"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
				},
				{
					title: "夜晚水火調和儀式",
					steps: [
						"睡前點燃紅色蠟燭（火元素），旁邊放置水晶球（水元素）",
						"相視而坐，輪流說出今日最困擾與最開心的事各一件",
						"以溫暖擁抱結束，心中默念「水火既濟，情深意長」",
					],
					principle:
						"夜晚水氣旺盛配合火光，形成水火既濟卦象，專門針對八字能量沉寂核心進行深度調和",
					gradient:
						"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
				},
			],
			communicationAdvice:
				"基於八字分析，建議增加「元素感受日」活動（每週選一天專注體驗某種五行元素），調整表達方式為「先讚美後建議」模式，建立每晚「感恩三件事」分享習慣。重點是透過規律儀式打破能量沉寂，用溫和方式重建情感連結，讓關係在穩定中逐步升溫。",
		});
	}
}
