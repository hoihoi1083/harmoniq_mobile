import React, { createContext, useContext, useReducer, useEffect } from "react";

/**
 * Centralized State Management for Feng Shui Report
 */

// Action Types
export const ActionTypes = {
	SET_USER_INFO: "SET_USER_INFO",
	UPDATE_ANALYSIS: "UPDATE_ANALYSIS",
	SET_LOADING: "SET_LOADING",
	SET_ERROR: "SET_ERROR",
	CLEAR_ERROR: "CLEAR_ERROR",
	ADD_INSIGHT: "ADD_INSIGHT",
	UPDATE_PREFERENCES: "UPDATE_PREFERENCES",
	SET_COMPONENT_STATE: "SET_COMPONENT_STATE",
	ADD_CROSS_REFERENCE: "ADD_CROSS_REFERENCE",
	SET_META_ANALYSIS: "SET_META_ANALYSIS",
	UPDATE_INTERACTION: "UPDATE_INTERACTION",
};

// Initial State
const initialState = {
	// User Information
	userInfo: {
		birthDateTime: null,
		gender: null,
		concern: null,
		problem: null,
	},

	// Analysis Results
	analysisResults: {},

	// Component Loading States
	loadingStates: {},

	// Component Errors
	errors: {},

	// Cross-component Insights
	insights: {},

	// Cross References between components
	crossReferences: {},

	// Meta Analysis (insights from all components)
	metaAnalysis: null,

	// User Preferences
	preferences: {
		showAIPrompts: false,
		mobileView: false,
		language: "zh-CN",
		componentOrder: null,
		autoScroll: true,
		animationsEnabled: true,
	},

	// Component States (active tabs, expanded sections, etc.)
	componentStates: {},

	// User Interactions (for personalization)
	interactions: [],

	// System Status
	status: {
		initialized: false,
		fallbackMode: false,
		lastUpdate: null,
	},
};

// Reducer
const reportReducer = (state, action) => {
	switch (action.type) {
		case ActionTypes.SET_USER_INFO:
			return {
				...state,
				userInfo: { ...state.userInfo, ...action.payload },
				status: { ...state.status, lastUpdate: Date.now() },
			};

		case ActionTypes.UPDATE_ANALYSIS:
			const { componentName, analysis } = action.payload;
			return {
				...state,
				analysisResults: {
					...state.analysisResults,
					[componentName]: {
						...analysis,
						timestamp: Date.now(),
						componentName,
					},
				},
				loadingStates: {
					...state.loadingStates,
					[componentName]: false,
				},
			};

		case ActionTypes.SET_LOADING:
			return {
				...state,
				loadingStates: {
					...state.loadingStates,
					[action.payload.componentName]: action.payload.isLoading,
				},
			};

		case ActionTypes.SET_ERROR:
			return {
				...state,
				errors: {
					...state.errors,
					[action.payload.componentName]: {
						...action.payload.error,
						timestamp: Date.now(),
					},
				},
				loadingStates: {
					...state.loadingStates,
					[action.payload.componentName]: false,
				},
			};

		case ActionTypes.CLEAR_ERROR:
			const newErrors = { ...state.errors };
			delete newErrors[action.payload.componentName];
			return {
				...state,
				errors: newErrors,
			};

		case ActionTypes.ADD_INSIGHT:
			return {
				...state,
				insights: {
					...state.insights,
					[action.payload.source]: {
						...action.payload.insight,
						timestamp: Date.now(),
					},
				},
			};

		case ActionTypes.UPDATE_PREFERENCES:
			return {
				...state,
				preferences: {
					...state.preferences,
					...action.payload,
				},
			};

		case ActionTypes.SET_COMPONENT_STATE:
			return {
				...state,
				componentStates: {
					...state.componentStates,
					[action.payload.componentName]: {
						...state.componentStates[action.payload.componentName],
						...action.payload.state,
					},
				},
			};

		case ActionTypes.ADD_CROSS_REFERENCE:
			return {
				...state,
				crossReferences: {
					...state.crossReferences,
					[action.payload.from]: [
						...(state.crossReferences[action.payload.from] || []),
						{
							to: action.payload.to,
							type: action.payload.type,
							description: action.payload.description,
							timestamp: Date.now(),
						},
					],
				},
			};

		case ActionTypes.SET_META_ANALYSIS:
			return {
				...state,
				metaAnalysis: {
					...action.payload,
					timestamp: Date.now(),
				},
			};

		case ActionTypes.UPDATE_INTERACTION:
			return {
				...state,
				interactions: [
					...state.interactions,
					{
						...action.payload,
						timestamp: Date.now(),
					},
				].slice(-100), // Keep only last 100 interactions
			};

		default:
			return state;
	}
};

// Context
const FengShuiReportContext = createContext();

// Provider Component
export const FengShuiReportProvider = ({ children }) => {
	const [state, dispatch] = useReducer(reportReducer, initialState);

	// Initialize from localStorage
	useEffect(() => {
		const savedState = localStorage.getItem("fengshui_report_state");
		if (savedState) {
			try {
				const parsed = JSON.parse(savedState);
				// Restore preferences and component states
				if (parsed.preferences) {
					dispatch({
						type: ActionTypes.UPDATE_PREFERENCES,
						payload: parsed.preferences,
					});
				}
				if (parsed.componentStates) {
					Object.entries(parsed.componentStates).forEach(
						([componentName, componentState]) => {
							dispatch({
								type: ActionTypes.SET_COMPONENT_STATE,
								payload: {
									componentName,
									state: componentState,
								},
							});
						}
					);
				}
			} catch (error) {
				console.warn(
					"Failed to restore state from localStorage:",
					error
				);
			}
		}

		dispatch({
			type: ActionTypes.UPDATE_PREFERENCES,
			payload: { ...state.preferences, initialized: true },
		});
	}, []);

	// Save state to localStorage
	useEffect(() => {
		const stateToSave = {
			preferences: state.preferences,
			componentStates: state.componentStates,
			interactions: state.interactions.slice(-50), // Save only recent interactions
		};

		localStorage.setItem(
			"fengshui_report_state",
			JSON.stringify(stateToSave)
		);
	}, [state.preferences, state.componentStates, state.interactions]);

	// Action Creators
	const actions = {
		setUserInfo: (userInfo) => {
			dispatch({
				type: ActionTypes.SET_USER_INFO,
				payload: userInfo,
			});
		},

		updateAnalysis: (componentName, analysis) => {
			dispatch({
				type: ActionTypes.UPDATE_ANALYSIS,
				payload: { componentName, analysis },
			});

			// Auto-generate cross-references
			generateCrossReferences(
				componentName,
				analysis,
				state.analysisResults
			);
		},

		setLoading: (componentName, isLoading) => {
			dispatch({
				type: ActionTypes.SET_LOADING,
				payload: { componentName, isLoading },
			});
		},

		setError: (componentName, error) => {
			dispatch({
				type: ActionTypes.SET_ERROR,
				payload: { componentName, error },
			});
		},

		clearError: (componentName) => {
			dispatch({
				type: ActionTypes.CLEAR_ERROR,
				payload: { componentName },
			});
		},

		addInsight: (source, insight) => {
			dispatch({
				type: ActionTypes.ADD_INSIGHT,
				payload: { source, insight },
			});
		},

		updatePreferences: (preferences) => {
			dispatch({
				type: ActionTypes.UPDATE_PREFERENCES,
				payload: preferences,
			});
		},

		setComponentState: (componentName, componentState) => {
			dispatch({
				type: ActionTypes.SET_COMPONENT_STATE,
				payload: { componentName, state: componentState },
			});
		},

		addCrossReference: (from, to, type, description) => {
			dispatch({
				type: ActionTypes.ADD_CROSS_REFERENCE,
				payload: { from, to, type, description },
			});
		},

		updateInteraction: (componentName, action, duration = 0, data = {}) => {
			dispatch({
				type: ActionTypes.UPDATE_INTERACTION,
				payload: {
					componentName,
					action,
					duration,
					data,
				},
			});
		},

		generateMetaAnalysis: () => {
			const metaAnalysis = generateMetaAnalysisFromResults(
				state.analysisResults,
				state.userInfo
			);
			dispatch({
				type: ActionTypes.SET_META_ANALYSIS,
				payload: metaAnalysis,
			});
		},
	};

	// Selectors
	const selectors = {
		getUserInfo: () => state.userInfo,

		getAnalysis: (componentName) => state.analysisResults[componentName],

		getAllAnalyses: () => state.analysisResults,

		isLoading: (componentName) =>
			state.loadingStates[componentName] || false,

		hasError: (componentName) => !!state.errors[componentName],

		getError: (componentName) => state.errors[componentName],

		getInsights: () => state.insights,

		getCrossReferences: (componentName) =>
			state.crossReferences[componentName] || [],

		getPreferences: () => state.preferences,

		getComponentState: (componentName) =>
			state.componentStates[componentName] || {},

		getMetaAnalysis: () => state.metaAnalysis,

		getRecentInteractions: (componentName) =>
			state.interactions
				.filter((i) => i.componentName === componentName)
				.slice(-10),

		isInitialized: () => state.status.initialized,

		getComponentOrder: () => {
			if (state.preferences.componentOrder) {
				return state.preferences.componentOrder;
			}

			// Generate order based on user interactions
			const interactionCounts = {};
			state.interactions.forEach((interaction) => {
				interactionCounts[interaction.componentName] =
					(interactionCounts[interaction.componentName] || 0) + 1;
			});

			return Object.entries(interactionCounts)
				.sort(([, a], [, b]) => b - a)
				.map(([componentName]) => componentName);
		},
	};

	return (
		<FengShuiReportContext.Provider
			value={{
				state,
				actions,
				selectors,
			}}
		>
			{children}
		</FengShuiReportContext.Provider>
	);
};

// Hook to use the context
export const useFengShuiReport = () => {
	const context = useContext(FengShuiReportContext);
	if (!context) {
		throw new Error(
			"useFengShuiReport must be used within FengShuiReportProvider"
		);
	}
	return context;
};

// Helper function to generate cross-references
const generateCrossReferences = (componentName, analysis, existingAnalyses) => {
	// This would implement logic to find connections between components
	// For example, if FiveElement shows "火旺" and Season suggests "秋季調節"

	const keywords = extractKeywords(
		analysis.content || analysis.description || ""
	);
	const references = [];

	Object.entries(existingAnalyses).forEach(
		([otherComponent, otherAnalysis]) => {
			if (otherComponent === componentName) return;

			const otherKeywords = extractKeywords(
				otherAnalysis.content || otherAnalysis.description || ""
			);
			const commonKeywords = keywords.filter((k) =>
				otherKeywords.includes(k)
			);

			if (commonKeywords.length > 0) {
				references.push({
					to: otherComponent,
					type: "keyword_match",
					description: `共同關鍵詞: ${commonKeywords.join(", ")}`,
				});
			}
		}
	);

	return references;
};

// Helper function to extract keywords
const extractKeywords = (text) => {
	const keywords = [];
	const patterns = [
		/火旺|木旺|金旺|水旺|土旺/g,
		/春季|夏季|秋季|冬季/g,
		/財運|事業|感情|健康|學業/g,
		/吉|凶|利|忌/g,
	];

	patterns.forEach((pattern) => {
		const matches = text.match(pattern);
		if (matches) keywords.push(...matches);
	});

	return [...new Set(keywords)];
};

// Helper function to generate meta-analysis
const generateMetaAnalysisFromResults = (analysisResults, userInfo) => {
	const analyses = Object.values(analysisResults);
	if (analyses.length === 0) return null;

	// Extract dominant themes
	const allText = analyses
		.map((a) => a.content || a.description || "")
		.join(" ");
	const dominantThemes = extractKeywords(allText);

	// Count theme frequencies
	const themeFrequency = {};
	dominantThemes.forEach((theme) => {
		themeFrequency[theme] = (themeFrequency[theme] || 0) + 1;
	});

	// Get top themes
	const topThemes = Object.entries(themeFrequency)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 5)
		.map(([theme, count]) => ({ theme, frequency: count }));

	// Generate summary
	const summary = `根據您的完整八字分析，發現以下主要特點：${topThemes.map((t) => t.theme).join("、")}。建議在${userInfo.concern}方面重點關注這些要素的平衡發展。`;

	return {
		dominantThemes: topThemes,
		summary,
		totalComponents: analyses.length,
		completionRate: analyses.length / 9, // Assuming 9 total components
		lastUpdated: Math.max(...analyses.map((a) => a.timestamp || 0)),
	};
};

export default {
	FengShuiReportProvider,
	useFengShuiReport,
	ActionTypes,
};
