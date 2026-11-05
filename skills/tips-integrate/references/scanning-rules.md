# Scanning Rules — /tips-integrate Reference
*v1.0 — 2026-02-21*

Parsing logic and heuristics for each source, kept here to avoid bloating the main skill file.

---

## 1. Tag-to-Target Mapping

When a tip or recommendation includes tags, use this mapping to identify the likely target file or category:

| Tag | Primary Target | Notes |
|-----|---------------|-------|
| `[skill-design]` | Existing skill in `~/.claude/skills/` or legacy `~/.claude/commands/` or new skill task | Match against system inventory first |
| `[prompting]` | `~/.claude/skills/prompt*/SKILL.md`, legacy `~/.claude/commands/prompt*.md` or prompt preferences file | |
| `[agent-pattern]` | `~/.claude/agents/*.md` or new agent task | |
| `[tool]` | `~/.claude-assistant/rules/tool-limitations.md` | Add to comparison table |
| `[tool-comparison]` | `~/.claude-assistant/rules/tool-limitations.md` | |
| `[workflow]` | `~/.claude-assistant/rules/*.md` or CLAUDE.md | Depends on scope |
| `[mcp]` | `~/.claude-assistant/rules/integration-notes.md` | |
| `[context-management]` | Skill design patterns or CLAUDE.md | Usually investigation |
| `[coding]` | Usually investigation — no standard target | |
| `[productivity]` | Rules or CLAUDE.md | Depends on specificity |

When a tip has multiple tags, prioritize the most specific one for targeting. E.g., `[skill-design] [workflow]` → the skill-design tag is more actionable.

---

## 2. Reference Pack Contract

For `/tips-integrate` to scan a reference pack, the pack directory MUST contain one of:
- `actionable.md` — Distilled action items from the reference material
- `direct_advice.md` — Direct recommendations extracted from the source

**Pack location:** `~/.claude-assistant/reference-packs/*/`

If neither file exists, the pack is treated as raw reference material (not yet processed for integration). The skill skips it with a note.

**When building new reference packs** (via `/tips-curate` or manual creation), include an `actionable.md` file to enable `/tips-integrate` scanning. Format each recommendation as:

```markdown
### [Recommendation Title]
- **Action:** [Concrete thing to do]
- **Target:** [Which file/skill/rule this affects, if known]
- **Priority:** [high / medium]
```

---

## 3. Session Log Filtering

The session log (`~/.claude-assistant/logs/session-log.md`) contains follow-ups from `/done` sessions. Most are project-specific tasks — `/tips-integrate` only cares about system infrastructure items.

**Include** follow-ups containing any of these keywords (case-insensitive):
- skill, rule, CLAUDE.md, config, command, agent, policy, settings
- MCP, integration, tool-limitations, self-improvement
- permission, hook, alias, symlink, sync

**Exclude** follow-ups that are purely about:
- Specific research projects (unless about tooling for those projects)
- Team management tasks (unless about team-facing tools)
- Email/calendar actions (send X, schedule Y — these are tasks, not system changes)
- Paper writing or editing tasks

**Parsing approach:**
1. Find `### Follow-ups` sections within entries dated within the scan window
2. Extract lines matching `- [ ]` (unchecked items only)
3. Apply keyword filter
4. Skip items already in state file

---

## 4. Direct vs. Investigation Heuristic

**Generate Type A (Direct Proposal) when ALL of these are true:**
1. The Action line names a **specific existing file** (e.g., "Add X to tool-limitations.md")
2. The change is **concrete and bounded** (add a section, add a table row, modify a specific line)
3. The target file exists in the system inventory
4. The change is **under 10 lines** of new/modified content

**Trigger words for Type A:** "Add", "Update", "Append", "Include", "Insert", "Remove", "Change X to Y"

**Generate Type B (Investigation Proposal) when ANY of these are true:**
1. The Action uses hedging language: "Consider", "Explore", "Compare", "Evaluate", "Research", "Look into", "Check if", "Monitor"
2. The action references **creating something new** (new skill, new agent, new config file)
3. The action is **directional but vague** (no specific file or specific change identified)
4. The change would require **design decisions** before implementation
5. The change would be **more than 10 lines** and needs a plan

**When in doubt, choose Type B.** An honest "needs research" task in todo-items.md is more useful than a vague direct edit that you can't evaluate.

---

## 5. Tips Log Parsing

The tips log uses this entry format:
```markdown
## YYYY-MM-DD

### [Title] [tag1] [tag2] [quality-rating]
- **Source:** [Author/origin]
- **Insight:** [Description]
- **Action:** [Concrete next step]  ← This is the proposal seed
- **URL:** [link]
```

**Extracting the item key:** Combine the date heading with the entry title: `YYYY-MM-DD::Title` (strip tags and quality rating from title).

**Quality filtering:**
- Default scan: only `[high]` items
- With `source:tips`: include `[medium]` items too
- `[low]` items are never surfaced (they were already filtered by `/tips-curate`)

**Date filtering:**
- Read the `## YYYY-MM-DD` headings to identify date boundaries
- Only parse entries under date headings that fall within the scan window
- Stop reading when you hit a date heading older than the scan window
