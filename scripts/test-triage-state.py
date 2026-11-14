#!/usr/bin/env python3
"""Offline triage state invariants. No mail or external account access."""
import importlib.util
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'skills/triage-inbox/scripts/triage_state.py'
spec = importlib.util.spec_from_file_location('triage_state', SOURCE)
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
NOW = datetime(2026, 11, 14, 12, tzinfo=timezone.utc)
COMPLETE = dict(searches_complete=True, bodies_complete=True, sweep_complete=True, mutations_reconciled=True)


class StateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.state = self.root / 'runtime/state.json'

    def save(self, data):
        self.state.parent.mkdir(parents=True, exist_ok=True)
        self.state.write_text(json.dumps(data))

    def begin(self, **kwargs):
        return m.begin(self.state, 'test@example.org', now=NOW, **kwargs)

    def pending(self, run, mid='mail1'):
        m.record(self.state, run['run_id'], [dict(id=mid, status='pending', add=['reading'], remove=['INBOX'])], now=NOW)

    def verify(self, run, mid='mail1', after=None):
        m.record(self.state, run['run_id'], [dict(id=mid, status='verified', before=['INBOX', 'UNREAD'],
                  after=after or ['reading', 'UNREAD'])], now=NOW)

    def test_preview_creates_nothing_and_preserves_existing_bytes(self):
        self.begin()
        self.assertFalse(self.state.parent.exists())
        self.save({'last_run': 'bad', 'custom': {'keep': True}})
        before = self.state.read_bytes()
        result = self.begin()
        self.assertEqual(result['mode'], 'preview')
        self.assertEqual(before, self.state.read_bytes())
        self.assertFalse(m.lock_path(self.state).exists())

    def test_window_overlap_long_gaps_and_invalid_checkpoint(self):
        self.save({'last_run': m.stamp(NOW - timedelta(days=20))})
        r = self.begin()
        self.assertEqual(m.date(r['start']), NOW - timedelta(days=20, hours=6))
        for value in ('invalid', m.stamp(NOW + timedelta(days=1)), None):
            self.save({'last_run': value})
            r = self.begin()
            self.assertEqual(m.date(r['start']), NOW - timedelta(days=2))
            self.assertTrue(r['warnings'])

    def test_complete_run_preserves_fields_and_checkpoints_start(self):
        self.save({'custom': {'keep': 7}, 'processed': [{'id': 'old', 'timestamp': m.stamp(NOW-timedelta(days=10))}]})
        r = self.begin(apply=True)
        self.pending(r)
        self.verify(r)
        result = m.finish(self.state, r['run_id'], COMPLETE, now=NOW+timedelta(hours=1))
        state = json.loads(self.state.read_text())
        self.assertTrue(result['checkpoint_advanced'])
        self.assertEqual(state['last_run'], m.stamp(NOW))
        self.assertEqual(state['custom'], {'keep': 7})
        self.assertEqual([x['id'] for x in state['processed']], ['mail1'])
        self.assertFalse(m.lock_path(self.state).exists())

    def test_pending_failure_blocks_checkpoint_survives_and_reconciles(self):
        old = m.stamp(NOW-timedelta(days=1))
        self.save({'last_run': old})
        r = self.begin(apply=True)
        self.pending(r)
        with self.assertRaisesRegex(ValueError, 'Readback'):
            self.verify(r, after=['INBOX', 'UNREAD'])
        result = m.finish(self.state, r['run_id'], COMPLETE, now=NOW)
        self.assertFalse(result['checkpoint_advanced'])
        self.assertEqual(result['last_run'], old)
        self.assertEqual(result['pending'], 1)
        r2 = self.begin(apply=True)
        self.verify(r2)
        self.assertTrue(m.finish(self.state, r2['run_id'], COMPLETE, now=NOW)['checkpoint_advanced'])

    def test_partial_manual_and_limited_runs_do_not_advance(self):
        for kwargs, coverage in (({}, dict(COMPLETE, bodies_complete=False)),
                                 ({'days': 3}, COMPLETE), ({'limit': 20}, COMPLETE),
                                 ({'start': m.stamp(NOW-timedelta(days=3)), 'end': m.stamp(NOW-timedelta(days=2))}, COMPLETE),
                                 ({}, {})):
            with self.subTest(kwargs=kwargs, coverage=coverage):
                r = self.begin(apply=True, **kwargs)
                self.assertFalse(m.finish(self.state, r['run_id'], coverage, now=NOW)['checkpoint_advanced'])
                self.assertNotIn('last_run', json.loads(self.state.read_text()))

    def test_lease_blocks_overlap_and_wrong_owner(self):
        r = self.begin(apply=True)
        with self.assertRaisesRegex(ValueError, 'lease exists'):
            self.begin(apply=True)
        with self.assertRaisesRegex(ValueError, 'belong'):
            m.release(self.state, 'another-run')
        m.release(self.state, r['run_id'])
        self.assertFalse(self.state.exists())

    def test_external_write_conflict_is_not_overwritten(self):
        self.save({'custom': 'first'})
        r = self.begin(apply=True)
        self.save({'custom': 'someone else'})
        before = self.state.read_bytes()
        with self.assertRaisesRegex(ValueError, 'changed outside'):
            self.pending(r)
        self.assertEqual(before, self.state.read_bytes())
        m.release(self.state, r['run_id'])
        self.assertEqual(before, self.state.read_bytes())

    def test_drift_does_not_undo_verified_changes(self):
        r = self.begin(apply=True)
        self.pending(r)
        self.verify(r, after=['reading', 'extra'])
        item = json.loads(self.state.read_text())['processed'][0]
        self.assertEqual(item['drift_added'], ['extra'])
        self.assertEqual(item['drift_removed'], ['UNREAD'])
        self.assertEqual(item['after'], ['extra', 'reading'])

    def test_repeated_attempt_rejected_and_cancelled_work_not_processed(self):
        r = self.begin(apply=True)
        self.pending(r)
        with self.assertRaisesRegex(ValueError, 'Unresolved'):
            self.pending(r)
        m.record(self.state, r['run_id'], [dict(id='mail1', status='cancelled', after=['INBOX', 'UNREAD'],
                    reason='Readback confirms no change; user now wants to keep it visible')], now=NOW)
        state = json.loads(self.state.read_text())
        self.assertFalse(state['pending'])
        self.assertFalse(state['processed'])

    def test_wrong_account_corrupt_state_and_symlink_rejected(self):
        self.save({'account': 'other@example.org'})
        with self.assertRaisesRegex(ValueError, 'different account'):
            self.begin(apply=True)
        self.state.write_text('{broken')
        with self.assertRaises(ValueError):
            self.begin(apply=True)
        self.state.unlink()
        target = self.root/'target'
        target.write_text('{}')
        self.state.symlink_to(target)
        with self.assertRaisesRegex(ValueError, 'symlink'):
            self.begin(apply=True)
        self.assertEqual(target.read_text(), '{}')

    def test_invalid_batch_is_atomic_and_pending_not_pruned(self):
        self.save({'pending': {'ancient': {'add': ['a'], 'remove': ['INBOX'], 'timestamp': '2000-01-01T00:00:00Z'}}})
        r = self.begin(apply=True)
        before = self.state.read_bytes()
        with self.assertRaises(ValueError):
            m.record(self.state, r['run_id'], [dict(id='ok', status='pending', add=['a'], remove=['INBOX']),
                                              dict(id='bad', status='verified', before=[], after=[])], now=NOW)
        self.assertEqual(before, self.state.read_bytes())
        m.finish(self.state, r['run_id'], COMPLETE, now=NOW)
        self.assertIn('ancient', json.loads(self.state.read_text())['pending'])

    def test_relocated_package_runs_without_private_dependencies(self):
        package = self.root/'installed skill'
        shutil.copytree(ROOT/'skills/triage-inbox', package)
        state = self.root/'new runtime/state.json'
        result = subprocess.run([sys.executable, str(package/'scripts/triage_state.py'), 'begin',
                                 '--state', str(state), '--account', 'test@example.org'],
                                capture_output=True, text=True, check=True, cwd=self.root)
        self.assertEqual(json.loads(result.stdout)['mode'], 'preview')
        self.assertFalse(state.parent.exists())


if __name__ == '__main__':
    unittest.main()
