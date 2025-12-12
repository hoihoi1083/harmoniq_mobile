"use client";

import React from "react";
import Image from "next/image";

/**
 * BaZi Day Master Personality Analysis
 * Shows day master character, five elements bar chart, and personality description
 * Tab 3: 本命天干
 */
export default function BaziPersonalityAnalysis({ baziData }) {
	const { dayMaster, elementDistribution } = baziData;

	// Element colors matching the screenshot
	const elementColors = {
		金: "#5B7FBF", // Blue
		木: "#4CAF50", // Green
		水: "#3F83C9", // Blue
		火: "#E35A5F", // Red
		土: "#D4A76A", // Brown/Gold
	};

	// Element order for display
	const elementOrder = ["金", "木", "水", "火", "土"];

	// Map day master stem to character image
	const characterImageMap = {
		甲: "/images/element-characters/甲木.png",
		乙: "/images/element-characters/乙木.PNG",
		丙: "/images/element-characters/丙火.PNG",
		丁: "/images/element-characters/丁火.png",
		戊: "/images/element-characters/戊土.PNG",
		己: "/images/element-characters/己土.png",
		庚: "/images/element-characters/庚金.png",
		辛: "/images/element-characters/辛金.png",
		壬: "/images/element-characters/壬水.PNG",
		癸: "/images/element-characters/癸水.PNG",
	};

	const characterImage = characterImageMap[dayMaster.stem];

	return (
		<div className="w-full min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
			{/* Day Master Info - No Header */}
			<div className="p-6 mb-4 text-center bg-white rounded-2xl shadow-sm">
				<div className="mb-2 text-lg text-gray-600">
					本命天干 {dayMaster.stem}
					{dayMaster.element}-{dayMaster.yinYang}
					{dayMaster.element}
				</div>
				<div
					className="inline-block px-6 py-3 mb-6 text-xl font-bold text-white rounded-full"
					style={{
						backgroundColor: elementColors[dayMaster.element],
					}}
				>
					{dayMaster.personality.title}
				</div>

				{/* Character Illustration */}
				<div className="flex justify-center mb-6">
					{characterImage ? (
						<div className="relative w-64 h-64">
							<Image
								src={characterImage}
								alt={`${dayMaster.stem}${dayMaster.element}`}
								fill
								className="object-contain"
								priority
							/>
						</div>
					) : (
						<div className="flex items-center justify-center w-64 h-64 rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
							<div className="text-center">
								<div className="mb-2 text-6xl font-bold text-blue-600">
									{dayMaster.stem}
								</div>
								<div className="text-sm text-gray-600">
									{dayMaster.element}・{dayMaster.yinYang}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Personality Traits */}
				<div
					className="p-4 mb-4 rounded-xl"
					style={{
						backgroundColor: `${elementColors[dayMaster.element]}15`,
					}}
				>
					<h3 className="mb-3 text-sm font-semibold text-gray-700">
						性格特質
					</h3>
					<div className="flex flex-wrap justify-center gap-2">
						{dayMaster.personality.traits.map((trait, index) => (
							<span
								key={index}
								className="px-4 py-2 text-sm font-medium text-white rounded-full shadow-sm"
								style={{
									backgroundColor:
										elementColors[dayMaster.element],
								}}
							>
								{trait}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Five Elements Distribution */}
			<div className="p-6 mb-4 bg-white rounded-2xl shadow-sm">
				<div className="space-y-3">
					{elementOrder.map((element) => {
						const percentage =
							elementDistribution.percentages[element];

						return (
							<div
								key={element}
								className="flex items-center gap-3"
							>
								<span className="text-base font-medium text-gray-700 w-8">
									{element}
								</span>
								<div className="flex-1 h-10 overflow-hidden bg-gray-100 rounded-full">
									<div
										className="h-full transition-all duration-500 rounded-full"
										style={{
											width: `${percentage}%`,
											backgroundColor:
												elementColors[element],
										}}
									/>
								</div>
								<span className="text-base font-semibold text-gray-700 w-12 text-right">
									{percentage}%
								</span>
							</div>
						);
					})}
				</div>
			</div>

			{/* Personality Analysis */}
			<div className="p-6 mb-4 bg-white rounded-2xl shadow-sm">
				<h3 className="mb-4 text-xl font-bold text-gray-800">
					人格簡析
				</h3>
				<p className="leading-relaxed text-gray-700 text-base">
					{dayMaster.personality.description}
				</p>
			</div>

			{/* Element Strength Analysis */}
			<div className="p-6 bg-white rounded-2xl shadow-sm">
				<h3 className="mb-4 text-xl font-bold text-gray-800">
					五行強弱分析
				</h3>
				<div className="space-y-3">
					{elementOrder.map((element) => {
						const percentage =
							elementDistribution.percentages[element];
						let strength = "";
						let advice = "";

						if (percentage === 0) {
							strength = "缺失";
							advice = `建議補強${element}元素，可通過顏色、方位、飾品等方式調節。`;
						} else if (percentage >= 30) {
							strength = "過旺";
							advice = `${element}元素偏旺，建議適當平衡，避免過度。`;
						} else if (percentage >= 15) {
							strength = "適中";
							advice = `${element}元素平衡良好。`;
						} else {
							strength = "偏弱";
							advice = `${element}元素偏弱，可適當補強。`;
						}

						if (
							percentage === 0 ||
							percentage >= 25 ||
							percentage <= 10
						) {
							return (
								<div
									key={element}
									className="p-4 rounded-xl"
									style={{
										backgroundColor: `${elementColors[element]}15`,
									}}
								>
									<div className="flex items-center justify-between mb-2">
										<span className="font-semibold text-gray-800 text-base">
											{element}
										</span>
										<span
											className="px-3 py-1 text-sm font-bold text-white rounded-full"
											style={{
												backgroundColor:
													elementColors[element],
											}}
										>
											{strength}
										</span>
									</div>
									<p className="text-sm text-gray-600 leading-relaxed">
										{advice}
									</p>
								</div>
							);
						}
						return null;
					})}
				</div>
			</div>
		</div>
	);
}
