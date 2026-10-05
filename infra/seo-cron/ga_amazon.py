#!/usr/bin/env python3
"""Weekly Amazon-picks engagement from GA4, as a markdown section for report.md.

Reads the amazon_picks_view / amazon_click events (src/components/AmazonPicks.tsx)
broken down by the `context` and `placement` custom dimensions, last 7 days.
Uses the same service account as GSC (SSM gsc-sa-json), which has read access
to the kidsbayarea GA4 property. Fail-soft: prints a one-line note on error.
Revenue is not available here — that lives in Associates Central.
"""
import os
import sys
import tempfile

import boto3

GA4_PROPERTY = os.environ.get("GA4_PROPERTY", "538669625")  # kidsbayarea


def main() -> int:
    try:
        from google.auth.transport.requests import AuthorizedSession
        from google.oauth2 import service_account

        sa_json = boto3.client("ssm", region_name="us-east-1").get_parameter(
            Name="/seo-cron/kidsbayarea/gsc-sa-json", WithDecryption=True
        )["Parameter"]["Value"]
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
            f.write(sa_json)
        creds = service_account.Credentials.from_service_account_file(
            f.name, scopes=["https://www.googleapis.com/auth/analytics.readonly"]
        )
        os.unlink(f.name)
        session = AuthorizedSession(creds)
        resp = session.post(
            f"https://analyticsdata.googleapis.com/v1beta/properties/{GA4_PROPERTY}:runReport",
            json={
                "dateRanges": [{"startDate": "7daysAgo", "endDate": "yesterday"}],
                "dimensions": [
                    {"name": "customEvent:context"},
                    {"name": "customEvent:placement"},
                    {"name": "eventName"},
                ],
                "metrics": [{"name": "eventCount"}],
                "dimensionFilter": {
                    "filter": {
                        "fieldName": "eventName",
                        "inListFilter": {"values": ["amazon_picks_view", "amazon_click"]},
                    }
                },
                "limit": 500,
            },
            timeout=60,
        ).json()
        if "error" in resp:
            raise RuntimeError(resp["error"].get("message", "GA4 error"))
    except Exception as e:  # noqa: BLE001 — report section must never kill the run
        print(f"\n## Amazon picks engagement (GA4, 7d)\n- unavailable: {e}")
        return 0

    stats: dict[tuple[str, str], dict[str, int]] = {}
    for row in resp.get("rows", []):
        ctx, placement, event = (d["value"] for d in row["dimensionValues"])
        bucket = stats.setdefault((ctx, placement), {"amazon_picks_view": 0, "amazon_click": 0})
        bucket[event] = int(row["metricValues"][0]["value"])

    print("\n## Amazon picks engagement (GA4, 7d)")
    if not stats:
        print("- No amazon_picks_view / amazon_click events this week.")
        return 0
    views = sum(s["amazon_picks_view"] for s in stats.values())
    clicks = sum(s["amazon_click"] for s in stats.values())
    ctr = f"{clicks / views:.1%}" if views else "n/a"
    print(f"- Total: {views} views, {clicks} clicks, CTR {ctr}")
    print("\n| Context | Placement | Views | Clicks | CTR |\n|---|---|---|---|---|")
    for (ctx, placement), s in sorted(stats.items(), key=lambda kv: -kv[1]["amazon_picks_view"])[:20]:
        v, c = s["amazon_picks_view"], s["amazon_click"]
        print(f"| {ctx} | {placement} | {v} | {c} | {f'{c / v:.1%}' if v else 'n/a'} |")
    print("\nRevenue isn't in GA4 — check Associates Central → Reports, tracking ID `kidsbayarea0d-20`.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
