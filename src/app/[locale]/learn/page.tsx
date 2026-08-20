import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import { buildCategoryFaqJsonLd } from "@/lib/categoryFaq";
import LearnContent from "./LearnContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "learn" });

  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/learn`;
  }

  const translated = isFullyTranslated(locale);
  const canonicalUrl = translated
    ? `https://www.kidsbayarea.com/${locale}/learn`
    : `https://www.kidsbayarea.com/en/learn`;

  // EN override: DataForSEO shows 0 rank for all tracked keyword clusters;
  // generic translated title "Classes & Education" signals no activity type or
  // geography. Naming specific program types and the Bay Area converts searchers.
  const title = locale === "en"
    ? "Bay Area Kids Classes & Programs — Music, Coding, Art & After-School"
    : t("title");
  const description = locale === "en"
    ? "Find the best kids classes and programs in the Bay Area: music lessons, STEM and coding camps, art studios, martial arts, after-school programs, and language classes across SF, East Bay, South Bay, and Peninsula."
    : t("subtitle");

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, languages: alternates },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function LearnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqJsonLd = buildCategoryFaqJsonLd("learn", locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LearnContent />
    </>
  );
}
