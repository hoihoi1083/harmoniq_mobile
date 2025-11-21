"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../Card";
import Card2 from "@/components/Card2";
import { useTranslations } from "next-intl";
import { useResponsiveScale } from "../../hooks/useResponsiveScale";

const Desire = ({ className = "" }) => {
	const t = useTranslations("home.Desire");
	const [showSecond, setShowSecond] = useState(false);
	const [scrollProgress, setScrollProgress] = useState(0);
	const [activeCardSet, setActiveCardSet] = useState(0);
	const sectionRef = useRef(null);
	const { scaleRatio, isMobileLayout } = useResponsiveScale();

	// Simplified scroll detection
	useEffect(() => {
		const handleScroll = () => {
			if (sectionRef.current) {
				const rect = sectionRef.current.getBoundingClientRect();
				const windowHeight = window.innerHeight;
				const elementTop = rect.top;
				const elementHeight = rect.height;

				// Calculate progress as how far we've scrolled through the section
				// When elementTop = 0, we're at the beginning (progress = 0)
				// When elementTop = -elementHeight, we've scrolled through completely (progress = 1)
				let progress = 0;

				if (elementTop <= 0) {
					// Section has started scrolling past the top
					progress = Math.abs(elementTop) / elementHeight;
				} else {
					// Section hasn't reached the top yet
					progress = 0;
				}

				// Clamp progress between 0 and 1
				progress = Math.max(0, Math.min(1, progress));
				setScrollProgress(progress);

				// Switch cards at 50% progress for both mobile and desktop
				if (isMobileLayout) {
					if (progress > 0.2 && activeCardSet === 0) {
						setActiveCardSet(1);
					} else if (progress <= 0.2 && activeCardSet === 1) {
						setActiveCardSet(0);
					}
				} else {
					if (progress > 0.2 && !showSecond) {
						setShowSecond(true);
					} else if (progress <= 0.2 && showSecond) {
						setShowSecond(false);
					}
				}
			}
		};

		// Use both scroll and touchmove for better mobile support
		const options = { passive: true };
		window.addEventListener("scroll", handleScroll, options);
		window.addEventListener("touchmove", handleScroll, options);
		window.addEventListener("resize", handleScroll, options);

		// Initial check
		handleScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("touchmove", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, [isMobileLayout, activeCardSet, showSecond]);

	// Calculate green rectangle position based on scroll progress
	const getRectanglePosition = () => {
		const startPos = -30;
		const endPos = 40;
		const currentPos =
			startPos + (endPos - startPos) * Math.min(1, scrollProgress * 1.5);
		return `${currentPos}%`;
	};

	// Calculate mobile green rectangle position
	const getMobileRectanglePosition = () => {
		const startPos = -40;
		const endPos = 40;
		const currentPos = startPos + (endPos - startPos) * scrollProgress;
		return `${currentPos}%`;
	};

	const cards = [
		{
			title: t("title1"),
			subtitle: t("subtitle1"),
			pict: "/images/hero/desire1@2x.png",
		},
		{
			title: t("title2"),
			subtitle: t("subtitle2"),
			pict: "/images/hero/desire1-1@2x.png",
		},
		{
			title: t("title3"),
			subtitle: t("subtitle3"),
			pict: "/images/hero/desire1-2@2x.png",
		},
		{
			title: t("title4"),
			subtitle: t("subtitle4"),
			pict: "/images/hero/desire1-3@2x.png",
		},
	];

	const cards2 = [
		{
			title: t("title5"),
			subtitle: t("subtitle5"),
			pict: "/images/hero/desire2@2x.png",
		},
		{
			title: t("title6"),
			subtitle: t("subtitle6"),
			pict: "/images/hero/desire2-1@2x.png",
		},
		{
			title: t("title7"),
			subtitle: t("subtitle7"),
			pict: "/images/hero/desire2-2@2x.png",
		},
		{
			title: t("title8"),
			subtitle: t("subtitle8"),
			pict: "/images/hero/desire2-3@2x.png",
		},
	];

	const flipVariants = {
		front: { rotateY: 0, zIndex: 2 },
		back: { rotateY: 180, zIndex: 1 },
	};

	// MOBILE LAYOUT
	if (isMobileLayout) {
		return (
			<div className="relative w-full bg-[#EFEFEF]">
				<div
					className="relative"
					style={{
						fontFamily: "Noto Serif TC, serif",
						borderTopLeftRadius: "50px",
						borderTopRightRadius: "50px",
						marginTop: "-80px", // Increased overlap from -50px to -80px
						paddingTop: "80px", // Increased from 40px to account for larger overlap
						paddingBottom: "60px",
						minHeight: "80vh",
						zIndex: 10, // Ensure it's above Hero
					}}
					ref={sectionRef}
				>
					{/* Mobile Header Section */}
					<div className="px-4 py-4">
						<div className="mb-4 text-end">
							<p
								className="font-extrabold text-[#635D3B] mb-2"
								style={{
									fontFamily: "Noto Serif TC, serif",
									fontSize: "35px",
									lineHeight: "40px",
								}}
							>
								{t("bigtitle1")}
							</p>
							<div className="w-20 h-0.5 bg-[#635D3B] mx-auto" />
						</div>

						{/* Cards Container with Green Background and Flip Animation */}
						<div className="relative max-w-sm mx-auto">
							{/* Green Rectangle Background - Mobile - Fixed Position */}
							<div
								style={{
									position: "absolute",
									top: "100px",
									left: "30%",
									transform: "translateX(-50%)",
									width: "520px",
									height: "320px",
									background: "#374A37",
									borderRadius: "20px",
									zIndex: 0,
								}}
							/>

							<div
								className="relative"
								style={{
									height: "400px",
									perspective: "1000px",
									zIndex: 1,
								}}
							>
								{/* Cards Set 1 */}
								<motion.div
									className="absolute inset-0 grid grid-cols-2 gap-3"
									variants={{
										front: { rotateY: 0, zIndex: 2 },
										back: { rotateY: 180, zIndex: 1 },
									}}
									animate={
										activeCardSet === 1 ? "back" : "front"
									}
									transition={{
										duration: 0.6,
										ease: "easeInOut",
									}}
									style={{
										backfaceVisibility: "hidden",
									}}
								>
									{cards.map((card, idx) => (
										<motion.div
											key={`cards1-${idx}`}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.4,
												delay: idx * 0.1,
											}}
											className="transition-transform duration-200"
										>
											<Card
												title={card.title}
												subtitle={card.subtitle}
												pict={card.pict}
												cardWidth="100%"
												className="h-full transition-shadow duration-200 bg-transparent border-none shadow-none rounded-xl"
											/>
										</motion.div>
									))}
								</motion.div>

								{/* Cards Set 2 */}
								<motion.div
									className="absolute inset-0 grid grid-cols-2 gap-3"
									variants={{
										front: { rotateY: 0, zIndex: 2 },
										back: { rotateY: 180, zIndex: 1 },
									}}
									animate={
										activeCardSet === 1 ? "front" : "back"
									}
									transition={{
										duration: 0.6,
										ease: "easeInOut",
									}}
									style={{
										backfaceVisibility: "hidden",
										transform: "rotateY(180deg)",
									}}
								>
									{cards2.map((card, idx) => (
										<motion.div
											key={`cards2-${idx}`}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.4,
												delay: idx * 0.1,
											}}
											className="transition-transform duration-200"
										>
											<Card2
												title={card.title}
												subtitle={card.subtitle}
												pict={card.pict}
												cardWidth="100%"
												className="h-full transition-shadow duration-200 bg-transparent border-none shadow-none rounded-xl"
											/>
										</motion.div>
									))}
								</motion.div>
							</div>
						</div>

						{/* Debug Progress Indicator - Remove this in production */}
						{/* <div className="px-4 mt-6">
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-full bg-[#374A37] transition-all duration-300 rounded-full"
                                    style={{
                                        width: `${scrollProgress * 100}%`,
                                    }}
                                />
                            </div>
                            <p className="mt-2 text-xs text-center text-gray-500">
                                Progress: {Math.round(scrollProgress * 100)}% | Card Set: {activeCardSet + 1}
                            </p>
                        </div> */}
					</div>
				</div>
			</div>
		);
	}

	// DESKTOP LAYOUT
	return (
		<div
			className="relative w-full overflow-visible"
			style={{
				position: "relative",
				zIndex: 999,
				top: "-20px",
			}}
		>
			<div
				className="relative bg-[#EFEFEF]"
				style={{
					fontFamily: "Noto Serif TC, serif",
					borderTopLeftRadius: "50px",
					borderTopRightRadius: "50px",
					transform: `scale(${scaleRatio})`,
					transformOrigin: "top center",
					width: `${100 / scaleRatio}%`,
					marginLeft: "auto",
					marginRight: "auto",
					position: "relative",
					zIndex: 1,
				}}
				ref={sectionRef}
			>
				<section
					className="self-stretch overflow-hidden flex flex-col items-start justify-start pt-[152px] pb-[80px] px-[5vw] box-border gap-[40px] bg-cover bg-no-repeat bg-[top] max-w-full text-left text-[#073e31]"
					style={{
						fontFamily: "Noto Serif TC, serif",
						position: "relative",
						zIndex: 1,
						borderTopLeftRadius: "50px",
						borderTopRightRadius: "50px",
					}}
				>
					{/* Desktop Header */}
					<div className="flex flex-row items-center justify-end w-full max-w-full py-0 pl-0 pr-1">
						<div className="flex flex-col items-end justify-center p-2.5 box-border max-w-full">
							<h2
								className="mb-10 font-extrabold text-right"
								style={{
									fontFamily: "Noto Serif TC, serif",
									fontWeight: 800,
									fontSize: "80px",
									lineHeight: "90px",
									color: "#635D3B",
									position: "relative",
									display: "inline-block",
								}}
							>
								{t("bigtitle1")}
								<div
									style={{
										width: "860px",
										height: "0px",
										borderBottom: "1px solid #635D3B",
										position: "absolute",
										left: "40%",
										transform: "translateX(-50%)",
										bottom: "-66px",
										borderRadius: "3px",
									}}
								/>
							</h2>
						</div>
					</div>

					{/* Desktop Cards Container */}
					<div
						style={{
							position: "relative",
							width: "100%",
							display: "flex",
							justifyContent: "center",
							perspective: "1000px",
						}}
					>
						<motion.div
							animate={{
								left: getRectanglePosition(),
							}}
							transition={{
								duration: 0.6,
								ease: "easeOut",
							}}
							style={{
								position: "absolute",
								top: 120,
								transform: "translateX(-70%)",
								width: "1500px",
								height: "188px",
								background: "#374A37",
								borderRadius: "30px",
								zIndex: 0,
							}}
						/>

						<div
							style={{
								position: "relative",
								top: 90,
								width: "90%",
								height: "300px",
							}}
						>
							<motion.section
								className="absolute inset-0 w-full max-w-none mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-1 lg:gap-1 text-center text-[16px] sm:text-[18px] lg:text-[20px] text-[#1d1d1d] px-2 sm:px-4"
								variants={flipVariants}
								animate={showSecond ? "back" : "front"}
								transition={{
									duration: 0.8,
									ease: "easeInOut",
								}}
								style={{
									fontFamily: "Noto Serif TC, serif",
									backfaceVisibility: "hidden",
								}}
							>
								{cards.map((card, idx) => (
									<div key={idx}>
										<Card
											title={card.title}
											subtitle={card.subtitle}
											pict={card.pict}
											cardWidth="100%"
											className="bg-transparent rounded-2xl"
										/>
									</div>
								))}
							</motion.section>

							<motion.section
								className="absolute inset-0 w-full max-w-none mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-1 lg:gap-1 text-center text-[16px] sm:text-[18px] lg:text-[20px] text-[#1d1d1d] px-2 sm:px-4"
								variants={flipVariants}
								animate={showSecond ? "front" : "back"}
								transition={{
									duration: 0.8,
									ease: "easeInOut",
								}}
								style={{
									fontFamily: "Noto Serif TC, serif",
									backfaceVisibility: "hidden",
									transform: "rotateY(180deg)",
								}}
							>
								{cards2.map((card, idx) => (
									<div key={idx}>
										<Card2
											title={card.title}
											subtitle={card.subtitle}
											pict={card.pict}
											cardWidth="100%"
											className="bg-transparent rounded-2xl"
										/>
									</div>
								))}
							</motion.section>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Desire;
