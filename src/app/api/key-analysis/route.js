import { NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Enhanced BaZi data access with fallbacks
const getBaziInfo = (baziData, field, fallback = "未知") => {
	if (!baziData) return fallback;
	return baziData[field] || fallback;
};

const getBaziPillars = (pillarsData) => {
	if (!pillarsData || !Array.isArray(pillarsData)) {
		return {
			year: { heavenly: "甲", earthly: "子" },
			month: { heavenly: "乙", earthly: "丑" },
			day: { heavenly: "丙", earthly: "寅" },
			hour: { heavenly: "丁", earthly: "卯" },
		};
	}

	return {
		year: pillarsData[0] || { heavenly: "甲", earthly: "子" },
		month: pillarsData[1] || { heavenly: "乙", earthly: "丑" },
		day: pillarsData[2] || { heavenly: "丙", earthly: "寅" },
		hour: pillarsData[3] || { heavenly: "丁", earthly: "卯" },
	};
};

const parseKeyAnalysisResponse = (text) => {
	console.log("📋 Parsing key analysis response:", text);

	try {
		// Clean the text first
		let cleanedText = text
			.replace(/```json\n?/g, "")
			.replace(/```\n?/g, "")
			.trim();

		// First, try to parse as JSON
		const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			try {
				const parsedData = JSON.parse(jsonMatch[0]);
				if (
					parsedData.fiveElementsCompatibility &&
					parsedData.fiveElementsCompatibility.female &&
					parsedData.fiveElementsCompatibility.male
				) {
					// Validate that we have meaningful content
					const femaleDesc =
						parsedData.fiveElementsCompatibility.female.description;
					const maleDesc =
						parsedData.fiveElementsCompatibility.male.description;

					if (
						femaleDesc &&
						femaleDesc.length > 50 &&
						maleDesc &&
						maleDesc.length > 50
					) {
						console.log(
							"✅ Successfully parsed JSON response with valid content"
						);
						return {
							...parsedData,
							fiveElementsCompatibility: {
								...parsedData.fiveElementsCompatibility,
								icons: {
									female: "🌊",
									male: "💧",
									compatibility: "⚖️",
								},
							},
						};
					}
				}
			} catch (e) {
				console.log(
					"❌ JSON parsing failed, falling back to structured fallback:",
					e.message
				);
			}
		}

		// Fallback to text parsing
		const lines = text.split("\n").filter((line) => line.trim());

		// Initialize data structure
		const result = {
			fiveElementsCompatibility: {
				female: { dayMaster: "", description: "" },
				male: { dayMaster: "", description: "" },
				overallEnergy: "",
				complementarity: "",
				essence: "能量互補而非不平衡",
				icons: { female: "🌊", male: "💧", compatibility: "⚖️" },
			},
			spouseStarStatus: {
				userStatus: "",
				partnerConfiguration: "",
				analysis: "",
				recommendation: "",
			},
			attentionNeededConfigurations: {
				potentialIssues: [],
				description: "易放大矛盾，但視為可調整的能量點",
				adjustmentApproach: "通過五行調和平衡能量流動",
			},
		};

		let currentSection = "";

		for (const line of lines) {
			const trimmed = line.trim();

			// Skip empty lines and metadata
			if (!trimmed || trimmed.includes("```")) continue;

			// Detect sections
			if (trimmed.includes("五行互補性")) {
				currentSection = "fiveElements";
				continue;
			} else if (
				trimmed.includes("夫星狀態") ||
				trimmed.includes("妻星狀態")
			) {
				currentSection = "spouseStar";
				continue;
			} else if (trimmed.includes("需注意的配置")) {
				currentSection = "attention";
				continue;
			}

			// Parse content based on current section
			if (currentSection === "fiveElements") {
				if (trimmed.includes("用戶日主") || trimmed.includes("女方")) {
					const dayMasterMatch = trimmed.match(
						/([甲乙丙丁戊己庚辛壬癸][水火木金土])/
					);
					if (dayMasterMatch) {
						result.fiveElementsCompatibility.female.dayMaster =
							dayMasterMatch[1];
					}
					// Extract description after day master
					const descMatch = trimmed.match(/[：:]\s*(.+)/);
					if (descMatch) {
						result.fiveElementsCompatibility.female.description =
							descMatch[1];
					}
				} else if (
					trimmed.includes("伴侶日主") ||
					trimmed.includes("男方")
				) {
					const dayMasterMatch = trimmed.match(
						/([甲乙丙丁戊己庚辛壬癸][水火木金土])/
					);
					if (dayMasterMatch) {
						result.fiveElementsCompatibility.male.dayMaster =
							dayMasterMatch[1];
					}
					const descMatch = trimmed.match(/[：:]\s*(.+)/);
					if (descMatch) {
						result.fiveElementsCompatibility.male.description =
							descMatch[1];
					}
				} else if (trimmed.includes("整體能量")) {
					result.fiveElementsCompatibility.overallEnergy =
						trimmed.replace(/整體能量[：:]?\s*/, "");
				} else if (
					trimmed.includes("互補") ||
					trimmed.includes("調和")
				) {
					result.fiveElementsCompatibility.complementarity = trimmed;
				}
			} else if (currentSection === "spouseStar") {
				if (trimmed.includes("正官") || trimmed.includes("配偶")) {
					result.spouseStarStatus.userStatus = trimmed;
				} else if (
					trimmed.includes("日支") ||
					trimmed.includes("相刑")
				) {
					result.spouseStarStatus.partnerConfiguration = trimmed;
				} else if (
					trimmed.includes("根基") ||
					trimmed.includes("摩擦")
				) {
					result.spouseStarStatus.analysis = trimmed;
				}
			} else if (currentSection === "attention") {
				if (
					trimmed.includes("食神") ||
					trimmed.includes("劫財") ||
					trimmed.includes("制殺")
				) {
					result.attentionNeededConfigurations.potentialIssues.push(
						trimmed
					);
				}
			}
		}

		// Ensure we have some default values
		if (!result.fiveElementsCompatibility.female.dayMaster) {
			result.fiveElementsCompatibility.female.dayMaster = "壬水";
			result.fiveElementsCompatibility.female.description =
				"月柱戊貴-食神制殺";
		}
		if (!result.fiveElementsCompatibility.male.dayMaster) {
			result.fiveElementsCompatibility.male.dayMaster = "癸水";
			result.fiveElementsCompatibility.male.description =
				"時柱壬子-水勁財旺";
		}
		if (!result.fiveElementsCompatibility.overallEnergy) {
			result.fiveElementsCompatibility.overallEnergy =
				"火土強 vs. 金水旺";
		}
		if (!result.fiveElementsCompatibility.complementarity) {
			result.fiveElementsCompatibility.complementarity =
				"金水調和火土，形成流通";
		}
		if (!result.spouseStarStatus.userStatus) {
			result.spouseStarStatus.userStatus = "正官戊土坐寅木長生位";
			result.spouseStarStatus.partnerConfiguration =
				"日支未土與用戶戌土相刑";
			result.spouseStarStatus.analysis =
				"配偶根基穩固，但可能引發摩擦，可通過調和緩解";
		}
		if (result.attentionNeededConfigurations.potentialIssues.length === 0) {
			result.attentionNeededConfigurations.potentialIssues = [
				"食神制殺導致要求過高",
				"劫財旺影響金錢觀念",
				"水過旺容易情緒波動",
			];
		}

		console.log("📊 Final parsed key analysis result:", result);
		return result;
	} catch (error) {
		console.error("❌ Error parsing key analysis response:", error);

		return {
			fiveElementsCompatibility: {
				female: {
					dayMaster: "壬水",
					description: "月柱戊貴-食神制殺",
				},
				male: {
					dayMaster: "癸水",
					description: "時柱壬子-水勁財旺",
				},
				overallEnergy: "火土強 vs. 金水旺",
				complementarity: "金水調和火土，形成流通",
				essence: "能量互補而非不平衡",
				icons: {
					female: "🌊",
					male: "💧",
					compatibility: "⚖️",
				},
			},
			spouseStarStatus: {
				userStatus: "正官戊土坐寅木長生位",
				partnerConfiguration: "日支未土與用戶戌土相刑",
				analysis: "配偶根基穩固，但可能引發摩擦，可通過調和緩解",
				recommendation: "加強土元素穩定性，減少相刑影響",
			},
			attentionNeededConfigurations: {
				potentialIssues: [
					"食神制殺導致要求過高",
					"劫財旺影響金錢觀念",
					"水過旺容易情緒波動",
				],
				description: "易放大矛盾，但視為可調整的能量點",
				adjustmentApproach: "通過五行調和平衡能量流動",
			},
		};
	}
};


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		const requestData = await request.json();
		console.log("🔍 Key Analysis API - Received request:", requestData);

		const {
			femaleUser,
			maleUser,
			femaleBazi,
			maleBazi,
			femalePillars,
			malePillars,
		} = requestData;

		if (!femaleUser || !maleUser) {
			return NextResponse.json(
				{ error: "Missing user data" },
				{ status: 400 }
			);
		}

		// Check if we have basic user information for analysis
		const hasFemaleBasicInfo = femaleUser.birthday && femaleUser.gender;
		const hasMaleBasicInfo = maleUser.birthday && maleUser.gender;

		if (!hasFemaleBasicInfo || !hasMaleBasicInfo) {
			return NextResponse.json(
				{ error: "Missing birthday or gender information" },
				{ status: 400 }
			);
		}

		// Get BaZi information with fallbacks - but we can analyze with basic info
		const femaleBaziInfo = getBaziInfo(femaleBazi, "name", "female");
		const maleBaziInfo = getBaziInfo(maleBazi, "name", "male");

		const femalePillarsInfo = getBaziPillars(femalePillars);
		const malePillarsInfo = getBaziPillars(malePillars);

		console.log("📊 BaZi Data:", {
			femaleBaziInfo,
			maleBaziInfo,
			femalePillarsInfo,
			malePillarsInfo,
		});

		// Create structured prompt for key analysis
		const prompt = `你是專業的八字命理師，請為這對情侶提供關鍵分析。

**情侶資料：**
女方：${femaleUser.name}
- 出生日期：${femaleUser.birthday}
- 性別：${femaleUser.gender}
- 八字資料：${femaleBazi ? "已提供詳細八字" : "基於出生日期進行分析"}

男方：${maleUser.name}  
- 出生日期：${maleUser.birthday}
- 性別：${maleUser.gender}
- 八字資料：${maleBazi ? "已提供詳細八字" : "基於出生日期進行分析"}

請以JSON格式回應，提供完整的關鍵分析：

{
  "fiveElementsCompatibility": {
    "female": {
      "dayMaster": "[女方日主如壬水]",
      "description": "[完整的女方八字特質分析，包含優缺點和建議，至少150字]"
    },
    "male": {
      "dayMaster": "[男方日主如癸水]", 
      "description": "[完整的男方八字特質分析，包含優缺點和建議，至少150字]"
    },
    "overallEnergy": "[整體能量描述如火土強 vs. 金水旺]",
    "complementarity": "[具體的互補分析，解釋如何相互平衡，至少100字]",
    "essence": "能量互補而非不平衡"
  },
  "spouseStarStatus": {
    "userStatus": "[女方夫星完整分析，包含正官配置和影響，至少100字]",
    "partnerConfiguration": "[男方妻星完整分析，包含配置和可能問題，至少100字]", 
    "analysis": "[整體夫妻星配置分析，包含互動關係和建議，至少150字]",
    "recommendation": "[具體調和建議]"
  },
  "attentionNeededConfigurations": {
    "potentialIssues": ["具體問題1", "具體問題2", "具體問題3"],
    "description": "[問題的整體描述和影響]",
    "adjustmentApproach": "[具體的調整方法和步驟]"
  }
}

**重要要求：**
- 基於提供的出生日期和性別信息進行專業分析
- 即使沒有完整八字，也要根據生日推算基本五行特質
- 所有description字段必須是完整的段落，不能有"無法分析"或"資料缺失"
- 每個分析要具體實用，提供有價值的關係建議
- 強調互補性和解決方案，而非負面描述
- 用專業但易懂的語言，避免過於技術性的術語
- 確保所有內容完整且有意義，不能出現"需要更多資料"的說法

請基於他們的出生信息，提供專業的關鍵分析，重點關注性格特質、關係互補性和實用建議。`;

		console.log("📤 Sending prompt to DeepSeek:", prompt);

		// Make API call to DeepSeek
		const response = await fetch(DEEPSEEK_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
			},
			body: JSON.stringify({
				model: "deepseek-chat",
				messages: [
					{
						role: "system",
						content:
							"你是專業的八字命理師，擅長分析八字配對和五行互補關係，提供準確的關鍵分析。",
					},
					{
						role: "user",
						content: prompt,
					},
				],
				max_tokens: 2000,
				temperature: 0.7,
			}),
		});

		if (!response.ok) {
			console.error(
				"❌ DeepSeek API error:",
				response.status,
				response.statusText
			);
			throw new Error(`DeepSeek API error: ${response.status}`);
		}

		const data = await response.json();
		console.log("✅ DeepSeek API response:", data);

		const aiResponse = data.choices?.[0]?.message?.content || "";
		console.log("🤖 AI Response:", aiResponse);

		// Parse the response
		const parsedResult = parseKeyAnalysisResponse(aiResponse);
		console.log("📋 Parsed key analysis result:", parsedResult);

		return NextResponse.json(parsedResult);
	} catch (error) {
		console.error("❌ Key Analysis API error:", error);

		// Return fallback data on error
		return NextResponse.json({
			fiveElementsCompatibility: {
				female: {
					dayMaster: "壬水",
					description:
						"您的八字以壬水日主為命格基礎，具有靈活變通的特質，善於適應環境變化。壬水如江河般寬廣包容，在感情中能夠體諒伴侶的不同想法。不過，您的八字中若缺少木元素疏通，可能在表達情感時顯得過於直接或理性化，建議透過增加綠色植物、參與自然活動等方式來補充木氣，有助於提升溫柔體貼的一面。您的感性需要透過藝術創作或音樂來喚醒，這樣能讓伴侶感受到更多情感層次。",
				},
				male: {
					dayMaster: "癸水",
					description:
						"您以癸水日主為命格核心，天性溫和內斂，富有同情心和包容力。癸水如甘露般細膩溫潤，在感情中總是默默付出，善於感受伴侶的情緒變化。您的八字若木氣充足，能有效疏通感情中的僵局，為關係帶來創造力與靈活性。在感情中您扮演調和者角色，善於化解矛盾。建議保持這種平衡特質，同時在關鍵時刻展現更多主導力和決斷力，讓伴侶感受到您的堅定支持與可靠感。",
				},
				overallEnergy: "火土強勢 vs. 金水流通",
				complementarity:
					"你們的五行配置呈現出動態平衡的特質，男方金水可調和女方火土的燥熱，女方火土可穩定男方金水的浮動性。這種互補關係如同水潤大地、大地承載江河，形成自然和諧的能量循環。你們的差異正是關係的優勢所在。",
				essence: "能量互補而非不平衡",
				icons: {
					female: "🌊",
					male: "💧",
					compatibility: "⚖️",
				},
			},
			spouseStarStatus: {
				userStatus:
					"女方夫星配置中，若正官為戊土且坐長生位（如戊寅日），象徵配偶具有成長性與責任感，能在事業與家庭間找到平衡點。這種配置顯示您的伴侶具有長期發展潛力，且能在關係中承擔應有責任。若逢天乙貴人星，更強化婚姻穩定性，代表伴侶能在關鍵時刻提供智慧指導和情感支持。",
				partnerConfiguration:
					"男方妻星配置中，若正財星與日支形成特殊組合，可能在價值觀與金錢使用上需要更多溝通協調，特別是對於生活品質標準的不同看法。不過這種差異可以透過互相理解和溝通來化解，甚至轉化為互補優勢，建立更豐富的生活模式。",
				analysis:
					"整體而言，你們的夫妻星配置顯示雙方都具備長期承諾的特質，能夠在關係中形成良好的互補效應。需要注意的是在價值觀磨合期要保持耐心，透過五行調和的方式來緩解潛在摩擦。建議你們可以共同參與一些土元素相關的活動，或在居家環境中加入適當的金屬元素裝飾，有助於平衡能量場。",
				recommendation:
					"建議加強土元素穩定性，在家中西南方位放置陶瓷擺件或暖色調裝飾，同時可透過佩戴金屬飾品來調和能量，創造更和諧的關係氛圍。",
			},
			attentionNeededConfigurations: {
				potentialIssues: [
					"過度理性化可能影響情感表達的溫度",
					"價值觀差異需要更多溝通協調",
					"能量流動需要適當的疏通管道",
				],
				description:
					"這些配置特點容易被誤解為問題，但實際上它們是可以調整和優化的能量點，透過正確的方法可以轉化為關係優勢。",
				adjustmentApproach:
					"透過五行調和平衡能量流動，增加木元素疏通（如綠色植物、自然活動），加強土元素穩定（如陶瓷用品、溫暖色調），建立規律的溝通習慣來優化關係動態。",
			},
		});
	}
}
