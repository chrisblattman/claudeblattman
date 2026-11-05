---
name: deep-research
description: "Run the legacy federated research workflow or absorb and archive external research reports. Requires the configured research tools and project archive."
---

<!-- deep-research v4 | sanitized from private skill | synced 2026-06-13 -->
Bundled `references/` paths are relative to this SKILL.md file.

# /deep-research

*Federated deep-research workflow. Reports live in their project folder; a thin pointer INDEX in a central archive directory enables cross-project discovery.*

Run end-to-end deep research on a topic. Two invocation modes:

1. **Dispatch** — `/deep-research <topic> [--tool ...]` builds a DR-tuned prompt, routes to a project folder, dispatches to one or more research tools, and archives results there.
2. **Absorb** — `/deep-research --absorb [<file>]` scans `Projects/*/raw-inputs/` for unindexed files (drag-dropped from external tools) and processes them into canonical form.

**Automatic tools** (no paste-loop): Claude WebSearch subagent, OpenAI Codex CLI, Gemini 2.5 Pro CLI.
**Paste-loop tools** (opt-in only): ChatGPT, Grok, Perplexity, Gemini Deep Research (browser).

## Argument hint

`<topic> [--quick | --tool claude|codex|gemini|chatgpt|grok|perplexity|gemini-deep|both|all-auto] [--depth standard|deep] [--project <name>] [--no-prestructure] | --absorb [<file>] [--project <name>] [--synthesize]`

## Read first

- `references/config.md` — paths, defaults, routing config
- `references/dr-prompt-schema.md` — the 8-element prompt schema
- `references/paste-loop-ux.md` — emit-and-exit messaging convention for paste-loop tools
- `references/claude-subagent-template.md` — Claude WebSearch dispatch template

**Risk escalation:** Archive writes are Auto. Codex dispatches are Auto unless Phase 2's inline quota check returns RED (>85% of the 5-hour bucket); RED blocks unless `--force`.

---

## Dispatch mode

### Phase 0.5 — Pre-structure via /prompt (mandatory; no skip on well-formed inputs)

**Invoke `/prompt` on every `$TOPIC`.** Even tight questions have implicit audience/context/output-shape that `/prompt` surfaces. The latency (5–15s) is worth the quality lift.

Procedure:
1. Skill tool call: `skill="prompt"`, args = `$TOPIC depth:deep hold` (the `hold` token tells `/prompt` to format and show but NOT execute)
2. Capture the formatted/restructured version from `/prompt`'s output
3. Show the user: "Restructured as:\n\n[formatted]\n\nUse this for the DR schema? [y/N/edit]"
4. If `y`: use formatted version as effective `$TOPIC` for Phase 1
5. If `edit`: open in `$EDITOR`, then proceed with edited version
6. If `n`: use raw `$TOPIC` (user override, not a skip-decision by the skill)

**The only skip condition is the explicit `--no-prestructure` CLI flag.** Do not infer a skip from input quality, length, or efficiency.

### Phase 1 — Prompt build

Apply the 8-element DR Prompt Schema (`references/dr-prompt-schema.md`). Default depth = `deep`. `--depth standard` drops elements 6+7 and the "research current best practices" preamble.

Print the full built prompt to stdout, then prompt:

```bash
read -p "Send this prompt? [y/N/edit]: " ans
case "$ans" in
  [yY]*) ;;
  edit)  ${EDITOR:-vi} /tmp/dr-prompt-<run-id>.md; exec $0 "$@" ;;
  *)     echo "Aborted."; exit 0 ;;
esac
```

### Phase 1.4 — Project routing

Decide `$PROJECT_DIR` BEFORE Phase 1.5. Logic:

```bash
ROUTING_CONFIG=~/.claude-assistant/config/deep-research-routing.json

if [ -n "$PROJECT_FLAG" ]; then
  # Explicit --project <name> passed
  PROJECT_DIR=$(jq -r --arg p "$PROJECT_FLAG" '.routes[$p].path // empty' "$ROUTING_CONFIG")
  if [ -z "$PROJECT_DIR" ]; then
    if [ -d "$HOME/projects/$PROJECT_FLAG" ]; then
      PROJECT_DIR="$HOME/projects/$PROJECT_FLAG/raw-inputs/"
    else
      echo "No routing entry for '$PROJECT_FLAG'."
      read -p "Use ~/projects/working-notes/raw-inputs/ instead? [Y/n]: " ans
      [ "$ans" = "n" ] && exit 1
      PROJECT_DIR="$HOME/projects/working-notes/raw-inputs/"
    fi
  fi
else
  # Infer via keyword match against routing config
  MATCHES=$(jq -r --arg t "$TOPIC" '
    .routes | to_entries[] |
    select(.value.title_patterns // [] | any(. as $p | $t | ascii_downcase | contains($p))) |
    select(.value.exclude_patterns // [] | any(. as $p | $t | ascii_downcase | contains($p)) | not) |
    .key
  ' "$ROUTING_CONFIG")
  N_MATCHES=$(echo "$MATCHES" | grep -c .)

  case "$N_MATCHES" in
    1)
      PROJECT_KEY="$MATCHES"
      read -p "Topic matches project '$PROJECT_KEY'. File there? [Y/n/other]: " ans
      case "$ans" in
        n|N)        PROJECT_KEY="working-notes" ;;
        other)      read -p "Project name: " PROJECT_KEY ;;
        *)          ;;  # accept default
      esac
      ;;
    0)
      echo "No project match for topic. Save to working-notes? [Y/n/specify]"
      read -p "> " ans
      case "$ans" in
        n|N)        echo "Aborted."; exit 1 ;;
        specify)    read -p "Project name: " PROJECT_KEY ;;
        *)          PROJECT_KEY="working-notes" ;;
      esac
      ;;
    *)
      echo "Multiple project matches:"
      echo "$MATCHES" | nl
      read -p "Pick [1-N/other]: " pick
      PROJECT_KEY=$(echo "$MATCHES" | sed -n "${pick}p")
      ;;
  esac

  PROJECT_DIR=$(jq -r --arg p "$PROJECT_KEY" '.routes[$p].path' "$ROUTING_CONFIG")
fi

PROJECT_DIR="${PROJECT_DIR/#\~/$HOME}"

# Surface-and-ask: do NOT silently mkdir a ghost folder for a stale route, but do
# NOT hard-abort a legitimate brand-new project either. If the PARENT project dir
# is missing, flag it and ask before creating — a missing parent usually means the
# folder was moved/renamed (a stale route to fix in the routing config), not a new project.
PARENT_DIR=$(dirname "${PROJECT_DIR%/}")
if [ ! -d "$PARENT_DIR" ]; then
  echo "CONFIDENCE FLAG: route '${PROJECT_KEY:-$PROJECT_FLAG}' -> missing project dir: $PARENT_DIR"
  echo "   Either the folder was moved/renamed (stale route — fix it in the routing config) OR this is a brand-new project."
  read -p "   Create '$PARENT_DIR' and proceed? [y/N]: " _mkans
  case "$_mkans" in
    [yY]*) ;;  # legitimate new project — proceed to mkdir below
    *) echo "Aborted. Pick an existing project, or fix the stale route, then re-run."; exit 1 ;;
  esac
fi
mkdir -p "$PROJECT_DIR"
```

### Phase 1.5 — Archive prompt to project folder

Before any dispatch:

```bash
RUN_ID=$(date +%Y%m%d%H%M%S)-$(openssl rand -hex 3)
SLUG=$(echo "$TOPIC" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | cut -c1-50)
DATE=$(date +%Y-%m-%d)

cat > "/tmp/dr-prompt-$RUN_ID.md" <<EOF
---
date: $DATE
topic: $TOPIC
type: prompt
project: $PROJECT_KEY
run_id: $RUN_ID
---
EOF
cat /tmp/dr-built-prompt-$RUN_ID.txt >> "/tmp/dr-prompt-$RUN_ID.md"

cp "/tmp/dr-prompt-$RUN_ID.md" "$PROJECT_DIR/${DATE}_${SLUG}_prompt.md"
```

### Phase 2 — Codex pre-flight (only if `--tool` includes codex)

Inline lightweight quota guard. **Two-tier only: GREEN / RED.**

Behavior: if `ccusage` + `jq` are available AND the reported quota is ≥ `THRESHOLD_RED`, BLOCK (unless `--force`). Otherwise proceed silently. Missing deps = missing signal = proceed (advisory, not mandatory; the Claude arm is the fallback anyway).

```bash
source ~/.claude-assistant/config/codex-thresholds.sh 2>/dev/null || {
  PRO_5H_TOKEN_BUDGET=400000
  THRESHOLD_RED=0.85
  PROMO_EXPIRY="2099-01-01"
}

# Promo-expiry tripwire (fires as stderr, non-blocking). If your plan tier has a
# promotional token budget that ends on a known date, set PROMO_EXPIRY in your
# codex-thresholds.sh so this warns you to recalibrate PRO_5H_TOKEN_BUDGET afterward.
[[ -n "${PROMO_EXPIRY:-}" && "$(date +%Y-%m-%d)" > "$PROMO_EXPIRY" ]] && \
  echo "# WARNING: token-budget promo expired $PROMO_EXPIRY. Recalibrate PRO_5H_TOKEN_BUDGET." >&2

USAGE_RAW=$(ccusage codex window 5h --json 2>/dev/null | jq -r '.percent // .tokens // .tokens_used // empty' 2>/dev/null)
if [ -n "$USAGE_RAW" ] && [ "$USAGE_RAW" != "null" ]; then
  RED_HIT=$(awk -v p="$USAGE_RAW" -v b="$PRO_5H_TOKEN_BUDGET" -v t="$THRESHOLD_RED" \
    'BEGIN { n = (p > 100) ? p/b : (p > 1 ? p/100 : p); print (n >= t) ? 1 : 0 }')
  if [ "$RED_HIT" = "1" ] && [ -z "$FORCE" ]; then
    echo "RED: Codex 5h bucket >= ${THRESHOLD_RED}. Use --force or --tool claude."
    exit 1
  fi
fi
# Happy path: no output. Proceed to Phase 3.
```

### Phase 3 — Dispatch

**`--tool claude`** — Spawn a subagent with `context:fork` using the template at `references/claude-subagent-template.md`. Pass:
- Prompt path: `/tmp/dr-prompt-$RUN_ID.md`
- Schema path: `<absolute path to this skill’s references/dr-prompt-schema.md>`
- Output target: `/tmp/dr-claude-$RUN_ID.md`

The subagent uses WebSearch + WebFetch and writes its report to the output target. It does NOT report inline.

**`--tool codex`** — Single Bash call. **Pipe the prompt via stdin redirect** — do NOT pass it as a `-- "$(cat …)"` positional. The positional+`--` form has caused Codex CLI to fall into `Reading additional input from stdin...` and hang indefinitely.

```bash
"$CODEX_BIN" exec --model "$CODEX_MODEL" $CODEX_SANDBOX \
  $CODEX_UNATTENDED_FLAG \
  -o /tmp/dr-codex-$RUN_ID.md \
  < /tmp/dr-prompt-$RUN_ID.md \
  > /tmp/dr-codex-$RUN_ID.stdout 2>/tmp/dr-codex-$RUN_ID.stderr
CODEX_EXIT=$?
```

`CODEX_BIN`, `CODEX_MODEL`, `CODEX_SANDBOX`, and `CODEX_UNATTENDED_FLAG` come from `references/config.md`.

**Permission denial handling.** Claude Code's sandbox may deny a Codex Bash call with a heuristic message about "executing code derived from untrusted research content," even when `Bash(*)` is in the allow-list. The fix: add explicit binary-path rules to `~/.claude/settings.json` → `permissions.allow` (see `references/config.md` § Permission prerequisites).

If a permission denial still occurs at runtime, detect via the literal string "Permission for this action has been denied" in the tool result, then **fall back to paste-loop** for the Codex arm. Set `CODEX_OK=0` for Phase 3.5 and continue any other arms uninterrupted.

**`--tool gemini`** — Single Bash call to Gemini 2.5 Pro CLI (fully automatic; NOT the browser Deep Research product — that's `--tool gemini-deep`). Model pinning matters: the OAuth default is `gemini-2.5-flash-lite`, which is materially weaker.

```bash
"$GEMINI_BIN" -p "$(cat /tmp/dr-prompt-$RUN_ID.md)" -m gemini-2.5-pro \
  --output-format "$GEMINI_OUTPUT_FORMAT" \
  > /tmp/dr-gemini-$RUN_ID.json 2>/tmp/dr-gemini-$RUN_ID.stderr
GEMINI_EXIT=$?
jq -r '.response' /tmp/dr-gemini-$RUN_ID.json > /tmp/dr-gemini-$RUN_ID.md 2>/dev/null
```

If `$GEMINI_BIN` is empty, skip with note ("Gemini CLI not installed; run `npm install -g @google/gemini-cli`"). Do not silently fall back to paste-loop.

**`--tool chatgpt|grok|perplexity|gemini-deep`** (paste-loop, opt-in only). Save the prompt to `/tmp/dr-prompt-$RUN_ID.md` (already done in Phase 1.5). Print the paste-loop hint per `references/paste-loop-ux.md`. **Exit cleanly. No inline wait.** When the user returns with the pasted file, they run `/deep-research --absorb`.

**Important — do NOT volunteer paste-loop arms.** Never add ChatGPT, Grok, Perplexity, or Gemini Deep Research as a "bonus arm" unless the user explicitly passed the flag (or used an unambiguous natural-language trigger like "include gemini deep research").

**`--tool both`** — Two **concurrent tool calls** in a single message: one Task spawn for the Claude subagent, one Bash for Codex. Does NOT include Gemini CLI. Do NOT use Bash `&` + `wait` (fragile error propagation).

**`--tool all-auto`** — Three **concurrent tool calls** in a single message: one Task (Claude subagent), two Bash (Codex, Gemini CLI). All automatic, no paste-loop.

### Phase 3.5 — Hard exit-code gate

For each non-paste tool:

```bash
if [ "$CODEX_EXIT" -ne 0 ] || [ ! -s /tmp/dr-codex-$RUN_ID.md ]; then
  echo "Codex dispatch failed (exit=$CODEX_EXIT). stderr:"
  cat /tmp/dr-codex-$RUN_ID.stderr
  CODEX_OK=0
else
  CODEX_OK=1
fi
```

Same pattern for the Claude subagent (output file must exist + be non-empty). Synthesis includes only `*_OK=1` arms.

**Gemini hollow-arm gate.** Exit 0 + non-empty is INSUFFICIENT for Gemini: it *can* return fluent, zero-citation prose (pure training-data synthesis) that passes a naive exit-code check. **Use the web-search call COUNT as the browse signal, NOT `tokens.tool`** — `tokens.tool` reads 0 even on fully-browsed runs in gemini-cli v0.38.x (grounding is a server-side call not attributed to that counter; a verified run showed `google_web_search.count=5` and 4 URLs, yet `tokens.tool=0`). Headless web search does work under OAuth on v0.38.2; the failure mode is intermittent, not constant.

```bash
# LOAD-BEARING — do not remove. Gemini CAN browse, but hollow (zero-citation) runs are
# real and INTERMITTENT (~1/3 observed on a confirmed-capable install). "Search works" is
# NOT a reason to delete this gate. URL count is the schema-independent primary signal;
# search-count is secondary (the byName path may differ across gemini-cli versions).
GEMINI_SEARCHES=$(jq -r '(.stats.tools.byName.google_web_search.count // .stats.tools.totalCalls // 0)' /tmp/dr-gemini-$RUN_ID.json 2>/dev/null || echo 0)
GEMINI_URLS=$(grep -c 'http' /tmp/dr-gemini-$RUN_ID.md 2>/dev/null || echo 0)
if [ "$GEMINI_EXIT" -ne 0 ] || [ ! -s /tmp/dr-gemini-$RUN_ID.md ]; then
  echo "Gemini dispatch failed (exit=$GEMINI_EXIT)."; GEMINI_OK=0
elif [ "${GEMINI_SEARCHES:-0}" -lt 1 ] && [ "${GEMINI_URLS:-0}" -lt 1 ]; then
  echo "Gemini arm HOLLOW (web_searches=$GEMINI_SEARCHES, urls=$GEMINI_URLS): no browsing detected."
  echo "   Tag the archived file with 'quality_note: synthesis-only' in frontmatter; do NOT treat as sourced research."
  GEMINI_OK=1   # keep, but labeled — synthesis-only, not sourced
else
  GEMINI_OK=1
fi
```

(Flag hollow only when BOTH the search count AND the URL count are zero — this minimizes false positives. This in-skill gate is what makes the `quality_note` label reach the archived frontmatter.)

### Phase 4 — Federated archive (write to project folder)

For each successful tool output:

```bash
DEST="$PROJECT_DIR/${DATE}_${SLUG}_${TOOL}.md"
cat > "$DEST" <<EOF
---
date: $DATE
topic: $TOPIC
tool: $TOOL
model: $MODEL
prompt_file: ${DATE}_${SLUG}_prompt.md
project: $PROJECT_KEY
run_id: $RUN_ID
---

EOF
cat "/tmp/dr-${TOOL}-$RUN_ID.md" >> "$DEST"
```

**INDEX update** (serialized AFTER all parallel arms complete — do not write from inside parallel tasks):

```bash
INDEX=~/research-archive/INDEX.md
INDEX_JSONL=~/research-archive/INDEX.jsonl

echo "| $DATE | $TOPIC | $TOOL | $MODEL | $PROJECT_KEY | $DEST |" >> "$INDEX"

jq -n --arg date "$DATE" --arg topic "$TOPIC" --arg tool "$TOOL" \
       --arg model "$MODEL" --arg project "$PROJECT_KEY" --arg path "$DEST" \
       --arg run_id "$RUN_ID" \
  '{date:$date, topic:$topic, tool:$tool, model:$model, project:$project, path:$path, run_id:$run_id}' \
  >> "$INDEX_JSONL"
```

**No mirror writes.** The project folder is the canonical location. The central archive holds only the index.

**Cleanup:**
```bash
find /tmp -name "dr-*-$RUN_ID*" -mtime +1 -delete
```

### Phase 5 — Synthesis (opt-in, with `--synthesize`)

Thin wrapper that calls `/dr-synthesize <project-paths...>` as a subprocess. Synthesis writes to the SAME project folder as its primary input(s):

`$PROJECT_DIR/${DATE}_${SLUG}_synthesis.md`

`/dr-synthesize` enforces the mandatory `## Source Reports` header with absolute paths. Synthesis is a *new* file; never edits raw inputs. After write, append a synthesis row to INDEX.md/jsonl.

### Phase 6 — Telemetry

```bash
echo "$(date +%Y-%m-%d),deep-research,$TOOL_CALLS,${TOOL}-${SLUG}" >> ~/.claude-assistant/logs/skill-performance.csv
```

If Codex was used, append to `codex-usage.csv`:
```bash
ROLLOUT=$(ls -t ~/.codex/sessions/$(date +%Y/%m/%d)/rollout-*.jsonl 2>/dev/null | head -1)
DELTA=$(jq -s 'map(.tokens_used // 0) | add' "$ROLLOUT" 2>/dev/null || echo "")
echo "$DATE,$RUN_ID,$WINDOW_BEFORE,$WINDOW_AFTER,$DELTA" >> ~/.claude-assistant/logs/codex-usage.csv
```

---

## Absorb mode

`/deep-research --absorb [<file>] [--project <name>] [--synthesize]`

For external Deep Research outputs (you ran ChatGPT / Grok / Perplexity / Gemini Deep Research in the browser, or any other tool). Two paths:

### Path A — Drag-and-drop, then absorb

Drop one or more `.md` files into a project's `raw-inputs/` folder via your editor's file explorer (e.g., `~/projects/<paper-name>/raw-inputs/test.md`). Then in the integrated terminal:

```
/deep-research --absorb
```

The skill scans every `raw-inputs/` folder for `.md` files lacking canonical frontmatter (no `date:` + `topic:` + `tool:` + `run_id:` block). For each found file:

1. **Preview** first ~30 lines
2. **Prompt:**
   - `Topic / slug? [auto-suggest from filename]`
   - `Source tool? [chatgpt/codex/grok/perplexity/other]`
3. **Clean** if `chatgpt`: pipe through a ChatGPT-artifact stripper (PUA characters in the ``–`` range), if available
4. **Rename** to canonical pattern: `${DATE}_${SLUG}_${TOOL}.md` (preserving the project folder location)
5. **Prepend frontmatter:**
   ```
   ---
   date: <inferred-from-mtime-or-asked>
   topic: <slug>
   tool: <tool>
   ingested_from: <original-filename>
   project: <inferred-from-folder>
   run_id: absorb-$(date +%s)
   ---
   ```
6. **Append rows** to INDEX.md and INDEX.jsonl
7. **Report:** `Absorbed N file(s). Skipped M (already indexed).`

### Path B — Single-file with explicit path

```
/deep-research --absorb /path/to/external-report.md --project "<paper-name>"
```

Same as Path A but processes one specified file. Moves it into `$PROJECT_DIR` after canonicalization.

### Phase 5 — Synthesis (with `--synthesize`)

If `--synthesize` is passed, after absorbing call `/dr-synthesize` on the absorbed file(s).

---

## Defaults

- `--tool` default: `both` (Claude WebSearch + Codex in parallel). Both arms fully automatic. Codex arm is RED-gated per Phase 2 (5h bucket). For 3-arm automatic dispatch including Gemini 2.5 Pro CLI, pass `--tool all-auto`. Paste-loop arms (`chatgpt`, `grok`, `perplexity`, `gemini-deep`) are opt-in only — never volunteered.
- `--depth` default: `deep` (all 8 schema elements + "research current best practices" preamble)
- `--project` default: keyword inference; **if no match, prompt the user to pick** — do NOT silently fall back to `working-notes`.

**`--quick` shortcut:** One-flag override = `--tool claude --depth standard` (the cheap/fast mode). Combines with other flags: `--quick --project X` is valid.

**Individual overrides:** `--tool <name>` changes only the tool (depth stays `deep`). `--depth standard` lowers only depth (tool stays `both`).

---

## Smoke tests

**1. Routing inference + federated write:**
```bash
/deep-research "What are the top 3 risks of long-context agentic coding setups?" --tool claude
# Expect:
#   Phase 1 prints schema'd prompt; [y/N/edit] gate fires
#   Phase 1.4 keyword match prompts a project, or falls back to working-notes
#   Phase 1.5: prompt file at $PROJECT_DIR/<date>_<slug>_prompt.md
#   Phase 4: claude report at $PROJECT_DIR/<date>_<slug>_claude.md
#   INDEX.md and INDEX.jsonl have new pointer rows
#   research-archive/ contains NO .md content files (only INDEX.md, INDEX.jsonl)
```

**2. Absorb workflow:**
```bash
echo "fake report content" > "$HOME/projects/working-notes/raw-inputs/test-paste.md"
/deep-research --absorb
# Expect: prompts for slug + tool, renames to canonical, adds frontmatter, INDEX updated
```

**3. Cross-project discovery:**
```bash
# Open ~/research-archive/INDEX.md, find-in-file for any topic keyword
# Expect: row visible, path clickable to project folder
```

---

## Customization Points

- **Routing config:** `~/.claude-assistant/config/deep-research-routing.json`. Maps project keys → `path` + `title_patterns` + `exclude_patterns` for keyword inference.
- **Project folder layout:** Default base is `~/projects/<name>/raw-inputs/`. Adjust if your projects live elsewhere (e.g., `~/Documents/research/...`).
- **Central index location:** `~/research-archive/` holds only `INDEX.md` and `INDEX.jsonl`. Should stay under 1 MB indefinitely.
- **Codex thresholds:** `~/.claude-assistant/config/codex-thresholds.sh` is the single source of truth for `PRO_5H_TOKEN_BUDGET` and `THRESHOLD_RED`. Recalibrate quarterly.
- **CLI binaries:** Set `CODEX_BIN`, `GEMINI_BIN` paths in `references/config.md` to match your install.
- **ChatGPT artifact stripper:** Optional Python helper invoked during `--absorb` for ChatGPT exports (PUA character range ``–``). Skip if you don't ingest ChatGPT outputs.
