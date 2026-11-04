---
description: A four-step meeting loop that replaces about 20 minutes of manual work per call — pre-brief from email and Granola, automatic transcription, post-meeting summary, and a drafted follow-up email.
---

# Meeting Workflow End to End

Most of my meetings used to take longer to prepare for and follow up on than to actually run. A 45-minute call meant 15 minutes reviewing the thread, 10 minutes drafting notes during, 15 minutes writing a follow-up, and another 10 minutes filing everything. The actual conversation was the cheapest part.

The workflow below automates the bookend work. I still have the meeting. What I don't do any more is remember what we decided last time, take notes, or draft the thank-you.

Four steps.

---

## 1. Before the call: `/pre-meeting-brief`

Run from the project folder 15–30 minutes before a meeting. The skill pulls context from several sources and writes a one-page brief:

- **Google Calendar** — the next upcoming event (or one matching a keyword) and its attendees
- **Gmail** — threads with the attendees in the lookback window, with snippets
- **Granola** — transcripts from prior meetings on the same project
- **Google Docs** — the project's living dashboard and research design docs
- **WhatsApp** — any recent discussion with the meeting's participants in group chats
- **Local files** — handoffs and notes in the project folder

The brief surfaces three things explicitly: **decisions required** (what needs to be agreed in this meeting), **open loops** (commitments from last time that aren't resolved), and **preparation needs** (things I should have read or done before walking in).

The skill has two depth modes: **Light** (top-of-file brief for routine check-ins) and **Full** (deep synthesis across six weeks of history for quarterly reviews or a first meeting with a funder). Auto-detection picks by default; `light` or `full` argument overrides.

Optional: it can draft a pre-meeting email to the attendees (`/pre-meeting-brief email`) with agenda items and prep asks. That stays as a draft in Gmail — I review and send manually.

---

## 2. During the call: Granola records

I use [Granola](https://granola.ai) for meeting transcription. It runs in the background on the Mac, captures audio from both sides of the call (Zoom, Meet, in-person), and produces a transcript plus AI notes. The key word is *transcript* — the AI notes are a bonus, but the verbatim transcript is the evidence the next step relies on.

I don't take notes during the meeting. That's the point. I pay attention, and Granola captures the record.

---

## 3. After the call: `/post-meeting`

Within an hour of the meeting ending, I run `/post-meeting` from the same project folder. The skill:

1. Finds the most recent Granola document for the project (or accepts a keyword or ID argument)
2. **Checks the transcript is real, not hollow.** This is the quality gate added in v1.4 — if Granola captured only AI notes but no verbatim transcript (which happens sometimes when a participant's mic fails or the desktop app crashed mid-call), the skill stops and says so. Drafting a follow-up email off bare AI notes produces confident-sounding summaries of things nobody said.
3. Extracts structured output: key decisions, action items (with owners where stated), blockers surfaced, next steps.
4. Drafts a follow-up email to the attendees using the extracted structure.

The email draft lands in Gmail. I review and send manually — this step is deliberately not automated. A sent email is irreversible, and every project has meetings where a specific phrasing would be better coming from me.

`/post-meeting save` also writes a markdown summary to the project's `transcripts/` folder. That's what `/weekly-review` reads from later.

---

## 4. Weekly: `/weekly-review` closes the loop

This isn't part of the per-meeting workflow, but it's where the meeting records earn their full keep. Every Friday, `/weekly-review` reads the week's transcripts, combines them with email and WhatsApp, and updates the project's living dashboard. Decisions, action items, and blockers that surfaced in meetings flow into the dashboard automatically.

See [Weekly Review: the mechanics](weekly-review.md) for how that piece works.

---

## What this replaces, concretely

Before:

1. Scroll Gmail + Google Docs for 15 minutes before the meeting to remember where we left off.
2. Switch attention between the conversation and note-taking, losing detail on both.
3. After the call, try to remember what was decided. Draft a follow-up email. Miss half the action items. Send it 36 hours later when you finally have time.
4. Nothing written down anywhere project-wide. Next meeting starts the cycle over.

After:

1. Two minutes skimming the brief. Walk in with everything already in working memory.
2. Full attention on the conversation. No notes.
3. Thirty seconds to run `/post-meeting`, two minutes to review the drafted email, send.
4. Weekly review pulls it all into the dashboard, where it's retrievable next time.

Total time saved per meeting: roughly 20 minutes. Across 8–12 meetings a week, that's a reclaimed half-day.

---

## The quality gates that matter

Three places where this workflow would fail without a deliberate check:

1. **Hollow transcript check** (step 3). Granola occasionally captures AI notes without a full transcript. Drafting off AI notes alone produces invented detail. The hard stop is the fix.
2. **Email draft review** (steps 1 and 3). Both `/pre-meeting-brief` and `/post-meeting` can draft emails. Neither sends automatically. Every email is reviewed in Gmail before it goes.
3. **Project folder scoping** (steps 1 and 3). Both skills run from the project folder and read only that project's context. If I ran them from my home directory they'd pull six months of unrelated history from every project at once. Starting in the right folder is the discipline; the skills enforce it by reading `$(pwd)/.claude/CLAUDE.md` for config.

---

## What doesn't automate well

- **Sensitive meetings.** Grievance conversations, personnel decisions, anything confidential. Granola stays off; I take notes by hand; no `/post-meeting`.
- **First meetings with a new funder.** The AI brief helps me prep, but I read the full thread manually too. The stakes are high and the cost of missing a tone cue is worse than the time saved.
- **Lab meetings with 10+ attendees.** Granola works, but the transcript becomes hard for `/post-meeting` to parse into per-person action items when four people are talking at once. I either run it and hand-edit, or rely on the lead RA's written notes.

The workflow is a default, not a rule. When it fits, it fits cleanly. When it doesn't, don't force it.

---

## Related

- **[Weekly Review: the mechanics](weekly-review.md)** — how meeting records aggregate into a project dashboard.
- **[Project Management](project-management.md)** — the broader system these meeting skills live inside.
- **[What's new in April 2026](../changelog.md)**.
