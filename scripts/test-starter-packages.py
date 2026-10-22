#!/usr/bin/env python3
"""Offline installation, parity, and council failure-path tests; no model calls."""
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PYTHON = sys.executable
NAMES = {"council", "kit-hello", "kit-setup", "ask-agents", "done"}


def call(*args, ok=True):
    result = subprocess.run([str(a) for a in args], cwd=ROOT, capture_output=True, text=True)
    if ok and result.returncode:
        raise AssertionError(result.stdout + result.stderr)
    if not ok and not result.returncode:
        raise AssertionError("Expected failure: " + repr(args))
    return result


class Packages(unittest.TestCase):
    def test_archive_contents(self):
        with tempfile.TemporaryDirectory() as temp:
            call(PYTHON, ROOT / "scripts/build-starter-plugins.py", "--check", "--package-dir", temp)
            for archive in Path(temp).glob("*.zip"):
                with zipfile.ZipFile(archive) as zipped:
                    names = zipped.namelist()
                    root = names[0].split("/")[0]
                    self.assertTrue(all(n.startswith(root + "/") and ".." not in Path(n).parts for n in names))
                    skills = {n.split("/")[2] for n in names if n.endswith("/SKILL.md")}
                    self.assertEqual(skills, NAMES)
                    for name in NAMES:
                        self.assertEqual(zipped.read(f"{root}/skills/{name}/SKILL.md"), (ROOT / "starter-kit-source/skills" / name / "SKILL.md").read_bytes())
                    self.assertFalse(any("marketplace.json" in n for n in names))

    def test_generated_parity_and_inventory(self):
        call(PYTHON, ROOT / "scripts/build-starter-plugins.py", "--check")
        for root in (ROOT / "plugins/starter-kit", ROOT / "plugins/starter-kit-codex", ROOT / "codex-starter"):
            self.assertEqual({p.name for p in (root / "skills").iterdir()}, NAMES)
            for name in NAMES:
                expected = ROOT / "starter-kit-source/skills" / name / "SKILL.md"
                self.assertEqual((root / "skills" / name / "SKILL.md").read_bytes(), expected.read_bytes())
            for name in ("skeptic", "pre-mortem", "completeness-checker", "chief-of-staff"):
                self.assertEqual((root / "skills/council/references/personas" / (name + ".md")).read_bytes(), (ROOT / "starter-kit-source/agents" / (name + ".md")).read_bytes())

    def test_manual_install_restore_and_retired_preservation(self):
        installer = ROOT / "codex-starter/install-codex-starter.py"
        with tempfile.TemporaryDirectory() as temp:
            target = Path(temp) / "codex"
            original = target / "skills/done/SKILL.md"
            original.parent.mkdir(parents=True)
            original.write_text("My existing handoff skill")
            retired = target / "skills/prompt/SKILL.md"
            retired.parent.mkdir()
            retired.write_text("User-owned prompt skill")
            call(PYTHON, installer, "install", "--target-root", target)
            call(PYTHON, installer, "verify", "--target-root", target)
            call(PYTHON, installer, "install", "--target-root", target)
            self.assertFalse((target / "AGENTS.md").exists())
            self.assertEqual(retired.read_text(), "User-owned prompt skill")
            call(PYTHON, installer, "uninstall", "--target-root", target)
            self.assertEqual(original.read_text(), "My existing handoff skill")
            self.assertEqual(retired.read_text(), "User-owned prompt skill")
            self.assertFalse((target / "skills/council").exists())


class Council(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.base = Path(self.temp.name)
        self.brief = self.base / "brief.md"
        self.brief.write_text("Recommend a five-week pilot. Keep the existing staff. Explain the decision and evidence.")
        self.evidence = self.base / "evidence.txt"
        self.evidence.write_text("One person is available for half a day per week.")
        self.run = self.base / "run"
        self.helper = ROOT / "plugins/starter-kit-codex/skills/council/scripts/council.py"

    def tearDown(self):
        self.temp.cleanup()

    def invoke(self, *args, ok=True):
        return call(PYTHON, self.helper, *args, ok=ok)

    def plan(self, *extra):
        self.invoke("plan", "--host", "codex", "--brief-file", self.brief, "--output", self.run, "--evidence", self.evidence, *extra)

    def record_seats(self, failed=False, addendum=False):
        for seat in ("skeptic", "pre-mortem", "completeness"):
            report = self.base / (seat + ".md")
            report.write_text(f"Finding from {seat}: half-day capacity needs to be accounted for. Source: evidence.txt.")
            args = ["record", "--run", self.run, "--seat", seat, "--state", "partial" if failed and seat == "skeptic" else "succeeded", "--report-file", report, "--execution-id", "test-worker-" + seat]
            if addendum and seat == "skeptic":
                extra = self.base / "extra.md"
                extra.write_text("Separate additional delivery: compare a smaller scope.")
                args += ["--addendum-file", extra]
            self.invoke(*args)

    def stage(self, name, state="succeeded", attempt="primary"):
        self.invoke("packet", "--run", self.run, "--stage", name, "--attempt", attempt)
        report = self.base / f"{name}-{attempt}.md"
        report.write_text("Recommendation: reduce scope. Important remaining uncertainty: actual demand. Synthesis inference: measure demand before expansion.")
        self.invoke("record", "--run", self.run, "--stage", name, "--attempt", attempt, "--state", state, "--report-file", report, "--execution-id", "test-chair-" + attempt)

    def test_complete_local_run_and_frozen_inputs(self):
        self.plan()
        self.assertEqual((self.run / "PROMPT.md").read_bytes(), self.brief.read_bytes())
        self.invoke("packet", "--run", self.run, "--stage", "synthesis", ok=False)
        self.record_seats(addendum=True)
        self.stage("synthesis")
        status = json.loads(self.invoke("status", "--run", self.run).stdout)
        self.assertEqual(status["classification"], "synthesized-local-custom")
        packet = (self.run / "packets/synthesis-primary/STAGE_PROMPT.md").read_text()
        self.assertIn("Separate additional delivery", packet)
        self.assertEqual(packet.count(" — Family X"), 3)
        self.assertTrue((self.run / "SYNTHESIS.md").is_file())
        (self.run / "seat-prompts/skeptic.md").write_text("Changed assignment")
        self.invoke("status", "--run", self.run, ok=False)

    def test_default_members_and_optional_chief(self):
        self.plan()
        seats = json.loads((self.run / "MANIFEST.json").read_text())["seats"]
        self.assertEqual([s["persona"] for s in seats], ["skeptic", "pre-mortem", "completeness-checker"])
        self.run = self.base / "with-chief"
        self.plan("--chief-of-staff")
        seats = json.loads((self.run / "MANIFEST.json").read_text())["seats"]
        self.assertEqual([s["persona"] for s in seats], ["skeptic", "pre-mortem", "completeness-checker", "chief-of-staff"])
        self.record_seats()
        self.invoke("packet", "--run", self.run, "--stage", "synthesis", ok=False)
        report = self.base / "chief.md"
        report.write_text("Protect the principal's time; narrow the pilot before committing.")
        self.invoke("record", "--run", self.run, "--seat", "chief-of-staff", "--state", "succeeded", "--report-file", report, "--execution-id", "test-chief")
        self.stage("synthesis")
        packet = (self.run / "packets/synthesis-primary/STAGE_PROMPT.md").read_text()
        self.assertIn(report.read_text(), packet)
        self.assertEqual(packet.count(" — Family X"), 4)

    def test_requested_adversary_precedes_synthesis(self):
        self.plan("--adversarial")
        self.record_seats()
        self.invoke("packet", "--run", self.run, "--stage", "synthesis", ok=False)
        self.stage("adversary")
        self.stage("synthesis")
        self.assertIn("# Adversarial stage", (self.run / "packets/synthesis-primary/STAGE_PROMPT.md").read_text())

    def test_partial_report_survives_and_blocks_adversary(self):
        self.plan("--adversarial")
        self.record_seats(failed=True)
        self.invoke("packet", "--run", self.run, "--stage", "adversary", ok=False)
        self.stage("synthesis")
        packet = (self.run / "packets/synthesis-primary/STAGE_PROMPT.md").read_text()
        self.assertIn("State: partial", packet)
        self.assertIn("Adversarial review was not performed", packet)

    def test_one_synthesis_fallback_and_no_overwrites(self):
        self.plan()
        self.record_seats()
        self.invoke("packet", "--run", self.run, "--stage", "synthesis", "--attempt", "fallback", ok=False)
        self.stage("synthesis", "failed")
        self.stage("synthesis", "failed", "fallback")
        status = json.loads(self.invoke("status", "--run", self.run).stdout)
        self.assertEqual(status["classification"], "unsynthesized-panel-output")
        self.invoke("record", "--run", self.run, "--stage", "synthesis", "--attempt", "fallback", "--state", "failed", ok=False)
        self.assertFalse((self.run / "SYNTHESIS.md").exists())

    def test_evidence_drift_is_visible(self):
        self.plan("--adversarial")
        self.evidence.write_text("Changed evidence")
        self.record_seats()
        self.invoke("packet", "--run", self.run, "--stage", "adversary", ok=False)
        self.stage("synthesis")
        status = json.loads(self.invoke("status", "--run", self.run).stdout)
        self.assertEqual(status["source_changes"][0]["volatility"], "stable")

    def test_balanced_modes_refuse_before_creating_run(self):
        for mode in ("light", "full"):
            result = self.invoke("plan", "--host", "codex", "--mode", mode, "--brief-file", self.brief, "--output", self.run, ok=False)
            self.assertIn("Antigravity", result.stderr)
            self.assertFalse(self.run.exists())

    def test_new_review_cannot_overwrite_old_archive(self):
        self.plan()
        self.invoke("plan", "--host", "codex", "--brief-file", self.brief, "--output", self.run, ok=False)


if __name__ == "__main__":
    unittest.main(verbosity=2)
