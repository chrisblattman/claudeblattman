---
title: Set up a project for AI collaboration
description: Give your projects a consistent folder structure so you and your agents know where to find sources, save work, and pick up next time.
---

# Set up a project for AI collaboration

Your agent works better when it knows where to find things. I try to give my projects a consistent folder structure, whether I'm working on research, a personal project, or my AI setup. Background research goes in a predictable place. So do drafts, meeting transcripts, and the results of councils and reviews. That saves me from explaining where to look and where to put the next file every time I start a session.

When I start a project, I initialize a few of those folders, even if they're empty. I don't need the whole structure on day one. Some skills create their own folders when I first use them. But choosing a few destinations early helps keep the project organized before it gets out of hand.

I use Dropbox, but the same approach works with OneDrive, Box, or folders stored locally on your computer. Use the storage you and your collaborators already work with.

**Already have a project folder, but it's a mess?** Start with [Clean up an existing project](clean-up-project.md).

## What a structured project looks like { #4-use-a-structure-people-can-understand }

Here is a starting point. You can change the names. The useful part is knowing what belongs where.

```text
My project/
├── PROJECT_INDEX.md       Where material lives and which versions are current
├── PROJECT_STATUS.md      Current overview and next actions
├── AGENTS.md / CLAUDE.md  Standing instructions for the agents you use
├── research/              Background research, reports, and source notes
├── council/               Prompts, independent reports, and synthesis
├── drafts/                The work you are developing
└── transcripts/           Project meeting transcripts
```

You might start with `drafts/` and `research/`, and add `transcripts/` if the project involves meetings. A folder for council runs can wait until your first run. The index can also point to material elsewhere: a shared Google Doc, a team's data folder, or a code repository on GitHub. They don't all have to move into this folder.

A research project might look like this, with the AI work collected under `10_AI_Collaboration/`:

```text
Research project/
├── 01_Paper/
├── 02_Presentations/
├── 03_Literature/
├── 04_Referee_Reports/
├── 05_Submissions/
├── 06_IRB/
├── 10_AI_Collaboration/
│   ├── PROJECT_INDEX.md
│   ├── TODO.md
│   ├── research/
│   ├── council/
│   ├── Transcripts/
│   ├── Weekly_Reviews/
│   └── Dashboard_Archive/
└── …                      Other project folders as needed
```

Use the parts that fit your project. A paper might need referee reports and submissions but no IRB folder. Data, code, and fieldwork material can stay in the locations your team already uses. The numbers aren't important enough to rename a shared folder that already works.

The structure becomes useful when your skills follow it:

- **Research:** use `research/` for reports from `/research-council` and `/deep-research`. In the research-project example above, that means `10_AI_Collaboration/research/`. Have the setup agent check where your installed skills save their work and adjust their destinations to match.
- **Councils and reviews:** `/council` and `/adversarial-review` save the prompt, reports, and synthesis together. For a research project, I'd put these in `10_AI_Collaboration/council/` and save that choice in the project's `CLAUDE.md` and, if you use Codex, `AGENTS.md`. Then you don't have to repeat the destination every time. A project instruction can say: “Save `/council` and `/adversarial-review` runs in dated folders under `10_AI_Collaboration/council/`, relative to this project's root.”
- **Meetings:** I have a script that maps Granola folders to project folders and files transcripts there. You can [set up transcript filing](../hyperlinks/granola.md#file-every-transcript-where-the-agent-can-find-it) and later schedule it. You'll choose the transcript destination during project setup, and then set up the recurring task separately.

Setting this up will help you and your agents find past work, and give your skills a consistent place to save new work.

<div class="checklist" markdown>

## 1. Install `/setup-project-management`

My [`/setup-project-management`](https://github.com/chrisblattman/claudeblattman/tree/main/skills/setup-project-management) skill walks you through choosing a structure and getting the project set up. It's separate from the starter kit. If you haven't installed it, give your agent the link and ask it to install the skill for your app.

<label class="step-done"><input type="checkbox"> I've installed `/setup-project-management`.</label>

## 2. Set up your project { #build-your-first-file }

Open the project folder in your agent and ask:

```text
Use /setup-project-management to set up this project. My personal projects
might be set up differently than what this skill expects, so please keep
track of our structural choices so that we can tailor this skill to my own
projects when we are done.
```

Your projects may look different from mine, so expect some back-and-forth the first time. Tell the agent which folders you need, what you call them, and where existing work should stay. Look over its proposed structure together before it creates anything.

<label class="step-done"><input type="checkbox"> The project has the folders I want, and its instructions say where each skill should save its work.</label>

## 3. Adapt the skill for your next project

Once you've worked through the first setup, use those choices to improve your own copy of `/setup-project-management`. You shouldn't have to explain the same folder preferences again next time.

```text
Now help me adapt my copy of /setup-project-management using the structural
choices we made. Make my folder names and output destinations the defaults
for future projects, with options for different kinds of projects. Keep this
project's people, current status, and one-off decisions out of the skill.
Show me what you changed.
```

<label class="step-done"><input type="checkbox"> I've adapted the skill to my preferences, or kept its defaults because they fit.</label>

</div>

Next: [Build a project dashboard](project-management.md) if you want a shared view of the project's progress and decisions.
