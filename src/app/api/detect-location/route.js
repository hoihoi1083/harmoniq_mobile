// Server-side IP detection API route
// File: pages/api/detect-location.js or app/api/detect-location/route.js

import { NextResponse } from "next/server";

// Get client IP from request headers
function getClientIP(request) {
	const forwarded = request.headers.get("x-forwarded-for");
	const realIP = request.headers.get("x-real-ip");
	const cfConnectingIP = request.headers.get("cf-connecting-ip"); // Cloudflare

	if (forwarded) {
		return forwarded.split(",")[0].trim();
	}
	if (realIP) {
		return realIP;
	}
	if (cfConnectingIP) {
		return cfConnectingIP;
	}

	return request.ip || "unknown";
}

// Check if IP is from China/HK using a geolocation service
async function getLocationFromIP(ip) {
	try {
		// Using ip-api.com (free service)
		const response = await fetch(`http://ip-api.com/json/${ip}`);
		const data = await response.json();

		return {
			ip: data.query,
			country: data.country,
			countryCode: data.countryCode,
			region: data.regionName,
			city: data.city,
			isp: data.isp,
			timezone: data.timezone,
		};
	} catch (error) {
		console.error("Error fetching location:", error);
		return null;
	}
}


// Required for static export with Capacitor
export const dynamic = 'force-static';

export async function GET(request) {
	try {
		const clientIP = getClientIP(request);
		console.log("Client IP:", clientIP);

		if (clientIP === "unknown") {
			return NextResponse.json({
				error: "Unable to detect IP address",
				isChina: false,
				isHongKong: false,
			});
		}

		const location = await getLocationFromIP(clientIP);

		if (!location) {
			return NextResponse.json({
				error: "Unable to get location data",
				ip: clientIP,
				isChina: false,
				isHongKong: false,
			});
		}

		const isChina = location.countryCode === "CN";
		const isHongKong = location.countryCode === "HK";
		const isMacau = location.countryCode === "MO";
		const isChinaRegion = isChina || isHongKong || isMacau;

		return NextResponse.json({
			ip: clientIP,
			location: location,
			isChina: isChina,
			isHongKong: isHongKong,
			isMacau: isMacau,
			isChinaRegion: isChinaRegion,
			detectedAt: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Location detection error:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				isChina: false,
				isHongKong: false,
			},
			{ status: 500 }
		);
	}
}

// Alternative using middleware (more efficient)
// File: middleware.js
/*
import { NextResponse } from 'next/server';

export function middleware(request) {
    const country = request.geo?.country;
    const region = request.geo?.region;
    
    // Detect China/HK using Vercel's geo data
    const isChina = country === 'CN';
    const isHongKong = country === 'HK';
    const isMacau = country === 'MO';
    
    // Add geo information to headers
    const response = NextResponse.next();
    response.headers.set('x-user-country', country || 'unknown');
    response.headers.set('x-user-region', region || 'unknown');
    response.headers.set('x-is-china', isChina.toString());
    response.headers.set('x-is-hongkong', isHongKong.toString());
    
    return response;
}

export const config = {
    matcher: [
        // Match all paths except static files and API routes
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
*/
