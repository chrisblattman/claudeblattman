# Claude in Chrome (Claude Code)

Drives the user's signed-in Chrome (or another supported Chromium browser) through the Claude in Chrome extension, with real clicks, typing and screenshots. Availability checks are in [adapters/claude-code.md](../adapters/claude-code.md). Setup docs: <https://code.claude.com/docs/en/chrome>.

## Working rules

- **Own the tabs.** Start with the tab-context tool and create the extension's tab group if empty. Work only in tabs this run opened, and close only those, after capture and filing are verified.
- **Read before acting.** Use the page-reading and find tools to locate controls by their visible label. Use screenshots to confirm state the DOM doesn't show clearly (menus, chips, the research panel).
- **Type with click + type, not form fill.** ChatGPT and Gemini composers are `contenteditable` editors. A form-fill tool can silently do nothing on them. Click the composer, then type or paste the brief, then read it back.
- **Logins and CAPTCHAs** pause the extension. They are user steps: name the product and the tab.
- **ChatGPT's finished report** renders in a cross-origin panel. Use the report's own Export control in the host page; don't try to read the report text from the DOM.
- Product steps (Deep Research mode, plan approval, export, Gemini Doc handling) follow [browser procedures](../references/browser-procedures.md). Apply the [submission guard](../references/browser-routes.md#submission-guard-autonomous) before Send.

## Not yet verified by the maintainers

An end-to-end run of this route from the current skill: submission, Markdown export and Gemini Docs export. An earlier private version of this workflow used it for ChatGPT.
