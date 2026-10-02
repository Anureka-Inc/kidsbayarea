import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: [
    "en",
    "zh",
    "es",
    "ja",
    "ko",
    "fr",
    "de",
    "pt",
    "it",
    "ru",
    "ar",
    "hi",
    "th",
    "vi",
    "id",
    "tr",
    "nl",
    "pl",
    "sv",
    "da",
    "nb",
    "fi",
    "cs",
    "he",
    "ms",
    "tl",
    "uk",
    "ro",
    "hu",
    "el",
  ],
  defaultLocale: "en",
  // next-intl's default HTTP `Link` header advertised the UNPREFIXED path
  // (e.g. /guides/foo) as hreflang x-default, but that path only 307s to
  // /en/... — Google then kept the redirecting URL as the indexed one and the
  // real /en pages showed no GSC data. Page metadata + sitemap.ts already
  // declare hreflang (x-default → /en), so the header is redundant.
  alternateLinks: false,
});

// Locales where place/guide/planner content (titles, descriptions, body text)
// is actually translated. The other 28 locales currently fall back to English
// content, so Google flags them as duplicates of the EN version. Pages outside
// this set get `robots: noindex` + canonical → EN until proper translations
// land, and they're excluded from the sitemap. The UI is still browsable in
// those locales via in-site language switching.
export const fullyTranslatedLocales = ["en", "zh"] as const;
export type FullyTranslatedLocale = (typeof fullyTranslatedLocales)[number];

export function isFullyTranslated(locale: string): locale is FullyTranslatedLocale {
  return (fullyTranslatedLocales as readonly string[]).includes(locale);
}
