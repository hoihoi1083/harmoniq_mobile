import { NextResponse } from "next/server";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const { prompt, userInfo, wuxingData } = await request.json();

		// Use existing DeepSeek API key from environment
		const apiKey = process.env.DEEPSEEK_API_KEY;

		if (!apiKey) {
			console.warn("⚠️ DEEPSEEK_API_KEY not found, using mock data");
			return NextResponse.json({
				success: true,
				analysis: generateMockRelationshipAnalysis(
					userInfo,
					wuxingData
				),
				isAIGenerated: false,
			});
		}

		try {
			// Call DeepSeek API
			const response = await fetch(
				"https://api.deepseek.com/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
					body: JSON.stringify({
						model: "deepseek-chat",
						messages: [
							{
								role: "system",
								content:
									"你是一位專業的八字命理師，專精感情婚姻分析。請基於用戶的八字信息，提供準確、詳細的感情運勢分析。",
							},
							{
								role: "user",
								content: prompt,
							},
						],
						temperature: 0.7,
						max_tokens: 2500,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.text();
				console.error(
					"❌ DeepSeek API Error:",
					response.status,
					errorData
				);
				throw new Error(`DeepSeek API error: ${response.status}`);
			}

			const data = await response.json();
			const aiContent = data.choices[0]?.message?.content;

			if (!aiContent) {
				throw new Error("No content in AI response");
			}

			// Try to parse JSON from AI response
			let parsedAnalysis;
			try {
				// Extract JSON from code blocks if present
				const jsonMatch =
					aiContent.match(/```json\n([\s\S]*?)\n```/) ||
					aiContent.match(/```\n([\s\S]*?)\n```/);
				const jsonString = jsonMatch ? jsonMatch[1] : aiContent;
				parsedAnalysis = JSON.parse(jsonString);
			} catch (parseError) {
				console.warn(
					"⚠️ Failed to parse AI JSON response, using mock data"
				);
				throw new Error("Invalid JSON from AI");
			}

			// Validate required structure
			if (
				!parsedAnalysis.summary ||
				!parsedAnalysis.authenticity ||
				!parsedAnalysis.romanticCycles ||
				!parsedAnalysis.marriageRules
			) {
				console.warn(
					"⚠️ AI response missing required fields, using mock data"
				);
				throw new Error("Invalid response structure");
			}

			console.log("💕 Successfully generated AI relationship analysis");
			return NextResponse.json({
				success: true,
				analysis: parsedAnalysis,
				isAIGenerated: true,
			});
		} catch (apiError) {
			console.warn(
				"🔄 AI API failed, falling back to mock data:",
				apiError.message
			);
			return NextResponse.json({
				success: true,
				analysis: generateMockRelationshipAnalysis(
					userInfo,
					wuxingData
				),
				isAIGenerated: false,
				error: apiError.message,
			});
		}
	} catch (error) {
		console.error("💥 Relationship analysis API error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message,
			},
			{ status: 500 }
		);
	}
}

function generateMockRelationshipAnalysis(userInfo, wuxingData) {
	const birthDate = new Date(userInfo.birthDateTime);
	const currentYear = new Date().getFullYear();
	const age = currentYear - birthDate.getFullYear();
	const dayMaster = wuxingData.dayStem || "癸";
	const dayMasterElement = wuxingData.dayStemWuxing || "水";

	return {
		summary: {
			title: "殺星混雜，晚婚得良緣",
			description:
				"月干己土七殺為夫星，日支丑土藏殺，時柱壬子劫財，形成「殺星混雜」格局，婚戀需過濾爛桃花。",
		},
		authenticity: {
			profession: {
				title: "基本屬性",
				description:
					"正緣伴侶具七殺格，代表紀律、權威與責任感強烈，適合軍警、執法人員或外科醫師等需高度自律與決斷力的職業。此類人士能提供穩定保護，補足癸水日主的柔韌性，助感情長久。",
				warning: "注意事項：七殺過旺易嚴苛，需互補溫柔",
			},
			ageGap: {
				title: "年齡差距",
				description:
					"伴侶年長6-12歲，己土印星得火生助，利於中老年運勢發達，此差距助穩定感情，避免年輕衝動導致的波折。年長者帶來成熟智慧，平衡癸水的滲透性。",
				warning: "注意事項：差距過大易生代溝，定期溝通興趣",
			},
			meetingChance: {
				title: "相識契機",
				description:
					"2041年辛酉，辛金印星通關，酉金合局，利智慧交流，適合在學術會議、研討會或專業論壇相遇，透過共同興趣快速建立連結。",
				warning: "注意事項：酉金暗藏競爭，勿急於表白",
			},
		},
		romanticCycles: {
			"25歲前": {
				period: "25歲前",
				fortune: "丁卯運",
				dangerousYear: "2029己酉年：七殺透干",
				crisis: "遇激情戀情，但子酉破終分手",
				solution:
					"避開生肖馬者（午火增殺攻身）：午火增殺攻身；易放大衝突；分手後靜心1個月，勿衝動脫單。",
			},
			"35歲危機": {
				period: "35歲危機",
				fortune: "丙寅運",
				dangerousYear: "2037丁巳年：巳丑拱殺，易陷三角關係",
				crisis: "丁火生己火，巳丑拱金局，紆氣過旺；易推入第三者糾紛，影響婚姻穩定。",
				solution:
					"臥室懸掛高山流水畫（金生水）：選擇絲綢畫作，掛南牆；化解火熱，每日約會1次，重建信任。",
			},
			"45歲波動": {
				period: "45歲波動",
				fortune: "乙丑運",
				dangerousYear: "2047丁卯年：子卯刑剋，防財產糾紛",
				crisis: "丁火激木火，子水與西金相刑，易因金錢或產爭執，導致夫妻不和。",
				solution:
					"家中財位（東南角）放置聚寶盆（陶瓷，內放3枚銅錢）：穩財運，簽訂婚前協議，明確財產歸屬。",
			},
		},
		marriageRules: {
			bestYear: {
				title: "最佳婚年",
				year: "2033癸丑年（丑土夫宮到位）",
				description:
					"2033年癸水上旺，己土丑印星得火生利於中老年運勢發達，利金錢或產爭執，導致夫妻不和。應先記錄雙方共同目標，建立記錄整婚時間。",
			},
			taboos: {
				title: "相處禁忌",
				financial: {
					title: "禁止財務共有（壬水劫財奪財）",
					description:
						"因壬水劫財星奪財，建議分開管理財產，定期清理投資狀況，避免產權糾紛影響感情和諧。",
				},
				frequency: {
					title: "週末分房睡（緩解水火相激）",
					description:
						"水火五行有輕微相剋，週末分開睡覺能緩解衝突，每日約會1次，重建信任。",
				},
			},
			childrenFate: {
				title: "子女緣",
				timing: "2044甲子年得長子（子水祿神應期）",
				description:
					"子年利財祿，生子時機良好，甲子年天干地支都符合，子女聰明有智慧，多與學術或水相關行業。",
			},
		},
	};
}
