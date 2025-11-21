export const BUTTON_TRACKING_CONFIG = {
	// Critical conversion buttons
	conversion: [
		{
			selector: '[data-track*="unlock"]',
			category: "Conversion",
			priority: "high",
		},
		{
			selector: '[data-track*="pricing"]',
			category: "Conversion",
			priority: "high",
		},
		{
			selector: '[data-track*="start-analysis"]',
			category: "Conversion",
			priority: "high",
		},
	],

	// Navigation buttons
	navigation: [
		{
			selector: '[data-track*="navbar"]',
			category: "Navigation",
			priority: "medium",
		},
		{
			selector: '[data-track*="menu"]',
			category: "Navigation",
			priority: "medium",
		},
	],

	// Feature interaction buttons
	feature: [
		{
			selector: '[data-track*="upload"]',
			category: "Feature",
			priority: "medium",
		},
		{
			selector: '[data-track*="carousel"]',
			category: "Feature",
			priority: "low",
		},
		{
			selector: '[data-track*="tab"]',
			category: "Feature",
			priority: "low",
		},
	],

	// User authentication
	auth: [
		{
			selector: '[data-track*="login"]',
			category: "Auth",
			priority: "high",
		},
		{
			selector: '[data-track*="logout"]',
			category: "Auth",
			priority: "medium",
		},
	],
};
