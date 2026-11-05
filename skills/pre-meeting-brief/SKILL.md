---
name: pre-meeting-brief
description: "Prepare a meeting brief from configured calendar, correspondence, project documents and previous meeting records."
---

<!-- pre-meeting-brief v1.3 | sanitized from private v1.3 -->
# Pre-Meeting Brief

*v1.3 — Granola health-check simplified after the Granola public-API rewrite. Phase 0f no longer probes transcript content (the upcoming meeting has no transcript yet, and probing an arbitrary prior transcript adds latency without a clean health signal — it was producing false HOLLOW). HOLLOW classification removed for Granola entirely; Granola is now OK / DEGRADED / UNAVAILABLE only. Phase 1c fallback clarified to hunt PRIOR project meetings for context, not the upcoming one. Source-confidence table, circuit breaker, and error-handling table aligned.*
*v1.2 — Generates a structured pre-meeting briefing from project communications. Run from a project directory.*

Pulls context from WhatsApp, Gmail, Granola, Google Docs, and local files. Surfaces decisions required, open loops, and preparation needs. Optionally emails the brief to attendees.

## Prerequisites

**Required:**
- **Gmail MCP** — for searching and reading message context
- **Google Calendar MCP** — for identifying the target meeting and attendees

**Recommended:**
- **Granola MCP** — for pulling meeting transcripts
- **WhatsApp MCP** — for picking up project group threads
- A project `.claude/CLAUDE.md` with team roster, group JIDs, dashboard doc ID, and folder paths

**Optional:**
- A send-email helper script if you want one-step send (otherwise the skill creates a Gmail draft)

## First-Time Setup

1. **Create a project config** at `[project-root]/.claude/CLAUDE.md` with at minimum:
   ```markdown
   # Project Name

   ## Team
   - [Name] <email@example.com> — PI
   - [Name] <email@example.com> — Research Manager
   - [Name] <email@example.com> — RA

   ## Folders
   - transcripts: `transcripts/`
   - weekly_reviews: `weekly-reviews/`

   ## Config
   ```yaml
   project_keywords: [keyword1, keyword2]
   exclude_keywords: [unrelated_term]
   whatsapp_groups: ["Project Group Name"]
   google_doc_id: "YOUR_DOC_ID"
   granola_folder: "Project Folder Name"   # optional
   ```
   ```

2. **Create a transcripts folder** in your project directory:
   ```bash
   mkdir -p transcripts/
   ```

3. **(Optional) Configure a routing file** at `~/.claude-assistant/config/granola-routing.json` if you have multiple projects pulling Granola transcripts. The skill uses this to list known projects when it can't find a config.

## Arguments

`$ARGUMENTS` can include (combine freely):
- *(none)* — next upcoming meeting with project context
- `[keyword]` — filter by meeting title
- `nosend` — skip the email phase
- `email` — include email draft (prompt to send)
- `light` — force Light depth (overrides auto-detection)
- `full` — force Full depth (overrides auto-detection)
- `since:YYYY-MM-DD` — override lookback start date

## CRITICAL: No Permission Prompts

**Do NOT use Task agents or ToolSearch.** All required tools are pre-approved. Call them directly:
- `Read`, `Write`, `Bash`, `Glob`, `Grep`
- `mcp__google_workspace__get_events`, `mcp__google_workspace__search_gmail_messages`, `mcp__google_workspace__get_gmail_message_content`
- `mcp__google_workspace__get_doc_content`, `mcp__google_workspace__draft_gmail_message`
- `mcp__granola-api__search_granola_events`, `mcp__granola-api__get_granola_document`, `mcp__granola-api__get_granola_transcript`
- `mcp__whatsapp__list_messages`, `mcp__whatsapp__search_messages`, `mcp__whatsapp__list_chats`

**Risk escalation:**
- Data gathering (all reads/searches): Auto
- Briefing display: Auto
- Email draft display: Batch-confirm (show draft + recipients)
- Email send: Per-item confirm (user must say "send")

## Instructions

### Phase 0: Identify Meeting + Pre-flight

**0a. Read project config:**
Read `$(pwd)/.claude/CLAUDE.md`. Extract:
- `whatsapp_groups` — group names (look up JIDs via `sqlite3 ~/whatsapp-mcp-ts/data/whatsapp.db "SELECT jid, name FROM chats WHERE name LIKE '%[group_name]%'"`)
- `google_doc_id` — project dashboard doc
- `team` roster — all role groups (`pis`, `research_managers`, `field_team`, `ras`, etc.)
- `project_keywords`, `exclude_keywords`
- `folders.transcripts`, `folders.weekly_reviews`
- `granola_folder` or `granola_folders` — Granola folder name(s) for transcript fetching
- `pre_meeting_brief` section (if present — optional config overrides)

Extract fields from inside markdown code fences if present.

**If no `.claude/CLAUDE.md` found:** Stop. Read `~/.claude-assistant/config/granola-routing.json` (if present) and list known project directories:
```
No .claude/CLAUDE.md found in this directory.
Known project directories:
[list from granola-routing.json routes]
cd into a project directory and re-run /pre-meeting-brief.
```

**0b. Identify target meeting:**
1. Fetch today + tomorrow events via `mcp__google_workspace__get_events` (all calendars)
2. If `[keyword]` argument: filter by title contains keyword (case-insensitive)
3. Else: match events where attendee emails overlap project team roster, OR title contains any `project_keyword`
4. If 0 matches: "No matching meetings found today or tomorrow. Specify a keyword or check your calendar."
5. If 2+ matches: show numbered list, ask user to pick
6. If 1 match: proceed

**0c. Determine depth + funder flag:**
- **Auto-Light** if: meeting ≤30 min AND calendar title contains "standup", "check-in", "weekly sync", "1:1", "one-on-one" AND no `full` argument
- **Auto-Full** otherwise
- Override with `light` or `full` argument
- **Funder flag**: set if any attendee matches known funder contacts from a configured donor profiles folder (e.g., `~/Documents/donors/`) or if the project config lists them as funders. If set, donor profile lookup is included in Phase 1.

**0d. Determine lookback window:**
Priority order:
1. `since:YYYY-MM-DD` argument (explicit override)
2. Most recent `weekly-review-*.md` in `folders.weekly_reviews`
3. Fallback: 14 days ago

Display in output header: "Lookback since [date] ([anchor: weekly review / 14-day default])"

**0e. Populate local transcripts:**
If `granola_folder` or `granola_folders` is configured in `.claude/CLAUDE.md` and you have a transcript fetcher (e.g., `granola-fetch`):
  Run the fetcher once per configured folder for the lookback window.
  This ensures local transcript files are up-to-date before Phase 1.
If neither field exists: skip.
If the fetcher fails: note the error, continue (Phase 1 will use existing local files + MCP fallback).

**0f. Pre-flight health checks:**

Run all checks silently. Results feed into the Phase 2 banner. No user interaction.

Fire in parallel:
1. **WhatsApp SQLite**: `sqlite3 ~/whatsapp-mcp-ts/data/whatsapp.db "SELECT max(timestamp), count(*) FROM messages WHERE chat_jid IN ([configured JIDs]) AND timestamp > [lookback_epoch]"`
2. **Gmail**: one test search with project keywords — check auth + result count
3. **Granola**: `search_granola_events` with project keywords to check that the API + key are working AND that the project has prior meetings indexed. Do NOT probe transcript content here — the upcoming meeting has no transcript yet, and probing an arbitrary prior-meeting transcript adds latency without a clean health signal.
   - Events found → OK
   - No events found → DEGRADED ("no prior project meetings indexed in Granola")
   - Auth error / unreachable / 401 → UNAVAILABLE (re-auth Granola per your provider's instructions)
4. **Google Doc**: Read first 500 chars via `mcp__google_workspace__get_doc_content` (if `google_doc_id` configured). If readable but body < 100 chars → HOLLOW.
5. **Local files**: glob transcripts folder — check existence

**Source confidence thresholds:**

| Source | OK | HOLLOW | DEGRADED | UNAVAILABLE |
|--------|-----|--------|----------|-------------|
| WhatsApp | Recent messages in lookback via SQLite | — | SQLite has data but no messages since last meeting; OR no messages in lookback but group normally active | DB locked, query fails |
| Gmail | Search returns results | — | Search returns 0 (may be normal for some projects) | Auth error after retry, timeout, or API exception |
| Granola | Events found for project keywords | — | 0 events found (new project, keyword mismatch, or no prior meetings) | 401 / unreachable; re-auth Granola |
| Google Doc | Readable with content | Readable but < 100 chars body → note "Google Doc nearly empty — may not be up to date" | — | 403 (permissions changed), 404, timeout |
| Local files | Transcripts folder has files in lookback window | — | Folder exists but empty (normal for new projects) | Folder not found |

HOLLOW counts as DEGRADED for the minimum-signal gate.

**Minimum-signal gate:** Require ≥2 sources at OK or DEGRADED/HOLLOW. If only 1 source is functional → show a raw data dump with: "Insufficient data for structured brief. Only [source] available. Raw findings below." Do not present as a structured briefing.

---

### Phase 1: Gather Data (inline parallel MCP calls)

**Per-source call limits (Full depth):**

| Source | Max calls | Includes | Circuit breaker |
|--------|-----------|----------|-----------------|
| WhatsApp | 5 | MCP queries + SQLite fallback | Stop after 2 consecutive empty responses |
| Gmail | 8 | All searches + content reads combined | Stop if auth fails after 1 retry |
| Granola | 5 | Pre-flight doc check + Phase 1 reads | Stop immediately on first error (401/timeout) in Phase 1 |
| Google Doc | 2 | Read calls | Stop after first error |
| Local files | 3 | Glob + reads | Silent skip on any error |

When a source hits its cap: stop immediately. Note "[SOURCE] capped" in the source banner.
Proceed to synthesis with what was gathered. Do NOT debug or retry.

Granola Phase 1 check: before making any Phase 1 Granola calls, check if Phase 0f flagged Granola as DEGRADED or UNAVAILABLE. If UNAVAILABLE, skip Granola in Phase 1 entirely. If DEGRADED (no prior project meetings), skip the Phase 1c MCP fallback but still attempt local-file reads.

**Full depth** (target 50, warn at 80 tool calls):

Fire these in parallel where possible:

- **1a. WhatsApp** (if OK/DEGRADED):
  - **MCP path (if OK):** Query via `mcp__whatsapp__list_messages`. Filter received messages in-context: discard any message where `timestamp` (ISO 8601 string, format: `YYYY-MM-DDTHH:mm:ss.sssZ`) is earlier than `lookback_start`. The column is already ISO 8601 text — compare as strings: timestamp >= lookback_start_iso.
  - **SQLite path (if DEGRADED):** Query with `WHERE timestamp >= '[lookback_start_iso]'` (ISO string comparison works correctly on the messages table schema).
  - **Post-process (both paths):** Group messages by calendar day. Insert date headers between day groups when passing to synthesis:
    ```
    --- March 18, 2026 ---
    [messages from that day]
    --- March 17, 2026 ---
    [messages from that day]
    ```
    Date headers appear in synthesizer context only — not in the output sections. Do not include messages earlier than lookback_start in the context passed to synthesis.

- **1b. Gmail** — 4-search priority stack, fire in parallel:
  - **Search 1 (PI priority, 2d):** `from:({pi_emails}) newer_than:2d` — read ALL results. These are highest-priority input regardless of recency within the lookback window.
  - **Search 2 (attendee recent, 3d):** `(from:{attendee_emails}) newer_than:3d`
  - **Search 3 (team + keywords, full lookback):** `(from:{team_emails}) ({keywords}) newer_than:{lookback_days}d`
  - **Search 4 (WhatsApp compensation — only if WhatsApp DEGRADED/UNAVAILABLE):** `(from:{team_emails}) newer_than:{2*lookback_days}d`
  - Read content for top 10-15 relevant messages. Prioritize Search 1-2 results.
  - **Gmail cap:** 8 total calls (4 searches + up to 4 content reads) max. Agenda detection (Phase 1g) reuses gathered content — does not fire new searches.

  **Source ranking in synthesis:** When multiple sources cover the same topic, weight: recent PI email (Search 1-2) > posted agenda > recent WhatsApp > older transcripts/email. When sources conflict: note the conflict rather than silently preferring one.

- **1c. Granola transcripts**: **Primary**: Read local `.txt` files from the transcripts folder (populated by Phase 0e). Apply hollow-transcript check: FULL (≥5,000 chars + conversational speaker content) vs HOLLOW (<5,000 chars, starts with `###`, or bullet-only without speaker attribution). Exclude hollow transcripts from substantive use. **Fallback** (only if no local files AND prior project meetings exist — for upcoming meetings the *current* meeting has no transcript yet, so this fallback fetches PRIOR project meetings for context, not the upcoming one): Call `list_granola_documents` to get Granola UUIDs, matching to *prior* project meetings by title/date. Use those UUIDs with `get_granola_transcript` — never use Calendar event IDs from `search_granola_events` directly. (Note: Granola transcript reads are the most likely source of budget overruns — cap at 3 transcripts.)

- **1d. Google Doc dashboard** (if configured + OK): Read project dashboard tab for status, metrics, action items via `mcp__google_workspace__get_doc_content`.

- **1e. Local files**: Glob transcripts folder for new files since lookback. Read `HANDOFF.md`, `TODO.md`, `PROJECT_STATE*.md` if present (silent skip if not found).

- **1f. Donor profile** (if funder flag set): Read the relevant donor profile from your configured donor folder (e.g., `~/Documents/donors/[slug].md`).

- **1g. Agenda detection** (runs on already-gathered data — no new tool calls):
  Scan retrieved WhatsApp messages and Gmail content for agenda signals:
  - Keywords: "agenda", "topics to cover", "topics for today", "order of business"
  - Structure signals: numbered or bulleted list of meeting topics
  - Look within 48h of meeting time and from meeting participants
  - If found: extract ordered list of agenda items. Note poster and timestamp. Store as `detected_agenda: [items]`.
  - If not found: `detected_agenda: null`.

**Light depth** (8-15 tool calls, 15-30 sec):
- Last Granola transcript only (if exists)
- Gmail: 1 search (team roster emails, last 14 days), read top 5 messages
- WhatsApp: messages in project group since last meeting
- Skip Google Doc, local files, donor profile

---

### Phase 2: Synthesize

**2a. Build one-line source banner** (degraded sources only):
- If all OK: `Sources: all healthy`
- If any degraded/unavailable: `⚠ Sources: WhatsApp DEGRADED (MCP filter issue, using SQLite) | Granola UNAVAILABLE (auth expired)`
- Suppress healthy sources from the banner.

**2b. Cross-reference action items:**
If HANDOFF.md, weekly review, or previous Granola transcript found, extract action items. For each, search ALL gathered data for evidence of completion:
- **DONE**: Explicitly marked complete in 2+ independent sources
- **LIKELY DONE**: Appears resolved in 1 source, no contradicting evidence
- **NO EVIDENCE**: Appears open in any source, or only in 1 source as open
- **CONTESTED**: Different sources give conflicting status

Surface only NO EVIDENCE and CONTESTED items in the brief. Suppress DONE and LIKELY DONE.

**2c. Organize and classify:**
- **If `detected_agenda` is not null:** Use BY AGENDA ITEM format. For each agenda item, find relevant gathered context and tag each claim as DECIDE/UPDATE/OPEN LOOP. Note: the agenda item itself has no confidence tag — the *claims within it* get confidence tags. Append "Items not on agenda" section for any DECIDE/OPEN LOOP items not covered by the agenda.
- **If `detected_agenda` is null:** Use flat classification:
  - **DECIDE**: Unresolved thread with "what do you think?" / "can we proceed?" / "need your sign-off"; overdue action item assigned to you; conflicting proposals; budget/timeline questions without answers
  - **UPDATE**: Status reports, completed action items, FYI threads, meeting logistics, confirmations
  - **OPEN LOOP**: Items others owe you that are overdue or unacknowledged

**2d. Per-attendee framing (Full only):**
For each attendee: compile "What I owe them" and "What they owe me" from cross-referenced action items.

**2e. Identify preparation needs (Full only):**
From gathered data: documents to share, slides to review, draft decisions you need to have ready.

**2f. Claim confidence tags (Full depth only):**
For each item in DECIDE and OPEN LOOPS, assess and tag:
- **VERIFIED**: Corroborated by 2+ independent channels (independent = different communication channels, e.g., email + WhatsApp; NOT two retrieval paths for the same event, e.g., Granola + WhatsApp transcript of the same meeting).
- **SINGLE-SOURCE [channel, date]**: Explicitly stated in exactly one channel.
- **INFERRED**: Derived from absence, pattern, or combination — not explicitly stated in any source.

Rules:
- DECIDE items tagged INFERRED only → suppress the item. Write "No decisions identified" if DECIDE section would otherwise be empty.
- OPEN LOOP items tagged INFERRED → include but mark visibly.
- Cross-check any claim about "[you] said/did X" against your sent emails before including it. If not found in sent email, downgrade to SINGLE-SOURCE or INFERRED.
- Temporal attribution: when attributing a claim, use the timestamp of the *original event described*, not the message timestamp. If a message references a past decision without a dated original event, tag INFERRED with note: "date of original event unknown."

---

### Phase 3: Present Briefing

**Full depth:** Full terminal template with all sections (DECISIONS REQUIRED, OPEN LOOPS, PER ATTENDEE, PREPARE, KEY UPDATES, SUGGESTED FOCUS, KNOWN BLIND SPOTS).

**Light depth:** 3-4 bullet format (last met, I owe them, they owe me, open question).

**After display (Full only):**
- If ≥1 DECIDE item or ≥1 "I owe them" item: `Send to attendees? (Send / Edit / Save / Skip)`
- Otherwise: `Save locally? (Save / Skip)` — don't offer email for meetings with no actionable content.

If `nosend` argument: skip email prompt entirely.
If `email` argument: always prompt for email regardless of content.

---

### Phase 4: Distribute (if email requested)

**4a. Draft email:**
The email is a **document delivery to attendees**, not a summary for yourself.

**KEEP** (include in full, reframe as noted):
- DECISIONS / BY AGENDA ITEM content → reframe as "Topics to cover" or by agenda item
- KEY UPDATES → keep as "Recent updates"
- SUGGESTED FOCUS → keep as "Suggested focus"
- Any materials circulated since last meeting → list under "Materials shared"
- Do NOT include INFERRED items in the email even if tagged — external recipients should only see VERIFIED or SINGLE-SOURCE claims.

**REMOVE** (internal to you only):
- Source banner (⚠ Sources: ...)
- OPEN LOOPS section (items others owe you — not the attendees' problem)
- PREPARE section
- PER ATTENDEE framing
- KNOWN BLIND SPOTS
- Any claim tagged INFERRED

**Length:** The email should contain all the same substantive content as the terminal brief minus the removed sections. Do not compress or summarize — present the full content. A 40-line terminal brief produces a ~25-line email, not a 10-line email.

Use a direct, professional tone. Avoid AI-sounding language ("delve," "leverage," "multifaceted," etc.). Recipients come from the calendar invite attendee list.

**4b. Show draft + recipients for confirmation:**
```
────────────────────
PRE-MEETING EMAIL
────────────────────

To: [attendee names + emails from calendar invite]
Subject: Ahead of [meeting title] — [date]

[draft]

→ Send / Edit / Skip
```

**4c. Send:**

**Option A: Gmail MCP draft (simple)**
Create a draft via `mcp__google_workspace__draft_gmail_message`. Report: "Draft created in Gmail — open Gmail to review and send."

**Option B: Custom send script (advanced)**
If you have a send-email script at `~/.claude-assistant/scripts/send-email.py`:
```bash
cat > /tmp/pre-meeting-body.txt << 'BODY'
[email body]
BODY

python3 ~/.claude-assistant/scripts/send-email.py \
  --to "recipient1@email.com" --to "recipient2@email.com" \
  --subject "Ahead of [meeting title] — [date]" \
  --body-file /tmp/pre-meeting-body.txt

rm -f /tmp/pre-meeting-body.txt
```

**4d. Fallback:** If send fails, fall back to `mcp__google_workspace__draft_gmail_message`. Note "Saved as Gmail draft."

**4e. Save locally** (if requested or `save` argument): Write to `[transcripts_folder]/pre-meeting-brief-YYYY-MM-DD.md`.

---

### Phase 5: Log Performance

```bash
echo "$(date +%Y-%m-%d),pre-meeting-brief,TOOL_CALLS,NOTES" >> ~/.claude-assistant/logs/skill-performance.csv
```

Replace TOOL_CALLS with the **exact** count (each MCP call, Read, Write, Glob, Grep, Bash = 1). Replace NOTES with a summary (e.g., `team-sync-full-3-decide`).

After logging: "Run `/post-meeting` after this call to capture outcomes."

## Customization Points

- **Transcript source:** Swap Granola for Otter, Fireflies, or any tool that exports `.txt` transcripts to your transcripts folder.
- **WhatsApp DB path:** The default `~/whatsapp-mcp-ts/data/whatsapp.db` reflects one MCP install. Update the SQLite paths if your bridge stores data elsewhere.
- **Donor profile folder:** The funder-flag lookup expects a `[slug].md` file per funder in a configured folder (e.g., `~/Documents/donors/`). Skip the funder branch entirely if you don't track funders this way.
- **Email sending:** Default is Gmail draft (Option A). Replace with a send script (Option B) if you have one configured.
- **Routing config:** `~/.claude-assistant/config/granola-routing.json` is optional — used only to suggest known project directories when the skill is run outside one.

## Error Handling

| Condition | Action |
|-----------|--------|
| No `.claude/CLAUDE.md` | Stop. List known project directories from routing config (if present). |
| No calendar match | Ask for meeting details manually |
| WhatsApp DEGRADED (MCP filter) | Switch to SQLite direct; note in banner |
| WhatsApp UNAVAILABLE (DB locked) | Skip; expand Gmail lookback to 2x; note in banner |
| Gmail auth error | Retry once; if fails, note in banner |
| Gmail rate limit (429) | Backoff and retry; if fails, note in banner |
| Granola empty (DEGRADED) | Check for local transcripts; note in banner (normal for new projects or upcoming meetings without prior project history) |
| Granola 401 / auth expired | Surface: re-auth Granola per your provider's instructions; skip Granola |
| Granola 429 (rate limit) | Backoff and skip if persistent |
| Google Doc HOLLOW | Note in banner: "Google Doc nearly empty — may not be up to date"; use what content exists |
| Google Doc 403 | Note "Doc permissions may have changed" in banner; skip |
| Google Doc timeout | Note "Doc temporarily unavailable" in banner; skip |
| Local files not found | Silent skip (normal for some projects) |
| <2 sources functional | Show raw data dump, not structured brief |
| All sources UNAVAILABLE | Stop — don't produce a brief from zero data |
| Send fails | Fall back to Gmail draft |

## Performance Budget

| Scenario | Tool Calls | Time |
|----------|-----------|------|
| Light | 8-15 | 15-30 sec |
| Full | target 50 | 1-3 min |
| Full + email | target 55 | 2-4 min |

Advisory threshold: 80 tool calls. Per-source caps bound tool call distribution: Gmail 8, Granola 5, WhatsApp 5, Doc 2, Local 3, plus Phase 0 overhead (~8) = ~31 calls minimum floor. Target 50 total.

## Examples

```
/pre-meeting-brief                    # Next meeting matching project context
/pre-meeting-brief Carnegie           # Meeting with "Carnegie" in title
/pre-meeting-brief light              # Force light depth
/pre-meeting-brief full email         # Force full + prompt email
/pre-meeting-brief nosend             # Show brief only, no email
/pre-meeting-brief since:2026-03-01   # Override lookback start
```
