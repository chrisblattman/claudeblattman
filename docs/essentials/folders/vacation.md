# Example: Vacation Planning

*This is a detailed example of [AI Project Folders](../project-folders.md).*

---

<div class="narrative-block" markdown>
<p class="narrative-teaser" markdown>
The first file I built wasn't for research. It was for planning family vacations. That sounds trivial, but it taught me the pattern I now use for everything — shopping, health, finances, even rock climbing trip logistics. We once planned a trip to a great spot for climbing and rafting. Turned out it was one of the hotter times of year — we lost several outdoor days. That failure is what taught me to add explicit temperature thresholds instead of vague preferences like "we don't like heat."
</p>

??? note "The full story: how a messy dump became a system"

    It started as a brain dump. My wife and I were planning a summer trip and I pasted a wall of text into ChatGPT — where we'd been, what the kids liked, what we couldn't stand. The AI gave decent suggestions but kept recommending beach resorts, which isn't us.

    So I refined the dump. Added explicit "avoids" for each family member. Added temperature thresholds instead of "we prefer mild weather." Added past trip patterns — not just where we went, but *which conditions made them work*: high altitude, desert-like, culturally rich small towns.

    By the third or fourth trip planned this way, the file had stabilized. I wasn't rewriting it anymore — just adding a line or two after each trip. "This destination worked when we had a car but would fail without one." "That region is too hot in July despite being great in October."

    After about six conversations, the file was reliable enough to trust. New trip planning conversations started producing useful, specific suggestions on the first exchange. No warm-up. No re-explaining who we are. The AI already knew we're a family of four with a teen who rides horses, a tween who lives for adventure sports, a parent who rock climbs, and another who wants natural beauty and water activities — and that all of us hate crowded tourist traps.

    That's when I realized: this isn't a vacation hack. It's a *pattern*. Any recurring task where you have stable preferences and learn from past experience can work this way. Shopping. Health decisions. Professional writing. Finances. The domain changes. The structure doesn't.

</div>

---

## Anatomy of a Real Project: Vacation Planning

Here's the structure of my actual vacation planning file, with annotations explaining *why* each section exists.

### System instructions

```text
I want you to be an unusually investigative advisor for travel. # (1)
Instead of focusing on being highly agreeable, be analytical and
offer critical opinions where appropriate. # (2)

When starting a new discussion, analyze the prompt and come back with:
* What kind of vacation we want (outdoorsy, urban, cultural, etc.)
* Who is going (if not clear)
* Major red flags based on my preferences # (3)
* Potential travel restrictions (visa, vaccination, safety warnings)

Please do not hallucinate details but investigate and confirm
wherever possible. # (4)

Provide 1.5 to 2 times more activity options than we have time
available so that we can pick and choose.
```

1. **Why "unusually investigative":** Without this, the AI defaults to agreeable mode — it recommends whatever you seem excited about. You want it to push back and surface problems early.
2. **Why "not agreeable":** Left to its own devices, the AI will cheerfully recommend a destination that violates three of your constraints. This instruction makes it flag conflicts instead of burying them.
3. **Why "major red flags":** This is the constraint-checking instruction. It forces the AI to cross-reference your preferences *before* generating suggestions, not after.
4. **Why "do not hallucinate":** AI chatbots will confidently invent hotel prices, restaurant hours, and activity availability. This instruction doesn't eliminate hallucination, but it reduces confident fabrication and encourages the AI to flag uncertainty.

### Persona preferences

Each family member gets their own section with preferences AND avoids. Here's one:

```text
### Teen Daughter
- Passions: Animals (especially horses — horseback riding is her top priority),
  water sports, reading, bookstores, shopping
- Adventure: Thrill rides, water parks, river rafting, swimming
- Avoids: Steady uphill hikes (unless scrambly or leading to water),
  heavy insect areas, long drives without stops
- Shopping: Loves used bookstores with good YA/fantasy sections,
  boutique clothing stores
```

The design pattern: preferences tell the AI what to suggest. Avoids tell it what to *filter out*. Without the avoids, you'll get recommendations that technically match the preferences but fail in practice.

### Logistics constraints

```text
## Climate & Weather Requirements
- Temperature: Prefer daytime highs 65-80°F; flag anything over 85°F
- Humidity: Low humidity preferred, especially if over 80°F
- Rain: Highlight wet seasons or inclement periods

## Travel Logistics
- Base strategy: Prefer one home base for 5-7 days with activities
  within 75-minute drives, rather than constant destination changes
- Driving limits: Maximum 8 hours/day, preferably 4
- Accommodation: Heavy users of home exchange; destination choice
  often driven by available exchanges
- Crowds: Avoid extremely touristy places; favor off-season or
  weekdays when possible
```

Every constraint has a number. Not "we don't like long drives" but "maximum 8 hours, preferably 4." Not "mild weather" but "65-80°F, flag over 85°F."

### Evidence bank

```text
## Successful Past Patterns
- Mountain/high altitude — Pacific Northwest in summer (worked: climate,
  outdoor sports, uncrowded)
- Cultural/authentic — Southern Mexico (worked: food scene, local flavor,
  affordable, kids engaged)
- Desert/semi-arid — Desert Southwest in winter (worked: climbing, mild
  temps, unique landscape)

## Good but Imperfect
- Coastal Mexico resort town (too muggy; inland towns were better)
- Pacific Northwest river town (fewer activities than expected;
  worked when we had water sports gear)
- Major European cities in summer (too crowded; rural areas
  in the same countries were excellent)
```

Tag each entry with its conditions. "Worked when we had a car." "Failed in summer heat." This is the most powerful section of the file — it gives the AI pattern-matching data instead of just preference lists.

---

## How a Trip Actually Works

### Step 1: Start a new conversation

Open a new thread in the project. Paste a short trip brief alongside the canonical file (or let the project instructions load automatically). The brief is situation-specific: dates, who's going, any special constraints for this particular trip.

### Step 2: Review the AI's initial response

The AI may ask clarifying questions first, or it may dive straight into suggestions. Both are normal. Before engaging with the suggestions, check: did it reference your constraints? Did it flag anything from your avoids? If it's giving generic output, reprompt: "Reference my project file. Which of my stated constraints does each option satisfy or violate?"

!!! note "Field note"
    My first version got Top 10 tourist lists. Adding explicit "avoids" per person changed everything. The AI went from suggesting beach resorts (which we rarely enjoy) to suggesting mountain towns and cultural small cities — exactly our pattern.

### Step 3: Compare options with explicit trade-offs

Ask the AI to generate 1.5-2x the options you need, with explicit trade-offs for each. A good response looks like: "Option A is best for the climber and worst for the teen. Option B satisfies everyone at a 7/10 but nobody at a 10/10. Option C is ideal weather but a 9-hour drive."

!!! note "Field note"
    The biggest upgrade: past trip patterns as evidence. Instead of "we like mild weather," I wrote "trips that worked: high altitude, desert, culturally rich small cities." It immediately stopped suggesting beach resorts.

### Step 4: Narrow and build the itinerary

Pick 1-2 top options. Ask for a realistic itinerary with pacing discipline — not a packed schedule that ignores your stated preference for late mornings or your kids' energy limits.

### Step 5: After the trip, update the file

Add 1-2 stable learnings. Not an essay — one new rule, one updated threshold.

**The decision rule:** "Would this change my recommendation for the *next* trip, even to a different destination? If yes, add it to the file. If it's specific to this trip's conditions, skip it."

!!! note "Field note"
    We planned a trip to a region known for climbing and rafting. Turned out it was one of the hotter times of year — limited our climbing days significantly. That's when I added explicit temperature thresholds: "flag anything over 85°F." Two words of specificity prevented the same mistake from recurring.

---

## Example Trip Brief

Here's an actual brief I've used (sanitized), showing how little context you need when the canonical file is doing its job:

```text
Planning: 10 days, late July. Full family (4 people).

Region: Pacific Northwest — interested in a mountain town near
major climbing areas.

Must-haves:
- Multi-pitch rock climbing accessible within 45 min of base
- Horseback riding options for the teen
- River or lake activities (SUP, kayak, rafting)
- Good restaurant/brewery scene in the town itself

Watch for:
- Heat management — check historical highs for late July
- Wildfire smoke risk in this region/season
- Book popular activities 2+ weeks ahead (horse riding, guided rafting)

Open question: Is it worth splitting the trip — 6 days mountain town
+ 4 days at the coast? Or better to commit to one base?
```

Notice what's *not* in the brief: family preferences, budget philosophy, accommodation style, driving limits, crowd preferences. All of that lives in the canonical file. The brief is just the situation-specific layer.

**Other brief styles I use:**

- **Comparison / decision problem:** "We're choosing between two coastal cities. Please compare them across our criteria and recommend one. Include a comparison table." — useful when you're stuck between options.
- **Exploratory / feasibility check:** "My son and I want a father-son trip focused on soccer and Spanish immersion in Latin America. Is this realistic for a 10-day window? What are the best options?" — useful when you're not sure the idea even works.

### Copy-ready brief templates

Use these as starting points for different planning modes:

**Two-destination routing:**

```text
Planning: [DURATION], [DATES]. [WHO IS GOING].

Route: [DESTINATION A] → [DESTINATION B]
Split: [X] days at A, [Y] days at B, [Z] day transit

Destination A priorities:
- [Activity/goal 1]
- [Activity/goal 2]

Destination B priorities:
- [Activity/goal 1]
- [Activity/goal 2]

Transit day: Recommend a worthwhile stop between A and B?
Open question: [Your actual uncertainty about this trip]
```

**Single base + day trips:**

```text
Planning: [DURATION], [DATES]. [WHO IS GOING].

Base: [TOWN/REGION]
Radius: Day trips within [X] minutes drive

Must-do activities:
- [Activity 1]
- [Activity 2]

Day trip ideas (rank by priority for our family):
- [Potential day trip 1]
- [Potential day trip 2]

Rain plan: If weather turns, what's the best swap from the day
trip list to an indoor/covered alternative?
```

**Skills/activities with daily constraint:**

```text
Planning: [DURATION], [DATES]. [WHO IS GOING].

Focus: [PRIMARY ACTIVITY — e.g., climbing, diving, language school]
Daily constraint: [PERSON] needs [X] — build this into every day

Structure each day as modular 60-90 minute blocks:
- Morning block: [primary activity]
- Midday block: [flexible — could be rest, food, or secondary activity]
- Afternoon block: [secondary activity or family time]

Flag any days where the primary activity isn't available
(weather, closures, rest days) and suggest alternatives.
```

---

## Optional Add-Ons

You probably don't need these. Add them only when you feel recurring pain in one of these areas:

- **Decision matrix** — When you're stuck between 3+ options and need a structured comparison. Ask the AI to build a weighted scoring table against your criteria.
- **Research log** — When source quality matters. Track which recommendations were AI-generated vs. independently verified.
- **Post-trip reflection** — Five bullet points: what worked, what didn't, what to add to the file, what to remove, what surprised you.
- **Packing module** — Families with kids tend to adopt this first. Stable packing lists per person, per trip type, with "don't forget" flags from past experience.
- **Booking/logistics checklist** — Time-sensitive tasks: what to book early, what to book late, what requires advance reservations in your typical destinations.

---

## Next Steps

<div class="grid cards" markdown>

-   **Back to the pattern**

    ---

    The universal build guide, starter template, and how to apply this to any domain.

    [:octicons-arrow-right-24: AI Project Folders](../project-folders.md)

-   **Level up your prompts**

    ---

    The prompting techniques that make project files (and everything else) work better.

    
-   **Understand the landscape**

    ---

    When to use ChatGPT vs Claude — and when it matters for project folders.

    [:octicons-arrow-right-24: ChatGPT vs Claude](../chatgpt-vs-claude.md)

</div>
