# Try Aniket Me

Aniket Me suggests ways to improve how you work with AI. It applies public advice from Aniket Panjwani to the work and context you give it. This is an independent adaptation, not Aniket himself or an endorsement by him.

This pilot contains one skill. The October 30 revision, package version **0.3.0-dev.1**, puts more emphasis on clear actions, the work you already do, and whether a suggested change adds anything useful. Its source notes include more examples. These changes have been checked with synthetic tasks; their benefit in real work is still being tested.

You do not need the rest of the starter kit, an existing skill library, or a particular level of AI experience. The bundled source notes identify the originals and their dates. They are a starting set, not a continuously updated archive.

## Give your agent this link

Open a project in Claude Code or Codex and send:

> Read https://github.com/chrisblattman/claudeblattman/blob/aniket-me-pilot/starter-kit-source/ANIKET-PILOT.md and install Aniket Me for this project. If it is already installed, back up that copy and update it to this pilot revision, preserving any local customizations for comparison. Then help me try it on my work.

Both apps use the same skill. The installing agent should read [SKILL.md](skills/aniket-me/SKILL.md) and [references/sources.md](skills/aniket-me/references/sources.md), then copy both files with that relative layout into the appropriate directory below. Use the `aniket-me-pilot` branch, or pin its current commit and use that same commit for both files. Record the commit used so feedback can identify the version. These two Markdown files are the complete skill. No other starter-kit skills, scripts, plugins or global instructions need installing.

If downloading from a GitHub page fails, fetch the files from `https://raw.githubusercontent.com/chrisblattman/claudeblattman/aniket-me-pilot/starter-kit-source/skills/aniket-me/` using the same relative filenames. A zip is also available from the repository's local build process, but it is optional.

## Local installation details

| App | Copy the folder to |
| --- | --- |
| Claude Code | `<your-project>/.claude/skills/aniket-me/` |
| Codex | `<your-project>/.agents/skills/aniket-me/` |

For an update, save the existing folder outside the active skill directories before replacing it. Compare any local customizations and preserve them in that backup rather than silently discarding them. Replace both `SKILL.md` and `references/sources.md` from the same new commit; keeping the old files is not an update. Record that commit and check that both installed files match it. Check for another same-named skill that could take precedence. Start a fresh session in that project. Verify that the app lists `aniket-me` and reads the intended copy and its source notes. In Claude Code, invoke `/aniket-me`. In Codex, select it from the skill picker or use `$aniket-me`. Then describe the work you want help with.

If you use an ordinary chat app, attach `SKILL.md` and `references/sources.md` and ask it to follow the attached skill for this conversation. This tries the advice without installing a persistent skill. The agent can only use the work you make available in that chat. CloudBot and other host-specific installation routes have not been tested.

The local paths above follow the [Codex skill documentation](https://learn.chatgpt.com/docs/build-skills) and [Claude Code skill documentation](https://code.claude.com/docs/en/skills), checked October 24, 2026. App versions and cloud sessions can load skills differently.

## Try it on work you already have

Use a real task or recurring annoyance this week. Start a request with **Aniket me**, then describe it in your own words and provide relevant context. For example:

> Aniket me. I keep explaining the same project decisions when I start a new chat. Here is how I currently keep notes. What would you change?

Choose your own problem. A useful answer might propose one change, refine a practice you already use, or explain why leaving it alone makes sense. You can also try a bare “Aniket me” in a conversation that already contains your work. In a new or nearly empty conversation, the agent may need an example of what you do or where you get stuck. An installed skill cannot supply work history that the agent has not seen.

If a suggestion seems worthwhile, try it once during your normal work and note what happened. Advice that sounds good and advice that helps are different observations. There is no need to rebuild your setup for the pilot.

## Send back a short note

Reply to the person who invited you. Include whatever you can answer:

- Your app/model and the GitHub commit used, or package version from `PACKAGE.json` if you used an archive. Did installation or finding the skill cause trouble?
- What you asked, and what context the agent could actually see.
- How familiar you were with that workflow and what you were already doing or planning.
- Its main recommendation. Was it useful, familiar, irrelevant, or wrong? A short excerpt helps.
- Whether you tried it, what changed, and whether the effort was worth it. “Not tried yet” is useful too.
- Anything that felt burdensome or that you wanted it to do differently.

Share only material you are comfortable sharing. A short description or redacted excerpt is enough. Avoid putting private work in public GitHub issues. Report a useful no-change answer or an installation failure as readily as an improvement.

To stop using the project copy, move the `aniket-me` folder out of the app's skill directory and restart the session. If you had a previous version, restore that preserved copy.
