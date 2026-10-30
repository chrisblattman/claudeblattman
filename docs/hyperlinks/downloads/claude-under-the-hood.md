# Claude Code Under the Hood

*A tutorial for power users who've built skills but want the conceptual framework.*
*~30-40 minute read. Each module uses real production skills and config as examples.*

*v1.0 — 2026-02-15*

!!! tip "Official companion"
    Anthropic now publishes their own technical overview: [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works). This tutorial covers the same ground from a practitioner's perspective — read both for the full picture.

---

## Module 1: The Message Stack — How Claude Sees Your Setup

Every time you send a message in Claude Code, Claude doesn't "remember" the conversation the way a person does. It **re-reads everything from scratch**. The entire conversation—system instructions, every message you've sent, every tool result—is assembled into a single **message stack** and sent to Claude's API. Understanding this stack is the single most important concept for understanding why your setup works.

### What's in the stack

The message stack has three layers, assembled top to bottom:

| Layer | What's in it | Example |
|-------|-------------|------------|
| **System prompt** | CLAUDE.md + loaded rules + active skill content | ~200 lines of CLAUDE.md + rule files + skill text |
| **Conversation history** | Every user message and Claude response so far | Grows with each turn |
| **Tool results** | Output from every tool call (Gmail searches, file reads, etc.) | Can be enormous — a single Gmail fetch might return 2K tokens |

**Key insight:** Your CLAUDE.md, rules files, and the active skill's markdown content are all injected into the **system prompt** at the top of the stack. They aren't "code" that runs — they're text that Claude reads as instructions before it sees your message.

### How your config loads

When you start Claude Code, the system assembles the system prompt like this:

```
1. Read ~/.claude/CLAUDE.md (or symlinked from your config directory)
   → Your master config: role, preferences, tech stack, rules table

2. Load rule files from Settings/rules/ as context becomes relevant
   → email-voice.md, project-management.md, integration-notes.md, etc.

3. When you invoke a skill (e.g., /triage-inbox), inject that skill's
   full markdown content into the prompt
   → The skill's full markdown — all of it becomes instructions
```

### Skills are prompts, not code

This is the most important mental model shift: **a skill is not a program that executes.** It's a set of instructions that Claude reads and then tries to follow, using tool calls to take actions. When you run `/triage-inbox`, Claude doesn't "execute Phase 2" like running a function. It reads the Phase 2 instructions, decides it needs to call `mcp__google_workspace__search_gmail_messages`, and makes that call. The skill's markdown is a prompt — a very structured, very detailed prompt.

This is why your skills are `.md` files, not `.py` or `.js` files. They're prompts injected into the system instructions.

### Your example: How `/triage-inbox` becomes instructions

When you type `/triage-inbox days:3`, here's what the system prompt looks like (simplified):

```
[CLAUDE.md — global config]
[rules/email-voice.md — loaded because email context]
[rules/integration-notes.md — loaded because MCP tools referenced]

[Skill: triage-inbox.md — injected verbatim]

[User message: "$ARGUMENTS = days:3"]
```

Claude reads all of this, top to bottom, every single turn. The skill text tells Claude what tools to call, what order to work in, and what output format to produce. But Claude is making judgment calls at every step—it's following instructions, not executing code.

### Best practices / Common improvements

**Best practices:**
- A modular config (CLAUDE.md + separate rule files) is well-structured. Each file has a clear topic, and the main file has a table of contents. This is exactly how to manage a large system prompt — modular, not monolithic.
- Inline triggers ("Sending email: Use send-email.py") put critical behavioral rules where Claude is guaranteed to see them early.

**Could improve:**
- Watch for duplicate CLAUDE.md files (e.g., one in `~/.claude/CLAUDE.md` and one as a project-level file). Claude sees both. If they diverge, you get conflicting instructions. Keep one as the source of truth and symlink or remove the other.
- Consider adding a one-line comment at the top of each skill: `<!-- ~384 lines / ~2.5K tokens -->`. This makes token cost visible when you're deciding whether a skill needs trimming.

---

## Module 2: The Agentic Loop — What Happens When a Skill Runs

Claude Code isn't a chatbot. It's an **agent** — a system that takes actions in a loop until the task is done. Understanding this loop explains why `/weekly-review` makes 20-30+ API calls and why skills need explicit tool names.

### The loop

Every turn follows this cycle:

```
1. Claude receives the full message stack (system prompt + conversation + tool results)
2. Claude generates a response, which may include one or more tool_use blocks
3. The system executes each tool call and collects the results
4. The tool results are appended to the conversation
5. Claude receives the updated stack and generates the next response
6. Repeat until Claude responds with only text (no tool calls) → task complete
```

Each trip through this loop is one **agentic turn**. A single turn can include multiple tool calls in parallel (e.g., fetching 10 emails simultaneously), but Claude only sees the results after all calls in that turn complete.

### Your example: What happens step-by-step when `/triage-inbox` runs Phases 2-3

Here's the actual sequence of agentic turns:

```
Turn 1: Claude reads the skill instructions + email-policy.md + triage-config.md
         (These were fetched in Phase 1, results already in the stack)
         → Claude decides to search Gmail
         → Tool call: mcp__google_workspace__search_gmail_messages
            query: "in:inbox is:unread newer_than:3d"
         → Tool call: mcp__google_workspace__search_gmail_messages
            query: "in:inbox newer_than:3d (from:uber.com OR from:lyft.com OR ...)"
         [Both searches run in PARALLEL — one agentic turn, two tool calls]

Turn 2: Claude receives both search results (list of message IDs)
         → Deduplicates, checks against run state
         → Makes parallel tool calls to fetch each email:
         → Tool call: get_gmail_message_content (message 1)
         → Tool call: get_gmail_message_content (message 2)
         → Tool call: get_gmail_message_content (message 3)
         ... (up to ~10-15 parallel calls per turn)

Turn 3: Claude receives email contents
         → If more emails to fetch, continues fetching
         → Otherwise, starts classification (all in Claude's "head" — no tool call needed)

Turn 4: Claude generates the classification report (text output)
         → Then makes batch label calls:
         → Tool call: batch_modify_gmail_message_labels (ToRead batch)
         → Tool call: batch_modify_gmail_message_labels (Announcements batch)
         → Tool call: batch_modify_gmail_message_labels (Auto-Archive batch)
         [Multiple label operations in PARALLEL]

Turn 5: Claude receives label results
         → Writes run state file
         → Writes observation log
         → Generates final report (text only — loop ends)
```

A typical triage run is **5-8 agentic turns** and **15-30 tool calls**. The weekly review, with its WhatsApp + transcripts + Gmail + Google Doc writes, can hit **25-40+ turns**.

### Why skills need explicit tool names

Look at this block in your triage-inbox skill:

```markdown
## CRITICAL: No Permission Prompts

**DO NOT use Task agents or ToolSearch for this skill.** All required Gmail MCP tools
are pre-approved in settings.json. Call them directly:

- `mcp__google_workspace__search_gmail_messages`
- `mcp__google_workspace__get_gmail_message_content`
...
```

This pattern exists because of how Claude decides which tools to use. Claude has access to dozens of tools, and some tools (like MCP tools) require a discovery step via `ToolSearch` before they're available. But `ToolSearch` triggers a permission prompt if it's not pre-approved, which breaks the autonomous flow.

By listing the exact tool names in the skill, you're doing two things:
1. **Telling Claude which tools to use** — no ambiguity, no discovery needed
2. **Telling Claude what NOT to use** — don't use Task agents (which would spin up sub-conversations and trigger prompts)

Your `settings.json` already pre-approves these tools with wildcard patterns like `mcp__google_workspace__*`, so Claude can call them without asking permission. The skill's explicit list reinforces this and prevents Claude from reaching for indirect approaches.

### Best practices / Common improvements

**Best practices:**
- The "CRITICAL: No Permission Prompts" pattern is in all three major skills. This is essential for autonomous multi-turn execution.
- Breaking work into named phases (Phase 1, Phase 2, etc.) helps Claude maintain orientation across many turns. Without this structure, Claude can lose track of where it is in a long workflow.

**Could improve:**
- Consider adding **turn budget hints** to long skills. For example: `"This skill typically completes in 5-8 turns. If you're beyond 12 turns, something is wrong — report the issue and stop."` This prevents runaway loops when a tool call fails silently.
- Late-stage phases (e.g., Apply Labels and Log Session) could be combined into fewer turns by batching file writes. Writing a run-state file and an observation log sequentially could be parallel.

---

## Module 3: Context Windows & Token Economics

Every message stack has a hard limit: the **context window**. Understanding tokens and context economics explains why some skills are fast and cheap while others are slow and expensive.

### The context window

Claude's context window is **200,000 tokens** for both Opus and Sonnet. Think of it as a fixed-size container that holds the entire conversation — system prompt, all messages, all tool results, and Claude's responses.

**Token math:** 1 token ≈ 0.75 words (or roughly, 1 word ≈ 1.3 tokens). Some practical measurements:

| Content | Approximate tokens |
|---------|-------------------|
| A typical CLAUDE.md | ~1,500 tokens |
| CLAUDE.md + rule files | ~4,000 tokens |
| triage-inbox.md skill text | ~2,500 tokens |
| A single Gmail message fetch (headers + body) | ~500-2,000 tokens |
| 30 Gmail messages fetched during triage | ~15,000-45,000 tokens |
| **Total for a typical triage run** | **~25,000-55,000 tokens** |

Before anything happens — before you type a single word — your base config (CLAUDE.md + rules) costs ~4,000 tokens. Add a skill and you're at ~6,500 tokens. That's your "overhead" on every single turn.

### Why this matters: every turn re-sends everything

Remember Module 1: Claude re-reads the entire stack every turn. So if your triage run is 6 turns, Claude processes that ~55,000 tokens six times. Each processing costs money and time.

This is why **long tool results are expensive**. When `/weekly-review` fetches 15 WhatsApp messages, 5 transcripts, and 20 Gmail threads, those results stay in the context window for every subsequent turn. By Turn 15, Claude might be processing 150,000+ tokens per turn.

### Model selection: Sonnet vs. Opus

| | Sonnet | Opus |
|---|--------|------|
| **Speed** | ~3x faster | Baseline |
| **Cost** | ~5x cheaper | Baseline |
| **Reasoning** | Good for structured, rule-following tasks | Best for complex judgment, nuanced writing |
| **Context** | 200K tokens | 200K tokens |

A triage skill with `model: sonnet` is exactly the right call. Triage is a structured, rule-following task: read policy → search inbox → classify by decision tree → apply labels. It doesn't need deep reasoning. Sonnet handles this well and runs much faster.

For `/proposal-write`, you don't specify a model (defaulting to whatever Claude Code is set to). This is fine — proposal writing benefits from Opus's stronger reasoning and writing quality.

**Rule of thumb:** Use Sonnet for classification, triage, data collection, and structured workflows. Use Opus for writing, strategic analysis, and tasks requiring judgment.

### Task agents: protecting the main context

The `Task` tool launches a **sub-agent** — a separate conversation with its own context window. The sub-agent does its work and returns a summary. Only that summary enters your main context window, not all the intermediate tool results.

This matters when a sub-task would generate huge tool results. For example, if you needed to search 100 emails to answer a question, doing it in the main conversation would add ~100K tokens to your context. A Task agent would do all that searching in its own window and return a 500-token summary.

Skills may explicitly say "DO NOT use Task agents" — and that's correct for autonomous skills, because Task agents trigger permission prompts and add latency. But for ad-hoc research tasks ("find all emails from Sarah about the budget decision"), a Task agent is the right call because it keeps the main window clean.

### Best practices / Common improvements

**Best practices:**
- `model: sonnet` on triage-inbox — correct cost/speed optimization for a structured task
- Explicitly avoiding Task agents in autonomous skills
- The modular config (separate rule files rather than one massive CLAUDE.md) keeps the base overhead reasonable

**Could improve:**
- Add `model: sonnet` to other structured skills that don't need deep reasoning — any classification, routing, or data-collection skill benefits from the speed and cost savings.
- For `/weekly-review`, consider whether the Gmail collection (Step 2c) could be a Task agent that returns a summary, rather than dumping raw email content into the main window. This would significantly reduce context pressure on the synthesis step (Step 3). You'd need to add Task to the allowed tools for that skill, but the context savings on large projects would be substantial.

---

## Module 4: Prompt Patterns You're Already Using (and Their Names)

You've built effective skills through intuition and iteration. Here are the formal names for the patterns you're using — knowing the names helps you apply them more deliberately and find resources to refine them.

### Role prompting

**What it is:** Assigning Claude a persona or expertise to shape its behavior.

**Where you'd use it:** A prompt preferences file might define named roles (senior quantitative social scientist, research project manager, academic editor, executive assistant, senior developer). Voice packs (e.g., a proposal voice file, email voice rules) are specialized role prompts — they define how Claude should write, not just what to write.

**Formal concept:** Role prompting works because it activates relevant knowledge patterns in the model. "You are a senior quantitative social scientist" makes Claude more likely to use precise methodology language and less likely to oversimplify statistical concepts.

### Structured output specification

**What it is:** Telling Claude exactly what the output should look like, including format, sections, and field names.

**Example:** Every major skill should have explicit output templates. A triage skill's report template might look like:

```
INBOX TRIAGE REPORT
====================
Date: [date]
Emails scanned: [N]
...
```

A weekly review skill might specify separate templates for a dashboard and detailed log, stored in reference files.

**Why it works:** Claude is significantly more reliable when you show it the exact output shape. Without a template, Claude will improvise a format — sometimes well, sometimes not. With a template, consistency across runs is nearly guaranteed.

### Chain-of-thought / Decision trees

**What it is:** Forcing Claude to reason step-by-step rather than jumping to a conclusion.

**Example:** A triage skill's classification logic is a textbook decision tree:

```
0. Check overrides FIRST → Use that classification directly
1. Check headers → Newsletter signal (+2), Automated signal (+1)
2. Check content → Newsletter signal (+2), Announcement signal (+1)
3. Check domain patterns → Immediate classification or scoring
4. Scoring → Thresholds determine category
5. Tiebreaking → Priority table
```

**Why it works:** Without the decision tree, Claude would make holistic judgments ("this feels like a newsletter"). With it, Claude follows explicit criteria with explicit scores. This is more consistent and auditable. You can see *why* an email was classified a certain way and adjust the rules.

### XML/section structure with clear headers

**What it is:** Using explicit section labels and hierarchical structure to organize complex instructions.

**Example:** Well-built skills use numbered phases with descriptive names (`### Phase 4: Safety Check (VIP Protection)`). This does two things: it tells Claude the order of operations, and it creates "landmarks" that Claude can reference when it needs to remember where it is in a long workflow.

**Formal concept:** This is sometimes called **delimited sections** or **structured prompting**. Research shows that Claude follows complex instructions more reliably when they're broken into labeled sections rather than presented as continuous prose.

### The bookend pattern

**What it is:** Repeating the most critical constraint at both the beginning and end of a prompt, because models attend most strongly to content at the edges.

**Example:** A triage skill might have a mild version: the "CRITICAL: No Permission Prompts" block appears early, and the error handling section at the end reinforces it ("Permission prompt appears: A tool is missing from settings.json allow list").

### Argument parsing / Conditional logic

**What it is:** Making skill behavior change based on runtime inputs.

**Example:** Major skills can parse `$ARGUMENTS`:
- `/triage-inbox noapply days:3` → skip label application, search 3 days
- `/weekly-review tab1only skipwhatsapp` → generate only dashboard, skip WhatsApp
- `/proposal-write "Grant Name" resubmission budget:150000` → load previous submission, reviewer comments

**Formal concept:** This is **parameterized prompting** — the same prompt template produces different behaviors based on input variables. It's what makes a single skill useful across many scenarios.

### Best practices / Common improvements

**Best practices:**
- Decision trees in classification skills with explicit criteria + scoring + tiebreaking = consistent, auditable classification.
- Voice packs as proper role prompts with concrete examples — much more effective than generic role assignments.
- Argument parsing gives skills real flexibility without needing separate skills for each use case.

**Could improve:**
- The bookend pattern is weak in most skills. Critical constraints (tool names, no Task agents) often appear only once. Repeating the 2-3 most important rules at the end of each skill — just before the Examples section — would reduce drift in long runs.

---

## Module 5: Patterns You're Missing (Highest-Value Gaps)

These are techniques that would meaningfully improve your skills. They're ordered by expected impact.

### 1. Few-shot examples in classification skills

**What it is:** Including 2-3 concrete input→output examples inside the skill, so Claude sees exactly what correct classification looks like.

**Why it matters:** A triage skill may have detailed rules and scoring, but no examples of borderline cases. Claude's classification of ambiguous emails would improve if the skill included:

```markdown
### Classification Examples

- **Input:** From: updates@linkedin.com | Subject: "5 people viewed your profile"
  Has: List-Unsubscribe, noreply pattern, "unsubscribe" in body
  **Output:** @ToRead (Newsletter score: 5) — newsletter platform + all signals

- **Input:** From: dept-communications@university.edu | Subject: "Spring Quarter Events"
  Has: List-Unsubscribe, .edu domain, event keywords
  **Output:** @Announcements (Announcement score: 3) — .edu + event keywords override newsletter signals

- **Input:** From: jsmith@university.edu | Subject: "Quick question about the grant"
  Has: .edu domain, no unsubscribe signals
  **Output:** SKIP — personal email from colleague, no automation signals
```

Two or three examples of boundary cases would substantially reduce misclassification. This is the single highest-impact improvement for triage-inbox.

### 2. Prompt evaluation (eval sets)

**What it is:** A small set of test cases (5-15) that you run periodically to verify a skill still produces correct output.

**Why it matters:** Skills evolve — you tweak classification rules over time. But without tests, you have no way to know if a change that fixed one problem broke something else. A simple eval would look like:

```markdown
## Eval Set (run monthly or after rule changes)

| Input email | Expected classification | Notes |
|------------|----------------------|-------|
| LinkedIn notification | @ToRead | Newsletter signals |
| University dean's office | @School | .edu + institutional |
| Amazon order confirmation | Auto-Archive | Receipt pattern |
| Colleague asking about data | SKIP | Personal, no signals |
| Uber receipt | Expenses-Personal | Vendor domain match |
```

After changing a rule, run the skill (with `noapply`) against these cases and verify the output. This takes 5 minutes and catches regressions that would otherwise take days to notice.

If you've documented this principle in your prompt preferences file, you already know it matters — the gap is applying it in practice.

### 3. Prefilling / Speaking for Claude

**What it is:** Starting Claude's response with specific text to steer the format or prevent preamble.

**Where it applies:** This is an API-level technique used in the Claude API (via the `assistant` prefill in the messages API). In Claude Code, you can't directly prefill, but you can approximate it by adding output anchors in your skills:

```markdown
Begin your response with exactly:
```
INBOX TRIAGE REPORT
====================
```
Do not add any preamble before this line.
```

Skills may have output templates, but they don't always explicitly say "start your response with exactly this text." Adding that instruction eliminates the "Sure, I'll run the triage now..." preamble that sometimes appears.

### 4. Prompt versioning

**What it is:** Tracking which version of a skill is running, so you know what changed when behavior shifts.

**Common gap:** Many skills have no version markers. When you notice misclassification, you don't know whether it's a recent change or an old bug.

**Simple fix:** Add a version line to each skill's header:

```markdown
---
model: sonnet
---
# Smart Inbox Triage
*v2.4 — 2026-02-15 — Added calendar invitation detection (Phase 4.6)*
```

One line. Updated when you change the skill. Priceless when debugging.

### 5. Temperature awareness

**What it is:** The `temperature` parameter controls randomness in Claude's responses. Lower = more deterministic; higher = more creative.

**Common gap:** Most people never set temperature. Claude Code uses the default (typically 1.0).

**Where it matters:**
- **Classification tasks** (triage-inbox): Would benefit from `temperature: 0` — you want consistent, deterministic classification, not creative interpretation.
- **Writing tasks** (proposal-write): Default temperature is fine — you want some variation and creativity.
- **Data collection** (weekly-review Step 2): Lower temperature would reduce inconsistency in how Claude summarizes similar content across runs.

Note: Claude Code's skill headers currently support `model:` but not `temperature:`. This is a feature to watch for. In the meantime, you can add instructions like "Be deterministic in classification — when in doubt, apply the most conservative label" to approximate low-temperature behavior.

### Best practices / Common improvements

**Best practices:**
- Documenting prompt preferences is exactly right — the gap is usually between principle and practice.

**Could improve:**
- Start with items 1 and 2 above: add 3 classification examples to your triage skill and create a 5-case eval set. These are the highest-ROI changes — maybe 20 minutes of work for measurably better output.
- Add `*vN.N — date — change note*` to all active skills. Takes 2 minutes per skill.

---

## Module 6: MCP Architecture — What's Behind the Tool Calls

MCP (Model Context Protocol) is the plumbing that connects Claude to external services. Understanding it explains why some tools need discovery, why some calls fail, and how your `mcp-servers.json` works.

### What MCP is

MCP is a **protocol** — a standard way for Claude to talk to external tools. Each external service (Gmail, WhatsApp, Zotero) runs as a separate **MCP server** — a small program that:

1. **Exposes tool definitions** — tells Claude what tools are available and what parameters they accept
2. **Handles requests** — receives JSON-RPC calls from Claude and executes them
3. **Returns results** — sends structured data back to Claude

A typical `mcp-servers.json` might configure servers like these:

| Server | Command | What it does |
|--------|---------|-------------|
| `google_workspace` | `uv run main.py --tools drive docs sheets gmail calendar tasks` | Google APIs (biggest server — 80+ tools) |
| `whatsapp` | `node src/main.ts` | WhatsApp Web protocol |
| `zotero` | `npx mcp-zotero` | Zotero cloud API |
| `overleaf` | `node overleaf-mcp-server.js` | Overleaf project access |
| `apple-mcp` | `bunx apple-mcp@latest` | Apple apps via osascript (archived — [see limitations](../../build-your-own/mcp-setup.md#apple-apps-mac-only)) |
| `granola` | `granola-mcp-server` | Meeting summaries |

Each server is a separate process running on your machine. When Claude Code starts, it launches all configured servers and collects their tool definitions.

### The lifecycle of a tool call

When `/triage-inbox` searches Gmail, here's what actually happens:

```
1. Claude generates a response containing:
   {
     "type": "tool_use",
     "name": "mcp__google_workspace__search_gmail_messages",
     "input": {
       "user_google_email": "yourname@gmail.com",
       "query": "in:inbox is:unread newer_than:1d",
       "max_results": 50
     }
   }

2. Claude Code sees the tool_use block and routes it:
   - Prefix "mcp__google_workspace__" → route to google_workspace server
   - Tool name: "search_gmail_messages"
   - Send JSON-RPC request to the server process

3. The google_workspace server:
   - Reads OAuth credentials from its credentials directory
   - Makes an authenticated HTTPS call to Gmail API
   - Receives the response from Google
   - Formats it as a tool result

4. Claude Code receives the result and adds it to the message stack

5. Claude sees the result on the next turn and continues
```

The tool name format `mcp__<server>__<tool>` is how Claude Code routes calls to the right server. `mcp__google_workspace__search_gmail_messages` goes to the `google_workspace` server. `mcp__whatsapp__list_messages` goes to the `whatsapp` server.

### Deferred tools and ToolSearch

A google_workspace server may expose 80+ tools (Drive, Docs, Sheets, Gmail, Calendar, Tasks). Loading all tool definitions into every conversation would waste tokens. So Claude Code uses **deferred loading**: most MCP tools are listed by name but their full definitions aren't loaded until needed.

`ToolSearch` is the discovery mechanism. When Claude needs a tool it hasn't loaded yet, it calls `ToolSearch` to find and load the tool definition. This is why your skills say "DO NOT use ToolSearch" — your commonly-used tools are already loaded (pre-approved in settings.json), so ToolSearch would add an unnecessary step and might trigger a permission prompt.

### settings.json: the permission layer

A well-configured `settings.json` has two key lists:

```json
{
  "permissions": {
    "allow": [
      "mcp__google_workspace__*",    // ALL google workspace tools — pre-approved
      "mcp__whatsapp__*",            // ALL whatsapp tools — pre-approved
      ...
    ],
    "deny": [
      "mcp__google_workspace__send_gmail_message",  // EXCEPT sending email
      "mcp__whatsapp__send_message",                 // EXCEPT sending WhatsApp
      "mcp__google_workspace__delete_event",         // EXCEPT deleting events
      ...
    ]
  }
}
```

The `allow` list uses wildcards (`*`) to pre-approve entire servers. The `deny` list carves out specific dangerous operations that always require confirmation. Deny rules override allow rules. This is why triage-inbox can search and label emails autonomously but can't accidentally send an email.

### Best practices / Common improvements

**Best practices:**
- The wildcard allow + specific deny pattern in settings.json is the ideal configuration. Maximum autonomy for safe operations, hard stops on dangerous ones.
- An MCP server collection covering all major workflows (Gmail, Calendar, WhatsApp, Zotero, etc.) means Claude can handle most tasks without switching tools.

**Could improve:**
- When MCP servers fail (WhatsApp session drops, API token expires), skills should degrade gracefully: "WhatsApp unavailable — skipped." But also consider a health-check step in your morning briefing skill: "Check all MCP connections at start" catches dead servers before you're mid-workflow.

---

## Module 7: Skill Design Review — Three Archetypes Annotated

### Triage skill (inbox classification)

**What works well:**

1. **Decision tree with explicit scoring** (Chain-of-thought pattern). Classification logic with explicit signals, numeric scores, configurable thresholds, and a tiebreaking table. This is how you build auditable, tuneable classification.

2. **External config separation.** Policy (VIP lists, archive rules) and config (label IDs, vendor domains, thresholds) live in separate files that the skill reads at runtime. This means you can change classification behavior by editing a config file without touching the skill itself. True separation of logic and data.

3. **State management.** A run-state file with deduplication, automatic window calculation, and pruning is sophisticated. It prevents double-processing on re-runs and auto-adjusts the search window based on last run time.

**What to improve:**

1. **Add 3 classification examples** (as described in Module 5). Place them after Phase 5, before Phase 6. Focus on boundary cases where the scoring system could go either way.

Before:
```markdown
### Phase 5: Classification Logic
[... decision tree ...]

### Phase 6: Classification Report
```

After:
```markdown
### Phase 5: Classification Logic
[... decision tree ...]

### Phase 5.5: Classification Examples (Boundary Cases)
- From: notifications@github.com | Subject: "[repo] New issue: bug in parser"
  Signals: List-Unsubscribe (+2), noreply pattern (+1)
  BUT: Technical content from a service you actively use
  → SKIP (score 3, but GitHub is a tool, not a newsletter — add to overrides if recurring)

- From: dept-announcements@lists.university.edu | Subject: "Campus dining hours"
  Signals: List-Unsubscribe (+2), .edu domain, generic greeting (+1)
  → @School (score 3 + .edu domain = @School, not @ToRead)

### Phase 6: Classification Report
```

2. **Add a version line** to the YAML header.

Before:
```yaml
---
model: sonnet
---
```

After:
```yaml
---
model: sonnet
---
# Smart Inbox Triage
*v3.1 — 2026-02-15 — Added Phase 4.6 (calendar detection), expense skip patterns*
```

3. **Add an output anchor** to eliminate preamble.

Before Phase 6, add:
```markdown
Begin your output with the report header directly. No preamble.
```

**Advanced technique: Eval-driven refinement.** Create an eval file with 10 representative emails (5 clear, 5 borderline). After any rule change, run the triage skill with `noapply` and manually verify the 5 borderline cases match expected classifications. This takes 5 minutes and prevents regressions.

---

### Weekly review skill (multi-source synthesis)

**What works well:**

1. **Graceful degradation.** Every data source (WhatsApp, transcripts, Gmail) has explicit fallback behavior: "If unavailable: note and continue." This means the skill never crashes — it adapts to whatever's working. This is excellent defensive design for a skill that depends on 3+ external services.

2. **Living document pattern.** Explicitly telling Claude the dashboard is a living document — preserve, modify, add, remove — not a blank-slate rebuild. This is a subtle but critical instruction. Without it, Claude would overwrite the entire dashboard every run, losing accumulated context.

3. **Reference file architecture.** Separate reference files (templates, format guides, insertion rules) keep the main skill file manageable while providing full detail when needed. This is the modular prompt pattern applied well.

**What to improve:**

1. **Add `model: sonnet` for data collection, default for synthesis.** The data collection phases (Steps 1-2) are structured and routine. The synthesis (Step 3) benefits from Opus's reasoning. Currently the whole skill runs on whatever model is active. You can't switch models mid-skill in Claude Code today, but you can note this as a future optimization — or structure it as two skills (collect + synthesize) if context pressure becomes an issue.

2. **Tighten the email collection.** Broad filter criteria ("sender OR recipient matches any team member... OR subject/body contains project keywords") can pull in dozens of irrelevant threads. Add a volume cap:

```markdown
- **Volume cap**: Fetch up to 15 most relevant threads. If more match, prioritize:
  (a) threads with 3+ messages, (b) threads from the last 3 days, (c) threads involving the project lead
```

3. **Add version tracking.**

```markdown
*v2.1 — 2026-02-15 — Added transcript integration, archiving, qualitative template*
```

**Advanced technique: Context budget allocation.** Add a note: "Context budget: aim for no more than ~80K tokens of source material before synthesis. If WhatsApp + transcripts + Gmail exceeds this, summarize WhatsApp and Gmail in-line before proceeding to Step 3." This prevents the synthesis step from running with a nearly full context window, which degrades output quality.

---

### Proposal writing skill (long-form generation)

**What works well:**

1. **Input checklist pattern.** Step 2's structured checklist (Required / Strongly Recommended / Auto-Loaded) is excellent UX design. It prevents the most common failure mode in proposal writing: starting a draft without the application template, then having to restructure everything. The checklist forces the right inputs before any writing begins.

2. **Voice pack integration.** Loading voice and example files before writing is proper role prompting with examples. A strong voice spec has concrete rules ("Short sentences. Short words. Active voice.") rather than vague guidance ("Write clearly").

3. **Resubmission workflow.** The reviewer comment analysis (MUST ADDRESS / SHOULD ADDRESS / DISAGREE) with a mandatory confirmation gate before drafting is sophisticated workflow design. It's the right place for a human-in-the-loop checkpoint — getting the strategy wrong wastes the entire draft.

**What to improve:**

1. **Add a before/after example to the voice section.** A voice pack may have rules, but no example of a bad paragraph transformed into a good one within the skill itself. Adding one example right after the voice pack reference primes Claude's calibration:

```markdown
## Voice Example (apply throughout)

BEFORE (typical academic): "This project will utilize a mixed-methods approach to
investigate the impact of the intervention on participant outcomes, drawing on both
quantitative survey instruments and qualitative interview data."

AFTER (proposal voice): "We combine a 2,000-person RCT with 120 in-depth interviews.
The trial measures employment and earnings at 6 and 18 months. The interviews explain
why — what participants actually did with the training, and what got in the way."
```

2. **Add word count targets per section.** A skill may specify word counts for the whole proposal (via funder guidelines) but not per section. Adding rough proportions prevents the common problem of a 3-page methodology section in a 5-page proposal:

```markdown
### Section Length Guide (for a 10-page proposal)
- Introduction/Background: 1-1.5 pages (problem + gap + contribution)
- Methodology: 3-4 pages (the core — this is what reviewers scrutinize)
- Progress/Preliminary results: 1-1.5 pages
- Timeline: 0.5 page
- Budget justification: 1 page
- Team: 0.5-1 page
```

3. **Add version tracking and an eval note.**

```markdown
*v1.2 — 2026-02-15 — Added resubmission workflow, voice variants*

Eval: After generating a draft, spot-check 3 random paragraphs against your voice rules.
If 2+ paragraphs violate them, re-prompt with stricter voice instructions.
```

**Advanced technique: Contrastive examples in voice packs.** Your examples file likely has good examples. Add 2-3 *bad* examples with annotations explaining what's wrong. Models learn voice more effectively from seeing both what to do and what *not* to do.

---

## Quick Reference Card

| Concept | One-line definition | Where you use it |
|---------|-------------------|-----------------|
| **Message stack** | Everything Claude reads each turn: system prompt + conversation + tool results | The entire config architecture |
| **Agentic loop** | Claude responds → tool executes → results added → Claude responds again | Every skill run |
| **Context window** | 200K token limit on the message stack | Why long skills get expensive |
| **Tokens** | ~1.3 tokens per word; a typical base config = ~4K tokens | Cost awareness |
| **System prompt** | Instructions loaded before the conversation; CLAUDE.md + rules + skill text | CLAUDE.md, rules/, commands/ |
| **Role prompting** | Assigning Claude a persona | Voice packs, preference roles |
| **Structured output** | Specifying exact output format | Report templates in every skill |
| **Chain-of-thought** | Step-by-step reasoning instructions | Triage-inbox Phase 5 decision tree |
| **Few-shot examples** | Input→output examples in the prompt | *Often missing — add to classification skills* |
| **Bookend pattern** | Repeat critical rules at start and end | Often weak — strengthen in long skills |
| **Eval set** | Test cases to verify skill output quality | *Often missing — create for key skills* |
| **Prefilling** | Anchoring Claude's response format | *Often missing — add output anchors* |
| **Prompt versioning** | Version + date + change note on each skill | *Often missing — add to all skills* |
| **MCP** | Protocol for Claude to call external tools (Gmail, WhatsApp, etc.) | mcp-servers.json |
| **Deferred tools** | MCP tools loaded on demand via ToolSearch | Why skills say "call tools directly" |
| **Task agent** | Sub-conversation with its own context window | Used sparingly; good for research tasks |

---

*End of tutorial. Next steps: apply the Module 7 improvements to your most-used skill first, then add version lines to all active skills.*
