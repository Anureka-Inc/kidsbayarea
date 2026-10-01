import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import { buildCategoryFaqJsonLd, getCategoryFaqEntries } from "@/lib/categoryFaq";
import PlayContent from "./PlayContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "play" });

  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/play`;
  }

  // Non-EN/ZH locales serve untranslated category copy → canonical to EN
  // and noindex to prevent duplicate-content penalties.
  const translated = isFullyTranslated(locale);
  const canonicalUrl = translated
    ? `https://www.kidsbayarea.com/${locale}/play`
    : `https://www.kidsbayarea.com/en/play`;

  // EN override: DataForSEO shows 0 rank for "best playgrounds bay area",
  // "splash pads bay area", "indoor activities for kids bay area", and
  // "children's museums bay area" — competitors rank #4-7. Strengthen the
  // snippet by naming the actual activity types and the region.
  const title = locale === "en"
    ? "Best Bay Area Playgrounds, Splash Pads & Kid Activities"
    : t("title");
  const description = locale === "en"
    ? "Explore 100+ kid-friendly play venues in the Bay Area: splash pads, indoor play spaces, children's museums, trampoline parks, zoos, and free playgrounds — filtered by age, region, and price."
    : t("subtitle");

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl, languages: alternates },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function PlayPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqJsonLd = buildCategoryFaqJsonLd("play", locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PlayContent />
      {locale === "en" && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Bay Area Play &amp; Activities FAQ
            </h2>
            <div className="space-y-6">
              {getCategoryFaqEntries("play", locale).map((entry) => (
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
