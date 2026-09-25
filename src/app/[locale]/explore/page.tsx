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

  // EN override: page regressed to pos 46 with 1,980 impressions and 0 clicks.
  // DataForSEO shows "family day trips bay area" at pos 19 on the homepage, not
  // explore. Refocus on the page's actual corpus: parks, beaches, nature trails,
  // and state parks — queries that aren't served by /play. Naming CuriOdyssey,
  // Hidden Villa, and Muir Woods targets "kids parks bay area"-type intent.
  const title = locale === "en"
    ? "Bay Area Parks, Beaches & Nature for Kids — Day Trips & Outdoor Adventures"
    : t("title");
  const description = locale === "en"
    ? "Discover Bay Area parks, beaches, and nature destinations for families — Muir Woods, Angel Island, Point Reyes, Half Moon Bay beaches, Shoreline Park, and 100+ outdoor adventures. Filter by age and region."
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
