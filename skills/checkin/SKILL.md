---
name: checkin
description: Run an interactive email check-in with FYIs, decisions, drafts, and durable follow-up. Use for inbox review, catch-up, continuing an email batch, or changing check-in preferences. The broader calendar/reminder routine is an explicit option. Do not use for an isolated email lookup or standalone reply.
metadata:
  version: "2.0.0"
---

# Check-in

Default to email: run the installed `/triage-inbox`, then present **FYIs** followed by **Needs attention**. Keep the user's decisions, unfinished drafts, and unshown candidates across sessions. Use existing approved mail tools, not a private send script or a newly created authenticated client.

The normal FYI setting marks selected, fully reviewed, no-action messages read before showing their summaries. It does **not** archive them. Disclose this during setup and honor existing policy or any user opt-out. No reply needed does not necessarily mean no action: an attachment to read, portal task, intentional later reading, or an unresolved hold belongs in Needs attention.

This folder includes configuration, workflow references, and a Python 3.9+ standard-library batch writer. It requires a mail connection. `/triage-inbox` is a separately installed skill for the sorting phase; if missing, report that and offer to install its full public folder. Read-only email review can still proceed with a disclosed triage gap. Calendar, task app, and meeting tools are optional and only used when relevant or requested.

## First-time setup

1. Find the user's existing email-assistant project, account, policy, and triage configuration. Reuse them. Do not replace customized files or introduce a second policy. Resolve the installed skill paths and use actual connector schemas on the current host.
2. Create `config/checkin-config.md` from the bundled [template](assets/checkin-config.md) only if no working check-in configuration exists. Fill in the account, policy and runtime paths. Keep batches outside the skill, for example under `state/checkin-email-batches/`. Preserve old session summaries without pretending they contain per-item decisions.
3. Explain the default FYI behavior: read the selected messages and their context, mark qualifying ones read, verify, and summarize them; leave them in the inbox. Record this specific standing permission in the policy if the user accepts it. Do not override an existing preserve-unread instruction silently. There is no repeated per-message approval once this permission is established.
4. Configure the enabled extra reviews using [preferences.md](references/preferences.md): family/important labels, quarantine digests, and newsletter reading holds. Ask for relevant sources once during setup. Enabled without a source means **not configured**, not a completed review. If an extra does not apply, the user can turn it off in plain language. Do not invent a provider, label, subscription, or private workflow.
5. Choose reply mode: `review_then_send` through the available approved connector, or `draft_only`. Check the connection's actual capabilities. Record the user's writing preferences and any task app they already use. Never copy another person's addresses, voice files, sending infrastructure, or standing forwarding instructions.
6. Save the agreed account and file paths in project instructions for later sessions. Mark setup complete only after resolving these choices. Installing this skill does not schedule a check-in or send any mail.

## Modes and boundaries

| Request | Scope |
|---|---|
| `/checkin` or `/checkin email` | New email review of the last 24 hours, plus known unfinished obligations. |
| `/checkin last 6 hours` | Requested interval. “Since last review” uses the last verified discovery cutoff, not answer time. |
| `/checkin catch up` | Last 14 days, both read and unread, plus known unfinished work. A requested number of days overrides 14. |
| `/checkin resume` | Reconcile an existing batch and its pending work. Do not start general triage again. |
| “Next batch” / “keep going” | Continue the current scope and its unshown candidates. Retain earlier decisions, drafts, and holds. |
| `/checkin full` | Broader routine in [full-session.md](references/full-session.md). |
| `quick`, `tomorrow`, or `no-email` | Corresponding broader mode, as defined in that reference. |
| `no-triage` | Skip ordinary filing for this review. Enabled family/quarantine reviews remain read-only unless separately authorized. |
| `noapply`, `dryrun`, or explicit read-only preview | No mail, calendar, reminder, policy, batch, or operational-state writes. Pass preview to triage. Return proposals in chat. |

Explicit fixed historical ranges, only-new requests, excluded sections, and user opt-outs take precedence over wider default discovery. A one-session skip is not a permanent preference. An explicit “turn off from now on” updates the saved configuration, unless the user requested preview only.

## Review workflow

Read [review.md](references/review.md) and [continuity.md](references/continuity.md). For enabled extras read [preferences.md](references/preferences.md). Read [sending.md](references/sending.md) before preparing final approvals or acting on replies.

### 1. Recover context and run canonical triage

Read the current policy/configuration and relevant open/recent batches. Keep older unfinished work and useful unshown candidates, even from batches whose displayed items are finished. Do not copy old approvals to new mail.

Before triage, resolve configured newsletter windows and existing message holds into exact message IDs; preserve any rule that keeps unread status or retains a message in Inbox. On a fresh ordinary review, invoke the actual installed `/triage-inbox` workflow with the account, policy paths, mode/range, and current exact-ID holds. Do not inline an older triage algorithm or write its state yourself. One executor owns mailbox filing at a time. Reuse returned verified results, actual coverage, and failures. Resume and draft/decision turns do not rerun it. If triage cannot finish, provide supported review with that gap disclosed.

### 2. Read and establish what still needs the user

Default to main-Inbox discovery, read and unread, plus configured family/quarantine coverage and known specific commitments. Broader folder recovery is an optional setting, not a host-dependent surprise. Honor scoped exclusions and fixed windows. Paginate fully, read relevant contents, and distinguish discovery from completed review.

Before asserting a task is still open, inspect the actual thread and relevant Sent/action evidence. A draft is not a sent reply. A holding reply can leave work outstanding. Verify an attachment was actually delivered when that is the task. An unrelated later reply or another person's assignment is not the user's unfinished obligation. Keep uncertainty explicit when evidence is missing.

### 3. Present FYIs, then Needs attention

Show up to ten useful items in each group, not a quota or search limit. Do not refill from already-filed bulk mail. Start numbering at 1 for each new batch, continuously across the two groups, and keep numbers stable during revisions/resume.

- **FYIs — marked read:** Select only fully reviewed, clearly informational unread messages with no reply, task, meaningful unresolved risk, document review, intentional later reading, or hold. Save/read back the batch's exact source-to-number mapping first. With standing permission, remove only UNREAD from those exact IDs, verify every readback, and record the outcome before presenting. Keep INBOX and all other labels. If read status failed or is unknown, say so rather than claiming clearance. If automatic marking is off or policy does not authorize it, use **FYIs — left unread** and propose any read changes instead.
- **Needs attention — reply, decide, act, or read later:** Explain the ask, relevant timing and commitment, and suggested next step. Offer a short complete draft for a straightforward reply, or a proposed approach when the user's judgment is needed. Do not invent commitments, availability, deadlines, or recipients.

**Presentation is not archiving.** No automatic archive-after-display behavior is included. The user can ask to archive particular reviewed messages or separately establish a precise filing rule. That request still cannot include unreviewed later arrivals.

### 4. Handle decisions and preserve continuity

Interpret dictated mixed responses item by item. Bind numbers to their specific batch/source IDs. Leave unmentioned items pending. Apply clear authorized read/hold/filing decisions without losing independent draft changes. Ask only about material ambiguity. Keep sends separate from other actions and do not treat “next batch” as send approval.

For successful replies, verify delivery and separately handle authorized read-status cleanup on eligible source IDs. Preserve newer incoming mail and unfinished substantive work. Reconcile uncertain sends before any further attempt. A cleanup failure never justifies resending a successful reply.

At a natural pause, offer the next batch with a concise account of what remains. Before presenting a rolling review, check for new arrivals and changed thread status after preparation. Respect a fixed historical end instead of widening it. Save reviewed/unreviewed remainders and the verified discovery cutoff. State material coverage gaps, plus quarantine/family status when enabled. Do not claim “nothing remains” merely because no further replies are needed.
