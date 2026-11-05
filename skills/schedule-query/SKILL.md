---
name: schedule-query
description: "Check availability across configured calendars and draft scheduling replies with specific time proposals."
---

# Schedule Query

*v1.1 — Check calendar availability and draft scheduling replies with specific time proposals*

Check calendar availability across your configured Google calendars and draft a scheduling reply with specific time proposals. Can be used standalone or invoked from a morning workflow when a scheduling email is detected.

## Prerequisites

- **Google Calendar MCP** — `google_workspace_mcp` with calendar and Gmail tools enabled
- **Calendar policy config** — `~/.claude-assistant/config/calendar-policy.md` (calendar IDs, scheduling preferences, deep work protection). Download the template from the [GitHub repo](https://github.com/chrisblattman/claudeblattman/tree/main/templates) (see First-Time Setup).
- **Email voice config** (optional) — `~/.claude-assistant/config/email-voice.md` for tone/voice templates
- **Goals file** (optional) — `~/.claude-assistant/config/goals.yaml` for deep work block protection

## First-Time Setup

1. **Create config directory:**
   ```bash
   mkdir -p ~/.claude-assistant/config
   ```

2. **Create `calendar-policy.md`** from the template. At minimum, fill in:
   - **Calendar IDs** — list every Google Calendar you want checked for conflicts. Find these in Google Calendar Settings > [Calendar name] > "Integrate calendar" > Calendar ID.
   - **Scheduling preferences** — working hours, buffer times, deep work blocks
   - **Your timezone** — e.g., `America/New_York`, `America/Chicago`, `Europe/London`

3. **Test:**
   ```
   /schedule-query range:3
   ```
   This queries the next 3 days to verify calendar access works.

## Arguments

`$ARGUMENTS` can include:
- `with:[name]` — who to meet with (searches Gmail for their email)
- `duration:[minutes]` — meeting length (default: 30)
- `range:[days]` — how far ahead to look (default: 14)
- `email:[id]` — reply to a specific email thread with availability
- *(freeform text)* — "schedule a meeting with [Name] next week about the paper"

## Instructions

### Step 1: Read Config

Read these files:
- `~/.claude-assistant/config/calendar-policy.md` — calendar IDs, scheduling preferences, deep work protection
- `~/.claude-assistant/config/goals.yaml` — for deep work block protection (if exists)
- `~/.claude-assistant/config/email-voice.md` — email voice rules (if exists)

Extract:
- All Google Calendar IDs to query
- Scheduling preferences (buffer times, deep work blocks, meeting-free periods)
- Your timezone (for formatting proposed times)
- Push level for deep work protection (if defined)

### Step 2: Parse Request

From `$ARGUMENTS` or freeform text, extract:
- **Who:** Name and/or email of person to meet
- **Duration:** Meeting length (default 30 min)
- **Timeframe:** When to look (default: next 2 weeks)
- **Context:** What the meeting is about (if mentioned)
- **Constraints:** Any specific preferences ("mornings only", "not Friday", etc.)

If `email:[id]` provided, fetch the email to extract the scheduling request details:
```
mcp__google_workspace__get_gmail_message_content
  user_google_email: your-email@gmail.com
  message_id: [id]
```

If only a name is provided (no email), search Gmail:
```
mcp__google_workspace__search_gmail_messages
  user_google_email: your-email@gmail.com
  query: "from:[name] OR to:[name]"
```
Extract their email address from the results.

### Step 3: Check Availability

Query ALL configured Google calendars for the specified timeframe:

```
mcp__google_workspace__get_events
  user_google_email: your-email@gmail.com
  calendar_id: [each calendar ID from config]
  time_min: [today]T00:00:00[YOUR_TIMEZONE]
  time_max: [today + range days]T23:59:59[YOUR_TIMEZONE]
```

If a calendar returns a 404 or error, skip it silently and continue with the others.

### Step 4: Find Available Slots

Merge events from all calendars into one timeline. Then find available slots:

**Rules:**
1. Working hours: Use hours from `calendar-policy.md` (e.g., 9:00 AM - 5:30 PM [TZ], Monday-Friday)
2. Minimum buffer: 15 minutes between meetings (or as configured)
3. Protect deep work blocks: Avoid proposing times during configured deep work periods unless specifically requested
4. Prefer meeting-free periods: Avoid proposing slots during configured meeting-free blocks unless necessary
5. No back-to-back: Do not propose a slot that creates 3+ consecutive meetings
6. If `push_level = moderate` or `assertive`: Protect the largest free block each day for deep work

**Scoring slots** (prefer in this order):
1. Mid-morning (10am-12pm) or mid-afternoon (2pm-4pm)
2. Not adjacent to existing long meetings
3. Days with fewer existing meetings
4. Closer dates (sooner is better for responsiveness)

Select 3-5 best slots.

### Step 5: Draft Response

Determine email tier for the recipient (check VIP lists in your email policy if configured).

Draft a reply proposing the available times:

**Standard (most common):**
```
Hi [Name],

I'm free at these times:
- [Day], [Month] [Date] at [time] [TZ]
- [Day], [Month] [Date] at [time] [TZ]
- [Day], [Month] [Date] at [time] [TZ]

Let me know what works and I'll send a calendar invite.

[Your name]
```

**Formal:**
```
Hi [Name],

I'd be happy to meet. I have availability at the following times:
- [Day], [Month] [Date] at [time] [TZ]
- [Day], [Month] [Date] at [time] [TZ]
- [Day], [Month] [Date] at [time] [TZ]

Please let me know which works best for you.

Best,
[Your name]
```

If voice examples exist in your email voice config, match those patterns instead.

### Step 6: Present for Approval

Show the draft:

```
--------------------
SCHEDULING REPLY
--------------------

To: [name] ([email])
Re: [subject or context]

[Draft text]

Available slots verified against all configured calendars.

-> Send / Edit / Skip
```

**Email delivery options:**
- If you have a send script configured (e.g., `~/.claude-assistant/scripts/send-email.py`), use that to send directly
- Otherwise, use `mcp__google_workspace__draft_gmail_message` to create a Gmail draft you can review and send manually
- If replying to a thread, include `--thread-id` and `--in-reply-to` parameters to maintain the thread

### Step 7: Log Performance

```bash
echo "$(date +%Y-%m-%d),schedule-query,TOOL_CALLS,NOTES" >> ~/.claude-assistant/logs/skill-performance.csv
```

## Error Handling

- **Calendar unavailable:** STOP. Never propose times without checking. Say "Calendar unavailable -- I cannot verify availability. Let me try again."
- **Cannot find recipient email:** Ask for the email address
- **No available slots in range:** Expand range by 1 week and try again. If still none: "No availability in the next [N] weeks. Want me to check further out?"
- **Calendar returns 404:** Skip silently and continue with other calendars

## Examples

```
/schedule-query with:Jane duration:60          # Find 60-min slots, look up Jane's email
/schedule-query range:7                         # Show availability for next 7 days
/schedule-query email:18abc123def               # Reply to a scheduling email thread
/schedule-query "meet with Jane next week about the paper"  # Freeform request
```

## Integration

- **Morning workflow:** Can be invoked when a scheduling email is detected during email review
- **Standalone:** Run `/schedule-query with:[Name] duration:60` directly
- **Never propose times without checking.** This is a hard rule -- always verify calendar availability first.

## Customization Points

- **Calendar IDs** -- Add all your Google Calendar IDs to `~/.claude-assistant/config/calendar-policy.md`. Include personal, work, shared, and any other calendars you want checked for conflicts.
- **Working hours** -- Set your working hours and timezone in `calendar-policy.md`. The skill only proposes slots within these windows.
- **Deep work blocks** -- Define time blocks to protect (e.g., 8-10am for focus work). The skill avoids proposing meetings during these unless no other options exist.
- **Meeting-free periods** -- Define recurring meeting-free blocks (e.g., Friday afternoon). The skill avoids these.
- **Buffer time** -- Change the default 15-minute buffer between meetings in the config.
- **Timezone** -- Set your timezone in `calendar-policy.md`. All proposed times will use this timezone.
- **Email voice** -- Create `~/.claude-assistant/config/email-voice.md` with tone templates for different formality levels. The skill matches the appropriate tone to each recipient.
- **Email delivery** -- Configure either a send script or use MCP Gmail drafts. If you have a custom send script, put it at `~/.claude-assistant/scripts/send-email.py` and the skill will use it. Otherwise, the skill creates Gmail drafts. Note: the Gmail MCP can only create drafts, not send directly -- if you want auto-send, you need a custom script.
- **Gmail email address** -- Replace `your-email@gmail.com` in all MCP calls with your actual Gmail address.
- **Slot scoring preferences** -- Adjust the slot scoring rules in Step 4 to match your scheduling style (e.g., if you prefer afternoon meetings over morning).
- **Number of proposed slots** -- Change the "3-5 best slots" default if you prefer proposing more or fewer options.
