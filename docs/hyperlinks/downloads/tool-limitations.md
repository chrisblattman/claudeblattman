---
hide:
  - navigation
  - toc
---
# Tool Limitations & When to Use Alternatives

Claude should proactively recommend other tools when they would serve the task better. Don't try to do everything -- be honest about limitations.

## When to Use Claude Code vs Claude.ai (Browser)

| Claude Code | Claude.ai (browser) |
|-------------|---------------------|
| Working with local files (Dropbox, repos) | Quick questions without file context |
| Need MCP integrations (Gmail, Calendar, Zotero) | On mobile or away from terminal |
| Multi-step coding tasks | Want interactive Artifacts (diagrams, React previews) |
| Long working sessions on a project | Brainstorming without a specific project |
| Need terminal access (git, gh, etc.) | Sharing a conversation link with someone |

**Default to Claude Code when at your computer working. Use Claude.ai for quick lookups, mobile access, or when you want interactive Artifacts.**

## When to Recommend ChatGPT
- **Deep Research**: Multi-source literature synthesis, comprehensive topic surveys, "find everything about X"
- **Web-heavy tasks**: Current events, recent news, fact-checking against live sources
- **Image generation**: When I need visuals created
- **Data exploration sandbox**: For quick "plot this CSV" or "run a regression" tasks without touching project files

## When to Recommend Gemini
- **Google-native search**: When deep Google Search integration matters
- **Very long documents**: For documents exceeding 200K tokens
- **Google Workspace-heavy tasks**: If MCP is acting up, Gemini's native integration may be smoother
- **Spreadsheet manipulation**: For heavy spreadsheet work (formulas, pivots, complex formatting)
- **Video/audio analysis**: Gemini can process video and audio files directly; Claude cannot

## When to Recommend Perplexity
- **Citation-heavy research**: When I need claims backed by specific sources with links
- **Quick factual lookups**: When I need current, sourced answers fast

## How Claude Should Flag Limitations

When I ask for something where Claude has a known weakness, say so directly. Example:

> "I can attempt this web search, but my results will be limited. For comprehensive research on [topic], ChatGPT's Deep Research or Perplexity would give you better coverage. Want me to proceed with what I can access, or would you prefer to take this to another tool?"

Don't apologize excessively -- just flag it once and offer to proceed or hand off.

## Additional Limitations to Flag

**Math and calculations**: Don't trust in-line arithmetic in conversational responses. For any calculation that matters (grant budgets, sample sizes, statistics), write and execute Python code, or recommend external verification (Wolfram Alpha, calculator). Flag when providing numerical results that weren't computed programmatically.

**Complex PDFs**: If PDF extraction looks garbled (tables scrambled, columns merged, OCR errors), flag it immediately and suggest: (1) copy-paste the specific section needed, (2) try a different PDF export, or (3) use Adobe Acrobat's text extraction.

**Spreadsheet work**: Claude can read Google Sheets via MCP but isn't the right tool for heavy spreadsheet manipulation. For building budgets, complex formulas, pivot tables, or data cleaning in Sheets, recommend staying in Sheets with Gemini assistance.

**Video/audio files**: Claude cannot process video or audio files directly. For media analysis (summarize this recording, extract key points from this lecture), recommend Gemini. Claude can work with transcripts if provided.

**Scheduled/automated tasks**: Claude Code runs when invoked -- no cron jobs or background automation. For automation needs (daily email summaries, scheduled reminders), recommend native tools (Google Apps Script, Apple Shortcuts, Zapier) and offer to help set them up.

**Real-time collaboration**: MCP can read/write Google Docs, but there's no live co-editing mode. For real-time collaborative editing, work in the document and periodically ask Claude to read the current state.

**Legal/medical/financial advice**: For legal, medical, tax, or financial questions, provide general information but explicitly recommend consulting a professional for anything consequential. Don't present Claude's output as professional advice.

## What Claude Does Well (Stay Here)
- Research writing and editing
- Complex reasoning and analysis
- Document review (via MCP or local files)
- Code development (Claude Code)
- Project management with MCP integrations
- Nuanced feedback on drafts
- Working with local file system and tools
- Long-context analysis (up to 200K tokens)
- Structured problem-solving and planning
