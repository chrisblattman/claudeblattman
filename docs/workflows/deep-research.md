---
description: Choose between a research council and browser Deep Research, let your agent run the search, and put the findings to work.
---

# Are you taking advantage of deep research?

[← Back to the master checklist](../starter-kit/two-month-plan.md)

Before I decide what to do, I often need to know what other people have tried. What worked? What didn’t? How much applies to my problem? I ask AI to investigate, then bring the findings to a council to help work out what to do with them.

I use two skills for this: **`/research-council` for independent web searches, and `/deep-research` for ChatGPT and Gemini’s dedicated Deep Research tools.** You ask from your project; the agent runs the research and brings back the reports.

<div class="checklist" markdown>

## Choose your research tools

### 1. Choose how to investigate { #choose-your-research-skill }

<div class="council-kit-summary" markdown>

| Skill | When to use it |
| --- | --- |
| `/research-council` | Have your connected agents search the web independently, check sources, and combine their findings into a research report. |
| `/deep-research` | Get reports from ChatGPT and Gemini’s dedicated Deep Research products. Your agent operates the browser, downloads the reports, saves them to your project folder, and combines them. |

</div>

`/research-council` works like a council, with a more specific job: search the web, read the original sources, and look for evidence that challenges the answer as well as supports it. A fresh agent brings the reports together. Your working council can then use that evidence to develop a proposal or plan.

**`/research-council` uses the AIs you have connected:** one fresh researcher from each available Claude, Codex and Gemini. If you’ve [set up multiple AIs](council-models.md#connect-another-model) for `/council` or `/ask-agents`, it uses those same connections.

Grok joins when you ask for it. I find it especially useful for searching X/Twitter, where people discuss new tools and approaches long before there is much written elsewhere. These very AI workflows are a good example.

**`/deep-research` uses ChatGPT and Gemini by default.** You can ask for just one. The agent operates their Deep Research tools in your browser, so you need access to those products. A Codex or Antigravity connection alone doesn’t provide it.

Not every question needs Deep Research. Requests in both [ChatGPT](https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt) and [Gemini](https://support.google.com/gemini/answer/15719111) are limited. I’ve kept the skills separate because I don’t want to use that allowance every time I ask for a web search.

**Using Claude as your main driving agent?** Confusingly, my Claude setup includes a skill called `/anthropic-skills:deep-research`. Despite the name, it is closer to our `/research-council` skill: Claude subagents investigate different parts of the question, rather than operating the real Deep Research products in ChatGPT or Gemini. With only one AI connected, our `/research-council` skill falls back to just one agent: one researcher going after the whole question. Therefore, if this is your setup, you may get a more detailed answer from Claude’s specialist approach, especially when the question has several parts. It is an option if you don’t want to pay for or connect other AIs.

<label class="step-done"><input type="checkbox"> I’ve chosen how I want to run the research.</label>

### 2. Ask your AI to set it up { #get-the-research-skill-ready }

<span id="install-and-setup"></span>

**As always, ask your AI to walk you through it.** Open your project in Claude Code or Codex and ask:

```text
Walk me through the research guide at claudeblattman.com. Help me install the two research skills and check that their connections work. Run the /deep-research setup after installing it, without starting a research request.
```

Both are in the [GitHub skills folder](https://github.com/chrisblattman/claudeblattman/tree/main/skills), separate from the starter kit. Have the agent install the whole folders, including their supporting files.

For **`/research-council`**, you can start with the AI you already use. To add others, ask it to follow the [connection walkthrough](council-models.md#connect-another-model) and use `/kit-setup`.

For **`/deep-research`**, setup happens in the installation conversation. The agent finds your signed-in browser, checks that it can select Deep Research and enter text, and saves the settings for next time. It gives you one checklist of anything you need to do. **These checks don’t submit a research request or use your allowance.** To check the setup again later, ask for `/deep-research setup`.

**After installation and setup, start a new session in your project.** Check that `/deep-research` refers to our browser workflow. If Claude only offers `/anthropic-skills:deep-research`, you’re seeing the other skill. Ask your agent to check that ours is installed and available.

<details class="council-details" markdown="1">
<summary>What might setup ask me to do?</summary>

Let the agent work out how to control the browser. In **Claude Code**, setup recommends Claude in Chrome. On a Mac, it can also control Safari or Chrome through Apple Events. It may ask you to change a browser setting or approve permissions so it can work without stopping at every step.

In **Codex**, setup tries its Chrome extension in the desktop app, then supported computer use, which can also work with Safari. You may need to connect the browser tools or sign in to ChatGPT and Gemini. If you prefer Safari for everyday browsing, you can keep it and use Chrome just for research.

You can also use Deep Research in the [Gemini app](https://support.google.com/gemini/answer/15719111?co=GENIE.Platform%3DiOS&hl=en), which is different from Antigravity. I find automating that route more trouble than it’s worth; browser controls work pretty well.

If browser control fails, ask the agent to diagnose it. It can help you run the research manually if necessary, but should tell you what prevented it from doing the job.

</details>

<label class="step-done"><input type="checkbox"> My two research skills are ready, and I’ve started a new session.</label>

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

Tell it what you are trying to decide, what you already know, and what worries you. I dictate this because I give much more context when I don’t have to type it all out. The agent turns the request into a brief for the researchers.

Like `/council`, both skills can use `/prompt` (bundled in the starter kit) behind the scenes when the question needs more preparation. You don’t need to run it separately. If you already have a research prompt, they use it as written unless you ask for changes.

For example:

```text
/research-council I’m interested in the easiest way to measure respondents’ networks because I’m worried about spillover effects in our study. Read the study design and draft questionnaire in this project.

I care about ease for the respondent: this is an online survey, and I don’t want extra questions to discourage people from finishing. I imagine most of the relevant connections will be within [the group or community we’re studying], but I’m not sure how much that assumption matters.

What approaches have other studies used? Compare how much effort they ask of respondents and what they let us learn about possible spillovers. Help me decide what’s worth including in our survey.
```

To use ChatGPT and Gemini’s Deep Research, start the same request with `/deep-research`. You can leave out either one:

```text
/deep-research [Insert the same dictated message about the question and context.] Skip Gemini for this run.
```

<details class="council-details" markdown="1">
<summary>Where do the chats and reports go?</summary>

The browser skill files its chats in a **Deep Research** project in ChatGPT and a **Deep Research** notebook in Gemini. It finds or creates them and tells you if filing is blocked.

Both skills save the question, individual reports and synthesis as local files in your working project. The browser skill preserves the original exports as well.

For Gemini, the agent exports the report to a Google Doc, downloads that document to your project folder, and checks that the complete report and its sources are there. Claude then moves the temporary Google Doc to Trash; Codex leaves it in Drive and tells you it can be deleted separately. This is cumbersome, but I find it to be the best way to automate exports from Gemini.

If a browser session or download is interrupted, ask the agent to resume the existing research. It should recover the same report rather than start the question over.

</details>

<label class="step-done"><input type="checkbox"> I’ve asked a research question that will help with my work.</label>

### 4. Read the answer and follow up { #read-the-synthesis-then-inspect-the-evidence }

When the reports come back, a fresh agent brings them together. You get an answer, the disagreements and gaps that matter, and links to the reports and sources. With one report, you get that report and a short summary. This is part of the skill; there’s no separate step to arrange.

I want the synthesis to explain why a finding deserves weight. It shouldn’t count votes or assume a Deep Research report is better. Three reports citing the same study are still drawing on one study.

Start with the synthesis, then ask about anything that would change your decision. For the network questions:

```text
Which of these approaches has actually been used in an online survey? What do we know about completion rates and how long the questions take? If we ask fewer questions, what would we lose in our ability to measure possible spillovers?
```

Follow up on the claims that matter for your decision, and open the sources when you need a closer look. If the answer is hard to follow, ask for an explanation. If it misses the point, tell it. The first report gives you something to work with.

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
