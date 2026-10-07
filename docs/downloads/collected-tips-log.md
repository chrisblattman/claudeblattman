---
hide:
  - navigation
  - toc
---
# Collected Tips Log
*Processed by /tips-curate. Search by keyword or tag.*
*Tags: [skill-design] [prompting] [agent-pattern] [tool] [tool-comparison] [workflow] [mcp] [context-management] [coding] [productivity]*
*Quality: [high] [medium]*

---

## 2026-02-20

### SDD (Spec-Driven Development) Pattern [skill-design] [agent-pattern] [workflow] [high]
- **Source:** Antonio Mele (@antoniomele101) on X (Feb 19, 2026)
- **Insight:** Build a spec-driven development skill + sdd-orchestrator subagent that runs before any implementation. Generates structured planning docs (intent.md + others) that feed into AGENTS.md or CLAUDE.md as a single source of truth before code is written. Forces structured thinking before coding.
- **Action:** Consider adding a spec/planning phase to complex skill workflows — e.g., before /proposal-write or new skill creation, have Claude generate intent.md as a structured brief that guides the session.
- **URL:** https://x.com/antoniomele101 (forwarded post)

### AI Tool Selection — Claude Chrome Plugin, Cowork [tool-comparison] [medium]
- **Source:** Simon Smith (@_simonsmith) on X (Feb 19, 2026)
- **Insight:** Power user documents his AI tool stack: Claude as daily driver (models + personality + writing style), Claude Chrome plugin for in-browser work, Cowork for collaborative sessions. Useful reference point for "which tool when" documentation.
- **Action:** Explore Claude Chrome plugin and Cowork features — not currently in your workflow. Add to tool-limitations.md comparison table if valuable.
- **Unfamiliar tools flagged:** Claude Chrome extension, Cowork (collaborative Claude feature)
- **URL:** https://x.com/_simonsmith (forwarded post)

### Claude Code Security — Vulnerability Scanner [tool] [coding] [medium]
- **Source:** Anthropic (@claudeai) announcement (Feb 20, 2026)
- **Insight:** New Claude Code feature scans entire codebases for security vulnerabilities — not pattern-matching, but tracing data flows across files like a human security expert. Using Opus 4.6, found 500+ zero-day bugs in production open-source code. Available in limited research preview for Enterprise/Team plans + open-source maintainers.
- **Action:** Check if your Claude plan includes access. Could be valuable for reviewing RA-written analysis code (Python/R) in GitHub repos before publication or sharing.
- **URL:** https://www.anthropic.com/news/claude-code-security

### Session Capture with /done Skill [workflow] [skill-design] [context-management] [high]
- **Source:** shadcn (@shadcn) on X (Feb 17, 2026)
- **Insight:** After every Claude Code session, run a /done skill that auto-captures key decisions, questions, follow-ups, and dumps them into a .md file tagged with the Claude session ID. Creates a persistent, searchable record of what happened in each session.
- **Action:** Compare against existing session-closing.md rule (which suggests skills/agents but doesn't capture artifacts). Build a /done skill that writes session summaries to a dedicated log, building institutional memory across sessions.
- **URL:** https://x.com/shadcn (forwarded post)

### Karpathy's 200-Line GPT Trainer [coding] [productivity] [medium]
- **Source:** Srishti (@srishticodes) on X, referencing Andrej Karpathy (Feb 18, 2026)
- **Insight:** Single-file, 200-line pure Python GPT implementation with zero dependencies — trains and runs inference. Described as the clearest teaching implementation of how LLMs work under the hood.
- **Action:** Bookmark as reference for deepening LLM understanding. Useful for explaining LLMs to RAs getting into AI tools.
- **URL:** https://x.com/srishticodes (forwarded post, original by Karpathy)

### claude-chief-of-staff — Open-Source Reference Implementation [workflow] [skill-design] [tool-comparison] [high]
- **Source:** mimurchison on GitHub (Feb 17, 2026)
- **Insight:** Open-source "personal AI operating system" on Claude Code — inbox triage with AI-drafted responses, morning briefings with meeting prep, self-building contact CRM with staleness alerts, and goal-aligned task prioritization that flags when calendar time misaligns with stated priorities. Uses CLAUDE.md for voice/values + MCP integrations.
- **Action:** Clone repo and compare architecture against your setup. Key patterns worth stealing: CRM staleness alerts, goal-alignment scoring, calendar-vs-priority mismatch detection.
- **Unfamiliar tool flagged:** claude-chief-of-staff framework
- **URL:** https://github.com/mimurchison/claude-chief-of-staff

### Intelligent AI Delegation Framework [agent-pattern] [workflow] [high]
- **Source:** arxiv paper 2602.11865 (Feb 17, 2026)
- **Insight:** Academic framework for AI agent delegation that goes beyond simple task routing. Emphasizes transfer of authority, accountability, role boundaries, and trust mechanisms between agents — creating an "agentic web" of human + AI collaboration with explicit specifications for each handoff.
- **Action:** Compare against current agent delegation patterns (review-writing, review-methodology, review-plan subagents). The accountability/trust structures could improve how skills delegate to subagents and how you evaluate their output.
- **URL:** https://arxiv.org/abs/2602.11865

### Claude Sonnet 4.6 + 1M Context Beta [tool] [context-management] [medium]
- **Source:** Anthropic (@claudeai) announcement (Feb 17, 2026)
- **Insight:** Sonnet 4.6 released with upgrades across coding, computer use, long-context reasoning, agent planning, and knowledge work. Includes 1M token context window in beta — double the previous limit.
- **Action:** Check if 1M context is available on your plan. Would help with long session context, processing full papers, and large meeting transcript batches.
- **URL:** https://x.com/claudeai (forwarded post)

### Boris Tane's Research-Annotate-Implement Workflow [workflow] [prompting] [skill-design] [high]
- **Source:** Boris Tane (@boristane) blog post, shared by Tanvir Raj on X (Feb 15, 2026)
- **Insight:** 3-phase Claude Code methodology: (1) Deep research with findings in persistent markdown files, (2) Annotation cycle — add inline notes to Claude's plan correcting assumptions, rejecting approaches, injecting domain knowledge (repeat 1-6 times), (3) Execute with "implement it all" only after plan is approved. Key principle: "Never let Claude write code until you've reviewed a written plan."
- **Action:** Compare annotation cycle against current plan-mode workflow. The inline-notes-on-plan-doc pattern is more structured than chat-based iteration and pairs well with the SDD pattern.
- **URL:** https://boristane.com/blog/how-i-use-claude-code/

### Brendan Nyhan's Manuscript/PAP Feedback GPT [tool] [tool-comparison] [workflow] [high]
- **Source:** Brendan Nyhan (@BrendanNyhan) on X (Aug 27, 2025)
- **Insight:** Custom ChatGPT GPT built from 150+ of Nyhan's actual peer reviews. Identifies problems and provides actionable feedback on the issues he raises most frequently in manuscript and pre-analysis plan reviews. Public and free to use.
- **Action:** Test on a current draft. Compare output against review-writing and review-methodology agents. If it catches things your agents miss, incorporate its review dimensions into your agent prompts.
- **Unfamiliar tool flagged:** Brendan Nyhan's manuscript/PAP feedback GPT (ChatGPT custom GPT)
- **URL:** https://chatgpt.com/g/g-68af4d1939 (custom GPT)

### Volt / Lossless Context Management (LCM) [tool] [context-management] [agent-pattern] [high]
- **Source:** Clint Ehrlich & Theodore Blackman, Voltropy PBC — arxiv paper (Feb 14, 2026)
- **Insight:** Deterministic architecture for LLM memory that outperforms Claude Code on long-context tasks. Uses an immutable store + hierarchical DAG of summaries — compresses older context aggressively while retaining lossless pointers to originals. Benchmarked against Claude Code on OOLONG: Volt wins at every context length (8K–1M). Also introduces operator-level recursion (LLM-Map, Agentic-Map) for processing unbounded datasets without model-managed loops. Zero overhead for short tasks.
- **Action:** Monitor Volt as it matures. LCM principles (immutable store, hierarchical summarization, lossless pointers) could inform how you structure long sessions and address context rot in extended /checkin or /weekly-review runs.
- **Unfamiliar tool flagged:** Volt (terminal-based coding agent with LCM architecture)
- **URL:** https://github.com/voltropy/volt | https://arxiv.org/abs/2602.11865

### Dynamic Filtering in Sonnet 4.6 — Automatic Web Search Cleanup [tool] [context-management] [medium]
- **Source:** Tom (@tomcrawshaw01) on X (Feb 18, 2026)
- **Insight:** Sonnet 4.6 introduced "dynamic filtering" — Claude writes and executes Python to clean web search results before reasoning (strips nav, ads, cookie banners). 11% more accurate on search benchmarks, 24% fewer tokens. Happens automatically at the model level.
- **Action:** No action needed — you get this for free on Sonnet 4.6 skills. Good context for understanding improved performance in search-heavy skills (/curate-tips, /triage-inbox). Read Anthropic's blog post for tool-limitations.md updates.
- **URL:** https://claude.com/blog/improved-web-search-with-dynamic-filtering

### Prompt Caching Architecture — Lessons from Building Claude Code [context-management] [skill-design] [workflow] [high]
- **Source:** Thariq (@trq212), Claude Code team, on X (Feb 19, 2026)
- **Insight:** Claude Code's entire harness is built around prompt caching (prefix-matching). Key lessons: (1) Static content first, dynamic content last — system prompt, then tools, then CLAUDE.md, then session context, then messages. (2) Use system-reminder messages for updates instead of changing the system prompt (avoids cache miss). (3) Never change models mid-session — use subagents instead (Explore agents use Haiku via handoff). (4) Never add/remove tools mid-session — Plan Mode uses tools themselves (EnterPlanMode/ExitPlanMode) rather than swapping tool sets. (5) ToolSearch defers tool loading with lightweight stubs to keep prefix stable. (6) Compaction reuses the exact same prefix for cache-safe forking. (7) Monitor cache hit rate like uptime — treat cache breaks as incidents.
- **Action:** This explains why your skills should never dynamically change tools or models mid-conversation. When designing new skills, ensure they follow static-prefix patterns. The system-reminder tags you see in conversations are literally this caching optimization in action.
- **URL:** https://x.com/trq212 (forwarded post)

### Ars Contexta — Agentic Note-Taking / Second Brain Plugin [workflow] [context-management] [tool] [skill-design] [high]
- **Source:** Cornelius (@molt_cornelius) on X (Feb 15, 2026)
- **Insight:** Claude Code plugin that builds a local-first knowledge management system using plain markdown files + wiki links as a traversable knowledge graph. Key innovations: (1) Methodology graph — hundreds of interconnected research claims from cognitive science/knowledge management that the system derives structure from (not templates). (2) Processing pipeline spawns fresh agents per phase to avoid context degradation. (3) Self-engineering loop — system researches tools-for-thought to improve itself. (4) Kernel primitives (atomic notes, wiki links, Maps of Content, schema enforcement) that emerged across all knowledge traditions studied. Everything is local markdown — no cloud, no database.
- **Action:** Explore arscontexta.org. Compare against your current knowledge management (MEMORY.md, collected-tips-log, session-closing.md). The "fresh agent per phase" and "methodology graph" patterns could improve how you structure institutional memory across sessions.
- **Unfamiliar tool flagged:** Ars Contexta (arscontexta.org) — Claude Code plugin for agentic knowledge management
- **URL:** https://arscontexta.org

### Agentic Economy Primitives — Intention, Context, Attribution, Simulation [agent-pattern] [medium]
- **Source:** Bettina Warburg (@BWarburg) on Substack (Feb 5, 2026)
- **Insight:** Long-form analysis of four technical primitives for an agentic economy: Intention (machine-readable desire via intents graphs), Context (verified persistent memory via context graphs), Attribution (cryptographic proof of contribution via provenance graphs), and Simulation (testing agent behavior before deployment). Argues these replace the attention economy's unverifiable clicks with verifiable actions. Conceptual/macro — not a how-to, but a useful mental model for where agentic systems are heading.
- **Action:** Reference for thinking about agent architecture at the macro level. The Context Graph and Attribution concepts may inform future thinking about how your agent ecosystem tracks decisions and contributions across skills.
- **URL:** https://open.substack.com/pub/bwarburg/p/the-new-primitives

## 2026-02-21

### Git for Economists via Claude Code [workflow] [coding] [productivity] [high]
- **Source:** Aniket Panjwani (@aniketapanjwani) on X (Feb 21, 2026)
- **Insight:** Full guide translating Git concepts into economist vocabulary: "git init = create folder," "commit = save," "branch = copy directory," "push = Dropbox sync." Includes specific natural-language prompts to give Claude Code for each Git operation — no git knowledge required. Key advice: add "Make atomic, meaningful commits as you do work" to CLAUDE.md.
- **Action:** Adapt into RA onboarding materials (ra-management.md). Share with RAs getting started with GitHub-synced Overleaf. Consider adding the one-liner commit instruction to project CLAUDE.md files.
- **URL:** https://x.com/aniketapanjwani/status/2025248300115358066 | Video: https://www.youtube.com/watch?v=U686qx0IubM | Newsletter: https://ai-mba.io/newsletter/econ

### Prompt Cache Optimization Toolkit (CLAUDE.md Template) [context-management] [skill-design] [workflow] [medium]
- **Source:** hoeem (@hooeem) on X (Feb 20, 2026)
- **Insight:** Converts Thariq's prompt caching article into a structured CLAUDE.md template with phased build instructions. Drop the file into a folder, open Claude Code, and follow the phases in order. Related to logged entry "Prompt Caching Architecture" (2026-02-20).
- **Action:** Retrieve the artifact from claude.ai and compare against existing CLAUDE.md structure.
- **URL:** https://x.com/hooeem (forwarded post) | Artifact: claude.ai/public/artifact (linked in email)

### Skill Graphs — Interconnected Skill Architecture [skill-design] [agent-pattern] [context-management] [high]
- **Source:** Heinrich (@arscontexta) on X (Feb 17, 2026)
- **Insight:** Instead of one skill = one file, build a network of interconnected markdown files with wikilinks. Each file is one complete thought/technique with YAML frontmatter so the agent can scan without reading the full file. Agent traverses the graph using progressive disclosure: index → descriptions → links → sections → full content. Most decisions happen before reading a single full file. Key primitives: wikilinks as prose (carry meaning, not just references), YAML frontmatter, MOCs (maps of content) for sub-topic clusters, recursive skill discovery. Example domains: trading, legal, company knowledge, research methodology.
- **Action:** Evaluate whether growing domains (project-management, email-workflows, skill-building) would benefit from graph structure instead of monolithic .md files. Try the Ars Contexta plugin on one domain as a test. No Obsidian required — plain markdown + wikilinks.
- **URL:** https://x.com/arscontexta (forwarded post) | Plugin: https://arscontexta.org
- **Note:** Extends logged entry "Ars Contexta" (2026-02-20) with the specific Skill Graph architecture pattern.

### 5 Levels of Agentic Software [agent-pattern] [workflow] [skill-design] [medium]
- **Source:** Ashpreet Bedi (@ashpreetbedi) via Agno framework (Feb 21, 2026)
- **Insight:** Architectural progression for agent design: (1) Agent + tools, (2) + storage & knowledge/RAG, (3) + memory & learning ("interaction 1000 should be better than interaction 1"), (4) multi-agent teams, (5) production system. Key advice: "Start at Level 1. Most teams skip to Level 4 because multi-agent architectures look impressive in demos. Then spend weeks debugging why the simplest tasks fail."
- **Action:** Use as mental model when designing new skills/agents. Current setup is roughly Level 2-3. The Level 3 "learning machine" concept (agent saves learnings from experience) could inform self-improvement.md rule.
- **URL:** https://github.com/agno-agi/agno/tree/main/cookbook/levels_of_agentic_software

### Visual Explainer — HTML Plan Reviews [skill-design] [workflow] [tool] [medium]
- **Source:** nicobailon on GitHub (Feb 21, 2026)
- **Insight:** Skill + prompt templates that generate rich HTML pages instead of markdown for visual diff reviews, architecture overviews, plan audits, data tables, and project recaps. Author: "I can't go back to markdown plans after getting used to this."
- **Action:** Clone repo and try on a project plan or data table review. Could enhance /review-plan output.
- **URL:** https://github.com/nicobailon/visual-explainer

### Git Worktrees — Official Claude Code CLI Support [tool] [workflow] [coding] [medium]
- **Source:** Anthropic announcement (Feb 21, 2026)
- **Insight:** Claude Code CLI now has built-in git worktree support (was Desktop-only). Each agent gets its own worktree and can work independently in parallel without interfering. Already available via the Task tool's `isolation: "worktree"` parameter.
- **Action:** Consider using worktree isolation more for parallel agent work in skills that spawn subagents.
- **URL:** https://git-scm.com/docs/git-worktree

