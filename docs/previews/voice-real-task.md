---
title: Teaching AI your voice — Chris’s proposed version
description: Start with a real writing task, learn from a correction, and reuse the preference.
search:
  exclude: true
hide:
  - navigation
---

# Teaching AI Your Voice

<span class="badge-teal">Start with a real writing task</span>

A draft can be accurate and still sound wrong. It may explain too little, sound too formal for the reader, or bury the decision under polished paragraphs. A useful voice guide captures those choices, not just words you dislike.

Start with one task you do often. Explain what you mean, correct the draft, and decide what the AI should remember for similar work. Saving that preference supplies context for future drafts. It does not retrain the underlying model or guarantee that it will follow the instruction.

## 1. Choose a writing job and audience

Begin with something recognizable: an update to your team, for example. State who will read it, what they already know, and what they need to understand or do. Supply the facts and commitments the draft must preserve.

A relevant sample can help. Choose writing you can attribute to yourself, and label collaborators' or AI contributions. A sent email or successful proposal is not automatically a sample of your independent voice. An AI-assisted draft you liked can demonstrate an acceptable result for that task, if labeled honestly.

You can also begin without samples. “For routine team updates, thank people briefly, then make the questions and next steps easy to skim” is a preference you can try and revise.

## 2. Draft, then make a consequential correction

Tell the AI what the draft needs to accomplish:

```text
Draft [type of message] for [reader and relationship]. They already know [context]. They need to understand or decide [purpose]. Use these facts and preserve these uncertainties: [notes]. My relevant preferences are [preferences or a labeled sample]. Ask about consequential missing information rather than inventing it.
```

Read for meaning before judging resemblance. Check the reasoning, uncertainty, tone, amount of explanation and organization. Correct the part that matters. You can rewrite it yourself or explain the change aloud.

### A teaching example

This is a constructed illustration, not a comparison from a model experiment. Both versions use the same supplied facts: a colleague shared a revised draft, the main argument is clearer, and you would like to discuss the opening at the next meeting.

=== "More formal"

    > Thank you for sharing the revised draft. The main argument is now clearer. I would appreciate the opportunity to discuss the opening at our next meeting.

=== "More conversational"

    > Thanks for sending this. The main argument is clearer now. Could we talk about the opening at our next meeting?

Either could suit a writer and relationship. If the second fits yours, the useful preference might be “Use ordinary, conversational requests with close colleagues.” It is not “Always shorten every message” or “Always use this opening.”

## 3. Decide what should carry forward

A correction does not always call for a new rule. The AI may have missed a fact or ignored guidance you already supplied. You may also want a different approach for this particular reader.

Use one request to examine the change:

```text
Learn from my edits to this. Compare the draft and revision, or use my explicit feedback if there is no before-and-after pair. Separate facts and one-off choices from preferences for future writing.

Check whether my existing guidance already covers the problem. Show the narrowest useful lesson and where it would apply. Do not change persistent guidance until I agree to that change.
```

Review the proposed lesson. Narrow it, reject it, or agree to the exact change. If you dictated instructions and the AI rewrote the passage, the instructions are yours but the resulting wording is still AI-assisted. Preserve that distinction when selecting examples.

## 4. Save it where you can inspect it

Keep agreed preferences in an identifiable place. A small voice file or project-instructions section is enough to begin. Record the audience and writing job beside each preference. Keep project facts separate.

In [ChatGPT Projects](https://help.openai.com/en/articles/10169521-projects-in-chatgpt), project instructions apply inside that project. In Claude Code, you can import a project-local voice file from `CLAUDE.md` and inspect instructions and memories with `/memory`. See the [current memory documentation](https://code.claude.com/docs/en/memory). Other tools have different storage and scope: check the product's instructions and open the saved content yourself.

Ask the AI to show what it saved, where it saved it, and whether anything else changed. If your tool cannot save persistent instructions, keep the file yourself and supply it in the next relevant chat. You should be able to edit or remove a preference without reconstructing an old conversation.

## 5. Check it on a later task

In a fresh session, use the agreed guidance for a different task of the same kind. Inspect the draft: did it preserve your meaning, fit the reader, and need less correction? If it failed, first check whether the guidance was available and followed.

Keep a preference when it helps. Narrow or remove it when it causes problems. An email preference need not govern a proposal. Shortening prose should not erase reasoning, uncertainty or ordinary courtesy.

You do not need a weekly maintenance appointment or a large test suite to start. If a recurring problem becomes costly, compare alternatives on that problem. A command can make a repeated procedure convenient, but the command itself does not establish that the procedure works.

Use the [Voice Pack Template](voice-pack-template.txt) for an editable starting point. Keep only the sections that help with your writing.
