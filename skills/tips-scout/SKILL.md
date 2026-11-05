---
name: tips-scout
description: "Prepare and dispatch a targeted Grok research prompt for new AI tips, with a manual fallback when the configured CLI is unavailable."
---

# Tips Scout
*v2.0 — Direct Grok API dispatch via `grok-cli`. Eliminates the paste-loop. Paste-loop preserved as fallback if Grok unavailable.*
*v1.1 — Parallel reads, context-efficient, performance logging*

Generate a customized Grok DeepSearch prompt based on current coverage gaps and active investigation topics. **Default behavior (v2.0):** dispatch the prompt directly via `grok-cli` and land the response ready for `/tips-curate`. **Fallback:** if `$GROK_BIN` or `$GROK_API_KEY` is missing, degrade gracefully to prompt-file-for-paste (the v1.x behavior). Run weekly (Sunday/Monday) before `/tips-curate`.

Use when you want a targeted weekly search prompt — "scout for tips," "generate Grok prompt," "tips scout," or "what should I search for this week."

## Pre-approved tools

- Read (for tips log, todo items, base prompt)
- Bash (for Grok dispatch + existence checks — v2.0 addition)

This skill does NOT use Task agents.

## Steps

### Step 0: Check for `base` Argument

If the `base` argument was given (e.g., `/tips-scout base`), read ONLY the base prompt file and skip to Step 5 to output it unchanged. Do not read the tips log or todo file.

### Step 1: Read All Source Files (in parallel)

Read all three files simultaneously using parallel Read calls:

1. **Base prompt**: Your Grok search prompt template file (a markdown file with search categories, key accounts, and output format instructions). Default location: `~/.claude/references/grok-weekly-search-prompt.md`.
2. **Tips log**: Your collected tips log — read only the first **150 lines**. Recent entries are at the bottom, so if the file is large, read from the end. The log uses `## YYYY-MM-DD` date headers. Stop counting once you reach a date older than 14 days.
3. **Todo items**: Your active todo file — read only lines 1-100 (covers the "Active (Current Focus)" section). Do not read Someday/Ideas or Completed sections.

Extract the base prompt text between `## The Prompt (copy everything below this line)` and the next `---` separator. If no `---` follows, read to end of file.

### Step 2: Analyze Recent Coverage

From the tips log entries in the **last 14 days** (use today's date from system context; entries use `## YYYY-MM-DD` format), count entries by mapping tags to categories:

| Category | Matching Tags | Target Share |
|----------|--------------|-------------|
| Skill & Agent Architecture | `[skill-design]` or `[agent-pattern]` | 30% |
| Claude Code Features & Releases | `[tool]` (without GitHub URL) | 25% |
| Academic & Research Workflows | `[workflow]` | 20% |
| New Repos & Tools | `[mcp]` or entries with github.com URL | 15% |
| Obsidian + Claude Code | entries mentioning "Obsidian" | 10% |

Note: These categories use the same tag taxonomy defined in `/tips-curate` Step 2. A single tip can match multiple categories.

**Boost rule:**
- **⬆ BOOST**: Category has 0 entries in the last 14 days
- **⬇ DE-EMPHASIZE**: Category has 50%+ of all entries in the last 14 days
- **OK**: Everything else

**Edge case**: If entries exist but none fall within the last 14 days, treat all categories as ⬆ BOOST and note: "No tips in last 14 days — all categories boosted."

### Step 3: Extract Active Topics

From the todo file's "Active (Current Focus)" section (already read in Step 1), find items marked TODO or IN PROGRESS. Extract **3-5 keyword themes** that represent what you're currently investigating. Examples: "deterministic triage," "skills migration to SKILL.md format," "travel search API."

Skip completed items. If no TODO/IN PROGRESS items are found, omit the BONUS section in Step 4 and note: "No active investigations found — skipping topic injection."

### Step 4: Customize the Prompt

Starting from the base prompt, apply these modifications:

1. **Boosted categories** (⬆): After the category's `**N. CATEGORY NAME**` header, insert:
   > ⬆ PRIORITY THIS WEEK: I haven't seen much on this topic lately — dig deeper, lower the engagement threshold, and surface anything substantive.

2. **De-emphasized categories** (⬇): After the category's header, insert:
   > I'm well-covered here this week — only surface truly exceptional or novel posts.

3. **Active topics**: Insert a new section BEFORE the `**SKIP:**` line:

```
**BONUS: ACTIVE INVESTIGATIONS**
I'm currently working on these topics — posts about any of them are especially valuable even if they don't fit the categories above:
- [topic 1]
- [topic 2]
- [topic 3]
```

4. **New key accounts**: If any tips in the last 14 days came from accounts NOT already in the base prompt's key account lists, append them to the relevant category with a note: `(new — added [date])`.

Do NOT change the FORMAT section, SKIP rules, or follow-up prompts.

### Step 5: Output

Display results in this format:

```
────────────────────
TIPS SCOUT — Customized Grok Prompt
────────────────────

Coverage analysis (last 14 days, [N] total tips):
  Skill/Agent Architecture: [N] entries  [⬆ BOOST / OK / ⬇ heavy]
  Claude Code Features:     [N] entries  [⬆ BOOST / OK / ⬇ heavy]
  Academic Workflows:       [N] entries  [⬆ BOOST / OK / ⬇ heavy]
  New Repos & Tools:        [N] entries  [⬆ BOOST / OK / ⬇ heavy]
  Obsidian + Claude Code:   [N] entries  [⬆ BOOST / OK / ⬇ heavy]

Active topics injected: [comma-separated list]
New accounts added: [list or "none"]
```

Then output the customized prompt in a fenced code block:

````
```
[full customized prompt — ready to paste into Grok DeepSearch]
```
````

**Save the prompt to file:** Write the customized prompt (just the prompt text, no coverage analysis or next-steps) to your tips-pipeline directory as `grok-prompt-YYYY-MM-DD.md`.

### Step 5.5: Dispatch Grok API directly (v2.0 — default path)

**Load Grok config** from your local config file. Values needed: `GROK_BIN`, `GROK_MODEL_DEEP` (use the deep model — DeepSearch-equivalent scouting wants quality over speed), `GROK_FORMAT`, `GROK_API_KEY_VAR`.

**Pre-flight existence check:**
```bash
if [ -z "$GROK_BIN" ] || [ ! -x "$GROK_BIN" ]; then
  echo "grok-cli not installed — falling back to paste-loop."
  FALLBACK=1
elif [ -z "$GROK_API_KEY" ]; then
  echo "GROK_API_KEY not set — falling back to paste-loop."
  FALLBACK=1
else
  FALLBACK=0
fi
```

**If `FALLBACK=1`:** skip to Step 6 (paste-loop) — print the v1.x "Next steps" message.

**If `FALLBACK=0` (default path):** dispatch the prompt via grok-cli:

```bash
PROMPT_FILE=~/.claude-assistant/tips-pipeline/grok-prompt-$(date +%Y-%m-%d).md
OUT_JSONL=~/.claude-assistant/tips-pipeline/grok-response-$(date +%Y-%m-%d).jsonl
OUT_MD=~/.claude-assistant/tips-pipeline/grok-response-$(date +%Y-%m-%d).md

"$GROK_BIN" -p "$(cat "$PROMPT_FILE")" \
  --model "$GROK_MODEL_DEEP" \
  --format "$GROK_FORMAT" \
  > "$OUT_JSONL" 2>/tmp/tips-scout-grok-$(date +%Y-%m-%d).stderr

# Fold NDJSON event stream into final markdown
jq -sr 'map(select(.content) | .content) | join("")' "$OUT_JSONL" > "$OUT_MD"

# Prepend frontmatter for downstream /tips-curate ingestion
{
  echo "---"
  echo "date: $(date +%Y-%m-%d)"
  echo "source: grok-api"
  echo "model: $GROK_MODEL_DEEP"
  echo "prompt_file: $(basename $PROMPT_FILE)"
  echo "---"
  echo ""
  cat "$OUT_MD"
} > "$OUT_MD.tmp" && mv "$OUT_MD.tmp" "$OUT_MD"
```

**On dispatch failure** (non-zero exit, empty output, or auth error): warn and fall back to paste-loop.

**On success:** report to the user with file path + suggestion to run `/tips-curate` to process.

### Step 6: Next steps message (branch on dispatch outcome)

End with ONE of the two messages below depending on whether Step 5.5 dispatched successfully.

**If Grok dispatch succeeded (v2.0 default):**
```
Grok response saved to:
~/.claude-assistant/tips-pipeline/grok-response-YYYY-MM-DD.md

Next steps:
1. Run /tips-curate to process the response
2. (Optional) side-by-side compare against browser Grok DeepSearch if quality feels off
```

**If fallback to paste-loop (v1.x behavior):**

```
Next steps:
1. Open ~/.claude-assistant/tips-pipeline/grok-prompt-YYYY-MM-DD.md
2. Paste into Grok DeepSearch (free tier — no Projects needed)
3. Forward best finds to your tips inbox (e.g., yourself+todo@gmail.com)
4. Run /tips-curate to process

To enable direct API dispatch, install grok-cli and set GROK_API_KEY in your environment, then point this skill at them via your local config.
```

### Step 7: Log Performance

```bash
echo "$(date +%Y-%m-%d),tips-scout,TOOL_CALLS,notes" >> ~/.claude-assistant/logs/skill-performance.csv
```

Replace TOOL_CALLS with your exact count of tool uses this run (no `~` prefix). Replace `notes` with a brief summary like `5-boost-0-deemph-3-topics-grok-api` or `base-only-paste-fallback`. Include `grok-api` vs `paste-fallback` in notes so you can track adoption of the v2.0 default path.

## Error Handling

- **Base prompt file missing**: "Base prompt not found. Create a Grok search prompt template with categories, key accounts, and output format instructions."
- **Tips log missing or empty**: Use base prompt without customization. Note: "No recent tips found — using base prompt without coverage adjustments."
- **Tips log has entries but none in last 14 days**: Treat all categories as ⬆ BOOST. Note in output.
- **Todo file missing**: Skip active topics injection. Note: "No todo file found — skipping topic injection."
- **Todo file has no TODO/IN PROGRESS items**: Omit BONUS section. Note in output.
- **`grok-cli` or `GROK_API_KEY` missing**: Fall back to paste-loop with a one-line user-visible note.

## Examples

```
/tips-scout              # Generate customized Grok prompt
/tips-scout base         # Output base prompt without customization
```

## Integration Notes

- `/tips-curate` Step 4 output reminds you to run `/tips-scout` for next week
- The base prompt template defines categories, key accounts, and skip rules — edit it directly to customize
- This skill reads only; it never modifies the base prompt file
- Coverage analysis window is 14 days to smooth out weekly variation

## Customization Points

1. **Base prompt location:** Default path used in this skill is `~/.claude/references/grok-weekly-search-prompt.md`. Adjust to wherever you keep your search-prompt template.
2. **Tips log + todo file paths:** Default `~/.claude-assistant/tips-pipeline/collected-tips-log.md` and your active todo file. Adjust to your structure.
3. **Tips-pipeline directory:** Default `~/.claude-assistant/tips-pipeline/`. Where prompt and response files land.
4. **Grok config file:** A small file with `GROK_BIN`, `GROK_MODEL_DEEP`, `GROK_FORMAT`, and the API-key var name. If you don't use `grok-cli`, leave these unset and the skill falls back to paste-loop.
