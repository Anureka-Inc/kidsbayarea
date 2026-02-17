"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Baby, Home } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex items-center justify-center rounded-full bg-cyan-100 p-6 dark:bg-cyan-900/30">
        <Baby className="h-16 w-16 text-cyan-600 dark:text-cyan-400" />
      </div>

      <h1 className="mb-2 text-6xl font-bold text-cyan-600 dark:text-cyan-400">
        404
      </h1>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {t("title")}
      </h2>

      <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
        {t("description")}
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-6 py-3 font-medium text-white transition-colors hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"
      >
        <Home className="h-5 w-5" />
        {t("backHome")}
      </Link>
    </div>
  );
}
