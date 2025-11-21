import React from "react";
import { useTranslations } from "next-intl";

function PaymentThankYou({ paymentType, onStartDataEntry }) {
	const t = useTranslations("paymentThankYou");

	const getTitle = () => {
		const titleKey = paymentType || "default";
		return t(`title_type.${titleKey}`);
	};

	const getDescription = () => {
		const descriptionKey = paymentType || "default";
		return t(`description.${descriptionKey}`);
	};

	return (
		<div
			className="relative flex items-center justify-center min-h-screen p-4 sm:p-6"
			style={{
				backgroundImage: "url('/images/hero/Herobg2.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				backgroundAttachment: "scroll", // Changed to scroll for better mobile performance
			}}
		>
			{/* Dark overlay for better text readability with gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>

			{/* Content container - improved mobile spacing */}
			<div className="relative z-10 w-full max-w-2xl mx-auto text-center">
				{/* Thank you title - responsive text sizing */}
				<h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
					{t("title")}
				</h1>

				{/* Subtitle - improved mobile text size and spacing */}
				<p className="mb-8 text-lg font-light tracking-wide text-white opacity-90 sm:mb-12 sm:text-xl md:mb-16 md:text-2xl">
					{t("subtitle")}
				</p>

				{/* Success icon - responsive sizing */}
				<div className="flex justify-center mb-8 sm:mb-12 md:mb-16">
					<img
						src="/images/hero/Tick2.png"
						alt="Success"
						className="object-contain w-24 h-24 animate-bounce sm:w-32 sm:h-32 md:w-40 md:h-40"
						style={{
							animation:
								"fadeInScale 1.5s ease-out forwards, bounce 2s ease-in-out 1.5s infinite",
						}}
					/>
				</div>

				{/* Start button - responsive sizing and touch-friendly */}
				<button
					onClick={onStartDataEntry}
					className="inline-flex items-center justify-center w-full px-8 py-4 bg-white text-[#2D5016] font-bold text-lg rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl border-2 border-transparent hover:border-[#B8D42F] sm:w-auto sm:px-12 sm:py-5 sm:text-xl md:px-16"
				>
					{t("startButton")}
				</button>

				{/* Additional info - improved mobile spacing and readability */}
				<div className="max-w-lg mx-auto mt-6 text-sm text-white opacity-80 sm:mt-8 sm:text-base md:mt-10">
					<p className="leading-relaxed">{getDescription()}</p>
				</div>
			</div>

			{/* Custom animation styles */}
			<style jsx>{`
				@keyframes spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}

				@keyframes fadeInScale {
					0% {
						opacity: 0;
						transform: scale(0.3);
					}
					50% {
						opacity: 0.8;
						transform: scale(1.1);
					}
					100% {
						opacity: 1;
						transform: scale(1);
					}
				}

				@keyframes bounce {
					0%,
					20%,
					50%,
					80%,
					100% {
						transform: translateY(0);
					}
					40% {
						transform: translateY(-10px);
					}
					60% {
						transform: translateY(-5px);
					}
				}
			`}</style>
		</div>
	);
}

export default PaymentThankYou;
