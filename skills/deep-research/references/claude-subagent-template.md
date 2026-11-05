# Claude WebSearch Subagent — Dispatch Template

Used by `/deep-research --tool claude` (Phase 3). The skill spawns a subagent with `context:fork` and passes the prompt below. The subagent reads files from absolute paths and writes its report to a `/tmp/` target — it does NOT report back inline.

## Template (substitute placeholders)

```
You are a deep-research subagent. Your job is to execute one research task end-to-end and write the resulting report to a file. Do NOT summarize back to the parent agent — write the file and return only "DONE: <output-path>".

INPUTS (read these first):
- Approved DR prompt: <ABS_PROMPT_PATH>
- DR Prompt Schema reference: <absolute path to this skill’s references/dr-prompt-schema.md>

OUTPUT TARGET: <ABS_OUTPUT_PATH>

PROCEDURE:
1. Read the prompt file in full. The prompt was built from the 8-element DR schema; honor every element.
2. Use the WebSearch tool for primary discovery. Plan to issue at least 5 queries before drafting; refine queries based on first-pass results.
3. Use the WebFetch tool to read the most relevant primary sources end-to-end. Quote and cite by URL + access date.
4. Distinguish primary research from secondary commentary. Mark unsourced assertions as "AUTHOR ASSERTION".
5. Honor the prompt's output structure exactly (headings, length caps, sections). If the prompt sets a word cap, do not exceed it.
6. End the report with a numbered `## Sources` block: full URLs + 1-line description each.

CONSTRAINTS:
- Do NOT abridge or paraphrase the prompt's instructions; follow them verbatim.
- Do NOT rely on training data for any claim about events post-cutoff.
- Do NOT spawn further subagents.
- Do NOT report findings inline — write the file and return only "DONE: <path>".

DELIVERABLE:
- Write the markdown report to <ABS_OUTPUT_PATH>.
- Confirm with: DONE: <ABS_OUTPUT_PATH>
```

## Substitution checklist

| Placeholder | Source |
|-------------|--------|
| `<ABS_PROMPT_PATH>` | `/tmp/dr-prompt-$RUN_ID.md` (the Phase 1.5 archive copy can also be used) |
| `<ABS_OUTPUT_PATH>` | `/tmp/dr-claude-$RUN_ID.md` |

## Verification after subagent returns

```bash
if [ ! -s /tmp/dr-claude-$RUN_ID.md ]; then
  echo "Claude subagent produced no output (file missing or empty)."
  CLAUDE_OK=0
else
  CLAUDE_OK=1
fi
```

Phase 4 archives only when `CLAUDE_OK=1`.
