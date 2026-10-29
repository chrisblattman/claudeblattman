#!/usr/bin/env python3
"""Offline packaging, parity, and council failure-path tests; no model calls."""
import json
import shutil
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PYTHON = sys.executable
NAMES = {"adversarial-review", "council", "kit-hello", "kit-setup", "ask-agents", "prompt", "done"}


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
            call(PYTHON, ROOT / "scripts/build-all-plugins.py", "--check", "--package-dir", temp)
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
                    for persona in ("skeptic", "pre-mortem", "completeness-checker", "chief-of-staff"):
                        matches = [n for n in names if n.endswith("/" + persona + ".md")]
                        self.assertEqual(matches, [f"{root}/shared/personas/{persona}.md"])
                    self.assertFalse(any("install-codex-starter" in n for n in names))

    def test_generated_parity_and_inventory(self):
        call(PYTHON, ROOT / "scripts/build-all-plugins.py", "--check")
        for root in (ROOT / "plugins/starter-kit-claude", ROOT / "plugins/starter-kit-codex"):
            self.assertEqual({p.name for p in (root / "skills").iterdir()}, NAMES)
            for name in NAMES:
                expected = ROOT / "starter-kit-source/skills" / name / "SKILL.md"
                self.assertEqual((root / "skills" / name / "SKILL.md").read_bytes(), expected.read_bytes())
            for name in ("council", "adversarial-review"):
                refs = root / "skills" / name / "references"
                self.assertTrue((refs / "panel-execution.md").is_file())
                self.assertTrue((refs / "council-synthesis.md").is_file())
                self.assertFalse((refs / "quality-contract.md").exists())
                self.assertFalse((refs / "synthesis.md").exists())
                self.assertFalse((refs / "panel-workflow.md").exists())
                self.assertIn("references/panel-execution.md", (root / "skills" / name / "SKILL.md").read_text())
            for name in ("formatting-core.md", "refine-mode.md"):
                self.assertEqual((root / "skills/prompt/references" / name).read_bytes(), (ROOT / "starter-kit-source/skills/prompt/references" / name).read_bytes())
            for name in ("skeptic", "pre-mortem", "completeness-checker", "chief-of-staff"):
                self.assertEqual((root / "shared/personas" / (name + ".md")).read_bytes(), (ROOT / "starter-kit-source/agents" / (name + ".md")).read_bytes())

    def test_shared_workflow_files_match_between_hosts(self):
        claude = ROOT / "plugins/starter-kit-claude"
        codex = ROOT / "plugins/starter-kit-codex"
        for name in NAMES:
            left = {str(p.relative_to(claude / "skills" / name)): p.read_bytes() for p in (claude / "skills" / name).rglob("*") if p.is_file() and p.name != "host.md"}
            right = {str(p.relative_to(codex / "skills" / name)): p.read_bytes() for p in (codex / "skills" / name).rglob("*") if p.is_file() and p.name != "host.md"}
            self.assertEqual(left, right)
        for plugin in (claude, codex):
            persona_files = list(plugin.rglob("skeptic.md"))
            self.assertEqual(persona_files, [plugin / "shared/personas/skeptic.md"])
            self.assertEqual(len(list((plugin / "shared/personas").glob("*.md"))), 4)



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
        self.invoke("plan", "--host", "codex", "--settings", self.base / "settings.json", "--brief-file", self.brief, "--output", self.run, "--evidence", self.evidence, *extra)

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

    def test_persona_wrapper_keeps_common_prompt_and_freezes_linked_guidelines(self):
        self.brief.write_text("# Task\n\nConsider A or B—neither is settled.\n\nKeep the final newline.\n")
        for host in ("claude", "codex"):
            for workflow in ("council", "adversarial-review"):
                with self.subTest(host=host, workflow=workflow):
                    self.helper = ROOT / f"plugins/starter-kit-{host}/skills/{workflow}/scripts/council.py"
                    self.run = self.base / f"{host}-{workflow}"
                    self.invoke("plan", "--host", host, "--mode", "local", "--brief-file", self.brief, "--output", self.run)
                    manifest = json.loads((self.run / "MANIFEST.json").read_text())
                    self.assertEqual((self.run / "PROMPT.md").read_bytes(), self.brief.read_bytes())
                    for seat in manifest["seats"]:
                        assignment = (self.run / seat["prompt"]).read_text()
                        guidelines = (self.run / seat["persona_guidelines"]).resolve()
                        original = ROOT / f"plugins/starter-kit-{host}/shared/personas/{seat['persona']}.md"
                        self.assertIn(self.brief.read_text(), assignment)
                        self.assertIn(f"[persona guidelines](<{guidelines}>)", assignment)
                        self.assertEqual(guidelines.read_bytes(), original.read_bytes())
                        self.assertNotIn(original.read_text(), assignment)
                        self.assertIn(seat["persona_guidelines"], manifest["frozen_files"])
                    # Role-file drift must be caught just like a changed shared brief.
                    guidelines.write_text("Changed role instructions")
                    self.invoke("status", "--run", self.run, ok=False)

    def test_switching_to_providers_preserves_prompt_without_personas(self):
        self.plan()
        original = (self.run / "PROMPT.md").read_bytes()
        self.run = self.base / "providers"
        self.plan("--providers", "claude,codex")
        self.assertEqual((self.run / "PROMPT.md").read_bytes(), original)
        self.assertFalse((self.run / "persona-guidelines").exists())
        manifest = json.loads((self.run / "MANIFEST.json").read_text())
        for seat in manifest["seats"]:
            assignment = (self.run / seat["prompt"]).read_text()
            self.assertIn(original.decode(), assignment)
            self.assertIsNone(seat["persona_guidelines"])
            self.assertNotIn("## Persona wrapper", assignment)
            self.assertNotIn("[persona guidelines]", assignment)

    def test_quality_contract_reaches_all_seats_and_chair_stages_unchanged(self):
        source = (ROOT / "starter-kit-source/skills/council/references/council-synthesis.md").read_text()
        expected = source.split("## Quality and revision contract\n", 1)[1].split("\n## ", 1)[0].strip()
        for host in ("claude", "codex"):
            for mode in ("local", "full"):
                with self.subTest(host=host, mode=mode):
                    self.helper = ROOT / f"plugins/starter-kit-{host}/skills/council/scripts/council.py"
                    self.run = self.base / f"quality-{host}-{mode}"
                    self.invoke("plan", "--host", host, "--mode", mode, "--adversarial", "--brief-file", self.brief, "--output", self.run)
                    manifest = json.loads((self.run / "MANIFEST.json").read_text())
                    self.assertEqual((self.run / "PROMPT.md").read_bytes(), self.brief.read_bytes())
                    self.assertIn(expected, (self.run / "QUALITY_CONTRACT.md").read_text())
                    self.assertEqual((self.run / "COUNCIL_SYNTHESIS.md").read_text(), source)
                    self.assertIn("QUALITY_CONTRACT.md", manifest["frozen_files"])
                    for seat in manifest["seats"]:
                        self.assertIn(expected, (self.run / seat["prompt"]).read_text())
                        report = self.base / f"{seat['id']}-quality-report.md"
                        report.write_text("Evidence supports the small pilot; demand remains uncertain.")
                        self.invoke("record", "--run", self.run, "--seat", seat["id"], "--state", "succeeded", "--report-file", report, "--execution-id", "fixture-" + seat["id"])
                    self.stage("adversary")
                    self.stage("synthesis", "failed")
                    self.stage("synthesis", "succeeded", "fallback")
                    for stage in ("adversary-primary", "synthesis-primary", "synthesis-fallback"):
                        packet = (self.run / "packets" / stage / "STAGE_PROMPT.md").read_text()
                        self.assertIn(expected, packet)
                        self.assertNotIn("[original input]", packet)
                        if stage.startswith("synthesis"):
                            for heading in ("FULL CONSENSUS", "MATERIAL DISAGREEMENTS", "UNIQUE HIGH-VALUE FINDINGS", "ADVERSARIAL FINDINGS", "FAILED OR DEGRADED ARMS", "RECOMMENDED RESOLUTION"):
                                self.assertIn(heading, packet)
                            self.assertIn("Separate sourced fact, report judgment, and synthesis inference", packet)
                            self.assertIn('Report “applied” separately from “verified.”', packet)
                        else:
                            self.assertIn("What a synthesizer must not smooth over", packet)
                    (self.run / "QUALITY_CONTRACT.md").write_text("Changed criteria")
                    self.invoke("status", "--run", self.run, ok=False)

    def test_missing_canonical_section_fails_before_archive(self):
        installed = self.base / "fixture-plugin"
        shutil.copytree(ROOT / "plugins/starter-kit-codex", installed)
        self.helper = installed / "skills/council/scripts/council.py"
        reference = installed / "skills/council/references/council-synthesis.md"
        reference.write_text(reference.read_text().replace("## Fresh synthesis prompt", "## Missing synthesis"))
        self.invoke("plan", "--host", "codex", "--mode", "local", "--brief-file", self.brief, "--output", self.run, ok=False)
        self.assertFalse(self.run.exists())

    def test_planned_chair_instructions_survive_installed_reference_update(self):
        installed = self.base / "fixture-plugin"
        shutil.copytree(ROOT / "plugins/starter-kit-codex", installed)
        self.helper = installed / "skills/council/scripts/council.py"
        self.plan("--adversarial")
        reference = installed / "skills/council/references/council-synthesis.md"
        reference.write_text("New installation with different instructions.")
        self.record_seats()
        self.stage("adversary")
        self.stage("synthesis")
        for name, frozen in (("adversary", "ADVERSARY_INSTRUCTIONS.md"), ("synthesis", "SYNTHESIS_INSTRUCTIONS.md")):
            packet = (self.run / "packets" / (name + "-primary") / "STAGE_PROMPT.md").read_text()
            self.assertIn((self.run / frozen).read_text(), packet)
            self.assertNotIn("New installation", packet)

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

    def test_provider_modes_and_exact_custom_seats(self):
        for mode, count in (("light", 3), ("full", 6)):
            self.run = self.base / mode
            self.plan("--mode", mode)
            manifest = json.loads((self.run / "MANIFEST.json").read_text())
            self.assertEqual(len(manifest["seats"]), count)
            self.assertEqual(manifest["adversarial_requested"], mode == "full")
        self.run = self.base / "custom"
        self.plan("--providers", "grok,codex,grok")
        manifest = json.loads((self.run / "MANIFEST.json").read_text())
        self.assertEqual([s["provider"] for s in manifest["seats"]], ["grok", "codex", "grok"])
        self.assertTrue(all(s["persona"] is None for s in manifest["seats"]))

    def test_review_has_four_fresh_required_seats(self):
        self.helper = ROOT / "plugins/starter-kit-codex/skills/adversarial-review/scripts/council.py"
        self.plan()
        manifest = json.loads((self.run / "MANIFEST.json").read_text())
        self.assertEqual(manifest["workflow"], "adversarial-review")
        self.assertEqual(len(manifest["seats"]), 4)
        self.record_seats()
        self.invoke("packet", "--run", self.run, "--stage", "synthesis", ok=False)
        self.invoke("record", "--run", self.run, "--seat", "chief-of-staff", "--state", "blocked", "--note", "Native worker unavailable")
        self.stage("synthesis")
        status = json.loads(self.invoke("status", "--run", self.run).stdout)
        self.assertEqual(status["classification"], "synthesized-with-limitations")
        self.assertEqual(status["planned"], 4)
        self.assertEqual(status["succeeded"], 3)

    def test_preferences_persist_and_explicit_requests_win(self):
        settings = self.base / "settings.json"
        settings.write_text(json.dumps({"schema_version": 1, "other": {"keep": True}}))
        self.invoke("preferences", "set", "--settings", settings, "--providers", "claude,grok")
        original = settings.read_bytes()
        self.plan()
        self.assertEqual([s["provider"] for s in json.loads((self.run / "MANIFEST.json").read_text())["seats"]], ["claude", "grok"])
        self.run = self.base / "explicit"
        self.plan("--mode", "local")
        self.assertEqual(len(json.loads((self.run / "MANIFEST.json").read_text())["seats"]), 3)
        # Simulate replacing plugin contents; settings live outside either plugin.
        for source in (ROOT / "plugins/starter-kit-claude", ROOT / "plugins/starter-kit-codex"):
            installed = self.base / "installed-plugin"
            for _ in range(2):
                if installed.exists():
                    shutil.rmtree(installed)
                shutil.copytree(source, installed)
                shown = json.loads(call(PYTHON, installed / "skills/council/scripts/council.py", "preferences", "show", "--settings", settings).stdout)
                self.assertEqual(shown["effective_panel"]["providers"], ["claude", "grok"])
            shutil.rmtree(installed)
        self.assertEqual(settings.read_bytes(), original)
        self.invoke("preferences", "reset", "--settings", settings)
        self.assertEqual(json.loads(settings.read_text())["other"], {"keep": True})
        self.assertNotIn("panel", json.loads(settings.read_text()))
        self.assertEqual(len(list(self.base.glob("settings.json.backup-*"))), 2)
        self.run = self.base / "reset"
        self.plan()
        self.assertEqual(len(json.loads((self.run / "MANIFEST.json").read_text())["seats"]), 3)

    def test_invalid_provider_or_settings_fails_without_archive(self):
        self.invoke("plan", "--host", "codex", "--providers", "unknown", "--brief-file", self.brief, "--output", self.run, ok=False)
        self.assertFalse(self.run.exists())
        bad = self.base / "bad.json"
        bad.write_text('{"schema_version":1,"panel":{"mode":"custom","providers":[]}}')
        self.invoke("plan", "--host", "codex", "--settings", bad, "--brief-file", self.brief, "--output", self.run, ok=False)
        self.assertFalse(self.run.exists())

    def test_mixed_family_packet_retains_failures_without_claiming_complete(self):
        self.plan("--providers", "claude,grok")
        report = self.base / "answer.md"
        report.write_text("A material finding with original evidence.")
        self.invoke("record", "--run", self.run, "--seat", "claude-1", "--state", "succeeded", "--report-file", report, "--execution-id", "fixture-session")
        self.invoke("record", "--run", self.run, "--seat", "grok-2", "--state", "blocked", "--note", "Login unavailable")
        self.stage("synthesis")
        result = json.loads(self.invoke("status", "--run", self.run).stdout)
        self.assertEqual(result["classification"], "synthesized-with-limitations")
        self.assertIn("Login unavailable", (self.run / "packets/synthesis-primary/STAGE_PROMPT.md").read_text())

    def test_new_review_cannot_overwrite_old_archive(self):
        self.plan()
        self.invoke("plan", "--host", "codex", "--brief-file", self.brief, "--output", self.run, ok=False)


if __name__ == "__main__":
    unittest.main(verbosity=2)
