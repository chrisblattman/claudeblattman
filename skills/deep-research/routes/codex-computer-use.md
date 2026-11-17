# Codex computer use

Operates the user's own browser through Codex's native computer control: a visible cursor, screenshots and keyboard. Offer it as an explicit fallback when Chrome setup is blocked or declined and the current host supports computer use. Do not infer availability from the OS or app name. Follow Codex's own computer-use instructions and permission prompts (Screen Recording and Accessibility on macOS).

- It takes over the foreground and can't run while the computer is locked. Keep each step short and recheck the screen after it.
- Open a new window or tab for each new job. On resume, reconnect to the recorded existing task without starting over. Record which tabs this run created; don't close other user tabs. Find controls by their visible labels.
- Paste the brief in one step (for example, via the clipboard and the paste shortcut) instead of typing it key by key. Read back the composer before Send. Apply the [submission guard](../references/browser-routes.md#submission-guard-autonomous).
- Gemini Doc deletion follows the [Codex adapter](../adapters/codex.md): retain the Docs.
- Product steps follow [browser procedures](../references/browser-procedures.md).

Not yet verified by the maintainers: clicking and typing in Safari and Chrome, end-to-end submission and export.
