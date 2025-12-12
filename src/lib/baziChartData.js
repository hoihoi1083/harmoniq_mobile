/**
 * BaZi Chart Data Processor
 * Processes user birthday into complete data structure for BaZi chart visualization
 * Integrates: accurateBaziCalculation, nayin library (for hidden stems & ten gods), and baziRelationships
 */

import { calculateAccurateBaZi } from "./accurateBaziCalculation";
import getWuxingData from "./nayin";
import { analyzeAllRelationships } from "./baziRelationships";
import lunisolar from "lunisolar";
import { takeSound } from "@lunisolar/plugin-takesound";
import { char8ex } from "@lunisolar/plugin-char8ex";
import moment from "moment";

lunisolar.extend(takeSound).extend(char8ex);

/**
 * Get comprehensive BaZi chart data for visualization
 * @param {Date|string} birthDateTime - User's birth date and time
 * @param {string} gender - 'male' or 'female'
 * @param {string} userName - User's name for display
 * @returns {Object} Complete BaZi chart data
 */
export function getBaziChartData(
	birthDateTime,
	gender = "male",
	userName = "用戶"
) {
	try {
		// 1. Get basic BaZi calculation
		const baziBasic = calculateAccurateBaZi(birthDateTime);

		// 2. Get comprehensive wuxing data (includes hidden stems and ten gods)
		const wuxingData = getWuxingData(new Date(birthDateTime), gender);

		// 3. Analyze all relationships
		const relationships = analyzeAllRelationships({
			yearStem: baziBasic.yearStem,
			yearBranch: baziBasic.yearBranch,
			monthStem: baziBasic.monthStem,
			monthBranch: baziBasic.monthBranch,
			dayStem: baziBasic.dayStem,
			dayBranch: baziBasic.dayBranch,
			hourStem: baziBasic.hourStem,
			hourBranch: baziBasic.hourBranch,
		});

		// 4. Calculate element distribution for personality analysis
		const elementDistribution = calculateElementDistribution(wuxingData);

		// 5. Get day master personality
		const dayMasterPersonality = getDayMasterPersonality(
			baziBasic.dayStem,
			baziBasic.dayElement
		);

		// 6. Format birth date info
		const birthDate = moment(birthDateTime);
		const lunarInfo = getLunarDateInfo(birthDateTime);

		return {
			// Basic info
			userName,
			birthDateTime: birthDate.format("YYYY-MM-DD HH:mm"),
			lunarDate: lunarInfo,

			// Four Pillars
			pillars: {
				year: {
					label: "年柱",
					stem: baziBasic.yearStem,
					branch: baziBasic.yearBranch,
					combined: baziBasic.year,
					nayin: wuxingData.yearNayin,
					stemTenGod: wuxingData.yearStemTenGod,
					branchTenGod: wuxingData.yearBranchTenGod,
					hiddenStems: wuxingData.yearBranchHiddenStems,
				},
				month: {
					label: "月柱",
					stem: baziBasic.monthStem,
					branch: baziBasic.monthBranch,
					combined: baziBasic.month,
					nayin: wuxingData.monthNayin,
					stemTenGod: wuxingData.monthStemTenGod,
					branchTenGod: wuxingData.monthBranchTenGod,
					hiddenStems: wuxingData.monthBranchHiddenStems,
				},
				day: {
					label: "日柱",
					stem: baziBasic.dayStem,
					branch: baziBasic.dayBranch,
					combined: baziBasic.day,
					nayin: wuxingData.dayNayin,
					stemTenGod: wuxingData.dayStemTenGod,
					branchTenGod: wuxingData.dayBranchTenGod,
					hiddenStems: wuxingData.dayBranchHiddenStems,
					isDayMaster: true,
				},
				hour: {
					label: "時柱",
					stem: baziBasic.hourStem,
					branch: baziBasic.hourBranch,
					combined: baziBasic.hour,
					nayin: wuxingData.hourNayin,
					stemTenGod: wuxingData.hourStemTenGod,
					branchTenGod: wuxingData.hourBranchTenGod,
					hiddenStems: wuxingData.hourBranchHiddenStems,
				},
			},

			// Relationships (for Tab 1 diagram)
			relationships,

			// Element distribution (for Tab 3)
			elementDistribution,

			// Day master analysis (for Tab 3)
			dayMaster: {
				stem: baziBasic.dayStem,
				element: baziBasic.dayElement,
				yinYang: getYinYang(baziBasic.dayStem),
				personality: dayMasterPersonality,
			},

			// Raw data for advanced use
			raw: {
				baziBasic,
				wuxingData,
			},
		};
	} catch (error) {
		console.error("Error generating BaZi chart data:", error);
		throw error;
	}
}

/**
 * Calculate element distribution from wuxing data
 * Returns percentage distribution of five elements
 */
function calculateElementDistribution(wuxingData) {
	const elementCounts = {
		金: 0,
		木: 0,
		水: 0,
		火: 0,
		土: 0,
	};

	// Count stems (weight 3)
	const stemElements = [
		wuxingData.yearStemWuxing,
		wuxingData.monthStemWuxing,
		wuxingData.dayStemWuxing,
		wuxingData.hourStemWuxing,
	];

	stemElements.forEach((element) => {
		if (elementCounts[element] !== undefined) {
			elementCounts[element] += 3;
		}
	});

	// Count branches (weight 2)
	const branchElements = [
		wuxingData.yearBranchWuxing,
		wuxingData.monthBranchWuxing,
		wuxingData.dayBranchWuxing,
		wuxingData.hourBranchWuxing,
	];

	branchElements.forEach((element) => {
		if (elementCounts[element] !== undefined) {
			elementCounts[element] += 2;
		}
	});

	// Count hidden stems (weight 1)
	const hiddenStemsData = [
		wuxingData.yearBranchHiddenStems,
		wuxingData.monthBranchHiddenStems,
		wuxingData.dayBranchHiddenStems,
		wuxingData.hourBranchHiddenStems,
	];

	hiddenStemsData.forEach((hiddenStems) => {
		if (Array.isArray(hiddenStems)) {
			hiddenStems.forEach((stem) => {
				if (stem.element && elementCounts[stem.element] !== undefined) {
					elementCounts[stem.element] += 1;
				}
			});
		}
	});

	// Calculate total
	const total = Object.values(elementCounts).reduce(
		(sum, count) => sum + count,
		0
	);

	// Calculate percentages
	const percentages = {};
	Object.entries(elementCounts).forEach(([element, count]) => {
		percentages[element] =
			total > 0 ? Math.round((count / total) * 100) : 0;
	});

	return {
		counts: elementCounts,
		percentages,
		total,
	};
}

/**
 * Get yin/yang classification of a stem
 */
function getYinYang(stem) {
	const yangStems = ["甲", "丙", "戊", "庚", "壬"];
	return yangStems.includes(stem) ? "陽" : "陰";
}

/**
 * Get day master personality analysis
 */
function getDayMasterPersonality(dayStem, dayElement) {
	const yinYang = getYinYang(dayStem);

	const personalities = {
		甲: {
			title: "智善隨形",
			element: "木",
			yinYang: "陽",
			description:
				"甲木為陽木，如同參天大樹，具有向上生長的力量。性格正直，富有領導才能，但有時過於理想化。適合從事教育、管理等需要指導他人的工作。",
			traits: ["正直", "有領導力", "理想主義", "成長性強"],
		},
		乙: {
			title: "柔韌靈動",
			element: "木",
			yinYang: "陰",
			description:
				"乙木為陰木，如同藤蔓花草，具有柔韌適應的特質。性格溫和，善於變通，富有藝術氣質。適合從事創意、設計等需要靈活思維的工作。",
			traits: ["溫和", "適應力強", "有藝術天分", "善於變通"],
		},
		丙: {
			title: "光明熱情",
			element: "火",
			yinYang: "陽",
			description:
				"丙火為陽火，如同太陽，具有光明熱烈的特質。性格熱情，充滿活力，喜歡社交。適合從事公關、銷售等需要與人互動的工作。",
			traits: ["熱情", "開朗", "社交能力強", "充滿活力"],
		},
		丁: {
			title: "溫暖細膩",
			element: "火",
			yinYang: "陰",
			description:
				"丁火為陰火，如同燭光，具有溫暖照亮的特質。性格細膩，善解人意，富有同理心。適合從事服務、諮詢等需要細心的工作。",
			traits: ["細膩", "善解人意", "有同理心", "溫暖"],
		},
		戊: {
			title: "穩重可靠",
			element: "土",
			yinYang: "陽",
			description:
				"戊土為陽土，如同高山大地，具有穩重承載的特質。性格踏實，責任感強，可靠值得信賴。適合從事管理、建築等需要穩定性的工作。",
			traits: ["穩重", "責任感強", "可靠", "包容力強"],
		},
		己: {
			title: "包容養育",
			element: "土",
			yinYang: "陰",
			description:
				"己土為陰土，如同田園沃土，具有養育萬物的特質。性格溫和，善於照顧他人，富有包容心。適合從事教育、醫療等照顧他人的工作。",
			traits: ["溫和", "有包容心", "善於照顧", "務實"],
		},
		庚: {
			title: "剛毅果斷",
			element: "金",
			yinYang: "陽",
			description:
				"庚金為陽金，如同刀劍鋼鐵，具有剛強銳利的特質。性格果斷，意志堅定，不畏困難。適合從事執法、技術等需要決斷力的工作。",
			traits: ["果斷", "意志堅定", "有原則", "行動力強"],
		},
		辛: {
			title: "精緻靈巧",
			element: "金",
			yinYang: "陰",
			description:
				"辛金為陰金，如同珠寶首飾，具有精緻細膩的特質。性格細心，追求完美，富有美感。適合從事設計、藝術等需要精緻度的工作。",
			traits: ["細心", "追求完美", "有美感", "靈巧"],
		},
		壬: {
			title: "智慧流動",
			element: "水",
			yinYang: "陽",
			description:
				"壬水為陽水，如同江河大海，具有智慧流動的特質。性格靈活，善於思考，適應力強。適合從事研究、策劃等需要智慧的工作。",
			traits: ["智慧", "適應力強", "靈活", "善於思考"],
		},
		癸: {
			title: "柔情細水",
			element: "水",
			yinYang: "陰",
			description:
				"癸水為陰水，如同雨露泉水，具有滋潤萬物的特質。性格溫柔，富有想像力，善於感受。適合從事藝術、文學等需要感性的工作。",
			traits: ["溫柔", "有想像力", "感性", "善於感受"],
		},
	};

	return (
		personalities[dayStem] || {
			title: "待探索",
			element: dayElement,
			yinYang,
			description: "性格特質需要進一步分析。",
			traits: [],
		}
	);
}

/**
 * Get lunar date information
 */
function getLunarDateInfo(birthDateTime) {
	try {
		const dateStr = moment(birthDateTime).format("YYYY-MM-DD HH:mm:ss");
		const lsr = lunisolar(dateStr);

		return {
			year: lsr.lunar.year,
			month: lsr.lunar.month,
			day: lsr.lunar.day,
			formatted: `農曆${lsr.lunar.year}年${lsr.lunar.getMonthName()}${lsr.lunar.getDayName()}`,
		};
	} catch (error) {
		console.error("Error getting lunar date:", error);
		return {
			formatted: "農曆信息獲取失敗",
		};
	}
}

/**
 * Get formatted display for detailed chart (Tab 2)
 * Returns structured data for the 12-row grid
 */
export function getDetailedChartData(baziChartData) {
	const { pillars } = baziChartData;

	return {
		// Row 1: 干神 (Stem Ten Gods)
		stemTenGods: [
			pillars.year.stemTenGod,
			pillars.month.stemTenGod,
			pillars.day.stemTenGod,
			pillars.hour.stemTenGod,
		],

		// Row 2: 天干 (Heavenly Stems)
		stems: [
			pillars.year.stem,
			pillars.month.stem,
			pillars.day.stem,
			pillars.hour.stem,
		],

		// Row 3: 地支 (Earthly Branches)
		branches: [
			pillars.year.branch,
			pillars.month.branch,
			pillars.day.branch,
			pillars.hour.branch,
		],

		// Rows 4-6: 藏干 (Hidden Stems) - 3 rows, max 3 hidden stems per branch
		hiddenStems: [
			formatHiddenStems(pillars.year.hiddenStems),
			formatHiddenStems(pillars.month.hiddenStems),
			formatHiddenStems(pillars.day.hiddenStems),
			formatHiddenStems(pillars.hour.hiddenStems),
		],

		// Rows 7-9: 藏干神 (Hidden Stem Ten Gods) - calculated based on hidden stems
		hiddenStemTenGods: [
			getHiddenStemTenGods(pillars.year.hiddenStems, pillars.day.stem),
			getHiddenStemTenGods(pillars.month.hiddenStems, pillars.day.stem),
			getHiddenStemTenGods(pillars.day.hiddenStems, pillars.day.stem),
			getHiddenStemTenGods(pillars.hour.hiddenStems, pillars.day.stem),
		],

		// Rows 10-12: 星運 (Star Luck) - placeholder for now
		starLuck: ["-", "-", "-", "-"],

		// 日坐 (Day Seat) - placeholder for now
		daySeats: ["-", "-", "-", "-"],

		// 空亡 (Empty Void) - placeholder for now
		emptyVoid: ["-", "-", "-", "-"],

		// 納音 (Nayin) - from pillars
		nayin: [
			pillars.year.nayin || "-",
			pillars.month.nayin || "-",
			pillars.day.nayin || "-",
			pillars.hour.nayin || "-",
		],

		// Relationship notes (displayed below grid)
		relationshipNotes: baziChartData.relationships.notes,
	};
}

/**
 * Format hidden stems into 3-row array structure
 */
function formatHiddenStems(hiddenStems) {
	const rows = [[], [], []];

	if (Array.isArray(hiddenStems)) {
		hiddenStems.forEach((hs, index) => {
			if (index < 3 && rows[index]) {
				rows[index].push(`${hs.stem}${hs.element}`);
			}
		});
	}

	return rows;
}

/**
 * Get ten gods for hidden stems
 * This requires calculating the relationship between hidden stem and day master
 */
function getHiddenStemTenGods(hiddenStems, dayMaster) {
	const rows = [[], [], []];

	if (Array.isArray(hiddenStems)) {
		hiddenStems.forEach((hs, index) => {
			if (index < 3 && rows[index]) {
				const tenGod = calculateTenGod(hs.stem, dayMaster);
				rows[index].push(tenGod);
			}
		});
	}

	return rows;
}

/**
 * Calculate ten god relationship between two stems
 * Uses manual calculation based on five elements relationship
 */
function calculateTenGod(stem, dayMaster) {
	if (!stem || !dayMaster) {
		return "-";
	}

	return calculateTenGodManual(stem, dayMaster);
}

/**
 * Manual fallback calculation for ten god
 * Based on five elements relationship
 */
function calculateTenGodManual(stem, dayMaster) {
	// Map stems to their elements and yin/yang
	const stemInfo = {
		甲: { element: "木", yinyang: "yang" },
		乙: { element: "木", yinyang: "yin" },
		丙: { element: "火", yinyang: "yang" },
		丁: { element: "火", yinyang: "yin" },
		戊: { element: "土", yinyang: "yang" },
		己: { element: "土", yinyang: "yin" },
		庚: { element: "金", yinyang: "yang" },
		辛: { element: "金", yinyang: "yin" },
		壬: { element: "水", yinyang: "yang" },
		癸: { element: "水", yinyang: "yin" },
	};

	const stemData = stemInfo[stem];
	const dayMasterData = stemInfo[dayMaster];

	if (!stemData || !dayMasterData) {
		return "-";
	}

	// Same element
	if (stemData.element === dayMasterData.element) {
		if (stemData.yinyang === dayMasterData.yinyang) {
			return "比肩"; // Same as day master
		} else {
			return "劫財"; // Same element, different polarity
		}
	}

	// Five elements cycle
	const elementCycle = ["木", "火", "土", "金", "水"];
	const stemIndex = elementCycle.indexOf(stemData.element);
	const dayIndex = elementCycle.indexOf(dayMasterData.element);

	// Calculate relationship based on generating/controlling cycle
	const diff = (stemIndex - dayIndex + 5) % 5;

	// I generate (I give birth to)
	if (diff === 1) {
		return stemData.yinyang === dayMasterData.yinyang ? "食神" : "傷官";
	}
	// I control (I overcome)
	if (diff === 2) {
		return stemData.yinyang === dayMasterData.yinyang ? "偏財" : "正財";
	}
	// Controls me (overcomes me)
	if (diff === 3) {
		return stemData.yinyang === dayMasterData.yinyang ? "偏官" : "正官";
	}
	// Generates me (gives birth to me)
	if (diff === 4) {
		return stemData.yinyang === dayMasterData.yinyang ? "偏印" : "正印";
	}

	return "-";
}

export default {
	getBaziChartData,
	getDetailedChartData,
};
