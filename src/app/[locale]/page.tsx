import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { Blocks, UtensilsCrossed, GraduationCap, ShoppingBag, Compass } from "lucide-react";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import AgeGuides from "@/components/AgeGuides";
import BayAreaMap from "@/components/BayAreaMap";
import TodaysPick from "@/components/TodaysPick";
import SeasonalBanner from "@/components/SeasonalBanner";
import NewsletterSignup from "@/components/NewsletterSignup";
import CommunitySection from "@/components/CommunitySection";
import FadeIn from "@/components/FadeIn";

const categories = [
  { href: "/play", icon: Blocks, gradient: "bg-gradient-to-br from-green-500 to-emerald-600", key: "play" },
  { href: "/eat", icon: UtensilsCrossed, gradient: "bg-gradient-to-br from-orange-500 to-red-500", key: "eat" },
  { href: "/learn", icon: GraduationCap, gradient: "bg-gradient-to-br from-blue-500 to-cyan-500", key: "learn" },
  { href: "/shop", icon: ShoppingBag, gradient: "bg-gradient-to-br from-purple-500 to-pink-500", key: "shop" },
  { href: "/explore", icon: Compass, gradient: "bg-gradient-to-br from-teal-500 to-cyan-600", key: "explore" },
] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  const alternates: Record<string, string> = {};
  for (const altLocale of routing.locales) {
    alternates[altLocale] = `https://www.kidsbayarea.com/${altLocale}`;
  }

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `https://www.kidsbayarea.com/${locale}`,
      languages: alternates,
    },
  };
}

const faqItems = [
  {
    question: "What are the best kid-friendly activities in the Bay Area?",
    answer: "The Bay Area offers hundreds of family activities including the Exploratorium, Bay Area Discovery Museum, Children's Creativity Museum, Oakland Zoo, Happy Hollow Park, and many playgrounds, kid-friendly restaurants, and outdoor adventures.",
  },
  {
    question: "Where can I find indoor play spaces for kids in the Bay Area?",
    answer: "Popular indoor play spaces include Bay Area Discovery Museum in Sausalito, Children's Discovery Museum in San Jose, Habitot Children's Museum in Berkeley, and the Exploratorium in San Francisco. Our site lists all indoor-friendly venues with age recommendations.",
  },
  {
    question: "What are the best Bay Area day trips with kids?",
    answer: "Great family day trips include Monterey Bay Aquarium, Santa Cruz Beach Boardwalk, Muir Woods, Point Reyes, Roaring Camp Railroads, and Gilroy Gardens. Most are within 1-2 hours drive from San Francisco.",
  },
  {
    question: "How do I find activities for my child's specific age?",
    answer: "Use our age-based guides: Babies (0-2), Toddlers (2-5), Kids (5-8), and Tweens (8-12). Each guide filters activities appropriate for that age range, including safety considerations like stroller accessibility and changing stations.",
  },
  {
    question: "Are there free things to do with kids in the Bay Area?",
    answer: "Yes! Many Bay Area parks, playgrounds, and nature trails are free. Golden Gate Park, Tilden Regional Park, and numerous city playgrounds offer free family fun. Our site lets you filter by price level including free options.",
  },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeContent />
    </>
  );
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
        <AgeGuides />
      </FadeIn>

      <FadeIn>
        <CommunitySection />
      </FadeIn>

      <FadeIn>
        <NewsletterSignup />
      </FadeIn>

      <FadeIn>
        <BayAreaMap />
      </FadeIn>
    </>
  );
}
