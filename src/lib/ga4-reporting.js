// /src/lib/ga4-reporting.js
// Google Analytics 4 Reporting API integration
// Requires: npm install @google-analytics/data

// Environment variables needed:
// GA4_PROPERTY_ID=your-property-id
// GOOGLE_SERVICE_ACCOUNT_KEY=path-to-service-account-json
// or GOOGLE_APPLICATION_CREDENTIALS environment variable

const GA4_EVENTS_MAPPING = {
	// Your custom feng shui events
	feng_shui_analysis_requested: "風水分析開始",
	chat_message_added: "聊天互動",
	form_submission: "表單提交",
	payment_interaction: "付款互動",
	report_generated: "報告生成",
	enhanced_page_view: "增強頁面瀏覽",
	button_click: "按鈕點擊",
	scroll_depth_75: "深度瀏覽",
	time_on_page_30s: "頁面停留",
	language_switched: "語言切換",
	error_occurred: "錯誤事件",
};

const FENG_SHUI_PAGES = {
	"/zh-TW": "繁體中文首頁",
	"/zh-CN": "簡體中文首頁",
	"/zh-TW/design": "設計測算頁面",
	"/zh-TW/price": "服務定價頁面",
	"/zh-TW/report": "分析報告頁面",
	"/api/couple-analysis": "API-情侶分析",
	"/api/season-analysis": "API-季節分析",
};

// Configuration for GA4 Reporting API
export const GA4_CONFIG = {
	property: `properties/${process.env.GA4_PROPERTY_ID}`,
	credentials: process.env.GOOGLE_SERVICE_ACCOUNT_KEY
		? {
				keyFilename: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
			}
		: undefined,
};

// Real-time API endpoints (limited data available)
export const REALTIME_DIMENSIONS = [
	"unifiedScreenName",
	"eventName",
	"country",
	"city",
];

export const REALTIME_METRICS = ["activeUsers"];

// Historical reporting dimensions and metrics
export const REPORTING_DIMENSIONS = [
	"date",
	"eventName",
	"pagePath",
	"pageTitle",
	"country",
	"city",
	"deviceCategory",
	"operatingSystem",
	"browser",
	"customEvent:button_name", // Your custom parameter
	"customEvent:analysis_type", // Your custom parameter
];

export const REPORTING_METRICS = [
	"activeUsers",
	"totalUsers",
	"newUsers",
	"sessions",
	"bounceRate",
	"averageSessionDuration",
	"eventCount",
	"conversions",
	"totalRevenue",
];

// Funnel analysis configuration
export const FENG_SHUI_FUNNEL = [
	{
		step: "landing_page_view",
		name: "首頁訪問",
		filter: {
			fieldName: "pagePath",
			stringFilter: { value: "/zh-T" },
		},
	},
	{
		step: "analysis_started",
		name: "開始測算",
		filter: {
			fieldName: "eventName",
			stringFilter: { value: "feng_shui_analysis_requested" },
		},
	},
	{
		step: "report_viewed",
		name: "查看報告",
		filter: {
			fieldName: "pagePath",
			stringFilter: { value: "/report" },
		},
	},
	{
		step: "pricing_viewed",
		name: "查看定價",
		filter: {
			fieldName: "pagePath",
			stringFilter: { value: "/price" },
		},
	},
	{
		step: "conversion",
		name: "付費轉換",
		filter: {
			fieldName: "eventName",
			stringFilter: { value: "payment_interaction" },
		},
	},
];

// GA4 API query builders
export function buildUserJourneyQuery(dateRange = "7daysAgo") {
	return {
		property: GA4_CONFIG.property,
		dateRanges: [
			{
				startDate: dateRange,
				endDate: "today",
			},
		],
		dimensions: [{ name: "eventName" }, { name: "pagePath" }],
		metrics: [{ name: "eventCount" }, { name: "activeUsers" }],
		dimensionFilter: {
			orGroup: {
				expressions: FENG_SHUI_FUNNEL.map((step) => ({
					filter: step.filter,
				})),
			},
		},
		orderBys: [
			{
				metric: { metricName: "eventCount" },
				desc: true,
			},
		],
	};
}

export function buildTopButtonsQuery(dateRange = "7daysAgo") {
	return {
		property: GA4_CONFIG.property,
		dateRanges: [
			{
				startDate: dateRange,
				endDate: "today",
			},
		],
		dimensions: [{ name: "customEvent:button_name" }, { name: "pagePath" }],
		metrics: [{ name: "eventCount" }],
		dimensionFilter: {
			filter: {
				fieldName: "eventName",
				stringFilter: { value: "button_click" },
			},
		},
		orderBys: [
			{
				metric: { metricName: "eventCount" },
				desc: true,
			},
		],
		limit: 10,
	};
}

export function buildRealtimeQuery() {
	return {
		property: GA4_CONFIG.property,
		dimensions: REALTIME_DIMENSIONS,
		metrics: REALTIME_METRICS,
	};
}

// Helper functions for data processing
export function processFunnelData(response) {
	const funnelMap = new Map();

	response.rows?.forEach((row) => {
		const eventName = row.dimensionValues[0].value;
		const count = parseInt(row.metricValues[0].value);

		const step = FENG_SHUI_FUNNEL.find(
			(s) =>
				eventName.includes(s.step) ||
				row.dimensionValues[1].value.includes(s.step)
		);

		if (step) {
			funnelMap.set(step.name, (funnelMap.get(step.name) || 0) + count);
		}
	});

	return FENG_SHUI_FUNNEL.map((step) => ({
		step: step.name,
		users: funnelMap.get(step.name) || 0,
		percentage: 0, // Calculate after getting total
	}));
}

export function processButtonData(response) {
	return (
		response.rows?.map((row) => ({
			name: row.dimensionValues[0].value || "未知按鈕",
			page:
				FENG_SHUI_PAGES[row.dimensionValues[1].value] ||
				row.dimensionValues[1].value,
			clicks: parseInt(row.metricValues[0].value),
			conversionRate: 0, // Would need additional query to calculate
		})) || []
	);
}

export function processPageData(response) {
	return (
		response.rows?.map((row) => ({
			page: row.dimensionValues[0].value,
			title: FENG_SHUI_PAGES[row.dimensionValues[0].value] || "未知頁面",
			users: parseInt(row.metricValues[0].value),
			bounceRate: parseFloat(row.metricValues[1]?.value || 0),
		})) || []
	);
}

// Error handling for API calls
export function handleGA4Error(error) {
	console.error("GA4 API Error:", error);

	if (error.code === "UNAUTHENTICATED") {
		return {
			error: "GA4 authentication failed. Check service account credentials.",
		};
	}

	if (error.code === "PERMISSION_DENIED") {
		return { error: "GA4 permission denied. Check property access." };
	}

	if (error.code === "QUOTA_EXCEEDED") {
		return { error: "GA4 API quota exceeded. Try again later." };
	}

	return { error: `GA4 API error: ${error.message}` };
}

// Export configuration for easy import
export default {
	GA4_CONFIG,
	GA4_EVENTS_MAPPING,
	FENG_SHUI_PAGES,
	FENG_SHUI_FUNNEL,
	buildUserJourneyQuery,
	buildTopButtonsQuery,
	buildRealtimeQuery,
	processFunnelData,
	processButtonData,
	processPageData,
	handleGA4Error,
};
