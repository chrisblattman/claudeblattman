---
description: Build an AI executive assistant with Claude Code — inbox triage, morning briefings, meeting prep, post-meeting follow-up, and project tracking. From 5,000 unread emails to six.
---

# Building an AI Executive Assistant

A system that manages your inbox, tracks your projects, processes your meetings, and drafts your communications — assembled from skills and integrations that compound over time.

> *I started with 5,000 unread emails. A day and a half later, I had six.*

---

## What You'll Build

| Component | What It Does | Skill |
|-----------|-------------|-------|
| **Inbox triage** | Categorizes email by priority, auto-labels and archives low-value mail | [`/triage-inbox`](../hyperlinks/skill-reference.md#triage-inbox-smart-inbox-triage) |
| **Morning briefing** | Daily summary: calendar, reminders, inbox highlights, goal alignment | [`/morning-brief`](../hyperlinks/skill-reference.md#morning-brief-daily-briefing) |
| **Daily check-in** | Interactive session: triage, reminders, meeting prep, email drafting | [`/checkin`](../hyperlinks/skill-reference.md#checkin-daily-check-in-session) |
| **Schedule management** | Calendar availability, conflict detection, scheduling replies | [`/schedule-query`](../hyperlinks/skill-reference.md#schedule-query-calendar-availability) |
| **Session capture** | Records decisions, follow-ups, and handoff notes after each session | [`/done`](../hyperlinks/skill-reference.md#done-session-capture) |
| **To-do management** | Add, review, and batch-process tasks across lists | [`/todo-add`](../hyperlinks/skill-reference.md#todo-add-add-to-do-item), [`/todo-review`](../hyperlinks/skill-reference.md#todo-review-to-do-review), [`/todo-queue`](../hyperlinks/skill-reference.md#todo-queue-todo-queue) |
| **Goals tracking** | Quarterly objectives, progress scores, stalled-goal alerts | [`/goals-review`](../hyperlinks/skill-reference.md#goals-review-goals-review) |
| **Meeting prep** | Pulls context from email, chat, calendar, and past meetings to generate a pre-meeting briefing | [`/pre-meeting-brief`](../hyperlinks/skill-reference.md#pre-meeting-brief-meeting-prep-briefing) |
| **Meeting follow-up** | Extracts decisions and action items from a transcript, drafts follow-up email to attendees | [`/post-meeting`](../hyperlinks/skill-reference.md#post-meeting-meeting-follow-up) |
| **Noise canceling** | Digest of high-volume announcements (school, employer, nonprofit) | [Example walkthrough](school-digest.md) |

Each skill works on its own — you can install just `/triage-inbox` and get value from day one. But they compound: `/triage-inbox` runs standalone, and `/checkin` wraps triage + briefing into one interactive session. `/post-meeting` captures what happened; `/done` captures what you decided. `/goals-review` adds a strategic layer that aligns everything toward your quarterly objectives. The recommended path: start with triage, add the check-in, then layer on meetings and goals.

!!! tip "Ready to install?"
    Jump to [Quickstart: Your First Three Skills](#quickstart-your-first-three-skills) for step-by-step install commands, or expand the [Install All EA Skills](#step-2-skill-dependency-order) block to get everything at once. Need MCP setup first? Start with [Prerequisites](#prerequisites).

<span id="how-i-built-this"></span>

??? quote "How I built this — the full story"

    I started with about 5,000 unread emails going back years. This was partly because I used my unread email like a to-do list. Any tasks that needed to be done or email that needed to be responded to, I left it unread until I got around to it. It worked well enough — I'm more on top of email than most — but the backlog was a constant low-grade source of stress. I always knew it was an inadequate system of organization. I just never had a better option.

    **The first fix was not about email — it was about reminders.** I wasn't using Google Tasks or Apple Reminders at all, which in retrospect was a mistake. After researching and testing both, I chose Apple Reminders for the flexibility and Siri integration. The key insight: emails that create to-do items should become reminders, not stay unread. That's what the triage-inbox skill does — it converts actionable emails into reminders and gets everything else out of the way.

    **The triage skill took the most iteration.** I did deep research on best practices, had Claude analyze my actual inbox patterns, and we went back and forth on filter systems. The biggest lift was distinguishing the fundamental things I had to see and respond to (which stay in my inbox) from everything else (newsletters, announcements, school emails) that I can review once a day or skip entirely.

    A word of advice if you're building something like this: this is where it helps to understand planning mode and to have Claude critically evaluate its own plans from different perspectives. I had to keep a close eye on false positives and false negatives — important emails getting auto-archived, or junk still cluttering my inbox.

    **Direct time savings:** an hour or two per week. But the bigger value is psychological — knowing nothing will get lost, not getting sucked into newsletters first thing in the morning, the occasional exhilaration of reaching actual inbox zero. Inbox triage might be the single biggest *stress* saver in this system.

    !!! tip "What I wish I'd known"

        - **Start with reminders, not email rules.** The biggest payoff was converting my "unread = to-do" habit into actual reminders. Everything else followed from that.
        - **Start with broad categories, not detailed ones.** Fewer buckets, higher accuracy. You can split later.
        - **Watch the first week carefully.** False negatives (important emails getting auto-archived) are worse than false positives. Review what's being filtered until you trust it.
        - **Use planning mode for complex skills.** Have Claude critically evaluate its own triage plans from different perspectives before you run them on real email.
        - **Real time savings: 1-2 hours/week.** But the real value is psychological — the stress of a chaotic inbox disappearing is worth more than the hours.
        - **Maintenance shrinks over time.** Early on I gave daily feedback. Now it's every few days, and mostly for new senders the system hasn't seen before.
        - **No skill is perfect on first try.** The value comes from iterative improvement — use it, notice what's wrong, fix it, repeat. After a month it works meaningfully better than day one.

<span id="the-one-time-cleanup"></span>

??? note "The one-time cleanup — start fresh before building habits"

    Before building recurring workflows, there's a one-time cleanup that pays for itself immediately. This is the "magic cleanup team in a hoarder's basement" moment — the point where you realize AI tools can do in a day what you've been failing to do for years.

    My cleanup took about 36 hours spread across two days. Here's what it involved and how you can do something similar.

    ### What I Cleaned Up

    | Area | Before | After | Time |
    |------|--------|-------|------|
    | **Email inbox** | 5,000 unread (years of backlog) | 6 unread | ~8 hours |
    | **Local disk** | 19 GB free on 1 TB drive | 500+ GB free | ~2 hours |
    | **Cloud storage** | Files scattered across 4 services, no catalog | Single inventory, stale folders identified | ~4 hours |
    | **Calendar** | Events split across iCalendar and Google | Consolidated to Google Calendar | ~2 hours |
    | **Reminders** | No system (used unread email as to-do list) | Apple Reminders with structured categories | ~2 hours |

    ### How to Do It Yourself

    **Email cleanup** is covered in the inbox triage section above. The key insight: start with a *reminder system*, then use Claude to categorize and process your backlog in batches.

    **Local disk audit.** Ask Claude Code to scan your filesystem:

    > Scan my local filesystem to find where my disk space is going. Check ~/Library, /Applications, ~/Downloads, hidden directories, and anything else that looks large. Find the top 50 largest files. Present a ranked list of quick wins — things likely safe to delete with estimated space recoverable.

    Hidden directories are where the real bloat lives. Apps store data in dot-prefixed folders (`.app-name/`) that don't show up in Finder. Claude Code finds these instantly. In my case, a single hidden backup directory was consuming 79 GB.

    **Cloud storage inventory.** If you have files across Dropbox, Google Drive, Box, or iCloud:

    1. **Services with API access** (Dropbox, Google Drive via MCP): have Claude enumerate files programmatically and generate an inventory report
    2. **Services without API access** (Box, iCloud): take screenshots of the folder structure and have Claude catalog them — it reads images
    3. **Cross-reference** across services to find duplicates and stale folders

    The high-value action isn't reorganizing files — it's creating an inventory file that gives Claude awareness of where everything lives. My Dropbox had 630K files totaling 1,400 GB, but only 10% was actively used in the last 12 months. That data made selective sync decisions obvious.

    **Calendar consolidation.** If your events are split across multiple calendar systems, Claude Code can read your Google Calendar via MCP and help identify which events need migrating. The migration itself may require manual work in Calendar.app, but Claude can generate the list and track progress.

    !!! tip "Detailed walkthrough"
        For a step-by-step guide covering disk audit, cloud storage inventory, selective sync optimization, and Google Drive cleanup — with reproducible prompts and time estimates — see the [Cloud Storage Organization Guide](cloud-storage-guide.md).

---

## Prerequisites

To build EA capabilities, you need:

1. **Claude Code installed and configured** — [Install guide (Mac)](../hyperlinks/install-mac.md) or [Install guide (Windows)](../hyperlinks/install-windows.md)
2. **CLAUDE.md with your role, preferences, and projects** — [Setup guide](../build-your-own/agents-md.md)
3. **Gmail MCP configured** (minimum) — [MCP guide](../build-your-own/mcp-setup.md)
4. **Google Calendar MCP configured** (recommended) — same [MCP guide](../build-your-own/mcp-setup.md)

Time estimate: If you haven't done MCP setup yet, budget 1-2 hours for Gmail + Calendar.

!!! tip "Windows users"
    Most EA skills work cross-platform. The exception is Apple Reminders integration — skills like `/todo-queue` and `/morning-brief` use macOS `osascript` to create reminders. On Windows, those reminder steps will be skipped. All email, calendar, and triage functionality works normally. If you need cross-platform reminders, consider Google Tasks instead.

??? info "Choose your infrastructure — calendar and reminders"

    Before building the EA workflow, make two decisions: where to manage your calendar, and where to track persistent action items.

    ### Calendar: Google Calendar vs Apple Calendar

    | | Google Calendar | Apple Calendar |
    |---|---|---|
    | **AI automation** | Full MCP support — Claude reads, creates, modifies events | Read-only via Calendar.app (no MCP) |
    | **Team collaboration** | Native sharing, free/busy visibility | Limited sharing, iCloud-dependent |
    | **Cross-platform** | Works everywhere via web | Best on Apple devices |
    | **Privacy** | Google ecosystem | Data stays on-device |
    | **Best for** | Work scheduling + AI workflows | Personal events + privacy |

    **Recommendation:** Use Google Calendar as the source of truth for work scheduling and AI automation. Keep Apple Calendar for personal events if you prefer. Claude Code can only read and write to Google Calendar via MCP.

    ### Reminders: Where to Track Action Items

    | | Apple Reminders | Google Tasks | Todoist |
    |---|---|---|---|
    | **AI integration** | Via osascript (macOS only) | Google Tasks MCP | API available, no MCP yet |
    | **Siri / voice** | Native Siri support | Google Assistant | Limited voice |
    | **Cross-platform** | Apple devices only | Everywhere via web | Everywhere |
    | **Complexity** | Simple lists + smart lists | Basic lists only | Projects, labels, filters |
    | **Best for** | Apple-ecosystem users | Google-ecosystem users | Power users needing advanced filtering |

    **What I chose:** Apple Reminders. The Siri integration means I can capture tasks by voice from any Apple device. The macOS `osascript` bridge lets Claude Code create reminders directly. The trade-off is it's Apple-only — if you need cross-platform, Google Tasks integrates better with the Google MCP ecosystem.

    ### About the To-Do Skills

    An important distinction: the `/todo-add`, `/todo-review`, and `/todo-queue` skills manage **session-level** task tracking within Claude Code. They are *not* a replacement for Apple Reminders, Google Tasks, or Todoist.

    - **Persistent action items** (things due this week, follow-ups, deadlines) belong in your real reminder system
    - **Session tasks** (things to do right now in this Claude Code session) go in `/todo-add`
    - The EA workflow builds on your real reminder system — `/morning-brief` reads from Apple Reminders or Google Tasks, not from `/todo-add`

---

## Step 1: Install Config Templates

These templates define your email handling rules, calendar preferences, and goal tracking. Skills reference them at runtime — install once, customize to fit your setup.

These commands create the config directory and download the template files. **You don't have to run them yourself** — paste the whole block into the app and say *"run these for me, then show me what you downloaded."* That is the shortest route, and it leaves the agent able to explain anything that fails.

If you'd rather run them by hand, they work unchanged in Terminal on a Mac or PowerShell on Windows.

```bash
# Create config directory
mkdir -p ~/.claude-assistant/config

# Email policy — VIP contacts, auto-archive patterns, label routing
curl -o ~/.claude-assistant/config/email-policy.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/email-policy-template.md

# Triage config — Gmail label IDs, classification rules, score thresholds
curl -o ~/.claude-assistant/config/triage-config.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/triage-config-template.md

# Calendar policy — calendar IDs, working hours, timezone, deep work protection
curl -o ~/.claude-assistant/config/calendar-policy.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/calendar-policy-template.md

# Goals — quarterly objectives for goal alignment in briefings and check-ins
curl -o ~/.claude-assistant/config/goals.yaml \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/goals-yaml-template.yaml
```

Once installed, you'll customize these files by editing them directly or by asking Claude Code to help you fill them in.

**After installing:** Open each file and customize the bracketed fields. At minimum, update `email-policy.md` with your VIP contacts and `calendar-policy.md` with your timezone.

??? info "Define your policies — what Claude can and cannot do"

    One of the most important things I built — and the thing I wish I'd done *first* — was a set of written policy files that define what Claude can and cannot do. Not guidelines. Hard rules.

    **Why this matters:** Without explicit policies, every session starts with ambiguity. Can Claude mark emails as read? Send messages? Move calendar events? Written policies eliminate this class of problem permanently.

    **What a policy file looks like:**

    ```markdown
    # Email Policy

    ## Never Do (Without Explicit Instruction)
    - Mark emails as read
    - Send emails without approval
    - Delete emails
    - Make commitments on my behalf

    ## OK to Do
    - Apply Gmail labels
    - Draft replies (shown, not sent)
    - Create Gmail filters
    - Search and read emails

    ## Graduated Autonomy
    - Start with "propose actions" (read-only)
    - Graduate to low-risk writes (labels, drafts)
    - Only later: medium-risk writes (sending, with guardrails)
    ```

    I keep policy files for email, calendar, expenses, reminders, and travel. Each one took 15-30 minutes to write and has saved hours of confusion.

    **The graduated autonomy pattern** — start read-only, then allow low-risk writes, then cautiously allow higher-risk actions — comes from [Mike Murchison's Claude Chief of Staff](https://github.com/mimurchison/claude-chief-of-staff), which uses a similar "propose → approve → execute" trust model.

    !!! tip "Start here"
        Before building any skills, write an email policy. Even a 10-line version that says "never send without approval" and "never mark as read without instruction" will prevent the most common mistakes.

---

## Step 2: Skill Dependency Order

Install skills roughly in this order. Each works independently, but this sequence builds naturally.

<!-- UPDATE THIS TABLE when adding or removing EA skills -->

| Order | Skill | Works best with | What It Does |
|:-----:|-------|----------|-------------|
| 1 | `/done` | Nothing | Session capture — decisions, follow-ups, handoff notes |
| 2 | `/triage-inbox` | email-policy, triage-config | Smart inbox triage — categorize, label, archive |
| 3 | `/checkin` | `/triage-inbox`, goals.yaml | Interactive daily session (wraps triage + briefing) |
| 4 | `/morning-brief` | email-policy, calendar-policy, triage-config | Daily briefing (standalone alternative to checkin) |
| 5 | `/schedule-query` | calendar-policy | Calendar availability and scheduling replies |
| 6 | `/todo-add` | Nothing | Add items to session task list |
| 7 | `/todo-review` | Nothing | Review and consolidate to-do items |
| 8 | `/todo-queue` | Gmail MCP, Apple Reminders | Batch-convert emails to reminders |
| 9 | `/post-meeting` | Granola or transcript file | Extract decisions, action items, draft follow-up email |
| 10 | `/goals-review` | goals.yaml | Quarterly goal review and recalibration |

??? example "Install all EA skills at once (after completing setup above)"

    Only use this after you've installed the config templates (Step 1) and tested your first three skills. Running this before setup is complete will install skills that can't work yet.

    ```bash
    # Last verified: 2026-03-27. If any curl fails, check the Skill Library for current URLs.
    mkdir -p ~/.claude/commands ~/.claude-assistant/config \
      ~/.claude-assistant/state ~/.claude-assistant/logs

    # EA skills (dependency order)
    for skill in done triage-inbox checkin morning-brief schedule-query \
      todo-add todo-review todo-queue post-meeting goals-review; do
      curl -o ~/.claude/commands/$skill.md \
        https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/$skill.md
    done
    ```

    Restart Claude Code after installing. All EA skills will be available as slash commands.

---

## Quickstart: Your First Three Skills

Don't install everything at once. Start with these three and use them for a week before adding more.

### 1. Session Capture (`/done`)

The easiest win. No config needed. Run it at the end of every Claude Code session.

```bash
mkdir -p ~/.claude/commands
curl -o ~/.claude/commands/done.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/done.md
```

Restart Claude Code, then try: `/done`

### 2. Inbox Triage (`/triage-inbox`)

The highest-value EA skill for most people. Requires Gmail MCP and the config templates from Step 1.

```bash
mkdir -p ~/.claude-assistant/state ~/.claude-assistant/logs
curl -o ~/.claude/commands/triage-inbox.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/triage-inbox.md
```

Restart Claude Code, then try: `/triage-inbox noapply` (preview mode — see what it would do before applying)

**How it works under the hood:** `/triage-inbox` is a filtering system. On each run, it reads your recent emails via Gmail MCP, classifies each message against your rules in `email-policy.md` and `triage-config.md` (VIP senders, keywords, sender patterns), then applies Gmail labels and optionally archives low-priority mail. Over time, you train it: flag false positives (important mail that got archived) and false negatives (junk that stayed), and it refines its classification. It also reads emails and makes judgment calls — recognizing when a "newsletter" actually contains a time-sensitive request, or when a routine sender has something urgent. Think of it as a smart, trainable mail sorter that gets better the more feedback you give it.

!!! quote "Field note"
    My first version had too many categories. I collapsed to a few broad buckets — urgent, needs response, FYI, skip — and accuracy jumped. Start broad. Watch for false negatives in the first week — review what's being auto-archived until you trust it.

??? info "Beyond triage — what else the EA does"

    ### Meeting Processing

    After every meeting, Claude extracts the important parts.

    **How it works:**

    - You provide a transcript (from Granola, Zoom, or manual notes)
    - Claude extracts: decisions made, action items, open questions, key discussion points
    - Results go to a project meeting log or Google Doc

    **What you need:**

    - Meeting transcripts (Granola MCP, or exported transcript files)
    - A project folder or Google Doc to store the results

    !!! quote "Field note"
        Meetings were the second thing I automated, after inbox triage. The value isn't the transcript — it's never having to remember what was decided. The key design choice: meetings go at the TOP of the log in reverse chronological order, so the most recent context is always first.

    ### Communication Drafting

    Claude writes emails, messages, and updates that sound like you.

    **How it works:**

    - Your CLAUDE.md includes voice and tone preferences
    - Claude drafts based on context (who you're writing to, what about)
    - You review and approve before sending

    **Deciding what Claude should draft vs. what you write yourself:**

    Research on AI-assisted email (Cardon & Coman, 2025, *International Journal of Business Communication*) found that recipients barely notice AI involvement in routine messages — but trust drops sharply for relationship-oriented communication.

    | AI-appropriate (draft freely) | Write yourself |
    |------|------|
    | Meeting scheduling and coordination | Recommendation letters |
    | Status requests and updates | Sensitive advising conversations |
    | Administrative logistics | Performance feedback |
    | Deadline reminders | Expressions of gratitude or praise |
    | Form acknowledgments | Conflict resolution |
    | Information distribution | Anything where the recipient would feel slighted to learn AI composed it |

    The heuristic: **if you'd be embarrassed for the recipient to learn AI wrote it, write it yourself.**

    ### Project Tracking

    Claude maintains awareness of your projects through persistent context.

    **How it works:**

    - Your CLAUDE.md lists active projects with brief status
    - Project-specific CLAUDE.md files (in each project folder) contain detailed context
    - Skills like `/done` capture session decisions and follow-ups
    - Weekly reviews pull together updates across projects

    ### Schedule Management

    Claude checks your calendar and helps manage time.

    **How it works:**

    - Calendar MCP reads your Google Calendar
    - Claude identifies conflicts, suggests meeting times, summarizes your day

### 3. Daily Check-In (`/checkin`)

Your daily interactive session. Wraps triage, calendar review, meeting prep, and email drafting into one 10-15 minute workflow. Requires Gmail MCP and the config templates from Step 1.

```bash
curl -o ~/.claude/commands/checkin.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/checkin.md
```

Restart Claude Code, then try: `/checkin quick` (abbreviated version — good for your first run)

!!! quote "Field note"
    I started with `/triage-inbox` alone for a week, then added `/checkin`. The check-in wraps triage into a broader daily session — calendar review, reminder triage, meeting prep, and email drafting. The `quick` flag skips the slower phases so you can ease in. After a few days, try the full `/checkin` for the complete workflow.

---

## Week-by-Week Progression

### Week 1: Triage + Session Capture

1. Run `/triage-inbox` daily — review what it categorizes, correct mistakes
2. Run `/done` at the end of each session
3. Customize `email-policy.md` as you discover edge cases

### Week 2: Check-in + Scheduling

1. Install `/checkin` — wraps triage into a broader interactive daily session
2. Install `/schedule-query` for calendar queries
3. Add voice/tone preferences to CLAUDE.md for email drafting

### Week 3: Briefing + Goals

1. Add `/morning-brief` if you want a lighter passive report alongside your interactive check-in
2. Install `/goals-review` and set up your `goals.yaml`
3. Set up project-specific CLAUDE.md files for your main projects

### After You're Comfortable

Once `/triage-inbox` and `/checkin` are running daily, add [`/morning-brief`](../hyperlinks/skill-reference.md#morning-brief-daily-briefing) if you want a lighter passive report alongside your interactive session. Set up [`/goals-review`](../hyperlinks/skill-reference.md#goals-review-goals-review) to maintain the `goals.yaml` file that powers goal alignment in both `/checkin` and `/morning-brief`.

If you have a high-volume source that floods your inbox — school announcements, employer updates, nonprofit newsletters — see [Organizational Noise Canceling](school-digest.md) for how to build a digest skill that compresses it into a 30-second read.

---

## Meeting Prep and Follow-Up

Meetings were the second thing I automated after inbox triage. The value isn't the transcript — it's never having to remember what was decided, and never walking into a meeting unprepared.

### Pre-Meeting Briefing

Before each meeting, a skill gathers context from your email, chat, calendar, and past meeting notes — then identifies decisions you need to make, open loops (things others owe you), and materials to review. The goal: walk in knowing what matters instead of scrambling to remember.

**Design patterns worth stealing:**

- **Multi-source health checks.** Before synthesizing, validate each data source (email, chat, calendar, transcripts, project docs). If a source is down or empty, degrade gracefully instead of producing garbage. Set a minimum-signal gate: require at least two sources returning data before generating a structured brief.
- **Claim confidence tagging.** Tag every piece of evidence: VERIFIED (confirmed by 2+ sources), SINGLE-SOURCE (one channel only), or INFERRED (your best guess). Suppress inferred claims in decision sections. This prevents treating speculation as fact.
- **Per-source tool call budgets.** Cap the number of tool calls per data source (e.g., max 8 Gmail searches, max 5 WhatsApp queries). When the cap is hit, stop and synthesize what you have. This prevents runaway costs and keeps the skill under 60 seconds.

!!! tip "Build your own version"
    The [`/pre-meeting-brief`](../hyperlinks/skill-reference.md#pre-meeting-brief-meeting-prep-briefing) skill depends on a specific MCP stack (Gmail + Calendar + Granola + WhatsApp + Google Docs). The published version assumes you have those configured; if you don't, the patterns above are portable. Start simple: a skill that reads your calendar for today's meetings, searches Gmail for recent threads with each attendee, and outputs a one-page brief. Add sources as your integrations grow.

### Post-Meeting Follow-Up

After a meeting, `/post-meeting` reads the transcript (from [Granola](../hyperlinks/granola.md), Zoom, or a local file), extracts decisions and action items grouped by person, and drafts a follow-up email to attendees.

**What makes it useful:**

- **Action items grouped by person**, not a flat list. Each attendee can scan their own obligations without reading everyone else's.
- **Dual-format email**: a concise summary up top (decisions + action items + next steps) for busy readers, with detailed meeting notes as an appendix for the record.
- **Transcript-not-ready detection**: if no transcript newer than 30 minutes exists, the skill warns you rather than summarizing an incomplete file.

```bash
# Install post-meeting
curl -o ~/.claude/commands/post-meeting.md \
  https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/post-meeting.md
```

After a meeting, run `/post-meeting` — it will find the most recent transcript and walk you through the follow-up.

---

## The Daily Ritual Stack

After a few weeks, individual skills start compounding into a daily rhythm. Here's how mine works:

| Time | What I Run | What Happens | Duration |
|------|-----------|-------------|----------|
| Morning | `/checkin` or `/morning-brief` | Triage inbox, review calendar, surface overdue reminders, prep for first meeting | 10-15 min |
| Before meetings | `/pre-meeting-brief` | Pull context, identify decisions needed, review open loops | 2-3 min |
| After meetings | `/post-meeting` | Extract decisions and action items, draft follow-up email | 3-5 min |
| End of session | `/done` | Capture decisions, open questions, and handoff notes | 1 min |

You don't need all of these. `/triage-inbox` alone saves an hour a week. But they compound: the morning brief references your goals, the meeting prep references your triage results, and `/done` creates the handoff that makes tomorrow's session seamless.

The key insight: **start with one skill, use it for a week, then add the next.** Each addition feels small but the system gets meaningfully smarter with each layer.

---

??? note "Research notes and sources"

    The policy and graduated-autonomy patterns emerged from research I did in January–February 2026, documented in my [EA research playbook](https://github.com/chrisblattman/claudeblattman). Key sources that shaped the approach:

    - **[Claude Chief of Staff](https://github.com/mimurchison/claude-chief-of-staff)** (Mike Murchison) — Goal alignment, operating modes, and the "push philosophy" where Claude challenges your time allocation. My `/morning-brief` and `/checkin` skills descend from this repo's `/gm` command.
    - **[Dex](https://github.com/davekilleen/Dex)** (Dave Killeen) — Extends the chief-of-staff pattern with pillars, session learnings capture, and usage logging.
    - **[LangChain Executive AI Assistant (EAIA)](https://github.com/langchain-ai/executive-ai-assistant)** — A production-ready framework for Gmail-monitoring AI agents with triage, drafting, and human-in-the-loop review. Their "draft-only pattern" (capture 80% of time savings with zero send risk) directly influenced my approach.
    - **[Claude Code Personal Assistant](https://github.com/c0dezli/claude-code-personal-assistant)** (c0dezli) — A template using Notion + Google Workspace integrations, with a `profile.md` pattern similar to CLAUDE.md.
    - The "propose → approve → automate" trust progression appears independently in most serious EA implementations — it's emerging as a consensus best practice in the Claude Code community (see the [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) index for more examples).

    The AI-appropriate/human-required communication split draws on Cardon & Coman (2025) in the *International Journal of Business Communication* (83% rated AI-assisted routine messages as sincere, but only 40-52% for relationship-oriented messages) and a 13-experiment study in the *Journal of Experimental Social Psychology* on the "transparency paradox."

    Research conducted January–February 2026. Links verified February 2026.

---

## Further Reading

- **[Skill Library](../hyperlinks/skill-reference.md)** — Browse all skills with full install and customization details
- **[Build Your Own](../hyperlinks/system-overview.md)** — Learn to create and refine your own skills
- **[CLAUDE.md Guide](../build-your-own/agents-md.md)** — Configure your persistent context
- **[Downloads & Reference Library](../hyperlinks/downloads/index.md)** — Guides, templates, and deep dives
- **[Resources](../resources.md)** — Reference implementations, tools, and further reading
