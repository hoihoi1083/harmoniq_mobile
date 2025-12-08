"use client";

import React from "react";
import Image from "next/image";
import { getRelationshipColor } from "@/lib/baziRelationships";

/**
 * BaZi Stem-Branch Relationship Diagram
 * Shows four pillars with connecting lines for relationships
 * Tab 1: 干支圖況
 */
export default function BaziRelationshipDiagram({ baziData }) {
	const { pillars, relationships, lunarDate } = baziData;

	const pillarOrder = ["year", "month", "day", "hour"];
	const pillarLabels = {
		year: "年柱",
		month: "月柱",
		day: "日柱",
		hour: "時柱",
	};

	// Format pillars with labels
	const formattedPillars = pillarOrder.map(key => ({
		...pillars[key],
		label: pillarLabels[key],
		combined: pillars[key].stem + pillars[key].branch
	}));

	// Get zodiac animal for year branch
	const zodiacMap = {
		"子": "rat", "鼠": "rat",
		"丑": "ox", "牛": "ox",
		"寅": "tiger", "虎": "tiger",
		"卯": "rabbit", "兔": "rabbit",
		"辰": "dragon", "龍": "dragon",
		"巳": "snake", "蛇": "snake",
		"午": "horse", "馬": "horse",
		"未": "goat", "羊": "goat",
		"申": "monkey", "猴": "monkey",
		"酉": "rooster", "雞": "rooster",
		"戌": "dog", "狗": "dog",
		"亥": "pig", "豬": "pig"
	};

	const yearBranch = pillars?.year?.branch || "子";
	const zodiacAnimal = zodiacMap[yearBranch] || "rat";

	// Element colors for pillars
	const elementColors = {
		"金": "#B8860B",
		"木": "#228B22", 
		"水": "#1E90FF",
		"火": "#DC143C",
		"土": "#D2691E"
	};

	// Get element from stem/branch
	const getElementFromStem = (stem) => {
		const stemElements = {
			"甲": "木", "乙": "木",
			"丙": "火", "丁": "火",
			"戊": "土", "己": "土",
			"庚": "金", "辛": "金",
			"壬": "水", "癸": "水"
		};
		return stemElements[stem] || "土";
	};

	// Deduplicate relationships
	const getUniqueStemCombinations = () => {
		if (!relationships.stemCombinations) return [];
		const seen = new Set();
		return relationships.stemCombinations.filter(combo => {
			const key = [combo.stem1, combo.stem2].sort().join('') + combo.type;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	};

	const getUniqueBranchRelationships = () => {
		if (!relationships.branchRelationships) return [];
		const seen = new Set();
		return relationships.branchRelationships.filter(rel => {
			const key = [rel.branch1, rel.branch2].sort().join('') + rel.type;
			if (seen.has(key)) return false;
			seen.add(key);
			return true;
		});
	};

	const uniqueStemCombos = getUniqueStemCombinations();
	const uniqueBranchRels = getUniqueBranchRelationships();

	return (
		<div className="w-full min-h-screen p-4 bg-gradient-to-b from-gray-50 to-white">
			{/* Header with Zodiac Animal and Dates - No title */}
			<div className="p-4 mb-4 bg-white rounded-2xl shadow-sm">
				<div className="flex items-center gap-4">
					{/* Zodiac Animal */}
					<div className="relative w-24 h-24 flex-shrink-0">
						<Image
							src={`/images/animals/${zodiacAnimal}.png`}
							alt={yearBranch}
							fill
							className="object-contain"
							priority
						/>
					</div>
					
					{/* Date Info */}
					<div className="flex flex-col gap-2 flex-1">
						<div className="flex items-center gap-2">
							<span className="px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">農曆</span>
							<span className="text-sm text-gray-700">
								{lunarDate?.formatted || baziData?.lunarDateString || "農曆資料"}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">陽曆</span>
							<span className="text-sm text-gray-700">{baziData.birthDateTime}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Four Pillars Display */}
			<div className="p-6 mb-4 bg-white rounded-2xl shadow-sm">
				<div className="grid grid-cols-4 gap-3">
					{formattedPillars.map((pillar, index) => {
						const stemElement = getElementFromStem(pillar.stem);
						const stemColor = elementColors[stemElement];
						
						return (
							<div key={pillarOrder[index]} className="text-center">
								<div className="mb-2 text-xs text-gray-500 font-medium">
									{pillar.label}
								</div>
								<div 
									className="text-2xl font-bold mb-1"
									style={{ color: stemColor }}
								>
									{pillar.stem}
								</div>
								<div 
									className="text-2xl font-bold"
									style={{ color: stemColor }}
								>
									{pillar.branch}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Relationship Diagram with Visual Connections */}
			<div className="p-6 mb-4 bg-white rounded-2xl shadow-sm">
				<div className="relative">
					{/* Visual pillar circles for quick overview */}
					<div className="flex justify-around mb-6">
						{formattedPillars.map((pillar, index) => {
							const stemElement = getElementFromStem(pillar.stem);
							
							return (
								<div key={pillarOrder[index]} className="flex flex-col items-center">
									<div 
										className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold bg-white shadow-sm"
										style={{ borderColor: elementColors[stemElement] }}
									>
										{pillar.stem}
									</div>
									<div className="mt-1 text-xs text-gray-400">
										{pillar.label.substring(0, 2)}
									</div>
								</div>
							);
						})}
					</div>

					{/* Detailed Relationship Cards */}
					<div className="space-y-3">
						{/* Stem Relationships */}
						{uniqueStemCombos.length > 0 && (
							<div className="mb-4">
								<h3 className="mb-3 text-sm font-semibold text-gray-700">天干關係</h3>
								<div className="space-y-2">
									{uniqueStemCombos.map((combo, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
											style={{
												borderLeft: `4px solid ${getRelationshipColor(combo.type)}`,
											}}
										>
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs bg-white" style={{ borderColor: getRelationshipColor(combo.type) }}>
													{combo.stem1}
												</div>
												<span className="text-gray-500">+</span>
												<div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs bg-white" style={{ borderColor: getRelationshipColor(combo.type) }}>
													{combo.stem2}
												</div>
											</div>
											<div>
												<span
													className="px-3 py-1 text-sm font-semibold rounded-full"
													style={{
														backgroundColor: getRelationshipColor(combo.type) + "20",
														color: getRelationshipColor(combo.type),
													}}
												>
													{combo.isHidden ? "暗" : ""}{combo.type}
												</span>
											</div>
											<div className="text-xs text-gray-500">
												{combo.pillar1}柱 ↔ {combo.pillar2}柱
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Branch Relationships */}
						{uniqueBranchRels.length > 0 && (
							<div className="mb-4">
								<h3 className="mb-3 text-sm font-semibold text-gray-700">地支關係</h3>
								<div className="space-y-2">
									{uniqueBranchRels.map((rel, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
											style={{
												borderLeft: `4px solid ${getRelationshipColor(rel.type)}`,
											}}
										>
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs bg-white" style={{ borderColor: getRelationshipColor(rel.type) }}>
													{rel.branch1}
												</div>
												<span className="text-gray-500">+</span>
												<div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs bg-white" style={{ borderColor: getRelationshipColor(rel.type) }}>
													{rel.branch2}
												</div>
											</div>
											<div>
												<span
													className="px-3 py-1 text-sm font-semibold rounded-full"
													style={{
														backgroundColor: getRelationshipColor(rel.type) + "20",
														color: getRelationshipColor(rel.type),
													}}
												>
													{rel.type}
												</span>
											</div>
											<div className="text-xs text-gray-500">
												{rel.pillar1}柱 ↔ {rel.pillar2}柱
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Three Harmonies */}
						{relationships.threeHarmonies && relationships.threeHarmonies.length > 0 && (
							<div>
								<h3 className="mb-3 text-sm font-semibold text-gray-700">三合局</h3>
								<div className="space-y-2">
									{relationships.threeHarmonies.map((harmony, index) => (
										<div
											key={index}
											className="flex items-center justify-between p-3 border-l-4 border-green-500 rounded-lg bg-green-50"
										>
											<div className="flex items-center space-x-2">
												{harmony.branches.map((branch, i) => (
													<React.Fragment key={i}>
														<span className="font-bold text-gray-800">{branch}</span>
														{i < harmony.branches.length - 1 && (
															<span className="text-gray-500">+</span>
														)}
													</React.Fragment>
												))}
											</div>
											<div>
												<span className="px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
													{harmony.type}
												</span>
											</div>
											<div className="text-xs text-gray-500">
												{harmony.pillars.join("、")}柱
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Empty state */}
						{uniqueStemCombos.length === 0 &&
						 uniqueBranchRels.length === 0 &&
						 (!relationships.threeHarmonies || relationships.threeHarmonies.length === 0) && (
							<div className="py-8 text-center text-gray-400 text-sm">
								此命盤未發現明顯的干支特殊關係
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Relationship Summary/Conclusion */}
			{relationships.notes && relationships.notes.length > 0 && (
				<div className="p-4 rounded-2xl bg-purple-50">
					<h3 className="mb-2 text-sm font-semibold text-gray-700">關係摘要</h3>
					<div className="text-sm leading-relaxed text-gray-600">
						{relationships.notes.join("；")}
					</div>
				</div>
			)}
		</div>
	);
}
