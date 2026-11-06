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
| Gemini | `agy` on PATH or `ANTIGRAVITY_CLI_PATH`; interactive `agy` login | Fresh Antigravity print session using the user's saved execution mode; never Gemini CLI |
| Grok | Verified official binary and local subscription login; details below | Fresh Grok Build session, auto-review permissions, consumer OAuth only |

Use a trusted project directory: providers may load its existing instructions, hooks and connectors. The kit does not grant workspace trust or bypass approvals. Claude plan mode and the other providers' execution modes are not interchangeable permission profiles. Every provider receives an analysis-only task scope; provider permissions still apply, and that instruction is not an OS read-only sandbox. Subagents must report sources they actually read and any access limits.

Antigravity receives the shared analysis instructions and complete task as one plain-text argument to `--print`, with empty, closed standard input. JSON is used for output events only. The helper passes arguments directly without shell interpolation. Claude and Codex continue receiving the same shared instructions and task through standard input. Task text is subject to the operating system's command-argument size limit; a launch failure is reported without an automatic fallback.

The Antigravity runner passes neither `--mode` nor `--settings` and never edits personal configuration. For unattended command access, neighboring Kit Setup can merge `"agentMode": "auto"` into `~/.gemini/antigravity-cli/settings.json` with the user's authorization, preserving other settings. This is a one-time, CLI-wide preference, not an action repeated by Ask Agents. Auto can approve workspace edits and routine commands; it is not equivalent to Codex's read-only sandbox. It requires a supported account and terminal sandbox. Explicit permission rules still apply. Kit Setup verifies an actual harmless command as well as a greeting; startup mode fields or warnings alone do not establish effective access. If access fails, report it without widening permissions or retrying through another route. See [Antigravity execution modes](https://antigravity.google/docs/cli/modes/) and [sandbox requirements](https://antigravity.google/docs/sandbox/).

`result.json` contains state, the full report path (`response.md` in the output directory), execution/session identity where available, and diagnostics. Raw streams and the exact prompt are retained privately. Treat these artifacts as potentially sensitive; do not commit them or include them in a distributed kit. A successful process alone is insufficient: parsers require the provider's terminal success event and substantive text. Partial text survives failures. `observed_model: null` means unavailable, not inferred from the request. Grok's aggregate model usage does not establish its root model. Cost metadata does not prove a separate charge.

## Grok subscription route

The bundled `grok-agent-run.mjs` accepts only official Grok Build **1.0.70** with the fixed macOS arm64/x64 SHA-256 values in its source. An explicit `GROK_CLI_PATH` is authoritative: if it is invalid, the wrapper stops rather than trying another installation. Otherwise discovery checks `~/.local/share/grok-build/1.0.70/grok`, `~/.grok/bin/grok`, then PATH. Binary symlinks are accepted only when their resolved target is a regular readable executable with the reviewed hash. Missing, unreadable, mismatched and non-executable candidates are reported separately; unknown bytes are never invoked. Architecture follows the running Node process, including translated Node on Apple Silicon.

Login-home precedence is unchanged: explicit `GROK_HOME`, an existing dedicated `~/.grok-build-agent/auth.json`, then standard `~/.grok`. The credential file must be regular, owned by this user and owner-only; credential symlinks are rejected. Diagnostics show the selected home and reason without reading tokens. No credential migration or automatic permission repair occurs. The wrapper and login launcher remove inherited Grok/xAI environment settings, then restore only the selected home and disabled updater. Normal execution rejects custom API/auth/model/endpoint configuration before submission.

Grok preflight requires **Python 3.11+ with tomllib**, even when there are no configuration layers yet. `STARTER_KIT_PYTHON`, when set, is one literal executable and never falls back. Without it, the adapter tries `python3`, then versioned `python3.<minor>` executables (3.11+) in PATH directory order and the common macOS directories `/opt/homebrew/bin` and `/usr/local/bin`, newest minor first within each directory. It reports the selected path/version. Probes and parsing use Python isolated mode (`-I`) so project modules and Python environment settings cannot shadow the parser. Missing Python, invalid TOML and rejected configuration have separate diagnostics; configuration values are not echoed.

### Grok setup sequence

Resolve `<ask-agents>` to the installed Ask Agents skill folder. Setup uses the same pins, paths and environment handling as execution:

```text
node <ask-agents>/scripts/grok-setup.mjs check
node <ask-agents>/scripts/grok-setup.mjs install
node <ask-agents>/scripts/grok-setup.mjs login
node <ask-agents>/scripts/run-agent.mjs --agent grok --preflight --cwd <trusted-project>
node <ask-agents>/scripts/run-agent.mjs --agent grok --smoke-test --output-dir <new-private-directory>
```

1. **Check first.** `check` reports binary, Python and auth-file metadata, including multiple missing prerequisites, without executing Grok, downloading, or signing in. It exits nonzero when a prerequisite is missing. `metadata_checks_passed` does not mean authenticated or fully configured. Normal preflight additionally invokes bounded version/configuration probes; those CLI commands may discover user-level compatible tooling and are not a sandbox.
2. **Install only within the user's requested setup scope.** `install` downloads the exact reviewed official gzip artifact, decompresses it into a private temporary file, checks the complete binary hash before making it executable, and installs at the versioned target shown by `check`. A matching usable regular file is a no-op. Any unexpected existing destination, including a symlink, is a conflict; it is never overwritten. Failed downloads remove only helper-owned temporary material. The helper does not run the official installer, edit shell profiles, add a generic shell `grok` command, or upgrade a pin. A bad `GROK_CLI_PATH` must still be corrected or unset explicitly. If the pinned release is unavailable or differs, report the blocker rather than approving new bytes.
3. **Address Python if needed.** Select an already installed compatible interpreter with `STARTER_KIT_PYTHON`, or guide installation separately. The helper does not install Python or change the system default.
4. **Show the selected home, then sign in interactively.** `login` verifies the pinned binary and version, uses a temporary working directory and the shared sanitized environment, and runs `login --oauth` with inherited terminal I/O. For device-code authentication, use `grok-setup.mjs login --device-auth`. It never runs as a side effect of check/install and does not require an existing login or Python. The user completes the provider flow; never request a token in chat. If no interactive terminal is available, give the exact helper command for their terminal. Existing unsafe auth-file metadata blocks login for review.
5. **Verify execution separately.** Run normal preflight in the intended trusted directory, then the authorized smoke test. Read the receipt and full `response.md`; require a success state and the exact `starter-kit-ok` reply. Preflight's `model_prompt_submitted: false` and successful login-process exit do not establish provider access. Preserve failed/partial results and report the actual stage; no automatic fallback.

Subscription usage depends on the account's allowance and existing billing settings. Setup never changes plans or enables top-ups. A local check cannot establish remaining entitlement, actual served-model identity, or a billing outcome.

Grok sources checked November 6, 2026: [official installer source](https://x.ai/cli/install.sh), [CLI reference](https://docs.x.ai/build/cli/reference). Both pinned architecture artifacts matched their hashes. On arm64, the verified binary's version, help, login help and configuration inspection passed without authentication; x64 execution and an authenticated Grok request remain unverified. Current docs do not prove all behavior of the pinned release. Earlier general references: [Grok Build](https://docs.x.ai/build/overview), [subscription usage](https://docs.x.ai/grok/faq), [Antigravity headless mode](https://antigravity.google/docs/cli/headless/).
