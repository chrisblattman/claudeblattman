# Claude external-call mechanics

This is the existing starter transport, not Chris's audited balanced runner. The shared Ask Agents skill owns task, authorization, and output behavior.

Scripts are inside this Ask Agents skill's `scripts/` directory. Use `codex-run.sh --which` to discover Codex. Check `~/.claude/starter-kit/engines.json` for the requested service's `available: true`; if absent, use Kit Setup. During the setup smoke test itself, call the detected wrapper before marking it available.

Create a unique private temporary directory, write the full request into `prompt.txt` using a file tool, and invoke in the foreground from the intended working folder:

```text
bash <skill-directory>/scripts/codex-run.sh <private-dir>/reply.txt < <private-dir>/prompt.txt
bash <skill-directory>/scripts/gemini-run.sh <private-dir>/reply.txt < <private-dir>/prompt.txt
```

Use only the requested service. These wrappers may have limits, model fallbacks, and access restrictions; report observable outcomes and never label them as an audited balanced Council route. Do not bypass them with raw provider commands. Save the reply and error/status evidence before cleanup. The caller's input/output paths must be safely shell-quoted. A failed wrapper is an external-call failure, not an invitation to impersonate that provider.
