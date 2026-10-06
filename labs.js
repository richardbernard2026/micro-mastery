/* Micro Mastery — DOM helpers and the interactive labs.
   Every lab is a function that returns a self-contained element. */

window.MM = window.MM || {};

(function () {
  "use strict";

  /* ---------------------------------------------------------- helpers */
  const NS = "http://www.w3.org/2000/svg";

  function setProps(el, props, isSvg) {
    if (!props) return;
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "class") {
        if (isSvg) el.setAttribute("class", v);
        else el.className = v;
      } else if (k === "text") {
        el.textContent = v;
      } else if (k === "style" && typeof v === "object") {
        Object.assign(el.style, v);
      } else if (k.startsWith("on") && typeof v === "function") {
        el.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (v === true) {
        el.setAttribute(k, "");
      } else {
        el.setAttribute(k, v);
      }
    }
  }
  function addKids(el, kids) {
    for (const k of kids.flat(Infinity)) {
      if (k == null || k === false) continue;
      el.append(k instanceof Node ? k : document.createTextNode(String(k)));
    }
  }
  /* Replace an element's children, skipping null/false and flattening arrays. */
  function fill(el, ...kids) {
    el.textContent = "";
    addKids(el, kids);
    return el;
  }
  function h(tag, props, ...kids) {
    const el = document.createElement(tag);
    setProps(el, props, false);
    addKids(el, kids);
    return el;
  }
  function sv(tag, props, ...kids) {
    const el = document.createElementNS(NS, tag);
    setProps(el, props, true);
    addKids(el, kids);
    return el;
  }
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const round = (v, d = 0) => { const f = 10 ** d; return Math.round(v * f) / f; };
  const fmtNum = (v, d = 0) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const money = (v, d = 2) => "$" + fmtNum(v, d);
  const arrow = (a, b) => (b > a + 1e-9 ? "↑" : b < a - 1e-9 ? "↓" : "→");
  const reduceMotion = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Polygon area (shoelace). Points are [x, y]. */
  function area(pts) {
    let s = 0;
    for (let i = 0; i < pts.length; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[(i + 1) % pts.length];
      s += x1 * y2 - x2 * y1;
    }
    return Math.abs(s) / 2;
  }

  /* Small tween used to animate curve shifts. */
  function tween(from, to, ms, onFrame, onDone) {
    if (reduceMotion() || ms <= 0) { onFrame(to); if (onDone) onDone(); return () => {}; }
    const t0 = performance.now();
    const keys = Object.keys(to);
    let raf = 0;
    function step(now) {
      const t = clamp((now - t0) / ms, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      const cur = {};
      keys.forEach((k) => { cur[k] = from[k] + (to[k] - from[k]) * e; });
      onFrame(cur);
      if (t < 1) raf = requestAnimationFrame(step);
      else if (onDone) onDone();
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }

  /* Chart frame: axes, ticks and a dynamic layer that labs redraw. */
  function frame(o) {
    const W = o.w || 440, H = o.h || 320;
    const m = Object.assign({ l: 54, r: 18, t: 16, b: 42 }, o.margin || {});
    const pw = W - m.l - m.r, ph = H - m.t - m.b;
    const X = (v) => m.l + (v / o.xMax) * pw;
    const Y = (v) => m.t + ph - (v / o.yMax) * ph;
    const clipId = "clip" + Math.random().toString(36).slice(2, 8);
    const svg = sv("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": o.aria || "Graph" });
    svg.append(sv("defs", null, sv("clipPath", { id: clipId }, sv("rect", { x: m.l, y: m.t, width: pw, height: ph }))));

    const grid = sv("g");
    (o.yTicks || []).forEach((t) => {
      grid.append(sv("line", { class: "gridline", x1: m.l, x2: m.l + pw, y1: Y(t.v), y2: Y(t.v) }));
      grid.append(sv("text", { x: m.l - 8, y: Y(t.v) + 4, "text-anchor": "end", class: "tnum" }, t.label));
    });
    (o.xTicks || []).forEach((t) => {
      grid.append(sv("text", { x: X(t.v), y: m.t + ph + 16, "text-anchor": "middle", class: "tnum" }, t.label));
    });
    svg.append(grid);
    svg.append(sv("line", { class: "axis", x1: m.l, y1: m.t + ph, x2: m.l + pw, y2: m.t + ph }));
    svg.append(sv("line", { class: "axis", x1: m.l, y1: m.t, x2: m.l, y2: m.t + ph }));
    svg.append(sv("text", { x: m.l + pw, y: H - 6, "text-anchor": "end", class: "lbl-strong" }, o.xLabel || ""));
    svg.append(sv("text", { x: 12, y: m.t + ph / 2, "text-anchor": "middle", class: "lbl-strong", transform: `rotate(-90 12 ${m.t + ph / 2})` }, o.yLabel || ""));

    const under = sv("g", { "clip-path": `url(#${clipId})` });
    const over = sv("g");
    svg.append(under, over);

    function toData(evt) {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const p = pt.matrixTransform(ctm.inverse());
      return { x: ((p.x - m.l) / pw) * o.xMax, y: ((m.t + ph - p.y) / ph) * o.yMax };
    }
    function clear() { fill(under); fill(over); }
    return { svg, X, Y, under, over, clear, toData, m, pw, ph, W, H };
  }

  /* Line through a function q = f(p), clipped to the chart box. */
  function curvePoints(F, f, pMax, qMax) {
    const pts = [];
    for (let i = 0; i <= 200; i++) {
      const p = (i / 200) * pMax;
      const q = f(p);
      if (q >= -0.5 && q <= qMax + 0.5) pts.push(`${F.X(q).toFixed(1)},${F.Y(p).toFixed(1)}`);
    }
    return pts.join(" ");
  }

  function labShell(title, blurb, extraHead, body) {
    return h("section", { class: "card lab" },
      h("div", { class: "lab-head" },
        h("div", null, h("h3", null, title), blurb ? h("p", null, blurb) : null),
        extraHead || null
      ),
      body
    );
  }
  function seg(options, value, onChange) {
    const wrap = h("div", { class: "seg", role: "group" });
    function draw(cur) {
      fill(wrap, ...options.map(([v, label]) =>
        h("button", { type: "button", "aria-pressed": String(v === cur), onClick: () => { draw(v); onChange(v); } }, label)
      ));
    }
    draw(value);
    return wrap;
  }
  function stat(k, v, s) {
    return h("div", { class: "stat" }, h("div", { class: "k" }, k), h("div", { class: "v" }, v), s ? h("div", { class: "s" }, s) : null);
  }
  function slider(id, label, min, max, step, value, fmt, onInput) {
    const out = h("b", null, fmt(value));
    const input = h("input", { id, type: "range", min, max, step, value, onInput: (e) => { const v = +e.target.value; out.textContent = fmt(v); onInput(v); } });
    return h("label", { class: "field", for: id }, h("span", { class: "top" }, h("span", null, label), out), input);
  }
  function numField(id, label, value, onInput, attrs) {
    return h("label", { class: "field", for: id }, h("span", null, label),
      h("input", Object.assign({ id, type: "number", value, inputmode: "decimal", onInput: (e) => onInput(+e.target.value || 0) }, attrs || {})));
  }

  /* ================================================================
     CH 1 — Circular flow diagram
     ================================================================ */
  function circularFlow() {
    const scenes = [
      { id: "buy", label: "You buy a burrito", on: ["goods", "spend"], text: "In the goods and services market, the taqueria (a firm) hands you the burrito and you pay for it. Real stuff flows one way, money flows the other." },
      { id: "work", label: "You work a shift and get paid", on: ["labor", "wages"], text: "In the labor market, you (a household) supply your time to a firm. The firm pays you wages." },
      { id: "hire", label: "A bakery hires two workers", on: ["labor", "wages"], text: "The bakery is buying labor. That's the labor market, with the firm on the demand side." },
      { id: "all", label: "Show the whole loop", on: ["goods", "spend", "labor", "wages"], text: "The wages households earn in the labor market become the spending that flows back to firms in the goods market. That's why it's a circle." }
    ];
    const W = 640, H = 360;
    const svg = sv("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "Circular flow diagram" });
    const defs = sv("defs");
    [["mk-off", "var(--border)"], ["mk-on", "var(--text)"], ["mk-money", "var(--core)"]].forEach(([id, fill]) => {
      defs.append(sv("marker", { id, viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" },
        sv("path", { d: "M0,0 L10,5 L0,10 z", style: { fill } })));
    });
    svg.append(defs);

    const paths = {
      goods: { d: "M545,150 V44 H95 V146", money: false, tag: [170, 34, "Goods and services"] },
      spend: { d: "M140,150 V104 H500 V146", money: true, tag: [320, 96, "Payments for goods ($)"] },
      labor: { d: "M95,210 V318 H545 V214", money: false, tag: [170, 336, "Labor"] },
      wages: { d: "M500,210 V258 H140 V214", money: true, tag: [320, 250, "Wages and salaries ($)"] }
    };
    const els = {};
    Object.entries(paths).forEach(([k, p]) => {
      const path = sv("path", { d: p.d, class: "flow-arrow" + (p.money ? " money" : ""), "marker-end": "url(#mk-off)" });
      const tag = sv("text", { x: p.tag[0], y: p.tag[1], "text-anchor": "middle", class: "flow-tag" }, p.tag[2]);
      els[k] = { path, tag, money: p.money };
      svg.append(path, tag);
    });
    function node(x, y, w, hh, label, sub, cls) {
      return sv("g", null,
        sv("rect", { x, y, width: w, height: hh, rx: 14, class: cls }),
        sv("text", { x: x + w / 2, y: y + hh / 2 + (sub ? -2 : 5), "text-anchor": "middle", class: "flow-label" + (cls === "flow-market" ? " market" : "") }, label),
        sub ? sv("text", { x: x + w / 2, y: y + hh / 2 + 14, "text-anchor": "middle", class: "flow-tag" }, sub) : null);
    }
    svg.append(
      node(40, 150, 160, 60, "Households", "you, your family", "flow-node"),
      node(440, 150, 160, 60, "Firms", "businesses", "flow-node"),
      node(240, 24, 160, 40, "Goods & services market", null, "flow-market"),
      node(240, 298, 160, 40, "Labor market", null, "flow-market")
    );

    const note = h("div", { class: "verdict neutral" });
    function show(scene) {
      Object.entries(els).forEach(([k, e]) => {
        const on = scene.on.includes(k);
        e.path.classList.toggle("on", on);
        e.tag.classList.toggle("on", on);
        e.path.setAttribute("marker-end", `url(#${on ? (e.money ? "mk-money" : "mk-on") : "mk-off"})`);
      });
      fill(note, scene.text);
    }
    const buttons = h("div", { class: "row" });
    function drawButtons(active) {
      fill(buttons, ...scenes.map((s) =>
        h("button", { type: "button", class: "btn small" + (s.id === active ? " is-on" : ""), onClick: () => { drawButtons(s.id); show(s); } }, s.label)));
    }
    drawButtons("buy");
    show(scenes[0]);

    return labShell("Circular flow diagram", "OpenStax 1.3. Pick an event and watch which flows light up. Solid lines are real things, dotted lines are money.", null,
      h("div", { class: "stack" },
        h("div", { class: "chart" }, h("div", { style: { overflowX: "auto" } }, svg)),
        buttons,
        note,
        h("div", { class: "legend" }, h("span", null, h("i", { style: { background: "var(--text)" } }), "Goods, services, labor"), h("span", null, h("i", { style: { background: "var(--core)" } }), "Money"))
      ));
  }

  /* ================================================================
     Sorting drill (Micro vs Macro, Positive vs Normative)
     ================================================================ */
  const SORT_SETS = {
    microMacro: {
      title: "Micro or macro?",
      blurb: "OpenStax 1.2. Sort each question by zoom level.",
      a: "Micro", b: "Macro",
      items: [
        ["How many lattes should a coffee shop make each morning?", "a", "One firm's decision."],
        ["Why did U.S. unemployment fall last year?", "b", "The national unemployment rate describes the whole economy."],
        ["Should you take a summer internship or a paid job?", "a", "One person's choice."],
        ["What happens to prices across the country when the Fed raises interest rates?", "b", "Monetary policy and the overall price level are macro."],
        ["How does a drought affect the price of avocados?", "a", "One market."],
        ["Is the U.S. economy growing faster than Mexico's?", "b", "GDP growth for whole countries."],
        ["How does Walmart decide what to pay cashiers?", "a", "Big company, but still one firm's decision. Size isn't the test."],
        ["Should Congress cut taxes to fight a recession?", "b", "Fiscal policy aimed at the whole economy."]
      ]
    },
    posNorm: {
      title: "Positive or normative?",
      blurb: "OpenStax 2.3. Positive describes what is and can be tested. Normative says what should be.",
      a: "Positive", b: "Normative",
      items: [
        ["Raising the minimum wage to $15 would reduce teen employment.", "a", "It's a testable prediction, whether or not it turns out true."],
        ["The minimum wage should be $15.", "b", "\"Should\" is a value judgment."],
        ["College graduates earn more on average than high school graduates.", "a", "You can check this with data."],
        ["The government ought to make community college free.", "b", "\"Ought to\" signals values."],
        ["A soda tax would lower soda consumption.", "a", "A cause-and-effect claim you can test."],
        ["Income inequality in the U.S. is too high.", "b", "\"Too high\" depends on what you value."],
        ["Rent control in a city led to fewer new apartments.", "a", "A claim about what happened, checkable with evidence."],
        ["It's unfair that CEOs earn 300 times more than workers.", "b", "\"Unfair\" is a value judgment, even though the 300× figure could be checked."]
      ]
    }
  };
  function sorter(key) {
    const set = SORT_SETS[key];
    let order = set.items.map((_, i) => i).sort(() => Math.random() - 0.5);
    let i = 0, score = 0, answered = false;
    const body = h("div", { class: "stack" });
    function draw() {
      fill(body);
      if (i >= order.length) {
        body.append(
          h("div", { class: "verdict " + (score >= order.length - 1 ? "ok" : "warn") }, `${score} of ${order.length} sorted correctly.`,
            h("small", null, score === order.length ? "Clean sweep." : "Run it again. The order shuffles.")),
          h("div", null, h("button", { type: "button", class: "btn", onClick: () => { order = order.sort(() => Math.random() - 0.5); i = 0; score = 0; draw(); } }, "Shuffle and restart"))
        );
        return;
      }
      const [text, ans, why] = set.items[order[i]];
      answered = false;
      const fb = h("div");
      const btnA = h("button", { type: "button", class: "pick" }, set.a);
      const btnB = h("button", { type: "button", class: "pick" }, set.b);
      const next = h("button", { type: "button", class: "btn primary", hidden: true, onClick: () => { i++; draw(); } }, i + 1 >= order.length ? "See score" : "Next");
      function choose(c) {
        if (answered) return;
        answered = true;
        const ok = c === ans;
        if (ok) score++;
        (ans === "a" ? btnA : btnB).classList.add("correct");
        if (!ok) (c === "a" ? btnA : btnB).classList.add("wrong");
        btnA.disabled = btnB.disabled = true;
        fill(fb, h("div", { class: "feedback " + (ok ? "ok" : "bad") }, h("strong", null, ok ? "Right." : `It's ${ans === "a" ? set.a.toLowerCase() : set.b.toLowerCase()}.`), why));
        next.hidden = false;
        next.focus();
      }
      btnA.addEventListener("click", () => choose("a"));
      btnB.addEventListener("click", () => choose("b"));
      body.append(
        h("div", { class: "quiz-top" }, h("span", null, `${i + 1} / ${order.length}`), h("span", null, `Score ${score}`)),
        h("div", { class: "sort-card" }, text),
        h("div", { class: "choice-row" }, btnA, btnB),
        fb,
        h("div", null, next)
      );
    }
    draw();
    return labShell(set.title, set.blurb, null, body);
  }

  /* ================================================================
     CH 2 — Budget constraint (Alphonso)
     ================================================================ */
  function budgetLab() {
    const s = { budget: 10, pb: 2, pt: 0.5, pick: null };
    const F = frame({
      xMax: 30, yMax: 10, xLabel: "Bus tickets per week", yLabel: "Burgers per week", aria: "Budget constraint graph",
      xTicks: [0, 5, 10, 15, 20, 25, 30].map((v) => ({ v, label: String(v) })),
      yTicks: [0, 2, 4, 6, 8, 10].map((v) => ({ v, label: String(v) }))
    });
    const readout = h("div", { class: "readout" });
    const tableBox = h("div", { class: "table-wrap" });

    function draw() {
      F.clear();
      const maxT = s.budget / s.pt, maxB = s.budget / s.pb;
      F.under.append(sv("polygon", { points: `${F.X(0)},${F.Y(0)} ${F.X(maxT)},${F.Y(0)} ${F.X(0)},${F.Y(maxB)}`, style: { fill: "var(--soft)" } }));
      const isBook = s.budget === 10 && s.pb === 2 && s.pt === 0.5;
      if (!isBook) F.under.append(sv("line", { class: "c-ink c-ghost", x1: F.X(0), y1: F.Y(5), x2: F.X(20), y2: F.Y(0) }));
      F.under.append(sv("line", { class: "c-ink", x1: F.X(0), y1: F.Y(maxB), x2: F.X(maxT), y2: F.Y(0) }));
      // Whole-burger combinations, like the book's table
      for (let b = 0; b <= Math.floor(maxB + 1e-9); b++) {
        const t = (s.budget - b * s.pb) / s.pt;
        if (t <= 30 && b <= 10) F.over.append(sv("circle", { cx: F.X(t), cy: F.Y(b), r: 3.5, style: { fill: "var(--text)" } }));
      }
      F.over.append(sv("text", { x: F.X(0) + 8, y: Math.max(F.Y(Math.min(maxB, 10)) + (maxB > 10 ? 14 : -6), F.m.t + 12), class: "lbl-strong" }, `${maxB > 10 ? "↑ " : ""}${fmtNum(maxB, maxB % 1 ? 1 : 0)} burgers max`));
      F.over.append(sv("text", { x: F.X(Math.min(maxT, 30)) - 4, y: F.Y(0) - 8, "text-anchor": "end", class: "lbl-strong" }, `${fmtNum(maxT, maxT % 1 ? 1 : 0)} tickets max${maxT > 30 ? " →" : ""}`));

      let pickInfo = null;
      if (s.pick) {
        const { t, b } = s.pick;
        const cost = t * s.pt + b * s.pb;
        const cls = Math.abs(cost - s.budget) < 0.001 ? "ok" : cost < s.budget ? "warn" : "bad";
        F.over.append(sv("circle", { cx: F.X(t), cy: F.Y(b), r: 7, class: "dot", style: { fill: cls === "bad" ? "var(--bad)" : cls === "warn" ? "var(--core)" : "var(--good)" } }));
        const verdict = cls === "ok" ? "On the line. Spends the whole budget." : cls === "warn" ? `Inside the line. ${money(s.budget - cost)} left unspent.` : `Outside the line. ${money(cost - s.budget)} over budget, so not affordable.`;
        pickInfo = h("div", { class: "verdict " + cls }, `${t} tickets + ${b} burgers costs ${money(cost)}`, h("small", null, verdict));
      }
      const ocBurger = s.pb / s.pt, ocTicket = s.pt / s.pb;
      fill(readout, 
        h("div", { class: "stats" },
          stat("1 burger costs", `${fmtNum(ocBurger, ocBurger % 1 ? 2 : 0)} tickets`, `${money(s.pb)} ÷ ${money(s.pt)}`),
          stat("1 ticket costs", `${fmtNum(ocTicket, 2)} burgers`, `${money(s.pt)} ÷ ${money(s.pb)}`)
        ),
        h("div", { class: "verdict neutral" }, `Slope = −${fmtNum(ocTicket, 2)} burgers per ticket`, h("small", null, "The slope is the opportunity cost. Change a price and the line tilts. Change the budget and it shifts parallel.")),
        pickInfo || h("div", { class: "verdict neutral" }, "Click anywhere on the graph to test a combination.")
      );
      const rows = [];
      for (let b = 0; b <= Math.floor(maxB + 1e-9); b++) {
        const t = (s.budget - b * s.pb) / s.pt;
        rows.push(h("tr", null, h("td", { class: "num" }, b), h("td", { class: "num" }, fmtNum(t, t % 1 ? 1 : 0)), h("td", { class: "num" }, money(s.budget))));
      }
      fill(tableBox, h("table", { class: "table" },
        h("thead", null, h("tr", null, h("th", { class: "num" }, "Burgers"), h("th", { class: "num" }, "Bus tickets"), h("th", { class: "num" }, "Total spent"))),
        h("tbody", null, rows)));
    }
    F.svg.addEventListener("click", (e) => {
      const d = F.toData(e);
      if (!d) return;
      s.pick = { t: clamp(Math.round(d.x), 0, 30), b: clamp(Math.round(d.y), 0, 10) };
      draw();
    });
    F.svg.style.cursor = "crosshair";
    draw();
    const controls = h("div", { class: "grid-3" },
      slider("bud-income", "Weekly budget", 4, 20, 1, s.budget, (v) => money(v, 0), (v) => { s.budget = v; draw(); }),
      slider("bud-pb", "Burger price", 1.5, 4, 0.25, s.pb, (v) => money(v), (v) => { s.pb = v; draw(); }),
      slider("bud-pt", "Bus ticket price", 0.5, 2, 0.25, s.pt, (v) => money(v), (v) => { s.pt = v; draw(); })
    );
    const reset = h("button", { type: "button", class: "btn small", onClick: () => { Object.assign(s, { budget: 10, pb: 2, pt: 0.5, pick: null }); const fresh = budgetLab(); wrapper.replaceWith(fresh); } }, "Reset to the book");
    const wrapper = labShell("Alphonso's budget constraint", "OpenStax 2.1: $10 a week, burgers $2, bus tickets $0.50. The dots are the whole-burger choices from the book's table. Change a slider and the faint line keeps the book's version for comparison.", reset,
      h("div", { class: "stack" },
        h("div", { class: "lab-body" }, h("div", { class: "chart" }, F.svg), readout),
        controls,
        h("details", null, h("summary", { class: "eyebrow", style: { cursor: "pointer" } }, "Show the choice table"), h("div", { style: { marginTop: "10px" } }, tableBox))
      ));
    return wrapper;
  }

  /* ================================================================
     CH 2 — Production possibilities frontier
     ================================================================ */
  function ppfLab() {
    const s = { shape: "bowed", growth: false, step: 0, pick: null };
    const STEP = 20;
    const F = frame({
      xMax: 130, yMax: 130, xLabel: "Education (units)", yLabel: "Health care (units)", aria: "Production possibilities frontier",
      xTicks: [0, 20, 40, 60, 80, 100, 120].map((v) => ({ v, label: String(v) })),
      yTicks: [0, 20, 40, 60, 80, 100, 120].map((v) => ({ v, label: String(v) }))
    });
    const scale = () => (s.growth ? 1.2 : 1);
    const yOf = (x) => {
      const M = 100 * scale();
      if (x >= M) return 0;
      return s.shape === "bowed" ? M * Math.sqrt(1 - (x / M) ** 2) : M - x;
    };
    const tableBox = h("div", { class: "table-wrap" });
    const readout = h("div", { class: "readout" });
    const stepBtn = h("button", { type: "button", class: "btn primary small" });
    function draw() {
      F.clear();
      const M = 100 * scale();
      if (s.growth) {
        const old = [];
        for (let i = 0; i <= 100; i++) {
          const x = i;
          const y = s.shape === "bowed" ? 100 * Math.sqrt(Math.max(0, 1 - (x / 100) ** 2)) : 100 - x;
          old.push(`${F.X(x)},${F.Y(y)}`);
        }
        F.under.append(sv("polyline", { points: old.join(" "), class: "c-ink c-ghost" }));
      }
      const pts = [];
      for (let i = 0; i <= 200; i++) { const x = (i / 200) * M; pts.push(`${F.X(x)},${F.Y(yOf(x))}`); }
      F.under.append(sv("polygon", { points: `${F.X(0)},${F.Y(0)} ${pts.join(" ")}`, style: { fill: "var(--soft)" } }));
      F.under.append(sv("polyline", { points: pts.join(" "), class: "c-ink" }));
      F.over.append(sv("text", { x: F.X(M * 0.72) + 6, y: F.Y(yOf(M * 0.72)) - 8, class: "lbl-strong" }, s.growth ? "PPF after growth" : "PPF"));

      // Staircase of opportunity costs up to the current step
      const rows = [];
      const maxSteps = Math.round(M / STEP);
      for (let k = 0; k < maxSteps; k++) {
        const x0 = k * STEP, x1 = Math.min(M, (k + 1) * STEP);
        const y0 = yOf(x0), y1 = yOf(x1);
        const oc = y0 - y1;
        const active = k < s.step;
        if (active) {
          F.over.append(sv("path", { d: `M${F.X(x0)},${F.Y(y0)} V${F.Y(y1)} H${F.X(x1)}`, style: { fill: "none", stroke: k === s.step - 1 ? "var(--core)" : "var(--muted)", "stroke-width": k === s.step - 1 ? 2.4 : 1.4 } }));
          if (k === s.step - 1) {
            F.over.append(sv("text", { x: F.X(x0) - 6, y: (F.Y(y0) + F.Y(y1)) / 2 + 4, "text-anchor": "end", style: { fill: "var(--core)", "font-weight": 700 } }, `−${fmtNum(oc, 1)}`));
            F.over.append(sv("text", { x: (F.X(x0) + F.X(x1)) / 2, y: F.Y(y1) + 16, "text-anchor": "middle", style: { fill: "var(--core)", "font-weight": 700 } }, `+${STEP}`));
          }
        }
        rows.push(h("tr", { style: active ? { background: k === s.step - 1 ? "var(--core-soft)" : "transparent" } : { opacity: 0.45 } },
          h("td", null, `${x0} → ${x1}`),
          h("td", { class: "num" }, fmtNum(oc, 1)),
          h("td", { class: "num" }, fmtNum(oc / (x1 - x0), 2))));
      }
      const cx = Math.min(M, s.step * STEP);
      F.over.append(sv("circle", { cx: F.X(cx), cy: F.Y(yOf(cx)), r: 6, class: "dot" }));

      let pickBox = null;
      if (s.pick) {
        const { x, y } = s.pick;
        const r = s.shape === "bowed" ? (x / M) ** 2 + (y / M) ** 2 : x / M + y / M;
        const kind = Math.abs(r - 1) < 0.045 ? "on" : r < 1 ? "in" : "out";
        F.over.append(sv("circle", { cx: F.X(x), cy: F.Y(y), r: 7, class: "dot", style: { fill: kind === "on" ? "var(--good)" : kind === "in" ? "var(--core)" : "var(--bad)" } }));
        pickBox = h("div", { class: "verdict " + (kind === "on" ? "ok" : kind === "in" ? "warn" : "bad") },
          kind === "on" ? "On the PPF: productively efficient" : kind === "in" ? "Inside the PPF: inefficient" : "Outside the PPF: not attainable yet",
          h("small", null, kind === "on" ? "You can't get more of one without giving up some of the other." : kind === "in" ? "Resources are idle or wasted. You could have more of both." : "Needs more resources or better technology. Toggle growth to see the PPF shift out."));
      }
      fill(tableBox, h("table", { class: "table" },
        h("thead", null, h("tr", null, h("th", null, "Education"), h("th", { class: "num" }, "Health care given up"), h("th", { class: "num" }, "Per unit"))),
        h("tbody", null, rows)));
      const last = s.step > 0 ? yOf((s.step - 1) * STEP) - yOf(Math.min(M, s.step * STEP)) : null;
      fill(readout, 
        h("div", { class: "stats" },
          stat("Education", fmtNum(cx, 0)),
          stat("Health care", fmtNum(yOf(cx), 1))
        ),
        h("div", { class: "verdict " + (s.shape === "bowed" ? "warn" : "neutral") },
          last == null ? "Press the button to move resources into education, 20 units at a time." : `The last 20 units of education cost ${fmtNum(last, 1)} units of health care.`,
          h("small", null, s.shape === "bowed" ? "Each step costs more than the one before. That's the law of increasing opportunity cost." : "Every step costs the same. Constant opportunity cost gives a straight line.")),
        tableBox,
        pickBox || h("div", { class: "verdict neutral" }, "Click anywhere on the graph to test a point.")
      );
      stepBtn.textContent = s.step >= maxSteps ? "Start over" : "+20 education";
    }
    stepBtn.addEventListener("click", () => {
      const maxSteps = Math.round((100 * scale()) / STEP);
      s.step = s.step >= maxSteps ? 0 : s.step + 1;
      draw();
    });
    F.svg.addEventListener("click", (e) => {
      const d = F.toData(e);
      if (!d) return;
      s.pick = { x: clamp(d.x, 0, 130), y: clamp(d.y, 0, 130) };
      draw();
    });
    F.svg.style.cursor = "crosshair";
    draw();
    const controls = h("div", { class: "row" },
      seg([["bowed", "Increasing cost (bowed out)"], ["straight", "Constant cost"]], s.shape, (v) => { s.shape = v; s.step = 0; draw(); }),
      h("button", { type: "button", class: "btn small", "aria-pressed": "false", onClick: (e) => { s.growth = !s.growth; s.step = 0; e.currentTarget.classList.toggle("is-on", s.growth); e.currentTarget.setAttribute("aria-pressed", String(s.growth)); draw(); } }, "Economic growth"),
      stepBtn
    );
    return labShell("Production possibilities frontier", "OpenStax 2.2 uses health care and education. Move resources into education step by step and watch what each step costs.", null,
      h("div", { class: "stack" }, controls, h("div", { class: "lab-body" }, h("div", { class: "chart" }, F.svg), readout)));
  }

  /* ================================================================
     CH 2 — Comparative advantage and gains from trade
     ================================================================ */
  function tradeLab() {
    const s = { you: { a: 4, b: 2 }, fr: { a: 3, b: 3 }, hours: 8 };
    const out = h("div", { class: "stack" });
    function calc() {
      const H = s.hours;
      const people = [["You", s.you], ["Friend", s.fr]];
      const valid = people.every(([, p]) => p.a > 0 && p.b > 0) && H > 0;
      if (!valid) {
        fill(out, h("div", { class: "verdict bad" }, "Every rate needs to be above zero."));
        return;
      }
      const ocB = people.map(([, p]) => p.a / p.b);   // tacos given up per burger
      const ocA = people.map(([, p]) => p.b / p.a);   // burgers given up per taco
      const selfA = people.reduce((t, [, p]) => t + (H / 2) * p.a, 0);
      const selfB = people.reduce((t, [, p]) => t + (H / 2) * p.b, 0);
      const table = h("table", { class: "table" },
        h("thead", null, h("tr", null, h("th", null, ""), h("th", { class: "num" }, "1 taco costs"), h("th", { class: "num" }, "1 burger costs"))),
        h("tbody", null, people.map(([name], i) => h("tr", null,
          h("td", null, h("b", null, name)),
          h("td", { class: "num" }, `${fmtNum(ocA[i], 2)} burgers`),
          h("td", { class: "num" }, `${fmtNum(ocB[i], 2)} tacos`)))));
      fill(out, h("div", { class: "table-wrap" }, table));

      if (Math.abs(ocB[0] - ocB[1]) < 1e-9) {
        out.append(h("div", { class: "verdict warn" }, "Same opportunity costs. No comparative advantage, so no gains from specializing.", h("small", null, "One person may still be faster at both. That's absolute advantage, and it isn't enough for trade to help.")));
        return;
      }
      const bSpec = ocB[0] < ocB[1] ? 0 : 1;   // lower cost of burgers
      const aSpec = 1 - bSpec;
      const pB = people[bSpec][1], pA = people[aSpec][1];
      // Keep burgers at the self-sufficient total, push tacos as high as possible.
      let hB_b, hB_a;
      if (H * pB.b >= selfB) { hB_b = selfB / pB.b; hB_a = 0; }
      else { hB_b = H; hB_a = (selfB - H * pB.b) / pA.b; }
      const specA = (H - hB_b) * pB.a + (H - hB_a) * pA.a;
      const gain = specA - selfA;
      const names = [people[0][0], people[1][0]];
      const max = Math.max(selfA, specA, selfB);
      const bar = (label, v, color) => h("div", { class: "field" },
        h("span", { class: "top" }, h("span", null, label), h("b", null, fmtNum(v, 1))),
        h("div", { class: "bar" }, h("i", { style: { width: `${(v / max) * 100}%`, background: color } })));
      out.append(
        h("div", { class: "verdict ok" },
          `${names[bSpec]} has the comparative advantage in burgers. ${names[aSpec]} has it in tacos.`,
          h("small", null, `${names[bSpec]} gives up only ${fmtNum(ocB[bSpec], 2)} tacos per burger, versus ${fmtNum(ocB[aSpec], 2)}.`)),
        h("div", { class: "grid-2" },
          h("div", { class: "well stack" }, h("div", { class: "eyebrow" }, "Each splits time 50/50"), bar("Tacos", selfA, "var(--muted)"), bar("Burgers", selfB, "var(--muted)")),
          h("div", { class: "well stack" }, h("div", { class: "eyebrow" }, "Each specializes"), bar("Tacos", specA, "var(--good)"), bar("Burgers", selfB, "var(--good)"))
        ),
        h("div", { class: "verdict ok" }, `Same ${fmtNum(selfB, 1)} burgers, ${fmtNum(gain, 1)} more tacos.`, h("small", null, "That extra output is the gain from specializing and trading. Both people can end up with more than they could make alone."))
      );
    }
    const inputs = h("div", { class: "grid-2" },
      h("div", { class: "well stack" }, h("div", { class: "eyebrow" }, "You, per hour"),
        h("div", { class: "grid-2" },
          numField("tr-ya", "Tacos", s.you.a, (v) => { s.you.a = v; calc(); }, { min: 0 }),
          numField("tr-yb", "Burgers", s.you.b, (v) => { s.you.b = v; calc(); }, { min: 0 }))),
      h("div", { class: "well stack" }, h("div", { class: "eyebrow" }, "Friend, per hour"),
        h("div", { class: "grid-2" },
          numField("tr-fa", "Tacos", s.fr.a, (v) => { s.fr.a = v; calc(); }, { min: 0 }),
          numField("tr-fb", "Burgers", s.fr.b, (v) => { s.fr.b = v; calc(); }, { min: 0 })))
    );
    calc();
    return labShell("Comparative advantage", "You work an 8-hour day with a friend. Change the numbers and see who should make what, and how much extra you get together.", null,
      h("div", { class: "stack" }, inputs, out));
  }

  /* ================================================================
     CH 3 / CH 4 — Market lab (predict a shift, or explore freely)
     Model: Qd = 100 − P + D, Qs = P + S. Baseline equilibrium P = 50, Q = 50.
     ================================================================ */
  const MARKETS = {
    goods: {
      title: "Demand and supply lab",
      blurb: "Use the four-step process from 3.3. Read the event, decide which curve moves and which way, then check it on the graph.",
      xLabel: "Quantity (lattes per day)", yLabel: "Price ($)",
      fmtP: (p) => money(p / 10), fmtQ: (q) => fmtNum(q * 10),
      yTicks: [0, 20, 40, 60, 80, 100].map((v) => ({ v, label: "$" + v / 10 })),
      xTicks: [0, 20, 40, 60, 80, 100, 120].map((v) => ({ v, label: String(v * 10) })),
      events: [
        { e: "A study says coffee improves memory, and students start drinking more.", c: "D", d: 1, why: "Tastes and preferences shift demand. More wanted at every price." },
        { e: "A bad harvest in Brazil drives up the price of coffee beans.", c: "S", d: -1, why: "Beans are an input. Higher input prices shift supply left." },
        { e: "A new espresso machine makes drinks twice as fast.", c: "S", d: 1, why: "Better technology lowers cost per drink. Supply shifts right." },
        { e: "Energy drinks, a substitute, go on sale at half price.", c: "D", d: -1, why: "A substitute got cheaper, so some buyers switch away. Demand shifts left." },
        { e: "UTRGV enrollment grows by 3,000 students.", c: "D", d: 1, why: "More buyers in the market shifts demand right." },
        { e: "The city adds a tax on every drink sold.", c: "S", d: -1, why: "A tax raises sellers' costs. Supply shifts left." },
        { e: "A recession cuts incomes. Lattes are a normal good.", c: "D", d: -1, why: "Normal good plus lower income means less demand." },
        { e: "The coffee shop raises the price of a latte from $5 to $6.", c: "N", d: 0, why: "The good's own price changed. That's a movement along the demand curve, not a shift. Quantity demanded falls." }
      ]
    },
    labor: {
      title: "Labor market for nurses",
      blurb: "OpenStax 4.1. Same model, new labels: the price is the wage, firms demand and workers supply. Baseline matches the book: $85,000 and 41,000 nurses.",
      xLabel: "Nurses employed", yLabel: "Annual wage",
      fmtP: (p) => "$" + fmtNum(Math.round((p * 1700) / 100) * 100), fmtQ: (q) => fmtNum(Math.round(q * 820)),
      yTicks: [0, 40, 80, 120, 160].map((k) => ({ v: (k * 1000) / 1700, label: "$" + k + "k" })),
      xTicks: [0, 20, 40, 60, 80].map((k) => ({ v: (k * 1000) / 820, label: k + "k" })),
      events: [
        { e: "The population ages and needs more health care.", c: "D", d: 1, why: "Demand for the output rose. Labor demand is derived from it, so it shifts right." },
        { e: "Three new nursing schools open and graduate more nurses.", c: "S", d: 1, why: "More qualified workers. Labor supply shifts right." },
        { e: "The state adds a year of required education to become a nurse.", c: "S", d: -1, why: "Required education is a supply shifter. Fewer people qualify." },
        { e: "Hospitals adopt software that replaces some nursing tasks.", c: "D", d: -1, why: "This technology substitutes for nurses, so labor demand shifts left." },
        { e: "Two new hospitals open in the region.", c: "D", d: 1, why: "More companies hiring shifts labor demand right." },
        { e: "Many experienced nurses retire at once.", c: "S", d: -1, why: "Fewer workers available. Labor supply shifts left." }
      ]
    },
    finance: {
      title: "Market for credit card loans",
      blurb: "OpenStax 4.2. The price is the interest rate. Savers supply funds, borrowers demand them. Baseline matches the book: 15% and $600 billion.",
      xLabel: "Credit card borrowing ($ billions)", yLabel: "Interest rate",
      fmtP: (p) => fmtNum(p * 0.3, 1) + "%", fmtQ: (q) => "$" + fmtNum(Math.round(q * 12)) + "B",
      yTicks: [0, 6, 12, 18, 24, 30].map((r) => ({ v: r / 0.3, label: r + "%" })),
      xTicks: [0, 300, 600, 900, 1200].map((b) => ({ v: b / 12, label: "$" + fmtNum(b) })),
      events: [
        { e: "Households decide to save more for retirement.", c: "S", d: 1, why: "More saving means more funds offered to lend. Supply shifts right and rates fall." },
        { e: "Businesses grow optimistic and plan new investments, like the 1990s tech boom.", c: "D", d: 1, why: "More borrowing at every rate. Demand shifts right and rates rise." },
        { e: "A recession hits and confidence collapses, like 2008.", c: "D", d: -1, why: "People and firms borrow less. Demand shifts left." },
        { e: "Incomes fall, so people have less left over to save.", c: "S", d: -1, why: "Less saving means less supply of financial capital." },
        { e: "Lenders worry fewer loans will be repaid.", c: "S", d: -1, why: "Less confidence in repayment means lenders supply less at every rate." },
        { e: "A credit card company raises its interest rate.", c: "N", d: 0, why: "A change in the price itself is a movement along the curves, not a shift." }
      ]
    }
  };

  function marketLab(key) {
    const cfg = MARKETS[key];
    const SHIFT = 20;
    const s = { mode: "predict", order: cfg.events.map((_, i) => i).sort(() => Math.random() - 0.5), i: 0, phase: "curve", pick: null, score: 0, done: 0,
      cur: { D: 0, S: 0, mv: 0 }, price: 65 };
    const F = frame({ xMax: 120, yMax: 100, xLabel: cfg.xLabel, yLabel: cfg.yLabel, xTicks: cfg.xTicks, yTicks: cfg.yTicks, aria: cfg.title, margin: { l: 58 } });
    F.svg.classList.add("anim");
    const eq = (D, S) => { const P = (100 + D - S) / 2; return { P, Q: 100 - P + D }; };

    function drawCurves(st, ghost) {
      F.clear();
      if (ghost && (st.D !== 0 || st.S !== 0)) {
        F.under.append(sv("polyline", { points: curvePoints(F, (p) => 100 - p, 100, 120), class: "c-demand c-ghost" }));
        F.under.append(sv("polyline", { points: curvePoints(F, (p) => p, 100, 120), class: "c-supply c-ghost" }));
        const e0 = eq(0, 0);
        F.over.append(sv("circle", { cx: F.X(e0.Q), cy: F.Y(e0.P), r: 4, style: { fill: "var(--muted)" } }));
      }
      F.under.append(sv("polyline", { points: curvePoints(F, (p) => 100 - p + st.D, 100, 120), class: "c-demand" }));
      F.under.append(sv("polyline", { points: curvePoints(F, (p) => p + st.S, 100, 120), class: "c-supply" }));
      // Curve labels near the top-left / top-right ends
      const dTopP = clamp(100 + st.D - 6, 8, 96);
      F.over.append(sv("text", { x: F.X(clamp(100 - dTopP + st.D, 0, 118)) + 8, y: F.Y(dTopP) + 4, class: "t-demand" }, "D"));
      const sTopP = clamp(Math.min(96, 118 - st.S), 8, 96);
      F.over.append(sv("text", { x: F.X(clamp(sTopP + st.S, 0, 118)) + 8, y: F.Y(sTopP) + 4, class: "t-supply" }, "S"));
    }
    function guides(P, Q, label) {
      F.over.append(sv("path", { d: `M${F.X(0)},${F.Y(P)} H${F.X(Q)} V${F.Y(0)}`, class: "c-guide" }));
      F.over.append(sv("circle", { cx: F.X(Q), cy: F.Y(P), r: 6, class: "dot" }));
      if (label) F.over.append(sv("text", { x: F.X(Q) + 12, y: F.Y(P) + 18, class: "lbl-strong" }, label));
    }

    const panel = h("div", { class: "readout" });
    let cancelAnim = () => {};
    function animate(target, ms, onFrame, onDone) {
      cancelAnim();
      cancelAnim = tween({ ...s.cur }, target, ms, (cur) => { s.cur = cur; onFrame(); }, onDone);
    }
    function resetCurves() { cancelAnim(); s.cur = { D: 0, S: 0, mv: 0 }; s.target = { D: 0, S: 0, mv: 0 }; }
    s.target = { D: 0, S: 0, mv: 0 };
    const head = seg([["predict", "Predict the shift"], ["explore", "Explore"]], s.mode, (v) => { s.mode = v; resetCurves(); render(); });

    /* ---- Predict mode ---- */
    const currentEvent = () => cfg.events[s.order[s.i % s.order.length]];
    function renderPredict() { chartPredict(); panelPredict(); }
    function chartPredict() {
      const ev = currentEvent();
      drawCurves(s.cur, true);
      const e0 = eq(0, 0);
      if (s.phase !== "done") guides(e0.P, e0.Q, "E₀");
      else if (ev.c === "N") {
        const P = 50 + s.cur.mv, Q = 100 - P;
        F.over.append(sv("circle", { cx: F.X(e0.Q), cy: F.Y(e0.P), r: 4, style: { fill: "var(--muted)" } }));
        guides(P, Q, "New point");
      } else {
        const e1 = eq(s.cur.D, s.cur.S);
        guides(e1.P, e1.Q, "E₁");
      }
    }
    function panelPredict() {
      const ev = currentEvent();
      const curveBtns = [["D", "Demand"], ["S", "Supply"], ["N", "Neither: movement along"]];
      const dirBtns = [[-1, "Left (decrease)"], [1, "Right (increase)"]];
      const stepCurve = h("div", { class: "stack" },
        h("div", { class: "step-label" }, "Step 2 · Which curve moves?"),
        h("div", { class: "choice-row", style: { gridTemplateColumns: "1fr 1fr" } },
          curveBtns.map(([v, label]) => {
            const b = h("button", { type: "button", class: "pick", style: v === "N" ? { gridColumn: "1 / -1" } : null }, label);
            if (s.phase !== "curve") {
              b.disabled = true;
              if (v === ev.c) b.classList.add("correct");
              else if (v === s.pick) b.classList.add("wrong");
            } else b.addEventListener("click", () => pickCurve(v, ev));
            return b;
          })));
      const blocks = [h("div", { class: "eyebrow" }, `Event ${(s.i % s.order.length) + 1} of ${s.order.length} · Score ${s.score}/${s.done}`),
        h("div", { class: "scenario" }, h("div", { class: "event" }, ev.e)), stepCurve];

      if (s.phase === "dir" || (s.phase === "done" && ev.c !== "N" && s.pickCurveOk)) {
        blocks.push(h("div", { class: "stack" },
          h("div", { class: "step-label" }, "Step 3 · Which direction?"),
          h("div", { class: "choice-row" }, dirBtns.map(([v, label]) => {
            const b = h("button", { type: "button", class: "pick" }, label);
            if (s.phase !== "dir") {
              b.disabled = true;
              if (v === ev.d) b.classList.add("correct");
              else if (v === s.pickDir) b.classList.add("wrong");
            } else b.addEventListener("click", () => pickDir(v, ev));
            return b;
          }))));
      }
      if (s.phase === "done") {
        const ok = s.lastOk;
        const e1 = ev.c === "N" ? { P: 60, Q: 40 } : eq(ev.c === "D" ? ev.d * SHIFT : 0, ev.c === "S" ? ev.d * SHIFT : 0);
        blocks.push(
          h("div", { class: "feedback " + (ok ? "ok" : "bad") }, h("strong", null, ok ? "Correct." : "Not quite."), ev.why),
          h("div", { class: "step-label" }, ev.c === "N" ? "What changed" : "Step 4 · Compare"),
          h("div", { class: "stats" },
            stat("Price", `${arrow(50, e1.P)} ${cfg.fmtP(e1.P)}`, `was ${cfg.fmtP(50)}`),
            stat(ev.c === "N" ? "Quantity demanded" : "Quantity", `${arrow(50, e1.Q)} ${cfg.fmtQ(e1.Q)}`, `was ${cfg.fmtQ(50)}`)),
          h("button", { type: "button", class: "btn primary", onClick: nextEvent }, "Next event")
        );
      }
      fill(panel, ...blocks);
    }
    function pickCurve(v, ev) {
      s.pick = v;
      s.pickCurveOk = v === ev.c;
      if (v !== ev.c) { s.lastOk = false; s.done++; reveal(ev); return; }
      if (ev.c === "N") { s.lastOk = true; s.score++; s.done++; reveal(ev); return; }
      s.phase = "dir";
      renderPredict();
    }
    function pickDir(v, ev) {
      s.pickDir = v;
      s.lastOk = v === ev.d;
      s.done++;
      if (s.lastOk) s.score++;
      reveal(ev);
    }
    function reveal(ev) {
      s.phase = "done";
      const target = { D: ev.c === "D" ? ev.d * SHIFT : 0, S: ev.c === "S" ? ev.d * SHIFT : 0, mv: ev.c === "N" ? 10 : 0 };
      renderPredict();
      animate(target, 550, chartPredict);
    }
    function nextEvent() {
      s.i++;
      if (s.i % s.order.length === 0) s.order.sort(() => Math.random() - 0.5);
      s.phase = "curve"; s.pick = null; s.pickDir = null;
      resetCurves();
      renderPredict();
    }

    /* ---- Explore mode ---- */
    let exploreControls = null;
    const exploreReadout = h("div", { class: "readout" });
    function renderExplore() { chartExplore(); panelExplore(); }
    function chartExplore() {
      drawCurves(s.cur, true);
      const P = s.price;
      const qd = clamp(100 - P + s.cur.D, 0, 200), qs = clamp(P + s.cur.S, 0, 200);
      const e1 = eq(s.cur.D, s.cur.S);
      F.over.append(sv("line", { x1: F.X(0), x2: F.X(120), y1: F.Y(P), y2: F.Y(P), class: "c-guide" }));
      if (Math.abs(qd - qs) > 0.5) {
        F.over.append(sv("line", { x1: F.X(Math.min(qd, qs, 120)), x2: F.X(Math.min(Math.max(qd, qs), 120)), y1: F.Y(P), y2: F.Y(P), style: { stroke: qs > qd ? "var(--core)" : "var(--bad)", "stroke-width": 5, "stroke-linecap": "round", opacity: 0.55 } }));
      }
      F.over.append(sv("circle", { cx: F.X(Math.min(qd, 120)), cy: F.Y(P), r: 5, style: { fill: "var(--demand)" } }));
      F.over.append(sv("circle", { cx: F.X(Math.min(qs, 120)), cy: F.Y(P), r: 5, style: { fill: "var(--supply)" } }));
      F.over.append(sv("circle", { cx: F.X(e1.Q), cy: F.Y(e1.P), r: 5, class: "dot" }));
    }
    function panelExplore() {
      const P = s.price;
      const qd = clamp(100 - P + s.cur.D, 0, 200), qs = clamp(P + s.cur.S, 0, 200);
      const e1 = eq(s.cur.D, s.cur.S);
      const gap = qs - qd;
      const surplusWord = key === "labor" ? "Surplus of labor (unemployment)" : key === "finance" ? "Surplus of loanable funds" : "Surplus";
      const shortWord = key === "labor" ? "Shortage of workers" : key === "finance" ? "Shortage of credit" : "Shortage";
      const verdict = Math.abs(gap) < 1
        ? h("div", { class: "verdict ok" }, "Equilibrium. The market clears.")
        : gap > 0
          ? h("div", { class: "verdict warn" }, `${surplusWord} of ${cfg.fmtQ(gap)}`, h("small", null, "Quantity supplied is bigger than quantity demanded. The price tends to fall."))
          : h("div", { class: "verdict bad" }, `${shortWord} of ${cfg.fmtQ(-gap)}`, h("small", null, "Quantity demanded is bigger than quantity supplied. The price tends to rise."));
      if (!exploreControls) {
        const shiftBtn = (label, k, d) => h("button", { type: "button", class: "btn small", onClick: () => {
          s.target = { ...s.target, [k]: clamp(s.target[k] + d, -40, 40) };
          animate(s.target, 350, chartExplore, panelExplore);
        } }, label);
        exploreControls = h("div", { class: "stack" },
          slider(`${key}-price`, cfg.yLabel, 5, 95, 1, s.price, cfg.fmtP, (v) => { s.price = v; renderExplore(); }),
          h("div", { class: "grid-2" },
            h("div", { class: "stack" }, h("div", { class: "step-label", style: { color: "var(--demand)" } }, "Demand"), h("div", { class: "row" }, shiftBtn("← Left", "D", -10), shiftBtn("Right →", "D", 10))),
            h("div", { class: "stack" }, h("div", { class: "step-label", style: { color: "var(--supply)" } }, "Supply"), h("div", { class: "row" }, shiftBtn("← Left", "S", -10), shiftBtn("Right →", "S", 10)))
          ),
          h("div", null, h("button", { type: "button", class: "btn small", onClick: () => { resetCurves(); renderExplore(); } }, "Reset curves")));
      }
      fill(exploreReadout,
        h("div", { class: "stats" },
          stat("Quantity demanded", cfg.fmtQ(qd), `at ${cfg.fmtP(P)}`),
          stat("Quantity supplied", cfg.fmtQ(qs), `at ${cfg.fmtP(P)}`)),
        verdict,
        h("div", { class: "verdict neutral tnum" }, `Equilibrium: ${cfg.fmtP(e1.P)} and ${cfg.fmtQ(e1.Q)}`));
      if (panel.firstChild !== exploreReadout) fill(panel, exploreReadout, exploreControls);
    }

    function render() { if (s.mode === "predict") renderPredict(); else renderExplore(); }
    render();
    return labShell(cfg.title, cfg.blurb, head,
      h("div", { class: "stack" },
        h("div", { class: "lab-body" }, h("div", { class: "chart" }, F.svg,
          h("div", { class: "legend", style: { marginTop: "8px", paddingInline: "4px" } },
            h("span", null, h("i", { style: { background: "var(--demand)" } }), key === "labor" ? "Demand (employers)" : key === "finance" ? "Demand (borrowers)" : "Demand"),
            h("span", null, h("i", { style: { background: "var(--supply)" } }), key === "labor" ? "Supply (workers)" : key === "finance" ? "Supply (savers)" : "Supply"),
            h("span", null, h("i", { style: { background: "var(--muted)", opacity: 0.5 } }), "Before"))), panel)));
  }

  /* ================================================================
     Price controls with consumer surplus, producer surplus, deadweight loss
     ================================================================ */
  const CONTROLS = {
    goods: {
      title: "Price ceilings, floors and surplus",
      blurb: "OpenStax 3.4 and 3.5. Slide the legal price. Blue is consumer surplus, green is producer surplus, red is deadweight loss.",
      kinds: ["ceiling", "floor"], start: { ceiling: 35, floor: 65 },
      names: { ceiling: "Price ceiling", floor: "Price floor" },
      xLabel: "Quantity (apartments)", yLabel: "Monthly rent",
      fmtP: (p) => "$" + fmtNum(p * 24), fmtQ: (q) => fmtNum(q * 10), areaK: 240,
      yTicks: [0, 25, 50, 75, 100].map((v) => ({ v, label: "$" + fmtNum(v * 24) })),
      xTicks: [0, 25, 50, 75, 100].map((v) => ({ v, label: String(v * 10) })),
      short: "Shortage", surplus: "Surplus",
      note: { ceiling: "Rent control is the classic ceiling. Below equilibrium, more people want apartments than landlords offer.", floor: "Agricultural price supports are the classic floor. Above equilibrium, farmers grow more than buyers want." }
    },
    labor: {
      title: "Minimum wage as a price floor",
      blurb: "OpenStax 4.1. A wage floor above equilibrium means more people want jobs than employers hire.",
      kinds: ["floor"], start: { floor: 60 },
      names: { floor: "Minimum wage" },
      xLabel: "Workers", yLabel: "Hourly wage",
      fmtP: (p) => money(p * 0.2), fmtQ: (q) => fmtNum(q * 16),
      yTicks: [0, 25, 50, 75, 100].map((v) => ({ v, label: "$" + fmtNum(v * 0.2) })),
      xTicks: [0, 25, 50, 75, 100].map((v) => ({ v, label: String(v * 16) })),
      short: "Shortage of workers", surplus: "Unemployment (surplus of labor)",
      note: { floor: "The book's own living-wage example has the same shape with different numbers: at $12 an hour, 1,600 people want jobs but only 700 are hired." }
    },
    finance: {
      title: "Usury law as an interest-rate ceiling",
      blurb: "OpenStax 4.2. A cap on interest rates only matters if it sits below the market rate.",
      kinds: ["ceiling"], start: { ceiling: 38 },
      names: { ceiling: "Interest rate cap" },
      xLabel: "Borrowing ($ billions)", yLabel: "Interest rate",
      fmtP: (p) => fmtNum(p * 0.3, 1) + "%", fmtQ: (q) => "$" + fmtNum(q * 12) + "B",
      yTicks: [0, 6, 12, 18, 24, 30].map((r) => ({ v: r / 0.3, label: r + "%" })),
      xTicks: [0, 300, 600, 900, 1200].map((b) => ({ v: b / 12, label: "$" + fmtNum(b) })),
      short: "Shortage of credit", surplus: "Surplus of funds",
      note: { ceiling: "Below the market rate, willing borrowers can't get loans. Most state usury limits sit well above market rates, so they don't bind." }
    }
  };
  function priceControlLab(key) {
    const cfg = CONTROLS[key];
    const s = { kind: cfg.kinds[0], level: cfg.start[cfg.kinds[0]] };
    const F = frame({ xMax: 110, yMax: 100, xLabel: cfg.xLabel, yLabel: cfg.yLabel, xTicks: cfg.xTicks, yTicks: cfg.yTicks, aria: cfg.title, margin: { l: 58 } });
    const panel = h("div", { class: "readout" });
    const sliderBox = h("div");
    function compute() {
      const L = s.level;
      const binding = (s.kind === "ceiling" && L < 50) || (s.kind === "floor" && L > 50);
      if (!binding) {
        return { binding, Qt: 50, P: 50, cs: [[0, 100], [50, 50], [0, 50]], ps: [[0, 0], [50, 50], [0, 50]], dwl: null, qd: 100 - L, qs: L };
      }
      if (s.kind === "ceiling") {
        const Qt = L, Pd = 100 - Qt;
        return { binding, Qt, P: L, qd: 100 - L, qs: L,
          cs: [[0, 100], [Qt, Pd], [Qt, L], [0, L]], ps: [[0, 0], [Qt, L], [0, L]], dwl: [[Qt, Pd], [Qt, L], [50, 50]] };
      }
      const Qt = 100 - L, Ps = Qt;
      return { binding, Qt, P: L, qd: 100 - L, qs: L,
        cs: [[0, 100], [Qt, L], [0, L]], ps: [[0, 0], [Qt, Ps], [Qt, L], [0, L]], dwl: [[Qt, L], [Qt, Ps], [50, 50]] };
    }
    const poly = (pts, fill) => sv("polygon", { points: pts.map(([q, p]) => `${F.X(q)},${F.Y(p)}`).join(" "), style: { fill } });
    function draw() {
      const r = compute();
      F.clear();
      F.under.append(poly(r.cs, "var(--cs)"), poly(r.ps, "var(--ps)"));
      if (r.dwl) F.under.append(poly(r.dwl, "var(--dwl)"));
      F.under.append(sv("polyline", { points: curvePoints(F, (p) => 100 - p, 100, 110), class: "c-demand" }));
      F.under.append(sv("polyline", { points: curvePoints(F, (p) => p, 100, 110), class: "c-supply" }));
      F.over.append(sv("text", { x: F.X(8) + 6, y: F.Y(92), class: "t-demand" }, "D"));
      F.over.append(sv("text", { x: F.X(92) + 6, y: F.Y(92), class: "t-supply" }, "S"));
      F.over.append(sv("circle", { cx: F.X(50), cy: F.Y(50), r: 4, style: { fill: "var(--muted)" } }));
      const L = s.level;
      F.over.append(sv("line", { x1: F.X(0), x2: F.X(110), y1: F.Y(L), y2: F.Y(L), style: { stroke: "var(--text)", "stroke-width": 2, "stroke-dasharray": r.binding ? "0" : "6 4" } }));
      F.over.append(sv("text", { x: F.X(108), y: F.Y(L) - 7, "text-anchor": "end", class: "lbl-strong" }, `${cfg.names[s.kind]} ${cfg.fmtP(L)}`));
      if (r.binding) {
        F.over.append(sv("line", { x1: F.X(Math.min(r.qd, r.qs)), x2: F.X(Math.max(r.qd, r.qs)), y1: F.Y(L), y2: F.Y(L), style: { stroke: s.kind === "ceiling" ? "var(--bad)" : "var(--core)", "stroke-width": 6, "stroke-linecap": "round", opacity: 0.6 } }));
        F.over.append(sv("circle", { cx: F.X(r.qd), cy: F.Y(L), r: 5, style: { fill: "var(--demand)" } }));
        F.over.append(sv("circle", { cx: F.X(r.qs), cy: F.Y(L), r: 5, style: { fill: "var(--supply)" } }));
      }
      const total = 2500;
      const cs = area(r.cs), ps = area(r.ps), dwl = r.dwl ? area(r.dwl) : 0;
      const gap = Math.abs(r.qd - r.qs);
      const status = !r.binding
        ? h("div", { class: "verdict neutral" }, "Not binding.", h("small", null, s.kind === "ceiling" ? "The ceiling is above the market price, so the market settles at equilibrium as usual." : "The floor is below the market price, so it changes nothing."))
        : h("div", { class: "verdict " + (s.kind === "ceiling" ? "bad" : "warn") }, `${s.kind === "ceiling" ? cfg.short : cfg.surplus}: ${cfg.fmtQ(gap)}`,
          h("small", null, `Quantity demanded ${cfg.fmtQ(r.qd)}, quantity supplied ${cfg.fmtQ(r.qs)}. Only ${cfg.fmtQ(r.Qt)} actually trade.`));
      const statsArr = cfg.areaK
        ? [stat("Consumer surplus", "$" + fmtNum(cs * cfg.areaK), r.binding ? `${cs >= 1250 ? "+" : "−"}$${fmtNum(Math.abs(cs - 1250) * cfg.areaK)} vs equilibrium` : "at equilibrium"),
           stat("Producer surplus", "$" + fmtNum(ps * cfg.areaK), r.binding ? `${ps >= 1250 ? "+" : "−"}$${fmtNum(Math.abs(ps - 1250) * cfg.areaK)} vs equilibrium` : "at equilibrium")]
        : [stat("Traded", cfg.fmtQ(r.Qt), `equilibrium ${cfg.fmtQ(50)}`), stat("At the legal price", cfg.fmtP(L), `equilibrium ${cfg.fmtP(50)}`)];
      fill(panel, 
        h("div", { class: "stats" }, statsArr),
        status,
        h("div", { class: "field" },
          h("span", { class: "top" }, h("span", null, "Social surplus kept"), h("b", null, Math.round(((cs + ps) / total) * 100) + "%")),
          h("div", { class: "bar " + (dwl > 0 ? "low" : "good") }, h("i", { style: { width: `${((cs + ps) / total) * 100}%` } })),
          dwl > 0 ? h("span", { class: "muted", style: { fontSize: "12px" } }, `Deadweight loss: ${Math.round((dwl / total) * 100)}% of the possible gains from trade disappear.`) : null),
        h("div", { class: "legend" },
          h("span", null, h("i", { style: { background: "var(--cs)", height: "10px" } }), "Consumer surplus"),
          h("span", null, h("i", { style: { background: "var(--ps)", height: "10px" } }), "Producer surplus"),
          h("span", null, h("i", { style: { background: "var(--dwl)", height: "10px" } }), "Deadweight loss")),
        h("div", { class: "callout example" }, cfg.note[s.kind])
      );
    }
    function drawSlider() {
      fill(sliderBox, slider(`${key}-${s.kind}-lvl`, cfg.names[s.kind], 10, 90, 1, s.level, cfg.fmtP, (v) => { s.level = v; draw(); }));
    }
    const head = cfg.kinds.length > 1 ? seg(cfg.kinds.map((k) => [k, cfg.names[k]]), s.kind, (v) => { s.kind = v; s.level = cfg.start[v]; drawSlider(); draw(); }) : null;
    drawSlider();
    draw();
    return labShell(cfg.title, cfg.blurb, head,
      h("div", { class: "stack" }, h("div", { class: "lab-body" }, h("div", { class: "chart stack" }, F.svg, sliderBox), panel)));
  }

  /* ================================================================
     CH 4 bonus — Present discounted value
     ================================================================ */
  function pdvLab() {
    const s = { fv: 100, r: 6, t: 1 };
    const out = h("div", { class: "stack" });
    function calc() {
      const pdv = s.fv / Math.pow(1 + s.r / 100, s.t);
      fill(out, 
        h("div", { class: "stats" }, stat("Worth today", money(pdv)), stat("Discount", money(s.fv - pdv), `${fmtNum(s.r, 1)}% for ${s.t} yr`)),
        h("div", { class: "formula" }, `PDV = ${money(s.fv)} ÷ (1 + ${fmtNum(s.r / 100, 3)})^${s.t} = ${money(pdv)}`),
        h("div", { class: "verdict neutral" }, `If someone offers you more than ${money(pdv)} today, take it over ${money(s.fv)} in ${s.t} year${s.t === 1 ? "" : "s"}.`,
          h("small", null, "Higher interest rates or longer waits shrink what future money is worth today."))
      );
    }
    calc();
    return labShell("Bonus: present discounted value", "Not part of Chapter 4 in the book. It comes up later with financial markets. Interest is the price of time, and this shows why money later is worth less than money now.", h("span", { class: "tag" }, "Bonus"),
      h("div", { class: "lab-body even" },
        h("div", { class: "grid-3", style: { alignContent: "start" } },
          numField("pdv-fv", "Future amount ($)", s.fv, (v) => { s.fv = v; calc(); }, { min: 0 }),
          numField("pdv-r", "Interest rate (%)", s.r, (v) => { s.r = v; calc(); }, { min: 0, step: 0.5 }),
          numField("pdv-t", "Years", s.t, (v) => { s.t = Math.max(0, Math.round(v)); calc(); }, { min: 0, step: 1 })),
        out));
  }

  /* ================================================================
     CH 5 — Midpoint elasticity calculator with worked steps
     ================================================================ */
  function elasticityCalc() {
    const presets = {
      book: { p1: 60, q1: 3000, p2: 70, q2: 2800, label: "Book example" },
      elastic: { p1: 10, q1: 100, p2: 12, q2: 80, label: "Elastic example" },
      unit: { p1: 4, q1: 150, p2: 6, q2: 100, label: "Unit elastic" }
    };
    const s = { ...presets.book };
    const fieldsBox = h("div", { class: "grid-2" });
    const out = h("div", { class: "stack" });
    function fields() {
      fill(fieldsBox, 
        numField("el-p1", "Price 1 ($)", s.p1, (v) => { s.p1 = v; calc(); }),
        numField("el-q1", "Quantity 1", s.q1, (v) => { s.q1 = v; calc(); }),
        numField("el-p2", "Price 2 ($)", s.p2, (v) => { s.p2 = v; calc(); }),
        numField("el-q2", "Quantity 2", s.q2, (v) => { s.q2 = v; calc(); }));
    }
    function calc() {
      const avgQ = (s.q1 + s.q2) / 2, avgP = (s.p1 + s.p2) / 2;
      if (!avgQ || !avgP || s.p1 === s.p2) {
        fill(out, h("div", { class: "verdict bad" }, "Enter two different prices and positive quantities."));
        return;
      }
      const pq = ((s.q2 - s.q1) / avgQ) * 100, pp = ((s.p2 - s.p1) / avgP) * 100;
      const e = Math.abs(pq / pp);
      const kind = Math.abs(e - 1) < 0.005 ? "Unit elastic" : e > 1 ? "Elastic" : "Inelastic";
      const tr1 = s.p1 * s.q1, tr2 = s.p2 * s.q2;
      fill(out, 
        h("div", { class: "well stack mono", style: { fontSize: "13px" } },
          h("div", null, h("span", { class: "muted" }, "1  %ΔQ = "), `(${fmtNum(s.q2)} − ${fmtNum(s.q1)}) ÷ ${fmtNum(avgQ, avgQ % 1 ? 1 : 0)} = ${fmtNum(pq, 2)}%`),
          h("div", null, h("span", { class: "muted" }, "2  %ΔP = "), `(${fmtNum(s.p2, 2)} − ${fmtNum(s.p1, 2)}) ÷ ${fmtNum(avgP, 2)} = ${fmtNum(pp, 2)}%`),
          h("div", null, h("span", { class: "muted" }, "3  Ed  = "), `|${fmtNum(pq, 2)} ÷ ${fmtNum(pp, 2)}| = ${fmtNum(e, 2)}`)),
        h("div", { class: "stats" },
          stat("Elasticity", fmtNum(e, 2), kind),
          stat("Total revenue", `${money(tr1, 0)} → ${money(tr2, 0)}`, `${tr2 >= tr1 ? "+" : "−"}${money(Math.abs(tr2 - tr1), 0)}`)),
        h("div", { class: "verdict " + (kind === "Elastic" ? "warn" : kind === "Inelastic" ? "ok" : "neutral") }, kind,
          h("small", null, kind === "Elastic" ? "Quantity moved more than price, so price and revenue move in opposite directions." : kind === "Inelastic" ? "Quantity moved less than price, so price and revenue move in the same direction." : "Quantity and price moved by the same percentage, so revenue barely changes."))
      );
    }
    const presetBtns = h("div", { class: "row" });
    function drawPresets(active) {
      fill(presetBtns, ...Object.entries(presets).map(([k, p]) =>
        h("button", { type: "button", class: "btn small" + (k === active ? " is-on" : ""), onClick: () => { Object.assign(s, p); drawPresets(k); fields(); calc(); } }, p.label)));
    }
    drawPresets("book");
    fields();
    calc();
    return labShell("Midpoint elasticity calculator", "OpenStax 5.1. Every step is shown so you can check your own work on homework.", null,
      h("div", { class: "stack" }, presetBtns, h("div", { class: "lab-body even" }, fieldsBox, out)));
  }

  /* ================================================================
     CH 5 — Elasticity along a straight-line demand curve and revenue
     Demand: Q = 100 − 10P, P from $0 to $10.
     ================================================================ */
  function revenueCurve() {
    const s = { p: 7 };
    const D = frame({ w: 420, h: 300, xMax: 100, yMax: 10, xLabel: "Quantity", yLabel: "Price ($)", aria: "Demand with revenue rectangle",
      xTicks: [0, 25, 50, 75, 100].map((v) => ({ v, label: String(v) })), yTicks: [0, 2, 4, 6, 8, 10].map((v) => ({ v, label: "$" + v })) });
    const R = frame({ w: 420, h: 300, xMax: 10, yMax: 260, xLabel: "Price ($)", yLabel: "Total revenue ($)", aria: "Total revenue by price",
      xTicks: [0, 2, 4, 6, 8, 10].map((v) => ({ v, label: "$" + v })), yTicks: [0, 50, 100, 150, 200, 250].map((v) => ({ v, label: "$" + v })) });
    const panel = h("div", { class: "readout" });
    const q = (p) => 100 - 10 * p;
    function draw() {
      D.clear(); R.clear();
      const P = s.p, Q = q(P), TR = P * Q;
      D.under.append(sv("rect", { x: D.X(0), y: D.Y(P), width: D.X(Q) - D.X(0), height: D.Y(0) - D.Y(P), style: { fill: "var(--cs)" } }));
      D.under.append(sv("line", { x1: D.X(0), y1: D.Y(5), x2: D.X(50), y2: D.Y(5), class: "c-guide" }));
      D.under.append(sv("line", { x1: D.X(0), y1: D.Y(10), x2: D.X(100), y2: D.Y(0), class: "c-demand" }));
      D.over.append(sv("text", { x: D.X(14), y: D.Y(8.2), class: "lbl-strong" }, "Elastic"));
      D.over.append(sv("text", { x: D.X(56), y: D.Y(5) - 4, class: "lbl-strong" }, "Unit elastic"));
      D.over.append(sv("text", { x: D.X(66), y: D.Y(2.6), class: "lbl-strong" }, "Inelastic"));
      D.over.append(sv("text", { x: (D.X(0) + D.X(Q)) / 2, y: (D.Y(P) + D.Y(0)) / 2 + 4, "text-anchor": "middle", class: "lbl-strong" }, `TR ${money(TR, 0)}`));
      D.over.append(sv("circle", { cx: D.X(Q), cy: D.Y(P), r: 6, class: "dot" }));

      const pts = [];
      for (let i = 0; i <= 100; i++) { const p = i / 10; pts.push(`${R.X(p)},${R.Y(p * q(p))}`); }
      R.under.append(sv("polyline", { points: pts.join(" "), class: "c-ink" }));
      R.under.append(sv("line", { x1: R.X(5), x2: R.X(5), y1: R.Y(0), y2: R.Y(250), class: "c-guide" }));
      R.over.append(sv("text", { x: R.X(5) + 6, y: R.Y(18), class: "lbl-strong" }, "Peak: unit elastic"));
      R.over.append(sv("circle", { cx: R.X(P), cy: R.Y(TR), r: 6, class: "dot" }));

      const P2 = P + 0.5, Q2 = q(P2), TR2 = P2 * Q2;
      const e = P / (10 - P); // point elasticity on Q = 100 − 10P: |dQ/dP| × P/Q
      const kind = Math.abs(e - 1) < 0.02 ? "Unit elastic" : e > 1 ? "Elastic" : "Inelastic";
      fill(panel, 
        h("div", { class: "stats" },
          stat("Price", money(P)), stat("Quantity", fmtNum(Q)),
          stat("Total revenue", money(TR, 0)), stat("Elasticity here", fmtNum(e, 2), kind)),
        h("div", { class: "verdict " + (TR2 > TR + 0.01 ? "ok" : TR2 < TR - 0.01 ? "warn" : "neutral") },
          `Raise the price to ${money(P2)} and revenue ${TR2 > TR + 0.01 ? "rises" : TR2 < TR - 0.01 ? "falls" : "stays about the same"}: ${money(TR, 0)} → ${money(TR2, 0)}.`,
          h("small", null, "Same straight line, same slope, but elasticity changes at every point. High prices are on the elastic part of the curve."))
      );
    }
    draw();
    return labShell("Elasticity and revenue on one demand curve", "OpenStax 5.3. Slide the price. The blue rectangle is total revenue, price times quantity.", null,
      h("div", { class: "stack" },
        slider("rev-p", "Price", 0.5, 9, 0.25, s.p, (v) => money(v), (v) => { s.p = v; draw(); }),
        h("div", { class: "lab-body even" }, h("div", { class: "chart" }, D.svg), h("div", { class: "chart" }, R.svg)),
        panel));
  }

  /* ================================================================
     CH 5 — Polar cases
     ================================================================ */
  function polarCases() {
    const card = (title, value, desc, draw) => {
      const F = frame({ w: 220, h: 170, xMax: 10, yMax: 10, xLabel: "Q", yLabel: "P", margin: { l: 30, r: 10, t: 10, b: 26 }, aria: title });
      draw(F);
      return h("div", { class: "well stack" },
        h("div", { class: "chart", style: { padding: 0, background: "none" } }, F.svg),
        h("div", null, h("div", { style: { fontWeight: 650 } }, title), h("div", { class: "mono muted", style: { fontSize: "12px" } }, value)),
        h("div", { style: { fontSize: "13px", lineHeight: 1.45 } }, desc));
    };
    return labShell("Polar cases", "OpenStax 5.2. The extremes make the middle easier to picture.", null,
      h("div", { class: "grid-3" },
        card("Perfectly inelastic", "Elasticity = 0", "Vertical. Quantity stays the same at any price. Close to life-saving medicine with no substitute.",
          (F) => F.under.append(sv("line", { x1: F.X(5), x2: F.X(5), y1: F.Y(0.5), y2: F.Y(9.5), class: "c-demand" }))),
        card("Perfectly elastic", "Elasticity = ∞", "Horizontal. Any price increase drops quantity to zero. Close to one farmer selling wheat in a huge market.",
          (F) => F.under.append(sv("line", { x1: F.X(0.5), x2: F.X(9.5), y1: F.Y(5), y2: F.Y(5), class: "c-demand" }))),
        card("Constant unit elasticity", "Elasticity = 1 everywhere", "A curve where every price change is matched by the same percentage change in quantity. Revenue never changes.",
          (F) => { const pts = []; for (let i = 0; i <= 60; i++) { const qv = 1 + (i / 60) * 8.5; pts.push(`${F.X(qv)},${F.Y(10 / qv)}`); } F.under.append(sv("polyline", { points: pts.join(" "), class: "c-demand" })); })
      ));
  }

  /* ---------------------------------------------------------- registry */
  MM.labs = {
    circularFlow: { name: "Circular flow", make: circularFlow },
    sortMicroMacro: { name: "Micro or macro?", make: () => sorter("microMacro") },
    sortPosNorm: { name: "Positive or normative?", make: () => sorter("posNorm") },
    budget: { name: "Budget constraint", make: budgetLab },
    ppf: { name: "PPF", make: ppfLab },
    trade: { name: "Comparative advantage", make: tradeLab },
    market: { name: "Demand and supply", make: () => marketLab("goods") },
    priceControl: { name: "Price controls", make: () => priceControlLab("goods") },
    laborMarket: { name: "Labor market", make: () => marketLab("labor") },
    minWage: { name: "Minimum wage", make: () => priceControlLab("labor") },
    financeMarket: { name: "Financial market", make: () => marketLab("finance") },
    usury: { name: "Usury law", make: () => priceControlLab("finance") },
    pdv: { name: "Present value", make: pdvLab },
    elasticityCalc: { name: "Elasticity calculator", make: elasticityCalc },
    revenueCurve: { name: "Elasticity and revenue", make: revenueCurve },
    polar: { name: "Polar cases", make: polarCases }
  };

  MM.util = { h, sv, fill, clamp, round, fmtNum, money };
})();
