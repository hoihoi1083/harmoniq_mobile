import { NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const { specificProblem } = await request.json();

		if (!specificProblem) {
			return NextResponse.json(
				{ error: "缺少具體問題描述" },
				{ status: 400 }
			);
		}

		console.log("🔍 分析問題類別:", specificProblem);
		console.log("📏 問題長度:", specificProblem?.length);
		console.log("📊 問題類型:", typeof specificProblem);

		// Use AI to categorize the problem
		const prompt = `你是一位專業的八字命理問題分類專家。請分析以下感情問題並分類到對應類別：

問題：${specificProblem}

請判斷此問題屬於以下哪一個類別，並返回JSON格式：

1. 命盤衝突類 (mingpan_conflict)
- 核心意圖：診斷雙方屬性衝突並提供轉化方案
- 語言特徵：相沖/相剋/合不合/能否結婚/八字不合/五行相剋
- 模型辨識關鍵：問題是否聚焦雙方能量互動？是否需解釋五行生剋或生肖配對？

2. 感情降溫類 (emotion_cooling)
- 核心意圖：解決現存負面狀態或惡化趨勢
- 語言特徵：怎麼辦/如何化解/爭吵/降溫/感情變淡/冷戰/疏離
- 模型辨識關鍵：問題是否描述已發生的困境？是否需風水調整或能量干預？

3. 特殊情境類 (special_situation)
- 核心意圖：非常規條件下的關係維持策略
- 語言特徵：遠距/異國/分隔/特殊情況/異地戀/工作分離
- 模型辨識關鍵：問題是否涉及空間阻隔或非傳統關係？

4. 禁忌破解類 (taboo_breaking)
- 核心意圖：顛覆負面命理標籤的認知重建
- 語言特徵：剋夫/剋妻/命格不好/注定/破解/不吉利/命犯
- 模型辨識關鍵：問題是否包含宿命論論斷？是否需解構認知？

請返回JSON格式：
{
  "category": "分類代碼",
  "categoryName": "分類名稱",
  "confidence": 0.9,
  "reason": "分類原因說明",
  "keyFeatures": ["關鍵特徵1", "關鍵特徵2"]
}`;

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
							"你是專業的命理問題分類專家，請精確分析並返回JSON格式結果。",
					},
					{
						role: "user",
						content: prompt,
					},
				],
				temperature: 0.3,
				max_tokens: 500,
			}),
		});

		if (!response.ok) {
			throw new Error(`DeepSeek API error: ${response.status}`);
		}

		const data = await response.json();
		const aiResponse = data.choices[0].message.content;

		console.log("🤖 AI分類結果:", aiResponse);

		// Parse JSON response
		let categorization;
		try {
			// Extract JSON from response
			const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				categorization = JSON.parse(jsonMatch[0]);
			} else {
				throw new Error("No JSON found in response");
			}
		} catch (parseError) {
			console.error("JSON解析錯誤:", parseError);
			// Fallback categorization
			categorization = {
				category: "emotion_cooling",
				categoryName: "感情降溫類",
				confidence: 0.7,
				reason: "AI解析失敗，使用默認分類",
				keyFeatures: ["解析失敗"],
			};
		}

		console.log("📊 最終分類結果:", categorization);

		return NextResponse.json({
			success: true,
			categorization,
			originalProblem: specificProblem,
		});
	} catch (error) {
		console.error("❌ 問題分類失敗:", error);
		return NextResponse.json(
			{
				error: "問題分類失敗",
				details: error.message,
				// Fallback categorization
				categorization: {
					category: "emotion_cooling",
					categoryName: "感情降溫類",
					confidence: 0.5,
					reason: "系統錯誤，使用默認分類",
					keyFeatures: ["系統錯誤"],
				},
			},
			{ status: 500 }
		);
	}
}
