---
hide:
  - navigation
  - toc
---
# Patterns

Reusable design patterns for skills and workflows. These show up repeatedly in well-designed Claude Code tools.

---

## Structural Patterns

### Phased Execution

Break complex workflows into phases with user checkpoints between them.

```markdown
### Phase 1: Discovery
[Assess current state — read files, ask questions]

### Phase 2: Analysis
[Present findings, identify gaps]

**STOP: Discuss with user before proceeding.**

### Phase 3: Proposal
[Present specific plan based on discussion]

**Ask for approval before Phase 4.**

### Phase 4: Implementation
[Execute the approved plan]
```

**When to use:** Any workflow where executing the wrong thing is hard to undo. Project setup, file reorganization, bulk operations.

**Example:** `/setup-project-management` uses a 6-phase discovery → analysis → discussion → proposal → implementation → verification flow.

---

### Flags Parsing

Parse `$ARGUMENTS` for named flags to control skill behavior without separate commands.

```markdown
## Arguments

`$ARGUMENTS` supports:
- `quick` — abbreviated output
- `depth:light/standard/deep` — thoroughness level
- `file:path/to/file` — explicit input file
- `focus:dimension` — weight one aspect
- `dryrun` — show plan without executing
- `help` — show options and stop
```

**When to use:** Skills with multiple modes or configurable behavior. Keeps one skill flexible instead of creating 5 variations.

---

### Critic Stance

Explicitly shift Claude's role from collaborator to critic. Counteracts the tendency to be agreeable.

```markdown
**CRITIC STANCE:**
> You are now the critic, not the planner. Do not rationalize. Do not
> hedge. Your job is to find what's missing, what will break, and what's
> wishful thinking. If you developed this plan earlier in the session,
> that makes you *more* responsible for finding its flaws, not less.
```

**When to use:** Review and critique tasks where you want honest assessment, not validation. Especially important when Claude is reviewing its own work (though an agent is even better for this — see [Agents vs Skills](agents-vs-skills.md)).

---

### Output Templates

Define the exact format of skill output for consistency.

```markdown
### Output

```
PLAN REVIEW — [Title]
Reviewing as: [Expert role]

STRENGTHS
1. [Label] — [Explanation]

WEAKNESSES
[Red] [Label] — [Issue] → Fix: [Recommendation]
[Yellow] [Label] — [Issue] → Fix: [Recommendation]

VERDICT
APPROVE / REVISE — [Rationale]
```
```

**When to use:** Any skill that produces structured output. Consistent format makes it easier to scan results across runs and compare outputs.

---

### Iteration Gate

After producing output, explicitly ask whether to proceed, adjust, or stop.

```markdown
After presenting the review, ask:
> "Apply these revisions? Or provide feedback to refine further."

User can:
- **Accept** — apply changes
- **Give feedback** — loop back with adjustments
- **Dismiss** — end without changes
```

**When to use:** Any skill that proposes changes the user should review before they take effect.

---

## Behavioral Patterns

### Depth Calibration

Adjust how thoroughly Claude engages based on task importance.

| Level | Behavior | Default? |
|-------|----------|----------|
| **Light** | Format only, no extras | Yes |
| **Standard** | Add assumptions + rationale | No |
| **Deep** | Research + compare + verify | No |

**When to use:** Skills that handle tasks ranging from trivial to high-stakes. Avoids over-engineering simple requests while providing rigor when it matters.

---

### Graceful Degradation

When an MCP integration or file is missing, explain what's unavailable and proceed with what's possible.

```markdown
## Error Handling

- **Gmail MCP not available:** "Gmail access is not configured. I can
  still do [X] and [Y] without it. To enable email features, see the
  MCP setup guide."
- **File not found:** "Expected [file] at [path]. Proceeding without
  it — [what changes]."
```

**When to use:** Any skill that depends on MCP integrations or external files. Users shouldn't hit a dead end because one component is missing.

---

### Domain Auto-Detection

Infer the right behavior from content rather than requiring explicit flags.

```markdown
Infer the domain from content:
| Signals in content | Behavior |
|-------------------|----------|
| "regression", "RCT" | Use methodology persona |
| "proposal", "grant" | Use funding persona |
| "skill", "MCP" | Use engineering persona |
```

**When to use:** Skills that work across domains. Reduces the arguments users need to remember.

---

## Quality Checklist

Before shipping a skill, verify:

- [ ] **Does it work with no arguments?** The zero-argument case should be the most common use.
- [ ] **Is the output format specified?** Don't let Claude decide how to format results.
- [ ] **Does it handle errors?** Missing files, missing MCP, empty input.
- [ ] **Is it focused?** Does one thing well, not three things poorly.
- [ ] **Is there a version header?** `*v1.0 — date — description*`
- [ ] **Are arguments documented?** Users shouldn't have to read the instructions to know what flags exist.
- [ ] **Has it been tested with real tasks?** Not just the happy path.
- [ ] **Does it fail gracefully when MCP is unavailable?** If it uses MCP, what happens without it?
