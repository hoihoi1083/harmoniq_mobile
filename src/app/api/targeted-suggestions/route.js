import { NextResponse } from "next/server";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const body = await request.json();
		console.log("🎯 Targeted Suggestions API - Received request:", body);

		const {
			femaleUser,
			maleUser,
			femaleBazi,
			maleBazi,
			femalePillars,
			malePillars,
		} = body;

		// Validate required data
		if (!femaleUser || !maleUser) {
			return NextResponse.json(
				{
					error: "Missing required user data for targeted suggestions",
				},
				{ status: 400 }
			);
		}

		// Prepare BaZi context for AI prompt
		const femaleBaziStr = femaleBazi
			? Object.entries(femaleBazi)
					.map(([key, value]) => `${key}: ${value}`)
					.join(", ")
			: "未提供";

		const maleBaziStr = maleBazi
			? Object.entries(maleBazi)
					.map(([key, value]) => `${key}: ${value}`)
					.join(", ")
			: "未提供";

		const femalePillarsStr = femalePillars
			? femalePillars
					.map(
						(pillar) =>
							`${pillar.heavenlyStem}${pillar.earthlyBranch}`
					)
					.join(" ")
			: "未提供";

		const malePillarsStr = malePillars
			? malePillars
					.map(
						(pillar) =>
							`${pillar.heavenlyStem}${pillar.earthlyBranch}`
					)
					.join(" ")
			: "未提供";

		// Enhanced AI prompt for targeted suggestions
		const prompt = `作為專業的八字命理師，請分析這對情侶的八字配置，提供針對性建議破除"克"的焦慮。

**情侶資訊：**
- 女方：${femaleUser.name}，生日：${femaleUser.birthday}
- 男方：${maleUser.name}，生日：${maleUser.birthday}

**八字資訊：**
- 女方八字：${femaleBaziStr}
- 女方四柱：${femalePillarsStr}
- 男方八字：${maleBaziStr}  
- 男方四柱：${malePillarsStr}

請先分析他們的八字特點，然後提供具體建議：

**分析要求：**
1. 識別雙方日主元素和主要五行配置
2. 找出可能的相克或不和諧點
3. 確定需要增強或調和的元素
4. 提供具體的化解方法

**回應格式要求：**
請以JSON格式回應，包含以下結構：

{
  "elementBalance": {
    "title": "增強[具體缺失元素]平衡（[具體元素][具體作用]）",
    "description": "提供實用方法（如[具體佩戴建議]，或[具體環境佈置]）",
    "methods": [
      {
        "icon": "[emoji]",
        "title": "[具體方法名稱]",
        "description": "[詳細操作步驟和原理解釋]"
      }
    ]
  },
  "communicationTransformation": {
    "title": "轉化溝通模式",
    "description": "當[具體過旺元素]過旺時，用[具體元素]方式疏導（如[具體活動建議]，[具體效果]）",
    "methods": [具體方法數組]
  },
  "anchorRitual": {
    "title": "心錨儀式",
    "description": "推薦每日行動，如[具體身體動作]默念肯定語（如"[根據八字定制肯定語]"），強化[具體改善目標]",
    "methods": [具體儀式數組]
  },
  "energyValidationCase": {
    "title": "能量印證案例",
    "description": "分享類似[他們具體配置]案例",
    "caseStudy": {
      "configuration": "[與他們相似的具體配置]",
      "initialChallenge": "[具體挑戰描述]",
      "adjustmentProcess": "[具體調整方法]",
      "positiveOutcome": "[具體成功結果]",
      "keyInsight": "[關鍵洞察]"
    }
  }
}

**重要：**
- 所有標題和描述必須基於他們的實際八字配置
- 不要使用通用模板，要根據具體元素組合提供建議
- 例如：如果女方缺木，男方火旺，標題應該是"增強木元素平衡（木元素疏通火土對沖）"
- 肯定語要根據他們的日主和用神來定制
- 所有建議要可操作且有八字理論依據`;

		console.log(
			"🤖 Sending prompt to DeepSeek API:",
			prompt.substring(0, 200) + "..."
		);

		// Call DeepSeek API
		const deepseekResponse = await fetch(
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
								"你是一位專業的八字命理師，專精於情侶配對分析和風水調和建議。請提供實用、具體的針對性建議。",
						},
						{
							role: "user",
							content: prompt,
						},
					],
					temperature: 0.7,
					max_tokens: 2000,
				}),
			}
		);

		if (!deepseekResponse.ok) {
			console.error("DeepSeek API error:", await deepseekResponse.text());
			throw new Error(`DeepSeek API error: ${deepseekResponse.status}`);
		}

		const deepseekData = await deepseekResponse.json();
		console.log("🤖 DeepSeek API response received");

		let aiResponse = deepseekData.choices[0].message.content;
		console.log("🔍 Raw AI response:", aiResponse);

		// Parse AI response as JSON
		let parsedResponse;
		try {
			// Clean the response if it has markdown formatting
			aiResponse = aiResponse
				.replace(/```json\n?/g, "")
				.replace(/```\n?/g, "");
			parsedResponse = JSON.parse(aiResponse);
		} catch (parseError) {
			console.error("Failed to parse AI response as JSON:", parseError);

			// Provide structured fallback if parsing fails
			parsedResponse = {
				elementBalance: {
					title: "增強木元素平衡（木元素疏通土壅化解相克）",
					description:
						"提供實用方法（如佩戴綠幽靈手鏈調和土重，或在東方放置綠色植物增強木氣）",
					methods: [
						{
							icon: "🌿",
							title: "佩戴綠幽靈手鏈",
							description:
								"選擇天然綠幽靈水晶，補充命中木元素不足，化解土重困頓，建議戴在左手以接收木氣能量，每日晨起佩戴。",
						},
						{
							icon: "🪴",
							title: "東方綠植佈置",
							description:
								"在居家東方位置（木位）放置常綠植物如富貴竹或綠蘿，增強木元素流動，每週澆水時默念'木生火旺，化解土克'。",
						},
					],
				},
				communicationTransformation: {
					title: "轉化溝通模式",
					description:
						"當火土能量過旺時，用水木方式疏導（如共同泡茶品茗，以水潤燥平和心境）",
					methods: [
						{
							icon: "�",
							title: "共同品茗儀式",
							description:
								"每週至少兩次一起泡茶品茗，選擇綠茶或烏龍茶（木火屬性），在泡茶過程中練習耐心聆聽，用茶香調和急躁情緒。",
						},
						{
							icon: "💧",
							title: "水元素調和活動",
							description:
								"定期到海邊或湖邊散步，讓水元素平衡內在火氣，在水邊時練習深呼吸，釋放心中的對立情緒。",
						},
					],
				},
				anchorRitual: {
					title: "心錨儀式",
					description:
						"推薦每日行動，如雙手按心輪默念肯定語（如'木火通明，水土相濟'），強化五行平衡意識",
					methods: [
						{
							icon: "🙏",
							title: "晨起五行冥想",
							description:
								"每日清晨面向東方，雙手按心輪位置，緩慢深呼吸，默念'木火通明，水土相濟，五行和諧'三遍，建立內在平衡感。",
						},
						{
							icon: "🌅",
							title: "夕陽感恩儀式",
							description:
								"黃昏時面向西方，雙手按小腹，默念'感恩差異，化克為生，相愛相容'，強化對伴侶五行特質的理解與接納。",
						},
					],
				},
				energyValidationCase: {
					title: "能量印證案例",
					description:
						"分享類似木不足火土旺配置案例，經過木元素調和後轉化為正面成果",
					caseStudy: {
						configuration: "女方戊土日主土重 / 男方丙火日主火旺",
						initialChallenge:
							"初期因土重火旺導致固執與急躁並存，女方過於堅持己見，男方容易暴躁，加上缺木疏通，能量堵塞產生頻繁爭吵。",
						adjustmentProcess:
							"透過增加木元素調和：居家東方放置大型綠植、雙方佩戴木質飾品、每週進行園藝活動，並在溝通前先深呼吸默念'木生火旺，火生土和'以提醒自己保持疏通心態。",
						positiveOutcome:
							"三個月後，木元素的疏通作用開始顯現，女方土重轉為穩重可靠，男方火旺轉為行動力強，木生火、火生土的良性循環使他們的合作更有成效，共同投資的項目獲得成功。",
						keyInsight:
							"缺失元素的補充比壓制過旺元素更有效，木元素如橋樑般連接了土火能量。",
					},
				},
			};
		}

		console.log(
			"✅ Targeted Suggestions generation completed successfully"
		);
		return NextResponse.json(parsedResponse);
	} catch (error) {
		console.error("❌ Targeted Suggestions API error:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: error.message },
			{ status: 500 }
		);
	}
}
