"use client";

import { useState, useCallback, useMemo } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  MapPin,
  Star,
  ArrowRight,
  Shuffle,
  Sun,
  Cloud,
  Coffee,
  UtensilsCrossed,
  TreePine,
} from "lucide-react";
import {
  places,
  regionNames,
  type Region,
  type AgeRange,
  type Place,
} from "@/data/places";

interface Itinerary {
  morning: Place;
  lunch: Place;
  afternoon: Place;
}

function generateItinerary(
  region: "all" | Region,
  age: "any" | AgeRange,
  preference: "any" | "indoor" | "outdoor"
): Itinerary | null {
  const pool = places.filter((p) => {
    if (region !== "all" && p.region !== region) return false;
    if (
      age !== "any" &&
      !p.ageRange.includes(age) &&
      !p.ageRange.includes("all")
    )
      return false;
    if (
      preference !== "any" &&
      p.indoorOutdoor !== preference &&
      p.indoorOutdoor !== "both"
    )
      return false;
    return true;
  });

  const activities = pool.filter(
    (p) => p.category === "play" || p.category === "learn" || p.category === "explore"
  );
  const restaurants = pool.filter((p) => p.category === "eat");

  if (activities.length < 2 || restaurants.length < 1) {
    // Relax filters
    const allActivities = places.filter(
      (p) =>
        (p.category === "play" || p.category === "learn" || p.category === "explore") &&
        (region === "all" || p.region === region)
    );
    const allRestaurants = places.filter(
      (p) => p.category === "eat" && (region === "all" || p.region === region)
    );

    if (allActivities.length < 2 || allRestaurants.length < 1) return null;

    const shuffled = [...allActivities].sort(() => Math.random() - 0.5);
    const lunchPick =
      allRestaurants[Math.floor(Math.random() * allRestaurants.length)];

    return {
      morning: shuffled[0],
      lunch: lunchPick,
      afternoon: shuffled[1],
    };
  }

  const shuffled = [...activities].sort(() => Math.random() - 0.5);
  const lunchPick = restaurants[Math.floor(Math.random() * restaurants.length)];

  return {
    morning: shuffled[0],
    lunch: lunchPick,
    afternoon: shuffled[1],
  };
}

export default function PlannerContent() {
  const locale = useLocale();
  const isZh = locale === "zh";

  const [region, setRegion] = useState<"all" | Region>("all");
  const [age, setAge] = useState<"any" | AgeRange>("any");
  const [preference, setPreference] = useState<"any" | "indoor" | "outdoor">(
    "any"
  );
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [generated, setGenerated] = useState(false);

  const generate = useCallback(() => {
    const result = generateItinerary(region, age, preference);
    setItinerary(result);
    setGenerated(true);
  }, [region, age, preference]);

  const selectClass =
    "px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 w-full";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {isZh ? "周末计划器" : "Weekend Planner"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {isZh
            ? "选择偏好，一键生成完美亲子一日行程"
            : "Pick your preferences and generate the perfect family day"}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isZh ? "区域" : "Region"}
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as typeof region)}
              className={selectClass}
            >
              <option value="all">{isZh ? "所有区域" : "All Areas"}</option>
              {Object.entries(regionNames).map(([k, v]) => (
                <option key={k} value={k}>
                  {isZh ? v.zh : v.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isZh ? "孩子年龄" : "Child's Age"}
            </label>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value as typeof age)}
              className={selectClass}
            >
              <option value="any">{isZh ? "不限" : "Any Age"}</option>
              <option value="0-2">0-2</option>
              <option value="2-5">2-5</option>
              <option value="5-8">5-8</option>
              <option value="8-12">8-12</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {isZh ? "室内/户外" : "Indoor/Outdoor"}
            </label>
            <select
              value={preference}
              onChange={(e) =>
                setPreference(e.target.value as typeof preference)
              }
              className={selectClass}
            >
              <option value="any">{isZh ? "不限" : "Any"}</option>
              <option value="indoor">{isZh ? "室内" : "Indoor"}</option>
              <option value="outdoor">{isZh ? "户外" : "Outdoor"}</option>
            </select>
          </div>
        </div>

        <button
          onClick={generate}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl active:scale-[0.98]"
        >
          <Shuffle className="h-5 w-5" />
          {isZh ? "生成行程" : "Generate Itinerary"}
        </button>
      </div>

      {/* Results */}
      {generated && !itinerary && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {isZh
              ? "没有找到足够的地点来生成行程，请调整筛选条件。"
              : "Not enough places found for this combination. Try adjusting your filters."}
          </p>
        </div>
      )}

      {itinerary && (
        <div className="space-y-6">
          {/* Morning */}
          <ItineraryCard
            icon={<Coffee className="h-5 w-5" />}
            timeLabel={isZh ? "上午 9:00 - 12:00" : "Morning 9:00 - 12:00"}
            sectionLabel={isZh ? "上午活动" : "Morning Activity"}
            place={itinerary.morning}
            locale={locale}
            gradient="from-amber-500 to-orange-500"
          />

          <div className="flex justify-center">
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Lunch */}
          <ItineraryCard
            icon={<UtensilsCrossed className="h-5 w-5" />}
            timeLabel={isZh ? "中午 12:00 - 13:30" : "Lunch 12:00 - 1:30 PM"}
            sectionLabel={isZh ? "午餐" : "Lunch"}
            place={itinerary.lunch}
            locale={locale}
            gradient="from-red-500 to-pink-500"
          />

          <div className="flex justify-center">
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Afternoon */}
          <ItineraryCard
            icon={<TreePine className="h-5 w-5" />}
            timeLabel={isZh ? "下午 14:00 - 17:00" : "Afternoon 2:00 - 5:00 PM"}
            sectionLabel={isZh ? "下午活动" : "Afternoon Activity"}
            place={itinerary.afternoon}
            locale={locale}
            gradient="from-teal-500 to-cyan-500"
          />

          {/* Regenerate */}
          <div className="pt-4 text-center">
            <button
              onClick={generate}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Shuffle className="h-4 w-4" />
              {isZh ? "重新生成" : "Regenerate"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ItineraryCard({
  icon,
  timeLabel,
  sectionLabel,
  place,
  locale,
  gradient,
}: {
  icon: React.ReactNode;
  timeLabel: string;
  sectionLabel: string;
  place: Place;
  locale: string;
  gradient: string;
}) {
  const desc =
    locale === "zh" ? place.description.zh : place.description.en;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div
        className={`flex items-center gap-2 bg-gradient-to-r ${gradient} px-4 py-2 text-sm font-medium text-white`}
      >
        {icon}
        {sectionLabel}
        <span className="ml-auto text-xs opacity-80">{timeLabel}</span>
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
          {place.name}
        </h3>
        <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {place.city}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {place.rating}
          </span>
          <span className="capitalize">{place.indoorOutdoor}</span>
          <span>{place.priceLevel === "free" ? (locale === "zh" ? "免费" : "Free") : place.priceLevel}</span>
        </div>
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {desc}
        </p>
        <Link
          href={`/${place.category}/${place.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          {locale === "zh" ? "查看详情" : "View Details"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
