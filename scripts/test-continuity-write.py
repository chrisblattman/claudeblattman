#!/usr/bin/env python3
"""Offline continuity-write behavior; all effects stay in a temporary directory."""
import importlib.util
from pathlib import Path
import tempfile
import sys
import unittest

# Import the source helper without adding bytecode to the packaged skill tree.
sys.dont_write_bytecode = True

SOURCE = Path(__file__).resolve().parents[1] / 'starter-kit-source/skills/done/scripts/continuity-write.py'
spec = importlib.util.spec_from_file_location('continuity_write', SOURCE)
writer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(writer)

class ContinuityTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.path = Path(self.tmp.name) / 'SESSION_LOG.md'
        self.entry = '## First session\nSESSLOG:2026-11-05T10:00:00-06:00\n\n- Preserve the work\n'
        self.key = '2026-11-05T10:00:00-06:00'

    def test_append_preserves_history_and_retry_is_idempotent(self):
        old = '# Session Log\n\n## Older work\nKeep this.\n'
        self.path.write_text(old)
        original_hash = writer.digest(self.path.read_bytes())
        writer.write(self.path, self.entry, original_hash, self.key, 'append')
        actual = self.path.read_bytes()
        self.assertTrue(actual.decode().startswith(old))
        result = writer.write(self.path, self.entry, original_hash, self.key, 'append')
        self.assertEqual(result['status'], 'already-recorded')
        self.assertEqual(actual, self.path.read_bytes())

    def test_stale_snapshot_rejected_without_data_loss(self):
        self.path.write_text('Someone else changed this.\n')
        with self.assertRaisesRegex(ValueError, 'changed since read'):
            writer.write(self.path, self.entry, 'missing', self.key, 'replace')
        self.assertEqual(self.path.read_text(), 'Someone else changed this.\n')
        self.assertFalse(self.path.with_name(self.path.name + '.done-write.lock').exists())

    def test_existing_lock_not_stolen(self):
        lock = self.path.with_name(self.path.name + '.done-write.lock')
        lock.write_text('another writer')
        with self.assertRaisesRegex(ValueError, 'lock exists'):
            writer.write(self.path, self.entry, 'missing', self.key, 'append')
        self.assertEqual(lock.read_text(), 'another writer')
        self.assertFalse(self.path.exists())

    def test_partial_closeout_retry_preserves_successful_log(self):
        writer.write(self.path, self.entry, 'missing', self.key, 'append')
        saved_log = self.path.read_bytes()
        handoff = self.path.with_name('HANDOFF.md')
        handoff.write_text('Other active work\n')
        with self.assertRaises(ValueError):
            writer.write(handoff, self.entry, 'missing', self.key, 'replace')
        writer.write(self.path, self.entry, 'missing', self.key, 'append')
        merged = self.entry + '\nOther active work\n'
        writer.write(handoff, merged, writer.digest(handoff.read_bytes()), self.key, 'replace')
        self.assertEqual(saved_log, self.path.read_bytes())
        self.assertIn('Other active work', handoff.read_text())

    def test_marker_validation_and_symlink_rejection(self):
        with self.assertRaisesRegex(ValueError, 'exact capture marker'):
            writer.write(self.path, 'No marker', 'missing', self.key, 'append')
        target = self.path.with_name('real.md')
        target.write_text('keep')
        self.path.symlink_to(target)
        with self.assertRaisesRegex(ValueError, 'symlink'):
            writer.write(self.path, self.entry, 'missing', self.key, 'replace')
        self.assertEqual(target.read_text(), 'keep')

    def test_snapshot_keeps_mode_and_replaces_not_appends(self):
        self.path.write_text('old snapshot')
        self.path.chmod(0o640)
        writer.write(self.path, self.entry, writer.digest(self.path.read_bytes()), self.key, 'replace')
        self.assertEqual(self.path.read_text(), self.entry)
        self.assertEqual(self.path.stat().st_mode & 0o777, 0o640)

if __name__ == '__main__':
    unittest.main()
