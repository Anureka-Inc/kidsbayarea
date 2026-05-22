import type { MetadataRoute } from "next";

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: "https://www.kidsbayarea.com/sitemap.xml",
    host: "https://www.kidsbayarea.com",
  };
}
