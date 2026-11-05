# Shared tips log and state

One configured tips folder is shared by all three skills and both hosts. The portable default is `~/.claude-assistant/tips/`; user-supplied paths take precedence. Do not relocate existing data automatically. Integration reads this log directly; there is no second host-specific curation log.

## Log entry

```markdown
## YYYY-MM-DD

### [Title] [skill-design] [high]
- **Key:** YYYY-MM-DD::Title
- **Source:** [author, original date; report paths and search windows if relevant]
- **Insight:** [specific finding and limits of its evidence]
- **Action:** [next step for this setup]
- **Routing:** shared — [why]
- **URL:** [original source link; multiple links if needed]
```

Use tags such as `skill-design`, `prompting`, `agent-pattern`, `tool`, `workflow`, `mcp`, `context-management`, `coding`, `productivity`. The quality tag is `high`, `medium`, or `low`. Preserve existing keys; for older entries without Key, derive `date::title` with tags removed. If keys collide for distinct tips, add a stable suffix. Treat source date and filing date as different fields. Do not assume log entries are physically in date order.

## Bookmark state

`twitter-bookmarks-seen.json` contains `seen_ids` and `last_run`; preserve other fields. Only record terminal outcomes after the corresponding save or explicit skip. `last_run` is bookkeeping, not proof that every bookmark was handled. Deferred items must remain retryable. Do not silently prune seen IDs in a way that reimports old bookmarks.

## Integration state

`integrate-state.json` belongs to `/tips-integrate`; curation reads it for the backlog nudge. Match exact item keys, not just dates, so an item filed late or on the same day is not lost. Missing state means no known dispositions. Malformed state is a blocker to changing it, not permission to erase history; curation can still save tips and report that the backlog count is unavailable.

## Write ordering and conflicts

Create a missing log only when saving is authorized. Respect configured locks and sync conflicts. Before changing a file, reread it if its hash/mtime differs; merge and deduplicate. Use atomic replacement with a temporary file beside the destination and a conflict check, or a safe locked append supported by the host. Atomic rename alone does not resolve concurrent writers. Verify writes before updating source markers. Report a partial commit rather than claiming all sources were processed.
