# Aniket Me

Aniket Me suggests ways to improve how you work with AI. It applies Aniket Panjwani's public advice to the work and context you give it, with attention to what would add value to the practices you already use.

This is an independent adaptation, not Aniket himself or an endorsement by him. It works with Claude Code and Codex and includes its own source notes. You do not need a private research archive, other skills, or a particular level of AI experience.

## Install or update

Give Claude Code or Codex this instruction:

> Read https://github.com/chrisblattman/claudeblattman/blob/main/skills/aniket-me/README.md and install Aniket Me for this project. If it is already installed, back up the existing copy and update it, preserving local customizations for comparison.

The complete skill consists of [SKILL.md](SKILL.md) and [references/sources.md](references/sources.md). Copy both from the same commit on `main`, preserving their relative layout:

| App | Destination |
| --- | --- |
| Claude Code | `<your-project>/.claude/skills/aniket-me/` |
| Codex | `<your-project>/.agents/skills/aniket-me/` |

For direct downloads, use `https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/skills/aniket-me/` followed by each filename. Record the commit used. On updates, keep the previous copy outside active skill directories and check for another same-named installation that might take precedence.

Start a fresh session in that project and check that the app lists the skill and reads the intended copy. In Claude Code, invoke `/aniket-me`. In Codex, select it from the skill picker or use `$aniket-me`.

## Try it on your work

Start with **Aniket me**, then describe a recurring problem and provide relevant context. For example:

> Aniket me. I keep explaining the same project decisions when I start a new chat. Here is how I currently keep notes. What would you change?

You can also use a bare “Aniket me” in a conversation that already contains your work. A new conversation may need an example of what you do or where you get stuck. The skill cannot supply work history the agent has not seen.

A useful answer may suggest a small change, improve an existing practice, or explain why leaving it alone makes sense. If you try a suggestion, check whether it helps during your normal work.

The bundled notes identify public originals and their dates. They are a starting set, not a continuously updated archive. The agent should distinguish Aniket's documented advice from its own application to your work.

Updated October 31, 2026. Source notes last expanded October 30, 2026.
