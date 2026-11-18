---
name: skill-build
description: Create a reusable agent skill from a recurring task, an established workflow, or work and corrections the user has just finished. Use when asked to build a skill or turn a routine into one. Use skill-refresh for a request to improve an existing skill.
---

# Build a skill

## Work out what is worth saving

Start with the task the user wants to repeat. Read the relevant project instructions, a representative example, and any previous attempts or corrections the user points to. Check whether an existing skill already handles the task. Use the evidence at hand and ask a focused question only if the missing answer would change the skill.

Work out what the user has taught the agent that would be useful next time. A persistent project instruction, a small script, or ordinary project work may be enough. Continue with a skill when a reader will benefit from instructions they can call up for a particular job. Keep facts about a single meeting, client, or deadline in the project record.

Honor the requested scope. A build request can authorize writing the new skill in the agreed location. A request for options, a review, or a plan calls for advice at that stage.

## Write the skill

- Confirm the skill's name, intended app, and location from the request or project conventions. For a new project-local skill, use `.claude/skills/<name>/` in Claude Code or `.agents/skills/<name>/` in Codex. For a different scope, check the app's installation instructions before writing. Look for an existing copy with the same name and preserve it unless the user requested a change to it.
- Give the skill a `SKILL.md` with YAML `name` and `description`. Say what it does and which requests should select it. Write instructions for performing the job, including the user's judgment, what inputs to read, what to produce, and how to tell if it worked.
- Preserve useful decisions and examples from the work. Use a short example when the distinction is easier to show than describe. Put supporting material alongside the skill and refer to it by relative path. Include a script only when it makes a repeatable operation more reliable. State material dependencies and what to do if they are unavailable.
- Make the usual request easy. Use the information already supplied before asking for more. Preserve the user's choices about review and changes with external effects. If the skill expects an optional app or another skill, give the user a clear way to proceed when it is missing.

## Check that it helps

Check the folder, frontmatter, and links. Give the user a fresh-session trial using a second input that exercises the important choice or correction. If requested and the app permits it, run that trial. Check which copy loaded and inspect what it produced. For a skill meant to save repeated explanation, also check whether the agent still asked for information it already had.

Report the skill's location, how to use it, what you actually tested, and anything still needed. Keep untested behavior explicit. A request to create a local skill does not authorize publishing it.
