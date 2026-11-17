# Discover existing practices

Use this reference for dictation, writing guidance and improvement-system evidence. Resolve practices through bounded discovery; ask only where the answer changes the next action. Do not keep searching private sources merely to prove a user's answer. Retain coverage of other checklist items while an agreed [walkthrough](walkthrough.md) proceeds; unresolved unrelated items need not block teaching.

## Interpret evidence within its scope

| Evidence | What it establishes | What remains uncertain |
| --- | --- | --- |
| User describes their habit | Their reported practice; ordinarily enough for advice | Clarify agent versus other-app use only when relevant |
| App installed/running, feature enabled, shortcut configured | Capability or setup | Actual use; defaults and abandoned installations are common alternatives |
| Activity count or dated usage | Activity reported by that source | Recency of lifetime totals, device coverage, destination and usefulness |
| One genuine user dictation event or stored dictated message | Prior dictation use, in any destination app | Habit, frequency and usefulness; app-provided demo text is not user activity |
| Destination-app metadata | Reported paste destination | A browser may not identify the site; paste does not prove submission |
| Meeting transcript or connector | Meeting material is available | Who recorded it, whether the user dictates prompts, or how transcripts are used |
| Writing preferences or a guide reference | Guidance exists or is configured | Applicability and whether the referenced content was read |
| Applicable guidance actually read | The agent has the guidance for this task | Whether earlier work used it or the user likes the resulting draft |

Do not infer dictation from typos or conversational phrasing. Do not rank an honest user statement below an app scan. Empty history may reflect deletion, retention settings or another device. Describe the checked scope rather than inferring global absence. Record concise findings in the user's chosen shared assessment, linking existing handoffs when useful; do not create a separate usage score or duplicate tracker.

## Bounded dictation checks

For a relevant general assessment, use a narrow named-app lookup or supported settings view if available within existing access. Check the feature, not just the brand: a product can offer both meeting transcription and dictation. A configured shortcut may be a default and does not demonstrate a working shortcut. Do not require the named products; built-in, mobile and other dictation workflows count.

If already authorized activity metadata or a bounded history view shows one genuine user dictation event, recognize prior use without requiring an agent prompt match. Email, mobile or other destinations count; personally dictated tests count too, unlike app-provided examples. Prefer metadata or the minimum sample needed, not a history dump. Do not infer a habit from a single event or store the raw message in the assessment. If setup evidence leaves a consequential uncertainty, ask about actual dictation, distinct from meeting transcription. Do not insist on dictation in agents to award the basic use check. Inspect activity only within actual access and authorized scope; reuse authorization already supplied. A user-assisted look is a valid fallback when no suitable agent tool exists.

The following primary documentation was checked November 9, 2026. Recheck relevant pages before relying on changing UI paths or integration claims. These are documented possibilities, not tested automation adapters.

| Product | Useful documented signal | Limit |
| --- | --- | --- |
| [Wispr Flow usage](https://docs.wisprflow.ai/articles/8760230576-your-usage-tab-track-your-dictation-stats-in-wispr-flow) | Desktop Insights reports activity, app use and categories including AI prompts; statistics can persist without transcript retention | Metrics have different device/time coverage; categories do not prove submitted messages. No stats API is established here |
| [Wispr history](https://docs.wisprflow.ai/articles/4465314211-delete-transcripts-and-history-in-wispr-flow) and [MCP](https://docs.wisprflow.ai/articles/9551372685-connect-an-mcp-client-to-wispr-flow-remote-mcp-server) | User-facing history and retention controls | The documented remote MCP expressly excludes dictation history |
| [Granola Voice Typing](https://docs.granola.ai/help-center/voice-typing/intro) and [history](https://docs.granola.ai/help-center/voice-typing/dictation-history-and-privacy) | Separate dictation feature, shortcut and history UI | Local history may be disabled or deleted; a meeting connector does not establish dictation-history access |
| [Fireflies Talk](https://guide.fireflies.ai/articles/3809925819-how-to-use-fireflies-talk-to-dictate-in-any-app) | Dictation history displays time, destination app, not-pasted status and activity totals | A UI is documented, not a history API; destination is not proof of submission |

Use tools actually exposed by the host. A web page describing an app screen does not mean the agent can read that screen or a local database. Do not install a connector, enable retention or change shortcuts just to classify a habit.

## Follow writing instructions before hunting for packs

Start with the applicable instruction context and accessible instruction files, including `CLAUDE.md` and `AGENTS.md`. Recognize both embedded preferences and routing rules such as “use X for all writing.” Follow the referenced skill or guide within current access; read it to determine whether it provides personal voice, editing, examples or process guidance. Also search filenames and folder names within selected projects and relevant known documentation/skill locations for `voice`, `voice-pack`, `corpus`, `CORE_VOICE.md`, `*_VOICE.md`, style or writing. Read relevant matches and references, not every installed skill or the whole computer. Interpret contents, ownership and connection to actual writing; a name alone earns no check.

Check whose voice, which audience and which task the guidance covers. A generic template, coding style rule, another person's guide or speech-synthesis voice pack is not automatically the user's writing voice. An example corpus can help develop guidance without already being operative guidance. Honor applicable instruction precedence and task-specific exceptions.

Global guidance already supplied to the session counts even if absent from project files. A reference outside the project may be usable under existing access, or may be inaccessible; neither location alone settles it. Follow explicit relevant references rather than recursively searching home or cloud folders. A symlink does not grant access. App memory counts only when actually exposed. Do not assume that a found file, available skill or newly read guide was loaded for earlier work.

If a pointer cannot be resolved, say, for example: “Your instructions require X for writing, but its guide is unavailable here.” Continue with usable preferences and the task; ask for the relevant material only when needed. Do not recommend creating a replacement pack simply because a referenced one is inaccessible. The site's [voice workflow](https://claudeblattman.com/build-your-own/voice/) explains connecting guidance to standing instructions. A useful draft and the user's corrections test applicability better than a separate compulsory style exercise.

## Writing-specific learning system (starter)

Assess whether personal writing guidance is connected to a repeatable procedure for learning from the user's edits, using the [continuous-improvement guide](https://claudeblattman.com/how-i-improve-the-work/). Search relevant instructions, voice resources and referenced skills for these functional parts:

- A procedure for comparing drafts and revisions, extracting possible lessons and recording decisions; `VOICE_LEARNING.md` or a learning skill are examples, not required names.
- Organized correction storage with source links, such as an index, template and individual records.
- A usable invocation route from standing instructions or an installed skill to that procedure and storage; follow the pointers to check that they resolve.
- A decision process that distinguishes reusable preferences from project-only changes or failures to apply existing guidance, and updates the appropriate personal writing guide when agreed.
- Instructions that load the relevant guide for future writing. Correction logs alone do not change the next draft.

Recognize equivalent simpler implementations; no prescribed folder tree, automatic trigger or schedule is required. A generic “remember my preferences” rule, one saved correction or a voice guide alone does not establish the connected system. Report connected setup separately from real use: a correction episode and decision can demonstrate use, including a justified decision not to add a rule. Do not demand a new guide edit when existing guidance was already adequate. Distinguish later reuse or improvement if evidenced; do not invent it.

Use precise outcomes: **✅ Connected; use observed**, **✅ Connected; first use unverified**, **◐ Partly connected** with the missing component, or **? No system found in checked locations**. The last is a scoped unknown, not proof of non-use. If the user chooses this lesson, help connect missing parts and try the procedure on their real writing.

## Skill maintenance system (advanced)

Keep this separate from writing guidance. Using [Fix and update your skills](https://claudeblattman.com/workflows/maintain-skills/), look for a repeatable procedure that starts from a concrete failure or opportunity, identifies the actual installed version, diagnoses instruction/application/connection problems, makes a recoverable repair and retests the changed skill on representative work. Procedure files, maintenance skills, project instructions or recorded recurring review workflows can supply the mechanism; repair notes and test results can demonstrate use. An isolated edited SKILL.md or a schedule alone is insufficient evidence of the whole process.

Record configured process, observed use and verified results separately. Manual invocation is valid; scheduled or event-driven execution is an optional automation enhancement. Do not run maintenance or an automation merely to assess its existence. When chosen, teach and carry out the maintenance walkthrough with the user's actual skill and task.

## Optional historical matching

Keep matching for a specific requested diagnostic, such as locating a dictated prompt, using selected app/device, date range and chats. It is a proposed technique, not a bundled integration. First check whether activity or destination metadata already answers the question.

Use a supported interface or a user-supplied extract. Compare distinctive dictated passages with original user messages, allowing formatting and limited edits; exclude assistant echoes, tool output and quoted meeting transcripts as proof of prompt origin. Use timestamps and destination as corroboration. Short/common text or semantic similarity alone is inconclusive. Distinguish dictation events from text-polishing operations.

Report correspondence for the particular event, not habitual use or a percentage of all prompts. No match means no match in the selected records. Prefer local comparison where supported, minimize content passed to the model, and avoid storing raw excerpts in reports or handoffs. Do not send histories to an external council or build a persistent cross-app index for discovery.
