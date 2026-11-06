# Install and setup

Setup gets browser access working **once, at install time**, so later `/deep-research` runs go straight through. It launches no research and spends no Deep Research allowance.

Run setup:

- **Right after installing or updating the skill, in the same session.** The installing agent does this without being asked again.
- When the user asks: `/deep-research setup`, "set up deep research", or "recheck setup".
- As a fallback, when a research run starts and `local/settings.json` is missing. Then continue the run.

## Install (for the installing agent)

1. Copy the **whole** `skills/deep-research/` folder (`SKILL.md`, `references/`, `adapters/`, `routes/`, `scripts/`) to the host's skills folder:
   - **Claude Code:** `~/.claude/skills/deep-research/`, or `<project>/.claude/skills/deep-research/` for one project.
   - **Codex:** `~/.codex/skills/deep-research/`.
2. **On update,** replace everything except `local/`, which holds this computer's saved settings.
3. Call the script as `zsh <skill folder>/scripts/browser-js.sh …`. Don't rely on its executable bit, which a raw download can drop.
4. Run the setup steps below now. If the host hasn't loaded the new skill yet, read this file from the installed folder and follow it directly.

## 1. Detect (no questions yet)

Follow [browser routes → Detect what works](browser-routes.md#detect-what-works) and the host adapter's route order. Also check:

- **Installed browsers** (`/Applications/Safari.app`, `/Applications/Google Chrome.app`, other Chromium browsers; on Windows, the usual install folders) and the **default browser**.
- **Browser order:** probe the default browser first. Stop at the first browser where a working route reaches both products signed in.
- **Apple Events (Claude on macOS):** for each browser being probed, `new-window https://chatgpt.com/` then a harmless `js` call such as returning `document.title`. That call also brings up the macOS Automation prompt the first time; the checklist tells the user to expect it. Keep every browser action in the script, so one permission rule covers the route.
- **Downloads access:** list `~/Downloads` once. On macOS this may raise a one-time Files & Folders prompt. Better now than mid-export.

## 2. One checklist

Put everything that needs the user into **one** message, in this order, and leave out items that are already fine. Ask the single choice with the host's question tool if it has one. The rest are steps to do, then reply "done".

1. **Claude in Chrome** (Claude Code; a Chromium browser is installed; no block or unsupported sign-in detected):
   > Deep Research works best through the Claude in Chrome extension. Anthropic's and OpenAI's browser tools are both built around Chrome. You can keep Safari for everything else and use Chrome just for ChatGPT and Gemini. To set it up: install the extension from the Chrome Web Store, sign it in to the same Claude account, then run `claude --chrome` once in a terminal and check `/chrome`.

   Offer three choices: **Set it up now**, **My organization blocks it**, **Skip (use the Mac fallback)**. Record `available` once it connects, otherwise `blocked-by-org` or `declined`. The agent can open the Web Store page but cannot install the extension.
2. **Apple Events setting**, for each browser that will be used and is off: the exact menu path from [the route](../routes/apple-events-macos.md#one-time-enablement-user-steps).
3. **macOS prompts:** "Allow" when asked whether the agent's app may control Safari/Chrome, and to access Downloads.
4. **Sign in** to ChatGPT or Gemini in the chosen browser, if either is signed out.
5. **One permission rule** (Claude Code, Apple Events route, when Claude Code isn't already in auto or bypass mode). Without it, Claude Code asks before every browser step of every run. Propose adding this to `permissions.allow` in the user's `~/.claude/settings.json`, using the installed absolute path:

   ```text
   Bash(zsh /Users/<name>/.claude/skills/deep-research/scripts/browser-js.sh:*)
   ```

   Add it only with the user's approval. Show the exact line first. The rule covers only this script, which acts on browser windows the run opens and refuses to close any other window. Record `added`, `declined` or `not-needed`.

Codex: items 1, 2 and 5 don't apply. Point to the Codex Chrome extension or computer-use setup from Codex's own instructions, with the same "Chrome just for these sites" suggestion.

After the user replies, re-probe each item. Repeat the checklist only for what still fails.

## 3. Verify without spending

For each product, on its chosen route and browser:

1. Open the product and find the **Deep Research** project or notebook, creating it if absent. Record its URL and the account shown.
2. Turn on Deep research and confirm it is active (ChatGPT's mode chip; Gemini's "Deselect Deep research" and its research placeholder).
3. Enter the word `test` with the route's text-entry method and confirm it registers. Then clear the composer, turn the mode off, and confirm the composer is empty. **Never press Send.**
4. Close only the windows or tabs setup opened (Apple Events: `close <id> <url-prefix>`).

## 4. Save and report

Write `local/settings.json` ([schema](browser-routes.md#saved-settings-check-first)), including:

```json
"setup": { "completed": "YYYY-MM-DD", "default_browser": "<app>", "permission_rule": "added | declined | not-needed", "downloads": "ok | blocked" }
```

Then give the user a short table with, for each product: route, browser, account shown, container, and anything still blocked. If no route works for a product, record `handoff` and say what would enable automation. A product that is not verified is never reported as ready.
