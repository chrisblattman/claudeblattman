# Agents vs Skills

An **agent** is an AI worker that uses a model and tools to carry out tasks. Claude Code and Codex are agent products; models such as GPT-6.1 Sol power the workers. A **subagent** is a separate worker started by the main agent. This page uses “agents” for those subagents.

Claude Code has two main building blocks: **skills** (slash commands that run in the main conversation) and **agents** (subprocesses that run in a separate context). Choosing the right one matters for reliability and quality.

---

## The Key Difference

| Dimension | Skill | Agent |
|-----------|-------|-------|
| **Context** | Runs in the main conversation with full history | Runs in a fresh context — no prior conversation |
| **User interaction** | Can ask questions, show drafts, get feedback | Returns a single result when done |
| **Memory** | Sees everything discussed so far | Sees only what you explicitly pass to it |
| **Bias** | May be influenced by prior conversation ("self-bias") | Fresh perspective — evaluates only what's written |
| **Speed** | Instant (already in context) | Slower (starts a new process) |

---

## When to Use a Skill

Skills work best when the task:

- **Needs conversation context** — The task builds on what you've already discussed
- **Requires user input** — You need to answer questions or make choices mid-workflow
- **Is a workflow** — Multi-step processes with user checkpoints
- **Modifies state** — Writing files, sending emails, updating docs

**Examples:**
- `/done` — Captures decisions from the *current session* (needs conversation history)
- `/council` — Coordinates independent agents using the task context
- `/setup-project-management` — Multi-phase setup with user decisions at each stage

---

## When to Use an Agent

Agents work best when the task:

- **Benefits from fresh eyes** — Review, critique, or evaluation tasks where prior context creates blind spots
- **Can run in parallel** — Multiple evaluations or analyses that don't depend on each other
- **Needs isolation** — You don't want the task polluting your main conversation context
- **Has a clear input and output** — "Here's a file, give me a review" rather than "let's work through this together"

**Examples:**
- **Writing review** — A fresh context evaluates the prose without knowing "what you meant"
- **Methodology review** — Catches issues that the session that wrote the paper might miss
- **Parallel research** — Launch 3 agents to investigate different approaches simultaneously

---

## Agent Debates: Multiple Perspectives on the Same Problem

One of the most powerful uses of agents is getting them to argue with each other. Instead of a single review, you set up multiple agents with different expertise or perspectives and let them debate your data, your plan, or your design.

??? example "Qualitative researchers analyzing pilot field data"

    We'd just finished a pilot — seven university students visited low-income neighborhoods in Bogota they'd never been to. We had memos the students wrote, open-ended survey responses, and quantitative survey data. Normally, a first pass through qualitative data like this takes days.

    I set up two agents as qualitative researchers from different traditions — one grounded theory, one thematic analysis — and gave them the anonymized memos, open-ended responses, and quantitative results. Their tasks: produce an initial interpretive report, compare the qualitative themes against the survey patterns, and draft best practices for a post-pilot debriefing interview guide.

    Twenty minutes later, we had intelligent first glimpses across the whole dataset. The agents flagged where the memos contradicted the survey numbers — students reported feeling safer in the quantitative data, but their memos focused on discovery and surprise rather than safety. They caught that one survey item moved in an unexpected direction and proposed interview questions to probe it. Each agent emphasized different things depending on their methodological lens, which told us what to pay attention to when we went back to read carefully.

    It didn't replace our own close reading. But it meant we had quick analysis and multiple perspectives immediately — a starting point for reflection rather than starting from scratch. We then used our own custom LLMs for the deeper qualitative analysis.

??? example "Behavioral economists critiquing a research design"

    For the same project, I asked Claude to impersonate three close colleagues of mine — Alex Imas, Leonardo Bursztyn, and Richard Thaler, all behavioral economists at UChicago — and debate our study design.

    "Imas" reframed our entire finding: the treatment wasn't reducing prejudice, it was shifting students' *reference point* for public goods. They'd seen parks in low-income areas that were better than parks in their own wealthy neighborhoods. That's not attitude change — it's a recalibration of what they thought was normal.

    "Bursztyn" was blunt: self-reported attitudes are "essentially worthless" in this context. Students know the right answer. He proposed three revealed-preference measures — including offering students a restaurant gift card redeemable in either their own neighborhood or the one they visited. The choice reveals what they actually believe, not what they'll say on a survey.

    "Thaler" argued we were framing the whole study wrong. This isn't a "contact hypothesis" paper — it's a study about *choice architecture*. The cable car that takes you to the neighborhood *is* the intervention. His proposed title: "The Blank Map: How Elites Think About Neighborhoods They've Never Visited."

    Each persona saw a different paper in the same data. The debate generated a table of nine new measures to add to the full study — none of which were in our original design.

The pattern: give agents distinct identities (methodological traditions, named colleagues, opposing stakeholders) and let the disagreements surface assumptions you hadn't examined. The value isn't in any single perspective — it's in where they clash.

---

## The Self-Bias Problem

This is the most important reason to use agents for review tasks.

When Claude writes something in a conversation and then you ask it to review that same thing, it has a systematic bias toward finding its own work acceptable. It "knows what it meant" even if the text is ambiguous. It may not question assumptions it made earlier.

An agent running in a fresh context doesn't have this problem. It evaluates only what's on the page — like handing your draft to a colleague who wasn't in the room when you wrote it.

**Rule of thumb:** If you're asking Claude to *critique* something it helped *create*, use an agent.

---

## Agent File Format

Agents are markdown files saved in `~/.claude/agents/`:

```markdown
---
name: Agent Name
description: What this agent does
model: sonnet
tools:
  - Read
  - Glob
  - Grep
---

# Agent Name

[Instructions for the agent]

## Review Dimensions
[What to evaluate]

## Output Format
[How to structure the response]
```

The YAML frontmatter specifies:
- **model** — Which Claude model to use (sonnet is cost-effective for most review tasks)
- **tools** — Which tools the agent can access (limit to what it needs)

---

## Launching Agents

From within Claude Code:

> "Launch the writing reviewer agent on ~/Documents/paper-draft.md"

Claude Code reads the agent file, starts a subprocess, passes the specified files, and returns the result to your main conversation.

You can launch multiple agents simultaneously:

> "Launch both the writing reviewer and methodology reviewer on this paper draft"

They run in parallel and return independent assessments.

---

## Design Guidance

| Scenario | Use | Why |
|----------|-----|-----|
| Reviewing your own draft | Agent | Avoids self-bias |
| Multi-step workflow with decisions | Skill | Needs user interaction |
| Parallel evaluations | Multiple agents | Independent fresh contexts |
| Task needs conversation history | Skill | Agent doesn't see prior context |
| Heavy task that would bloat context | Agent | Keeps main conversation lean |
| One-time setup or configuration | Skill | Needs to read/write files and ask questions |

For a more detailed decision framework with additional examples, see the [Agents vs Skills Decision Guide](downloads/agents-vs-skills-guide.md) (February 2026).
