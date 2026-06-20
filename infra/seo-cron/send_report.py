#!/usr/bin/env python3
"""Email the run report via SES.

Sends from seo-cron@anureka.com — anureka.com is a verified SES identity
(kidsbayarea.com is not), so this works without a new domain verification.
"""
import datetime as dt
import json
import os
import sys

import boto3

OUT_DIR = os.environ.get("SEO_OUT_DIR", "out")
TO = os.environ.get("SEO_REPORT_TO", "tom@anureka.com")
FROM = os.environ.get("SEO_REPORT_FROM", "seo-cron@anureka.com")


def read(path, fallback=""):
    p = os.path.join(OUT_DIR, path)
    return open(p).read() if os.path.exists(p) else fallback


def main():
    report = read("report.md", "(optimizer produced no report this run)")
    pr_url = read("pr_url.txt").strip()
    try:
        actions = json.loads(read("actions.json", "[]"))
    except json.JSONDecodeError:
        actions = []

    today = dt.date.today().isoformat()
    status = "PR opened (needs review)" if pr_url else "no code changes"
    body = f"""SEO cron run — kidsbayarea.com — {today} ({status})

{"Pull request (review + merge to deploy): " + pr_url if pr_url else "No page edits were needed this run."}

=== Safe actions ===
{chr(10).join(actions) or "(none)"}

=== Optimizer report ===
{report}

--
Shared visacub-seo-cron EC2 (i-0fee473f9b347c706), runs weekly (Wed).
Code: infra/seo-cron/ in Anureka-Inc/kidsbayarea. PR-only — nothing auto-merges.
"""
    ses = boto3.client("ses", region_name="us-east-1")
    ses.send_email(
        Source=FROM,
        Destination={"ToAddresses": [TO]},
        Message={
            "Subject": {"Data": f"[SEO cron] kidsbayarea.com {today} — {status}"},
            "Body": {"Text": {"Data": body}},
        },
    )
    print(f"report emailed to {TO}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # noqa: BLE001
        print(f"send_report FAILED: {e}", file=sys.stderr)
        sys.exit(1)
