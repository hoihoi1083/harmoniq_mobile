"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
	MessageCircle,
	Send,
	Sparkles,
	Heart,
	User,
	Bot,
	Calendar,
	MapPin,
	Brain,
	Star,
} from "lucide-react";
import EmotionalAnalyzer from "@/components/EmotionalAnalyzer";
import BirthdayAnalyzer from "@/components/BirthdayAnalyzer";

export default function ChatPage() {
	const API_BASE =
		process.env.NEXT_PUBLIC_API_BASE_URL ||
		"https://www.harmoniqfengshui.com";
	const { data: session } = useSession();
	const router = useRouter();
	const [messages, setMessages] = useState([
		{
			id: 1,
			role: "assistant",
			content:
				"你好！我係你嘅風水AI助手小風 🌸 我喺呢度聆聽你嘅煩惱，提供溫暖嘅建議，並引導你發現生活中嘅正能量。請話俾我知，今日有咩想傾嘅嗎？",
			timestamp: new Date(),
			emotion: "welcoming",
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [userProfile, setUserProfile] = useState({
		name: session?.user?.name || "",
		birthday: "",
		birthTime: "",
		concerns: [],
		emotionalState: "neutral",
	});
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [showEmotionalAnalyzer, setShowEmotionalAnalyzer] = useState(false);
	const [showBirthdayAnalyzer, setShowBirthdayAnalyzer] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Function to update birthday from individual components
	const updateBirthday = (component, value) => {
		if (!value) return;

		let currentDate = userProfile.birthday
			? new Date(userProfile.birthday)
			: new Date();

		switch (component) {
			case "year":
				currentDate.setFullYear(parseInt(value));
				break;
			case "month":
				currentDate.setMonth(parseInt(value) - 1);
				break;
			case "day":
				currentDate.setDate(parseInt(value));
				break;
		}

		// Format as YYYY-MM-DD for consistency
		const formattedDate = currentDate.toISOString().split("T")[0];
		setUserProfile((prev) => ({ ...prev, birthday: formattedDate }));
	};

	// Function to render message content with clickable links
	const renderMessageContent = (content) => {
		// Replace markdown-style links [text](url) with clickable links
		const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
		const parts = [];
		let lastIndex = 0;
		let match;

		while ((match = linkRegex.exec(content)) !== null) {
			// Add text before the link
			if (match.index > lastIndex) {
				parts.push(content.slice(lastIndex, match.index));
			}

			// Add the clickable link
			parts.push(
				<a
					key={match.index}
					href={match[2]}
					className="text-blue-600 underline cursor-pointer hover:text-blue-800"
					onClick={(e) => {
						e.preventDefault();
						window.location.href = match[2];
					}}
				>
					{match[1]}
				</a>
			);

			lastIndex = match.index + match[0].length;
		}

		// Add remaining text
		if (lastIndex < content.length) {
			parts.push(content.slice(lastIndex));
		}

		return parts.length > 0 ? parts : content;
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Emotional analysis based on user input
	const analyzeEmotion = (text) => {
		const emotions = {
			stressed: [
				"壓力",
				"焦慮",
				"緊張",
				"擔心",
				"困擾",
				"煩惱",
				"累",
				"攰",
			],
			sad: ["難過", "傷心", "沮喪", "憂鬱", "失落", "孤單", "唔開心"],
			angry: ["生氣", "憤怒", "不爽", "火大", "討厭", "嬲", "激嬲"],
			confused: ["不知道", "困惑", "迷茫", "不懂", "疑問", "唔明", "亂"],
			hopeful: ["希望", "期待", "想要", "渴望", "夢想", "盼望"],
			happy: ["開心", "快樂", "高興", "興奮", "滿足", "爽", "正"],
		};

		for (const [emotion, keywords] of Object.entries(emotions)) {
			if (keywords.some((keyword) => text.includes(keyword))) {
				return emotion;
			}
		}
		return "neutral";
	};

	// Generate empathetic response based on emotion
	const generateEmpatheticResponse = (emotion, userMessage) => {
		const responses = {
			stressed: [
				"我感受到你而家壓力好大 😔 深呼吸一下，等我哋一齊面對呢個挑戰。",
				"壓力確實好難承受，但你已經好勇敢咁講出嚟 💪 我哋嚟諗下解決方法。",
			],
			sad: [
				"我聽到你內心嘅痛苦 💙 俾自己感受呢啲情緒係好重要嘅。",
				"每個人都會有低潮嘅時候，你並唔孤單 🤗 等我陪你度過呢段時光。",
			],
			angry: [
				"我理解你嘅憤怒，呢啲情緒都係合理嘅 🔥 等我哋搵個健康嘅方式嚟處理佢。",
				"嬲嘅時候好容易失去理智，但你選擇咗溝通，呢個好棒 👏",
			],
			confused: [
				"迷茫係成長嘅一部分 🌱 等我哋一齊理清思緒，搵到方向。",
				"唔確定嘅感覺我明 🤔 有時候慢慢探索比急住搵答案更有意義。",
			],
			hopeful: [
				"我感受到你內心嘅希望之光 ✨ 呢種正能量好珍貴，等我哋好好培養佢。",
				"有夢想嘅人最靚 🌟 等我幫你實現呢啲美好嘅願望。",
			],
			happy: [
				"睇到你咁開心，我都感到好溫暖 😊 分享快樂會令佢加倍！",
				"你嘅快樂好有感染力 🌈 繼續保持呢種美好嘅心情！",
			],
			neutral: [
				"多謝你同我分享 😌 我好樂意聽你講更多。",
				"我喺呢度陪伴你 💛 無論咩話題都可以傾。",
			],
		};

		const emotionResponses = responses[emotion] || responses.neutral;
		return emotionResponses[
			Math.floor(Math.random() * emotionResponses.length)
		];
	};

	// Feng shui guidance based on user concerns
	const generateFengShuiGuidance = (concerns, emotion) => {
		const guidance = {
			career: "事業運勢可以通過調整辦公桌朝向同加強東方能量嚟提升 📈",
			relationship: "喺睡房西南角放置成雙嘅物品可以增進感情運 💕",
			health: "保持居住空間嘅清潔同通風，特別注意廚房同浴室嘅風水 🌿",
			finance: "財運同東南方位相關，可以喺嗰個方位放置綠色植物 💰",
			family: "家庭和諧需要客廳嘅正能量，避免尖角對住座位 🏠",
			stress: "喺屋企北方放置水元素（如小噴泉）有助於緩解壓力 🌊",
		};

		if (emotion === "stressed") {
			return guidance.stress;
		}

		return Object.values(guidance)[
			Math.floor(Math.random() * Object.values(guidance).length)
		];
	};

	const sendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage = {
			id: Date.now(),
			role: "user",
			content: input,
			timestamp: new Date(),
			emotion: analyzeEmotion(input),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			// Analyze user emotion for context
			const emotion = analyzeEmotion(input);

			// Call AI API for emotionally intelligent response
			const response = await fetch(`${API_BASE}/api/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: [...messages, userMessage],
					userProfile,
					emotion,
					context: "feng_shui_emotional_support",
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to get AI response");
			}

			const data = await response.json();

			// Use AI response directly (no need to combine with empathetic response)
			const assistantMessage = {
				id: Date.now() + 1,
				role: "assistant",
				content: data.content,
				timestamp: new Date(),
				emotion: "supportive",
				suggestions: data.suggestions || [],
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error("Chat error:", error);

			// Enhanced fallback response using personal response system
			try {
				const {
					analyzeUserEmotion,
					detectTopic,
					generatePersonalResponse,
				} = await import("@/lib/personalResponseSystem");

				const emotion = analyzeUserEmotion(input);
				const topic = detectTopic(input);
				const personalResponse = generatePersonalResponse(
					input,
					userProfile,
					emotion,
					topic
				);

				const enhancedFallbackResponse = {
					id: Date.now() + 1,
					role: "assistant",
					content: personalResponse,
					timestamp: new Date(),
					emotion: "supportive",
				};

				setMessages((prev) => [...prev, enhancedFallbackResponse]);
			} catch (importError) {
				console.error(
					"Failed to load enhanced fallback system:",
					importError
				);

				// Legacy fallback response with emotion support
				const emotion = analyzeEmotion(input);
				const fallbackResponse = {
					id: Date.now() + 1,
					role: "assistant",
					content: `${generateEmpatheticResponse(emotion, input)}\n\n${generateFengShuiGuidance(userProfile.concerns, emotion)}`,
					timestamp: new Date(),
					emotion: "supportive",
				};
				setMessages((prev) => [...prev, fallbackResponse]);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const updateProfile = () => {
		setShowProfileModal(false);
		// Add a personalized message based on profile
		const personalizedMessage = {
			id: Date.now(),
			role: "assistant",
			content: `好高興認識你，${userProfile.name}！🌸 根據你提供嘅資訊，我會更好咁為你提供個人化嘅建議。${userProfile.birthTime ? `有埋時辰資料會令八字分析更準確！` : ""}如果你想分析生辰八字或者居住環境嘅風水，我隨時都喺呢度幫你 ✨`,
			timestamp: new Date(),
			emotion: "welcoming",
		};
		setMessages((prev) => [...prev, personalizedMessage]);
	};

	const quickActions = [
		{
			icon: <Heart className="w-4 h-4" />,
			text: "我感到焦慮",
			message: "最近我感到好焦慮，唔知道應該點辦...",
		},
		{
			icon: <Sparkles className="w-4 h-4" />,
			text: "想改善運勢",
			message: "我想了解點樣通過風水嚟改善我嘅運勢",
		},
		{
			icon: <Calendar className="w-4 h-4" />,
			text: userProfile.birthday ? "我嘅八字分析" : "提供生日分析",
			message: userProfile.birthday
				? "根據我嘅生日分析一下我嘅運勢"
				: "我想提供我嘅生日進行八字分析",
			action: userProfile.birthday
				? null
				: () => setShowBirthdayAnalyzer(true),
		},
		{
			icon: <Brain className="w-4 h-4" />,
			text: "情緒分析",
			action: () => setShowEmotionalAnalyzer(true),
		},
	];

	const handleQuickAction = (action) => {
		if (action.message) {
			setInput(action.message);
		} else if (action.action) {
			action.action();
		}
	};

	const handleAnalysisComplete = (prompt, analysisData) => {
		setShowEmotionalAnalyzer(false);
		setShowBirthdayAnalyzer(false);
		setInput(prompt);
		// Auto-send the analysis prompt
		setTimeout(() => {
			sendMessage();
		}, 100);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
			{/* Header */}
			<div className="sticky top-0 z-10 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
				<div className="container px-4 py-4 mx-auto">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
								<MessageCircle className="w-6 h-6 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-bold text-gray-800">
									風水AI助手小風
								</h1>
								<p className="text-sm text-gray-600">
									情感支持 • 風水指導 • 生活建議
								</p>
							</div>
						</div>
						<button
							onClick={() => setShowProfileModal(true)}
							className="px-4 py-2 text-purple-700 transition-colors bg-purple-100 rounded-lg hover:bg-purple-200"
						>
							個人資料
						</button>
					</div>
				</div>
			</div>

			{/* Chat Container */}
			<div className="container max-w-4xl px-4 py-6 mx-auto">
				<div className="overflow-hidden border shadow-xl bg-white/60 backdrop-blur-sm rounded-2xl border-white/20">
					{/* Messages */}
					<div className="h-[600px] overflow-y-auto p-6 space-y-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
							>
								<div
									className={`max-w-[80%] rounded-2xl px-4 py-3 ${
										message.role === "user"
											? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
											: "bg-white/80 border border-gray-200 text-gray-800"
									}`}
								>
									<div className="flex items-start space-x-2">
										{message.role === "assistant" && (
											<Bot className="flex-shrink-0 w-5 h-5 mt-1 text-purple-500" />
										)}
										{message.role === "user" && (
											<User className="flex-shrink-0 w-5 h-5 mt-1 text-white" />
										)}
										<div className="flex-1">
											<div className="whitespace-pre-wrap">
												{renderMessageContent(
													message.content
												)}
											</div>
											{message.suggestions &&
												message.suggestions.length >
													0 && (
													<div className="mt-3 space-y-2">
														{message.suggestions.map(
															(
																suggestion,
																index
															) => (
																<button
																	key={index}
																	onClick={() =>
																		setInput(
																			suggestion
																		)
																	}
																	className="block w-full px-3 py-2 text-sm text-left text-purple-700 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100"
																>
																	{suggestion}
																</button>
															)
														)}
													</div>
												)}
											<p className="mt-2 text-xs opacity-60">
												{message.timestamp.toLocaleTimeString(
													"en-US",
													{
														hour: "2-digit",
														minute: "2-digit",
														hour12: false,
													}
												)}
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
						{isLoading && (
							<div className="flex justify-start">
								<div className="px-4 py-3 border border-gray-200 bg-white/80 rounded-2xl">
									<div className="flex items-center space-x-2">
										<Bot className="w-5 h-5 text-purple-500" />
										<div className="flex space-x-1">
											<div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
											<div
												className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
												style={{
													animationDelay: "0.1s",
												}}
											></div>
											<div
												className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
												style={{
													animationDelay: "0.2s",
												}}
											></div>
										</div>
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Quick Actions */}
					<div className="px-6 py-4 border-t border-gray-200/50">
						<div className="grid grid-cols-2 gap-2 mb-4 md:grid-cols-4">
							{quickActions.map((action, index) => (
								<button
									key={index}
									onClick={() => handleQuickAction(action)}
									className="flex items-center px-3 py-2 space-x-2 text-sm text-purple-700 transition-all rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 hover:scale-105"
								>
									{action.icon}
									<span className="hidden sm:inline">
										{action.text}
									</span>
								</button>
							))}
						</div>

						{/* Input */}
						<div className="flex space-x-3">
							<div className="relative flex-1">
								<textarea
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder="輸入你嘅想法，等我陪伴你..."
									className="w-full px-4 py-3 transition-all border border-gray-200 resize-none bg-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
									rows="2"
									disabled={isLoading}
								/>
							</div>
							<button
								onClick={sendMessage}
								disabled={!input.trim() || isLoading}
								className="flex items-center justify-center px-6 py-3 text-white transition-all bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
							>
								<Send className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Profile Modal */}
			{showProfileModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl">
						<h2 className="mb-4 text-xl font-bold text-gray-800">
							個人資料設定
						</h2>
						<div className="space-y-4">
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700">
									姓名
								</label>
								<input
									type="text"
									value={userProfile.name}
									onChange={(e) =>
										setUserProfile((prev) => ({
											...prev,
											name: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
									placeholder="請輸入你嘅姓名"
								/>
							</div>
							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700">
									生日
								</label>
								<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
									{/* Year Selector */}
									<div>
										<select
											value={
												userProfile.birthday
													? new Date(
															userProfile.birthday
														).getFullYear()
													: ""
											}
											onChange={(e) =>
												updateBirthday(
													"year",
													e.target.value
												)
											}
											className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
										>
											<option value="">年</option>
											{Array.from(
												{ length: 80 },
												(_, i) =>
													new Date().getFullYear() -
													15 -
													i
											).map((year) => (
												<option key={year} value={year}>
													{year}
												</option>
											))}
										</select>
									</div>

									{/* Month Selector */}
									<div>
										<select
											value={
												userProfile.birthday
													? new Date(
															userProfile.birthday
														).getMonth() + 1
													: ""
											}
											onChange={(e) =>
												updateBirthday(
													"month",
													e.target.value
												)
											}
											className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
										>
											<option value="">月</option>
											{Array.from(
												{ length: 12 },
												(_, i) => i + 1
											).map((month) => (
												<option
													key={month}
													value={month}
												>
													{month}月
												</option>
											))}
										</select>
									</div>

									{/* Day Selector */}
									<div>
										<select
											value={
												userProfile.birthday
													? new Date(
															userProfile.birthday
														).getDate()
													: ""
											}
											onChange={(e) =>
												updateBirthday(
													"day",
													e.target.value
												)
											}
											className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
										>
											<option value="">日</option>
											{Array.from(
												{ length: 31 },
												(_, i) => i + 1
											).map((day) => (
												<option key={day} value={day}>
													{day}日
												</option>
											))}
										</select>
									</div>

									{/* Time Selector */}
									<div>
										<select
											value={userProfile.birthTime || ""}
											onChange={(e) =>
												setUserProfile((prev) => ({
													...prev,
													birthTime: e.target.value,
												}))
											}
											className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
										>
											<option value="">時間</option>
											<option value="子時">
												子時 (23:00-01:00)
											</option>
											<option value="丑時">
												丑時 (01:00-03:00)
											</option>
											<option value="寅時">
												寅時 (03:00-05:00)
											</option>
											<option value="卯時">
												卯時 (05:00-07:00)
											</option>
											<option value="辰時">
												辰時 (07:00-09:00)
											</option>
											<option value="巳時">
												巳時 (09:00-11:00)
											</option>
											<option value="午時">
												午時 (11:00-13:00)
											</option>
											<option value="未時">
												未時 (13:00-15:00)
											</option>
											<option value="申時">
												申時 (15:00-17:00)
											</option>
											<option value="酉時">
												酉時 (17:00-19:00)
											</option>
											<option value="戌時">
												戌時 (19:00-21:00)
											</option>
											<option value="亥時">
												亥時 (21:00-23:00)
											</option>
										</select>
									</div>
								</div>
								<p className="mt-1 text-xs text-gray-500">
									時間可選填，有助更精確嘅八字分析
								</p>
							</div>
						</div>
						<div className="flex mt-6 space-x-3">
							<button
								onClick={() => setShowProfileModal(false)}
								className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
							>
								取消
							</button>
							<button
								onClick={updateProfile}
								className="flex-1 px-4 py-2 text-white transition-all rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
							>
								保存
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Emotional Analyzer Modal */}
			{showEmotionalAnalyzer && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="bg-white shadow-2xl rounded-2xl">
							<div className="flex items-center justify-between p-4 border-b border-gray-200">
								<h2 className="text-xl font-bold text-gray-800">
									情緒分析助手
								</h2>
								<button
									onClick={() =>
										setShowEmotionalAnalyzer(false)
									}
									className="text-gray-500 hover:text-gray-700"
								>
									✕
								</button>
							</div>
							<div className="p-6">
								<EmotionalAnalyzer
									onAnalysisComplete={handleAnalysisComplete}
									userProfile={userProfile}
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Birthday Analyzer Modal */}
			{showBirthdayAnalyzer && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="bg-white shadow-2xl rounded-2xl">
							<div className="flex items-center justify-between p-4 border-b border-gray-200">
								<h2 className="text-xl font-bold text-gray-800">
									生辰八字分析
								</h2>
								<button
									onClick={() =>
										setShowBirthdayAnalyzer(false)
									}
									className="text-gray-500 hover:text-gray-700"
								>
									✕
								</button>
							</div>
							<div className="p-6">
								<BirthdayAnalyzer
									onAnalysisComplete={handleAnalysisComplete}
									userProfile={userProfile}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
