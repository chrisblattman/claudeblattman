---
description: Use another council to review the first council’s combined output, then revise the work.
---

# Recursive review matters

[1. Council basics](../starter-kit/occasional.md) · [2. Multiple agents](council-models.md) · **3. Recursive review** · [4. Adversarial review](adversarial-review.md)
{ .council-series }

You already know how a council works: several agents tackle a task independently, then a synthesis brings their findings into one output. Now invoke it a second time. This council reviews that output instead of tackling the original task from scratch.

I use this to improve the work a council has produced, whether it is a draft, an analysis, or a recommendation. Fresh reviewers can notice a missing assumption, a contradiction, or a place where the result no longer answers my question. I add my judgment too: what I actually want, which constraints they missed, and what makes no sense to me.

## Use another council

On page one, you invoked the skill with `/council`. You can also ask for it in an ordinary sentence:

```text
Use another council to review the proposal we just produced. Does it answer the original request and reflect my decisions about existing customers and the five-week pilot? In particular, I’m not happy with your proposed budget. Let’s be more conservative.
```

Each member of the second council independently reviews the same single synthesis output from the first council, with your feedback and the relevant sources. The skill already handles the fresh reviewers, shared brief, independent reports, and synthesis. You supply the work to review and the question you want answered. You do not need to repeat its operating instructions.

<div class="council-horizontal" tabindex="0" role="region" aria-label="Use another council to review the output; scroll horizontally to follow the sequence">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1010 465" role="img" aria-labelledby="recursive-flow-title recursive-flow-desc">
<title id="recursive-flow-title">Use another council to review the output</title>
<desc id="recursive-flow-desc">First council: request, three independent members, combined output. Second council: three fresh members independently review the same single synthesis output from the first council, with your feedback. Their review synthesis leads directly to /done to save the handoff.</desc>
<defs><marker id="recursive-flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" class="council-arrowhead"/></marker></defs>
<rect x="15" y="85" width="115" height="50" class="council-node"/>
<text x="72.5" y="115.0" text-anchor="middle" class="">Your request</text>
<rect x="170" y="85" width="135" height="50" class="council-node"/>
<text x="237.5" y="115.0" text-anchor="middle" class="">First council</text>
<path d="M130 110 H170" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<rect x="350" y="15" width="180" height="50" class="council-node"/>
<text x="440.0" y="35.0" text-anchor="middle" class="">Member 1</text>
<text x="440.0" y="56.0" text-anchor="middle" class="council-note">Independent attempt</text>
<path d="M305 110 H325 V40 H350" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<path d="M530 40 H555 V110 H580" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<rect x="350" y="85" width="180" height="50" class="council-node"/>
<text x="440.0" y="105.0" text-anchor="middle" class="">Member 2</text>
<text x="440.0" y="126.0" text-anchor="middle" class="council-note">Independent attempt</text>
<path d="M305 110 H325 V110 H350" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<path d="M530 110 H555 V110 H580" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<rect x="350" y="155" width="180" height="50" class="council-node"/>
<text x="440.0" y="175.0" text-anchor="middle" class="">Member 3</text>
<text x="440.0" y="196.0" text-anchor="middle" class="council-note">Independent attempt</text>
<path d="M305 110 H325 V180 H350" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<path d="M530 180 H555 V110 H580" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<rect x="580" y="85" width="175" height="50" class="council-node"/>
<text x="667.5" y="105.0" text-anchor="middle" class="">Synthesis</text>
<text x="667.5" y="126.0" text-anchor="middle" class="council-note">Combined output</text>
<path d="M755 110 H795" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<rect x="795" y="85" width="180" height="50" class="council-node"/>
<text x="885.0" y="105.0" text-anchor="middle" class="">Your judgment</text>
<text x="885.0" y="126.0" text-anchor="middle" class="council-note">Update the work</text>
<path d="M885 135 V235 H237 V335" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<text x="650" y="225" text-anchor="middle" class="council-note">Same synthesis output, with your feedback</text>
<rect x="170" y="335" width="135" height="50" class="council-node"/>
<text x="237.5" y="355.0" text-anchor="middle" class="">Another council</text>
<text x="237.5" y="376.0" text-anchor="middle" class="council-note">Review the output</text>
<rect x="350" y="265" width="180" height="50" class="council-node"/>
<text x="440.0" y="285.0" text-anchor="middle" class="">Fresh member 1</text>
<text x="440.0" y="306.0" text-anchor="middle" class="council-note">Independent review</text>
<path d="M305 360 H325 V290 H350" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<path d="M530 290 H555 V360 H580" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<rect x="350" y="335" width="180" height="50" class="council-node"/>
<text x="440.0" y="355.0" text-anchor="middle" class="">Fresh member 2</text>
<text x="440.0" y="376.0" text-anchor="middle" class="council-note">Independent review</text>
<path d="M305 360 H325 V360 H350" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<path d="M530 360 H555 V360 H580" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<rect x="350" y="405" width="180" height="50" class="council-node"/>
<text x="440.0" y="425.0" text-anchor="middle" class="">Fresh member 3</text>
<text x="440.0" y="446.0" text-anchor="middle" class="council-note">Independent review</text>
<path d="M305 360 H325 V430 H350" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<path d="M530 430 H555 V360 H580" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<rect x="580" y="335" width="175" height="50" class="council-node"/>
<text x="667.5" y="365.0" text-anchor="middle" class="">Review synthesis</text>
<path d="M755 360 H795" class="council-edge" marker-end="url(#recursive-flow-arrow)"/>
<rect x="795" y="335" width="180" height="50" class="council-node"/>
<text x="885.0" y="355.0" text-anchor="middle" class="">/done</text>
<text x="885.0" y="376.0" text-anchor="middle" class="council-note">Save the handoff</text>
</svg>
</div>

## Not every change needs another council { #review-add-judgment-and-revise }

If the work is mostly right after this review—or even after the first council—you can ask the agent for small changes directly. Read the synthesis, decide what you want to keep, and request the remaining edits. For example:

```text
Change the heading “Pilot logistics” to “Who does what.”
```

That is a specific edit you can check yourself. It does not change the budget, staffing, or timetable, so there is little reason to ask another council to review it.

Changing a critical assumption or constraint is different. A smaller budget might require less staff time, a narrower scope, or a different timetable. Consider another council when you need to examine those consequences across the work. Tell it what changed and what you want it to reconsider.

Once you are satisfied with the result, use `/done` to save where you landed.

For important or consequential work, you can add a more deliberate challenge at either council stage. That is [adversarial review](adversarial-review.md).
