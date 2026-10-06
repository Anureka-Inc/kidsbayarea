import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Home, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, isFullyTranslated } from "@/i18n/routing";
import PlaceCard from "@/components/PlaceCard";
import { cityHubs, getCityHub, cityFaq, headlineActivities } from "@/lib/cities";
import type { Category } from "@/data/places";

// Same ISR policy as guides: pre-render EN, other locales on demand.
export const revalidate = 86400;

export function generateStaticParams() {
  return cityHubs.map((c) => ({ locale: "en", city: c.slug }));
}

const categoryOrder: Category[] = ["play", "explore", "learn", "eat", "shop"];
const categoryLabels: Record<Category, { en: string; zh: string; emoji: string }> = {
  play: { en: "Play & Activities", zh: "玩乐活动", emoji: "🎪" },
  explore: { en: "Parks & Outings", zh: "公园与出行", emoji: "🧭" },
  learn: { en: "Classes & Museums", zh: "课程与博物馆", emoji: "📚" },
  eat: { en: "Kid-Friendly Restaurants", zh: "亲子餐厅", emoji: "🍽️" },
  shop: { en: "Family Shopping", zh: "亲子购物", emoji: "🛍️" },
};

function copy(hub: NonNullable<ReturnType<typeof getCityHub>>, locale: string) {
  const top = headlineActivities(hub)
    .slice(0, 3)
    .map((p) => p.name);
  const n = hub.places.length;
  return locale === "zh"
    ? {
        title: `${hub.name} 亲子好去处 · ${n} 个推荐`,
        description: `${hub.name}（${hub.regionZh}）带孩子去哪儿：${top.join("、")} 等 ${n} 个亲子地点，含游乐、公园、课程、亲子餐厅和购物。`,
      }
    : {
        title: `Things to Do with Kids in ${hub.name} — ${n} Family-Friendly Places`,
        description: `Kid-friendly things to do in ${hub.name}${hub.regionEn === hub.name ? "" : ` (${hub.regionEn})`}: ${top.join(", ")}, and more — ${n} family spots including play, parks, classes, restaurants, and shops.`,
      };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city } = await params;
  const hub = getCityHub(city);
  if (!hub) return { title: "Not Found", robots: { index: false, follow: false } };

  const { title, description } = copy(hub, locale);
  const languages: Record<string, string> = {};
  for (const alt of routing.locales) {
    languages[alt] = `https://www.kidsbayarea.com/${alt}/cities/${city}`;
  }
  const translated = isFullyTranslated(locale);
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.kidsbayarea.com/${translated ? locale : "en"}/cities/${city}`,
      languages,
    },
    openGraph: { title, description },
    ...(translated ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city } = await params;
  const hub = getCityHub(city);
  if (!hub) notFound();
  setRequestLocale(locale);

  const zh = locale === "zh";
  const { title, description } = copy(hub, locale);
  const faq = cityFaq(hub, zh ? "zh" : "en");
  const groups = categoryOrder
    .map((cat) => ({ cat, list: hub.places.filter((p) => p.category === cat) }))
    .filter((g) => g.list.length > 0);
  const otherCities = cityHubs.filter((c) => c.slug !== hub.slug);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    numberOfItems: hub.places.length,
    itemListElement: hub.places.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.kidsbayarea.com/${locale}/${p.category}/${p.slug}`,
      name: p.name,
    })),
  };

  return (
    <>
      {faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="transition-colors hover:text-teal-600 dark:hover:text-teal-400">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-gray-900 dark:text-white">{hub.name}</span>
        </nav>

        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{description}</p>
        </div>

        {groups.map(({ cat, list }) => (
          <section key={cat} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <span>{categoryLabels[cat].emoji}</span>
              {zh ? categoryLabels[cat].zh : categoryLabels[cat].en}
              <span className="text-sm font-normal text-gray-400">({list.length})</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <PlaceCard key={p.slug} place={p} />
              ))}
            </div>
          </section>
        ))}

        {faq.length > 0 && (
          <section className="mt-12 rounded-2xl border border-teal-100 bg-teal-50 p-6 dark:border-teal-800 dark:bg-teal-900/20">
            <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              {zh ? `${hub.name} 亲子常见问题` : `Kids in ${hub.name}: FAQ`}
            </h2>
            <div className="space-y-6">
              {faq.map((f) => (
                <div key={f.q}>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{f.q}</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            {zh ? "其他城市" : "More Bay Area Cities"}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {otherCities.map((c) => (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-medium text-gray-700 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-teal-600 dark:hover:bg-teal-900/30"
              >
                {c.name} <span className="text-gray-400">({c.places.length})</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
