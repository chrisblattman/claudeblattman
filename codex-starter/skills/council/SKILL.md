---
name: council
description: Develop or review a plan, draft, workflow, decision, or argument using independent council members and a fresh synthesis. Use for an explicit council request, including dictated counsel. Discussing councils alone is not an invocation.
---

# Council

Read `references/host.md`, `references/policy.json`, and `references/synthesis.md` next to this skill. These files and this workflow are generated from one source for both apps. Do not invoke a separate prompt formatter or the Ask Agents conversational workflow.

## Select the run

The starter default, explicitly chosen for beginners, is **three local members**: skeptic, pre-mortem, and completeness checker. Read their complete definitions in `references/personas/`. Label this a **local custom council**, not Chris's provider-balanced Light mode. Use three fresh workers in the current app; the orchestrating conversation is not a council member.

Honor an explicit provider/count/lens request; never reinterpret it as the default. The archive helper supports the three default local members, plus **Chief of Staff as an optional fourth member only when explicitly requested**. Never add or substitute Chief of Staff automatically, even for decisions. Pass `--chief-of-staff` to `plan` when the user asks to include it. If the requested custom panel differs, explain that limitation and offer a supported run only with the user's agreement; do not silently add services, change counts, or call it balanced. Clarify only material ambiguity. Do not require an existing draft: members can independently develop an answer or propose an approach against the same brief.

Chris's explicit **Light** means one Claude, one Codex, and one Gemini member, followed by fresh synthesis. **Full** means two per provider, then a fresh adversary, then fresh synthesis. Different providers can run concurrently; two Full members from one provider run sequentially. These counts, lenses, and chair rules are preserved in `references/policy.json`.

**Current runtime boundary:** this starter ships the local native-worker route. Chris's audited balanced runtime (including Gemini through Antigravity, model-pinned execution, and bound chair receipts) has not been ported into this starter kit. If Light/Full is requested, explain this specific missing dependency before launching anything. Offer the supported local council or an explicitly labeled custom outside opinion only if the user chooses it. Do not feed a starter manifest into Chris's incompatible resolver/runner, use Gemini CLI as its replacement, or claim that installing Ask Agents enables audited Light/Full. See `references/runtime-status.md`.

## Prepare a neutral brief and durable archive

Preserve the user's question verbatim; add a neutral evidence index, governing constraints, requested output, and stated success criteria. Do not insert the host's preferred answer, invent requirements, or rewrite an ambiguous objective into a different task. Ask about a missing fact only when it materially changes the work. Stable source files remain at original paths; do not recursively copy source folders. Declare intentionally mutable files or directory pointers as live evidence.

Write the brief to a temporary file, then use the bundled helper (Python 3):

```text
python3 <skill-directory>/scripts/council.py plan --host <claude|codex> --mode local --brief-file <brief.md> --output <project>/council/YYYY-MM-DD_topic --evidence <stable-file>
```

Repeat `--evidence` as needed; use `--live-evidence` for intentionally mutable sources or directory pointers. The output directory must be new; use a fresh suffix for another run on the same date. The helper freezes `PROMPT.md`, `MANIFEST.json`, `MANIFEST.md`, exact `seat-prompts/`, and the evidence identities. It creates private `raw/` and `reports/` directories. Keep these project records out of public releases.

## Independent work

Dispatch each generated seat prompt unchanged through the host's native subagent mechanism in `references/host.md`. Give each worker the shared task and evidence, complete assigned lens, and its unique report path. Do not give members earlier answers or other members' reports. Each worker can choose its research depth and useful specialist checks; discourage recreating the entire panel. Do not add arbitrary turn, time, spending, token, or output ceilings. Honor the host's actual permissions and user restrictions; never weaken them to mimic Chris's machine.

Members analyze and report; they do not revise source artifacts or shared control files. Wait for actual completion. Save each full answer exactly as returned, including partial substantive content and separate additional deliveries. Preserve execution identifiers and observable model facts without inventing telemetry. Record each terminal outcome:

```text
python3 <skill-directory>/scripts/council.py record --run <archive> --seat skeptic --state succeeded --report-file <exact-report.md> --execution-id <actual-worker-id>
```

Use the other seat IDs printed by `plan`; `failed`, `blocked`, and `partial` are also supported. Include `--note` for execution/access caveats and repeat `--addendum-file` for separate additional deliveries. The helper copies the full report without overwriting an earlier delivery and checks stable evidence for changes. A partial report or failed execution remains available to synthesis, not a successful vote. Do not rerun merely to obtain cleaner formatting. An unavailable native subagent facility is a blocker; never impersonate three members in the host conversation.

## Challenge and fresh synthesis

For the default local run, go directly to synthesis. An explicit request for a dedicated challenge may add a fresh adversary after the independent reports, before synthesis; it remains a custom run. Request it with `plan --adversarial`. This follows the audited ordering and does not make a local panel Full. Do not launch an adversary when independent reports are incomplete or their evidence changed; disclose the omission and synthesize available reports with limitations.

```text
python3 <skill-directory>/scripts/council.py packet --run <archive> --stage adversary
python3 <skill-directory>/scripts/council.py record --run <archive> --stage adversary --state succeeded --report-file <exact-report.md> --execution-id <actual-worker-id>
python3 <skill-directory>/scripts/council.py packet --run <archive> --stage synthesis
```

Use each exact frozen `STAGE_PROMPT.md` with a new worker. Packets use anonymous report labels, preserve distinct deliveries as one member's contribution, and include source/verification caveats. Never edit raw reports to force agreement. The adversary checks shared assumptions, source errors, missing alternatives, minority major findings, and unsupported compromises; it does not vote or synthesize. Record an adversarial failure once; do not keep retrying it.

The synthesizer compares reasons and evidence, distinguishes agreement from truth, preserves major minority findings, and labels its own inferences. It produces the requested useful result or recommendation with unresolved questions and decisions for the user. Follow `references/synthesis.md`. The host does not perform this stage inline. Record synthesis through the same helper, which writes `SYNTHESIS.md`. A failed primary permits the one predeclared fresh fallback in the manifest; record both attempts. If both fail, return clearly labeled unsynthesized reports without a council verdict. Do not silently turn a failed external provider into the host's answer.

```text
python3 <skill-directory>/scripts/council.py status --run <archive>
```

Show the actual completed/failed members, source limitations, challenge status, synthesis result, and durable synthesis link. The portable helper verifies file integrity, not independently observed provider identity or every source read. Never describe it as Chris's certified balanced execution.

## Revision and another run

Let the user accept, reject, or question findings. Revise the actual artifact only when authorized, preserving the prior version. A requested further review starts a **new archive and fresh members** with the revised artifact, original purpose, evidence, and updated user decisions. Independent members do not inherit earlier debate; after their reports, the synthesis may check whether earlier material objections were resolved. Do not start an automatic multi-round debate or keep looping until agreement. Saving recurring preferences requires the user's direction; it is not an automatic consequence of review. `/done` saves the handoff when requested.
