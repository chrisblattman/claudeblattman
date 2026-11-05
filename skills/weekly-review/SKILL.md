---
name: weekly-review
description: "Prepare a weekly project review from configured sources. Reference workflow requiring external helper scripts that are not bundled here."
---

# Weekly Project Review
*v1.9.1 — Stricter YAML config parsing (loud failure on malformed `.claude/CLAUDE.md`); helper scripts for multi-tab Google Doc writes (`replace-dashboard.py`, `insert-weekly-log.py`); RTF/PDF transcript normalization (`normalize-transcripts.py`); hollow-transcript handling per-meeting; document-comment processing (read, apply corrections, reply, resolve).*

Generate a comprehensive weekly summary for the current research project, pulling from multiple sources.

> **Public reference, not a complete install.** This file describes a workflow that uses three external Python helpers: `normalize-transcripts.py`, `replace-dashboard.py`, and `insert-weekly-log.py`. Those helpers are not included in this public repository. Set up and review suitable helpers and account connections before running this workflow.

## Overview

This skill collects data from WhatsApp, meeting transcripts, and Gmail, then generates:
1. **Tab 1 content**: High-level project dashboard (updated directly in Google Doc)
2. **Tab 2 content**: Detailed weekly log with thematic synthesis across all sources

## Prerequisites

Before fetching, normalizing, archiving or writing anything, verify the three helper files at the configured `WEEKLY_REVIEW_HELPERS` path and the intended account/project configuration. If any helper is missing, stop and report the missing dependency. Do not invent a bundled scripts directory, silently skip that work, or substitute a different account. The public file alone does not provide those dependencies.

The skill expects three env vars on each machine (set in `~/.zprofile` or equivalent):

```bash
export GOOGLE_WORKSPACE_MCP_USER_EMAIL="<your@email>"     # account to authenticate as
export GOOGLE_WORKSPACE_MCP_CREDENTIALS_FILE="<path>"     # optional; defaults to ~/.google_workspace_mcp/credentials/<email>.json
export WEEKLY_REVIEW_HELPERS="<path>"                     # required for a public adaptation; point to reviewed local helpers
```

If `GOOGLE_WORKSPACE_MCP_USER_EMAIL` is unset on a machine that has only one credentials file, scripts fall back to the legacy default. **Multi-account machines must set the env var explicitly** — the helper scripts do NOT silently glob-pick the first credentials file (this prevents silent wrong-account writes).

The skill also requires every project `.claude/CLAUDE.md` to carry a single ` ```yaml ` block under `## Structured Config (machine-readable)`. The prefetch parser only reads fenced blocks; loose top-level YAML in prose is ignored.

## Instructions

### Step 0: Read Project Configuration
- Read `.claude/CLAUDE.md` from the current project folder
- Extract ALL of: project name, Google Doc ID (`google_doc_id`), team roster, WhatsApp groups (with JIDs), folder paths, `granola_folder` or `granola_folders`, `project_keywords`, `exclude_keywords`
- Fields must appear inside ` ```yaml ` code blocks; loose top-level YAML is ignored
- Strip surrounding quotes from extracted values
- Extract `project_type` (default: "quantitative"). If `project_type: qualitative`, use the qualitative dashboard template
- Extract `skip_meeting_log` (boolean, default false). If `true`, Tab 2 generation is skipped entirely
- If config is missing required fields, **stop and surface the errors** — do not fall back to legacy mode silently

### Step 1: Determine Date Range
- Check `10_AI_Collaboration/Weekly_Reviews/` for most recent `weekly-review-*.md` or `whatsapp-summary-*.md` file
- Use that date as start_date (or 7 days ago if none exists)
- end_date = today
- Tell user: "Generating weekly review for [start_date] to [end_date]"

### Step 1.5: Populate Transcripts (Optional)

If you have a transcript export tool (e.g., `granola-fetch`, Otter export):

1. Check the project's configured transcripts folder for existing files
2. Fetch transcripts based on config:
   - **If config has `granola_folders` (list):** Run your fetcher once per folder, letting your routing config dispatch destinations
   - **If config has `granola_folder` (single string):** Run with that folder name
   - **If neither field exists:** Skip and continue with existing transcripts
   - Strip surrounding quotes from folder names before passing to CLI
3. **Normalize transcripts (v1.9 — fixes RTF/PDF handling).** Run the bundled `normalize-transcripts.py`:
   ```bash
   python3 "$WEEKLY_REVIEW_HELPERS/normalize-transcripts.py" \
     --folder "[transcripts_folder]" --json-output --apply
   ```
   This converts any `.rtf` (via `textutil`) or `.pdf` (via `pdftotext`) for which there's no full `.txt` sibling, archives the originals, and replaces hollow `.txt` stubs when a converted sidecar is available. The script is idempotent and a no-op when there's nothing to do.
4. Do NOT prompt for confirmation — transcript fetching and normalization are non-destructive.

### Step 2: Collect Data (with graceful degradation)

**2a. WhatsApp Messages**
- For each group in `whatsapp_groups`:
  - Search for group using WhatsApp MCP (`list_chats`)
  - Do NOT rely on `list_chats` metadata for last-message dates — metadata is often stale
  - ALWAYS fetch actual messages using `list_messages` regardless of metadata
  - Filter to messages within date range
- If WhatsApp MCP fails: retry once. If still unavailable: Note "WhatsApp unavailable - skipped" and continue
- Save raw messages to `10_AI_Collaboration/Weekly_Reviews/whatsapp-summary-[date].md`

**2b. Meeting Transcripts**

Read all transcript files from the configured transcripts folder. Support multiple formats: Granola export, manual markdown, Zoom `.vtt` files.

**Hollow transcript check (apply per-transcript):**

After reading each transcript, classify it before using it:
- **FULL**: ≥5,000 characters AND contains conversational speaker content (dialogue lines, speaker labels, or `.vtt` Zoom format)
- **HOLLOW**: <5,000 characters OR content starts with `###` markdown headers OR primary structure is bullet points with no speaker attribution

For each hollow transcript:
- Note it in Data Source Alerts: "[Meeting name] ([date]): AI notes only — full transcript not yet processed. Detailed meeting record omitted."
- Do NOT include hollow transcripts in Detailed Meeting Records. Use only for background context.

**If ALL transcripts in the period are hollow AND there are no other substantive sources:** Stop and ask the user whether to retry later or proceed without detailed meeting records.

**2c. Gmail Threads**
- **Date range**: Same as other sources
- **Filter criteria** (emails must match at least one):
  - Sender OR recipient matches any team member email in roster
  - Subject or body contains project keywords from `project_keywords`
- **Exclusions**: Automated emails, calendar invites (`.ics`), newsletters, bulk mail; threads matching `exclude_keywords`
- **Gmail Retrieval Strategy**: Use individual `get_gmail_message_content` calls (avoid batch size limits). If batch fails: fall back to individual fetches
- **Feedback loop**: At end of Gmail section, list included/excluded counts for noise control
- If Gmail MCP unavailable: Note "Gmail unavailable - skipped" and continue

**2d. Sensitive Content Filtering**

The weekly summary may be shared with the full team. Screen for and exclude sensitive content from ALL sources:

**Exclude**: Critical performance comments, hiring/firing discussions, pay/compensation, personnel-specific funding decisions, anything inappropriate for full team.

**Screening by source type**:
- General team meetings: Low sensitivity — include freely
- PI-only or PI + Research Manager threads: Screen MORE AGGRESSIVELY but include non-sensitive content
- 1-on-1 transcripts: Review for sensitive topics before including

When in doubt: Omit specific sensitive content and note "[Some content omitted — PI review recommended]"

**Include freely**: Funding strategy, project decisions, action items, research design, logistics, strategic direction.

### Step 2e: Verify Key Metrics Against Authoritative Sources

**Verify all quantitative claims against authoritative sources before generating content.**

Priority order for factual claims:
1. **Research Design and Progress document** (if maintained) — check for verified figures
2. **Earlier weekly summaries** — if they post-date the research design doc
3. **Current week's sources** — only if #1 and #2 unavailable; FLAG if uncertain

Watch for red flags: round numbers, hedged statements, conflicting numbers, numbers without context.

### Step 2f: Read Previous Dashboard as Baseline

**The Project Status Dashboard is a living document — read current state before writing.**

1. Read the current dashboard content from the Google Doc (Tab 1)
2. This is your BASELINE — not a blank slate
3. PRESERVE previous content unless explicitly superseded, factually outdated, or explicitly removed by user
4. MODIFY existing sections with new information; ADD new items; REMOVE only when completed/superseded

### Step 2g: Process Google Doc Comments

Read unresolved comments and apply corrections before synthesis.

1. Call `mcp__google_workspace__read_document_comments` on the project's Google Doc
2. Filter to **unresolved comments only** (skip any marked `[RESOLVED]`)
3. For each unresolved comment, classify based on content:
   - **Correction**: contains "should be", a number, "wrong", "change to", "actually", "not X but Y", or a clear factual fix. Apply it.
   - **Question/ambiguous**: contains "?", "should we", "is this right", or intent is unclear. Surface in Step 7 output.
4. **Apply corrections**:
   - Tab 1 comments: incorporate into the dashboard baseline (modify before synthesis)
   - Tab 2 comments: apply as direct edits to the Google Doc during Step 6
5. **Reply + resolve** each applied correction: reply with "Applied in weekly review [DATE]. [Brief description of change]." then resolve via `resolve_document_comment`
6. If classification is ambiguous, default to **question** (surface to user rather than misapply)
7. If `read_document_comments` fails: note "Comments unavailable — skipped" and continue
8. If zero unresolved comments: no output, no additional calls — move on

**Note:** The API returns comments across all tabs. Use the comment's anchor text to determine which tab/section it belongs to.

### Step 3: Synthesize

**Detail and Length Requirements**: Scale to meeting length:
- Brief check-ins (under 20 min): 0.5-1 page
- Standard meetings (20-60 min): 1-3 pages
- Long strategy sessions (60+ min): 2-4 pages

**Guiding principle**: Include more detail when in doubt. A reader who wasn't at the meeting should understand WHAT was decided, WHY, WHO said it, and the context.

**Priority-Related Content Detection**: Watch for "strategic priority", "operational", "critical path", "green/yellow/red", "urgent", "success factor" language. Note status changes.

**FORMATTING RULES**:
- No markdown tables — use bullet/sub-bullet format for all structured data
- Bold labels followed by content on same line or as sub-bullets
- Bold team member names throughout both Tab 1 and Tab 2 (track bold ranges separately; do not embed `**` markdown markers in the text — formatting is applied via API)
- Paraphrase rather than quoting. Do not include direct quotes or "Key Quotes" sections.
- **ASCII emoji placeholders**: Use `[RED]`, `[GREEN]`, `[YELLOW]` instead of real emoji (red/green/yellow circles) in generated text. Real emoji break Google Docs index calculations. They are swapped to real emoji in Phase 5.

**Visual Separators**:
- Between weekly summaries: heavy double-line separator
- Within weekly summaries: medium single-line separator

**Language Guidelines**: Plain, accessible language. Avoid jargon. Use "challenges" not "blockers", "unclear" not "TBD". Prefer concrete descriptions over abstract terms.

**Generate Tab 1 (Dashboard)**: Start from previous dashboard, update with this week's info. Structure:
- Project overview and status
- Strategic objectives and progress
- Operational objectives serving each strategic goal
- Team member to-do items
- Critical success factors with status (green/yellow/red)
- Funding pipeline

**If `skip_meeting_log: true`:** Skip Tab 2 generation entirely. Proceed to Step 4. Still use transcripts and WhatsApp data for Tab 1 dashboard content.

**Generate Tab 2 (Weekly Log)** *(skip if `skip_meeting_log: true`)*: New entry prepended (reverse chronological). Structure:
- Date range header
- Weekly Activity Summary (thematic synthesis across all sources)
- Detailed Meeting Records (full summaries of each meeting)

### Step 4: Save Local Copies

**Skip if `nosave` argument.**

- **Weekly Summary**: Save to `10_AI_Collaboration/Weekly_Reviews/weekly-review-[date].md`

### Step 5: Write to Google Doc (No Review Gate)

Proceed directly to Step 6 — do NOT display content in terminal for review. User reviews formatted content in the Google Doc.

### Step 6: Update Google Doc

**If `skip_meeting_log: true`:** Skip the Weekly Log Prepend phase entirely.
**If `tab1only`:** Only execute the Dashboard Replacement phase. Skip Weekly Log Prepend.
**If `tab2only`:** Only execute the Weekly Log Prepend phase. Skip Dashboard Replacement.

**Precondition**: The Google Doc must have all 3 markers (`=== PROJECT STATUS DASHBOARD ===`, `=== DASHBOARD END ===`, `=== WEEKLY SUMMARIES START ===`). If `DASHBOARD END` is missing, STOP and report — do not fall back to the old 2-marker approach.

**6-Phase Protocol**:
1. **Preparation** — Generate text with `[RED]`/`[GREEN]`/`[YELLOW]` ASCII placeholders; strip `**` markdown bold markers (bold is applied via API, not text)
2. **Dashboard Replacement** — v1.9 — call the bundled `replace-dashboard.py`. Handles multi-tab `tabId` correctly (the MCP's `batch_update_doc` does not):
   ```bash
   python3 "$WEEKLY_REVIEW_HELPERS/replace-dashboard.py" \
     --document-id "$GOOGLE_DOC_ID" --tab-id "t.0" \
     --start-marker "=== PROJECT STATUS DASHBOARD ===" \
     --end-marker "=== DASHBOARD END ===" \
     --content-file /tmp/dashboard-replacement-$(date +%s).txt \
     --json-output --apply
   ```
   Parse the JSON output: `status` is `applied`, `noop`, or `error`. Stop on error.
3. **Verification** — Confirm all 3 markers intact after dashboard write
4. **Weekly Log Prepend** — v1.9 — call the bundled `insert-weekly-log.py`:
   ```bash
   python3 "$WEEKLY_REVIEW_HELPERS/insert-weekly-log.py" \
     --document-id "$GOOGLE_DOC_ID" --tab-id "t.0" \
     --marker "=== WEEKLY SUMMARIES START ===" \
     --content-file /tmp/weekly-log-$(date +%s).txt \
     --json-output --apply
   ```
5. **Emoji Swap** — Use `find_and_replace_doc` (this MCP tool DOES correctly accept `tab_id`) to replace `[RED]`/`[GREEN]`/`[YELLOW]` with the real circle emoji
6. **Formatting** — Apply heading sizes and team-name bolding using API-reported indices (from `inspect_doc_structure`), not calculated offsets

**Phase 6 is required.** The document is unreadable without proper header sizes and bold formatting. After Phases 1-5, proceed to Phase 6 and apply at minimum: (a) Tier 2 baseline format reset (11pt non-bold on full range), then (b) Tier 1 section header formatting (16pt/14pt/12pt bold).

**Formatting scope: FULL DOCUMENT.** Even when running `tab1only` or `tab2only`, Phase 6 formats the entire document. Formatting is idempotent.

### Step 7: Final Confirmation
1. Confirm: "Weekly review complete. Google Doc updated."
2. Provide link: "Check Google Doc: [link]"
3. If corrections were applied from comments: list them briefly
4. If any comments were classified as questions/ambiguous: list them with anchor text so the user can address manually
5. Note any other issues or manual fixes needed

### Step 8: Archive Processed Transcripts

After the weekly review is complete:

1. Create archive folder if needed: `[project]/10_AI_Collaboration/Transcripts/archive/`
2. Move all processed transcript files to archive (both Granola and Zoom for same meeting)
3. Confirm: "Archived X transcript(s) to Transcripts/archive/"
4. Note any files left behind (outside date range, unparseable)

Legacy-format files are archived as-is. No automatic renaming.

## Arguments

`$ARGUMENTS` can include:
- `nosave` — Don't save intermediate files
- `tab1only` — Only generate Tab 1 dashboard
- `tab2only` — Only generate Tab 2 detailed log
- `days:N` — Override date range to last N days
- `since:YYYY-MM-DD` — Override start date
- `skipwhatsapp` — Skip WhatsApp even if available
- `skipemail` — Skip email even if configured
- `skiparchive` — Don't archive transcripts after processing

## Examples

```
/weekly-review                    # Full review, default date range
/weekly-review days:14            # Last 14 days
/weekly-review tab1only           # Quick dashboard update
/weekly-review skipwhatsapp       # Skip WhatsApp if it's being flaky
```

## Customization Points

**To set up this skill for your workflow:**

1. **Folder paths**: The default `10_AI_Collaboration/Weekly_Reviews/` path reflects one project structure. Update to match your own — e.g., `~/Research/Project/reviews/` or `docs/weekly-reviews/`.

2. **Data sources**: The skill pulls from WhatsApp, meeting transcripts, and Gmail by default. Remove or add sources in the data collection steps to match your available integrations.

3. **Google Doc format**: The 3-marker system requires markers in your Google Doc. See Step 6 for setup.

4. **Dashboard template**: The default is quantitative. Set `project_type: qualitative` in your project config for a qualitative dashboard.

5. **Transcript formats**: Support for Granola, Zoom `.vtt`, manual markdown, RTF/PDF normalization. Add new format parsers as needed.

6. **Helper scripts location**: The original workflow expects `normalize-transcripts.py`, `replace-dashboard.py`, and `insert-weekly-log.py`. This public repository does not include them. Set `WEEKLY_REVIEW_HELPERS` to the directory containing your reviewed local helpers and verify all three files before use.

## Error Handling

- If project config missing: "No .claude/CLAUDE.md found. Please run from a configured project folder."
- If config has malformed YAML: stop and surface the errors. Do not fall back silently.
- If WhatsApp unavailable: Continue with other sources, note in output
- If no transcripts folder: Create it, note "No transcripts folder found - created"
- If Google Doc update fails: Save Tab 1 content locally, provide manual instructions
- Flag any ambiguities: "Unclear who said X - please clarify"

## Performance Logging

After completing all steps above:
```bash
echo "$(date +%Y-%m-%d),weekly-review,TOOL_CALLS,NOTES" >> ~/.claude-assistant/logs/skill-performance.csv
```
Replace TOOL_CALLS with your exact count. No `~` prefix. Replace NOTES with brief volume info (e.g., "3 transcripts 12 emails 2 whatsapp"). Do not skip this step.
