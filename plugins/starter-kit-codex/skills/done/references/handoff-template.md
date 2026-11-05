# Session log and handoff

## Log entry

Append a dated entry to the configured project log. Obtain the capture key once with `datetime.now().astimezone().isoformat()`; retain it across retries.

```markdown
## [timezone-precise timestamp] — [session topic]
SESSLOG:[same capture key]

### Completed
- [Actual result and validation]

### Decisions and constraints
- [Accepted decision, scope and origin]

### Open questions
- [Unresolved issue or blocker]

### Follow-ups
- [ ] [Concrete next action]

### Artifacts
- [Path and purpose]
```

Omit empty sections. Add rejected approaches/context only when useful for resuming. Infrastructure follow-ups can later be selected by `/tips-integrate`; ordinary project tasks remain project tasks.

## Current handoff

```markdown
# Handoff — [task]
<!-- LIFECYCLE: snapshot-only -->
SESSLOG:[same capture key]

## Next action
- [ ] [Most useful action to resume]

## Status
[Current objective, actual progress and unresolved work]

## Active decisions and constraints
- [Decisions still governing the next session, including unrelated active constraints]

## Key files
- [Path] — [purpose, including report archives]

## Questions and blockers
- [Unresolved question, pending approval or untested work]
```

## Conflict-checked writes

Prepare UTF-8 content in temporary files outside published source. The writer reads content from a file or stdin; do not interpolate draft prose into shell code. Arguments with spaces must be shell-quoted.

```sh
python3 scripts/continuity-write.py hash --path /path/to/SESSION_LOG.md
python3 scripts/continuity-write.py append --path /path/to/SESSION_LOG.md --expected [hash-or-missing] --capture-id [key] --content-file /path/to/log-entry.txt
python3 scripts/continuity-write.py hash --path /path/to/HANDOFF.md
python3 scripts/continuity-write.py replace --path /path/to/HANDOFF.md --expected [hash-or-missing] --capture-id [key] --content-file /path/to/new-snapshot.txt
```

Resolve `scripts/continuity-write.py` relative to this installed **skill**, not the working project. Capture the hash before reading the content you will revise, and retain that hash through preparation. If anything changes before writing, the helper rejects the stale hash. Never obtain a fresh hash for already-prepared content without rereading and reconciling that content. It creates missing parents only for an authorized write. An existing exact capture marker makes an append retry a no-op. Snapshot replacements still require a matching hash, even when they have the same marker.

The helper uses an exclusive sibling lock, writes a temporary file alongside the destination, then atomically replaces it after a second hash check. A lock left by an interrupted process is reported, not silently stolen. Failed log writes stop snapshot updates. Do not claim multi-file atomicity: verify each output separately and report partial success.
