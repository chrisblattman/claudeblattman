# Privacy, Data, and Setup Decisions

Before using AI for anything involving tax documents, you need to make deliberate choices about what data touches which systems. This page walks through the decisions and their trade-offs.

!!! warning "This is not tax advice"
    Educational content about AI workflow design. Not tax, legal, or financial advice.

---

## The Core Question

Tax preparation involves some of the most sensitive personal data you have: Social Security numbers, bank account numbers, income figures, employer details, medical information. The first decision is **what you're comfortable sending through an AI system** — and what stays local.

---

## How Data Flows in This Workflow

```mermaid
graph LR
    A[Gmail] -->|MCP reads email metadata<br>& attachment content| B[Claude Code<br>on your machine]
    C[Google Sheets] -->|MCP reads<br>spreadsheet data| B
    D[Local files<br>PDFs, CSVs] -->|Read tool| B
    B -->|Writes files| E[Local filesystem<br>your tax folder]
    B -->|API calls with<br>conversation context| F[Anthropic API]

    style F fill:#ff6b6b,color:#fff
    style E fill:#51cf66,color:#fff
    style B fill:#339af0,color:#fff
```

**What stays local:** Downloaded PDFs, generated spreadsheets, and your tax folder never leave your machine. Claude Code reads and writes them through local filesystem tools.

**What goes to Anthropic's API:** The conversation context — which includes any text Claude reads from your documents. When Claude reads a W-2 PDF and extracts wage figures, those figures are sent to the API as part of the conversation. Anthropic's [data policy](https://www.anthropic.com/policies/privacy) states that API inputs are not used for model training, but you should read the current policy yourself.

**What goes through Google's API:** Gmail MCP searches and reads emails through Google's API. Google Sheets MCP reads spreadsheet data. These follow Google's existing data handling for your account.

---

## Decisions to Make Before You Start

### Decision 1: What data will you allow in the AI conversation?

| Data Type | Risk Level | Recommendation |
|-----------|-----------|----------------|
| Document types (W-2, 1099, etc.) | Low | Allow — needed for the workflow |
| Dollar amounts from tax forms | Medium | Allow if comfortable — needed for compilation and review |
| Employer names, payer names | Medium | Allow — needed for document matching |
| Social Security numbers | High | **Exclude** — never needed for this workflow |
| Bank account / routing numbers | High | **Exclude** — never needed for this workflow |
| Medical provider details | Medium-High | Consider — needed only for medical expense compilation |

The skills described in this case study are designed to **never need SSNs or bank account numbers**. You can add explicit instructions to your CLAUDE.md:

```markdown
## Tax Document Rules
- NEVER extract, display, or store Social Security numbers
- NEVER extract, display, or store bank account or routing numbers
- If you encounter these in a document, skip past them
```

!!! danger "PDF extraction transmits sensitive data to the API"
    CLAUDE.md rules prevent Claude from *displaying* sensitive values, but they do **not prevent transmission**. When Claude reads a W-2 or 1099 PDF, the entire text content — including SSNs, EINs, bank account numbers, and other identifiers — is sent to Anthropic's API as part of the conversation context. To mitigate this:

    - **Redact SSNs and account numbers** from PDFs before giving them to Claude (use your PDF editor's redaction tool, or black out and re-save)
    - **Or enter figures manually** instead of using PDF extraction for documents that contain SSNs (W-2s, 1099s, 1098s)
    - Verify Anthropic's current data retention policy at [anthropic.com/policies](https://www.anthropic.com/policies) before proceeding

### Decision 2: Will you use Gmail MCP for document collection?

**With Gmail MCP:** Claude searches your email, finds tax documents, downloads attachments, and tracks what's missing. This is the core of the `/tax-collect` skill.

!!! note "Gmail MCP grants access to your entire inbox"
    Gmail MCP does not scope to tax-related emails only. Once configured, Claude Code can search and read **any email** in your account — salary negotiations, medical correspondence, legal matters, and everything else. Consider what's in your inbox before enabling it. If this is a concern, you can create a dedicated Gmail label for tax documents and manually move emails there, then limit your skill's search to that label.

**Without Gmail MCP:** You download documents manually and place them in your tax folder. Claude can still compile, categorize, and review them — you just skip the automated collection step.

The Gmail MCP advantage is significant for people with scattered documents across dozens of emails. If your documents arrive in 3-4 emails, manual download is fine.

### Decision 3: Local processing vs. cloud processing

Everything in this workflow runs through Claude Code on your local machine talking to Anthropic's API. There is no separate cloud service, no third-party tax platform, and no data stored beyond the API conversation window.

After each session ends, Anthropic may retain API inputs for up to 30 days for safety monitoring per their current data retention policy — verify the latest terms at [anthropic.com/policies](https://www.anthropic.com/policies) before proceeding. Your local files persist.

---

## Setting Up Secure Document Access

Claude Code can read any file on your local filesystem. That's powerful during tax season — and a reason to be deliberate about what's on your filesystem the rest of the year.

### The pattern: temporary access, permanent separation

**Phase 1 — Before tax season:** Keep tax documents in a location Claude Code cannot reach. This could be:

- A cloud service that isn't synced locally (e.g., an unsynced Dropbox folder, a Box folder, iCloud Drive with selective sync disabled for that folder)
- An encrypted disk image you only mount when needed
- A USB drive

Your sensitive financial documents should not sit in a locally-synced folder year-round. Claude Code can access anything on your local filesystem — including cloud folders that sync automatically.

**Phase 2 — During tax season:** Create a dedicated working folder and bring in only the documents you need:

```bash
# Create a tax working folder
mkdir -p ~/tax-prep-2025/documents
mkdir -p ~/tax-prep-2025/output

# Copy documents from your secure location
cp "/path/to/secure-storage/W2-2025.pdf" ~/tax-prep-2025/documents/
cp "/path/to/secure-storage/1099-NEC-*.pdf" ~/tax-prep-2025/documents/
```

Point your tax skills at this folder. All downloads, extractions, and generated spreadsheets go here.

**Phase 3 — After filing:** Remove the working folder and its contents:

```bash
# Archive final output to your secure location
cp ~/tax-prep-2025/output/*.xlsx "/path/to/secure-storage/2025-filed/"

# Delete the working folder
rm -rf ~/tax-prep-2025

# Start a fresh Claude Code session (old session context
# included your tax data)
```

### If you use Gmail MCP for document collection

Gmail MCP gives Claude Code access to your entire inbox — not just tax emails. Two options if you'd rather limit exposure:

- **Enable Gmail MCP only during tax season.** Add the configuration to `~/.claude.json` when you're ready to collect documents, remove it when you're done. You don't need every integration running year-round.
- **Use a label-based approach.** Manually move tax emails to a dedicated Gmail label, then instruct the skill to search only that label.

### What to keep out of the working folder entirely

Some documents should never enter Claude's reach:

- **Prior year tax returns** (contain SSNs, full financial picture) — enter comparison figures manually
- **Bank statements** (account numbers, transaction history beyond what's needed)
- **Estate or trust documents** (beneficiary SSNs, asset details)

If a skill needs a figure from one of these, open the document yourself and type the number in. The 30 seconds of manual entry is worth the privacy gain.

---

## Pre-Flight Privacy Checklist

Run through this before your first tax session:

- [ ] **Read Anthropic's current data policy** — confirm API inputs are not used for training
- [ ] **Add SSN/bank exclusion rules** to your CLAUDE.md (see above)
- [ ] **Decide on Gmail MCP** — will you use automated email search, or download documents manually?
- [ ] **Create a dedicated tax working folder** — a local folder (e.g., `~/tax-prep-2025/`) that you'll delete after filing. See [Setting Up Secure Document Access](#setting-up-secure-document-access) above.
- [ ] **Verify your tax documents aren't in a synced folder** — if they're in Dropbox, iCloud, or Google Drive, are those folders synced locally? If so, Claude Code can already read them.
- [ ] **Review who has access** to your machine — anyone who can open Claude Code can access your conversation history
- [ ] **Plan your cleanup** — after filing, delete the working folder, archive output to your secure location, and start a fresh Claude Code session

---

## Post-Season Cleanup Checklist

After you've filed your return:

- [ ] **Archive final output** — copy generated spreadsheets and summaries to your secure storage location
- [ ] **Delete the working folder** — `rm -rf ~/tax-prep-2025` (or wherever you created it)
- [ ] **Disable Gmail MCP** if you enabled it only for tax season — remove or comment out the entry in `~/.claude.json`
- [ ] **Start a fresh session** — your tax data was in the conversation context. Starting fresh ensures it's not carried into unrelated work.
- [ ] **Verify no stray copies** — check your Downloads folder, Desktop, and any cloud sync folders for documents you may have opened outside the working directory

---

## What This Workflow Does NOT Do

- **Does not file your taxes.** It organizes documents and compiles data. You enter figures into tax software yourself.
- **Does not connect to the IRS, tax software, or financial institutions.** All data comes from your email and local files.
- **Does not store tax data persistently.** Each Claude Code session starts fresh. Your local files are the only persistent record.
- **Does not make tax decisions.** It presents data for your review. Classification of deductions, income categorization, and filing decisions are yours.

---

## Tool Requirements

To replicate the full workflow described in this case study, you need:

| Tool | Required for | Setup guide |
|------|-------------|-------------|
| Claude Code | Everything | [Install (Mac)](../../hyperlinks/install-mac.md) / [Install (Windows)](../../hyperlinks/install-windows.md) |
| Gmail MCP | Document collection from email | [MCP Setup](../../build-your-own/mcp-setup.md) |
| Google Sheets MCP | Charitable contribution export | [MCP Setup](../../build-your-own/mcp-setup.md) |
| `openpyxl` (Python) | Generating formatted spreadsheets | `pip3 install openpyxl` |

**Minimum viable setup:** Claude Code + local files only. You can still use the compilation and review patterns without any MCP integrations — just download documents manually.

---

**Next:** [The Workflow Overview](../case-study/the-workflow-overview.md) — how the full pipeline works, and meet the fictional personas.
