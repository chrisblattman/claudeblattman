---
description: Adapt your AI workflow with connected apps, reusable instructions, skills, and council agents.
---

# Improve your AI setup

Give your AI a better place to work: organize the files and projects it needs, connect your apps, and save the instructions that make a useful routine repeatable.

If you are getting started, follow the [essentials checklist](../index.md#my-absolute-essentials-and-where-to-start). The [next-steps checklist](../starter-kit/two-month-plan.md) puts setup and customization into a suggested order.

| Guide | What it helps you do |
| --- | --- |
| [Organize cloud storage](cloud-storage-guide.md) | Bring order to files scattered across storage services |
| [Organize your projects](organize-projects.md) | Give each project a home the agent can navigate |
| [Connect your apps](../build-your-own/mcp-setup.md) | Give the agent access to the tools and sources the work needs |
| [Write persistent instructions](../build-your-own/agents-md.md) | Save context and preferences for future sessions |
| [Set rules and guidelines](../build-your-own/rules.md) | Make recurring expectations explicit |
| [Build and improve your skills](../build-your-own/building-skills.md) | Save a routine, update it, or review the skills you use |
| [Connect different agents](council-models.md) | Set up outside opinions across AI services |
| [Scout and curate new AI tips](../hyperlinks/continuous-improvement.md) | Collect useful ideas and decide which to adopt in your workflow |

For the walkthroughs, start with [Council and review](../starter-kit/occasional.md), then [Different AI models](council-models.md) and [Deep research](deep-research.md).

The guide to [coding rules](coding-rules.md) is not written yet.

## Useful outside skills

You don't have to build every useful skill yourself. These tools can help across projects. Follow the links to their authors' instructions, and choose the one that solves a problem you're having.

| Skill | When it helps | Where to find it |
| --- | --- | --- |
| **Recall** | Find a decision or useful answer in an earlier AI conversation saved on your computer. | [Our walkthrough](recall.md) · [arjunkmrm's original](https://github.com/arjunkmrm/recall) |
| **I Have ADHD** | Get answers that lead with the next action and break the work into manageable steps. | [ayghri's original](https://github.com/ayghri/i-have-adhd) · [How I use it](../hyperlinks/prompting.md) |
| **Grill Me** | Have the agent question a plan and help you work through decisions you haven't settled. | [Matt Pocock's skill](https://github.com/mattpocock/skills/tree/main/skills/productivity/grill-me) |

Ask your agent to help install the one you want:

```text
Read the instructions for [skill name and link]. Explain how it would help with [my task], then help me install it where I keep my other skills. Include any supporting files or other skills it needs. Preserve any changes I've made to an existing copy.
```

For Grill Me, that includes its companion skill, `grilling`. You don't need to install the author's entire collection.
