---
title: Build your voice pack
description: Build a core voice guide and separate guides for the kinds of writing you do, then use them on real work.
---

# Teaching AI your voice

A draft can be accurate and still sound wrong. It may explain too little, sound too formal for the reader, or bury the decision under polished paragraphs. A useful voice pack captures those choices and, most importantly, helps your AI sound more like you, the human.

Start a **voice project**. Give it a name and a home in your app, just as you would any other project. It will hold your writing samples and two kinds of guidance: **a core voice guide** for the habits that stay consistent across your writing, and **separate guides for different kinds of writing**, such as email and long-form prose. Together, these make up your voice pack.

The starting point is gathering basic evidence so the AI sounds a little bit like you. Over time, it should sound a lot more like you. That comes from correcting it on real work. Build the pack here, then [set up the system that learns from your edits](../how-i-improve-the-work.md).

**Ask your AI to help you build it.** Open a local Claude Code or Codex session and start with:

```text
Walk me through the voice pack guide at claudeblattman.com. Ask me for the inputs you need first, then help me build it.
```

<div class="checklist" markdown>

## Gather the evidence

<a id="1-put-your-best-writing-in-one-folder"></a>
### 1. Start a voice project and point it at your corpus

Create a folder and open it as a project in Claude Code or Codex. If you need the steps, use [the project setup in the first-session guide](../starter-kit/newcomers.md#4-pick-a-test-folder-and-make-a-copy-of-it).

The first step is to build a collection of pieces you’ve written and would still stand behind. I refer to this collection as my **corpus** and name the folder `corpus` accordingly. Because I do so many different kinds of writing, and they all sound different, I organize my corpus into subcategories of writing. For example:

```text
My voice/
└── corpus/
    ├── emails/
    │   ├── README.md
    │   └── team-update.txt
    ├── proposals/
    │   ├── README.md
    │   └── grant-proposal.docx
    └── op-eds/
        ├── README.md
        └── published-column.pdf
```

Alternatively, you could leave writing in its existing project folders. Ask the agent to make a `corpus-index.md` in your voice project that records the file paths and the same audience notes described below. The important thing is that it can find and read the sources.

For emails, ask the agent to start with a **random sample of 100 sent messages**. Emails are so varied that a handful of favorites may miss much of your writing style. A random sample gives the agent a broader starting point across recipients, purposes, thread lengths, and how much the reader already knows. Look at what it found and add examples of any important kind of email it missed.

<details class="council-details" markdown="1">
<summary>Ask the agent to help gather email samples</summary>

I had agents take random samples of hundreds of emails. If your agent has an email connection, it can do the gathering for you:

```text
Help me build my email corpus. Ask me what date range to use, then select a random sample of 100 sent messages I wrote, or all available messages if there are fewer. Keep my words separate from quoted replies and signatures, but retain enough thread context to understand the message. Save the samples and source references in my voice project. Tell me which audiences and kinds of email are represented and which seem missing. Flag uncertain authorship and ask me about AI assistance you cannot establish.
```

If it cannot access your email, give it an export or a set of messages to work from.

</details>

<label class="step-done"><input type="checkbox"> I've built my corpus.</label>

### 2. Explain what each sample was trying to do

Ask the agent to help you write a short guide to the samples in your corpus. Each subfolder’s `README.md` tells it when to draw on those samples: who you were writing to, your relationship, and what the writing needed to accomplish.

```text
Create a README file for each corpus subfolder with a short entry for each sample. Note the filename, audience and relationship, and purpose. The goal is to teach the voice pack how and when to draw writing guidance from each sample based on what the agent is trying to write from scratch. Take a first pass, then ask me for context you can't establish from the files. Don't make guesses.
```

Read its first pass and fill in the gaps. “This person already knew the background” can explain why an email was brief. Identify your sections of collaborative writing and label AI-assisted drafts so the agent knows whose words it is learning from.

<details class="council-details" markdown="1">
<summary>Using a chatbot?</summary>

Attach the samples to your message. Ask the chatbot to read them and build the README notes, using the prompt above. Then use the samples and notes to build the voice pack by following the rest of this guide.

Once it is built, put the guidance from `CORE_VOICE.md`, `EMAIL_VOICE.md`, `LONG_FORM_VOICE.md`, and your other guides into the chatbot’s project-level instructions. Attach your individual samples and README notes as project-level context.

</details>

<label class="step-done"><input type="checkbox"> My samples have notes explaining their audience and purpose.</label>

<a id="2-let-the-ai-analyze-them-not-you"></a>
<a id="2-let-the-ai-analyze-them-then-check-its-reading"></a>
### 3. Let the AI analyze them, then check its reading

Ask the agent what stays consistent across your writing and what changes with the audience or type of piece. Check whether its description sounds like you, and have it show you the passages behind its conclusions:

```text
Read these samples, their notes, and help me describe how I write. Identify habits shared across my writing and differences specific to emails, long-form prose, proposals, or other types in my corpus. Quote the passages behind your observations. Look at how I open, explain my reasoning, handle uncertainty, address the reader, organize the material, and end. Notice tone, rhythm and amount of detail too.

Separate patterns that belong in my core voice guide from choices that belong in a writing-type guide or seem idiosyncratic to one individual piece.
```

Read the analysis as yourself. “I do that in grant proposals, but not in emails” is a useful correction. So is “That sentence is from my co-author.” Tell it when a pattern is accidental, or when the explanation misses why you made a choice.

<label class="step-done"><input type="checkbox"> I've checked the analysis against my writing and corrected what it missed.</label>

<a id="write-the-file"></a>
## Build the guides

<a id="3-turn-the-analysis-into-a-voice-file"></a>
### 4. Build your core and writing-type guides

My pack starts with `CORE_VOICE.md`, which holds the voice properties that apply across my writing. Then it has separate guides for email, proposals, public writing, long-form prose, and other kinds of work. You can use the same structure with just the types you need:

```text
My voice/
├── CORE_VOICE.md        Shared voice across writing types
├── EMAIL_VOICE.md       Emails
├── LONG_FORM_VOICE.md   Books and extended essays, if needed
├── [OTHER]_VOICE.md     Specific guides as needed
└── corpus/             Samples and their README notes
```

The core holds what stays consistent—your way of explaining an argument, handling uncertainty, or addressing the reader. Each writing-type guide explains what changes: how much background to give, how to organize the piece, or how formal to be.

```text
Using the analysis and my corrections, build CORE_VOICE.md for preferences that apply across my writing. Create separate guides for the writing types I use, such as EMAIL_VOICE.md and LONG_FORM_VOICE.md. Keep shared guidance in the core and the differences in the relevant guide. Explain when each guide applies, including any specific exceptions to a core default. Include a few unchanged passages from my samples in each relevant guide, with a short note on the audience, purpose, and what the example illustrates. Use my samples and decisions, not someone else's personal writing rules. Flag anything I still need to decide.
```

You can include a **do-not-use list** of words, phrases, or formatting choices. My core guide calls this its ‘Anti-AI Vocabulary’ list. The pack should also explain what good writing sounds like for you. Your core guide can change as you learn more about your preferences.

Prefer a starting template? Give your agent the [Voice Pack Template](../assets/templates/voice-pack-template.txt) and ask it to adapt its useful sections into the core and writing-type guides above, using your samples and decisions.

<a id="4-add-35-annotated-examples-the-step-that-matters-most"></a>
<a id="4-add-examples-that-show-what-you-mean"></a>
<a id="5-add-examples-to-the-right-guide"></a>
Examples belong in the guides from the start. A short note can explain what to borrow from a passage: how you introduce a disagreement, how much context you give, or how you make a request friendly and direct.

<label class="step-done"><input type="checkbox"> I've built my core and writing-type guides, with examples.</label>

<a id="5-load-it-so-every-new-session-starts-with-it"></a>
<a id="5-make-the-file-available-in-a-new-session"></a>
<a id="6-connect-the-pack-to-the-projects-where-you-write"></a>
### 5. Make your voice pack the default

Now make this a standing instruction so you don't have to ask for your voice pack every time. My setup already directs the agent to the guides when it drafts or edits my writing. The agent should know to use them from those saved instructions.

Ask it to add a short pointer to your **personal, global instructions**, which apply across projects. A `CLAUDE.md` or `AGENTS.md` inside just the voice folder would only cover that project.

=== "Claude"

    ```text
    Make my core voice and other writing guides the default when you draft or edit writing for me. Add a standing instruction to my personal CLAUDE.md. Always read and use my core voice, and use the relevant writing guide when needed. Preserve the other instructions unless they directly contradict my core voice. If they do, reconcile the conflicting writing instructions and flag what changed.
    ```

    Claude Code's [personal CLAUDE.md](https://code.claude.com/docs/en/memory#choose-where-to-put-claudemd-files) applies across projects.

=== "Codex"

    ```text
    Make my core voice and other writing guides the default when you draft or edit writing for me. Add a standing instruction to my personal AGENTS.md. Always read and use my core voice, and use the relevant writing guide when needed. Preserve the other instructions unless they directly contradict my core voice. If they do, reconcile the conflicting writing instructions and flag what changed.
    ```

    Codex's [personal AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) supplies defaults across projects.

If you write in both apps, do this once in each. On another computer, ask the agent to connect its personal instructions to the voice folder there too.

<label class="step-done"><input type="checkbox"> My agent has a standing instruction to use my voice pack when writing for me.</label>

<a id="load-it-and-test-it"></a>
## Use it on real work

<a id="6-test-it-on-the-piece-you-held-back"></a>
<a id="7-try-it-on-a-real-writing-task"></a>
### 6. Try it on a real writing task

Open a new session in a project where you have writing to do. With the standing instruction in place, you can make an ordinary request. For example:

```text
Draft an email to [recipient] and cc [colleague] about [topic]. Use the notes in this project. I want them to [next step].
```

You shouldn't need to name the voice files again. If the result sounds wrong, ask the agent to check whether it used your saved voice instructions, then explain what you want changed.

**Correct the writing.** You can rewrite it yourself or explain the change aloud. “Make it shorter” is less helpful than “They already know the background. Keep the reason for the delay, then make the question easy to find.” Notice how much editing remains before you would send it.

<details class="council-details" markdown="1">
<summary>Having trouble explaining what sounds wrong?</summary>

Try a comparison. I’ve asked the AI to show me a few paragraphs and A/B test which version I think is better. You can ask for two versions of the same passage, with the same facts and audience, then explain which you prefer and why. This can help you put a preference into words. You do not need to run a series of tests before using the pack.

I get into the process of learning from your feedback in more detail on [the next page](../how-i-improve-the-work.md).

</details>

<label class="step-done"><input type="checkbox"> I've used the pack on a real draft and corrected what mattered.</label>

</div>

<a id="after-today"></a>
Congratulations! You now have an AI converging towards you. [Page two shows how to make your corrections useful next time](../how-i-improve-the-work.md).
