// Integration example for your Feng Shui application
import React, { useState, useEffect } from "react";
import { useChineseRegionDetection } from "../hooks/useIPLocation";

const LocationAwareContent = ({ children }) => {
	const { regionInfo, isLoading } = useChineseRegionDetection();
	const [showChineseUI, setShowChineseUI] = useState(false);

	useEffect(() => {
		if (regionInfo) {
			// Show Chinese UI for users from China, Hong Kong, or Macau
			setShowChineseUI(
				regionInfo.isMainlandChina ||
					regionInfo.isHongKong ||
					regionInfo.isMacau
			);
		}
	}, [regionInfo]);

	// Loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p>正在检测您的位置...</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`location-aware-content ${showChineseUI ? "chinese-ui" : "international-ui"}`}
		>
			{/* Location-specific header */}
			{regionInfo?.isMainlandChina && (
				<div className="bg-red-50 border-b border-red-200 p-3 text-center">
					<p className="text-red-800 text-sm">
						🇨🇳 欢迎中国大陆用户！我们为您提供专业的风水命理服务
					</p>
				</div>
			)}

			{regionInfo?.isHongKong && (
				<div className="bg-purple-50 border-b border-purple-200 p-3 text-center">
					<p className="text-purple-800 text-sm">
						🇭🇰 Welcome Hong Kong users! Professional Feng Shui
						consultation available
					</p>
				</div>
			)}

			{/* Main content with location-aware features */}
			<div className="relative">
				{children}

				{/* Floating location indicator (for testing) */}
				{process.env.NODE_ENV === "development" && regionInfo && (
					<div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs z-50">
						<div>IP: {regionInfo.location?.ip}</div>
						<div>
							Location: {regionInfo.location?.city},{" "}
							{regionInfo.location?.country}
						</div>
						<div>
							Region:{" "}
							{regionInfo.isMainlandChina
								? "China"
								: regionInfo.isHongKong
									? "Hong Kong"
									: regionInfo.isMacau
										? "Macau"
										: "International"}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

// Hook for location-aware features in your components
export const useLocationAwareFeatures = () => {
	const { regionInfo } = useChineseRegionDetection();

	return {
		// Currency preferences
		preferredCurrency: regionInfo?.isMainlandChina
			? "CNY"
			: regionInfo?.isHongKong
				? "HKD"
				: "USD",

		// Language preferences
		preferredLanguage: regionInfo?.isMainlandChina
			? "zh-CN"
			: regionInfo?.isHongKong
				? "zh-HK"
				: "en",

		// Time zone
		timeZone: regionInfo?.location?.timezone || "UTC",

		// Region-specific features
		features: {
			showChineseCalendar:
				regionInfo?.isMainlandChina ||
				regionInfo?.isHongKong ||
				regionInfo?.isMacau,
			showTraditionalElements:
				regionInfo?.isMainlandChina ||
				regionInfo?.isHongKong ||
				regionInfo?.isMacau,
			showWeChatPay: regionInfo?.isMainlandChina,
			showAlipay: regionInfo?.isMainlandChina,
			showOctopus: regionInfo?.isHongKong,
		},

		// Cultural preferences
		culturalContext: {
			useTraditionalChinese:
				regionInfo?.isHongKong || regionInfo?.isMacau,
			useSimplifiedChinese: regionInfo?.isMainlandChina,
			showFestivalNotifications:
				regionInfo?.isMainlandChina ||
				regionInfo?.isHongKong ||
				regionInfo?.isMacau,
		},
	};
};

export default LocationAwareContent;
