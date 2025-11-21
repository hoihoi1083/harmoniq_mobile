// Personal Response System Test Interface
"use client";

import { useState } from "react";
import {
	analyzeUserEmotion,
	detectTopic,
	generatePersonalResponse,
	getElement,
} from "@/lib/personalResponseSystem";

export default function PersonalResponseTest() {
	const [testMessage, setTestMessage] = useState("");
	const [testProfile, setTestProfile] = useState({
		name: "測試用戶",
		birthday: "1990-01-01",
	});
	const [result, setResult] = useState(null);

	const runTest = () => {
		if (!testMessage.trim()) return;

		const emotion = analyzeUserEmotion(testMessage);
		const topic = detectTopic(testMessage);
		const element = testProfile.birthday
			? getElement(new Date(testProfile.birthday).getFullYear())
			: null;
		const response = generatePersonalResponse(
			testMessage,
			testProfile,
			emotion,
			topic
		);

		setResult({
			emotion,
			topic,
			element,
			response,
		});
	};

	const presetScenarios = [
		{
			name: "工作壓力 + 感情問題",
			message: "我工作壓力好大，另一半又要分手，覺得好焦慮",
			profile: { name: "阿明", birthday: "1990-05-15" },
		},
		{
			name: "財運差",
			message: "最近財運好差，投資蝕晒錢，好擔心",
			profile: { name: "小玲", birthday: "1985-12-03" },
		},
		{
			name: "健康問題",
			message: "經常失眠，身體好差，唔知點算",
			profile: { name: "志華", birthday: "1992-08-20" },
		},
		{
			name: "危機情況",
			message: "覺得活不下去，想死",
			profile: { name: "小美", birthday: "1988-06-10" },
		},
		{
			name: "開心想改運",
			message: "今日好開心，想改善下屋企風水",
			profile: { name: "大偉", birthday: "1993-03-25" },
		},
	];

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<div className="bg-white rounded-lg shadow-md p-6">
				<h1 className="text-2xl font-bold mb-4">
					🧪 個人化回應系統測試
				</h1>

				{/* User Profile Input */}
				<div className="grid grid-cols-2 gap-4 mb-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							用戶名稱
						</label>
						<input
							type="text"
							value={testProfile.name}
							onChange={(e) =>
								setTestProfile((prev) => ({
									...prev,
									name: e.target.value,
								}))
							}
							className="w-full px-3 py-2 border rounded-md"
							placeholder="輸入用戶名稱"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">
							生日
						</label>
						<input
							type="date"
							value={testProfile.birthday}
							onChange={(e) =>
								setTestProfile((prev) => ({
									...prev,
									birthday: e.target.value,
								}))
							}
							className="w-full px-3 py-2 border rounded-md"
						/>
					</div>
				</div>

				{/* Message Input */}
				<div className="mb-4">
					<label className="block text-sm font-medium mb-2">
						用戶訊息
					</label>
					<textarea
						value={testMessage}
						onChange={(e) => setTestMessage(e.target.value)}
						className="w-full px-3 py-2 border rounded-md h-20"
						placeholder="輸入用戶訊息進行測試..."
					/>
				</div>

				<button
					onClick={runTest}
					className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
				>
					🧪 測試回應
				</button>
			</div>

			{/* Preset Scenarios */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-bold mb-4">📋 預設情境測試</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
					{presetScenarios.map((scenario, index) => (
						<button
							key={index}
							onClick={() => {
								setTestMessage(scenario.message);
								setTestProfile(scenario.profile);
							}}
							className="p-3 text-left border rounded-md hover:bg-gray-50 transition-colors"
						>
							<div className="font-medium text-sm">
								{scenario.name}
							</div>
							<div className="text-xs text-gray-600 mt-1">
								{scenario.profile.name} (
								{scenario.profile.birthday})
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Results */}
			{result && (
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-bold mb-4">📊 分析結果</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
						<div className="p-3 bg-blue-50 rounded-md">
							<div className="text-sm font-medium text-blue-800">
								情緒分析
							</div>
							<div className="text-lg font-bold text-blue-900">
								{result.emotion}
							</div>
						</div>
						<div className="p-3 bg-green-50 rounded-md">
							<div className="text-sm font-medium text-green-800">
								話題分類
							</div>
							<div className="text-lg font-bold text-green-900">
								{result.topic}
							</div>
						</div>
						<div className="p-3 bg-purple-50 rounded-md">
							<div className="text-sm font-medium text-purple-800">
								五行屬性
							</div>
							<div className="text-lg font-bold text-purple-900">
								{result.element}命
							</div>
						</div>
					</div>

					<div className="p-4 bg-gray-50 rounded-md">
						<div className="text-sm font-medium text-gray-700 mb-2">
							個人化回應
						</div>
						<div className="whitespace-pre-wrap text-gray-900">
							{result.response}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
