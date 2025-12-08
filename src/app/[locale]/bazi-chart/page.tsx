"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { getBaziChartData } from "@/lib/baziChartData";
import BaziRelationshipDiagram from "@/components/BaziRelationshipDiagram";
import BaziDetailedChart from "@/components/BaziDetailedChart";
import BaziPersonalityAnalysis from "@/components/BaziPersonalityAnalysis";
import Navbar from "@/components/Navbar";

function BaziChartContent() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState(0);
	const [baziData, setBaziData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		try {
			// Get birthday data from query params or localStorage
			const birthdayParam = searchParams.get("birthday");
			const genderParam = searchParams.get("gender");
			const nameParam = searchParams.get("name");

			let birthday = birthdayParam;
			let gender = genderParam || "male";
			let userName = nameParam || "用戶";

			// Fallback to localStorage if no params
			if (!birthday) {
				const storedBirthday = localStorage.getItem("userBirthday");
				const storedGender = localStorage.getItem("userGender");
				const storedName = localStorage.getItem("userName");

				if (storedBirthday) {
					birthday = storedBirthday;
					gender = storedGender || "male";
					userName = storedName || "用戶";
				}
			}

			if (!birthday) {
				setError("未找到生日資料，請先輸入生日信息");
				setLoading(false);
				return;
			}

			// Generate BaZi chart data
			const data = getBaziChartData(birthday, gender, userName);
			setBaziData(data);
			setLoading(false);
		} catch (err) {
			console.error("Error loading BaZi data:", err);
			setError("載入八字數據時發生錯誤");
			setLoading(false);
		}
	}, [searchParams]);

	const tabs = [
		{ label: "干支圖況", component: BaziRelationshipDiagram },
		{ label: "基本排盤", component: BaziDetailedChart },
		{ label: "本命天干", component: BaziPersonalityAnalysis },
	];

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
					<p className="text-gray-600">正在計算八字...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
				<div className="sticky top-0 z-10 bg-white shadow-sm">
					<div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
						<button onClick={() => router.back()} className="p-2 -ml-2">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>
						<h1 className="text-lg font-semibold ml-2">八字排盤</h1>
					</div>
				</div>
				<div className="flex items-center justify-center px-6 py-16">
					<div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
						<p className="text-red-600 mb-4">{error}</p>
						<button
							onClick={() => router.push("/bazi-input")}
							className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
						>
							前往輸入生日
						</button>
					</div>
				</div>
			</div>
		);
	}

	const ActiveComponent = tabs[activeTab].component;

	return (
		<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
			{/* Top Navbar */}
			<Navbar from="bazi-chart" title="八字排盤" backgroundColor="white" />

			{/* Tab Navigation - Position below navbar with safe area consideration */}
			<div 
				className="fixed left-0 right-0 z-20 bg-white shadow-sm border-b border-gray-200"
				style={{
					top: 'calc(4rem + env(safe-area-inset-top))',
				}}
			>
				<div className="flex">
					{tabs.map((tab, index) => (
						<button
							key={index}
							onClick={() => setActiveTab(index)}
							className={`flex-1 py-3 text-sm font-medium transition-colors ${
								activeTab === index
									? "text-purple-600 border-b-2 border-purple-600"
									: "text-gray-600 hover:text-gray-800"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* Tab Content - Add top padding for fixed navbar + tabs */}
			<div 
				className="pb-6"
				style={{
					paddingTop: 'calc(7rem + env(safe-area-inset-top))', // navbar (4rem) + tabs (3rem) + safe area
				}}
			>
				<ActiveComponent baziData={baziData} />
			</div>

			{/* Bottom Navbar */}
			<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
				<div className="flex items-center justify-around h-16">
					<button
						onClick={() => router.push(`/${pathname?.split("/")[1] || "zh-TW"}/`)}
						className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-gray-900"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
						</svg>
						<span className="text-xs mt-1">首頁</span>
					</button>
					<button
						onClick={() => router.push(`/${pathname?.split("/")[1] || "zh-TW"}/fortune-calculate`)}
						className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-gray-900"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
						</svg>
						<span className="text-xs mt-1">運程測算</span>
					</button>
					<button
						onClick={() => router.push(`/${pathname?.split("/")[1] || "zh-TW"}/chat`)}
						className="flex flex-col items-center justify-center flex-1 py-2 text-[#A3B116] hover:text-[#8B9914]"
					>
						<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
						</svg>
						<span className="text-xs mt-1">風鈴聊天室</span>
					</button>
					<button
						onClick={() => router.push(`/${pathname?.split("/")[1] || "zh-TW"}/services`)}
						className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-gray-900"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
						</svg>
						<span className="text-xs mt-1">服務定價</span>
					</button>
					<button
						onClick={() => router.push(`/${pathname?.split("/")[1] || "zh-TW"}/profile`)}
						className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-gray-900"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						<span className="text-xs mt-1">我的</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default function BaziChartPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
						<p className="text-gray-600">載入中...</p>
					</div>
				</div>
			}
		>
			<BaziChartContent />
		</Suspense>
	);
}

