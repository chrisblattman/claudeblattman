---
name: announcement-digest
description: "Compile a digest of announcement emails from a configured source. Use for recurring school, employer or organization email summaries."
---

# Announcement Digest
# Adapt for your source — swap the @[SOURCE] label, names, and classification rules.
# This is a sanitized version of a working school-email digest skill.
# Full walkthrough: https://claudeblattman.com/workflows/school-digest/

*v1.0 — Announcement email digest skill*

Compile a digest of high-volume announcement emails from a single source (school, employer, nonprofit, professional association). Extract what matters, skip the noise, send a summary.

## Prerequisites

- **Gmail MCP** — for searching and reading emails
- **Gmail label + filter** — all source emails auto-labeled (e.g., `@School`, `@CompanyNews`)
- **Classification rules** — a config file with your calibrated rules (see walkthrough)
- **send-email.py** or equivalent — for sending the compiled digest

## Config & State Files

- **Rules:** `[YOUR_CONFIG_PATH]/digest-rules.md`
- **State:** `[YOUR_STATE_PATH]/digest-state.json`

State file tracks: `last_digest_date`, `digest_count`, `reported_message_ids`, `reported_message_ids_ttl_days` (default 30).

## Execution Steps

### Step 1: Read State & Check Frequency

1. Read `digest-state.json`.
2. If `last_digest_date` is not null and fewer than 2 days have passed:
   - Output: "Nothing new since [last_digest_date]. Next digest available [date]."
   - **Exit.**
3. Store `digest_count` (needed for first-time intro check at Step 5).

### Step 2: Fetch Labeled Emails

1. Compute lookback date: `last_digest_date` if set, otherwise 14 days ago.
2. Search Gmail: `label:[YOUR_LABEL] after:[lookback_date in YYYY/MM/DD]`
   - **Do NOT use `is:unread`** — labeled emails may or may not be marked read. Query by date range.
   - Page through all results (follow `next_page_token`).
3. Filter out any message IDs already in `reported_message_ids`.
4. If no new emails remain, exit with message.

### Step 3: Fetch Email Content

1. For each new message, fetch full content via `get_gmail_message_content`.
   - Fetch in parallel batches of 10.
2. Group messages by Gmail thread ID. Keep only the most recent non-you message per thread.
3. Accumulate total word count across all fetched message bodies.
4. **Prune `reported_message_ids`**: Remove IDs older than `reported_message_ids_ttl_days`.

### Step 4: Classify Each Email

Read your rules config for the full rule set. For each email (or thread), apply classification in this order:

#### 4a. Skip Check
Apply SKIP rules first. If any match, mark as `skip` and record `skip_reason`.

#### 4b. Source Assignment
Determine which sub-category the email belongs to (e.g., which child's school, which department, which program).

#### 4c. Urgency Classification
Apply rules from config using this priority order:
1. **Sender pattern override:** Personal sender (not `noreply@`) → HIGH
2. **HIGH keyword match** in subject + first 200 chars → HIGH
3. **LLM extraction** for everything else:

> Extract from this email. Return as JSON.
> (1) category: action_required / calendar_event / fyi / skip
> (2) urgency: high / medium / low
> (3) summary: 1-2 sentences of what you need to know
> (4) deadline: specific date/time if any, else null
> (5) deadline_quote: verbatim text from email stating the date/deadline — copy exact wording, do not paraphrase. null if no deadline.
> (6) skip_reason: if skip, one phrase why

4. **HIGH keyword overrides LLM urgency** upward (never downward).
5. **SKIP keyword overrides to skip** unless LLM said `action_required`.

### Step 4.5: Write Classified Artifact

Create a private temp directory with `mktemp -d` and write full classified data
to `digest-classified.json` inside that directory. This serves as:
- A **compaction safeguard** — if context is lost, re-compose from this file
- A **debug artifact** — review classification accuracy after the fact

### Step 5: Compose Digest

Format as plain text. Structure:

```
[YOUR SOURCE] EMAIL DIGEST
[date range]
Compressed ~[W] words across [N] emails ([M] threads) into this digest.
──────────────────────────────

[CATEGORY 1]

▶ ACTION ITEMS
  • [summary] — deadline: [date]
    Source: "[deadline_quote]"

📅 UPCOMING
  • [event/date]

ℹ️ FYI
  • [1-line summary]


[CATEGORY 2]

▶ ACTION ITEMS
  ...

+ [N] lower-priority items not shown
──────────────────────────────
```

**Rules:**
- Action items (HIGH) first, deadlines noted inline
- For HIGH items with a `deadline_quote`, include: `Source: "[deadline_quote]"` — makes factual errors visible
- Calendar events (MEDIUM) second
- FYI (LOW) third, 1 line each
- Omit empty sections
- **First-time send** (if `digest_count` was 0): Prepend intro explaining what this automated digest is and who it's from.

### Step 6: Save State & Send

1. **Write state file FIRST** (before sending):
   - Add ALL processed message IDs to `reported_message_ids` (including skipped)
   - Set `last_digest_date` to today
   - Increment `digest_count`

2. **Draft the digest** via your preferred method. Ask for explicit approval
   before sending. The public template must not auto-send.

3. **Do NOT mark source emails as read.** The digest is additive — it doesn't replace checking the source.

### Step 7: Log Performance

Log tool call count, duration, and volume for future optimization.

## Edge Cases

- **No emails:** Exit with message at Step 2.
- **All already reported:** Exit with message at Step 2.
- **Send failure after state write:** State is already saved (prevents duplicate digests). Log the error and retry manually.

## What This Skill Does NOT Do

- Does not mark emails as read
- Does not apply Gmail labels
- Does not modify any emails

## Building Your Own Rules Config

The classification rules are the hardest part. Don't try to write them upfront — calibrate from real data:

1. Pull 20 recent emails from your source
2. Rate each: action_required / calendar / fyi / skip
3. Note where you disagree with your own first instinct
4. Pull 30 more and refine
5. Write the rules that emerge

See the [full walkthrough](https://claudeblattman.com/workflows/school-digest/) for the calibration method.

---

*Sanitized from a working skill. Adapt the label, categories, and rules for your source.*
