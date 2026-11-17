---
description: Have your agent collect repeated emails into a digest, learn what matters to you, and keep deadlines tied to their sources.
---

# Create your own email digests { #cut-through-inbox-noise }

Some emails are easier to read together, either because the latest update replaces what you were told yesterday or because you get so many of them. School notices are a good example, especially with more than one child at more than one school. I want to know about the permission form and the change in pickup time without opening every newsletter.

A digest gives the agent that job. It reads a group of emails and brings you the things you need to act on, upcoming events, and anything else worth knowing. You can use the same approach for announcements from your employer or a professional association.

This builds on the [email cleanup workflow](email-cleanup.md). The idea is simple:

**Gmail filters or `/triage-inbox` file messages into a folder → the digest skill periodically reads the new mail in that folder → one digest arrives in your inbox.**

The skill checks messages it hasn't processed yet, whether they're read or unread. That way, opening an email yourself doesn't leave it out of the digest.

## 1. Choose the mail you want to read together

Start with one group of messages. If you already have a label for school notices or announcements, use it. Otherwise, have your agent help you create one using the [label and filter instructions](email-cleanup.md).

Keep personal requests and urgent messages visible. You may want the school newsletter in a digest, but a teacher asking to speak with you today deserves your attention sooner.

Your agent needs a connection that can search and read your Gmail. You can ask it to check that connection and find a sample:

```text
I'd like a digest of the emails under [Gmail label]. Check that you can read them, including messages outside my inbox.

Read a sample from the past two weeks. Show me what needs action, what belongs on my calendar, what's useful to know, and what you would leave out. Include links to the emails. Don't change the messages.
```

## 2. Teach it what matters to you { #calibration }

The school decides what to send. You decide what matters to your family. The agent needs to learn that distinction from you.

Go through the sample together. A newsletter may be mostly stories you can skip, with an early dismissal notice halfway down. An event marked “IMPORTANT” may be for a grade your child isn't in. Tell the agent why one belongs in the digest and the other doesn't.

```text
Let's work through your choices. Show me a few emails at a time and explain what you would include or skip. Ask me about the ones you're unsure of.

Use my corrections to write rules for future digests. Then try those rules on another group of emails and show me where they don't give you a clear answer.

Save the rules in my email-assistant folder at [location].
```

Give it the context it needs, such as which grades or programs matter to you. Review some of the emails it would skip, too. Otherwise you'll see the unnecessary items it included and miss the important ones it left out.

## 3. Keep dates tied to the original email { #source-quoting }

A wrong deadline can make a digest worse than no digest. Ask the agent to copy the sentence containing the date and put it beside the summary, with a link to the email.

```text
For each deadline or schedule change, include the exact wording from the email and a link to it. If two messages give different dates, flag the conflict. If you can't tell what a date refers to, ask me rather than guessing.
```

The quote makes a mistake easier to spot. It doesn't guarantee the agent chose the right date or noticed a later correction. Open the original when a deadline matters or something looks wrong.

## 4. Check the first digest { #what-the-digest-looks-like }

Here's a shortened, fictional school example. The names, schools, dates, and messages are invented. In your digest, each item should link back to its email.

```text
SCHOOL EMAIL DIGEST
March 1–3

MAYA — LINCOLN PREP

Action needed
• Submit the course selection form by March 10.
  Source: “Course selection forms must be submitted by March 10.”

Coming up
• Parent-teacher conferences: March 13–14. Sign-up is open.
  Sign up: [link from the email]

Worth knowing
• The college counseling series for ninth graders starts in April.

SAM — RIVERSIDE ACADEMY

Action needed
• Return the permission form for the history field trip.
  No deadline given in the email.

Coming up
• Early dismissal on March 7.
  Source: “Students will be dismissed at 12:30 p.m. on March 7.”

Left out: fundraising appeals and repeated event reminders.
```

Check whether you can tell what you need to do. If “permission form” isn't enough, ask for the form link and who needs to sign it. If an item doesn't matter to you, explain why and have the agent save that correction in the rules.

## 5. Save it as a skill and choose when to run it { #build-your-own }

Once you like the result, use the [announcement-digest skill](https://github.com/chrisblattman/claudeblattman/tree/main/skills/announcement-digest) as a starting point. It reads labeled mail, applies your saved rules, and keeps a record of the messages it has processed so later digests don't repeat them.

```text
Find and install the announcement-digest skill from the chrisblattman/claudeblattman GitHub repository.

Adapt it to the Gmail label and rules we've just worked out. Keep its rules and record of processed emails in [my email-assistant folder]. Use my existing Gmail connection.

Prepare a digest for me to review, and ask before sending it.
```

The skill processes all new emails since its last completed run, including any you've already opened yourself. Once the digest has been sent, it marks all the messages it processed as read, including those it left out of the summary. They stay in the same folder if you need to find them later. If you'd rather keep unread messages unread, ask your agent to preserve their read status and save that preference.

Choose a frequency that fits the mail. If you want it to run automatically, use the [scheduling instructions](manage-email.md#5-add-a-schedule-and-check-coverage).

A schedule doesn't change the skill's requirement to ask before sending, but depending on the digest, you might choose to give that permission in advance. For example, I schedule the school digest skill to run twice a week, and I give it explicit permission to email me and my partner without any other approval. Since the digest is low-stakes—it's only going to us—I consider it low risk. If the digest is wrong in some way, it's an easy low-cost fix. For other types of email digests going to a larger audience, you might want to review the result before it sends. In general, I let the agent send email digests that go straight back to me automatically. Anything else, I review before sending.

Keep correcting the rules as you use it. “Include schedule changes even when they're buried in a newsletter” is an instruction the agent can use next time. Have it save that instruction, then check the next digest to see whether it followed it.
