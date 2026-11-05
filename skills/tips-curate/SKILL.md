---
name: tips-curate
description: "Process collected AI tips from email, assess their quality and organize actionable findings in a searchable log."
---

# Tips Curate
*v1.5 — Added end-of-run backlog check: prompts to invoke `/tips-integrate` when unprocessed HIGH-quality tips exceed 15. Replaces a standing biweekly calendar ritual.*

Process @ToSelf emails containing Claude Code tips, AI workflow patterns, and related resources. Assess quality, extract actionable insights, and recommend what's worth keeping. Use when you say "process my tips," "curate tips," or "check @ToSelf for tips."

## Batch Fetch Note (Phase 2)

For Step 1 (Collect Batch), `mcp__google_workspace__get_gmail_messages_content_batch` may fail on list params. If batch fetch fails, process emails one at a time using `mcp__google_workspace__get_gmail_message_content`.

## Arguments

`$ARGUMENTS` can include:
- `dryrun` — Show classifications without saving or marking read
- `limit:N` — Batch size (default: 5)
- `all` — Loop through all unread in batches of 5

## Instructions

### Step 0: Pre-Checks

1. **Read the tips log** for dedup:
   - Read `~/.claude-assistant/tips/collected-tips-log.md`
   - Note all URLs and subjects already logged (these will be skipped)

2. **Count unread @ToSelf emails:**
   - Search: `label:@ToSelf is:unread` using `mcp__google_workspace__search_gmail_messages`
   - If 0 results: report "No tips to process in @ToSelf." and stop.
   - Otherwise: report count and proceed.

### Step 1: Collect Batch

1. **Fetch emails** using `mcp__google_workspace__get_gmail_messages_content_batch`:
   - Take the first N message IDs from Step 0 results (N = `limit:N` argument, default 5)
   - Extract from each: message ID, subject, date, full body text, any URLs in body

2. **Dedup check**: Skip any email whose subject or URLs already appear in `collected-tips-log.md`. Note skipped items for the report.

### Step 2: Assess & Enrich

For each email, work through this sequence:

**2a. Classify from email body + subject (no fetching yet):**

| Classification | Criteria |
|---------------|----------|
| `worth-reviewing` | Claude Code tip, AI workflow technique, useful dev/productivity pattern, prompting strategy |
| `not-relevant` | Admin, personal, social, general news, shopping, receipts |
| `needs-manual` | Can't determine (no content, video/audio link only, gated/paywalled) |

**X.com / Twitter URLs:** NEVER attempt WebFetch on X.com or Twitter URLs — they always fail. Forwarded tweets/posts from X include the post text in the email body. Classify based on that text alone.

**2b. Enrichment (only for `worth-reviewing` items with non-X URLs that lack inline context):**
- Attempt WebFetch on the URL
- If WebFetch fails: reclassify as `needs-manual`
- If WebFetch succeeds: incorporate fetched content into assessment

**2c. Quality filter (only for `worth-reviewing` items):**

Ask these questions:
1. Is this a genuinely novel technique, or repackaged documentation?
2. Is this backed by real usage (someone's production system, specific results) or engagement farming?
3. Does it solve a problem you actually have (managing projects, writing papers, managing teams, email workflows, Claude Code skills/agents)?
4. Is there a concrete action you could take based on this?

**Rate:**
- **High** — Novel + actionable + backed by real usage. You should try this.
- **Medium** — Interesting technique but may not apply directly, or partially novel.
- **Low** — Already known, superficial, or too vague to act on. (Treat as `not-relevant` for recommendation purposes.)

**2d. For High/Medium items, generate:**
- **Insight** (1-3 sentences): What's the technique? Be specific.
- **Action proposal** (1 sentence): What should you change, try, or compare? Reference your actual setup (skills, agents, rules, workflows) when possible.
- **Quality note** (1 sentence): Why this is credible/worth adopting.
- **Tags**: 1-3 from: `[skill-design]` `[prompting]` `[agent-pattern]` `[tool]` `[workflow]` `[mcp]` `[context-management]` `[coding]` `[productivity]`

### Step 3: Present Recommendations

Display in this format:

```
────────────────────
TIPS REVIEW ([N] of [M total unread] processed)
────────────────────

RECOMMENDED ACTIONS:

  1. [Subject] (High) — [1-line insight]
     Action: [what to change/try]
     Quality: [why credible]

  2. [Subject] (Medium) — [1-line insight]
     Action: [suggestion]
     Quality: [note]

SKIP (not relevant):
  3. [Subject] — [reason: admin/personal/already known/etc.]
  4. [Subject] — [reason]

NEEDS YOUR HELP:
  5. [Subject] — couldn't extract content from [URL]
     Open the link and paste content, or type "skip"

DUPLICATES SKIPPED: [list any deduped items]
────────────────────
Which to save? (e.g., "save 1,2" / "save all recommended" / "skip all")
More? (type "more" to process next batch)
```

**Wait for the user's response before proceeding.**

### Step 4: Save Approved Items

Based on the user's response:

1. **Append approved items** to `~/.claude-assistant/tips/collected-tips-log.md`:

Format each entry as:
```markdown
## YYYY-MM-DD

### [Descriptive Title] [tag1] [tag2] [quality-rating]
- **Source:** [Author/origin] ([date of original])
- **Insight:** [1-3 sentence description of the technique]
- **Action:** [Concrete next step]
- **URL:** [link]
```

Group entries under the same date heading if processing multiple on the same day. Check if today's date heading already exists before adding a duplicate.

2. **Mark processed emails as read** — but **keep `needs-manual` / deferred items UNREAD** so they stay visible:
   - Mark as read: saved items, skipped/not-relevant items
   - Keep unread: `needs-manual` items (no content, PDF unreadable, gated, etc.)
   - Use `mcp__google_workspace__modify_gmail_message_labels` with `remove_labels: ["UNREAD"]`
   - Do NOT remove @ToSelf label or INBOX — just mark read.

3. **If `dryrun` argument was given:** Skip both saving and marking read. Just show the report.

4. **Report results:**
```
Saved [N] tips to collected-tips-log.md.
Marked [M] emails as read.
[K] unread remaining in @ToSelf.

Run /tips-scout to generate a customized search prompt for next week.
```

### Step 4a: Backlog Check (v1.5)

After reporting results, count unprocessed HIGH-quality tips since the last `/tips-integrate` run:

1. Read `~/.claude-assistant/tips/integrate-state.json` → extract `last_run` field. If file or field missing, fall back to a date 30 days ago.
2. Read `~/.claude-assistant/tips/collected-tips-log.md`.
3. Count entries tagged `[high]` under `## YYYY-MM-DD` headings dated AFTER `last_run`.
4. If count > 15, append one line to the report:
   ```
   Backlog: [N] HIGH tips logged since last /tips-integrate run ([last_run]).
   Run /tips-integrate now? (yes/skip)
   ```
5. If user says "yes", invoke `/tips-integrate` in the same session. Otherwise, proceed without invoking.

This replaces any standing biweekly calendar ritual for `/tips-integrate`. Adjust the threshold (default 15) to your tip flow after observing 2-3 real runs.

5. **If `all` argument was given and more unread remain:** Loop back to Step 1 with the next batch. Present each batch for approval before continuing.

### Step 5: Log Performance

```bash
echo "$(date +%Y-%m-%d),tips-curate,TOOL_CALLS,NOTES" >> ~/.claude-assistant/logs/skill-performance.csv
```
Replace TOOL_CALLS with your exact count of tool uses this run. Replace NOTES with brief volume info (e.g., "5-processed-3-saved"). Do not skip this step.

## Error Handling

- **Gmail MCP unavailable:** "Gmail integration unavailable. Try again later."
- **Tips log file missing:** Create it with the standard header, then continue.
- **WebFetch fails on a URL:** Reclassify item as `needs-manual`. Do NOT retry.
- **Partial batch failure:** Process what succeeded, report what failed, leave failed emails unread.

## Known Limitations

| Limitation | Handling |
|-----------|---------|
| X.com/Twitter URLs always fail in WebFetch | Use email body text (forwarded posts include content) |
| Paywalled or gated content | Flag as `needs-manual` |
| Video/audio-only links | Flag as `needs-manual` |
| Quality assessment is subjective | User makes final call; skill only recommends |
| Gmail batch read max ~5-10 messages | Batches of 5 keep context manageable |

## Examples

```
/tips-curate                # Process first 5 unread @ToSelf emails
/tips-curate dryrun         # Preview classifications without saving or marking
/tips-curate limit:3        # Process 3 at a time
/tips-curate all            # Loop through all unread in batches of 5
/tips-curate all dryrun     # Preview all without saving
```

## Integration Notes

- **Run `/tips-bookmarks` before `/tips-curate`** if you have it — Twitter content is richer via bookmarks (full text vs. bare URLs). This skill catches non-Twitter items (articles, newsletters, links forwarded to self).
- Your morning briefing skill may check for unread @ToSelf count and suggest running `/tips-curate`.
- `/tips-integrate` checks whether `/tips-curate` has been run recently and prompts if stale.
- Tips log is a single searchable file — use grep/search for topics across sessions.
- The log complements (does not replace) `CLAUDE.md`, `MEMORY.md`, or rules files — you decide if a tip warrants a config change.
