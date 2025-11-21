"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Track page views
export const pageview = (url) => {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("config", GA_TRACKING_ID, {
			page_path: url,
		});
	}
};

// Track events
export const event = ({ action, category, label, value }) => {
	if (typeof window !== "undefined" && window.gtag) {
		window.gtag("event", action, {
			event_category: category,
			event_label: label,
			value: value,
		});
	}
};

export default function GoogleAnalytics() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (!GA_TRACKING_ID) return;

		const url = pathname + searchParams.toString();
		pageview(url);

		// Enhanced acquisition tracking
		if (typeof window !== "undefined" && window.gtag) {
			// Track referrer information
			const referrer = document.referrer;
			const utmSource = searchParams.get("utm_source");
			const utmMedium = searchParams.get("utm_medium");
			const utmCampaign = searchParams.get("utm_campaign");

			// Send enhanced page view with acquisition data
			window.gtag("event", "enhanced_page_view", {
				page_path: pathname,
				page_referrer: referrer || "(direct)",
				utm_source: utmSource || "(not set)",
				utm_medium: utmMedium || "(not set)",
				utm_campaign: utmCampaign || "(not set)",
				user_language: navigator.language || "unknown",
				screen_resolution: `${screen.width}x${screen.height}`,
				viewport_size: `${window.innerWidth}x${window.innerHeight}`,
				connection_type:
					navigator.connection?.effectiveType || "unknown",
			});
		}
	}, [pathname, searchParams]);

	if (!GA_TRACKING_ID) {
		return null;
	}

	return (
		<>
			<script
				async
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
			/>
			<script
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
				}}
			/>
		</>
	);
}
