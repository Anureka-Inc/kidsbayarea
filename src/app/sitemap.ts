import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { places } from "@/data/places";

const baseUrl = "https://www.kidsbayarea.com";

const staticPages = ["/", "/play", "/eat", "/learn", "/shop", "/explore", "/contact", "/planner"];
const guideSlugs = ["babies-0-2", "toddlers-2-5", "kids-5-8", "tweens-8-12", "rainy-day", "family-favorites"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for all locales
  for (const page of staticPages) {
    for (const locale of routing.locales) {
      const url = `${baseUrl}/${locale}${page === "/" ? "" : page}`;

      // Build alternates for hreflang
      const languages: Record<string, string> = {};
      for (const altLocale of routing.locales) {
        languages[altLocale] = `${baseUrl}/${altLocale}${page === "/" ? "" : page}`;
      }

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === "/" ? "daily" : "weekly",
        priority: page === "/" ? 1.0 : 0.8,
        alternates: { languages },
      });
    }
  }

  // Guide pages for all locales
  for (const slug of guideSlugs) {
    for (const locale of routing.locales) {
      const url = `${baseUrl}/${locale}/guides/${slug}`;
      const languages: Record<string, string> = {};
      for (const altLocale of routing.locales) {
        languages[altLocale] = `${baseUrl}/${altLocale}/guides/${slug}`;
      }
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages },
      });
    }
  }

  // Place detail pages for all locales
  for (const place of places) {
    for (const locale of routing.locales) {
      const url = `${baseUrl}/${locale}/${place.category}/${place.slug}`;

      const languages: Record<string, string> = {};
      for (const altLocale of routing.locales) {
        languages[altLocale] = `${baseUrl}/${altLocale}/${place.category}/${place.slug}`;
      }

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
