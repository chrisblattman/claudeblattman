---
name: council
description: Develop independent approaches to a task, decision, plan, or draft, then use a fresh worker to synthesize them. Use for an explicit council request, including dictated counsel. Reviewing existing work routes to adversarial-review.
---

# Council

Develop useful alternatives against the user's actual objective. A draft is optional. If the request is specifically to critique existing work, invoke the neighboring `adversarial-review` workflow once; do not run both workflows automatically. Discussing councils does not invoke one.

Read `references/host.md` and `references/panel-workflow.md`. Follow that complete execution contract. The shared `scripts/council.py` defaults to this development workflow. With no saved preference or explicit override, use three fresh local workers: **skeptic, pre-mortem, completeness checker**, then a fresh synthesis worker. Chief of Staff is an optional fourth development member only on request. All four persona definitions are bundled.

Use the persona's development guidance: propose an answer or approach, alternatives, tradeoffs, evidence, and a next step. Do not turn development into four copies of a critique. Members work independently; the host is not a panel member or the synthesizer. Preserve the user's voice and constraints in any resulting draft.

Saved provider preferences apply only when the user has asked to change their default. Exact provider/count requests override saved defaults. Do not infer a request to use paid services from the subject's importance. A later review of the revised result uses `adversarial-review` with a new archive and fresh reviewers.
