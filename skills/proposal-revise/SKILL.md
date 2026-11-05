---
name: proposal-revise
description: "Apply reviewer or collaborator feedback to an existing proposal while maintaining its voice and project context."
---

# Revise Proposal
*v2.4 — Renamed from revise-proposal; noun-first grouping. Adds donor profile lookup and funder-conflict flagging during revision.*
*v2.x — Reviewer-comment categorization, voice-pack enforcement, automatic backup before save*

Apply reviewer, collaborator, or self-review comments to an existing proposal draft while maintaining voice consistency. Use when applying feedback to a proposal draft.

## Overview

This skill takes an existing proposal draft and feedback (dictated, typed, or from a file), applies the changes, and outputs an updated draft with a change summary. Designed for iterative revision — by you, collaborators, or co-PIs.

**The key value is the collaborator handoff:** A team member reads the draft, dictates or types all their feedback in one pass, and Claude extracts the actionable items and applies them. No one has to edit markdown directly.

**Pre-approved tools:** Google Workspace MCP and filesystem reads. Call them directly — no Task agents.

## Voice Pack (Optional)

If you maintain a voice pack:

```
@~/.claude-assistant/voice/PROPOSAL_VOICE.md
@~/.claude-assistant/voice/PROPOSAL_EXAMPLES.md
```

If not found, the skill warns and continues with general academic voice rules.

## Instructions

### Step 1: Find the Draft

Look for the draft in this order:
1. Path provided in `$ARGUMENTS` (first positional argument)
2. Most recent `*_Draft.md` in `05_Submissions/Grants/` — confirm with user: "Found [filename]. Use this? [Y/n]"
3. If not found: "Usage: /proposal-revise <draft-path> [feedback]"

Read the full draft. Parse the revision notes section (if present) to understand what inputs were used, what's already been addressed, and what placeholders remain.

Also read `.claude/CLAUDE.md` for project config.

### Step 1.5: Donor Profile Lookup

After finding the draft, identify the funder (from draft filename, header, or content):

1. Check for a donor profile at `~/.claude-assistant/donors/[funder-slug].md`
2. **If found:** Read it. Display "What They Value" and "What to Avoid" to the user. These inform revision decisions — especially when feedback conflicts with funder priorities.
3. **If not found:** Note: "No donor profile for [funder]. Proceeding without funder-specific guidance."

### Step 2: Collect Feedback

Feedback can come from any combination of these sources:

**Inline (dictated/typed).** The user provides comments directly after the command or in conversation. Dictated comments may be conversational — extract the actionable feedback. This is the most common workflow.

Example:
```
/proposal-revise 05_Submissions/Grants/Draft.md
Tighten the intro. The power calc section needs the new numbers.
Cut 200 words from methodology. Budget section needs cost-per-unit breakdowns.
```

**Comments file (`comments:path`).** Read the file. Accept any format — numbered list, free-form notes, bullet points, section annotations.

**Formal reviewer comments (`reviewer:path`).** Read the file and categorize each comment:
- **MUST ADDRESS** — factual errors, missing required content, fundamental concerns
- **SHOULD ADDRESS** — suggestions that improve the proposal
- **CONSIDER** — stylistic preferences or minor points
- **DISAGREE** — note the disagreement and reason; flag for user decision

Show the categorization and wait for confirmation before applying:
```
Reviewer Comment Analysis:

MUST ADDRESS (N):
1. [Comment] → Plan: [how to address]

SHOULD ADDRESS (N):
1. [Comment] → Plan: [how to address]

DISAGREE (N):
1. [Comment] → Reason: [why]

Proceed? [Y/n/edit]
```

**Funder conflict flagging:** When processing any feedback (inline, file, or reviewer), if a suggestion conflicts with the donor profile's "What They Value" or "What to Avoid," flag it:

> "Note: This suggestion may conflict with [funder]'s preference for [X from donor profile]. Applying as requested, but flagging for review."

**Note:** The categorization and confirmation gate apply ONLY to formal reviewer comments (`reviewer:path`). For inline feedback and comments files, proceed directly to revisions.

### Step 3: Apply Revisions

For each piece of feedback:

1. **Locate** the relevant section
2. **Revise** the text to address the comment
3. **Maintain voice** — every revision follows the voice pack:
   - Short sentences, active voice
   - Numbers over adjectives
   - Claims-first topic sentences
   - No throat-clearing or hedging without reason
4. **Preserve structure** — don't reorganize sections unless asked
5. **Track changes** — keep a running list of what changed and why

**Rules:**
- Don't rewrite sections that aren't commented on (no scope creep)
- If a comment requires new content, write it in voice
- If a comment contradicts the voice pack (e.g., "add more hedging"), follow the comment but flag it
- If filling a PLACEHOLDER, remove the marker and replace with real content
- If a comment is ambiguous, make your best interpretation and note it in the change summary

### Step 4: Backup, Save, and Report

**Backup first.** Before overwriting, copy the current draft to `[filename].bak`.

**Save** the updated draft to the same path. Update the revision notes:

```markdown
---
## Revision Notes

**Draft created:** [original date]
**Last revised:** [today] by `/proposal-revise`
**Revision round:** [increment]
**Changes this round:**
- [Brief list of major changes]
**Funder conflicts flagged:**
- [Any suggestions that conflicted with the donor profile, with notes]
**Gaps / placeholders:**
- [Updated list]
```

**Report:**
```
Draft updated: [filepath]
Backup saved: [filepath].bak

Changes made:
1. Section [X]: [What changed] — Reason: [comment ref]
...

Word count: [before] -> [after] ([+/- change])

Funder conflicts flagged: [count, if any]

Next steps:
1. Review changes in the draft
2. [If placeholders remain] Fill in: [list]
3. Run /review-writing for voice consistency check
```

## Arguments

`$ARGUMENTS`:
- Draft file path (first positional argument)
- `comments:path` — file with comments
- `reviewer:path` — formal reviewer comments (triggers categorization)
- `nodiff` — skip the change summary

## Examples

```
# Self-review
/proposal-revise 05_Submissions/Grants/Draft.md
Tighten the intro. Cut 200 words from methodology.

# Collaborator feedback from file
/proposal-revise Draft.md comments:~/Downloads/feedback.txt

# Formal reviewer comments
/proposal-revise Draft.md reviewer:~/Downloads/reviews.pdf
```

## Error Handling

- If draft not found: Check the default draft directory for alternatives, suggest closest match
- If voice pack not found: Continue with general voice rules
- If feedback is empty: Ask user to clarify
- If draft has no revision notes: Create from scratch
- If donor profile not found: Continue without funder-conflict flagging

---

## Customization Points

**To set up this skill for your workflow:**

1. **Voice pack location:** The `@~/.claude-assistant/voice/` references point to writing style files. Create your own voice pack with sentence length preferences, hedging rules, and formatting conventions, or remove these lines to use general academic voice.

2. **Default draft directory** (Step 1): The default search path `05_Submissions/Grants/` is one folder naming convention. Change this to match your own proposal directory — e.g., `~/Research/Proposals/` or `~/Grants/Active/`.

3. **Donor profiles** (Step 1.5): The `~/.claude-assistant/donors/` directory is optional. If you maintain funder profiles, update the path to match your structure. If not, the skill continues without funder-specific guidance.

4. **Example paths** in the Examples section also reference the default draft directory — update them to match your own structure.
