---
hide:
  - navigation
---
# Resources

A curated collection of the resources, tools, and reference implementations that shaped this project. Each entry includes a brief summary of what's useful and why I found it worth your time.

Thanks to [Anup Malani](https://www.law.uchicago.edu/faculty/malani) for being my first tutor on the basics — he's the one who got me started with Claude Code and showed me what was possible.

---

## Reference Implementations

These are the projects and posts that most influenced how I built my system. If you want to see how other people are doing this, start here.

### Boris Tane — How I Use Claude Code

[:octicons-link-external-16: boristane.com](https://boristane.com/blog/how-i-use-claude-code/)

A developer's opinionated workflow with Claude Code. The Research → Plan → Annotate → Implement structure he describes became the backbone of how I think about multi-step tasks. His use of persistent markdown files as shared state between Claude and the user directly influenced my CLAUDE.md approach. Well-written and confident — one of the first posts that made me think this was more than a toy.

### Pedro Sant'Anna — Claude Code My Workflow

[:octicons-link-external-16: psantanna.com](https://psantanna.com/claude-code-my-workflow/)

The closest thing to what I'm building, but for econometrics. Pedro is an academic (economics) who built an ambitious system with 10 agents and 19 commands. His MEMORY.md pattern for persistent learning across sessions was an early influence. His research-specific slash commands showed me what was possible. Fair warning: the complexity can be overwhelming for beginners — I deliberately kept my system simpler.

### Mike Murchison — Claude Chief of Staff

[:octicons-link-external-16: GitHub](https://github.com/mimurchison/claude-chief-of-staff)

A four-pillar structure (Communicate, Learn, Deepen Relationships, Achieve Goals) for using Claude as an executive assistant. The Goals.yaml as a single source of truth, the `/gm` morning briefing command, and the idea of CLAUDE.md as "your AI operating system" all shaped my approach. My `/morning-brief` and `/checkin` skills descend directly from this repo.

### Dave Killeen — Dex

[:octicons-link-external-16: GitHub](https://github.com/davekilleen/Dex)

An extension of Murchison's Chief of Staff pattern that adds structured pillars (`pillars.yaml`), session learnings capture, and usage logging. If Murchison's repo is the architecture, Dex is the operational layer. I used it alongside the original when designing my session capture (`/done`) and goal alignment (`/goals-review`) skills. Discovered February 2026.

### Obie Fernandez — Building a Personal CTO Operating System

[:octicons-link-external-16: Medium](https://obie.medium.com/building-a-personal-cto-operating-system-with-claude-code-b3fb9c4933c7)

A real workflow where Claude Code acts as an EA for a CTO: managing priorities, shipping work, and maintaining an operational cadence. What's useful here isn't the CTO-specific parts — it's the pattern of encoding your daily rhythm into skills so Claude runs your system instead of you running Claude. The "operating system" framing influenced how I think about the whole EA layer.

### Chris Wiles — Claude Code Showcase

[:octicons-link-external-16: GitHub](https://github.com/ChrisWiles/claude-code-showcase)

A full example of a `.claude/` directory structure with hooks, skills, agents, commands, and GitHub workflows. If you want to see what a well-organized Claude Code project looks like before building your own, this is the best single reference. I used it as a structural template when organizing my own skills and hooks directories.

### Ethan Mollick — One Useful Thing

[:octicons-link-external-16: oneusefulthing.org](https://www.oneusefulthing.org/)

Ethan's blog is the gold standard for writing about AI for non-technical professionals. His Models / Apps / Harnesses framework helped me think about where different tools fit. Key insight that stuck with me: "the shift from chatbot to agent is the most important change since ChatGPT launched." If you read one person on AI and work, make it Ethan.

---

## Official Documentation

### Claude Code

[:octicons-link-external-16: docs.anthropic.com](https://code.claude.com/docs/en/overview)

The official setup, configuration, and usage guide. Start here if you're installing Claude Code for the first time. Covers CLAUDE.md, MCP integrations, slash commands, and the permission model. The docs have improved significantly — they're now genuinely useful as a reference.

### Claude Code Best Practices

[:octicons-link-external-16: code.claude.com](https://code.claude.com/docs/en/best-practices)

Anthropic's comprehensive best practices guide: context management, CLAUDE.md conventions, subagent patterns, parallel sessions, and common failure modes. If you read one official guide, make it this one.

### Anthropic Skills Repository

[:octicons-link-external-16: github.com/anthropics/skills](https://github.com/anthropics/skills)

Anthropic's official collection of example Agent Skills — the first-party reference for skill structure, YAML frontmatter conventions, and the `SKILL.md` format. Useful as a template when building your own.

### Anthropic Prompt Engineering Guide

[:octicons-link-external-16: docs.anthropic.com](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)

Anthropic's own guide to writing effective prompts. More technical than this site goes, but worth reading if you want to understand the mechanics. I adapted several patterns from here into my prompt formatting skills.

### MCP (Model Context Protocol)

[:octicons-link-external-16: modelcontextprotocol.io](https://modelcontextprotocol.io/)

The protocol that lets Claude Code talk to Gmail, Google Calendar, Google Docs, and other services. Understanding MCP is essential if you want to build integrations beyond what I've packaged. The spec is well-documented; the ecosystem is growing fast.

### MkDocs Material

[:octicons-link-external-16: squidfunk.github.io](https://squidfunk.github.io/mkdocs-material/)

The framework this site is built with. If you want to build something similar — a documentation site for your own tools or research — Material is the best option I've found. Free, well-maintained, and the configuration is all YAML (no JavaScript required).

---

## Tools Used on This Site

### AI Assistants

| Tool | What I use it for | Link |
|------|------------------|------|
| **Claude** | Primary AI — Claude Code for workflows, Claude.ai for conversations | [claude.ai](https://claude.ai) |
| **ChatGPT** | Deep Research for literature reviews and web synthesis | [chat.openai.com](https://chat.openai.com) |
| **Perplexity** | Citation-heavy factual lookups, sourced answers | [perplexity.ai](https://www.perplexity.ai/) |
| **Gemini** | Google Sheets work, video/audio analysis | [gemini.google.com](https://gemini.google.com/) |

### Productivity Tools

| Tool | What it does | Why I use it | Link |
|------|-------------|-------------|------|
| **Wispr Flow** | Dictation everywhere on Mac | I dictate most of my Claude Code input. 3-5x faster than typing for long instructions. | [wispr.flow](https://www.wispr.flow/) |
| **Granola** | Meeting transcription | Runs silently in the background. Transcripts feed into my meeting-to-action-item pipeline. | [granola.ai](https://www.granola.ai/) |
| **Zotero** | Reference management | Connected to Claude via MCP. I can search my library and pull citation details from the terminal. | [zotero.org](https://www.zotero.org/) |

### Infrastructure

| Tool | Role in this project | Link |
|------|---------------------|------|
| **GitHub** | Version control, hosting, collaboration | [github.com/chrisblattman/claudeblattman](https://github.com/chrisblattman/claudeblattman) |
| **GitHub Pages** | Free site hosting, auto-deploys on push | [pages.github.com](https://pages.github.com/) |
| **GitHub Actions** | CI/CD — builds and deploys the site | Configured in `.github/workflows/deploy.yml` |

---

## AI for Economists and Researchers

This site focuses on project management, communication, and workflow automation. But the biggest wave of AI adoption in economics is around **data analysis, statistical coding, and empirical methods** — areas I haven't covered yet (coming soon). These are the essential resources for that side of the work.

### Anton Korinek — Generative AI for Economic Research

[:octicons-link-external-16: JEL Paper (AEA)](https://www.aeaweb.org/articles?id=10.1257/jel.20231736) · [:octicons-link-external-16: AI Agents Update (NBER, 2025)](https://www.nber.org/papers/w34202) · [:octicons-link-external-16: Substack](https://genaiforecon.substack.com)

The authoritative academic treatment. Korinek's 2023 *Journal of Economic Literature* paper identifies six use case domains for LLMs in economics (ideation, writing, background research, data analysis, coding, mathematical derivations) and has been updated twice — most recently with an NBER working paper on AI agents for autonomous literature reviews, econometric coding, and data analysis. If you read one academic paper on this topic, make it this one.

### Scott Cunningham — MixtapeTools

[:octicons-link-external-16: GitHub](https://github.com/scunning1975/MixtapeTools) · [:octicons-link-external-16: Substack](https://causalinf.substack.com)

A GitHub repo of tools for coding, teaching, and presentations with AI assistance — includes a "Referee 2" audit protocol for verifying empirical code across R/Stata/Python, a PDF reading skill for parsing academic papers, and a CLAUDE.md template for Claude Code sessions. Cunningham (author of *Causal Inference: The Mixtape*) also writes regularly about AI and causal inference on Substack.

### Awesome Econ AI Stuff

[:octicons-link-external-16: meleantonio.github.io](https://meleantonio.github.io/awesome-econ-ai-stuff/)

14+ curated AI skills across 7 categories (Analysis, Data, Theory, Writing, Communication, Literature, Ideation) designed for Claude Code, Cursor, and GitHub Copilot. Includes skills that automate DiD/IV/RD coding in Stata and LaTeX paper writing. The closest thing to a skill library specifically for empirical economists.

### More Resources

| Resource | Focus |
|----------|-------|
| [Jesse Lastunen — AI for Economists](https://sites.google.com/view/lastunen/ai-for-economists) | Worked prompt examples across Korinek's six domains, with real LLM outputs and usefulness ratings |
| [Guide2EconRA (GitHub)](https://github.com/Alalalalaki/Guide2EconRA) | Comprehensive resource collection for economics RAs — Python/R/Julia/Stata, causal inference, ML, reproducibility |
| [AEI — AI Tools for Economists](https://www.aei.org/technology-and-innovation/ai-tools-for-economists-and-policy-analysts/) | Practical tool comparison (ChatGPT, Claude, Gemini, NotebookLM, Cursor) written for policy economists |

Know a resource that should be here? [Send a quick note](mailto:claudeblattman+feedback@gmail.com?subject=AI%20for%20economists%20resource) — I'm always looking for what I've missed.

---

## Further Reading

Resources for thinking about AI in research and professional work more broadly.

| Resource | Why it's worth reading |
|----------|----------------------|
| [Simon Willison's Blog](https://simonwillison.net/) | The most technically literate and honest AI blog. Simon builds tools and explains what works without hype. |
| [Claude Code projects on GitHub](https://github.com/topics/claude-code) | Community projects, extensions, and configurations tagged with "claude-code" on GitHub. |
| [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/) | Active subreddit for Claude users. Good for troubleshooting and discovering new patterns. |
| [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | Curated index of Claude Code skills, hooks, slash commands, and CLAUDE.md patterns. The closest thing to a package manager catalog for the ecosystem. |
| [awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | 380+ curated skills from official dev teams (Anthropic, Vercel, Stripe, Cloudflare) and community. Cross-tool compatible. Quality-vetted. |
| [Claude Code Ultimate Guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide) | 20,000+ lines, 16 specialized guides, 41 diagrams. The most comprehensive community reference for Claude Code architecture and workflows. CC BY-SA 4.0 licensed. |
| [LangChain Executive AI Assistant](https://github.com/langchain-ai/executive-ai-assistant) | Production-ready Gmail-monitoring AI agent framework. Their "draft-only" pattern and human-in-the-loop review influenced how I built inbox triage. |

---

## Contributing

Found a resource that should be here? Have a correction? Open an issue or start a discussion on [GitHub](https://github.com/chrisblattman/claudeblattman/discussions).
