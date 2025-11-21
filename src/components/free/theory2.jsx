"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useResponsiveScale } from "../../hooks/useResponsiveScale";

export default function Theory2() {
	const t = useTranslations("theory");
	const { isMobileLayout } = useResponsiveScale();

	return (
		<section
			className="flex items-center justify-center"
			style={{
				position: "relative",
				width: "100%",
				height: isMobileLayout ? "auto" : "855px",
				background: "#EFEFEF",
				padding: isMobileLayout ? "40px 20px" : "0",
			}}
		>
			{/* Main content container */}
			<div
				className="relative flex flex-col items-center justify-center"
				style={{
					width: isMobileLayout ? "100%" : "1487px",
					height: isMobileLayout ? "auto" : "855px",
					background: "#EFEFEF",
					backdropFilter: isMobileLayout ? "none" : "blur(10px)",
					WebkitBackdropFilter: isMobileLayout
						? "none"
						: "blur(10px)",
					borderRadius: isMobileLayout ? "20px" : "40px 0 0 40px",
					overflow: "hidden",
					padding: isMobileLayout ? "30px 20px" : "0",
				}}
			>
				{/* Title and Description Row */}
				<div
					className={`flex w-full ${
						isMobileLayout
							? "flex-col gap-6"
							: "flex-row px-20 pb-10"
					}`}
				>
					{/* Title */}
					<div
						className={`flex flex-col items-start ${
							isMobileLayout ? "w-full text-center" : ""
						}`}
						style={{ width: isMobileLayout ? "100%" : "35%" }}
					>
						<h2
							style={{
								fontFamily: "Noto Serif TC, serif",
								fontWeight: 900,
								fontSize: isMobileLayout ? "32px" : "48px",
								color: "#374A37",
								fontStyle: "normal",
								letterSpacing: "0.03em",
								lineHeight: "1.2",
								textAlign: isMobileLayout ? "center" : "left",
							}}
						>
							{t("title1")}
						</h2>
						<h2
							style={{
								fontFamily: "Noto Serif TC, serif",
								fontWeight: 900,
								fontSize: isMobileLayout ? "32px" : "48px",
								color: "#374A37",
								fontStyle: "normal",
								letterSpacing: "0.03em",
								lineHeight: "1.2",
								textAlign: isMobileLayout ? "center" : "left",
							}}
						>
							{t("title2")}
						</h2>
					</div>

					{/* Description */}
					<div
						className={`flex flex-col items-start ${
							isMobileLayout ? "w-full" : "ml-10"
						}`}
						style={{ width: isMobileLayout ? "100%" : "65%" }}
					>
						<div
							style={{
								width: isMobileLayout ? "100%" : "390px",
								height: "auto",
								display: "flex",
								flexDirection: "column",
								justifyContent: "flex-start",
							}}
						>
							<p
								style={{
									fontFamily: "ABeeZee, sans-serif",
									fontWeight: 400,
									fontSize: isMobileLayout ? "16px" : "20px",
									color: "#374A37",
									fontStyle: "normal",
									textAlign: isMobileLayout
										? "center"
										: "left",
									lineHeight: "1.5",
								}}
							>
								{t("description")}
							</p>
						</div>

						{/* Line under description */}
						<div
							style={{
								width: isMobileLayout ? "100%" : "983px",
								height: "2px",
								backgroundColor: "#888365",
								marginTop: "16px",
								alignSelf: isMobileLayout
									? "center"
									: "flex-start",
							}}
						></div>
					</div>
				</div>

				{/* Cards Section */}
				<section
					className={`flex items-stretch justify-center w-full text-left ${
						isMobileLayout
							? "grid grid-cols-2 gap-3 px-0 mt-8"
							: "flex-row gap-4 px-16 md:gap-8"
					}`}
					style={{ position: "relative", zIndex: 1 }}
				>
					{/* Card 1 */}
					<div
						className={`rounded-[10px] box-border flex flex-col items-center justify-center ${
							isMobileLayout
								? "p-3"
								: "p-4 sm:p-6 w-full md:w-72 mb-4 md:mb-0"
						}`}
						style={{
							background: "#F5F5F5",
							border: "1px solid #25826c",
						}}
					>
						<div
							className={`flex flex-col items-start justify-start ${
								isMobileLayout
									? "w-full h-auto gap-2"
									: "w-full md:w-60 h-[170px] sm:h-[180px] md:h-[211px] gap-4 sm:gap-[11px]"
							}`}
						>
							<div
								className={`w-full flex flex-col items-start justify-start ${
									isMobileLayout
										? "gap-2"
										: "md:w-[231px] gap-4 sm:gap-6"
								}`}
							>
								<div
									style={{
										background: "#E8E2DA",
										borderRadius: "8px",
										padding: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: isMobileLayout ? "32px" : "40px",
										height: isMobileLayout
											? "32px"
											: "40px",
									}}
								>
									<Image
										className={`object-contain ${
											isMobileLayout
												? "w-6 h-6"
												: "w-8 h-8 sm:w-10 sm:h-[40.9px]"
										}`}
										loading="lazy"
										width={isMobileLayout ? 24 : 40}
										height={isMobileLayout ? 24 : 40.9}
										sizes="100vw"
										alt=""
										src="/images/report/theory-1.png"
									/>
								</div>
								<div className="flex flex-row items-center justify-center">
									<h3
										style={{
											fontFamily: "DM Sans, sans-serif",
											fontWeight: 600,
											fontSize: isMobileLayout
												? "16px"
												: "24px",
											color: "#374A37",
											margin: 0,
											lineHeight: "1.3",
										}}
									>
										{t("cards.imageRecognition.title")}
									</h3>
								</div>
							</div>
							<div
								style={{
									fontFamily: "Noto Sans HK, sans-serif",
									fontWeight: 400,
									fontSize: isMobileLayout ? "12px" : "13px",
									color: "#374A37",
									marginTop: isMobileLayout ? "4px" : "8px",
									lineHeight: "1.4",
								}}
							>
								{t("cards.imageRecognition.description")}
							</div>
						</div>
					</div>

					{/* Card 2 */}
					<div
						className={`rounded-[10px] box-border flex flex-col items-center justify-center ${
							isMobileLayout
								? "p-3"
								: "p-4 sm:p-6 w-full md:w-72 mb-4 md:mb-0"
						}`}
						style={{
							background: "#F5F5F5",
							border: "1px solid #25826c",
						}}
					>
						<div
							className={`flex flex-col items-start justify-start ${
								isMobileLayout
									? "w-full h-auto gap-2"
									: "w-full md:w-60 h-[170px] sm:h-[180px] md:h-[211px] gap-4 sm:gap-[11px]"
							}`}
						>
							<div
								className={`w-full flex flex-col items-start justify-start ${
									isMobileLayout
										? "gap-2"
										: "md:w-[231px] gap-4 sm:gap-6"
								}`}
							>
								<div
									style={{
										background: "#E8E2DA",
										borderRadius: "8px",
										padding: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: isMobileLayout ? "32px" : "40px",
										height: isMobileLayout
											? "32px"
											: "40px",
									}}
								>
									<Image
										className={`object-contain ${
											isMobileLayout
												? "w-6 h-6"
												: "w-8 h-8 sm:w-10 sm:h-[40.9px]"
										}`}
										loading="lazy"
										width={isMobileLayout ? 24 : 40}
										height={isMobileLayout ? 24 : 40.9}
										sizes="100vw"
										alt=""
										src="/images/report/theory-2.png"
									/>
								</div>
								<div className="flex flex-row items-center justify-center">
									<h3
										style={{
											fontFamily: "DM Sans, sans-serif",
											fontWeight: 600,
											fontSize: isMobileLayout
												? "16px"
												: "24px",
											color: "#374A37",
											margin: 0,
											lineHeight: "1.3",
										}}
									>
										{t("cards.knowledgeBase.title")}
									</h3>
								</div>
							</div>
							<div
								style={{
									fontFamily: "Noto Sans HK, sans-serif",
									fontWeight: 400,
									fontSize: isMobileLayout ? "12px" : "13px",
									color: "#374A37",
									marginTop: isMobileLayout ? "4px" : "8px",
									lineHeight: "1.4",
								}}
							>
								{t("cards.knowledgeBase.description")}
							</div>
						</div>
					</div>

					{/* Card 3 */}
					<div
						className={`rounded-[10px] box-border flex flex-col items-center justify-center ${
							isMobileLayout
								? "p-3"
								: "p-4 sm:p-6 w-full md:w-72 mb-4 md:mb-0"
						}`}
						style={{
							background: "#F5F5F5",
							border: "1px solid #25826c",
						}}
					>
						<div
							className={`flex flex-col items-start justify-start ${
								isMobileLayout
									? "w-full h-auto gap-2"
									: "w-full md:w-60 h-[170px] sm:h-[180px] md:h-[211px] gap-4 sm:gap-[11px]"
							}`}
						>
							<div
								className={`w-full flex flex-col items-start justify-start ${
									isMobileLayout
										? "gap-2"
										: "md:w-[231px] gap-4 sm:gap-6"
								}`}
							>
								<div
									style={{
										background: "#E8E2DA",
										borderRadius: "8px",
										padding: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: isMobileLayout ? "32px" : "40px",
										height: isMobileLayout
											? "32px"
											: "40px",
									}}
								>
									<Image
										className={`object-contain ${
											isMobileLayout
												? "w-6 h-6"
												: "w-8 h-8 sm:w-10 sm:h-[40.9px]"
										}`}
										loading="lazy"
										width={isMobileLayout ? 24 : 40}
										height={isMobileLayout ? 24 : 40.9}
										sizes="100vw"
										alt=""
										src="/images/report/theory-3.png"
									/>
								</div>
								<div className="flex flex-row items-center justify-center">
									<h3
										style={{
											fontFamily: "DM Sans, sans-serif",
											fontWeight: 600,
											fontSize: isMobileLayout
												? "16px"
												: "24px",
											color: "#374A37",
											margin: 0,
											lineHeight: "1.3",
										}}
									>
										{t("cards.energyFlow.title")}
									</h3>
								</div>
							</div>
							<div
								style={{
									fontFamily: "Noto Sans HK, sans-serif",
									fontWeight: 400,
									fontSize: isMobileLayout ? "12px" : "13px",
									color: "#374A37",
									marginTop: isMobileLayout ? "4px" : "8px",
									lineHeight: "1.4",
								}}
							>
								{t("cards.energyFlow.description")}
							</div>
						</div>
					</div>

					{/* Card 4 */}
					<div
						className={`rounded-[10px] box-border flex flex-col items-center justify-center ${
							isMobileLayout ? "p-3" : "p-4 sm:p-6 w-full md:w-72"
						}`}
						style={{
							background: "#F5F5F5",
							border: "1px solid #25826c",
						}}
					>
						<div
							className={`flex flex-col items-start justify-start ${
								isMobileLayout
									? "w-full h-auto gap-2"
									: "w-full md:w-60 h-[170px] sm:h-[180px] md:h-[209px] gap-4 sm:gap-[11px]"
							}`}
						>
							<div
								className={`w-full flex flex-col items-start justify-start ${
									isMobileLayout
										? "gap-2"
										: "md:w-[231px] gap-4 sm:gap-6"
								}`}
							>
								<div
									style={{
										background: "#E8E2DA",
										borderRadius: "8px",
										padding: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: isMobileLayout ? "32px" : "40px",
										height: isMobileLayout
											? "32px"
											: "40px",
									}}
								>
									<Image
										className={`object-contain ${
											isMobileLayout
												? "w-6 h-6"
												: "w-8 h-8 sm:w-10 sm:h-[40.9px]"
										}`}
										loading="lazy"
										width={isMobileLayout ? 24 : 40}
										height={isMobileLayout ? 24 : 40.9}
										sizes="100vw"
										alt=""
										src="/images/report/theory-4.png"
									/>
								</div>
								<div className="flex flex-row items-center justify-center">
									<h3
										style={{
											fontFamily: "DM Sans, sans-serif",
											fontWeight: 600,
											fontSize: isMobileLayout
												? "16px"
												: "24px",
											color: "#374A37",
											margin: 0,
											lineHeight: "1.3",
										}}
									>
										{t("cards.personalizedAdvice.title")}
									</h3>
								</div>
							</div>
							<div
								style={{
									fontFamily: "Noto Sans HK, sans-serif",
									fontWeight: 400,
									fontSize: isMobileLayout ? "12px" : "13px",
									color: "#374A37",
									marginTop: isMobileLayout ? "4px" : "8px",
									lineHeight: "1.4",
								}}
							>
								{t("cards.personalizedAdvice.description")}
							</div>
						</div>
					</div>
				</section>
			</div>
		</section>
	);
}
