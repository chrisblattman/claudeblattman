---
title: Organize your work around projects
description: Give one ongoing project a clear home, keep its decisions and drafts findable, and make the next session easier to begin.
---

# Organize your work around projects

When you return to a piece of work after a week away, you should be able to find its current material, see what was decided, and pick up the next task. An AI assistant can help if the work has a recognizable home and the important files have distinct jobs.

You can do this for a research project, a committee, a recurring document, or a family plan. Start with **one project you will revisit soon**. Chris's projects in Codex largely reflect folders he already had in Dropbox. He improved that organization over time; reorganizing an entire drive was not his first task and need not be yours.

This guide maps where those files go and how they connect. If the immediate problem is a chaotic drive, see [organizing your cloud storage](cloud-storage-guide.md). If you already have a project and need a meeting briefing, see [catch up on a project](project-management.md).

## See the shape first

Here is a small starting arrangement. The names are suggestions; the jobs of the files matter more. A shared document can serve as the current overview instead of a Markdown file. Keep restricted sources in their approved location and put a pointer in the project index.

```text
<project>/
├── PROJECT_INDEX.md          ← Start here: where the material lives
├── PROJECT_STATUS.md         ← Current goals, decisions, open questions, next action
├── AGENTS.md or CLAUDE.md    ← Standing instructions for the assistant, if needed
├── drafts/                   ← Work in progress; label the current version
├── meetings/                 ← Dated notes and transcript pointers
├── references/               ← Sources or links to their original locations
└── work/                     ← Dated outputs and session notes
```

Chris's established research folders are more elaborate. An October 5 inspection of several paper projects found a project index, handoff, session log, project instructions, human research folders, and a separate area for AI collaboration. Their exact subfolders varied. A simplified view of that **observed pattern** looks like this:

```text
<research project>/
├── PROJECT_INDEX.md          ← Catalog of people, documents and locations
├── HANDOFF.md                ← Current state for the next session
├── SESSION_LOG.md            ← Dated history
├── AGENTS.md                 ← Codex project instructions, where used
├── .claude/CLAUDE.md         ← Claude Code project instructions, where used
├── paper / literature / data / approvals / field materials ...
└── 10_AI_Collaboration/      ← Working notes, transcripts and AI outputs
```

The second tree explains Chris's system; it is not a setup requirement. His research folders also have a numbered taxonomy that predates the AI work. You can start with one status document and a few pointers, then add structure when repeated work calls for it.

<figure style="max-width:420px;margin:1.5rem auto" role="img" aria-label="A project entry point links to current status, sources, drafts, and standing instructions.">
<svg viewBox="0 0 420 485" width="100%" xmlns="http://www.w3.org/2000/svg" style="color:var(--md-default-fg-color)">
  <g fill="none" stroke="currentColor" stroke-width="1.4">
    <rect x="50" y="12" width="320" height="62" rx="7"/>
    <path d="M210 74 V88 H75 V430 M75 139 H99 M75 235 H99 M75 331 H99 M75 427 H99"/>
    <rect x="100" y="108" width="290" height="62" rx="7"/>
    <rect x="100" y="204" width="290" height="62" rx="7"/>
    <rect x="100" y="300" width="290" height="62" rx="7"/>
    <rect x="100" y="396" width="290" height="62" rx="7"/>
  </g>
  <g fill="currentColor" font-family="DM Sans, sans-serif" font-size="17" text-anchor="middle">
    <text x="210" y="50">Project entry point</text>
    <text x="245" y="146">Current status and decisions</text>
    <text x="245" y="242">Sources and transcripts</text>
    <text x="245" y="338">Drafts and outputs</text>
    <text x="245" y="434">Standing instructions</text>
  </g>
</svg>
<figcaption>The project entry point makes each kind of record findable.</figcaption>
</figure>

The entry point tells the assistant **where to look**. The status document tells it **what is current**. The sources let you check why something was said. The instructions tell it **how to work**. A past chat can help recover history, but it does not replace those project records.

## 1. Choose one place to begin

Pick a name you will recognize later and a project entry point you can reopen. It might be a folder on your computer, a shared drive folder, or a project in an AI app. The entry point only needs to tell you where the work is. It does not need to hold copies of every document.

Before moving files, ask your assistant to map what already exists: the current draft, reference documents, meeting notes, relevant messages, and any other places the work lives. Check the map yourself. A collaborator's Google Doc or a document in university Box can stay where it belongs; the project entry point can link to it.

Give the assistant the project name and the starting location each time you open a new chat. Do not assume a chatbot project, a folder on your computer, and a cloud connection all provide the same material or share the same settings. Ask what this assistant can actually read.

## 2. Give each kind of material a job

| Material | What to keep |
|---|---|
| **Sources** | Original documents, data, messages and references, with a date or version and a way to find the original. Keep restricted material in its approved location. |
| **Drafts and outputs** | The work in progress and finished artifacts. Mark which version is current and whether it is a draft, reviewed, sent, or approved. |
| **Meetings** | Dated notes or transcripts, with a link to the source. Check the record before treating a suggested action as an assignment. |
| **Current state** | A short overview of the goal, people, decisions, open questions, next actions, and links to the material above. |
| **Standing instructions** | How the assistant should repeatedly work on this project. Keep one-time requests and changing project facts out of these instructions. |

Your current overview can be a Markdown file, a shared document, or a first tab in a project hub. Choose one place for the status you want the assistant to read next time. The overview is a signpost: link to the full history instead of copying it all in. Date an output that has no dedicated place yet; give a set of related outputs its own dated folder so its parts stay together.

If you use Claude Code, project instructions may live in a `CLAUDE.md` file. If you use Codex, they may live in `AGENTS.md`. An AI app's project instructions are another option. Use the instructions for durable working preferences. A changed deadline belongs with the project's current facts; a request to summarize today's meeting belongs in today's chat. [How to write an instruction file](../build-your-own/agents-md.md) covers that distinction in more detail.

## 3. Begin with the record, then do the work

At the start of a session, point the assistant to the project overview and the sources relevant to today's job. Ask it to flag anything missing, stale, or contradictory before it writes or changes the record. If an old proposal and a later decision disagree, keep their dates and sources visible until you resolve the difference.

You can begin with two or three documents. For a meeting, the prior notes, a recent update, and the current draft may be enough to ask: *What has changed? What needs my decision? What is still unknown?* Connections to email, calendars, or transcription services can help later, but the first attempt does not require them.

## 4. Leave a short handoff

When you stop, preserve what the next session needs: what changed, which decisions you approved, what remains open, the next useful action, and a link to the current artifact. Review the assistant's account before it becomes the project's current record, especially any claim about someone else's commitment.

Keep dated notes and transcripts for the history. Keep the current overview short enough to read. A session transcript can recover the reasoning behind an old choice, but put the decision and next step somewhere easier to find. The [session management guide](session-management.md) explains handoffs in Claude Code and Codex. A handoff file does not automatically update a separate project brief or shared document.

When you correct the assistant, save the correction at the right level. Fix a project fact in the overview. Put a recurring drafting preference in the instructions. Leave a one-off direction in the task. That way, a correction made today can help next time without turning every conversation into a permanent rule.

<figure style="max-width:420px;margin:1.5rem auto" role="img" aria-label="Session flow: read the current record, do the work, review the result, save decisions and the next action, then return later.">
<svg viewBox="0 0 420 470" width="100%" xmlns="http://www.w3.org/2000/svg" style="color:var(--md-default-fg-color)">
  <defs><marker id="session-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8" fill="none" stroke="currentColor" stroke-width="1.5"/></marker></defs>
  <g fill="none" stroke="currentColor" stroke-width="1.4">
    <rect x="50" y="12" width="320" height="60" rx="7"/>
    <path d="M210 72 V96" marker-end="url(#session-arrow)"/>
    <rect x="50" y="105" width="320" height="60" rx="7"/>
    <path d="M210 165 V189" marker-end="url(#session-arrow)"/>
    <rect x="50" y="198" width="320" height="60" rx="7"/>
    <path d="M210 258 V282" marker-end="url(#session-arrow)"/>
    <rect x="50" y="291" width="320" height="60" rx="7"/>
    <path d="M210 351 V375" marker-end="url(#session-arrow)"/>
    <rect x="50" y="384" width="320" height="60" rx="7"/>
  </g>
  <g fill="currentColor" font-family="DM Sans, sans-serif" font-size="17" text-anchor="middle">
    <text x="210" y="49">Read the current record</text>
    <text x="210" y="142">Do today's work</text>
    <text x="210" y="235">Review the result</text>
    <text x="210" y="328">Save decisions and next action</text>
    <text x="210" y="421">Return later</text>
  </g>
</svg>
<figcaption>Preserve the outcome so the next session can begin from the record.</figcaption>
</figure>

## 5. Find the work again

Search by project name, or ask the assistant to locate the entry point, read the current overview, and compare it with the newest dated material. When you need to know *why* a choice was made, search the older notes or chats. Chris sometimes uses a local [recall skill](recall.md) for past sessions; an ordinary file search or a direct request to the assistant can also work.

Treat a retrieved chat or old handoff as history until you compare it with the current project record. If the assistant finds two possible answers, ask for their dates and sources, decide which one governs, and update the overview.

## 6. Decide what the assistant can reach

Start with the material needed for this project and expand access when it helps. Check local folders and connected cloud accounts separately. Also check which tools can read, send, change, or delete. Written project instructions can guide behavior, but they are not a technical permission boundary.

For Dropbox, **Selective Sync**, **online-only files**, and **cloud connector access** answer different questions. Selective Sync removes selected folders from a computer's local drive. An online-only file can download when opened. A connected app may have its own route to cloud files. [Dropbox explains Selective Sync](https://help.dropbox.com/sync/selective-sync-overview) and [connected app access](https://help.dropbox.com/integrations/third-party-apps).

Consider the rules and expectations that apply to other people's data before giving an assistant access to research records, correspondence, or transcripts. You can ask it to help inventory what it can reach, then verify the result and adjust access where needed. Such an inventory cannot guarantee that every access path has been found.

## Try it on one project

Use this with a project you expect to revisit. Give the assistant a starting location, then ask:

```text
Find the current materials for this project. Before moving or editing anything,
show me where the drafts, source documents, meeting notes, decisions, and
standing instructions live. Identify anything that appears stale or conflicts
with a newer source. Suggest one clear entry point, and tell me what you cannot
access. Wait for me to check the map before changing the project record.
```

Once the map is right, make a short current overview and try starting the next session from it. If you can find the work and understand its state without replaying a whole chat, the project has a useful home.
