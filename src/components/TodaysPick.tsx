"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Shuffle, ArrowRight, Star, MapPin, Baby, Sun, CloudRain } from "lucide-react";
import { places } from "@/data/places";

// Simple deterministic hash for consistent ordering between server and client
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getDaySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function getSeason(): "spring" | "summer" | "fall" | "winter" {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

function getSmartPicks() {
  const season = getSeason();
  const weekend = isWeekend();
  const daySeed = getDaySeed();

  // Score each place based on context
  const scored = places.map((place, index) => {
    let score = place.rating * 10; // Base score from rating

    // Weekend → prefer outdoor, day trips, explore
    if (weekend) {
      if (place.indoorOutdoor === "outdoor" || place.indoorOutdoor === "both") score += 15;
      if (place.category === "explore") score += 20;
      if (place.category === "play") score += 10;
    } else {
      // Weekday → prefer indoor, learn, nearby
      if (place.indoorOutdoor === "indoor") score += 10;
      if (place.category === "learn") score += 15;
    }

    // Season adjustments
    if (season === "summer") {
      if (place.tags.includes("outdoor") || place.tags.includes("water") || place.tags.includes("beach")) score += 15;
      if (place.category === "explore") score += 10;
    } else if (season === "winter") {
      if (place.indoorOutdoor === "indoor") score += 15;
      if (place.tags.includes("museum") || place.tags.includes("indoor")) score += 10;
    } else if (season === "spring") {
      if (place.tags.includes("nature") || place.tags.includes("garden") || place.tags.includes("farm")) score += 15;
    } else if (season === "fall") {
      if (place.tags.includes("farm") || place.tags.includes("nature") || place.tags.includes("outdoor")) score += 10;
    }

    // Deterministic variation based on day + place index (same on server and client)
    score += seededRandom(daySeed + index) * 20;

    return { place, score };
  });

  // Sort by score and return top picks
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.place);
}

export default function TodaysPick() {
  const t = useTranslations("todaysPick");
  const locale = useLocale();

  const [smartPicks] = useState(() => getSmartPicks());
  const [pickIndex, setPickIndex] = useState(0);
  const place = smartPicks[pickIndex] || smartPicks[0];

  const reroll = useCallback(() => {
    setPickIndex((prev) => (prev + 1) % smartPicks.length);
  }, [smartPicks.length]);

  const season = getSeason();
  const weekend = isWeekend();

  const contextLabel = weekend
    ? season === "summer" ? "☀️ Weekend Summer Pick" : season === "winter" ? "❄️ Weekend Winter Pick" : "🌈 Weekend Pick"
    : season === "summer" ? "☀️ Weekday Pick" : season === "winter" ? "🏠 Indoor Pick" : "📍 Today's Pick";

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 dark:border-teal-800 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("title")}
                </h2>
                <p className="mt-0.5 text-xs text-teal-600 dark:text-teal-400">
                  {contextLabel}
                </p>
              </div>
              <button
                onClick={reroll}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow active:scale-95 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                <Shuffle className="h-4 w-4" />
                {t("reroll")}
              </button>
            </div>

            {/* Place info */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {place.name}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {place.city}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {place.rating}
                </span>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium capitalize text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                  {place.category}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Baby className="h-3.5 w-3.5" />
                  {place.ageRange.includes("all") ? "All Ages" : place.ageRange.join(", ")}
                </span>
                {place.indoorOutdoor === "indoor" && (
                  <span className="flex items-center gap-1 text-xs">
                    <CloudRain className="h-3.5 w-3.5" /> Indoor
                  </span>
                )}
                {place.indoorOutdoor === "outdoor" && (
                  <span className="flex items-center gap-1 text-xs">
                    <Sun className="h-3.5 w-3.5" /> Outdoor
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {locale === "zh" ? place.description.zh : place.description.en}
              </p>

              {/* Facilities */}
              <div className="flex flex-wrap gap-2">
                {place.strollerFriendly && (
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    🍼 Stroller-friendly
                  </span>
                )}
                {place.changingStation && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    🚼 Changing station
                  </span>
                )}
                {place.diningOnSite && (
                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    🍽 Dining on site
                  </span>
                )}
                {place.priceLevel === "free" && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    🆓 Free
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {place.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-3 pt-1">
                <Link
                  href={`/${place.category}/${place.slug}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-teal-700 active:scale-95 dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  {t("viewDetails")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <MapPin className="h-4 w-4" />
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
