/**
 * Couple Report Data Store Utility
 * Handles saving and retrieving data for couple reports with conditional component rendering
 */

// Global data store for couple report components
if (typeof window !== "undefined") {
	window.coupleReportDataStore = window.coupleReportDataStore || {};
}

/**
 * Store component data for couple reports
 * @param {string} componentKey - The component identifier
 * @param {object} data - The data to store
 */
export const storeCoupleComponentData = (componentKey, data) => {
	if (typeof window !== "undefined") {
		window.coupleReportDataStore = window.coupleReportDataStore || {};
		window.coupleReportDataStore[componentKey] = data;
		console.log(
			`📊 Stored couple component data for ${componentKey}:`,
			data ? "SUCCESS" : "NULL"
		);
	}
};

/**
 * Get component data for couple reports
 * @param {string} componentKey - The component identifier
 * @returns {object|null} The stored data or null
 */
export const getCoupleComponentData = (componentKey) => {
	if (typeof window !== "undefined" && window.coupleReportDataStore) {
		const data = window.coupleReportDataStore[componentKey];
		console.log(
			`🔍 Retrieved couple component data for ${componentKey}:`,
			data ? "FOUND" : "NOT_FOUND"
		);
		return data || null;
	}
	return null;
};

/**
 * Get all stored couple component data
 * @returns {object} All stored data
 */
export const getAllCoupleComponentData = () => {
	if (typeof window !== "undefined" && window.coupleReportDataStore) {
		return { ...window.coupleReportDataStore };
	}
	return {};
};

/**
 * Clear all couple component data
 */
export const clearCoupleComponentData = () => {
	if (typeof window !== "undefined") {
		window.coupleReportDataStore = {};
		console.log("🗑️ Cleared couple component data store");
	}
};

/**
 * Store problem-specific solution data based on category
 * @param {string} problemCategory - The problem category (emotion_cooling, special_situation, taboo_breaking)
 * @param {object} sectionData - Object containing data for each section in the category
 */
export const storeProblemSolutionData = (problemCategory, sectionData) => {
	const key = `enhancedSolution_${problemCategory}`;
	storeCoupleComponentData(key, sectionData);
};

/**
 * Get problem-specific solution data
 * @param {string} problemCategory - The problem category
 * @returns {object|null} The stored solution data or null
 */
export const getProblemSolutionData = (problemCategory) => {
	const key = `enhancedSolution_${problemCategory}`;
	return getCoupleComponentData(key);
};

/**
 * Get the complete couple report data structure for database saving
 * @returns {object} Complete report data structure
 */
export const getCompleteCoupleReportData = () => {
	const allData = getAllCoupleComponentData();

	// Define all possible component fields for couple reports
	const componentFields = [
		"coupleAnnualAnalysis",
		"coupleMingJu",
		"coupleGodExplain",
		"coupleSeason",
		"coupleCoreSuggestion",
		// Enhanced solution sections by category
		"enhancedSolution_emotion_cooling",
		"enhancedSolution_special_situation",
		"enhancedSolution_taboo_breaking",
	];

	const completeContent = {
		// Analysis tab components
		coupleAnnualAnalysis: allData.coupleAnnualAnalysis || null,
		coupleMingJu: allData.coupleMingJu || null,
		coupleGodExplain: allData.coupleGodExplain || null,
		coupleSeason: allData.coupleSeason || null,
		coupleCoreSuggestion: allData.coupleCoreSuggestion || null,

		// Solution tab components (conditional based on problem category)
		enhancedSolution_emotion_cooling:
			allData.enhancedSolution_emotion_cooling || null,
		enhancedSolution_special_situation:
			allData.enhancedSolution_special_situation || null,
		enhancedSolution_taboo_breaking:
			allData.enhancedSolution_taboo_breaking || null,

		// Metadata
		reportGeneratedAt: new Date().toISOString(),
		componentFields: componentFields,
	};

	// Log collection results
	console.log("📊 Complete couple report data collection results:");
	componentFields.forEach((field) => {
		const hasData = completeContent[field];
		console.log(`  ${field}: ${hasData ? "HAS_DATA" : "NULL"}`);
	});

	return completeContent;
};

/**
 * Pre-populate couple component data store with saved content
 * @param {object} savedContent - The saved report content from database
 */
export const prePopulateCoupleComponentData = (savedContent) => {
	console.log(
		"📥 Pre-populating couple component data store with saved content..."
	);

	// Clear existing data
	clearCoupleComponentData();

	// Map saved content to component data store
	const componentMappings = {
		coupleAnnualAnalysis: "coupleAnnualAnalysis",
		coupleMingJu: "coupleMingJu",
		coupleGodExplain: "coupleGodExplain",
		coupleSeason: "coupleSeason",
		coupleCoreSuggestion: "coupleCoreSuggestion",
		enhancedSolution_emotion_cooling: "enhancedSolution_emotion_cooling",
		enhancedSolution_special_situation:
			"enhancedSolution_special_situation",
		enhancedSolution_taboo_breaking: "enhancedSolution_taboo_breaking",
	};

	Object.entries(componentMappings).forEach(([savedKey, storeKey]) => {
		if (savedContent[savedKey]) {
			storeCoupleComponentData(storeKey, savedContent[savedKey]);
		}
	});

	console.log(
		"✅ Couple component data store populated with historical content"
	);
};

/**
 * Determine which problem solution category is active for the current report
 * @param {string} specificProblem - The specific problem text
 * @returns {string|null} The problem category or null
 */
export const determineProblemCategory = (specificProblem) => {
	if (!specificProblem) return null;

	const problem = specificProblem.toLowerCase();

	// Emotion cooling problems
	if (
		problem.includes("感情降溫") ||
		problem.includes("感情冷淡") ||
		problem.includes("關係疏遠") ||
		problem.includes("溝通減少")
	) {
		return "emotion_cooling";
	}

	// Special situation problems
	if (
		problem.includes("異地戀") ||
		problem.includes("年齡差距") ||
		problem.includes("家庭反對") ||
		problem.includes("文化差異")
	) {
		return "special_situation";
	}

	// Taboo breaking problems
	if (
		problem.includes("禁忌") ||
		problem.includes("衝突") ||
		problem.includes("爭吵") ||
		problem.includes("矛盾")
	) {
		return "taboo_breaking";
	}

	// Default to emotion_cooling if no specific match
	return "emotion_cooling";
};
