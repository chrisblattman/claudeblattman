---
description: Running an ongoing project across many sessions — tell it where things live, keep a brief, do the next piece of work, check it, and close the loop. Eight steps, no terminal.
---

# Regular Users

One task at a time is the [Occasional Users](occasional.md) loop. This is the one for a project
that runs for months: a paper, a grant, a report, an evaluation — something you come back to
weekly, usually after enough time has passed that you've forgotten where you left it.

The thing that changes is **the brief**. One short document that says where things stand, and
which you update when something material changes. The brief is what turns a series of
disconnected conversations into something that accumulates.

<!-- EDITORIAL: this link points at essentials/project-folders.md, which mostly teaches browser
     Projects. The sentence here is about one project having one local folder. Repoint if a
     dedicated local-folder guide lands — BACKLOG C2/N7. -->
Optional first: if you haven't settled how you keep project files, I write about my [AI project
folder system](../essentials/project-folders.md) here, and it's worth a ten-minute read —
everything below assumes one project has one folder.

**What you'll use.** The same three commands as the occasional loop — `/prompt`, `/review-plan`,
`/done` — and nothing new to install. If you haven't added the starter kit yet, [step 1 of the
occasional guide](occasional.md#1-install-the-skills) covers it, and every step below also works
in plain language without it.

<div class="checklist" markdown>

## Pick the project up

### 1. Tell it where everything lives

A research project's information is never in one folder. It's in Dropbox and Box, a Google Doc, two
WhatsApp groups, an Overleaf draft, and your co-authors' inboxes. The agent cannot guess any of
that — and left to itself it will quietly work from whatever subset it happens to see, without
telling you what it missed.

So the first session on a project writes **one file that says where things are.** You write it once
and every future session starts from it.

First, what the agent can actually reach. Listing a location is not the same as being able to open
it, and the difference is worth getting straight before you rely on it:

| Information storage | Can the agent read it? |
|---|---|
| **Local folders** — including Dropbox and Box folders that sync to your machine | **Yes, directly.** These are ordinary paths on disk. A folder that only exists in the cloud is not one of these |
| **A GitHub repository** | **Yes**, once it's cloned to your machine |
| **An Overleaf project** | **Yes** — turn on Overleaf's GitHub sync, clone it, and it becomes a local folder like any other. [Here's a worked example](../downloads/real-claude-md-example.md) |
| **Cloud services** — Google Drive, OneDrive, Google Docs, Slack, WhatsApp | **Only with a connector**, set up once per service. [Setting up connectors](../toolkit/mcp-setup.md), and [WhatsApp specifically](../toolkit/mcp-setup.md#whatsapp) |
| **Your mail** — Gmail or Outlook | **Only with a connector.** [Setting up connectors](../toolkit/mcp-setup.md). Connecting the account is half of it; the other half is the row below |
| **Your co-authors, RAs and project managers** | Not a place at all — but their names, addresses and the project's own vocabulary belong in the file you're about to write, or a mail search can't tell what counts. See below |

<!-- EDITORIAL: the connector links all land on toolkit/mcp-setup.md, which does not yet give
     per-service instructions for OneDrive, Slack or Outlook, and is terminal-heavy throughout.
     BACKLOG C2 is the desktop-first rewrite. Until it lands these are honest "start here"
     pointers, not the step-by-step the cells imply. Re-check the labels after C2. -->

**Record the people — and the words.** Your co-authors, RAs and project managers belong in this
file with their email addresses. The reason is practical: the first time you say *"catch me up on
everything about this project in my inbox,"* the agent needs to know whose mail counts. Without
the list it guesses from subject lines and misses the thread where the decision actually got made.

The same goes for the project's own vocabulary — the working title, the acronym nobody spells
out, the name of the instrument, the two or three subject terms that mean *this* project rather
than the other one. A keyword match still needs reading in context, and the list will never be
exhaustive, but a handful of the right terms turns a hopeless search into a useful one.

Then have it write the file:

```
Write a CLAUDE.md in this project folder recording where this project's information lives. Include: every folder path, the documents that matter and where they are, which sources you can read directly and which need a connector I haven't set up yet, the names and email addresses of my co-authors, RAs and project managers, and the project-specific words, acronyms and short titles that should count as relevant when you search my mail or documents. Ask me for anything you can't work out yourself.
```

!!! tip "If you're using two apps"
    Claude reads `CLAUDE.md`; Codex reads `AGENTS.md`. Keeping two copies is the documented way
    into trouble: if they drift, you have two sets of instructions disagreeing with each other.
    So write one real file and point the other name at it:

    ```
    Make AGENTS.md a symlink to CLAUDE.md in this folder, so both apps read the same file.
    ```

    That's a [symlink](../faq.md#what-is-a-symlink) — one file, two names, nothing to keep in
    sync.

<label class="step-done"><input type="checkbox"> I've written a file that records where this project's information lives.</label>

### 2. Write or refresh the project brief

Now it knows where to look. Rather than asking it to catch you up and then writing that up
separately, have it do both in one pass — read the material, then turn what it found into one
short document that lives with the project:

```
Read everything in this folder. Then write PROJECT-BRIEF.md: the goal, where things stand now, decisions already made and why, open questions, and the next actions. Keep it to one page. Tell me separately about anything that looks stale, or any two documents that contradict each other.
```

That last sentence is the valuable one. An agent reading six months of files will find the two
documents that disagree about the sample size, the decision you made twice in opposite
directions, and the deadline that has quietly passed. That's work you would not otherwise do, and
you want it flagged rather than silently resolved inside the brief.

If a brief already exists, ask it to update that one rather than write a new one — then read what
it tells you it changed. Two competing briefs is worse than none.

!!! warning "Read the brief yourself before you build on it"
    Everything downstream — this session and the next five — rests on this file being right. A
    wrong decision recorded here will be confidently repeated for months. The agent is reading the
    files, and the files may be out of date in ways only you know about. This is the single
    highest-value five minutes on the page, and the agent re-reading its own work is not a
    substitute for it.

!!! tip "Reuse the shape next time"
    If you run several projects that look alike, the brief is worth templating — the same
    headings every time means you can see at a glance what's missing. Ask for one:

    *"Turn this brief into a blank template I can reuse for other projects of this kind."*

    Or start from mine: [a project-brief starter template](../templates.md#project-brief-project-briefmd).

    Then improve it as you go. After a few projects you'll know which fields you actually read
    and which you skip.

<!-- EDITORIAL: now points at the real template, created 7 Oct at
     templates/project-brief-template.md and surfaced on docs/templates.md.
     N7's remaining ask stands: Shay should still read it against any private
     brief he already uses before this ships. -->

!!! note "Where the brief lives, if it isn't just yours"
    On a solo project I keep `PROJECT-BRIEF.md` in the project folder and that's the end of it.
    On a project with co-authors and RAs it has to live somewhere they'll actually look, and
    there are two reasonable answers. A **first tab in the master Google Doc** that already holds
    the notes and instruments puts it where the team reads — at the cost of a document that grows
    messy, where the brief slowly becomes another section nobody scrolls to. A **single file in
    the shared Dropbox or Box folder** keeps the brief next to the materials it describes and
    stays easy to point an agent at — at the cost of one more place to remember.

    Whichever you pick, the agent has to be able to *reach* it. A Google Doc needs a connector; a
    synced folder doesn't. If the brief doesn't live at `PROJECT-BRIEF.md` in the folder, say so
    in the file you wrote in step 1, and point at the real location everywhere this page says
    "the brief".

<!-- EDITORIAL: the first-person claim above describes Shay's own practice and is written from
     the annotation, not from anything verified in the repo. Confirm before publishing. The
     colour-coded-emoji joke from the annotation was left out — flag if it should go back in. -->

<label class="step-done"><input type="checkbox"> The agent made me a project brief, and it matches my understanding of where this project stands.</label>

## Do the next piece of work

### 3. Choose the next useful result

Pick one bounded deliverable — a meeting brief, a revised section, a decision memo, a reviewer
response. Then ask the question that saves the session:

```
Before we start, what's missing that you'd need to do this well? Are there any open questions we still need to resolve?
```

Half the time the answer is a file you forgot to put in the folder. Better to find out now.

The other half, it surfaces a question you can't answer off the top of your head — something that
needs outside evidence, or a piece of a literature you don't know. That's what the next step is
for. If nothing like that came up, skip it.

<label class="step-done"><input type="checkbox"> I've chosen a deliverable I want to work on.</label>

### 4. Optional — close a knowledge gap with research

Only if step 3 turned up a real gap. There are two versions of this, and the difference is the
size of the question.

**A small, concrete question.** Ask in plain language, and bound it:

```
I need to understand X before I can write this. Find what's current, tell me where the disagreement is, and give me the sources — don't summarise into false consensus. Stop at ten sources.
```

You get one model's answer and a short source list, in the session you're already in.

**A bigger conceptual question** — a literature you need to actually understand, not just cite.
That's the [deep research workflow](../workflows/deep-research.md), and the shape is:

1. Define the question precisely, because every model gets the same prompt.
2. Run it past several AIs in parallel so you aren't reading one model's view of the field.
3. Synthesise — a separate pass reads the reports as data and tells you where they agreed, where
   they contradicted each other, and what none of them covered.
4. File the reports with the project, so the next session can read them.

Afterwards you should be able to find the raw reports and the synthesis in this project's folder,
not in a chat window you'll lose. **What you'll have depends on which route you took** — the
plain-language version above gives you one model's answer, not a three-vendor synthesis, so don't
go looking for files it never produced.

Then, either way: **check the citations before you use any of it.** Open two or three. Research
summaries are where fabricated references appear, and a fabricated reference in a grant is a bad
day.

!!! warning "Deep research is a separate setup"
    The full workflow has its own tooling and is **not** one of the six skills you installed. The
    plain-language version above needs nothing extra and is enough for most gaps.

<label class="step-done"><input type="checkbox"> Either I didn't need this, or I've brought checked findings back into the project.</label>

### 5. Plan it, challenge it, do it

This is the [occasional-user loop](occasional.md#2-pick-one-bounded-task), unchanged:

1. Describe what a good result looks like, and ask for a plan rather than an answer.
2. Run `/review-plan` to have the three default critics challenge it.
3. Resolve the objections and settle on the plan you actually want.
4. Let the agent execute.

Two things are different inside a project:

- **Point at the brief.** *"The plan should be consistent with PROJECT-BRIEF.md."* The critics then
  test the plan against decisions you already made, which is most of their value here.
- **Let research inform the plan.** If step 4 turned something up, say so before planning — not
  after, when the plan is already built on the old assumption.

<label class="step-done"><input type="checkbox"> I planned the work, pointing the agent to the brief and to my research findings if I had any.</label>
<label class="step-done"><input type="checkbox"> I had the plan challenged.</label>
<label class="step-done"><input type="checkbox"> I resolved the objections.</label>
<label class="step-done"><input type="checkbox"> I let the agent run.</label>

### 6. Check the result

Open it and read it. Test it against the brief, not just against the plan — the plan can be
executed perfectly and still produce something that contradicts a decision from four months ago.

Then do the checks no AI should do for you: follow two citations to their sources, re-add one
column of numbers, and confirm the thing actually says what you'd tell a colleague it says. You
are not auditing every claim in a long document — you are sampling, and a sample that comes back
clean is worth more than a promise.

!!! tip "Optional — put a council on the output"
    `/council` — the skill that's nested inside `/review-plan` — will also read a finished piece
    of work, so for something consequential you can point it at the output file and ask for a
    critique against the brief.

    The useful move here is **critics suited to the thing you made**, mixed with the defaults —
    a panel doesn't have to be all one kind:

    - **For code:** a software developer, a statistician, an econometrician.
    - **For a proposal:** an IRB liaison, a donor's perspective, a skeptic.

    Roles like those aren't in the kit, and you write each one once —
    [read how to build reusable agent personas here](../workflows/council.md).

    A different *agent* is the stronger independence check when you have one, since a same-family
    critic shares the blind spots of whatever wrote the work.

<!-- EDITORIAL: the shipped council has FOUR personas (skeptic, pre-mortem, completeness-checker,
     chief-of-staff) and caps a panel at four. None of the six example roles above exists as a
     persona file, so /council --panel software-developer,... stops with "persona file missing".
     The "build reusable agent personas" link was added 7 Oct at Shay's request and points at
     workflows/council.md, which describes the OLDER five-critic setup with --chef-skill and
     personas the bundle does not ship. It is therefore the right destination for the question
     and the wrong content for the answer — C9 is now blocking a live link, not just a withheld
     one.
     They are written as roles the reader could want, not as commands they can run today. Needs
     either persona files in the bundle or a maintained how-to-add-a-critic page before this gets
     a link — BACKLOG C9. -->

<label class="step-done"><input type="checkbox"> I've checked the result against the brief.</label>
<label class="step-done"><input type="checkbox"> I checked a random sample of facts and numbers myself.</label>

## Close the loop

### 7. Save the work, then update the brief

Two separate things, and it's worth being clear about why. **`HANDOFF.md` is the snapshot for the
next session** — what happened today, what's half-finished, what to pick up first. **The brief is
the durable record** — where the project stands and which decisions govern it. One is a note to
tomorrow; the other is the thing that survives six months.

First, the handoff:

```
/done
```

That writes `HANDOFF.md`. It does **not** touch the brief — nothing updates the brief for you, so
the second action is its own prompt:

```
Review our project brief against what changed today. If any material status, decision, open question, or next action changed, update the existing brief where it lives. Show me what you changed so I can check it.
```

Plenty of sessions won't need that second one to change anything, and that's a fine outcome — a
brief you rewrite out of habit is a brief nobody trusts. Update it when something material moved.

<label class="step-done"><input type="checkbox"> The deliverable is saved in a place that makes sense to me.</label>
<label class="step-done"><input type="checkbox"> I've finished and checked my <code>HANDOFF.md</code> file.</label>
<label class="step-done"><input type="checkbox"> The brief reflects what we decided today.</label>

### 8. Optional — put the repeatable part on a schedule

Only once a routine has proven itself. Pick the bounded, boring part — a weekly status brief, a
first-pass meeting prep, a digest of what changed — and be specific about five things: the inputs,
how often, where the output goes, when it should interrupt you, and what a human still has to
check.

!!! danger "Scheduling something to be drafted is not permission to send it"
    Keep anything that leaves your control — email, calendar invitations, messages, posts,
    submissions — behind an explicit human yes, every time. A scheduled job should put a draft
    somewhere you'll see it, and stop. The same goes for decisions: a scheduled brief can recommend
    and must not commit.

<label class="step-done"><input type="checkbox"> I've considered what parts of my workflow can be automated.</label>
</div>

## What to try next

- **[Automate a routine](../workflows/school-digest.md)** — a worked example of step 8: a
  recurring job that reads, filters and drafts, and still stops before anything is sent.
- **[Catch up on a project](../workflows/project-management.md)** — a longer treatment of the
  reading pass inside step 2, for projects that have got away from you.
- **[Weekly review](../workflows/weekly-review.md)** — the same loop across all your projects at
  once rather than one at a time.
- **[Build a skill](../system/building-skills.md)** — once you've run the same sequence three or
  four times and want it behind one command.
- **[Teaching AI your voice](../essentials/voice.md)** — worth it once drafting is a regular part
  of the work.
