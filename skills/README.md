# Skills & Agents

Downloadable skills (slash commands) and agents. Most entries use Claude Code. [Aniket Me](aniket-me/README.md) works with both Claude Code and Codex and has its own installation guide.

> **First-time desktop users:** start with the [Desktop Agent Starter Kit](../docs/starter-kit/index.md). The files below are an advanced/reference library from a broader setup. Some skills assume Gmail, Calendar, Granola, project configs, or account-specific templates and are not part of the starter kit.

The overlapping `council.md`, `review-plan.md`, and `done.md` files are migration notices. Install the shared kit for these workflows; do not install the legacy files as a second implementation. The broader library is selected reference material and is not a synchronized copy of a personal skill collection.

## Choose an installation route

- **Starter kit:** use the [current installation guide](https://claudeblattman.com/starter-kit/occasional/) and [package notes](../starter-kit-source/PACKAGE-README.md). It includes the maintained council, adversarial-review, prompt and done workflows.
- **Aniket Me:** follow its [standalone guide](aniket-me/README.md), including the app-specific folder and update instructions.
- **Older examples below:** read the workflow and its dependencies before adapting it. These are legacy Claude Code commands, not a complete Codex package or an extension to install wholesale alongside the kit.

For new maintained skills, use one folder per skill containing `SKILL.md` and any supporting files. The starter kit and Aniket Me already use this format. The [skill-building guide](https://claudeblattman.com/build-your-own/building-skills/) shows the layout.

## Legacy Claude Code command example

Skills go in `~/.claude/commands/`. Agents go in `~/.claude/agents/`.

```bash
# Create directories
mkdir -p ~/.claude/commands
mkdir -p ~/.claude/agents

# Download a skill
curl -o ~/.claude/commands/proposal-write.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/proposal-write.md

# Download an agent
curl -o ~/.claude/agents/review-writing.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/agents/review-writing.md
```

Restart Claude Code after adding new commands.

## Available Skills

| Skill | Command | Dependencies | Description |
|-------|---------|-------------|-------------|
| [**Aniket Me**](aniket-me/README.md) | `/aniket-me` or `$aniket-me` | Bundled public source notes | Applies Aniket Panjwani's public advice to help improve how you work with AI |
| **Check-In Session** | `/checkin` | Gmail MCP, Calendar MCP, goals.yaml | Interactive daily check-in: inbox triage, reminder triage, meeting prep, email drafting, priorities |
| **Session Capture (starter kit)** | `/done` | Shared starter kit | Use the kit's maintained workflow. The old `done.md` is a migration notice, not a standalone install. |
| **Goals Review** | `/goals-review` | goals.yaml | Review and update quarterly objectives, progress scores, and deadlines |
| **Morning Briefing** | `/morning-brief` | Gmail MCP, Calendar MCP | Daily briefing: calendar, reminders, inbox highlights, VIP tracking, goal alignment, optional triage |
| **Prompt Formatter (legacy reference)** | `/prompt` | formatting-core.md | Use the starter-kit prompt workflow if the kit is installed. The older command overlaps with it. |
| **Prompt Only (legacy reference)** | `/prompt-only` | formatting-core.md | Historical companion command to read and adapt |
| **Prompt Refine (legacy reference)** | `/prompt-refine` | formatting-core.md | Historical companion command to read and adapt |
| **Proposal Revision** | `/proposal-revise` | None | Applies reviewer/collaborator feedback to proposal drafts |
| **Proposal Writing** | `/proposal-write` | None | Drafts funding proposals from structured inputs and project context |
| **Meeting Follow-Up** | `/post-meeting` | Gmail MCP, Granola MCP (optional) | Extracts decisions and action items from meeting transcripts, drafts follow-up email |
| **Council (migration notice)** | `/council` | Shared starter kit | Use the bundled development council; bundled adversarial-review handles critique |
| **Plan Review (migration notice)** | `/review-plan` | Shared starter kit | Use bundled `/adversarial-review` |
| **Schedule Query** | `/schedule-query` | Calendar MCP | Checks calendar availability and drafts scheduling replies |
| **Project Setup** | `/setup-project-management` | None | Initializes project management system for research projects |
| **Add To-Do** | `/todo-add` | None | Adds a to-do item to the correct list with duplicate checking |
| **Todo Queue** | `/todo-queue` | Gmail MCP, Apple Reminders | Batch-processes emails into Apple Reminders with timing extraction |
| **Todo Review** | `/todo-review` | None | Reviews and consolidates to-do items across configured files |
| **Tax Guide** | `/tax-guide` | None | Personalized Q&A that assesses your tax situation and generates a document checklist, workflow plan, and filing recommendation |
| **Tips Curate** | `/tips-curate` | Gmail MCP | Processes @ToSelf emails containing tips, quality-filters, and builds a searchable log |
| **Tips Integrate** | `/tips-integrate` | `agents/proposal-critic-agent.md` (optional but recommended) | Converts collected tips into concrete system improvements. 5-persona critic council ranks candidates; auto-applies top 3 |
| **Tips Scout** | `/tips-scout` | None | Generates customized Grok DeepSearch prompt based on coverage gaps and active topics |
| **Inbox Triage** | `/triage-inbox` | Gmail MCP | Smart email classification with label-in-inbox sweep, auto-filter creation, and heuristics Gmail filters can't replicate |
| **Weekly Review (reference only)** | `/weekly-review` | Google Docs connection, project configuration and external helper scripts | Example workflow. Three required Python helpers are not included in this public repository. |

## Available Agents

| Agent | Description | Model |
|-------|-------------|-------|
| **Writing Reviewer** | Reviews academic prose for clarity, structure, and voice | Sonnet |
| **Methodology Reviewer** | Checks empirical claims, causal language, and identification strategy | Sonnet |
| **Proposal Critic** | Five-persona adoption critic for skill/tool/workflow tips. Used by `/tips-integrate` Phase 1.5 (one parameterized agent file invoked five times in parallel — Catalog Conflict / Maintenance Tax / Compounder / First-Run / Skeptic) | Sonnet |

## The older prompt family

The older [`prompt.md`](prompt.md), [`prompt-only.md`](prompt-only.md), and [`prompt-refine.md`](prompt-refine.md) share [`formatting-core.md`](prompt-references/formatting-core.md). They remain available as examples.

Do not install this family as a second implementation of the kit's prompt workflow. Before changing an existing installation, back up its commands and preserve local customizations. Follow the package guide's migration instructions and check which implementation the app loads in a fresh session.

## The Tips Pipeline

`/tips-integrate` is a legacy Claude Code example that also needs its configured tips log and targets. Its companion reference belongs outside the commands directory, so the app does not list that reference as another command. If adapting this example, install both files at the matching paths:

```bash
# Install the tips-integrate skill + companion
mkdir -p ~/.claude/commands ~/.claude/skill-references/tips-integrate

curl -o ~/.claude/commands/tips-integrate.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/tips-integrate.md

curl -o ~/.claude/skill-references/tips-integrate/scanning-rules.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/tips-integrate-references/scanning-rules.md
```

## Templates

| Template | Description |
|----------|-------------|
| `claude-md-template.md` | Starter CLAUDE.md file with all common sections |
| `email-voice-template.md` | Email voice and tone preferences for drafting skills |
| `goals-yaml-template.yaml` | Goals and priorities tracking file (OKR format with weighted objectives) |

## Customization

The older examples need different tools and configuration. Read their prerequisites and adapt them before use. See [Create a skill](https://claudeblattman.com/build-your-own/building-skills/) for the folder layout and [Council and review](https://claudeblattman.com/starter-kit/occasional/) for the maintained kit workflows.
