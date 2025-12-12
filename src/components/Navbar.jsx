"use client";
import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useMobileAuth } from "@/hooks/useMobileAuth";
import { Eye } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { useTranslations } from "next-intl";
import Avatar from "@/components/Avatar";
import RegionLanguageSelector from "@/components/RegionLanguageSelector";

export default function Navbar({ from, backgroundColor = "transparent" }) {
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations("Navigation");
	const t2 = useTranslations("login");

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isNavbarMobile, setIsNavbarMobile] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isMounted, setIsMounted] = useState(false);

	const { data: session, status } = useSession();
	const {
		mobileSession,
		isLoading: mobileLoading,
		isMobile: isCapacitorMobile,
	} = useMobileAuth();

	// Combine web and mobile sessions
	const effectiveSession =
		isCapacitorMobile && mobileSession ? mobileSession : session;
	const effectiveStatus = isCapacitorMobile
		? mobileLoading
			? "loading"
			: mobileSession
				? "authenticated"
				: "unauthenticated"
		: status;

	const isLogined =
		effectiveStatus === "authenticated" && effectiveSession?.user?.userId;

	// Detect mobile screen size
	useEffect(() => {
		setIsMounted(true);
		const checkMobile = () => {
			setIsNavbarMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		setIsLoading(false);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Get current date
	const getCurrentDate = () => {
		const now = new Date();
		const day = String(now.getDate()).padStart(2, "0");
		const month = String(now.getMonth() + 1).padStart(2, "0");
		const year = now.getFullYear();
		return `${day}/${month}/${year}`;
	};

	// Get user's first name or first character
	const getUserName = () => {
		if (!effectiveSession?.user?.name) return "用戶";
		return (
			effectiveSession.user.name.split(" ")[0] ||
			effectiveSession.user.name
		);
	};

	// Prevent hydration mismatch - render consistent content on server
	if (!isMounted) {
		// Return a simple navbar that matches server render
		return (
			<nav
				className="fixed top-0 left-0 right-0 z-[70] h-16 bg-white shadow-sm"
				style={{
					fontFamily: "Noto Serif TC, serif",
					backgroundColor:
						backgroundColor === "transparent"
							? "rgba(255, 255, 255, 0.1)"
							: `#${backgroundColor.replace("#", "")}`,
					paddingTop: "env(safe-area-inset-top)",
					height: "calc(4rem + env(safe-area-inset-top))",
				}}
			>
				<div className="h-full px-4">
					<div className="flex items-center justify-between h-full mx-auto max-w-7xl">
						<div className="flex items-center">Loading...</div>
					</div>
				</div>
			</nav>
		);
	}

	// Only show simplified mobile navbar on Capacitor mobile
	if (isCapacitorMobile) {
		return (
			<nav
				className="fixed top-0 left-0 right-0 z-[70] bg-white border-b border-gray-200"
				style={{
					paddingTop: "env(safe-area-inset-top)",
					height: "calc(4rem + env(safe-area-inset-top))",
					boxShadow: "0 2px 2px rgba(0, 0, 0, 0.25)",
				}}
			>
				<div className="flex items-center justify-between h-16 px-4">
					{/* Left: User Avatar */}
					<div className="flex items-center">
						{isLogined ? (
							<Avatar />
						) : (
							!pathname?.includes("/auth/") && (
								<button
									onClick={() => {
										router.push("/auth/login");
									}}
									className="flex items-center justify-center px-3 h-10 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors cursor-pointer"
									aria-label="Login"
								>
									<span className="text-sm text-white font-medium">
										登入
									</span>
								</button>
							)
						)}
					</div>

					{/* Middle: Greeting and Date */}
					<div className="flex flex-col items-center flex-1 mx-4">
						<p className="text-sm font-medium text-gray-900">
							你好, {getUserName()}
						</p>
						<p className="text-xs text-gray-500">
							{getCurrentDate()}
						</p>
					</div>

					{/* Right: Region Selector & Eye Icon */}
					<div className="flex items-center space-x-1">
						<RegionLanguageSelector
							navTextColor="#000"
							compact={true}
						/>
						<button
							onClick={() => {
								const pathParts = window.location.pathname
									.split("/")
									.filter(Boolean);
								const locale = pathParts[0]?.match(
									/^(zh-TW|zh-CN|zh-HK)$/
								)
									? pathParts[0]
									: "zh-TW";
								window.location.href = `/${locale}/demo`;
							}}
							className="p-2 transition-colors rounded-full hover:bg-gray-100"
						>
							<Eye className="w-6 h-6 text-gray-700" />
						</button>
					</div>
				</div>
			</nav>
		);
	}

	// Original desktop navbar (keep existing code for web)
	const isHome = pathname === "/home";
	const isContact = pathname === "/customer/contact";
	const navTextColor = isContact
		? "#fff"
		: isCapacitorMobile && isHome
			? "#fff"
			: "#000";

	const scrollToSection = (sectionId) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const navigateToSection = (sectionId) => {
		// If we're on the home page, just scroll
		if (pathname === "/home") {
			scrollToSection(sectionId);
		} else {
			// If we're on another page, navigate to home page with hash
			router.push(`/home#${sectionId}`);
		}
	};

	// Handle scrolling when coming from another page with hash
	useEffect(() => {
		if (typeof window !== "undefined" && pathname === "/home") {
			const hash = window.location.hash.replace("#", "");
			if (hash) {
				// Delay to ensure the page and section have loaded
				const timer = setTimeout(() => {
					scrollToSection(hash);
				}, 500);
				return () => clearTimeout(timer);
			}
		}
	}, [pathname]);

	return (
		<nav
			className={`${isHome && !isNavbarMobile ? "fixed" : "absolute"} top-0 left-0 right-0 z-[70] h-16 ${isHome ? "backdrop-blur-[3px]" : "backdrop-blur-[0px]"}  ${
				!isHome && !isContact ? "bg-white shadow-sm" : ""
			}`}
			style={{
				fontFamily: "Noto Serif TC, serif",
				backgroundColor:
					backgroundColor === "transparent"
						? "rgba(255, 255, 255, 0.1)"
						: `#${backgroundColor.replace("#", "")}`,
				paddingTop: "env(safe-area-inset-top)",
				height: "calc(4rem + env(safe-area-inset-top))",
			}}
		>
			<div className="h-full px-4">
				<div className="flex items-center justify-between h-full mx-auto max-w-7xl">
					<div className="flex items-center gap-6">
						{/* Mobile: Hamburger + Logo on left, Desktop: Logo on left */}
						{isNavbarMobile ? (
							<div className="flex items-center gap-3">
								<button
									onClick={() =>
										setIsMobileMenuOpen(!isMobileMenuOpen)
									}
									className="p-2 rounded-md hover:bg-[#A3B116]"
									style={{ color: navTextColor }}
								>
									{isMobileMenuOpen ? (
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
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									) : (
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
												d="M4 6h16M4 12h16M4 18h16"
											/>
										</svg>
									)}
								</button>

								{/* Logo for Mobile */}
								<Link
									href="/home"
									className="relative z-10 flex items-center"
								>
									<Image
										src={
											navTextColor === "#fff"
												? "/images/logo/logo-white.png"
												: "/images/logo/logo-black.png"
										}
										alt="HarmoniQ Logo"
										width={32}
										height={32}
										className="w-8 h-8"
										style={{
											filter: "none",
											backfaceVisibility: "hidden",
											WebkitFontSmoothing: "antialiased",
										}}
										priority
									/>
								</Link>
							</div>
						) : (
							<Link
								href="/home"
								className="relative z-10 flex items-center gap-2"
							>
								<Image
									src={
										navTextColor === "#fff"
											? "/images/logo/logo-desktop.png"
											: "/images/logo/logo-desktop.png"
									}
									alt="HarmoniQ Logo"
									width={681}
									height={132}
									className="w-auto h-8 mx-2"
									style={{
										filter: "none",
										backfaceVisibility: "hidden",
										WebkitFontSmoothing: "antialiased",
									}}
									quality={100}
									priority
								/>
							</Link>
						)}{" "}
						{/* Navigation Links */}
						{!isNavbarMobile && (
							<div className="flex items-center gap-10 ">
								<Link
									href="/home"
									className={`px-3 py-1 rounded-full transition-all font-noto-sans-hk duration-200 hover:opacity-80 ${
										isHome ? "bg-[#A3B116]" : ""
									}`}
									style={{
										color: isHome ? "#fff" : navTextColor,
									}}
								>
									{t("home")}
								</Link>
								<Link
									href="/"
									className={`px-3 py-1 rounded-full transition-all font-noto-sans-hk duration-200 hover:opacity-80 ${
										pathname === "/" ? "bg-[#A3B116]" : ""
									}`}
									style={{
										color:
											pathname === "/"
												? "#fff"
												: navTextColor,
									}}
								>
									{t("smartChat")}
								</Link>
								{/* <button
									onClick={() => navigateToSection("theory")}
									className="transition-colors cursor-pointer hover:opacity-80"
									style={{
										fontFamily: "Noto Serif TC, serif",
										color: navTextColor,
									}}
								>
									{t("theory")}
								</button> */}
								<Link
									href="/price"
									className={`px-3 py-1 rounded-full transition-all font-noto-sans-hk duration-200 hover:opacity-80 ${
										pathname === "/price"
											? "bg-[#A3B116]"
											: ""
									}`}
									style={{
										color:
											pathname === "/price"
												? "#fff"
												: navTextColor,
									}}
								>
									{t("pricing")}
								</Link>
								<button
									onClick={() => navigateToSection("faq")}
									className={`px-3 py-1 rounded-full transition-all duration-200 font-noto-sans-hk cursor-pointer hover:opacity-80 ${
										pathname === "/home" &&
										typeof window !== "undefined" &&
										window.location.hash === "#faq"
											? "bg-[#A3B116]"
											: ""
									}`}
									style={{
										color:
											pathname === "/home" &&
											typeof window !== "undefined" &&
											window.location.hash === "#faq"
												? "#fff"
												: navTextColor,
									}}
								>
									{t("faq")}
								</button>
							</div>
						)}
					</div>

					<div className="flex items-center md:space-x-6">
						{/* Mobile: Language Switcher and Avatar on right */}
						{isNavbarMobile ? (
							<div className="flex items-center space-x-3">
								{/* Language Switcher for Mobile */}
								<RegionLanguageSelector
									navTextColor={navTextColor}
									compact={true}
								/>

								{/* User Avatar/Login for Mobile */}
								{isLoading ? (
									<div
										className="w-6 h-6 border-2 rounded-full border-t-transparent animate-spin"
										style={{ borderColor: navTextColor }}
									></div>
								) : isLogined && from !== "login" ? (
									<Avatar />
								) : (
									<div>
										<Link
											className="block text-xs px-2 py-1 bg-[#B4B4B4] rounded-full hover:bg-[#B4B4B4] focus:outline-none focus:text-primary"
											href={"/auth/login"}
											style={{
												fontFamily:
													"Noto Serif TC, serif",
												fontWeight: "bold",
												color: "black",
											}}
										>
											{t2("login")}
										</Link>
									</div>
								)}
							</div>
						) : (
							<div className="flex items-center space-x-4">
								<RegionLanguageSelector
									navTextColor={navTextColor}
								/>
								{isLoading ? (
									<div
										className="w-6 h-6 border-2 rounded-full border-t-transparent animate-spin"
										style={{ borderColor: navTextColor }}
									></div>
								) : isLogined && from !== "login" ? (
									<Avatar />
								) : (
									<div>
										<Link
											className="block text-sm px-1 py-2  bg-[#B4B4B4] rounded-full hover:bg-[#B4B4B4] focus:outline-none focus:text-primary"
											href={"/auth/login"}
											style={{
												fontFamily:
													"Noto Serif TC, serif",
												fontWeight: "bold",
												color: "black",
											}}
										>
											{t2("login")}
										</Link>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Mobile Menu Dropdown */}
			{isNavbarMobile && isMobileMenuOpen && (
				<div className="absolute top-16 left-0 right-0 bg-white/90 backdrop-blur-sm  border-b shadow-lg z-[80]">
					<div className="px-4 py-2 space-y-2">
						<Link
							href="/home"
							className="block px-4 py-2 text-gray-800 transition-colors rounded hover:bg-gray-100"
							onClick={() => setIsMobileMenuOpen(false)}
							style={{ fontFamily: "Noto Serif TC, serif" }}
						>
							{t("home")}
						</Link>
						<Link
							href="/"
							className="block px-4 py-2 text-gray-800 transition-colors rounded hover:bg-gray-100"
							onClick={() => setIsMobileMenuOpen(false)}
							style={{ fontFamily: "Noto Serif TC, serif" }}
						>
							{t("smartChat")}
						</Link>
						<Link
							href="/price"
							className="block px-4 py-2 text-gray-800 transition-colors rounded hover:bg-gray-100"
							onClick={() => setIsMobileMenuOpen(false)}
							style={{ fontFamily: "Noto Serif TC, serif" }}
						>
							{t("pricing")}
						</Link>
						<button
							onClick={() => {
								navigateToSection("faq");
								setIsMobileMenuOpen(false);
							}}
							className="block w-full px-4 py-2 text-left text-gray-800 transition-colors rounded hover:bg-gray-100"
							style={{ fontFamily: "Noto Serif TC, serif" }}
						>
							{t("faq")}
						</button>
						<div className="pt-2 mt-2 border-t">
							<RegionLanguageSelector navTextColor="#000" />
						</div>
					</div>
				</div>
			)}

			{/* Mobile Menu Overlay */}
			{isNavbarMobile && isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-transparent bg-opacity-25 z-[75]"
					onClick={() => setIsMobileMenuOpen(false)}
				></div>
			)}
		</nav>
	);
}
