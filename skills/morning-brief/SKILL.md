---
name: morning-brief
description: "Prepare a daily briefing from configured calendar, email, reminders and goals sources."
---

# Morning Briefing

*v1.5 — Unified hard deadline keywords; edge case fixes; structural cleanup*

Generate a comprehensive daily morning briefing combining calendar, reminders, inbox state, weather, meeting context, and optional email triage into a single view.

## Prerequisites

This skill requires several MCP integrations and config files to function fully. Missing components degrade gracefully (sections are omitted, not errors).

**Required:**
- **Gmail MCP** -- for inbox scanning, VIP detection, waiting-for detection
- **Google Calendar MCP** -- for today's schedule and lookahead

**Recommended:**
- Config files (see First-Time Setup below):
  - `~/.claude-assistant/config/email-policy.md` -- VIP lists, email routing rules
  - `~/.claude-assistant/config/calendar-policy.md` -- calendar IDs, working hours, city name
  - `~/.claude-assistant/config/triage-config.md` -- label IDs, vendor domains, classification rules
  - `~/.claude-assistant/config/goals.yaml` -- objectives and priorities for goal alignment

**Optional:**
- **Granola MCP** -- for meeting context from past transcripts
- **Apple Reminders** (macOS only) -- for task/reminder integration
- `/triage-inbox` skill -- for auto-triage phase
- Health check script at `~/.claude-assistant/scripts/check-sync.sh` -- for system health monitoring

## First-Time Setup

1. **Create config directory:**
   ```bash
   mkdir -p ~/.claude-assistant/config
   mkdir -p ~/.claude-assistant/state
   mkdir -p ~/.claude-assistant/logs
   mkdir -p ~/.claude-assistant/scripts
   ```

2. **Create calendar-policy.md** with at minimum:
   ```markdown
   ## Calendars
   - primary (your-email@gmail.com)
   - [add other calendar IDs you want included]

   ## Working Hours
   - 8:00 AM to 6:00 PM

   ## Location
   - City: [Your City]
   - Timezone: [YOUR_TIMEZONE]
   ```

3. **Create email-policy.md** with at minimum:
   ```markdown
   ## VIP List
   ### Tier 1 (respond within 24h)
   - [name] <email@example.com>

   ### Tier 2 (respond within 48h)
   - [name] <email@example.com>

   ## @ToSelf Label
   - Label name: @ToSelf
   - Label ID: <YOUR_LABEL_ID>
   ```

4. **Create goals.yaml** (optional but recommended):
   ```yaml
   push_level: moderate  # gentle | moderate | assertive
   objectives:
     - name: "Example project"
       weight: high
       status: active
       next_step: "Draft section 3"
   ```

5. **Create triage-config.md** if using auto-triage (see `/triage-inbox` for format).

## Customization Points

| Setting | Where to Configure | Default |
|---------|-------------------|---------|
| **Weather city** | `calendar-policy.md` > Location > City | Omitted if not set |
| **Working hours** | `calendar-policy.md` > Working Hours | 8am-6pm (10 hours) |
| **Timezone** | `calendar-policy.md` > Timezone | System timezone |
| **Calendar IDs** | `calendar-policy.md` > Calendars | Primary only |
| **VIP list** | `email-policy.md` > VIP List | No VIP highlighting |
| **Goal alignment** | `goals.yaml` > objectives | Section omitted |
| **Deep work push level** | `goals.yaml` > push_level | `moderate` |
| **Email delivery** | See Phase 7 below | Terminal only |
| **Auto-triage** | Requires `/triage-inbox` + `triage-config.md` | Skipped |
| **Granola meeting context** | Requires Granola MCP | Gmail-only context |
| **Reminders** | Requires macOS (osascript) | Section omitted |
| **Health check** | `~/.claude-assistant/scripts/check-sync.sh` | Skipped if not found |

## Arguments

`$ARGUMENTS` can include:
- *(none)* -- full briefing, terminal output only
- `email` -- also email the briefing (requires email delivery setup)
- `tomorrow` -- show tomorrow's schedule/reminders instead of today
- `no-triage` -- skip the auto-triage phase
- `no-reminders` -- skip the reminders phase (useful on non-macOS)

Multiple arguments can be combined: `email tomorrow`, `no-triage no-reminders`, etc.

## Instructions

### Phase 0: Quick Health Check (< 5 seconds)

If a health check script exists at `~/.claude-assistant/scripts/check-sync.sh`, run it before fetching any data:

```bash
bash ~/.claude-assistant/scripts/check-sync.sh 2>&1
```

**Interpretation:**
- If exit code = 0 (all checks pass): Include a single line at the top of the briefing: `System health: all checks passed`
- If exit code > 0 (any failures): Include a warning block in the briefing header summarizing failures only (omit passing checks). Format:

```
!! System health: [N] issue(s)
  - [failure description 1]
  - [failure description 2]
```

**Never block the briefing on health check results** -- failures are informational only. If the script is not found or fails to run, skip this phase silently and continue to Phase 1.

### Phase 1: Read Config Files

Read available config files. Missing files are not errors -- skip the corresponding sections.

1. Read `~/.claude-assistant/config/email-policy.md` -- extract VIP lists (Tier 1, Tier 2), family addresses, @ToSelf label ID
2. Read `~/.claude-assistant/config/calendar-policy.md` -- extract calendar IDs, working hours, city name, timezone
3. Read `~/.claude-assistant/config/triage-config.md` -- extract label IDs, vendor domains, classification rules (needed only if triage is enabled)
4. Read `~/.claude-assistant/config/goals.yaml` -- extract objectives, push_level, active priorities

If a config file is missing, note it internally and continue. The briefing adapts to available data.

### Phase 2: Calendar Data

Query all configured calendars for today's events (or tomorrow's if `tomorrow` argument).

For each calendar ID in `calendar-policy.md`:
```
mcp__google_workspace__get_events
  calendar_id: [calendar ID]
  time_min: [target date]T00:00:00[YOUR_TIMEZONE]
  time_max: [target date]T23:59:59[YOUR_TIMEZONE]
```

Also fetch lookahead events (tomorrow, or weekend on Fridays):
- On Fridays: fetch Saturday AND Sunday events for "Weekend Preview"
- Other days: fetch next day's events for "Tomorrow Preview"

**Processing:**
- Deduplicate events appearing in multiple calendars (match by start time + title)
- Filter out declined events
- Sort by start time (all-day events first)
- Tag each event with its calendar name

### Phase 3: Reminders (macOS only, skip if `no-reminders`)

Fetch incomplete reminders from Apple Reminders using osascript:

```bash
osascript -e '
tell application "Reminders"
  set output to ""
  repeat with aList in lists
    set listName to name of aList
    repeat with aReminder in (reminders of aList whose completed is false)
      set rName to name of aReminder
      set rDue to ""
      try
        set rDue to due date of aReminder as string
      end try
      set rPri to priority of aReminder
      set output to output & listName & "|" & rName & "|" & rDue & "|" & rPri & "\n"
    end repeat
  end repeat
  return output
end tell'
```

If osascript fails (non-macOS or Reminders not available), skip this phase silently.

### Phase 4: Inbox Scan

Run these Gmail searches via MCP (all in parallel):

**4a. VIP unread:**
```
query: "in:inbox is:unread (from:vip1@example.com OR from:vip2@example.com OR ...)"
```
Build the from-list from all Tier 1 and Tier 2 VIP addresses in email-policy.md. If no VIP list configured, skip this search.

**4b. Inbox count:**
```
query: "in:inbox is:unread"
```

**4c. @ToSelf count:**
```
query: "label:<YOUR_LABEL_ID> is:unread"
```
Use the label ID from email-policy.md. Skip if not configured.

**4d. Sent recent (for waiting-for detection):**
```
query: "from:me in:sent newer_than:7d -in:chat"
```

For VIP results (4a), fetch message content to get sender names, subject lines, and dates. Sort oldest-first and calculate days waiting.

### Phase 5: Auto-Triage (skip if `no-triage` argument)

If `/triage-inbox` skill is available and `triage-config.md` exists, run inline triage:

1. Search for unread inbox emails within the adaptive triage window
2. Classify using the logic from `/triage-inbox` (VIP safety check, expense detection, classification scoring)
3. Apply labels via Gmail MCP
4. Update `~/.claude-assistant/state/triage-run-state.json`

**Adaptive window:** Read `last_run` from triage-run-state.json. If < 12 hours ago, use `hours_since_last + 2` hours. If >= 12 hours, use 48 hours. Default: 2 days.

If triage-config.md is missing or triage-inbox skill is not installed, skip this phase and report: "Triage skipped -- install /triage-inbox for auto-triage."

### Phase 5a: Meeting Context (next 2 events)

Using calendar data from Phase 2:

1. Sort today's timed events by start time
2. Identify the next 2 upcoming events (start time >= now; if run before any meetings, use first 2)
3. For each event, extract attendee emails (exclude your own addresses and room/resource addresses)
4. For each event, search in parallel:
   - **Gmail:** `(from:{attendee} OR to:{attendee}) newer_than:14d` for the primary attendee
   - **Granola** (if available): `mcp__granola__search_meetings` with attendee name
5. Extract: last topic discussed, action items owed, pending decisions
6. Compose a 1-line context summary per event

If an event has no attendees (e.g., "Focus time"), skip context lookup. If searches return nothing, show the event without context. Cap at 2 events, 1-2 searches per event.

### Phase 5b: Waiting-For Detection

From the sent-email results (Phase 4d):

1. Fetch content for the 10 most recent sent messages
2. For each, check the thread for replies:
   - Skip: self-sends, automated/noreply addresses, bulk sends (5+ recipients)
   - Search: `in:anywhere thread:{thread_id} -from:me newer_than:7d`
   - If no non-you messages found newer than your sent message, it is a "waiting for"
3. Cap at 5 waiting-for items
4. Sort by age (oldest waiting first)

If this adds too much latency, it can be skipped -- the briefing should not block on this.

### Phase 5c: Weather

Use WebSearch to query "[Your City] weather today" (city from calendar-policy.md) and extract a one-line summary including temperature, conditions, and precipitation chance.

Example: "Portland: 54F, partly cloudy, 20% chance rain"

If WebSearch fails or no city configured, omit the weather line.

### Phase 5d: Tomorrow/Weekend Preview

Using lookahead calendar data from Phase 2 and reminders from Phase 3:

- **Normal days:** Show tomorrow's all-day events, timed events, and reminders due tomorrow
- **Fridays:** Replace with "Weekend Preview" showing Saturday AND Sunday events/reminders grouped by day

### Phase 6: Assemble & Display Briefing

#### Reminder Classification Logic

Classify each reminder from Phase 3 into groups:

**HARD DEADLINES** -- Has hard-deadline keywords AND due within 3 days (including today). Also: any item with priority=1 (manually set high).

Hard-deadline keywords: `due`, `deadline`, `submit`, `file`, `renew`, `pay`, `invoice`, `reimburse`, `grant`, `IRB`, `contract`, `review`, `letter`, `slides`, `deck`, `send`, `deliver`, `final`, `revision`

Match case-insensitive against reminder title and body.

**DUE TODAY** -- Due date = target date, not classified as hard deadline.

**OVERDUE** -- Due date before target date. Sort oldest first (most days overdue at top).

Number all items sequentially across groups (1, 2, 3...) so you can reference them by number in follow-up.

#### Free Time Calculation

- Working window: from calendar-policy.md (default 8:00 AM to 6:00 PM = 10 hours)
- Sum meeting durations from today's timed events
- Free hours = working hours - total meeting hours
- Display as: **[N] hours free** (of [M] available, [start]-[end])

#### VIP Sorting

Sort VIP emails oldest-first (most days waiting at top). Display age as "[N]d" next to each name.

#### Overdue Truncation

Show a maximum of 10 overdue items (oldest first). If more than 10:
`... and [N] more -- run /todo-review to review`

#### Meeting Context Lines

For each of the next 2 events (from Phase 5a), add an indented context line below the event:
`  -> [context summary]`

Good context lines surface actionable info:
- "You owe [Name] draft slides from Jan 30 meeting"
- "Last discussed IRB amendment timeline -- decision pending"
- "New contact -- no prior email or meeting history"
- "Follow-up from Feb 10: agreed to share dataset"

If no context found, omit the line.

#### Waiting-For Assembly

Each item shows:
- Recipient name (extracted from To: header)
- Subject line snippet (first ~50 chars)
- Days waiting

Sort oldest-waiting first. Cap at 5 items.

#### Goal Alignment

If goals.yaml was loaded:
- Compare today's calendar events against active objectives
- Count goal-aligned vs admin/service meetings
- Identify top research priority from highest-weight at-risk objective
- If `push_level >= moderate` AND >2 hours free: add a research nudge
- If `push_level = assertive` AND <2 hours free: add a deep work alert
- Keep to 3-5 lines

#### Briefing Template

Compose the briefing in this format. Omit sections with no data. Use tomorrow's date if `tomorrow` argument was provided.

```
# Morning Briefing -- [Day of Week], [Month] [Date], [Year]
[System health line or warning block from Phase 0, if available]
[Weather one-liner, e.g., "[Your City]: 54F, partly cloudy, 20% chance rain"]

## Suggested Priorities
[Generate 3-5 suggested priorities based on:]
1. Hard deadline items (highest urgency)
2. VIP emails awaiting response (by age, oldest first)
3. Today's meetings that need prep
4. Overdue items worth acting on today
5. Goal-aligned work (from goals.yaml)
[Number them in suggested order of importance]

## Goal Alignment
- Today: [N] meetings ([M] align with goals, [K] are admin/service)
  - [event name] -> [objective name] (if aligned)
- [N] hours unscheduled -- top research priority: [specific next step from goals.yaml]
[If push_level >= moderate AND >2 hours free:]
  Research nudge: [specific actionable next step on top-priority task]
[If push_level = assertive AND <2 hours free:]
  !! Deep work alert: Less than 2 hours unscheduled today. Consider declining [lowest-priority meeting].

## Today's Schedule
- [time range]  [event name] ([calendar name])
  -> [1-line context from Phase 5a, if available]
- [time range]  [event name] ([calendar name])
- ...
[If no events: "No events scheduled today"]
**[N] hours free** (of [M] available, [start]-[end])

## Hard Deadlines
  1. [[list]] [task name] (due [relative date]) !!
  ...
[If none: omit entire section]

## Inbox Highlights
- **VIP needing response:** [name] ([N]d), [name] ([N]d) -- sorted oldest-first
- [N] unread emails remain in inbox
- [N] emails in @ToSelf (pending todo conversion)
[If @ToSelf has items: "Run /todo-queue to process"]

## Waiting For
- [Recipient name]: "[subject snippet]" ([N]d ago)
- ...
[Max 5 items, oldest first. If none: omit section]

## Tasks Due Today
  N. [[list]] [task name] ([time if set])
  ...
[If none: omit section]

## Tomorrow Preview
- [All-day events]
- [time range]  [event name]
- [[list]] [reminder due tomorrow]
[If nothing tomorrow: "Nothing scheduled for tomorrow"]
[ON FRIDAYS: Replace with "Weekend Preview" showing Sat + Sun grouped by day]

## Triage Summary
Auto-triaged [N] emails: [N] archived, [N] labeled, [N] flagged for review.

APPLIED:
  - [Sender (address)] | [Subject snippet, ~50 chars] -> [Label] [reason]
  - ...

SKIPPED (left in inbox):
  - [Sender (address)] | [Subject snippet] | [Reason: "VIP", "uncertain", etc.]
  - ...

[If any flagged:]
  !! Flagged: [sender] -> [label] (new sender -- suggest filter)
[If no-triage: "Triage skipped -- run /triage-inbox manually"]

## Overdue ([N] items)
  N. [[list]] [task name] (N days overdue)
  ... [max 10 items, oldest first]
[If >10: "... and [N] more -- run /todo-review to review"]
[If none: omit section]

To adjust reminders: tell me "defer 8-12 to Monday" or "move 9 to Someday"
```

**Display in terminal** -- this is the default output.

### Phase 7: Email Delivery (only if `email` argument provided)

Email delivery is opt-in. There are two approaches:

**Option A: Gmail MCP Draft (simple)**
```
mcp__google_workspace__draft_gmail_message
  user_google_email: your-email@gmail.com
  to: your-email@gmail.com
  subject: "Morning Briefing -- [Day], [Month] [Date], [Year]"
  body: [HTML version of briefing]
  is_html: true
```
This creates a draft you can review and send from Gmail.

**Option B: Custom send script (advanced)**

If you have a send-email script configured at `~/.claude-assistant/scripts/send-email.py`:

```bash
# Write HTML to temp file
cat > /tmp/morning-briefing.html << 'BRIEFING_EOF'
[HTML content]
BRIEFING_EOF

# Send
python3 ~/.claude-assistant/scripts/send-email.py \
  --to your-email@gmail.com \
  --subject "Morning Briefing -- [Day], [Month] [Date], [Year]" \
  --body-file /tmp/morning-briefing.html \
  --html
```

See the project wiki for send-email.py setup instructions.

#### HTML Email Template

When generating the email version, convert the briefing to HTML using this template structure. Keep it simple -- inline styles only (no external CSS), compatible with all email clients.

```html
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1a1a; max-width: 640px; margin: 0 auto; padding: 16px; font-size: 15px; line-height: 1.5;">

<h1 style="font-size: 22px; font-weight: 700; border-bottom: 2px solid #1a1a1a; padding-bottom: 6px; margin-bottom: 4px;">
  Morning Briefing -- [Day], [Month] [Date], [Year]
</h1>
<p style="color: #666; margin: 0 0 16px 0; font-size: 14px;">
  [Your City]: 54F, partly cloudy, 20% chance rain
</p>

<!-- Suggested Priorities -->
<h2 style="font-size: 17px; font-weight: 700; color: #333; margin: 20px 0 8px 0;">
  Suggested Priorities
</h2>
<ol style="margin: 0 0 12px 0; padding-left: 20px;">
  <li>...</li>
</ol>

<!-- Goal Alignment -->
<h2 style="font-size: 17px; font-weight: 700; color: #333; margin: 20px 0 8px 0;">
  Goal Alignment
</h2>
<ul style="margin: 0 0 12px 0; padding-left: 20px;">
  <li>Today: [N] meetings ([M] goal-aligned, [K] admin)</li>
  <li>[N] hours unscheduled -- top research priority: <b>[specific next step]</b></li>
</ul>

<!-- Today's Schedule -->
<h2 style="font-size: 17px; font-weight: 700; color: #333; margin: 20px 0 8px 0;">
  Today's Schedule
</h2>
<ul style="margin: 0 0 4px 0; padding-left: 20px; list-style: none;">
  <li><b>9:00-10:00</b> &nbsp; Event Name <span style="color: #666;">(Calendar)</span>
    <br><span style="color: #555; font-size: 13px; padding-left: 12px;">&rarr; Context line</span>
  </li>
</ul>
<p style="font-weight: 700; margin: 4px 0 12px 0;">
  [N] hours free <span style="font-weight: 400; color: #666;">(of [M] available)</span>
</p>

<!-- Hard Deadlines (red) -->
<h2 style="font-size: 17px; font-weight: 700; color: #c0392b; margin: 20px 0 8px 0;">
  Hard Deadlines
</h2>
<ol style="margin: 0 0 12px 0; padding-left: 20px;">
  <li><b style="color: #c0392b;">[list] Task name</b> (due [date]) !!</li>
</ol>

<!-- Inbox Highlights -->
<h2 style="font-size: 17px; font-weight: 700; color: #333; margin: 20px 0 8px 0;">
  Inbox Highlights
</h2>
<ul style="margin: 0 0 12px 0; padding-left: 20px;">
  <li><b>VIP needing response:</b> Name (Nd), Name (Nd)</li>
  <li><b>[N]</b> unread emails remain in inbox</li>
  <li><b>[N]</b> emails in @ToSelf <span style="color: #666;">(run /todo-queue to process)</span></li>
</ul>

<!-- Waiting For -->
<h2 style="font-size: 17px; font-weight: 700; color: #333; margin: 20px 0 8px 0;">
  Waiting For
</h2>
<ul style="margin: 0 0 12px 0; padding-left: 20px;">
  <li><b>Recipient Name</b>: "Subject snippet" <span style="color: #666;">(Nd ago)</span></li>
</ul>

<!-- Tasks Due Today -->
<h2 style="font-size: 17px; font-weight: 700; color: #333; margin: 20px 0 8px 0;">
  Tasks Due Today
</h2>
<ol start="N" style="margin: 0 0 12px 0; padding-left: 20px;">
  <li>[list] Task name</li>
</ol>

<!-- Tomorrow/Weekend Preview -->
<h2 style="font-size: 17px; font-weight: 700; color: #333; margin: 20px 0 8px 0;">
  Tomorrow Preview
</h2>
<ul style="margin: 0 0 12px 0; padding-left: 20px;">
  <li>...</li>
</ul>

<!-- Triage Summary -->
<h2 style="font-size: 17px; font-weight: 700; color: #333; margin: 20px 0 8px 0;">
  Triage Summary
</h2>
<p style="margin: 0 0 6px 0;">
  Auto-triaged [N] emails: [N] archived, [N] labeled, [N] flagged for review.
</p>
<p style="font-weight: 600; margin: 8px 0 2px 0; font-size: 14px;">Applied:</p>
<ul style="margin: 0 0 6px 0; padding-left: 20px; font-size: 13px; color: #444;">
  <li>[sender@domain] | "Subject snippet" &rarr; [Label] <span style="color: #888;">(reason)</span></li>
</ul>
<p style="font-weight: 600; margin: 8px 0 2px 0; font-size: 14px;">Skipped (left in inbox):</p>
<ul style="margin: 0 0 6px 0; padding-left: 20px; font-size: 13px; color: #444;">
  <li>[sender@domain] | "Subject snippet" | <span style="color: #888;">reason</span></li>
</ul>

<!-- Overdue -->
<h2 style="font-size: 17px; font-weight: 700; color: #666; margin: 20px 0 8px 0;">
  Overdue ([N] items)
</h2>
<ol start="N" style="margin: 0 0 8px 0; padding-left: 20px;">
  <li style="color: #666;">[list] Task name (N days overdue)</li>
</ol>
<p style="color: #888; font-size: 13px; margin-top: 0;">
  To adjust: tell me "defer 8-12 to Monday" or "move 9 to Someday"
</p>

</body>
</html>
```

**Formatting rules:**
- Section headers (`<h2>`): bold, 17px
- Main title (`<h1>`): bold, 22px, bottom border
- Hard deadlines: red text (`#c0392b`) + bold
- Overdue items: gray text (`#666`)
- Calendar names and metadata: gray (`#666`)
- Schedule times: bold
- VIP names and counts: bold
- Helper text: smaller gray text
- No images, no background colors, no external resources -- pure inline HTML
- Omit sections with no data (same as terminal version)

## MCP Parameter Notes

These validated behaviors help avoid common issues:

- `search_gmail_messages`: Does NOT accept `max_results` parameter
- `batch_modify_gmail_message_labels`: Use `add_label_ids`/`remove_label_ids` (NOT `add_label_names`/`remove_label_names`). Pass JSON arrays (`["id1","id2"]`). Works reliably when called sequentially -- failures are caused by parallel sibling-call cascades, not parameter issues.
- `get_gmail_messages_content_batch`: May reject list parameters -- fall back to individual `mcp__google_workspace__get_gmail_message_content` calls
- All search/label tools require `user_google_email: your-email@gmail.com`

## Error Handling

- **Gmail MCP unavailable**: Skip inbox/triage sections. Report "Gmail unavailable." Continue with calendar/reminders.
- **Calendar MCP unavailable**: Skip schedule. Report "Calendar unavailable." Continue with other sections.
- **Calendar 404 for a specific ID**: Skip that calendar silently. Others may still work.
- **osascript fails**: Skip reminders silently (non-macOS or Reminders not running).
- **WebSearch fails**: Omit weather line.
- **Granola MCP unavailable**: Use Gmail-only context for meetings.
- **Config file missing**: Skip dependent sections, note in internal log.
- **Batch label apply fails**: Retry once standalone, then fall back to individual per-message calls. Report which emails failed.
- **Sibling tool call failures**: If one MCP call in a parallel batch fails, siblings may also fail. Never fire multiple `batch_modify_gmail_message_labels` calls in parallel -- run them sequentially. Retry failed calls in a separate standalone invocation.
- **Email delivery fails**: Report error. Briefing still displayed in terminal.
- **Permission prompt appears**: A tool is missing from settings.json allow list. Add it under `permissions.allow`.

## Examples

```
/morning-brief                       # Full briefing, terminal only
/morning-brief email                 # Full briefing + email delivery
/morning-brief tomorrow              # Tomorrow's view
/morning-brief no-triage             # Skip auto-triage
/morning-brief no-triage no-reminders  # Minimal: calendar + inbox only
/morning-brief email tomorrow        # Tomorrow's view + email delivery
```

## Integration Notes

- **Triage rules by reference:** This skill uses `/triage-inbox` classification logic and `triage-config.md` for data tables. Updates to those files propagate automatically -- no rules are duplicated here.
- **Auto-apply is pre-approved:** Unlike `/triage-inbox` which requires `apply` argument, the morning briefing auto-applies all labels during triage. Both skills read and write the same triage state file, so whichever runs first sets the baseline for the next run.
- **Shared triage window:** Morning brief and `/triage-inbox` read the same `triage-run-state.json`. Morning brief uses a 2-day floor (vs 1 day for triage-inbox).
- **VIP detection:** Uses the VIP list from `email-policy.md` to highlight unanswered emails from important senders.
- **@ToSelf integration:** Checks for pending todo-queue items and reminds to run `/todo-queue`.
- **Goal alignment:** Reads `goals.yaml` for priorities. Keep this file updated for relevant suggestions.

## Performance Logging

After completing all phases, log this run:
```bash
echo "$(date +%Y-%m-%d),morning-brief,TOOL_CALLS,NOTES" >> ~/.claude-assistant/logs/skill-performance.csv
```
Replace TOOL_CALLS with approximate count of tool uses this run. Replace NOTES with brief volume info (e.g., "12 emails 4 cals"). Do not skip this step.
