import React from "react";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full bg-white/70 rounded-2xl border border-stone-200/60 shadow-sm p-8 md:p-12">
        <h1 className="text-3xl md:text-3xl font-serif text-gray-900 mb-6 text-center">
          {t("contact.title")}{" "}
          <span className="text-amber-600">{t("contact.ktebna")}</span>
        </h1>

        <p className="text-gray-600 text-center mb-10">
          {t("contact.subtitle")}
        </p>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("contact.nameLabel")}
            </label>
            <input
              type="text"
              placeholder={t("contact.namePlaceholder")}
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("contact.emailLabel")}
            </label>
            <input
              type="email"
              placeholder={t("contact.emailPlaceholder")}
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("contact.messageLabel")}
            </label>
            <textarea
              rows="5"
              placeholder={t("contact.messagePlaceholder")}
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
          >
            {t("contact.sendButton")}
          </button>
        </form>

        <div className="mt-10 text-center text-gray-600 text-sm">
          {t("contact.reachUs")}{" "}
          <span className="font-medium text-amber-600">
            ktebna.tunisie@gmail.com
          </span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
