"use client";
import Theory from "@/components/free/theory";
import Tips from "@/components/home/Tips";
import { useState } from "react";
import { useResponsiveScale } from "../../hooks/useResponsiveScale";

const TheoryTips = () => {
	const [tipsHeight, setTipsHeight] = useState(0);
	const { scaleRatio, isMobileLayout } = useResponsiveScale();

	if (isMobileLayout) {
		// Mobile layout - stack vertically with mobile-optimized spacing
		return (
			<div
				className="relative w-full px-4 bg-center bg-no-repeat bg-cover py-18"
				style={{
					maxWidth: "100vw",
					backgroundImage: "url('/images/hero/Herobg2.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					zIndex: 40, // Higher than FeatureV2 (30)
					borderTopLeftRadius: "20px",
					borderTopRightRadius: "20px",
					overflow: "hidden",
					marginTop: "-20px", // Overlap with FeatureV2
				}}
			>
				{/* Mobile Theory component */}
				<div className="mb-8">
					<Theory bgColor="bg-transparent" />
				</div>

				{/* Mobile Tips component */}
				<div>
					<Tips onHeightChange={setTipsHeight} />
				</div>
			</div>
		);
	}

	// Desktop layout with responsive scaling
	return (
		<div
			style={{
				width: "100vw",
				overflow: "visible",
				position: "relative",
				zIndex: 40, // Higher than FeatureV2 (30)
				marginTop: "-80px", // Overlap with FeatureV2
			}}
		>
			<div
				className="relative bg-center bg-no-repeat bg-cover"
				style={{
					width: `${100 / scaleRatio}%`,
					height: `${Math.max(2552, 1600 + tipsHeight)}px`,
					backgroundImage: "url('/images/hero/Herobg2.png')",
					borderRadius: "40px",
					overflow: "visible",
					backgroundSize: "cover",
					backgroundPosition: "center top",
					transition: "height 0.6s ease-in-out",
					transform: `scale(${scaleRatio})`,
					transformOrigin: "top center",
					marginLeft: "auto",
					marginRight: "auto",
					position: "relative",
				}}
			>
				{/* Theory component - positioned absolutely and stuck to the right side */}
				<div
					style={{
						position: "absolute",
						top: "50px", // Original MacBook Air 13" position
						right: "-100px", // Stick to the right side
						zIndex: 2,
					}}
				>
					<Theory bgColor="bg-transparent" />
				</div>
			</div>

			{/* Tips component - positioned to start after Theory and allow expansion */}
			<div
				className="flex items-center justify-center w-full"
				style={{
					position: "absolute",
					top: "1100px", // Original MacBook Air 13" position
					left: "0",
					right: "0",
					zIndex: 1,
				}}
			>
				<Tips onHeightChange={setTipsHeight} />
			</div>
		</div>
	);
};

export default TheoryTips;
