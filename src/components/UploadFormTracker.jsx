"use client";
import { useEffect } from "react";

export default function UploadFormTracker() {
	useEffect(() => {
		// Enhanced form detection - works for div-based forms without <form> tags
		const findUploadForms = () => {
			// First try to find traditional modal forms
			const modalForms = document.querySelectorAll(
				'[class*="fixed"][class*="inset-0"] form'
			);
			if (modalForms.length > 0) {
				return Array.from(modalForms);
			}

			// NEW: Find div-based forms that contain upload form fields
			const uploadContainers = [];

			// Look for containers with upload form patterns
			const containers = document.querySelectorAll(
				'div[class*="max-w"], div[class*="space-y"]'
			);

			containers.forEach((container) => {
				// Check if container has upload form characteristics
				const hasGender = container.querySelector(
					'select option[value="male"], select option[value="female"]'
				);
				const hasBirthDate = container.querySelector(
					'select option[value*="19"], select option[value*="20"]'
				);
				const hasRoomType = container.querySelector(
					'select option[value="bedroom"], select option[value="livingRoom"]'
				);
				const hasDirection = container.querySelector(
					'select option[value="north"], select option[value="south"]'
				);
				const hasSubmitButton = container.querySelector(
					'button[class*="bg-gradient"], button[onclick*="Start"]'
				);

				// Must have at least 2 upload characteristics to be considered an upload form
				const characteristics = [
					hasGender,
					hasBirthDate,
					hasRoomType,
					hasDirection,
					hasSubmitButton,
				].filter(Boolean).length;

				if (characteristics >= 2) {
					uploadContainers.push(container);
				}
			});

			return uploadContainers;
		};

		const trackFormInteraction = (eventType, details = {}) => {
			if (window.gtag) {
				window.gtag("event", eventType, {
					event_category: "upload_form",
					event_label: details.field || "unknown",
					value: details.progress || 0,
					custom_data: {
						form_type: details.form_type || "upload",
						timestamp: Date.now(),
						...details,
					},
				});
				console.log(`📊 GA Event: ${eventType}`, details);
			}
		};

		// Enhanced form tracking for div-based forms
		const setupUploadFormTracking = () => {
			const forms = findUploadForms();
			console.log(`🎯 Found ${forms.length} upload forms`);

			forms.forEach((formContainer, index) => {
				console.log(
					`🎯 Setting up tracking for upload form ${index + 1}:`,
					formContainer
				);

				// Track form start when first field is interacted with
				let hasStarted = false;
				const trackStart = () => {
					if (!hasStarted) {
						hasStarted = true;
						trackFormInteraction("upload_form_start", {
							form_type: "div_based_form",
							form_index: index,
						});
					}
				};

				// Find all form fields (selects in this case)
				const fields = formContainer.querySelectorAll(
					"select, input, textarea"
				);
				console.log(
					`📝 Found ${fields.length} form fields in container ${index + 1}`
				);

				let filledFields = new Set();

				fields.forEach((field) => {
					// Enhanced field name detection
					const getFieldName = (element) => {
						// Look for label in the same parent div
						const parentDiv = element.closest(
							'div[class*="space-y"]'
						);
						if (parentDiv) {
							const label = parentDiv.querySelector("label");
							if (label) return label.textContent.trim();
						}

						// Check for nearby label
						const label = element
							.closest("div")
							?.querySelector("label");
						if (label) return label.textContent.trim();

						// Check for placeholder or name
						const placeholder = element.placeholder;
						if (placeholder) return placeholder;

						const name = element.name || element.id;
						if (name) return name;

						// Check first option text for select elements
						if (
							element.tagName === "SELECT" &&
							element.options.length > 0
						) {
							const firstOption = element.options[0].textContent;
							if (
								firstOption &&
								!firstOption.includes("选择") &&
								!firstOption.includes("Select")
							) {
								return firstOption;
							}
						}

						return element.tagName.toLowerCase();
					};

					const fieldName = getFieldName(field);
					console.log(
						`🔍 Setting up tracking for field: "${fieldName}"`
					);

					// Track field focus
					field.addEventListener("focus", () => {
						trackStart();
						trackFormInteraction("upload_field_focus", {
							field: fieldName,
							form_type: "div_based_form",
						});
					});

					// Track field changes
					field.addEventListener("change", () => {
						trackStart();

						if (field.value && field.value.trim() !== "") {
							filledFields.add(fieldName);

							trackFormInteraction("upload_field_complete", {
								field: fieldName,
								field_value:
									field.type === "select-one"
										? field.value
										: "filled",
								form_type: "div_based_form",
								total_completed: filledFields.size,
							});
						} else {
							filledFields.delete(fieldName);
						}

						trackFormInteraction("upload_field_change", {
							field: fieldName,
							field_value:
								field.type === "select-one"
									? field.value
									: "filled",
							form_type: "div_based_form",
						});

						// Track progress milestones
						const progress = Math.round(
							(filledFields.size / fields.length) * 100
						);
						if (progress > 0 && progress % 25 === 0) {
							trackFormInteraction("upload_form_progress", {
								progress,
								filled_fields: filledFields.size,
								total_fields: fields.length,
								form_type: "div_based_form",
							});
						}
					});

					// Track field blur
					field.addEventListener("blur", () => {
						trackFormInteraction("upload_field_blur", {
							field: fieldName,
							form_type: "div_based_form",
						});
					});
				});

				// Track button clicks (since there's no form submission)
				const actionButtons = formContainer.querySelectorAll(
					'button[class*="bg-gradient"], button:not([type="button"]):not([type="reset"]), button[onclick*="Start"]'
				);

				console.log(`🔘 Found ${actionButtons.length} action buttons`);

				actionButtons.forEach((button, buttonIndex) => {
					const getButtonName = () => {
						return (
							button.textContent.trim() || `button_${buttonIndex}`
						);
					};

					button.addEventListener("click", (e) => {
						const buttonName = getButtonName();
						console.log(`🖱️ Button clicked: "${buttonName}"`);

						// Track form submission
						if (
							buttonName.includes("开始") || // Simplified Chinese "start"
							buttonName.includes("開始") || // Traditional Chinese "start"
							buttonName.includes("Start") ||
							buttonName.includes("分析") || // Simplified Chinese "analysis"
							buttonName.includes("測算") || // Traditional Chinese "calculation"
							buttonName.includes("测算") || // Simplified Chinese "calculation" ✅ ADD THIS
							buttonName.includes("免費") || // Traditional Chinese "free"
							buttonName.includes("免费") // Simplified Chinese "free" ✅ ADD THIS
						) {
							console.log(
								"✅ Button matches submit criteria - tracking upload_form_submit"
							);
							trackFormInteraction("upload_form_submit", {
								filled_fields: filledFields.size,
								total_fields: fields.length,
								completion_rate: Math.round(
									(filledFields.size / fields.length) * 100
								),
								form_type: "div_based_form",
								button_name: buttonName,
							});
						} else {
							console.log(
								"❌ Button does NOT match submit criteria - tracking upload_button_click"
							);
							// Track other button clicks
							trackFormInteraction("upload_button_click", {
								button_name: buttonName,
								form_type: "div_based_form",
							});
						}
					});
				});
			});
		};

		// Original modal tracking logic (keep for backward compatibility)
		const observeChanges = () => {
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							// Check for modal appearance
							if (
								node.matches &&
								node.matches(
									'[class*="fixed"][class*="inset-0"]'
								)
							) {
								console.log(
									"🔍 Modal detected, setting up tracking"
								);
								trackFormInteraction("upload_modal_open");
								setTimeout(setupUploadFormTracking, 100);
							}
							// Check for new upload forms
							else if (
								node.matches &&
								(node.matches('div[class*="max-w"]') ||
									node.querySelector(
										'select option[value="male"]'
									))
							) {
								console.log("🔍 New upload form detected");
								setTimeout(setupUploadFormTracking, 100);
							}
						}
					});

					mutation.removedNodes.forEach((node) => {
						if (node.nodeType === Node.ELEMENT_NODE) {
							if (
								node.matches &&
								node.matches(
									'[class*="fixed"][class*="inset-0"]'
								)
							) {
								trackFormInteraction("upload_modal_close");
							}
						}
					});
				});
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});

			return observer;
		};

		// Initialize tracking
		console.log("🚀 UploadFormTracker initializing for div-based forms...");

		// Set up immediate tracking for existing forms
		setTimeout(setupUploadFormTracking, 500);

		// Set up observer for dynamic content
		const observer = observeChanges();

		// Cleanup
		return () => {
			observer.disconnect();
		};
	}, []);

	return null;
}
