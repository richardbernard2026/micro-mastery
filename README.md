# Micro Mastery

A study site for OpenStax *Principles of Microeconomics 3e*, chapters 1–5.
Each chapter runs Learn → See it → Recall → Practice, with a diagnostic, a missed-questions list and a 25-question final.

## Run it

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Files

- `data.js` — all course content: sections, flashcards, questions, diagnostic, formulas
- `labs.js` — the interactive graphs (SVG, no libraries)
- `app.js` — routing, progress tracking, quizzes and flashcards
- `styles.css` — design tokens and layout, light and dark
- `build.py` — optional: inlines everything into `dist/index.html` as one file

Progress is saved in the browser with `localStorage`, so it stays on that device.

## Deploy

Static site. On Vercel, import the repo with framework preset "Other" and no build command; it serves `index.html` from the root.
