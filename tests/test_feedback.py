"""
Tests for the MkDocs Material feedback widget.

Run with:  pytest tests/test_feedback.py
Requires:  pip install mkdocs-material pytest
"""

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
SITE_DIR = REPO_ROOT / "site"


def build_site():
    """Build the MkDocs site and return the CompletedProcess result."""
    env = {"PYTHONUTF8": "1", "PATH": __import__("os").environ.get("PATH", "")}
    return subprocess.run(
        [sys.executable, "-m", "mkdocs", "build", "--quiet"],
        cwd=REPO_ROOT,
        capture_output=True,
        text=True,
        env=env,
    )


def test_site_builds_successfully():
    """mkdocs build exits with code 0."""
    result = build_site()
    assert result.returncode == 0, (
        f"mkdocs build failed (exit {result.returncode}):\n{result.stderr}"
    )


def test_feedback_form_present_in_built_html():
    """The Material feedback form is rendered on at least one page."""
    # Ensure site is built
    result = build_site()
    assert result.returncode == 0, f"Build failed:\n{result.stderr}"

    html_files = list(SITE_DIR.glob("**/*.html"))
    assert html_files, "No HTML files found in site/ after build"

    found = any(
        'name="feedback"' in f.read_text(encoding="utf-8", errors="ignore")
        for f in html_files
    )
    assert found, (
        "Feedback form (name='feedback') not found in any built HTML page. "
        "Check that analytics.feedback is configured in mkdocs.yml."
    )


def test_feedback_thumbs_up_present():
    """The thumbs-up rating button is present in the built HTML."""
    result = build_site()
    assert result.returncode == 0, f"Build failed:\n{result.stderr}"

    html_files = list(SITE_DIR.glob("**/*.html"))
    found = any(
        "md-feedback__icon" in f.read_text(encoding="utf-8", errors="ignore")
        for f in html_files
    )
    assert found, "Feedback icon buttons (md-feedback__icon) not found in built HTML."


def test_analytics_config_in_mkdocs_yml():
    """mkdocs.yml contains the analytics.feedback configuration under extra."""
    config_text = (REPO_ROOT / "mkdocs.yml").read_text(encoding="utf-8")
    assert "analytics:" in config_text, "No analytics section in mkdocs.yml"
    assert "feedback:" in config_text, "No feedback block in mkdocs.yml"
    assert "thumb-up" in config_text, "Thumbs-up rating missing from mkdocs.yml"
    assert "thumb-down" in config_text, "Thumbs-down rating missing from mkdocs.yml"


def test_custom_analytics_partial_exists():
    """The custom analytics partial that forwards ratings to GoatCounter exists."""
    partial = (
        REPO_ROOT
        / "overrides"
        / "partials"
        / "integrations"
        / "analytics"
        / "custom.html"
    )
    assert partial.exists(), f"Custom analytics partial not found at {partial}"
    content = partial.read_text(encoding="utf-8")
    assert "goatcounter" in content, "GoatCounter integration missing from analytics partial"
    assert "page_rating" in content or "feedback" in content, (
        "Feedback event handling missing from analytics partial"
    )
