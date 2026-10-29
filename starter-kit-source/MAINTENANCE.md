# One source, two host packages

`starter-kit-source/skills/` owns six workflow instructions. `agents/` owns four personas, copied once into each plugin’s `shared/personas/` folder. Both panel skills reference those shared files; no per-skill persona copies are generated. Council's `scripts/` and `references/` own the shared panel implementation, copied into Adversarial Review at build time. `adapters/shared/` owns provider transport, copied identically into both Ask Agents packages. Host adapters describe only native dispatch and optional command aliases. No private runtime dependency is shipped.

```sh
python3 scripts/build-all-plugins.py
python3 scripts/build-all-plugins.py --check
python3 scripts/test-starter-packages.py
node --test scripts/test-agent-transport.mjs
python3 scripts/test-release-scanner.py
bash scripts/emit-public.sh
bash scripts/check-public-release.sh
python3 scripts/build-all-plugins.py --check --package-dir /absolute/private/release-output
python3 scripts/scan-public.py --archive /absolute/private/release-output/starter-kit-claude-0.3.0.zip --archive /absolute/private/release-output/starter-kit-codex-0.3.0.zip
```

Use Python 3.11+ for the transport TOML tests (`STARTER_KIT_PYTHON` can select it).

The builder regenerates `plugins/starter-kit-claude/` and `plugins/starter-kit-codex/`. Archives each contain exactly one plugin; catalogs stay outside. No build command uploads, installs, changes login, or modifies preferences. Plugin installation is the sole supported distribution path for both hosts.

## Public adaptations

The refreshed workflows preserve independent work, development versus review, report retention, fresh synthesis, explicit failure reporting and one-pass revision. Public defaults use three/four local personas, not a private multi-provider default. Provider panels use fresh host chairs. User-owned settings survive updates. The transport uses analysis permissions, not private permission bypasses. Paths resolve locally; private names, account details, hardcoded project roots and private helper dependencies are excluded.

Grok's subscription wrapper is adapted with official binary checks and public home-directory discovery. Reviewed version/checksums are in its source. Never remove those checks to accept an unknown binary. Browser Expert is not part of the public kit. Gemini uses Antigravity, not Gemini CLI. No provider/model fallback is automatic.

Private source hashes and derivation notes belong in the maintainer's private review workspace, not this package. Refresh source behavior deliberately, then regenerate all targets. The older reference library is not the authority for overlapping starter workflows.

## Acceptance boundary

Offline fixtures establish packaging and orchestration bookkeeping, not real provider availability. Before public release, record fresh install and actual native three-persona/four-reviewer runs in each host; connect and test each advertised provider; verify failure/partial-response behavior and preference preservation through an upgrade. Record client/CLI versions and account route without credentials. Grok pins currently support macOS only; native Windows external transport has not been accepted. Do not advertise private certification or native hosting in other apps.

## Adapter differences

Both packages have the same six workflow instructions, shared persona definitions, panel runtime and provider transport. `adapters/claude/host.md` and `adapters/codex/host.md` differ only in the native worker mechanism and host-specific instructions. The shared provider scripts work for either host; the separate Grok wrapper handles that provider's subscription/authentication contract.

Claude additionally has optional `commands/codex.md`, `commands/gemini.md` and `commands/grok.md` shortcuts. They delegate to Ask Agents; Codex users make the same requests through Ask Agents. They are conveniences, not additional workflows or connections. Claude's native named-agent copies are not generated: both hosts use the shared persona text.

`build-all-plugins.py` builds both packages. The former Codex-named build script was only an alias for the same build and has been removed. Claude's package directory/archive includes `claude` explicitly; its published plugin ID remains `starter-kit` to preserve the existing installation identity. Host manifest formats remain different.
