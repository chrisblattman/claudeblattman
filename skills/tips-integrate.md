# Tips Integrate
*v2.1 — Adds a 5-persona council (Phase 1.5) that ranks candidate tips before generating proposals. Composite scoring: `mean(5 personas) − 0.1 × blocker_count`. Top 3 auto-apply (each file write still per-item confirm); items 4-7 one-tap; items 8-15 visible with full detail (not dismissed). Falls back to single-critic mode if the council agent file is missing.*

Convert collected tips, reference pack recommendations, and session follow-ups into concrete system improvements. Use after running `/tips-curate` or when you want to apply accumulated AI workflow learnings.

## Prerequisites

**Required:**
- A tips log (e.g., `~/.claude-assistant/tips/collected-tips-log.md`) — populated by `/tips-curate` or by hand
- The companion file at `~/.claude/skill-references/tips-integrate/scanning-rules.md`, installed using the public README. Check that it exists before scanning or changing any target. If it is missing, stop and explain which file is needed.

**Optional (for the 5-persona council in Phase 1.5):**
- The `proposal-critic-agent.md` file (bundled at `agents/proposal-critic-agent.md` on this site — copy to `~/.claude/agents/`)
- If the agent file is absent, the skill falls back to single-critic mode and prints a one-line note

## Tool Use

Phases 0, 1, 2, 3, 4, 5 use only: Read, Edit, Write, Glob, Grep.
Phase 1.5 uses: Task (dispatching `proposal-critic-agent` 5× in parallel) — this is the ONLY phase that dispatches subagents.

Rewriting skill/config files is per-item confirm — show each proposed edit and get approval before writing. Phase 3 default auto-applies the top 3 council-ranked items (each still gets a confirm prompt per file write, but no upfront "approve which" roundtrip).

## Arguments

`$ARGUMENTS` options (if no `source:`, scan all):
- `source:tips` — Only tips log (includes medium-rated items)
- `source:refs` — Only reference packs
- `source:session` — Only session log
- `dryrun` — Show proposals without writing
- `since:YYYY-MM-DD` — Only items after this date
- `compact` — Prune old state entries, then stop
- `--full` — Show full ranked list (top 7 + items 8-15) and use numbered approval flow

## Instructions

### Phase 0: Pre-Checks

0. **Tips freshness check:** Search `~/.claude-assistant/logs/skill-performance.csv` for most recent `tips-curate` row.
   - File missing/unreadable: skip check, proceed.
   - No entry found: warn "Tips have never been curated. Run `/tips-curate` first." Offer yes/skip.
   - Entry >14 days old: warn with date, offer yes/skip.
   - ≤14 days: proceed silently.

1. **State file** at `~/.claude-assistant/state/integrate-state.json` — read or create with default structure (see below). Extract `last_run` for filtering.

2. **Auto-prune:** Remove `deferred_items` >90 days old; strip `change_summary` from `integrated_items` >6 months old. If `compact` argument: save, report counts, STOP.

3. **System inventory** — Glob for file **names only** (do NOT read contents):
   - `~/.claude/commands/*.md` and `~/.claude-assistant/rules/*.md`

4. **CLAUDE.md inline triggers** — Read only the "Inline triggers" section through the next `---` for dedup.

### Phase 1: Scan Sources

**Read `~/.claude/skill-references/tips-integrate/scanning-rules.md` first** — it has tag-to-target mappings, the direct-vs-investigation heuristic, and source-specific parsing logic. Follow those rules for all parsing details below.

**Context budget (IMPORTANT):**
- Tips/session log: only entries since `last_run` (first run: last 30 days)
- Reference packs: only `actionable.md` or `direct_advice.md`
- **NEVER read target file contents during scanning** — full reads happen in Phase 4

Skip any item whose `item_key` appears in state file's `integrated_items` or `deferred_items`.

**Sources** (skip gracefully if any source file is missing):

| Source | Path | Key format | Notes |
|--------|------|------------|-------|
| A: Tips | `~/.claude-assistant/tips/collected-tips-log.md` | `YYYY-MM-DD::Title` | Default: `[high]` only; `source:tips` includes `[medium]` |
| B: Ref packs | `~/.claude-assistant/reference-packs/*/` | `ref-pack:dirname::rec-title` | Needs `actionable.md` or `direct_advice.md` |
| C: Session log | `~/.claude-assistant/logs/session-log.md` | `session:YYYY-MM-DD::text-60chars` | Unchecked `- [ ]` items with infrastructure keywords only |

### Phase 1.5: Prioritization Council (NEW in v2.1)

**Purpose:** Rank candidate tips before generating proposals, so you approve 3-5 high-conviction items instead of triaging 20.

**Skip condition:** If Phase 1 yielded ≤5 candidates, skip Phase 1.5 entirely and pass all candidates to Phase 2.

**Council agent check:** Glob `~/.claude/agents/proposal-critic-agent.md`. If missing, run in **single-critic fallback mode** — dispatch one persona-agent run instead of five, print one-line note: *"proposal-critic-agent.md not found in ~/.claude/agents/ — running in single-critic mode. Install the agent file from claudeblattman.com/agents/proposal-critic-agent.md for full 5-persona council."* Skip the rest of Phase 1.5; pass the unranked top-15 to Phase 2.

**Cost & risk preconditions (non-blocking):**

1. **Peak-hour advisory** — if local time is during your provider's peak window, print one line: "Peak-hour rate-limit penalty may apply. Proceed? (yes/defer)". `defer` writes the council input batch to state file field `pending_council_batch` and exits cleanly.
2. **Budget pre-commit** — print expected run size: "Council will dispatch 5 Sonnet personas × ~35K tokens each = ~175K Sonnet tokens."

**Pre-dispatch dedup:**

1. Read your CLAUDE.md "Inline triggers" section (if you have one).
2. Read any active-todo file you maintain.
3. Drop candidate tips whose Action line names a file, skill, or concept already in either source. Record drops in state `deferred_items` with reason `"already queued in [source]"`.
4. Cap remaining batch at top 15 by `[high]` tag + recency (most recent first).

**Dispatch council (parallel):**

Use the Task tool to dispatch `proposal-critic-agent` 5× in parallel, each with a different persona passed in the prompt. Personas:

1. **Catalog Conflict** — duplicates/collisions with existing skills
2. **Maintenance Tax** — 6-month upkeep cost, rot risk
3. **Compounder** — amplifies existing skills vs. standalone
4. **First-Run** — 30-minute first step
5. **Skeptic** — engagement farming vs. durable practitioner use

Each persona receives: (a) the persona name, (b) the full candidate batch text (pre-filtered), (c) a reminder to score EVERY tip and return ONE block per tip. All 5 use Sonnet, 200K context. Pin model explicitly via agent frontmatter.

**Retry policy:** 1 retry per agent on 429/529 or timeout. If a persona ultimately fails, proceed with the remaining (minimum 3 agents required to continue — below 3, abort and surface "Council failed: only N/5 voices returned. Council input written to state; rerun later."). Flag any missing persona in the output header.

**Cross-critique synthesis (inline, not a subagent):**

After all agents return (or max 3 have returned):

1. Aggregate: for each tip, list all 5 personas' scores and blocking concerns.
2. Compute composite: `composite = mean(5 scores) − 0.1 × blocker_count`. Additive penalty, not multiplicative — a tip with all 5 blockers retains most of its mean value. The council RANKS, it does not DISMISS. No clamping at zero.
3. Apply the cross-critique question: "Looking at the 5 personas' outputs together, what did all 5 miss about each top-10 candidate?" Answer in 1-2 sentences per top-10 tip. This catches convergent blind spots.
4. Rank. **Top 7 advance to Phase 2.** Items 8-15 are presented as "deferred" but with full detail, not dismissed. The user can promote any deferred item.
5. Write output file: `~/.claude-assistant/tips/council-YYYY-MM-DD.md` containing: (a) header with voice-count status, (b) top-7 ranked list with all persona scores + dissent + "what all missed" note, (c) items 8-15 with same level of detail, (d) timing + token-estimate.

**Update state:** add `last_council_run: YYYY-MM-DD` to state file.

### Phase 2: Generate Proposals (top 7)

Operates only on the top-7 council output from Phase 1.5 (or all candidates if Phase 1.5 was skipped).

Use the direct-vs-investigation heuristic from `~/.claude/skill-references/tips-integrate/scanning-rules.md`. **When in doubt, choose Type B** — vague direct edits are worse than honest "needs research" tasks.

**Type A — Direct** (names a specific existing file + concrete bounded change <10 lines):
```
DIRECT [N/5] | Source: [...] | File: [path] | Council: [composite score]
Item: [title]
Current: [3-5 lines from target — read ONLY for Type A]
Change: [diff-style preview, <10 lines]
Rationale: [1 sentence]
```

**Type B — Investigation** (directional but needs research/design first):
```
INVESTIGATION [N/5] | Source: [...] | Council: [composite score]
Item: [title]
Task: [1-2 sentences — what to research/design]
Rationale: [1 sentence]
```
Investigation tasks go to your learning catalog (`~/.claude-assistant/catalog/skills-learning-catalog.md`) under the `## INBOX — New Items` section.

For Type A only: read the specific target file section (not entire file) for `Current:` field.

### Phase 3: Auto-Apply Top 3, Approve 4-7, Review 8-15

- No items found: "No new items to integrate. [N] previously processed." STOP.
- `dryrun`: show proposals + council output path, STOP (do not apply or write).

**Default flow (no `--full` argument):**

1. **Top 3 — auto-apply.** Show each of the top-3 ranked proposals and apply them in sequence. Each file write is still per-item confirm — you see each Edit preview and can say "skip" to drop that item, but no upfront "approve which" roundtrip.
2. **Items 4-7 — one-tap approve.** After top 3 apply, present:
   ```
   COUNCIL ITEMS 4-7 (one-tap)

   4. [title] — [type] — [council rationale]
   5. [title] — [type] — [council rationale]
   6. [title] — [type] — [council rationale]
   7. [title] — [type] — [council rationale]

   Apply? (e.g. "4,6" / "all" / "none" / "promote 10")
   ```
3. **Items 8-15 — shown briefly.** Title + composite score + single-line reason. The user can promote any via `"promote [N]"` in the approval line above. Nothing is dismissed without the user seeing it.

**With `--full` argument:**

Show the full ranked list (top 7 + items 8-15 with council reasons) and use numbered approval:
```
INTEGRATE REVIEW — 7 top proposals + [N] items 8-15

TOP 7: [numbered list with file + change preview + council score]
ITEMS 8-15: [numbered list with title + composite + top blocker]

Apply which? (1,3,5 / all top / all / none / promote 10,12)
```

**Wait for response before proceeding.**

### Phase 4: Execute Approved Changes

- **Direct:** Read full target file, apply edit, record in state as `integrated_items` (`type: "direct"`, `change_summary`).
- **Investigation:** Append to `~/.claude-assistant/catalog/skills-learning-catalog.md` under `## INBOX — New Items` as `- [ ] **YYYY-MM-DD** — **[Title]** — [description]. *(Source: /tips-integrate, YYYY-MM-DD)*`. Do not modify any other section of that file. Record in state (`type: "investigation"`).
- **Deferred/rejected:** Record in state with reason (user's words or "deferred"/"rejected").

Save updated state file.

### Phase 5: Report & Log

Show: council voice-count (e.g., "5/5" or "4/5 — Skeptic failed"), direct changes applied (file + summary), investigation tasks added, council-deferred count (items 8-15), previously-processed skipped count, sources scanned, path to council output file.

Log: `echo "$(date +%Y-%m-%d),tips-integrate,TOOL_CALLS,[N]-direct-[M]-investigate-[K]-council-deferred-[V]-voices" >> ~/.claude-assistant/logs/skill-performance.csv`
Replace TOOL_CALLS with your exact count of tool uses this run. Task agents dispatched in Phase 1.5 count as tool calls.

## State Management

**File:** `~/.claude-assistant/state/integrate-state.json`

```json
{
  "schema_version": 2,
  "last_run": "2026-04-16",
  "last_council_run": "2026-04-16",
  "pending_council_batch": null,
  "integrated_items": [
    { "source": "tips", "item_key": "2026-02-20::SDD Pattern", "date_integrated": "2026-02-22",
      "target": "skills-learning-catalog.md", "type": "investigation", "change_summary": "Added to INBOX" }
  ],
  "deferred_items": [
    { "source": "tips", "item_key": "2026-02-20::Volt Tool", "date_deferred": "2026-02-22",
      "reason": "Tool not mature enough" },
    { "source": "tips", "item_key": "2026-04-16::Example Tip", "date_deferred": "2026-04-16",
      "reason": "council-deferred: composite 2.1, Maintenance Tax blocker" }
  ]
}
```

**Schema v1 → v2 migration:** on first run after upgrade, if `schema_version` is 1 or missing, set it to 2 and add `last_council_run: null` and `pending_council_batch: null`. Do not touch existing `integrated_items` or `deferred_items`.

**`pending_council_batch`:** set when Phase 1.5 defers on peak-hour warning; contains the pre-filtered candidate batch so the next invocation can resume without re-scanning. Cleared after successful council run.

## Error Handling

General rule: missing source files are skipped gracefully with a note. Missing state file or skills-learning-catalog.md are created fresh. Corrupt state file triggers a warning and fresh creation. Target file missing for a direct edit skips that proposal with a warning. Missing `proposal-critic-agent.md` triggers single-critic fallback mode (see Phase 1.5).

## Integration Points

| Skill / File | Role |
|--------------|------|
| `/tips-curate` | Upstream — collects and rates tips; can trigger `/tips-integrate` when backlog > 15 HIGH |
| `/done` | Upstream — writes session log follow-ups |
| `agents/proposal-critic-agent.md` | Dispatched 5× in Phase 1.5 (5 personas) |
| `skills-learning-catalog.md` | Downstream — receives investigation tasks (INBOX) |

## Opportunistic Cadence (no calendar ritual)

This skill is NOT biweekly. It runs opportunistically:

- `/tips-curate` checks if unprocessed HIGH tips > 15 since last `/tips-integrate` run and, if so, prompts to invoke this skill.
- The user can always invoke manually after a rich batch of tips lands.
- If <5 candidates after Phase 1 dedup, Phase 1.5 is skipped — straight to Phase 2 on the small batch.
