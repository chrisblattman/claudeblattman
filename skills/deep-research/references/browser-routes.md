# Browser routes

A route is the tool used to operate the signed-in browser. **Start with the host's Chrome extension.** [Setup](setup.md) saves a working choice for each selected product. The user may explicitly choose a supported fallback when Chrome is blocked or unavailable. A saved, deliberately chosen fallback can be reused; do not silently choose one just because it was the default in an older skill version.

Read the [Claude adapter](../adapters/claude-code.md) or [Codex adapter](../adapters/codex.md), the selected recipe in [routes](../routes/), and [browser procedures](browser-procedures.md). Host tool instructions take precedence over route hints.

## Saved settings (check first)

Use `local/settings.json` in the installed skill folder. Version 2 separates access, filing and export capability. This is an example of a partially configured installation, not a result to copy as verified:

```json
{
  "version": 2,
  "host": "codex-app",
  "os": "macos",
  "checked_at": "YYYY-MM-DD",
  "chrome": {"status": "available"},
  "chatgpt": {
    "status": "ready",
    "route": "codex-chrome",
    "browser": "Google Chrome",
    "account_seen": "<as displayed>",
    "mode_checked": true,
    "text_entry_checked": true,
    "filing": {"status": "verified", "container_url": "<project URL>"},
    "capture": {"status": "tools-available", "live_export_verified": false}
  },
  "gemini": {"status": "not-selected"},
  "notes": []
}
```

- Product statuses include `ready`, `blocked`, `not-selected` and `not-tested`. Record the exact blocker and last successful step. Extension statuses include `available`, `not-connected`, `blocked-by-org`, `unsupported-auth` and `declined`. Persist partial setup and declines, not just successful checks.
- `filing.status` is independently `verified`, `pending` or `blocked`; `container_url` can be null. Research can be ready while filing is blocked. Capture records distinguish tools available, blocked, and a genuinely tested full export.
- A fallback records `fallback_reason` and `user_selected: true`. Never infer consent from a failed extension probe. Reuse compatible, working saved choices; recheck changed account/host, failed tools, missing mode or a user request. Ordinary runs need no repeated setup checklist.
- On a version-1 upgrade, back up the settings, preserve known choices and unknown fields, and perform a bounded migration in the install session. Explain Chrome as the new normal path if the old route was merely auto-selected. Preserve explicit declines and fallback preferences. Do not interrupt or change the route of pending research jobs to migrate setup; those resume from their own `RUN.md`.
- If a future/unknown schema cannot be interpreted safely, retain it and report the migration blocker. Do not erase it and guess. `local/` is private and excluded from the public package. Never store passwords, cookies, tokens or one-time codes.

## Detect what works

Identify the host and OS, discover its supported browser tools (including deferred tools), read their instructions and check the connection once. A tool name alone does not prove a working extension. Inspect only selected products in new research tabs. An ambiguous account needs the user's choice before submission.

Chrome setup must be offered before attempting an alternative. If it is declined or blocked, use the adapter's supported fallback only after its requirements are understood and chosen. Do not activate remote debugging, change security settings, or substitute shell automation against host restrictions. A fresh automation profile without the user's sign-in is not a working research connection.

## Submission guard (autonomous)

1. Before Send, write `submitting` to `RUN.md`: product, time, route, browser, owned tab/window identity, current URL and exact brief identity.
2. After Send, save the durable conversation/task URL immediately and record the visible product state: `awaiting-input` or `running` only when observed.
3. An interruption at `submitting` becomes `submission-unknown`. Inspect the original tab/task first, then the selected product's recent chats and Deep Research container if available. Match the brief and submission time, not merely the title. A job started outside the container may not be filed there yet.
4. Absence from the container, an unsent-looking composer, a timeout or a missing URL **does not prove submission failed**. If uncertainty remains, preserve it and request the smallest recovery step; do not resend. A retry is allowed only when non-submission is positively established (for example a confirmed pre-send tool failure and no Send action) or the user explicitly authorizes a new job after being told of the duplicate risk.
5. Never switch browser/route to resend an unresolved submission. A supported alternative may inspect and recover the **same** identified task, with the route change recorded. It must not create another job.

## Historical limitations

The 2026-11-06 tests found that Safari MCP opened a separate logged-out browser and interfered with Apple Events targeting. It is not an enabled route. Fresh WebDriver profiles likewise do not inherit sign-ins. Do not assume a built-in browser pane has the required accounts: verify supported access rather than transferring cookies or private credentials.

Remote-debugging adapters are not packaged or validated here. Follow the supported host routes instead. See [acceptance](acceptance.md) for the dated route matrix; the instructions do not certify every browser or account.
