# Claude adapter

Use with [browser routes](../references/browser-routes.md) and [setup](../references/setup.md).

1. Reuse a compatible saved Chrome route, or a working fallback the user deliberately chose. Migrate older automatic selections as described in browser routes; preserve pending jobs.
2. For new setup, use [Claude in Chrome](../routes/claude-in-chrome.md). Discover its tools and read their current connection instructions. Check the tab-context/status tool before calling it available.
3. If missing or disconnected, offer the current [official Chrome setup](https://code.claude.com/docs/en/chrome). Record an organization block, unsupported account or decline and do not keep offering setup.
4. On macOS, [Apple Events](../routes/apple-events-macos.md) is an explicit fallback when allowed by this host. Explain its broader browser access before asking the user to enable it. Do not infer window isolation from the helper's URL check.
5. If no selected supported route works, use [handoff](../routes/manual-handoff.md).

Do not assume that CLI, desktop and editor sessions expose the same tools. Use the current session's capabilities and host instructions; do not invent flags or change organization policies to make a route appear.

Gemini temporary Google Docs may be moved to Trash only after verified complete local capture and verified ownership, following [browser procedures](../references/browser-procedures.md) and applicable host controls. Keep research chats. Run long waits through supported background/continuation tools and keep the user informed.
