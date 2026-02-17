import { useTranslations } from "next-intl";
import { Flower2, Sun, Leaf, Snowflake } from "lucide-react";

function getSeasonKey(): "spring" | "summer" | "fall" | "winter" {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}

const seasonConfig = {
  spring: {
    icon: Flower2,
    gradient:
      "from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30",
    border: "border-green-200 dark:border-green-800",
    iconColor: "text-green-500",
  },
  summer: {
    icon: Sun,
    gradient:
      "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    border: "border-amber-200 dark:border-amber-800",
    iconColor: "text-amber-500",
  },
  fall: {
    icon: Leaf,
    gradient:
      "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30",
    border: "border-orange-200 dark:border-orange-800",
    iconColor: "text-orange-500",
  },
  winter: {
    icon: Snowflake,
    gradient:
      "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    border: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-500",
  },
};

export default function SeasonalBanner() {
  const t = useTranslations("seasonal");
  const season = getSeasonKey();
  const config = seasonConfig[season];
  const Icon = config.icon;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div
        className={`flex items-center gap-4 rounded-2xl border bg-gradient-to-r p-5 ${config.gradient} ${config.border}`}
      >
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-gray-800 ${config.iconColor}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {t(season)}
          </p>
        </div>
        <a
          href="/explore"
          className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {t("cta")}
        </a>
      </div>
    </div>
  );
}
