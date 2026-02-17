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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kidsbayarea.com"),
  title: {
    default: "Kids Bay Area - Family Activity Guide",
    template: "%s | Kids Bay Area",
  },
  description:
    "The ultimate guide for family activities in the Bay Area. Find playgrounds, kid-friendly restaurants, classes, and weekend adventures.",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Kids Bay Area",
        url: "https://www.kidsbayarea.com",
        description:
          "The ultimate guide for family activities in the Bay Area. Find playgrounds, kid-friendly restaurants, classes, and weekend adventures.",
        inLanguage: locale,
      },
      {
        "@type": "Organization",
        name: "Kids Bay Area",
        url: "https://www.kidsbayarea.com",
        logo: "https://www.kidsbayarea.com/logo.png",
      },
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
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
        <GoogleAnalytics GA_MEASUREMENT_ID="G-XXXXXXXXXX" />
        <NextIntlClientProvider messages={messages}>
          <FavoritesProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <BackToTop />
            <MobileNav />
          </FavoritesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
