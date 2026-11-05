# Use the starter kit's prompt skill

The standalone `prompt-refine` implementation is retired. There is one maintained [prompt skill](../../starter-kit-source/skills/prompt/SKILL.md), bundled in the [starter kit](../../README.md) for Claude Code and Codex.

- Prepare and execute: `/prompt` followed by your task.
- Prepare without executing: `/prompt Write a prompt for [task]. Don't run it.`
- Refine an existing prompt: `/prompt Refine this prompt: [prompt]`. Refinement returns the revised prompt by default; say “then run it” when you want execution too.

Use your app's installed skill selector if it adds a plugin prefix. Copying this notice does not install a skill. When migrating, preserve customizations and retire old same-named commands only with the user's direction. Do not install a second competing prompt implementation.
