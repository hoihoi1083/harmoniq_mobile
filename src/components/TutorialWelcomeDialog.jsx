"use client";

import { useTranslations } from "next-intl";
import useMobile from "@/app/hooks/useMobile";
import { useEffect } from "react";

export default function TutorialWelcomeDialog({
	open,
	onClose,
	onStartTutorial,
}) {
	const t = useTranslations("demo.welcomeDialog");
	const isMobile = useMobile();

	const handleStartTutorial = () => {
		onStartTutorial();
		onClose();
	};

	const handleSkipTutorial = () => {
		onClose();
	};

	// Close dialog on Escape key
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (open) {
			document.addEventListener("keydown", handleEscape);
			// Prevent body scroll when dialog is open
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Dialog Content */}
			<div
				className={`relative bg-white rounded-lg shadow-2xl border ${
					isMobile
						? "mx-4 w-[calc(100vw-2rem)] max-w-[90vw]"
						: "mx-4 w-full max-w-md"
				} max-h-[90vh] overflow-y-auto`}
			>
				{/* Header */}
				<div className="p-6 space-y-4 text-center">
					<h2
						className={`${
							isMobile ? "text-lg" : "text-2xl"
						} font-bold text-gray-800 break-words leading-tight`}
					>
						{t("title")}
					</h2>
					<p
						className={`${
							isMobile ? "text-sm" : "text-base"
						} text-gray-600 leading-relaxed break-words`}
					>
						{t("description")}
					</p>
					<div
						className={`${
							isMobile ? "text-sm" : "text-lg"
						} font-medium text-gray-800 break-words leading-tight`}
					>
						{t("question")}
					</div>
				</div>

				{/* Footer with Buttons */}
				<div className="flex flex-col items-center gap-3 p-6 pt-0">
					{/* Yes button (on top) */}
					<button
						onClick={handleStartTutorial}
						className={`${
							isMobile
								? "w-full max-w-[280px] py-3 text-sm"
								: "w-64 py-3 text-base"
						} bg-[#13ab87] hover:bg-[#0f9674] text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#13ab87] focus:ring-offset-2`}
					>
						{t("yes")}
					</button>

					{/* No button (on bottom) */}
					<button
						onClick={handleSkipTutorial}
						className={`${
							isMobile
								? "w-full max-w-[280px] py-3 text-sm"
								: "w-64 py-3 text-base"
						} bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2`}
					>
						{t("no")}
					</button>
				</div>

				{/* Close button (X) - Optional */}
				<button
					onClick={onClose}
					className="absolute text-gray-400 transition-colors duration-200 rounded top-4 right-4 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
				>
					<svg
						className="w-6 h-6"
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
		</div>
	);
}
