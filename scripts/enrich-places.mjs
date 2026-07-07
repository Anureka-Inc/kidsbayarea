#!/usr/bin/env node
// Enrich places with real opening hours, phone, and live ratings from the Google
// Places API (New — places.googleapis.com/v1). Emits a REVIEWABLE JSON patch at
// scripts/out/place-enrichment.json; it does NOT auto-rewrite places.ts, matching
// this project's "review before it ships / never fabricate" policy. A maintainer
// (or the seo-cron) applies vetted fields into places.ts.
//
// Setup:
//   1. Enable "Places API (New)" in Google Cloud + enable billing.
//   2. export GOOGLE_PLACES_API_KEY=...
//   3. node scripts/enrich-places.mjs [--limit N] [--only slug1,slug2]
//
// Cost note: one Text Search call per place. ~530 places ≈ a few dollars at
// current Places API pricing. Use --limit to sample first.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PLACES = path.join(ROOT, "src/data/places.ts");
const OUT_DIR = path.join(ROOT, "scripts/out");
const OUT = path.join(OUT_DIR, "place-enrichment.json");

const KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!KEY) {
  console.error(
    "GOOGLE_PLACES_API_KEY not set. Enable 'Places API (New)' + billing, then export the key."
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const LIMIT = args.includes("--limit")
  ? parseInt(args[args.indexOf("--limit") + 1], 10)
  : Infinity;
const ONLY = args.includes("--only")
  ? new Set(args[args.indexOf("--only") + 1].split(","))
  : null;

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Parse slug + name + city + existing phone/hours presence from places.ts.
function parsePlaces() {
  const src = fs.readFileSync(PLACES, "utf8");
  const blocks = src.split(/\n\s*slug:\s*"/).slice(1);
  const out = [];
  for (const b of blocks) {
    const slug = b.match(/^([^"]+)"/)?.[1];
    const name = b.match(/\n\s*name:\s*"([^"]+)"/)?.[1];
    const city = b.match(/\n\s*city:\s*"([^"]+)"/)?.[1];
    const hasPhone = /\n\s*phone:\s*"/.test(b);
    const hasHours = /\n\s*hours:\s*\[/.test(b);
    if (slug && name) out.push({ slug, name, city, hasPhone, hasHours });
  }
  return out;
}

// Map Places API regularOpeningHours.periods → the HoursBlock grammar in places.ts,
// grouping consecutive days that share identical open/close times.
function toHoursBlocks(regularOpeningHours) {
  const periods = regularOpeningHours?.periods;
  if (!periods?.length) return null;
  // day (0-6) -> "HH:MM-HH:MM"
  const byDay = {};
  for (const p of periods) {
    if (!p.open || !p.close) continue; // skip 24h/ambiguous for safety
    const d = p.open.day;
    const o = `${String(p.open.hour).padStart(2, "0")}:${String(p.open.minute).padStart(2, "0")}`;
    const c = `${String(p.close.hour).padStart(2, "0")}:${String(p.close.minute).padStart(2, "0")}`;
    byDay[d] = { opens: o, closes: c };
  }
  const blocks = [];
  let cur = null;
  for (let d = 0; d < 7; d++) {
    const h = byDay[d];
    const key = h ? `${h.opens}-${h.closes}` : "closed";
    if (cur && cur.key === key) {
      cur.days.push(WEEKDAYS[d]);
    } else {
      if (cur) blocks.push(cur);
      cur = { key, days: [WEEKDAYS[d]], h };
    }
  }
  if (cur) blocks.push(cur);
  return blocks
    .filter((b) => b.h) // drop closed runs; absence implies closed in the UI
    .map((b) => ({ days: b.days, opens: b.h.opens, closes: b.h.closes }));
}

async function searchPlace(name, city) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.regularOpeningHours,places.formattedAddress",
    },
    body: JSON.stringify({
      textQuery: `${name} ${city ?? ""} Bay Area California`,
      maxResultCount: 1,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.places?.[0] ?? null;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let places = parsePlaces();
  if (ONLY) places = places.filter((p) => ONLY.has(p.slug));
  places = places.slice(0, LIMIT);

  const patch = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
  let done = 0,
    enriched = 0,
    misses = 0;

  for (const p of places) {
    try {
      const g = await searchPlace(p.name, p.city);
      if (!g) {
        misses++;
      } else {
        patch[p.slug] = {
          matchedName: g.displayName?.text,
          matchedAddress: g.formattedAddress,
          phone: g.nationalPhoneNumber,
          rating: g.rating,
          ratingCount: g.userRatingCount,
          hours: toHoursBlocks(g.regularOpeningHours),
          placeId: g.id,
        };
        enriched++;
      }
    } catch (e) {
      console.error(`  ${p.slug}: ${e.message.slice(0, 120)}`);
    }
    done++;
    if (done % 20 === 0) {
      fs.writeFileSync(OUT, JSON.stringify(patch, null, 2));
      process.stderr.write(`  ${done}/${places.length} enriched=${enriched} misses=${misses}\n`);
    }
    await new Promise((r) => setTimeout(r, 120)); // gentle rate limit
  }

  fs.writeFileSync(OUT, JSON.stringify(patch, null, 2));
  console.log(
    `\nDone ${done}: enriched=${enriched} misses=${misses}\nWrote ${OUT}.\n` +
      `Review it, then apply vetted phone/hours/rating into src/data/places.ts.\n` +
      `IMPORTANT: verify matchedName/matchedAddress before trusting a row — Text\n` +
      `Search can return the wrong venue for generic names.`
  );
}

main();
