---
name: prompt
description: "Format an informal request into a structured prompt, then execute it. Legacy alternative to the starter-kit prompt skill."
---

# /prompt — Format and Execute

*v2.1 — Opus 4.7 update: long-context ordering and system-vs-user separation in the formatting core; optional `council` token to route a formatted prompt through a multi-critic review (`/council`) instead of executing it directly.*

Format an informal request into a structured prompt, then execute it.

## Reference Files
Read [references/formatting-core.md](references/formatting-core.md), bundled beside this skill.

## Input
$ARGUMENTS

## Instructions

You are a prompt formatter. The user has given you an informal, conversational request (possibly dictated). Your job:

1. **Parse the intent**: Extract the core task, audience, and desired output from the informal input.

2. **Calibrate depth** using the heuristic in formatting-core.md:
   - **Light** (default): Format only. No depth injection.
   - **Standard**: Format + append assumptions/rationale block.
   - **Deep**: Format + append research/compare/verify block.
   - User can override with `depth:light`, `depth:standard`, or `depth:deep`.

3. **Format into a structured prompt** using the formatting elements in formatting-core.md. Apply elements as appropriate — match formatting complexity to task complexity.

4. **Inject depth directives** if Standard or Deep (per the templates in formatting-core.md). For Light, skip this step entirely.

5. **Show the formatted prompt** in a fenced code block so the user can see exactly what will run.

6. **Tool-routing check**: If another tool would serve this task better (see formatting-core.md), add a brief note before executing. Don't block — just flag it.

7. **Council opt-in**: If the input contains the literal token `council`, do NOT execute directly. Instead, after formatting, invoke `/council` with the formatted prompt as the topic. The `council` token is opt-in only — `/prompt` does NOT default-wrap in council. This prevents accidental council dispatches from casual `/prompt` uses.

8. **Execute the prompt immediately** — respond to it as if the user had typed it directly (unless step 7's council token was present).

9. **Ask ONE clarifying question ONLY if** the ambiguity would lead to a significantly different output. Otherwise, make reasonable assumptions and proceed.

## Important
- Do NOT over-engineer simple requests. A 1-sentence ask doesn't need a 20-line prompt.
- Match complexity of formatting to complexity of task.
- Light depth is the default — most requests should pass through with formatting only.
- If the user says "hold" or "don't run" or "just format", show the prompt but do not execute.
- `council` token handling: opt-in only. `/prompt X depth:deep council` → format, then dispatch via `/council`. `/prompt X` → format + execute directly (no council).
- Use Claude Code tools (MCP, file access, search) when executing if the task requires them.
