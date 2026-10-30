# Example: Health & Fitness

*This is a detailed example of [AI Project Folders](../../build-your-own/project-folders.md).*

---

<div class="narrative-block" markdown>
<p class="narrative-teaser" markdown>
This isn't a planning folder like vacation or shopping. It's a research and consultation folder. I keep a detailed markdown file with my health baseline, labs, medications, and training patterns. When I have a question — blood pressure trends, a sports injury, nutrition claims, physical therapy options — the AI gives advice that accounts for my full context instead of starting from scratch.
</p>

??? note "How I actually use this"

    I use this folder in a few different modes:

    - **Deep thinking sessions** — extended conversations where I work through a specific health question. Understanding a lab result trend, evaluating treatment options for an injury, figuring out how to modify training around a constraint.
    - **Deep research reports** — when I want to understand claims about nutrition, blood pressure management, or physical therapy approaches. I ask for evidence with primary sources. I'm comfortable reading the actual studies, so I ask the AI to be skeptical of small-sample or non-experimental research.
    - **Quick consultations** — minor ailments, aches and pains, equipment recommendations, whether a new monitoring device would be useful.

    Dr. Claude and Dr. ChatGPT are both genuinely good at this. I generally trust ChatGPT most for deep research in this domain — its web browsing lets it pull current studies and reviews. Claude tends to be better for structured analysis when I already have the information.

    The key insight: none of this works well without the profile file. Without it, you get generic advice for a generic person. With it, you get advice calibrated to your age, your medications, your injury history, and your actual training goals.

</div>

---

## What Goes in the Profile

The canonical file is a single markdown document with your stable health context. Here's the structure — what sections to include and why each one matters.

### 1. Core baseline (table)

A small table of stable facts: age range, height, weight range, blood pressure trend, key lab categories. Use ranges rather than exact numbers — they're more stable and more private. The AI needs "blood pressure elevated, trending down on current medication" — not your reading from last Tuesday.

### 2. Medications & supplements (table)

**This is the most important section for safety.** Columns: drug category, schedule, indication, and notes. When you ask about a new supplement, exercise protocol, or dietary change, the AI cross-references your medication list and flags interactions. Without it, you get advice that ignores contraindications.

Include notes on recent changes ("dose recently increased," "discontinued after targets met") — these give the AI context for why your current regimen looks the way it does.

### 3. Medical history & injuries (bullets)

Chronic conditions, injury limitations, and red flags requiring clinician involvement. Write injuries in functional terms ("avoid high-impact on left knee" or "no deep flexion beyond 90°") rather than diagnostic terms. The AI needs to know what movements to modify, not your full medical chart.

### 4. Lifestyle & activity pattern (table)

Your actual training: modalities, frequency, typical sessions, and goals. This tells the AI your real training load, so recommendations account for recovery, volume, and competing demands. If you climb three times a week and run twice, a recommendation to "add three days of HIIT" is bad advice — the AI catches that when it knows your schedule.

### 5. Family history

Relevant family health patterns, especially anything that shapes your preventive focus. A family history of cardiac events in the 50s-60s changes every recommendation about exercise intensity, monitoring, and medication decisions.

### 6. Monitoring & devices (bullets)

What you currently track and what tools you have. This prevents the AI from recommending "check your HRV trends" when you don't own a device that tracks HRV. Also note what you're open to adopting — the AI can make targeted suggestions.

### 7. Preferences & constraints

How you want the AI to behave: evidence standard, tone, what to emphasize (performance vs. weight loss), what to avoid (generic tips, product upselling). If you're comfortable reading primary research, say so — it changes the depth and citation style of every response.

### 8. Update policy

When to refresh each section: labs after each checkup, meds immediately on change, training goals quarterly. Without this, you'll be getting advice based on stale information and won't notice.

---

## The Instructions File

Separate from the profile, the project instructions tell the AI *how to behave*:

```text
# Health & Fitness — Project Instructions

## Standing preferences
- Base guidance on evidence and cite primary sources
- Be skeptical of small-sample or non-experimental research
- Flag anything requiring clinician approval (lab trends,
  medication changes, etc.)
- Focus on performance and injury prevention, not generic
  weight-loss tips
- Neutral tone; avoid excessive enthusiasm

## How to use the profile
- Load or reference the master health profile at the start of
  any health- or fitness-related thread
- If information seems out of date, ask before guessing
- If a test, reading, or monitoring device would help answer
  a question, suggest it

## Privacy
- No full identifiers in outputs
- Keep advice general enough to be safe if seen by others
```

---

## When to Use Files vs. Instructions Only

This is a domain where **uploaded files matter**. Your health profile has tables of data — baseline vitals, medication lists, training patterns — that are too detailed for the instructions field alone. Upload the profile as a source file (ChatGPT) or project knowledge (Claude.ai), and keep the behavioral rules in instructions.

Compare this to [shopping](shopping.md), where the instructions file alone is enough. The rule of thumb: if you have *tables of data* the AI needs to reference, upload a file. If you have *rules and preferences*, instructions are sufficient.

---

## Building Your Own Health Profile

Use the same three-step process from the [main guide](../../build-your-own/project-folders.md#build-your-first-file):

1. **Narrate your situation** — dump your health context: conditions, medications, training, goals, injuries, what's worked and what hasn't
2. **Let the AI interview you** — it will ask about medication interactions, training constraints, monitoring tools, recovery patterns, family history
3. **Generate the canonical file** — have the AI synthesize it into the table structure described above

**Privacy note:** Be thoughtful about what goes in the file versus what you share only in conversation. The profile should contain enough for individualized advice without being a complete medical record. Use ranges instead of exact values. Keep detailed lab results in conversation, not in the permanent file.

**Iteration:** Your first version will be thin. After a few consultations you'll notice what's missing — usually injury constraints, medication interaction notes, or training details the AI needed but didn't have. Add those. By the fifth or sixth session, the file stabilizes and updates become a line or two after each doctor's visit or training shift.

---

## Next Steps

<div class="grid cards" markdown>

-   **Back to the pattern**

    ---

    The universal build guide, starter template, and how to apply this to any domain.

    [:octicons-arrow-right-24: AI Project Folders](../../build-your-own/project-folders.md)

-   **See the shopping example**

    ---

    A simpler folder — instructions only, no uploaded files needed.

    [:octicons-arrow-right-24: Shopping Decisions](shopping.md)

-   **See the vacation example**

    ---

    The original folder — where the pattern started.

    [:octicons-arrow-right-24: Vacation Planning](vacation.md)

</div>
