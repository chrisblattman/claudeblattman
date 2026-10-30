---
title: Build a continuous improvement system
description: Turn real corrections into useful instructions and examples, then check whether they improve the next task.
---

# Build a continuous improvement system

When I rewrite an AI’s draft, I want the next draft to benefit. At the end of the task, I can say: **“Analyze my edits and send what you learned to the voice project.”** The agent compares the versions and puts the useful observations where I can review and use them again.

That is what I mean by continuous improvement. My edits and complaints help improve the instructions, examples and organization I work with.

Start with the [voice project you built on page one](build-your-own/voice.md) and a piece of writing you actually need. After editing a draft, ask the agent to compare your changes and identify what it should do differently next time. The agent handles the comparison and filing, and you decide which lessons should change your guidance.

**As always, ask your AI to do the setup and walk you through it.**

Open your AI app and navigate to the voice project folder you built on page one. Then ask:

```text
Now that we've built our voice and style guidelines for writing, help me set up a system for continual updates as I edit agentic writing. Follow the walkthrough at claudeblattman.com.
```

<div class="checklist" markdown>

## Set up the system

<a id="ask-for-help-working-out-the-approach"></a>
### 1. Give your corrections a home

Use the voice project you already built. Keep the drafts with the work they belong to, and give the lessons a route back to that shared project. For example:

```text
My voice/
├── CORE_VOICE.md          Preferences shared across writing types
├── EMAIL_VOICE.md         Email-specific guidance
├── LONG_FORM_VOICE.md     Long-form guidance, if needed
├── VOICE_LEARNING.md      How to compare edits and handle lessons
└── state/
    └── voice-learning/
        ├── CANDIDATE_INDEX.md       Index of corrections and decisions
        ├── CANDIDATE_TEMPLATE.md    Template for each correction record
        └── candidates/
            └── [correction-id].md   One record per correction episode

Funder presentation/
└── reviews/
    └── [revision]/
        ├── email-draft.md
        └── email-revised.md
```

This follows my storage structure. The writing project and draft filenames are examples; keep the original and revised versions with the work they belong to. Ask the agent to create the shared learning files and folders.

`state/voice-learning/candidates/` — one record per correction episode, with changes, possible lessons, source links and the decision.  
`CANDIDATE_INDEX.md` — an index that helps the agent find those records.  
`CANDIDATE_TEMPLATE.md` — a consistent format for new records.  
`VOICE_LEARNING.md` — the procedure for comparing edits, filing observations and updating a guide when you agree to a change.

**Saving a correction note does not, by itself, change the next draft.** When you agree to a lasting preference, the agent updates the relevant voice guidance. Future writing sessions are instructed to read that guidance. The notes explain how you reached the decision; they are not another set of rules to load into every draft.

In my setup, writing and learning connect like this:

<div class="council-loop council-overview">
<div class="council-horizontal" tabindex="0" role="region" aria-label="Voice improvement loop and file locations; scroll horizontally on small screens">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 295" role="img" aria-labelledby="voice-loop-title voice-loop-desc">
<title id="voice-loop-title">The voice improvement loop</title>
<desc id="voice-loop-desc">Ask the agent to draft something, revise the draft, and ask it to learn. The agent compares the saved versions and files a correction record with source links in your shared voice project. If you agree to a reusable lesson, it updates the core or relevant writing-type guide. The guides inform the next draft. If no new rule is needed, keep the notes and leave the guides unchanged.</desc>
<defs><marker id="voice-loop-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M1 1 L6 3.5 L1 6" fill="none" class="council-arrowhead" stroke-width="1.1"/></marker></defs>
<text class="council-note" x="258" y="24">YOUR WRITING PROJECT</text>
<path class="council-edge" d="M12 37 H504"/>
<text class="council-note" x="688" y="24">YOUR SHARED VOICE PROJECT</text>
<path class="council-edge" d="M528 37 H848"/>
<path class="council-edge" d="M160 98 H181" marker-end="url(#voice-loop-arrow)"/>
<path class="council-edge" d="M332 98 H353" marker-end="url(#voice-loop-arrow)"/>
<path class="council-edge" d="M504 98 H525" marker-end="url(#voice-loop-arrow)"/>
<path class="council-edge" d="M676 98 H697" marker-end="url(#voice-loop-arrow)"/>
<rect class="council-session" x="12" y="70" width="148" height="56" rx="2"/>
<text x="86" y="93">Ask the agent</text>
<text x="86" y="111">to draft something</text>
<text class="council-note" x="86" y="146">Uses</text>
<rect x="33.55" y="151" width="104.9" height="19" rx="2" fill="var(--md-code-bg-color)"/>
<text class="council-command-label" x="86" y="164">CORE_VOICE.md</text>
<rect x="29.9" y="173" width="112.2" height="19" rx="2" fill="var(--md-code-bg-color)"/>
<text class="council-command-label" x="86" y="186">EMAIL_VOICE.md</text>
<rect class="council-session" x="184" y="70" width="148" height="56" rx="2"/>
<text x="258" y="93">Revise the draft;</text>
<text x="258" y="111">ask it to learn</text>
<text class="council-note" x="258" y="146">Saves, for example</text>
<rect x="201.9" y="151" width="112.2" height="19" rx="2" fill="var(--md-code-bg-color)"/>
<text class="council-command-label" x="258" y="164">email-draft.md</text>
<rect x="194.6" y="173" width="126.8" height="19" rx="2" fill="var(--md-code-bg-color)"/>
<text class="council-command-label" x="258" y="186">email-revised.md</text>
<rect class="council-session" x="356" y="70" width="148" height="56" rx="2"/>
<text x="430" y="93">Agent compares</text>
<text x="430" y="111">your edits</text>
<text class="council-note" x="430" y="146">Follows</text>
<rect x="362.95" y="151" width="134.1" height="19" rx="2" fill="var(--md-code-bg-color)"/>
<text class="council-command-label" x="430" y="164">VOICE_LEARNING.md</text>
<rect class="council-session" x="528" y="70" width="148" height="56" rx="2"/>
<text x="602" y="84">File notes with</text>
<text x="602" y="101">source links; suggest</text>
<text x="602" y="118">a proposed lesson</text>
<text class="council-note" x="602" y="146">Files under voice-learning/</text>
<rect x="542.25" y="151" width="119.5" height="19" rx="2" fill="var(--md-code-bg-color)"/>
<text class="council-command-label" x="602" y="164">candidates/*.md</text>
<rect x="531.3" y="173" width="141.4" height="19" rx="2" fill="var(--md-code-bg-color)"/>
<text class="council-command-label" x="602" y="186">CANDIDATE_INDEX.md</text>
<rect class="council-session" x="700" y="70" width="148" height="56" rx="2"/>
<text x="774" y="93">Update the guide</text>
<text x="774" y="111">if you agree</text>
<text class="council-note" x="774" y="146">Updates the relevant guide</text>
<rect x="721.55" y="151" width="104.9" height="19" rx="2" fill="var(--md-code-bg-color)"/>
<text class="council-command-label" x="774" y="164">CORE_VOICE.md</text>
<rect x="717.9" y="173" width="112.2" height="19" rx="2" fill="var(--md-code-bg-color)"/>
<text class="council-command-label" x="774" y="186">EMAIL_VOICE.md</text>
<path class="council-edge council-return" d="M676 116 H688 V214 H856"/>
<text class="council-note" x="740" y="231">No new rule? Keep notes.</text>
<path class="council-edge council-return" d="M848 98 H856 V252 H4 V98 H10" marker-end="url(#voice-loop-arrow)"/>
<text x="430" y="280">The voice guides inform your next draft</text>
</svg>
</div>
</div>

When I agree to a new preference, the agent updates `CORE_VOICE.md` or the relevant writing-type guide, such as `EMAIL_VOICE.md`. Saved instructions direct future sessions to those guides. Sometimes the comparison shows that the existing guidance already covers the correction; the agent records that outcome without adding another rule.


<label class="step-done"><input type="checkbox"> My voice project has a place for correction records and a learning procedure.</label>

<a id="2-tell-it-what-learn-from-my-edits-should-do"></a>
### 2. Make learning from edits a standing instruction

The standing instruction from page one already tells your agent to use your voice guides. Extend it once so it also knows how to save corrections from any writing project:

```text
When I say “compare my edits,” “learn from my edits,” or “analyze my edits and send what you learned to the voice project,” follow the instructions in my voice learning Markdown file and update the necessary logs. Add this to my global CLAUDE.md or AGENTS.md instructions, preserving my other instructions.
```

If you use both Claude and Codex, do this once in each app.

<label class="step-done"><input type="checkbox"> I've updated my global instructions so that my agents know where to save corrections.</label>

## Make a correction useful next time

<a id="review-add-judgment-and-revise"></a>
### 3. Correct a real piece of work

**Use your voice pack on a real draft. Then edit it, or explain what is wrong.** Read for meaning before judging resemblance: the reasoning, uncertainty, tone, amount of explanation and organization all matter.

For example:

```text
They already know the background. Keep the reason for the delay, thank them for the work, then make the question easy to find.
```

That gives the agent more to work with than “This doesn't sound like me.”

<label class="step-done"><input type="checkbox"> I've given my own feedback to a draft AI wrote for me.</label>

### 4. Ask the agent to store what it learned

Once the revision says what you mean, ask:

```text
Analyze my edits and send what you learned to the voice project.
```

Let the agent find the versions and do the comparison. Even if you edited elsewhere, you can say “Analyze my edits” and the agent will look for the latest draft in the files or connected apps it can access. If it cannot find the original draft, it should say so.

You should get a short explanation and a link to the saved record. For example, the agent might reply:

> You removed several technical follow-up requests while keeping the main findings and questions. Your email guide already says to keep an initial response focused on the next conversation; I didn't apply that well here. I've saved the comparison and linked it from your correction index. I haven't changed the guide.

That illustrative response reflects one of my recent email revisions. The comparison showed that the existing guidance covered the problem. When it finds a useful new preference instead, the agent should suggest a lesson and show how it would update the relevant guide.

For a project-specific revision you only want to log, say:

```text
Save this revision and a short record of what changed. These changes are specific to this project, so I don't think we need to update my voice guide.
```

This saves the versions with the writing project and a project-only record in the shared correction index. You get a record without turning a one-off change into a writing rule.

<label class="step-done"><input type="checkbox"> I've saved the correction and received the agent's response.</label>

### 5. Update the guidance if it’s useful for future drafts

**If there is a change to make,** have the agent put it in the smallest useful place. You can do this in the same conversation:

```text
Yes, update the voice guidelines. Replace any rule it supersedes, keep a recoverable previous version, and record the decision and its scope in our notes.
```

<label class="step-done"><input type="checkbox"> I've made a personal judgment on whether or not to update the voice guide.</label>

## Repair the way you work together

<details class="council-details" markdown="1">
<summary>What if the next draft still misses the mark?</summary>

If it failed, ask the agent to distinguish three things: **Did it read the guide? Did it apply the relevant preference? Did that preference help?** A missing file needs a working connection. An ignored instruction needs better application and review. A preference that makes the writing worse needs narrowing or removal. Adding another rule is not always the answer.

</details>

<a id="give-independent-attempts-different-jobs"></a>
### 6. Revisit the setup when real work gives you a reason

Sometimes AI gets fixated on an instruction from three months ago, or starts doing badly at a task it handled well before. **Use a [council](starter-kit/occasional.md) to diagnose it!** Describe the failure and ask:

```text
Use a council to diagnose why this task used to work better. Read the relevant instructions, examples and recent corrections. Check for stale or conflicting guidance, missing context, and instructions that were not loaded. Propose the smallest useful repair, explain what it would replace, and let me review it before making the change.
```

The repair may be to clarify an instruction, change where information is stored, or delete a rule.

Let real work tell you when to revisit the setup. Start with consequential corrections and check what happens next. As the tools improve, some of the organization you once needed may become less useful.

<label class="step-done"><input type="checkbox"> I know how to diagnose a recurring problem and revise the system when needed.</label>


## A caveat

I used a council to help me set up this recurring improvement system. We considered both the approach above and building it into a formal skill. You might prefer a skill for invoking the same note-taking and improvement procedure; it can use the same files and workflow.

</div>
