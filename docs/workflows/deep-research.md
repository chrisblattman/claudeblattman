---
description: Choose between a research council and browser Deep Research, let your agent run the search, and put the findings to work.
---

# Are you taking advantage of deep research?

[← Back to the master checklist](../starter-kit/two-month-plan.md)

Before I ask a council to develop a proposal or recommend what to do, I often need more information. What have other people tried? What happened? How much of their experience applies to my problem? Research gives the council better inputs to work with.

You can ask your agents to search for that information, or have them operate the dedicated Deep Research tools in ChatGPT and Gemini. **These are two different workflows, with two different skills.** In either case, start in your working project. Ask your agent to run the research and bring the findings back there.

<div class="checklist" markdown>

## Choose your research tools

### 1. Choose how to investigate { #choose-your-research-skill }

<div class="council-kit-summary" markdown>

| Skill | When to use it |
| --- | --- |
| `/research-council` | Have your connected agents search the web independently, check sources, and combine their findings into a research report. |
| `/deep-research` | Get reports from ChatGPT and Gemini’s dedicated Deep Research products. Your agent operates the browser, downloads the reports, saves them to your project folder, and combines them. |

</div>

Like `/council`, `/research-council` gets independent attempts and a fresh synthesis. Its assignment is specifically to gather evidence: search the web, inspect original sources, look for counterevidence, and link claims to their support. A working council uses that evidence to develop the proposal, plan, or other work you need.

**Research Council uses the AIs you have connected.** Its default is one fresh researcher from each available Claude, Codex and Gemini provider. If you’ve [set up multiple AIs](council-models.md#connect-another-model) for `/council` or `/ask-agents`, `/research-council` uses those same connections.

Grok joins only when you ask for it. Its strength is investigating X/Twitter posts, so I find it useful for fast-moving discussions and changing tools, including these very AI workflows.

**Deep Research uses ChatGPT and Gemini by default.** You can ask for just one. This needs access to Deep Research in the browser; connecting Codex or Antigravity is not the same thing. (You can also run Deep Research in the [Gemini app](https://support.google.com/gemini/answer/15719111?co=GENIE.Platform%3DiOS&hl=en), which is different from Antigravity, but I find automating that route isn’t worth the hassle. Browser controls work pretty well.) Your agent checks access and reports any login or usage-limit problem. It does not quietly replace a missing Deep Research report with an ordinary chat answer.

Not every research request needs Deep Research. I’ve separated these skills because Deep Research requests in both [ChatGPT](https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt) and [Gemini](https://support.google.com/gemini/answer/15719111) are limited, and I don’t want to use them up every time I do a web search. Use `/research-council` for independent web searches; choose `/deep-research` when you want the dedicated products to investigate a question in depth.

<label class="step-done"><input type="checkbox"> I’ve chosen how I want to run the research.</label>

### 2. Ask your AI to set it up { #get-the-research-skill-ready }

<span id="install-and-setup"></span>

**As always, ask your AI to walk you through it.** Open your project in Claude Code or Codex and ask:

```text
Walk me through the research guide at claudeblattman.com. Help me install the research skill I want to use and check that its connections work.
```

Both skills are in the [GitHub skills folder](https://github.com/chrisblattman/claudeblattman/tree/main/skills). They are separate from the starter kit. Ask the agent to install the whole skill folder, including its supporting files.

For **Research Council**, the [connection walkthrough](council-models.md#connect-another-model) and `/kit-setup` help connect other AIs. You can start with the AI you already use.

For **Deep Research**, let your agent connect to a browser where you are signed into ChatGPT and Gemini. You may need to sign in yourself or approve browser access. Once that is working, the agent should handle the research sessions and downloads. You should not normally need to copy the prompt between apps or bring the reports back by hand. If you do, ask your agent to diagnose why browser control or report retrieval isn’t working.

<label class="step-done"><input type="checkbox"> My research skill is installed and its connections work.</label>

## Research a real question

<span id="run-a-research-task"></span>
<span id="deep-research-federated-multi-vendor-synthesizable"></span>
<span id="why-this-is-its-own-workflow"></span>
<span id="the-three-problems-it-solves"></span>
<span id="the-shape-of-a-run"></span>
<span id="step-1-pre-structure-the-prompt"></span>
<span id="step-2-dispatch-in-parallel"></span>
<span id="step-3-federated-archive"></span>
<span id="step-4-absorb-browser-outputs"></span>
<span id="step-5-synthesize-with-dr-synthesize"></span>
<span id="a-worked-example-homicide-reduction-in-low-trust-cities"></span>
<span id="when-to-also-run-a-council"></span>
<span id="failure-modes"></span>
<span id="see-also"></span>

### 3. Tell it what you need to learn { #ask-a-bounded-question }

Start with the decision or task you are working on. Give the agent the background, your concerns, and what you need the research to help you decide. Dictate it if that makes it easier to give more context. The agent will turn your request into a common brief for the researchers. Like `/council`, both skills can use `/prompt` behind the scenes when fuller preparation is needed. They also work without it, and you do not need to run it separately. If you already have a research prompt, they will use it as written unless you ask for a revision.

For example:

```text
/research-council I’m interested in the easiest way to measure respondents’ networks because I’m worried about spillover effects in our study. Read the study design and draft questionnaire in this project.

I care about ease for the respondent: this is an online survey, and I don’t want extra questions to discourage people from finishing. I imagine most of the relevant connections will be within [the group or community we’re studying], but I’m not sure how much that assumption matters.

What approaches have other studies used? Compare how much effort they ask of respondents and what they let us learn about possible spillovers. Help me decide what’s worth including in our survey.
```

To use the dedicated browser products, start the same request with `/deep-research` instead. You can also name the provider:

```text
/deep-research [Insert the same dictated message about the question and context.] Skip Gemini for this run.
```

<details class="council-details" markdown="1">
<summary>Where do the chats and reports go?</summary>

The browser skill files its chats in a **Deep Research** project in ChatGPT and a **Deep Research** notebook in Gemini, where those containers are supported. It finds or creates them and tells you if filing is blocked.

Both skills save the question, individual reports and synthesis in your working project. The browser skill preserves the original exports as well.

For Gemini, the agent exports the report to a Google Doc, downloads that document to your project folder, and checks that the complete report and its sources are there. Only then does it move the temporary Google Doc to Trash. Your research chat and local report remain available. This is cumbersome, but I find it to be the best way to automate exports from Gemini.

If a browser session or download is interrupted, ask the agent to resume the existing research. It should recover the same report rather than start the question over.

</details>

<label class="step-done"><input type="checkbox"> I’ve asked a research question that will help with my work.</label>

### 4. Read the answer and follow up { #read-the-synthesis-then-inspect-the-evidence }

When multiple reports return, a fresh agent reads them and writes a synthesis. You should get an answer to your question, important disagreements, gaps, and links to the reports and sources. With one report, you get that report and a short summary. You do not need a separate synthesis skill.

**The synthesis should follow the evidence.** It does not give each AI an equal vote or automatically favor a dedicated Deep Research report. Several reports citing the same study are still drawing on one study.

Start with the synthesis, then ask about anything that would change your decision. For the network questions:

```text
Which of these approaches has actually been used in an online survey? What do we know about completion rates and how long the questions take? If we ask fewer questions, what would we lose in our ability to measure possible spillovers?
```

Open the sources behind the important claims. If the answer is hard to follow, ask the agent to explain it in ordinary language. If it has missed the point, explain what you actually need to decide and go back and forth.

<details class="council-details" markdown="1">
<summary>Can I combine agent research and Deep Research?</summary>

Yes, but ask for both explicitly. Neither skill automatically adds the other. For example:

```text
Use /research-council and /deep-research to investigate the same question independently. Start both, then combine their completed reports into one final synthesis. Keep the individual reports too.
```

There is no fixed weighting between the two kinds of report. Ask the synthesizer to compare the evidence, explain disagreements, and identify which findings are useful for your question.

If you already have reports, ask the agent to combine those without starting new research.

</details>

<label class="step-done"><input type="checkbox"> I’ve read the findings and followed up on the important questions.</label>

### 5. Put the findings to work { #put-the-findings-to-work }

Once you have your research, use the [council workflow](../starter-kit/occasional.md) as usual. Now the council has better information to work with:

```text
/council Use the research to propose network questions for our online survey. Keep the burden on respondents low, and explain what we can and can’t learn about spillovers with your proposed questions. What should we test before adding them to the survey?
```

Add your judgment, revise, and use `/adversarial-review` when you want a fresh examination of the result. For a smaller change, just ask your main agent to apply what you learned.

When you finish, use `/done` to save where you got to, what the research changed, and what remains open. The reports stay with the project so you can return to them in the next session.

<label class="step-done"><input type="checkbox"> I’ve used the research to move my work forward.</label>

</div>
