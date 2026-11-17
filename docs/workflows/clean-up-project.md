---
description: Recover useful work, resolve competing drafts, and bring scattered project documents into one working folder.
---

# Clean up an existing project

Let's say you already have a project folder, but it's a mess. Maybe several people have been adding to it for years. Maybe you let an AI loose before you had a good place for everything. I'd set aside a few hours to sort it out: recover the useful work, archive abandoned drafts, and give the project a structure your agent can follow when it files something or looks for an earlier decision.

In a lot of cases, the work might be spread across several folders or cloud services. Documents you made with Claude might be in one place, work from Codex in another, and code in GitHub. You can bring the project documents together while leaving the code where it belongs.

**Starting a new project?** Use [Set up a project for AI collaboration](organize-projects.md) instead.

## 1. Have the agent inspect what you already have

My [`/setup-project-management`](https://github.com/chrisblattman/claudeblattman/tree/main/skills/setup-project-management) skill helps establish a project's folders, instructions, and record of where things live. It can also help you sort out an existing project.

??? note "Need to install the skill?"

    Ask your agent:

    ```text
    Find and install the setup-project-management skill from the claudeblattman github repository. Install the entire folder, containing any references, templates, and the SKILL.md file. Put it where I store all my other skills.
    ```

Give it every relevant location for this project. You can enter `discover` mode to have it inspect the files and report what it finds without creating or changing anything. Ordinary setup goes on to create the folders and documents you've agreed on. For a cleanup, pause at discovery so you can decide which work is worth carrying forward:

```text
/setup-project-management discover

Help me recover and organize this project. Its documents are spread across:
- I did some of the work in Claude, in a project called [project name].
- I also worked on it in Codex, in a project called [project name].
- Some of it is scattered across loose files in [Google Drive, OneDrive, etc.].
- [path or link to any other folder or shared document for this project]

The code is in GitHub, and I store the local copy here: [path]. I want the project documents together in [cloud storage, e.g. Dropbox], but the code needs to stay in GitHub. Our new project folder should have an index pointing to the repository and its local copy.

When you're done, we can decide how to bring everything together properly into one canonical project folder.
```

## 2. Recover work that is still in your AI sessions

To locate an earlier discussion or decision, see [Find past work with Recall](recall.md).

If you've done a lot of work in AI sessions but haven't saved local documentation, ask the agent to collect it. Open a new session in the project in Claude or Codex. If you used both, do this in each one:

```text
I want you to comb through all of our sessions in this project that you can access. Read the work we've done, the decisions we've made, open questions and next steps, and any other relevant information. Collate it into a single [agent]_handoff.md document. It's going to inform our new canonical project folder.

Include links or dates for the sessions you used, distinguish agreed decisions from ideas we only discussed, and tell me which sessions you couldn't read. Save the document in [folder], or give me the complete text to save there if you can't write a local file.
```

!!! note "Worked on more than one device?"

    If your agent is reading locally stored session history, it can only read the transcripts available on that device. If you've worked across multiple devices, it may be worth repeating this process on each one. Cloud or synced sessions may already be available elsewhere.

Repeat with the other agent if you worked there too, then give the handoffs to the agent doing the cleanup.

## 3. Work through what to keep { #2-work-through-what-to-keep }

This is where I'd spend most of the time. A tidy folder is little help if it contains the wrong draft. Have the agent turn its findings into a short list of decisions, starting with the work you intend to pick up next. You shouldn't have to read an inventory of every file to find the three that disagree.

Continue in the cleanup conversation. Have the agent compare the handoffs with the files it found, since a handoff may describe a plan you later abandoned:

```text
Using your discovery findings and any handoffs I've provided, help me decide what to keep. Group files that cover the same piece of work, even if their names differ. Separate exact duplicates from drafts with different content.

For each group, show the source paths, the differences that matter, which version you recommend working from, and the evidence for that recommendation.

Propose what to keep as current, what needs merging, what can be archived, and what should stay elsewhere with a link. Put anything you can't resolve on a separate list. Don't reorganize files yet.

First, I'd like to see your proposed file tree. Then, walk me through the unresolved choices one at a time.
```

Have the agent show the relevant passages when a summary isn't enough. If you can't decide yet, leave both versions in place and record the question. It's also fine to tell the agent you want to keep all versions. I do this with slide decks that change a slide or two over the course of a project. I keep the versions but put a date in each filename so I can see which is the most recent.

Old task lists need some judgment too. You may have talked about doing something, changed your mind, or already finished it. Ask the agent to flag those uncertainties so you can correct the list before it carries old tasks into the new folder.

## 4. Bring the project together { #3-choose-one-home-for-the-project-documents }

<span id="4-run-setup-with-the-decisions-youve-made"></span>

Once you're happy with the project file structure, decide where you want to store your one project folder. I use Dropbox, but a local folder or one synced through OneDrive or Box would do the same thing. Choose a location the people working on the project can use.

In the same conversation, use `/setup-project-management` without `discover` to apply your decisions:

```text
/setup-project-management

Use these findings and the decisions I've made to set up the unified project folder at [desired location, e.g. Dropbox/Active Research/Project-A].

Move the actual files rather than making copies. Leave the code in GitHub and keep its local copy where it is. If a file can't be moved or the destination already contains a file with the same name, ask me how to handle it.

Keep a migration log of all the files you've moved and renamed, including their old and new locations. If there was a decision we worked through, note that too.

Then create the project index. Identify the current drafts and link to the GitHub repository, its local copy, and anything else we've chosen to leave elsewhere. Update links affected by the moves and the project instructions so future sessions know where to find things.
```
