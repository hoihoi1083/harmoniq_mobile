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

const parseFengShuiTransformationResponse = (text) => {
	console.log("📋 Parsing feng shui transformation response:", text);

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
					parsedData.transformations &&
					Array.isArray(parsedData.transformations)
				) {
					// Validate the structure
					const validTransformations =
						parsedData.transformations.filter(
							(t) =>
								t.title &&
								t.steps &&
								Array.isArray(t.steps) &&
								t.principle
						);

					if (validTransformations.length > 0) {
						console.log("✅ Successfully parsed JSON response");
						return {
							transformations: validTransformations.map((t) => ({
								...t,
								gradient:
									t.gradient ||
									"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
							})),
							actionPrinciple:
								parsedData.actionPrinciple ||
								"風水轉化的核心是順應五行生剋，針對具體問題進行環境調整。",
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
		const transformations = [];
		const lines = text.split("\n").filter((line) => line.trim());

		let currentTransformation = null;
		let currentSteps = [];
		let currentPrinciple = "";

		for (const line of lines) {
			const trimmed = line.trim();

			// Skip empty lines and metadata
			if (!trimmed || trimmed.includes("```") || trimmed.startsWith("#"))
				continue;

			// Detect transformation title (with ✦ marker)
			if (
				trimmed.includes("✦") &&
				!trimmed.includes("步驟") &&
				!trimmed.includes("原理")
			) {
				// Save previous transformation
				if (currentTransformation) {
					transformations.push({
						title: currentTransformation,
						steps: [...currentSteps],
						principle: currentPrinciple,
						gradient:
							"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
					});
				}

				// Start new transformation
				currentTransformation = trimmed.replace(/[✦*\-]/g, "").trim();
				currentSteps = [];
				currentPrinciple = "";
				continue;
			}

			// Detect steps
			if (
				trimmed.includes("步驟") ||
				trimmed.includes("行動") ||
				/^\d+[\.)]\s*/.test(trimmed)
			) {
				const stepText = trimmed
					.replace(/^\d+[\.)]\s*/, "")
					.replace(/步驟[:：]/g, "")
					.replace(/行動[:：]/g, "")
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
				trimmed.includes("五行")
			) {
				currentPrinciple = trimmed
					.replace(/原理[:：]/g, "")
					.replace(/解釋[:：]/g, "")
					.trim();
				continue;
			}

			// If we have a current transformation and this looks like content, add it
			if (currentTransformation && trimmed.length > 10) {
				if (
					!currentPrinciple &&
					(trimmed.includes("相生") ||
						trimmed.includes("化解") ||
						trimmed.includes("平衡"))
				) {
					currentPrinciple = trimmed;
				} else if (currentSteps.length < 4) {
					currentSteps.push(trimmed);
				}
			}
		}

		// Don't forget the last transformation
		if (currentTransformation) {
			transformations.push({
				title: currentTransformation,
				steps: [...currentSteps],
				principle: currentPrinciple,
				gradient: "linear-gradient(135deg, #C74772 0%, #D09900 100%)",
			});
		}

		// Extract action principle
		let actionPrinciple =
			"風水轉化的核心是順應五行生剋，針對具體問題進行環境調整。通過精準的方位佈局與元素配置，可以在短時間內平衡氣場，改善感情能量流動。";
		const principleMatch = text.match(
			/轉化原理[:：]?\s*([^]*?)(?=\n\n|\n$|$)/i
		);
		if (principleMatch) {
			actionPrinciple = principleMatch[1].trim();
		}

		const result = {
			transformations:
				transformations.length > 0
					? transformations
					: [
							{
								title: "能量場調和法",
								steps: [
									"在臥室東南角放置綠色植物，激活木氣",
									"配合暖黃色檯燈，形成木火相生",
									"每日晚間共同在此區域靜心5分鐘",
								],
								principle:
									"根據八字配置，用木火相生平衡過旺的金水元素，創造和諧感情氛圍",
								gradient:
									"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
							},
						],
			actionPrinciple,
		};

		console.log("📊 Final parsed feng shui transformation result:", result);
		return result;
	} catch (error) {
		console.error(
			"❌ Error parsing feng shui transformation response:",
			error
		);

		return {
			transformations: [
				{
					title: "基礎能量平衡法",
					steps: [
						"在住所中心放置五行水晶陣",
						"每日點燃檀香淨化空間",
						"配合輕音樂創造和諧氛圍",
					],
					principle: "五行平衡是風水的基礎，通過能量調和改善感情關係",
					gradient:
						"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
				},
			],
			actionPrinciple:
				"風水轉化注重實用性與速效性，針對個人八字特質進行環境調整，達到氣場平衡的效果。",
		};
	}
};


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const requestData = await request.json();
		console.log(
			"🔥 Feng Shui Transformation API - Received request:",
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

		// Create structured prompt for feng shui transformation
		const prompt = `你是專業的風水命理師，請為這對情侶設計具體的風水轉化方案。

**情侶資料：**
女方：${femaleUser.name}
- 天干地支：年柱 ${femalePillarsInfo.year.heavenly}${femalePillarsInfo.year.earthly}、月柱 ${femalePillarsInfo.month.heavenly}${femalePillarsInfo.month.earthly}、日柱 ${femalePillarsInfo.day.heavenly}${femalePillarsInfo.day.earthly}、時柱 ${femalePillarsInfo.hour.heavenly}${femalePillarsInfo.hour.earthly}

男方：${maleUser.name}  
- 天干地支：年柱 ${malePillarsInfo.year.heavenly}${malePillarsInfo.year.earthly}、月柱 ${malePillarsInfo.month.heavenly}${malePillarsInfo.month.earthly}、日柱 ${malePillarsInfo.day.heavenly}${malePillarsInfo.day.earthly}、時柱 ${malePillarsInfo.hour.heavenly}${malePillarsInfo.hour.earthly}

請以JSON格式回應，包含3-4個風水轉化方案：

{
  "transformations": [
    {
      "title": "方案一：臥室桃花位佈局",
      "steps": [
        "在臥室西南方（流年桃花位）放置雙數粉色水晶或鮮花",
        "床頭櫃成對擺放圓形燈具，每晚點亮2小時",
        "懸掛雙鳥圖案畫作（需成對出現，如鴛鴦、喜鵲）"
      ],
      "principle": "本方案以「火土相生」為主軸（粉晶/紅花/檀香屬火，陶瓷/五帝錢屬土），透過空間五行連環相生（火→土→金→水→木），針對情侶常見的「金木交戰」（爭執）與「水火未濟」（情緒起伏）設計速效調和點。",
      "gradient": "linear-gradient(135deg, #C74772 0%, #D09900 100%)"
    }
  ],
  "actionPrinciple": "整體轉化原理說明"
}

**重要要求：**
- 每個方案的title要有「方案一：」、「方案二：」等編號
- steps陣列必須包含3個具體可執行的步驟
- principle要解釋五行原理和速效性
- 不要在steps中包含「**行動步驟**」這種標題文字，直接寫具體步驟
- 所有內容要根據他們的八字配置個性化設計

請分析他們的八字五行特點，設計針對性的風水調整方案。`;

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
							"你是專業的風水命理師，擅長將八字分析與風水佈局結合，提供實用的居家風水建議。",
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
		const parsedResult = parseFengShuiTransformationResponse(aiResponse);
		console.log("📋 Parsed feng shui transformation result:", parsedResult);

		return NextResponse.json(parsedResult);
	} catch (error) {
		console.error("❌ Feng Shui Transformation API error:", error);

		// Return fallback data on error
		return NextResponse.json({
			transformations: [
				{
					title: "東南木氣激活陣",
					steps: [
						"在臥室東南角放置綠色植物（如富貴竹或綠蘿）",
						"搭配暖黃色檯燈，每晚開燈2小時",
						"週三木氣旺日進行植物澆水儀式",
					],
					principle:
						"木生火→火生土，針對八字中金過旺的問題，用木氣調和，激活感情溫暖能量",
					gradient:
						"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
				},
				{
					title: "西南坤土穩固法",
					steps: [
						"在客廳西南方位鋪設暖色地毯（紅褐或土黃色）",
						"放置陶瓷花瓶配乾花，象徵土元素穩定",
						"每日傍晚在此區域共同靜坐5分鐘",
					],
					principle:
						"坤土主婚姻，火生土相生循環，化解八字中水過旺的冷漠，建立感情穩固基礎",
					gradient:
						"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
				},
				{
					title: "中宮太極平衡陣",
					steps: [
						"在房屋中心位置放置五色水晶（白金、綠木、黑水、紅火、黃土）",
						"每週日進行五行平衡淨化，順時針擺放調整",
						"配合檀香或沉香薰香，提升整體氣場",
					],
					principle:
						"中宮統領八方，五行俱全達到陰陽平衡，解決八字配置中的相沖問題",
					gradient:
						"linear-gradient(135deg, #C74772 0%, #D09900 100%)",
				},
			],
			actionPrinciple:
				"風水轉化的核心是順應五行生剋，針對八字的具體問題進行環境調整。通過精準的方位佈局與元素配置，可以在短時間內平衡氣場，改善感情能量流動。建議按照優先順序執行，先從最需要的元素開始調整，循序漸進達到整體和諧。",
		});
	}
}
