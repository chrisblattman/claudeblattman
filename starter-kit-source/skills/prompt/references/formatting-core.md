# Prompt Formatting Core

*v3.0 — 2026-10-23 — Task-specific requirements and depth; execution is governed by SKILL.md.*

## Build a useful assignment

Include the task and intended result. Add context, constraints, role, examples and output structure when they resolve a real ambiguity. Preserve author-only knowledge and supplied standards. Use plain prose for simple requests; use headings or delimiters to distinguish instructions from long documents, examples and other input. Repeating a critical requirement at the end can help navigation in a long prompt; a bookend is not mandatory.

For document-heavy prompts, clearly label source material and put an explicit question where the receiver can find it. Context ordering depends on the receiving interface; do not treat a dated benchmark or a fixed token threshold as a universal rule. XML is an available delimiter, not a performance guarantee or a required format.

## Task fidelity check

Compare the prepared assignment with the original request before returning or executing it. Preserve uncertainty and the status of supplied facts: a named key is not necessarily unique, a possible requirement is not mandatory, and a suspected effect is not established. Do not silently introduce a new method, interview mode, constraint, deliverable or approval step. Label necessary assumptions and distinguish optional suggestions from user requirements. If a proposed addition could materially change the work, resolve it with the user before dependent action; otherwise leave it out. A clear request may be returned unchanged. More prompt text is not evidence of a better assignment.

## Depth within the requested scope

| Input | Meaning |
|---|---|
| No override / Light | State the task faithfully with its required methods and checks. Add no generic process block. |
| Standard | Make decision-relevant assumptions, evidence standards and a concrete success check explicit where the task needs them. |
| Deep | Also specify relevant competing explanations, failure modes, robustness or counterevidence checks within the requested task. |

Infer the needed scrutiny from the task; honor explicit overrides. The labels set emphasis, not a number of instructions. Light never removes a supplied requirement, evidence standard or caller schema. Deep never authorizes new delegation, expands the research question, imposes invented work ceilings or changes model settings. If the task already states the necessary scrutiny, retain it without redundant additions. Report an effort setting only when actually set or observed.

## Choose checks that can change the answer

- **Research:** preserve the question and boundaries; specify credible sources, dates where relevant, claim-level citations, counterevidence and the distinction between evidence and inference. For causal questions, distinguish identification strength and alternative explanations. Preserve the research caller's output and completion requirements at every depth.
- **Code/data:** name the relevant invariant, test, calculation or reconciliation; distinguish a planned check from one actually run.
- **Writing:** preserve audience, purpose, factual accuracy and voice. The deliverable is clean prose; process notes belong outside it when useful.
- **Decisions:** state criteria and consequential tradeoffs; identify uncertainty that could change the choice.

These are ways to specify substantive requirements, not text to append to every prompt. A visible plan is useful for unresolved direction, consequential forks or an explicit request. No universal plan, assumptions list or verification footer is required. Ask for evidence or a concise explanation of choices, never internal reasoning.

## Destination and delegation

Preserve the chosen tool/provider and its capabilities. Do not substitute a tool based on a static ranking. Original files remain accessible by original path for file-capable agents. Website prompts need supplied context or explicit attachment instructions. Use API roles and output schemas only when supported by that interface; a pasted heading alone has no special authority.

A prompt can ask its eventual recipient to perform authorized research without the formatter doing that research. When another workflow owns the investigation or panel, preserve its instructions and return the prepared brief; that workflow owns launch, provider selection and synthesis. Follow the current agent/council rules rather than adding agents or ceilings because depth is Deep.
