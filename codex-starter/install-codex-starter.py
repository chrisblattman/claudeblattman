#!/usr/bin/env python3
"""Install the Codex starter pack: five skills; optional global guidance.

Run from inside the pack folder:

    python3 install-codex-starter.py install

Subcommands:
    install    copy the pack into place (backs up anything it would overwrite)
    status     preview what install would do, without changing anything
    verify     check that installed files are present and unchanged
    uninstall  remove installed files and restore any backed-up originals

Installs to:
    global/AGENTS.md  ->  ~/.codex/AGENTS.md
    skills/<name>     ->  ~/.codex/skills/<name>

Uses only the Python standard library. Never deletes your data: anything it
would overwrite is first copied to a timestamped .bak file next to the
original, and the message tells you where.
"""

import argparse
import datetime
import hashlib
import json
import os
import shutil
import sys
from pathlib import Path

PACK_NAME = "claude-blattman-codex-starter"
PACK_ROOT = Path(__file__).resolve().parent
TARGET_ROOT = Path.home() / ".codex"
STATE_ROOT = TARGET_ROOT / "managed" / PACK_NAME
RECORD_PATH = STATE_ROOT / "installed.json"

MANIFEST = [
    {"source": "skills/" + name, "destination": "~/.codex/skills/" + name, "type": "directory"}
    for name in ("council", "kit-hello", "kit-setup", "ask-agents", "done")
]



def expand(path_text):
    return TARGET_ROOT / path_text.removeprefix("~/.codex/") if path_text.startswith("~/.codex/") else Path(os.path.expanduser(path_text))


def file_hash(path):
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def tree_hash(path):
    """Content hash of a file, or of a directory tree (names + contents)."""
    digest = hashlib.sha256()
    if path.is_file():
        digest.update(b"file\0")
        digest.update(file_hash(path).encode("ascii"))
        return digest.hexdigest()
    for child in sorted(p for p in path.rglob("*") if p.is_file()):
        rel = child.relative_to(path).as_posix()
        digest.update(rel.encode("utf-8"))
        digest.update(b"\0")
        digest.update(file_hash(child).encode("ascii"))
        digest.update(b"\0")
    return digest.hexdigest()


def load_record():
    if not RECORD_PATH.exists():
        return {"items": []}
    try:
        with open(RECORD_PATH, "r", encoding="utf-8") as handle:
            return json.load(handle)
    except (OSError, ValueError):
        return {"items": []}


def save_record(items):
    STATE_ROOT.mkdir(parents=True, exist_ok=True)
    payload = {
        "pack": PACK_NAME,
        "pack_root": str(PACK_ROOT),
        "installed_at": datetime.datetime.now().isoformat(timespec="seconds"),
        "items": items,
    }
    with open(RECORD_PATH, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)
        handle.write("\n")


def remove_path(target):
    if target.is_dir() and not target.is_symlink():
        shutil.rmtree(target)
    else:
        target.unlink()


def copy_item(source, destination, item_type):
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        remove_path(destination)
    if item_type == "directory":
        shutil.copytree(source, destination)
    else:
        shutil.copy2(source, destination)


def make_backup(destination, timestamp):
    """Copy destination to a sibling like AGENTS.md.bak-20260101-120000."""
    backup = destination.with_name(destination.name + ".bak-" + timestamp)
    if destination.is_dir() and not destination.is_symlink():
        shutil.copytree(destination, backup)
    else:
        shutil.copy2(destination, backup)
    return backup


def record_item(item, destination, src_hash, dst_hash, restore_path):
    entry = {
        "source": item["source"],
        "destination": str(destination),
        "type": item["type"],
        "source_hash": src_hash,
        "destination_hash": dst_hash,
    }
    if restore_path:
        entry["restore_path"] = restore_path
    return entry


def cmd_install():
    record = load_record()
    recorded = {entry["destination"]: entry for entry in record.get("items", [])}
    timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    new_items = []
    for item in MANIFEST:
        source = PACK_ROOT / item["source"]
        if not source.exists():
            sys.exit(
                "This pack is missing %s.\n"
                "Re-download the starter pack, then run install again from inside it." % source
            )
        destination = expand(item["destination"])
        src_hash = tree_hash(source)
        previous = recorded.get(str(destination))
        restore_path = previous.get("restore_path") if previous else None
        if destination.exists():
            dst_hash = tree_hash(destination)
            if dst_hash == src_hash:
                print("up to date: %s" % destination)
                new_items.append(record_item(item, destination, src_hash, dst_hash, restore_path))
                continue
            backup = make_backup(destination, timestamp)
            if previous is None:
                # A file of yours that predates this pack: remember it so
                # uninstall can put it back.
                restore_path = str(backup)
                print("backed up your existing %s to %s (uninstall restores it)" % (destination, backup))
            else:
                print("backed up your edited %s to %s" % (destination, backup))
        copy_item(source, destination, item["type"])
        new_items.append(record_item(item, destination, src_hash, tree_hash(destination), restore_path))
        print("installed: %s" % destination)
    save_record(new_items)
    print("")
    print("Done. Restart Codex so it picks up the skills, then invoke them by")
    print("name in any session: /council  /kit-hello  /kit-setup  /ask-agents  /done")
    return 0


def cmd_status():
    for item in MANIFEST:
        source = PACK_ROOT / item["source"]
        destination = expand(item["destination"])
        if not source.exists():
            print("missing from pack (re-download it): %s" % item["source"])
        elif not destination.exists():
            print("would install: %s" % destination)
        elif tree_hash(destination) == tree_hash(source):
            print("up to date: %s" % destination)
        else:
            print("would update (existing copy backed up first): %s" % destination)
    return 0


def cmd_verify():
    record = load_record()
    items = record.get("items", [])
    if not items:
        print("Nothing is installed yet. Run: python3 install-codex-starter.py install")
        return 1
    problems = 0
    for item in items:
        destination = Path(item["destination"])
        source = PACK_ROOT / item["source"]
        if not destination.exists():
            print("missing: %s (run install again)" % destination)
            problems += 1
        elif tree_hash(destination) != item.get("destination_hash"):
            print("edited since install: %s (fine to keep; reinstalling backs it up, then replaces it)" % destination)
            problems += 1
        elif source.exists() and tree_hash(source) != item.get("source_hash"):
            print("pack has a newer version of: %s (run install to update)" % destination)
        else:
            print("ok: %s" % destination)
    return 1 if problems else 0


def cmd_uninstall():
    record = load_record()
    items = record.get("items", [])
    if not items:
        print("Nothing to uninstall (no install record found).")
        return 0
    timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S-%f")
    for item in items:
        destination = Path(item["destination"])
        if destination.exists():
            if tree_hash(destination) != item.get("destination_hash"):
                backup = make_backup(destination, timestamp)
                print("you had edited %s; saved a copy to %s" % (destination, backup))
            remove_path(destination)
            print("removed: %s" % destination)
        restore = item.get("restore_path")
        if restore and Path(restore).exists():
            copy_item(Path(restore), destination, item["type"])
            print("restored your original: %s" % destination)
    try:
        RECORD_PATH.unlink()
    except OSError:
        pass
    try:
        STATE_ROOT.rmdir()
    except OSError:
        pass
    print("Uninstalled.")
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="Install or remove five Codex starter skills."
    )
    parser.add_argument(
        "command",
        choices=["install", "status", "verify", "uninstall"],
        help="install: copy into place; status: preview; verify: check; uninstall: remove",
    )
    parser.add_argument("--target-root", type=Path, help="Explicit install root, useful for isolated tests")
    parser.add_argument("--include-global-guidance", action="store_true", help="Also install the optional global AGENTS.md")
    args = parser.parse_args()
    global TARGET_ROOT, STATE_ROOT, RECORD_PATH
    if args.target_root:
        TARGET_ROOT = args.target_root.resolve()
        STATE_ROOT = TARGET_ROOT / "managed" / PACK_NAME
        RECORD_PATH = STATE_ROOT / "installed.json"
    if args.include_global_guidance:
        MANIFEST.append({"source": "global/AGENTS.md", "destination": "~/.codex/AGENTS.md", "type": "file"})
    if args.command in ("install", "status"):
        for retired in ("prompt", "review-plan"):
            if (TARGET_ROOT / "skills" / retired).exists():
                print(f"Retired starter skill still present: {retired}; preserving it for explicit migration.")
    if args.command == "install":
        return cmd_install()
    if args.command == "status":
        return cmd_status()
    if args.command == "verify":
        return cmd_verify()
    return cmd_uninstall()


if __name__ == "__main__":
    sys.exit(main())
