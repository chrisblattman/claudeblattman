# Claude connection configuration

Kit Setup writes `~/.claude/starter-kit/engines.json`; Ask Agents reads it. Preserve unknown fields and existing declines when updating.

```json
{
  "schema_version": 1,
  "codex": {"available": true},
  "gemini": {"available": false},
  "updated": "YYYY-MM-DD"
}
```

`available: true` requires executable discovery, authorization, and a successful test returning the expected answer. Discovery or sign-in alone is insufficient. If a service was declined, preserve `user_declined: true`; do not silently enable it. Missing or unparseable configuration is an untested optional connection, not evidence that the external service ran.

Executable discovery and wrapper paths are specified in this skill's `transport.md`. The wrappers live inside this Ask Agents skill's `scripts/` directory. The common Ask Agents instructions govern privacy, authorization, failures, and reporting. Kit Setup is the only writer. These connection flags do not certify the separate audited balanced Council runtime.
