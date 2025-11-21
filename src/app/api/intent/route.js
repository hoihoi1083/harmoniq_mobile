import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import UserIntent from "@/models/UserIntent";
import { auth } from "@/auth";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "未授權" }, { status: 401 });
		}

		await connectMongo();

		const {
			primaryConcern,
			specificQuestion,
			birthday,
			birthTime,
			conversationEntry,
		} = await request.json();

		const userId = session.user.id;
		const email = session.user.email;
		const name = session.user.name;

		// 查找或創建用戶意圖記錄
		let userIntent = await UserIntent.findOne({ userId, primaryConcern });

		if (!userIntent) {
			userIntent = new UserIntent({
				userId,
				email,
				name,
				primaryConcern,
				specificQuestion,
				birthday: birthday ? new Date(birthday) : null,
				birthTime,
				conversationHistory: [],
			});
		} else {
			// 更新現有記錄
			if (specificQuestion)
				userIntent.specificQuestion = specificQuestion;
			if (birthday) userIntent.birthday = new Date(birthday);
			if (birthTime) userIntent.birthTime = birthTime;
		}

		// 添加對話記錄
		if (conversationEntry) {
			userIntent.conversationHistory.push(conversationEntry);
		}

		await userIntent.save();

		return NextResponse.json({
			success: true,
			intentId: userIntent._id,
			paymentReady: Boolean(
				userIntent.specificQuestion && userIntent.birthday
			),
		});
	} catch (error) {
		console.error("Intent tracking error:", error);
		return NextResponse.json({ error: "系統錯誤" }, { status: 500 });
	}
}

export async function GET(request) {
	try {
		const session = await auth();
		if (!session?.user) {
			return NextResponse.json({ error: "未授權" }, { status: 401 });
		}

		await connectMongo();

		const url = new URL(request.url);
		const concern = url.searchParams.get("concern");

		const userIntent = await UserIntent.findOne({
			userId: session.user.id,
			primaryConcern: concern,
		});

		return NextResponse.json({ userIntent });
	} catch (error) {
		console.error("Get intent error:", error);
		return NextResponse.json({ error: "系統錯誤" }, { status: 500 });
	}
}
