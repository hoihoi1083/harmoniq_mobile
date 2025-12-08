"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Preferences } from "@capacitor/preferences";

export default function BaziInputPage() {
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations();

	const [formData, setFormData] = useState({
		name: "",
		gender: "男",
		calendarType: "陽曆",
		birthDate: "",
		birthTime: "",
		birthLocation: "",
	});

	// Load saved user data on mount
	useEffect(() => {
		const loadUserData = async () => {
			try {
				// Try Capacitor Preferences first (mobile)
				const { value: birthday } = await Preferences.get({
					key: "userBirthday",
				});
				const { value: gender } = await Preferences.get({
					key: "userGender",
				});
				const { value: name } = await Preferences.get({
					key: "userName",
				});
				const { value: location } = await Preferences.get({
					key: "userBirthLocation",
				});

				if (birthday) {
					// Parse ISO datetime to date and time
					const date = new Date(birthday);
					const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
					const timeStr = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`; // HH:MM
					setFormData((prev) => ({
						...prev,
						birthDate: dateStr,
						birthTime: timeStr,
					}));
					console.log(
						"✅ Loaded birthday from Preferences:",
						dateStr,
						timeStr
					);
				}

				if (gender) {
					setFormData((prev) => ({
						...prev,
						gender: gender === "male" ? "男" : "女",
					}));
					console.log("✅ Loaded gender from Preferences:", gender);
				}

				if (name) {
					setFormData((prev) => ({ ...prev, name }));
					console.log("✅ Loaded name from Preferences:", name);
				}

				if (location) {
					setFormData((prev) => ({
						...prev,
						birthLocation: location,
					}));
					console.log(
						"✅ Loaded location from Preferences:",
						location
					);
				}
			} catch (error) {
				// Fallback to localStorage for web
				console.log(
					"📱 Preferences not available, trying localStorage..."
				);
				const birthday = localStorage.getItem("userBirthday");
				const gender = localStorage.getItem("userGender");
				const name = localStorage.getItem("userName");
				const location = localStorage.getItem("userBirthLocation");

				if (birthday) {
					// Parse "YYYY-MM-DD HH:mm" format
					const [dateStr, timeStr] = birthday.split(" ");
					setFormData((prev) => ({
						...prev,
						birthDate: dateStr,
						birthTime: timeStr || "12:00",
					}));
					console.log(
						"✅ Loaded birthday from localStorage:",
						dateStr,
						timeStr
					);
				}

				if (gender) {
					setFormData((prev) => ({
						...prev,
						gender: gender === "male" ? "男" : "女",
					}));
				}

				if (name) {
					setFormData((prev) => ({ ...prev, name }));
				}

				if (location) {
					setFormData((prev) => ({
						...prev,
						birthLocation: location,
					}));
				}
			}
		};

		loadUserData();
	}, []);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = () => {
		// Validate inputs
		if (!formData.name.trim()) {
			alert("請輸入姓名");
			return;
		}
		if (!formData.birthDate) {
			alert("請輸入生日");
			return;
		}
		if (!formData.birthLocation.trim()) {
			alert("請輸入出生地點");
			return;
		}

		// Format birthday with time
		const birthTime = formData.birthTime || "12:00";
		const birthday = `${formData.birthDate} ${birthTime}`;

		// Store in localStorage for fallback
		localStorage.setItem("userBirthday", birthday);
		localStorage.setItem(
			"userGender",
			formData.gender === "男" ? "male" : "female"
		);
		localStorage.setItem("userName", formData.name);
		localStorage.setItem("userBirthLocation", formData.birthLocation);
		localStorage.setItem("userCalendarType", formData.calendarType);

		// Navigate to bazi-chart page with query parameters
		const locale = pathname?.split("/")[1] || "zh-TW";
		const params = new URLSearchParams({
			birthday: birthday,
			gender: formData.gender === "男" ? "male" : "female",
			name: formData.name,
		});

		router.push(`/${locale}/bazi-chart?${params.toString()}`);
	};

	return (
		<div className="min-h-screen pb-24 bg-gray-50 pt-30">
			<Navbar from="bazi-input" backgroundColor="white" />

			<div className="max-w-2xl px-4 pt-2 pb-6 mx-auto">
				{/* Header */}
				<div className="mb-4 text-center">
					<h1 className="text-2xl font-bold text-gray-800">
						八字排盤
					</h1>
					<p className="mt-1 text-sm text-gray-500">
						{new Date()
							.toLocaleDateString("zh-TW", {
								year: "numeric",
								month: "2-digit",
								day: "2-digit",
							})
							.replace(/\//g, "/")}
					</p>
				</div>

				{/* Input Form Card */}
				<div className="p-4 mb-6 bg-white shadow-sm rounded-2xl">
					{/* Name Input */}
					<div className="mb-4">
						<label className="block mb-2 text-sm font-medium text-gray-700">
							姓名
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								handleInputChange("name", e.target.value)
							}
							placeholder="請輸入姓名"
							className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A3B116] focus:border-transparent"
						/>
					</div>

					{/* Gender and Calendar Type Row */}
					<div className="grid grid-cols-2 gap-4 mb-4">
						{/* Gender Toggle */}
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700">
								性別
							</label>
							<div className="flex p-1 bg-gray-100 rounded-full">
								<button
									onClick={() =>
										handleInputChange("gender", "男")
									}
									className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
										formData.gender === "男"
											? "bg-[#A3B116] text-white shadow-sm"
											: "text-gray-600"
									}`}
								>
									男
								</button>
								<button
									onClick={() =>
										handleInputChange("gender", "女")
									}
									className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
										formData.gender === "女"
											? "bg-[#A3B116] text-white shadow-sm"
											: "text-gray-600"
									}`}
								>
									女
								</button>
							</div>
						</div>

						{/* Calendar Type Toggle */}
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700">
								曆法
							</label>
							<div className="flex p-1 bg-gray-100 rounded-full">
								<button
									onClick={() =>
										handleInputChange(
											"calendarType",
											"陽曆"
										)
									}
									className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
										formData.calendarType === "陽曆"
											? "bg-[#A3B116] text-white shadow-sm"
											: "text-gray-600"
									}`}
								>
									陽曆
								</button>
								<button
									onClick={() =>
										handleInputChange(
											"calendarType",
											"農曆"
										)
									}
									className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
										formData.calendarType === "農曆"
											? "bg-[#A3B116] text-white shadow-sm"
											: "text-gray-600"
									}`}
								>
									農曆
								</button>
							</div>
						</div>
					</div>

					{/* Birth Date Input */}
					<div className="mb-4">
						<label className="block mb-2 text-sm font-medium text-gray-700">
							出生時間
						</label>
						<input
							type="date"
							value={formData.birthDate}
							onChange={(e) =>
								handleInputChange("birthDate", e.target.value)
							}
							placeholder="請輸入生日"
							className="w-full px-1 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A3B116] focus:border-transparent text-gray-700"
						/>
					</div>

					{/* Birth Time Input */}
					<div className="mb-4">
						<label className="block mb-2 text-sm font-medium text-gray-700">
							出生時辰 (可選)
						</label>
						<input
							type="time"
							value={formData.birthTime}
							onChange={(e) =>
								handleInputChange("birthTime", e.target.value)
							}
							className="w-full px-1 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A3B116] focus:border-transparent text-gray-700"
						/>
					</div>

					{/* Birth Location Input */}
					<div className="mb-6">
						<label className="block mb-2 text-sm font-medium text-gray-700">
							出生地點
						</label>
						<input
							type="text"
							value={formData.birthLocation}
							onChange={(e) =>
								handleInputChange(
									"birthLocation",
									e.target.value
								)
							}
							placeholder="請輸入出生地點"
							className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A3B116] focus:border-transparent"
						/>
					</div>

					{/* Submit Button */}
					<button
						onClick={handleSubmit}
						className="w-full bg-[#A3B116] text-white py-4 rounded-xl font-medium hover:bg-[#8B9914] transition-colors shadow-sm"
					>
						開始免費排盤
					</button>
				</div>

				{/* Reports Section */}
				<div className="mt-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl font-bold text-gray-900">
							付費測算報告
						</h2>
						<span className="bg-[#B8D87A] text-white text-xs px-3 py-1 rounded-full">
							查看價錢
						</span>
					</div>

					{/* Swipeable Cards */}
					<div className="relative mb-6">
						<div className="flex gap-3 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
							{/* Wealth Card */}
							<div className="flex-shrink-0 snap-center">
								<Image
									src="/images/fortune-calculate/wealth.png"
									alt="財運流年測算"
									width={210}
									height={251}
									className="w-[140px] h-auto object-contain"
								/>
							</div>

							{/* Relationship Card */}
							<div className="flex-shrink-0 snap-center">
								<Image
									src="/images/fortune-calculate/relationship.png"
									alt="感情流年測算"
									width={211}
									height={251}
									className="w-[140px] h-auto object-contain"
								/>
							</div>

							{/* Couple Card */}
							<div className="flex-shrink-0 snap-center">
								<Image
									src="/images/fortune-calculate/couple.png"
									alt="感情合盤測算"
									width={210}
									height={251}
									className="w-[140px] h-auto object-contain"
								/>
							</div>

							{/* Health Card */}
							<div className="flex-shrink-0 snap-center">
								<Image
									src="/images/fortune-calculate/health.png"
									alt="健康流年測算"
									width={211}
									height={251}
									className="w-[140px] h-auto object-contain"
								/>
							</div>

							{/* Career Card */}
							<div className="flex-shrink-0 snap-center">
								<Image
									src="/images/fortune-calculate/career.png"
									alt="事業測算"
									width={244}
									height={284}
									className="w-[163px] h-auto object-contain"
								/>
							</div>
						</div>
					</div>

					{/* Bottom Two Buttons */}
					<div className="grid grid-cols-2 gap-3">
						<button className="relative overflow-hidden transition-shadow border border-gray-100 rounded-2xl hover:shadow-md">
							<Image
								src="/images/fortune-calculate/fengshui.png"
								alt="風水測算"
								width={355}
								height={351}
								className="object-cover w-full h-auto"
							/>
						</button>

						<button className="relative overflow-hidden transition-shadow border border-gray-100 rounded-2xl hover:shadow-md">
							<Image
								src="/images/fortune-calculate/life.png"
								alt="命理測算"
								width={355}
								height={351}
								className="object-cover w-full h-auto"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
