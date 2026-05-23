import type { MetadataRoute } from "next";
import { places } from "@/data/places";

// Explicitly allow AI crawlers (OpenAI, Anthropic, Google AI, Perplexity, Meta,
// Common Crawl, etc.). Generic `User-Agent: *` already permits these, but named
// rules:
//   1. send a clear citation-permitted signal to LLM ranking systems,
//   2. survive accidental tightening of the wildcard rule, and
//   3. let GEO audits confirm allow status without reading the wildcard fallback.
const aiBots = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "GoogleOther",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "CCBot",
  "cohere-ai",
  "Diffbot",
  "DuckAssistBot",
  "FacebookBot",
  "YouBot",
  "Amazonbot",
];

// Sitemap discovery
//
// Next.js 16's generateSitemaps() emits chunked sitemaps at
// `/sitemap/0.xml ... /sitemap/{N}.xml` but does NOT auto-create a
// `/sitemap.xml` index route — and we can't add one manually because the
// `sitemap.xml/` directory collides with Next's own sitemap.ts module.
//
// robots.txt accepts multiple Sitemap: lines (Google and Bing both honor
// every entry), so we list each chunk URL explicitly. Keep CHUNK_SIZE in
// sync with src/app/sitemap.ts.
const CHUNK_SIZE = 80;
const placeChunkCount = Math.ceil(places.length / CHUNK_SIZE);
const totalChunks = 1 + placeChunkCount;
const sitemaps = Array.from(
  { length: totalChunks },
  (_, i) => `https://www.kidsbayarea.com/sitemap/${i}.xml`,
);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: sitemaps,
    host: "https://www.kidsbayarea.com",
  };
}
