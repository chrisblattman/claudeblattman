---
name: kit-setup
description: Discover and test optional Claude, Codex, Gemini through Antigravity, and Grok subscription connections. Help with missing CLI or login setup without changing panel defaults.
---

# Set up connections

Read neighboring Ask Agents' `references/transport.md` and this skill's `references/host.md`. Ask which connection only if unclear. Native local panels need no extra subscription. Optional providers require their own supported CLI and login. Setup does not change panel defaults, global instructions, permissions, billing, or top-ups.

1. Check Node 18+ and the requested connection with `node <ask-agents>/scripts/run-agent.mjs --agent <provider> --preflight`. Record detected versus authenticated separately. Detection alone is never success. Manually connected providers work without a kit registry; every invocation performs live discovery. Ignore obsolete `engines.json` availability flags.
2. For Gemini, discover `agy` (Antigravity), not `gemini`. A desktop sign-in alone does not establish CLI authentication; complete an interactive `agy` login if required. Do not grant trust or bypass permissions automatically.
3. For Grok, follow the pinned official CLI checks and login-home selection in the transport reference. Check Python 3.11+ or `STARTER_KIT_PYTHON`. Use subscription login through the official CLI; never ask for a token in chat or switch to API credentials. If installation is needed, consult current official instructions and the reviewed version/checksum. Do not buy subscriptions or enable extra usage.
4. Test each requested connection with `--smoke-test --output-dir <new-private-directory>`. This sends only “Reply with exactly: starter-kit-ok” from a new empty temporary folder. No project context. A setup/test request authorizes this small test, subject to host approvals. Read the resulting full report and receipt; require a success state **and** the expected reply. Grok warnings about model telemetry do not mean billing failure; report them accurately.
5. For login failure, guide the provider's interactive login and retry only after it is completed. For other failures, report the actual stage and remedy. A failed test remains failed; no fallback or endless retries.

Return a short table: requested service, executable detected, request tested, result/next step. Link retained test receipts if useful. Do not create a durable `available:true` gate; tests are point-in-time evidence. Never overwrite saved panel preferences. If the user explicitly asks to change those, use Council's preference helper and show the undo command. Setup alone does not prove that a complete multi-provider panel works.
