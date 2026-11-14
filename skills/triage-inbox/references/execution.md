# Execution, coverage, and local state

Use the existing approved mail connector. Discover actual schemas for search/pagination, full content, label listing, label edits, and message readback. Use Gmail message IDs, not conversation IDs, for mutations. If a tool operates on whole threads only, do not silently include newer messages: report the unsupported exact-message action and leave it pending. No credential installation or private Gmail helper is required by this package.

The bundled `scripts/triage_state.py` handles local state only. It never accesses Gmail, verifies live mail itself, or grants permission. The agent supplies evidence from actual connector reads. Run it with Python 3.9+ from the installed skill folder, with paths quoted as literal arguments. No pip installation is needed.

## Begin

Resolve the skill root from this installed SKILL.md, not a fixed home directory. Before apply, confirm that the user approved routine filing and that existing state belongs to this account.

```text
python3 "<skill-root>/scripts/triage_state.py" begin --state "<state-path>" --account "<account>" --apply
```

For preview, omit `--apply`. The helper only reads and prints JSON, creating no directory, lease, or state. Never call `record`, `finish`, or `release` in preview, or redirect preview output into operational files. Return preview proposals in the conversation.

Pass `--days 3` or `--limit 20` when requested. For a fixed historical interval use both `--start "<ISO timestamp with timezone>"` and `--end "<ISO timestamp with timezone>"`. These bounded modes cannot advance the normal checkpoint. The helper returns start/end, warnings, processed/pending records, and (in apply mode) a run ID.

An apply lease reserves this state path for the whole run. If it exists, stop rather than overlap mailbox writers. Do not auto-expire it. All runs for the same account must use the same canonical state path. A lock in a cloud-synced folder coordinates processes on one machine, not independent devices: schedule one designated device/executor per account, or use an external single-writer scheduler. Do not run this automation concurrently across devices.

## Discover and account for coverage

Freeze the helper's interval at run start. Search inbox mail both read and unread, and the configured label-in-inbox sweep, within that interval. For epoch-based Gmail queries, search slightly wider at the boundaries (for example start minus one second and end plus one second), then filter by actual message receipt time to the half-open interval `[start, end)`. Missing/unreliable receipt times are gaps to report, not permission to broaden a historical mutation.

Follow every page token. Deduplicate IDs before applying the single whole-run limit. Read each candidate's full relevant plain text or HTML, headers, sender, recipient, current labels, and any attachment/invitation content needed for classification. Check search/content errors explicitly: tool success or exit code alone does not prove full coverage. An empty result is complete only when the searches succeeded and exhausted pagination.

If `limit:N` prevents review of all candidates, keep partial progress without advancing the checkpoint. On a later run, use verified processed IDs to avoid repeating completed work and continue to the unreviewed candidates. A protected/uncertain decision after full review is not a content failure; an unreadable message is. No decision to keep a message authorizes marking it read.

Pending operations from previous runs must be reconciled by current exact-ID readback before another attempt. Previously processed records are hints: compare current labels, policy, and holds before reusing them. Missing records do not mean work was completed.

## Journal, change, read back

For each sequential batch, read immediate label baselines, construct exact additions/removals under the policy, and journal intent before submitting anything to Gmail. Write a local operations JSON file outside the installed skill and pass its path:

```json
[
  {"id": "message-id", "status": "pending", "add": ["configured-label-id"], "remove": ["INBOX"]}
]
```

```text
python3 "<skill-root>/scripts/triage_state.py" record --state "<state-path>" --run-id "<run-id>" --operations "<operations-json>"
```

Now submit the requested Gmail operation through the connector. Re-read exact message labels. Record verified results using the same command with a new operations file:

```json
[
  {"id": "message-id", "status": "verified", "before": ["INBOX", "UNREAD"], "after": ["configured-label-id", "UNREAD"]}
]
```

The helper checks that the requested additions/removals appear in the supplied readback. It records unrelated differences as drift, without claiming the operation caused them. Actual connector evidence must back these arrays. Preserve read state by leaving UNREAD out of both additions and removals unless a specific approved rule allows it.

If an operation errors or readback fails, its intent stays pending. Do not automatically retry: a request can succeed before its response fails. Later readback may establish that it was applied. To close an intent verified as not applied or no longer appropriate, use `status: "cancelled"`, the current `after` labels, and a concrete `reason`. Cancellation does not undo mail or declare it processed. If its outcome remains uncertain, keep it pending.

The helper merges changes atomically and preserves unrelated state fields. It refuses a different account, changed state snapshots, unsupported state structures, or the wrong lease owner. If another writer changed state, stop and reconcile. Do not overwrite it with a sample JSON document.

## Finish

In apply mode, create a coverage JSON object from the actual run:

```json
{
  "searches_complete": true,
  "bodies_complete": true,
  "sweep_complete": true,
  "mutations_reconciled": true
}
```

Use false for unfinished or failed portions. The sweep can be complete with no candidates or no configured sweep labels. Protected mail reviewed and deliberately left alone counts as reviewed. Missing bodies do not. Missing flags default to incomplete.

```text
python3 "<skill-root>/scripts/triage_state.py" finish --state "<state-path>" --run-id "<run-id>" --coverage "<coverage-json>"
```

Only a complete automatic run with no pending operations advances `last_run` to run-start time. Manual days/range overrides and limits never advance it. A partial finish still saves verified progress, retains pending records, and releases the lease. Only ordinary processed records older than seven days are pruned. Unknown fields and pending records remain.

If interrupted, retain the lease until the owner is stopped and the user/agent has reconciled any in-flight connector operation. Then explicitly release that run's lease:

```text
python3 "<skill-root>/scripts/triage_state.py" release --state "<state-path>" --run-id "<run-id>"
```

Release changes no state or mail. A subsequent begin can reconcile journaled pending operations. Never delete or steal a lease just because it is old. If a crash occurred between state replacement and lease refresh, preserve both files and reconcile before releasing. This deliberately stops instead of guessing.

## Return to the user or check-in

State the interval, completed versus unreviewed coverage, verified filings, uncertain actions, and whether the checkpoint advanced. Include exact pending/held message IDs for a calling check-in. Do not start a parallel writer or repeat completed triage from the parent. Read-only review can proceed with a disclosed triage failure, but must not claim sorting succeeded.

Routine runs may be quiet if the user's schedule requests that. A failure, missing connection, or material coverage gap remains visible. The schedule and any interactive reply workflow are configured separately.
