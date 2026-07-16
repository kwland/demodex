# Demodex: an interactive science site

An interactive, single-page website about **_Demodex folliculorum_** and **_Demodex brevis_**, the
microscopic mites that live in human eyelash follicles and oil glands, and the eyelid condition they
cause, **Demodex blepharitis**.

It grew out of a local student research project (Project Unity, Bay Area) that looked at how mite
counts line up with eyelid signs and symptoms in a de-identified clinic group.

## Features

- **Interactive 3D mite.** A _Demodex_ built in code (Three.js) that you can rotate, zoom, and
  magnify, with anatomy labels and a switch between the two human species.
- **Data Explorer.** Five live charts and a sortable table driven by the real 43-patient dataset.
  Filter by sex, symptoms, or collarette level and everything updates at once.
- **Twilight background.** An animated starfield over a gradient sky (with a dawn/twilight toggle)
  and layered mountains.
- **Seven tabs:** Home, The Mite, Research, Data Explorer, Eye Health, Treatment, References.
- Fully responsive, keyboard-friendly, and respects `prefers-reduced-motion`.

## Data and privacy

The source spreadsheet contained real **Medical Record Numbers (MRNs)**. Those identifiers have been
**removed**. Each patient appears only as an anonymous study ID (`P01` to `P43`) alongside
de-identified fields (age, sex, collarette grade, mite count, symptom grade). This site is for
**education only** and is **not medical advice**.

## Run it

It is a static site with no build step.

```bash
# from the project folder, start any static server, for example
python -m http.server 8000
# then open http://localhost:8000
```

You can also open `index.html` directly, but the 3D view loads Three.js from a CDN, so it needs an
internet connection. If it cannot load, a labeled drawing is shown instead.

## Deploy to GitHub Pages

1. Create a repository and push these files.
2. In **Settings > Pages**, set the source to your default branch, `/ (root)`.
3. The site goes live at `https://<user>.github.io/<repo>/`.

Keep every file in the **same folder** (flat, no subfolders), because `index.html` links to
`styles.css`, `data.js`, `charts.js`, `app.js`, and `mite3d.js` by their plain names. A `.nojekyll`
file is included so GitHub Pages serves everything untouched.

## Files

```
index.html     markup and tab structure
styles.css     all styling (twilight theme, glass panels, responsive layout)
data.js        de-identified dataset and research content
charts.js      dependency-free SVG charts
app.js         navigation, background, Data Explorer wiring
mite3d.js      the Three.js 3D mite (ES module)
favicon.svg    site icon
```

## Credits

Research and data: student project on _Demodex_ blepharitis, Project Unity (Bay Area). Full
references are on the site's **References** tab.
