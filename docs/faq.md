---
description: Practical answers about choosing your AI, using skills, and giving your agent useful instructions.
---

# FAQ

## Picking your set up

### Should I use Codex or Claude?

Start with either. If you already use one, keep it. If you already pay for Claude or ChatGPT, check what your plan includes before buying something else. The [first-session guide](starter-kit/newcomers.md#1-choose-an-agent) walks you through choosing and opening your app, and explains why I currently prefer Codex.

I find Claude and Codex both good generalists. Their interfaces and connections differ, so start with the one that fits how you work. You can add another later.

### Do I need both Codex and Claude?

One is enough to start, including for a council of independent subagents. For important work, I recommend trying a second AI: I find the extra perspective worth paying for.

Start with an inexpensive subscription for a month and use it on work that matters to you. Then decide whether to upgrade or add a third. [Using different AI models](workflows/council-models.md) explains how to connect them and make them your default council.

### Should I pay for Grok and Gemini?

I use them for different reasons. Gemini often gives me different results and perspectives from Claude and Codex, so I include it in my default council. I use Grok for narrow questions about AI integrations and best practices, drawing on X/Twitter posts. It is not a regular member of my council.

You do not need my whole setup to get started. The [model comparison](workflows/council-models.md#what-is-each-model-good-at) explains what I get from each.

## Using the tools

### What are agents?

An agent can work with your files and tools and carry out several steps toward a result. You give it a task, supply context, and correct its work as you go. A subagent is a separate worker your main agent starts and manages for you.

Try a real task in the [first-session guide](starter-kit/newcomers.md). The [council walkthrough](starter-kit/occasional.md) shows how to get several independent attempts and a review of the result.

### What are plugins?

A plugin bundles skills and their supporting files so you can install them together. A skill is a saved set of instructions for your agent.

The [starter kit](starter-kit/occasional.md#set-up-once) is one such bundle. `/council` develops the work with independent members and brings their findings together. `/adversarial-review` examines the draft with fresh reviewers. `/done` saves a handoff for your next session.

Ask your AI to help install the kit and explain what it adds. Plugins also give you a way to receive updates; ask the agent to check your installed version and how updates work in your app.

### What is a symlink?

A symlink is a pointer to a file or folder somewhere else. Opening the pointer takes you to the original. Editing through either path changes the same file.

This can help when an app expects an instructions file in a particular place, but you want to keep the actual file in a synced folder. You set up a pointer on each computer so the app can find that shared file.

Ask your agent to handle the setup:

```text
Help me keep my standing instructions in my synced folder and connect them where this app expects to find them. Check that the connection works.
```

### What are Git and GitHub?

**Git** records saved versions of a project's files. Each saved checkpoint is called a **commit**. **GitHub** hosts these projects, called **repositories**, so people can share and work on them together. Repositories can be public or private.

My skills and templates live in a public GitHub repository. You can give your agent a link and ask it to read the instructions and help you use the files. The [Templates](templates.md) page has examples.

Git is also useful for keeping a history of your own work. Ask your agent to set it up and save checkpoints at useful milestones. You can return to those saved versions; Git does not automatically preserve every unsaved change.

### What is prompt engineering?

It means shaping a request to help an AI produce a useful result. For the work on this site, start by explaining what you want in ordinary language, as you would to a colleague. You can dictate several paragraphs; you do not need a polished prompt.

Give the agent the result you want, who it is for, the relevant material, constraints, and what good looks like. Examples and corrections help too. If you do not know the best approach, ask it to suggest one and ask you the questions that would change it.

The [council walkthrough](starter-kit/occasional.md#3-describe-one-real-task) shows how to do this. Preferences you want applied repeatedly belong in [standing instructions](build-your-own/agents-md.md) or your [voice guides](build-your-own/voice.md), so you do not have to explain them from scratch each time.
