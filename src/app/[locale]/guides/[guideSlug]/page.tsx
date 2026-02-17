import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
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
    titleEn: "Rainy Day Activities for Kids in the Bay Area",
    titleZh: "湾区雨天亲子活动指南",
    descEn:
      "Indoor play spaces, museums, and activities for when the weather keeps you inside. Never be bored on a rainy day!",
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

export function generateStaticParams() {
  const params: { locale: string; guideSlug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of validGuides) {
      params.push({ locale, guideSlug: slug });
    }
  }
  return params;
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

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.kidsbayarea.com/${locale}/guides/${guideSlug}`,
      languages: alternates,
    },
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

  return <GuideContent guideSlug={guideSlug as GuideSlug} meta={meta} />;
}
