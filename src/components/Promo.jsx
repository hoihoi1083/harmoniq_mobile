import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Promo() {
	const t = useTranslations("promo");

	return (
		<div
			className="
                w-full
                flex flex-col lg:flex-row
                items-center lg:items-center
                justify-center lg:justify-between
                bg-[#f5faf7]
                px-4 py-6
                sm:px-6 sm:py-8
                md:px-8 md:py-10
                lg:px-12 lg:py-12
                xl:px-16 xl:py-16
                2xl:px-20 2xl:py-20
                gap-6 lg:gap-12 xl:gap-16
            "
			style={{
				fontFamily: '"Noto Serif TC", serif',
			}}
		>
			{/* Left Content Section */}
			<section className="flex flex-col items-center justify-center flex-1 max-w-3xl text-center lg:items-start lg:text-left">
				<div className="flex flex-col items-center justify-center w-full gap-3 lg:items-start sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7">
					{/* Title and Description */}
					<div className="flex flex-col items-center justify-start w-full gap-2 lg:items-start sm:gap-3 md:gap-4 lg:gap-5">
						<div className="flex flex-col items-center justify-start w-full gap-1 lg:items-start sm:gap-2 md:gap-3 lg:gap-4">
							<h1
								className="relative max-w-full m-0"
								style={{
									fontFamily: '"Noto Serif TC", serif',
									fontWeight: 800,
									fontSize: "48px",
									color: "#374A37",
									lineHeight: "1.1",
									textAlign: "left",
								}}
							>
								{t("title")}
							</h1>
							<h2
								className="relative max-w-3xl m-0"
								style={{
									fontFamily: '"Noto Sans HK", sans-serif',
									fontWeight: 300,
									fontSize: "24px",
									color: "#000",
									lineHeight: "1.4",
									fontStyle: "normal",
									textAlign: "left",
								}}
							>
								{t("description1")}
							</h2>
							<h2
								className="relative max-w-3xl m-0"
								style={{
									fontFamily: '"Noto Sans HK", sans-serif',
									fontWeight: 300,
									fontSize: "24px",
									color: "#000",
									lineHeight: "1.4",
									fontStyle: "normal",
									textAlign: "left",
								}}
							>
								{t("description2")}
							</h2>
						</div>
					</div>
				</div>
			</section>

			{/* Right Button Section */}
			<div className="flex flex-col items-center justify-center flex-shrink-0 lg:items-end">
				<Link
					href="/price"
					className="w-[296px] h-[133px] flex items-center justify-center"
				>
					<button
						className="cursor-pointer border-none p-0 bg-transparent w-[296px] h-[133px] flex items-center justify-center"
						style={{
							borderRadius: "30px",
							background: "#A3B116",
							boxShadow: "3px 6px 9px rgba(0,0,0,0.25)",
							filter: "none",
						}}
					>
						<span
							style={{
								fontFamily: '"Noto Serif TC", serif',
								fontWeight: 800,
								fontSize: "32px",
								color: "#fff",
								textAlign: "center",
								letterSpacing: "0.02em",
							}}
						>
							{t("button")}
						</span>
					</button>
				</Link>
			</div>
		</div>
	);
}
