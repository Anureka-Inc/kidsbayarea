import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import { buildCategoryFaqJsonLd } from "@/lib/categoryFaq";
import ExploreContent from "./ExploreContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "explore" });

  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/explore`;
  }

  const translated = isFullyTranslated(locale);
  const canonicalUrl = translated
    ? `https://www.kidsbayarea.com/${locale}/explore`
    : `https://www.kidsbayarea.com/en/explore`;

  // EN-specific overrides: target "family day trips bay area" intent directly —
  // page has 1,240 impressions at pos 14.4 but only 0.40% CTR; naming specific
  // destinations in the snippet converts searchers who want concrete picks.
  const title = locale === "en"
    ? "Bay Area Family Day Trips & Outdoor Adventures for Kids"
    : t("title");
  const description = locale === "en"
    ? "Bay Area family day trips for kids — Muir Woods, Monterey Bay Aquarium, Santa Cruz Boardwalk, Angel Island, Roaring Camp Railroads, and more outdoor adventures. Filter by age and season."
    : t("subtitle");

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, languages: alternates },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function ExplorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqJsonLd = buildCategoryFaqJsonLd("explore", locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ExploreContent />
    </>
  );
}
