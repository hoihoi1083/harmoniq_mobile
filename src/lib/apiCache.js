// Global API Cache Utility for Feng Shui Report APIs
// Prevents duplicate AI API calls and improves performance

// Global cache storage
const globalApiCache = new Map();
const pendingRequests = new Map();

// Cache configuration
const CACHE_CONFIG = {
	// Cache TTL in milliseconds (1 hour)
	TTL: 60 * 60 * 1000,
	// Maximum cache size
	MAX_SIZE: 1000,
};

/**
 * Generate a unique cache key based on API type and user parameters
 */
function generateCacheKey(apiType, userInfo, additionalParams = {}) {
	if (!userInfo?.birthDateTime) return null;

	const date = new Date(userInfo.birthDateTime);
	const baseKey = `${apiType}_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${userInfo.gender || ""}`;

	// Add additional parameters to make key unique
	const paramKeys = Object.keys(additionalParams).sort();
	const paramString =
		paramKeys.length > 0
			? "_" +
				paramKeys
					.map((key) => `${key}:${additionalParams[key]}`)
					.join("_")
			: "";

	return baseKey + paramString;
}

/**
 * Check if cache entry is expired
 */
function isCacheExpired(entry) {
	return Date.now() - entry.timestamp > CACHE_CONFIG.TTL;
}

/**
 * Clean up expired cache entries
 */
function cleanupExpiredCache() {
	for (const [key, entry] of globalApiCache.entries()) {
		if (isCacheExpired(entry)) {
			globalApiCache.delete(key);
		}
	}

	// If cache is still too large, remove oldest entries
	if (globalApiCache.size > CACHE_CONFIG.MAX_SIZE) {
		const entries = Array.from(globalApiCache.entries()).sort(
			(a, b) => a[1].timestamp - b[1].timestamp
		);

		const toRemove = entries.slice(
			0,
			globalApiCache.size - CACHE_CONFIG.MAX_SIZE
		);
		toRemove.forEach(([key]) => globalApiCache.delete(key));
	}
}

/**
 * Get cached result if available
 */
function getCachedResult(cacheKey, requestId) {
	if (!cacheKey || !globalApiCache.has(cacheKey)) {
		return null;
	}

	const cachedEntry = globalApiCache.get(cacheKey);

	// Check if expired
	if (isCacheExpired(cachedEntry)) {
		globalApiCache.delete(cacheKey);
		console.log(`[${requestId}] 🗑️ Removed expired cache for ${cacheKey}`);
		return null;
	}

	console.log(`[${requestId}] 🎯 RETURNING CACHED RESULT for ${cacheKey}`);
	return {
		...cachedEntry.data,
		cached: true,
		requestId: requestId,
		originalRequestId: cachedEntry.originalRequestId,
		cacheAge: Date.now() - cachedEntry.timestamp,
	};
}

/**
 * Check if request is already pending
 */
async function waitForPendingRequest(cacheKey, requestId) {
	if (!cacheKey || !pendingRequests.has(cacheKey)) {
		return null;
	}

	console.log(
		`[${requestId}] 🚨 REQUEST ALREADY PENDING for ${cacheKey}, waiting...`
	);

	try {
		const pendingResult = await pendingRequests.get(cacheKey);
		console.log(`[${requestId}] ✅ Got result from pending request`);
		return {
			...pendingResult,
			waitedForResult: true,
			requestId: requestId,
			originalRequestId: pendingResult.requestId,
		};
	} catch (error) {
		console.log(
			`[${requestId}] ⚠️ Pending request failed, proceeding with new request`
		);
		pendingRequests.delete(cacheKey);
		return null;
	}
}

/**
 * Create a pending request promise
 */
function createPendingRequest(cacheKey, requestId) {
	if (!cacheKey) return { resolvePending: null, rejectPending: null };

	let resolvePending, rejectPending;
	const pendingPromise = new Promise((resolve, reject) => {
		resolvePending = resolve;
		rejectPending = reject;
	});

	pendingRequests.set(cacheKey, pendingPromise);
	console.log(`[${requestId}] 🔄 Created pending request for ${cacheKey}`);

	return { resolvePending, rejectPending };
}

/**
 * Cache successful result
 */
function cacheResult(cacheKey, result, requestId) {
	if (!cacheKey) return;

	// Clean up old entries periodically
	if (globalApiCache.size > CACHE_CONFIG.MAX_SIZE * 0.8) {
		cleanupExpiredCache();
	}

	const cacheEntry = {
		data: result,
		timestamp: Date.now(),
		originalRequestId: result.requestId || requestId,
	};

	globalApiCache.set(cacheKey, cacheEntry);
	console.log(`[${requestId}] ✅ CACHED result for ${cacheKey}`);
}

/**
 * Resolve pending request and clean up
 */
function resolvePendingRequest(cacheKey, result, requestId, resolvePending) {
	if (cacheKey && resolvePending) {
		resolvePending(result);
		pendingRequests.delete(cacheKey);
		console.log(
			`[${requestId}] ✅ Resolved pending promise for ${cacheKey}`
		);
	}
}

/**
 * Reject pending request and clean up on error
 */
function rejectPendingRequest(cacheKey, error, requestId, rejectPending) {
	if (cacheKey && rejectPending) {
		rejectPending(error);
		pendingRequests.delete(cacheKey);
		console.log(
			`[${requestId}] 🚨 Rejected pending promise for ${cacheKey}`
		);
	}
}

/**
 * Get cache statistics
 */
function getCacheStats() {
	return {
		totalEntries: globalApiCache.size,
		pendingRequests: pendingRequests.size,
		oldestEntry: Math.min(
			...Array.from(globalApiCache.values()).map((e) => e.timestamp)
		),
		newestEntry: Math.max(
			...Array.from(globalApiCache.values()).map((e) => e.timestamp)
		),
	};
}

// Export all utilities
export {
	generateCacheKey,
	getCachedResult,
	waitForPendingRequest,
	createPendingRequest,
	cacheResult,
	resolvePendingRequest,
	rejectPendingRequest,
	getCacheStats,
};
