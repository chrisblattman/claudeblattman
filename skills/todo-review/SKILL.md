---
name: todo-review
description: "Review and consolidate tasks across configured to-do files."
---

# To-Do Review
*v1.1 — Adapted for public use*

Review and consolidate to-do items across all your todo files.

**Argument:** `$ARGUMENTS`
- No argument = quick summary (High Priority only)
- `full` = comprehensive view (all priority levels)

## Instructions

### 1. Read all TODO files

Read each file listed in the "File Locations" section below.

### 2. Check for duplicates

Scan all files for potential duplicates by looking for:
- Same keywords in item titles
- Items that reference the same tools or systems
- Tasks that could be consolidated

### 3. Display consolidated view

#### Mode Detection

Check `$ARGUMENTS`:
- If empty or not "full" → Quick mode
- If "full" → Full mode

---

## Quick Mode Output (default)

```
## TO-DO REVIEW — [DATE]

### Summary

| List | High | Medium | Low | **Total** |
|------|------|--------|-----|-----------|
| Main | X | Y | Z | X |
| Work | X | Y | Z | X |
| **TOTAL** | **X** | **Y** | **Z** | **X** |

### Duplicates/Overlaps (N found)

1. **[Topic]**
   - Main: "[Item text]"
   - Work: "[Item text]"
   → Recommend: [Action]

[Or if none: "### Duplicates/Overlaps (None)"]

### High Priority

**Main**
- [ ] Item 1
- [ ] Item 2

**Work**
- [ ] Item 1

### Recently Completed (Last 7 days)
- [date]: Item (List)
- [date]: Item (List)

---
*Quick view. Run `/todo-review full` for Medium/Low priority items.*
```

---

## Full Mode Output

Show everything from Quick Mode, PLUS add these sections after "Recently Completed":

```
### Medium Priority

**Main**
- [ ] Item 1
- [ ] Item 2

**Work**
- [ ] Item 1
- [ ] Item 2

### Low Priority

**Main**
- [ ] Item 1

**Work**
- [ ] Item 1
- [ ] Item 2

---
*Full view showing all priorities.*
```

---

### 4. Prompt for action

```
Options:
1. Reprioritize an item
2. Mark something complete
3. Add a new item (runs /todo-add)
4. Remove a duplicate
5. Done

What would you like to do?
```

### 5. Update timestamps

If any changes made, update "Last reviewed" or "Last updated" in affected files.

## Priority Mapping

If your todo files use different section names, map them here:

| Standard | Alternative Names |
|----------|-------------------|
| High | Active, Urgent, Now |
| Medium | Up Next, Soon, Normal |
| Low | Someday, Later, Backlog |

## File Locations

Configure your todo files here:

- **Main:** `~/Documents/todo.md`

Add more lists as needed:
- **Work:** `~/Documents/todo-work.md`
- **Personal:** `~/Documents/todo-personal.md`

## Notes

- Keep output concise — this is for quick status checks
- Don't modify files unless explicitly asked
- Duplicates section must show count in header and number each duplicate

---

## Customization Points

**To set up this skill for your workflow:**

1. **File locations**: Edit the "File Locations" section to list all your todo files. Each file becomes a named list in the review output. You can have as many as you need.

2. **List display names**: The bold label before each path (e.g., "Main", "Work") is what appears in the summary table and section headers. Name them whatever makes sense for you.

3. **Priority section names**: If your todo files use section headers like "## Active" instead of "## High Priority", update the Priority Mapping table so the skill knows how to categorize items.

4. **Quick vs. Full mode**: By default, quick mode shows only High Priority items. If you want quick mode to also include Medium, move that section up into the Quick Mode Output template.

5. **Special sections**: If any of your lists have unique sections (e.g., "Decisions Needed", "Waiting On Others"), add them to the Full Mode Output template so they get surfaced during review.

6. **Summary table columns**: The default table shows High/Medium/Low counts. If you use different priority tiers (e.g., P0/P1/P2/P3), adjust the column headers to match.

7. **Action prompt**: The action menu references `/todo-add` for adding new items. If you renamed that skill, update the reference in Step 4.
