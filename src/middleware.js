import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";
// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request) {
	const { pathname } = request.nextUrl;
	// Skip auth check for public routes
	const isPublicRoute =
		pathname === "/" ||
		pathname.startsWith("/auth") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/static") ||
		pathname.includes(".") ||
		pathname.includes("/auth/login") ||
		pathname === "/favicon.ico" ||
		pathname.includes("/price") || // 添加 price 頁面為公共路由
		pathname.includes("/customer") || // 允許 customer 頁面
		pathname.includes("/free") || // 允許 free 頁面
		pathname.includes("/success") || // Payment success page (mobile deep link target)
		pathname.includes("/fortune-entry") || // Data entry after payment (mobile)
		pathname.includes("/couple-entry") || // Couple data entry after payment (mobile)
		pathname.includes("/report") || // Report page (payment verified via session_id)
		pathname.includes("/feng-shui-report") || // Fortune category report page (mobile)
		pathname.includes("/couple-report"); // Couple compatibility report page (mobile)

	// Handle internationalization first
	const response = intlMiddleware(request);
	// If it's a public route, no need to check authentication
	if (isPublicRoute) {
		return response;
	}

	// Check if the user is authenticated (web or mobile)
	const token = await getToken({
		secureCookie: process.env.NODE_ENV !== "development",
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	// Check for mobile session headers
	const mobileUserEmail = request.headers.get("X-User-Email");
	const mobileUserId = request.headers.get("X-User-ID");
	const hasMobileSession = !!(mobileUserEmail || mobileUserId);

	// If not authenticated (neither web token nor mobile session), redirect to login page
	if (!token && !hasMobileSession) {
		//console.log('pathname', request.nextUrl.pathname);
		const referer = request.headers.get("referer") || "";
		//console.log('request.url', request.nextUrl, referer);
		// // 检查来源是否已经是登录页，避免循环重定向
		if (referer.includes("/auth/login")) {
			return response;
		}
		//允许目标页面是首页、隐私条款等页面
		if (
			!request.nextUrl.pathname.includes("/design") &&
			!request.nextUrl.pathname.includes("/report")
		) {
			return response;
		}

		const locale = referer.indexOf("zh-CN") >= 0 ? "zh-CN" : "zh-TW";
		// ?callbackUrl=${request.nextUrl.pathname}

		return NextResponse.redirect(
			new URL(
				`/${locale}/auth/login?callbackUrl=${request.nextUrl.pathname}`,
				request.url
			)
		);
	}
	return response;
}

export const config = {
	// 匹配所有路径
	matcher: ["/((?!api|_next|.*\\..*).*)", "/"],
};
