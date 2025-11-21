// 感情婚姻通用指南 Prompt Generator

export function generateRelationshipFortunePrompt(userInfo, wuxingData) {
	const birthDate = new Date(userInfo.birthDateTime);
	const currentYear = new Date().getFullYear();
	const age = currentYear - birthDate.getFullYear();

	// Extract essential bazi information
	const yearStem = wuxingData.yearStem || "壬";
	const yearBranch = wuxingData.yearBranch || "子";
	const monthStem = wuxingData.monthStem || "癸";
	const monthBranch = wuxingData.monthBranch || "丑";
	const dayStem = wuxingData.dayStem || "壬";
	const dayBranch = wuxingData.dayBranch || "子";
	const hourStem = wuxingData.hourStem || "庚";
	const hourBranch = wuxingData.hourBranch || "申";

	const dayMasterElement = wuxingData.dayStemWuxing || "水";
	const gender = userInfo.gender || "男";

	const prompt = `# 感情婚姻通用指南分析

## 用戶基本信息
- 姓名：${userInfo.name}
- 性別：${gender}
- 出生日期：${userInfo.birthDateTime}
- 當前年齡：${age}歲

## 八字信息
- 年柱：${yearStem}${yearBranch}
- 月柱：${monthStem}${monthBranch}
- 日柱：${dayStem}${dayBranch}（日主：${dayStem}${dayMasterElement}）
- 時柱：${hourStem}${hourBranch}

## 分析要求

請基於以上八字信息，按照以下JSON格式生成詳細的感情婚姻分析：

\`\`\`json
{
  "summary": {
    "title": "格局本質一句話總結（如：殺星混雜，晚婚為吉）",
    "description": "結合八字結構分析夫妻宮和配偶星的情況，解釋婚姻格局特點"
  },
  "authenticity": {
    "profession": {
      "title": "基本屬性",
      "description": "正緣伴侶應具備的十神屬性和對應職業類型，詳細說明為什麼適合",
      "warning": "注意事項和相處建議"
    },
    "ageGap": {
      "title": "年齡差距", 
      "description": "最佳年齡差距範圍及其八字理論依據",
      "warning": "年齡差距的注意事項"
    },
    "meetingChance": {
      "title": "相識契機",
      "description": "最佳相遇時機和場景，基於流年分析",
      "warning": "相識時的注意事項"
    }
  },
  "romanticCycles": {
    "25歲前": {
      "period": "具體年齡段",
      "fortune": "對應大運",
      "dangerousYear": "高危險流年及其特徵",
      "crisis": "具體危機類型描述",
      "solution": "詳細化解方案，包括風水建議"
    },
    "35歲危機": {
      "period": "具體年齡段",
      "fortune": "對應大運", 
      "dangerousYear": "高危險流年及其特徵",
      "crisis": "具體危機類型描述",
      "solution": "詳細化解方案，包括風水建議"
    },
    "45歲波動": {
      "period": "具體年齡段",
      "fortune": "對應大運",
      "dangerousYear": "高危險流年及其特徵", 
      "crisis": "具體危機類型描述",
      "solution": "詳細化解方案，包括風水建議"
    }
  },
  "marriageRules": {
    "bestYear": {
      "title": "最佳婚年",
      "year": "具體年份（夫妻宮到位）",
      "description": "該年份的八字分析和婚姻時機說明"
    },
    "taboos": {
      "title": "相處禁忌",
      "financial": {
        "title": "財務管理禁忌",
        "description": "基於劫財或財星分析的財務建議"
      },
      "frequency": {
        "title": "相處頻率建議",
        "description": "基於五行相剋化解的相處模式"
      }
    },
    "childrenFate": {
      "title": "子女緣",
      "timing": "最佳生育時機和性別預測",
      "description": "子女運勢和教育建議"
    }
  }
}
\`\`\`

## 分析重點：
1. 基於夫妻宮（日支）和配偶星分析婚姻格局
2. 結合大運流年推算感情發展階段和危機期
3. 提供具體的擇偶條件和相處建議
4. 給出實用的化解方案和風水布局
5. 所有分析都要有明確的八字理論依據

格局本質： [夫星/妻星]混雜 → 晚婚為吉

正緣三維認證：
- 職業特質：需具[十神]屬性（如[職業類型]）
- 年齡差距：[數字]歲以上可調和[五行矛盾] 
- 相遇契機：[流年]利於[社交場景]中結識

情劫週期表：
年齡層 | 高危險流年 | 危機類型 | 化解方案
[歲數]前 | [年] | [爛桃花/三角關係] | 避[生肖]屬相
[歲數]歲 | [年] | [經濟糾紛] | [風水佈置]

婚姻法則：
- 最佳婚年：[流年]（[夫妻宮]到位）
- 相處禁忌：
  - 禁止[財務行為]（因[劫財星]而奪財）
  - [分居頻率]緩解[五行相剋]

使用說明：將方括號[ ]內參數替換為命主專屬訊息

請確保分析內容專業、準確，符合傳統八字命理學理論。`;

	return prompt;
}

// 生成簡化版本的 Prompt（用於測試）
export function generateSimpleRelationshipPrompt(userInfo, wuxingData) {
	return `分析${userInfo.name}的感情婚姻運勢，生成包含正緣特徵、情劫週期、婚姻法則的完整感情指南，提供實用的擇偶和相處建議。`;
}
