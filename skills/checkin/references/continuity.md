# Durable email batches

Store one JSON file per batch in the configured runtime directory, separate from installed skills and any older session-summary file. Use a unique timestamp/UUID filename. The bundled `scripts/batch_store.py` writes snapshots with optimistic revision checks and a short exclusive lock; it has no network or email access. Python 3.9+ standard library is sufficient.

## Create and update

A new batch has this minimum shape. Fill examples with actual evidence, never simulated receipts:

```json
{
  "schema_version": 1,
  "batch_id": "unique-batch-id",
  "account": "connected-account",
  "items": [
    {
      "number": 1,
      "reviewed_message_ids": ["exact-source-id"],
      "subject": "Recognizable subject",
      "section": "fyi",
      "status": "pending",
      "remaining_work": "Review outcome not yet recorded"
    }
  ],
  "events": [],
  "coverage": {"start": "ISO time", "end": "ISO time", "gaps": []}
}
```

Use a separate item for a genuinely new incoming obligation. Related messages may be grouped before presentation, retaining all exact IDs. Once saved, numbers/source IDs cannot change. Preserve old items, including completed ones. Add new review rounds in new batch files beginning at 1, with an optional continues_batch_id linking them. Revisions/resume update the original file. Do not renumber historical batches.

Write a candidate snapshot to a temporary runtime file, then invoke:

```text
python3 "<skill-root>/scripts/batch_store.py" read --path "<batch-path>"
python3 "<skill-root>/scripts/batch_store.py" write --path "<batch-path>" --input "<snapshot-json>" --expected "<digest-from-read-or-missing>"
```

Read returns `missing` when absent. Write rejects stale digests, duplicate IDs/numbers, changed source mappings, dropped items, or changed/dropped historical events. Re-read the result before presentation or external actions. If another writer changed the file, read and merge its changes rather than overwriting it. A lock is not auto-expired. Reconcile an interrupted owner before explicitly removing a stale lock. Use one designated execution device if the directory syncs through cloud storage; this is a local lock, not distributed coordination.

## What to retain

- Stable mapping: account, batch ID, number, exact reviewed message IDs, thread IDs, subject, and original presentation.
- Decisions and holds with user-message provenance, current remaining work, and original references for carry-forward.
- Draft version/payload references and approval provenance. Keep approval separate from an attempted send, verified delivery, and source read/archive changes.
- Append-only events with unique event IDs, timestamps, exact targets, action/attempt IDs, and real outcomes. Record intent before mutation. A later result is a new event, not an edited success claim in an older event.
- A compact handling check for claimed outstanding tasks: evidence IDs, check time, actual remaining obligation, completeness, and uncertainty.
- Coverage: actual account/folder/date queries, fully enumerated cutoff, content-review gaps, unshown source IDs and review status, and family/quarantine findings where enabled.

Persist meaningful changes while working, not just at the end. Do not copy a whole mailbox or secrets into state. A single brief session summary cannot replace per-item decisions and action results.

## Continuation and recovery

Load relevant open batches and recent completed batches that may still contain unshown candidates or unresolved cleanup. Reconcile with current messages. A saved status is evidence of the prior session, not proof of current mailbox state. A successful send must not be repeated because source marking-read failed.

For rolling reviews, advance discovery_through only over fully enumerated intervals. Preserve discovered-but-unreviewed IDs even if discovery advanced. An explicit fixed historical end never grows. Missing old fields mean unknown coverage; do not manufacture historical evidence.

Save each item's latest status separately from append-only events. A stale draft approval cannot transfer to a changed payload or a new message in the same thread. Carry-forward uses original batch/item references. A displayed pending item must not silently become a new numbered item or disappear just because newer mail arrived.

The helper preserves identities/history but cannot verify Gmail, send approvals, or factual evidence. The agent must enforce those constraints from actual tools and user instructions. If persistence is unavailable, show a read-only review and disclose that it cannot reliably resume; do not perform unjournaled sends or automatic FYI changes. In preview, do not create runtime/temp snapshot files or call write; return the proposed review in chat.
