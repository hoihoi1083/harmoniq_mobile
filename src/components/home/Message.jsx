"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import useMobile from "@/app/hooks/useMobile";

export default function Share() {
    const t = useTranslations("home.message");
    const isMobile = useMobile();

    return (
        <section className="relative pb-8 overflow-hidden pt-14 md:pb-15" style={{ fontFamily: "Noto Serif TC, serif" }}>
            <div className="container p-0 mx-auto">
                <div className="flex flex-col-reverse items-center max-w-6xl gap-12 mx-auto md:flex-row md:gap-24">
                    <div className="flex items-center px-8 md:max-w-154 md:px-4">
                        <div className="w-1/2 mr-3">
                            <Image
                                src="/images/hero/jiyu1.png"
                                alt=""
                                width={303}
                                height={379}
                                className="object-contain mb-5"
                            />

                            <Image
                                src="/images/hero/jiyu2.png"
                                alt=""
                                width={303}
                                height={379}
                                className="object-contain"
                            />
                        </div>
                        <div className="w-1/2">
                            <Image
                                src="/images/hero/jiyu3.png"
                                alt=""
                                width={303}
                                height={379}
                                className="object-contain"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center flex-grow gap-6 md:items-start md:px-4 ">
                        <h3 className="text-hero md:text-5xl text-[28px] font-bold" style={{ fontFamily: "Noto Serif TC, serif" }}>
                            {t("title")}
                        </h3>
                        <p className="whitespace-pre-wrap text-[#6B877D] md:text-xl  bg-[#E8F7F28F] md:rounded-3xl md:max-w-131 md:p-9 p-6" style={{ fontFamily: "Noto Serif TC, serif" }}>
                            <span className="block mb-3 text-primary" style={{ fontFamily: "Noto Serif TC, serif" }}>
                                {t("hello")}
                            </span>

                            {t("description")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
