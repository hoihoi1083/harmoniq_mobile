import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PricePromo() {
	const t = useTranslations("pricePromo");

	return (
		<div className="w-full flex justify-center items-center pt-4 sm:pt-4 lg:pt-[20px] mb-10 px-4 sm:px-8 box-border relative">
			<div
				className="flex flex-col items-center justify-start gap-8 sm:gap-12 lg:gap-[70px]"
				style={{
					width: "100%",
					background: "#374A37",
					borderRadius: "60px",
					boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
					padding: "48px 24px",
					color: "#fff",
				}}
			>
				{/* Header Section */}
				<section className="w-full flex flex-col items-center justify-center z-[unset] mx-auto px-2 pt-10">
					<div className="flex flex-col items-center justify-center w-full gap-4 sm:gap-6 lg:gap-8">
						<h2
							className="relative self-stretch m-0"
							style={{
								fontFamily: '"Noto Serif TC", serif',
								fontWeight: 800,
								fontSize: "48px",
								color: "#fff",
								lineHeight: "1.1",
								textAlign: "center",
							}}
						>
							{t("title")}
						</h2>
						<div
							className="relative self-stretch pt-5"
							style={{
								fontFamily: '"Noto Sans HK", sans-serif',
								fontWeight: 400,
								fontSize: "16px",
								color: "#fff",
								lineHeight: "1.6",
								textAlign: "center",
							}}
						>
							{t("desc")}
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className="w-full max-w-full flex flex-col items-start justify-center gap-8 z-[unset] text-left mx-auto px-2 sm:px-0 sm:flex-row sm:items-start sm:justify-center lg:flex-row lg:items-start lg:justify-center lg:gap-5">
					<div className="box-border flex flex-col items-start justify-center w-full max-w-full mx-auto sm:flex-row sm:items-start sm:justify-center">
						<div className="w-full max-w-full flex flex-col gap-8 items-start justify-center sm:flex-row sm:gap-6 sm:items-stretch sm:justify-center md:gap-12 lg:gap-[250px] mx-auto">
							{/* Feature 1 */}
							<div className="flex-1 min-w-0 sm:min-w-[220px] md:min-w-[250px] lg:min-w-[300px] max-w-[320px] flex flex-col items-start sm:items-start justify-start mb-8 sm:mb-0">
								<div className="flex flex-col items-start justify-start w-full h-full gap-4 sm:gap-5">
									<div className="w-[54px] relative h-[54px] overflow-hidden shrink-0">
										<Image
											className="absolute top-[1px] left-[0px] w-[54.5px] h-[52px] object-cover"
											loading="lazy"
											width={54.5}
											height={52}
											sizes="100vw"
											alt=""
											src="/images/hero/feature1.png"
										/>
									</div>
									<div className="flex flex-col items-start justify-start w-full gap-2">
										<h3
											className="relative m-0 text-left"
											style={{
												fontFamily:
													'"ABeeZee", sans-serif',
												fontWeight: 400,
												fontSize: "24px",
												color: "#fff",
												lineHeight: "1.3",
											}}
										>
											{t("feature1.title")}
										</h3>
										<div
											className="relative text-left w-full max-w-[320px]"
											style={{
												fontFamily:
													'"ABeeZee", sans-serif',
												fontWeight: 400,
												fontSize: "16px",
												color: "#fff",
												lineHeight: "1.6",
											}}
										>
											{t("feature1.desc")}
										</div>
									</div>
								</div>
							</div>
							{/* Feature 2 */}
							<div className="flex-1 min-w-0 sm:min-w-[220px] md:min-w-[250px] lg:min-w-[300px] max-w-[320px] flex flex-col items-start sm:items-start justify-start mb-8 sm:mb-0">
								<div className="flex flex-col items-start justify-start w-full h-full gap-4 sm:gap-5">
									<Image
										className="w-[54px] h-[54px] relative overflow-hidden shrink-0 object-contain"
										loading="lazy"
										width={54}
										height={54}
										sizes="100vw"
										alt=""
										src="/images/hero/feature2.png"
									/>
									<div className="flex flex-col items-start justify-start w-full gap-2">
										<h3
											className="relative m-0 text-left"
											style={{
												fontFamily:
													'"ABeeZee", sans-serif',
												fontWeight: 400,
												fontSize: "24px",
												color: "#fff",
												lineHeight: "1.3",
											}}
										>
											{t("feature2.title")}
										</h3>
										<div
											className="relative text-left w-full max-w-[320px]"
											style={{
												fontFamily:
													'"ABeeZee", sans-serif',
												fontWeight: 400,
												fontSize: "16px",
												color: "#fff",
												lineHeight: "1.6",
											}}
										>
											{t("feature2.desc")}
										</div>
									</div>
								</div>
							</div>
							{/* Feature 3 */}
							<div className="flex-1 min-w-0 sm:min-w-[220px] md:min-w-[250px] lg:min-w-[300px] max-w-[320px] flex flex-col items-start sm:items-start justify-start">
								<div className="flex flex-col items-start justify-start w-full h-full gap-4 sm:gap-5">
									<Image
										className="w-[54px] h-[54px] relative overflow-hidden shrink-0 object-cover"
										loading="lazy"
										width={54}
										height={54}
										sizes="100vw"
										alt=""
										src="/images/hero/feature4.png"
									/>
									<div className="flex flex-col items-start justify-start w-full gap-2">
										<h3
											className="relative m-0 text-left"
											style={{
												fontFamily:
													'"ABeeZee", sans-serif',
												fontWeight: 400,
												fontSize: "24px",
												color: "#fff",
												lineHeight: "1.3",
											}}
										>
											{t("feature3.title")}
										</h3>
										<div
											className="relative text-left w-full max-w-[320px]"
											style={{
												fontFamily:
													'"ABeeZee", sans-serif',
												fontWeight: 400,
												fontSize: "16px",
												color: "#fff",
												lineHeight: "1.6",
											}}
										>
											{t("feature3.desc")}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				{/* Button Section */}
				<div className="flex justify-center w-full mt-1">
					<a
						href="/price"
						className="flex items-center justify-center"
						style={{
							width: "280px",
							height: "82px",
							borderRadius: "100px",
							background: "#A3B116",
							color: "#000",
							fontSize: "32px",
							fontWeight: 800,
							fontFamily: '"Noto Serif TC", serif',
							textDecoration: "none",
							boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
						}}
					>
						立即獲取
					</a>
				</div>
			</div>
		</div>
	);
}
