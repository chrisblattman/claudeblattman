# Apple Events JavaScript (macOS, Safari or Chrome)

Runs JavaScript in the user's own signed-in Safari or Chrome tabs through AppleScript, called from the shell with `osascript`. Works under Claude Code only; Codex excludes this route. The browser stays visible, and the agent cannot see the screen. Every check is a DOM read. Make **every** browser call through [scripts/browser-js.sh](../scripts/browser-js.sh) (`zsh <skill folder>/scripts/browser-js.sh <Safari|Chrome> <command> …`): `windows`, `new-window`, `front`, `urls`, `js`, `close`. One permission rule then covers the whole route; ad-hoc `osascript` calls would each prompt.

Observed 2026-11-06 on Safari 27.2 and Chrome 156. Selectors and labels below are hints to verify on the live page, not fixed contracts.

## One-time enablement (user steps)

- **Safari:** Settings → Advanced → "Show features for web developers". Then Settings → Developer → "Allow JavaScript from Apple Events". "Allow remote automation and external agents" is **not** needed for this route.
- **Chrome:** menu bar View → Developer → "Allow JavaScript from Apple Events".
- **macOS** asks once whether the agent's app may control the browser (Privacy & Security → Automation). The user must click Allow. If it was denied earlier, the user re-enables it there.

When it is off, the script returns the browser's own message ("You must enable 'Allow JavaScript from Apple Events'…" or "Executing JavaScript through AppleScript is turned off"). Record `apple_events: off` for that browser and show the matching step. The agent never changes these settings itself.

Security note for the user: while it is on, any app they have allowed to control that browser can run JavaScript in their open tabs. If they turn it off between runs, the next run will stop at this step.

## Working rules

- **Own the window.** Open each product with `new-window <url>`, which prints the new window's ID by comparing window lists before and after; never assume `front window` is the new one. A test on 2026-11-06 picked up the user's Gmail window that way. Before each step, confirm the window's tab URL is the product page this run opened; window IDs can also change when the user rearranges windows. Never type into, or read beyond the URL of, the user's existing tabs.
- **Close only what you verified is yours.** Use `close <id> <url-prefix>` (for example `https://chatgpt.com/`); it refuses if any tab is outside that prefix. If in doubt, leave it open. A wrongly closed window can only be restored by the user (History → Reopen Last Closed Window), because menu control needs Accessibility permission.
- **Bring it to the front** with `front <id>` before focusing or typing. Focus and text entry fail in background windows.
- **Return JSON from a try/catch** in every snippet. AppleScript returns `missing value` when the JavaScript throws; treat that as unknown, never as success.
- **Click with a full event sequence.** Simple `.click()` does not open ChatGPT's tools menu. Dispatch `pointerdown`, `mousedown`, `pointerup`, `mouseup`, `click` (see `fire()` in the script's header).
- **Pick the visible composer.** ChatGPT's project page holds more than one `contenteditable` editor. Use the focused or visible one whose aria-label matches the page (for example "New chat in Deep Research"), not the first match.
- **Don't run Safari MCP at the same time.** While `safaridriver --mcp` runs, AppleScript to Safari reaches the automation instance instead of the user's windows.

## ChatGPT

1. Open the saved Deep Research project URL. Confirm the signed-in sidebar and the "New chat in Deep Research" composer.
2. Clear any leftover draft in the composer: focus it, then `execCommand('selectAll')` and `execCommand('delete')`.
3. Fire the composer's "Add files and more" (+) button, then the menu button whose text is "Deep research / Get a detailed report". Verify that an element with `app-mention-name="deep-research"` is now in the composer.
4. **Enter text (verified in Chrome and Safari).** Move the selection to the end and insert one space. Then dispatch a `ClipboardEvent('paste')` carrying a `DataTransfer` with the brief as `text/plain`. Line breaks survive as `<br>`.
5. Read back the length and a few key phrases, and check the chip is still present, before the [submission guard](../references/browser-routes.md#submission-guard-autonomous). Fire the form's "Send" button once.
6. The chat URL moves to `/g/<project>/c/<id>`. The page states that Deep Research has started.

## Gemini

1. Open the saved Deep Research notebook URL. Confirm the "Google Account: …" control.
2. Fire "Upload & tools" → "More tools" → "Deep research". Verify a "Deselect Deep research" button and the placeholder "What do you want to research?".
3. **Enter text (verified in Chrome; untested in Safari).** Focus the `contenteditable` labeled "Enter a prompt for Gemini", move the selection to the end, and call `document.execCommand('insertText', false, brief)`. Wait about a second: the editor's `ql-blank` class clears and a "Send message" button appears. A synthetic paste event left this composer empty, so don't use it here.
4. Read back the content, run the submission guard, and send once. Gemini may return a plan first; follow [browser procedures](../references/browser-procedures.md).

## Not yet verified on this route

- Report export by synthetic click: ChatGPT's Export → Markdown download, and Gemini's Export to Docs, which opens a new tab that the browser may block. If a download does not start, record `capture-incomplete` and ask the user to click the product's own export once.
- Gemini text entry in Safari.
