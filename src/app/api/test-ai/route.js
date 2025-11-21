import { NextRequest, NextResponse } from "next/server";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const body = await request.json();
		const { userInfo } = body;

		// Simple test prompt
		const prompt = `請返回簡單的JSON格式測試：
{
  "test": "成功",  
  "userGender": "${userInfo.gender}",
  "message": "這是測試訊息"
}`;

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000);

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
							content: "返回純JSON格式，不要任何其他文字或標記。",
						},
						{
							role: "user",
							content: prompt,
						},
					],
					temperature: 0.1,
					max_tokens: 200,
					response_format: { type: "json_object" },
				}),
				signal: controller.signal,
			}
		);

		clearTimeout(timeoutId);

		if (!response.ok) {
			return NextResponse.json(
				{ error: "API call failed", status: response.status },
				{ status: 500 }
			);
		}

		const data = await response.json();
		const content = data.choices?.[0]?.message?.content;

		return NextResponse.json({
			success: true,
			rawContent: content,
			parsed: JSON.parse(content),
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		return NextResponse.json(
			{ error: "Test failed", details: error.message },
			{ status: 500 }
		);
	}
}
