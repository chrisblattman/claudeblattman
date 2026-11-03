# Contributing to Claude Blattman

This guide is primarily for site maintainers, but contributions from others are welcome too.

---

## How the Site Works

The site is built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/). Content is written in Markdown files inside the `docs/` folder. Approved changes merged into `main` deploy through GitHub Actions.

**The workflow:**
1. Start a small branch from the agreed current base, preserving other authors' unfinished work.
2. Edit the relevant files, run the checks, and push that branch.
3. Open a pull request and inspect its automatic draft-preview link.
4. Coordinate review and publishing with the maintainer. Merging into `main` publishes the changes.

See [Editing drafts and sharing previews](DRAFT_EDITING.md) for the branch, preview and publication boundaries.

---

## Editing Content

### Using GitHub's Web Editor (Easiest)

1. Navigate to the file on GitHub
2. Click the pencil icon (Edit this file)
3. Make your changes
4. Write a commit message describing what you changed
5. Commit to a new branch and open a pull request for review

Pull requests from branches in this repository receive a preview. Forked contributions need a maintainer to coordinate the preview. The live site changes only after the publishing merge.

### Using a Local Clone (More Powerful)

```bash
git clone https://github.com/chrisblattman/claudeblattman.git
cd claudeblattman

# Optional: preview locally
pip install -r requirements.txt
mkdocs serve
# Open http://localhost:8000

# Make changes on a separate branch
git switch -c draft/your-change
git add path/to/changed-file
git commit -m "Description of changes"
git push -u origin draft/your-change
```

Open a pull request and review its preview before publishing. Use a fresh independent clone for each collaborator rather than sharing a checkout through a file-sync folder.

---

## Adding a New Page

1. Create a new `.md` file in the appropriate `docs/` subdirectory
2. Add the page to the `nav:` section of `mkdocs.yml`
3. Commit both files

### Page Template

Every content page should start with a clear `# Title` heading. The site-wide announcement bar (configured in `overrides/main.html`) handles any preview/beta messaging — do not add per-page preview warnings.

---

## Adding a New Skill to the Library

1. **Sanitize the skill** (see Sanitization Checklist below)
2. Save a maintained standalone skill in `skills/<skill-name>/SKILL.md`, with `name` and `description` metadata. Keep any required references, scripts, licence and source attribution in that folder.
3. Add it to `skills/README.md` with its purpose, actual dependencies, supported apps and installation/update guide. Distinguish a tested package from an example to read and adapt. Do not advertise missing helpers as bundled files.
4. Test a fresh install, invocation, reference access and update in the apps you claim to support. Preserve users' customizations and check for older same-named commands or plugins.
5. If a website recommendation is added, link to its guide and update `mkdocs.yml` as needed. The former exhaustive Skill Library page is retired.
6. Run the existing release checks, open a pull request and review its preview before publishing.

The starter kit has one source in `starter-kit-source/`. Use the repository's package builder and checks for changes to that bundle, rather than editing the generated Claude and Codex copies independently. Older flat files in `skills/` remain reference material unless deliberately promoted to maintained packages.

---

## Adding a Resource

Append to `docs/resources.md` following the existing format:

```markdown
| [Resource Name](URL) | One-line description | YYYY-MM |
```

---

## Sanitization Checklist

**Run all four passes before pushing any skill-related changes.**

### Pass 1 — Personal Identifiers

Search for and remove any personal names, phone numbers, email addresses, or institutional details that shouldn't be public.

```bash
# Family / RA / collaborator names live in .sanitize-names.local (gitignored — never
# published; a literal name list embedded HERE would itself leak in this public repo):
grep -rniE -f .sanitize-names.local docs/ skills/ agents/ templates/ 2>/dev/null || echo "(create .sanitize-names.local locally — one name/pattern per line)"
# Personal emails + phone numbers (generic patterns, safe to publish):
grep -rniE '[a-z0-9._%+-]+@(gmail\.com|uchicago\.edu)|\(?[0-9]{3}\)?[-. ][0-9]{3}[-. ][0-9]{4}' docs/ skills/ agents/ templates/
```

("claudeblattman" the site name is fine; `blattman@`/personal `@gmail.com`/`@uchicago.edu` addresses are not. The name list is kept out of this file deliberately — see `.sanitize-names.local`.)

### Pass 2 — Hardcoded Paths

```bash
grep -rniE '~/Dropbox|/Users/[a-z]|Dropbox/(Claude|Codex|AI_Projects|Research)' docs/ skills/ agents/ templates/
```

Replace with generic paths like `~/Documents/` or `~/.claude/`.

### Pass 3 — Project-Specific References

```bash
grep -rniE 'gang entry|gangrule|medellin|webcamming|bogota|cdmx|mental health|civilian alternatives|ppv evaluation|uchicago-bfi-blattman' docs/ skills/ agents/ templates/
```

Replace with generic examples.

### Pass 4 — Manual Read-Through

Read every file in `skills/` and `agents/` end-to-end. Automated grep catches patterns but misses context (e.g., examples using real project details).

### Pre-commit canary (run before every push that touches skills/ or agents/)

A single grep that catches the most common sanitization slips:

```bash
grep -rnE 'Proposal_Resources|/Users/chrisblattman|Dropbox/(Claude|Codex|AI_Projects)|HPP-Blattman|/Settings/(scripts|rules|logs|state)/|blattman@gmail|blattman\+todo|claudeblattman@gmail|Label_[0-9]+|[a-z0-9]{6,}@(g\.us|lid)|[a-z0-9]{16,}@group\.calendar\.google\.com|uchicago-bfi-blattman|PVT[A-Za-z]*_[A-Za-z0-9]+|\$[0-9]{2,3},[0-9]{3}|\.granola-api-key' skills/ agents/ templates/
# Names handled separately (gitignored list — see Pass 1):
grep -rniE -f .sanitize-names.local skills/ agents/ templates/ 2>/dev/null
```

Empty output = clean. The format canary covers Gmail label IDs, WhatsApp JIDs, real (long-hash) Google Calendar IDs, the GitHub org + `PVT*` project/field IDs, salary-shaped figures, paths, and the Granola key path. Names are swept via the gitignored `.sanitize-names.local` so no real name is ever written into this published file.

CI runs the tracked structured-pattern scanner. Your local pre-push run is the
fuller gate when `.sanitize-names.local` or `.sanitize-private-blocklist.local`
exists, because those private denylist files are intentionally not committed.

**Review each hit; not every hit is a leak.** Teaching files that explain ID *formats* are expected and safe — e.g. `skills/todo-queue.md` and `templates/triage-config-template.md` mention `Label_1`/`Label_123` as format examples, and `templates/calendar-policy-template.md` uses bracketed placeholders. A real leak is a *concrete* value (a specific `Label_5527`, a 64-char calendar hash, an actual name/figure), not a "looks like `Label_N`" explanation. The calendar/JID patterns are length-gated to skip bracketed placeholders; `Label_[0-9]+` is deliberately broad — eyeball its hits.

**Validate the canary itself periodically:** plant a known bad string (e.g. `Label_99` or a name from `.sanitize-names.local`) in a scratch file under `skills/`, run the canary, confirm it FIRES, then delete the scratch file. A canary that never catches anything may be silently broken.

`~/.claude/plans/` references are FINE — that's the standard Claude Code plan-mode directory. The leak risk is specific named plan files (like `~/.claude/plans/enchanted-candle.md`); check for those manually:

```bash
grep -rnE "\.claude/plans/[a-z][a-z0-9_-]+\.md" skills/ agents/ templates/
```

Approved public path namespaces (use these instead of personal ones):

- `~/.claude/commands/` and `~/.claude/agents/` — public Claude Code install locations
- `~/.claude-assistant/` — established public placeholder for personal config (logs, scripts, voice, donors, etc.)
- `~/Documents/`, `~/projects/`, `~/Box/` — generic user paths

Approved credential / research-sensitive sweep (run alongside the canary above):

```bash
grep -rnEi "sk-ant-|api_key\\s*=|bearer\\s|client_secret|password\\s*=|IRB[- ]?[0-9]|NSF [A-Z]+-[0-9]+|OPP[0-9]+|grant #" skills/ agents/ templates/
```

Even one credential hit is stop-the-world. Research-identifier hits get a judgment call — generic vocabulary is fine, specific protocol/grant numbers are not.

---

## Style Guidelines

- **Be concise.** Short sentences, short paragraphs.
- **Use tables** for structured information.
- **Use admonitions** for warnings, tips, and notes:
  ```markdown
  !!! tip "Pro tip"
      Content here.

  !!! warning "Heads up"
      Content here.
  ```
- **Include "current as of" dates** on any page with time-sensitive information.
- **Link generously** between pages — help readers find related content.
- **Match the voice** — accessible, direct, slightly informal. Not corporate, not condescending.

---

## Responding to GitHub Discussions

Check [Discussions](https://github.com/chrisblattman/claudeblattman/discussions) weekly for new questions. When responding:

- Be helpful and specific
- Link to relevant pages on the site
- If a question reveals missing documentation, create an issue or add the content
- Escalate to Chris if the question is about research methodology, tool recommendations, or site direction

---

## Maintenance Schedule

| Frequency | Task |
|-----------|------|
| Weekly | Check GitHub Discussions for new questions |
| Monthly | Add new resources from collected tips |
| Per skill update | Review public content and dependencies, test supported installation paths, update the catalogue and open a PR |
| Quarterly | Review all content for staleness, update "current as of" dates |
