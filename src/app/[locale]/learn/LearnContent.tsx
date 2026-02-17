"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { places, regionNames, type Region, type AgeRange } from "@/data/places";
import PlaceCard from "@/components/PlaceCard";

const ageOptions: AgeRange[] = ["0-2", "2-5", "5-8", "8-12", "all"];

export default function LearnContent() {
  const t = useTranslations("placeFilters");
  const tl = useTranslations("learn");
  const [region, setRegion] = useState<"all" | Region>("all");
  const [age, setAge] = useState<"any" | AgeRange>("any");
  const [sort, setSort] = useState<"rating" | "name">("rating");

  const allPlaces = places.filter((p) => p.category === "learn");

  const filtered = useMemo(() => {
    let result = allPlaces;
    if (region !== "all") result = result.filter((p) => p.region === region);
    if (age !== "any") result = result.filter((p) => p.ageRange.includes(age) || p.ageRange.includes("all"));
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    else result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [allPlaces, region, age, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{tl("title")}</h1>
        <p className="text-gray-600 dark:text-gray-300">{tl("subtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={region} onChange={(e) => setRegion(e.target.value as typeof region)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm">
          <option value="all">{t("allAreas")}</option>
          {Object.entries(regionNames).map(([k, v]) => <option key={k} value={k}>{v.en}</option>)}
        </select>
        <select value={age} onChange={(e) => setAge(e.target.value as typeof age)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm">
          <option value="any">{t("allAges")}</option>
          {ageOptions.map((a) => <option key={a} value={a}>{a === "all" ? "All Ages" : a}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm">
          <option value="rating">{t("sortRating")}</option>
          <option value="name">{t("sortName")}</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">{t("showing", { count: filtered.length, total: allPlaces.length })}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">{t("noResults")}</p>
          <p className="text-sm text-gray-400 mt-1">{t("noResultsHint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => <PlaceCard key={p.slug} place={p} />)}
        </div>
      )}
    </div>
  );
}
