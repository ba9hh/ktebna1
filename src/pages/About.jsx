import React from "react";
import { useTranslation } from "react-i18next";
const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-6">
      <div className="max-w-3xl bg-white/70 rounded-2xl border border-stone-200/60 shadow-sm p-8 md:p-12">
        <h1 className="text-3xl md:text-3xl font-serif text-gray-900 mb-6 text-center">
          {t("about.title")}{" "}
          <span className="text-amber-600 ">{t("about.ktebna")}</span>
        </h1>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          <span className="font-semibold">{t("about.ktebna")}</span>{" "}
          {t("about.paragraph1")}{" "}
          <span className="font-medium text-blue-600">{t("about.sell")}</span>,{" "}
          <span className="font-medium text-green-600">
            {t("about.exchange")}
          </span>
          , {t("about.or")}{" "}
          <span className="font-medium text-purple-600">
            {t("about.donate")}
          </span>{" "}
          {t("about.yourBooks")}
        </p>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {t("about.paragraph2")}
          <span className="font-semibold">{t("about.ktebna")}</span>{" "}
          {t("about.makesItEasy")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-8">
          <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              {t("about.sellTitle")}
            </h3>
            <p className="text-gray-600 text-sm">{t("about.sellDesc")}</p>
          </div>

          <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              {t("about.exchangeTitle")}
            </h3>
            <p className="text-gray-600 text-sm">{t("about.exchangeDesc")}</p>
          </div>

          <div className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              {t("about.donateTitle")}
            </h3>
            <p className="text-gray-600 text-sm">{t("about.donateDesc")}</p>
          </div>
        </div>

        <p className="text-gray-700 text-lg mt-10 text-center italic">
          {t("about.footer")}
        </p>
      </div>
    </div>
  );
};

export default About;
