---
hide:
  - navigation
  - toc
---
# Using Claude Code for Tax Season

*Claude Blattman — not quite a CPA.*

In a former life — for about six to twelve months during and after college — I was an auditor and then a tax accountant. I was not particularly good at it, and I hated every minute. But I learned enough to be dangerous: enough to do my own taxes, and enough, I think, to teach Claude Code how to take the painful pieces away.

This year I decided to use Claude Code for as much of my tax preparation as I could. I used it to assemble my charitable contributions from a sprawling Google Sheet, compile my itemized deductions from scattered receipts across email and credit card statements, and build a Schedule C for my consulting income. Some of it was still manual. I had to eyeball credit card statements to flag which charges were medical and which were childcare. But Claude Code is surprisingly good at the grunt work: sorting transactions, filtering by category, downloading and parsing CSV exports, and assembling it all into spreadsheets ready for tax software.

It also helped me think through some tax planning decisions — weighing different filing software, running a rough cost-benefit on whether hiring an accountant was worth it given how I value my time. What I did in about three hours, I would have had to pay an accountant $1,000 for.

The case study below uses fictional profiles to walk through the skills I built. AI tools in this space are moving fast — expect updated approaches next year.

---

!!! warning "This is not tax advice"
    Everything on these pages is educational content about AI workflow design. All dollar amounts are fictional. All examples use fictional personas. Nothing here constitutes tax, legal, or financial advice. Consult a qualified professional for your specific situation.

---

!!! tip "Don't want to read all this?"
    Two shortcuts:

    1. **Install `/tax-guide`** (below) and let it ask you 8 questions — it'll tell you exactly which parts apply to your situation.
    2. **Point Claude Code at this page.** Paste the URL `https://claudeblattman.com/tax-workflow/` into a Claude Code session and ask it to walk you through the workflow based on your tax situation. It can read the site, summarize the relevant parts, and help you decide what to do.

---

## Start Here

Install `/tax-guide` and answer 8 questions. You'll get a personalized plan: what documents to collect, whether to self-file or hire a professional, and which parts of this case study apply to you.

### Install /tax-guide

Copy [`tax-guide.md`](https://github.com/chrisblattman/claudeblattman/blob/main/skills/tax-guide.md) to your Claude Code commands directory:

```bash
cp tax-guide.md ~/.claude/commands/
```

Or create `~/.claude/commands/tax-guide.md` manually and paste the [skill file contents](https://github.com/chrisblattman/claudeblattman/blob/main/skills/tax-guide.md). Then type `/tax-guide` in Claude Code to start.

??? example "Sample output — W-2 + side consulting profile"

    ```
    ══════════════════════════════════════════════════════════
    YOUR TAX PREP GUIDE — 2025
    ══════════════════════════════════════════════════════════

    1. RECOMMENDATION
    ─────────────────
    Self-file with care

    You have a straightforward W-2 plus 1-2 consulting 1099s.
    This is manageable with tax software, but the Schedule C
    requires careful expense categorization. The three-year
    review step is especially important for your situation.

    2. YOUR DOCUMENT CHECKLIST
    ──────────────────────────
      [ ] W-2 — from your employer's HR portal
      [ ] 1099-NEC (×2) — from consulting clients, arriving by email
      [ ] 1098 — from your mortgage lender
      [ ] 1099-DIV, 1099-B — from your brokerage portal
      [ ] Charitable donation receipts or tracking spreadsheet
      [ ] Property tax bill — from county assessor website

    3. SUGGESTED WORKFLOW
    ─────────────────────
      Step 1: Read Privacy & Setup before handling any documents
      Step 2: Run /tax-collect to find documents in Gmail
      Step 3: Download portal documents manually (brokerage, etc.)
      Step 4: Run /tax-compile schedule-c for consulting expenses
      Step 5: Run /tax-compile charitable for donation summary
      Step 6: Run /tax-compile review for three-year comparison
      Step 7: Read What AI Got Wrong before entering data
      Step 8: Enter figures into tax software manually

    4. PRIVACY NOTES
    ────────────────
      Gmail MCP: Active — will search email subjects and attachments
      Local files: Stored on your machine, but contents are sent to
      Anthropic's API when Claude reads them
      Claude conversation: Never paste SSNs or bank account numbers

    ══════════════════════════════════════════════════════════
    ```

[:octicons-arrow-right-24: Or browse the case study directly](case-study/the-workflow-overview.md){ .md-button }

---

## Is This for You?

This case study is useful if **any** of these apply:

- You file your own taxes (or want to understand what your preparer does)
- You have a complicated return — consulting income, multiple 1099s, itemized deductions, investment accounts
- You want to learn how to build Claude Code skills for document-heavy workflows
- You're curious about where AI actually helps with sensitive personal tasks — and where it fails

You do **not** need to:

- Use Claude Code for your own taxes (many shouldn't — see [When to Get Help](reference/when-to-get-help.md))
- Know anything about tax law
- Have any prior Claude Code experience (though the [Build Your Own](build-your-own/architecture-patterns.md) section assumes familiarity with [skills](../setup/skill-reference.md))

---

## What You'll Find Here

<div class="grid cards" markdown>

-   **:material-shield-check-outline: Before You Start**

    ---

    Privacy decisions and data handling. Read this before processing any tax documents.

    [:octicons-arrow-right-24: Privacy & Setup](before-you-start/privacy-and-setup.md)

-   **:material-file-document-check-outline: The Case Study**

    ---

    The full workflow: how documents were collected, compiled, validated, and entered. What AI got wrong. Where human judgment was non-negotiable.

    [:octicons-arrow-right-24: Workflow Overview](case-study/the-workflow-overview.md)
    [:octicons-arrow-right-24: Document Collection](case-study/document-collection.md)
    [:octicons-arrow-right-24: Compilation & Review](case-study/compilation-and-review.md)
    [:octicons-arrow-right-24: What AI Got Wrong](case-study/what-ai-got-wrong.md)

-   **:material-wrench-outline: Build Your Own**

    ---

    Transferable patterns for building document-collection and compilation workflows. Starter templates you can adapt for non-tax use cases.

    [:octicons-arrow-right-24: Architecture Patterns](build-your-own/architecture-patterns.md)
    [:octicons-arrow-right-24: Starter Templates](build-your-own/starter-templates.md)

-   **:material-book-open-variant: Reference**

    ---

    Tax basics for academics, escalation criteria for when to hire a professional, and downloadable checklists.

    [:octicons-arrow-right-24: Academic Tax Basics](reference/academic-tax-basics.md)
    [:octicons-arrow-right-24: When to Get Help](reference/when-to-get-help.md)
    [:octicons-arrow-right-24: Downloads](../downloads/index.md#tax-workflow-resources)

</div>

---

## The Three-Sentence Version

I built two Claude Code skills: one that searches Gmail for tax documents, downloads attachments, extracts key figures, and tracks what's still missing; and another that compiles deductions from multiple sources into spreadsheets ready for data entry. A third-year review skill compares the current return against two prior years to catch anomalies. The skills saved real time — but the biggest value was catching errors I would have missed, and the biggest lesson was learning exactly where AI needs a human checking every output.

---

## How to Read This

**Fastest path:** Run `/tax-guide` (install above) — it will tell you exactly which pages to read.

**If you just want the story:** Read the [Workflow Overview](case-study/the-workflow-overview.md) and [What AI Got Wrong](case-study/what-ai-got-wrong.md). Skip the technical sections.

**If you want to build something similar:** Start with [Privacy & Setup](before-you-start/privacy-and-setup.md), then read the case study pages in order, then move to [Build Your Own](build-your-own/architecture-patterns.md).

**If you're an academic wondering about your own taxes:** Start with [Academic Tax Basics](reference/academic-tax-basics.md) and [When to Get Help](reference/when-to-get-help.md).
