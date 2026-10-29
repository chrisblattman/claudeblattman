---
name: done
description: Preserve the current state in HANDOFF.md so the next session can resume without losing unrelated unfinished work.
---

# Save the handoff

Read the existing `HANDOFF.md` and relevant project instructions before changing it. Update it as a concise snapshot with Status, Next steps, Key files, and Decisions. Put the next actionable step first. Include the current deliverable, relevant panel archive, accepted decisions, active constraints, blockers and untested work. Preserve unrelated unfinished tasks and other sessions' active constraints. Never infer completion from silence.

Aim for about 30 lines, but do not discard necessary continuity to meet a line cap. Replace obsolete details; do not append a transcript. Preserve a prior snapshot when the project requires it. Write the replacement atomically after checking that the file has not changed since you read it; if it changed, reconcile rather than overwriting concurrent work.

If `SESSION_LOG.md` already exists and project instructions authorize logging, append a short dated entry; otherwise do not create or modify a log. Show the handoff path and how to resume. This skill does not publish, commit, change global instructions, or contact others.
