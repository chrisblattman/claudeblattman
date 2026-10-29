---
name: done
description: Migration notice for the former standalone done command. Use the shared starter-kit done workflow.
---

# Use the starter-kit workflow

This standalone reference has been retired to avoid conflicting behavior. The maintained workflow is `done` in the shared Starter Kit for Claude Code and Codex: `starter-kit-source/skills/done/SKILL.md` in the repository, generated into each host package.

If the starter kit is installed, read and follow its installed `done/SKILL.md` and bundled references for this request. Do not recursively invoke this legacy command. If it is missing, explain that this download alone is not the workflow and point to the repository installation guide. Do not invent the missing implementation or fetch and execute a remote skill automatically.

Preserve existing user customizations. Removing this old standalone command requires the user's direction.
