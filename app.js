/* Micro Mastery — app shell, routing, progress, quizzes and flashcards. */

(function () {
  "use strict";
  const { h, sv, fill } = MM.util;
  const BOOK = "https://openstax.org/books/principles-microeconomics-3e/pages/";
  const SLUGS = {
    "1.1": "1-1-what-is-economics-and-why-is-it-important",
    "1.2": "1-2-microeconomics-and-macroeconomics",
    "1.3": "1-3-how-economists-use-theories-and-models-to-understand-economic-issues",
    "1.4": "1-4-how-to-organize-economies-an-overview-of-economic-systems",
    "2.1": "2-1-how-individuals-make-choices-based-on-their-budget-constraint",
    "2.2": "2-2-the-production-possibilities-frontier-and-social-choices",
    "2.3": "2-3-confronting-objections-to-the-economic-approach",
    "3.1": "3-1-demand-supply-and-equilibrium-in-markets-for-goods-and-services",
    "3.2": "3-2-shifts-in-demand-and-supply-for-goods-and-services",
    "3.3": "3-3-changes-in-equilibrium-price-and-quantity-the-four-step-process",
    "3.4": "3-4-price-ceilings-and-price-floors",
    "3.5": "3-5-demand-supply-and-efficiency",
    "4.1": "4-1-demand-and-supply-at-work-in-labor-markets",
    "4.2": "4-2-demand-and-supply-in-financial-markets",
    "4.3": "4-3-the-market-system-as-an-efficient-mechanism-for-information",
    "5.1": "5-1-price-elasticity-of-demand-and-price-elasticity-of-supply",
    "5.2": "5-2-polar-cases-of-elasticity-and-constant-elasticity",
    "5.3": "5-3-elasticity-and-pricing",
    "5.4": "5-4-elasticity-in-areas-other-than-price"
  };
  const STEPS = [
    ["learn", "Learn"],
    ["see", "See it"],
    ["recall", "Recall"],
    ["practice", "Practice"]
  ];
  const chapters = MM.chapters;
  const byId = Object.fromEntries(chapters.map((c) => [c.id, c]));

  /* Every question in one lookup, tagged with its chapter. */
  const QUESTIONS = {};
  chapters.forEach((c) => c.questions.forEach((q) => { QUESTIONS[q.id] = Object.assign({ chapter: c.id }, q); }));
  MM.diagnostic.forEach((q) => { QUESTIONS[q.id] = q; });
  const chapterQuestionIds = (chId) => Object.values(QUESTIONS).filter((q) => q.chapter === chId).map((q) => q.id);

  /* ---------------------------------------------------------- storage */
  const KEY = "micro-mastery-v1";
  const fresh = () => ({ results: {}, steps: {}, checks: {}, diagDone: false, theme: null });
  let state = fresh();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = Object.assign(fresh(), JSON.parse(raw));
  } catch (e) { /* storage unavailable: progress lasts for this visit only */ }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function record(q, ok) {
    const prev = state.results[q.id];
    state.results[q.id] = { ok, at: Date.now(), n: (prev ? prev.n : 0) + 1 };
    save();
    refreshChrome();
  }
  function mastery(chId) {
    const ids = chapterQuestionIds(chId);
    const right = ids.filter((id) => state.results[id] && state.results[id].ok).length;
    const seen = ids.filter((id) => state.results[id]).length;
    return { pct: ids.length ? (right / ids.length) * 100 : 0, right, seen, total: ids.length };
  }
  const overall = () => chapters.reduce((t, c) => t + mastery(c.id).pct, 0) / chapters.length;
  const missedIds = () => Object.keys(state.results).filter((id) => QUESTIONS[id] && !state.results[id].ok);
  function markStep(chId, step) {
    state.steps[chId] = state.steps[chId] || {};
    if (!state.steps[chId][step]) { state.steps[chId][step] = true; save(); refreshChrome(); }
  }
  const stepDone = (chId, step) => !!(state.steps[chId] && state.steps[chId][step]);

  /* ---------------------------------------------------------- theme */
  const root = document.documentElement;
  function applyTheme() {
    if (state.theme) root.setAttribute("data-theme", state.theme);
    else root.removeAttribute("data-theme");
  }
  function currentTheme() {
    if (state.theme) return state.theme;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme();

  /* ---------------------------------------------------------- keyboard */
  let keyHandler = null;
  window.addEventListener("keydown", (e) => {
    if (!keyHandler || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target;
    if (t && t.closest && t.closest("input, textarea, select, a, summary")) return;
    keyHandler(e);
  });

  /* ---------------------------------------------------------- shell */
  const ICONS = {
    start: "M4 12h4l3-8 4 16 3-8h2",
    review: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
    exam: "M5 21V4h11l-1.5 4L16 12H5"
  };
  const icon = (d) => sv("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, sv("path", { d }));

  const app = document.getElementById("app");
  const ringFill = sv("circle", { cx: 20, cy: 20, r: 16, class: "fill", fill: "none", "stroke-width": 4, "stroke-linecap": "round" });
  const ringText = h("span", { class: "tnum" }, "0%");
  const ringValue = h("div", { class: "value tnum" }, "0% mastered");
  const themeBtn = h("button", { type: "button", class: "btn small", onClick: () => { state.theme = currentTheme() === "dark" ? "light" : "dark"; save(); applyTheme(); themeBtn.textContent = currentTheme() === "dark" ? "Light" : "Dark"; } }, currentTheme() === "dark" ? "Light" : "Dark");
  const header = h("header", { class: "topbar" },
    h("div", { class: "topbar-inner" },
      h("a", { class: "brand", href: "#home" }, "MICRO MASTERY ", h("span", null, "// OPENSTAX 3E")),
      h("div", { class: "top-right" },
        h("a", { class: "mastery-pill", href: "#home", style: { textDecoration: "none", color: "inherit" }, "aria-label": "Overall mastery" },
          h("div", { class: "ring" },
            sv("svg", { width: 40, height: 40, viewBox: "0 0 40 40" }, sv("circle", { cx: 20, cy: 20, r: 16, class: "track", fill: "none", "stroke-width": 4 }), ringFill),
            ringText),
          h("div", null, h("div", { class: "label" }, "CH 1–5 MASTERY"), ringValue)),
        themeBtn)));

  const nav = h("nav", { class: "nav", "aria-label": "Chapters" });
  const rail = h("aside", { class: "rail" }, nav,
    h("div", { class: "rail-note" },
      h("div", { class: "eyebrow" }, "How to use this"),
      "Each chapter runs Learn → See it → Recall → Practice. Come back a day later and redo Recall and the missed questions. Spacing it out is what makes it stick."));
  const main = h("main", { class: "main", id: "main" });
  const formulaBar = h("div", { class: "formula-bar" },
    h("div", { class: "formula-inner" }, h("span", { class: "eyebrow" }, "Formulas"),
      MM.formulas.map(([k, v]) => h("span", { class: "fchip" }, h("b", null, k), v))));
  app.append(header, h("div", { class: "layout" }, rail, main), formulaBar);

  function navItem(href, key, numEl, title, sub, extra) {
    return h("a", { class: "nav-item", href, "data-key": key }, h("span", { class: "nav-num" }, numEl), h("span", { class: "nav-text" }, h("span", { class: "nav-title" }, title), sub ? h("span", { class: "nav-sub" }, sub) : null), extra || null);
  }
  function drawNav() {
    const missed = missedIds().length;
    fill(nav, 
      h("div", { class: "nav-group" }, "START"),
      navItem("#home", "home", icon(ICONS.start), "Diagnostic and plan", "Where you stand"),
      h("div", { class: "nav-group" }, "CHAPTERS"),
      chapters.map((c) => navItem(`#${c.id}-learn`, c.id, String(c.num).padStart(2, "0"),
        [c.short, c.core ? h("span", { class: "core-tag" }, "CORE") : null], c.sub,
        h("span", { class: "nav-meter", title: `${Math.round(mastery(c.id).pct)}% mastered` }, h("i", { style: { width: mastery(c.id).pct + "%" } })))),
      h("div", { class: "nav-group" }, "TEST YOURSELF"),
      navItem("#review", "review", icon(ICONS.review), "Missed questions", "Redo what you got wrong", missed ? h("span", { class: "nav-badge" }, missed) : null),
      navItem("#final", "final", icon(ICONS.exam), "Final exam", "25 questions · Ch 1–5")
    );
    markNav();
  }
  function markNav() {
    const r = parseRoute();
    nav.querySelectorAll(".nav-item").forEach((a) => {
      if (a.dataset.key === r.page) {
        a.setAttribute("aria-current", "page");
        // On phones the nav is a horizontal strip; keep the current item visible.
        if (nav.scrollWidth > nav.clientWidth) nav.scrollLeft = Math.max(0, a.offsetLeft - 16);
      } else a.removeAttribute("aria-current");
    });
  }
  function refreshChrome() {
    const pct = overall();
    const C = 2 * Math.PI * 16;
    ringFill.setAttribute("stroke-dasharray", C.toFixed(2));
    ringFill.setAttribute("stroke-dashoffset", (C - (pct / 100) * C).toFixed(2));
    ringText.textContent = Math.round(pct) + "%";
    ringValue.textContent = Math.round(pct) + "% mastered";
    drawNav();
  }

  /* ---------------------------------------------------------- routing */
  function parseRoute() {
    const raw = (location.hash || "#home").slice(1);
    const [page, step] = raw.split("-");
    if (Object.prototype.hasOwnProperty.call(byId, page)) return { page, step: STEPS.some(([k]) => k === step) ? step : "learn" };
    if (["home", "review", "final"].includes(page)) return { page };
    return { page: "home" };
  }
  function render() {
    keyHandler = null;
    const r = parseRoute();
    let view;
    if (r.page === "home") view = homePage();
    else if (r.page === "review") view = reviewPage();
    else if (r.page === "final") view = finalPage();
    else view = chapterPage(byId[r.page], r.step);
    fill(main, view);
    markNav();
  }
  window.addEventListener("hashchange", () => { render(); window.scrollTo({ top: 0 }); });

  /* ---------------------------------------------------------- quiz (one at a time) */
  function quiz(opts) {
    const qs = opts.questions;
    let order = qs.map((_, i) => i);
    if (opts.shuffle !== false) order.sort(() => Math.random() - 0.5);
    let i = 0, pick = null, checked = false, score = 0;
    const missed = [];
    const el = h("div", { class: "card stack" });

    function draw() {
      fill(el);
      if (i >= order.length) return finish();
      const q = qs[order[i]];
      const optBtns = q.options.map((o, k) => {
        const b = h("button", { type: "button", class: "option", "aria-pressed": "false" }, h("span", { class: "key" }, k + 1), h("span", null, o));
        b.addEventListener("click", () => select(k));
        return b;
      });
      const fb = h("div");
      const action = h("button", { type: "button", class: "btn primary block", disabled: true }, "Check answer");
      action.addEventListener("click", () => (checked ? next() : check()));
      function paint() {
        optBtns.forEach((b, k) => {
          b.className = "option";
          if (checked) {
            b.disabled = true;
            if (k === q.correct) b.classList.add("correct");
            else if (k === pick) b.classList.add("wrong");
            else b.classList.add("dim");
          } else if (k === pick) b.classList.add("selected");
          b.setAttribute("aria-pressed", String(k === pick));
        });
      }
      function select(k) { if (checked) return; pick = k; action.disabled = false; paint(); }
      function check() {
        if (pick == null) return;
        checked = true;
        const ok = pick === q.correct;
        if (ok) score++; else missed.push(q);
        record(q, ok);
        if (opts.onAnswer) opts.onAnswer(q, ok);
        paint();
        const why = !ok && q.wrong && q.wrong[pick] ? h("p", { style: { marginBottom: "6px" } }, q.wrong[pick]) : null;
        fill(fb, h("div", { class: "feedback " + (ok ? "ok" : "bad") }, h("strong", null, ok ? "Correct." : `Not quite. The answer is ${q.options[q.correct]}.`), why, q.explain));
        action.textContent = i + 1 >= order.length ? "See results" : "Next question";
        action.focus();
      }
      function next() { i++; pick = null; checked = false; draw(); focusPrompt(); }
      keyHandler = (e) => {
        if (/^[1-4]$/.test(e.key) && +e.key <= q.options.length) { e.preventDefault(); select(+e.key - 1); }
        else if (e.key === "Enter" && !(e.target && e.target.closest && e.target.closest("button"))) { e.preventDefault(); if (checked) next(); else check(); }
      };
      el.append(
        h("div", { class: "quiz-top" }, h("span", null, `${opts.label} · ${i + 1} of ${order.length}`), h("span", { class: "tnum" }, `Score ${score}`)),
        h("div", { class: "progress" }, h("i", { style: { width: `${(i / order.length) * 100}%` } })),
        h("div", { class: "quiz-prompt", tabindex: "-1" }, q.prompt),
        h("div", { class: "options" }, optBtns),
        fb, action,
        h("div", { class: "hint" }, "Press 1–4 to choose, Enter to check")
      );
    }
    function focusPrompt() {
      const p = el.querySelector(".quiz-prompt, .result-big");
      if (p) { if (!p.hasAttribute("tabindex")) p.setAttribute("tabindex", "-1"); p.focus({ preventScroll: true }); el.scrollIntoView({ block: "nearest" }); }
    }
    function finish() {
      keyHandler = null;
      const pct = Math.round((score / order.length) * 100);
      if (opts.onFinish) opts.onFinish(score, order.length, missed);
      fill(el, 
        h("div", { class: "eyebrow" }, `${opts.label} · done`),
        h("div", { class: "result-big tnum" }, `${score} / ${order.length}`),
        h("p", { class: "muted" }, pct >= 85 ? "Strong. Come back in a day or two and see if it holds." : pct >= 60 ? "Solid base. Go through the misses below, then retry." : "Worth another pass through Learn and See it before retrying."),
        missed.length ? h("div", { class: "stack" }, h("div", { class: "eyebrow" }, "Review these"),
          missed.map((q) => h("div", { class: "missed-item" }, h("div", { class: "q" }, q.prompt), h("div", null, h("b", null, "Answer: "), q.options[q.correct]), h("div", { class: "muted", style: { marginTop: "4px" } }, q.explain)))) : null,
        h("div", { class: "row" },
          missed.length ? h("button", { type: "button", class: "btn primary", onClick: () => { const m = missed.slice(); el.replaceWith(quiz(Object.assign({}, opts, { questions: m, label: "Retry missed" }))); } }, `Retry the ${missed.length} missed`) : null,
          h("button", { type: "button", class: "btn", onClick: () => el.replaceWith(quiz(opts)) }, "Start over shuffled"),
          opts.after || null)
      );
    }
    draw();
    return el;
  }

  /* ---------------------------------------------------------- checkpoint (inline single question) */
  function checkpoint(chId, sec) {
    const c = sec.check;
    const key = `${chId}:${sec.num}`;
    const box = h("div", { class: "checkpoint" });
    function draw(pick) {
      const answered = pick != null;
      const opts = c.options.map((o, k) => {
        const b = h("button", { type: "button", class: "option" }, h("span", { class: "key" }, String.fromCharCode(65 + k)), h("span", null, o));
        if (answered) {
          b.disabled = true;
          if (k === c.correct) b.classList.add("correct");
          else if (k === pick) b.classList.add("wrong");
          else b.classList.add("dim");
        } else b.addEventListener("click", () => {
          state.checks[key] = { pick: k, ok: k === c.correct };
          save();
          const all = byId[chId].sections.every((s) => state.checks[`${chId}:${s.num}`]);
          if (all) markStep(chId, "learn");
          draw(k);
        });
        return b;
      });
      fill(box, 
        h("div", { class: "eyebrow" }, "Quick check"),
        h("div", { class: "q" }, c.prompt),
        h("div", { class: "options" }, opts),
        answered ? h("div", { class: "feedback " + (pick === c.correct ? "ok" : "bad") }, h("strong", null, pick === c.correct ? "Correct." : "Not quite."), c.explain) : null,
        answered ? h("div", null, h("button", { type: "button", class: "btn small", onClick: () => { delete state.checks[key]; save(); draw(null); } }, "Try again")) : null
      );
    }
    const prev = state.checks[key];
    draw(prev ? prev.pick : null);
    return box;
  }

  /* ---------------------------------------------------------- flashcards */
  function deck(ch) {
    const cards = ch.cards;
    let queue = cards.map((_, i) => i);
    let again = 0, flipped = false;
    const repeats = new Set();
    const el = h("div", { class: "deck" });
    function draw() {
      fill(el);
      if (!queue.length) {
        keyHandler = null;
        markStep(ch.id, "recall");
        el.append(h("div", { class: "card stack" },
          h("div", { class: "eyebrow" }, "Deck done"),
          h("div", { class: "result-big" }, `${cards.length - repeats.size} / ${cards.length}`),
          h("p", { class: "muted" }, repeats.size ? `You knew ${cards.length - repeats.size} on the first try. ${repeats.size} needed another look.` : "Every card on the first try."),
          h("div", { class: "row" },
            h("button", { type: "button", class: "btn", onClick: () => { queue = cards.map((_, i) => i).sort(() => Math.random() - 0.5); repeats.clear(); again = 0; draw(); } }, "Run it again shuffled"),
            h("a", { class: "btn primary", href: `#${ch.id}-practice` }, "Go to practice"))));
        return;
      }
      const idx = queue[0];
      const [front, back] = cards[idx];
      flipped = false;
      const flip = h("div", { class: "flip" });
      const live = h("div", { class: "sr-only", "aria-live": "polite" });
      const inner = h("button", { type: "button", class: "flip-inner", "aria-describedby": "flip-hint" },
        h("div", { class: "face" },
          h("div", { class: "meta" }, h("span", null, `Chapter ${ch.num} · ${ch.cards.length} cards`), h("span", null, "Tap to flip")),
          h("div", { class: "front-text" }, front),
          h("div", { class: "muted", style: { fontSize: "13px" } }, "Say the answer out loud before you flip.")),
        h("div", { class: "face back", "aria-hidden": "true" },
          h("div", { class: "meta" }, h("span", null, front), h("span", null, "Back")),
          h("div", { class: "back-text" }, back),
          h("div")));
      flip.append(inner);
      const btnAgain = h("button", { type: "button", class: "btn", disabled: true }, "Still learning");
      const btnGot = h("button", { type: "button", class: "btn primary", disabled: true }, "Got it");
      const [faceFront, faceBack] = inner.children;
      function doFlip() {
        flipped = !flipped;
        flip.classList.toggle("is-flipped", flipped);
        faceFront.setAttribute("aria-hidden", String(flipped));
        faceBack.setAttribute("aria-hidden", String(!flipped));
        live.textContent = flipped ? back : front;
        btnAgain.disabled = btnGot.disabled = false;
      }
      function rate(knew) {
        queue.shift();
        if (!knew) { repeats.add(idx); queue.splice(Math.min(queue.length, 3), 0, idx); again++; }
        draw();
      }
      inner.addEventListener("click", doFlip);
      btnAgain.addEventListener("click", () => rate(false));
      btnGot.addEventListener("click", () => rate(true));
      keyHandler = (e) => {
        const onOtherControl = e.target && e.target.closest && e.target.closest("button, a") && e.target !== inner;
        if (e.key === " " && !onOtherControl) { e.preventDefault(); doFlip(); }
        else if (e.key === "1" && !btnAgain.disabled) rate(false);
        else if (e.key === "2" && !btnGot.disabled) rate(true);
      };
      el.append(
        h("div", { class: "quiz-top" }, h("span", null, `${queue.length} left`), h("span", null, repeats.size ? `${repeats.size} to repeat` : "")),
        h("div", { class: "progress" }, h("i", { style: { width: `${((cards.length - queue.length) / cards.length) * 100}%` } })),
        flip,
        h("div", { class: "grid-2" }, btnAgain, btnGot),
        live,
        h("div", { class: "hint", id: "flip-hint" }, "Space to flip · 1 still learning · 2 got it"));
    }
    queue.sort(() => Math.random() - 0.5);
    draw();
    return el;
  }

  /* ---------------------------------------------------------- pages */
  function masteryRows() {
    return h("div", null, chapters.map((c) => {
      const m = mastery(c.id);
      const cls = m.seen === 0 ? "" : m.pct >= 75 ? "good" : m.pct >= 45 ? "mid" : "low";
      return h("a", { class: "ch-row", href: `#${c.id}-learn` },
        h("span", { class: "nav-num" }, String(c.num).padStart(2, "0")),
        h("span", { style: { minWidth: 0 } }, h("span", { class: "ch-title" }, c.title), h("span", { class: "nav-sub" }, `${m.right} of ${m.total} questions right · ${STEPS.filter(([k]) => stepDone(c.id, k)).length}/4 steps`)),
        h("span", { class: "bar " + cls }, h("i", { style: { width: m.pct + "%" } })),
        h("span", { class: "pct tnum" }, Math.round(m.pct) + "%"));
    }));
  }

  function homePage() {
    const page = h("div", { class: "page" });
    const hero = h("section", { class: "card hero" },
      h("div", { class: "row" }, h("span", { class: "tag" }, "Diagnostic · 10 questions · about 5 min")),
      h("h1", null, "Where are you actually at?"),
      h("p", { class: "lead" }, "Two questions from each of the first five chapters of Principles of Microeconomics 3e. It scores each chapter separately, then tells you where to start."));
    const rowsBox = h("div", null, masteryRows());
    const plan = h("section", { class: "card stack" },
      h("div", { class: "lab-head" }, h("div", null, h("h3", null, "Your chapters"), h("p", null, "Mastery = share of each chapter's questions you got right on your latest try."))),
      rowsBox);
    const diagBox = h("div");
    function showPlan() {
      const scored = chapters.map((c) => {
        const ids = MM.diagnostic.filter((q) => q.chapter === c.id).map((q) => q.id);
        const right = ids.filter((id) => state.results[id] && state.results[id].ok).length;
        return { c, right, total: ids.length };
      });
      const weak = scored.filter((x) => x.right < x.total).sort((a, b) => a.right / a.total - b.right / b.total);
      fill(rowsBox, masteryRows());
      const first = weak.length ? weak[0].c : chapters.find((c) => mastery(c.id).pct < 100) || chapters[0];
      fill(diagBox, h("section", { class: "card stack" },
        h("div", { class: "eyebrow" }, "Diagnostic results"),
        h("div", { class: "table-wrap" }, h("table", { class: "table" },
          h("thead", null, h("tr", null, h("th", null, "Chapter"), h("th", { class: "num" }, "Right"), h("th", null, "Next move"))),
          h("tbody", null, scored.map((x) => h("tr", null,
            h("td", null, `${x.c.num}. ${x.c.short}`),
            h("td", { class: "num tnum" }, `${x.right} / ${x.total}`),
            h("td", null, x.right === x.total ? "Confirm with Practice" : x.right === 0 ? "Start with Learn" : "Do See it, then Practice")))))),
        h("div", { class: "row" },
          h("a", { class: "btn primary", href: `#${first.id}-learn` }, `Start with Chapter ${first.num}: ${first.short}`),
          h("button", { type: "button", class: "btn", onClick: () => { state.diagDone = false; save(); drawDiag(); } }, "Retake diagnostic"))));
    }
    function drawDiag() {
      if (state.diagDone) return showPlan();
      fill(diagBox, quiz({ questions: MM.diagnostic, label: "Diagnostic", shuffle: false,
        onFinish: () => { state.diagDone = true; save(); setTimeout(showPlan, 0); } }));
    }
    drawDiag();
    page.append(hero, diagBox, plan);
    return page;
  }

  function chapterPage(ch, step) {
    const page = h("div", { class: "page" });
    page.append(h("section", { class: "card hero" + (ch.core ? " core" : "") },
      h("div", { class: "row" },
        h("span", { class: "tag" }, `Chapter ${ch.num}`),
        ch.core ? h("span", { class: "tag core" }, "Core chapter") : null,
        h("a", { class: "tag", href: `${BOOK}${ch.num}-introduction`, target: "_blank", rel: "noopener" }, "Open in OpenStax ↗")),
      h("h1", null, ch.title),
      h("p", { class: "lead" }, ch.bigIdea)));

    page.append(h("nav", { class: "steps", "aria-label": "Chapter steps" },
      STEPS.map(([k, label], i) => h("a", { class: "step", href: `#${ch.id}-${k}`, "aria-current": k === step ? "step" : null },
        h("span", { class: "n" }, String(i + 1).padStart(2, "0")), h("span", { class: "t" }, label),
        stepDone(ch.id, k) ? h("span", { class: "done", "aria-label": "done" }, "✓") : null))));

    if (step === "learn") {
      ch.sections.forEach((sec) => page.append(sectionCard(ch, sec)));
    } else if (step === "see") {
      markStep(ch.id, "see");
      ch.labs.forEach((id) => page.append(MM.labs[id].make()));
    } else if (step === "recall") {
      page.append(h("div", { class: "lab-head" }, h("div", null, h("h3", null, `${ch.cards.length} flashcards`), h("p", null, "Try to answer before you flip. Cards you mark \"still learning\" come back a few cards later."))));
      page.append(deck(ch));
    } else {
      const m = mastery(ch.id);
      page.append(h("div", { class: "lab-head" }, h("div", null, h("h3", null, `${ch.questions.length} practice questions`), h("p", null, `Every wrong answer explains why. Current mastery: ${Math.round(m.pct)}%.`))));
      page.append(quiz({ questions: ch.questions, label: `Chapter ${ch.num}`, onFinish: () => markStep(ch.id, "practice"),
        after: nextChapterLink(ch) }));
    }
    const idx = STEPS.findIndex(([k]) => k === step);
    const nextStep = STEPS[idx + 1];
    if (nextStep) page.append(h("div", { class: "row", style: { justifyContent: "flex-end" } }, h("a", { class: "btn primary", href: `#${ch.id}-${nextStep[0]}` }, `Next: ${nextStep[1]} →`)));
    return page;
  }
  function nextChapterLink(ch) {
    const nxt = chapters[chapters.indexOf(ch) + 1];
    return nxt ? h("a", { class: "btn", href: `#${nxt.id}-learn` }, `Chapter ${nxt.num} →`) : h("a", { class: "btn", href: "#final" }, "Final exam →");
  }
  function sectionCard(ch, sec) {
    return h("section", { class: "card section-card", id: `s${sec.num.replace(".", "-")}` },
      h("div", { class: "section-head" }, h("span", { class: "section-num" }, sec.num), h("h2", null, sec.title)),
      h("p", { class: "idea" }, sec.idea),
      h("dl", { class: "terms" }, sec.points.map(([t, d]) => h("div", { class: "term" }, h("dt", null, t), h("dd", null, d)))),
      sec.formula ? h("div", { class: "formula" }, sec.formula) : null,
      h("div", { class: "callouts" },
        h("div", { class: "callout example" }, h("div", { class: "eyebrow" }, "Example"), sec.example),
        h("div", { class: "callout trap" }, h("div", { class: "eyebrow" }, "Exam trap"), sec.trap)),
      checkpoint(ch.id, sec),
      h("div", null, h("a", { class: "muted", style: { fontSize: "12.5px" }, href: BOOK + SLUGS[sec.num], target: "_blank", rel: "noopener" }, `Read ${sec.num} in the book ↗`)));
  }

  function reviewPage() {
    const page = h("div", { class: "page" });
    const ids = missedIds();
    page.append(h("section", { class: "card hero" },
      h("div", { class: "row" }, h("span", { class: "tag" }, `${ids.length} to redo`)),
      h("h1", null, "Missed questions"),
      h("p", { class: "lead" }, "Anything you got wrong on your latest try lands here, from any chapter. Get it right and it leaves the list.")));
    if (!ids.length) {
      page.append(h("div", { class: "card stack" }, h("p", null, "Nothing to redo right now. Take the diagnostic or a chapter's practice set and anything you miss will show up here."), h("div", null, h("a", { class: "btn primary", href: "#home" }, "Go to the diagnostic"))));
      return page;
    }
    const qs = ids.map((id) => QUESTIONS[id]).sort((a, b) => a.chapter.localeCompare(b.chapter));
    page.append(quiz({ questions: qs, label: "Missed", onFinish: () => setTimeout(refreshChrome, 0) }));
    return page;
  }

  function finalPage() {
    const page = h("div", { class: "page" });
    const timerText = h("span", { class: "mono tnum" }, "20:00");
    let deadline = 0, timer = null;
    const hero = h("section", { class: "card hero" },
      h("div", { class: "row" }, h("span", { class: "tag ink" }, "Exam mode"), h("span", { class: "tag" }, "25 questions · Ch 1–5 · no hints until you submit")),
      h("h1", null, "Final exam"),
      h("p", { class: "lead" }, "Five questions from each chapter, drawn fresh every time. Answer everything, then submit to see your breakdown."),
      h("div", { class: "row" },
        h("button", { type: "button", class: "btn primary", onClick: (e) => { startTimer(); e.currentTarget.textContent = "Restart 20:00 timer"; } }, "Start 20:00 timer"),
        h("span", { class: "btn", style: { cursor: "default" } }, timerText)));
    function tick() {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      timerText.textContent = left === 0 ? "Time's up" : `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
      return left;
    }
    function startTimer() {
      clearInterval(timer);
      deadline = Date.now() + 20 * 60 * 1000; // wall-clock deadline survives background tabs
      tick();
      timer = setInterval(() => {
        if (!document.body.contains(timerText)) return clearInterval(timer);
        if (tick() === 0) clearInterval(timer);
      }, 500);
    }
    page.append(hero, exam());
    return page;
  }
  function pickExam() {
    const out = [];
    chapters.forEach((c) => {
      const pool = c.questions.slice().sort(() => Math.random() - 0.5).slice(0, 5);
      pool.forEach((q) => out.push(Object.assign({ chapter: c.id }, q)));
    });
    return out.sort(() => Math.random() - 0.5);
  }
  function exam() {
    const qs = pickExam();
    const answers = {};
    const el = h("div", { class: "stack" });
    const submit = h("button", { type: "button", class: "btn primary block", disabled: true });
    function counter() {
      const n = Object.keys(answers).length;
      submit.textContent = n < qs.length ? `Answer all to submit · ${n} of ${qs.length}` : "Submit exam";
      submit.disabled = n < qs.length;
    }
    qs.forEach((q, i) => {
      const btns = q.options.map((o, k) => {
        const b = h("button", { type: "button", class: "option", "aria-pressed": "false" }, h("span", { class: "key" }, k + 1), h("span", null, o));
        b.addEventListener("click", () => {
          answers[i] = k;
          btns.forEach((x, j) => { x.classList.toggle("selected", j === k); x.setAttribute("aria-pressed", String(j === k)); });
          counter();
        });
        return b;
      });
      el.append(h("div", { class: "card stack" },
        h("div", { class: "quiz-top" }, h("span", null, `Q${i + 1} · Chapter ${byId[q.chapter].num}`)),
        h("div", { class: "quiz-prompt", style: { fontSize: "15.5px" } }, q.prompt),
        h("div", { class: "options" }, btns)));
    });
    submit.addEventListener("click", () => {
      const by = {};
      let score = 0;
      qs.forEach((q, i) => {
        const ok = answers[i] === q.correct;
        record(q, ok);
        if (ok) score++;
        by[q.chapter] = by[q.chapter] || { r: 0, t: 0 };
        by[q.chapter].t++;
        if (ok) by[q.chapter].r++;
      });
      const pct = Math.round((score / qs.length) * 100);
      const res = h("div", { class: "stack" },
        h("section", { class: "card stack" },
          h("div", { class: "eyebrow" }, "Exam results"),
          h("div", { class: "result-big tnum" }, `${score} / ${qs.length} · ${pct}%`),
          h("p", { class: "muted" }, pct >= 80 ? "Chapters 1–5 are in good shape. Retake it in a few days to make sure it sticks." : "Start with your lowest chapter below. Its See it and Practice steps are the fastest fix."),
          h("div", null, chapters.map((c) => {
            const b = by[c.id] || { r: 0, t: 1 };
            const p = (b.r / b.t) * 100;
            return h("a", { class: "ch-row", href: `#${c.id}-see` },
              h("span", { class: "nav-num" }, String(c.num).padStart(2, "0")),
              h("span", { class: "ch-title" }, c.short),
              h("span", { class: "bar " + (p >= 75 ? "good" : p >= 45 ? "mid" : "low") }, h("i", { style: { width: p + "%" } })),
              h("span", { class: "pct tnum" }, `${b.r}/${b.t}`));
          })),
          h("div", { class: "row" }, h("button", { type: "button", class: "btn primary", onClick: () => res.replaceWith(exam()) }, "New exam"), h("a", { class: "btn", href: "#review" }, "Redo missed questions"))),
        qs.map((q, i) => {
          const ok = answers[i] === q.correct;
          return h("div", { class: "missed-item", style: { background: ok ? "var(--good-soft)" : "var(--bad-soft)" } },
            h("div", { class: "q" }, `${i + 1}. ${q.prompt}`),
            h("div", null, `Your answer: ${q.options[answers[i]]}${ok ? "" : ` · Correct: ${q.options[q.correct]}`}`),
            h("div", { class: "muted", style: { marginTop: "4px" } }, q.explain));
        }));
      el.replaceWith(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    counter();
    el.append(submit);
    return el;
  }

  /* ---------------------------------------------------------- boot */
  refreshChrome();
  render();
})();
