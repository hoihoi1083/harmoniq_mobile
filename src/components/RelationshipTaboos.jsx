"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Shield, X, Clock } from "lucide-react";
import { useCoupleAnalysis } from "@/contexts/CoupleAnalysisContext";

const RelationshipTaboos = ({
	user1,
	user2,
	calculateWuxingAnalysis,
	analyzeWuxingStrength,
	determineUsefulGods,
}) => {
	const { analysisData, loading: aiLoading, error } = useCoupleAnalysis();
	const [tabooData, setTabooData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (analysisData) {
			// Use available AI data to generate relationship taboos
			setTabooData({
				// AI-based structure
				behavioral: generateBehavioralTaboosFromAI(analysisData),
				environmental: generateEnvironmentalTaboosFromAI(analysisData),
				temporal: generateTemporalTaboosFromAI(analysisData),
				communication: generateCommunicationTaboosFromAI(analysisData),
				general: generateGeneralTaboosFromAI(analysisData),
				// JSX-expected structure
				elementTaboos: analysisData.challenges?.map(
					(challenge) => `避免${challenge}相關的行為`
				) || [
					"避免在五行相剋的時間段內發生爭執",
					"避免在臥室擺放與你們五行相衝的物品",
					"避免穿著相衝五行的顏色組合",
					"避免在不利方位進行重要討論",
				],
				communicationTaboos: {
					user1Taboos: analysisData.challenges
						?.slice(0, 2)
						.map(
							(challenge) => `避免因${challenge}而產生的溝通問題`
						) || [
						"避免在情緒激動時進行重要對話",
						"避免使用指責性的語言",
					],
					user2Taboos: analysisData.challenges
						?.slice(1, 3)
						.map(
							(challenge) => `避免因${challenge}而引起的誤解`
						) || [
						"避免沉默不語來表達不滿",
						"避免過度解讀對方的意圖",
					],
					commonTaboos: analysisData.challenges?.map(
						(challenge) => `雙方都應避免${challenge}`
					) || [
						"避免在公共場合爭執",
						"避免翻舊賬",
						"避免冷戰處理問題",
					],
				},
				behaviorTaboos: analysisData.challenges?.map((challenge) => ({
					category: "行為禁忌",
					taboos: [
						`避免${challenge}`,
						"避免過度控制對方",
						"避免忽視對方感受",
					],
					severity: "高",
				})) || [
					{
						category: "情感表達",
						taboos: [
							"避免情緒化處理問題",
							"避免冷漠對待對方",
							"避免過度依賴",
						],
						severity: "高",
					},
					{
						category: "日常互動",
						taboos: [
							"避免忽視對方需求",
							"避免單方面做決定",
							"避免缺乏溝通",
						],
						severity: "中",
					},
				],
				environmentTaboos: {
					colors: ["深黑色", "暗紅色", "灰色", "褐色"],
					directions: ["正北方", "西北方", "東北方"],
					items: ["尖銳物品", "破損物品", "枯萎植物", "鏡子對床"],
					activities: [
						"深夜爭吵",
						"在臥室談工作",
						"背對背睡覺",
						"冷戰處理問題",
					],
				},
				timingTaboos: [
					{
						period: "子時 (23:00-1:00)",
						reason: "陰氣較重，容易產生負面情緒",
						recommendation: "避免重要討論",
					},
					{
						period: "午時 (11:00-13:00)",
						reason: "陽氣過盛，容易衝動行事",
						recommendation: "保持冷靜理性",
					},
					{
						period: "農曆七月",
						reason: "傳統認為不利感情發展",
						recommendation: "多關注彼此情感需求",
					},
				],
			});
			setLoading(false);
		} else if (!aiLoading && !analysisData) {
			// Fallback to basic analysis if AI data is not available
			if (user1?.birthDateTime && user2?.birthDateTime) {
				analyzeTaboosFallback();
			}
		}
	}, [analysisData, aiLoading, user1, user2]);

	// Helper functions to generate taboos from available AI data
	const generateBehavioralTaboosFromAI = (aiData) => {
		const challenges = aiData.challenges || [];
		return challenges
			.map((challenge) => ({
				type: "行為禁忌",
				description: `避免${challenge}`,
				severity: "中等",
				recommendation: `建議改善${challenge}的行為模式`,
			}))
			.concat([
				{
					type: "溝通禁忌",
					description: "避免在爭執中使用攻擊性言語",
					severity: "高",
					recommendation: "學習使用建設性溝通方式",
				},
			]);
	};

	const generateEnvironmentalTaboosFromAI = (aiData) => {
		return [
			{
				type: "環境禁忌",
				description: `配對評分${aiData.compatibility?.score || 75}分，需注意居住環境的和諧`,
				severity: "中等",
				recommendation: "營造溫馨和諧的居住環境",
			},
			{
				type: "空間配置",
				description: "避免在臥室擺放尖銳物品",
				severity: "低",
				recommendation: "選擇圓潤溫和的裝飾品",
			},
		];
	};

	const generateTemporalTaboosFromAI = (aiData) => {
		return [
			{
				type: "時間禁忌",
				description: "避免在深夜進行重要決定討論",
				severity: "中等",
				recommendation: "選擇雙方精神狀態良好的時間溝通",
			},
			{
				type: "節慶注意",
				description: "重要節日避免爭執",
				severity: "高",
				recommendation: "提前溝通節慶安排，避免臨時衝突",
			},
		];
	};

	const generateCommunicationTaboosFromAI = (aiData) => {
		const challenges = aiData.challenges || ["溝通誤解"];
		return challenges.map((challenge) => ({
			type: "溝通禁忌",
			description: `在溝通中避免${challenge}`,
			severity: "高",
			recommendation: `針對${challenge}制定改善策略`,
		}));
	};

	const generateGeneralTaboosFromAI = (aiData) => {
		const general = [
			{
				type: "一般禁忌",
				description: `根據${aiData.compatibility?.score || 75}分的配對分析，避免過度依賴`,
				severity: "中等",
				recommendation: "保持適當的個人空間和獨立性",
			},
		];

		if (aiData.challenges) {
			general.push(
				...aiData.challenges.map((challenge) => ({
					type: "關係禁忌",
					description: `避免${challenge}影響關係發展`,
					severity: "中等",
					recommendation: `針對${challenge}建立應對機制`,
				}))
			);
		}

		return general;
	};

	const extractCommunicationTaboos = (tabooData) => {
		// Extract communication-related taboos from all categories
		const allTaboos = [
			...(tabooData.behavioral || []),
			...(tabooData.environmental || []),
			...(tabooData.temporal || []),
		];

		return allTaboos.filter(
			(taboo) =>
				taboo.category?.includes("溝通") ||
				taboo.description?.includes("溝通") ||
				taboo.category?.includes("交流") ||
				taboo.description?.includes("交流")
		);
	};

	const extractGeneralTaboos = (tabooData) => {
		// Combine all taboo categories for general warnings
		return [
			...(tabooData.behavioral || []),
			...(tabooData.environmental || []),
			...(tabooData.temporal || []),
		].slice(0, 8); // Return top 8 most important taboos
	};

	const analyzeTaboosFallback = () => {
		try {
			const user1Analysis = calculateWuxingAnalysis(user1);
			const user2Analysis = calculateWuxingAnalysis(user2);

			if (!user1Analysis || !user2Analysis) {
				setLoading(false);
				return;
			}

			// Generate element conflict taboos
			const elementTaboos = generateElementTaboos(
				user1Analysis.dominantElement,
				user2Analysis.dominantElement
			);

			// Generate communication taboos
			const communicationTaboos = generateCommunicationTaboos(
				user1Analysis.dominantElement,
				user2Analysis.dominantElement
			);

			// Generate behavioral taboos
			const behaviorTaboos = generateBehaviorTaboos(
				user1Analysis.dominantElement,
				user2Analysis.dominantElement
			);

			// Generate environmental taboos
			const environmentTaboos = generateEnvironmentTaboos(
				user1Analysis.dominantElement,
				user2Analysis.dominantElement
			);

			// Generate timing taboos
			const timingTaboos = generateTimingTaboos(
				user1Analysis.dominantElement,
				user2Analysis.dominantElement
			);

			setTabooData({
				elementTaboos,
				communicationTaboos,
				behaviorTaboos,
				environmentTaboos,
				timingTaboos,
			});

			setLoading(false);
		} catch (error) {
			console.error("Error analyzing taboos:", error);
			setLoading(false);
		}
	};

	const generateElementTaboos = (element1, element2) => {
		const conflictMap = {
			金木: [
				"避免在爭執中過於強硬，金方容易傷害木方的自尊",
				"不要在對方情緒低落時說教或批評",
				"避免用邏輯去否定對方的感受和夢想",
			],
			金火: [
				"避免正面硬碰硬的爭執，火克金容易兩敗俱傷",
				"不要在對方生氣時繼續刺激",
				"避免用冷淡的態度對待對方的熱情",
			],
			木土: [
				"避免木方過於理想化而忽視實際問題",
				"不要讓土方的保守限制木方的發展",
				"避免在金錢觀念上產生根本分歧",
			],
			水火: [
				"避免水方的冷淡澆滅火方的熱情",
				"不要讓火方的急躁破壞水方的節奏",
				"避免在決策時意見完全相反",
			],
			土水: [
				"避免土方過於固執而阻礙水方的變化",
				"不要讓水方的不穩定影響土方的安全感",
				"避免在生活安排上產生衝突",
			],
		};

		const key1 = element1 + element2;
		const key2 = element2 + element1;

		return (
			conflictMap[key1] ||
			conflictMap[key2] || [
				"避免強行改變對方的本性",
				"不要忽視五行差異帶來的不同需求",
				"避免用自己的標準衡量對方",
			]
		);
	};

	const generateCommunicationTaboos = (element1, element2) => {
		const communicationConflicts = {
			金: [
				"不要過於直接和犀利，容易傷害對方",
				"避免只講道理而忽視情感",
				"不要在對方需要支持時只提供建議",
			],
			木: [
				"避免過於理想化的表達方式",
				"不要總是談論未來而忽視現在",
				"避免過度批評對方的保守態度",
			],
			水: [
				"不要過於被動和模糊",
				"避免總是迴避重要話題",
				"不要用冷處理的方式面對衝突",
			],
			火: [
				"避免過於激動和急躁",
				"不要打斷對方說話",
				"避免用激烈的語氣表達不滿",
			],
			土: [
				"不要過於保守和固執",
				"避免總是強調現實和困難",
				"不要用沉默來表達不滿",
			],
		};

		const taboos1 = communicationConflicts[element1] || [];
		const taboos2 = communicationConflicts[element2] || [];

		return {
			user1Taboos: taboos1,
			user2Taboos: taboos2,
			commonTaboos: [
				"避免在情緒激動時進行重要對話",
				"不要用翻舊帳的方式解決問題",
				"避免在公眾場合爭執",
			],
		};
	};

	const generateBehaviorTaboos = (element1, element2) => {
		return [
			{
				category: "決策行為",
				taboos: [
					"不要在重大決定時忽視對方意見",
					"避免單方面做出影響雙方的選擇",
					"不要用情緒化的方式逼迫對方妥協",
				],
			},
			{
				category: "社交行為",
				taboos: [
					"避免在朋友面前批評或貶低對方",
					"不要過度依賴朋友而忽視伴侶",
					"避免與異性朋友過於親密",
				],
			},
			{
				category: "生活習慣",
				taboos: [
					"不要強迫對方改變生活作息",
					"避免在對方的興趣愛好上潑冷水",
					"不要因為小事而長期冷戰",
				],
			},
			{
				category: "金錢觀念",
				taboos: [
					"避免隱瞞重要的財務狀況",
					"不要單方面做出大額消費決定",
					"避免用金錢來控制或操縱對方",
				],
			},
		];
	};

	const generateEnvironmentTaboos = (element1, element2) => {
		const avoidElements = getConflictElements(element1, element2);

		return {
			colors: getTabooColors(avoidElements),
			directions: getTabooDirections(avoidElements),
			items: getTabooItems(avoidElements),
			activities: getTabooActivities(avoidElements),
		};
	};

	const generateTimingTaboos = (element1, element2) => {
		return [
			{
				period: "爭執高峰期",
				times: ["月圓之夜", "換季時節", "工作壓力大時"],
				advice: "這些時期容易發生衝突，要特別注意溝通方式",
			},
			{
				period: "決策敏感期",
				times: ["生日前後", "節假日", "工作變動期"],
				advice: "重大決定最好避開這些時期，容易做出錯誤選擇",
			},
			{
				period: "情緒低潮期",
				times: ["冬季", "陰雨天", "身體不適時"],
				advice: "避免在這些時期討論敏感話題或做重要決定",
			},
		];
	};

	const getConflictElements = (element1, element2) => {
		const conflictMap = {
			金: ["火"],
			木: ["金"],
			水: ["土"],
			火: ["水"],
			土: ["木"],
		};

		const conflicts = [
			...(conflictMap[element1] || []),
			...(conflictMap[element2] || []),
		];
		return [...new Set(conflicts)];
	};

	const getTabooColors = (conflictElements) => {
		const colorMap = {
			金: ["金色過多", "過亮的白色"],
			木: ["深綠色過多", "過於自然的色調"],
			水: ["純黑色", "過深的藍色"],
			火: ["大紅色", "過於鮮豔的色彩"],
			土: ["土黃色過多", "過於沉悶的色調"],
		};

		const tabooColors = [];
		conflictElements.forEach((element) => {
			if (colorMap[element]) {
				tabooColors.push(...colorMap[element]);
			}
		});

		return tabooColors;
	};

	const getTabooDirections = (conflictElements) => {
		const directionMap = {
			金: ["正西方", "西北方"],
			木: ["正東方", "東南方"],
			水: ["正北方"],
			火: ["正南方"],
			土: ["西南方", "東北方"],
		};

		const tabooDirections = [];
		conflictElements.forEach((element) => {
			if (directionMap[element]) {
				tabooDirections.push(...directionMap[element]);
			}
		});

		return tabooDirections;
	};

	const getTabooItems = (conflictElements) => {
		const itemMap = {
			金: ["過多金屬裝飾", "尖銳物品"],
			木: ["枯萎植物", "過多木質家具"],
			水: ["積水容器", "過多水景"],
			火: ["過多電器", "明火裝飾"],
			土: ["過多陶瓷", "厚重家具"],
		};

		const tabooItems = [];
		conflictElements.forEach((element) => {
			if (itemMap[element]) {
				tabooItems.push(...itemMap[element]);
			}
		});

		return tabooItems;
	};

	const getTabooActivities = (conflictElements) => {
		const activityMap = {
			金: ["過度競爭性活動", "過於理性的討論"],
			木: ["長期戶外暴露", "過度勞累"],
			水: ["長時間泡水", "過度冷靜"],
			火: ["過度刺激活動", "長時間曝曬"],
			土: ["長期不動", "過度保守"],
		};

		const tabooActivities = [];
		conflictElements.forEach((element) => {
			if (activityMap[element]) {
				tabooActivities.push(...activityMap[element]);
			}
		});

		return tabooActivities;
	};

	if (loading) {
		return (
			<div className="w-full p-8 bg-white rounded-lg shadow-lg">
				<div className="flex items-center justify-center">
					<div className="w-8 h-8 border-b-2 border-red-500 rounded-full animate-spin"></div>
					<span className="ml-2 text-gray-600">
						分析關係禁忌中...
					</span>
				</div>
			</div>
		);
	}

	if (!tabooData) {
		return (
			<div className="w-full p-8 bg-white rounded-lg shadow-lg">
				<div className="text-center text-gray-500">
					<AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
					<p>無法分析關係禁忌，請檢查出生資料</p>
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
					<Shield className="w-8 h-8 mr-3" />
					感情關係禁忌
				</h2>
			</div>

			{/* Content */}
			<div className="p-8">
				{/* Element Conflict Taboos */}
				<div className="mb-8">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<AlertTriangle className="w-5 h-5 mr-2" />
							五行衝突禁忌
						</h3>
					</div>
					<div className="bg-red-50 rounded-lg p-6 border border-red-200">
						<div className="space-y-3">
							{(tabooData.elementTaboos || []).map(
								(taboo, index) => (
									<div
										key={index}
										className="flex items-start"
									>
										<X className="w-4 h-4 mr-3 mt-0.5 text-red-500 flex-shrink-0" />
										<span
											className="text-black"
											style={{ fontSize: "15px" }}
										>
											{taboo}
										</span>
									</div>
								)
							)}
						</div>
					</div>
				</div>

				{/* Communication Taboos */}
				<div className="mb-8">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<AlertTriangle className="w-5 h-5 mr-2" />
							溝通禁忌
						</h3>
					</div>
					<div className="grid gap-6 md:grid-cols-2 mb-4">
						<div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
							<h4 className="font-medium text-orange-800 mb-3">
								{user1.gender === "male" ? "男方" : "女方"}
								需要避免
							</h4>
							<div className="space-y-2">
								{(
									tabooData.communicationTaboos
										?.user1Taboos || []
								).map((taboo, index) => (
									<div
										key={index}
										className="flex items-start"
									>
										<X className="w-4 h-4 mr-2 mt-0.5 text-orange-500 flex-shrink-0" />
										<span
											className="text-black"
											style={{ fontSize: "15px" }}
										>
											{taboo}
										</span>
									</div>
								))}
							</div>
						</div>
						<div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
							<h4 className="font-medium text-yellow-800 mb-3">
								{user2.gender === "male" ? "男方" : "女方"}
								需要避免
							</h4>
							<div className="space-y-2">
								{(
									tabooData.communicationTaboos
										?.user2Taboos || []
								).map((taboo, index) => (
									<div
										key={index}
										className="flex items-start"
									>
										<X className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 flex-shrink-0" />
										<span
											className="text-black"
											style={{ fontSize: "15px" }}
										>
											{taboo}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className="bg-gray-50 rounded-lg p-6">
						<h4
							className="font-medium text-gray-800 mb-3"
							style={{ fontSize: "15px" }}
						>
							雙方共同禁忌
						</h4>
						<div className="space-y-2">
							{(
								tabooData.communicationTaboos?.commonTaboos ||
								[]
							).map((taboo, index) => (
								<div key={index} className="flex items-start">
									<X className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
									<span
										className="text-black"
										style={{ fontSize: "15px" }}
									>
										{taboo}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Behavior Taboos */}
				<div className="mb-8">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<AlertTriangle className="w-5 h-5 mr-2" />
							行為禁忌
						</h3>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						{(tabooData.behaviorTaboos || []).map(
							(category, index) => (
								<div
									key={index}
									className="bg-purple-50 rounded-lg p-6 border border-purple-200"
								>
									<h4
										className="font-medium text-purple-800 mb-3"
										style={{ fontSize: "15px" }}
									>
										{category.category}
									</h4>
									<div className="space-y-2">
										{(category.taboos || []).map(
											(taboo, tabooIndex) => (
												<div
													key={tabooIndex}
													className="flex items-start"
												>
													<X className="w-4 h-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
													<span
														className="text-black"
														style={{
															fontSize: "15px",
														}}
													>
														{taboo}
													</span>
												</div>
											)
										)}
									</div>
								</div>
							)
						)}
					</div>
				</div>

				{/* Environment Taboos */}
				<div className="mb-8">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<AlertTriangle className="w-5 h-5 mr-2" />
							環境禁忌
						</h3>
					</div>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						<div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
							<h4
								className="font-medium text-blue-800 mb-3"
								style={{ fontSize: "15px" }}
							>
								避免顏色
							</h4>
							<div className="space-y-2">
								{(
									tabooData.environmentTaboos?.colors || []
								).map((color, index) => (
									<div
										key={index}
										className="text-black"
										style={{ fontSize: "15px" }}
									>
										{color}
									</div>
								))}
							</div>
						</div>
						<div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
							<h4
								className="font-medium text-indigo-800 mb-3"
								style={{ fontSize: "15px" }}
							>
								避免方位
							</h4>
							<div className="space-y-2">
								{(
									tabooData.environmentTaboos?.directions ||
									[]
								).map((direction, index) => (
									<div
										key={index}
										className="text-black"
										style={{ fontSize: "15px" }}
									>
										{direction}
									</div>
								))}
							</div>
						</div>
						<div className="bg-cyan-50 rounded-lg p-6 border border-cyan-200">
							<h4
								className="font-medium text-cyan-800 mb-3"
								style={{ fontSize: "15px" }}
							>
								避免物品
							</h4>
							<div className="space-y-2">
								{(tabooData.environmentTaboos?.items || []).map(
									(item, index) => (
										<div
											key={index}
											className="text-black"
											style={{ fontSize: "15px" }}
										>
											{item}
										</div>
									)
								)}
							</div>
						</div>
						<div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
							<h4
								className="font-medium text-teal-800 mb-3"
								style={{ fontSize: "15px" }}
							>
								避免活動
							</h4>
							<div className="space-y-2">
								{(
									tabooData.environmentTaboos?.activities ||
									[]
								).map((activity, index) => (
									<div
										key={index}
										className="text-black"
										style={{ fontSize: "15px" }}
									>
										{activity}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* Timing Taboos */}
				<div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
					<div
						className="px-4 py-2 mb-4 rounded"
						style={{ backgroundColor: "#D91A5A" }}
					>
						<h3 className="flex items-center text-lg text-white">
							<Clock className="w-5 h-5 mr-2" />
							時機禁忌
						</h3>
					</div>
					<div className="space-y-4">
						{(tabooData.timingTaboos || []).map((timing, index) => (
							<div
								key={index}
								className="bg-white rounded-lg p-6 border border-gray-200"
							>
								<h4
									className="font-medium text-gray-800 mb-2"
									style={{ fontSize: "15px" }}
								>
									{timing.period}
								</h4>
								<p
									className="text-gray-600 mb-2"
									style={{ fontSize: "15px" }}
								>
									{timing.reason}
								</p>
								<p
									className="text-blue-600 font-medium"
									style={{ fontSize: "15px" }}
								>
									{timing.recommendation}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RelationshipTaboos;
