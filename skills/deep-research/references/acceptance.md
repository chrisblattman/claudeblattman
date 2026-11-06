# Acceptance checks

A complete live acceptance consumes the accounts' research allowances. Run it on a small public question when the user requests a test, and record what was actually tested. Merely opening a mode or validating Markdown is not end-to-end acceptance.

## Offline scenarios

| Setup / request | Expected decision |
|---|---|
| Both products accessible | One actual ChatGPT job and one actual Gemini job; independent concurrent research; fresh synthesis after capture. |
| “Only Gemini” | One Gemini browser job; no ChatGPT or ordinary agent arm. |
| Default Gemini unavailable before launch | Explicit single-ChatGPT result; record why Gemini was unavailable. |
| User requires both, one unavailable | Preserve dependency and ask for the missing access/choice; no claimed complete result. |
| Deep Research folder absent | Create the supported project/notebook with that exact name; verify membership and record identity. |
| Existing Deep Research container | Reuse it without changing its sources, instructions or sharing. |
| Intended signed-in account ambiguous | Resolve it before submitting to that product; do not infer identity from an account index or container name. |
| Folder feature absent or retention blocks filing | Record filing blocker; do not substitute a chat-title prefix, Gem or Drive folder and claim success. |
| Plan waiting for Start research | Treat as awaiting action, not a completed report; approve only within the supplied brief. |
| Unknown submission / display failure | Recover the same chat/task; no duplicate submission. |
| Quota denial | Record unavailable/failed state accurately; no API purchase or ordinary-search substitute. |
| Report complete but export broken | Capture-incomplete; recover or request that report's export, not a new run. |
| Multiple downloads / stale same-named file | Verify task identity and content before capturing; timestamp alone is insufficient. |
| Download listener times out but a file arrives | Inspect the saved file and download state; capture it if verified rather than retrying from the timeout alone. |
| Markdown export active or outcome unknown | Inspect the existing operation; no duplicate or alternate-format export while active or unresolved. Retain the Doc and record capture-incomplete if unresolved. |
| Markdown unavailable or definitively failed with no active operation | Prefer Word export of the same Gemini Doc; retain the native original and verify completeness. |
| Export to Docs creating a document or its tab is blocked | Wait for creation and open the individual blocked Doc link; do not repeatedly export or change persistent pop-up settings. |
| Connector returns a file reference without a local file | Complete supported retrieval and verify the actual local artifact before capture or cleanup. |
| Connector cannot access the tracked Doc | Use the intended signed-in browser route; do not widen sharing or switch accounts to make the connector work. |
| Text export loses tables, source links or image equations | Preserve it with disclosed limitations; do not mark complete capture or trash the source until a complete native export is verified. |
| Gemini temporary Doc and verified complete local export | Trash only the recorded Doc created by this run; verify cleanup and retain local export and research chat. |
| Local export incomplete or Doc identity uncertain/pre-existing | Keep the Google Doc; no cleanup until the temporary export and complete local copy are verified. |
| Multiple temporary export Docs | Track each exact identity and origin; trash only Docs whose represented content is verified locally. Leave uncertain-origin or differing unverified Docs untouched. |
| Gemini captured but ChatGPT download unresolved | Gemini's verified temporary Docs may be trashed; retain ChatGPT's unresolved status and do not silently omit it from synthesis. |
| Gemini Doc cleanup fails | Record cleanup as blocked; retain captured report and continue without claiming deletion. |
| One captured report, other running | No silent synthesis omission. |
| Supplied exports only | Preserve originals, record provenance and synthesize without new jobs. |
| Two reports use the same source | No double-counted corroboration or fixed provider weights. |

## Live acceptance still required

1. Install the complete folder in a temporary target-host skill location; verify the entry file, references, and loaded copy. Keep customized installed versions untouched.
2. In each browser product, confirm access to actual Deep Research and the **Deep Research** container. Record whether it was reused or created. Do not change account security/retention settings automatically.
3. Submit one shared public brief per product. Record task URLs, plan handling and research status. Confirm both research jobs run without manual prompt pasting when browser controls are available.
4. Retrieve complete native exports. Verify task identity, report sections, tables and source links; retain originals and hashes. Test Gemini's Docs export path if no direct suitable download exists. Record observed download states and recovery rather than inferring failure from a timeout. After verifying the corresponding local project capture, trash each tracked temporary Doc eligible for cleanup and verify its state without deleting the research chat or local report.
5. Resume from saved state and confirm the same tasks are reopened without new submissions. Check chat membership in the required containers.
6. Read and verify decisive source claims, run a fresh synthesis, and check that report links work. Report any account/host limitation and leave unresolved runs recoverable.
7. Repeat a temporary install/update check for each host claimed as supported. Saved user defaults should survive package replacement.

Record checks as passed, failed, blocked or not run. The published folder alone does not establish that all accounts, hosts and browser versions support this workflow.
