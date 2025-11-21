"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import FengShuiMixpanel from "@/lib/mixpanel";

const pageNames = {
	// Home Pages
	"/zh-TW": "首頁",
	"/zh-CN": "首页",

	// Main Service Pages
	"/zh-TW/design": "房間設計頁面",
	"/zh-TW/report": "綜合報告頁面",
	"/zh-TW/success": "成功頁面",
	"/zh-TW/price": "價格頁面",
	"/zh-CN/design": "房间设计页面",
	"/zh-CN/report": "综合报告页面",
	"/zh-CN/success": "成功页面",
	"/zh-CN/price": "价格页面",

	// Analysis & Report Pages
	"/zh-TW/feng-shui-report": "風水分析報告",
	"/zh-TW/couple-report": "情侶配對報告",
	"/zh-TW/bazhai-report": "八宅分析報告",
	"/zh-TW/four-fortune-analysis": "四柱分析",
	"/zh-CN/feng-shui-report": "风水分析报告",
	"/zh-CN/couple-report": "情侣配对报告",
	"/zh-CN/bazhai-report": "八宅分析报告",
	"/zh-CN/four-fortune-analysis": "四柱分析",

	// Entry & Input Pages
	"/zh-TW/birthday-entry": "生日輸入表單",
	"/zh-TW/couple-entry": "情侶資料表單",
	"/zh-TW/fortune-entry": "運勢輸入表單",
	"/zh-CN/birthday-entry": "生日输入表单",
	"/zh-CN/couple-entry": "情侣资料表单",
	"/zh-CN/fortune-entry": "运势输入表单",

	// Chat & Interactive Pages
	"/zh-TW/chat": "聊天介面",
	"/zh-TW/smart-chat2": "AI聊天介面",
	"/zh-CN/chat": "聊天界面",
	"/zh-CN/smart-chat2": "AI聊天界面",

	// User Management Pages
	"/zh-TW/auth": "用戶認證",
	"/zh-TW/customer": "客戶儀表板",
	"/zh-TW/payment": "付款頁面",
	"/zh-TW/report-history": "報告歷史",
	"/zh-CN/auth": "用户认证",
	"/zh-CN/customer": "客户仪表板",
	"/zh-CN/payment": "付款页面",
	"/zh-CN/report-history": "报告历史",

	// Demo & Test Pages
	"/zh-TW/mixpanel-user-demo": "Mixpanel用戶演示",
	"/zh-TW/demo": "演示頁面",
	"/zh-TW/test-history": "測試歷史",
	"/zh-CN/demo": "演示页面",
	"/zh-CN/test-history": "测试历史",
};

export default function MixpanelPageTracker() {
	const pathname = usePathname();

	useEffect(() => {
		const trackPage = () => {
			if (typeof window !== "undefined") {
				const pageName = pageNames[pathname] || `頁面: ${pathname}`;

				// 追蹤到 Mixpanel
				FengShuiMixpanel.trackPageView(pageName, {
					完整路徑: pathname,
					頁面標題: document.title,
					來源頁面: document.referrer || "直接訪問",
					瀏覽器標籤: document.title,
					語言: pathname.includes("/zh-CN/") ? "zh-CN" : "zh-TW",
				});

				console.log(`🎯 Mixpanel 頁面追蹤: ${pageName} (${pathname})`);
			}
		};

		// 確保頁面載入後再追蹤
		const timer = setTimeout(trackPage, 100);
		return () => clearTimeout(timer);
	}, [pathname]);

	return null;
}
