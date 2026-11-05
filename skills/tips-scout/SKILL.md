---
name: tips-scout
description: Prepare and save an AI-workflow research prompt from coverage gaps and active topics; consult Grok through the installed official subscription route only when explicitly requested.
---
# Tips Scout

Prepare a targeted search for useful AI approaches. Default behavior is **prepare and save**, not a live provider call. This public adaptation follows the current Grok routing override: no legacy grok-cli API dispatch, browser Expert automation, or automatic manual-paste fallback.

## Inputs

Use the configured tips folder (default `~/.claude-assistant/tips/`) shared with `/tips-curate` and `/tips-integrate`. Read the user's base search prompt if configured; otherwise use [the bundled base prompt](references/base-prompt.md). Read recent `collected-tips-log.md` entries and the active portion of the configured task list if available. Missing logs or tasks do not block prompt preparation.

Arguments or equivalent natural language:
- `base`: return the base prompt unchanged; no coverage reads, customization, dispatch or file writes.
- `window:weekly` (7 days, default), `window:monthly` (30 days), `window:days:N`, or `window:YYYY-MM-DD..YYYY-MM-DD`.
- `surface:claude-code|codex`: host provenance. Use explicit input or known host context; ask if neither establishes the host.
- `suffix:slug`: optional filename label.
- “Ask Grok to run this” explicitly authorizes one consultation; merely invoking `/tips-scout` does not.

## 1. Find gaps and relevant topics

Use the actual date and timezone; calculate absolute start/end dates with a date library. Reject invalid windows rather than guessing. Coverage analysis always uses the last 14 days, independently of the requested search window. Read all relevant dated entries; do not stop at the first older heading if the log is mixed-order.

Count coverage by the user's categories. With the bundled base, use skill/agent architecture, app features, research/work workflows, new tools/repos, and knowledge organization. Boost categories with no recent entries; de-emphasize any accounting for at least half the recent tips. Tags may overlap, so counts need not add to 100 percent. If no recent entries exist, say so and use the base categories without inventing a distribution.

Extract up to five active investigation themes. Turn private task context into general research questions; exclude private correspondence, credentials, confidential project details and personal identifiers from the outbound prompt. Retain the base's output requirements and exclusions.

## 2. Save and show the prompt

Use `grok-prompt-YYYY-MM-DD-<surface>-<window>[-suffix].md` in the shared tips folder. Use a filesystem-safe window slug, including both dates for an explicit range. Allocate a paired `grok-response-...md` name; if either exists, choose a fresh numbered suffix for both. Do not create date-only aliases or overwrite earlier reports.

Show the coverage summary and complete prepared prompt, with the saved path. Record host, date window, and preparation status in a small companion `grok-run-<same-slug>.json` manifest. Keep analysis/metadata separate from the prompt text.

## 3. Execute only when requested

Use the installed starter kit's `/ask-agents` Grok route, which calls the official Grok Build subscription transport and retrieves the report. Read its installed instructions; do not invent CLI flags or depend on a private helper. This is an agent consultation with requested source searches, not a claim to have run a branded Deep Research/DeepSearch mode.

If Ask Agents or the official connection is unavailable, retain the prompt and report the named blocker. Do not switch to an API-key tool, browser Expert, another provider, or manual paste automatically. If the user requests another provider explicitly, follow that route and record its actual name.

Before submission, check today's manifests and reports. If an earlier request was submitted or completed, identify that this would be a second live run and obtain confirmation unless the current request already explicitly authorizes the repeat. An uncertain submission is not a failed-to-submit request: retrieve its existing result or stop; never automatically resubmit.

Mark submission status in the manifest, retain the returned run/report path and actual provider, and wait for that run's final status through the installed workflow. Save or link the actual captured response to the paired response artifact. Label partial reports and missing source access honestly; do not present a generated answer as verified search evidence.

## 4. Hand off to curation

Report prompt and response paths, actual route and status. For a successful report, suggest `/tips-curate` with that report. Curation will process it without automatically scanning email/bookmarks. Keep raw reports from different hosts/windows separate even when they overlap; the shared tips log handles deduplication.

Do not schedule repeated live calls or modify settings as part of a scouting request. A preparation failure should leave existing artifacts intact and name what is missing.
