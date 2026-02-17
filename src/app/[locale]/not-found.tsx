"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Home, Gamepad2, Search } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* Fun illustration: lost explorer kid */}
      <div className="relative mb-8">
        <div className="flex items-end gap-2">
          <span className="text-8xl sm:text-9xl" role="img" aria-hidden="true">
            🧒
          </span>
          <span className="text-5xl sm:text-6xl opacity-70" role="img" aria-hidden="true">
            🗺️
          </span>
        </div>
        <div className="absolute -top-2 -right-4 animate-bounce text-2xl" role="img" aria-hidden="true">
          ❓
        </div>
      </div>

      <h1 className="mb-2 text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">
        404
      </h1>

      <h2 className="mb-3 text-2xl font-bold text-gray-800 dark:text-gray-200">
        {t("title")}
      </h2>

      <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
        {t("description")}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-3 font-medium text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-xl hover:shadow-cyan-500/30 active:scale-95"
        >
          <Home className="h-5 w-5" />
          {t("backHome")}
        </Link>
        <Link
          href="/play"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 font-medium text-gray-700 transition-all hover:border-teal-300 hover:bg-teal-50 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-teal-600 dark:hover:bg-gray-700"
        >
          <Gamepad2 className="h-5 w-5" />
          {t("explorePlay")}
        </Link>
      </div>
    </div>
  );
}
