---
description: Starter files for the documents this site asks you to keep — your instructions file, a project brief, a weekly dashboard, a voice pack — plus the config files the executive-assistant skills need.
---

# Templates

Blank starting points for the files this site asks you to make. Each one is a real file in the
[repository](https://github.com/chrisblattman/claudeblattman/tree/main/templates); you shouldn't
need to go there.

!!! tip "You don't have to download anything"
    Every template has a prompt. Paste it to your agent and it fetches the file and puts it where
    it belongs. No account, no install, no terminal. The **view** link opens the raw file in your
    browser if you'd rather read it first.

    New to any of this? [What are Git and GitHub?](faq.md#what-are-git-and-github)

## The documents you keep

Four files, and it is worth knowing which is which, because they do different jobs and people
conflate them.

### Your instructions file — `CLAUDE.md` / `AGENTS.md`

Read automatically at the start of every session: who you are, how you work, where things live.
The one file that pays for itself fastest. Built in [week 1](starter-kit/two-month-plan.md);
explained on [Write your AGENTS.md](toolkit/claude-md.md), with
[an annotated real one](downloads/real-claude-md-example.md) to compare against.

[:octicons-link-external-16: view](https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/claude-md-template.md)

```
Fetch https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/claude-md-template.md and save it as CLAUDE.md in this folder. Then walk me through filling it in, one section at a time. Make AGENTS.md a symlink to it so both apps read the same file.
```

### Project brief — `PROJECT-BRIEF.md`

One page holding where a project stands and which decisions govern it. The durable record, as
against `HANDOFF.md`, which is only a note to your next session. Built in
[week 5](starter-kit/two-month-plan.md) on the
[Regular Users](starter-kit/regular.md) page.

[:octicons-link-external-16: view](https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/project-brief-template.md)

```
Fetch https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/project-brief-template.md and save it as PROJECT-BRIEF.md in this folder. Then read everything here and fill in what you can, and ask me about the rest.
```

### Weekly dashboard

The brief's grown-up form. Once `/weekly-review` is running it maintains this for you every week
in a Google Doc. **Create the doc yourself and paste this in first** — the skill replaces the
content between the markers and will stop if they're missing. See
[weekly review](workflows/weekly-review.md) and
[a real one after a few months](workflows/examples/project-overview-example.md).

[:octicons-link-external-16: view](https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/dashboard-template.md)

```
Fetch https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/dashboard-template.md and show me the contents so I can paste it into a new Google Doc. Explain what the three marker lines are for and why I must not edit them.
```

### Your voice pack

How you write, so drafts come back sounding like you rather than like nobody. Week 4, on
[Teaching AI your voice](essentials/voice.md).

[:octicons-link-external-16: view](https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/voice-pack-template.md)

```
Fetch https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/voice-pack-template.md and save it in this folder. Then interview me to fill it in, using anything of mine you can already read as evidence.
```

## Config files for the executive-assistant skills

Only needed if you're setting up the skills in [week 8](starter-kit/two-month-plan.md). Each is
required by the skill beside it, and the skill won't run without it.

| Template | Needed by | |
|---|---|---|
| Goals | `/checkin`, `/morning-brief`, `/goals-review` | [:octicons-link-external-16: view](https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/goals-yaml-template.yaml) |
| Email policy | `/triage-inbox`, `/morning-brief` | [:octicons-link-external-16: view](https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/email-policy-template.md) |
| Triage config | `/triage-inbox` | [:octicons-link-external-16: view](https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/triage-config-template.md) |
| Calendar policy | `/schedule-query` | [:octicons-link-external-16: view](https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/calendar-policy-template.md) |
| Email voice | `/triage-inbox` drafting | [:octicons-link-external-16: view](https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/email-voice-template.md) |

One prompt does the lot — name the ones you want:

```
Fetch these templates from https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/ and put each one where its skill expects to find it: goals-yaml-template.yaml, email-policy-template.md, triage-config-template.md, calendar-policy-template.md, email-voice-template.md. Tell me where you put each, and which I need to fill in before the skills will work.
```

## There are more skills than the starter kit

The [starter kit](starter-kit/occasional.md#1-install-the-skills) is six skills, deliberately.
The repository holds about twenty-five more — daily check-ins, inbox triage, meeting prep and
follow-up, scheduling, to-do handling, proposal drafting, tax prep. The
[skill library](setup/skill-reference.md) describes each one and what it needs.

You don't have to take them all, and most people shouldn't. Pick the one that solves a problem
you actually have this week.
