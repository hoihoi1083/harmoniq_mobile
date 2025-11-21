"use client";
import { useState, useEffect } from "react";

export default function useNavbarMobile() {
	const [isNavbarMobile, setIsNavbarMobile] = useState(false);

	useEffect(() => {
		const checkNavbarMobile = () => {
			setIsNavbarMobile(window.matchMedia("(max-width: 900px)").matches);
		};

		checkNavbarMobile();
		window.addEventListener("resize", checkNavbarMobile);

		return () => {
			window.removeEventListener("resize", checkNavbarMobile);
		};
	}, []);

	return isNavbarMobile;
}
