"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Shuffle, ArrowRight, Star, MapPin } from "lucide-react";
import { places } from "@/data/places";

function getRandomPlace() {
  return places[Math.floor(Math.random() * places.length)];
}

export default function TodaysPick() {
  const t = useTranslations("todaysPick");
  const locale = useLocale();
  const [place, setPlace] = useState(() => getRandomPlace());

  const reroll = useCallback(() => {
    let next = getRandomPlace();
    while (next.slug === place.slug && places.length > 1) {
      next = getRandomPlace();
    }
    setPlace(next);
  }, [place.slug]);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 dark:border-teal-800 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("title")}
              </h2>
              <button
                onClick={reroll}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
                <span className="text-xs">Ages {place.ageRange.includes("all") ? "All" : place.ageRange.join(", ")}</span>
              </div>

              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {locale === "zh" ? place.description.zh : place.description.en}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {place.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/${place.category}`}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
              >
                {t("viewDetails")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
