---
description: Why stripping CRITICAL, YOU MUST, and ALL-CAPS emphasis from your skills makes them work better. A methodology for dialing back ceremonial prompting language without losing real safety gates.
---

# Dial-Back Discipline

I spent a week in April stripping the word `CRITICAL` out of my skill files. Also `YOU MUST`, `ABSOLUTELY`, `IMPORTANT`, and most ALL-CAPS emphasis. Nineteen dial-backs across six skill files. The skills got shorter and they started producing better output.

Here's why, and how to do the same audit on your own skills.

---

## Why ceremonial emphasis backfires

Early in the Claude Code era, prompts that told the model `YOU MUST DO X` or `CRITICAL: NEVER Y` seemed to work. The model took them seriously. So skill libraries filled up with capitalized directives, warnings, and emphatic hedges.

Something changed in Claude 4.5 and persists in 4.7. Anthropic's own prompting guide calls out the issue directly: anti-laziness language like "be thorough," "think carefully," or CRITICAL/MUST over-triggers the model, especially in tool-use contexts. The model spends extra tokens deliberating about whether it's being thorough enough, runs extra verification passes, and drifts away from the actual task. The emphasis that used to ensure compliance now costs performance.

You can test this yourself. Take a skill with a pile of `CRITICAL: YOU MUST ABSOLUTELY...` prefixes and run it against a simple task. Strip the emphasis and run the same task. The stripped version is usually faster and at least as accurate.

---

## The two categories of emphasis

Not all emphasis is wrong. A useful audit distinguishes two kinds:

**Ceremonial emphasis** — used to signal seriousness to the reader (me, writing the skill) rather than to constrain the model. Most of the `CRITICAL` labels I'd written over time fell here. I was using them as section markers, or to reassure myself that the skill handled an edge case, or to make a point stand out when I re-read the file. The model doesn't benefit from these.

**Load-bearing emphasis** — used because the consequence of skipping the rule is genuine user harm: an email sent without approval, a file deleted, a filter created that runs forever. Here the emphasis is earning its keep. A `CRITICAL` label on "never send an email without explicit user confirmation" is worth keeping because the failure mode is real and irreversible.

The audit rule: if you can remove the emphasis and the worst-case outcome is just a slightly worse skill output, it's ceremonial. If removing it risks a user consequence that can't be undone, it's load-bearing.

---

## What to strip, by example

Before:

> **CRITICAL: YOU MUST follow this sequence exactly.**
>
> 1. Read the config file
> 2. Extract team members
> 3. Filter by active status
>
> **IMPORTANT: Never skip step 3 or you will get stale data.**

After:

> Follow this sequence:
>
> 1. Read the config file
> 2. Extract team members
> 3. Filter by active status — skipping this leaves stale members in the output.

Two things changed. The CRITICAL/IMPORTANT wrapper is gone. The warning about step 3 is now in-line with the step itself, framed as a positive consequence ("skipping this leaves stale members") rather than a negative injunction ("Never skip").

Another before:

> **YOU MUST NOT use markdown headers in the output.**

After:

> Output format: plain paragraphs, no headers.

The constraint is the same; the wording is calmer. Positive description of what to do beats a capitalized ban on what not to.

---

## What to keep

Kept as load-bearing in my own skills after the audit:

- **"CRITICAL: never send an email without explicit user approval"** — sending is irreversible, the failure mode is real.
- **"YOU MUST NOT create Gmail filters without confirmation"** — filters run 24/7 without Claude, mis-created filters are a long-lived problem.
- **"CRITICAL: do not modify the live production database"** — destructive, irreversible.

Everything else got dialed back. The skill files are about 15% shorter. Behavior is the same or slightly better.

---

## How to run the audit

About 45 minutes per skill if you already know it well. For a library of six to ten heavy skills, plan a half-day.

1. **Grep for the flagged words:**
   ```bash
   grep -nE "CRITICAL|YOU MUST|ABSOLUTELY|IMPORTANT:|NEVER " ~/.claude/skills/*/SKILL.md
   ```
2. **For each hit, ask the two-category question:** Ceremonial or load-bearing? If the worst case of removing it is "slightly worse output," it's ceremonial. Strip it.
3. **Rewrite as positive description where possible.** "Do X; skipping X means Y" beats "NEVER skip X or ABSOLUTELY Y."
4. **Keep real safety gates.** Don't cut the approval requirements on irreversible operations. Re-read the rewrite and check that the load-bearing cases still read as blocking.
5. **Run the skill against a familiar task.** Compare length of output, quality of output, and tool-call count against the pre-audit baseline. In my audit, every skill got slightly faster; none got worse.
6. **Record the dial-backs.** Keep a one-line log of what was cut from which skill. Useful if a regression shows up later — you know what to try putting back first.

---

## Related patterns

**Positive examples beat negative rules.** "Write in flowing prose with no headers or bullets" beats "don't use markdown." When you have to forbid something, pair the ban with a concrete positive.

**Action verbs, not vague adjectives.** "Be thorough" is empty. "Compare your approach against [named standard]" is specific. Depth comes from action verbs, not emphasis.

**Bookend pattern, not repetition.** If a constraint really matters for a long prompt, state it at the top and restate it at the end. That's more effective than capitalizing it in the middle.

---

## What this costs you

One real tradeoff: dial-back discipline makes your skill files less legible to you, the author, when you re-open them months later. The capitalized warnings used to serve as visual bookmarks. Stripping them means you can't scan the file as quickly for "where was that important bit?"

Two fixes: use markdown section headers (`##`, `###`) as structural navigation. And add a brief one-sentence summary at the top of each skill that names the things that would be most dangerous to change. That gives future-you the visual anchor without feeding the ceremony back to the model.

---

## Related

- **[Session management](../essentials/session-management.md)** — same spirit applied to running sessions.
- **[What's new in April 2026](../changelog.md)**.
