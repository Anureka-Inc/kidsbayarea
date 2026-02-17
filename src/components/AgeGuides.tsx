"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

const guides = [
  {
    slug: "babies-0-2",
    emoji: "👶",
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    key: "babies",
  },
  {
    slug: "toddlers-2-5",
    emoji: "🧒",
    gradient: "from-orange-500 to-amber-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    key: "toddlers",
  },
  {
    slug: "kids-5-8",
    emoji: "🎒",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    key: "kids",
  },
  {
    slug: "tweens-8-12",
    emoji: "🧑",
    gradient: "from-purple-500 to-indigo-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    key: "tweens",
  },
  {
    slug: "rainy-day",
    emoji: "🌧️",
    gradient: "from-gray-500 to-slate-600",
    bg: "bg-gray-50 dark:bg-gray-800/50",
    key: "rainyDay",
  },
  {
    slug: "family-favorites",
    emoji: "⭐",
    gradient: "from-amber-500 to-yellow-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    key: "favorites",
  },
] as const;

export default function AgeGuides() {
  const t = useTranslations("guides");

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {t("title")}
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        {t("subtitle")}
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className={`group relative flex flex-col items-center gap-2 rounded-xl ${guide.bg} border border-transparent p-4 text-center transition-all hover:border-gray-200 hover:shadow-md dark:hover:border-gray-600`}
          >
            <span className="text-3xl">{guide.emoji}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {t(`${guide.key}.title`)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t(`${guide.key}.subtitle`)}
            </span>
            <ArrowRight className="mt-1 h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  );
}
