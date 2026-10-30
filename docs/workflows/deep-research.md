---
description: Ask a useful research question, inspect the evidence, and put the findings to work in your project.
---

# Are you taking advantage of deep research?

[← Back to the master checklist](../starter-kit/two-month-plan.md#week-6-research-and-analysis)

I use `/deep-research` to search for information that will help my council do a better-informed job. It gathers and assesses evidence: what others have tried, what happened, and how well their experience applies to my situation. Those findings become research inputs for `/council` as it develops a proposal, compares approaches, or recommends what to do.

My research workflow uses the same habit of independent attempts: several agents investigate a shared question, then a fresh synthesis agent brings their findings together. I want an answer I can use, with sources I can inspect and a clear account of what remains uncertain.

You can start with research, or ask for it when a council or review exposes a gap. In the pilot proposal from the first two pages, the question might be whether changing how customer requests are assigned would actually reduce response times without adding staff. Research should help you decide what to try and what to measure.

<div class="checklist" markdown>

## Set up once

<span id="run-a-research-task"></span>
<span id="install-and-setup"></span>

### 1. Get the research skill ready { #get-the-research-skill-ready }

`/deep-research` is an additional skill. It does not ship with the starter kit. In Claude Code or Codex, open your project folder and ask:

```text
Check whether I have /deep-research installed. If I do, read its instructions and check that its supporting files and connections are available. If I do not, look for a compatible version in https://github.com/chrisblattman/claudeblattman and help me install it with its supporting files. Explain any missing dependencies before proceeding.

Tell me which agents can do the research and where the reports will be saved in this project.
```

Follow the installation and connection steps the agent gives you. If you need to connect Claude, Codex, or Gemini, use `/kit-setup` as on [page two](council-models.md#connect-another-model). A working connection is one part of setup. The research skill may also need its own supporting files or tools.

My current workflow includes the synthesis. If the version you installed requires a separate synthesis step, ask the agent to arrange that as part of the run so you receive a combined answer along with the individual reports.

Some apps also have a feature called **Deep Research**. You can use those reports too. Save the report in your project folder and tell your main agent where to find it. The app’s research feature and the `/deep-research` skill are separate tools, so ask which one your agent is using.

<label class="step-done"><input type="checkbox"> My research skill is ready, and I know where its reports will go.</label>

## Investigate something you need to know

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

### 2. Give it a question that matters to your work { #ask-a-bounded-question }

Tell the agent what you are trying to decide. You can dictate this in ordinary language, just as you would a council request. You do not need a polished research brief before you start.

The useful ingredients are:

- **The decision.** What will you do with the answer? In our example, choose what to change during a six-week pilot.
- **Your situation.** Point to the proposal, notes, and other relevant files. Explain the constraints, such as no additional staff.
- **The comparison.** Say what alternatives you are considering and whose experience would be relevant.
- **The result you need.** Ask for a recommendation, the evidence behind it, and the questions you will still need to answer yourself.

For example:

```text
/deep-research Help me decide what to test in a six-week pilot to reduce response times for existing customers without adding staff. Read the proposal and process description in this project folder.

Look for evidence on triage and changes to how requests are assigned in comparable teams. Compare the options, including implementation effort and effects on service quality. Distinguish measured results from vendor claims, and look for evidence against the approaches that initially seem promising.

Recommend what is worth trying in our setting. Link to the sources you inspected, explain where the evidence is weak, and identify what we should measure ourselves. Save the research brief, individual reports, and synthesis in this project folder.
```

Read the research brief before the agents get far into the work. Correct anything that changes the question you meant to ask. If it is heading toward a general report on customer service, bring it back to the decision: what should this team try, within these constraints?

<label class="step-done"><input type="checkbox"> I have asked a research question that will help me make a decision.</label>

### 3. Read the answer and follow up { #read-the-synthesis-then-inspect-the-evidence }

Start with the synthesis. It should give you the strongest findings, important disagreements, and remaining gaps, with links back to the sources and individual reports. You do not need to run another council simply to combine those reports.

I pay particular attention to a recommendation that depends on a setting very different from mine, or to a disagreement that would change what I do next. Ask the agent to explain those points. In the pilot example:

```text
You recommend triage. Show me the strongest evidence for that recommendation and the strongest evidence against it. Did the teams in those studies add staff or change anything else at the same time? Explain what we can reasonably borrow for our pilot and what remains an assumption.
```

Open the sources behind the claims that drive your decision. Check that they support what the report says. Several reports may repeat the same underlying study, so ask whether an apparent pattern comes from independent evidence or from several accounts of one result.

If a source is inaccessible, ask the agent to say what it could actually inspect. If an important question is still unanswered, give it a focused follow-up. Another broad search is not always the next useful step. You may need a document from your own team or a measurement from the pilot.

<label class="step-done"><input type="checkbox"> I have followed up on the important claims and inspected their sources.</label>

### 4. Use the findings to improve the work { #put-the-findings-to-work }

Bring the answer back to your project. If there is a substantial decision or revision to make, give the research to your council:

```text
/council Use the research synthesis and its cited evidence to revise the pilot proposal. Explain which recommendations change and why. Keep the no-extra-staff constraint. Turn the remaining assumptions into things we can measure during the pilot. Point me to the revised proposal.
```

Read the proposal, add your judgment, and ask for changes where needed. When it is ready, use `/adversarial-review` to examine it. Ask the reviewers to check that the recommendations follow from the research and still answer the original request.

For a straightforward finding, you can simply ask your main agent to apply it. Research does not commit you to another full round of council and review. The point is to improve the work you came to do.

Keep the brief, individual reports, and synthesis with that project. When you finish, use `/done` and ask it to record what the research changed, the questions still open, and the paths to those files. The next session should be able to pick up the work without repeating the search.

<label class="step-done"><input type="checkbox"> I have used the findings, checked the revised work, and saved a handoff.</label>

</div>
