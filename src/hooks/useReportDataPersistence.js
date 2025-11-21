import { useCallback } from "react";
import { useLocale } from "next-intl";
import { patch, post, get } from "@/lib/ajax";

/**
 * Alternative Report Data Persistence Hook (No Authentication Required)
 * Saves data to the new reportData collection instead of reportUserDoc
 */
export function useReportDataPersistence() {
	const locale = useLocale();

	/**
	 * Save complete report data to database using session-based storage
	 * @param {Object} reportData - Complete report data object
	 * @param {string} reportData.sessionId - Session identifier
	 * @param {string} reportData.birthDateTime - Birth date and time
	 * @param {string} reportData.gender - Gender
	 * @param {Object} reportData.basicReportData - Data from Report.jsx
	 * @param {Object} reportData.fourFortuneData - Data from FourFortuneAnalysis.jsx
	 * @param {string} reportData.reportStatus - 'generating', 'partial', 'complete'
	 */
	const saveReportData = useCallback(
		async (reportData) => {
			if (!reportData.sessionId) {
				console.warn("❌ No sessionId found, cannot save report data");
				return { success: false, error: "No session ID" };
			}

			try {
				console.log(
					"💾 Saving report data for session:",
					reportData.sessionId
				);
				// console.log("📊 Report data includes:", Object.keys(reportData));
				// console.log("🔑 userId in reportData:", reportData.userId);

				const language = locale === "zh-CN" ? "zh" : "tw";

				// Prepare complete report data structure
				const reportPayload = {
					sessionId: reportData.sessionId,
					userId: reportData.userId, // Add userId for user-specific report tracking
					birthDateTime: reportData.birthDateTime,
					gender: reportData.gender,
					language,

					// Basic report data from Report.jsx
					basicReportData: {
						mingLiData:
							reportData.basicReportData?.mingLiData || null,
						liuNianData:
							reportData.basicReportData?.liuNianData || null,
						jiajuProData:
							reportData.basicReportData?.jiajuProData || null,
					},

					// Four fortune data from FourFortuneAnalysis.jsx
					fourFortuneData: {
						healthFortuneData:
							reportData.fourFortuneData?.healthFortuneData ||
							null,
						careerFortuneData:
							reportData.fourFortuneData?.careerFortuneData ||
							null,
						wealthFortuneData:
							reportData.fourFortuneData?.wealthFortuneData ||
							null,
						relationshipFortuneData:
							reportData.fourFortuneData
								?.relationshipFortuneData || null,
					},

					// AI Generated Content
					aiGeneratedContent: {
						sessionId: reportData.sessionId,
						generatedAt: new Date().toISOString(),
						generationStatus:
							reportData.reportStatus || "generating",

						// Four Fortune AI Data
						fourFortuneAI: {
							healthFortuneData:
								reportData.fourFortuneData?.healthFortuneData ||
								null,
							careerFortuneData:
								reportData.fourFortuneData?.careerFortuneData ||
								null,
							wealthFortuneData:
								reportData.fourFortuneData?.wealthFortuneData ||
								null,
							relationshipFortuneData:
								reportData.fourFortuneData
									?.relationshipFortuneData || null,
						},

						// Comprehensive AI Analysis
						comprehensiveAI: {
							lifeAdvice:
								reportData.aiGeneratedContent?.comprehensiveAI
									?.lifeAdvice || null,
						},

						// Wuxing Analysis
						wuxingAnalysis:
							reportData.aiGeneratedContent?.wuxingAnalysis ||
							null,

						// Life Stage Analysis
						lifeStageAnalysis:
							reportData.aiGeneratedContent?.lifeStageAnalysis ||
							null,
					},

					// Report status tracking
					reportStatus: reportData.reportStatus || "generating",
				};

				// Use PATCH to update existing or create new
				const { status, data } = await patch(
					`/api/reportData`,
					reportPayload
				);

				if (status === 0) {
					console.log(
						"✅ Report data saved successfully to reportData collection"
					);
					// console.log("🎯 Session:", reportData.sessionId);
					return { success: true, data };
				} else {
					console.error(
						"❌ Failed to save report data, status:",
						status
					);
					return {
						success: false,
						error: `API returned status ${status}`,
					};
				}
			} catch (error) {
				console.error("❌ Error saving report data:", error);
				return { success: false, error: error.message };
			}
		},
		[locale]
	);

	/**
	 * Get report data by sessionId
	 * @param {string} sessionId - Session identifier
	 */
	const getReportData = useCallback(async (sessionId) => {
		if (!sessionId) {
			console.warn("❌ No sessionId provided");
			return { success: false, error: "No session ID" };
		}

		try {
			// console.log("📖 Fetching report data for session:", sessionId);

			const { status, data } = await get(
				`/api/reportData?sessionId=${sessionId}`
			);

			if (status === 0) {
				// console.log("✅ Report data fetched successfully");
				return { success: true, data };
			} else {
				console.error(
					"❌ Failed to fetch report data, status:",
					status
				);
				return {
					success: false,
					error: `API returned status ${status}`,
				};
			}
		} catch (error) {
			console.error("❌ Error fetching report data:", error);
			return { success: false, error: error.message };
		}
	}, []);

	/**
	 * Save individual fortune analysis data
	 * @param {string} fortuneType - 'health', 'career', 'wealth', 'relationship'
	 * @param {Object} fortuneData - The fortune analysis data
	 * @param {string} sessionId - Session identifier
	 */
	const saveIndividualFortune = useCallback(
		async (fortuneType, fortuneData, sessionId) => {
			if (!sessionId || !fortuneData) {
				console.warn(
					`❌ Cannot save ${fortuneType} fortune - missing data`
				);
				return { success: false, error: "Missing required data" };
			}

			try {
				console.log(
					`💾 Saving ${fortuneType} fortune data for session:`,
					sessionId
				);

				const fieldName = `${fortuneType}FortuneData`;

				const payload = {
					sessionId,
					fourFortuneData: {
						[fieldName]: {
							...fortuneData,
							generatedAt: new Date().toISOString(),
							sessionId,
						},
					},
					reportStatus: "partial", // Mark as partial until all four are complete
				};

				const { status } = await patch(`/api/reportData`, payload);

				if (status === 0) {
					console.log(`✅ ${fortuneType} fortune saved successfully`);
					return { success: true };
				} else {
					console.error(
						`❌ Failed to save ${fortuneType} fortune, status:`,
						status
					);
					return {
						success: false,
						error: `API returned status ${status}`,
					};
				}
			} catch (error) {
				console.error(`❌ Error saving ${fortuneType} fortune:`, error);
				return { success: false, error: error.message };
			}
		},
		[]
	);

	/**
	 * Mark report as complete when both Report.jsx and all four fortune analyses are done
	 * @param {string} sessionId - Session identifier
	 */
	const markReportComplete = useCallback(async (sessionId) => {
		if (!sessionId) return { success: false, error: "No session ID" };

		try {
			console.log(
				"🎉 Marking report as complete for session:",
				sessionId
			);

			const payload = {
				sessionId,
				reportStatus: "complete",
				aiGeneratedContent: {
					sessionId,
					generationStatus: "complete",
					completedAt: new Date().toISOString(),
				},
			};

			const { status } = await patch(`/api/reportData`, payload);

			if (status === 0) {
				console.log("✅ Report marked as complete");
				return { success: true };
			}

			return { success: false, error: `API returned status ${status}` };
		} catch (error) {
			console.error("❌ Error marking report complete:", error);
			return { success: false, error: error.message };
		}
	}, []);

	/**
	 * Save AI-generated content (wuxing analysis, life stage analysis, etc.)
	 * @param {string} contentType - Type of AI content
	 * @param {Object} contentData - The AI-generated content
	 * @param {string} sessionId - Session identifier
	 */
	const saveAIContent = useCallback(
		async (contentType, contentData, sessionId) => {
			if (!sessionId || !contentData) {
				console.warn(
					`❌ Cannot save AI content ${contentType} - missing data`
				);
				return { success: false, error: "Missing required data" };
			}

			try {
				console.log(
					`🤖 Saving AI content: ${contentType} for session:`,
					sessionId
				);

				const payload = {
					sessionId,
					aiGeneratedContent: {
						sessionId,
						[contentType]: {
							...contentData,
							generatedAt: new Date().toISOString(),
							sessionId,
						},
						lastUpdated: new Date().toISOString(),
					},
				};

				const { status } = await patch(`/api/reportData`, payload);

				if (status === 0) {
					console.log(
						`✅ AI content ${contentType} saved successfully`
					);
					return { success: true };
				} else {
					console.error(
						`❌ Failed to save AI content ${contentType}, status:`,
						status
					);
					return {
						success: false,
						error: `API returned status ${status}`,
					};
				}
			} catch (error) {
				console.error(
					`❌ Error saving AI content ${contentType}:`,
					error
				);
				return { success: false, error: error.message };
			}
		},
		[]
	);

	return {
		saveReportData,
		getReportData,
		saveIndividualFortune,
		markReportComplete,
		saveAIContent,
	};
}
