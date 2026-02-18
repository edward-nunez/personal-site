#!/usr/bin/env sh
# Build backend and frontend Docker images from repository root.
# Usage: from repo root, run: ./scripts/build-images.sh [tag]
# Default tag: latest. Example: ./scripts/build-images.sh v1.0.0

set -e
TAG="${1:-latest}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "Building images with tag: $TAG"
docker build -t "personal-site-backend:$TAG" -f packages/backend/Dockerfile .
docker build -t "personal-site-frontend:$TAG" -f packages/frontend/Dockerfile .
echo "Done. Images: personal-site-backend:$TAG, personal-site-frontend:$TAG"
