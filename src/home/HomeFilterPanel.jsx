import CATEGORIES from "../data/categories";
import { useTranslation } from "react-i18next";

function HomeFilterPanel({ category, setCategory, dealType, setDealType }) {
  const { t } = useTranslation();

  const dealTypes = [
    { value: "All", label: t("filterPanel.all") },
    { value: "exchange", label: t("filterPanel.exchange") },
    { value: "sell", label: t("filterPanel.sell") },
    { value: "donate", label: t("filterPanel.donate") },
  ];

  return (
    <div className="sticky top-20 space-y-6 border border-stone-200/60 bg-white/70 p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900/70">
      <div>
        <h3 className="mb-2 font-serif text-lg">
          {t("filterPanel.categories")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-xl px-3 py-1.5 text-sm transition ${
                category === c
                  ? "bg-amber-700 text-amber-50 shadow"
                  : "border border-stone-300 bg-white/70 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              }`}
            >
              {t(`categories.${c}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 font-serif text-lg">{t("filterPanel.dealType")}</h3>
        <div className="flex flex-wrap gap-2">
          {dealTypes.map((dt) => (
            <button
              key={dt.value}
              onClick={() => setDealType(dt.value)}
              className={`rounded-xl px-3 py-1.5 text-sm transition ${
                dealType === dt.value
                  ? "bg-amber-700 text-amber-50 shadow"
                  : "border border-stone-300 bg-white/70 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              }`}
            >
              {dt.label}
            </button>
          ))}
        </div>
        {/* <select
          value={dealType}
          onChange={(e) => setDealType(e.target.value)}
          className="w-full rounded-xl border border-stone-300 bg-white/80 px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-800"
        >
          {dealTypes.map((dt) => (
            <option key={dt.value} value={dt.value}>
              {dt.label}
            </option>
          ))}
        </select> */}
      </div>
    </div>
  );
}

export default HomeFilterPanel;
