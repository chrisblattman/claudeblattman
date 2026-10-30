# Organizing Your Cloud Storage with Claude Code: A Practical Guide

*Based on a real multi-day workflow organizing files across Dropbox, Google Drive, Box, and local disk*

---

## What This Guide Covers

If you're a professional or academic with files scattered across multiple cloud services — Dropbox, Google Drive, Box, iCloud — and your laptop's hard drive is running out of space, this guide walks you through using Claude Code to audit, clean up, and create lasting cross-platform awareness of where everything lives.

**Total time investment:** ~4-6 hours across several sessions, spread over 1-2 days.

**What you'll accomplish:**
- Free significant disk space (in our case: from 19 GB free to 500+ GB free on a 1 TB drive)
- Catalog everything across cloud services into a single inventory file
- Clean up junk from Google Drive and other platforms
- Create a cross-platform strategy so your AI assistant knows where to find things
- Investigate integration options for services without existing API access

---

## Phase 1: Local Disk Audit (~1 hour)

### What You're Doing
Before touching cloud services, figure out where space is going on your actual hard drive. Claude Code can scan your filesystem using shell commands — no API setup needed.

### The Approach

Create a working directory for the project. For example,
`~/Documents/cloud-storage-audit/` works well and keeps results easy to find.

Ask Claude Code to scan major directories outside your main cloud sync folder:

```
Scan my local filesystem to find where my non-Dropbox disk space is going.
Check ~/Library, /Applications, ~/Downloads, hidden directories, and
anything else that looks large. Find the top 50 largest files outside
my Dropbox folder. Present a ranked list of quick wins — things likely
safe to delete with estimated space recoverable.
```

### What Claude Code Does
- Runs `du -sh` on major directories to build a size breakdown
- Checks macOS-specific space hogs: `~/Library/Caches/`, `~/Library/Application Support/`, iOS backups, Time Machine snapshots
- Finds the largest individual files outside your cloud sync folders
- Audits your Downloads folder for stale files
- Produces a ranked "quick wins" report with safe-to-delete items

### What We Found (example)
Our audit uncovered a parental monitoring app (Qustodio) silently storing 79 GB of iOS device backups, a 4 GB Chrome machine learning model, and various stale caches. The single biggest discovery — the hidden backup directory — would never have been found through normal browsing.

### Key Lesson
**Hidden directories are where the real bloat lives.** Apps like backup tools, development environments, and messaging apps store data in dot-prefixed folders (`~/.app-name/`) that don't show up in Finder. Claude Code's filesystem access finds these instantly.

---

## Phase 2: Cloud Storage Inventory via API (~30 min setup + scan time)

### What You're Doing
If you use Dropbox (or a similar service with API access), you can inventory your entire cloud storage programmatically — even files that aren't synced locally.

### The Approach

1. **Get an API token** from your cloud provider's developer console (Dropbox: dropbox.com/developers/apps)
2. Have Claude Code write and run a Python script that:
   - Enumerates every file via the API (metadata only, not content)
   - Captures path, size, and last-modified date
   - Saves raw results to a JSON file for reuse

3. Generate summary reports:
   - **Top folders by size** — where is the bulk?
   - **Cold storage candidates** — big folders untouched for 12+ months
   - **Age distribution** — what percentage is actively used vs. archive?
   - **File type breakdown** — are you storing massive data files locally that could live elsewhere?

### What We Found (example)
Our Dropbox had 630K files totaling 1,407 GB, but only 150 GB (10.6%) was actively used in the last 12 months. This meant a 2 TB drive was more than sufficient — no need for 4 TB.

### Key Lesson
**Most cloud storage is archive.** Once you see the active-vs-archive split, selective sync decisions become obvious. You don't need all your published papers, old datasets, or historical camera uploads on your laptop.

---

## Phase 3: Selective Sync Optimization (~30 min)

### What You're Doing
Using your inventory data, decide what to keep locally vs. cloud-only. Claude Code can't change Dropbox's selective sync settings (that's a desktop app function), but it can tell you exactly which folders to un-sync and how much space each will free.

### The Approach

Ask Claude Code to analyze the inventory and recommend:
```
Based on the Dropbox inventory, which folders should I make cloud-only
to free the most space? Prioritize: published/completed projects,
old datasets, media archives, and anything untouched for 12+ months.
Keep active working files local.
```

### What We Accomplished (example)
We un-synced ~533 GB of folders:
- Published research paper datasets (250+ GB)
- Dead/inactive projects (50 GB)
- Large active project data managed by research assistants (231 GB)

Result: laptop went from 19 GB free to 500+ GB free.

### Practical Notes
- **Selective sync takes hours for large folders.** Dropbox deletes local copies one file at a time. For 500+ GB, expect 2-6 hours.
- **macOS "purgeable" space is confusing.** After un-syncing, Finder may show space as "purgeable" rather than "free" — this is normal APFS behavior. The space is available.
- **There are multiple UI paths.** If one method doesn't seem to work (Dropbox has changed its sync UI several times), try right-clicking folders in Finder > Dropbox > Make Online-Only.

---

## Phase 4: Google Drive Cleanup (~1-2 hours)

### What You're Doing
Google Drive tends to accumulate junk: untitled documents, duplicate translations, old exports, and loose files with no folder structure. Claude Code can inventory and clean this up via MCP (Model Context Protocol) integration.

### Prerequisites
You need a Google Workspace MCP server configured. The community `google_workspace_mcp` server gives Claude Code read/write access to Drive, Docs, Sheets, Gmail, and Calendar.

### The Approach

1. **Inventory root-level items** — Have Claude list everything at the top level of your Drive. Categorize into: active docs, course materials, proposals, personal files, translations, junk.

2. **Identify junk for deletion** — Empty/untitled documents, duplicate files, old exports. Get approval before trashing.

3. **Trash in batches** — Claude Code can move items to trash via the Drive API. We trashed ~100 items across several rounds.

4. **Build a master inventory** — Save a comprehensive catalog of remaining files to a local markdown file. This becomes your AI's reference for "where is X?"

5. **Create team review spreadsheets** (optional) — If you need collaborators to help map files to projects, Claude Code can create Google Sheets with clickable links to each document.

### What We Found (example)
Our Google Drive had ~400 root-level items including:
- 60+ duplicate translated documents (same source, different dates)
- 8 untitled/empty documents
- Multiple PDF versions of the same paper
- 15 legacy shortcuts to moved files

### Key Lesson
**Google Drive cleanup is more about cataloging than reorganizing.** Moving files into folders provides minimal value if you have an AI that can search by content. The high-value action is creating an inventory file that gives Claude Code awareness of what exists and where it maps to your project structure.

---

## Phase 5: Other Cloud Services (~1 hour)

### What You're Doing
Audit any remaining cloud services — Box, iCloud, OneDrive — to understand what's there and whether it's duplicated.

### The Challenge
Not all services have API or MCP access from Claude Code. For managed enterprise accounts (like university Box), programmatic access may require IT approval.

### Approaches by Access Level

**Full API access (e.g., Google Drive via MCP):**
Claude Code can inventory, search, and modify files directly.

**Desktop sync app (e.g., Box Drive):**
If the sync app is installed, Claude Code may be able to read files through the local filesystem at `~/Library/CloudStorage/`. However, macOS may block access depending on Full Disk Access permissions. Fix: System Settings > Privacy & Security > Full Disk Access > enable the desktop app (or, if you run it from a terminal, that terminal app).

**Web-only (no API, no sync):**
Take screenshots of the folder structure and have Claude Code read them. Claude is multimodal — it can catalog folders from screenshots and cross-reference with other services.

**What We Did (example):**
- **iCloud Drive:** Confirmed no user files stored there (app data only). Dropped from scope.
- **Personal Box:** Cataloged via screenshots. Found all content duplicated in university Box. Decision: close the personal account.
- **University Box:** Cataloged ~60 folders via screenshots. Identified stale committee folders, empty folders, and duplicate content. Investigated 5 integration paths (Box Drive filesystem, rclone, Box MCP Server, Box CLI, official Box Remote MCP).

### Key Lesson
**Screenshots are a surprisingly effective workaround.** When you can't get API access, 4-5 screenshots of a folder listing give Claude Code enough to build a complete catalog and cross-reference against other services.

---

## Phase 6: Cross-Platform Awareness (~30 min)

### What You're Doing
Create persistent files that give Claude Code awareness of your full file landscape across every session.

### The Deliverables

1. **Master inventory file** (e.g., `file-inventory.md`)
   - Saved locally where Claude Code can read it on demand
   - Contains: Google Drive catalog, Box catalog, cleanup log, cross-platform notes
   - NOT loaded into every session's system prompt — too large. Referenced when needed.

2. **Updated system instructions** (e.g., CLAUDE.md)
   - Add a "Technology Stack & File Locations" table listing each service, what's stored, and access method
   - Add cross-platform strategy: "Dropbox = home base; Google Docs linked via PROJECT_INDEX.md"
   - Keep it minimal — 5-10 lines, not a full inventory

3. **Project index files** (optional, per-project)
   - For your top 5 active projects, create a `PROJECT_INDEX.md` in each Dropbox project folder
   - Links to: Google Docs, Sheets, Box folders, Overleaf repos
   - Claude Code reads these to know where a project's assets live across platforms

### Key Lesson
**Don't over-organize.** The inventory file and updated system instructions give Claude Code 90% of the awareness it needs. Only create per-project index files for projects you're actively working on — not for everything.

---

## Phase 7: App-Specific Deep Dives (as needed)

### What You're Doing
Some disk audit findings require deeper investigation — troubleshooting apps, understanding backup behavior, or making keep/delete decisions.

### Example: Parental Monitoring App
Our disk audit found 79 GB of hidden iOS backups from a parental monitoring app. The subsequent deep dive involved:
- Researching what the app actually does and what the backups contain
- Determining which features require the desktop app vs. work from mobile alone
- Making a keep/delete decision with full information
- Troubleshooting the app when it broke after deleting old backups (Electron app crash, GPU rendering issue, admin permissions)
- Setting up a cron job to manage unbounded log file growth
- Creating Apple Reminders for follow-up tasks

### Key Lesson
**Claude Code excels at app troubleshooting.** It can read log files, check process status, search for error messages, look up documentation, and suggest fixes in real time. This saved at least an hour of manual googling and trial-and-error.

---

## Summary: What Worked, What Didn't

### What Worked Well
- **Local disk scanning** — instant, comprehensive, finds hidden bloat
- **Dropbox API inventory** — definitive data on active vs. archive split
- **Google Drive cleanup via MCP** — batch operations on hundreds of files
- **Screenshot-based cataloging** — practical workaround for services without API access
- **Cross-platform inventory file** — persistent AI awareness without over-engineering
- **Email integration** — sending team emails about findings directly from the session

### What Didn't Work / Wasn't Worth It
- **Elaborate folder reorganization in Google Drive** — cataloging was high-value; moving files into folders was low-value
- **Building team review spreadsheets** — for 30 files, an email is faster than a spreadsheet workflow
- **Box Drive filesystem access** — macOS sandboxing blocked it; needed Full Disk Access fix
- **Complex MCP/API setup for services with low file counts** — if a service has <50 files, screenshots are faster than configuring an integration

### Tools Used
| Tool | What It Did |
|------|------------|
| **Claude Code filesystem access** | Local disk scanning, reading reports, editing config files |
| **Shell commands** (`du`, `df`, `ps`, `pkill`) | Disk usage analysis, process management |
| **Dropbox API** (via Python SDK) | Cloud storage inventory — 630K files enumerated |
| **Google Workspace MCP** | Drive file listing, trash operations, Sheets creation, Gmail |
| **osascript** | Apple Reminders creation, Notes search |
| **Web search** | Researching app behavior, integration options |
| **Screenshot reading** | Cataloging Box folders without API access |

---

## Reproducible Checklist

- [ ] Create a working directory for the project
- [ ] Run local disk audit (no setup needed)
- [ ] Act on quick wins: delete caches, old downloads, hidden app bloat
- [ ] Set up cloud API access (Dropbox token, Google MCP, etc.)
- [ ] Run cloud storage inventory
- [ ] Optimize selective sync based on active-vs-archive data
- [ ] Inventory and clean Google Drive (or equivalent)
- [ ] Catalog remaining cloud services (screenshots if no API)
- [ ] Cross-reference for duplicates across services
- [ ] Create master inventory file for AI awareness
- [ ] Update system instructions with file location map
- [ ] Create project index files for top active projects
- [ ] Write cleanup instructions for other machines (if applicable)
- [ ] Investigate integration options for remaining services

---

*Guide created: February 12, 2026*
*Based on file management sessions using Claude Code (Opus 4.6)*
