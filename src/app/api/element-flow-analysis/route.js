import { NextRequest, NextResponse } from "next/server";
import getWuxingData from "../../../lib/nayin.js";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const body = await request.json();
		const { userInfo } = body;

		if (!userInfo) {
			return NextResponse.json(
				{ error: "Missing user information" },
				{ status: 400 }
			);
		}

		// Get comprehensive element distribution
		const calculateElementDistribution = (userInfo) => {
			if (!userInfo?.birthDateTime) return null;

			try {
				const wuxingData = getWuxingData(
					new Date(userInfo.birthDateTime),
					userInfo.gender
				);

				const elementCounts = {
					金: 0,
					木: 0,
					水: 0,
					火: 0,
					土: 0,
				};

				// Count stems (weight 3)
				const stemElements = [
					wuxingData.yearStemWuxing,
					wuxingData.monthStemWuxing,
					wuxingData.dayStemWuxing,
					wuxingData.hourStemWuxing,
				];

				stemElements.forEach((element) => {
					if (elementCounts[element] !== undefined) {
						elementCounts[element] += 3;
					}
				});

				// Count branches (weight 2)
				const branchElements = [
					wuxingData.yearBranchWuxing,
					wuxingData.monthBranchWuxing,
					wuxingData.dayBranchWuxing,
					wuxingData.hourBranchWuxing,
				];

				branchElements.forEach((element) => {
					if (elementCounts[element] !== undefined) {
						elementCounts[element] += 2;
					}
				});

				// Count hidden stems (weight 1)
				const hiddenStemsData = [
					{
						key: "yearBranchHiddenStems",
						data: wuxingData.yearBranchHiddenStems,
					},
					{
						key: "monthBranchHiddenStems",
						data: wuxingData.monthBranchHiddenStems,
					},
					{
						key: "dayBranchHiddenStems",
						data: wuxingData.dayBranchHiddenStems,
					},
					{
						key: "hourBranchHiddenStems",
						data: wuxingData.hourBranchHiddenStems,
					},
				];

				hiddenStemsData.forEach(({ data }) => {
					if (Array.isArray(data)) {
						data.forEach((stem) => {
							if (
								stem.element &&
								elementCounts[stem.element] !== undefined
							) {
								// Fixed weight of 1 for all hidden stems
								elementCounts[stem.element] += 1;
							}
						});
					}
				});

				return {
					elementCounts,
					wuxingData,
				};
			} catch (error) {
				console.error("Error calculating element distribution:", error);
				return null;
			}
		};

		const distributionResult = calculateElementDistribution(userInfo);
		if (!distributionResult) {
			return NextResponse.json(
				{ error: "Failed to calculate element distribution" },
				{ status: 500 }
			);
		}

		const { elementCounts, wuxingData } = distributionResult;

		// Debug: Check if API key exists
		if (!process.env.API_KEY) {
			console.error("API_KEY environment variable is not set");
			return NextResponse.json(
				{ error: "API configuration error" },
				{ status: 500 }
			);
		}

		// Prepare detailed prompt for AI analysis
		const prompt = `
請根據以下用戶完整八字信息和五行分佈，深度分析五行流通阻礙點。

用戶信息：
- 性別: ${userInfo.gender}
- 出生年月日: ${userInfo.year || new Date(userInfo.birthDateTime).getFullYear()}年${userInfo.month || new Date(userInfo.birthDateTime).getMonth() + 1}月${userInfo.day || new Date(userInfo.birthDateTime).getDate()}日
- 出生時間: ${userInfo.hour || new Date(userInfo.birthDateTime).getHours()}時

完整八字信息：
- 年柱: ${wuxingData.year} (${wuxingData.yearStem}${wuxingData.yearBranch})
- 月柱: ${wuxingData.month} (${wuxingData.monthStem}${wuxingData.monthBranch})  
- 日柱: ${wuxingData.day} (${wuxingData.dayStem}${wuxingData.dayBranch}) - 日主：${wuxingData.dayStem}${wuxingData.dayStemWuxing}
- 時柱: ${wuxingData.hour} (${wuxingData.hourStem}${wuxingData.hourBranch})

五行分佈（綜合天干、地支、藏干）：
- 金: ${elementCounts.金.toFixed(2)}
- 木: ${elementCounts.木.toFixed(2)} 
- 水: ${elementCounts.水.toFixed(2)}
- 火: ${elementCounts.火.toFixed(2)}
- 土: ${elementCounts.土.toFixed(2)}

請基於以上真實數據，分析五行流通的具體阻礙點：

1. **分析五行生克關係**：根據實際五行強弱，找出能量流通的瓶頸
2. **識別關鍵問題**：哪些五行過旺或不足造成流通不暢
3. **生活化影響**：如何在實際生活中表現這些阻礙

請返回精準的JSON格式分析，包含3個主要阻礙點：

{
  "flowObstacles": [
    {
      "title": "阻礙點標題（如：金水相剋導致思維阻滯）",
      "description": "詳細描述該阻礙點的五行機理和影響（150字左右）",
      "lifeImpact": "在現實生活中的具體表現和影響（100字左右）",
      "color": "red"
    },
    {
      "title": "第二個阻礙點標題",
      "description": "詳細分析",
      "lifeImpact": "生活影響",
      "color": "purple"
    },
    {
      "title": "第三個阻礙點標題", 
      "description": "詳細分析",
      "lifeImpact": "生活影響",
      "color": "orange"
    }
  ]
}

要求：
1. 必須基於提供的真實五行數據進行分析
2. 避免通用化描述，要個人化和具體
3. 結合日主${wuxingData.dayStem}${wuxingData.dayStemWuxing}的特質
4. 返回有效JSON格式，不包含markdown標記
`;

		// Make request to DeepSeek API
		console.log(
			"Making request to DeepSeek API for element flow analysis..."
		);
		const response = await fetch(
			"https://api.deepseek.com/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
				body: JSON.stringify({
					model: "deepseek-chat",
					messages: [
						{
							role: "system",
							content:
								"你是一位專業的命理分析師，精通八字命理和五行流通分析。請根據用戶的真實八字數據分析五行流通阻礙點。返回有效的JSON格式，不要包含任何markdown標記。",
						},
						{
							role: "user",
							content: prompt,
						},
					],
					temperature: 0.7,
					max_tokens: 2000,
					response_format: { type: "json_object" },
				}),
			}
		);

		console.log("DeepSeek API response status:", response.status);
		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				"DeepSeek API Error:",
				response.status,
				response.statusText,
				errorText
			);
			return NextResponse.json(
				{ error: "Failed to get AI analysis", details: errorText },
				{ status: 500 }
			);
		}

		const data = await response.json();
		let analysisContent = data.choices?.[0]?.message?.content;

		if (!analysisContent) {
			console.error("No content received from DeepSeek API");
			return NextResponse.json(
				{ error: "No analysis content received" },
				{ status: 500 }
			);
		}

		console.log(
			"Received flow analysis content, length:",
			analysisContent.length
		);

		// Clean and parse JSON response
		analysisContent = analysisContent.trim();

		// Remove markdown code block markers if present
		if (analysisContent.startsWith("```json")) {
			analysisContent = analysisContent
				.replace(/^```json\s*/, "")
				.replace(/\s*```$/, "");
		} else if (analysisContent.startsWith("```")) {
			analysisContent = analysisContent
				.replace(/^```\s*/, "")
				.replace(/\s*```$/, "");
		}

		let analysis;
		try {
			analysis = JSON.parse(analysisContent);
		} catch (parseError) {
			console.error("JSON Parse Error:", parseError);

			// Fallback: Return structured default analysis
			return NextResponse.json({
				success: true,
				analysis: {
					flowObstacles: generateFallbackObstacles(elementCounts),
				},
				elementCounts,
				timestamp: new Date().toISOString(),
			});
		}

		// Validate analysis structure
		if (!analysis.flowObstacles || !Array.isArray(analysis.flowObstacles)) {
			console.error("Invalid analysis structure:", analysis);
			return NextResponse.json({
				success: true,
				analysis: {
					flowObstacles: generateFallbackObstacles(elementCounts),
				},
				elementCounts,
				timestamp: new Date().toISOString(),
			});
		}

		return NextResponse.json({
			success: true,
			analysis: analysis,
			elementCounts,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Element Flow Analysis API Error:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: error.message },
			{ status: 500 }
		);
	}
}

// Fallback function to generate basic obstacles when AI fails
function generateFallbackObstacles(elementCounts) {
	const obstacles = [];
	const sortedElements = Object.entries(elementCounts).sort(
		([, a], [, b]) => b - a
	);
	const strongest = sortedElements[0];
	const weakest = sortedElements[4];

	// Obstacle 1: Strongest element imbalance
	if (strongest && strongest[1] > 15) {
		obstacles.push({
			title: `${strongest[0]}元素過盛阻礙`,
			description: `${strongest[0]}元素過於強勢（${strongest[1].toFixed(1)}），壓制其他元素的正常流通，造成五行循環不暢，影響整體能量平衡。`,
			lifeImpact: `在生活中容易表現為過度專注某一領域，缺乏靈活性和適應能力，需要適當調節和平衡。`,
			color: "red",
		});
	}

	// Obstacle 2: Weakest element deficiency
	if (weakest && weakest[1] < 5) {
		obstacles.push({
			title: `${weakest[0]}元素不足障礙`,
			description: `${weakest[0]}元素嚴重不足（${weakest[1].toFixed(1)}），無法發揮應有的調節作用，導致相關生克關係失衡。`,
			lifeImpact: `影響與${weakest[0]}元素相關的生活領域，建議通過外在方式補強該元素的能量。`,
			color: "purple",
		});
	}

	// Obstacle 3: General flow issue
	obstacles.push({
		title: "五行流通節奏失調",
		description:
			"整體五行分佈不均衡，生克制化關係未能形成良性循環，需要調整以促進能量順暢流通。",
		lifeImpact:
			"可能在決策和行動上出現猶豫不決或過於衝動的情況，建議培養更好的節奏感。",
		color: "orange",
	});

	return obstacles.slice(0, 3);
}
