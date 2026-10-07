---
hide:
  - navigation
  - toc
description: How the weekly review skill updates a living project dashboard in Google Docs — three-marker boundaries, batch writes, and the placeholder trick that stops Google Docs from mangling emoji.
---

# Weekly Review: The Mechanics

A weekly project review that writes to a Google Doc sounds simple. In practice it fails in three specific ways until you solve them: the doc grows arbitrarily, the API writes cost a fortune in call overhead, and Google Docs silently corrupts anything that contains emoji. Here's how `/weekly-review` handles each.

The [Project Management](project-management.md#layer-3-the-weekly-review) page covers what the weekly review produces and why it earns its keep. This page covers how it actually writes to the doc without breaking.

---

## The three-marker system

The weekly review has two outputs, written to two tabs:

- **Tab 1** — a project status dashboard. This gets *overwritten* every week with fresh content, preserving any detail that hasn't changed.
- **Tab 2** — a weekly log. This gets *prepended* — new weeks on top, old weeks preserved below.

If you ask an AI to "update the dashboard," you get either a full doc rewrite (slow, lossy, formatting destroyed) or an append-only log (which grows forever and isn't a dashboard). The fix is three markers that define the region to replace:

```
=== PROJECT STATUS DASHBOARD ===
(dashboard content — replaced each run)
=== DASHBOARD END ===

(weekly log — prepended each run)

=== WEEKLY SUMMARIES START ===
(historical archive — untouched)
```

`/weekly-review` reads the markers, replaces only the dashboard block, prepends the new weekly log between `DASHBOARD END` and `WEEKLY SUMMARIES START`, and leaves everything below the last marker alone. If the markers aren't there, it stops and reports — it doesn't guess.

---

## Batch writes, not sequential edits

A naïve implementation of "update the dashboard" makes one API call per change: one to delete the old paragraph, one to insert the new one, one to bold a name, one to apply a heading style, and so on. For a real weekly review with ten or twenty updates, this is 20–30 API calls. Each one has its own latency and its own chance to fail.

The fix is `batch_update_doc` — Google Docs accepts a single call containing an ordered list of operations (delete, insert, format, style). `/weekly-review` bundles the entire write into one or two batch calls. A week's dashboard rewrite goes from 20–30 MCP calls to 1–3.

Two practical notes:

- **Order matters inside a batch.** Deletes must happen before inserts at the same index, or the indices drift. The skill sorts operations explicitly.
- **Formatting is applied via API, not markdown.** `**bold**` in the text stays as literal asterisks. Bold is applied as a separate operation with character ranges.

---

## The emoji placeholder trick

Google Docs tracks document positions by UTF-16 code units. Most emoji use surrogate pairs (two code units for one visible character). If you insert an emoji at position N and then reference position N+1 later in the same batch, you've just written into the middle of the emoji. The result is silent corruption — text appears in the wrong place, formatting targets the wrong range, and the document looks fine until you open it a week later and find gibberish.

`/weekly-review` never writes real emoji into the batch. It writes ASCII placeholders:

```
[RED] Team disagreement on the primary outcome
[GREEN] Recruitment target hit for Site 3
[YELLOW] IRB amendment still pending at two sites
```

Then a final post-write phase does a simple find-and-replace: `[RED]` → 🔴, `[GREEN]` → 🟢, `[YELLOW]` → 🟡. By that point the batch writes have committed with correct indices and the swap is a pure string replacement that can't corrupt anything.

This is the kind of bug that won't show up on day one. It shows up the third week, when someone opens the dashboard and finds a bold range applied to the word "pending" in the middle of a paragraph about recruitment. Use placeholders.

---

## The `skip_meeting_log` flag

Not every project has meeting transcripts. Some projects are administered through email and documents only; some have meetings that are confidential enough that no transcript should live in the weekly review.

Each project's config (a small JSON file in the project folder) can set `skip_meeting_log: true`. When set, `/weekly-review` skips Tab 2 generation and the weekly log prepend. Tab 1's dashboard still updates — status and action items are extracted from transcripts and WhatsApp for synthesis, but meeting records aren't written.

One flag, one line of config, covers the asymmetry between projects without forking the skill.

---

## When the skill itself is the wrong answer

Three situations where I don't reach for `/weekly-review`:

1. **New project, first two weeks.** There isn't enough history to review. I'm just setting up the folder and writing the project charter.
2. **Project is winding down.** Weekly reviews become monthly, then stop. A final handover document replaces them.
3. **Project is confidential to the point where a Google Doc isn't appropriate.** The dashboard lives in a local markdown file in an encrypted folder. The weekly synthesis is manual.

The skill is a tool. It's for the 80% of projects where a living Google Doc is the right format.

---

## Related

- **[Project Management](project-management.md)** — the full four-layer system `/weekly-review` lives inside.
- **[Meeting workflow](meeting-workflow.md)** — how transcripts get captured in the first place.
- **[Session management](../essentials/session-management.md)** — why I run `/weekly-review` in a dedicated session rather than between other tasks.
- **[What's new in April 2026](../changelog.md)**.
