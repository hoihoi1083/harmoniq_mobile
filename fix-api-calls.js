#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// API base URL constant to add
const API_BASE_CONST = `const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.harmoniqfengshui.com';`;

// Files to update
const filesToUpdate = [
	"src/contexts/CoupleAnalysisContext.jsx",
	"src/app/[locale]/chat/page.jsx",
	"src/app/[locale]/report-history/page.jsx",
	"src/app/[locale]/smart-chat2/page.jsx",
	"src/app/[locale]/feng-shui-report/page.jsx",
	"src/utils/simpleCoupleContentSave.js",
	"src/components/home/Hero.jsx",
	"src/components/QuestionFocus.jsx",
	"src/components/ChartDiagnosisSection.jsx",
	"src/components/MingJu.jsx",
	"src/components/SpecificSuggestion.jsx",
	"src/components/GanZhi.jsx",
	"src/components/PricingModal.jsx",
	"src/components/CoupleGodExplain.jsx",
	"src/components/CoupleMingJu.jsx",
	"src/components/CareerFortuneAnalysis.jsx",
	"src/components/RestartChemistrySection.jsx",
	"src/components/CoreSuggestion.jsx",
	"src/components/KeyAnalysisSection.jsx",
	"src/components/WealthFortuneAnalysis.jsx",
	"src/components/RelationshipMethodSection.jsx",
	"src/components/JiXiong.jsx",
	"src/components/Report.jsx",
	"src/components/CoupleAnnualAnalysis.jsx",
	"src/components/QuestionFocusSimple.jsx",
	"src/components/Season.jsx",
	"src/components/bazhai/OverallBazhaiAnalysis.jsx",
	"src/components/TargetedSuggestionsSection.jsx",
	"src/components/RelationshipFortuneAnalysis.jsx",
	"src/components/StarChartGuidanceSection.jsx",
	"src/components/EmergencyFengShuiSection.jsx",
	"src/components/CoupleSeason.jsx",
	"src/components/WeChatLogin.jsx",
	"src/components/LiuNianKeyWord.jsx",
	"src/components/FengShuiTransformationSection.jsx",
	"src/components/HealthFortuneAnalysis.jsx",
	"src/hooks/useCoupleAnalysisReports.js",
	"src/lib/MingJu.jsx",
	"src/lib/userTracking.js",
];

let totalFilesUpdated = 0;
let totalReplacements = 0;

console.log("🔧 Starting API calls update...\n");

filesToUpdate.forEach((filePath) => {
	const fullPath = path.join(__dirname, filePath);

	if (!fs.existsSync(fullPath)) {
		console.log(`⚠️  File not found: ${filePath}`);
		return;
	}

	let content = fs.readFileSync(fullPath, "utf8");
	let modified = false;
	let replacements = 0;

	// Check if API_BASE is already defined
	const hasAPIBase =
		content.includes("API_BASE") || content.includes("getApiBaseUrl");

	// Pattern 1: fetch("/api/...
	const pattern1 = /fetch\("\/api\//g;
	const matches1 = content.match(pattern1);
	if (matches1) {
		replacements += matches1.length;
		content = content.replace(
			/fetch\("\/api\//g,
			"fetch(`${API_BASE}/api/"
		);
		modified = true;
	}

	// Pattern 2: fetch('/api/...
	const pattern2 = /fetch\('\/api\//g;
	const matches2 = content.match(pattern2);
	if (matches2) {
		replacements += matches2.length;
		content = content.replace(
			/fetch\('\/api\//g,
			"fetch(`${API_BASE}/api/"
		);
		modified = true;
	}

	// Pattern 3: fetch(`/api/...
	const pattern3 = /fetch\(`\/api\//g;
	const matches3 = content.match(pattern3);
	if (matches3) {
		replacements += matches3.length;
		content = content.replace(
			/fetch\(`\/api\//g,
			"fetch(`${API_BASE}/api/"
		);
		modified = true;
	}

	// If file was modified and doesn't have API_BASE constant, add it
	if (modified && !hasAPIBase) {
		// Find the best place to add it - after imports or at start of component/function
		const lines = content.split("\n");
		let insertIndex = 0;

		// Find last import statement or first function/const
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes("import ") || lines[i].includes("require(")) {
				insertIndex = i + 1;
			} else if (
				lines[i].includes("export default") ||
				lines[i].includes("export const") ||
				lines[i].includes("export function") ||
				lines[i].includes("function ")
			) {
				// Add inside the function
				insertIndex = i + 1;
				// Skip to first line after function declaration
				while (
					insertIndex < lines.length &&
					!lines[insertIndex].trim()
				) {
					insertIndex++;
				}
				break;
			}
		}

		// Insert API_BASE constant
		lines.splice(insertIndex, 0, "\t" + API_BASE_CONST);
		content = lines.join("\n");
	}

	if (modified) {
		fs.writeFileSync(fullPath, content, "utf8");
		console.log(`✅ ${filePath}: ${replacements} API calls updated`);
		totalFilesUpdated++;
		totalReplacements += replacements;
	} else {
		console.log(`⏭️  ${filePath}: No changes needed`);
	}
});

console.log(`\n🎉 Update complete!`);
console.log(`📊 ${totalFilesUpdated} files updated`);
console.log(`🔗 ${totalReplacements} API calls fixed`);
console.log(
	"\n✅ All API calls now point to production server: https://www.harmoniqfengshui.com"
);
