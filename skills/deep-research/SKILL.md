---
name: deep-research
description: Run actual ChatGPT and Gemini Deep Research through their signed-in browser interfaces, retrieve complete exports, and synthesize the reports. Use for browser Deep Research, resuming its runs, or importing its completed reports. Ordinary agentic research belongs to research-council.
---

# Deep Research

Launch the actual **ChatGPT Deep Research** and **Gemini Deep Research** products, follow their progress, export the full reports, and save the research with the project. Use supported browser/computer tools to do this for the user; manual prompt copying is a fallback for a concrete access problem.

Read [browser procedures](references/browser-procedures.md) before touching either product and [reports and synthesis](references/reports-and-synthesis.md) before capturing results. All references are relative to this skill folder. No private scripts, separate synthesis skill, or API keys are required.

## Select products

**Default: ChatGPT and Gemini Deep Research.** A named product or explicitly saved preference overrides that default. A current request outranks project preferences, which outrank personal preferences. No first-run settings questionnaire is required. Save future preferences in the user's existing instructions only when asked.

- “Only ChatGPT” or “only Gemini” runs one product. “Both” runs both browser products.
- Check the signed-in browser, visible Deep Research availability and any displayed allowance before starting. Never assume free access, a fixed monthly quota, or that an app subscription guarantees access. Record an unknown balance as unknown; an enabled mode may still be used within the user's request, without promising it is free.
- If a default product is unavailable, say why and run the available one, reporting a single-product result. If the user requires both or a particular product as a prerequisite, honor that dependency rather than silently omitting it.
- Do not switch to ordinary ChatGPT chat, Codex search, Claude agents, Antigravity, Gemini CLI, Grok, Perplexity, or a paid API as substitutes. Those are outside this skill. `/research-council` provides ordinary agentic research separately.
- Invocation authorizes one research job per selected product, including routine plan approval within the stated brief. Do not buy credits, upgrade plans or change account/security settings. Ask only when a needed choice, sign-in, permission or plan change requires the user.

## Prepare and save the request

Use the active project/task's research folder, or create `research/<date>-<topic>-<unique-id>/` there. Ask for the destination only when ambiguous. Do not put the only copy in a temporary directory.

Preserve an existing research brief verbatim unless the user asks to refine it. For an informal question, turn the supplied context into a concise brief: the question/decision, relevant background, scope, comparisons, constraints and desired report. Ask only for consequential missing information. Do not require a separate prompt-review stage or manufacture answers to provider clarifications.

Compare the brief with the original request: preserve the user's objective, supplied fact status, uncertainty, constraints, evidence and intended operation. Distinguish necessary assumptions from user requirements; do not silently add a method, deliverable or approval step.

For full prompt preparation requested by the user or needed to resolve consequential ambiguity, use the installed Prompt skill in preparation/hold mode before freezing the brief. It returns the brief to this workflow, which retains dispatch authority and continues under the existing authorization. Discover Prompt through the host's installed skills; do not assume a neighboring folder. If it is unavailable, use the concise preparation here and disclose any unresolved ambiguity; if the user explicitly requires Prompt itself, report the missing dependency instead of silently substituting. A clear request, including a dictated one, may pass unchanged without a full Prompt pass. Research workers and synthesizers do not restart preparation. Resume, import and synthesis-only requests keep their existing operation and must not become new research launches.

Save the common dispatched text as `PROMPT.md`. Request source-linked evidence, counterevidence and uncertainty. Both products receive the same question; record any provider-specific follow-ups separately. Do not give one product the other's answer. Use only authorized material; a local path in the prompt is not an uploaded file. Verify actual attachments or record their absence. Ask before expanding to unrelated private sources.

Create `RUN.md` before submission. Use the fields and states in [reports and synthesis](references/reports-and-synthesis.md). On every resume, inspect this record and reconnect to existing tasks before opening new ones.

## File chats in Deep Research

Use a **Deep Research** container in each app: a ChatGPT Project and a Gemini Notebook where supported. Find it or create it, then start the research chat there or file the same chat there afterward. Verify membership and save its identity in `RUN.md`. If the account cannot create or use that container, report the filing blocker; do not claim success or substitute a renamed chat. See the browser procedure for the current controls.

## Run the browser products

1. Discover supported browser tools and follow their instructions. Prefer an already signed-in browser. Inspect current controls rather than hardcoded selectors, coordinates or obsolete model names.
2. Select the requested Deep Research mode and verify visible activation. Start from Chat for ChatGPT's browser research route. An ordinary model saying “I'll research” is not product activation.
3. Submit each brief **once** and save the durable conversation/task URL as soon as available. If submission is uncertain, inspect the same conversation; do not resend blindly.
4. Read the proposed plan and answer clarifications from the brief. Proceed with an aligned plan under the existing research request. Correct scope drift; ask the user only for a material choice the brief cannot answer.
5. Start both products without waiting for the first report to finish, so their server-side research can run concurrently. Browser interactions remain sequential if the tool requires it. Do not add ordinary research arms while waiting.
6. Track each product's own status: a plan, running research, completed report, failure or quota block. The outer chat finishing is not enough. Reopen the same task after a display error or interruption. Keep the user informed at meaningful milestones, and don't end with a promise to monitor later unless a supported continuation is actually arranged.
7. Export completed reports using the product's own controls. ChatGPT: prefer Markdown, with native Word/PDF acceptable if Markdown is unavailable. Gemini: use its report export, including Export to Docs and an authorized Docs/Drive export if needed. Preserve originals and all source links. Do not ask the model to reprint the report in chat, stitch “continue” replies, or reconstruct it from screenshots.
8. Verify the saved file belongs to this task and is complete; then record it as captured. A newly downloaded file's timestamp alone is insufficient when several jobs are running. If capture fails, recover/export the **same report**, not another paid research run. For Gemini, after verifying the complete export in the local project folder, move only this run's verified temporary Google Doc exports to Trash and verify each cleanup, following the browser procedures.

A submitted job awaiting input, running, of unknown status, or awaiting export is **unresolved**. Do not silently omit it from synthesis. Preserve state and resume it; if user action is required, identify the exact step and link to the task. The user can explicitly skip a blocked arm. A confirmed terminal failure can be reported as such without pretending the job succeeded.

## Synthesize and return

When all selected jobs are captured, confirmed unavailable/failed, or explicitly skipped, read the full captured reports and check consequential source claims. Use a fresh synthesis worker for two reports; its brief and output outline are in [reports and synthesis](references/reports-and-synthesis.md). The research reports already contain each product's analysis; this final stage reconciles them without launching more research arms.

Weight evidence by relevance, source quality and support, not product brand, report length or equal votes. Shared sources are not independent confirmation. Preserve important disagreement and retrieval limitations. With only one captured report, return it and a short single-product summary; do not claim a two-product synthesis. If fresh synthesis is unavailable, return the captured reports and the blocker honestly.

Deliver the answer, local report/export links, synthesis when produced, and each product's status. Leave useful blocked tasks open. Retain research chats and local report files; verified temporary Gemini Google Docs are the cleanup exception. Reports may feed a subsequent council, but this skill does not start that council unless requested.

## Resume or import

“Resume this research” continues from the named run's `RUN.md`, checking the existing task URLs before any submission. “Import/absorb these reports” copies only the supplied files into the active run without modifying the originals. Record product identity, provenance and capture method; don't label an unknown source as verified Deep Research. Synthesize two or more supplied reports by default unless the user asks for archiving only. Never add unrelated sibling reports automatically.

```text
/deep-research Investigate [question] for this project.
/deep-research Use only ChatGPT to investigate [question].
/deep-research Resume the research we started for [topic].
/deep-research Import these two reports and synthesize them. Don't start new research.
```

Older `/deep-research --tool claude|codex|grok|all-auto` and `--quick` requests belong to `/research-council`; explain the renamed workflow and preserve the requested provider scope. Don't quietly turn them into two browser jobs. Legacy `--tool chatgpt`, `gemini-deep` and `both` mean ChatGPT, Gemini, and both browser products respectively; flag the changed meaning of legacy `both` if an old prompt expected Claude+Codex.
