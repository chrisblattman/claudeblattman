#!/usr/bin/env python3
"""Local triage journal. No network, credentials, classification, or mail mutations."""
import argparse
from datetime import datetime, timedelta, timezone
import hashlib
import json
import os
from pathlib import Path
import tempfile
import uuid

UTC = timezone.utc


def stamp(value):
    return value.astimezone(UTC).isoformat().replace('+00:00', 'Z')


def date(value):
    parsed = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if parsed.tzinfo is None:
        raise ValueError('Timestamp must include a timezone')
    return parsed.astimezone(UTC)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest() if path.exists() else 'missing'


def read_state(path):
    if path.is_symlink():
        raise ValueError('State file must not be a symlink')
    state = json.loads(path.read_text()) if path.exists() else {}
    if not isinstance(state, dict):
        raise ValueError('State must be a JSON object; preserve it and reconcile manually')
    if not isinstance(state.get('processed', []), list) or not isinstance(state.get('pending', {}), dict):
        raise ValueError('Unsupported state structure; preserve it and reconcile manually')
    if any(not isinstance(item, dict) for item in state.get('processed', [])):
        raise ValueError('Unsupported processed record')
    return state


def atomic_json(path, value):
    fd, tmp = tempfile.mkstemp(prefix='.' + path.name, dir=path.parent)
    try:
        with os.fdopen(fd, 'w') as handle:
            json.dump(value, handle, indent=2, sort_keys=True)
            handle.write('\n')
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def lock_path(path):
    return path.with_name(path.name + '.triage-lock')


def account_check(state, account):
    if state.get('account') and state['account'] != account:
        raise ValueError('State belongs to a different account')


def begin(path, account, apply=False, days=None, limit=None, start=None, end=None, now=None):
    now = now or datetime.now(UTC)
    if days is not None and days <= 0 or limit is not None and limit <= 0:
        raise ValueError('days and limit must be positive')
    if bool(start) != bool(end) or (start and days is not None):
        raise ValueError('Use both start/end, or days, not both')
    if not account.strip():
        raise ValueError('Account is required')
    state = read_state(path)
    account_check(state, account)
    warnings = []
    until = now
    if start:
        since, until = date(start), date(end)
        if since >= until or until > now:
            raise ValueError('Historical interval must be ordered and end no later than now')
    elif days is not None:
        since = now - timedelta(days=days)
    else:
        try:
            checkpoint = date(state['last_run'])
            if checkpoint > now:
                raise ValueError('Future checkpoint')
            since = min(checkpoint - timedelta(hours=6), now - timedelta(days=1))
        except (KeyError, ValueError, TypeError, AttributeError):
            since = now - timedelta(days=2)
            warnings.append('No valid checkpoint: two-day fallback; older mail may remain unsearched')
    if state and not state.get('account'):
        warnings.append('Legacy state has no account: confirm ownership before apply')
    run = {
        'run_id': str(uuid.uuid4()) if apply else None,
        'account': account, 'started_at': stamp(now),
        'start': stamp(since), 'end': stamp(until), 'limit': limit,
        'checkpoint_eligible': days is None and limit is None and start is None,
        'expected_digest': digest(path),
    }
    if apply:
        path.parent.mkdir(parents=True, exist_ok=True)
        try:
            fd = os.open(lock_path(path), os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        except FileExistsError:
            raise ValueError('Apply lease exists; do not overlap writers or remove it automatically')
        with os.fdopen(fd, 'w') as handle:
            json.dump(run, handle)
            handle.flush()
            os.fsync(handle.fileno())
    return dict(run, mode='apply' if apply else 'preview', warnings=warnings,
                processed=state.get('processed', []), pending=state.get('pending', {}))


def active(path, run_id, check_digest=True):
    lp = lock_path(path)
    if lp.is_symlink():
        raise ValueError('Lease must not be a symlink')
    run = json.loads(lp.read_text())
    if not run_id or run.get('run_id') != run_id:
        raise ValueError('Lease does not belong to this run')
    if check_digest and digest(path) != run['expected_digest']:
        raise ValueError('State changed outside this run; reconcile before continuing')
    state = read_state(path)
    account_check(state, run['account'])
    return run, state


def persist(path, run, state):
    state['account'] = run['account']
    atomic_json(path, state)
    run['expected_digest'] = digest(path)
    atomic_json(lock_path(path), run)


def labels(item, key):
    value = item.get(key)
    if not isinstance(value, list) or any(not isinstance(x, str) or not x for x in value):
        raise ValueError(key + ' must be an array of label strings')
    return set(value)


def record(path, run_id, operations, now=None):
    """Journal intent first; then record connector readback evidence or reconciliation."""
    now = now or datetime.now(UTC)
    run, state = active(path, run_id)
    if not isinstance(operations, list) or not operations:
        raise ValueError('Operations must be a nonempty array')
    pending = state.setdefault('pending', {})
    processed = state.setdefault('processed', [])
    seen = set()
    for op in operations:
        mid = op.get('id') if isinstance(op, dict) else None
        if not isinstance(mid, str) or not mid or mid in seen:
            raise ValueError('Each operation needs a unique nonempty message id')
        seen.add(mid)
        status = op.get('status')
        if status == 'pending':
            if mid in pending:
                raise ValueError('Unresolved operation exists; reconcile it before another attempt')
            add, remove = labels(op, 'add'), labels(op, 'remove')
            if add & remove or not (add | remove):
                raise ValueError('Requested additions/removals must be nonempty and disjoint')
            pending[mid] = dict(op, run_id=run_id, timestamp=stamp(now))
        elif status in ('verified', 'cancelled'):
            if mid not in pending:
                raise ValueError('Record intent before a mutation or reconcile an existing pending item')
            intent = pending[mid]
            after = labels(op, 'after')
            if status == 'verified':
                before = labels(op, 'before')
                add, remove = set(intent['add']), set(intent['remove'])
                if not add <= after or remove & after:
                    raise ValueError('Readback does not verify requested label changes')
                processed[:] = [x for x in processed if x.get('id') != mid]
                expected = (before | add) - remove
                processed.append(dict(id=mid, timestamp=stamp(now), add=sorted(add),
                                      remove=sorted(remove), after=sorted(after),
                                      drift_added=sorted(after - expected),
                                      drift_removed=sorted(expected - after)))
            else:
                if not isinstance(op.get('reason'), str) or not op['reason'].strip():
                    raise ValueError('Cancellation needs a reconciliation reason and current labels')
                state.setdefault('reconciled', []).append(dict(op, timestamp=stamp(now)))
            del pending[mid]
        else:
            raise ValueError('Status must be pending, verified, or cancelled')
    persist(path, run, state)
    return {'pending': len(pending), 'recorded': len(operations)}


def finish(path, run_id, coverage, now=None):
    now = now or datetime.now(UTC)
    run, state = active(path, run_id)
    if not isinstance(coverage, dict):
        raise ValueError('Coverage must be an object')
    complete = all(coverage.get(k) is True for k in
                   ('searches_complete', 'bodies_complete', 'sweep_complete', 'mutations_reconciled'))
    advance = complete and run['checkpoint_eligible'] and not state.get('pending')
    if advance:
        state['last_run'] = run['started_at']
    cutoff = now - timedelta(days=7)
    def keep(item):
        try:
            return date(item['timestamp']) >= cutoff
        except (KeyError, ValueError, TypeError, AttributeError):
            return True  # Never discard records we cannot interpret.
    state['processed'] = [x for x in state.get('processed', []) if keep(x)]
    state['last_attempt'] = dict(run_id=run_id, start=run['start'], end=run['end'],
                                 finished_at=stamp(now), coverage=coverage, checkpoint_advanced=advance)
    persist(path, run, state)
    lock_path(path).unlink()
    return {'checkpoint_advanced': advance, 'last_run': state.get('last_run'),
            'pending': len(state.get('pending', {}))}


def release(path, run_id):
    # Explicit recovery only. Never clears pending work or advances the checkpoint.
    active(path, run_id, check_digest=False)
    lock_path(path).unlink()
    return {'released': run_id, 'state_unchanged': True}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    for command in ('begin', 'record', 'finish', 'release'):
        p = sub.add_parser(command)
        p.add_argument('--state', type=Path, required=True)
        if command == 'begin':
            p.add_argument('--account', required=True)
            p.add_argument('--apply', action='store_true')
            p.add_argument('--days', type=int)
            p.add_argument('--limit', type=int)
            p.add_argument('--start')
            p.add_argument('--end')
        else:
            p.add_argument('--run-id', required=True)
        if command == 'record':
            p.add_argument('--operations', type=Path, required=True)
        if command == 'finish':
            p.add_argument('--coverage', type=Path, required=True)
    args = vars(parser.parse_args())
    command = args.pop('command')
    path = args.pop('state').expanduser().absolute()
    for name in ('operations', 'coverage'):
        if name in args:
            args[name] = json.loads(args[name].read_text())
    result = globals()[command](path, **args)
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, TypeError) as error:
        raise SystemExit('triage_state: ' + str(error))
