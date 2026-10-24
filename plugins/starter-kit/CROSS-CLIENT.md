# One source, two client packages

Edit `starter-kit-source/skills/<name>/SKILL.md` once. The entire skill behavior is canonical there; neither client has a separately authored copy. Supporting templates and Council's archive helper live with the source skill. Personas are canonical in `starter-kit-source/agents/`. The builder copies those same bytes into both packages.

Only host mechanics differ: `starter-kit-source/adapters/claude/` and `adapters/codex/` describe native worker launch, executable discovery, and the existing external runners. Shared behavior does not belong in these adapters. `package.json` owns the inventory and version.

```sh
python3 scripts/build-starter-plugins.py
python3 scripts/build-starter-plugins.py --check
python3 scripts/test-starter-packages.py
python3 scripts/build-starter-plugins.py --package-dir working-notes/package-unification-oct22/packages
python3 scripts/build-starter-plugins.py --check --standalone-skill aniket-me --package-dir working-notes/aniket-pilot/packages
```

The build regenerates `plugins/starter-kit/`, `plugins/starter-kit-codex/`, and `codex-starter/skills/` together. `scripts/build-codex-plugin.py` remains a compatibility alias for the same build. CI checks freshness, common instruction parity, retired-skill exclusion, and archive/installation behavior. Building never uploads, publishes, or changes an installed plugin. Readers receive updates through each host's normal plugin update process after a separate release.

The manual Codex installer has an explicit `--target-root` for disposable installation tests. Plugin installation does not overwrite global AGENTS.md. Generated archives contain one plugin each; market catalogs are separate.

The optional standalone Aniket Me archive copies the same authoritative skill and source notes, plus `ANIKET-PILOT.md`, the license and a file-hash manifest. It includes no other skills or installer. Only this self-contained skill supports standalone export. Other starter skills require their host adapters and supporting resources. Keep pilot feedback in private planning, outside public source and archives.

## Audit boundary

This is a portable adaptation of the inspected council behavior, not a redistribution of Chris's private machine-specific execution system. `skills/council/references/runtime-status.md` identifies the missing balanced runtime. The starter uses local custom councils by explicit user decision. Do not label them Light, Full, provider-balanced, or provenance-certified. Light/Full counts and policies remain reference data until the compatible runtime and live acceptance tests are available.
