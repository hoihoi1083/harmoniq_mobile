/**
 * Region Configuration
 * Defines currency, locale, and payment settings for each supported region
 */

export const regionConfig = {
	china: {
		// Basic info
		name: "China",
		code: "CN",
		currency: "CNY",
		symbol: "¥",
		locale: "zh-CN",

		// Pricing (you can adjust these values)
		prices: {
			basic: 688, // ¥688 CNY
			premium: 1288, // ¥1288 CNY
		},

		// Stripe Price IDs (you'll create these in Stripe dashboard)
		stripePriceIds: {
			basic: "price_china_basic_cny", // Replace with actual Stripe price ID
			premium: "price_china_premium_cny", // Replace with actual Stripe price ID
		},

		// Display settings
		currencyPosition: "before", // ¥688

		// Payment methods available in China
		paymentMethods: ["card", "alipay", "wechat_pay"],
	},

	hongkong: {
		// Basic info
		name: "Hong Kong",
		code: "HK",
		currency: "HKD",
		symbol: "HK$",
		locale: "zh-TW", // Using Taiwan locale for Traditional Chinese

		// Pricing (you can adjust these values)
		prices: {
			basic: 888, // HK$888
			premium: 1588, // HK$1588
		},

		// Stripe Price IDs (you'll create these in Stripe dashboard)
		stripePriceIds: {
			basic: "price_hk_basic_hkd", // Replace with actual Stripe price ID
			premium: "price_hk_premium_hkd", // Replace with actual Stripe price ID
		},

		// Display settings
		currencyPosition: "before", // HK$888

		// Payment methods available in Hong Kong
		paymentMethods: ["card", "alipay_hk", "octopus"],
	},

	taiwan: {
		// Basic info
		name: "Taiwan",
		code: "TW",
		currency: "TWD",
		symbol: "NT$",
		locale: "zh-TW", // Traditional Chinese

		// Pricing (you can adjust these values)
		prices: {
			basic: 888, // NT$888
			premium: 1588, // NT$1588
		},

		// Stripe Price IDs (you'll create these in Stripe dashboard)
		stripePriceIds: {
			basic: "price_tw_basic_twd", // Replace with actual Stripe price ID
			premium: "price_tw_premium_twd", // Replace with actual Stripe price ID
		},

		// Display settings
		currencyPosition: "before", // NT$888

		// Payment methods available in Taiwan
		paymentMethods: ["card", "alipay", "line_pay"],
	},
};

/**
 * Get region configuration by region key
 * @param {string} region - 'china', 'hongkong', or 'taiwan'
 * @returns {object} - Region configuration object
 */
export const getRegionConfig = (region) => {
	return regionConfig[region] || regionConfig.hongkong; // Default to Hong Kong
};

/**
 * Format price according to region's currency settings
 * @param {number} amount - Price amount
 * @param {string} region - Region key
 * @returns {string} - Formatted price string
 */
export const formatPrice = (amount, region) => {
	const config = getRegionConfig(region);

	// Add thousand separators
	const formattedAmount = amount.toLocaleString();

	if (config.currencyPosition === "before") {
		return `${config.symbol}${formattedAmount}`;
	} else {
		return `${formattedAmount}${config.symbol}`;
	}
};

/**
 * Get all supported regions as array
 * @returns {array} - Array of region objects with key and config
 */
export const getAllRegions = () => {
	return Object.keys(regionConfig).map((key) => ({
		key,
		...regionConfig[key],
	}));
};

/**
 * Check if a region is supported
 * @param {string} region - Region key to check
 * @returns {boolean} - True if region is supported
 */
export const isSupportedRegion = (region) => {
	return Object.keys(regionConfig).includes(region);
};
