"use client";

import { useState } from "react";

export default function MingGuaInfo({
	mingGuaInfo,
	userProfile,
	designSummary,
}) {
	const [showDetails, setShowDetails] = useState(false);

	const getGroupColor = (group) => {
		return group === "東四命" ? "bg-green-500" : "bg-blue-500";
	};

	const getGroupTextColor = (group) => {
		return group === "東四命" ? "text-green-800" : "text-blue-800";
	};

	const getCompatibilityScore = () => {
		const totalRooms = designSummary.totalRooms;
		const auspiciousRooms = designSummary.auspiciousRooms;
		if (totalRooms === 0) return 0;
		return Math.round((auspiciousRooms / totalRooms) * 100);
	};

	const getScoreColor = (score) => {
		if (score >= 70) return "text-green-600";
		if (score >= 50) return "text-yellow-600";
		return "text-red-600";
	};

	const getScoreBg = (score) => {
		if (score >= 70) return "bg-green-100";
		if (score >= 50) return "bg-yellow-100";
		return "bg-red-100";
	};

	const compatibilityScore = getCompatibilityScore();

	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden">
			{/* Header */}
			<div
				className={`${getGroupColor(mingGuaInfo.group)} text-white p-6`}
			>
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-3xl font-bold mb-2">
							命主命卦分析
						</h2>
						<p className="text-lg opacity-90">
							{mingGuaInfo.name} · {mingGuaInfo.group}
						</p>
					</div>
					<div className="text-right">
						<div className="text-4xl mb-2">
							{mingGuaInfo.group === "東四命" ? "🌳" : "⛰️"}
						</div>
						<div className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
							命卦數字：{mingGuaInfo.number}
						</div>
					</div>
				</div>
			</div>

			<div className="p-6">
				{/* 基本信息網格 */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{/* 個人資料 */}
					<div className="bg-gray-50 p-4 rounded-lg">
						<h3 className="font-bold text-gray-800 mb-3 flex items-center">
							<span className="mr-2">👤</span>
							個人資料
						</h3>
						<div className="space-y-2 text-sm">
							<div>
								<span className="text-gray-600">性別：</span>
								<span className="font-medium">
									{userProfile.gender}
								</span>
							</div>
							<div>
								<span className="text-gray-600">出生年：</span>
								<span className="font-medium">
									{userProfile.birthYear}年
								</span>
							</div>
							<div>
								<span className="text-gray-600">生肖：</span>
								<span className="font-medium">
									{userProfile.birthYear
										? getZodiac(userProfile.birthYear)
										: "未知"}
								</span>
							</div>
						</div>
					</div>

					{/* 命卦屬性 */}
					<div className="bg-amber-50 p-4 rounded-lg">
						<h3 className="font-bold text-amber-800 mb-3 flex items-center">
							<span className="mr-2">⚡</span>
							命卦屬性
						</h3>
						<div className="space-y-2 text-sm">
							<div>
								<span className="text-gray-600">卦象：</span>
								<span className="font-bold text-amber-700">
									{mingGuaInfo.trigram}卦
								</span>
							</div>
							<div>
								<span className="text-gray-600">五行：</span>
								<span className="font-medium">
									{mingGuaInfo.element}
								</span>
							</div>
							<div>
								<span className="text-gray-600">
									本命方位：
								</span>
								<span className="font-medium">
									{getDirectionChinese(mingGuaInfo.direction)}
								</span>
							</div>
						</div>
					</div>

					{/* 住宅配對 */}
					<div
						className={`${getScoreBg(compatibilityScore)} p-4 rounded-lg`}
					>
						<h3
							className={`font-bold mb-3 flex items-center ${getScoreColor(compatibilityScore)}`}
						>
							<span className="mr-2">🏠</span>
							住宅配對
						</h3>
						<div className="space-y-2 text-sm">
							<div>
								<span className="text-gray-600">適配度：</span>
								<span
									className={`font-bold text-2xl ${getScoreColor(compatibilityScore)}`}
								>
									{compatibilityScore}%
								</span>
							</div>
							<div>
								<span className="text-gray-600">
									吉方房間：
								</span>
								<span className="font-medium text-green-600">
									{designSummary.auspiciousRooms}間
								</span>
							</div>
							<div>
								<span className="text-gray-600">
									凶方房間：
								</span>
								<span className="font-medium text-red-600">
									{designSummary.inauspiciousRooms}間
								</span>
							</div>
						</div>
					</div>

					{/* 年運概況 */}
					<div className="bg-purple-50 p-4 rounded-lg">
						<h3 className="font-bold text-purple-800 mb-3 flex items-center">
							<span className="mr-2">🐍</span>
							2025年運
						</h3>
						<div className="space-y-2 text-sm">
							<div>
								<span className="text-gray-600">流年：</span>
								<span className="font-medium">乙巳蛇年</span>
							</div>
							<div>
								<span className="text-gray-600">
									重點方位：
								</span>
								<span className="font-medium">
									東南（一白貪狼）
								</span>
							</div>
							<div>
								<span className="text-gray-600">
									避忌方位：
								</span>
								<span className="font-medium text-red-600">
									東北（五黃廉貞）
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* 詳細信息切換 */}
				<div className="border-t pt-6">
					<button
						onClick={() => setShowDetails(!showDetails)}
						className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
					>
						<span className="font-medium text-gray-800">
							{showDetails ? "隱藏" : "顯示"}詳細命卦信息
						</span>
						<span
							className={`transform transition-transform ${showDetails ? "rotate-180" : ""}`}
						>
							⬇️
						</span>
					</button>

					{showDetails && (
						<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* 四大吉方 */}
							<div className="bg-green-50 p-6 rounded-lg">
								<h4 className="font-bold text-green-800 mb-4 flex items-center">
									<span className="mr-2">✅</span>
									四大吉方
								</h4>
								<div className="space-y-3">
									{mingGuaInfo.group === "東四命"
										? [
												{
													direction: "東方",
													trigram: "震宮",
													effect: "延年位 - 事業發展",
												},
												{
													direction: "南方",
													trigram: "離宮",
													effect: "生氣位 - 財運興旺",
												},
												{
													direction: "北方",
													trigram: "坎宮",
													effect: "天醫位 - 身體健康",
												},
												{
													direction: "東南",
													trigram: "巽宮",
													effect: "伏位 - 平安穩定",
												},
											]
										: [
												{
													direction: "西方",
													trigram: "兌宮",
													effect: "延年位 - 事業發展",
												},
												{
													direction: "西北",
													trigram: "乾宮",
													effect: "生氣位 - 財運興旺",
												},
												{
													direction: "西南",
													trigram: "坤宮",
													effect: "天醫位 - 身體健康",
												},
												{
													direction: "東北",
													trigram: "艮宮",
													effect: "伏位 - 平安穩定",
												},
											].map((item, index) => (
												<div
													key={index}
													className="flex justify-between items-center"
												>
													<span className="font-medium">
														{item.direction}（
														{item.trigram}）
													</span>
													<span className="text-sm text-green-700">
														{item.effect}
													</span>
												</div>
											))}
								</div>
							</div>

							{/* 四大凶方 */}
							<div className="bg-red-50 p-6 rounded-lg">
								<h4 className="font-bold text-red-800 mb-4 flex items-center">
									<span className="mr-2">❌</span>
									四大凶方
								</h4>
								<div className="space-y-3">
									{mingGuaInfo.group === "東四命"
										? [
												{
													direction: "西方",
													trigram: "兌宮",
													effect: "絕命位 - 嚴重不利",
												},
												{
													direction: "西北",
													trigram: "乾宮",
													effect: "五鬼位 - 是非災禍",
												},
												{
													direction: "西南",
													trigram: "坤宮",
													effect: "六煞位 - 疾病損財",
												},
												{
													direction: "東北",
													trigram: "艮宮",
													effect: "禍害位 - 口舌紛爭",
												},
											]
										: [
												{
													direction: "東方",
													trigram: "震宮",
													effect: "絕命位 - 嚴重不利",
												},
												{
													direction: "南方",
													trigram: "離宮",
													effect: "五鬼位 - 是非災禍",
												},
												{
													direction: "北方",
													trigram: "坎宮",
													effect: "六煞位 - 疾病損財",
												},
												{
													direction: "東南",
													trigram: "巽宮",
													effect: "禍害位 - 口舌紛爭",
												},
											].map((item, index) => (
												<div
													key={index}
													className="flex justify-between items-center"
												>
													<span className="font-medium">
														{item.direction}（
														{item.trigram}）
													</span>
													<span className="text-sm text-red-700">
														{item.effect}
													</span>
												</div>
											))}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// 輔助函數
function getDirectionChinese(direction) {
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
}

function getZodiac(year) {
	const zodiacAnimals = [
		"鼠",
		"牛",
		"虎",
		"兔",
		"龍",
		"蛇",
		"馬",
		"羊",
		"猴",
		"雞",
		"狗",
		"豬",
	];
	const startYear = 1900; // 鼠年
	const index = (year - startYear) % 12;
	return zodiacAnimals[index];
}
