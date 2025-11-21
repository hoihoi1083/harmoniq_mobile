import { NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	try {
		// Check if request has a body
		const requestText = await request.text();
		if (!requestText) {
			console.error("Empty request body received");
			return NextResponse.json(
				{ error: "Empty request body" },
				{ status: 400 }
			);
		}

		// Parse JSON safely
		let body;
		try {
			body = JSON.parse(requestText);
		} catch (parseError) {
			console.error(
				"JSON parse error:",
				parseError.message,
				"Body:",
				requestText
			);
			return NextResponse.json(
				{ error: "Invalid JSON in request body" },
				{ status: 400 }
			);
		}

		const { userInfo, wuxingData } = body;

		if (!userInfo || !wuxingData) {
			return NextResponse.json(
				{
					error: "Missing required parameters: userInfo or wuxingData",
				},
				{ status: 400 }
			);
		}

		const prompt = `你是資深的八字命理師，需要根據用戶的完整命理信息，提供人際調衡要點的綜合分析。

用戶信息：
- 姓名：${userInfo.name}
- 性別：${userInfo.gender === "male" ? "男" : "女"}
- 出生日期：${userInfo.birthDate}
- 出生時間：${userInfo.birthTime}
- 出生地點：${userInfo.location}
- 五行數據：${JSON.stringify(wuxingData)}

請根據命理分析提供人際調衡要點，按以下三個層面分析：

**個人關係**
- 婚戀配對：根據五行分析適合的伴侶類型和配對禁忌
- 家庭關係：與不同年份出生的家人關係特質
- 交友圈層：適合結交的朋友類型和社交策略

**職場協作**
- 領導風格：分析個人的管理特質和領導方式
- 團隊配合：與不同屬性同事的合作模式和注意事項
- 衝突化解：處理職場矛盾的具體方法和最佳時機

**社交網絡**
- 人脈建構：擴展人際網絡的策略和適合的場合
- 溝通技巧：個人溝通風格的優勢和改進建議
- 聚會參與：適合的社交活動類型和參與時機

行文規範：
① 術語系統：嚴格採用「十神（正官/食神等）+五行+干支」表述，禁用生肖、星座等外圍概念
② 數據錨點：所有建議需關聯命理參數（如「因原局[干支]逢[地支三合]故...」）
③ 實操導向：每條建議須可執行（如精確到「辰時面西而立」而非籠統提示）

請以溫暖、專業的語調提供建議，每個要點都要具體且可執行。
返回格式必須是純JSON，包含以下結構：
{
    "personalRelationships": {
        "romanticCompatibility": "婚戀配對建議",
        "familyDynamics": "家庭關係建議",
        "friendshipCircle": "交友圈層建議",
        "detailed": "詳細個人關係分析"
    },
    "workplaceCollaboration": {
        "leadershipStyle": "領導風格分析",
        "teamDynamics": "團隊配合建議",
        "conflictResolution": "衝突化解方法",
        "detailed": "詳細職場協作分析"
    },
    "socialNetworking": {
        "networkBuilding": "人脈建構策略",
        "communicationSkills": "溝通技巧建議",
        "socialGatherings": "聚會參與指導",
        "detailed": "詳細社交網絡分析"
    }
}`;

		// Try to call DeepSeek API
		try {
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
							role: "user",
							content: prompt,
						},
					],
					temperature: 0.7,
					max_tokens: 1500,
				}),
			});

			if (!response.ok) {
				throw new Error(`DeepSeek API error: ${response.status}`);
			}

			const data = await response.json();
			const content = data.choices[0]?.message?.content;

			if (!content) {
				throw new Error("No content received from DeepSeek API");
			}

			// Clean the response - remove markdown formatting if present
			let cleanedContent = content;
			if (content.includes("```json")) {
				cleanedContent = content
					.replace(/```json\s*/g, "")
					.replace(/\s*```/g, "");
			} else if (content.includes("```")) {
				cleanedContent = content
					.replace(/```\s*/g, "")
					.replace(/\s*```/g, "");
			}

			// Try to parse JSON response
			let analysisResult;
			try {
				analysisResult = JSON.parse(cleanedContent);
			} catch (parseError) {
				console.error("Error parsing AI response:", parseError);
				console.error("Raw content:", content);
				console.error("Cleaned content:", cleanedContent);
				throw new Error("Invalid JSON response from AI");
			}

			// Validate required fields
			const requiredFields = [
				"personalRelationships",
				"workplaceCollaboration",
				"socialNetworking",
			];
			for (const field of requiredFields) {
				if (!analysisResult[field]) {
					throw new Error(`Missing required field: ${field}`);
				}
			}

			return NextResponse.json({
				success: true,
				analysis: analysisResult,
			});
		} catch (aiError) {
			console.error("AI API Error:", aiError);

			// Fallback content based on your exact specification
			const fallbackContent = {
				personalRelationships: {
					romanticCompatibility:
						"婚恋宜选丙火或乙木为伴侣，土性配偶能安土于心；避开辛酉庚申年谈婚论嫁，见金必伤木。",
					familyDynamics:
						"与己卯戊寅年生的长辈关系和谐，木土相生利家宅；与纯庚申年生的人谨慎交往，金克木有争执。",
					friendshipCircle:
						"结交己土、癸水命的人作为平衡，他们能抑制你的冲动并提供情感支持；丙火朋友会激发创意，甲木朋友适合商业合作。",
					detailed:
						"你的木命天性热情外向，但有时会过度表达情绪。在人际关系中，你要懂得收放有度。与土性的人相处时能得到踏实感，他们的稳重能平衡你的躁动；与水性的人在一起时思路更清晰，他们的智慧能指导你做出明智的决策。避开金性过强的人，因为他们的严苛会压抑你的本性；也要小心火性太旺的人，虽然有共鸣但易结党营私。",
				},
				workplaceCollaboration: {
					leadershipStyle:
						"团队管理中发挥木的包容性，协调各方资源；决策时要避免固执己见，多听取水系（癸日、壬日）同事的理性分析。",
					teamDynamics:
						"与土系（戊己日）同事配合默契，适合长期项目；与金系（庚辛日）同事合作需明确分工避免摩擦；火系（丙丁日）同事能激发创意但要控制节奏。",
					conflictResolution:
						"面对争执时不要硬碰硬，运用木的柔韧特质化解矛盾；重要会议安排在卯时或辰时，有利于木气流通。",
					detailed:
						"在职场中，你的领导风格偏向启发和包容，能够调动团队的积极性。但有时会因为心软而在决策上摇摆不定，这时需要土系同事的踏实建议或者水系同事的理性分析。与不同属性的同事合作时要采用不同的策略：土系同事适合做执行层面的配合，他们能够将你的创意落地；金系同事适合做监督和质检，但要避免在项目初期就过多介入；火系同事能够带来激情和动力，但要防止项目进度失控；水系同事在战略规划方面能给出很好的建议。",
				},
				socialNetworking: {
					networkBuilding:
						"利用木的亲和力扩展人脉，参加文化艺术活动能遇到志同道合者；避开纯商业性质的金融聚会，气场不合。",
					communicationSkills:
						"表达时要点到为止，避免过度说教；倾听他人意见时展现包容性，这是你的天然优势。",
					socialGatherings:
						"春夏季聚会参与度要高，秋冬季适当低调；聚会场所选择有绿植的环境，有利于你发挥个人魅力。",
					detailed:
						"你天生具有良好的沟通能力和亲和力，在社交场合中很容易成为焦点。但要注意，不是所有的场合都适合你发挥。在文化艺术类的聚会中，你的创意思维和包容心态会很受欢迎；在教育培训类的活动中，你的启发式表达能给他人带来收获。但在纯商业或金融类的聚会中，你可能会感到格格不入，因为这些场合过于注重利益得失。建议你在社交时选择合适的时间和场所，春季(卯月)和夏季(午月)是你的社交旺季，秋季(申酉月)要适当低调。",
				},
			};

			return NextResponse.json({
				success: true,
				analysis: fallbackContent,
			});
		}
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
