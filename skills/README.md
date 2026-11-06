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

The starter kit has one authoritative source in [starter-kit-source/skills/](../starter-kit-source/skills/). The Claude and Codex copies under `plugins/` are generated from it. Edit the source and run the builder; do not maintain those copies separately. The [council](council/README.md), [review-plan](review-plan/README.md) [done](done/README.md), and standalone prompt-family folders here contain retirement notices, not installable skills. The former [tips-bookmarks](tips-bookmarks/README.md) workflow is now part of Tips Curate.

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
| [**Session Capture (starter kit)**](../starter-kit-source/skills/done/SKILL.md) | `/done` | Starter kit; Python 3 | Saves a project session log, current handoff and useful artifacts; preserves unrelated unfinished work. |
| [**Goals Review**](goals-review/SKILL.md) | `/goals-review` | goals.yaml | Review and update quarterly objectives, progress scores, and deadlines |
| [**Morning Briefing**](morning-brief/SKILL.md) | `/morning-brief` | Gmail MCP, Calendar MCP | Daily briefing: calendar, reminders, inbox highlights, VIP tracking, goal alignment, optional triage |
| [**Prompt (starter kit)**](../starter-kit-source/skills/prompt/SKILL.md) | `/prompt` | Starter kit | Prepare, refine or execute a prompt; ask for preparation only when you do not want it run. |
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
| [**Tips Curate**](tips-curate/SKILL.md) | `/tips-curate` | Saved reports; optional email/bookmark connections | Deduplicates and assesses tips from all sources in one shared log, with source and host routing. |
| [**Tips Integrate**](tips-integrate/SKILL.md) | `/tips-integrate` | Shared tips log and configured targets; native subagents for larger batches | Ranks ideas with five bundled critics, applies authorized changes and queues investigations. |
| [**Tips Scout**](tips-scout/SKILL.md) | `/tips-scout` | Optional tips log/task list; Ask Agents and Grok connection for live consultation | Prepares and saves a search prompt from coverage gaps; calls Grok only when explicitly requested. |
| [**Inbox Triage**](triage-inbox/SKILL.md) | `/triage-inbox` | Gmail MCP | Smart email classification with label-in-inbox sweep, auto-filter creation, and heuristics Gmail filters can't replicate |
| [**Weekly Review (reference only)**](weekly-review/SKILL.md) | `/weekly-review` | Google Docs connection, project configuration and external helper scripts | Example workflow. Three required Python helpers are not included in this public repository. |
| [**Announcement Digest**](announcement-digest/SKILL.md) | `/announcement-digest` | Gmail connection and source rules | Summarize announcement emails |
| [**Research Council**](research-council/SKILL.md) | `/research-council` | Research-capable workers; Ask Agents for external AIs; fresh synthesis worker for multiple reports | One arm per available Claude, Codex and Gemini; Grok on request. One available AI runs one arm. |
| [**Deep Research**](deep-research/SKILL.md) | `/deep-research` | Supported browser automation, signed-in ChatGPT/Gemini with Deep Research access, file export and fresh synthesis worker | Actual browser Deep Research in both products by default; saves exports and synthesizes them. |

## Available Agents

| Agent | Description | Model |
|-------|-------------|-------|
| **Writing Reviewer** | Reviews academic prose for clarity, structure, and voice | Sonnet |
| **Methodology Reviewer** | Checks empirical claims, causal language, and identification strategy | Sonnet |
| **Proposal Critic** | Reference five-persona adoption critic. Tips Integrate now bundles its own host-neutral critic instructions; this separate agent is not required. | Sonnet |

## One prompt skill

The starter kit's `/prompt` already handles preparing a prompt, refining an existing one and authorized execution. The standalone `prompt`, `prompt-only` and `prompt-refine` folders now contain migration notices. Keep personal customizations when retiring an old installed copy; do not install a competing implementation.

```text
/prompt Write a prompt for this task. Don't run it yet: [task]
/prompt Refine this prompt: [prompt]
```

## Two research workflows

`/research-council` searches through available AI agents. `/deep-research` operates the actual ChatGPT and Gemini Deep Research browser products. Both include synthesis; the old [dr-synthesize folder](dr-synthesize/README.md) is a migration notice. Neither skill is added to the starter kit by this change.

Install each entire folder, including its references. Research Council works with the available provider set; optional external connections come from the starter kit's Ask Agents. Deep Research uses the host's browser tools and the user's signed-in accounts, not those agent connections. Chats belong in a **Deep Research** project/notebook in each product; reports belong in the local working project. If the account cannot support that filing route, the skill reports the blocker.

These are public adaptations. Offline structure and scenario checks do not establish live provider access, browser execution or export success. The [Research Council acceptance checks](research-council/references/acceptance.md) and [Deep Research acceptance checks](deep-research/references/acceptance.md) describe the remaining host tests. No fixed free quota is promised.

When upgrading an older `/deep-research`, preserve personal settings and check which copy the app loads. Ordinary Claude/Codex/Gemini agent research has moved to `/research-council`. In the new browser skill, “both” means ChatGPT and Gemini Deep Research; it no longer means Claude plus Codex. Don't install the retired helper as a third skill.

## The tips pipeline

Install the entire [tips-scout](tips-scout/), [tips-curate](tips-curate/) and [tips-integrate](tips-integrate/) folders, including their references. They share one configured tips folder across apps. Existing logs and state are preserved; the default location is `~/.claude-assistant/tips/`.

Scout prepares a prompt by default. An explicit Grok request uses the installed starter kit's Ask Agents connection. Curate can work from saved reports alone; email and bookmark connections are optional. Bookmarks no longer require a fourth skill. Integrate includes the five critic briefs and requires native subagent support for batches larger than five; it does not require installing the old separate Proposal Critic agent.

These are public adaptations with private account configuration and helpers removed. Read their setup requirements and try a dry run before using your existing tips log. Live connector/host acceptance remains to be tested; offline validation does not establish those connections.

## Templates

| Template | Description |
|----------|-------------|
| `claude-md-template.md` | Starter CLAUDE.md file with all common sections |
| `email-voice-template.md` | Email voice and tone preferences for drafting skills |
| `goals-yaml-template.yaml` | Goals and priorities tracking file (OKR format with weighted objectives) |
