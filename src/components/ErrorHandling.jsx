import React, { Component, createContext, useContext, useState } from "react";

/**
 * Error Handling Context and Components
 */

// Error Context
const ErrorContext = createContext();

// Error types
export const ErrorTypes = {
	AI_FAILURE: "AI_FAILURE",
	NETWORK_ERROR: "NETWORK_ERROR",
	VALIDATION_ERROR: "VALIDATION_ERROR",
	COMPONENT_ERROR: "COMPONENT_ERROR",
	CACHE_ERROR: "CACHE_ERROR",
};

// Error Provider
export const ErrorProvider = ({ children }) => {
	const [errors, setErrors] = useState({});
	const [fallbackMode, setFallbackMode] = useState(false);

	const reportError = (
		componentName,
		error,
		errorType = ErrorTypes.COMPONENT_ERROR
	) => {
		console.error(`Error in ${componentName}:`, error);

		const errorInfo = {
			message: error.message || "未知錯誤",
			type: errorType,
			timestamp: Date.now(),
			componentName,
			stack: error.stack,
			userAgent: navigator.userAgent,
		};

		setErrors((prev) => ({
			...prev,
			[componentName]: errorInfo,
		}));

		// Auto-enable fallback mode for AI failures
		if (errorType === ErrorTypes.AI_FAILURE) {
			setFallbackMode(true);
			// Auto-disable after 5 minutes
			setTimeout(() => setFallbackMode(false), 5 * 60 * 1000);
		}

		// Send error to monitoring service (optional)
		if (process.env.NODE_ENV === "production") {
			sendErrorToMonitoring(errorInfo);
		}
	};

	const clearError = (componentName) => {
		setErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[componentName];
			return newErrors;
		});
	};

	const clearAllErrors = () => {
		setErrors({});
		setFallbackMode(false);
	};

	return (
		<ErrorContext.Provider
			value={{
				errors,
				fallbackMode,
				reportError,
				clearError,
				clearAllErrors,
			}}
		>
			{children}
		</ErrorContext.Provider>
	);
};

// Hook to use error context
export const useError = () => {
	const context = useContext(ErrorContext);
	if (!context) {
		throw new Error("useError must be used within ErrorProvider");
	}
	return context;
};

// Error Boundary Component
export class ComponentErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		const { componentName, onError } = this.props;

		if (onError) {
			onError(componentName, error, ErrorTypes.COMPONENT_ERROR);
		}

		console.error(`Component ${componentName} crashed:`, error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			const { fallbackComponent: FallbackComponent, componentName } =
				this.props;

			if (FallbackComponent) {
				return (
					<FallbackComponent
						error={this.state.error}
						componentName={componentName}
					/>
				);
			}

			return (
				<DefaultErrorFallback
					error={this.state.error}
					componentName={componentName}
				/>
			);
		}

		return this.props.children;
	}
}

// Default Error Fallback Component
const DefaultErrorFallback = ({ error, componentName }) => (
	<div className="p-6 mb-6 border border-red-200 error-fallback bg-red-50 rounded-xl">
		<div className="flex items-center mb-4">
			<svg
				className="w-6 h-6 mr-3 text-red-500"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path
					fillRule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
					clipRule="evenodd"
				/>
			</svg>
			<h3 className="text-lg font-semibold text-red-800">組件載入失敗</h3>
		</div>

		<p className="mb-4 text-red-700">
			{componentName} 組件遇到問題，正在使用備用分析方法。
		</p>

		<div className="p-4 mb-4 bg-red-100 rounded-lg">
			<p className="text-sm text-red-600">
				我們已自動切換到傳統八字分析模式，確保您仍能獲得有價值的命理建議。
			</p>
		</div>

		<button
			onClick={() => window.location.reload()}
			className="px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
		>
			重新載入頁面
		</button>
	</div>
);

// Specialized fallback components for different component types
export const TraditionalAnalysisFallback = ({ userInfo, componentType }) => {
	const getFallbackContent = () => {
		switch (componentType) {
			case "jiXiong":
				return {
					title: "傳統吉凶分析",
					content:
						"基於古典八字理論，您的命局整體穩定，建議保持謹慎樂觀的態度，在關注的領域中穩步前進。",
				};
			case "season":
				return {
					title: "四季養生建議",
					content:
						"根據傳統命理，建議春季養肝、夏季養心、秋季養肺、冬季養腎，配合個人八字特點調節生活節奏。",
				};
			default:
				return {
					title: "傳統命理分析",
					content:
						"基於您的生辰八字，建議採用傳統的五行調和方法，注意生活中的平衡與節制。",
				};
		}
	};

	const { title, content } = getFallbackContent();

	return (
		<div className="p-6 mb-6 border traditional-fallback bg-amber-50 border-amber-200 rounded-xl">
			<div className="flex items-center mb-4">
				<svg
					className="w-6 h-6 mr-3 text-amber-600"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fillRule="evenodd"
						d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clipRule="evenodd"
					/>
				</svg>
				<h3 className="text-lg font-semibold text-amber-800">
					{title}
				</h3>
			</div>

			<div className="p-4 mb-4 rounded-lg bg-amber-100">
				<p className="text-amber-800">{content}</p>
			</div>

			<div className="text-sm text-amber-600">
				💡
				正在使用傳統命理分析方法，建議諮詢專業命理師獲得更詳細的個人化建議。
			</div>
		</div>
	);
};

// Network Error Component
export const NetworkErrorComponent = ({ onRetry }) => (
	<div className="p-6 mb-6 border border-blue-200 network-error bg-blue-50 rounded-xl">
		<div className="flex items-center mb-4">
			<svg
				className="w-6 h-6 mr-3 text-blue-500"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path
					fillRule="evenodd"
					d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-3.983-3.04a.75.75 0 00-1.449.39 5.5 5.5 0 019.201-2.466l.312.311h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.75-.75V3.127a.75.75 0 00-1.5 0v2.43l-.31-.31A7 7 0 008.329 8.384z"
					clipRule="evenodd"
				/>
			</svg>
			<h3 className="text-lg font-semibold text-blue-800">
				網路連線問題
			</h3>
		</div>

		<p className="mb-4 text-blue-700">
			無法連接到分析服務，請檢查網路連線或稍後再試。
		</p>

		<button
			onClick={onRetry}
			className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
		>
			重新嘗試
		</button>
	</div>
);

// Loading Error Component
export const LoadingErrorComponent = ({ componentName, onRetry }) => (
	<div className="p-6 mb-6 border border-gray-200 loading-error bg-gray-50 rounded-xl">
		<div className="flex items-center mb-4">
			<svg
				className="w-6 h-6 mr-3 text-gray-500 animate-spin"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path
					fillRule="evenodd"
					d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
					clipRule="evenodd"
				/>
			</svg>
			<h3 className="text-lg font-semibold text-gray-700">
				{componentName} 載入中...
			</h3>
		</div>

		<p className="mb-4 text-gray-600">分析需要一些時間，請耐心等候...</p>

		<div className="w-full h-2 bg-gray-200 rounded-full">
			<div
				className="h-2 bg-blue-600 rounded-full animate-pulse"
				style={{ width: "45%" }}
			></div>
		</div>
	</div>
);

// Error monitoring function (for production)
const sendErrorToMonitoring = (errorInfo) => {
	// Implement your error monitoring service here
	// For example: Sentry, LogRocket, or custom analytics
	console.info("Sending error to monitoring service:", errorInfo);
};

export default {
	ErrorProvider,
	ComponentErrorBoundary,
	TraditionalAnalysisFallback,
	NetworkErrorComponent,
	LoadingErrorComponent,
	useError,
	ErrorTypes,
};
