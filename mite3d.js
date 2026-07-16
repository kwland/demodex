/* ============================================================================
   mite3d.js — Procedural 3D Demodex mite (Three.js, ES module).
   Loaded via importmap. Fails gracefully to an SVG illustration if the CDN
   is unreachable.
   ========================================================================== */

const loadingEl = document.getElementById("miteLoading");
const canvasEl = document.getElementById("miteCanvas");
const labelsEl = document.getElementById("miteLabels");

(async function boot() {
  let THREE, OrbitControls, RoomEnvironment;
  try {
    THREE = await import("three");
    ({ OrbitControls } = await import("three/addons/controls/OrbitControls.js"));
    ({ RoomEnvironment } = await import("three/addons/environments/RoomEnvironment.js"));
  } catch (err) {
    console.warn("Three.js failed to load, using fallback illustration.", err);
    showFallback();
    return;
  }
  try {
    run(THREE, OrbitControls, RoomEnvironment);
  } catch (err) {
    console.error("3D init error", err);
    showFallback();
  }
})();

function showFallback() {
  if (loadingEl) loadingEl.classList.add("is-hidden");
  if (labelsEl) labelsEl.style.display = "none";
  canvasEl.innerHTML = `
    <div style="position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:14px;padding:24px;text-align:center;color:var(--ink-soft)">
      <svg viewBox="0 0 320 200" width="280" style="max-width:80%">
        <defs><linearGradient id="fbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#efe4cf"/><stop offset="1" stop-color="#c9b48d"/>
        </linearGradient></defs>
        <g stroke="#3a2b4d" stroke-width="2.4" stroke-linecap="round" opacity=".85">
          <line x1="150" y1="96" x2="110" y2="60"/><line x1="158" y1="100" x2="120" y2="72"/>
          <line x1="150" y1="104" x2="112" y2="128"/><line x1="158" y1="100" x2="122" y2="136"/>
          <line x1="150" y1="96" x2="150" y2="52"/><line x1="158" y1="104" x2="150" y2="150"/>
          <line x1="150" y1="98" x2="108" y2="94"/><line x1="158" y1="102" x2="112" y2="112"/>
        </g>
        <ellipse cx="196" cy="100" rx="96" ry="30" fill="url(#fbg)" stroke="#8a744f" stroke-width="1.5"/>
        <ellipse cx="150" cy="100" rx="26" ry="30" fill="#e3d3b0" stroke="#8a744f" stroke-width="1.5"/>
        <path d="M120 100 l-16 -5 l4 5 l-4 5 z" fill="#b89b6c"/>
        <g stroke="#a98f63" stroke-width="1" opacity=".5">
          <line x1="210" y1="74" x2="210" y2="126"/><line x1="240" y1="78" x2="240" y2="122"/><line x1="266" y1="84" x2="266" y2="116"/></g>
      </svg>
      <p style="font-size:.9rem;max-width:36ch">Interactive 3D view needs an internet connection to load the
      graphics engine. Here's an illustration of <em>Demodex</em> in the meantime — its long body,
      eight stubby legs, and needle-like mouthparts.</p>
    </div>`;
}

function run(THREE, OrbitControls, RoomEnvironment) {
  const width = () => canvasEl.clientWidth || canvasEl.offsetWidth || 640;
  const height = () => canvasEl.clientHeight || canvasEl.offsetHeight || 460;

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width(), height());
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  canvasEl.appendChild(renderer.domElement);

  // --- Scene & camera ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width() / height(), 0.1, 100);
  camera.position.set(3.4, 1.6, 5.2);

  // Environment for glossy reflections
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  // --- Lights ---
  scene.add(new THREE.HemisphereLight(0xbfd0ff, 0x442a55, 0.6));
  const key = new THREE.DirectionalLight(0xfff0e0, 1.5); key.position.set(4, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0x88aaff, 0.9); rim.position.set(-5, 2, -4); scene.add(rim);
  const fill = new THREE.PointLight(0xff9fb5, 0.6, 30); fill.position.set(-3, -2, 4); scene.add(fill);

  // --- Controls ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 2.6;
  controls.maxDistance = 9;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;
  controls.target.set(0, 0, 0);

  // --- Materials ---
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xe9dcc0, roughness: 0.35, metalness: 0.0,
    clearcoat: 0.7, clearcoatRoughness: 0.35,
    transmission: 0.25, thickness: 1.2, ior: 1.35,
    sheen: 0.6, sheenColor: 0xfff2e0
  });
  const legMat = new THREE.MeshPhysicalMaterial({ color: 0xcbb890, roughness: 0.5, clearcoat: 0.4 });
  const mouthMat = new THREE.MeshStandardMaterial({ color: 0x9a7f55, roughness: 0.6 });
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xbda676, roughness: 0.65, transparent: true, opacity: 0.5 });

  const allMats = [bodyMat, legMat, mouthMat, ringMat];

  // --- Build the mite ---
  const mite = new THREE.Group();
  scene.add(mite);
  let species = "folliculorum";
  let anchors = {}; // label anchors in world space
  let wireOn = false;
  function applyWire(on) { wireOn = on; allMats.forEach(m => { m.wireframe = on; }); }

  function buildProfile(length, maxR) {
    // Returns Vector2[] (x=radius, y=position 0..length). Front (head) at top.
    const pts = [];
    const N = 40;
    for (let i = 0; i <= N; i++) {
      const t = i / N;               // 0 tail → 1 head
      let r;
      if (t < 0.5) {                 // opisthosoma: long taper from tip
        const u = t / 0.5;
        r = maxR * Math.pow(u, 0.62) * (0.6 + 0.4 * u);
      } else if (t < 0.82) {         // podosoma: widest
        r = maxR * (0.96 + 0.06 * Math.sin((t - 0.5) / 0.32 * Math.PI));
      } else {                       // gnathosoma / head: round off
        const u = (t - 0.82) / 0.18;
        r = maxR * (0.9 - 0.72 * u);
      }
      r = Math.max(0.018, r);
      pts.push(new THREE.Vector2(r, t * length));
    }
    return pts;
  }

  function makeLeg(THREE) {
    const leg = new THREE.Group();
    const femurGeo = new THREE.CylinderGeometry(0.045, 0.055, 0.42, 10);
    const femur = new THREE.Mesh(femurGeo, legMat);
    femur.position.y = -0.21; leg.add(femur);
    const tibiaGeo = new THREE.CylinderGeometry(0.03, 0.045, 0.34, 10);
    const tibia = new THREE.Mesh(tibiaGeo, legMat);
    tibia.position.set(0, -0.16, 0);
    const knee = new THREE.Group();
    knee.position.y = -0.42; knee.rotation.x = 0.9; knee.add(tibia);
    leg.add(knee);
    const footGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const foot = new THREE.Mesh(footGeo, legMat); foot.position.y = -0.32; knee.add(foot);
    return leg;
  }

  let bodyMesh, ringGroup, legGroup, mouthGroup;

  function build(kind) {
    // clear previous
    while (mite.children.length) {
      const c = mite.children.pop();
      c.traverse && c.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    }

    const isFoll = kind === "folliculorum";
    const length = isFoll ? 3.5 : 2.1;
    const maxR = isFoll ? 0.34 : 0.42;

    // Body (lathe) — revolve profile, lay along Z, center it
    const profile = buildProfile(length, maxR);
    const bodyGeo = new THREE.LatheGeometry(profile, 48);
    bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.rotation.x = Math.PI / 2;   // Y axis (length) → Z
    bodyMesh.position.z = -length / 2;   // center on origin, head toward +Z
    mite.add(bodyMesh);

    // Segmentation rings on opisthosoma (tail half)
    ringGroup = new THREE.Group(); mite.add(ringGroup);
    const nRings = isFoll ? 7 : 4;
    for (let i = 0; i < nRings; i++) {
      const t = 0.06 + (i / nRings) * 0.42;      // along tail
      const zc = -length / 2 + t * length;
      const rr = radiusAt(profile, t, length);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(rr * 0.98, 0.012, 8, 40), ringMat);
      ring.position.z = zc;
      ringGroup.add(ring);
    }

    // Legs — 4 pairs on podosoma (front third)
    legGroup = new THREE.Group(); mite.add(legGroup);
    const legTs = [0.6, 0.68, 0.76, 0.84];
    legTs.forEach((t, i) => {
      const zc = -length / 2 + t * length;
      const rr = radiusAt(profile, t, length);
      [-1, 1].forEach(side => {
        const leg = makeLeg(THREE);
        leg.position.set(side * rr * 0.85, -rr * 0.35, zc);
        leg.rotation.z = side * (0.9 + i * 0.02);
        leg.rotation.y = side * -0.25;
        legGroup.add(leg);
      });
    });

    // Gnathosoma (mouthparts) at head tip (+Z)
    mouthGroup = new THREE.Group(); mite.add(mouthGroup);
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.34, 12), mouthMat);
    snout.rotation.x = -Math.PI / 2;
    snout.position.z = length / 2 + 0.12;
    mouthGroup.add(snout);
    [-1, 1].forEach(side => {
      const palp = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.26, 8), mouthMat);
      palp.position.set(side * 0.06, 0, length / 2 + 0.05);
      palp.rotation.x = -Math.PI / 2.3; palp.rotation.z = side * 0.3;
      mouthGroup.add(palp);
    });

    // Label anchors (world space; group sits at origin)
    anchors = {
      gnathosoma: new THREE.Vector3(0, 0.12, length / 2 + 0.28),
      podosoma: new THREE.Vector3(maxR * 1.1, 0.28, -length / 2 + 0.72 * length),
      leg: new THREE.Vector3(-maxR * 1.6, -0.5, -length / 2 + 0.7 * length),
      opisthosoma: new THREE.Vector3(0, 0.18, -length / 2 + 0.12 * length)
    };

    applyWire(wireOn);
  }

  function radiusAt(profile, t, length) {
    const targetY = t * length;
    let best = profile[0];
    for (const p of profile) if (Math.abs(p.y - targetY) < Math.abs(best.y - targetY)) best = p;
    return best.x;
  }

  build(species);

  // --- HTML anatomy labels ---
  const labelData = [
    { key: "gnathosoma", html: "<b>Gnathosoma</b> · mouthparts" },
    { key: "podosoma", html: "<b>Podosoma</b> · leg region" },
    { key: "leg", html: "<b>4 pairs of legs</b>" },
    { key: "opisthosoma", html: "<b>Opisthosoma</b> · abdomen" }
  ];
  const labelEls = labelData.map(d => {
    const el = document.createElement("div");
    el.className = "mite-label"; el.innerHTML = d.html;
    labelsEl.appendChild(el);
    return { ...d, el };
  });
  let labelsOn = true;

  function updateLabels() {
    const w = width(), h = height();
    labelEls.forEach(l => {
      if (!labelsOn) { l.el.style.opacity = "0"; return; }
      const v = anchors[l.key].clone().project(camera);
      const behind = v.z > 1;
      const x = (v.x * 0.5 + 0.5) * w;
      const y = (-v.y * 0.5 + 0.5) * h;
      l.el.style.left = x + "px"; l.el.style.top = y + "px";
      l.el.style.opacity = behind ? "0" : "1";
    });
  }

  // --- Controls wiring ---
  const ctlSpin = document.getElementById("ctlSpin");
  const ctlLabels = document.getElementById("ctlLabels");
  const ctlWire = document.getElementById("ctlWire");
  const ctlMag = document.getElementById("ctlMag");
  const magVal = document.getElementById("magVal");

  if (ctlSpin) ctlSpin.addEventListener("change", e => { controls.autoRotate = e.target.checked; });
  if (ctlLabels) ctlLabels.addEventListener("change", e => { labelsOn = e.target.checked; });
  if (ctlWire) ctlWire.addEventListener("change", e => applyWire(e.target.checked));

  // Magnification ⇄ camera distance
  const dMin = controls.minDistance, dMax = controls.maxDistance;
  const distToMag = d => Math.round(40 + (dMax - d) / (dMax - dMin) * 360);
  const magToDist = m => dMax - (m - 40) / 360 * (dMax - dMin);
  function setMag(m) {
    const d = magToDist(Math.max(40, Math.min(400, m)));
    const dir = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(controls.target).add(dir.multiplyScalar(d));
  }
  if (ctlMag) ctlMag.addEventListener("input", e => setMag(+e.target.value));

  // Species switching (called from app.js)
  window.__miteSetSpecies = function (kind) {
    if (kind === species) return;
    species = kind; build(kind); applyWire(wireOn);
  };
  window.__miteResize = resize;

  function resize() {
    const w = width(), h = height();
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  let rto; window.addEventListener("resize", () => { clearTimeout(rto); rto = setTimeout(resize, 120); });

  // Reveal after first frames
  let firstFrame = true;

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // keep badge + slider synced with current distance
    const dist = camera.position.distanceTo(controls.target);
    const mag = distToMag(dist);
    if (magVal) magVal.textContent = mag;
    if (ctlMag && document.activeElement !== ctlMag) ctlMag.value = mag;
    updateLabels();
    renderer.render(scene, camera);
    if (firstFrame) { firstFrame = false; setTimeout(() => loadingEl && loadingEl.classList.add("is-hidden"), 220); }
  }
  animate();

  // A resize once layout settles (tab may start hidden)
  setTimeout(resize, 60);
  setTimeout(resize, 500);
}
