# DR Prompt Schema

The 8-element schema used by `/deep-research` to build research prompts. Each element addresses one failure mode of generic "research X for me" prompts.

## Elements

1. **Task** — imperative, 1–2 sentences. What is being researched and what form the answer should take.
2. **Scope boundaries** — time window, geography, source-type. Cuts off rabbit holes early.
3. **Evidence constraints** — citation depth, primary-source requirement, recency floor.
4. **Output structure** — headings, length caps, schema. Forces the model to commit to a shape before researching.
5. **Success + anti-goals** — what good looks like AND what to avoid. Anti-goals catch generic failure modes (e.g., "do not produce a literature-review-style overview; produce a decision-relevant brief").
6. **Comparative anchoring** *(deep tier only)* — force comparison to a known reference (a similar paper, a competing approach, a prior decision). Models default to standalone description; comparative anchoring forces relative judgment.
7. **Self-verification** *(deep tier only)* — ask the model to audit its own output against a checklist before delivering. Catches hallucinated citations and missing scope coverage.
8. **Tool trigger** — explicit "use DeepSearch / search live sources / cite by URL." Without this, models frequently revert to training-data answers.

## Standard vs deep tier

- **Standard** (`--depth standard`): elements 1–5 + element 8.
- **Deep** (`--depth deep`, default): all 8 elements + a "research current best practices for prompting deep-research tools" preamble.

## Customization

This file is the canonical schema reference. Adjust element wording to match your domain — e.g., for legal research add "binding vs persuasive authority" under element 3; for academic research add "peer-reviewed vs working-paper" under element 3.
