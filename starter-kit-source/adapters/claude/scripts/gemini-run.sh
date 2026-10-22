#!/usr/bin/env bash
# gemini-run.sh — run a one-shot Gemini CLI query with model fallback.
# Part of the starter-kit plugin; used by /gemini and /council --peer gemini.
#
# Usage:   gemini-run.sh <out_file>      (prompt on stdin)
#
# Writes Gemini's answer (plain text) to <out_file>; stderr to <out_file>.stderr.
# Exits 0 only when <out_file> is non-empty. On failure it prints a loud
# "GEMINI UNAVAILABLE" line and times out long-running calls.
#
# Two deliberate choices:
#   1. The prompt body is piped on STDIN while -p gives Gemini a headless
#      instruction. This avoids the interactive UI path.
#   2. The model is pinned explicitly: the CLI's logged-in default is a much
#      weaker model, so we always name the best one and fall back DOWNWARD
#      only when a model is at capacity or rejected.
#
# Model list is newest-first. When a newer Gemini ships, add its id to the
# FRONT of the list below — this file is the single edit point for every caller.

set -uo pipefail
umask 077   # temp prompt/output files are private to the user

OUT="${1:?usage: gemini-run.sh <out_file>   (prompt on stdin)}"
RUN_TIMEOUT_SECONDS="${STARTER_KIT_ENGINE_TIMEOUT_SECONDS:-300}"

GEMINI_BIN="$(command -v gemini || true)"
if [ -z "$GEMINI_BIN" ]; then
  echo "GEMINI UNAVAILABLE: no 'gemini' on PATH. Install it (npm install -g @google/gemini-cli), then run /kit-setup." >&2
  exit 127
fi

# Gemini 0.46 added a workspace folder-trust gate. In a directory the user has
# not explicitly trusted it silently downgrades --approval-mode to "default",
# which then blocks these non-interactive calls — they fail *after* a valid
# login with a "current folder is not trusted" notice. Opt this session into
# trust via the documented env var (honored on current Gemini, harmlessly
# ignored by versions that predate the gate, so it can never error).
export GEMINI_CLI_TRUST_WORKSPACE=true

# Read the prompt once; reuse it across model retries.
PROMPT_TMP="$(mktemp)"
cat > "$PROMPT_TMP"
PROMPT_TEXT="$(cat "$PROMPT_TMP")"
TIMEOUT_FLAG="$(mktemp)"
trap 'rm -f "$PROMPT_TMP" "$TIMEOUT_FLAG"' EXIT

run_with_timeout() {
  rm -f "$TIMEOUT_FLAG"
  "$@" &
  child_pid=$!
  (
    sleep "$RUN_TIMEOUT_SECONDS"
    if kill -0 "$child_pid" 2>/dev/null; then
      echo timeout > "$TIMEOUT_FLAG"
      kill -TERM "$child_pid" 2>/dev/null || true
      sleep 2
      kill -KILL "$child_pid" 2>/dev/null || true
    fi
  ) &
  watcher_pid=$!
  wait "$child_pid"
  rc=$?
  kill "$watcher_pid" 2>/dev/null || true
  wait "$watcher_pid" 2>/dev/null || true
  return "$rc"
}

FIRST=1
LAST_ERR=""
for MODEL in gemini-2.5-pro gemini-2.0-flash gemini-1.5-pro; do
  run_with_timeout "$GEMINI_BIN" -m "$MODEL" --approval-mode plan -p "$PROMPT_TEXT" > "$OUT" 2> "$OUT.stderr"
  RC=$?

  if [ "$RC" -eq 0 ] && [ -s "$OUT" ]; then
    if [ "$FIRST" -ne 1 ]; then
      echo "GEMINI NOTE: fell back to model=$MODEL ($LAST_ERR)" >&2
    fi
    echo "GEMINI OK: model=$MODEL out=$OUT" >&2
    exit 0
  fi

  if [ -s "$TIMEOUT_FLAG" ]; then
    LAST_ERR="$MODEL timed out after ${RUN_TIMEOUT_SECONDS}s"
    break
  fi

  # At capacity / rate-limited on this model -> try the next one down.
  if grep -qiE "exhausted your capacity|RESOURCE_EXHAUSTED|429|quota" "$OUT.stderr" 2>/dev/null; then
    echo "GEMINI NOTE: $MODEL at capacity; trying the next model." >&2
    LAST_ERR="$MODEL at capacity"
    FIRST=0
    continue
  fi
  # Auth/permission problems won't be fixed by a different model -> stop now.
  if grep -qiE "401|403|UNAUTHENTICATED|PERMISSION_DENIED|credential|login|sign.?in" "$OUT.stderr" 2>/dev/null; then
    LAST_ERR="authentication problem"
    break
  fi
  # Unknown/retired model id -> the next id in the list may still exist.
  if grep -qiE "model_not_found|not found|does not exist|invalid model" "$OUT.stderr" 2>/dev/null; then
    echo "GEMINI NOTE: $MODEL not recognized; trying the next model." >&2
    LAST_ERR="$MODEL not recognized"
    FIRST=0
    continue
  fi
  # Anything else (network, crash): stop and fail loud, don't burn retries.
  LAST_ERR="$MODEL exit=$RC"
  break
done

echo "GEMINI UNAVAILABLE: all models failed. Last: $LAST_ERR" >&2
echo "  stderr tail:" >&2
tail -5 "$OUT.stderr" >&2 2>/dev/null || true
echo "  If this is an auth problem, run 'gemini' once interactively to sign in with Google." >&2
exit 1
