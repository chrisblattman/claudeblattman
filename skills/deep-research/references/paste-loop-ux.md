# Paste-Loop UX (ChatGPT / Grok / Perplexity / Gemini Deep Research)

For tools Claude Code cannot drive directly, `/deep-research` uses a **two-invocation pattern**: emit the prompt to disk, print a copy/paste hint, exit cleanly. The user pastes the result back via `/deep-research --absorb`.

VS Code-native workflow: drop the response file into the resolved project's `raw-inputs/` via the file explorer, then run `--absorb` in the integrated terminal.

## Why two invocations

Claude Code cannot pause a Bash call mid-execution to wait for the user to paste a response. A single-invocation "wait for paste" pattern is architecturally impossible. Splitting into two invocations is the simplest reliable design.

## Phase 3 — Emit (Dispatch mode, paste-loop tools)

After Phase 1.4 resolves `$PROJECT_DIR` and Phase 1.5 archives the prompt there, print:

```
════════════════════════════════════════════
PROMPT FOR <TOOL_NAME>
════════════════════════════════════════════

Project (resolved): <PROJECT_NAME>
Project folder:     <PROJECT_DIR>

Built prompt is at:
  /tmp/dr-prompt-<RUN_ID>.md

Also archived to:
  <PROJECT_DIR>/<DATE>_<SLUG>_prompt.md

Tool-specific notes:
<TOOL-SPECIFIC HINT — see table below>

When you have the response, return one of two ways:

  (A) Drag-drop in your editor:
      Drop the .md file into <PROJECT_DIR> via the file explorer,
      then run: /deep-research --absorb
      (the skill scans raw-inputs/ for unindexed files and prompts for metadata)

  (B) Explicit path:
      /deep-research --absorb <path-to-pasted-file> [--synthesize]

Skill exiting now. No inline wait.
════════════════════════════════════════════
```

Tool-specific hints:

| Tool | Hint |
|------|------|
| `chatgpt` | "Open ChatGPT → enable Deep Research mode → paste prompt. Save response as `.md`. PUA artifacts will be auto-stripped on absorb." |
| `grok` | "Open Grok → enable DeepSearch (NOT standard) → paste prompt. Save response as `.md`. Grok output rarely needs cleanup." |
| `perplexity` | "Open Perplexity → enable Deep Research → paste prompt. Save response as `.md`. Perplexity already has citation links inline." |
| `gemini-deep` | "Open Gemini → enable Deep Research → paste prompt. Save response as `.md`. Note: this is the browser product, NOT the Gemini CLI." |

## Phase 4 — Absorb (Absorb mode)

`/deep-research --absorb [<file>] [--synthesize]` archives a pasted external report. See `SKILL.md` § Absorb mode for full details (Path A: scan all `raw-inputs/` for unindexed files; Path B: explicit single file).

If `--synthesize` is set, calls `/dr-synthesize` after archiving. Synthesis is written **into the same project folder** as its primary input(s), not into the central archive. The first section of the synthesis must be:

```markdown
## Source Reports
- [chatgpt run] <project-folder>/<DATE>_<SLUG>_chatgpt.md
- [Original prompt] <project-folder>/<DATE>_<SLUG>_prompt.md
```

## Tool inference for `--absorb`

If `--tool` is not passed on `--absorb`, infer from filename or content:
- ChatGPT exports: PUA characters present (e.g., ``–``) → `chatgpt`
- "Powered by Sonar" / "Perplexity AI" footer → `perplexity`
- "xAI" / "Grok" header → `grok`

If inference fails, prompt the user once: `read -p "Tool used? [chatgpt/grok/perplexity/gemini-deep]: "`.
