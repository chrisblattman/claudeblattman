# Install Claude Code (Mac)

**A beginner's guide for Terminal newcomers. No prior command-line experience needed.**

---

## What Is Claude Code?

You've probably used Claude through a web browser at claude.ai — type a question, get an answer. Claude Code is the same Claude, but running in **Terminal** instead of your browser.

**Why does that matter?**

| Claude.ai (browser) | Claude Code (Terminal) |
|---------------------|------------------------|
| You copy/paste files into the chat | Claude reads files directly from your computer |
| You copy/paste code back out | Claude edits files directly |
| Limited to what you type or upload | Can search your folders, run scripts, send emails |
| Isolated from your workflow | Integrated into your workflow |

Think of it this way: Claude.ai is like texting a smart friend. Claude Code is like having that friend sit at your computer with you.

---

## Prerequisites

- **A Mac** (Windows? See [Install — Windows](install-windows.md))
- **Internet connection**
- **Anthropic account** — If you've used Claude.ai, you already have one. If not, you'll create one during setup.

---

## Step 1: Open Terminal

### What is Terminal?

Terminal is a text-based interface to your computer. Instead of clicking on folders and files, you type commands. It looks old-fashioned, but it's powerful — and it's how Claude Code runs.

You don't need to become a Terminal expert. You just need to know how to open it and type a few commands.

### How to open Terminal

1. Press **Cmd + Space** to open Spotlight search
2. Type **Terminal**
3. Press **Enter**

A window will appear with a blank screen and a prompt that looks something like:

```
yourusername@your-mac ~ %
```

The `%` (or sometimes `$`) is where you type commands.

**Don't panic at the blank screen.** Terminal is just waiting for you to tell it what to do.

---

## Step 2: Install Node.js

### Why you need this

Claude Code is built using a technology called Node.js. Think of Node.js as the engine that runs the Claude Code program. Without it, Claude Code can't start.

### How to install

1. Open your web browser and go to: **https://nodejs.org**
2. You'll see two download buttons. Click the **LTS** version (LTS means "Long Term Support" — it's the stable, reliable version)
3. Once downloaded, open the installer and follow the prompts (click Continue, Agree, Install)
4. When it finishes, go back to Terminal

### Verify it worked

In Terminal, type this command and press Enter:

```bash
node --version
```

You should see a version number like `v20.11.0` or similar. The exact number doesn't matter — what matters is that you see a version, not an error.

**If you see an error:** Close Terminal completely and reopen it, then try again. The installer sometimes requires a fresh Terminal window.

---

## Step 3: Install Claude Code

This downloads Claude Code from Anthropic's servers and installs it on your computer. You only do this once.

In Terminal, type this command and press Enter:

```bash
npm install -g @anthropic-ai/claude-code
```

**What to expect:** You'll see text scrolling by — this is normal. It's downloading and installing files. Wait until you see your prompt (`%` or `$`) appear again, meaning it's done.

This may take a minute or two depending on your internet connection.

!!! ask-claude "Stuck? Ask Claude."
    If you've already started Claude Code (Step 4 below), you can type your problem
    directly in the Claude Code terminal — for example:
    `I got a permission error when installing. Can you help?`
    Press Enter. Claude can see the context of your session and usually knows what went wrong.

!!! tip "Permission errors?"
    If you see permission errors, try running the command with `sudo` in front:
    ```bash
    sudo npm install -g @anthropic-ai/claude-code
    ```
    You'll be asked for your Mac password. When you type it, no characters will appear (this is a security feature) — just type your password and press Enter.

---

## Step 4: First Run and Authentication

The first time you run Claude Code, you need to link it to your Anthropic account. This is a one-time setup.

In Terminal, type:

```bash
claude
```

And press Enter.

**What happens next:**

1. Your web browser will open automatically
2. You'll see an Anthropic login page
3. Log in with your Anthropic account (or create one if needed)
4. Click "Approve" or "Authorize" when asked to give Terminal access
5. Return to Terminal — you should see a welcome message

**You're in.** Claude Code is now running.

---

## Step 5: Your First Conversation

Once Claude Code is running, you'll see a prompt where you can type messages. Just type like you would in any chat:

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

1. Open Terminal (Cmd + Space → "Terminal" → Enter)
2. Type `claude` and press Enter

That's it.

### Where you start matters

Claude Code pays attention to **which folder you're in** when you start it. If you're working on a specific project, navigate to that folder first:

```bash
cd ~/Desktop/my-project
claude
```

This way Claude can see and work with the files in that project.

### Resuming a previous session

| Command | What It Does |
|---------|--------------|
| `claude -c` | **Continue** — picks up your most recent conversation in the current folder |
| `claude --resume` | **Resume** — shows a list of recent conversations so you can choose which one |

**`claude -c`** is the one you'll use most. You were working on something, you closed Claude Code, and now you want to keep going.

---

!!! tip "What Claude Code can access"
    Claude Code can read any file in the folder where you run it — and, if asked, files elsewhere on your machine, including cloud-synced folders (Dropbox, iCloud, Google Drive). It can also run terminal commands. This is what makes it powerful: Claude works *with* your files, not in a separate sandbox. When Claude reads a file or processes data, that content is sent to Anthropic's API. Anthropic's [data policy](https://www.anthropic.com/policies/privacy) states API inputs are not used for model training. For more on data handling, see [Privacy](../privacy.md#tools-and-workflows).

## What's Next

You've installed Claude Code and had your first conversation. The recommended next steps:

1. **[Set up your CLAUDE.md file](../build-your-own/agents-md.md)** — This tells Claude about you, your work, and your preferences so every session starts with context. (~30 minutes)

2. **[How Claude Code Thinks](setup-overview.md#how-claude-code-thinks)** — Understand the three modes that control Claude's behavior (Default, Plan, Auto-Accept). (~5 minute read)

3. **[Connect external services](../build-your-own/mcp-setup.md)** — Give Claude access to Gmail, Google Docs, or Calendar so it can help with real tasks. (~10 minutes with a connector; longer only if you need the MCP route)

4. **[Explore the Skill Library](skill-reference.md)** — Download pre-built skills that automate common workflows.

---

## Quick Reference

| Task | Command |
|------|---------|
| Open Terminal | Cmd + Space → "Terminal" → Enter |
| Check Node.js | `node --version` |
| Install Claude Code | `npm install -g @anthropic-ai/claude-code` |
| Start Claude Code | `claude` |
| Continue last session | `claude -c` |
| Resume a past session | `claude --resume` |
| Get help | `/help` |
| Exit | `/exit` or Ctrl+C |

---

## Troubleshooting

**`node: command not found`** — Close Terminal and reopen it. If that doesn't work, reinstall Node.js from nodejs.org.

**`npm: command not found`** — Same fix as above. npm comes with Node.js.

**Permission errors during install** — Use `sudo npm install -g @anthropic-ai/claude-code` and enter your Mac password.

**Browser doesn't open for authentication** — Copy the URL from Terminal and paste it into your browser manually.

**Claude Code feels slow** — The first response in a session can take a few seconds as it loads context. Subsequent responses are faster.
