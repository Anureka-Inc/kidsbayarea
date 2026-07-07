"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Home, ChevronRight, ExternalLink, MapPin, CalendarDays } from "lucide-react";
import { regionNames, type Region } from "@/data/places";
import {
  orderByUpcoming,
  eventCategoryNames,
  type FamilyEvent,
} from "@/data/events";

function currentMonth(): number {
  // Runs on client; fine for ordering. Server pre-renders EN with a stable order
  // and the client re-sorts on mount — no hydration text mismatch because the
  // list content is identical, only order differs and React reconciles keys.
  return new Date().getMonth() + 1;
}

export default function EventsContent() {
  const locale = useLocale();
  const zh = locale === "zh";
  const [region, setRegion] = useState<"all" | Region>("all");

  const ordered = useMemo(() => orderByUpcoming(currentMonth()), []);
  const filtered = useMemo(
    () => (region === "all" ? ordered : ordered.filter((e) => e.region === region)),
    [ordered, region]
  );

  const regions: ("all" | Region)[] = [
    "all",
    "sf",
    "east-bay",
    "south-bay",
    "peninsula",
    "north-bay",
  ];

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
          {zh ? "活动日历" : "Events"}
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-3 flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          <CalendarDays className="h-8 w-8 text-teal-600 dark:text-teal-400" />
          {zh ? "湾区亲子活动日历" : "Bay Area Family Events"}
        </h1>
        <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          {zh
            ? "湾区全年最值得带孩子参加的重大活动，按即将到来的顺序排列。具体日期每年略有不同——出行前请点击官方链接确认当年安排。"
            : "The Bay Area's biggest family events, ordered by what's coming up next. Exact dates shift year to year — tap the official link to confirm this year's schedule before you go."}
        </p>
      </div>

      {/* Region filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              region === r
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {r === "all"
              ? zh
                ? "全部地区"
                : "All regions"
              : zh
                ? regionNames[r].zh
                : regionNames[r].en}
          </button>
        ))}
      </div>

      {/* Event list */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <EventCard key={e.slug} event={e} zh={zh} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-gray-500 dark:text-gray-400">
          {zh ? "该地区暂无收录活动。" : "No events listed for this region yet."}
        </p>
      )}

      <p className="mt-10 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
        {zh
          ? "提示：这些是每年循环举办的活动，我们不虚构具体日期。请以官方网站公布的当年日期、票价和时间为准。"
          : "Note: these are recurring annual events — we don't invent specific dates. Always confirm the current year's dates, pricing, and hours on the official site."}
      </p>
    </div>
  );
}

function EventCard({ event: e, zh }: { event: FamilyEvent; zh: boolean }) {
  const cat = eventCategoryNames[e.category];
  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
          {cat.emoji} {zh ? cat.zh : cat.en}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {zh ? e.timing.zh : e.timing.en}
        </span>
      </div>
      <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
        {zh ? e.name.zh : e.name.en}
      </h2>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {zh ? e.description.zh : e.description.en}
      </p>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {e.city}
        </span>
        <span>{zh ? e.priceNote.zh : e.priceNote.en}</span>
      </div>
      <a
        href={e.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400"
      >
        {zh ? "官方网站" : "Official site"}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
