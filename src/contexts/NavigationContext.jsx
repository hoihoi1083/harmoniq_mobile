import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useRef,
	useEffect,
} from "react";
import { useFengShuiReport } from "../contexts/FengShuiReportContext";

/**
 * Component Interaction and Navigation System
 * Handles cross-component communication, navigation, and synchronized states
 */

// Navigation Context
const NavigationContext = createContext();

// Component Registry
const COMPONENT_ORDER = [
	"FiveElement",
	"Zodiac",
	"LiuNianKeyWord",
	"MingJu",
	"LiuNianGanZhi",
	"GanZhi",
	"JiXiong",
	"Season",
	"CoreSuggestion",
	"SpecificSuggestion",
];

const COMPONENT_METADATA = {
	FiveElement: {
		title: "五行分析",
		category: "traditional",
		dependencies: ["userInfo"],
		outputs: ["element", "balance"],
		description: "基於出生日期分析五行屬性與平衡狀態",
	},
	Zodiac: {
		title: "生肖分析",
		category: "traditional",
		dependencies: ["userInfo"],
		outputs: ["zodiac", "characteristics"],
		description: "生肖特性與運勢分析",
	},
	LiuNianKeyWord: {
		title: "流年關鍵詞",
		category: "ai",
		dependencies: ["userInfo", "concern"],
		outputs: ["keywords", "trends"],
		description: "AI分析本年度重要關鍵詞與趨勢",
	},
	MingJu: {
		title: "命局分析",
		category: "ai",
		dependencies: ["userInfo", "FiveElement"],
		outputs: ["destiny", "potential"],
		description: "深度命理分析與潛能解讀",
	},
	LiuNianGanZhi: {
		title: "流年干支",
		category: "ai",
		dependencies: ["userInfo", "Zodiac"],
		outputs: ["ganzhi", "influences"],
		description: "流年干支影響分析",
	},
	GanZhi: {
		title: "八字干支",
		category: "ai",
		dependencies: ["userInfo"],
		outputs: ["bazi", "analysis"],
		description: "完整八字干支分析",
	},
	JiXiong: {
		title: "吉凶分析",
		category: "ai",
		dependencies: ["GanZhi", "FiveElement"],
		outputs: ["fortune", "warnings"],
		description: "綜合吉凶判斷與建議",
	},
	Season: {
		title: "季節調節",
		category: "ai",
		dependencies: ["userInfo", "FiveElement", "concern"],
		outputs: ["seasonal_advice", "adjustments"],
		description: "根據季節與五行的調節建議",
	},
	CoreSuggestion: {
		title: "核心建議",
		category: "ai",
		dependencies: ["all_traditional", "concern"],
		outputs: ["core_advice", "priorities"],
		description: "基於所有分析的核心建議",
	},
	SpecificSuggestion: {
		title: "具體建議",
		category: "ai",
		dependencies: ["CoreSuggestion", "problem"],
		outputs: ["specific_actions", "timeline"],
		description: "針對具體問題的詳細解決方案",
	},
};

// Navigation Provider
export const NavigationProvider = ({ children }) => {
	const { state, actions, selectors } = useFengShuiReport();
	const [currentComponent, setCurrentComponent] = useState(null);
	const [visitedComponents, setVisitedComponents] = useState(new Set());
	const [navigationHistory, setNavigationHistory] = useState([]);
	const [isAutoScrolling, setIsAutoScrolling] = useState(false);
	const componentRefs = useRef({});
	const scrollTimeoutRef = useRef(null);

	// Navigation Actions
	const navigateTo = useCallback(
		(componentName, smooth = true) => {
			if (!COMPONENT_METADATA[componentName]) {
				console.warn(`Unknown component: ${componentName}`);
				return;
			}

			// Update navigation history
			setNavigationHistory((prev) => {
				const filtered = prev.filter((item) => item !== componentName);
				return [...filtered, componentName].slice(-10); // Keep last 10
			});

			// Update visited components
			setVisitedComponents((prev) => new Set([...prev, componentName]));

			// Set current component
			setCurrentComponent(componentName);

			// Track interaction
			actions.updateInteraction(componentName, "navigate", 0, {
				from: currentComponent,
			});

			// Scroll to component
			if (smooth && componentRefs.current[componentName]) {
				setIsAutoScrolling(true);
				componentRefs.current[componentName].scrollIntoView({
					behavior: "smooth",
					block: "start",
				});

				// Reset auto-scroll flag after animation
				if (scrollTimeoutRef.current) {
					clearTimeout(scrollTimeoutRef.current);
				}
				scrollTimeoutRef.current = setTimeout(() => {
					setIsAutoScrolling(false);
				}, 1000);
			}
		},
		[currentComponent, actions]
	);

	const navigateNext = useCallback(() => {
		const currentIndex = COMPONENT_ORDER.indexOf(currentComponent);
		if (currentIndex < COMPONENT_ORDER.length - 1) {
			navigateTo(COMPONENT_ORDER[currentIndex + 1]);
		}
	}, [currentComponent, navigateTo]);

	const navigatePrevious = useCallback(() => {
		const currentIndex = COMPONENT_ORDER.indexOf(currentComponent);
		if (currentIndex > 0) {
			navigateTo(COMPONENT_ORDER[currentIndex - 1]);
		}
	}, [currentComponent, navigateTo]);

	const navigateToCategory = useCallback(
		(category) => {
			const categoryComponents = COMPONENT_ORDER.filter(
				(name) => COMPONENT_METADATA[name].category === category
			);
			if (categoryComponents.length > 0) {
				navigateTo(categoryComponents[0]);
			}
		},
		[navigateTo]
	);

	// Auto-navigation based on completion
	const autoNavigateNext = useCallback(() => {
		const preferences = selectors.getPreferences();
		if (preferences.autoScroll && currentComponent) {
			setTimeout(() => navigateNext(), 2000); // Auto-advance after 2 seconds
		}
	}, [currentComponent, navigateNext, selectors]);

	// Get component status
	const getComponentStatus = useCallback(
		(componentName) => {
			const analysis = selectors.getAnalysis(componentName);
			const isLoading = selectors.isLoading(componentName);
			const hasError = selectors.hasError(componentName);
			const isVisited = visitedComponents.has(componentName);
			const isCurrent = currentComponent === componentName;

			return {
				completed: !!analysis,
				loading: isLoading,
				error: hasError,
				visited: isVisited,
				current: isCurrent,
				canNavigate: true, // Could add dependency checking here
			};
		},
		[selectors, visitedComponents, currentComponent]
	);

	// Get navigation suggestions
	const getNavigationSuggestions = useCallback(() => {
		const suggestions = [];
		const completedComponents = COMPONENT_ORDER.filter((name) =>
			selectors.getAnalysis(name)
		);

		// Suggest next logical component
		if (completedComponents.length > 0) {
			const lastCompleted =
				completedComponents[completedComponents.length - 1];
			const nextIndex = COMPONENT_ORDER.indexOf(lastCompleted) + 1;

			if (nextIndex < COMPONENT_ORDER.length) {
				suggestions.push({
					type: "next",
					component: COMPONENT_ORDER[nextIndex],
					reason: "建議繼續下一個分析組件",
				});
			}
		}

		// Suggest components with cross-references
		if (currentComponent) {
			const crossRefs = selectors.getCrossReferences(currentComponent);
			crossRefs.forEach((ref) => {
				suggestions.push({
					type: "related",
					component: ref.to,
					reason: ref.description,
				});
			});
		}

		// Suggest components based on user interactions
		const recentInteractions = selectors.getRecentInteractions();
		const frequentComponents = recentInteractions.reduce(
			(acc, interaction) => {
				acc[interaction.componentName] =
					(acc[interaction.componentName] || 0) + 1;
				return acc;
			},
			{}
		);

		Object.entries(frequentComponents)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 3)
			.forEach(([componentName]) => {
				if (componentName !== currentComponent) {
					suggestions.push({
						type: "frequent",
						component: componentName,
						reason: "您經常查看的組件",
					});
				}
			});

		return suggestions.slice(0, 5); // Limit to 5 suggestions
	}, [currentComponent, selectors]);

	// Component dependency checker
	const checkDependencies = useCallback(
		(componentName) => {
			const metadata = COMPONENT_METADATA[componentName];
			if (!metadata) return { satisfied: false, missing: [] };

			const missing = [];

			metadata.dependencies.forEach((dep) => {
				if (dep === "userInfo") {
					const userInfo = selectors.getUserInfo();
					if (!userInfo.birthDateTime || !userInfo.gender) {
						missing.push("完整用戶信息（生日、性別）");
					}
				} else if (dep === "concern") {
					const userInfo = selectors.getUserInfo();
					if (!userInfo.concern) {
						missing.push("關注領域");
					}
				} else if (dep === "problem") {
					const userInfo = selectors.getUserInfo();
					if (!userInfo.problem) {
						missing.push("具體問題");
					}
				} else if (dep === "all_traditional") {
					const traditionalComponents = ["FiveElement", "Zodiac"];
					const missingTraditional = traditionalComponents.filter(
						(name) => !selectors.getAnalysis(name)
					);
					if (missingTraditional.length > 0) {
						missing.push(
							`傳統分析組件: ${missingTraditional.join(", ")}`
						);
					}
				} else if (COMPONENT_METADATA[dep]) {
					const analysis = selectors.getAnalysis(dep);
					if (!analysis) {
						missing.push(COMPONENT_METADATA[dep].title);
					}
				}
			});

			return {
				satisfied: missing.length === 0,
				missing,
			};
		},
		[selectors]
	);

	// Progress calculation
	const getProgress = useCallback(() => {
		const totalComponents = COMPONENT_ORDER.length;
		const completedComponents = COMPONENT_ORDER.filter((name) =>
			selectors.getAnalysis(name)
		).length;

		return {
			total: totalComponents,
			completed: completedComponents,
			percentage: Math.round(
				(completedComponents / totalComponents) * 100
			),
			currentIndex: currentComponent
				? COMPONENT_ORDER.indexOf(currentComponent)
				: 0,
		};
	}, [selectors, currentComponent]);

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.ctrlKey || event.metaKey) {
				switch (event.key) {
					case "ArrowRight":
						event.preventDefault();
						navigateNext();
						break;
					case "ArrowLeft":
						event.preventDefault();
						navigatePrevious();
						break;
					case "ArrowUp":
						event.preventDefault();
						navigateToCategory("traditional");
						break;
					case "ArrowDown":
						event.preventDefault();
						navigateToCategory("ai");
						break;
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [navigateNext, navigatePrevious, navigateToCategory]);

	// Component visibility tracking
	useEffect(() => {
		const observerOptions = {
			threshold: 0.5,
			rootMargin: "-100px 0px",
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && !isAutoScrolling) {
					const componentName = entry.target.dataset.componentName;
					if (componentName && componentName !== currentComponent) {
						setCurrentComponent(componentName);
						actions.updateInteraction(
							componentName,
							"view",
							entry.intersectionRatio
						);
					}
				}
			});
		}, observerOptions);

		Object.values(componentRefs.current).forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => observer.disconnect();
	}, [currentComponent, isAutoScrolling, actions]);

	const value = {
		// State
		currentComponent,
		visitedComponents,
		navigationHistory,
		isAutoScrolling,

		// Actions
		navigateTo,
		navigateNext,
		navigatePrevious,
		navigateToCategory,
		autoNavigateNext,

		// Getters
		getComponentStatus,
		getNavigationSuggestions,
		checkDependencies,
		getProgress,

		// Refs
		componentRefs,

		// Constants
		COMPONENT_ORDER,
		COMPONENT_METADATA,
	};

	return (
		<NavigationContext.Provider value={value}>
			{children}
		</NavigationContext.Provider>
	);
};

// Hook to use navigation
export const useNavigation = () => {
	const context = useContext(NavigationContext);
	if (!context) {
		throw new Error("useNavigation must be used within NavigationProvider");
	}
	return context;
};

// Navigation Components

// Progress Bar Component
export const NavigationProgressBar = () => {
	const { getProgress } = useNavigation();
	const progress = getProgress();

	return (
		<div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
			<div
				className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
				style={{ width: `${progress.percentage}%` }}
			/>
			<div className="mt-1 text-xs text-gray-600">
				{progress.completed} / {progress.total} 完成 (
				{progress.percentage}%)
			</div>
		</div>
	);
};

// Navigation Menu Component
export const NavigationMenu = () => {
	const {
		COMPONENT_ORDER,
		COMPONENT_METADATA,
		currentComponent,
		navigateTo,
		getComponentStatus,
	} = useNavigation();

	return (
		<nav className="space-y-2">
			{COMPONENT_ORDER.map((componentName) => {
				const metadata = COMPONENT_METADATA[componentName];
				const status = getComponentStatus(componentName);

				return (
					<button
						key={componentName}
						onClick={() => navigateTo(componentName)}
						className={`
              w-full text-left p-3 rounded-lg transition-all duration-200
              ${status.current ? "bg-blue-100 border-l-4 border-blue-500" : ""}
              ${status.completed ? "bg-green-50" : ""}
              ${status.loading ? "bg-yellow-50" : ""}
              ${status.error ? "bg-red-50" : ""}
              hover:bg-gray-50
            `}
					>
						<div className="flex items-center justify-between">
							<div>
								<div className="font-medium">
									{metadata.title}
								</div>
								<div className="text-xs text-gray-500">
									{metadata.description}
								</div>
							</div>
							<div className="flex items-center space-x-1">
								{status.completed && (
									<span className="text-green-500">✓</span>
								)}
								{status.loading && (
									<span className="text-yellow-500">⏳</span>
								)}
								{status.error && (
									<span className="text-red-500">⚠</span>
								)}
								{status.visited && !status.completed && (
									<span className="text-blue-500">👁</span>
								)}
							</div>
						</div>
					</button>
				);
			})}
		</nav>
	);
};

// Navigation Suggestions Component
export const NavigationSuggestions = () => {
	const { getNavigationSuggestions, navigateTo, COMPONENT_METADATA } =
		useNavigation();
	const suggestions = getNavigationSuggestions();

	if (suggestions.length === 0) return null;

	return (
		<div className="p-4 rounded-lg bg-blue-50">
			<h3 className="mb-2 font-medium">建議查看</h3>
			<div className="space-y-2">
				{suggestions.map((suggestion, index) => (
					<button
						key={index}
						onClick={() => navigateTo(suggestion.component)}
						className="block w-full p-2 text-left bg-white border rounded hover:bg-gray-50"
					>
						<div className="font-medium">
							{COMPONENT_METADATA[suggestion.component].title}
						</div>
						<div className="text-xs text-gray-600">
							{suggestion.reason}
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

// Keyboard Shortcuts Helper
export const KeyboardShortcuts = () => (
	<div className="space-y-1 text-xs text-gray-500">
		<div>⌘/Ctrl + → : 下一個組件</div>
		<div>⌘/Ctrl + ← : 上一個組件</div>
		<div>⌘/Ctrl + ↑ : 傳統分析</div>
		<div>⌘/Ctrl + ↓ : AI分析</div>
	</div>
);

// Component Registration Helper
export const registerComponent = (componentName, ref) => {
	const { componentRefs } = useNavigation();
	componentRefs.current[componentName] = ref;
};

export default {
	NavigationProvider,
	useNavigation,
	NavigationProgressBar,
	NavigationMenu,
	NavigationSuggestions,
	KeyboardShortcuts,
	registerComponent,
};
