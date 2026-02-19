#!/bin/bash

# Pre-deployment secret validation script for Helm deployment
# Validates that all required secrets are properly configured before installing/upgrading
# Usage: ./validate-secrets.sh [environment]
# Example: ./validate-secrets.sh prod

set -e

ENVIRONMENT="${1:-prod}"
VALUES_FILE="helm/values-${ENVIRONMENT}.yaml"
REQUIRED_SECRETS=(
  "backend.secrets.jwtSecret"
  "backend.secrets.corsOrigin"
  "postgresql.auth.password"
)

echo "🔍 Validating secrets for '${ENVIRONMENT}' environment..."
echo "   Using values file: ${VALUES_FILE}"
echo ""

if [ ! -f "$VALUES_FILE" ]; then
  echo "❌ ERROR: Values file not found: ${VALUES_FILE}"
  exit 1
fi

ERRORS=0

# Check JWT Secret
JWT_SECRET=$(grep "jwtSecret:" "$VALUES_FILE" | head -1 | awk -F"'" '{print $2}' || echo "")
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "changeme-in-production" ]; then
  echo "❌ MISSING: backend.secrets.jwtSecret must be set via --set or environment-specific values"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ backend.secrets.jwtSecret is configured"
fi

# Check CORS Origin
CORS_ORIGIN=$(grep -A1 "corsOrigin:" "$VALUES_FILE" | grep -v "^--$" | tail -1 | awk -F"'" '{print $2}' || echo "")
if [ -z "$CORS_ORIGIN" ]; then
  echo "⚠️  WARNING: backend.secrets.corsOrigin is empty (may be OK if using ingress)"
else
  echo "✅ backend.secrets.corsOrigin is configured"
fi

# Check PostgreSQL Password
if [ "$ENVIRONMENT" != "prod" ]; then
  DB_PASSWORD=$(grep "password:" "$VALUES_FILE" | grep -v "jwtSecret\|external" | head -1 | awk -F"'" '{print $2}' || echo "")
  if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "admin123" ] && [ "$ENVIRONMENT" = "prod" ]; then
    echo "❌ MISSING: postgresql.auth.password must be changed from default in production"
    ERRORS=$((ERRORS + 1))
  else
    echo "✅ postgresql.auth.password is configured"
  fi
fi

# Check image pull secrets for production
if [ "$ENVIRONMENT" = "prod" ]; then
  IMAGE_REGISTRY=$(grep "imageRegistry:" "$VALUES_FILE" | head -1 | awk -F"'" '{print $2}' || echo "")
  if [[ "$IMAGE_REGISTRY" == *"ghcr.io"* ]]; then
    echo "⚠️  WARNING: imagePullSecrets must be configured for ghcr.io access"
    echo "   Set via: --set imagePullSecrets.enabled=true --set imagePullSecrets.username=<USER> --set imagePullSecrets.password=<TOKEN>"
  else
    echo "✅ Image registry does not require authentication"
  fi
fi

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ All required secrets are properly configured!"
  exit 0
else
  echo "❌ Found $ERRORS validation error(s). Please fix and try again."
  exit 1
fi
