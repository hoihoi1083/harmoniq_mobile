import { NextResponse } from "next/server";
import {
	generateCacheKey,
	getCachedResult,
	waitForPendingRequest,
	createPendingRequest,
	cacheResult,
	resolvePendingRequest,
	rejectPendingRequest,
} from "../../../lib/apiCache.js";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	const requestId = Math.random().toString(36).substring(2, 15);
	let cacheKey = null;
	let resolvePending = null;
	let rejectPending = null;

	try {
		// Check if request has a body
		const requestText = await request.text();
		if (!requestText) {
			console.error("Empty request body received");
			return NextResponse.json(
				{ error: "Empty request body" },
				{ status: 400 }
			);
		}

		// Parse JSON safely
		let body;
		try {
			body = JSON.parse(requestText);
		} catch (parseError) {
			console.error(
				"JSON parse error:",
				parseError.message,
				"Body:",
				requestText
			);
			return NextResponse.json(
				{ error: "Invalid JSON in request body" },
				{ status: 400 }
			);
		}

		const { pillar, userInfo } = body;

		if (!pillar || !userInfo) {
			return NextResponse.json(
				{ error: "Missing required parameters: pillar or userInfo" },
				{ status: 400 }
			);
		}

		// 🚨 GLOBAL CACHE IMPLEMENTATION
		cacheKey = generateCacheKey("comprehensive-advice", userInfo, {
			pillar,
		});
		console.log(`[${requestId}] Cache key: ${cacheKey}`);

		// Check if result already cached
		const cachedResult = getCachedResult(cacheKey, requestId);
		if (cachedResult) {
			return NextResponse.json(cachedResult);
		}

		// Check if request is already pending
		const pendingResult = await waitForPendingRequest(cacheKey, requestId);
		if (pendingResult) {
			return NextResponse.json(pendingResult);
		}

		// Create pending promise for this request
		const pendingHandlers = createPendingRequest(cacheKey, requestId);
		resolvePending = pendingHandlers.resolvePending;
		rejectPending = pendingHandlers.rejectPending;

		const prompt = `你是資深的八字命理師，需要根據用戶的${pillar}信息，提供綜合調理與人生建議。

用戶信息：
- 姓名：${userInfo.name}
- 性別：${userInfo.gender === "male" ? "男" : "女"}
- 出生日期：${userInfo.birthDate}
- 出生時間：${userInfo.birthTime}
- 出生地點：${userInfo.location}
- ${pillar}：${pillar}相關的命理信息

請從以下角度提供綜合人生建議：

1. **事業發展建議**
   - 適合的事業方向和發展策略
   - 事業發展的關鍵時機和注意事項

2. **健康養生要點**
   - 根據命理特質的養生建議
   - 預防疾病和保持健康的方法

3. **財運管理智慧**
   - 理財和投資的建議
   - 增強財運的方法

4. **感情關係指引**
   - 感情發展的建議和注意事項
   - 維繫良好感情關係的要點

5. **人生規劃方向**
   - 人生不同階段的重點規劃
   - 實現人生目標的策略

請以專業、關懷的語調提供建議，每個要點都要實用且具有指導意義。
返回格式必須是純JSON，包含以下結構：
{
    "careerDevelopment": "事業發展建議",
    "healthWellness": "健康養生要點",
    "wealthManagement": "財運管理智慧",
    "relationshipGuidance": "感情關係指引",
    "lifeDirection": "人生規劃方向"
}`;

		// Try to call DeepSeek API
		try {
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
							role: "user",
							content: prompt,
						},
					],
					temperature: 0.7,
					max_tokens: 1200,
				}),
			});

			if (!response.ok) {
				throw new Error(`DeepSeek API error: ${response.status}`);
			}

			const data = await response.json();
			const content = data.choices[0]?.message?.content;

			if (!content) {
				throw new Error("No content received from DeepSeek API");
			}

			// Clean the response - remove markdown formatting if present
			let cleanedContent = content;
			if (content.includes("```json")) {
				cleanedContent = content
					.replace(/```json\s*/g, "")
					.replace(/\s*```/g, "");
			} else if (content.includes("```")) {
				cleanedContent = content
					.replace(/```\s*/g, "")
					.replace(/\s*```/g, "");
			}

			// Try to parse JSON response
			let analysisResult;
			try {
				analysisResult = JSON.parse(cleanedContent);
			} catch (parseError) {
				console.error("Error parsing AI response:", parseError);
				console.error("Raw content:", content);
				console.error("Cleaned content:", cleanedContent);
				throw new Error("Invalid JSON response from AI");
			}

			// Validate required fields
			const requiredFields = [
				"careerDevelopment",
				"healthWellness",
				"wealthManagement",
				"relationshipGuidance",
				"lifeDirection",
			];
			for (const field of requiredFields) {
				if (!analysisResult[field]) {
					throw new Error(`Missing required field: ${field}`);
				}
			}

			const result = {
				success: true,
				analysis: analysisResult,
				requestId: requestId,
				aiGenerated: true,
				timestamp: new Date().toISOString(),
			};

			// 🎯 CACHE THE SUCCESSFUL RESULT
			cacheResult(cacheKey, result, requestId);
			resolvePendingRequest(cacheKey, result, requestId, resolvePending);

			return NextResponse.json(result);
		} catch (aiError) {
			console.error("AI API Error:", aiError);

			// Fallback content based on pillar
			const fallbackContent = {
				年柱: {
					careerDevelopment:
						"年柱代表早期發展基礎，建議選擇能發揮創意和熱情的工作。適合從基層做起，紮實累積經驗。重視學習機會，為未來發展奠定基礎。",
					healthWellness:
						"注意心血管和神經系統的健康。保持規律的作息時間，多做戶外運動。年輕時養成良好的飲食習慣，避免過度熬夜和壓力。",
					wealthManagement:
						"理財觀念需要從年輕時培養，建議採用穩健的投資策略。避免高風險投資，重視儲蓄習慣的建立。學會記帳和預算管理。",
					relationshipGuidance:
						"感情方面較為純真，容易全心投入。建議保持理性，不要過於急躁。學會觀察對方的真實性格，建立穩固的感情基礎。",
					lifeDirection:
						"人生規劃應該注重基礎建設，包括教育、技能和人際關係。設定清晰的短期和長期目標，保持學習的心態，為未來發展做好準備。",
				},
				月柱: {
					careerDevelopment:
						"月柱影響事業發展的中期階段，適合團隊合作和管理職位。善於溝通協調，可以考慮人力資源、公關或諮詢類工作。",
					healthWellness:
						"注意消化系統和免疫系統的保養。保持均衡的飲食，適度運動。情緒管理很重要，學會釋放壓力，保持心理健康。",
					wealthManagement:
						"財運較為穩定，適合長期投資。可以考慮定期定額投資，分散風險。避免跟風投資，要有自己的判斷和策略。",
					relationshipGuidance:
						"感情發展較為順利，善於維繫關係。建議在感情中保持獨立性，不要過度依賴對方。重視精神層面的交流。",
					lifeDirection:
						"人生中期是關鍵發展階段，要在事業和家庭之間找到平衡。建議制定明確的發展計劃，同時留意健康和人際關係的維護。",
				},
				日柱: {
					careerDevelopment:
						"日柱代表核心能力，適合獨當一面的工作。具有領導潛質，可以考慮創業或高階主管職位。重視專業能力的提升。",
					healthWellness:
						"身體素質較好，但要注意過度勞累。定期體檢，預防職業病。保持工作與生活的平衡，避免過度透支健康。",
					wealthManagement:
						"具有良好的理財能力，可以嘗試多元化投資。但要避免過度自信，保持謹慎的態度。建議尋求專業的財務諮詢。",
					relationshipGuidance:
						"在感情中較為主導，但要學會傾聽和包容。避免過度控制，給對方適當的空間。重視溝通的品質。",
					lifeDirection:
						"人生目標較為明確，執行力強。建議在追求成功的同時，也要關注內心的平衡和精神層面的成長。",
				},
				時柱: {
					careerDevelopment:
						"時柱代表晚年發展，適合傳承和指導性質的工作。可以考慮顧問、教育或公益事業。重視經驗的傳承和智慧的分享。",
					healthWellness:
						"注意骨骼和關節的保養，適合低強度的運動如太極、散步。保持規律的生活作息，重視精神健康和社交活動。",
					wealthManagement:
						"財務管理趨於保守，重視資產的保值。建議選擇穩健的投資工具，為子女和晚年生活做好規劃。",
					relationshipGuidance:
						"感情較為成熟穩重，重視家庭和諧。建議多花時間陪伴家人，經營跨代關係。保持開放的心態接受新觀念。",
					lifeDirection:
						"人生晚期重視精神滿足和社會貢獻。建議發揮自己的經驗和智慧，幫助他人成長。保持學習的心態，享受人生的每個階段。",
				},
			};

			return NextResponse.json({
				success: true,
				analysis: fallbackContent[pillar] || fallbackContent["日柱"],
			});
		}
	} catch (error) {
		console.error("API Error:", error);

		// 🚨 CLEAN UP ON ERROR
		rejectPendingRequest(cacheKey, error, requestId, rejectPending);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
