"use client";
import Image from "next/image";
import { useResponsiveScale } from "../hooks/useResponsiveScale";
import { useRef, useState, useEffect } from "react";

export default function DemoPic() {
	const { isMobileLayout } = useResponsiveScale();
	const scrollContainerRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);

	// Handle mouse/touch drag for horizontal scrolling
	const handleMouseDown = (e) => {
		setIsDragging(true);
		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		setStartX(clientX - scrollContainerRef.current.offsetLeft);
		setScrollLeft(scrollContainerRef.current.scrollLeft);
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		const x = clientX - scrollContainerRef.current.offsetLeft;
		const walk = (x - startX) * 2; // Scroll speed multiplier
		scrollContainerRef.current.scrollLeft = scrollLeft - walk;
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) return;

		// Add event listeners for mouse and touch
		const handleTouchMove = (e) => handleMouseMove(e);
		const handleTouchEnd = () => handleMouseUp();

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("touchmove", handleTouchMove, {
			passive: false,
		});
		document.addEventListener("touchend", handleTouchEnd);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchmove", handleTouchMove);
			document.removeEventListener("touchend", handleTouchEnd);
		};
	}, [isDragging, startX, scrollLeft]);

	// Mobile Layout with horizontal scroll
	if (isMobileLayout) {
		return (
			<section className="w-full px-4 py-8">
				{/* Mobile Title - Centered */}
				<div className="mb-6 text-center">
					<h2
						style={{
							fontFamily: "Noto Serif TC, serif",
							fontWeight: 800,
							fontSize: "32px",
							color: "#374A37",
							margin: 0,
						}}
					>
						照片範例
					</h2>
				</div>

				{/* Horizontal Scrollable Container */}
				<div className="relative">
					{/* Scroll hint text */}
					<p className="mb-3 text-sm text-center text-gray-600">
						左右滑動查看更多照片
					</p>

					<div
						ref={scrollContainerRef}
						className="flex gap-4 overflow-x-auto scrollbar-hide"
						style={{
							scrollBehavior: "smooth",
							WebkitOverflowScrolling: "touch",
							cursor: isDragging ? "grabbing" : "grab",
							paddingBottom: "10px",
						}}
						onMouseDown={handleMouseDown}
						onTouchStart={handleMouseDown}
					>
						{/* Image 1 */}
						<div
							className="relative flex-shrink-0"
							style={{
								width: "260px",
								height: "220px",
								borderRadius: "15px",
								overflow: "hidden",
							}}
						>
							<Image
								src="/images/report/demopic-1.png"
								alt="Demo Picture 1"
								width={260}
								height={220}
								className="object-cover w-full h-full"
								draggable={false}
							/>
							{/* Green circle with tick */}
							<div
								className="absolute flex items-center justify-center"
								style={{
									top: "12px",
									right: "12px",
									width: "32px",
									height: "32px",
									backgroundColor: "#22c55e",
									borderRadius: "50%",
								}}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9 12L11 14L15 10"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>

						{/* Image 2 */}
						<div
							className="relative flex-shrink-0"
							style={{
								width: "260px",
								height: "220px",
								borderRadius: "15px",
								overflow: "hidden",
							}}
						>
							<Image
								src="/images/report/demopic-2.png"
								alt="Demo Picture 2"
								width={260}
								height={220}
								className="object-cover w-full h-full"
								draggable={false}
							/>
							{/* Green circle with tick */}
							<div
								className="absolute flex items-center justify-center"
								style={{
									top: "12px",
									right: "12px",
									width: "32px",
									height: "32px",
									backgroundColor: "#22c55e",
									borderRadius: "50%",
								}}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M9 12L11 14L15 10"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>

						{/* Image 3 */}
						<div
							className="relative flex-shrink-0"
							style={{
								width: "260px",
								height: "220px",
								borderRadius: "15px",
								overflow: "hidden",
							}}
						>
							<Image
								src="/images/report/demopic-3.png"
								alt="Demo Picture 3"
								width={260}
								height={220}
								className="object-cover w-full h-full"
								draggable={false}
							/>
							{/* Red circle with cross */}
							<div
								className="absolute flex items-center justify-center"
								style={{
									top: "12px",
									right: "12px",
									width: "32px",
									height: "32px",
									backgroundColor: "#ef4444",
									borderRadius: "50%",
								}}
							>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M18 6L6 18M6 6L18 18"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* Optional: Add scroll indicators */}
					<div className="flex justify-center mt-4">
						<div className="flex gap-2">
							<div className="w-2 h-2 bg-gray-300 rounded-full"></div>
							<div className="w-2 h-2 bg-gray-300 rounded-full"></div>
							<div className="w-2 h-2 bg-gray-300 rounded-full"></div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	// Desktop Layout (original)
	return (
		<section className="flex items-start justify-center w-[90%] ml-11 mt-40 px-8">
			{/* Left side - Title */}
			<div className="flex items-center mr-25">
				<h2
					style={{
						fontFamily: "Noto Serif TC, serif",
						fontWeight: 800,
						fontSize: "64px",
						color: "#374A37",
						margin: 0,
					}}
				>
					照片範例
				</h2>
			</div>

			{/* Right side - Images */}
			<div className="flex gap-6">
				{/* Image 1 */}
				<div
					className="relative"
					style={{
						width: "288px",
						height: "263px",
						borderRadius: "15px",
						overflow: "hidden",
					}}
				>
					<Image
						src="/images/report/demopic-1.png"
						alt="Demo Picture 1"
						width={288}
						height={263}
						className="object-cover w-full h-full"
					/>
					{/* Green circle with tick */}
					<div
						className="absolute flex items-center justify-center"
						style={{
							top: "12px",
							right: "12px",
							width: "32px",
							height: "32px",
							backgroundColor: "#22c55e",
							borderRadius: "50%",
						}}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9 12L11 14L15 10"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>

				{/* Image 2 */}
				<div
					className="relative"
					style={{
						width: "288px",
						height: "263px",
						borderRadius: "15px",
						overflow: "hidden",
					}}
				>
					<Image
						src="/images/report/demopic-2.png"
						alt="Demo Picture 2"
						width={288}
						height={263}
						className="object-cover w-full h-full"
					/>
					{/* Green circle with tick */}
					<div
						className="absolute flex items-center justify-center"
						style={{
							top: "12px",
							right: "12px",
							width: "32px",
							height: "32px",
							backgroundColor: "#22c55e",
							borderRadius: "50%",
						}}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9 12L11 14L15 10"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>

				{/* Image 3 */}
				<div
					className="relative"
					style={{
						width: "288px",
						height: "263px",
						borderRadius: "15px",
						overflow: "hidden",
					}}
				>
					<Image
						src="/images/report/demopic-3.png"
						alt="Demo Picture 3"
						width={288}
						height={263}
						className="object-cover w-full h-full"
					/>
					{/* Red circle with cross */}
					<div
						className="absolute flex items-center justify-center"
						style={{
							top: "12px",
							right: "12px",
							width: "32px",
							height: "32px",
							backgroundColor: "#ef4444",
							borderRadius: "50%",
						}}
					>
						<svg
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M18 6L6 18M6 6L18 18"
								stroke="white"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>
		</section>
	);
}
