# Skill library

AI for professionals who don't code.

[claudeblattman.com](https://claudeblattman.com) · [Start here](https://claudeblattman.com/starter-kit/newcomers/) · [Council and review](https://claudeblattman.com/starter-kit/occasional/)

A skill is a saved set of instructions that teaches your AI agent to do a recurring job. Each skill has its own folder, with an entry file called `SKILL.md` and any bundled supporting files alongside it.

**New here?** Install the [starter kit](https://claudeblattman.com/starter-kit/occasional/). It bundles the maintained council, adversarial-review, prompt, done and setup workflows for Claude Code and Codex. [Aniket Me](aniket-me/README.md) is a separate maintained skill.

The other skills below are examples from my own setup. The folder format makes their instructions and supporting files easier to copy together; it does not remove their dependencies on configured accounts, project files or external helpers. Read the prerequisites before adapting one. They have not all been tested in both apps.

## Repository layout

```text
skills/
├── proposal-write/
│   └── SKILL.md
├── deep-research/
│   ├── SKILL.md
│   └── references/
├── tips-integrate/
│   ├── SKILL.md
│   └── references/
└── aniket-me/
    ├── SKILL.md
    └── references/
```

Add `scripts/` or `assets/` inside a skill only when it has files to put there. Unbundled helpers are dependencies, not empty placeholder folders.

The starter kit has one authoritative source in [starter-kit-source/skills/](../starter-kit-source/skills/). The Claude and Codex copies under `plugins/` are generated from it. Edit the source and run the builder; do not maintain those copies separately. The [council](council/README.md), [review-plan](review-plan/README.md) and [done](done/README.md) folders here contain retirement notices, not installable skills.

## Install or adapt a standalone skill

Ask your agent:

```text
Read the [skill name] folder at https://github.com/chrisblattman/claudeblattman/tree/main/skills. Check what it needs, then help me install or adapt it for this app. Copy the whole skill folder, including its supporting files. If I already have it, preserve my customizations and check for another version with the same name.
```

Use the [Aniket Me guide](aniket-me/README.md) for its tested Claude Code and Codex routes. The other examples were written for Claude Code; their tools and configuration may need adaptation in another app.

For Claude Code, copy a skill folder to `~/.claude/skills/<skill-name>/`, keeping `SKILL.md` and its supporting files together. See [Claude's skill documentation](https://code.claude.com/docs/en/skills). Older files in `~/.claude/commands/` can coexist with folder skills, so check for a same-named command before migrating. Keep customized previous versions outside active skill directories.

Start a fresh session, check which copy loads, and try the workflow on a suitable task. For bundled references, paths are relative to the installed skill folder.

## Available Skills

| Skill | Command | Dependencies | Description |
|-------|---------|-------------|-------------|
| [**Aniket Me**](aniket-me/README.md) | `/aniket-me` or `$aniket-me` | Bundled public source notes | Applies Aniket Panjwani's public advice to help improve how you work with AI |
| [**Check-In Session**](checkin/SKILL.md) | `/checkin` | Gmail MCP, Calendar MCP, goals.yaml | Interactive daily check-in: inbox triage, reminder triage, meeting prep, email drafting, priorities |
| **Session Capture (starter kit)** | `/done` | Shared starter kit | Use the kit's maintained workflow. The `done/README.md` is a migration notice, not a standalone install. |
| [**Goals Review**](goals-review/SKILL.md) | `/goals-review` | goals.yaml | Review and update quarterly objectives, progress scores, and deadlines |
| [**Morning Briefing**](morning-brief/SKILL.md) | `/morning-brief` | Gmail MCP, Calendar MCP | Daily briefing: calendar, reminders, inbox highlights, VIP tracking, goal alignment, optional triage |
| [**Prompt Formatter (legacy reference)**](prompt/SKILL.md) | `/prompt` | formatting-core.md | Use the starter-kit prompt workflow if the kit is installed. The older command overlaps with it. |
| [**Prompt Only (legacy reference)**](prompt-only/SKILL.md) | `/prompt-only` | formatting-core.md | Historical companion command to read and adapt |
| [**Prompt Refine (legacy reference)**](prompt-refine/SKILL.md) | `/prompt-refine` | formatting-core.md | Historical companion command to read and adapt |
| [**Proposal Revision**](proposal-revise/SKILL.md) | `/proposal-revise` | None | Applies reviewer/collaborator feedback to proposal drafts |
| [**Proposal Writing**](proposal-write/SKILL.md) | `/proposal-write` | None | Drafts funding proposals from structured inputs and project context |
| [**Meeting Follow-Up**](post-meeting/SKILL.md) | `/post-meeting` | Gmail MCP, Granola MCP (optional) | Extracts decisions and action items from meeting transcripts, drafts follow-up email |
| **Council (migration notice)** | `/council` | Shared starter kit | Use the bundled development council; bundled adversarial-review handles critique |
| **Plan Review (migration notice)** | `/review-plan` | Shared starter kit | Use bundled `/adversarial-review` |
| [**Schedule Query**](schedule-query/SKILL.md) | `/schedule-query` | Calendar MCP | Checks calendar availability and drafts scheduling replies |
| [**Project Setup**](setup-project-management/SKILL.md) | `/setup-project-management` | None | Initializes project management system for research projects |
| [**Add To-Do**](todo-add/SKILL.md) | `/todo-add` | None | Adds a to-do item to the correct list with duplicate checking |
| [**Todo Queue**](todo-queue/SKILL.md) | `/todo-queue` | Gmail MCP, Apple Reminders | Batch-processes emails into Apple Reminders with timing extraction |
| [**Todo Review**](todo-review/SKILL.md) | `/todo-review` | None | Reviews and consolidates to-do items across configured files |
| [**Tax Guide**](tax-guide/SKILL.md) | `/tax-guide` | None | Personalized Q&A that assesses your tax situation and generates a document checklist, workflow plan, and filing recommendation |
| [**Tips Curate**](tips-curate/SKILL.md) | `/tips-curate` | Gmail MCP | Processes @ToSelf emails containing tips, quality-filters, and builds a searchable log |
| [**Tips Integrate**](tips-integrate/SKILL.md) | `/tips-integrate` | `agents/proposal-critic-agent.md` (optional but recommended) | Converts collected tips into concrete system improvements. 5-persona critic council ranks candidates; auto-applies top 3 |
| [**Tips Scout**](tips-scout/SKILL.md) | `/tips-scout` | None | Generates customized Grok DeepSearch prompt based on coverage gaps and active topics |
| [**Inbox Triage**](triage-inbox/SKILL.md) | `/triage-inbox` | Gmail MCP | Smart email classification with label-in-inbox sweep, auto-filter creation, and heuristics Gmail filters can't replicate |
| [**Weekly Review (reference only)**](weekly-review/SKILL.md) | `/weekly-review` | Google Docs connection, project configuration and external helper scripts | Example workflow. Three required Python helpers are not included in this public repository. |
| [**Announcement Digest**](announcement-digest/SKILL.md) | `/announcement-digest` | Gmail connection and source rules | Summarize announcement emails |
| [**Deep Research (reference)**](deep-research/SKILL.md) | `/deep-research` | Configured research tools and archive | Older federated research workflow; not Chris’s current private skill |
| [**Research Synthesis**](dr-synthesize/SKILL.md) | `/dr-synthesize` | Saved research reports | Combine reports while preserving source links |
| [**Tips Bookmarks**](tips-bookmarks/SKILL.md) | `/tips-bookmarks` | Configured twitter-cli | Collect bookmarks into a tips log |

## Available Agents

| Agent | Description | Model |
|-------|-------------|-------|
| **Writing Reviewer** | Reviews academic prose for clarity, structure, and voice | Sonnet |
| **Methodology Reviewer** | Checks empirical claims, causal language, and identification strategy | Sonnet |
| **Proposal Critic** | Five-persona adoption critic for skill/tool/workflow tips. Used by `/tips-integrate` Phase 1.5 (one parameterized agent file invoked five times in parallel — Catalog Conflict / Maintenance Tax / Compounder / First-Run / Skeptic) | Sonnet |

## The older prompt family

The [prompt](prompt/SKILL.md), [prompt-only](prompt-only/SKILL.md) and [prompt-refine](prompt-refine/SKILL.md) examples each bundle `references/formatting-core.md` so their folders can be copied independently. Keep those three reference copies in sync when editing the shared rules.

Do not install this family as a competing implementation of the starter kit's prompt workflow. Use the kit's migration guidance when replacing an existing installation.

## The tips pipeline

Copy the entire [tips-integrate folder](tips-integrate/), including `references/scanning-rules.md`. Its configured tips log and target files remain external dependencies. Its optional review agent is [proposal-critic-agent.md](../agents/proposal-critic-agent.md); agent definitions remain in `agents/`.

## Templates

| Template | Description |
|----------|-------------|
| `claude-md-template.md` | Starter CLAUDE.md file with all common sections |
| `email-voice-template.md` | Email voice and tone preferences for drafting skills |
| `goals-yaml-template.yaml` | Goals and priorities tracking file (OKR format with weighted objectives) |
