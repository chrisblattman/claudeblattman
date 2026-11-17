---
name: post-meeting
description: "Summarize a selected meeting transcript, extract decisions and action items, and draft a follow-up email in chat by default; nosend skips the draft. Send only when the user explicitly asks after seeing the draft. Use for the account of one meeting; weekly-review handles updates to the continuing project record."
---

# Post-Meeting

Public adaptation v2.2, 2026-11-17. Reuses existing project settings, supports archived transcripts and labeled notes, and carries user corrections into an optional weekly-review handoff. This is a portable instruction workflow, not a bundled transcript fetcher, mailbox client or dashboard writer. Live app execution still needs validation in the user's setup.

By default, display an accurate summary of one meeting followed by a follow-up email draft in the current chat. This skill does not update the dashboard, dated project history or project description. Weekly-review reconciles meeting evidence with the continuing project record and proposes changes to the plan. The user can run either skill independently or explicitly request both.

## Inputs and options

Use a supplied transcript path/link, meeting name/date or provider document ID. With no selection, find recent meetings within the selected project and ask which one when ambiguous. An explicit selection does not require another confirmation before reading.

- `[keyword]`: filter candidate meetings by title or filename.
- `id:DOC_ID`: retrieve that meeting's transcript through the available provider connection; verify meeting identity.
- `nosend`: display the summary without preparing email or prompting about recipients.
- `email`: accepted for compatibility; email draft text is already included by default. `nosend` takes precedence when both occur.
- `save`: also save the summary in the established project location. `nosend save` saves the summary and skips email.

Honor requests for summary only, a shorter account, a particular language, or analysis without saving. An explicit read-only request overrides `save` and prohibits mailbox drafts, configuration changes and other writes.

## Resolve the existing project setup

Resolve a project named in the request against the current workspace, known project mappings and aliases, and explicitly supplied folders. Verify its identity from the project instructions or index, then read its configuration. Ask only when multiple projects match or the location is unknown; don't search unrelated personal folders. When no project is named, use the selected workspace. Resolve phrases such as “this morning” in the user's timezone and state the actual meeting date in the output.

Read the selected project's instructions and established configuration. New dashboard setups use `PROJECT_CONFIG.json`; older projects may use fenced YAML and prose in `.claude/CLAUDE.md` or another identified settings file. Reuse the existing team list, source locations and document links; don't create competing JSON and YAML authorities or require setup to be repeated.

For the public project configuration, use `project_name`, `sources` (`kind`, `location`, `required`, and optional `role`/`filters`), `excluded_sources`, and `index_path` to identify relevant evidence. `overview_path` locates a local dashboard; `dashboard.document_id`, `document_url`, `account`, `overview_tab_id` and `plan_tab_id` identify cloud document roles for reading relevant dashboard notes/comments and, when requested, saving a correction. Resolve relative paths from the project root. Dashboard access is not required to summarize a supplied transcript.

Use `meetings.transcript_path` when present for the local transcript folder; otherwise resolve the established transcript directory from the source list, index or existing instructions. Source filters can record project email addresses, keywords, exclusions and selected WhatsApp chats; reuse them without asking for the same setup on every run. A source entry identifies material to read, not authorization or credentials to connect an account. Keep search filters separate from email recipient policy.

Map legacy fields such as `folders.transcripts`, `team`/`team_roster`, `project_keywords`, `exclude_keywords`, `granola_folder(s)`, `google_doc_id` and `meeting_summary_recipients` to the same working context. Read an existing roster or its linked file rather than copying it into configuration; the public JSON contract does not require a new roster field. Keep the project's established recipient policy unless the user changes it.

If settings are incomplete, use the configured index or `PROJECT_INDEX.md`, existing instructions and supplied links to fill the gaps. Ask only about unresolved locations or conflicts. Don't silently select a conflicting authority or migrate settings. A usable supplied transcript does not require any config file or account connection. Missing email addresses block mailbox draft creation, not the summary. Repair or save settings only when requested, preserving unrelated values.

## Find and read the meeting record

Use the host's available file readers and connectors; don't assume private scripts or specific MCP tool names. For configured local transcripts, search the main folder and `archive/` for `.txt`, `.vtt`, `.rtf`, `.pdf` and other readable exports. Use meeting identity and date, not file modification time alone. Deduplicate exports of the same meeting; retain distinct meetings held on the same date.

With a transcript connection, retrieve the selected project's meeting transcript, not just the provider's generated notes. Use the actual document ID expected by that provider and verify title/date; calendar event IDs may differ. If retrieval fails, use available local records and report the gap. No fetch/file/archive helper is bundled; use the available connection and local file tools for the filing step below. Don't move, normalize or overwrite original transcripts.

If the user supplied an exact meeting, read it. Otherwise resolve genuinely ambiguous candidates before summarizing. An older transcript is not evidence of a processing delay. Report “still processing” only when supported by the provider or source metadata; don't infer it from a 30-minute age rule or promise a fixed wait time.

### Keep a local transcript copy

By default, when a selected meeting's transcript is fetched from a connected app, save a UTF-8 `.txt` copy in the configured project transcript folder. This is separate from `save`, which controls saving the generated summary; `nosend` skips email only. An explicit read-only, no-save or no-file request suppresses transcript filing too.

Resolve the destination from `meetings.transcript_path` or the existing equivalent. If no unambiguous local destination is configured, ask where to file it while continuing the summary; don't invent a folder or silently change configuration. Reuse an existing local transcript instead of converting or copying it unnecessarily. This workflow files only the selected meeting, not the project's entire transcript history.

Verify the provider meeting ID, title, date and timezone. Retrieve all available transcript pages before exporting. Preserve the returned wording, speaker labels and timestamps; remove presentation markup only as needed for plain text. Add a clearly separated source header with meeting identity/date, provider ID/link, retrieval date and any known coverage limitations. Never substitute generated notes for a raw transcript; label a partial transcript as partial. If only notes are available, report that no transcript copy was filed and continue with a clearly labeled notes-based account where appropriate.

Check the destination and its archive for the same provider ID or verified meeting identity before writing. Use a collision-resistant name such as `YYYY-MM-DD-meeting-slug-provider-id.txt`, with a safe short identifier or time when needed. Reuse a matching complete copy; preserve existing files and human edits. If a later fetch adds missing transcript content, save a distinctly named version and report the relationship rather than overwriting the earlier copy. Never merge different meetings solely because they share a date. Read back the saved file to verify content and report its exact path. If retrieval, write access or verification fails, disclose that failure; a summary can still proceed with available evidence.

### Read the user's meeting comments

Read relevant human notes, corrections and unresolved comments from the configured dashboard alongside the selected transcript. Use the meeting date, topic and source to establish relevance; do not carry an unrelated comment into this meeting's account. The transcript records what was said; comments can correct its interpretation or add the user's follow-up instructions. Identify those contributions separately, surface conflicts, and never rewrite the transcript to match a comment. If the dashboard or comments are unavailable, say so and summarize the supplied transcript without claiming those inputs were checked.

### Assess the evidence, not its length

Distinguish a transcript, partial transcript, meeting notes, reused summary and inaccessible source using provenance, conversational content, metadata and truncation indicators. Neither character count nor a Markdown heading establishes completeness. Short transcripts and transcripts without speaker labels can be valid; long summaries are still summaries. State uncertainty about coverage when it cannot be resolved.

If the user supplied notes, summarize them as notes. If a transcript was requested but only notes are available, disclose that substitution before relying on them and offer a clearly labeled limited account when useful. Ask for the original when a consequential decision or attribution depends on missing wording. Don't invent decisions, treat missing access as “nothing happened,” or present generated notes as a verbatim record.

Keep the meeting identity and original transcript path/link in the output. Identify any additional source or human correction used. A saved summary can help locate the original, but doesn't replace it; label claims supported only by a reused summary.

## Summarize and incorporate corrections

Produce:

- A short overview of the discussion.
- Decisions with enough context to understand what was agreed and why.
- Action items grouped by person, with deadlines only where stated.
- Unresolved questions, tentative proposals and next steps.
- The source reference and material coverage gaps.

Distinguish discussion from agreement: “we considered Friday” is not “we committed to Friday.” Leave unknown owners or dates unstated. If no decisions or tasks were recorded, say so without forcing the meeting into those categories. Surface conflicting accounts instead of silently resolving them.

Use the user's supplied corrections when revising the summary. Preserve the original transcript. If a correction changes the interpretation of a passage, record the corrected interpretation rather than editing the source or implying that the transcript itself said it. Don't invent or overwrite the user's commitments from a model recommendation.

For a substantive meeting, include detailed notes by topic after the summary: reasoning, participant positions, evidence and unresolved alternatives. Preserve useful intellectual content for someone who missed the meeting. Scale detail to the meeting and request rather than padding to a fixed page count. Keep the main email easy to scan, with detailed notes as an appendix when appropriate. Use the requested or established team language; ask if audience language remains ambiguous.

## Follow-up email draft

Skip this section for `nosend`, “no send” or a summary-only request, including all email prompts. This option skips drafting, not merely transmission. Otherwise prepare a draft in the session, using the corrected account. A mailbox connection is unnecessary until the user wants a mailbox draft created. If addresses are missing, still show the in-chat draft with recipients clearly marked as unresolved; do not block the summary or guess addresses.

**Recipients:** Honor explicit recipients first, then the project's established `meeting_summary_recipients` or equivalent policy. For older configurations with a team roster but no override, preserve the existing default: the full team minus `infrequent` and `stakeholders`, including affected team members who missed the call. Explain that this can be broader than attendees and show the actual list. If no roster/policy exists, use verified meeting attendees as proposed recipients, or ask for the missing addresses. Do not guess addresses or silently add people outside the roster merely because the transcript names them. For a restricted or sensitive meeting, flag a broad team list for review before creating any mailbox draft.

**Sender:** Use the user's stated choice or established project preference; otherwise draft in the user's voice. An explicitly chosen AI-assistant sender must identify itself as such and use the configured identity and reply-to details. Sender choice is not approval of the recipients or email body.

Show the complete proposed sender, To/Cc/Bcc, subject, body and any attachments. Use the meeting's actual date in the opener when it wasn't today or yesterday. Include a source reference appropriate for the recipients; a local file path is not automatically a link they can open. Don't change source sharing permissions to make it accessible.

Create a Gmail or other mailbox draft only when the user has authorized that action for the displayed content and recipients. Reuse approval already given for an unchanged draft. Use the host's available mail connection and report its actual result. If unavailable or unsuccessful, leave copyable text and don't claim a draft was saved. **Draft by default; send only after an explicit user instruction to send the displayed email.** A request for a brief/summary, permission to create a mailbox draft, or praise for the wording is not an instruction to send. After the draft and complete sender/recipient addresses are shown, a clear “send” authorizes sending that message through a capable mail connection; do not ask again for unchanged content and recipients. Resolve missing addresses or ambiguity about which draft/account first. Do not expand the recipients or send a materially different message without authorization. A later explicit send request can supersede an earlier draft-only preference; `nosend` by itself never authorizes email preparation or transmission.

If sending is disabled for the account, keep the existing mailbox draft or save the prepared message as an unsent draft when draft creation is available. Tell the user to open their mail app's Drafts folder and send it there; provide the draft link when available. If draft creation is unavailable too, provide copyable sender/recipient details, subject and body, and say no mailbox draft was saved. Never bypass account restrictions. Report the actual send/draft result. If a send attempt has an uncertain outcome, check the message status before retrying to avoid duplicate delivery.

## Optional local save

Process `save` independently of email so that `nosend save` works. Save the summary alongside the transcripts or in the project's established summary location, using a filename such as `summary-YYYY-MM-DD-meeting-slug.md`. Include meeting identity, original source reference, relevant corrections and any source limitations. Distinct meetings on one day must not overwrite each other. Preserve existing human edits; revise an existing saved summary only when that update is requested or already authorized.

Do not save a separate corrections database or mandatory handoff file. Without a summary-save request, keep the summary in the session. The selected transcript may still be filed as described above. Don't create performance logs or processed-source state, and don't advance weekly-review checkpoints.

## Optional handoff to weekly-review

When useful, offer weekly-review as the next step for refreshing the dashboard and dated history and proposing project-description changes. Don't run it unless requested; a follow-up email alone may be all the user wants. If the user requests both workflows, pass the original transcript reference and explicit corrections into the review and follow its update rules. Don't implement a second dashboard updater here.

Corrections in this chat or an email draft are not automatically visible to a later review in another chat. Explain the simple choices when a correction matters to the continuing record: include it in the next weekly-review request, or ask the agent to put it in a dashboard comment or the existing human-notes area. For example: “Friday was suggested, not agreed. Keep the deadline undecided.”

If explicitly asked to record that correction, verify the exact project document and dashboard tab or local file. Use the available comment tool or the existing human-notes area as requested, identifying the meeting and source. Preserve generated dashboard content, prior notes, history and the project plan; do not resolve unrelated comments or change review checkpoints. If a safe comment/note write is unavailable, provide the text to paste and report that it was not saved. Do not silently substitute a plan edit, a new file or a different tab.

A saved summary is optional evidence, not a guarantee that weekly-review will discover it. When the user wants it included, point the review to the corrected summary and original transcript. Weekly-review remains responsible for reconciling those sources with existing project commitments and for handling plan changes separately.
