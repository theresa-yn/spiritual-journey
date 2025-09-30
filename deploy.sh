#!/bin/bash
set -euo pipefail

# Always run from repo root (this script lives at repo root)
cd "$(dirname "$0")"

# Use npx to ensure firebase-tools is available without global install
if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required. Please install Node.js with npm/npx available." >&2
  exit 1
fi

# Select project if provided, else keep current default
PROJECT="${1:-spiritual-journey-e3330}"

echo "Using Firebase project: $PROJECT"
npx --yes firebase-tools use "$PROJECT"

echo "Deploying Hosting (public=docs) ..."
npx --yes firebase-tools deploy --only hosting
