import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import { getPlaceBySlug, categoryNames, regionNames, type Category } from "@/data/places";
import PlaceDetail from "./PlaceDetail";

const validCategories: Category[] = ["play", "eat", "learn", "shop", "explore"];

// ISR: every (locale, place) renders on first hit and is cached for 24h.
// Pre-rendering 533 places × 30 locales (~16k pages) at build time produced
// a 3.7GB artifact, exceeding Amplify's 220MB deploy-size limit. Sitemap
// still lists every URL so crawlers populate the cache.
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

function truncateAtSentence(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const minLen = Math.floor(maxLen * 0.55);
  const cut = text.slice(0, maxLen);
  const periodIdx = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("。"));
  if (periodIdx >= minLen) return text.slice(0, periodIdx + 1).trim();
  const lastSpace = cut.lastIndexOf(" ");
  const ending = lastSpace > minLen ? cut.slice(0, lastSpace) : cut;
  return ending.replace(/[\s,.;:!?，。；：]+$/, "") + "…";
}

function kidFriendlySignals(
  place: ReturnType<typeof getPlaceBySlug>,
  locale: string,
): string {
  if (!place) return "";
  const en: string[] = [];
  const zh: string[] = [];
  if (place.priceLevel === "free") {
    en.push("free admission");
    zh.push("免费入场");
  }
  if (place.strollerFriendly) {
    en.push("stroller-friendly");
    zh.push("推车友好");
  }
  if (place.changingStation) {
    en.push("changing station");
    zh.push("母婴室");
  }
  const arr = locale === "zh" ? zh : en;
  return arr.slice(0, 2).join(locale === "zh" ? "、" : ", ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const place = getPlaceBySlug(category, slug);

  if (!place) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }

  const isZh = locale === "zh";
  const description = isZh ? place.description.zh : place.description.en;
  const categoryLabel = isZh
    ? categoryNames[place.category]?.zh
    : categoryNames[place.category]?.en;
  const regionLabel = isZh
    ? regionNames[place.region]?.zh
    : regionNames[place.region]?.en;

  // Click-worthy title that captures kid-intent + locale-aware phrasing.
  // Template appends " | Kids Bay Area" → keep the prefix ≤ ~50 chars so the
  // full title stays under Google's ~580px (~60 char) truncation budget.
  const title = isZh
    ? `${place.name} 亲子指南 · ${place.city}`
    : `${place.name}: Kid-Friendly Guide & Tips`;

  // Description: lead with first compelling sentence (not a mid-word cut),
  // then append city + a kid-friendly signal so the SERP snippet sells the click.
  // Budget is ~158 chars (Google's typical SERP snippet) — if the composed
  // string overflows we degrade gracefully: drop signals first, then trim the
  // lead to a shorter complete sentence, never truncate mid-word.
  const BUDGET = 158;
  const signals = kidFriendlySignals(place, locale);
  const baseSuffix = isZh
    ? ` 适合${place.city}家庭。`
    : ` Kid-friendly visit guide for ${place.city}.`;
  const richSuffix = signals
    ? isZh
      ? ` 适合${place.city}家庭｜${signals}。`
      : ` Kid-friendly visit guide for ${place.city} · ${signals}.`
    : baseSuffix;
  const leadLen = BUDGET - richSuffix.length;
  const leadShortLen = BUDGET - baseSuffix.length;
  let metaDescription: string;
  if (leadLen >= 60) {
    metaDescription = truncateAtSentence(description, leadLen) + richSuffix;
  } else if (leadShortLen >= 60) {
    metaDescription = truncateAtSentence(description, leadShortLen) + baseSuffix;
  } else {
    metaDescription = truncateAtSentence(description, BUDGET);
  }

  // Build hreflang alternates
  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/${category}/${slug}`;
  }

  // Place descriptions only exist in EN/ZH (`place.description.en|zh`). Other
  // 28 locales serve the EN copy verbatim, so canonical points to EN and we
  // ask Google not to index the near-duplicate. og:url still reflects the
  // current locale URL for share previews.
  const translated = isFullyTranslated(locale);
  const canonicalUrl = translated
    ? `https://www.kidsbayarea.com/${locale}/${category}/${slug}`
    : `https://www.kidsbayarea.com/en/${category}/${slug}`;

  const ogDescription = truncateAtSentence(description, 200);

  return {
    title,
    description: metaDescription,
    keywords: [
      place.name,
      `${place.name} ${place.city}`,
      `${place.name} kid-friendly`,
      `${place.name} with kids`,
      `${place.city} family activities`,
      `Bay Area ${categoryLabel?.toLowerCase()}`,
      ...place.tags.map((t) => t.replace(/-/g, " ")),
    ].slice(0, 12),
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title: `${place.name} (${place.city}) — Kid-Friendly Guide`,
      description: ogDescription,
      type: "article",
      url: `https://www.kidsbayarea.com/${locale}/${category}/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${place.name} — Kid-Friendly Guide`,
      description: ogDescription.slice(0, 200),
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

  // JSON-LD: schema.org type chosen by category for stronger AI / rich-result
  // signal than generic LocalBusiness. Kid-friendly amenities and target
  // audience surface in AI-generated answers (ChatGPT, Perplexity, AIO).
  const description = locale === "zh" ? place.description.zh : place.description.en;
  const placeType =
    place.category === "eat"
      ? "Restaurant"
      : place.category === "shop"
      ? "Store"
      : place.category === "learn"
      ? "EducationalOrganization"
      : place.category === "explore"
      ? "TouristAttraction"
      : place.indoorOutdoor === "indoor"
      ? "ChildrensMuseum"
      : "Playground";

  const amenityFeature: Array<Record<string, unknown>> = [];
  if (place.strollerFriendly)
    amenityFeature.push({
      "@type": "LocationFeatureSpecification",
      name: "Stroller-friendly",
      value: true,
    });
  if (place.changingStation)
    amenityFeature.push({
      "@type": "LocationFeatureSpecification",
      name: "Changing station",
      value: true,
    });
  if (place.diningOnSite)
    amenityFeature.push({
      "@type": "LocationFeatureSpecification",
      name: "Dining on site",
      value: true,
    });
  if (place.indoorOutdoor === "indoor")
    amenityFeature.push({
      "@type": "LocationFeatureSpecification",
      name: "Indoor venue",
      value: true,
    });
  if (place.indoorOutdoor === "outdoor")
    amenityFeature.push({
      "@type": "LocationFeatureSpecification",
      name: "Outdoor venue",
      value: true,
    });

  // Derive min/max age from ageRange. "all" maps to 0-12 (our full coverage
  // range). Otherwise pick the lowest band's floor and the highest band's
  // ceiling. The earlier ternary-cascade logic returned reversed values
  // (min=8, max=2) when "all" was present because no specific band matched.
  const AGE_BOUNDS: Record<string, [number, number]> = {
    "0-2": [0, 2],
    "2-5": [2, 5],
    "5-8": [5, 8],
    "8-12": [8, 12],
    all: [0, 12],
  };
  const ageBounds = place.ageRange.map((r) => AGE_BOUNDS[r]).filter(Boolean) as Array<[number, number]>;
  const audienceMinAge = ageBounds.length ? Math.min(...ageBounds.map(([lo]) => lo)) : 0;
  const audienceMaxAge = ageBounds.length ? Math.max(...ageBounds.map(([, hi]) => hi)) : 12;
  const audience = {
    "@type": "PeopleAudience",
    suggestedMinAge: audienceMinAge,
    suggestedMaxAge: audienceMaxAge,
    audienceType: "Families with children",
  };

  // OpeningHoursSpecification — emitted only when verified `hours` data exists
  // on the place. Fabricated hours hurt user trust more than missing hours
  // hurt SEO. Closed days encode as opens/closes both "00:00".
  const openingHoursSpecification = place.hours?.map((block) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: block.days,
    ...(block.closed
      ? { opens: "00:00", closes: "00:00" }
      : { opens: block.opens, closes: block.closes }),
  }));

  // Editorial Review replaces the previous weak AggregateRating(count=1) — a
  // single fake "rating" suppresses rich results in Google. A first-party
  // editorial review with author=Organization is honest and eligible for
  // Review rich snippets. The `tips` field serves as the review body.
  const review = {
    "@type": "Review",
    author: {
      "@type": "Organization",
      name: "Kids Bay Area",
      url: "https://www.kidsbayarea.com",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: place.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: place.tips || description,
    datePublished: "2026-01-01",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": placeType,
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
    review,
    isAccessibleForFree: place.priceLevel === "free",
    priceRange: place.priceLevel === "free" ? "Free" : place.priceLevel,
    audience,
    ...(amenityFeature.length > 0 && { amenityFeature }),
    ...(openingHoursSpecification?.length ? { openingHoursSpecification } : {}),
    ...(place.phone ? { telephone: place.phone } : {}),
    ...(place.permanentlyClosed ? { isPermanentlyClosed: true } : {}),
    url: place.website || `https://www.kidsbayarea.com/${locale}/${place.category}/${place.slug}`,
    sameAs: place.website ? [place.website] : undefined,
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
        name: categoryNames[place.category]?.en || place.category,
        item: `https://www.kidsbayarea.com/${locale}/${place.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: place.name,
      },
    ],
  };

  // Lightweight FAQ schema generated from the place's tips & visit info — gives
  // AI engines (Perplexity, ChatGPT) extractable Q&A blocks for "is X kid-friendly"
  // and "what's there to do at X with kids" style queries.
  const faqItems: Array<{ q: string; a: string }> = [];
  const isZh = locale === "zh";
  const cat = isZh ? categoryNames[place.category]?.zh : categoryNames[place.category]?.en;
  const ageDisplay = place.ageRange.includes("all")
    ? isZh
      ? "全年龄段"
      : "all ages"
    : place.ageRange.join(", ");
  faqItems.push({
    q: isZh ? `${place.name}适合带孩子去吗？` : `Is ${place.name} kid-friendly?`,
    a: isZh
      ? `${place.name}是${place.city}的${cat}类亲子去处，推荐${ageDisplay}。${truncateAtSentence(description, 150)}`
      : `${place.name} is a ${cat?.toLowerCase()} destination in ${place.city} recommended for ${ageDisplay}. ${truncateAtSentence(description, 150)}`,
  });
  if (place.tips) {
    faqItems.push({
      q: isZh
        ? `去${place.name}有什么贴士？`
        : `What should families know before visiting ${place.name}?`,
      a: place.tips,
    });
  }
  if (place.parking) {
    faqItems.push({
      q: isZh ? `${place.name}停车方便吗？` : `Where do families park at ${place.name}?`,
      a: place.parking,
    });
  }
  faqItems.push({
    q: isZh
      ? `${place.name}什么时候去最好？`
      : `When is the best time to visit ${place.name}?`,
    a: place.bestTime ||
      (isZh ? "周末上午通常人较少，体验最佳。" : "Weekend mornings are typically least crowded."),
  });

  // Hours Q&A — answers "X hours saturday"-style GSC queries directly. Only
  // emitted when verified hours data exists; otherwise we'd be guessing.
  if (place.hours && place.hours.length > 0) {
    const hoursText = place.hours
      .map((b) => {
        const dayList = b.days.length === 7 ? (isZh ? "每天" : "Daily") : b.days.join(", ");
        if (b.closed) return isZh ? `${dayList}: 休息` : `${dayList}: Closed`;
        return isZh
          ? `${dayList}: ${b.opens}–${b.closes}${b.note ? `（${b.note}）` : ""}`
          : `${dayList}: ${b.opens}–${b.closes}${b.note ? ` (${b.note})` : ""}`;
      })
      .join(isZh ? "；" : "; ");
    faqItems.push({
      q: isZh ? `${place.name}营业时间是什么？` : `What are the hours for ${place.name}?`,
      a: hoursText + (isZh ? "。建议出发前再核对官方网站。" : ". Verify on the official website before visiting."),
    });
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PlaceDetail place={place} />
    </>
  );
}
