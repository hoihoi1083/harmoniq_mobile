import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";

/**
 * Advanced Loading State Management System
 * Provides intelligent loading states, progress tracking, and user experience optimization
 */

// Loading Context
const LoadingContext = createContext();

// Loading States
export const LOADING_STATES = {
	IDLE: "idle",
	LOADING: "loading",
	SUCCESS: "success",
	ERROR: "error",
	PARTIAL: "partial",
};

// Loading Priorities
export const LOADING_PRIORITIES = {
	LOW: 1,
	MEDIUM: 2,
	HIGH: 3,
	CRITICAL: 4,
};

// Loading Manager Class
export class LoadingManager {
	constructor() {
		this.loadingStates = new Map();
		this.progressTrackers = new Map();
		this.loadingQueue = [];
		this.subscribers = new Set();
		this.globalState = LOADING_STATES.IDLE;
	}

	// Register a loading operation
	register(id, options = {}) {
		const loadingState = {
			id,
			state: LOADING_STATES.IDLE,
			progress: 0,
			message: options.message || "載入中...",
			priority: options.priority || LOADING_PRIORITIES.MEDIUM,
			startTime: null,
			endTime: null,
			error: null,
			metadata: options.metadata || {},
		};

		this.loadingStates.set(id, loadingState);
		this.notifySubscribers();
		return loadingState;
	}

	// Start loading operation
	start(id, message = null) {
		const state = this.loadingStates.get(id);
		if (!state) return false;

		state.state = LOADING_STATES.LOADING;
		state.startTime = Date.now();
		state.progress = 0;
		if (message) state.message = message;

		this.updateGlobalState();
		this.notifySubscribers();
		return true;
	}

	// Update progress
	updateProgress(id, progress, message = null) {
		const state = this.loadingStates.get(id);
		if (!state) return false;

		state.progress = Math.max(0, Math.min(100, progress));
		if (message) state.message = message;

		this.notifySubscribers();
		return true;
	}

	// Complete loading operation
	complete(id, result = null) {
		const state = this.loadingStates.get(id);
		if (!state) return false;

		state.state = LOADING_STATES.SUCCESS;
		state.progress = 100;
		state.endTime = Date.now();
		state.result = result;

		this.updateGlobalState();
		this.notifySubscribers();
		return true;
	}

	// Fail loading operation
	fail(id, error) {
		const state = this.loadingStates.get(id);
		if (!state) return false;

		state.state = LOADING_STATES.ERROR;
		state.endTime = Date.now();
		state.error = error;

		this.updateGlobalState();
		this.notifySubscribers();
		return true;
	}

	// Remove loading operation
	remove(id) {
		const removed = this.loadingStates.delete(id);
		if (removed) {
			this.updateGlobalState();
			this.notifySubscribers();
		}
		return removed;
	}

	// Get loading state
	getState(id) {
		return this.loadingStates.get(id);
	}

	// Get all loading states
	getAllStates() {
		return Array.from(this.loadingStates.values());
	}

	// Check if any loading is active
	isLoading() {
		return Array.from(this.loadingStates.values()).some(
			(state) => state.state === LOADING_STATES.LOADING
		);
	}

	// Get highest priority loading state
	getHighestPriorityState() {
		return Array.from(this.loadingStates.values())
			.filter((state) => state.state === LOADING_STATES.LOADING)
			.sort((a, b) => b.priority - a.priority)[0];
	}

	// Update global state
	updateGlobalState() {
		const states = Array.from(this.loadingStates.values());

		if (states.some((state) => state.state === LOADING_STATES.ERROR)) {
			this.globalState = LOADING_STATES.ERROR;
		} else if (
			states.some((state) => state.state === LOADING_STATES.LOADING)
		) {
			this.globalState = LOADING_STATES.LOADING;
		} else if (
			states.some((state) => state.state === LOADING_STATES.SUCCESS)
		) {
			this.globalState = LOADING_STATES.SUCCESS;
		} else {
			this.globalState = LOADING_STATES.IDLE;
		}
	}

	// Subscribe to state changes
	subscribe(callback) {
		this.subscribers.add(callback);
		return () => this.subscribers.delete(callback);
	}

	// Notify subscribers
	notifySubscribers() {
		this.subscribers.forEach((callback) => {
			try {
				callback(this.globalState, this.getAllStates());
			} catch (error) {
				console.error("Loading manager subscriber error:", error);
			}
		});
	}

	// Get loading statistics
	getStatistics() {
		const states = this.getAllStates();
		return {
			total: states.length,
			loading: states.filter((s) => s.state === LOADING_STATES.LOADING)
				.length,
			completed: states.filter((s) => s.state === LOADING_STATES.SUCCESS)
				.length,
			failed: states.filter((s) => s.state === LOADING_STATES.ERROR)
				.length,
			averageTime: this.calculateAverageTime(states),
		};
	}

	calculateAverageTime(states) {
		const completed = states.filter((s) => s.endTime && s.startTime);
		if (completed.length === 0) return 0;

		const totalTime = completed.reduce((sum, state) => {
			return sum + (state.endTime - state.startTime);
		}, 0);

		return totalTime / completed.length;
	}
}

// Global loading manager instance
const globalLoadingManager = new LoadingManager();

// Loading Provider Component
export const LoadingProvider = ({ children }) => {
	const [globalState, setGlobalState] = useState(LOADING_STATES.IDLE);
	const [loadingStates, setLoadingStates] = useState([]);

	useEffect(() => {
		const unsubscribe = globalLoadingManager.subscribe((state, states) => {
			setGlobalState(state);
			setLoadingStates(states);
		});

		return unsubscribe;
	}, []);

	const contextValue = {
		globalState,
		loadingStates,
		manager: globalLoadingManager,
		isLoading: globalLoadingManager.isLoading(),
		statistics: globalLoadingManager.getStatistics(),
	};

	return (
		<LoadingContext.Provider value={contextValue}>
			{children}
		</LoadingContext.Provider>
	);
};

// Hook to use loading context
export const useLoading = () => {
	const context = useContext(LoadingContext);
	if (!context) {
		throw new Error("useLoading must be used within a LoadingProvider");
	}
	return context;
};

// Hook for individual loading state management
export const useLoadingState = (id, options = {}) => {
	const { manager } = useLoading();
	const [state, setState] = useState(null);

	useEffect(() => {
		const loadingState = manager.register(id, options);
		setState(loadingState);

		const unsubscribe = manager.subscribe(() => {
			setState(manager.getState(id));
		});

		return () => {
			unsubscribe();
			manager.remove(id);
		};
	}, [id, manager]);

	const start = useCallback(
		(message) => {
			return manager.start(id, message);
		},
		[id, manager]
	);

	const updateProgress = useCallback(
		(progress, message) => {
			return manager.updateProgress(id, progress, message);
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

	return {
		state,
		start,
		updateProgress,
		complete,
		fail,
		isLoading: state?.state === LOADING_STATES.LOADING,
		isComplete: state?.state === LOADING_STATES.SUCCESS,
		hasError: state?.state === LOADING_STATES.ERROR,
		progress: state?.progress || 0,
	};
};

// Smart Loading Component
export const SmartLoader = ({
	id,
	children,
	fallback = null,
	showProgress = true,
	showMessage = true,
	className = "",
	style = {},
}) => {
	const { manager } = useLoading();
	const [state, setState] = useState(manager.getState(id));

	useEffect(() => {
		const unsubscribe = manager.subscribe(() => {
			setState(manager.getState(id));
		});
		return unsubscribe;
	}, [id, manager]);

	if (!state || state.state === LOADING_STATES.IDLE) {
		return children;
	}

	if (state.state === LOADING_STATES.SUCCESS) {
		return children;
	}

	if (state.state === LOADING_STATES.ERROR) {
		return (
			<div className={`loading-error ${className}`} style={style}>
				<div className="error-icon">⚠️</div>
				<div className="error-message">
					載入失敗: {state.error?.message || "未知錯誤"}
				</div>
				<button
					onClick={() => manager.start(id)}
					className="retry-button"
				>
					重試
				</button>
			</div>
		);
	}

	return (
		fallback || (
			<div className={`smart-loader ${className}`} style={style}>
				<div className="loader-content">
					<div className="spinner">
						<div className="spinner-circle"></div>
					</div>
					{showMessage && (
						<div className="loader-message">{state.message}</div>
					)}
					{showProgress && state.progress > 0 && (
						<div className="progress-container">
							<div className="progress-bar">
								<div
									className="progress-fill"
									style={{ width: `${state.progress}%` }}
								/>
							</div>
							<div className="progress-text">
								{Math.round(state.progress)}%
							</div>
						</div>
					)}
				</div>
			</div>
		)
	);
};

// Global Loading Overlay
export const GlobalLoadingOverlay = () => {
	const { globalState, loadingStates, isLoading } = useLoading();

	if (!isLoading) return null;

	const activeStates = loadingStates.filter(
		(state) => state.state === LOADING_STATES.LOADING
	);

	const highestPriority = activeStates.sort(
		(a, b) => b.priority - a.priority
	)[0];

	return (
		<div className="global-loading-overlay">
			<div className="overlay-backdrop" />
			<div className="overlay-content">
				<div className="overlay-spinner">
					<div className="spinner-large"></div>
				</div>
				<div className="overlay-message">
					{highestPriority?.message || "處理中..."}
				</div>
				{highestPriority?.progress > 0 && (
					<div className="overlay-progress">
						<div className="progress-bar-large">
							<div
								className="progress-fill-large"
								style={{
									width: `${highestPriority.progress}%`,
								}}
							/>
						</div>
					</div>
				)}
				<div className="overlay-count">
					{activeStates.length > 1 &&
						`還有 ${activeStates.length - 1} 個項目正在處理`}
				</div>
			</div>
		</div>
	);
};

// Loading Statistics Component
export const LoadingStatistics = () => {
	const { statistics } = useLoading();

	return (
		<div className="loading-statistics">
			<h4>載入統計</h4>
			<div className="stats-grid">
				<div className="stat-item">
					<span className="stat-label">總計:</span>
					<span className="stat-value">{statistics.total}</span>
				</div>
				<div className="stat-item">
					<span className="stat-label">進行中:</span>
					<span className="stat-value">{statistics.loading}</span>
				</div>
				<div className="stat-item">
					<span className="stat-label">已完成:</span>
					<span className="stat-value">{statistics.completed}</span>
				</div>
				<div className="stat-item">
					<span className="stat-label">失敗:</span>
					<span className="stat-value">{statistics.failed}</span>
				</div>
				<div className="stat-item">
					<span className="stat-label">平均時間:</span>
					<span className="stat-value">
						{Math.round(statistics.averageTime)}ms
					</span>
				</div>
			</div>
		</div>
	);
};

// Async Operation Wrapper
export const withLoading = (id, options = {}) => {
	return (asyncFunction) => {
		return async (...args) => {
			const manager = globalLoadingManager;

			try {
				manager.register(id, options);
				manager.start(id);

				const result = await asyncFunction(...args);

				manager.complete(id, result);
				return result;
			} catch (error) {
				manager.fail(id, error);
				throw error;
			}
		};
	};
};

export { globalLoadingManager };
export default LoadingManager;
