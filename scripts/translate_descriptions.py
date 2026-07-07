#!/usr/bin/env python3
"""Translate place descriptions from English into the site's other locales via
AWS Bedrock (Claude Haiku), matching the seo-cron's Bedrock setup.

Descriptions in places.ts only exist in `en`/`zh`; the other 28 locales fall back
to English. This produces src/data/descriptions/<locale>.json (slug -> translated
description). A follow-up loader change (see PR notes) merges these at render time.

Runs on the shared seo-cron EC2 box (instance role has Bedrock), region us-east-1.
Idempotent: skips slugs already translated in each locale's file.

Usage:
    # sample: top 5 places, 2 locales, ~10 calls
    python scripts/translate_descriptions.py --top 5 --locales es,ja
    # real run: top 150 places, all 28 non-en/zh locales (~4,200 calls)
    python scripts/translate_descriptions.py --top 150 --apply

Cost: ~n_places * 28 Bedrock Haiku calls. 150 places ≈ 4,200 short calls.
Counts toward the account-wide `bedrock-llm-monthly` budget. Start with --top small.
"""
import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLACES = ROOT / "src/data/places.ts"
ROUTING = ROOT / "src/i18n/routing.ts"
OUT_DIR = ROOT / "src/data/descriptions"

MODEL_ID = os.environ.get(
    "TRANSLATE_MODEL_ID", "us.anthropic.claude-3-5-haiku-20241022-v1:0"
)
REGION = os.environ.get("AWS_REGION", "us-east-1")

LOCALE_NAMES = {
    "es": "Spanish", "ja": "Japanese", "ko": "Korean", "fr": "French",
    "de": "German", "pt": "Portuguese", "it": "Italian", "ru": "Russian",
    "ar": "Arabic", "hi": "Hindi", "th": "Thai", "vi": "Vietnamese",
    "id": "Indonesian", "tr": "Turkish", "nl": "Dutch", "pl": "Polish",
    "sv": "Swedish", "da": "Danish", "nb": "Norwegian Bokmal", "fi": "Finnish",
    "cs": "Czech", "he": "Hebrew", "ms": "Malay", "tl": "Tagalog",
    "uk": "Ukrainian", "ro": "Romanian", "hu": "Hungarian", "el": "Greek",
}


def all_locales() -> list[str]:
    src = ROUTING.read_text()
    block = re.search(r"locales:\s*\[(.*?)\]", src, re.S).group(1)
    return re.findall(r'"([a-z-]+)"', block)


def parse_places() -> list[dict]:
    """Return [{slug, desc_en, rating}] sorted by rating desc."""
    src = PLACES.read_text()
    blocks = src.split('\n    slug: "')[1:]
    out = []
    for b in blocks:
        slug = re.match(r'([^"]+)"', b)
        rating = re.search(r"\n\s*rating:\s*([\d.]+)", b)
        # description: { en: "...", zh: "..." } — capture the en string
        desc = re.search(r'description:\s*\{\s*\n?\s*en:\s*"((?:[^"\\]|\\.)*)"', b)
        if slug and desc:
            out.append(
                {
                    "slug": slug.group(1),
                    "desc_en": desc.group(1).encode().decode("unicode_escape"),
                    "rating": float(rating.group(1)) if rating else 0.0,
                }
            )
    out.sort(key=lambda p: p["rating"], reverse=True)
    return out


def translate(client, text: str, lang: str) -> str:
    prompt = (
        f"Translate the following kid-friendly place description into {lang}. "
        f"Keep it natural and concise, preserve proper nouns (place names, city "
        f"names) as-is, and return ONLY the translation with no preamble.\n\n{text}"
    )
    resp = client.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(
            {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 600,
                "messages": [{"role": "user", "content": prompt}],
            }
        ),
    )
    data = json.loads(resp["body"].read())
    return data["content"][0]["text"].strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--top", type=int, default=5, help="number of top-rated places")
    ap.add_argument("--locales", type=str, default="", help="comma list; default = all 28")
    ap.add_argument("--apply", action="store_true", help="write JSON (default dry-run)")
    args = ap.parse_args()

    targets = (
        args.locales.split(",")
        if args.locales
        else [l for l in all_locales() if l not in ("en", "zh")]
    )
    places = parse_places()[: args.top]
    print(f"{len(places)} places x {len(targets)} locales = {len(places) * len(targets)} calls")
    if not args.apply:
        print("dry-run (no Bedrock calls, no writes). Pass --apply to run.")
        return

    import boto3  # noqa: local import so dry-run needs no AWS

    client = boto3.client("bedrock-runtime", region_name=REGION)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for loc in targets:
        lang = LOCALE_NAMES.get(loc, loc)
        path = OUT_DIR / f"{loc}.json"
        existing = json.loads(path.read_text()) if path.exists() else {}
        n = 0
        for p in places:
            if p["slug"] in existing:
                continue
            try:
                existing[p["slug"]] = translate(client, p["desc_en"], lang)
                n += 1
            except Exception as e:  # noqa
                print(f"  {loc}/{p['slug']}: {str(e)[:100]}", file=sys.stderr)
            time.sleep(0.05)
        path.write_text(json.dumps(existing, ensure_ascii=False, indent=2))
        print(f"  {loc}: +{n} (total {len(existing)}) -> {path.name}")

    print("Done. Next: wire a loader to merge these into place descriptions per locale.")


if __name__ == "__main__":
    main()
