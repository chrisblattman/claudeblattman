# Example: Shopping Decisions

*This is a detailed example of [AI Project Folders](../../build-your-own/project-folders.md).*

---

<div class="narrative-block" markdown>
<p class="narrative-teaser" markdown>
I built my first shopping file after the third time I asked ChatGPT for a product recommendation and got a wall of options with no clear winner. The AI kept recommending unknown brands, inventing prices, and ignoring that I care more about durability than saving $20. Once I wrote down how I actually decide — and told the AI to stop guessing — the recommendations got dramatically better.
</p>

??? note "The full story: how ad hoc prompting became a system"

    It started the way it starts for everyone. I needed something — a piece of gear, a household item — and asked the AI "what should I buy?" I'd paste a link, maybe mention a budget. The output was inconsistent: too many options, vague tradeoffs, and confident claims about prices and availability that turned out to be wrong.

    The first failure mode I noticed: it didn't remember that I value durability over marginal savings. Every new conversation, I'd re-explain my decision style from scratch. The second: it would recommend 15 options when I needed 3. The third: it sounded certain about things it couldn't possibly know — stock levels, sale prices, review consensus.

    So I started adding rules. No hallucinated specs. Label uncertainty explicitly. Shortlist only — 3 to 5 picks, not 15. Explain tradeoffs and failure modes. That made outputs more reliable, but still generic.

    The real shift came when I separated *how I decide* from *what I'm buying now*. My decision criteria — durability, return policy, total cost of ownership, established brands over unknowns — don't change between purchases. So I pulled them into a canonical file. The per-purchase details (budget, timeline, use case) go into a brief I paste fresh each time.

    After about five purchases, the file stabilized. I wasn't rewriting it — just adding a line after each buy. "Check parts availability for anything with a motor." "Discount 'just arrived' reviews." The system got better without getting bigger.

</div>

---

## Anatomy of a Real Shopping File

Unlike the [vacation example](vacation.md), where I upload reference files as sources, shopping needs only an instructions file. The decision criteria and behavioral rules fit in a few paragraphs — no tables of data required.

Here's the structure of my actual shopping instructions, with annotations explaining *why* each section exists.

### Decision posture

```text
- Prioritize best-in-class or best value-for-money products.
  Mention budget options when durability is less critical. # (1)
- Avoid unknown or low-quality brands, especially random
  marketplace imports. Favor well-known, trusted brands. # (2)
- Value durability and long-term satisfaction over first
  impressions. Highlight reviews reflecting long-term use. # (3)
```

1. **Why "best-in-class or best value":** Without this, the AI optimizes for price — which is the wrong objective for most purchases. This one line reframes every recommendation.
2. **Why "avoid unknown brands":** AI chatbots love recommending cheap imports with inflated reviews. This forces it to default to established brands unless you explicitly opt in to risk.
3. **Why "long-term satisfaction":** Most positive reviews are written in the first week. The AI needs to weight long-term ownership reports and failure-mode descriptions, not "just arrived" praise.

### How to recommend

```text
- Provide curated shortlists (3-5 picks), side-by-side
  comparisons, and pros/cons summaries.
- Include links to expert reviews (e.g., Wirecutter, Outdoor
  Gear Lab). I like to read the deep dives myself. # (1)
- Do not recommend subscription or auto-renewal options
  unless explicitly requested. # (2)
```

1. **Why "include expert review links":** The AI's own product knowledge is unreliable for specific models and prices. Pointing to trusted review sources gives you something to verify against.
2. **Why "no subscriptions":** Left to its own devices, the AI will recommend subscription services for everything. This prevents it from optimizing for recurring revenue that doesn't serve you.

### Buying logistics

```text
- Default to online shopping. Preferred retailers: Amazon Prime,
  plus trusted specialty retailers with strong reputations. # (1)
- Factor in delivery costs — free or low-cost shipping preferred.
- Alert me if a relevant sale period is approaching (Prime Day,
  Black Friday, seasonal sales for relevant categories). # (2)
```

1. **Why specify retailers:** This prevents recommendations from sketchy marketplaces with bad return policies. The AI will find the cheapest source unless you tell it to factor in the buying experience.
2. **Why sale alerts:** Simple but easy to forget. The AI knows seasonal patterns — if you're buying outdoor gear in May, it should flag that REI's anniversary sale is coming.

### Durability and context

```text
- Strong warranties are a plus for outdoor and activity gear.
  For everyday goods, durability matters more than warranty.
- Family with kids — sometimes shopping for children, including
  short-term-use items where lower cost is acceptable. # (1)
- [Your ecosystem: e.g., Apple devices, specific audio system,
  PC for a family member. Smart home details if relevant.]
- [Your interests: e.g., outdoor sports, cooking, reading,
  travel. These shape gear and gift recommendations.]
```

1. **Why "kids" as a modifier:** Without this, the AI applies adult durability standards to everything. Kids' items often have a 6-month useful life — the calculus is different, and the AI needs to know that.

---

## How a Purchase Actually Works

### Step 1: Paste a run brief

Each purchase gets a short brief — what you're buying, the use case, must-haves, budget, and timeline. Here's what one looks like:

```text
Item: Standing desk for home office
Use case: Daily use, 8+ hours. Need to alternate sitting/standing.

Must-haves:
- Stable at standing height (no wobble during typing)
- Fits 2 monitors + laptop
- Quiet motor

Nice-to-haves:
- Memory presets for sitting/standing heights
- Cable management built in

Constraints:
- Budget: under $700
- Width: max 60 inches (alcove)
- Timeline: no rush, can wait for a sale
- Buying channel: online with easy returns

Avoid: particle board tops, brands I can't find long-term reviews for
```

Notice what's *not* in the brief: how I evaluate products, my review-reading heuristics, my preference for durability over price. All of that lives in the instructions file. The brief is just the situation-specific layer.

### Step 2: Review the structured output

The AI produces a consistent format every time:

1. **Shortlist** — 3-5 picks, labeled (best overall, best value, best upgrade)
2. **Comparison table** — small, scannable
3. **Who each pick is for** — one line each
4. **Failure modes** — what commonly goes wrong and what to check before buying
5. **Buy path** — where to buy, return/warranty notes, counterfeit risk
6. **Questions** — only if truly needed, max 5

This structure isn't decorative — it prevents the AI from producing walls of unstructured text that require you to do the analysis yourself.

### Step 3: Close the loop

After you buy (and especially after you've used the product), do a 2-minute debrief. The AI proposes a canonical update — 0 to 5 stable learnings, each mapped to a specific section of your instructions file.

**The decision rule:** Would this learning change my recommendation for a *future, different* purchase? If yes, add it. If it's specific to this one product, skip it.

!!! note "Field note"
    After buying outdoor gear, I learned that "check parts availability" matters more than brand reputation for anything with replaceable components. That one line — added after a single purchase — improved every gear recommendation afterward.

---

## Run Brief Templates

### Standard purchase

```text
Item:
Use case:

Must-haves:
-
-

Nice-to-haves:
-
-

Constraints:
- Budget range:
- Timeline:
- Buying channel (online vs pickup):
- Compatibility/sizing constraints:

Candidates (optional):
Avoid/dislikes:
```

### Comparison / decision problem

```text
I'm choosing between these specific products: [links or names].
Compare them against my evaluation criteria.
Include a comparison table and recommend one, with the key
tradeoff that would make you switch your recommendation.
```

### Replacement / upgrade

```text
Replacing: [current product and what's wrong with it]
Keep: [what works about the current one]
Fix: [the specific problem driving the replacement]
Budget: [range]
```

---

## Common Failure Modes (and the Fixes)

The guardrails in the instructions file aren't arbitrary. Each one exists because of a specific failure:

| Failure | What happens | Fix in the file |
|---------|-------------|----------------|
| Too many options | 15 picks, no clear winner | Shortlist cap (3-5) + forced tradeoffs |
| Junk brands | Unknown imports with inflated reviews | Default to reputable; require opt-in for risk |
| Spec-sheet bait | Feature lists instead of real-world fit | Emphasize failure modes, warranty, long-term reviews |
| Invented facts | Confident prices, stock levels, review claims | "Unknown unless provided"; label uncertainty |
| Ignored constraints | Recommends something that doesn't fit | Run brief requires constraints; AI must check them |
| File bloat | Instructions become a junk drawer | Stable-only rule + size limit + quarterly prune |

---

## Next Steps

<div class="grid cards" markdown>

-   **Back to the pattern**

    ---

    The universal build guide, starter template, and how to apply this to any domain.

    [:octicons-arrow-right-24: AI Project Folders](../../build-your-own/project-folders.md)

-   **See the vacation example**

    ---

    The same pattern applied to family travel — where it all started.

    [:octicons-arrow-right-24: Vacation Planning](vacation.md)

-   **See the health example**

    ---

    A research and consultation folder — uploaded files for detailed health context.

    [:octicons-arrow-right-24: Health & Fitness](health.md)

</div>
