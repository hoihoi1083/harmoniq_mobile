"use client";
import React, { useState } from "react";
import PricingModal from "./PricingModal";

export default function Unlock() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleUnlockClick = () => {
		setIsModalOpen(true);
	};

	return (
		<>
			<div className="w-[94%] ml-6 mb-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					{/* Left side - Text content */}
					<div className="flex flex-col mb-8">
						<h2
							className="text-[56px] font-extrabold text-[#374A37] mb-6"
							style={{
								fontFamily: "Noto Serif TC, serif",
								fontWeight: 900,
								lineHeight: 1.1,
							}}
						>
							解鎖詳細分析後可獲得以下內容
						</h2>
						<p
							className="text-[36px] font-extrabold text-[#D10404]"
							style={{
								fontFamily: "Noto Serif TC, serif",
								fontWeight: 800,
							}}
						>
							內容僅供範例
						</p>
					</div>

					{/* Right side - Unlock button */}
					<div className="flex justify-end">
						<button
							onClick={handleUnlockClick}
							className="flex items-center justify-center bg-[#A3B116] text-white font-extrabold text-[20px] rounded-lg hover:bg-[#8a9914] transition-colors"
							style={{
								width: "250px",
								height: "56px",
								fontFamily: "Noto Serif TC, serif",
								fontWeight: 800,
								borderRadius: "100px",
							}}
						>
							{/* Lock icon */}
							<svg
								className="w-5 h-5 mr-2"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clipRule="evenodd"
								/>
							</svg>
							解鎖詳細分析
						</button>
					</div>
				</div>
			</div>

			{/* Pricing Modal */}
			<PricingModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
}
