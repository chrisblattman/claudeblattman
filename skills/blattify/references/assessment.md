# Assessment and continuity

Use for discovery, visible progress and continuity. A general run retains coverage of all starter items and applicable advanced items, but can begin an agreed walkthrough while unrelated discovery remains pending. Assessment-only requests return findings without starting lessons. Project use, skills experience and automation are explicit Blattify additions, even if the site's checklist changes.

## Opening: find existing progress before intake

On every invocation, automatically look for and read an existing `BLATTIFY.md` or established equivalent before repeating assessment or asking where to save. Start with the current project, paths in applicable instructions or handoffs, and previously agreed documentation locations exposed in context. Use a bounded filename lookup in those locations when needed; follow relevant pointers rather than recursively reading project contents or searching the whole computer. This narrow discovery does not authorize substantive assessment of new projects, raw histories or unrelated files. Actual access and existing exclusions still apply.

Use the existing record's scope, storage choice, answered questions and active walkthrough. Honor a known chat-only choice or an explicit narrower request. If several plausible assessments remain ambiguous after checking their scope and pointers, ask which to use; do not silently merge them or choose only by modification date. If none can be found or read, state the checked locations or access limit and resolve only the missing scope/storage information below. Do not routinely make the user remember its path. An inaccessible pointer is not proof that no assessment exists.

## First-run choices: projects and a shared home

Before substantive scanning, establish any project scope and storage choices not resolved by existing progress or user instructions. Read applicable instructions normally, and use already available conversation context, paths or a supported project-list interface to prepare a concrete choice. Do not inspect Project A's work first just because the session started there.

When choices remain necessary, give a short introduction identifying the current project, available project list and what the assessment includes. Then call the native question tool for the unresolved choices, together if supported. Use only project names and a documentation pattern actually available:

| Question | Selectable answers |
| --- | --- |
| You're currently in Project A. Which projects should I assess? | This project; Choose projects; All listed projects |
| I see your documentation is kept in Y. Save the shared assessment there as BLATTIFY.md? | Save in Y (recommended); Choose another location; Keep in chat |

Make the exact listed projects and suggested save path visible before selection. These are question contents for the tool, not a prose questionnaire to paste into the chat. Do not repeat the full questions and options in a final text response while interactive controls are pending.

List known projects and explain where the list came from; do not call it exhaustive. If the host has no project-list tool, use projects named in the conversation or ask for a parent folder and list its immediate candidate directories. If no documentation pattern is established, ask where the file belongs. A file already named by the user or an existing assessment referenced in context can resolve the storage question. A proposed location is not a completed save.

Project selection covers relevant work examples, such as a project brief or a meeting-follow-up note, as well as setup files. It does not authorize all files/accounts or default reading of raw chat and dictation histories. Inspect selected files for a checklist question rather than recursively reading every document. For personal/global agent setup, prefer host-exposed skill locations, applicable instruction files and explicit relevant references; do not sweep hidden directories that also contain histories or credentials. An outside path or symlink remains subject to actual access and scope.

The storage location can differ from the projects assessed. One file holds the shared assessment and project differences; source documents stay in their existing homes. If the user prefers chat-only, retain that choice and proceed without creating a folder or file.

## Interactive questions throughout

Prefer the host's actual selectable question controls for scope, storage, choosing a lesson and consequential decisions. Do not turn each unknown practice into a question. Deliver completed assessment or lesson results as a normal final response without a new question card. During a guided run, a lesson choice can happen before discovery is complete; reuse an already chosen direction. Use the available tool and its live schema: Codex may expose `request_user_input_async`, or `request_user_input` in an allowed mode; Claude Code may expose `AskUserQuestion`. Do not assume a tool is usable merely because this document names it. Respect host restrictions on permission-related questions and use the host's required approval route when applicable. Do not change modes, settings or permissions to manufacture a question UI.

- Ask one to three focused questions per exchange, within the tool's limits. Each question should resolve one decision. Keep wording and answer labels short; avoid combining several independent habits into one yes/no answer.
- Keep one clearly identified current batch at a time. With partial asynchronous replies, process answered items and continue independent reading, but do not pile unrelated batches over unanswered controls. If earlier controls are unavailable, buried or hard to resurface, consolidate the remaining questions into a fresh small batch; also do this when the user asks. Preserve submitted answers and accept replies to either version without duplicate intake. Do not claim to dismiss an old card unless the host actually supports that action. A user can defer an item; retain its unresolved status rather than forcing an answer to finish. Silence after a reminder is not deferral or permission, and does not resolve scope or storage dependencies.
- For “Choose projects,” use multiple selection only if the tool supports it. Otherwise offer an include/skip choice for each named project in small batches. Do not require users to type a list of known project names. Offer a custom answer for projects not listed.
- For another storage location, request a path in the tool's custom-answer field or use a supported folder picker if available. Without evidence for a suggested home, ask where to save through a structured question with free text rather than inventing a recommendation.
- For practice questions, use concrete options suited to the question, such as “Works well,” “Sometimes / needs work,” and “Not using it.” Include “Not sure” or “Not relevant” when useful and supported, and retain the host's custom-answer route. Do not add a duplicate “Other” option when the host already provides one.
- Label a recommendation only when justified. A suggested or preselected option, an empty response, dismissal or timeout is not a user answer or permission. Record only submitted answers; keep unanswered choices unresolved. With asynchronous controls, wait for the reply before dependent scanning, saving or implementation. Continue only work independent of that choice.
- Follow the user's answers, including free-text corrections, without asking them to reconfirm the same choice. Reuse settled scope and storage on return. Let the user defer questions and preserve the incomplete assessment.

If no native question tool is available or allowed, or it fails, briefly explain the limitation and use a compact numbered choice with short-answer labels, one decision at a time. Do not silently fall back to a long free-response questionnaire, claim text is clickable, or build a separate web form. A user who explicitly prefers ordinary conversation can answer in prose.

For validation, check both tool-enabled and tool-unavailable behavior. A headless test that omits question tools can test only the fallback; it cannot establish that interactive controls work in the app. Never send a real assessment question to the user merely to simulate a test.

## Coverage and questions

Use the current homepage for starter items and the [agreed intermediate/advanced sequence](site-guide.md#intermediateadvanced-sequence) for later coverage and default lesson order. Do not let an older public index restore merged standalone lessons. Enumerate the actual individual entries and directly linked pages, including linked skill definitions where those are the checklist destination. Deduplicate shared pages, not distinct questions. Read the relevant destination and section before marking source coverage complete. A source failure is a recorded limitation, not a reason to omit the practice or invent current advice. Do not recursively follow every navigation or incidental link.

The following coverage prompts are a dated fallback, checked November 10, 2026; they are not proof the live list remains unchanged. Split grouped prompts into individual assessment rows. Add new live entries. Keep source URLs/read dates and record unavailable destinations.

| Starter area | Individual questions to cover |
| --- | --- |
| Agent work | Agentic AI experience; desktop/interface use; a real task and revision; project use (Blattify addition) |
| Councils | Actual use of independent attempts and synthesis on a task; record subagent and different-model experience separately where applicable |
| Adversarial review | Actual use of fresh AI reviewers to examine existing work; distinct from council development and human judgment |
| Dictation | Prior dictation in any app; agent prompts/corrections as an optional application; friction only when relevant |
| Meeting records | Capturing meetings; filing records with projects; using them for actions and follow-up |
| Voice | Personal writing guidance and connected instructions; separately, a repeatable writing-specific system for learning from edits, with connected setup distinguished from observed use |
| Skills experience | Use before this invocation; actual storage/discovery locations; creation/adaptation; installation of someone else's skills |

When the starter practices are working, continue automatically through the individual entries in the [intermediate/advanced sequence](site-guide.md#intermediateadvanced-sequence). Accounted-for restrictions, deliberate declines and non-applicable items do not force unwanted setup. A user's request for advanced assessment can also trigger it. For a newcomer, record advanced coverage as not yet assessed and begin a useful foundational lesson when chosen. Use the sequence as the default, adapting to evidence, dependencies and the user's work.

Keep one status/evidence entry per included page, with project setup versus cleanup identified as alternative entry points and personal workflows marked for relevance. Project briefs, persistent instructions, rules, app connections and category digests are assessed as supporting elements of their relevant lessons, not separate required stops. Assess automation explicitly within relevant workflows: recurring or event-triggered work, intended outcome, actual successful runs, result usefulness, delivery and failure visibility, and useful opportunities. Preserve writing-specific learning in starter coverage and skill diagnosis, repair and retesting as the separate later practice. Source gaps and placeholders remain distinct from missing user practices.

These are practice questions, not requirements to install the site's exact named skills. A functional alternative counts. A shared package can serve several projects, but evidence from one project does not prove every project uses it. Recognize work completed out of order. For potentially sensitive personal domains, ask whether they are relevant rather than opening personal records merely to fill a row.

Use evidence first. One genuine example can establish prior use; it does not prove habit, satisfaction or effectiveness. Ask only when the missing answer affects the selected lesson, a consequential recommendation or source scope. Leave unrelated uncertainty recorded, without a mandatory questionnaire. Ask about usefulness when it matters to the next action, not as a condition for recognizing every prior practice. The user need not supply proof or a proficiency label. During a lesson, continue remaining bounded discovery in a permitted read-only native worker or serially at useful pauses; SKILL.md defines delegation boundaries.

Use these statuses consistently:

- **Working / established:** evidence or the user's account establishes the specific checklist criterion in the named scope. Label the claim precisely (for example, prior use observed, or system connected with first use unverified); do not imply habitual or successful use beyond the evidence.
- **Partial:** some setup or practice exists, with the missing part stated.
- **Not started:** established by the user or clear scoped evidence, not an unsuccessful search alone.
- **Not applicable / deliberately declined:** with the user's reason or restriction when useful; do not keep proposing it.
- **Unresolved:** state the evidence or access gap; ask only if resolving it matters now. Mark not-yet-inspected items as coverage pending.

Record evidence separately: observed setup, observed use, user report, inaccessible source, or not inspected. A practice can be working by user report even if its source files are inaccessible. Installed, loaded, invoked and useful are different claims. Completing a coverage pass means accounting for every applicable entry, including unresolved ones; it does not mean every entry works or every unknown has been answered. State source and evidence coverage separately. A pending pass is provisional and need not block a chosen lesson.

## Councils and adversarial review are separate checks

Give **Councils** and **Adversarial review** separate rows, each with its own status, evidence or user report, date and project scope. They may share a source page and appear adjacent in site order. A single-provider council counts; multiple-model experience remains a separate question, not a condition for the council check. Installing or explaining either command does not establish use. Inspect actual outputs or run records within scope, or accept the user's account; do not require evidence of a recurring habit.

Council evidence establishes independent attempts and synthesis used on a task. Adversarial-review evidence establishes fresh AI reviewers examining existing work. A council synthesis, ordinary self-edit or the user's own judgment does not automatically establish adversarial-review use. A completed combined workflow can establish both when its evidence supports both actions. If an older assessment has a combined council/review row, split it using its actual evidence; keep either unsupported part unresolved instead of copying the old check into both rows.

Keep prior-use findings within the assessed scope separate from current-task completion. After the user's first actual council, the snapshot might show:

| Practice | Status | Evidence / scope |
| --- | --- | --- |
| Councils | ✅ Use observed | Workshop proposal; dated council output link |
| Adversarial review | ? Unresolved | No prior use found in checked sources |

The active walkthrough can simultaneously say: **Council completed; human judgment next; fresh review not yet run.** Do not remove the council check because the larger lesson is unfinished. If review use is established elsewhere in scope, check that row independently while still recording that this proposal has not been reviewed. After review, link the artifact/version actually reviewed; do not carry that result forward to a later revision without qualification.

## Skills and automation discovery

For skills, begin with the host's available names/descriptions/paths. Read relevant definitions or installation records when they help establish function or origin. Do not assume a directory means the user wrote or installed its contents. Built-in or bundled skills may have arrived automatically. Creating with an agent and adapting another person's skill both count as authoring experience; distinguish them if useful.

Visible `/name` or `$name` invocations and a host's supported usage report can support use; plain-language automatic selection also counts. A slash command can be an app control rather than a skill. Historical prompt searches are not required for this assessment. Ask, for example: “Which of these skills do you actually use? Have you asked an agent to make or adapt one, or installed one someone shared?” Do not treat today's first Blattify invocation as prior experience. Use the host's real locations, including plugins and overrides, rather than hard-coding one directory as the whole library.

For automation, start with available supported read-only list/status interfaces and relevant project documentation; ask about automations elsewhere. Distinguish enabled/disabled configuration, scheduled versus triggered operation, latest known result and whether the user finds it useful. Assess delivery destination and what happens on failure. If run information is unavailable, label it unverified rather than treating it as failure or success. Do not run an automation to test it during assessment. Follow the host's automation tools and any applicable skill when the user later chooses an automation change; do not write raw scheduler configuration to bypass the supported route.

## Connected email and tool permissions

When an email connection is known within scope, is being set up, or an email workflow is recommended, assess connection usefulness and awareness of its action permissions separately. A successful Gmail search does not establish that sending or changing mail is allowed. Ask only about gaps that matter to the user's intended workflow, reusing established answers. Do not discover unrelated accounts, make email connection a starter prerequisite or treat a chosen restriction as a defect.

In Claude, after Gmail is connected, guide the user to **Settings → Connectors → Gmail → tool permissions** if that is the layout they see. The current [Claude connector guide](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) calls the entry point **Customize → Connectors**: select Gmail and inspect the available permission categories or individual tools. Explain the displayed allow, ask-for-approval and block choices using the actual labels in that version. Organization restrictions can constrain the choices. The [Gmail guide](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) documents approval before send/reply/forward by default. Help the user distinguish reading/searching from sending or modifying mail; any suggested settings should reflect the actions they actually want.

Do not say Codex cannot control individual tools. The [OpenAI configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) documents per-app-tool enablement and approval overrides. This does not establish an equivalent Gmail settings screen in every desktop version. Check the current host's supported controls and documentation before giving exact steps; do not invent a menu path or silently edit configuration as a substitute. A description of permissions is not a request to change them. These details were checked November 10, 2026; recheck before guiding setup when the interface differs. For user-facing background, link [Connect your apps](https://claudeblattman.com/build-your-own/mcp-setup/).

## Shared assessment file

Use one shared `BLATTIFY.md` or an existing equivalent at the chosen location, outside the installed skill folder. Preserve unrelated content and the user's organization. A useful structure is:

```markdown
# AI workflow assessment

Last updated: ...
Scope: selected projects, shared setup, excluded sources
Purpose/priorities: ...
Sources: checklist URLs, date read, page-access gaps
Coverage: starter complete/in progress; advanced complete/in progress/not yet assessed

| Practice | Project/shared scope | Status | Evidence or user report; date | Open question |
| --- | --- | --- | --- | --- |

## Recommended priorities
Biggest expected gain: ...
Other ranked opportunities: ...
Chosen next action and its authorization: ...

## Active walkthrough
Selected practice, source page and date read, learning aim
Source opening shown (or identified source limitation); current teaching stage
Current step; completed/skipped prerequisites and their evidence
Method and reusable requests explained/demonstrated; what the user actually tried, decided or corrected
Output links and artifact/version identifiers, checks performed and version reviewed
Implementation status separate from teaching delivered and remaining practice/verification
Pending decisions, next unfinished step; previous lesson's unfinished work if switching workflows

## Continuation
Unresolved questions, deferred/declined suggestions, changes since last assessment
Links to relevant project handoffs and outcomes
```

Adapt headings to an existing record. Save concise conclusions and links rather than raw transcripts, emails or copied private documents. Record differing project findings without flattening them into a global yes/no. Keep prior-use checklist evidence independent of lesson progress. A created artifact or working configuration does not prove independent learning; neither a quiz nor a claim of mastery is required. This assessment is not a replacement for existing project to-do systems.

Once the storage choice is settled, automatically save meaningful actual accomplishments and the next unfinished step, including before waiting on a consequential user decision. Save after council output, after human judgment/revision and after fresh review; record the relevant output/version each time. These are action boundaries, not a per-turn write requirement. Updates are normally quiet and need no additional save request, `/done` or confirmation. The main agent remains the sole writer when background discovery is running. Check that each write succeeded; if blocked or declined, explain the limitation and provide concise chat resume information without claiming durable storage.

Retain a pointer to this same assessment in an appropriate existing project handoff or instructions location whose update is already authorized. Preserve unrelated content; use a path that future sessions can resolve from that location. This pointer does not authorize new project access, global settings changes or duplicate per-project assessments. If no suitable location is authorized, provide the path and explain the discovery limit rather than silently changing global instructions.

On return, follow the bounded opening discovery, read the shared file first and resume the next unfinished step using established answers. Verify linked outputs and current state as needed; a missing output or stale record calls for a targeted repair or clarification, not automatically rerunning completed work. Reconcile changed evidence and new checklist entries without restarting intake or implying old observations were freshly checked. If the new project is outside the saved scope, ask whether to add it before scanning. Preserve chat-only and deliberate declines.

## Finish with a visible checklist and recommendations

Show the report in the final chat response, with the saved file providing fuller detail. Do not hide the findings behind a new interactive choice, require a response to reveal the results, or give only a link to the file. For an advanced user, retain coverage of individual advanced entries and automation rather than stopping at one interesting gap. A provisional recommendation and lesson may precede completion; say what remains pending, and rank only against evidence gathered so far. A final complete ranking requires the applicable coverage pass. If the user stops, show the current snapshot and next unfinished step.

Start with the whole starter checklist in the site's current order and grouping, retaining recognizable wording and a link to its guidance. Split councils and adversarial review into separate adjacent rows even when the site combines them; label them as separately assessed practices from the shared page. Add project use and skills experience separately so Blattify's additions are not presented as site items. Suggested columns: **Practice | Status | Evidence / scope**. Use short notes, not copied private content. Keep the table in the chat even when a shared assessment is saved.

Use **✅** only with an accurate text label for the criterion established by evidence or user report. For simple prior-use items, say “Use observed” rather than claiming a habit. For the writing-learning system, “Connected; first use unverified” can satisfy the setup criterion without claiming demonstrated use. Use “Working” when useful operation is supported. Use **◐ Partial**, **○ Not started**, **? Unresolved**, **— Not applicable**, and **— Declined** for the other states; plain text labels suffice if symbols do not render. An installed app alone cannot earn a working check. Evaluate every row independently: a partial dictation row does not prevent a later meeting-capture row being checked. For compound items, all material parts must be established before a full check; otherwise explain the partial result. Scope a check to the projects supported by the evidence rather than implying universal use.

Omit the workplace-eligibility question from the starter snapshot and routine intake, including when an older live page still contains it. Keep restrictions already supplied or encountered in scope notes and respect them; do not treat them as achievement rows. Preserve effective alternatives, non-applicability and declines without representing them as missing prerequisites. Unknown or inaccessible evidence is not the same as not started.

If advanced coverage was undertaken, include a compact advanced summary with statuses and the important gaps; keep every individual advanced entry and automation finding in the shared record, or in chat if there is no saved file. If it was not assessed, say so. Do not imply all advanced items are complete merely because the starter snapshot is visible.

After the snapshot, state which established basics can be skipped and the next useful practice. Lead the recommendations with the biggest expected gain and why it matters for this user, followed by a few ranked alternatives and their relevant guidance links. Use actual friction, outcomes, effort and dependencies; do not fabricate scores or promise savings. Use the same priorities in the report and saved record. Include the saved location and meaningful limits. Completed reports and lessons end without a question tool or mandatory “choose now”; an optional plain-language resume request is enough. An active guided run may use a lesson-choice control earlier without hiding its snapshot.

For a chosen or already requested practice, follow [walkthrough behavior](walkthrough.md) and continue authorized work without another readiness confirmation. Assessment-only requests wait for a later implementation request. Choosing a lesson does not itself authorize installation, connections, permission changes, scheduling or publication; reuse existing authorization and follow host rules for any missing authorization.
