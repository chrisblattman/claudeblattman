---
name: ask-agents
description: Send a specific question or task to the external agent or agents the user names and relay their responses. Use for an outside opinion or explicit request to ask Claude, Codex, or Gemini.
---

# Ask Agents

Read `references/host.md` and `references/transport.md` next to this skill. They specify the installed app's runner and its actual capabilities. Ask Agents is request-exact: it does not expand a question into a council or add unrequested providers. Council manages its own panel and may share transport machinery without invoking this conversational workflow.

Before an external call, apply the existing privacy and send-authorization checks. Do not transmit confidential records, personal contact data, participant data, private transcripts, or unpublished sensitive work through these starter adapters. Offer a local answer or a redacted request for approval. Respect explicit authorization already given for this task and service; do not ask again for an unchanged authorized action. Otherwise explain the service and content and obtain send authorization. Never bypass host permissions.

For independent opinions, send the same self-contained question and permitted evidence to separate fresh invocations. Add a concrete specialist question when useful. Do not let a later reviewer see earlier answers. Multiple requested reviewers from one service require multiple calls and distinct report files.

Use the bundled transport as documented. State its actual limits rather than claiming it is Chris's unrestricted balanced runtime. Missing executables or authentication are setup failures; never fabricate an external response. Retain the full reply and actual execution/access status. Identify the requested and observed model separately when available; never infer observed identity from the requested name.

For a standalone question, relay the answer with a brief comparison and useful next action. If a larger workflow called the runner for reports, save each unabridged response to that workflow's archive and return it without performing an extra synthesis. Preserve separate partial/additional replies and failures. Only remove temporary data after all required reports and status records have been saved.
