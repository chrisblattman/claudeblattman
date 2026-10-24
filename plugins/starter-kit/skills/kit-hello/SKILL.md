---
name: kit-hello
description: Verify the starter kit's installed skill files and version, and explain the next step. Use when the user runs kit-hello or asks whether installation worked.
---

# Check the installation

Read `references/package.json` and `references/host.md` next to this skill. Inspect the neighboring skill folders listed in `references/package.json`; each must contain `SKILL.md`. Check Council's `scripts/council.py`, policy, synthesis reference, and three default persona files plus the optional Chief of Staff persona. Do not modify files or call external services.

Report the actual packaged version and any missing files. Distinguish files found from a tested runtime: this check does not prove subagent dispatch or external authentication. If intact, invite the user to open a practice project and try `/council` on a small real task. Explain that the default is three local members and `/kit-setup` checks optional outside connections. Do not advertise Light/Full as operational while the Council runtime status says otherwise. Never hardcode a version or claim a missing skill is installed.
