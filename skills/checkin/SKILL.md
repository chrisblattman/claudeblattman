---
name: checkin
description: "Run an interactive daily check-in covering inbox, reminders, meeting preparation and priorities. Requires configured mail and calendar connections."
---

# Check-In Session

*v1.4 — Hardened Phase 0.5 triage: enforcement contract, explicit steps, auth fallback*

Interactive check-in with Claude as chief of staff. Combines inbox triage, reminder triage, meeting prep, email quick-fire drafting, and priority management. Time-aware — works for morning, afternoon, or evening runs.

> **This is an interactive skill.** A full session takes 10-15 minutes. Try `/checkin quick` first for a 30-second status view.

## Prerequisites

This skill requires several MCP integrations and config files. Missing components degrade gracefully (phases are skipped, not errors).

**Required:**
- **Gmail MCP** — for inbox scanning, email drafting, triage
- **Google Calendar MCP** — for today's schedule and meeting prep

**Recommended:**
- `/triage-inbox` skill — for inbox triage phase (without it, triage is skipped)
- Config files (see First-Time Setup below):
  - `~/.claude-assistant/config/email-policy.md` — VIP lists, email routing rules
  - `~/.claude-assistant/config/calendar-policy.md` — calendar IDs, working hours
  - `~/.claude-assistant/config/triage-config.md` — label IDs, classification rules
  - `~/.claude-assistant/config/goals.yaml` — objectives for goal alignment

**Optional:**
- **Granola MCP** — for meeting context from past transcripts
- **Apple Reminders** (macOS only) — for reminder triage phase

## First-Time Setup

1. **Create config directory:**
   ```bash
   mkdir -p ~/.claude-assistant/config
   mkdir -p ~/.claude-assistant/state
   mkdir -p ~/.claude-assistant/logs
   ```

2. **Install config files** (if not already installed via `/triage-inbox` or `/morning-brief`):
   ```bash
   curl -o ~/.claude-assistant/config/email-policy.md \
     https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/email-policy-template.md
   curl -o ~/.claude-assistant/config/calendar-policy.md \
     https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/calendar-policy-template.md
   curl -o ~/.claude-assistant/config/triage-config.md \
     https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/triage-config-template.md
   curl -o ~/.claude-assistant/config/goals.yaml \
     https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/goals-yaml-template.yaml
   ```

3. **Edit config files** with your email address, calendar IDs, VIP contacts, and objectives.

4. **Test with a quick run:**
   ```
   /checkin quick
   ```

## Customization Points

| Setting | Where to Configure | Default |
|---------|-------------------|---------|
| **VIP list** | `email-policy.md` > VIP List | No VIP highlighting |
| **Calendar IDs** | `calendar-policy.md` > Calendars | Primary only |
| **Working hours** | `calendar-policy.md` > Working Hours | 8am-6pm |
| **Goal alignment** | `goals.yaml` > objectives | Section omitted |
| **Push level** | `goals.yaml` > meta.push_level | `moderate` |
| **Auto-triage** | Requires `/triage-inbox` + `triage-config.md` | Skipped |
| **Reminders** | Requires macOS (osascript) | Phase skipped |
| **Meeting context** | Requires Granola MCP | Gmail-only context |
| **Email sending** | See Phase 4 options | Gmail draft (Option A) |
| **Email quick-fire cap** | Phase 4 | 10 emails |
| **Meeting prep cap** | Phase 3 | 3 meetings |

## MANDATORY: Phase Execution Order

**Execute phases sequentially. Do NOT skip any phase unless its skip-argument is set. Do NOT jump ahead based on user phrasing like "focus on email" — that adjusts emphasis within phases, not which phases run. Complete each phase before starting the next.**

```
Phase 0   -> Data fetch (always runs)
Phase 0.5 -> Triage (skip if `no-triage` or `tomorrow`)
Phase 1   -> Status display (always runs — includes phase completion checklist)
Phase 2   -> Reminders (skip if `no-reminders`, `quick`, or `tomorrow`)
Phase 3   -> Meeting prep (skip if `no-prep`, `quick`, or `tomorrow`)
Phase 4   -> Email quick-fire (skip if `no-email`, `quick`, or `tomorrow`)
Phase 5   -> Priorities (always runs)
Phase 6   -> Save state (always runs — even with `quick` or `tomorrow`)
Phase 7   -> Log performance (always runs — even with `quick` or `tomorrow`)
```

User arguments like "focus on email" control **depth and emphasis** within phases. The skip-arguments above are the only way to skip a phase.

> **TRIAGE ENFORCEMENT** — Phase 0.5 must produce a triage summary with counts
> derived from actual tool output before Phase 1 can start. If `no-triage` is set,
> record "Triage: skipped (no-triage flag)". If auth is unavailable, record
> "Triage: skipped (auth unavailable)". Do not fabricate triage counts.

## Arguments

`$ARGUMENTS` can include (combine freely):
- *(none)* — full interactive session (triage + reminders + prep + email + priorities)
- `quick` — status + priorities only (no interaction, still runs triage)
- `no-email` — skip Phase 4 (email quick-fire)
- `no-reminders` — skip Phase 2 (reminder triage)
- `no-prep` — skip Phase 3 (meeting prep)
- `no-triage` — skip inbox triage (Phase 0.5)
- `tomorrow` — preview tomorrow's schedule (skip interactive phases)

## Instructions

### Phase 0: Pre-Compute All Data (one batch, no interaction)

**This entire phase runs before any output to the user.** Front-load all slow MCP calls.

**0a. Read config files:**

Read all available config files. Missing files are not errors — skip the corresponding sections.

1. `~/.claude-assistant/config/email-policy.md` — VIP lists, email routing rules
2. `~/.claude-assistant/config/calendar-policy.md` — calendar IDs, working hours, timezone
3. `~/.claude-assistant/config/triage-config.md` — label IDs, classification rules
4. `~/.claude-assistant/config/goals.yaml` — objectives, push_level, priorities

**0b. Fetch calendar and email data (parallel MCP calls):**

Run these in parallel:
- **Calendar:** `mcp__google_workspace__get_events` for today (all configured calendar IDs)
- **Calendar lookahead:** Tomorrow's events (or weekend on Fridays)
- **Inbox unread:** `mcp__google_workspace__search_gmail_messages` with `in:inbox is:unread`
- **VIP emails:** Search for unread emails from VIP senders (build query from email-policy.md)

Deduplicate calendar events, filter declined events, sort by start time.

**0c. Determine time context:**
```
session_time = current local time
if before 12pm -> period = "morning"
if 12pm-5pm   -> period = "afternoon"
if after 5pm  -> period = "evening"

hours_remaining = max(0, 18:00 - session_time)
schedule_start  = morning ? 08:00 : session_time (rounded to current hour)
schedule_end    = 23:59 (fetch full day, filter in display)
```
Use system local time.

**0d. Pre-classify emails for Phase 4:**
Using fetched email contents, classify each:
- **Auto-draft** (routine): scheduling confirmations, acknowledgments, simple requests
- **Suggest approach** (substantive): collaborator discussions, important correspondence
- **Skip** (no response needed): newsletters, notifications, FYI-only

**0e. Meeting prep context (next 4 hours, max 3 meetings):**
- Extract primary attendee (exclude your own addresses, room resources)
- Search Gmail: `(from:{attendee} OR to:{attendee}) newer_than:14d`
- Search Granola (if available): `mcp__granola__search_meetings` with attendee name
- Cap: 3 meetings, 2 searches per meeting

**0f. Compute priorities + goal alignment:**
- Read goals.yaml objectives and weights
- Calculate `free_hours` = schedule_start to end of working hours minus meeting time
- **Goal-alignment scoring:**
  1. For each active objective (weight > 0), check if any meeting today advances it (keyword match on meeting title/attendees vs objective name/key_results)
  2. `aligned_weight` = sum of weights for objectives with at least one aligned meeting
  3. `alignment_pct` = aligned_weight / total_active_weight x 100
  4. `unrepresented` = list of objectives with weight >= 0.15 and NO aligned meeting today
- **Writing hours check:**
  1. Find the `writing-hours` key_result (target: 6+ hrs/week = ~1.2 hrs/day)
  2. `available_writing_blocks` = free blocks >= 45 min not immediately before/after meetings
  3. `writing_hours_today` = sum of available_writing_blocks (in hours)
  4. `writing_on_track` = true if writing_hours_today >= 1.0
- **Stalled goal detection:**
  1. Flag any key_result where `at_risk: true` AND `progress: 0.0`
  2. Flag any objective with `weight >= 0.20` and ALL key_results at `progress: 0.0`
- Identify top 3 priorities for rest of day (weighted by goal urgency + deadlines)

---

### Phase 0.5: Inbox Triage

**A. Check skip conditions first.**
- If `no-triage` or `tomorrow` argument: record "Triage: skipped ({reason})" -> jump to Phase 1.
- Otherwise: complete all steps below before proceeding to Phase 1.

**B. Execute triage.**
If `/triage-inbox` skill is installed and `triage-config.md` exists, execute inline triage:
1. Search for unread inbox emails within the adaptive triage window
2. Classify using `/triage-inbox` logic (VIP safety check, expense detection, classification scoring)
3. Apply labels via Gmail MCP
4. Update `~/.claude-assistant/state/triage-run-state.json`

**Adaptive window:** Read `last_run` from triage-run-state.json. If < 12 hours ago, use `hours_since_last + 2` hours. If >= 12 hours, use 48 hours. Default: 2 days.

If `/triage-inbox` is not installed or triage-config.md is missing, skip and report: "Triage skipped — install `/triage-inbox` for auto-triage."

If auth is completely unavailable: record "Triage: skipped (auth unavailable — reauth needed)" -> proceed to Phase 1.

**C. Verify before continuing.**
You must have a triage summary with counts from actual tool output (not assumed):
- emails_scanned, emails_triaged, emails_archived, emails_skipped
- student_replies_sent (may be 0 — but the count must exist)
- If all deduped: "Triage: 0 new — N already processed"

Phase 1 MUST display these counts. Do not start Phase 1 until this step is complete.

---

### Phase 1: Quick Status (30 seconds, display only)

**Phase completion checklist (MUST appear first):**
Before any other output, display which phases completed. Source triage counts from actual results, not memory:
```
Phases: check Data Fetch | check Triage ([N] processed) | Status | Reminders | Prep | Email | Priorities
                      -- or --
Phases: check Data Fetch | x Triage (skipped: no-triage) | Status | ...
```
Remaining phases show as unchecked (they haven't run yet). This line is the user's verification that mandatory phases actually executed.

**Time-aware header:**

```
# Check-In -- [Day], [Month] [Date] ([period]: [time])

[If morning:]
Today: [N] meetings | [N] hours free (8am-6pm)
[If afternoon:]
Remaining: [N] meetings | [N] hours free (now-6pm)
  Completed: [N] meetings so far today
[If evening:]
Tomorrow Preview -- [N] meetings scheduled

Inbox: [N] unread ([M] VIP awaiting reply)
Reminders: [N] due today | [N] overdue
[If triage ran:] Triaged [N] emails ([M] archived, [K] labeled)

Goal alignment: [alignment_pct]% -- meetings advance [list aligned objectives]
[If unrepresented:] !! No time today for: [unrepresented objectives with weights]
[If stalled goals exist:] !! Stalled: [list at_risk key_results at 0% progress]
Writing time: [writing_hours_today] hrs available [check on track / !! below 1hr target]
```

If `quick` argument: show Phase 1 + Phase 5 only, then proceed to Phase 6 (save state) and Phase 7 (log performance).

---

### Phase 2: Reminder Triage (2-3 min, interactive)

**Skip if `no-reminders` argument or non-macOS.**

**Display all reminders grouped by urgency:**
```
--------------------
REMINDER TRIAGE
--------------------

HARD DEADLINES (external consequences)
  1. [Work] Submit grant report (2 days overdue) !!
  2. [Work] IRB amendment due (due tomorrow) !!

DUE TODAY
  3. [Work] Review draft (due 5pm)
  4. [Personal] Dentist appointment (2:30pm)

COMING UP (next 3 days)
  5. [Work] Respond to editor (due Wed)

For each: Keep / Reschedule to [date] / Done / Delegate to [person]
Batch: "keep all", "defer 1,3,5 to Friday", "done 4"
```

**BATCHED EXECUTION — collect all decisions first, apply at end:**

1. **Collect phase** (pure interaction, zero tool calls): Present reminders and accept ALL commands. Accumulate a list of pending actions (e.g., `[{action: "done", items: [4]}, {action: "defer", items: [1,3,5], date: "Friday"}]`). Continue collecting until user says "done", "that's it", "next", or similar.

2. **Apply phase** (one batch, after all decisions collected): Execute all accumulated actions via osascript in a single Bash call. Build a multi-command osascript that processes all modifications together:
   - Completions: `tell application "Reminders" to set completed of reminder "X" in list "Y" to true`
   - Reschedules: set both due date and remind-me date by constructing from date components
   - Group all osascript commands into one `osascript -e '...'` invocation where possible

3. **Confirm:** Report what was applied: "Applied: 3 done, 2 deferred to Friday"

---

### Phase 3: Meeting Prep (2-3 min per key meeting, interactive)

**Skip if `no-prep` argument.**

For each meeting in the next 4 hours (max 3):

```
--------------------
MEETING PREP: [Event title] ([time])
--------------------

Attendees: [names]
Last met: [date] -- discussed [topic summary]
They're waiting on: [action item from you, if any]
Recent email context: [1-line summary]
```

If no context found:
```
Attendees: [names]
New contact or infrequent interaction.
```

---

### Phase 4: Email Quick-Fire (3-5 min, interactive)

**Skip if `no-email` argument.**

```
--------------------
EMAIL QUICK-FIRE ([N] items)
--------------------

ROUTINE (pre-drafted):
  1. To: [name] | Re: [subject]
     Draft: "[response]"
     -> Send / Edit / Skip

SUBSTANTIVE (needs input):
  4. From: [name] | Re: [subject]
     Summary: [1-line]
     Approach: Draft response? / Skip / Handle manually
```

**BATCHED EXECUTION — collect all decisions first, send at end:**

1. **Collect phase** (pure interaction, zero tool calls): Present all emails and accept Send/Edit/Skip decisions for each. For edits, revise the draft text in conversation. Accumulate a send queue. Continue until all items are decided or user says "done"/"next".

2. **Send phase** (batch, after all decisions collected):

   **Option A: Gmail MCP Draft (simple)**
   For each approved email, create a Gmail draft:
   ```
   mcp__google_workspace__draft_gmail_message
     user_google_email: your-email@gmail.com
     to: [recipient]
     subject: "[subject]"
     body: "[body]"
     thread_id: [thread_id]
   ```
   Report: "Created [N] drafts in Gmail — review and send from Gmail."

   **Option B: Custom send script (advanced)**
   If you have a send-email script at `~/.claude-assistant/scripts/send-email.py`:
   ```bash
   python3 ~/.claude-assistant/scripts/send-email.py \
     --to [recipient] --subject "[subject]" --body "[body]" \
     --thread-id [id] --in-reply-to [msg-id]
   ```
   Run sends sequentially (not parallel) to avoid race conditions on thread replies.

3. **Mark as read:** After all sends complete, mark the original inbound messages as read (remove UNREAD label) for every thread where a reply was sent. Use `mcp__google_workspace__batch_modify_gmail_message_labels` to remove the UNREAD label. This prevents replied-to threads from inflating the unread count.

4. **Confirm:** Report batch results: "Sent: 3 emails. Skipped: 2. Failed: 0." (or "Created: 3 drafts" for Option A)

**CRITICAL:** Never send without user saying "Send" or approving. The collect phase is the approval gate — no emails leave until each one is reviewed.

**Why batched:** Each send takes ~2s. Batching at the end means the interactive decision-making phase has zero tool-call latency — you can rapid-fire approve/skip decisions without waiting.

---

### Phase 5: Priorities (1 min, display only)

**Time-aware priorities:**

```
--------------------
[If morning:] TODAY'S PRIORITIES
[If afternoon:] REST-OF-DAY PRIORITIES
--------------------

1. [Top priority]
2. [Second priority]
3. [Third priority]

[If morning:] Best research window: [time]-[time] ([N] hrs)
[If afternoon:] Next free block: [time]-[time] ([N] hrs)
  -> Suggested focus: [specific next step on highest-weight objective]

[If stalled at-risk goals exist:]
!! AT-RISK GOALS (0% progress, flagged in goals.yaml):
  - [goal name]: [key_result description] -- Suggested next step: [specific action]

[If push_level >= moderate:]
Deep work score this week: [N]/5 days with 2+ hrs research time
[If writing_on_track is false:] !! Writing hours below target -- consider protecting [largest free block] for writing

[If push_level >= assertive AND unrepresented high-weight goals:]
Calendar misalignment: [objective] has [weight]% weight but zero calendar time today.
   Consider: [specific scheduling suggestion]

Anything to add or change? Otherwise, have a great [period].
```

---

### Phase 6: Save Session State

Update `~/.claude-assistant/state/checkin-state.json`:

```json
{
  "schema_version": 1,
  "last_run": "2026-02-18T08:30:00",
  "sessions": [
    {
      "date": "2026-02-18",
      "period": "morning",
      "reminders_triaged": 5,
      "emails_drafted": 3,
      "emails_sent": 2,
      "emails_skipped": 1,
      "meetings_prepped": 2,
      "triage_summary": {
        "scanned": 12,
        "archived": 4,
        "labeled": 3,
        "skipped": 5
      }
    }
  ],
  "learned_patterns": {
    "always_send": [],
    "always_skip": [],
    "notes": []
  }
}
```

Prune sessions older than 30 days. After 5+ sessions where the user always approves a pattern, add to `learned_patterns.always_send`.

### Phase 7: Log Performance

```bash
echo "$(date +%Y-%m-%d),checkin,TOOL_CALLS,NOTES" >> ~/.claude-assistant/logs/skill-performance.csv
```

Replace TOOL_CALLS with approximate count and NOTES with brief summary.

## Error Handling

- **Gmail MCP unavailable:** Skip Phases 0.5 and 4, report "Gmail unavailable"
- **Calendar MCP unavailable:** Skip meeting prep context, report "Calendar unavailable"
- **osascript fails:** Skip Phase 2, report "Reminders unavailable"
- **Granola unavailable:** Skip meeting history lookups
- **Email send fails:** Save draft to Gmail via `draft_gmail_message`
- **checkin-state.json missing:** Initialize fresh state file

## Integration Notes

- **Morning-brief** remains for passive scheduled reports. `/checkin` is the active interactive triage.
- **Triage logic** is shared with `/triage-inbox` — both use the same `triage-config.md` and `email-policy.md`. Install `/triage-inbox` for the triage phase to work.
- **Email drafting** uses Gmail MCP (Option A) or a custom send script (Option B).
- **Goal alignment** reads `goals.yaml` — keep this file updated via `/goals-review`.

## Speed Notes

- **Pre-compute everything** in Phase 0 before interaction
- **Parallel MCP calls** wherever possible
- **Cap meeting prep** at 3 meetings, 2 searches per meeting
- **Cap email quick-fire** at 10 emails
- **Adaptive triage window** — repeat runs search fewer emails = faster
- Target: Phase 0 in 60-120 seconds, interactive phases in 5-10 min
