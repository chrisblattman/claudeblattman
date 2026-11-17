---
description: Choose between a research council and browser Deep Research, let your agent run the search, and put the findings to work.
---

# Are you taking advantage of AI-driven research?

[← Back to the next-steps checklist](../starter-kit/two-month-plan.md#research-a-question)

Before I decide what to do, I often need to know what other people have tried. What worked? What didn’t? How much applies to my problem? I ask AI to investigate, then bring the findings to a council to help work out what to do with them.

There are two ways I do this. **`/research-council` is a council with a specific job: search the web, read original sources, and compare the evidence. `/deep-research` asks ChatGPT and Gemini’s dedicated Deep Research tools to produce reports.** In either case, I make the request from my project and the agent brings the findings back there. You can choose one route; you don’t need to run both.

<div class="checklist" markdown>

## Choose your research tools

### 1. Choose how to investigate { #choose-your-research-skill }

<div class="council-kit-summary" markdown>

| Skill | When to use it |
| --- | --- |
| [Multi-agent research: `/research-council`](#multi-agent-research) | Ask your connected AIs to investigate independently, read original sources, and compare what they find. |
| [Browser Deep Research: `/deep-research`](#browser-deep-research) | Commission reports from ChatGPT and Gemini’s Deep Research tools. Your agent runs them in the browser and brings the reports back to your project. |

</div>

**Which would I use?** I usually find browser Deep Research more thorough. I use Research Council for a narrower question, or when I want to save my limited Deep Research requests for a bigger investigation. Research Council still uses the allowances of the AIs doing the work.

#### Multi-agent research { #multi-agent-research }

The researchers look for evidence that challenges the answer as well as supports it. A fresh agent brings their reports together. Your working council can then use that evidence to develop a proposal or plan.

**`/research-council` uses the AIs you have connected:** one fresh researcher from each available Claude, Codex and Gemini. If you’ve [set up multiple AIs](council-models.md#connect-another-model) for `/council` or `/ask-agents`, it uses those same connections.

Grok joins when you ask for it. I find it especially useful for searching X/Twitter, where people discuss new tools and approaches long before there is much written elsewhere. These very AI workflows are a good example.

#### Browser Deep Research { #browser-deep-research }

**`/deep-research` uses ChatGPT and Gemini by default.** You can ask for just one. The agent operates their Deep Research tools in your browser, so you need access to those products. A Codex or Antigravity connection alone doesn’t provide it.

Not every question needs Deep Research. Requests in both [ChatGPT](https://help.openai.com/en/articles/10500283-deep-research-in-chatgpt) and [Gemini](https://support.google.com/gemini/answer/15719111) are limited. I’ve kept the skills separate because I don’t want to use that allowance every time I ask for a web search.

As of November 2026, OpenAI has [announced a shared, token-based usage allowance for ChatGPT and Codex starting in December](https://help.openai.com/en/articles/20001625-understanding-chatgpt-and-codex-usage-limits). That is a change to the overall allowance, not an announced price per Deep Research report. Check your account’s usage limits when choosing how much research to run.

<details class="council-details" markdown="1">
<summary>Be careful: Claude offers another skill with the same name</summary>

My Claude setup also has `/anthropic-skills:deep-research`. That skill sends Claude subagents to investigate different parts of a question. It doesn't run ChatGPT or Gemini’s browser tools. If you ask for our `/deep-research` skill, make clear that you mean the browser workflow from this site.

</details>

<label class="step-done"><input type="checkbox"> I’ve chosen how I want to run the research.</label>

### 2. Ask your AI to set it up { #get-the-research-skill-ready }

<span id="install-and-setup"></span>

Open a session in your project and ask your agent to install the skill you've chosen. Both are in the [GitHub skills folder](https://github.com/chrisblattman/claudeblattman/tree/main/skills), separate from the starter kit.

**For multi-agent research:**

```text
Find and install the research-council skill from the chrisblattman/claudeblattman GitHub repository. Install the entire folder, including its supporting files and SKILL.md, where I keep my other skills. If I already have it, preserve my customizations.

Check which AIs I already have connected and help me set up any others I want to use. Don't start the research yet.
```

You can start with the AI you already use. If you already run a council with multiple AIs, this skill uses those same connections. Otherwise, the [connection walkthrough](council-models.md#connect-another-model) explains how to add them.

**For browser Deep Research:**

```text
Find and install the deep-research skill from the chrisblattman/claudeblattman GitHub repository. I mean the browser workflow that uses ChatGPT and Gemini's Deep Research tools. Install the entire folder, including its supporting files and SKILL.md, where I keep my other skills. If I already have it, preserve my customizations.

Run /deep-research setup. Help me connect your Chrome extension and sign in to the research tools I want to use. Check that you can open Deep Research and enter a prompt, without submitting a research request.
```

The agent walks you through connecting the Chrome extension and signing in to ChatGPT and Gemini. You can keep your usual browser for everyday work and use Chrome for this. Setup saves what it needs for the next run; the checks don't submit research or use your allowance.

After installing either skill, start a new session in your project so it is available there. To recheck the browser setup later, ask for `/deep-research setup`.

<label class="step-done"><input type="checkbox"> The research skill I've chosen is ready, and I’ve started a new session.</label>

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

Both skills save the question, individual reports and combined findings in your working project. The browser skill keeps the original exports too. Ask the agent to show you where it saved them.

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

Use the findings to make the decision that prompted the research. They might change your project description, strengthen a proposal, or help you choose what to test next. For the survey example, I’d ask a [council](../starter-kit/occasional.md) to turn the evidence into a draft:

```text
/council Use the research to propose network questions for our online survey. Keep the burden on respondents low, and explain what we can and can’t learn about spillovers with your proposed questions. What should we test before adding them to the survey?
```

Add your judgment, revise, and use `/adversarial-review` when you want a fresh examination of the result. For a smaller change, just ask your main agent to apply what you learned.

When you finish, use `/done` to save where you got to, what the research changed, and what remains open. The reports stay with the project so you can return to them in the next session.

<label class="step-done"><input type="checkbox"> I’ve used the research to move my work forward.</label>

</div>
