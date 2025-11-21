// AI Career Fortune Analysis Prompt Generator
export const generateCareerFortunePrompt = (userInfo, wuxingData) => {
	const { birthDateTime, gender } = userInfo;
	const birthDate = new Date(birthDateTime);
	const currentYear = new Date().getFullYear();
	const age = currentYear - birthDate.getFullYear();

	// Extract key elements from wuxing data
	const dayMaster = wuxingData.dayStem; // 日主
	const dayBranch = wuxingData.dayBranch; // 日支
	const monthStem = wuxingData.monthStem; // 月干
	const monthBranch = wuxingData.monthBranch; // 月支
	const yearStem = wuxingData.yearStem; // 年干
	const yearBranch = wuxingData.yearBranch; // 年支
	const hourStem = wuxingData.hourStem; // 時干
	const hourBranch = wuxingData.hourBranch; // 時支

	const dayMasterElement = wuxingData.dayStemWuxing; // 日主五行
	const monthElement = wuxingData.monthStemWuxing; // 月干五行

	const prompt = `請根據以下八字資料進行個人化事業運勢分析，並以JSON格式輸出：

八字資料：
- 日主：${dayMaster}${dayMasterElement}（生於${monthBranch}月${monthStem}${monthElement}）
- 四柱：${yearStem}${yearBranch}年柱、${monthStem}${monthBranch}月柱、${dayMaster}${dayBranch}日柱、${hourStem}${hourBranch}時柱
- 性別：${gender === "male" ? "男" : "女"}性
- 現年：${age}歲
- 出生年份：${birthDate.getFullYear()}年

請嚴格按照以下JSON格式輸出分析結果：

\`\`\`json
{
  "summary": {
    "title": "格局定位（例：傷官制殺，專業權威之路）",
    "description": "基於八字十神組合的事業格局分析，包含核心優勢和適合職業方向"
  },
  "talents": {
    "天賦特質解碼": {
      "title": "天賦特質解碼",
      "content": [
        {
          "name": "十神A（如：${yearStem}${yearBranch}傷官）",
          "description": "核心優勢能力特質分析，具體工作表現和創新能力",
          "attention": "注意事項：過旺風險及化解方案（如佩戴飾品、風水佈局）"
        },
        {
          "name": "十神B（如：${monthStem}${monthBranch}七殺）", 
          "description": "執行特質和領導能力分析，承壓能力和權威表現",
          "attention": "注意事項：壓力訊號及風水佈局建議"
        },
        {
          "name": "十神C（如：${hourStem}${hourBranch}正印）",
          "description": "智慧特質和學習能力，專業深度和分析能力",
          "attention": "注意事項：避免過度思慮，保持行動力"
        }
      ]
    },
    "二十年黃金賽道": {
      "title": "二十年黃金賽道", 
      "content": {
        "periods": [
          {
            "years": "${currentYear} - ${currentYear + 10}",
            "luck": "大運名稱",
            "action": "關鍵動作（如考照/組隊/創業）",
            "bestYear": "最佳流年（具體年份）",
            "warning": "風險預警（因刑衝破害）"
          },
          {
            "years": "${currentYear + 10} - ${currentYear + 20}",
            "luck": "大運名稱",
            "action": "進階動作（如擴張/上市）", 
            "bestYear": "契機流年（具體年份）",
            "warning": "人際風險預警"
          },
          {
            "years": "${currentYear + 20} - ${currentYear + 30}",
            "luck": "大運名稱",
            "action": "巔峰動作（如行業標準制定）",
            "bestYear": "關鍵年份",
            "warning": "下屬管理風險"
          }
        ]
      }
    },
    "權力巔峰標誌": {
      "title": "權力巔峰標誌",
      "content": {
        "peakYear": "具體年份（如${currentYear + 25}年）",
        "peakDescription": "權力表現（如掌機構決策權）",
        "bestPartners": "最佳合作生肖組合（三合六合）",
        "avoidIndustries": "行業紅線：需避免的行業及原因"
      }
    }
  },
  "strategies": {
    "officeLayout": {
      "title": "辦公室佈局",
      "description": "具體方位和開運物品",
      "details": "詳細擺放說明：位置、材質、朝向要求",
      "warning": "禁忌事項：需避免的顏色和物品"
    },
    "annualStrategy": {
      "title": "流年借力",
      "year": "特定年份為格局名稱",
      "description": "該年天干地支組合的格局優勢",
      "benefit": "具體利用方式：升職、決策、投資時機"
    },
    "lifelongTaboo": {
      "title": "終身禁忌",
      "warning": "觸發危機的具體行為",
      "reason": "基於十神理論的詳細解釋和後果分析"
    }
  }
}
\`\`\`

分析要求：
1. 深度結合八字十神理論和大運流年
2. 考慮${gender === "male" ? "男性" : "女性"}職場特點
3. 提供具體可操作的建議（時間、方位、物品）
4. 預測未來20-30年的關鍵時機
5. 語言專業但實用，使用傳統中文
6. 必須輸出標準JSON格式，不要添加任何額外說明

請開始分析：`;

	return prompt;
};

export default generateCareerFortunePrompt;
