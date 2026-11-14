---
name: setup-project-management
description: Set up or repair a project's local context, source index, and optional dashboard. Use for a new project or an existing folder that needs organization for human and AI collaboration.
---

# Setup Project Management

Public adaptation v1.2, 2026-11-10. Derived from the shared setup workflow v1.1 (2026-02-28), with a portable configuration and explicit local/Google Docs boundaries. This is an instruction workflow to adapt to available tools, not a bundled document API client or scheduler.

## Scope and modes

Use the user's existing project folder and naming when possible. Handle research, writing, professional, and personal projects. Preserve explicit choices and approvals already made in the conversation.

- `discover`: inspect and report; no writes, including configuration or state.
- `plan`: discovery plus a proposed setup; no writes.
- `minimal`: establish the index, overview or link to its authority, and instructions needed to resume.
- `full` or an ordinary setup request: implement the agreed local structure and optional dashboard within the user's authorization.
- `dashboard`: initialize or configure the dashboard for an existing project; don't repeat unrelated folder setup.

An ordinary setup request combines discovery, structure choice, and initialization. Present the relevant structure and settle important open choices with the user before dependent changes: project type, naming, folders to initialize, and output destinations. Reuse choices already made in the conversation; do not repeat a questionnaire.

An answer to a discovery or scope question is not, by itself, approval of the implementation plan. Present the concrete files and destinations and obtain agreement before initialization, unless that plan is already authorized in the conversation.

A request to inspect does not authorize organization. A request to set up the project authorizes routine local additions needed for the agreed outcome; do not add approval gates for every file. Ask about consequential ambiguity, competing authoritative versions, moves affecting collaborators, or an unspecified shared destination before those dependent changes.

## Discover the actual project

Read existing project instructions first. Inventory the bounded project folder, current drafts, source notes, handoffs, task lists, and linked documents. Identify who uses them, the current deliverable, and whether work is exploratory, active execution, or finishing. Different workstreams may be at different stages.

A project may span several folders named by the user. Inventory each selected location, retain the source path for each candidate current file, and distinguish the proposed project home from sources that will stay elsewhere. Record the repository URL and existing local checkout path where relevant; leave code in its established location unless the user requests a separate move.

Include early email correspondence in discovery. Ask: "Are there any names or email addresses I should search for correspondence about this project, including early discussions before it had a settled name?" Gather useful project aliases, subject lines, date range, and exclusions; reuse answers already supplied. Wait for the answer before searching email while continuing independent local discovery. Use available connected tools for a bounded, read-only search. Identify aims, participants, decisions, commitments, deadlines, and linked resources, with message dates and source links or IDs. Distinguish proposals from agreed decisions and verify project relevance when collaborators overlap. If the user declines or access is unavailable, report that gap and continue. Discovery does not send, draft, or modify messages.

Check actual access. For synced storage, verify selected working files can be opened; placeholders and document shortcuts aren't necessarily readable content. Record external locations and access gaps. Don't scan unrelated accounts, download an entire shared drive, move restricted data, or treat an inaccessible source as empty.

For a messy existing project, compare competing drafts and recover accepted decisions from available records. Distinguish suggestions, agreed plans, and completed work. Retain original files; propose moves and an archive map before reorganizing. When the authority is unclear, leave it unresolved for the user rather than using modification time as proof.

End a discovery report with unresolved decisions that need the user's judgment. When consolidation is requested, show a source-to-destination map before reorganizing; distinguish copies, moves, and archival, and identify filename collisions and competing versions. Apply the agreed changes only in an implementation mode, retain recoverable originals, and update affected links and the index. Reuse discovery findings and decisions already available in the conversation; recover missing findings before making changes that depend on them. Discovery itself saves no report or state. A separate request to save the findings authorizes that record only, not reorganization.

## Choose a small structure

Read the bundled [project instructions template](assets/templates/project-instructions-template.md) and [TODO template](assets/templates/project-todo-template.md) when proposing the setup. Resolve these paths from the skill directory. The instructions template is a sanitized adaptation of an archived field checklist; map settings to the existing configuration or the shared project-config contract rather than maintaining duplicate authorities. The TODO template is a newly designed replacement, not a recovered original or a verified interface for other task-management skills. Populate either only within the agreed setup plan.

Prefer useful existing organization. Offer the relevant pattern and initialize the small set of empty folders the user expects to use soon. Let other workflows create additional destinations when needed:

- General project: source index, current overview, standing instructions, drafts/outputs, `research/`, and `council/` when used.
- Research project: paper, presentations, literature, plus an AI-collaboration area for research notes, council runs, transcripts, review history, and dashboard snapshots. The source workflow uses `01_Paper`, `02_Presentations`, `03_Literature`, and `10_AI_Collaboration/{Transcripts,Weekly_Reviews,Dashboard_Archive}`. Preserve unnumbered or differently named equivalents.
- Keep data, code, instruments, fieldwork, submissions, or approvals in the project's established locations; add only what the project needs.

Record actual paths in the index and project instructions. Check the relevant skill's actual routing when selecting its output location. Distinguish a recorded preference from a route that has been configured; creating a folder does not redirect an existing skill. Pass the selected destination when invoking it, or configure the route within the user's request.

Create or update:

1. `PROJECT_INDEX.md`: where material lives, current versions, external links, and known access gaps.
2. A short current overview: goal, stage, governing decisions and reasons, open questions, next actions, and source links. If a Google Doc is the authority, use a pointer instead of a competing status copy.
3. Host instructions used in this project, such as `AGENTS.md` and `CLAUDE.md`: durable preferences and pointers to shared context, using the bundled project instructions template as a field checklist. Preserve existing instructions; avoid duplicating changing status across host files.
4. A task list at the agreed location, using the bundled TODO template for a new list. Its sections are High / Medium / Low priority, Waiting / blocked, Proposed work / needs confirmation, Completed, and Not proceeding. Set priority from user direction or documented needs; keep optional task details concise. Reconcile existing lists and identify their scopes and authority before introducing another. Preserve rejected or uncommissioned work distinctly from open tasks and completed execution. Adapt links to the actual location.
5. A handoff only when there is session state to save. It describes where work stopped, not a second dashboard.

Claude and Codex can use the same project folder; their chats are not automatically shared. Explain that saved context supports switching hosts. Avoid simultaneous writers to the same files.

## Optional dashboard initialization

Read [the project configuration and dashboard contract](references/project-config.md) for dashboard setup. Configure an existing Doc when one is already authoritative. If the user wants a new Doc, verify the connected account and destination, then use available native tools. Do not change sharing or manufacture a link. If direct creation/editing isn't available, prepare local content and explicit manual placement steps and record that the Doc is not initialized.

Use two roles, mapped to actual tab IDs rather than ordinal positions:

- Overview & Meeting Log: current status, priorities, next actions, human corrections, dated history.
- Research design & progress (or Project plan): questions, rationale, design, evidence, and milestone decisions.

Adapt content to stage: early possibilities and decision rationale; middle-stage progress, dependencies and choices; late-stage deliverables, unresolved checks and handoff. Link source evidence. Don't invent owners, dates, completion, or project facts to fill a template.

Show the initial content and destination when they haven't already been agreed. For direct writes, use current tab-scoped operations, revision checks for existing Docs, and readback. If the connector cannot enforce the intended write boundary, retain a local proposal rather than replacing a whole shared document. Leave unrelated tabs untouched.

Set up unique dashboard/history boundaries only in the approved overview tab. Never insert template markers into an existing document merely because a source search didn't find them. Inspect tables and other structures; ask before restructuring established content.

## Verify and hand off

- Check that each created path/link resolves or is explicitly marked unavailable.
- Confirm the index identifies a single current status authority and current deliverable.
- For a dashboard, read back both configured tabs, exact markers, human-notes area, and initial content. Record partial completion accurately.
- Save configuration only with verified IDs; leave unknown optional values null. No credentials belong in project files.
- Explain the next bounded task and how to resume from the saved files.
- Introduce `weekly-review` for later refreshes if available; otherwise provide the equivalent request in plain language. It is a separate workflow, not an automatic consequence of setup.
- Scheduling is separate. Do not create recurring runs unless requested, and don't report a timer as installed because a cadence was written into the config.

## Dependencies and limits

Local setup needs file access only. Direct Doc setup needs an authorized, capable Google Docs connection. Email, Granola, WhatsApp, Council, and a reminder system are optional sources or adjacent workflows, not setup prerequisites. Inspect current tool availability; don't infer that Granola supplies only summaries or that tab creation is impossible from an old connector limitation.

The public workflow does not install private helpers, configure credentials, or deploy changes into another person's skill library. Fresh-host invocation and live document-write compatibility must be verified in the environment where it will run.
