---
description: Let Gmail filters and AI triage sort new mail, then add an optional check-in for replies and decisions.
---

# Recurring email workflows & a daily check-in { #recurring-email-workflows }

I want to spend less time sorting email and more time dealing with the messages that need me. Gmail filters handle the predictable mail. My agent reads what's left and files it using the rules I've taught it. Both put messages into the same buckets, so I can read newsletters, announcements, and receipts together when I need them.

You can stop there and keep answering email in Gmail. I also use `/checkin` to bring the remaining messages into a conversation with my agent: what I need to know, what needs a reply, and what I need to do.

Before you begin, it will help immensely to spend a few days [cleaning up your email backlog and setting filtering rules](email-cleanup.md). That's where you teach the agent what matters to you and decide where unfinished work belongs. This page puts those decisions to work on new mail.

## 1. Let Gmail and your agent do the sorting { #1-separate-filters-triage-and-your-check-in }

<span id="2-try-a-focused-review"></span>

**Gmail filters already run without an agent.** If I have a filter that sends a newsletter to `@ToRead` and skips the inbox, Gmail does that when the message arrives. My computer can be off. I don't need `/triage-inbox` to run that filter again.

But I don't have a Gmail filter for everything. A newsletter might arrive from a new address. The same company might send both a receipt I can file and a failed-payment notice I need to act on. A university email might be a general announcement or a colleague asking me to read a draft. I want the agent to read what's left in the inbox and make those distinctions using the instructions I've given it.

<div class="council-loop council-overview">
<div class="council-horizontal" tabindex="0" role="region" aria-label="Gmail filters and inbox triage; scroll horizontally on small screens">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 240" role="img" aria-labelledby="email-triage-title email-triage-desc">
<title id="email-triage-title">How Gmail filters and inbox triage work together</title>
<desc id="email-triage-desc">Gmail filters run when mail arrives and file matching messages under Gmail labels. Triage reads the mail left in the inbox against your email policy and uses agent discretion to decide. It files routine mail under those same labels and keeps other messages in the inbox for you to review, in Gmail or with an optional check-in.</desc>
<defs><marker id="email-triage-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M1 1 L6 3.5 L1 6" fill="none" class="council-arrowhead" stroke-width="1.1"/></marker></defs>
<path class="council-edge" d="M142 110 H220 V50 H698" marker-end="url(#email-triage-arrow)"/>
<path class="council-edge" d="M142 135 H310" marker-end="url(#email-triage-arrow)"/>
<path class="council-edge" d="M562 135 H620 V65 H698" marker-end="url(#email-triage-arrow)"/>
<path class="council-edge" d="M562 188 H698" marker-end="url(#email-triage-arrow)"/>
<text class="council-note" x="437" y="38">Matching filing rule</text>
<text class="council-note" x="226" y="125">Mail left in inbox</text>
<text class="council-note" x="669" y="98">Routine mail</text>
<text class="council-note" x="631" y="178">Keep visible</text>
<rect class="council-session" x="12" y="95" width="130" height="60" rx="2"/>
<text x="77" y="120">Gmail filters</text>
<text class="council-note" x="77" y="139">On arrival</text>
<rect class="council-command" x="312" y="110" width="250" height="110" rx="2"/>
<text class="council-command-label" x="437" y="132">/triage-inbox</text>
<text x="437" y="156">Reads against your email policy</text>
<text x="437" y="175">and uses agent discretion</text>
<text x="437" y="194">to decide</text>
<rect class="council-session" x="700" y="20" width="148" height="60" rx="2"/>
<text x="774" y="45">Filed under</text>
<text x="774" y="64">Gmail labels</text>
<rect class="council-session" x="700" y="155" width="148" height="60" rx="2"/>
<text x="774" y="180">Inbox</text>
<text x="774" y="199">Ready for your review</text>
</svg>
</div>
</div>

Both routes can put mail under the **same labels**. A newsletter filed by Gmail and one filed by the agent can both end up in `@ToRead`. The difference is who decides to put it there.

### What the skill actually does

On each run, `/triage-inbox` reads the saved policy and checks recent inbox mail, both read and unread. It reads the contents before deciding what to file. Important people, requests, substantive project updates, payment or security problems, and messages I've asked it to hold take priority over a routine filing rule. If it isn't sure, it leaves the message in the inbox for me.

Here are examples of what that means:

| What arrives | What Gmail has already done | What triage adds |
|---|---|---|
| A regular newsletter covered by a skip-inbox filter | Labeled and filed it. | Nothing: it's already outside the ordinary inbox review. |
| A reading subscription arrives from a new address that no filter matches | Left it in the inbox. | Reads it and files it under `@ToRead` if my saved policy covers it. Otherwise, leaves it for review. |
| A receipt or a failed-payment notice from the same vendor | Left it in the inbox because I haven't made a broad sender filter. | Files the ordinary receipt under my expense rules; keeps the failed payment visible. |
| A collaborator sends results, with no question and me only CC'd | Left it in the inbox. | Keeps it visible. No explicit request doesn't mean there's nothing I need to know. |

It also checks recent inbox messages that already carry a label I've designated for filing. For example, a filter might have added `@ToRead` without removing the message from the inbox. If my policy says those messages should be filed, triage can finish that step after checking the contents and exceptions. A label by itself isn't enough reason to archive a message.

## 2. Install `/triage-inbox` and connect your rules { #3-use-the-skills-for-repeatable-work }

The [`/triage-inbox`](https://github.com/chrisblattman/claudeblattman/tree/main/skills/triage-inbox) skill includes its setup templates and supporting files. It is separate from the starter kit. Ask your agent:

```text
Find and install the triage-inbox skill from the chrisblattman/claudeblattman GitHub repository. Install the entire folder, including its assets, references, scripts, and SKILL.md, where I keep my other skills. If I already have it, inspect that copy first and preserve my customizations.

Connect it to the email policy and label settings we saved during cleanup in [my email-assistant folder]. Use our existing mail connection. Keep our labels, exceptions, and read-status choices rather than replacing them with the examples in the skill.
```

You shouldn't need to recreate the labels or filters. The agent should use the policy and settings you saved on the [cleanup page](email-cleanup.md#4-check-the-result-and-save-the-rules). Have it resolve any missing connection before you run the workflow.

## 3. Try it and correct the mistakes { #try-one-run-before-scheduling-it }

```text
/triage-inbox
```

Look at its report and open a few of the messages it filed. If something went to the wrong place, correct it and have the agent save the exception. To understand a decision, ask:

```text
For the messages you just filed, show me the label you used and which instruction in my email policy supported the decision. Also show me what you left in the inbox because it needed my attention or you weren't sure.
```

Triage normally looks back from its last successful run, with some overlap to catch missed arrivals. It saves that progress in `state/triage-run-state.json` inside your email project folder, unless you chose another location during setup. It doesn't clear years of old mail. If you've been away, tell the agent which dates you want covered and have it report any gaps.

<span id="4-teach-it-from-corrections"></span>

The first version will get things wrong. When it does, explain the distinction you want it to learn:

```text
This sender's general announcements can be filed, but a personal request to me needs to stay in the inbox. Move this message back and save that distinction in my email policy for future runs.
```

Some corrections belong in the agent's policy. Others can become Gmail filters, using the process on the [cleanup page](email-cleanup.md#3-process-the-backlog-in-batches). Review the proposed rule and its exceptions before creating it. You don't need a new filter for every unusual email.

## 4. Put the sorting on a schedule { #5-add-a-schedule-and-check-coverage }

Once you're happy with the sorting, put it on a schedule. Mine runs automatically at 6 a.m. You can have triage run on your computer or in the cloud. The practical difference is whether your computer needs to be on at 6 a.m.

| Where it runs | What works well | The catch |
|---|---|---|
| **On your computer** | It can use the skills and email project folder you've already set up. | Your computer needs to be awake, online, and running the app when the task starts. |
| **In the cloud** | It can sort your mail while your computer is off. | You need to give the cloud task access to your mail and files, and check that the whole skill works there. |

A schedule tied to a local project still needs that computer. A cloud schedule uses the files and connections available to the cloud session. The [OpenAI scheduling guide](https://learn.chatgpt.com/docs/automations?surface=app) and [Claude scheduling guide](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork) explain the options in each app.

### Using your Dropbox folders for a cloud run { #keeping-a-cloud-run-up-to-date }

**Dropbox can give the cloud agent access to your current skills and email policy.** You need to connect Dropbox to the agent, then tell the scheduled task to read those files each time it runs. Simply putting a folder in Dropbox on your computer doesn't make that connection.

The attraction is that you can keep working in the same folder. Change an email rule, let Dropbox finish syncing, and the next run can fetch the revised file. You shouldn't need to upload it again. If you instead attach a copy of the folder to a chat, you'll need to replace that copy when you make changes.

For example, here's how to prepare this in Claude:

1. **Connect Dropbox.** In Claude's desktop app, open **Customize → Connectors → Add → Browse connectors**, choose Dropbox, and sign in. [Dropbox's setup guide](https://help.dropbox.com/integrations/connect-dropbox-to-claude) also has the web instructions.
2. **Point Claude to your folders.** Give it the Dropbox location of the entire `/triage-inbox` skill folder and your email project folder. Include the supporting files inside the skill folder, not just `SKILL.md`. Ask it to open your current email policy through the Dropbox connection.
3. **Check the mail connection and the skill.** The cloud task needs to be able to read and file Gmail messages. It also needs to run the skill's small programs and save a record of the mail it has handled, so the next run can pick up from there. Dropbox access alone doesn't establish that. Ask the agent to check this in the cloud session before you schedule it.

You can ask:

```text
I want /triage-inbox to run in the cloud while my computer is off. My skill folder is in Dropbox at [folder], and my email project folder is at [folder].

Use the Dropbox connection to read the current skill and email policy at the start of every run. Check that you can access the whole skill folder, run its supporting programs, and use my Gmail connection to read and file messages.

Set up a place to save which messages you've handled so each run can continue from the last one. Make sure this also works with any triage I run myself, including through /checkin if I use it. Tell me if anything still needs my computer to be on.

Test the setup without changing any email. If something needs adapting for cloud use, explain what and help me fix it before we schedule the task.
```

The skill currently saves its progress in files on a computer. Ask the agent to adapt that part if your cloud app needs a different way to keep track of what it's done.

### Set the schedule

Once the setup works, ask:

```text
Set up /triage-inbox to run every day at 6 a.m. in [my timezone] for [email account], using the setup we just tested.

Read the current skill and email policy from [folder locations] each time. You can label and file mail under the rules we've agreed on. Don't send replies.

Keep routine runs quiet. Tell me if a run fails or can't read the mail it needs. Show me where I can find and change the schedule.
```

Check the first run. If you chose the cloud, make sure it worked with your computer off and read the latest policy. I leave `/checkin` for when I'm at the computer and ready to answer questions.

## 5. Optional: work through your email with `/checkin` { #4-sit-down-for-your-check-in }

You can keep reading and answering the remaining mail in Gmail. If you'd like your agent to summarize it and help you work through replies and decisions, add [`/checkin`](https://github.com/chrisblattman/claudeblattman/tree/main/skills/checkin).

When I sit down at my computer at 8 a.m., I run `/checkin`. I may run it three to five times a day. Each time, it automatically invokes `/triage-inbox` to catch mail that arrived since the last run. Scheduling triage at 6 a.m. just helps me start the day a little quicker on that first check-in.

Install it and choose your preferences:

```text
Find and install the checkin skill from the chrisblattman/claudeblattman GitHub repository. Install the entire folder, including its assets, references, scripts, and SKILL.md, where I keep my other skills. If I already have it, inspect that copy first and preserve my customizations.

Use the same email policy, label settings, and mail connection as /triage-inbox in [my email-assistant folder], along with my task app. Keep our existing choices.

Walk me through the check-in preferences, including marking FYIs read, important personal labels, quarantine digests, newsletter reading holds, and whether you will send approved replies or just prepare drafts. Save our choices so I don't have to repeat them.
```

The skill starts with email. Calendar review and meeting preparation are options you can ask for separately.

### Work through the messages

Once setup is done, ask:

```text
/checkin
```

My check-in gives me two groups:

- **FYIs: things I need to know.** The agent reads the message and its context, marks it read, and tells me the substance. If someone confirms that a document arrived, I usually just need to know that. This is for messages that need no action from me. An attachment I still need to read belongs in the next group.
- **Things that need my attention.** Show me what the person wants, link to the message, and suggest the next step. That might be a reply, a decision, or work I need to do elsewhere.

The agent explains this FYI behavior during setup and saves your preference. If you want those messages left unread, tell it. **Showing me an FYI doesn't archive it.** It stays in the inbox unless I ask to file it or have a separate rule for that. Once I've read the summaries, I can say:

```text
Archive the FYIs you just showed me.
```

Work through a manageable batch at a time. You can respond in ordinary language:

```text
For the first email, draft a reply saying Tuesday works for me. Show me the draft before sending it.

For the second, I need to read the attachment before replying. Add a reminder for Thursday with a link to the email.

Leave the third for now. I haven't decided yet.
```

The distinction from cleanup still matters: a message needing a reply stays visible until you've handled it. Work outside email goes into the task app you chose, with a link back to the message. Creating a reminder doesn't automatically archive the email. If the reminder is now where you'll track the work, ask for both:

```text
Add this task to [my task app], with the agreed due date and a link to the email. Check that the reminder was saved correctly, then archive the email.
```

Have the agent check the thread before telling you something is overdue. You may already have replied, or the person may have withdrawn the request.

If its drafts don't sound like you, give it a few emails you've written and explain what you'd change. The [email voice template](https://github.com/chrisblattman/claudeblattman/blob/main/templates/email-voice-template.md) gives you a place to save those preferences.

Ask for the next batch when you're ready. The agent saves your decisions and unfinished drafts as you go. If you stop halfway through, use `/checkin resume` to pick up where you left off.

### Adjust the extra checks

My setup also checks important personal mail and quarantine digests, and gives some newsletters time to sit unread. During setup, the agent will ask which labels, digests, and subscriptions you use. You can keep these checks, adapt them, or turn them off:

??? note "Don't need a separate family review?"

    This check looks through the family or other important personal labels you choose, including older unread mail that might have been filed out of the inbox. If you don't need a separate pass:

    ```text
    Turn off the separate family-label review in /checkin from now on and save that preference. Keep reviewing family messages that appear in my ordinary inbox.
    ```

??? note "Don't need quarantine review?"

    Some employers and universities block suspicious mail before it reaches your inbox, then send a digest of what they held. This check reads your provider's digest and flags messages you may want to recover. It doesn't release messages or change your spam protection. If you don't receive these digests:

    ```text
    Turn off quarantine review in /checkin from now on and save that preference.
    ```

??? note "Change the newsletter reading window"

    A reading hold gives me time to read a newsletter myself. My filters and triage file reading subscriptions under `@ToRead`, out of the inbox, while leaving them unread. For selected newsletters, I protect that unread status for 48 hours after each edition arrives.

    The current hold is a minimum reading window, not a timer that clears the message at hour 48. After the window ends, the agent can mark an edition read if it reviews it and finds nothing I still need to do or read. A filed newsletter isn't automatically pulled back into check-in just because the hold expired.

    You can choose your subscriptions and change the period:

    ```text
    Give [newsletter names] a 72-hour reading hold instead of 48 hours. Keep filing them under my reading label, but leave each edition unread during that window. Save this preference for /triage-inbox and /checkin.
    ```

    Or turn off the special hold:

    ```text
    Turn off newsletter-specific reading windows in /checkin and /triage-inbox from now on and save that preference. Keep any messages I've explicitly asked you to leave unread.
    ```

You can turn any of these back on by asking the agent and telling it to save the change.

<span id="6-add-adjacent-workflows-when-useful"></span>

## 6. Add a digest for mail you read together { #7-set-up-second-stage-email-digests }

Once your mail is being filed into useful groups, consider building a digest for messages you'd rather read together. You can do this whether or not you use `/checkin`. The labels and filters you created during [email cleanup](email-cleanup.md#3-process-the-backlog-in-batches) give these skills a specific set of messages to read together.

My school-email digest runs twice a week. Gmail rules file school mail under `@School`, out of the inbox. The digest reads the messages collected there since the previous digest, extracts deadlines, schedule changes, and things we need to do, and emails me a summary. Once the digest sends successfully, the skill marks the processed messages read and keeps their `@School` label. I can read one digest instead of opening each school email separately. [The school-digest walkthrough](school-digest.md) shows how to build and calibrate your own, using a synthetic family example.

You could also build [meeting preparation and follow-up](meeting-workflow.md) around correspondence with your team: collect the decisions and open questions before a meeting, then use the discussion afterward to update the tasks and follow-ups. The useful starting point is a group of emails you keep reviewing for the same purpose.
