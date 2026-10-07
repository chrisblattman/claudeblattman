---
description: Your first session with an AI agent on the desktop app. Ten steps, no terminal, no coding. Install it, point it at a folder, and run one small task end to end.
---

# Newcomers

Ten steps. By the end you'll have run one real task end to end on a folder on your own computer —
and you'll know whether this is worth more of your time.

You don't need to code. You won't open a terminal. If you've only ever typed into a chatbot, you're
in the right place.

<div class="checklist" markdown>

## Set up your tool

### 1. Choose an agent

There are two of these and they do the same job. Which one depends on a single question: **do you
already pay for Claude?**

- **Yes** (Pro or above, about $20/month) → use **Claude**.
- **No** → use **Codex**, from OpenAI. It runs on an ordinary ChatGPT account, including the free one.

Either is fine. The rest of this page works the same in both, and I'll say "the app" from here.
You can read more about the pros and cons of each agent
[here](../faq.md#should-i-use-codex-or-claude).

<label class="step-done"><input type="checkbox"> I've chosen whether to use Claude or Codex.</label>

### 2. Install the app

Download it, double-click, sign in. In Claude, click the **Code** tab (in the top left corner of
the app window). In Codex, you're already there.

!!! warning "Ignore any instructions to install this through a terminal"
    You may find instructions elsewhere — including older pages on this site — telling you to open
    Terminal and install something called Node.js. **That route still exists and you don't need it.**
    The desktop app is a normal application. Nothing to type into a black screen.

<label class="step-done"><input type="checkbox"> I've installed the app and signed in.</label>

### 3. Set permissions

The app asks your permission before it does things, and how often it asks is a setting you control.
Thirty seconds now, because the wrong setting is the most common reason people give up in week one.

Find the **mode selector** near the bottom left of the message box. It shows one of these:

| It says | What that means |
|---|---|
| **Manual** | Asks before every edit and every command. Safest, slowest |
| **Accept edits** | Edits files without asking, still asks before running commands |
| **Plan** | Works out an approach and shows it to you before changing anything |
| **Auto** | Gets on with it. A second AI reviews each action instead of you, and stops to ask when something looks risky |
| **Bypass permissions** | Asks about nothing and turns off secondary safety checks. Only for use within a sandboxed folder or in directories you know are version controlled |

For today, pick **Plan** — you'll see what it intends to do before it does any of it, which is what
steps 7 and 8 depend on.

To change it: click the selector, or press **Cmd+Shift+M** on a Mac, **Ctrl+Shift+M** on Windows.

!!! danger "One mode to leave alone"
    You may see a mode called **Bypass permissions**, or advice to turn checks off entirely. Don't.
    Its own documentation says to use it only inside a sandboxed container or virtual machine. If you
    work with human-subjects data, unpublished results or student records, it is not for you.

<label class="step-done"><input type="checkbox"> I've set the permissions mode that I'm comfortable with.</label>

## Run the loop

### 4. Pick a test folder and make a copy of it

Something from a finished or stalled project. Messy, a bit embarrassing, the kind of folder where
you're no longer sure what's in it. Then duplicate it and work on the duplicate — nothing you care
about can be touched, and you'll stop holding your breath.

Use a folder that lives locally on your own computer for now; avoid iCloud Drive, Google Drive,
Dropbox, etc. for now.

Keep out of this first run anything with participant data, student records, or medical or financial
information. [Before you use this on real work](#before-you-use-this-on-real-work) explains why.

!!! tip "No folder you'd want to experiment on?"
    Make a new one, call it `AI Practice`, and put a couple of rough notes in it. You don't have to
    create those files by hand — that's fiddlier than it sounds, because TextEdit and Word save the
    wrong format and Notepad adds a hidden `.txt`. Point the agent at the empty folder (read about
    "pointing the agent" below in [step 5](#5-point-the-agent-at-it)), and ask it to:

    ```
    Create a file called notes.md with a few rough notes about X
    ```

<label class="step-done"><input type="checkbox"> I have isolated a low-stakes folder for me to practice in.</label>

### 5. Point the agent at it

In Claude, use the project-folder selector. In Codex, open the folder. In both apps you'll find
this button just above the message box.

Alternatively, copy the file path into the message box and ask:

```
Read this folder 'file/path/here'
```

Don't send that message yet — you can send it in one go with step 6.

When it asks permission, approve **that one folder** and nothing wider. If it asks for all of
Documents, or your home folder, or Dropbox, decline and point it at the copy again.

Don't agonise over this. The folder you pick now doesn't lock you in — next time you want to work
somewhere wider, the agent will ask you again for that folder.

This is the step that makes this different from a chatbot: the app can now read what's actually in
there.

<label class="step-done"><input type="checkbox"> The agent can see my folder, and I approved that one folder only.</label>

### 6. Ask it to read the files and propose one small task

Don't tell it what to do yet. Ask it what's worth doing:

```
Read the files in this folder first. Help me pick one small, useful thing we can finish in ten minutes. Before you change anything, show me a short plan and wait for my okay.
```

If it offers a one-page summary of what's in the folder, take it — that's a good first task,
because you already know what's in there.

Now wait. It will come back with a plan, or stop to ask permission. That's step 7.

!!! tip "Three ways to get a plan before anything happens"
    You don't have to be in Plan mode to be shown a plan first — that's one of the better things
    about these tools. In rough order of how firmly they hold:

    1. **Plan mode**, which you set in step 3. The strongest: it *prevents* changes until you
       approve, rather than relying on the agent to offer.
    2. **`/plan`**, typed as a command. Same mode, reached a different way.
    3. **Just asking**, which is what the prompt above does — "show me a short plan and wait for my
       okay."

    One thing worth being precise about, because it matters: the third is a *request*, not a
    setting. Writing the word "plan" in a message does not switch the app into Plan mode — the
    agent will almost always honour a clear instruction to stop and show you its thinking, but
    nothing is enforcing it. There is a small risk that on the *next* message you send, the agent
    will not hold back: it will make the edit you asked for and then carry on executing on its own.

<label class="step-done"><input type="checkbox"> The agent read my files and proposed a task.</label>

### 7. Read the plan

This is the step people skip, and it's the one that matters. Read what it intends to do **before**
you approve it.

You are allowed to say no, and the first plan is often not the best one.

!!! tip "If the plan doesn't look right"
    Don't edit it yourself and don't argue in detail — just ask for a better one, and say what
    bothers you:

    ```
    Don't edit anything yet. What are the top risks in this plan, and what is the safest first step?
    ```

    Or name what you want done differently instead — the plan is a draft, not a verdict:

    ```
    The process sounds fine, but let's store the outputs in a second folder on Desktop called test_run_1
    ```

    Or, if something specific is wrong:

    ```
    Stop — you're about to change X, and I don't want that touched. Give me a version that leaves it alone.
    ```

    Then read the new plan the same way. There is no limit on how many times you can do this, and no
    cost to doing it.

<label class="step-done"><input type="checkbox"> I've read the plan and I'm comfortable with what it's suggesting.</label>

### 8. Let it work

Approve the plan and let it run. This is where the actual work happens, and it can take a few
minutes — the agent reads files, writes, checks itself, and works through the steps in order.

In **Plan** mode it stops and asks before each change. Approve the ones you understand. If a request
doesn't make sense to you, deny it and ask what it was for — that question is always fair, and the
answer is usually informative.

!!! warning "The asking is relentless at first. It does get better"
    Your first session will feel like being interrupted constantly, because the app starts out with
    no standing permission to do anything. This is the single most common reason people give up in
    week one, and it is worth knowing that it is a phase rather than the permanent condition.

    It thins out two ways. When a prompt offers something like **"don't ask again"**, taking it
    records that kind of action for that folder, so you aren't asked a second time — the
    interruptions drop off as those build up. And once the asking has become tedious rather than
    reassuring, **Auto** mode is the designed answer: a second model reviews each action against
    your rules instead of you, and stops to ask when something looks risky. That is a real trade —
    you get fewer interruptions and you are no longer the one checking each step.

Nothing leaves your computer without your explicit yes.

<label class="step-done"><input type="checkbox"> I approved the plan and let the agent finish one piece of work.</label>

### 9. Review the work

Two things to read, and they are not the same. The agent narrates what it did as it goes — that's
how you find out what it decided and what it skipped. Then there's the thing it actually made.

Check the output properly. You already know what was in that folder, which is exactly why this is a
good first task — you'll be able to tell immediately where it's right and where it's guessing.

A chatbot could have written you something from notes you pasted in. It could not have done this,
because this required reading a dozen files it had never seen. That's the whole difference, and it's
easier to feel once than to explain.

<label class="step-done"><input type="checkbox"> I've read what the agent has told me in this session.</label>
<label class="step-done"><input type="checkbox"> I've opened what it made and checked it against what I already knew.</label>

### 10. Write a handoff

The thing that makes this stick isn't the first session. It's the second one being easy.

```
Write HANDOFF.md in this folder: current status, what you changed, decisions, and the next step for a future session.
```

Open it — that file is the point of the exercise, because it proves the next session can pick up
where this one stopped.

Tomorrow, point the agent at the same folder and say **"read HANDOFF.md and pick up where we left
off."** It will.

That's the whole habit: **a folder, and a note to your future self.** Everything else on this site is
a variation on it.

<label class="step-done"><input type="checkbox"> I've checked that a handoff file now exists in my folder.</label>
</div>

## Before you use this on real work

The files stay on your computer. But **what the app reads from them is sent to the company that
makes it** — Anthropic or OpenAI — in order to be processed. That's true of chatbots too; it's just
easier to forget when the files never leave your screen.

Practically: treat the folder you point it at the way you'd treat an email attachment to a colleague
outside your institution. For human-subjects data, unpublished results, student records or anything
under a data-use agreement, read [how the data actually
flows](../tax-workflow/before-you-start/privacy-and-setup.md) first, and check your institution's
policy. That page is written about tax documents, but the mechanics are the same for any sensitive
folder.

Nothing in the ten steps above requires you to take that risk, which is why step 4 asks for an old,
dull folder.

## What to try next

This is the first of three guides, and they go in order:

- **[Occasional Users](occasional.md)** — the loop for work where being wrong would cost you
  something: you read a plan before anything happens, and so do three critics.
- **[Regular Users](regular.md)** — a project that runs for months rather than an afternoon.

There's also a [two-month plan](two-month-plan.md) for working through the rest of Claude
Blattman — one page and one thing to do with it, once a week for eight weeks. It starts with the
page you just finished.
