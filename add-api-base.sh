#!/bin/bash

# Add API_BASE constant to all files that use it
cd /Users/michaelng/Desktop/HarmoniqFengShui/FengShuiLayout-mobileapp

# List of files that need API_BASE added
FILES=(
  "src/contexts/AuthContext.jsx"
  "src/contexts/CoupleAnalysisContext.jsx"
  "src/utils/simpleCoupleContentSave.js"
  "src/components/home/Hero.jsx"
  "src/components/QuestionFocus.jsx"
  "src/components/ChartDiagnosisSection.jsx"
  "src/components/MingJu.jsx"
  "src/components/SpecificSuggestion.jsx"
  "src/components/GanZhi.jsx"
  "src/components/PricingModal.jsx"
  "src/components/CoupleGodExplain.jsx"
  "src/components/CoupleMingJu.jsx"
  "src/components/RestartChemistrySection.jsx"
  "src/components/CoreSuggestion.jsx"
  "src/components/KeyAnalysisSection.jsx"
  "src/components/WealthFortuneAnalysis.jsx"
  "src/components/RelationshipMethodSection.jsx"
  "src/components/JiXiong.jsx"
  "src/components/Report.jsx"
  "src/components/CoupleAnnualAnalysis.jsx"
  "src/components/QuestionFocusSimple.jsx"
  "src/components/Season.jsx"
  "src/components/bazhai/OverallBazhaiAnalysis.jsx"
  "src/components/TargetedSuggestionsSection.jsx"
  "src/components/RelationshipFortuneAnalysis.jsx"
  "src/components/StarChartGuidanceSection.jsx"
  "src/components/EmergencyFengShuiSection.jsx"
  "src/components/CoupleSeason.jsx"
  "src/components/WeChatLogin.jsx"
  "src/components/LiuNianKeyWord.jsx"
  "src/components/FengShuiTransformationSection.jsx"
  "src/components/HealthFortuneAnalysis.jsx"
  "src/hooks/useCoupleAnalysisReports.js"
  "src/lib/MingJu.jsx"
  "src/lib/userTracking.js"
)

API_BASE_LINE="const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.harmoniqfengshui.com';"

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Check if already has API_BASE
    if grep -q "const API_BASE" "$file"; then
      echo "⏭️  $file: Already has API_BASE"
    elif grep -q "\${API_BASE}" "$file"; then
      # File uses API_BASE but doesn't define it - add it
      # Find first line that starts a function/component and add after opening brace
      if grep -q "export.*{$" "$file"; then
        # Has opening brace on same line as export
        sed -i '' "/export.*{$/a\\
\t$API_BASE_LINE
" "$file"
        echo "✅ $file: Added API_BASE"
      elif grep -q "^export default" "$file"; then
        # export default on separate line
        line_num=$(grep -n "^export default" "$file" | head -1 | cut -d: -f1)
        next_line=$((line_num + 1))
        sed -i '' "${next_line}a\\
\t$API_BASE_LINE
" "$file"
        echo "✅ $file: Added API_BASE"
      else
        echo "⚠️  $file: Couldn't find insertion point"
      fi
    else
      echo "⏭️  $file: Doesn't use API_BASE"
    fi
  else
    echo "❌ $file: Not found"
  fi
done

echo ""
echo "✅ API_BASE constant addition complete"
