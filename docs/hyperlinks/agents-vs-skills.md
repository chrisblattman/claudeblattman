---
description: How skills and subagents work together, and how to give reviewers different perspectives on your work.
---

# Agents vs Skills

I want my AI to follow the routines I've worked out, and I want more than one attempt at the difficult parts. Skills help with the first. Subagents help with the second. My `/council` skill brings them together: it gives several workers an assignment, has them work independently, and brings their findings back to me.

When you work in Claude Code or Codex, the AI you're talking to is your main **agent**. A **subagent** is a separate worker it starts to take on part of the job. When I say I use agents, I sometimes mean giving my subagents specialized **personas**, with particular personalities and focuses. I explain one version of this on the [council page](../starter-kit/occasional.md#run-the-loop).

## How they fit together { #the-key-difference }

| | What it does | Example |
|---|---|---|
| **Your main agent** | Works through the task with you, asks questions, and uses your decisions. | Help me improve this research proposal. |
| **A skill** | Gives the agent a repeatable way to do a job. | `/council` organizes several independent attempts and a synthesis. |
| **A subagent** | Can work as a general helper or take a specific assignment and persona, then return its work to the main agent. | Read the proposal as an effective altruism (EA) donor and identify weaknesses in the research design. |

A skill can involve one agent or several. A subagent can also use skills. You don't have to choose one over the other. [Claude Code's skill guide](https://code.claude.com/docs/en/skills#run-skills-in-a-subagent) probably explains how they work together better than I can.

## When to use a skill { #when-to-use-a-skill }

A **skill** is a saved set of instructions, with supporting files such as templates or scripts when it needs them. Use one when:

- **You repeat the same workflow.** Save the steps so you don't have to explain them each time.
- **You have preferences you want it to remember.** `/setup-project-management` can follow your preferred folder structure when you start a project.
- **The job has several steps or decisions.** A skill can tell the agent what to do, what to ask you, and when to bring in subagents.
- **You want a consistent result.** `/done` gives the agent instructions for saving a handoff so you can pick up next time.

You can still talk through choices and adapt the skill to your work.

## When to use a subagent { #when-to-use-an-agent }

Use a separate worker when:

- **You want another pair of eyes.** Have it examine the research design in a proposal you've been writing with your main agent.
- **You want different perspectives.** Ask one reader to approach the proposal as a donor and another as a researcher who will have to carry out the study.
- **The work can happen in parallel.** Give separate workers different sources to investigate, then compare what they find.
- **You want to keep the main conversation focused.** A subagent can do the searching and reading, then bring back the relevant findings without every intermediate step.

Each worker uses more of your allowance because it's doing its own work. [OpenAI's subagent guide](https://learn.chatgpt.com/docs/agent-configuration/subagents) describes this tradeoff.

## How to give agents a persona { #agent-debates-multiple-perspectives-on-the-same-problem }

In my early days, I used to name specific economists or people whose work I respect. I'd simply name the person and ask the agent to take on their perspective: “Imagine [First Last] reviewing our study.” That was generally enough to get a useful discussion started. Claude already had the study plan and pilot results. The prompt gave it a name and a job.

These days, I generally ask for perspectives from different subfields or lines of inquiry, or give each agent a particular role. For example, in my [councils](../starter-kit/occasional.md#run-the-loop), I ask a **skeptic** to question the assumptions, a **pre-mortem reviewer** to consider how an approach could fail and how to prevent it, and a **completeness checker** to look for essential pieces we've missed.

Start by naming the personas you want each agent to take on. You can add more detail as you go:

1. **For most work, I just name the perspectives I want.** Give the agents the draft, data, or plan they're working on. For a modeling choice, I might ask:

    ```text
    Read our model and project notes in [folder]. Help me think through why firms enter a market from the perspectives of a political economist, an IO economist, and a development economist. Use blind subagents to do this in parallel.

    I want to know, from each perspective, which assumption they would change and whether that changes the model's prediction.
    ```

2. **If naming the personas isn't bringing sufficiently different perspectives, specify the questions you want each to answer.** For example:

    ```text
    Political economy: Who sets the rules? Who can change them?
    Industrial organization: How do existing firms respond to a new entrant?
    Development economics: How do access to credit and weak contract enforcement affect who can enter?
    ```

3. **If you want the agents to use a particular paper or method, provide that material.** Give them a file path, web link, or paper name, and ask them to read and draw on it. Naming a persona doesn't mean the agent has read the sources you have in mind.

## Use a council for blind, independent reviews { #launching-agents }

I use separate workers for these reviews, and I ask them to work **blind**: each gets the project material and its assignment, without seeing the other workers' answers or my main agent's preferred conclusion. That gives each one room to develop its own argument before we compare them. Otherwise, the first answer can steer the rest of the discussion.

My [`/council`](../starter-kit/occasional.md) skill organizes this for me. It sends out the assignments, collects the independent responses, and has a fresh worker bring the findings together. I want to see where they disagree, which assumptions explain that disagreement, and what we should investigate next.

To use that workflow with my own personas, I can ask:

```text
Use a council of one behavioral economist, one industrial organization economist, and one development economist to help me work through [question]. Use the project material in [folder].
```

Using the word “council” tells my agent to follow the structured workflow I've set out in the installed `/council` skill. I'm simply choosing these personas in place of the defaults.

## Save the instructions once they work { #agent-file-format }

If you keep asking for the same kind of review, have your agent save the personas for next time. I recommend keeping those instructions in a shared Dropbox folder, so you can use them on different computers and in different AI apps.

Ask your agent:

```text
Help me save the personas we just worked out so I can reuse them. Keep the questions each should ask and the kind of report I want. Each time I use them, I'll provide the project material they need.

Save them in my shared Dropbox folder at [location]. Set up this app to use those files, and tell me how to ask for these personas next time.
```

When you switch computers or AI apps, give the agent that folder and ask it to set up the same personas there. Claude and Codex each have their own place for saved agents, but your agent can handle that part. The instructions you edit and reuse can stay together in Dropbox.

*App instructions checked November 15, 2026.*
