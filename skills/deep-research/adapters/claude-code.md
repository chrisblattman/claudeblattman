# Claude Code adapter

Use with [browser routes](../references/browser-routes.md). Try routes in this order and use the first that works for each product:

1. **Saved route** from `local/settings.json`, if it still works.
2. **[Claude in Chrome](../routes/claude-in-chrome.md)**, in any supported Chromium browser where the products are signed in.
3. **[Apple Events JavaScript](../routes/apple-events-macos.md)**, on macOS only, in Safari or Chrome once the user has enabled it.
4. **[Handoff](../routes/handoff.md)**.

## Claude in Chrome availability

Check these signals in order. Stop at the first one that settles the question.

1. **Tools callable.** Search tools for "chrome" or "tabs_context". If `claude-in-chrome` tools load, call the tab-context tool once. A working result means `available`. "Browser extension is not connected" or "No browsers are connected" means not connected: suggest `/chrome` → Reconnect, and restarting Chrome after the first setup.
2. **Sign-in route.** API-key, `setup-token`, Bedrock, Vertex or Foundry sign-in keeps it off even with `--chrome`. Record `unsupported-auth`.
3. **Managed policy.** Read, without changing anything, `/Library/Application Support/ClaudeCode/managed-settings.json`, `managed-mcp.json` and the `com.anthropic.claudecode` managed preferences on macOS. On Windows, read `C:\Program Files\ClaudeCode\` and `HKLM`/`HKCU\SOFTWARE\Policies\ClaudeCode`. A `deniedMcpServers` entry matching `claude-in-chrome`, or an allowlist that excludes it, means `blocked-by-org`.
4. **Never set up.** No `com.anthropic.claude_code_browser_extension.json` in the browser's `NativeMessagingHosts` folder means `claude --chrome` has never run on this computer. Setup offers it in [its checklist](../references/setup.md#2-one-checklist).

An organization owner can also switch Claude in Chrome off in the admin console. That toggle is not readable from the computer. It shows up only after setup, as a disabled extension or a `/chrome` status that never connects. When that happens, record `blocked-by-org` and continue with the next route. Don't send the user through setup again.

## Surfaces

- **CLI and VS Code:** documented. `claude --chrome`, or `/chrome` → "Enabled by default", turns it on.
- **Desktop app (Code tab):** Anthropic's docs say it uses Claude in Chrome once that is set up. The first setup runs from a terminal with `claude --chrome`. Treat it as `not-set-up` until its tools actually load in the desktop session.
- The desktop app's built-in Browser pane and computer use are not routes for this skill. The pane has no logins, and computer use is view-only for browsers.

## Host rules

- Gemini temporary Google Docs may be moved to Trash after verified capture, following [browser procedures](../references/browser-procedures.md).
- Run long waits as background checks. Don't block the conversation while research runs.
