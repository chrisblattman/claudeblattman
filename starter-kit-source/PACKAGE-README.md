# Starter Kit 0.3.0

One shared kit for Claude Code and Codex, with six skills:

| Skill | Purpose |
|---|---|
| `/council` | Develop independent approaches with three local personas and fresh synthesis |
| `/adversarial-review` | Review existing work with four fresh local reviewers and fresh synthesis |
| `/ask-agents` | Ask named connected providers and retrieve their full responses |
| `/kit-setup` | Discover and test optional provider connections |
| `/kit-hello` | Check installation files, prerequisites and next steps |
| `/done` | Preserve decisions and unfinished work for the next session |

Both plugins read their four personas from one `shared/personas/` folder per installation. The bundled personas are skeptic, pre-mortem, completeness checker, and Chief of Staff. Chief of Staff is optional in development and included in the four-reviewer default. Each panel gets a separate fresh synthesis worker. Another review is always a new user-requested run, never an automatic debate loop.

Start with Kit Hello, then `Use a council to develop a plan for this project.` After revising the result, ask `Run an adversarial review of this plan.` Native fresh-worker support and Python 3.9+ are required. External connections are optional and require Node 18+ and a provider CLI/login. Grok additionally requires Python 3.11+ for configuration checks.

Ask Agents supports Claude Code, Codex, Gemini through Antigravity, and official subscription-authenticated Grok Build. A manually connected CLI works without Kit Setup; missing connections return an error. Grok currently uses a reviewed macOS release pin, not a browser or an API fallback. Its requests use the subscription allowance; paid extra usage depends on the account's existing settings. The kit does not change billing. See Ask Agents' transport reference for platform/version limits.

To change both panel defaults, ask for the exact providers you want. Preferences live in `~/.config/starter-kit/settings.json`, outside the installed package. Resetting them restores local personas. Light means one each of Claude, Codex and Gemini; Full means two each plus a challenge. Custom panels can include Grok. The host orchestrates native and external workers, and uses fresh native workers for chairs. These are portable panels, not claims of private runtime certification. Only Claude and Codex are supported hosts; a provider connection is not a host adapter.

**Validation:** this is the 0.3.0 review candidate. Offline tests cover packaging, archives, preference persistence and failure handling. Live installation, native-worker panels and authenticated provider calls still need acceptance testing before public release. Building does not install or publish the kit.

## Install after release approval

Claude Code conversation:

```text
/plugin marketplace add chrisblattman/claudeblattman
/plugin install starter-kit@claudeblattman
```

Codex terminal:

```sh
codex plugin marketplace add chrisblattman/claudeblattman
codex plugin add starter-kit-codex@claudeblattman
```

Until this candidate is merged/released, those commands may install the prior version. Restart the host and use Kit Hello to check the actual version. Plugin installation is the supported path for both apps. No separate manual installer is included.

**Migration:** `/prompt` and `/review-plan` are not bundled. Council prepares its brief; existing-work review uses `/adversarial-review`. Remove or rename a conflicting legacy command only with the user's direction. Old `engines.json` availability flags are no longer required. This release does not delete existing user-owned skill copies or preference files. If an older manual install exists, review its duplicate skills explicitly rather than deleting them automatically. 0.2 archives remain historical records; use their original helper for later inspection.

See `CROSS-CLIENT.md` for the source/build contract. Do not edit generated package files.
