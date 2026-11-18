# Skill Build

Save a routine after you and your agent have worked out how you want it done. Skill Build looks at what you corrected, turns the reusable parts into a skill, and gives you a different case to try.

## Install for a project

Give Claude Code or Codex this instruction:

> Read https://github.com/chrisblattman/claudeblattman/blob/main/skills/skill-build/README.md and install Skill Build for this project. If I already have it, preserve my current copy and check which version the app will load.

Copy [SKILL.md](SKILL.md) to the following destination. This public beta is a standalone skill with no other package required.

| App | Destination inside your project |
| --- | --- |
| Claude Code | `.claude/skills/skill-build/SKILL.md` |
| Codex | `.agents/skills/skill-build/SKILL.md` |

Start a fresh session in that project. In Claude Code, invoke `/skill-build`. In Codex, select the skill or invoke `$skill-build`.

If your app asks to write into its skills folder, check the path before approving. You can also ask it to prepare the file in a regular project folder and copy it into place yourself.

## Try it on your own work

> Build a skill from the meeting brief we just edited. Save how I want decisions and follow-up presented. Keep the details of this meeting in the project notes. Give me different notes to try in a fresh session.

[Read the guide to building a skill](https://claudeblattman.com/build-your-own/building-skills/).
