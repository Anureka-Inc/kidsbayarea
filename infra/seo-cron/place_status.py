#!/usr/bin/env python3
"""Monthly check: which places.ts venues has Google marked closed or renamed?

Habitot (closed since 2024), Planet Granite (rebranded 2022) and Rockin' Jump
San Carlos (now Sky Zone) were all found by accident. This asks the Google
Places API (New) for each venue's businessStatus and current name, and prints
a markdown section for the seo-cron report. It never edits places.ts — a human
decides what to remove or rename.

- First sighting of a venue: Text Search (name + city), accepted only if the
  result is within MAX_KM of our lat/lng (guards against wrong-venue matches).
  The matched place id is cached in history/place_ids.json (committed with
  the history ledger) so later runs use the cheaper Place Details call.
- Key: env GOOGLE_PLACES_API_KEY, else SSM /seo-cron/kidsbayarea/google-places-api-key.
  No key → prints a one-line note and exits 0.

Usage: python3 place_status.py <places.ts> <place_ids.json> [--limit N]
"""
import json
import math
import os
import re
import sys
import time
from difflib import SequenceMatcher

import requests

MAX_KM = 1.5
FAR_KM = 25
SAME_SPOT_KM = 0.3
API = "https://places.googleapis.com/v1"
FIELDS = "id,displayName,businessStatus,formattedAddress,location"


def get_key() -> str | None:
    if os.environ.get("GOOGLE_PLACES_API_KEY"):
        return os.environ["GOOGLE_PLACES_API_KEY"]
    try:
        import boto3

        return boto3.client("ssm", region_name="us-east-1").get_parameter(
            Name="/seo-cron/kidsbayarea/google-places-api-key", WithDecryption=True
        )["Parameter"]["Value"]
    except Exception:  # noqa: BLE001 — missing param means "not configured"
        return None


def parse_places(path: str) -> list[dict]:
    src = open(path, encoding="utf-8").read()
    out = []
    for block in re.split(r"\n  \{\n", src):
        g = lambda rx: (re.search(rx, block) or [None, None])[1]  # noqa: E731
        slug, name = g(r'slug: "([^"]+)"'), g(r'\n    name: "([^"]+)"')
        lat, lng = g(r"lat: ([-\d.]+)"), g(r"lng: ([-\d.]+)")
        if slug and name and lat and lng:
            out.append({"slug": slug, "name": name, "city": g(r'city: "([^"]+)"') or "",
                        "category": g(r'category: "([^"]+)"') or "", "lat": float(lat), "lng": float(lng)})
    return out


def km(a_lat, a_lng, b_lat, b_lng) -> float:
    p = math.pi / 180
    h = (math.sin((b_lat - a_lat) * p / 2) ** 2
         + math.cos(a_lat * p) * math.cos(b_lat * p) * math.sin((b_lng - a_lng) * p / 2) ** 2)
    return 12742 * math.asin(math.sqrt(h))


def similar(ours: str, google: str, city: str = "") -> float:
    """Name match ignoring the city (otherwise "Rockin' Jump San Carlos" vs
    "Sky Zone San Carlos" looks similar). Max of fuzzy ratio and the share of
    our name's words that appear in Google's name."""
    stop = set(re.sub(r"[^a-z0-9 ]", "", city.lower()).split()) | {"the", "of", "and", "at", "-"}
    toks = lambda s: [w for w in re.sub(r"[^a-z0-9 ]", "", s.lower()).split() if w not in stop]  # noqa: E731
    a, b = toks(ours), toks(google)
    if not a or not b:
        return 1.0
    contained = sum(w in b for w in a) / len(a)
    return max(SequenceMatcher(None, " ".join(a), " ".join(b)).ratio(), contained)


def main() -> int:
    places_path, ids_path = sys.argv[1], sys.argv[2]
    limit = int(sys.argv[sys.argv.index("--limit") + 1]) if "--limit" in sys.argv else None
    print("\n## Venue status check (Google Places, monthly)")
    key = get_key()
    if not key:
        print("- Skipped: no Places API key (SSM `/seo-cron/kidsbayarea/google-places-api-key`).")
        return 0

    ids = json.load(open(ids_path)) if os.path.exists(ids_path) else {}
    s = requests.Session()
    s.headers.update({"X-Goog-Api-Key": key, "Content-Type": "application/json"})
    places = parse_places(places_path)[:limit]
    closed, temp, renamed, unmatched, moved, errors = [], [], [], [], [], 0

    for p in places:
        try:
            if p["slug"] in ids:
                r = s.get(f"{API}/places/{ids[p['slug']]}", headers={"X-Goog-FieldMask": FIELDS}, timeout=30)
                g = r.json() if r.ok else None
            else:
                r = s.post(f"{API}/places:searchText",
                           headers={"X-Goog-FieldMask": ",".join(f"places.{f}" for f in FIELDS.split(","))},
                           json={"textQuery": f"{p['name']} {p['city']} California",
                                 "locationBias": {"circle": {"center": {"latitude": p["lat"], "longitude": p["lng"]},
                                                             "radius": 5000.0}},
                                 "maxResultCount": 5}, timeout=30)
                cands = r.json().get("places", []) if r.ok else []
                g, best = None, 0.0
                for c in cands:
                    if "location" not in c:
                        continue
                    d = km(p["lat"], p["lng"], c["location"]["latitude"], c["location"]["longitude"])
                    sim = similar(p["name"], c.get("displayName", {}).get("text", ""), p["city"])
                    # Near our pin with a plausible name, or a strong name match
                    # a bit further away (our coordinates are often approximate).
                    if (d <= MAX_KM and sim >= 0.5) or (sim >= 0.8 and d <= FAR_KM):
                        if sim > best:
                            g, best = c, sim
                if not g:
                    # Same spot, different name → likely rebranded or replaced
                    # (e.g. Bowlero → Lucky Strike); surfaces as a name mismatch.
                    same_spot = [c for c in cands if "location" in c and km(
                        p["lat"], p["lng"], c["location"]["latitude"], c["location"]["longitude"]) <= SAME_SPOT_KM]
                    g = same_spot[0] if same_spot else None
                if g:
                    d = km(p["lat"], p["lng"], g["location"]["latitude"], g["location"]["longitude"])
                    if d > MAX_KM:
                        moved.append(f"`{p['slug']}` {p['name']}: our pin is {d:.1f} km from Google's "
                                     f"({g['location']['latitude']:.5f}, {g['location']['longitude']:.5f})")
                if g:
                    ids[p["slug"]] = g["id"]
            if not r.ok:
                errors += 1
                continue
        except requests.RequestException:
            errors += 1
            continue
        if not g:
            unmatched.append(p)
            continue
        gname = g.get("displayName", {}).get("text", "")
        status = g.get("businessStatus", "OPERATIONAL")
        row = f"`{p['slug']}` — ours: **{p['name']}** · Google: **{gname}** ({g.get('formattedAddress', '')})"
        if status == "CLOSED_PERMANENTLY":
            closed.append(row)
        elif status == "CLOSED_TEMPORARILY":
            temp.append(row)
        elif similar(p["name"], gname, p["city"]) < 0.5:
            renamed.append(row)
        time.sleep(0.1)

    os.makedirs(os.path.dirname(ids_path) or ".", exist_ok=True)
    with open(ids_path, "w") as f:
        json.dump(ids, f, indent=1, sort_keys=True)

    print(f"- Checked {len(places)} venues · {len(closed)} permanently closed · {len(temp)} temporarily closed · "
          f"{len(renamed)} name mismatch · {len(moved)} pin off · {len(unmatched)} no confident match · {errors} API errors")
    for title, rows, note in [
        ("🚨 Permanently closed — remove from places.ts", closed, ""),
        ("⏸ Temporarily closed — consider a note on the page", temp, ""),
        ("✏️ Google shows a different name — renamed or rebranded?", renamed,
         "Some are just naming style differences; check each one."),
    ]:
        if rows:
            print(f"\n### {title}")
            if note:
                print(note)
            for row in rows[:40]:
                print(f"- {row}")
    if moved:
        print(f"\n<details><summary>📍 Name matches but our map pin is off by more than {MAX_KM} km ({len(moved)})</summary>\n")
        for row in moved[:80]:
            print(f"- {row}")
        print("\n</details>")
    if unmatched:
        print(f"\n<details><summary>No confident Google match within {MAX_KM} km ({len(unmatched)})</summary>\n")
        for p in unmatched[:60]:
            print(f"- `{p['slug']}` {p['name']} ({p['city']})")
        print("\n</details>")
    return 0


if __name__ == "__main__":
    sys.exit(main())
