import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { patch } from "@/lib/ajax";

/**
 * Comprehensive Life Report Data Persistence Hook
 * Manages auto-save for both Report.jsx and FourFortuneAnalysis.jsx data
 * Creates a unified life report storage system
 */
export function useLifeReportPersistence() {
	const { data: session } = useSession();
	const locale = useLocale();

	/**
	 * Save complete life report data to database using new AI content structure
	 * @param {Object} reportData - Complete report data object
	 * @param {Object} reportData.basicReportData - Data from Report.jsx (mingLi, liuNian, jiajuPro)
	 * @param {Object} reportData.fourFortuneData - Data from FourFortuneAnalysis.jsx
	 * @param {string} reportData.reportStatus - 'generating', 'partial', 'complete'
	 */
	const saveLifeReport = useCallback(
		async (reportData) => {
			const userId = session?.user?.userId;
			if (!userId) {
				console.warn("❌ No userId found, cannot save life report");
				console.warn("📋 Session data:", session);
				return { success: false, error: "No user session" };
			}

			try {
				// console.log("💾 Saving complete life report for user:", userId);

				const language = locale === "zh-CN" ? "zh" : "tw";
				const sessionId = reportData.sessionId;

				// NEW: Save AI content in dedicated structure
				const aiGeneratedContent = {
					sessionId,
					generatedAt: new Date().toISOString(),
					generationStatus: reportData.reportStatus || "generating",

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
						interpersonalAdvice:
							reportData.basicReportData
								?.comprehensiveInterpersonalAdvice || null,
						lifeAdvice:
							reportData.basicReportData
								?.comprehensiveLifeAdvice || null,
					},

					// Generation Log
					generationLog: [
						{
							timestamp: new Date().toISOString(),
							action: "saved",
							sessionId,
							status: reportData.reportStatus,
						},
					],
				};

				// Prepare complete life report data structure
				const lifeReportPayload = {
					// NEW: AI Generated Content in dedicated field
					aiGeneratedContent,

					// Keep existing basic report data (template data remains intact)
					...(reportData.basicReportData || {}),

					// Legacy support: Keep existing fields for backward compatibility
					fourFortuneAnalysisData: {
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
						generatedAt: new Date().toISOString(),
						sessionId: sessionId,
					},

					// Individual fortune data for easy access
					healthFortuneData:
						reportData.fourFortuneData?.healthFortuneData || null,
					careerFortuneData:
						reportData.fourFortuneData?.careerFortuneData || null,
					wealthFortuneData:
						reportData.fourFortuneData?.wealthFortuneData || null,
					relationshipFortuneData:
						reportData.fourFortuneData?.relationshipFortuneData ||
						null,

					// Report status tracking
					lifeReportStatus: reportData.reportStatus || "generating",
					reportGeneratedAt: new Date(),
				};

				console.log(
					"🚀 Making PATCH request to:",
					`/api/reportUserDoc/${userId}/${language}`
				);
				console.log(
					"📤 Payload size:",
					JSON.stringify(lifeReportPayload).length,
					"characters"
				);

				const { status, data } = await patch(
					`/api/reportUserDoc/${userId}/${language}`,
					lifeReportPayload
				);

				console.log("📥 API Response status:", status);
				if (status === 0) {
					console.log(
						"✅ Life report saved successfully in AI content structure"
					);
					// console.log("🎯 AI content saved for session:", sessionId);
					return { success: true, data };
				} else {
					console.error(
						"❌ Failed to save life report, status:",
						status
					);
					console.error("📋 Response data:", data);
					return {
						success: false,
						error: `API returned status ${status}`,
					};
				}
			} catch (error) {
				console.error("❌ Error saving life report:", error);
				return { success: false, error: error.message };
			}
		},
		[session?.user?.userId, locale]
	);

	/**
	 * Save individual fortune analysis data
	 * @param {string} fortuneType - 'health', 'career', 'wealth', 'relationship'
	 * @param {Object} fortuneData - The fortune analysis data
	 * @param {string} sessionId - Session identifier
	 */
	const saveIndividualFortune = useCallback(
		async (fortuneType, fortuneData, sessionId) => {
			const userId = session?.user?.userId;
			if (!userId || !fortuneData) {
				console.warn(
					`❌ Cannot save ${fortuneType} fortune - missing data`
				);
				return { success: false, error: "Missing required data" };
			}

			try {
				console.log(
					`💾 Saving ${fortuneType} fortune data for user:`,
					userId
				);

				const language = locale === "zh-CN" ? "zh" : "tw";
				const fieldName = `${fortuneType}FortuneData`;

				const payload = {
					[fieldName]: {
						...fortuneData,
						generatedAt: new Date().toISOString(),
						sessionId,
					},
					// Update overall four fortune analysis data
					fourFortuneAnalysisData: {
						[fieldName]: fortuneData,
						lastUpdated: new Date().toISOString(),
						sessionId,
					},
					lifeReportStatus: "partial", // Mark as partial until all four are complete
				};

				const { status } = await patch(
					`/api/reportUserDoc/${userId}/${language}`,
					payload
				);

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
		[session?.user?.userId, locale]
	);

	/**
	 * Mark life report as complete when both Report.jsx and all four fortune analyses are done
	 * @param {string} sessionId - Session identifier
	 */
	const markLifeReportComplete = useCallback(
		async (sessionId) => {
			const userId = session?.user?.userId;
			if (!userId) return { success: false, error: "No user session" };

			try {
				console.log(
					"🎉 Marking life report as complete for user:",
					userId
				);

				const language = locale === "zh-CN" ? "zh" : "tw";

				const payload = {
					lifeReportStatus: "complete",
					reportGeneratedAt: new Date(),
					fourFortuneAnalysisData: {
						completedAt: new Date().toISOString(),
						sessionId,
						status: "complete",
					},
				};

				const { status } = await patch(
					`/api/reportUserDoc/${userId}/${language}`,
					payload
				);

				if (status === 0) {
					console.log("✅ Life report marked as complete");
					return { success: true };
				}

				return {
					success: false,
					error: `API returned status ${status}`,
				};
			} catch (error) {
				console.error("❌ Error marking life report complete:", error);
				return { success: false, error: error.message };
			}
		},
		[session?.user?.userId, locale]
	);

	/**
	 * Save individual AI-generated content pieces to the new structure
	 * @param {string} contentType - Type of AI content (e.g., 'nianzhuAI', 'fourFortuneAI.healthFortuneData')
	 * @param {Object} contentData - The AI-generated content
	 * @param {string} sessionId - Session identifier for fresh content tracking
	 */
	const saveAIContent = useCallback(
		async (contentType, contentData, sessionId) => {
			const userId = session?.user?.userId;
			if (!userId || !contentData) {
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

				const language = locale === "zh-CN" ? "zh" : "tw";

				// Create nested object structure for MongoDB update
				const payload = {
					[`aiGeneratedContent.${contentType}`]: {
						...contentData,
						generatedAt: new Date().toISOString(),
						sessionId,
					},
					[`aiGeneratedContent.sessionId`]: sessionId,
					[`aiGeneratedContent.lastUpdated`]:
						new Date().toISOString(),
				};

				const { status } = await patch(
					`/api/reportUserDoc/${userId}/${language}`,
					payload
				);

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
		[session?.user?.userId, locale]
	);

	return {
		saveLifeReport,
		saveIndividualFortune,
		markLifeReportComplete,
		saveAIContent, // NEW: Save individual AI content pieces
	};
}
