---
description: Save the instructions for a routine with Skill Build, update them with Skill Refresh, and review the skills you use.
---

# Build and improve your skills { #turn-repeatable-workflows-into-skills }

I get my AI to do something the way I want, then find myself explaining it again a week later. A skill saves those instructions for next time.

[Install Skill Build](https://github.com/chrisblattman/claudeblattman/blob/main/skills/skill-build/README.md) · [Install Skill Refresh](https://github.com/chrisblattman/claudeblattman/blob/main/skills/skill-refresh/README.md). Both are betas for Claude Code and Codex.

## Build a skill { #the-development-lifecycle }

I'm training a skill to help me plan applications to the Institutional Review Board (IRB), look up requirements, flag issues, and write first drafts. The skill saves how I want to work through an application. Each study's details stay in its project.

Another example is [Aniket Me](https://github.com/chrisblattman/claudeblattman/blob/main/skills/aniket-me/README.md), which applies Aniket's AI advice to my work. I gave Skill Build the advice I'd collected and the decisions I'd already made about how to use it.

Show Skill Build an example and any corrections you made. Then try the skill on a second task in a fresh session.

<label class="page-done"><input type="checkbox"> I built a skill!</label>

## Refresh a skill { #refresh-a-skill }

I use [Check-in](../workflows/manage-email.md#4-sit-down-for-your-check-in) to manage email. I've changed how it handles older newsletters. Over time, I'd like it to help me create new filters and handle mail from more than one inbox.

I run Skill Refresh on a specific skill when I have a mistake to fix or something new I want it to do. It helps me work out what to change and test the result. It checks the docs when tools change, and I can ask it to look for better ways to design the skill.

## Review your skills periodically { #audit-your-skills }

Every so often I ask my agent which skills need attention.

```text
Look through my skills and give me a short list of what's worth fixing, combining, or retiring. Give me an example for each suggestion before you change anything.
```
