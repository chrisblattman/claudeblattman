# Skill Refresh

Bring a skill and an example of what went wrong. Skill Refresh helps you diagnose the problem, make a focused repair, and check if it works on another case.

## Install for a project

Give Claude Code or Codex this instruction:

> Read https://github.com/chrisblattman/claudeblattman/blob/main/skills/skill-refresh/README.md and install Skill Refresh for this project. If I already have it, preserve my current copy and check which version the app will load.

Copy [SKILL.md](SKILL.md) to the following destination. This public beta is a standalone skill with no other package required.

| App | Destination inside your project |
| --- | --- |
| Claude Code | `.claude/skills/skill-refresh/SKILL.md` |
| Codex | `.agents/skills/skill-refresh/SKILL.md` |

Start a fresh session in that project. In Claude Code, invoke `/skill-refresh`. In Codex, select the skill or invoke `$skill-refresh`.

If your app asks to write into its skills folder, check the path before approving. You can also ask it to prepare the file in a regular project folder and copy it into place yourself.

## Try it on your own work

> Refresh my meeting-brief skill. It turned a suggested date into a deadline. Keep the format I like, fix how it handles dates, and give me different notes to try in a fresh session.

[Read the guide to fixing and updating skills](https://claudeblattman.com/workflows/maintain-skills/).
