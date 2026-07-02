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
    titleEn: "Bay Area Toddler Activities (Ages 2–5) — Play Spaces, Splash Pads & More",
    titleZh: "湾区幼儿活动推荐（2-5岁）",
    descEn:
      "Best things to do with toddlers in the Bay Area: indoor play cafes, splash pads, free petting farms, discovery museums, and stroller-friendly playgrounds for ages 2–5.",
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
    titleEn: "Bay Area Activities for Tweens (Ages 8–12) — Things to Do with Older Kids",
    titleZh: "湾区少年活动推荐（8-12岁）",
    descEn:
      "Best Bay Area activities for tweens ages 8–12: climbing gyms, trampoline parks, escape rooms, STEM camps, amusement parks, and after-school programs across SF, East Bay, and South Bay.",
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

// FAQPage JSON-LD for toddlers-2-5 guide. Targets "things to do with toddlers bay
// area" and "toddler activities san francisco" (DataForSEO: 0 rank, competitors #1-5).
// Venues and cities sourced from places.ts; no prices, hours, or ages fabricated.
const toddlersFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best toddler activities in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area activities for toddlers (ages 2–5) include Bay Area Discovery Museum in Sausalito (outdoor tide pools and hands-on exhibits), Habitot Children's Museum in Berkeley (designed for under-5s), Children's Fairyland in Oakland (pint-sized amusement park), Tilden Little Farm in Berkeley (free petting farm, open daily), La Petite Playhouse in Redwood City (large indoor play structure), and splash pads at Castro Valley Splash Park and Larkey Sprayground in Walnut Creek. Check each venue's website for current hours and admission.",
      },
    },
    {
      "@type": "Question",
      name: "Where can toddlers play indoors in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Indoor toddler play spaces in the Bay Area include Habitot Children's Museum (Berkeley), Bay Area Discovery Museum (Sausalito — indoor and outdoor areas), La Petite Playhouse (Redwood City), WOW Kids Playground (San Jose), Lemon Tree Play Cafe (San Jose), Imagination City (San Jose), and KidTopia (San Jose). Many community recreation centers also offer toddler open-play and drop-in gym sessions — check local schedules.",
      },
    },
    {
      "@type": "Question",
      name: "Are there free activities for toddlers in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Free toddler-friendly activities in the Bay Area include Tilden Little Farm in Berkeley (free, open 365 days a year — bring celery and lettuce for the goats), all municipal playgrounds and inclusive Magical Bridge Playgrounds (Palo Alto, Sunnyvale, Mountain View), seasonal splash pads at 24th & York Mini Park in San Francisco and Castro Valley Splash Park, and free public library story-times throughout Santa Clara County, San Francisco, and the East Bay.",
      },
    },
    {
      "@type": "Question",
      name: "What stroller-friendly activities are available for toddlers in San Francisco?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Stroller-friendly San Francisco toddler activities include the Koret Children's Quarter playground in Golden Gate Park (flat paved paths), Yerba Buena Gardens Playground and Children's Garden, Crissy Field lawn areas, 24th & York Mini Park splash pad in the Mission, Children's Creativity Museum near Union Square, and the Exploratorium at Pier 15 (wide aisles, stroller parking at the entrance). Most Bay Area Discovery Museum trails in Sausalito are also stroller-accessible.",
      },
    },
  ],
};

// FAQPage JSON-LD for tweens-8-12 guide. Targets "things to do with tweens",
// "activities for 12 year old boys", "after school activities for 12 year olds"
// (all ranking pos 3–11 per GSC with low/no clicks — snippet is the bottleneck).
const tweensFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best activities for tweens (ages 8–12) in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area activities for tweens include rock climbing at Berkeley Ironworks, Planet Granite (Belmont, San Francisco, Sunnyvale), or Diablo Rock Gym; trampoline parks at Sky Zone Fremont and Dublin and House of Air at the Presidio; amusement parks at California's Great America (Santa Clara); laser tag at Laser Tagging Inc.; and adventure-park arcade experiences at Round1 in San Jose, Concord, and Hayward. For outdoor adventures, hiking Mount Diablo State Park or exploring Redwood Regional Park (Oakland) fits tweens well.",
      },
    },
    {
      "@type": "Question",
      name: "What after-school programs and classes are available for 8–12 year olds in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bay Area after-school programs for tweens include coding and STEM camps at iD Tech (Stanford campus), Code Ninjas (Cupertino, North San Jose, Fremont), and Galileo camps. Martial arts is offered widely, including programs in Berkeley and San Jose. For sports, fencing at Halberstadt Fencers Club (San Francisco) and climbing at Berkeley Ironworks both have structured youth tracks. The Tech Interactive (San Jose) runs ongoing design challenges and weekend workshops for this age group.",
      },
    },
    {
      "@type": "Question",
      name: "Where can tweens go with friends in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tween-friendly Bay Area group outings include bowling at Lucky Strike Alameda or Lucky Strike San Francisco; mini-golf at Stagecoach Greens (San Francisco) or Urban Putt San Jose; arcade-style entertainment at Round1 (San Jose, Concord, Hayward); and ice skating at Nazareth Ice Oasis (Fremont), Snoopy's Home Ice (Santa Rosa), or Oakland Ice Center. For outdoors, Roaring Camp Railroads in Felton and the Santa Cruz Beach Boardwalk (free admission, pay-per-ride) are popular tween destinations.",
      },
    },
  ],
};

// FAQPage JSON-LD for rainy-day guide. Targets "rainy day activities kids bay
// area" — competitors rank #1-2 on DataForSEO while we don't appear. Answers
// name venues + city + general category ONLY: no specific prices, hours,
// addresses, or free-admission windows (those weren't sourced from places.ts
// and age badly — an earlier draft cited a trampoline park that has since
// closed). Defer specifics to "check the venue's website."
const rainyDayFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are the best rainy day activities for kids in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Top Bay Area rainy-day activities for kids include the Exploratorium in San Francisco (hands-on science), the Children's Discovery Museum of San Jose, the Bay Area Discovery Museum in Sausalito (great for younger children), the Children's Creativity Museum in San Francisco, The Tech Interactive in San Jose, and Chabot Space and Science Center in Oakland. For active kids, Sky Zone trampoline parks in Fremont and Dublin are indoors year-round. Check each venue's website for current hours and admission.",
      },
    },
    {
      "@type": "Question",
      name: "Are there free indoor activities for kids on rainy days in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Free or low-cost rainy-day options include public library story times and kids' programs (such as the San Francisco, Santa Clara County, and Oakland public library systems), the East Bay Depot for Creative Reuse in Oakland, and the Randall Museum in San Francisco. Hours and admission vary by location and season — check each venue's website for current details.",
      },
    },
    {
      "@type": "Question",
      name: "Where can toddlers go on rainy days in the Bay Area?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The best rainy-day spots for Bay Area toddlers are the Bay Area Discovery Museum in Sausalito, Habitot Children's Museum in Berkeley (designed for younger children), the Children's Discovery Museum of San Jose, La Petite Playhouse in San Francisco, and Little Gym locations in Palo Alto, San Jose, and Danville. Many community recreation centers also offer indoor family swim times — check local schedules.",
      },
    },
    {
      "@type": "Question",
      name: "What indoor play spaces near San Francisco are good on rainy days?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Indoor play spaces near San Francisco include the Exploratorium and the Children's Creativity Museum, both in San Francisco. A short drive away, the Bay Area Discovery Museum in Sausalito and Chabot Space and Science Center in Oakland offer indoor exhibits. Check each venue's website for current hours and tickets.",
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
      {guideSlug === "rainy-day" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rainyDayFaqJsonLd) }}
        />
      )}
      {guideSlug === "toddlers-2-5" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(toddlersFaqJsonLd) }}
        />
      )}
      {guideSlug === "tweens-8-12" && locale === "en" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tweensFaqJsonLd) }}
        />
      )}
      <GuideContent guideSlug={guideSlug as GuideSlug} meta={meta} />
    </>
  );
}
