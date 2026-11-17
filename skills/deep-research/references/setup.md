# Install and setup

Setup prepares browser access without launching research or spending Deep Research allowance. **Chrome is the normal path.** The user can keep another browser for everyday work and use Chrome just for research.

Run setup in the same session as installation or an update, on `/deep-research setup`, or before research when saved settings are missing or incompatible. A setup-only request ends with a readiness report, never a research job. On a compatible update, check the saved configuration and changed requirements; do not repeat sign-ins or text-entry tests that remain valid. After installation, tell the user to open a new session in their project so the host can load the installed skill.

## Install or update the whole folder

Install `SKILL.md` and all of `references/`, `adapters/`, `routes/` and `scripts/` in the host's supported skills location. Discover that location from the installed host instructions rather than assuming a particular app's path works everywhere.

Before an update, inspect the existing copy. Preserve `local/`, personal preferences, added files and edits to distributed files. Back up the existing copy outside the replacement folder, compare it with the incoming version, and merge nonconflicting changes. If a customization conflicts with new behavior, show the specific conflict and ask which behavior to keep. Do not replace the entire customized folder blindly. Preserve existing research archives and pending job identities; updating this skill never authorizes restarting research.

Check for duplicate installed copies or another skill called deep-research, including Anthropic's agent-research skill. Confirm the selected entry file is this browser workflow and report its installed location. Do not delete or overwrite an unrelated same-name skill to fix a collision. Read the installed files directly if the host has not loaded the new skill yet. The optional Mac helper is invoked as `zsh <skill folder>/scripts/browser-js.sh …`; it is not required for Chrome setup.

## 1. Discover capabilities

Read the host adapter: [Claude](../adapters/claude-code.md) or [Codex](../adapters/codex.md). Discover callable browser tools and their instructions, including deferred tools, before declaring a connection missing. Use a harmless supported status check. Do not install an extension, change permissions or trigger Apple Events permission prompts as a silent probe.

Select products using the request and saved preferences; the default is ChatGPT and Gemini. **“Only Gemini” setup checks only Gemini**, and records ChatGPT as not selected rather than requiring another login. Check that the host can save and reopen files in the project and retrieve native downloads. For Gemini, a supported browser export of a Google Doc is sufficient; a separate Drive connector is optional. Check fresh synthesis capability for multiple reports before research starts. Distinguish available tools from an export tested end to end.

If an essential capture capability is known to be absent, report it before consuming allowance. If fresh synthesis is unavailable, disclose that before launch and resolve whether the user wants reports only, unless their request already permits that outcome.

## 2. One checklist

Group only missing steps into one message:

1. Connect the host's Chrome extension using its current setup instructions. For Claude, use the [Claude in Chrome guide](https://code.claude.com/docs/en/chrome); for Codex, follow the installed browser tool's instructions. Do not invent menu paths or launcher flags for a different host.
2. Sign in to the selected ChatGPT and/or Gemini products in that browser. A working Codex or Antigravity connection does not establish product access.
3. Complete any necessary browser or download permission prompt yourself.

Record a blocked or declined extension setup, and do not repeatedly offer it. If Chrome is unavailable or the user chooses another route, explain the supported alternative and its requirements before using it: [Apple Events on Claude/macOS](../routes/apple-events-macos.md), [Codex computer use](../routes/codex-computer-use.md), or [handoff](../routes/manual-handoff.md). Never silently enable a fallback or bypass host restrictions. Reuse an explicitly chosen working fallback on later runs.

Apple Events access is broader than this research run: the helper does **not** enforce window ownership. Do not describe a persistent shell permission as restricting access to research windows or add a broad allow rule as part of ordinary setup. Follow the host's existing permission controls and the fallback's ownership checks.

After the user completes the checklist, check only the remaining blockers. Preserve a decline until they ask to reconsider it.

## 3. Verify without spending

For each selected product:

1. Open a new tab owned by setup. Confirm the intended signed-in account and visible Deep Research access. Find or create the **Deep Research** ChatGPT Project or Gemini Notebook where supported. Record filing separately from research readiness; a missing container is not the same as missing research access.
2. In a new, empty composer, turn on Deep Research and verify visible activation. **Never overwrite or clear an existing user draft.** If the composer contains text, use another fresh chat or report the blocker.
3. Enter `test`, confirm it registers, then remove only that test text. Confirm the composer is empty. Never press Send or approve a research plan during setup. Restore the mode state you changed where possible.
4. Close only tabs setup created and whose identity is still verified. Leave existing tabs, ambiguous windows and anything needed for recovery open.

## 4. Save and report

Save per-product readiness, partial progress, extension declines and precise blockers in `local/settings.json` using [the settings schema](browser-routes.md#saved-settings-check-first). Preserve unknown fields when migrating an older file. Do not label an untested product ready or overwrite a working unselected product's settings.

Return a short table: selected product, browser route, mode/text-entry check, container filing, capture capability and remaining user step. Identify checks as passed, blocked or not tested. Setup verifies access and entry, **not completed research or export**. A research request may continue with verified selected products under the selection rules; a setup-only request stops here.
