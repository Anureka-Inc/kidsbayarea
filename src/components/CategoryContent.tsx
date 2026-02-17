"use client";

import { useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { places, regionNames, type Region, type AgeRange, type PriceLevel, type Category } from "@/data/places";
import PlaceCard from "@/components/PlaceCard";

const ageOptions: AgeRange[] = ["0-2", "2-5", "5-8", "8-12", "all"];
const priceOptions: PriceLevel[] = ["free", "$", "$$", "$$$"];

interface CategoryContentProps {
  category: Category;
}

export default function CategoryContent({ category }: CategoryContentProps) {
  const t = useTranslations("placeFilters");
  const tc = useTranslations(category);
  const locale = useLocale();

  // Intro text is content-level, only available in en/zh
  const hasIntro = locale === "en" || locale === "zh";
  const [region, setRegion] = useState<"all" | Region>("all");
  const [age, setAge] = useState<"any" | AgeRange>("any");
  const [indoor, setIndoor] = useState<"all" | "indoor" | "outdoor">("all");
  const [price, setPrice] = useState<"any" | PriceLevel>("any");
  const [sort, setSort] = useState<"rating" | "name">("rating");

  const allPlaces = places.filter((p) => p.category === category);

  const filtered = useMemo(() => {
    let result = allPlaces;
    if (region !== "all") result = result.filter((p) => p.region === region);
    if (age !== "any") result = result.filter((p) => p.ageRange.includes(age) || p.ageRange.includes("all"));
    if (indoor !== "all") result = result.filter((p) => p.indoorOutdoor === indoor || p.indoorOutdoor === "both");
    if (price !== "any") result = result.filter((p) => p.priceLevel === price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    else result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [allPlaces, region, age, indoor, price, sort]);

  const selectClass = "px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{tc("title")}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{tc("subtitle")}</p>
        {hasIntro && (
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {tc("intro")}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select value={region} onChange={(e) => setRegion(e.target.value as typeof region)} className={selectClass}>
          <option value="all">{t("allAreas")}</option>
          {Object.entries(regionNames).map(([k, v]) => (
            <option key={k} value={k}>{locale === "zh" ? v.zh : v.en}</option>
          ))}
        </select>
        <select value={age} onChange={(e) => setAge(e.target.value as typeof age)} className={selectClass}>
          <option value="any">{t("allAges")}</option>
          {ageOptions.map((a) => (
            <option key={a} value={a}>{a === "all" ? t("allAges") : a}</option>
          ))}
        </select>
        <select value={indoor} onChange={(e) => setIndoor(e.target.value as typeof indoor)} className={selectClass}>
          <option value="all">{t("all")}</option>
          <option value="indoor">{t("indoor")}</option>
          <option value="outdoor">{t("outdoor")}</option>
        </select>
        <select value={price} onChange={(e) => setPrice(e.target.value as typeof price)} className={selectClass}>
          <option value="any">{t("all")}</option>
          {priceOptions.map((p) => (
            <option key={p} value={p}>{p === "free" ? t("free") : p}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={selectClass}>
          <option value="rating">{t("sortRating")}</option>
          <option value="name">{t("sortName")}</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {t("showing", { count: filtered.length, total: allPlaces.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">{t("noResults")}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t("noResultsHint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => <PlaceCard key={p.slug} place={p} />)}
        </div>
      )}
    </div>
  );
}
