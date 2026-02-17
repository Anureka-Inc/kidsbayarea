import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const baseUrl = "https://www.kidsbayarea.com";

const pages = ["/", "/play", "/eat", "/learn", "/shop", "/explore"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of routing.locales) {
      const url =
        locale === routing.defaultLocale
          ? `${baseUrl}${page}`
          : `${baseUrl}/${locale}${page}`;

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === "/" ? "daily" : "weekly",
        priority: page === "/" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
