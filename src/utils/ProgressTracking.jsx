import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";

/**
 * Advanced Progress Tracking System
 * Monitors user journey, analysis completion, and system performance
 */

// Progress Context
const ProgressContext = createContext();

// Progress Types
export const PROGRESS_TYPES = {
	USER_JOURNEY: "user_journey",
	ANALYSIS: "analysis",
	SYSTEM: "system",
	CUSTOM: "custom",
};

// Progress Status
export const PROGRESS_STATUS = {
	NOT_STARTED: "not_started",
	IN_PROGRESS: "in_progress",
	COMPLETED: "completed",
	FAILED: "failed",
	SKIPPED: "skipped",
};

// Progress Manager Class
export class ProgressManager {
	constructor() {
		this.progressTrackers = new Map();
		this.milestones = new Map();
		this.subscribers = new Set();
		this.sessionData = {
			startTime: Date.now(),
			totalSteps: 0,
			completedSteps: 0,
			userId: null,
		};
	}

	// Create a new progress tracker
	createTracker(id, config = {}) {
		const tracker = {
			id,
			type: config.type || PROGRESS_TYPES.CUSTOM,
			title: config.title || id,
			steps: config.steps || [],
			currentStep: 0,
			status: PROGRESS_STATUS.NOT_STARTED,
			startTime: null,
			endTime: null,
			metadata: config.metadata || {},
			progress: 0,
			estimatedTime: config.estimatedTime || null,
			dependencies: config.dependencies || [],
		};

		this.progressTrackers.set(id, tracker);
		this.notifySubscribers();
		return tracker;
	}

	// Start progress tracking
	start(id) {
		const tracker = this.progressTrackers.get(id);
		if (!tracker) return false;

		tracker.status = PROGRESS_STATUS.IN_PROGRESS;
		tracker.startTime = Date.now();
		tracker.currentStep = 0;
		tracker.progress = 0;

		this.notifySubscribers();
		return true;
	}

	// Update progress
	updateProgress(id, stepIndex, stepData = {}) {
		const tracker = this.progressTrackers.get(id);
		if (!tracker) return false;

		tracker.currentStep = stepIndex;
		tracker.progress =
			(stepIndex / Math.max(tracker.steps.length - 1, 1)) * 100;

		if (tracker.steps[stepIndex]) {
			tracker.steps[stepIndex] = {
				...tracker.steps[stepIndex],
				...stepData,
				completedAt: Date.now(),
			};
		}

		// Check if all dependencies are met
		if (tracker.dependencies.length > 0) {
			const dependenciesMet = tracker.dependencies.every((depId) => {
				const dep = this.progressTrackers.get(depId);
				return dep && dep.status === PROGRESS_STATUS.COMPLETED;
			});

			if (!dependenciesMet) {
				tracker.status = PROGRESS_STATUS.NOT_STARTED;
				this.notifySubscribers();
				return false;
			}
		}

		this.notifySubscribers();
		return true;
	}

	// Complete progress
	complete(id, result = null) {
		const tracker = this.progressTrackers.get(id);
		if (!tracker) return false;

		tracker.status = PROGRESS_STATUS.COMPLETED;
		tracker.endTime = Date.now();
		tracker.progress = 100;
		tracker.result = result;

		this.sessionData.completedSteps++;
		this.notifySubscribers();
		return true;
	}

	// Fail progress
	fail(id, error) {
		const tracker = this.progressTrackers.get(id);
		if (!tracker) return false;

		tracker.status = PROGRESS_STATUS.FAILED;
		tracker.endTime = Date.now();
		tracker.error = error;

		this.notifySubscribers();
		return true;
	}

	// Skip progress
	skip(id, reason = "") {
		const tracker = this.progressTrackers.get(id);
		if (!tracker) return false;

		tracker.status = PROGRESS_STATUS.SKIPPED;
		tracker.endTime = Date.now();
		tracker.skipReason = reason;

		this.notifySubscribers();
		return true;
	}

	// Get tracker
	getTracker(id) {
		return this.progressTrackers.get(id);
	}

	// Get all trackers
	getAllTrackers() {
		return Array.from(this.progressTrackers.values());
	}

	// Get overall progress
	getOverallProgress() {
		const trackers = this.getAllTrackers();
		if (trackers.length === 0) return 0;

		const totalProgress = trackers.reduce((sum, tracker) => {
			return sum + tracker.progress;
		}, 0);

		return totalProgress / trackers.length;
	}

	// Get session statistics
	getSessionStats() {
		const trackers = this.getAllTrackers();
		const completed = trackers.filter(
			(t) => t.status === PROGRESS_STATUS.COMPLETED
		);
		const failed = trackers.filter(
			(t) => t.status === PROGRESS_STATUS.FAILED
		);
		const inProgress = trackers.filter(
			(t) => t.status === PROGRESS_STATUS.IN_PROGRESS
		);

		return {
			totalTrackers: trackers.length,
			completed: completed.length,
			failed: failed.length,
			inProgress: inProgress.length,
			completionRate:
				trackers.length > 0
					? (completed.length / trackers.length) * 100
					: 0,
			sessionDuration: Date.now() - this.sessionData.startTime,
			averageCompletionTime:
				this.calculateAverageCompletionTime(completed),
		};
	}

	calculateAverageCompletionTime(completedTrackers) {
		if (completedTrackers.length === 0) return 0;

		const totalTime = completedTrackers.reduce((sum, tracker) => {
			return sum + (tracker.endTime - tracker.startTime);
		}, 0);

		return totalTime / completedTrackers.length;
	}

	// Subscribe to updates
	subscribe(callback) {
		this.subscribers.add(callback);
		return () => this.subscribers.delete(callback);
	}

	// Notify subscribers
	notifySubscribers() {
		this.subscribers.forEach((callback) => {
			try {
				callback(this.getAllTrackers(), this.getSessionStats());
			} catch (error) {
				console.error("Progress subscriber error:", error);
			}
		});
	}

	// Create milestone
	createMilestone(id, config) {
		const milestone = {
			id,
			title: config.title,
			description: config.description,
			requiredTrackers: config.requiredTrackers || [],
			reward: config.reward || null,
			achieved: false,
			achievedAt: null,
		};

		this.milestones.set(id, milestone);
		this.checkMilestones();
		return milestone;
	}

	// Check if milestones are achieved
	checkMilestones() {
		this.milestones.forEach((milestone) => {
			if (milestone.achieved) return;

			const allRequired = milestone.requiredTrackers.every(
				(trackerId) => {
					const tracker = this.progressTrackers.get(trackerId);
					return (
						tracker && tracker.status === PROGRESS_STATUS.COMPLETED
					);
				}
			);

			if (allRequired) {
				milestone.achieved = true;
				milestone.achievedAt = Date.now();
				this.notifySubscribers();
			}
		});
	}
}

// Global progress manager instance
const globalProgressManager = new ProgressManager();

// Progress Provider Component
export const ProgressProvider = ({ children }) => {
	const [trackers, setTrackers] = useState([]);
	const [sessionStats, setSessionStats] = useState(
		globalProgressManager.getSessionStats()
	);

	useEffect(() => {
		const unsubscribe = globalProgressManager.subscribe(
			(updatedTrackers, stats) => {
				setTrackers(updatedTrackers);
				setSessionStats(stats);
			}
		);

		return unsubscribe;
	}, []);

	const contextValue = {
		trackers,
		sessionStats,
		manager: globalProgressManager,
		overallProgress: globalProgressManager.getOverallProgress(),
	};

	return (
		<ProgressContext.Provider value={contextValue}>
			{children}
		</ProgressContext.Provider>
	);
};

// Hook to use progress context
export const useProgress = () => {
	const context = useContext(ProgressContext);
	if (!context) {
		throw new Error("useProgress must be used within a ProgressProvider");
	}
	return context;
};

// Hook for individual progress tracking
export const useProgressTracker = (id, config = {}) => {
	const { manager } = useProgress();
	const [tracker, setTracker] = useState(null);

	useEffect(() => {
		const progressTracker = manager.createTracker(id, config);
		setTracker(progressTracker);

		const unsubscribe = manager.subscribe(() => {
			setTracker(manager.getTracker(id));
		});

		return unsubscribe;
	}, [id, manager]);

	const start = useCallback(() => {
		return manager.start(id);
	}, [id, manager]);

	const updateProgress = useCallback(
		(stepIndex, stepData) => {
			return manager.updateProgress(id, stepIndex, stepData);
		},
		[id, manager]
	);

	const complete = useCallback(
		(result) => {
			return manager.complete(id, result);
		},
		[id, manager]
	);

	const fail = useCallback(
		(error) => {
			return manager.fail(id, error);
		},
		[id, manager]
	);

	const skip = useCallback(
		(reason) => {
			return manager.skip(id, reason);
		},
		[id, manager]
	);

	return {
		tracker,
		start,
		updateProgress,
		complete,
		fail,
		skip,
		progress: tracker?.progress || 0,
		status: tracker?.status || PROGRESS_STATUS.NOT_STARTED,
		isCompleted: tracker?.status === PROGRESS_STATUS.COMPLETED,
		isFailed: tracker?.status === PROGRESS_STATUS.FAILED,
		isInProgress: tracker?.status === PROGRESS_STATUS.IN_PROGRESS,
	};
};

// Progress Bar Component
export const ProgressBar = ({
	trackerId,
	showPercentage = true,
	showStatus = true,
	className = "",
	style = {},
}) => {
	const { manager } = useProgress();
	const [tracker, setTracker] = useState(manager.getTracker(trackerId));

	useEffect(() => {
		const unsubscribe = manager.subscribe(() => {
			setTracker(manager.getTracker(trackerId));
		});
		return unsubscribe;
	}, [trackerId, manager]);

	if (!tracker) return null;

	const getStatusColor = (status) => {
		switch (status) {
			case PROGRESS_STATUS.COMPLETED:
				return "bg-green-500";
			case PROGRESS_STATUS.FAILED:
				return "bg-red-500";
			case PROGRESS_STATUS.IN_PROGRESS:
				return "bg-blue-500";
			default:
				return "bg-gray-300";
		}
	};

	return (
		<div className={`progress-bar-container ${className}`} style={style}>
			{showStatus && (
				<div className="progress-header mb-2">
					<span className="progress-title font-medium">
						{tracker.title}
					</span>
					<span className="progress-status text-sm text-gray-600">
						{tracker.status.replace("_", " ")}
					</span>
				</div>
			)}
			<div className="progress-bar-wrapper">
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(tracker.status)}`}
						style={{ width: `${tracker.progress}%` }}
					/>
				</div>
				{showPercentage && (
					<span className="progress-percentage text-sm text-gray-600 ml-2">
						{Math.round(tracker.progress)}%
					</span>
				)}
			</div>
		</div>
	);
};

// Overall Progress Dashboard
export const ProgressDashboard = () => {
	const { trackers, sessionStats, overallProgress } = useProgress();

	return (
		<div className="progress-dashboard p-4 bg-white rounded-lg shadow">
			<h3 className="text-lg font-semibold mb-4">進度總覽</h3>

			{/* Overall Progress */}
			<div className="overall-progress mb-6">
				<div className="flex justify-between items-center mb-2">
					<span className="font-medium">整體進度</span>
					<span className="text-sm text-gray-600">
						{Math.round(overallProgress)}%
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-3">
					<div
						className="h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
						style={{ width: `${overallProgress}%` }}
					/>
				</div>
			</div>

			{/* Session Statistics */}
			<div className="session-stats grid grid-cols-2 gap-4 mb-6">
				<div className="stat-item">
					<div className="text-2xl font-bold text-blue-600">
						{sessionStats.completed}
					</div>
					<div className="text-sm text-gray-600">已完成</div>
				</div>
				<div className="stat-item">
					<div className="text-2xl font-bold text-orange-600">
						{sessionStats.inProgress}
					</div>
					<div className="text-sm text-gray-600">進行中</div>
				</div>
				<div className="stat-item">
					<div className="text-2xl font-bold text-red-600">
						{sessionStats.failed}
					</div>
					<div className="text-sm text-gray-600">失敗</div>
				</div>
				<div className="stat-item">
					<div className="text-2xl font-bold text-green-600">
						{Math.round(sessionStats.completionRate)}%
					</div>
					<div className="text-sm text-gray-600">完成率</div>
				</div>
			</div>

			{/* Individual Trackers */}
			<div className="trackers-list">
				<h4 className="font-medium mb-3">詳細進度</h4>
				{trackers.map((tracker) => (
					<ProgressBar
						key={tracker.id}
						trackerId={tracker.id}
						className="mb-3"
					/>
				))}
			</div>
		</div>
	);
};

// User Journey Tracker
export const useUserJourney = () => {
	const { manager } = useProgress();

	const initializeJourney = useCallback(
		(steps) => {
			return manager.createTracker("user-journey", {
				type: PROGRESS_TYPES.USER_JOURNEY,
				title: "用戶體驗流程",
				steps: steps.map((step, index) => ({
					id: index,
					title: step.title,
					description: step.description,
					required: step.required || false,
					estimatedTime: step.estimatedTime || null,
				})),
			});
		},
		[manager]
	);

	const nextStep = useCallback(
		(stepData = {}) => {
			const tracker = manager.getTracker("user-journey");
			if (tracker) {
				const nextStepIndex = tracker.currentStep + 1;
				manager.updateProgress("user-journey", nextStepIndex, stepData);
			}
		},
		[manager]
	);

	const completeJourney = useCallback(
		(result) => {
			return manager.complete("user-journey", result);
		},
		[manager]
	);

	return {
		initializeJourney,
		nextStep,
		completeJourney,
	};
};

export { globalProgressManager };
export default ProgressManager;
