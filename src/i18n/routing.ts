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
