#!/usr/bin/env bash
# Public release gate.
# The manifest records the v0.1 starter-kit release surface, but this gate scans
# the whole public repo so legacy docs and skills cannot leak private material.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

fail=0

say_fail() {
  printf 'ERROR: %s\n' "$*" >&2
  fail=1
}

tracked() {
  git ls-files --error-unmatch "$1" >/dev/null 2>&1
}

ignored() {
  git check-ignore -q "$1" >/dev/null 2>&1
}

must_stay_private=(
  "PUBLIC_VOCAB.md"
  "SESSION_LOG.md"
  "godaddy-setup.md"
)

for path in "${must_stay_private[@]}"; do
  if tracked "$path"; then
    say_fail "$path is tracked but must stay private/local for the starter-kit release."
  fi
  if [ -e "$path" ] && ! ignored "$path" && ! tracked "$path"; then
    say_fail "$path exists and is not ignored. Add it to .gitignore or move it outside the public repo."
  fi
done

for prefix in "planning/" ".claude/" "site/"; do
  if git ls-files -- "$prefix" | grep -q .; then
    say_fail "$prefix is tracked but should not be part of the public release source."
  fi
done

public_file_list="$(mktemp)"
trap 'rm -f "$public_file_list"' EXIT

{
  git ls-files
  git ls-files --others --exclude-standard
} | sort -u > "$public_file_list"

public_file_count="$(wc -l < "$public_file_list" | tr -d ' ')"

if [ "$public_file_count" -eq 0 ]; then
  say_fail "no public files found; git ls-files returned nothing"
else
  private_re='(/Users/chrisblattman|Dropbox/(Codex|AI_Projects|Research & Writing|Claude/Settings|Claude/Projects)|Proposal_Resources|HPP-Blattman|blattman@gmail|Label_[0-9]+|[a-z0-9]{6,}@(g\.us|lid)|[a-z0-9]{16,}@group\.calendar\.google\.com|uchicago-bfi-blattman|PVT[A-Za-z]*_[A-Za-z0-9]+|\.granola-api-key|sk-ant-|client_secret|api_key[[:space:]]*=|password[[:space:]]*=|IRB[- ]?[0-9])'
  hits=$(xargs grep -IInE "$private_re" < "$public_file_list" 2>/dev/null | grep -v '^scripts/check-public-release.sh:' | grep -v '^CONTRIBUTING.md:' || true)
  if [ -n "$hits" ]; then
    printf 'Private marker hits in public repo surface:\n%s\n' "$hits" >&2
    fail=1
  fi

  # These .local files are intentionally gitignored because they may contain real
  # private names or phrases. CI usually skips them; run this gate locally before
  # public pushes for the fuller name/phrase sweep.
  for list in ".sanitize-names.local" ".sanitize-private-blocklist.local"; do
    if [ -s "$list" ]; then
      hits=$(xargs grep -IInE -f "$list" < "$public_file_list" 2>/dev/null | grep -v '^CONTRIBUTING.md:' || true)
      if [ -n "$hits" ]; then
        printf 'Private blocklist hits from %s:\n%s\n' "$list" "$hits" >&2
        fail=1
      fi
    fi
  done
fi

if ! python3 - <<'PY'
import json
from pathlib import Path

market = json.loads(Path('.claude-plugin/marketplace.json').read_text())
claude = json.loads(Path('plugins/starter-kit/.claude-plugin/plugin.json').read_text())
codex = json.loads(Path('plugins/starter-kit-codex/plugin.json').read_text())
listed = next(p for p in market['plugins'] if p['name'] == 'starter-kit')
assert market['metadata']['version'] == listed['version'] == claude['version'] == codex['version']
PY
then
  say_fail "Claude marketplace, Claude plugin, and Codex plugin versions must match"
fi

if [ ! -f public-manifest.json ]; then
  say_fail "public-manifest.json is missing. Run: scripts/emit-public.sh"
fi

if [ "$fail" -ne 0 ]; then
  printf '\nPublic release check failed. Fix the items above before push.\n' >&2
  exit 1
fi

printf 'Public release check passed (%s files scanned).\n' "$public_file_count"
