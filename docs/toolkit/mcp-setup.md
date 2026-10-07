---
description: Giving the agent access to your email, documents and calendar — connectors first, which need no terminal, then MCP for what connectors don't cover.
---

# Connect your apps

By default the agent can only see the folder you point it at. Connecting an app widens that: it can
read your email, search your documents, check your calendar.

There are two routes, and the easy one came along after most of this page was written.

!!! warning "Try connectors first — this page is about the harder route"
    **Connectors** are built into the app. You turn them on in its own settings, sign in through
    the normal provider window, and set per-tool permissions. No terminal, nothing to install, a
    few minutes. For Gmail, Google Drive and Calendar this is almost certainly what you want, and
    it is the route the [checklists](../starter-kit/regular.md) assume.

    **MCP**, which is what the rest of this page covers, is the older and more capable route. It
    reaches things connectors don't — a Zotero library, Apple apps, WhatsApp — but it needs the
    command line, and Google Workspace in particular means creating your own project in Google
    Cloud Console.

    Only one setting matters for safety either way: if you never want the agent sending mail on your
    behalf, set that permission to **Blocked** rather than "needs approval". Blocked is the only
    unambiguous stop.

*As of October 2026.*

!!! info "Time and difficulty"
    **Google Workspace** (Gmail, Docs, Calendar): ~45-60 minutes. The OAuth credential setup is the hardest part — it requires creating a project in Google Cloud Console. Follow each step carefully.
    **Zotero, Apple apps**: ~10 minutes each. Just an API key or a quick install.
    **WhatsApp**: ~15 minutes, but sessions can drop and require re-setup.

    **Don't want to set up MCP yet?** That's fine. Claude Code works without any integrations — it can read and edit files, format prompts, review plans, and capture session notes. The [First Session Skills](../workflows/first-session-skills.md) all work without MCP. You can always come back and add integrations later.

---

## What MCP Does

Without MCP, Claude Code can only work with files on your computer. With MCP:

| Integration | What Claude Can Do |
|-------------|-------------------|
| **Gmail** | Search, read, draft, and send emails |
| **Google Docs** | Read and write documents |
| **Google Sheets** | Read and write spreadsheets |
| **Google Calendar** | View schedule, create events |
| **Google Drive** | Search and access files |
| **WhatsApp** | Read messages and conversations |
| **Zotero** | Search your reference library |
| **Apple apps** | Access Notes, Reminders, Calendar, Contacts |

You don't need all of these. Start with whichever service you use most (Gmail is usually the highest-value starting point) and add others as needed.

!!! tip "Understand what you're granting"
    Each MCP integration gives Claude Code access to your **entire** account for that service — not just specific folders or labels. Gmail MCP can read any email. Drive MCP can access any file. Calendar MCP sees all events, including private ones. There's no way to restrict scope to a subset. This is fine for most users, but worth knowing before you connect. When Claude processes data from any integration, the content is sent to Anthropic's API as part of the conversation. Anthropic's [data policy](https://www.anthropic.com/policies/privacy) states API inputs are not used for model training — verify the current terms yourself. If a service contains data you're not comfortable with an AI processing, skip that integration. For sensitive seasonal tasks (like tax preparation), consider enabling an integration only when you need it and removing it afterward — see the [Tax Workflow privacy guide](../tax-workflow/before-you-start/privacy-and-setup.md#if-you-use-gmail-mcp-for-document-collection) for an example. For more on how data flows through these tools, see [Privacy](../privacy.md#tools-and-workflows).

---

!!! ask-claude "Getting an error? Ask Claude."
    If something goes wrong during any MCP setup step, paste the error into the
    Claude Code terminal — for example:
    `I'm getting an error trying to connect. Here's what I see: [paste the error]`
    Press Enter. Claude can often diagnose MCP configuration issues on the spot.

!!! warning "Shared computers"
    Anyone who can open Terminal on your machine can run `claude` and access all connected services — email, calendar, documents — with no additional login required. If you share your computer, consider revoking MCP tokens when you're done (remove entries from `settings.json`) or using separate user accounts. Claude Code also stores conversation history locally in `~/.claude/`, which may include content from connected services.

---

## How MCP Configuration Works

MCP servers are configured in a JSON file that tells Claude Code how to connect to each service:

| File | Purpose |
|------|---------|
| `~/.claude.json` | Active MCP configuration (Claude reads this) |

Each MCP server entry specifies a command to run and any required credentials (API keys, OAuth tokens).

---

## Google Workspace (Recommended First)

<span class="badge-teal">⏱ 45-60 min</span> <span class="badge-preview">Moderate — OAuth setup required</span>

This single server provides access to Gmail, Google Docs, Sheets, Calendar, Drive, and Tasks. It's the highest-value MCP integration for most users.

**Repository:** [taylorwilsdon/google_workspace_mcp](https://github.com/taylorwilsdon/google_workspace_mcp)

### Prerequisites

- **Python** (3.10+) and **uv** (Python package manager)
- **Google Cloud Console** account (free)

### Setup Steps

**1. Install uv** (if you don't have it):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**2. Clone and install the server:**
```bash
cd ~
git clone https://github.com/taylorwilsdon/google_workspace_mcp
cd google_workspace_mcp
uv sync
```

**3. Create Google OAuth credentials:**

This is the most involved step. You need to create a "project" in Google Cloud Console and enable API access.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use an existing one)
3. Enable these APIs (search for each in the API Library):
   - Gmail API
   - Google Drive API
   - Google Docs API
   - Google Sheets API
   - Google Calendar API
   - Google Tasks API
4. Go to **Credentials** > **Create Credentials** > **OAuth client ID**
5. Application type: **Desktop app**
6. Download the client ID and secret

!!! warning "Important: Switch to Production mode"
    By default, your Google Cloud project is in "Testing" mode, which means **OAuth tokens expire after 7 days** — you'll need to re-authenticate weekly, which is the single most common frustration with this setup. To fix it: go to **Google Auth platform > Audience** in the Cloud Console and switch to "Production." This makes tokens persist indefinitely. Do this during setup, not later.

**4. Add to your Claude configuration:**

Add this to `~/.claude.json` under `mcpServers`:

```json
{
  "mcpServers": {
    "google_workspace": {
      "type": "stdio",
      "command": "/path/to/uv",
      "args": [
        "run", "--directory", "/path/to/google_workspace_mcp",
        "main.py", "--tools", "drive", "docs", "sheets", "gmail", "calendar", "tasks"
      ],
      "env": {
        "GOOGLE_OAUTH_CLIENT_ID": "your-client-id.apps.googleusercontent.com",
        "GOOGLE_OAUTH_CLIENT_SECRET": "your-client-secret",
        "OAUTHLIB_INSECURE_TRANSPORT": "1",
        "USER_GOOGLE_EMAIL": "your-email@gmail.com"
      }
    }
  }
}
```

Replace the paths and credentials with your actual values. To find your `uv` path: `which uv`.

!!! note "About `OAUTHLIB_INSECURE_TRANSPORT`"
    This setting allows OAuth to work over HTTP on localhost, which is standard for desktop MCP apps that only talk to your local machine. Never set this in a production server environment.

**5. Restart Claude Code** and test:

```
> Search my Gmail for emails from last week
```

If Claude can read your email, the connection is working.

### Known Limitations

- Cannot create Google Doc tabs (must create manually)
- No suggesting mode / track changes
- Uses significant context (~26K tokens for all tools). If you hit context limits, enable only the tools you need by adjusting the `--tools` argument.

---

## WhatsApp

<span class="badge-teal">⏱ 15 min</span> <span class="badge-start">Easy — QR code scan</span>

Read messages and search conversation history.

**Repository:** Look for `whatsapp-mcp` on GitHub (several implementations exist, using Baileys library or WhatsApp Web bridge).

### Setup Overview

1. Clone the repository and install dependencies (`npm install`)
2. Run the server once — it will display a QR code
3. Scan the QR code with your phone's WhatsApp app
4. Add to `~/.claude.json`

### Known Issues

- Session drops when your laptop sleeps — you'll need to re-scan the QR code
- Chat metadata can be stale — always fetch messages directly rather than relying on chat lists

!!! note "Slack and Microsoft Teams"
    This guide covers MCP servers the author has personally tested. Slack and Teams
    MCP servers exist on GitHub but vary in quality and maintenance. Before investing
    setup time: search GitHub, check the repo's recent commit activity and open issues,
    and verify it supports your plan type (some require Enterprise). The configuration
    pattern (clone repo, add JSON config, restart Claude Code) is the same as described
    above — the work is finding a well-maintained server.

---

## Zotero (Reference Management)

<span class="badge-teal">⏱ 10 min</span> <span class="badge-start">Easy — API key only</span>

Search your Zotero library and retrieve citations.

**Package:** `mcp-zotero` (npm)

### Setup

1. Get your API key from [zotero.org/settings/keys](https://www.zotero.org/settings/keys)
2. Find your user ID on the same page

Add to `~/.claude.json`:

```json
"zotero": {
  "type": "stdio",
  "command": "npx",
  "args": ["mcp-zotero"],
  "env": {
    "ZOTERO_API_KEY": "your-api-key",
    "ZOTERO_USER_ID": "your-user-id"
  }
}
```

---

## Apple Apps (Mac Only)

<span class="badge-teal">⏱ 10 min</span> <span class="badge-start">Easy — quick install</span>

Access Notes, Calendar, Contacts, Reminders, Messages, and Mail through Apple's native apps.

!!! warning "Reliability issues — set expectations"
    The `apple-mcp` package ([supermemoryai/apple-mcp](https://github.com/supermemoryai/apple-mcp)) is **archived and no longer maintained**. It works for some operations (especially Reminders and Calendar reads) but is unreliable for others (Notes is broken, Mail is inconsistent). Check the [GitHub issue tracker](https://github.com/supermemoryai/apple-mcp/issues) before investing time. Apple has announced native MCP support coming in a future macOS release — when that ships, it will replace this package entirely.

    **What works reasonably well:** Reminders (create/read), Calendar (read), Contacts (read).
    **What doesn't work reliably:** Notes (use [apple-notes-mcp](https://github.com/sweetrb/apple-notes-mcp) instead), Mail (use Gmail MCP), Messages (limited).

**Package:** `apple-mcp` (runs via Bun)

### Setup

```bash
# Install Bun first
curl -fsSL https://bun.sh/install | bash
```

Add to `~/.claude.json`:

```json
"apple-mcp": {
  "type": "stdio",
  "command": "/path/to/.bun/bin/bunx",
  "args": ["--no-cache", "apple-mcp@latest"],
  "env": {}
}
```

Replace `/path/to/` with your actual home directory path.

---

## Granola (Meeting Transcripts)

<span class="badge-teal">⏱ 15 min</span> <span class="badge-preview">Moderate — requires Python 3.12+</span>

Access meeting notes and summaries from Granola.

### Setup

Requires Python 3.12+. Check the [Granola MCP GitHub repo](https://github.com/granola-ai/granola-mcp-server) for current installation instructions.

**Key limitation:** MCP provides summaries only, not full transcripts. For full transcripts, export from the Granola app to a local folder and point Claude Code at those files.

---

## Multi-Machine Setup

If you use Claude Code on multiple computers:

### What syncs (via your cloud folder):
- CLAUDE.md (your personal instructions)
- skills/commands folder
- MCP server *configuration* (the JSON)

### What stays local (per machine):
- OAuth tokens (you authenticate once per machine)
- MCP server code repositories (clone on each machine)
- `~/.claude.json` (the active config file)

### Setting Up a New Machine

1. Clone/install MCP server repositories on the new machine
2. Copy your MCP configuration to `~/.claude.json`
3. Update paths in the config to match the new machine
4. Restart Claude Code — first use will prompt for OAuth authentication

---

## Troubleshooting

**Google auth expired:** Delete the credentials file in the MCP server folder (usually `~/.google_workspace_mcp/credentials/`) and re-authenticate on next use.

**WhatsApp session dropped:** Re-run the server command and scan the QR code again.

**MCP server not responding:**
1. Check if the server command runs manually in your terminal
2. Verify all paths in `~/.claude.json` are correct and absolute
3. Restart Claude Code

**Context limits hit quickly:** Run `claude doctor` to check MCP tool context usage. Disable unused servers or reduce the `--tools` list to reclaim context space.

---

## What's Next

With MCP configured:

1. **[Learn about skills](../setup/skill-reference.md)** — Automated workflows that use your MCP connections
2. **[Browse the Skill Library](../setup/skill-reference.md)** — Pre-built skills with MCP integration

<label class="page-done"><input type="checkbox"> I connected something!</label>
<label class="page-done"><input type="checkbox"> That's everything I need connected for now.</label>
