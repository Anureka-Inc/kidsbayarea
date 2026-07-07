import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import { events } from "@/data/events";
import EventsContent from "./EventsContent";

export const revalidate = 86400;

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "zh"
      ? "湾区亲子活动日历 - 全年家庭节庆与集市"
      : "Bay Area Family Events Calendar - Annual Festivals & Fairs for Kids";
  const description =
    locale === "zh"
      ? "湾区全年适合家庭的重大活动：农历新年游行、樱花节、南瓜节、科学节、节日灯展等。附官方链接，出行前请确认当年具体日期。"
      : "The Bay Area's biggest recurring family events by season: Lunar New Year parade, Cherry Blossom Festival, pumpkin festival, science festival, holiday lights, and more. Official links included — confirm this year's exact dates before you go.";

  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/events`;
  }

  const translated = isFullyTranslated(locale);
  const canonicalUrl = translated
    ? `https://www.kidsbayarea.com/${locale}/events`
    : `https://www.kidsbayarea.com/en/events`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // ItemList JSON-LD — valid without fabricated dates (we don't emit Event schema
  // because Google's Event type requires a startDate we deliberately don't invent).
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bay Area Family Events",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.name.en,
      url: e.officialUrl,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <EventsContent />
    </>
  );
}
