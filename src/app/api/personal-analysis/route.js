import { NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// DeepSeek AI API 調用
async function callDeepSeekAPI(prompt) {
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
						role: "system",
						content:
							"你是一位專精八字命理和五行學說的資深命理師，具有30年的實戰經驗。請基於傳統八字命理學、天干地支理論和五行相生相克原理提供專業分析。回答務必準確、實用，使用繁體中文。",
					},
					{
						role: "user",
						content: prompt,
					},
				],
				temperature: 0.7,
				max_tokens: 1500,
			}),
		});

		if (!response.ok) {
			throw new Error(`DeepSeek API error: ${response.status}`);
		}

		const data = await response.json();
		return data.choices[0].message.content;
	} catch (error) {throw new Error("AI分析服務暫時不可用，請稍後再試");
	}
}


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const { prompt, userProfile } = await request.json();if (!prompt) {return NextResponse.json(
				{ error: "缺少分析提示" },
				{ status: 400 }
			);
		}const analysis = await callDeepSeekAPI(prompt);

		const result = {
			success: true,
			timestamp: new Date().toISOString(),
			userProfile,
			analysis,
		};return NextResponse.json(result);
	} catch (error) {return NextResponse.json(
			{ error: `個人命理分析服務出現錯誤：${error.message}` },
			{ status: 500 }
		);
	}
}
