/* ============================================================================
   app.js · Navigation, background, content population, and the Data Explorer.
   ========================================================================== */

(function () {
  "use strict";
  const D = window.DEMODEX;
  const C = window.CHARTS;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* -------------------------- Tab navigation ----------------------------- */
  const nav = $("#nav");
  const burger = $("#navBurger");
  function goTab(id) {
    $$(".panel").forEach(p => p.classList.toggle("is-active", p.id === "tab-" + id));
    $$(".nav__link").forEach(l => l.classList.toggle("is-active", l.dataset.tab === id));
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
    // re-run reveal for the newly shown panel
    requestAnimationFrame(runReveal);
    // charts need a (re)draw if visiting data tab first time
    if (id === "data") ensureData();
    if (id === "mite" && window.__miteResize) window.__miteResize();
  }
  document.addEventListener("click", e => {
    const t = e.target.closest("[data-tab]");
    if (t) { e.preventDefault(); goTab(t.dataset.tab); }
  });
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });

  /* -------------------------- Sky toggle --------------------------------- */
  $("#skyToggle").addEventListener("click", () => {
    const b = document.body;
    b.dataset.sky = b.dataset.sky === "twilight" ? "dawn" : "twilight";
  });

  /* -------------------------- Starfield ---------------------------------- */
  (function starfield() {
    const cv = $("#starfield"), ctx = cv.getContext("2d");
    let stars = [], motes = [], w, h, raf;
    function resize() {
      w = cv.width = window.innerWidth; h = cv.height = window.innerHeight;
      const n = Math.min(180, Math.round(w * h / 9000));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h * 0.72,
        r: Math.random() * 1.3 + 0.2, tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.005
      }));
      motes = Array.from({ length: 26 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 2.2 + 0.6, vx: (Math.random() - 0.5) * 0.15,
        vy: -(Math.random() * 0.12 + 0.03), a: Math.random() * 0.4 + 0.1
      }));
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        st.tw += st.sp;
        const a = 0.4 + Math.sin(st.tw) * 0.4;
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill();
      }
      for (const mo of motes) {
        mo.x += mo.vx; mo.y += mo.vy;
        if (mo.y < -5) { mo.y = h + 5; mo.x = Math.random() * w; }
        if (mo.x < -5) mo.x = w + 5; if (mo.x > w + 5) mo.x = -5;
        ctx.globalAlpha = mo.a;
        ctx.fillStyle = "rgba(200,220,255,.9)";
        ctx.beginPath(); ctx.arc(mo.x, mo.y, mo.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    resize(); frame();
    let to; window.addEventListener("resize", () => { clearTimeout(to); to = setTimeout(resize, 150); });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { cancelAnimationFrame(raf); ctx.clearRect(0, 0, w, h); for (const st of stars) { ctx.globalAlpha = 0.7; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill(); } }
  })();

  /* -------------------------- Reveal on scroll --------------------------- */
  let io;
  function runReveal() {
    if (!io) {
      io = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
      }, { threshold: 0.12 });
    }
    $$(".panel.is-active .reveal:not(.is-in)").forEach(el => io.observe(el));
  }

  /* -------------------------- Count-up animation ------------------------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const dur = 1100, t0 = performance.now();
    function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec) + suffix;
    }
    requestAnimationFrame(step);
  }
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { animateCount(en.target); countObserver.unobserve(en.target); } });
  }, { threshold: 0.5 });

  /* -------------------------- Static content ----------------------------- */
  // Epidemiology cards (home)
  $("#epiRow").innerHTML = D.EPIDEMIOLOGY.map(e => `
    <div class="epi reveal">
      <div class="epi__val"><span data-count="${e.value}" data-suffix="${e.suffix}">0${e.suffix}</span></div>
      <div class="epi__label">${e.label}</div>
      <div class="epi__src">Source ${e.source}</div>
    </div>`).join("");

  // Facts
  $("#factList").innerHTML = D.FACTS.map(f => `<li>${f}</li>`).join("");

  // Lifecycle
  $("#lifecycle").innerHTML = D.LIFECYCLE.map(l => `
    <div class="lc-stage">
      <div class="lc-stage__dot"></div>
      <h4>${l.stage}</h4>
      <div class="lc-days">${l.days}</div>
      <p>${l.text}</p>
    </div>`).join("");

  // Conditions
  const condIcon = () => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
  $("#condGrid").innerHTML = D.CONDITIONS.map(c => `
    <article class="cond">
      <div class="cond__icon">${condIcon()}</div>
      <h4>${c.name}</h4>
      <p>${c.text}</p>
    </article>`).join("");

  // Risk chips
  $("#riskChips").innerHTML = D.RISK_FACTORS.map(r => `<span class="risk-chip">${r}</span>`).join("");

  // Treatments
  $("#treatGrid").innerHTML = D.TREATMENTS.map(t => `
    <article class="treat">
      <span class="treat__tag">${t.tag}</span>
      <h4>${t.name}</h4>
      <p>${t.text}</p>
      <span class="treat__rank">${t.rank}</span>
    </article>`).join("");

  // References
  $("#refList").innerHTML = D.REFERENCES.map(r => `
    <li><span>${r.cite} ${r.url ? `<a href="${r.url}" target="_blank" rel="noopener">${r.url}</a>` : ""}</span></li>`).join("");

  /* -------------------------- Species card (3D tab) ---------------------- */
  const speciesCard = $("#speciesCard");
  function renderSpecies(key) {
    const sp = D.SPECIES[key];
    speciesCard.innerHTML = `
      <div class="sc-tag">${sp.tag}</div>
      <h3>${sp.name}</h3>
      <dl>
        <dt>Length</dt><dd>${sp.length}</dd>
        <dt>Lives in</dt><dd>${sp.home}</dd>
        <dt>Body</dt><dd>${sp.shape}</dd>
        <dt>Legs</dt><dd>${sp.legs}</dd>
      </dl>
      <p class="sc-note">${sp.note}</p>`;
  }
  renderSpecies("folliculorum");
  $$(".species-btn").forEach(b => b.addEventListener("click", () => {
    $$(".species-btn").forEach(x => x.classList.remove("is-active"));
    b.classList.add("is-active");
    renderSpecies(b.dataset.species);
    if (window.__miteSetSpecies) window.__miteSetSpecies(b.dataset.species);
  }));

  /* ======================================================================
     DATA EXPLORER
     ==================================================================== */
  const filters = { sex: "all", symptomatic: "all", collarette: "all" };
  let sortKey = "demodex", sortDir = -1, dataInit = false;

  function filtered() {
    return D.DATA.filter(d =>
      (filters.sex === "all" || d.sex === filters.sex) &&
      (filters.symptomatic === "all" || d.symptomatic === filters.symptomatic) &&
      (filters.collarette === "all" || d.collarette === filters.collarette)
    );
  }

  function renderStats(rows) {
    const counts = rows.map(r => r.demodex).sort((a, b) => a - b);
    const n = counts.length;
    const avg = n ? C.mean(counts) : 0;
    const median = n ? (n % 2 ? counts[(n - 1) / 2] : (counts[n / 2 - 1] + counts[n / 2]) / 2) : 0;
    const max = n ? counts[n - 1] : 0;
    const cards = [
      { v: n, l: "Patients in view" },
      { v: avg.toFixed(1), l: "Average mites" },
      { v: median, l: "Median mites" },
      { v: max, l: "Highest count" }
    ];
    $("#statCards").innerHTML = cards.map(c => `
      <div class="stat-card"><div class="stat-card__val">${c.v}</div><div class="stat-card__label">${c.l}</div></div>`).join("");
  }

  function renderCharts(rows) {
    // by collarette
    C.barChart($("#chartCollarette"), C.GRADE_ORDER.map(g => ({
      key: g, label: cap(g), color: C.GRADE_COLOR[g],
      values: rows.filter(r => r.collarette === g).map(r => r.demodex)
    })));
    // by symptom
    C.barChart($("#chartSymptom"), C.GRADE_ORDER.map(g => ({
      key: g, label: cap(g), color: C.GRADE_COLOR[g],
      values: rows.filter(r => r.symptom === g).map(r => r.demodex)
    })));
    // scatter
    C.scatter($("#chartScatter"), rows);
    $("#scatterLegend").innerHTML = C.GRADE_ORDER.map(g =>
      `<i style="--c:${C.GRADE_COLOR[g]}">${cap(g)}</i>`).join("");
    // histogram + types
    C.histogram($("#chartHist"), rows);
    C.typeBars($("#chartTypes"), rows);
  }

  function renderTable(rows) {
    const sorted = [...rows].sort((a, b) => {
      let A = a[sortKey], B = b[sortKey];
      if (sortKey === "collarette" || sortKey === "symptom") { A = C.GRADE_ORDER.indexOf(A); B = C.GRADE_ORDER.indexOf(B); }
      if (typeof A === "string") return sortDir * A.localeCompare(B);
      return sortDir * (A - B);
    });
    $("#dataTableBody").innerHTML = sorted.map(r => `
      <tr>
        <td>${r.id}</td>
        <td>${r.age}</td>
        <td>${r.sex}</td>
        <td><span class="pill pill--${r.collarette}">${cap(r.collarette)}</span></td>
        <td><b>${r.demodex}</b></td>
        <td><span class="pill pill--${r.symptom}">${cap(r.symptom)}</span></td>
      </tr>`).join("");
    $("#tableCount").textContent = `${rows.length} of ${D.DATA.length} patients`;
  }

  function refresh() {
    const rows = filtered();
    renderStats(rows);
    renderCharts(rows);
    renderTable(rows);
  }
  function ensureData() { if (!dataInit) { dataInit = true; refresh(); } }

  // filter controls
  $$("#filters .seg").forEach(seg => {
    seg.addEventListener("click", e => {
      const btn = e.target.closest("button"); if (!btn) return;
      seg.querySelectorAll("button").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      filters[seg.dataset.filter] = btn.dataset.val;
      refresh();
    });
  });
  $("#filterReset").addEventListener("click", () => {
    filters.sex = filters.symptomatic = filters.collarette = "all";
    $$("#filters .seg").forEach(seg => {
      seg.querySelectorAll("button").forEach((b, i) => b.classList.toggle("is-active", i === 0));
    });
    refresh();
  });

  // sortable headers
  $$("#dataTable th").forEach(th => th.addEventListener("click", () => {
    const key = th.dataset.sort;
    if (sortKey === key) sortDir *= -1; else { sortKey = key; sortDir = (key === "demodex" || key === "age") ? -1 : 1; }
    $$("#dataTable th").forEach(h => { h.classList.remove("is-sorted"); h.textContent = h.textContent.replace(/[▾▴]/g, "").trim(); });
    th.classList.add("is-sorted");
    th.textContent = th.textContent + " " + (sortDir === -1 ? "▾" : "▴");
    renderTable(filtered());
  }));

  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : "n/a";

  /* -------------------------- Init --------------------------------------- */
  function init() {
    // start count-up on any element with data-count
    $$("[data-count]").forEach(el => countObserver.observe(el));
    runReveal();
  }
  init();
})();
