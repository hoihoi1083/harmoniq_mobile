/**
 * Unified Element Calculation Service
 *
 * This service provides standardized element calculation methods
 * to ensure consistency between AI analysis and annual analysis components.
 *
 * Uses the lunisolar library as the primary calculation method for reliability.
 */

import moment from "moment";
import lunisolar from "lunisolar";
import { takeSound } from "@lunisolar/plugin-takesound";
import { char8ex } from "@lunisolar/plugin-char8ex";

// Extend lunisolar with required plugins
lunisolar.extend(takeSound).extend(char8ex);

/**
 * Standard element calculation using lunisolar library
 * @param {string} birthDateTime - Birth date and time (YYYY-MM-DD or YYYY-MM-DD HH:mm:ss)
 * @param {string} gender - Gender ("male" or "female")
 * @returns {Object} Standardized element analysis result
 */
export function calculateUnifiedElements(birthDateTime, gender = "male") {
	try {
		// Normalize birth date format - add default time if missing
		let birthStr = birthDateTime;
		if (!birthDateTime.includes("T") && !birthDateTime.includes(" ")) {
			// Add default noon time if no time specified
			birthStr = `${birthDateTime} 12:00:00`;
		}

		// Format for lunisolar
		const formattedBirth = moment(birthStr).format("YYYY-MM-DD HH:mm:ss");

		// Calculate using lunisolar library
		const lsr = lunisolar(formattedBirth);
		const genderCode = gender === "female" ? 0 : 1;
		const c8 = lsr.char8ex(genderCode);

		// Extract four pillars
		const fourPillars = {
			year: {
				stem: lsr.char8.year.stem.name,
				stemElement: lsr.char8.year.stem.e5.name,
				branch: lsr.char8.year.branch.name,
				branchElement: lsr.char8.year.branch.e5.name,
				nayin: lsr.char8.year.takeSound,
				nayinElement: lsr.char8.year.takeSoundE5.toString(),
			},
			month: {
				stem: lsr.char8.month.stem.name,
				stemElement: lsr.char8.month.stem.e5.name,
				branch: lsr.char8.month.branch.name,
				branchElement: lsr.char8.month.branch.e5.name,
				nayin: lsr.char8.month.takeSound,
				nayinElement: lsr.char8.month.takeSoundE5.toString(),
			},
			day: {
				stem: lsr.char8.day.stem.name,
				stemElement: lsr.char8.day.stem.e5.name,
				branch: lsr.char8.day.branch.name,
				branchElement: lsr.char8.day.branch.e5.name,
				nayin: lsr.char8.day.takeSound,
				nayinElement: lsr.char8.day.takeSoundE5.toString(),
			},
			hour: {
				stem: lsr.char8.hour.stem.name,
				stemElement: lsr.char8.hour.stem.e5.name,
				branch: lsr.char8.hour.branch.name,
				branchElement: lsr.char8.hour.branch.e5.name,
				nayin: lsr.char8.hour.takeSound,
				nayinElement: lsr.char8.hour.takeSoundE5.toString(),
			},
		};

		// Calculate element counts
		const elementCounts = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };

		// Count all stem and branch elements
		Object.values(fourPillars).forEach((pillar) => {
			if (pillar.stemElement) elementCounts[pillar.stemElement]++;
			if (pillar.branchElement) elementCounts[pillar.branchElement]++;
		});

		// Determine dominant elements
		const dominantElement = Object.keys(elementCounts).reduce((a, b) =>
			elementCounts[a] > elementCounts[b] ? a : b
		);

		// Missing elements
		const missingElements = Object.entries(elementCounts)
			.filter(([element, count]) => count === 0)
			.map(([element]) => element);

		return {
			// Primary element identification (日主五行 - Day Master Element)
			dayMasterElement: fourPillars.day.stemElement,
			dayMasterStem: fourPillars.day.stem,

			// Life element (年柱納音 - Year Pillar Nayin)
			lifeElement: fourPillars.year.nayinElement,
			lifeNayin: fourPillars.year.nayin,

			// Four pillars detail
			fourPillars,

			// Element analysis
			elementCounts,
			dominantElement,
			missingElements,

			// Metadata
			birthDateTime: formattedBirth,
			gender,
			calculationMethod: "lunisolar_unified",
		};
	} catch (error) {
		console.error("Unified element calculation error:", error);
		throw new Error(`Element calculation failed: ${error.message}`);
	}
}

/**
 * Get person's primary element for compatibility analysis
 * Uses Day Master (日主) as the primary element for personal characteristics
 * @param {string} birthDateTime
 * @param {string} gender
 * @returns {string} Primary element (金/木/水/火/土)
 */
export function getPersonPrimaryElement(birthDateTime, gender = "male") {
	const analysis = calculateUnifiedElements(birthDateTime, gender);
	return analysis.dayMasterElement;
}

/**
 * Get element compatibility description for AI analysis
 * @param {string} element1 - First person's element
 * @param {string} element2 - Second person's element
 * @returns {string} Compatibility description
 */
export function getElementCompatibility(element1, element2) {
	const compatibilityMap = {
		金木: "金克木 - 需要調和與包容",
		金水: "金生水 - 相互促進，和諧配合",
		金火: "火克金 - 激烈碰撞，需要平衡",
		金土: "土生金 - 穩定支持，互相成就",
		木水: "水生木 - 滋養成長，相得益彰",
		木火: "木生火 - 熱情激發，互相點燃",
		木土: "木克土 - 需要理解與協調",
		水火: "水火不容 - 對立衝突，需要化解",
		水土: "土克水 - 制約關係，需要平衡",
		火土: "火生土 - 溫暖厚實，相互依靠",
	};

	const key1 = element1 + element2;
	const key2 = element2 + element1;

	return (
		compatibilityMap[key1] ||
		compatibilityMap[key2] ||
		"特殊組合 - 需要深入分析"
	);
}

/**
 * Format element calculation result for AI prompt
 * @param {Object} person1Analysis
 * @param {Object} person2Analysis
 * @returns {string} Formatted text for AI analysis
 */
export function formatElementAnalysisForAI(person1Analysis, person2Analysis) {
	return `
八字四柱分析：
男方八字：${person1Analysis.fourPillars.year.stem}${person1Analysis.fourPillars.year.branch} ${person1Analysis.fourPillars.month.stem}${person1Analysis.fourPillars.month.branch} ${person1Analysis.fourPillars.day.stem}${person1Analysis.fourPillars.day.branch} ${person1Analysis.fourPillars.hour.stem}${person1Analysis.fourPillars.hour.branch}
男方日主：${person1Analysis.dayMasterStem}${person1Analysis.dayMasterElement}
男方年命：${person1Analysis.lifeNayin}（${person1Analysis.lifeElement}命）

女方八字：${person2Analysis.fourPillars.year.stem}${person2Analysis.fourPillars.year.branch} ${person2Analysis.fourPillars.month.stem}${person2Analysis.fourPillars.month.branch} ${person2Analysis.fourPillars.day.stem}${person2Analysis.fourPillars.day.branch} ${person2Analysis.fourPillars.hour.stem}${person2Analysis.fourPillars.hour.branch}
女方日主：${person2Analysis.dayMasterStem}${person2Analysis.dayMasterElement}
女方年命：${person2Analysis.lifeNayin}（${person2Analysis.lifeElement}命）

五行配對：${person1Analysis.dayMasterElement}${person1Analysis.dayMasterElement === "火" ? "火" : person1Analysis.dayMasterElement}男配${person2Analysis.dayMasterElement}${person2Analysis.dayMasterElement === "水" ? "水" : person2Analysis.dayMasterElement}女
配對關係：${getElementCompatibility(person1Analysis.dayMasterElement, person2Analysis.dayMasterElement)}
`;
}

export default {
	calculateUnifiedElements,
	getPersonPrimaryElement,
	getElementCompatibility,
	formatElementAnalysisForAI,
};
