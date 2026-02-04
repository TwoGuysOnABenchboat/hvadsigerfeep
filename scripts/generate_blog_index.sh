#!/usr/bin/env bash
set -euo pipefail

node "$(dirname "$0")/generate_blog_index.js"
