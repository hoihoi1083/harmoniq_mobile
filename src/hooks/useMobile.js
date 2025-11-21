import { useState, useEffect } from "react";

export const useMobile = (breakpoint = 768) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth <= breakpoint);
		};

		// Check initial screen size
		checkScreenSize();

		// Add event listener for window resize
		window.addEventListener("resize", checkScreenSize);

		// Cleanup
		return () => window.removeEventListener("resize", checkScreenSize);
	}, [breakpoint]);

	return isMobile;
};
