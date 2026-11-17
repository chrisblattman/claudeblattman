---
description: "Explore a large dataset with an explicit build, run, review, and refine process, developed through the CDMX work and formalized as /vibecode."
---

# Explore a large dataset with an agent

You have a new, large dataset you want to explore. You might have some priors, but you know very little about what is actually in it. Which variables are useful? Which patterns are surprising? What can the data tell you, and what would require a different source or a new study?

That was our starting point with administrative records from Mexico City's labor-conciliation system. We wanted to understand who entered the system, what happened to their cases, and where to investigate further. We developed a specific set of instructions for Claude to carry out that exploration: write and run the code, make the figures, assemble a report, inspect its own output, and improve it before moving on.

Those instructions became a custom skill called `/vibecode`. The first CDMX exploratory run was on July 27, 2026. We reused the approach for further CDMX work on July 28–29, then built and tested the skill on July 30. This walkthrough follows that development. The prompt blocks below adapt the saved instructions for reuse.

## Step 1. De-identify the data before giving it to your agent

Prepare an analysis copy in your project's approved environment before making it accessible to the agent. Keep the identifiable originals separate. In CDMX, a de-identification pipeline already existed when this exploration began; the analysis used its de-identified files.

Start with direct identifiers: names, contact details, government identifiers, and identifiable case numbers. Where you need to link records across files, use consistent research IDs and keep the mapping back to identities separately, outside the agent's access. Check free-text fields for names and other identifying details too.

Removing names is only part of the job. Exact dates, detailed locations, and unusual combinations of characteristics can still identify someone. Decide which fields to remove or make less precise under the project's data rules. De-identification reduces risk; it does not guarantee anonymity or establish permission to use an AI service. [NIST's guide](https://csrc.nist.gov/pubs/sp/800/188/final) explains the distinction between direct identifiers and combinations of attributes that can enable identification.

If you want help writing the preparation code, give the agent a schema and invented example rows. Run and review that code in the approved environment before exposing the resulting analysis files. Include exported logs and labels in the review, since identifiers can appear outside the data columns.

The files still need to join correctly afterward. For the CDMX analysis, the important relationships were workers within requests, hearings associated with cases, and payment records. Replacing identifiers inconsistently across files would break those relationships.

Before proceeding, establish which prepared files the agent may access and which tools may process them. A local file can still appear in a tool response sent to a model. Restrict the agent's accessible workspace accordingly; an instruction to ignore a nearby identifiable file is not an access control.

## Step 2. Explain the project and what you want to learn

Give the agent the project description, codebook, relevant earlier analyses, and notes explaining how the data were generated. For CDMX, the orientation plan included the conceptual framework, earlier research priorities, a field-visit transcript, and the repository's project map.

The field context mattered. Reaching a stage that permits a worker to go to court does not establish that they filed a lawsuit. A settlement status and a payment record describe different events. The agent needed those distinctions to interpret its own tables.

```text
We have a new administrative dataset to explore. Read the project overview,
codebook, earlier analysis priorities, and field notes on how the process works.
Use only the approved de-identified files in [analysis location].

Our initial questions are:
- Who enters the system, and how does that change over time?
- What happens to their cases?
- How do outcomes and the process differ across groups?

These are starting questions. Suggest other useful descriptive comparisons
as you learn about the data. Distinguish our priors from what the data show.
Explain what the files cannot establish.

Inspect the existing code and folder structure. Use the project's conventions
and tools, and keep raw inputs unchanged.
```

We used Stata for construction and tables, R for figures, and LaTeX for a PDF report. Use the tools your team can run and review. The agent needs a way to execute the code and inspect the resulting report, as well as write it.

## Step 3. Set the scope of exploration

One of the most useful instructions we developed separated three choices that an agent can easily conflate:

| Dimension | Instruction |
| --- | --- |
| Breadth of exploration | Be expansive. Try useful cuts of the data, investigate surprises, and propose additional descriptive sections. |
| Statistical complexity | Keep it simple. Start with counts, distributions, cross-tabs, and straightforward comparisons. |
| Figure design | Put effort into making the comparison legible. Try ambitious designs where they help, and keep a conventional alternative. |

We wanted more exploration without automatically getting more elaborate models. During the follow-on CDMX work, we explicitly asked Claude to tone down the statistical machinery and write out possible next steps instead. That became a rule in `/vibecode`: describe the progression to more sophisticated analysis, but leave the decision to take that next step to the researcher.

```text
Be generous with exploration and restrained with statistical complexity.
Two-way tables, distributions, and simple comparisons are good first results.
Use the simplest analysis that answers each question, with readable code.

If a promising descriptive thread deserves its own section, follow it and
record why you added it. Put more sophisticated models in a next-steps list;
do not start fitting them just because you can.

Take care with figures. Try an ambitious design when it communicates the
comparison well. Keep a clean conventional version alongside it so we can
compare them. Every exhibit should answer a stated question.
```

Then agree on a small set of report modules. Our initial plan had three:

| Module | Initial questions |
| --- | --- |
| Population | Who files, when, and with what case characteristics and stakes? |
| Outcomes | What outcomes are recorded? How do settlements compare with recorded entitlements? What do payment records show? |
| Process differences | How do attendance, timing, and conciliator patterns relate to outcomes? |

The run added a fourth section on representation and the road toward court. That was the kind of expansion the brief invited. It still had to distinguish descriptive associations from causal explanations.

We also made a practical sequencing decision. The first proposal involved extensive profiling and a full shared data scaffold. We deferred that and started with the population section, checking the actual files as it was built. Shared construction came later, once the repeated work was visible.

## Step 4. Turn the plan into execution instructions

A plan lists the work. The execution instructions tell the agent how to carry it through, how to judge its output, and when to stop.

We wrote those instructions explicitly for the CDMX runs. The unit of work was a report module: analysis code, figures, and a readable section of the same growing report. Here is an adapted version of that assignment:

```text
Execute the agreed exploration plan section by section. Start with Population.
For each section:

1. BUILD. Write the code against the approved data. Inspect actual values,
   category levels, distributions, and missingness as you work. Verify keys
   before merging and explain changes in the number of observations.
2. RUN. Execute the code. Fix errors and capture the actual sample counts.
3. FIGURE. Generate the figures, including conventional alternatives for
   designs that take a risk.
4. ASSEMBLE. Add tables, figures, and short interpretations to the report.
   Compile it to PDF.
5. REVIEW. Open the compiled PDF and inspect every page against the review
   rubric. Write a specific list of problems.
6. REFINE. Fix the whole list, rerun the affected steps, and inspect again.
   Allow up to three refinement rounds per section.
7. CHECKPOINT. Save a digest of what you produced, the sample counts,
   surprises, changes beyond the plan, and unresolved questions. Show the
   section, then proceed to the next one.

Run the whole sequence without stopping for approval of routine fixes.
Stop for a decision that materially changes the analysis, data that contradict
an essential assumption, the same error after two attempted repairs, or the
refinement limit. Explain the blocker and preserve the work completed.

Keep inputs unchanged. Never invent a result. Record bugs, their causes,
the fixes, and whether they changed a finding.
```

The instruction to inspect actual data was consequential. In CDMX, a worker–request was different from a request: several workers could belong to the same request. A monthly count needed that distinction settled before it could be interpreted. Other checks exposed missing linking IDs, questionable industry coding, and gaps between settlement statuses and payment records.

Those discoveries belonged in the report and the log. They also gave the researcher a concrete list of questions to take back to the data team.

## Step 5. Give self-review a rubric

“Check your work” is too open-ended. We specified what the agent should look for:

- **Numbers and samples:** actual observation counts, missing values, explained exclusions, and reconciled merges.
- **Meaning:** a clear question for every exhibit, a stated population, and a title that matches what the result shows.
- **Interpretation:** short explanations that preserve uncertainty and distinguish association from causation.
- **Rendering:** readable labels, tables within the margins, visible rows, working references, and figures that communicate at the intended size.
- **Consistency:** when an analysis changes, update the numbers, captions, and earlier prose that refer to it.

The first descriptive run needed repairs to a population pyramid's orientation, a ridgeline display, table specifications, missing medians, category groupings, and labels. The report grew from five pages after Population to ten after Outcomes, thirteen after Process differences, and sixteen with the final sections.

The later `/vibecode` test provided an especially clear reason to inspect the PDF. An unescaped percent sign in a label caused LaTeX to treat part of a table as a comment. The document compiled without errors, but rows merged and results disappeared from view. Visual review caught the problem.

We also clarified what counts as one refinement round: **review the output, fix the entire identified problem list, then render again.** The original CDMX modules each recorded one round containing several fixes. The later test spent rounds on individual figure adjustments, leaving less room for other problems. The skill made the batching instruction explicit and prioritized wrong or missing results before cosmetic changes.

For a longer run, save the rubric in a file beside the execution instructions. This became part of `/vibecode` after we noticed that a fresh context could otherwise reach the review step without the criteria it was supposed to apply.

## Step 6. Keep the work reproducible and inspectable

Autonomy makes a record of decisions more useful. The CDMX work recorded completed sections, surprises, and bugs. The skill formalized four records:

| Record | What it lets you inspect |
| --- | --- |
| Progress log | What each phase produced, what changed, and what remains open |
| Bug log | Symptom, cause, fix, and whether the fix changed a result |
| Sample-count ledger | Expected and actual observations, with explanations for differences |
| Run ledger | Which analyses ran and the settings or versions needed to distinguish them |

The skill also added a baseline census before construction: row counts, unique keys, group sizes, and nonmissing values for the planned exhibits. This was a development from the initial run, where we had checked the data while building the first section. The baseline gave later checks an explicit reference rather than relying on whatever count the latest script happened to produce.

File management needed its own instructions. The first report accumulated thirteen CSV extracts between Stata and R. We replaced them with two reusable analysis datasets, kept in the approved data location, and calculated one-use chart summaries inside the plotting script. The cleanup rebuilt the report and compared its values with the preceding version.

That experience supplied several durable rules:

```text
Inspect this repository's layout and follow its conventions.
Keep the original variables unchanged; give transformed versions new names.
Make every data change in code so it can be reproduced.
Save datasets that later work will reuse. Calculate one-use figure summaries
inside the plotting code rather than leaving a separate file for each chart.
Clean up your own temporary outputs, including files created implicitly by
the software. Leave pre-existing files alone.

After reorganizing the pipeline, rebuild the outputs and compare the values
and sample counts with the previous version. Explain every difference.
```

The final deliverable is the report plus the code and records needed to inspect it. The researcher still reviews the substantive choices and decides which findings deserve follow-up.

## Step 7. Turn the repeated instructions into a skill

By July 30, we had used the approach for the exploratory report and a second CDMX analysis. Both involved writing an execution prompt from an agreed plan, launching the work, and keeping it moving through repeated build-and-review cycles. We created `/vibecode` to handle those recurring steps.

The saved development notes explicitly say the skill absorbed the “write yourself a prompt to enact this plan” step we had typed by hand twice. Its sequence was:

1. Inspect the repository and count the relevant input populations.
2. State the deliverable, filenames, output locations, and scope of permitted exploration.
3. Generate a task-specific execution prompt and review rubric from the approved plan.
4. Run the build, review, and refinement loop, with progress records and defined stopping conditions.
5. Reconcile sample counts, arrange the specified code review, and hand back the deliverable and remaining questions.

The skill preserved the distinction between expansive descriptive exploration and tightly specified prediction work. For prediction, the approved features, evaluation sample, and model scope had to be fixed in advance; permission to iterate on code did not authorize repeatedly changing the model in response to held-out results.

We tested the new skill on a remaining CDMX question about employer- versus worker-filed cases. That test produced a five-page report, exercised the sample-count checks, and prompted further revisions. It ran inline; the skill's `/loop` launch mechanism and separate council-review step were still untested at that point.

`/vibecode` was a custom skill developed in this project; it is not included in this site's starter kit. You can use the execution instructions above directly. Once you have a version that works for your own project, ask your agent to save the repeated procedure, review criteria, and stopping conditions as a skill. Keep the dataset-specific questions in the project plan so the procedure can be reused.

For more on the figure-development part of the process, see [develop a research figure](develop-research-figures.md).
