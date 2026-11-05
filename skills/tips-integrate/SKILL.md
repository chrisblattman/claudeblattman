---
name: tips-integrate
description: Turn saved AI tips and system-improvement follow-ups into ranked proposals, using independent critics for larger batches, then apply selected changes or queue investigations.
disable-model-invocation: true
---
# Tips Integrate

Use after curation or when the user asks to apply accumulated workflow learnings. Keep discovery, ranking and authorization separate: a high score recommends a change; it does not grant permission to edit settings. Preserve any specific application scope the user already authorized.

## Inputs and setup

Use the same configured tips folder as `/tips-curate` (default `~/.claude-assistant/tips/`). Read `collected-tips-log.md` and `integrate-state.json`. Optional configured sources are reference packs, session logs, a port checklist, and the active task queue. The investigation destination defaults to `skills-learning-catalog.md` in that tips folder. These are user data, not files to store inside the installed skill.

Read [scanning rules](references/scanning-rules.md) and [state and write rules](references/state.md). For a batch needing critics, read [the bundled critic instructions](references/proposal-critics.md). No separately installed agent definition or private runtime is required. Native subagent support is required for the five-critic phase; report a missing capability instead of impersonating independent reviewers.

Options: `source:tips|refs|session|port`, `since:YYYY-MM-DD`, `surface:claude-code|codex`, `dryrun`, `--full`, or `compact`. Natural-language equivalents work. With no source selector, scan configured sources only. `source:tips` includes Medium as well as High tips; the default selects High tips. `dryrun` may read and rank but must not write artifacts/state or apply changes. `compact` performs only authorized state housekeeping described in the reference.

## 1. Establish the current context

Identify the current host from explicit input or known execution context. If uncertain, make investigation proposals only until the host is known. A `shared` route is not permission to edit arbitrary files in both apps.

Read integration state; preserve existing dispositions and unknown fields. A missing file can be initialized when writing is authorized; corrupt state must be diagnosed rather than replaced with an empty history. If available, report the last curation date when more than 14 days old; this is advisory, not a requirement to rerun curation.

Inventory only the names/descriptions of user-configured skills, instructions and target files at this stage. Discover authoritative source locations rather than editing plugin caches or generated copies. Do not sweep unrelated home directories.

## 2. Scan and deduplicate

Follow the scanning reference. Use explicit `since` when supplied; otherwise consider recent unprocessed entries (first run: 30 days), previously pending candidates, and unresolved entries left over from prior runs. A `last_run` timestamp must not hide a same-day or still-pending item. Compare stable keys with recorded dispositions.

Search the active queue and catalog for concrete claim/tool/repo anchors before calling something a duplicate. A shared topic alone is insufficient. Keep the reason and source provenance for duplicates, watch items and deferrals. Missing sources are skipped with a note; failed reads are not reported as empty sources.

Separate `watch` items before ranking and keep them visible. Prioritize up to 15 remaining candidates by quality and recency; keep overflow pending rather than marking it processed. Default proposals inherit `Routing:` from curation, but target inspection can change the route with a recorded reason.

## 3. Rank with independent critics when useful

For five or fewer actionable candidates, skip the council and present all. For more, launch five fresh native subagents in parallel, one each: Catalog Conflict, Maintenance Tax, Compounder, First-Run and Skeptic. Give every worker the same candidate batch, inventory, known constraints and its assigned section of the bundled critic instructions. Workers score every candidate independently and do not edit files or see one another's reports.

Use available configured models; do not hardcode dated model versions, token estimates or private subscription policies. Retry a failed worker at most once for a transient error. Wait for every worker to complete or reach its failure limit; three successful workers is the minimum to proceed, not a reason to stop waiting for the other two. Below three, retain the pending batch (except in dryrun) and report failure. Do not silently substitute a single-critic run.

Synthesize in the coordinating session, as this tips-ranking workflow specifies. For each candidate compute `mean(returned scores) - 0.1 * blocker_count`. Show actual reviewer count, missing perspectives, rationales, dissent, and concrete blockers. Scores rank ideas; they do not prove a claim or waive a blocker. For the top candidates, identify important questions all reviewers may have missed.

Advance the top seven to concrete proposals. Keep items 8–15 visible with their rationale and full detail in the saved report. Save the report and individual outputs under a unique `council-<timestamp>-<surface>/` directory in the tips folder, unless dryrun. Do not overwrite an earlier same-day run.

## 4. Propose and select changes

- **Direct:** names an existing authoritative target and a concrete change under 10 lines. Read the relevant section to show the current text, proposed diff, reason and route. The host must be known; the route must match it or be shared. A foreign-host change becomes an investigation unless explicitly approved for that host.
- **Investigation:** needs research, a new skill, design decisions, a larger change, or an unavailable/uncertain target. Show a bounded task and intended benefit. Creating that task does not authorize doing the investigation.
- **Watch:** remains visible and deferred; users can promote it, normally to an investigation.

Lead with the top three proposals, then items 4–7, deferred candidates and watch items. `--full` expands the entire ranked list. Ask which concrete changes to apply unless the current request already authorizes those changes. Do not depend on the app displaying a permission dialog: some environments auto-approve file tools. In dryrun, show the report and stop with no writes.

## 5. Apply selected items

Read the complete target before editing. Check current content, applicable instructions, other active edits, configured locks and sync conflicts. If the target changed since the preview, reconcile and reassess the proposal. Preserve user customizations, licensing and source attribution. For imported skills, use a supported customization/source route rather than overwriting installed caches.

For a direct change, preserve a recoverable previous version, make the scoped edit, and run a relevant check. Record the target, source tip, route, change summary, reversal location and actual validation in `changes.md` in the tips folder. A failed or unverified change is not an integrated success; report it and retain a retryable state. Shared source edits that need regenerated adapters must include that regeneration and validation or be reported incomplete.

For an investigation, append a uniquely keyed unchecked task to `## INBOX — New Items` in the catalog, with its source and route. Do not rearrange other catalog sections. Record it as queued, not implemented. User-deferred/rejected items keep the user's reason. Verify each artifact before recording completion in state; reconcile partial writes using the stable key.

## 6. Report

Give reviewer coverage, applied changes and checks, queued investigations, pending/failed items, watch items, source failures, route overrides, and paths to reports/state. Keep disagreements available. Offer the next useful action; do not publish changes, install another tool, send messages, or run another council without authorization.
