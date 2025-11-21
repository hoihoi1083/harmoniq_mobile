import { NextRequest, NextResponse } from "next/server";
import getWuxingData from "../../../lib/nayin.js";

// 🚨 GLOBAL API CACHE - Prevent duplicate calls
const globalApiCache = new Map();
const pendingRequests = new Map();

// Generate cache key from user info
function generateCacheKey(userInfo) {
	if (!userInfo?.birthDateTime) return null;
	const date = new Date(userInfo.birthDateTime);
	return `wuxing_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${userInfo.gender || ""}`;
}


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	const requestId = Math.random().toString(36).substring(2, 15);
	let cacheKey = null;
	let resolvePending = null;
	let rejectPending = null;

	try {
		const body = await request.json();
		const { userInfo } = body;

		if (!userInfo) {
			return NextResponse.json(
				{ error: "Missing user information" },
				{ status: 400 }
			);
		}

		// 🚨 GLOBAL DUPLICATE PREVENTION
		cacheKey = generateCacheKey(userInfo);
		console.log(`[${requestId}] Cache key: ${cacheKey}`);

		// Check if result already cached
		if (cacheKey && globalApiCache.has(cacheKey)) {
			console.log(
				`[${requestId}] 🎯 RETURNING CACHED RESULT for ${cacheKey}`
			);
			const cachedResult = globalApiCache.get(cacheKey);
			return NextResponse.json({
				...cachedResult,
				cached: true,
				requestId: requestId,
				originalRequestId: cachedResult.requestId,
			});
		}

		// Check if request is already pending
		if (cacheKey && pendingRequests.has(cacheKey)) {
			console.log(
				`[${requestId}] 🚨 REQUEST ALREADY PENDING for ${cacheKey}, waiting...`
			);
			try {
				const pendingResult = await pendingRequests.get(cacheKey);
				console.log(
					`[${requestId}] ✅ Got result from pending request`
				);
				return NextResponse.json({
					...pendingResult,
					waitedForResult: true,
					requestId: requestId,
					originalRequestId: pendingResult.requestId,
				});
			} catch (error) {
				console.log(
					`[${requestId}] ⚠️ Pending request failed, proceeding with new request`
				);
				pendingRequests.delete(cacheKey);
			}
		}

		// Create pending promise for this request
		if (cacheKey) {
			const pendingPromise = new Promise((resolve, reject) => {
				resolvePending = resolve;
				rejectPending = reject;
			});
			pendingRequests.set(cacheKey, pendingPromise);
			console.log(
				`[${requestId}] 🔄 Created pending request for ${cacheKey}`
			);
		}

		// Use the proper wuxing calculation from nayin.js
		const calculateTenGodsElements = (userInfo) => {
			if (!userInfo?.birthDateTime) return {};

			const wuxingData = getWuxingData(
				userInfo.birthDateTime,
				userInfo.gender
			);

			const dayStem = wuxingData.dayStem;
			const dayStemElement = wuxingData.dayStemWuxing;

			const elementCycle = ["木", "火", "土", "金", "水"];
			const currentIndex = elementCycle.indexOf(dayStemElement);

			const tenGodsElements = {
				正印: elementCycle[(currentIndex + 4) % 5],
				財星: elementCycle[(currentIndex + 2) % 5],
				官殺: elementCycle[(currentIndex + 3) % 5],
				劫比: dayStemElement,
				食傷: elementCycle[(currentIndex + 1) % 5],
			};

			return {
				dayStem,
				dayStemElement,
				tenGodsElements,
				wuxingData,
			};
		};

		const calculationResult = calculateTenGodsElements(userInfo);
		const { tenGodsElements, wuxingData } = calculationResult;

		if (!process.env.API_KEY) {
			console.error(
				`[${requestId}] API_KEY environment variable is not set`
			);
			return NextResponse.json(
				{ error: "API configuration error" },
				{ status: 500 }
			);
		}

		// OPTIMIZED PROMPT - Reduced complexity and length
		const prompt = `
根據用戶八字信息，提供十神分析：

用戶信息：
- 性別: ${userInfo.gender}
- 出生: ${new Date(userInfo.birthDateTime).getFullYear()}年${new Date(userInfo.birthDateTime).getMonth() + 1}月${new Date(userInfo.birthDateTime).getDate()}日 ${new Date(userInfo.birthDateTime).getHours()}時
- 日主：${calculationResult.dayStem}${calculationResult.dayStemElement}

十神元素：正印${tenGodsElements.正印}、財星${tenGodsElements.財星}、官殺${tenGodsElements.官殺}、劫比${tenGodsElements.劫比}、食傷${tenGodsElements.食傷}

請返回簡潔的JSON格式分析：

{
  "tenGodsAnalysis": {
    "正印": {
      "name": "正印",
      "element": "${tenGodsElements.正印}",
      "meaning": "主學業、貴人、長輩緣",
      "expression": "個性化描述（80字以內）",
      "realManifestation": ["表現1（30字以內）", "表現2（30字以內）"],
      "warnings": {
        "title": "注意事項",
        "items": ["注意1（20字以內）", "注意2（20字以內）"]
      },
      "coreConflicts": {
        "title": "核心議題",
        "conflicts": [
          {
            "title": "主要挑戰",
            "color": "red",
            "description": "簡要描述（60字以內）",
            "example": "具體例子（40字以內）"
          },
          {
            "title": "發展機會",
            "color": "purple", 
            "description": "簡要描述（60字以內）",
            "example": "具體例子（40字以內）"
          },
          {
            "title": "平衡之道",
            "color": "green",
            "description": "簡要描述（60字以內）",
            "example": "具體例子（40字以內）"
          }
        ]
      }
    },
    "財星": {
      "name": "財星",
      "element": "${tenGodsElements.財星}",
      "meaning": "主財富、物質、配偶",
      "expression": "個性化描述（80字以內）",
      "realManifestation": ["表現1", "表現2"],
      "warnings": {"title": "注意事項", "items": ["注意1", "注意2"]},
      "coreConflicts": {
        "title": "核心議題",
        "conflicts": [
          {"title": "主要挑戰", "color": "red", "description": "簡要描述", "example": "例子"},
          {"title": "發展機會", "color": "purple", "description": "簡要描述", "example": "例子"},
          {"title": "平衡之道", "color": "green", "description": "簡要描述", "example": "例子"}
        ]
      }
    },
    "官殺": {
      "name": "官殺",
      "element": "${tenGodsElements.官殺}",
      "meaning": "主事業、權威、責任",
      "expression": "個性化描述（80字以內）",
      "realManifestation": ["表現1", "表現2"],
      "warnings": {"title": "注意事項", "items": ["注意1", "注意2"]},
      "coreConflicts": {
        "title": "核心議題",
        "conflicts": [
          {"title": "主要挑戰", "color": "red", "description": "簡要描述", "example": "例子"},
          {"title": "發展機會", "color": "purple", "description": "簡要描述", "example": "例子"},
          {"title": "平衡之道", "color": "green", "description": "簡要描述", "example": "例子"}
        ]
      }
    },
    "劫比": {
      "name": "劫比",
      "element": "${tenGodsElements.劫比}",
      "meaning": "主朋友、競爭、協作",
      "expression": "個性化描述（80字以內）",
      "realManifestation": ["表現1", "表現2"],
      "warnings": {"title": "注意事項", "items": ["注意1", "注意2"]},
      "coreConflicts": {
        "title": "核心議題",
        "conflicts": [
          {"title": "主要挑戰", "color": "red", "description": "簡要描述", "example": "例子"},
          {"title": "發展機會", "color": "purple", "description": "簡要描述", "example": "例子"},
          {"title": "平衡之道", "color": "green", "description": "簡要描述", "example": "例子"}
        ]
      }
    },
    "食傷": {
      "name": "食傷",
      "element": "${tenGodsElements.食傷}",
      "meaning": "主創意、表達、子女",
      "expression": "個性化描述（80字以內）",
      "realManifestation": ["表現1", "表現2"],
      "warnings": {"title": "注意事項", "items": ["注意1", "注意2"]},
      "coreConflicts": {
        "title": "核心議題",
        "conflicts": [
          {"title": "主要挑戰", "color": "red", "description": "簡要描述", "example": "例子"},
          {"title": "發展機會", "color": "purple", "description": "簡要描述", "example": "例子"},
          {"title": "平衡之道", "color": "green", "description": "簡要描述", "example": "例子"}
        ]
      }
    }
  },
  "lifeAdvice": {
    "tips": [
      {
        "title": "建議1標題",
        "content": "簡潔建議內容（60字以內）",
        "example": "應用例子（30字以內）"
      },
      {
        "title": "建議2標題",
        "content": "簡潔建議內容（60字以內）",
        "example": "應用例子（30字以內）"
      },
      {
        "title": "建議3標題",
        "content": "簡潔建議內容（60字以內）",
        "example": "應用例子（30字以內）"
      }
    ]
  }
}

要求：
1. 返回純JSON，無markdown標記
2. 內容簡潔實用，避免冗長描述
3. 每個十神必須有3個conflicts
4. 生活建議要實用具體
`;

		// OPTIMIZED API CALL - Different timeouts for server vs local
		const controller = new AbortController();
		const apiTimeout =
			process.env.NODE_ENV === "production" ? 25000 : 60000; // 25s prod, 60s dev
		const timeoutId = setTimeout(() => {
			console.log(
				`🚨 DeepSeek API timeout reached (${apiTimeout}ms), aborting request`
			);
			controller.abort();
		}, apiTimeout);

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
								"你是命理分析師。返回簡潔的JSON格式分析，避免冗長描述。重點是準確性和實用性。",
						},
						{
							role: "user",
							content: prompt,
						},
					],
					temperature: 0.3, // Reduced for more consistent output
					max_tokens: 3000, // Reduced from 8000 to 3000
					response_format: { type: "json_object" },
				}),
				signal: controller.signal,
			}
		);

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`[${requestId}] DeepSeek API Error:`,
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
			console.error(
				`[${requestId}] No content received from DeepSeek API`
			);
			return NextResponse.json(
				{ error: "No analysis content received" },
				{ status: 500 }
			);
		}

		// Clean JSON response
		analysisContent = analysisContent.trim();
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
			console.error(`[${requestId}] JSON parse error:`, parseError);
			// Return fallback analysis
			return NextResponse.json(
				{
					analysis: generateFallbackAnalysis(tenGodsElements),
					aiGenerated: false,
					contentType: "fallback-data",
				},
				{ status: 200 }
			);
		}

		// Validate structure
		if (!analysis.tenGodsAnalysis) {
			console.error(
				`[${requestId}] Invalid analysis structure:`,
				analysis
			);
			return NextResponse.json(
				{ error: "Invalid analysis structure" },
				{ status: 500 }
			);
		}

		const result = {
			success: true,
			analysis: analysis,
			aiGenerated: true,
			contentType: "ai-generated",
			timestamp: new Date().toISOString(),
			requestId: requestId,
		};

		// 🎯 CACHE THE SUCCESSFUL RESULT
		if (cacheKey) {
			globalApiCache.set(cacheKey, result);
			console.log(`[${requestId}] ✅ CACHED result for ${cacheKey}`);

			// Resolve pending promise
			if (resolvePending) {
				resolvePending(result);
				pendingRequests.delete(cacheKey);
				console.log(
					`[${requestId}] ✅ Resolved pending promise for ${cacheKey}`
				);
			}
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error(
			`[${requestId || "unknown"}] Wuxing Analysis API Error:`,
			error
		);

		// 🚨 CLEAN UP ON ERROR - use variables from outer scope
		if (cacheKey && pendingRequests.has(cacheKey)) {
			if (rejectPending) {
				rejectPending(error);
			}
			pendingRequests.delete(cacheKey);
			console.log(
				`[${requestId}] 🚨 Cleaned up pending request on error`
			);
		}

		// Return fallback analysis instead of error for server reliability
		console.log(
			`[${requestId}] 🔄 Returning fallback analysis due to server error`
		);
		const fallbackAnalysis = generateFallbackAnalysis(
			calculationResult?.tenGodsElements || {}
		);

		return NextResponse.json({
			success: true,
			analysis: fallbackAnalysis,
			aiGenerated: false,
			contentType: "server-fallback",
			timestamp: new Date().toISOString(),
			requestId: requestId,
		});
	}
}

// Simplified fallback analysis
function generateFallbackAnalysis(tenGodsElements) {
	const createBasicGodAnalysis = (godName, element) => ({
		name: godName,
		element: element,
		meaning: getTenGodMeaning(godName),
		expression: `${godName}(${element})在您的命格中展現獨特特質`,
		realManifestation: ["正在分析", "個人化分析準備中"],
		warnings: {
			title: `${godName}需要注意的方面`,
			items: ["平衡發展", "適度調節"],
		},
		coreConflicts: {
			title: `${godName}的核心議題`,
			conflicts: [
				{
					title: "平衡挑戰",
					color: "red",
					description: "需要在不同需求間找到平衡",
					example: "日常決策中的選擇困境",
				},
				{
					title: "發展機會",
					color: "purple",
					description: "善用天賦特質創造機會",
					example: "發揮個人優勢獲得成長",
				},
				{
					title: "整合智慧",
					color: "green",
					description: "結合理性與感性做出決定",
					example: "在變化中保持內在穩定",
				},
			],
		},
	});

	return {
		tenGodsAnalysis: {
			正印: createBasicGodAnalysis("正印", tenGodsElements.正印),
			財星: createBasicGodAnalysis("財星", tenGodsElements.財星),
			官殺: createBasicGodAnalysis("官殺", tenGodsElements.官殺),
			劫比: createBasicGodAnalysis("劫比", tenGodsElements.劫比),
			食傷: createBasicGodAnalysis("食傷", tenGodsElements.食傷),
		},
		lifeAdvice: {
			tips: [
				{
					title: "平衡發展",
					content: "保持生活各方面的平衡，避免過度偏重某一領域",
					example: "工作與生活的時間分配",
				},
				{
					title: "順應天性",
					content: "了解並發揮自己的天賦特質，順勢而為",
					example: "在適合的環境中展現才能",
				},
				{
					title: "持續學習",
					content: "保持開放心態，從經驗中學習成長",
					example: "從挫折中汲取智慧",
				},
			],
		},
	};
}

function getTenGodMeaning(godName) {
	const meanings = {
		正印: "主學業、貴人、長輩緣",
		財星: "主財富、物質、配偶",
		官殺: "主事業、權威、責任",
		劫比: "主朋友、競爭、協作",
		食傷: "主創意、表達、子女",
	};
	return meanings[godName] || "主要特質";
}
