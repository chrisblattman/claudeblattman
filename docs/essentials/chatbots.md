# Chatbots Done Right

<span class="badge-teal">No Claude Code required</span>

Most people use AI chatbots like Google: one question, one answer, move on. That's the least valuable way to use them.

This page covers the techniques that separate casual users from people who get genuinely useful work out of AI chatbots.

---

## Pick the Right Model

This is the single highest-leverage thing most people aren't doing.

Every major AI provider offers multiple models at different capability levels. The default is usually *not* the best one. It's the cheapest one they can serve at scale.

| Provider | Weaker Default | Stronger Option | How to Switch |
|----------|---------------|----------------|---------------|
| **Claude** | Sonnet 4.6 (the default on free/Pro) | Opus 4.6 (more capable, slower) | Click the model selector in Claude.ai, or use `/model opus` in Claude Code |
| **ChatGPT** | GPT-4o (the default) | o1-pro or o3 (stronger reasoning) | Click the model dropdown in ChatGPT |

![Claude.ai model selector showing Opus 4.6, Extended thinking toggle, and additional models](../images/claude-model-selector-v1.png){ alt="Claude.ai interface showing the model selector dropdown with Opus 4.6 selected, Extended thinking toggle, and More models menu expanded" }

**The practical difference:** For quick questions, the default model is fine. For anything that requires reasoning, synthesis, or careful writing — research summaries, proposal drafts, data analysis plans — the stronger model produces noticeably better results. It's the difference between a competent undergraduate and a sharp colleague.

*Model names change frequently. The principle holds: always choose the strongest option in the model selector. Opus-tier models require a paid plan.*

**Cost reality:** Stronger models are either restricted to paid tiers or use more of your usage allowance. But if you're already paying for a subscription, you're leaving money on the table by not using the best model available to you.

---

## Give It Context About You

A chatbot with no context about you gives generic advice. A chatbot that knows your role, your projects, and your preferences gives advice you'd actually follow.

### The Basics: Just Tell It

At the start of any conversation, spend 30 seconds on context:

> *I'm an assistant professor of economics studying labor markets in developing countries. I run two active RCTs. I manage 4 research assistants. I'm writing a grant proposal for a foundation that's due March 15.*

Now every response is calibrated to your actual situation instead of a generic "researcher."

### The Power Move: Saved Context

Both Claude and ChatGPT let you save persistent context that applies to every conversation:

| Platform | Feature | Where to Set It |
|----------|---------|----------------|
| **Claude.ai** | Projects | Create a Project, add instructions and files. Every conversation in that project starts with your context. |
| **ChatGPT** | Custom Instructions + Memory | Settings > Personalization > Custom Instructions. Applies to all conversations. ChatGPT also builds memory from your conversations over time. |

=== "Claude.ai Projects"

    ![Claude.ai Projects interface showing Memory, Instructions, and Files panels](../images/claude-projects-v1.png){ alt="Claude.ai Projects interface with Memory panel, Instructions section, and uploaded Files" }

=== "ChatGPT Projects"

    ![ChatGPT Projects interface showing a project with instructions and uploaded files](../images/chatgpt-projects-v1.png){ alt="ChatGPT Projects interface showing a Prompt Engineer project with Sources tab and uploaded instruction files" }

**What to put in saved context:**

- Your role and field
- Your current projects (brief descriptions)
- Your preferences (writing style, level of detail, how you like feedback)
- Common tasks you'll ask about

**Example** (for a Claude.ai Project called "Grant Writing"):

```text
I'm an economics professor at a research university. I write 3-5 grant
proposals per year, primarily for foundations (not government agencies).

My writing style: Direct, evidence-first, short sentences. No jargon
unless the funder expects it. Numbers over adjectives.

Current proposals in progress:
- Foundation A: Crime intervention study in Latin America. Due March 15.
- Foundation B: Youth employment RCT in East Africa. Due April 30.

When I ask for help with proposals:
- Always start with the key claim, then evidence
- Flag where I'm making assertions without data
- Keep paragraphs under 5 sentences
- Tell me if a section is too long for the typical funder attention span
```

With this in place, every conversation in that project starts with full context.

### The Next Level: Teach It Your Voice

Saved context tells the AI *about* you. A voice file teaches it to *write like* you. If AI output never quite sounds right — too formal, too hedgy, full of words you'd never use — the fix is a reference document that captures your actual patterns. [:octicons-arrow-right-24: Teaching AI Your Voice](voice.md)

### The Next Level: Project Folders

Saved context gets you started. But for recurring planning tasks — vacations, home projects, health goals — you can go further: a canonical file that stores your stable preferences, constraints, and past results so every new conversation starts from a consistent baseline and improves over time.

I built one for family vacation planning. It knows our climate thresholds, each family member's activity preferences (and what they hate), our logistics constraints, and which past trips worked or failed. Every new trip starts with that file, not from scratch.

[:octicons-arrow-right-24: Build an AI Project Folder](project-folders.md)

---

## Structure Your Requests

The Quickstart demonstrated this, but it bears repeating: structured prompts get dramatically better results.

**The pattern:**

1. **Context** — what the AI needs to know about the situation
2. **Task** — what you want it to do (be specific)
3. **Format** — how you want the output structured
4. **Constraints** — length, tone, what to avoid, what to prioritize

**Weak prompt:**
> *Help me write an abstract for my paper.*

**Strong prompt:**
> *Write a 250-word abstract for an economics paper. The paper uses a randomized controlled trial to test whether cognitive behavioral therapy reduces criminal behavior among high-risk young men in a major Latin American city. Main finding: 20% reduction in arrests at 12 months, driven by changes in self-regulation rather than employment. The audience is the American Economic Review. Lead with the research question, then design, then result, then implication. Avoid jargon that wouldn't appear in a top-5 journal.*

The second version takes 60 seconds longer to write and saves 20 minutes of back-and-forth.

---

## Use Conversations, Not One-Shots

Chatbots have memory within a conversation. Use it.

**The one-shot mistake:** Asking one big question, getting one long answer, starting a new conversation for the next question.

**The conversational approach:** Build up context through a series of exchanges.

```text
You:    Here's my draft introduction. What are the weakest points?
Claude: [identifies 3 issues]
You:    Rewrite paragraph 2 addressing your first point. Keep my voice.
Claude: [rewrites]
You:    Good direction, but too formal. More like my blog voice —
        shorter sentences, occasional humor.
Claude: [revises]
You:    Perfect. Now do the same for paragraph 4.
```

Each exchange builds on the last. The AI learns your preferences *within the session* and gets better as you go. This is dramatically more effective than starting fresh each time.

---

## Know What Chatbots Are Bad At

Being honest about limitations saves more time than any prompting technique.

**Chatbots are unreliable for:**

- **Factual claims** — They hallucinate citations, invent statistics, and state falsehoods confidently. Always verify facts, especially numbers and references.
- **Math** — Don't trust arithmetic in conversational responses. For any calculation that matters, ask the chatbot to write and run code, or verify externally.
- **Current events** — Training data has a cutoff. Web search features help but aren't comprehensive.
- **Legal, medical, or financial advice** — Useful for general orientation, dangerous for specific decisions.

**Chatbots are genuinely good at:**

- **Drafting and editing** — First drafts, rewrites, tone adjustments, structural suggestions
- **Synthesis** — Combining multiple sources or ideas into coherent summaries
- **Brainstorming** — Generating options you hadn't considered
- **Explaining** — Breaking down complex topics for different audiences
- **Format conversion** — Turning notes into tables, bullets into prose, data into narratives

**The right mental model:** A chatbot is a brilliant, well-read colleague with no memory and a tendency to make things up. Trust the reasoning, verify the facts.

---

## Build a Library of Good Prompts

When you find a prompt that works well for a recurring task, save it. Build a personal collection.

Start simple — a text file, a note in your phone. Just stop reinventing the wheel every time you need to:

- Draft a recommendation letter
- Summarize a paper for a non-academic audience
- Turn meeting notes into action items
- Review a draft for logical gaps

Over time, this library becomes the seed of something more powerful. On this site, the [Get Started](../setup/index.md) path shows how to turn saved prompts into automated skills that run in seconds. But even without that, a simple collection of your best prompts is one of the highest-value things you can build.

---

## Next Steps

<div class="grid cards" markdown>

-   **Add power tools**

    ---

    Dictation, transcription, and document research tools that multiply the value of everything above.

    [:octicons-arrow-right-24: Wispr Flow](wispr-flow.md) &middot; [:octicons-arrow-right-24: Granola](granola.md) &middot; [:octicons-arrow-right-24: NotebookLM](notebooklm.md)

-   **Understand the landscape**

    ---

    Honest comparison of when to use which tool.

    [:octicons-arrow-right-24: ChatGPT vs Claude](chatgpt-vs-claude.md)

-   **Stress-test your plans**

    ---

    Paste a plan into a fresh AI chat with an adversarial prompt and get structured critique — no coding needed.

    [:octicons-arrow-right-24: Plan Review (Browser)](../workflows/plan-review-browser.md)

-   **Go deeper**

    ---

    When chatbots aren't enough, Claude Code turns AI into a workflow tool.

    [:octicons-arrow-right-24: Get Started](../setup/index.md)

</div>
