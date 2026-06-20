#!/usr/bin/env bash
# SEO cron orchestrator — runs weekly (Thu) via kidsbayarea-seo-cron.timer on
# the shared visacub-seo-cron EC2. Pipeline:
#   self-update repo → fetch GSC+Bing+DataForSEO data → Claude Code (Bedrock)
#   optimizes pages → tsc gate → branch+PR → safe actions (sitemap/IndexNow)
#   → SES email. PR-ONLY: a human reviews and merges. Every stage after
#   data-fetch fails soft so the report email always goes out.
set -uo pipefail

BASE=/opt/kidsbayarea-seo-cron
REPO_DIR=$BASE/kidsbayarea
export SEO_OUT_DIR=$BASE/out
LOG_PREFIX="[kba-seo-cron]"

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
    git add "${ALLOW[@]}" infra/seo-cron/history
    git -c user.name="kba-seo-cron" -c user.email="seo-cron@anureka.com" \
      commit -m "seo-cron: data-driven page optimizations $(date +%F)

Automated weekly SEO pass driven by GSC + Bing Webmaster + DataForSEO data.
See PR body for the optimizer report.

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
    git push -f origin "$BRANCH"
    PR_URL=$(gh pr create \
      --title "seo-cron: page optimizations (auto-updating, needs review)" \
      --body-file "$SEO_OUT_DIR/report.md" \
      --base main --head "$BRANCH" 2>/dev/null \
      || gh pr list --head "$BRANCH" --json url -q '.[0].url')
    echo "$PR_URL" > "$SEO_OUT_DIR/pr_url.txt"
    echo "$LOG_PREFIX PR: $PR_URL"
    echo "" >> "$SEO_OUT_DIR/report.md"
    echo "_PR opened/updated — review and merge manually to deploy via Amplify._" >> "$SEO_OUT_DIR/report.md"
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
