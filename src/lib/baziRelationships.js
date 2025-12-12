/**
 * BaZi Relationships Calculator
 * Calculates stem/branch combinations, clashes, punishments, harms, and destructions
 * Used for the 干支圖況 (Stem-Branch Diagram) tab
 */

// 天干合化 (Heavenly Stem Combinations)
// When two stems combine, they may transform into an element
const STEM_COMBINATIONS = {
	甲己: { type: "合化土", element: "土" },
	己甲: { type: "合化土", element: "土" },
	乙庚: { type: "合化金", element: "金" },
	庚乙: { type: "合化金", element: "金" },
	丙辛: { type: "合化水", element: "水" },
	辛丙: { type: "合化水", element: "水" },
	丁壬: { type: "合化木", element: "木" },
	壬丁: { type: "合化木", element: "木" },
	戊癸: { type: "合化火", element: "火" },
	癸戊: { type: "合化火", element: "火" },
};

// 地支六合 (Earthly Branch Six Harmonies)
const BRANCH_SIX_HARMONIES = {
	子丑: { type: "六合", element: "土" },
	丑子: { type: "六合", element: "土" },
	寅亥: { type: "六合", element: "木" },
	亥寅: { type: "六合", element: "木" },
	卯戌: { type: "六合", element: "火" },
	戌卯: { type: "六合", element: "火" },
	辰酉: { type: "六合", element: "金" },
	酉辰: { type: "六合", element: "金" },
	巳申: { type: "六合", element: "水" },
	申巳: { type: "六合", element: "水" },
	午未: { type: "合化土", element: "土" }, // Special case: transforms to earth
	未午: { type: "合化土", element: "土" },
};

// 地支三合 (Earthly Branch Three Harmonies)
const BRANCH_THREE_HARMONIES = {
	申子辰: { type: "三合水局", element: "水" },
	子辰申: { type: "三合水局", element: "水" },
	辰申子: { type: "三合水局", element: "水" },
	亥卯未: { type: "三合木局", element: "木" },
	卯未亥: { type: "三合木局", element: "木" },
	未亥卯: { type: "三合木局", element: "木" },
	寅午戌: { type: "三合火局", element: "火" },
	午戌寅: { type: "三合火局", element: "火" },
	戌寅午: { type: "三合火局", element: "火" },
	巳酉丑: { type: "三合金局", element: "金" },
	酉丑巳: { type: "三合金局", element: "金" },
	丑巳酉: { type: "三合金局", element: "金" },
};

// 地支半合 (Earthly Branch Half Harmonies) - 2 out of 3 in Three Harmonies
const BRANCH_HALF_HARMONIES = {
	申子: { type: "半合水局", element: "水" },
	子申: { type: "半合水局", element: "水" },
	子辰: { type: "半合水局", element: "水" },
	辰子: { type: "半合水局", element: "水" },
	申辰: { type: "半合水局", element: "水" },
	辰申: { type: "半合水局", element: "水" },
	亥卯: { type: "半合木局", element: "木" },
	卯亥: { type: "半合木局", element: "木" },
	卯未: { type: "半合木局", element: "木" },
	未卯: { type: "半合木局", element: "木" },
	亥未: { type: "半合木局", element: "木" },
	未亥: { type: "半合木局", element: "木" },
	寅午: { type: "半合火局", element: "火" },
	午寅: { type: "半合火局", element: "火" },
	午戌: { type: "半合火局", element: "火" },
	戌午: { type: "半合火局", element: "火" },
	寅戌: { type: "半合火局", element: "火" },
	戌寅: { type: "半合火局", element: "火" },
	巳酉: { type: "半合金局", element: "金" },
	酉巳: { type: "半合金局", element: "金" },
	酉丑: { type: "半合金局", element: "金" },
	丑酉: { type: "半合金局", element: "金" },
	巳丑: { type: "半合金局", element: "金" },
	丑巳: { type: "半合金局", element: "金" },
};

// 地支相沖 (Earthly Branch Clashes)
const BRANCH_CLASHES = {
	子午: "相沖",
	午子: "相沖",
	丑未: "相沖",
	未丑: "相沖",
	寅申: "相沖",
	申寅: "相沖",
	卯酉: "相沖",
	酉卯: "相沖",
	辰戌: "相沖",
	戌辰: "相沖",
	巳亥: "相沖",
	亥巳: "相沖",
};

// 地支相刑 (Earthly Branch Punishments)
const BRANCH_PUNISHMENTS = {
	寅巳: "相刑",
	巳寅: "相刑",
	巳申: "相刑",
	申巳: "相刑",
	申寅: "相刑",
	寅申: "相刑",
	丑未: "相刑",
	未丑: "相刑",
	未戌: "相刑",
	戌未: "相刑",
	戌丑: "相刑",
	丑戌: "相刑",
	子卯: "相刑",
	卯子: "相刑",
	辰辰: "自刑",
	午午: "自刑",
	酉酉: "自刑",
	亥亥: "自刑",
};

// 地支相破 (Earthly Branch Destructions)
const BRANCH_DESTRUCTIONS = {
	子酉: "相破",
	酉子: "相破",
	丑辰: "相破",
	辰丑: "相破",
	寅亥: "相破",
	亥寅: "相破",
	卯午: "相破",
	午卯: "相破",
	巳申: "相破",
	申巳: "相破",
	未戌: "相破",
	戌未: "相破",
};

// 地支相害 (Earthly Branch Harms)
const BRANCH_HARMS = {
	子未: "相害",
	未子: "相害",
	丑午: "相害",
	午丑: "相害",
	寅巳: "相害",
	巳寅: "相害",
	卯辰: "相害",
	辰卯: "相害",
	申亥: "相害",
	亥申: "相害",
	酉戌: "相害",
	戌酉: "相害",
};

// 天干暗合 (Hidden Stem Combinations) - stems in different pillars with hidden relationship
const STEM_HIDDEN_COMBINATIONS = {
	// Same logic as regular combinations, but occurs between non-adjacent pillars
	// For display purposes, we check if stems combine but are not in adjacent positions
};

/**
 * Analyze stem combination between two stems
 * @param {string} stem1 - First heavenly stem
 * @param {string} stem2 - Second heavenly stem
 * @returns {Object|null} Combination result or null
 */
export function analyzeStemCombination(stem1, stem2) {
	const key = stem1 + stem2;
	return STEM_COMBINATIONS[key] || null;
}

/**
 * Analyze branch relationship between two branches
 * Checks for harmonies, clashes, punishments, destructions, and harms
 * @param {string} branch1 - First earthly branch
 * @param {string} branch2 - Second earthly branch
 * @returns {Object|null} Relationship result or null
 */
export function analyzeBranchRelationship(branch1, branch2) {
	const key = branch1 + branch2;

	// Check six harmonies first (strongest)
	if (BRANCH_SIX_HARMONIES[key]) {
		return { relationship: "六合", ...BRANCH_SIX_HARMONIES[key] };
	}

	// Check half harmonies
	if (BRANCH_HALF_HARMONIES[key]) {
		return { relationship: "半合", ...BRANCH_HALF_HARMONIES[key] };
	}

	// Check clashes
	if (BRANCH_CLASHES[key]) {
		return { relationship: "相沖", type: BRANCH_CLASHES[key] };
	}

	// Check punishments
	if (BRANCH_PUNISHMENTS[key]) {
		return { relationship: "相刑", type: BRANCH_PUNISHMENTS[key] };
	}

	// Check destructions
	if (BRANCH_DESTRUCTIONS[key]) {
		return { relationship: "相破", type: BRANCH_DESTRUCTIONS[key] };
	}

	// Check harms
	if (BRANCH_HARMS[key]) {
		return { relationship: "相害", type: BRANCH_HARMS[key] };
	}

	return null;
}

/**
 * Check for three harmony formation (三合局)
 * @param {string} branch1
 * @param {string} branch2
 * @param {string} branch3
 * @returns {Object|null} Three harmony result or null
 */
export function checkThreeHarmony(branch1, branch2, branch3) {
	const key1 = branch1 + branch2 + branch3;
	const key2 = branch1 + branch3 + branch2;
	const key3 = branch2 + branch1 + branch3;
	const key4 = branch2 + branch3 + branch1;
	const key5 = branch3 + branch1 + branch2;
	const key6 = branch3 + branch2 + branch1;

	for (const key of [key1, key2, key3, key4, key5, key6]) {
		if (BRANCH_THREE_HARMONIES[key]) {
			return BRANCH_THREE_HARMONIES[key];
		}
	}

	return null;
}

/**
 * Analyze all relationships in a complete BaZi chart
 * Returns all stem combinations and branch relationships found
 * @param {Object} baziData - Object with year, month, day, hour pillars
 * @returns {Object} Complete relationship analysis
 */
export function analyzeAllRelationships(baziData) {
	const {
		yearStem,
		yearBranch,
		monthStem,
		monthBranch,
		dayStem,
		dayBranch,
		hourStem,
		hourBranch,
	} = baziData;

	const stems = [
		{ pillar: "年", stem: yearStem },
		{ pillar: "月", stem: monthStem },
		{ pillar: "日", stem: dayStem },
		{ pillar: "時", stem: hourStem },
	];

	const branches = [
		{ pillar: "年", branch: yearBranch },
		{ pillar: "月", branch: monthBranch },
		{ pillar: "日", branch: dayBranch },
		{ pillar: "時", branch: hourBranch },
	];

	const relationships = {
		stemCombinations: [],
		branchRelationships: [],
		threeHarmonies: [],
		notes: [],
	};

	// Check all stem pairs
	for (let i = 0; i < stems.length; i++) {
		for (let j = i + 1; j < stems.length; j++) {
			const combo = analyzeStemCombination(stems[i].stem, stems[j].stem);
			if (combo) {
				relationships.stemCombinations.push({
					pillar1: stems[i].pillar,
					stem1: stems[i].stem,
					pillar2: stems[j].pillar,
					stem2: stems[j].stem,
					...combo,
					isAdjacent: j === i + 1,
					isHidden: j !== i + 1, // Hidden if not adjacent
				});
			}
		}
	}

	// Check all branch pairs
	for (let i = 0; i < branches.length; i++) {
		for (let j = i + 1; j < branches.length; j++) {
			const rel = analyzeBranchRelationship(
				branches[i].branch,
				branches[j].branch
			);
			if (rel) {
				relationships.branchRelationships.push({
					pillar1: branches[i].pillar,
					branch1: branches[i].branch,
					pillar2: branches[j].pillar,
					branch2: branches[j].branch,
					...rel,
				});
			}
		}
	}

	// Check for three harmonies (any three branches)
	const branchList = [yearBranch, monthBranch, dayBranch, hourBranch];
	for (let i = 0; i < branchList.length; i++) {
		for (let j = i + 1; j < branchList.length; j++) {
			for (let k = j + 1; k < branchList.length; k++) {
				const harmony = checkThreeHarmony(
					branchList[i],
					branchList[j],
					branchList[k]
				);
				if (harmony) {
					relationships.threeHarmonies.push({
						branches: [branchList[i], branchList[j], branchList[k]],
						pillars: [
							branches[i].pillar,
							branches[j].pillar,
							branches[k].pillar,
						],
						...harmony,
					});
				}
			}
		}
	}

	// Generate relationship notes/descriptions
	relationships.notes = generateRelationshipNotes(relationships);

	return relationships;
}

/**
 * Generate descriptive notes for relationships
 * @param {Object} relationships - Relationships data
 * @returns {Array} Array of note strings
 */
function generateRelationshipNotes(relationships) {
	const notes = [];

	// Stem combination notes
	relationships.stemCombinations.forEach((combo) => {
		if (combo.isHidden) {
			notes.push(
				`${combo.stem1}${combo.stem2}暗合${combo.element ? "化" + combo.element : ""}`
			);
		} else {
			notes.push(`${combo.stem1}${combo.stem2}${combo.type}`);
		}
	});

	// Branch relationship notes
	relationships.branchRelationships.forEach((rel) => {
		const desc = `${rel.branch1}${rel.branch2}${rel.type || rel.relationship}`;
		notes.push(desc);
	});

	// Three harmony notes
	relationships.threeHarmonies.forEach((harmony) => {
		notes.push(`${harmony.branches.join("")}${harmony.type}`);
	});

	return notes;
}

/**
 * Get relationship color for visualization
 * @param {string} type - Relationship type
 * @returns {string} Color code
 */
export function getRelationshipColor(type) {
	const colorMap = {
		合化土: "#d4a373", // Brown for earth
		合化金: "#c0c0c0", // Silver for metal
		合化水: "#4a90e2", // Blue for water
		合化木: "#52c41a", // Green for wood
		合化火: "#f5222d", // Red for fire
		六合: "#52c41a", // Green (harmonious)
		半合: "#73d13d", // Light green (partially harmonious)
		三合: "#237804", // Dark green (very harmonious)
		相沖: "#ff4d4f", // Red (conflict)
		相刑: "#ff7a45", // Orange (punishment)
		相破: "#fa8c16", // Orange (destruction)
		相害: "#faad14", // Yellow (harm)
		暗合: "#722ed1", // Purple (hidden)
	};

	return colorMap[type] || "#8c8c8c";
}

export default {
	analyzeStemCombination,
	analyzeBranchRelationship,
	checkThreeHarmony,
	analyzeAllRelationships,
	getRelationshipColor,
};
