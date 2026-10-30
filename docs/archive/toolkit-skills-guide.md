# Skills Guide

Skills (also called slash commands) are reusable prompts that run inside Claude Code with a single command. Instead of typing out a detailed prompt every time you want to triage your inbox or summarize a meeting, you type `/done` or `/review-plan` and the skill handles the rest.

---

## What Skills Are

A skill is a markdown file saved in your commands folder. It contains:

- **Instructions** — What Claude should do when you invoke the command
- **Arguments** — Optional inputs you can pass (e.g., `/done quick`)
- **References** — Other files the skill loads for additional context

When you type `/skillname` in Claude Code, it reads the corresponding markdown file and follows the instructions as if you'd typed them out manually.

**That's it.** Skills are just saved prompts with a shortcut. No code, no compilation, no special syntax.

---

## Where Skills Live

```
~/.claude/commands/
├── done.md              → /done
├── prompt.md            → /prompt
├── prompt-only.md       → /prompt-only
├── review-plan.md       → /review-plan
└── prompt-references/
    └── formatting-core.md   (companion file, not a command)
```

Every `.md` file in `~/.claude/commands/` becomes a slash command. The filename (minus `.md`) becomes the command name.

Subdirectories create namespaced commands: `prompt-references/formatting-core.md` becomes `/prompt-references:formatting-core` (but this is typically used as a companion file, not invoked directly).

---

## How to Install a Skill

!!! warning "Read before you install"
    Skills are executable instruction files — when you run them, Claude follows every instruction in the file, including MCP tool calls (searching email, writing to Google Docs, creating calendar events). Before installing a skill from any source, open the `.md` file and read through it. Skills from this site are published on [GitHub](https://github.com/chrisblattman/claudeblattman/tree/main/skills) where you can review the full source.

1. **Create the commands folder** (if it doesn't exist):
   ```bash
   mkdir -p ~/.claude/commands
   ```

2. **Save the skill file:**
   ```bash
   # Option 1: Download from GitHub
   curl -o ~/.claude/commands/done.md \
     https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/done.md

   # Option 2: Copy from this site
   # Copy the code block from the Skill Library page and save to a file
   ```

3. **Restart Claude Code** (new commands are loaded at startup)

4. **Test it:**
   ```
   > /done help
   ```

---

## How to Use a Skill

Type `/` followed by the skill name:

```
> /done
> /done quick
> /prompt Draft an email to the team about the schedule change
> /review-plan file:~/Documents/project-plan.md
```

Most skills accept arguments — text after the command name that gets passed to the skill as `$ARGUMENTS`.

---

## Anatomy of a Skill File

Here's a minimal example:

````markdown
# Session Capture

Capture key decisions and follow-ups from the current session.

## Arguments

`$ARGUMENTS` can include:
- *(none)* — full capture
- `quick` — abbreviated capture

## Instructions

### Step 1: Review the conversation

Scan the conversation history for:
- Decisions made
- Open questions
- Follow-up tasks

### Step 2: Write summary

Display a structured summary with decisions, questions, and next steps.
````

The structure is flexible. Claude reads the whole file as instructions, so use whatever markdown structure makes the instructions clear.

### Key Elements

| Element | Purpose | Required? |
|---------|---------|-----------|
| `# Title` | Human-readable name | Recommended |
| `## Arguments` | Documents what `$ARGUMENTS` accepts | If skill takes input |
| `## Instructions` | The core logic — what Claude should do | Yes |
| `$ARGUMENTS` | Placeholder replaced with user's input | If skill takes input |
| `@path/to/file` | Loads a companion file's contents into context | Optional |

---

## The `@` Reference System

Skills can reference other files using `@path/to/file` syntax. This loads the referenced file's contents into the skill's context at runtime.

```markdown
## Reference Files
@~/.claude/commands/prompt-references/formatting-core.md
```

**How it works:**
- Claude Code reads the file at the specified path
- The file's contents are injected into the skill's context
- If the file doesn't exist, the reference silently fails (the skill still runs, just without that context)

**Common uses:**
- Shared formatting rules across multiple skills
- Style guides or voice references
- Configuration files that change independently of the skill

**Important:** `@` references use absolute paths. If you download a skill that references `@~/some/path/file.md`, you need that file at that exact location on your machine.

---

## Building Your Own Skills

Creating a new skill:

1. Identify a task you do repeatedly with Claude Code
2. Write out the prompt you'd normally type
3. Save it as a `.md` file in `~/.claude/commands/`
4. Add `$ARGUMENTS` where you want user input
5. Test and iterate

The [Build Your Own](../build-your-own/building-skills.md) section goes deeper into skill development patterns, quality checklists, and advanced techniques.

---

## Tips

**Start by using skills before building them.** Install 2-3 from the [Skill Library](../hyperlinks/skill-reference.md), use them for a week, and notice what works and what you'd change. That's the best way to learn what makes a good skill.

**Skills should do one thing well.** A skill that tries to triage email, update your calendar, and draft responses will be fragile. Three focused skills are better than one bloated one.

**Match skill complexity to task complexity.** A 3-line skill for formatting quick notes is fine. A 200-line skill for comprehensive plan review is also fine. The skill should be as complex as the task requires — no more, no less.

**Iterate in conversation first.** Before formalizing a workflow as a skill, do it manually with Claude Code a few times. Refine the instructions through conversation, then capture the final version as a skill.

---

## What's Next

- **[Skill Library](../hyperlinks/skill-reference.md)** — Browse and download pre-built skills
- **[Building Skills](../build-your-own/building-skills.md)** — Learn to create your own
