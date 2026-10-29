# 0.3.0 review candidate — October 29, 2026

- Plugin installation for both hosts; no separate manual Codex installer.
- One shared persona folder per plugin, used by both panel workflows.
- Explicit Claude/Codex package folder names and one shared build command.
- Six shared skills, including separate development Council and Adversarial Review.
- Three local development personas; four local reviewers; fresh synthesis for both.
- Exact custom provider panels, Light and Full counts, and saved user defaults with backups/reset.
- One transport shared by Claude and Codex; live connection discovery; no provider/model fallback.
- Gemini uses Antigravity. Grok uses the reviewed official subscription-authenticated CLI and automatically retained reports. Kit Setup covers both.
- Missing connections, partial output, changed evidence and incomplete panel coverage remain visible.
- Done preserves unrelated unfinished work. Conflicting standalone council/review/done downloads are migration notices.
- Public source and archive scans fail closed, handle unusual filenames, and check private-key markers and personal paths.

## Completed validation

36 offline tests passed: 15 packaging/archive/preference tests, 15 provider protocol/subprocess tests, and 6 release-scanner regression tests. Provider subprocess tests use fake CLIs and do not contact live services. Generated package parity and release-manifest checks pass. Source and both generated ZIPs were scanned; no sensitive personal or institutional data or credentials were identified in the installable packages. No private name blocklist was supplied, so this is a bounded inspection rather than a guarantee about every possible private fact.

## Acceptance still required

A fresh install in each host, actual native Council and four-reviewer runs, each authenticated external connection, interruption recovery and update behavior with real host state remain untested for this candidate. Live testing is intentionally separate from this package update. Grok's reviewed binary pin currently supports macOS only. No native host package is claimed for Gemini, Antigravity or Grok. No private model/provenance certification is claimed.

This candidate has not been merged to main, published, or installed into an existing user configuration. A later release should replace this candidate note with actual live acceptance evidence.
