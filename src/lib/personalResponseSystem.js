// Enhanced Personal Response System (No AI Required)
// This can be used as fallback when AI is unavailable

// Enhanced emotion analysis with more keywords
const analyzeUserEmotion = (text) => {
	const emotions = {
		crisis: ["想死", "自殺", "活不下去", "絕望", "沒有意義"],
		stressed: ["壓力", "焦慮", "緊張", "擔心", "困擾", "煩惱", "累", "攰"],
		sad: [
			"難過",
			"傷心",
			"沮喪",
			"憂鬱",
			"失落",
			"孤單",
			"唔開心",
			"心情低落",
			"低落",
			"情緒低落",
		],
		angry: ["生氣", "憤怒", "不爽", "火大", "討厭", "嬲", "激嬲"],
		confused: ["不知道", "困惑", "迷茫", "不懂", "疑問", "唔明", "亂"],
		hopeful: ["希望", "期待", "想要", "渴望", "夢想", "盼望"],
		happy: ["開心", "快樂", "高興", "興奮", "滿足", "爽", "正"],
	};

	for (const [emotion, keywords] of Object.entries(emotions)) {
		if (keywords.some((keyword) => text.includes(keyword))) {
			return emotion;
		}
	}
	return "neutral";
};

// Detect topic from user message
const detectTopic = (message) => {
	const topics = {
		relationship: [
			"另一半",
			"感情",
			"愛情",
			"伴侶",
			"男朋友",
			"女朋友",
			"老公",
			"老婆",
			"結婚",
			"分手",
		],
		career: [
			"工作",
			"事業",
			"老闆",
			"同事",
			"升職",
			"轉工",
			"辭職",
			"職場",
			"公司",
		],
		finance: [
			"錢",
			"財運",
			"投資",
			"理財",
			"收入",
			"薪水",
			"債務",
			"破財",
			"賺錢",
		],
		health: ["健康", "病", "身體", "睡眠", "失眠", "頭痛", "疲累"],
		family: ["家人", "父母", "子女", "家庭", "屋企", "家宅", "搬屋"],
	};

	for (const [topic, keywords] of Object.entries(topics)) {
		if (keywords.some((keyword) => message.includes(keyword))) {
			return topic;
		}
	}
	return "general";
};

// Generate personalized response without AI
const generatePersonalResponse = (userMessage, userProfile, emotion, topic) => {
	let response = "";

	// 1. Simple emotional support (direct, no drama)
	const name = userProfile.name || "朋友";
	const emotionalResponses = {
		crisis: `${name}，如果情況緊急，可以打撒瑪利亞防止自殺會 2389 2222。`,
		stressed: `${name}，壓力大係正常嘅。`,
		sad: `${name}，心情低落記住你唔係一個人。`,
		angry: `${name}，我明白你而家好嬲。`,
		confused: `${name}，迷茫嘅時候可以慢慢諗。`,
		hopeful: `${name}，有希望係好事。`,
		happy: `${name}，見到你開心我都開心。`,
		neutral: `${name}，多謝你同我分享。`,
	};

	response += emotionalResponses[emotion] || emotionalResponses.neutral;

	// 2. Simple Five Elements advice (only if birthday available)
	if (userProfile.birthday) {
		const birthYear = new Date(userProfile.birthday).getFullYear();
		const element = getElement(birthYear);
		const elementAdvice = getSimpleElementAdvice(element, topic);
		response += `\n\n你係${element}命人，${elementAdvice}`;
	}

	// 3. Practical feng shui advice (no dramatic language)
	const practicalAdvice = getPracticalAdvice(topic);
	if (practicalAdvice) {
		response += `\n\n${practicalAdvice}`;
	}

	// 4. No report suggestion (removed pushy sales)
	// Reports will only be mentioned if user specifically asks

	return response;
};

// Get five element based on birth year
const getElement = (year) => {
	const yearMod = year % 10;
	const elements = {
		0: "金",
		1: "金",
		2: "水",
		3: "水",
		4: "木",
		5: "木",
		6: "火",
		7: "火",
		8: "土",
		9: "土",
	};
	return elements[yearMod];
};

// Simple element advice (less dramatic)
const getSimpleElementAdvice = (element, topic) => {
	const advice = {
		金: {
			general: "建議多用白色同金屬擺設。",
			relationship: "感情上要溫柔啲。",
			career: "適合做領導，辦公室西面放金屬物品。",
			finance: "財運穩定，西方係財位。",
			health: "要注意肺部同呼吸系統。",
		},
		水: {
			general: "建議多用藍色黑色，避免黃色。",
			relationship: "唔好太優柔寡斷。",
			career: "適合創意工作，北方係事業位。",
			finance: "理財要保守啲。",
			health: "要注意腎臟同水循環。",
		},
		木: {
			general: "建議多用綠色植物。",
			relationship: "唔好太急躁，要有耐性。",
			career: "東方係貴人位。",
			finance: "選擇穩定投資。",
			health: "要注意肝臟同眼睛。",
		},
		火: {
			general: "建議用紅色裝飾，避免太多水。",
			relationship: "要控制脾氣。",
			career: "南方係成功位。",
			finance: "避免衝動消費。",
			health: "要注意心臟同血液循環。",
		},
		土: {
			general: "建議用黃色棕色。",
			relationship: "要主動表達感情。",
			career: "適合穩定工作。",
			finance: "適合長期投資。",
			health: "要注意腸胃同消化系統。",
		},
	};

	return advice[element][topic] || advice[element].general;
};

// Practical feng shui advice (simple and actionable)
const getPracticalAdvice = (topic) => {
	const advice = {
		relationship: "睡房床頭要靠實牆，唔好對住鏡。",
		career: "辦公桌面向門口，背後要有靠。",
		finance: "搵到屋企財位（入門對角），保持整潔。",
		health: "睡房要通風，廚房保持乾淨。",
		family: "客廳要明亮，沙發靠牆坐。",
		general: "保持屋企整潔，多放綠色植物。",
	};

	return advice[topic] || advice.general;
};

// Export for use in chat system
export {
	analyzeUserEmotion,
	detectTopic,
	generatePersonalResponse,
	getElement,
	getSimpleElementAdvice,
	getPracticalAdvice,
};
