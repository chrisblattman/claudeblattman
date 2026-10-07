---
hide:
  - navigation
  - toc
---
# How Claude Code Thinks

When you first launch Claude Code, you're in **Default mode** — the safest starting point. Claude proposes changes and waits for you to approve each one before it touches your files. As you get comfortable, you can change that.

---

## The Three Modes

| Mode | What Claude Does | What You See |
|------|-----------------|-------------|
| **Default** | Proposes edits as diffs. You confirm each one. | Normal prompt |
| **Plan Mode** | Explores and proposes — touches nothing. Reads files, suggests approaches. You decide. | `(plan)` label |
| **Auto-Accept** | Applies edits automatically without asking. | `⏵⏵ accept edits on` |

!!! warning "Accidentally in Auto-Accept?"
    If Claude started making changes without asking, look for the `⏵⏵` indicator. Press **Shift+Tab** until it disappears and you see the normal prompt. To undo changes: **Cmd+Z** (Mac) or **Ctrl+Z** (Windows) in VS Code.

---

## How to Switch

Press **Shift+Tab** to cycle through modes:

1. Press **Shift+Tab** once → Plan Mode
2. Press **Shift+Tab** again → Auto-Accept
3. Press **Shift+Tab** a third time → back to Default

You can also type `/plan` to jump to Plan mode directly.

---

## What Plan Mode Looks Like

Here's a concrete example:

> **You type:** "I want to reorganize my papers folder."
>
> **In Plan mode,** Claude responds with a detailed proposal — what it would move, rename, and why. Nothing has changed on disk. You read it, decide yes or no, then switch to Default or Auto-Accept to execute.

Plan mode is ideal for thinking through changes before committing to them. Claude can explore your files, research approaches, and draft a full plan — all without modifying anything.

---

## When to Use Each Mode

| Situation | Mode |
|-----------|------|
| "I want to understand what's in this project" | **Plan mode** — Claude reads and proposes without touching files |
| "Claude keeps asking me to approve small edits and I trust it" | **Auto-Accept** — edits apply immediately |
| "I want Claude to draft something but I want to review first" | **Default** — Claude proposes, you confirm |
| "I want Claude to explore options, then I'll decide" | **Plan mode**, then switch to Default to execute |

**Start in Default mode.** It's what you'll use most of the time. Switch to Plan mode when you want Claude to think without acting, and to Auto-Accept when you're doing trusted, routine work and the confirmation prompts slow you down.

---

## What's Next

Once you're comfortable with modes, see [Prompt, Plan, Review, Revise](../workflows/first-session-skills.md) for a workflow that puts Plan mode at the center — structuring your thinking, stress-testing plans with `/review-plan`, and capturing what you learned.
