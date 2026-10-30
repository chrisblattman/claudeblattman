---
description: Giving the agent access to your email, documents and calendar — connectors first, which need no terminal, then MCP for what connectors don't cover.
---

# Connect your apps

By default the agent can only see the folder you point it at. Connecting an app widens that: it can
read your email, search your documents, check your calendar.

There are two routes. **Most people only need the first one**, which takes a few minutes and no
terminal. The second is older, more capable, and considerably more work.

| | **Connectors** | **MCP servers** |
|---|---|---|
| Set up where | A page in your Claude account | Your computer, by hand |
| Terminal needed | No | Yes |
| Time | ~5 minutes per service | 10–60 minutes per service |
| Covers | Mail, calendar, documents — the common services | Zotero, Apple apps, WhatsApp, anything niche |
| Breaks when | Rarely | A repo goes unmaintained, a token expires, a path changes |

**Start at [Connectors](#connectors).** Only read [MCP servers](#mcp-servers) if what you need isn't
in the directory.

*As of October 2026. Both routes change often — where this page and the app disagree, the app is
right.*

---

## Connectors

A connector is a service Anthropic has already wired up. You switch it on once in your Claude
account and it shows up in your sessions.

### Turning one on

1. Go to **[claude.ai/customize/connectors](https://claude.ai/customize/connectors)**. This is a
   page in your Claude *account*, not a setting inside the desktop app — a common place to get
   stuck.
2. Browse **[claude.ai/directory](https://claude.ai/directory)** for what's available. Gmail,
   Microsoft 365 and Google Calendar are all there.
3. Connect the one you want and complete the sign-in it asks for. This is the normal provider
   window — Google's or Microsoft's own.
4. Start a new session. The desktop app hands your connectors to each local session automatically;
   there is nothing to configure on this end.

!!! warning "Two things that stop this working"
    **On a Team or Enterprise plan, only an administrator can add connectors.** If you are on a
    university or company account and the Connectors page won't let you add anything, that is why —
    ask whoever administers your Claude account. This affects a lot of academic readers.

    **Connectors need a Claude subscription login.** They do not load if you are signed in with an
    API key or routed through a third-party provider.

### Before you connect anything

A connector gives the agent your **whole account** for that service — not a folder or a label. The
mail connector can read any message; the drive connector can reach any file; the calendar connector
sees private events. There is no way to narrow it to a subset.

If you never want the agent sending mail on your behalf, set that tool to **Blocked**, not "needs
approval." Blocked removes the tool before Claude ever sees it; approval prompts can be answered in
a hurry. On the desktop app in particular, Blocked is the setting that reliably holds.

For a service holding data you would not want processed by an AI, don't connect it. For something
seasonal — tax documents, say — connect it while you need it and disconnect afterwards. The
[tax workflow privacy guide](../tax-workflow/before-you-start/privacy-and-setup.md#if-you-use-gmail-mcp-for-document-collection)
walks through that pattern, and [Privacy](../privacy.md#tools-and-workflows) covers how data moves
through these tools generally.

### Services this page does not cover

The directory is the live list and it changes; this page does not duplicate it. **OneDrive, Outlook
and Slack have no per-service instructions here.** Outlook and OneDrive may be covered by the
Microsoft 365 connector — check the directory. If a service you need isn't there, the MCP route
below is the fallback.

<label class="page-done"><input type="checkbox"> I connected something.</label>

---

## MCP servers

MCP is the older route. It reaches things connectors don't, and it costs real time. Everything
below needs a terminal.

!!! info "Before you start down this road"
    **Gmail, Microsoft 365 and Google Calendar cannot do local sign-in from Claude Code.** That is
    exactly why the Google route below takes 45 minutes and a Google Cloud project — you are
    building what the connector already provides. **If the connector works for you, it is strictly
    the better option.**

    You don't need any of this to get value from the app. It reads and edits files, drafts, reviews
    plans and captures notes with nothing connected. The
    [first-session skills](../workflows/first-session-skills.md) all work without it.

### How the configuration works

MCP servers live in `~/.claude.json`, which Claude reads at startup. Each entry names a command to
run plus any credentials it needs. You edit that file by hand.

!!! ask-claude "Getting an error? Ask Claude."
    Paste the error straight into the message box — `I'm getting an error trying to connect. Here's
    what I see: [paste the error]`. It can usually diagnose a configuration problem on the spot.

### Google Workspace

<span class="badge-teal">⏱ 45–60 min</span> <span class="badge-preview">Hardest thing on this page</span>

Gmail, Docs, Sheets, Calendar, Drive and Tasks from one server.
**Repository:** [taylorwilsdon/google_workspace_mcp](https://github.com/taylorwilsdon/google_workspace_mcp)

**Needs:** Python 3.10+, `uv`, and a free Google Cloud Console account.

**1. Install `uv`:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**2. Clone and install:**
```bash
cd ~
git clone https://github.com/taylorwilsdon/google_workspace_mcp
cd google_workspace_mcp
uv sync
```

**3. Create Google OAuth credentials.** The involved part — you are creating your own project in
Google Cloud Console.

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a project
2. Enable each API you want, from the API Library: Gmail, Drive, Docs, Sheets, Calendar, Tasks
3. **Credentials → Create Credentials → OAuth client ID**, application type **Desktop app**
4. Download the client ID and secret
5. **Switch the project to Production.** Under **Google Auth platform → Audience**, change
   "Testing" to "Production". In Testing mode tokens expire after **7 days** and you re-authenticate
   weekly. This is the single most common complaint about this setup, and it takes one click now
   versus every week forever.

**4. Add it to `~/.claude.json`** under `mcpServers`:

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

Replace the paths and credentials. `which uv` gives you the first one.
`OAUTHLIB_INSECURE_TRANSPORT` permits OAuth over HTTP on localhost, which is standard for a desktop
app talking only to your own machine — never set it on a real server.

**5. Restart and test** with `Search my Gmail for emails from last week`.

**Limitations:** can't create Google Doc tabs; no suggesting mode or track changes; uses roughly
**26K tokens of context** for all tools. Trim the `--tools` list if you run short.

### WhatsApp

<span class="badge-teal">⏱ 15 min</span>

Read messages and search history. Search GitHub for `whatsapp-mcp` — several implementations exist
and they vary. Clone one, `npm install`, run it once to get a QR code, scan that with your phone,
then add it to `~/.claude.json`.

**Expect friction:** the session drops whenever your laptop sleeps and you re-scan the QR code. Chat
metadata goes stale, so fetch messages directly rather than trusting a chat list.

### Zotero

<span class="badge-teal">⏱ 10 min</span> <span class="badge-start">Easiest one here</span>

Search your library and pull citations. Package: `mcp-zotero` (npm). Get an API key and your user ID
from [zotero.org/settings/keys](https://www.zotero.org/settings/keys), then:

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

### Apple apps (Mac only)

<span class="badge-teal">⏱ 10 min</span>

Notes, Calendar, Contacts, Reminders, Messages and Mail through the native apps.

!!! warning "Mostly broken, and unmaintained"
    [`apple-mcp`](https://github.com/supermemoryai/apple-mcp) is **archived**. Reminders
    (create and read), Calendar (read) and Contacts (read) work reasonably. Notes is broken — use
    [apple-notes-mcp](https://github.com/sweetrb/apple-notes-mcp). Mail is inconsistent — use the
    mail connector. Messages is limited. Apple has announced native MCP support in a future macOS
    release, which will replace this entirely. Check the
    [issue tracker](https://github.com/supermemoryai/apple-mcp/issues) before spending time here.

Runs via Bun — `curl -fsSL https://bun.sh/install | bash` — then:

```json
"apple-mcp": {
  "type": "stdio",
  "command": "/path/to/.bun/bin/bunx",
  "args": ["--no-cache", "apple-mcp@latest"],
  "env": {}
}
```

### Granola

<span class="badge-teal">⏱ 15 min</span>

Granola now publishes an [official connector](https://docs.granola.ai/help-center/sharing/integrations/mcp)
for Claude and ChatGPT — switch it on like any other connector and search "Granola". It returns
meeting notes on every plan and **full verbatim transcripts on paid plans** (Business and up);
the free plan gets notes only. Checked 19 October 2026.

This replaces the older community server, which returned summaries only. For how to get
transcripts into a project folder and what to do with them, see
[Transcribe every meeting](../hyperlinks/granola.md).

### Slack and Microsoft Teams

Servers exist on GitHub but vary in quality and maintenance, and some need an Enterprise plan. The
setup pattern is the same as above — clone, configure, restart — so the work is in picking a
well-maintained one. Check recent commits and open issues before you start. **Check the connector
directory first;** a supported connector beats an unmaintained server.

---

## Using more than one computer

**Syncs via your cloud folder:** `CLAUDE.md`, your skills folder, and the MCP configuration itself.

**Stays local to each machine:** OAuth tokens (authenticate once per machine), the server
repositories (clone on each), and `~/.claude.json`.

Setting up a second machine: clone the repositories, copy your configuration in, fix the paths to
match, restart. First use prompts for authentication.

Connectors need none of this — they follow your account.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| **A connector won't add** | Team or Enterprise plan — only an admin can. Also check you're signed in with a Claude subscription, not an API key |
| **Google auth expired** | Delete the credentials file in the server folder (usually `~/.google_workspace_mcp/credentials/`) and re-authenticate. If it keeps happening weekly, the project is still in Testing mode — switch it to Production |
| **WhatsApp session dropped** | Re-run the server and scan the QR code again. Expected after sleep |
| **Server not responding** | Run the command manually in a terminal; confirm every path in `~/.claude.json` is absolute; restart |
| **Running out of context** | `claude doctor` shows MCP tool context usage. Disable unused servers or trim `--tools` |

!!! warning "Shared computers"
    Anyone who can open a terminal on your machine can run `claude` and reach every connected
    service, with no further login. On a shared machine, use separate user accounts, or remove the
    entries from `~/.claude.json` when you're done. Conversation history also sits in `~/.claude/`
    and can contain content from connected services.

---

## What's next

**[The skill reference](../hyperlinks/skill-reference.md)** — the workflows that use these
connections.

<label class="page-done"><input type="checkbox"> That's everything I need connected for now.</label>
