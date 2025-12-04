/**
 * Mobile-safe navigation utility for Capacitor apps
 * Handles hybrid mode: bundled static UI + live server for auth/payment
 */

import { Capacitor } from "@capacitor/core";

// Routes that require the live server
const SERVER_ROUTES = [
	"/auth/login",
	"/auth/signup",
	"/auth/callback",
	"/payment",
	"/api/",
];

const LIVE_SERVER = "https://www.harmoniqfengshui.com";

export function navigateMobile(path: string) {
	const isMobile = Capacitor.isNativePlatform();

	// Check if this route needs the live server
	const needsServer = SERVER_ROUTES.some((route) => path.startsWith(route));

	if (isMobile && needsServer) {
		// Redirect to live server for auth/payment
		console.log("🌐 Redirecting to live server:", path);
		window.location.href = `${LIVE_SERVER}${path}`;
	} else {
		// 🔧 FIX: For static export, add locale prefix and /index.html
		console.log("📱 Local navigation:", path);
		
		// Get current locale from URL (e.g., /zh-TW/ or /zh-CN/)
		const currentLocale = window.location.pathname.split('/')[1] || 'zh-TW';
		
		// Add locale prefix if path doesn't already have it
		// For Capacitor, pages are at /locale/path/index.html
		const finalPath = path.startsWith(`/${currentLocale}`) 
			? `${path}/index.html` 
			: `/${currentLocale}${path}/index.html`;
		
		console.log("🔄 Navigating to:", finalPath);
		
		// Force page reload to navigate (static export)
		window.location.href = finalPath;
	}
}

/**
 * Check if we're in a mobile environment
 */
export function isMobileApp() {
	return Capacitor.isNativePlatform();
}
