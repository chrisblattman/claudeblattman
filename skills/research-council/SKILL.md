---
name: research-council
description: Research a question using the available Claude, Codex and Gemini agents independently, then synthesize their evidence. Use for a research council or ordinary multi-agent research; Grok is on request. This does not launch the ChatGPT or Gemini Deep Research browser products.
---

# Research Council

Gather research inputs for a decision or a later working council. Run one fresh research arm per available AI, give each the same question, retrieve their reports, and combine the evidence. One available AI means one arm, not several copies of that AI.

Read [execution and evidence](references/execution.md) before dispatch. This is a portable public adaptation, not a copy of a private panel resolver. It does not claim that private resolver's certification.

## Choose the arms

Use this order: the user's selection for this run, an explicitly saved research-council preference, then the built-in default. Existing project instructions take precedence over personal defaults. Do not infer preferences from an unrelated council skill.

**Default: one arm from each available Claude, Codex and Gemini provider.** Discover the host's native research workers and installed starter-kit Ask Agents connections. A desktop app's presence alone is not a working connection. Gemini's external route is Antigravity through Ask Agents. Do not silently substitute Gemini CLI or a browser product. Use the installed transport's documented model defaults; honor explicit model choices and distinguish requested from observed identity.

- No setup questionnaire is required. Announce the planned providers and proceed with those available. Record missing connections and failures.
- **One available AI: run one arm.** Return its research report and a brief summary labeled single-provider research. Do not invent agreement, add duplicate workers, or require another subscription.
- **Grok is on request only**, even if installed or mentioned in an old saved default. If the user says “include Grok,” add one arm; “only Grok” selects just Grok. Use the installed Ask Agents route and check that it can reach the requested sources. Access to X search must be demonstrated, not inferred from the provider name.
- An explicit list selects exactly that list. If a named provider is unavailable, report it rather than silently replacing it. Carry on with available selected providers unless the user made the missing one a prerequisite.
- A request to change future defaults should be saved in the user's existing personal/project instructions, not by editing a distributed skill. Explain the saved choice once.
- No available research-capable worker means a blocker. Do not relabel an answer from memory as completed research.

Invoking this skill authorizes its default panel and fresh synthesis. A generic “research this” request without this skill or a council request does not authorize an extra panel. For the branded browser products, use `/deep-research` instead. Never invoke that skill as an automatic extra arm.

## Prepare the common brief

Use the current project or task folder. Ask for a destination only if it is unclear. Reuse its research convention; otherwise create `research/<date>-<topic>-<unique-id>/`. Keep outputs private unless publication is requested.

Preserve an existing supplied research prompt verbatim unless the user asks to refine it. For a rough request, make a concise brief from the stated question, decision, context, comparisons, constraints and desired output. Ask only about information that materially changes the research. Do not require a separate prompt-review stage or broaden the assignment.

Compare the brief with the original request: preserve the user's objective, supplied fact status, uncertainty, constraints, evidence and intended operation. Distinguish necessary assumptions from user requirements; do not silently add a method, deliverable or approval step.

For full prompt preparation requested by the user or needed to resolve consequential ambiguity, use the installed Prompt skill in preparation/hold mode before freezing the brief. It returns the brief to this workflow, which retains dispatch authority and continues under the existing authorization. Discover Prompt through the host's installed skills; do not assume a neighboring folder. If it is unavailable, use the concise preparation here and disclose any unresolved ambiguity; if the user explicitly requires Prompt itself, report the missing dependency instead of silently substituting. A clear request, including a dictated one, may pass unchanged without a full Prompt pass. Research workers and synthesizers do not restart preparation. Resume, import and synthesis-only requests keep their existing operation and must not become new research launches.

Archive the dispatched brief as `PROMPT.md`.

Give each arm the same neutral brief and authorized evidence. Ask each to search current sources when relevant, inspect primary evidence, seek counterevidence, attach citations to claims, distinguish inference from evidence, and describe gaps. Providers should be generalists investigating the whole question; use specialist assignments only when requested. Do not prime one arm with another's conclusions.

Record the selection and each arm's state in `RUN.md`: provider, route, requested/observed model, input access, start/end time, output paths and any error. A resumed run reuses its existing reports and job identities rather than starting the panel again.

## Research and retrieve

Dispatch independent arms concurrently when their tools allow. Use a fresh native worker for the host AI and installed Ask Agents for external providers. Follow [execution and evidence](references/execution.md); do not invent launcher commands or private helper paths. Keep the orchestrator separate from the research arms.

Allow each worker to use its available research tools and authorized original sources. Write research artifacts in the run folder; this research request does not authorize changing project evidence or implementing recommendations. Do not impose arbitrary source counts or time ceilings. Respect user limits and host constraints.

Retrieve the full report from every arm, along with available execution evidence. A successful launcher exit or a few URLs is not proof of useful research. Check whether the report answers the question and its decisive citations support its claims. Retain partial or weak reports with explicit limitations; do not discard substantive output just because one check failed.

Wait for all launched arms to finish or reach a documented failure or recovery blocker. Inspect the original execution and saved output before attempting recovery; resume the same job only through a supported route. If recovery is unavailable, preserve partial results and report the unresolved state. A missing result file is not permission to submit a duplicate request. Follow the recovery procedure in the reference and continue independent work that remains possible.

## Synthesize and deliver

With two or more usable reports, give a **fresh synthesis worker** the original brief, full reports and their limitations. It must read the evidence, preserve disagreements and identify the best-supported answer. As in Council and Adversarial Review, allow one predeclared fresh native synthesis fallback if the primary attempt fails; follow the reference for recovery and recording. Do not run another adversarial panel. If fresh synthesis cannot complete, return the reports with that limitation; do not present the orchestrator's view as independent synthesis.

Weight claims by source quality, relevance and support, not equally by provider and not by votes. Several arms citing the same study are one evidence lineage. An upstream report supplied to every arm is shared input, not independent corroboration. Follow the synthesis outline in the reference.

With one usable report, return it as single-provider research. With partial coverage, state what was planned, what returned, and how the missing evidence limits the answer. Never claim a multi-AI consensus from one result.

Return a short answer, material uncertainties, links to individual reports and `SYNTHESIS.md` when produced, plus a useful next step. Research can feed a later `/council`; do not launch that downstream task unless requested.

## Saved reports and examples

“Synthesize these reports without running new research” uses the same synthesis procedure on the named files. Preserve originals, record provenance, and don't search for unrelated reports across the user's folders. A supplied report's product/provider identity is unverified unless established by its export or run record.

```text
/research-council Research the options for this project and save the findings here.
/research-council Use only Claude and Codex to research this question: [question]
/research-council Include Grok to investigate recent X discussions about [topic].
/research-council Synthesize these saved reports without launching new research: [reports]
```
