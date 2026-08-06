#!/usr/bin/env node
// Refresh src/data/amazonProducts.ts from the Amazon Creators API.
//
// For each context in src/data/amazonPicks.ts, runs its searchItems queries
// (essentials first, then the non-obvious extras), takes the top in-stock
// results per query, dedupes, and writes the generated data file. Pages show
// nothing for a context until this script has populated it.
//
// Required env:
//   AMZ_CREATORS_CLIENT_ID      Creators API Credential ID
//   AMZ_CREATORS_CLIENT_SECRET  Creators API Credential Secret
//   AMZ_PARTNER_TAG             Associates tracking tag (e.g. kidsbayarea-20)
// Optional env:
//   AMZ_TOKEN_ENDPOINT          default https://api.amazon.com/auth/o2/token (NA)
//   AMZ_API_BASE                default https://creatorsapi.amazon/catalog/v1
//   AMZ_MARKETPLACE             default www.amazon.com
//
// Usage: node scripts/refresh-amazon-picks.mjs
// On the seo-cron EC2, pull credentials from SSM first, e.g.:
//   export AMZ_CREATORS_CLIENT_ID=$(aws ssm get-parameter --name /seo-cron/kidsbayarea/amz-creators-client-id --with-decryption --query Parameter.Value --output text)

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = path.join(ROOT, "src", "data", "amazonProducts.ts");
const PICKS_FILE = path.join(ROOT, "src", "data", "amazonPicks.ts");

const CLIENT_ID = process.env.AMZ_CREATORS_CLIENT_ID;
const CLIENT_SECRET = process.env.AMZ_CREATORS_CLIENT_SECRET;
const PARTNER_TAG = process.env.AMZ_PARTNER_TAG;
const TOKEN_ENDPOINT = process.env.AMZ_TOKEN_ENDPOINT ?? "https://api.amazon.com/auth/o2/token";
const API_BASE = process.env.AMZ_API_BASE ?? "https://creatorsapi.amazon/catalog/v1";
const MARKETPLACE = process.env.AMZ_MARKETPLACE ?? "www.amazon.com";

const PER_QUERY = 2; // products kept per query
const SEARCH_COUNT = 5; // products requested per query (headroom for filtering)
const THROTTLE_MS = 1200; // stay well under API rate limits

if (!CLIENT_ID || !CLIENT_SECRET || !PARTNER_TAG) {
  console.error(
    "Missing env: AMZ_CREATORS_CLIENT_ID, AMZ_CREATORS_CLIENT_SECRET, AMZ_PARTNER_TAG are required."
  );
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getToken() {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: "creatorsapi::default",
    }),
  });
  if (!res.ok) {
    throw new Error(`token request failed: HTTP ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  if (!data.access_token) throw new Error(`token response missing access_token: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function searchItems(token, keywords) {
  const res = await fetch(`${API_BASE}/searchItems`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-marketplace": MARKETPLACE,
    },
    body: JSON.stringify({
      keywords,
      marketplace: MARKETPLACE,
      partnerTag: PARTNER_TAG,
      itemCount: SEARCH_COUNT,
      resources: [
        "images.primary.medium",
        "itemInfo.title",
        "offersV2.listings.price",
      ],
    }),
  });
  if (!res.ok) {
    throw new Error(`searchItems("${keywords}") failed: HTTP ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  // Field casing per Creators API is lowerCamelCase; keep PascalCase fallbacks
  // in case of partial rollout differences.
  return data.searchResult?.items ?? data.SearchResult?.Items ?? [];
}

function normalizeItem(raw) {
  const asin = raw.asin ?? raw.ASIN;
  const title = raw.itemInfo?.title?.displayValue ?? raw.ItemInfo?.Title?.DisplayValue;
  const image =
    raw.images?.primary?.medium?.url ?? raw.Images?.Primary?.Medium?.URL;
  const listing =
    raw.offersV2?.listings?.[0] ?? raw.OffersV2?.Listings?.[0] ?? null;
  const price =
    listing?.price?.money?.displayAmount ??
    listing?.price?.displayAmount ??
    listing?.Price?.Money?.DisplayAmount ??
    undefined;
  const url =
    raw.detailPageUrl ??
    raw.DetailPageURL ??
    `https://www.amazon.com/dp/${asin}?tag=${PARTNER_TAG}`;
  if (!asin || !title || !image) return null;
  return { asin, title, image, url, ...(price ? { price } : {}) };
}

// Parse context configs out of amazonPicks.ts without a TS runtime: extract
// the array literal and evaluate it (the file holds plain data literals only).
async function loadContexts() {
  const src = await readFile(PICKS_FILE, "utf8");
  const match = src.match(/export const amazonPickContexts[^=]*=\s*(\[[\s\S]*?\n\]);/);
  if (!match) throw new Error("could not parse amazonPickContexts from amazonPicks.ts");
  return new Function(`return ${match[1]}`)();
}

const contexts = await loadContexts();
console.log(`refreshing ${contexts.length} contexts…`);
const token = await getToken();

const out = {};
for (const ctx of contexts) {
  const seen = new Set();
  const items = [];
  const cap = ctx.maxItems ?? 4;
  for (const q of ctx.queries) {
    if (items.length >= cap) break;
    try {
      const results = await searchItems(token, q);
      let kept = 0;
      for (const raw of results) {
        if (items.length >= cap || kept >= PER_QUERY) break;
        const item = normalizeItem(raw);
        if (!item || seen.has(item.asin)) continue;
        seen.add(item.asin);
        items.push(item);
        kept++;
      }
      console.log(`  [${ctx.key}] "${q}" → kept ${kept}`);
    } catch (err) {
      console.error(`  [${ctx.key}] "${q}" ERROR: ${err.message}`);
    }
    await sleep(THROTTLE_MS);
  }
  if (items.length) {
    out[ctx.key] = { updatedAt: new Date().toISOString().slice(0, 10), items };
  } else {
    console.warn(`  [${ctx.key}] no items — section will stay hidden`);
  }
}

const body = `// GENERATED FILE — do not edit by hand.
// Refreshed by scripts/refresh-amazon-picks.mjs via the Amazon Creators API.
// Last refresh: ${new Date().toISOString()}
import type { AmazonPicksData } from "./amazonPicks";

export const amazonProducts: Record<string, AmazonPicksData> = ${JSON.stringify(out, null, 2)};
`;
await writeFile(OUT_FILE, body);
console.log(`wrote ${OUT_FILE} (${Object.keys(out).length}/${contexts.length} contexts populated)`);
