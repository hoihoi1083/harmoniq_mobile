"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const pageNames = {
	// Home Pages
	"/zh-TW": "Home Page",
	"/zh-CN": "Home Page (CN)",

	// Main Service Pages
	"/zh-TW/design": "Room Design Page",
	"/zh-TW/report": "General Report Page",
	"/zh-TW/success": "Success Page",
	"/zh-TW/price": "Pricing Page",
	"/zh-CN/design": "Room Design Page (CN)",
	"/zh-CN/report": "General Report Page (CN)",
	"/zh-CN/success": "Success Page (CN)",
	"/zh-CN/price": "Pricing Page (CN)",

	// Analysis & Report Pages
	"/zh-TW/feng-shui-report": "Feng Shui Analysis Report",
	"/zh-TW/couple-report": "Couple Analysis Report",
	"/zh-TW/bazhai-report": "Bazhai Analysis Report",
	"/zh-TW/four-fortune-analysis": "Four Fortune Analysis",
	"/zh-CN/feng-shui-report": "Feng Shui Analysis Report (CN)",
	"/zh-CN/couple-report": "Couple Analysis Report (CN)",
	"/zh-CN/bazhai-report": "Bazhai Analysis Report (CN)",
	"/zh-CN/four-fortune-analysis": "Four Fortune Analysis (CN)",

	// Entry & Input Pages
	"/zh-TW/birthday-entry": "Birthday Entry Form",
	"/zh-TW/couple-entry": "Couple Entry Form",
	"/zh-TW/fortune-entry": "Fortune Entry Form",
	"/zh-CN/birthday-entry": "Birthday Entry Form (CN)",
	"/zh-CN/couple-entry": "Couple Entry Form (CN)",
	"/zh-CN/fortune-entry": "Fortune Entry Form (CN)",

	// Chat & Interactive Pages
	"/zh-TW/chat": "Chat Interface",
	"/zh-TW/smart-chat2": "AI Chat Interface",
	"/zh-CN/chat": "Chat Interface (CN)",
	"/zh-CN/smart-chat2": "AI Chat Interface (CN)",

	// User Management Pages
	"/zh-TW/auth": "Authentication",
	"/zh-TW/customer": "Customer Dashboard",
	"/zh-TW/payment": "Payment Page",
	"/zh-TW/report-history": "Report History",
	"/zh-CN/auth": "Authentication (CN)",
	"/zh-CN/customer": "Customer Dashboard (CN)",
	"/zh-CN/payment": "Payment Page (CN)",
	"/zh-CN/report-history": "Report History (CN)",

	// Demo & Test Pages
	"/zh-TW/demo": "Demo Page",
	"/zh-TW/test-history": "Test History",
	"/zh-CN/demo": "Demo Page (CN)",
	"/zh-CN/test-history": "Test History (CN)",

	// Home subdirectory (if exists)
	"/zh-TW/home": "Home Subdirectory",
	"/zh-CN/home": "Home Subdirectory (CN)",
};

export default function PageTracker() {
	const pathname = usePathname();

	useEffect(() => {
		const trackPage = () => {
			if (typeof window !== "undefined" && window.gtag) {
				const pageName = pageNames[pathname] || `Page: ${pathname}`;

				// Send page view with custom title
				window.gtag("event", "page_view", {
					page_title: pageName,
					page_location: window.location.href,
					page_path: pathname,
					custom_page_name: pageName,
					page_referrer: document.referrer || "(direct)",
				});

				console.log(`Page tracked: ${pageName} at ${pathname}`);
				return true;
			}
			return false;
		};

		// Retry logic for gtag availability
		let attempts = 0;
		const maxAttempts = 50; // 5 seconds max wait

		const tryTracking = () => {
			if (trackPage() || attempts >= maxAttempts) {
				return;
			}
			attempts++;
			setTimeout(tryTracking, 100);
		};

		tryTracking();
	}, [pathname]);

	return null; // This component doesn't render anything
}
