# Turn repeatable workflows into skills

Skills save a repeatable way of working in Claude Code or Codex. Each maintained skill lives in its own folder, with instructions in `SKILL.md` and any references or scripts beside it. This page shows how to build one from work you already do.

---

## The Development Lifecycle

### 1. Notice the Pattern

The best skills come from noticing what you do repeatedly. Pay attention to:

- Prompts you type out more than twice
- Multi-step workflows you walk Claude through manually
- Tasks where you always provide the same context or constraints

### 2. Do It Manually First

Before formalizing anything, do the task through normal conversation. Repeat it enough to see which instructions help. Each time, notice:

- What instructions you give
- What the agent gets right and wrong
- What you have to correct or clarify
- What context you always have to re-provide

### 3. Write the Skill

Create a folder named after the skill, with a `SKILL.md` file inside. Start the file with metadata that says what it does and when to use it:

```markdown
---
name: your-skill
description: Describe the task this skill handles and when to use it.
---

# Your skill

[1-2 sentence description of what this skill does and when to use it]

## Inputs

Read the user's accompanying request for:
- [The details the user can provide]

## Instructions

### Step 1: [First action]
[What the agent should do]

### Step 2: [Second action]
[What the agent should do]

### Step 3: [Output]
[What the agent should show the user]
```

For a project-specific skill, use the folder for your app:

| App | File inside your project |
| --- | --- |
| Claude Code | `.claude/skills/your-skill/SKILL.md` |
| Codex | `.agents/skills/your-skill/SKILL.md` |

The name in the metadata should match the folder name. A simple skill needs only `SKILL.md`. Add `references/`, `scripts/` or `assets/` only when it needs supporting material, and keep paths relative to the skill folder. See the [Agent Skills specification](https://agentskills.io/specification).

Open a fresh session in that project. Check that the app lists the intended skill. Invoke `/your-skill` in Claude Code or select `$your-skill` in Codex, and try a real task. If the skill uses a reference, check that the agent actually reads it.

Older Claude Code commands in `.claude/commands/` still work in that app. For new skills, use the folder format. Before replacing an existing command, back it up and preserve its customizations. Check for a same-named installed skill or plugin rather than assuming the new file will be the one that runs.

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

Explain which inputs the skill accepts. Claude Code can substitute the text after a slash command through `$ARGUMENTS`. In Codex, describe how to read the user's accompanying request rather than relying on that Claude-specific substitution.

Common patterns:
```markdown
## Arguments
`$ARGUMENTS` can include:
- *(none)* — default behavior
- `quick` — abbreviated output
- `file:path` — specify a file
- `depth:light/standard/deep` — control thoroughness
```

### Supporting references

Keep reference material beside the instructions and tell the agent when to read it:

```markdown
## Reference Files
Before drafting, read `references/style-guide.md` and
`references/voice-rules.md` relative to this skill folder.
```

Use for:
- Shared rules across multiple skills
- Style guides or voice preferences — see [Teaching AI your voice](voice.md) for a complete example
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

See [Patterns](../hyperlinks/patterns.md) for the full catalog.

---

## Next Steps

- **[Agents vs Skills](../hyperlinks/agents-vs-skills.md)** — When to use a subagent instead
- **[Patterns](../hyperlinks/patterns.md)** — Reusable design patterns and quality checklist
- **[skills on GitHub](https://github.com/chrisblattman/claudeblattman/tree/main/skills)** — Study existing skills as examples
- **[Skill Design Patterns](../hyperlinks/downloads/skill-patterns.md)** — Downloadable reference with archetypes, quality checklist, and performance logging conventions (February 2026)

<label class="page-done"><input type="checkbox"> I built a skill!</label>
