---
name: goals-review
description: "Review quarterly objectives, progress scores and deadlines using the configured goals file."
---

# Goals Review

*v1.1 — Adapted for public use. Review quarterly objectives, update progress scores, and manage deadlines.*

Review quarterly objectives, update progress scores, surface deadlines, and recalibrate priorities. Run biweekly or on demand.

## Prerequisites

**Required:**
- `~/.claude-assistant/config/goals.yaml` — objectives file (see First-Time Setup)

**Optional (for evidence gathering):**
- **Gmail MCP** — for email activity evidence
- **Google Calendar MCP** — for meeting alignment evidence
- **Granola MCP** — for meeting transcript evidence
- **Apple Reminders** (macOS only) — for task-related evidence

## First-Time Setup

1. **Create config directory:**
   ```bash
   mkdir -p ~/.claude-assistant/config
   mkdir -p ~/.claude-assistant/logs
   ```

2. **Download goals template:**
   ```bash
   curl -o ~/.claude-assistant/config/goals.yaml \
     https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/goals-yaml-template.yaml
   ```

3. **Edit goals.yaml** with your objectives, weights, and key results.

4. **Test with status view:**
   ```
   /goals-review status
   ```

## Customization Points

| Setting | Where to Configure | Default |
|---------|-------------------|---------|
| **Model** | Frontmatter `model:` line | `sonnet` (remove to use default) |
| **Objectives** | `goals.yaml` → objectives | Template examples |
| **Push level** | `goals.yaml` → meta.push_level | `moderate` |
| **Review frequency** | Step 5 below | Biweekly (14 days) |
| **Evidence sources** | Step 2 below | All available MCPs |
| **Performance log** | Step 6 below | `~/.claude-assistant/logs/skill-performance.csv` |

## Arguments

`$ARGUMENTS` can include:
- *(none)* — full review with interactive progress updates
- `status` — quick dashboard only (no interactive updates)
- `deadlines` — show only upcoming deadlines

## Instructions

### Step 1: Read Goals Config

Read `~/.claude-assistant/config/goals.yaml`.

Extract:
- All objectives with key results and current progress scores
- `push_level` setting
- `upcoming_deadlines` list
- `next_review` date

If goals.yaml is missing, prompt the user to create it from the template.

### Step 2: Gather Evidence (parallel where possible)

For each **active** objective, gather recent signals using available MCP tools:

**Example patterns by objective type:**

*Research Output:*
- Search Granola for meetings in last 2 weeks mentioning papers, manuscripts, or writing
- Check Gmail for recent co-author emails (sent items) to gauge feedback turnaround

*Grant Management:*
- Check Reminders (via osascript, macOS) for grant-related items
- Search Gmail for "grant report" or "progress report" in last 30 days

*Team Effectiveness:*
- Check Gmail sent folder for team member response patterns
- Search Granola for recent project meetings

**General pattern:**
- Match each objective's name and key_results against email subjects, meeting titles, and reminder names
- If any source is unavailable, note it and continue — never block on a failed query
- Cap at 3 searches per objective

### Step 3: Compute Progress Dashboard

For each objective, determine status:
- **On track** — progress scores advancing, no overdue key results
- **At risk** — some key results stalled or behind expected pace
- **Behind** — multiple key results with no progress, approaching deadlines missed

Display:

```
# Goals Review — [Date]
Quarter: [quarter] | Push level: [level] | Next review: [date]

────────────────────

## 1. [Objective name] (weight: [N]%)
   Status: [ON TRACK / AT RISK / BEHIND]

   Key Results:
   a) [description] ............ [progress] → [suggested update]
      Evidence: [1-line summary of what was found]
   b) [description] ............ [progress] → [suggested update]
      Evidence: [1-line summary]

────────────────────

## 2. [Next objective...]
   ...

────────────────────

## Upcoming Deadlines (next 30 days)
- [date]: [description] (objective: [name])
- ...
[If none: "No deadlines in the next 30 days"]

## Stalled Areas
- [Any key result with 0.0 progress for 2+ review cycles]

## Recommendation
[1-2 sentences on what to focus on this fortnight]
```

### Step 4: Interactive Update (skip if `status` or `deadlines` argument)

For each objective, ask:
- "Update progress for [key result]? Current: [score]. Enter new score (0.0-1.0) or press Enter to keep."
- "Any deadlines to add for the next 30 days?"
- "Should push_level change? Current: [level]"

After the user provides updates, write the updated `goals.yaml` file.

### Step 5: Set Next Review

Update `next_review` in goals.yaml to 14 days from today.

Check if a biweekly reminder exists. If not, suggest:
"Create a recurring biweekly reminder 'Run /goals-review with Claude'?"

### Step 6: Log Performance

```bash
echo "$(date +%Y-%m-%d),goals-review,TOOL_CALLS,NOTES" >> ~/.claude-assistant/logs/skill-performance.csv
```

Replace TOOL_CALLS with approximate count and NOTES with brief summary.

## Error Handling

- **Granola unavailable:** Skip meeting evidence, note "Granola unavailable"
- **Gmail unavailable:** Skip email evidence, note "Gmail unavailable"
- **osascript fails:** Skip reminder evidence
- **goals.yaml missing:** Prompt user to create from template

## Integration Notes

- **Manages the `goals.yaml` file** that `/checkin` and `/morning-brief` read for goal alignment. Keep it updated here, and those skills automatically benefit.
- **Run biweekly** to keep progress scores current. Set up a recurring reminder.
- **Push level** affects how aggressively `/checkin` and `/morning-brief` nudge about calendar alignment and deep work time.
