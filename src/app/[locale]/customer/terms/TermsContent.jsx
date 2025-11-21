import React from 'react';
import { useTranslations } from "next-intl";

const TermsContent = () => {
    const t = useTranslations("home.terms");

    let arr = Array.from(new Array(12));
    return (
        <div className="space-y-6">
            {arr.map((section, index) => (
                <section key={index} className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
                    <h2 className="font-lora text-xl font-semibold text-brown mb-4">{t(`block${index + 1}.title`)}</h2>
                    <div className="space-y-4">
                        <p className="font-lora text-brown-light whitespace-pre-wrap">
                            {t(`block${index + 1}.content`)}
                        </p>
                        {/* {.map((paragraph, pIndex) => (
                          
                        ))} */}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default TermsContent;