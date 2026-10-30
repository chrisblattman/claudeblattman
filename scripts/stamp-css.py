#!/usr/bin/env python3
"""Stamp mkdocs.yml's extra_css with the stylesheet's content hash.

MkDocs fingerprints Material's own bundles but not `extra_css`, so an edited
stylesheet keeps its URL and browsers serve the cached copy. Run this after
editing docs/stylesheets/extra.css — or just before a build — and the href
changes only when the file does.
"""
import hashlib
import pathlib
import re
import sys

root = pathlib.Path(__file__).resolve().parent.parent
css = root / "docs" / "stylesheets" / "extra.css"
cfg = root / "mkdocs.yml"

digest = hashlib.sha256(css.read_bytes()).hexdigest()[:10]
text = cfg.read_text()
new, n = re.subn(r"(- stylesheets/extra\.css)(\?v=[0-9a-f]+)?",
                 rf"\1?v={digest}", text, count=1)
if not n:
    sys.exit("could not find extra_css entry in mkdocs.yml")
if new != text:
    cfg.write_text(new)
    print(f"stamped extra.css -> ?v={digest}")
else:
    print(f"already current (?v={digest})")
