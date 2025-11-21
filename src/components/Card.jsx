"use client";
import { useMemo } from "react";
import Image from "next/image";
import PropTypes from "prop-types";

const Card = ({ className = "", cardWidth, divTop, pict, title, subtitle }) => {
	const cardStyle = useMemo(() => {
		return {
			width: cardWidth,
			fontFamily: "Noto Serif TC, serif",
		};
	}, [cardWidth]);

	const divStyle = useMemo(() => {
		return {
			top: divTop,
			fontFamily: "Noto Serif TC, serif",
		};
	}, [divTop]);

	return (
		<div
			className={`
                h-[185px] sm:h-[200px] lg:h-[268px] 
                w-full
                rounded-[12px] sm:rounded-[14px] lg:rounded-[16px] 
                bg-transparent flex flex-col items-center justify-center 
                pt-[8px] px-2 pb-[12px] box-border relative text-center 
                text-[14px] sm:text-[18px] lg:text-[22px] 
                text-[#1d1d1d]
                ${className}
            `}
			style={cardStyle}
		>
			<Image
				className="
                    h-[150px] w-[150px] sm:h-[180px] sm:w-[180px] lg:h-[208px] lg:w-[208px]
                    rounded-[8px] sm:rounded-[10px] lg:rounded-[15px]
                    object-cover z-[1] mb-2 sm:mb-4 lg:mb-2
                "
				loading="lazy"
				width={268}
				height={268}
				sizes="(max-width: 640px) 80px, (max-width: 768px) 130px, 268px"
				alt=""
				src={pict}
			/>
			<div
				className="w-full capitalize inline-block z-[1] mt-1"
				style={divStyle}
			>
				<p
					className="px-1 m-0 text-[18px] font-semibold text-[#EFEFEF] sm:text-[25px] sm:font-extrabold sm:text-[#374A37]"
					style={{
						fontFamily: "Noto Serif TC, serif",
					}}
				>
					{subtitle}
				</p>
			</div>
		</div>
	);
};

Card.propTypes = {
	className: PropTypes.string,
	cardWidth: PropTypes.string,
	divTop: PropTypes.string,
	pict: PropTypes.string.isRequired,
	title: PropTypes.string,
	subtitle: PropTypes.string,
};

export default Card;
