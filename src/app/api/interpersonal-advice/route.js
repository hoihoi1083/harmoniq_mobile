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
		cacheKey = generateCacheKey("interpersonal-advice", userInfo, {
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

		const prompt = `你是資深的八字命理師，需要根據用戶的${pillar}信息，提供人際關係調和的重點建議。

用戶信息：
- 姓名：${userInfo.name}
- 性別：${userInfo.gender === "male" ? "男" : "女"}
- 出生日期：${userInfo.birthDate}
- 出生時間：${userInfo.birthTime}
- 出生地點：${userInfo.location}
- ${pillar}：${pillar}相關的命理信息

請從以下角度提供人際關係調和建議：

1. **人際特質分析**
   - 分析此人在人際關係中的天賦優勢
   - 指出容易遇到的人際挑戰

2. **溝通風格建議**
   - 如何改善溝通技巧
   - 適合的溝通方式和注意事項

3. **關係維護要點**
   - 如何建立良好的人際關係
   - 維護長期關係的關鍵

4. **化解衝突方法**
   - 面對人際衝突時的處理策略
   - 預防關係惡化的方法

請以溫暖、實用的語調提供建議，每個要點都要具體且可執行。
返回格式必須是純JSON，包含以下結構：
{
    "personalTraits": "人際特質分析",
    "communicationStyle": "溝通風格建議", 
    "relationshipMaintenance": "關係維護要點",
    "conflictResolution": "化解衝突方法"
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
					max_tokens: 1000,
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
				"personalTraits",
				"communicationStyle",
				"relationshipMaintenance",
				"conflictResolution",
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
					personalTraits:
						"年柱反映了您早期的人際特質，天生具有親和力，容易獲得他人信任。在人際關係中展現出純真和熱情，但有時可能過於直接，需要學習更多的人際技巧。",
					communicationStyle:
						"建議在溝通時保持真誠，但要學會察言觀色。避免過於衝動的表達，多聽少說，給對方充分的表達空間。在重要場合前先思考再開口。",
					relationshipMaintenance:
						"重視情感交流，定期與朋友家人聯繫。學會記住他人的重要日子，適時表達關心。建立互相支持的友誼圈，但要保持適當的界限。",
					conflictResolution:
						"面對衝突時，先冷靜下來，避免情緒化的反應。學會換位思考，理解對方的立場。用溫和但堅定的態度表達自己的觀點，尋求雙贏的解決方案。",
				},
				月柱: {
					personalTraits:
						"月柱顯示您在青年時期的人際發展，善於與同輩建立關係，具有團隊合作精神。在群體中能發揮協調作用，但有時可能會過於在意他人看法。",
					communicationStyle:
						"適合採用平等、開放的溝通方式。善於傾聽和回應，但要注意表達自己的真實想法。避免為了迎合他人而失去自我，保持適度的主見。",
					relationshipMaintenance:
						"注重友情的深度發展，喜歡與志同道合的人建立長期關係。定期組織聚會或活動，維繫友誼。學會在給予和接受之間保持平衡。",
					conflictResolution:
						"擅長調解他人之間的矛盾，但面對自己的衝突時可能會退縮。學會勇於面對問題，用理性和感性並重的方式處理分歧。",
				},
				日柱: {
					personalTraits:
						"日柱代表您的核心人際特質，展現出成熟穩重的交往風格。能夠承擔責任，在人際關係中扮演重要角色，但有時可能承受過多壓力。",
					communicationStyle:
						"溝通風格較為直接和實用，重視效率和結果。建議增加一些情感表達，讓溝通更有溫度。學會在正式和輕鬆的語調之間切換。",
					relationshipMaintenance:
						"重視長期穩定的關係，願意為重要的人付出時間和精力。建議定期檢視人際關係品質，及時修復可能出現的裂痕。",
					conflictResolution:
						"面對衝突時比較理性，能夠客觀分析問題。但要避免過於冷漠，適時表達情感和理解。學會在堅持原則的同時保持彈性。",
				},
				時柱: {
					personalTraits:
						"時柱反映了您晚年的人際智慧，具有豐富的人生閱歷和包容心。善於給予他人指導和支持，在人際關係中扮演長者和智者的角色。",
					communicationStyle:
						"溝通時展現出智慧和耐心，善於用故事和比喻來傳達觀點。建議保持開放的心態，不要過於固執己見，尊重年輕一代的想法。",
					relationshipMaintenance:
						"重視家庭和傳統的人際網絡，善於維繫跨代關係。學會在傳統和現代之間找到平衡，與不同年齡層的人建立良好關係。",
					conflictResolution:
						"具有化解矛盾的智慧，能夠從更高的角度看待問題。建議發揮調解者的作用，幫助他人解決分歧，同時也要照顧好自己的感受。",
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
