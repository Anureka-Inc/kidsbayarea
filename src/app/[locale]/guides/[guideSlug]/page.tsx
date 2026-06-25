import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import GuideContent from "./GuideContent";

const validGuides = [
  "babies-0-2",
  "toddlers-2-5",
  "kids-5-8",
  "tweens-8-12",
  "rainy-day",
  "family-favorites",
] as const;

type GuideSlug = (typeof validGuides)[number];

const guideMeta: Record<
  GuideSlug,
  { titleEn: string; titleZh: string; descEn: string; descZh: string }
> = {
  "babies-0-2": {
    titleEn: "Best Bay Area Activities for Babies (0-2 Years)",
    titleZh: "湾区宝宝活动推荐（0-2岁）",
    descEn:
      "Safe, stroller-friendly, and baby-approved activities in the Bay Area. Find the best spots for crawlers and early walkers.",
    descZh:
      "安全、婴儿车友好、适合宝宝的湾区活动。找到最适合爬行和学步宝宝的好去处。",
  },
  "toddlers-2-5": {
    titleEn: "Best Bay Area Activities for Toddlers (2-5 Years)",
    titleZh: "湾区幼儿活动推荐（2-5岁）",
    descEn:
      "Interactive, imaginative play spaces and activities for toddlers in the Bay Area. Perfect for curious little explorers.",
    descZh:
      "互动性强、充满想象力的湾区幼儿活动空间。适合好奇的小小探险家。",
  },
  "kids-5-8": {
    titleEn: "Best Bay Area Activities for Kids (5-8 Years)",
    titleZh: "湾区儿童活动推荐（5-8岁）",
    descEn:
      "STEM, sports, adventure, and educational activities for school-age kids in the Bay Area.",
    descZh: "STEM、运动、探险和教育活动，适合学龄儿童的湾区好去处。",
  },
  "tweens-8-12": {
    titleEn: "Best Bay Area Activities for Tweens (8-12 Years)",
    titleZh: "湾区少年活动推荐（8-12岁）",
    descEn:
      "Challenging activities, tech camps, outdoor adventures, and more for older kids in the Bay Area.",
    descZh:
      "挑战性活动、科技营、户外探险，适合大孩子的湾区好去处。",
  },
  "rainy-day": {
    titleEn: "Rainy Day Activities for Kids in the Bay Area — Indoor Fun",
    titleZh: "湾区雨天亲子活动指南",
    descEn:
      "Best rainy day activities for Bay Area kids: children's museums, trampoline parks, indoor play spaces, and science centers. Never be stuck at home on a rainy day.",
    descZh:
      "室内游乐场、博物馆和室内活动，雨天也不无聊！",
  },
  "family-favorites": {
    titleEn: "Top-Rated Family Favorites in the Bay Area",
    titleZh: "湾区亲子活动最受欢迎排行",
    descEn:
      "The highest-rated, most-loved family activities in the Bay Area. Places the whole family will enjoy together.",
    descZh:
      "湾区评分最高、最受家庭喜爱的亲子活动。全家老少都开心的好去处。",
  },
};

// ISR: guides pages inline filtered places, so 30 locales × 6 guides bloats
// the artifact. Pre-render English only; other locales render on demand and
// are cached for 24h via the export below.
export const revalidate = 86400;

export function generateStaticParams() {
  return validGuides.map((slug) => ({ locale: "en", guideSlug: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; guideSlug: string }>;
}): Promise<Metadata> {
  const { locale, guideSlug } = await params;
  const meta = guideMeta[guideSlug as GuideSlug];

  if (!meta) return { title: "Not Found" };

  const title = locale === "zh" ? meta.titleZh : meta.titleEn;
  const description = locale === "zh" ? meta.descZh : meta.descEn;

  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/guides/${guideSlug}`;
  }

  // Untranslated locales serve EN body content, so we point canonical at the
  // EN version and ask Google not to index the duplicate. hreflang still maps
  // the language variants for users who switch via the language picker.
  const translated = isFullyTranslated(locale);
  const canonicalUrl = translated
    ? `https://www.kidsbayarea.com/${locale}/guides/${guideSlug}`
    : `https://www.kidsbayarea.com/en/guides/${guideSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    ...(translated
      ? {}
      : { robots: { index: false, follow: true } }),
  };
}

// FAQPage JSON-LD for rainy-day guide. Targets "rainy day activities kids bay
// area" — competitors rank #1-2 on DataForSEO while we don't appear; concrete
// venue names per answer make these extractable by Google AIO / Perplexity.
const rainyDayFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best rainy day activities for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area rainy day activities for kids include the Exploratorium (Pier 15, San Francisco — hands-on science for ages 5+), Children's Discovery Museum of San Jose (255 Almaden Blvd), Bay Area Discovery Museum (Sausalito — best for ages 1-8), Children's Creativity Museum (SF — art and digital media), The Tech Interactive (San Jose — free on Sunday afternoons), and Chabot Space and Science Center (Oakland). For active kids, Sky Zone trampoline parks in Fremont and Dublin are open year-round indoors.",
      },
    },
    {
      "@type": "Question",
      name: "Are there free indoor activities for kids on rainy days in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Free or low-cost rainy day options include the San Jose Public Library with kids' programs, East Bay Depot for Creative Reuse (drop-in art supplies by donation), many public library story times (check SFPL, SCCL, and Oakland Public Library schedules), Lakeshore Learning free Saturday crafts (11am–3pm at San Jose, San Leandro, and Walnut Creek locations), and Randall Museum in San Francisco (free admission, hands-on nature exhibits). The Tech Interactive in San Jose offers free Sunday admission from 3–5pm.",
      },
    },
    {
      "@type": "Question",
      name: "Where can toddlers go on rainy days in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best rainy day spots for Bay Area toddlers (ages 1-4) are Bay Area Discovery Museum in Sausalito (dedicated Tot Spot play area), Habitot Children's Museum in Berkeley (designed for ages 0-6), Children's Discovery Museum of San Jose (Under-5 zone with water play), La Petite Playhouse in San Francisco, and Little Gym locations in Palo Alto, San Jose, and Danville. Indoor pools at community recreation centers often have family swim sessions on rainy days.",
      },
    },
    {
      "@type": "Question",
      name: "What indoor play spaces near San Francisco are good on rainy days?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Indoor play spaces near San Francisco for rainy days: Exploratorium at Pier 15 (all ages, buy timed tickets in advance), Children's Creativity Museum in SOMA (ages 3-12, art and tech exhibits), House of Air trampoline park at the Presidio (SF — ages 3+, jump sessions from $15), Koret Children's Quarter at Golden Gate Park has a covered carousel and sandbox area. For a short drive: Bay Area Discovery Museum in Sausalito (20 min from SF) and Chabot Space and Science Center in Oakland (25 min from SF).",
      },
    },
  ],
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; guideSlug: string }>;
}) {
  const { locale, guideSlug } = await params;

  if (!validGuides.includes(guideSlug as GuideSlug)) {
    notFound();
  }

  setRequestLocale(locale);

  const meta = guideMeta[guideSlug as GuideSlug];

  return (
    <>
      {guideSlug === "rainy-day" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rainyDayFaqJsonLd) }}
        />
      )}
      <GuideContent guideSlug={guideSlug as GuideSlug} meta={meta} />
    </>
  );
}
