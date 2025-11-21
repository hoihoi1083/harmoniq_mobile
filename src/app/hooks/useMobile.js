"use client";
import { useState, useEffect } from "react";
export default function useMobile() {
	const [isMobile, setIsMobile] = useState(false);
	// 添加useEffect监听窗口大小
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.matchMedia("(max-width: 768px)").matches);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);

		return () => {
			window.removeEventListener("resize", checkMobile);
		};
	}, []);
	return isMobile;
}
