import React, { useState, useEffect } from "react";
import Image from "next/image";

const TAB_CONFIG = {
	健康: {
		middle: {
			label: "疾厄宮與十神",
			img: "/images/report/star2.png",
			selectedBg: "#DEAB20",
			selectedImg: "#FFFFFF",
			unselectedBg: "#EFEFEF",
			unselectedImg: "#DEAB20",
		},
		right: {
			label: "調候與病源關鍵",
			img: "/images/report/health.png",
			selectedBg: "#389D7D",
			selectedImg: "#FFFFFF",
			unselectedBg: "#EFEFEF",
			unselectedImg: "#389D7D",
		},
	},
	財運: {
		middle: {
			label: "財星與十神",
			img: "/images/report/star2.png",
			selectedBg: "#DEAB20",
			selectedImg: "#FFFFFF",
			unselectedBg: "#EFEFEF",
			unselectedImg: "#DEAB20",
		},
		right: {
			label: "財星定位",
			img: "/images/report/money.png",
			selectedBg: "#D09900",
			selectedImg: "#FFFFFF",
			unselectedBg: "#EFEFEF",
			unselectedImg: "#D09900",
		},
	},
	事業: {
		middle: {
			label: "事業宮與十神",
			img: "/images/report/star2.png",
			selectedBg: "#DEAB20",
			selectedImg: "#FFFFFF",
			unselectedBg: "#EFEFEF",
			unselectedImg: "#DEAB20",
		},
		right: {
			label: "財星定位",
			img: "/images/report/money.png",
			selectedBg: "#3263C4",
			selectedImg: "#FFFFFF",
			unselectedBg: "#EFEFEF",
			unselectedImg: "#3263C4",
		},
	},
	感情: {
		middle: {
			label: "感情宮與十神",
			img: "/images/report/star2.png",
			selectedBg: "#DEAB20",
			selectedImg: "#FFFFFF",
			unselectedBg: "#EFEFEF",
			unselectedImg: "#DEAB20",
		},
		right: {
			label: "感情定位",
			img: "/images/report/heart2.png",
			selectedBg: "#C74772",
			selectedImg: "#FFFFFF",
			unselectedBg: "#EFEFEF",
			unselectedImg: "#C74772",
		},
	},
};

const TABS = ["日主特性", "middle", "right"];

function getTabConfig(concern) {
	return TAB_CONFIG[concern] || TAB_CONFIG["財運"];
}

function getTabLabel(tab, concern) {
	if (tab === "日主特性") return "日主特性";
	if (tab === "middle") return getTabConfig(concern).middle.label;
	if (tab === "right") return getTabConfig(concern).right.label;
	return "";
}

function getTabImg(tab, concern) {
	if (tab === "日主特性") return "/images/report/sun.png";
	if (tab === "middle") return getTabConfig(concern).middle.img;
	if (tab === "right") return getTabConfig(concern).right.img;
	return "";
}

function getTabBg(tab, concern, selected) {
	if (tab === "日主特性") return selected ? "#B4003C" : "#EFEFEF";
	if (tab === "middle")
		return selected
			? getTabConfig(concern).middle.selectedBg
			: getTabConfig(concern).middle.unselectedBg;
	if (tab === "right")
		return selected
			? getTabConfig(concern).right.selectedBg
			: getTabConfig(concern).right.unselectedBg;
	return "#EFEFEF";
}

function getTabImgColor(tab, concern, selected) {
	if (tab === "日主特性") return selected ? "#FFFFFF" : "#B4003C";
	if (tab === "middle")
		return selected
			? getTabConfig(concern).middle.selectedImg
			: getTabConfig(concern).middle.unselectedImg;
	if (tab === "right")
		return selected
			? getTabConfig(concern).right.selectedImg
			: getTabConfig(concern).right.unselectedImg;
	return "#B4003C";
}

// AI analysis function with real API integration
async function generateMingJuAnalysis(
	{ birthDateTime, gender, concern, problem, currentYear },
	tab
) {
	const concernArea = concern || "財運";

	// Create AI prompt based on tab and concern
	const prompt = createAIPrompt(concernArea, tab, {
		birthDateTime,
		gender,
		problem,
	});

	try {
		// Call your AI API here (replace with your actual AI service)
		const response = await fetch("/api/ai-analysis", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				prompt,
				userInfo: { birthDateTime, gender, concern, problem },
				analysisType: `mingju_${tab}_${concernArea}`,
				currentYear,
			}),
		});

		if (response.ok) {
			const data = await response.json();
			return data.analysis || getFallbackContent(concernArea, tab);
		}
	} catch (error) {
		console.error("AI analysis failed:", error);
	}

	// Fallback to static content if AI fails
	return getFallbackContent(concernArea, tab);
}

// Create structured prompts for AI
function createAIPrompt(concern, tab, userInfo) {
	const { birthDateTime, gender, problem } = userInfo;

	const baseContext = `用戶生辰：${birthDateTime}，性別：${gender}，關注領域：${concern}，具體問題：${problem}`;

	if (tab === "日主特性") {
		if (concern === "財運") {
			return `${baseContext}
      
請按以下格式分析日主特性：
[日干五行]生於[月令]，[坐支特性]，賦予[优势2项]；然[劣势2项]。全局[调候需求]，[长期策略]

要求：
1. 分析日主五行強弱
2. 列出2個優勢、2個劣勢
3. 提出調候方案
4. 給出長期財運策略
約250字，專業術語與白話結合`;
		} else if (concern === "事業") {
			return `${baseContext}
      
請按以下格式分析日主特性：
[日干五行]生於[月令]，[坐支特性]，賦予[优势2项]；然[劣势2项]。全局[调候需求]，[长期策略]

要求：
1. 分析事業發展的日主基礎
2. 列出事業優勢與劣勢各2項
3. 提出調候需求
4. 給出事業發展長期策略
約250字`;
		}
		// Add other concerns...
	} else if (tab === "middle") {
		if (concern === "財運") {
			return `${baseContext}
      
請按以下結構分析財星與十神：
【財星核心】：[財星屬性]為[定位]，然其：
[狀態1]：[證據] 
[狀態2]：[證據]
【結論】：[財星狀態總結]
【生財之源】[食傷分析] 關鍵問題：[核心矛盾]
【十神互動關鍵】：
[十神A]：[作用機制]
[十神B]：[作用機制] 
[十神C]：[作用機制]
【財運格局核心】：[用15字內概括格局矛盾]

要求：約300字，深入分析財星狀態與十神互動`;
		}
		// Add other concerns...
	} else if (tab === "right") {
		if (concern === "財運") {
			return `${baseContext}
      
請按以下結構分析財星定位：
【財星本體】：[正偏財屬性]
【財星狀態】：[比喻式描述+風險警示]
【財源】：[生財途徑] 但受制於[制約因素]
【破財之源】：[主要克財十神]
【調候關鍵】：[五行1]（功能） + [五行2]（功能）
【財運特質】：
[特質1]：[具體表現]
[特質2]：[具體表現]
[特質3]：[具體表現]
[不動產/合作專項分析]

要求：約350字，實用性建議為主`;
		}
		// Add other concerns...
	}

	return `${baseContext}\n請根據八字命理分析${concern}相關的${tab}內容。`;
}

// Content rendering with structured layout
function renderStructuredContent(concernArea, tab) {
	const containerStyle = {
		backgroundColor: "#ECECEC",
		borderRadius: "20px",
		boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
		padding: "20px",
		marginBottom: "16px",
	};

	if (tab === "middle" && concernArea === "財運") {
		return (
			<div className="space-y-4">
				{/* 財星核心 Section */}
				<div style={containerStyle}>
					<h3 className="text-lg font-bold text-[#B4003C] mb-3">
						【財星核心】
					</h3>
					<div className="leading-relaxed text-gray-800">
						<p className="mb-2">
							正財辛金，透於月干，為核心財源（薪資、正業收入）。然辛金：
						</p>
						<ul className="ml-2 space-y-1 list-disc list-inside">
							<li>
								弱：僅得未土（月支）微根，且未為燥土生金乏力
							</li>
							<li>
								受克：被年干己土（傷官）泄氣，被日主丙火（劫財特性）猛烈克制（丙辛合克）
							</li>
							<li>無生：全局缺強金（比助）、水（官殺護財）</li>
						</ul>
						<p className="mt-3 font-semibold text-[#B4003C]">
							【結論】正財根基不穩，易被爭奪、克損、遲滯。偏財不顯。
						</p>
					</div>
				</div>

				{/* 生財之源 Section */}
				<div style={containerStyle}>
					<h3 className="text-lg font-bold text-[#B4003C] mb-3">
						【生財之源】
					</h3>
					<div className="leading-relaxed text-gray-800">
						<p className="mb-3">
							己土（年干傷官）、未土（月支藏己丁乙，主氣己土傷官）、寅中戊土（食神）。食傷旺代表有才華、點子、技術、服務能力，是生財的資本。
						</p>

						<div className="p-3 mb-2 bg-white rounded-lg">
							<h4 className="font-semibold text-[#D09900] mb-2">
								火旺土燥
							</h4>
							<p className="text-sm text-gray-700">
								火勢過旺導致土質焦燥，失去滋潤生金的能力，象徵才華雖多但難以轉化為實際財富。
							</p>
						</div>

						<div className="p-3 bg-white rounded-lg">
							<h4 className="font-semibold text-[#D09900] mb-2">
								焦土難生金（財）
							</h4>
							<p className="text-sm text-gray-700">
								燥土雖有生金之意，但因缺乏水潤而無法有效生財，需要調候平衡方能發揮生財功能。
							</p>
						</div>
					</div>
				</div>

				{/* 十神互動關鍵 Section */}
				<div style={containerStyle}>
					<h3 className="text-lg font-bold text-[#B4003C] mb-3">
						【十神互動關鍵】
					</h3>
					<div className="space-y-2 leading-relaxed text-gray-800">
						<div className="flex items-start">
							<span className="font-semibold text-[#389D7D] mr-2">
								•
							</span>
							<span>
								<strong>印星（乙木）</strong>
								：生身間接加劇克財，雖主貴人助力，但方式間接
							</span>
						</div>
						<div className="flex items-start">
							<span className="font-semibold text-[#D09900] mr-2">
								•
							</span>
							<span>
								<strong>傷官（己土）</strong>
								：才華創新，是生財關鍵，但易惹是非
							</span>
						</div>
						<div className="flex items-start">
							<span className="font-semibold text-[#B4003C] mr-2">
								•
							</span>
							<span>
								<strong>比劫（丙火）</strong>
								：奪財最凶之神！體現為競爭對手、合夥爭利
							</span>
						</div>
						<p className="mt-3 font-semibold text-[#B4003C] bg-white rounded-lg p-2">
							【財運格局核心】食傷生財但財弱受克，比劫虎視眈眈
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (tab === "right" && concernArea === "財運") {
		return (
			<div className="space-y-4">
				{/* 核心論述 Section */}
				<div style={containerStyle}>
					<h3 className="text-lg font-bold text-[#B4003C] mb-3">
						核心論述
					</h3>
					<div className="space-y-3 leading-relaxed text-gray-800">
						<div>
							<h4 className="font-semibold text-[#D09900] mb-1">
								【財星本體】
							</h4>
							<p>金（辛金正財 - 核心，庚金偏財 - 弱或不顯）</p>
						</div>
						<div>
							<h4 className="font-semibold text-[#D09900] mb-1">
								【財星狀態】
							</h4>
							<p>
								辛金正財 -
								虛透、弱、受克（丙火克、己土泄）。如同脆弱的金屬暴露在熔爐（火局）旁，隨時有被熔毀風險。
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-[#D09900] mb-1">
								【財源】
							</h4>
							<p>
								食傷土旺（己、未、戊） -
								代表技能、創意、服務、付出。但受制於火旺土燥不生金和火旺直接熔金雙重打壓。
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-[#D09900] mb-1">
								【破財之源】
							</h4>
							<p>
								比劫火旺（丙火日主、流年巳火） - 直接劫奪財星金
							</p>
						</div>
						<div>
							<h4 className="font-semibold text-[#D09900] mb-1">
								【調候關鍵】
							</h4>
							<p>
								水（官殺/調候） -
								制火護金，潤土生金，通關水火，護財穩局
							</p>
							<p>強金（庚申酉） - 助辛抗火</p>
						</div>
					</div>
				</div>

				{/* 財運特質 Section */}
				<div style={containerStyle}>
					<h3 className="text-lg font-bold text-[#B4003C] mb-3">
						【財運特質】
					</h3>
					<div className="leading-relaxed text-gray-800">
						<div className="p-3 mb-3 bg-white rounded-lg">
							<p className="mb-2 text-sm italic text-gray-600">
								總體特徵：以正財為主的穩健型財運，但面臨競爭激烈與資金周轉挑戰，需要謹慎理財與適當調候。
							</p>
						</div>
						<div className="space-y-2">
							<div className="flex items-start">
								<span className="font-semibold text-[#D09900] mr-2">
									•
								</span>
								<span>
									<strong>正財為主，偏財難求</strong>
									：宜專注本職、專業技能獲取正財
								</span>
							</div>
							<div className="flex items-start">
								<span className="font-semibold text-[#D09900] mr-2">
									•
								</span>
								<span>
									<strong>勞碌求財，周轉不靈</strong>
									：付出多但回報易被克奪遲滯
								</span>
							</div>
							<div className="flex items-start">
								<span className="font-semibold text-[#D09900] mr-2">
									•
								</span>
								<span>
									<strong>不動產雙刃劍</strong>
									：土重可視為潛在資產，但流動性差
								</span>
							</div>
							<div className="flex items-start">
								<span className="font-semibold text-[#D09900] mr-2">
									•
								</span>
								<span>
									<strong>合作風險高</strong>
									：比劫奪財特性，合夥借貸易引發財務糾紛
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Return fallback content for other tabs/concerns
	return getFallbackContent(concernArea, tab);
}

// Fallback static content (your existing content)
function getFallbackContent(concernArea, tab) {
	if (tab === "日主特性") {
		if (concernArea === "財運") {
			return `丙火坐寅得長生，時柱乙未雙印生身，形成「身強印旺」之格局，火旺土燥之勢明顯。

優勢在於決策迅捷，火性炎上，敏銳善捕捉新興財機，己土傷官助力顯著。

然而，劣勢亦不容忽視，土重導致資金周轉率低，財運受滯；火克金失衡，易引發衝動投資之患。

調候之急務在於「金水相生」，以平衡格局，抑制木火過旺之擴張欲，方能穩固根基，化劣為優。`;
		} else if (concernArea === "事業") {
			return `甲木生於春月得時，坐支寅木得地，藏甲丙戊三神，賦予創新思維、執行力強兩大優勢；然木過旺易沖動、缺乏耐性兩項劣勢。

全局金弱制木不力，調候需金來修剪，長期策略宜發展需要創意與變通的行業，避免過於保守的傳統領域。`;
		} else if (concernArea === "健康") {
			return `乙木生於秋令，坐支酉金克身，形成「木金相戰」格局，賦予意志堅韌、適應力強兩項優勢；然易緊張焦慮、消化系統敏感兩項劣勢。

全局土重濕重，調候急需火來暖局燥土，長期策略重在情志調養與規律作息。`;
		} else if (concernArea === "感情") {
			return `丁火生於冬月，坐支子水沖剋，形成「水火既濟」格局，賦予感情豐富、直觀敏銳兩項優勢；然易情緒波動、過度敏感兩項劣勢。

全局水旺火弱，調候需木來通關生火，長期策略在於培養穩定情緒與理性溝通能力。`;
		}
	}

	if (tab === "middle") {
		if (concernArea === "財運") {
			return `【財星核心】
正財辛金，透於月干，為核心財源（薪資、正業收入）。然辛金：
• 弱：僅得未土（月支）微根，且未為燥土生金乏力
• 受克：被年干己土（傷官）泄氣，被日主丙火（劫財特性）猛烈克制（丙辛合克）
• 無生：全局缺強金（比助）、水（官殺護財）

【結論】正財根基不穩，易被爭奪、克損、遲滯。偏財不顯。

【生財之源】
己土（年干傷官）、未土（月支藏己丁乙，主氣己土傷官）、寅中戊土（食神）。食傷旺代表有才華、點子、技術、服務能力，是生財的資本。

關鍵問題：火旺土燥，焦土難生金（財）

【十神互動關鍵】
• 印星（乙木）：生身間接加劇克財，雖主貴人助力，但方式間接
• 傷官（己土）：才華創新，是生財關鍵，但易惹是非
• 比劫（丙火）：奪財最凶之神！體現為競爭對手、合夥爭利

【財運格局核心】食傷生財但財弱受克，比劫虎視眈眈`;
		} else if (concernArea === "事業") {
			return `【事業根基】
日支寅木為事業根基，藏甲丙戊三神，象徵創新活力與執行能力並重的根基特質。

【十神解析】
• 比肩+日支：主創業精神，利新興科技行業
• 食神+時支：主技術才華，風險在於好高騖遠  
• 偏印+年支：主變通能力，矛盾點在於缺乏持續性

【結論】全局呈現「木旺金弱缺制衡」複雜格局，創意有餘而執行力待加強。`;
		} else if (concernArea === "健康") {
			return `【健康根基】
日支酉金為健康根基，藏辛金主氣，象徵呼吸系統與免疫調節的根基特質。

【十神解析】
• 七殺+日支：主免疫力，利強化體質方向
• 偏財+月支：主代謝功能，風險警示在於過度消耗
• 傷官+時支：主神經系統，矛盾點在於易緊張焦慮

【結論】全局呈現「金木相戰需調和」複雜格局，重在平衡陰陽氣血。`;
		} else if (concernArea === "感情") {
			return `【感情根基】
日支子水為感情根基，藏癸水主氣，象徵情感深度與直覺敏銳的根基特質。

【十神解析】  
• 正官+日支：主責任感，利穩定關係方向
• 偏印+月支：主直覺力，風險警示在於過度猜疑
• 食神+時支：主表達能力，矛盾點在於情緒化表達

【結論】全局呈現「水火需既濟調和」複雜格局，感情豐富但需理性引導。`;
		}
	}

	if (tab === "right") {
		if (concernArea === "財運") {
			return `【財星本體】
金（辛金正財 - 核心，庚金偏財 - 弱或不顯）

【財星狀態】  
辛金正財 - 虛透、弱、受克（丙火克、己土泄）。如同脆弱的金屬暴露在熔爐（火局）旁，隨時有被熔毀風險。

【財源】
食傷土旺（己、未、戊） - 代表技能、創意、服務、付出。但受制於火旺土燥不生金和火旺直接熔金雙重打壓。

【破財之源】
比劫火旺（丙火日主、流年巳火） - 直接劫奪財星金

【調候關鍵】
水（官殺/調候） - 制火護金，潤土生金，通關水火，護財穩局
強金（庚申酉） - 助辛抗火

【財運特質】
• 正財為主，偏財難求：宜專注本職、專業技能獲取正財
• 勞碌求財，周轉不靈：付出多但回報易被克奪遲滯  
• 不動產雙刃劍：土重可視為潛在資產，但流動性差
• 合作風險高：比劫奪財特性，合夥借貸易引發財務糾紛`;
		} else if (concernArea === "事業") {
			return `【財星本質】
正偏財屬性以金為主，食傷土為生財之源

【生財機制與問題】
木旺金弱導致「大樹難成材需修剪」核心矛盾

【策略】適合創意設計行業，亟需金來平衡破解「創意有餘執行不足」三維困局`;
		} else if (concernArea === "健康") {
			return `【調候需求】
水火既濟，金木相和

【病源關鍵】
金木相戰易致呼吸與神經系統失調，土重濕滯影響脾胃運化

【健康策略】
春養肝、夏養心、長夏養脾、秋養肺、冬養腎，順應五行生剋調養身心`;
		} else if (concernArea === "感情") {
			return `【感情本體】
水火既濟格局，官殺水為配偶星

【感情狀態】
水火相沖如冰火兩重天，感情豐富但易波動，配偶星受日主火克制風險需注意

【感情來源】  
正官水代表穩定關係但受制於火旺克水

【破感之源】
比劫火旺易與人爭奪感情，傷官土重易口舌傷情

【調候關鍵】
木（通關） - 化水生火，調和矛盾
土（食傷） - 表達情感，但需適度

【感情特質】
• 感情豐富深邃：水主情感，層次豐富但易多變
• 表達直接熱烈：火主表達，真誠熱情但易衝動  
• 需要情感滋養：水火平衡時最佳，一方偏強易失衡`;
		}
	}

	return "分析內容生成中...";
}

export function MingJu({ userInfo, currentYear }) {
	const [selectedTab, setSelectedTab] = useState("日主特性");
	const [tabContent, setTabContent] = useState("");
	const [loading, setLoading] = useState(false);
	const concern = userInfo.concern || "財運";

	useEffect(() => {
		async function getContent() {
			setLoading(true);
			try {
				const content = await generateMingJuAnalysis(
					{ ...userInfo, currentYear },
					selectedTab
				);
				setTabContent(content);
			} catch (error) {
				console.error("Error generating content:", error);
				setTabContent("內容載入失敗，請稍後再試。");
			} finally {
				setLoading(false);
			}
		}
		getContent();
	}, [selectedTab, userInfo, currentYear]);

	return (
		<div className="max-w-4xl p-8 mx-auto bg-white shadow-lg rounded-xl">
			{/* Header Title */}
			<div className="mb-8 text-center">
				<h2 className="text-2xl font-bold text-[#B4003C] mb-2">
					{getTabLabel(selectedTab, concern)}
				</h2>
			</div>

			{/* Tabs */}
			<div className="flex items-center justify-between px-4 mb-8">
				{TABS.map((tab) => {
					const isSelected = selectedTab === tab;
					const label = getTabLabel(tab, concern);
					const imgSrc = getTabImg(tab, concern);
					const bgColor = getTabBg(tab, concern, isSelected);
					const imgColor = getTabImgColor(tab, concern, isSelected);

					return (
						<div key={tab} className="flex flex-col items-center">
							<button
								className="flex flex-col items-center justify-center transition-all duration-200 hover:scale-105"
								style={{
									width: 90,
									height: 90,
									borderRadius: "50%",
									backgroundColor: bgColor,
									boxShadow: isSelected
										? "0 4px 16px rgba(0,0,0,0.1)"
										: "0 2px 8px rgba(0,0,0,0.05)",
								}}
								onClick={() => setSelectedTab(tab)}
							>
								<Image
									src={imgSrc}
									alt={label}
									width={32}
									height={32}
									style={{
										filter: isSelected
											? "brightness(0) invert(1)"
											: `brightness(0) saturate(100%) invert(29%) sepia(67%) saturate(5988%) hue-rotate(345deg) brightness(92%) contrast(102%)`,
									}}
								/>
							</button>
							<span
								className="mt-3 text-sm font-semibold leading-tight text-center"
								style={{
									color: isSelected ? bgColor : "#666",
									maxWidth: 80,
								}}
							>
								{label}
							</span>
						</div>
					);
				})}
			</div>

			{/* Content Area */}
			<div className="mt-6">
				<div className="bg-[#EFEFEF] rounded-xl p-6 min-h-[300px]">
					{loading ? (
						<div className="flex items-center justify-center h-40">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B4003C]"></div>
							<span className="ml-3 text-gray-600">
								AI 分析中...
							</span>
						</div>
					) : (
						<div
							style={{
								fontFamily:
									"system-ui, -apple-system, sans-serif",
							}}
						>
							{(selectedTab === "middle" ||
								selectedTab === "right") &&
							concern === "財運" ? (
								renderStructuredContent(concern, selectedTab)
							) : (
								<div className="text-base leading-relaxed text-gray-800 whitespace-pre-line">
									{tabContent}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
