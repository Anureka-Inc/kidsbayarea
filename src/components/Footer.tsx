import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Baby, MapPin, Calendar, Compass } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");
  const tc = useTranslations("Common");

  return (
    <footer className="border-t border-gray-200 bg-gray-900 pb-20 md:pb-0 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Baby className="h-7 w-7 text-cyan-400" />
              <span className="text-lg font-bold text-white">
                {tc("brandName")}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {t("description")}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              {tc("explore") || "Explore"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/play" className="text-gray-400 transition-colors hover:text-cyan-400">
                  {tc("play")}
                </Link>
              </li>
              <li>
                <Link href="/eat" className="text-gray-400 transition-colors hover:text-cyan-400">
                  {tc("eat")}
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-gray-400 transition-colors hover:text-cyan-400">
                  {tc("learn")}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 transition-colors hover:text-cyan-400">
                  {tc("shop")}
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-gray-400 transition-colors hover:text-cyan-400">
                  {tc("explore")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Tools
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/planner"
                  className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-cyan-400"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Weekend Planner
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/rainy-day"
                  className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-cyan-400"
                >
                  <Compass className="h-3.5 w-3.5" />
                  Rainy Day Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/family-favorites"
                  className="flex items-center gap-1.5 text-gray-400 transition-colors hover:text-cyan-400"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Top Rated
                </Link>
              </li>
              <li>
                <a
                  href="https://forms.gle/kidsbayarea-submit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-cyan-400"
                >
                  Submit a Spot
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-300">
              Info
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-400 transition-colors hover:text-cyan-400">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <span className="text-gray-400">
                  {t("about")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
