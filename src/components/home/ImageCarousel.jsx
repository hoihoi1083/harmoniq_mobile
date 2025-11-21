"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useResponsiveScale } from "../../hooks/useResponsiveScale";

const ImageCarousel = () => {
	const t = useTranslations("home.carousel");
	const containerRef = useRef(null);
	const [divider, setDivider] = useState(0.5);
	const [dragging, setDragging] = useState(false);
	const { scaleRatio, isMobileLayout } = useResponsiveScale();

	// Images for before/after effect
	const beforeImage = "/images/hero/before.png";
	const afterImage = "/images/hero/after.png";

	// Handle dragging the divider
	const handleDrag = (e) => {
		if (!dragging) return;
		const rect = containerRef.current.getBoundingClientRect();
		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		let x = clientX - rect.left;
		let percent = x / rect.width;
		if (percent < 0) percent = 0;
		if (percent > 1) percent = 1;
		setDivider(percent);
	};

	const stopDrag = () => setDragging(false);

	// Responsive dimensions (scaled from MacBook Air 13" baseline)
	const containerWidth = isMobileLayout ? 350 : 1063;
	const containerHeight = isMobileLayout ? 250 : 717;
	const wrapperWidth = isMobileLayout ? "100%" : 1650;
	const wrapperHeight = isMobileLayout ? 400 : 717;
	const buttonWidth = isMobileLayout ? 280 : 349;
	const buttonHeight = isMobileLayout ? 60 : 120;
	const buttonFontSize = isMobileLayout ? 16 : 28;

	// Mobile Layout
	if (isMobileLayout) {
		return (
			<div className="flex flex-col items-center w-full px-4 py-6">
				{/* Before/After Slider Container with Button - Centered */}
				<div className="relative">
					<div
						ref={containerRef}
						className="relative mb-8 overflow-hidden rounded-lg shadow-lg"
						style={{
							width: `${containerWidth}px`,
							height: `${containerHeight}px`,
							userSelect: "none",
							background: "#222",
						}}
						onMouseMove={handleDrag}
						onMouseUp={stopDrag}
						onMouseLeave={stopDrag}
						onTouchMove={handleDrag}
						onTouchEnd={stopDrag}
					>
						{/* After image (left side, always visible) */}
						<Image
							src={afterImage}
							alt="After"
							width={containerWidth}
							height={containerHeight}
							className="absolute top-0 left-0 object-cover w-full h-full"
							style={{ zIndex: 0 }}
							draggable={false}
						/>

						{/* Before image (right side, revealed by divider) */}
						<Image
							src={beforeImage}
							alt="Before"
							width={containerWidth}
							height={containerHeight}
							className="absolute top-0 left-0 object-cover w-full h-full"
							style={{
								zIndex: 1,
								clipPath: `inset(0 0 0 ${divider * 100}%)`,
								transition: dragging
									? "none"
									: "clip-path 0.4s cubic-bezier(.4,2,.6,1)",
							}}
							draggable={false}
						/>

						{/* Divider line and handle */}
						<div
							style={{
								position: "absolute",
								left: `calc(${divider * 100}% - 15px)`,
								top: 0,
								height: "100%",
								width: 30,
								zIndex: 2,
								cursor: "ew-resize",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								background: "none",
							}}
							onMouseDown={() => setDragging(true)}
							onTouchStart={() => setDragging(true)}
							tabIndex={0}
							aria-label={t("dragLabel")}
						>
							{/* Vertical divider line */}
							<div
								style={{
									width: 2,
									height: "100%",
									background:
										"linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,1), rgba(255,255,255,0.8))",
									borderRadius: 2,
									boxShadow: "0 0 10px 2px rgba(0,0,0,0.3)",
								}}
							/>

							{/* Enhanced drag handle */}
							<div
								style={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									background: "#D2E609",
									borderRadius: "50%",
									width: 35,
									height: 35,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									boxShadow:
										"0 4px 15px rgba(0,0,0,0.25), inset 0 1px 3px rgba(255,255,255,0.3)",
									border: "2px solid #374A37",
									cursor: "ew-resize",
									transition: "all 0.2s ease",
								}}
							>
								{/* Left arrow */}
								<div
									style={{
										position: "absolute",
										left: "30%",
										width: 0,
										height: 0,
										borderTop: "3px solid transparent",
										borderBottom: "3px solid transparent",
										borderRight: "4px solid black",
									}}
								/>

								{/* Right arrow */}
								<div
									style={{
										position: "absolute",
										right: "30%",
										width: 0,
										height: 0,
										borderTop: "3px solid transparent",
										borderBottom: "3px solid transparent",
										borderLeft: "4px solid black",
									}}
								/>
							</div>
						</div>

						{/* Labels for before/after */}
						<div
							className="absolute z-10 px-3 py-1 text-white bg-black bg-opacity-50 rounded top-4 left-4"
							style={{ fontSize: "12px" }}
						>
							{t("afterLabel")}
						</div>
						<div
							className="absolute z-10 px-3 py-1 text-white bg-black bg-opacity-50 rounded top-4 right-4"
							style={{ fontSize: "12px" }}
						>
							{t("beforeLabel")}
						</div>
					</div>

					{/* Button at left bottom corner of slider */}
					<Link href="/price">
						<button
							className="absolute z-20 flex items-center justify-center transition-all duration-300 hover:opacity-90"
							style={{
								width: "150px",
								height: "40px",
								backgroundColor: "#A3B116",
								borderRadius: "1000px",
								border: "none",
								cursor: "pointer",
								left: "-30px",
								bottom: "-10px",
								transform: "translateY(-32px)", // Adjust to position relative to slider
							}}
						>
							<span
								style={{
									fontFamily: "Noto Serif TC, serif",
									fontWeight: 800,
									fontStyle: "normal",
									fontSize: "12px",
									color: "white",
									textAlign: "center",
								}}
							>
								{t("buttonText")}
							</span>
						</button>
					</Link>
				</div>
			</div>
		);
	}

	// Desktop Layout (unchanged)
	return (
		<div
			className="relative z-50 flex flex-col items-start w-full overflow-visible"
			style={{
				marginLeft: "20px",
				paddingBottom: "360px",
				marginTop: "-300px",
			}}
		>
			{/* Wrapper that allows buttons and text to extend outside */}
			<div
				className="relative z-50 overflow-visible"
				style={{
					width: `${wrapperWidth}px`,
					height: `${wrapperHeight}px`,
				}}
			>
				{/* Custom button positioned outside the carousel */}
				<div
					className="absolute z-60"
					style={{
						left: "17px",
						top: "calc(50% + 350px)",
					}}
				>
					<Link href="/price">
						<button
							className="flex items-center justify-center transition-all duration-300 hover:opacity-90"
							style={{
								width: `${buttonWidth}px`,
								height: `${buttonHeight}px`,
								backgroundColor: "#A3B116",
								borderRadius: "1000px",
								border: "none",
								cursor: "pointer",
							}}
						>
							<span
								style={{
									fontFamily: "Noto Serif TC, serif",
									fontWeight: 800,
									fontStyle: "normal",
									fontSize: `${buttonFontSize}px`,
									color: "white",
									textAlign: "center",
								}}
							>
								{t("buttonText")}
							</span>
						</button>
					</Link>
				</div>

				{/* Before/After Slider Container */}
				<div
					ref={containerRef}
					className="absolute z-50 overflow-hidden rounded-lg shadow-lg"
					style={{
						left: "134px",
						top: "80px",
						width: `${containerWidth}px`,
						height: `${containerHeight}px`,
						userSelect: "none",
						background: "#222",
					}}
					onMouseMove={handleDrag}
					onMouseUp={stopDrag}
					onMouseLeave={stopDrag}
					onTouchMove={handleDrag}
					onTouchEnd={stopDrag}
				>
					{/* After image (left side, always visible) */}
					<Image
						src={afterImage}
						alt="After"
						width={containerWidth}
						height={containerHeight}
						className="absolute top-0 left-0 object-cover w-full h-full"
						style={{ zIndex: 0 }}
						draggable={false}
					/>

					{/* Before image (right side, revealed by divider) */}
					<Image
						src={beforeImage}
						alt="Before"
						width={containerWidth}
						height={containerHeight}
						className="absolute top-0 left-0 object-cover w-full h-full"
						style={{
							zIndex: 1,
							clipPath: `inset(0 0 0 ${divider * 100}%)`,
							transition: dragging
								? "none"
								: "clip-path 0.4s cubic-bezier(.4,2,.6,1)",
						}}
						draggable={false}
					/>

					{/* Divider line and handle */}
					<div
						style={{
							position: "absolute",
							left: `calc(${divider * 100}% - 20px)`,
							top: 0,
							height: "100%",
							width: 40,
							zIndex: 2,
							cursor: "ew-resize",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							background: "none",
						}}
						onMouseDown={() => setDragging(true)}
						onTouchStart={() => setDragging(true)}
						tabIndex={0}
						aria-label={t("dragLabel")}
					>
						{/* Vertical divider line */}
						<div
							style={{
								width: 3,
								height: "100%",
								background:
									"linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,1), rgba(255,255,255,0.8))",
								borderRadius: 2,
								boxShadow: "0 0 10px 2px rgba(0,0,0,0.3)",
							}}
						/>

						{/* Enhanced drag handle */}
						<div
							style={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								background: "#D2E609",
								borderRadius: "50%",
								width: 50,
								height: 50,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								boxShadow:
									"0 4px 15px rgba(0,0,0,0.25), inset 0 1px 3px rgba(255,255,255,0.3)",
								border: "3px solid #374A37",
								cursor: "ew-resize",
								transition: "all 0.2s ease",
							}}
							onMouseEnter={(e) => {
								e.target.style.transform =
									"translate(-50%, -50%) scale(1.1)";
								e.target.style.boxShadow =
									"0 6px 20px rgba(0,0,0,0.35), inset 0 1px 3px rgba(255,255,255,0.3)";
							}}
							onMouseLeave={(e) => {
								e.target.style.transform =
									"translate(-50%, -50%) scale(1)";
								e.target.style.boxShadow =
									"0 4px 15px rgba(0,0,0,0.25), inset 0 1px 3px rgba(255,255,255,0.3)";
							}}
						>
							{/* Left arrow */}
							<div
								style={{
									position: "absolute",
									left: "30%",
									width: 0,
									height: 0,
									borderTop: "4px solid transparent",
									borderBottom: "4px solid transparent",
									borderRight: "6px solid black",
								}}
							/>

							{/* Right arrow */}
							<div
								style={{
									position: "absolute",
									right: "30%",
									width: 0,
									height: 0,
									borderTop: "4px solid transparent",
									borderBottom: "4px solid transparent",
									borderLeft: "6px solid black",
								}}
							/>
						</div>
					</div>

					{/* Labels for before/after */}
					<div
						className="absolute z-10 px-3 py-1 text-white bg-black bg-opacity-50 rounded top-4 left-4"
						style={{ fontSize: "14px" }}
					>
						{t("afterLabel")}
					</div>
					<div
						className="absolute z-10 px-3 py-1 text-white bg-black bg-opacity-50 rounded top-4 right-4"
						style={{ fontSize: "14px" }}
					>
						{t("beforeLabel")}
					</div>
				</div>

				{/* Text overlay - Desktop only */}
				<div
					className="absolute flex flex-col items-end justify-end z-60"
					style={{
						left: "700px",
						top: "90%",
						transform: "translateY(-50%)",
						width: "700px",
					}}
				>
					{/* Main title */}
					<h1
						style={{
							fontFamily: "Noto Serif TC, serif",
							fontWeight: 900,
							fontSize: "54px",
							color: "#A3B116",
							marginBottom: "20px",
							textAlign: "left",
							whiteSpace: "nowrap",
						}}
					>
						{t("title")}
					</h1>

					{/* Underline */}
					<div
						style={{
							width: "700px",
							height: "0px",
							borderTop: "1px solid green",
							marginBottom: "40px",
						}}
					/>

					{/* First subtitle */}
					<p
						style={{
							fontFamily: "Noto Sans HK, sans-serif",
							fontWeight: 400,
							fontSize: "22px",
							color: "#A3B116",
							marginBottom: "20px",
							textAlign: "left",
							maxWidth: "600px",
							lineHeight: "0.5",
						}}
					>
						{t("subtitle1")}
					</p>

					{/* Second subtitle */}
					<p
						style={{
							fontFamily: "Noto Sans HK, sans-serif",
							fontWeight: 400,
							fontSize: "22px",
							color: "#A3B116",
							marginBottom: "0",
							textAlign: "left",
							maxWidth: "400px",
							lineHeight: "1.4",
						}}
					>
						{t("subtitle2")}
					</p>
				</div>
			</div>
		</div>
	);
};

export default ImageCarousel;
