# Acceptance checks

Run these when installing or changing the skill. Use a small public question with inspectable sources for live checks. Record host, skill copy, routes, observed providers and actual outputs. An instruction walkthrough is not a live pass.

## Offline scenarios

| Setup / request | Expected decision |
|---|---|
| Clear supplied prompt or clear dictated request | Preserve intent and uncertainty; no compulsory Prompt pass or added clarification exchange. |
| Full preparation requested or consequential ambiguity, Prompt installed | Host calls Prompt in preparation/hold mode; the research workflow alone dispatches after receiving the brief. |
| Prompt absent | Use inline preparation without claiming Prompt ran; report a blocker if the user explicitly requires that skill. |
| “I imagine most connections are local, but I’m not sure” | Keep this as an uncertain assumption, not an established fact or required research conclusion. |
| Resume/import/synthesis-only request during preparation | Preserve the requested operation; no new research jobs or nested council. |
| Claude, Codex and Gemini available | One fresh arm of each, concurrent where supported; one fresh synthesis. |
| Only Claude available | One arm, single-provider report and summary; no extra Claude workers. |
| Codex and Gemini available, Grok also installed | Codex and Gemini only; Grok absent. |
| “Only Grok” | One Grok arm through Ask Agents; no default providers added. |
| “Include Grok” | Available default set plus one Grok arm. |
| Saved Claude+Codex preference, “only Gemini” this time | Gemini only. Saved default unchanged. |
| Gemini fails after dispatch | Retain diagnostics/partial report; label missing coverage; never silently use Gemini CLI. |
| One completed report plus an unresolved job | Recover/wait for that job; do not declare the panel complete. |
| Launcher interrupted, result metadata missing | Inspect the original execution and raw output; no automatic duplicate submission. |
| Provider cannot be reconnected; partial text exists | Preserve it, record the recovery blocker and unknown completion, and qualify any synthesis. |
| Native worker returns a report without saving it | Save the full returned text verbatim and record host transcription. |
| Primary synthesis ends in failure | Use the one predeclared fresh native fallback; keep both attempt records. |
| Synthesis is still running or its submission is unresolved | Recover/wait or report the blocker; do not start a concurrent fallback. |
| Primary and fallback synthesis both fail | Deliver the available reports as unsynthesized; no automatic new panel. |
| No worker can access research sources | Report the capability gap; no invented sourced answer. |
| Two reports repeat the same study | Synthesis treats that as one evidence lineage. |
| Named existing reports, “no new research” | Synthesize just those reports; no provider launches. |

## Live acceptance still required

1. Copy the whole skill into a temporary skill-install location for the target host; check metadata, reference access and which version is loaded. Avoid overriding a personal installed copy.
2. With one actual provider, verify its worker can search and open evidence and that the single-provider result is labeled correctly.
3. With two or more providers, verify distinct fresh invocations, the same brief, full automatic report retrieval and a separate synthesis worker. Check original source claims and archive links.
4. Simulate a missing connection without exposing credentials. Confirm the missing provider is reported and no extra provider appears.
5. Resume from saved run state; verify completed arms are not launched again.
6. Upgrade the skill in the temporary location and verify user preferences outside the package survive. Record unsupported hosts/routes honestly.

No live research run is implied by the public adaptation's offline validation. Use the current installed Ask Agents version's own transport checks for its dependencies.
