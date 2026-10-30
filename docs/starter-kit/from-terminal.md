---
description: Use your AI's desktop app to see your work, point at changes, work in Chrome, and manage your projects. Ask your agent to show you how.
---

# Switch to the desktop app

If you're still doing all your AI work in a terminal, switch to the desktop app. For the kind of work on this site, I'd treat it as essential. Being able to see what the agent made, point at what you want changed, and work in the same browser makes a huge difference to the back-and-forth.

Much of this is possible from a terminal too. What I prefer about the desktop apps is having the conversation, the work, and the controls together—and managing several sessions in one working window. It makes it easier to see what's happening, switch between tasks, and give useful feedback.

**Once again, ask your AI to walk you through it.** Open the app in a project you're already working on and try:

```text
Help me use the desktop app for this project. Show me the work beside our conversation, explain how I can give you feedback on it, and walk me through the features on claudeblattman.com/starter-kit/from-terminal/ that would help with this task.
```

The rest of this page gives you a few things to try as you work. I prefer Codex's preview and feedback interface right now, but most of these habits work in both Claude and Codex. You don't need to learn every feature before getting started.

## 1. Manage multiple sessions in one working window {#9-sort-pin-and-rename-your-conversations}

**Keep several sessions going in one working window.** Have one agent work on your slide deck while another investigates a question and a third revises a document. The sidebar keeps those conversations together: switch to the one that needs your attention, give it feedback, then return to another while it works. For me, this is one of the biggest conveniences of the desktop apps.

**Rename your chats so they mean something to you.** In Codex, double-click the session title in the left sidebar to rename it. In Claude, open the session and click its title in the title bar. You can also ask the agent to rename the chat. “Funder deck — revise opening” or “August trip — compare options” gives your brain a useful signpost when you return to the list.

Group conversations by project, pin the ones you keep returning to, and use the sorting options to find recent work. Arrange the sidebar around the way you work.

You can run multiple sessions and rename them in a terminal too. What I like here is how easy it is to manage them together in a single window. See [Codex projects and chats](https://learn.chatgpt.com/docs/projects) or [Claude's parallel sessions](https://code.claude.com/docs/en/desktop#work-in-parallel-with-sessions) for the controls in your app.

## 2. Pick up the same session on another device {#9-pick-up-the-same-session-on-another-device}

**Being able to pick up the same work from any of my computers is a big advantage.** I move between my laptop, my always-on computer at home, and my office desktop. With them connected, I can find and continue my sessions from whichever device I'm using. I don't have to remember which machine I was sitting at when I started.

Both Claude and Codex support this. Once you've enabled remote access and connected the relevant devices, the apps make it easy to find a session, check its progress, and continue the conversation. The work still runs on its host computer, so that machine needs to stay awake and online with the agent running. That's one reason an always-on home computer is useful: I can close my laptop while work continues there.

```text
Help me connect my devices so I can find and continue my sessions from my other computers. Walk me through the setup, explain where the work will run, and tell me which computer needs to stay on.
```

Claude can also connect terminal sessions through Remote Control. The desktop advantage is having the sessions and their controls together in the app. See [Claude's cross-device sessions](https://code.claude.com/docs/en/desktop#control-which-sessions-appear-on-your-other-devices) and [Codex's remote connections](https://learn.chatgpt.com/docs/remote-connections).

<details class="council-details" markdown="1">
<summary>Cloud sessions: keep working when your computer is off</summary>

A **cloud session** runs on the provider's computers, so it can continue working even when your own computers are off. Remote access to your home computer still depends on that computer being on; a cloud session doesn't.

In the desktop app, choose a cloud environment when starting the task, instead of a local project. Ask the agent to help set up the files and tools the task needs there. Cloud sessions don't automatically have access to the folders or signed-in apps on your computer.

Both Claude and Codex can also start cloud tasks from the terminal. The convenience here is choosing where the task runs and checking its progress in the app. See [Claude cloud sessions](https://code.claude.com/docs/en/claude-code-on-the-web) and [Codex environments](https://learn.chatgpt.com/docs/environments/modes).

</details>

## 3. Open a webpage beside the conversation {#1-open-a-webpage-beside-the-conversation}

If you're discussing a webpage, ask the agent to open it beside the chat. It could be a site you're reading, a dashboard you're building, or a draft you want to revise. Looking at the page while you discuss it makes the conversation much easier.

```text
Open this page beside our conversation so we can look at it together.
```

<details class="council-details" markdown="1">
<summary>Opening pages and local files</summary>

Both apps have a built-in browser. Click the link the agent gives you, or ask it to open the page. In Claude, keep local files in a folder connected to the project; a file link outside those folders may not open in the app.

See the [Codex browser guide](https://learn.chatgpt.com/docs/browser) or [Claude browser guide](https://code.claude.com/docs/en/desktop#browse-external-sites) for the controls in your app.

</details>

## 4. See the document you're making {#2-see-the-document-youre-making}

**Ask to see the work.** If the agent has made a slide deck, open the slides. If it has made a document, look at the document. You can give much better feedback when you're looking at the result: “This table is unreadable,” “The opening takes too long,” or “Put the funding request earlier.”

```text
Open the draft so I can review it while we talk. If this app can't preview the file, help me open it in the right application.
```

<details class="council-details" markdown="1">
<summary>What can each app preview?</summary>

Codex can preview documents, spreadsheets, presentations, and PDFs beside the chat. Claude can open PDFs and HTML in its browser pane and text files in its file pane. The available viewer depends on the file format.

See [Codex file previews](https://learn.chatgpt.com/docs/artifacts-viewer) or [Claude file panes](https://code.claude.com/docs/en/desktop#open-and-edit-files).

</details>

## 5. Point at exactly what you want changed {#4-point-at-exactly-what-you-want-changed}

In Codex's browser, select **Annotate**, click something or draw a rectangle around it, and leave a comment. “Drop this.” “Make this heading smaller.” “These two paragraphs belong together.” Add several comments, then send them back to the agent in one message.

You shouldn't need to learn the vocabulary of web design to say that a box is too big. **It's also how we're editing this site.** The [browser comments guide](https://learn.chatgpt.com/docs/browser#comment-on-the-page) shows the controls.

In my experience, Claude's feedback tools aren't quite as ubiquitous. You can leave several replies on its messages or a plan, and comment on changed lines in the Git changes view. But I haven't had the same annotation workflow for website or PDF previews. That's a downside for the way I work. I'd bet that gap will narrow as the apps develop.

Claude also has a separate [Docs interface with comments](https://support.claude.com/en/articles/16923645-get-started-with-claude-docs); that is different from annotating a webpage or PDF preview.

In either app, give the agent the whole set of comments, let it make a pass, then look again. Go back and forth until you're happy with the result.

## 6. Keep an eye on the agent’s browser work {#5-let-the-agent-work-in-your-chrome-tabs}

Connect Chrome and the agent can work in the browser you already use, including sites where you're signed in. It can read pages, follow links, click buttons, and fill in forms. Think about the university portal you keep putting off, or the five tabs you opened to compare conference venues.

[Claude can control Chrome from the terminal too](https://code.claude.com/docs/en/chrome), and you can watch it work there. The desktop advantage is the workspace: keep the conversation and browser in view together, follow what the agent is doing, and give feedback as you go. The built-in browser is particularly convenient for this because the page sits beside the chat.

Start by asking it to help with the connection:

```text
Help me connect Chrome so you can work in my open tabs. Do the setup you can, and walk me through anything I need to do myself.
```

Once connected, give it an ordinary task: “Compare the venues in these tabs against our dates, budget, and expected attendance. Put the options in a table in this project.”

For work in desktop applications, Codex on a Mac also offers a small **picture-in-picture preview** during Computer Use, so you can keep an eye on the app it's operating while you work elsewhere. This is a particular Computer Use feature, rather than a preview of every Chrome session; on Windows, Computer Use operates in the foreground. See the [Computer Use guide](https://learn.chatgpt.com/use-cases/use-your-computer-with-codex).

<details class="council-details" markdown="1">
<summary>How to connect Chrome</summary>

In **Codex**, go to **Settings → Computer Use**, install the Chrome extension, and use **@Chrome** in your request. In **Claude**, connect the **Claude in Chrome** extension. Use the Chrome profile where you're signed in to the sites you need.

The browser inside the app has its own login session; it doesn't automatically inherit your Chrome tabs. If you want the agent to work in your existing tabs, say so. For forms, tell it whether you want a draft or a submitted form.

See [Codex's Chrome setup](https://learn.chatgpt.com/docs/chrome-extension) or [Claude's Chrome setup](https://code.claude.com/docs/en/chrome).

</details>

## 7. Review changes in a pane {#6-review-changes-in-a-pane}

When the agent revises a text file, ask it to show you what changed. You can inspect changes in a terminal too; the desktop pane puts the added and removed lines beside the conversation and lets you attach feedback to them. This works for a Markdown document as well as an analysis script.

Try: “Show me the changes you made to this draft so I can review them.” Both apps have a changes view: [Claude's diff view](https://code.claude.com/docs/en/desktop#review-changes-with-diff-view) and [Codex's review pane](https://learn.chatgpt.com/docs/code-review?surface=app).

## 8. Manage your automations in one place {#7-put-recurring-work-on-a-schedule}

When you find yourself asking for the same thing every week, ask the agent to schedule it. Scheduling is possible from a terminal too. What makes the desktop apps useful is having **your scheduled tasks and their results together in one place**. For example:

```text
Every Friday at 3 p.m., review this project's updates and prepare a brief for Monday: decisions made, open questions, and what needs my attention. Save it in this project folder.
```

Open the app's **Scheduled** section to find your automations, adjust their instructions or timing, and inspect previous runs. Open a run's conversation to ask follow-up questions or keep working on its result. Refine the instructions after the first run, just as you would for any other task.

<details class="council-details" markdown="1">
<summary>What needs to stay running?</summary>

For scheduled work running on your computer, leave the app running and the machine awake and online. A task that needs your local files can't work on them while your laptop is asleep. Ask the agent to explain where your scheduled task runs and how to check its results.

See [Codex scheduling](https://learn.chatgpt.com/docs/automations) or [Claude scheduling](https://code.claude.com/docs/en/desktop-scheduled-tasks).

</details>

## 9. Bring several folders into the same project {#8-bring-several-folders-into-the-same-project}

Your project might have drafts in Dropbox, data in a synced Box folder, and code in a local GitHub checkout. Add those folders to the project so the agent can work across them. The files can stay where they are. Terminal agents can use multiple folders too; the app gives you a convenient place to manage them.

Tell the agent where the material lives and ask it to help connect the folders. For example: “This project uses these three folders: [paths]. Help me make all three available in this session.”

<details class="council-details" markdown="1">
<summary>Where to add folders</summary>

In **Codex**, use **Edit project → Add folder**. In **Claude**, add folders to the session or its saved environment. See [Codex projects](https://learn.chatgpt.com/docs/projects) or [Claude's folder instructions](https://code.claude.com/docs/en/desktop#add-folders-to-a-session).

</details>

<span id="3-write-papers-in-the-latex-playground"></span>
<span id="on-my-list-to-try"></span>

## Other features I've heard about but haven't yet tried

**LaTeX editor.** Codex has a [local LaTeX editor and compiler with a PDF preview](https://learn.chatgpt.com/docs/artifacts-viewer) beside the conversation. It doesn't replace my Overleaf collaboration setup, but I'm excited to try the editing interface.

**Record and replay.** Demonstrate a recurring task on your computer and let the AI turn it into a reusable skill—for example, downloading a monthly report or filing an expense. OpenAI calls this [Record & Replay](https://learn.chatgpt.com/docs/extend/record-and-replay), available on Mac. Claude has [Record a skill](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills) in Cowork on Mac for Pro, Max, and Team users. Both create a skill you can review and refine, rather than simply replaying an identical series of clicks.
