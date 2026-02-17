"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { places, type Category } from "@/data/places";

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

export default function BayAreaMap() {
  const t = useTranslations("map");
  const [activeTab, setActiveTab] = useState<FilterCategory>("all");

  const filteredPlaces =
    activeTab === "all"
      ? places
      : places.filter((p) => p.category === activeTab);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h2>

        {/* Category filter tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
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

        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
          <MapInner
            places={filteredPlaces}
            filteredCategory={activeTab}
          />
        </div>
      </div>
    </section>
  );
}
