---
description: Set up email labels and filters, clear the backlog, and move unfinished work into reminders.
---

# Clean up your email backlog

One of the best things AI has done for me is [help me manage my email and keep track of what I owe people](manage-email.md). But to make that work well, I first had to clean out my existing backlog. That did two things: it cleared the inbox for the first time in years, and it helped me teach the agent the categories and rules I now use to handle new mail.

I started with about 5,000 unread emails. This was partly because I used unread email like a to-do list. If I owed someone a reply or needed to do something, I left the message unread until I got around to it. The backlog was a constant low-grade source of stress. Somewhere in there were things I still needed to do.

This page walks through choosing your buckets, creating filters, and applying those decisions to old mail. [Part 2](manage-email.md) covers the recurring routine: working through new messages, replying, and correcting the system as you use it.

## How the pieces work together

I use Gmail. The buckets are **labels**, which work like tags: a message can have more than one. Applying a label categorizes the message. Archiving it takes it out of the inbox, but you can still find it under its label or in search. [Google's label guide](https://support.google.com/mail/answer/118708?hl=en) explains how to create and manage them.

A **filter** is a rule Gmail follows when mail arrives. For example, messages from a particular newsletter can get the `@ToRead` label and skip the inbox. Creating the label alone doesn't create that rule. Several filters can send mail into the same bucket. [Google's filter guide](https://support.google.com/mail/answer/6579?hl=en) shows the settings.

The agent helps you choose these rules and handles messages that need more judgment. “Newsletters from this address go into reading” can be a filter. “This looks like an announcement, but contains a personal request I need to answer” calls for the agent to read the message.

My setup uses a Google Workspace MCP connection to read Gmail and Gmail API helpers to apply labels. With the right permissions, the mail connection gives the agent access to your account and control of Gmail's labels and filters.

## 1. Decide where unfinished work will go { #1-decide-what-belongs-where }

Before clearing messages, choose where you'll keep the tasks they contain. If you already use a reminder app or a task list, use that.

I wasn't using Google Tasks or Apple Reminders at all, which in retrospect was a mistake. After researching and testing both, I chose Apple Reminders for the flexibility and Siri integration. The key insight: emails that create to-do items should become reminders, not stay unread.

Choose something with little friction. Markdown checklists can work well if your agent manages the list entirely, but they're less convenient for checking your to-dos on the fly.

Treat replies and other work differently. Keep an email that needs a reply in the inbox until you've answered it. If it asks you to do something elsewhere, such as read a draft or submit a form, create a reminder with a link to the email. Once the reminder is saved, you can file the message. If it needs both a reply and a task, create the reminder and keep the email visible until you've replied.

Open a session with your agent and ask:

```text
I want to clean up the email backlog in [account]. I've been using unread messages to remember things I need to do. I want to keep tasks in [my reminder app or task list], with links back to the emails.

First, check that you can add tasks to [app] with the proper due dates. If that doesn't work, help me get it set up.
```

## 2. Have it scan your email and suggest buckets { #2-learn-from-a-sample }

Have the agent inspect a sample before proposing a system. Include recent and older mail, and both read and unread messages. You want categories that reflect what's actually arriving.

```text
Look through a sample of my email across different senders and dates, including read and unread messages. Show me the main categories you find and a few examples of each. Suggest a small set of labels or folders and explain what you would keep in the inbox.

Ask me about important people and messages I don't want to miss. Walk me through the choices one at a time. Leave the messages unchanged while we work this out.
```

Start with broad categories. Fewer buckets means fewer distinctions for the agent to get wrong. In my case, I separate things I need to respond to, emails I need to see and be aware of, newsletters, and announcements. I also have categories for emails I don't need to see but will want my agent to retrieve later, like receipts.

Here are the main groups in my setup:

<div class="email-category-table" markdown>

| Kind of mail | Where it belongs |
|---|---|
| Needs a reply or my judgment | Inbox, until handled |
| Something I need to see or know | Inbox for my check-in; marked read when summarized, filed when requested |
| Newsletters and longer reading | `@ToRead` |
| Institutional announcements | `@Announcements` |
| School notices | `@School` |
| Family correspondence | `@Family`, with important messages kept visible |
| Receipts and expenses | `Expenses/`, with sublabels for pending, personal, and uncertain expenses |
| Routine automated mail I don't need to see | `Auto-Archive` |

</div>

I also use `@ToDo` and `@ToSelf` for messages I flag myself. You don't need all of these labels. Start with the distinctions that matter to you.

React to the examples in ordinary language: “Keep messages from this person in my inbox.” “Put these newsletters together so I can read them later.” “Receipts can be filed, but I need to see a failed payment.”

## 3. Create the rules and clear old mail in batches { #3-process-the-backlog-in-batches }

Start with the categories you can agree on quickly. You don't need to make a separate decision about every old newsletter. Review the proposed rule and some examples:

```text
Let's start with [category] over the past [x months]. Show me how many messages you found, a few examples, and any exceptions that might need my attention. Show me the exact filter rule you'd use for future messages in this category, or explain if it needs the agent's judgment instead.
```

Give the agent your corrections and exceptions. Once you're happy with the rule, ask it to set it up and apply it to the old messages:

```text
Create the label and filter we've agreed on, including my exceptions, for future incoming mail. If this needs your judgment rather than a Gmail filter, save it as an instruction in my email policy instead.

Apply the agreed policy to this category over the past [x months] using our mail connection. Keep read and unread status unchanged. Keep a record of what you changed so we can undo a mistake. Don't delete messages or send replies.
```

The saved filter handles future mail. Applying the rule to the selected old messages clears that part of the backlog. Make sure the agent tells you which of those it completed, especially if you had to create the filter yourself.

Repeat for each of the suggested categories you're happy with.

## 4. Find unfinished work and move it to reminders { #4-recover-the-work-hidden-in-the-remaining-mail }

This is going to take time. It took me about 36 hours to clear my backlog of 5,000 messages. Hopefully most of yours will be easy to archive, especially the old ones. The unresolved requests take more attention. Have the agent read the rest of each conversation before deciding you still owe someone something. You may have answered in a later reply.

```text
I want to get to inbox zero, so let's go through all the remaining email in my inbox, both read and unread, regardless of date. Read the full conversations so you can tell whether a request was already handled.

Show me what can be archived, what needs a reply, what needs another action, and what we're waiting for someone else to do. For each item, give me a link to the email and your suggested next step. Work through them with me until we've dealt with every remaining message.
```

You can answer: “That's done.” “I still need to read the draft. Add a task for Thursday.” “Draft a reply saying I can meet next week.” Or tell the agent you no longer intend to do something. An old request isn't automatically a current commitment.

Once you've decided what to do, ask:

```text
Save the tasks we've agreed on in [app], with the agreed due dates and links to the original emails. Check that they've appeared there before filing those messages. Keep their read status unchanged.

Leave messages that still need a reply or a decision in my inbox. Save any replies we've drafted without sending them.
```

## 5. Check the cleanup and save what you've taught it { #4-check-the-result-and-save-the-rules }

Look through a sample of the mail the agent filed. Check the task list as well. The important question is whether you can find the work you still need to do.

My current email skills keep their instructions and records in an `exec-assistant/` project folder in Dropbox. Here's the relevant structure. You can put your own folder wherever you keep your AI projects:

```text
exec-assistant/
├── policies/
│   └── email-policy.md       Handling rules, important people, and exceptions
├── config/
│   └── triage-config.md      Label IDs and classification settings
└── state/
    └── triage-run-state.json  Record of mail already processed
```

The filters themselves live in Gmail. The policy tells the agent how to handle mail, and the configuration gives it the details it needs to do that. The state file is maintained by the recurring workflow. You shouldn't need to edit label IDs or processing records yourself.

Ask your agent to adapt this structure to your own setup:

```text
Show me what we've finished, which dates or messages we haven't covered, and what still needs my decision. Give me a sample of the messages you filed so I can check them.

Save our agreed rules in my existing email-assistant folder, or help me create one if I don't have one. Use policies/email-policy.md for handling rules and config/triage-config.md for the labels and settings, unless my installed skills already use different locations. Make sure future sessions and my email skills know where to find them.

Use this email-policy template as a starting point, replacing its defaults with our decisions:
https://github.com/chrisblattman/claudeblattman/blob/main/skills/triage-inbox/assets/email-policy.md

Include our important senders, filters and exceptions, the instruction to preserve read status, and where tasks belong. Tell me where you've saved everything.
```

<span id="5-move-into-a-recurring-routine"></span>

Once you've worked through the backlog, use [Recurring email workflows](manage-email.md) to handle new mail with the labels, filters, and instructions you've just built. That page introduces `/triage-inbox` and a regular `/checkin` for decisions and replies. These workflows make up my “AI executive assistant” and help me manage my day.
