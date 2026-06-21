#!/usr/bin/env python3
"""Append this run's changes + their GSC baseline to history/changes.jsonl.

Run by the orchestrator (run.sh) after the tsc gate passes — the optimizer
agent never touches this file. Each line:
  {"date": "...", "urls": {"<url>": {clicks, impressions, ctr, position}}}
The NEXT run's fetch_data.py joins this against fresh GSC page metrics to
produce past_changes_effect, closing the measure→act→measure loop.
"""
import datetime as dt
import json
import os

OUT_DIR = os.environ.get("SEO_OUT_DIR", "out")
HISTORY = os.path.join(os.path.dirname(__file__), "history", "changes.jsonl")


def main():
    changed_path = os.path.join(OUT_DIR, "changed_urls.txt")
    if not os.path.exists(changed_path):
        return
    urls = [u.strip() for u in open(changed_path) if u.strip().startswith("http")]
    if not urls:
        return

    try:
        snap = json.load(open(os.path.join(OUT_DIR, "seo_snapshot.json")))
        pages = {p["page"]: p for p in snap.get("gsc", {}).get("top_pages", [])}
    except Exception:  # noqa: BLE001
        pages = {}

    entry = {
        "date": dt.date.today().isoformat(),
        "urls": {
            u: {k: pages.get(u, {}).get(k) for k in ("clicks", "impressions", "ctr", "position")}
            for u in urls
        },
    }
    os.makedirs(os.path.dirname(HISTORY), exist_ok=True)
    with open(HISTORY, "a") as f:
        f.write(json.dumps(entry) + "\n")
    print(f"history: recorded {len(urls)} changed URL(s)")


if __name__ == "__main__":
    main()
