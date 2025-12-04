"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FourFortuneAnalysis from "@/components/FourFortuneAnalysis";
import getWuxingData from "@/lib/nayin";

function FourFortuneAnalysisContent() {
	const searchParams = useSearchParams();

	// Generate userInfo from search params
	const birthDateTime = searchParams.get("birthDateTime");
	const gender = searchParams.get("gender") || "male";
	const year = searchParams.get("year");
	const month = searchParams.get("month");
	const day = searchParams.get("day");
	const hour = searchParams.get("hour");

	const userInfo =
		birthDateTime || (year && month && day)
			? {
					birthDateTime:
						birthDateTime ||
						new Date(
							parseInt(year || "1990"),
							parseInt(month || "1") - 1,
							parseInt(day || "1"),
							parseInt(hour || "12")
						).toISOString(),
					gender: gender,
					year: parseInt(year || "1990"),
					month: parseInt(month || "1"),
					day: parseInt(day || "1"),
					hour: parseInt(hour || "12"),
				}
			: null;

	// Generate wuxing data if userInfo is available
	const wuxingData = userInfo
		? getWuxingData(userInfo.birthDateTime, userInfo.gender)
		: null;

	// Mock fortune data update handler (this page doesn't need to persist data)
	const handleFortuneDataUpdate = (fortuneType: string, data: any) => {
		console.log(`🎯 Fortune data update: ${fortuneType}`, data);
	};

	const sessionId = searchParams.get("sessionId");

	return (
		<FourFortuneAnalysis
			birthDateTime={birthDateTime}
			gender={gender}
			sessionId={sessionId}
			userInfo={userInfo}
			wuxingData={wuxingData}
			onFortuneDataUpdate={handleFortuneDataUpdate}
		/>
	);
}

export default function FourFortuneAnalysisPage() {
	return (
		<Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
			<FourFortuneAnalysisContent />
		</Suspense>
	);
}
