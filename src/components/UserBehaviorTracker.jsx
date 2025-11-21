"use client";

import { useEffect } from "react";

export default function UserBehaviorTracker() {
	useEffect(() => {
		// Skip tracking in development or if gtag is not available
		if (
			process.env.NODE_ENV === "development" ||
			typeof window === "undefined" ||
			!window.gtag
		) {
			console.log(
				"📊 User behavior tracking disabled in development mode"
			);
			return;
		}

		// Enhanced user session tracking
		const trackUserSession = () => {
			if (
				typeof window !== "undefined" &&
				window.gtag &&
				typeof window.gtag === "function"
			) {
				try {
					// Get detailed user environment
					const userAgent = navigator.userAgent;
					const platform = navigator.platform;
					const language = navigator.language;
					const timezone =
						Intl.DateTimeFormat().resolvedOptions().timeZone;
					const cookieEnabled = navigator.cookieEnabled;
					const onlineStatus = navigator.onLine;

					// Track session start with detailed info
					window.gtag("event", "session_start_detailed", {
						event_category: "User_Environment",
						user_agent: userAgent,
						platform: platform,
						language: language,
						timezone: timezone,
						cookie_enabled: cookieEnabled,
						online_status: onlineStatus,
						timestamp: new Date().toISOString(),
						session_id:
							sessionStorage.getItem("ga_session_id") ||
							generateSessionId(),
					});

					// Store session ID for tracking
					if (!sessionStorage.getItem("ga_session_id")) {
						sessionStorage.setItem(
							"ga_session_id",
							generateSessionId()
						);
					}
				} catch (e) {
					// Silently fail if tracking fails
					console.log("Session tracking skipped:", e.message);
				}
			}
		};

		// Generate unique session ID
		const generateSessionId = () => {
			return (
				Date.now().toString(36) + Math.random().toString(36).substr(2)
			);
		};

		// Track user engagement events
		const trackEngagement = () => {
			let scrollDepth = 0;
			let maxScrollDepth = 0;
			let timeOnPage = 0;
			const startTime = Date.now();

			// Scroll depth tracking
			const trackScroll = () => {
				const scrollPercent = Math.round(
					(window.scrollY /
						(document.body.scrollHeight - window.innerHeight)) *
						100
				);

				if (scrollPercent > maxScrollDepth) {
					maxScrollDepth = scrollPercent;

					// Track scroll milestones
					if ([25, 50, 75, 90].includes(scrollPercent)) {
						window.gtag &&
							window.gtag("event", "scroll_depth", {
								event_category: "Engagement",
								scroll_depth: scrollPercent,
								page_path: window.location.pathname,
							});
					}
				}
			};

			// Time on page tracking
			const trackTimeOnPage = () => {
				timeOnPage = Math.round((Date.now() - startTime) / 1000);

				// Track time milestones (30s, 60s, 120s, 300s)
				if ([30, 60, 120, 300].includes(timeOnPage)) {
					window.gtag &&
						window.gtag("event", "time_on_page", {
							event_category: "Engagement",
							time_seconds: timeOnPage,
							page_path: window.location.pathname,
						});
				}
			};

			// Mouse movement tracking (engagement indicator)
			let mouseMovements = 0;
			const trackMouseMovement = () => {
				mouseMovements++;
				if (mouseMovements === 10) {
					// Track after 10 movements (engaged user)
					window.gtag &&
						window.gtag("event", "user_engaged", {
							event_category: "Engagement",
							engagement_type: "mouse_activity",
							page_path: window.location.pathname,
						});
				}
			};

			// Keyboard activity tracking
			let keyPresses = 0;
			const trackKeyActivity = () => {
				keyPresses++;
				if (keyPresses === 5) {
					// Track after 5 key presses
					window.gtag &&
						window.gtag("event", "user_engaged", {
							event_category: "Engagement",
							engagement_type: "keyboard_activity",
							page_path: window.location.pathname,
						});
				}
			};

			// Add event listeners
			window.addEventListener("scroll", trackScroll, { passive: true });
			window.addEventListener("mousemove", trackMouseMovement, {
				passive: true,
			});
			window.addEventListener("keydown", trackKeyActivity, {
				passive: true,
			});

			// Track time every 30 seconds
			const timeTracker = setInterval(trackTimeOnPage, 30000);

			// Cleanup function
			return () => {
				window.removeEventListener("scroll", trackScroll);
				window.removeEventListener("mousemove", trackMouseMovement);
				window.removeEventListener("keydown", trackKeyActivity);
				clearInterval(timeTracker);

				// Send final engagement metrics
				if (window.gtag) {
					window.gtag("event", "page_engagement_summary", {
						event_category: "Engagement",
						max_scroll_depth: maxScrollDepth,
						total_time_seconds: Math.round(
							(Date.now() - startTime) / 1000
						),
						mouse_movements: mouseMovements,
						key_presses: keyPresses,
						page_path: window.location.pathname,
					});
				}
			};
		};

		// Track form interactions across the app
		const trackFormInteractions = () => {
			// Monitor all form fields
			const trackFormField = (event) => {
				const field = event.target;
				if (
					field.tagName === "INPUT" ||
					field.tagName === "SELECT" ||
					field.tagName === "TEXTAREA"
				) {
					const formName =
						field.closest("form")?.name ||
						field.closest("[data-form-name]")?.dataset.formName ||
						"unknown_form";
					const fieldName =
						field.name ||
						field.id ||
						field.placeholder ||
						"unknown_field";

					window.gtag &&
						window.gtag("event", "form_field_interaction", {
							event_category: "Form_Interaction",
							form_name: formName,
							field_name: fieldName,
							field_type:
								field.type || field.tagName.toLowerCase(),
							interaction_type: event.type,
							page_path: window.location.pathname,
						});
				}
			};

			// Add form interaction listeners
			document.addEventListener("focus", trackFormField, true);
			document.addEventListener("blur", trackFormField, true);
			document.addEventListener("change", trackFormField, true);

			return () => {
				document.removeEventListener("focus", trackFormField, true);
				document.removeEventListener("blur", trackFormField, true);
				document.removeEventListener("change", trackFormField, true);
			};
		};

		// Track errors and issues
		const trackErrors = () => {
			const originalConsoleError = console.error;
			console.error = (...args) => {
				// Only track if gtag is available and not in development mode
				if (
					window.gtag &&
					typeof window.gtag === "function" &&
					process.env.NODE_ENV !== "development"
				) {
					try {
						window.gtag("event", "javascript_error", {
							event_category: "Error",
							error_message: args.join(" "),
							page_path: window.location.pathname,
							timestamp: new Date().toISOString(),
						});
					} catch (e) {
						// Silently fail to prevent infinite loop
					}
				}
				originalConsoleError.apply(console, args);
			};

			// Track unhandled promise rejections
			window.addEventListener("unhandledrejection", (event) => {
				window.gtag &&
					window.gtag("event", "unhandled_promise_rejection", {
						event_category: "Error",
						error_message:
							event.reason?.message ||
							"Unknown promise rejection",
						page_path: window.location.pathname,
					});
			});
		};

		// Initialize all tracking
		trackUserSession();
		const engagementCleanup = trackEngagement();
		const formCleanup = trackFormInteractions();
		trackErrors();

		// Cleanup on unmount
		return () => {
			engagementCleanup && engagementCleanup();
			formCleanup && formCleanup();
		};
	}, []);

	return null;
}
