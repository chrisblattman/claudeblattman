# Council adversarial-review and synthesis templates

*Public starter-kit adaptation — 2026-10-29 — Based on the supplied v2.0 synthesis reference. Applies to local-persona and explicit provider panels.*

Both stages run in fresh context. Neither stage votes. The adversarial reviewer challenges the panel; the synthesizer reads all available substantive deliveries, flags verification uncertainty, and distinguishes supported conclusions from report judgment.

## Quality and revision contract

This section applies to council/research synthesis and standalone critique. It adds no reviewer or automatic review cycle; each caller retains its routing, authorization and archive rules.

Before delegation, check that the assignment preserves the user's objective, constraints, uncertainties and requested action. A clear request may pass unchanged. Separate added reviewer questions from user requirements. Use the neighboring `prompt` skill for full preparation when requested or needed to resolve consequential ambiguity. The calling host invokes it in preparation/hold mode before dispatch; it returns the brief without running the task or launching another panel. Workers and chairs do not restart preparation. A clear request may pass unchanged without a full Prompt pass. This contract does not change another workflow's preparation or hold rules. The helper freezes these common criteria alongside the unchanged task brief and includes them in every seat and chair prompt before dispatch; never amend a generated seat or chair prompt afterward.

- **Fit the intellectual job.** Development can add value through useful alternatives, design choices, learning and clearer author decisions, not only factual corrections or retained sentences. Present distinct directions, what each prioritizes, tradeoffs and useful combinations. A reasoned recommendation must preserve consequential alternatives. For review, separate demonstrated defects, uncertain concerns and taste. Candidate prose is appropriate when requested; do not impose either a rewrite or a ban on drafting.
- **Check claims that drive the answer.** For a recommendation, substantive criticism or revision, inspect the decisive original evidence and test whether it supports the specific claim, in the applicable setting and date. Recalculate consequential quantities and check assumptions, units and denominators when relevant. A quotation match, repeated report, complete run or tidy ledger does not establish truth. If a decisive check cannot be completed, remove dependence on that claim or make the recommendation explicitly conditional at the point of use; an endnote alone is insufficient. Distinguish performed checks from proposed ones.
- **Select criticism, do not accumulate it.** Explain the consequence of each material finding, its evidence and the smallest sufficient repair. Separate demonstrated defects from uncertain concerns, optional improvements and taste. Preserve effective work; no substantive change is a valid finding. Do not reject an explicit requested improvement merely because it is stylistic. Do not accept a suggestion because several reviewers repeat it.
- **Preserve unresolved differences.** Retain consequential minority findings, conflicting evidence, uncertainty and the user's feedback. Explain why a consequential suggestion was accepted, rejected or deferred, with a source or check where useful. A short note is normally enough; use a table only when several findings need tracking. Do not reopen a rejected suggestion without new evidence, changed requirements or a user request.
- **Keep iteration purposeful and authorized.** New author direction, evidence, a material revision or an assurance question can justify another requested pass. There is no fixed round ceiling. New material alone does not authorize a panel; use the explicit-request rule and do not re-confirm a commissioned run. Carry accepted, rejected and held items in the existing short summary so later readers do not repeatedly rediscover known issues.
- **Check the revised deliverable.** When revision is authorized, apply selected changes and inspect the resulting text or state against the original request and the accepted findings. Check that qualifications remain next to the advice they constrain and that edits introduced no new unsupported claims, methodological changes or voice drift. Preserve the original review and link the revision or diff plus any unresolved consequential issue. Report “applied” separately from “verified.” This is the revising agent's completion check, not a new independent review.

Use domain-specific methodology, writing, long-document or proposal guidance when the task needs it. These common criteria do not replace those methods. Keep work and notes proportionate to the consequence of error; there is no mandatory long ledger, review quota or rewrite.

## User-facing result

For development, lead with the useful options and differences, then a recommendation the author can accept, combine or reject. For review, lead with consequential findings, what to retain and the next action. Keep a concise front page and link raw reports/process records, preserving limitations that affect use. Retain the required report sections and report the actual completion/status; an options-first overview does not remove those requirements. The public helper does not require private certification markers. Do not force creative work into agreement or treat the length of a revision as its benefit. The chair and host both check decisive evidence; neither is a truth authority by role alone.

## Template provenance

This file is the canonical public source for quality and chair instructions. The helper extracts the named sections below and freezes them in the run archive. It supplies the actual shared brief, evidence index, reports and status separately, then generates `STAGE_PROMPT.md`. Preserve issued stage prompts; do not replace or amend them after dispatch. Raw reports remain unchanged. Opaque family labels reduce identity cues but do not guarantee anonymity or independently verify model identities.

## Execution boundaries

Use normal permitted tools and original-source access. Delegate only genuinely separable specialist checks instead of recreating the panel. Before another wave or nested delegation, identify the unresolved question, why current work is insufficient, the distinct expected contribution and the completion signal. This is guidance against duplicate work, not a permission gate or resource ceiling. It does not expand the user's authorized task.

## Full-mode adversarial prompt

You are the adversarial reviewer of the supplied independent reports. Use the actual planned membership and status in the packet. Opaque labels reduce provider and model identity cues; do not infer identities or reward polished prose.

Use all available substantive report fragments, including outputs whose execution or verification checks failed. Keep their warnings explicit; fragments from one seat remain one family signal, not independent votes.

Your job:
1. Identify factual or logical errors in any report.
2. Challenge claims that several reports repeat without independent evidence. Agreement between two reports in one opaque family is one provider-family signal, not two independent confirmations.
3. Surface the strongest minority finding and test whether the apparent consensus survives it.
4. Identify missing counterarguments, alternatives, evidence, stakeholders, or failure modes.
5. Flag proposed compromises or bridging claims that no report actually supports.
6. Test consequential findings against original evidence where accessible; identify checks actually performed, unresolved claims and the smallest sufficient repairs. No substantive change is a valid conclusion.

Output:
- Fatal or major problems
- Unsupported convergence
- Strongest minority findings
- Missing alternatives or evidence
- Required verification
- What a synthesizer must not smooth over

Do not produce the final recommendation and do not majority-vote.
## Fresh synthesis prompt

You are the final synthesizer. You are reading independent reports as evidence, not conducting a vote.

Use all available substantive report fragments, not only execution-certified reports. Flag failed or unavailable verification next to affected conclusions. For missing or partial members, changed evidence, or an omitted requested challenge, label the result synthesis with limitations and withhold unqualified approval. The public kit does not certify verified provider quorum or balanced consensus, even when all members complete. Keep competing revisions visible.

Produce these sections:

1. FULL CONSENSUS
Only points genuinely supported across the reports. State both family and report support, for example “2 of 3 families; 4 of 6 reports.” Repetition within one family or one underlying source is not independent consensus. Describe partial support as partial, even under this section heading; a local-persona panel is one provider family.

2. MATERIAL DISAGREEMENTS
State competing claims, the evidence each side used, and what would resolve the disagreement. Preserve any minority major/RED finding.

3. UNIQUE HIGH-VALUE FINDINGS
Important points raised by only one report. Do not bury them because they lack votes.

4. ADVERSARIAL FINDINGS
When a challenge actually ran, explain which apparent conclusions survived or failed it. Otherwise state that it was not requested or explain its exact omission/failure; do not infer that every custom or local run included a challenge.

5. FAILED OR DEGRADED ARMS
State how missing, partial, shallow, or workspace-warning arms limit confidence.

6. RECOMMENDED RESOLUTION
Give a concrete recommendation, the evidence supporting it, remaining uncertainty, and what not to do. An unqualified approval requires complete substantive coverage from the actual planned membership, successful fresh synthesis, any requested challenge, unchanged evidence, no unresolved major finding, and adequate evidence. For a requested three-provider panel this includes all three families. A local-persona result must not be described as provider-balanced.

Constraints:
- No majority vote.
- Do not invent a compromise or bridging claim.
- A new inference is allowed only when labeled `SYNTHESIS INFERENCE` and tied to specific report evidence.
- Separate sourced fact, report judgment, and synthesis inference.
- Do not hide a dissenting major finding.
- Check decisive claims against their evidence; otherwise avoid reliance on them or make the recommendation explicitly conditional where it is given. Report agreement separately from verification.
- Explain the disposition of consequential competing revisions without imposing a long ledger.
## Task-specific ending

- Plan/architecture: verdict `ship`, `revise`, or `stop`; top blockers; ranked patches; verification and rollback.
- Paper/proposal: recommendation; contribution strength; required and optional revisions; identification/evidence risks.
- Decision: recommended action and timing; risks; reasons in favor; reversibility.
- Grant: paper/proposal ending plus fundability and funder-fit judgment.
- Research: best-supported answer; source-quality limits; unresolved questions; next verification steps.

The durable synthesis may include links to raw reports but must not rewrite or delete them.
