# One source, two host packages

`starter-kit-source/skills/` owns six workflow instructions. `agents/` owns four personas. Council's `scripts/` and `references/` own the shared panel implementation, copied into Adversarial Review at build time. `adapters/shared/` owns provider transport, copied identically into both Ask Agents packages. Host adapters describe only native dispatch and optional command aliases. No private runtime dependency is shipped.

```sh
python3 scripts/build-starter-plugins.py
python3 scripts/build-starter-plugins.py --check
python3 scripts/test-starter-packages.py
node --test scripts/test-agent-transport.mjs
python3 scripts/test-release-scanner.py
bash scripts/emit-public.sh
bash scripts/check-public-release.sh
python3 scripts/build-starter-plugins.py --check --package-dir /absolute/private/release-output
python3 scripts/scan-public.py --archive /absolute/private/release-output/starter-kit-0.3.0.zip --archive /absolute/private/release-output/starter-kit-codex-0.3.0.zip
```

Use Python 3.11+ for the transport TOML tests (`STARTER_KIT_PYTHON` can select it).

The builder regenerates both plugin directories and manual Codex skills. Archives each contain exactly one plugin; catalogs stay outside. No build command uploads, installs, changes login, or modifies preferences. The manual installer preserves existing files and does not install global guidance unless explicitly requested.

## Public adaptations

The refreshed workflows preserve independent work, development versus review, report retention, fresh synthesis, explicit failure reporting and one-pass revision. Public defaults use three/four local personas, not a private multi-provider default. Provider panels use fresh host chairs. User-owned settings survive updates. The transport uses analysis permissions, not private permission bypasses. Paths resolve locally; private names, account details, hardcoded project roots and private helper dependencies are excluded.

Grok's subscription wrapper is adapted with official binary checks and public home-directory discovery. Reviewed version/checksums are in its source. Never remove those checks to accept an unknown binary. Browser Expert is not part of the public kit. Gemini uses Antigravity, not Gemini CLI. No provider/model fallback is automatic.

Private source hashes and derivation notes belong in the maintainer's private review workspace, not this package. Refresh source behavior deliberately, then regenerate all targets. The older reference library is not the authority for overlapping starter workflows.

## Acceptance boundary

Offline fixtures establish packaging and orchestration bookkeeping, not real provider availability. Before public release, record fresh install and actual native three-persona/four-reviewer runs in each host; connect and test each advertised provider; verify failure/partial-response behavior and preference preservation through an upgrade. Record client/CLI versions and account route without credentials. Grok pins currently support macOS only; native Windows external transport has not been accepted. Do not advertise private certification or native hosting in other apps.
