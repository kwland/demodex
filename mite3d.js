/* ============================================================================
   mite3d.js  ·  Procedural 3D Demodex mite (Three.js, ES module).
   Loaded via importmap. Falls back to an SVG drawing if the CDN is blocked.

   The model is built to match real microscope views of Demodex folliculorum:
   a long, semi-transparent, finely ringed body; a fat leg-bearing front third
   with four pairs of short stubby legs; and a small mouth cone up front.
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
      <svg viewBox="0 0 340 190" width="300" style="max-width:82%">
        <defs><linearGradient id="fbg" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stop-color="#f0e7d5"/><stop offset="1" stop-color="#cdb98f"/>
        </linearGradient></defs>
        <g stroke="#6b5a3f" stroke-width="2.2" stroke-linecap="round" opacity=".8">
          <line x1="118" y1="108" x2="104" y2="140"/><line x1="132" y1="112" x2="124" y2="146"/>
          <line x1="146" y1="113" x2="142" y2="148"/><line x1="160" y1="112" x2="160" y2="149"/>
        </g>
        <path d="M120 95 q90 -34 175 4 q8 8 0 16 q-95 34 -175 3 q-10 -12 0 -23 Z" fill="url(#fbg)" stroke="#8a744f" stroke-width="1.4"/>
        <g stroke="#b39c6f" stroke-width="1" opacity=".55" fill="none">
          <path d="M180 82 q4 25 -2 46"/><path d="M210 80 q4 27 -2 50"/><path d="M240 82 q4 24 -2 45"/>
          <path d="M266 86 q3 20 -2 38"/><path d="M289 92 q2 14 -2 26"/></g>
        <path d="M120 95 q-16 0 -22 12 q10 5 22 6 Z" fill="#c9b48d" stroke="#8a744f" stroke-width="1.2"/>
        <path d="M98 106 l-12 -3 l3 4 l-3 4 z" fill="#7d6748"/>
      </svg>
      <p style="font-size:.9rem;max-width:38ch">The interactive 3D view needs an internet connection to load
      the graphics engine. For now, here is a drawing of <em>Demodex</em> with its long ringed body, tiny
      legs bunched at the front, and pointed mouth.</p>
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
  renderer.toneMappingExposure = 1.15;
  canvasEl.appendChild(renderer.domElement);

  // --- Scene & camera ---
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width() / height(), 0.1, 100);
  camera.position.set(4.2, 1.5, 4.6);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;

  // --- Lights (bright, neutral, specimen-under-scope feel) ---
  scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x4a3a3a, 0.7));
  const key = new THREE.DirectionalLight(0xfff4e6, 2.0); key.position.set(5, 7, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xbcd0ff, 1.1); rim.position.set(-6, 3, -5); scene.add(rim);
  const belly = new THREE.PointLight(0xffd8c0, 0.5, 40); belly.position.set(0, -4, 3); scene.add(belly);

  // --- Controls ---
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 2.4;
  controls.maxDistance = 9;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.9;
  controls.target.set(0, -0.15, 0);

  // --- Materials ---
  // Semi-transparent cuticle: light passes through and darkens with thickness,
  // which reproduces the "you can see into it" look under a microscope.
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0e7d4, roughness: 0.34, metalness: 0.0,
    transmission: 0.30, thickness: 0.9, ior: 1.36,
    attenuationColor: 0xb59a6a, attenuationDistance: 2.2,
    clearcoat: 0.6, clearcoatRoughness: 0.3,
    sheen: 0.6, sheenColor: 0xfff1de, sheenRoughness: 0.5,
    specularIntensity: 0.8, emissive: 0x2a2418, emissiveIntensity: 0.12
  });
  const legMat = new THREE.MeshPhysicalMaterial({ color: 0xcdb890, roughness: 0.5, metalness: 0, clearcoat: 0.35, transmission: 0.15, thickness: 0.3 });
  const clawMat = new THREE.MeshStandardMaterial({ color: 0x6f5a3c, roughness: 0.6 });
  const mouthMat = new THREE.MeshPhysicalMaterial({ color: 0xb5a074, roughness: 0.45, clearcoat: 0.4 });
  const allMats = [bodyMat, legMat, clawMat, mouthMat];

  // --- Mite group ---
  const mite = new THREE.Group();
  scene.add(mite);
  let species = "folliculorum";
  let anchors = {};
  let wireOn = false;
  function applyWire(on) { wireOn = on; allMats.forEach(m => { m.wireframe = on; }); }

  // Body silhouette + fine ring striations, as a revolved (lathe) profile.
  // t runs 0 (tail tip) -> 1 (head). Returns Vector2(radius, position).
  function buildProfile(length, maxR, kind) {
    const pts = [];
    const N = 240;
    const ringFreq = kind === "brevis" ? 26 : 46;   // striations per body
    const ringAmp = kind === "brevis" ? 0.045 : 0.055;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      let r;
      if (t < 0.60) {                       // opisthosoma: long ringed tail
        const u = t / 0.60;
        r = maxR * (0.34 + 0.66 * Math.pow(u, 0.55));
        if (u < 0.05) r *= Math.sqrt(u / 0.05);   // rounded tail tip
      } else if (t < 0.86) {                // podosoma: widest, gentle bulge
        const u = (t - 0.60) / 0.26;
        r = maxR * (0.99 + 0.06 * Math.sin(u * Math.PI));
      } else {                              // gnathosoma base: taper to snout
        const u = (t - 0.86) / 0.14;
        r = maxR * (0.9 - 0.72 * u);
      }
      // transverse rings, strongest along the tail, fading over the head
      const fade = t < 0.7 ? 1 : Math.max(0, 1 - (t - 0.7) / 0.16);
      r *= 1 + ringAmp * Math.sin(t * Math.PI * ringFreq) * fade;
      pts.push(new THREE.Vector2(Math.max(0.012, r), t * length));
    }
    return pts;
  }

  function radiusAt(profile, t, length) {
    const targetY = t * length;
    let best = profile[0];
    for (const p of profile) if (Math.abs(p.y - targetY) < Math.abs(best.y - targetY)) best = p;
    return best.x;
  }

  // A short, stubby, three-segment leg pointing down from the origin.
  function makeLeg() {
    const leg = new THREE.Group();
    const coxa = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.075, 0.17, 10), legMat);
    coxa.position.y = -0.085; leg.add(coxa);

    const knee = new THREE.Group(); knee.position.y = -0.17; knee.rotation.x = 0.85; leg.add(knee);
    const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.05, 0.14, 9), legMat);
    femur.position.y = -0.07; knee.add(femur);

    const ankle = new THREE.Group(); ankle.position.y = -0.14; ankle.rotation.x = 0.7; knee.add(ankle);
    const tarsus = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.038, 0.10, 8), legMat);
    tarsus.position.y = -0.05; ankle.add(tarsus);

    const claw = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 6), clawMat);
    claw.position.y = -0.12; claw.rotation.x = Math.PI; ankle.add(claw);
    return leg;
  }

  function build(kind) {
    while (mite.children.length) {
      const c = mite.children.pop();
      c.traverse && c.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    }
    const isFoll = kind === "folliculorum";
    const length = isFoll ? 3.6 : 2.15;
    const maxR = isFoll ? 0.33 : 0.44;

    // Body
    const profile = buildProfile(length, maxR, kind);
    const bodyGeo = new THREE.LatheGeometry(profile, 96);
    bodyGeo.computeVertexNormals();
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;      // length axis -> Z
    body.position.z = -length / 2;      // centre on origin, head toward +Z
    mite.add(body);

    // Gnathosoma (mouth cone + palps) at the head
    const head = new THREE.Group(); mite.add(head);
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.4, 14), mouthMat);
    snout.rotation.x = -Math.PI / 2;
    snout.position.z = length / 2 + 0.14;
    head.add(snout);
    [-1, 1].forEach(side => {
      const palp = new THREE.Mesh(new THREE.CapsuleGeometry(0.028, 0.16, 4, 8), mouthMat);
      palp.position.set(side * 0.07, -0.02, length / 2 + 0.06);
      palp.rotation.x = -Math.PI / 2.2; palp.rotation.z = side * 0.35;
      head.add(palp);
    });

    // Legs: four pairs bunched under the podosoma (front third)
    const legGroup = new THREE.Group(); mite.add(legGroup);
    const legTs = isFoll ? [0.64, 0.71, 0.78, 0.85] : [0.6, 0.69, 0.78, 0.86];
    legTs.forEach((t, i) => {
      const zc = -length / 2 + t * length;
      const rr = radiusAt(profile, t, length);
      [-1, 1].forEach(side => {
        const leg = makeLeg();
        leg.scale.setScalar(isFoll ? 1 : 1.12);
        leg.position.set(side * rr * 0.7, -rr * 0.7, zc);
        leg.rotation.z = side * (0.55 + i * 0.03);   // splay outward
        leg.rotation.x = 0.12 - i * 0.06;            // front legs lean forward
        legGroup.add(leg);
      });
    });

    // Label anchors (world space; the group sits at the origin)
    anchors = {
      gnathosoma: new THREE.Vector3(0, 0.14, length / 2 + 0.3),
      podosoma: new THREE.Vector3(maxR * 1.15, 0.26, -length / 2 + 0.75 * length),
      leg: new THREE.Vector3(-maxR * 1.7, -0.62, -length / 2 + 0.72 * length),
      opisthosoma: new THREE.Vector3(0, 0.2, -length / 2 + 0.18 * length)
    };

    applyWire(wireOn);
  }

  build(species);

  // --- HTML anatomy labels ---
  const labelData = [
    { key: "gnathosoma", html: "<b>Gnathosoma</b> · mouth" },
    { key: "podosoma", html: "<b>Podosoma</b> · leg region" },
    { key: "leg", html: "<b>4 pairs of legs</b>" },
    { key: "opisthosoma", html: "<b>Opisthosoma</b> · ringed tail" }
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
      l.el.style.left = (v.x * 0.5 + 0.5) * w + "px";
      l.el.style.top = (-v.y * 0.5 + 0.5) * h + "px";
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

  const dMin = controls.minDistance, dMax = controls.maxDistance;
  const distToMag = d => Math.round(40 + (dMax - d) / (dMax - dMin) * 360);
  const magToDist = m => dMax - (m - 40) / 360 * (dMax - dMin);
  function setMag(m) {
    const d = magToDist(Math.max(40, Math.min(400, m)));
    const dir = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(controls.target).add(dir.multiplyScalar(d));
  }
  if (ctlMag) ctlMag.addEventListener("input", e => setMag(+e.target.value));

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

  let firstFrame = true;
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    const dist = camera.position.distanceTo(controls.target);
    const mag = distToMag(dist);
    if (magVal) magVal.textContent = mag;
    if (ctlMag && document.activeElement !== ctlMag) ctlMag.value = mag;
    updateLabels();
    renderer.render(scene, camera);
    if (firstFrame) { firstFrame = false; setTimeout(() => loadingEl && loadingEl.classList.add("is-hidden"), 220); }
  }
  animate();

  setTimeout(resize, 60);
  setTimeout(resize, 500);
}
