#!/usr/bin/env bash
# Emit the v0.1 public release manifest.
#
# v0.1 starter-kit artifacts are authored directly in the public repo. This
# script does not copy private files. It records the exact public release
# surface and content hashes so CI can detect accidental drift before push.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

mode="${1:-write}"
if [ "$mode" != "write" ] && [ "$mode" != "--check" ]; then
  printf 'usage: scripts/emit-public.sh [--check]\n' >&2
  exit 2
fi

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

file_list="$tmpdir/files.txt"
manifest_tmp="$tmpdir/public-manifest.json"

release_surfaces=(
  "README.md"
  ".gitignore"
  ".claude-plugin"
  ".agents/plugins/marketplace.json"
  "starter-kit-source"
  "plugins/starter-kit-codex"
  "plugins/starter-kit"
  "codex-starter"
  "docs/starter-kit"
  "docs/index.md"
  "docs/setup/skill-reference.md"
  "docs/skills/school-digest-raw-materials.md"
  "docs/stylesheets/extra.css"
  "mkdocs.yml"
  ".github/workflows"
  "scripts"
  "skills/README.md"
  "skills/council.md"
  "skills/review-plan.md"
  "skills/done.md"
)

{
  git ls-files -z -- "${release_surfaces[@]}"
  git ls-files -z --others --exclude-standard -- "${release_surfaces[@]}"
} > "$file_list"

python3 - "$file_list" "$manifest_tmp" <<'PY'
import hashlib
import json
import sys
from pathlib import Path

file_list = Path(sys.argv[1])
manifest_path = Path(sys.argv[2])

files = []
for line in sorted(set(file_list.read_text(encoding="utf-8").split("\0")) - {""}):
    path = Path(line)
    if not path.is_file():
        continue
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    files.append({
        "path": line,
        "sha256": digest,
        "bytes": path.stat().st_size,
    })

manifest = {
    "schema_version": 1,
    "release": "starter-kit-v" + json.loads(Path("starter-kit-source/package.json").read_text())["version"],
    "mode": "public-repo-authored",
    "note": "Records the public starter-kit release surface and generated packages; contains no private source copies.",
    "files": files,
}

manifest_path.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
PY

if [ "$mode" = "--check" ]; then
  if [ ! -f public-manifest.json ]; then
    printf 'public-manifest.json is missing. Run: scripts/emit-public.sh\n' >&2
    exit 1
  fi
  if ! cmp -s "$manifest_tmp" public-manifest.json; then
    printf 'public-manifest.json is stale. Run: scripts/emit-public.sh\n' >&2
    exit 1
  fi
  printf 'public-manifest.json is current.\n'
  exit 0
fi

mv "$manifest_tmp" public-manifest.json
printf 'Wrote public-manifest.json.\n'
scripts/check-public-release.sh
