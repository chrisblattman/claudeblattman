---
name: triage-inbox
description: "Classify and organize email using configured inbox policies, labels and filters."
---

# Smart Inbox Triage

*v1.5 — Added Phase 5.5: student reply detection with batch-confirm*

Scan your inbox for emails that should be in labeled folders (@ToRead, @Announcements, @School, Expenses-Pending, Auto-Archive, etc.) but are not filtered there yet. Uses header and content heuristics that Gmail's native filters cannot replicate.

## Prerequisites

- **Gmail MCP** — `google_workspace_mcp` with Gmail tools enabled
- **Email policy config** — `~/.claude-assistant/config/email-policy.md` (VIP list, auto-archive rules, filter lists). Download the template from the [GitHub repo](https://github.com/chrisblattman/claudeblattman/tree/main/templates) (see First-Time Setup).
- **Triage config** — `~/.claude-assistant/config/triage-config.md` (label IDs, expense vendors, scoring thresholds, classification overrides). Download the template from the [GitHub repo](https://github.com/chrisblattman/claudeblattman/tree/main/templates) (see First-Time Setup).
- **Gmail label IDs** — You need the internal Gmail label IDs for each target label. Run `mcp__google_workspace__list_gmail_labels` to find them, then put them in `triage-config.md`.

## First-Time Setup

1. **Create config directory:**
   ```bash
   mkdir -p ~/.claude-assistant/config ~/.claude-assistant/state ~/.claude-assistant/logs
   ```

2. **Create `triage-config.md`** from the template. At minimum, fill in:
   - **Label IDs** — run `mcp__google_workspace__list_gmail_labels` with your email to find IDs for your target labels (@ToRead, @Announcements, @School, Expenses-Pending, Expenses-Personal, Expenses-Uncertain, Auto-Archive, @Family, @FYI)
   - **Expense Vendor Domains** — domains like amazon.com, uber.com, etc. that send receipts
   - **Classification Overrides** — senders you always want routed a specific way

3. **Create `email-policy.md`** from the template. At minimum, fill in:
   - **VIP lists** (Tier 1: family, journals, compliance; Tier 2: collaborators, team members)
   - **@Family addresses** — personal contacts who should never be auto-triaged
   - **Auto-Archive rules** — senders or patterns to always archive

4. **Test with preview mode:**
   ```
   /triage-inbox noapply
   ```
   Review the classifications. Adjust config thresholds until results match your expectations.

## Arguments

`$ARGUMENTS` can include:
- `noapply` - Preview only, do not apply labels
- `days:N` - Override search window (e.g., `days:3` after a weekend). Default: auto-calculated from last run time (typically 1 day). Falls back to 1 day if no run history exists.
- `limit:N` - Process only first N emails (e.g., `limit:20`)

## Instructions

### Phase 1: Read Policy and Config

Before any classification, read these two files:

1. **Policy**: `~/.claude-assistant/config/email-policy.md`
   - Current VIP list (Tier 1 and Tier 2)
   - @Family addresses
   - Current Auto-Archive rules
   - Skip-inbox label rules

2. **Config**: `~/.claude-assistant/config/triage-config.md`
   - Label IDs for all triage labels
   - Expense vendor domains and routing rules
   - Expense keywords, skip patterns, and detection thresholds
   - Classification score thresholds
   - Classification overrides table
   - Newsletter platform domains, school domains, @ToRead sender whitelist

### Phase 1.5: Label-in-Inbox Sweep

Before processing new emails, sweep for emails already carrying a skip-inbox label that are still in the main inbox. This catches Gmail filter misses (e.g., forwarded email bypass), prior batch_modify failures, and mobile labeling without archiving.

**Single combined search:**
```
mcp__google_workspace__search_gmail_messages
  user_google_email: your-email@gmail.com
  query: "in:inbox (label:@Announcements OR label:@School OR label:@ToRead OR label:@FYI OR label:@ToDo OR label:@ToSelf)"
  max_results: 50
```
If combined query fails, fall back to individual `in:inbox label:X` searches per label.

**Two categories with different handling:**

| Category | Labels | Remove INBOX? | Change read status? |
|----------|--------|---------------|-------------------|
| **A — Skip-inbox** (applied by triage/filters) | @Announcements, @School, @ToRead, @FYI | Yes | Yes — mark as read |
| **B — Action** (applied by user manually) | @ToDo, @ToSelf | Yes | No — leave read/unread as-is |

**@Family exclusion:** Do NOT sweep @Family. If your policy prohibits auto-archiving family emails, exclude that label from the sweep. If @Family emails are found in inbox, note count in the report but take no action.

**After archiving:** Log swept message IDs to the run state file with `"label": "Phase0.5-sweep"`. This prevents repeat MCP calls on subsequent runs.

**Report section** (added to the classification report):
```
LABEL-IN-INBOX SWEEP: [N archived]
  Category A (skip-inbox): [N] — @Announcements: N, @School: N, @ToRead: N, @FYI: N
  Category B (action labels): [N] — @ToDo: N, @ToSelf: N
  @Family in inbox (not swept): [N]
```
Count >10 per run suggests recurring batch_modify failures or filter issues — flag for investigation.

**Error handling:** If search fails, log "Phase 1.5 sweep failed — skipping" and continue to Phase 2. Do NOT block the main triage loop.

### Phase 2: Determine Search Window

1. Read `~/.claude-assistant/state/triage-run-state.json`
2. If `last_run` exists:
   - Calculate hours since last run
   - Search window = max(hours_since_last_run + 6 hours buffer, 24 hours)
   - Convert to days for Gmail query: ceiling(window_in_hours / 24)
   - Cap at 7 days maximum
3. If no state file or no `last_run` field: default to 1 day
4. If `days:N` argument provided: use N (overrides everything)

Report: "Search window: [N] day(s) [reason: last run X hours ago / default / manual override]"

### Phase 3: Search Inbox

**Two searches needed:** One for general triage (unread only), one for expense detection (read or unread).

**Use the search window calculated in Phase 2** (referred to as `N` below).

**3a. General triage search** (newsletters, announcements, auto-archive):
```
mcp__google_workspace__search_gmail_messages
  user_google_email: your-email@gmail.com
  query: "in:inbox is:unread newer_than:Nd"
  max_results: 50
```

**3b. Expense detection search** (catches read-but-unlabeled expense emails):
Build the query from the Expense Vendor Domains table in `triage-config.md`. Format:
```
mcp__google_workspace__search_gmail_messages
  user_google_email: your-email@gmail.com
  query: "in:inbox newer_than:Nd (from:domain1 OR from:domain2 OR ...)"
```
Include all domains from the config. Omit `is:unread` so read-but-unlabeled receipts are caught.

**Why two searches:** The general search uses `is:unread` to avoid reprocessing. But expense emails may be read on phone/web before triage runs -- without the second search, they would be missed. The expense search omits `is:unread` so read-but-unlabeled receipts are still caught.

**Merge results:** Combine message IDs from both searches (deduplicate). Emails already labeled with any `Expenses-*` label are filtered out in Phase 7.

### Phase 4: Dedup Against Run State

Read `~/.claude-assistant/state/triage-run-state.json` if it exists. This file tracks message IDs processed in recent runs to prevent duplicate processing on re-runs or partial failures.

For each message ID from Phase 3, check if it appears in the state file with a timestamp less than 7 days old. If found, **skip it** -- it was already processed. Report: "Skipping [N] already-processed emails from previous run."

If the state file does not exist, continue normally (first run).

### Phase 5: Fetch Email Details

Fetch each email individually. Fetch in parallel for speed:
```
mcp__google_workspace__get_gmail_message_content
  user_google_email: your-email@gmail.com
  message_id: [each ID from Phase 3, deduplicated]
```

Extract from each email:
- From address
- Subject
- Date
- Headers (especially List-Unsubscribe if present)
- Body preview (first 500 chars for "unsubscribe" detection)

### Phase 6: Safety Check (VIP Protection)

For each email, check against VIP list from policy file. **SKIP** (leave in inbox) if:
- Sender is on Tier 1 VIP list (family, compliance, journals)
- Sender is on Tier 2 VIP list (collaborators, team members)
- Sender matches @Family addresses
- Sender is from known collaborator domains

### Phase 7: Expense Detection

Before general classification, check each email against expense patterns. Emails flagged as expenses are **excluded from Phase 10** -- they do not get double-classified.

**HARD RULE: Skip emails already labeled with any `Expenses-*` label** (see Label IDs in `triage-config.md`). **Never reclassify.** If an email has `Expenses-Pending`, it was placed there intentionally. Do NOT move it to `Expenses-Personal` or any other label -- the existing label is sacred.

**Note:** Gmail labels are nested as `Expenses/Expenses-Pending` etc. When searching Gmail, use `label:Expenses/Expenses-Pending` (not `label:Expenses-Pending`). Label IDs work correctly for add/remove operations regardless.

**Detection logic:** Apply rules from `triage-config.md` in this order:

1. Check sender against **Expense Vendor Domains** table
2. Check subject against **Expense Subject Keywords** (must also be from vendor-like sender)
3. Apply **Expense Skip Patterns** (NOT expenses even if from vendor domain)
4. Apply any **vendor-specific special handling** rules from the config
5. Apply **Expense Detection Thresholds** for edge cases

**When expense detected:**
- **Route to appropriate label** using the expense routing table in the config
- Apply label, archive, and read-status rules from the config's label application rules table
- **Do NOT classify Business/Personal** -- that is a separate expense-processing step
- **Exclude from Phase 10** -- do not double-classify

### Phase 8: Filter Bypass Recovery

**Problem:** Emails forwarded from a work address sometimes bypass Gmail filters (forwarding alters envelope headers). The filter exists and is correct, but it did not fire.

**Logic:** For each email still in inbox, check if the sender/subject matches any documented filter in `email-policy.md`:
- Auto-Archive Filters table (all stages)
- @ToRead filters
- @Announcements filters
- @School filters

**If match found AND email is still in inbox:**
- Apply the filter's documented action (label + skip inbox + mark read per filter rules)
- Log as `[Filter Bypass] {sender} | {subject} -> {action} (filter exists but did not fire)`
- **Exclude from Phase 10** -- already handled

**Why this happens:** Gmail filters match at delivery time. When a forwarding address alters the envelope sender, `from:` filter matching can fail even though the displayed From: header looks correct. This phase backstops those misses.

**Report section:** In the classification report, show these under a separate heading:
```
FILTER BYPASS RECOVERY: [N]
  - [Sender] | [Subject] | [Expected filter] | Applied: [action]
```

### Phase 8b: Travel Email Routing

Before general classification, check emails from travel-related domains for travel-specific routing. Emails handled here are **excluded from Phase 10**.

**Applies to:** Emails from any domain in the **Travel Domains** table in `triage-config.md` (airlines, hotels, accommodation platforms, booking platforms, rental cars, travel tools) that were NOT already flagged as expenses in Phase 7.

**Stay in INBOX** if any of these apply (case-insensitive):
- Check-in: subject contains "check in", "time to check in", "check-in"
- Alerts/disruptions: subject contains "delay", "cancelled", "canceled", "gate change", "schedule change"
- Documents: subject contains "upload", "visa", "ESTA", "passport", "required documents"
- **Host/property messages** (Airbnb, VRBO): subject contains "message from", "your host", "check-in instructions", OR sender matches `@guest.airbnb.com`, `@messages.airbnb.com` — these are actionable direct messages

**Route to @Announcements** (skip inbox, leave unread) for everything else from these domains:
- Itineraries, booking confirmations, boarding passes
- Trip summaries, post-trip emails
- "Thanks for your purchase" / booking receipts (non-expense)
- Loyalty/mileage updates
- Rental car confirmations, return reminders
- Travel platform deal alerts, price watches

**Log:** `[Travel] {sender} | {subject} -> @Announcements` or `[Travel] {sender} | {subject} -> KEEP IN INBOX (check-in/alert/host message)`

### Phase 9: Calendar Invitation Detection

Before general classification, check each email for calendar invitation signals. Emails detected as calendar invitations are **excluded from Phase 10**.

**Detection signals (any one is sufficient):**
- Message-ID header contains `calendar-` (Google Calendar invitations)
- Subject starts with "Invitation:" or "Updated invitation:"
- Has `invite.ics` or `text/calendar` attachment/content-type
- Subject contains "accepted" or "declined" combined with calendar event patterns

**Exclusions (NOT calendar invitations for this rule):**
- Acceptance notifications from `calendar-notification@google.com` with subject containing "accepted" -- these are typically handled by existing Auto-Archive filters
- Calendly "New Event" notifications -- typically handled by existing filters

**When calendar invitation detected:**
- Classify as **@Announcements** (use Label ID from `triage-config.md`)
- Remove from INBOX, leave **UNREAD**
- Log: `[Calendar] {subject} -> @Announcements`

### Phase 10: Classification Logic

For emails that pass the safety check and are NOT flagged as expenses, filter bypass recovery, travel routing, or calendar invitations, classify using this decision tree:

```
0. Check overrides FIRST:
   - Does sender match any entry in the **Classification Overrides**
     table in triage-config.md? -> Use that classification directly,
     skip all scoring below.

1. Check headers:
   - Has List-Unsubscribe header? -> Newsletter signal (+2)
   - From address contains "noreply" or "no-reply"? -> Automated signal (+1)
   - From address contains "newsletter" or "digest"? -> Newsletter signal (+1)

2. Check content:
   - Body contains "unsubscribe" (case-insensitive)? -> Newsletter signal (+2)
   - Body contains generic greeting ("Dear colleague", "Dear faculty", etc.)? -> Announcement signal (+1)
   - Subject contains event keywords ("seminar", "workshop", "webinar")? -> Announcement signal (+1)
   - Subject contains "receipt", "confirmation", "order"? -> Auto-archive candidate (+1)

3. Check domain patterns (use tables in triage-config.md):
   - From **Newsletter Platform Domains** table? -> @ToRead (immediate, skip scoring)
   - From **School Domains** table (excluding @Family addresses)? -> @School
   - From .edu domain + event/seminar keywords? -> @Announcements
   - Matches **Auto-Archive Heuristic Patterns** table? -> Auto-Archive candidate

4. Scoring (per Classification Score Thresholds in config):
   - From Newsletter Platform Domain -> @ToRead (already handled in step 3)
   - From @ToRead Sender Whitelist (triage-config.md) -> @ToRead
   - Newsletter score >= 3 (generic signals) -> @Announcements (NOT @ToRead)
   - Announcement score >= 2 + .edu domain -> @Announcements
   - Receipt/notification from noreply -> Auto-Archive candidate
   - Score 1-2 with mixed signals -> UNCERTAIN (skip)
   - Score 0 or no pattern match -> SKIP (leave in inbox)

5. Tiebreaking: If multiple categories match, use the
   **Classification Priority** table in triage-config.md.
```

### Phase 10.5: Student Reply Detection (Batch-Confirm)

After classification, check emails that were **SKIPPED** (left in inbox) for student inquiry patterns. This phase proposes replies for batch approval — it does NOT auto-send.

**For each SKIPPED email, run these checks in order:**

1. **Skip if** sender is on VIP list (Tier 1 or Tier 2)
2. **Skip if** subject starts with "Re:" (reply in existing thread)
3. **30-day dedup:** Search Gmail for prior reply from your assistant address:
   ```
   mcp__google_workspace__search_gmail_messages
     user_google_email: your-email@gmail.com
     query: "from:your-assistant@gmail.com to:[sender_address] newer_than:30d"
   ```
   If any results -> skip (already replied recently)
4. **Domain routing:**
   - Your institution's `.edu` domain -> check institutional keyword tables (office hours/advice + RA position)
   - Other domain -> check external student keywords + journalist/NGO exclusion signals (`journalist`, `reporter`, `article`, `interview`, `NGO`, `organization`, `partnership`, `faculty`, `professor`, `colleague`)
5. **Keyword scoring** per `triage-config.md` Classification Keywords tables:
   - **HIGH**: 2+ positive keyword signals
   - **MEDIUM**: 1 keyword signal + strong contextual indicator (institutional domain + "Dear Professor", student self-identification)
   - **LOW**: 0-1 signals -> skip entirely (no proposal)
6. **Template selection:**
   - Institutional + office-hours signals (no RA) -> **Template A** (office hours)
   - Institutional + RA signals -> **Template B** (if hiring is active) or **Template C** (if not)
   - External + predoc signals -> **Template F** (priority over D)
   - External + student signals, no exclusions -> **Template D**
7. **Substitute variables:** `[Name]` = sender first name, `[office_hours_url]` from triage-config.md Student Inquiry Config
8. **Staleness check:** If `triage-config.md` Student Inquiry Config `last verified` > 30 days ago, add warning: `!! Student config not verified since [date] -- still accurate?`

**Report section** (added to the classification report):
```
STUDENT REPLIES PROPOSED: [N]
  1. To: [address] | [Template X] ([description]) | [confidence]
     Keywords: [matched keywords]
     Preview: "[first 100 chars of reply body]..."
  2. ...

  Skipped (LOW confidence): [N]
    - [sender] | [reason]

Send all? (yes / no / review individually)
```

**Sending approved replies:**

After you approve (say "yes", "send", "go", etc.), send each proposed reply using your email send method (Gmail MCP draft or custom send script).

**Post-send actions:**
- Mark original email as read (remove UNREAD label)
- For RA-related templates: also forward to your RAs per triage-config.md RA Forwarding List
- For external templates: apply @FYI label, remove INBOX
- **Log** each action to `state/student-reply-log.csv`: `date,sender,sender_email,subject,template,confidence,action,notes`

**If you say "no" or "skip":** Do not send. Log as `action: skipped-by-user` in student-reply-log.csv.

**If `noapply` mode:** Show proposals in report but do not prompt for sending.

### Phase 11: Classification Report

Generate report grouped by proposed action:

```
INBOX TRIAGE REPORT
====================
Date: [date]
Emails scanned: [N]
Search window: [N] day(s) ([reason from Phase 2])

PROPOSED CLASSIFICATIONS
------------------------

@ToRead (Newsletters): [N]
  - [Sender] | [Subject] | [Date]
  - ...

@Announcements (Institutional): [N]
  - [Sender] | [Subject] | [Date]
  - ...

@School (School notices): [N]
  - [Sender] | [Subject] | [Date]
  - ...

Auto-Archive: [N]
  - [Sender] | [Subject] | [Date] | [Suggested sublabel]
  - ...

LABEL-IN-INBOX SWEEP: [N archived]
  Category A (skip-inbox): [N] — @Announcements: N, @School: N, @ToRead: N, @FYI: N
  Category B (action labels): [N] — @ToDo: N, @ToSelf: N
  @Family in inbox (not swept): [N]

FILTER BYPASS RECOVERY: [N]
  - [Sender] | [Subject] | [Expected filter] | Applied: [action]
  - ...

EXPENSES DETECTED: [N]
  - [Sender] | [Subject] | [Date] | [Category hint: AI subscription / transport / retail / etc.]
  - ...
  [Already in Expenses-Pending: [N] -- skipped]

STUDENT REPLIES PROPOSED: [N]
  1. To: [address] | [Template X] ([description]) | [confidence]
     Keywords: [matched keywords]
     Preview: "[first 100 chars]..."
  Skipped (LOW confidence): [N]

Send student replies? (yes / no / review individually)

SKIPPED (Uncertain or VIP): [N]
  - [Sender] | [Subject] | [Reason]
  - ...

NEW FILTER SUGGESTIONS
----------------------
The following senders appeared multiple times and could become permanent Gmail filters:
  - [sender@domain.com] -> @ToRead (seen 3x)
  - ...

===
To preview without applying, run: /triage-inbox noapply
```

### Phase 12: Apply Labels

Preview mode is the public default. Show the report first and ask for explicit
approval before applying labels, archiving messages, marking messages read, or
creating filters. Skip this phase unless the user explicitly approves applying
the proposed changes in this run.

**Label IDs:** Use the Label IDs table from `triage-config.md`.

**Group emails by action** (same label + same archive/read behavior) and apply each group in a **separate, sequential** `batch_modify` call -- do NOT fire multiple `batch_modify` calls in parallel, as sibling-call failures cascade.

```
mcp__google_workspace__batch_modify_gmail_message_labels
  user_google_email: your-email@gmail.com
  message_ids: ["id1", "id2"]  # JSON array
  add_label_ids: ["YOUR_LABEL_ID"]  # from triage-config.md
  remove_label_ids: ["INBOX"]  # archive
```

**Retry on failure:** If a `batch_modify` call fails:
1. Wait -- do not immediately retry in the same parallel batch
2. Retry the **same call** once in a new, standalone tool invocation
3. If the retry also fails, fall back to **individual calls** -- one `batch_modify` per message ID
4. If individual calls also fail, log the failure and continue with remaining groups

Apply labels per the **Label application rules by routing tier** table in `triage-config.md`:

1. **@ToRead, @Announcements, @School, @Family, @FYI**: Add label, remove INBOX, leave UNREAD
2. **Expenses-Pending**: Add label, remove INBOX, mark as read
3. **Expenses-Personal**: Add label, remove INBOX, mark as read
4. **Expenses-Uncertain**: Add label, remove INBOX, leave UNREAD (you review in filtered view)
5. **Auto-Archive**: Add label, remove INBOX and UNREAD (marks as read)

For new filters, **call directly**:
```
mcp__google_workspace__create_gmail_filter
  user_google_email: your-email@gmail.com
  criteria: {"from": "sender@domain.com"}
  action: {"addLabelIds": ["<ID from triage-config.md>"], "removeLabelIds": ["INBOX"]}
```

**12b. Auto-create filters for high-confidence classifications:**

After labels are approved and applied, check if any classified sender meets ALL of these criteria:
- Exact sender match to a Classification Override entry, OR from a Newsletter Platform Domain, OR from a School Domain
- The override/domain entry has been in config for >7 days (not a brand-new addition)
- No existing Gmail filter already handles this sender (check `email-policy.md` Auto-Archive Filters)

If all criteria met: automatically create a Gmail filter using `create_gmail_filter`. Log it in the report:
```
AUTO-CREATED FILTERS: [N]
  - [sender@domain.com] -> [label] (was override/platform match, now permanent filter)
```
After creating the filter, note in report that the Classification Overrides entry can be removed from `triage-config.md` (do not auto-remove -- user confirms during review).

**12c. Clean inbox verification:**

After all labels are applied, run a verification query:
```
mcp__google_workspace__search_gmail_messages
  user_google_email: your-email@gmail.com
  query: "in:inbox is:unread"
  max_results: 5
```
Report the residual count:
```
INBOX HEALTH: [N] unread emails remain in inbox after triage
```
This is informational -- a rising count across runs signals the system is underperforming.

### Phase 13: Update Run State

After each successful label operation, append the message ID to `~/.claude-assistant/state/triage-run-state.json`. Also write a `last_run` ISO timestamp so the next run can auto-calculate the search window (see Phase 2). Format:
```json
{
  "last_run": "2026-02-15T08:30:00Z",
  "processed": [
    {"id": "msg_id_1", "label": "@ToRead", "ts": "2026-02-12T08:30:00Z"},
    {"id": "msg_id_2", "label": "Expenses-Pending", "ts": "2026-02-12T08:30:00Z"}
  ]
}
```
If the file exists, read it, append new entries, prune entries older than 7 days, and update `last_run` to the current time before writing back. If it does not exist, create it.

Report results:
```
LABELS APPLIED
==============
@ToRead: [N] emails
@Announcements: [N] emails
@School: [N] emails
Expenses-Pending: [N] emails
Expenses-Personal: [N] emails
Expenses-Uncertain: [N] emails
Auto-Archive: [N] emails

Total processed: [N]
Skipped: [N]
Deduped (from previous run): [N]
```

### Phase 14: Log Session

Append session summary to `~/.claude-assistant/logs/email-triage-observations.md`:

```
## Triage Session: [Date]

| Metric | Count |
|--------|-------|
| Label-in-inbox sweep | [N] |
| Emails scanned | [N] |
| Deduped (previous run) | [N] |
| @ToRead applied | [N] |
| @Announcements applied | [N] |
| @School applied | [N] |
| Expenses-Pending applied | [N] |
| Auto-Archive applied | [N] |
| Student replies sent | [N] |
| Filter bypass recovery | [N] |
| Auto-created filters | [N] |
| Skipped | [N] |
| Inbox residual (unread) | [N] |

### New filter suggestions:
- [suggestions if any]

### Corrections needed:
- [leave blank - user fills in after review]
```

Then log performance:
```bash
echo "$(date +%Y-%m-%d),triage-inbox,TOOL_CALLS,NOTES" >> ~/.claude-assistant/logs/skill-performance.csv
```
Replace TOOL_CALLS with your approximate count of tool uses this run. Replace NOTES with brief volume info (e.g., "22 emails scanned 8 labeled").

## Error Handling

- **Gmail MCP unavailable**: "Gmail integration unavailable. Try again later."
- **Batch modify fails**: Retry once standalone, then fall back to individual per-message calls (see Phase 12 retry logic). Report which emails failed, continue with others. Never fire multiple `batch_modify` calls in parallel.
- **Policy file not found**: Warn user to create config files from templates. Cannot proceed without at minimum `triage-config.md` (for label IDs).
- **Config file not found**: "Missing ~/.claude-assistant/config/triage-config.md. Download the template from the GitHub repo (see First-Time Setup)."

## Examples

```
/triage-inbox                    # Scan, report, and apply (default)
/triage-inbox noapply            # Preview only, do not apply
/triage-inbox days:14            # Scan last 14 days
/triage-inbox limit:20           # Process first 20 emails only
/triage-inbox days:30 limit:50   # 30 days, max 50 emails
```

## Integration with Weekly Workflow

- Runs daily (typically morning), sometimes multiple times/day
- Search window auto-adjusts: 1 day for daily runs, wider after gaps
- Use `days:N` to catch up after weekends or travel
- Most common senders should have permanent filters over time
- Skill catches new/unfamiliar senders that filters miss

## Feedback Loop

After each session, if corrections were made:
1. Add the sender to the **Classification Overrides** table in `triage-config.md` with the correct classification
2. Log the correction in `email-triage-observations.md` under the session's "Corrections needed" section
3. If the same sender has been overridden 2-3 times, create a permanent Gmail filter (move from overrides table to `email-policy.md` Auto-Archive Filters) and remove the override entry

**Override table hygiene (checked each run):** At the start of Phase 10, scan the Classification Overrides table for entries older than 14 days. Flag these in the report:
```
OVERRIDE TABLE AGING: [N] entries older than 14 days -- candidates for Gmail filter conversion
  - [sender] | added [date] | recommended filter: [label]
```
The overrides table should be a temporary holding pen, not a permanent rule store. Entries that persist >14 days should become Gmail filters.

## Customization Points

- **Label names and IDs** -- Edit `~/.claude-assistant/config/triage-config.md` to match your Gmail label structure. The skill uses whatever labels you define (you are not limited to the defaults listed here).
- **VIP / never-triage list** -- Edit `~/.claude-assistant/config/email-policy.md` to add people whose emails should never be auto-triaged.
- **Expense vendor domains** -- Add your expense vendors to `triage-config.md`. The skill routes receipts to expense labels automatically.
- **Classification score thresholds** -- Tune the scoring thresholds in `triage-config.md`. Higher thresholds = fewer false positives but more emails left in inbox. Lower = more aggressive triaging.
- **Classification overrides** -- Add specific senders to the overrides table in `triage-config.md` to bypass all scoring and always route them to a specific label.
- **School domains** -- If you are at a university, add your institution's email domains to the school domains list. Otherwise, remove the @School label and related logic.
- **Newsletter platform domains** -- Substack, Mailchimp, etc. Emails from these domains go straight to @ToRead.
- **Travel domains** -- Add airline, hotel, accommodation, booking, and rental car domains to the Travel Domains table in `triage-config.md`. The skill routes confirmations to @Announcements and keeps actionable travel emails (check-in, alerts, host messages) in your inbox.
- **Student reply templates** -- Configure templates in `triage-config.md` Student Inquiry Config for auto-drafted replies to student emails. Set keyword tables, office hours URL, and hiring status.
- **Search window defaults** -- Change the 7-day cap or 6-hour buffer in Phase 2 if you prefer different adaptive windows.
- **Gmail email address** -- Replace `your-email@gmail.com` in all MCP calls with your actual Gmail address.
- **Observation log location** -- Change the path in Phase 14 if you prefer a different log location.
- **Run state location** -- Change `~/.claude-assistant/state/triage-run-state.json` if you prefer a different state directory.
