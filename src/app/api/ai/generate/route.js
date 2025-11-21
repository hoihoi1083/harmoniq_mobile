import { NextResponse } from "next/server";
import OpenAI from "openai";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const { systemPrompt, userPrompt, type } = await request.json();

		if (!systemPrompt || !userPrompt) {
			return NextResponse.json(
				{
					message:
						"Missing required fields: systemPrompt and userPrompt",
				},
				{ status: 400 }
			);
		}

		// Create OpenAI client with same config as your openai.js
		const openai = new OpenAI({
			baseURL: "https://api.deepseek.com",
			apiKey: process.env.API_KEY,
		});

		// Generate content using DeepSeek
		const completion = await openai.chat.completions.create({
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
			model: "deepseek-chat",
			response_format: {
				type: "json_object",
			},
		});

		return NextResponse.json({
			success: true,
			content: completion.choices[0].message.content,
			type,
		});
	} catch (error) {return NextResponse.json(
			{ message: "Failed to generate AI content", error: error.message },
			{ status: 500 }
		);
	}
}
