# /council — Parallel Critics, Separate Synthesis

**Looking for the revised workflow?** Start with [the new council guide](../starter-kit/occasional.md#review). This reference describes the existing setup; the preview workflow and file contract are being redesigned before the skills are updated.


`/council` is inspired by — but adapted from — Andrej Karpathy's [LLM Council](https://github.com/karpathy/llm-council) idea: ask several models the same question in parallel, then have one separate pass read their answers as data. I borrowed the shape and changed two things. Karpathy's council is cross-model by default; mine is cross-*role* by default, with one optional cross-vendor seat for Codex or Gemini. And I forbid debate. Single round, no rebuttals, no majority vote on narrative output — the 2025 conformity-drift literature convinced me round-two was not worth the cost.

The mechanic: parallel dispatch of up to four critics, each with one lens and explicitly told not to balance. A separate model run, with no memory of the critique conversation, reads the raw outputs as input data and ships a verdict plus a punch list. That separation is what stops the council from collapsing into the kind of hedged consensus you get from a single chat thread. I learned this watching a single fresh-context agent rubber-stamp a grant aim that a real referee tore apart two weeks later.

For the longer lineage — Tree of Thoughts, eval-juries, Debate — see [Lineage and contribution](#lineage-and-contribution) below.

---

## Why bother: never ask just one agent

If you take one habit from this site, take this one. **Whenever you're doing something that
matters, don't just ask the chatbot.** Ask for a council, and then make it criticise its own answer
with your corrections in the loop.

Here is my honest sense of the payoff. **We haven't run the tests, so treat these as impressions
rather than measurements:**

| How you ask | Roughly how happy I am with the answer |
|---|---|
| One question to a chatbot | ~60% — usable, generic, a bit confident |
| An agent working on your actual files | ~80% — grounded in your material, still unchallenged |
| A council, then recursive self-criticism with your feedback | ~95% — the version I'd actually send |

The last row is doing most of the work, and the part people skip is the *recursion*: taking the
critique back to the thing being criticised, more than once, with your own judgment included each
time. One round of criticism is a second opinion. Several rounds is a different process.

A bonus, not a requirement: if you hold more than one subscription, make one seat cross-vendor —
`--peer codex` or `--peer gemini`. Different models are genuinely good at different things, and
a panel that disagrees with itself is worth more than a panel that agrees. One account is still
plenty to start.

---

## What ships today

Four critics, two panels, a hard cap of four. That is the whole thing.

| Critic | Lens |
|---|---|
| `skeptic` | Wishful thinking — which load-bearing claims aren't backed by evidence? |
| `pre-mortem` | Works backward from failure — the top three ways this fails |
| `completeness-checker` | What's missing that a domain expert would expect? |
| `chief-of-staff` | What's the actual decision, and what does saying yes cost you? |

| Panel | Critics | When |
|---|---|---|
| **Plan** | skeptic + pre-mortem + completeness-checker | Architecture decisions, project plans, anything reversible-but-expensive |
| **Decision** | skeptic + pre-mortem + chief-of-staff | Go/no-go calls, hiring, accept/reject |

Pick one with `--type plan` or `--type decision`, or let keyword inference resolve it from the topic
("plan / design / architecture / workflow" → plan; "should I / decide / go or no-go" → decision).
Override the roster with `--panel a,b,c`.

!!! note "Paper and grant panels are not built yet"
    An earlier version of this page advertised paper and grant panels with critics called
    `academic-editor`, `harsh-referee`, `methodologist`, `grant-strategist` and `funder-officer`.
    **Those persona files do not exist**, so those panels cannot run — the skill stops with
    "persona file missing" rather than substituting something worse. If you ask for one, it will
    say so and offer the plan panel as the closest fit.

    They are a real intention, not an abandoned one. Until they ship, a manuscript or proposal gets
    the plan panel, which is a weaker but honest substitute.

## When to reach for it

| Trigger | Panel |
|---|---|
| **Architecture or workflow decision** | Plan — skeptic and pre-mortem disagree about what the real cost is |
| **Hiring call, go/no-go** | Decision — pre-mortem plus chief-of-staff surface failure modes one reviewer rationalizes away |
| **A plan you have already revised twice** | Plan — by the third revision you have stopped seeing it |
| **Grant proposal, manuscript** | Plan panel, knowingly — the specialist critics aren't built |

Council is my default for essentially every task. The [numbered walkthrough](../starter-kit/occasional.md) shows how to start with it, respond to the findings, and revise.

---

## How to run it

```
/council <topic or file:path>
/council file:~/plans/fieldwork-plan.md --type plan
/council "should I take the Bogotá site visit in March" --type decision
/council file:~/plans/plan.md --peer codex
```

Flags: `--panel a,b,c` for a custom roster · `--n 3` for panel size · `--type plan|decision` ·
`--peer codex|gemini` to swap one seat for another vendor.

---

## A council in action

The topic: a plan to run a household survey in three Medellín comunas with a six-week field window.

Panel resolved: `--type plan` → skeptic + pre-mortem + completeness-checker. Dispatched in parallel,
shown verbatim in the synthesis output:

- **Skeptic** — *"Six weeks" is load-bearing and unevidenced. It appears in the budget and the IRB
  timeline but no line traces to a measured enumeration rate. What is it derived from?*
- **Pre-mortem** — *Top failure: comuna access is withdrawn in week two and the plan has no
  substitution rule, so the sample frame silently changes mid-field. Second: enumerator attrition
  with no bench. Third: the pilot and main wave share instruments, so a pilot fix means re-training.*
- **Completeness-checker** — *No refusal-conversion protocol, no plan for partial households, and
  nothing on what happens to a comuna that completes early. A reviewer asks about all three.*

Synthesis (separate model, fresh context): **REVISE.** Top three patches: derive the six-week figure
from the pilot's actual rate or mark it as an assumption; write the comuna-substitution rule before
fieldwork, not during; add a refusal-conversion protocol.

Three critics, one verdict, a punch list. Note that the dissent — the pre-mortem's substitution-rule
point — is the one that would actually have broken the study, and only one critic raised it.

---

## The rules that make it work

These are not stylistic preferences. Each one is load-bearing.

- **Hard cap of four critics.** Beyond four, the synthesis gets noisier, not richer. Ask for more
  and the skill refuses: *"more voices adds noise, not signal."*
- **Single round only.** No iterative debate. Round-two-and-beyond debate among critics drifts
  toward conformity — well-documented in the 2025 conformity-drift papers.
- **No majority vote on narrative.** The synthesis ranks but does not vote. A unanimous panel can
  still be wrong; a 1-of-4 dissent on the right point is worth more than three agreements on the
  wrong frame. The worked example above is exactly that case.
- **Separate synthesis dispatch.** The synthesis runs in a fresh context. It reads the raw critic
  outputs as input data — not as the tail of a conversation it was part of.
- **Persona files exist before dispatch.** No silent fallback to a generic agent. If a panel names a
  persona you don't have, the council aborts and tells you which file is missing. Better to fail
  loudly than to substitute a worse critic without saying so.
- **A peer critic asks first.** Sending your input to Codex or Gemini means sending it to another
  company. The skill checks for confidential or human-subjects material, and asks before it sends.

---

## Writing your own critic

The cap is four, so a fifth persona means **replacing** one, not adding to the panel.

A persona is one markdown file with YAML frontmatter — `name`, `description`, `tools` — and a body
that gives the critic exactly one lens and tells it not to balance. The four that ship are the
reference: read `skeptic.md` for the shortest, `chief-of-staff.md` for the one with the most
judgment in it.

Drop yours next to them in the plugin's `agents/` directory, then call it:

```
/council file:~/plans/plan.md --panel skeptic,pre-mortem,your-critic
```

The single most important line in a persona file is the instruction *not* to be balanced. A critic
told to "give a fair assessment" writes the same hedged paragraph every other critic writes, and the
synthesis has nothing to rank.

---

## When to add a peer critic

A council of four Claudes still shares one model's blind spots. The fix is to swap one seat for
Codex or Gemini — same prompt, different vendor, dispatched in the same parallel call. I have caught
failures this way that no all-Claude panel surfaced, mostly around empirical claims Claude wanted to
believe.

Setup, flags, and the manual paste-loop for tools without CLIs (Grok, ChatGPT Deep Research,
Perplexity) live on the [AI integration](ai-integration.md) page.

---

## Lineage and contribution

Andrej Karpathy gave the pattern its handle in his "LLM councils" note: parallel critics, separate synthesis, no debate. The lineage is older. The structural shape — multiple draws, evaluate the spread — is the same one Yao et al. (Tree of Thoughts, 2023) used inside a single model's reasoning, and the same one Anthropic's eval-jury work uses for benchmarking. OpenAI's "AI Safety via Debate" sits as the deliberate contrast: I do not allow debate, because the 2025 multi-agent literature on conformity drift convinced me single-round was not negotiable.

My contribution is two narrower things. First, a fixed-persona spin-up — the [five-critic tips council](../hyperlinks/continuous-improvement.md), with each persona tuned for one failure mode (catalog conflict, maintenance tax, compounder, first-run, skeptic) and explicitly told not to balance. Second, the cross-vendor swap: one seat goes to Codex or Gemini, dispatched in the same parallel call. Both ship as code, not as theory.

---

## Install and setup

`/council` ships in the starter kit, so if you installed that, you already have it —
[the Occasional checklist](../starter-kit/occasional.md#set-up-once) covers it, and
there is nothing further to do. The four persona files come with the plugin.

To check it is live, run `/council` with no arguments in a session: it should ask what you want
reviewed rather than reporting an unknown command.

Prefer individual files, or want to see what each one does before installing? See the
[skill reference](../hyperlinks/skill-reference.md).

---

## See also

- **[Deep Research](../workflows/deep-research.md)** — the gather-and-synthesize workflow that produces the kind of input most worth running a council on.
- **[Continuous Improvement](../hyperlinks/continuous-improvement.md)** — the worked tips-pipeline specialization where five fixed personas (catalog conflict, maintenance tax, compounder, first-run, skeptic) decide what enters my CLAUDE.md. The general pattern, applied to one specific domain — and it predates the four-critic cap in the shipped skill.
- **[AI integration](ai-integration.md)** — cross-vendor critics (Codex, Gemini) as council members; setup, flags, manual paste-loop for tools without CLIs.
- **[Fresh-chat review](../hyperlinks/plan-review-browser.md)** — a manual route when independent agents are unavailable.
- **[The council workflow](../workflows/first-session-skills.md)** — where `/council` fits in the broader loop.
