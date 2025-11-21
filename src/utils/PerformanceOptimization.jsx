import React, { memo, lazy, Suspense, useMemo, useCallback } from "react";
import { debounce, throttle } from "lodash";

/**
 * Performance Optimization Utilities
 * Implements lazy loading, memoization, debouncing, and virtual scrolling
 */

// Lazy Loading Component Wrapper
export const LazyComponent = ({
	loader,
	fallback = <div>載入中...</div>,
	...props
}) => {
	const Component = lazy(loader);

	return (
		<Suspense fallback={fallback}>
			<Component {...props} />
		</Suspense>
	);
};

// Intelligent Memoization Hook
export const useIntelligentMemo = (factory, deps, options = {}) => {
	const {
		maxAge = 300000, // 5 minutes default
		compareFunction = null,
		debug = false,
	} = options;

	const memoizedValue = useMemo(
		() => {
			if (debug) {
				console.log("Recalculating memoized value for:", deps);
			}

			const result = factory();
			return {
				value: result,
				timestamp: Date.now(),
			};
		},
		compareFunction ? [JSON.stringify(deps)] : deps
	);

	// Check if cache is expired
	const isExpired = Date.now() - memoizedValue.timestamp > maxAge;

	return isExpired ? factory() : memoizedValue.value;
};

// Optimized Component Factory
export const createOptimizedComponent = (Component, optimizations = {}) => {
	const {
		memoize = true,
		lazyLoad = false,
		preload = false,
		errorBoundary = true,
	} = optimizations;

	let OptimizedComponent = Component;

	// Apply memoization
	if (memoize) {
		OptimizedComponent = memo(
			OptimizedComponent,
			(prevProps, nextProps) => {
				// Custom comparison logic for props
				const prevKeys = Object.keys(prevProps);
				const nextKeys = Object.keys(nextProps);

				if (prevKeys.length !== nextKeys.length) return false;

				return prevKeys.every((key) => {
					const prevValue = prevProps[key];
					const nextValue = nextProps[key];

					// Deep comparison for objects
					if (
						typeof prevValue === "object" &&
						typeof nextValue === "object"
					) {
						return (
							JSON.stringify(prevValue) ===
							JSON.stringify(nextValue)
						);
					}

					return prevValue === nextValue;
				});
			}
		);
	}

	// Apply lazy loading
	if (lazyLoad) {
		const LazyWrapper = lazy(() =>
			Promise.resolve({ default: OptimizedComponent })
		);
		OptimizedComponent = (props) => (
			<Suspense fallback={<ComponentSkeleton />}>
				<LazyWrapper {...props} />
			</Suspense>
		);
	}

	return OptimizedComponent;
};

// Component Skeleton for Loading States
const ComponentSkeleton = memo(() => (
	<div className="animate-pulse">
		<div className="bg-gray-200 h-6 w-3/4 mb-4 rounded"></div>
		<div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
		<div className="bg-gray-200 h-4 w-5/6 mb-2 rounded"></div>
		<div className="bg-gray-200 h-4 w-4/5 rounded"></div>
	</div>
));

// Debounced Input Hook
export const useDebouncedValue = (value, delay = 300) => {
	const [debouncedValue, setDebouncedValue] = React.useState(value);

	React.useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
};

// Throttled Callback Hook
export const useThrottledCallback = (callback, delay = 100) => {
	const throttledCallback = useMemo(
		() => throttle(callback, delay),
		[callback, delay]
	);

	return throttledCallback;
};

// Performance Monitor Hook
export const usePerformanceMonitor = (componentName) => {
	const [metrics, setMetrics] = React.useState({
		renderCount: 0,
		averageRenderTime: 0,
		lastRenderTime: 0,
	});

	const startTime = React.useRef(0);

	React.useEffect(() => {
		startTime.current = performance.now();
	});

	React.useEffect(() => {
		const endTime = performance.now();
		const renderTime = endTime - startTime.current;

		setMetrics((prev) => {
			const newRenderCount = prev.renderCount + 1;
			const newAverageRenderTime =
				(prev.averageRenderTime * prev.renderCount + renderTime) /
				newRenderCount;

			return {
				renderCount: newRenderCount,
				averageRenderTime: newAverageRenderTime,
				lastRenderTime: renderTime,
			};
		});

		// Log performance warnings
		if (renderTime > 100) {
			console.warn(
				`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
			);
		}
	});

	return metrics;
};

// Virtual Scrolling Hook for Large Lists
export const useVirtualScrolling = (
	items,
	itemHeight = 100,
	containerHeight = 500
) => {
	const [scrollTop, setScrollTop] = React.useState(0);

	const visibleStart = Math.floor(scrollTop / itemHeight);
	const visibleEnd = Math.min(
		visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
		items.length
	);

	const visibleItems = items.slice(visibleStart, visibleEnd);
	const offsetY = visibleStart * itemHeight;

	const onScroll = useCallback((e) => {
		setScrollTop(e.target.scrollTop);
	}, []);

	return {
		visibleItems,
		offsetY,
		onScroll,
		totalHeight: items.length * itemHeight,
	};
};

// Intersection Observer Hook for Lazy Loading
export const useIntersectionObserver = (options = {}) => {
	const [isIntersecting, setIsIntersecting] = React.useState(false);
	const [hasIntersected, setHasIntersected] = React.useState(false);
	const targetRef = React.useRef(null);

	React.useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);
				if (entry.isIntersecting) {
					setHasIntersected(true);
				}
			},
			{
				threshold: 0.1,
				rootMargin: "50px",
				...options,
			}
		);

		if (targetRef.current) {
			observer.observe(targetRef.current);
		}

		return () => {
			if (targetRef.current) {
				observer.unobserve(targetRef.current);
			}
		};
	}, [options]);

	return { targetRef, isIntersecting, hasIntersected };
};

// Resource Preloader
export const useResourcePreloader = (resources = []) => {
	const [loadedResources, setLoadedResources] = React.useState(new Set());
	const [isLoading, setIsLoading] = React.useState(false);

	const preloadResource = useCallback(
		async (resource) => {
			if (loadedResources.has(resource)) return;

			try {
				if (resource.endsWith(".js")) {
					// Use fetch for JavaScript resources to avoid dynamic import issues
					await fetch(resource);
				} else if (resource.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
					const img = new Image();
					img.src = resource;
					await new Promise((resolve, reject) => {
						img.onload = resolve;
						img.onerror = reject;
					});
				}

				setLoadedResources((prev) => new Set([...prev, resource]));
			} catch (error) {
				console.warn("Failed to preload resource:", resource, error);
			}
		},
		[loadedResources]
	);

	React.useEffect(() => {
		if (resources.length === 0) return;

		setIsLoading(true);

		Promise.all(resources.map(preloadResource)).finally(() =>
			setIsLoading(false)
		);
	}, [resources, preloadResource]);

	return { loadedResources, isLoading };
};

// Component Load Performance Tracker
export const ComponentLoadTracker = ({ children, componentName }) => {
	const startTime = React.useRef(performance.now());
	const [isLoaded, setIsLoaded] = React.useState(false);

	React.useEffect(() => {
		const loadTime = performance.now() - startTime.current;

		// Report to analytics
		if (window.gtag) {
			window.gtag("event", "component_load_time", {
				component_name: componentName,
				load_time: Math.round(loadTime),
				custom_parameter: loadTime > 1000 ? "slow" : "fast",
			});
		}

		setIsLoaded(true);
	}, [componentName]);

	return children;
};

// Batch Update Hook
export const useBatchedUpdates = () => {
	const [updates, setUpdates] = React.useState([]);
	const timeoutRef = React.useRef(null);

	const addUpdate = useCallback((updateFunction) => {
		setUpdates((prev) => [...prev, updateFunction]);

		// Clear existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Batch updates
		timeoutRef.current = setTimeout(() => {
			setUpdates((currentUpdates) => {
				currentUpdates.forEach((update) => update());
				return [];
			});
		}, 16); // Next frame
	}, []);

	return { addUpdate, pendingUpdates: updates.length };
};

// Memory Leak Prevention
export const useCleanup = (cleanupFunction) => {
	React.useEffect(() => {
		return cleanupFunction;
	}, []);
};

// Component Registry for Code Splitting
export const ComponentRegistry = {
	components: new Map(),

	register(name, loader, preload = false) {
		this.components.set(name, {
			loader,
			preload,
			component: null,
		});

		if (preload) {
			this.preloadComponent(name);
		}
	},

	async preloadComponent(name) {
		const entry = this.components.get(name);
		if (entry && !entry.component) {
			try {
				entry.component = await entry.loader();
			} catch (error) {
				console.warn(`Failed to preload component ${name}:`, error);
			}
		}
	},

	async getComponent(name) {
		const entry = this.components.get(name);
		if (!entry) {
			throw new Error(`Component ${name} not registered`);
		}

		if (entry.component) {
			return entry.component;
		}

		entry.component = await entry.loader();
		return entry.component;
	},
};

// Export performance monitoring utilities
export const PerformanceUtils = {
	measureRenderTime: (componentName, renderFunction) => {
		const startTime = performance.now();
		const result = renderFunction();
		const endTime = performance.now();

		console.log(
			`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`
		);
		return result;
	},

	detectMemoryLeaks: () => {
		if (performance.memory) {
			const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } =
				performance.memory;
			const usage = (usedJSHeapSize / jsHeapSizeLimit) * 100;

			if (usage > 80) {
				console.warn(
					"High memory usage detected:",
					`${usage.toFixed(2)}%`
				);
			}

			return { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit, usage };
		}

		return null;
	},

	optimizeImages: (images) => {
		return images.map((img) => ({
			...img,
			sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
			loading: "lazy",
			decoding: "async",
		}));
	},
};

export default {
	LazyComponent,
	useIntelligentMemo,
	createOptimizedComponent,
	useDebouncedValue,
	useThrottledCallback,
	usePerformanceMonitor,
	useVirtualScrolling,
	useIntersectionObserver,
	useResourcePreloader,
	ComponentLoadTracker,
	useBatchedUpdates,
	useCleanup,
	ComponentRegistry,
	PerformanceUtils,
};
