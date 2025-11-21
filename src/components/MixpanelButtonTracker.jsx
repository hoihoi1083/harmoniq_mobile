"use client";
import { useEffect } from "react";
import FengShuiMixpanel from "@/lib/mixpanel";

export default function MixpanelButtonTracker() {
	useEffect(() => {
		const trackButtonClick = (e) => {
			const button = e.target.closest(
				'button, a, .btn, [role="button"], [data-track], input[type="submit"], input[type="button"]'
			);

			if (button) {
				// 獲取按鈕資訊
				const buttonText = button.textContent?.trim() || "";
				const buttonId = button.id || "";
				const buttonClass = button.className || "";
				const buttonAriaLabel = button.getAttribute("aria-label") || "";
				const buttonDataTrack = button.getAttribute("data-track") || "";
				const href = button.getAttribute("href") || "";

				// 智能按鈕名稱識別
				let buttonName = "";

				// 優先級排序的按鈕名稱識別
				if (buttonDataTrack) {
					buttonName = buttonDataTrack;
				} else if (buttonAriaLabel) {
					buttonName = buttonAriaLabel;
				} else if (buttonText) {
					buttonName = buttonText;
				} else if (buttonId) {
					buttonName = buttonId;
				} else {
					// 智能上下文識別
					const parentText =
						button.closest("div")?.textContent?.trim() || "";
					const imageAlt = button.querySelector("img")?.alt || "";

					// 常見按鈕模式識別
					if (
						imageAlt.includes("trash") ||
						button.querySelector('[src*="trash"]')
					) {
						buttonName = "刪除按鈕";
					} else if (
						button.querySelector("svg") &&
						parentText.includes("照片")
					) {
						buttonName = "文件上傳區域";
					} else if (
						button.classList.contains("rounded-full") &&
						button.querySelector("img")
					) {
						buttonName = "圓形圖標按鈕";
					} else if (
						parentText.includes("瀏覽") ||
						parentText.includes("選擇")
					) {
						buttonName = "瀏覽文件按鈕";
					} else if (href && href !== "#") {
						buttonName = `連結: ${href.split("/").pop() || href}`;
					} else {
						// 基於類名的識別
						const meaningfulClasses = buttonClass
							.split(" ")
							.find((cls) =>
								[
									"btn",
									"button",
									"upload",
									"delete",
									"close",
									"submit",
									"cta",
									"primary",
									"secondary",
								].some((keyword) =>
									cls.toLowerCase().includes(keyword)
								)
							);
						buttonName = meaningfulClasses
							? `${meaningfulClasses}按鈕`
							: "未知按鈕";
					}
				}

				// 按鈕類型判斷
				const isButton = button.tagName === "BUTTON";
				const isInput =
					button.tagName === "INPUT" &&
					["submit", "button"].includes(button.type);
				const isLink = button.tagName === "A";

				// 頁面上下文
				const pageUrl = window.location.pathname;
				const pageTitle = document.title;

				// 按鈕位置資訊
				const rect = button.getBoundingClientRect();
				const position = {
					x: Math.round(rect.left),
					y: Math.round(rect.top),
					width: Math.round(rect.width),
					height: Math.round(rect.height),
				};

				// 發送到 Mixpanel
				FengShuiMixpanel.trackButtonClick(buttonName, {
					按鈕文字: buttonText,
					按鈕ID: buttonId,
					按鈕類別: buttonClass,
					按鈕標籤: buttonAriaLabel,
					按鈕連結: href,
					按鈕類型: button.tagName.toLowerCase(),
					是否按鈕: isButton,
					是否輸入: isInput,
					是否連結: isLink,
					頁面路徑: pageUrl,
					頁面標題: pageTitle,
					按鈕位置: position,
					點擊時間戳: new Date().toISOString(),
					語言: pageUrl.includes("/zh-CN/") ? "zh-CN" : "zh-TW",
				});

				console.log(
					`🔘 Mixpanel 按鈕追蹤: "${buttonName}" 在 ${pageUrl}`
				);
			}
		};

		// 添加事件監聽器
		document.addEventListener("click", trackButtonClick, true);

		// 清理
		return () => {
			document.removeEventListener("click", trackButtonClick, true);
		};
	}, []);

	return null;
}
