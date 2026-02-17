import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Blocks, UtensilsCrossed, GraduationCap, ShoppingBag, Compass } from "lucide-react";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import BayAreaMap from "@/components/BayAreaMap";
import TodaysPick from "@/components/TodaysPick";
import SeasonalBanner from "@/components/SeasonalBanner";
import FadeIn from "@/components/FadeIn";

const categories = [
  { href: "/play", icon: Blocks, gradient: "bg-gradient-to-br from-green-500 to-emerald-600", key: "play" },
  { href: "/eat", icon: UtensilsCrossed, gradient: "bg-gradient-to-br from-orange-500 to-red-500", key: "eat" },
  { href: "/learn", icon: GraduationCap, gradient: "bg-gradient-to-br from-blue-500 to-cyan-500", key: "learn" },
  { href: "/shop", icon: ShoppingBag, gradient: "bg-gradient-to-br from-purple-500 to-pink-500", key: "shop" },
  { href: "/explore", icon: Compass, gradient: "bg-gradient-to-br from-teal-500 to-cyan-600", key: "explore" },
] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  return (
    <>
      <Hero />
      <TodaysPick />
      <SeasonalBanner />

      <FadeIn>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("categories.section_title")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.key}
                href={cat.href}
                icon={cat.icon}
                title={t(`categories.${cat.key}.title`)}
                description={t(`categories.${cat.key}.description`)}
                cta={t(`categories.${cat.key}.cta`)}
                gradient={cat.gradient}
              />
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn>
        <BayAreaMap />
      </FadeIn>
    </>
  );
}
