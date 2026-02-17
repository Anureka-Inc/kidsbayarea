"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import SearchOverlay from "./SearchOverlay";

const quickTags = [
  "Discovery Museum",
  "Din Tai Fung",
  "Exploratorium",
  "Gilroy Gardens",
];

export default function Hero() {
  const t = useTranslations("hero");
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-teal-300 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-gray-300">
              {t("subtitle")}
            </p>

            {/* Search trigger */}
            <div className="mx-auto mt-10 max-w-xl">
              <button
                onClick={() => setSearchOpen(true)}
                className="group w-full text-left"
              >
                <div className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 px-5 py-4 shadow-lg shadow-teal-100/50 backdrop-blur-sm transition-colors hover:border-teal-300 dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-none dark:hover:border-teal-500">
                  <Search className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-400 dark:text-gray-500">
                    {t("searchPlaceholder")}
                  </span>
                </div>
              </button>
            </div>

            {/* Quick search tags */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {t("quickSearch")}
              </span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchOpen(true)}
                  className="rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-gray-600 transition-colors hover:border-teal-300 hover:text-teal-600 dark:border-slate-600 dark:bg-slate-700/60 dark:text-gray-300 dark:hover:text-teal-400"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
