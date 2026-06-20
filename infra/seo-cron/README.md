# seo-cron — weekly SEO/GEO optimization loop for kidsbayarea.com

Modeled on citationmap's seo-cron. Runs on the **shared** EC2
`visacub-seo-cron` (`i-0fee473f9b347c706`, t4g.small, us-east-1, SSM-managed),
alongside visacub (Mon+Thu) and citationmap seo-cron (Tue). **Wed 13:13 UTC**,
**PR-only** (a human reviews & merges — nothing auto-merges):

```
① evaluate past changes (gsc.past_changes_effect: baseline vs now → keep/revert)
② fetch data: GSC (28d + WoW, striking-distance, low-CTR, sitemaps)
   + Bing Webmaster + DataForSEO (live SERP rank for tracked-keywords.txt)
③ Claude Code headless on Bedrock (us.anthropic.claude-sonnet-4-6):
   ≤3 page-level edits + Princeton-GEO citability pass + llms.txt sync
④ tsc gate → PR on fixed branch seo-cron/auto → GHA build check (advisory)
⑤ PR left OPEN for human review (no auto-merge) → you merge → Amplify deploys
⑥ record changed URLs + GSC baseline → history/changes.jsonl (feeds ①)
⑦ GSC sitemap resubmit (all chunks) + IndexNow ping changed URLs
⑧ geo-optimizer-skill score (if installed)
⑨ SES report email → tom@anureka.com (from seo-cron@anureka.com)
```

On any service failure, `kidsbayarea-seo-cron-failure-notify.service`
(`OnFailure=`) emails an alert with the last journal lines.

## Files (this directory)

| File | Role |
|---|---|
| `run.sh` | Orchestrator — owns git/PR; the agent only edits files. PR-only. |
| `playbook.md` | The optimizer agent's instructions (hard constraints + GEO pass) |
| `fetch_data.py` | GSC + Bing + DataForSEO → `seo_snapshot.json` (all fail-soft) |
| `tracked-keywords.txt` | DataForSEO SERP-check list (≤25; edit + push to change) |
| `record_history.py` | Logs changed URLs + GSC baseline after each PR-bound run |
| `history/changes.jsonl` | The change ledger (orchestrator-written; agent never touches) |
| `safe_actions.py` | GSC sitemap resubmit (chunked) + IndexNow ping |
| `send_report.py` | SES email (to `SEO_REPORT_TO`, default tom@anureka.com) |
| `verify_domain.py` | GSC service-account self-ownership (token/verify/register/check) |
| `kidsbayarea-seo-cron.service` / `.timer` | systemd units (Wed 13:13 UTC, Persistent) |
| `kidsbayarea-seo-cron-failure-notify.service` | OnFailure SES alert |
| `bootstrap.sh` | One-time box setup (deps, clone, units) |

Related, outside this dir: `.github/workflows/pr-build-check.yml` (advisory
build on `seo-cron/*` PRs), `src/app/llms.txt/route.ts` (+ `public/llms.txt`)
the AI-engine site map the optimizer keeps in sync, and the IndexNow key at
`src/app/0e0f94c463f659c0f3e4d31c393fd477.txt/route.ts` (+ public copy).

## Guardrails

1. Agent toolset: Read/Glob/Grep/Edit/Write + `npx tsc`/`ls`/`cat` only — no
   git, no arbitrary shell.
2. run.sh commits ONLY `src/` + `public/llms.txt` + `infra/seo-cron/history`.
   Stray edits are never committed and are wiped by the next run's reset.
   `src/messages/`, `src/i18n/`, `src/middleware.ts`, `src/app/api/`, infra are
   off-limits per the playbook.
3. Diff budget ~300 lines, no new routes/redirects, EN-only sitemap preserved.
4. `tsc --noEmit` locally before the PR; full `npm run build` in CI.
5. **PR-only** — a human reviews and merges. Single squash commit on main =
   one-click revert.

## Credentials (SSM, region us-east-1)

| What | Where | Notes |
|---|---|---|
| GSC SA JSON | SSM `/seo-cron/kidsbayarea/gsc-sa-json` | reuse the citationmap service account `seo-cron@expanded-torus-482521-u3.iam.gserviceaccount.com` |
| Bing Webmaster key | SSM `/seo-cron/kidsbayarea/bing-api-key` | reuse the account key; add+verify kidsbayarea.com in Bing Webmaster Tools |
| GitHub token (clone+PR) | SSM `/seo-cron/kidsbayarea/github-token` | needs repo scope on Anureka-Inc/kidsbayarea |
| DataForSEO login/password | Secrets Manager `visacub/seo-cron` | shared; box EIP already whitelisted |
| Bedrock / SES / SSM-read | instance role `visacub-seo-cron-role` | already attached to the shared box |

SES sends from `seo-cron@anureka.com` (anureka.com is a verified SES identity;
kidsbayarea.com is not).

## One-time setup (operator)

```bash
P=anureka                          # AWS profile
INST=i-0fee473f9b347c706

# 1. SSM params — reuse the citationmap GSC SA + Bing key + a GH token
SA=$(aws ssm get-parameter --profile $P --name /seo-cron/citationmap/gsc-sa-json \
       --with-decryption --query Parameter.Value --output text)
aws ssm put-parameter --profile $P --type SecureString \
  --name /seo-cron/kidsbayarea/gsc-sa-json --value "$SA"
BK=$(aws ssm get-parameter --profile $P --name /seo-cron/citationmap/bing-api-key \
       --with-decryption --query Parameter.Value --output text)
aws ssm put-parameter --profile $P --type SecureString \
  --name /seo-cron/kidsbayarea/bing-api-key --value "$BK"
aws ssm put-parameter --profile $P --type SecureString \
  --name /seo-cron/kidsbayarea/github-token --value "<gh_token_with_repo_scope>"

# 2. Grant GSC access to the SA for kidsbayarea.com (DNS-TXT self-verify):
#    bootstrap first (step 3), then on the box:
#      python3 infra/seo-cron/verify_domain.py token kidsbayarea.com
#      # add the printed TXT to kidsbayarea.com DNS (MERGE), then:
#      python3 infra/seo-cron/verify_domain.py verify kidsbayarea.com
#      python3 infra/seo-cron/verify_domain.py register kidsbayarea.com
#      python3 infra/seo-cron/verify_domain.py check
#    (or just add the SA email as a Restricted user in GSC settings).

# 3. Bootstrap the box (self-clones the repo first, then runs bootstrap.sh
#    which installs deps, units, and enables the Wed timer). Idempotent.
aws ssm send-command --profile $P --instance-ids $INST \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["set -e","D=/opt/kidsbayarea-seo-cron/kidsbayarea","mkdir -p /opt/kidsbayarea-seo-cron","chown ec2-user:ec2-user /opt/kidsbayarea-seo-cron","if [ ! -d $D/.git ]; then T=$(aws ssm get-parameter --name /seo-cron/kidsbayarea/github-token --with-decryption --query Parameter.Value --output text --region us-east-1); sudo -u ec2-user git clone https://oauth2:$T@github.com/Anureka-Inc/kidsbayarea.git $D; else sudo -u ec2-user git -C $D pull; fi","bash $D/infra/seo-cron/bootstrap.sh"]'
```

## Operate

```bash
# Trigger a run now
aws ssm send-command --profile anureka --instance-ids i-0fee473f9b347c706 \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["systemctl start kidsbayarea-seo-cron.service --no-block"]'

# Tail logs
aws ssm send-command --profile anureka --instance-ids i-0fee473f9b347c706 \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["journalctl -u kidsbayarea-seo-cron.service -n 100 --no-pager"]'

# Change cadence/playbook/keywords: edit here + push to main — the box pulls
# main at the start of every run. Unit-file changes also need:
#   cp infra/seo-cron/kidsbayarea-seo-cron.timer /etc/systemd/system/ && systemctl daemon-reload
```

## Cost

EC2 $0 incremental (shared box) · Bedrock ~$1-4/run · DataForSEO ~$0.04/run ·
GSC/Bing/IndexNow/SES free-tier noise. Bedrock spend counts toward the
account-wide `bedrock-llm-monthly` budget.
