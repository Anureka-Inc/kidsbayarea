import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import PlannerContent from "./PlannerContent";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title =
    locale === "zh"
      ? "周末计划器 - 一键生成亲子一日行程"
      : "Weekend Planner - Generate a Family Day Itinerary";
  const description =
    locale === "zh"
      ? "选择区域、孩子年龄和偏好，自动生成湾区亲子一日行程：上午活动、午餐、下午活动。"
      : "Pick your region, child's age, and preferences to generate a perfect Bay Area family day: morning activity, lunch, afternoon fun.";

  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}/planner`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.kidsbayarea.com/${locale}/planner`,
      languages: alternates,
    },
  };
}

export default async function PlannerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PlannerContent />;
}
