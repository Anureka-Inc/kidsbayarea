import { useTranslations } from "next-intl";
import { Baby } from "lucide-react";

export default function Footer() {
  const t = useTranslations("Footer");
  const tc = useTranslations("Common");

  const links = [
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
    { label: t("privacy"), href: "/privacy" },
    { label: t("terms"), href: "/terms" },
  ];

  return (
    <footer className="border-t border-gray-200 bg-gray-900 pb-20 md:pb-0 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Baby className="h-7 w-7 text-cyan-400" />
            <span className="text-lg font-bold text-white">
              {tc("brandName")}
            </span>
          </div>

          {/* Tagline */}
          <p className="max-w-md text-center text-sm text-gray-400">
            {t("description")}
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-400 transition-colors hover:text-cyan-400"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px w-full max-w-xs bg-gray-800" />

          {/* Copyright */}
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
