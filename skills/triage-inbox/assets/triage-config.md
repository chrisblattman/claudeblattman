# Triage configuration

Have the agent complete this after policy decisions are approved. No private scripts or credentials belong here. Empty example rows are not active rules.

## Locations and connection

- Gmail account: [same account as policy]
- Policy path: [path to policies/email-policy.md]
- State path: [path to state/triage-run-state.json]
- Mail connection: [available Gmail connector or Workspace MCP]
- Optional calendar connection and calendar ID: [only if configured]

Use separate state for each account. Before adopting older state, confirm its account. Do not reset valid history to install a newer skill.

## Label mapping

Ask the connection to list Gmail labels. Record actual IDs and preserve nested names exactly. Remove unused examples. Do not invent IDs or create labels without agreement.

| Purpose | Actual label name | Actual ID | Skip inbox? | Read action | Approved rule |
|---|---|---|---|---|---|
| Reading | [e.g. @ToRead] | [from Gmail] | [yes/no] | preserve | [policy rule] |
| Announcements | [your label] | [from Gmail] | [yes/no] | preserve | [policy rule] |
| Receipts | [expense label] | [from Gmail] | [yes/no] | preserve | [policy rule] |
| Routine automated mail | [your label] | [from Gmail] | [yes/no] | preserve | [policy rule] |

Archiving removes INBOX. To preserve read status, neither add nor remove UNREAD. Preserve unrelated labels. Leave historical `@FYI` alone and do not add it to new messages.

## Reviewed sender patterns

| Exact sender or narrow pattern | Qualifying content | Exceptions | Destination | Approved date |
|---|---|---|---|---|
| [reviewed example] | [routine content] | [personal requests, failures, deadlines] | [mapped label] | [date] |

Newsletter platforms, school domains, and vendors are supporting signals, not blanket filing permission. List only patterns you use.

## Optional category rules

- **Expenses:** [vendors and receipt patterns]. Do not reclassify existing expense labels. Unpaid bills and failed payments require attention. Do not infer business/personal status from a merchant alone.
- **Travel:** [routine confirmations to file]. Check-in requests, changes, cancellations, payment issues, and human host messages stay visible.
- **Calendar invitations:** [keep visible by default, or an explicitly approved routing rule]. Verify event presence and RSVP if a calendar connection exists. Missing events, unknown RSVP, or unavailable verification need attention and do not themselves authorize filing.
- **Temporary delivery delays:** [disabled unless approved]. File only verified automatic retry notices, preserving read state. Permanent/mixed failures stay visible.
- **Completed-submission acknowledgments:** [disabled unless approved]. File only confirmed automated receipts with no remaining request or deadline.

## Corrections and filter candidates

| Sender/pattern | Correction | Exceptions | First observed | Last reviewed |
|---|---|---|---|---|
| [user correction] | [change] | [exceptions] | [date] | [date] |

Protections and holds still win. Patterns with at least 14 days of evidence may be proposed as permanent filters, never created by triage.
