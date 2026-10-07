---
hide:
  - navigation
  - toc
---
# Agents vs Skills: When to Use Each

## What Are They?

### Skills (Slash Commands)
Skills are markdown files in `~/.claude/commands/` that extend Claude's behavior **within the main conversation**. When you type `/weekly-review`, Claude reads the skill file and follows its instructions in your current session.

- Run in the **main conversation context** (full access to conversation history)
- Defined as `.md` files with instructions Claude follows
- Can reference other files, call tools, and interact with you
- Best for: **workflows** that need your input along the way

### Agents (Subagents)
Agents are markdown files in `~/.claude/agents/` that run in **isolated context windows**. They're launched via the Task tool and operate independently, returning results when done.

- Run in a **separate context** (fresh eyes, no conversation bias)
- Defined as `.md` files with YAML frontmatter (name, model, tools, etc.)
- Can be restricted to specific tools (e.g., read-only)
- Return a single result message to the main conversation
- Best for: **review, QA, parallel evaluation, and specialized analysis**

## Key Differences

| Dimension | Skills | Agents |
|-----------|--------|--------|
| Context | Main conversation | Isolated (fresh) |
| Interaction | Back-and-forth with user | Autonomous, returns result |
| Memory | Sees full chat history | Only sees its own prompt |
| Tools | All tools available | Restricted by YAML config |
| Model | Uses current model | Can specify different model |
| Cost | No extra overhead | Separate context window |
| Parallelism | Sequential | Can run multiple in parallel |

## When to Use Skills

Use skills when the task is a **workflow that benefits from conversation context**:

- `/weekly-review` -- needs project config, user decisions at each step, iterative refinement
- `/triage-inbox` -- needs to show you emails and get your decisions
- `/prompt` -- needs to read your conversational input and format it
- `/todo-add` -- quick interaction that creates a reminder

**Pattern**: User triggers it, Claude works through steps, user provides input along the way.

## When to Use Agents

Use agents when the task benefits from **fresh perspective or parallel execution**:

- **Writing review** -- a separate context avoids self-bias (won't rationalize its own earlier choices)
- **Methodology check** -- independent evaluation of empirical claims
- **Parallel analysis** -- run writing + methodology review simultaneously on the same draft
- **Focused search** -- explore a codebase or file system without cluttering main context

**Pattern**: Claude (or user) launches it, agent works independently, returns structured feedback.

## Example Agents

### `review-writing`
- Reviews academic prose for clarity, argument structure, voice consistency
- Model: Sonnet (fast, good at style analysis)
- Tools: Read, Glob, Grep (read-only)
- Use: After drafting a section, get fresh-eyes feedback

### `review-methodology`
- Checks empirical claims, causal language, identification strategy, robustness
- Model: Sonnet
- Tools: Read, Glob, Grep (read-only)
- Use: Before submission, audit all causal claims and methodology discussion

## How to Use Agents

### From the command line
Agents appear in Claude Code's Task tool. You can ask Claude to use them:

```
"Run the review-writing agent on my latest draft section"
"Have the review-methodology agent check the identification section"
"Run both reviewers in parallel on the paper"
```

### Creating new agents
Create a `.md` file in `~/.claude/agents/` with YAML frontmatter:

```yaml
---
name: My Agent
description: What it does (shown in agent list)
model: sonnet  # or opus, haiku
tools:
  - Read
  - Glob
  - Grep
  # List only the tools the agent needs
---

# Agent Instructions

[Detailed instructions for the agent's task]
```

### Tips for effective agents
1. **Restrict tools** -- agents with fewer tools are more focused and cheaper
2. **Use Sonnet for review tasks** -- fast and good at analysis; save Opus for complex reasoning
3. **Structure the output format** -- tell the agent exactly how to format its response
4. **Run in parallel** -- launch multiple agents simultaneously for different review dimensions

## Practical Examples

### Draft Review (Parallel Agents)
After writing a paper section:
1. Launch `review-writing` on the section
2. Launch `review-methodology` on the section (simultaneously)
3. Both return structured feedback
4. Address findings in priority order

This gives you two independent perspectives without the main conversation biasing either review.

### Email Tone Check
Could create an `email-tone-checker` agent that:
- Reads draft against the three-tier email voice system
- Validates greeting, tone, closing match the recipient's tier
- Catches formality mismatches

### Proposal Quality Gate
Could create a `proposal-reviewer` agent that:
- Checks against PROPOSAL_VOICE.md guidelines
- Flags hedging without reasons, missing implementation details, vague adjectives
- Returns a prioritized list of improvements

## When NOT to Use Agents

- **Simple tasks** -- don't launch an agent for a 2-line edit
- **Tasks needing conversation context** -- agents can't see your earlier messages
- **Interactive workflows** -- agents can't ask you questions mid-task
- **Tasks requiring many tools** -- if the agent needs Gmail + Calendar + Docs + Drive, it's probably a skill

---

*Created: February 15, 2026*
