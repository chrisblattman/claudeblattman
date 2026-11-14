# Email Policy
*Configuration file for email-related skills (/triage-inbox, /morning-brief)*

## What This Is
This file defines your email handling rules: who's important (VIP), what gets auto-archived, and how different email categories are routed.

## Prerequisites
- Gmail account with Google Workspace MCP configured
- Gmail labels created (see "How to Set Up Labels" below)

## How to Set Up Labels

Create these Gmail labels (Settings > Labels > Create new label):
1. `@ToRead` — newsletters and long-form content you want to read later
2. `@Announcements` — institutional announcements, event notifications
3. `@School` — school/university notices (if applicable)
4. `@Family` — family communications (if applicable)
5. `Expenses/Expenses-Pending` — receipts awaiting processing
6. `Auto-Archive` — low-priority automated emails

---

## VIP List

VIP emails are never auto-triaged — they always stay in your inbox.

### Tier 1 — Never Touch (immediate family, critical institutional)
| Name | Email | Notes |
|------|-------|-------|
| [Family member] | [email] | Family |
| [Boss/supervisor] | [email] | Direct supervisor |
| [Key collaborator] | [email] | Primary research partner |

### Tier 2 — High Priority (collaborators, team)
| Name | Email | Notes |
|------|-------|-------|
| [Team member 1] | [email] | Research assistant |
| [Collaborator 1] | [email] | Co-author |

### Family Addresses
- [family-member]@gmail.com

---

## Auto-Archive Rules

Enable only rules you have reviewed. Decide archiving and read status separately. Action-required, security, payment-failure, and protected-person messages take precedence over generic sender patterns.

### Stage 1 — High Confidence (exact sender match)
| Sender | Action | Notes |
|--------|--------|-------|
| newsletter@example.org | Archive, leave unread | Illustrative reading subscription; replace with a reviewed sender. |

### Stage 2 — Medium Confidence (domain/pattern match)
| Pattern | Action | Notes |
|---------|--------|-------|
| *@notifications.example.com | Review before enabling | Check for action-required exceptions before using a domain-wide rule. |

---

## Skip-Inbox Labels

Emails routed to these labels skip the inbox:
- @ToRead — skip inbox, leave unread
- @Announcements — skip inbox, leave unread
- @School — skip inbox, leave unread
- Auto-Archive — skip inbox, mark read

---

## Customization Points

- **VIP tiers:** Add as many tiers as you need. Tier 1 = untouchable, Tier 2 = high priority but can be labeled.
- **Auto-archive rules:** Start conservative. Add senders after you see them repeatedly in triage reports.
- **Label names:** You can use different label names — just update the label IDs in `triage-config-template.md` to match.
- **Family addresses:** Used for safety checks. Emails from family are never auto-triaged.
