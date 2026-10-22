#!/usr/bin/env python3
"""Compatibility entry point: one build now generates BOTH clients."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name("build-starter-plugins.py")), run_name="__main__")
