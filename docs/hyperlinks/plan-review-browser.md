# Stress-Test Any Plan with a Fresh AI Chat

<span class="badge-teal">No Claude Code required</span>

For the agent-based workflow, start with [Use councils](../starter-kit/occasional.md). This page describes a manual fresh-chat review when you cannot run independent agents.

---

## Why a fresh chat?

A useful way to challenge a plan is to give it a fresh read. Finish the draft in one conversation, then open a new chat with the plan, its goal, and its constraints. Ask the reviewer to identify weaknesses before suggesting a rewrite.

The new chat has less of the drafting conversation to follow. It doesn't eliminate bias, and memory or project instructions may still supply context. The reviewer can also make the same mistakes as the author. Treat the findings as claims to assess, not an independent guarantee.

---

## When this is worth doing

- Grant proposals and funding applications
- Project implementation plans
- Research designs and pre-analysis plans
- Hiring plans, restructurings, major purchases
- Any decision where the cost of a bad plan exceeds the 10 minutes this takes

**Skip for:** grocery lists, reversible decisions, plans you'll iterate on daily anyway.

---

## The method

**1. Finish your plan.** Get it to a state where you think it's ready — in any tool, on paper, wherever.

**2. Copy it with enough context.** Include: the goal, deadline, available resources, key constraints, stakeholders involved, and what success looks like. A 3-sentence sketch produces a shallow review. Aim for 200+ words with concrete steps.

**3. Open a new chat** in Claude.ai, ChatGPT, or any tool. Do not continue in the conversation where you built the plan.

**4. Paste the prompt below, then paste your plan** at the bottom where indicated.

**5. Read the critique, then iterate.** Fix critical issues first. Ask follow-up questions. For high-stakes plans, open *another* fresh chat and run a second review from a different angle.

---

## The prompt

Copy this into your fresh chat, then paste your plan at the bottom:

```text
You are an external reviewer, not a collaborator. Your job is to find
problems, not to encourage.

Stress-test this plan. For each issue, point to the specific step or
sentence that triggered your concern. Classify each finding as:
- MUST FIX — will likely cause failure or major rework if not addressed
- WORTH CONSIDERING — creates risk, but the plan can proceed if you
  decide consciously to accept it

Find:
1. The top 3 ways this plan could fail — work backward from failure
2. What's missing that someone experienced in this domain would expect
   (stakeholders, dependencies, resources, sequencing issues)
3. What assumptions or timelines look unrealistic — and what evidence
   would confirm or refute them
4. What should change before proceeding

If domain-specific best practices matter and search is available,
check them and cite what you find. Otherwise state what still needs
checking. Do not imply you verified something you could not check.

Do not rewrite the plan. Diagnose first.

End with a verdict: PROCEED or REVISE FIRST.

THE PLAN:
[paste here]
```

!!! tip "Match the effort to the plan"
    For a complicated plan, try a capable reasoning option if your tool offers one. The model and prompt can help you find problems; you still need to judge whether the findings are valid.

---

## What to do with the output

**If the verdict is REVISE FIRST:** Address the "Must Fix" items. Then ask: *"Here's my revised plan addressing your concerns. Review it again."*

**If the verdict is PROCEED:** Scan the "Worth Considering" items. Decide consciously which risks you're accepting and which are worth a quick fix.

**For high-stakes plans** (grants, major hires, large budgets): Open a second fresh chat with a modified role — *"Review this plan as a [budget analyst / regulatory expert / field operations manager]."* Different personas catch different blind spots. For maximum independence, use separate conversations rather than asking for multiple personas in one chat.

!!! tip "For higher stakes, scale your critics"
    For a more structured agent workflow, [use a council](../starter-kit/occasional.md) to collect separate reviews and synthesize their findings. More reviewers still need someone to check the evidence and make the decision.

---

## Common mistakes

**Only reviewing in the drafting conversation.** A new chat can help you examine the plan with less of the earlier discussion shaping the response. Supply enough context for a fair review.

**Trusting the verdict without reading the findings.** The classification is a starting point. Read each finding and decide for yourself whether it applies to your situation. AI reviewers can be overconfident about risks that don't apply to your context ([ScienceDirect, 2025](https://www.sciencedirect.com/science/article/pii/S1071581925002149)).

**Using a plan that's too vague.** A 3-sentence sketch gets a 3-sentence review. Include concrete steps, timelines, resources, and constraints.

**Adopting the AI's revision wholesale.** When you ask for a revised plan, the model produces something plausible and polished. Resist adopting it without thinking. The revision is a starting point, not a replacement for your judgment ([PMC, 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10546443/)).

---

## Save this for repeat use

If you review plans regularly, save the prompt as a persistent project instead of pasting it each time.

### Claude.ai Project

Create a project called **Plan Reviewer** and save the review prompt in its instructions. Add relevant reference material only where it is permitted. Start a new conversation for each plan, and provide the current goal and constraints. Check the project's memory settings if you want to limit context from earlier chats. [Claude project controls](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects).

### ChatGPT Project {: #chatgpt-custom-gpt }

Create a project called **Plan Reviewer** and put the prompt in its project instructions. Start a new chat for each plan and attach the relevant sources. Project memory and instructions can influence new chats, so review what context the project contains. [ChatGPT project controls](https://help.openai.com/en/articles/10169521-projects-in-chatgpt).

If projects aren't available in your approved tool, keep the prompt in a text file and paste it into a fresh chat. You don't need to publish or share a custom assistant to use this method.

### Tips for both

- **Start a new conversation** for each plan, with its current constraints and sources
- Keep a versioned copy of your instructions in a local text file with dates and change notes
- Test with one plan you know is solid and one you know has problems before sharing with colleagues

---

??? info "Sources and references"

    - [Extended Thinking — Anthropic](https://www.anthropic.com/news/visible-extended-thinking) — How extended thinking works in Claude models: deeper reasoning before responding, improving critical analysis.
    - [AI Personas Considered Harmful? — ScienceDirect](https://www.sciencedirect.com/science/article/pii/S1071581925002149) — Research on automation bias: users over-trust AI output, especially when it's well-formatted and confident.
    - [Mitigating Bias in AI — PMC/NIH](https://pmc.ncbi.nlm.nih.gov/articles/PMC10546443/) — AI bias patterns and the importance of human-in-the-loop validation.
    - [Prompting Best Practices — Anthropic API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) — Calm, specific directives outperform aggressive language; give permission to express uncertainty.
    - [Reasoning Best Practices — OpenAI API Docs](https://developers.openai.com/api/docs/guides/reasoning-best-practices/) — How o-series models handle reasoning: keep prompts problem-focused, avoid over-prompting.
    - [How Can I Create and Manage Projects? — Claude Help Center](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects) — Creating Projects, setting custom instructions, sharing with teams.
    - [Creating a GPT — OpenAI Help Center](https://help.openai.com/en/articles/8554397-creating-a-gpt) — Building Custom GPTs: Configure tab, instructions, capabilities, publishing.

*Current as of March 2026. Model names and capabilities change frequently.*
