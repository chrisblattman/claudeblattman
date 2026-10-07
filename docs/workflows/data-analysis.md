---
description: The agent writes the analysis code, runs it, and you check what came out — cleaning, exploration, review of AI-written code, and reproducibility. Not yet written.
---

# The data analysis workflow

!!! warning "Not written yet"
    This page is a placeholder. It is linked from **week 6** of the
    [two-month plan](../starter-kit/two-month-plan.md), which budgets 45
    minutes for it. Nothing below is drafted copy.

There is currently **no data-analysis content anywhere on this site** — this
page would be the first.

## What this page needs to cover

Shay's framing: *"ask the agent to write the code and do the data analysis from
scratch… maybe that includes both writing the code, having the agent run the
code, and looking at it."* So at minimum:

1. **Writing the code** — plan first, as everywhere else on this site. AI-written
   analysis code is exactly the case the
   [Occasional Users](../starter-kit/occasional.md) page calls out as worth a
   council review.
2. **Running it** — what the agent runs itself, and what you run.
3. **Looking at what came out** — checking results against something you
   already know, not just reading the code.

Candidate scope, from four distinct jobs with different risk profiles:

| | What it covers |
|---|---|
| Cleaning and documenting | Messy file → documented dataset with a codebook |
| Exploration | "What's in this dataset" — what agents are genuinely good at |
| Analysis code review | The agent writes it, a council checks it, you verify against a hand calculation |
| Replication | Making someone else's code run, or making yours reproducible |

## The blocker

**The restricted-data question is unresolved.** This audience's data is often
human-subjects data, and the site currently handles that with a prohibition —
keep it out of the folder. A data-analysis page written for researchers cannot
just repeat that. It is the page where the alternative route has to exist:
bounded tasks, agent-written scripts you run yourself, mock data with the same
structure, local models where policy requires it.

Open since the Aniket critique. **Decide this before drafting.**

## Related

- [Coding rules](coding-rules.md) — the standing instructions this assumes
- [Deep research](deep-research.md) — the other half of week 6
