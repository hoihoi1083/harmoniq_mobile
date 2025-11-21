/**
 * Intelligent Caching System
 * Provides smart caching with TTL, invalidation, and optimization strategies
 */

// Cache Configuration
const CACHE_CONFIG = {
	defaultTTL: 30 * 60 * 1000, // 30 minutes
	maxSize: 100, // Maximum cache entries
	compressionThreshold: 1024, // Compress entries larger than 1KB
	persistentStorage: true,
	intelligentPrefetch: true,
	backgroundRefresh: true,
};

// Cache Strategies
const CACHE_STRATEGIES = {
	WRITE_THROUGH: "write_through",
	WRITE_BEHIND: "write_behind",
	CACHE_ASIDE: "cache_aside",
	REFRESH_AHEAD: "refresh_ahead",
};

// Cache Entry Structure
class CacheEntry {
	constructor(key, data, ttl = CACHE_CONFIG.defaultTTL, metadata = {}) {
		this.key = key;
		this.data = data;
		this.timestamp = Date.now();
		this.ttl = ttl;
		this.accessCount = 0;
		this.lastAccessed = Date.now();
		this.metadata = {
			size: this.calculateSize(data),
			compressed: false,
			version: "1.0",
			...metadata,
		};

		// Compress if needed
		if (this.metadata.size > CACHE_CONFIG.compressionThreshold) {
			this.compressData();
		}
	}

	calculateSize(data) {
		return JSON.stringify(data).length;
	}

	compressData() {
		try {
			// Simple compression simulation (in real app, use actual compression)
			this.data = {
				__compressed: true,
				data: this.data,
			};
			this.metadata.compressed = true;
		} catch (error) {
			console.warn("Compression failed:", error);
		}
	}

	decompressData() {
		if (this.metadata.compressed && this.data.__compressed) {
			return this.data.data;
		}
		return this.data;
	}

	isExpired() {
		return Date.now() - this.timestamp > this.ttl;
	}

	access() {
		this.accessCount++;
		this.lastAccessed = Date.now();
		return this.decompressData();
	}

	getScore() {
		const ageMs = Date.now() - this.timestamp;
		const recentMs = Date.now() - this.lastAccessed;

		// Score based on access frequency and recency
		return (this.accessCount * 1000) / (ageMs + recentMs + 1);
	}
}

// Main Cache Class
export class IntelligentCache {
	constructor(config = {}) {
		this.config = { ...CACHE_CONFIG, ...config };
		this.cache = new Map();
		this.stats = {
			hits: 0,
			misses: 0,
			evictions: 0,
			writes: 0,
			errors: 0,
		};
		this.prefetchQueue = new Set();
		this.backgroundTasks = new Map();

		this.initializePersistentStorage();
		this.startBackgroundTasks();
	}

	// Core Cache Operations

	get(key, options = {}) {
		const entry = this.cache.get(key);

		if (!entry || entry.isExpired()) {
			this.stats.misses++;

			if (entry && entry.isExpired()) {
				this.cache.delete(key);
			}

			// Try refresh-ahead strategy
			if (options.refreshAhead && entry) {
				this.scheduleBackgroundRefresh(key, options.refreshFunction);
				return entry.access(); // Return stale data while refreshing
			}

			return null;
		}

		this.stats.hits++;

		// Intelligent prefetching
		if (this.config.intelligentPrefetch) {
			this.triggerIntelligentPrefetch(key);
		}

		return entry.access();
	}

	set(key, data, options = {}) {
		try {
			const ttl = options.ttl || this.config.defaultTTL;
			const metadata = options.metadata || {};

			const entry = new CacheEntry(key, data, ttl, metadata);

			// Check cache size and evict if necessary
			if (this.cache.size >= this.config.maxSize) {
				this.evictLeastValuable();
			}

			this.cache.set(key, entry);
			this.stats.writes++;

			// Persist to storage if enabled
			if (this.config.persistentStorage) {
				this.persistEntry(key, entry);
			}

			return true;
		} catch (error) {
			this.stats.errors++;
			console.error("Cache set error:", error);
			return false;
		}
	}

	delete(key) {
		const deleted = this.cache.delete(key);

		if (this.config.persistentStorage) {
			this.removePersistentEntry(key);
		}

		return deleted;
	}

	has(key) {
		const entry = this.cache.get(key);
		return entry && !entry.isExpired();
	}

	clear() {
		this.cache.clear();

		if (this.config.persistentStorage) {
			localStorage.removeItem(this.getStorageKey());
		}
	}

	// Advanced Operations

	getOrSet(key, factory, options = {}) {
		const cached = this.get(key, options);
		if (cached !== null) {
			return Promise.resolve(cached);
		}

		return Promise.resolve(factory())
			.then((data) => {
				this.set(key, data, options);
				return data;
			})
			.catch((error) => {
				this.stats.errors++;
				throw error;
			});
	}

	invalidatePattern(pattern) {
		const regex = new RegExp(pattern);
		const keysToDelete = [];

		this.cache.forEach((entry, key) => {
			if (regex.test(key)) {
				keysToDelete.push(key);
			}
		});

		keysToDelete.forEach((key) => this.delete(key));
		return keysToDelete.length;
	}

	warmUp(keyValuePairs) {
		return Promise.all(
			keyValuePairs.map(({ key, value, options }) =>
				this.set(key, value, options)
			)
		);
	}

	// Intelligent Features

	prefetch(keys, factory) {
		keys.forEach((key) => {
			if (!this.has(key) && !this.prefetchQueue.has(key)) {
				this.prefetchQueue.add(key);

				// Schedule prefetch
				setTimeout(async () => {
					try {
						const data = await factory(key);
						this.set(key, data, {
							ttl: this.config.defaultTTL * 2,
						}); // Longer TTL for prefetched
						this.prefetchQueue.delete(key);
					} catch (error) {
						console.warn("Prefetch failed for key:", key, error);
						this.prefetchQueue.delete(key);
					}
				}, 100);
			}
		});
	}

	triggerIntelligentPrefetch(accessedKey) {
		// Predict related keys based on patterns
		const relatedKeys = this.predictRelatedKeys(accessedKey);

		if (relatedKeys.length > 0) {
			// Don't prefetch if already in queue or cache
			const keysToPrefetch = relatedKeys.filter(
				(key) => !this.has(key) && !this.prefetchQueue.has(key)
			);

			if (keysToPrefetch.length > 0) {
				// This would need to be connected to your data source
				console.log("Would prefetch keys:", keysToPrefetch);
			}
		}
	}

	predictRelatedKeys(key) {
		// Analyze key patterns to predict related keys
		const predictions = [];

		// Pattern 1: Component dependencies
		const componentMap = {
			analysis_MingJu: ["analysis_FiveElement", "analysis_GanZhi"],
			analysis_JiXiong: ["analysis_GanZhi", "analysis_LiuNianGanZhi"],
			analysis_CoreSuggestion: ["analysis_Season", "analysis_MingJu"],
			analysis_SpecificSuggestion: ["analysis_CoreSuggestion"],
		};

		if (componentMap[key]) {
			predictions.push(...componentMap[key]);
		}

		// Pattern 2: User-based patterns
		if (key.includes("user_")) {
			const userId = key.split("_")[1];
			predictions.push(
				`user_${userId}_preferences`,
				`user_${userId}_history`
			);
		}

		return predictions;
	}

	scheduleBackgroundRefresh(key, refreshFunction) {
		if (!refreshFunction || this.backgroundTasks.has(key)) {
			return;
		}

		const taskId = setTimeout(async () => {
			try {
				const freshData = await refreshFunction();
				this.set(key, freshData);
				this.backgroundTasks.delete(key);
			} catch (error) {
				console.warn("Background refresh failed:", error);
				this.backgroundTasks.delete(key);
			}
		}, 1000); // 1 second delay

		this.backgroundTasks.set(key, taskId);
	}

	// Cache Management

	evictLeastValuable() {
		let leastValuableKey = null;
		let lowestScore = Infinity;

		this.cache.forEach((entry, key) => {
			const score = entry.getScore();
			if (score < lowestScore) {
				lowestScore = score;
				leastValuableKey = key;
			}
		});

		if (leastValuableKey) {
			this.cache.delete(leastValuableKey);
			this.stats.evictions++;
		}
	}

	cleanup() {
		const now = Date.now();
		const expiredKeys = [];

		this.cache.forEach((entry, key) => {
			if (entry.isExpired()) {
				expiredKeys.push(key);
			}
		});

		expiredKeys.forEach((key) => this.cache.delete(key));
		return expiredKeys.length;
	}

	// Analytics and Monitoring

	getStats() {
		const hitRate =
			this.stats.hits / (this.stats.hits + this.stats.misses) || 0;

		return {
			...this.stats,
			hitRate: Math.round(hitRate * 100),
			cacheSize: this.cache.size,
			memoryUsage: this.calculateMemoryUsage(),
		};
	}

	calculateMemoryUsage() {
		let totalSize = 0;
		this.cache.forEach((entry) => {
			totalSize += entry.metadata.size;
		});
		return totalSize;
	}

	getEntryDetails(key) {
		const entry = this.cache.get(key);
		if (!entry) return null;

		return {
			key,
			size: entry.metadata.size,
			age: Date.now() - entry.timestamp,
			ttl: entry.ttl,
			accessCount: entry.accessCount,
			lastAccessed: entry.lastAccessed,
			score: entry.getScore(),
			compressed: entry.metadata.compressed,
			expired: entry.isExpired(),
		};
	}

	getTopEntries(limit = 10) {
		const entries = Array.from(this.cache.entries())
			.map(([key, entry]) => ({ key, entry }))
			.sort((a, b) => b.entry.getScore() - a.entry.getScore())
			.slice(0, limit);

		return entries.map(({ key, entry }) => this.getEntryDetails(key));
	}

	// Persistent Storage

	initializePersistentStorage() {
		if (!this.config.persistentStorage) return;

		try {
			const stored = localStorage.getItem(this.getStorageKey());
			if (stored) {
				const data = JSON.parse(stored);

				Object.entries(data).forEach(([key, entryData]) => {
					// Restore non-expired entries
					if (Date.now() - entryData.timestamp < entryData.ttl) {
						const entry = new CacheEntry(
							key,
							entryData.data,
							entryData.ttl,
							entryData.metadata
						);
						entry.timestamp = entryData.timestamp;
						entry.accessCount = entryData.accessCount || 0;
						entry.lastAccessed =
							entryData.lastAccessed || entryData.timestamp;

						this.cache.set(key, entry);
					}
				});
			}
		} catch (error) {
			console.warn("Failed to restore cache from storage:", error);
		}
	}

	persistEntry(key, entry) {
		try {
			const stored = JSON.parse(
				localStorage.getItem(this.getStorageKey()) || "{}"
			);
			stored[key] = {
				data: entry.data,
				timestamp: entry.timestamp,
				ttl: entry.ttl,
				accessCount: entry.accessCount,
				lastAccessed: entry.lastAccessed,
				metadata: entry.metadata,
			};

			localStorage.setItem(this.getStorageKey(), JSON.stringify(stored));
		} catch (error) {
			console.warn("Failed to persist cache entry:", error);
		}
	}

	removePersistentEntry(key) {
		try {
			const stored = JSON.parse(
				localStorage.getItem(this.getStorageKey()) || "{}"
			);
			delete stored[key];
			localStorage.setItem(this.getStorageKey(), JSON.stringify(stored));
		} catch (error) {
			console.warn("Failed to remove persistent cache entry:", error);
		}
	}

	getStorageKey() {
		return "fengshui_intelligent_cache";
	}

	// Background Tasks

	startBackgroundTasks() {
		// Cleanup expired entries every 5 minutes
		setInterval(
			() => {
				this.cleanup();
			},
			5 * 60 * 1000
		);

		// Persist cache every minute
		if (this.config.persistentStorage) {
			setInterval(() => {
				this.persistCache();
			}, 60 * 1000);
		}
	}

	persistCache() {
		try {
			const cacheData = {};
			this.cache.forEach((entry, key) => {
				if (!entry.isExpired()) {
					cacheData[key] = {
						data: entry.data,
						timestamp: entry.timestamp,
						ttl: entry.ttl,
						accessCount: entry.accessCount,
						lastAccessed: entry.lastAccessed,
						metadata: entry.metadata,
					};
				}
			});

			localStorage.setItem(
				this.getStorageKey(),
				JSON.stringify(cacheData)
			);
		} catch (error) {
			console.warn("Failed to persist cache:", error);
		}
	}
}

// Cache Manager for Different Domains
export class CacheManager {
	constructor() {
		this.caches = {
			analysis: new IntelligentCache({
				defaultTTL: 30 * 60 * 1000, // 30 minutes for analysis
				maxSize: 50,
			}),

			user: new IntelligentCache({
				defaultTTL: 24 * 60 * 60 * 1000, // 24 hours for user data
				maxSize: 20,
			}),

			prompts: new IntelligentCache({
				defaultTTL: 60 * 60 * 1000, // 1 hour for prompts
				maxSize: 30,
			}),

			metadata: new IntelligentCache({
				defaultTTL: 6 * 60 * 60 * 1000, // 6 hours for metadata
				maxSize: 100,
			}),
		};
	}

	getCache(domain) {
		return this.caches[domain];
	}

	// Analysis Cache Methods

	getCachedAnalysis(componentName, userInfo) {
		const key = this.generateAnalysisKey(componentName, userInfo);
		return this.caches.analysis.get(key);
	}

	setCachedAnalysis(componentName, userInfo, result, options = {}) {
		const key = this.generateAnalysisKey(componentName, userInfo);
		return this.caches.analysis.set(key, result, {
			ttl: options.ttl || 30 * 60 * 1000,
			metadata: {
				componentName,
				userGender: userInfo.gender,
				userConcern: userInfo.concern,
			},
		});
	}

	generateAnalysisKey(componentName, userInfo) {
		const keyData = {
			component: componentName,
			birth: userInfo.birthDateTime,
			gender: userInfo.gender,
			concern: userInfo.concern,
			problem: userInfo.problem,
		};

		// Create deterministic key
		return `analysis_${componentName}_${this.hashObject(keyData)}`;
	}

	// User Cache Methods

	getCachedUserData(userId) {
		return this.caches.user.get(`user_${userId}`);
	}

	setCachedUserData(userId, userData) {
		return this.caches.user.set(`user_${userId}`, userData);
	}

	// Utility Methods

	hashObject(obj) {
		const str = JSON.stringify(obj, Object.keys(obj).sort());
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return Math.abs(hash).toString(36);
	}

	invalidateUserAnalyses(userInfo) {
		const pattern = `analysis_.*_${this.hashObject({
			birth: userInfo.birthDateTime,
			gender: userInfo.gender,
		})}.*`;

		return this.caches.analysis.invalidatePattern(pattern);
	}

	getAllStats() {
		const stats = {};
		Object.entries(this.caches).forEach(([domain, cache]) => {
			stats[domain] = cache.getStats();
		});
		return stats;
	}

	clearAll() {
		Object.values(this.caches).forEach((cache) => cache.clear());
	}
}

// Global Cache Instance
export const globalCache = new CacheManager();

// Cache Decorators/Helpers

export const withCache = (cacheKey, ttl = CACHE_CONFIG.defaultTTL) => {
	return (target, propertyKey, descriptor) => {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args) {
			const key =
				typeof cacheKey === "function" ? cacheKey(...args) : cacheKey;

			// Try to get from cache
			const cached = globalCache.getCache("analysis").get(key);
			if (cached) {
				return cached;
			}

			// Execute original method
			const result = await originalMethod.apply(this, args);

			// Cache result
			globalCache.getCache("analysis").set(key, result, { ttl });

			return result;
		};

		return descriptor;
	};
};

export const cacheUtils = {
	// Generate cache key for component analysis
	analysisKey: (componentName, userInfo) =>
		globalCache.generateAnalysisKey(componentName, userInfo),

	// Check if analysis is cached
	hasAnalysis: (componentName, userInfo) =>
		globalCache.getCachedAnalysis(componentName, userInfo) !== null,

	// Warm up cache with common analyses
	warmUpCache: async (userInfo, components) => {
		// This would be implemented with actual analysis functions
		console.log("Warming up cache for components:", components);
	},

	// Clear cache for specific user
	clearUserCache: (userInfo) => globalCache.invalidateUserAnalyses(userInfo),

	// Get cache statistics
	getStats: () => globalCache.getAllStats(),
};

export default {
	IntelligentCache,
	CacheManager,
	globalCache,
	cacheUtils,
	withCache,
	CACHE_CONFIG,
	CACHE_STRATEGIES,
};
