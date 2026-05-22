import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { isFullyTranslated } from "@/i18n/routing";
import { searchPlaces } from "@/data/places";
import PlaceCard from "@/components/PlaceCard";
import { Link } from "@/i18n/navigation";

// Real URL-backed search page so the Organization's SearchAction schema
// resolves to a working endpoint. Google AIO and Bing CoPilot use this to
// expose a "Search this site" affordance directly in SERP. The page is
// no-indexed (`?q=` URLs are infinite-cardinality and shouldn't dilute the
// index) but always crawlable, which is what schema.org spec recommends.

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  const isZh = locale === "zh";
  // Layout template appends " | Kids Bay Area" — return short titles here to
  // avoid the double-brand "X | Kids Bay Area | Kids Bay Area" duplication.
  const title = q
    ? isZh
      ? `搜索"${q}"`
      : `Search "${q}"`
    : isZh
    ? "搜索"
    : "Search";
  return {
    title,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `https://www.kidsbayarea.com/${locale}/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const query = (q ?? "").trim();
  const results = query.length >= 2 ? searchPlaces(query).slice(0, 60) : [];
  const isZh = locale === "zh";
  // Note: isFullyTranslated currently gates UI affordances only; nothing else
  // changes per-locale here because search is data-driven.
  void isFullyTranslated;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link
          href="/"
          className="text-sm text-teal-600 hover:underline dark:text-teal-400"
        >
          {isZh ? "← 返回首页" : "← Back to home"}
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          {query
            ? isZh
              ? `“${query}” 的搜索结果`
              : `Search results for “${query}”`
            : isZh
            ? "搜索 Kids Bay Area"
            : "Search Kids Bay Area"}
        </h1>
        {query && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isZh
              ? `找到 ${results.length} 个匹配的亲子去处`
              : `Found ${results.length} kid-friendly ${results.length === 1 ? "place" : "places"}`}
          </p>
        )}
      </header>

      {query.length < 2 && (
        <form
          method="get"
          action={`/${locale}/search`}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="search"
            name="q"
            placeholder={
              isZh
                ? "搜索游乐场、餐厅、博物馆..."
                : "Search playgrounds, restaurants, museums..."
            }
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-base focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white transition hover:bg-teal-700"
          >
            {isZh ? "搜索" : "Search"}
          </button>
        </form>
      )}

      {query.length >= 2 && results.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <p className="text-gray-600 dark:text-gray-400">
            {isZh
              ? "没有找到匹配的地点。试试其他关键词，或浏览各类目。"
              : "No matching places found. Try a different keyword, or browse by category."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {(["play", "eat", "learn", "shop", "explore"] as const).map((cat) => (
              <Link
                key={cat}
                href={`/${cat}`}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-teal-500 hover:text-teal-700 dark:border-gray-600 dark:text-gray-300 dark:hover:border-teal-400 dark:hover:text-teal-400"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((place) => (
            <PlaceCard key={place.slug} place={place} />
          ))}
        </div>
      )}
    </main>
  );
}
