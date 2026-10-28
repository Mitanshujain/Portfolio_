#!/usr/bin/env python3
"""Prepare the reviewed static website for GitHub Pages, excluding private files."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_FILES = (
    "index.html",
    "styles.css",
    "app.js",
    "assets/favicon.svg",
    "assets/mitanshu-jain.jpg",
)


def main():
    destination = ROOT / "docs"
    destination.mkdir(exist_ok=True)
    # Remove stale generated files only within the dedicated Pages folder.
    allowed = set(PUBLIC_FILES) | {".nojekyll"}
    for file in destination.rglob("*"):
        if file.is_file() and file.relative_to(destination).as_posix() not in allowed:
            file.unlink()
    for relative in PUBLIC_FILES:
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(ROOT / "dist" / relative, target)
    (destination / ".nojekyll").write_text("")
    print("Prepared GitHub Pages website without private PDF or hosting configuration.")


if __name__ == "__main__":
    main()
