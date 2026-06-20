#!/usr/bin/env python3
"""Make the seo-cron service account a verified owner of kidsbayarea.com via
the Site Verification API + DNS TXT — bypasses the GSC "add user" UI, which
rejects service-account emails with "email not found".

Recipe (proven on visacub.com + citationmap.com):
  1. `token kidsbayarea.com`  → prints the google-site-verification TXT value
  2. operator adds the TXT record to the domain's DNS (MERGE with existing TXT
     values — UPSERT replaces the whole record set)
  3. `verify kidsbayarea.com` → asks Google to check DNS; on success the SA
     becomes a verified owner and the sc-domain property opens up to it
  4. `register kidsbayarea.com` → adds the property to the SA's own console
     (needs the FULL webmasters scope)
  5. `check` → lists Search Console properties the SA can now see

Run on the seo-cron EC2 (deps + SSM access present):
  python3 infra/seo-cron/verify_domain.py token kidsbayarea.com

The SA JSON is shared with the citationmap pipeline (same service account);
this script reads it from the kidsbayarea SSM param.
"""
import subprocess
import sys
import tempfile

from google.oauth2 import service_account
from googleapiclient.discovery import build

SSM_PARAM = "/seo-cron/kidsbayarea/gsc-sa-json"


def _svc(api, version, scope):
    sa_json = subprocess.check_output(
        ["aws", "ssm", "get-parameter", "--name", SSM_PARAM, "--with-decryption",
         "--query", "Parameter.Value", "--output", "text", "--region", "us-east-1"],
        text=True,
    )
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        f.write(sa_json)
        path = f.name
    creds = service_account.Credentials.from_service_account_file(path, scopes=[scope])
    return build(api, version, credentials=creds, cache_discovery=False)


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "check"
    domain = sys.argv[2] if len(sys.argv) > 2 else "kidsbayarea.com"
    site = {"type": "INET_DOMAIN", "identifier": domain}

    if mode == "token":
        sv = _svc("siteVerification", "v1", "https://www.googleapis.com/auth/siteverification")
        tok = sv.webResource().getToken(
            body={"site": site, "verificationMethod": "DNS_TXT"}
        ).execute()
        print(tok["token"])
    elif mode == "verify":
        sv = _svc("siteVerification", "v1", "https://www.googleapis.com/auth/siteverification")
        res = sv.webResource().insert(
            verificationMethod="DNS_TXT", body={"site": site}
        ).execute()
        print("VERIFIED:", res.get("id"), "owners:", res.get("owners"))
    elif mode == "register":
        # Even as a verified owner the SA sees an empty site list until it adds
        # the property to its own Search Console account — needs FULL scope.
        sc = _svc("searchconsole", "v1", "https://www.googleapis.com/auth/webmasters")
        sc.sites().add(siteUrl=f"sc-domain:{domain}").execute()
        for s in sc.sites().list().execute().get("siteEntry", []):
            print(s["siteUrl"], s.get("permissionLevel"))
    elif mode == "check":
        sc = _svc("searchconsole", "v1", "https://www.googleapis.com/auth/webmasters.readonly")
        for s in sc.sites().list().execute().get("siteEntry", []):
            print(s["siteUrl"], s.get("permissionLevel"))
    else:
        sys.exit(f"unknown mode {mode}")


if __name__ == "__main__":
    main()
