---
hide:
  - navigation
  - toc
---
# Downloads & Reference Library

Guides, templates, and reference documents from my actual setup. Download, adapt, and use freely.

**A note on dates:** AI tools evolve fast, and these are snapshots rather than maintained documents. Each carries the date it was written so you can judge how much to trust it — several are from early 2026 and have not been revised since. Treat them as a record of how one setup worked at that time, and check the official documentation for anything you are about to rely on.

---

## Real Examples

<div class="grid cards" markdown>

-   **A Real CLAUDE.md — Annotated**

    ---

    *Updated February 2026*

    A sanitized version of my actual production CLAUDE.md — the file that runs my daily workflow. 150+ lines of working configuration with annotations explaining why each section exists and how it evolved.

    [:octicons-arrow-right-24: View](real-claude-md-example.md) · [:octicons-arrow-right-24: Related: CLAUDE.md Setup Guide](../../build-your-own/agents-md.md)

</div>

---

## Prompting

- [Getting better answers](../prompting.md) — the consolidated prompting guide, worked examples, and troubleshooting.
- [Prompt-assistant instructions](../../assets/prompting/prompt-assistant-instructions.txt) — copy into a chatbot project or a dedicated chat.
- [Prompt-preferences template](../../assets/prompting/prompt-preferences-template.txt) — an editable starting point for your own standing instructions.

---

## Skill Building & Architecture

<div class="grid cards" markdown>

-   **Skill Design Patterns**

    ---

    *Updated February 2026*

    Extracted patterns from 20+ production skills: policy-first architecture, config/state separation, graceful degradation, phased execution, confirmation gates. Includes archetypes (simple/medium/complex), quality checklist, and performance logging conventions.

    [:octicons-download-16: Download](skill-patterns.md) · [:octicons-arrow-right-24: Related: Building Skills](../../build-your-own/building-skills.md)

-   **Agents vs Skills Decision Guide**

    ---

    *Updated February 2026*

    When to use a subagent (fresh context, parallel evaluation, QA review) versus a skill (user interaction, workflow orchestration, main context). Decision framework with practical examples.

    [:octicons-download-16: Download](agents-vs-skills-guide.md) · [:octicons-arrow-right-24: Related: Agents vs Skills](../agents-vs-skills.md)

</div>

---

## Deep Dives

<div class="grid cards" markdown>

-   **Claude Code Under the Hood**

    ---

    *Updated February 2026*

    How Claude Code actually works: the message stack, the agentic loop, context windows and token economics, prompt patterns, MCP architecture, and annotated skill examples. 5,863 words across 7 modules. For power users who want to understand the mechanics.

    [:octicons-download-16: Download](claude-under-the-hood.md) · [:octicons-arrow-right-24: Related: Advanced](../system-overview.md)

-   **Cloud Storage Organization Guide**

    ---

    *Updated February 2026*

    Step-by-step guide to auditing and organizing files across Dropbox, Google Drive, Box, and local disk using Claude Code. Based on a real multi-day workflow. Includes prompts, scripts, and decision frameworks.

    [:octicons-download-16: Download](../../workflows/cloud-storage-guide.md) · [:octicons-arrow-right-24: Related: Executive Assistant](../../workflows/building-an-assistant.md)

</div>

---

## Decision Guides

<div class="grid cards" markdown>

-   **Tool Limitations & When to Use What**

    ---

    *Updated February 2026*

    When to use Claude Code vs Claude.ai vs ChatGPT vs Gemini vs Perplexity. What each tool does well, what it doesn't, and when to switch. A decision framework for academics and professionals.

    [:octicons-download-16: Download](tool-limitations.md)

-   **Collected Tips & Research Log**

    ---

    *Updated February 2026*

    Curated log of 20+ deep research findings on prompting, agents, context management, and emerging patterns. Each entry includes source, insight, and action item. **Produced by the [`/tips-curate` pipeline](../continuous-improvement.md).**

    [:octicons-download-16: Download](collected-tips-log.md)

</div>

---

## Templates

Starter configuration files for setting up your own system. Download with `curl`, then customize for your workflow.

**Download all templates at once:**
```bash
mkdir -p ~/claude-templates && cd ~/claude-templates
for f in claude-md-template.md email-policy-template.md calendar-policy-template.md \
         triage-config-template.md email-voice-template.md voice-pack-template.md \
         goals-yaml-template.yaml; do
  curl -O "https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/$f"
done
```

**Or download individually:**

| Template | Purpose | Install |
|----------|---------|---------|
| **CLAUDE.md** | Starter configuration for Claude Code | `curl -O https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/claude-md-template.md` |
| **Email Policy** | Rules for email triage autonomy | `curl -O https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/email-policy-template.md` |
| **Calendar Policy** | Calendar management policies | `curl -O https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/calendar-policy-template.md` |
| **Triage Config** | Email classification rules | `curl -O https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/triage-config-template.md` |
| **Email Voice** | Email tone, signature blocks, and drafting preferences | `curl -O https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/email-voice-template.md` |
| **Voice Pack** | Full voice file framework: spec, examples, testing, maintenance | `curl -O https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/voice-pack-template.md` |
| **Goals** | Quarterly goal tracking format | `curl -O https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/goals-yaml-template.yaml` |

---

## Tax Workflow Resources

All checklists, templates, and architecture patterns for the tax workflow live in the [Tax Season Case Study](../../tax-workflow/index.md) section.

---

## Keeping These Current

These resources reflect my setup as of the dates shown, and are not on an update schedule. What works today may have a better approach tomorrow. If something here is wrong or has gone stale, [let me know](mailto:claudeblattman+feedback@gmail.com) — that is a faster route to a fix than waiting for a revision.
