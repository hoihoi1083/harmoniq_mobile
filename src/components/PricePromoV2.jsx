"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import PricingModal from "@/components/PricingModal";

export default function PricePromo2() {
	const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

	return (
		<div className="w-full flex justify-center bg-[#EFEFEF] items-center pt-4 sm:pt-4 lg:pt-[20px] mb-10 px-2 sm:px-4 md:px-8  relative">
			<div
				className="flex flex-col items-center justify-start gap-6 sm:gap-10 lg:gap-[70px] w-full"
				style={{
					background: "#374A37",
					borderRadius: "32px",
					boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
					padding: "32px 8px",
				}}
			>
				{/* Header */}
				<h1
					className="mt-6 leading-tight text-center sm:mt-10"
					style={{
						fontFamily: "Noto Serif TC, serif",
						fontWeight: 800,
						fontSize: "2rem", // 32px
						color: "#F2FAF7",
						lineHeight: "1.2",
					}}
				>
					<span className="text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[46px]">
						讓你的家成為人生的能量場
					</span>
				</h1>

				{/* Left and Right Content */}
				<div className="flex flex-col items-start justify-center w-full gap-6 mb-8 sm:gap-8 sm:mb-10 lg:flex-row lg:gap-12">
					{/* Left Side */}
					<div className="w-full lg:w-[50%] flex flex-col gap-4 sm:gap-6">
						<p
							className="text-[1.1rem] sm:text-[1.3rem] md:text-[1.5rem] lg:text-[22px] leading-snug"
							style={{
								fontFamily: "Noto Sans HK, sans-serif",
								fontWeight: 400,
								color: "#FFFFFF",
								lineHeight: "1.4",
								margin: 0,
							}}
						>
							你的居家氣場，就像一部耐人尋味的大作，每一間房、每一項細節，都是人生故事中不可或缺的環節。
						</p>
						<p
							className="text-[1.1rem] sm:text-[1.3rem] md:text-[1.5rem] lg:text-[22px] leading-snug"
							style={{
								fontFamily: "Noto Sans HK, sans-serif",
								fontWeight: 400,
								color: "#FFFFFF",
								lineHeight: "1.4",
								margin: 0,
							}}
						>
							立刻升級，
							<span className="text-[#E8FF00] font-bold">
								僅需市場價1/10的價錢
							</span>
							，解鎖專屬於你的高級全屋風水報告——帶你穿梭空間氣韻，探索每一寸家中的隱藏能量，發現那些潛藏卻深刻影響幸福與成長的秘密。
						</p>
					</div>

					{/* Right Side */}
					<div className="w-full lg:w-[30%] flex flex-col items-center gap-4 sm:gap-6 mt-6 lg:mt-0">
						{/* Price Display */}
						<div className="flex items-baseline gap-1 sm:gap-2">
							<span
								className="text-[1.2rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[36px]"
								style={{
									fontFamily: "Noto Serif TC, serif",
									fontWeight: 800,
									color: "#FFFFFF",
								}}
							>
								HKD
							</span>
							<span
								className="text-[2.5rem] sm:text-[4rem] md:text-[6rem] lg:text-[128px] leading-none"
								style={{
									fontFamily: "Noto Serif TC, serif",
									fontWeight: 800,
									color: "#E8FF00",
									lineHeight: "1",
								}}
							>
								$1
							</span>
							<span
								className="text-[1.2rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[36px]"
								style={{
									fontFamily: "Noto Serif TC, serif",
									fontWeight: 800,
									color: "#FFFFFF",
								}}
							>
								/呎
							</span>
						</div>

						{/* CTA Button */}
						<button
							className="w-full max-w-[320px] sm:max-w-[404px] h-[56px] sm:h-[82px] rounded-full bg-[#E8FF00] text-black font-extrabold text-[1.2rem] sm:text-[2rem] mt-2 sm:mt-4 transition-transform duration-200 hover:scale-105 active:scale-95"
							style={{
								fontFamily: "Noto Serif TC, serif",
								border: "none",
								cursor: "pointer",
							}}
							onClick={() => setIsPricingModalOpen(true)}
						>
							立即解鎖詳細分析
						</button>
					</div>
				</div>
			</div>

			{/* Pricing Modal */}
			{isPricingModalOpen && (
				<PricingModal
					isOpen={isPricingModalOpen}
					onClose={() => setIsPricingModalOpen(false)}
				/>
			)}
		</div>
	);
}
