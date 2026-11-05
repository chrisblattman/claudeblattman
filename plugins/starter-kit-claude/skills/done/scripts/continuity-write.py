#!/usr/bin/env python3
"""Conflict-checked local continuity writes. Does not route projects or prune files."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import stat
import sys
import tempfile


def read(path):
    if path.is_symlink():
        raise ValueError('Destination is a symlink; resolve and verify the intended target first')
    try:
        return path.read_bytes()
    except FileNotFoundError:
        return None


def digest(data):
    return 'missing' if data is None else hashlib.sha256(data).hexdigest()


def write(path, content, expected, capture_id, mode):
    if not capture_id or any(c in capture_id for c in '\r\n'):
        raise ValueError('A single-line capture ID is required')
    marker = 'SESSLOG:' + capture_id
    if marker not in content.splitlines():
        raise ValueError('Content must contain the exact capture marker on its own line')
    path.parent.mkdir(parents=True, exist_ok=True)
    lock = path.with_name(path.name + '.done-write.lock')
    try:
        fd = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        raise ValueError(f'Writer lock exists: {lock}; inspect before retrying')
    temp = None
    try:
        with os.fdopen(fd, 'w') as f:
            f.write(str(os.getpid()))
        before = read(path)
        previous = '' if before is None else before.decode('utf-8')
        if mode == 'append' and marker in previous.splitlines():
            return {'status': 'already-recorded', 'path': str(path), 'sha256': digest(before)}
        if digest(before) != expected:
            raise ValueError('Destination changed since read; reread and reconcile before retrying')
        if mode == 'append':
            prefix = previous.rstrip('\n') + '\n\n' if previous else '# Session Log\n\n'
            result = prefix + content.rstrip('\n') + '\n'
        else:
            result = content.rstrip('\n') + '\n'
        permissions = stat.S_IMODE(path.stat().st_mode) if before is not None else 0o600
        fd, temp = tempfile.mkstemp(prefix='.' + path.name + '.', dir=path.parent)
        with os.fdopen(fd, 'wb') as f:
            f.write(result.encode('utf-8'))
            f.flush()
            os.fsync(f.fileno())
        os.chmod(temp, permissions)
        if digest(read(path)) != expected:
            raise ValueError('Destination changed during write; pending content was not applied')
        os.replace(temp, path)
        temp = None
        actual = read(path)
        if actual != result.encode('utf-8'):
            raise ValueError('Post-write verification failed; inspect destination before retrying')
        return {'status': 'written', 'path': str(path), 'sha256': digest(actual)}
    finally:
        if temp is not None:
            Path(temp).unlink(missing_ok=True)
        lock.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('operation', choices=['hash', 'append', 'replace'])
    parser.add_argument('--path', type=Path, required=True)
    parser.add_argument('--expected')
    parser.add_argument('--capture-id')
    parser.add_argument('--content-file', type=Path)
    args = parser.parse_args()
    path = args.path.expanduser().absolute()
    try:
        if args.operation == 'hash':
            print(digest(read(path)))
            return 0
        if args.expected is None or args.capture_id is None:
            parser.error('writes require --expected and --capture-id')
        content = args.content_file.read_text() if args.content_file else sys.stdin.read()
        print(json.dumps(write(path, content, args.expected, args.capture_id, args.operation)))
        return 0
    except (OSError, ValueError, UnicodeError) as error:
        print(str(error), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
