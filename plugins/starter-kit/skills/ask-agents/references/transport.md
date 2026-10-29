# Shared provider transport

Both host packages use the same `scripts/run-agent.mjs`. Requires Node 18+. Supported execution environment: macOS/Linux for Claude, Codex and Antigravity CLIs; the pinned Grok adapter currently supports macOS arm64/x64 only. Windows native provider execution is not validated; do not claim it works. Native local panels do not require Node.

```text
node <ask-agents>/scripts/run-agent.mjs --agent <claude|codex|gemini|grok> --preflight --cwd <project>
node <ask-agents>/scripts/run-agent.mjs --agent <provider> --prompt-file <absolute-prompt.md> --cwd <project> --output-dir <new-private-directory>
node <ask-agents>/scripts/run-agent.mjs --agent <provider> --smoke-test --output-dir <new-private-directory>
```

Each run uses a new directory; never reuse an old result. `--model` and `--effort` preserve explicit requests. Without them Claude/Codex/Antigravity use their account defaults; Grok uses the reviewed adapter default grok-4.7/xhigh. The kit never retries on another model or provider. Local version probes have a short operational timeout; research calls have no kit-imposed time/turn/output/spending cap. Antigravity uses its maximum supported print duration. Provider limits still apply.

| Provider | Discovery and login | Execution |
|---|---|---|
| Claude | `claude` on PATH or `CLAUDE_CLI_PATH`; provider login | Fresh print session, plan permissions; requests requiring interactive permission fail rather than auto-approve |
| Codex | `codex` on PATH, `CODEX_CLI_PATH`, or known macOS app CLI paths; `codex login` | Fresh exec session, read-only sandbox |
| Gemini | `agy` on PATH or `ANTIGRAVITY_CLI_PATH`; interactive `agy` login | Fresh Antigravity print session, plan mode; never Gemini CLI |
| Grok | Verified official binary and local subscription login; details below | Fresh Grok Build session, auto-review permissions, consumer OAuth only |

Use a trusted project directory: providers may load its existing instructions, hooks and connectors. The kit does not grant workspace trust or bypass approvals. Claude/Antigravity plan modes and Grok auto-review are provider behavior, not a claim of an OS sandbox. Grok receives an analysis-only task scope; it retains the official CLI’s normal permission checks. Permission refusals remain visible. Subagents must report sources they actually read and any access limits.

`result.json` contains state, full report path, execution/session identity where available, and diagnostics. Raw streams and the exact prompt are retained privately. Treat these artifacts as potentially sensitive; do not commit them or include them in a distributed kit. A successful process alone is insufficient: parsers require the provider's terminal success event and substantive text. Partial text survives failures. `observed_model: null` means unavailable, not inferred from the request. Grok's aggregate model usage does not establish its root model. Cost metadata does not prove a separate charge.

## Grok subscription route

The bundled `grok-agent-run.mjs` is a portable adaptation of the reviewed subscription wrapper. It checks official Grok Build **1.0.70** against fixed macOS arm64/x64 SHA-256 values. Discovery checks `GROK_CLI_PATH`, `~/.local/share/grok-build/1.0.70/grok`, and PATH candidates; only a matching binary is accepted. It will not invoke an unrelated executable called `grok` or silently update the pin.

Login comes from an explicit `GROK_HOME`, an existing dedicated `~/.grok-build-agent/auth.json`, or the standard `~/.grok/auth.json`. The file must be a regular owner-only file. Tokens are never printed or copied. A manually installed matching CLI and existing login work without Kit Setup. The wrapper removes inherited Grok/xAI environment settings except its selected home and updater setting, and rejects custom API/endpoint configuration before sending the prompt. It needs **Python 3.11+** for TOML validation; set `STARTER_KIT_PYTHON` to that interpreter if `python3` is older.

If the pin is missing, Kit Setup should guide installation of the corresponding official native release and verify its checksum; do not fetch a third-party package or approve an unknown binary merely because its name matches. If the official release cannot be obtained or the schema changed, report the blocker. Do not downgrade provider settings, bypass checks, or use an API key.

Sign into the selected Grok home using the official CLI's interactive login flow. Subscription usage includes Grok Build within the account's allowance; additional usage depends on the user's billing settings. Kit Setup never enables top-ups, changes plans, or promises unlimited usage. A local preflight verifies the route and files, not remaining entitlement; an authorized smoke test verifies a request succeeds.

Sources checked October 29, 2026: [Grok Build](https://docs.x.ai/build/overview), [Grok CLI](https://docs.x.ai/build/cli/reference), [subscription usage](https://docs.x.ai/grok/faq), [Antigravity headless mode](https://antigravity.google/docs/cli/headless/). Exact release compatibility still requires live acceptance testing.
