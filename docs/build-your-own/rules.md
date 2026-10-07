---
description: Standing instructions that apply to every session — where rules live, what makes one actually hold, and why stripping CRITICAL and YOU MUST makes them work better.
---

# Set up rules and guidelines

Your [instruction file](../toolkit/claude-md.md) says who you are and where things live. **Rules are
the other half: what to do, and what never to do.** They apply to everything, so you write them
once instead of repeating yourself every session.

The difference matters. "My drafts live in `~/Projects`" is context. "Never send an email without
showing me the draft first" is a rule.

## Start with the ones you've already repeated

Don't sit down to write a rulebook. Watch for the moment you correct the agent twice for the same
thing — that correction is your first rule. Mine came from being irritated, not from planning:

- Meeting notes go at the top of the file, newest first.
- Never create a mail filter without asking. Filters run when I'm not there.
- Drafts only for anything that leaves my machine.

Three rules you actually use beat thirty you aspired to.

## Split them once there are more than a dozen

A single file of forty rules gets skimmed. At that point, break them into topic files — one for how
you write, one for how projects are organised, one per integration that has a quirk — and have the
instruction file point at them. The agent loads the relevant one when the subject comes up.

Keep the genuinely load-bearing ones inline, where they can't be missed:

```
Sending email: show me the draft. Never send directly.
Meeting logs: newest entry at the top.
```

[:octicons-arrow-right-24: A real annotated example](../downloads/real-claude-md-example.md)

## What makes a rule hold

This is the part that surprised me, and it runs against instinct.

**Shouting makes rules weaker, not stronger.** `CRITICAL: YOU MUST NEVER` reads as emphasis to you
and as noise to the model. When everything is critical, nothing is. Strip the ceremony and the real
constraints start standing out again.

**Say what to do, not only what to avoid.** "Write in flowing prose with no headers or bullets"
works better than "don't use markdown". When you do have to forbid something, pair the ban with the
thing you want instead.

**Use action verbs, not adjectives.** "Be thorough" is empty. "Compare this against the
pre-registration and list every discrepancy" is a rule that can actually be followed — or visibly
not followed, which is just as useful.

[:octicons-arrow-right-24: The full version of this argument](dial-back-discipline.md)

## Rules are not a safety system

A rule is an instruction the agent will almost always follow. It is not a mechanism that prevents
anything.

If the consequence of a rule being missed is real — mail sent, a file overwritten, data leaving
your machine — put a *permission* behind it as well, not just a sentence. The
[permissions step](../starter-kit/index.md#3-set-permissions) is what actually stops an action;
rules shape behaviour inside whatever permissions allow.

That distinction is the same one the newcomer checklist makes about plan mode: asking for a plan is
a request, and the mode is the thing that enforces it.

## Revisit them when they stop earning their place

Rules accumulate. Some were written for a quirk that has since been fixed, and a rule that no
longer applies is just context being burned on every session.

[:octicons-arrow-right-24: Keeping your setup current](../system/continuous-improvement.md)

<label class="page-done"><input type="checkbox"> My agent is now ruled.</label>
