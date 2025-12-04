#!/usr/bin/env python3
import os
import re

files_to_check = [
    "src/contexts/CoupleAnalysisContext.jsx",
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
]

API_BASE = "\tconst API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.harmoniqfengshui.com';"

for file_path in files_to_check:
    if not os.path.exists(file_path):
        print(f"❌ {file_path}: Not found")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has API_BASE
    if 'const API_BASE' in content:
        print(f"⏭️  {file_path}: Already has API_BASE")
        continue
    
    # Check if uses ${API_BASE}
    if '${API_BASE}' not in content:
        print(f"⏭️  {file_path}: Doesn't use API_BASE")
        continue
    
    # Find where to insert - after first opening brace of function/component
    lines = content.split('\n')
    insert_line = -1
    
    for i, line in enumerate(lines):
        # Look for export default, export const, const functionName = 
        if re.search(r'(export\s+(default\s+)?(const|function)|const\s+\w+\s*=\s*\()', line):
            # Find next line with just an opening brace or brace at end
            for j in range(i, min(i+10, len(lines))):
                if lines[j].strip() == '{' or lines[j].rstrip().endswith('{'):
                    insert_line = j + 1
                    break
            if insert_line > 0:
                break
    
    if insert_line > 0:
        lines.insert(insert_line, API_BASE)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(lines))
        print(f"✅ {file_path}: Added API_BASE at line {insert_line}")
    else:
        print(f"⚠️  {file_path}: Couldn't find insertion point")

print("\n✅ API_BASE constant addition complete!")
