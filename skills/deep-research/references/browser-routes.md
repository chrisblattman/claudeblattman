# Browser routes

A **route** is how the agent operates the user's signed-in browser: an extension, native computer control, Apple Events JavaScript, or a handoff. Choose it per product (ChatGPT, Gemini) from what works on this computer, not from the plan name or the default browser alone. [Setup](setup.md) chooses it once at install time and saves it locally; runs reuse it without re-testing.

Host route order lives in [adapters/claude-code.md](../adapters/claude-code.md) and [adapters/codex.md](../adapters/codex.md). Route recipes live in [routes/](../routes/). Product steps (Deep Research mode, plans, export) stay in [browser procedures](browser-procedures.md).

## Saved settings (check first)

Read `local/settings.json` in this skill's installed folder. If it exists, matches the current host, and its route still works for the product, use it without re-probing. If it is missing, run [setup](setup.md) first, then continue the run.

```json
{
  "version": 1,
  "host": "claude-code-cli | claude-desktop | claude-vscode | codex-app | codex-cli",
  "os": "macos | windows | linux",
  "verified": "YYYY-MM-DD",
  "claude_in_chrome": "available | not-set-up | blocked-by-org | unsupported-auth | declined | n/a",
  "apple_events": { "Safari": "enabled | off | unknown", "Google Chrome": "enabled | off | unknown" },
  "chatgpt": { "route": "<route>", "browser": "<app name>", "project_url": "<Deep Research project URL>", "account_seen": "<as displayed>" },
  "gemini": { "route": "<route>", "browser": "<app name>", "notebook_url": "<Deep Research notebook URL>", "account_seen": "<as displayed>" },
  "notes": []
}
```

- Write it only after a route has passed a live check: the product page shows the signed-in account and the Deep Research container, and the mode check in [setup](setup.md#3-verify-without-spending) passed.
- Re-probe only when a saved route fails (tool missing, page signed out, container gone, account differs from `account_seen`), when the host or OS changed, or when the user asks to "recheck setup". Update the file afterward.
- The file stays on this computer. It is not part of the published skill. Preserve `local/` when updating the skill folder.
- Never store passwords, cookies, tokens or one-time codes. A displayed account name/email is enough to notice a switched account.

## Detect what works

Used by setup and by any re-probe. Check automatically; anything that needs the user goes into [setup's single checklist](setup.md#2-one-checklist).

1. **Host and OS.** Identify Claude Code (CLI, desktop, VS Code) or Codex (app, CLI) and the operating system.
2. **Callable tools.** Search deferred or lazily loaded tools before concluding a route is absent (for example, query "chrome", "browser", "tabs", "computer"). A tool missing from the first listing is not proof that it is unavailable. Probe with one harmless call (list tabs or contexts) and retry once.
3. **Route-specific checks.** Run the checks in each adapter's route order. Record the precise state: not discovered, not installed, not connected, blocked by organization, unsupported sign-in, permission-blocked, or working.
4. **Which browser is signed in.** Starting with the default browser and stopping at the first one signed in to both products, open a new tab or window the agent owns at `https://chatgpt.com/` and `https://gemini.google.com/app` and read the page:
   - ChatGPT is signed in when the sidebar/profile controls appear and the page did not redirect to `/auth/login`.
   - Gemini is signed in when a "Google Account: …" control is present and no "Sign in" prompt appears.
   Prefer the browser signed in to both. The default browser is checked first, so it wins ties (macOS: an empty `https` handler in `defaults read com.apple.LaunchServices/com.apple.launchservices.secure LSHandlers` means Safari; Windows: `HKCU\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\https\UserChoice`). If no browser is signed in, sign-in is a user step; name the browser and product.
5. **Containers.** Find the "Deep Research" ChatGPT project and Gemini notebook and save their URLs.

## Submission guard (autonomous)

This guard needs no user interaction. It prevents a second paid job after an interruption, tool error or browser switch.

1. Before clicking Send, write `submitting` with the time, route, browser and product to `RUN.md`.
2. After Send, record the chat URL and the product's visible research state, then `running` or `awaiting-input`.
3. If the click's outcome is unknown, set `submission-unknown`. Open the product's Deep Research container and look for a chat created after the `submitting` time with this brief's opening words. Found means it was submitted: record it and continue. Not found, and the composer still holds the brief unsent, means it is safe to send once more on the **same** route.
4. Never resubmit from a different browser or route while any submission for that product is `submitting` or `submission-unknown`. Resolve it in the same container first.

## Rejected or untested routes

- **Safari MCP (`safaridriver --mcp`, Safari 27):** rejected for this skill. Tested 2026-11-06 on Safari 27.2. It launches a separate automation Safari with no logins (ChatGPT redirected to login; Gemini showed Sign in), and while it runs, AppleScript to Safari targets the automation instance. Useful for developing your own sites, not for signed-in Deep Research.
- **WebDriver / safaridriver / Playwright with a fresh profile:** no logins. Google may refuse sign-in in automation-controlled browsers. Not used.
- **Claude desktop Browser pane:** clean profile without the user's logins. Not used.
- **Claude computer use:** browsers are view-only, and it is not available on Team or Enterprise plans. Not used.
- **Untested candidate:** `chrome-devtools-mcp --autoConnect` attaching to the user's running Chrome after they enable remote debugging at `chrome://inspect/#remote-debugging` (Chrome 144+). This might serve users whose organization disables Claude in Chrome, on macOS and Windows. Do not use it until it passes the acceptance checks.
- **Windows and Linux:** only the extension routes (Claude in Chrome, Codex Chrome), Codex computer use, or the handoff. These are untested by the maintainers.
