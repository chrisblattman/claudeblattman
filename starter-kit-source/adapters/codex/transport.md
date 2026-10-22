# Codex external-call mechanics

Use the existing bundled Node runner. Node 18+ and the requested Claude Code or Gemini CLI must be installed and authenticated. The shared Ask Agents skill owns the request and authorization behavior.

```text
node <skill-directory>/scripts/run-external-agent.mjs --agent claude --prompt-file <prompt.md> --cwd <project> --state-dir <unique-private-directory>
node <skill-directory>/scripts/run-external-agent.mjs --agent gemini --prompt-file <prompt.md> --cwd <project> --state-dir <unique-private-directory>
```

`--agent both` is supported for an explicit request to both services. Repeat `--context <relative-project-path>` for authorized evidence. Separate invocations are required for separate independent members from one service. Long prompts belong in files, not shell interpolation.

Actual defaults: 300-second timeout, 50,000-byte output cap; Claude has eight turns and a $2 cap. The documented runner permits `--timeout`, `--max-output`, `--max-turns`, `--max-budget`, `--claude-model`, and `--claude-effort`; inspect its help for valid values. It requests read-only work and checks workspace changes. These limits and the Gemini CLI route differ from Chris's audited Council runtime. Do not claim unlimited execution, identical capability, or audited balance.

Read the returned report and execution record. Preserve failures and partial substantive content, requested versus observed model, and access limitations. Never label a host-written response as an external result. Connection tests run in an empty temporary folder without context files.
