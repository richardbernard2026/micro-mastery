"""Inline the CSS and JS into single-file builds.

dist/index.html     full document (for any static host)
dist/artifact.html  body-only fragment (for a Claude artifact preview)
"""
from pathlib import Path

root = Path(__file__).parent
css = (root / "styles.css").read_text()
js = "\n".join((root / f).read_text() for f in ("data.js", "labs.js", "app.js"))
body = f'<div id="app"></div>\n<script>\n{js}\n</script>\n'
head_meta = '<meta name="description" content="Study OpenStax Principles of Microeconomics 3e, chapters 1 to 5, with interactive graphs, flashcards and practice questions.">'

(root / "dist").mkdir(exist_ok=True)
(root / "dist" / "index.html").write_text(
    '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    f"<title>Micro Mastery</title>\n{head_meta}\n<style>\n{css}\n</style>\n</head>\n<body>\n{body}</body>\n</html>\n"
)
(root / "dist" / "artifact.html").write_text(f"<title>Micro Mastery</title>\n<style>\n{css}\n</style>\n{body}")
print("built", len(css) + len(js), "bytes of source")
