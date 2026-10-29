# Skills & Agents

Downloadable skills (slash commands) and agents for Claude Code.

> **First-time desktop users:** start with the [Desktop Agent Starter Kit](../docs/starter-kit/index.md). The files below are an advanced/reference library from a broader setup. Some skills assume Gmail, Calendar, Granola, project configs, or account-specific templates and are not part of the starter kit.

The overlapping `council.md`, `review-plan.md`, and `done.md` files are migration notices. Install the shared kit for these workflows; do not install the legacy files as a second implementation. The broader library is selected reference material and is not a synchronized copy of a personal skill collection.

## Quick Install

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
| **Check-In Session** | `/checkin` | Gmail MCP, Calendar MCP, goals.yaml | Interactive daily check-in: inbox triage, reminder triage, meeting prep, email drafting, priorities |
| **Session Capture** | `/done` | None | Captures decisions, questions, and follow-ups from the current session |
| **Goals Review** | `/goals-review` | goals.yaml | Review and update quarterly objectives, progress scores, and deadlines |
| **Morning Briefing** | `/morning-brief` | Gmail MCP, Calendar MCP | Daily briefing: calendar, reminders, inbox highlights, VIP tracking, goal alignment, optional triage |
| **Prompt Formatter** | `/prompt` | formatting-core.md | Formats informal requests into structured prompts, then executes |
| **Prompt Only** | `/prompt-only` | formatting-core.md | Formats prompts without executing (for use in other tools) |
| **Prompt Refine** | `/prompt-refine` | formatting-core.md | Reviews and improves existing prompts |
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
| **Weekly Review** | `/weekly-review` | Google Docs MCP | Comprehensive weekly project summary from multiple data sources |

## Available Agents

| Agent | Description | Model |
|-------|-------------|-------|
| **Writing Reviewer** | Reviews academic prose for clarity, structure, and voice | Sonnet |
| **Methodology Reviewer** | Checks empirical claims, causal language, and identification strategy | Sonnet |
| **Proposal Critic** | Five-persona adoption critic for skill/tool/workflow tips. Used by `/tips-integrate` Phase 1.5 (one parameterized agent file invoked five times in parallel — Catalog Conflict / Maintenance Tax / Compounder / First-Run / Skeptic) | Sonnet |

## The Prompt Bundle

The `/prompt`, `/prompt-only`, and `/prompt-refine` skills share a companion file: `formatting-core.md`. Install all four files together:

```bash
# Install the prompt family
mkdir -p ~/.claude/commands/prompt-references

curl -o ~/.claude/commands/prompt.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/prompt.md

curl -o ~/.claude/commands/prompt-only.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/prompt-only.md

curl -o ~/.claude/commands/prompt-refine.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/prompt-refine.md

curl -o ~/.claude/commands/prompt-references/formatting-core.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/prompt-references/formatting-core.md
```

## The Tips Pipeline

`/tips-integrate` uses a companion reference file. Install both together:

```bash
# Install the tips-integrate skill + companion
mkdir -p ~/.claude/commands/tips-integrate-references

curl -o ~/.claude/commands/tips-integrate.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/tips-integrate.md

curl -o ~/.claude/commands/tips-integrate-references/scanning-rules.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/tips-integrate-references/scanning-rules.md
```

## Templates

| Template | Description |
|----------|-------------|
| `claude-md-template.md` | Starter CLAUDE.md file with all common sections |
| `email-voice-template.md` | Email voice and tone preferences for drafting skills |
| `goals-yaml-template.yaml` | Goals and priorities tracking file (OKR format with weighted objectives) |

## Customization

Each skill is designed to work out of the box but can be customized. See the [Skill Library](https://claudeblattman.com/setup/skill-reference/) on the website for customization guidance.
