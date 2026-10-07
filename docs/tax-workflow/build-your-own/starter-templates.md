---
hide:
  - navigation
  - toc
---
# Starter Templates

Downloadable skill skeletons and templates you can adapt for your own document-collection and compilation workflows. These are generic — they use the [architecture patterns](architecture-patterns.md) from the tax workflow but are not tax-specific.

!!! tip "How to use these"
    Copy the template that matches your use case. Replace the bracketed fields with your domain-specific content. Save as a `.md` file in `~/.claude/commands/`. See the [Skill Library](../../setup/skill-reference.md) for installation details.

---

## Template 1: Document Collector

A skill that searches email for documents, downloads them, and tracks completeness. Adapted from the tax collection skill but generalized for any document type.

??? example "Full template — click to expand"

    ````markdown
    # /[domain]-collect — [Domain] Document Collection

    *v1.0 — [date] — Initial version*

    Search Gmail for [document type] documents. Download, rename,
    extract key data, and track completeness.

    ## Arguments

    - `period:[value]` — Collection period (default: [sensible default])
    - `scan-only` — Preview findings without downloading

    ## Prerequisites

    - Gmail MCP connected
    - Document folder exists at `[path]/[period]/`
    - Tracking checklist exists at `[path]/[period]/CHECKLIST.md`

    ## Instructions

    ### Step 1: Load Configuration

    1. Parse arguments. Set `DOC_DIR` = `[path]/[period]/`
    2. Read `DOC_DIR/CHECKLIST.md`
    3. Display current status dashboard

    ### Step 2: Search Gmail

    Run these searches in parallel:

    #### 2a: Broad keyword search
    ```
    "[keyword1] OR [keyword2] OR [keyword3]" after:[start] before:[end]
    ```

    #### 2b: Known sender search
    For each sender in [known sender list]:
    ```
    from:[sender] after:[start]
    ```

    #### 2c: Catch-all search
    ```
    "[broader terms]" after:[start] before:[end]
    ```

    ### Step 3: Present Findings

    For each email with a potential document:
    ```
    ──────────────────────────────────────
    Document [N] of [Total]
    ──────────────────────────────────────
    From: [sender]
    Subject: [subject]
    Date: [date]
    Attachment: [filename] or "No attachment"

    Document type: [classification]
    Already collected? [Yes/No]

    [D] Download  [S] Skip  [Q] Quit
    ──────────────────────────────────────
    ```

    ### Step 4: Download and Process

    For each approved download:
    1. Download attachment via Gmail MCP
    2. Rename to consistent format: `[Type] - [Source].[ext]`
    3. Extract key fields: [list fields relevant to your domain]
    4. Display extracted data for user verification
    5. Update CHECKLIST.md

    ### Step 5: Summary Dashboard

    ```
    This session: Downloaded [N], Skipped [M]
    Total collected: [X] of [Y]
    Still missing: [list]
    ```

    ### Step 6: Gap Analysis

    Compare current collection against prior period.
    Flag any sources present last period but missing now.

    ## Error Handling

    - Gmail MCP unavailable: Exit with message
    - Download fails: Offer skip or retry
    - Document unreadable: Flag for manual review
    ````

---

## Template 2: Compilation Skill with Guided Interview

A skill that compiles data from multiple sources through a structured interview. Adapted from the Schedule C compilation pattern.

??? example "Full template — click to expand"

    ````markdown
    # /[domain]-compile — [Domain] Data Compilation

    *v1.0 — [date] — Initial version*

    Compile [output type] from collected documents and user input
    through a guided interview.

    ## Arguments

    - First argument: sub-command (`[cmd1]`, `[cmd2]`, `review`, `all`)
    - `period:[value]` — Period to compile (default: [default])

    ## Sub-commands

    | Sub-command | What it does | Data source |
    |-------------|-------------|-------------|
    | `[cmd1]` | [description] | Guided interview + collected documents |
    | `[cmd2]` | [description] | [external source] export |
    | `review` | Period-over-period comparison | Current + prior outputs |
    | `all` | Run [cmd1] + [cmd2] sequentially | |

    ## Instructions

    ### Setup

    1. Parse sub-command and period argument
    2. Set `DOC_DIR` = `[path]/[period]/`
    3. Verify documents exist

    ### Sub-command: [cmd1]

    #### Step 1: Pull Data from Collected Documents

    Read [document type] and extract [fields].
    Display for verification:
    ```
    [CATEGORY] (from collected documents):
      [Source 1]: [value]
      [Source 2]: [value]
      TOTAL: [sum]

    Verify correct? [Y/edit/n]
    ```

    #### Step 2: Reference Prior Period

    Display prior period's [output type] for context.

    #### Step 3: Guided Interview

    Walk through each [category type]:
    ```
    ──────────────────────────────────────
    CATEGORY [N] — [DESCRIPTION]
    ──────────────────────────────────────
    Prior period: [amount]
    Prompts: [domain-specific questions]

    Enter items. Type "done" when finished.
    Type "skip" if none. Type "same" to copy prior.
    >
    ```

    #### Step 4: Generate Output

    Create `[Output Name].xlsx` with:
    - Tab 1: Summary (category totals)
    - Tab 2: Detail (all line items)
    - Tab 3: Entry guide (mapped to downstream system)

    #### Step 5: Verification

    Display summary. Compare to prior period.
    Flag anomalies (>15% change, sign reversals, missing categories).

    **STOP: User must approve before finalizing.**

    ## Error Handling

    - Missing documents: Show what's available, note gaps
    - External source unavailable: Offer manual entry fallback
    ````

---

## Template 3: Multi-Period Review

A skill that compares the current period's output against prior periods to catch anomalies.

??? example "Full template — click to expand"

    ````markdown
    # /[domain]-review — [Domain] Period Comparison

    *v1.0 — [date] — Initial version*

    Compare current period against [N] prior periods.
    Flag anomalies and generate action items.

    ## Arguments

    - `periods:[N]` — Number of prior periods to compare (default: 2)

    ## Instructions

    ### Step 1: Locate Period Files

    Search for output files in:
    ```
    [path]/[current]/  → [filename or "not found"]
    [path]/[prior-1]/  → [filename or "not found"]
    [path]/[prior-2]/  → [filename or "not found"]
    ```

    ### Step 2: Extract Key Metrics

    Read all period files in parallel. Extract:

    | Metric | [P-2] | [P-1] | [Current] |
    |--------|-------|-------|-----------|
    | [Metric 1] | | | |
    | [Metric 2] | | | |
    | [Metric 3] | | | |

    ### Step 3: Anomaly Detection

    For each metric, flag:
    - Change > [threshold]%
    - Sign reversal
    - Missing in current but present in prior
    - New in current but absent from prior

    Display with severity:
    ```
    !! [Metric]: [value change] — [investigation guidance]
    !  [Metric]: [value change] — [note]
    ```

    ### Step 4: Action Items

    Based on flags, generate:
    - Items to verify before finalizing
    - Items to investigate (may indicate errors)
    - Items to note (expected changes)
    ````

---

## Template 4: Tracking Checklist

A markdown file template for tracking document collection progress.

??? example "Full template — click to expand"

    ````markdown
    # [Domain] Checklist — [Period]

    Last updated: [date]
    Status: [X] of [Y] collected

    ## Collected

    - [x] **[Document Type]** — [Source]
      - Key figure: [value]
      - File: [filename]
      - Collected: [date]

    ## Outstanding

    - [ ] **[Document Type]** — [Source]
      - Expected by: [date]
      - Notes: [any context]

    ## Manual Downloads Required

    - [ ] **[Portal Name]**: [Document Type]
      - URL: [direct link]
      - Last checked: [date]

    ## Reconciliation

    | Source | Prior Period | Current Period | Status |
    |--------|-------------|---------------|--------|
    | [Source 1] | Present | Present | OK |
    | [Source 2] | Present | Missing | ⚠️ Investigate |
    | [Source 3] | Not present | Present | New |
    ````

---

## Template 5: Privacy Policy for Sensitive Workflows

A CLAUDE.md addition for any workflow handling sensitive data.

??? example "Full template — click to expand"

    ````markdown
    ## [Domain] Data Rules

    ### Never extract, display, or store:
    - [Sensitive field 1, e.g., Social Security numbers]
    - [Sensitive field 2, e.g., bank account numbers]
    - [Sensitive field 3]

    ### OK to process:
    - [Field 1, e.g., document types and categories]
    - [Field 2, e.g., dollar amounts from forms]
    - [Field 3, e.g., payer/organization names]

    ### Verification requirements:
    - Every extracted dollar amount must be verified against source
    - All categorizations must be reviewed before generating output
    - Final output requires explicit user approval

    ### Post-session cleanup:
    - [What to delete after the task is complete]
    - [What to archive and where]
    - [What to retain for next period]
    ````

---

!!! note "Provider portability"
    These templates assume Gmail MCP for email search. If you use Outlook, Yahoo, or another email provider, you'll need to adapt the search step — currently there is no equivalent MCP for non-Gmail providers. The compilation and review templates work with any email provider since they operate on local files.

## Non-Tax Examples

To make these templates concrete, here's how they adapt to other domains:

### Expense Reporting
- **Collector:** Search email for receipts, vendor confirmations, travel confirmations
- **Compiler:** Categorize by project, expense type, and policy limit
- **Reviewer:** Compare against budget forecast and prior month

### Grant Reporting
- **Collector:** Gather subaward invoices, timesheets, purchase receipts
- **Compiler:** Map expenses to grant budget categories, calculate burn rate
- **Reviewer:** Compare against award budget and reporting milestones

### Insurance Claims
- **Collector:** Find EOBs, claim statements, provider bills
- **Compiler:** Reconcile billed vs. allowed vs. paid amounts
- **Reviewer:** Track claim status and flag denied claims for appeal

### Annual Faculty Review
- **Collector:** Gather publications, grant awards, teaching evaluations, service records
- **Compiler:** Organize into activity report categories
- **Reviewer:** Compare against prior year and department benchmarks

---

**Back to:** [Architecture Patterns](architecture-patterns.md)

**Reference:** [Academic Tax Basics](../reference/academic-tax-basics.md) | [When to Get Help](../reference/when-to-get-help.md)
