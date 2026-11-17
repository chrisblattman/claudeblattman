# Codex adapter

Use with [browser routes](../references/browser-routes.md) and [setup](../references/setup.md).

1. Reuse a compatible saved Chrome route, or a working fallback the user deliberately chose. Preserve pending jobs when migrating older settings.
2. For new setup, use [Codex Chrome](../routes/codex-chrome.md). Discover the installed browser tools and follow their connection and troubleshooting instructions. The [official browser walkthrough](https://developers.openai.com/training/walkthroughs/using-your-computer-and-browser) describes the extension path; actual session tools determine availability.
3. If Chrome is blocked or declined, offer [computer use](../routes/codex-computer-use.md) only if this host supports it and its instructions allow that fallback. Do not silently switch routes or use AppleScript, shell automation or another prohibited substitute.
4. If no selected supported route works, use [handoff](../routes/manual-handoff.md).

A product sign-in must be verified on the selected route; neither Codex authentication nor a fresh browser profile establishes ChatGPT or Gemini access.

**This workflow retains Gemini's temporary Google Docs under Codex.** Record each as `retained (Codex workflow)` in `RUN.md`, deliver the verified local export, and tell the user they can delete the temporary Doc separately. This is the workflow's cleanup choice, not a claim about a universal Codex confirmation rule. Follow the current host's permissions for all browser actions.
