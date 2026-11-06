# Execution and evidence

## Prerequisites and transport discovery

The host needs file access, fresh research workers with search/source access, and native subagents for fresh synthesis of multiple reports. External providers require the installed starter kit's Ask Agents skill and its configured connections. Read that installed skill's `references/host.md` and `references/transport.md`; resolve references from its own directory. This folder does not bundle external launchers. If Ask Agents is absent, use available native research workers and explain how to add connections later.

Follow the same transport and worker pattern as Council and Adversarial Review, without invoking either workflow or importing their panel defaults, personas, settings, or helper state machine. Use fresh native workers with only the shared assignment and authorized evidence, not inherited conversation where the host supports that choice. Queue workers when capacity is full. Preserve a native worker's full returned report verbatim if it cannot save the file itself, and record that the host saved it.

Run the installed Ask Agents transport's documented preflight for each selected external provider before dispatch. Preflight does not prove login or research access; inspect the real invocation too. Mark unavailable providers explicitly and proceed under the selected research panel's rules, without substitutions or permission changes. Check fresh synthesis availability before dispatch and disclose a known limitation. Declare the primary synthesis and its one permitted fresh native fallback in `RUN.md`; this is a fallback for synthesis, not an extra research arm.

Choose one route per provider, not both native and external copies. Native workers should have a clean task context containing the common brief and relevant original evidence. If a native worker lacks search, an existing supported Ask Agents route to that same provider may be used and recorded. If neither can research, mark that provider unavailable. Do not send dummy research jobs just to count providers; an authorized real arm can establish whether the discovered connection works.

Create the parent output directory before calling the Ask Agents launcher; give each invocation a new, not-yet-existing child directory. A missing parent can fail before any provider is contacted. Ask Agents receives each selected provider and the common brief. Its job is dispatch and retrieval, not another council or synthesis. Read its returned result metadata and **the full response file**, not just launcher stdout or a path. Copy reports into the run archive without rewriting them. Preserve failure diagnostics and substantive partial responses separately. An external provider must acknowledge unavailable files; don't claim it received local evidence just because a path appeared in a prompt.

This invocation permits independent workers for the requested research and its fresh synthesis. It does not authorize recursive copies of the whole panel. A worker may investigate a separable specialist question when useful. Honor the user's tool, data and cost restrictions. Do not buy access, switch to paid API authentication, transmit credentials, or gather unrelated private files to make an arm work.

## Interrupted runs and fallbacks

Keep each invocation's output directory and execution reference in `RUN.md`. A lost launcher connection or missing `result.json` does not establish that the provider failed or stopped. Inspect the existing process or session handle, execution metadata, raw streams and any saved response. Wait on a still-running execution; retrieve a completed response from the original invocation. Use a documented resume/retrieval route only when it actually supports that execution identity. Do not invent a resume flag or assume that rerunning the launcher resumes its old job.

If the execution cannot be recovered, record the recovery blocker and whether remote completion remains unknown. Preserve substantive partial output with that limitation. Continue the other arms and, when useful reports are available, deliver qualified synthesis; never label the unresolved arm completed or the panel complete. Additional fragments from the same invocation remain one arm's contribution. Do not rerun for cleaner formatting or missing verification metadata.

A new research submission after failure or unresolved recovery requires the user's authorization unless that retry was already commissioned. Keep the first attempt and use a new invocation directory, recording that this is a second submission rather than recovery. Do not silently switch providers, models or authentication routes.

For synthesis, first inspect and recover the existing attempt in the same way. Once the primary has ended as failed, blocked or partial, use the one predeclared fresh native fallback with the same brief, source reports and limitations. Keep both deliveries and their states; do not feed the primary's conclusions to the fallback as instructions. Do not launch a fallback while the primary is still running or its submission state is unknown. If the fallback also fails, or no fresh worker is available, deliver the reports as unsynthesized. No automatic second panel follows.

## Arm brief

Append this research contract to the common task, keeping the task itself identical for every arm:

> Investigate independently. Search when current or external evidence is needed, open the sources, and prioritize primary evidence. Answer the question, including evidence against your initial view. Cite material claims with direct source links and dates where relevant. Distinguish what you inspected from what you could not access, and evidence from inference. Include a source ledger: claim, source locator, and supporting passage or section. Explain consequential uncertainty. Do not invent citations or imply that an inaccessible source was read. Return a complete report and identify any research-tool failure. Do not edit project evidence.

Source excerpts should be short and comply with applicable quotation limits. Preserve user-specified research depth; no fixed source quota determines whether the work is good.

## Archive

```text
research/<run>/
├── PROMPT.md
├── RUN.md
├── reports/
│   ├── claude.md
│   ├── codex.md
│   └── gemini.md
└── SYNTHESIS.md
```

Only create the report files actually returned. Grok, when requested, has its own file. Store requested/observed provider identity, access limitations, timestamps, completion state and source checks in `RUN.md`; don't prepend metadata to raw reports. Hash original reports if they are converted or reused in a later synthesis. A central index, when the user already has one, holds pointers to project files, not duplicate report content. Update it only after durable outputs exist.

## Evidence checks

Check decision-driving claims against the cited originals where possible. Distinguish a broken link from an unsupported claim and a partial report from a completed one. Check dates, applicability to the question, evidence versus marketing, and whether nominally separate sources repeat one upstream source. Record what was checked and what could not be checked. Do not certify a report just from URL count, model self-description, or a retrieved phrase match.

A source-access gap limits the affected claim; it need not invalidate unrelated findings. A report with no inspectable supporting evidence can supply hypotheses, but cannot carry a verified conclusion or count as independent corroboration.

## Fresh synthesis brief

Give the worker the original question, report paths, recorded limitations and authorized source access. Ask it to create a new `SYNTHESIS.md` with:

1. **Source reports:** links to every supplied report and the original brief; missing/failed arms plainly stated.
2. **Answer:** the best-supported findings relevant to the user's decision.
3. **Evidence and disagreement:** supporting original sources, unique findings, contradictions and shared source lineages.
4. **Uncertainty:** claims that remain unverified, missing inputs and how they affect the conclusion.
5. **Next steps:** what this research supports doing and what still needs checking.

Do not assign equal numeric weights or a fixed ranking to models. A well-supported minority finding can outweigh agreement elsewhere. Preserve raw reports. An explicit request for reports only skips synthesis and should be recorded.
