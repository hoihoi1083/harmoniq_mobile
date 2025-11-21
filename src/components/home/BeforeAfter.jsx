"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

export default function BeforeAfter() {
	const t = useTranslations("home.compare");
	return (
		<section
			className="relative py-8 overflow-hidden sm:py-12 md:py-16 lg:py-20 xl:pb-30 xl:pt-30 bg-secondary"
			style={{ fontFamily: "Noto Serif TC, serif" }}
		>
			{/* Responsive background image */}
			<img
				src="/images/hero/5-2@2x.png"
				alt=""
				className="absolute top-0 object-contain w-32 sm:w-48 md:w-64 lg:w-80 xl:w-[400px] right-0 sm:right-2 md:right-4 lg:right-8 xl:right-[-50px] opacity-30 sm:opacity-50 md:opacity-70 lg:opacity-100"
			/>
			<div className="container px-4 mx-auto sm:px-6 md:px-8">
				<div className="flex flex-col items-center max-w-6xl gap-8 mx-auto sm:gap-10 md:gap-12 lg:flex-row lg:gap-16 xl:gap-24">
					{/* Text Content */}
					<div className="flex flex-col items-center flex-grow gap-4 sm:gap-5 md:gap-6 lg:items-start">
						<h3
							className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-4xl xl:text-5xl font-bold text-center lg:text-left text-hero"
							style={{ fontFamily: "Noto Serif TC, serif" }}
						>
							{t("title")}
						</h3>
						<p
							className="text-center text-secondary-foreground text-sm sm:text-base md:text-lg lg:text-xl lg:text-left max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-90"
							style={{ fontFamily: "Noto Serif TC, serif" }}
						>
							{t("description")}
						</p>
						{/* Button with original color */}
						<Link
							href="/price"
							className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3 md:px-10 md:py-3 font-bold text-white transition-all duration-200 rounded-[20px] shadow-[0_8px_32px_0_rgba(0,0,0,0.35)] cursor-pointer mt-4 sm:mt-6 md:mt-8 lg:mt-9 bg-button-primary text-base sm:text-lg md:text-xl lg:text-2xl transform hover:-translate-y-1 hover:shadow-[0_12px_40px_0_rgba(0,0,0,0.45)]"
							style={{ fontFamily: "Noto Serif TC, serif" }}
						>
							{t("cta")}
						</Link>
					</div>

					{/* Slider Container */}
					<div className="relative flex justify-center lg:justify-start">
						<div
							className="inline-block mx-4 overflow-hidden rounded-lg sm:mx-6 md:mx-8 lg:mx-0"
							style={{
								background: "#f3f4f6",
								boxShadow:
									"0 4px 8px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.25)",
							}}
						>
							<BeforeAfterSlider
								beforeImg="/images/after2.png" // modern bright room
								afterImg="/images/before.png" // old dark room
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
