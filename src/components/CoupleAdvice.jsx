"use client";

import { useState, useEffect } from "react";
import { Heart, Lightbulb, Star, TrendingUp } from "lucide-react";
import { useCoupleAnalysis } from "@/contexts/CoupleAnalysisContext";

const CoupleAdvice = ({
	user1,
	user2,
	calculateWuxingAnalysis,
	analyzeWuxingStrength,
	determineUsefulGods,
	currentYear,
}) => {
	const { analysisData, loading: aiLoading, error } = useCoupleAnalysis();
	const [adviceData, setAdviceData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (analysisData) {
			// Use available AI data to generate comprehensive advice
			setAdviceData({
				// AI-based structure
				communication: {
					tips: analysisData.communication ||
						analysisData.advice || [
							"保持開放心態進行對話",
							"傾聽對方的真實想法",
							"定期分享彼此的感受",
						],
					avoid: analysisData.challenges || [
						"避免指責性言語",
						"不要在情緒激動時討論",
						"避免猜測對方想法",
					],
					enhancementMethods:
						generateCommunicationTipsFromAI(analysisData),
				},
				intimacy: {
					enhancement: analysisData.strengths || [
						"增加共同興趣活動",
						"創造浪漫時刻",
						"表達愛意和感激",
					],
					timing: `根據分析，配對評分${analysisData.compatibility?.score || 75}分，建議在感情昇溫期加強親密關係`,
					bonding: generateIntimacyAdviceFromAI(analysisData),
				},
				conflict: {
					resolution: analysisData.advice || [
						"冷靜分析問題根源",
						"尋求雙贏解決方案",
						"必要時尋求第三方協助",
					],
					prevention: generateConflictPreventionFromAI(analysisData),
					management: [
						...(analysisData.advice || []),
						...(analysisData.challenges?.map((c) => `避免${c}`) ||
							[]),
					],
				},
				personal: {
					individual: generatePersonalGrowthFromAI(analysisData),
					together: analysisData.strengths || [
						"共同設定關係目標",
						"培養共同興趣愛好",
						"支持彼此的個人發展",
					],
					development: generateDevelopmentAdviceFromAI(analysisData),
				},
				seasonal: generateSeasonalAdviceFromCompatibility(analysisData),
				general: generateGeneralAdviceFromCompatibility(analysisData),
				// JSX-expected structure
				relationshipAdvice: {
					title: "關係發展建議",
					advice:
						(analysisData.advice && analysisData.advice[0]) ||
						"根據你們的配對分析，建議多加強溝通理解，培養共同興趣。",
					tips: analysisData.advice || [
						"保持開放的溝通",
						"尊重彼此差異",
						"共同制定目標",
						"定期約會增進感情",
					],
				},
				communicationAdvice: {
					user1Style: {
						style: "主動溝通型",
						preference: "直接表達想法",
					},
					user2Style: {
						style: "傾聽理解型",
						preference: "深度交流",
					},
					advice: analysisData.advice || [
						"避免在情緒激動時討論重要話題",
						"使用「我覺得」而非「你總是」的表達方式",
						"定期安排專門的溝通時間",
						"學會積極傾聽對方的想法",
					],
				},
				personalAdvice: {
					user1: {
						advice: analysisData.strengths || [
							"發揮你的領導能力",
							"保持積極樂觀態度",
							"學會適時妥協",
						],
						colors: ["紅色", "橙色", "黃色", "綠色", "藍色"],
					},
					user2: {
						advice: analysisData.strengths || [
							"發揮你的包容特質",
							"堅持自己的原則",
							"多表達內心想法",
						],
						colors: ["藍色", "綠色", "紫色", "白色", "灰色"],
					},
				},
				energyAdvice: {
					title: "能量提升建議",
					colors: ["粉紅色", "淺藍色", "淺綠色", "米色", "淡紫色"],
					directions: ["東南方", "西南方", "正南方", "正北方"],
					activities: [
						"一起看日出",
						"共同種植植物",
						"製作手工藝品",
						"練習瑜伽冥想",
					],
					timing: [
						"春季是你們感情升溫的最佳時機",
						"夏季適合計劃未來",
						"秋季要注意溝通協調",
						"冬季是反思關係的時候",
					],
				},
			});
			setLoading(false);
		} else if (!aiLoading && !analysisData) {
			// Fallback to basic analysis if AI data is not available
			if (user1?.birthDateTime && user2?.birthDateTime) {
				generateAdviceFallback();
			}
		}
	}, [analysisData, aiLoading, user1, user2]);

	// Helper functions to generate content from available AI data
	const generateCommunicationTipsFromAI = (aiData) => {
		const base = aiData.advice || [];
		return base
			.map((tip) => `溝通建議：${tip}`)
			.concat(["使用正面語言表達需求", "避免批評，多給予建設性建議"]);
	};

	const generateIntimacyAdviceFromAI = (aiData) => {
		const strengths = aiData.strengths || [];
		return strengths
			.map((strength) => `善用${strength}增進親密關係`)
			.concat(["創造專屬的相處時光", "表達感激和愛意"]);
	};

	const generateConflictPreventionFromAI = (aiData) => {
		const challenges = aiData.challenges || [];
		return challenges
			.map((challenge) => `預防${challenge}的發生`)
			.concat(["建立良好的溝通習慣", "及時處理小摩擦"]);
	};

	const generatePersonalGrowthFromAI = (aiData) => {
		return [
			`根據分析，配對評分${aiData.compatibility?.score || 75}分，個人成長建議`,
			"保持個人興趣和獨立性",
			"持續學習和自我提升",
		];
	};

	const generateDevelopmentAdviceFromAI = (aiData) => {
		const advice = aiData.advice || [];
		const strengths = aiData.strengths || [];
		return advice.concat(strengths.map((s) => `發展${s}的優勢`));
	};

	const generateSeasonalAdviceFromCompatibility = (aiData) => {
		const baseScore = aiData.compatibility?.score || 75;
		return {
			spring: `春季感情運勢${baseScore + 5}分，適合${aiData.strengths?.[0] || "規劃未來"}`,
			summer: `夏季熱情期，注意${aiData.challenges?.[0] || "溝通方式"}`,
			autumn: `秋季穩定期，建議${aiData.advice?.[0] || "加強理解"}`,
			winter: `冬季考驗期，需要${aiData.challenges?.[1] || "更多耐心"}`,
		};
	};

	const generateGeneralAdviceFromCompatibility = (aiData) => {
		return [
			`整體配對評分：${aiData.compatibility?.score || 75}分`,
			...(aiData.advice || ["建議加強溝通理解"]),
			`優勢：${(aiData.strengths || ["關係和諧"]).join("、")}`,
			`注意：${(aiData.challenges || ["溝通方式"]).join("、")}`,
		];
	};

	const generateSeasonalAdviceFromAI = (adviceData) => {
		// Generate seasonal advice based on AI analysis
		return {
			spring: "春季是感情萌芽的季節，適合規劃未來",
			summer: "夏季熱情如火，是增進親密關係的好時機",
			autumn: "秋季適合收穫感情果實，穩定關係發展",
			winter: "冬季適合內省和深度溝通，增進彼此了解",
		};
	};

	const generateGeneralAdviceFromAI = (adviceData) => {
		// Combine all advice categories for general recommendations
		const allAdvice = [
			...(adviceData.communication?.tips || []),
			...(adviceData.intimacy?.enhancement || []),
			...(adviceData.growth?.together || []),
		];
		return allAdvice.slice(0, 5); // Return top 5 general advice
	};

	const generateAdviceFallback = () => {
		try {
			const user1Analysis = calculateWuxingAnalysis(user1);
			const user2Analysis = calculateWuxingAnalysis(user2);

			if (!user1Analysis || !user2Analysis) {
				setLoading(false);
				return;
			}

			const user1UsefulGods = determineUsefulGods(user1Analysis);
			const user2UsefulGods = determineUsefulGods(user2Analysis);

			// Generate relationship advice based on five elements
			const relationshipAdvice = generateRelationshipAdvice(
				user1Analysis.dominantElement,
				user2Analysis.dominantElement
			);

			// Generate communication advice
			const communicationAdvice = generateCommunicationAdvice(
				user1Analysis.dominantElement,
				user2Analysis.dominantElement
			);

			// Generate personal development advice
			const personalAdvice = generatePersonalAdvice(
				user1Analysis,
				user2Analysis,
				user1UsefulGods,
				user2UsefulGods
			);

			// Generate energy enhancement advice
			const energyAdvice = generateEnergyAdvice(
				user1Analysis.dominantElement,
				user2Analysis.dominantElement,
				user1UsefulGods,
				user2UsefulGods
			);

			setAdviceData({
				relationshipAdvice,
				communicationAdvice,
				personalAdvice,
				energyAdvice,
			});

			setLoading(false);
		} catch (error) {
			console.error("Error generating advice:", error);
			setLoading(false);
		}
	};

	const generateRelationshipAdvice = (element1, element2) => {
		const elementAdvice = {
			金金: {
				title: "雙金配對",
				advice: "你們都有堅強的意志力和原則性，容易在小事上較真。建議學會適時妥協，不要事事都要爭個對錯。",
				tips: [
					"設立共同目標",
					"分工合作",
					"保持理性溝通",
					"尊重彼此決定",
				],
			},
			金木: {
				title: "金木配對",
				advice: "金克木的關係需要特別小心。金方要收斂鋒芒，木方要保持柔韌。建議金方多包容，木方多堅持自己的想法。",
				tips: [
					"金方要溫和一些",
					"木方要表達需求",
					"避免過度控制",
					"培養共同興趣",
				],
			},
			金水: {
				title: "金水配對",
				advice: "金生水，這是很好的搭配。金方的穩重能給水方安全感，水方的靈活能讓金方放鬆。要保持這種互補關係。",
				tips: [
					"發揮各自優勢",
					"金方提供穩定",
					"水方帶來變化",
					"相互支持成長",
				],
			},
			金火: {
				title: "金火配對",
				advice: "火克金，關係中容易有激烈衝突。需要找到平衡點，火方要控制脾氣，金方要學會表達情感。",
				tips: [
					"避免正面衝突",
					"火方要冷靜",
					"金方要表達",
					"尋求共同點",
				],
			},
			金土: {
				title: "金土配對",
				advice: "土生金，土方能給金方很好的支持。這個組合很穩定，但可能缺乏激情。建議增加一些浪漫元素。",
				tips: [
					"保持穩定關係",
					"增加浪漫情趣",
					"土方多支持",
					"金方多感恩",
				],
			},
			// Add more combinations...
		};

		const key = element1 + element2;
		const reverseKey = element2 + element1;

		return (
			elementAdvice[key] ||
			elementAdvice[reverseKey] || {
				title: "特殊配對",
				advice: "你們的五行配對需要特別的經營和理解。",
				tips: ["多溝通交流", "理解差異", "包容不同", "共同成長"],
			}
		);
	};

	const generateCommunicationAdvice = (element1, element2) => {
		const communicationStyles = {
			金: {
				style: "直接理性",
				preference: "事實和邏輯",
				weakness: "可能過於直白",
			},
			木: {
				style: "成長導向",
				preference: "未來和發展",
				weakness: "可能過於理想",
			},
			水: {
				style: "靈活變通",
				preference: "情感和直覺",
				weakness: "可能不夠堅定",
			},
			火: {
				style: "熱情積極",
				preference: "行動和效率",
				weakness: "可能過於急躁",
			},
			土: {
				style: "穩重實際",
				preference: "安全和穩定",
				weakness: "可能過於保守",
			},
		};

		const style1 = communicationStyles[element1];
		const style2 = communicationStyles[element2];

		return {
			user1Style: style1,
			user2Style: style2,
			advice: [
				`${element1}命的你：理解對方${style2.preference}的需求，避免${style1.weakness}`,
				`${element2}命的對方：理解你${style1.preference}的需求，避免${style2.weakness}`,
				"建議找到共同的溝通語言和方式",
				"在重要話題上給彼此思考時間",
			],
		};
	};

	const generatePersonalAdvice = (
		analysis1,
		analysis2,
		usefulGods1,
		usefulGods2
	) => {
		return {
			user1: {
				title: `${analysis1.dominantElement}命個人建議`,
				advice: [
					`你的五行以${analysis1.dominantElement}為主，性格穩重但要注意靈活性`,
					`建議多接觸${usefulGods1.slice(0, 2).join("、")}元素來平衡能量`,
					"在感情中要學會表達內心想法",
					"保持個人成長的同時照顧關係",
				],
				colors: getElementColors(usefulGods1),
				activities: getElementActivities(usefulGods1),
			},
			user2: {
				title: `${analysis2.dominantElement}命個人建議`,
				advice: [
					`你的五行以${analysis2.dominantElement}為主，要發揮自己的優勢`,
					`建議多接觸${usefulGods2.slice(0, 2).join("、")}元素來提升運勢`,
					"在關係中保持自己的特色",
					"用自己的方式支持伴侶",
				],
				colors: getElementColors(usefulGods2),
				activities: getElementActivities(usefulGods2),
			},
		};
	};

	const generateEnergyAdvice = (
		element1,
		element2,
		usefulGods1,
		usefulGods2
	) => {
		const combinedUsefulGods = [
			...new Set([...usefulGods1, ...usefulGods2]),
		];

		return {
			title: "感情能量提升建議",
			colors: getElementColors(combinedUsefulGods),
			directions: getElementDirections(combinedUsefulGods),
			activities: getElementActivities(combinedUsefulGods),
			foods: getElementFoods(combinedUsefulGods),
			timing: getElementTiming(combinedUsefulGods),
		};
	};

	const getElementColors = (elements) => {
		const colorMap = {
			金: ["白色", "銀色", "金色"],
			木: ["綠色", "青色", "翠綠"],
			水: ["黑色", "藍色", "深藍"],
			火: ["紅色", "紫色", "橙色"],
			土: ["黃色", "褐色", "土色"],
		};

		const colors = [];
		elements.forEach((element) => {
			if (colorMap[element]) {
				colors.push(...colorMap[element]);
			}
		});

		return [...new Set(colors)];
	};

	const getElementDirections = (elements) => {
		const directionMap = {
			金: ["西方", "西北方"],
			木: ["東方", "東南方"],
			水: ["北方"],
			火: ["南方"],
			土: ["中央", "西南方", "東北方"],
		};

		const directions = [];
		elements.forEach((element) => {
			if (directionMap[element]) {
				directions.push(...directionMap[element]);
			}
		});

		return [...new Set(directions)];
	};

	const getElementActivities = (elements) => {
		const activityMap = {
			金: ["運動健身", "聽音樂", "整理收納"],
			木: ["戶外活動", "閱讀學習", "園藝種植"],
			水: ["游泳", "SPA", "冥想"],
			火: ["看電影", "聚會", "創作藝術"],
			土: ["烹飪", "手工製作", "土地旅行"],
		};

		const activities = [];
		elements.forEach((element) => {
			if (activityMap[element]) {
				activities.push(...activityMap[element]);
			}
		});

		return [...new Set(activities)];
	};

	const getElementFoods = (elements) => {
		const foodMap = {
			金: ["白蘿蔔", "梨子", "杏仁"],
			木: ["蔬菜", "水果", "綠茶"],
			水: ["海鮮", "黑豆", "黑芝麻"],
			火: ["辣椒", "紅棗", "胡蘿蔔"],
			土: ["地瓜", "南瓜", "小米"],
		};

		const foods = [];
		elements.forEach((element) => {
			if (foodMap[element]) {
				foods.push(...foodMap[element]);
			}
		});

		return [...new Set(foods)];
	};

	const getElementTiming = (elements) => {
		const timingMap = {
			金: ["秋季", "傍晚"],
			木: ["春季", "早晨"],
			水: ["冬季", "夜晚"],
			火: ["夏季", "中午"],
			土: ["四季末", "下午"],
		};

		const timings = [];
		elements.forEach((element) => {
			if (timingMap[element]) {
				timings.push(...timingMap[element]);
			}
		});

		return [...new Set(timings)];
	};

	if (loading) {
		return (
			<div className="w-full p-8 bg-white rounded-lg shadow-lg">
				<div className="flex items-center justify-center">
					<div className="w-8 h-8 border-b-2 border-pink-500 rounded-full animate-spin"></div>
					<span className="ml-2 text-gray-600">
						生成感情建議中...
					</span>
				</div>
			</div>
		);
	}

	if (!adviceData) {
		return (
			<div className="w-full p-8 bg-white rounded-lg shadow-lg">
				<div className="text-center text-gray-500">
					<Lightbulb className="w-12 h-12 mx-auto mb-2 text-gray-300" />
					<p>無法生成感情建議，請檢查出生資料</p>
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
					<Heart className="w-8 h-8 mr-3" />
					感情開運建議
				</h2>
			</div>

			{/* Content */}
			<div className="p-8">
				{/* Relationship Advice */}
				<div className="mb-8">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<Heart className="w-5 h-5 mr-2" />
							{adviceData.relationshipAdvice?.title ||
								"關係發展建議"}
						</h3>
					</div>
					<div className="p-6 border border-pink-200 rounded-lg bg-pink-50">
						<p
							className="mb-4 text-black"
							style={{ fontSize: "15px" }}
						>
							{adviceData.relationshipAdvice?.advice ||
								"建議加強溝通理解，培養共同興趣。"}
						</p>
						<div className="grid gap-2 md:grid-cols-2">
							{(adviceData.relationshipAdvice?.tips || []).map(
								(tip, index) => (
									<div
										key={index}
										className="flex items-center text-black"
										style={{ fontSize: "15px" }}
									>
										<Star className="w-4 h-4 mr-2 text-pink-500" />
										{tip}
									</div>
								)
							)}
						</div>
					</div>
				</div>

				{/* Communication Advice */}
				<div className="mb-8">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<Lightbulb className="w-5 h-5 mr-2" />
							溝通建議
						</h3>
					</div>
					<div className="grid gap-6 mb-4 md:grid-cols-2">
						<div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
							<h4 className="mb-2 font-medium text-blue-800">
								{user1.gender === "male" ? "男方" : "女方"}
								溝通風格
							</h4>
							<p
								className="mb-2 text-gray-600"
								style={{ fontSize: "15px" }}
							>
								<span className="font-medium">風格：</span>
								{adviceData.communicationAdvice?.user1Style
									?.style || "積極溝通型"}
							</p>
							<p
								className="text-gray-600"
								style={{ fontSize: "15px" }}
							>
								<span className="font-medium">偏好：</span>
								{adviceData.communicationAdvice?.user1Style
									?.preference || "直接表達"}
							</p>
						</div>
						<div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
							<h4 className="mb-2 font-medium text-purple-800">
								{user2.gender === "male" ? "男方" : "女方"}
								溝通風格
							</h4>
							<p
								className="mb-2 text-gray-600"
								style={{ fontSize: "15px" }}
							>
								<span className="font-medium">風格：</span>
								{adviceData.communicationAdvice?.user2Style
									?.style || "傾聽理解型"}
							</p>
							<p
								className="text-gray-600"
								style={{ fontSize: "15px" }}
							>
								<span className="font-medium">偏好：</span>
								{adviceData.communicationAdvice?.user2Style
									?.preference || "深度交流"}
							</p>
						</div>
					</div>
					<div className="space-y-2">
						{(adviceData.communicationAdvice?.advice || []).map(
							(advice, index) => (
								<div
									key={index}
									className="flex items-start text-black"
									style={{ fontSize: "15px" }}
								>
									<Star className="flex-shrink-0 w-4 h-4 mt-1 mr-2 text-blue-500" />
									{advice}
								</div>
							)
						)}
					</div>
				</div>

				{/* Personal Development Advice */}
				<div className="mb-8">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<TrendingUp className="w-5 h-5 mr-2" />
							個人提升建議
						</h3>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						<div className="p-6 bg-white border border-gray-200 rounded-lg">
							<h4 className="mb-4 font-medium text-gray-800">
								{user1.gender === "male" ? "男方" : "女方"}
								提升建議
							</h4>
							<div className="space-y-3">
								{(
									adviceData.personalAdvice?.user1?.advice ||
									[]
								).map((advice, index) => (
									<div
										key={index}
										className="flex items-start text-black"
										style={{ fontSize: "15px" }}
									>
										<Star className="flex-shrink-0 w-4 h-4 mt-1 mr-2 text-green-500" />
										{advice}
									</div>
								))}
								<div className="mt-4">
									<p
										className="mb-2 font-medium text-gray-700"
										style={{ fontSize: "15px" }}
									>
										開運顏色：
									</p>
									<div className="flex flex-wrap gap-2">
										{(
											adviceData.personalAdvice?.user1
												?.colors || []
										)
											.slice(0, 3)
											.map((color, index) => {
												// Get background color based on color name
												const getColorBg = (
													colorName
												) => {
													const colorMap = {
														紅色: "bg-red-500",
														橙色: "bg-orange-500",
														黃色: "bg-yellow-500",
														綠色: "bg-green-500",
														藍色: "bg-blue-500",
														紫色: "bg-purple-500",
														白色: "bg-white border border-gray-300",
														黑色: "bg-black",
														褐色: "bg-amber-800",
														土色: "bg-yellow-700",
														金色: "bg-yellow-400",
														銀色: "bg-gray-300",
														青色: "bg-cyan-500",
														翠綠: "bg-emerald-500",
														深藍: "bg-blue-800",
														灰色: "bg-gray-500",
													};
													return (
														colorMap[colorName] ||
														"bg-gray-100"
													);
												};

												// Get text color for contrast
												const getTextColor = (
													colorName
												) => {
													const lightBgColors = [
														"白色",
														"黃色",
														"金色",
														"銀色",
													];
													return lightBgColors.includes(
														colorName
													)
														? "text-black"
														: "text-white";
												};

												return (
													<span
														key={index}
														className={`px-2 py-1 rounded ${getColorBg(color)} ${getTextColor(color)}`}
														style={{
															fontSize: "13px",
														}}
													>
														{color}
													</span>
												);
											})}
									</div>
								</div>
							</div>
						</div>

						<div className="p-6 bg-white border border-gray-200 rounded-lg">
							<h4 className="mb-4 font-medium text-gray-800">
								{user2.gender === "male" ? "男方" : "女方"}
								提升建議
							</h4>
							<div className="space-y-3">
								{(
									adviceData.personalAdvice?.user2?.advice ||
									[]
								).map((advice, index) => (
									<div
										key={index}
										className="flex items-start text-black"
										style={{ fontSize: "15px" }}
									>
										<Star className="flex-shrink-0 w-4 h-4 mt-1 mr-2 text-green-500" />
										{advice}
									</div>
								))}
								<div className="mt-4">
									<p
										className="mb-2 font-medium text-gray-700"
										style={{ fontSize: "15px" }}
									>
										開運顏色：
									</p>
									<div className="flex flex-wrap gap-2">
										{(
											adviceData.personalAdvice?.user2
												?.colors || []
										)
											.slice(0, 3)
											.map((color, index) => {
												// Get background color based on color name
												const getColorBg = (
													colorName
												) => {
													const colorMap = {
														紅色: "bg-red-500",
														橙色: "bg-orange-500",
														黃色: "bg-yellow-500",
														綠色: "bg-green-500",
														藍色: "bg-blue-500",
														紫色: "bg-purple-500",
														白色: "bg-white border border-gray-300",
														黑色: "bg-black",
														褐色: "bg-amber-800",
														土色: "bg-yellow-700",
														金色: "bg-yellow-400",
														銀色: "bg-gray-300",
														青色: "bg-cyan-500",
														翠綠: "bg-emerald-500",
														深藍: "bg-blue-800",
														灰色: "bg-gray-500",
													};
													return (
														colorMap[colorName] ||
														"bg-gray-100"
													);
												};

												// Get text color for contrast
												const getTextColor = (
													colorName
												) => {
													const lightBgColors = [
														"白色",
														"黃色",
														"金色",
														"銀色",
													];
													return lightBgColors.includes(
														colorName
													)
														? "text-black"
														: "text-white";
												};

												return (
													<span
														key={index}
														className={`px-2 py-1 rounded ${getColorBg(color)} ${getTextColor(color)}`}
														style={{
															fontSize: "13px",
														}}
													>
														{color}
													</span>
												);
											})}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Energy Enhancement */}
				<div className="mb-8">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<Star className="w-5 h-5 mr-2" />
							{adviceData.energyAdvice?.title || "能量提升建議"}
						</h3>
					</div>
					<div className="p-6">
						{/* 開運顏色 */}
						<div className="mb-6">
							<h4
								className="mb-3 font-medium text-gray-700"
								style={{ fontSize: "15px" }}
							>
								開運顏色
							</h4>
							<div className="flex flex-wrap gap-2">
								{(adviceData.energyAdvice?.colors || [])
									.slice(0, 5)
									.map((color, index) => {
										// Get background color based on color name
										const getColorBg = (colorName) => {
											const colorMap = {
												粉紅色: "bg-pink-400",
												淺藍色: "bg-blue-300",
												淺綠色: "bg-green-300",
												米色: "bg-yellow-100 border border-yellow-300",
												淡紫色: "bg-purple-300",
												紅色: "bg-red-500",
												橙色: "bg-orange-500",
												黃色: "bg-yellow-500",
												綠色: "bg-green-500",
												藍色: "bg-blue-500",
												紫色: "bg-purple-500",
												白色: "bg-white border border-gray-300",
												黑色: "bg-black",
												褐色: "bg-amber-800",
												土色: "bg-yellow-700",
												金色: "bg-yellow-400",
												銀色: "bg-gray-300",
												青色: "bg-cyan-500",
												翠綠: "bg-emerald-500",
												深藍: "bg-blue-800",
												灰色: "bg-gray-500",
											};
											return (
												colorMap[colorName] ||
												"bg-gray-100"
											);
										};

										// Get text color for contrast
										const getTextColor = (colorName) => {
											const lightBgColors = [
												"白色",
												"黃色",
												"金色",
												"銀色",
												"米色",
												"淺藍色",
												"淺綠色",
												"粉紅色",
												"淡紫色",
											];
											return lightBgColors.includes(
												colorName
											)
												? "text-black"
												: "text-white";
										};

										return (
											<span
												key={index}
												className={`px-3 py-2 rounded ${getColorBg(color)} ${getTextColor(color)}`}
												style={{ fontSize: "14px" }}
											>
												{color}
											</span>
										);
									})}
							</div>
						</div>

						{/* 有利方位 */}
						<div className="mb-6">
							<h4
								className="mb-3 font-medium text-gray-700"
								style={{ fontSize: "15px" }}
							>
								有利方位
							</h4>
							<div className="flex flex-wrap gap-2">
								{(adviceData.energyAdvice?.directions || [])
									.slice(0, 4)
									.map((direction, index) => (
										<span
											key={index}
											className="px-3 py-2 text-blue-800 bg-blue-100 rounded"
											style={{ fontSize: "14px" }}
										>
											{direction}
										</span>
									))}
							</div>
						</div>

						{/* 推薦活動 */}
						<div className="mb-6">
							<h4
								className="mb-3 font-medium text-gray-700"
								style={{ fontSize: "15px" }}
							>
								推薦活動
							</h4>
							<div className="flex flex-wrap gap-2">
								{(adviceData.energyAdvice?.activities || [])
									.slice(0, 4)
									.map((activity, index) => (
										<span
											key={index}
											className="px-3 py-2 text-green-800 bg-green-100 rounded"
											style={{ fontSize: "14px" }}
										>
											{activity}
										</span>
									))}
							</div>
						</div>

						{/* 有利時段 */}
						<div>
							<h4
								className="mb-3 font-medium text-gray-700"
								style={{ fontSize: "15px" }}
							>
								有利時段
							</h4>
							<div className="flex flex-wrap gap-2">
								{(adviceData.energyAdvice?.timing || []).map(
									(time, index) => (
										<span
											key={index}
											className="px-3 py-2 text-orange-800 bg-orange-100 rounded"
											style={{ fontSize: "14px" }}
										>
											{time}
										</span>
									)
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CoupleAdvice;
