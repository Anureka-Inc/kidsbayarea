import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import { buildCategoryFaqJsonLd } from "@/lib/categoryFaq";
import ShopContent from "./ShopContent";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shop" });

  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/shop`;
  }

  const translated = isFullyTranslated(locale);
  const canonicalUrl = translated
    ? `https://www.kidsbayarea.com/${locale}/shop`
    : `https://www.kidsbayarea.com/en/shop`;

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: { canonical: canonicalUrl, languages: alternates },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqJsonLd = buildCategoryFaqJsonLd("shop", locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ShopContent />
    </>
  );
}
