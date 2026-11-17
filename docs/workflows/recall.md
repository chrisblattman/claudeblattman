---
description: Find past decisions, useful answers, and unfinished work in the AI conversations saved on your computer.
---

# Find past work with `/recall`

I kept solving the same problem twice. First because I'd forgotten I'd solved it, second because I couldn't find the session where I did. `/recall` fixed that.

[Recall](https://github.com/arjunkmrm/recall) searches past Claude Code and Codex conversations saved on your computer. You can use it to recover a decision, find a useful answer, or pick up work from an earlier session. It was created by [arjunkmrm](https://github.com/arjunkmrm); I didn't build it.

## 1. Install the skill { #install }

Ask your agent:

```text
Find and install Recall from https://github.com/arjunkmrm/recall. Follow its setup instructions and include the supporting files it needs. Put it where I keep my other skills, then check that it can find my past conversations.
```

The first search builds a searchable record of your past conversations. If the skill doesn't appear after installation, start a new session.

## 2. Ask for something you remember working on

You don't need to remember the exact words or which session you used. Give the agent the project name, an approximate date, or a phrase you remember. For example:

```text
Use Recall to find the conversation where we decided which outcomes to measure in [project]. Read the relevant discussion and tell me what we agreed, why, and what we left unresolved.
```

You can also ask it to find a draft you liked, an approach you tried in another project, or an explanation you want to read again. If the first search misses it, give the agent another clue or ask it to try different terms.

## 3. Bring the useful work into your project

Once you've found the conversation, ask the agent to compare it with what you're working on now:

```text
Compare what you found with our current project notes. Show me any decisions or useful context we're missing, and flag anything that conflicts with what [Person] and I decided in our meeting this morning.
```

Give it the meeting transcript or notes so it has that discussion to compare against. Once you've worked through any differences, have it save the decisions you want to keep in the project's documents.

## 4. Know what it can find

Recall searches conversation files available on the computer running it. If you did the work on another device, you may need to search there. It can't recover a conversation file that is no longer available.

If you've moved your conversation files and searches seem incomplete, ask the agent to refresh Recall's search index and check which files it can see.

Keep important decisions in your project documents even when you use Recall. Finding the old discussion is useful; having the agreed decision ready for the next session is better. [Clean up an existing project](clean-up-project.md) shows how to bring that scattered work together.
