---
name: todo-add
description: "Add a task to the appropriate configured to-do list while checking for duplicates."
---

# Add To-Do Item
*v1.1 — Adapted for public use*

Add a new to-do item to the correct list with duplicate checking.

## Instructions

### 1. Get the item details

If not provided by the user, ask:
- What's the task? (brief description)
- Any additional context?

### 2. Determine the correct list

Based on the item content, suggest the appropriate list using the routing table below. This table is an example — customize it to match your own lists and keywords.

| Keywords/Topics | Suggested List |
|----------------|----------------|
| config, settings, infrastructure, setup, tools | **Main** |
| email, calendar, briefing, scheduling | **Work** |

Present your suggestion:
```
This sounds like a [Main/Work] item because [reason].

Suggested list: ~/Documents/todo.md
Priority: [High/Medium/Low]

Is this correct, or should it go elsewhere?
```

### 3. Check for duplicates

Read the target TODO file and scan for similar items. Check for:
- Same keywords in item titles
- Related tasks that might overlap
- Items that could be expanded instead of duplicated

If potential duplicate found:
```
Potential duplicate detected:

Existing item: "[item title]"
Location: [file path], [priority level]

Options:
1. Add anyway (they're different enough)
2. Update the existing item instead
3. Cancel
```

### 4. Add the item

Once confirmed, add to the appropriate section with this format:
```markdown
- [ ] **[Item title]**
  - [Context/details if provided]
```

Update the "Last updated" date in the file header.

### 5. Confirm

```
Added to [list name]:
  - [ ] **[Item title]**

Priority: [High/Medium/Low]
```

## File Locations

- **Main:** `~/Documents/todo.md`

Add more lists by creating additional todo files and adding them here. For example:
- **Work:** `~/Documents/todo-work.md`
- **Personal:** `~/Documents/todo-personal.md`

## Priority Definitions

| Priority | When to use |
|----------|-------------|
| **High** | Blocking progress, causing problems, or time-sensitive |
| **Medium** | Would improve things but not blocking |
| **Low** | Nice to have, someday |

## Notes

- If the user specifies a list directly, skip the routing suggestion
- If the user specifies priority, use it; otherwise suggest based on urgency cues

---

## Customization Points

**To set up this skill for your workflow:**

1. **File locations**: Edit the "File Locations" section to point to your actual todo files. You can use any number of lists — one file per list works well.

2. **Keyword routing table**: Edit the table in Step 2 to reflect your own categories. For example, if you have a "Research" list, add a row like `| papers, data, analysis, literature | **Research** |`.

3. **Priority mapping**: If your todo files use different section names (e.g., "Active" / "Up Next" / "Someday" instead of "High" / "Medium" / "Low"), add a mapping note. For example:
   ```
   High → Active
   Medium → Up Next
   Low → Someday
   ```

4. **Single vs. multi-list**: If you only use one todo file, you can simplify this skill by removing the routing logic in Step 2 entirely and hardcoding the single file path.

5. **Item format**: The default format uses `- [ ] **Title**` with indented context. Adjust to match your existing todo file format (e.g., plain `- [ ] Title` or numbered lists).
