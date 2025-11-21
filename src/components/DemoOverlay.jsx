"use client";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useTranslations } from "next-intl";
import {
	X,
	ArrowRight,
	ArrowLeft,
	RotateCcw,
	Trash2,
	MousePointer2,
	Hand,
	Lightbulb,
	ChevronUp,
	ChevronDown,
	Minimize2,
	Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DEMO_STEPS = {
	INTRO: 0,
	DRAG_ROOM: 1,
	DRAG_FURNITURE: 2,
	SELECT_ITEM: 3,
	ROTATE_ITEM: 4,
	DELETE_ITEM: 5,
	MULTI_SELECT: 6,
	COMPASS_DIRECTION: 7,
	CLEAR_CANVAS: 8,
	CHOOSE_MODEL: 9,
	COMPLETE: 10,
};

// Add this mapping at the top of your component (outside getHighlightStyle)
const HIGHLIGHT_SELECTORS = {
	"sidebar-rooms": ".sidebar-rooms", // update to your actual class or id
	"sidebar-furniture": ".sidebar-furniture",
	"canvas-items": ".canvas-items",
	"canvas-controls": ".canvas-controls",
	"compass-btn": ".compass-btn", // update to your actual class or id
	"clear-button": ".clear-canvas-btn",
	"generate-button": ".generate-btn",
};

export default function DemoOverlay({
	isActive,
	onClose,
	canvasRef,
	isMobile = false,
	onStep = () => {},
	demoActions = new Set(),
	onShowTabControl = () => {}, // ADD THIS PROP
}) {
	const t = useTranslations("demo");
	const [currentStep, setCurrentStep] = useState(DEMO_STEPS.INTRO);
	const [highlightedArea, setHighlightedArea] = useState(null);
	const [isWaitingForAction, setIsWaitingForAction] = useState(false);
	const [completedActions, setCompletedActions] = useState(new Set());
	const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);
	const [highlightRect, setHighlightRect] = useState(null);
	const [isMinimized, setIsMinimized] = useState(false); // for both mobile and desktop
	const [panelPosition, setPanelPosition] = useState("bottom"); // NEW: top or bottom
	const [isCollapsed, setIsCollapsed] = useState(false); // NEW: for desktop collapse
	const overlayRef = useRef(null);

	// Auto-scroll to highlighted element (mobile optimization)
	const scrollToHighlight = () => {
		if (highlightRect && isMobile) {
			const elementCenter = highlightRect.top + highlightRect.height / 2;
			const viewportHeight = window.innerHeight;
			const panelHeight = isMinimized ? 60 : 280; // Estimated panel heights
			const availableHeight = viewportHeight - panelHeight;

			// Scroll so the highlighted element is in the center of available space
			const targetScrollY = elementCenter - availableHeight / 2;

			window.scrollTo({
				top: Math.max(0, targetScrollY),
				behavior: "smooth",
			});
		}
	};

	// Demo step configurations
	const stepConfig = {
		[DEMO_STEPS.INTRO]: {
			title: t("welcome.title"),
			description: t("welcome.description"),
			highlight: null,
			action: "next",
			icon: <Lightbulb className="w-6 h-6 text-blue-500" />,
		},
		[DEMO_STEPS.DRAG_ROOM]: {
			title: t("dragRoom.title"),
			description: t("dragRoom.description"),
			highlight: "sidebar-rooms",
			action: "wait",
			targetArea: "canvas",
			icon: <Hand className="w-6 h-6 text-green-500" />,
		},
		[DEMO_STEPS.DRAG_FURNITURE]: {
			title: t("dragFurniture.title"),
			description: t("dragFurniture.description"),
			highlight: "sidebar-furniture",
			action: "wait",
			targetArea: "canvas",
			icon: <Hand className="w-6 h-6 text-purple-500" />,
		},
		[DEMO_STEPS.SELECT_ITEM]: {
			title: t("selectItem.title"),
			description: t("selectItem.description"),
			highlight: "canvas-items",
			action: "wait",
			targetArea: "canvas-item",
			icon: <MousePointer2 className="w-6 h-6 text-blue-500" />,
		},
		[DEMO_STEPS.ROTATE_ITEM]: {
			title: t("rotateItem.title"),
			description: t("rotateItem.description"),
			highlight: "canvas-controls",
			action: "wait",
			targetArea: "rotate-button",
			icon: <RotateCcw className="w-6 h-6 text-orange-500" />,
		},
		[DEMO_STEPS.DELETE_ITEM]: {
			title: t("deleteItem.title"),
			description: t("deleteItem.description"),
			highlight: "canvas-controls",
			action: "wait",
			targetArea: "delete-button",
			icon: <Trash2 className="w-6 h-6 text-red-500" />,
		},
		[DEMO_STEPS.MULTI_SELECT]: {
			title: t("multiSelect.title"),
			description: isMobile
				? t("multiSelect.mobileDescription")
				: t("multiSelect.desktopDescription"),
			highlight: "canvas-items",
			action: "wait",
			targetArea: "canvas-items",
			icon: <MousePointer2 className="w-6 h-6 text-indigo-500" />,
		},
		[DEMO_STEPS.COMPASS_DIRECTION]: {
			// NEW
			title: t("compassDirection.title"),
			description: t("compassDirection.description"),
			highlight: "compass-btn",
			action: "wait",
			targetArea: "compass",
			icon: <MousePointer2 className="w-6 h-6 text-cyan-500" />,
		},
		[DEMO_STEPS.CLEAR_CANVAS]: {
			// NEW
			title: t("clearCanvas.title"),
			description: t("clearCanvas.description"),
			highlight: "clear-button",
			action: "wait",
			targetArea: "clear-button",
			icon: <Trash2 className="w-6 h-6 text-red-500" />,
		},
		[DEMO_STEPS.CHOOSE_MODEL]: {
			// NEW
			title: t("chooseModel.title"),
			description: t("chooseModel.description"),
			highlight: "generate-button",
			action: "wait",
			targetArea: "generate-button",
			icon: <MousePointer2 className="w-6 h-6 text-green-500" />,
		},
		[DEMO_STEPS.COMPLETE]: {
			title: t("complete.title"),
			description: t("complete.description"),
			highlight: null,
			action: "finish",
			icon: <Lightbulb className="w-6 h-6 text-green-500" />,
		},
	};

	// Create a single overlay with CSS clip-path for better performance
	const getOverlayStyle = () => {
		if (!highlightRect) {
			return {
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: isMobile
					? "rgba(0, 0, 0, 0.85)"
					: "rgba(0, 0, 0, 0.75)",
				zIndex: 50,
				pointerEvents: "none",
			};
		}

		const padding = isMobile ? 10 : 8;
		const cutoutX = Math.max(0, highlightRect.left - padding);
		const cutoutY = Math.max(0, highlightRect.top - padding);
		const cutoutWidth = highlightRect.width + padding * 2;
		const cutoutHeight = highlightRect.height + padding * 2;
		const borderRadius = getBorderRadius();

		// Use CSS clip-path for better performance
		const clipPath = `polygon(
            0% 0%, 
            0% 100%, 
            ${cutoutX}px 100%, 
            ${cutoutX}px ${cutoutY}px, 
            ${cutoutX + cutoutWidth}px ${cutoutY}px, 
            ${cutoutX + cutoutWidth}px ${cutoutY + cutoutHeight}px, 
            ${cutoutX}px ${cutoutY + cutoutHeight}px, 
            ${cutoutX}px 100%, 
            100% 100%, 
            100% 0%
        )`;

		return {
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: isMobile
				? "rgba(0, 0, 0, 0.85)"
				: "rgba(0, 0, 0, 0.75)",
			clipPath: clipPath,
			WebkitClipPath: clipPath,
			zIndex: 50,
			pointerEvents: "none",
			transition:
				"clip-path 0.3s ease-out, -webkit-clip-path 0.3s ease-out",
		};
	};

	// Create overlay sections that exclude the highlighted area
	const getOverlaySections = () => {
		if (!highlightRect) {
			// No highlight, return single full overlay
			return [
				{
					style: {
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: isMobile
							? "rgba(0, 0, 0, 0.85)"
							: "rgba(0, 0, 0, 0.75)",
						zIndex: 50,
						pointerEvents: "none",
					},
				},
			];
		}

		const padding = isMobile ? 10 : 8;
		const cutoutX = Math.max(0, highlightRect.left - padding);
		const cutoutY = Math.max(0, highlightRect.top - padding);
		const cutoutWidth = highlightRect.width + padding * 2;
		const cutoutHeight = highlightRect.height + padding * 2;

		const overlayColor = isMobile
			? "rgba(0, 0, 0, 0.85)"
			: "rgba(0, 0, 0, 0.75)";

		return [
			// Top section
			{
				style: {
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					height: `${cutoutY}px`,
					backgroundColor: overlayColor,
					zIndex: 50,
					pointerEvents: "none",
				},
			},
			// Bottom section
			{
				style: {
					position: "fixed",
					top: `${cutoutY + cutoutHeight}px`,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: overlayColor,
					zIndex: 50,
					pointerEvents: "none",
				},
			},
			// Left section
			{
				style: {
					position: "fixed",
					top: `${cutoutY}px`,
					left: 0,
					width: `${cutoutX}px`,
					height: `${cutoutHeight}px`,
					backgroundColor: overlayColor,
					zIndex: 50,
					pointerEvents: "none",
				},
			},
			// Right section
			{
				style: {
					position: "fixed",
					top: `${cutoutY}px`,
					left: `${cutoutX + cutoutWidth}px`,
					right: 0,
					height: `${cutoutHeight}px`,
					backgroundColor: overlayColor,
					zIndex: 50,
					pointerEvents: "none",
				},
			},
		];
	};

	// Monitor canvas state for automatic step progression
	useEffect(() => {
		if (!isActive || !canvasRef?.current) return;

		const checkProgress = () => {
			const localItems = canvasRef.current.getLocalItems();
			const roomItems = localItems.filter((item) => item.type === "room");
			const furnitureItems = localItems.filter(
				(item) => item.type === "furniture"
			);
			const activeRoom = canvasRef.current.getActiveRoom();
			const selectedItems = canvasRef.current.getSelectedItems();

			// Auto-advance based on canvas state
			switch (currentStep) {
				case DEMO_STEPS.DRAG_ROOM:
					if (
						roomItems.length > 0 &&
						!completedActions.has("room-added")
					) {
						setCompletedActions(
							(prev) => new Set([...prev, "room-added"])
						);
						setTimeout(() => nextStep(), 1500);
					}
					break;

				case DEMO_STEPS.DRAG_FURNITURE:
					if (
						furnitureItems.length > 0 &&
						!completedActions.has("furniture-added")
					) {
						setCompletedActions(
							(prev) => new Set([...prev, "furniture-added"])
						);
						setTimeout(() => nextStep(), 1500);
					}
					break;

				case DEMO_STEPS.SELECT_ITEM:
					// Check if any item is selected (either activeRoom or selectedItems)
					if (
						(activeRoom || selectedItems.length > 0) &&
						!completedActions.has("item-selected")
					) {
						setCompletedActions(
							(prev) => new Set([...prev, "item-selected"])
						);
						setTimeout(() => nextStep(), 1500);
					}
					break;

				case DEMO_STEPS.ROTATE_ITEM:
					// Check if rotation action was performed
					if (
						demoActions.has("item-rotated") &&
						!completedActions.has("item-rotated")
					) {
						setCompletedActions(
							(prev) => new Set([...prev, "item-rotated"])
						);
						setTimeout(() => nextStep(), 1000);
					}
					break;

				case DEMO_STEPS.DELETE_ITEM:
					// Check if deletion action was performed
					if (
						demoActions.has("item-deleted") &&
						!completedActions.has("item-deleted")
					) {
						setCompletedActions(
							(prev) => new Set([...prev, "item-deleted"])
						);
						setTimeout(() => nextStep(), 1000);
					}
					break;

				case DEMO_STEPS.MULTI_SELECT:
					// Check if multiple items are selected
					if (
						selectedItems.length > 1 &&
						!completedActions.has("multi-selected")
					) {
						setCompletedActions(
							(prev) => new Set([...prev, "multi-selected"])
						);
						setTimeout(() => nextStep(), 1500);
					}
					break;

				case DEMO_STEPS.COMPASS_DIRECTION:
					// Check if compass was clicked
					if (
						demoActions.has("compass-clicked") &&
						!completedActions.has("compass-clicked")
					) {
						setCompletedActions(
							(prev) => new Set([...prev, "compass-clicked"])
						);
						setTimeout(() => nextStep(), 1500);
					}
					break;

				case DEMO_STEPS.CLEAR_CANVAS:
					// Check if canvas was cleared
					if (
						localItems.length === 0 &&
						completedActions.has("room-added") &&
						!completedActions.has("canvas-cleared")
					) {
						setCompletedActions(
							(prev) => new Set([...prev, "canvas-cleared"])
						);
						setTimeout(() => nextStep(), 1500);
					}
					break;

				case DEMO_STEPS.CHOOSE_MODEL:
					// Check if model selection was shown
					if (
						demoActions.has("model-shown") &&
						!completedActions.has("model-shown")
					) {
						setCompletedActions(
							(prev) => new Set([...prev, "model-shown"])
						);
						setTimeout(() => nextStep(), 2000);
					}
					break;
			}
		};

		const interval = setInterval(checkProgress, 500);
		return () => clearInterval(interval);
	}, [currentStep, isActive, completedActions, demoActions]);

	// Auto-advance timer for steps that don't require user action
	useEffect(() => {
		const config = stepConfig[currentStep];
		if (config?.action === "auto" && isActive) {
			const timer = setTimeout(() => {
				nextStep();
			}, 3000);
			setAutoAdvanceTimer(timer);
			return () => clearTimeout(timer);
		}
	}, [currentStep, isActive]);

	// Handle step progression
	const nextStep = () => {
		if (currentStep < DEMO_STEPS.COMPLETE) {
			const newStep = currentStep + 1;
			setCurrentStep(newStep);
			setIsWaitingForAction(false);
			onStep(newStep);

			// Control showTab based on tutorial step
			onShowTabControl(newStep);
		} else {
			onClose();
			// Close tab when tutorial is finished
			onShowTabControl(DEMO_STEPS.COMPLETE);
		}
	};

	const prevStep = () => {
		if (currentStep > DEMO_STEPS.INTRO) {
			const newStep = currentStep - 1;
			setCurrentStep(newStep);
			setIsWaitingForAction(false);
			onStep(newStep);

			// Control showTab based on tutorial step
			onShowTabControl(newStep);
		}
	};

	// When demo starts, ensure tab is controlled properly
	useEffect(() => {
		if (isActive) {
			onShowTabControl(currentStep);
		}
	}, [isActive, currentStep, onShowTabControl]);

	// Get highlight positioning based on device and area
	const getHighlightStyle = () => {
		if (highlightRect) {
			return {
				position: "absolute",
				top: `${highlightRect.top}px`,
				left: `${highlightRect.left}px`,
				width: `${highlightRect.width}px`,
				height: `${highlightRect.height}px`,
			};
		}
		return {};
	};

	// Different border radius for different highlight areas
	const getBorderRadius = () => {
		switch (highlightedArea) {
			case "sidebar-rooms":
			case "sidebar-furniture":
				return "12px";
			case "canvas-items":
				return "20px";
			case "canvas-controls":
				return "8px";
			default:
				return "16px";
		}
	};

	// Update highlighted area, waiting state, and panel position based on current step
	useEffect(() => {
		const config = stepConfig[currentStep];
		if (config) {
			setHighlightedArea(config.highlight);
			setIsWaitingForAction(config.action === "wait");

			// Auto-position tutorial window for mobile: top for steps 1-2, bottom for later steps
			if (isMobile) {
				if (
					currentStep === DEMO_STEPS.DRAG_ROOM ||
					currentStep === DEMO_STEPS.DRAG_FURNITURE
				) {
					setPanelPosition("top");
				} else {
					setPanelPosition("bottom");
				}
			}
		}
	}, [currentStep, isMobile]);

	// Update highlightRect when highlightedArea, isMobile, or window size changes
	useLayoutEffect(() => {
		if (!highlightedArea) {
			setHighlightRect(null);
			return;
		}

		// Use the selector for the current area
		const selector = HIGHLIGHT_SELECTORS[highlightedArea];
		if (!selector) {
			setHighlightRect(null);
			return;
		}

		// Add a small delay to ensure DOM is fully rendered
		const calculateRect = () => {
			const el = document.querySelector(selector);
			if (el) {
				// Force layout recalculation
				el.offsetHeight;

				const rect = el.getBoundingClientRect();
				const computedStyle = window.getComputedStyle(el);
				const borderRadius = computedStyle.borderRadius || "8px";

				setHighlightRect({
					top: rect.top + window.scrollY,
					left: rect.left + window.scrollX,
					width: rect.width,
					height: rect.height,
					borderRadius: borderRadius,
				});
			} else {
				// Retry after a short delay if element not found
				setTimeout(calculateRect, 200); // Increased delay
			}
		};

		// Use requestAnimationFrame to ensure DOM is ready
		requestAnimationFrame(() => {
			setTimeout(calculateRect, isMobile ? 300 : 100); // Longer delay for mobile
		});
	}, [highlightedArea, isMobile]);

	// Simplified and more robust step-specific recalculation
	useEffect(() => {
		// Only recalculate for critical steps that are having issues
		if (
			highlightedArea &&
			(currentStep === DEMO_STEPS.DRAG_ROOM ||
				currentStep === DEMO_STEPS.DRAG_FURNITURE)
		) {
			const selector = HIGHLIGHT_SELECTORS[highlightedArea];
			if (selector) {
				// Clear any existing timeout
				if (window.highlightTimeout) {
					clearTimeout(window.highlightTimeout);
				}

				// Set a longer delay for these problematic steps
				window.highlightTimeout = setTimeout(
					() => {
						const el = document.querySelector(selector);
						if (el) {
							// Double force layout for mobile
							if (isMobile) {
								el.offsetHeight;
								el.getBoundingClientRect();
							}
							el.offsetHeight; // Force layout
							const rect = el.getBoundingClientRect();
							setHighlightRect({
								top: rect.top + window.scrollY,
								left: rect.left + window.scrollX,
								width: rect.width,
								height: rect.height,
								borderRadius: getBorderRadius(),
							});
						}
					},
					isMobile ? 500 : 200
				); // Much longer delay for mobile
			}
		}

		return () => {
			if (window.highlightTimeout) {
				clearTimeout(window.highlightTimeout);
			}
		};
	}, [currentStep, highlightedArea, isMobile]);

	// More robust resize handler
	useEffect(() => {
		const handleResize = () => {
			if (highlightedArea) {
				// Clear existing timeouts
				if (window.resizeTimeout) {
					clearTimeout(window.resizeTimeout);
				}
				if (window.highlightTimeout) {
					clearTimeout(window.highlightTimeout);
				}

				// Debounce the resize calculation with longer delay
				window.resizeTimeout = setTimeout(
					() => {
						const selector = HIGHLIGHT_SELECTORS[highlightedArea];
						const el = document.querySelector(selector);
						if (el) {
							el.offsetHeight; // Force layout recalculation
							const rect = el.getBoundingClientRect();
							setHighlightRect({
								top: rect.top + window.scrollY,
								left: rect.left + window.scrollX,
								width: rect.width,
								height: rect.height,
								borderRadius: getBorderRadius(),
							});
						}
					},
					isMobile ? 300 : 150
				); // Longer delay for mobile
			}
		};

		window.addEventListener("resize", handleResize);
		window.addEventListener("orientationchange", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("orientationchange", handleResize);
			if (window.resizeTimeout) {
				clearTimeout(window.resizeTimeout);
			}
			if (window.highlightTimeout) {
				clearTimeout(window.highlightTimeout);
			}
		};
	}, [highlightedArea, isMobile]);

	// Remove the conflicting panel position effect
	// useEffect(() => {
	// 	// Force recalculation when panel position changes on mobile
	// 	if (isMobile && highlightedArea) {
	// 		setTimeout(() => {
	// 			const selector = HIGHLIGHT_SELECTORS[highlightedArea];
	// 			const el = document.querySelector(selector);
	// 			if (el) {
	// 				el.offsetHeight;
	// 				const rect = el.getBoundingClientRect();
	// 				setHighlightRect({
	// 					top: rect.top + window.scrollY,
	// 					left: rect.left + window.scrollX,
	// 					width: rect.width,
	// 					height: rect.height,
	// 					borderRadius: getBorderRadius(),
	// 				});
	// 			}
	// 		}, 200);
	// 	}
	// }, [panelPosition, isMobile, highlightedArea]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (autoAdvanceTimer) {
				clearTimeout(autoAdvanceTimer);
			}
		};
	}, [autoAdvanceTimer]);

	if (!isActive) return null;

	const config = stepConfig[currentStep];
	const totalSteps = Object.keys(DEMO_STEPS).length;

	// Improved desktop and mobile layout styles
	const panelStyles = isMobile
		? {
				// Mobile styles (unchanged)
				position: "fixed",
				left: 0,
				right: 0,
				[panelPosition]: 0,
				width: "100vw",
				maxHeight: isMinimized ? "60px" : "40vh",
				borderRadius:
					panelPosition === "bottom"
						? "16px 16px 0 0"
						: "0 0 16px 16px",
				zIndex: 60,
			}
		: {
				// Desktop styles - positioned at bottom-right corner
				position: "fixed",
				bottom: "20px",
				right: "20px",
				width: isCollapsed ? "60px" : "400px",
				maxWidth: "400px",
				height: isCollapsed ? "60px" : "auto",
				maxHeight: isCollapsed ? "60px" : "50vh",
				borderRadius: "16px",
				zIndex: 52,
				transition: "all 0.3s ease-in-out",
			};

	const overlaySections = getOverlaySections();

	return (
		<>
			{/* Single overlay with clip-path cutout - much more performant */}
			<div
				className="transition-all duration-300"
				style={getOverlayStyle()}
			/>

			{/* Highlighted area with optimized glow */}
			{highlightedArea && (
				<div
					className={`fixed pointer-events-none z-51 ${
						isMobile ? "animate-pulse" : ""
					}`}
					style={{
						...getHighlightStyle(),
						border: `${isMobile ? "4px" : "3px"} solid #60a5fa`,
						borderRadius: getBorderRadius(),
						boxShadow: `
                            0 0 0 4px rgba(96, 165, 250, 0.4),
                            0 0 20px rgba(96, 165, 250, 0.8),
                            0 0 40px rgba(96, 165, 250, 0.6)
                        `,
						background: "transparent",
						transform: "scale(1)",
						transition: "all 0.2s ease-out",
					}}
				/>
			)}

			{/* Pointer arrow with stronger visibility */}
			{isMobile && highlightedArea && highlightRect && (
				<div
					className="fixed pointer-events-none z-51"
					style={{
						left: highlightRect.left + highlightRect.width / 2,
						top:
							panelPosition === "bottom"
								? highlightRect.top + highlightRect.height + 15
								: highlightRect.top - 25,
						transform: "translateX(-50%)",
					}}
				>
					<div
						className={`w-0 h-0 border-l-[15px] border-r-[15px] border-l-transparent border-r-transparent ${
							panelPosition === "bottom"
								? "border-b-[15px] border-b-blue-400"
								: "border-t-[15px] border-t-blue-400"
						}`}
						style={{
							filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.8))",
						}}
					/>
				</div>
			)}

			{/* Instruction panel with improved desktop positioning */}
			<div
				className="bg-white border border-gray-200 shadow-2xl"
				style={{
					...panelStyles,
					borderRadius: isMobile ? panelStyles.borderRadius : "16px",
					fontFamily: '"Noto Serif TC", serif',
				}}
			>
				{/* Desktop collapsed state or Mobile minimized state */}
				{(!isMobile && isCollapsed) || (isMobile && isMinimized) ? (
					<div className="flex items-center justify-between h-full px-4">
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
								{currentStep + 1}
							</div>
							{!isMobile && !isCollapsed && (
								<span className="font-medium text-gray-800">
									{config.title}
								</span>
							)}
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() => {
									if (isMobile) {
										setIsMinimized(false);
									} else {
										setIsCollapsed(false);
									}
								}}
								className="p-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100"
								title={isMobile ? "展開" : "Expand tutorial"}
							>
								<Maximize2 className="w-4 h-4" />
							</button>
							<button
								onClick={onClose}
								className="p-2 text-red-600 transition-colors rounded-full hover:bg-red-50"
								title="關閉教學"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					</div>
				) : (
					<>
						{/* Header with mobile and desktop optimization */}
						<div
							className={`flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 ${
								isMobile ? "p-3" : "p-4"
							} rounded-t-2xl`}
						>
							<div className="flex items-center gap-3">
								<div
									className={`flex items-center justify-center text-sm font-bold text-white rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 ${
										isMobile ? "w-8 h-8" : "w-8 h-8"
									}`}
								>
									{currentStep + 1}
								</div>
								<div>
									<h2
										className={`font-bold text-gray-800 ${
											isMobile ? "text-lg" : "text-lg"
										}`}
									>
										{config.title}
									</h2>
									<p className="text-xs text-gray-500">
										{t("step")} {currentStep + 1} {t("of")}{" "}
										{totalSteps}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{config.icon}
								{/* Mobile: Position toggle and minimize buttons */}
								{isMobile && (
									<>
										<button
											onClick={() => setIsMinimized(true)}
											className="p-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100"
										>
											<ChevronDown className="w-4 h-4" />
										</button>
										<button
											onClick={() =>
												setPanelPosition(
													panelPosition === "bottom"
														? "top"
														: "bottom"
												)
											}
											className="p-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100"
											title="切換位置"
										>
											{panelPosition === "bottom" ? (
												<ChevronUp className="w-4 h-4" />
											) : (
												<ChevronDown className="w-4 h-4" />
											)}
										</button>
									</>
								)}
								{/* Desktop: Collapse button */}
								{!isMobile && (
									<button
										onClick={() => setIsCollapsed(true)}
										className="p-2 text-gray-600 transition-colors rounded-full hover:bg-gray-100"
										title="Minimize tutorial"
									>
										<Minimize2 className="w-4 h-4" />
									</button>
								)}
								<Button
									variant="ghost"
									size="sm"
									onClick={onClose}
									className="w-8 h-8 p-0 transition-colors hover:bg-red-50 hover:text-red-600"
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
						</div>

						{/* Content with mobile and desktop scrolling */}
						<div
							className={`overflow-auto ${
								isMobile ? "p-3 max-h-48" : "p-4 max-h-60"
							}`}
						>
							<p
								className={`leading-relaxed text-gray-700 ${
									isMobile ? "text-sm mb-3" : "text-sm mb-4"
								}`}
							>
								{config.description}
							</p>

							{/* Context-specific visual cues (condensed for both mobile and desktop) */}
							{currentStep === DEMO_STEPS.SELECT_ITEM && (
								<div
									className={`flex items-center gap-3 p-3 mb-3 border border-blue-200 rounded-lg bg-blue-50 ${
										isMobile ? "text-sm" : "text-sm"
									}`}
								>
									<MousePointer2 className="flex-shrink-0 w-5 h-5 text-blue-600" />
									<div>
										<p className="font-medium text-blue-800">
											{isMobile
												? t("tapToSelect")
												: t("clickToSelect")}
										</p>
									</div>
								</div>
							)}

							{currentStep === DEMO_STEPS.MULTI_SELECT && (
								<div
									className={`p-3 mb-3 border border-purple-200 rounded-lg bg-purple-50 ${
										isMobile ? "text-sm" : "text-sm"
									}`}
								>
									<div className="flex items-start gap-3">
										<MousePointer2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
										<div className="text-purple-800">
											{isMobile ? (
												<p className="font-medium">
													{t("longPressToSelect")}
												</p>
											) : (
												<p className="font-medium">
													{t("doubleClickToSelect")}
												</p>
											)}
										</div>
									</div>
								</div>
							)}

							{/* Compact progress indicator */}
							<div className={isMobile ? "mb-3" : "mb-4"}>
								<div className="flex items-center justify-between mb-2 text-xs text-gray-500">
									<span>{t("progress")}</span>
									<span>
										{Math.round(
											((currentStep + 1) / totalSteps) *
												100
										)}
										%
									</span>
								</div>
								<div className="flex items-center gap-1">
									{Array.from(
										{ length: totalSteps },
										(_, index) => (
											<div
												key={index}
												className={`h-2 flex-1 rounded-full transition-all duration-300 ${
													index <= currentStep
														? "bg-gradient-to-r from-blue-500 to-indigo-600"
														: "bg-gray-200"
												}`}
											/>
										)
									)}
								</div>
							</div>

							{/* Waiting indicator */}
							{isWaitingForAction && (
								<div
									className={`flex items-center justify-center gap-3 px-3 py-3 border border-yellow-200 rounded-lg bg-yellow-50 ${
										isMobile ? "text-sm" : "text-sm"
									}`}
								>
									<div className="w-4 h-4 border-2 border-yellow-500 rounded-full border-t-transparent animate-spin" />
									<span className="font-medium text-yellow-800">
										{t("waitingForAction")}
									</span>
								</div>
							)}
						</div>

						{/* Footer with mobile-friendly buttons */}
						<div
							className={`flex items-center justify-between border-t border-gray-100 bg-gray-50 rounded-b-2xl ${
								isMobile ? "p-3" : "p-4"
							}`}
						>
							<Button
								variant="outline"
								onClick={prevStep}
								disabled={currentStep === DEMO_STEPS.INTRO}
								className={`flex items-center gap-2 hover:bg-gray-100 transition-colors ${
									isMobile
										? "text-sm px-3 py-2"
										: "text-sm px-3 py-2"
								}`}
							>
								<ArrowLeft className="w-4 h-4" />
								{isMobile
									? t("previous").slice(0, 3)
									: t("previous")}
							</Button>

							{/* Mobile: Swipe gesture hint */}
							{isMobile && (
								<div className="text-xs text-gray-400">
									← 滑動切換 →
								</div>
							)}

							{/* Desktop: Current step indicator */}
							{!isMobile && (
								<div className="flex items-center gap-2 text-sm text-gray-500">
									<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
									{currentStep + 1} / {totalSteps}
								</div>
							)}

							<Button
								onClick={nextStep}
								disabled={false}
								className={`flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all ${
									isMobile
										? "text-sm px-3 py-2"
										: "text-sm px-3 py-2"
								}`}
							>
								{currentStep === DEMO_STEPS.COMPLETE ? (
									t("finish")
								) : (
									<>
										{config.action === "wait"
											? t("skip")
											: t("next")}
										<ArrowRight className="w-4 h-4" />
									</>
								)}
							</Button>
						</div>
					</>
				)}
			</div>

			{/* Enhanced CSS for stronger tutorial effects */}
			<style jsx>{`
				@keyframes strongTutorialGlow {
					0%,
					100% {
						box-shadow:
							0 0 0 8px rgba(96, 165, 250, 0.6),
							0 0 50px rgba(96, 165, 250, 1),
							0 0 80px rgba(96, 165, 250, 0.8),
							inset 0 0 20px rgba(255, 255, 255, 0.1);
						border-color: #60a5fa;
					}
					50% {
						box-shadow:
							0 0 0 12px rgba(96, 165, 250, 0.8),
							0 0 70px rgba(96, 165, 250, 1),
							0 0 120px rgba(96, 165, 250, 1),
							inset 0 0 30px rgba(255, 255, 255, 0.2);
						border-color: #3b82f6;
					}
				}

				@keyframes strongPulse {
					0%,
					100% {
						box-shadow:
							0 0 0 8px rgba(96, 165, 250, 0.6),
							0 0 40px rgba(96, 165, 250, 0.9),
							0 0 60px rgba(96, 165, 250, 0.7);
						border-color: #60a5fa;
						opacity: 1;
					}
					50% {
						box-shadow:
							0 0 0 12px rgba(96, 165, 250, 0.8),
							0 0 60px rgba(96, 165, 250, 1),
							0 0 100px rgba(96, 165, 250, 0.9);
						border-color: #3b82f6;
						opacity: 0.9;
					}
				}
			`}</style>
		</>
	);
}
