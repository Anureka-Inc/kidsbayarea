import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Baby } from "lucide-react";
import "@/app/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import MobileNav from "@/components/MobileNav";
import FavoritesProvider from "@/components/FavoritesProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// Pre-render English only. Each locale layout pre-renders every static child
// page (home, categories, etc.) and each child inlines all 533 places, so 30
// locales × ~8 pages each balloons the SSR Lambda artifact past Amplify's
// 220MB limit. Other locales render on first hit and are cached for 24h.
export const revalidate = 86400;

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kidsbayarea.com"),
  title: {
    default: "Bay Area Kids: 500+ Family Activities & Day Trips",
    template: "%s | Kids Bay Area",
  },
  description:
    "The complete guide for Bay Area kids — 500+ playgrounds, kid-friendly restaurants, museums, classes, and day trips across San Francisco, East Bay, South Bay, Peninsula, and North Bay.",
  applicationName: "Kids Bay Area",
  authors: [{ name: "Kids Bay Area Editors" }],
  generator: "Next.js",
  keywords: [
    "bay area kids",
    "kids bay area",
    "things to do with kids bay area",
    "bay area family activities",
    "san francisco kids activities",
    "kid-friendly bay area",
    "bay area playgrounds",
    "bay area day trips with kids",
    "湾区遛娃",
    "旧金山遛娃",
  ],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  openGraph: {
    siteName: "Kids Bay Area",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  // Rich Organization + WebSite + SearchAction graph. The SearchAction lets
  // AI engines like Google AIO surface our internal search. areaServed +
  // knowsAbout + alternateName teach LLMs that "Kids Bay Area" is the entity
  // for "bay area kids" / "湾区遛娃" / "things to do with kids bay area".
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.kidsbayarea.com/#website",
        name: "Kids Bay Area",
        alternateName: ["Bay Area Kids", "湾区遛娃指南", "Kids Bay Area Guide"],
        url: "https://www.kidsbayarea.com",
        description:
          "The complete guide for Bay Area kids — 500+ playgrounds, kid-friendly restaurants, museums, classes, and day trips across the SF Bay Area.",
        inLanguage: locale,
        publisher: { "@id": "https://www.kidsbayarea.com/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `https://www.kidsbayarea.com/${locale}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.kidsbayarea.com/#organization",
        name: "Kids Bay Area",
        alternateName: ["Bay Area Kids", "湾区遛娃指南"],
        url: "https://www.kidsbayarea.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.kidsbayarea.com/favicon.svg",
          width: 512,
          height: 512,
        },
        description:
          "Editorial guide to 500+ kid-friendly activities, playgrounds, restaurants, classes, and day trips in the San Francisco Bay Area.",
        areaServed: [
          { "@type": "Place", name: "San Francisco Bay Area" },
          { "@type": "City", name: "San Francisco" },
          { "@type": "City", name: "Oakland" },
          { "@type": "City", name: "Berkeley" },
          { "@type": "City", name: "San Jose" },
          { "@type": "City", name: "Palo Alto" },
          { "@type": "City", name: "Sausalito" },
        ],
        knowsAbout: [
          "Bay Area kid-friendly activities",
          "San Francisco playgrounds",
          "family day trips Bay Area",
          "toddler activities Bay Area",
          "indoor activities Bay Area",
          "kid-friendly restaurants",
          "children's museums",
          "Bay Area parks",
        ],
        audience: {
          "@type": "PeopleAudience",
          audienceType: "Parents and families with children ages 0-12",
        },
      },
    ],
  };

  const rtlLocales = ["ar", "he"];
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var c=localStorage.getItem('theme');if(c==='dark'||((!c||c==='system')&&window.matchMedia('(prefers-color-scheme:dark)').matches)){d.classList.add('dark')}else{d.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-teal-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to content
        </a>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <NextIntlClientProvider messages={messages}>
          <FavoritesProvider>
            <Header />
            <main id="main-content" className="min-h-screen">{children}</main>
            <Footer />
            <BackToTop />
            <MobileNav />
          </FavoritesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
