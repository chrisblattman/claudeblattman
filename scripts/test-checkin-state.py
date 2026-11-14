#!/usr/bin/env python3
"""Offline batch persistence checks; no mailbox or outbound tool access."""
import copy
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT/'skills/checkin/scripts/batch_store.py'
spec = importlib.util.spec_from_file_location('batch_store', SOURCE)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


class BatchTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.path = self.root/'runtime/batch.json'
        self.batch = dict(schema_version=1, batch_id='b1', account='example@example.org',
                          items=[dict(number=1, reviewed_message_ids=['m1'], status='pending')],
                          events=[], coverage={'gaps': ['unread attachment']})

    def test_read_missing_is_non_mutating(self):
        self.assertEqual(m.read(self.path), {'digest': 'missing', 'batch': None})
        self.assertFalse(self.path.parent.exists())

    def test_decisions_and_execution_events_survive_updates(self):
        result = m.write(self.path, self.batch, 'missing')
        newer = copy.deepcopy(self.batch)
        newer['events'].append(dict(event_id='a1', action='send', status='attempting'))
        attempt = m.write(self.path, newer, result['digest'])
        newer['events'].append(dict(event_id='a2', action='send', status='verified', sent_id='s1'))
        newer['items'][0]['status'] = 'sent; source cleanup pending'
        m.write(self.path, newer, attempt['digest'])
        self.assertEqual(m.read(self.path)['batch'], newer)

    def test_stale_writer_cannot_lose_another_decision(self):
        result = m.write(self.path, self.batch, 'missing')
        other = copy.deepcopy(self.batch)
        other['items'][0]['hold'] = 'user requested unread'
        m.write(self.path, other, result['digest'])
        before = self.path.read_bytes()
        with self.assertRaisesRegex(ValueError, 'changed since'):
            m.write(self.path, self.batch, result['digest'])
        self.assertEqual(before, self.path.read_bytes())

    def test_no_renumber_drop_retarget_or_account_change(self):
        result = m.write(self.path, self.batch, 'missing')
        for key, value in [('items', []), ('account', 'different@example.org'),
                           ('items', [dict(number=1, reviewed_message_ids=['new-arrival'])])]:
            candidate = copy.deepcopy(self.batch)
            candidate[key] = value
            with self.assertRaises(ValueError):
                m.write(self.path, candidate, result['digest'])
        self.assertEqual(m.read(self.path)['batch'], self.batch)

    def test_append_only_event_history_and_unique_sources(self):
        self.batch['events'] = [dict(event_id='a1', status='attempting')]
        result = m.write(self.path, self.batch, 'missing')
        for events in ([], [dict(event_id='a1', status='sent')], self.batch['events']*2):
            changed = dict(self.batch, events=events)
            with self.assertRaises(ValueError):
                m.write(self.path, changed, result['digest'])
        duplicate = dict(self.batch, items=self.batch['items']+[dict(number=2, reviewed_message_ids=['m1'])])
        with self.assertRaises(ValueError):
            m.write(self.root/'bad.json', duplicate, 'missing')

    def test_existing_lock_and_corruption_are_not_overwritten(self):
        self.path.parent.mkdir()
        lock = self.path.with_name(self.path.name+'.checkin-lock')
        lock.write_text('other-owner')
        with self.assertRaisesRegex(ValueError, 'lock exists'):
            m.write(self.path, self.batch, 'missing')
        self.assertEqual(lock.read_text(), 'other-owner')
        lock.unlink()
        self.path.write_text('{broken')
        with self.assertRaises(ValueError):
            m.write(self.path, self.batch, m.digest(self.path.read_bytes()))
        self.assertEqual(self.path.read_text(), '{broken')
        self.assertFalse(lock.exists())

    def test_relocated_cli_package_and_symlink_protection(self):
        package = self.root/'installed skill'
        shutil.copytree(ROOT/'skills/checkin', package)
        data = self.root/'input.json'
        data.write_text(json.dumps(self.batch))
        result = subprocess.run([sys.executable, str(package/'scripts/batch_store.py'), 'write',
                     '--path', str(self.path), '--input', str(data), '--expected', 'missing'],
                     check=True, capture_output=True, text=True, cwd=self.root)
        self.assertTrue(json.loads(result.stdout)['written'])
        link = self.root/'alias.json'
        link.symlink_to(self.path)
        with self.assertRaisesRegex(ValueError, 'symlink'):
            m.write(link, self.batch, 'missing')


if __name__ == '__main__':
    unittest.main()
