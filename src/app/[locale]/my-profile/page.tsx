"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { useMobileAuth } from "@/hooks/useMobileAuth";

export default function MyProfilePage() {
	const router = useRouter();
	const params = useParams();
	const locale = params?.locale || "zh-TW";
	const { mobileSession } = useMobileAuth();

	const [formData, setFormData] = useState({
		nickname: "",
		gender: "",
		birthDate: "",
		birthTime: "",
		birthLocation: "",
	});
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	// Load user data from Preferences
	useEffect(() => {
		const loadUserData = async () => {
			try {
				if (Capacitor.isNativePlatform()) {
					// Load nickname from session
					if (mobileSession?.user?.name) {
						setFormData((prev) => ({
							...prev,
							nickname: mobileSession.user.name,
						}));
					}

					// Load other data from Preferences
					const { value: gender } = await Preferences.get({
						key: "userGender",
					});
					const { value: birthday } = await Preferences.get({
						key: "userBirthday",
					});
					const { value: location } = await Preferences.get({
						key: "userBirthLocation",
					});

					if (gender) {
						setFormData((prev) => ({ ...prev, gender }));
					}

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
					}

					if (location) {
						setFormData((prev) => ({
							...prev,
							birthLocation: location,
						}));
					}

					console.log("✅ Loaded user profile from Preferences");
				}
			} catch (error) {
				console.error("❌ Error loading user profile:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadUserData();
	}, [mobileSession]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleGenderSelect = (gender: string) => {
		setFormData((prev) => ({ ...prev, gender }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.gender || !formData.birthDate) {
			alert("請填寫性別和出生日期");
			return;
		}

		setIsSaving(true);

		try {
			if (Capacitor.isNativePlatform()) {
				// Save gender
				await Preferences.set({
					key: "userGender",
					value: formData.gender,
				});

				// Combine date and time into ISO datetime
				let birthDateTime = formData.birthDate;
				if (formData.birthTime) {
					birthDateTime += `T${formData.birthTime}:00`;
				} else {
					birthDateTime += "T12:00:00"; // Default to noon
				}

				// Save birthday
				await Preferences.set({
					key: "userBirthday",
					value: birthDateTime,
				});

				// Save birth location
				if (formData.birthLocation) {
					await Preferences.set({
						key: "userBirthLocation",
						value: formData.birthLocation,
					});
				}

				console.log("✅ Saved user profile to Preferences");

				// Show success message
				setShowSuccess(true);
				setTimeout(() => {
					setShowSuccess(false);
				}, 2000);
			}
		} catch (error) {
			console.error("❌ Error saving user profile:", error);
			alert("保存失敗，請重試");
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A3B116] mx-auto mb-4"></div>
					<p className="text-gray-600">載入中...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 pb-24">
			<Navbar from="my-profile" backgroundColor="white" />

			<div className="container mx-auto px-4 pt-20">
				{/* Header */}
				<div className="text-center mb-6">
					<h1 className="text-xl font-bold text-gray-800 mb-2">
						修改個人資料
					</h1>
					<p className="text-sm text-gray-500">
						{new Date().toLocaleDateString("zh-TW")}
					</p>
				</div>

				{/* Avatar */}
				<div className="flex justify-center mb-8">
					<div className="w-24 h-24 rounded-full bg-[#A3B116] flex items-center justify-center">
						<svg
							className="w-12 h-12 text-white"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
						</svg>
					</div>
				</div>

				{/* User Info Title */}
				<div className="mb-4">
					<h2 className="text-base font-medium text-gray-700">
						{mobileSession?.user?.name
							? `${mobileSession.user.name} 的個人資料`
							: "Thea 的個人資料"}
					</h2>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Gender */}
					<div className="bg-white rounded-lg p-4">
						<label className="block text-sm font-medium text-gray-700 mb-3">
							性別
						</label>
						<div className="grid grid-cols-2 gap-4">
							<button
								type="button"
								onClick={() => handleGenderSelect("女")}
								className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
									formData.gender === "女"
										? "border-[#A3B116] bg-[#A3B116]/10"
										: "border-gray-200 hover:border-gray-300"
								}`}
							>
								<span className="text-2xl mb-2">👩</span>
								<span className="text-sm font-medium">女</span>
							</button>
							<button
								type="button"
								onClick={() => handleGenderSelect("男")}
								className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all ${
									formData.gender === "男"
										? "border-[#A3B116] bg-[#A3B116]/10"
										: "border-gray-200 hover:border-gray-300"
								}`}
							>
								<span className="text-2xl mb-2">👨</span>
								<span className="text-sm font-medium">男</span>
							</button>
						</div>
					</div>

					{/* Birth Date */}
					<div className="bg-white rounded-lg p-4">
						<label
							htmlFor="birthDate"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							出生日期
						</label>
						<input
							type="date"
							id="birthDate"
							name="birthDate"
							value={formData.birthDate}
							onChange={handleInputChange}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A3B116] focus:border-transparent"
							required
						/>
					</div>

					{/* Birth Time */}
					<div className="bg-white rounded-lg p-4">
						<label
							htmlFor="birthTime"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							出生時間
						</label>
						<input
							type="time"
							id="birthTime"
							name="birthTime"
							value={formData.birthTime}
							onChange={handleInputChange}
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A3B116] focus:border-transparent"
						/>
					</div>

					{/* Birth Location */}
					<div className="bg-white rounded-lg p-4">
						<label
							htmlFor="birthLocation"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							出生地點
						</label>
						<input
							type="text"
							id="birthLocation"
							name="birthLocation"
							value={formData.birthLocation}
							onChange={handleInputChange}
							placeholder="例如：中國香港"
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A3B116] focus:border-transparent"
						/>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isSaving}
						className="w-full bg-[#A3B116] text-white py-4 rounded-lg font-medium hover:bg-[#8B9914] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSaving ? "保存中..." : "修改資料"}
					</button>
				</form>

				{/* Success Message */}
				{showSuccess && (
					<div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
						✅ 資料已成功保存
					</div>
				)}
			</div>
		</div>
	);
}
