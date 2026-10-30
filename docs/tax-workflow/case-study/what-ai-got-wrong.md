# What AI Got Wrong

This is the most important page in the case study. If you only read one page, read this one.

AI tools are good at structured data extraction, pattern matching, and organizing information. They are bad at context-dependent judgment, ambiguous categorization, and knowing what they don't know. Tax preparation requires all of these.

!!! warning "This is not tax advice"
    Educational content about AI workflow design. All examples use [fictional personas](the-workflow-overview.md#the-personas) with fictional amounts.

---

## Error Category 1: PDF Extraction Failures

!!! warning "PDF extraction transmits document contents to the API"
    When Claude reads a tax PDF, the full text — including any SSNs, EINs, and account numbers — is sent to Anthropic's API. See [Privacy & Setup](../before-you-start/privacy-and-setup.md) for mitigation options.

**What happened:** Claude reads tax document PDFs and extracts key figures — wages from W-2s, income from 1099s, interest from 1098s. Most of the time this works. Sometimes it doesn't.

**The pattern:** Scanned documents (images of paper forms rather than native PDFs) extract poorly. Some financial institutions generate PDFs with unusual layouts that confuse the extraction. Multi-page documents sometimes have figures pulled from the wrong page.

??? example "James's 1099-B extraction error"

    James received a consolidated 1099 from Vanguard covering his investment accounts and RSU vests from a prior employer. The multi-page PDF had separate sections for dividends (1099-DIV) and proceeds (1099-B). Claude extracted the cost basis from the wrong section — pulling the dividend total instead of the net proceeds figure.

    **How it was caught:** James verified the extracted amount against the original document, as the workflow requires after every extraction. The number didn't match the proceeds summary on the first page.

    **The fix:** James entered the correct amount manually. The skill's output template made this easy — he just corrected the one field.

    **Lesson:** PDF extraction is a convenience, not a source of truth. Every extracted figure must be verified against the original document. Multi-page consolidated statements are especially error-prone.

**How common:** Roughly 1 in 10 documents had some extraction issue. About half of those were minor (e.g., pulling a description field instead of an amount) and half were potentially significant (wrong dollar amount).

**The defense:** The workflow includes a verification step after every extraction. Extracted amounts are displayed alongside the document for human confirmation. This is not optional — it's a mandatory gate.

---

## Error Category 2: Missed Documents

**What happened:** The Gmail search found most tax documents, but not all.

**The pattern:**

- **Emails with generic subjects.** A consulting client sent the 1099-NEC as an attachment to an email with the subject "January update" — no mention of 1099, tax, or the tax year. The search didn't catch it.
- **Documents in spam or trash.** Gmail occasionally routes legitimate tax emails to spam, especially from automated tax systems at financial institutions.
- **Non-email documents.** Some institutions don't email tax documents at all — they only post them on their portal with an email notification that says "Your document is ready" without specifying what it is.

??? example "Elena's missed 1099-NEC"

    Elena's summer RA employer sent her 1099-NEC as an attachment to an email with the subject "Payment info for contractors." The search pattern `1099 OR 1098 OR W-2` didn't match. The broader payment confirmation search found the email but classified it as low-confidence.

    **How it was caught:** The income reconciliation step compared this year's known payers against last year's. The summer employer appeared last year but not this year, triggering a flag.

    **Lesson:** Email search is necessary but not sufficient. The income reconciliation step — comparing against prior-year payers — is the real safety net.

**How common:** One document was completely missed in the initial scan. Two others were caught but classified as low-confidence and nearly skipped.

**The defense:** The income reconciliation helper, which compares this year's documented payers against prior years, caught the gap. This is why the collection skill includes that step.

---

## Error Category 3: Expense Categorization Mistakes

**What happened:** During the Schedule C guided interview, Claude suggested expense categories that were plausible but wrong.

**The pattern:**

- **Travel vs. employer-reimbursed travel.** Claude cannot distinguish between a consulting trip (deductible on Schedule C) and an employer-paid business trip (reimbursed, not deductible). Both look like "travel" in the conversation.
- **Supplies vs. equipment.** A $600 software subscription was categorized as "Supplies" (Line 22) when it should have been "Other Expenses" (Line 27a). The IRS distinction matters but isn't obvious from the description alone.
- **Meals classification.** Business meals are deductible at 50%. But a dinner during an employer-reimbursed trip is not deductible at all. Claude has no way to know which meals were reimbursed without being told.

??? example "James's travel double-counting"

    James took five business trips in 2025. Three were for his employer, Meridian Logistics (flights and hotel reimbursed through the company). Two were consulting trips he paid for himself. During the Schedule C expense interview, the skill prompted "Which trips were for consulting work?" James listed four of the five because he momentarily forgot which ones his employer had reimbursed.

    **How it was caught:** The three-year review flagged that Schedule C travel expenses were 180% higher than the prior year. James investigated and realized the double-counting.

    **Lesson:** The guided interview format helps — it prompts you to distinguish consulting vs. employer-reimbursed travel. But the human still has to answer correctly. The three-year review is the backstop.

**How common:** Two categorization suggestions were wrong in the James workflow. Both were caught during review.

**The defense:** The guided interview explicitly asks about the consulting vs. employer-reimbursed distinction for travel. The three-year comparison flags unusual changes. But ultimately, you have to know your own expenses.

---

## Error Category 4: Medical Expense Misclassification

**What happened:** The credit card CSV processing uses keyword matching to classify medical vs. non-medical transactions. Keywords are imperfect.

**The pattern:**

- **False positives:** "Family Institute" matched as therapy (qualifying) — but one of the charges was for a parenting workshop (non-qualifying). Same vendor, different services.
- **False negatives:** A specialist's practice name ("Skin Solutions") didn't match any medical keywords and was initially classified as "uncertain."
- **Ambiguous vendors:** "Walgreens" charges include both prescriptions (qualifying) and household goods (non-qualifying). The skill flags all Walgreens charges as qualifying by default, which is wrong for non-prescription purchases.

**How common:** About 15% of credit card transactions required manual review. Of the auto-classified transactions, roughly 5% were miscategorized.

**The defense:** The skill has a three-tier classification system: auto-qualify, auto-exclude, and uncertain. The "uncertain" bucket gets presented for human review. But some items that *should* be uncertain get auto-classified confidently. The human verification step catches most of these — if you actually look at the line items.

---

## Error Category 5: Numbers Claude Made Up

**What happened:** In two instances during the workflow, Claude presented dollar amounts that did not come from any source document.

**The pattern:** This is the most dangerous category. When Claude can't read a PDF clearly, it sometimes generates a plausible-looking number rather than saying "I couldn't read this." The number might be close to the real amount (suggesting partial extraction) or completely fabricated.

??? example "The phantom interest amount"

    During compilation, Claude reported mortgage interest from James's 1098 as $XX,XXX. The actual amount on the document was $XX,XXX — a difference of several hundred dollars. The number Claude reported was plausible (within the range of typical mortgage interest) but did not match the source document.

    **How it was caught:** James checked the extracted amount against his mortgage statement, which he does annually anyway.

    **Lesson:** Never trust an AI-extracted dollar amount without verifying it against the source document. "Plausible" is not the same as "correct."

**How common:** Two instances in the full workflow. Both were on documents with complex PDF formatting.

**The defense:** The verification step after every extraction is the primary defense. The three-year comparison is the secondary defense (a fabricated number is likely to differ from prior years). But the only real solution is human verification of every dollar amount.

---

## The Meta-Lesson

The five error categories share a common structure:

1. **AI does something plausible but wrong**
2. **The error is not self-evidently wrong** — it takes domain knowledge or source verification to catch it
3. **A review mechanism catches it** — either the immediate verification step or the three-year comparison

This means the workflow's safety depends entirely on the review steps being taken seriously. If you skip verification because "the AI usually gets it right," you will eventually file a return with errors.

**The uncomfortable truth:** AI makes tax *preparation* faster. It does not make tax preparation *easier*. You still need to understand your tax situation well enough to catch errors. The difference is that with AI, you're reviewing organized data instead of building it from scratch. Review is faster than construction — but only if you actually do it.

---

## Failure Modes That Didn't Happen (But Could)

These are risks the workflow is designed to prevent, but which remain possible:

| Risk | Prevention | Residual risk |
|------|-----------|---------------|
| Filing with wrong amounts | Mandatory verification after every extraction | User skips verification |
| Missing income (audit trigger) | Prior-year payer reconciliation | New income source with no prior-year reference |
| Claiming non-deductible expenses | Guided interview with explicit prompts | User answers incorrectly |
| SSNs, EINs, bank details in AI conversation | CLAUDE.md exclusion rules + pre-processing redaction | PDF extraction transmits full document text before rules can filter — [redact before processing](../before-you-start/privacy-and-setup.md) |
| Relying on AI for tax law interpretation | Workflow explicitly avoids tax advice | User asks follow-up questions and trusts answers |

The last row is particularly important. The skills are designed to organize and compile, not advise. But if you ask Claude "Is this deductible?" during a tax session, it will answer — and it might be wrong. The workflow deliberately avoids putting Claude in an advisory role, but the user can always override that by asking.

---

## What I'd Do Differently

If I were building this workflow again from scratch:

1. **Start with the three-year review, not document collection.** The review skill provides the most value per hour invested. Building it first would have caught errors earlier in the process.

2. **Build a stricter verification protocol.** Instead of "verify this looks right," the workflow should present extracted amounts alongside a screenshot or excerpt of the source document, forcing a direct comparison.

3. **Add a confidence score to every extraction.** Claude should report "high confidence" vs. "low confidence" for every extracted figure, based on PDF quality and format consistency. Low-confidence extractions should get additional scrutiny.

4. **Keep a running error log.** Every correction should be logged, creating a dataset for improving the next year's skill. Error patterns are stable — the same kinds of documents cause the same kinds of extraction failures year after year.

---

**Next:** [Architecture Patterns](../build-your-own/architecture-patterns.md) — transferable patterns for building your own workflows.

**Or:** [When to Get Help](../reference/when-to-get-help.md) — if this page convinced you to hire a professional.
