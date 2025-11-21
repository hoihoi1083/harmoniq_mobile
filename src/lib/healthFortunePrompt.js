// AI Health Fortune Analysis Prompt Generator
export const generateHealthFortunePrompt = (userInfo, wuxingData) => {
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

	const prompt = `請根據以下八字資料進行個人化健康運勢分析，並以JSON格式輸出：

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
    "title": "核心健康特質總結（例：水土交戰，養腎固本為要）",
    "description": "基於八字五行生剋關係的整體健康評述，包含核心矛盾和調和重點"
  },
  "systems": {
    "腎骨系統核心": {
      "title": "腎骨系統核心",
      "content": {
        "description": "基於日主${dayMasterElement}和時柱分析腎骨系統特質",
        "advantages": "先天優勢：骨骼密度、修復能力等具體表現",
        "risks": [
          {
            "period": "${gender === "male" ? "男性" : "女性"}青年期 (20-35歲)",
            "description": "具體健康風險和症狀表現"
          },
          {
            "period": "未來大運期間（具體年份）",
            "description": "長期健康隱患和預防重點"
          }
        ],
        "keyYears": "關鍵年份提醒：${birthDate.getFullYear() + 35}年、${birthDate.getFullYear() + 45}年等具體年份的注意事項"
      }
    },
    "代謝循環特質": {
      "title": "代謝循環特質",
      "content": {
        "description": "基於火土水關係分析代謝循環系統",
        "bloodCharacteristics": "血液特質：粘稠度、循環狀況及檢測建議",
        "digestiveFeatures": "消化特徵：脾胃功能強弱、飲食宜忌",
        "skinConcerns": "皮膚狀況：屏障功能、季節性問題預防"
      }
    },
    "神經免疫平衡": {
      "title": "神經免疫平衡",
      "content": {
        "description": "基於木火關係分析神經免疫系統",
        "advantages": "優勢特質：應激反應、免疫力強度",
        "weaknesses": "潛在弱點：睡眠品質、神經調節問題",
        "periodicPattern": "週期性規律：生肖年份對健康的影響模式"
      }
    }
  },
  "careRegimen": {
    "diet": "個人化飲食方案：具體的晨起養生、午間調養、季節性飲食建議，包含具體分量和時間",
    "acupoints": "經絡調養：具體穴位名稱、按摩時間（如每晚7-9點按摩湧泉穴3分鐘）、最佳時段",
    "exercise": "運動建議：最適合的運動類型、頻率（如游泳週2-3次每次30分鐘）、需避免的時段",
    "lifeStageReminder": "大運提醒：下個大運起始年份${birthDate.getFullYear() + Math.floor(age / 10) * 10 + 10}年的健康重點和調養強化"
  }
}
\`\`\`

分析要求：
1. 深度結合八字五行生剋關係
2. 考慮${gender === "male" ? "男性" : "女性"}生理特點
3. 提供具體可操作的建議（時間、頻率、劑量）
4. 預測具體年份的健康變化
5. 語言專業但易懂，使用傳統中文
6. 必須輸出標準JSON格式，不要添加任何額外說明

請開始分析：`;

	return prompt;
};

export default generateHealthFortunePrompt;
