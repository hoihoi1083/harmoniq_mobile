// 🔔 Smart Notification and Reminder System
// Immediate Improvement: Intelligent reminders and notifications

class SmartNotificationSystem {
	constructor() {
		this.notifications = [];
		this.reminders = [];
		this.preferences = {
			enableBrowserNotifications: true,
			enableSoundAlerts: true,
			reminderFrequency: "daily", // daily, weekly, monthly
			notificationTypes: {
				advice: true,
				reminders: true,
				tips: true,
				updates: true,
			},
			quietHours: {
				enabled: false,
				start: "22:00",
				end: "08:00",
			},
		};

		// Notification templates
		this.notificationTemplates = {
			advice: {
				title: "💡 個人化建議",
				icon: "🎯",
				priority: "medium",
			},
			reminder: {
				title: "⏰ 提醒事項",
				icon: "🔔",
				priority: "high",
			},
			tip: {
				title: "💫 風水小貼士",
				icon: "✨",
				priority: "low",
			},
			update: {
				title: "📢 系統更新",
				icon: "🔄",
				priority: "medium",
			},
		};

		// Initialize system
		this.initialize();
	}

	// Initialize notification system
	async initialize() {
		console.log("🔔 Smart notification system initialized");

		// Request browser notification permission
		await this.requestNotificationPermission();

		// Load preferences and data
		this.loadFromStorage();

		// Setup notification scheduler
		this.setupNotificationScheduler();

		// Setup reminder system
		this.setupReminderSystem();

		// Setup auto-cleanup
		this.setupAutoCleanup();
	}

	// Request browser notification permission
	async requestNotificationPermission() {
		if ("Notification" in window) {
			if (Notification.permission === "default") {
				const permission = await Notification.requestPermission();
				this.preferences.enableBrowserNotifications =
					permission === "granted";
				console.log(`🔔 Notification permission: ${permission}`);
			} else if (Notification.permission === "granted") {
				this.preferences.enableBrowserNotifications = true;
			} else {
				this.preferences.enableBrowserNotifications = false;
			}
		}
	}

	// Show notification
	showNotification(options) {
		const notification = {
			id: this.generateNotificationId(),
			type: options.type || "info",
			title: options.title,
			message: options.message,
			icon: options.icon,
			priority: options.priority || "medium",
			timestamp: Date.now(),
			read: false,
			persistent: options.persistent || false,
			actionable: options.actionable || false,
			actions: options.actions || [],
			metadata: options.metadata || {},
		};

		// Check if notifications are allowed
		if (!this.shouldShowNotification(notification)) {
			console.log("🔕 Notification blocked by preferences");
			return null;
		}

		// Store notification
		this.notifications.push(notification);

		// Show browser notification if enabled
		if (
			this.preferences.enableBrowserNotifications &&
			"Notification" in window &&
			Notification.permission === "granted"
		) {
			this.showBrowserNotification(notification);
		}

		// Show in-app notification
		this.showInAppNotification(notification);

		// Play sound if enabled
		if (this.preferences.enableSoundAlerts) {
			this.playNotificationSound(notification);
		}

		// Save to storage
		this.saveToStorage();

		console.log(`🔔 Notification shown: ${notification.title}`);
		return notification;
	}

	// Show browser notification
	showBrowserNotification(notification) {
		const browserNotification = new Notification(notification.title, {
			body: notification.message,
			icon: "/favicon.ico",
			tag: notification.id,
			requireInteraction: notification.priority === "high",
			silent: this.isQuietHours(),
		});

		// Handle click
		browserNotification.onclick = () => {
			this.handleNotificationClick(notification);
			browserNotification.close();
		};

		// Auto-close non-persistent notifications
		if (!notification.persistent && notification.priority !== "high") {
			setTimeout(() => {
				browserNotification.close();
			}, 5000);
		}
	}

	// Show in-app notification
	showInAppNotification(notification) {
		// Create notification element
		const notificationElement = document.createElement("div");
		notificationElement.className = `notification notification-${notification.priority}`;
		notificationElement.id = notification.id;

		notificationElement.innerHTML = `
            <div class="notification-content">
                <div class="notification-header">
                    <span class="notification-icon">${notification.icon || "🔔"}</span>
                    <span class="notification-title">${notification.title}</span>
                    <button class="notification-close" onclick="smartNotificationSystem.dismissNotification('${notification.id}')">
                        ✕
                    </button>
                </div>
                <div class="notification-message">${notification.message}</div>
                ${notification.actions.length > 0 ? this.renderNotificationActions(notification) : ""}
                <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
            </div>
        `;

		// Add to notification container
		let container = document.getElementById("notification-container");
		if (!container) {
			container = this.createNotificationContainer();
		}

		container.appendChild(notificationElement);

		// Auto-remove if not persistent
		if (!notification.persistent) {
			setTimeout(
				() => {
					this.dismissNotification(notification.id);
				},
				notification.priority === "high" ? 10000 : 5000
			);
		}

		// Add animation
		requestAnimationFrame(() => {
			notificationElement.classList.add("notification-show");
		});
	}

	// Create notification container
	createNotificationContainer() {
		const container = document.createElement("div");
		container.id = "notification-container";
		container.className = "notification-container";

		// Add styles
		const style = document.createElement("style");
		style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            }
            
            .notification {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                margin-bottom: 10px;
                padding: 16px;
                min-width: 300px;
                max-width: 400px;
                pointer-events: all;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                border-left: 4px solid #007AFF;
            }
            
            .notification-show {
                transform: translateX(0);
            }
            
            .notification-high {
                border-left-color: #FF3B30;
                box-shadow: 0 4px 20px rgba(255,59,48,0.3);
            }
            
            .notification-medium {
                border-left-color: #FF9500;
            }
            
            .notification-low {
                border-left-color: #34C759;
            }
            
            .notification-header {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .notification-icon {
                font-size: 18px;
                margin-right: 8px;
            }
            
            .notification-title {
                font-weight: 600;
                flex-grow: 1;
                color: #1d1d1f;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 14px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-message {
                color: #666;
                line-height: 1.4;
                margin-bottom: 8px;
            }
            
            .notification-actions {
                display: flex;
                gap: 8px;
                margin-top: 12px;
            }
            
            .notification-action {
                background: #007AFF;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .notification-action:hover {
                background: #0056b3;
            }
            
            .notification-action-secondary {
                background: #f0f0f0;
                color: #333;
            }
            
            .notification-action-secondary:hover {
                background: #e0e0e0;
            }
            
            .notification-time {
                font-size: 11px;
                color: #999;
                text-align: right;
                margin-top: 8px;
            }
        `;

		document.head.appendChild(style);
		document.body.appendChild(container);

		return container;
	}

	// Render notification actions
	renderNotificationActions(notification) {
		if (!notification.actions || notification.actions.length === 0) {
			return "";
		}

		const actionsHtml = notification.actions
			.map(
				(action) => `
            <button class="notification-action ${action.type === "secondary" ? "notification-action-secondary" : ""}"
                    onclick="smartNotificationSystem.handleNotificationAction('${notification.id}', '${action.id}')">
                ${action.label}
            </button>
        `
			)
			.join("");

		return `<div class="notification-actions">${actionsHtml}</div>`;
	}

	// Dismiss notification
	dismissNotification(notificationId) {
		const element = document.getElementById(notificationId);
		if (element) {
			element.style.transform = "translateX(100%)";
			setTimeout(() => {
				element.remove();
			}, 300);
		}

		// Mark as read
		const notification = this.notifications.find(
			(n) => n.id === notificationId
		);
		if (notification) {
			notification.read = true;
			this.saveToStorage();
		}
	}

	// Handle notification click
	handleNotificationClick(notification) {
		console.log(`🔔 Notification clicked: ${notification.id}`);

		// Mark as read
		notification.read = true;

		// Handle based on type
		switch (notification.type) {
			case "advice":
				this.openAdviceDetail(notification.metadata);
				break;
			case "reminder":
				this.openReminderDetail(notification.metadata);
				break;
			case "tip":
				this.openTipDetail(notification.metadata);
				break;
			default:
				// Default action
				break;
		}

		this.saveToStorage();
	}

	// Handle notification action
	handleNotificationAction(notificationId, actionId) {
		const notification = this.notifications.find(
			(n) => n.id === notificationId
		);
		if (!notification) return;

		const action = notification.actions.find((a) => a.id === actionId);
		if (!action) return;

		console.log(`🔔 Notification action: ${actionId}`);

		// Execute action
		if (action.callback) {
			action.callback(notification);
		}

		// Standard actions
		switch (actionId) {
			case "view":
				this.handleNotificationClick(notification);
				break;
			case "dismiss":
				this.dismissNotification(notificationId);
				break;
			case "remind-later":
				this.scheduleReminder(notification, "later");
				this.dismissNotification(notificationId);
				break;
			case "mark-done":
				this.markReminderDone(notification.metadata.reminderId);
				this.dismissNotification(notificationId);
				break;
		}
	}

	// Create reminder
	createReminder(options) {
		const reminder = {
			id: this.generateReminderId(),
			title: options.title,
			message: options.message,
			category: options.category || "general",
			scheduledTime: options.scheduledTime,
			recurring: options.recurring || false,
			recurrencePattern: options.recurrencePattern, // daily, weekly, monthly
			priority: options.priority || "medium",
			completed: false,
			createdAt: Date.now(),
			metadata: options.metadata || {},
		};

		this.reminders.push(reminder);
		this.scheduleReminderNotification(reminder);
		this.saveToStorage();

		console.log(`⏰ Reminder created: ${reminder.title}`);
		return reminder;
	}

	// Schedule reminder notification
	scheduleReminderNotification(reminder) {
		const now = Date.now();
		const delay = reminder.scheduledTime - now;

		if (delay > 0) {
			setTimeout(() => {
				if (!reminder.completed) {
					this.showNotification({
						type: "reminder",
						title: "⏰ 提醒",
						message: reminder.message,
						icon: "🔔",
						priority: reminder.priority,
						persistent: true,
						actionable: true,
						actions: [
							{
								id: "mark-done",
								label: "完成",
								type: "primary",
							},
							{
								id: "remind-later",
								label: "稍後提醒",
								type: "secondary",
							},
						],
						metadata: {
							reminderId: reminder.id,
							category: reminder.category,
						},
					});

					// Handle recurring reminders
					if (reminder.recurring) {
						this.scheduleNextRecurrence(reminder);
					}
				}
			}, delay);
		}
	}

	// Schedule next recurrence
	scheduleNextRecurrence(reminder) {
		let nextTime = reminder.scheduledTime;

		switch (reminder.recurrencePattern) {
			case "daily":
				nextTime += 24 * 60 * 60 * 1000;
				break;
			case "weekly":
				nextTime += 7 * 24 * 60 * 60 * 1000;
				break;
			case "monthly":
				const date = new Date(nextTime);
				date.setMonth(date.getMonth() + 1);
				nextTime = date.getTime();
				break;
		}

		reminder.scheduledTime = nextTime;
		this.scheduleReminderNotification(reminder);
	}

	// Mark reminder as done
	markReminderDone(reminderId) {
		const reminder = this.reminders.find((r) => r.id === reminderId);
		if (reminder) {
			reminder.completed = true;
			this.saveToStorage();
			console.log(`✅ Reminder completed: ${reminder.title}`);
		}
	}

	// Create intelligent suggestions based on user behavior
	generateIntelligentSuggestions(userActivity) {
		const suggestions = [];

		// Analyze conversation patterns
		if (userActivity.conversationCount > 0) {
			const lastConversation = userActivity.lastConversation;

			// Suggest follow-up advice
			if (
				lastConversation &&
				Date.now() - lastConversation.timestamp > 24 * 60 * 60 * 1000
			) {
				suggestions.push({
					type: "advice",
					title: "📝 建議檢查進度",
					message: `你上次詢問關於${lastConversation.topic}的問題，現在可以檢查一下進展如何？`,
					priority: "medium",
					metadata: {
						originalTopic: lastConversation.topic,
						conversationId: lastConversation.id,
					},
				});
			}
		}

		// Suggest daily feng shui tips
		if (!userActivity.todayTipShown) {
			suggestions.push({
				type: "tip",
				title: "💫 今日風水提醒",
				message: this.generateDailyFengShuiTip(),
				priority: "low",
				metadata: {
					tipType: "daily",
					date: new Date().toDateString(),
				},
			});
		}

		// Suggest profile updates
		if (userActivity.profileIncomplete) {
			suggestions.push({
				type: "advice",
				title: "👤 完善個人資料",
				message: "完善你的個人資料可以獲得更精準的風水建議",
				priority: "medium",
				actions: [
					{
						id: "update-profile",
						label: "更新資料",
						type: "primary",
					},
				],
			});
		}

		return suggestions;
	}

	// Generate daily feng shui tip
	generateDailyFengShuiTip() {
		const tips = [
			"保持客廳整潔明亮，有助於正能量流動",
			"在辦公桌左側放置綠色植物，可提升工作運勢",
			"睡前整理床鋪，有助於改善睡眠品質",
			"定期清理家中雜物，讓氣場更加順暢",
			"在家中東南方位放置水晶，有助於招財",
			"保持廚房乾淨，象徵財富的穩定增長",
			"適當開窗通風，讓新鮮空氣帶來好運",
			"鏡子不要正對床鋪，避免影響睡眠安寧",
		];

		const today = new Date().getDate();
		return tips[today % tips.length];
	}

	// Show smart suggestions
	showSmartSuggestions(userActivity) {
		const suggestions = this.generateIntelligentSuggestions(userActivity);

		suggestions.forEach((suggestion) => {
			// Delay suggestions to avoid overwhelming
			setTimeout(() => {
				this.showNotification(suggestion);
			}, Math.random() * 5000);
		});
	}

	// Check if notification should be shown
	shouldShowNotification(notification) {
		// Check if type is enabled
		if (!this.preferences.notificationTypes[notification.type]) {
			return false;
		}

		// Check quiet hours
		if (this.isQuietHours() && notification.priority !== "high") {
			return false;
		}

		// Check notification frequency limits
		if (this.hasReachedNotificationLimit()) {
			return false;
		}

		return true;
	}

	// Check if it's quiet hours
	isQuietHours() {
		if (!this.preferences.quietHours.enabled) {
			return false;
		}

		const now = new Date();
		const currentTime = now.getHours() * 100 + now.getMinutes();

		const startTime = this.parseTime(this.preferences.quietHours.start);
		const endTime = this.parseTime(this.preferences.quietHours.end);

		if (startTime > endTime) {
			// Quiet hours span midnight
			return currentTime >= startTime || currentTime <= endTime;
		} else {
			return currentTime >= startTime && currentTime <= endTime;
		}
	}

	// Check notification frequency limit
	hasReachedNotificationLimit() {
		const oneHourAgo = Date.now() - 60 * 60 * 1000;
		const recentNotifications = this.notifications.filter(
			(n) => n.timestamp > oneHourAgo
		);

		return recentNotifications.length >= 10; // Max 10 notifications per hour
	}

	// Play notification sound
	playNotificationSound(notification) {
		try {
			// Create audio context for sound generation
			const audioContext = new (window.AudioContext ||
				window.webkitAudioContext)();

			// Different sounds for different priorities
			let frequency = 800; // Default
			switch (notification.priority) {
				case "high":
					frequency = 1000;
					break;
				case "medium":
					frequency = 800;
					break;
				case "low":
					frequency = 600;
					break;
			}

			// Generate tone
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.setValueAtTime(
				frequency,
				audioContext.currentTime
			);
			oscillator.type = "sine";

			gainNode.gain.setValueAtTime(0, audioContext.currentTime);
			gainNode.gain.linearRampToValueAtTime(
				0.1,
				audioContext.currentTime + 0.01
			);
			gainNode.gain.exponentialRampToValueAtTime(
				0.01,
				audioContext.currentTime + 0.3
			);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.3);
		} catch (error) {
			console.warn("🔇 Could not play notification sound:", error);
		}
	}

	// Setup notification scheduler
	setupNotificationScheduler() {
		// Check for pending notifications every minute
		setInterval(() => {
			this.checkPendingNotifications();
		}, 60000);

		// Daily suggestion check
		setInterval(
			() => {
				this.checkDailySuggestions();
			},
			60 * 60 * 1000
		); // Every hour
	}

	checkPendingNotifications() {
		// Implementation for checking scheduled notifications
		console.log("🔔 Checking for pending notifications...");
	}

	checkDailySuggestions() {
		// Implementation for daily suggestions
		console.log("💡 Checking for daily suggestions...");
	}

	// Setup reminder system
	setupReminderSystem() {
		// Re-schedule existing reminders on initialization
		this.reminders.forEach((reminder) => {
			if (!reminder.completed && reminder.scheduledTime > Date.now()) {
				this.scheduleReminderNotification(reminder);
			}
		});
	}

	// Setup auto cleanup
	setupAutoCleanup() {
		// Clean up old notifications daily
		setInterval(
			() => {
				this.cleanupOldNotifications();
			},
			24 * 60 * 60 * 1000
		);
	}

	cleanupOldNotifications() {
		const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

		// Remove old read notifications
		this.notifications = this.notifications.filter(
			(notification) =>
				!notification.read || notification.timestamp > oneWeekAgo
		);

		// Remove completed reminders older than 30 days
		const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
		this.reminders = this.reminders.filter(
			(reminder) =>
				!reminder.completed || reminder.createdAt > thirtyDaysAgo
		);

		this.saveToStorage();
		console.log("🧹 Cleaned up old notifications and reminders");
	}

	// Utility methods
	parseTime(timeString) {
		const [hours, minutes] = timeString.split(":").map(Number);
		return hours * 100 + minutes;
	}

	formatTime(timestamp) {
		return new Date(timestamp).toLocaleTimeString("zh-TW", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}

	generateNotificationId() {
		return (
			"notif_" +
			Date.now() +
			"_" +
			Math.random().toString(36).substr(2, 9)
		);
	}

	generateReminderId() {
		return (
			"remind_" +
			Date.now() +
			"_" +
			Math.random().toString(36).substr(2, 9)
		);
	}

	// Storage methods
	saveToStorage() {
		try {
			const data = {
				notifications: this.notifications.slice(-100), // Keep last 100
				reminders: this.reminders,
				preferences: this.preferences,
			};

			localStorage.setItem(
				"smart-chat3-notifications",
				JSON.stringify(data)
			);
		} catch (error) {
			console.error("🚨 Failed to save notification data:", error);
		}
	}

	loadFromStorage() {
		try {
			const data = localStorage.getItem("smart-chat3-notifications");
			if (data) {
				const parsed = JSON.parse(data);
				this.notifications = parsed.notifications || [];
				this.reminders = parsed.reminders || [];
				this.preferences = {
					...this.preferences,
					...(parsed.preferences || {}),
				};

				console.log(
					`🔔 Loaded ${this.notifications.length} notifications from storage`
				);
			}
		} catch (error) {
			console.error("🚨 Failed to load notification data:", error);
		}
	}

	// Public API methods
	updatePreferences(newPreferences) {
		this.preferences = { ...this.preferences, ...newPreferences };
		this.saveToStorage();
		console.log("⚙️ Notification preferences updated");
	}

	getNotifications(options = {}) {
		let notifications = [...this.notifications];

		if (options.unreadOnly) {
			notifications = notifications.filter((n) => !n.read);
		}

		if (options.type) {
			notifications = notifications.filter(
				(n) => n.type === options.type
			);
		}

		notifications.sort((a, b) => b.timestamp - a.timestamp);

		if (options.limit) {
			notifications = notifications.slice(0, options.limit);
		}

		return notifications;
	}

	getReminders(options = {}) {
		let reminders = [...this.reminders];

		if (options.pendingOnly) {
			reminders = reminders.filter((r) => !r.completed);
		}

		if (options.category) {
			reminders = reminders.filter(
				(r) => r.category === options.category
			);
		}

		reminders.sort((a, b) => a.scheduledTime - b.scheduledTime);

		return reminders;
	}

	markAllAsRead() {
		this.notifications.forEach((notification) => {
			notification.read = true;
		});
		this.saveToStorage();
		console.log("✅ All notifications marked as read");
	}

	clearAllNotifications() {
		this.notifications = [];
		this.saveToStorage();

		// Remove all notification elements
		const container = document.getElementById("notification-container");
		if (container) {
			container.innerHTML = "";
		}

		console.log("🗑️ All notifications cleared");
	}
}

export default SmartNotificationSystem;
