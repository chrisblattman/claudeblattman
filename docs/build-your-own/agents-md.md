# Your CLAUDE.md / AGENTS.md file

A `CLAUDE.md` file is a personal instruction document that Claude Code reads automatically every time you start a session. It tells Claude who you are, how you work, what tools you use, and what you need help with.

Without it, every session starts fresh. With it, Claude begins each session already understanding your context.

**Codex reads a file called `AGENTS.md` instead** — same idea, different filename. If you use both
apps, you want one file, not two that drift apart. [How to do that](#if-you-use-codex-too-agentsmd)
is at the end of this page; everything between here and there applies to both.

---

## Why This Matters

A good CLAUDE.md file:

- **Saves time** — No more repeating "I'm a researcher working on X using Y tools"
- **Improves responses** — Claude tailors suggestions to your actual workflow and skill level
- **Reduces errors** — When Claude knows where your files live, it gives relevant paths and suggestions
- **Compounds** — As you refine the document, Claude gets better at helping you

The investment is small (20-30 minutes to start) and the payoff grows with every session.

---

## Where to Store It

### Single Computer

Claude Code looks for your CLAUDE.md here:

```
~/.claude/CLAUDE.md
```

The `~` means your home folder. The `.claude` folder is hidden (folders starting with `.` are hidden by default).

**To create it on Mac** (`mkdir -p` creates a folder; `~` means your home directory):
```bash
mkdir -p ~/.claude
```

**To see hidden files in Finder:** Press `Cmd + Shift + .`

### Multiple Computers (Recommended)

If you work across machines, store your CLAUDE.md in a synced folder and create a symlink:

A symlink is a shortcut — it makes a file appear in two places at once. `ln -sf` creates one. This lets you store the real file in a synced folder while Claude Code finds it in its expected location.

```bash
# Store the real file in your cloud sync folder
# (replace with your actual path — Dropbox, OneDrive, iCloud, etc.)
mkdir -p ~/Documents/Claude-Settings

# Create the symlink so Claude Code finds it
mkdir -p ~/.claude
ln -sf ~/Documents/Claude-Settings/CLAUDE.md ~/.claude/CLAUDE.md
```

Repeat the symlink step on each computer. Now your CLAUDE.md syncs automatically.

!!! ask-claude "Not sure the symlink worked?"
    In the app's message box, type:
    `I set up the symlink but I'm not sure it worked. Can you verify it's connected properly?`
    Press Enter. Claude can check the symlink and tell you if it's pointing to the right file.

---

## Template

Copy this template and fill in the sections relevant to you. Delete any sections that don't apply.

````markdown
# Claude Context: [Your Name]

## Who I Am

[1-2 sentences about your role.]

## My Primary Work

- [Main responsibility 1]
- [Main responsibility 2]
- [Main responsibility 3]

## Tools and Software

| Tool | What I Use It For | Where Files Live |
|------|-------------------|------------------|
| [e.g., Stata] | [e.g., Statistical analysis] | [e.g., ~/Research/] |
| [e.g., Google Docs] | [e.g., Writing, collaboration] | [e.g., Google Drive] |

## Where My Files Are Stored

- **Working files:** [e.g., ~/Dropbox/Research/]
- **Data:** [e.g., ~/Box/Data/ — note if Claude can't access]
- **Code:** [e.g., GitHub repos]
- **Shared docs:** [e.g., Google Drive shared folders]

## What I Need Help With

- [Use case 1]
- [Use case 2]
- [Use case 3]

## My Skill Level

- **Coding:** [e.g., "Intermediate in Stata, beginner in R"]
- **Statistics:** [e.g., "Comfortable with regression, learning causal inference"]
- **Command line:** [e.g., "Beginner — explain commands before running them"]

## How I Prefer to Work

- [e.g., "Explain reasoning when suggesting code changes"]
- [e.g., "Ask before modifying files outside my project"]
- [e.g., "Be concise unless I ask for detail"]

## Current Projects

| Project | My Role | Current Phase |
|---------|---------|---------------|
| [Name] | [Role] | [Phase] |
````

!!! ask-claude "Let Claude help you fill it in."
    In the app's message box, type something like:
    `Help me fill out my CLAUDE.md. I'm a political science professor who studies conflict and development.`
    Press Enter. Claude will ask follow-up questions and draft sections for you.

---

## Good vs. Underdeveloped

### Underdeveloped (Too Vague)

```markdown
# About Me
I'm a researcher. I do data analysis and help with projects.
I use Stata and R.
```

This doesn't give Claude enough to work with. What kind of projects? Where are files stored? What's your skill level?

### Good (Specific and Actionable)

```markdown
# Claude Context: Jamie Rivera

## Who I Am
Predoctoral research assistant at a policy school, working on field
experiments studying education interventions in East Africa.

## My Primary Work
- Cleaning and merging survey data (primarily in Stata)
- Running analysis and creating tables/figures for working papers
- Managing project documentation and IRB protocols
- Coordinating with field teams via WhatsApp and email

## Tools and Software

| Tool | What I Use It For | Where Files Live |
|------|-------------------|------------------|
| Stata 18 | Primary analysis | Local + GitHub |
| R | Visualization | Local + GitHub |
| GitHub | Version control | github.com/[org] |
| Box | Sensitive data (PII) | Institutional Box |
| Google Docs | Drafts, collaboration | Shared drives |

## Where My Files Are Stored
- Code and analysis: ~/Dropbox/Research/[project]/code/
- Non-sensitive data: ~/Dropbox/Research/[project]/data/
- Sensitive data: Institutional Box only — Claude cannot access

## What I Need Help With
- Debugging Stata code and improving efficiency
- Writing R visualization scripts
- Drafting professional emails
- Understanding new statistical methods
- Organizing project documentation

## My Skill Level
- Stata: Advanced (4 years)
- R: Intermediate (comfortable, still learning tidyverse)
- Python: Beginner
- Git: Intermediate (basic workflow, less comfortable with branches)
- Terminal: Comfortable with basics

## How I Prefer to Work
- Include comments explaining code sections
- Ask before modifying or deleting files
- Explain errors before giving fixes
- I use dictation, so prompts may be conversational

## Current Projects
| Project | My Role | Current Phase |
|---------|---------|---------------|
| Education RCT | Lead RA | Analysis + writing |
| Youth Survey | Data management | Survey programming |
```

---

## Tips

**Start minimal, then expand.** Your first version should take 20 minutes. Add detail as you discover what's useful.

**Be specific about file locations.** "I use Dropbox" is less useful than "`~/Dropbox/Research/` with subfolders per project containing `/code/`, `/data/`, and `/docs/`."

**Include your skill level.** A beginner needs explanations; an expert wants efficiency. Don't oversell your skills — Claude will calibrate its responses wrong.

**Update when things change.** New project? New tool? Update your CLAUDE.md. A stale document is worse than a minimal one.

---

## Test It

After creating your CLAUDE.md, start Claude Code and ask:

> "What do you know about me and my work?"

Claude should reference information from your file. If it doesn't, check:

1. File location: `~/.claude/CLAUDE.md`
2. File name: Must be exactly `CLAUDE.md`
3. File contents: Open it and verify it's not empty

---

## Model Choice

Claude Code defaults to the Sonnet 4.6 model, which is fast and capable for most tasks. For complex work — long-form writing, nuanced analysis, multi-step reasoning — consider switching to Opus 4.6:

```
/model opus
```

Opus 4.6 is more capable but uses more tokens per response (higher cost, faster usage against plan limits). This setting applies to the current session only. Switch back with `/model sonnet`.

---

## Advanced: Project-Specific CLAUDE.md

In addition to your global `~/.claude/CLAUDE.md`, you can create a CLAUDE.md in any project folder. Claude reads both when you start a session in that directory.

**How they work together:**

| File | Location | Purpose |
|------|----------|---------|
| **Global** | `~/.claude/CLAUDE.md` | Who you are — role, preferences, contact info, working style |
| **Project** | `my-project/.claude/CLAUDE.md` | This specific project — team, tools, conventions, file paths |

Claude loads the global file first, then the project file. Project instructions can override or extend global ones.

```
my-project/
├── .claude/
│   └── CLAUDE.md    ← project-specific instructions
├── data/
├── code/
└── docs/
```

This is useful when you work on multiple projects with different conventions, team members, or tools.

!!! tip "What goes in your CLAUDE.md is sent to the API"
    Everything in your CLAUDE.md files is included in every conversation with Claude Code. This is how Claude knows about you and your projects. The data is covered by Anthropic's [API data policy](https://www.anthropic.com/policies/privacy). Avoid including passwords, API keys, or information you wouldn't want transmitted to a cloud service.

### Voice & Writing Style

If AI output never quite sounds like your writing — too formal, too hedgy, full of words you'd never use — a voice file fixes that. It's a document that captures your actual writing patterns: sentence structure, vocabulary preferences, a ban list of AI-isms, and annotated examples.

The simplest implementation: save your core voice file to `~/.claude/rules/` and it auto-loads every session, just like other rule files. No `@import` needed for the fundamentals.

```
~/.claude/rules/core-voice.md    ← auto-loads every session
```

For context-specific registers (proposal voice vs. email voice), load those on demand through skills or `@voice/` imports in project-level CLAUDE.md files.

[:octicons-arrow-right-24: Teaching AI your voice](voice.md) — build the voice file step by step, with a fill-in template

---

## If you use Codex too: AGENTS.md

Claude reads `CLAUDE.md`. Codex reads `AGENTS.md`. The contents are interchangeable — the only
difference is the filename each app looks for.

Two copies is the obvious approach and the wrong one: they drift, and the day they disagree you
won't know which app read which. Make one file the real one and the other a pointer to it.

Ask your agent to do it, in the folder where the file lives:

```
Make AGENTS.md a symlink to CLAUDE.md in this folder, so both apps read the same file.
```

A [symlink](../faq.md) is a stand-in that points at the real file — open either name and you get the
same content. Edit `CLAUDE.md` and Codex sees the change immediately, because there is only one
file.

!!! tip "Which one should be the real file?"
    Whichever app you use more. If you mostly work in Claude, keep `CLAUDE.md` real and point
    `AGENTS.md` at it, as above. The arrangement is symmetrical; what matters is that exactly one of
    them holds the text.

The same pattern works for the global file — Claude's at `~/.claude/CLAUDE.md`, Codex's at
`~/.codex/AGENTS.md`.

<!-- EDITORIAL — BACKLOG C5 closed 14 Oct: this page is named agents-md.md and the nav calls it
     "Write your AGENTS.md", but until today it contained ZERO mentions of AGENTS.md and was titled
     "Your CLAUDE.md File". Section added, title matched to the nav.

     Content is consistent with regular.md:95-100, which already published the symlink instruction.
     CAVEAT, BACKLOG V1: whether Codex reads a PROJECT-LEVEL AGENTS.md is still unverified — only
     the global ~/.codex/AGENTS.md is evidenced anywhere in this repo, and that file does not exist
     on Shay's machine (checked 14 Oct; Codex itself isn't installed). The project-level claim is
     inherited from regular.md, not independently confirmed. If V1 comes back negative, the
     project-folder half of this section AND regular.md step 1 both need correcting. (regular.md was
     archived 19 Oct to docs/archive/starter-kit-regular.md; only this page now carries the claim.) -->

## Downloadable Template & Real Example

- **[CLAUDE.md Template](https://github.com/chrisblattman/claudeblattman/blob/main/templates/claude-md-template.md)** — The starter file. Fill in the blanks.
- **[A Real CLAUDE.md — Annotated](../hyperlinks/downloads/real-claude-md-example.md)** — My actual production CLAUDE.md (sanitized), showing what a mature configuration looks like after months of iteration. Study this when you're ready to level up.

---

## What's Next

With your CLAUDE.md in place:

1. **[Connect external services](mcp-setup.md)** — Give Claude access to email, docs, and calendar
2. **[Explore skills](../hyperlinks/skill-reference.md)** — Download tools that automate common workflows

<label class="page-done"><input type="checkbox"> Yay, my agent knows who I am!</label>
