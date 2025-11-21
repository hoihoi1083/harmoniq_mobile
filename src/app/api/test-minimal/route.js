import { NextResponse } from "next/server";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		console.log("🔧 Testing minimal route...");

		const body = await request.json();
		console.log("📨 Received body:", body);

		return NextResponse.json({
			success: true,
			response: "✨ 基本路由測試成功！",
			received: body,
		});
	} catch (error) {
		console.error("❌ 測試路由錯誤:", error);
		return NextResponse.json(
			{
				success: false,
				error: error.message || "未知錯誤",
				stack: error.stack,
			},
			{ status: 500 }
		);
	}
}
