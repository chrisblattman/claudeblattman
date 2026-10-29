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

if ! python3 scripts/scan-public.py; then
  say_fail "public source/privacy scan failed"
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

printf 'Public release check passed.\n'
