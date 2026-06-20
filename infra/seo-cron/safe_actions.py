#!/usr/bin/env python3
"""Safe post-analysis actions: resubmit sitemaps to GSC + IndexNow ping.

Idempotent and rate-friendly: sitemap resubmission is a no-op server-side if
unchanged; IndexNow only pings URLs the optimizer actually touched (from
out/changed_urls.txt). All failures are logged, never fatal — the report
email still goes out.

Note: kidsbayarea has no /sitemap.xml index (Next.js 16 generateSitemaps emits
chunked /sitemap/{i}.xml and robots.txt lists each). We resubmit each chunk URL
discovered from robots.txt; if discovery fails we fall back to chunk 0.
"""
import json
import os
import re
import sys
import tempfile

import boto3
import requests

SITE = "https://www.kidsbayarea.com"
HOST = "www.kidsbayarea.com"
INDEXNOW_KEY = "0e0f94c463f659c0f3e4d31c393fd477"
SSM_PREFIX = "/seo-cron/kidsbayarea"
OUT_DIR = os.environ.get("SEO_OUT_DIR", "out")

actions = []


def log(msg):
    print(msg)
    actions.append(msg)


def _discover_sitemaps():
    """Pull the Sitemap: lines out of the live robots.txt (chunked sitemaps)."""
    try:
        r = requests.get(f"{SITE}/robots.txt", timeout=30)
        r.raise_for_status()
        maps = re.findall(r"(?im)^\s*Sitemap:\s*(\S+)", r.text)
        if maps:
            return maps
    except Exception as e:  # noqa: BLE001
        log(f"sitemap discovery via robots.txt failed: {e}")
    return [f"{SITE}/sitemap/0.xml"]


def resubmit_gsc_sitemap():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    ssm = boto3.client("ssm", region_name="us-east-1")
    sa_json = ssm.get_parameter(
        Name=f"{SSM_PREFIX}/gsc-sa-json", WithDecryption=True
    )["Parameter"]["Value"]
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        f.write(sa_json)
        sa_path = f.name
    try:
        creds = service_account.Credentials.from_service_account_file(
            sa_path, scopes=["https://www.googleapis.com/auth/webmasters"]
        )
        svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)
        sites = svc.sites().list().execute().get("siteEntry", [])
        props = [
            s["siteUrl"] for s in sites
            if "kidsbayarea.com" in s["siteUrl"]
            and s.get("permissionLevel") not in (None, "siteUnverifiedUser")
        ]
        if not props:
            log("GSC sitemap resubmit SKIPPED: service account has no property access")
            return
        prop = sorted(props, key=lambda u: not u.startswith("sc-domain:"))[0]
        n = 0
        for sm in _discover_sitemaps():
            try:
                svc.sitemaps().submit(siteUrl=prop, feedpath=sm).execute()
                n += 1
            except Exception as e:  # noqa: BLE001
                log(f"GSC sitemap submit failed for {sm}: {e}")
        log(f"GSC sitemaps resubmitted to {prop} ({n} chunk(s))")
    finally:
        os.unlink(sa_path)


def ping_indexnow():
    changed_path = os.path.join(OUT_DIR, "changed_urls.txt")
    urls = []
    if os.path.exists(changed_path):
        with open(changed_path) as f:
            urls = [u.strip() for u in f if u.strip().startswith("http")]
    if not urls:
        log("IndexNow: no changed URLs this run, skipping ping")
        return
    body = {
        "host": HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": f"{SITE}/{INDEXNOW_KEY}.txt",
        "urlList": urls[:100],
    }
    r = requests.post(
        "https://api.indexnow.org/indexnow",
        json=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        timeout=30,
    )
    if r.status_code in (200, 202):
        log(f"IndexNow accepted {len(urls)} URL(s) (HTTP {r.status_code})")
    else:
        log(f"IndexNow FAILED: HTTP {r.status_code} {r.text[:200]}")


def main():
    for fn in (resubmit_gsc_sitemap, ping_indexnow):
        try:
            fn()
        except Exception as e:  # noqa: BLE001
            log(f"{fn.__name__} FAILED: {type(e).__name__}: {e}")
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, "actions.json"), "w") as f:
        json.dump(actions, f, indent=1)


if __name__ == "__main__":
    main()
    sys.exit(0)
