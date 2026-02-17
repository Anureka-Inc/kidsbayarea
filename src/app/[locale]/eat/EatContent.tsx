"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { places, regionNames, type Region } from "@/data/places";
import PlaceCard from "@/components/PlaceCard";

export default function EatContent() {
  const t = useTranslations("placeFilters");
  const te = useTranslations("eat");
  const [region, setRegion] = useState<"all" | Region>("all");
  const [price, setPrice] = useState<"all" | "free" | "$" | "$$" | "$$$">("all");
  const [sort, setSort] = useState<"rating" | "name">("rating");

  const allPlaces = places.filter((p) => p.category === "eat");

  const filtered = useMemo(() => {
    let result = allPlaces;
    if (region !== "all") result = result.filter((p) => p.region === region);
    if (price !== "all") result = result.filter((p) => p.priceLevel === price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    else result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [allPlaces, region, price, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{te("title")}</h1>
        <p className="text-gray-600 dark:text-gray-300">{te("subtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={region} onChange={(e) => setRegion(e.target.value as typeof region)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm">
          <option value="all">{t("allAreas")}</option>
          {Object.entries(regionNames).map(([k, v]) => <option key={k} value={k}>{v.en}</option>)}
        </select>
        <select value={price} onChange={(e) => setPrice(e.target.value as typeof price)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm">
          <option value="all">{t("all")}</option>
          <option value="free">{t("free")}</option>
          <option value="$">$</option>
          <option value="$$">$$</option>
          <option value="$$$">$$$</option>
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
