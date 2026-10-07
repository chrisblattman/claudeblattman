# AI Integration: Cross-Vendor Critics and Peer Tools

A council of five Claudes still shares one model's blind spots. The fix is to swap one seat for Codex or Gemini — same prompt, different vendor, dispatched in the same parallel call. I have caught failures this way that no all-Claude panel surfaced, mostly around empirical claims Claude wanted to believe.

This page covers the integration: which CLIs to install, how `/council --mixed` swaps a Claude critic for a peer-vendor critic, what to do for tools without a CLI (Grok, ChatGPT Deep Research, Perplexity), and the failure modes I've actually hit.

---

## Why mix vendors

One model has consistent biases. Five instances of the same model share those biases. The council pattern protects against single-critic blind spots within Claude's distribution — not against the distribution itself.

Mixing vendors is cheap insurance. The peer doesn't need to be smarter; it needs to be *different*. Codex tends to be sharper on empirical and engineering claims that a confident-sounding Claude may wave through. Gemini's long-context window and search-grounding catch coverage gaps in literature reviews. Neither replaces Claude on this stack — both add a lens Claude alone doesn't bring.

---

## A worked example — deep research synthesis

The use I reach for most is multi-source research synthesis, and it's the loop `/dr-synthesize` runs councils on. Say I'm pulling together evidence on what works to reduce homicide in low-trust urban settings — two reviews, eight RCTs, six quasi-experimental papers, a few policy briefs. Thirty sources. [`/deep-research`](../workflows/deep-research.md) produced the raw reports (Claude WebSearch + Codex + Gemini CLI in parallel); [`/dr-synthesize`](../setup/skill-reference.md#dr-synthesize-deep-research-synthesis) combined them into one draft. Before I trust the draft enough to send to a co-author or use in a grant, I run a council on it.

Panel: harsh-referee, methodologist, academic-editor — three Claude critics on a four-seat council, with the fourth seat swapped for **Gemini** (long-context, reads the whole source bundle in one pass).

The three Claude critics give me what they always give me on a literature review: tighter argument structure, sharper claim language, a couple of methodology weaknesses they all converge on. Useful, but not surprising.

The Gemini seat, reading the entire bundle as one corpus, surfaces three things the Claude critics didn't:

1. Three of the cited hot-spots papers turn out to be follow-ups on a single Bogotá experiment — the "consistent evidence" is less independent than my synthesis implied.
2. A 2024 replication failure on a São Paulo trial is in my source pile but isn't in any Claude critic's response — they all missed it.
3. The framing privileges one identification strategy when two recent papers used a different approach on similar data and reached different conclusions.

Each of those would have been embarrassing in the final brief.

That's the value. Not that Gemini is smarter on policing. That a different model, reading the same pile, notices a different thing.

!!! tip "Illustrative, not a transcript"
    The findings above are drawn from the kinds of failure modes mixed-vendor councils surface in real runs — not a single specific transcript. Use it as a pattern, not as a citation.

## Skill review — the other place I reach for this

The other place is reviewing a draft skill, agent, or workflow before it ships. The chef-skill mode panel (skill engineer + UX-for-tools + non-expert adoption) is where I run most of these. Swap one seat for Codex when there's real code in the picture and Codex catches the engineering stuff Claude waves through — race conditions in shell pipelines, permission-prompt triggers from `&&` chains, error paths that read fine but never fire.

---

## The deep research → synthesis → council chain

Three skills, one workflow. Each does one thing.

1. **[`/deep-research`](../workflows/deep-research.md) `<topic>`** — dispatches Claude WebSearch, Codex CLI, and Gemini 2.5 Pro CLI in parallel on the same prompt. Three raw reports land in the project folder, indexed in `research-archive/INDEX.md` for cross-project lookup. ChatGPT Deep Research, Grok, Perplexity, and Gemini's browser Deep Research are available as opt-in paste-loop arms (`--tool chatgpt`, etc.) — never volunteered as bonus arms.

2. **`/dr-synthesize <report-paths...>`** — combines 2+ raw reports into a single synthesis with a mandatory `## Source Reports` block preserving absolute paths to the originals. Surfaces agreements, contradictions, gaps, and per-source unique insights. Synthesis is always a new file; raw inputs are never edited.

3. **`/council file:<synthesis-path> --mixed gemini`** — runs the cross-vendor critic pattern this page is about, on the synthesis output, before I trust it.

The chain is: discover sources → run `/deep-research` → run `/dr-synthesize` → run `/council` on the synthesis. Each step writes to disk, so you can stop, inspect, and resume. I rarely run all three in one sitting.

Install pointers: [`/deep-research`](../setup/skill-reference.md#deep-research-multi-vendor-research) and [`/dr-synthesize`](../setup/skill-reference.md#dr-synthesize-deep-research-synthesis) in the skill catalog. The full deep-research workflow lives on its own [page](../workflows/deep-research.md).

---

## Setup: Codex CLI

The Codex CLI ships with the Codex desktop app on macOS. Install path:

```
/Applications/Codex.app/Contents/Resources/codex
```

Sanity check:

```bash
codex --version
codex "summarize this in one sentence: continuous integration"
```

The first call may prompt for sign-in. Once it returns a sentence, you're set. The `/codex` one-shot skill in Claude Code wraps this for ad-hoc use; `/council --mixed codex` uses it for council seats.

---

## Setup: Gemini CLI

Install via npm:

```bash
npm install -g @google/gemini-cli
```

Authenticate (OAuth, browser flow):

```bash
gemini auth
```

**Pin the Pro model.** The OAuth default is the lighter Flash-Lite model, which is not the same critic. Always run with `-m gemini-2.5-pro` or set it as a default in your shell config:

```bash
gemini -m gemini-2.5-pro -p "summarize this in one sentence: continuous integration"
```

The `/gemini` one-shot skill pins the Pro model automatically. So does `/council --mixed gemini`.

---

## Use them as council critics

```
/council --mixed codex <topic>
/council --mixed gemini <topic>
```

This swaps one Claude critic for a peer-vendor critic, keeping the parallel-dispatch + separate-synthesis structure. Auto-mapping picks the swap target based on which lens the peer is best at:

| Peer | Best swap target | Why |
|---|---|---|
| Codex | skeptic, pre-mortem, harsh-referee | Empirical rigor, failure-mode hunting |
| Gemini | completeness-checker, domain-expert, academic-editor | Long-context synthesis, broad coverage |

The swapped seat dispatches as a Bash call to the peer CLI in parallel with the remaining Claude Task calls. The peer's output lands in `/tmp/council-peer-<run-id>.md` and gets read alongside the Claude critic outputs in the synthesis pass.

**Direction matters.** Claude → peer only. Do not swap so the peer is the senior critic and Claude is the junior — that's asymmetric dismissal, where the synthesis treats the peer as authoritative without earning it.

If the peer binary is missing, the council prints one line ("Gemini CLI not installed; falling back to all-Claude council") and continues. Graceful degradation, not abort.

---

## Use them as one-shot helpers

When you don't need a council — just a single second opinion — the `/codex` and `/gemini` skills run a one-shot query against the peer:

```
/codex Review this regression spec and flag the biggest risk you see.
/gemini Skim this 50K-token literature dump and tell me what's missing.
```

Use `/codex` when you want an empirical-engineering second eye on a coding or methods question. Use `/gemini` when you want long-context synthesis or a different search-grounded perspective.

These are not council substitutes. One peer is one critic — same blind spot risk as one Claude. Reach for `/council --mixed` when the stakes warrant the parallel structure.

---

## Manual paste-loop for what isn't CLI'd yet

Two tools I use that do not have stable CLIs I trust for council dispatch:

| Tool | When | How to fold in |
|---|---|---|
| **Grok DeepSearch** | Discovering new tips and accounts (see [/tips-scout](continuous-improvement.md)) | Generate prompt locally, paste into grok.com, forward results to self-email |
| **Perplexity** | Citation-anchored fact lookups | Paste the question, copy answer with citations |

For these, the integration is procedural: paste in, paste out, file the result. They don't ride in the council parallel-dispatch — but their outputs can be quoted into a Claude critic's prompt the next time around.

ChatGPT Deep Research used to live in this table. It's now an opt-in paste-loop arm inside [`/deep-research`](../workflows/deep-research.md) (`--tool chatgpt`) — the skill emits the prompt, you paste it into ChatGPT, and `/deep-research --absorb` ingests the report back into the project folder with canonical frontmatter. Same paste-loop mechanics, but the skill handles archiving and indexing instead of you.

---

## Failure modes

What goes wrong, in order of likelihood:

- **Asymmetric dismissal.** A non-Claude critic is louder, more confident, or longer than the Claude critics. The synthesis pass over-weights it as "the outsider's view." Mitigation: keep the swap to one seat. Do not stack two peers; do not let the peer write the synthesis.
- **Vendor outage.** A peer CLI hangs or returns an error. The council degrades gracefully — falls back to all-Claude with a one-line note. Don't notice for a week, find out the peer hasn't been firing all month.
- **Auth expiry.** Codex or Gemini auth tokens go stale. The CLI returns an error that looks like a regular failure. Re-auth and re-run.
- **Model drift.** Gemini OAuth defaults to Flash-Lite if you don't pin Pro. The Pro model is the one I rely on for critique. Always pass `-m gemini-2.5-pro` or set it as default — never trust the OAuth default to be what you want.
- **Rate-limit surprises.** Bursts of council runs in a tight window can hit per-vendor rate limits. The council prints a one-line advisory before parallel dispatch but cannot enforce a real limit from inside Claude Code.

---

## See also

- **[`/council`](../workflows/council.md)** — the council pattern this page extends.
- **[Continuous Improvement](continuous-improvement.md)** — the tips pipeline uses Grok via the manual paste-loop and `/tips-integrate` uses an all-Claude five-persona council. Useful contrast.
- **[Prompt, plan, review, revise](../workflows/first-session-skills.md)** — where one-shot `/codex` and `/gemini` sit in the broader loop.

<label class="page-done"><input type="checkbox"> I called in a second opinion!</label>
