"use client";
import { useEffect, useState, useRef } from "react";
import { get, post } from "@/lib/ajax";
import _ from "lodash";
import getWuxingData from "@/lib/nayin";
// 根据userId查询，如果查询到了，拿数据。否则生成随机数后，把结果存储到该userId下。

export default function useReportDoc(locale, userInfo) {
	const renderRef = useRef(true);
	const [loading, setLoading] = useState(true);
	const [reportDocData, setReportDocData] = useState(null);
	const [assistantData, setAssistantData] = useState({});
	// const { data: session } = useSession();

	useEffect(() => {
		console.log("renderRef.current", renderRef.current);
		// if (renderRef.current) {
		//     renderRef.current = false
		//     return
		// }
		const loadDesign = async () => {
			// console.log('loadDesign', session?.user?.userId, locale)
			const userId = userInfo?.userId;
			if (userId && locale) {
				const birthDateTime = userInfo.birthDateTime;
				console.log("查询用户已有报告");
				setLoading(true);

				const { status, data } = await get(
					`/api/reportUserDoc/${userId}/${locale == "zh-CN" ? "zh" : "tw"}`
				);
				if (status == 0 && data) {
					console.log("已有报告");
					//找到了用户已有报告
					if (userInfo.genStatus == "done") {
						if (
							!data.mingLiData ||
							!data.liuNianData ||
							!data.jiajuProData
						) {
							//这个用户已经是生成过报告了，但是没有进阶数据，说明上次生成的是另外一种语言，这次需要翻译
							//获取另一种语言的进阶数据，作为assistantData传给deepseek接口，来提高两种语言文案的一致程度
							const { status, data } = await get(
								`/api/reportUserDoc/${userId}/${locale == "zh-CN" ? "tw" : "zh"}`
							);
							if (status == 0 && data) {
								setAssistantData(data);
							}
						}
					}
					setReportDocData(data);
				} else {
					//找原始数据集
					const { data: zhData } = await get(`/api/reportDoc/zh`, {
						isCached: true,
					});
					const { data: twData } = await get(`/api/reportDoc/tw`, {
						isCached: true,
					});
					if (zhData && twData) {
						// Get complete wuxing calculation data
						const wuxingData = getWuxingData(
							birthDateTime,
							userInfo.gender
						);
						const {
							nayin,
							year,
							month,
							day: date,
							hour,
							// Get actual calculated elements for each pillar
							yearStem,
							yearStemWuxing,
							yearBranch,
							yearBranchWuxing,
							monthStem,
							monthStemWuxing,
							monthBranch,
							monthBranchWuxing,
							dayStem,
							dayStemWuxing,
							dayBranch,
							dayBranchWuxing,
							hourStem,
							hourStemWuxing,
							hourBranch,
							hourBranchWuxing,
						} = wuxingData;

						console.log("Using actual calculated elements:");
						console.log(
							"年柱:",
							year,
							`(天干:${yearStem}-${yearStemWuxing}, 地支:${yearBranch}-${yearBranchWuxing})`
						);
						console.log(
							"月柱:",
							month,
							`(天干:${monthStem}-${monthStemWuxing}, 地支:${monthBranch}-${monthBranchWuxing})`
						);
						console.log(
							"日柱:",
							date,
							`(天干:${dayStem}-${dayStemWuxing}, 地支:${dayBranch}-${dayBranchWuxing})`
						);
						console.log(
							"時柱:",
							hour,
							`(天干:${hourStem}-${hourStemWuxing}, 地支:${hourBranch}-${hourBranchWuxing})`
						);

						const random = Math.floor(Math.random() * 3);
						const jiajuRandom = Math.floor(Math.random() * 3);

						// Use calculated elements instead of generic strings
						// Create dynamic data based on actual calculated wuxing elements
						let zhReportData = {
							nianzhuData: generateDynamicPillarData(
								"年柱",
								yearStem,
								yearStemWuxing,
								yearBranch,
								yearBranchWuxing,
								zhData,
								random
							),
							yuezhuData: generateDynamicPillarData(
								"月柱",
								monthStem,
								monthStemWuxing,
								monthBranch,
								monthBranchWuxing,
								zhData,
								random
							),
							rizhuData: generateDynamicPillarData(
								"日柱",
								dayStem,
								dayStemWuxing,
								dayBranch,
								dayBranchWuxing,
								zhData,
								random
							),
							shizhuData: generateDynamicPillarData(
								"時柱",
								hourStem,
								hourStemWuxing,
								hourBranch,
								hourBranchWuxing,
								zhData,
								random
							),
							yunchengData:
								zhData?.yunchengData?.[nayin]?.[random] || {},
							jiajuData: getJiajuData(
								zhData.jiajuData,
								jiajuRandom
							),
						};
						let twReportData = {
							nianzhuData: generateDynamicPillarData(
								"年柱",
								yearStem,
								yearStemWuxing,
								yearBranch,
								yearBranchWuxing,
								twData,
								random
							),
							yuezhuData: generateDynamicPillarData(
								"月柱",
								monthStem,
								monthStemWuxing,
								monthBranch,
								monthBranchWuxing,
								twData,
								random
							),
							rizhuData: generateDynamicPillarData(
								"日柱",
								dayStem,
								dayStemWuxing,
								dayBranch,
								dayBranchWuxing,
								twData,
								random
							),
							shizhuData: generateDynamicPillarData(
								"時柱",
								hourStem,
								hourStemWuxing,
								hourBranch,
								hourBranchWuxing,
								twData,
								random
							),
							yunchengData:
								twData?.yunchengData?.[nayin]?.[random] || {},
							jiajuData: getJiajuData(
								twData.jiajuData,
								jiajuRandom
							),
						};
						const data =
							locale == "zh-CN" ? zhReportData : twReportData;
						setReportDocData(data);

						// ✅ FIXED: Check if documents already exist to preserve AI content
						// Only create new documents if they don't exist, to avoid overwriting AI content
						const checkAndSaveTemplate = async (
							lang,
							templateData
						) => {
							try {
								const { status } = await get(
									`/api/reportUserDoc/${userId}/${lang}`
								);
								if (status !== 0) {
									// Document doesn't exist, safe to create with template data
									console.log(
										`Creating new template document for ${lang}`
									);
									await post(
										`/api/reportUserDoc/${userId}/${lang}`,
										templateData
									);
								} else {
									console.log(
										`Document exists for ${lang}, preserving AI content`
									);
									// Document exists, don't overwrite to preserve any AI content
								}
							} catch (error) {
								console.error(
									`Error checking/saving template for ${lang}:`,
									error
								);
							}
						};

						// Save template data only if documents don't exist
						checkAndSaveTemplate("zh", zhReportData);
						checkAndSaveTemplate("tw", twReportData);
					}
				}
				setLoading(false);
			}
		};
		loadDesign();
	}, [locale, userInfo]);

	// Helper function to generate dynamic pillar data based on actual calculated elements
	const generateDynamicPillarData = (
		pillarName,
		stem,
		stemElement,
		branch,
		branchElement,
		baseData,
		random
	) => {
		// Try to find exact match first
		const pillarKey = `${stem}${branch}`;
		if (baseData.nianzhuData?.[pillarKey]) {
			return baseData.nianzhuData[pillarKey][random];
		}

		// If no exact match, use element-based fallback
		const elementData = {};

		// Create element-based keys for天干 and 地支
		const tianganKey = `天干${stemElement}`;
		const dizhiKey = `地支${branchElement}`;

		// Try to find element-based data in the base data structure
		// Look through existing data to find patterns that match elements
		const allPillarData =
			baseData.nianzhuData ||
			baseData.yuezhuData ||
			baseData.rizhuData ||
			baseData.shizhuData ||
			{};

		// Find similar element patterns from existing data
		const similarData = {};
		Object.entries(allPillarData).forEach(([key, values]) => {
			if (key.includes(stemElement) || key.includes(branchElement)) {
				Object.assign(similarData, values[random] || values[0] || {});
			}
		});

		// Generate element-based data
		elementData[tianganKey] =
			`${pillarName}天干${stem}属${stemElement}，主要影响外在表现和性格特质。${stemElement}元素的特性在此柱位体现明显。`;
		elementData[dizhiKey] =
			`${pillarName}地支${branch}属${branchElement}，主要影响内在潜力和环境因素。${branchElement}元素的力量在此发挥作用。`;
		elementData[`综合${stemElement}${branchElement}`] =
			`${pillarName}${pillarKey}的组合，天干${stemElement}与地支${branchElement}相互作用，形成独特的能量场。`;

		// Merge with similar data if found
		return { ...elementData, ...similarData };
	};

	const getJiajuData = (_jiajuData, random) => {
		if (_jiajuData) {
			let jiajuData = _.cloneDeep(_jiajuData);
			for (let key in jiajuData) {
				let room = jiajuData[key];
				for (let direction in room) {
					room[direction] = room[direction][random];
				}
			}
			return jiajuData;
		}
	};
	return { loading, reportDocData, assistantData };
}
