import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { places } from "@/data/places";

const baseUrl = "https://www.kidsbayarea.com";

const staticPages = ["/", "/play", "/eat", "/learn", "/shop", "/explore", "/contact", "/planner"];
const guideSlugs = ["babies-0-2", "toddlers-2-5", "kids-5-8", "tweens-8-12", "rainy-day", "family-favorites"];

export async function generateSitemaps() {
  // Split into chunks: static pages, then place chunks of ~100 each
  const placeChunks: { id: number }[] = [{ id: 0 }]; // id 0 = static + guide pages
  const chunkSize = 80;
  for (let i = 0; i < places.length; i += chunkSize) {
    placeChunks.push({ id: Math.floor(i / chunkSize) + 1 });
  }
  return placeChunks;
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  if (id === 0) {
    // Static pages + guides for all locales
    for (const page of staticPages) {
      for (const locale of routing.locales) {
        const url = `${baseUrl}/${locale}${page === "/" ? "" : page}`;
        entries.push({
          url,
          lastModified: new Date(),
          changeFrequency: page === "/" ? "daily" : "weekly",
          priority: page === "/" ? 1.0 : 0.8,
        });
      }
    }

    for (const slug of guideSlugs) {
      for (const locale of routing.locales) {
        entries.push({
          url: `${baseUrl}/${locale}/guides/${slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } else {
    // Place detail pages - chunk by id
    const chunkSize = 80;
    const start = (id - 1) * chunkSize;
    const chunk = places.slice(start, start + chunkSize);

    for (const place of chunk) {
      for (const locale of routing.locales) {
        entries.push({
          url: `${baseUrl}/${locale}/${place.category}/${place.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
