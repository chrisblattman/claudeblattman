# Cut through inbox noise

<span class="badge badge-intermediate">Intermediate</span>
<span class="badge badge-time">< 1 hour to set up</span>
<span class="badge badge-needs">Needs: Gmail MCP</span>

This page uses a synthetic family/school example to show the workflow pattern.
The same problem hits with employer announcements, nonprofit updates, or
professional associations, just on a longer cycle (weekly or monthly digests
instead).

Each source sends 2–4 long emails a day. Across two sources, that's 30–50 emails
per digest period — every few days.

We were missing deadlines. A course selection form due Monday that neither parent saw until Sunday night. A permission slip buried in paragraph four of a weekly newsletter. Not because we weren't checking email — because the volume made it impossible to catch everything.

I built a skill that compresses all of it into a 30-second read. Two things I learned apply well beyond email.

---

## Calibration

I assumed I could write classification rules upfront. Schools have predictable categories. I was wrong.

I pulled 20 recent emails and rated each: action required, calendar event, FYI, or skip. Claude rated the same 20. We agreed on about 12. The disagreements taught me more than the agreements. I'd marked a daily bulletin as "skip" — mostly boilerplate. But buried in it was an early dismissal notice. Claude caught it; I'd skimmed past it. Going the other direction, Claude flagged a college counseling webinar as "action required" because the word "deadline" appeared. It was a registration deadline for an 11th-grade event. My daughter Maya is in 9th grade. Skip.

**Schools treat everything as equally important. You don't.** A fundraiser gala and a permission form get the same formatting, the same "IMPORTANT" in the subject line. The only way to build rules that match *your* priorities is to calibrate against *your* reactions to real emails.

I pulled 30 more and repeated. By email 50 the rules had stabilized. Permission forms: always high. Direct staff emails from personal addresses (not noreply@): always high. Fundraiser appeals: always skip. Newsletters: extract dates only, skip the feature stories. Daily bulletins: scan for schedule changes and items mentioning the relevant people by name, skip everything else.

The resulting rules file was about 120 lines. I could not have written it before seeing those 50 emails.

## Source quoting

Once classifications were working, a subtler problem appeared. The digest reported Sam's science test as March 6. It was March 7. My co-parent caught it — which is exactly what the digest is supposed to make unnecessary.

The fix: instead of just extracting a deadline, I added a `deadline_quote` field to the extraction prompt:

```
Extract from this email. Return as JSON:
(1) category: action_required / calendar_event / fyi / skip
(2) urgency: high / medium / low
(3) summary: 1-2 sentences of what you need to know
(4) deadline: specific date/time if any, else null
(5) deadline_quote: verbatim text from email stating the
    date/deadline — copy exact wording, do not paraphrase.
    null if no deadline.
```

This forces the model to copy exact words from the source *at extraction time*, before downstream processing can corrupt them. The digest prints the quote alongside the summary:

```
▶ ACTION ITEMS
  • Science assessment for Sam — deadline: Fri March 7
    Source: "the assessment will be on Friday, March 7th"
```

If the summary date ever disagrees with the source quote, you see it immediately.

**Quote the source at extraction time, carry the quote through to output.** This works anywhere AI is summarizing and you need specific facts to survive — meeting transcripts, grant deadlines, legal filings.

## What the digest looks like

Two kids, two schools, compressed from ~4,000 words of source email:

```
SCHOOL EMAIL DIGEST
Feb 27 — Mar 1
Compressed ~4,200 words across 23 emails (18 threads).
──────────────────────────────

MAYA (Lincoln Prep)

▶ ACTION ITEMS
  • Spring course selection form due — deadline: Mon March 10
    Source: "Course selection forms must be submitted by March 10"
  • Permission form for downtown field trip (history class)

📅 UPCOMING
  • Parent-teacher conferences March 13–14 (sign-up link in email)
  • Spring musical auditions March 8

ℹ️ FYI
  • College counseling series starting for 9th graders in April
  • Weekly newsletter: spring break March 24–28


SAM (Riverside Academy)

▶ ACTION ITEMS
  • Science assessment — deadline: Fri March 7
    Source: "the assessment will be on Friday, March 7th"

📅 UPCOMING
  • 7th grade field day March 20
  • Ms. Garcia requesting meeting re: learning plan

ℹ️ FYI
  • Principal Chen's monthly update: construction on schedule
  • Daily bulletin: normal schedule all week

+ 9 lower-priority items not shown
──────────────────────────────
```

Twenty-three emails, 30 seconds to read. Source quotes on action items mean you can trust dates without opening the originals.

## Build your own

### 1. Label and filter your source

Create a Gmail label (`@School`, `@CompanyNews`, whatever) and a filter that auto-applies it to all email from your source domains. Remove from inbox if you want — the digest reads by label, not inbox status.

### 2. Run the calibration conversation

Paste this into Claude Code (or any Claude conversation with Gmail MCP access):

```markdown
I want to build classification rules for emails from [YOUR SOURCE].

Step 1: Search Gmail for `label:[YOUR_LABEL]` from the last 14 days.
Pull 20 emails. For each one, show me:
- Subject line
- Sender
- First 2 sentences of the body
- Your suggested classification: action_required / calendar_event / fyi / skip
- Your reasoning (1 sentence)

Then ask me to rate each one. We'll compare and discuss disagreements.

Step 2: After we align on the first 20, pull 30 more and classify
them using the rules we've developed. Show me the ones you're
least confident about.

Step 3: Write the final rules as a markdown config file with sections
for HIGH (action required), MEDIUM (calendar/informational),
LOW (FYI), and SKIP. Include sender pattern rules and keyword rules.
```

The conversation takes 20–40 minutes. You end up with a rules file tailored to your priorities.

### 3. Install the skill

Download the [announcement digest skill](https://github.com/chrisblattman/claudeblattman/blob/main/skills/announcement-digest/SKILL.md) and customize:

- Replace `[YOUR_LABEL]` with your Gmail label
- Point the config path to your calibrated rules file
- Set your recipient addresses
- Run in dry-run mode first (compose but don't send)

!!! tip "Dry-run mode"
    Run 3–4 times before enabling auto-send. Check that dates match source emails, skip decisions make sense, and urgency levels feel right. Adjust rules after each run.

## Lessons

- **Calibration is the product.** The skill is generic infrastructure. The rules file — built from your reactions to 50 real emails — is what makes it work.

- **Source quoting is a general defense.** Any time AI summarizes a document and you need specific facts to survive, extract the verbatim quote alongside the fact. Carry both through to output.

- **When in doubt, classify up.** A post that's just a link with no description might be a permission form. When the cost of missing something is high and the cost of flagging it is low, err high.

- **Your source ≠ you on priority.** Schools, employers, and nonprofits treat every announcement as equally important. Your triage rules encode the gap between their priorities and yours. That gap has to be measured, not inferred.
