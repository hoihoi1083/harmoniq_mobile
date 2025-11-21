// 🎨 Enhanced Response Formatter
// Immediate Improvement: Better visual presentation and formatting

class EnhancedResponseFormatter {
	constructor() {
		// Enhanced formatting templates
		this.formatTemplates = {
			// Structured analysis formatting
			analysis: {
				header: "📊 **{topic}分析結果**\n" + "═".repeat(30),
				section: "\n🔸 **{title}**\n{content}",
				highlight: "✨ **重點提醒**: {content}",
				actionItem: "🎯 **建議行動**: {content}",
				footer: "\n" + "─".repeat(30) + "\n💬 有其他問題歡迎繼續提問！",
			},

			// Conversation flow formatting
			conversation: {
				greeting: "👋 {greeting}\n",
				transition: "🔄 **話題轉換**: {transition}\n",
				continuation: "💭 **接續討論**: {content}",
				summary: "📝 **小結**: {summary}",
			},

			// Feng shui specific formatting
			fengshui: {
				lucky: "🍀 **吉利方位**: {content}",
				avoid: "⚠️ **需要注意**: {content}",
				remedy: "🔧 **改善建議**: {content}",
				timing: "⏰ **最佳時機**: {content}",
			},

			// Emotional support formatting
			emotional: {
				understanding: "💙 **我理解**: {content}",
				encouragement: "🌟 **正面鼓勵**: {content}",
				guidance: "🧭 **人生指引**: {content}",
				hope: "🌈 **未來展望**: {content}",
			},
		};

		// Interactive elements
		this.interactiveElements = {
			quickActions: {
				continueAnalysis: "📈 繼續深入分析",
				askRelated: "🔗 詢問相關問題",
				getAdvice: "💡 獲取具體建議",
				startNew: "🆕 開始新話題",
			},

			feedbackButtons: {
				helpful: "👍 很有幫助",
				needMore: "📚 需要更多資訊",
				unclear: "❓ 不太明白",
				perfect: "✨ 完美回答",
			},

			navigationOptions: {
				topics: [
					"感情",
					"財運",
					"工作",
					"健康",
					"人際",
					"子女",
					"因緣",
					"居家",
				],
				styles: ["詳細分析", "簡要建議", "實用步驟", "背景解釋"],
			},
		};

		// Rich content templates
		this.richContent = {
			progressBars: {
				confidence: "信心度: {bar} {percentage}%",
				compatibility: "相合度: {bar} {percentage}%",
				improvement: "改善度: {bar} {percentage}%",
			},

			visualElements: {
				separator: "◆ ◇ ◆ ◇ ◆",
				bullet: "▸",
				checkmark: "✓",
				star: "⭐",
				arrow: "→",
			},

			statusIndicators: {
				excellent: "🟢 極佳",
				good: "🔵 良好",
				fair: "🟡 普通",
				poor: "🟠 需要改善",
				critical: "🔴 急需處理",
			},
		};
	}

	// Main formatting method
	formatResponse(response, context = {}) {
		try {
			const {
				responseType = "conversation",
				topic = "general",
				emotionalTone = "neutral",
				includeInteractive = true,
				userPreferences = {},
			} = context;

			// Apply primary formatting
			let formattedResponse = this.applyPrimaryFormatting(
				response,
				responseType,
				topic
			);

			// Add emotional formatting if needed
			if (emotionalTone !== "neutral") {
				formattedResponse = this.addEmotionalFormatting(
					formattedResponse,
					emotionalTone
				);
			}

			// Add interactive elements
			if (includeInteractive) {
				formattedResponse = this.addInteractiveElements(
					formattedResponse,
					context
				);
			}

			// Apply user preference formatting
			formattedResponse = this.applyUserPreferences(
				formattedResponse,
				userPreferences
			);

			// Add metadata for frontend rendering
			const formattingMetadata = this.generateFormattingMetadata(context);

			return {
				formattedResponse,
				originalResponse: response,
				formattingMetadata,
				interactiveElements:
					this.getRelevantInteractiveElements(context),
			};
		} catch (error) {
			console.error("🚨 Response formatting error:", error);
			return {
				formattedResponse: response,
				originalResponse: response,
				formattingMetadata: { error: true },
				interactiveElements: {},
			};
		}
	}

	// Apply primary formatting based on response type
	applyPrimaryFormatting(response, responseType, topic) {
		switch (responseType) {
			case "analysis":
				return this.formatAnalysisResponse(response, topic);
			case "fengshui":
				return this.formatFengshuiResponse(response);
			case "emotional":
				return this.formatEmotionalResponse(response);
			default:
				return this.formatConversationResponse(response);
		}
	}

	// Format analysis-type responses
	formatAnalysisResponse(response, topic) {
		const template = this.formatTemplates.analysis;

		// Split response into sections
		const sections = this.identifyResponseSections(response);

		let formatted = template.header.replace("{topic}", topic);

		sections.forEach((section, index) => {
			const sectionTitle = this.generateSectionTitle(section, index);
			formatted += template.section
				.replace("{title}", sectionTitle)
				.replace("{content}", this.enhanceContentFormatting(section));
		});

		// Add highlights and action items
		const highlights = this.extractHighlights(response);
		highlights.forEach((highlight) => {
			formatted +=
				"\n" + template.highlight.replace("{content}", highlight);
		});

		const actionItems = this.extractActionItems(response);
		actionItems.forEach((action) => {
			formatted +=
				"\n" + template.actionItem.replace("{content}", action);
		});

		formatted += template.footer;
		return formatted;
	}

	// Format feng shui specific responses
	formatFengshuiResponse(response) {
		const template = this.formatTemplates.fengshui;
		let formatted = response;

		// Identify and format feng shui elements
		const fengshuiElements = this.extractFengshuiElements(response);

		if (fengshuiElements.lucky.length > 0) {
			formatted = this.insertFengshuiSection(
				formatted,
				template.lucky,
				fengshuiElements.lucky
			);
		}

		if (fengshuiElements.avoid.length > 0) {
			formatted = this.insertFengshuiSection(
				formatted,
				template.avoid,
				fengshuiElements.avoid
			);
		}

		if (fengshuiElements.remedy.length > 0) {
			formatted = this.insertFengshuiSection(
				formatted,
				template.remedy,
				fengshuiElements.remedy
			);
		}

		return formatted;
	}

	// Format emotional support responses
	formatEmotionalResponse(response) {
		const template = this.formatTemplates.emotional;

		// Identify emotional elements
		const emotionalElements = this.extractEmotionalElements(response);

		let formatted = response;

		emotionalElements.forEach((element) => {
			const templateKey = this.getEmotionalTemplateKey(element.type);
			if (template[templateKey]) {
				formatted =
					template[templateKey].replace(
						"{content}",
						element.content
					) +
					"\n\n" +
					formatted;
			}
		});

		return formatted;
	}

	// Add emotional formatting based on tone
	addEmotionalFormatting(response, emotionalTone) {
		const emotionalEnhancements = {
			encouraging: {
				prefix: "🌟 ",
				suffix: " ✨",
				emphasis: "**{text}**",
			},
			empathetic: {
				prefix: "💙 ",
				suffix: " 🤗",
				emphasis: "*{text}*",
			},
			urgent: {
				prefix: "⚡ ",
				suffix: " ❗",
				emphasis: "**⚠️ {text} ⚠️**",
			},
			calm: {
				prefix: "🕊️ ",
				suffix: " 🌸",
				emphasis: "_{text}_",
			},
		};

		const enhancement = emotionalEnhancements[emotionalTone];
		if (!enhancement) return response;

		return enhancement.prefix + response + enhancement.suffix;
	}

	// Add interactive elements
	addInteractiveElements(response, context) {
		const { topic, conversationState } = context;

		let interactive = response + "\n\n";

		// Add quick actions
		interactive += "🎯 **快速操作**:\n";
		Object.values(this.interactiveElements.quickActions).forEach(
			(action, index) => {
				interactive += `${index + 1}. ${action}\n`;
			}
		);

		// Add topic navigation if relevant
		if (
			topic &&
			this.interactiveElements.navigationOptions.topics.includes(topic)
		) {
			interactive += "\n🔗 **相關主題**: ";
			const relatedTopics = this.getRelatedTopics(topic);
			interactive += relatedTopics.join(" | ");
		}

		// Add feedback buttons
		interactive += "\n\n💬 **這個回答如何？**\n";
		Object.values(this.interactiveElements.feedbackButtons).forEach(
			(button, index) => {
				interactive += `[${button}] `;
			}
		);

		return interactive;
	}

	// Apply user preferences
	applyUserPreferences(response, preferences) {
		const {
			detailLevel = "moderate",
			includeEmojis = true,
			preferredFormat = "structured",
		} = preferences;

		let formatted = response;

		// Adjust detail level
		if (detailLevel === "brief") {
			formatted = this.condenseResponse(formatted);
		} else if (detailLevel === "detailed") {
			formatted = this.expandResponse(formatted);
		}

		// Handle emoji preferences
		if (!includeEmojis) {
			formatted = this.removeEmojis(formatted);
		}

		// Apply preferred format
		if (preferredFormat === "list") {
			formatted = this.convertToListFormat(formatted);
		} else if (preferredFormat === "paragraph") {
			formatted = this.convertToParagraphFormat(formatted);
		}

		return formatted;
	}

	// Helper methods for response processing
	identifyResponseSections(response) {
		// Split response into logical sections
		return response
			.split(/\n\s*\n/)
			.filter((section) => section.trim().length > 0);
	}

	generateSectionTitle(section, index) {
		// Generate appropriate section titles
		const commonTitles = [
			"概述",
			"詳細分析",
			"具體建議",
			"注意事項",
			"總結",
		];
		return commonTitles[index] || `第${index + 1}部分`;
	}

	enhanceContentFormatting(content) {
		// Enhance content with better formatting
		return content
			.replace(/(\d+[\.\)]\s)/g, "\n   $1") // Format numbered lists
			.replace(/(重要|注意|建議)：/g, "**$1**：") // Emphasize keywords
			.replace(/([^\n。！？]*[建議|推薦|應該][^\n。！？]*)/g, "🎯 $1"); // Highlight recommendations
	}

	extractHighlights(response) {
		// Extract key highlights from response
		const highlightPatterns = [
			/重要的是[^。！？]*/g,
			/特別要[^。！？]*/g,
			/務必[^。！？]*/g,
			/關鍵在於[^。！？]*/g,
		];

		const highlights = [];
		highlightPatterns.forEach((pattern) => {
			const matches = response.match(pattern);
			if (matches) highlights.push(...matches);
		});

		return highlights;
	}

	extractActionItems(response) {
		// Extract actionable items from response
		const actionPatterns = [
			/可以[^。！？]*[做|試|放|調整][^。！？]*/g,
			/建議[^。！？]*[進行|實施|執行][^。！？]*/g,
			/應該[^。！？]*[開始|立即|馬上][^。！？]*/g,
		];

		const actions = [];
		actionPatterns.forEach((pattern) => {
			const matches = response.match(pattern);
			if (matches) actions.push(...matches);
		});

		return actions;
	}

	extractFengshuiElements(response) {
		return {
			lucky: this.extractMatches(response, [/吉利|好運|旺|催旺|招財/g]),
			avoid: this.extractMatches(response, [/避免|禁忌|不宜|煞氣|凶位/g]),
			remedy: this.extractMatches(response, [
				/化解|改善|調整|佈置|擺放/g,
			]),
		};
	}

	extractEmotionalElements(response) {
		// Extract emotional support elements
		const emotionalPatterns = {
			understanding: /理解|感受|體會/g,
			encouragement: /相信|加油|一定會|沒問題/g,
			guidance: /建議|指引|方向|道路/g,
			hope: /希望|未來|美好|光明/g,
		};

		const elements = [];
		Object.entries(emotionalPatterns).forEach(([type, pattern]) => {
			const matches = response.match(pattern);
			if (matches) {
				elements.push({ type, content: matches.join(", ") });
			}
		});

		return elements;
	}

	extractMatches(text, patterns) {
		const matches = [];
		patterns.forEach((pattern) => {
			const found = text.match(pattern);
			if (found) matches.push(...found);
		});
		return [...new Set(matches)]; // Remove duplicates
	}

	getRelatedTopics(currentTopic) {
		const topicRelations = {
			感情: ["人際關係", "因緣", "子女"],
			財運: ["工作", "居家佈局"],
			工作: ["財運", "人際關係"],
			健康: ["居家佈局", "感情"],
			人際關係: ["感情", "工作"],
			子女: ["感情", "因緣"],
			因緣: ["感情", "子女"],
			居家佈局: ["財運", "健康"],
		};

		return topicRelations[currentTopic] || [];
	}

	// Utility methods
	condenseResponse(response) {
		return response
			.split("\n")
			.filter((line) => line.trim().length > 0)
			.slice(0, 3)
			.join("\n");
	}

	expandResponse(response) {
		// Add more detailed explanations
		return (
			response +
			"\n\n💡 **延伸說明**: 如需更深入的分析或具體實施步驟，歡迎進一步詢問。"
		);
	}

	removeEmojis(text) {
		return text.replace(
			/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu,
			""
		);
	}

	convertToListFormat(response) {
		return response
			.split(/[。！？]/)
			.filter((sentence) => sentence.trim().length > 0)
			.map((sentence, index) => `${index + 1}. ${sentence.trim()}`)
			.join("\n");
	}

	convertToParagraphFormat(response) {
		return response.replace(/\n+/g, " ").trim();
	}

	generateFormattingMetadata(context) {
		return {
			formattingApplied: true,
			responseType: context.responseType || "conversation",
			interactiveElementsIncluded: context.includeInteractive !== false,
			emotionalTone: context.emotionalTone || "neutral",
			timestamp: new Date().toISOString(),
		};
	}

	getRelevantInteractiveElements(context) {
		const { topic, conversationState } = context;

		return {
			quickActions: this.interactiveElements.quickActions,
			relatedTopics: topic ? this.getRelatedTopics(topic) : [],
			feedbackOptions: this.interactiveElements.feedbackButtons,
			navigationOptions: this.interactiveElements.navigationOptions,
		};
	}

	// Method to format progress indicators
	formatProgressBar(percentage, length = 10) {
		const filled = Math.round((percentage / 100) * length);
		const bar = "█".repeat(filled) + "░".repeat(length - filled);
		return bar;
	}

	// Method to format status indicators
	getStatusIndicator(score) {
		if (score >= 0.9) return this.richContent.statusIndicators.excellent;
		if (score >= 0.7) return this.richContent.statusIndicators.good;
		if (score >= 0.5) return this.richContent.statusIndicators.fair;
		if (score >= 0.3) return this.richContent.statusIndicators.poor;
		return this.richContent.statusIndicators.critical;
	}

	// Method to format confidence indicators
	formatConfidenceIndicator(confidence) {
		const percentage = Math.round(confidence * 100);
		const bar = this.formatProgressBar(percentage);
		return this.richContent.progressBars.confidence
			.replace("{bar}", bar)
			.replace("{percentage}", percentage);
	}
}

export default EnhancedResponseFormatter;
