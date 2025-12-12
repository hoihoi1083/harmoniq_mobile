"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMobileAuth } from "@/hooks/useMobileAuth";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";

// Fortune levels with colors
const FORTUNE_LEVELS = {
	大凶: { bg: ["#8B0000", "#A52A2A"], text: "white", level: 0 },
	中凶: { bg: ["#DC143C", "#CD5C5C"], text: "white", level: 1 },
	凶: { bg: ["#FF6347", "#FF7F50"], text: "white", level: 2 },
	吉: { bg: ["#90EE90", "#98D89E"], text: "#2C5F2D", level: 3 },
	中吉: { bg: ["#B8D87A", "#9BC25C"], text: "white", level: 4 },
	大吉: { bg: ["#FFD700", "#FFA500"], text: "#8B4513", level: 5 },
};

// 天干 (Heavenly Stems) - 10 elements
const HEAVENLY_STEMS = [
	"甲",
	"乙",
	"丙",
	"丁",
	"戊",
	"己",
	"庚",
	"辛",
	"壬",
	"癸",
];

// 地支 (Earthly Branches) - 12 elements
const EARTHLY_BRANCHES = [
	"子",
	"丑",
	"寅",
	"卯",
	"辰",
	"巳",
	"午",
	"未",
	"申",
	"酉",
	"戌",
	"亥",
];

// 五行 (Five Elements) mapping for Heavenly Stems
const STEM_ELEMENTS = {
	甲: "木",
	乙: "木",
	丙: "火",
	丁: "火",
	戊: "土",
	己: "土",
	庚: "金",
	辛: "金",
	壬: "水",
	癸: "水",
};

// 五行 (Five Elements) mapping for Earthly Branches
const BRANCH_ELEMENTS = {
	子: "水",
	丑: "土",
	寅: "木",
	卯: "木",
	辰: "土",
	巳: "火",
	午: "火",
	未: "土",
	申: "金",
	酉: "金",
	戌: "土",
	亥: "水",
};

// 五行相生相剋 (Five Elements Interactions)
// 生: Wood→Fire→Earth→Metal→Water→Wood
// 剋: Wood→Earth, Earth→Water, Water→Fire, Fire→Metal, Metal→Wood
const ELEMENT_RELATIONS = {
	木: { generates: "火", controls: "土", controlledBy: "金" },
	火: { generates: "土", controls: "金", controlledBy: "水" },
	土: { generates: "金", controls: "水", controlledBy: "木" },
	金: { generates: "水", controls: "木", controlledBy: "火" },
	水: { generates: "木", controls: "火", controlledBy: "土" },
};

// Get Heavenly Stem and Earthly Branch for a given year
function getYearPillar(year: number): {
	stem: string;
	branch: string;
	element: string;
} {
	// 1984 is 甲子年 (start of 60-year cycle)
	const baseYear = 1984;
	const yearOffset = (year - baseYear) % 60;
	const stemIndex = yearOffset % 10;
	const branchIndex = yearOffset % 12;

	const stem = HEAVENLY_STEMS[stemIndex < 0 ? stemIndex + 10 : stemIndex];
	const branch =
		EARTHLY_BRANCHES[branchIndex < 0 ? branchIndex + 12 : branchIndex];
	const element = STEM_ELEMENTS[stem];

	return { stem, branch, element };
}

// Get Day Pillar (simplified - uses solar calendar day of year)
function getDayPillar(date: Date): {
	stem: string;
	branch: string;
	element: string;
} {
	// Calculate days since epoch
	const epoch = new Date(1984, 0, 1); // 甲子 day
	const daysSinceEpoch = Math.floor(
		(date.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24)
	);

	const stemIndex = daysSinceEpoch % 10;
	const branchIndex = daysSinceEpoch % 12;

	const stem = HEAVENLY_STEMS[stemIndex < 0 ? stemIndex + 10 : stemIndex];
	const branch =
		EARTHLY_BRANCHES[branchIndex < 0 ? branchIndex + 12 : branchIndex];
	const element = STEM_ELEMENTS[stem];

	return { stem, branch, element };
}

// Calculate element interaction score
function calculateElementScore(element1: string, element2: string): number {
	if (element1 === element2) return 10; // Same element - harmonious

	const relation =
		ELEMENT_RELATIONS[element1 as keyof typeof ELEMENT_RELATIONS];

	if (relation.generates === element2) return 15; // Generates - very beneficial
	if (relation.controls === element2) return -5; // Controls - mild conflict
	if (relation.controlledBy === element2) return -10; // Controlled by - challenging

	return 5; // Neutral relationship
}

// Enhanced BaZi-based fortune calculation
function calculateDailyFortune(
	userBirthday: Date | null,
	selectedDate: Date
): string {
	if (!userBirthday) return "中吉"; // Default if no birthday

	try {
		// Get birth year and day pillars
		const birthYearPillar = getYearPillar(userBirthday.getFullYear());
		const birthDayPillar = getDayPillar(userBirthday);

		// Get current date year and day pillars
		const currentYearPillar = getYearPillar(selectedDate.getFullYear());
		const currentDayPillar = getDayPillar(selectedDate);

		// Calculate scores based on element interactions
		let score = 50; // Base score (neutral)

		// Year interaction (broader life trends)
		score +=
			calculateElementScore(
				birthYearPillar.element,
				currentYearPillar.element
			) * 0.3;

		// Day interaction (daily fortune - most important)
		score +=
			calculateElementScore(
				birthDayPillar.element,
				currentDayPillar.element
			) * 0.7;

		// Birth year vs current day (personal element meeting daily energy)
		score +=
			calculateElementScore(
				birthYearPillar.element,
				currentDayPillar.element
			) * 0.5;

		// Birth day vs current year (daily essence in yearly context)
		score +=
			calculateElementScore(
				birthDayPillar.element,
				currentYearPillar.element
			) * 0.3;

		// Special bonus: Same branch = 吉日
		if (birthDayPillar.branch === currentDayPillar.branch) {
			score += 10;
		}

		// Special penalty: Opposing branches (子午, 卯酉, 寅申, 巳亥, 辰戌, 丑未)
		const opposingBranches: { [key: string]: string } = {
			子: "午",
			午: "子",
			卯: "酉",
			酉: "卯",
			寅: "申",
			申: "寅",
			巳: "亥",
			亥: "巳",
			辰: "戌",
			戌: "辰",
			丑: "未",
			未: "丑",
		};
		if (
			opposingBranches[birthDayPillar.branch] === currentDayPillar.branch
		) {
			score -= 15;
		}

		// Map score to fortune level (0-100 scale)
		if (score >= 70) return "大吉";
		if (score >= 60) return "中吉";
		if (score >= 50) return "吉";
		if (score >= 40) return "凶";
		if (score >= 30) return "中凶";
		return "大凶";
	} catch (error) {
		console.error("Fortune calculation error:", error);
		return "中吉"; // Fallback
	}
}

export default function FortuneCalculatePage() {
	const router = useRouter();
	const pathname = usePathname();
	const { data: session } = useSession();
	const { mobileSession } = useMobileAuth();
	const t = useTranslations();

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [userBirthday, setUserBirthday] = useState<Date | null>(null);
	const [dailyFortunes, setDailyFortunes] = useState<{
		[key: string]: string;
	}>({});
	const [isLoading, setIsLoading] = useState(true);
	const [currentFortune, setCurrentFortune] = useState<string>("中吉");

	// Extract locale from pathname
	const locale = pathname?.split("/")[1] || "zh-TW";

	// Fetch user birthday and load fortunes
	useEffect(() => {
		const loadUserData = async () => {
			try {
				// Get user email from session (web) or mobile session (native)
				const userEmail =
					session?.user?.email || mobileSession?.user?.email;

				console.log("🔍 Checking user email:", userEmail);
				console.log("🔍 Session:", session?.user?.email);
				console.log("🔍 Mobile session:", mobileSession?.user?.email);

				// Try to load birthday from Capacitor Preferences first (faster, offline-capable)
				if (Capacitor.isNativePlatform()) {
					const { value: savedBirthday } = await Preferences.get({
						key: "userBirthday",
					});
					if (savedBirthday) {
						try {
							setUserBirthday(new Date(savedBirthday));
							console.log(
								"✅ Loaded birthday from mobile preferences:",
								savedBirthday
							);
						} catch (error) {
							console.error(
								"❌ Invalid birthday format in preferences:",
								savedBirthday
							);
						}
					} else {
						console.warn(
							"⚠️ No birthday in mobile preferences - user needs to set it in birthday-entry page"
						);
					}
				}

				// Also try API if we have user email (for future when API is ready)
				if (userEmail && typeof window !== "undefined") {
					const API_BASE =
						process.env.NEXT_PUBLIC_API_BASE_URL ||
						"https://www.harmoniqfengshui.com";
					console.log(
						"🌐 Fetching birthday from:",
						`${API_BASE}/api/user-profile`
					);

					try {
						const response = await fetch(
							`${API_BASE}/api/user-profile`,
							{
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									userId: userEmail,
								}),
							}
						);

						console.log("📡 API Response status:", response.status);

						if (response.ok) {
							const data = await response.json();
							console.log("📦 API Response data:", data);

							if (data.birthDateTime) {
								const apiBirthday = new Date(
									data.birthDateTime
								);
								setUserBirthday(apiBirthday);
								console.log(
									"✅ Loaded birthday from API database:",
									data.birthDateTime
								);

								// Save to preferences for offline use
								if (Capacitor.isNativePlatform()) {
									await Preferences.set({
										key: "userBirthday",
										value: data.birthDateTime,
									});
									console.log(
										"💾 Saved birthday to preferences for offline use"
									);
								}
							} else {
								console.warn(
									"⚠️ No birthDateTime in API response"
								);
							}
						} else {
							console.log(
								`ℹ️ API not available (${response.status}) - using local data`
							);
						}
					} catch (error) {
						console.log(
							"ℹ️ API fetch failed - using local data:",
							error.message
						);
					}
				} else if (!userEmail) {
					console.warn(
						"⚠️ No user email found - cannot fetch birthday from API"
					);
				}

				// Load saved fortunes from Capacitor Preferences (persistent on mobile)
				if (Capacitor.isNativePlatform()) {
					const { value: savedFortunes } = await Preferences.get({
						key: "dailyFortunes",
					});
					if (savedFortunes) {
						try {
							const parsed = JSON.parse(savedFortunes);
							setDailyFortunes(parsed);
							console.log(
								"💾 Loaded cached fortunes from Preferences:",
								Object.keys(parsed).length,
								"dates"
							);
						} catch (error) {
							console.error(
								"❌ Failed to parse saved fortunes:",
								error
							);
						}
					}
				} else if (typeof window !== "undefined") {
					// Fallback to localStorage for web
					const savedFortunes = localStorage.getItem("dailyFortunes");
					if (savedFortunes) {
						setDailyFortunes(JSON.parse(savedFortunes));
						console.log(
							"💾 Loaded cached fortunes from localStorage"
						);
					}
				}
			} catch (error) {
				console.error("❌ Error loading user data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadUserData();
	}, [session, mobileSession]);

	// Load fortune when date changes
	useEffect(() => {
		const loadFortune = async () => {
			const fortune = await getFortuneForDate(selectedDate);
			setCurrentFortune(fortune);
		};
		loadFortune();
	}, [selectedDate, userBirthday]);

	// Calculate and save fortune for a specific date (with API call)
	const getFortuneForDate = async (date: Date): Promise<string> => {
		const dateKey = date.toISOString().split("T")[0];

		// Check if fortune already calculated for this date
		if (dailyFortunes[dateKey]) {
			return dailyFortunes[dateKey];
		}

		let fortune = "中吉"; // Default fallback

		try {
			// Try to call API first
			const API_BASE =
				process.env.NEXT_PUBLIC_API_BASE_URL ||
				"https://www.harmoniqfengshui.com";
			const response = await fetch(`${API_BASE}/api/daily-fortune`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					birthday: userBirthday?.toISOString(),
					selectedDate: date.toISOString(),
				}),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.success && data.data) {
					fortune = data.data.fortune;
				} else {
					// Fallback to client-side calculation
					fortune = calculateDailyFortune(userBirthday, date);
				}
			} else {
				// API failed, use client-side calculation
				fortune = calculateDailyFortune(userBirthday, date);
			}
		} catch (error) {
			console.log(
				"API call failed, using client-side calculation:",
				error
			);
			// Fallback to client-side calculation
			fortune = calculateDailyFortune(userBirthday, date);
		}

		// Save to state and Capacitor Preferences (persistent storage)
		const updatedFortunes = { ...dailyFortunes, [dateKey]: fortune };
		setDailyFortunes(updatedFortunes);

		// Save to persistent storage
		if (Capacitor.isNativePlatform()) {
			await Preferences.set({
				key: "dailyFortunes",
				value: JSON.stringify(updatedFortunes),
			});
			console.log(
				"💾 Saved fortune to Preferences:",
				dateKey,
				"→",
				fortune
			);
		} else if (typeof window !== "undefined") {
			// Fallback to localStorage for web
			localStorage.setItem(
				"dailyFortunes",
				JSON.stringify(updatedFortunes)
			);
			console.log(
				"💾 Saved fortune to localStorage:",
				dateKey,
				"→",
				fortune
			);
		}

		return fortune;
	};

	// Generate dates for the week around selected date
	const generateWeekDates = (): Date[] => {
		const dates: Date[] = [];
		const startDate = new Date(selectedDate);
		startDate.setDate(startDate.getDate() - 3); // Start 3 days before selected

		for (let i = 0; i < 7; i++) {
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
			dates.push(date);
		}
		return dates;
	};

	const weekDates = generateWeekDates();
	const fortuneConfig =
		FORTUNE_LEVELS[currentFortune as keyof typeof FORTUNE_LEVELS] ||
		FORTUNE_LEVELS["中吉"];

	// Day names
	const getDayName = (date: Date): string => {
		const days = ["日", "一", "二", "三", "四", "五", "六"];
		return days[date.getDay()];
	};

	// 🧪 TEST FUNCTION: Set demo birthday
	const setDemoBirthday = async () => {
		const demoBirthday = "1996-03-12T22:00:00";
		if (Capacitor.isNativePlatform()) {
			await Preferences.set({
				key: "userBirthday",
				value: demoBirthday,
			});
			console.log("🧪 Demo birthday saved:", demoBirthday);
			setUserBirthday(new Date(demoBirthday));
			// Recalculate fortune with new birthday
			const fortune = await getFortuneForDate(selectedDate);
			setCurrentFortune(fortune);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 pb-20">
			{/* Use standard Navbar */}
			<Navbar from="fortune-calculate" backgroundColor="white" />

			{/* 🧪 TEST: Show button to set demo birthday if no birthday exists */}
			{!userBirthday && Capacitor.isNativePlatform() && (
				<div className="mx-4 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
					<p className="text-sm text-yellow-800 mb-2">
						⚠️ 測試模式：未設定生日
					</p>
					<button
						onClick={setDemoBirthday}
						className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
					>
						🧪 設定測試生日 (1996-03-12)
					</button>
				</div>
			)}

			{/* Content with top padding for navbar */}
			<div
				className="pt-16"
				style={{ paddingTop: "calc(4rem + env(safe-area-inset-top))" }}
			>
				{/* Today's Luck Card */}
				<div className="mx-4 mt-4">
					<div
						className="rounded-3xl p-8 transition-all duration-500"
						style={{
							background: `linear-gradient(to bottom right, ${fortuneConfig.bg[0]}, ${fortuneConfig.bg[1]})`,
							color: fortuneConfig.text,
						}}
					>
						<p className="text-lg mb-2">今日運程</p>
						<p className="text-5xl font-bold">{currentFortune}</p>
						{!userBirthday && (
							<p className="text-sm mt-2 opacity-80">
								請在個人資料中設定生日以獲得準確運勢
							</p>
						)}
					</div>
				</div>

				{/* Date Selector */}
				<div className="mx-4 mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
					{weekDates.map((date) => {
						const isSelected =
							date.toDateString() === selectedDate.toDateString();
						const dateKey = date.toISOString().split("T")[0];
						const dateFortune = dailyFortunes[dateKey];

						return (
							<button
								key={date.toISOString()}
								onClick={() => setSelectedDate(new Date(date))}
								className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
									isSelected
										? "bg-gray-900 text-white scale-105"
										: "bg-white text-gray-700 border border-gray-200"
								}`}
							>
								<span className="text-xs mb-1">
									{getDayName(date)}
								</span>
								<span className="text-lg font-medium">
									{date.getDate()}
								</span>
								{dateFortune && !isSelected && (
									<span className="text-[10px] mt-0.5 opacity-60">
										{dateFortune}
									</span>
								)}
							</button>
						);
					})}
				</div>

				{/* Theory and Tips Buttons */}
				<div className="mx-4 mt-4 grid grid-cols-2 gap-3">
					<button
						onClick={() => router.push(`/${locale}/home`)}
						className="relative w-full overflow-hidden rounded-2xl border border-gray-200 hover:shadow-md transition-shadow"
					>
						<Image
							src="/images/fortune-calculate/theroy.png"
							alt="原理"
							width={355}
							height={163}
							className="w-full h-auto object-contain"
						/>
					</button>
					<button
						onClick={() => router.push(`/${locale}/home`)}
						className="relative w-full overflow-hidden rounded-2xl border border-gray-200 hover:shadow-md transition-shadow"
					>
						<Image
							src="/images/fortune-calculate/tips.png"
							alt="小貼士"
							width={355}
							height={163}
							className="w-full h-auto object-contain"
						/>
					</button>
				</div>

				{/* Bazi Chart Button */}
				<div className="mx-4 mt-3">
					<button
						onClick={() => router.push(`/${locale}/bazi-input`)}
						className="relative w-full rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
					>
						<Image
							src="/images/fortune-calculate/bazi.png"
							alt="八字排盤"
							width={705}
							height={163}
							className="w-full h-auto object-contain"
						/>
					</button>
				</div>

				{/* Reports Section */}
				<div className="mx-4 mt-6">
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
						<div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
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
						<button className="relative rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
							<Image
								src="/images/fortune-calculate/fengshui.png"
								alt="風水測算"
								width={355}
								height={351}
								className="w-full h-auto object-cover"
							/>
						</button>

						<button className="relative rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
							<Image
								src="/images/fortune-calculate/life.png"
								alt="命理測算"
								width={355}
								height={351}
								className="w-full h-auto object-cover"
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
