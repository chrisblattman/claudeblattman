---
description: How to structure multi-task projects so Claude Code sessions route handoffs to the right sub-folder. The /start-task pattern, active-subproject.json, and double-anchor project-root detection.
---

# Sub-Project Routing

Most of my research projects have three or four parallel workstreams at once. A single "Gang Mediation" project folder contains: the working paper, a grant revision, an RA pipeline, and occasional trip planning for fieldwork. If I write a handoff from a session about the grant revision and it lands in the same `HANDOFF.md` that my next paper-writing session picks up, the two workstreams clobber each other.

Sub-project routing fixes that. Each workstream gets its own sub-folder with its own handoff. A single piece of state — a JSON file at the project root — tells session-start and session-end hooks which sub-folder is active *right now*.

!!! note "`/start-task` not yet published"
    The `/start-task` skill that drives the routing isn't on the [Skill Library](../hyperlinks/skill-reference.md) yet — sanitization pending. The folder shape, the JSON state file, and the routing rules below are the durable parts; the skill is mostly orchestration over them. Adopt the structure now and either build a thin wrapper or wait for the published version.

---

## The folder shape

A project that uses this pattern looks like:

```
~/Dropbox/research/gang-mediation/
├── CLAUDE.md                     # project instructions (required marker)
├── PROJECT_INDEX.md
├── .claude/
│   └── active-subproject.json    # state file — which sub-task is active?
├── state/                        # project-level state (optional marker)
├── policies/                     # project-level policies (optional)
├── tasks/
│   ├── paper-revision/
│   │   └── HANDOFF.md            # this sub-task's handoff lives here
│   ├── grant-revision/
│   │   └── HANDOFF.md
│   └── ra-pipeline/
│       └── HANDOFF.md
└── trips/
    └── medellin-2026-05/
        └── HANDOFF.md
```

Three folder conventions:

- **`tasks/`** for ongoing workstreams with no end date (a paper in revision, an RA pipeline, a long-running analysis).
- **`trips/`** for time-bounded fieldwork or conference travel. Named `destination-YYYY-MM`.
- **`ea-tasks/`** for executive-assistant workstreams I want routed separately from research.

The specific folder names aren't magic — they're just the ones my `/start-task` skill recognizes. You can pick your own. What matters is that *one* JSON file names the active sub-task, and session hooks read it.

---

## The state file

```json
{
  "task_name": "paper-revision",
  "folder_relative": "tasks/paper-revision",
  "task_type": "task",
  "set_at": "2026-04-17T14:22:00",
  "permanent": false
}
```

That's it. Five fields. The file lives at `<project-root>/.claude/active-subproject.json`. A session-start hook reads it and injects the contents of `tasks/paper-revision/HANDOFF.md` into context. A `/done` skill at session end writes the new handoff to the same folder. Nothing else needs to know this file exists.

The `permanent: true` flag is a small useful detail. Some sub-tasks are year-long workstreams (an RA pipeline, a departmental role). Others are short-lived (a weekend trip). Stale-state detection hassles me to re-confirm an active sub-task after a few days of inactivity — unless it's flagged permanent, in which case it stays put until I explicitly change it.

---

## Setting the active sub-task

In Claude Code, I run:

```text
/start-task task:paper-revision
```

The skill creates `tasks/paper-revision/` if it doesn't exist, writes the state file, and confirms. From then on every new session in that project folder injects the paper-revision handoff, and every `/done` writes back to the same folder.

Other commands:

- `/start-task trip:medellin 2026-05` — creates `trips/medellin-2026-05/`
- `/start-task folder:NROC/leadership-academy` — set any existing folder as active (useful for nested research programs)
- `/start-task resume` — show past sessions + current handoff for the active sub-task
- `/start-task status` — print the current state without changing it
- `/start-task list` — list all sub-tasks in the project
- `/start-task clear` — unset active sub-task; subsequent sessions fall back to a project-level handoff

One pattern I use often: before an RA call, I run `/start-task resume` to pull the last session's decisions back into the current context.

---

## Project-root detection

This is where most implementations break. Claude Code sessions start from the current working directory, which is often a sub-folder. If the session-start hook treats CWD as the project root, it writes handoffs into whatever sub-folder you happened to open — not into the project's canonical `.claude/` location.

The fix is **double-anchor detection**. A directory only qualifies as a project root if it has *both*:

1. A **marker file** — one of `CLAUDE.md`, `.claude/CLAUDE.md`, or `PROJECT_INDEX.md`. These are files I'd put at a project root and nowhere else.
2. A **sub-folder anchor** — one of `state/`, `policies/`, `tasks/`, `trips/`, `ea-tasks/`, or the presence of `PROJECT_INDEX.md` itself.

Walk up from CWD checking six levels. Stop at the first directory that has both anchors. If none do, refuse to run — don't guess.

Without the double anchor, a random `CLAUDE.md` in the home directory or in an unrelated project folder would be treated as a project root and corrupt the state layout. With it, the detection is specific enough to catch real project roots and nothing else.

---

## Handoff routing, end to end

Session starts:

1. Hook fires on session start (`SessionStart` event).
2. Walk up from CWD, find project root via the double-anchor rule.
3. Read `<project-root>/.claude/active-subproject.json`. If missing, fall back to project-level handoff.
4. Read `<project-root>/<folder_relative>/HANDOFF.md`.
5. Inject it as context for the session.

Session ends (`/done`):

1. Same detection as above to find the project root.
2. Read the state file to learn the active sub-task folder.
3. Write the session's handoff + SESSLOG to `<project-root>/<folder_relative>/HANDOFF.md`.
4. Prune old handoff entries (keep the last N).

The sub-project routing is transparent to the skills themselves. `/done` doesn't know about sub-tasks; it just writes to whatever folder the state file names.

---

## When this pattern earns its keep

Three signs your project is ready for sub-project routing:

1. **You're switching contexts inside the same project folder.** You were writing about the grant at 10am and about the paper at 2pm; both are in the same Dropbox folder. If a single handoff serves both, it's going to describe the last thing you did, not the thing you need now.
2. **You have an RA who also works in this folder.** Their sessions shouldn't inject your morning's paper context. Sub-task routing means their active state is separate from yours.
3. **You travel for the project.** Trip planning has its own cadence (flights, hotels, daily agenda) that doesn't belong in the paper-revision handoff. Trips as their own sub-task folder keep the domains from bleeding.

One sign it's *not* ready: a project that does one thing. A paper that's only a paper doesn't need sub-project routing — it needs one handoff.

---

## What not to do

- **Don't make the state file too rich.** Five fields is enough. If you start adding session history, decisions, open questions to the state file, you're rebuilding the handoff inside the state file. The handoff lives in `HANDOFF.md`; the state file points at it.
- **Don't skip the double-anchor check.** A single-file check (just `CLAUDE.md`) will false-positive on your home directory or on unrelated projects. False positives here mean handoffs writing to the wrong place — a silent failure mode you find three days later.
- **Don't hard-code the folder names.** `tasks/`, `trips/`, `ea-tasks/` are conventions, not contracts. Make them configurable if you'll reuse the skill across people or teams.

---

## Related

- **[Session management](session-management.md)** — how `/done` and `SessionStart` hooks fit into the broader session-discipline loop.
- **[Project Management](project-management.md)** — the layer above sub-project routing, covering folder structure, transcripts, and weekly review.
- **[What's new in April 2026](../changelog.md)**.
