"use client";

import { useState, useEffect } from "react";
import { Users, BarChart3, TrendingUp, Target, Scale } from "lucide-react";
import { useCoupleAnalysis } from "@/contexts/CoupleAnalysisContext";

const CoupleWuxingAnalysis = ({
	user1,
	user2,
	calculateWuxingAnalysis,
	analyzeWuxingStrength,
	determineUsefulGods,
}) => {
	const { analysisData, loading: aiLoading, error } = useCoupleAnalysis();
	const [analysisResult, setAnalysisResult] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (analysisData) {
			// Use available AI data and enhance with basic analysis
			const user1BasicAnalysis = generateBasicAnalysis(user1);
			const user2BasicAnalysis = generateBasicAnalysis(user2);

			// Generate couple balance analysis even with AI data
			const coupleBalance =
				user1BasicAnalysis?.elementCounts &&
				user2BasicAnalysis?.elementCounts
					? analyzeCoupleElementBalance(
							user1BasicAnalysis.elementCounts,
							user2BasicAnalysis.elementCounts
						)
					: {
							advice:
								analysisData.wuxingAnalysis?.balanceAdvice ||
								(analysisData.advice &&
								analysisData.advice.length > 0
									? analysisData.advice[0]
									: "根據AI分析，建議保持五行平衡以增進關係和諧"),
						};

			setAnalysisResult({
				user1Analysis: {
					dominantElement:
						user1BasicAnalysis?.dominantElement || "未知",
					elementBalance:
						analysisData.wuxingAnalysis?.user1?.elementBalance ||
						"根據生辰八字分析平衡度",
					strengths: analysisData.wuxingAnalysis?.user1
						?.strengths || [
						`${user1BasicAnalysis?.dominantElement}命特質明顯`,
						"性格穩定有特色",
						"具備獨特優勢",
					],
					weaknesses: analysisData.wuxingAnalysis?.user1
						?.weaknesses || ["需要五行調和", "建議增強互補元素"],
					...user1BasicAnalysis,
				},
				user2Analysis: {
					dominantElement:
						user2BasicAnalysis?.dominantElement || "未知",
					elementBalance:
						analysisData.wuxingAnalysis?.user2?.elementBalance ||
						"根據生辰八字分析平衡度",
					strengths: analysisData.wuxingAnalysis?.user2
						?.strengths || [
						`${user2BasicAnalysis?.dominantElement}命特質明顯`,
						"性格穩定有特色",
						"具備獨特優勢",
					],
					weaknesses: analysisData.wuxingAnalysis?.user2
						?.weaknesses || ["需要五行調和", "建議增強互補元素"],
					...user2BasicAnalysis,
				},
				interaction:
					analysisData.wuxingAnalysis?.interaction ||
					`${user1BasicAnalysis?.dominantElement}命與${user2BasicAnalysis?.dominantElement}命的相互作用分析`,
				harmony:
					analysisData.wuxingAnalysis?.harmony ||
					`根據AI分析，整體配對評分為${analysisData.compatibility?.score || 75}分，屬於${analysisData.compatibility?.level || "良好匹配"}`,
				combinedAnalysis:
					generateCombinedAnalysisFromCompatibility(analysisData),
				recommendations:
					generateRecommendationsFromCompatibility(analysisData),
				user1UsefulGods: user1BasicAnalysis?.usefulGods || [],
				user2UsefulGods: user2BasicAnalysis?.usefulGods || [],
				coupleBalance,
				mutualSupport:
					user1BasicAnalysis?.dominantElement &&
					user2BasicAnalysis?.dominantElement &&
					user1BasicAnalysis?.usefulGods &&
					user2BasicAnalysis?.usefulGods
						? calculateMutualSupport(
								user1BasicAnalysis.dominantElement,
								user2BasicAnalysis.dominantElement,
								user1BasicAnalysis.usefulGods,
								user2BasicAnalysis.usefulGods
							)
						: {
								advice:
									analysisData.wuxingAnalysis?.mutualAdvice ||
									(analysisData.advice &&
									analysisData.advice.length > 1
										? analysisData.advice[1]
										: "根據AI分析建議保持五行平衡以增進相互支持"),
							},
			});
			setLoading(false);
		} else if (!aiLoading && !analysisData) {
			// Fallback to basic analysis if AI data is not available
			if (user1?.birthDateTime && user2?.birthDateTime) {
				performWuxingAnalysisFallback();
			}
		}
	}, [analysisData, aiLoading, user1, user2]);

	const generateBasicAnalysis = (user) => {
		// Generate basic wuxing data for compatibility with existing UI
		if (!user?.birthDateTime) return {};

		const basicAnalysis = calculateWuxingAnalysis(user);
		if (!basicAnalysis) return {};

		return {
			dominantElement: basicAnalysis.dominantElement,
			elementCounts: basicAnalysis.elementCounts,
			missingElements: basicAnalysis.missingElements,
			wuxingData: basicAnalysis.wuxingData,
			usefulGods: determineUsefulGods(basicAnalysis),
			strengths: analyzeWuxingStrength(basicAnalysis.elementCounts),
		};
	};

	const generateCombinedAnalysisFromAI = (wuxingData) => {
		// Combine both users' analysis for relationship insights
		return {
			compatibility: wuxingData.harmony || "評估中...",
			elementInteraction: wuxingData.interaction || "分析中...",
			balanceAssessment: `${wuxingData.user1?.dominantElement || "未知"} 與 ${wuxingData.user2?.dominantElement || "未知"} 的組合`,
			growthPotential: calculateGrowthPotentialFromAI(wuxingData),
		};
	};

	const generateRecommendationsFromAI = (wuxingData) => {
		// Generate actionable recommendations based on AI analysis
		const recommendations = [];

		if (wuxingData.user1?.weaknesses?.length) {
			recommendations.push({
				category: "個人平衡",
				suggestion: `建議加強 ${wuxingData.user1.weaknesses.join("、")} 元素`,
				target: "user1",
			});
		}

		if (wuxingData.user2?.weaknesses?.length) {
			recommendations.push({
				category: "個人平衡",
				suggestion: `建議加強 ${wuxingData.user2.weaknesses.join("、")} 元素`,
				target: "user2",
			});
		}

		recommendations.push({
			category: "關係和諧",
			suggestion: wuxingData.harmony || "持續培養相互理解與支持",
			target: "couple",
		});

		return recommendations;
	};

	const calculateGrowthPotentialFromAI = (wuxingData) => {
		// Assess relationship growth potential based on element interaction
		if (wuxingData.interaction?.includes("相生")) return "高成長潛力";
		if (wuxingData.interaction?.includes("相克")) return "需要調和";
		if (wuxingData.interaction?.includes("平衡")) return "穩定發展";
		return "持續觀察";
	};

	const generateCombinedAnalysisFromCompatibility = (analysisData) => {
		// Generate combined analysis using available compatibility data
		return {
			compatibility: `整體配對評分：${analysisData.compatibility?.score || 75}分`,
			elementInteraction:
				analysisData.compatibility?.description ||
				"五行相互作用分析中...",
			balanceAssessment: `基於AI分析的${analysisData.compatibility?.level || "良好匹配"}關係`,
			growthPotential:
				analysisData.compatibility?.score >= 80
					? "高成長潛力"
					: analysisData.compatibility?.score >= 70
						? "穩定發展"
						: "需要努力",
		};
	};

	const generateRecommendationsFromCompatibility = (analysisData) => {
		// Generate recommendations from available AI advice
		const recommendations = [];

		if (analysisData.advice && analysisData.advice.length > 0) {
			analysisData.advice.forEach((advice, index) => {
				recommendations.push({
					category:
						index === 0
							? "溝通建議"
							: index === 1
								? "相處建議"
								: "發展建議",
					suggestion: advice,
					target: "couple",
				});
			});
		}

		if (analysisData.challenges && analysisData.challenges.length > 0) {
			recommendations.push({
				category: "需要注意",
				suggestion: analysisData.challenges[0],
				target: "couple",
			});
		}

		return recommendations;
	};

	const performWuxingAnalysisFallback = () => {
		try {
			const user1Analysis = calculateWuxingAnalysis(user1);
			const user2Analysis = calculateWuxingAnalysis(user2);

			if (!user1Analysis || !user2Analysis) {
				setLoading(false);
				return;
			}

			const user1Strength = analyzeWuxingStrength(
				user1Analysis.elementCounts
			);
			const user2Strength = analyzeWuxingStrength(
				user2Analysis.elementCounts
			);

			const user1UsefulGods = determineUsefulGods(user1Analysis);
			const user2UsefulGods = determineUsefulGods(user2Analysis);

			// Analyze couple element balance
			const coupleBalance = analyzeCoupleElementBalance(
				user1Analysis.elementCounts,
				user2Analysis.elementCounts
			);

			// Calculate mutual support
			const mutualSupport = calculateMutualSupport(
				user1Analysis.dominantElement,
				user2Analysis.dominantElement,
				user1UsefulGods,
				user2UsefulGods
			);

			setAnalysisResult({
				user1Analysis,
				user2Analysis,
				user1Strength,
				user2Strength,
				user1UsefulGods,
				user2UsefulGods,
				coupleBalance,
				mutualSupport,
			});

			setLoading(false);
		} catch (error) {
			console.error("Error performing Wuxing analysis:", error);
			setLoading(false);
		}
	};

	const analyzeCoupleElementBalance = (elementCounts1, elementCounts2) => {
		const combinedCounts = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };

		// Combine both partners' element counts
		Object.keys(combinedCounts).forEach((element) => {
			combinedCounts[element] =
				(elementCounts1[element] || 0) + (elementCounts2[element] || 0);
		});

		const total = Object.values(combinedCounts).reduce(
			(sum, count) => sum + count,
			0
		);
		const balance = {};

		Object.entries(combinedCounts).forEach(([element, count]) => {
			const percentage = (count / total) * 100;
			balance[element] = {
				count,
				percentage: Math.round(percentage),
				status:
					percentage > 25
						? "旺"
						: percentage > 15
							? "平"
							: percentage > 5
								? "弱"
								: "缺",
			};
		});

		// Find missing or weak elements
		const missingElements = Object.entries(balance)
			.filter(([_, data]) => data.status === "缺")
			.map(([element, _]) => element);

		const weakElements = Object.entries(balance)
			.filter(([_, data]) => data.status === "弱")
			.map(([element, _]) => element);

		return {
			combinedCounts,
			balance,
			missingElements,
			weakElements,
			advice: generateBalanceAdvice(missingElements, weakElements),
		};
	};

	const calculateMutualSupport = (
		element1,
		element2,
		usefulGods1,
		usefulGods2
	) => {
		const supportMatrix = {
			金: {
				generates: "水",
				supports: "土",
				weakens: "木",
				weakenedBy: "火",
			},
			木: {
				generates: "火",
				supports: "水",
				weakens: "土",
				weakenedBy: "金",
			},
			水: {
				generates: "木",
				supports: "金",
				weakens: "火",
				weakenedBy: "土",
			},
			火: {
				generates: "土",
				supports: "木",
				weakens: "金",
				weakenedBy: "水",
			},
			土: {
				generates: "金",
				supports: "火",
				weakens: "水",
				weakenedBy: "木",
			},
		};

		const support1to2 = [];
		const support2to1 = [];

		// Check if user1's dominant element supports user2's useful gods
		usefulGods2.forEach((god) => {
			if (
				supportMatrix[element1]?.generates === god ||
				supportMatrix[element1]?.supports === god
			) {
				support1to2.push(`${element1} 生助 ${god}`);
			}
		});

		// Check if user2's dominant element supports user1's useful gods
		usefulGods1.forEach((god) => {
			if (
				supportMatrix[element2]?.generates === god ||
				supportMatrix[element2]?.supports === god
			) {
				support2to1.push(`${element2} 生助 ${god}`);
			}
		});

		// Calculate support score
		const supportScore = (support1to2.length + support2to1.length) * 25;

		return {
			support1to2,
			support2to1,
			supportScore: Math.min(supportScore, 100),
			mutualSupport: support1to2.length > 0 && support2to1.length > 0,
			advice: generateSupportAdvice(support1to2, support2to1),
		};
	};

	const generateBalanceAdvice = (missingElements, weakElements) => {
		if (missingElements.length > 0) {
			return `你們組合中缺少${missingElements.join("、")}元素，建議在生活中多加入這些元素來平衡能量。`;
		}
		if (weakElements.length > 0) {
			return `你們組合中${weakElements.join("、")}元素較弱，可以適當補強這些方面。`;
		}
		return "你們的五行組合相對平衡，整體能量協調。";
	};

	const generateSupportAdvice = (support1to2, support2to1) => {
		if (support1to2.length > 0 && support2to1.length > 0) {
			return "你們互相支持，五行能量相互滋養，是很好的互補組合。";
		}
		if (support1to2.length > 0) {
			return "一方能很好地支持另一方，建議保持這種給予的態度。";
		}
		if (support2to1.length > 0) {
			return "另一方能很好地支持你，要懂得接受和感恩。";
		}
		return "你們的五行關係需要更多的磨合和調整，建議多溝通理解。";
	};

	const getElementColor = (element) => {
		// Using the same color mapping as FiveElement.jsx
		const wuxingColorMap = {
			金: "#B2A062",
			木: "#567156",
			水: "#939393",
			火: "#B4003C",
			土: "#DEAB20",
		};
		return wuxingColorMap[element] || "#666";
	};

	if (loading) {
		return (
			<div className="w-full p-8 bg-white rounded-lg shadow-lg">
				<div className="flex items-center justify-center">
					<div className="w-8 h-8 border-b-2 border-purple-500 rounded-full animate-spin"></div>
					<span className="ml-2 text-gray-600">
						分析五行配對中...
					</span>
				</div>
			</div>
		);
	}

	if (!analysisData) {
		return (
			<div className="w-full p-8 bg-white rounded-lg shadow-lg">
				<div className="text-center text-gray-500">
					<BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
					<p>無法分析五行配對，請檢查出生資料</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="w-full bg-white p-8 rounded-[45px]"
			style={{ boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)" }}
		>
			{/* Header */}
			<div className="p-6">
				<h2
					className="flex items-center text-2xl font-bold"
					style={{
						fontFamily: "Noto Serif TC, Serif",
						color: "#D91A5A",
						fontSize: "40px",
					}}
				>
					五行配對分析
				</h2>
			</div>

			{/* Couple Element Balance */}
			<div className="p-8">
				<div className="mb-8">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<Scale className="w-5 h-5 mr-2" />
							組合五行平衡
						</h3>
					</div>
					<div className="grid gap-4 md:grid-cols-5">
						{analysisResult?.coupleBalance?.balance &&
							Object.entries(
								analysisResult.coupleBalance.balance
							).map(([element, data]) => (
								<div
									key={element}
									className="p-4 text-center border border-gray-200 rounded-lg"
								>
									<div className="flex flex-col items-center gap-3">
										<div className="flex items-center justify-center w-16 h-16">
											<img
												src={`/images/elements/${element}.png`}
												alt={element}
												className="object-contain w-full h-full"
											/>
										</div>
										<div
											className="text-xl font-bold"
											style={{
												fontFamily:
													"Noto Serif TC, serif",
												color: getElementColor(element),
											}}
										>
											{element}
										</div>
									</div>
									<div className="mt-3 space-y-1">
										<div className="text-sm text-gray-600">
											數量：{data.count}
										</div>
										<div className="text-sm text-gray-600">
											占比：{data.percentage}%
										</div>
										<div
											className="mt-1 text-sm font-semibold"
											style={{
												color:
													data.status === "旺"
														? "#10B981"
														: data.status === "平"
															? "#3B82F6"
															: data.status ===
																  "弱"
																? "#F59E0B"
																: "#EF4444",
											}}
										>
											{data.status}
										</div>
									</div>
								</div>
							))}
					</div>
					<div className="p-4 mt-4 rounded-lg bg-gray-50">
						<p className="text-black" style={{ fontSize: "15px" }}>
							{analysisResult?.coupleBalance?.advice ||
								"根據AI分析，建議保持五行平衡以增進關係和諧"}
						</p>
					</div>
				</div>

				{/* Individual Analysis */}
				<div className="grid gap-8 mb-8 md:grid-cols-2">
					{/* User 1 Analysis */}
					<div className="p-6 border border-gray-200 rounded-lg">
						<div
							className="px-4 py-2 mb-4 rounded"
							style={{ backgroundColor: "#D91A5A" }}
						>
							<h4 className="text-lg text-white">
								{user1.gender === "male" ? "男方" : "女方"}
								五行分析
							</h4>
						</div>
						<div className="space-y-3">
							<div>
								<span className="text-gray-600">
									主導元素：
								</span>
								<span
									className="ml-2 font-semibold"
									style={{
										color: getElementColor(
											analysisResult?.user1Analysis
												?.dominantElement || "未知"
										),
									}}
								>
									{analysisResult?.user1Analysis
										?.dominantElement || "分析中..."}
								</span>
							</div>
							<div>
								<span className="text-gray-600">
									五行分佈：
								</span>
								<div className="grid grid-cols-5 gap-1 mt-2">
									{analysisResult?.user1Analysis
										?.elementCounts &&
										Object.entries(
											analysisResult.user1Analysis
												.elementCounts
										).map(([element, count]) => (
											<div
												key={element}
												className="text-xs text-center"
											>
												<div className="flex flex-col items-center gap-1">
													<div className="flex items-center justify-center w-8 h-8">
														<img
															src={`/images/elements/${element}.png`}
															alt={element}
															className="object-contain w-full h-full"
														/>
													</div>
													<div
														className="text-xs font-bold"
														style={{
															fontFamily:
																"Noto Serif TC, serif",
															color: getElementColor(
																element
															),
														}}
													>
														{count}
													</div>
												</div>
												<div
													className="mt-1"
													style={{
														color: getElementColor(
															element
														),
														fontFamily:
															"Noto Serif TC, serif",
														fontWeight: 600,
													}}
												>
													{element}
												</div>
											</div>
										))}
								</div>
							</div>
							<div>
								<span className="text-gray-600">用神：</span>
								<span className="ml-2 font-semibold text-gray-800">
									{analysisResult?.user1UsefulGods
										?.slice(0, 2)
										.join("、") || "平衡"}
								</span>
							</div>
						</div>
					</div>

					{/* User 2 Analysis */}
					<div className="p-6 border border-gray-200 rounded-lg">
						<div
							className="px-4 py-2 mb-4 rounded"
							style={{ backgroundColor: "#D91A5A" }}
						>
							<h4 className="text-lg text-white">
								{user2.gender === "male" ? "男方" : "女方"}
								五行分析
							</h4>
						</div>
						<div className="space-y-3">
							<div>
								<span className="text-gray-600">
									主導元素：
								</span>
								<span
									className="ml-2 font-semibold"
									style={{
										color: getElementColor(
											analysisResult?.user2Analysis
												?.dominantElement || "未知"
										),
									}}
								>
									{analysisResult?.user2Analysis
										?.dominantElement || "分析中..."}
								</span>
							</div>
							<div>
								<span className="text-gray-600">
									五行分佈：
								</span>
								<div className="grid grid-cols-5 gap-1 mt-2">
									{analysisResult?.user2Analysis
										?.elementCounts &&
										Object.entries(
											analysisResult.user2Analysis
												.elementCounts
										).map(([element, count]) => (
											<div
												key={element}
												className="text-xs text-center"
											>
												<div className="flex flex-col items-center gap-1">
													<div className="flex items-center justify-center w-8 h-8">
														<img
															src={`/images/elements/${element}.png`}
															alt={element}
															className="object-contain w-full h-full"
														/>
													</div>
													<div
														className="text-xs font-bold"
														style={{
															fontFamily:
																"Noto Serif TC, serif",
															color: getElementColor(
																element
															),
														}}
													>
														{count}
													</div>
												</div>
												<div
													className="mt-1"
													style={{
														color: getElementColor(
															element
														),
														fontFamily:
															"Noto Serif TC, serif",
														fontWeight: 600,
													}}
												>
													{element}
												</div>
											</div>
										))}
								</div>
							</div>
							<div>
								<span className="text-gray-600">用神：</span>
								<span className="ml-2 font-semibold text-gray-800">
									{analysisResult?.user2UsefulGods
										?.slice(0, 2)
										.join("、") || "平衡"}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Mutual Support Analysis */}
				<div className="p-6 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<TrendingUp className="w-5 h-5 mr-2" />
							互相支持分析
						</h3>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						<div>
							<div className="py-2 mb-2 rounded ">
								<div className="items-center">
									<div
										className="flex items-center justify-center font-semibold text-white rounded-full"
										style={{
											backgroundColor: "#D91A51",
											width: "150px",
											height: "45px",
											borderRadius: "20px",
										}}
									>
										<h4 className="text-lg text-white">
											支持關係
										</h4>
									</div>
								</div>
							</div>
							<div className="space-y-2">
								{analysisResult?.mutualSupport?.support1to2?.map(
									(support, index) => (
										<div
											key={index}
											className="p-2 text-green-600 rounded bg-green-50"
											style={{ fontSize: "15px" }}
										>
											{support}
										</div>
									)
								)}
								{analysisResult?.mutualSupport?.support2to1?.map(
									(support, index) => (
										<div
											key={index}
											className="p-2 text-blue-600 rounded bg-blue-50"
											style={{ fontSize: "15px" }}
										>
											{support}
										</div>
									)
								)}
								{!analysisResult?.mutualSupport?.support1to2
									?.length &&
									!analysisResult?.mutualSupport?.support2to1
										?.length && (
										<div
											className="p-2 text-gray-500 rounded bg-gray-50"
											style={{ fontSize: "15px" }}
										>
											暫無明顯五行支持關係
										</div>
									)}
							</div>
						</div>
						<div>
							<div className="py-2 mb-2 rounded">
								<div className="items-center">
									<div
										className="flex items-center justify-center font-semibold text-white rounded-full"
										style={{
											backgroundColor: "#D91A51",
											width: "150px",
											height: "45px",
											borderRadius: "20px",
										}}
									>
										<h4 className="text-lg text-white">
											支持指數
										</h4>
									</div>
								</div>
							</div>
							<div className="flex items-center mb-4">
								<div className="flex-1 h-3 bg-gray-200 rounded-full">
									<div
										className="h-3 transition-all duration-300 rounded-full"
										style={{
											width: `${analysisResult?.mutualSupport?.supportScore || 70}%`,
											backgroundColor:
												(analysisResult?.mutualSupport
													?.supportScore || 70) >= 70
													? "#10B981"
													: (analysisResult
																?.mutualSupport
																?.supportScore ||
																70) >= 40
														? "#F59E0B"
														: "#EF4444",
										}}
									></div>
								</div>
								<span className="ml-3 font-semibold text-gray-800">
									{analysisResult?.mutualSupport
										?.supportScore || 70}
									%
								</span>
							</div>
							<p
								className="text-black"
								style={{ fontSize: "15px" }}
							>
								{analysisResult?.mutualSupport?.advice ||
									"根據AI分析建議保持五行平衡以增進相互支持"}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CoupleWuxingAnalysis;
