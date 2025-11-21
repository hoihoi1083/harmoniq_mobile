// 🔍 Advanced Search and Conversation History System
// Immediate Improvement: Find and bookmark important conversations

class ConversationSearchSystem {
	constructor() {
		this.searchIndex = new Map();
		this.conversations = [];
		this.bookmarks = [];
		this.searchHistory = [];

		// Search configuration
		this.searchConfig = {
			maxResults: 20,
			fuzzyMatchThreshold: 0.7,
			highlightResults: true,
			includeContext: true,
			searchFields: ["message", "response", "topic", "keywords"],
		};

		// Initialize search system
		this.initialize();
	}

	// Initialize search system
	initialize() {
		console.log("🔍 Conversation search system initialized");

		// Load existing conversations from storage
		this.loadConversationsFromStorage();

		// Build search index
		this.buildSearchIndex();

		// Setup auto-save
		this.setupAutoSave();
	}

	// Add new conversation to search system
	addConversation(conversationData) {
		const conversation = {
			id: this.generateConversationId(),
			timestamp: Date.now(),
			userMessage: conversationData.userMessage,
			aiResponse: conversationData.aiResponse,
			topic: conversationData.topic || "general",
			keywords: this.extractKeywords(
				conversationData.userMessage + " " + conversationData.aiResponse
			),
			metadata: {
				sessionId: conversationData.sessionId,
				responseTime: conversationData.responseTime || 0,
				satisfactionScore: conversationData.satisfactionScore || 0,
				conversationLength: conversationData.conversationLength || 0,
				detectedTopic: conversationData.detectedTopic,
				confidence: conversationData.confidence || 0,
			},
			context: {
				previousTopic: conversationData.previousTopic,
				topicTransition: conversationData.topicTransition,
				emotionalTone: conversationData.emotionalTone,
				userPersonality: conversationData.userPersonality,
			},
		};

		this.conversations.push(conversation);
		this.addToSearchIndex(conversation);
		this.saveToStorage();

		console.log(
			`💾 Added conversation ${conversation.id} to search system`
		);
		return conversation;
	}

	// Search conversations with advanced options
	searchConversations(query, options = {}) {
		const searchOptions = {
			...this.searchConfig,
			...options,
		};

		console.log(`🔍 Searching for: "${query}"`);

		// Record search in history
		this.addToSearchHistory(query, searchOptions);

		// Perform different types of searches
		const results = {
			exact: this.performExactSearch(query, searchOptions),
			fuzzy: this.performFuzzySearch(query, searchOptions),
			semantic: this.performSemanticSearch(query, searchOptions),
			topic: this.performTopicSearch(query, searchOptions),
			metadata: this.performMetadataSearch(query, searchOptions),
		};

		// Combine and rank results
		const combinedResults = this.combineSearchResults(
			results,
			searchOptions
		);

		// Apply filters
		const filteredResults = this.applySearchFilters(
			combinedResults,
			searchOptions
		);

		// Sort and limit results
		const finalResults = this.sortAndLimitResults(
			filteredResults,
			searchOptions
		);

		console.log(`📊 Found ${finalResults.length} results`);
		return {
			query,
			results: finalResults,
			totalFound: combinedResults.length,
			searchTime: Date.now(),
			suggestions: this.generateSearchSuggestions(query, finalResults),
		};
	}

	// Perform exact text search
	performExactSearch(query, options) {
		const results = [];
		const lowerQuery = query.toLowerCase();

		this.conversations.forEach((conversation) => {
			let score = 0;
			let matches = [];

			// Search in different fields
			options.searchFields.forEach((field) => {
				const content = this.getFieldContent(
					conversation,
					field
				).toLowerCase();

				if (content.includes(lowerQuery)) {
					score += this.getFieldWeight(field);
					matches.push({
						field,
						position: content.indexOf(lowerQuery),
						context: this.extractContext(content, lowerQuery),
					});
				}
			});

			if (score > 0) {
				results.push({
					conversation,
					score,
					matches,
					searchType: "exact",
				});
			}
		});

		return results;
	}

	// Perform fuzzy search for partial matches
	performFuzzySearch(query, options) {
		const results = [];
		const queryWords = query.toLowerCase().split(/\s+/);

		this.conversations.forEach((conversation) => {
			let score = 0;
			let matches = [];

			options.searchFields.forEach((field) => {
				const content = this.getFieldContent(
					conversation,
					field
				).toLowerCase();
				const contentWords = content.split(/\s+/);

				queryWords.forEach((queryWord) => {
					contentWords.forEach((contentWord) => {
						const similarity = this.calculateSimilarity(
							queryWord,
							contentWord
						);

						if (similarity >= options.fuzzyMatchThreshold) {
							score += similarity * this.getFieldWeight(field);
							matches.push({
								field,
								queryWord,
								matchedWord: contentWord,
								similarity,
								context: this.extractWordContext(
									content,
									contentWord
								),
							});
						}
					});
				});
			});

			if (score > 0) {
				results.push({
					conversation,
					score,
					matches,
					searchType: "fuzzy",
				});
			}
		});

		return results;
	}

	// Perform semantic search based on meaning
	performSemanticSearch(query, options) {
		const results = [];
		const queryKeywords = this.extractKeywords(query);

		this.conversations.forEach((conversation) => {
			let score = 0;
			let matches = [];

			// Match keywords
			const keywordOverlap = this.calculateKeywordOverlap(
				queryKeywords,
				conversation.keywords
			);
			if (keywordOverlap > 0) {
				score += keywordOverlap * 2; // Weight semantic matches highly
				matches.push({
					field: "keywords",
					overlap: keywordOverlap,
					matchedKeywords: queryKeywords.filter((k) =>
						conversation.keywords.includes(k)
					),
				});
			}

			// Match topics
			if (
				conversation.topic &&
				this.isTopicRelated(query, conversation.topic)
			) {
				score += 1.5;
				matches.push({
					field: "topic",
					matchedTopic: conversation.topic,
				});
			}

			if (score > 0) {
				results.push({
					conversation,
					score,
					matches,
					searchType: "semantic",
				});
			}
		});

		return results;
	}

	// Perform topic-based search
	performTopicSearch(query, options) {
		const results = [];
		const queryTopic = this.detectQueryTopic(query);

		if (!queryTopic) return results;

		this.conversations.forEach((conversation) => {
			if (
				conversation.topic === queryTopic ||
				conversation.metadata.detectedTopic === queryTopic
			) {
				results.push({
					conversation,
					score: 2.0,
					matches: [
						{
							field: "topic",
							matchedTopic: queryTopic,
						},
					],
					searchType: "topic",
				});
			}
		});

		return results;
	}

	// Perform metadata search (dates, satisfaction, etc.)
	performMetadataSearch(query, options) {
		const results = [];

		// Parse query for metadata filters
		const metadataFilters = this.parseMetadataQuery(query);

		if (Object.keys(metadataFilters).length === 0) return results;

		this.conversations.forEach((conversation) => {
			let score = 0;
			let matches = [];

			Object.entries(metadataFilters).forEach(([key, value]) => {
				if (this.matchesMetadataFilter(conversation, key, value)) {
					score += 1.0;
					matches.push({
						field: "metadata",
						filterKey: key,
						filterValue: value,
					});
				}
			});

			if (score > 0) {
				results.push({
					conversation,
					score,
					matches,
					searchType: "metadata",
				});
			}
		});

		return results;
	}

	// Bookmark conversation
	bookmarkConversation(conversationId, label = "", tags = []) {
		const conversation = this.getConversationById(conversationId);
		if (!conversation) {
			console.error("🚨 Conversation not found for bookmarking");
			return false;
		}

		const bookmark = {
			id: this.generateBookmarkId(),
			conversationId,
			label: label || `Bookmark ${this.bookmarks.length + 1}`,
			tags,
			bookmarkedAt: Date.now(),
			conversation: conversation,
		};

		this.bookmarks.push(bookmark);
		this.saveToStorage();

		console.log(`🔖 Bookmarked conversation: ${label}`);
		return bookmark;
	}

	// Remove bookmark
	removeBookmark(bookmarkId) {
		const index = this.bookmarks.findIndex((b) => b.id === bookmarkId);
		if (index === -1) return false;

		this.bookmarks.splice(index, 1);
		this.saveToStorage();

		console.log(`🗑️ Removed bookmark ${bookmarkId}`);
		return true;
	}

	// Get all bookmarks
	getBookmarks(options = {}) {
		let bookmarks = [...this.bookmarks];

		// Filter by tags if specified
		if (options.tags && options.tags.length > 0) {
			bookmarks = bookmarks.filter((bookmark) =>
				options.tags.some((tag) => bookmark.tags.includes(tag))
			);
		}

		// Sort by date or relevance
		if (options.sortBy === "date") {
			bookmarks.sort((a, b) => b.bookmarkedAt - a.bookmarkedAt);
		}

		return bookmarks;
	}

	// Get conversation history with filters
	getConversationHistory(options = {}) {
		let conversations = [...this.conversations];

		// Apply filters
		if (options.topic) {
			conversations = conversations.filter(
				(c) =>
					c.topic === options.topic ||
					c.metadata.detectedTopic === options.topic
			);
		}

		if (options.dateRange) {
			const { start, end } = options.dateRange;
			conversations = conversations.filter(
				(c) => c.timestamp >= start && c.timestamp <= end
			);
		}

		if (options.minSatisfaction) {
			conversations = conversations.filter(
				(c) => c.metadata.satisfactionScore >= options.minSatisfaction
			);
		}

		// Sort
		const sortBy = options.sortBy || "timestamp";
		conversations.sort((a, b) => {
			if (sortBy === "timestamp") return b.timestamp - a.timestamp;
			if (sortBy === "satisfaction")
				return (
					b.metadata.satisfactionScore - a.metadata.satisfactionScore
				);
			if (sortBy === "topic") return a.topic.localeCompare(b.topic);
			return 0;
		});

		// Limit results
		if (options.limit) {
			conversations = conversations.slice(0, options.limit);
		}

		return conversations;
	}

	// Get conversation statistics
	getConversationStats() {
		const stats = {
			total: this.conversations.length,
			bookmarked: this.bookmarks.length,
			byTopic: {},
			avgSatisfaction: 0,
			avgResponseTime: 0,
			topKeywords: [],
			searchActivity: this.searchHistory.length,
		};

		// Calculate topic distribution
		this.conversations.forEach((conversation) => {
			const topic = conversation.topic || "unknown";
			stats.byTopic[topic] = (stats.byTopic[topic] || 0) + 1;
		});

		// Calculate averages
		if (this.conversations.length > 0) {
			const totalSatisfaction = this.conversations.reduce(
				(sum, c) => sum + (c.metadata.satisfactionScore || 0),
				0
			);
			stats.avgSatisfaction =
				totalSatisfaction / this.conversations.length;

			const totalResponseTime = this.conversations.reduce(
				(sum, c) => sum + (c.metadata.responseTime || 0),
				0
			);
			stats.avgResponseTime =
				totalResponseTime / this.conversations.length;
		}

		// Get top keywords
		const keywordCounts = {};
		this.conversations.forEach((conversation) => {
			conversation.keywords.forEach((keyword) => {
				keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
			});
		});

		stats.topKeywords = Object.entries(keywordCounts)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([keyword, count]) => ({ keyword, count }));

		return stats;
	}

	// Helper methods
	extractKeywords(text) {
		// Simple keyword extraction - could be enhanced with NLP
		const stopWords = new Set([
			"的",
			"是",
			"在",
			"有",
			"和",
			"或",
			"但",
			"因為",
			"所以",
			"如果",
			"那麼",
			"這",
			"那",
			"我",
			"你",
			"他",
			"她",
			"它",
		]);

		return text
			.toLowerCase()
			.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, "")
			.split(/\s+/)
			.filter((word) => word.length > 1 && !stopWords.has(word))
			.slice(0, 20); // Limit to top 20 keywords
	}

	calculateSimilarity(str1, str2) {
		// Simple Levenshtein distance similarity
		const longer = str1.length > str2.length ? str1 : str2;
		const shorter = str1.length > str2.length ? str2 : str1;

		if (longer.length === 0) return 1.0;

		const distance = this.levenshteinDistance(longer, shorter);
		return (longer.length - distance) / longer.length;
	}

	levenshteinDistance(str1, str2) {
		const matrix = Array(str2.length + 1)
			.fill()
			.map(() => Array(str1.length + 1).fill(0));

		for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
		for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

		for (let j = 1; j <= str2.length; j++) {
			for (let i = 1; i <= str1.length; i++) {
				const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
				matrix[j][i] = Math.min(
					matrix[j - 1][i] + 1,
					matrix[j][i - 1] + 1,
					matrix[j - 1][i - 1] + cost
				);
			}
		}

		return matrix[str2.length][str1.length];
	}

	calculateKeywordOverlap(keywords1, keywords2) {
		const set1 = new Set(keywords1);
		const set2 = new Set(keywords2);
		const intersection = new Set([...set1].filter((x) => set2.has(x)));
		const union = new Set([...set1, ...set2]);

		return union.size > 0 ? intersection.size / union.size : 0;
	}

	getFieldContent(conversation, field) {
		switch (field) {
			case "message":
				return conversation.userMessage || "";
			case "response":
				return conversation.aiResponse || "";
			case "topic":
				return conversation.topic || "";
			case "keywords":
				return conversation.keywords.join(" ");
			default:
				return "";
		}
	}

	getFieldWeight(field) {
		const weights = {
			message: 1.0,
			response: 0.8,
			topic: 1.2,
			keywords: 0.9,
		};
		return weights[field] || 0.5;
	}

	extractContext(content, query, contextLength = 50) {
		const index = content.indexOf(query);
		if (index === -1) return content.substring(0, contextLength);

		const start = Math.max(0, index - contextLength);
		const end = Math.min(
			content.length,
			index + query.length + contextLength
		);

		return content.substring(start, end);
	}

	extractWordContext(content, word, contextLength = 30) {
		const words = content.split(/\s+/);
		const index = words.indexOf(word);

		if (index === -1) return content.substring(0, contextLength);

		const start = Math.max(0, index - 3);
		const end = Math.min(words.length, index + 4);

		return words.slice(start, end).join(" ");
	}

	combineSearchResults(results, options) {
		const combined = [];
		const seen = new Set();

		// Combine all result types
		Object.values(results).forEach((resultArray) => {
			resultArray.forEach((result) => {
				const id = result.conversation.id;
				if (!seen.has(id)) {
					seen.add(id);
					combined.push(result);
				} else {
					// Merge scores for duplicate conversations
					const existing = combined.find(
						(r) => r.conversation.id === id
					);
					if (existing) {
						existing.score += result.score;
						existing.matches.push(...result.matches);
					}
				}
			});
		});

		return combined;
	}

	applySearchFilters(results, options) {
		if (!options.filters) return results;

		return results.filter((result) => {
			const conversation = result.conversation;

			// Date filter
			if (options.filters.dateRange) {
				const { start, end } = options.filters.dateRange;
				if (
					conversation.timestamp < start ||
					conversation.timestamp > end
				) {
					return false;
				}
			}

			// Topic filter
			if (options.filters.topics && options.filters.topics.length > 0) {
				if (!options.filters.topics.includes(conversation.topic)) {
					return false;
				}
			}

			// Satisfaction filter
			if (options.filters.minSatisfaction) {
				if (
					conversation.metadata.satisfactionScore <
					options.filters.minSatisfaction
				) {
					return false;
				}
			}

			return true;
		});
	}

	sortAndLimitResults(results, options) {
		// Sort by score (descending)
		results.sort((a, b) => b.score - a.score);

		// Limit results
		return results.slice(0, options.maxResults);
	}

	generateSearchSuggestions(query, results) {
		const suggestions = [];

		// Related topics
		const topics = [...new Set(results.map((r) => r.conversation.topic))];
		topics.forEach((topic) => {
			suggestions.push({
				type: "topic",
				text: `topic:${topic}`,
				description: `在 ${topic} 主題中搜尋`,
			});
		});

		// Related keywords
		const keywords = new Set();
		results.forEach((result) => {
			result.conversation.keywords.forEach((keyword) =>
				keywords.add(keyword)
			);
		});

		[...keywords].slice(0, 5).forEach((keyword) => {
			suggestions.push({
				type: "keyword",
				text: keyword,
				description: `搜尋包含 "${keyword}" 的對話`,
			});
		});

		return suggestions;
	}

	// Storage methods
	saveToStorage() {
		try {
			const data = {
				conversations: this.conversations,
				bookmarks: this.bookmarks,
				searchHistory: this.searchHistory.slice(-100), // Keep last 100 searches
			};

			localStorage.setItem(
				"smart-chat3-search-data",
				JSON.stringify(data)
			);
		} catch (error) {
			console.error("🚨 Failed to save search data:", error);
		}
	}

	loadConversationsFromStorage() {
		try {
			const data = localStorage.getItem("smart-chat3-search-data");
			if (data) {
				const parsed = JSON.parse(data);
				this.conversations = parsed.conversations || [];
				this.bookmarks = parsed.bookmarks || [];
				this.searchHistory = parsed.searchHistory || [];

				console.log(
					`📚 Loaded ${this.conversations.length} conversations from storage`
				);
			}
		} catch (error) {
			console.error("🚨 Failed to load search data:", error);
		}
	}

	buildSearchIndex() {
		this.searchIndex.clear();

		this.conversations.forEach((conversation) => {
			this.addToSearchIndex(conversation);
		});

		console.log(
			`🔍 Built search index for ${this.conversations.length} conversations`
		);
	}

	addToSearchIndex(conversation) {
		// Simple indexing - could be enhanced with full-text search
		conversation.keywords.forEach((keyword) => {
			if (!this.searchIndex.has(keyword)) {
				this.searchIndex.set(keyword, []);
			}
			this.searchIndex.get(keyword).push(conversation.id);
		});
	}

	addToSearchHistory(query, options) {
		this.searchHistory.push({
			query,
			options,
			timestamp: Date.now(),
		});

		// Keep only recent searches
		if (this.searchHistory.length > 100) {
			this.searchHistory = this.searchHistory.slice(-100);
		}
	}

	setupAutoSave() {
		// Auto-save every 5 minutes
		setInterval(() => {
			this.saveToStorage();
		}, 300000);

		// Save on page unload
		window.addEventListener("beforeunload", () => {
			this.saveToStorage();
		});
	}

	// Utility methods
	generateConversationId() {
		return (
			"conv_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
		);
	}

	generateBookmarkId() {
		return (
			"bookmark_" +
			Date.now() +
			"_" +
			Math.random().toString(36).substr(2, 9)
		);
	}

	getConversationById(id) {
		return this.conversations.find((c) => c.id === id);
	}

	detectQueryTopic(query) {
		const topicKeywords = {
			感情: ["愛情", "戀愛", "結婚", "分手", "桃花", "感情", "對象"],
			財運: ["錢", "財運", "投資", "收入", "財富", "金錢"],
			工作: ["工作", "職業", "升遷", "老闆", "同事", "公司", "事業"],
			健康: ["健康", "身體", "生病", "養生", "運動"],
			人際關係: ["朋友", "人際", "社交", "關係"],
			子女: ["小孩", "子女", "孩子", "兒女"],
			因緣: ["緣分", "機會", "貴人", "因緣"],
			居家佈局: ["風水", "佈局", "擺設", "居家", "房間"],
		};

		for (const [topic, keywords] of Object.entries(topicKeywords)) {
			if (keywords.some((keyword) => query.includes(keyword))) {
				return topic;
			}
		}

		return null;
	}

	isTopicRelated(query, topic) {
		const queryTopic = this.detectQueryTopic(query);
		return queryTopic === topic;
	}

	parseMetadataQuery(query) {
		const filters = {};

		// Parse date filters
		const dateMatch = query.match(/date:(\d{4}-\d{2}-\d{2})/);
		if (dateMatch) {
			filters.date = dateMatch[1];
		}

		// Parse satisfaction filters
		const satisfactionMatch = query.match(/satisfaction:([0-9.]+)/);
		if (satisfactionMatch) {
			filters.satisfaction = parseFloat(satisfactionMatch[1]);
		}

		return filters;
	}

	matchesMetadataFilter(conversation, key, value) {
		switch (key) {
			case "date":
				const conversationDate = new Date(conversation.timestamp)
					.toISOString()
					.split("T")[0];
				return conversationDate === value;
			case "satisfaction":
				return conversation.metadata.satisfactionScore >= value;
			default:
				return false;
		}
	}
}

export default ConversationSearchSystem;
