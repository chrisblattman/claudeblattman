# Codex Chrome extension (Codex app)

Drives the user's signed-in Chromium browser through Codex's Chrome extension and bundled Chrome plugin. Follow that plugin's own instructions for connecting, tab handling, troubleshooting and confirmations. This file adds only what Deep Research needs.

- Check the connection with the plugin's own discovery or status step. If the extension is missing or disconnected, follow its troubleshooting. If it still fails, report the blocker and offer a supported alternative; do not silently switch or substitute AppleScript or shell automation.
- Work in tabs this run opened, or reconnect to its recorded existing research task on resume. Close only tabs whose creation by this run is verified. Locate controls by visible label. Confirm composer content and Deep Research mode before Send. Apply the [submission guard](../references/browser-routes.md#submission-guard-autonomous).
- **Cleanup:** this workflow leaves Gemini's temporary Google Docs in place; follow actual host permissions for all actions ([adapters/codex.md](../adapters/codex.md)).
- Product steps follow [browser procedures](../references/browser-procedures.md).

Not yet verified by the maintainers: an end-to-end run of this route on both products.
