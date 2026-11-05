---
name: todo-queue
description: "Process emails in a configured task label into Apple Reminders, including timing details. Requires macOS and connected email."
---

# Todo Queue
*v1.1 — Adapted for public use*

Batch-process emails in a designated Gmail label, converting them to Apple Reminders with timing extracted from the email body.

## Usage

```
/todo-queue
```

## Overview

This skill processes emails sent to `your-email+todo@gmail.com` (or manually labeled @ToSelf). It:
1. Searches for unread @ToSelf emails
2. Parses timing syntax from the email body
3. Creates Apple Reminders automatically (no confirmation needed)
4. Marks emails as read and archives them

**Note:** Auto-processing is enabled. Use `dryrun` argument to preview without creating.

**Platform note:** This skill uses `osascript` for Apple Reminders, which is **macOS-only**. On other platforms, you would need to replace Step 3 with a different reminder/task API.

## Instructions

### Step 1: Search for Pending Todo Emails

Search Gmail: `label:@ToSelf is:unread`

**If no emails found:**
```
No pending todo emails in @ToSelf.

To add emails to the queue:
- Forward any email to: your-email+todo@gmail.com
- Add timing in the body: "due:Friday" or "due:tomorrow list:Personal"
```
Stop here.

### Step 2: Fetch and Parse Each Email

For each email found:

1. **Get email content** using `mcp__google_workspace__get_gmail_message_content`

2. **Extract task title:**
   - If forwarded email (subject starts with "Fwd:"): Use original subject, suggest "Review: [subject]" or "Reply to [sender] about [subject]"
   - If self-sent email: Use subject line directly
   - If subject contains "Re:": Suggest "Follow up on [topic]"

3. **Parse timing syntax from body** (case-insensitive, colon required):

| Syntax | Parsed As |
|--------|-----------|
| `due:tomorrow` | Tomorrow 9am |
| `due:Friday` | Next Friday 9am |
| `due:Feb 15` or `due:February 15` | Feb 15 9am |
| `due:next week` | Next Monday 9am |
| `due:3 days` or `due:in 3 days` | 3 days from now, 9am |
| `due:2 weeks` | 14 days from now, 9am |
| `time:2pm` or `time:14:00` | Overrides default 9am |
| `list:Personal` | Personal list (default: Work) |
| `list:Someday` | Someday list |
| `list:Work` | Work list (explicit) |
| `tag:#waiting` | Add #waiting tag |
| `tags:#project #budget` | Multiple tags (space-separated) |
| No timing found | No due date (task still created) |

**Parsing rules:**
- Keywords can appear anywhere in email body
- Multiple keywords on same line or different lines both work
- Case-insensitive (`DUE:Friday` = `due:friday`)
- Colon is required (`due:tomorrow` works, `due tomorrow` does not)
- For forwarded emails, parse the ADDED text (before "---------- Forwarded message"), not the forwarded content

**Day name parsing:**
- If today is Tuesday and body says `due:Friday`, that's Friday of THIS week (3 days away)
- If today is Saturday and body says `due:Friday`, that's Friday of NEXT week (6 days away)
- `due:Monday` when today is Monday means NEXT Monday (7 days away)

### Step 3: Create Reminders (Auto-Processing)

**Process each email automatically** — no confirmation needed.

For each task:

1. **Create Apple Reminder** using osascript:

```bash
osascript -e '
tell application "Reminders"
    set targetList to list "[List Name]"
    set newReminder to make new reminder at end of targetList with properties {name:"[Task Title]", body:"[Gmail Link]\n\n[Any tags]"}
    [If due date:] set due date of newReminder to date "[formatted date]"
end tell
'
```

**Date format for osascript:** "February 7, 2026 at 9:00:00 AM"

**Gmail link format:** `https://mail.google.com/mail/u/0/#inbox/[message_id]`

2. **Archive the email:**
   - Remove INBOX label (if present)
   - Keep @ToSelf label (for history/audit trail)
   - Mark as read

Use `mcp__google_workspace__modify_gmail_message_labels` with:
- `remove_labels: ["INBOX", "UNREAD"]`
- Do NOT remove @ToSelf

### Step 4: Report Results

```
COMPLETE

Created 3 reminders:
  1. Reply to [Name] about grant proposal → Work (due Fri Feb 7)
  2. Review proposal draft → Work (no due date)
  3. Book dentist appointment → Personal (due Mon Feb 10)

Processed emails archived (kept in @ToSelf for history)

To find these reminders:
- Mac: Reminders app → Work / Personal lists
- iPhone: Reminders app → Work / Personal lists
```

## Arguments

- `dryrun` — Show what would be created without actually creating
- `limit:N` — Only process first N emails (default: all)

## Examples

```
/todo-queue              # Process all pending
/todo-queue dryrun       # Preview only
/todo-queue limit:5      # Process first 5 only
```

## Usage Examples (Email Side)

**Example 1: Forward with timing**
```
Forward email from a colleague to: your-email+todo@gmail.com
Add to body before forwarded content:
"due:Friday

---------- Forwarded message ----------"
→ Creates: "Reply to [Name] about [subject]" due Friday 9am in Work list
```

**Example 2: Self-email quick capture**
```
Send to: your-email+todo@gmail.com
Subject: Book flights for March trip
Body: "due:next week list:Personal"
→ Creates: "Book flights for March trip" due Monday in Personal list
```

**Example 3: No timing**
```
Forward email to: your-email+todo@gmail.com
Body: (empty, just forward)
→ Creates: "Review: [subject]" with no due date in Work list
```

**Example 4: Multiple tags**
```
Send to: your-email+todo@gmail.com
Subject: Review project budget
Body: "due:Feb 15 tags:#project #budget"
→ Creates: "Review project budget" due Feb 15 in Work list with tags
```

## Error Handling

- **No @ToSelf label found**: "Error: @ToSelf label not found. Check Gmail labels — see Customization Points below."
- **Apple Reminders unavailable**: "Error: Could not create reminder. Emails NOT processed (still unread in @ToSelf)."
- **Partial failure**: If some reminders fail, report which succeeded/failed. Leave failed emails unread.
- **List doesn't exist**: Create in "Reminders" default list with note about missing list.

## Technical Notes

### Gmail Label ID

@ToSelf = YOUR_LABEL_ID (you need to look this up — see Customization Points)

### osascript Fallback

The Apple MCP's `listName` parameter is unreliable. This skill uses direct osascript for reminder creation, which is more reliable for specifying target lists.

### Archive vs Delete

Emails are archived (removed from INBOX) but kept in @ToSelf for audit trail. They remain searchable via `label:@ToSelf` if you need to find the original email.

---

## Customization Points

**To set up this skill for your workflow:**

### 1. Gmail alias setup
Gmail supports "plus addressing" out of the box. If your email is `you@gmail.com`, then `you+todo@gmail.com` already works — mail sent there arrives in your inbox. No configuration needed.

### 2. Create the @ToSelf label and filter
1. In Gmail, go to Settings → Filters and Blocked Addresses → Create a new filter
2. Set "To" field to: `your-email+todo@gmail.com`
3. Click "Create filter" and check: **Apply the label** → Create new label called `@ToSelf`
4. Optionally check: **Skip the Inbox** (if you only want to process via this skill)

### 3. Find your label ID
The Gmail API uses internal label IDs, not display names. To find yours:
- Use the Gmail MCP to search for a labeled message, or
- Use the Gmail API's `labels.list` endpoint
- Replace `YOUR_LABEL_ID` in the Technical Notes section with your actual ID

### 4. Reminder list names
The default lists are `Work`, `Personal`, and `Someday`. These must match actual list names in your Apple Reminders app. To use different names:
- Edit the `list:` entries in the timing syntax table (Step 2)
- Update the osascript list name in Step 3
- Make sure the lists exist in your Reminders app

### 5. MCP requirements
This skill requires:
- **Gmail MCP** (google_workspace or equivalent) with permissions to search, read, and modify labels
- **macOS** with Apple Reminders app (for osascript). On Linux/Windows, replace Step 3 with your preferred task manager API (Todoist, TickTick, etc.)

### 6. Default reminder time
The default due time is 9:00 AM. To change it, find all references to "9am" and "9:00:00 AM" in the instructions and update them.

### 7. Integration with other skills
If you have a morning briefing or weekly review skill, you can add a check for pending @ToSelf emails:
```
if (unread @ToSelf emails found):
    "You have N emails in your todo queue. Run /todo-queue? [Y/n]"
```
