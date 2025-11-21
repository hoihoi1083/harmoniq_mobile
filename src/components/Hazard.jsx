"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function Hazard() {
	const t = useTranslations("freeChapter3");
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [randomCareerContent, setRandomCareerContent] = useState("");
	const [randomRelationshipContent, setRandomRelationshipContent] =
		useState("");
	const [randomWealthContent, setRandomWealthContent] = useState("");

	// Get content options from i18n
	const careerContentOptions = t.raw("careerContentOptions") || [];
	const relationshipContentOptions =
		t.raw("relationshipContentOptions") || [];
	const wealthContentOptions = t.raw("wealthContentOptions") || [];

	// Initialize random career content on component mount
	useEffect(() => {
		if (careerContentOptions.length > 0) {
			const randomIndex = Math.floor(
				Math.random() * careerContentOptions.length
			);
			setRandomCareerContent(careerContentOptions[randomIndex]);
		}
	}, [careerContentOptions]);

	// Initialize random relationship content on component mount
	useEffect(() => {
		if (relationshipContentOptions.length > 0) {
			const randomIndex = Math.floor(
				Math.random() * relationshipContentOptions.length
			);
			setRandomRelationshipContent(
				relationshipContentOptions[randomIndex]
			);
		}
	}, [relationshipContentOptions]);

	// Initialize random wealth content on component mount
	useEffect(() => {
		if (wealthContentOptions.length > 0) {
			const randomIndex = Math.floor(
				Math.random() * wealthContentOptions.length
			);
			setRandomWealthContent(wealthContentOptions[randomIndex]);
		}
	}, [wealthContentOptions]);

	// Hazard data with dynamic content
	const hazardData = [
		{
			title: t("risks.career"),
			content: randomCareerContent,
			titleColor: "text-blue-600",
			contentColor: "text-blue-700",
			bgColor: "bg-blue-50",
			borderColor: "#3B82F6",
			buttonBg:
				"bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
		},
		{
			title: t("risks.relationship"),
			content: randomRelationshipContent,
			titleColor: "text-red-600",
			contentColor: "text-red-700",
			bgColor: "bg-red-50",
			borderColor: "#EF4444",
			buttonBg:
				"bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
		},
		{
			title: t("risks.wealth"),
			content: randomWealthContent,
			titleColor: "text-yellow-600",
			contentColor: "text-yellow-700",
			bgColor: "bg-yellow-50",
			borderColor: "#F59E0B",
			buttonBg:
				"bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800",
		},
	];

	return (
		<div className="flex justify-center w-full my-8">
			<div
				className="relative p-8 bg-white"
				style={{
					borderRadius: "60px",
					boxShadow: "0 4px 5.3px rgba(0, 0, 0, 0.25)",
					width: "97%",
					paddingBottom: "90px", // space for button
				}}
			>
				<section className="self-stretch flex flex-col items-center justify-center gap-2  text-left text-lg sm:text-2xl lg:text-[40px] text-[#25826c] font-[ABeeZee]">
					{/* Main Content Container */}
					<div className="w-full rounded-2xl flex flex-row items-center justify-center pt-0 sm:pt-[31px] lg:pt-[5px] px-0 pb-0 sm:pb-0 box-border relative gap-8 max-w-full z-[2]">
						{/* Left Side - Button Selection (40%) */}
						<div className="flex flex-col items-center justify-start w-[40%] gap-6">
							<div className="flex flex-row items-center gap-8">
								{hazardData.map((item, index) => (
									<div
										key={index}
										className="flex flex-col items-center gap-4"
									>
										{/* Circle Button - With Icon */}
										<button
											onClick={() =>
												setSelectedIndex(index)
											}
											className="w-[150px] h-[150px] rounded-full bg-white flex items-center justify-center transition-all duration-300"
											style={{
												boxShadow:
													"0 2px 5.3px rgba(0, 0, 0, 0.3)",
												border:
													selectedIndex === index
														? `8px solid ${item.borderColor}`
														: "8px solid transparent",
											}}
										>
											<Image
												src={
													index === 0
														? "/images/report/icon2.png"
														: index === 1
															? "/images/report/icon3.png"
															: "/images/report/icon4.png"
												}
												alt={`icon${index + 2}`}
												width={30}
												height={30}
												style={{ objectFit: "contain" }}
											/>
										</button>

										{/* Label under circle - Made Larger */}
										<div
											className="text-lg font-semibold text-center"
											style={{
												fontFamily:
													'"Noto Serif TC", serif',
												color:
													selectedIndex === index
														? item.borderColor
														: "#666666",
											}}
										>
											{item.title}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Right Side - Content Display (60%) */}
						<div className="flex flex-col items-start justify-start w-[60%] gap-6">
							{/* Risk Detected Title */}
							<h2
								className="mb-4 font-extrabold text-[40px] leading-tight"
								style={{
									fontFamily: '"Noto Serif TC", serif',
									fontWeight: 800,
									color: "#C40000",
								}}
							>
								{t("riskDetected")}
							</h2>

							{/* Selected Content */}
							<div className="w-full">
								<div
									style={{
										backgroundColor: hazardData[
											selectedIndex
										].bgColor
											.replace("bg-", "")
											.replace("-50", "-50"),
										borderColor:
											hazardData[selectedIndex]
												.borderColor,
										fontFamily: '"Noto Serif TC", serif',
									}}
								>
									{/* Content Text */}
									<div
										className="mb-6 text-2xl font-bold leading-relaxed"
										style={{
											color: hazardData[selectedIndex]
												.borderColor,
											opacity: 0.9,
										}}
									>
										{hazardData[selectedIndex].content}
									</div>

									{/* Call to Action */}
									<div
										className="mb-6 text-2xl font-bold leading-relaxed"
										style={{
											color: hazardData[selectedIndex]
												.borderColor,
											opacity: 0.9,
										}}
									>
										<p>{t("callToAction")}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* Unlock Button - Full Width at Bottom of Container */}
				{/* <div className="absolute bottom-0 left-0 w-full px-0">
					<Link href="/price">
						<button
							className="w-full py-6 text-2xl font-bold rounded-b-[60px] text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-[#374A37] to-[#088C6E] hover:from-[#4F6A4F] hover:to-[#19C9A0] hover:shadow-xl"
							style={{
								fontFamily: '"Noto Serif TC", serif',
								boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
							}}
						>
							{t("unlockDetailButton")}
						</button>
					</Link>
				</div> */}
			</div>
		</div>
	);
}
