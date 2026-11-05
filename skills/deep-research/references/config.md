# /deep-research — Tunable Config

Skill reads this BEFORE any dispatch. Edit values here without touching SKILL.md.

## Defaults

| Setting | Default | Notes |
|---------|---------|-------|
| `--tool` | `both` | Claude WebSearch + Codex (gpt-5.4 or current frontier). Both fully automatic. Codex RED-gated per Phase 2. For 3-arm automatic (+ Gemini CLI), use `--tool all-auto`. Paste-loop arms (`chatgpt`/`grok`/`perplexity`/`gemini-deep`) are opt-in only, never volunteered. |
| `--depth` | `deep` | All 8 schema elements + "research current best practices" preamble |
| `--project` | (none) | If omitted, Phase 1.4 infers from routing config; if no match, prompt user to pick (do not silently fall back to `working-notes`) |

**Shortcut flag:** `--quick` is sugar for `--tool claude --depth standard` — the cheap/fast mode. Individual `--tool` and `--depth` flags override only that axis, not both.

## Codex thresholds (5-hour rolling window)

**Canonical source of truth:** `~/.claude-assistant/config/codex-thresholds.sh` (sourced by SKILL.md Phase 2). Edit that file to recalibrate.

```bash
PRO_5H_TOKEN_BUDGET=400000   # placeholder; calibrate against your plan tier
THRESHOLD_AMBER=0.60          # diagnostic-only; 2-tier dispatch ignores
THRESHOLD_RED=0.85            # >85% used → block (override with --force)
PROMO_EXPIRY="YYYY-MM-DD"     # optional stderr warning tripwire after this date
```

**Phase 2 simplification:** `/deep-research` collapsed to GREEN/RED (two-tier). AMBER was behaviorally identical to GREEN in pre-approved mode. `THRESHOLD_AMBER` retained only for an optional future `/codex:status` diagnostic command.

**Recalibration triggers:**
- Plan tier changes
- Quarterly review

## Permission prerequisites

**Before running `/deep-research --tool codex|both` for the first time on any machine, verify these rules exist in `~/.claude/settings.json` → `permissions.allow`:**

```
"Bash(/Applications/Codex.app/Contents/Resources/codex:*)",
"Bash(codex:*)",
"Bash(/opt/homebrew/bin/gemini:*)",
"Bash(gemini:*)",
"Bash(grok:*)",
"Bash(ccusage:*)"
```

**Why this is required despite `Bash(*)` being in the allow list:** Claude Code's permission sandbox has a heuristic layer on top of the pattern-match allow list. It flags invocations like `/Applications/Codex.app/... < <prompt-file>` as "executing code derived from untrusted content" and denies them with:

> "Invoking Codex binary from /Applications to execute code generated from untrusted research content creates an untrusted code integration / execution pathway not explicitly authorized by the user's prompt."

Explicit binary-path rules signal user-authorization and bypass the heuristic.

## Codex command flags

Verified against Codex CLI v0.122.0-alpha.1 (bundled with the Codex desktop app at `/Applications/Codex.app/Contents/Resources/codex`).

```bash
CODEX_BIN="$(command -v codex)"                               # prefer the PATH binary; fall back to
                                                              # /Applications/Codex.app/Contents/Resources/codex only if PATH misses
CODEX_MODEL="<latest frontier gpt-5.x>"                       # pick highest-capability first, fall back downward on failure
CODEX_UNATTENDED_FLAG="-c approval_policy=never --skip-git-repo-check"
CODEX_SANDBOX="--sandbox read-only"                            # web search + read-only FS
```

**Don't hardcode one model or the `.app` binary path** — both drift and break over time. Resolve the binary via `command -v codex`, and try the newest model first with a downward fallback on failure (under ChatGPT-account auth, some model IDs are rejected with HTTP 400, so a single hardcoded model will eventually stop working). A small wrapper script that owns binary resolution + model fallback is the durable pattern; the starter kit ships one as `codex-run.sh`.

Auth: log in via your ChatGPT account (writes `~/.codex/auth.json`). No API key needed.

### Dispatch command shape

Pass the prompt via **stdin redirect**, not as a `-- "$(cat …)"` positional. The positional+`--` form has caused `codex exec` to fall into `Reading additional input from stdin...` and hang indefinitely on v0.122.0-alpha.1.

```bash
"$CODEX_BIN" exec --model "$CODEX_MODEL" $CODEX_SANDBOX \
  $CODEX_UNATTENDED_FLAG \
  -o /tmp/dr-codex-$RUN_ID.md \
  < /tmp/dr-prompt-$RUN_ID.md \
  > /tmp/dr-codex-$RUN_ID.stdout 2>/tmp/dr-codex-$RUN_ID.stderr
CODEX_EXIT=$?
```

Stdout is captured because `-o file` does not silence Codex's streaming reasoning — the stdout file is a backup if `-o` itself fails.

**Smoke test on any Codex CLI version bump:**

```bash
echo "Say exactly: hello" > /tmp/codex-smoke.md
"$CODEX_BIN" exec --model "$CODEX_MODEL" --sandbox read-only \
  -c approval_policy=never --skip-git-repo-check \
  -o /tmp/codex-smoke-out.md < /tmp/codex-smoke.md
grep -q "hello" /tmp/codex-smoke-out.md && echo "OK" || echo "FAIL"
```

## Archive paths (federated model)

Reports live in their **project folders**, not in a central archive. The central directory holds only the pointer index.

```bash
# Pointer index (NO content lives here — only INDEX.md + INDEX.jsonl)
RESEARCH_INDEX_DIR=~/research-archive
RESEARCH_INDEX=~/research-archive/INDEX.md
RESEARCH_INDEX_JSONL=~/research-archive/INDEX.jsonl

# Routing config (keyword → project folder map)
ROUTING_CONFIG=~/.claude-assistant/config/deep-research-routing.json

# Project folder bases (routing config resolves to one of these)
#   1. ~/projects/<name>/raw-inputs/                         (general projects)
#   2. ~/Documents/research/<paper>/raw-inputs/              (research papers)

# Catch-all for unrouted/exploratory/meta research
DEFAULT_UNMAPPED_PROJECT=working-notes
DEFAULT_UNMAPPED_DIR=~/projects/working-notes/raw-inputs/
```

`du -sh ~/research-archive/` should stay under 1 MB indefinitely — anything larger means content leaked into the pointer dir.

## Filename convention

`YYYY-MM-DD_<slug>_<type>.md`

- `<type>` ∈ `prompt`, `claude`, `codex`, `gemini`, `chatgpt`, `grok`, `perplexity`, `synthesis`

## Frontmatter (required on every archived file)

```yaml
---
date: YYYY-MM-DD
topic: <verbatim from invocation>
tool: <claude|codex|gemini|chatgpt|grok|perplexity>   # omit on prompt files
model: <model id>                                      # omit on paste-loop tools
prompt_file: YYYY-MM-DD_<slug>_prompt.md               # omit on prompt files themselves
run_id: <RUN_ID from Phase 1.5>
---
```

## Cross-machine quota policy

The Codex quota check is per-machine — usage on other machines is invisible by default. For cross-machine visibility, symlink `~/.codex/sessions` to a synced path with a per-host subdir:

```bash
mv ~/.codex/sessions ~/.claude-assistant/codex-state/sessions-$(hostname -s)
ln -s ~/.claude-assistant/codex-state/sessions-$(hostname -s) ~/.codex/sessions
```

(Per-machine subdir prevents same-file write conflicts.)

## Logs

```bash
SKILL_PERF_LOG=~/.claude-assistant/logs/skill-performance.csv
CODEX_USAGE_LOG=~/.claude-assistant/logs/codex-usage.csv
```

## Gemini CLI

Used by `/deep-research --tool gemini|all-auto` and any future peer-dispatch skill.

```bash
GEMINI_BIN=$(command -v gemini)                # installed via: npm install -g @google/gemini-cli
GEMINI_OUTPUT_FORMAT=json                       # produces {"response": "..."} schema at current versions
# OAuth default model is gemini-2.5-flash-lite. Always pass -m gemini-2.5-pro explicitly
# for long-context work, or you silently get the weaker model.
# Model pinning under OAuth is best-effort; for guaranteed model selection migrate to API-key auth.

# Dispatch shape (-p is REQUIRED; positional hangs interactive):
#   "$GEMINI_BIN" -p "$PROMPT" -m gemini-2.5-pro --output-format "$GEMINI_OUTPUT_FORMAT" > "$OUT"
# For document input, pipe via stdin:
#   cat "$DOC" | "$GEMINI_BIN" -p "$PROMPT" -m gemini-2.5-pro --output-format json > "$OUT"
# Parse: jq -r .response "$OUT"   (verify schema at install; may differ across versions)
# NOTE: No -f / --file flag exists in CLI v0.38+. Use stdin for document content.

# Auth quota: free OAuth tier = 60 RPM / 1,000 RPD.
# NOTE: Consumer Gemini Advanced subscriptions do NOT raise CLI quota.
```

**Hollow-arm detection (pairs with SKILL.md Phase 3.5).** Gemini can return fluent, zero-citation prose that passes a naive exit-code check. Detect real browsing via the web-search call **count**, not token counters: `jq '.stats.tools.byName.google_web_search.count' "$OUT"` (vestigial `tokens.tool` reads 0 even when search ran). Treat an arm with zero searches AND zero URLs as `quality_note: synthesis-only`, not sourced research.

## Grok CLI (optional, paste-loop alternative)

```bash
GROK_BIN=$(command -v grok)                     # install: curl -fsSL https://raw.githubusercontent.com/superagent-ai/grok-cli/main/install.sh | bash
                                                #      OR: bun add -g grok-dev
GROK_MODEL=grok-4-1-fast-reasoning               # default — verify via `grok models`
GROK_MODEL_DEEP=grok-4                           # for DeepSearch-equivalent scouting
GROK_FORMAT=json                                 # emits NDJSON event stream, NOT a single JSON object
GROK_API_KEY_VAR=GROK_API_KEY                    # NOT XAI_API_KEY

# Dispatch shape:
#   "$GROK_BIN" -p "$PROMPT" --model "$GROK_MODEL" --format "$GROK_FORMAT" > "$OUT.jsonl"
#
# Parse NDJSON event stream — fold content events into final text:
#   jq -sr 'map(select(.content) | .content) | join("")' "$OUT.jsonl"

# Auth: $GROK_API_KEY from console.x.ai (NOT a SuperGrok/Premium subscription — API is separate).
```

## Quota advisory for peer CLIs

- **Gemini OAuth:** 60 RPM / 1k RPD. At typical /deep-research usage (a few calls/day), this is effectively unlimited.
- **Grok API:** pay-per-token, no rolling-window bucket. Check remaining balance at console.x.ai after first 10 real dispatches; switch to a cheaper model if daily cost gets uncomfortable.
- No equivalent of `codex-thresholds.sh` is needed for either — their quota models don't fit the 5-hour-bucket shape.
