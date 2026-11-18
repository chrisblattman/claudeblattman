---
description: Use Skill Refresh to find out why a skill went wrong, make a focused repair, and try it again.
---

# Fix and update your skills as AI changes

Sometimes a skill I use keeps making the same mistake. Sometimes the tools improve and I realize the skill is putting me through steps I no longer need. I built [Skill Refresh](https://github.com/chrisblattman/claudeblattman/blob/main/skills/skill-refresh/README.md) for both jobs. I want it to show me what changed, what part of the skill is worth keeping, and how we'd know the fix worked.

Take my check-in skill. When I wanted to change how it handled older newsletters, the question was which messages should get caught by one rule. We could check examples on either side of the cutoff and leave the rest of the check-in alone.

## Start with the run that went wrong

Here's a small example to try. Your meeting brief says that Lena will send the FAQ by May 28. In the notes, May 28 was a suggestion. You also want the brief to keep deadlines people actually agreed to. Give the agent the skill, the notes, and the brief.

<div class="checklist" markdown>

### 1. Show the agent what isn't working

```text
Use Skill Refresh to look at my meeting-brief skill. The brief turned a suggested date into an agreed deadline. Read the notes, the brief, and the copy of the skill that actually ran. Tell me what caused it and what you'd change. Keep the decisions and follow-up sections.
```

Ask it to find the cause before rewriting anything. The agent might have loaded an older copy or missed a file. It might also have followed the instructions exactly and produced a bad result because the instructions were wrong. For a broken connection, see [how to check app access](../build-your-own/mcp-setup.md#4-fix-a-connection-when-it-stops-working).

<label class="step-done"><input type="checkbox"> I've shown my agent a concrete problem or an opportunity to improve the skill.</label>

### 2. Decide what to change

In this example the repair could be one line in the skill. Use “by” only for a deadline someone agreed to. Mark a suggested date as tentative or leave it out. The revised brief might say “Lena will send the FAQ. May 28 was suggested.” Leave the rest of the brief's format alone. When the tools have improved, ask the agent to check what the app can do now and show which old steps you could drop.

For a recurring problem that's harder to explain, I sometimes use a [council](../starter-kit/occasional.md) to get a few independent diagnoses. For a straightforward change, I ask the agent to make it and check the result.

<label class="step-done"><input type="checkbox"> I've decided which changes would make this workflow more useful.</label>

### 3. Have the agent update the skill

Tell it which change you want. Ask it to keep the old version somewhere you can restore it from and show which file it edited. If the skill came from a plugin, ask where to keep your changes so an update won't overwrite them.

<label class="step-done"><input type="checkbox"> My agent has updated the skill and its supporting files.</label>

### 4. Try it on the work that exposed the problem

Run the skill again in a fresh session. Try another set of notes with both a suggested date and an agreed deadline. Look at the new brief and check that it treats those dates differently. I also want to see that the decisions and follow-up still look the way I asked for.

<label class="step-done"><input type="checkbox"> I've tried the revised skill and checked that it improves the result.</label>

</div>

## Audit your skills periodically { #audit-your-skills }

When I look across my skills, I ask the agent for a short list of things worth fixing. Two skills might overlap, or an old workaround might be unnecessary. A recent failure or a concrete example helps me decide where to spend my time.

## Try Skill Refresh

[Install the standalone beta](https://github.com/chrisblattman/claudeblattman/blob/main/skills/skill-refresh/README.md) in Claude Code or Codex, or use the prompt above with your existing agent and leave out “Use Skill Refresh.”

For a new routine, see [Build and refresh your skills](../build-your-own/building-skills.md). For writing in your voice, see [how I reuse corrections](../how-i-improve-the-work.md).
