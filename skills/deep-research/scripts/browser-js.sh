#!/bin/zsh
# Browser control for the Apple Events route (macOS, Safari or Google Chrome).
# Every browser action in this route goes through this one script, so a single
# Claude Code permission rule can cover it.
#
#   zsh browser-js.sh <browser> windows                      # "id<TAB>url-of-tab-1" per window
#   zsh browser-js.sh <browser> new-window <url>             # prints the NEW window's id
#   zsh browser-js.sh <browser> front <window-id>            # bring that window to the front
#   zsh browser-js.sh <browser> urls <window-id>             # one tab URL per line
#   zsh browser-js.sh <browser> js <window-id> <tab> <js-file-or-inline-js>
#   zsh browser-js.sh <browser> close <window-id> <url-prefix>
#
# <browser> is Safari or Chrome. "close" closes the window only if every tab's
# URL starts with <url-prefix>; otherwise it refuses and closes nothing.
# "js" prints what the JavaScript returns. Wrap snippets in try/catch and
# return JSON: AppleScript prints "missing value" when the JavaScript throws.
#
# Needs the browser's "Allow JavaScript from Apple Events" setting (for "js")
# and the macOS Automation permission for the app running this script.
#
# A click helper ChatGPT's menus accept (prepend it to a "js" snippet):
#   window.__fire=function(el){const o={bubbles:true,cancelable:true,view:window,
#     button:0,pointerType:"mouse",isPrimary:true};
#     ["pointerdown","mousedown","pointerup","mouseup","click"].forEach(t=>
#     el.dispatchEvent(new (t.startsWith("pointer")?PointerEvent:MouseEvent)(t,o)));};
set -euo pipefail

usage() {
  print -u2 "usage: browser-js.sh <Safari|Chrome> windows|new-window <url>|front <id>|urls <id>|js <id> <tab> <js>|close <id> <url-prefix>"
  exit 2
}
[[ $# -ge 2 ]] || usage
case "$1" in
  Safari|safari) app="Safari" ;;
  Chrome|chrome|"Google Chrome") app="Google Chrome" ;;
  *) print -u2 "unsupported browser: $1 (use Safari or Chrome)"; exit 2 ;;
esac
cmd=$2; shift 2

# Run an AppleScript body (stdin) with __APP__ replaced by the whitelisted
# app name, so the browser's own terms (tabs, URL) compile.
as_run() {
  local body
  body=$(cat)
  osascript - "$@" <<<"${body//__APP__/$app}"
}

window_ids() {
  as_run <<'AS'
on run argv
  set out to ""
  tell application "__APP__"
    repeat with w in windows
      set out to out & (id of w as text) & linefeed
    end repeat
  end tell
  return out
end run
AS
}

case "$cmd" in
  windows)
    as_run <<'AS'
on run argv
  set out to ""
  set sep to ASCII character 9
  tell application "__APP__"
    repeat with w in windows
      try
        set u to URL of item 1 of (tabs of w)
      on error
        set u to ""
      end try
      set out to out & (id of w as text) & sep & u & linefeed
    end repeat
  end tell
  return out
end run
AS
    ;;
  new-window)
    [[ $# -eq 1 ]] || usage
    before=("${(@f)$(window_ids)}")
    if [[ $app == Safari ]]; then
      osascript - "$1" <<'AS' >/dev/null
on run argv
  tell application "Safari" to make new document with properties {URL:(item 1 of argv)}
end run
AS
    else
      osascript - "$1" <<'AS' >/dev/null
on run argv
  tell application "Google Chrome"
    set w to make new window
    set URL of active tab of w to (item 1 of argv)
  end tell
end run
AS
    fi
    new_id=""
    for _ in {1..20}; do
      after=("${(@f)$(window_ids)}")
      for id in $after; do
        [[ -n $id && ${before[(Ie)$id]} -eq 0 ]] && new_id=$id && break
      done
      [[ -n $new_id ]] && break
      sleep 0.25
    done
    [[ -n $new_id ]] || { print -u2 "new window not found"; exit 1; }
    print -r -- "$new_id"
    ;;
  front)
    [[ $# -eq 1 ]] || usage
    as_run "$1" <<'AS' >/dev/null
on run argv
  tell application "__APP__"
    set index of window id ((item 1 of argv) as number) to 1
    activate
  end tell
end run
AS
    ;;
  urls)
    [[ $# -eq 1 ]] || usage
    as_run "$1" <<'AS'
on run argv
  set out to ""
  tell application "__APP__"
    repeat with t in (tabs of window id ((item 1 of argv) as number))
      set out to out & (URL of t) & linefeed
    end repeat
  end tell
  return out
end run
AS
    ;;
  js)
    [[ $# -eq 3 ]] || usage
    win=$1 tab=$2 src=$3
    if [[ -f "$src" ]]; then js=$(<"$src"); else js=$src; fi
    if [[ $app == Safari ]]; then
      osascript - "$win" "$tab" "$js" <<'AS'
on run argv
  tell application "Safari" to do JavaScript (item 3 of argv) in tab ((item 2 of argv) as integer) of window id ((item 1 of argv) as number)
end run
AS
    else
      osascript - "$win" "$tab" "$js" <<'AS'
on run argv
  tell application "Google Chrome" to execute tab ((item 2 of argv) as integer) of window id ((item 1 of argv) as number) javascript (item 3 of argv)
end run
AS
    fi
    ;;
  close)
    [[ $# -eq 2 ]] || usage
    win=$1 prefix=$2
    [[ -n $prefix ]] || { print -u2 "refusing: empty url-prefix"; exit 1; }
    urls=("${(@f)$(zsh "$0" "$app" urls "$win")}")
    [[ ${#urls} -gt 0 ]] || { print -u2 "refusing: window $win has no tabs or was not found"; exit 1; }
    for u in $urls; do
      [[ -z $u ]] && continue
      [[ $u == ${prefix}* ]] || { print -u2 "refusing: window $win has a tab outside $prefix: $u"; exit 1; }
    done
    as_run "$win" <<'AS' >/dev/null
on run argv
  tell application "__APP__" to close window id ((item 1 of argv) as number)
end run
AS
    print -r -- "closed $win"
    ;;
  *) usage ;;
esac
