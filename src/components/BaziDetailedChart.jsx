"use client";

import React from "react";
import { getDetailedChartData } from "@/lib/baziChartData";
import Image from "next/image";

/**
 * BaZi Detailed Chart Grid
 * Shows 12-row detailed breakdown with ten gods, stems, branches, hidden stems, etc.
 * Tab 2: 基本排盤
 */
export default function BaziDetailedChart({ baziData }) {
	try {
		const { pillars, lunarDate, relationships } = baziData;
		const detailedData = getDetailedChartData(baziData);

		// Debug logging
		console.log("🔍 BaziDetailedChart Debug:");
		console.log("lunarDate:", lunarDate);
		console.log("relationships:", relationships);
		console.log(
			"relationships.stemCombinations:",
			relationships?.stemCombinations
		);
		console.log(
			"relationships.branchRelationships:",
			relationships?.branchRelationships
		);
		console.log(
			"relationships.threeHarmonies:",
			relationships?.threeHarmonies
		);

		// Get zodiac animal for year branch
		const zodiacMap = {
			子: "rat",
			鼠: "rat",
			丑: "ox",
			牛: "ox",
			寅: "tiger",
			虎: "tiger",
			卯: "rabbit",
			兔: "rabbit",
			辰: "dragon",
			龍: "dragon",
			巳: "snake",
			蛇: "snake",
			午: "horse",
			馬: "horse",
			未: "goat",
			羊: "goat",
			申: "monkey",
			猴: "monkey",
			酉: "rooster",
			雞: "rooster",
			戌: "dog",
			狗: "dog",
			亥: "pig",
			豬: "pig",
		};

		const yearBranch = pillars?.year?.branch || "子";
		const zodiacAnimal = zodiacMap[yearBranch] || "rat";

		// Get命盤特徵 from relationships
		const getChartFeatures = () => {
			const features = [];

			// 天干關係
			if (
				relationships?.stemCombinations &&
				relationships.stemCombinations.length > 0
			) {
				relationships.stemCombinations.forEach((rel) => {
					features.push(
						`${rel.stem1}${rel.stem2}${rel.relationship}`
					);
				});
			}

			// 地支關係
			if (
				relationships?.branchRelationships &&
				relationships.branchRelationships.length > 0
			) {
				relationships.branchRelationships.forEach((rel) => {
					features.push(
						`${rel.branch1}${rel.branch2}${rel.relationship}`
					);
				});
			}

			// 三合局
			if (
				relationships?.threeHarmonies &&
				relationships.threeHarmonies.length > 0
			) {
				relationships.threeHarmonies.forEach((harmony) => {
					features.push(harmony.description);
				});
			}

			return features;
		};

		const chartFeatures = getChartFeatures();

		const pillarLabels = ["年柱", "月柱", "日柱", "時柱"];

		return (
			<div className="w-full min-h-screen p-4 pt-6 bg-gradient-to-b from-blue-50 to-white">
				{/* Date Info Card */}
				<div className="p-4 mb-4 bg-white rounded-lg shadow-sm">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							{/* Zodiac Animal Image */}
							<div className="relative w-16 h-16">
								<Image
									src={`/images/animals/${zodiacAnimal}.png`}
									alt={yearBranch}
									fill
									className="object-contain"
								/>
								<div className="absolute text-2xl font-bold text-yellow-600 -bottom-1 -right-1">
									{yearBranch}
								</div>
							</div>

							{/* Date Info */}
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="px-2 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded">
										農曆
									</span>
									<span className="text-sm text-gray-700">
										{lunarDate?.formatted ||
											baziData?.lunarDateString ||
											"農曆資料"}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="px-2 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded">
										陽曆
									</span>
									<span className="text-sm text-gray-700">
										{baziData.birthDateTime}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Four Pillars Display - Styled like screenshot */}
				<div className="p-4 mb-4 bg-white rounded-lg shadow-sm">
					<div className="grid grid-cols-4 gap-2">
						{pillarLabels.map((label, index) => {
							const key = ["year", "month", "day", "hour"][index];
							const pillar = pillars?.[key] || {};
							const isDayMaster = pillar?.isDayMaster || false;

							return (
								<div key={key} className="text-center">
									<div className="mb-1 text-xs text-gray-500">
										{label}
									</div>
									<div
										className={`p-2 rounded-lg ${isDayMaster ? "border-2 border-yellow-400 bg-yellow-50" : "bg-gray-50"}`}
									>
										<div className="text-xs text-gray-600 mb-1">
											{pillar?.stemTenGod || "-"}
										</div>
										<div className="text-3xl font-bold text-gray-800">
											{pillar?.stem || "-"}
										</div>
										<div className="text-2xl font-bold text-gray-600">
											{pillar?.branch || "-"}
										</div>
										{isDayMaster && (
											<div className="text-xs text-yellow-600 mt-1">
												日主
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Detailed Grid Table - Styled like screenshot */}
				<div className="overflow-x-auto bg-white rounded-lg shadow-sm">
					<table className="w-full border-collapse table-fixed">
						<thead>
							<tr>
								<th className="w-16 px-2 py-2 text-xs font-semibold text-center text-white border border-gray-300 bg-olive-600">
									項目
								</th>
								{pillarLabels.map((label, i) => (
									<th
										key={i}
										className="px-2 py-2 text-xs font-semibold text-center text-gray-700 bg-gray-100 border border-gray-300"
									>
										{label}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{/* Row 1: 干神 (Stem Ten Gods) */}
							<tr>
								<td className="px-2 py-2 text-xs font-bold text-center text-white border border-gray-300 bg-olive-500">
									干神
								</td>
								{(detailedData?.stemTenGods || []).map(
									(god, i) => (
										<td
											key={i}
											className="px-2 py-2 text-sm font-semibold text-center text-purple-700 bg-purple-50 border border-gray-300"
										>
											{god || "-"}
										</td>
									)
								)}
							</tr>

							{/* Row 2: 天干 (Heavenly Stems) */}
							<tr>
								<td className="px-2 py-2 text-xs font-bold text-center text-white border border-gray-300 bg-olive-500">
									天干
								</td>
								{detailedData.stems.map((stem, i) => (
									<td
										key={i}
										className="px-2 py-2 text-xl font-bold text-center text-blue-700 border border-gray-300"
									>
										{stem}
									</td>
								))}
							</tr>

							{/* Row 3: 地支 (Earthly Branches) */}
							<tr>
								<td className="px-2 py-2 text-xs font-bold text-center text-white border border-gray-300 bg-olive-500">
									地支
								</td>
								{detailedData.branches.map((branch, i) => (
									<td
										key={i}
										className="px-2 py-2 text-xl font-bold text-center text-green-700 bg-green-50 border border-gray-300"
									>
										{branch}
									</td>
								))}
							</tr>

							{/* Rows 4-6: 藏干 (Hidden Stems) */}
							{[0, 1, 2].map((rowIndex) => (
								<tr key={`hidden-${rowIndex}`}>
									<td className="px-2 py-2 text-xs font-bold text-center text-white border border-gray-300 bg-olive-500">
										{rowIndex === 0 ? "藏干" : ""}
									</td>
									{detailedData.hiddenStems.map(
										(pillarHidden, i) => {
											const hiddenData =
												pillarHidden[rowIndex];
											return (
												<td
													key={i}
													className="px-2 py-2 text-sm font-semibold text-center border border-gray-300"
													style={{
														color: hiddenData
															? getElementColor(
																	hiddenData[1]
																)
															: "#999",
													}}
												>
													{hiddenData
														? hiddenData[0]
														: "-"}
												</td>
											);
										}
									)}
								</tr>
							))}

							{/* Rows 7-9: 藏干神 (Hidden Stem Ten Gods) */}
							{[0, 1, 2].map((rowIndex) => (
								<tr key={`hidden-god-${rowIndex}`}>
									<td className="px-2 py-2 text-xs font-bold text-center text-white border border-gray-300 bg-olive-500">
										{rowIndex === 0 ? "藏干神" : ""}
									</td>
									{(
										detailedData?.hiddenStemTenGods || []
									).map((pillarGods, i) => (
										<td
											key={i}
											className="px-2 py-2 text-xs font-semibold text-center text-gray-700 border border-gray-300"
										>
											{pillarGods?.[rowIndex]
												? pillarGods[rowIndex].join(" ")
												: "-"}
										</td>
									))}
								</tr>
							))}

							{/* 納音 Nayin */}
							<tr>
								<td className="px-2 py-2 text-xs font-bold text-center text-white border border-gray-300 bg-olive-500">
									納音
								</td>
								{(
									detailedData?.nayin || ["-", "-", "-", "-"]
								).map((nayin, i) => (
									<td
										key={i}
										className="px-2 py-2 text-xs font-semibold text-center text-pink-700 bg-pink-50 border border-gray-300"
									>
										{nayin}
									</td>
								))}
							</tr>
						</tbody>
					</table>
				</div>

				{/* 命盤特徵 Section - Styled like screenshot */}
				<div className="mt-4">
					<div className="flex items-center gap-2 mb-2">
						<div className="w-1 h-6 bg-olive-500"></div>
						<h3 className="text-lg font-bold text-gray-800">
							命盤特徵
						</h3>
					</div>

					<div className="space-y-2">
						{/* 天干關係 */}
						{relationships?.stemCombinations &&
							relationships.stemCombinations.length > 0 &&
							(() => {
								// Deduplicate by creating unique keys
								const seen = new Set();
								const unique =
									relationships.stemCombinations.filter(
										(rel) => {
											const key = [rel.stem1, rel.stem2]
												.sort()
												.join("");
											if (seen.has(key)) return false;
											seen.add(key);
											return true;
										}
									);
								return unique.length > 0 ? (
									<div className="p-3 bg-white rounded-lg shadow-sm">
										<div className="mb-1 text-xs font-semibold text-olive-600">
											天干
										</div>
										<div className="text-sm text-gray-700">
											{unique.map((rel, i) => (
												<span key={i}>
													{rel.stem1}
													{rel.stem2}
													{rel.type ||
														rel.relationship ||
														"合"}
													{i < unique.length - 1 &&
														"；"}
												</span>
											))}
										</div>
									</div>
								) : null;
							})()}

						{/* 地支關係 */}
						{relationships?.branchRelationships &&
							relationships.branchRelationships.length > 0 &&
							(() => {
								// Deduplicate by creating unique keys
								const seen = new Set();
								const unique =
									relationships.branchRelationships.filter(
										(rel) => {
											const key =
												[rel.branch1, rel.branch2]
													.sort()
													.join("") +
												rel.relationship;
											if (seen.has(key)) return false;
											seen.add(key);
											return true;
										}
									);
								return unique.length > 0 ? (
									<div className="p-3 bg-white rounded-lg shadow-sm">
										<div className="mb-1 text-xs font-semibold text-olive-600">
											地支
										</div>
										<div className="text-sm text-gray-700">
											{unique.map((rel, i) => (
												<span key={i}>
													{rel.branch1}
													{rel.branch2}
													{rel.relationship}
													{i < unique.length - 1 &&
														"；"}
												</span>
											))}
										</div>
									</div>
								) : null;
							})()}

						{/* 三合局 */}
						{relationships?.threeHarmonies &&
							relationships.threeHarmonies.length > 0 && (
								<div className="p-3 bg-white rounded-lg shadow-sm">
									<div className="mb-1 text-xs font-semibold text-olive-600">
										整柱
									</div>
									<div className="text-sm text-gray-700">
										{relationships.threeHarmonies.map(
											(harmony, i) => (
												<span key={i}>
													{harmony.branches
														? harmony.branches.join(
																""
															)
														: ""}
													{harmony.type || ""}
													{i <
														relationships
															.threeHarmonies
															.length -
															1 && "；"}
												</span>
											)
										)}
									</div>
								</div>
							)}

						{/* Show fallback only if NO relationships exist */}
						{(!relationships?.stemCombinations ||
							relationships.stemCombinations.length === 0) &&
							(!relationships?.branchRelationships ||
								relationships.branchRelationships.length ===
									0) && (
								<div className="p-3 text-sm text-center text-gray-500 bg-white rounded-lg shadow-sm">
									無特殊命盤特徵
								</div>
							)}
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.error("BaziDetailedChart error:", error);
		return (
			<div className="w-full min-h-screen p-4 pt-6 bg-gradient-to-b from-blue-50 to-white">
				<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
					<h3 className="text-lg font-bold text-red-700 mb-2">
						載入錯誤
					</h3>
					<p className="text-sm text-red-600">
						無法顯示八字詳細排盤，請重試。
					</p>
					<p className="text-xs text-red-500 mt-2">{error.message}</p>
				</div>
			</div>
		);
	}
}

// Helper function to get element color
function getElementColor(element) {
	const colors = {
		金: "#b8860b", // Gold
		木: "#22c55e", // Green
		水: "#3b82f6", // Blue
		火: "#ef4444", // Red
		土: "#d97706", // Brown/Orange
	};
	return colors[element] || "#6b7280";
}
