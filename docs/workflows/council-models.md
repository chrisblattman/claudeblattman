---
description: Connect your agents, try an outside opinion, and make a council of different AI models your default.
---

# Are you using 2–4 different AI models?

My default council is more than one AI. I ask different models to work on the same task, rather than assigning different personas to the same AI as on the [first page](../starter-kit/occasional.md). I find that they make different suggestions from one another.

At the time of writing (October 2026), my top choices are Claude, Codex by OpenAI (ChatGPT), and Antigravity by Google (Gemini). I use all three. Start by getting an inexpensive, lower-tier subscription to a second AI for your high-value tasks. Try it for a month, then decide whether it’s worth purchasing a higher-tier subscription to use for all your tasks, or even subscribing to a third. I also have an inexpensive Grok subscription for specific questions every so often.

## Why would I spend money on this? { #why-i-think-the-subscriptions-pay-for-themselves }

Think about the most important thing you have to do this month. How much would you be willing to pay for it to be done 20% better or 30% faster (or both!)?

The value of an hour of time and the value of a task will be different for everyone, but my suspicion is that it’s likely more than $23. It may well be worth more than $100 or even $200. Now think about all the other important tasks you could use it for over the course of the month.

I tend to think about this in terms of the cost of a research assistant: how much more they can accomplish in a day, or which tasks I can accomplish without their help. You can think about it in terms of your own hourly wage, or even how many coffees you buy in a month.

## What is each model good at?

For councils, I start by treating Claude, Codex, and Gemini as generalists. I want each to take a fresh look at the whole task. I don’t need to decide in advance that one is the writer and another is the critic. I use Grok for specific outside questions rather than as a regular council member.

To decide which earns a place in your own workflow, try them on work you can judge:

- **Writing and revision:** which gives you a draft you can actually use, and responds well to your corrections?
- **Research and checking:** which finds useful evidence, supports its claims, and catches something important the others missed?
- **Getting the work done:** which can use your files and tools, make the requested changes, and check the result with the least back-and-forth?

You can ask your main AI to arrange the comparison and bring the results together. Read the actual work before deciding which subscription to keep.

<!-- Editorial follow-up: replace or expand this practical comparison framework with a dated four-provider strengths guide after review. The October 28 CURRENT_FINDINGS.md supports task-specific capabilities, not permanent vendor roles or a general ranking. -->

<div class="checklist" markdown>

<span id="multiple-agents-are-worth-their-weight-in-gold"></span>
<span id="try-another-model"></span>

## Set up once

### 1. Download the apps { #download-the-apps }

Our general advice is to always ask your AI to do this for you. In this case, your AI might be able to help you download the apps using its in-app browser tools.

That said, this is one part of AI setup that I think may be easier to do manually. Download the second app you want to try, choose the version for your computer, and sign in:

- [Download Claude](https://claude.com/download).
- [Download ChatGPT, which includes Codex](https://chatgpt.com/download/).
- [Download Google Antigravity](https://antigravity.google/download), which I use to work with Gemini.

<label class="step-done"><input type="checkbox"> I’ve installed and signed in to the apps I want to use.</label>

### 2. Connect another model { #connect-another-model }

**Once again, ask your AI to do this for you.** Keep working in the app you prefer. Your main agent will call the other agents and bring their answers back into your conversation.

Open a session in the project folder you used on the [first page](../starter-kit/occasional.md). If you have not installed the starter kit, [do that first](../starter-kit/occasional.md#set-up-once). Then ask something as simple as:

```text
I want to connect the other AI apps to this app. I think there are instructions on claudeblattman.com. Walk me through it.
```

Or tell it exactly what you want to connect:

```text
I want to connect [app 2] and [app 3] to [main app you are currently in]. I want you to be able to call agents and subagents from those apps, collect the information, and bring it back to this app.
```

<details class="council-details" markdown="1">
<summary>If you need the steps, connect the agents with /kit-setup</summary>

=== "Claude"

    1. Start a **Code** session in your project folder.
    2. Type `/kit-setup`, select the matching skill from the suggestions, and send it.
    3. Choose which agents you want to connect when asked. The kit checks which other AI agents are available and walks you through the connections, including any installation or sign-in steps.
    4. Wait for confirmation that the connection works before moving on.

=== "Codex"

    1. Start a local chat in your project folder.
    2. Type `/kit-setup`, select the matching skill from the suggestions, and send it.
    3. Choose which agents you want to connect when asked. The kit checks which other AI agents are available and walks you through the connections, including any installation or sign-in steps.
    4. Wait for confirmation that the connection works before moving on.

</details>

<label class="step-done"><input type="checkbox"> I am cross-agent connected!</label>

## Put the connection to work

### 3. Ask a quick question with /ask-agents { #try-a-small-task-with-ask-agents }

I use `/ask-agents` for a quick, specific request or question: check an assumption, explain a disagreement, or give an outside opinion on one part of a draft. I still use `/council` to tackle entire tasks.

Try an outside opinion on the pilot proposal from the first page. Ask the other AI you connected. For example, if that is Claude:

```text
/ask-agents Ask Claude to read the second-pilot proposal and the concerns and constraints in my original request. What is the most important question my manager should ask before approving it? Explain why it matters and point to the relevant part of the proposal. Tell me which model answered and whether it could read the proposal itself.
```

Replace “Claude” with the agent you connected. Use the sample proposal or another document suitable for sending to that service. The starter kit’s outside-agent helpers are not for confidential or sensitive records.

Read the response. Does it reveal a problem you missed? If it does, ask your main agent to investigate and revise the proposal. If you disagree, explain why and ask it to examine the objection. For example:

```text
Check that concern against the staffing notes. If it holds up, revise the proposal and show me what changed. If it does not, explain what the reviewer missed.
```

If the connection is not working, you can still do this manually: ask your main agent to prepare a self-contained brief, including the file paths for relevant material. Paste the brief into the other app with access to the same project folder, then bring the reply back.

<label class="step-done"><input type="checkbox"> I asked for an outside-agent opinion and received a response back in my main agent app.</label>

## Make it your usual council

### 4. Choose who takes part { #do-they-need-different-personas }

The [first page’s council](../starter-kit/occasional.md#2-connect-other-ais-if-you-have-them) uses three subagents of the same AI. Once you have connected other models, I would start with one fresh agent from each:

- **Two connected AIs:** one fresh agent from each. Claude and Codex are one possible pair.
- **Claude, Codex, and Gemini:** one fresh agent from each. This is my usual preference.

Once I switch to fresh agents from different AIs, I find the personas and narrow assignments less relevant. A generalist from each app, independently working on the same task, gets pretty good results. Each gets the same brief and relevant material, then a separate fresh synthesis agent brings their findings together.

<label class="step-done"><input type="checkbox"> I've decided who my new council will be.</label>

### 5. Edit your skills to use your new default council { #make-this-your-default-council }

<span id="customize-your-council"></span>
<span id="if-you-want-to-add-gemini"></span>

Tell your main agent which panel you want in both skills. For my usual council:

```text
Edit my /council and /adversarial-review skills to use one fresh Claude agent, one fresh Codex agent, and one fresh Gemini agent as their default panels. The agent should call and retrieve the other two automatically. Give these generalists the same task and relevant material, have them work independently, then use a separate fresh synthesis agent. Keep the existing persona assignments for same-AI panels. Nothing else about either skill should change.

Check that my installed skills and connections support this. Save a lasting personal default that survives plugin updates, show me where it lives and how to undo it, and tell me if a requested model is unavailable rather than silently substituting another.
```

For a two-model council, name just the two you connected. You can still ask for a different panel on a particular task.

Then **open a new session** in the same project and ask:

```text
/council Run a small test case by asking each agent what model they are. For this test only, skip the synthesis report and report each agent's response. Also show the model reported by each connection, when available, separately from the agent's own answer.
```

This checks that the agents respond. Their self-descriptions are not proof of model identity. Use the connection's model information to check that. Ask the main agent to test the saved `/adversarial-review` panel in the same way.

Once the tests work, use `/council` to tackle a task and `/adversarial-review` to examine the draft without spelling out the panel every time. You still supply the goal, files, constraints, and your judgment. After review, apply the useful findings and check the revised work, just as on the first page.

<label class="step-done"><input type="checkbox"> My new council is up and running properly.</label>

## When a connection stops working

Unfortunately, in my experience, these skills and connections need a little maintenance. AI companies keep changing their apps and models, so a connection will periodically fail. The council skill should tell you when it could not call another agent. When that happens, ask your main AI to use a council of the agents that still work to diagnose and fix it.

**Check the login first.** Often, you just need to sign in again. Your main AI may not be able to complete the other app’s login for you; it should point you to the app or sign-in window where you can re-verify it.

Usually, you can ask something as simple as:

```text
Use a council to diagnose why my cross-app connections aren’t working and help me fix them. I need you to fix the connection to [other app] so that you can call its agents and retrieve their responses. Use whichever agents are still available. Smoke-test the reconnection by sending a small request and checking that the answer comes back here. Tell me if I need to sign in again myself.
```


</div>

[Continue with the master checklist →](../starter-kit/two-month-plan.md)
