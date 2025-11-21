"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CommentsImageCarousel from "@/components/ui/emblaCarousel";
import { useResponsiveScale } from "../../hooks/useResponsiveScale";

export default function Comments() {
	const t = useTranslations("home.comments");
	const { scaleRatio, isMobileLayout } = useResponsiveScale();

	if (isMobileLayout) {
		// Mobile layout - fully responsive, no overlapping
		return (
			<section
				className="w-full px-4 py-6 bg-transparent sm:px-6 sm:py-8"
				style={{ fontFamily: "Noto Serif TC, serif" }}
			>
				{/* Mobile Comments Container */}
				<div className="w-full mx-auto" style={{ maxWidth: "100%" }}>
					{/* Mobile Carousel Container - responsive sizing */}
					<div
						className="w-full mx-auto overflow-hidden rounded-lg"
						style={{
							maxWidth: "min(90vw, 400px)", // Responsive max width
							aspectRatio: "4/5", // Maintain aspect ratio
							minHeight: "300px",
							maxHeight: "350px",
						}}
					>
						<CommentsImageCarousel />
					</div>
				</div>
			</section>
		);
	}

	// Desktop layout - original with scaling
	return (
		<section
			className="relative py-6 pb-6 overflow-visible bg-transparent "
			style={{ fontFamily: "Noto Serif TC, serif" }}
		>
			<div className="w-full px-4 overflow-visible lg:px-4">
				<div className="flex justify-end w-full overflow-visible">
					{/* Desktop Carousel Container - original dimensions, scaled by parent */}
					<div
						className="flex justify-start overflow-visible"
						style={{
							width: "650px", // Original MacBook Air 13" dimensions
							height: "1110px",
						}}
					>
						<CommentsImageCarousel />
					</div>
				</div>
			</div>
		</section>
	);
}
