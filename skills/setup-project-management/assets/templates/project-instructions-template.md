<!--
Public adaptation of the archived project-instructions template, bundled
2026-11-11. Personal identifiers and local paths are replaced with placeholders.
Optional workflows below require available tools and user authorization.
Use this as a field checklist for the host instruction file selected during
setup. Map integration settings to the project's existing configuration or
PROJECT_CONFIG.json (see ../../references/project-config.md); link that
configuration rather than creating a second changing settings authority.
Replace examples with verified facts; omit unused fields and identify unknowns.
-->

# [PROJECT NAME] - Project Instructions

## Project Overview
[Brief description of the project]

project_type: "[quantitative / qualitative / theoretical]"  <!-- Determines folder structure and dashboard template -->
granola_folder: "[Granola folder name]"  <!-- Optional source folder; verify available transcript access -->
meeting_cadence: "[e.g., Fridays 10am CT, or 'ad hoc']"

## WhatsApp Groups

<!-- Optional: record exact group names only if selected as project sources. -->

whatsapp_groups:
  - name: "[Group Name 1]"
    description: "[What this group is for]"
  - name: "[Group Name 2]"
    description: "[What this group is for]"

## Google Doc
google_doc_id: "[DOC_ID from URL]"
google_doc_url: "[Full URL]"

## Folder Paths
<!-- Relative to project root -->

folders:
  transcripts: "10_AI_Collaboration/Transcripts"
  weekly_reviews: "10_AI_Collaboration/Weekly_Reviews"
  dashboard_archive: "10_AI_Collaboration/Dashboard_Archive"
  # fieldwork_transcripts: "07_Fieldwork/Transcripts/"  <!-- Qualitative projects: interview transcripts (separate from meeting transcripts) -->

## Key Resources

- **Google Doc**: [Project management doc URL]
- **Box folder**: [Box URL for data]
- **Box local path**: [Path when synced, e.g., ~/Box/PROJECT_FOLDER/]
- **Overleaf**: [Overleaf project URL]
- **GitHub**: [If applicable]
- **Dropbox**: This folder

## External File Sources (Box, Shared Drives, etc.)

<!--
This section documents external file sources that may or may not be synced locally.
The assistant should check these paths and flag if they are unavailable.
-->

### [Source Name, e.g., "Shared Box Folder"]

**Web URL**: [URL for browser access]
**Local path (when synced)**: [e.g., ~/Box/PROJECT_FOLDER/]
**Last verified access**: [Date and what was readable; do not infer cloud sync completeness]

#### Files Copied to Dropbox

<!-- List high-priority files that have been copied locally for reliable access -->

| Source Path | Dropbox Destination | Description |
|-------------|---------------------|-------------|
| `[Box path]` | `[Dropbox folder]/` | [What this file is] |
| `[Box path]` | `[Dropbox folder]/` | [What this file is] |

#### Files Available Only in External Source

<!-- List files that remain in the external source and are NOT copied locally -->

| Category | Path | Notes |
|----------|------|-------|
| [Category] | `[Path]` | [Why not copied / when to access] |

#### If External Source Not Found

**For assistant sessions and skills**: If the local path doesn't exist or is empty:

1. **Check documented local copies** - Use the verified copy inventory above; do not assume a copy exists
2. **Flag to user**: "[Source name] appears to be unsynced from your local machine. If you need updated versions or files not copied to Dropbox, you may need to:
   - Re-sync the folder via [Box Drive / OneDrive / etc.], or
   - Download specific files from the web interface"
3. **Provide web URL** for manual access: [URL]

## Data Sensitivity
<!-- Optional — include for projects with identifiable data (especially qualitative) -->

<!--
sensitivity_level: "[standard / high]"

data_handling:
  identifiable_data: "[Box / secure server]"        # Identifiable transcripts, PII
  de_identified_data: "[Dropbox / local]"            # De-identified summaries, coded data
  consent_forms: "[Box or IRB folder]"               # Signed consent docs
  notes: "[Any special handling instructions]"
-->

## Gmail Filter Keywords
<!-- Candidate filters for project-relevant emails; verify relevance per thread. -->
<!-- A shared team member alone is not sufficient evidence of project relevance. -->
<!-- Refine this list based on feedback from weekly review outputs -->

project_keywords:
  # Project identifiers (unique terms for this project)
  - "[Project acronym or code name]"
  - "[Key intervention name]"
  - "[Data system name]"
  # Funders specific to this project
  - "[Funder 1]"
  - "[Funder 2]"
  # People unique to this project (not on multiple projects)
  - "[External partner name]"
  # Spanish/local language terms (if applicable)
  - "[Local term 1]"

exclude_keywords:
  # Other projects with overlapping team members (to avoid cross-contamination)
  # Add project names, acronyms, and unique identifiers for OTHER projects
  - "[Other project name 1]"
  - "[Other project acronym]"
  # Note: After building weekly summaries for all related projects,
  # revisit keyword filtering to optimize sorting across projects

## Team Roster
<!-- Used for email filtering and attribution -->

team:
  pis:
    - name: "[Project lead name]"
      emails: ["lead@example.org"]
    - name: "[Co-PI Name]"
      emails: ["email@domain.com"]

  research_managers:
    - name: "[Name]"
      emails: ["email@domain.com"]
      role: "[Role]"

  field_team:
    - name: "[Name]"
      emails: ["email@domain.com"]

  research_assistants:
    - name: "[Name]"
      emails: ["email@domain.com"]

## Project Status
- **Current status authority**: [Overview file or verified document link]
- **Approvals and funding records**: [Links, if applicable]

Keep changing phase, approval, and funding status in the linked authority rather than duplicating it here.

## Project-Specific Workflows

### Weekly Summary
Use `weekly-review` if available, or request an equivalent bounded review of the selected sources. This does not install a schedule.

### Meeting Notes
Use the agreed meeting-note source and status authority. Apply shared-document updates only within the authorized destination and write scope.

### Meeting Transcripts
**Storage location**: `10_AI_Collaboration/Transcripts/`

**Workflow for new transcripts**:
1. Verify whether the selected meeting tool provides a full transcript, a summary, or a manual export.
2. Save authorized exports at the agreed path; a suggested filename is `YYYY-MM-DD_HHmm_description.txt`. Record summary-only access accurately.
3. Add the source link or meeting ID to PROJECT_INDEX.md when available.
4. Propose or apply a meeting-log update according to the agreed write scope. No private export helper is bundled.

## Meeting Schedule
[Regular meeting times, if any]
