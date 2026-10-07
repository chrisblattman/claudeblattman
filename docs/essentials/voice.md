# Teaching AI Your Voice

<span class="badge-teal">Works in chatbots and Claude Code</span>

AI has a house style. You've seen it — the same cadence, the same filler words, the same way of saying nothing in three polished paragraphs. When you ask it to write for you, it writes like every other AI output. When you ask it to edit your work, it quietly overwrites your voice with its own.

The fix isn't better prompting. It's giving the AI a reference document — a "voice file" — that captures how you actually write. Load it once, and every conversation starts with your patterns, not the AI's defaults.

---

## Before and After

Same request, same model. The only difference is whether a voice file was loaded.

=== "Without voice file"

    > The mentoring program represents a comprehensive approach to addressing the challenges faced by at-risk youth. Through a multifaceted intervention combining cognitive behavioral therapy with economic support, we aim to foster meaningful behavioral change. Our robust methodology leverages randomized assignment to ensure rigorous impact evaluation.

=== "With voice file"

    > We're testing whether a cheap, scalable mentoring program can reduce violence among high-risk young men. The program combines CBT-based self-regulation training with a small cash grant — 10 sessions over 8 weeks, at roughly $120 per participant. We randomly assign 2,000 men to treatment or control and track arrests, self-reported violence, and employment at 12 months.

The first version could have been written by anyone — or anything. The second sounds like a researcher who knows the project and has opinions about it.

---

## Build Your Voice File

One path. Five steps. The most important step is step 4 — examples teach the AI your patterns far more reliably than abstract rules. The most important non-step is loading the file into a persistent Project (step 5), not a one-off chat.

!!! tip "The Ban List — do this first"
    These are the words AI uses that no human actually writes. If you add nothing else to your voice file, add this:

    *delve, leverage, multifaceted, furthermore, moreover, robust, compelling, navigate, foster, transformative, pivotal, I hope this email finds you well*

    Every one is a diagnostic signal that the AI is ignoring your voice and reverting to its default. Ban them explicitly. Takes 30 seconds; gives immediate results.

**1. Start with your best writing.** Pull 5–10 pieces you're proud of — funded proposals, blog posts people actually shared, emails where you nailed the tone. Diversity of context matters more than volume. A proposal and a blog post teach the AI more than five proposals. Paste all samples into a single chat window; don't worry about length.

**2. Let the AI analyze them, not you.** You're too close to your own voice to describe it accurately. Paste your samples plus this prompt into a fresh chat:

```text
Analyze these writing samples and extract my voice profile. For each
pattern you identify, cite the specific phrase or sentence that
demonstrates it. Cover:

1. How I open paragraphs — what's the first sentence doing?
2. Sentence length patterns — average, range, rhythm
3. Moves I repeat — do I enumerate? Use parentheticals? Quantify?
4. Vocabulary I reach for vs. vocabulary I avoid
5. How I handle uncertainty and evidence
6. What I never do (identify any consistent absences)

Be specific. "Uses short sentences" is useless. "Lead sentences average
8 words; elaboration sentences average 18" is useful. Quote my text
as evidence for every claim.
```

This is the page's core deliverable. The prompt forces the AI to ground every observation in your actual text, not generic style advice. If the AI returns vague patterns ("you use transitions effectively"), your samples may be too short or too similar — try adding a different genre.

**3. Ask it to build the voice spec.** From the analysis, use this prompt:

```text
Using the analysis above, write my voice spec. Format it as a style
guide that fits on a single page (300–500 words). Cover: tone and
stance, non-negotiable rules (numbered list, stated as constraints not
preferences), vocabulary to use vs. avoid, and how I handle evidence
and uncertainty. Every rule must be testable: instead of "write clearly,"
say "keep topic sentences under 12 words." Do not use adjectives where
a rule will do.
```

**4. Add annotated examples — this is what matters most.** A rule that says "write short sentences" is weaker than a paragraph that shows it. Include 3–5 examples using this structure:

```xml
<context>
Audience: Foundation program officer
Purpose: Justify a budget increase for fieldwork
Constraints: 1 paragraph, under 100 words
</context>

<example_text>
We underestimated travel costs by 40%. Fuel prices in northern Uganda
tripled since the proposal. We need an additional $12,000 to complete
the remaining 6 site visits. Without them, we lose 30% of our sample.
</example_text>

<notes>
- Opens with the problem, not background
- Quantifies everything (40%, $12,000, 6 visits, 30%)
- Four sentences, no hedging
- Ends with stakes, not a request
</notes>
```

Vary the examples by context (proposal, memo, email). They're the difference between a vague style guide and one the AI can actually use.

**5. Load it into a persistent Project — not a chat.** The voice file only works if it loads at the start of every conversation. Pasting it into a one-off chat loses it when you close the tab.

- **Claude.ai**: Click **New Project** → open Project Settings → paste your voice file into **Instructions**. Every conversation inside the project inherits it.
- **ChatGPT**: Click **Projects** → create a project → paste into the **Instructions** field.
- **Claude Code**: Import via `CLAUDE.md` using `@voice/your-voice-file.md`. Claude reads it automatically each session.

Then test it: ask the AI to write something you've already written — a paragraph from a recent proposal, a blog post intro. Compare the output to the original. If it uses words you'd never use, the voice file needs a rule.

??? tip "Multiple writing contexts"
    If your email voice sounds nothing like your proposal voice, you might want separate files — or a single file with register sections. Keep universal rules (ban list, sentence-length targets) in one place, and context-specific rules in their own sections. The [Voice Pack Template](../downloads/voice-pack-template.md) has the full framework.

---

## Why Examples Beat Rules

Rules tell the AI what to do. Examples show it what the result looks like. The AI pattern-matches against examples far more reliably than it follows abstract instructions. This is why step 4 matters more than step 3, and why 3–5 annotated examples produce better results than a longer rules list.

The `<context>` tag tells the AI the conditions under which this voice applies. The `<notes>` tag teaches it what to notice. Without both, the AI treats examples as decoration rather than evidence.

---

## Improve It Over Time

Every bad draft teaches you something about your voice file. When the AI gets your voice wrong, don't just fix the output — fix the file. Voice drift — where the model shifts register mid-document or across sessions — is the primary long-term failure mode. It's structural, not a sign that your file is broken. It means the file needs another example or a more specific rule.

| What the AI got wrong | What that reveals | Rule to add |
|---|---|---|
| Used "furthermore" and "moreover" | Ban list is incomplete | Add those transitions to the ban list |
| Long compound sentences | Sentence-length rule too vague | "Cap at 20 words. Vary rhythm: short, short, medium." |
| Hedged where you'd be direct | Missing stance rule | "Claims-first. 'I argue' not 'it could be argued'" |

After 3–4 writing sessions of active updating, most users find the file becomes reliable. The [Voice Pack Template](../downloads/voice-pack-template.md) includes a rubric-based testing protocol for validating improvements systematically.

---

## Next Steps

<div class="grid cards" markdown>

-   **Voice Pack Template**

    ---

    Fill-in-the-blank template covering tone, rules, vocabulary, examples, and testing. The full framework in one file.

    [:octicons-download-16: Download](../downloads/voice-pack-template.md)

-   **AI Project Folders**

    ---

    The same "store it as a file" pattern applied to planning, decisions, and recurring tasks.

    [:octicons-arrow-right-24: AI Project Folders](project-folders.md)

-   **Prompt Engineering**

    ---

    Structured prompts with your voice file loaded get better results than either alone.

    
</div>

<label class="page-done"><input type="checkbox"> My agent sounds less like slop and more like me!</label>
