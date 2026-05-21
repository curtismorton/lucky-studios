#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

required_env_vars=(
  "NEXT_PUBLIC_SITE_URL"
  "SPOTIFY_CLIENT_ID"
  "SPOTIFY_CLIENT_SECRET"
  "CONTACT_FORM_ENDPOINT"
  "NEXT_PUBLIC_CALENDLY_URL"
)

optional_env_vars=(
  "SUPABASE_URL"
  "SUPABASE_SERVICE_ROLE_KEY"
  "SUPABASE_ANON_KEY"
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SPOTIFY_MARKET"
  "CMS_SESSION_SECRET"
  "CMS_ADMIN_MFA_CODE"
  "CMS_ADMIN_TOKEN"
  "CMS_CONTENT_TABLE"
  "CMS_MEDIA_BUCKET"
  "CMS_MEDIA_PREFIX"
  "CMS_AUTH_BASE_URL"
  "CMS_V2_DASHBOARD_ENABLED"
  "CMS_V2_READS_ENABLED"
  "CMS_V2_WRITES_ENABLED"
  "CMS_LEGACY_ADMIN_READONLY"
  "CMS_PREVIEW_SECRET"
)

status=0

echo "== Launch Preflight =="
echo "Project: $ROOT_DIR"

if [ ! -f "$ROOT_DIR/.env.local" ]; then
  echo "[FAIL] Missing .env.local"
  echo "       Run: cp .env.example .env.local"
  status=1
else
  echo "[OK] .env.local exists"

  for key in "${required_env_vars[@]}"; do
    if grep -qE "^${key}=.+" "$ROOT_DIR/.env.local"; then
      echo "[OK] $key"
    else
      echo "[FAIL] $key is missing or empty in .env.local"
      status=1
    fi
  done

  for key in "${optional_env_vars[@]}"; do
    if grep -qE "^${key}=.+" "$ROOT_DIR/.env.local"; then
      echo "[OK] $key"
    else
      echo "[WARN] $key not set"
    fi
  done
fi

echo
echo "Checking referenced /images assets..."

missing_images=0
while IFS= read -r path; do
  [ -z "$path" ] && continue
  if [ ! -f "$ROOT_DIR/public${path}" ]; then
    echo "[FAIL] Missing image: public${path}"
    missing_images=1
  fi
done < <(
  grep -R -h -o '"/images/[^\"]*"' "$ROOT_DIR/components" "$ROOT_DIR/app" "$ROOT_DIR/lib" \
    | tr -d '"' \
    | sort -u
)

if [ "$missing_images" -eq 0 ]; then
  echo "[OK] All referenced /images files exist"
else
  status=1
fi

echo
echo "Checking core logo files..."
for logo in "/images/LOGO.png" "/images/LOGO-WHITE.png"; do
  if [ -f "$ROOT_DIR/public${logo}" ]; then
    echo "[OK] public${logo}"
  else
    echo "[FAIL] public${logo} missing"
    status=1
  fi
done

echo
if [ "$status" -eq 0 ]; then
  echo "Preflight passed. Safe to deploy."
else
  echo "Preflight failed. Fix items above before deploy."
fi

exit "$status"
