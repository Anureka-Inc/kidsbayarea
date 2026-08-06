#!/usr/bin/env bash
# SEO cron orchestrator — runs weekly (Thu) via seo-cron-kidsbayarea.timer on
# the shared visacub-seo-cron EC2. Pipeline:
#   self-update repo → fetch GSC+Bing+DataForSEO data → Claude Code (Bedrock)
#   optimizes pages → tsc gate → branch+PR → safe actions (sitemap/IndexNow)
#   → SES email. PR-ONLY: a human reviews and merges. Every stage after
#   data-fetch fails soft so the report email always goes out.
set -uo pipefail

BASE=/opt/seo-cron-kidsbayarea
REPO_DIR=$BASE/kidsbayarea
export SEO_OUT_DIR=$BASE/out
LOG_PREFIX="[seo-cron-kidsbayarea]"

export AWS_REGION=us-east-1
export CLAUDE_CODE_USE_BEDROCK=1
export ANTHROPIC_MODEL='us.anthropic.claude-sonnet-4-6'
export ANTHROPIC_DEFAULT_HAIKU_MODEL='us.anthropic.claude-3-5-haiku-20241022-v1:0'
export PATH="$HOME/.local/bin:$PATH"

mkdir -p "$SEO_OUT_DIR"
rm -f "$SEO_OUT_DIR"/report.md "$SEO_OUT_DIR"/changed_urls.txt \
      "$SEO_OUT_DIR"/pr_url.txt "$SEO_OUT_DIR"/actions.json

echo "$LOG_PREFIX fetching GitHub token from SSM"
GH_TOKEN=$(aws ssm get-parameter --name /seo-cron/kidsbayarea/github-token \
  --with-decryption --query Parameter.Value --output text --region us-east-1)
export GH_TOKEN

# --- 1. repo checkout (also self-updates this script's source of truth) ---
if [ ! -d "$REPO_DIR/.git" ]; then
  echo "$LOG_PREFIX cloning repo"
  git clone "https://oauth2:${GH_TOKEN}@github.com/Anureka-Inc/kidsbayarea.git" "$REPO_DIR"
fi
cd "$REPO_DIR"
git remote set-url origin "https://oauth2:${GH_TOKEN}@github.com/Anureka-Inc/kidsbayarea.git"
git fetch origin main
git checkout -f main >/dev/null 2>&1
git reset --hard origin/main
git clean -fd src/app src/components src/data src/lib >/dev/null 2>&1 || true

# Re-exec the freshly-pulled script so updates to run.sh take effect THIS
# run, not the next one. Bash reads script content lazily from the original
# inode; `git reset --hard` swaps the inode, so without this the run that
# pulls a new run.sh still executes the old logic to completion. Single
# re-exec only.
if [ -z "${SEO_CRON_REEXEC:-}" ]; then
  export SEO_CRON_REEXEC=1
  exec "$REPO_DIR/infra/seo-cron/run.sh" "$@"
fi

# No overlapping runs (manual trigger vs timer, or a hung previous run) —
# they'd interleave on the same checkout and out/ directory.
exec 9>"$BASE/.seo-cron.lock"
if ! flock -n 9; then
  echo "$LOG_PREFIX another run holds the lock — exiting"
  exit 0
fi

# --- 2. data fetch -------------------------------------------------------
echo "$LOG_PREFIX fetching GSC + Bing + DataForSEO data"
python3 "$REPO_DIR/infra/seo-cron/fetch_data.py" || {
  echo "$LOG_PREFIX FATAL: data fetch crashed (not just per-source errors)"
  echo "Data fetch crashed; no analysis possible this run." > "$SEO_OUT_DIR/report.md"
  python3 "$REPO_DIR/infra/seo-cron/send_report.py"
  exit 1
}
mkdir -p "$REPO_DIR/out" && cp "$SEO_OUT_DIR/seo_snapshot.json" "$REPO_DIR/out/seo_snapshot.json"

# --- 2.5 deps guard: re-run npm ci if the lockfile changed ----------------
LOCK_STAMP="$BASE/.package-lock.sha"
CUR_SHA=$(sha256sum package-lock.json | cut -d" " -f1)
if [ "$CUR_SHA" != "$(cat "$LOCK_STAMP" 2>/dev/null)" ]; then
  echo "$LOG_PREFIX lockfile changed, npm ci"
  npm ci --no-audit --no-fund && echo "$CUR_SHA" > "$LOCK_STAMP"
fi

# --- 3. Claude Code optimizer -------------------------------------------
# Fixed branch: at most ONE open seo-cron PR. An unmerged previous PR gets
# force-updated with the latest data-driven edits instead of piling up
# parallel PRs that all touch the same metadata files.
BRANCH="seo-cron/auto"
git checkout -B "$BRANCH"

echo "$LOG_PREFIX running Claude Code optimizer on Bedrock ($ANTHROPIC_MODEL)"
timeout 3600 claude -p "$(cat "$REPO_DIR/infra/seo-cron/playbook.md")" \
  --permission-mode acceptEdits \
  --allowedTools "Read" "Glob" "Grep" "Edit" "Write" "Bash(npx tsc:*)" "Bash(ls:*)" "Bash(cat:*)" \
  --max-turns 100 \
  || echo "$LOG_PREFIX optimizer exited non-zero (continuing with whatever it produced)"

# Collect optimizer outputs (it writes into repo-relative out/)
for f in report.md changed_urls.txt; do
  [ -f "$REPO_DIR/out/$f" ] && cp "$REPO_DIR/out/$f" "$SEO_OUT_DIR/$f"
done
rm -rf "$REPO_DIR/out"

# --- 3.5 Amazon picks refresh (Creators API, fail-soft) --------------------
# Refreshes src/data/amazonProducts.ts weekly. NOTE: at weekly cadence the
# site must NOT display product prices (Amazon Associates terms require
# displayed prices to be <24h stale) — AmazonPicks.tsx deliberately renders
# "View on Amazon" instead; restore price display only if this ever becomes
# a daily refresh. src/data is an allowed path, so the
# regenerated file rides the same weekly PR as the optimizer edits. The
# instance role already has GetSecretValue on pickfromvideo/integrations
# (bayareadog-product-pipeline-secrets policy). AMZ_PARTNER_TAG overrides the
# secret's pickfromvideo tag with kidsbayarea's own tracking ID.
echo "$LOG_PREFIX refreshing Amazon picks"
AMZ_ENV_TMP=$(mktemp)
if aws secretsmanager get-secret-value --secret-id pickfromvideo/integrations \
     --region us-east-1 --query SecretString --output text 2>/dev/null \
   | python3 -c 'import json,sys
for k, v in json.loads(sys.stdin.read()).items():
    print(f"{k}={v}")' > "$AMZ_ENV_TMP" && [ -s "$AMZ_ENV_TMP" ]; then
  # LiteLLM key (visacub/litellm/api-key, JSON {"VALUE": "sk-..."}) enables
  # qwen-pool query generation; refresh falls back to static queries without it.
  LITELLM_KEY=$(aws secretsmanager get-secret-value --secret-id visacub/litellm/api-key \
      --region us-east-1 --query SecretString --output text 2>/dev/null \
    | python3 -c 'import json,sys;print(json.loads(sys.stdin.read())["VALUE"])' 2>/dev/null) || LITELLM_KEY=""
  AMZ_REFRESH_LOG=$(mktemp)
  AMZ_ENV_FILE="$AMZ_ENV_TMP" AMZ_PARTNER_TAG=kidsbayarea0d-20 \
    LITELLM_BASE_URL=${LITELLM_KEY:+http://litellm.citationmap.local:4000} \
    LITELLM_API_KEY="$LITELLM_KEY" \
    node "$REPO_DIR/scripts/refresh-amazon-picks.mjs" > "$AMZ_REFRESH_LOG" 2>&1 \
    || echo "$LOG_PREFIX Amazon picks refresh failed (non-fatal, keeping previous data)"
  cat "$AMZ_REFRESH_LOG"
  # Surface what the refresh did in the report email (recipients otherwise
  # only see it in the journal).
  {
    echo ""
    echo "## Amazon picks refresh"
    echo "- Result: $(tail -1 "$AMZ_REFRESH_LOG")"
    echo "- Qwen-generated query sets: $(grep -c 'LLM queries:' "$AMZ_REFRESH_LOG") (0 = static fallback)"
    echo "- Query errors: $(grep -c 'ERROR' "$AMZ_REFRESH_LOG")"
    echo "- Earnings attribution: tracking ID \`kidsbayarea0d-20\` — revenue is NOT in this email; check Associates Central → Reports, filtered by that tracking ID."
  } >> "$SEO_OUT_DIR/report.md"
  rm -f "$AMZ_REFRESH_LOG"
else
  echo "$LOG_PREFIX could not read pickfromvideo/integrations secret (non-fatal)"
fi
rm -f "$AMZ_ENV_TMP"

# --- 4. gate + PR (PR-only: a human reviews and merges) -------------------
# Commit ONLY the playbook-permitted paths, explicitly excluding the contact
# API even though it lives under src/app. src/messages, src/i18n, and
# src/middleware.ts are siblings outside the added dirs, so they're never
# staged. Any stray edits elsewhere are wiped by the next run's reset.
ALLOW=(src/app src/components src/data src/lib public/llms.txt ':!src/app/api')
if ! git diff --quiet -- "${ALLOW[@]}"; then
  echo "$LOG_PREFIX changes detected, running tsc gate"
  if npx tsc --noEmit; then
    # Closed loop: record what changed + its GSC baseline so the NEXT run
    # can evaluate whether these edits worked (past_changes_effect).
    python3 "$REPO_DIR/infra/seo-cron/record_history.py" || true
    # Commit-landed gate. If git commit silently fails — classically because
    # root-owned objects in .git/objects make ec2-user commits fail with
    # "insufficient permission" — the working-tree edits never become a commit,
    # HEAD stays at main, `push -f` pushes an empty (== main) branch, `gh pr
    # create` finds no diff and the `gh pr list` fallback hands back a STALE
    # already-merged PR. The orchestrator would then email "PR opened" having
    # changed nothing. Guard by requiring HEAD to actually advance before we
    # push or touch a PR. (PR-only here, so no merge-ancestor gate needed.)
    PRE_SHA=$(git rev-parse HEAD)
    git add "${ALLOW[@]}" infra/seo-cron/history
    COMMIT_OK=1
    git -c user.name="seo-cron-kidsbayarea" -c user.email="seo-cron@anureka.com" \
      commit -m "seo-cron: data-driven page optimizations $(date +%F)

Automated weekly SEO pass driven by GSC + Bing Webmaster + DataForSEO data.
See PR body for the optimizer report.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>" || COMMIT_OK=0
    RUN_SHA=$(git rev-parse HEAD)
    if [ "$COMMIT_OK" = "0" ] || [ "$RUN_SHA" = "$PRE_SHA" ]; then
      echo "$LOG_PREFIX FATAL: commit did not land (HEAD unchanged at $PRE_SHA) — NOT pushing/opening a PR"
      sudo find "$REPO_DIR/.git/objects" -not -user "$(id -un)" -print -quit >/dev/null 2>&1 \
        && OWN_HINT=" (found non-self-owned objects in .git/objects — run: sudo chown -R \$(id -un): $REPO_DIR)" || OWN_HINT=""
      {
        echo ""
        echo "## ⚠️ commit did not land — NO PR opened, nothing changed this run"
        echo "git commit produced no new HEAD${OWN_HINT}. This run did NOT modify the site;"
        echo "do not trust any PR link above — there is none for this run."
      } >> "$SEO_OUT_DIR/report.md"
    else
      git push -f origin "$BRANCH"
      # gh pr create fails when an open PR already exists on the branch; in
      # that case the force-push updated the diff but NOT the PR body, so the
      # body must be refreshed explicitly or it forever shows the first run's
      # report (this is exactly what happened between 2026-07-09 and 2026-08-06).
      if ! PR_URL=$(gh pr create \
        --title "seo-cron: page optimizations (auto-updating, needs review)" \
        --body-file "$SEO_OUT_DIR/report.md" \
        --base main --head "$BRANCH" 2>/dev/null); then
        PR_URL=$(gh pr list --head "$BRANCH" --state open --json url -q '.[0].url')
        [ -n "$PR_URL" ] && gh pr edit "$PR_URL" --body-file "$SEO_OUT_DIR/report.md" || true
      fi
      echo "$PR_URL" > "$SEO_OUT_DIR/pr_url.txt"
      echo "$LOG_PREFIX PR: $PR_URL (commit $RUN_SHA)"
      echo "" >> "$SEO_OUT_DIR/report.md"
      echo "_PR opened/updated ($RUN_SHA) — review and merge manually to deploy via Amplify._" >> "$SEO_OUT_DIR/report.md"
      # Fact gate (ported from bayareadog): flag policy-like claims the
      # optimizer may have invented — hours, prices, fees, closures, age
      # limits. Intentionally over-triggers: a false positive costs one
      # glance, a false negative ships an invented fact that AI answer
      # engines quote verbatim. amazonProducts.ts is excluded (its prices
      # come from the Amazon API, not the LLM).
      FACT_RX='hours|price|admission|fee|\$[0-9]|closed|closure|reservation|ages? [0-9]|free (entry|admission)|open (daily|now)'
      if git diff "$PRE_SHA..$RUN_SHA" -- src/ public/llms.txt ':!src/data/amazonProducts.ts' \
           | grep -E '^\+[^+]' | grep -Ei "$FACT_RX" | head -15 > "$SEO_OUT_DIR/fact_hits.txt" \
         && [ -s "$SEO_OUT_DIR/fact_hits.txt" ]; then
        gh pr edit "$PR_URL" --title "seo-cron: page optimizations [needs fact review]" 2>/dev/null || true
        {
          echo ""
          echo "## ⚠️ Fact gate triggered — review these added lines before merging"
          echo '```'
          cat "$SEO_OUT_DIR/fact_hits.txt"
          echo '```'
          echo "The optimizer added policy-like language (hours/prices/fees/closures/ages). Verify each claim against places.ts or the venue's website."
        } >> "$SEO_OUT_DIR/report.md"
        echo "$LOG_PREFIX fact gate triggered ($(wc -l < "$SEO_OUT_DIR/fact_hits.txt") hit(s)) — PR retitled"
      fi
    fi
  else
    echo "$LOG_PREFIX tsc FAILED — discarding changes, reporting only"
    {
      echo ""
      echo "## ⚠️ tsc gate failed"
      echo "The optimizer's edits did not typecheck; changes were discarded."
    } >> "$SEO_OUT_DIR/report.md"
    git checkout -f -- src/app src/components src/data src/lib public/llms.txt
  fi
else
  echo "$LOG_PREFIX no code changes this run"
fi

# --- 4.5 GEO readiness score (geo-optimizer-skill, non-fatal) -------------
# 0-100 audit of AI-search visibility; --save-history keeps a local trend so
# score regressions are visible run-over-run in the report email.
GEO_BIN="$HOME/.local/bin/geo"
if [ -x "$GEO_BIN" ]; then
  echo "$LOG_PREFIX running GEO audit"
  if timeout 300 "$GEO_BIN" audit --url https://www.kidsbayarea.com --format json \
       --save-history > "$SEO_OUT_DIR/geo_audit.json" 2>/dev/null; then
    python3 - "$SEO_OUT_DIR/geo_audit.json" >> "$SEO_OUT_DIR/report.md" <<'PYEOF' || true
import json, sys
d = json.load(open(sys.argv[1]))
print(f"\n## GEO readiness: {d.get('score')}/100 ({d.get('band')})")
weak = [(n, c) for n, c in d.get("checks", {}).items()
        if c.get("score", 0) < c.get("max", 0)]
weak.sort(key=lambda kv: kv[1].get("score", 0) - kv[1].get("max", 0))
for name, c in weak[:8]:
    print(f"- {name}: {c.get('score')}/{c.get('max')}")
PYEOF
  else
    echo "$LOG_PREFIX GEO audit failed (non-fatal)"
  fi
fi

# --- 5. safe actions + report -------------------------------------------
python3 "$REPO_DIR/infra/seo-cron/safe_actions.py" || true
python3 "$REPO_DIR/infra/seo-cron/send_report.py"
echo "$LOG_PREFIX done"
