# Reports, state and synthesis

## Durable run record

Keep this with the actual project or task, reusing its research-folder convention:

```text
research/<run>/
├── PROMPT.md
├── RUN.md
├── reports/
│   ├── chatgpt-original.md
│   └── gemini-original.docx
└── SYNTHESIS.md
```

Formats are examples. Keep each native export unchanged; a Markdown conversion lives beside it and links to the original. Do not add frontmatter to the original. A central research index, if already configured, contains pointers only. Do not publish these private research artifacts with the skill.

`RUN.md` records:

- Run ID, question, destination, exact brief identity and chosen products.
- Per product: route, browser and whether it came from saved settings or a fresh probe; requested/observed model and effort when requested or exposed, start/update/completion times, durable chat/task URL, supplied attachments and unavailable inputs.
- The **Deep Research** container's name, type and URL/identity, plus filing state (`pending`, `verified`, `blocked`). An unavailable folder must not be reported as created. Research completion and successful filing are separate facts.
- Each observed research state and useful recovery history, including whether an export is complete, in progress, failed or unknown. Unresolved export details belong under `capture-incomplete`; no credentials or auth tokens.
- Report location, original hash/size, capture format/method, conversion limitations and source checks.
- For every temporary Gemini Google Doc, including duplicates: exact Doc URL/ID, creation context establishing this run's ownership, associated report/export, verified local capture of its content, and individual cleanup status (`pending`, `trashed`, `retained (host confirmation rule)`, `blocked`, or `not-applicable`). A trashed Doc is provenance, not the delivered report link.
- Synthesis state and any explicitly skipped or failed arm.

Use these research states accurately:

| State | Meaning / next action |
|---|---|
| `planned` | Not submitted; inspect access, mode and folder first. |
| `submitting` | Recorded just before Send. If the run is interrupted here, treat it as `submission-unknown`. |
| `submission-unknown` | Submission may have succeeded; check the Deep Research container on the same route for a chat created after `submitting` before any retry. |
| `awaiting-input` | Clarification, plan or user action pending. |
| `running` | Product's own progress indicates active research. |
| `capture-incomplete` | Report is complete in the product but the full export is not safely saved. |
| `captured` | Verified full native export is saved with provenance. |
| `unavailable` | Not launched because access, quota or product availability prevented it. |
| `failed` | Confirmed terminal product failure; preserve its explanation. |
| `skipped-by-user` | User explicitly removed this arm from the run. |

Unknown, running or pending states are not failures. If a context interruption occurs, save state and resume the same URLs. Don't promise a scheduled continuation unless the host actually supports and has arranged it. Check at reasonable intervals while keeping the user informed; avoid rapid unchanged polling and long blocking waits.

## Source checks

Read every captured report, including its references. For consequential conclusions, inspect the cited originals where accessible and distinguish:

- evidence supporting the claim versus a citation that merely mentions the topic;
- primary findings versus summaries, marketing or repeated copies;
- current/applicable evidence versus stale or mismatched settings;
- factual support versus inference;
- missing source access versus an actual contradiction.

Do not use report length, citation count or product identity as an accuracy score. Record checks and gaps honestly. A complete product report can still contain unsupported claims; preserve it and constrain the affected conclusion rather than silently editing the raw report.

## Synthesis

For two or more captured or supplied reports, use one fresh synthesis worker with the original brief, full reports and `RUN.md`. It may verify decisive sources but must not start another panel. If this capability is absent, return the reports and say fresh synthesis is blocked. With one report, return a single-product summary instead.

Ask the worker to create a separate `SYNTHESIS.md` containing:

1. **Source reports:** links to original exports, derivatives used, brief and their product/capture identity.
2. **Answer:** conclusions relevant to the user's question, with supporting source links.
3. **Agreement and disagreement:** where evidence converges, what conflicts, and unique findings.
4. **Evidence limits:** failed/skipped arms, unresolved claims, shared source lineages and implications for confidence.
5. **Next steps:** what can be used now and what needs further investigation.

No fixed 50/50 weighting and no preference for a brand or longer report. Judge each claim on evidence. Two reports repeating one source are not two independent confirmations. A minority finding with better evidence can change the answer. Do not conceal disagreement by averaging incompatible claims.

When both products were requested, do not silently synthesize one while the other remains running or awaits export. After a confirmed failure or explicit skip, provide the available result with the missing coverage clearly stated. Do not call it a completed two-product synthesis.

## Existing reports

Import only files the user identifies, copying originals into the chosen project archive without changing or deleting the supplied files. Record original location, date, product if known, hash and whether provenance is verified or user-described. Legacy frontmatter is optional; preserve it rather than requiring a particular folder layout. A supplied external report need not be rerun to obtain new metadata.

If the user asks for ordinary agent reports to be synthesized, `/research-council` can do that without launching new research. Neither workflow needs the retired `/dr-synthesize` helper.
