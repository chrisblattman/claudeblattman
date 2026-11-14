---
name: weekly-review
description: Refresh one project's dashboard and dated history from selected new evidence, preserving human corrections and identifying changes needed in the underlying project plan. Use on request or as the task inside an explicitly configured schedule.
---

# Weekly Review

Public adaptation v2.1, 2026-11-12. Adds a strict session-only `nochange` preview and a required comparison of new evidence with Tab 2. Retains the shared workflow's baseline-first synthesis and bounded dashboard/history updates, with portable source discovery and explicit correction handling. This is a reference instruction workflow; it does not bundle a Google Docs writer, private prefetch scripts, authentication, or a scheduler.

## Tab roles and user-chosen names

Use **Tab 1** for the current dashboard and dated meeting/review history, and **Tab 2** for the research design or project plan. These are workflow roles, not required tab titles. Users may name or rename either tab. Resolve each role to its verified document tab ID from the project's configuration and actual document structure. Do not select a tab by its name or ordinal position alone, rename it to match a template, or assume `t.0` is Tab 1. For local documents, map the same roles to their agreed file paths.

Older versions called the detailed weekly log "Tab 2" and used `tab2only` for that log. That is not this version's meaning of Tab 2. If adapting an older configuration or receiving `tab2only`, establish the intended output before writing. Keep dated history in the configured Tab 1 history region.

## `nochange`: preview in the session only

Recognize `nochange` anywhere in the request, for example `/weekly-review nochange` or `/weekly-review [project name] nochange`. Determine this mode before invoking helpers or collecting sources. It overrides standing write permissions and conflicting save/apply options for this run.

Read the accessible project configuration, both tabs, comments, and selected new evidence. Perform the normal synthesis and Tab 2 comparison, but print the full proposed Tab 1 dashboard, the proposed dated history entry, and the separate Tab 2 suggestions in the current session. Do not return only a summary of changes. Include source gaps and unresolved questions, and state that nothing was changed.

Do not create or modify local summaries, snapshots, proposal files, configuration, logs, processed-source state, or refresh checkpoints. Do not edit Google Docs, reply to or resolve comments, move/archive transcripts, or create/change schedules. Use read-only source tools and in-session content. Skip fetching/exporting or normalization helpers that write files, reporting any resulting access gap. If the request also asks to save or apply the preview, keep this run read-only and explain that saving or applying requires a subsequent request without `nochange`.

After printing the preview, stop before the apply, record-outcome, and scheduling steps below.

## Default and `nosave` modes

An ordinary `/weekly-review [project name]` request runs the review and applies the bounded Tab 1 update within the user's current or standing authorization. Honor an explicit propose-only project setting. It does not authorize Tab 2 edits. Do not require a separate preview run or repeated approval when the dashboard update is already authorized.

Recognize `nosave` anywhere in the request. Run the same review but omit the local narrative summary file. Google Doc updates, recovery snapshots, and the verified completion/source records follow the ordinary workflow and authorization. `nosave` does not mean read-only or skip verification. If both options occur, `nochange` takes precedence and prohibits all writes.


## Resolve scope and capability

### Resolve the named project

For a request such as `/weekly-review gang entry`, treat `gang entry` as the project name or alias, excluding recognized mode options such as `nochange` and `nosave`. Resolve it using the known project list, project locations, aliases, or context available to the agent. Use the current project when no project name is supplied and that context is unambiguous. An explicit name must not silently fall back to the current folder or another project. If multiple projects match, ask which one. If the project cannot be located, ask for its location rather than searching unrelated accounts.

### Use configuration first, with index fallback

Work on the selected project, not every accessible project or account. Read its instructions and established configuration. New dashboard setups use `PROJECT_CONFIG.json`, populated by setup-project-management with verified destinations and tab IDs. Older installations may use fenced YAML in `.claude/CLAUDE.md`; inspect and map it rather than creating a competing config. Installing a skill alone does not create project configuration.

Use valid, complete configuration directly for document destinations, tab-role mappings, selected sources, and review settings. Verify those destinations and roles against the actual document before writing. A complete configuration does not require a separate read of `PROJECT_INDEX.md`, and a missing index is not a blocker when configuration supplies the necessary information.

If configuration is absent or incomplete, use the project's `PROJECT_INDEX.md` to supply missing links or file locations. It may live at the root or within an established collaboration folder. Follow explicitly identified current destinations, not an arbitrary first link or an archived document. Use the setup configuration contract for new routing records rather than inventing unsupported fields. For local documents, resolve the agreed file paths. The user should not need to paste Doc links every run or look up internal IDs themselves.

Ask only when configuration and the available index do not supply enough information, or when an actual ambiguity or conflict needs resolution. If a conflict is encountered between configuration, index, or document structure, resolve it before dependent writes. Do not silently overwrite either record or select another destination. Preserve user-chosen tab names. Saving or repairing routing records requires authorization and is prohibited during `nochange` runs.

The user may instead supply the dashboard link or ask you to find it in Drive. Use the supplied link or a project-scoped Drive search, verify the intended document and tab roles, and reuse available configuration for the remaining sources. Ask only for unresolved details.

Identify the actual source locations, exclusions, current overview, document ID, verified account, overview tab ID, plan tab ID, review period, history/snapshot paths, and last successful refresh. A review date or cadence preference is not a scheduled task. If essential routing is missing, resolve it before dependent writes.

Use the connected tools available in the current host. For `noapply`, `dryrun`, or an analysis-only request, do not mutate sources, document content, processed-source state, or the successful-refresh checkpoint. Return the proposed changes in chat unless a local output was requested.

If source access is sufficient but a safe Doc write is unavailable, produce a local proposal when authorized and disclose the limit. In `nochange` mode, keep that proposal in the session only. Don't invoke private helpers from hardcoded paths, install authentication machinery, or replace a whole document to work around a missing tab operation.

## Read the baseline and selected evidence

1. Read the current overview/dashboard, protected human notes, unresolved document comments, recent history, and relevant Tab 2 sections. Preserve current human edits as evidence, not noise to remove. If comments cannot be read, report that gap rather than assuming there are none.
2. Compare with the prior saved dashboard snapshot when available to identify direct corrections. If it isn't available, treat current content as the baseline and surface conflicts.
3. Read the selected new notes/documents/communications for the requested period, or since the last verified refresh with sensible overlap. If no checkpoint exists and no period was requested, use the past seven days and state that range; don't imply a complete historical review.
4. Record source identity and dates. Deduplicate by meeting/message/document identity, not date alone. Distinct meetings on one day must remain distinct. Don't auto-archive source transcripts.
5. Distinguish complete transcript, summary-only evidence, inaccessible source, and a source not searched. No character-count threshold establishes transcript completeness.

Use saved source locations and filters rather than asking for them every run. For configured Granola sources, retrieve accessible full transcripts from the selected project meetings/folders, or read transcripts already filed locally. The public workflow does not bundle a fetch/file/archive helper. Do not claim retrieval or local filing when it did not occur, and preserve the no-write rules in `nochange` mode. For connected email, use configured collaborator addresses (sender or recipient) and project keywords to find messages within the review period, then check project relevance and exclusions before including them. Unrelated mail from a team member is not project evidence. Read other selected sources, such as revised proposals or configured WhatsApp groups, only when accessible and relevant. Do not expand to unrelated folders, groups, or accounts.

If a required source is missing, retain a proposal and report the gap. Optional-source gaps may be included in an authorized partial update, clearly labeled. Material source disagreements remain visible until resolved.

## Synthesize for the project's stage

For early work, preserve possibilities versus decisions, changes of direction, and their rationale. For active execution, emphasize dependencies, progress, choices, and blockers. For finishing work, emphasize the authoritative output, unresolved checks, delivery, and handoff. Mixed workstreams can need different treatment.

Carry forward unsuperseded commitments. Absence from a new note is not completion. Link each material change to evidence or an explicit human correction. Leave owners and dates unknown when not stated. Don't turn brainstorming, someone else's task, or a model recommendation into a new user commitment.

Produce:

- A compact proposed Tab 1 dashboard: objective, stage, priorities/status, decisions needed, next actions, sources and gaps.
- One dated history entry with the review period, meaningful changes, source identities, and unresolved questions.
- A separate Tab 2 comparison and proposed changes, following the requirements below. Include this output on every review, including `nochange` runs.

## Compare new evidence with Tab 2

Compare the meetings, comments, decisions, and other selected evidence from the review period with the current Tab 2. Check whether they change the project's question or hypothesis, argument/contribution, design or methods, sample/measures, analysis, or other substantive plan details. Do not treat a routine task or scheduling update as a design change unless it affects the plan.

For each suggested change, show:

- The relevant Tab 2 section and what it currently says.
- The proposed replacement or addition, specific enough for the user to review.
- The reason and dated source link or reference, including relevant comments.
- Whether the source records an agreed decision, a factual correction, or an unresolved idea/question. Keep unresolved choices explicit rather than writing them as settled design.

If the comparison finds no supported changes, say "No changes to Tab 2 suggested from the reviewed sources." If Tab 2 or essential evidence cannot be read, say the comparison is incomplete and identify the gap. Do not report no changes when the comparison could not be completed.

Present these suggestions separately from the Tab 1 update. A routine review or scheduled dashboard update does not authorize applying them, including corrections requested through comments. Wait for the user's approval of the specific proposed Tab 2 edits before changing the design document. Reuse approval already given for those exact edits, but do not treat general dashboard write permission as approval of new design changes. In `nochange` mode, apply nothing even if an edit was previously approved.

When approved design edits are applied, change Tab 1 only where the substance affects its priorities, decisions, status, or next actions. A wording change in Tab 2 does not by itself require rewriting Tab 1.

Present Tab 1 changes and uncertainties for review unless the user has already authorized this bounded dashboard update or configured standing authority for it. The separate approval requirement for specific Tab 2 edits above still applies. Don't force repeated approval of unchanged work. Do not send messages, assign tasks in external systems, or resolve comments merely because they appeared in a review source.

## Apply a bounded update when authorized

Before writing, verify exact account, document, tab IDs, and the current document revision. A configured overview tab is not necessarily `t.0`. Do not silently fall back to another tab.

For the marker-based template, require exactly one standalone paragraph for each marker in the overview tab, in this order:

```text
=== PROJECT STATUS DASHBOARD ===
[dashboard to replace]
=== DASHBOARD END ===
[human notes/corrections, preserved]
=== WEEKLY SUMMARIES START ===
[dated history, newest first]
```

Stop on missing, duplicate, reordered, embedded, or unsupported boundaries. Generated content must not contain those marker strings. Save a pre-update snapshot when authorized, then replace only the dashboard interior and insert the new entry immediately after the history marker. Preserve existing history, human notes, unrelated tabs, tables, and formatting. Bound any formatting changes to the intended content.

Use revision-checked native writes where available. Google Docs positions are UTF-16 units; calculate ranges from actual tab-scoped readback, not Python character counts. If the document changed during synthesis, reread and reconcile before applying. If required guards aren't available, return a proposed update instead of claiming a safe unattended writer.

Assign a stable review ID using the project, review period, and source identities; record it with the history entry. Before retrying, inspect whether that ID and the intended changes are already present. Exact retries must not duplicate history. A changed proposal for the same review needs an explicit correction record, not a second indistinguishable entry. Partial dashboard/history completion is not success.

## Verify and record the outcome

Read back the affected regions once. Check intended changes, marker uniqueness/order, history identity, direct corrections, and preservation outside the update. For a separate authorized plan edit, verify its tab and record its own review date.

Only after the complete intended update is verified, save the review record and advance `last_successful_refresh`. When a write fails or times out, inspect the result before retrying; preserve the previous successful checkpoint while completion is uncertain. Report applied changes, proposals remaining, source gaps, and a verified destination link. Local fallback is not a successful Google Doc update.

Save the narrative summary in the project's configured review-history location during a normal authorized run. With `nosave`, present that summary in the session and omit this local file, while retaining the ordinary verified completion records. With `nochange`, the earlier stop applies: save nothing and advance no checkpoint.

## Scheduling

This skill does not create a recurring task. When the user requests scheduling, configure the supported scheduler separately with the explicit project, interval, timezone, source scope, write authority, and notification policy. Verify that environment can reach the same files and accounts. Report failure, meaningful change, or a decision needed; stay quiet on unchanged/non-actionable runs unless the user requests status reports.

## Validation status

The public instructions and configuration are intended for adaptation in Claude or Codex. They are not evidence of a tested integration in every host. Before enabling recurring writes, test in a disposable Doc: initialize; refresh from a new note; preserve a human correction; rerun without duplicate history; stop on conflicting revisions or duplicate markers; preserve Tab 2 unless its change was authorized. No production account operation is implied by installing this reference workflow.
