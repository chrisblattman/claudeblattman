---
description: Turn a routine that works into a reusable skill with Skill Build. Use Skill Refresh to make it better when something goes wrong.
---

# Build and refresh your skills { #turn-repeatable-workflows-into-skills }

I work something out with my AI, get a result I like, and then find myself giving it the same instructions a week later. So I built [Skill Build](https://github.com/chrisblattman/claudeblattman/blob/main/skills/skill-build/README.md) to help me save what I'd already taught it. I built [Skill Refresh](https://github.com/chrisblattman/claudeblattman/blob/main/skills/skill-refresh/README.md) for when I need to come back and fix it.

A skill is a short set of instructions your agent can load when you ask it to do a job. It can be as simple as one Markdown file in a folder. If the job is writing a meeting brief, the skill tells the agent which notes to read, what to pull out of them, and how I want to see it.

## Start from work you've already done { #the-development-lifecycle }

When I built [Aniket Me](https://github.com/chrisblattman/claudeblattman/tree/main/skills/aniket-me), I'd already collected Aniket's advice and worked out how I wanted to call the skill. I wanted the builder to pick up those decisions and get on with the job. If a choice was still open and would actually change the skill, I wanted it to ask me.

For a smaller example, say you've just edited a meeting brief. You moved decisions to the top. You asked for one owner per follow-up. That's the useful stuff to save. The name of the person who promised to book a room belongs in this project's notes.

Ask your agent while the example and corrections are still in the conversation:

```text
Use Skill Build to turn this into a skill for my future meeting briefs. Look at my edits and keep the instructions that will matter next time. Keep the details of this meeting in the project notes. Tell me how to try it on different notes in a fresh session.
```

If you're starting from an idea, give it a real example of the job and tell it what a good result would let you do. Sometimes a line in your project instructions will do the job. I ask the agent to help me decide.

## Try it before you rely on it

Open a fresh session and give the new skill a different set of notes. Can it get the decisions to the top and work out who owns each follow-up? Did you have to explain the same things all over again? I care about both. A good brief saves me less time if I still have to gather every file and direct every step.

For a skill I plan to rely on for consequential work, I might ask a fresh agent to read the instructions and try to find a serious problem. Then I try the skill on a real task. Reading the instructions helps me see what's missing. Trying the skill shows me what the agent actually does.

## When you need to change it

Say the brief now turns a suggested date into a deadline. Give Skill Refresh the notes, the bad output, and the skill it used. Ask it to find where the mistake came from, keep the format you liked, and check the fix on a second brief. There's a worked example in [Fix and update your skills](../workflows/maintain-skills.md).

## Install the skills

Both are standalone betas for Claude Code and Codex. Open the GitHub instructions and ask your agent to install the skill in the project where you want to try it. If you already have a copy, ask it to preserve it and check which one your app will load.

- [Install Skill Build](https://github.com/chrisblattman/claudeblattman/blob/main/skills/skill-build/README.md)
- [Install Skill Refresh](https://github.com/chrisblattman/claudeblattman/blob/main/skills/skill-refresh/README.md)

You can also try the meeting-brief prompt with the agent you already use. Leave out “Use Skill Build” and ask it to help you make the skill.

<details markdown="1">
<summary>Where the files go</summary>

A project-local skill goes in `.claude/skills/<name>/SKILL.md` for Claude Code or `.agents/skills/<name>/SKILL.md` for Codex. The file starts with a name and a short description of when the agent should use it. Keep any supporting files beside it and use relative links. The [Agent Skills specification](https://agentskills.io/specification) explains the format. For more involved skills, see [design patterns and examples](../hyperlinks/patterns.md).

Start a fresh session in the project after installing. Use `/skill-build` or `/skill-refresh` in Claude Code. In Codex, pick the skill or use `$skill-build` or `$skill-refresh`.

</details>

<label class="page-done"><input type="checkbox"> I built a skill!</label>
