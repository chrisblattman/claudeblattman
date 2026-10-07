#!/usr/bin/env bash
# Build the preview site for Cloudflare Pages.
#
# Three things this does that `mkdocs build` alone cannot:
#
#   1. DROPS docs/CNAME from the output. It contains claudeblattman.com and is
#      copied into every build. Serve that from a second host and it tries to
#      claim the production custom domain. This is the one that could take the
#      live site down — do not remove this step.
#   2. REPLACES robots.txt with Disallow: /. The real one allows search engines,
#      which would index a half-finished redesign including the "not written
#      yet" stub pages.
#   3. WRITES _headers so Cloudflare sends X-Robots-Tag: noindex, nofollow on
#      every response — belt and braces, since robots.txt is advisory.
#   On Cloudflare, pair this with requirements-staging.txt rather than
#   requirements.txt — see that file for why.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

OUT="${1:-site}"
mkdocs build -f mkdocs-staging.yml -d "$OUT"

rm -f "$OUT/CNAME"

cat > "$OUT/robots.txt" <<'ROBOTS'
# Preview build. Not for indexing.
User-agent: *
Disallow: /
ROBOTS

cat > "$OUT/_headers" <<'HEADERS'
/*
  X-Robots-Tag: noindex, nofollow, noarchive
HEADERS

printf 'staging build in %s/ — CNAME dropped, robots disallowed, noindex header set\n' "$OUT"
