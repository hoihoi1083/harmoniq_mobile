import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import ChatHistory from "@/models/ChatHistory";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		await connectMongo();

		const { oldUserId, newUserId } = await request.json();

		if (!oldUserId || !newUserId) {
			return NextResponse.json(
				{ error: "oldUserId 和 newUserId 都是必需的" },
				{ status: 400 }
			);
		}

		// 🔒 防重複轉移：檢查是否已經有該用戶的對話記錄存在
		const existingUserConversations = await ChatHistory.find({
			userId: newUserId,
			userEmail: newUserId,
		});

		if (existingUserConversations.length > 0) {
			console.log("⚠️ 用戶已有對話記錄，跳過轉移避免重複");
			return NextResponse.json({
				success: true,
				transferredCount: 0,
				message: "用戶已有對話記錄，跳過轉移避免重複",
			});
		}

		// 檢查是否有需要轉移的匿名對話
		const conversationsToTransfer = await ChatHistory.find({
			userId: oldUserId,
			userEmail: { $in: ["anonymous", null] },
		});

		if (conversationsToTransfer.length === 0) {
			console.log("📭 沒有找到需要轉移的匿名對話記錄");
			return NextResponse.json({
				success: true,
				transferredCount: 0,
				message: "沒有需要轉移的對話記錄",
			});
		}
		console.log(
			`🔄 找到 ${conversationsToTransfer.length} 個匿名對話需要轉移`
		);

		// 執行批量更新 - 將匿名對話轉移到新用戶
		const updateResult = await ChatHistory.updateMany(
			{
				userId: oldUserId,
				userEmail: { $in: ["anonymous", null] },
			},
			{
				$set: {
					userId: newUserId,
					userEmail: newUserId,
				},
			}
		);

		console.log(`✅ 成功轉移 ${updateResult.modifiedCount} 個對話記錄`);

		return NextResponse.json({
			success: true,
			transferredCount: updateResult.modifiedCount,
			message: `成功轉移 ${updateResult.modifiedCount} 個對話記錄到用戶 ${newUserId}`,
		});
	} catch (error) {
		console.error("❌ 轉移對話記錄失敗:", error);
		return NextResponse.json(
			{
				error: "轉移對話記錄失敗",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}
