"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { get, post } from "@/lib/ajax";
import getWuxingData from "@/lib/nayin"; // Changed: default import instead of named import
import {
	getPetCompatibilityPrompt,
	getPetUserData,
} from "@/components/report/utilsTw";
import moment from "moment";
import Image from "next/image";
import fengshuiLoading from "../../public/images/風水妹/風水妹-loading.png";

export default function Pet() {
	const { data: session } = useSession();
	const [petData, setPetData] = useState(null);
	const [userInfo, setUserInfo] = useState(null);
	const [compatibilityReport, setCompatibilityReport] = useState(null);
	const [loading, setLoading] = useState(true);
	const [generating, setGenerating] = useState(false);

	useEffect(() => {
		loadPetData();
	}, [session?.user?.userId]);

	const loadPetData = async () => {
		if (!session?.user?.userId) return;

		try {
			setLoading(true);

			// Load user info
			const { status: userStatus, data: userData } = await get(
				`/api/users/${session.user.userId}`
			);
			if (userStatus !== 0) {
				return;
			}
			setUserInfo(userData);

			// Load pet data from API
			const { success, pet } = await get(
				`/api/pet?userId=${session.user.userId}`
			);

			if (success && pet) {
				setPetData(pet);
				// Generate compatibility report
				await generateCompatibilityReport(userData, pet);
			} else {
				// Try to load from localStorage
				const localPetData = localStorage.getItem("petData");
				if (localPetData) {
					const parsedPetData = JSON.parse(localPetData);
					setPetData(parsedPetData);
					await generateCompatibilityReport(userData, parsedPetData);
				}
			}
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	const generateCompatibilityReport = async (userData, petInfo) => {
		try {
			setGenerating(true);

			// Use your existing utility functions from utilsTw.js
			const systemPrompt = getPetCompatibilityPrompt();
			const userPrompt = getPetUserData(userData, petInfo);

			// Call AI API
			const response = await post("/api/ai/generate", {
				systemPrompt,
				userPrompt,
				type: "pet-compatibility",
			});

			if (response.success) {
				try {
					const report = JSON.parse(response.content);
					setCompatibilityReport(report);
				} catch (parseError) {
					setCompatibilityReport({ rawContent: response.content });
				}
			}
		} catch (error) {
			// Fallback
			setCompatibilityReport({
				rawContent: `基於您的生肖${getChineseZodiac(userData.birthDateTime)}和您的${petInfo.type}生肖${getChineseZodiac(petInfo.birthDateTime)}，建議您們保持和諧的相處模式，注意寵物的健康管理。`,
			});
		} finally {
			setGenerating(false);
		}
	};

	const formatDate = (dateString) => {
		return moment(dateString).format("YYYY年MM月DD日");
	};

	const getChineseZodiac = (date) => {
		const year = moment(date).year();
		const zodiacAnimals = [
			"鼠",
			"牛",
			"虎",
			"兔",
			"龍",
			"蛇",
			"馬",
			"羊",
			"猴",
			"雞",
			"狗",
			"豬",
		];
		const zodiacIndex = (year - 1900) % 12;
		return zodiacAnimals[zodiacIndex];
	};

	if (loading) {
		return (
			<div
				className="flex items-center justify-center min-h-screen"
				style={{ backgroundColor: "#EFEFEF" }}
			>
				<div
					className="text-center"
					style={{ fontFamily: '"Noto Sans HK", sans-serif' }}
				>
					<div className="relative mb-6">
						<Image
							src={fengshuiLoading}
							alt="Loading"
							width={120}
							height={120}
							className="mx-auto"
						/>
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="w-8 h-8 border-b-2 border-pink-500 rounded-full animate-spin"></div>
						</div>
					</div>
					<p className="text-lg text-gray-700">載入寵物資料中...</p>
				</div>
			</div>
		);
	}

	if (!petData) {
		return (
			<div className="container px-4 py-8 mx-auto">
				<div className="text-center">
					<h1 className="mb-4 text-2xl font-bold">寵物命理分析</h1>
					<p className="mb-8 text-gray-600">您尚未添加寵物資料</p>
					<p className="text-sm text-gray-500">
						請前往設計頁面的用戶資料對話框添加您的寵物資訊
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="container max-w-4xl px-4 py-8 mx-auto"
			style={{ fontFamily: '"Noto Serif TC", serif' }}
		>
			<h1 className="mb-8 text-3xl font-bold text-center">
				寵物命理相性分析
			</h1>

			{/* Pet Basic Info */}
			<div className="p-6 mb-8 bg-white rounded-lg shadow-md">
				<h2 className="flex items-center mb-4 text-xl font-bold">
					🐾 寵物資訊
				</h2>
				<div className="grid gap-4 md:grid-cols-2">
					<div>
						<p>
							<strong>類型：</strong>
							{petData.type}
						</p>
						<p>
							<strong>名字：</strong>
							{petData.name || "未提供"}
						</p>
						<p>
							<strong>性別：</strong>
							{petData.gender}
						</p>
					</div>
					<div>
						<p>
							<strong>出生日期：</strong>
							{formatDate(petData.birthDateTime)}
						</p>
						<p>
							<strong>生肖：</strong>
							{getChineseZodiac(petData.birthDateTime)}
						</p>
					</div>
				</div>
			</div>

			{/* Owner Basic Info */}
			{userInfo && (
				<div className="p-6 mb-8 bg-white rounded-lg shadow-md">
					<h2 className="flex items-center mb-4 text-xl font-bold">
						👤 主人資訊
					</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<p>
								<strong>性別：</strong>
								{userInfo.gender === "female" ? "女" : "男"}
							</p>
							<p>
								<strong>出生日期：</strong>
								{formatDate(userInfo.birthDateTime)}
							</p>
						</div>
						<div>
							<p>
								<strong>生肖：</strong>
								{getChineseZodiac(userInfo.birthDateTime)}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* AI Compatibility Report */}
			{generating && (
				<div className="p-6 mb-8 bg-white rounded-lg shadow-md">
					<div
						className="text-center"
						style={{ fontFamily: '"Noto Sans HK", sans-serif' }}
					>
						<div className="relative mb-4">
							<Image
								src={fengshuiLoading}
								alt="Loading"
								width={80}
								height={80}
								className="mx-auto"
							/>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-6 h-6 border-b-2 border-pink-500 rounded-full animate-spin"></div>
							</div>
						</div>
						<p className="text-gray-700">
							AI 正在分析您與寵物的命理相性...
						</p>
					</div>
				</div>
			)}

			{compatibilityReport && !generating && (
				<div className="space-y-6">
					{compatibilityReport.rawContent ? (
						// Fallback for non-JSON response
						<div className="p-6 bg-white rounded-lg shadow-md">
							<h2 className="mb-4 text-xl font-bold">
								🔮 命理相性分析
							</h2>
							<div className="whitespace-pre-wrap">
								{compatibilityReport.rawContent}
							</div>
						</div>
					) : (
						// Structured JSON response
						<>
							{/* Pet Basic Analysis */}
							{compatibilityReport.寵物基本資訊 && (
								<div className="p-6 bg-white rounded-lg shadow-md">
									<h2 className="mb-4 text-xl font-bold">
										🐾 寵物基本資訊
									</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold text-green-600">
												類型與屬性
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.寵物基本資訊.類型與屬性
												}
											</p>
										</div>
										<div>
											<h3 className="font-semibold text-green-600">
												天干地支
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.寵物基本資訊.天干地支
												}
											</p>
										</div>
										<div>
											<h3 className="font-semibold text-green-600">
												五行配置
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.寵物基本資訊.五行配置
												}
											</p>
										</div>
										<div>
											<h3 className="font-semibold text-green-600">
												年命特點
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.寵物基本資訊.年命特點
												}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Compatibility Relationship */}
							{compatibilityReport.主寵地支關係 && (
								<div className="p-6 bg-white rounded-lg shadow-md">
									<h2 className="mb-4 text-xl font-bold">
										🔗 主寵地支關係
									</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold text-blue-600">
												相性類型
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.主寵地支關係.相性類型
												}
											</p>
										</div>
										<div>
											<h3 className="font-semibold text-blue-600">
												五行互動
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.主寵地支關係.五行互動
												}
											</p>
										</div>
										<div>
											<h3 className="font-semibold text-blue-600">
												能量場影響
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.主寵地支關係.能量場影響
												}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Life Impact */}
							{compatibilityReport.實際生活影響 && (
								<div className="p-6 bg-white rounded-lg shadow-md">
									<h2 className="mb-4 text-xl font-bold">
										🏠 實際生活影響
									</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold text-green-600">
												正面效應
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.實際生活影響.正面效應
												}
											</p>
										</div>
										<div>
											<h3 className="font-semibold text-orange-600">
												潛在挑戰
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.實際生活影響.潛在挑戰
												}
											</p>
										</div>
										<div>
											<h3 className="font-semibold text-red-600">
												健康警示
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.實際生活影響.健康警示
												}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Solutions */}
							{compatibilityReport.化解調和方案 && (
								<div className="p-6 bg-white rounded-lg shadow-md">
									<h2 className="mb-4 text-xl font-bold">
										🔧 化解調和方案
									</h2>
									<div className="space-y-4">
										<div>
											<h3 className="font-semibold text-purple-600">
												風水布局
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.化解調和方案.風水布局
												}
											</p>
										</div>
										<div>
											<h3 className="font-semibold text-purple-600">
												五行補強
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.化解調和方案.五行補強
												}
											</p>
										</div>
										<div>
											<h3 className="font-semibold text-purple-600">
												互動技巧
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.化解調和方案.互動技巧
												}
											</p>
										</div>
										<div>
											<h3 className="font-semibold text-purple-600">
												時機選擇
											</h3>
											<p className="mt-2">
												{
													compatibilityReport
														.化解調和方案.時機選擇
												}
											</p>
										</div>
									</div>
								</div>
							)}

							{/* Overall Recommendation */}
							{compatibilityReport.總體建議 && (
								<div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-green-50 to-blue-50">
									<h2 className="mb-4 text-xl font-bold">
										💡 總體建議
									</h2>
									<p className="text-lg leading-relaxed">
										{compatibilityReport.總體建議}
									</p>
								</div>
							)}
						</>
					)}
				</div>
			)}

			{!compatibilityReport && !generating && (
				<div className="p-6 text-center bg-white rounded-lg shadow-md">
					<p className="mb-4 text-gray-600">
						尚未生成命理相性分析報告
					</p>
					<button
						onClick={() =>
							generateCompatibilityReport(userInfo, petData)
						}
						className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
					>
						生成分析報告
					</button>
				</div>
			)}
		</div>
	);
}
