---
description: A decision matrix for /rewind, /compact, /clear, /done, and plan mode. How to run long sessions in Claude Code without losing your place or running out of context.
---

# Session Management

<span class="badge-teal">Claude Code</span>

Claude Code sessions are not meant to be infinite. The longer one runs, the more the model's attention dilutes across accumulated context, and the more expensive each turn gets. Most long sessions would produce better work if they were two or three shorter sessions with deliberate handoffs between them.

This page covers the tools for doing that: `/rewind` when you've gone down a wrong path, `/compact <hint>` when exploration has gone stale, `/clear` when you're starting something new, `/done` when you're handing off, and plan mode for the times when the right next step is to slow down and think.

---

## The decision matrix

| Situation | Use | Why |
|-----------|-----|-----|
| You realize the last 10 minutes went down a wrong path | `/rewind` | Keeps useful outputs (in convo-only or summarize-forward mode), drops the failed approach. Cheapest recovery. |
| Exploration is stale — you've been debugging for an hour and the session is cluttered | `/compact <hint>` | Summarizes the session toward what you'll need next. The hint matters. |
| You're about to start a different task in the same window | `/clear` | Zero context rot. Best for truly new work. |
| You're about to close the laptop or hand off to another machine | `/done` | Writes a handoff file that SessionStart picks up later. |
| You're about to start a non-trivial implementation task | Plan mode (`Tab`) | Forces a plan before you write any code. Catches wrong directions before they cost context. |

Most people reach for `/compact` too quickly. For three common cases, one of the others is the right move.

---

## `/rewind` and its four modes

`/rewind` (Esc Esc) shows a restore menu with four options. They matter; pick deliberately.

- **Code + conversation** — revert file edits *and* conversation state. Use when the work was wrong and you want to start over from a prior moment. Useful outputs are lost.
- **Conversation only** — revert conversation state, keep file edits. Use when the conversation went in circles but the code or files the session produced along the way are still good.
- **Code only** — revert file edits, keep the conversation. Unusual. Use when you want to re-attempt the edits with the conversational context already in place.
- **Summarize forward** — keep everything but compress what got you here. Similar to `/compact` but narrower in scope.

The default choice isn't "undo everything." Most of the time, conversation-only or summarize-forward is what you want — you keep the good outputs and drop the deliberation that wasn't useful.

---

## `/compact <hint>` — the hint is the whole point

`/compact` summarizes the current session so you can keep working. Without a hint, the model decides what to keep and what to drop. That works well on short, clean sessions. On long or branchy ones, it tends to drop details you didn't realize you still needed.

The hint steers the summary:

```
/compact focus on the auth token logic; drop the earlier debugging
of the unrelated CSS issue
```

```
/compact I'm about to write the robustness section of the paper; keep
the specification decisions but drop the earlier data cleaning
```

Think of it as handing the model a note that says "what matters from here is X." The more specific, the better the compression.

One honest caveat: even a steered compact can go wrong when the model can't predict the direction your work is about to take. Don't rely on `/compact` after long debugging sessions where the next step is unclear. In those cases, `/done` + a fresh session is more reliable.

---

## `/clear` vs. new session

`/clear` empties the conversation in place. No compaction, no summary, no memory of what came before. Use it when the next task is genuinely unrelated to the current one.

Starting a new session (close the window, open a new one) is similar but lets the `SessionStart` hook fire — which is what injects any project-level handoff, MEMORY.md content, and auto-loaded rules. For anything longer than a quick one-off, starting a new session is preferable to `/clear` because the handoff injection is automatic.

---

## `/done` and handoffs

`/done` is the end-of-session capture skill. It writes three things:

1. A structured handoff to the project's `HANDOFF.md` — key decisions made, open questions, follow-ups, key files touched.
2. A session-log entry to `planning/session-log.md` (or wherever your project keeps logs) — a dated one-liner summary.
3. A log row to performance tracking — tool-call count, duration, rough cost proxy.

The next time a session starts in the same project, a `SessionStart` hook reads the handoff and injects it as context. You pick up roughly where you left off.

This pattern is what I use for cross-machine continuity. The handoff file lives in Dropbox, so a session on the desktop in the morning and a session on the laptop in the afternoon both see the same state. A few important notes on the mechanics:

- **There is no `PostCompact` hook in Claude Code.** Compaction-aware context injection ties to `SessionStart`, which fires on every session start including post-compaction resumes. If you see documentation referring to "PostCompact," it's wrong — the hook doesn't exist.
- **Verified hook keys** (as of April 2026): `SessionStart`, `PreToolUse`, `PostToolUse`, `PreCompact`, `Notification`. These are the hooks you can write shell scripts against.
- **No mid-session re-inject hook.** You cannot swap context in the middle of a running session. `/rewind`, `/compact`, and `/clear` are the available operations; nothing listens for "I want to re-inject context right now."

---

## Plan mode — when the right next step is to stop coding

Plan mode (press `Tab` at the prompt to toggle) tells Claude Code to design an implementation approach without making any edits or running non-read-only tools. The output is a plan file in `~/.claude/plans/` that you review, revise, and approve before anything changes.

Three situations where plan mode earns its keep:

1. **You're about to touch multiple files.** A bug fix in one function is fine to do directly. A refactor across five files benefits from a plan you can review before any file is changed.
2. **The scope is ambiguous.** If your request could mean two different things, plan mode surfaces the interpretations before the model commits to one.
3. **The stakes are high.** Production config, database migrations, anything hard to reverse. A plan you review costs five minutes; a bad commit costs an afternoon.

The plan mode cycle is: enter plan mode → describe the work → the model writes a plan to a file → you review it → `ExitPlanMode` accepts the plan and lets the model execute. You can iterate on the plan as many times as needed before accepting.

Ask a [council](../starter-kit/occasional.md) to examine the plan independently, then clarify the consequential disagreements before revising it.

---

## Proactive rules for long-context sessions

Claude Opus 4.7 supports a 1M-token context window. This changes *what's possible* but not *what's ideal*. A 1M-token session still suffers attention dilution; the older content competes for attention with the current task.

Four proactive rules:

1. **Compact at task boundaries, not at crisis.** The best moment to compact is between gather → analyze → draft → write, not when the session bar is red.
2. **A new task is a new session.** The 1M context is for *longer coherent tasks*, not "everything in one window."
3. **Delegate investigation to subagents.** Any task that will read three or more files gets its own subagent. The reading noise stays in the child context.
4. **Read large files with offset and limit.** Never load a 5000-line main.tex into the main session. Grep to locate the relevant section, then read only that section.

Optional: you can set `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000` in your shell profile to cap each session at a 200k-token effective window. You give up the full 1M benefit for long coherent tasks, but you force earlier compaction on sessions you'd rather keep tighter. Useful as a discipline mechanism if you find yourself letting sessions sprawl. Verify it took effect via `/usage`.

---

## If `/compact` fails

Occasionally `/compact` fails outright — token budget issue, network hiccup, or the summary truncates something important. The recovery sequence:

1. Run `/done`. Even if the session is partially garbled, `/done` writes whatever state it can to a handoff file — minimal tokens, nothing destructive.
2. `/clear` or close the window.
3. Start a new session. The `SessionStart` hook re-injects the handoff that `/done` just wrote.

This recovery path is why I run `/done` before any risky operation. Thirty seconds of insurance, zero cost.

---

## Related

- **[`/recall`](recall.md)** — when you need to retrieve content from a past session rather than manage the current one.
- **[Sub-project routing](sub-project-routing.md)** — how `/done` handoffs get routed to the right folder in multi-task projects.
- **[Dial-back discipline](../hyperlinks/dial-back-discipline.md)** — related craft on keeping your own skill prompts honest.
- **[What's new in April 2026](../changelog.md)**.
