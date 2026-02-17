"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPinPlus, Calendar, Users } from "lucide-react";

const cards = [
  {
    key: "submitSpot" as const,
    descKey: "submitDesc" as const,
    icon: MapPinPlus,
    href: "https://forms.gle/kidsbayarea-submit" as string,
    external: true,
    gradient: "from-pink-500 to-rose-500",
  },
  {
    key: "weekendPlanner" as const,
    descKey: "plannerDesc" as const,
    icon: Calendar,
    href: "/planner",
    external: false,
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    key: "guides" as const,
    descKey: "guidesDesc" as const,
    icon: Users,
    href: "/guides/babies-0-2",
    external: false,
    gradient: "from-violet-500 to-purple-500",
  },
];

export default function CommunitySection() {
  const t = useTranslations("community");

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("title")}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const content = (
            <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-teal-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-teal-600">
              <div
                className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${card.gradient} p-3 text-white`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900 group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
                {t(card.key)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t(card.descKey)}
              </p>
            </div>
          );

          if (card.external) {
            return (
              <a
                key={card.key}
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            );
          }

          return (
            <Link key={card.key} href={card.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
