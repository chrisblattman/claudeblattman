# Skill Patterns & Conventions

Extracted from 20 production skills + best practices from [Anthropic's skill-building guide](https://claude.com/blog/complete-guide-to-building-skills-for-claude), [@rohit4verse's overview](https://x.com/rohit4verse), and internal quality rubrics.

---

## Design Conventions

### 1. Policy-First Architecture
Every non-trivial skill reads config/policy files **before** doing anything:
- A `policies/` directory — VIP lists, skip-inbox rules, calendar IDs
- A `config/` directory — Label IDs, vendor domains, classification rules
- Config is the source of truth; the skill body describes *workflow*, not *data*

### 2. Config/State Separation
- **Config files** (read-only during execution): Classification rules, label mappings, policy lists
- **State files** (read/write): Processing history, deduplication, thrash detection — stored in `state/` with `schema_version` field, pruned >30 days

### 3. Graceful Degradation
No skill blocks if one source is unavailable. Pattern:
```
Collect from Source A → if fails: "Note unavailable, continue"
Collect from Source B → if fails: "Note unavailable, continue"
Report which sources succeeded/failed in metadata
```

### 4. Pre-Approved Tools
Complex skills declare upfront: *"DO NOT use Task agents or ToolSearch. All required tools are pre-approved. Call them directly."* This eliminates permission prompts and speeds execution.

### 5. Phased Execution
Most skills follow: **Pre-checks → Collect → Process → Report**
- Numbered steps (Step 0, Step 1, ...)
- Clear inputs/outputs per step
- Pre-checks verify dependencies exist before main logic

### 6. Confirmation Gates
Three tiers:
- **Auto-apply** (morning-brief triage) — pre-approved policy exception
- **Batch confirm** (todoq, triage-reminders) — show proposed actions, apply in bulk
- **Per-item confirm** (expense-process) — each item needs explicit approval

### 7. Arguments via Colons
Standard override syntax: `days:N`, `since:YYYY-MM-DD`, `month:MM`, `list:Name`, `dryrun`

### 8. Output Conventions
- Section separators: `────────────────────`
- Priority markers: red/yellow/green/blue circles
- No markdown tables in Google Docs output (bullet/sub-bullet instead)
- Bold labels for scannability

---

## Archetype Mapping

How 20 production skills map to the three standard categories from Anthropic's guide:

### Simple / Lightweight (< 500 words, single-purpose)
| Skill | Category | Notes |
|-------|----------|-------|
| filter-political | Triage | Single Gmail query + label |
| doc-feedback | Triage | Collect friction points |
| todo-add | Workflow | Interactive single-item adder |

### Medium Complexity (500-2000 words, multi-step)
| Skill | Category | Notes |
|-------|----------|-------|
| todo-queue | Workflow | Gmail search → batch Reminders creation |
| auto-read-stale | Workflow | Age-based newsletter auto-read |
| todo-review | Project Mgmt | Consolidated review across 3 lists |
| whatsapp-summary | Project Mgmt | Date-range WhatsApp digest |
| task-from-email | Workflow | Email parsing → Reminder with confirmation |
| proposal-write | Research | Checklist-first proposal drafting, plan-mode-aware, voice pack |
| proposal-revise | Research | Collaborator handoff pattern, conditional reviewer categorization, voice pack |

### Complex / Stateful (> 2000 words, multi-source, stateful)
| Skill | Category | Notes |
|-------|----------|-------|
| triage-inbox | Triage | ML-like classification scoring, state tracking |
| morning-brief | Project Mgmt | 5+ data sources, HTML email output, auto-triage |
| triage-reminders | Project Mgmt | Heavy state: thrash detection, EW mappings, history |
| setup-project-management | Project Mgmt | 6-phase discovery-to-implementation |
| project-status-update | Project Mgmt | Multi-source institutional dashboard |
| expense-process | Workflow | Stateful, per-item approval, reconciliation |
| weekly-review | Project Mgmt | Decomposed Feb 15: 1,563-word core + 4 reference files (2,203 words) |

---

## Performance Logging Convention

**All skills should log to skill-performance.csv at completion.** This makes the CSV a comprehensive usage signal for `/skill-inventory` and `/skill-perf`.

### How to Log

Add as the final step of any skill:

```bash
echo "$(date +%Y-%m-%d),SKILL_NAME,TOOL_CALLS,NOTES" >> ~/.claude/logs/skill-performance.csv
```

- `SKILL_NAME`: kebab-case skill name (e.g., `morning-brief`, `todo-add`)
- `TOOL_CALLS`: approximate count of MCP/tool calls made during execution (use `~N` if uncertain)
- `NOTES`: brief dash-separated summary (e.g., `7-emails-3-labeled`, `status-only`)

Currently only "High-tier" skills log consistently. Extend this to all skills so `/skill-inventory` can report actual usage across the full library.

---

## Skill Locations

- **Standard skills**: `~/.claude/commands/`
- **Domain-specific skills**: Can live in their own directories (e.g., a `proposal-resources/skills/` folder) and be symlinked into `commands/`. Use this pattern for skills that:
  - Share domain-specific reference files (voice packs, templates)
  - May be used by team members independently
  - Belong logically with their domain data, not with general tools

---

## Gap Analysis

### What Works Well
- **Config externalization** — Rules live in policy files, not hardcoded in skills
- **Graceful degradation** — MCP failures never block execution
- **Safety gates** — Confirmation tiers match risk level
- **Auditability** — State files + processing logs provide forensic trail
- **Consistency** — All skills follow the same phased execution pattern

### What Could Improve

**1. ~~Heavy skills exceeding recommended 5K words~~ — RESOLVED (Feb 15, 2026)**
- `weekly-review` was decomposed into 1,563-word core + 4 reference files (2,203 words total in `commands/weekly-review-references/`)
- No skills currently exceed 5K words (largest: triage-reminders at 3,703 words)

**2. ~~No validation or testing checklist~~ — ADDRESSED (Feb 15, 2026)**
- Added a Quality Checklist (see bottom of this document) covering structure, behavior, integration, and testing phases

**3. No decomposition discipline**
- Some skills bundle distinct responsibilities (e.g., morning-brief does calendar + reminders + email + weather + triage)
- A common recommendation: *"If a skill does 3+ unrelated things, decompose it"*
- **Counter-argument:** Our bundled skills are intentionally orchestrated workflows where the combination *is* the value. Decomposition would add overhead without benefit for most of these.

**4. No failure mode documentation**
- Skills handle errors gracefully in code but don't document *expected* failure modes for the user
- **Opportunity:** Add a brief "Known limitations" section to complex skills

**5. ~~No version tracking~~ — ADDRESSED (Feb 15, 2026)**
- All 22 active skills now have `*v1.0 — date — description*` version lines
- Convention: single line after title, overwrite (not append) on each change
- See `claude-under-the-hood.md` Module 5 for rationale

---

## Best Practices Adopted

From Anthropic's guide, @rohit4verse, and @eyaborai — practices to follow for new skills:

### Architecture (Why These Conventions Matter)
- **Progressive disclosure**: Claude pre-loads only skill name + description (~100 tokens each) at startup. The full body loads only when the description matches the user's request. This is why the "description includes WHAT + WHEN" checklist item is critical — it's literally the trigger mechanism.
- **Context degradation**: Quality degrades around 45% of the context window. This is why we keep skills under 5K words and use subagents to offload research — preserving main-conversation context for the actual work.
- **Prefix stability (prompt caching)**: Claude Code's entire harness is built on prefix-matching cache. Skills must preserve a stable prefix: (1) Static content first, dynamic content last. (2) Never add/remove tools mid-session — use subagents instead. (3) Never switch models mid-session — use subagent handoff (e.g., Explore agents use Haiku). (4) Use system-reminder messages for updates instead of changing the system prompt. (5) Treat cache breaks as incidents. *(Source: Thariq/Claude Code team, Feb 2026)*

### Planning Phase
1. **Start with 2-3 concrete use cases** before writing any skill content
2. **Define success criteria** — what does "working correctly" look like?
3. **Identify all tools needed** — MCP servers, scripts, osascript, file paths
4. **Check for existing skills** that overlap — compose rather than duplicate

### Writing Phase
5. **Description field**: `[What it does] + [When to use it] + [Key capabilities]`
6. **Put critical instructions first** — Claude may not reach the bottom of long skills
7. **Use explicit language** — "ALWAYS", "NEVER", "MUST" for non-negotiable rules
8. **Include examples** for ambiguous operations
9. **Reference bundled files** rather than inlining large content

### Testing Phase
10. **Test triggering** — does it activate on natural phrasing? Does it avoid false positives?
11. **Test graceful degradation** — what happens when an MCP is down?
12. **Compare to baseline** — is the skill actually better than no skill?

### Maintenance Phase
13. **Review periodically** — are the policy files still accurate?
14. **Prune state files** — enforce the >30-day cleanup rule
15. **Watch for drift** — do MCP tool names still match? Did APIs change?

---

## Quality Checklist

Use when creating or reviewing skills.

### Structure
- [ ] `name` field is kebab-case
- [ ] `description` includes WHAT, WHEN, and key capabilities (under 1024 chars)
- [ ] No XML angle brackets in frontmatter
- [ ] Skill body under 5,000 words (move extras to `references/`)
- [ ] Critical instructions appear in the first 500 words

### Behavior
- [ ] Reads config/policy files before acting (if applicable)
- [ ] Handles MCP unavailability gracefully (doesn't block)
- [ ] User confirmation gates match the risk level of actions
- [ ] Arguments use colon syntax (`days:N`, `dryrun`) where applicable
- [ ] Includes explicit error handling for known failure modes

### Integration
- [ ] All MCP tools called directly (no unnecessary ToolSearch)
- [ ] State files have `schema_version` field (if stateful)
- [ ] Output format matches destination (no markdown tables in Google Docs)
- [ ] File paths use consistent conventions (`~/.claude/` for skills, project directories for config)

### Testing
- [ ] Triggers on 2-3 natural phrasings of the request
- [ ] Does NOT trigger on unrelated queries
- [ ] Produces correct output on a representative test case
- [ ] Degrades gracefully when one data source is unavailable
