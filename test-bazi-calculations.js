/**
 * BaZi Calculation Verification Test
 * Tests the accuracy of BaZi calculations against known examples
 * 
 * Run this in browser console on /zh-TW/bazi-chart page or use Next.js dev server
 */

// Test case: 2025-12-17 18:37 (from your screenshot)
const testData = {
	birthDate: "2025-12-17 18:37",
	gender: "male",
	name: "Mic"
};

console.log("===== BaZi Calculation Verification =====\n");
console.log("Test Date: 2025-12-17 18:37");
console.log("Gender: Male\n");

console.log("Expected Results from Screenshot:");
console.log("─────────────────────────────────────");
console.log("年柱 (Year):  乙巳");
console.log("月柱 (Month): 戊子");
console.log("日柱 (Day):   庚申 (Day Master)");
console.log("時柱 (Hour):  乙酉");
console.log("");

console.log("Ten Gods (十神):");
console.log("年干神: 正財");
console.log("月干神: 梟神");
console.log("日干神: 日主");
console.log("時干神: 正財");
console.log("");

console.log("Nayin (納音):");
console.log("年柱: 覆燈火");
console.log("月柱: 霹靂火");
console.log("日柱: 石榴木");
console.log("時柱: 井泉水");
console.log("");

console.log("Hidden Stems (藏干) - Year Branch 巳:");
console.log("1. 丙火 (庚金)");
console.log("2. 庚金 (undefined)");
console.log("3. 戊土 (undefined)");
console.log("");

console.log("Relationships:");
console.log("天干關係: 乙+庚 合化金 (年柱↔日柱), 庚+乙 合化金 (日柱↔時柱)");
console.log("地支關係: 巳+申 相沖 (年柱↔日柱), 巳+酉 半合金局 (年柱↔時柱), 申+酉 六合 (日柱↔時柱)");
console.log("");

console.log("=" .repeat(50));
console.log("📋 TO VERIFY IN APP:");
console.log("=" .repeat(50));
console.log("1. Navigate to /zh-TW/bazi-input");
console.log("2. Fill in:");
console.log("   - Name: Mic (or any name)");
console.log("   - Gender: 男");
console.log("   - Birth Date: 2025-12-17");
console.log("   - Birth Time: 18:37");
console.log("   - Location: Any (e.g., 香港)");
console.log("3. Click '開始免費排盤'");
console.log("4. Check all three tabs:");
console.log("");
console.log("Tab 1 (干支圖況) - Verify:");
console.log("  ✓ Four pillars match: 乙巳, 戊子, 庚申, 乙酉");
console.log("  ✓ Day master highlighted: 庚申");
console.log("  ✓ Stem relationships shown: 乙+庚 合化金");
console.log("  ✓ Branch relationships shown: 巳+申 相沖, 巳+酉 半合金局, 申+酉 六合");
console.log("");
console.log("Tab 2 (基本排盤) - Verify:");
console.log("  ✓ Row 1 (干神): 正財, 梟神, 日主, 正財");
console.log("  ✓ Row 2 (天干): 乙, 戊, 庚, 乙");
console.log("  ✓ Row 3 (地支): 巳, 子, 申, 酉");
console.log("  ✓ Row 4-6 (藏干): Hidden stems for each branch");
console.log("  ✓ Row 7-9 (藏干神): Ten gods for hidden stems");
console.log("  ✓ Row 10-12 (納音): 覆燈火, 霹靂火, 石榴木, 井泉水");
console.log("");
console.log("Tab 3 (本命天干) - Verify:");
console.log("  ✓ Day master: 庚 (金, 陽)");
console.log("  ✓ Five elements bar chart shows distribution");
console.log("  ✓ Element analysis (缺失/過旺/適中/偏弱)");
console.log("");
console.log("=" .repeat(50));

console.log("\n✨ To run actual verification:");
console.log("1. Open the app in iOS simulator");
console.log("2. Clean build in Xcode (⇧⌘K)");
console.log("3. Rebuild and run");
console.log("4. Navigate to BaZi input page");
console.log("5. Fill in the test data above");
console.log("6. Compare all values against this reference");

