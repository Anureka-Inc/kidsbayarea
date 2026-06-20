#!/usr/bin/env python3
"""Pull GSC + Bing Webmaster + DataForSEO data into out/seo_snapshot.json.

Runs on the shared visacub-seo-cron EC2 (instance role grants ssm:GetParameter
on /seo-cron/*). Each source fails soft: a GSC permission error (service account
not yet added to the kidsbayarea property), a Bing hiccup, or a DataForSEO quota
error degrades to a partial snapshot with the error recorded, never a crash —
the optimizer downstream works with whatever arrived.

Output shape (seo_snapshot.json):
  generated_at, site, gsc: {error|sitemaps, top_queries, top_pages,
  striking_distance, low_ctr_opportunities, wow_deltas, past_changes_effect},
  bing: {error|query_stats, rank_traffic, crawl_issues},
  dataforseo: {error|tracked, ranked_count, rankings}
"""
import datetime as dt
import json
import os
import sys
import tempfile

import boto3
import requests

SITE = "https://www.kidsbayarea.com/"
DOMAIN = "kidsbayarea.com"
SSM_PREFIX = "/seo-cron/kidsbayarea"
OUT_DIR = os.environ.get("SEO_OUT_DIR", "out")

ssm = boto3.client("ssm", region_name="us-east-1")


def _param(name: str) -> str:
    return ssm.get_parameter(Name=f"{SSM_PREFIX}/{name}", WithDecryption=True)[
        "Parameter"
    ]["Value"]


# ---------------------------------------------------------------- GSC ----
def fetch_gsc() -> dict:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    sa_json = _param("gsc-sa-json")
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        f.write(sa_json)
        sa_path = f.name
    try:
        creds = service_account.Credentials.from_service_account_file(
            sa_path,
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"],
        )
        svc = build("searchconsole", "v1", credentials=creds, cache_discovery=False)

        # The SA may be authorized on the domain property or the www URL-prefix
        # property — discover which.
        sites = svc.sites().list().execute().get("siteEntry", [])
        candidates = [
            s["siteUrl"]
            for s in sites
            if DOMAIN in s["siteUrl"]
            and s.get("permissionLevel") not in (None, "siteUnverifiedUser")
        ]
        if not candidates:
            return {
                "error": "service account has no access to a kidsbayarea.com "
                "property — grant the seo-cron service account access in GSC "
                "(or run verify_domain.py to self-verify via DNS TXT)",
                "visible_sites": [s.get("siteUrl") for s in sites],
            }
        # Prefer the sc-domain property; otherwise the www URL-prefix one.
        prop = sorted(candidates, key=lambda u: not u.startswith("sc-domain:"))[0]

        today = dt.date.today()
        end = today - dt.timedelta(days=3)  # GSC data lags ~2-3 days
        start = end - dt.timedelta(days=27)
        prev_end = start - dt.timedelta(days=1)
        prev_start = prev_end - dt.timedelta(days=27)

        def query(dims, s, e, limit=250):
            return (
                svc.searchanalytics()
                .query(
                    siteUrl=prop,
                    body={
                        "startDate": s.isoformat(),
                        "endDate": e.isoformat(),
                        "dimensions": dims,
                        "rowLimit": limit,
                    },
                )
                .execute()
                .get("rows", [])
            )

        cur_q = query(["query"], start, end)
        prev_q = query(["query"], prev_start, prev_end)
        cur_p = query(["page"], start, end)

        prev_by_q = {r["keys"][0]: r for r in prev_q}
        deltas = []
        for r in cur_q[:120]:
            q = r["keys"][0]
            p = prev_by_q.get(q, {})
            deltas.append(
                {
                    "query": q,
                    "clicks": r["clicks"],
                    "impressions": r["impressions"],
                    "ctr": round(r["ctr"], 4),
                    "position": round(r["position"], 1),
                    "clicks_prev": p.get("clicks", 0),
                    "impressions_prev": p.get("impressions", 0),
                    "position_prev": round(p["position"], 1) if p else None,
                }
            )

        striking = [
            d for d in deltas if 4.5 <= d["position"] <= 15 and d["impressions"] >= 50
        ]
        low_ctr = [
            d
            for d in deltas
            if d["impressions"] >= 100 and d["ctr"] < 0.02 and d["position"] <= 10
        ]

        sitemaps = svc.sitemaps().list(siteUrl=prop).execute().get("sitemap", [])

        # Closed-loop feedback: join past runs' changed URLs (with the GSC
        # metrics recorded AT change time) against today's page metrics so
        # the optimizer can judge whether its own past edits worked.
        page_now = {r["keys"][0]: {
            "clicks": r["clicks"], "impressions": r["impressions"],
            "ctr": round(r["ctr"], 4), "position": round(r["position"], 1),
        } for r in cur_p}
        past_effect = []
        hist_path = os.path.join(os.path.dirname(__file__), "history", "changes.jsonl")
        if os.path.exists(hist_path):
            today_iso = dt.date.today().isoformat()
            for line in list(open(hist_path))[-10:]:
                try:
                    e = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if e.get("date") == today_iso:
                    continue  # this run's own entry, nothing to evaluate yet
                past_effect.append({
                    "changed_on": e["date"],
                    "pages": [
                        {"url": u, "baseline": base, "current": page_now.get(u)}
                        for u, base in e.get("urls", {}).items()
                    ],
                })

        return {
            "past_changes_effect": past_effect,
            "property": prop,
            "window": f"{start} .. {end} (vs {prev_start} .. {prev_end})",
            "top_queries": deltas[:60],
            "striking_distance": striking[:30],
            "low_ctr_opportunities": low_ctr[:30],
            "top_pages": [
                {
                    "page": r["keys"][0],
                    "clicks": r["clicks"],
                    "impressions": r["impressions"],
                    "ctr": round(r["ctr"], 4),
                    "position": round(r["position"], 1),
                }
                for r in cur_p[:60]
            ],
            "sitemaps": [
                {
                    "path": s.get("path"),
                    "lastSubmitted": s.get("lastSubmitted"),
                    "isPending": s.get("isPending"),
                    "errors": s.get("errors"),
                    "warnings": s.get("warnings"),
                }
                for s in sitemaps
            ],
        }
    finally:
        os.unlink(sa_path)


# --------------------------------------------------------------- Bing ----
def fetch_bing() -> dict:
    key = _param("bing-api-key")
    base = "https://ssl.bing.com/webmaster/api.svc/json"

    def get(method, **extra):
        params = {"apikey": key, "siteUrl": SITE, **extra}
        r = requests.get(f"{base}/{method}", params=params, timeout=60)
        r.raise_for_status()
        return r.json().get("d")

    out = {}
    try:
        qs = get("GetQueryStats") or []
        qs.sort(key=lambda x: x.get("Impressions", 0), reverse=True)
        out["query_stats"] = [
            {
                "query": q.get("Query"),
                "clicks": q.get("Clicks"),
                "impressions": q.get("Impressions"),
                "avg_click_position": q.get("AvgClickPosition"),
                "avg_impression_position": q.get("AvgImpressionPosition"),
            }
            for q in qs[:60]
        ]
    except Exception as e:  # noqa: BLE001
        out["query_stats_error"] = str(e)
    try:
        rt = get("GetRankAndTrafficStats") or []
        out["rank_traffic_last_14d"] = [
            {"date": r.get("Date"), "clicks": r.get("Clicks"), "impressions": r.get("Impressions")}
            for r in rt[-14:]
        ]
    except Exception as e:  # noqa: BLE001
        out["rank_traffic_error"] = str(e)
    try:
        issues = get("GetCrawlIssues") or []
        out["crawl_issues"] = issues[:50]
        out["crawl_issues_total"] = len(issues)
    except Exception as e:  # noqa: BLE001
        out["crawl_issues_error"] = str(e)
    return out


# ---------------------------------------------------------- DataForSEO ----
def fetch_dataforseo() -> dict:
    """Live Google SERP position for tracked keywords + top competitors.

    Credentials are shared with the visacub + citationmap pipelines via Secrets
    Manager `visacub/seo-cron` (single rotation point; the shared box's role can
    read it, and its EIP is already whitelisted on app.dataforseo.com).
    Cost: ~$0.002/keyword/run, list capped at 25.
    """
    import json as _json

    sm = boto3.client("secretsmanager", region_name="us-east-1")
    sec = _json.loads(
        sm.get_secret_value(SecretId="visacub/seo-cron")["SecretString"]
    )
    auth = (sec["DATAFORSEO_LOGIN"], sec["DATAFORSEO_PASSWORD"])

    kw_path = os.path.join(os.path.dirname(__file__), "tracked-keywords.txt")
    keywords = [
        ln.strip() for ln in open(kw_path)
        if ln.strip() and not ln.startswith("#")
    ][:25]

    results = []
    for kw in keywords:
        try:
            r = requests.post(
                "https://api.dataforseo.com/v3/serp/google/organic/live/regular",
                auth=auth,
                json=[{"keyword": kw, "location_code": 2840, "language_code": "en", "depth": 20}],
                timeout=60,
            )
            r.raise_for_status()
            task = r.json()["tasks"][0]
            # DataForSEO buries task-level failures (bad auth, IP not
            # whitelisted, quota) inside a 200 body — surface them instead
            # of silently reporting "ranked nowhere".
            if task.get("status_message") != "Ok.":
                msg = task.get("status_message", "unknown task error")
                if "whitelisted" in msg or "Access denied" in msg:
                    return {"error": f"DataForSEO: {msg} (whitelist the EC2 IP "
                                     "or disable IP whitelisting in the panel)"}
                raise RuntimeError(msg)
            items = (task["result"][0].get("items") or []) if task.get("result") else []
            ours = next(
                (i for i in items if DOMAIN in (i.get("domain") or "")), None
            )
            results.append({
                "keyword": kw,
                "our_position": ours["rank_absolute"] if ours else None,
                "our_url": ours.get("url") if ours else None,
                "top3": [
                    {"pos": i.get("rank_absolute"), "domain": i.get("domain")}
                    for i in items[:3]
                ],
            })
        except Exception as e:  # noqa: BLE001
            results.append({"keyword": kw, "error": str(e)[:120]})
    ranked = [r for r in results if r.get("our_position")]
    return {
        "tracked": len(keywords),
        "ranked_count": len(ranked),
        "rankings": results,
    }


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    snapshot = {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "site": SITE,
    }
    try:
        snapshot["gsc"] = fetch_gsc()
    except Exception as e:  # noqa: BLE001
        snapshot["gsc"] = {"error": f"{type(e).__name__}: {e}"}
    try:
        snapshot["bing"] = fetch_bing()
    except Exception as e:  # noqa: BLE001
        snapshot["bing"] = {"error": f"{type(e).__name__}: {e}"}
    try:
        snapshot["dataforseo"] = fetch_dataforseo()
    except Exception as e:  # noqa: BLE001
        snapshot["dataforseo"] = {"error": f"{type(e).__name__}: {e}"}

    path = os.path.join(OUT_DIR, "seo_snapshot.json")
    with open(path, "w") as f:
        json.dump(snapshot, f, indent=1, default=str)
    gsc_state = "error" if "error" in snapshot["gsc"] else "ok"
    bing_state = "error" if "error" in snapshot["bing"] else "ok"
    d4s_state = "error" if "error" in snapshot["dataforseo"] else "ok"
    print(f"snapshot written to {path} (gsc={gsc_state} bing={bing_state} dataforseo={d4s_state})")
    if gsc_state == "error":
        print(f"GSC: {snapshot['gsc']['error']}", file=sys.stderr)


if __name__ == "__main__":
    main()
