#!/bin/bash

# Build and push Docker images to ghcr.io with semantic versioning tags
# Usage: ./scripts/build-and-push.sh [semver-version] [service-flags]
# Examples:
#   ./scripts/build-and-push.sh 1.0.0                    # Build all services
#   ./scripts/build-and-push.sh 1.0.0 --backend          # Build only backend
#   ./scripts/build-and-push.sh 1.0.0 --frontend         # Build only frontend
#   ./scripts/build-and-push.sh 1.0.0 --fit-sync         # Build only fit-sync
#   ./scripts/build-and-push.sh 1.0.0 --backend --fit-sync # Build multiple services
#   ./scripts/build-and-push.sh latest --all             # Build all with latest tag
# Creates tags: 1.0.0, 1.0, 1, latest (for non-latest versions)
# Note: Assumes you're already logged in to ghcr.io

set -e

GITHUB_USER="${GITHUB_USER:-edward-nunez}"
VERSION="${1:-latest}"
REGISTRY="ghcr.io"
REPO_PATH="personal-site"

# Parse service selection flags
BUILD_BACKEND=false
BUILD_FRONTEND=false
BUILD_FIT_SYNC=false

# If no service flags provided, build all by default
if [[ $# -lt 2 ]]; then
  BUILD_BACKEND=true
  BUILD_FRONTEND=true
  BUILD_FIT_SYNC=true
else
  # Parse service flags
  for arg in "${@:2}"; do
    case "$arg" in
      --backend) BUILD_BACKEND=true ;;
      --frontend) BUILD_FRONTEND=true ;;
      --fit-sync) BUILD_FIT_SYNC=true ;;
      --all)
        BUILD_BACKEND=true
        BUILD_FRONTEND=true
        BUILD_FIT_SYNC=true
        ;;
      *)
        echo "❌ Unknown option: $arg"
        echo "Available options: --backend, --frontend, --fit-sync, --all"
        exit 1
        ;;
    esac
  done
fi

# Check that at least one service is selected
if [ "$BUILD_BACKEND" = false ] && [ "$BUILD_FRONTEND" = false ] && [ "$BUILD_FIT_SYNC" = false ]; then
  echo "❌ No services selected. Use at least one of: --backend, --frontend, --fit-sync, --all"
  exit 1
fi

# Function to generate semantic version tags
generate_tags() {
  local service=$1
  local version=$2
  local base_image="$REGISTRY/$GITHUB_USER/$REPO_PATH/$service"
  
  if [ "$version" = "latest" ]; then
    echo "$base_image:latest"
  else
    # Extract major, minor, patch from semver
    local major=$(echo "$version" | cut -d. -f1)
    local minor=$(echo "$version" | cut -d. -f2)
    
    # Generate all tags
    echo "$base_image:$version"
    echo "$base_image:$major.$minor"
    echo "$base_image:$major"
    echo "$base_image:latest"
  fi
}

# Function to build and push image with multiple tags
build_and_push() {
  local service=$1
  local dockerfile=$2
  local version=$3
  
  echo "📦 Building $service..."
  
  # Get all tags for this service
  local tags=$(generate_tags "$service" "$version")
  
  # Convert tags to docker build arguments
  local docker_tags=""
  for tag in $tags; do
    docker_tags="$docker_tags -t $tag"
  done
  
  # Build with all tags
  docker build \
    -f "$dockerfile" \
    $docker_tags \
    .
  
  # Push all tags
  echo "📤 Pushing $service tags..."
  for tag in $tags; do
    docker push "$tag"
    echo "  ✅ Pushed: $tag"
  done
  echo ""
}

echo "🏗️  Building and pushing images with version: $VERSION"
echo ""

# Build selected services
if [ "$BUILD_BACKEND" = true ]; then
  build_and_push "backend" "packages/backend/Dockerfile" "$VERSION"
fi

if [ "$BUILD_FRONTEND" = true ]; then
  build_and_push "frontend" "packages/frontend/Dockerfile" "$VERSION"
fi

if [ "$BUILD_FIT_SYNC" = true ]; then
  build_and_push "fit-sync" "packages/fit-sync/Dockerfile" "$VERSION"
fi

echo "🎉 Images built and pushed successfully!"
echo ""
echo "📋 Image tags created for version $VERSION:"
if [ "$VERSION" != "latest" ]; then
  if [ "$BUILD_BACKEND" = true ]; then
    echo "  Backend:"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/backend:$VERSION"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/backend:$(echo $VERSION | cut -d. -f1).$(echo $VERSION | cut -d. -f2)"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/backend:$(echo $VERSION | cut -d. -f1)"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/backend:latest"
  fi
  if [ "$BUILD_FRONTEND" = true ]; then
    echo "  Frontend:"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/frontend:$VERSION"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/frontend:$(echo $VERSION | cut -d. -f1).$(echo $VERSION | cut -d. -f2)"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/frontend:$(echo $VERSION | cut -d. -f1)"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/frontend:latest"
  fi
  if [ "$BUILD_FIT_SYNC" = true ]; then
    echo "  Fit-sync:"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/fit-sync:$VERSION"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/fit-sync:$(echo $VERSION | cut -d. -f1).$(echo $VERSION | cut -d. -f2)"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/fit-sync:$(echo $VERSION | cut -d. -f1)"
    echo "    - $REGISTRY/$GITHUB_USER/$REPO_PATH/fit-sync:latest"
  fi
else
  [ "$BUILD_BACKEND" = true ] && echo "  Backend: $REGISTRY/$GITHUB_USER/$REPO_PATH/backend:latest"
  [ "$BUILD_FRONTEND" = true ] && echo "  Frontend: $REGISTRY/$GITHUB_USER/$REPO_PATH/frontend:latest"
  [ "$BUILD_FIT_SYNC" = true ] && echo "  Fit-sync: $REGISTRY/$GITHUB_USER/$REPO_PATH/fit-sync:latest"
fi
echo ""
echo "Next step: Update helm/values-prod.yaml with the image registry:"
echo "  imageRegistry: $REGISTRY/$GITHUB_USER/$REPO_PATH"
