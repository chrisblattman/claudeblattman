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

## Aniket Me pilot

The 0.3.0-dev.0 pilot adds Aniket Me to the five released skills. It offers advice on how to work with AI using dated public sources, without requiring the maintainer's private files. Give Claude Code or Codex the [Aniket Me pilot guide](starter-kit-source/ANIKET-PILOT.md) and ask it to install the skill for your project. Then start a request with “Aniket me”. The pilot is open for testing. The commands below describe the stable 0.2.0 kit on the default branch.

## Quick Start

The **Starter Kit 0.2.0** provides the same five skills in Claude Code and Codex: council, kit-hello, kit-setup, ask-agents, and done. Choose the plugin for your app. Both are generated from one shared source.

**Claude Code:** run these in the Claude Code conversation:

```text
/plugin marketplace add chrisblattman/claudeblattman
/plugin install starter-kit@claudeblattman
```

**Codex:** with the Codex CLI installed, run these in your terminal:

```sh
codex plugin marketplace add chrisblattman/claudeblattman
codex plugin add starter-kit-codex@claudeblattman
```

These commands add this repository as a plugin marketplace. They do not require finding the kit in a public plugin directory. Restart your app/session after installation, then select `kit-hello` from its skill picker to check the files. If your client does not support plugin installation, the [manual Codex installer](codex-starter/README.md) is also available.

Council requires Python 3 and an agent client with native subagent support. The default is **three independent local members: pre-mortem, skeptic, and completeness checker**, followed by a separate fresh synthesis worker. Chief of Staff is bundled but added only on request as a fourth member.

Try `Use a council to review this proposal.` To include the optional member: `Use a council with Chief of Staff to review this proposal.` You can also select the council skill from your app's skill picker (Claude Code's plugin command is `/starter-kit:council`). Ask for another council to review the resulting work in a new run. An explicitly requested adversarial review adds a separate local reviewer before synthesis.

Chris's cross-provider **Light/Full** runtime is not included. The optional Ask Agents skill obtains outside opinions; it does not enable those council modes.

**Upgrading:** this release replaces the bundled `/prompt` and `/review-plan` skills with the council workflow. The manual installer preserves existing user-owned copies. The website guides are being revised separately; this package README describes the skills available in 0.2.0.

The older `skills/` library remains available as advanced/reference material,
but it is not the recommended first-run path.

## Repo Structure

```
claudeblattman/
├── docs/               # Website source (MkDocs Material)
├── plugins/starter-kit/ # Claude plugin for the desktop-agent starter kit
├── codex-starter/      # Codex starter pack installer + skills
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
