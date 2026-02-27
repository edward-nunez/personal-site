#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://api.edwardnunez.io/v1/orchestrator}"
DATA_FILE="${1:-scripts/data/prod-profile.payload.json}"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install with: brew install jq"
  exit 1
fi

if [[ ! -f "$DATA_FILE" ]]; then
  echo "Data file not found: $DATA_FILE"
  echo "Start from template: scripts/data/prod-profile.payload.template.json"
  exit 1
fi

TOKEN="${ADMIN_TOKEN:-}"

if [[ -z "$TOKEN" ]]; then
  if [[ -z "${ADMIN_USER:-}" || -z "${ADMIN_PASSWORD:-}" ]]; then
    echo "Set ADMIN_TOKEN, or set ADMIN_USER and ADMIN_PASSWORD."
    exit 1
  fi

  echo "Authenticating as $ADMIN_USER..."
  AUTH_RESPONSE="$(curl -sS -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "$(jq -nc --arg u "$ADMIN_USER" --arg p "$ADMIN_PASSWORD" '{username:$u,password:$p}')")"

  TOKEN="$(printf '%s' "$AUTH_RESPONSE" | jq -r '.data.token // empty')"
  if [[ -z "$TOKEN" ]]; then
    echo "Failed to authenticate. Response: $AUTH_RESPONSE"
    exit 1
  fi
fi

echo "Checking current prod data..."
EXISTING_EXPERIENCES="$(curl -sS "$BASE_URL/experiences")"
EXISTING_PROJECTS="$(curl -sS "$BASE_URL/projects")"

EXISTING_EXP_COUNT="$(printf '%s' "$EXISTING_EXPERIENCES" | jq -r '.data | length')"
EXISTING_PROJ_COUNT="$(printf '%s' "$EXISTING_PROJECTS" | jq -r '.data | length')"

echo "Existing records -> experiences: $EXISTING_EXP_COUNT, projects: $EXISTING_PROJ_COUNT"

echo "Importing experiences..."
while IFS= read -r experience; do
  [[ -z "$experience" ]] && continue

  company="$(printf '%s' "$experience" | jq -r '.company')"
  role="$(printf '%s' "$experience" | jq -r '.role')"
  start_date="$(printf '%s' "$experience" | jq -r '.startDate')"

  duplicate="$(printf '%s' "$EXISTING_EXPERIENCES" | jq -r --arg c "$company" --arg r "$role" --arg s "$start_date" '
    .data[]? | select(.company == $c and .role == $r and .startDate == $s) | .id' | head -n1)"

  if [[ -n "$duplicate" ]]; then
    echo "- Skipping duplicate experience: $role at $company"
    continue
  fi

  response="$(curl -sS -X POST "$BASE_URL/experiences" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$experience")"

  ok="$(printf '%s' "$response" | jq -r '.success // false')"
  if [[ "$ok" != "true" ]]; then
    echo "Failed creating experience: $role at $company"
    echo "$response"
    exit 1
  fi

  echo "- Created experience: $role at $company"
done < <(jq -c '.experiences[]?' "$DATA_FILE")

echo "Importing projects..."
while IFS= read -r project; do
  [[ -z "$project" ]] && continue

  slug="$(printf '%s' "$project" | jq -r '.slug')"
  title="$(printf '%s' "$project" | jq -r '.title')"

  duplicate="$(printf '%s' "$EXISTING_PROJECTS" | jq -r --arg slug "$slug" '.data[]? | select(.slug == $slug) | .id' | head -n1)"
  if [[ -n "$duplicate" ]]; then
    echo "- Skipping duplicate project: $title ($slug)"
    continue
  fi

  response="$(curl -sS -X POST "$BASE_URL/projects" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$project")"

  ok="$(printf '%s' "$response" | jq -r '.success // false')"
  if [[ "$ok" != "true" ]]; then
    echo "Failed creating project: $title"
    echo "$response"
    exit 1
  fi

  echo "- Created project: $title"
done < <(jq -c '.projects[]?' "$DATA_FILE")

cat <<'EOF'

Done.

Notes:
- Toolkit categories are read-only via API in current backend; import those directly via DB SQL if needed.
- Verify results:
  - GET /experiences
  - GET /projects
  - GET /toolkit
EOF
