---
description: Refresh the dashboard after each meeting using your comments and the transcript, then review proposed changes to the research design.
---

# Refresh your project dashboard

After a meeting, I want a current account of what we agreed to do. What's on my plate, what's on my collaborators' plates, and am I the bottleneck for anything? Then, before the next meeting, I want to read that same dashboard and arrive with the right strategic agenda.

I use `/weekly-review` to keep this cycle going across all my projects. It reads the comments I've left in the Google Doc and the meeting transcript, updates the dashboard, and suggests changes to the research design.

The [setup page](project-management.md) explains the two tabs: Tab 1 is the dashboard and meeting log, and Tab 2 is the research design. You can call the tabs whatever you like. I name them Overview and Research Design, respectively. The first should change after each meeting. The second takes more thought from me and my collaborators, since it feeds our proposals, IRB applications, and pre-specification documents.

If you haven't read the build guide, you should at least start with [step 5, Use them](project-management.md#4-use-it-to-prepare-for-the-next-meeting), for context on how I use both tabs.

## 1. During the meeting, give the agent updates

One reason I like Google Docs is that I can leave comments while we're meeting. I tell the agent what's been handled, what the next open question is, or which table or statistic I want to see at the next meeting. Put the comment beside the relevant item so it has the context.

These comments give the agent my corrections and priorities to use in the next refresh. Leaving a comment doesn't itself run the agent. It reads them when I ask it to update the document, or when the scheduled review runs.

## 2. After the meeting, refresh the dashboard

After the meeting, ask the agent to:

1. Refresh the dashboard using the comments you left in the Doc.
2. Update it using the meeting transcript.
3. Suggest changes to the research design based on the decisions and discussions from the meeting.

You can ask for all three in plain language:

```text
Read my comments in the dashboard and today's meeting transcript. Use both to update Tab 1.

Then suggest any changes we should make to Tab 2 based on our decisions and discussions. I want to review those suggestions before you change the design document.
```

I do all three with `/weekly-review`, which I automate to run after the meeting. For example, one of my projects meets every Friday morning, so I run the review automatically every Friday at noon.

## 3. Install `/weekly-review`

The [`/weekly-review`](https://github.com/chrisblattman/claudeblattman/tree/main/skills/weekly-review) skill brings the new material together and updates the project record. You can run it after any meeting. Installing it doesn't create a recurring task. We'll set that up separately below.

??? note "Need to install the skill?"

    Ask your agent:

    ```text
    Find and install the weekly-review skill from the claudeblattman GitHub repository. Install the entire folder, containing any references, templates, and the SKILL.md file. Put it where I store all my other skills.
    ```

There are three ways to run it:

- `/weekly-review` updates the dashboard and meeting history, saves the review record, and suggests changes to the research design for you to review. This is the ordinary workflow.
- `/weekly-review nosave` does the same review and can still update the Google Doc, but skips the local summary file. It still keeps the records needed to check the update and avoid repeating it.
- `/weekly-review nochange` shows the proposed dashboard, meeting history, and design changes in the chat without changing or saving anything.

### What the review reads

The review starts with the existing dashboard, your comments, and the research design. Then it looks for what's happened since the last successful review. On a first run, it uses the past week unless you ask for a different period.

The sources depend on what you've connected and saved in the project's configuration:

- **Meeting transcripts.** It reads the project's saved transcripts or retrieves them from the selected Granola meetings. In my own setup, a helper fetches new transcripts from the project's Granola folder and files them locally, usually under `10_AI_Collaboration/Transcripts/`. Once the review is finished, processed transcripts move into `archive/` inside that folder. They remain available to read later. The public skill leaves source transcripts in place and doesn't include that filing and archiving helper. To set up local transcript filing, follow the [transcript guide](../hyperlinks/granola.md#file-every-transcript-where-the-agent-can-find-it).
- **Email.** With email connected, it uses the saved collaborator addresses and project keywords to find relevant messages to and from the team during the review period. A weekly run normally covers the past week. An email from a collaborator about a different project doesn't belong in this review.
- **Other project material.** It reads the sources you've included, such as a revised proposal, working paper, shared notes, or messages from a project WhatsApp group if your agent has access. It also checks the previous dashboard snapshot, when available, to see what you've corrected directly.

These locations and search details belong in the saved project configuration. `PROJECT_INDEX.md` supplies links when the configuration is missing something. You shouldn't have to explain where everything lives each week. If the agent can't read a source, it should tell you.

## 4. Tell it which project to review

You should be able to name the project and let the agent find the right documents. It first looks for the project's configuration: the saved directions to the dashboard, the design document, and the sources it should read. If those directions are complete, it can go straight to work. Otherwise, it checks `PROJECT_INDEX.md` for the missing links. It asks you when it still can't find what it needs or finds conflicting destinations.

If you used `/setup-project-management` to set up the dashboard, the agent prepares this configuration for you. You don't need to write JSON or look up document IDs yourself. New setups use `PROJECT_CONFIG.json`. If that doesn't work or you don't have one, giving `/weekly-review` the link to your Google Doc usually does the trick. Or ask your agent to find the document in your Drive for you.

The agent should reuse the sources recorded during setup and ask only for what's missing. If you add a new source later, have it save that location for future reviews.

Check that your agent can read the Doc's comments as well as its text. If it can't, ask it to help you get that connection set up. Being able to leave a comment where you're already working is what makes this easy to keep doing.

## 5. Run the review

Once the project is set up and you've given the agent permission to update the dashboard, just name it:

```text
/weekly-review Gang entry project
```

The review produces:

1. The updated Tab 1 dashboard.
2. A dated entry in the meeting history.
3. Suggested Tab 2 changes, with the reasons and sources behind them.

Look over the result and correct anything it misunderstood. For example: “We discussed postponing this, but we didn't decide to. Keep the original deadline.” An outstanding task should stay on the dashboard until it's completed or you've decided to drop it, even if nobody mentioned it this week.

The agent should preserve your notes and earlier history, check the result, and then record the successful refresh.

Glance at Tab 1 afterward to see what you need to do. Read it more thoroughly before the next meeting to decide what deserves the team's attention.

## 6. Work through the suggested design changes

Every review compares the new discussions and decisions with Tab 2. For each suggested edit, the agent should show what the design currently says, the proposed replacement or addition, and the dated source behind it. It should also distinguish something we agreed from an idea we only discussed.

If it finds no supported changes, or couldn't read the design or an essential source, it should say so.

Review the specific suggestions before the agent edits Tab 2. Permission to update the dashboard, including on a schedule, doesn't give it permission to rewrite the design. You don't need to rewrite the design every time. For an established project, I'd revisit it roughly every six months, or before a new proposal. For a nascent project, every other week may make more sense. Or a substantial change in direction is a reason to spend time on it.

The review has already done the comparison. Start with its suggestions and work through the choices that need your judgment. The bulk of the thinking here belongs to you and your collaborators. Treat this as a chance to revisit the project strategically. Rewrite the parts that no longer explain what you're doing, and give the agent your decisions.

Once you've agreed on the changes, ask:

```text
Update Tab 2 with the specific changes we've agreed on.

When you're done revising Tab 2, make any necessary changes to Tab 1 to reflect the new decisions.
```

## 7. Schedule it for after your meeting

Once the review works, schedule it for after your recurring meeting. You have two options:

- **Set it up in the app.** Open the scheduled-tasks section and create a recurring task with the project name, `/weekly-review`, and the time you want it to run. See the scheduling instructions for [Codex](https://developers.openai.com/codex/app/automations) or [Claude](https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork).
- **Ask your agent to set it up.** Give it the project, day, time, and timezone, as in the prompt below.

Either way, the task should appear in your app's scheduled-tasks section, where you can check or change it.

```text
Schedule /weekly-review for [project name] every Friday at noon in [timezone].
```

The skill supplies the instructions. Your app or another scheduler runs them, using a document connection that can read the comments and update the right tab. Try the first automatic write in a copy of the Doc, including a correction you've made yourself, before letting it update the shared one.

Check the first scheduled result. It should tell you what you need to do after this meeting and give you a useful starting point for the next one.
