---
name: ask-agents
description: Ask the specific Claude, Codex, Gemini, or Grok agent the user names and automatically retrieve its response. Use for targeted outside opinions; this does not automatically create a council.
---

# Ask Agents

Read `references/host.md` and `references/transport.md`. Use only the requested provider(s), with separate fresh runs for independent opinions. Gemini uses Antigravity; Grok uses official subscription-authenticated Grok Build. A separate browser Grok workflow is not bundled. If the user explicitly asks for a browser-only feature, explain the unsupported route rather than silently translating it.

A request to ask a named agent authorizes sending the task and its supplied/explicitly referenced material to that provider, subject to any existing source or user restrictions. Do not demand another identical permission. Do not gather unrelated private material, transmit credentials, or override source restrictions. Resolve unclear material scope before transmission. Existing host permissions remain in force. These public adapters are for analysis and reports; implementation stays with the host after the user authorizes it.

Discover the requested connection live, even if Kit Setup was never used. Missing executable, unsupported version, missing login, denied permission, or provider capacity must return an explicit error. Never substitute a different provider/model, use an API fallback for Grok, fabricate an answer, or mark a connection as tested based on binary detection alone.

Send the same neutral question and authorized original evidence to separate independent invocations. Do not share earlier responses with later reviewers. Preserve explicit model and effort selections; report requested versus observed identity accurately. Read `result.json` and then the actual `report.md`; the launcher returns paths, not the full answer. Automatically retrieve and summarize that report in the host conversation, including material failures and access gaps. No browser copy/paste is needed.

Keep unabridged responses and separate additional deliveries. Use substantive partial output with its caveats, never as a successful completed run. When a panel called the transport, return the full report to that archive without an extra synthesis. For a standalone request, explain the outside agent's answer, any disagreements, and your resulting recommendation. Do not create a council or start another provider unless requested.
