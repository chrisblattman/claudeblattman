---
description: Ask your AI to diagnose a failing skill, update an outdated workflow, and check the result on real work.
---

# Fix and update your skills as AI changes

A skill saves a way of working. That way of working may need to change. A connection can stop responding, a model name can change, or the agent can start interpreting an instruction differently. Sometimes nothing is broken: the agent has improved, and a procedure that once helped is now unnecessary work.

**Ask your AI to help diagnose it.** Start in the project where you noticed the problem, with the failed attempt or a useful example close at hand:

```text
Use a council to look at this skill and how it worked on my last task. What needs fixing or updating? Check the instructions, supporting files, and connections. Tell me what you would change and why.
```

You can use the same approach when you suspect a skill has become overcomplicated. Give the agent the result you want, rather than asking it to preserve every step of the old procedure.

<div class="checklist" markdown>

### 1. Show the agent what isn't working

Tell it what you asked for, what happened, and what you expected. Point it to a previous result that worked well if you have one. An error message helps with a broken connection; an unsatisfactory draft helps with a workflow that runs but produces poor work.

```text
This skill used to help me [task]. In this attempt, [what went wrong]. I wanted [result]. Read the attempt and the skill that actually ran, then help me work out where the problem starts.
```

Ask it to check which installed copy it used. Editing a different copy won't repair the next run. If the problem is access to another app, the [connection guide](../build-your-own/mcp-setup.md#4-fix-a-connection-when-it-stops-working) covers that part.

<label class="step-done"><input type="checkbox"> I've shown my agent a concrete problem or an opportunity to improve the skill.</label>

### 2. Decide what to change

For a recurring or puzzling problem, **use a [council](../starter-kit/occasional.md)!** Ask it to distinguish a missing file or failed login from an instruction that needs rewriting. It should also check whether the agent followed the instructions it already had.

When the tools have improved, ask a different question:

```text
Review this skill against what the apps and agents can do now. Check current documentation. Which steps still help, which can be simplified, and which can the app now handle itself? Suggest changes that would make the result better or require less effort from me.
```

Look at the proposed changes and add your judgment. Keep the parts that serve your work. A new model or feature is a reason to investigate, not a reason to rebuild every skill.

<label class="step-done"><input type="checkbox"> I've decided which changes would make this workflow more useful.</label>

### 3. Have the agent update the skill

```text
Make the changes we agreed to. Keep my other customizations, update any supporting files that need to change, and keep a way to restore the previous version. If this skill comes from a plugin, put my changes somewhere a plugin update won't overwrite them, and make sure the app uses the intended version.
```

For a skill you maintain yourself, the agent can update its instructions and supporting files together. For a shared package, have it check the package's supported customization or update route first. Ask it to explain where your version will live so you can find it again.

<label class="step-done"><input type="checkbox"> My agent has updated the skill and its supporting files.</label>

### 4. Try it on the work that exposed the problem

Open a fresh session and ask the agent to run the revised skill on a small example of the same task. A connection repair should retrieve a real response. A writing workflow should produce a draft you can judge. Check the result itself, then give the agent any final corrections.

```text
Try the updated skill on [task]. Confirm which version ran and check whether it solves the problem we identified. Show me the result and tell me anything that still needs attention.
```

Once it works, use it on your next real task. Keep a short note of what changed and why; it gives you a useful starting point if the problem returns.

<label class="step-done"><input type="checkbox"> I've tried the revised skill and checked that it improves the result.</label>

</div>

## Audit your skills periodically { #audit-your-skills }

Every so often, ask your agent to look across the skills you use. Two skills may now do the same job, or an update to an app may have made an old workaround unnecessary. I start by asking for a short list so I can decide what’s worth changing.

```text
Look through my skills and recent runs. Which skills overlap, have broken connections, or could be simpler now? Give me a short list in priority order and show me an example for each suggestion.
```

For improving writing guidance through your edits, use the [voice improvement system](../how-i-improve-the-work.md). To build a new skill from work you repeat, see [Turn repeatable workflows into skills](../build-your-own/building-skills.md).
