---
name: proposal-write
description: "Draft funding proposals, letters of intent or project summaries from structured inputs and project context."
---

# Write Proposal
*v3.4 — Added donor intelligence context (meeting transcripts + Gmail) to Step 3*
*v3.x — Auto-loaded project context, donor profile lookup, template gate as the single hard stop*
*v3.0 — Restructured to Input Checklist → Auto-Gather Context → Donor Profile → Context Brief → Analyze → Draft*

Draft a funding proposal from structured inputs, using a project's voice pack, project context, and donor intelligence. Use when drafting funding proposals, LOIs, or project summaries for grant applications.

## Overview

This skill produces a first draft of a funding proposal in markdown. The flow: **Input Checklist → Auto-Gather Context → Donor Profile → Context Brief → Analyze & Plan → Draft → Save → Update Donor Profile → Log.**

The voice pack loads automatically. Context gathering runs automatically after the checklist to provide richer inputs without manual effort.

**Pre-approved tools:** Google Workspace MCP and filesystem reads. Call them directly — no Task agents.

## Voice Pack (Optional)

If you maintain a voice pack with your writing style:

```
@~/.claude-assistant/voice/PROPOSAL_VOICE.md
@~/.claude-assistant/voice/PROPOSAL_EXAMPLES.md
```

Create these files with your own writing style preferences: sentence length, active vs. passive voice, hedging rules, formatting conventions. If not found, the skill warns and continues with general academic voice rules.

## Instructions

### Step 1: Input Checklist (start here — this is the skill's primary value)

**Present this checklist immediately and collect all inputs before proceeding.** This catches missing documents early — the single most important thing this skill does.

```
PROPOSAL INPUT CHECKLIST

REQUIRED:
1. [ ] Funder name and program: ___
2. [ ] Application template / form fields / guidelines
      (Defines the structure. Without it, the draft may need restructuring.)
3. [ ] Research design document or project overview
4. [ ] Budget ceiling or range: ___
5. [ ] Deadline: ___

IF RESUBMISSION:
6. [ ] Previous submission file
7. [ ] Reviewer comments

RECOMMENDED:
8. [ ] Strategic framing notes (what to emphasize/downplay for this funder)

AUTO-LOADED (skill finds these automatically):
9.  [x] Team roster and roles (from project config)
10. [x] Project status and progress (from project config)
11. [x] Strategic priorities (from project config)
12. [x] Related proposals to other funders (auto-scanned for consistency)
13. [x] Donor profile (if available)
```

**For each missing REQUIRED item**, ask the user once. If they say "skip" or "don't have it," note the gap and proceed. Flag in the output what couldn't be addressed.

**For items provided as file paths**, read them immediately.

### Step 2: Auto-Gather Context

After collecting checklist inputs, automatically gather project context. Each source has a word budget to prevent context window bloat. **Total cap: ~8,000 words of gathered context.**

Skip this step if the user passes `skipcontext`.

| Source | What to read | Word budget | How to summarize |
|--------|-------------|-------------|-----------------|
| `.claude/CLAUDE.md` | Team, status, priorities | ~800 (full) | Keep full — it's config |
| Most recent weekly review | Latest weekly review file by date | ~1,500 | Extract: project status, funding pipeline, recent decisions, active deadlines |
| Prior submissions to this funder | Any matching `*[funder]*` file in your grants directory | ~2,000 per file (max 2 files) | Extract: framing, key arguments, budget figures, reviewer feedback if any |
| Consistency reference | 2 most recent `*_Draft.md` files to OTHER funders | ~500 total | Extract ONLY: key statistics, sample sizes, budget figures, intervention description (max 20 bullet points). Discard raw text. |
| Project Google Doc | Status section via Google Docs MCP | ~1,000 | Extract current status and funding tracker rows |
| Donor profile | See Step 3 | ~500 (full) | Keep full |

**Do NOT read raw transcripts.** The weekly review already synthesizes them. If the most recent weekly review is >14 days old, prompt: "The last weekly review is from [date]. Consider running `/weekly-review` first to ensure current context. Continue anyway? [Y/run weekly-review first]"

**Graceful degradation:** If any source is unavailable (no Google Doc configured, no prior submissions found, MCP fails), note it and continue. Never block on a missing optional source.

### Step 3: Donor Profile Lookup

1. Check for a donor profile at `~/.claude-assistant/donors/[funder-slug].md`
2. **If found:** Read it. Display "What They Value" and "What to Avoid" to the user. Check freshness — if `next_review_date` has passed, display: "Donor profile for [funder] may be outdated (last reviewed [date]). Proceeding with current info — consider running `/donor-profile [funder] refresh` after this session."
3. **If not found:** Display: "No donor profile found for [funder]. Run `/donor-profile [funder]` to create one, or continue without it." Flag the gap in the context brief.

Do NOT do web research mid-workflow. The `/donor-profile` skill handles that separately.

### Step 3b: Donor Interaction History (if profile found)

If a donor profile was found in Step 3, also search for recent interactions to add context:

1. **Meeting search:** If you have a meeting-notes integration (e.g., Granola), search by funder name. If results found, read the 1-2 most recent transcripts. Extract: key decisions, program officer guidance, framing feedback, any commitments made.
2. **Gmail search:** `search_gmail_messages` with query `"[funder name]" newer_than:180d`. Read top 2-3 relevant threads. Extract: correspondence, stated priorities, feedback, relationship signals.

Add findings to the Context Brief under a "Donor Interactions" row. This is passive context — display it, don't gate on it.

**If the profile is thin** (<50 lines or missing "What They Value" / "What to Avoid"): add one line to the Context Brief: "Note: [funder] profile is thin — consider `/donor-profile [funder] refresh` after this draft."

**Skip Step 3b if:** no profile found, `skipcontext` flag passed, or no meeting/email integrations available.

### Step 4: Context Brief

After gathering context, present a summary. Skip if the user passes `skipbrief` (but the template gate below still fires).

```
CONTEXT BRIEF

Sources gathered:
- Project config: [loaded/not found]
- Weekly review: [date] ([current/stale — last N days])
- Prior [funder] submission: [filename(s) or "none found"]
- Donor profile: [loaded (last reviewed [date]) / not found]
- Consistency ref: [filenames scanned / "none found"] ([N] bullets extracted)
- Google Doc: [loaded / unavailable]
- Donor interactions: [N transcripts, N email threads / skipped / none found]

Funder alignment (from donor profile, if available):
- Emphasize: [key points]
- Our angles: [specific project fit]
- Avoid: [key warnings]

Gaps that would improve the proposal:
1. [List anything missing that would strengthen the draft]
```

**TEMPLATE GATE (HARD STOP):** If no application template or RFP was provided in Step 1:

> "No application template or RFP provided. Without it, the draft structure may not match what the funder expects, requiring a full rewrite. Provide the template now, or type 'proceed without template' to continue at risk."

This is the single hard stop in the workflow. Everything else is informational.

### Step 5: Parse Arguments

Read `$ARGUMENTS` and conversation context for:
- Funder name (required)
- Whether this is a resubmission
- File paths to template, previous submission, reviewer comments
- Budget ceiling, deadline
- Voice variant (`voice:plain` or `voice:budget` — default: technical)
- `dryrun` — show plan and structure without drafting
- `skipcontext` — bypass auto-gather (Step 2)
- `skipbrief` — bypass context brief display (Step 4), but template gate still fires
- `profile:create` — redirect to `/donor-profile [funder]` instead of writing

### Step 6: Analyze and Plan

**If the user is in plan mode or enters plan mode:** This step happens naturally through plan mode. The skill complements plan mode — don't duplicate what plan mode already does. Focus on: mapping template sections to content, noting word/page limits, and identifying the 2-3 strongest arguments for this funder (informed by the donor profile).

**If NOT in plan mode**, do this analysis yourself:
1. Map the application template sections to available content
2. Identify gaps (write from scratch vs. adapt existing)
3. Note word/page limits
4. Identify the 2-3 strongest arguments for this specific funder

**For resubmissions**, show a brief reviewer analysis:

```
Reviewer Comment Analysis:

MUST ADDRESS (N):
1. [Comment] → Section: [X] → Plan: [fix]

SHOULD ADDRESS (N):
1. [Comment] → Section: [X] → Plan: [fix]

DISAGREE (N):
1. [Comment] → Reason: [why]

New evidence since last submission:
- [List]
```

Wait for user confirmation on the reviewer analysis before drafting. This is the one strategic alignment point worth pausing for.

### Step 7: Draft the Proposal

**Structure:** Follow the application template if provided. If no template, use:

```
1. Introduction and Background (problem -> gap -> contribution)
2. Methodology and Research Approach
   - Setting
   - Intervention
   - Research Design
   - Outcomes
3. Progress and Preliminary Results
4. Timeline
5. Budget Justification (if requested)
6. Team and Capacity
7. References
```

**Voice rules (enforced throughout):**
- First paragraph does real work: problem + stakes (with a number) -> what's new -> what this project does
- Topic sentences make claims, not background
- Numbers over adjectives ("43.6% report moderate-to-severe symptoms" not "many students")
- Active voice, short sentences
- No throat-clearing ("In this proposal...", "This section describes...")
- Hedge only with a reason or number
- Implementation details: who, what, when
- End sections with the ask or next step

**For resubmissions:**
- Address every MUST ADDRESS comment — improve the section directly, don't call out "the reviewer said..."
- Weave progress since last submission into the narrative
- Update the opening if the strategic framing changed

**Budget section (if applicable):**
- Cost-per-unit framing ("$30 per endline survey", "$3.50 per screening")
- Name specific cost drivers
- Link costs to outputs, not activities

### Step 8: Save and Brief

Save the draft to: `05_Submissions/Grants/[Funder]_[Year]_Draft.md`

File header:

```markdown
# [Full Proposal Title]
## DRAFT — [Date]

**PI:** [Name] ([Institution])
**Co-PIs:** [Names] ([Institutions])
**Total Budget:** [Amount or PLACEHOLDER]
**Proposed Period:** [Dates]
**Funder:** [Funder name and program]
**Deadline:** [Date]


## Revision Notes

**Draft created:** [date] by `/proposal-write`
**Context sources read:**
- Weekly review: [filename and date]
- Donor profile: [filename and version date]
- Prior submissions: [list files consulted]
- Google Doc: [yes/no]
- Consistency refs: [list files scanned]
**Inputs used:**
- [List all user-provided documents]
**Reviewer comments addressed:** [count] of [total] (if resubmission)
**Gaps / placeholders:**
- [List any PLACEHOLDER markers]
- [List sections needing human review]
**Voice:** [Technical / Plain-language / Budget narrative]
```

After saving, report:

```
Draft saved to: [filepath]

Sections: [list with approximate word counts]
Total: ~[N] words
Placeholders remaining: [count] — [list each with what's needed]
Reviewer comments addressed: [X of Y] (resubmission only)

Next steps:
1. Review and edit the draft
2. Fill in budget figures / placeholders
3. Run /proposal-revise with collaborator feedback
4. Run /review-methodology on the Methods section for design validation
5. Run /review-writing on the full draft for voice/clarity check
```

### Step 9: Update Donor Profile

After saving the draft, add a Submission History entry to the donor profile:
- Date: today
- Project: current project name
- Amount: budget amount from the draft
- Status: "Draft complete"
- Notes: brief note

Also update the donor profile's Quick Reference:
- "Last contact" → today's date
- "Next action" → "Review and submit [funder] proposal by [deadline]"

Then prompt: "Update the project's Funding Pipeline table too? [Y/n]"
If yes, read the project's PROJECT_INDEX.md and add/update the funder row with Status: "Drafting".

If no donor profile exists, skip this step (don't create one mid-workflow).

### Step 10: Performance Logging

Append a row to your skill-performance log (skip if log directory not found):

```
[date],write-proposal,[approx tool calls],[brief notes: funder, sources gathered, dryrun/full]
```

## Arguments

`$ARGUMENTS` — natural language is fine. Common flags:
- Funder name (required)
- `resubmission` — revision of previous submission
- `template:path` — application template file
- `previous:path` — previous submission file
- `comments:path` — reviewer comments file
- `budget:N` — budget ceiling in USD
- `deadline:YYYY-MM-DD`
- `voice:plain` or `voice:budget`
- `dryrun` — show plan without drafting
- `skipcontext` — bypass auto-gather context
- `skipbrief` — bypass context brief display
- `profile:create` — redirect to `/donor-profile [funder]`

## Examples

```
/proposal-write "Example Foundation" deadline:2026-06-01
/proposal-write "Impact Funder" template:~/Downloads/template.pdf budget:150000
/proposal-write "Foundation X" resubmission deadline:2026-02-19
/proposal-write "Foundation Y" voice:plain
/proposal-write "Foundation Z" dryrun
```

## Error Handling

- If no funder name: "Usage: /proposal-write <funder> [options]. Funder name is required."
- If no application template: **HARD STOP** — template gate fires (see Step 4)
- If project config missing: "No .claude/CLAUDE.md found. Run from a configured project directory, or provide project context manually."
- If voice pack files not found: Warn and continue with general voice rules
- If Google Doc MCP unavailable: Note and continue
- If weekly review stale (>14 days): Warn and offer to run `/weekly-review` first

---

## Customization Points

**To set up this skill for your workflow:**

1. **Voice pack location:** The `@~/.claude-assistant/voice/` references point to writing style files. Create your own with sentence length preferences, hedging rules, and formatting conventions, or remove these lines to use general academic voice.

2. **Folder paths** (Steps 2 and 8): The paths `05_Submissions/Grants/`, the weekly-reviews directory, and `~/.claude-assistant/donors/` reflect one folder naming convention. Update all paths to match your own project structure.

3. **Save location** (Step 8): Default `05_Submissions/Grants/[Funder]_[Year]_Draft.md` — change to your own drafts directory.

4. **Word budgets** (Step 2): The context-gathering word budgets (8,000 total) are calibrated for long proposals. For LOIs or short applications, reduce budgets proportionally.

5. **Donor interaction integrations** (Step 3b): The meeting-search step assumes a meeting-notes MCP. If you don't have one, the step skips silently. The Gmail search also degrades gracefully.
