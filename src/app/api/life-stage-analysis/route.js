import { NextRequest, NextResponse } from "next/server";
import getWuxingData from "../../../lib/nayin.js";
import {
	generateCacheKey,
	getCachedResult,
	waitForPendingRequest,
	createPendingRequest,
	cacheResult,
	resolvePendingRequest,
	rejectPendingRequest,
} from "../../../lib/apiCache.js";


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function POST(request) {
	// Add request ID for better tracking
	const requestId = Math.random().toString(36).substring(2, 15);
	let cacheKey = null;
	let resolvePending = null;
	let rejectPending = null;

	try {
		const body = await request.json();
		const { pillarType, stage, pillarData, userInfo, prompt } = body;

		if (!userInfo || !pillarType || !stage) {
			return NextResponse.json(
				{ error: "Missing required information" },
				{ status: 400 }
			);
		}

		// 🚨 GLOBAL CACHE IMPLEMENTATION
		cacheKey = generateCacheKey("life-stage-analysis", userInfo, {
			pillarType,
			stage,
		});
		console.log(`[${requestId}] Cache key: ${cacheKey}`);

		// Check if result already cached
		const cachedResult = getCachedResult(cacheKey, requestId);
		if (cachedResult) {
			return NextResponse.json(cachedResult);
		}

		// Check if request is already pending
		const pendingResult = await waitForPendingRequest(cacheKey, requestId);
		if (pendingResult) {
			return NextResponse.json(pendingResult);
		}

		// Create pending promise for this request
		const pendingHandlers = createPendingRequest(cacheKey, requestId);
		resolvePending = pendingHandlers.resolvePending;
		rejectPending = pendingHandlers.rejectPending;

		// Debug: Check if API key exists
		if (!process.env.API_KEY) {
			console.error(
				`[${requestId}] API_KEY environment variable is not set`
			);
			return NextResponse.json(
				{ error: "API configuration error" },
				{ status: 500 }
			);
		}

		// Get wuxing data for context
		const wuxingData = getWuxingData(
			userInfo.birthDateTime,
			userInfo.gender
		);

		// Get specific pillar information
		let currentPillar = "";
		let currentStem = "";
		let currentBranch = "";
		let currentStemElement = "";
		let currentBranchElement = "";

		switch (pillarType) {
			case "年柱":
				currentPillar = wuxingData.year;
				currentStem = wuxingData.yearStem;
				currentBranch = wuxingData.yearBranch;
				currentStemElement = wuxingData.yearStemWuxing;
				currentBranchElement = wuxingData.yearBranchWuxing;
				break;
			case "月柱":
				currentPillar = wuxingData.month;
				currentStem = wuxingData.monthStem;
				currentBranch = wuxingData.monthBranch;
				currentStemElement = wuxingData.monthStemWuxing;
				currentBranchElement = wuxingData.monthBranchWuxing;
				break;
			case "日柱":
				currentPillar = wuxingData.day;
				currentStem = wuxingData.dayStem;
				currentBranch = wuxingData.dayBranch;
				currentStemElement = wuxingData.dayStemWuxing;
				currentBranchElement = wuxingData.dayBranchWuxing;
				break;
			case "時柱":
				currentPillar = wuxingData.hour;
				currentStem = wuxingData.hourStem;
				currentBranch = wuxingData.hourBranch;
				currentStemElement = wuxingData.hourStemWuxing;
				currentBranchElement = wuxingData.hourBranchWuxing;
				break;
		}

		// Create AI prompt for life stage analysis
		const aiPrompt = `
請根據以下用戶的八字信息，為${pillarType}（代表${stage}）提供深度的生活解讀。

用戶基本信息：
- 性別: ${userInfo.gender}
- 出生年月日時: ${userInfo.year || new Date(userInfo.birthDateTime).getFullYear()}年${userInfo.month || new Date(userInfo.birthDateTime).getMonth() + 1}月${userInfo.day || new Date(userInfo.birthDateTime).getDate()}日 ${userInfo.hour || new Date(userInfo.birthDateTime).getHours()}時

完整八字信息：
- 年柱: ${wuxingData.year} (天干:${wuxingData.yearStem}${wuxingData.yearStemWuxing}, 地支:${wuxingData.yearBranch}${wuxingData.yearBranchWuxing})
- 月柱: ${wuxingData.month} (天干:${wuxingData.monthStem}${wuxingData.monthStemWuxing}, 地支:${wuxingData.monthBranch}${wuxingData.monthBranchWuxing})  
- 日柱: ${wuxingData.day} (天干:${wuxingData.dayStem}${wuxingData.dayStemWuxing}, 地支:${wuxingData.dayBranch}${wuxingData.dayBranchWuxing}) - 日主
- 時柱: ${wuxingData.hour} (天干:${wuxingData.hourStem}${wuxingData.hourStemWuxing}, 地支:${wuxingData.hourBranch}${wuxingData.hourBranchWuxing})

當前分析的${pillarType}：
- 干支組合: ${currentPillar} (${currentStem}${currentBranch})
- 天干: ${currentStem}${currentStemElement}
- 地支: ${currentBranch}${currentBranchElement}
- 代表生活階段: ${stage}

**重要要求：**
1. 請嚴格按照以下JSON格式返回分析結果
2. 不要包含任何markdown代碼塊標記，直接返回純JSON
3. 所有字符串值都必須用雙引號包圍
4. 確保JSON格式完全正確，可以被JavaScript的JSON.parse()正確解析

**分析要求：**
基於${pillarType}${currentPillar}的組合，分析用戶在${stage}時期的特色：

1. **標題命名格式**：${pillarType}${currentPillar}：{主要特征描述}的${stage}
2. **白話解釋**：針對${stage}階段，用通俗易懂的語言解釋這個干支組合在此生活階段的具體表現（150-200字）
3. **生活舉例**：提供具體、貼近生活的例子說明這種特征如何在${stage}時期體現（80-120字）  
4. **深層智慧**：從命理角度分析這個組合的深層含義和人生啟示（120-150字）

請返回以下JSON格式：

{
  "title": "${pillarType}${currentPillar}：{特征描述}的${stage}",
  "content": "針對${stage}時期的詳細白話解釋，說明${currentStem}${currentStemElement}和${currentBranch}${currentBranchElement}的組合如何影響這個生活階段的具體表現...",
  "example": "具體的生活場景例子，生動描述這種特征在${stage}時期是如何體現的...",
  "wisdom": "從命理學角度分析這個組合的深層智慧和人生啟示，包括五行生克關係的影響..."
}

**注意事項：**
- 分析要基於真實的八字命理邏輯
- 內容要個人化，針對具體的干支組合
- 語言要通俗易懂，貼近現代生活
- 例子要具體生動，不能泛泛而談
- 確保JSON格式完全正確，不要有語法錯誤
`;

		// Make request to DeepSeek API
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

		const response = await fetch(
			"https://api.deepseek.com/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.API_KEY}`,
				},
				body: JSON.stringify({
					model: "deepseek-chat",
					messages: [
						{
							role: "system",
							content:
								"你是一位專業的命理分析師，精通八字命理和人生階段分析。請根據用戶的八字信息提供深度、個人化的生活階段解讀。重要：你必須返回有效的JSON格式，不要包含任何markdown標記或額外文本。所有字符串值必須用雙引號包圍，確保JSON格式完全正確。",
						},
						{
							role: "user",
							content: aiPrompt,
						},
					],
					temperature: 0.8,
					max_tokens: 2000,
					response_format: { type: "json_object" },
				}),
				signal: controller.signal,
			}
		);

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorText = await response.text();
			console.error(
				`[${requestId}] DeepSeek API Error:`,
				response.status,
				response.statusText,
				errorText
			);
			// Return fallback content instead of error
			return NextResponse.json({
				success: true,
				analysis: getFallbackLifeStageContent(pillarType, stage),
				aiGenerated: false,
				contentType: "fallback-data",
			});
		}

		const data = await response.json();
		let analysisContent = data.choices?.[0]?.message?.content;

		if (!analysisContent) {
			console.error(
				`[${requestId}] No content received from DeepSeek API`
			);
			return NextResponse.json({
				success: true,
				analysis: getFallbackLifeStageContent(pillarType, stage),
				aiGenerated: false,
				contentType: "fallback-data",
			});
		}

		// Clean the response to extract JSON
		analysisContent = analysisContent.trim();

		// Remove markdown code block markers if present
		if (analysisContent.startsWith("```json")) {
			analysisContent = analysisContent
				.replace(/^```json\s*/, "")
				.replace(/\s*```$/, "");
		} else if (analysisContent.startsWith("```")) {
			analysisContent = analysisContent
				.replace(/^```\s*/, "")
				.replace(/\s*```$/, "");
		}

		// Try to parse the JSON
		let analysis;
		try {
			analysis = JSON.parse(analysisContent);
		} catch (parseError) {
			console.error(
				`[${requestId}] Failed to parse AI response:`,
				parseError,
				"Content:",
				analysisContent.substring(0, 500)
			);
			// Return fallback content instead of error
			return NextResponse.json({
				success: true,
				analysis: getFallbackLifeStageContent(pillarType, stage),
				aiGenerated: false,
				contentType: "fallback-data",
			});
		}

		// Validate the analysis structure
		if (!analysis.title || !analysis.content) {
			console.error(
				`[${requestId}] Invalid analysis structure:`,
				analysis
			);
			return NextResponse.json({
				success: true,
				analysis: getFallbackLifeStageContent(pillarType, stage),
				aiGenerated: false,
				contentType: "fallback-data",
			});
		}

		const result = {
			success: true,
			analysis: analysis,
			aiGenerated: true,
			contentType: "ai-generated",
			timestamp: new Date().toISOString(),
			requestId: requestId,
		};

		// 🎯 CACHE THE SUCCESSFUL RESULT
		cacheResult(cacheKey, result, requestId);
		resolvePendingRequest(cacheKey, result, requestId, resolvePending);

		return NextResponse.json(result);
	} catch (error) {
		console.error(
			`[${requestId || "unknown"}] Life Stage Analysis API Error:`,
			error
		);

		// 🚨 CLEAN UP ON ERROR
		rejectPendingRequest(cacheKey, error, requestId, rejectPending);

		// Return fallback content instead of error
		return NextResponse.json({
			success: true,
			analysis: getFallbackLifeStageContent(
				body?.pillarType || "年柱",
				body?.stage || "童年"
			),
			aiGenerated: false,
			contentType: "fallback-data",
		});
	}
}

// Fallback content function based on the examples provided
function getFallbackLifeStageContent(pillarType, stage) {
	const fallbackContent = {
		年柱: {
			title: "年柱甲申：竞争与规则并存的童年",
			content:
				"你小时候的环境（家庭或学校）存在明显的竞争压力，比如兄弟姐妹比较成绩，或父母用严格标准要求你。同时生活中规则感很强，例如必须按时回家、作业错一题罚抄十遍等。",
			example:
				"就像玩游戏时，别人轻松过关，你却总被要求「先写完数学题才能玩」，这种约束让你早早就学会在压力下找方法。",
			wisdom: "智慧如地下暗流：指你天生会暗中观察、动脑筋解决问题。比如被父母禁止看电视，你会偷偷用电脑查资料完成作业来争取自由时间——这种「钻空子」不是叛逆，而是懂得灵活应对规则。",
		},
		月柱: {
			title: "月柱丁巳：才华耀眼但容易三分热度",
			content:
				"你青年时期（中学到大学）能力突出，像学新技能比同学快、比赛容易拿奖。但热情来得快去得快，可能今天想学画画，明天又迷上编程，最后都没坚持。",
			example:
				"就像参加社团时，你一周就能当上组长（火性爆发力），但三个月后觉得无聊就退社了（火旺难持久）。",
			wisdom: "火焚高木的警告：你像一棵长在火山边的树，长得快但易被烧伤。比如熬夜三天写完报告拿了高分（才华耀眼），结果感冒一周（消耗过度）。",
		},
		日柱: {
			title: "日柱丁酉：能力与压力互相成就",
			content:
				"你成年后靠实力赚钱（如专业技能、创意作品），但这些机会总伴随高压挑战。比如接到高薪项目，却要天天加班；或自己创业当老板，但每笔支出都心惊胆战。",
			example:
				"像你设计海报被客户夸赞（丁火发光），但改了20版才通过（酉金磨人）。",
			wisdom: "钗钏金的本质：你的价值像金首饰，需要被打磨才能闪耀。压力（客户挑剔/老板刁难）其实是让你更专业的「打磨工具」。",
		},
		時柱: {
			title: "时柱庚子：晚年要懂得放松与放手",
			content:
				"你老年可能地位高、说话有分量（如当了领导或家族长辈），但责任也更大，常为小事操心失眠。",
			example:
				"像退休后还被请去当顾问，既高兴被看重（庚金权威），又烦心年轻人不按你的方法做（子水暗忧）。",
			wisdom: "壁上土的提醒：这堵墙既是保护（比如存款够多不怕生病），也可能隔绝快乐（比如嫌旅游太累只在家发呆）。学会偶尔「拆墙」——像勉强同意儿女用新方法装修老房，反而发现效果不错。",
		},
	};

	return fallbackContent[pillarType] || fallbackContent["年柱"];
}
