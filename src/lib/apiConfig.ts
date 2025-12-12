/**
 * Mobile API Configuration
 *
 * This file provides the correct API base URL for mobile app
 * - In production: connects to live server (www.harmoniqfengshui.com)
 * - In development: can connect to local server or live server
 */

// Get API base URL from environment variable
export const getApiBaseUrl = (): string => {
	return (
		process.env.NEXT_PUBLIC_API_BASE_URL ||
		"https://www.harmoniqfengshui.com"
	);
};

export const API_CONFIG = {
	// Use environment variable or fallback to live server
	BASE_URL: getApiBaseUrl(),

	// Helper function to build full API URL
	getApiUrl: (path: string): string => {
		const baseUrl = getApiBaseUrl();
		// Ensure path starts with /
		const normalizedPath = path.startsWith("/") ? path : `/${path}`;

		// Return full URL
		return `${baseUrl}${normalizedPath}`;
	},
};

// Helper function for making API calls
// Usage: fetchApi('/api/smart-chat2', { method: 'POST', body: JSON.stringify({...}) })
export async function fetchApi(path: string, options?: RequestInit) {
	const url = API_CONFIG.getApiUrl(path);

	console.log("🌐 API Call:", url);

	const response = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});

	if (!response.ok) {
		console.error("❌ API Error:", response.status, response.statusText);
		throw new Error(`API Error: ${response.status} ${response.statusText}`);
	}

	return response;
}

// Reusable function to build API URL for any endpoint
// Usage: const url = buildApiUrl('/api/smart-chat2');
export const buildApiUrl = (endpoint: string): string => {
	return API_CONFIG.getApiUrl(endpoint);
};
