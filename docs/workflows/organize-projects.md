---
title: Organize your work around structured projects
description: Give recurring work a home, save the context your agent needs, and pick up where you left off.
---

# Organize your work around structured projects

When you return to a project after a week away, you want to find the current draft, remember what you decided, and get back to work. You also want the AI to know enough about the project that you don't have to explain it all again.

**Start with one project you will use again.** It might be a research paper, a committee, or family travel. My projects largely grew out of folders I already had in Dropbox. You can improve the organization while doing the work.

As always, ask your AI to help. Open the project you want to work in and try:

```text
Help me organize this project so we can work on it over time. Look at what is already here, ask me about the context you're missing, and suggest a simple way to keep the current work, sources, and instructions easy to find.
```

<div class="checklist" markdown>

### 1. Give the project a home

Choose a folder that covers the work you want to do. A research project can have its own folder; a broad home-and-family folder can contain smaller projects for individual trips. Open the level that makes sense for today's task. The [starter guide](../starter-kit/newcomers.md) shows how to begin working in a project.

The material can live in more than one place. A shared Google Doc, a Dropbox folder, and a library of papers can stay where they are. Ask the agent to make a short index of the relevant locations and check which ones it can read. If it proposes moving files, look at the proposed organization first.

<details class="council-details" markdown="1">
<summary>Using a chatbot project instead of a local folder?</summary>

For a browser chatbot project, such as a project in ChatGPT or Claude.ai, use the app's project instructions for reusable directions and its reference files for the background material. A chatbot project and a folder on your computer are different things: creating one does not automatically give it access to the other. Add the material you want it to use, or [connect the app that holds it](../build-your-own/mcp-setup.md).

You can follow the same steps below. Ask the AI to help save the resulting context in the project features your app provides. If it cannot update those instructions or files directly, ask for the revised text and save it there yourself. If your app has no project feature, keep the context in a document you can attach to a new chat.

</details>

<label class="step-done"><input type="checkbox"> My project has a home, and my agent can find the relevant material.</label>

### 2. Tell the agent what matters { #build-your-first-file }

Your files won't explain everything. Talk through what you're trying to do, who's involved, the constraints, and what has worked or failed before. For a recurring task, include the preferences you find yourself repeating.

For family travel, that might mean who likes what, how long you're willing to drive, and why the last trip worked. For a research project, it might mean the question you're trying to answer, who makes which decisions, and what the funder needs next.

```text
Use what I've told you and the material in this project to write a short project overview. First ask me the questions that would change your advice. Separate preferences we'll use again from details specific to this task, and show me anything you've inferred so I can correct it.
```

Read the overview and fill the gaps. Specific constraints are useful: “keep drives under two hours” gives the AI more to work with than “we don't like long drives.” Include what you want to avoid as well as what you like.

<label class="step-done"><input type="checkbox"> I've given the agent the context it needs and corrected its account of the project.</label>

### 3. Give each kind of information a place

Ask the agent to organize what you've gathered around a few simple jobs:

| Material | What belongs there |
| --- | --- |
| **Current overview** | The goal, people, decisions, open questions, next actions, and links to the current work. |
| **Sources and notes** | Reference documents, data, correspondence, and dated meeting notes or transcript links. |
| **Drafts and outputs** | Work in progress and finished results, with the current version clearly identified. |
| **Standing instructions** | Preferences and directions you want the agent to use repeatedly. |

Keep changing facts in the overview or task brief. “Avoid overnight flights” may be a lasting preference; the dates and bookings for this trip belong with this trip. You want to retain both, with their purpose clear.

```text
Organize this material so we can tell what's current, find the original sources, and reuse the instructions that apply next time. Use the files we already have where possible. Keep links to material that lives elsewhere, and show me where you put things.
```

<details class="council-details" markdown="1">
<summary>One possible folder layout</summary>

```text
My project/
├── PROJECT_INDEX.md       Where the material lives
├── PROJECT_STATUS.md      Current goals, decisions, and next steps
├── AGENTS.md / CLAUDE.md  Standing instructions
├── drafts/               Current work and finished versions
├── meetings/             Dated notes and transcript links
└── references/           Sources or pointers to them
```

These names are examples. A shared document can hold the overview, and a small project may need only an overview and its source files. Ask the agent to fit the structure to your work.

</details>

For instructions you want the agent to read at the start of a session, see [Write persistent instructions](../build-your-own/agents-md.md). Keep the current overview short enough to use; link to the history rather than copying it all into the instructions. Written instructions guide the agent's behavior; access settings determine what it can reach.

<label class="step-done"><input type="checkbox"> I can find the current work, its sources, and the instructions we will reuse.</label>

### 4. Use the project and leave a handoff

Give the agent a real job. Ask it to read the overview and relevant sources, flag missing or contradictory information, and get to work. Add your judgment as you go. If a new decision changes the plan, have it update the current overview.

At the end, use the starter kit's [/done](../starter-kit/occasional.md#7-save-where-you-landed) to save a handoff. Without that skill, you can ask in ordinary language:

```text
Save where we landed: the decisions, unfinished work, next action, and links to the current draft. Update the project overview where needed so we can pick this up in another session.
```

The handoff records where you stopped. It does not automatically update every separate document you use to manage the project, so name the overview you also want updated.

<label class="step-done"><input type="checkbox"> I've used the project on real work and saved what we need next time.</label>

### 5. Come back and improve the setup

When you return, ask the agent to read the overview and handoff, check for newer material, and help you resume. For a larger project, the [catch-up guide](project-management.md) goes further. If you need an older decision or conversation, see [Find past work](recall.md).

Improve the saved context when experience gives you a reason. A shopping recommendation may reveal an unstated preference; a project meeting may change the deadline. Put each correction where it belongs. Keep reusable preferences separate from the facts of one task.

The [personal shopper](life/shopping.md), [vacation planning](life/vacation.md), and [health and fitness](life/health.md) examples show how this works for different kinds of recurring questions.

<label class="step-done"><input type="checkbox"> I can return to this project and continue without reconstructing the previous chat.</label>

</div>
