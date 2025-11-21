/**
 * Example: Same Price Value, Different Currency
 * If you want ¥88 for China and HK$88 for Hong Kong (same number, different symbol)
 */

export const samePriceConfig = {
	china: {
		name: "China",
		currency: "CNY",
		symbol: "¥",
		prices: {
			basic: 88, // ¥88 CNY
			premium: 188, // ¥188 CNY
		},
		stripePriceIds: {
			basic: "price_china_88_cny",
			premium: "price_china_188_cny",
		},
	},

	hongkong: {
		name: "Hong Kong",
		currency: "HKD",
		symbol: "HK$",
		prices: {
			basic: 88, // HK$88 HKD (same number!)
			premium: 188, // HK$188 HKD (same number!)
		},
		stripePriceIds: {
			basic: "price_hk_88_hkd",
			premium: "price_hk_188_hkd",
		},
	},
};

// Usage:
// China users see: ¥88 CNY
// Hong Kong users see: HK$88 HKD
// Same price value (88), different currency symbols
