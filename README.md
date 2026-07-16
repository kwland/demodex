# Demodex — an interactive science site

An interactive, single-page website about **_Demodex folliculorum_** and **_Demodex brevis_** —
the microscopic mites that live in human eyelash follicles and oil glands — and the eyelid
condition they cause, **Demodex blepharitis**.

Built from a community-based student research project (Project Unity, Bay Area) that examined how
mite counts relate to eyelid signs and symptoms in a de-identified clinic cohort.

## ✨ Features

- **Interactive 3D mite** — a procedurally generated _Demodex_ you can rotate, zoom, and
  magnify (Three.js), with anatomy labels and a morph between the two human species.
- **Data Explorer** — five live charts and a sortable table driven by the real 43-patient
  dataset. Filter by sex, symptoms, or collarette level and everything updates.
- **Twilight background** — an animated starfield + gradient sky (with a dawn/twilight toggle)
  and layered mountain silhouettes.
- **Seven tabs** — Home, The Mite, Research, Data Explorer, Eye Health, Treatment, References.
- Fully responsive, keyboard-navigable, and respects `prefers-reduced-motion`.

## 🔒 Data & privacy

The source clinical spreadsheet contained real **Medical Record Numbers (MRNs)**. Those
identifiers have been **removed**. Each patient appears only as an anonymous study ID (`P01`–`P43`)
alongside de-identified fields (age, sex, collarette grade, mite count, symptom grade).
This site is for **education only** and is **not medical advice**.

## 🚀 Run it

It's a static site — no build step.

```bash
# from the project folder, start any static server, e.g.
python -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser. The 3D model loads Three.js from a CDN, so an internet
connection is needed for that view (a labelled illustration is shown as a fallback if offline).

## 📦 Deploy to GitHub Pages

1. Create a repository and push this folder.
2. In **Settings → Pages**, set the source to your default branch, `/ (root)`.
3. Your site will be live at `https://<user>.github.io/<repo>/`.

A `.nojekyll` file is included so GitHub Pages serves the `js/` folder untouched.

## 🗂 Structure

```
index.html          # markup + tab structure
css/styles.css      # all styling (twilight theme, glassmorphism, responsive)
js/data.js          # de-identified dataset + research content
js/charts.js        # dependency-free SVG charts
js/app.js           # navigation, background, Data Explorer wiring
js/mite3d.js        # Three.js 3D mite (ES module)
assets/favicon.svg
```

## 🙏 Credits

Research and data: student project on _Demodex_ blepharitis, Project Unity (Bay Area).
References are listed in full on the site's **References** tab.
