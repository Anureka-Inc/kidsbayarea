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
//   AMZ_CREDENTIAL_VERSION      2.1 (default) | 2.2 | 2.3 | 3.1 | 3.2 | 3.3
//                               v2.x = Cognito token endpoint, form-encoded,
//                               scope "creatorsapi/default"; v3.x = LWA (Login
//                               with Amazon), JSON body, scope
//                               "creatorsapi::default".
//   AMZ_TOKEN_ENDPOINT          override the version-derived token endpoint
//   AMZ_API_BASE                default https://creatorsapi.amazon/catalog/v1
//   AMZ_MARKETPLACE             default www.amazon.com
//
// Usage: node scripts/refresh-amazon-picks.mjs
// On the seo-cron EC2, pull credentials from SSM first, e.g.:
//   export AMZ_CREATORS_CLIENT_ID=$(aws ssm get-parameter --name /seo-cron/kidsbayarea/amz-creators-client-id --with-decryption --query Parameter.Value --output text)

import { readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_FILE = path.join(ROOT, "src", "data", "amazonProducts.ts");
const PICKS_FILE = path.join(ROOT, "src", "data", "amazonPicks.ts");

// AMZ_ENV_FILE: optional path to a dotenv-style file to load credentials from,
// so secrets never appear on the command line. Understands both this script's
// AMZ_* names and the AMAZON_CREATORS_* names used by pickfromvideo-web.
const fileEnv = {};
if (process.env.AMZ_ENV_FILE) {
  for (const line of readFileSync(process.env.AMZ_ENV_FILE, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m) fileEnv[m[1]] = m[2];
  }
}
const env = (...names) => {
  for (const n of names) {
    const v = process.env[n] ?? fileEnv[n];
    if (v) return v;
  }
  return undefined;
};

const CLIENT_ID = env("AMZ_CREATORS_CLIENT_ID", "AMAZON_CREATORS_CREDENTIAL_ID");
const CLIENT_SECRET = env("AMZ_CREATORS_CLIENT_SECRET", "AMAZON_CREATORS_CREDENTIAL_SECRET");
const PARTNER_TAG = env("AMZ_PARTNER_TAG", "AMAZON_CREATORS_PARTNER_TAG");
const CREDENTIAL_VERSION = env("AMZ_CREDENTIAL_VERSION", "AMAZON_CREATORS_VERSION") ?? "2.1";
const IS_LWA = CREDENTIAL_VERSION.startsWith("3.");
const TOKEN_ENDPOINTS = {
  "2.1": "https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token",
  "2.2": "https://creatorsapi.auth.eu-south-2.amazoncognito.com/oauth2/token",
  "2.3": "https://creatorsapi.auth.us-west-2.amazoncognito.com/oauth2/token",
  "3.1": "https://api.amazon.com/auth/o2/token",
  "3.2": "https://api.amazon.co.uk/auth/o2/token",
  "3.3": "https://api.amazon.co.jp/auth/o2/token",
};
const TOKEN_ENDPOINT = process.env.AMZ_TOKEN_ENDPOINT ?? TOKEN_ENDPOINTS[CREDENTIAL_VERSION];
const SCOPE = IS_LWA ? "creatorsapi::default" : "creatorsapi/default";
const API_BASE = process.env.AMZ_API_BASE ?? "https://creatorsapi.amazon/catalog/v1";
const MARKETPLACE = env("AMZ_MARKETPLACE", "AMAZON_CREATORS_MARKETPLACE") ?? "www.amazon.com";

// Optional LLM query generation via LiteLLM (OpenAI-compatible proxy).
// When LITELLM_BASE_URL is set, each context's search queries are generated
// fresh by the model (seeded with the hand-written queries as style
// examples); any failure falls back to the static queries, so the LLM stage
// can never break a refresh.
const LITELLM_BASE_URL = env("LITELLM_BASE_URL");
const LITELLM_API_KEY = env("LITELLM_API_KEY");
const LITELLM_MODEL = env("LITELLM_MODEL") ?? "qwen-pool";

if (!TOKEN_ENDPOINT) {
  console.error(`Unsupported AMZ_CREDENTIAL_VERSION "${CREDENTIAL_VERSION}" and no AMZ_TOKEN_ENDPOINT override.`);
  process.exit(1);
}

const PER_QUERY = 1; // products kept per query — one per query keeps the set
// diverse and guarantees the later "didn't-think-of-it" queries make the cut
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
  const params = {
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: SCOPE,
  };
  // v3.x (LWA) takes a JSON body; v2.x (Cognito) requires form-encoding.
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": IS_LWA ? "application/json" : "application/x-www-form-urlencoded",
    },
    body: IS_LWA ? JSON.stringify(params) : new URLSearchParams(params).toString(),
  });
  if (!res.ok) {
    throw new Error(`token request failed: HTTP ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  if (!data.access_token) throw new Error(`token response missing access_token: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function generateQueries(ctx) {
  if (!LITELLM_BASE_URL || !LITELLM_API_KEY) return null;
  try {
    const res = await fetch(`${LITELLM_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LITELLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: LITELLM_MODEL,
        temperature: 0.7,
        max_tokens: 250,
        messages: [
          {
            role: "user",
            content:
              `You pick Amazon US search queries for kidsbayarea.com, a guide to Bay Area family activities. ` +
              `Page: "${ctx.headingEn}" (scenario: ${ctx.key}). ` +
              `Style examples of good queries for this page: ${ctx.queries.join("; ")}. ` +
              `Return ONLY a JSON array of exactly 4 short Amazon search queries (plain strings, 2-6 words each): ` +
              `the first 2 are essential gear for this scenario, the last 2 are clever non-obvious items parents ` +
              `usually forget or never think of. Family/kid-appropriate products only. No brand names.`,
          },
        ],
      }),
      signal: AbortSignal.timeout(90_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    let text = data.choices?.[0]?.message?.content ?? "";
    text = text.replace(/```(?:json)?/g, "").trim();
    const arr = JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1));
    if (
      Array.isArray(arr) &&
      arr.length >= 3 &&
      arr.length <= 6 &&
      arr.every((q) => typeof q === "string" && q.length >= 5 && q.length <= 70)
    ) {
      return arr.slice(0, 4);
    }
    throw new Error(`invalid query list: ${JSON.stringify(arr).slice(0, 120)}`);
  } catch (err) {
    console.warn(`  [${ctx.key}] LLM query generation failed (${err.message}) — using static queries`);
    return null;
  }
}

async function searchItems(token, keywords, retried = false) {
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
  if (res.status === 429 && !retried) {
    await sleep(6000);
    return searchItems(token, keywords, true);
  }
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
  const llmQueries = await generateQueries(ctx);
  const queries = llmQueries ?? ctx.queries;
  if (llmQueries) console.log(`  [${ctx.key}] LLM queries: ${llmQueries.join(" | ")}`);
  for (const q of queries) {
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
