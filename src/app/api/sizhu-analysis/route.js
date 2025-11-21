import { NextResponse } from "next/server";

const API_URL = "https://api.deepseek.com/chat/completions";
const API_KEY = process.env.DEEPSEEK_API_KEY;

// Life stage mapping for each pillar
const lifeStageMapping = {
	年柱: "童年",
	月柱: "青年",
	日柱: "中年",
	時柱: "晚年",
};


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const { userInfo, pillarType, pillarData } = await request.json();

		console.log("🎯 Sizhu Analysis API called with:", {
			pillarType,
			userInfo: userInfo ? "present" : "missing",
			pillarDataKeys: Object.keys(pillarData || {}),
		});

		if (!userInfo || !pillarType || !pillarData) {
			console.log("❌ Missing required data");
			return NextResponse.json(
				{ error: "Missing required data" },
				{ status: 400 }
			);
		}

		const lifeStage = lifeStageMapping[pillarType];
		const currentYear = new Date().getFullYear();
		const birthYear = new Date(userInfo.birthDateTime).getFullYear();
		const age = currentYear - birthYear;

		// Extract the specific 天干地支 combination from pillarData
		let tianganDizhi = "";

		console.log("🔍 Raw pillar data:", JSON.stringify(pillarData, null, 2));

		// Get the first key-value pair which should contain the main pillar info
		const pillarEntries = Object.entries(pillarData);
		if (pillarEntries.length > 0) {
			console.log("📋 Pillar entries found:", pillarEntries.length);

			// Look for keys that contain both 天干 and 地支 elements or direct 干支 combinations
			for (const [key, value] of pillarEntries) {
				console.log(
					"🔎 Checking key:",
					key,
					"value:",
					typeof value === "string" ? value.substring(0, 100) : value
				);

				// Try to extract 干支 from the key itself
				const ganZhiMatch = key.match(
					/[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]/
				);
				if (ganZhiMatch) {
					tianganDizhi = ganZhiMatch[0];
					console.log("✅ Found 干支 in key:", tianganDizhi);
					break;
				}

				// Try to extract 干支 from the value if it's a string
				if (typeof value === "string") {
					const valueGanZhiMatch = value.match(
						/[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]/
					);
					if (valueGanZhiMatch) {
						tianganDizhi = valueGanZhiMatch[0];
						console.log("✅ Found 干支 in value:", tianganDizhi);
						break;
					}
				}
			}

			// If not found, try to construct from separate 天干 and 地支 entries
			if (!tianganDizhi && pillarEntries.length >= 2) {
				console.log(
					"🔧 Trying to construct 干支 from separate entries..."
				);
				const tianganInfo = pillarEntries.find(([key]) =>
					key.includes("天干")
				);
				const dizhiInfo = pillarEntries.find(([key]) =>
					key.includes("地支")
				);

				if (tianganInfo && dizhiInfo) {
					// Extract characters that represent 干支
					const tiangan =
						tianganInfo[0].match(/[甲乙丙丁戊己庚辛壬癸]/)?.[0] ||
						tianganInfo[1].match(/[甲乙丙丁戊己庚辛壬癸]/)?.[0] ||
						"";
					const dizhi =
						dizhiInfo[0].match(/[子丑寅卯辰巳午未申酉戌亥]/)?.[0] ||
						dizhiInfo[1].match(/[子丑寅卯辰巳午未申酉戌亥]/)?.[0] ||
						"";
					tianganDizhi = tiangan + dizhi;
					console.log(
						"🔧 Constructed 干支:",
						tianganDizhi,
						"from",
						tiangan,
						"+",
						dizhi
					);
				}
			}
		}

		// Fallback if still not found - use examples based on pillar type
		if (!tianganDizhi) {
			console.log(
				"⚠️ Could not extract 干支, using example for",
				pillarType
			);
			const examples = {
				年柱: "甲申",
				月柱: "丁巳",
				日柱: "丁酉",
				時柱: "庚子",
			};
			tianganDizhi = examples[pillarType] || "甲子";
		}

		console.log("🎯 Final 干支 combination:", tianganDizhi);

		// Create detailed prompt for AI analysis
		const systemPrompt = `你是一位專業的八字命理師，請根據用戶的${pillarType}${tianganDizhi}組合生成白話直斷分析。

用戶信息：
- 性別：${userInfo.gender}
- 出生年份：${birthYear}年
- 當前年齡：${age}歲
- ${pillarType}：${tianganDizhi}
- 人生階段：${lifeStage}

請按照以下格式生成分析，參考這個範例風格：

年柱甲申：竞争与规则并存的童年
白话解释：你小时候的环境（家庭或学校）存在明显的竞争压力，比如兄弟姐妹比较成绩，或父母用严格标准要求你。同时生活中规则感很强，例如必须按时回家、作业错一题罚抄十遍等。
举例：就像玩游戏时，别人轻松过关，你却总被要求"先写完数学题才能玩"，这种约束让你早早就学会在压力下找方法。
智慧如地下暗流：指你天生会暗中观察、动脑筋解决问题。比如被父母禁止看电视，你会偷偷用电脑查资料完成作业来争取自由时间——这种"钻空子"不是叛逆，而是懂得灵活应对规则。

請返回JSON格式：
{
  "pillarCombination": "${tianganDizhi}",
  "lifeStage": "${lifeStage}",
  "analysis": {
    "title": "${pillarType}${tianganDizhi}：[關鍵詞描述]的${lifeStage}",
    "whiteExplanation": {
      "description": "白話解釋：[100-150字的生活場景說明，描述這個人生階段的整體環境和特點，要具體提到家庭、學校或工作環境的真實情況]",
      "example": "舉例：就像[具體生活場景例子，要生動有趣，讓人有共鳴感]，這種[環境特點]讓你[學會了什麼能力或特質]。"
    },
    "wisdomFlow": {
      "concept": "[命理概念]如地下暗流/[其他比喻]的[特質]",
      "description": "指你[天賦特質或能力描述]。比如[具體例子說明如何運用這種智慧]——這種[行為特點]不是[負面誤解]，而是[正面解釋：智慧靈活應對的能力]。"
    }
  }
}

分析要求：
1. 必須基於${tianganDizhi}的真實命理特性（天干地支的五行生克關係）
2. ${lifeStage}階段的特點要符合人生發展規律
3. 内容生活化，用現代人能理解的場景和例子
4. 語言親切自然，避免過於玄奧的術語
5. 每個例子都要具體可感，讓人產生共鳴
6. 智慧流的部分要體現命理的深層智慧，但用比喻方式表達
7. 返回標準JSON格式，不要包含markdown標記`;

		const userPrompt = `請為這個用戶生成${pillarType}（${lifeStage}階段）的白話直斷分析。`;

		console.log("🤖 Calling DeepSeek API with:", {
			pillarType,
			lifeStage,
			tianganDizhi,
		});

		const response = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model: "deepseek-chat",
				messages: [
					{ role: "system", content: systemPrompt },
					{ role: "user", content: userPrompt },
				],
				max_tokens: 2000,
				temperature: 0.7,
			}),
		});

		console.log("📡 DeepSeek API response status:", response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.log("❌ DeepSeek API error:", response.status, errorText);
			throw new Error(
				`DeepSeek API error: ${response.status} - ${errorText}`
			);
		}

		const data = await response.json();
		const aiContent = data.choices?.[0]?.message?.content;

		if (!aiContent) {
			console.log("❌ No content received from AI");
			throw new Error("No content received from AI");
		}

		console.log(
			"🎯 AI Content received (first 300 chars):",
			aiContent.substring(0, 300)
		);

		// Parse AI response
		let parsedAnalysis;
		try {
			// Remove any potential markdown code blocks
			const cleanContent = aiContent
				.replace(/```json\n?|```\n?/g, "")
				.trim();
			parsedAnalysis = JSON.parse(cleanContent);
			console.log("✅ Successfully parsed AI response");
		} catch (parseError) {
			console.error("❌ JSON parsing failed:", parseError.message);
			console.log("🔍 Raw AI content that failed to parse:", aiContent);

			// Try to create a more accurate fallback based on the 干支 combination
			const keywordMap = {
				甲申: "竞争与规则并存",
				丁巳: "才华耀眼但容易三分热度",
				丁酉: "能力与压力互相成就",
				庚子: "权威与责任并重",
			};

			const keyword = keywordMap[tianganDizhi] || "成长与探索";

			parsedAnalysis = {
				pillarCombination: tianganDizhi,
				lifeStage,
				analysis: {
					title: `${pillarType}${tianganDizhi}：${keyword}的${lifeStage}`,
					whiteExplanation: {
						description:
							"白話解釋：這個階段的環境充滿了挑戰與機遇，你在家庭和學校中學會了適應各種要求和期待，培養出獨特的應對方式。",
						example:
							"舉例：就像面對規則時，你會找到巧妙的方法來平衡個人意願和外界期望，這種智慧讓你在壓力中仍能保持自己的特色。",
					},
					wisdomFlow: {
						concept: "智慧如地下暗流的積累",
						description:
							"指你在生活中逐漸培養出獨特的處事智慧。比如學會在看似限制的環境中找到發展空間——這種能力不是妥協，而是智慧的靈活運用。",
					},
				},
			};
		}

		console.log(
			"🎉 Returning analysis for",
			pillarType,
			"with title:",
			parsedAnalysis.analysis.title
		);

		return NextResponse.json({
			success: true,
			analysis: parsedAnalysis,
		});
	} catch (error) {
		console.error("❌ Error in sizhu-analysis API:", error.message);
		console.error("🔍 Full error:", error);

		// Return enhanced fallback analysis
		const lifeStage = lifeStageMapping[pillarType] || "人生階段";
		const examples = {
			年柱: "甲申",
			月柱: "丁巳",
			日柱: "丁酉",
			時柱: "庚子",
		};
		const tianganDizhi = examples[pillarType] || "甲子";

		const keywordMap = {
			甲申: "竞争与规则并存",
			丁巳: "才华耀眼但容易三分热度",
			丁酉: "能力与压力互相成就",
			庚子: "权威与责任并重",
		};

		const keyword = keywordMap[tianganDizhi] || "成长与探索";

		return NextResponse.json({
			success: true,
			analysis: {
				pillarCombination: tianganDizhi,
				lifeStage,
				analysis: {
					title: `${pillarType}${tianganDizhi}：${keyword}的${lifeStage}`,
					whiteExplanation: {
						description: `白話解釋：在${lifeStage}階段，你的環境特色讓你培養出獨特的適應能力。無論是家庭教育還是學校經歷，都在無形中塑造了你的性格特質。`,
						example: `舉例：就像在成長過程中學會觀察環境變化並靈活應對，這種經歷讓你具備了在複雜情況下保持平衡的智慧。`,
					},
					wisdomFlow: {
						concept: `${tianganDizhi}智慧的深層體現`,
						description: `指你天生具備的洞察力和應變能力。比如能在限制中找到機會，在壓力中保持創新——這種特質不是偶然，而是${tianganDizhi}組合賦予你的獨特天賦。`,
					},
				},
			},
		});
	}
}
