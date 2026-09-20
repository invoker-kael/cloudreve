#!/bin/bash
set -e
export NODE_OPTIONS="--max-old-space-size=8192"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
FRONTEND_OVERRIDE_ROOT="${SCRIPT_DIR}/frontend-overrides"

# This fork keeps the upstream frontend as a pinned submodule. Apply the small
# kiosk-mode surface as deterministic build-time overlays so no second frontend
# fork is required.
cd "${REPO_ROOT}/assets"
cp "${FRONTEND_OVERRIDE_ROOT}/src/main.tsx" src/main.tsx
cp "${FRONTEND_OVERRIDE_ROOT}/src/component/Frame/NavBar/UserAction.tsx" src/component/Frame/NavBar/UserAction.tsx
rm -rf build
yarn install --network-timeout 1000000
yarn version --new-version $1 --no-git-tag-version
yarn run build

# Copy the build files to the application directory
cd ../
zip -r - assets/build >assets.zip
mv assets.zip application/statics