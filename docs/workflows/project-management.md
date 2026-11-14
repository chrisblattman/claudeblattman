---
description: Give your project a current research design and a dashboard for meetings, decisions, and unfinished work.
---

# Build and maintain a project dashboard

Every research project should have a document that says what the project is. I think of this as its ground truth: the big questions, the literature we're building on, and the details of the research design. When we need to write an IRB application or a proposal, it should have all the raw ingredients there. It also helps train the agent on what we're doing.

Alongside that, I want a dashboard I can read before a meeting so I can come in prepped. What needs a decision? What did we say we'd do last time? What hasn't happened? I've found these useful, and they help steer a meeting.

I've settled on using two tabs in a Google Doc for these jobs. Tab 1 is the dashboard and meeting log. Tab 2 is the research design. **Tab 1 works better when it has Tab 2 to guide it.** The design tells the agent what matters, so it can do more than summarize whatever came up in the last meeting. Tab 2 is also essential for writing the IRB application, grant proposals, and the pre-specification document.

I like Google Docs because it's easy to share with my team, I can use visual cues like green, yellow, and red lights, and I can talk to my agent by leaving comments. You can use local Markdown files instead, or another document type your team already maintains. The useful part is having an agreed account of the project that both people and agents can find.

## 1. Start with the research design

For a research project, I'd want Tab 2 to explain the main hypothesis, why this is an innovation, and how we plan to test it. Include the practical details too: the intervention, sample, measures, and analysis. The [research-design example](examples/research-design-example.md) shows one possible structure. For a personal or professional project, call this the project plan and adapt the sections to the work.

The bulk of this work is likely to be more human than agent driven, but that's part of the point. It's a helpful commitment device: writing the design forces me to think strategically about the project.

I think about three kinds of projects:

- **New projects, where we're writing the first proposals.** There may be little to collect yet. Work through the big questions with the agent and use the design document to record where you land. This is where I've seen a big payoff: the thinking you do here feeds the first proposals and gives later AI work something to build on.
- **Projects in flux.** Meetings and new drafts may have moved the project beyond the old design. Have the agent compare them and show you what has changed. Spend your time on the unresolved choices and update the design as you settle them.
- **Projects that haven't changed much.** Some updates are mechanical: another cohort, revised numbers, a completed stage. Then take a strategic look. Does the current paper or proposal explain the project better than the old design document? Bring that thinking back into the design so the next draft starts from it.

I'd revisit the research design roughly every six months for an established project, but potentially every other week for a nascent one. A new proposal or a substantial change is another reason to return to it. The dashboard (Tab 1) changes more often, ideally after every meeting.

## 2. Install `/setup-project-management`

My [`/setup-project-management`](https://github.com/chrisblattman/claudeblattman/tree/main/skills/setup-project-management) skill can help you put this together. If you used it to organize the project folder, you already have it.

??? note "Need to install the skill?"

    Ask your agent:

    ```text
    Find and install the setup-project-management skill from the claudeblattman GitHub repository. Install the entire folder, containing any references, templates, and the SKILL.md file. Put it where I store all my other skills.
    ```

## 3. Build the two tabs with your agent

Open a session in your project. Ask for help building the first iteration of the project or research design document. Working in the project will guide your agent on what resources and documents to draw from, including your meeting transcripts. You can also point it to early emails where you worked out what the project was for.

Adding `dashboard` to `/setup-project-management` tells the agent you want help creating or editing Tab 1 or Tab 2, without going through the full project-folder setup (assuming you've already set this up).

```text
/setup-project-management dashboard

Help me build a dashboard for this project. Read the material in [project folder] and these other sources: [links or locations]. The project is [new / changing substantially / fairly stable].

Start with Tab 2, the research design. Use what we've already written and our meeting discussions to explain the big question, the literature we're building on, why this is an innovation, and the details of the design. Show me where our recent discussions or drafts differ from the existing plan. Work through the important gaps and decisions with me.

Then draft Tab 1, Overview & Meeting Log. Use the design to help identify our priorities, decisions needed, and next actions. Keep a dated history of meetings and changes below the current dashboard, and leave a place for our notes and corrections.

Use [existing Google Doc link / a new Google Doc / local files in this folder]. Link to the sources so we can check it. Add the [Google Doc] link to PROJECT_INDEX.md so we always know where to find the dashboard.
```

The agent should walk you through the missing pieces. For a new project, expect more back-and-forth about the design. You'll likely need to write the majority of the document by hand.

## 4. Iterate and rewrite the project design document

Spend time getting Tab 2 right. Read the draft, rewrite the argument, and work through the gaps. The agent can help organize the material and identify inconsistencies, but you need to decide what you're trying to learn, how you'll learn it, and what story you want to present.

This document feeds into so many of my proposals and reports that spending a few hours getting it right pays off quickly. By the time I've sent off two proposals, or even one proposal and the IRB application, I've already reused that work.

Once you've revised the design, ask the agent to check whether Tab 1 needs any changes. Usually it shouldn't change much. Rewriting the argument in Tab 2 doesn't necessarily change the tasks or decisions on the dashboard.

```text
Make any revisions to Tab 1 as needed based on my revisions to Tab 2.
```

## 5. Use them { #4-use-it-to-prepare-for-the-next-meeting }

Use Tab 2 when you need to write about the project. Give the agent the design document along with the funder's requirements, and it has the substance to work from. Read the [`/proposal-write` instructions](https://github.com/chrisblattman/claudeblattman/tree/main/skills/proposal-write) for how I use this material to draft proposals.

Tab 1 serves two purposes. After a meeting, I read it to see what's on my plate, what's on my collaborators' plates, and whether I'm the bottleneck for anything. It's essentially a to-do list.

Before the next meeting, I read it again. It helps me arrive with the right strategic agenda and remember the tasks I asked people to do.

<span id="6-during-the-meeting-give-the-agent-updates"></span>
<span id="7-after-the-meeting-refresh-the-dashboard"></span>

Next: [Refresh your dashboard](weekly-review.md) explains how to leave updates during a meeting, refresh the tabs afterward, and automate the review.
