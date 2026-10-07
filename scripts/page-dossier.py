#!/usr/bin/env python3
"""Mechanical half of a page dossier.

Given source pages, report what is in them and how they are wired to the rest
of the site, so a rewrite starts from facts rather than memory. The judgement
half — decisions, open questions, critic findings — is written by hand.

    python3 scripts/page-dossier.py docs/toolkit/install-mac.md ...
"""
import sys, os, re, glob

DOCS = "docs"

def norm(src, href):
    href = href.split("#")[0]
    if not href or href.startswith(("http", "mailto:")):
        return None
    return os.path.normpath(os.path.join(os.path.dirname(src), href))

def split_fm(raw):
    if raw.startswith("---\n"):
        e = raw.find("\n---\n", 4)
        if e != -1:
            return raw[4:e + 1], raw[e + 5:]
    return "", raw

# every inbound link in the site, built once
inbound = {}
for p in glob.glob(f"{DOCS}/**/*.md", recursive=True):
    rel = os.path.relpath(p, DOCS)
    for m in re.finditer(r"\]\(([^)]+)\)", open(p, encoding="utf-8").read()):
        t = norm(rel, m.group(1))
        if t:
            inbound.setdefault(t, set()).add(rel)

nav = open("mkdocs.yml", encoding="utf-8").read()
navblock = nav.split("nav:", 1)[1].split("\nmarkdown_extensions:")[0]

total = 0
for arg in sys.argv[1:]:
    rel = os.path.relpath(arg, DOCS)
    if not os.path.exists(arg):
        print(f"\n### {rel}\n  MISSING\n")
        continue
    fm, body = split_fm(open(arg, encoding="utf-8").read())
    prose = re.sub(r"```.*?```", "", body, flags=re.S)
    words = len(prose.split())
    total += words

    print(f"\n{'='*74}\n{rel}  —  {words} words\n{'='*74}")
    print(f"  in nav            {'yes' if rel in navblock else 'NO — orphaned'}")
    print(f"  inbound links     {len(inbound.get(rel, set()))}"
          f"{'  from: ' + ', '.join(sorted(inbound[rel])[:4]) if inbound.get(rel) else ''}")
    out = {norm(rel, m.group(1)) for m in re.finditer(r"\]\(([^)]+)\)", body)}
    out = {o for o in out if o and o.endswith(".md")}
    print(f"  outbound links    {len(out)}")
    n_code = len(re.findall(r"^```", body, re.M)) // 2
    n_adm = len(re.findall(r"^!!!", body, re.M)) + len(re.findall(r"^\?\?\?", body, re.M))
    n_img = len(re.findall(r"!\[", body))
    n_box = len(re.findall(r"<input type=.checkbox", body))
    tabs = len(re.findall(r"^=== ", body, re.M))
    print(f"  code blocks       {n_code}")
    print(f"  admonitions       {n_adm}")
    print(f"  images            {n_img}")
    print(f"  checkboxes        {n_box}")
    if tabs:
        print(f"  tabbed panels     {tabs}")
    print("  headings:")
    for m in re.finditer(r"^(#{1,3})\s+(.+)$", body, re.M):
        print(f"      {'  ' * (len(m.group(1)) - 1)}{m.group(2).strip()[:62]}")

print(f"\n{'='*74}\nTOTAL SOURCE MATERIAL: {total} words\n{'='*74}")
