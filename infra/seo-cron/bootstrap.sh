#!/usr/bin/env bash
# One-time setup of the kidsbayarea SEO cron on the shared visacub-seo-cron
# EC2 (i-0fee473f9b347c706). Run as root via SSM. Idempotent. Coexists with
# the box's other weekly pipelines (Mon=visacub, Tue=citationmap, Wed=pfv,
# Sat=eurkart; this one runs Thu) — it uses its own workdir
# (/opt/seo-cron-kidsbayarea) and uniquely-named systemd units
# (seo-cron-kidsbayarea.*).
set -euo pipefail

# Deps (node + claude already installed on this box; pip deps shared, harmless
# to re-ensure).
dnf install -y git python3-pip >/dev/null 2>&1 || true
sudo -u ec2-user pip3 install --user --quiet \
  boto3 requests google-api-python-client google-auth geo-optimizer-skill || true

# Swap already exists on this shared box (citationmap bootstrap created it);
# ensure it's present for the tsc gate just in case.
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 3G /swapfile && chmod 600 /swapfile
  mkswap /swapfile >/dev/null && swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# Workdir + initial clone (token from SSM; instance role grants the read)
mkdir -p /opt/seo-cron-kidsbayarea/out
chown -R ec2-user:ec2-user /opt/seo-cron-kidsbayarea
if [ ! -d /opt/seo-cron-kidsbayarea/kidsbayarea/.git ]; then
  GH_TOKEN=$(aws ssm get-parameter --name /seo-cron/kidsbayarea/github-token \
    --with-decryption --query Parameter.Value --output text --region us-east-1)
  sudo -u ec2-user git clone \
    "https://oauth2:${GH_TOKEN}@github.com/Anureka-Inc/kidsbayarea.git" \
    /opt/seo-cron-kidsbayarea/kidsbayarea
fi
chmod +x /opt/seo-cron-kidsbayarea/kidsbayarea/infra/seo-cron/run.sh

# npm deps for the tsc gate (cached across runs)
cd /opt/seo-cron-kidsbayarea/kidsbayarea && sudo -u ec2-user npm ci --no-audit --no-fund

# systemd units
UNIT_SRC=/opt/seo-cron-kidsbayarea/kidsbayarea/infra/seo-cron
cp "$UNIT_SRC/seo-cron-kidsbayarea.service" /etc/systemd/system/
cp "$UNIT_SRC/seo-cron-kidsbayarea.timer" /etc/systemd/system/
cp "$UNIT_SRC/seo-cron-kidsbayarea-failure-notify.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now seo-cron-kidsbayarea.timer
systemctl list-timers seo-cron-kidsbayarea.timer --no-pager
echo "kidsbayarea seo-cron bootstrap complete"
