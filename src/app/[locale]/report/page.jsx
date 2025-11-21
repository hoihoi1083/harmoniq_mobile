import { Suspense } from "react";
import Report from "@/components/Report";
import { Skeleton } from "@/components/ui/skeleton";
import Footer from "@/components/home/Footer";

export default async function ReportPage({ params, searchParams }) {
	const { locale } = await params;
	const { birthDateTime, gender, sessionId, showHistorical } =
		await searchParams;

	return (
		<div>
			<Report
				birthDateTime={birthDateTime}
				gender={gender}
				sessionId={sessionId}
				locale={locale}
				showHistorical={showHistorical === "true"}
			/>
			<Footer />
		</div>
	);
}
