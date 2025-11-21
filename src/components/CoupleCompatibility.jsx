"use client";

import { useState, useEffect } from "react";
import { Heart, Star, TrendingUp } from "lucide-react";
import { useCoupleAnalysis } from "@/contexts/CoupleAnalysisContext";

const CoupleCompatibility = ({
	user1,
	user2,
	calculateWuxingAnalysis,
	analyzeWuxingStrength,
	determineUsefulGods,
}) => {
	const { analysisData, loading: aiLoading, error } = useCoupleAnalysis();
	const [compatibility, setCompatibility] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (analysisData?.compatibility) {
			// Calculate actual elements from birthdays
			const user1Analysis = calculateWuxingAnalysis(user1);
			const user2Analysis = calculateWuxingAnalysis(user2);

			// Use AI-generated compatibility data
			setCompatibility({
				score: parseInt(analysisData.compatibility.score) || 75,
				level: analysisData.compatibility.level || "良好匹配",
				description:
					analysisData.compatibility.description || "配對分析中...",
				strengths: analysisData.strengths || [],
				challenges: analysisData.challenges || [],
				advice: analysisData.advice || [],
				recommendation: analysisData.advice
					? analysisData.advice.join("\n• ")
					: "",
				elementCompatibility: {
					user1Element: user1Analysis?.dominantElement || "未知",
					user2Element: user2Analysis?.dominantElement || "未知",
					interaction:
						user1Analysis?.dominantElement &&
						user2Analysis?.dominantElement
							? calculateElementCompatibility(
									user1Analysis.dominantElement,
									user2Analysis.dominantElement
								).relationship
							: "分析中...",
					harmony:
						user1Analysis?.dominantElement &&
						user2Analysis?.dominantElement
							? calculateElementCompatibility(
									user1Analysis.dominantElement,
									user2Analysis.dominantElement
								).description
							: "評估中...",
					description:
						user1Analysis?.dominantElement &&
						user2Analysis?.dominantElement
							? calculateElementCompatibility(
									user1Analysis.dominantElement,
									user2Analysis.dominantElement
								).description
							: "評估中...",
				},
			});
			setLoading(false);
		} else if (!aiLoading && !analysisData) {
			// Fallback to basic analysis if AI data is not available
			if (user1?.birthDateTime && user2?.birthDateTime) {
				analyzeCompatibilityFallback();
			}
		}
	}, [analysisData, aiLoading, user1, user2]);

	const analyzeCompatibilityFallback = () => {
		try {
			const user1Analysis = calculateWuxingAnalysis(user1);
			const user2Analysis = calculateWuxingAnalysis(user2);

			if (!user1Analysis || !user2Analysis) {
				setLoading(false);
				return;
			}

			const elementCompatibility = calculateElementCompatibility(
				user1Analysis.dominantElement,
				user2Analysis.dominantElement
			);

			const compatibilityScore = calculateCompatibilityScore(
				user1Analysis,
				user2Analysis
			);

			const insights = generateCompatibilityInsights(
				user1Analysis,
				user2Analysis,
				compatibilityScore
			);

			setCompatibility({
				score: compatibilityScore,
				level: insights.level,
				description: insights.description,
				strengths: insights.strengths,
				challenges: insights.challenges,
				recommendation: insights.recommendation,
				elementCompatibility,
			});
			setLoading(false);
		} catch (error) {
			console.error("Error analyzing compatibility:", error);
			setLoading(false);
		}
	};

	const calculateCompatibilityScore = (user1Analysis, user2Analysis) => {
		if (!user1Analysis || !user2Analysis) return 50;

		// Element compatibility (40%)
		const elementScore = calculateElementCompatibility(
			user1Analysis.dominantElement,
			user2Analysis.dominantElement
		).score;

		// Zodiac compatibility (30%)
		const zodiacScore = calculateZodiacCompatibility(
			user1.birthDateTime,
			user2.birthDateTime
		).score;

		// Wuxing balance (30%)
		const balanceScore = calculateWuxingBalance(
			user1Analysis,
			user2Analysis
		);

		return Math.round(
			elementScore * 0.4 + zodiacScore * 0.3 + balanceScore * 0.3
		);
	};

	const calculateWuxingBalance = (user1Analysis, user2Analysis) => {
		if (!user1Analysis.elementCounts || !user2Analysis.elementCounts)
			return 50;

		// Find complementary elements
		const user1Strong = Object.entries(user1Analysis.elementCounts)
			.filter(([_, count]) => count >= 2)
			.map(([element, _]) => element);

		const user2Strong = Object.entries(user2Analysis.elementCounts)
			.filter(([_, count]) => count >= 2)
			.map(([element, _]) => element);

		// Check for complementary pairs
		const complementaryPairs = [
			["木", "火"],
			["火", "土"],
			["土", "金"],
			["金", "水"],
			["水", "木"],
		];

		let balanceScore = 50;

		for (const [elem1, elem2] of complementaryPairs) {
			if (
				(user1Strong.includes(elem1) && user2Strong.includes(elem2)) ||
				(user1Strong.includes(elem2) && user2Strong.includes(elem1))
			) {
				balanceScore += 10;
			}
		}

		return Math.min(balanceScore, 100);
	};

	const generateCompatibilityInsights = (
		user1Analysis,
		user2Analysis,
		score
	) => {
		const insights = {
			level: "良好匹配",
			description: "基於八字五行的配對分析",
			strengths: [],
			challenges: [],
			recommendation: "",
		};

		if (score >= 80) {
			insights.level = "極佳配對";
			insights.description = "雙方八字高度匹配，天作之合";
			insights.strengths = [
				"五行搭配和諧",
				"性格互補良好",
				"未來發展順利",
			];
			insights.challenges = ["保持現有和諧"];
			insights.recommendation = "珍惜這份緣分，適合長期發展";
		} else if (score >= 70) {
			insights.level = "優秀配對";
			insights.description = "雙方配對良好，前景光明";
			insights.strengths = ["基本匹配度高", "具備發展潛力", "相處融洽"];
			insights.challenges = ["加強溝通理解"];
			insights.recommendation = "繼續深入了解，建立穩固關係";
		} else if (score >= 60) {
			insights.level = "良好配對";
			insights.description = "雙方有一定的匹配度";
			insights.strengths = ["有共同點", "可以相互學習", "關係穩定"];
			insights.challenges = ["需要更多耐心", "建議增進了解"];
			insights.recommendation = "通過努力可以建立良好關係";
		} else if (score >= 50) {
			insights.level = "一般配對";
			insights.description = "雙方需要更多的磨合";
			insights.strengths = ["仍有發展空間"];
			insights.challenges = [
				"性格差異較大",
				"需要相互包容",
				"溝通很重要",
			];
			insights.recommendation = "需要更多時間和努力來建立關係";
		} else {
			insights.level = "需要努力";
			insights.description = "雙方差異較大，需要化解";
			insights.strengths = ["可以相互學習成長"];
			insights.challenges = ["挑戰較大", "需要專業指導", "要有足夠耐心"];
			insights.recommendation = "建議尋求專業建議，慎重考慮";
		}

		return insights;
	};

	const calculateElementCompatibility = (element1, element2) => {
		const compatibilityMatrix = {
			木: { 木: 60, 火: 85, 土: 40, 金: 30, 水: 75 },
			火: { 木: 85, 火: 60, 土: 85, 金: 40, 水: 30 },
			土: { 木: 40, 火: 85, 土: 60, 金: 85, 水: 40 },
			金: { 木: 30, 火: 40, 土: 85, 金: 60, 水: 85 },
			水: { 木: 75, 火: 30, 土: 40, 金: 85, 水: 60 },
		};

		const score = compatibilityMatrix[element1]?.[element2] || 50;

		let relationship, description;
		if (score >= 80) {
			relationship = "相生";
			description = "五行相生，關係和諧";
		} else if (score >= 60) {
			relationship = "平和";
			description = "五行平和，關係穩定";
		} else if (score >= 40) {
			relationship = "一般";
			description = "五行一般，需要調和";
		} else {
			relationship = "相克";
			description = "五行相克，需要化解";
		}

		return { score, relationship, description };
	};

	const calculateZodiacCompatibility = (birthday1, birthday2) => {
		const getZodiac = (birthday) => {
			const year = new Date(birthday).getFullYear();
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
			return zodiacAnimals[(year - 4) % 12];
		};

		const zodiac1 = getZodiac(birthday1);
		const zodiac2 = getZodiac(birthday2);

		// Simplified zodiac compatibility matrix
		const compatibilityMatrix = {
			鼠: {
				鼠: 60,
				牛: 75,
				虎: 45,
				兔: 55,
				龍: 80,
				蛇: 70,
				馬: 35,
				羊: 50,
				猴: 85,
				雞: 65,
				狗: 40,
				豬: 75,
			},
			牛: {
				鼠: 75,
				牛: 60,
				虎: 50,
				兔: 45,
				龍: 65,
				蛇: 90,
				馬: 40,
				羊: 35,
				猴: 55,
				雞: 80,
				狗: 70,
				豬: 60,
			},
		};

		const score = compatibilityMatrix[zodiac1]?.[zodiac2] || 60;

		let relationship, description;
		if (score >= 80) {
			relationship = "吉配";
			description = "生肖配對吉利";
		} else if (score >= 60) {
			relationship = "平配";
			description = "生肖配對平和";
		} else {
			relationship = "需化解";
			description = "生肖需要調和";
		}

		return { score, relationship, description };
	};

	if (loading) {
		return (
			<div className="w-full p-8 bg-white rounded-lg shadow-lg">
				<div className="flex items-center justify-center">
					<div className="w-8 h-8 border-b-2 border-pink-500 rounded-full animate-spin"></div>
					<span className="ml-2 text-gray-600">分析配對中...</span>
				</div>
			</div>
		);
	}

	if (!compatibility) {
		return (
			<div className="w-full p-8 bg-white rounded-lg shadow-lg">
				<div className="text-center text-gray-500">
					<Heart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
					<p>無法分析配對，請檢查出生資料</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="w-full bg-white  p-8 rounded-[45px]"
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
					姻緣配對概覽
				</h2>
			</div>

			{/* Main Content */}
			<div className="p-8">
				<div className="grid gap-6 md:grid-cols-3">
					{/* Compatibility Score */}
					<div className="text-center">
						<div className="mb-2 text-4xl font-bold text-pink-600">
							{compatibility.score}分
						</div>
						<div className="mb-1 text-lg font-medium text-gray-700">
							{compatibility.level}
						</div>
					</div>

					{/* Element Compatibility */}
					{compatibility.elementCompatibility && (
						<div className="text-center">
							<div className="mb-2 text-lg font-medium text-gray-700">
								五行配對
							</div>
							<div className="text-sm text-gray-600">
								{
									compatibility.elementCompatibility
										.user1Element
								}
								命 +{" "}
								{
									compatibility.elementCompatibility
										.user2Element
								}
								命
							</div>
							<div className="mt-1 text-sm text-gray-600">
								{compatibility.elementCompatibility.description}
							</div>
						</div>
					)}

					{/* Relationship Status */}
					<div className="text-center">
						<div className="mb-2 text-lg font-medium text-gray-700">
							匹配程度
						</div>
						<div className="flex justify-center">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									className={`w-6 h-6 ${
										star <=
										Math.round(compatibility.score / 20)
											? "text-yellow-400 fill-current"
											: "text-gray-300"
									}`}
								/>
							))}
						</div>
					</div>
				</div>
				<div>
					{compatibility.description && (
						<p className="mt-10 text-black text-md">
							{compatibility.description}
						</p>
					)}
				</div>
				{/* Detailed Analysis */}
				<div className="mt-8 space-y-6">
					{/* Strengths */}
					{compatibility.strengths &&
						compatibility.strengths.length > 0 && (
							<div>
								<div
									className="px-4 py-2 mb-2 rounded"
									style={{ backgroundColor: "#D91A5A" }}
								>
									<h4 className="text-lg text-white">
										關係優勢
									</h4>
								</div>
								<ul className="space-y-1">
									{compatibility.strengths.map(
										(strength, index) => (
											<li
												key={index}
												className="text-black"
												style={{ fontSize: "15px" }}
											>
												• {strength}
											</li>
										)
									)}
								</ul>
							</div>
						)}

					{/* Challenges */}
					{compatibility.challenges &&
						compatibility.challenges.length > 0 && (
							<div>
								<div
									className="px-4 py-2 mb-2 rounded"
									style={{ backgroundColor: "#D91A5A" }}
								>
									<h4 className="text-lg text-white">
										需要注意
									</h4>
								</div>
								<ul className="space-y-1">
									{compatibility.challenges.map(
										(challenge, index) => (
											<li
												key={index}
												className="text-black"
												style={{ fontSize: "15px" }}
											>
												• {challenge}
											</li>
										)
									)}
								</ul>
							</div>
						)}

					{(compatibility.recommendation ||
						(compatibility.advice &&
							compatibility.advice.length > 0)) && (
						<div>
							<div
								className="px-4 py-2 mb-2 rounded"
								style={{ backgroundColor: "#D91A5A" }}
							>
								<h4 className="text-lg text-white">建議</h4>
							</div>
							{compatibility.advice &&
							compatibility.advice.length > 0 ? (
								<ul className="space-y-1">
									{compatibility.advice.map(
										(advice, index) => (
											<li
												key={index}
												className="text-black"
												style={{ fontSize: "15px" }}
											>
												• {advice}
											</li>
										)
									)}
								</ul>
							) : (
								<p
									className="text-black"
									style={{ fontSize: "15px" }}
								>
									{compatibility.recommendation}
								</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CoupleCompatibility;
