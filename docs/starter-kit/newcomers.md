---
description: Start with a real project. Open it in your desktop agent, give it context, and work together until you have something useful.
---

# Your first session

Pick something you actually want to get done. A family trip to plan, or a decision at work where the information is scattered across a dozen files. You’ll learn more by getting an answer that matters to you.

You don’t need to code or use a terminal. You do need to give the agent a runway: point it in the right direction, supply the information it needs, and keep correcting the course. The aim is to get the plane to take off and land.

<div class="checklist" markdown>

## Set up your tool

### 1. Choose an agent

Start with **Claude Code** or **Codex**, OpenAI’s agent. If you already use one, keep it. If you already pay for Claude or ChatGPT, check what your plan includes before buying something else. You can add a second AI later.

The [guide to choosing an agent](../build-your-own/picking-your-agent.md) has more detail. For today, the useful decision is which app you’ll open and use.

<label class="step-done"><input type="checkbox"> I’ve chosen an agent.</label>

### 2. Install the app

Use the official [Claude download page](https://claude.com/download) or [OpenAI desktop guide](https://learn.chatgpt.com/docs/app). Download the version for your computer, install it, and sign in.

In Claude, open the **Code** tab. In OpenAI’s desktop app, select **Codex** if the app opens in ChatGPT. You want the part of the app that can work with a folder on your computer.

<label class="step-done"><input type="checkbox"> I’ve installed the app and opened its agent workspace.</label>

### 3. Set permissions

Permissions control what the agent can read or change and when it asks you first. Claude and Codex offer similar choices, though the names and boundaries differ. Ask:

```text
Help me understand the permissions for this session. What can you read and change, and which actions will ask me first? Walk me through the controls in this app. I want to work in my project folder and keep important decisions with me.
```

<details class="council-details" markdown="1">
<summary>What do the permission modes mean?</summary>

Use the permissions control below the message box. Here’s the short version; available options can vary by version and organization.

<div class="council-kit-summary" markdown="1">

| Claude Code | Codex | What it means |
|---|---|---|
| **Manual** | **Ask for approval** | You review permission requests. Claude asks before edits and commands; Codex already allows work inside the project and asks before crossing its access boundary. |
| **Accept edits** | No exact equivalent | Claude allows file edits and common file commands, but asks before other commands. Codex’s **Ask for approval** already permits project edits and commands within its limits. |
| **Auto** | **Approve for me** | Automatic checks handle routine approval decisions. Some actions still need you. In Codex, the project’s access limits stay in place. |
| **Bypass permissions** | **Full access** | Removes major approval or access restrictions. These are broader than automatic review; they are not needed just to reduce routine prompts. |

</div>

**Planning is a separate choice.** Claude’s **Plan** mode explores and proposes an approach without editing your source files. In Codex, ask the agent to show you a read-only setting if you want to prevent edits. Simply asking for a plan in a message does not change permissions.

For more detail, see the [Claude permission guide](https://code.claude.com/docs/en/desktop#choose-a-permission-mode) or [Codex permission guide](https://learn.chatgpt.com/docs/permission-modes).

</details>

Anecdotally, I think **Auto** in Claude or **Approve for me** in Codex is the right permission setting for most users. For folders and documents I don’t want the agent to have access to, I keep them in the cloud and not locally synced. I also keep them out of the cloud connections I give the agent access to.

<label class="step-done"><input type="checkbox"> I understand the access and approval settings for this session.</label>

## Start thinking in projects { #run-the-loop }

<a id="4-pick-a-test-folder-and-make-a-copy-of-it"></a>
<a id="5-point-the-agent-at-it"></a>
### 4. Pick a project and open its folder

A folder is your project’s home. **Always work in a project.**

My project folders are relatively coarse. I typically have one for each research project I’m working on, one for AI workflows, and one for family, home, and personal matters. You can nest sub-projects inside those folders. For example, I might keep a `Family vacation` folder inside `Home`. When I want to work on the vacation, I point the agent to that subfolder rather than the broader `Home` folder.

**Open the top-level folder for the work you want to do.** For a whole research project, that means the folder containing its writing, figures, and other subfolders. For the family vacation, it means the vacation folder. Give the agent the project’s home, rather than opening one file at a time.

You can also organize work into projects in the Claude and Codex apps and give a working session access to multiple folders. For example, one of my research assistants might have a Codex project for a research study that brings together:

- A **Dropbox folder** for project management and writing.
- A **local GitHub repository folder** for code.
- A **Box folder** for data.

Those folders can stay where they are. Add their locally available folders to the same project or session so the agent can work across them.

=== "Claude"

    Start a local Code session and select your project folder below the message box. To add another folder during the session, use **+ → Add folder**. You can also save a multi-folder environment for later sessions. See [Claude’s folder controls](https://code.claude.com/docs/en/desktop#add-folders-to-a-session) for details.

=== "Codex"

    Add a local project and attach its folder. Use **Edit project → Add folder** to attach more folders, and **Make primary** to choose where new chats start. Start a new chat inside that project. See [Projects and chats](https://learn.chatgpt.com/docs/projects) for the current controls.

<label class="step-done"><input type="checkbox"> I’ve opened my project and attached its working folders.</label>

<a id="6-ask-it-to-read-the-files-and-propose-one-small-task"></a>
### 5. Tell it what you need and let it ask questions

Explain the result you want, the decision you need to make, and your constraints. Point to the relevant files. Then have it grill you about the information it still needs. You can dictate this in whatever order it comes to you.

Not sure what type of task to start with? Here are a few ideas: [plan a family vacation](../workflows/life/vacation.md), [organize your health and fitness](../workflows/life/health.md), [compare options for a household purchase](../workflows/life/shopping.md), [prepare for a meeting and draft the follow-up](../workflows/meeting-workflow.md), [catch up on a research or work project](../workflows/project-management.md), or [review your week and decide what to tackle next](../workflows/weekly-review.md).

Here are two examples of how to ask. Use the one closer to your work, or substitute your own task.

=== "A funder presentation"

    ```text
    I need help building a slide deck for a funder. My initial rough thoughts, figures, and earlier proposals are scattered throughout this folder. My previous correspondence with them is in Gmail. The slide deck should be about 20 slides. Read the relevant material and help me think through what the right structure and flow would be. Is there any other information you need from me, or that we need to gather? Ask me the questions that would change your recommendation. Once you’ve suggested a rough flow, you can take the first pass at building it in PowerPoint.
    ```

=== "A family trip"

    ```text
    Help me plan a family trip. Start with the general notes in this folder about my typical budgets and what we like doing. The whole family is coming and we’re thinking about going sometime in August, but our dates are flexible. Before we start searching options, ask what else you need to know about us. Help me compare a few realistic options and decide which trade-offs matter.
    ```

For either task, the first exchange helps the agent understand the job. It should come back with questions, an approach, or an initial piece of work you can react to.

For the highest quality work, I use a council of agents to approach the job independently, then synthesize the dominant approaches. You can read more in [the council guide](occasional.md), the second step in the starter guide.

<label class="step-done"><input type="checkbox"> I’ve explained a meaningful task and supplied the context it needs.</label>

<a id="7-read-the-plan"></a>
<a id="8-let-it-work"></a>
<a id="9-review-the-work"></a>
### 6. Work back and forth

Some people plan and execute. Other people iterate back and forth. Either way, get used to having the conversation. You supply information, answer questions, read what the agent produces, and give it another direction.

If the proposed flow for the funder deck is unclear, ask:

```text
Walk me through the story you’re proposing for this deck. What should the funder understand by the end, and what are we asking them to support? Use our previous correspondence to explain why you chose this emphasis. What’s missing before you build the slides?
```

When it produces a draft, **tell it what you don’t like and what you do like**. Be specific about what needs to change. For the funder deck:

```text
The opening is too abstract. Start with the problem the funder cares about and move the background later. Keep the results figure, but simplify the labels and explain the takeaway in the slide title. Use our latest email exchange to make the funding ask more concrete. Revise the PowerPoint and keep it to about 20 slides.
```

Open the PowerPoint itself. Look at the flow, figures, and slide layouts. Ask about anything you do not understand, and go back and forth until you have a deck you’re happy with.

<label class="step-done"><input type="checkbox"> I’ve given feedback, inspected the revised work and checked the important claims.</label>

<a id="10-write-a-handoff"></a>
### 7. Save where you landed

Make the second session easy to start. Before you finish, ask:

```text
Save the work in this project folder and write HANDOFF.md with the current status, decisions, links to the files, unresolved questions and next step. Show me where you saved it.
```

Open the handoff. Tomorrow, return to the same project and ask the agent to **read HANDOFF.md and pick up where we left off**. Correct anything that changed since you last worked on it.

<label class="step-done"><input type="checkbox"> The work and a useful handoff are saved in my project.</label>

</div>

## Before you use this on real work

Keeping files on your computer does not mean everything happens there. Content the agent reads may be sent to its provider or a connected service to do the work. Use your organization’s approved setup for restricted records. For more detail, read [how the data flows](../tax-workflow/before-you-start/privacy-and-setup.md).

<a id="what-to-try-next"></a>
