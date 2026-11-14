# Project configuration and dashboard contract

Use this during dashboard initialization. The public setup and weekly-review workflows share one project configuration. Preserve an existing equivalent file when it works; record its path in the project instructions. For a new setup, use `PROJECT_CONFIG.json` at the project root.

The example below is a skeleton, not a ready-to-run destination. Replace labels with actual project values; leave unavailable optional fields null. Resolve relative paths from the project root. For cloud Docs, store verified IDs from tool readback. Never select a tab by display order alone.

```json
{
  "schema_version": 1,
  "project_name": "Example training project",
  "stage": "exploring",
  "overview_path": "PROJECT_STATUS.md",
  "index_path": "PROJECT_INDEX.md",
  "ai_work_path": "AI_Collaboration",
  "sources": [
    {"kind": "local", "location": "meetings", "required": true},
    {"kind": "local", "location": "drafts/project-plan.md", "required": true}
  ],
  "excluded_sources": [],
  "dashboard": {
    "mode": "local-proposal",
    "account": null,
    "document_id": null,
    "document_url": null,
    "overview_tab_id": null,
    "plan_tab_id": null,
    "start_marker": "=== PROJECT STATUS DASHBOARD ===",
    "end_marker": "=== DASHBOARD END ===",
    "history_marker": "=== WEEKLY SUMMARIES START ==="
  },
  "review": {
    "cadence_days": 7,
    "timezone": null,
    "last_successful_refresh": null,
    "history_path": "AI_Collaboration/Weekly_Reviews",
    "snapshot_path": "AI_Collaboration/Dashboard_Archive",
    "write_mode": "propose",
    "schedule_configured": false
  }
}
```

`stage` may be `exploring`, `executing`, `finishing`, or `mixed`; describe differences in the overview. `dashboard.mode` is `local-proposal` until the Google Doc is verified, then `google-doc`. `review.write_mode` is `propose` or `apply-authorized`; the latter records standing scope and never overrides the current user's instructions. A cadence is a preference, not proof that a schedule exists.

For optional connected sources, record only the selected project locations, relevant filters, and exclusions. A shared team member's name alone is not a sufficient project filter. Record summary-only versus transcript access in the review output. If a required source is unavailable, retain a proposal and report the gap; don't advance the successful-refresh checkpoint.

## Tab 1: Overview & Meeting Log

Use unique, standalone marker paragraphs in this order:

```text
=== PROJECT STATUS DASHBOARD ===
Last successfully refreshed: [date or not yet refreshed]
Current stage and objective
Priorities and current status
Decisions needed and blockers
Next actions with known owners/dates and sources
Sources checked and gaps
=== DASHBOARD END ===

Human notes / corrections
[Read this area on refresh; never replace it automatically.]

=== WEEKLY SUMMARIES START ===
[New dated entries go here, newest first.]
```

Missing or duplicate markers, wrong order, unsupported structures, or an unrecognized tab are reasons to stop a write. Don't search other tabs and silently choose a different destination. Direct human edits inside the dashboard also form part of the baseline; the protected notes area is not the only way to correct a fact.

## Tab 2: Research design & progress / Project plan

Include the project question, scope, rationale, approach, evidence, key decisions, unresolved design issues, and links to authoritative work. Give this tab its own last-reviewed date and a short change log. Update at substantive milestones; do not replace it during an ordinary Tab 1 refresh. Propose plan changes with sources and apply only within authorized scope.

## Existing installations

Some older weekly-review configurations use a fenced YAML block under `Structured Config (machine-readable)` in `.claude/CLAUDE.md`, with hardcoded folder paths and tab defaults. Read and map the actual fields if adapting that installation. Do not maintain conflicting JSON and YAML authorities or silently change a live workflow. The public JSON contract is not a claim that private prefetch scripts understand it.
