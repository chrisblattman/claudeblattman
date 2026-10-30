---
description: Other approaches to councils and adversarial review, with links to their authors’ installation guides.
---

# Other council and adversarial review skills

You do not need my starter kit to try this way of working. This is an occasionally updated list of other implementations worth exploring. Their authors make different choices about council members, synthesis, and repeated review.

*Last checked: October 22, 2026. Descriptions below come from the projects’ own documentation. These are options to investigate, not tools I have tested or ranked.*

## Reasoning, decisions, and research

| Skill | What its authors describe | What to know before choosing it |
|---|---|---|
| [Quorum — GTuritto](https://github.com/GTuritto/quorum) | Challenges plans, compares approaches, and reviews work in Codex, Claude Code, and other compatible tools. | Its Full mode uses independent workers when the tool supports them. Mini mode uses several perspectives in one conversation; it is not the independent council described in this guide. |
| [The Council — DantesPeak85](https://github.com/DantesPeak85/the-council) | Claude asks Codex and Gemini for independent analyses, then combines their recommendations. | Intended for Claude Code with the external tools connected. Read its current setup requirements and version notes. |
| [Adversarial Research Loop — CodeReclaimers](https://github.com/CodeReclaimers/adversarial-loop) | An outside model challenges a research project; Claude investigates the concerns with tests and evidence across repeated rounds. | Closest to the research-and-revision part of the workflow. It assumes a project whose claims can be investigated, rather than only editing a piece of prose. |

## Primarily for code and technical plans

| Skill | What its authors describe | What to know before choosing it |
|---|---|---|
| [Review Council — ianpcook](https://github.com/ianpcook/review-council-skill) | Several review perspectives examine the same code change, then an independent critic challenges the proposed findings. | Packaged for Claude Code, Codex, Cursor, and compatible tools. Its output is a code-review verdict, so it is not a direct replacement for a general proposal-writing council. |
| [Adversarial Review — j-wang](https://github.com/j-wang/adversarial-review-skill) | Fresh Claude and Codex reviews, with optional additional models, followed by verification of the findings against the code. | Runs from Claude Code and needs the chosen external tools. The design emphasizes checking whether objections are supported. |
| [Review Council — DeployHQ](https://github.com/deployhq/review-council) | Independent model reviews of code or plans, a challenge to their findings, and a final judge that prioritizes the result. | A more elaborate Claude Code plugin. Read its model and tool requirements before choosing it for a small task. |

Follow the installation guide in the linked repository; the packages and command names differ. Ask your agent whether the chosen skill runs separate subagents, which models it can call, and where it saves the result. Then return to [step two of Council basics](../starter-kit/occasional.md#2-connect-other-ais-if-you-have-them) to choose your members.
