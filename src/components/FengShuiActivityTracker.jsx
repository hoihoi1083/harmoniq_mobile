"use client";

import { useEffect } from "react";
import FengShuiMixpanel from "@/lib/mixpanel";

export default function FengShuiActivityTracker() {
	useEffect(() => {
		// Track chat interactions in smart-chat2
		const trackChatActivity = () => {
			// Monitor chat messages (looking for message sending patterns)
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							// Detect new chat messages
							if (
								node.matches &&
								(node.matches('[class*="message"]') ||
									node.matches('[class*="chat"]') ||
									node.querySelector('[class*="message"]'))
							) {
								const messageType = node.textContent?.includes(
									"AI"
								)
									? "ai_response"
									: "user_message";

								window.gtag &&
									window.gtag("event", "chat_message_added", {
										event_category: "Chat_Interaction",
										message_type: messageType,
										page_path: window.location.pathname,
										timestamp: new Date().toISOString(),
									});

								// Mixpanel 聊天追蹤
								FengShuiMixpanel.trackChatInteraction({
									訊息類型:
										messageType === "ai_response"
											? "AI回應"
											: "用戶訊息",
									訊息長度: node.textContent?.length || 0,
									包含圖片: !!node.querySelector("img"),
									聊天頁面: window.location.pathname,
								});
							}

							// Detect birthday modal opens
							if (
								node.matches &&
								(node.matches('[class*="modal"]') ||
									node.matches('[class*="birthday"]') ||
									node.textContent?.includes("生日") ||
									node.textContent?.includes("出生"))
							) {
								window.gtag &&
									window.gtag(
										"event",
										"birthday_modal_opened",
										{
											event_category: "FengShui_Flow",
											flow_step: "birthday_entry",
											page_path: window.location.pathname,
										}
									);
							}

							// Detect analysis results
							if (
								node.textContent &&
								(node.textContent.includes("分析結果") ||
									node.textContent.includes("風水") ||
									node.textContent.includes("命理"))
							) {
								window.gtag &&
									window.gtag(
										"event",
										"analysis_result_displayed",
										{
											event_category: "FengShui_Analysis",
											analysis_type: detectAnalysisType(
												node.textContent
											),
											page_path: window.location.pathname,
										}
									);
							}
						}
					});
				});
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});

			return () => observer.disconnect();
		};

		// Detect analysis type from content
		const detectAnalysisType = (content) => {
			if (content.includes("夫妻") || content.includes("情侶"))
				return "couple_analysis";
			if (content.includes("八字") || content.includes("命盤"))
				return "bazhai_analysis";
			if (content.includes("風水")) return "fengshui_analysis";
			if (content.includes("運勢")) return "fortune_analysis";
			return "general_analysis";
		};

		// Track specific feng shui interactions
		const trackFengShuiInteractions = () => {
			// Track birthday form submissions
			const trackBirthdaySubmission = (event) => {
				const form =
					event.target.closest("form") ||
					event.target.closest("[data-form-type]");
				if (
					form &&
					(form.textContent.includes("生日") ||
						form.textContent.includes("出生") ||
						form.querySelector('select[name*="year"]') ||
						form.querySelector('select[name*="month"]'))
				) {
					window.gtag &&
						window.gtag("event", "birthday_form_submitted", {
							event_category: "FengShui_Flow",
							form_type: "birthday_entry",
							page_path: window.location.pathname,
							completion_method: event.type,
						});
				}
			};

			// Track analysis requests
			const trackAnalysisRequest = (event) => {
				const button = event.target;
				const buttonText = button.textContent || "";

				if (
					buttonText.includes("分析") ||
					buttonText.includes("測算") ||
					buttonText.includes("開始") ||
					buttonText.includes("免費")
				) {
					window.gtag &&
						window.gtag("event", "analysis_requested", {
							event_category: "FengShui_Analysis",
							button_text: buttonText.trim(),
							request_type: detectRequestType(buttonText),
							page_path: window.location.pathname,
						});
				}
			};

			// Detect request type
			const detectRequestType = (buttonText) => {
				if (buttonText.includes("夫妻") || buttonText.includes("情侶"))
					return "couple_request";
				if (buttonText.includes("免費")) return "free_request";
				if (buttonText.includes("進階")) return "premium_request";
				return "standard_request";
			};

			// Track payment interactions
			const trackPaymentInteraction = (event) => {
				const element = event.target;
				const text = element.textContent || "";

				if (
					text.includes("付款") ||
					text.includes("購買") ||
					text.includes("支付") ||
					element.closest('[class*="payment"]') ||
					element.closest('[class*="stripe"]')
				) {
					window.gtag &&
						window.gtag("event", "payment_interaction", {
							event_category: "Ecommerce",
							interaction_type: event.type,
							element_text: text.trim(),
							page_path: window.location.pathname,
						});
				}
			};

			// Track report downloads/views
			const trackReportAccess = (event) => {
				const element = event.target;
				const text = element.textContent || "";

				if (
					text.includes("報告") ||
					text.includes("下載") ||
					element.href?.includes("report") ||
					element.closest('[class*="report"]')
				) {
					window.gtag &&
						window.gtag("event", "report_accessed", {
							event_category: "Content_Access",
							access_type: element.href
								? "download_link"
								: "view_button",
							report_type: detectReportType(text, element.href),
							page_path: window.location.pathname,
						});
				}
			};

			// Detect report type
			const detectReportType = (text, href) => {
				if (text.includes("夫妻") || href?.includes("couple"))
					return "couple_report";
				if (text.includes("八字") || href?.includes("bazhai"))
					return "bazhai_report";
				if (text.includes("風水") || href?.includes("feng-shui"))
					return "fengshui_report";
				return "general_report";
			};

			// Add event listeners
			document.addEventListener("click", trackAnalysisRequest, true);
			document.addEventListener("submit", trackBirthdaySubmission, true);
			document.addEventListener("click", trackPaymentInteraction, true);
			document.addEventListener("click", trackReportAccess, true);

			return () => {
				document.removeEventListener(
					"click",
					trackAnalysisRequest,
					true
				);
				document.removeEventListener(
					"submit",
					trackBirthdaySubmission,
					true
				);
				document.removeEventListener(
					"click",
					trackPaymentInteraction,
					true
				);
				document.removeEventListener("click", trackReportAccess, true);
			};
		};

		// Track language switching
		const trackLanguageSwitching = () => {
			let currentPath = window.location.pathname;

			const checkLanguageSwitch = () => {
				const newPath = window.location.pathname;
				if (newPath !== currentPath) {
					const oldLang = currentPath.startsWith("/zh-CN")
						? "zh-CN"
						: "zh-TW";
					const newLang = newPath.startsWith("/zh-CN")
						? "zh-CN"
						: "zh-TW";

					if (oldLang !== newLang) {
						window.gtag &&
							window.gtag("event", "language_switched", {
								event_category: "User_Preference",
								from_language: oldLang,
								to_language: newLang,
								page_type: newPath.split("/")[2] || "home",
							});
					}
					currentPath = newPath;
				}
			};

			// Check for language switches periodically
			const interval = setInterval(checkLanguageSwitch, 1000);

			return () => clearInterval(interval);
		};

		// Initialize all tracking
		const chatCleanup = trackChatActivity();
		const interactionCleanup = trackFengShuiInteractions();
		const languageCleanup = trackLanguageSwitching();

		// Cleanup on unmount
		return () => {
			chatCleanup && chatCleanup();
			interactionCleanup && interactionCleanup();
			languageCleanup && languageCleanup();
		};
	}, []);

	return null;
}
