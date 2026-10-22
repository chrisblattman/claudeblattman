# Codex starter kit

The plugin and manual installer provide `/council`, `/kit-hello`, `/kit-setup`, `/ask-agents`, and `/done`. The source is `../starter-kit-source/`; do not edit these generated skills.

Council's default is three local independent members and a fresh synthesis. Chris's provider-balanced Light/Full runtime is a documented remaining dependency, not enabled by the current outside-opinion runner. See the Council runtime-status reference.

```sh
python3 install-codex-starter.py status
python3 install-codex-starter.py install
python3 install-codex-starter.py verify
python3 install-codex-starter.py uninstall
```

The installer backs up existing files before replacing them and restores originals on uninstall. Global AGENTS.md is not installed unless you explicitly add `--include-global-guidance`. Retired prompt/review-plan files in an existing installation are reported and preserved for deliberate migration; they are absent from this package.

For an isolated test, pass `--target-root /absolute/disposable/codex-root` to each command. This avoids changing your working installation. The plugin does not install global guidance.

Build both packages together with `python3 scripts/build-starter-plugins.py` from the repository root. The same version is available as the `starter-kit-codex` plugin; see the repository README for installation.
