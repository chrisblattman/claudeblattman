# Voice Pack Template

*Updated March 2026*

A fill-in-the-blank template for making AI reliably write in your voice. Works in ChatGPT Projects, Claude.ai Projects, or Claude Code. Replace placeholders, paste in your own writing samples, and load it into any tool that supports persistent instructions.

Based on a multi-register voice system built for research writing, donor communications, and email. Adapt the structure to your contexts.

---

## 0) How to use this template

**In a chatbot (ChatGPT or Claude.ai):**
Paste this entire file — filled in with your content — into the Instructions field of a Project. Every conversation in that project starts with your voice loaded.

**In Claude Code (simplest path):**
Save your core voice file to `~/.claude/rules/core-voice.md`. It auto-loads every session — no imports needed. This handles the fundamentals (ban list, sentence patterns, claim-first stance) across all contexts. For context-specific registers, use `@voice/` imports in project-level CLAUDE.md files. See Section 8 for copy-paste CLAUDE.md and output style snippets.

**Recommended file structure** (for Claude Code users who want the full setup):

```
voice/
  YOUR_VOICE.md          ← this file, filled in
  YOUR_EXAMPLES.md       ← annotated writing samples (Section 4)
  YOUR_CHECKLIST.md      ← optional QA checklist
.claude/
  output-styles/
    Your-Voice.md        ← optional output style (Section 8)
CLAUDE.md                ← imports voice files via @voice/...
```

If you use chatbots only, ignore the file structure — just paste the content from Sections 1–5 into your Project instructions.

---

## 1) What to capture (the minimum set that actually moves outputs)

Think in layers. The AI needs cues at 3 levels:

### A. Macro-structure (what sections exist and in what order)
For each deliverable type you write (memos, proposals, reports), define a canonical outline.

### B. Rhetorical moves (what you do, repeatedly)
Examples: lead with a clear claim; quantify; specify decision points; name risks; end with an explicit ask.

### C. Micro-style (sentence-level voice)
Examples: short topic sentences; active voice; concrete verbs; minimal hedging; numbered lists over long paragraphs.

The AI follows examples more reliably than abstract descriptions, so use both: a short spec + a few canonical examples.

---

## 2) Your voice spec (edit this)

### 2.1 Voice attributes (high-level)
- audience: [your primary readers — e.g., donors, policymakers, academic reviewers, clients]
- tone: [e.g., direct, confident, evidence-forward; not chatty; not academic-performative]
- stance: [e.g., action-oriented; tradeoffs explicit; uncertainty named precisely]
- default length: [e.g., 1 page / 600–900 words unless otherwise specified]

### 2.2 Non-negotiables (rules the AI must follow)
1. first paragraph answers: what we're doing, why it matters, and the decision/ask
2. each paragraph starts with a topic sentence that makes a claim
3. prefer numbers over adjectives ("~25% reduction" > "substantial reduction")
4. active voice; concrete verbs; avoid "it is believed/it is hoped"
5. no throat-clearing ("In this document…", "This proposal will…")
6. no generic hedging ("may", "might", "could") unless you quantify uncertainty or give a reason
7. use headings and numbered lists when it improves scanability
8. define acronyms once; avoid jargon when a plain term exists
9. [add your own rules here]
10. [add your own rules here]

### 2.3 Default formatting
- use short headings
- use numbered lists for plans, deliverables, risks, or decisions
- keep paragraphs short (2–5 sentences)
- [add your preferences]

### 2.4 Vocabulary preferences (edit)
Prefer verbs:
- [your active vocabulary — e.g., "deliver", "target", "measure", "verify", "reduce", "scale"]

Avoid phrases:
- [your ban list — start with AI defaults: "leverage", "synergy", "robust and comprehensive", "delve", "multifaceted", "foster", "navigate", "compelling", "pivotal", "transformative"]
- [add domain-specific avoids — e.g., "we believe" → use "we estimate", "evidence suggests"]

### 2.5 Evidence behavior
When making a claim, default to one of:
- cite prior results (your own or the literature)
- cite data (administrative, monitoring, survey)
- state the hypothesis + what would falsify it + what you will measure

If you can't cite, mark it as an assumption.

---

## 3) Canonical outlines (pick 1–3 and standardize)

### 3.1 [Deliverable type 1 — e.g., 1-page policy note]
1. Bottom line (2–3 sentences): problem → proposed action → why it's worth it
2. What we know (evidence in bullets, with numbers)
3. Proposed intervention / program (what changes in the world)
4. Implementation plan (who, where, timeline)
5. Risks + mitigations (3–5 bullets)
6. What you need from the reader (the ask)

### 3.2 [Deliverable type 2 — e.g., project summary]
1. Summary in 5 bullets
2. Objective + theory of change
3. Design (what, where, who, when)
4. Measurement + outputs
5. Current status + next milestones
6. Risks / dependencies

### 3.3 [Deliverable type 3 — e.g., funding proposal section]
- Problem + stakes (quantify)
- Approach (what is new, what is proven)
- Evidence (prior results)
- Plan + timeline + deliverables
- Team + governance + partners
- Budget logic (what costs buy)
- Risks + mitigations
- Why this funder, why now

---

## 4) Examples (this is the secret sauce)

Add 3–5 short "gold" excerpts (150–300 words each), diverse in topic, but all in your best voice.

Format each example like this:

### Example 1: [title]
```xml
<context>
Audience:
Purpose:
Constraints (length, tone):
</context>

<example_text>
[Paste your text]
</example_text>

<notes>
What makes this "you" (2–5 bullets).
</notes>
```

### Example 2: [title]
```xml
<context>
Audience:
Purpose:
Constraints:
</context>

<example_text>
[Paste your text]
</example_text>

<notes>
What makes this "you" (2–5 bullets).
</notes>
```

### Example 3: [title]
```xml
<context>
Audience:
Purpose:
Constraints:
</context>

<example_text>
[Paste your text]
</example_text>

<notes>
What makes this "you" (2–5 bullets).
</notes>
```

---

## 5) A skill to enforce voice (optional — Claude Code only)

Create a Claude Code skill that takes rough notes or a draft and rewrites it in your voice, then runs the checklist. Example:

- **Trigger:** `/voice-draft`
- **Behavior:** Takes bullet notes or rough draft → outputs a memo in your voice → runs the checklist from Section 2.2 → returns both the final draft and a short note of what it changed.

Skip this section if you're using chatbots only.

---

## 6) Testing protocol (so this doesn't become vibes)

Goal: validate that the voice pack produces consistent outputs.

### 6.1 Build a small test suite (10 prompts)
Write prompts like:
- "Turn these bullets into a 1-page memo"
- "Rewrite this paragraph for [your audience]"
- "Draft a 250-word project summary"
- "Write a 'risks and mitigations' section from these notes"

Include 2–3 "hard" prompts that previously caused failures (too hedgy, too fluffy, too academic).

### 6.2 Score with a rubric (1–5 scale each)
- scanability (headings, bullets, short paragraphs)
- topic sentences (claims up front)
- evidence density (numbers / citations)
- directness (no hedging without reason)
- actionability (clear ask, owner, next step)
- "sounds like me" (subjective, but score it anyway)

### 6.3 A/B test when you change the voice pack
Run the test prompts with:
- baseline (no voice pack)
- voice pack v1
- voice pack v2

Keep a simple changelog and note which rubric scores improved or regressed.

---

## 7) Maintenance workflow (keep it short and alive)

**Weekly (10 minutes):**

- Add 1 failure mode you noticed ("it over-hedged", "it got academic", "it added generic claims")
- Patch it with either:
  - one new rule (if it's a consistent issue), or
  - one new example (if it's a subtle stylistic cue)

**Monthly (30 minutes):**

- Prune redundancies
- Keep only canonical examples
- Update the vocabulary ban list
- Re-run the test suite

---

## 8) Implementation snippets (copy/paste)

### 8.1 CLAUDE.md snippet (Claude Code)
```
When drafting [your deliverable types], follow the voice pack.

@voice/YOUR_VOICE.md
@voice/YOUR_CHECKLIST.md
@voice/YOUR_EXAMPLES.md
```

### 8.2 Output style file (Claude Code)

Save as: `.claude/output-styles/Your-Voice.md`

```
---
name: Your Voice
description: [one-line description of your voice]
keep-coding-instructions: false
---

Follow the voice pack imported in CLAUDE.md. Prioritize scanability,
claims-first topic sentences, quantified evidence, and explicit asks.
Avoid hedging and academic tone.
```

---

## 9) References

- [Effective Context Engineering for AI Agents — Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Why canonical examples beat long rule lists.
- [Using XML Tags — Anthropic API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/use-xml-tags) — Structuring instructions and examples with XML tags.
- [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) — CLAUDE.md and file imports.
- [Claude Code Output Styles](https://code.claude.com/docs/en/output-styles) — Custom output styles and storage locations.
