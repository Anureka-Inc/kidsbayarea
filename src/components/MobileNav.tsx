"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Home,
  Blocks,
  UtensilsCrossed,
  GraduationCap,
  MoreHorizontal,
} from "lucide-react";

const navItems = [
  { href: "/" as const, icon: Home, labelKey: "home" },
  { href: "/play" as const, icon: Blocks, labelKey: "play" },
  { href: "/eat" as const, icon: UtensilsCrossed, labelKey: "eat" },
  { href: "/learn" as const, icon: GraduationCap, labelKey: "learn" },
  { href: "/explore" as const, icon: MoreHorizontal, labelKey: "more" },
];

export default function MobileNav() {
  const t = useTranslations("mobileNav");
  const pathname = usePathname();

  return (
    <nav className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md md:hidden dark:border-gray-800 dark:bg-gray-950/95">
      <ul className="flex items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                  active
                    ? "text-cyan-600 dark:text-cyan-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`}
                />
                <span className="font-medium">{t(labelKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
