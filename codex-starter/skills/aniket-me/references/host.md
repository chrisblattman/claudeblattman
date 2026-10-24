# Codex host adapter

The host is Codex. Resolve paths from this skill's installed directory. Use the host's native collaboration/spawn-agent facility to start fresh workers with no inherited conversation (`fork_turns: "none"` where supported). Supply the exact assignment, complete persona, original evidence paths, and unique report path. Independent members may run concurrently within the host's capacity. If all slots are occupied, queue the remaining independent workers without exposing previous answers. Wait for terminal results; a fresh synthesis uses a new worker. If native subagents are unavailable, report the limitation rather than simulating them in the host answer.

The starter local default uses the user's current model/effort unless a supported explicit request overrides it. Record the selection available from the host, and distinguish it from provider-observed telemetry. Do not claim Chris's pinned balanced defaults. Respect host approvals and workspace boundaries.

For Ask Agents, follow its transport reference and bundled Node runner. Kit Setup checks Node 18+, `command -v claude`, and `command -v gemini`, then uses that runner for the requested smoke test. This adapter discovers services live and does not use Claude's engines.json. Do not install or overwrite global AGENTS.md during plugin setup.
