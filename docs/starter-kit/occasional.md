---
description: Use three independent subagents to develop your work, then a fresh four-member panel to review it.
---

# Are you asking multiple subagents to tackle the task?

I use **councils** and **adversarial review** as the default for essentially every task and every review. Instead of settling for one AI’s first answer, I want several independent attempts and a synthesis of what they found. One agent may see an approach, another a missing assumption, and another a reason to ask a different question.

The habit is simple: **describe the task, let a council work on it, add your judgment, and improve the result.** Use `/council` to develop the work, then `/adversarial-review` to examine the result, along with your own judgment. Additional review cycles are choices you can add as needed.

<details class="council-details" id="not-sure-what-councils-or-subagents-are" markdown="1">
<summary>Not sure what subagents are?</summary>

When you chat with an AI in Claude Code or Codex, that’s your main **agent**. The separate workers it starts and manages behind the scenes are **subagents**. Subagents are particularly useful when you want to tackle many things in parallel. A council asks several of them to tackle the same question independently, then brings their findings together. Adversarial review asks fresh workers to examine the result independently and find consequential problems.

A **skill** is a saved set of instructions for your agent. The `/council` skill prepares the members’ assignment, coordinates their work, and arranges the synthesis. The slash helps you invoke the skill directly. You can also ask in plain language: “Use the council skill to help me with this task.” The agent can recognize the request, load the installed skill, and spin up the subagents.

A **plugin** bundles skills and their supporting files so you can install them together, once. There’s [more on agents and skills](../hyperlinks/agents-vs-skills.md) if you want it.

</details>

## The working loop { #run-the-loop }

We’re going to start by assuming you have only one AI subscription, and the council skill in the starter kit works by spinning up subagents with different personas to tackle the task.

Your request goes into `/council`, which prepares the shared brief, sends it to three independent members, and arranges a synthesis. You ask questions, give your judgment, and have the draft revised. Then `/adversarial-review` brings in four fresh reviewers. Use their findings to edit again, and save a handoff when you finish.

<div class="council-loop council-overview">
<div class="council-horizontal" tabindex="0" role="region" aria-label="Simple council loop; scroll horizontally on small screens">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 170" role="img" aria-labelledby="council-overview-title council-overview-desc">
<title id="council-overview-title">The simple council loop</title>
<desc id="council-overview-desc">Your request, council, add judgment and revise, adversarial review, check and revise again if needed, then done. Before starting a new request, read HANDOFF.md.</desc>
<defs><marker id="council-overview-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M1 1 L6 3.5 L1 6" fill="none" class="council-arrowhead" stroke-width="1.1"/></marker></defs>
<path class="council-edge" d="M112 50 H134" marker-end="url(#council-overview-arrow)"/>
<path class="council-edge" d="M222 50 H244" marker-end="url(#council-overview-arrow)"/>
<path class="council-edge" d="M386 50 H408" marker-end="url(#council-overview-arrow)"/>
<path class="council-edge" d="M570 50 H592" marker-end="url(#council-overview-arrow)"/>
<path class="council-edge" d="M754 50 H776" marker-end="url(#council-overview-arrow)"/>
<path class="council-edge council-return" d="M812 68 V116 H62 V80" marker-end="url(#council-overview-arrow)"/>
<rect class="council-session" x="12" y="22" width="100" height="56" rx="2"/>
<text x="62" y="55">Your request</text>
<rect class="council-command" x="136" y="34" width="86" height="32" rx="2"/>
<text class="council-command-label" x="179" y="55">/council</text>
<rect class="council-session" x="246" y="22" width="140" height="56" rx="2"/>
<text x="316" y="46">Add judgment</text>
<text x="316" y="63">and revise</text>
<rect class="council-command" x="410" y="34" width="160" height="32" rx="2"/>
<text class="council-command-label" x="490" y="55">/adversarial-review</text>
<rect class="council-session" x="594" y="22" width="160" height="56" rx="2"/>
<text x="674" y="46">Check and revise again</text>
<text x="674" y="63">if needed</text>
<rect class="council-command" x="778" y="34" width="68" height="32" rx="2"/>
<text class="council-command-label" x="812" y="55">/done</text>
<text x="430" y="145">Read <tspan class="council-command-label">HANDOFF.md</tspan>, then start a new request</text>
</svg>
</div>
</div>

<details class="council-details">
<summary>See how each skill uses subagents for several independent attempts</summary>
<div class="council-loop">
<div class="council-horizontal" tabindex="0" role="region" aria-label="Council and review workflow; scroll horizontally to follow the sequence">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1190 288" role="img" aria-labelledby="council-flow-title council-flow-desc">
<title id="council-flow-title">Council and adversarial review loop</title>
<desc id="council-flow-desc">Your session invokes council: three separate subagents, Skeptic, Pre-mortem, and Completeness Checker, converge on a separate synthesis subagent. Your judgment and draft revision lead to adversarial-review: four fresh separate subagents, Skeptic, Pre-mortem, Completeness Checker, and Chief of Staff, converge on a fresh synthesis subagent. Your session revises and checks, then invokes done. A return arrow allows another revision cycle.</desc>
<defs><marker id="council-flow-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M1 1 L6 3.5 L1 6" fill="none" class="council-arrowhead" stroke-width="1.1"/></marker></defs>
<path class="council-edge" d="M113 145 H134 M134 79 V211 M134 79 H154 M134 145 H154 M134 211 H154"/>
<path class="council-edge" d="M304 79 H320 V211 M304 145 H320 M304 211 H320 M320 145 H338" marker-end="url(#council-flow-arrow)"/>
<path class="council-edge" d="M432 145 H462" marker-end="url(#council-flow-arrow)"/>
<path class="council-edge" d="M582 145 H610 M610 73 V217 M610 73 H630 M610 121 H630 M610 169 H630 M610 217 H630"/>
<path class="council-edge" d="M780 73 H797 V217 M780 121 H797 M780 169 H797 M780 217 H797 M797 145 H817" marker-end="url(#council-flow-arrow)"/>
<path class="council-edge" d="M911 145 H944" marker-end="url(#council-flow-arrow)"/>
<path class="council-edge" d="M1050 145 H1085" marker-end="url(#council-flow-arrow)"/>
<path class="council-edge council-return" d="M997 167 V265 H522 V173" marker-end="url(#council-flow-arrow)"/>
<text class="council-note" x="755" y="281">Revise again, if needed</text>
<rect class="council-command" x="185" y="10" width="88" height="25" rx="2"/>
<text class="council-command-label" x="229" y="27">/council</text>
<rect class="council-command" x="626" y="10" width="158" height="25" rx="2"/>
<text class="council-command-label" x="705" y="27">/adversarial-review</text>
<text class="council-note" x="705" y="49">Fresh subagents</text>
<rect class="council-session" x="18" y="123" width="95" height="44" rx="2"/>
<text class="council-label" x="65.5" y="150">Your request</text>
<rect class="council-agent" x="154" y="61" width="150" height="36" rx="2"/>
<text class="council-label" x="229" y="84">Skeptic</text>
<rect class="council-agent" x="154" y="127" width="150" height="36" rx="2"/>
<text class="council-label" x="229" y="150">Pre-mortem</text>
<rect class="council-agent" x="154" y="193" width="150" height="36" rx="2"/>
<text class="council-label" x="229" y="216">Completeness Checker</text>
<rect class="council-agent" x="338" y="123" width="94" height="44" rx="2"/>
<text class="council-label" x="385" y="150">Synthesis</text>
<rect class="council-session" x="462" y="119" width="120" height="52" rx="2"/>
<text class="council-label" x="522" y="140">Your judgment</text>
<text class="council-label" x="522" y="157">Revise draft</text>
<rect class="council-agent" x="630" y="55" width="150" height="36" rx="2"/>
<text class="council-label" x="705" y="78">Skeptic</text>
<rect class="council-agent" x="630" y="103" width="150" height="36" rx="2"/>
<text class="council-label" x="705" y="126">Pre-mortem</text>
<rect class="council-agent" x="630" y="151" width="150" height="36" rx="2"/>
<text class="council-label" x="705" y="174">Completeness Checker</text>
<rect class="council-agent" x="630" y="199" width="150" height="36" rx="2"/>
<text class="council-label" x="705" y="222">Chief of Staff</text>
<rect class="council-agent" x="817" y="119" width="94" height="52" rx="2"/>
<text class="council-label" x="864" y="150">Synthesis</text>
<rect class="council-session" x="944" y="123" width="106" height="44" rx="2"/>
<text class="council-label" x="997" y="150">Revise &amp; check</text>
<rect class="council-command" x="1085" y="132" width="68" height="26" rx="2"/>
<text class="council-command-label" x="1119" y="149">/done</text>
</svg>
</div>
<div class="council-legend"><span><i class="council-session" aria-hidden="true"></i>Your session</span><span><i class="council-agent" aria-hidden="true"></i>Separate subagent</span></div>
</div>
</details>

<div class="checklist" markdown>

<span id="you-must-use-councils"></span>
<span id="try-it-on-your-work"></span>

## Set up once

### 1. Install the starter kit { #1-install-the-starter-kit-or-use-plain-language }

You’ll want a council skill to follow the rest of this workflow. You can ask for a council manually each time, but it’s not practical to keep rebuilding the instructions. A repeatable skill gives the agents a consistent process to follow.

I’m not the only one doing this, and you do not have to use my skills. The advantage of mine is that the workflows and guides on this website refer to them, so the examples should be easier to follow. The tradeoff is upkeep: I get bogged down by other tasks and I might forget to update the skill bundle online. Other authors may maintain theirs more actively. Here’s a [list of other council and adversarial review skills others have published](../hyperlinks/council-skills.md).

For installation (and anything else): **when in doubt, just ask the AI to do it.** That’s a general principle for making the most of AI. The rest of the page is here if you’re interested in what’s happening or want more detail, but ideally, we don’t actually want you to follow all the instructions. We want your AI to follow them.

Open a local Claude Code or Codex session, navigate to the project you want to work in, and ask your agent something as simple as this:

```text
Walk me through the councils page on claudeblattman.com. I want to install the starter kit. Then explain to me what it is.
```

You don’t have to learn the installation procedure before you start. Ask it to **install it and teach you**. You may still need to click an install button, approve access, or sign in yourself.

<details class="council-details" markdown="1">
<summary>If that didn’t work, install the starter kit manually as a plugin</summary>

=== "Claude"

    1. Open the Claude app’s **Settings → Plugins**. In versions with a **Customize** section, look for **Customize → Plugins** instead.
    2. Choose **Add → Add Marketplace → Add from a repository**. Enter `https://github.com/chrisblattman/claudeblattman` and select **Sync**.
    3. Find **starter-kit**, open it, and choose **Install**.
    4. Start a new Code session in your project folder. Type `/kit-hello` and select the matching skill from the suggestions. The app fills in the plugin prefix. Send it to check that the plugin responds.

=== "Codex"

    1. Open **Plugins** in the app’s sidebar, or **Settings → Plugins** in versions that put it there.
    2. Search for **Starter Kit for Codex**, open its details, and choose **Install** or the **+** button. If it is not listed, give the agent the GitHub link above so it can check the repository installation route.
    3. Start a new chat in your project folder. Type `/kit-hello`, select the matching skill, and send it to check the installation.

If the controls in your version look different, use the current [Claude installation guide](https://code.claude.com/docs/en/discover-plugins) or [Codex plugins guide](https://learn.chatgpt.com/docs/plugins), or ask the agent to walk you through them.

</details>

<details class="council-details" markdown="1">
<summary>Running into an excessive amount of permission requests?</summary>

The quick answer: **turn on automatic permissions** to reduce routine approval prompts—**Auto** in Claude Code or **Approve for me** in Codex, where available. These modes check actions automatically, though some requests may still need your approval. Ask your agent to show you the setting, then read [Set permissions in Your first session](newcomers.md#3-set-permissions) for more about what it allows and how to choose your settings.

</details>

**What the starter kit adds**

<div class="council-kit-summary" markdown>

| Command | What it does |
|---|---|
| `/council` | Develops the work with independent members and synthesizes their findings. |
| `/adversarial-review` | Reviews the draft with a fresh panel and synthesizes its findings. |
| `/kit-hello`, `/kit-setup` | Checks the installation, introduces the skills, and connects other agents. Usually needed only during setup. |
| `/ask-agents` | Asks another connected agent for an outside opinion. |
| `/done` | Saves a handoff for your next session. |

</div>

I publish some of my [other frequently used skills on GitHub](https://github.com/chrisblattman/claudeblattman/tree/main/skills). They do not ship with this starter kit, but you can find them there if and when you want them.

<label class="step-done"><input type="checkbox"> The skills and their supporting files are installed.</label>

### 2. Meet the council { #2-connect-other-ais-if-you-have-them }

<span id="why-three-agents"></span>

The starter kit’s council uses three independent subagents of the same AI, with different **personas**, or assigned perspectives:

<div class="council-kit-summary" markdown>

| Persona | Its assignment |
|---|---|
| **Skeptic** | Find important claims that lack support and explain the evidence gap. |
| **Pre-mortem** | Imagine the plan failed. Identify the top three concrete causes and a mitigation for each. |
| **Completeness Checker** | Find gaps against standard practice: people who need to be involved, dependencies, inputs, and success criteria. |

</div>

These are separate subagents, each considering the whole task through its assigned lens.

My own default uses one Claude agent, one Codex agent, and one Gemini agent. I find the differences between models useful. [Part two explains how to connect different agents and change your default](../workflows/council-models.md#connect-another-model). You can start here with the AI you already use.

<label class="step-done"><input type="checkbox"> I understand what the three members will examine.</label>

## Develop the work

### 3. Give the council one real task { #3-describe-one-real-task }

Choose something you actually need: a proposal, a decision, a draft, or an approach to a new project. Start a session in your project folder, then type or dictate in ordinary language. For example:

```text
/council Help me develop a two-page proposal for a second pilot. We've already done a first pilot. The information is scattered through this project folder, [other locations, such as Google Docs, email threads, etc.]. I've started discussing changes for this pilot in email with [names here]. Some questions I'm thinking about are, [list them here]. I'm worried about [concerns, constraints here].
```

Council organizes the dictated request under the hood into a structured `PROMPT.md`. You do not need to dictate in a particular order or arrive with a polished prompt. What matters is giving it the information that will make the result useful:

- **The result and its audience.** What should exist at the end, who will use it, and what decision or job it needs to support.
- **The material and constraints.** Where to find the relevant files; the deadline, length, budget, and requirements that must hold.
- **What good looks like.** How you will judge the output. “My manager can decide without asking us to reconstruct the staffing plan” is more useful than “make it excellent.”
- **Examples and corrections.** Point to a good previous result and say what to borrow. If an earlier attempt missed your intent, explain what was wrong and what should be different this time.

You can leave the method open. If you do not know how to approach the task, ask the council to suggest an approach and come back with the questions that would materially change it. You supply the goal, context, and judgment; you do not have to prescribe every step.

**My first prompts in a work session are typically 3 to 4 paragraphs. You shouldn't worry about concision, and in fact the more context and information you can give the council, the better**

<label class="step-done"><input type="checkbox"> I’ve asked the council to handle the task.</label>
<label class="step-done"><input type="checkbox"> My dictated message includes relevant files, constraints, and desired results.</label>

### 4. Let the council members work independently { #4-let-the-agents-work-independently }

The agent you are talking to sends the shared prompt and relevant files—or access to those files—to three separate subagents. Each gets the same question and evidence, plus any assigned persona. They finish their reports independently, before seeing one another’s answers. Dividing the budget, timetable, and writing among agents can be useful too, but that is a different assignment from getting independent takes on the whole proposal.

When all three reports are back, your main agent brings them together for synthesis. It gives that job to a fresh subagent. The synthesis compares the reasons and evidence, explains the disagreements, and brings forward important findings raised by only one member. It produces one report with the recommended approach, the unresolved questions, and the decisions that need your judgment. Agreement alone does not prove a claim is true.

<label class="step-done"><input type="checkbox"> My three subagents ran and produced a synthesis report for me.</label>

### 5. Ask questions and give your judgment { #5-ask-questions-and-give-your-judgment }

Read the synthesis. **Ask for elaboration or clarification on consequential or debated points.** You can ask the agent to bring forward the relevant evidence and explain why the council members disagree.

```text
Explain the disagreement about staffing. Which assumptions drive it, what evidence supports each view, and what would change the recommendation?
```

You do not have to accept the recommendations verbatim. Once you have dug into the points you did not understand or agree with, say what you accept, reject, or want changed. For example, if the synthesis has numbered recommendations:

```text
I’ve read points 4, 5, and 6; they sound fine. Reject point 1: I want to test the process with our existing customers before expanding it to new ones. Apply your suggested revision in point 9, shortening the pilot to five weeks so we have a week to deal with delays. Save the current version, then revise the proposal itself using these decisions.
```

Your priorities and constraints help the agent revise the actual work.

<label class="step-done"><input type="checkbox"> I dug into the important disagreements and have given my direction.</label>

<span id="recursive-review-matters"></span>
<span id="use-another-council"></span>
<span id="review-add-judgment-and-revise"></span>
<span id="scrutinize-important-work"></span>
<span id="what-i-have-used-it-for"></span>
<span id="what-the-extra-reviewer-caught"></span>
<span id="ask-for-a-full-council"></span>
<span id="what-the-extra-stage-changes"></span>
<span id="the-files-behind-a-full-council"></span>

## Review the result { #review }

### 6. Run adversarial review { #5-run-adversarial-review }

Once you’ve added your judgment, provided feedback, and pushed back where needed, use `/adversarial-review` to examine the revised work. It starts a fresh panel to look for consequential problems. The starter kit’s default is **four independent subagents of the same AI**, followed by a fresh synthesis.

<div class="council-kit-summary" markdown>

| Reviewer | What it checks in the draft |
|---|---|
| **Skeptic** | Which important claims lack support? Where is the argument relying on wishful thinking? |
| **Pre-mortem** | What are the top three concrete causes of failure, and what could prevent each? |
| **Completeness Checker** | Who needs to be involved? What dependencies, inputs, or success criteria are missing? Which vague commitments need to be made concrete? |
| **Chief of Staff** | What is the actual decision, what does saying yes cost, and is it reversible? Would a smaller commitment serve you better? |

</div>

The first three personas overlap with `/council`, but they now review the draft, using fresh reviewers who did not develop it. The Chief of Staff adds a check on whether the result helps you decide and act.

```text
/adversarial-review Review the revised pilot proposal against my original request and the decisions we made afterward. Distinguish must-fix problems from preferences.
```

Just like `/council`, each reviewer receives the full brief and the same version of the work, plus its assigned focus.

<label class="step-done"><input type="checkbox"> I have reviewed the findings of the four-member panel.</label>

### 7. Apply the changes and check them { #6-revise-and-check-the-result }

Review does not, in and of itself, finish the task. Once `/adversarial-review` has come back, I edit again using those comments and findings. Tell the agent which findings to act on, ask it to explain any it rejects, and inspect the changed files. Go back and forth with your agent as many times as you need to get a final result you’re satisfied with.

I usually find one Council round and one Adversarial Review round, plus a few back and forth final comments, sufficient. Of course, that’s not a hard rule. A major revision, unresolved disagreement, or new evidence may justify another round. Give that round a specific question to settle.

<label class="step-done"><input type="checkbox"> The useful fixes are applied, and I have checked the result.</label>

### 8. Save where you landed { #7-save-where-you-landed }

Agentic memory is getting better, but for consequential work or long working days, use `/done` to save a handoff in your project folder. This is particularly helpful if you are planning to pick up work in this project in a new session rather than continuing in this one.

`/done` asks the agent to record the current status, decisions, unresolved questions, next action, and links to the work and council reports in `HANDOFF.md`. It gives the next session a route back to the task brief, individual reports, and synthesis saved with the project, so it can inspect how you reached the result.

<label class="step-done"><input type="checkbox"> The work and handoff are saved where I can find them.</label>

</div>

[Next: connect different AI models and change your default council →](../workflows/council-models.md)
