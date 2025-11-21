import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import UserIntent from "@/models/UserIntent";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const { intentId, status } = await request.json();

		if (!intentId || !status) {
			return NextResponse.json(
				{ error: "缺少必要參數" },
				{ status: 400 }
			);
		}

		await connectDB();

		const updateData = {};

		if (status === "generated") {
			updateData.reportGenerated = true;
			updateData.updatedAt = new Date();
		}

		const updatedIntent = await UserIntent.findByIdAndUpdate(
			intentId,
			updateData,
			{ new: true }
		);

		if (!updatedIntent) {
			return NextResponse.json(
				{ error: "找不到對應記錄" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "狀態更新成功",
			intent: updatedIntent,
		});
	} catch (error) {
		console.error("更新報告狀態失敗:", error);
		return NextResponse.json({ error: "更新失敗" }, { status: 500 });
	}
}
