"use client";
import React, { useRef, useState } from "react";

export default function BeforeAfterSlider({ beforeImg, afterImg }) {
	const containerRef = useRef(null);
	const [divider, setDivider] = useState(0.5); // 0 (all before), 0.5 (center)
	const [dragging, setDragging] = useState(false);

	// Only allow dragging to the left (show more before image)
	const handleDrag = (e) => {
		if (!dragging) return;
		const rect = containerRef.current.getBoundingClientRect();
		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		let x = clientX - rect.left;
		let percent = x / rect.width;
		if (percent < 0) percent = 0;
		if (percent > 1) percent = 1;
		// Only allow dragging to the left (from 0 to 0.5)
		if (percent > 0.5) percent = 0.5;
		setDivider(percent);
	};

	const stopDrag = () => setDragging(false);

	// Toggle divider between left (0) and center (0.5)
	const handleArrowClick = () => {
		setDivider(divider === 0 ? 0.5 : 0);
	};

	return (
		<div
			ref={containerRef}
			style={{
				position: "relative",
				width: 500,
				height: 250,
				overflow: "hidden",
				borderRadius: 12,
				boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
				userSelect: "none",
				background: "#222",
			}}
			onMouseMove={handleDrag}
			onMouseUp={stopDrag}
			onMouseLeave={stopDrag}
			onTouchMove={handleDrag}
			onTouchEnd={stopDrag}
		>
			{/* Before image (right, revealed as you drag) */}
			<img
				src={beforeImg}
				alt="Before"
				style={{
					position: "absolute",
					left: 0,
					top: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					zIndex: 1,
					clipPath: `inset(0 0 0 ${divider * 100}%)`,
					transition: dragging
						? "none"
						: "clip-path 0.4s cubic-bezier(.4,2,.6,1)",
				}}
				draggable={false}
			/>
			{/* After image (left, always visible) */}
			<img
				src={afterImg}
				alt="After"
				style={{
					position: "absolute",
					left: 0,
					top: -20,
					width: "50%",
					height: "110%",
					objectFit: "cover",
					zIndex: 0,
				}}
				draggable={false}
			/>
			{/* Divider line and arrow */}
			<div
				style={{
					position: "absolute",
					left: `calc(${divider * 100}% - 18px)`,
					top: 0,
					height: "100%",
					width: 36,
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
				aria-label="Drag to reveal before image"
			>
				{/* Vertical line */}
				<div
					style={{
						width: 2,
						height: "100%",
						background: "#fff",
						borderRadius: 1,
						boxShadow: "0 0 6px 1px rgba(0,0,0,0.18)",
					}}
				/>
				{/* Arrow button */}
				<button
					onClick={handleArrowClick}
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						background: "#fff",
						borderRadius: "50%",
						width: 40, // Larger circle
						height: 40, // Larger circle
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						boxShadow: "0 2px 8px rgba(34,197,94,0.18)",
						border: "none",
						cursor: "pointer",
						outline: "none",
						transition: "background 0.2s",
					}}
					aria-label={
						divider === 0
							? "Show both images"
							: "Show entire before image"
					}
				>
					<span
						style={{
							fontSize: 27, // Larger arrow
							color: "#22c55e",
							fontWeight: 1000,
							letterSpacing: "-2px",
							filter: "drop-shadow(0 1px 2px rgba(34,197,94,0.18))",
						}}
					>
						{divider === 0 ? "→" : "←"}
					</span>
				</button>
			</div>
		</div>
	);
}
