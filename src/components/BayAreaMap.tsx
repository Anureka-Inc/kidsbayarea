"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import { places, type Category, type AgeRange, type Region, regionNames } from "@/data/places";

const MapInner = dynamic(() => import("./MapInner"), { ssr: false });

type FilterCategory = "all" | Category;

const tabs: { key: FilterCategory; labelKey: string }[] = [
  { key: "all", labelKey: "all" },
  { key: "play", labelKey: "play" },
  { key: "eat", labelKey: "eat" },
  { key: "learn", labelKey: "learn" },
  { key: "shop", labelKey: "shop" },
  { key: "explore", labelKey: "explore" },
];

const ageOptions: { key: "any" | AgeRange; label: string }[] = [
  { key: "any", label: "All Ages" },
  { key: "0-2", label: "0-2" },
  { key: "2-5", label: "2-5" },
  { key: "5-8", label: "5-8" },
  { key: "8-12", label: "8-12" },
];

export default function BayAreaMap() {
  const t = useTranslations("map");
  const tf = useTranslations("placeFilters");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<FilterCategory>("all");
  const [ageFilter, setAgeFilter] = useState<"any" | AgeRange>("any");
  const [regionFilter, setRegionFilter] = useState<"all" | Region>("all");

  const filteredPlaces = useMemo(() => {
    let result = places;
    if (activeTab !== "all") result = result.filter((p) => p.category === activeTab);
    if (ageFilter !== "any") result = result.filter((p) => p.ageRange.includes(ageFilter) || p.ageRange.includes("all"));
    if (regionFilter !== "all") result = result.filter((p) => p.region === regionFilter);
    return result;
  }, [activeTab, ageFilter, regionFilter]);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h2>

        {/* Category filter tabs */}
        <div className="mb-3 flex flex-wrap gap-2">
          {tabs.map(({ key, labelKey }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === key
                  ? "bg-teal-600 text-white dark:bg-teal-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        {/* Age + Region filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Age:</span>
            <div className="flex gap-1">
              {ageOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setAgeFilter(key)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    ageFilter === key
                      ? "bg-cyan-600 text-white dark:bg-cyan-500"
                      : "bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {key === "any" ? tf("allAges") : label}
                </button>
              ))}
            </div>
          </div>

          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value as typeof regionFilter)}
            className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="all">{tf("allAreas")}</option>
            {Object.entries(regionNames).map(([k, v]) => (
              <option key={k} value={k}>{locale === "zh" ? v.zh : v.en}</option>
            ))}
          </select>

          <span className="text-xs text-gray-400">
            {tf("showing", { count: filteredPlaces.length, total: places.length })}
          </span>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
          <MapInner
            places={filteredPlaces}
            filteredCategory={activeTab}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
