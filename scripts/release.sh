#!/usr/bin/env bash
set -eu

release_arg="${1:-}"

if [[ -z "$release_arg" ]]; then
  echo "Usage: release-version.sh <patch|minor|major|x.y.z>" >&2
  exit 1
fi

pnpm version "$release_arg"
