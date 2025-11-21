import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongoose";
import ChatHistory from "@/models/ChatHistory";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		await connectMongo();

		const { searchParams } = new URL(request.url);
		const sessionId = searchParams.get("sessionId");
		const conversationId = searchParams.get("conversationId");
		const userEmail = searchParams.get("userEmail");

		// 支援兩種會話識別方式：sessionId 或 conversationId
		const targetSessionId = sessionId || conversationId;
		if (!targetSessionId) {
			return NextResponse.json(
				{ error: "會話ID不能為空 (sessionId 或 conversationId)" },
				{ status: 400 }
			);
		}

		console.log("📖 從ChatHistory載入會話:", targetSessionId);

		// 從ChatHistory獲取對話記錄
		const chatHistory = await ChatHistory.findOne({
			$or: [
				{ conversationId: targetSessionId },
				{ sessionId: targetSessionId },
			],
			...(userEmail && { userEmail: userEmail }),
		}).lean();

		if (!chatHistory) {
			return NextResponse.json(
				{ error: "找不到該會話記錄" },
				{ status: 404 }
			);
		}

		// 構建對話消息數組
		const messages = (chatHistory.messages || []).map((msg, index) => ({
			id: msg._id || `msg-${index}`,
			type: "chathistory",
			role: msg.role,
			content: msg.content,
			timestamp: msg.timestamp,
			aiAnalysis: msg.aiAnalysis,
			source: "ChatHistory",
		}));

		// 構建完整的對話歷史 - 返回消息數組格式 (匹配前端期望)
		const conversation = messages;

		return NextResponse.json({
			success: true,
			conversation: conversation,
			metadata: {
				sessionId: targetSessionId,
				userEmail: chatHistory.userEmail,
				userId: chatHistory.userId,
				title: chatHistory.title,
				primaryConcern: chatHistory.primaryConcern,
				conversationState: chatHistory.conversationState,
				createdAt: chatHistory.createdAt,
				updatedAt: chatHistory.updatedAt,
				stats: {
					totalMessages: messages.length,
					lastActivity: chatHistory.updatedAt,
				},
				context: chatHistory.context,
				userData: chatHistory.userData,
			},
		});
	} catch (error) {
		console.error("❌ 載入會話失敗:", error);
		return NextResponse.json(
			{
				error: "載入會話失敗",
				details: error.message,
			},
			{ status: 500 }
		);
	}
}

// 整合兩種來源的消息歷史
function buildMessageHistory(basicHistory = [], detailedHistory = []) {
	const messages = [];

	// 處理基本歷史（來自SmartUserIntent） - 支持兩種數據格式
	if (basicHistory && basicHistory.length > 0) {
		basicHistory.forEach((msg, index) => {
			// 檢查數據格式：新格式(role/content) vs 舊格式(userMessage/assistantMessage)
			if (msg.role && msg.content) {
				// 新格式：role/content
				messages.push({
					id: `basic-${index}`,
					type: "basic",
					role: msg.role,
					content: msg.content,
					timestamp: msg.timestamp || new Date(),
					detectedConcern: msg.detectedConcern,
					state: msg.state,
					source: "SmartUserIntent",
				});
			} else if (msg.userMessage && msg.assistantMessage) {
				// 舊格式：userMessage/assistantMessage - 轉換為兩條消息
				messages.push({
					id: `basic-user-${index}`,
					type: "basic",
					role: "user",
					content: msg.userMessage,
					timestamp: msg.timestamp || new Date(),
					source: "SmartUserIntent (legacy)",
				});
				messages.push({
					id: `basic-assistant-${index}`,
					type: "basic",
					role: "assistant",
					content: msg.assistantMessage,
					timestamp: new Date(
						new Date(msg.timestamp || new Date()).getTime() + 1000
					), // 稍微延後助手回應時間
					source: "SmartUserIntent (legacy)",
				});
			} else if (msg.userMessage) {
				// 只有用戶消息
				messages.push({
					id: `basic-user-only-${index}`,
					type: "basic",
					role: "user",
					content: msg.userMessage,
					timestamp: msg.timestamp || new Date(),
					source: "SmartUserIntent (legacy)",
				});
			} else if (msg.assistantMessage) {
				// 只有助手消息
				messages.push({
					id: `basic-assistant-only-${index}`,
					type: "basic",
					role: "assistant",
					content: msg.assistantMessage,
					timestamp: msg.timestamp || new Date(),
					source: "SmartUserIntent (legacy)",
				});
			} else {
				console.warn("⚠️ 未知的消息格式:", msg);
			}
		});
	}

	// 處理詳細歷史（來自ConversationHistory）
	if (detailedHistory && detailedHistory.length > 0) {
		detailedHistory.forEach((msg, index) => {
			messages.push({
				id: msg.messageId || `detailed-${index}`,
				type: "detailed",
				role: msg.userMessage ? "user" : "assistant",
				content: msg.userMessage || msg.assistantResponse || "",
				timestamp: msg.timestamp,
				contextData: msg.contextData,
				responseQuality: msg.responseQuality,
				userEngagement: msg.userEngagement,
				source: "ConversationHistory",
			});
		});
	}

	// 按時間排序（最舊的在前面，符合聊天界面顯示習慣）
	return messages
		.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
		.slice(0, 100); // 限制返回最近100條消息
}

// 生成建議操作
function generateSuggestedActions(userIntent) {
	const actions = [];

	// 根據對話狀態提供建議
	switch (userIntent.conversationState) {
		case "asking_detailed_report":
			actions.push({
				type: "continue_report_selection",
				text: "繼續選擇報告",
				description: "您之前在選擇詳細報告，是否要繼續？",
			});
			break;

		case "bazi_topic_selection":
			actions.push({
				type: "continue_bazi_analysis",
				text: "繼續八字分析",
				description: "您之前輸入了八字，是否要繼續分析？",
			});
			break;

		case "asking_relationship_type":
			actions.push({
				type: "continue_relationship_analysis",
				text: "繼續感情分析",
				description: "您之前在進行感情諮詢，是否要繼續？",
			});
			break;

		default:
			if (userIntent.primaryConcern) {
				actions.push({
					type: "continue_topic",
					text: `繼續${userIntent.primaryConcern}諮詢`,
					description: `根據您之前的${userIntent.primaryConcern}話題繼續對話`,
				});
			}
	}

	// 通用操作
	actions.push(
		{
			type: "ask_new_question",
			text: "詢問新問題",
			description: "在此對話中提出新的問題",
		},
		{
			type: "request_detailed_analysis",
			text: "要求詳細分析",
			description: "基於之前的對話獲得更詳細的分析",
		}
	);

	return actions;
}

// 生成對話摘要
function generateConversationSummary(userIntent) {
	const messageCount = userIntent.conversationHistory?.length || 0;
	const primaryConcern = userIntent.primaryConcern || "一般諮詢";
	const state = userIntent.conversationState;

	let summary = `這是一個關於${primaryConcern}的對話，`;

	if (messageCount === 0) {
		summary += "剛剛開始。";
	} else if (messageCount < 5) {
		summary += `進行了${messageCount}輪初步討論。`;
	} else {
		summary += `已經深入討論了${messageCount}輪。`;
	}

	// 根據狀態添加當前進度
	const stateDescriptions = {
		asking_detailed_report: "正在選擇詳細報告",
		bazi_topic_selection: "正在進行八字主題選擇",
		asking_relationship_type: "正在選擇感情分析類型",
		collecting_payment_info: "正在處理付款信息",
		ready_for_detailed_report: "準備生成詳細報告",
		completed: "對話已完成",
	};

	if (state && stateDescriptions[state]) {
		summary += ` 當前狀態：${stateDescriptions[state]}。`;
	}

	return summary;
}
