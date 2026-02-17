"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  Baby,
  Menu,
  X,
  Search,
  Gamepad2,
  UtensilsCrossed,
  GraduationCap,
  ShoppingBag,
  Compass,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import SearchOverlay from "./SearchOverlay";

const localeLabels: Record<string, string> = {
  en: "English",
  zh: "中文",
  es: "Español",
  ja: "日本語",
  ko: "한국어",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
  ru: "Русский",
  ar: "العربية",
  hi: "हिन्दी",
  th: "ไทย",
  vi: "Tiếng Việt",
  id: "Indonesia",
  tr: "Türkçe",
  nl: "Nederlands",
  pl: "Polski",
  sv: "Svenska",
  da: "Dansk",
  nb: "Norsk",
  fi: "Suomi",
  cs: "Čeština",
  he: "עברית",
  ms: "Bahasa Melayu",
  tl: "Tagalog",
  uk: "Українська",
  ro: "Română",
  hu: "Magyar",
  el: "Ελληνικά",
};

const languageGroups = [
  { label: "Popular", locales: ["en", "zh", "es", "ja", "ko"] },
  { label: "Europe", locales: ["fr", "de", "pt", "it", "nl", "pl", "sv", "da", "nb", "fi", "cs", "ro", "hu", "el", "uk"] },
  { label: "Asia & Middle East", locales: ["ru", "ar", "hi", "th", "vi", "id", "ms", "tl", "he", "tr"] },
];

const navIcons = {
  play: Gamepad2,
  eat: UtensilsCrossed,
  learn: GraduationCap,
  shop: ShoppingBag,
  explore: Compass,
};

export default function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("Common");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Cmd/Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { href: "/play" as const, label: t("play"), key: "play" },
    { href: "/eat" as const, label: t("eat"), key: "eat" },
    { href: "/learn" as const, label: t("learn"), key: "learn" },
    { href: "/shop" as const, label: t("shop"), key: "shop" },
    { href: "/explore" as const, label: t("explore"), key: "explore" },
  ];

  const handleLocaleChange = (locale: string) => {
    router.replace(pathname, { locale });
    setLangOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Baby className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {tc("brandName")}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = navIcons[item.key as keyof typeof navIcons];
            const active = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
                      : "text-gray-600 hover:bg-gray-100 hover:text-cyan-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-cyan-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
            <kbd className="hidden rounded border border-gray-300 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 sm:inline dark:border-gray-600">
              ⌘K
            </kbd>
          </button>

          <ThemeToggle />

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="rounded-lg p-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label={tc("language")}
            >
              <span className="hidden sm:inline">{tc("language")}</span>
              <span className="sm:hidden text-base">🌐</span>
            </button>

            {langOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 max-h-96 w-52 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-900">
                  {languageGroups.map((group) => (
                    <div key={group.label}>
                      <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        {group.label}
                      </p>
                      {group.locales.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => handleLocaleChange(loc)}
                          className="block w-full px-4 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-700 dark:text-gray-300 dark:hover:bg-cyan-950 dark:hover:text-cyan-300"
                        >
                          {localeLabels[loc] || loc}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label={mobileOpen ? tc("close") : tc("menu")}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 md:hidden dark:border-gray-800 dark:bg-gray-950">
          <ul className="space-y-1 pt-2">
            {navItems.map((item) => {
              const Icon = navIcons[item.key as keyof typeof navIcons];
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

    </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
