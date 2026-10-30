---
description: How Full councils add six independent perspectives and an adversarial challenge before synthesis, with examples from my own work.
---

# Scrutinize important work

[1. Council basics](../starter-kit/occasional.md) · [2. Multiple agents](council-models.md) · [3. Recursive review](recursive-review.md) · **4. Adversarial review**
{ .council-series }

Look for important or consequential work where a deliberate challenge could catch a problem before you act. Several agents can agree because they have accepted the same bad assumption. A convincing draft can contain a claim that none of them checked. Adversarial review forces the agents to think ahead about what could undermine the work and what the evidence actually supports.

You can use it in either council stage: when the first council develops an answer, or when another council reviews the combined output. The council members can receive an adversarial assignment themselves. My **Full council** also adds a separate reviewer who examines their completed reports before synthesis.

## What I have used it for

When developing the account of [how I use AI](../how-i-use-ai.md), I asked for an adversarial council to review the draft against my feedback and source material. The dedicated adversary caught problems in the reviewers’ suggestions as well as in the draft.

I also asked a separate council to examine options for this website’s relaunch. Earlier advice had not been useful enough, so I explicitly asked it to challenge that approach: what pages and tutorials would help, what examples to develop, and where the material should go. I wanted concrete options, with the choices still open.

Both were Full councils with six substantive reports, an adversarial review, and a synthesis. They were useful inputs to revision, not approval to publish. These are two documented uses; they illustrate why I might spend more effort on a review when the framing, evidence, or direction of the work matters.

## What the extra reviewer caught

In that essay review, two council reports described me having AI review **40 papers in 20 minutes** before a team meeting. It sounded like a vivid example to include. But the source conversation described an imagined situation, not something I was reporting had happened.

The adversary went back to the transcript and pointed out the conditional language: “I might” and “Imagine.” The synthesis then explicitly rejected the invented event and performance claim. The revised essay kept the useful point about research preparation without turning the hypothetical into personal testimony.

That is a concrete benefit of the extra stage: an error repeated in two reports was challenged before it reached the revision. The adversary could inspect the reviewers’ proposed additions together and test them against the source.

## Ask for a Full council

In my setup, **Full** means two Claude members, two Codex members, and two Gemini members, plus a separate adversarial reviewer. The six members work independently. The adversarial reviewer is a fresh agent, separate from the main agent coordinating the work. It reads their completed reports alongside the original task and evidence. A fresh synthesis worker considers all of it. That is six council members, plus the adversary and synthesizer.

The adversary looks for shared assumptions, unsupported claims, neglected alternatives, and important findings raised by only one member. Without that extra check, a useful minority finding can get lost in favor of the majority view. The adversary tests it against the evidence so it gets considered on its merits. It can challenge a criticism as well as the original work. It should be able to conclude that something is sound; the goal is a useful finding, not a quota of objections.

Here are short requests modeled on those two recorded tasks. They are examples you can adapt, not verbatim quotations:

```text
/council full Review this draft of how I use AI against my feedback and the source notes. Where does it misrepresent my approach or rely on unsupported examples?
```

```text
Use another full council to challenge the website recommendations we just produced. The earlier approach was too vague. Give us concrete options for pages, tutorials, and worked examples to discuss, without forcing a single recommendation.
```

## What the extra stage changes

The six members finish their reports before the separate adversarial agent sees them. The adversary’s report then goes to synthesis alongside all six original reports. The synthesis weighs the objections against the evidence and explains what should change and what remains unresolved. You read that result, add your judgment, and have the work revised.

<div class="council-horizontal" tabindex="0" role="region" aria-label="The Full council workflow; scroll horizontally to follow the sequence">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1430 465" role="img" aria-labelledby="full-flow-title full-flow-desc">
<title id="full-flow-title">The Full council workflow</title>
<desc id="full-flow-desc">Your request goes to a Full council with two Claude, two Codex, and two Gemini members. Six independent reports feed a separate fresh adversarial reviewer, followed by fresh synthesis, your judgment and revision. Sources remain available at every stage.</desc>
<defs><marker id="full-flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" class="council-arrowhead"/></marker></defs>
<rect x="10" y="190" width="115" height="55" class="council-node"/>
<text x="67.5" y="222.5" text-anchor="middle" class="">Your request</text>
<path d="M125 217.5 H165" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<rect x="165" y="190" width="130" height="55" class="council-node"/>
<text x="230.0" y="212.5" text-anchor="middle" class="">Full council</text>
<text x="230.0" y="233.5" text-anchor="middle" class="council-note">PROMPT.md</text>
<rect x="340" y="20" width="135" height="45" class="council-node"/>
<text x="407.5" y="47.5" text-anchor="middle" class="">Claude 1</text>
<rect x="515" y="20" width="175" height="45" class="council-node"/>
<text x="602.5" y="37.5" text-anchor="middle" class="">Report</text>
<text x="602.5" y="58.5" text-anchor="middle" class="council-note">raw/claude-1.md</text>
<path d="M295 217.5 H315 V42.5 H340" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M475 42.5 H515" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M690 42.5 H715 V217.5 H745" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<rect x="340" y="85" width="135" height="45" class="council-node"/>
<text x="407.5" y="112.5" text-anchor="middle" class="">Claude 2</text>
<rect x="515" y="85" width="175" height="45" class="council-node"/>
<text x="602.5" y="102.5" text-anchor="middle" class="">Report</text>
<text x="602.5" y="123.5" text-anchor="middle" class="council-note">raw/claude-2.md</text>
<path d="M295 217.5 H315 V107.5 H340" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M475 107.5 H515" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M690 107.5 H715 V217.5 H745" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<rect x="340" y="150" width="135" height="45" class="council-node"/>
<text x="407.5" y="177.5" text-anchor="middle" class="">Codex 1</text>
<rect x="515" y="150" width="175" height="45" class="council-node"/>
<text x="602.5" y="167.5" text-anchor="middle" class="">Report</text>
<text x="602.5" y="188.5" text-anchor="middle" class="council-note">raw/codex-1.md</text>
<path d="M295 217.5 H315 V172.5 H340" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M475 172.5 H515" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M690 172.5 H715 V217.5 H745" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<rect x="340" y="215" width="135" height="45" class="council-node"/>
<text x="407.5" y="242.5" text-anchor="middle" class="">Codex 2</text>
<rect x="515" y="215" width="175" height="45" class="council-node"/>
<text x="602.5" y="232.5" text-anchor="middle" class="">Report</text>
<text x="602.5" y="253.5" text-anchor="middle" class="council-note">raw/codex-2.md</text>
<path d="M295 217.5 H315 V237.5 H340" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M475 237.5 H515" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M690 237.5 H715 V217.5 H745" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<rect x="340" y="280" width="135" height="45" class="council-node"/>
<text x="407.5" y="307.5" text-anchor="middle" class="">Gemini 1</text>
<rect x="515" y="280" width="175" height="45" class="council-node"/>
<text x="602.5" y="297.5" text-anchor="middle" class="">Report</text>
<text x="602.5" y="318.5" text-anchor="middle" class="council-note">raw/gemini-1.md</text>
<path d="M295 217.5 H315 V302.5 H340" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M475 302.5 H515" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M690 302.5 H715 V217.5 H745" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<rect x="340" y="345" width="135" height="45" class="council-node"/>
<text x="407.5" y="372.5" text-anchor="middle" class="">Gemini 2</text>
<rect x="515" y="345" width="175" height="45" class="council-node"/>
<text x="602.5" y="362.5" text-anchor="middle" class="">Report</text>
<text x="602.5" y="383.5" text-anchor="middle" class="council-note">raw/gemini-2.md</text>
<path d="M295 217.5 H315 V367.5 H340" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M475 367.5 H515" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<path d="M690 367.5 H715 V217.5 H745" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<rect x="745" y="185" width="195" height="65" class="council-node"/>
<text x="842.5" y="212.5" text-anchor="middle" class="">Fresh adversarial agent</text>
<text x="842.5" y="233.5" text-anchor="middle" class="council-note">Reviews all six reports</text>
<path d="M940 217.5 H980" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<rect x="980" y="185" width="150" height="65" class="council-node"/>
<text x="1055.0" y="212.5" text-anchor="middle" class="">Fresh synthesis</text>
<text x="1055.0" y="233.5" text-anchor="middle" class="council-note">SYNTHESIS.md</text>
<path d="M1130 217.5 H1170" class="council-edge" marker-end="url(#full-flow-arrow)"/>
<rect x="1170" y="185" width="170" height="65" class="council-node"/>
<text x="1255.0" y="212.5" text-anchor="middle" class="">Revise your work</text>
<text x="1255.0" y="233.5" text-anchor="middle" class="council-note">Add your judgment</text>
<text x="842" y="280" text-anchor="middle" class="council-note">Separate from main agent</text>
<text x="1055" y="280" text-anchor="middle" class="council-note">Six reports + challenge</text>
<text x="540" y="410" text-anchor="middle" class="council-note">Six independent council members; two per service</text>
<text x="540" y="434" text-anchor="middle" class="council-note">Same-service members run in sequence</text>
</svg>
</div>

The chart shows the structure of a Full run in my setup. Different services can work at the same time; the two members using one service run in sequence. The same structure can develop the initial answer or review the output of an earlier council.

## The files behind a Full council

The archive keeps the individual reports as well as the adversarial review and synthesis. Start with `SYNTHESIS.md`; open the underlying reports when you want to understand a disagreement.

The extra folders separate the adversary’s **inputs**, its **answer**, and the material passed to synthesis. The tree below shows the relevant files, leaving out execution logs and receipts. `<run-id>` stands for the generated run folder.

<div class="council-file-map" role="group" aria-label="Full council file tree">
<div class="council-file-row"><code>council/YYYY-MM-DD_topic/</code><span>One Full council run</span></div>
<div class="council-file-row"><code>├─ PROMPT.md</code><span>The shared task and evidence index</span></div>
<div class="council-file-row"><code>├─ seat-prompts/</code><span>The six member assignments</span></div>
<div class="council-file-row"><code>├─ raw/</code><span>Saved copies of the independent reports</span></div>
<div class="council-file-row"><code>│  ├─ claude-1.md</code><span>Claude 1 report</span></div>
<div class="council-file-row"><code>│  ├─ claude-2.md</code><span>Claude 2 report</span></div>
<div class="council-file-row"><code>│  ├─ codex-1.md</code><span>Codex 1 report</span></div>
<div class="council-file-row"><code>│  ├─ codex-2.md</code><span>Codex 2 report</span></div>
<div class="council-file-row"><code>│  ├─ gemini-1.md</code><span>Gemini 1 report</span></div>
<div class="council-file-row"><code>│  └─ gemini-2.md</code><span>Gemini 2 report</span></div>
<div class="council-file-row"><code>├─ adversary-packet/</code><span>Inputs given to the fresh adversary</span></div>
<div class="council-file-row"><code>│  ├─ STAGE_PROMPT.md</code><span>Its review assignment</span></div>
<div class="council-file-row"><code>│  ├─ core-packet.md</code><span>Original task and evidence index</span></div>
<div class="council-file-row"><code>│  ├─ report-a.txt</code><span>First member report, anonymously labeled</span></div>
<div class="council-file-row"><code>│  ├─ …</code><span>Four more member reports (b–e)</span></div>
<div class="council-file-row"><code>│  └─ report-f.txt</code><span>Sixth member report</span></div>
<div class="council-file-row"><code>├─ adversary-state/</code><span>Saved adversary execution</span></div>
<div class="council-file-row"><code>│  └─ runs/&lt;run-id&gt;/</code><span>Generated run folder</span></div>
<div class="council-file-row"><code>│     └─ result.md</code><span>The adversary’s written findings</span></div>
<div class="council-file-row"><code>├─ synthesis-packet/</code><span>Inputs given to the fresh synthesizer</span></div>
<div class="council-file-row"><code>│  ├─ STAGE_PROMPT.md</code><span>Its synthesis assignment</span></div>
<div class="council-file-row"><code>│  ├─ core-packet.md</code><span>Original task and evidence index</span></div>
<div class="council-file-row"><code>│  ├─ report-a.txt … report-f.txt</code><span>The same six member reports</span></div>
<div class="council-file-row"><code>│  └─ adversarial-review.txt</code><span>Copy of the adversary’s written findings</span></div>
<div class="council-file-row"><code>├─ MANIFEST.md</code><span>Run record and links to original results</span></div>
<div class="council-file-row"><code>└─ SYNTHESIS.md</code><span>The combined findings to read first</span></div>
</div>

Read `adversary-state/runs/<run-id>/result.md` for the adversary’s answer. The copy at `synthesis-packet/adversarial-review.txt` carries that answer into the final synthesis alongside the six original reports. It is the same review, not an additional round.

An important task does not automatically need Full. Ask what the extra perspectives and dedicated challenge could discover. Once the findings are in, the [review-and-revision loop](recursive-review.md) is the same: decide what to change, revise the work, and request another council when it has a clear job.
