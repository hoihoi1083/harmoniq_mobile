#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'src/contexts/AuthContext.jsx',
  'src/contexts/CoupleAnalysisContext.jsx',
  'src/app/[locale]/chat/page.jsx',
  'src/app/[locale]/report-history/page.jsx',
  'src/app/[locale]/smart-chat2/page.jsx',
  'src/app/[locale]/feng-shui-report/page.jsx',
  'src/utils/simpleCoupleContentSave.js',
  'src/components/home/Hero.jsx',
  'src/components/QuestionFocus.jsx',
  'src/components/ChartDiagnosisSection.jsx',
  'src/components/MingJu.jsx',
  'src/components/SpecificSuggestion.jsx',
  'src/components/GanZhi.jsx',
  'src/components/PricingModal.jsx',
  'src/components/CoupleGodExplain.jsx',
  'src/components/CoupleMingJu.jsx',
  'src/components/CareerFortuneAnalysis.jsx',
  'src/components/RestartChemistrySection.jsx',
  'src/components/CoreSuggestion.jsx',
  'src/components/KeyAnalysisSection.jsx',
  'src/components/WealthFortuneAnalysis.jsx',
  'src/components/RelationshipMethodSection.jsx',
  'src/components/JiXiong.jsx',
  'src/components/Report.jsx',
  'src/components/CoupleAnnualAnalysis.jsx',
  'src/components/QuestionFocusSimple.jsx',
  'src/components/Season.jsx',
  'src/components/bazhai/OverallBazhaiAnalysis.jsx',
  'src/components/TargetedSuggestionsSection.jsx',
  'src/components/RelationshipFortuneAnalysis.jsx',
  'src/components/StarChartGuidanceSection.jsx',
  'src/components/EmergencyFengShuiSection.jsx',
  'src/components/CoupleSeason.jsx',
  'src/components/WeChatLogin.jsx',
  'src/components/LiuNianKeyWord.jsx',
  'src/components/FengShuiTransformationSection.jsx',
  'src/components/HealthFortuneAnalysis.jsx',
  'src/hooks/useCoupleAnalysisReports.js',
  'src/lib/MingJu.jsx',
  'src/lib/userTracking.js',
];

let totalFilesUpdated = 0;
let totalReplacements = 0;

console.log('🔧 Starting API calls update (v2 - proper fix)...\n');

filesToUpdate.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  let replacements = 0;
  
  // Get API base at top of file/component
  const apiBaseConst = "const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.harmoniqfengshui.com';";
  
  // Check if already has API_BASE
  const hasAPIBase = content.includes('API_BASE') || content.includes('buildApiUrl');
  
  // Replace all variations of fetch("/api/
  const patterns = [
    { regex: /fetch\(\\?["']\/api\//g, isTemplate: false },
    { regex: /fetch\(\\?`\/api\//g, isTemplate: true },
  ];
  
  patterns.forEach(({ regex, isTemplate }) => {
    const matches = content.match(regex);
    if (matches) {
      replacements += matches.length;
      if (isTemplate) {
        // Already a template literal, just add ${API_BASE}
        content = content.replace(/fetch\(\\?`\/api\//g, 'fetch(`${API_BASE}/api/');
      } else {
        // Convert to template literal
        content = content.replace(/fetch\(["']\/api\//g, 'fetch(`${API_BASE}/api/');
        // Fix closing quotes - need to be careful here
        // We'll do a simpler replacement: just change opening quote
      }
      modified = true;
    }
  });
  
  // Fix any remaining quote mismatches by replacing ", { with `, {
  if (modified) {
    content = content.replace(/\$\{API_BASE\}\/api\/([^`"']+)"\s*,/g, '${API_BASE}/api/$1`,');
    content = content.replace(/\$\{API_BASE\}\/api\/([^`"']+)'\s*,/g, '${API_BASE}/api/$1`,');
  }
  
  // If file was modified and doesn't have API_BASE, add it
  if (modified && !hasAPIBase) {
    const lines = content.split('\n');
    let insertIndex = -1;
    
    // Find export default or export const/function
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('export default') || line.startsWith('export const') || 
          line.startsWith('export function')) {
        // Find opening brace
        let braceIndex = i;
        while (braceIndex < lines.length && !lines[braceIndex].includes('{')) {
          braceIndex++;
        }
        insertIndex = braceIndex + 1;
        break;
      }
      // For non-exported functions
      if (line.startsWith('const ') && line.includes('= (') && line.includes(') =>')) {
        insertIndex = i + 1;
        break;
      }
    }
    
    if (insertIndex > 0) {
      // Add with proper indentation
      lines.splice(insertIndex, 0, '\t' + apiBaseConst);
      content = lines.join('\n');
    }
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
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
console.log('\n✅ All API calls now point to: https://www.harmoniqfengshui.com');
