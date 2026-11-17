---
name: pre-meeting
description: "Prepare for a meeting using the project's description, dashboard, previous meeting records and relevant correspondence. Produce an in-chat brief and agenda email draft by default; nosend skips the draft. Send only when the user explicitly asks after seeing the draft."
---

# Pre-Meeting

Public adaptation v2.2, 2026-11-17. Uses the project setup shared with setup-project-management and weekly-review, while supporting existing project instructions. This is a portable instruction workflow, not a bundled connector, transcript fetcher or email sender. Live app execution still needs validation in the user's setup.

By default, display a preparation brief followed by an agenda email draft in the current chat. Prepare the user for one meeting: what was agreed last time, what remains unfinished, what needs a decision, and what to read or share. This skill reads the project record; it does not refresh the dashboard or edit the project plan. After a meeting, post-meeting can prepare a summary or email, and weekly-review can update the continuing project record. Neither is a mandatory next step.

## Inputs and options

Use a supplied meeting name, date, invite or project. With no meeting specified, use the selected project's upcoming calendar events when accessible. Ask only if the intended project or meeting remains ambiguous.

- `light`: a short brief with a narrow evidence pass. Still read both project documents and relevant corrections.
- `full`: a fuller brief, including participant-specific open loops and preparation needs.
- `since:YYYY-MM-DD`: explicit start of the recent-evidence window.
- `nosend`: brief only; skip email preparation and email prompts.
- `email`: accepted for compatibility; email draft text is already included by default. `nosend` takes precedence when both occur.
- `save`: save the brief locally as well as displaying it. Works with `nosend`.

Use the requested depth; otherwise a routine check-in can use light and a substantive planning meeting full. These options also work when expressed in ordinary language. Honor explicit read-only requests; don't save files, change configuration or create mailbox drafts in those runs.

## Resolve the existing project setup

Resolve a project named in the request against the current workspace, known project mappings and aliases, and explicitly supplied folders. Verify its identity from the project instructions or index, then read its configuration. Ask only when multiple projects match or the location is unknown; don't search unrelated personal folders. When no project is named, use the selected workspace. Resolve phrases such as “this morning” in the user's timezone and state the actual meeting date in the output.

Read the selected project's instructions and established configuration. New setups use `PROJECT_CONFIG.json`; older setups may use fenced YAML and prose in `.claude/CLAUDE.md` or another explicitly identified settings file. Reuse the existing authority rather than creating a second team list or set of document links. Installing this skill does not require running project setup again.

For the public project configuration, resolve:

- `project_name`, `index_path`, and `overview_path`: identity, source index and local dashboard.
- `sources` (`kind`, `location`, `required`, and optional `role`/`filters`) and `excluded_sources`: selected transcripts, project plan, correspondence and other evidence, with existing filters and exclusions.
- `dashboard.document_id`, `document_url`, `account`, `overview_tab_id`, and `plan_tab_id`: the verified Google Doc and tab roles when using cloud documents.
- `review.history_path` and `review.last_successful_refresh`: earlier reviews and the last verified refresh, when available.

Resolve relative paths from the project root. For local documents, find the project description/plan in configured sources or the index; don't assume the overview file contains both roles. For Google Docs, the dashboard/history and project description are roles, not mandatory names or tab positions. Verify their configured IDs against the actual document; don't assume the first tab or `t.0` is the dashboard. Older configurations may call a detailed log “Tab 2”; establish what each tab actually contains before treating it as the project description.

Use `meetings.transcript_path` when present for the local transcript folder; otherwise resolve the established transcript directory from the source list, index or existing instructions. Source filters can record project email addresses, keywords, exclusions and selected WhatsApp chats; reuse them without asking for the same setup on every run. A source entry identifies material to read, not authorization or credentials to connect an account. Keep search filters separate from email recipient policy.

Map legacy fields such as `google_doc_id`, `folders.transcripts`, `folders.weekly_reviews`, `team`/`team_roster`, `project_keywords`, `exclude_keywords`, `granola_folder(s)` and `whatsapp_groups` to the same working context. Read an existing linked team roster rather than copying it into JSON. The public configuration does not require a new roster field.

If configuration is incomplete, use the project's `PROJECT_INDEX.md` (or configured index), existing instructions and user-supplied links to fill the gaps. Ask for only unresolved locations or conflicting authorities. Don't silently choose between contradictory settings, rewrite configuration, migrate an old project or search unrelated folders. A missing config is not a reason to reject usable project documents supplied by the user. If the user asks to save or repair settings, reuse their established location and preserve unrelated values.

## Establish meeting and evidence scope

Use the supplied invite or meeting details first. Otherwise search the accessible calendar for the selected project's meetings today and tomorrow, matching title and known participants; offer alternatives if more than one matches. Without calendar access, ask for the missing meeting details and use supplied materials. Calendar and email connections are useful, not prerequisites for a local-document brief.

Use `since:` when supplied. Otherwise use the last verified review/refresh date, or the date of the latest relevant saved weekly review, with a 14-day default when neither exists. State the chosen interval. This bounds new correspondence; it does not exclude the current project documents, outstanding commitments or the raw transcript underlying the latest review.

Use the host's available connectors and file readers. Read only the selected project's sources. No private helper, specific MCP tool name, WhatsApp database schema or personal path is required. Optional-source failures should not block other useful reads. Distinguish an empty search, an unavailable source and a source not searched. A single useful document can support a limited brief; don't fabricate corroboration or require an arbitrary number of connected apps.

## Gather the evidence

1. **Read both project documents, in light and full modes.** Read the current dashboard, relevant dated history and human notes, plus the project description/research design. Use them to understand the purpose, approach, open choices and current commitments. Read relevant unresolved document comments when accessible. If either document or its comments cannot be read, disclose that gap and qualify the brief; don't claim full project coverage.
2. **Read prior raw meeting records.** Search the configured transcript location and its `archive/` subfolder for relevant `.txt`, `.vtt`, `.rtf`, `.pdf` or other readable exports. Select by meeting identity and date, not file modification time alone. If a weekly review sets the lookback date, also read the latest raw transcript(s) that review summarizes, including archived ones. Deduplicate multiple exports of the same meeting without merging distinct meetings on the same date.
3. **Use connected transcripts when needed.** Retrieve prior project meetings through an available Granola or other transcript connection when local records are missing or incomplete. Verify title/date and use the provider's actual document ID rather than assuming a calendar event ID is interchangeable. An upcoming meeting has no transcript yet; seek earlier meetings for context. No transcript-fetching helper is bundled. Don't auto-archive, overwrite or normalize originals; any requested local export should preserve them.
4. **Read recent correspondence and drafts.** Use configured collaborators, project keywords, date ranges and exclusions. Check relevance even when the sender is a teammate. Consider sent as well as received mail, posted agendas, relevant drafts and configured message groups. With message sources, use supported reads and report date/coverage gaps; don't assume an empty group means no project activity. For full briefs, read relevant handoffs, task lists and a configured donor profile if the meeting is with a funder.

Light mode narrows correspondence and prior-meeting coverage, not the two-document baseline. Full mode goes deeper where the agenda or unresolved questions warrant it. Avoid fixed call caps that prevent reading an essential source; keep searches bounded and report material access or coverage limits.

### Distinguish transcripts from summaries

Use source provenance, export metadata, conversational content and any truncation/processing indicators to describe what was actually read: a transcript, partial transcript, meeting notes, reused summary, or unavailable source. Short length, a Markdown heading or absent speaker labels alone does not establish that a transcript is incomplete. A short meeting can have a short transcript; a long file can still be only an AI summary. Don't claim completeness when it cannot be established.

Notes and weekly reviews can help locate prior decisions and source files. They are not raw transcripts. If notes are all that is accessible, use them with a clear limitation, or ask for the missing transcript when a decision depends on exact wording. Don't treat missing transcript access as evidence that nothing was decided.

Keep a compact source ledger with identities, dates and paths/links. Distinguish original evidence freshly read for this run from reused summaries; opening an old summary today does not make its claims fresh evidence. A summary and its underlying transcript are not independent corroboration. Label claims supported only by a reused summary accordingly.

## Build the brief

Carry forward outstanding commitments unless there is evidence of completion, cancellation or replacement. Absence from recent messages is not completion. Distinguish agreed decisions, proposals, factual corrections and unresolved questions; don't invent owners or deadlines. Use explicit human corrections in the request or project documents, and surface material conflicts rather than silently preferring one channel.

When a posted agenda exists, organize the brief around it and identify important omitted items. Otherwise use:

- What happened since the last meeting, with source dates.
- Decisions needed now, including the actual open question and relevant alternatives.
- Unfinished commitments or open loops, with owners/dates where known.
- What the user should read, prepare or share; a suggested agenda or focus.
- Sources used and material gaps.

A light brief can use a few bullets. A full brief can add “what I owe them / what they owe me” by attendee and the reasoning behind contested issues. Match length to the meeting and user's request.

For consequential claims, show a source reference and distinguish corroborated, single-source and inferred statements. A direct transcript statement can support an attribution without requiring an email duplicate. Don't present an inferred task as an agreed commitment. Suggested agenda items may be useful even without an explicit prior decision; label them as suggestions.

## Email draft and optional local save

Display the brief first, followed by an agenda email draft in the chat by default. `nosend`, “no send” or a brief-only request skips the draft and all email prompts; it is not merely a ban on transmission. Present the agenda, relevant updates and preparation materials, omitting private reminders about what others owe the user and unsupported inferences. Keep source limitations visible to the user and avoid expressing uncertain claims as settled facts in the email.

Use the user's requested recipients or the verified invite attendee list. If addresses are missing, still show the in-chat draft with recipients clearly marked as unresolved; don't block the brief or guess addresses. Display the complete From address, To/Cc/Bcc addresses, subject and body for review; use the established sending account or clearly mark it unresolved. Names alone are not verified email addresses. If recipients or the sending account are unresolved, ask before creating a mailbox draft; don't infer addresses. Creating a Gmail or other mailbox draft requires authorization for that action and a capable connection. Report whether the draft was actually created. If no connection is available, leave copyable text in the session. **Draft by default; send only after an explicit user instruction to send the displayed email.** A request for a brief/summary, permission to create a mailbox draft, or praise for the wording is not an instruction to send. After the draft and complete sender/recipient addresses are shown, a clear “send” authorizes sending that message through a capable mail connection; do not ask again for unchanged content and recipients. Resolve missing addresses or ambiguity about which draft/account first. Do not expand the recipients or send a materially different message without authorization. A later explicit send request can supersede an earlier draft-only preference; `nosend` by itself never authorizes email preparation or transmission.

If sending is disabled for the account, keep the existing mailbox draft or save the prepared message as an unsent draft when draft creation is available. Tell the user to open their mail app's Drafts folder and send it there; provide the draft link when available. If draft creation is unavailable too, provide copyable sender/recipient details, subject and body, and say no mailbox draft was saved. Never bypass account restrictions. Report the actual send/draft result. If a send attempt has an uncertain outcome, check the message status before retrying to avoid duplicate delivery.

When `save` or a separate save request is given, save to the established project location, normally alongside the transcripts. Use a meeting-specific filename such as `pre-meeting-YYYY-MM-DD-meeting-slug.md`; avoid collisions for distinct meetings on the same day. Include the meeting identity, source ledger and unresolved limitations. Preserve earlier versions and human edits when revising an existing brief. Without a save request, display the brief without creating logs or other local state.

If useful, finish with one optional next step: post-meeting for a summary or follow-up draft, or weekly-review for updating the project record. Do not launch either workflow, edit project documents or schedule recurring work merely because a brief was prepared.
