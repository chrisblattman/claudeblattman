---
name: kit-hello
description: Check the installed starter kit, prerequisites, and next step without calling external models.
---

# Check the installation

Read `references/package.json` and `references/host.md`. Inspect every skill named in the actual package inventory: council, adversarial-review, kit-hello, kit-setup, ask-agents, done. Both panel skills must include `scripts/council.py`, their policy, synthesis and execution references. Check the four persona files in the single plugin-level `shared/personas/` folder (resolve `../../shared/personas/` from this installed skill). Both panel skills must use that folder. Ask Agents must include both shared transport scripts. Report missing files rather than claiming success.

Check Python 3.9+ for panel archives and whether this host exposes native fresh workers. Report file integrity, prerequisites and runtime verification separately; do not launch workers or outside services as part of Hello. Node 18+ is needed only for external connections; Grok additionally needs Python 3.11+ for its route validation. Show saved panel preferences through the helper without changing them.

Explain: Council develops with three local personas by default; Adversarial Review uses four fresh reviewers; each gets a fresh synthesis. Optional saved provider panels apply to both. Start a small real task with Council, then review its revised result with Adversarial Review. Offer Kit Setup only for wanted external connections. Skill discovery/installation does not establish live provider or native-worker success. State the actual package version and supported host, never a hardcoded release number.
