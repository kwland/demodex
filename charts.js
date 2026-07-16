/* ============================================================================
   charts.js · Lightweight, dependency-free SVG charts with hover tooltips.
   Exposes window.CHARTS used by app.js. All charts redraw from filtered data.
   ========================================================================== */

(function (global) {
  "use strict";

  const SVGNS = "http://www.w3.org/2000/svg";
  const GRADE_COLOR = {
    none: getVar("--g-none", "#7fe3d4"),
    mild: getVar("--g-mild", "#9d8cff"),
    moderate: getVar("--g-mod", "#ff9fc4"),
    severe: getVar("--g-sev", "#ff6f96")
  };
  const GRADE_ORDER = ["none", "mild", "moderate", "severe"];

  function getVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    } catch (e) { return fallback; }
  }

  // SVG element helper
  function s(tag, attrs, kids) {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (kids) (Array.isArray(kids) ? kids : [kids]).forEach(c => n.appendChild(c));
    return n;
  }
  function txt(el, string) { el.textContent = string; return el; }

  const mean = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  // ------------------------- Tooltip ---------------------------------------
  const tipEl = () => document.getElementById("tooltip");
  function showTip(html, evt) {
    const t = tipEl(); if (!t) return;
    t.innerHTML = html;
    t.classList.add("is-visible");
    moveTip(evt);
  }
  function moveTip(evt) {
    const t = tipEl(); if (!t) return;
    const pad = 14, w = t.offsetWidth, h = t.offsetHeight;
    let x = evt.clientX + pad, y = evt.clientY + pad;
    if (x + w > window.innerWidth - 8) x = evt.clientX - w - pad;
    if (y + h > window.innerHeight - 8) y = evt.clientY - h - pad;
    t.style.left = x + "px"; t.style.top = y + "px";
  }
  function hideTip() { const t = tipEl(); if (t) t.classList.remove("is-visible"); }

  function bindTip(node, htmlFn) {
    node.addEventListener("mouseenter", e => showTip(htmlFn(), e));
    node.addEventListener("mousemove", moveTip);
    node.addEventListener("mouseleave", hideTip);
  }

  // ------------------------- Grouped bar chart -----------------------------
  // groups: [{ key, label, values:[…], color }]
  function barChart(container, groups, opts) {
    opts = opts || {};
    const W = 480, H = 300, m = { t: 20, r: 16, b: 42, l: 40 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });

    const rows = groups.map(g => ({ ...g, avg: mean(g.values), n: g.values.length }));
    const maxV = Math.max(1, ...rows.map(r => r.avg)) * 1.18;

    // gridlines + y ticks
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const v = (maxV / ticks) * i;
      const y = m.t + ih - (v / maxV) * ih;
      svg.appendChild(s("line", { class: "grid-line", x1: m.l, y1: y, x2: m.l + iw, y2: y }));
      svg.appendChild(txt(s("text", { class: "axis-text", x: m.l - 8, y: y + 4, "text-anchor": "end" }), v.toFixed(0)));
    }

    const bw = iw / rows.length;
    rows.forEach((r, i) => {
      const bx = m.l + i * bw + bw * 0.18;
      const barW = bw * 0.64;
      const barH = (r.avg / maxV) * ih;
      const by = m.t + ih - barH;
      const rect = s("rect", {
        class: "bar", x: bx, y: by, width: barW, height: Math.max(barH, 0.5),
        rx: 6, fill: r.color, "data-grow": barH
      });
      // animate grow
      rect.setAttribute("height", "0");
      rect.setAttribute("y", m.t + ih);
      requestAnimationFrame(() => {
        rect.style.transition = "height .7s cubic-bezier(.22,.75,.24,1), y .7s cubic-bezier(.22,.75,.24,1)";
        rect.setAttribute("height", Math.max(barH, 0.5));
        rect.setAttribute("y", by);
      });
      bindTip(rect, () => `<span class="tt-title">${r.label}</span>Avg mites: <b>${r.avg.toFixed(1)}</b><br>${opts.groupLabel || "Patients"}: <b>${r.n}</b>`);
      svg.appendChild(rect);

      // value label
      if (r.n > 0) svg.appendChild(txt(s("text", { class: "bar-val", x: bx + barW / 2, y: by - 7, "text-anchor": "middle" }), r.avg.toFixed(1)));
      // x label
      svg.appendChild(txt(s("text", { class: "axis-text", x: bx + barW / 2, y: H - 22, "text-anchor": "middle" }), r.label));
      svg.appendChild(txt(s("text", { class: "axis-text", x: bx + barW / 2, y: H - 8, "text-anchor": "middle", "font-size": "9" }), `n=${r.n}`));
    });

    svg.appendChild(s("line", { class: "axis-line", x1: m.l, y1: m.t + ih, x2: m.l + iw, y2: m.t + ih }));
    render(container, svg);
  }

  // ------------------------- Scatter (age vs mites) ------------------------
  function scatter(container, data) {
    const W = 900, H = 340, m = { t: 18, r: 18, b: 44, l: 44 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });

    const xMin = 10, xMax = 95;
    const yMax = Math.max(10, ...data.map(d => d.demodex)) * 1.12;
    const X = a => m.l + ((a - xMin) / (xMax - xMin)) * iw;
    const Y = v => m.t + ih - (v / yMax) * ih;

    // grid
    for (let i = 0; i <= 4; i++) {
      const v = (yMax / 4) * i, y = Y(v);
      svg.appendChild(s("line", { class: "grid-line", x1: m.l, y1: y, x2: m.l + iw, y2: y }));
      svg.appendChild(txt(s("text", { class: "axis-text", x: m.l - 8, y: y + 4, "text-anchor": "end" }), v.toFixed(0)));
    }
    for (let a = 20; a <= 90; a += 10) {
      svg.appendChild(txt(s("text", { class: "axis-text", x: X(a), y: H - 24, "text-anchor": "middle" }), a));
    }
    svg.appendChild(txt(s("text", { class: "axis-text", x: m.l + iw / 2, y: H - 8, "text-anchor": "middle" }), "Age (years)"));

    // points
    data.forEach((d, i) => {
      const c = GRADE_COLOR[d.collarette] || "#fff";
      const dot = s("circle", { class: "dot", cx: X(d.age), cy: Y(d.demodex), r: 0, fill: c, "fill-opacity": 0.82, stroke: "rgba(255,255,255,.25)" });
      requestAnimationFrame(() => {
        dot.style.transition = "r .5s ease " + (i * 8) + "ms";
        dot.setAttribute("r", 7);
      });
      bindTip(dot, () => `<span class="tt-title">${d.id}</span>Age <b>${d.age}</b> · ${d.sex === "F" ? "Female" : "Male"}<br>Mites: <b>${d.demodex}</b><br>Collarette: <b>${d.collarette}</b>`);
      svg.appendChild(dot);
    });

    svg.appendChild(s("line", { class: "axis-line", x1: m.l, y1: m.t + ih, x2: m.l + iw, y2: m.t + ih }));
    svg.appendChild(s("line", { class: "axis-line", x1: m.l, y1: m.t, x2: m.l, y2: m.t + ih }));
    render(container, svg);
  }

  // ------------------------- Histogram -------------------------------------
  function histogram(container, data) {
    const W = 480, H = 300, m = { t: 20, r: 16, b: 42, l: 40 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });

    const binW = 5, bins = [];
    for (let start = 0; start <= 30; start += binW) bins.push({ start, end: start + binW - 1, count: 0 });
    data.forEach(d => { const idx = Math.min(bins.length - 1, Math.floor(d.demodex / binW)); bins[idx].count++; });
    const maxC = Math.max(1, ...bins.map(b => b.count));

    for (let i = 0; i <= maxC; i++) {
      const y = m.t + ih - (i / maxC) * ih;
      svg.appendChild(s("line", { class: "grid-line", x1: m.l, y1: y, x2: m.l + iw, y2: y }));
      if (i % Math.ceil(maxC / 4 || 1) === 0)
        svg.appendChild(txt(s("text", { class: "axis-text", x: m.l - 8, y: y + 4, "text-anchor": "end" }), i));
    }

    const bw = iw / bins.length;
    bins.forEach((b, i) => {
      const bx = m.l + i * bw + bw * 0.12, barW = bw * 0.76;
      const barH = (b.count / maxC) * ih, by = m.t + ih - barH;
      const hue = 168 - i * 12; // teal → violet-ish
      const rect = s("rect", { class: "bar", x: bx, y: m.t + ih, width: barW, height: 0, rx: 5, fill: `hsl(${hue} 70% 68%)` });
      requestAnimationFrame(() => {
        rect.style.transition = "height .6s cubic-bezier(.22,.75,.24,1) " + (i * 30) + "ms, y .6s cubic-bezier(.22,.75,.24,1) " + (i * 30) + "ms";
        rect.setAttribute("height", Math.max(barH, b.count ? 1 : 0)); rect.setAttribute("y", by);
      });
      bindTip(rect, () => `<span class="tt-title">${b.start}–${b.end} mites</span><b>${b.count}</b> patient${b.count === 1 ? "" : "s"}`);
      svg.appendChild(rect);
      svg.appendChild(txt(s("text", { class: "axis-text", x: bx + barW / 2, y: H - 22, "text-anchor": "middle", "font-size": "10" }), `${b.start}–${b.end}`));
    });
    svg.appendChild(txt(s("text", { class: "axis-text", x: m.l + iw / 2, y: H - 8, "text-anchor": "middle" }), "Mites found (per 8 lashes)"));
    svg.appendChild(s("line", { class: "axis-line", x1: m.l, y1: m.t + ih, x2: m.l + iw, y2: m.t + ih }));
    render(container, svg);
  }

  // ------------------------- Horizontal bars (symptom types) ---------------
  function typeBars(container, data) {
    const counts = {};
    data.forEach(d => (d.types || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    const rows = Object.entries(counts).map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    if (rows.length === 0) {
      container.innerHTML = '<p style="color:var(--ink-mute);font-size:.9rem;padding:20px 4px">No reported symptom types in this selection.</p>';
      return;
    }

    const rowH = 30, W = 480, m = { t: 10, r: 30, b: 10, l: 128 };
    const H = m.t + m.b + rows.length * rowH;
    const iw = W - m.l - m.r;
    const svg = s("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
    const maxC = Math.max(1, ...rows.map(r => r.count));

    rows.forEach((r, i) => {
      const y = m.t + i * rowH;
      const barW = (r.count / maxC) * iw;
      svg.appendChild(txt(s("text", { class: "axis-text", x: m.l - 10, y: y + rowH / 2 + 4, "text-anchor": "end" }), r.label));
      const rect = s("rect", { class: "bar", x: m.l, y: y + 5, width: 0, height: rowH - 12, rx: 5, fill: `hsl(${175 - i * 10} 68% 66%)` });
      requestAnimationFrame(() => { rect.style.transition = "width .6s cubic-bezier(.22,.75,.24,1) " + (i * 40) + "ms"; rect.setAttribute("width", Math.max(barW, 2)); });
      bindTip(rect, () => `<span class="tt-title">${r.label}</span>Reported by <b>${r.count}</b> patient${r.count === 1 ? "" : "s"}`);
      svg.appendChild(rect);
      svg.appendChild(txt(s("text", { class: "bar-val", x: m.l + barW + 8, y: y + rowH / 2 + 4 }), r.count));
    });
    render(container, svg);
  }

  function render(container, svg) { container.innerHTML = ""; container.appendChild(svg); }

  global.CHARTS = { barChart, scatter, histogram, typeBars, GRADE_COLOR, GRADE_ORDER, mean };
})(window);
