import { useState, useCallback } from "react";

export const useCoupleAnalysisReports = () => {
	const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.harmoniqfengshui.com';
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Create a new couple analysis report
	const createReport = useCallback(async (reportData) => {
		setLoading(true);
		setError(null);

		try {
			console.log("📝 Creating couple analysis report...", {
				userId: reportData.userId,
				sessionId: reportData.sessionId,
				problemCategory: reportData.problemAnalysis?.categoryType,
			});

			const response = await fetch(`${API_BASE}/api/couple-analysis-reports`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(reportData),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to create report");
			}

			console.log("✅ Report created successfully:", result.reportId);
			return result;
		} catch (err) {
			console.error("❌ Failed to create report:", err);
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	// Get a specific report by ID
	const getReport = useCallback(async (reportId) => {
		setLoading(true);
		setError(null);

		try {
			console.log("🔍 Fetching report:", reportId);

			const response = await fetch(
				`/api/couple-analysis-reports/${reportId}`
			);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to fetch report");
			}

			console.log("✅ Report fetched successfully");
			return result.report;
		} catch (err) {
			console.error("❌ Failed to fetch report:", err);
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	// Get reports for a user (with pagination)
	const getUserReports = useCallback(async (userId, options = {}) => {
		setLoading(true);
		setError(null);

		try {
			const params = new URLSearchParams({
				userId,
				...options,
			});

			console.log("📋 Fetching user reports:", { userId, options });

			const response = await fetch(
				`/api/couple-analysis-reports?${params}`
			);
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to fetch reports");
			}

			console.log(`✅ Fetched ${result.reports.length} reports`);
			return result;
		} catch (err) {
			console.error("❌ Failed to fetch user reports:", err);
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	// Update a report
	const updateReport = useCallback(async (reportId, updateData) => {
		setLoading(true);
		setError(null);

		try {
			console.log("📝 Updating report:", reportId);

			const response = await fetch(
				`/api/couple-analysis-reports/${reportId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(updateData),
				}
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to update report");
			}

			console.log("✅ Report updated successfully");
			return result.report;
		} catch (err) {
			console.error("❌ Failed to update report:", err);
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	// Delete a report (soft delete)
	const deleteReport = useCallback(async (reportId) => {
		setLoading(true);
		setError(null);

		try {
			console.log("🗑️ Deleting report:", reportId);

			const response = await fetch(
				`/api/couple-analysis-reports/${reportId}`,
				{
					method: "DELETE",
				}
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to delete report");
			}

			console.log("✅ Report deleted successfully");
			return result;
		} catch (err) {
			console.error("❌ Failed to delete report:", err);
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	// Helper function to create report data from couple analysis
	const formatReportData = useCallback(
		(coupleAnalysisData, problemData, userInfo) => {
			const {
				analysisData,
				femaleUser,
				maleUser,
				specificProblem,
				compatibilityScore,
			} = coupleAnalysisData;
			const { problemCategory } = problemData;

			// Determine problem category type
			const categoryTypeMap = {
				感情降溫類: "emotion_cooling",
				特殊情境類: "special_situation",
				禁忌破解話術: "taboo_breaking",
			};

			const reportData = {
				userId: userInfo.userId || `user_${Date.now()}`,
				sessionId: userInfo.sessionId || `session_${Date.now()}`,
				language: "zh-CN",

				userProfile: {
					birthday: femaleUser.birthDateTime,
					gender: femaleUser.gender,
					element: analysisData?.female?.element,
					personality: analysisData?.female?.personality,
					loveStyle: analysisData?.female?.loveStyle,
					baziPillars: analysisData?.female?.pillars || [],
					dayMasterElement: analysisData?.female?.dayMasterElement,
				},

				partnerProfile: {
					birthday: maleUser.birthDateTime,
					gender: maleUser.gender,
					element: analysisData?.male?.element,
					personality: analysisData?.male?.personality,
					loveStyle: analysisData?.male?.loveStyle,
					baziPillars: analysisData?.male?.pillars || [],
					dayMasterElement: analysisData?.male?.dayMasterElement,
				},

				compatibilityAnalysis: {
					overallScore: compatibilityScore || 75,
					compatibilityLevel: getCompatibilityLevel(
						compatibilityScore || 75
					),
					elementInteraction: getElementInteraction(
						analysisData?.female?.element,
						analysisData?.male?.element
					),
					relationshipAdvice: analysisData?.relationshipAdvice,
					developmentAdvice: analysisData?.developmentAdvice,
					specificAdvice: analysisData?.specificAdvice,
				},

				problemAnalysis: {
					originalProblem: specificProblem,
					problemCategory: problemCategory?.categoryName,
					categoryType:
						categoryTypeMap[problemCategory?.categoryName] ||
						"emotion_cooling",
					keyIssues: [],
					rootCauses: [],
				},

				solutions: createSolutionsByCategory(
					categoryTypeMap[problemCategory?.categoryName],
					analysisData
				),

				yearlyFortune: {
					currentYear: analysisData?.yearlyFortune?.currentYear,
					bestTiming: analysisData?.yearlyFortune?.bestTiming,
					warnings: analysisData?.yearlyFortune?.warnings,
					monthlyGuidance: [],
				},

				fengShuiLayout: {
					bedroom: analysisData?.fengShuiLayout?.bedroom,
					livingRoom: analysisData?.fengShuiLayout?.livingRoom,
					colors: analysisData?.fengShuiLayout?.colors,
					items: analysisData?.fengShuiLayout?.items,
					generalAdvice: analysisData?.fengShuiLayout?.generalAdvice,
					specificPlacements: [],
				},

				analysisDetails: {
					wuxingAnalysis: analysisData?.wuxingAnalysis,
					usefulGods: analysisData?.usefulGods || [],
					tabooElements: analysisData?.tabooElements || [],
					luckyDirections: analysisData?.luckyDirections || [],
					luckyNumbers: analysisData?.luckyNumbers || [],
				},

				reportMetadata: {
					concern: "感情",
					reportType: "couple_analysis",
					analysisDepth: "comprehensive",
					version: "2.0",
				},
			};

			return reportData;
		},
		[]
	);

	// Helper functions
	const getCompatibilityLevel = (score) => {
		if (score >= 80) return "優秀配對";
		if (score >= 70) return "良好配對";
		if (score >= 60) return "穩定配對";
		return "需要努力";
	};

	const getElementInteraction = (element1, element2) => {
		if (!element1 || !element2) return "五行分析中...";

		const interactions = {
			"金-木": "金克木，需要調和",
			"木-土": "木克土，需要平衡",
			"土-水": "土克水，需要協調",
			"水-火": "水克火，需要融合",
			"火-金": "火克金，需要緩解",
			"金-水": "金生水，相生有情",
			"水-木": "水生木，互相促進",
			"木-火": "木生火，感情炙熱",
			"火-土": "火生土，穩定發展",
			"土-金": "土生金，堅實可靠",
		};

		const key1 = `${element1}-${element2}`;
		const key2 = `${element2}-${element1}`;

		return interactions[key1] || interactions[key2] || "五行和諧";
	};

	const createSolutionsByCategory = (categoryType, analysisData) => {
		const solutions = {
			emotionCooling: null,
			specialSituation: null,
			tabooBreaking: null,
		};

		switch (categoryType) {
			case "emotion_cooling":
				solutions.emotionCooling = {
					chartDiagnosis: {
						diagnosis: analysisData?.chartDiagnosis?.diagnosis,
						keyFindings:
							analysisData?.chartDiagnosis?.keyFindings || [],
						recommendations:
							analysisData?.chartDiagnosis?.recommendations || [],
					},
					emergencyFengShui: {
						urgentActions:
							analysisData?.emergencyFengShui?.urgentActions ||
							[],
						placements:
							analysisData?.emergencyFengShui?.placements || [],
						colors: analysisData?.emergencyFengShui?.colors || [],
					},
					restartChemistry: {
						methods: analysisData?.restartChemistry?.methods || [],
						timing: analysisData?.restartChemistry?.timing,
						activities:
							analysisData?.restartChemistry?.activities || [],
					},
				};
				break;

			case "special_situation":
				solutions.specialSituation = {
					starChartGuidance: {
						guidance: analysisData?.starChartGuidance?.guidance,
						favorablePeriods:
							analysisData?.starChartGuidance?.favorablePeriods ||
							[],
						strategies:
							analysisData?.starChartGuidance?.strategies || [],
					},
					fengShuiTransformation: {
						transformations:
							analysisData?.fengShuiTransformation
								?.transformations || [],
						environmentChanges:
							analysisData?.fengShuiTransformation
								?.environmentChanges || [],
						energyAdjustments:
							analysisData?.fengShuiTransformation
								?.energyAdjustments || [],
					},
					relationshipMethod: {
						methods:
							analysisData?.relationshipMethod?.methods || [],
						communication:
							analysisData?.relationshipMethod?.communication ||
							[],
						principles:
							analysisData?.relationshipMethod?.principles || [],
					},
				};
				break;

			case "taboo_breaking":
				solutions.tabooBreaking = {
					keyAnalysis: {
						analysis: analysisData?.keyAnalysis?.analysis,
						taboos: analysisData?.keyAnalysis?.taboos || [],
						patterns: analysisData?.keyAnalysis?.patterns || [],
					},
					targetedSuggestions: {
						suggestions:
							analysisData?.targetedSuggestions?.suggestions ||
							[],
						scripts:
							analysisData?.targetedSuggestions?.scripts || [],
						timing: analysisData?.targetedSuggestions?.timing || [],
					},
					restartChemistry: {
						methods: analysisData?.restartChemistry?.methods || [],
						healingProcess:
							analysisData?.restartChemistry?.healingProcess ||
							[],
						preventiveMeasures:
							analysisData?.restartChemistry
								?.preventiveMeasures || [],
					},
				};
				break;
		}

		return solutions;
	};

	return {
		loading,
		error,
		createReport,
		getReport,
		getUserReports,
		updateReport,
		deleteReport,
		formatReportData,
	};
};
