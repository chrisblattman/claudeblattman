# Integration state and safe writes

Use `integrate-state.json` in the configured shared tips folder. Support existing schema-v1/v2 files: preserve `integrated_items`, `deferred_items`, unknown fields and legacy `last_council_run`/`pending_council_batch`. Add absent arrays on the next authorized save. Do not overwrite unreadable JSON.

```json
{
  "schema_version": 2,
  "last_run": null,
  "last_council_run": null,
  "pending_council_batch": null,
  "pending_items": [],
  "integrated_items": [],
  "deferred_items": []
}
```

Record stable `item_key`, source, route and disposition for each item. Successful direct changes include `type: direct`, target, date_integrated, change_summary, validation and reversal path. Queued investigations use `type: investigation`, catalog path and date_integrated for legacy compatibility; the report must call them queued, not implemented. Deferrals include date_deferred and reason; rejected and watch states remain explicit. Keep pending items and partial/failed attempts with the blocker and already-completed steps.

`last_run` records the run, not an all-items-completed watermark. Filter with item keys as well as dates; pending items remain eligible regardless of age. Curate's High-tip backlog excludes integrated/queued/deferred keys, including those with legacy-derived keys.

Before writing any shared file, honor existing locks and sync-conflict files. Reread and merge intervening changes; use an atomic replacement or a locked safe append, and verify the result. Do not claim that an atomic rename alone prevents a stale overwrite. Preserve unknown state fields. No source state, council output, catalog entry, backup or target change may be written in dryrun.

Order updates so retries are safe: save the result/task/report first, verify it, then record its disposition. Include the stable key in catalog entries and change records. If bookkeeping fails after an edit, report the partial outcome and locate the existing change/task by key before retrying; do not apply it twice.

`compact` is explicit housekeeping, not routine deletion. Archive old verbose summaries only when their disposition, source, target and reversal information remain retrievable. Keep rejection and duplicate history so old tips are not resurrected. Do not expire deferred/watch decisions silently.
