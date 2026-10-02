import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import { buildCategoryFaqJsonLd, getCategoryFaqEntries } from "@/lib/categoryFaq";
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
      {(locale === "en" || locale === "zh") && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              {locale === "zh" ? "湾区公园与一日游常见问题" : "Bay Area Parks & Day Trips FAQ"}
            </h2>
            <div className="space-y-6">
              {getCategoryFaqEntries("explore", locale).map((entry) => (
                <div key={entry.q}>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{entry.q}</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{entry.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
