#!/usr/bin/env python3
"""Generate both starter plugins and manual Codex skills from one authoritative source."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "starter-kit-source"


def tree(path):
    return {str(p.relative_to(path)): p.read_bytes() for p in path.rglob("*") if p.is_file()}


def put(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n")


def generate(stage, host, metadata):
    for name in metadata["skills"]:
        skill = stage / "skills" / name
        shutil.copytree(SOURCE / "skills" / name, skill)
        refs = skill / "references"
        refs.mkdir(exist_ok=True)
        shutil.copy2(SOURCE / "adapters" / host / "host.md", refs / "host.md")
        put(refs / "package.json", metadata)
        if name == "council":
            shutil.copytree(SOURCE / "agents", refs / "personas")
        if name == "ask-agents":
            shutil.copy2(SOURCE / "adapters" / host / "transport.md", refs / "transport.md")
            if host == "claude":
                shutil.copytree(SOURCE / "adapters/claude/scripts", skill / "scripts")
                shutil.copy2(SOURCE / "adapters/claude/engines-contract.md", refs / "engines-contract.md")
            else:
                (skill / "scripts").mkdir()
                shutil.copy2(SOURCE / "adapters/codex/run-external-agent.mjs", skill / "scripts/run-external-agent.mjs")
    base = {"name": "starter-kit" if host == "claude" else "starter-kit-codex", "version": metadata["version"],
            "description": metadata["description"], "author": {"name": "Chris Blattman", "url": "https://claudeblattman.com"},
            "homepage": "https://claudeblattman.com/starter-kit/", "license": "MIT"}
    if host == "claude":
        put(stage / ".claude-plugin/plugin.json", base)
        shutil.copy2(SOURCE / "assets/icon-512.png", stage / ".claude-plugin/icon.png")
        shutil.copytree(SOURCE / "agents", stage / "agents")
        shutil.copytree(SOURCE / "adapters/claude/commands", stage / "commands")
    else:
        base.update({"$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
                     "repository": "https://github.com/chrisblattman/claudeblattman", "keywords": ["council", "workflow", "review", "handoff"],
                     "extensions": {"com.openai": {"requires_local_executor": True, "interface": {
                         "displayName": "Starter Kit for Codex", "shortDescription": "Councils and session handoffs",
                         "longDescription": metadata["description"], "developerName": "Chris Blattman", "category": "Productivity",
                         "capabilities": [], "defaultPrompt": "Help me use the starter kit for this project.",
                         "websiteURL": "https://claudeblattman.com/starter-kit/", "logo": "./assets/icon-512.png", "composerIcon": "./assets/icon-512.png"}}}})
        put(stage / "plugin.json", base)
        (stage / "assets").mkdir()
        shutil.copy2(SOURCE / "assets/icon-512.png", stage / "assets/icon-512.png")
    shutil.copy2(SOURCE / "PACKAGE-README.md", stage / "README.md")
    shutil.copy2(SOURCE / "MAINTENANCE.md", stage / "CROSS-CLIENT.md")


def sync(expected, destination, check):
    wanted, actual = tree(expected), tree(destination) if destination.exists() else {}
    if check:
        if wanted != actual:
            stale = sorted(k for k in set(wanted) | set(actual) if wanted.get(k) != actual.get(k))
            raise ValueError(f"Generated files stale in {destination.relative_to(ROOT)}: {stale}")
    else:
        if destination.exists():
            shutil.rmtree(destination)
        shutil.copytree(expected, destination)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--package-dir", type=Path, help="Write local ZIPs outside plugin directories; never uploads")
    parser.add_argument("--standalone-skill", choices=["aniket-me"],
                        help="Export only this self-contained skill, with pilot instructions and license")
    args = parser.parse_args()
    if args.standalone_skill and not args.package_dir:
        parser.error("--standalone-skill requires --package-dir")
    metadata = json.loads((SOURCE / "package.json").read_text())
    if set(metadata["skills"]) != {p.name for p in (SOURCE / "skills").iterdir() if p.is_dir()}:
        raise ValueError("Source skill inventory differs from package.json")
    with tempfile.TemporaryDirectory() as temp:
        stages = {}
        for host, name in (("claude", "starter-kit"), ("codex", "starter-kit-codex")):
            stage = Path(temp) / name
            stage.mkdir()
            generate(stage, host, metadata)
            sync(stage, ROOT / "plugins" / name, args.check)
            stages[host] = stage
        sync(stages["codex"] / "skills", ROOT / "codex-starter/skills", args.check)
        market_path = ROOT / ".claude-plugin/marketplace.json"
        market = json.loads(market_path.read_text())
        expected = json.loads(json.dumps(market))
        expected["metadata"]["version"] = metadata["version"]
        for plugin in expected["plugins"]:
            if plugin["name"] == "starter-kit":
                plugin.update({"version": metadata["version"], "description": metadata["description"], "keywords": ["council", "review", "handoff"]})
        if args.check and expected != market:
            raise ValueError("Claude marketplace metadata is stale")
        if not args.check:
            put(market_path, expected)
        if args.package_dir:
            output = args.package_dir.resolve()
            for folder in (SOURCE, ROOT / "plugins", ROOT / "codex-starter"):
                if output == folder or folder in output.parents:
                    raise ValueError("Archives must be outside source and installable package folders")
            output.mkdir(parents=True, exist_ok=True)
            hashes = {}
            archive_stages = list(stages.values())
            if args.standalone_skill:
                stage = Path(temp) / args.standalone_skill
                shutil.copytree(SOURCE / "skills" / args.standalone_skill, stage)
                shutil.copy2(SOURCE / "ANIKET-PILOT.md", stage / "README.md")
                shutil.copy2(ROOT / "LICENSE", stage / "LICENSE")
                put(stage / "PACKAGE.json", {"name": args.standalone_skill,
                    "version": metadata["version"], "status": "team-pilot",
                    "source": "https://github.com/chrisblattman/claudeblattman/tree/aniket-me-pilot/starter-kit-source/skills/aniket-me",
                    "source_status": "Public pilot candidate; not a stable release.",
                    "files": {rel: hashlib.sha256(content).hexdigest()
                              for rel, content in sorted(tree(stage).items())}})
                archive_stages = [stage]
            for stage in archive_stages:
                archive = output / f"{stage.name}-{metadata['version']}.zip"
                with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as zipped:
                    for rel, content in sorted(tree(stage).items()):
                        entry = zipfile.ZipInfo(f"{stage.name}/{rel}", date_time=(2026, 10, 22, 0, 0, 0))
                        entry.compress_type = zipfile.ZIP_DEFLATED
                        entry.external_attr = 0o100644 << 16
                        zipped.writestr(entry, content)
                hashes[archive.name] = hashlib.sha256(archive.read_bytes()).hexdigest()
            put(output / "SHA256.json", hashes)
            print(f"Local archives: {output}")
    print("Both plugins and manual Codex skills " + ("match their source." if args.check else "generated from starter-kit-source/."))


if __name__ == "__main__":
    main()
