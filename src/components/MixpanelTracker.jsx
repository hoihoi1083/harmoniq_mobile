"use client";
import { useEffect } from "react";
import FengShuiMixpanel from "@/lib/mixpanel";

export default function MixpanelTracker() {
	useEffect(() => {
		// 頁面瀏覽追蹤
		const trackPageView = () => {
			const pageName = getPageNameFromPath(window.location.pathname);
			FengShuiMixpanel.trackPageView(pageName, {
				頁面標題: document.title,
				來源: document.referrer,
				載入時間: performance.now(),
			});
		};

		// 初始頁面瀏覽
		trackPageView();

		// 監聽路由變化（Next.js）
		const handleRouteChange = () => {
			setTimeout(trackPageView, 100); // 延遲確保頁面標題已更新
		};

		// 滾動深度追蹤
		let maxScrollDepth = 0;
		const trackScrollDepth = () => {
			const scrollPercent = Math.round(
				(window.scrollY /
					(document.documentElement.scrollHeight -
						window.innerHeight)) *
					100
			);

			if (scrollPercent > maxScrollDepth) {
				maxScrollDepth = scrollPercent;

				// 追蹤重要滾動里程碑
				if ([25, 50, 75, 90].includes(scrollPercent)) {
					FengShuiMixpanel.track("滾動深度", {
						滾動百分比: scrollPercent,
						頁面: window.location.pathname,
					});
				}
			}
		};

		// 頁面停留時間追蹤
		const startTime = Date.now();
		const trackTimeOnPage = () => {
			const timeSpent = Math.round((Date.now() - startTime) / 1000);

			// 追蹤重要時間節點
			if ([30, 60, 180, 300].includes(timeSpent)) {
				FengShuiMixpanel.track("頁面停留時間", {
					停留秒數: timeSpent,
					頁面: window.location.pathname,
					滾動深度: maxScrollDepth,
				});
			}
		};

		// 離開頁面時追蹤
		const handleBeforeUnload = () => {
			const timeSpent = Math.round((Date.now() - startTime) / 1000);
			FengShuiMixpanel.track("離開頁面", {
				停留總時間: timeSpent,
				最大滾動深度: maxScrollDepth,
				頁面: window.location.pathname,
			});
		};

		// 事件監聽器
		window.addEventListener("scroll", trackScrollDepth, { passive: true });
		window.addEventListener("beforeunload", handleBeforeUnload);

		// 定期追蹤停留時間
		const timeInterval = setInterval(trackTimeOnPage, 30000); // 每30秒

		// 清理函數
		return () => {
			window.removeEventListener("scroll", trackScrollDepth);
			window.removeEventListener("beforeunload", handleBeforeUnload);
			clearInterval(timeInterval);
			handleBeforeUnload(); // 最後一次追蹤
		};
	}, []);

	// 從路徑獲取頁面名稱
	const getPageNameFromPath = (pathname) => {
		const pathMap = {
			"/zh-TW": "繁體中文首頁",
			"/zh-CN": "簡體中文首頁",
			"/zh-TW/design": "風水設計頁面",
			"/zh-TW/price": "服務定價頁面",
			"/zh-TW/report": "分析報告頁面",
			"/zh-TW/analytics": "數據儀表板",
		};

		return (
			pathMap[pathname] ||
			pathname.replace(/^\//, "").replace(/\//g, " > ") ||
			"首頁"
		);
	};

	return null; // 這個組件不需要渲染任何內容
}

// 自動按鈕追蹤Hook
export function useMixpanelButtonTracking() {
	useEffect(() => {
		const handleClick = (event) => {
			const target = event.target;

			// 只追蹤按鈕和連結
			if (
				target.tagName === "BUTTON" ||
				target.tagName === "A" ||
				target.closest("button") ||
				target.closest("a")
			) {
				const element =
					target.closest("button") || target.closest("a") || target;

				// 獲取按鈕文字和上下文
				const buttonText =
					element.textContent?.trim() ||
					element.getAttribute("aria-label") ||
					element.getAttribute("title") ||
					"未知按鈕";

				const buttonType = element.tagName.toLowerCase();
				const position = getElementPosition(element);
				const pageContext = getPageContext();

				FengShuiMixpanel.trackButtonClick(buttonText, {
					按鈕類型: buttonType,
					按鈕位置: position,
					頁面上下文: pageContext,
					按鈕類名: element.className,
					按鈕ID: element.id,
				});
			}
		};

		document.addEventListener("click", handleClick, true);

		return () => {
			document.removeEventListener("click", handleClick, true);
		};
	}, []);

	// 獲取元素在頁面中的位置
	const getElementPosition = (element) => {
		const rect = element.getBoundingClientRect();
		const scrollTop =
			window.pageYOffset || document.documentElement.scrollTop;

		return {
			x: Math.round(rect.left),
			y: Math.round(rect.top + scrollTop),
			可視區域內: rect.top >= 0 && rect.bottom <= window.innerHeight,
		};
	};

	// 獲取頁面上下文
	const getPageContext = () => {
		return {
			頁面路徑: window.location.pathname,
			頁面標題: document.title,
			視窗大小: `${window.innerWidth}x${window.innerHeight}`,
			滾動位置: window.pageYOffset,
		};
	};
}
