# Install Claude Code (Windows)

**A beginner's guide for PowerShell newcomers. No prior command-line experience needed.**

---

## What Is Claude Code?

You've probably used Claude through a web browser at claude.ai — type a question, get an answer. Claude Code is the same Claude, but running in **PowerShell** instead of your browser.

**Why does that matter?**

| Claude.ai (browser) | Claude Code (PowerShell) |
|---------------------|--------------------------|
| You copy/paste files into the chat | Claude reads files directly from your computer |
| You copy/paste code back out | Claude edits files directly |
| Limited to what you type or upload | Can search your folders, run scripts, send emails |
| Isolated from your workflow | Integrated into your workflow |

Think of it this way: Claude.ai is like texting a smart friend. Claude Code is like having that friend sit at your computer with you.

---

## Prerequisites

- **A Windows PC** (Windows 10 or later)
- **Internet connection**
- **Anthropic account** — If you've used Claude.ai, you already have one. If not, you'll create one during setup.

---

## Step 1: Open PowerShell

### What is PowerShell?

PowerShell is a text-based interface to your computer. Instead of clicking on folders and files, you type commands. It looks old-fashioned, but it's powerful — and it's how Claude Code runs.

You don't need to become a PowerShell expert. You just need to know how to open it and type a few commands.

### How to open PowerShell

1. Press the **Windows key** on your keyboard
2. Type **PowerShell**
3. Click **Windows PowerShell** from the results

A window will appear with a blue or black background and a prompt that looks something like:

```
PS C:\Users\YourName>
```

The `>` is where you type commands.

**Don't panic at the blank screen.** PowerShell is just waiting for you to tell it what to do.

---

## Step 2: Install Node.js

### Why you need this

Claude Code is built using a technology called Node.js. Think of Node.js as the engine that runs the Claude Code program. Without it, Claude Code can't start.

### How to install

1. Open your web browser and go to: **https://nodejs.org**
2. You'll see two download buttons. Click the **LTS** version (LTS means "Long Term Support" — it's the stable, reliable version)
3. Once downloaded, open the installer and follow the prompts (click Next, agree to the license, click Install)
4. **Important:** When the installer asks about "Tools for Native Modules," check the box to install them — this prevents common issues later
5. When it finishes, **close and reopen PowerShell** (the installer needs a fresh window to take effect)

### Verify it worked

In PowerShell, type this command and press Enter:

```powershell
node --version
```

You should see a version number like `v20.11.0` or similar. The exact number doesn't matter — what matters is that you see a version, not an error.

**If you see an error:** Close PowerShell completely and reopen it, then try again. If the error persists, restart your computer and try once more.

---

## Step 3: Install Claude Code

This downloads Claude Code from Anthropic's servers and installs it on your computer. You only do this once.

In PowerShell, type this command and press Enter:

```powershell
npm install -g @anthropic-ai/claude-code
```

**What to expect:** You'll see text scrolling by — this is normal. It's downloading and installing files. Wait until you see your prompt (`>`) appear again.

!!! ask-claude "Stuck? Ask Claude."
    If you've already started Claude Code (Step 4 below), you can type your problem
    directly in the Claude Code terminal — for example:
    `I got a permission error when installing. Can you help?`
    Press Enter. Claude can see the context of your session and usually knows what went wrong.

!!! tip "Permission errors?"
    Try opening PowerShell as Administrator:

    1. Press the **Windows key**
    2. Type **PowerShell**
    3. Right-click **Windows PowerShell** and select **Run as administrator**
    4. Click **Yes** when prompted
    5. Run the install command again

---

## Step 4: First Run and Authentication

The first time you run Claude Code, you need to link it to your Anthropic account. This is a one-time setup.

In PowerShell, type:

```powershell
claude
```

And press Enter.

**What happens next:**

1. Your web browser will open automatically
2. You'll see an Anthropic login page
3. Log in with your Anthropic account (or create one if needed)
4. Click "Approve" or "Authorize" when asked to give access
5. Return to PowerShell — you should see a welcome message

**You're in.** Claude Code is now running.

---

## Step 5: Your First Conversation

Once Claude Code is running, just type like you would in any chat:

```
> What files are in my current folder?
```

Press Enter, and Claude will respond — but now Claude can actually look at your files and tell you what's there.

!!! ask-claude "Not sure what to do first?"
    In the Claude Code terminal, try typing:
    `I just installed Claude Code. I'm a professor/researcher. What's the most useful thing I can do in the next 10 minutes?`
    Press Enter. Claude will walk you through getting started based on your role.

### Useful to Know

| Action | How |
|--------|-----|
| Send a message | Type and press **Enter** |
| Multi-line message | Press **\\** then **Enter** for a new line without sending |
| Queue a message while Claude works | Just type — it'll be sent when Claude is ready |
| Scroll through past messages | **Up/Down** arrow keys |
| Get help | Type `/help` |
| Exit | Type `/exit` or press **Ctrl + C** |

---

## Step 6: Opening Claude Code Again

After the first-time setup, you don't need to repeat Steps 1-4. From now on:

### Starting a new session

1. Open PowerShell (Windows key → "PowerShell" → Enter)
2. Type `claude` and press Enter

That's it.

### Where you start matters

Claude Code pays attention to **which folder you're in** when you start it. If you're working on a specific project, navigate to that folder first:

```powershell
cd ~\Desktop\my-project
claude
```

### Resuming a previous session

| Command | What It Does |
|---------|--------------|
| `claude -c` | **Continue** — picks up your most recent conversation in the current folder |
| `claude --resume` | **Resume** — shows a list of recent conversations so you can choose which one |

**`claude -c`** is the one you'll use most. You were working on something, closed Claude Code, and now want to keep going.

---

!!! tip "What Claude Code can access"
    Claude Code can read any file in the folder where you run it — and, if asked, files elsewhere on your machine, including cloud-synced folders (OneDrive, Dropbox, Google Drive). It can also run PowerShell commands. This is what makes it powerful: Claude works *with* your files, not in a separate sandbox. When Claude reads a file or processes data, that content is sent to Anthropic's API. Anthropic's [data policy](https://www.anthropic.com/policies/privacy) states API inputs are not used for model training. For more on data handling, see [Privacy](../privacy.md#tools-and-workflows).

## What's Next

1. **[Set up your CLAUDE.md file](../build-your-own/agents-md.md)** — Tells Claude about you and your preferences. (~30 minutes)
2. **[How Claude Code Thinks](setup-overview.md#how-claude-code-thinks)** — Understand the three modes that control Claude's behavior (Default, Plan, Auto-Accept). (~5 minute read)
3. **[Connect external services](../build-your-own/mcp-setup.md)** — Give Claude access to Gmail, Google Docs, etc. (~10 minutes with a connector; longer only if you need the MCP route)
4. **[Explore the Skill Library](skill-reference.md)** — Download pre-built skills for common workflows.

---

## Troubleshooting

### Common Issues

**`node: command not found` or `npm is not recognized`** — Node.js wasn't added to your PATH. Close and reopen PowerShell. If that doesn't work, restart your computer. If it still doesn't work, reinstall Node.js and make sure you don't uncheck any PATH options during installation.

**Execution policy errors** — Run this command first, then try the install again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Type **Y** and press Enter when prompted.

**Antivirus blocking installation** — Some antivirus software may flag npm packages. Temporarily disable real-time scanning during installation if needed, then re-enable it afterward.

**Browser doesn't open for authentication** — Copy the URL from PowerShell and paste it into your browser manually.

---

## Quick Reference

| Task | Command |
|------|---------|
| Open PowerShell | Windows key → "PowerShell" → Enter |
| Check Node.js | `node --version` |
| Install Claude Code | `npm install -g @anthropic-ai/claude-code` |
| Start Claude Code | `claude` |
| Continue last session | `claude -c` |
| Resume a past session | `claude --resume` |
| Get help | `/help` |
| Exit | `/exit` or Ctrl+C |
