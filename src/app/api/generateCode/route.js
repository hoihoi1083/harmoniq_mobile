import { NextResponse } from "next/server";
import { getUserInfo } from "@/lib/session";
import {
	genSuccessData,
	genUnAuthData,
	genErrorData,
} from "../utils/gen-res-data";
// import { fetch } from "undici";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	const userInfo = await getUserInfo();
	if (userInfo == null) return Response.json(genUnAuthData());
	const body = await request.json();

	let data = JSON.stringify({
		messages: [
			{
				content: body.system,
				role: "system",
			},
			{
				content: body.user,
				role: "user",
			},
			{
				role: "assistant",
				content: body.assistant || "",
			},
		],
		model: "deepseek-chat",
		frequency_penalty: 0,
		max_tokens: body.jsonResult ? null : 300,
		presence_penalty: 0,
		response_format: {
			type: body.jsonResult ? "json_object" : "text",
		},
		stop: null,
		stream: false,
		stream_options: null,
		temperature: 1,
		top_p: 1,
		tools: null,
		tool_choice: "none",
		logprobs: false,
		top_logprobs: null,
	});

	try {
		const res = await fetch("https://api.deepseek.com/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: `Bearer ${process.env.API_KEY}`,
			},
			maxBodyLength: Infinity,
			body: data,
		});

		const resData = await res.json();
		//if (resData.choices) {
		return NextResponse.json(
			genSuccessData(resData.choices[0].message.content)
		);
		//}
		//throw new Error(resData.statusText);
		//return NextResponse.json(genErrorData(resData.statusText));
	} catch (error) {
		return NextResponse.json(genErrorData(error.message));
	}
}
