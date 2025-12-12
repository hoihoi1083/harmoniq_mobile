/**
 * Daily Fortune API Endpoint
 *
 * This file should be deployed to your production backend server
 * Path: /api/daily-fortune
 *
 * Calculate daily fortune based on BaZi (Chinese astrology)
 */

// Heavenly Stems (天干)
const HEAVENLY_STEMS = [
	"甲",
	"乙",
	"丙",
	"丁",
	"戊",
	"己",
	"庚",
	"辛",
	"壬",
	"癸",
];

// Earthly Branches (地支)
const EARTHLY_BRANCHES = [
	"子",
	"丑",
	"寅",
	"卯",
	"辰",
	"巳",
	"午",
	"未",
	"申",
	"酉",
	"戌",
	"亥",
];

// Five Elements (五行)
const FIVE_ELEMENTS = {
	木: ["甲", "乙", "寅", "卯"],
	火: ["丙", "丁", "巳", "午"],
	土: ["戊", "己", "辰", "戌", "丑", "未"],
	金: ["庚", "辛", "申", "酉"],
	水: ["壬", "癸", "子", "亥"],
};

// Element relationships (五行相生相剋)
const ELEMENT_RELATIONS = {
	木: { generates: "火", controls: "土", controlledBy: "金" },
	火: { generates: "土", controls: "金", controlledBy: "水" },
	土: { generates: "金", controls: "水", controlledBy: "木" },
	金: { generates: "水", controls: "木", controlledBy: "火" },
	水: { generates: "木", controls: "火", controlledBy: "土" },
};

// Fortune levels with thresholds
const FORTUNE_LEVELS = {
	大吉: { min: 90, max: 100, bg: "#6BA547", text: "#FFFFFF" },
	中吉: { min: 75, max: 89, bg: "#B8D87A", text: "#FFFFFF" },
	吉: { min: 60, max: 74, bg: "#D4E79E", text: "#374151" },
	凶: { min: 40, max: 59, bg: "#F5A623", text: "#FFFFFF" },
	中凶: { min: 20, max: 39, bg: "#E85D3A", text: "#FFFFFF" },
	大凶: { min: 0, max: 19, bg: "#C62828", text: "#FFFFFF" },
};

/**
 * Calculate solar calendar pillars from date
 */
function calculatePillars(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	// Simplified pillar calculation (for production, use a proper library like lunar-javascript)
	const yearStem = HEAVENLY_STEMS[(year - 4) % 10];
	const yearBranch = EARTHLY_BRANCHES[(year - 4) % 12];

	const monthStem = HEAVENLY_STEMS[(year * 12 + month) % 10];
	const monthBranch = EARTHLY_BRANCHES[(month + 1) % 12];

	// Day pillar calculation (simplified Julian day method)
	const julianDay = Math.floor((date - new Date(1900, 0, 1)) / 86400000);
	const dayStem = HEAVENLY_STEMS[julianDay % 10];
	const dayBranch = EARTHLY_BRANCHES[julianDay % 12];

	return {
		year: yearStem + yearBranch,
		month: monthStem + monthBranch,
		day: dayStem + dayBranch,
	};
}

/**
 * Get element from stem or branch
 */
function getElement(character) {
	for (const [element, chars] of Object.entries(FIVE_ELEMENTS)) {
		if (chars.includes(character)) {
			return element;
		}
	}
	return null;
}

/**
 * Calculate fortune score based on element interactions
 */
function calculateFortuneScore(birthPillars, datePillars) {
	let score = 50; // Base score

	// Extract day master (日主) - most important
	const dayMasterStem = birthPillars.day[0];
	const dayMasterElement = getElement(dayMasterStem);

	// Check selected date's elements
	const dateElements = {
		year: getElement(datePillars.year[0]),
		month: getElement(datePillars.month[0]),
		day: getElement(datePillars.day[0]),
	};

	// Calculate based on element relationships
	Object.values(dateElements).forEach((dateElement) => {
		if (!dateElement || !dayMasterElement) return;

		const relation = ELEMENT_RELATIONS[dayMasterElement];

		if (relation.generates === dateElement) {
			score += 15; // Beneficial - generates positive energy
		} else if (relation.controlledBy === dateElement) {
			score -= 10; // Challenging - controls day master
		} else if (dateElement === dayMasterElement) {
			score += 10; // Same element - supportive
		}
	});

	// Check for clashing (沖) - opposite branches
	const birthDayBranch = birthPillars.day[1];
	const dateDayBranch = datePillars.day[1];
	const birthBranchIndex = EARTHLY_BRANCHES.indexOf(birthDayBranch);
	const dateBranchIndex = EARTHLY_BRANCHES.indexOf(dateDayBranch);

	if (Math.abs(birthBranchIndex - dateBranchIndex) === 6) {
		score -= 15; // Clashing reduces fortune
	}

	// Check for combining (合) - harmonious pairs
	const combiningPairs = [
		[0, 1],
		[2, 11],
		[3, 10],
		[4, 9],
		[5, 8],
		[6, 7],
	];
	for (const [a, b] of combiningPairs) {
		if (
			(birthBranchIndex === a && dateBranchIndex === b) ||
			(birthBranchIndex === b && dateBranchIndex === a)
		) {
			score += 20; // Combining increases fortune
		}
	}

	// Add some randomness based on day (for variety)
	const dayFactor =
		((datePillars.day.charCodeAt(0) + datePillars.day.charCodeAt(1)) % 20) -
		10;
	score += dayFactor;

	// Ensure score is within 0-100
	return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get fortune level from score
 */
function getFortuneLevel(score) {
	for (const [level, range] of Object.entries(FORTUNE_LEVELS)) {
		if (score >= range.min && score <= range.max) {
			return {
				level,
				score,
				colors: {
					background: range.bg,
					text: range.text,
				},
			};
		}
	}
	return {
		level: "中吉",
		score,
		colors: { background: "#B8D87A", text: "#FFFFFF" },
	};
}

/**
 * Generate fortune description and recommendations
 */
function generateFortuneDetails(level, score, birthPillars, datePillars) {
	const descriptions = {
		大吉: "今日運勢極佳！諸事順遂，把握機會積極進取。",
		中吉: "今日運勢良好，適合處理重要事務，保持積極心態。",
		吉: "今日運勢平穩向上，穩扎穩打可獲得不錯成果。",
		凶: "今日運勢起伏較大，謹慎行事，避免重大決策。",
		中凶: "今日運勢欠佳，宜保守行事，注意言行舉止。",
		大凶: "今日運勢不利，諸事宜靜不宜動，多加小心謹慎。",
	};

	const recommendations = {
		大吉: [
			"財運：適合投資理財，商談合作",
			"感情：桃花運旺，利於表白約會",
			"健康：精神飽滿，適合運動健身",
			"事業：貴人相助，宜主動出擊",
		],
		中吉: [
			"財運：收入穩定，可嘗試小額投資",
			"感情：感情和睦，適合溝通交流",
			"健康：身體狀況良好，注意飲食",
			"事業：工作順利，可推進重要項目",
		],
		吉: [
			"財運：量入為出，避免衝動消費",
			"感情：平淡是福，珍惜眼前人",
			"健康：適度休息，保持規律作息",
			"事業：按部就班，穩步前進",
		],
		凶: [
			"財運：不宜投資，謹防破財",
			"感情：避免爭執，多加包容",
			"健康：注意安全，避免意外",
			"事業：低調行事，避免樹敵",
		],
		中凶: [
			"財運：財運欠佳，守財為上",
			"感情：易有口角，控制情緒",
			"健康：注意身體，及時就醫",
			"事業：暫緩計劃，以守為攻",
		],
		大凶: [
			"財運：嚴防破財，切勿投資",
			"感情：避免衝突，冷靜處理",
			"健康：謹防疾病，多加休息",
			"事業：諸事不宜，靜待時機",
		],
	};

	return {
		description: descriptions[level] || descriptions["中吉"],
		recommendations: recommendations[level] || recommendations["中吉"],
	};
}

/**
 * Main API handler
 */
export default async function handler(req, res) {
	// Only allow POST requests
	if (req.method !== "POST") {
		return res
			.status(405)
			.json({ success: false, error: "Method not allowed" });
	}

	try {
		const { birthday, selectedDate, birthTime } = req.body;

		// Validate input
		if (!birthday || !selectedDate) {
			return res.status(400).json({
				success: false,
				error: "Birthday and selectedDate are required",
			});
		}

		// Parse dates
		const birthDate = new Date(birthday);
		const targetDate = new Date(selectedDate);

		if (isNaN(birthDate.getTime()) || isNaN(targetDate.getTime())) {
			return res.status(400).json({
				success: false,
				error: "Invalid date format",
			});
		}

		// Calculate pillars
		const birthPillars = calculatePillars(birthDate);
		const datePillars = calculatePillars(targetDate);

		// Calculate fortune score
		const score = calculateFortuneScore(birthPillars, datePillars);

		// Get fortune level
		const fortune = getFortuneLevel(score);

		// Generate details
		const details = generateFortuneDetails(
			fortune.level,
			score,
			birthPillars,
			datePillars
		);

		// Return response
		return res.status(200).json({
			success: true,
			data: {
				date: targetDate.toISOString().split("T")[0],
				fortune: fortune.level,
				score: fortune.score,
				description: details.description,
				colors: fortune.colors,
				recommendations: details.recommendations,
				pillars: {
					birth: birthPillars,
					date: datePillars,
				},
			},
		});
	} catch (error) {
		console.error("Daily fortune calculation error:", error);
		return res.status(500).json({
			success: false,
			error: "Internal server error",
			message: error.message,
		});
	}
}
