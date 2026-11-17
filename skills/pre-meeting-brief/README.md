# Pre-meeting skill renamed

The public `pre-meeting-brief` skill is now [pre-meeting](../pre-meeting/SKILL.md). Install the complete `pre-meeting` folder and invoke `/pre-meeting` (or `$pre-meeting` in Codex).

It now mirrors `post-meeting`: an in-chat brief or summary plus an email draft by default; `nosend` skips the draft. Both draft by default and send only when the user explicitly asks after seeing the draft.

When upgrading, preserve customizations from an existing `pre-meeting-brief` skill or command, reconcile them with the new version, and move the retired copy outside active skill/command directories after checking the replacement. This folder is a migration notice, not an installable alias. Renaming the public source does not update installed copies automatically.
