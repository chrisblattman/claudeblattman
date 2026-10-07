# Claude Code for Newbies

**The terminal is the biggest hurdle.** Once you get past it, the rest follows. No coding experience required.

This section takes you from zero to a working system. If you want to see what the system *does* before setting it up, start with the [workflows](../workflows/best-practices.md).

---

## Two Ways to Run Claude Code

Claude Code works the same way regardless of how you run it.

**Option 1: Terminal.** The text-only command line that comes with your Mac or PC. Black screen, blinking cursor. This is what the install guides walk you through, and it's all you strictly need.

**Option 2: A code editor.** A code editor is an app designed for working with files — think of it as a visual wrapper around the terminal. You get a file explorer, a text editor, and a built-in terminal all in one window. You don't need to write code to use one. Claude Code runs inside the editor's terminal, and you can watch its changes appear as color-coded highlights in real time.

| | **Terminal** | **Code Editor** |
|---|---|---|
| **What it looks like** | Black screen, blinking cursor, text only | Visual file explorer on the left, editor in the center, Claude in a side panel |
| **Learning curve** | Steeper — no visual cues, easy to feel lost | Gentler — you can see your files, click to open them, and watch Claude's edits appear |
| **Best for** | Quick one-off tasks, experienced terminal users | Longer work sessions, anyone who finds a blank terminal intimidating |

### Which code editor?

The two most popular options:

- **[VS Code](https://code.visualstudio.com/)** (free) — Microsoft's code editor. Install the Claude Code extension and you're set. This is what I use.
- **[Cursor](https://cursor.com/)** ($20/month) — A code editor built specifically around AI. It's a fork of VS Code, so it looks and works almost identically, but comes with AI features baked in — including access to Claude and other models through Cursor's own subscription. You can also run Claude Code in Cursor's terminal, so the two complement each other.

**My recommendation:** I use VS Code because it's free, simple, and does everything I need. If you're already paying for Cursor, it works great too. Either way, a code editor is **optional** — everything on this site works from a plain terminal. The install guides below start with Terminal, and you can add a code editor afterward if you want.

---

## Get Started (Do These in Order)

### Step 1: Install Claude Code

=== "Mac"

    **Open Terminal** (Cmd + Space → "Terminal" → Enter), then run:

    ```bash
    # Install Node.js first from https://nodejs.org (LTS version)
    node --version          # verify it worked

    # Then install Claude Code
    npm install -g @anthropic-ai/claude-code
    claude                  # first run — authenticates in browser
    ```

    Permission error? Use `sudo npm install -g @anthropic-ai/claude-code`

    [:octicons-arrow-right-24: Full Mac walkthrough](../toolkit/install-mac.md)

=== "Windows"

    **Open PowerShell** (Windows key → "PowerShell" → Enter), then run:

    ```powershell
    # Install Node.js first from https://nodejs.org (LTS version)
    node --version          # verify it worked

    # Then install Claude Code
    npm install -g @anthropic-ai/claude-code
    claude                  # first run — authenticates in browser
    ```

    Permission error? Right-click PowerShell → "Run as administrator" and retry.

    [:octicons-arrow-right-24: Full Windows walkthrough](../toolkit/install-windows.md)

### Steps 2-5: Configure

| Step | What You'll Do | Time |
|------|---------------|------|
| **[Set Up VS Code](vscode-setup.md)** *(optional)* | Install VS Code and the Claude Code extension. My preferred way to work, but not required. | 15 min |
| **[Your CLAUDE.md](../toolkit/claude-md.md)** | Create the instruction file that makes Claude Code work *for you*. | 30 min |
| **[MCP Setup](../toolkit/mcp-setup.md)** | Connect Claude Code to Gmail, Google Docs, Calendar, and other services. | 30-60 min |

<span id="how-claude-code-thinks"></span>
??? tip "How Claude Code Thinks"

    When you first launch Claude Code, you're in **Default mode** — the safest starting point. Claude proposes changes and waits for you to approve each one before it touches your files. As you get comfortable, you can change that.

    **The Three Modes**

    | Mode | What Claude Does | What You See |
    |------|-----------------|-------------|
    | **Default** | Proposes edits as diffs. You confirm each one. | Normal prompt |
    | **Plan Mode** | Explores and proposes — touches nothing. Reads files, suggests approaches. You decide. | `(plan)` label |
    | **Auto-Accept** | Applies edits automatically without asking. | `⏵⏵ accept edits on` |

    !!! warning "Accidentally in Auto-Accept?"
        If Claude started making changes without asking, look for the `⏵⏵` indicator. Press **Shift+Tab** until it disappears and you see the normal prompt. To undo changes: **Cmd+Z** (Mac) or **Ctrl+Z** (Windows) in VS Code.

    **How to Switch:** Press **Shift+Tab** to cycle through modes (Default → Plan → Auto-Accept → Default). You can also type `/plan` to jump to Plan mode directly.

    **When to Use Each Mode**

    | Situation | Mode |
    |-----------|------|
    | "I want to understand what's in this project" | **Plan mode** — Claude reads and proposes without touching files |
    | "Claude keeps asking me to approve small edits and I trust it" | **Auto-Accept** — edits apply immediately |
    | "I want Claude to draft something but I want to review first" | **Default** — Claude proposes, you confirm |
    | "I want Claude to explore options, then I'll decide" | **Plan mode**, then switch to Default to execute |

    **Start in Default mode.** Switch to Plan mode when you want Claude to think without acting, and to Auto-Accept when you're doing trusted, routine work and the confirmation prompts slow you down.

    See [Prompt, Plan, Review, Revise](../workflows/first-session-skills.md) for a workflow that puts Plan mode at the center.

## Learn and Browse

| Page | What You'll Learn | Time |
|------|------------------|------|
| **[Skill Library](skill-reference.md)** | All downloadable skills — what they are, how to install and use them, with customization details. | Browse |

---

## Prerequisites

Before starting:

1. **Have used a chatbot** (Claude.ai or ChatGPT) at least a few times
2. **Have a paid Anthropic account** (Claude Pro at minimum; Claude Max recommended for heavy use)
3. **Be comfortable with the idea of using a terminal** — you don't need experience, but you do need willingness

If you haven't used chatbots much yet, start with [The Essentials](../essentials/index.md) first.

---

## What You'll End Up With

After working through this section:

- **Claude Code installed and authenticated** on your computer
- **VS Code configured** with the Claude Code extension (optional but recommended)
- **A CLAUDE.md file** that tells Claude about your role, projects, and preferences
- **MCP integrations** connecting Claude to your email, calendar, and documents
- **A library of skills** (slash commands) that automate recurring tasks
- **A system that improves over time** as you add skills and refine your configuration

The whole setup takes a few hours spread over a couple of sessions. The time investment pays for itself within the first week of regular use.

---

## Common Issues

If you get stuck during setup, check here before giving up:

| Problem | Fix |
|---------|-----|
| **`node: command not found`** | Close Terminal and reopen it. If that doesn't work, reinstall Node.js from [nodejs.org](https://nodejs.org). |
| **`npm: command not found`** | Same as above — npm comes with Node.js. |
| **Permission errors during install** | Use `sudo npm install -g @anthropic-ai/claude-code` and enter your Mac password. |
| **Browser doesn't open for authentication** | Copy the URL from Terminal and paste it into your browser manually. |
| **Google OAuth tokens expire every 7 days** | Your Google Cloud project is in "Testing" mode. Switch to "Production" in the [Cloud Console](https://console.cloud.google.com) → Google Auth platform → Audience. See [MCP Setup](../toolkit/mcp-setup.md) for details. |
| **MCP server not responding** | Check that all paths in `~/.claude.json` are correct and absolute. Run `claude doctor` for diagnostics. Restart Claude Code. |
| **Skills don't appear after installing** | Restart Claude Code — new skills are only loaded at startup. |
| **Claude can't see my files** | Make sure you opened a folder (`File → Open Folder` in VS Code, or `cd` to the folder before running `claude`), not just a single file. |

For more help: [GitHub Issues](https://github.com/chrisblattman/claudeblattman/issues) or [GitHub Discussions](https://github.com/chrisblattman/claudeblattman/discussions).
