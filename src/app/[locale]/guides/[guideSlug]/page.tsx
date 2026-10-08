import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
import GuideContent from "./GuideContent";
import { getGuideFaq } from "@/lib/guideFaq";

const validGuides = [
  "babies-0-2",
  "toddlers-2-5",
  "kids-5-8",
  "tweens-8-12",
  "rainy-day",
  "family-favorites",
  "birthday-party",
  "free",
  "indoor-playgrounds",
  "museums",
  "fall",
  "field-trips",
  "winter",
  "holiday-lights",
] as const;

type GuideSlug = (typeof validGuides)[number];

const guideMeta: Record<
  GuideSlug,
  { titleEn: string; titleZh: string; descEn: string; descZh: string }
> = {
  "winter": {
    titleEn: "Winter Activities for Kids in the Bay Area \u2014 Ice Skating, Whales & Holiday Trains",
    titleZh: "湾区冬季亲子活动：溜冰、观鲸、象海豹与节日火车",
    descEn:
      "Bay Area winter fun for families: ice skating at Winter Lodge and Sharks Ice, elephant seals at A\u00f1o Nuevo, whale watching from Point Reyes and Pigeon Point, monarch butterflies, rainy-season waterfalls, and Roaring Camp holiday trains.",
    descZh:
      "湾区冬季亲子活动：Winter Lodge 和 Sharks Ice 溜冰、Año Nuevo 看象海豹、Point Reyes 和 Pigeon Point 观鲸、帝王蝶、雨季瀑布，以及 Roaring Camp 节日火车。",
  },
  "holiday-lights": {
    titleEn: "Christmas Lights & Holiday Events for Kids in the Bay Area",
    titleZh: "湾区圣诞灯光与节日亲子活动",
    descEn:
      "Bay Area holiday lights for families: free Christmas in the Park in San Jose, Fantasy of Lights at Vasona Lake, Glowfari at Oakland Zoo, Lightscape at SF Botanical Garden, the Niles Canyon Train of Lights, and where to see Santa.",
    descZh:
      "湾区节日灯光亲子推荐：圣何塞免费的 Christmas in the Park、Vasona Lake 的 Fantasy of Lights、Oakland Zoo 的 Glowfari、SF Botanical Garden 的 Lightscape、Niles Canyon 灯光火车，以及和圣诞老人见面的地方。",
  },
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
    titleEn: "Bay Area Activities for Kids Ages 5–8 — Museums, Indoor Play & STEM Programs",
    titleZh: "湾区儿童活动推荐（5-8岁）",
    descEn:
      "Best Bay Area activities for kids ages 5–8: hands-on science museums, indoor playgrounds, children's art studios, coding programs, and outdoor adventures across SF, East Bay, South Bay, and Peninsula.",
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
      "Best rainy day activities for Bay Area kids: the Exploratorium (SF), Children's Discovery Museum of San Jose, Bay Area Discovery Museum (Sausalito), Sky Zone trampoline parks, and The Tech Interactive.",
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
  "birthday-party": {
    titleEn: "Best Kids Birthday Party Places in the Bay Area",
    titleZh: "湾区儿童生日派对场地推荐",
    descEn:
      "The best venues for kids birthday parties in the Bay Area: indoor playgrounds, trampoline parks, museums, and party-ready spots that handle the setup so you don't have to.",
    descZh:
      "湾区最适合举办儿童生日派对的场地：室内游乐场、蹦床公园、博物馆和省心的派对好去处。",
  },
  free: {
    titleEn: "Free Things to Do with Kids in the Bay Area",
    titleZh: "湾区免费亲子活动大全",
    descEn:
      "Free family activities in the Bay Area that won't cost a thing: parks, beaches, free-admission museums, nature trails, and budget-friendly fun for kids of all ages.",
    descZh:
      "湾区不花钱的亲子好去处：公园、海滩、免费博物馆、自然步道，适合各年龄段孩子的省钱活动。",
  },
  "field-trips": {
    titleEn: "Bay Area Field Trip Ideas for Kids — Museums, Farms & History",
    titleZh: "湾区亲子校外参观推荐：博物馆、农场与历史遗址",
    descEn:
      "Bay Area field trip ideas for kids and groups: science museums, working farms like Ardenwood and Hidden Villa, history sites like John Muir National Historic Site and Fort Point, tide pools, and free options.",
    descZh:
      "湾区亲子和团体校外参观推荐：科学博物馆、Ardenwood 和 Hidden Villa 等农场、John Muir 故居和 Fort Point 等历史遗址、潮池，以及免费去处。",
  },
  fall: {
    titleEn: "Fall Activities & Pumpkin Patches for Kids in the Bay Area",
    titleZh: "湾区秋季亲子活动与南瓜田推荐",
    descEn:
      "Bay Area fall fun for families: Half Moon Bay pumpkin patches, Lemos Farm hay rides, corn mazes, apple picking at Gizdich Ranch, harvest festivals, monarch butterflies, and where to buy Halloween costumes.",
    descZh:
      "湾区秋季亲子活动：Half Moon Bay 南瓜田、Lemos Farm 干草车、玉米迷宫、Gizdich Ranch 摘苹果、丰收节、帝王蝶，以及万圣节服装店推荐。",
  },
  museums: {
    titleEn: "Best Children's Museums & Science Centers in the Bay Area",
    titleZh: "湾区儿童博物馆与科学馆推荐",
    descEn:
      "Bay Area children's and science museums for kids: the Exploratorium, California Academy of Sciences, Children's Discovery Museum of San Jose, Bay Area Discovery Museum, The Tech Interactive, plus free museums and resident free days.",
    descZh:
      "湾区适合孩子的儿童博物馆和科学馆：Exploratorium、California Academy of Sciences、圣何塞儿童探索博物馆、Bay Area Discovery Museum、The Tech Interactive，以及免费博物馆和居民免费日。",
  },
  "indoor-playgrounds": {
    titleEn: "Best Indoor Playgrounds for Kids in the Bay Area",
    titleZh: "湾区室内游乐场推荐",
    descEn:
      "The best indoor playgrounds and play spaces in the Bay Area: soft-play areas, climbing structures, trampoline parks, and indoor fun perfect for any weather.",
    descZh:
      "湾区最棒的室内游乐场和游玩空间：软体游乐区、攀爬设施、蹦床公园，任何天气都能玩。",
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
  const faq = getGuideFaq(guideSlug, locale);
  const faqJsonLd = faq && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.entries.map((e) => ({
      "@type": "Question",
      name: e.q,
      acceptedAnswer: { "@type": "Answer", text: e.a },
    })),
  };

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <GuideContent guideSlug={guideSlug as GuideSlug} meta={meta} />
    </>
  );
}
