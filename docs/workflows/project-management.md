---
description: Write a project description you can reuse in proposals and reports, and a dashboard for progress and meetings.
---

# Create your project description and dashboard { #build-and-maintain-a-project-dashboard }

!!! note "Project management skills are being updated"

    We’re updating the project setup skill to work with the project description and dashboard described on this site. You can use the prompts below now; the reusable skill is being refreshed.

Every project should have a document that says what you're trying to do, how you plan to do it, and why. I think of this as its ground truth: the account you've agreed on and keep updating as the work changes. Alongside it, I want a dashboard that tells me where things stand and what needs my attention.

I use these documents for three jobs:

- **Keep the project moving.** See what's on my plate, what my collaborators are doing, and what needs a decision.
- **Write about the project.** Start a proposal, report, or IRB application with the substance already in one place.
- **Prepare for meetings and follow up.** Come in prepped, remember what we said we'd do, and leave with a record of what we decided.

I've settled on using two tabs in a Google Doc. Tab 1 is the dashboard and meeting log. Tab 2 is the project description. In my research projects, I call it the research design: the big questions, the literature we're building on, and the details of how we'll answer them. For another kind of project, it might be a plan for a training program or a new service.

**Tab 1 works better when it has Tab 2 to guide it.** The description tells the agent what matters, so it can do more than summarize whatever came up in the last meeting.

I like Google Docs because it's easy to share with my team, I can use visual cues like green, yellow, and red lights, and I can talk to my agent by leaving comments. You can use local Markdown files instead, or another document type your team already maintains. The useful part is having an agreed account of the project that both people and agents can find.

## 1. Start with the project description { #1-start-with-the-research-design }

Start with what you already have: a proposal, a brief, or notes from the discussions that got the project going. You can try this before setting up the folders or installing a skill:

```text
Read [proposal, brief, or project notes]. Help me turn this into a current description of the project: what we're trying to do, how we plan to do it, and the decisions we've made. Show me what's missing or contradictory, and work through those questions with me.
```

For a research project, I'd want the description to explain the main hypothesis, why this is an innovation, and how we plan to test it. Include the practical details too: the intervention, sample, measures, and analysis. The example below is a simpler project plan for a training-program pilot. A research design would need those additional details.

<span id="example-project-plan"></span>

??? example "Example: Tab 2 — the project plan"

    This is Tab 2 for a fictional training-program pilot. All names, dates, and facts are invented. It illustrates a project plan, not a validated research protocol.

    **Last reviewed:** June 10, 2026.

    **Question and purpose**

    Can the team deliver a short workshop and collect useful participant feedback before investing in a larger program?

    **Current approach**

    Run a small feasibility pilot. Observe delivery problems, collect feedback, and record which parts need revision. The pilot is intended to improve the program and the team's procedures; it is not designed to establish a causal effect on participants' later outcomes.

    **What we need to learn**

    - Can the workshop fit the available time?
    - Which instructions are confusing?
    - Can the team administer the short feedback survey consistently?
    - What would need to change before expansion?

    **Decisions and rationale**

    | Date | Accepted decision | Reason and source |
    |---|---|---|
    | June 3 | Start with a pilot before expanding. | Test delivery with limited resources; initial project plan. |
    | June 10 | Shorten the pilot and revise the survey accordingly. | Planning discussion identified timing constraints; June 10 meeting note. |

    **Open design questions**

    The final survey items and criteria for expansion remain to be agreed. Keep those as questions rather than filling them with AI-generated decisions.

    **Change log**

    **June 10:** Recorded the accepted shorter-pilot scope and the survey implication. The proposed venue date and corrected participant count remain operational details in Tab 1.

    A routine dashboard refresh should identify a relevant plan change and propose it here. It should not overwrite this tab with a fresh reconstruction every week.

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

Help me build a project description and dashboard for this project. Read the material in [project folder] and these other sources: [links or locations]. The project is [new / changing substantially / fairly stable].

Start with Tab 2, the project description. Use what we've already written and our meeting discussions to explain what we're trying to do, our approach, and the decisions behind it. For a research project, include the big question, the literature we're building on, why this is an innovation, and the details of the research design. Show me where our recent discussions or drafts differ from the existing plan. Work through the important gaps and decisions with me.

Then draft Tab 1, Overview & Meeting Log. Use the design to help identify our priorities, decisions needed, and next actions. Keep a dated history of meetings and changes below the current dashboard, and leave a place for our notes and corrections.

Use [existing Google Doc link / a new Google Doc / local files in this folder]. Link to the sources so we can check it. Add the [Google Doc] link to PROJECT_INDEX.md so we always know where to find the dashboard.
```

The agent should walk you through the missing pieces. For a new project, expect more back-and-forth about the design. You'll likely need to write the majority of the document by hand.

<span id="example-dashboard"></span>

??? example "Example: Tab 1 — the dashboard and meeting log"

    This is Tab 1 for the same fictional Riverside training pilot. It shows what the team needs to do now and keeps a dated record of what changed.

    **Current dashboard**

    ```text
    === PROJECT STATUS DASHBOARD ===
    ```

    **Project:** Riverside training pilot

    **Stage:** Middle — preparing the pilot

    **Last successful refresh:** June 10, 2026

    **Evidence checked:** June 10 planning note; current project plan; team correction.

    **Objective:** Test whether a short workshop is feasible before deciding whether to expand it.

    | Priority | Current status | Next action |
    |---|---|---|
    | Confirm the venue | June 12 is unavailable. June 19 is proposed, not confirmed. | Coordinator to confirm availability; deadline not yet agreed. |
    | Prepare the participant survey | The team accepted a shorter pilot and needs a matching survey. | Revise the survey; owner to confirm. |
    | Check the participant list | Team correction: 36 participants, replacing the earlier count of 40. | Use the corrected count; keep the correction in the history. |

    **Decision needed:** Confirm the date before invitations go out.

    **Plan change:** The shorter pilot has been accepted. The corresponding change in [Tab 2](#example-project-plan) is recorded separately with its rationale.

    **Source coverage:** Selected local notes and the project plan. Email and calendar were not searched, so this dashboard does not independently verify venue availability.

    ```text
    === DASHBOARD END ===
    ```

    **Human notes and corrections**

    This area stays outside the replaced dashboard. A teammate can add a correction here or edit the dashboard directly; the next refresh must read both.

    > June 10: The current participant count is 36. The previous list included four people who withdrew.

    ```text
    === WEEKLY SUMMARIES START ===
    ```

    **June 10 update**

    **Review ID:** riverside-2026-06-10-planning-note

    **Changes:** June 12 marked unavailable; June 19 retained as a proposal. Participant count corrected. Shorter-pilot decision recorded, with the matching plan change tracked in Tab 2. Survey revision has no assigned owner yet.

    **Sources:** `meetings/2026-06-10.md`; team correction in this Doc; `drafts/project-plan.md`. These are illustrative paths, not downloadable source files.

    **June 3 update**

    **Changes:** June 12 was the provisional workshop date; the working participant count was 40. Venue confirmation and survey preparation remained open.

    **What the next refresh should do**

    Preserve the corrected count and outstanding actions unless new evidence supersedes them. Keep the June 19 date provisional until confirmed. Retain both dated entries, and avoid duplicating the June 10 entry on a retry. Update the research plan only when a substantive change has been agreed.

## 4. Iterate and rewrite the project description { #4-iterate-and-rewrite-the-project-design-document }

Spend time getting Tab 2 right. Read the draft, rewrite the argument, and work through the gaps. The agent can help organize the material and identify inconsistencies, but you need to decide what you're trying to learn, how you'll learn it, and what story you want to present.

This document feeds into so many of my proposals and reports that spending a few hours getting it right pays off quickly. By the time I've sent off two proposals, or even one proposal and the IRB application, I've already reused that work.

Once you've revised the design, ask the agent to check whether Tab 1 needs any changes. Usually it shouldn't change much. Rewriting the argument in Tab 2 doesn't necessarily change the tasks or decisions on the dashboard.

```text
Make any revisions to Tab 1 as needed based on my revisions to Tab 2.
```

## 5. Put both documents to work { #4-use-it-to-prepare-for-the-next-meeting }

### Keep track of progress

After a meeting, I read Tab 1 to see what's on my plate, what's on my collaborators' plates, and whether I'm the bottleneck for anything. It's essentially a to-do list. Correct anything the agent misunderstood, and leave a comment when a task is finished or a priority changes.

[Refresh your dashboard](weekly-review.md) explains how to use those comments and the meeting transcript to keep it current. The review also suggests changes to Tab 2 when a decision changes the underlying plan.

### Write proposals, reports, and IRB applications

Use Tab 2 when you need to write about the project. Give the agent the description and the requirements of the document you're writing. For a progress report, include the dashboard and recent results too. Ask it to identify missing information before drafting. A funder may need a budget or an institution may need details about consent that your description doesn't yet contain.

```text
Use our project description in [document] to help draft [proposal, report, or IRB application]. Read the requirements in [file or link] and any relevant results in [folder].

Show me which parts we can write from this material and what information is still missing. Work through the gaps with me, then draft the document.
```

The [`/proposal-write` instructions](https://github.com/chrisblattman/claudeblattman/tree/main/skills/proposal-write) describe a fuller proposal-writing workflow. If the writing helps you explain the project better, bring that thinking back into Tab 2 so the next draft benefits from it.

### Prepare for the next meeting

Before the next meeting, I read Tab 1 again. It helps me arrive with the right strategic agenda and remember the tasks I asked people to do. If we're reconsidering the approach, I want Tab 2 in front of us too.

[Prepare for and follow up on meetings](meeting-workflow.md) shows how to ask for a briefing, capture decisions, and draft a follow-up when you need one. Its reusable meeting skills still need setup updates, but you can try the plain-language prompts now with the project material your agent can read.

<span id="6-during-the-meeting-give-the-agent-updates"></span>
<span id="7-after-the-meeting-refresh-the-dashboard"></span>

Next: [Refresh your dashboard and project description](weekly-review.md).
