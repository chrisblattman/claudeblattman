#!/usr/bin/env python3
"""Build a labelled draft from public source, retaining staging safeguards."""

import datetime
import html
import json
import os
from pathlib import Path
import re
import subprocess
import sys


def git(*args):
    return subprocess.check_output(["git", *args], text=True).strip()


def main():
    root = Path(git("rev-parse", "--show-toplevel"))
    os.chdir(root)
    branch = os.environ.get("DRAFT_BRANCH") or git("branch", "--show-current")
    if not branch or branch in {"main", "gh-pages"}:
        raise SystemExit("Draft preview requires a named draft branch, never main or gh-pages.")
    commit = git("rev-parse", "HEAD")
    build_env = dict(os.environ)
    build_env["PATH"] = str(Path(sys.executable).parent) + os.pathsep + build_env.get("PATH", "")
    subprocess.run(["bash", "scripts/build-staging.sh"], check=True, env=build_env)
    site = root / "site"
    if (site / "CNAME").exists():
        raise SystemExit("Refusing preview output that contains CNAME.")
    metadata = {
        "purpose": "Draft preview, not the live site",
        "branch": branch,
        "commit": commit,
        "built_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }
    (site / "_draft.json").write_text(json.dumps(metadata, indent=2) + "\n")
    label = html.escape(f"Draft preview · {branch} · {commit[:12]}")
    banner = (
        '<aside data-draft-preview="true" '
        'style="position:relative;z-index:100;background:#ffdf7e;color:#191919;'
        'padding:8px 16px;text-align:center;font:14px/1.4 system-ui">'
        + label
        + ' · <a href="/_draft.json" style="color:inherit">Version details</a></aside>'
    )
    count = 0
    for path in site.rglob("*.html"):
        content = path.read_text(encoding="utf-8")
        # A preview need not advertise localhost or production as its canonical URL.
        content = re.sub(r'<link\b[^>]*\brel=[\"\']canonical[\"\'][^>]*>', "", content)
        content, changed = re.subn(r"(<body\b[^>]*>)", lambda m: m[1] + banner, content, count=1)
        if changed:
            path.write_text(content, encoding="utf-8")
            count += 1
    # Preview sitemap URLs would otherwise use the staging config's localhost fallback.
    for name in ["sitemap.xml", "sitemap.xml.gz"]:
        (site / name).unlink(missing_ok=True)
    print(f"Draft build complete: {branch} at {commit[:12]}, {count} labelled HTML pages.")


if __name__ == "__main__":
    main()
