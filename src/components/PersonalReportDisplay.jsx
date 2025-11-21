"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import getWuxingData from "@/lib/nayin";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const wuxingColorMap = {
	金: "#B2A062",
	木: "#567156",
	水: "#939393",
	火: "#B4003C",
	土: "#DEAB20",
};

const ELEMENTS = ["金", "木", "水", "火", "土"];

const PersonalReportDisplay = () => {
	const t = useTranslations("report");
	const { userData } = useUser();
	const params = useParams();
	const locale = params.locale; // Get current locale from URL params
	const [personalData, setPersonalData] = useState(null);
	const [wuxingData, setWuxingData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activePillar, setActivePillar] = useState("年柱");
	const [reportDocData, setReportDocData] = useState(null);
	const [debugInfo, setDebugInfo] = useState(""); // Add debug info state
	const [openedNianzhuIndex, setOpenedNianzhuIndex] = useState(null);
	const [openedYuezhuIndex, setOpenedYuezhuIndex] = useState(null);
	const [openedRizhuIndex, setOpenedRizhuIndex] = useState(null);
	const [openedShizhuIndex, setOpenedShizhuIndex] = useState(null);
	const [isPrinting, setIsPrinting] = useState(false);
	const sectionRefs = useRef([]);
	const nianzhuRefs = useRef([]);
	const yuezhuRefs = useRef([]);
	const rizhuRefs = useRef([]);
	const shizhuRefs = useRef([]);

	// AI life stage analysis states (simplified for personal report)
	const [lifeStageAnalysis, setLifeStageAnalysis] = useState({
		年柱: null,
		月柱: null,
		日柱: null,
		時柱: null,
	});
	const [isLoadingLifeStage, setIsLoadingLifeStage] = useState({
		年柱: false,
		月柱: false,
		日柱: false,
		時柱: false,
	});

	// Analysis functions from Report.jsx
	const analyzeWuxingStrength = (elementCounts) => {
		const total = Object.values(elementCounts).reduce(
			(sum, count) => sum + count,
			0
		);
		const strongElements = [];
		const weakElements = [];

		Object.entries(elementCounts).forEach(([element, count]) => {
			const percentage = (count / total) * 100;
			if (percentage >= 25) {
				strongElements.push(element);
			} else if (count === 0) {
				weakElements.push(element);
			}
		});

		let strengthDesc = "";
		if (strongElements.length === 1) {
			strengthDesc = `${strongElements[0]}旺`;
		} else if (strongElements.length === 2) {
			strengthDesc = `${strongElements.join("")}兩旺`;
		} else if (strongElements.length >= 3) {
			strengthDesc = `${strongElements.slice(0, 2).join("")}等多旺`;
		} else {
			const maxCount = Math.max(...Object.values(elementCounts));
			const dominant = Object.entries(elementCounts).find(
				([_, count]) => count === maxCount
			)?.[0];
			strengthDesc = dominant ? `${dominant}為主` : "五行平衡";
		}

		return {
			strongElements,
			weakElements,
			strengthDesc,
			elementCounts,
		};
	};

	const determineUsefulGods = (strengthAnalysis) => {
		const { strongElements, weakElements, elementCounts } =
			strengthAnalysis;
		const elementCycle = ["木", "火", "土", "金", "水"];

		let primaryGod = "";
		let auxiliaryGod = "";
		let strategy = "";

		if (weakElements.length > 0) {
			primaryGod = weakElements[0];
			if (weakElements.length > 1) {
				auxiliaryGod = weakElements[1];
			} else {
				const primaryIndex = elementCycle.indexOf(primaryGod);
				const generatorIndex = (primaryIndex - 1 + 5) % 5;
				auxiliaryGod = elementCycle[generatorIndex];
			}
			strategy = "補缺";
		} else if (strongElements.length === 0) {
			const minCount = Math.min(...Object.values(elementCounts));
			const weakestElements = Object.entries(elementCounts)
				.filter(([_, count]) => count === minCount)
				.map(([element, _]) => element);

			primaryGod = weakestElements[0];
			const primaryIndex = elementCycle.indexOf(primaryGod);
			const generatorIndex = (primaryIndex - 1 + 5) % 5;
			auxiliaryGod = elementCycle[generatorIndex];
			strategy = "扶弱";
		} else if (strongElements.length >= 2) {
			const strongestElement = strongElements[0];
			const strongestIndex = elementCycle.indexOf(strongestElement);
			const restrainingIndex = (strongestIndex + 1) % 5;
			primaryGod = elementCycle[restrainingIndex];

			const secondaryRestrainingIndex = (restrainingIndex + 1) % 5;
			auxiliaryGod = elementCycle[secondaryRestrainingIndex];
			strategy = "抑強";
		} else if (strongElements.length === 1) {
			const strongElement = strongElements[0];
			const strongIndex = elementCycle.indexOf(strongElement);
			const drainingIndex = (strongIndex + 1) % 5;
			primaryGod = elementCycle[drainingIndex];
			const restrainingIndex = (strongIndex + 2) % 5;
			auxiliaryGod = elementCycle[restrainingIndex];
			strategy = "瀉強";
		}

		return {
			primaryGod,
			auxiliaryGod,
			strategy,
		};
	};

	const calculateWuxingAnalysis = (userInfo) => {
		if (!userInfo?.birthDateTime) return null;

		const wuxingData = getWuxingData(
			userInfo.birthDateTime,
			userInfo.gender
		);
		const elementCounts = {};
		const missingElements = [];

		ELEMENTS.forEach((element) => {
			let count = 0;
			const stemsBranches = [
				wuxingData.yearStemWuxing,
				wuxingData.yearBranchWuxing,
				wuxingData.monthStemWuxing,
				wuxingData.monthBranchWuxing,
				wuxingData.dayStemWuxing,
				wuxingData.dayBranchWuxing,
				wuxingData.hourStemWuxing,
				wuxingData.hourBranchWuxing,
			];

			stemsBranches.forEach((wuxing) => {
				if (wuxing === element) count++;
			});

			elementCounts[element] = count;
			if (count === 0) missingElements.push(element);
		});

		const strengthAnalysis = analyzeWuxingStrength(elementCounts);
		const usefulGods = determineUsefulGods(strengthAnalysis);

		return {
			elementCounts,
			missingElements,
			wuxingData,
			strengthAnalysis,
			usefulGods,
		};
	};

	// Generate sample report data based on user's actual wuxing
	// Helper function to generate dynamic pillar data based on actual calculated elements
	const generateDynamicPillarData = (
		pillarName,
		stem,
		stemElement,
		branch,
		branchElement,
		baseData,
		random
	) => {
		console.log(`🔍 Generating ${pillarName} data:`, {
			stem,
			stemElement,
			branch,
			branchElement,
			random,
		});

		// Try to find exact match first
		const pillarKey = `${stem}${branch}`;
		console.log(`🎯 Looking for exact pillar key: "${pillarKey}"`);

		if (baseData.nianzhuData?.[pillarKey]) {
			console.log(
				`✅ Found exact match for ${pillarKey}:`,
				baseData.nianzhuData[pillarKey]
			);
			return (
				baseData.nianzhuData[pillarKey][random] ||
				baseData.nianzhuData[pillarKey][0]
			);
		}

		console.log(
			`❌ No exact match for ${pillarKey}, using element-based fallback`
		);
		console.log(
			"📊 Available base data keys:",
			Object.keys(baseData.nianzhuData || {})
		);

		// If no exact match, use element-based fallback
		const elementData = {};

		// Create element-based keys for天干 and 地支
		const tianganKey = `天干${stemElement}`;
		const dizhiKey = `地支${branchElement}`;
		const compositeKey = `综合${stemElement}${branchElement}`;

		console.log(
			`🔍 Trying element-based keys: ${tianganKey}, ${dizhiKey}, ${compositeKey}`
		);

		// Try to find element-based data in the base data structure
		// Look through existing data to find patterns that match elements
		const allPillarData =
			baseData.nianzhuData ||
			baseData.yuezhuData ||
			baseData.rizhuData ||
			baseData.shizhuData ||
			{};

		// Find similar element patterns from existing data
		const similarData = {};
		Object.entries(allPillarData).forEach(([key, values]) => {
			if (key.includes(stemElement) || key.includes(branchElement)) {
				console.log(`📝 Found similar data for ${key}:`, values);
				Object.assign(similarData, values[random] || values[0] || {});
			}
		});

		// Generate element-based data
		elementData[tianganKey] =
			`${pillarName}天干${stem}属${stemElement}，主要影响外在表现和性格特质。${stemElement}元素的特性在此柱位体现明显。这反映了你在${pillarName === "年柱" ? "童年时期" : pillarName === "月柱" ? "青年时期" : pillarName === "日柱" ? "成年时期" : "晚年时期"}的基本特征。`;
		elementData[dizhiKey] =
			`${pillarName}地支${branch}属${branchElement}，主要影响内在潜力和环境因素。${branchElement}元素的力量在此发挥作用。这体现了你在${pillarName === "年柱" ? "家庭环境" : pillarName === "月柱" ? "社交关系" : pillarName === "日柱" ? "个人核心" : "子女关系"}方面的特质。`;
		elementData[compositeKey] =
			`${pillarName}${pillarKey}的组合，天干${stemElement}与地支${branchElement}相互作用，形成独特的能量场。这种${stemElement}与${branchElement}的配合，决定了你在相应人生阶段的主要运势走向和性格表现。`;

		// Merge with similar data if found
		const result = { ...elementData, ...similarData };
		console.log(`📋 Generated pillar data for ${pillarName}:`, result);

		return result;
	};

	const generateRichReportData = async (wuxingData) => {
		try {
			console.log("🔍 Attempting to fetch professional base data...");

			// Get professional base data (same as Report.jsx)
			const response = await fetch(
				`/api/reportDoc/${locale === "zh-CN" ? "zh" : "tw"}`,
				{
					headers: { "Cache-Control": "max-age=3600" },
				}
			);

			console.log("🌐 API Response status:", response.status);
			console.log(
				"🌐 Using locale:",
				locale,
				"-> API endpoint:",
				locale === "zh-CN" ? "zh" : "tw"
			);

			if (!response.ok) {
				console.warn(
					"❌ API request failed, falling back to simple data"
				);
				return generateSimpleReportData(wuxingData);
			}

			const apiResponse = await response.json();
			console.log("📊 API Response structure:", Object.keys(apiResponse));

			// Handle the response format (likely wrapped in {status, data})
			const baseData = apiResponse.data || apiResponse;
			console.log("📊 Base data structure:", Object.keys(baseData || {}));
			console.log("📊 Base data sample:", baseData);

			if (!baseData || !baseData.nianzhuData) {
				console.warn(
					"❌ Invalid base data structure, falling back to simple data"
				);
				return generateSimpleReportData(wuxingData);
			}

			const {
				nayin,
				yearStem,
				yearStemWuxing,
				yearBranch,
				yearBranchWuxing,
				monthStem,
				monthStemWuxing,
				monthBranch,
				monthBranchWuxing,
				dayStem,
				dayStemWuxing,
				dayBranch,
				dayBranchWuxing,
				hourStem,
				hourStemWuxing,
				hourBranch,
				hourBranchWuxing,
			} = wuxingData;

			console.log("使用實際計算元素生成專業內容:");
			console.log(
				"年柱:",
				`${yearStem}${yearBranch}`,
				`(天干:${yearStem}-${yearStemWuxing}, 地支:${yearBranch}-${yearBranchWuxing})`
			);
			console.log(
				"月柱:",
				`${monthStem}${monthBranch}`,
				`(天干:${monthStem}-${monthStemWuxing}, 地支:${monthBranch}-${monthBranchWuxing})`
			);
			console.log(
				"日柱:",
				`${dayStem}${dayBranch}`,
				`(天干:${dayStem}-${dayStemWuxing}, 地支:${dayBranch}-${dayBranchWuxing})`
			);
			console.log(
				"時柱:",
				`${hourStem}${hourBranch}`,
				`(天干:${hourStem}-${hourStemWuxing}, 地支:${hourBranch}-${hourBranchWuxing})`
			);

			const random = Math.floor(Math.random() * 3);
			console.log("🎲 Using random index:", random);

			const result = {
				nianzhuData: generateDynamicPillarData(
					"年柱",
					yearStem,
					yearStemWuxing,
					yearBranch,
					yearBranchWuxing,
					baseData,
					random
				),
				yuezhuData: generateDynamicPillarData(
					"月柱",
					monthStem,
					monthStemWuxing,
					monthBranch,
					monthBranchWuxing,
					baseData,
					random
				),
				rizhuData: generateDynamicPillarData(
					"日柱",
					dayStem,
					dayStemWuxing,
					dayBranch,
					dayBranchWuxing,
					baseData,
					random
				),
				shizhuData: generateDynamicPillarData(
					"時柱",
					hourStem,
					hourStemWuxing,
					hourBranch,
					hourBranchWuxing,
					baseData,
					random
				),
			};

			console.log("📝 Generated report data:", result);
			return result;
		} catch (error) {
			console.error("❌ Error generating rich report data:", error);
			console.log("🔄 Falling back to simple template data");
			// Fallback to simple template data
			return generateSimpleReportData(wuxingData);
		}
	};

	const generateSimpleReportData = (wuxingData) => {
		const {
			yearStem,
			yearStemWuxing,
			yearBranch,
			yearBranchWuxing,
			monthStem,
			monthStemWuxing,
			monthBranch,
			monthBranchWuxing,
			dayStem,
			dayStemWuxing,
			dayBranch,
			dayBranchWuxing,
			hourStem,
			hourStemWuxing,
			hourBranch,
			hourBranchWuxing,
		} = wuxingData;

		return {
			nianzhuData: {
				[`天干${yearStemWuxing}`]: `年柱天干${yearStem}屬${yearStemWuxing}，代表你的外在表現和性格特質。${yearStemWuxing}元素的特性在你的年柱中體現明顯，影響你的基本性格和命運走向。`,
				[`地支${yearBranchWuxing}`]: `年柱地支${yearBranch}屬${yearBranchWuxing}，代表你的內在潛力和環境影響。${yearBranchWuxing}元素的力量在此發揮作用，與家庭背景、祖先遺傳等因素有關。`,
				[`綜合${yearStemWuxing}${yearBranchWuxing}`]: `年柱${yearStem}${yearBranch}的組合，天干${yearStemWuxing}與地支${yearBranchWuxing}相互作用，形成獨特的能量場，決定了你童年時期的基本運勢格局。`,
			},
			yuezhuData: {
				[`天干${monthStemWuxing}`]: `月柱天干${monthStem}屬${monthStemWuxing}，代表你的情感表達和社交能力。${monthStemWuxing}元素影響你的人際關係模式和心理健康。`,
				[`地支${monthBranchWuxing}`]: `月柱地支${monthBranch}屬${monthBranchWuxing}，反映你內在的情緒狀態和潛在影響力。${monthBranchWuxing}元素決定你的情感穩定性。`,
				[`綜合${monthStemWuxing}${monthBranchWuxing}`]: `月柱${monthStem}${monthBranch}的組合顯示了你青年時期的發展特質，${monthStemWuxing}與${monthBranchWuxing}的配合影響你的學習和成長階段。`,
			},
			rizhuData: {
				[`天干${dayStemWuxing}`]: `日柱天干${dayStem}屬${dayStemWuxing}，這是你的日主，代表你的核心性格和行為模式。${dayStemWuxing}元素是你命格的根本。`,
				[`地支${dayBranchWuxing}`]: `日柱地支${dayBranch}屬${dayBranchWuxing}，代表你的配偶宮和內在情感。${dayBranchWuxing}元素影響你的婚姻和情感生活。`,
				[`綜合${dayStemWuxing}${dayBranchWuxing}`]: `日柱${dayStem}${dayBranch}是你命格的中心，${dayStemWuxing}與${dayBranchWuxing}的結合決定了你成年時期的主要運勢和人生方向。`,
			},
			shizhuData: {
				[`天干${hourStemWuxing}`]: `時柱天干${hourStem}屬${hourStemWuxing}，代表你在社會中的表現和晚年運勢。${hourStemWuxing}元素影響你的事業發展和社交表現。`,
				[`地支${hourBranchWuxing}`]: `時柱地支${hourBranch}屬${hourBranchWuxing}，代表子女宮和你的內在情感。${hourBranchWuxing}元素與子女、下屬的關係密切相關。`,
				[`綜合${hourStemWuxing}${hourBranchWuxing}`]: `時柱${hourStem}${hourBranch}的組合揭示你晚年的生活狀態，${hourStemWuxing}與${hourBranchWuxing}共同影響你的長遠發展和家庭和諧。`,
			},
		};
	};

	const onPrint = () => {
		// Set printing state to true to show all content
		setIsPrinting(true);

		// Store current tab states
		const currentActivePillar = activePillar;
		const currentOpenedNianzhuIndex = openedNianzhuIndex;
		const currentOpenedYuezhuIndex = openedYuezhuIndex;
		const currentOpenedRizhuIndex = openedRizhuIndex;
		const currentOpenedShizhuIndex = openedShizhuIndex;

		// Open all tabs and sections for printing
		setOpenedNianzhuIndex(0); // Show first item of each pillar
		setOpenedYuezhuIndex(0);
		setOpenedRizhuIndex(0);
		setOpenedShizhuIndex(0);

		// Use setTimeout to ensure state updates are applied before printing
		setTimeout(() => {
			// Create print-specific styles
			const printStyles = `
				<style>
					@media print {
						/* Hide elements that shouldn't be printed */
						.no-print {
							display: none !important;
						}
						
						/* Ensure interactive-tabs are visible in PDF */
						.interactive-tabs {
							display: flex !important;
							visibility: visible !important;
							opacity: 1 !important;
							flex-wrap: wrap !important;
						}
						
						/* Ensure buttons within interactive-tabs are visible */
						.interactive-tabs button {
							display: inline-flex !important;
							visibility: visible !important;
							opacity: 1 !important;
							background-color: #A3B116 !important;
							color: white !important;
							padding: 8px 16px !important;
							border-radius: 20px !important;
							border: none !important;
							margin: 2px !important;
						}
						
						/* Override any button hiding rules */
						button:not(.no-print) {
							display: inline-flex !important;
							visibility: visible !important;
							opacity: 1 !important;
						}
						
						/* Force show specific tag buttons */
						.interactive-tabs > *,
						.interactive-tabs button,
						.interactive-tabs span {
							display: inline-flex !important;
							visibility: visible !important;
							opacity: 1 !important;
						}
						
						/* Most specific rule to force buttons to show with styling */
						div.interactive-tabs button {
							display: inline-flex !important;
							visibility: visible !important;
							opacity: 1 !important;
							background-color: #A3B116 !important;
							color: white !important;
							font-size: 14px !important;
							padding: 6px 12px !important;
							margin: 2px !important;
							border-radius: 15px !important;
							border: 1px solid #8A9A14 !important;
						}
						
						/* Page setup to match MacBook Air 16-inch and maximize height usage */
						@page {
							size: A4;
							margin: 0.3in; /* Minimal margins for maximum content space */
						}
						
						/* Scale content to fit MacBook Air 16-inch proportions */
						body {
							-webkit-print-color-adjust: exact !important;
							color-adjust: exact !important;
							transform: scale(0.85); /* Scale down to fit more content */
							transform-origin: top left;
							width: 117.6%; /* Compensate for scaling */
						}
						
						/* Optimize spacing to use full page height */
						* {
							margin: 0.8 !important;
							padding: 0.8 !important;
						}
						
						/* Specific spacing adjustments for better height usage */
						.w-\\[80\\%\\] {
							width: 90% !important; /* Use more width */
						}
						
						section {
							margin-bottom: 8px !important; /* Reduce section gaps */
							padding: 8px !important; /* Reduce internal padding */
						}
						
						h1, h2, h3 {
							margin-bottom: 6px !important; /* Tighter heading spacing */
						}
						
						p, div {
							margin-bottom: 4px !important; /* Tighter paragraph spacing */
							line-height: 1.3 !important; /* Compact line height */
						}
						
						/* Show all tab content when printing */
						.tab-content-print {
							max-height: none !important;
							overflow: visible !important;
							opacity: 1 !important;
						}
						
						/* Ensure all pillar sections are visible */
						.pillar-section {
							display: block !important;
						}
						
						/* Page break settings */
						.page-break-before {
							page-break-before: always;
						}
						
						.page-break-inside-avoid {
							page-break-inside: avoid;
						}
						
						/* Print layout adjustments - removed duplicate body declaration */
						
						/* Ensure images print properly */
						img {
							max-width: 100% !important;
							height: auto !important;
						}
						
						/* MacBook Air 16-inch optimized layout */
						.rounded-\\[26px\\] {
							border-radius: 16px !important; /* Slightly smaller radius for print */
						}
						
						/* Optimize container spacing for more content per page */
						.mb-10 {
							margin-bottom: 6px !important;
						}
						
						.p-12 {
							padding: 8px !important;
						}
						
						.pt-30 {
							padding-top: 12px !important;
						}
						
						.pb-10 {
							padding-bottom: 6px !important;
						}
						
						/* Remove white backgrounds and shadows in PDF */
						.bg-white {
							background: transparent !important;
						}
						
						section.bg-white {
							background: transparent !important;
							box-shadow: none !important;
						}
						
						/* Remove all shadows */
						*[class*="shadow"] {
							box-shadow: none !important;
						}
						
						/* Keep 個人命卦分析 and 主要結論 together */
						.keep-with-next {
							page-break-after: avoid !important;
							page-break-inside: avoid !important;
						}
						
						.stick-with-previous {
							page-break-before: avoid !important;
							page-break-inside: avoid !important;
						}
						
						/* Broader approach to keep related sections together */
						.keep-with-next + section,
						.keep-with-next + * + section {
							page-break-before: avoid !important;
						}
						
						/* Force 四柱排盤&納音解析 to start on new page - override all other rules */
						.page-break-before.relative.w-\\[80\\%\\] {
							page-break-before: always !important;
							break-before: page !important;
						}
						
						/* More specific rule for the four pillars section */
						section:has(h2:contains("四柱排盤")) {
							page-break-before: always !important;
							break-before: page !important;
						}
						
						/* Highest priority rule to force new page */
						.force-new-page {
							page-break-before: always !important;
							break-before: page !important;
							page-break-inside: auto !important;
						}
					}
				</style>
			`;

			// Add print styles to document head
			const head = document.head;
			const existingPrintStyles = document.getElementById("print-styles");
			if (existingPrintStyles) {
				existingPrintStyles.remove();
			}

			const printStyleElement = document.createElement("div");
			printStyleElement.id = "print-styles";
			printStyleElement.innerHTML = printStyles;
			head.appendChild(printStyleElement);

			// Trigger print dialog
			window.print();

			// Clean up after printing
			setTimeout(() => {
				// Restore original tab states
				setActivePillar(currentActivePillar);
				setOpenedNianzhuIndex(currentOpenedNianzhuIndex);
				setOpenedYuezhuIndex(currentOpenedYuezhuIndex);
				setOpenedRizhuIndex(currentOpenedRizhuIndex);
				setOpenedShizhuIndex(currentOpenedShizhuIndex);
				setIsPrinting(false);

				// Remove print styles
				const printStyleElement =
					document.getElementById("print-styles");
				if (printStyleElement) {
					printStyleElement.remove();
				}
			}, 1000);
		}, 500);
	};

	useEffect(() => {
		const loadPersonalData = async () => {
			try {
				let userInfo = null;

				// Try to get data from UserContext first
				if (userData && userData.gender && userData.birthDateTime) {
					console.log("📊 Using data from UserContext:", userData);
					userInfo = userData;
				} else {
					// Fallback to sessionStorage
					const sessionData = sessionStorage.getItem(
						"personalReportUserData"
					);
					if (sessionData) {
						const parsedData = JSON.parse(sessionData);
						console.log(
							"📊 Using data from sessionStorage:",
							parsedData
						);
						userInfo = parsedData;
					}
				}

				if (!userInfo) {
					console.log("❌ No personal data found");
					setLoading(false);
					return;
				}

				setPersonalData(userInfo);

				// Calculate wuxing data
				const calculated = getWuxingData(
					userInfo.birthDateTime,
					userInfo.gender
				);
				setWuxingData(calculated);

				// Generate rich report data using professional base data (same as Report.jsx)
				const richData = await generateRichReportData(calculated);
				setReportDocData(richData);

				// Set debug info
				setDebugInfo(
					`Generated data with keys: ${Object.keys(richData || {}).join(", ")} | Locale: ${locale} | API: ${locale === "zh-CN" ? "zh (Simplified)" : "tw (Traditional)"}`
				);

				setLoading(false);
			} catch (error) {
				console.error("Error loading personal data:", error);
				setLoading(false);
			}
		};

		loadPersonalData();
	}, [userData]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#A3B116] mx-auto mb-4"></div>
					<p className="text-lg font-semibold text-[#5A5A5A]">
						正在分析你的個人命卦...
					</p>
				</div>
			</div>
		);
	}

	if (!personalData || !wuxingData || !reportDocData) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2
						className="mb-4 text-2xl font-bold"
						style={{ color: "#A3B116" }}
					>
						未找到個人資料
					</h2>
					<p className="mb-6 text-gray-600">
						請返回重新填寫個人資料以獲取分析報告
					</p>
					<a
						href="/free"
						className="px-6 py-3 bg-[#A3B116] text-white rounded-lg hover:bg-[#8A9A14] transition-colors"
					>
						返回填寫資料
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex flex-col items-center justify-start w-full min-h-screen  text-center bg-[#EFEFEF]">
			{/* Complex section from Report.jsx */}
			<div className="w-full">
				{/* Header Section with Title and Buttons */}
				<div
					key="section-0"
					className="w-full sm:w-[95%] lg:w-[85%] mx-auto px-4 sm:px-6 lg:px-5 pt-8 sm:pt-16 lg:pt-30 pb-6 sm:pb-8 lg:pb-10 mt-10 flex flex-row items-start bg-[#EFEFEF]"
				>
					{/* Left Section */}
					<div className="flex items-start justify-start flex-1">
						<h1
							ref={(el) => (sectionRefs.current[0] = el)}
							style={{
								fontFamily: "Noto Serif TC, serif",
								fontWeight: 800,
								fontSize: "clamp(28px, 6vw, 56px)",
								color: "#A3B116",
								lineHeight: 1.1,
							}}
						>
							個人命卦分析
						</h1>
					</div>
					{/* Right Section */}
				</div>
				{/* Paragraph below both columns */}
				{/* <div className="w-full sm:w-[90%] lg:w-[80%] align-center mx-auto px-4 sm:px-6 lg:px-5 pb-6 sm:pb-8 mb-6 sm:mb-8 lg:mb-10">
					<p
						style={{
							fontFamily: "Noto Sans HK, sans-serif",
							fontWeight: 400,
							fontSize: "clamp(16px, 3.5vw, 20px)",
							color: "#000000",
							lineHeight: 1.8,
						}}
					>
						{t("p1-4")}
					</p>
				</div>
 */}
				{/* Combined Zodiac and Five Elements Summary Section */}
				<section className="keep-with-next w-full sm:w-[90%] lg:w-[90%] mx-auto bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[26px] p-6 sm:p-8 lg:p-13 mb-6 sm:mb-8 lg:mb-10 shadow-[0_4px_5.3px_rgba(0,0,0,0.25)]">
					{(() => {
						const analysis = calculateWuxingAnalysis(personalData);
						if (!analysis) return null;

						const {
							wuxingData,
							elementCounts,
							missingElements,
							strengthAnalysis,
							usefulGods,
						} = analysis;

						// Calculate zodiac from birth year
						const birthDate = new Date(personalData.birthDateTime);
						const birthYear = birthDate.getFullYear();
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
						const userZodiac =
							zodiacAnimals[(birthYear - 1900) % 12];

						return (
							<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-15">
								{/* Mobile: Zodiac Animal at Top */}
								<div className="w-full mb-4 text-center lg:hidden">
									<div className="flex items-center justify-center w-32 h-32 mx-auto mb-2">
										<Image
											src={`/images/animals/${
												userZodiac === "龍"
													? "dragon"
													: userZodiac === "鼠"
														? "mouse"
														: userZodiac === "牛"
															? "cow"
															: userZodiac ===
																  "虎"
																? "tiger"
																: userZodiac ===
																	  "兔"
																	? "rabbit"
																	: userZodiac ===
																		  "蛇"
																		? "snake"
																		: userZodiac ===
																			  "馬"
																			? "horse"
																			: userZodiac ===
																				  "羊"
																				? "sheep"
																				: userZodiac ===
																					  "猴"
																					? "monkey"
																					: userZodiac ===
																						  "雞"
																						? "chicken"
																						: userZodiac ===
																							  "狗"
																							? "dog"
																							: userZodiac ===
																								  "豬"
																								? "pig"
																								: "mouse"
											}.png`}
											alt={userZodiac}
											width={320}
											height={320}
											className="object-contain w-full h-full"
										/>
									</div>
								</div>

								{/* Desktop: Left Side - Zodiac Animal */}
								<div className="hidden lg:flex lg:w-[30%] lg:flex-col lg:items-center lg:justify-center">
									<div className="text-center">
										{/* Large Zodiac Animal */}
										<div className="flex items-center justify-center mx-auto mb-4 lg:w-80 lg:h-80">
											<Image
												src={`/images/animals/${
													userZodiac === "龍"
														? "dragon"
														: userZodiac === "鼠"
															? "mouse"
															: userZodiac ===
																  "牛"
																? "cow"
																: userZodiac ===
																	  "虎"
																	? "tiger"
																	: userZodiac ===
																		  "兔"
																		? "rabbit"
																		: userZodiac ===
																			  "蛇"
																			? "snake"
																			: userZodiac ===
																				  "馬"
																				? "horse"
																				: userZodiac ===
																					  "羊"
																					? "sheep"
																					: userZodiac ===
																						  "猴"
																						? "monkey"
																						: userZodiac ===
																							  "雞"
																							? "chicken"
																							: userZodiac ===
																								  "狗"
																								? "dog"
																								: userZodiac ===
																									  "豬"
																									? "pig"
																									: "mouse"
												}.png`}
												alt={userZodiac}
												width={320}
												height={320}
												className="object-contain w-full h-full"
											/>
										</div>
									</div>
								</div>

								{/* Combined Analysis Content */}
								<div className="w-full lg:w-[70%] flex flex-col gap-2 sm:gap-4 lg:gap-6">
									{/* Four Pillars in horizontal layout */}
									<div className="grid grid-cols-2 gap-1 mb-2 sm:flex sm:flex-wrap sm:justify-start sm:gap-2 lg:gap-4 sm:mb-3 lg:mb-4">
										{/* 年柱 */}
										<div className="bg-white border-2 border-black rounded-full px-2 sm:px-4 lg:px-6 py-1 sm:py-2 min-w-[70px] sm:min-w-[120px] lg:min-w-[180px] text-center">
											<div
												className="font-bold text-[#374A37]"
												style={{
													fontFamily:
														"Noto Serif TC, serif",
													fontSize:
														"clamp(10px, 2.5vw, 18px)",
												}}
											>
												年柱-
												<span className="text-[#A3B116]">
													{wuxingData.year}
												</span>
											</div>
										</div>

										{/* 月柱 */}
										<div className="bg-white border-2 border-black rounded-full px-2 sm:px-4 lg:px-6 py-1 sm:py-2 min-w-[70px] sm:min-w-[120px] lg:min-w-[180px] text-center">
											<div
												className="font-bold text-[#374A37]"
												style={{
													fontFamily:
														"Noto Serif TC, serif",
													fontSize:
														"clamp(10px, 2.5vw, 18px)",
												}}
											>
												月柱-
												<span className="text-[#A3B116]">
													{wuxingData.month}
												</span>
											</div>
										</div>

										{/* 日柱 */}
										<div className="bg-white border-2 border-black rounded-full px-2 sm:px-4 lg:px-6 py-1 sm:py-2 min-w-[70px] sm:min-w-[120px] lg:min-w-[180px] text-center">
											<div
												className="font-bold text-[#374A37]"
												style={{
													fontFamily:
														"Noto Serif TC, serif",
													fontSize:
														"clamp(10px, 2.5vw, 18px)",
												}}
											>
												日柱-
												<span className="text-[#A3B116]">
													{wuxingData.day}
												</span>
											</div>
										</div>

										{/* 時柱 */}
										<div className="bg-white border-2 border-black rounded-full px-2 sm:px-4 lg:px-6 py-1 sm:py-2 min-w-[70px] sm:min-w-[120px] lg:min-w-[180px] text-center">
											<div
												className="font-bold text-[#374A37]"
												style={{
													fontFamily:
														"Noto Serif TC, serif",
													fontSize:
														"clamp(10px, 2.5vw, 18px)",
												}}
											>
												時柱-
												<span className="text-[#A3B116]">
													{wuxingData.hour}
												</span>
											</div>
										</div>
									</div>

									{/* Five Elements Display */}
									<div
										className="flex flex-col items-center justify-center w-full px-2 py-1 rounded-full sm:flex-row sm:py-2 sm:px-3"
										style={{
											boxShadow:
												"0 2px 5.3px rgba(0,0,0,0.24)",
										}}
									>
										<div className="flex flex-wrap items-center justify-center gap-1 mb-1 sm:gap-2 sm:mb-0">
											{ELEMENTS.map((element) => (
												<div
													key={element}
													className="flex items-center gap-1 mr-1 sm:mr-3"
												>
													<div className="flex items-center justify-center w-2 h-2 sm:w-3 sm:h-3 lg:w-5 lg:h-5">
														<Image
															src={`/images/elements/${element}.png`}
															alt={element}
															width={25}
															height={25}
															className="object-contain w-full h-full"
														/>
													</div>
													<span
														style={{
															fontFamily:
																"Noto Serif TC, serif",
															fontWeight: 900,
															fontSize:
																"clamp(12px, 3vw, 20px)",
															color: wuxingColorMap[
																element
															],
														}}
													>
														{element}
														{elementCounts[element]}
													</span>
												</div>
											))}
										</div>

										{/* Five Elements Status */}
										<div className="flex items-center justify-center">
											<div
												className="text-center"
												style={{
													fontFamily:
														"Noto Serif TC, serif",
													fontWeight: 700,
													fontSize:
														"clamp(10px, 2.5vw, 20px)",
													color: "#A3B116",
												}}
											>
												{missingElements.length === 0
													? "五行齊全-沒有嚴重缺失某一元素"
													: `五行失調-需要補充${missingElements.join("、")}來調和`}
											</div>
										</div>
									</div>

									{/* Three Analysis Sections */}
									<div className="flex flex-col ">
										{/* Mobile: First two in 2 columns, Desktop: First two in 2 columns */}
										<div className="grid grid-cols-2 gap-1 sm:gap-2 lg:gap-4">
											{/* 五行主神 */}
											<div className="p-1 sm:p-2 lg:p-4">
												<h4
													className="font-bold text-center lg:text-start text-[#A3B116] mb-1 sm:mb-2"
													style={{
														fontFamily:
															"Noto Serif TC, serif",
														fontSize:
															"clamp(10px, 2.5vw, 20px)",
													}}
												>
													五行主神
												</h4>
												<div className="p-1 bg-white sm:p-2 lg:p-3 rounded-xl">
													<div className="flex flex-col items-center justify-center h-auto gap-1 p-1 border sm:gap-2 sm:p-2 lg:flex-row lg:h-40 rounded-xl lg:p-0">
														<div
															className="flex items-center justify-center px-1 py-1 rounded-full sm:px-2 sm:py-1 lg:px-4 lg:py-2"
															style={{
																backgroundColor:
																	wuxingColorMap[
																		wuxingData?.dayStemWuxing ||
																			"木"
																	] ||
																	"#4CAF50",
																color: "#FFFFFF",
																fontFamily:
																	"Noto Sans HK, sans-serif",
																fontSize:
																	"clamp(8px, 2vw, 25px)",
																fontWeight:
																	"600",
															}}
														>
															{wuxingData?.dayStemWuxing ||
																"木"}
														</div>
														<img
															src={`/images/elements/${wuxingData?.dayStemWuxing || "木"}.png`}
															alt={
																wuxingData?.dayStemWuxing ||
																"木"
															}
															className="w-6 h-6 sm:w-8 sm:h-8 lg:w-15 lg:h-15"
														/>
													</div>
												</div>
											</div>

											{/* 五行格局 (中) */}
											<div className="p-1 sm:p-2 lg:p-4">
												<h4
													className="font-bold text-center lg:text-start text-[#A3B116] mb-1 sm:mb-2"
													style={{
														fontFamily:
															"Noto Serif TC, serif",
														fontSize:
															"clamp(10px, 2.5vw, 20px)",
													}}
												>
													五行格局
												</h4>
												<div className="p-1 bg-white sm:p-2 lg:p-3 rounded-xl">
													<div
														className="px-1 py-1 text-center border border-gray-300 rounded-full sm:px-2 sm:py-2 lg:px-4 lg:py-4"
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontSize:
																"clamp(10px, 1.5vw, 18px)",
															fontWeight: "600",
															color: "#666",
														}}
													>
														{strengthAnalysis?.strengthDesc ||
															"五行平衡"}
													</div>
													<div
														className="px-1 py-1 mt-1 text-center border border-gray-300 rounded-full sm:px-2 sm:py-1 lg:px-4 lg:py-4"
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontSize:
																"clamp(10px, 1.2vw, 18px)",
															fontWeight: "500",
															color: "#666",
														}}
													>
														{usefulGods?.strategy
															? `${usefulGods.strategy}為要`
															: "調候為要"}
													</div>
												</div>
											</div>
										</div>

										{/* Mobile: Third section below, Desktop: Third column */}
										<div className="p-1 sm:p-2 lg:p-4">
											<h4
												className="text-center lg:text-start font-bold text-[#A3B116] mb-1 sm:mb-2 lg:mb-2"
												style={{
													fontFamily:
														"Noto Serif TC, serif",
													fontSize:
														"clamp(10px, 2.5vw, 20px)",
												}}
											>
												五行格局
											</h4>
											<div className="p-1 bg-white sm:p-2 rounded-xl">
												<div
													className="px-1 py-1 text-center border border-gray-300 rounded-full sm:px-2 sm:py-2 lg:px-7 lg:py-3"
													style={{
														fontFamily:
															"Noto Sans HK, sans-serif",
														fontSize:
															"clamp(10px, 1.5vw, 18px)",
														fontWeight: "600",
														color: "#666",
													}}
												>
													{usefulGods?.primaryGod
														? `用神：${usefulGods.primaryGod}`
														: "調候為要"}
													<br />
													<span>
														命局最需要的五行，起開鍵平衡作用
													</span>
												</div>
												{usefulGods?.auxiliaryGod && (
													<div
														className="px-1 py-1 mt-1 text-center border border-gray-300 rounded-full sm:px-2 sm:py-1 "
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontSize:
																"clamp(10px, 1.2vw, 18px)",
															fontWeight: "500",
															color: "#666",
														}}
													>
														輔神：
														{
															usefulGods.auxiliaryGod
														}
														<br />
														<span>
															命局次需要的五行，起輔助作用
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})()}
				</section>

				{/* 四柱排盤&納音解析 - Tabbed Interface */}
				<section className="force-new-page page-break-before relative w-full sm:w-[90%] lg:w-[90%] mx-auto bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[26px] p-6 sm:p-12 lg:p-20 mb-6 sm:mb-8 lg:mb-10 shadow-[0_4px_5.3px_rgba(0,0,0,0.25)]">
					{/* Background Image at Bottom Right */}
					<div className="absolute bottom-0 right-0 overflow-hidden rounded-br-[20px] sm:rounded-br-[24px] lg:rounded-br-[26px]">
						<Image
							src="/images/report/pillarbg.png"
							alt="Pillar Background"
							width={500}
							height={500}
							className="object-contain w-64 h-64 opacity-40 sm:w-80 sm:h-80 lg:w-full lg:h-full"
							style={{ pointerEvents: "none" }}
						/>
					</div>

					<div className="relative z-10 mb-6 sm:mb-8">
						<h2
							className="font-bold text-[#A3B116] mb-6 sm:mb-10 lg:mb-15 text-center lg:text-start"
							style={{
								fontFamily: "Noto Serif TC, serif",
								fontSize: "clamp(32px, 8vw, 50px)",
							}}
						>
							四柱排盤&納音解析
						</h2>
					</div>

					{/* Navigation Tabs */}
					<div className="relative z-10 mb-6 sm:mb-8 no-print">
						{/* Hide tab navigation when printing */}
						<div className="flex flex-wrap justify-center gap-2 px-2 sm:gap-4 lg:gap-10 sm:px-4">
							{["年柱", "月柱", "日柱", "時柱"].map((pillar) => (
								<button
									key={pillar}
									onClick={() => setActivePillar(pillar)}
									className="transition-all duration-200 flex-1 min-w-[80px] sm:min-w-[120px] lg:min-w-[220px]"
									style={{
										height: "clamp(48px, 10vw, 60px)",
										borderRadius: "clamp(20px, 5vw, 26px)",
										backgroundColor: "#FFFFFF",
										color: "#000000",
										border:
											activePillar === pillar
												? "4px solid #A3B116"
												: "4px solid transparent",
										fontFamily: "Noto Sans HK, sans-serif",
										fontWeight: 600,
										fontSize: "clamp(14px, 3vw, 18px)",
										cursor: "pointer",
										boxShadow:
											"0 2px 6.2px rgba(0, 0, 0, 0.4)",
									}}
								>
									{pillar}
								</button>
							))}
						</div>
					</div>

					{/* Tab Content */}
					<div className="relative z-10">
						{/* 年柱 Content */}
						<div
							className={`pillar-section ${!isPrinting && activePillar !== "年柱" ? "hidden" : ""}`}
						>
							<div className="flex flex-col justify-start gap-4 mb-6 lg:flex-row sm:mb-8 lg:mb-10 lg:gap-0">
								<div className="flex flex-col gap-2 sm:flex-row sm:gap-3 lg:gap-4">
									{/* Left side - H2 title with speaker button */}
									<div className="flex items-center justify-center sm:flex-1 sm:justify-start">
										<h2
											id={`section-0-1`}
											ref={(el) =>
												(sectionRefs.current[1] = el)
											}
											style={{
												fontFamily:
													"Noto Serif TC, serif",
												fontWeight: 800,
												fontSize:
													"clamp(16px, 4vw, 50px)",
												color: "#A3B115",
											}}
											className="text-center lg:text-left"
										>
											年柱-代表根基
										</h2>
									</div>

									{/* Right side - 天干地支 Display */}
									<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 lg:gap-4">
										{(() => {
											if (!personalData || !wuxingData)
												return null;

											// Get 天干 and 地支 for 年柱
											const yearStem =
												personalData.yearStem;
											const yearBranch =
												personalData.yearBranch;
											const yearStemElement =
												wuxingData.yearStemWuxing;
											const yearBranchElement =
												wuxingData.yearBranchWuxing;

											return (
												<>
													{/* 天干 */}
													<div
														className="flex items-center justify-center px-4 py-2 rounded-full sm:px-6 lg:px-15"
														style={{
															backgroundColor:
																wuxingColorMap[
																	yearStemElement
																] || "#999",
															color: "#FFFFFF",
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontSize:
																"clamp(12px, 2.5vw, 16px)",
															fontWeight: "600",
															minWidth: "80px",
														}}
													>
														天干{yearStem}
														{yearStemElement}
													</div>

													{/* 地支 */}
													<div
														className="flex items-center justify-center px-4 py-2 rounded-full sm:px-6 lg:px-15"
														style={{
															backgroundColor:
																wuxingColorMap[
																	yearBranchElement
																] || "#999",
															color: "#FFFFFF",
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontSize:
																"clamp(12px, 2.5vw, 16px)",
															fontWeight: "600",
															minWidth: "80px",
														}}
													>
														地支{yearBranch}
														{yearBranchElement}
													</div>
												</>
											);
										})()}
									</div>
								</div>
							</div>
							<div className="w-full lg:w-[95%] text-center lg:text-start px-2 sm:px-4 lg:px-0">
								<p
									style={{
										fontFamily: "Noto Sans HK, sans-serif",
										fontWeight: 400,
										fontSize: "clamp(16px, 3.5vw, 16px)",
										color: "#000000",
										lineHeight: 1.8,
										marginBottom: 6,
									}}
								>
									{t("p1-5")}
								</p>
							</div>

							{/* Additional 年柱 specific content */}
							<div className="mt-6 sm:mt-8 w-full lg:w-[95%] text-center lg:text-start px-2 sm:px-4 lg:px-0">
								<div className="p-4 sm:p-6">
									<h4
										style={{
											fontFamily: "Noto Serif TC, serif",
											fontWeight: 700,
											fontSize: "clamp(24px, 5vw, 30px)",
											color: "#A3B115",
											marginBottom: 8,
										}}
									>
										年柱 童年期：規則與自由的初次碰撞
									</h4>
									<p
										style={{
											fontFamily:
												"Noto Sans HK, sans-serif",
											fontWeight: 600,
											fontSize:
												"clamp(16px, 3.5vw, 20px)",
											color: "#666666",
											marginBottom: 12,
											fontStyle: "italic",
										}}
									>
										「束縛是成長的加速器」
									</p>
									<div
										style={{
											fontFamily:
												"Noto Sans HK, sans-serif",
											fontWeight: 400,
											fontSize:
												"clamp(16px, 3.5vw, 22px)",
											color: "#333333",
											lineHeight: 1.8,
											marginBottom: 16,
											filter: "blur(5px)",
											userSelect: "none",
										}}
									>
										你小時候的環境（家庭或學校）有明顯的競爭壓力，例如兄弟姊妹成績比較好，或是父母用嚴格標準要求你。同時生活中規則感很重要：
										•
										必須準時回家，作業錯一題罰抄十遍等嚴格要求
										<br />
										• 在競爭環境中學會適應壓力和規則
										<br />•
										早期就培養出在限制中尋找突破的能力
									</div>
									<div
										style={{
											fontFamily:
												"Noto Sans HK, sans-serif",
											fontWeight: 400,
											fontSize:
												"clamp(16px, 3.5vw, 20px)",
											color: "#666666",
											lineHeight: 1.8,
											fontStyle: "italic",
											filter: "blur(5px)",
											userSelect: "none",
										}}
									>
										就例如...
										<br />
										玩遊戲時，別人輕鬆過關，你卻總被要求"先寫完數學題才能玩"，這種約束讓你早早學會在壓力下找方法。
									</div>
								</div>
							</div>
						</div>

						{/* Similar content structure for 月柱, 日柱, 時柱 */}
						{["月柱", "日柱", "時柱"].map((pillarName) => {
							// Show all pillars when printing, otherwise only show active pillar
							if (!isPrinting && activePillar !== pillarName)
								return null;

							let pillarData,
								openedIndex,
								setOpenedIndex,
								pillarRefs,
								translationKey,
								pillarName2;

							if (pillarName === "月柱") {
								pillarName2 = "月柱-代表親人";
								pillarData = reportDocData.yuezhuData;
								openedIndex = openedYuezhuIndex;
								setOpenedIndex = setOpenedYuezhuIndex;
								pillarRefs = yuezhuRefs;
								translationKey = "p1-6";
							} else if (pillarName === "日柱") {
								pillarName2 = "日柱-代表配偶";
								pillarData = reportDocData.rizhuData;
								openedIndex = openedRizhuIndex;
								setOpenedIndex = setOpenedRizhuIndex;
								pillarRefs = rizhuRefs;
								translationKey = "p1-7";
							} else {
								pillarName2 = "時柱-代表子女";
								pillarData = reportDocData.shizhuData;
								openedIndex = openedShizhuIndex;
								setOpenedIndex = setOpenedShizhuIndex;
								pillarRefs = shizhuRefs;
								translationKey = "p1-8";
							}

							return (
								<div
									key={pillarName}
									className={`pillar-section ${!isPrinting && activePillar !== pillarName ? "hidden" : ""}`}
								>
									<div className="flex flex-col justify-start gap-4 mb-6 lg:flex-row sm:mb-8 lg:mb-10 lg:gap-0">
										<div className="flex flex-col gap-2 sm:flex-row sm:gap-3 lg:gap-4">
											{/* Left side - H2 title with speaker button */}
											<div className="flex items-center justify-center sm:flex-1 sm:justify-start">
												<h2
													style={{
														fontFamily:
															"Noto Serif TC, serif",
														fontWeight: 800,
														fontSize:
															"clamp(16px, 4vw, 50px)",
														color: "#A3B115",
													}}
													className="text-center lg:text-left"
												>
													{pillarName2}
												</h2>
											</div>

											{/* Right side - 天干地支 Display */}
											<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 lg:gap-4">
												{(() => {
													if (
														!personalData ||
														!wuxingData
													)
														return null;

													// Get 天干 and 地支 for different pillars
													let stem,
														branch,
														stemElement,
														branchElement;

													if (pillarName === "月柱") {
														stem =
															personalData.monthStem;
														branch =
															personalData.monthBranch;
														stemElement =
															wuxingData.monthStemWuxing;
														branchElement =
															wuxingData.monthBranchWuxing;
													} else if (
														pillarName === "日柱"
													) {
														stem =
															personalData.dayStem;
														branch =
															personalData.dayBranch;
														stemElement =
															wuxingData.dayStemWuxing;
														branchElement =
															wuxingData.dayBranchWuxing;
													} else if (
														pillarName === "時柱"
													) {
														stem =
															personalData.hourStem;
														branch =
															personalData.hourBranch;
														stemElement =
															wuxingData.hourStemWuxing;
														branchElement =
															wuxingData.hourBranchWuxing;
													}

													return (
														<>
															{/* 天干 */}
															<div
																className="flex items-center justify-center px-4 py-2 rounded-full sm:px-6 lg:px-15"
																style={{
																	backgroundColor:
																		wuxingColorMap[
																			stemElement
																		] ||
																		"#999",
																	color: "#FFFFFF",
																	fontFamily:
																		"Noto Sans HK, sans-serif",
																	fontSize:
																		"clamp(12px, 2.5vw, 16px)",
																	fontWeight:
																		"600",
																	minWidth:
																		"80px",
																}}
															>
																天干{stem}
																{stemElement}
															</div>

															{/* 地支 */}
															<div
																className="flex items-center justify-center px-4 py-2 rounded-full sm:px-6 lg:px-15"
																style={{
																	backgroundColor:
																		wuxingColorMap[
																			branchElement
																		] ||
																		"#999",
																	color: "#FFFFFF",
																	fontFamily:
																		"Noto Sans HK, sans-serif",
																	fontSize:
																		"clamp(12px, 2.5vw, 16px)",
																	fontWeight:
																		"600",
																	minWidth:
																		"80px",
																}}
															>
																地支{branch}
																{branchElement}
															</div>
														</>
													);
												})()}
											</div>
										</div>
									</div>

									<div className="w-full lg:w-[95%] text-center lg:text-start px-2 sm:px-4 lg:px-0">
										<p
											style={{
												fontFamily:
													"Noto Sans HK, sans-serif",
												fontWeight: 400,
												fontSize:
													"clamp(16px, 3.5vw, 16px)",
												color: "#000000",
												lineHeight: 1.8,
												marginBottom: 6,
											}}
										>
											{t(translationKey)}
										</p>
									</div>

									{/* Additional pillar specific content */}
									<div className="mt-6 sm:mt-8 w-full lg:w-[95%] text-center lg:text-start px-2 sm:px-4 lg:px-0">
										<div className="p-4 sm:p-6">
											{pillarName === "月柱" && (
												<>
													<h4
														style={{
															fontFamily:
																"Noto Serif TC, serif",
															fontWeight: 700,
															fontSize:
																"clamp(24px, 5vw, 30px)",
															color: "#A3B115",
															marginBottom: 8,
														}}
													>
														月柱
														青年期：鋒芒與規則的碰撞
													</h4>
													<p
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontWeight: 600,
															fontSize:
																"clamp(16px, 3.5vw, 20px)",
															color: "#666666",
															marginBottom: 12,
															fontStyle: "italic",
														}}
													>
														「才華是通行證，也是枷鎖」
													</p>
													<div
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontWeight: 400,
															fontSize:
																"clamp(16px, 3.5vw, 20px)",
															color: "#333333",
															lineHeight: 1.8,
															filter: "blur(5px)",
															userSelect: "none",
														}}
													>
														17-32歲的你如同出鞘的劍鋒（酉金），在競爭激烈的環境中：
														•
														同學輕鬆玩樂時，你卻在實驗室/圖書館鑽研技能（癸水傷官顯現）
														<br />
														•
														參加競賽總被提醒「拿金牌才能保送」的殘酷規則（陽刃酉金的雙刃劍效應）
														<br />•
														職場晉升路上，既要用創新突圍（癸水），又須謹守行業潛規則（酉金肅殺之氣）
													</div>
													<div
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontWeight: 400,
															fontSize:
																"clamp(16px, 3.5vw, 22px)",
															color: "#666666",
															lineHeight: 1.8,
															fontStyle: "italic",
															filter: "blur(5px)",
															userSelect: "none",
														}}
													>
														就像編程大賽中，別人隨性寫的代碼能運行，你的作品卻被要求「零誤差+商業化落地」——這種打磨過程，最終淬煉出你獨特的專業話語權。
													</div>
												</>
											)}

											{pillarName === "日柱" && (
												<>
													<h4
														style={{
															fontFamily:
																"Noto Serif TC, serif",
															fontWeight: 700,
															fontSize:
																"clamp(24px, 5vw, 30px)",
															color: "#A3B115",
															marginBottom: 8,
														}}
													>
														日柱
														中年期：剛強與柔韌的平衡術
													</h4>
													<p
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontWeight: 600,
															fontSize:
																"clamp(16px, 3.5vw, 20px)",
															color: "#666666",
															marginBottom: 12,
															fontStyle: "italic",
														}}
													>
														「規則從外部條文，變成了內心律動」
													</p>
													<div
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontWeight: 400,
															fontSize:
																"clamp(14px, 3vw, 20px)",
															color: "#333333",
															lineHeight: 1.8,
															marginBottom: 16,
															filter: "blur(5px)",
															userSelect: "none",
														}}
													>
														33-48歲的你（庚金子水）經歷深刻轉變：
														•
														商務談判桌上，既堅持底線（庚金的剛性），又巧妙讓步（子水的滲透力）
														<br />
														•
														教育子女時，重複自己童年厭惡的規則：「週末先完成企劃案才能打球」
														<br />•
														深夜加班改方案，突然理解當年父母「錯一題罰十遍」背後的恐懼——怕你輸給世界
													</div>
													<div
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontWeight: 400,
															fontSize:
																"clamp(14px, 3vw, 16px)",
															color: "#666666",
															lineHeight: 1.8,
															fontStyle: "italic",

															padding: 12,

															filter: "blur(5px)",
															userSelect: "none",
														}}
													>
														如同駕駛越野車，青年期猛踩油門（月柱鋒芒），中年學會在剎車與油門間精準切換（日柱剛柔並濟），載著全家駛過事業與家庭的險峻山路。
													</div>
												</>
											)}

											{pillarName === "時柱" && (
												<>
													<h4
														style={{
															fontFamily:
																"Noto Serif TC, serif",
															fontWeight: 700,
															fontSize:
																"clamp(24px, 5vw, 30px)",
															color: "#A3B115",
															marginBottom: 8,
														}}
													>
														時柱
														晚年期：火把與燈塔的傳承
													</h4>
													<p
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontWeight: 600,
															fontSize:
																"clamp(16px, 3.5vw, 20px)",
															color: "#666666",
															marginBottom: 12,
															fontStyle: "italic",
														}}
													>
														「曾經反抗的規則，成了親手點亮的燈塔」
													</p>
													<div
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontWeight: 400,
															fontSize:
																"clamp(14px, 3vw, 20px)",
															color: "#333333",
															lineHeight: 1.8,
															marginBottom: 16,
															filter: "blur(5px)",
															userSelect: "none",
														}}
													>
														48歲後的你（丁火丑土）見證奇妙循環：
														•
														給孫輩講故事時，脫口而出父親當年的格言：「遊戲規則不是束縛，是賽道地圖」
														<br />
														•
														擔任行業評委，刻意在嚴格標準（丑土）與破格創意（丁火）間留出縫隙
														<br />•
														整理舊物發現童年罰抄的數學本，笑著用它教孩子「錯誤是加密的成功指令」
													</div>
													<div
														style={{
															fontFamily:
																"Noto Sans HK, sans-serif",
															fontWeight: 400,
															fontSize:
																"clamp(14px, 3vw, 16px)",
															color: "#666666",
															lineHeight: 1.8,
															fontStyle: "italic",
															filter: "blur(5px)",
															userSelect: "none",
														}}
													>
														就像老工匠打磨玉器，年輕時恨透規矩方圓（年柱），中年用規矩創造價值（日柱），晚年將規矩化成傳承的藝術（時柱）——那方丑土印綬，終成托起新芽的沃壤。
													</div>
												</>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</section>

				{/* New Sections Based on Attached Images */}
				{(() => {
					// Always render sections, use fallback if aiAnalysis is null
					const analysis = null || {
						mainConclusion: {
							wuxingPattern: "金火兩旺",
							pattern: "身強食神制殺格",
						},
						wuxingDistribution: {
							detailed: {
								wood: {
									count: 1,
									strength: "★",
									characteristic: "孤立無根",
									influence: "創造力受限，難將靈感系統化落地",
								},
								fire: {
									count: 3,
									strength: "★★★",
									characteristic: "外顯熾熱",
									influence:
										"行動力強、熱情主動，但易急躁衝動",
								},
								earth: {
									count: 3,
									strength: "★★",
									characteristic: "鬆散無力",
									influence: "財運不穩，存錢實力，易衝動消費",
								},
								metal: {
									count: 4,
									strength: "★★★★",
									characteristic: "剛硬密集",
									influence:
										"追求完美、重規則壓力，身心易疲憊",
								},
								water: {
									count: 2,
									strength: "★★★",
									characteristic: "潛藏暗流",
									influence: "直覺敏銳，但思慮多，易焦慮失眠",
								},
							},
							conflicts: [
								{
									title: "金火對峙",
									description:
										"金（刚烈）与火（热烈）两强相争，消耗日主能量，易引发身心疲惫。",
									example:
										'想学习新技能（木），总被工作任务（金）打断，导致计划频繁中断，常怀入"忙到无成果"状态。',
								},
							],
						},
						tenGodsPattern: {
							selectedGod: "正印",
							description:
								"年干透出，主智慧、學業與長輩緣，但孤立無根，需主動尋求知識滋養。",
							characteristics:
								"你學東西比一般人快，尤其擅長支持、企劃類知識容易獲得威信教等你的長輩或老師（例如實習時的導師主動帶你）",
							challenges:
								"但甲木被年支申金「斬腳」（木坐金上），意味著...",
							coreAnalysis: {
								title: "核心矛盾-才華vs壓力",
								sections: [
									{
										title: "得vs失財",
										color: "red",
										content: "你的創意能夠為你帶來來利",
										example:
											"等你發出了一個出色的營銷方案或改功獲得大獎暑，這是你實質的才華在發揮",
									},
									{
										title: "劫財vs年財",
										color: "purple",
										content:
											"在與朋友合作時，你可能會面臨財分配的問題",
										example:
											"讓約中容間友作夥伴所各等级的利益分配能夠促進合作的順利進行，避免未來的予盾",
									},
									{
										title: "正印效時",
										color: "green",
										content:
											"調要時到，往在能夠到判帶來幫助",
										example:
											"當你為求業務訂定個等，或是待在某個況的危勞求，可能有上老師為你解答",
									},
								],
							},
						},
					};

					// Helper functions for element analysis
					const getStar = (strength) => {
						if (strength === "★★★★★") return 5;
						if (strength === "★★★★") return 4;
						if (strength === "★★★") return 3;
						if (strength === "★★") return 2;
						if (strength === "★") return 1;
						return 0;
					};

					const getElementTrait = (element, starCount) => {
						const traits = {
							金: [
								"缺失",
								"微弱",
								"平穩",
								"強勁",
								"剛硬密集",
								"過旺失控",
							],
							木: [
								"缺失",
								"孤立無根",
								"生機初現",
								"茂盛生長",
								"繁茂昌盛",
								"過旺失控",
							],
							水: [
								"缺失",
								"涓涓細流",
								"清澈流動",
								"潛藏暗流",
								"波濤洶湧",
								"氾濫成災",
							],
							火: [
								"缺失",
								"微弱燭光",
								"溫暖照明",
								"外顯熾熱",
								"烈火燎原",
								"燥熱失控",
							],
							土: [
								"缺失",
								"貧瘠薄弱",
								"基礎穩固",
								"鬆散無力",
								"厚重包容",
								"過厚阻滯",
							],
						};
						return traits[element]?.[starCount] || "未知";
					};

					const getElementInfluence = (element, starCount) => {
						const influences = {
							金: [
								"缺乏規則意識，做事散漫",
								"略顯謹慎，但執行力不足",
								"做事有條理，講原則",
								"追求完美，有責任心",
								"追求完美、重規則壓力，身心易疲憊",
								"過於嚴苛，壓力過大",
							],
							木: [
								"缺乏創新思維，適應力差",
								"創造力受限，難將靈感系統化落地",
								"有一定創意和適應能力",
								"創意豐富，適應力強",
								"創新能力出眾，但可能好高騖遠",
								"想法過多，難以落實",
							],
							水: [
								"思維僵化，缺乏靈活性",
								"思考較慢，但內心敏感",
								"思維靈活，有一定智慧",
								"直覺敏銳，但思慮多，易焦慮失眠",
								"智慧超群，但可能過度分析",
								"思慮過度，容易憂鬱",
							],
							火: [
								"缺乏熱情，行動力不足",
								"內向含蓄，不善表達",
								"有一定熱情和行動力",
								"行動力強、熱情主動，但易急躁衝動",
								"熱情四射，但容易衝動",
								"過於急躁，易發脾氣",
							],
							土: [
								"財運差，缺乏安全感",
								"財運一般，較為保守",
								"財運穩定，有儲蓄習慣",
								"財運不穩，存錢實力，易衝動消費",
								"財運豐厚，但可能過於保守",
								"過於固執，缺乏變通",
							],
						};
						return influences[element]?.[starCount] || "影響未明";
					};

					// Calculate comprehensive element distribution function
					const calculateComprehensiveElementDistribution = (
						userInfo
					) => {
						if (!userInfo || !userInfo.birthDateTime) {
							console.warn(
								"calculateComprehensiveElementDistribution: Missing userInfo or birthDateTime",
								userInfo
							);
							return null;
						}

						try {
							// Get wuxing data from nayin library
							const wuxingData = getWuxingData(
								new Date(userInfo.birthDateTime),
								userInfo.gender
							);

							// Element counts combining stems, branches, and hidden stems
							const elementCounts = {
								金: 0,
								木: 0,
								水: 0,
								火: 0,
								土: 0,
							};

							// Count stems (weight 1)
							const stemElements = [
								wuxingData.yearStemWuxing,
								wuxingData.monthStemWuxing,
								wuxingData.dayStemWuxing,
								wuxingData.hourStemWuxing,
							];

							stemElements.forEach((element) => {
								if (elementCounts[element] !== undefined) {
									elementCounts[element] += 1;
								}
							});

							// Count branches (weight 1)
							const branchElements = [
								wuxingData.yearBranchWuxing,
								wuxingData.monthBranchWuxing,
								wuxingData.dayBranchWuxing,
								wuxingData.hourBranchWuxing,
							];

							branchElements.forEach((element) => {
								if (elementCounts[element] !== undefined) {
									elementCounts[element] += 1;
								}
							});

							// Note: Hidden stems (藏干) are not included in this calculation
							// Only visible stems and branches are counted

							// Convert counts to strength ratings (stars)
							const elementStrengthMap = {};
							Object.entries(elementCounts).forEach(
								([element, count]) => {
									if (count === 0) {
										elementStrengthMap[element] = "";
									} else if (count >= 4.5) {
										elementStrengthMap[element] = "★★★★★";
									} else if (count >= 3.5) {
										elementStrengthMap[element] = "★★★★";
									} else if (count >= 2.5) {
										elementStrengthMap[element] = "★★★";
									} else if (count >= 1.5) {
										elementStrengthMap[element] = "★★";
									} else {
										elementStrengthMap[element] = "★";
									}
								}
							);

							return {
								elementCounts,
								elementStrengthMap,
								wuxingData,
							};
						} catch (error) {
							console.error(
								"Error calculating comprehensive element distribution:",
								error
							);
							return null;
						}
					};

					return (
						<>
							{/* Debug: Check analysis data */}
							{console.log(
								"🧪 Analysis object in 化解提示:",
								analysis
							)}
							{console.log(
								"🧪 LifeAdvice available:",
								analysis?.lifeAdvice
							)}
							{console.log(
								"🧪 LifeAdvice tips count:",
								analysis?.lifeAdvice?.tips?.length || 0
							)}
							{console.log(
								"⚠️ Using AI content:",
								!!analysis?.lifeAdvice?.tips,
								"vs Fallback content:",
								!analysis?.lifeAdvice?.tips
							)}

							{/* 五行分佈深度解析 Section - Third Image */}
							<section className="page-break-before w-full sm:w-[90%] lg:w-[90%] mx-auto bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[26px] p-6 sm:p-8 lg:p-12 mb-6 sm:mb-8 lg:mb-10 shadow-[0_4px_5.3px_rgba(0,0,0,0.25)]">
								<div className="mb-6 sm:mb-8">
									<h2
										className="font-bold text-[#A3B116] text-center lg:text-start mb-4 sm:mb-5 lg:mb-6"
										style={{
											fontFamily: "Noto Serif TC, serif",
											fontSize: "clamp(32px, 7vw, 48px)",
										}}
									>
										五行分佈深度解析
									</h2>
								</div>

								{/* Five elements analysis table */}
								<div className="p-4 mb-6 overflow-x-auto sm:p-6 lg:p-8 sm:mb-8 rounded-2xl">
									{(() => {
										const distribution =
											calculateComprehensiveElementDistribution(
												personalData
											);

										if (!distribution) {
											return (
												<div className="py-8 text-center text-gray-500">
													無法載入五行分析數據
												</div>
											);
										}

										const {
											elementCounts,
											elementStrengthMap,
										} = distribution;
										const elements = [
											"金",
											"木",
											"水",
											"火",
											"土",
										];

										return (
											<>
												<div
													className="grid gap-1 mb-2 text-center sm:gap-2 sm:mb-4"
													style={{
														gridTemplateColumns:
															"1.5fr 1fr 1fr 1.5fr 2fr",
													}}
												>
													<div
														className="py-1 text-xs font-bold text-white rounded-lg sm:py-2 sm:text-sm"
														style={{
															fontFamily:
																"Noto Serif TC, serif",
														}}
													>
														五行
													</div>
													<div
														className="bg-[#A3B116] text-white py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-sm"
														style={{
															fontFamily:
																"Noto Serif TC, serif",
														}}
													>
														數量
													</div>
													<div
														className="bg-[#A3B116] text-white py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-sm"
														style={{
															fontFamily:
																"Noto Serif TC, serif",
														}}
													>
														強度
													</div>
													<div
														className="bg-[#A3B116] text-white py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-sm"
														style={{
															fontFamily:
																"Noto Serif TC, serif",
														}}
													>
														特性
													</div>
													<div
														className="bg-[#A3B116] text-white py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-sm"
														style={{
															fontFamily:
																"Noto Serif TC, serif",
														}}
													>
														對命主的影響
													</div>
												</div>

												{elements.map((element) => {
													const count =
														elementCounts[
															element
														] || 0;
													const strength =
														elementStrengthMap[
															element
														] || "";
													const star =
														getStar(strength);

													return (
														<div
															key={element}
															className="grid items-center gap-1 mb-1 text-xs text-center sm:gap-2 sm:mb-2 sm:text-sm"
															style={{
																gridTemplateColumns:
																	"1.5fr 1fr 1fr 1.5fr 2fr",
															}}
														>
															{/* Element with image and color */}
															<div
																className="text-white py-1 sm:py-2 lg:py-3 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 lg:gap-2 font-bold text-xs sm:text-sm"
																style={{
																	backgroundColor:
																		wuxingColorMap[
																			element
																		],
																}}
															>
																<img
																	src={`/images/elements/${element}.png`}
																	alt={
																		element
																	}
																	className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6"
																	style={{
																		filter: "brightness(0) saturate(100%) invert(1)",
																	}}
																/>
																<span
																	className="text-xs sm:text-sm"
																	style={{
																		fontFamily:
																			"Noto Serif TC, serif",
																	}}
																>
																	{element}
																</span>
															</div>

															{/* Count */}
															<div className="bg-[#EFEFEF] py-2 sm:py-3 rounded-lg font-bold text-[#374A37] text-xs sm:text-sm lg:text-base">
																{count.toFixed(
																	1
																)}
															</div>

															{/* Strength */}
															<div className="py-2 sm:py-3 font-bold text-yellow-600 bg-[#EFEFEF] rounded-lg text-xs sm:text-sm lg:text-base">
																{strength}
															</div>

															{/* 特性 */}
															<div className="bg-[#EFEFEF] py-2 sm:py-3 rounded-lg text-[#374A37] text-left px-2 sm:px-3 text-xs sm:text-sm lg:text-base leading-tight">
																{getElementTrait(
																	element,
																	star
																)}
															</div>

															{/* 對命主的影響 */}
															<div
																className="bg-[#EFEFEF] py-2 sm:py-3 rounded-lg text-left px-2 sm:px-3 text-xs sm:text-sm lg:text-base leading-tight"
																style={{
																	color: "#3E5513",
																}}
															>
																{getElementInfluence(
																	element,
																	star
																)}
															</div>
														</div>
													);
												})}
											</>
										);
									})()}
								</div>

								{/* 五行顯潛關懷點 Section */}
								<div className="mt-8 sm:mt-10 lg:mt-12">
									<h3
										className="font-bold text-center lg:text-start text-[#A3B116] mb-3 sm:mb-4"
										style={{
											fontFamily: "Noto Serif TC, serif",
											fontSize: "clamp(28px, 6vw, 40px)",
										}}
									>
										五行疏通阻礙點
									</h3>
									<p
										className="text-center lg:text-start text-[#5A5A5A] mb-4 sm:mb-6 px-2 sm:px-4 lg:px-0"
										style={{
											fontFamily:
												"Noto Sans HK, sans-serif",
											fontWeight: 400,
											fontSize:
												"clamp(16px, 3.5vw, 18px)",
											lineHeight: 1.6,
										}}
									>
										五行若是之間的平衡如何對各負面影響？
									</p>

									{/* Concern Cards */}
									<div className="grid grid-cols-3 gap-2 mb-6 sm:gap-4 lg:gap-6 sm:mb-8">
										{(() => {
											// Generate concern points based on actual element analysis
											const distribution =
												calculateComprehensiveElementDistribution(
													personalData
												);
											if (!distribution) return null;

											const { elementCounts } =
												distribution;
											const concerns = [];

											// Analyze element imbalances and generate appropriate concerns
											const sortedElements =
												Object.entries(
													elementCounts
												).sort(([, a], [, b]) => b - a);

											const strongest = sortedElements[0];
											const weakest =
												sortedElements.find(
													([, count]) => count === 0
												) ||
												sortedElements[
													sortedElements.length - 1
												];

											// Metal-Fire conflict (金火對峙)
											if (
												elementCounts.金 > 2 &&
												elementCounts.火 > 2
											) {
												concerns.push({
													title: "金火對峙",
													color: "bg-red-500",
													description:
														"金與火兩強相爭，容易產生內心矛盾與壓力",
												});
											}

											// Wood weakness (木弱難成)
											if (elementCounts.木 <= 1) {
												concerns.push({
													title: "木弱難成",
													color: "bg-green-600",
													description:
														"木元素不足，創新能力受限，適應力較弱",
												});
											}

											// Water-Earth imbalance (水土失衡)
											if (
												Math.abs(
													elementCounts.水 -
														elementCounts.土
												) > 2
											) {
												concerns.push({
													title: "水土失衡",
													color: "bg-blue-500",
													description:
														"水土比例失調，影響情緒穩定與財運發展",
												});
											}

											// If no specific conflicts, generate general concerns based on strongest/weakest
											if (concerns.length === 0) {
												if (
													strongest &&
													strongest[1] > 3
												) {
													concerns.push({
														title: `${strongest[0]}過旺`,
														color: "bg-yellow-600",
														description: `${strongest[0]}元素過強，需要其他元素來平衡調和`,
													});
												}
												if (
													weakest &&
													weakest[1] === 0
												) {
													concerns.push({
														title: `${weakest[0]}缺失`,
														color: "bg-gray-500",
														description: `缺乏${weakest[0]}元素，建議通過相應方式補強`,
													});
												}
											}

											// Ensure we have at least 3 concerns for display
											while (concerns.length < 3) {
												const remainingElements = [
													"金",
													"木",
													"水",
													"火",
													"土",
												].filter(
													(el) =>
														!concerns.some((c) =>
															c.title.includes(el)
														)
												);
												if (
													remainingElements.length > 0
												) {
													const element =
														remainingElements[0];
													concerns.push({
														title: `${element}調和`,
														color: "bg-gray-400",
														description: `${element}元素需要適當調節以達到最佳平衡狀態`,
													});
												} else {
													break;
												}
											}

											return concerns
												.slice(0, 3)
												.map((concern, index) => (
													<div
														key={index}
														className="bg-gray-100 rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-4 lg:p-6 flex flex-col items-start justify-start text-center min-h-[120px] sm:min-h-[180px] lg:min-h-[220px] relative overflow-hidden"
													>
														<div className="bg-[#B4003C] text-white px-2 sm:px-4 lg:px-6 py-1 sm:py-2 rounded-full mb-1 sm:mb-2 lg:mb-3">
															<span
																className="text-xs font-bold sm:text-sm lg:text-base"
																style={{
																	fontFamily:
																		"Noto Serif TC, serif",
																}}
															>
																{concern.title}
															</span>
														</div>

														{/* Question mark placeholder */}
														<div className="flex items-center justify-center flex-1">
															<div className="text-4xl text-gray-400 sm:text-6xl lg:text-8xl xl:text-9xl">
																?
															</div>
														</div>

														{/* Blur and fade overlay for bottom half only */}
														{/* <div
															className="absolute bottom-0 left-0 right-0 pointer-events-none"
															style={{
																height: "50%",
																background: `linear-gradient(to bottom, 
																	transparent 0%, 
																	rgba(255, 255, 255, 0.2) 20%, 
																	rgba(255, 255, 255, 0.6) 60%, 
																	rgba(255, 255, 255, 1) 100%)`,
																backdropFilter:
																	"blur(4px)",
																WebkitBackdropFilter:
																	"blur(4px)",
															}}
														/> */}
													</div>
												));
										})()}
									</div>

									{/* Call to Action Button */}
									<div className="text-center">
										{/* <button
											className="bg-[#A3B116] text-white px-12 py-4 rounded-full text-lg font-bold hover:bg-[#8A9A14] transition-colors"
											style={{
												fontFamily:
													"Noto Serif TC, serif",
											}}
											onClick={() => {
												// Add your action here - could be to show more details, navigate, etc.
												alert(
													"了解更多五行調和方法功能待實現"
												);
											}}
										>
											了解化解方法
										</button> */}
									</div>
								</div>
							</section>
							<section className="page-break-before w-[90%] mx-auto">
								<div className="mb-8">
									<h2
										className="text-5xl ml-4 font-bold text-start text-[#374A37] mb-10"
										style={{
											fontFamily: "Noto Serif TC, serif",
										}}
									>
										化解提示
									</h2>
									<p
										className="ml-4 text-xl text-black text-start"
										style={{
											fontFamily:
												"Noto Sans HK, sans-serif",
											fontWeight: 400,
											lineHeight: 1.6,
										}}
									>
										透過適當指導，你可以在生活和工作中更好地平衡才華與壓力，發揮自己的潛力，迎接機會的來臨。
									</p>
								</div>
							</section>
							{/* 化解提示 Section */}
							<section className="w-full sm:w-[95%] lg:w-[90%] mx-auto bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[26px] p-6 sm:p-8 lg:p-12 mb-6 sm:mb-8 lg:mb-10 shadow-[0_4px_5.3px_rgba(0,0,0,0.25)]">
								{/* 綜合調理与人生建議 */}
								<div className="mb-8 sm:mb-10 lg:mb-12">
									<h3
										className="font-bold text-[#A3B116] mb-6 sm:mb-8 text-center lg:text-start"
										style={{
											fontFamily: "Noto Serif TC, serif",
											fontSize: "clamp(24px, 5vw, 50px)",
										}}
									>
										綜合調理与人生建議
									</h3>

									{/* Main Tab Navigation */}
									<div className="flex flex-row justify-center gap-2 px-2 mb-8 sm:gap-4 sm:px-4 lg:gap-8 sm:mb-12 lg:mb-15 lg:px-25">
										{[
											{
												key: "五行調和",
												image: "/images/report/star.png",
											},
											{
												key: "身心養護",
												image: "/images/report/heart.png",
											},
											{
												key: "事業方向",
												image: "/images/report/bag.png",
											},
										].map((tab) => (
											<div
												key={tab.key}
												className="flex flex-col items-center flex-1 max-w-full gap-1 sm:gap-2 lg:gap-3"
											>
												<button className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full transition-all duration-300 flex items-center justify-center bg-[#EFEFEF] shadow-lg">
													{tab.image && (
														<div className="flex items-center justify-center w-full h-full overflow-hidden rounded-full">
															<img
																src={tab.image}
																alt={tab.key}
																className="object-contain w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16"
																onError={(
																	e
																) => {
																	e.target.style.display =
																		"none";
																	e.target.nextSibling.style.display =
																		"flex";
																}}
															/>
														</div>
													)}
												</button>
												<span className="max-w-full text-xs font-semibold text-center text-gray-600 truncate sm:text-sm lg:text-base xl:text-lg">
													{tab.key}
												</span>
											</div>
										))}
									</div>

									{/* Question mark placeholder */}
									<div className="p-8 mb-4 text-center bg-gray-200 sm:p-12 sm:mb-6 rounded-xl sm:rounded-2xl">
										{/* Show placeholder in PDF */}
										<div className="mb-4 text-6xl text-gray-400 sm:text-8xl lg:text-9xl">
											?
										</div>
									</div>

									{/* 解鎖詳細分析 Button */}
									<div className="text-center no-print">
										{/* Hide unlock button when printing */}
										<button
											className="bg-[#A3B116] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold hover:bg-[#8A9A14] transition-colors flex items-center gap-2 mx-auto text-sm sm:text-base"
											style={{
												fontFamily:
													"Noto Serif TC, serif",
											}}
											onClick={() => {
												alert("解鎖詳細分析功能待實現");
											}}
										>
											🔓 解鎖詳細分析
										</button>
									</div>
								</div>
							</section>

							{/* 人際調衡要點 Section */}
							<section className="w-full sm:w-[90%] lg:w-[90%] mx-auto bg-white rounded-[20px] sm:rounded-[24px] lg:rounded-[26px] p-6 sm:p-8 lg:p-12 mb-6 sm:mb-8 lg:mb-10 shadow-[0_4px_5.3px_rgba(0,0,0,0.25)]">
								<div className="mb-6 sm:mb-8">
									<h2
										className="font-bold text-[#A3B116] mb-4 sm:mb-6 text-center lg:text-start"
										style={{
											fontFamily: "Noto Serif TC, serif",
											fontSize: "clamp(32px, 8vw, 50px)",
										}}
									>
										人際調衡要點
									</h2>
									<p
										className="text-center lg:text-start text-[#5A5A5A] px-2 sm:px-4 lg:px-0"
										style={{
											fontFamily:
												"Noto Sans HK, sans-serif",
											fontWeight: 400,
											fontSize:
												"clamp(16px, 3.5vw, 20px)",
											lineHeight: 1.6,
										}}
									>
										無論什麼命理，良好的人際關係都是成功的重要基石...
									</p>
								</div>

								{/* Content placeholder */}
								<div className="p-8 mb-4 text-center bg-gray-200 sm:p-12 sm:mb-6 rounded-xl sm:rounded-2xl">
									{/* Show placeholder in PDF */}
									<div className="mb-4 text-6xl text-gray-400 sm:text-8xl lg:text-9xl">
										?
									</div>
								</div>

								{/* 解鎖詳細分析 Button */}
								<div className="text-center no-print">
									{/* Hide unlock button when printing */}
									<button
										className="bg-[#A3B116] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold hover:bg-[#8A9A14] transition-colors flex items-center gap-2 mx-auto text-sm sm:text-base"
										style={{
											fontFamily: "Noto Serif TC, serif",
										}}
										onClick={() => {
											alert("解鎖詳細分析功能待實現");
										}}
									>
										🔓 解鎖詳細分析
									</button>
								</div>
							</section>
						</>
					);
				})()}
			</div>
		</div>
	);
};

export default PersonalReportDisplay;
