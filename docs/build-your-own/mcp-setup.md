---
description: Connect email, calendars and documents to your AI, then use them on a real task.
---

# Connect your apps

A project folder gives the agent your local files. Connections let it work with the information you keep elsewhere: email, calendars, shared documents, and messages. Instead of copying a thread into the chat, you can ask it to find the thread and use it.

**As always, ask your AI to help you set this up.** Start with a task and the app that holds the information you need. You can add more connections as your work calls for them.

<div class="checklist" markdown>

## Set up a connection { #connectors }

### 1. Tell the agent what you want to connect

Open your project in Claude Code or Codex and ask:

```text
Help me connect [app] so you can use it in this project. Check what is already available, do the setup you can, and walk me through anything I need to do myself.
```

A connection may let the agent read information, make changes, or both. Ask it to explain the access the connection requests. You will usually need to sign in yourself.

<details class="council-details" markdown="1">
<summary>Where to find the connections yourself</summary>

=== "Claude"

    Open **Customize → Connectors**, find the service, and select **Connect** or **Install**. Follow the sign-in prompts. See the [Claude connector guide](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities) for the current controls.

=== "Codex"

    Open the desktop app's **Plugins** tab, find the service, and install its plugin. Connect the account when prompted, then start a new chat to use it. The [OpenAI plugin guide](https://learn.chatgpt.com/docs/plugins) explains the available connections and controls.

On a university or company account, an administrator may need to enable the connection first. Ask your agent to help distinguish an account restriction from an unfinished sign-in.

</details>

<label class="step-done"><input type="checkbox"> I've connected an app my work needs.</label>

### 2. Try it on something you can recognize

Ask for a specific email, event, or document so you can tell whether the connection works:

```text
Find my latest email thread with [name] about [topic]. Summarize what we agreed and link to the thread.
```

For documents, try: “Find the latest proposal for [project] and tell me what still needs work.” If you have more than one account, say which one you mean.

<label class="step-done"><input type="checkbox"> My agent found the right material through the connection.</label>

## Put it to work

### 3. Give it a task that uses the connected information

Now ask for the result you actually need. For example:

```text
Help me prepare for my meeting with [name]. Read our recent emails and the proposal in this project. What decisions do we need to make, and what should I ask? Save a short meeting brief here.
```

You can bring several sources into the same request once they are connected. The [meeting workflow](../workflows/meeting-workflow.md) shows how to turn that preparation into follow-up afterward.

<label class="step-done"><input type="checkbox"> I've used connected information on a real task.</label>

### 4. Fix a connection when it stops working

Often the next step is simply signing in again. Ask the agent to check:

```text
The connection to [app] isn't working. Help me diagnose it, walk me through any sign-in I need to repeat, and test that you can retrieve something afterward.
```

You can manage or disconnect accounts in the app's connection settings. If a service is missing from the directory, ask your AI to investigate the supported options before building anything custom.

<details class="council-details" markdown="1">
<summary>What if there is no built-in connection?</summary>

<a id="mcp-servers"></a>
MCP is a standard that lets an AI use tools supplied by another service. Many connectors already use it behind the scenes. A service may offer an official custom connector, or there may be a plugin that supplies the connection.

Ask: “Is there a supported connection for [app] in the AI I'm using? If there isn't, what is the simplest way to work with its information?” Sometimes opening the service in the agent's browser or exporting a document is enough.

</details>

<label class="step-done"><input type="checkbox"> I know how to ask for help when a connection needs attention.</label>

</div>


## Bring research tools into your workflow { #research-tools }

Add a tool when you have a job for it. For research, two useful examples are a notebook for working through sources and a reference manager for keeping them organized.

**Gemini Notebook (formerly NotebookLM)** lets you collect sources in a notebook and ask questions about them. You can bring the resulting notes or report back into your project. See [the notebook guide](../hyperlinks/notebooklm.md) and [Google's introduction](https://support.google.com/gemininotebook/answer/16206563). Using a separate research notebook does not by itself connect it to your agent.

**Zotero** organizes references, attached PDFs, and notes. If you already use it, ask your agent how to work with the library you have. It can investigate an available connector or help you export the relevant references and files. The [Zotero guide](https://www.zotero.org/support/quick_start_guide) explains its library and export features.

```text
I keep my research in [app]. Help me use the relevant sources for [project]. Check whether you can connect to it. If not, help me bring over the files or notes we need.
```

[Dictation](../hyperlinks/wispr-flow.md) and [meeting transcription](../hyperlinks/granola.md) have their own guides. Start with the tools you already use and add others when they help with a real task.
