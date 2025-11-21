import { useState, useEffect } from "react";

export const useResponsiveScale = () => {
	const [scaleRatio, setScaleRatio] = useState(1);
	const [isMobileLayout, setIsMobileLayout] = useState(false);

	useEffect(() => {
		const calculateScale = () => {
			// MacBook Air 13" typical resolution when you see the perfect layout
			const baseWidth = 1440; // Your MacBook Air 13" width
			const currentWidth = window.innerWidth;

			// Calculate scale ratio based only on width to maintain proportions
			let ratio = currentWidth / baseWidth;

			// Don't scale up beyond the base size - keep original size as maximum
			ratio = Math.min(ratio, 1);

			// Set minimum scale to prevent too small elements
			ratio = Math.max(ratio, 0.3);

			setScaleRatio(ratio);
			setIsMobileLayout(currentWidth < 768);
		};

		calculateScale();
		window.addEventListener("resize", calculateScale);
		return () => window.removeEventListener("resize", calculateScale);
	}, []);

	return { scaleRatio, isMobileLayout };
};
