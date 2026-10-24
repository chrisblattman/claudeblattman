# Starter Kit 0.3.0-dev.0 — pilot candidate

Six skills: `/council`, `/kit-hello`, `/kit-setup`, `/ask-agents`, `/done`, and `/aniket-me`.

This is a pilot candidate on the `aniket-me-pilot` branch. The marketplace commands below install the default branch's stable version. To try only Aniket Me, give your agent the [pilot guide](https://github.com/chrisblattman/claudeblattman/blob/aniket-me-pilot/starter-kit-source/ANIKET-PILOT.md).

Start a request with “Aniket me” for advice on improving how you work with AI, or name a particular workflow or question. Aniket Me uses bundled, dated public-source notes and relevant originals. It recognizes practices already working and does not require an existing skill library. It is an independent adaptation, not an endorsement by Aniket Panjwani.

Council starts three independent local members—pre-mortem, skeptic, and completeness checker—and a fresh synthesis worker. Chief of Staff is an optional fourth member, added only when you ask. Their definitions are bundled in both packages. An explicitly requested challenge runs after the member reports, before synthesis. Further review starts a fresh run; it does not create an automatic debate loop.

The same source produces Claude and Codex skills. App-specific files only describe native worker dispatch and existing external transports. Start with `/kit-hello`, then try `/council` in a practice project. Python 3 is required for durable council archives. Optional Codex-host outside opinions use Node 18+ and authenticated provider CLIs.

Chris's balanced Light/Full policy is preserved, but its audited external runtime is not bundled. Requests for those modes stop with an explanation; they never silently fall back to another provider. The current Ask Agents runners are suitable for their documented outside-opinion workflow, not a substitute for that runtime.

`/prompt` and `/review-plan` are no longer included. Council prepares its own neutral brief. Previous manual installs may retain user-owned copies; the installer reports them without deleting them.

See `CROSS-CLIENT.md` for the source and build process. Do not edit generated package files.

To include the optional member, ask: `Use a council with Chief of Staff to review this proposal.` A plain `/council` keeps the three default members. See the [repository installation instructions](https://github.com/chrisblattman/claudeblattman#quick-start) for both apps.

Install in Claude Code:

```text
/plugin marketplace add chrisblattman/claudeblattman
/plugin install starter-kit@claudeblattman
```

Install for Codex from your terminal:

```sh
codex plugin marketplace add chrisblattman/claudeblattman
codex plugin add starter-kit-codex@claudeblattman
```

Restart your app/session and select kit-hello from the skill picker. Native subagent support is required for councils.
