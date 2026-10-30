---
description: Search every past Claude Code and Codex session on your machine with full-text search. Fast BM25-ranked lookups over local transcripts.
---

# `/recall` — Search Every Past Session

I kept solving the same problem twice. First because I'd forgotten I'd solved it, second because I couldn't find the session where I did. `/recall` fixed that.

`/recall` is a skill that indexes every past Claude Code and Codex transcript on your machine and lets you search them with full-text queries. The skill is by [arjunkmrm](https://github.com/arjunkmrm) and is MIT-licensed — I didn't build it. I installed it and use it every few days.

!!! warning "Privacy first"
    Your session transcripts contain the full content of past tool outputs — anything you pasted into Claude Code, any file it read, any environment value it echoed. Treat the `/recall` index as sensitive data. Don't share `~/.claude/projects/` or its search index with anyone you wouldn't share the underlying files with.

---

## What it does

`/recall` uses **SQLite FTS5 full-text search with BM25 ranking** over the JSONL transcript files Claude Code and Codex write as they run. It supports keyword search, exact-phrase queries, boolean operators, and prefix matching.

It's **same-machine only**. Sessions from another Mac aren't visible unless you explicitly sync the transcript directories.

---

## Install

The skill ships as a folder that drops into `~/.claude/skills/`. Find the source at [arjunkmrm's GitHub](https://github.com/arjunkmrm) (the repo name has shifted once; check the pinned skills list there). Once installed:

```bash
# First search builds the index (may take a minute for a large transcript history)
python3 ~/.claude/skills/recall/scripts/recall.py "hello"
```

After install, `/recall` is available as a slash command in Claude Code. The skill directory can live anywhere Claude Code looks for skills — `~/.claude/skills/recall` is the path I use.

---

## Query syntax

FTS5 supports four kinds of query:

```bash
# Keyword — matches stemmed variants ("discussing" matches "discuss")
python3 ~/.claude/skills/recall/scripts/recall.py "buffer"

# Exact phrase
python3 ~/.claude/skills/recall/scripts/recall.py '"ACP protocol"'

# Boolean
python3 ~/.claude/skills/recall/scripts/recall.py "rust AND async"
python3 ~/.claude/skills/recall/scripts/recall.py "tauri OR electron"
python3 ~/.claude/skills/recall/scripts/recall.py "auth NOT deprecated"

# Prefix
python3 ~/.claude/skills/recall/scripts/recall.py "buffer*"
```

You can combine them: `"state machine" AND test` matches sessions where both appear.

---

## Common filters

```bash
# Only sessions from a specific project
python3 ~/.claude/skills/recall/scripts/recall.py "regression" --project ~/Dropbox/research/paper-X

# Only recent sessions
python3 ~/.claude/skills/recall/scripts/recall.py "compaction" --days 14

# Only Claude Code (not Codex)
python3 ~/.claude/skills/recall/scripts/recall.py "hook" --source claude

# Only Codex
python3 ~/.claude/skills/recall/scripts/recall.py "hook" --source codex

# Force reindex after you've moved transcripts around
python3 ~/.claude/skills/recall/scripts/recall.py --reindex "anything"
```

---

## Reading a match

Each result returns a `File:` path to the raw JSONL transcript. Two ways to use it:

```bash
# Read the session
python3 ~/.claude/skills/recall/scripts/read_session.py <File-path-from-result>

# Resume the session in Claude Code
cd /path/to/project
claude --resume SESSION_ID
```

The `SESSION_ID` is in the match output; copy and paste.

---

## `/recall` vs `/conversation-search`

Both skills search local JSONL transcripts. Both are same-machine only. The differences are worth knowing:

| Feature | `/recall` | `/conversation-search` |
|---------|-----------|------------------------|
| Indexes | Claude Code + Codex | Claude Code only |
| Query engine | SQLite FTS5, BM25 ranking | Keyword + date filter |
| Advanced queries | Phrase, boolean, prefix | Keyword only |
| Daily digest | — | Yes (`--digest today`) |
| Install | External skill (MIT) | Personal |

The quick rule: use `/conversation-search` for "what did we do last week" style questions that want a summary. Use `/recall` for "find the session where we talked about X" style questions that want a specific match.

!!! note "`/conversation-search` not yet published"
    `/conversation-search` is a thin Claude Code wrapper over the local JSONL transcript files — sanitization pending. `/recall` (the third-party tool above) ships today; the conversation-search side of the comparison is what I run locally and isn't yet in the [Skill Library](../hyperlinks/skill-reference.md).

---

## When it earns its keep

Three patterns where I reach for it:

1. **"I've solved this before."** A weird dependency issue, a regex that took me an hour to get right, a shell incantation I can't remember. `/recall "specific error text"` usually finds the fix.
2. **Cross-project learning.** When I've figured out a pattern in one project and want to apply it elsewhere, I search the pattern across all projects with no `--project` filter.
3. **Recovering from a bad compaction.** When `/compact` summarized away something I needed, the original detail is still in the transcript. `/recall` finds it; I paste it back into the current session.

---

## Limitations, stated honestly

- **Same-machine only.** If you work across a laptop and a desktop, sessions from one aren't visible from the other unless you sync `~/.claude/projects/` explicitly. For cross-machine continuity I use `/done` + `HANDOFF.md` via Dropbox — different pattern, covered elsewhere.
- **Index staleness.** If you've moved transcripts or deleted old ones, use `--reindex` to refresh. The skill is good about this but not perfect.
- **Not a replacement for memory.** The index holds session content; it doesn't remember semantic context. For persistent context across conversations, use Claude Code's memory tool or a `MEMORY.md` file — `/recall` is for retrieval, not memory.

---

## Related

- **[Session management](session-management.md)** — how `/recall` fits into the `/rewind` / `/compact` / `/clear` / `/done` decision matrix.
- **Claude's memory tool** — persistent context across conversations. Complement, not substitute.
- **[What's new in April 2026](../changelog.md)** — the context for why this update shipped.
