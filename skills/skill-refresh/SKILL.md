---
name: skill-refresh
description: Diagnose, update, simplify, or retest an existing agent skill using an observed failure, user correction, or changed tool. Use for a named skill repair or assessment. Use skill-build when the user wants a new skill from a routine.
---

# Refresh a skill

## Find the copy and the problem

Identify the skill the user means, the copy the app actually used, and the source the user can maintain. Check the whole skill folder and its supporting files before editing. If the user installed it from a plugin or shared library, check the supported customization or update route. Preserve same-named copies and individual changes.

Start with the failure or opportunity the user describes. Recover what was asked, what happened, what the user wanted, and what should keep working. Use a representative run, a correction, or a known good example when available. A request to assess or diagnose calls for findings. A clear request to fix the identified skill authorizes a bounded repair to that skill.

## Make the smallest useful change

Distinguish a missing dependency, a tool change, and an instruction problem. Check whether the agent followed the instructions it already had. For claims about a changed app or tool, check current documentation where it affects the repair. Keep an effective skill as it is when the evidence points elsewhere.

Preserve the existing skill's purpose and useful behavior. Back up the previous version or use version control before applying a change so the user can restore it. Edit the relevant instruction, reference, or helper and verify links between them. Avoid copying a fix into a different installed version by mistake. If a choice would materially change what the skill does, bring that choice to the user.

For a simple problem, work through the diagnosis directly. When independent review would help, offer it or use it if the user has asked for it and the app supports it.

## Test the repair

Start with the failure that motivated the refresh. Then use a different example that tests the same distinction and checks that the skill still handles normal cases. If the original issue is about tool access, verify the required action using an appropriate test. For a wording or judgment problem, inspect the new output.

When possible, try the revised skill in a fresh session and confirm which copy loaded. When a fresh run requires a separate session or unavailable connection, give the user the exact trial and say what remains untested. Report what changed, what evidence supports the repair, and how to undo it.
