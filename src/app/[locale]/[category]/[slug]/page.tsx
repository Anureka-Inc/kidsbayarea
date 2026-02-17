import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { places, getPlaceBySlug, categoryNames, regionNames, type Category } from "@/data/places";
import PlaceDetail from "./PlaceDetail";

const validCategories: Category[] = ["play", "eat", "learn", "shop", "explore"];

export function generateStaticParams() {
  const params: { locale: string; category: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const place of places) {
      params.push({
        locale,
        category: place.category,
        slug: place.slug,
      });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const place = getPlaceBySlug(category, slug);

  if (!place) {
    return { title: "Not Found" };
  }

  const description =
    locale === "zh" ? place.description.zh : place.description.en;
  const categoryLabel =
    locale === "zh"
      ? categoryNames[place.category]?.zh
      : categoryNames[place.category]?.en;
  const regionLabel =
    locale === "zh"
      ? regionNames[place.region]?.zh
      : regionNames[place.region]?.en;

  const ageLabel = place.ageRange.includes("all")
    ? "All Ages"
    : `Ages ${place.ageRange.join(", ")}`;

  const title = `${place.name} - ${categoryLabel} in ${regionLabel}`;
  const fullDesc = `${description.slice(0, 120)} | ${ageLabel} | ${place.city}`;

  // Build hreflang alternates
  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/${category}/${slug}`;
  }

  return {
    title,
    description: fullDesc.slice(0, 160),
    alternates: {
      canonical: `https://www.kidsbayarea.com/${locale}/${category}/${slug}`,
      languages: alternates,
    },
    openGraph: {
      title: place.name,
      description: description.slice(0, 160),
      type: "article",
      url: `https://www.kidsbayarea.com/${locale}/${category}/${slug}`,
    },
  };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;

  if (!validCategories.includes(category as Category)) {
    notFound();
  }

  setRequestLocale(locale);

  const place = getPlaceBySlug(category, slug);

  if (!place) {
    notFound();
  }

  // JSON-LD structured data for the place
  const description = locale === "zh" ? place.description.zh : place.description.en;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: place.name,
    description,
    address: {
      "@type": "PostalAddress",
      addressLocality: place.city,
      addressRegion: "CA",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: place.lat,
      longitude: place.lng,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: place.rating,
      bestRating: 5,
      worstRating: 1,
    },
    url: place.website || `https://www.kidsbayarea.com/${locale}/${category}/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://www.kidsbayarea.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryNames[place.category]?.en || category,
        item: `https://www.kidsbayarea.com/${locale}/${category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: place.name,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PlaceDetail place={place} />
    </>
  );
}
