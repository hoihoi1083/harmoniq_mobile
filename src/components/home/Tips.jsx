"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useResponsiveScale } from "../../hooks/useResponsiveScale";

export default function Tips({ onHeightChange }) {
	const t = useTranslations("home.tips");
	const [activeTip, setActiveTip] = useState(null);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const tipsRef = useRef(null);
	const { scaleRatio, isMobileLayout } = useResponsiveScale();

	// Listen for screen size changes
	useEffect(() => {
		const checkScreenSize = () => {
			setIsSmallScreen(window.innerWidth < 1089);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	const handleTipClick = (index) => {
		if (activeTip === index) {
			// Close the tip
			setActiveTip(null);
		} else {
			// Open the tip
			setActiveTip(index);
		}
	};

	const closeTip = () => {
		setActiveTip(null);
	};

	// Report height changes to parent
	useEffect(() => {
		if (tipsRef.current && onHeightChange) {
			const observer = new ResizeObserver((entries) => {
				for (const entry of entries) {
					onHeightChange(entry.contentRect.height);
				}
			});
			observer.observe(tipsRef.current);
			return () => observer.disconnect();
		}
	}, [onHeightChange]);

	if (isMobileLayout) {
		// Mobile layout
		return (
			<section
				ref={tipsRef}
				className="flex flex-col items-center justify-center w-full px-4 py-8"
				style={{ background: "transparent", position: "relative" }}
			>
				{/* Mobile Title */}
				<div className="w-full mb-8">
					<h1
						style={{
							fontFamily: "Noto Serif TC, serif",
							fontWeight: 900,
							fontStyle: "normal",
							fontSize: "36px",
							color: "#E8E2DA",
							lineHeight: "1.1",
							textAlign: "center",
						}}
					>
						{t("title")}
					</h1>
					<p
						style={{
							fontFamily: "Noto Sans HK, sans-serif",
							fontWeight: 400,
							fontStyle: "normal",
							fontSize: "16px",
							color: "#E8E2DA",
							lineHeight: "1.6",
							textAlign: "center",
							marginTop: "16px",
						}}
					>
						{t("description.line1")} {t("description.line2")}
					</p>
				</div>

				{/* Mobile Tips List */}
				<div className="w-full">
					{Array.from({ length: 4 }, (_, index) => (
						<div key={index} className="w-full mb-2">
							<div
								className="flex flex-row items-center justify-between px-4 py-4 transition-all duration-200 cursor-pointer hover:bg-white hover:bg-opacity-5"
								style={{
									borderTop: "1px solid #FFFFFF",
									borderBottom: "1px solid #FFFFFF",
									background: "transparent",
								}}
								onClick={() => handleTipClick(index)}
							>
								<div
									style={{
										fontFamily: "Noto Sans HK, sans-serif",
										fontWeight: 300,
										fontSize: "18px",
										color: "#FFFFFF",
									}}
								>
									{t(`tip${index + 1}`) || `Tip ${index + 1}`}
								</div>

								<div
									style={{
										width: "40px",
										height: "40px",
										borderRadius: "100px",
										background: "rgba(255,255,255,0.3)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										transition: "all 0.3s ease",
										transform:
											activeTip === index
												? "rotate(180deg)"
												: "rotate(0deg)",
									}}
								>
									<div
										style={{
											width: 0,
											height: 0,
											borderLeft: "8px solid transparent",
											borderRight:
												"8px solid transparent",
											borderTop: "12px solid #FFFFFF",
											transition: "all 0.3s ease",
										}}
									/>
								</div>
							</div>

							{/* Mobile Expandable Content */}
							<div
								className="w-full overflow-hidden"
								style={{
									maxHeight:
										activeTip === index ? "400px" : "0px",
									transition: "max-height 0.7s ease-in-out",
									background: "transparent",
								}}
							>
								<div
									className="flex justify-center w-full"
									style={{
										transform:
											activeTip === index
												? "translateY(0px)"
												: "translateY(-30px)",
										opacity: activeTip === index ? 1 : 0,
										transition: "all 0.7s ease-out",
										background: "transparent",
										padding: "16px",
									}}
								>
									{activeTip === index && (
										<div className="relative w-full">
											<Image
												src={`/images/tips/${activeTip + 1}.png`}
												alt={
													t(`tip${activeTip + 1}`) ||
													`Tip ${activeTip + 1}`
												}
												width={300}
												height={200}
												className="w-full rounded-lg shadow-xl"
												style={{
													objectFit: "contain",
													background: "transparent",
													display: "block",
												}}
												priority
											/>

											<button
												onClick={(e) => {
													e.stopPropagation();
													closeTip();
												}}
												className="absolute p-2 transition-all duration-200 rounded-full shadow-lg top-2 right-2 bg-black/70 hover:bg-black/90"
											>
												<svg
													className="w-4 h-4 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		);
	}

	// Desktop layout - original with scaling applied by parent
	return (
		<section
			ref={tipsRef}
			className="flex flex-col items-center justify-center w-[70%] px-8 py-12"
			style={{
				background: "transparent",
				position: "relative",
			}}
		>
			{/* Top Section: Title and Description */}
			<div
				className="flex w-full max-w-[1400px] mb-16"
				style={{
					flexDirection: isSmallScreen ? "column" : "row",
				}}
			>
				{/* Left: Title */}
				<div
					className="flex items-center flex-1"
					style={{
						marginBottom: isSmallScreen ? "20px" : "0",
					}}
				>
					<h1
						style={{
							fontFamily: "Noto Serif TC, serif",
							fontWeight: 900,
							fontStyle: "normal",
							fontSize: "76px", // Original size
							color: "#E8E2DA",
							lineHeight: "1.1",
							textAlign: isSmallScreen ? "center" : "left",
						}}
					>
						{t("title")}
					</h1>
				</div>
				{/* Right: Description */}
				<div className="flex items-center justify-start flex-1">
					<p
						style={{
							fontFamily: "Noto Sans HK, sans-serif",
							fontWeight: 400,
							fontStyle: "normal",
							fontSize: "20px", // Original size
							color: "#E8E2DA",
							lineHeight: "1.6",
							maxWidth: "600px",
							textAlign: isSmallScreen ? "center" : "right",
						}}
					>
						<span style={{ display: "block" }}>
							{t("description.line1")}
						</span>
						<span style={{ display: "block" }}>
							{t("description.line2")}
						</span>
					</p>
				</div>
			</div>

			{/* Tips List */}
			<div className="flex justify-start w-full">
				<div
					className="flex flex-col w-full "
					style={{ marginLeft: "0px" }}
				>
					{Array.from({ length: 4 }, (_, index) => (
						<div key={index} className="w-full">
							{/* Clickable Tip Row */}
							<div
								className="flex flex-row items-center justify-between px-8 py-6 transition-all duration-200 cursor-pointer hover:bg-white hover:bg-opacity-5"
								style={{
									borderTop: "2px solid #FFFFFF",
									borderBottom: "2px solid #FFFFFF",
									background: "transparent",
								}}
								onClick={() => handleTipClick(index)}
							>
								{/* Tip Text */}
								<div
									style={{
										fontFamily: "Noto Sans HK, sans-serif",
										fontWeight: 300,
										fontSize: "25px", // Original size
										color: "#FFFFFF",
									}}
								>
									{t(`tip${index + 1}`) || `Tip ${index + 1}`}
								</div>

								{/* Circle Button */}
								<div
									style={{
										width: "75px", // Original size
										height: "75px",
										borderRadius: "100px",
										background: "rgba(255,255,255,0.3)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										position: "relative",
										border: "none",
										transition: "all 0.3s ease",
										transform:
											activeTip === index
												? "rotate(180deg)"
												: "rotate(0deg)",
									}}
								>
									<div
										style={{
											width: 0,
											height: 0,
											borderLeft:
												"12px solid transparent",
											borderRight:
												"12px solid transparent",
											borderTop: "18px solid #FFFFFF",
											transition: "all 0.3s ease",
										}}
									/>
								</div>
							</div>

							{/* Expandable Image Content */}
							<div
								className="w-full overflow-hidden"
								style={{
									maxHeight:
										activeTip === index ? "800px" : "0px",
									transition: "max-height 0.7s ease-in-out",
									background: "transparent",
								}}
							>
								<div
									className="flex justify-center w-full"
									style={{
										transform:
											activeTip === index
												? "translateY(0px)"
												: "translateY(-30px)",
										opacity: activeTip === index ? 1 : 0,
										transition: "all 0.7s ease-out",
										background: "transparent",
										padding: "30px 32px",
									}}
								>
									{activeTip === index && (
										<div className="relative">
											<Image
												src={`/images/tips/${activeTip + 1}.png`}
												alt={
													t(`tip${activeTip + 1}`) ||
													`Tip ${activeTip + 1}`
												}
												width={600} // Original size
												height={400}
												className="rounded-lg shadow-xl"
												style={{
													width: "70%",
													height: "100%",
													objectFit: "contain",
													background: "transparent",
													display: "block",
												}}
												priority
											/>

											<button
												onClick={(e) => {
													e.stopPropagation();
													closeTip();
												}}
												className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 rounded-full p-2.5 transition-all duration-200 shadow-lg"
											>
												<svg
													className="w-5 h-5 text-white"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										</div>
									)}
								</div>
							</div>

							{/* Bottom border for expanded content */}
							{activeTip === index && (
								<div
									style={{
										width: "100%",
										height: "2px",
										background: "#FFFFFF",
										transition: "all 0.3s ease",
									}}
								/>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
