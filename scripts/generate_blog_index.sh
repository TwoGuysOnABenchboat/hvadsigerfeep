#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if command -v node >/dev/null 2>&1; then
  node "$SCRIPT_DIR/generate_blog_index.js"
elif command -v python3 >/dev/null 2>&1; then
  python3 "$SCRIPT_DIR/generate_blog_index.py"
elif command -v python >/dev/null 2>&1; then
  python "$SCRIPT_DIR/generate_blog_index.py"
else
  echo "Error: neither node nor python is available in PATH." >&2
  exit 1
fi
