// IP Geolocation utility functions

// Option 1: Using ipapi.co (Free tier: 1000 requests/day)
export const getLocationFromIP = async () => {
	try {
		const response = await fetch("https://ipapi.co/json/");
		const data = await response.json();
		return {
			ip: data.ip,
			country: data.country_name,
			countryCode: data.country_code,
			region: data.region,
			city: data.city,
			timezone: data.timezone,
		};
	} catch (error) {
		console.error("Error fetching IP location:", error);
		return null;
	}
};

// Option 2: Using ip-api.com (Free, no API key needed)
export const getLocationFromIPApi = async () => {
	try {
		const response = await fetch("http://ip-api.com/json/");
		const data = await response.json();
		return {
			ip: data.query,
			country: data.country,
			countryCode: data.countryCode,
			region: data.regionName,
			city: data.city,
			timezone: data.timezone,
		};
	} catch (error) {
		console.error("Error fetching IP location:", error);
		return null;
	}
};

// Check if user is from China or Hong Kong
export const isFromChinaOrHK = async () => {
	try {
		const location = await getLocationFromIP();
		if (!location) return false;

		const chinaHKCodes = ["CN", "HK", "MO"]; // China, Hong Kong, Macau
		return chinaHKCodes.includes(location.countryCode);
	} catch (error) {
		console.error("Error checking location:", error);
		return false;
	}
};

// Get specific region info for Chinese users
export const getChineseRegionInfo = async () => {
	try {
		const location = await getLocationFromIP();
		if (!location) return null;

		return {
			isMainlandChina: location.countryCode === "CN",
			isHongKong: location.countryCode === "HK",
			isMacau: location.countryCode === "MO",
			location: location,
		};
	} catch (error) {
		console.error("Error getting Chinese region info:", error);
		return null;
	}
};
