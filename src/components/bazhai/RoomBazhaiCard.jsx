"use client";

import { useState } from "react";

const categoryColors = {
	家具擺放: "bg-green-500",
	元素色彩: "bg-blue-500",
	生活習慣: "bg-yellow-500",
	擺放禁忌: "bg-red-500",
};

const categoryIcons = {
	家具擺放: "🪑",
	元素色彩: "🎨",
	生活習慣: "⏰",
	擺放禁忌: "⚠️",
};

export default function RoomBazhaiCard({ roomAnalysis, mingGuaInfo }) {
	const [activeTab, setActiveTab] = useState("analysis");

	// 解析AI分析為結構化格式
	const parseAnalysis = (aiText) => {
		const sections = {
			家具擺放: [],
			元素色彩: [],
			生活習慣: [],
			擺放禁忌: [],
		};

		const lines = aiText
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0);
		let currentSection = null;

		lines.forEach((line) => {
			// 檢查是否為新的分類標題
			if (line.includes("家具擺放") || line.includes("【家具擺放】")) {
				currentSection = "家具擺放";
			} else if (
				line.includes("元素色彩") ||
				line.includes("【元素色彩】")
			) {
				currentSection = "元素色彩";
			} else if (
				line.includes("生活習慣") ||
				line.includes("【生活習慣】")
			) {
				currentSection = "生活習慣";
			} else if (
				line.includes("擺放禁忌") ||
				line.includes("【擺放禁忌】")
			) {
				currentSection = "擺放禁忌";
			} else if (
				currentSection &&
				(line.startsWith("•") ||
					line.startsWith("-") ||
					line.startsWith("1.") ||
					line.startsWith("2.") ||
					line.startsWith("3.") ||
					line.startsWith("4.") ||
					line.match(/^\d+\./))
			) {
				const cleanLine = line.replace(/^[•\-\d\.]\s*/, "").trim();
				if (cleanLine.length > 0) {
					sections[currentSection].push(cleanLine);
				}
			}
		});

		return sections;
	};

	const analysisData = parseAnalysis(roomAnalysis.aiAnalysis);
	const { fengShuiData } = roomAnalysis;

	const getBazhaiFortuneBadge = (fortune) => {
		const colors = {
			大吉: "bg-green-500",
			大凶: "bg-red-500",
			中吉: "bg-yellow-500",
			小凶: "bg-orange-500",
		};
		return colors[fortune] || "bg-gray-500";
	};

	const getCompatibilityColor = (compatibility) => {
		const colors = {
			生: "text-green-600 bg-green-100",
			剋: "text-red-600 bg-red-100",
			同: "text-blue-600 bg-blue-100",
		};
		return colors[compatibility] || "text-gray-600 bg-gray-100";
	};

	const getDirectionChinese = (direction) => {
		const directionMap = {
			north: "北方",
			northEast: "東北",
			east: "東方",
			southEast: "東南",
			south: "南方",
			southWest: "西南",
			west: "西方",
			northWest: "西北",
		};
		return directionMap[direction] || direction;
	};

	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden">
			{/* Header */}
			<div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
				<div className="flex justify-between items-start">
					<div>
						<h3 className="text-2xl font-bold mb-2">
							{getDirectionChinese(roomAnalysis.direction)}
						</h3>
						<p className="text-lg opacity-90 mb-2">
							{fengShuiData.trigram} · {fengShuiData.element}行
						</p>
						<div className="flex flex-wrap gap-2 mb-2">
							<span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
								房間類型：{roomAnalysis.roomType}
							</span>
							<span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
								{fengShuiData.energy}性
							</span>
						</div>
						<div className="text-sm">
							<span className="bg-white bg-opacity-20 px-2 py-1 rounded">
								命卦：{mingGuaInfo.trigram}卦 (
								{mingGuaInfo.group})
							</span>
						</div>
					</div>
					<div className="text-right space-y-2">
						<div
							className={`px-3 py-1 rounded-full text-sm font-bold ${
								fengShuiData.description === "吉"
									? "bg-green-500"
									: fengShuiData.description === "凶"
										? "bg-red-500"
										: "bg-yellow-500"
							}`}
						>
							流年：{fengShuiData.description}
						</div>
						<div
							className={`px-3 py-1 rounded-full text-sm font-bold ${getBazhaiFortuneBadge(roomAnalysis.bazhaiFortune)}`}
						>
							八宅：{roomAnalysis.bazhaiFortune}
						</div>
					</div>
				</div>
			</div>

			{/* 風水信息面板 */}
			<div className="p-4 bg-amber-50 border-b">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
					<div>
						<strong className="text-amber-800">2025年飛星：</strong>
						<br />
						<span className="text-purple-700">
							{fengShuiData.star2025}
						</span>
					</div>
					<div>
						<strong className="text-amber-800">五行相配：</strong>
						<br />
						<span
							className={`px-2 py-1 rounded text-xs font-medium ${getCompatibilityColor(roomAnalysis.mingGuaCompatibility)}`}
						>
							命{mingGuaInfo.element}
							{roomAnalysis.mingGuaCompatibility}
							{fengShuiData.element}
						</span>
					</div>
					<div>
						<strong className="text-amber-800">建議用途：</strong>
						<br />
						<span
							className={
								roomAnalysis.bazhaiFortune === "大吉"
									? "text-green-700"
									: "text-red-700"
							}
						>
							{roomAnalysis.bazhaiFortune === "大吉"
								? "主要生活空間"
								: "次要輔助空間"}
						</span>
					</div>
				</div>
			</div>

			{/* 分頁導航 */}
			<div className="flex border-b">
				<button
					className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
						activeTab === "analysis"
							? "bg-amber-100 text-amber-800 border-b-2 border-amber-600"
							: "text-gray-600 hover:text-amber-600 hover:bg-gray-50"
					}`}
					onClick={() => setActiveTab("analysis")}
				>
					🏠 八宅風水分析
				</button>
				<button
					className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
						activeTab === "raw"
							? "bg-amber-100 text-amber-800 border-b-2 border-amber-600"
							: "text-gray-600 hover:text-amber-600 hover:bg-gray-50"
					}`}
					onClick={() => setActiveTab("raw")}
				>
					🤖 AI詳細分析
				</button>
			</div>

			{/* 內容區域 */}
			<div className="p-6">
				{activeTab === "analysis" ? (
					<div className="space-y-6">
						{Object.entries(analysisData).map(
							([category, items]) => (
								<div key={category} className="space-y-3">
									<h4
										className={`${categoryColors[category]} text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center`}
									>
										<span className="mr-2">
											{categoryIcons[category]}
										</span>
										{category}
									</h4>
									{items.length > 0 ? (
										<ul className="space-y-2 ml-4">
											{items.map((item, index) => (
												<li
													key={index}
													className="flex items-start"
												>
													<span className="text-amber-600 mr-2 mt-1">
														•
													</span>
													<span className="text-gray-700 text-sm leading-relaxed">
														{item}
													</span>
												</li>
											))}
										</ul>
									) : (
										<p className="text-gray-500 text-sm ml-4">
											暫無具體建議
										</p>
									)}
								</div>
							)
						)}

						{/* 如果沒有解析到任何內容，顯示提示 */}
						{Object.values(analysisData).every(
							(items) => items.length === 0
						) && (
							<div className="text-center py-8">
								<p className="text-gray-500 mb-4">
									AI分析內容格式特殊，請查看詳細分析頁面
								</p>
								<button
									onClick={() => setActiveTab("raw")}
									className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
								>
									查看AI詳細分析
								</button>
							</div>
						)}
					</div>
				) : (
					<div className="prose max-w-none">
						<div className="bg-gray-50 p-4 rounded-lg">
							<h4 className="font-bold mb-3 text-gray-800 flex items-center">
								<span className="mr-2">🤖</span>
								AI專業八宅風水分析：
							</h4>
							<div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
								{roomAnalysis.aiAnalysis}
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="px-6 py-4 bg-gray-50 border-t">
				<div className="flex justify-between items-center text-xs text-gray-500">
					<div className="space-x-4">
						<span>房間ID: {roomAnalysis.roomId}</span>
						<span>
							位置: ({Math.round(roomAnalysis.position?.x || 0)},{" "}
							{Math.round(roomAnalysis.position?.y || 0)})
						</span>
					</div>
					<span>
						分析時間:{" "}
						{new Date(roomAnalysis.timestamp).toLocaleString(
							"zh-TW"
						)}
					</span>
				</div>
			</div>
		</div>
	);
}
