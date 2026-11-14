# Browser procedures

Use the route chosen in [browser routes](browser-routes.md) and its recipe in `routes/`, plus the host's own tool instructions. Discover controls from the live page. These procedures describe the workflow, not fixed selectors or a guarantee that every account has the same interface.

## Common preflight and filing

- Resume from the recorded task URL first. Never start another job merely because a panel failed to display.
- Confirm the intended signed-in account/workspace without saving its private account details in public artifacts. If it is ambiguous, ask before submitting to that product; do not infer identity from account indices such as `u/0`, a Docs home page or a familiar container name. Login, CAPTCHA, new terms and access-setting changes remain user steps when required.
- **File chats under “Deep Research” in both products.** Find the existing container before creating one. In ChatGPT this is a Project; in Gemini use its supported Notebook container. Create it with that exact name if absent and creation is available. Keep it private; do not change an existing container's instructions, sources or sharing.
- Start a new chat for each research question within that container. Where research must start outside it, move/add the same chat afterward using the product's own controls; never rerun the research just to file it. Record the container URL/identity and verify membership. Don't mark filing complete based on a click alone.
- If duplicate names make the destination ambiguous, or the account lacks the needed feature, record `filing: blocked` and ask for the missing choice or alternative. Don't treat a chat title, a Gem, or an exported Drive file as a chat folder. Don't change retention settings to enable filing without the user's decision. Other independent product work can continue.
- The folder groups chats; the current local project/task still owns the report files. Don't broaden this run to other topics or reports stored in the shared container. Record unavoidable inherited context if it affects independence.
- Inspect visible research entitlement and limits. Don't copy assumed monthly caps from another account, estimate them from local logs, or switch to API billing. A quota rejection is a recorded unavailable arm, not a reason to use a different product.

For multiline briefs, enter the whole brief in one operation using the route's text-entry method (a paste or insert, never key-by-key typing), then read back the full composer and click Send explicitly. Text entry differs by product and route: see the route recipe. Native simulated typing can interpret newlines as Enter and submit a partial prompt. If that happens, inspect the existing job and use its Update control for the omitted scope; record the deviation rather than starting another job.

## ChatGPT

1. Open the signed-in ChatGPT browser interface at `https://chatgpt.com/`. Select Chat if the app opens in another surface.
2. Find the **Deep Research** project in the sidebar, or create it with **New project**. Open a fresh chat there. For an existing run, use the recorded conversation; file it via **Move to project** when available rather than starting over.
3. Select **Deep research** from the visible tools menu or its current official control. Verify the active research mode before sending. Honor an explicit model/effort request when available; otherwise retain the eligible product default. Record settings actually exposed and report an unavailable requested setting rather than silently substituting it. Inspect the current composer and confirm the brief is actually entered; do not assume an input method worked.
4. Submit once, record the durable chat/task identity and inspect the research product's own stage. Handle a plan or clarification from the supplied brief. A reply saying research started, a mode chip alone, or the outer chat's completion signal does not prove the research is running or finished.
5. Follow the same task. If an embedded report panel fails, use **Reload response** if offered, then **Open app in tab** to display the existing task. A completed outer chat with a failed panel does not establish the research job status. Do not regenerate the chat or resubmit the prompt to recover a display problem.
6. When the product reports completion, open the full report. Use the report's own **Export** control, preferably Markdown, not the surrounding assistant message's Copy action. Save Word or PDF intact if that is the available format; conversion is a separate derivative. Verify the download as described below.

## Gemini

1. Open `https://gemini.google.com/app` in the signed-in browser. Use the existing **Deep Research** notebook when supported, or create it under **Notebooks → New notebook**. For an existing chat, the sidebar's **More → Add to notebook** can file it. Verify the research mode remains available in the chosen context. A missing notebook feature is a filing blocker, not permission to replace Deep Research with a Gem or ordinary chat.
2. Select **Deep Research** in the current composer tools. It may be under **+**, **Tools**, or **More tools**; inspect rather than assuming placement. Verify activation. Honor a requested model when available; otherwise use the product's eligible default and record it. Do not pin an old Pro model or require a paid tier by default.
3. Enter the common brief and verify its attachments/source selection. Submit it and record the chat URL. Gemini may return a proposed plan before research starts. Inspect it and use **Start research** when aligned; don't mistake the plan for the report.
4. Track the research to a completed report. Resume the same chat if interrupted. Do not infer completion from an ordinary assistant turn.
5. Use the report's **Share & export** controls. If a usable native download is offered, save it. Otherwise use **Export to Docs** and wait through **Creating document…** rather than clicking Export again. If the browser blocks the new tab, open that individual blocked Doc link instead of changing persistent pop-up settings. Verify the resulting Doc's account, title and report content. Record the exact URL/ID and creation context of every Doc this run creates, including accidental duplicates; do not identify them by title alone. Export the tracked Doc with a supported authenticated Drive/Docs tool or its own download menu, preferring Markdown and a format that retains headings, tables and source links.
6. Prefer a sufficient supported Docs/Drive operation under the host's tool-routing rules, and confirm that it can access the exact tracked Doc in the intended account. A returned file reference is not a local download: complete its supported retrieval and verify the local file. If connector access fails, use the signed-in browser route or ask for that exact report export; do not widen sharing or switch accounts to repair the connector. Do not reuse private OAuth-cache scripts or read authentication tokens.
7. Once the complete native export is saved in the local project folder, reopen it and verify its task identity, report body and full source list as described below. Then, unless the host adapter says to retain them (Codex does), move each verified temporary Google Doc created by this run to **Trash**, using its recorded exact URL/ID through supported Docs/Drive or browser controls, such as **File → Move to trash** when offered. For each Doc, including duplicates, establish its origin and verify that the local capture preserves the content it represents. Verify its Trash state and record the individual cleanup result in `RUN.md`. This depends on the corresponding Gemini capture, not ChatGPT's download. Do not permanently delete Docs or empty Trash. If capture is pending, incomplete or unverified, the Doc's identity is uncertain, or it is a pre-existing/user-supplied document, retain it. If cleanup fails, keep the local report and record cleanup as blocked; do not rerun the research or claim deletion succeeded.

## Capture and recovery

Before triggering an export, note existing downloads and the export time. Identify the newly produced file by the browser's download result or by a new file plus its actual topic, title, report body and source list. Preserve native download filenames and collision suffixes during capture; do not overwrite previous downloads. Multiple concurrent downloads from different products require identity checks, not a newest-file guess. Wait for download completion before copying the unchanged export into the project archive.

Distinguish each export's state: **complete, in progress, failed, or unknown**. Inspect tool results, visible export/download status and local files, including late downloads. A timeout, slow response, missing finished file or lack of immediate UI change is not proof of failure. While an export is active, wait and check rather than trigger a duplicate or another format for the same report. If its state is unknown, inspect the existing operation. If uncertainty remains, record `capture-incomplete` with the export detail, retain the Doc and report the blocker. Use an automatic alternate format only when the first format is unavailable or its export has definitively failed and is no longer active.

Preserve the native export byte-for-byte. Confirm it is the completed report, not a plan, HTML error or placeholder. Read the beginning, end, section structure and sources; check for lost tables, links and image-based equations, including in conversions. Record file size, hash, format, capture method and originating task URL. Don't fabricate missing content or treat a preview excerpt as the full report.

Gemini's Copy control can omit the full Works cited section even when it copies the report body. Check against the completed report before accepting it. If Markdown is unavailable or its export meets the confirmed-failure condition above, prefer Word export of the same Doc and retain that original; any text extraction is a separate derivative. A plain-text export is not automatically a complete substitute: verify its body, available sources and consequential structure against the source, disclose losses and keep its genuine extension. Do not rename TXT to Markdown. Recover the same report rather than starting new research.

If export fails, recover the existing report and retry a bounded number of times after checking the failure. Never ask the product to reprint a long report into chat, stitch partial replies, or transcribe screenshots. If the native route still fails, mark `capture-incomplete`, leave the task accessible, and ask the user for its export. Do not silently synthesize without this unresolved arm.

Close only tabs opened by this run, and only after report capture and filing are verified. Leave pre-existing user tabs and blocked tasks alone. Retain research conversations and local exports; only verified temporary Gemini Google Docs are moved to Trash as described above, and not under Codex, which retains them.

## Reference documentation

Checked 2026-11-05; live account controls are the execution check:

- [ChatGPT Deep Research](https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt)
- [ChatGPT Projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt)
- [Gemini Deep Research](https://support.google.com/gemini/answer/15719111?co=GENIE.Platform%3DDesktop&hl=en)
- [Gemini notebooks](https://support.google.com/gemini/answer/16972047?co=GENIE.Platform%3DDesktop&hl=en)
- [Gemini limits](https://support.google.com/gemini/answer/16275805?hl=en)
