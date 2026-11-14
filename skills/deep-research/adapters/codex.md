# Codex adapter

Use with [browser routes](../references/browser-routes.md). Try routes in this order and use the first that works for each product:

1. **Saved route** from `local/settings.json`, if it still works.
2. **[Codex Chrome extension](../routes/codex-chrome.md)**, in the user's signed-in Chromium browser.
3. **[Codex computer use](../routes/codex-computer-use.md)**, in the browser where the products are signed in, including Safari.
4. **[Handoff](../routes/handoff.md)**.

Apple Events JavaScript is **not** a Codex route. Codex's Chrome troubleshooting instructions say not to finish a browser request with AppleScript, shell automation or another scripting substitute when the extension fails.

## Host rules

- **Follow Codex's own browser confirmation policy.** It always asks at the moment of deletion, even when permission was given earlier. So under Codex, **do not trash Gemini's temporary Google Docs.** Record each as `retained (host confirmation rule)` in `RUN.md`, keep the local export, and tell the user the Doc can be deleted manually or by asking for it explicitly. Downloads need no confirmation.
- Codex's in-app browser uses a separate profile without the user's logins, so it is not a route.
- The Codex Chrome extension runs in the Codex app, not the CLI. In the CLI, go to computer use if available, otherwise handoff.
