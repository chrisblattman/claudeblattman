# Prompt Formatting Core — Shared Reference

*v2.0 — Shared formatting rules, depth calibration, and tool routing for the /prompt family*

---

## Formatting Elements

When formatting a prompt, apply these elements as appropriate (not all are needed for every prompt):

- **Role/persona** — include only when specialized expertise sharpens the output
- **Task** — stated clearly in 1-2 sentences (always include)
- **Context** — relevant background the model needs
- **Constraints** — length, tone, format, what to avoid
- **Output format** — specify structure (bullets, table, sections, etc.)
- **Bookend pattern** — restate the key instruction at the end if the prompt is long
- **Examples** — include only if they would reduce ambiguity (try zero-shot first)

**Scaling rule:** Match formatting complexity to task complexity. A 1-sentence ask doesn't need a 20-line prompt.

---

## Depth Calibration

Before formatting, assess how much depth this task needs. **Default to Light** (format only). Depth injection is additive, not automatic.

### Heuristic

| Level | When to use | User override |
|-------|-------------|---------------|
| **Light** | Default. Quick replies, simple lookups, routine tasks, short emails | `depth:light` |
| **Standard** | Analysis, research, writing, or design where output quality depends on rigor | `depth:standard` |
| **Deep** | High stakes: methodology, identification strategy, grant proposals; or when user explicitly asks for thoroughness | `depth:deep` |

### Escalation signals (upgrade from Light)

- Task involves synthesis, analysis, or original argument → **Standard**
- Task involves research design, causal inference, or policy implications → **Standard** or **Deep**
- Words like "comprehensive," "thorough," "rigorous" in the request → **Standard** or **Deep**
- High-stakes deliverables (pre-analysis plan, grant proposal, methodology section) → **Deep**

---

## Depth-Injection Templates

### Light (default)
No injection. Format the prompt using the elements above. Done.

### Standard — append to formatted prompt:
```
Include at the end:
- Key assumptions (2-3 bullets)
- Brief rationale for major choices
```

### Deep — append to formatted prompt:
```
Before answering:
- Research current best practices for [task domain]
- Compare your approach against established standards in [domain]
- Flag where your approach deviates and why

Include at the end:
- Key assumptions (2-3 bullets)
- Brief rationale for major choices
- What you verified and what remains uncertain
```

---

## Tool-Routing Awareness

After formatting, check whether the task is better suited to another tool. Brief note, not blocking.

| Signal | Suggested tool | Reason |
|--------|---------------|--------|
| Deep multi-source literature review, "find everything about X" | ChatGPT Deep Research | Better web synthesis |
| Citation-heavy factual lookup, sourced answers | Perplexity | Inline citations, live sources |
| Heavy spreadsheet work (formulas, pivots, formatting) | Gemini | Native Sheets integration |
| Video/audio analysis | Gemini | Can process media directly |
| Otherwise | Proceed in Claude Code | Strong at reasoning, editing, local files |

**For `/prompt`**: Add a brief note before executing if another tool would serve better.
**For `/prompt-only`**: Add `**Best run in:** [tool] — [reason]` after the code block.
**For `/prompt-refine`**: Note in the changes list if the refined prompt would benefit from a specific tool.
