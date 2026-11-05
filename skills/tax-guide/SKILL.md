---
name: tax-guide
description: "Run a guided tax-preparation questionnaire and create a document checklist and preparation plan."
---

# /tax-guide — Personalized Tax Prep Guide

A guided Q&A that assesses your tax situation and generates a personalized preparation plan. Outputs a recommendation (self-file, self-file with care, or hire a professional), a document checklist, a suggested workflow, and privacy guidance.

---

## Phased Execution

### Phase 0: Pre-checks

Before starting the Q&A, verify the environment:

1. Confirm Claude Code is running (you're reading this, so it is)
2. Check if a prior `/tax-guide` output exists in the working directory — if so, note it and offer to update rather than re-run
3. Set the tax year to the most recent completed calendar year (e.g., if today is in 2026, the tax year is 2025)

---

### Phase 1: Collect — The Q&A

Ask each question one at a time. Wait for the user's response before proceeding. Keep the tone conversational and concise.

**Question 1: Primary income**
> What's your primary income source?
> - (a) W-2 salary only — one employer
> - (b) W-2 salary + side income (consulting, freelance, gig work)
> - (c) Fully self-employed / independent contractor
> - (d) Multiple income types (salary + rental + investment + other)

Store as `income_type`.

**Question 2: 1099 forms**
> How many 1099 forms do you expect to receive this year? (1099-NEC, 1099-MISC, 1099-K, etc.)
> - (a) None
> - (b) 1-2
> - (c) 3 or more

Store as `num_1099s`.

**Question 3: Itemized deductions**
> Do you itemize deductions (or are you unsure)?
> - (a) Yes, I itemize
> - (b) No, I take the standard deduction
> - (c) Not sure

If answer is (c), provide a one-sentence explanation: "You itemize if your mortgage interest + state/local taxes + charitable giving + medical expenses exceed the standard deduction. The standard deduction changes annually — check IRS.gov for the current year's amounts. Most homeowners with a mortgage itemize."

Store as `itemize_status`.

**Question 4: Complexity flags**
> Do any of these apply to you? (Select all that apply, or "none")
> - Foreign income (work, consulting, or investments abroad)
> - Rental property
> - K-1 from a partnership, S-corp, or trust
> - Stock options (ISOs, NSOs) or significant RSU vests
> - Cryptocurrency beyond simple buy/sell
> - None of the above

Store as `complexity_flags[]`.

**Question 5: Prior filing method**
> How did you file last year?
> - (a) Tax software myself (TurboTax, FreeTaxUSA, H&R Block, etc.)
> - (b) CPA or tax preparer
> - (c) This is my first year filing (or first complex return)

Store as `prior_method`.

**Question 6: AI comfort level**
> How comfortable are you with Claude Code?
> - (a) New to it — just installed or exploring
> - (b) Have it set up, used it for a few things
> - (c) Power user — I build skills and use MCP integrations

Store as `ai_comfort`.

**Question 7: Gmail MCP**
> Do you have Gmail MCP configured in Claude Code?
> - (a) Yes
> - (b) No
> - (c) What's that?

If answer is (c), briefly explain: "Gmail MCP lets Claude Code search and read your email. The tax document collection skill uses it to find W-2s, 1099s, and other tax documents in your inbox automatically. It's optional — you can still use the workflow without it, you'll just collect documents manually."

Store as `gmail_mcp`.

**Question 8: Goal**
> What's your main goal right now?
> - (a) Organize my tax documents before I start filing
> - (b) File my own taxes start to finish
> - (c) Prepare organized materials for my CPA
> - (d) Just exploring — want to understand what's possible

Store as `goal`.

---

### Phase 2: Process — Routing Logic

Apply these rules to generate the recommendation:

**Recommendation: Hire a professional**
- ANY complexity flag is checked (foreign income, rental property, K-1, stock options, crypto), OR
- `income_type` is (d) multiple types AND `num_1099s` is (c) 3+

**Recommendation: Self-file with care**
- `income_type` is (b) W-2 + side income, OR
- `num_1099s` is (b) 1-2, OR
- `itemize_status` is (a) yes AND `prior_method` is (c) first time

**Recommendation: Self-file**
- `income_type` is (a) W-2 only, AND
- `num_1099s` is (a) none, AND
- No complexity flags

(If rules conflict, use the higher-risk recommendation.)

**Document checklist mapping:**

| If the user has... | Collect these |
|---|---|
| W-2 salary | W-2 from employer(s) |
| Side consulting / 1099-NEC | 1099-NEC from each client, business expense receipts |
| Investments | 1099-DIV, 1099-B, 1099-INT from each institution |
| RSU vests | 1099-B + supplemental stock plan statement |
| Foreign income (complexity flag) | Foreign income documents, foreign tax statements, Form 2555/1116 info for CPA |
| Rental property (complexity flag) | Rent received records, all property expenses, insurance, prior-year depreciation schedule |
| K-1 (complexity flag) | Schedule K-1 from partnership/S-corp/trust (often arrives late — March or April) |
| Stock options (complexity flag) | Exercise statements, Form 3921 (ISO) or Form 3922 (ESPP), cost basis records |
| Mortgage (itemizer) | 1098 from lender |
| Charitable giving (itemizer) | Donation receipts, tracking spreadsheet |
| Medical expenses (itemizer) | Credit card statements, insurance EOBs, pharmacy receipts |
| Childcare | Provider receipts, FSA statements |
| Student loans | 1098-E |
| Property tax (itemizer) | Tax bill from county assessor |
| CPA or professional filing | Prior-year tax return (CPA needs it for carryforwards, depreciation, history) |

Include rows that match the user's answers: income type, complexity flags, itemize status, and goal.

**Workflow mapping:**

| Situation | Relevant skills & pages |
|---|---|
| Any filing | [Privacy & Setup](https://claudeblattman.com/tax-workflow/before-you-start/privacy-and-setup/) |
| Gmail MCP available | `/tax-collect` skill for automated document collection |
| No Gmail MCP | Manual document collection using the checklist |
| Schedule C needed (side income) | `/tax-compile schedule-c` for guided expense compilation |
| Itemized deductions (self-filer) | `/tax-compile charitable`, `/tax-compile medical` |
| Self-filing (not CPA) | [What AI Got Wrong](https://claudeblattman.com/tax-workflow/case-study/what-ai-got-wrong/) — read before filing |
| CPA prep OR complexity flags | [When to Get Help](https://claudeblattman.com/tax-workflow/reference/when-to-get-help/) — includes "How to Use AI Tools When You Have a Professional" |
| New to Claude Code | [Essentials](https://claudeblattman.com/essentials/), [How Skills Work](https://claudeblattman.com/toolkit/skills-guide/) |
| Power user (ai_comfort = c) | [Architecture Patterns](https://claudeblattman.com/tax-workflow/build-your-own/architecture-patterns/), [Starter Templates](https://claudeblattman.com/tax-workflow/build-your-own/starter-templates/) |

Only include rows that match the user's answers. If goal is (c) CPA prep, do NOT include "What AI Got Wrong" or self-filing workflow steps.

**Privacy mapping:**

| Tool | What data it touches | User's status |
|---|---|---|
| Gmail MCP | Email subjects, sender names, attachment contents | Based on Q7: Available / Not configured |
| Google Sheets MCP | Spreadsheet contents (charitable tracker) | Not asked — default to "check your config if using /tax-compile charitable" |
| Local file processing | Credit card CSVs, PDFs on your machine | Always available |
| Claude conversation | Everything you type or paste | Always active — never paste SSNs or bank account numbers |

---

### Phase 3: Report — Personalized Output

Generate a report with this structure and display it inline:

```
══════════════════════════════════════════════════════════
YOUR TAX PREP GUIDE — [TAX YEAR]
══════════════════════════════════════════════════════════

1. RECOMMENDATION
─────────────────
[Self-file / Self-file with care / Hire a professional]

[2-3 sentence reasoning based on their specific answers.
Reference which factors drove the recommendation.]

2. YOUR DOCUMENT CHECKLIST
──────────────────────────
Based on your income and deductions, collect these:

  [ ] [Document] — [Where to find it]
  [ ] [Document] — [Where to find it]
  ...

3. SUGGESTED WORKFLOW
─────────────────────
Based on your setup and goals, here's your path:

  Step 1: [Action] — [Link to relevant page/skill]
  Step 2: [Action] — [Link to relevant page/skill]
  ...

4. PRIVACY NOTES
────────────────
Based on your tools:

  [Tool]: [What it sees] — [Status]
  ...

  NEVER share with any AI tool: SSNs, bank account numbers,
  or routing numbers. See Privacy & Setup for full guidance.

══════════════════════════════════════════════════════════
```

After displaying the report, ask: "Want me to save this to a file? (I'll write it to `tax-guide-output.md` in your current directory.)"

If yes, write the report to `tax-guide-output.md`.

---

## Design Notes

- **No MCP required.** This skill runs on any Claude Code installation. Gmail and Sheets MCPs enhance the workflow but are not prerequisites.
- **No real data collected.** The Q&A asks about categories, not specific amounts or account numbers.
- **Idempotent.** Running again with different answers produces a different report. Prior outputs don't affect new runs.
- **Not tax advice.** The recommendation is about workflow complexity, not legal guidance. The skill does not interpret tax law.
