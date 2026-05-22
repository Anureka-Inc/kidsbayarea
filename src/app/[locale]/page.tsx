import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { routing, isFullyTranslated } from "@/i18n/routing";
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

  const translated = isFullyTranslated(locale);
  const canonicalUrl = translated
    ? `https://www.kidsbayarea.com/${locale}`
    : `https://www.kidsbayarea.com/en`;

  return {
    title: t("title"),
    description: t("description"),
    alternates: { canonical: canonicalUrl, languages: alternates },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
  };
}

// FAQ items are aligned with real Google Search Console queries hitting this
// site (toddler activities, things to do for tweens, kid-friendly restaurants,
// rainy-day indoor activities, free things to do, day trips). Order matters:
// the first 2-3 are eligible for "People Also Ask" / AI Overview citations.
const faqItems = [
  {
    question: "What are the best things to do with kids in the Bay Area?",
    answer:
      "Top family destinations in the SF Bay Area include the Exploratorium and Children's Creativity Museum (San Francisco), Bay Area Discovery Museum (Sausalito), Children's Discovery Museum (San Jose), Oakland Zoo, Happy Hollow Park & Zoo, Tilden Park Steam Trains and Little Farm, the Lawrence Hall of Science (Berkeley), and Bay Area Discovery Museum in Sausalito. Browse 500+ kid-friendly places by category, age range, and region.",
  },
  {
    question: "What can toddlers (ages 2-5) do in the Bay Area?",
    answer:
      "Great toddler activities in the Bay Area include splash pads and playgrounds (24th & York Mini Park, Yerba Buena Gardens, Magical Bridge Playground), the Bay Area Discovery Museum, Tilden Little Farm, the Randall Museum's toddler storytime, and indoor play spaces. Filter our site by age 2-5 to see all toddler-friendly options including stroller accessibility and changing stations.",
  },
  {
    question: "What are fun things to do for 12-year-olds in the Bay Area?",
    answer:
      "Tweens (ages 8-12) love Raging Waters San Jose, Six Flags Discovery Kingdom, the Exploratorium, Santa Cruz Beach Boardwalk, Sky Zone Trampoline Park (Fremont/Dublin), Berkeley's Adventure Playground, Roaring Camp Railroads, escape rooms, and coding classes at Code Ninjas. Many of these also work for older teens.",
  },
  {
    question: "What are the best Bay Area day trips with kids?",
    answer:
      "Top family day trips from the Bay Area include Monterey Bay Aquarium, Santa Cruz Beach Boardwalk, Muir Woods National Monument, Angel Island State Park (ferry from Tiburon or San Francisco), Half Moon Bay pumpkin patches and tide pools, Roaring Camp Railroads in Felton, Point Reyes National Seashore, and Gilroy Gardens Family Theme Park. Most are within a 1-2 hour drive.",
  },
  {
    question: "Are there kid-friendly restaurants in San Francisco and the Bay Area?",
    answer:
      "Yes — kid-friendly Bay Area restaurants include Mel's Drive-In (San Francisco), Benihana (Cupertino, Santa Clara, Millbrae, San Jose), Spaghetti Factory (downtown San Jose), Homeroom (Oakland mac & cheese), Super Duper Burgers, Lazy Dog Restaurant & Bar, In-N-Out Burger, Sizzler (Milpitas), and Din Tai Fung (Santa Clara). Many feature kids' menus, high chairs, and family-friendly atmospheres.",
  },
  {
    question: "What are fun indoor activities for kids on a rainy day in the Bay Area?",
    answer:
      "Indoor rainy-day options include the Exploratorium, California Academy of Sciences, Bay Area Discovery Museum, Children's Discovery Museum (San Jose), the Tech Interactive, Chabot Space and Science Center, Children's Creativity Museum, indoor trampoline parks (Sky Zone Fremont, Dublin), indoor climbing gyms, Lakeshore Learning stores, and the Randall Museum.",
  },
  {
    question: "Are there free things to do with kids in the Bay Area?",
    answer:
      "Yes — Bay Area free family activities include Tilden Park Little Farm (Berkeley), Golden Gate Park playgrounds (Koret Children's Quarter), Crissy Field, Yerba Buena Gardens playground, Magical Bridge Playgrounds (Palo Alto, Sunnyvale), the Berkeley Marina Adventure Playground (free entrance), the East Bay Depot for Creative Reuse, Shoreline Park playground (Mountain View), and most regional parks and beaches. Filter our site by price = free to see all options.",
  },
  {
    question: "How do I find activities for my child's specific age?",
    answer:
      "Use our age-based guides: Babies (0-2), Toddlers (2-5), Kids (5-8), and Tweens (8-12). Each filter narrows by stroller accessibility, changing-station availability, indoor vs. outdoor, price level, and region (SF, East Bay, South Bay, Peninsula, North Bay).",
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
