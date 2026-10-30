---
description: Get useful work from a chatbot through better context, conversation, reusable instructions, and careful review. No agent required.
---

# Chatbots done right

A chatbot is useful for more than looking up an answer. Give it a draft to improve, a set of options to compare, or a problem to help you work through. The value often comes in the conversation after the first answer.

This guide works in an ordinary browser chat. If your workplace restricts agents, start with the chatbot it allows. For personal projects and the bigger picture, see [Get ahead of the curve](../starter-kit/agents-at-work.md).

<span id="pick-the-right-model"></span>

## Choose a model that fits the job

Look at the model or reasoning options available in your approved tool. A quick rewrite may not need the same model as a difficult analysis. For work that needs careful comparison, synthesis, or judgment, try a more capable reasoning option and compare the results on your actual task.

More capable models may take longer or use more of your allowance. Model names, defaults, and access change; you don't need to memorize a ranking or buy the most expensive subscription before you start. The useful question is whether the result improves enough to matter.

<span id="give-it-context-about-you"></span>
<span id="the-basics-just-tell-it"></span>

## Tell it what it needs to know

A generic request usually gets a generic answer. Give the chatbot enough information to understand your situation: what you're trying to achieve, who the result is for, what's already decided, and what would make its answer unusable.

“Help me plan a trip” leaves almost everything to guesswork. Try:

```text
We're planning a five-day family trip in October. We want one base,
short outings, and something to do if it rains. One person loves
museums; another gets restless indoors. We won't rent a car.

Suggest three kinds of destination to investigate. Compare the
trade-offs for each person. Ask if a missing detail would materially
change your suggestions. Don't make up prices or availability.
```

The same habit helps at work. With an approved tool and material you're allowed to use, a brief might start: “I coordinate a small research team. I'm preparing a one-page update for a nontechnical funder. They need the decisions and delays, not a literature review.” Your role, audience, and purpose all change what a useful answer looks like.

You can say this out loud. A messy explanation with the relevant details is often more useful than a beautifully formatted prompt with none of them. If you're stuck, ask: “What do you need to know to help me with this?”

<span id="structure-your-requests"></span>

## Give it a clear job and a usable output

Specify what you want back. A comparison table? A ready-to-send email? Three questions to ask a contractor? A critique of the weakest part of a draft?

Compare “Help me with an update” with “Turn these approved notes into a 200-word update for our funder. Lead with the decision needed, then progress and delays. Mark missing dates rather than inventing them.” The second request defines a result you can assess.

A useful request covers **context, task, format, and constraints**. You rarely need a long template. For a bigger job, the [prompting guide](prompting.md) shows how to put those pieces together—or have the AI do the formatting for you.

Give it permission to disagree: “If none of these options meets my requirements, say so.” That invites useful criticism, though it doesn't guarantee the criticism is right.

<span id="use-conversations-not-one-shots"></span>

## Work through the answer together

Treat the first response as something to react to. Tell it which part works and which part doesn't. Specific feedback gives the next attempt a direction:

```text
The comparison is useful, but you've ignored the no-car constraint.
Recheck each option against it and remove anything that depends
on driving. Keep the table and explain what changed.
```

For writing, “less formal” is a start. “Keep my opening, cut the second paragraph in half, and replace the abstract claims with the example I gave you” is much easier to act on.

A short exchange can improve one draft in stages:

```text
You: What are the two weakest parts of this introduction?
AI:  [Identifies an unsupported claim and a confusing second paragraph.]
You: Rewrite paragraph two using the example in my notes.
AI:  [Produces a revision.]
You: The structure works, but the tone is too formal. Keep my opening
     sentence and use shorter sentences in the rest.
AI:  [Revises again.]
You: Now apply those changes to paragraph four. Keep the figures as given.
```

Stay in the same conversation while you refine the same piece of work. When the task changes, or the conversation has become tangled in abandoned approaches, start a new chat with a short handoff:

```text
Summarize what the next chat needs: the goal, current decisions,
constraints, useful sources, unresolved questions, and next step.
Separate confirmed facts from ideas we haven't checked.
```

Read that summary before reusing it. A handoff can carry a mistake forward just as easily as a useful decision.

<span id="the-power-move-saved-context"></span>
<span id="the-next-level-project-folders"></span>

## Save the context you keep repeating

For recurring work, keep a short file of stable preferences and instructions. Put it in a chatbot Project if your account supports that, or paste it into a new chat when you need it.

Keep three things distinct:

- **General preferences:** how much detail you like, how you want feedback, and your preferred writing style.
- **Project context:** the relevant people, goals, constraints, reference files, and decisions.
- **Today's request:** the particular draft, trip dates, question, or output you need now.

For example, a **Grant writing** project's standing instructions might say:

```text
I write proposals for nontechnical foundation readers.
Lead with the claim and the evidence for it. Use direct language.
Flag unsupported statements and missing numbers; don't fill them in.
Keep the funder's priorities and the current proposal in the source
files. Ask which proposal we're working on if it isn't clear.
```

Your saved context can include your role, current projects, preferred level of detail, and common tasks. Some chatbots also offer account-wide custom instructions or personalization. Use those for broadly applicable preferences, and project instructions for a particular job. Keep confidential work context only in systems approved for it.

Projects can keep instructions and reference material together. Memory is a separate feature whose behavior depends on the product and settings. Don't assume it remembers everything accurately: save important decisions explicitly and supply the current version when it matters. [ChatGPT project help](https://help.openai.com/en/articles/10169521-projects-in-chatgpt) and [Claude project help](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects) explain their controls.

The [project-folder guide](../build-your-own/project-folders.md) walks through this using family travel. Keep lasting preferences in the reusable file; put this trip's dates and bookings in the individual brief. Afterward, add the few lessons that would change your next decision.

<span id="the-next-level-teach-it-your-voice"></span>

## Teach it your voice

If every draft sounds like it came from a corporate newsletter, give it examples of your own writing. Ask what patterns it sees, then turn those observations into a short style guide. Add a few annotated passages explaining what you like about them.

Test the guide on something you've already written. Keep what helps and correct what doesn't. The [voice-file walkthrough](../build-your-own/voice.md) includes the full process and a **Chatbot** setup tab.

<span id="know-what-chatbots-are-bad-at"></span>

## Check what you're going to rely on

Chatbots can be useful at drafting, explaining, brainstorming, reorganizing information, and comparing supplied material. They can also invent a citation, misread a table, or give confident advice built on a false assumption.

- **Facts and references:** open the cited source and check that it supports the claim. A plausible-looking citation is not evidence.
- **Dates, prices, and availability:** ask for current sources when search is available, then verify the details that affect your decision.
- **Calculations:** ask for a calculator, spreadsheet, or code-based calculation where available. Check important totals and the inputs used.
- **Summaries:** spot-check the original, especially names, deadlines, exceptions, and numbers. Asking for a supporting quotation or page reference makes checking easier.
- **Consequential decisions:** use the output to prepare questions and organize evidence. Medical, legal, and financial judgments still need the appropriate expertise.

“Don't make things up” is a useful instruction, not a reliability guarantee. Check the reasoning as well as the facts.

For a substantial plan, get a [fresh-chat critique](plan-review-browser.md). Give the reviewer the goal and constraints as well as the draft. A fresh chat offers another look; it can still share the first model's blind spots.

<span id="build-a-library-of-good-prompts"></span>
<span id="next-steps"></span>

## Keep the prompts that worked

When a request produces something useful, save it with a brief note about why it worked. Replace the one-off details with placeholders. Keep a couple of good outputs beside it so you can judge whether the prompt still works after you change it.

Useful candidates include a paper summary for a nontechnical reader, a meeting-notes-to-action-items request, a recommendation-letter outline, or a check for logical gaps in a draft.

Start with a text file or a note. You don't need a prompt-management system. The [preferences template and prompt assistant](prompting.md#save-your-preferences-and-test-changes) give you a starting point.

If you later use an agent, those saved prompts can become the starting point for a [reusable skill](../build-your-own/building-skills.md).

For other ways to work, see [voice dictation](wispr-flow.md), [meeting transcription](granola.md), and [working with a collection of documents in NotebookLM](notebooklm.md). Recording, uploading, or connecting accounts still depends on what's permitted in your setting.

[Back to Get ahead of the curve](../starter-kit/agents-at-work.md)
