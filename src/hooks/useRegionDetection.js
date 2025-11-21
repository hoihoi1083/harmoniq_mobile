/**
 * Region Detection Hook for React Components
 * Custom hook to handle region detection and currency formatting
 */

import { useState, useEffect } from "react";
import { getUserRegion, saveRegionPreference } from "../utils/regionDetection";
import { getRegionConfig, formatPrice } from "../config/regions";

/**
 * Custom hook for region detection and management
 * @returns {object} - Region state and methods
 */
export const useRegionDetection = () => {
	const [region, setRegion] = useState("hongkong"); // Default to Hong Kong
	const [regionConfig, setRegionConfig] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// Initialize region detection
	useEffect(() => {
		const initRegion = async () => {
			try {
				setIsLoading(true);
				console.log("🚀 Initializing region detection...");

				const detectedRegion = await getUserRegion();
				const config = getRegionConfig(detectedRegion);

				setRegion(detectedRegion);
				setRegionConfig(config);
				setError(null);

				console.log("✅ Region initialized:", detectedRegion);
			} catch (err) {
				console.error("❌ Region detection failed:", err);
				setError(err.message);

				// Fallback to Hong Kong
				const fallbackConfig = getRegionConfig("hongkong");
				setRegion("hongkong");
				setRegionConfig(fallbackConfig);
			} finally {
				setIsLoading(false);
			}
		};

		initRegion();
	}, []);

	// Method to manually change region
	const changeRegion = (newRegion) => {
		if (["china", "hongkong"].includes(newRegion)) {
			const config = getRegionConfig(newRegion);
			setRegion(newRegion);
			setRegionConfig(config);
			saveRegionPreference(newRegion);
			console.log("🔄 Region changed to:", newRegion);
		}
	};

	// Method to format price for current region
	const formatPriceForRegion = (amount) => {
		return formatPrice(amount, region);
	};

	// Method to get Stripe price ID for current region
	const getStripePriceId = (plan = "basic") => {
		return regionConfig?.stripePriceIds?.[plan] || null;
	};

	return {
		// State
		region,
		regionConfig,
		isLoading,
		error,

		// Methods
		changeRegion,
		formatPriceForRegion,
		getStripePriceId,

		// Computed values
		currency: regionConfig?.currency || "HKD",
		symbol: regionConfig?.symbol || "HK$",
		locale: regionConfig?.locale || "zh-TW",
		flag: regionConfig?.flag || "��",
	};
};

/**
 * Region Selector Component
 * Simple dropdown to let users manually select their region
 */
export const RegionSelector = ({
	currentRegion,
	onRegionChange,
	className = "",
}) => {
	const regions = [
		{ key: "china", name: "中国大陆", flag: "🇨🇳" },
		{ key: "hongkong", name: "香港", flag: "🇭🇰" },
	];

	return (
		<select
			value={currentRegion}
			onChange={(e) => onRegionChange(e.target.value)}
			className={`border rounded px-3 py-2 bg-white ${className}`}
		>
			{regions.map((region) => (
				<option key={region.key} value={region.key}>
					{region.flag} {region.name}
				</option>
			))}
		</select>
	);
};
