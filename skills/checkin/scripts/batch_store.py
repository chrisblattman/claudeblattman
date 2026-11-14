#!/usr/bin/env python3
"""Atomic local check-in snapshots with stable identities and append-only events."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import tempfile


def digest(data):
    return hashlib.sha256(data).hexdigest()


def validate(batch):
    if not isinstance(batch, dict) or batch.get('schema_version') != 1:
        raise ValueError('Expected a schema_version 1 batch object')
    for key in ('batch_id', 'account'):
        if not isinstance(batch.get(key), str) or not batch[key].strip():
            raise ValueError(key + ' is required')
    items, events = batch.get('items'), batch.get('events')
    if not isinstance(items, list) or not isinstance(events, list):
        raise ValueError('items and events must be arrays')
    sources = set()
    for expected, item in enumerate(items, 1):
        if not isinstance(item, dict) or type(item.get('number')) is not int or item['number'] != expected:
            raise ValueError('Item numbers must be contiguous, beginning at 1')
        ids = item.get('reviewed_message_ids')
        if not isinstance(ids, list) or not ids or any(not isinstance(x, str) or not x for x in ids):
            raise ValueError('Each item needs exact reviewed message IDs')
        if len(ids) != len(set(ids)) or sources.intersection(ids):
            raise ValueError('A source ID cannot occupy multiple slots in one batch')
        sources.update(ids)
    event_ids = set()
    for event in events:
        eid = event.get('event_id') if isinstance(event, dict) else None
        if not isinstance(eid, str) or not eid or eid in event_ids:
            raise ValueError('Events need unique event_id strings')
        event_ids.add(eid)


def read(path):
    if path.is_symlink():
        raise ValueError('Batch path must not be a symlink')
    if not path.exists():
        return {'digest': 'missing', 'batch': None}
    data = path.read_bytes()
    batch = json.loads(data)
    validate(batch)
    return {'digest': digest(data), 'batch': batch}


def write(path, batch, expected):
    validate(batch)
    if path.is_symlink():
        raise ValueError('Batch path must not be a symlink')
    path.parent.mkdir(parents=True, exist_ok=True)
    lock = path.with_name(path.name + '.checkin-lock')
    try:
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        raise ValueError('Batch writer lock exists; reconcile its owner before continuing')
    tmp = None
    try:
        with os.fdopen(fd, 'w') as handle:
            handle.write(str(os.getpid()))
        current = read(path)
        if current['digest'] != expected:
            raise ValueError('Batch changed since read; re-read and merge')
        old = current['batch']
        if old is not None:
            if any(old[k] != batch[k] for k in ('batch_id', 'account', 'schema_version')):
                raise ValueError('Batch identity cannot change')
            old_map = [(x['number'], x['reviewed_message_ids']) for x in old['items']]
            new_map = [(x['number'], x['reviewed_message_ids']) for x in batch['items']]
            if old_map != new_map:
                raise ValueError('Saved numbers and source targets cannot change; create a new batch')
            if batch['events'][:len(old['events'])] != old['events']:
                raise ValueError('Historical events cannot be changed or dropped')
            if not old.keys() <= batch.keys():
                raise ValueError('Preserve existing top-level fields when merging')
        data = (json.dumps(batch, indent=2, sort_keys=True) + '\n').encode()
        fd, tmp = tempfile.mkstemp(prefix='.' + path.name, dir=path.parent)
        with os.fdopen(fd, 'wb') as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(tmp, path)
        tmp = None
        return {'digest': digest(data), 'batch_id': batch['batch_id'], 'written': True}
    finally:
        if tmp is not None:
            os.unlink(tmp)
        lock.unlink()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    for command in ('read', 'write'):
        sub = commands.add_parser(command)
        sub.add_argument('--path', type=Path, required=True)
        if command == 'write':
            sub.add_argument('--input', type=Path, required=True)
            sub.add_argument('--expected', required=True)
    args = parser.parse_args()
    path = args.path.expanduser().absolute()
    if args.command == 'read':
        result = read(path)
    else:
        result = write(path, json.loads(args.input.read_text()), args.expected)
    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, TypeError) as error:
        raise SystemExit('batch_store: ' + str(error))
