"use client";
import React from "react";
import {
	DotButton,
	useDotButton,
	CarouselControls,
} from "./EmblaCarouselDotButton";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "@/lib/embla-carousel-autoplay/src";

const EmblaCarousel = (props) => {
	const { slides, options } = props;
	const [emblaRef, emblaApi] = useEmblaCarousel(options, [
		Autoplay({ playOnInit: true, delay: 6000 }),
	]);
	const {
		selectedIndex,
		scrollSnaps,
		onDotButtonClick,
		onPrevButtonClick,
		onNextButtonClick,
	} = useDotButton(emblaApi);

	return (
		<section
			className="relative flex flex-row items-center h-full"
			style={{ width: "668px", height: "1110px" }}
		>
			{/* Carousel on the left */}
			<div
				className="embla__viewport"
				ref={emblaRef}
				style={{ width: "700px", height: "1110px" }}
			>
				<div className="embla__container">
					{slides.map((item, index) => (
						<div
							className="embla__slide"
							key={index}
							style={{
								flex: "0 0 100%",
								minWidth: 0,
							}}
						>
							{item}
						</div>
					))}
				</div>
			</div>

			{/* Carousel controls positioned to the right and higher */}
			<div className="absolute z-30 flex flex-col]">
				<CarouselControls
					selectedIndex={selectedIndex}
					scrollSnaps={scrollSnaps}
					onDotButtonClick={onDotButtonClick}
					onPrevButtonClick={onPrevButtonClick}
					onNextButtonClick={onNextButtonClick}
				/>
			</div>
		</section>
	);
};

export default EmblaCarousel;
