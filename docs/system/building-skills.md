# Building Skills

Skills are the building blocks of a self-improving Claude Code system. This page covers how to create them from scratch.

---

## The Development Lifecycle

### 1. Notice the Pattern

The best skills come from noticing what you do repeatedly. Pay attention to:

- Prompts you type out more than twice
- Multi-step workflows you walk Claude through manually
- Tasks where you always provide the same context or constraints

### 2. Do It Manually First

Before formalizing anything, do the task with Claude Code through normal conversation. Do it 3-4 times. Each time, notice:

- What instructions you give
- What Claude gets right and wrong
- What you have to correct or clarify
- What context you always have to re-provide

### 3. Write the Skill

Create a `.md` file with:

```markdown
# Skill Name

[1-2 sentence description of what this skill does and when to use it]

## Arguments

`$ARGUMENTS` can include:
- [What the user can pass in]

## Instructions

### Step 1: [First action]
[What Claude should do]

### Step 2: [Second action]
[What Claude should do]

### Step 3: [Output]
[What Claude should show the user]
```

Save to `~/.claude/commands/your-skill.md`. Restart Claude Code.

### 4. Test and Iterate

Run the skill. It won't be right the first time. Common issues:

- **Too verbose** — Add constraints: "Keep output under 200 words"
- **Missing context** — Add more instructions or `@` references
- **Wrong format** — Specify exact output structure
- **Doesn't handle edge cases** — Add error handling sections

### 5. Stabilize

Once the skill works reliably:

- Add a version header (`*v1.0 — date — description*`)
- Add argument documentation
- Add error handling for common failures
- Test with different inputs

---

## Skill Anatomy — Key Elements

### Arguments (`$ARGUMENTS`)

The user's input after the command name. `/done quick` passes `quick` as `$ARGUMENTS`.

Common patterns:
```markdown
## Arguments
`$ARGUMENTS` can include:
- *(none)* — default behavior
- `quick` — abbreviated output
- `file:path` — specify a file
- `depth:light/standard/deep` — control thoroughness
```

### `@` References

Load external files into the skill's context:

```markdown
## Reference Files
@~/.claude/commands/my-references/style-guide.md
@~/.claude/commands/my-references/voice-rules.md
```

Use for:
- Shared rules across multiple skills
- Style guides or voice preferences — see the [Voice Pack Template](../downloads/voice-pack-template.md) for a complete example
- Configuration that changes independently

### Error Handling

Anticipate what goes wrong:

```markdown
## Error Handling
- **No input provided:** Show usage example and exit
- **File not found:** Report the missing path and suggest alternatives
- **MCP not available:** Explain what's missing and offer to proceed without it
```

### Output Format

Be explicit about what the user sees:

```markdown
### Output

Display:
| Column 1 | Column 2 |
|----------|----------|
| [data]   | [data]   |

Then ask: "Apply these changes? Or provide feedback to adjust."
```

---

## Design Principles

**One skill, one job.** A skill that tries to do three things will be fragile and hard to improve. Three focused skills are better.

**Match complexity to task.** A 5-line skill for formatting a quick note is fine. A 200-line skill for comprehensive plan review is also fine. Don't over-engineer simple tasks or under-specify complex ones.

**Default to action.** Skills should do something useful with no arguments. Make the zero-argument case the most common workflow.

**Fail gracefully.** When something goes wrong (missing file, MCP not connected), the skill should explain what happened and suggest a fix — not crash silently.

**Version and document.** Add a version header and argument documentation. Future-you will thank present-you.

---

## Patterns to Steal

These patterns appear in well-designed skills:

| Pattern | What It Does | Example |
|---------|-------------|---------|
| **Flags parsing** | Parse `$ARGUMENTS` for named flags | `depth:deep`, `file:path`, `quick` |
| **Phased execution** | Multi-step with user checkpoints | Discover → Plan → Implement |
| **Depth calibration** | Adjust thoroughness based on context | Light / Standard / Deep |
| **Critic stance** | Explicitly shift Claude's role | "You are now the critic, not the planner" |
| **Output templates** | Fixed format for consistent results | Status dashboard, review format |
| **Iteration gates** | Pause for user feedback before continuing | "Apply these changes? Or adjust?" |

See [Patterns](patterns.md) for the full catalog.

---

## Next Steps

- **[Agents vs Skills](agents-vs-skills.md)** — When to use a subagent instead
- **[Patterns](patterns.md)** — Reusable design patterns and quality checklist
- **[Skill Library](../setup/skill-reference.md)** — Study existing skills as examples
- **[Skill Design Patterns](../downloads/skill-patterns.md)** — Downloadable reference with archetypes, quality checklist, and performance logging conventions (February 2026)

<label class="page-done"><input type="checkbox"> I built a skill!</label>
