"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Home, ChevronRight } from "lucide-react";
import { places, type AgeRange } from "@/data/places";
import PlaceCard from "@/components/PlaceCard";

type GuideSlug =
  | "babies-0-2"
  | "toddlers-2-5"
  | "kids-5-8"
  | "tweens-8-12"
  | "rainy-day"
  | "family-favorites";

interface GuideMeta {
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
}

const guideAgeMap: Partial<Record<GuideSlug, AgeRange>> = {
  "babies-0-2": "0-2",
  "toddlers-2-5": "2-5",
  "kids-5-8": "5-8",
  "tweens-8-12": "8-12",
};

interface GuideContentProps {
  guideSlug: GuideSlug;
  meta: GuideMeta;
}

export default function GuideContent({ guideSlug, meta }: GuideContentProps) {
  const locale = useLocale();
  const title = locale === "zh" ? meta.titleZh : meta.titleEn;
  const description = locale === "zh" ? meta.descZh : meta.descEn;

  const filteredPlaces = useMemo(() => {
    let result = [...places];

    if (guideSlug === "rainy-day") {
      result = result.filter(
        (p) => p.indoorOutdoor === "indoor" || p.indoorOutdoor === "both"
      );
    } else if (guideSlug === "family-favorites") {
      result = result.filter((p) => p.rating >= 4.5);
    } else {
      const age = guideAgeMap[guideSlug];
      if (age) {
        result = result.filter(
          (p) => p.ageRange.includes(age) || p.ageRange.includes("all")
        );
      }
    }

    return result.sort((a, b) => b.rating - a.rating);
  }, [guideSlug]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filteredPlaces>();
    for (const place of filteredPlaces) {
      const existing = map.get(place.category) || [];
      existing.push(place);
      map.set(place.category, existing);
    }
    return map;
  }, [filteredPlaces]);

  const categoryEmojis: Record<string, string> = {
    play: "🎪",
    eat: "🍽️",
    learn: "📚",
    shop: "🛍️",
    explore: "🧭",
  };

  const categoryLabels: Record<string, { en: string; zh: string }> = {
    play: { en: "Play & Activities", zh: "玩乐活动" },
    eat: { en: "Kid-Friendly Restaurants", zh: "亲子餐厅" },
    learn: { en: "Classes & Education", zh: "课程教育" },
    shop: { en: "Family Shopping", zh: "亲子购物" },
    explore: { en: "Day Trips & Adventures", zh: "出行探险" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
        <Link
          href="/"
          className="transition-colors hover:text-teal-600 dark:hover:text-teal-400"
        >
          <Home className="h-4 w-4" />
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="text-gray-900 dark:text-white">
          {locale === "zh" ? "指南" : "Guides"}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {filteredPlaces.length} {locale === "zh" ? "个推荐" : "recommendations"}
        </p>
      </div>

      {/* Grouped results */}
      {Array.from(grouped.entries()).map(([category, categoryPlaces]) => (
        <section key={category} className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <span>{categoryEmojis[category]}</span>
            {locale === "zh"
              ? categoryLabels[category]?.zh
              : categoryLabels[category]?.en}
            <span className="text-sm font-normal text-gray-400">
              ({categoryPlaces.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryPlaces.map((p) => (
              <PlaceCard key={p.slug} place={p} />
            ))}
          </div>
        </section>
      ))}

      {/* Rainy-day FAQ — renders as readable HTML for GEO citability */}
      {guideSlug === "rainy-day" && locale === "en" && (
        <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
          <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
            Rainy Day Activities FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What are the best rainy day activities for kids in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Top picks include the <strong>Exploratorium</strong> in San Francisco (hands-on science), the <strong>Children&apos;s Discovery Museum of San Jose</strong>, the <strong>Bay Area Discovery Museum</strong> in Sausalito (great for younger children), the <strong>Children&apos;s Creativity Museum</strong> in San Francisco, <strong>The Tech Interactive</strong> in San Jose, and <strong>Chabot Space and Science Center</strong> in Oakland. <strong>Sky Zone</strong> trampoline parks in Fremont and Dublin are indoors year-round. Check each venue&apos;s website for current hours and admission.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Are there free indoor activities for kids on rainy days?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Yes. Free or low-cost options include public library story times and kids&apos; programs (such as the San Francisco, Santa Clara County, and Oakland public library systems), the <strong>East Bay Depot for Creative Reuse</strong> in Oakland, and the <strong>Randall Museum</strong> in San Francisco. Hours and admission vary by location and season — check each venue&apos;s website for current details.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                Where can toddlers go on rainy days in the Bay Area?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Best rainy day spots for toddlers: the <strong>Bay Area Discovery Museum</strong> in Sausalito, <strong>Habitot Children&apos;s Museum</strong> in Berkeley (designed for younger children), the <strong>Children&apos;s Discovery Museum of San Jose</strong>, <strong>La Petite Playhouse</strong> in San Francisco, and <strong>Little Gym</strong> locations in Palo Alto, San Jose, and Danville. Many community recreation centers also offer indoor family swim times — check local schedules.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                What indoor play spaces near San Francisco are open on rainy days?
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Near SF: the <strong>Exploratorium</strong> and the <strong>Children&apos;s Creativity Museum</strong>, both in San Francisco. A short drive away, the <strong>Bay Area Discovery Museum</strong> in Sausalito and <strong>Chabot Space and Science Center</strong> in Oakland offer indoor exhibits. Check each venue&apos;s website for current hours and tickets.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Cross-link to other guides */}
      <section className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          {locale === "zh" ? "更多指南" : "More Guides"}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(
            [
              { slug: "babies-0-2", label: "👶 0-2", zhLabel: "👶 0-2岁" },
              { slug: "toddlers-2-5", label: "🧒 2-5", zhLabel: "🧒 2-5岁" },
              { slug: "kids-5-8", label: "🎒 5-8", zhLabel: "🎒 5-8岁" },
              { slug: "tweens-8-12", label: "🧑 8-12", zhLabel: "🧑 8-12岁" },
              { slug: "rainy-day", label: "🌧️ Rainy Day", zhLabel: "🌧️ 雨天" },
              { slug: "family-favorites", label: "⭐ Top Rated", zhLabel: "⭐ 最佳" },
            ] as const
          )
            .filter((g) => g.slug !== guideSlug)
            .map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium text-gray-700 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-teal-600 dark:hover:bg-teal-900/30"
              >
                {locale === "zh" ? g.zhLabel : g.label}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
