---
description: Short answers to the questions that come up most — which app to use, whether you need both, and what the jargon actually means.
---

# FAQ

!!! warning "Questions placed, answers not written yet"
    The questions below are the ones worth answering, in the order they come up. The answers are
    still to be written — several depend on research that isn't finished.

## Picking your set up

### Should I use Codex or Claude?

If you already pay for Claude, use Claude. If you don't, use Codex — it runs on an ordinary ChatGPT
account, including the free one. See [Newcomers](starter-kit/index.md) for the install.

Either one will do everything on this site. The practical differences are that Claude's Code tab
needs a paid plan (Pro or above), while Codex works on a free ChatGPT account; and the starter kit's
shortcuts install through Claude's own interface, whereas Codex's setup route is clumsier. Neither
is better at the work.

### Do I need both Codex and Claude?

*To write.* No. Chris uses both; one is enough to start, and the second adds a useful second opinion
rather than a missing capability.

### Should I pay for Grok and Gemini?

*To write.* The research on this is done and the answer is mostly no — see
[A3 synthesis](https://github.com/chrisblattman/claudeblattman) in the working notes. Gemini has one
narrow advantage, which is large-context work inside Google Workspace. Grok's case is weaker.

## Using the tools

### What are agents?

*To write.* The distinction the whole site rests on is on the
[homepage](index.md) — a chatbot answers in a window, an agent works on the files already on your
computer and can work through several steps without you in between.

### What are plugins?

*To write.*

### What is a symlink?

A shortcut that makes one file appear in two places at once. The file lives in one place; the
symlink is a stand-in that points at it, and anything opening the stand-in gets the real file.

It comes up here for one reason. Some tools insist on finding a file at a fixed location — your
`CLAUDE.md` instructions file, for instance, is expected in a particular folder. If you work on two
computers, you want the real file in a synced folder (Dropbox, iCloud) so both machines share it,
*and* you want each machine's tool to find it where it expects. A symlink does both: one real file,
syncing normally, with a pointer sitting in the expected spot.

It is not a copy. Edit either path and you have edited the same file, which is the point — two
copies drift apart, and then you have two sets of instructions disagreeing with each other.

You don't need to make one by hand. Ask your agent: *"Set up a symlink so the real CLAUDE.md lives
in my synced folder but Claude still finds it in the usual place."* It knows how, it will show you
what it's about to do first, and you can check afterwards by asking whether the link resolves.

### What are Git and GitHub?

**Git** is a tool that tracks every version of a set of files, so you can see what changed, when,
and go back. **GitHub** is a website that hosts those tracked folders — called **repositories**,
or repos — so other people can read and copy them. Git is the mechanism; GitHub is the public
shelf it sits on.

Programmers live in both. You don't have to.

The reason either appears on this site is that my skills and templates live in a GitHub
repository, which is simply the most sensible place to keep files that change and that other
people copy. For you, a repo is a folder on a web page. You can read any file in it, and every
file has a "raw" address — a plain-text URL with nothing but the file's contents.

That raw address is the whole trick, because **you can hand it to your agent instead of
downloading anything**:

```
Fetch https://raw.githubusercontent.com/chrisblattman/claudeblattman/main/templates/claude-md-template.md and save it as CLAUDE.md in this folder.
```

No account, no install, no terminal. The [Templates](templates.md) page lists what's there and
gives you the prompt for each one.

One thing worth knowing even if you never use GitHub yourself: Git is also the best undo you can
give a project. If a folder is tracked by Git, every change is recoverable — which is a stronger
promise than asking an agent to put something back. You don't need to learn Git to get that; you
can ask your agent to set it up and to commit your work at the end of a session.

### What is prompt engineering?

Writing your request in a particular structure — a role, a task, constraints, an output format,
sometimes tagged sections — so the model performs better. For a while it was a real skill.

In an agent app it has mostly stopped being your job. You describe what you want in ordinary prose,
the way you'd brief a colleague, and the system does the structuring internally. Typing a formatted
prompt by hand now buys you very little.

Two things did not go away:

- **Task specification.** What outcome you want, which files matter, what constraints apply, what
  "done" looks like. No amount of model improvement guesses that for you — it's the whole of step 3
  on the [Occasional Users](starter-kit/occasional.md) page.
- **Standing preferences.** How you like things written, formats you always want, things you never
  want. Those belong in a file the agent reads every session, not retyped into each request.

If you're still working in a chatbot window rather than an agent, structure does still help — which
is its own argument for moving.
