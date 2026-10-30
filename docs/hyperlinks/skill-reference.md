# Skill Library

Skills (also called slash commands) are reusable prompts that run inside Claude Code with a single command. Instead of typing out a detailed prompt every time, you type `/done` or `/council` and the skill handles the rest.

A skill is just a markdown file saved in `~/.claude/commands/`. It contains instructions, optional arguments, and optional references to other files. When you type `/skillname`, Claude reads the file and follows the instructions. **No code, no compilation, no special syntax — just saved prompts with a shortcut.**

!!! important "First-time desktop users"
    Start with the [Desktop Agent Starter Kit](../starter-kit/newcomers.md) before installing skills from this library. If you installed the starter-kit plugin, do not install anything from this page during your first session. The catalog below is advanced/reference material from a broader setup. Some commands assume Gmail, Calendar, Granola, project configs, or account-specific templates and are not part of the v0.1 starter kit.

---

## Install & Use

!!! warning "Read before you install"
    Skills are executable instruction files — when you run them, Claude follows every instruction in the file, including MCP tool calls. Before installing a skill from any source, open the `.md` file and read through it. Skills from this site are published on [GitHub](https://github.com/chrisblattman/claudeblattman/tree/main/skills) where you can review the full source.

**Setup** — create the folders where Claude Code looks for skills:

```bash
mkdir -p ~/.claude/commands
mkdir -p ~/.claude/agents
```

**Install a skill** — download and restart:

```bash
# Example: download the /done skill
curl -o ~/.claude/commands/done.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/done.md
```

After saving any new skill file, **restart Claude Code** for the command to become available.

**Use a skill** — type `/` followed by the skill name:

```
> /done
> /done quick
> /council Review the draft email and recommend improvements
```

Most skills accept arguments — text after the command name that gets passed as `$ARGUMENTS`.

**Build your own** — identify a task you do repeatedly, write out the prompt, save it as a `.md` file in `~/.claude/commands/`, and add `$ARGUMENTS` where you want user input. See [Building Skills](../build-your-own/building-skills.md) for patterns and a quality checklist.

---

**Workflow tags:** Skills below are tagged by workflow — `[PM]` for [Project Management](../workflows/project-management.md), `[EA]` for [Executive Assistant](../workflows/building-an-assistant.md), `[First Session]` for [First Session Skills](../workflows/first-session-skills.md), `[Advanced]` for [system-level tools](continuous-improvement.md).

---

## Skills

### /done — Session Capture
`[First Session]`

**What it does:** Captures key decisions, open questions, and follow-ups from your current Claude Code session. Writes a structured entry to a session log file.

**MCP dependencies:** None.

**Install:**
```bash
curl -o ~/.claude/commands/done.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/done.md
```

**Usage:**
```
/done              # Full capture
/done quick        # Abbreviated (decisions + follow-ups only)
/done project:xyz  # Tag with a project name
```

**Customization:** Log file location (default `~/Documents/session-log.md`), project matching, archive pruning threshold (default 60 days).

---

### /morning-brief — Daily Briefing
`[EA]`

**What it does:** Generates a daily briefing combining calendar, reminders, inbox highlights, VIP tracking, waiting-for detection, overdue items, goal alignment, and optional auto-triage. Unified hard-deadline keyword detection across skills.

**MCP dependencies:** Gmail MCP (required). Google Calendar MCP (required). Apple Reminders via osascript (macOS, optional). Granola MCP (optional, for meeting context).

**Install:**
```bash
curl -o ~/.claude/commands/morning-brief.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/morning-brief.md

# Config templates (if not already installed)
mkdir -p ~/.claude-assistant/config
curl -o ~/.claude-assistant/config/email-policy.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/email-policy-template.md
curl -o ~/.claude-assistant/config/calendar-policy.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/calendar-policy-template.md
curl -o ~/.claude-assistant/config/triage-config.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/triage-config-template.md
```

**Usage:**
```
/morning-brief                # Full briefing
/morning-brief no-triage      # Skip auto-triage
/morning-brief email          # Also email the briefing to yourself
/morning-brief no-reminders   # Skip Apple Reminders (non-macOS)
```

**Customization:** Weather city, timezone, email delivery, triage integration, goal alignment via `goals.yaml`, deep work nudges, reminder platform.

---

### /checkin — Daily Check-In Session
`[EA]`

**What it does:** Interactive chief-of-staff session that combines inbox triage, reminder triage, meeting prep, email quick-fire drafting, and priority management into one 10-15 minute session. Where `/morning-brief` is a passive daily report, `/checkin` is an interactive session — it triages your inbox, triages your reminders, preps meetings, drafts emails, and surfaces priorities.

**MCP dependencies:** Gmail MCP (required). Google Calendar MCP (required). Granola MCP (optional, for meeting context). Apple Reminders via osascript (macOS, optional).

**Prerequisite skills:** `/triage-inbox` (recommended — without it, the triage phase is skipped).

**Install:**
```bash
curl -o ~/.claude/commands/checkin.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/checkin.md

# Config templates (if not already installed via /triage-inbox or /morning-brief)
mkdir -p ~/.claude-assistant/config
curl -o ~/.claude-assistant/config/email-policy.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/email-policy-template.md
curl -o ~/.claude-assistant/config/calendar-policy.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/calendar-policy-template.md
curl -o ~/.claude-assistant/config/triage-config.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/triage-config-template.md
curl -o ~/.claude-assistant/config/goals.yaml \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/goals-yaml-template.yaml
```

!!! note "If you already set up `/triage-inbox` and `/morning-brief`"
    Most config files are already in place. You only need the skill file itself and possibly `goals.yaml`.

**Usage:**
```
/checkin              # Full interactive session (10-15 min)
/checkin quick        # Status + priorities only (30 seconds)
/checkin no-email     # Skip email drafting phase
/checkin no-triage    # Skip inbox triage
/checkin tomorrow     # Preview tomorrow's schedule
```

**Customization:**

| Setting | Where to Configure | Default |
|---------|-------------------|---------|
| **VIP list** | `email-policy.md` | No VIP highlighting |
| **Calendar IDs** | `calendar-policy.md` | Primary only |
| **Goal alignment** | `goals.yaml` | Section omitted |
| **Push level** | `goals.yaml` → `meta.push_level` | `moderate` |
| **Auto-triage** | Requires `/triage-inbox` | Skipped |
| **Reminders** | Requires macOS | Phase skipped |

---

### /goals-review — Goals Review
`[PM]`

**What it does:** Reviews quarterly objectives, updates progress scores, surfaces deadlines, and recalibrates priorities. Manages the `goals.yaml` file that `/checkin` and `/morning-brief` read for goal alignment.

**MCP dependencies:** All optional. Gmail MCP (for email evidence). Google Calendar MCP (for meeting evidence). Granola MCP (for transcript evidence). Apple Reminders (macOS, for task evidence).

**Install:**
```bash
curl -o ~/.claude/commands/goals-review.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/goals-review.md

# Goals template (if not already installed)
mkdir -p ~/.claude-assistant/config
curl -o ~/.claude-assistant/config/goals.yaml \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/goals-yaml-template.yaml
```

**Usage:**
```
/goals-review              # Full review with interactive updates
/goals-review status       # Quick dashboard only
/goals-review deadlines    # Show upcoming deadlines only
```

**Customization:**

| Setting | Where to Configure | Default |
|---------|-------------------|---------|
| **Objectives** | `goals.yaml` → objectives | Template examples |
| **Push level** | `goals.yaml` → `meta.push_level` | `moderate` |
| **Review frequency** | Skill Step 5 | Biweekly (14 days) |

---

### /deep-research — Multi-Vendor Research
`[Advanced]`

**What it does:** Dispatches Claude WebSearch, Codex CLI, and Gemini 2.5 Pro CLI in parallel on the same research prompt. Three raw reports land in the project folder, indexed in a federated `research-archive/INDEX.md`. ChatGPT Deep Research, Grok, Perplexity, and Gemini's browser Deep Research are available as opt-in paste-loop arms via `--tool chatgpt|grok|perplexity|gemini-browser`.

**MCP dependencies:** None. Requires Codex CLI and Gemini CLI installed (see [AI integration](../build-your-own/ai-integration.md) for setup).

**Install:**
```bash
mkdir -p ~/.claude/commands/deep-research-references
curl -o ~/.claude/commands/deep-research.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/deep-research.md

for f in config.md dr-prompt-schema.md paste-loop-ux.md claude-subagent-template.md; do
  curl -o ~/.claude/commands/deep-research-references/$f \
    https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/deep-research-references/$f
done
```

**Usage:**
```
/deep-research <topic>                          # Default: Claude + Codex + Gemini parallel
/deep-research <topic> --tool both              # Codex + Gemini only
/deep-research <topic> --tool all-auto          # All CLI arms
/deep-research <topic> --tool chatgpt           # Paste-loop ChatGPT Deep Research
/deep-research --absorb path/to/report.md       # Ingest a manually-run browser report
/deep-research <topic> --quick                  # Claude-only, standard depth
```

**Customization:** Routing config (project-folder mapping), depth defaults, vendor-arm thresholds, archive paths.

**Learn more:** [The deep research workflow](../workflows/deep-research.md) · [AI integration](../build-your-own/ai-integration.md)

---

### /dr-synthesize — Deep Research Synthesis
`[Advanced]`

**What it does:** Combines 2+ deep-research raw reports into a single synthesis with a mandatory `## Source Reports` block preserving absolute paths to the originals. Surfaces agreements, contradictions, gaps, and per-source unique insights. Synthesis is always a new file; raw inputs are never edited. Companion to `/deep-research` — works on its outputs or any report with the canonical frontmatter.

**MCP dependencies:** None.

**Install:**
```bash
curl -o ~/.claude/commands/dr-synthesize.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/dr-synthesize.md
```

**Usage:**
```
/dr-synthesize report-a.md report-b.md                  # Synthesize 2 reports
/dr-synthesize *.md                                     # Glob all reports in cwd
/deep-research <topic> --synthesize                     # Run /deep-research, then chain
```

**Customization:** Synthesis output path, frontmatter conventions, source-report extraction rules.

**Learn more:** [The deep research workflow](../workflows/deep-research.md)

---

### /council — Parallel Critics + Separate Synthesis
`[Advanced]`

**What it does:** Dispatches up to 4 critic agents in parallel on a topic, then runs a separate synthesis pass. Single round, no debate, no majority vote on narrative output. Two panels ship — plan and decision — built from four personas (`skeptic`, `pre-mortem`, `completeness-checker`, `chief-of-staff`), which come with the starter-kit plugin. Paper and grant panels are not built yet.

**MCP dependencies:** None for Claude-only mode. Optional `--peer codex|gemini` swaps one seat for a cross-vendor peer; requires the relevant CLI installed.

**Install:**
```bash
curl -o ~/.claude/commands/council.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/council.md

mkdir -p ~/.claude/agents
curl -o ~/.claude/agents/proposal-critic-agent.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/agents/proposal-critic-agent.md
```

**Usage:**
```
/council file:~/path/to/plan.md --type plan    # Plan panel
/council "should I take this" --type decision  # Decision panel
/council --type plan <topic>                    # Plan / architecture review
/council --type grant <topic>                   # 5-critic grant panel
/council --peer gemini <topic>                 # Swap one seat for Gemini
```

**Customization:** Critic / synthesis model (config block at top of `council.md`), persona library in `~/.claude/agents/`, default panel sizes.

**Learn more:** [The council pattern](../build-your-own/council.md) · [Cross-vendor critics](../build-your-own/ai-integration.md)

---

### /proposal-revise — Proposal Revision
`[PM]`

**What it does:** Applies reviewer, collaborator, or self-review feedback to an existing proposal draft while maintaining voice consistency. Handles dictated feedback, comment files, and formal reviewer comments (with categorization).

**MCP dependencies:** None required. Google Docs MCP optional for project context.

**Install:**
```bash
curl -o ~/.claude/commands/proposal-revise.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/proposal-revise.md
```

**Usage:**
```
# Self-review — dictate feedback directly
/proposal-revise 05_Submissions/Grants/Draft.md
Tighten the intro. Cut 200 words from methodology.

# Collaborator feedback from file
/proposal-revise Draft.md comments:~/Downloads/feedback.txt

# Formal reviewer comments (shows categorization before applying)
/proposal-revise Draft.md reviewer:~/Downloads/reviews.pdf
```

**Customization:** Voice pack path, donor profile directory, backup behavior.

---

### /schedule-query — Calendar Availability
`[EA]`

**What it does:** Checks calendar availability across all Google calendars and drafts a scheduling reply with specific time proposals.

**MCP dependencies:** Google Calendar MCP (required). Gmail MCP (optional, for sending reply).

**Install:**
```bash
curl -o ~/.claude/commands/schedule-query.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/schedule-query.md

mkdir -p ~/.claude-assistant/config
curl -o ~/.claude-assistant/config/calendar-policy.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/calendar-policy-template.md
```

**Usage:**
```
/schedule-query with:Jane duration:60
/schedule-query range:7               # Look 7 days ahead
/schedule-query email:msg_id          # Reply to a scheduling email
```

**Customization:** Calendar IDs, working hours, deep work protection, reply tone templates.

---

### /pre-meeting-brief — Meeting Prep Briefing
`[EA]`

**What it does:** Pulls context from Gmail, Calendar, Granola transcripts, Google Docs, WhatsApp, and local files to compose a one-page brief before a meeting. Surfaces decisions required, open loops, and preparation needs. Two depth modes — `light` (top-of-file brief for routine check-ins) and `full` (deep multi-week synthesis for quarterly reviews or first-meetings with funders).

**MCP dependencies:** Gmail MCP, Google Workspace MCP (Calendar + Docs), Granola MCP. WhatsApp MCP optional.

**Install:**
```bash
curl -o ~/.claude/commands/pre-meeting-brief.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/pre-meeting-brief.md
```

**Usage:**
```
/pre-meeting-brief                        # Auto-detect depth from next event
/pre-meeting-brief light                  # Force light brief
/pre-meeting-brief full                   # Force full multi-source synthesis
/pre-meeting-brief email                  # Also draft a pre-meeting email
/pre-meeting-brief "<topic keyword>"      # Brief for a specific upcoming event
```

**Customization:** Lookback window (default 6 weeks for full mode), source-confidence thresholds, minimum-signal gate, attendee detection rules, optional donor-profile lookup for funder meetings.

**Learn more:** [Meeting workflow end-to-end](../workflows/meeting-workflow.md)

---

### /post-meeting — Meeting Follow-Up
`[EA]`

**What it does:** Reads a meeting transcript (from Granola, Zoom export, or a local file), extracts decisions and action items grouped by attendee, and drafts a follow-up email. Includes a concise summary for busy readers and a detailed meeting notes appendix for the record.

**MCP dependencies:** Gmail MCP (required for email drafting). Granola MCP (optional — also works with local transcript files).

**Install:**
```bash
curl -o ~/.claude/commands/post-meeting.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/post-meeting.md
```

**Usage:**
```
/post-meeting                    # Find most recent transcript automatically
/post-meeting keyword            # Search transcripts by keyword
/post-meeting nosend             # Generate summary without drafting email
/post-meeting save               # Save summary to project folder
```

**Customization:** Transcript source paths, email signature, meeting notes format, sensitivity flags.

---

### /setup-project-management — Project Setup
`[PM]`

**What it does:** Initializes a project management system for a research project. Interactive discovery, gap analysis, and design discussion before creating any files.

**MCP dependencies:** None required. Google Docs MCP useful for document hub setup.

**Install:**
```bash
curl -o ~/.claude/commands/setup-project-management.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/setup-project-management.md
```

**Usage:**
```
/setup-project-management              # Full interactive setup
/setup-project-management discover     # Assessment only
/setup-project-management plan         # Propose plan, stop before implementing
/setup-project-management minimal      # Quick setup: just .claude/CLAUDE.md
```

**Customization:** Project types (quantitative, qualitative, theory/writing), folder naming conventions, external storage integration.

---

### /todo-add — Add To-Do Item
`[EA]`

**What it does:** Adds a to-do item to the correct list with duplicate checking. Routes items based on keywords.

**MCP dependencies:** None.

**Install:**
```bash
curl -o ~/.claude/commands/todo-add.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/todo-add.md
```

**Usage:**
```
/todo-add Fix the authentication bug
/todo-add list:work Set up CI pipeline
```

!!! note "How these skills differ"
    `/todo-add` and `/todo-review` manage local markdown to-do files — useful for session-level task tracking. `/todo-queue` is different: it creates **persistent Apple Reminders** from email. For durable action items, use your real reminder system (Apple Reminders, Google Tasks, Todoist); use `/todo-add` for within-session work management.

---

### /todo-queue — Todo Queue
`[EA]`

**What it does:** Batch-processes emails in a designated Gmail label, converting them to Apple Reminders with timing extracted from email body.

**MCP dependencies:** Gmail MCP. Apple Reminders via osascript (macOS only).

**Install:**
```bash
curl -o ~/.claude/commands/todo-queue.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/todo-queue.md
```

**Usage:**
```
/todo-queue              # Process all pending
/todo-queue dryrun       # Preview only
/todo-queue limit:5      # Process first 5 only
```

---

### /todo-review — To-Do Review
`[EA]`

**What it does:** Reviews and consolidates to-do items across all configured files. Duplicate detection and batch actions.

**MCP dependencies:** None.

**Install:**
```bash
curl -o ~/.claude/commands/todo-review.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/todo-review.md
```

**Usage:**
```
/todo-review           # Quick summary (high priority only)
/todo-review full      # All priority levels
```

---

### /tax-guide — Personalized Tax Prep Guide
`[Tax Workflow]`

**What it does:** A guided Q&A that assesses your tax situation (income types, complexity flags, deductions, filing method) and generates a personalized preparation plan. Outputs a filing recommendation (self-file, self-file with care, or hire a professional), a document checklist, a suggested workflow with links to relevant skills, and privacy guidance.

**MCP dependencies:** None.

**Install:**
```bash
curl -o ~/.claude/commands/tax-guide.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/tax-guide.md
```

**Usage:**
```
/tax-guide              # Start the guided Q&A
```

**Learn more:** [Tax Workflow](../tax-workflow/index.md)

---

### /tips-scout — Search Prompt Generator
`[Advanced]`

**What it does:** Analyzes your recent tips log for coverage gaps, pulls active investigation topics from your to-do list, and generates a customized search prompt for Grok DeepSearch (or any AI search tool). Boosts under-covered categories and de-emphasizes topics you've already researched.

**MCP dependencies:** None (filesystem only).

**Install:**
```bash
curl -o ~/.claude/commands/tips-scout.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/tips-scout.md
```

**Usage:**
```
/tips-scout              # Generate customized Grok prompt
/tips-scout base         # Output base prompt without customization
```

**Customization:** Categories and target shares, coverage analysis window (default 14 days), base prompt template location.

**Learn more:** [Continuous Improvement](continuous-improvement.md)

---

### /tips-bookmarks — X Bookmark Pull
`[Advanced]`

**What it does:** Pulls your X/Twitter bookmarks via `twitter-cli`, classifies each (worth-reviewing / not-relevant / needs-manual), rates High / Medium / Low, dedupes against the existing tips log, and appends approved items. Replaces the manual copy-paste-email path for X content. Sibling to `/tips-curate` (Gmail path).

**MCP dependencies:** None. Requires `twitter-cli` installed and authenticated (a third-party CLI; see its own docs for setup).

**Install:**
```bash
mkdir -p ~/.claude-assistant/tips ~/.claude-assistant/state
curl -o ~/.claude/commands/tips-bookmarks.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/tips-bookmarks.md
```

**Usage:**
```
/tips-bookmarks                  # Pull recent bookmarks, classify, dedupe, append
/tips-bookmarks dryrun           # Preview without writing
/tips-bookmarks limit:20         # Pull more than the default
```

**Customization:** State file path (default `~/.claude-assistant/state/twitter-bookmarks-seen.json`), tips log path, tag taxonomy, default fetch limit, twitter-cli binary swap.

**Learn more:** [Continuous Improvement](continuous-improvement.md)

---

### /tips-curate — Tip Curation
`[Advanced]`

**What it does:** Processes @ToSelf emails containing tips and research. Quality-filters (High/Medium/Low), enriches via web research, presents recommendations for approval, appends to a searchable tips log.

**MCP dependencies:** Gmail MCP (required).

**Install:**
```bash
mkdir -p ~/.claude-assistant/tips

curl -o ~/.claude/commands/tips-curate.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/tips-curate.md
```

**Usage:**
```
/tips-curate              # Process first 5 unread @ToSelf emails
/tips-curate dryrun       # Preview classifications without saving or marking
/tips-curate limit:3      # Process 3 at a time
/tips-curate all          # Loop through all unread in batches of 5
```

**Customization:** Batch size, log file location (default `~/.claude-assistant/tips/collected-tips-log.md`), @ToSelf label name.

**Learn more:** [Continuous Improvement](continuous-improvement.md)

---

### /tips-integrate — Tip Integration
`[Advanced]`

**What it does:** Converts collected tips into concrete system improvements — direct config edits or investigation tasks. Tracks what has been processed to avoid re-proposing.

**MCP dependencies:** None (filesystem only).

**Install:**
```bash
mkdir -p ~/.claude/commands/tips-integrate-references

curl -o ~/.claude/commands/tips-integrate.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/tips-integrate.md

curl -o ~/.claude/commands/tips-integrate-references/scanning-rules.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/tips-integrate-references/scanning-rules.md
```

**Usage:**
```
/tips-integrate              # Scan all sources
/tips-integrate source:tips  # Only scan tips log (includes medium-rated items)
/tips-integrate dryrun       # Preview proposals without writing
/tips-integrate since:2026-02-01  # Only items after this date
```

**Output files:** Investigation proposals are written to the `INBOX` section of `skills-learning-catalog.md` (created automatically if it doesn't exist).

**Customization:** Source selection, state file location (default `~/.claude-assistant/state/integrate-state.json`), target config files.

**Learn more:** [Continuous Improvement](continuous-improvement.md)

---

### /announcement-digest — Email Source Digest
`[EA]`

**What it does:** Compiles a periodic digest of high-volume announcement emails from a single labeled source (school, employer, nonprofit, professional association). Extracts what matters, skips the noise, sends a summary. Sanitized version of the school-digest workflow.

**MCP dependencies:** Gmail MCP (required). Send-email.py or equivalent for sending the digest.

**Install:**
```bash
curl -o ~/.claude/commands/announcement-digest.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/announcement-digest.md
```

**Usage:**
```
/announcement-digest        # Compile and send digest of new emails since last run
```

**Customization:** Source label (`@School`, `@CompanyNews`, etc.), classification rules file, recipients, frequency floor (default 2 days), message-ID TTL (default 30 days).

**Learn more:** [Noise canceling: school-digest example](../workflows/school-digest.md)

---

### /triage-inbox — Smart Inbox Triage
`[EA]`

**What it does:** Scans inbox for emails to auto-label and archive — newsletters, announcements, receipts, travel confirmations, low-priority notifications. Uses heuristics that Gmail filters can't (List-Unsubscribe detection, body analysis, multi-signal scoring, travel email routing).

**MCP dependencies:** Gmail MCP (required).

**Install:**
```bash
curl -o ~/.claude/commands/triage-inbox.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/triage-inbox.md

mkdir -p ~/.claude-assistant/config ~/.claude-assistant/state ~/.claude-assistant/logs
curl -o ~/.claude-assistant/config/email-policy.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/email-policy-template.md
curl -o ~/.claude-assistant/config/triage-config.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/triage-config-template.md
```

**Usage:**
```
/triage-inbox                    # Scan, report, and apply labels
/triage-inbox noapply            # Preview only
/triage-inbox days:14            # Scan last 14 days
```

**Customization:** VIP list, label IDs, vendor domains, score thresholds, manual overrides.

---

### /weekly-review — Weekly Project Review
`[PM]`

**What it does:** Generates a comprehensive weekly summary for a research project, pulling from WhatsApp, meeting transcripts, Gmail, and working documents. Produces a project dashboard and detailed weekly log, writing directly to Google Docs. Includes automated transcript fetching, formatting checkpoint enforcement, and transcript archiving.

**MCP dependencies:** Google Docs MCP (required). Gmail MCP (recommended). WhatsApp MCP (optional). Granola (optional, for transcripts).

**Install:**
```bash
curl -o ~/.claude/commands/weekly-review.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/weekly-review.md
```

**Usage:**
```
/weekly-review                    # Full review, default date range
/weekly-review days:14            # Last 14 days
/weekly-review tab1only           # Quick dashboard update
/weekly-review skipwhatsapp       # Skip WhatsApp if unavailable
```

**Customization:** Data sources, date range logic, dashboard template (quantitative vs. qualitative projects), synthesis detail level, email filtering keywords, transcript formats, archive behavior.

---

### /proposal-write — Proposal Drafting
`[PM]`

**What it does:** Drafts a funding proposal from structured inputs — application template, research design, project context, and donor intelligence. Auto-gathers context from the project record and enforces voice consistency.

**MCP dependencies:** None required. Google Docs MCP recommended for project context. Gmail MCP optional for related correspondence.

**Install:**
```bash
curl -o ~/.claude/commands/proposal-write.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/proposal-write.md
```

**Usage:**
```
/proposal-write "Example Foundation" deadline:2026-06-01
/proposal-write "Impact Funder" template:~/Downloads/template.pdf budget:150000
/proposal-write "Foundation X" resubmission
/proposal-write "Foundation Y" dryrun
```

**Customization:** Voice pack path and style, donor profile directory, context gathering sources, word budgets, default proposal structure.

---

## Agents

Agents are subprocesses that Claude Code launches for specialized tasks. They run in fresh context (avoiding blind spots of the main session) and return structured results.

### Review Writing
`[PM]`

**What it does:** Reviews academic prose for clarity, argument structure, evidence integration, and voice consistency.

**Install:**
```bash
curl -o ~/.claude/agents/review-writing.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/agents/review-writing.md
```

**Usage:** "Launch the review-writing agent on my draft at ~/Documents/paper-draft.md"

---

### Review Methodology
`[PM]`

**What it does:** Reviews empirical social science papers for causal language accuracy, identification strategy soundness, statistical practice, and robustness discussion.

**Install:**
```bash
curl -o ~/.claude/agents/review-methodology.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/agents/review-methodology.md
```

**Usage:** "Launch the review-methodology agent on sections 3-5 of the paper draft"

---

## Templates

### CLAUDE.md Template

A starter CLAUDE.md file with all common sections. See [Your CLAUDE.md](../build-your-own/agents-md.md) for the full setup guide.

```bash
curl -o ~/.claude/CLAUDE.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/claude-md-template.md
```

### Goals Template

YAML file for tracking quarterly objectives with weighted OKR format. Referenced by `/checkin`, `/morning-brief`, and `/goals-review` for goal alignment, stalled-goal detection, and progress tracking.

```bash
mkdir -p ~/.claude-assistant/config
curl -o ~/.claude-assistant/config/goals.yaml \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/goals-yaml-template.yaml
```

### Email Policy Template

Email handling rules: VIP contacts, auto-archive patterns, label routing. Required by `/triage-inbox` and `/morning-brief`.

```bash
mkdir -p ~/.claude-assistant/config
curl -o ~/.claude-assistant/config/email-policy.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/email-policy-template.md
```

### Triage Config Template

Gmail label-to-ID mapping and classification rules. Required by `/triage-inbox` and `/morning-brief`.

```bash
mkdir -p ~/.claude-assistant/config
curl -o ~/.claude-assistant/config/triage-config.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/triage-config-template.md
```

### Calendar Policy Template

Calendar IDs, scheduling preferences, timezone, deep work protection. Required by `/schedule-query` and `/morning-brief`.

```bash
mkdir -p ~/.claude-assistant/config
curl -o ~/.claude-assistant/config/calendar-policy.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/calendar-policy-template.md
```

---

## Reference Library

For additional downloads — a real annotated CLAUDE.md, skill development patterns, agents vs skills decision guide, and tool comparison guides — see the [Downloads & Templates](downloads/index.md) page.
