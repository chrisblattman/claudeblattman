---
hide:
  - navigation
  - toc
---
# NotebookLM

<span class="badge-teal">No Claude Code required</span>

Google's NotebookLM turns collections of PDFs, transcripts, and documents into searchable, citable research libraries. Upload your sources, ask questions, and get answers that link back to the exact paragraphs in the original material.

---

## Why Document-Grounded AI Matters

The usual AI approach — paste a paper into ChatGPT and ask for a summary — gives you confident synthesis with no links back to the source. Summarize-and-forget.

Document-grounded AI flips this. It searches *across* your sources and points you back. Ask a question, get an answer, click the citation, read the exact paragraph. Search-and-verify.

---

## What NotebookLM Does

| Feature | Details |
|---------|---------|
| **Sources per notebook** | Up to 50 (free) or 300 (Plus, $20/mo) |
| **Source types** | PDFs, Google Docs, Google Slides, websites, YouTube videos, plain text |
| **Citations** | Inline citations linking to specific passages |
| **Audio overviews** | Podcast-style audio discussions of your sources |
| **Sharing** | Share notebooks with collaborators |
| **Cost** | Free tier is generous. Plus ($20/mo) adds capacity and priority access. |

**Key limitation:** NotebookLM only searches documents you've uploaded — no web search, no external knowledge. This is a feature (answers are grounded in your materials) but means you need to upload everything relevant.

---

## How I Use It

### Literature Reviews

Upload 100-300 paper PDFs and use it as a search engine across the entire corpus:

- *"Which studies find that cognitive behavioral therapy reduces criminal behavior?"*
- *"What sample sizes do the Latin American employment RCTs use?"*

Each answer comes with citations linking to the exact paragraphs. I click through and verify. This makes me *more* careful about sources than manual literature review, because the friction of checking is so low.

### Primary Source Analysis

I work with court transcripts from public legal proceedings — hundreds of pages. NotebookLM lets me search across all of them with comprehension, not just keyword matching.

### Qualitative Research

The most powerful use case. IRB-approved interview transcripts uploaded to NotebookLM within my university's Google Workspace become a searchable qualitative database:

- *"Across all interviews, when do respondents describe their motivations for joining armed groups?"*

The ability to search across an entire qualitative corpus fundamentally changes what's possible in qualitative research.

---

## Where It Breaks Down

**Content filters.** Google's safety filters can block legitimate research. Notebooks on violence, illegal economies, and sensitive interview material get flagged. The filters don't distinguish between researching violence and promoting it.

**Basic reasoning.** Good at finding and synthesizing across documents, but not deep analytical reasoning. Use Claude or ChatGPT for novel theoretical frameworks or subtle methodological critique.

**Hallucination.** Lower rate than standard chatbots (grounded in your documents), but sometimes overstates what a source claims. Always click through to the citation.

**No export.** No standard export for Q&A history. Copy-paste is your main option.

---

## When Content Filters Block You

If you work with sensitive research material — violence, conflict, illicit economies — you'll hit content filters. Practical alternatives:

- **AnythingLLM** — Run document-grounded AI locally. No data leaves your machine.
- **Elephas** — Mac-native AI with local models and private documents.
- **Claude Projects** — Upload documents to a Claude.ai Project. Anthropic's content policies are generally more research-friendly.

---

## Alternatives

| Tool | Best For | Cost | Notes |
|------|----------|------|-------|
| [**Claude Projects**](https://claude.ai/) | Document research + reasoning | $20/mo | Better analytical reasoning, smaller source capacity, more research-friendly policies. |
| [**ChatGPT file upload**](https://chat.openai.com/) | Quick document Q&A | $20/mo | Good for small sets. Less structured citation. |
| [**Elicit**](https://elicit.com/) | Academic literature | Free-$10/mo | Searches published papers, extracts claims, builds literature tables. |
| [**Consensus**](https://consensus.app/) | Evidence-based answers | Free-$10/mo | Searches academic papers and synthesizes findings. |
| [**AnythingLLM**](https://anythingllm.com/) | Sensitive documents | Free (local) | Everything runs locally. Best for sensitive research data. |

NotebookLM's advantage: large source capacity, paragraph-level citations, audio overviews, and a generous free tier.

---

## Getting Started

1. **Sign up** at [notebooklm.google.com](https://notebooklm.google.com/)
2. **Create a notebook** — name it descriptively (e.g., "Crime Prevention Literature Review")
3. **Upload sources** — drag in PDFs, paste Google Doc links, or add URLs
4. **Ask a question** — start specific: *"Which studies find positive effects of CBT on criminal behavior?"*
5. **Check the citations** — click inline references to verify against the original text

The habit of checking citations — not just reading the summary — is what separates useful document research from expensive hallucination.
