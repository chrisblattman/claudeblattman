# Claude Blattman

**A professor's guide to building AI workflows — from chatbots to self-improving systems.**

Website: [claudeblattman.com](https://claudeblattman.com)

---

## What This Is

A free, open-source resource for non-developers who want to build real AI workflows. Three paths:

1. **The Essentials** — Tools and foundations. Chatbots done right, dictation, transcription, prompt engineering.
2. **The Toolkit** — Claude Code setup, configuration, and downloadable skills. From "what is this?" to a working system.
3. **Build Your Own** — Creating custom skills, agents, and self-improving workflows.

## Who It's For

- Academics and researchers managing multiple projects
- Professionals buried in email, meetings, and coordination
- Anyone who wants to move beyond casual chatbot use

No coding background required. Everything is built with markdown and AI tools.

## Quick Start

The **Starter Kit 0.3.0 review candidate** contains six shared skills for Claude Code and Codex: council, adversarial-review, kit-hello, kit-setup, ask-agents, and done. Both packages are generated from one source.

Council develops with three local personas; Adversarial Review uses four fresh reviewers. Each has a fresh synthesis worker. Optional named providers include Claude, Codex, Gemini through Antigravity, and subscription-authenticated Grok Build. Local personas remain the default. Saved panel preferences survive package updates.

See the [package guide](starter-kit-source/PACKAGE-README.md) for installation, prerequisites, connections, migration and current validation limits. Plugin installation is the supported path for both apps. The candidate still needs live acceptance testing; repository marketplace commands install the released branch, not necessarily this candidate.

The older `skills/` folder is an advanced reference library. Overlapping council/review/done entries point to the bundled workflows rather than maintaining conflicting implementations. Website walkthrough edits are handled separately from this package branch.

## Repo Structure

```
claudeblattman/
├── docs/               # Website source (MkDocs Material)
├── plugins/starter-kit-claude/ # Claude plugin for the desktop-agent starter kit
├── plugins/starter-kit-codex/  # Codex plugin from the same shared source
├── skills/             # Downloadable skill files
├── agents/             # Downloadable agent files
├── templates/          # Starter templates (CLAUDE.md, goals.yaml)
├── mkdocs.yml          # Site configuration
├── CONTRIBUTING.md     # Maintenance guide
└── LICENSE             # MIT
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to edit content, add skills, and maintain the site.

## Release Notes

The starter kit is versioned separately from the broader docs. Each public
starter-kit release should have a matching tag such as `starter-kit-v0.1.0` and
a current `public-manifest.json`. If a plugin release needs rollback, install
from the last known-good tag and avoid changing the marketplace/plugin names.

## License

MIT — use anything here however you want.

---

Built by [Chris Blattman](https://chrisblattman.com). The name is a joke. The tools are real.
