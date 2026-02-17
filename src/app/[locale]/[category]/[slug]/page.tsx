import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { places, getPlaceBySlug, categoryNames, type Category } from "@/data/places";
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

  return {
    title: `${place.name} - ${categoryLabel}`,
    description: description.slice(0, 160),
    openGraph: {
      title: place.name,
      description: description.slice(0, 160),
      type: "article",
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

  return <PlaceDetail place={place} />;
}
