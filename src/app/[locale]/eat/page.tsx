import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import { buildCategoryFaqJsonLd } from "@/lib/categoryFaq";
import EatContent from "./EatContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "eat" });

  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/eat`;
  }

  const translated = isFullyTranslated(locale);
  const canonicalUrl = translated
    ? `https://www.kidsbayarea.com/${locale}/eat`
    : `https://www.kidsbayarea.com/en/eat`;

  // EN-specific overrides: page has 925 impressions at pos 10.8 but only 0.86%
  // CTR. Leading with "kid-friendly restaurants" + city callouts + specific
  // amenity signals (high chairs, kids menus) anchors intent for searchers
  // deciding whether to click a generic-looking result.
  const title = locale === "en"
    ? "Kid-Friendly Restaurants in the Bay Area — SF, East Bay & South Bay"
    : t("title");
  const description = locale === "en"
    ? "Find the best kid-friendly restaurants in San Francisco, Oakland, San Jose, and across the Bay Area. Curated picks with kids' menus, high chairs, play areas, and family dining options."
    : t("subtitle");

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, languages: alternates },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function EatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqJsonLd = buildCategoryFaqJsonLd("eat", locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <EatContent />
    </>
  );
}
