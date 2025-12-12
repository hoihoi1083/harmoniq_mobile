"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { use } from "react";
import Report from "@/components/Report";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/home/Footer";

function ReportPageContent({ params }) {
	const { locale } = use(params);
	const searchParams = useSearchParams();
	const birthDateTime = searchParams.get("birthDateTime");
	const gender = searchParams.get("gender");
	const sessionId = searchParams.get("sessionId");
	const showHistorical = searchParams.get("showHistorical") === "true";

	return (
		<div>
			<Report
				birthDateTime={birthDateTime}
				gender={gender}
				sessionId={sessionId}
				locale={locale}
				showHistorical={showHistorical}
			/>
			<Footer />
		</div>
	);
}

export default function ReportPage({ params }) {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center items-center min-h-screen">
					Loading...
				</div>
			}
		>
			<ReportPageContent params={params} />
		</Suspense>
	);
}
