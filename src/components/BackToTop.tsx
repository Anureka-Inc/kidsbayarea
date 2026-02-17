"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

export default function BackToTop() {
  const t = useTranslations("Common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label={t("backToTop")}
      className="fixed bottom-20 right-4 z-40 rounded-full bg-cyan-600 p-3 text-white shadow-lg transition-all hover:bg-cyan-700 md:bottom-8 dark:bg-cyan-500 dark:hover:bg-cyan-600"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
