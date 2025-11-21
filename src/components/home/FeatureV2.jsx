"use client";
import { useState, useEffect } from "react";
import Comments from "./Comments";
import Features from "./Features";
import ImageCarousel from "./ImageCarousel";
import { useResponsiveScale } from "../../hooks/useResponsiveScale";

const FeatureV2 = () => {
	const { scaleRatio } = useResponsiveScale();
	const [isMobileView, setIsMobileView] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobileView(window.innerWidth < 1218);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	// MOBILE LAYOUT (screen < 1218px)
	if (isMobileView) {
		return (
			<div
				className="flex flex-col w-full bg-[#EFEFEF]  px-4 py-0"
				style={{
					fontFamily: "Noto Serif TC, serif",
					maxWidth: "100vw",
					overflow: "hidden",
				}}
			>
				{/* Features Section - Top */}
				<div className="flex-shrink-0 w-full mb-0">
					<Features />
				</div>

				{/* Comments Section - Middle */}
				<div className="flex-shrink-0 w-full mb-0">
					<Comments />
				</div>

				{/* ImageCarousel Section - Bottom */}
				{/* <div className="flex-shrink-0 w-full">
					<ImageCarousel />
				</div> */}
			</div>
		);
	}

	// DESKTOP LAYOUT
	return (
		<div
			style={{
				width: "100vw",
				overflow: "visible",
				position: "relative",
				zIndex: 30, // Lower than Desire but higher than Hero
			}}
		>
			<div
				className="bg-[#EFEFEF] overflow-visible 0"
				style={{
					fontFamily: "Noto Serif TC, serif",
					transform: `scale(${scaleRatio})`,
					transformOrigin: "top center",
					width: `${100 / scaleRatio}%`,
					marginLeft: "auto",
					marginRight: "auto",
					position: "relative",
				}}
			>
				{/* Top section: Features and Comments side by side */}
				<div
					className="relative flex w-full overflow-visible"
					style={{
						flexDirection: "row",
						minHeight: "1200px",
						paddingTop: "100px", // Add top padding for spacing
					}}
				>
					{/* Left side: Features component */}
					<div
						className="relative z-10 flex items-start justify-center overflow-visible"
						style={{
							flex: "1",
							width: "auto",
							paddingTop: "70px",
						}}
					>
						<Features />
					</div>

					{/* Right side: Comments component with overflow capability */}
					<div
						className="relative z-20 flex items-start justify-end overflow-visible"
						style={{
							flex: "1",
							width: "auto",
							paddingTop: "0",
						}}
					>
						<div
							className="relative"
							style={{
								marginLeft: "-200px",
								width: "100%",
							}}
						>
							<Comments />
						</div>
					</div>
				</div>

				{/* Bottom section: ImageCarousel */}
				{/* <div
					className="relative w-full overflow-visible"
					style={{
						marginTop: "-200px", // Adjust positioning
						paddingBottom: "80px",
					}}
				>
					<ImageCarousel />
				</div> */}
			</div>
		</div>
	);
};

export default FeatureV2;
