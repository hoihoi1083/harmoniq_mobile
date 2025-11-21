import FourFortuneAnalysis from "@/components/FourFortuneAnalysis";
import getWuxingData from "@/lib/nayin";

export default function FourFortuneAnalysisPage({
	params,
	searchParams,
}: {
	params: { locale: string };
	searchParams: {
		birthDateTime?: string;
		gender?: string;
		sessionId?: string;
		year?: string;
		month?: string;
		day?: string;
		hour?: string;
	};
}) {
	// Generate userInfo from search params
	const userInfo =
		searchParams.birthDateTime ||
		(searchParams.year && searchParams.month && searchParams.day)
			? {
					birthDateTime:
						searchParams.birthDateTime ||
						new Date(
							parseInt(searchParams.year || "1990"),
							parseInt(searchParams.month || "1") - 1,
							parseInt(searchParams.day || "1"),
							parseInt(searchParams.hour || "12")
						).toISOString(),
					gender: searchParams.gender || "male",
					year: parseInt(searchParams.year || "1990"),
					month: parseInt(searchParams.month || "1"),
					day: parseInt(searchParams.day || "1"),
					hour: parseInt(searchParams.hour || "12"),
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

	return (
		<FourFortuneAnalysis
			birthDateTime={searchParams.birthDateTime}
			gender={searchParams.gender}
			sessionId={searchParams.sessionId}
			userInfo={userInfo}
			wuxingData={wuxingData}
			onFortuneDataUpdate={handleFortuneDataUpdate}
		/>
	);
}
