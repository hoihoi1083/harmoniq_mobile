"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PricingModal({ isOpen, onClose }) {
	const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.harmoniqfengshui.com';
	const { data: session } = useSession();
	const router = useRouter();
	const [isProcessingPayment, setIsProcessingPayment] = useState(false);
	const [currentCardType, setCurrentCardType] = useState("");
	const [showSqftPopup, setShowSqftPopup] = useState(false);
	const [sqftValue, setSqftValue] = useState("");
	const [sqftError, setSqftError] = useState("");

	// Facebook sharing and promo code states
	const [isUnlocked, setIsUnlocked] = useState(false);
	const [promoCode, setPromoCode] = useState("");
	const [showPromoInput, setShowPromoInput] = useState(false);
	const [promoError, setPromoError] = useState("");
	const [sharing, setSharing] = useState(false);
	const [showShareConfirm, setShowShareConfirm] = useState(false);
	const [sharePromoCode, setSharePromoCode] = useState("");
	const [copied, setCopied] = useState(false);

	const validPromoCodes = ["UNLOCK2025", "HARMONIQ", "FENGSHUI"];

	const handlePremiumClick = () => {
		// Check if user is logged in first
		if (!session?.user?.userId) {
			router.push("/auth/login");
			onClose();
			return;
		}

		// Check if $1 option is unlocked
		if (!isUnlocked) {
			// Show promo input if not already shown
			if (!showPromoInput) {
				setShowPromoInput(true);
			}
			return;
		}

		setCurrentCardType("premium");
		setShowSqftPopup(true);
	};

	const handleSubscriptionClick = () => {
		// Check if user is logged in first
		if (!session?.user?.userId) {
			router.push("/auth/login");
			onClose();
			return;
		}

		setCurrentCardType("subscription");
		setShowSqftPopup(true);
	};

	// Handle promo code submission
	const handlePromoSubmit = () => {
		if (validPromoCodes.includes(promoCode.toUpperCase())) {
			setIsUnlocked(true);
			setShowPromoInput(false);
			setPromoError("");
		} else {
			setPromoError("無效的優惠碼");
		}
	};

	// Handle Facebook sharing
	const handleFacebookShare = () => {
		setSharing(true);

		const shareUrl =
			typeof window !== "undefined"
				? window.location.origin + "/price"
				: "https://www.harmoniqfengshui.com/price";

		const shareText = encodeURIComponent(
			"🏠✨ 發現了一個超棒的風水分析網站！HarmoniQ幫我優化家居布局，讓生活更和諧幸福！現在還有特別優惠，快來試試看吧！"
		);

		const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
			shareUrl
		)}&quote=${shareText}`;

		const popup = window.open(
			facebookShareUrl,
			"facebook-share",
			"width=600,height=500,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no"
		);

		if (popup) {
			const checkClosed = setInterval(() => {
				try {
					if (popup.closed) {
						clearInterval(checkClosed);
						setSharing(false);
						setTimeout(() => setShowShareConfirm(true), 500);
					}
				} catch (error) {
					clearInterval(checkClosed);
					setSharing(false);
				}
			}, 500);

			setTimeout(() => {
				if (!popup.closed) {
					clearInterval(checkClosed);
					setSharing(false);
				}
			}, 300000);

			popup.focus();
		} else {
			setSharing(false);
			alert(
				"請允許彈出窗口以分享到Facebook，或手動複製網址分享：" +
					shareUrl
			);
			setTimeout(() => setShowShareConfirm(true), 1000);
		}
	};

	// Handle share confirmation
	const handleShareConfirm = async (confirmed) => {
		setShowShareConfirm(false);
		if (confirmed) {
			try {
				const response = await fetch(`${API_BASE}/api/send-promo`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: "user@example.com",
						contentShared: "HarmoniQ Feng Shui Website",
						shareMethod: "facebook_browser",
						shareUrl: "https://www.harmoniqfengshui.com",
					}),
				});

				if (response.ok) {
					const data = await response.json();
					setSharePromoCode(data.code);
				} else {
					// Fallback promo code if API fails
					setSharePromoCode("UNLOCK2025");
				}
			} catch (error) {
				// Fallback promo code if API fails
				setSharePromoCode("UNLOCK2025");
			}
		}
	};

	// Copy to clipboard function
	const copyToClipboard = (text) => {
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard
				.writeText(text)
				.then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 1500);
				})
				.catch(() => {});
		} else {
			const textArea = document.createElement("textarea");
			textArea.value = text;
			textArea.style.position = "fixed";
			textArea.style.left = "-999999px";
			textArea.style.top = "-999999px";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				document.execCommand("copy");
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			} catch (err) {}
			document.body.removeChild(textArea);
		}
	};

	const handleSqftSubmit = async () => {
		const sqft = parseFloat(sqftValue);

		// Minimum 380 square feet validation
		if (!sqftValue || isNaN(sqft) || sqft < 380) {
			setSqftError("最少需要380平方尺");
			return;
		}

		setIsProcessingPayment(true);
		setSqftError("");

		try {
			// Choose API endpoint based on card type
			const endpoint =
				currentCardType === "premium"
					? "/api/checkoutSessions/payment2"
					: "/api/checkoutSessions/payment1";

			// Create checkout session with square feet quantity
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					quantity: Math.ceil(sqft), // Round up to nearest whole number
					squareFeet: sqft,
				}),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.data?.url) {
					// Redirect to Stripe checkout
					window.location.href = data.data.url;
				} else {
					throw new Error("No checkout URL received");
				}
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || "支付錯誤");
			}
		} catch (error) {
			setSqftError("支付錯誤，請重試");
			setIsProcessingPayment(false);
		}
	};

	const handleSqftPopupClose = () => {
		if (!isProcessingPayment) {
			setShowSqftPopup(false);
			setSqftValue("");
			setSqftError("");
			setCurrentCardType("");
		}
	};

	if (!isOpen) return null;

	return (
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm bg-black/50">
				<div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-white shadow-2xl rounded-xl sm:rounded-2xl animate-fade-in">
					{/* Close Button */}
					<button
						onClick={onClose}
						className="absolute z-10 flex items-center justify-center w-6 h-6 transition-colors bg-gray-200 rounded-full sm:w-8 sm:h-8 top-2 right-2 sm:top-4 sm:right-4 hover:bg-gray-300"
					>
						<svg
							className="w-3 h-3 sm:w-5 sm:h-5"
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
					</button>

					{/* Modal Content */}
					<div className="p-4 sm:p-6 lg:p-8">
						{/* Header */}
						<div className="mb-6 text-center sm:mb-8">
							<div className="flex items-center justify-start mb-3 sm:mb-5">
								<Image
									src="/images/logo/logo-black.png"
									alt="HarmoniQ Logo"
									width={32}
									height={32}
									className="mr-2 sm:mr-3 sm:w-10 sm:h-10"
								/>
								<div
									className="text-2xl font-bold sm:text-3xl lg:text-4xl"
									style={{
										fontFamily: '"Noto Serif TC", serif',
										color: "black",
									}}
								>
									HarmoniQ
								</div>
							</div>
							<h2
								className="mb-3 text-2xl font-extrabold sm:mb-4 sm:text-3xl lg:text-4xl text-start"
								style={{
									fontFamily: '"Noto Serif TC", serif',
									color: "#374A37",
								}}
							>
								解鎖詳細報告
							</h2>
							<div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm sm:text-md text-[#333333]">
								<div className="flex items-center">
									<svg
										className="w-3 h-3 mr-1 text-green-500 sm:w-4 sm:h-4 sm:mr-2"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									深度優化全屋家居佈局
								</div>
								<div className="flex items-center">
									<svg
										className="w-3 h-3 mr-1 text-green-500 sm:w-4 sm:h-4 sm:mr-2"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									個人命掛分析
								</div>
								<div className="flex items-center">
									<svg
										className="w-3 h-3 mr-1 text-green-500 sm:w-4 sm:h-4 sm:mr-2"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									全屋分析報告
								</div>
							</div>
							<div className="flex flex-col sm:flex-row items-center justify-center mt-2 space-y-2 sm:space-y-0 sm:space-x-6 text-sm sm:text-md text-[#333333]">
								<div className="flex items-center">
									<svg
										className="w-3 h-3 mr-1 text-green-500 sm:w-4 sm:h-4 sm:mr-2"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									流年運程綜合分析
								</div>
								<div className="flex items-center">
									<svg
										className="w-3 h-3 mr-1 text-green-500 sm:w-4 sm:h-4 sm:mr-2"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									關鍵隱患化解
								</div>
								<div className="flex items-center">
									<svg
										className="w-3 h-3 mr-1 text-green-500 sm:w-4 sm:h-4 sm:mr-2"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
									流年預警總結
								</div>
							</div>
						</div>

						{/* Pricing Cards - Mobile responsive layout */}
						<div className="flex flex-col gap-4 mb-6 sm:gap-6 sm:mb-8">
							{/* Limited Time Offer Card - Top card */}
							<div className="relative p-4 sm:p-6 border-2 border-black bg-white rounded-xl sm:rounded-2xl hover:border-[#A3B116] hover:bg-[#F7FaF2] transition-all duration-300 group">
								<div className="absolute top-0 transform -translate-x-1/2 -translate-y-1/2 left-1/2">
									<span className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-full sm:px-4 sm:text-sm">
										{isUnlocked ? "已解鎖" : "限時優惠"}
									</span>
								</div>
								<div className="pt-3 sm:pt-4">
									<div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
										{/* Left side - Price and details */}
										<div className="flex-1 w-full lg:w-auto">
											<div className="mb-3 sm:mb-4">
												<div className="mb-2">
													<span
														className="text-base font-bold text-red-500 sm:text-lg"
														style={{
															fontFamily:
																'"Noto Serif TC", serif',
														}}
													>
														限時優惠
													</span>
												</div>
												<div className="flex flex-wrap items-baseline gap-2">
													<span
														className="text-3xl font-bold text-green-600 sm:text-4xl"
														style={{
															fontFamily:
																'"Noto Serif TC", serif',
														}}
													>
														$1
													</span>
													<span className="text-base text-gray-600 sm:text-lg">
														/平方尺
													</span>
													<span className="text-sm text-gray-500 line-through">
														$3.8
													</span>
												</div>
											</div>
											<div className="mb-3 text-xs text-gray-600 sm:mb-4 sm:text-sm">
												超值優惠價格，僅限Facebook分享後解鎖
											</div>
										</div>

										{/* Right side - Button or unlock section */}
										<div className="flex-1 w-full lg:max-w-sm">
											{isUnlocked ? (
												/* Unlocked state */
												<div className="space-y-3">
													<div className="text-center">
														<p className="mb-2 text-xs text-gray-600">
															已使用優惠碼解鎖
														</p>
														<div className="text-xs font-medium text-green-600">
															優惠碼已生效
														</div>
													</div>
													<button
														onClick={
															handlePremiumClick
														}
														disabled={
															isProcessingPayment
														}
														className="w-full px-6 py-3 font-bold text-white transition-colors bg-gray-400 rounded-full shadow-lg hover:bg-gray-500 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-[#A3B116] group-hover:hover:bg-[#8a9913]"
														style={{
															fontFamily:
																'"Noto Serif TC", serif',
														}}
													>
														{isProcessingPayment &&
														currentCardType ===
															"premium"
															? "處理中..."
															: "開始購買"}
													</button>
												</div>
											) : (
												/* Locked state */
												<div className="space-y-3">
													{!showPromoInput ? (
														/* Facebook share and promo code entry */
														<div className="space-y-3">
															{/* Facebook Share Button */}
															<button
																onClick={
																	handleFacebookShare
																}
																disabled={
																	sharing
																}
																className="w-full px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166fe5] transition-colors text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:transform-none flex items-center gap-2 justify-center"
																style={{
																	boxShadow:
																		"0 6px 20px rgba(24, 119, 242, 0.4)",
																	fontFamily:
																		'"Noto Serif TC", serif',
																}}
															>
																{/* Facebook Icon */}
																<svg
																	className="w-5 h-5"
																	fill="currentColor"
																	viewBox="0 0 24 24"
																>
																	<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
																</svg>
																{sharing
																	? "分享中..."
																	: "分享到 Facebook"}
															</button>

															{/* Promo Code Display */}
															{sharePromoCode && (
																<div className="flex flex-col items-center w-full">
																	<div
																		className="flex flex-col items-center w-full p-3 border-2 rounded-lg shadow-md"
																		style={{
																			borderColor:
																				"#096e56",
																			backgroundColor:
																				"rgba(9,110,86,0.08)",
																			fontFamily:
																				'"Noto Serif TC", serif',
																		}}
																	>
																		<div
																			className="mb-2 text-xs"
																			style={{
																				color: "#096e56",
																			}}
																		>
																			您的優惠碼
																		</div>
																		<div
																			className="mb-2 text-xl font-bold tracking-wider select-all"
																			style={{
																				color: "#096e56",
																			}}
																		>
																			{
																				sharePromoCode
																			}
																		</div>
																		<button
																			onClick={() =>
																				copyToClipboard(
																					sharePromoCode
																				)
																			}
																			className="px-3 py-1 text-xs font-medium bg-[#096e56] text-white rounded transition-colors shadow hover:bg-[#19ad6b] hover:shadow-lg"
																			style={{
																				fontFamily:
																					'"Noto Serif TC", serif',
																			}}
																		>
																			複製優惠碼
																		</button>
																		{copied && (
																			<div className="mt-1 text-xs font-semibold text-green-600 animate-fade-in">
																				已複製！
																			</div>
																		)}
																		<div
																			className="mt-2 text-xs text-center"
																			style={{
																				color: "#096e56",
																				opacity: 0.7,
																			}}
																		>
																			請在下方輸入優惠碼
																		</div>
																	</div>
																</div>
															)}

															{/* Have Promo Code Link */}
															<div className="text-center">
																<p className="mb-2 text-xs text-gray-600">
																	已有優惠碼？
																</p>
																<button
																	onClick={() =>
																		setShowPromoInput(
																			true
																		)
																	}
																	className="text-xs font-medium text-green-600 underline transition-colors hover:text-green-700"
																>
																	輸入優惠碼
																</button>
															</div>
														</div>
													) : (
														/* Promo Code Input */
														<div className="space-y-2">
															<input
																type="text"
																placeholder="輸入優惠碼..."
																value={
																	promoCode
																}
																onChange={(e) =>
																	setPromoCode(
																		e.target
																			.value
																	)
																}
																className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:outline-none"
																onKeyPress={(
																	e
																) =>
																	e.key ===
																		"Enter" &&
																	handlePromoSubmit()
																}
															/>
															{promoError && (
																<p className="text-xs text-center text-red-500">
																	{promoError}
																</p>
															)}
															<div className="flex gap-2">
																<button
																	onClick={
																		handlePromoSubmit
																	}
																	className="flex-1 px-4 py-2 text-sm text-white transition-colors bg-green-500 rounded-lg shadow-sm hover:bg-green-600 hover:shadow-md"
																>
																	確認
																</button>
																<button
																	onClick={() => {
																		setShowPromoInput(
																			false
																		);
																		setPromoCode(
																			""
																		);
																		setPromoError(
																			""
																		);
																	}}
																	className="flex-1 px-4 py-2 text-sm text-white transition-colors bg-gray-500 rounded-lg shadow-sm hover:bg-gray-600 hover:shadow-md"
																>
																	取消
																</button>
															</div>
														</div>
													)}

													{/* Locked button */}
													<button
														className="w-full cursor-not-allowed px-6 py-3 font-bold text-white bg-gray-400 rounded-full shadow-lg opacity-75 group-hover:bg-[#A3B116] group-hover:opacity-100"
														disabled
														style={{
															fontFamily:
																'"Noto Serif TC", serif',
														}}
													>
														🔒 請先解鎖
													</button>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Premium Version Card - Bottom card */}
							<div className="p-4 sm:p-6 border-2 border-black bg-white rounded-xl sm:rounded-2xl hover:border-[#A3B116] hover:bg-[#F7FaF2] transition-all duration-300 group">
								<div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
									{/* Left side - Price and details */}
									<div className="flex-1 w-full lg:w-auto">
										<div className="mb-3 sm:mb-4">
											<span
												className="block mb-2 text-base font-bold text-gray-400 sm:text-lg"
												style={{
													fontFamily:
														'"Noto Serif TC", serif',
												}}
											>
												尊享版
											</span>
											<div className="flex flex-wrap items-baseline gap-2">
												<span
													className="text-3xl font-bold text-gray-800 sm:text-4xl"
													style={{
														fontFamily:
															'"Noto Serif TC", serif',
													}}
												>
													$3.8
												</span>
												<span className="text-base text-gray-600 sm:text-lg">
													/平方尺
												</span>
											</div>
										</div>
										<div className="mb-3 text-xs text-gray-600 sm:mb-4 sm:text-sm">
											原價購買，無需分享或優惠碼
										</div>
									</div>

									{/* Right side - Button */}
									<div className="flex-1 w-full lg:max-w-sm">
										<button
											onClick={handleSubscriptionClick}
											disabled={isProcessingPayment}
											className="w-full px-4 sm:px-6 py-3 font-bold text-gray-800 transition-colors bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-[#A3B116] group-hover:text-white group-hover:hover:bg-[#8a9913] text-sm sm:text-base"
											style={{
												fontFamily:
													'"Noto Serif TC", serif',
											}}
										>
											{isProcessingPayment &&
											currentCardType === "subscription"
												? "處理中..."
												: "原價購買"}
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Trust Indicators - Mobile responsive grid */}
						<div className="grid grid-cols-2 gap-3 pt-4 border-t border-black sm:grid-cols-4 sm:gap-4 sm:pt-6">
							<div className="flex items-center gap-2">
								<Image
									src="/images/hero/feature1.png"
									alt="User Certification"
									width={54}
									height={54}
									className="flex-shrink-0 w-10 h-10 sm:w-[54px] sm:h-[54px]"
								/>
								<div className="flex flex-col">
									<div className="text-sm sm:text-lg font-bold text-[#A3B116]">
										10,000+
									</div>
									<div className="text-xs text-black">
										真實用戶認證
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Image
									src="/images/hero/feature2.png"
									alt="Customer Service"
									width={54}
									height={54}
									className="flex-shrink-0 w-10 h-10 sm:w-[54px] sm:h-[54px]"
								/>
								<div className="flex flex-col">
									<div className="text-sm sm:text-lg font-bold text-[#A3B116]">
										24/7
									</div>
									<div className="text-xs text-black">
										客戶專業服務
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Image
									src="/images/hero/feature3.png"
									alt="Satisfaction Guarantee"
									width={54}
									height={54}
									className="flex-shrink-0 w-10 h-10 sm:w-[54px] sm:h-[54px]"
								/>
								<div className="flex flex-col">
									<div className="text-sm sm:text-lg font-bold text-[#A3B116]">
										100%
									</div>
									<div className="text-xs text-black">
										滿意度保證
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Image
									src="/images/hero/feature4.png"
									alt="Discount Offer"
									width={54}
									height={54}
									className="flex-shrink-0 w-10 h-10 sm:w-[54px] sm:h-[54px]"
								/>
								<div className="flex flex-col">
									<div className="text-sm sm:text-lg font-bold text-[#A3B116]">
										10%
									</div>
									<div className="text-xs text-black">
										原價一折優惠
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Square Feet Input Popup - Mobile responsive */}
					{showSqftPopup && (
						<div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-60 backdrop-blur-sm bg-black/20">
							<div className="relative w-full max-w-md p-4 bg-white shadow-2xl sm:p-8 rounded-xl sm:rounded-2xl animate-fade-in">
								<div className="text-center">
									{/* Icon */}
									<div className="mb-4 text-4xl sm:mb-6 sm:text-5xl">
										🏠
									</div>

									{/* Title */}
									<h3 className="mb-3 text-lg font-bold text-gray-800 sm:mb-4 sm:text-xl">
										輸入房屋面積
									</h3>

									{/* Description */}
									<p className="mb-4 text-xs leading-relaxed text-gray-600 sm:mb-6 sm:text-sm">
										請輸入您的房屋總面積以計算準確的費用
										<br />
										<span className="font-medium text-red-600">
											最少需要380平方尺
										</span>
									</p>

									{/* Input */}
									<div className="mb-4 sm:mb-6">
										<label className="block mb-2 text-sm font-medium text-left text-gray-700">
											房屋面積（平方尺）
										</label>
										<input
											type="number"
											value={sqftValue}
											onChange={(e) =>
												setSqftValue(e.target.value)
											}
											placeholder="輸入面積..."
											className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg text-center text-base sm:text-lg focus:border-[#A3B116] focus:outline-none transition-colors"
											min="380"
											step="1"
											disabled={isProcessingPayment}
										/>
										{sqftError && (
											<p className="mt-2 text-sm text-center text-red-500">
												{sqftError}
											</p>
										)}
									</div>

									{/* Buttons - Mobile stacked */}
									<div className="flex flex-col gap-3 sm:flex-row">
										<button
											onClick={handleSqftSubmit}
											disabled={isProcessingPayment}
											className="flex-1 px-4 sm:px-6 py-2 sm:py-3 font-medium text-white transition-all duration-200 bg-[#A3B116] rounded-lg hover:bg-[#8a9913] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
										>
											{isProcessingPayment
												? "處理中..."
												: "立即購買"}
										</button>
										<button
											onClick={handleSqftPopupClose}
											disabled={isProcessingPayment}
											className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg sm:px-6 sm:py-3 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed sm:text-base"
										>
											取消
										</button>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Facebook Share Confirmation Modal - Mobile responsive */}
					{showShareConfirm && (
						<div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-70 backdrop-blur-sm bg-white/30">
							<div className="relative max-w-md p-4 bg-white shadow-2xl sm:p-6 rounded-xl sm:rounded-2xl">
								<div className="text-center">
									<div className="mb-3 text-3xl sm:mb-4 sm:text-4xl">
										🤔
									</div>
									<h3 className="mb-2 text-base font-bold text-gray-800 sm:mb-3 sm:text-lg">
										確認分享狀態
									</h3>
									<p className="mb-4 text-xs leading-relaxed text-gray-600 whitespace-pre-line sm:mb-6 sm:text-sm">
										您已經分享HarmoniQ到Facebook了嗎？{"\n"}
										分享成功後我們會為您提供專屬優惠碼！
									</p>
									<div className="flex flex-col gap-3 sm:flex-row">
										<button
											onClick={() =>
												handleShareConfirm(true)
											}
											className="flex-1 px-3 py-2 text-sm font-medium text-white transition-colors bg-green-500 rounded-lg shadow-md sm:px-4 hover:bg-green-600 hover:shadow-lg sm:text-base"
											style={{
												fontFamily:
													'"Noto Serif TC", serif',
											}}
										>
											是的，已分享
										</button>
										<button
											onClick={() =>
												handleShareConfirm(false)
											}
											className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-lg sm:px-4 hover:bg-gray-300 sm:text-base"
											style={{
												fontFamily:
													'"Noto Serif TC", serif',
											}}
										>
											取消
										</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Add CSS for animation */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    .animate-fade-in {
                        animation: fadeIn 0.3s ease-out;
                    }
                `,
				}}
			/>
		</>
	);
}
