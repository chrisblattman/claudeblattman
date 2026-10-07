---
hide:
  - navigation
description: What's new on claudeblattman.com — April 2026 content update covering session discipline, sub-project routing, the meeting loop, weekly review, /recall, dial-back prompting, the five-persona critic council, and the tips pipeline.
---

# What's New — April 2026

A month of workflow improvements, batched into two launches. Launch 1 went live April 17 with the seven pages below. **Launch 2 partially shipped April 26** — the tips pipeline, the multi-critic council, and the rest of the daily-workflow skill versions are now public; the voice pack and the full prompt-architecture page are still pending.

!!! tip "TL;DR"
    Three threads run through this update:

    1. **Session discipline** — how to run long work across `/rewind`, `/compact`, `/clear`, `/done`, and plan mode without losing context.
    2. **Sub-project routing** — multi-task projects that don't collapse under their own sprawl.
    3. **The boring daily workflow that earns its keep** — meeting loop, weekly review, `/recall` for searching past sessions, and why I stripped ceremonial emphasis from my skills.

---

## How the pieces fit

A normal workflow day on this stack:

1. **Morning** — `/morning-brief` runs before I sit down. I open the inbox; triage labels are already applied.
2. **First call** — `/pre-meeting-brief` pulls context from WhatsApp, Gmail, Granola, and Google Docs. I read it on the way.
3. **During the call** — Granola records. Claude Code stays idle.
4. **After the call** — `/post-meeting` drafts the follow-up email with decisions and action items extracted from the transcript.
5. **Between calls** — deep in a paper or proposal. When the session fills up, `/rewind` for wrong paths, `/compact <hint>` for stale exploration, `/done` when it's time to hand off to another machine.
6. **Stuck on something I've solved before?** — `/recall` searches every past Claude Code and Codex transcript. Usually finds the answer in the second or third result.
7. **Week end** — `/weekly-review` synthesizes project updates across transcripts, emails, and Google Docs. Takes an hour, covers a week.

Each piece has its own page below.

---

## Launch 1 — shipping this week

### Session management

How to run long sessions without losing your place. Decision matrix for `/rewind` vs `/compact <hint>` vs `/clear` vs starting fresh. Covers the four `/rewind` restore modes, when compaction hints actually steer the summary, and the real hook names (there's no `PostCompact` hook — compaction-aware reinjection ties to `SessionStart`). [Read more →](essentials/session-management.md)

### Sub-project routing

When a project has three or four parallel workstreams — say, a paper, a grant revision, a trip itinerary, and an RA pipeline — I don't want their context bleeding into each other. `/start-task` plus `.claude/active-subproject.json` handle the routing. Handoffs land in the right folder, and SessionStart knows which sub-task is active. [Read more →](workflows/sub-project-routing.md)

### Meeting workflow end-to-end

A four-step loop that replaces about 20 minutes of manual work per meeting. `/pre-meeting-brief` pulls context before. Granola records during. `/post-meeting` extracts decisions and action items after and drafts the follow-up email. [Read more →](workflows/meeting-workflow.md)

### Weekly review

The 3-marker system (done / in-progress / blocked) with batch updates and Granola transcript handling. Synthesizes a week of multi-project work in about an hour. Output is a single document I can hand to an RA, a collaborator, or future-me. [Read more →](workflows/weekly-review.md)

### `/recall` — search every past session

SQLite FTS5 full-text search with BM25 ranking over local Claude Code and Codex JSONL transcripts. Same-machine only. Installed it because I kept solving the same problem twice. Skill by [arjunkmrm](https://github.com/arjunkmrm) (MIT). [Read more →](workflows/recall.md)

### Dial-back discipline

Why I stripped `CRITICAL`, `YOU MUST`, and `ABSOLUTELY` from most of my skills. Ceremonial emphasis overtriggers Claude 4.5+ in tool-use paths and degrades output quality. The fix is positive examples instead of negative rules, and saving emphatic language for genuinely blocking security or data concerns. [Read more →](build-your-own/dial-back-discipline.md)

### Prompt architecture (partial — expanded)

Three new sections on the Prompt Engineering page: long-content ordering (put the document at the top, question at the bottom), system-vs-user prompt separation, and reusable constraint blocks (anti-hallucination, anti-bloat, scope guard, structured uncertainty, voice preservation). The full package — including a prompt-preferences template download — ships in Launch 2.

---

## April 26 — early Launch 2

Eight skill files updated or shipped, plus one new agent. Three threads:

### Daily-workflow versions caught up

The skills the meeting workflow page already references, brought to current versions on a single push.

- **`/post-meeting` v1.0 → v1.7** — hollow-transcript guard, explicit sender choice (you vs. an AI EA identity), and a recipient rule that defaults to the full team minus low-frequency categories. Production-validated end-to-end on a real research-team meeting. [Skill file →](https://github.com/chrisblattman/claudeblattman/blob/main/skills/post-meeting.md)
- **`/weekly-review` v1.4 → v1.9.1** — strict YAML config parsing (loud failure on malformed `.claude/CLAUDE.md`), bundled helper scripts for multi-tab Google Doc writes, RTF/PDF transcript normalization, per-meeting hollow-transcript handling, document-comment processing. Two council reviews shaped the v1.9 series. [Skill file →](https://github.com/chrisblattman/claudeblattman/blob/main/skills/weekly-review.md)
- **`/prompt` v2.0 → v2.1** — Opus 4.7 update: long-content ordering and system-vs-user separation in the formatting core; optional `council` token to route a formatted prompt through a multi-critic review. [Skill file →](https://github.com/chrisblattman/claudeblattman/blob/main/skills/prompt.md)
- **`/tips-curate` v1.3 → v1.5** — end-of-run backlog check that prompts `/tips-integrate` when unprocessed HIGH-quality tips exceed 15. Replaces a standing biweekly calendar ritual. [Skill file →](https://github.com/chrisblattman/claudeblattman/blob/main/skills/tips-curate.md)

### `/done` v2.1 — sub-project routing rewritten

The session-capture skill grew the most this month. The v2.x series rewrote routing to put the current working directory ahead of stale state:

- **Rule 1, CWD precedence:** if you're in a sub-folder with its own `HANDOFF.md`, route there regardless of any state file. The actual workspace beats whatever was set days ago.
- **Rule 2, fresh active state with a divergence guard:** route to `active-subproject.json` only if the state was modified in the last 24 hours (or marked permanent) AND the session topic actually overlaps with the state's task name. The token-intersection check prevents silent misroutes when state is stale or pointing somewhere irrelevant.
- **Non-destructive fallback:** when neither rule fires, `/done` writes session content to a project-root `SESSION_LOG.md` instead of overwriting any project-root `HANDOFF.md` you maintain by hand. That destructive path is removed, not guarded.

[Skill file →](https://github.com/chrisblattman/claudeblattman/blob/main/skills/done.md)

### `/council` and the tips pipeline are public

The two pieces I'd flagged as pending in the original Launch 2 list shipped together because they share a dispatch pattern.

- **`/council` v1.2 (NEW publicly)** — parallel critic agents + a separate synthesis pass. Hard cap of 5 critics, single-round only, never majority-votes on narrative output. The `--chef-skill` mode works out of the box (no persona files required) for skill/tool-design reviews. Default panels (plan / paper / decision / grant) require persona agent files in `~/.claude/agents/`. [Skill file →](https://github.com/chrisblattman/claudeblattman/blob/main/skills/council.md)
- **`/tips-integrate` v1.2 → v2.1** — Phase 1.5 dispatches a 5-persona council (Catalog Conflict / Maintenance Tax / Compounder / First-Run / Skeptic) before generating proposals. Composite scoring is `mean(5 personas) − 0.1 × blocker_count` — additive penalty, no clamping, the council ranks but doesn't dismiss. Top 3 auto-apply, items 4–7 one-tap, items 8–15 visible with full detail. Falls back to single-critic mode when the agent file is missing. [Skill file →](https://github.com/chrisblattman/claudeblattman/blob/main/skills/tips-integrate.md)
- **`agents/proposal-critic-agent.md` (NEW publicly)** — one parameterized agent file invoked five times in parallel, each with a different persona passed in the prompt. Bundled alongside `/tips-integrate`. [Agent file →](https://github.com/chrisblattman/claudeblattman/blob/main/agents/proposal-critic-agent.md)

### Continuous-improvement page consolidated

The four-skill pipeline now has a single canonical page that explains how the parts fit together. Lede leads with the firehose problem (tips arrive faster than anyone can adopt them) and six concrete questions: which to adopt, where to store them, how to remember them, how to prioritize, how to get them into your workflow, how to avoid wrecking a working setup with a bad addition. The four stages (discover / curate / integrate / applied), a worked tip-to-rule-change example, the five critic personas, the actual changes the council has approved, install instructions, the tips log and learning-catalog mechanics — all in one place. [Read the page →](system/continuous-improvement.md)

---

## Launch 2 — still pending

A couple of pieces still waiting.

- **Voice pack system** — register overlays (core voice + proposal + public writing + email) plus a critic-agent that flags drift at the line level. Shown as a complete pack with sanitized downloads. Gated on voice-pack sanitization.
- **Prompt architecture (full page)** — the Prompt Engineering page got three new sections in the April 17 launch (long-content ordering, system-vs-user, constraint blocks). The complete page update plus the [prompt-preferences template](downloads/index.md#templates) as a paste-into-any-project download is still pending.

---

## Stay updated

- **[Email updates](https://buttondown.email/claudeblattman)** — low volume, easy opt-out.
- **[GitHub](https://github.com/chrisblattman/claudeblattman)** — star if useful; the repo is public.
- **[Feedback](mailto:claudeblattman+feedback@gmail.com?subject=Feedback)** — what's missing, what's wrong, what's confusing.
