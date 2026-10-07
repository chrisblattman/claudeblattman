# AI Project Folders: Turn Any Recurring Task into a System

<span class="badge-teal">No Claude Code required</span>

*Ready to build? [Skip to the setup](#build-your-first-file). Want to see examples first? [Jump to the examples](#see-it-in-action).*

A single file stores your stable preferences, hard constraints, and behavioral rules for a recurring domain. Every new conversation starts from that file instead of from scratch.

I use project folders for two things: **life** (travel, shopping, health) and **work** (research writing, proposals, course prep). The pattern is the same — I'll walk through it using family travel as the main example, then show how it applies across domains.

This works in both ChatGPT Projects and Claude.ai Projects, with minor setup differences noted below.

---

## What This Actually Looks Like

Before you invest time reading, here's the payoff in 30 seconds.

**Without a project file** — you ask ChatGPT to help plan a summer trip:

> *Here are my top 10 recommendations for a family summer vacation:*
>
> *1. Yellowstone National Park — stunning geysers and wildlife*
> *2. San Diego — beautiful beaches and the famous zoo*
> *3. Orlando — Walt Disney World and Universal Studios*
> *4. Maui — tropical paradise with snorkeling and hiking*
> *5. Washington D.C. — free museums and monuments...*

Generic. Tourist-list. Could be for any family on Earth.

**With a project file** — same question, same chatbot:

> *Given your preference for high-altitude or desert climates in summer, your teen daughter's horse-riding priority, and your budget for HomeExchange accommodations, I'd suggest looking at three options in the Mountain West. Note: I'm flagging that two of these will exceed 85°F in late July, which historically has limited your outdoor climbing days. Here's a comparison with trade-offs for each family member...*

It references your specific constraints without you repeating them. That's the difference.

A project file is just a well-written prompt you write once and reuse forever.

---

<div class="narrative-block" markdown>
<p class="narrative-teaser" markdown>
I built my first project file for family vacation planning. That one file — and the failures that shaped it — taught me the pattern I now use for everything. [See the examples below](#see-it-in-action).
</p>
</div>

---

## Build Your First File {: #build-your-first-file }

This takes about an hour for a first file, then 10 minutes to update after each use.

But before you keep reading — open ChatGPT or Claude in another tab and think of one domain where you keep repeating yourself to the AI. Vacations, shopping, meal planning, a type of professional writing. Just pick one. That's what you'll build.

### Platform setup

- **ChatGPT** (requires Plus or Team): Sidebar → Projects → New Project. Paste your instructions in the Instructions field. You can also upload reference files as **sources** — ChatGPT draws on them in every conversation. I upload trip research and past itineraries as sources for vacation planning; for shopping, the instructions alone are enough.
- **Claude.ai** (requires Pro): Projects → Create Project. Paste your instructions in **Project Instructions**. You can upload reference documents to the **project knowledge** base. Claude prepends instructions to every conversation and can search the knowledge files.

Whether you need uploaded files depends on the domain. Travel planning benefits from source files (past itineraries, research). Shopping and health mostly need just the instructions file. Start with instructions only and add files when you feel the gap.

### Step 1: Narrate your situation

Open a new conversation and dump everything you know about this domain. Be messy. Be thorough. Don't organize — just talk. Even three sentences is enough to start — the interview in Step 2 will fill the gaps.

Here's the difference between a thin dump and a useful one:

**Too thin:** *"I like beaches and good food."*

**Useful:** *"We travel as a family of four — the kids need activity, not scenery. My partner is pescatarian. I'm a rock climber. We hate tourist traps, we avoid extreme heat, and our last three trips that worked were a mountain town in the Pacific Northwest, a cultural city in southern Mexico, and a desert trip in winter. The beach resort we tried was a disaster."*

More detail = better file. Include what went wrong on past attempts, not just what went right.

### Step 2: Ask the AI to interview you

After your dump, paste this prompt:

```text
Based on what I've shared, interview me to fill in the gaps. Ask me
12 questions, one at a time, covering:

1. Who is involved and what are each person's individual preferences?
2. What does each person actively dislike or avoid?
3. What are our hard constraints (budget ceilings, date windows, health limits)?
4. What specific thresholds matter (temperature ranges, drive times, flight durations)?
5. What past experiences worked well — and what specific conditions made them work?
6. What past experiences failed — and what went wrong?
7. What's our typical logistics setup (car rental, accommodation style, pace)?
8. What trade-offs are we usually willing to make?
9. What trade-offs are we NOT willing to make?
10. Are there any behavioral instructions for you — things I want you to always
    do or never do when helping with this domain?
11. What patterns have I noticed across my best experiences?
12. Is there anything I mentioned that seems contradictory or that you want
    to clarify?

Ask one question at a time. Wait for my answer before moving to the next.
```

Answer honestly. The AI is building a model of your preferences — the more specific you are, the better your file will be.

!!! tip "Add 'avoids' per person, not just 'likes'"
    Avoidances are the true constraints. A family member who "likes beaches" is flexible. A family member who "refuses to hike uphill for more than 30 minutes" is a hard constraint that changes every recommendation.

!!! tip "Use explicit threshold numbers"
    "Flag anything over 85°F" works. "We don't like heat" doesn't. "Budget under $300/night for accommodation" works. "We're not extravagant" doesn't. Numbers give the AI something to actually check against.

**Checkpoint:** You should now have 10-15 specific answers. If you have fewer than 8, go back — the thin ones are usually avoids and thresholds.

### Step 3: Ask the AI to produce a canonical file

After the interview, paste this prompt:

```text
Now synthesize everything — my initial dump and all my interview answers — into
a single canonical project file. Follow these rules:

1. SEPARATE stable preferences from situation-specific details. The file should
   contain only things that are true across all future uses of this domain.
   Anything specific to one instance (a particular trip, a specific purchase)
   should be excluded.

2. USE EXPLICIT THRESHOLD NUMBERS, not adjectives. "Prefer daytime highs
   65-80°F; flag anything over 85°F" not "we like mild weather."

3. ORGANIZE BY CATEGORY: People/preferences, Constraints, Logistics,
   Evidence from past experience, Behavioral instructions for you.

4. GIVE EACH PERSON THEIR OWN SECTION with both preferences AND explicit
   avoids.

5. FLAG anything you inferred versus what I stated directly, so I can
   correct inferences.

6. KEEP IT UNDER 500 WORDS. Shorter files produce better adherence.
   Aim for 300-500 words.

Format as clean markdown. This file will be pasted into a ChatGPT or
Claude project as standing instructions.
```

**Checkpoint:** Your file should be 300-500 words with at least one threshold number and one "avoids" entry per person or category. If it's over 600 words, ask the AI to prune situation-specific details.

### Starter template

If you'd rather start from a template and fill it in, here's a generic one that works for any recurring domain:

```text
# [DOMAIN] Planning Context

## Key Instructions
- [BEHAVIORAL RULE: e.g., "Be analytical, not agreeable. Offer critical opinions."]
- [BEHAVIORAL RULE: e.g., "Always flag potential problems before I ask."]
- [BEHAVIORAL RULE: e.g., "Provide 1.5-2x more options than needed so I can choose."]

## People & Preferences
### [Person 1]
- Priorities: [what they care about most]
- Also enjoys: [secondary interests]
- Avoids: [explicit dislikes — be specific]

### [Person 2]
- Priorities: [...]
- Avoids: [...]

## Hard Constraints
- Budget: [specific ceiling, e.g., "under $300/night accommodation, $150/day activities"]
- Time windows: [when this typically happens]
- [Other constraint]: [with threshold number]
- [Other constraint]: [with threshold number]

## Logistics & Preferences
- [How you typically handle logistics in this domain]
- [Pace/style preferences]

## Evidence: What's Worked
- [Past experience that worked] — conditions: [why it worked]
- [Past experience that worked] — conditions: [why it worked]

## Evidence: What Hasn't Worked
- [Past experience that failed] — problem: [what went wrong]
- [Past experience that failed] — problem: [what went wrong]

## Key Success Factors
- [Factor 1]
- [Factor 2]
- [Factor 3]
```

**Good fill-in:** `Budget: under $300/night for accommodation, $150/day activities`

**Bad fill-in:** `Budget: moderate`

The bad version gives the AI nothing to work with. The good version gives it a number to check against.

### How to know it's working

You're done when your file has: stable preferences for each person, at least 2-3 explicit constraints with threshold numbers, and an "avoids" section.

**Test it:** Start a *completely new* conversation in the project (this tests whether the file actually loaded, not whether it's in your current context). Ask for three suggestions in your domain. The hard test: at least one option should be explicitly eliminated or flagged because it violates a constraint in your file. If all three options look generically good, the file isn't specific enough — go back to the avoids and thresholds.

### When it doesn't work

**AI ignores the file.** This happens occasionally, especially in long conversations. Reprompt: "Reference my project file directly. Do not give generic recommendations." Starting a fresh conversation usually fixes it.

**Generic tourist-list results.** Your file lacks specificity. The fix is almost always the same: add explicit avoids, threshold numbers, and past experience patterns. The AI defaults to generic when it doesn't have enough constraints to differentiate.

**File too long or bloated.** Prune to under 500 words. Remove situation-specific details (those belong in per-instance briefs, not the canonical file). Shorter files produce noticeably better adherence, especially in ChatGPT. Aim for 300-500 words after stabilization.

---

## How This Actually Develops

Don't expect your file to be good on day one. It follows a predictable arc:

**Stage 1: Messy dump → first usable file** (conversations 1-2). Your file is rough. You update it substantially after every use. The AI's output is better than no-context conversations but still occasionally generic.

**Stage 2: Failure modes teach you the rules** (conversations 3-5). You discover what's missing — avoids, thresholds, evidence patterns — usually because the AI recommended something that violated an unstated constraint. These failures are the most productive part of the process. Each one adds a specific rule to your file.

**Stage 3: Maintenance, not building** (conversation 6+). The file is reliable enough to trust. Updates are 1-2 lines after each use, not rewrites. Your job shifts from building the file to pruning it — removing anything situation-specific that crept in, keeping it under 500 words.

---

## See It in Action

The domain changes. The structure doesn't. Three examples — from simple to detailed.

=== "Health & Fitness"

    *A research and consultation folder — uploaded files for detailed health context.*

    This isn't a planning folder like vacation or shopping. It's a research and consultation folder. I keep a detailed markdown file with my health baseline, labs, medications, and training patterns. When I have a question — blood pressure trends, a sports injury, nutrition claims, physical therapy options — the AI gives advice that accounts for my full context instead of starting from scratch.

    ??? note "How I actually use this"

        I use this folder in a few different modes:

        - **Deep thinking sessions** — extended conversations where I work through a specific health question. Understanding a lab result trend, evaluating treatment options for an injury, figuring out how to modify training around a constraint.
        - **Deep research reports** — when I want to understand claims about nutrition, blood pressure management, or physical therapy approaches. I ask for evidence with primary sources. I'm comfortable reading the actual studies, so I ask the AI to be skeptical of small-sample or non-experimental research.
        - **Quick consultations** — minor ailments, aches and pains, equipment recommendations, whether a new monitoring device would be useful.

        Dr. Claude and Dr. ChatGPT are both genuinely good at this. I generally trust ChatGPT most for deep research in this domain — its web browsing lets it pull current studies and reviews. Claude tends to be better for structured analysis when I already have the information.

        The key insight: none of this works well without the profile file. Without it, you get generic advice for a generic person. With it, you get advice calibrated to your age, your medications, your injury history, and your actual training goals.

    **What goes in the profile:** A single markdown document with your stable health context — core baseline (age range, weight range, blood pressure trend), medications & supplements (the most important section for safety — the AI cross-references interactions), medical history & injuries (written in functional terms like "no deep flexion beyond 90°"), lifestyle & activity pattern, family history, monitoring devices, and preferences & constraints.

    **The instructions file** (separate from the profile) tells the AI how to behave:

    ```text
    ## Standing preferences
    - Base guidance on evidence and cite primary sources
    - Be skeptical of small-sample or non-experimental research
    - Flag anything requiring clinician approval
    - Focus on performance and injury prevention, not generic weight-loss tips

    ## How to use the profile
    - Load or reference the master health profile at the start of any thread
    - If information seems out of date, ask before guessing

    ## Privacy
    - No full identifiers in outputs
    - Keep advice general enough to be safe if seen by others
    ```

    **Files vs. instructions only:** This is a domain where uploaded files matter. Your health profile has tables of data — baseline vitals, medication lists, training patterns — that are too detailed for the instructions field alone. Upload the profile as a source file (ChatGPT) or project knowledge (Claude.ai), and keep the behavioral rules in instructions. Compare this to shopping, where the instructions file alone is enough.

    **Building your own:** Use the same three-step process from the [setup guide above](#build-your-first-file). Privacy note: use ranges instead of exact values. Keep detailed lab results in conversation, not in the permanent file. By the fifth or sixth session, the file stabilizes and updates become a line or two after each doctor's visit or training shift.

=== "Vacation Planning"

    *The original folder — family travel with constraints, thresholds, and an evidence bank.*

    The first file I built wasn't for research. It was for planning family vacations. That sounds trivial, but it taught me the pattern I now use for everything. We once planned a trip to a great spot for climbing and rafting. Turned out it was one of the hotter times of year — we lost several outdoor days. That failure is what taught me to add explicit temperature thresholds instead of vague preferences like "we don't like heat."

    ??? note "The full story: how a messy dump became a system"

        It started as a brain dump. My wife and I were planning a summer trip and I pasted a wall of text into ChatGPT — where we'd been, what the kids liked, what we couldn't stand. The AI gave decent suggestions but kept recommending beach resorts, which isn't us.

        So I refined the dump. Added explicit "avoids" for each family member. Added temperature thresholds instead of "we prefer mild weather." Added past trip patterns — not just where we went, but *which conditions made them work*: high altitude, desert-like, culturally rich small towns.

        By the third or fourth trip planned this way, the file had stabilized. I wasn't rewriting it anymore — just adding a line or two after each trip. After about six conversations, the file was reliable enough to trust. New trip planning conversations started producing useful, specific suggestions on the first exchange.

    **System instructions** — the behavioral rules that prevent generic output:

    ```text
    I want you to be an unusually investigative advisor for travel.
    Instead of focusing on being highly agreeable, be analytical and
    offer critical opinions where appropriate.

    When starting a new discussion, analyze the prompt and come back with:
    * What kind of vacation we want
    * Who is going (if not clear)
    * Major red flags based on my preferences
    * Potential travel restrictions

    Please do not hallucinate details but investigate and confirm
    wherever possible.
    ```

    Why "unusually investigative"? Without this, the AI defaults to agreeable mode — it recommends whatever you seem excited about. "Major red flags" forces it to cross-reference your preferences *before* generating suggestions.

    **Persona preferences** — each family member gets their own section:

    ```text
    ### Teen Daughter
    - Passions: Animals (especially horses — horseback riding is her top priority),
      water sports, reading, bookstores, shopping
    - Avoids: Steady uphill hikes (unless scrambly or leading to water),
      heavy insect areas, long drives without stops
    ```

    The design pattern: preferences tell the AI what to suggest. Avoids tell it what to *filter out*.

    **Logistics constraints** — every constraint has a number:

    ```text
    ## Climate & Weather Requirements
    - Temperature: Prefer daytime highs 65-80°F; flag anything over 85°F
    - Humidity: Low humidity preferred, especially if over 80°F

    ## Travel Logistics
    - Base strategy: Prefer one home base for 5-7 days with activities
      within 75-minute drives
    - Driving limits: Maximum 8 hours/day, preferably 4
    - Accommodation: Heavy users of home exchange
    ```

    Not "we don't like long drives" but "maximum 8 hours, preferably 4." Not "mild weather" but "65-80°F, flag over 85°F."

    **Evidence bank** — tag each entry with its conditions:

    ```text
    ## Successful Past Patterns
    - Mountain/high altitude — Pacific Northwest in summer
      (worked: climate, outdoor sports, uncrowded)
    - Cultural/authentic — Southern Mexico
      (worked: food scene, local flavor, affordable, kids engaged)

    ## Good but Imperfect
    - Coastal Mexico resort town (too muggy; inland towns were better)
    - Major European cities in summer (too crowded; rural areas excellent)
    ```

    This is the most powerful section — it gives the AI pattern-matching data instead of just preference lists.

    **How a trip actually works:** Start a new conversation with a short trip brief (dates, who's going, special constraints). The canonical file provides everything else. Review the AI's initial response — did it reference your constraints? Ask for 1.5-2x the options you need with explicit trade-offs. Pick 1-2 top options and build the itinerary. After the trip, add 1-2 stable learnings.

=== "Shopping Decisions"

    *Instructions-only folder — durability over price, curated shortlists, and a system that learns from every purchase.*

    I built my first shopping file after the third time I asked ChatGPT for a product recommendation and got a wall of options with no clear winner. The AI kept recommending unknown brands, inventing prices, and ignoring that I care more about durability than saving $20.

    ??? note "The full story: how ad hoc prompting became a system"

        The first failure mode I noticed: it didn't remember that I value durability over marginal savings. Every new conversation, I'd re-explain my decision style from scratch. The second: it would recommend 15 options when I needed 3. The third: it sounded certain about things it couldn't possibly know — stock levels, sale prices, review consensus.

        The real shift came when I separated *how I decide* from *what I'm buying now*. My decision criteria don't change between purchases. So I pulled them into a canonical file. The per-purchase details go into a brief I paste fresh each time.

    **Decision posture:**

    ```text
    - Prioritize best-in-class or best value-for-money products.
      Mention budget options when durability is less critical.
    - Avoid unknown or low-quality brands, especially random
      marketplace imports. Favor well-known, trusted brands.
    - Value durability and long-term satisfaction over first
      impressions. Highlight reviews reflecting long-term use.
    ```

    Without the first line, the AI optimizes for price — the wrong objective. Without the second, it recommends cheap imports with inflated reviews. Without the third, it weights "just arrived" praise over long-term ownership reports.

    **How to recommend:**

    ```text
    - Provide curated shortlists (3-5 picks), side-by-side
      comparisons, and pros/cons summaries.
    - Include links to expert reviews (e.g., Wirecutter, Outdoor
      Gear Lab). I like to read the deep dives myself.
    - Do not recommend subscription or auto-renewal options
      unless explicitly requested.
    ```

    **Run brief template:**

    ```text
    Item: Standing desk for home office
    Use case: Daily use, 8+ hours. Alternate sitting/standing.

    Must-haves:
    - Stable at standing height (no wobble during typing)
    - Fits 2 monitors + laptop
    - Quiet motor

    Constraints:
    - Budget: under $700
    - Width: max 60 inches (alcove)
    - Timeline: no rush, can wait for a sale

    Avoid: particle board tops, brands without long-term reviews
    ```

    Notice what's *not* in the brief: how I evaluate products, my review-reading heuristics, my preference for durability over price. All of that lives in the instructions file.

    **Structured output** — the AI produces a consistent format every time: shortlist (3-5 picks, labeled), comparison table, who each pick is for, failure modes, buy path, and questions (only if truly needed).

    **Common failure modes and fixes:**

    | Failure | Fix in the file |
    |---------|----------------|
    | Too many options | Shortlist cap (3-5) + forced tradeoffs |
    | Junk brands | Default to reputable; require opt-in for risk |
    | Invented facts | "Unknown unless provided"; label uncertainty |
    | File bloat | Stable-only rule + size limit + quarterly prune |

### Work

The same principles apply to professional workflows — writing, proposals, reports, literature reviews.

**ChatGPT Deep Research** deserves a special mention: it may be the single most valuable AI tool for faculty right now. Give it a clear, well-engineered prompt and it produces detailed research briefings that would take hours of manual searching.

For project management workflows that go beyond project folders — weekly reviews, living dashboards, automated proposal drafting — see the [Project Management](../workflows/project-management.md) section.

---

## Claude vs ChatGPT for This

| Dimension | ChatGPT | Claude |
|-----------|---------|--------|
| Web research | Deep Research, current prices, reviews | Limited |
| Structured analysis | Good | Better |
| Building the canonical file | Good | Better |
| Active trip/project planning | Better (browsing) | Good |
| Automating recurring processes | Limited | Claude Code excels |

**My approach:** I use ChatGPT project folders for research-heavy planning where I need current web info. I use Claude Code for professional tasks that I run repeatedly with standardized inputs. For building the canonical file itself, Claude tends to produce better-organized, more precise output. Note that ChatGPT's web browsing frequently hallucinates specific prices, hours, and availability — always verify time-sensitive details independently.

---

!!! tip "What I Wish I'd Known"

    - **Start with a messy dump, not a template.** Your first version will be bad. That's the process. The template above is a finishing structure, not a starting point.
    - **The file becomes reliable after about 3-4 uses.** Before that, expect to update it every time. After that, your job is maintenance, not building.
    - **Post-use updates should be 1-2 lines, not essays.** One new rule. One updated threshold. One "this worked under these conditions."
    - **Guard against the AI being too agreeable.** Specific techniques: ask it to steelman the option it's *not* recommending. Ask it to identify which of your constraints a proposed option violates. Ask it to generate one "bad fit" option alongside good ones so you can see the contrast.
    - **If you edit the canonical file mid-conversation, start a new conversation afterward.** The AI has already processed the old version and may produce inconsistent results mixing old and new instructions.

---

## Next Steps

<div class="grid cards" markdown>

-   **Level up your prompts**

    ---

    The prompting techniques that make project files (and everything else) work better.

    
-   **Understand the landscape**

    ---

    When to use ChatGPT vs Claude — and when it matters for project folders.

    [:octicons-arrow-right-24: ChatGPT vs Claude](chatgpt-vs-claude.md)

-   **Go deeper**

    ---

    When project folders aren't enough, Claude Code turns recurring tasks into automated workflows.

    [:octicons-arrow-right-24: Get Started](../setup/index.md)

</div>

<label class="page-done"><input type="checkbox"> My folders make some semblance of sense now.</label>
