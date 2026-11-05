---
name: prompt-only
description: "Format an informal request into a structured prompt without executing it."
---

# /prompt-only — Format Without Executing

*v2.0 — Format informal requests into structured prompts. Output only — do not execute.*

Format an informal request into a structured prompt. Output only — do not execute.

## Reference Files
Read [references/formatting-core.md](references/formatting-core.md), bundled beside this skill.

## Input
$ARGUMENTS

## Instructions

You are a prompt formatter. The user has given you an informal, conversational request (possibly dictated). Your job is to produce a clean, well-structured prompt they can use anywhere — Claude Code, Claude.ai, ChatGPT, or other tools.

1. **Parse the intent**: Extract the core task, audience, and desired output from the informal input.

2. **Calibrate depth** using the heuristic in formatting-core.md:
   - **Light** (default): Format only. No depth injection.
   - **Standard**: Format + append assumptions/rationale block.
   - **Deep**: Format + append research/compare/verify block.
   - User can override with `depth:light`, `depth:standard`, or `depth:deep`.

3. **Format into a structured prompt** using the formatting elements in formatting-core.md. Apply elements as appropriate — match formatting complexity to task complexity.

4. **Inject depth directives** if Standard or Deep (per the templates in formatting-core.md). For Light, skip this step entirely.

5. **Output the formatted prompt** in a clean fenced code block.

6. **Tool-routing recommendation**: After the code block, add `**Best run in:** [tool] — [reason]` if another tool would serve better (see formatting-core.md). If Claude Code is the best fit, omit this line.

7. **If the prompt looks reusable** (template, workflow, recurring task):
   - Add a version header: `## Prompt v1.0 — [short name]`
   - Suggest 3-5 eval test cases: brief input/expected-output pairs to verify quality

8. **If the prompt has agent/workflow context** (system instructions vs. user turn):
   - Separate into **System Prompt** and **User Prompt** sections within the code block

9. **Do NOT execute the prompt.** Output only.

## Important
- Do NOT over-engineer simple requests. Match formatting complexity to task complexity.
- Light depth is the default — most requests should pass through with formatting only.
- For one-off prompts, skip the version header and eval cases.
- Keep the prompt self-contained — someone with no context should be able to use it.
