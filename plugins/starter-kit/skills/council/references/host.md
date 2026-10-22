# Claude host adapter

The host is Claude Code. Resolve paths from this skill's installed directory; do not assume a personal home path. Use the native Agent/Task tool to start fresh subagents, supplying the full frozen assignment and a separate report path. Use general-purpose workers with the provided persona text; named plugin agents are optional conveniences, not a second source of behavior. Independent members can run concurrently. A fresh synthesis is a new native worker, never the host session. If the host cannot start fresh workers, report that limitation.

The starter's local council uses the current session's available model unless the user requests another supported selection. Record what was requested and what the host actually reports; do not manufacture model-observation evidence. This starter default differs from Chris's provider-balanced model policy.

For Ask Agents, follow the neighboring Ask Agents transport reference and bundled shell wrappers. Kit Setup discovers Codex with `bash <ask-agents-directory>/scripts/codex-run.sh --which` and Gemini with `command -v gemini`. After a successful authorized connection test, update `~/.claude/starter-kit/engines.json` using the schema in the Ask Agents `references/engines-contract.md`, preserving unknown fields. No detected binary alone sets `available: true`.
