import type { MetadataRoute } from "next";
import { fullyTranslatedLocales } from "@/i18n/routing";
import { places } from "@/data/places";

const baseUrl = "https://www.kidsbayarea.com";

// Only advertise locales whose body content is actually translated. Listing all
// 30 locales caused Google to crawl ~938 near-duplicates of the EN pages and
// flag them as "Crawled - currently not indexed". The other 28 locales remain
// browsable in-site (via the language switcher) and discoverable via hreflang
// alternates on the EN pages, but they no longer compete with EN for indexing.
const indexableLocales = fullyTranslatedLocales;

const staticPages = ["/", "/play", "/eat", "/learn", "/shop", "/explore", "/contact", "/planner"];
const guideSlugs = ["babies-0-2", "toddlers-2-5", "kids-5-8", "tweens-8-12", "rainy-day", "family-favorites"];

// Build `alternates.languages` for a path. Next.js MetadataRoute.Sitemap maps
// this to xhtml:link rel="alternate" hreflang tags inside each <url> entry,
// which is the spec-correct way to declare cross-locale alternates — much
// stronger signal than the Link HTTP header alone, and Google prefers it.
function buildAlternates(pathBuilder: (locale: string) => string): Record<string, string> {
  const alts: Record<string, string> = {};
  for (const locale of indexableLocales) {
    alts[locale] = `${baseUrl}${pathBuilder(locale)}`;
  }
  // x-default points search engines to the language-agnostic landing for users
  // whose language isn't in our list. We use EN.
  alts["x-default"] = `${baseUrl}${pathBuilder("en")}`;
  return alts;
}

export async function generateSitemaps() {
  // Split into chunks: static pages, then place chunks of ~100 each
  const placeChunks: { id: number }[] = [{ id: 0 }]; // id 0 = static + guide pages
  const chunkSize = 80;
  for (let i = 0; i < places.length; i += chunkSize) {
    placeChunks.push({ id: Math.floor(i / chunkSize) + 1 });
  }
  return placeChunks;
}

// Next.js 16 changed two things about the sitemap chunk handler:
//   1. The `id` param is now wrapped in a Promise (matching the App Router's
//      new async params convention) — destructuring the Promise object
//      verbatim made `id === 0` always false, so every chunk emitted an
//      empty <urlset>.
//   2. Even after awaiting, the value arrives as a *string* ("0", "1", ...),
//      not the number returned by generateSitemaps(). Strict equality with a
//      numeric literal silently fails. Coercing to Number fixes both the
//      `chunkId === 0` branch and the (start = (chunkId - 1) * size) math.
// Production has been shipping an empty sitemap as a result; combined with
// the old middleware matcher dropping unprefixed paths, this is the main
// reason GSC sees hundreds of "Crawled - currently not indexed" entries.
export default async function sitemap({
  id,
}: {
  id: Promise<number>;
}): Promise<MetadataRoute.Sitemap> {
  const chunkId = Number(await id);
  const entries: MetadataRoute.Sitemap = [];

  if (chunkId === 0) {
    // Static pages + guides for indexable locales
    for (const page of staticPages) {
      for (const locale of indexableLocales) {
        const url = `${baseUrl}/${locale}${page === "/" ? "" : page}`;
        entries.push({
          url,
          lastModified: new Date(),
          changeFrequency: page === "/" ? "daily" : "weekly",
          priority: page === "/" ? 1.0 : 0.8,
          alternates: {
            languages: buildAlternates((loc) => `/${loc}${page === "/" ? "" : page}`),
          },
        });
      }
    }

    for (const slug of guideSlugs) {
      for (const locale of indexableLocales) {
        entries.push({
          url: `${baseUrl}/${locale}/guides/${slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: {
            languages: buildAlternates((loc) => `/${loc}/guides/${slug}`),
          },
        });
      }
    }
  } else {
    // Place detail pages - chunk by id
    const chunkSize = 80;
    const start = (chunkId - 1) * chunkSize;
    const chunk = places.slice(start, start + chunkSize);

    for (const place of chunk) {
      for (const locale of indexableLocales) {
        entries.push({
          url: `${baseUrl}/${locale}/${place.category}/${place.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: {
            languages: buildAlternates(
              (loc) => `/${loc}/${place.category}/${place.slug}`,
            ),
          },
        });
      }
    }
  }

  return entries;
}
