/* ============================================================================
   data.js — De-identified study data + research content for the Demodex site.

   PRIVACY NOTE: The source spreadsheet contained real Medical Record Numbers
   (MRNs). Those are protected identifiers and have been removed. Each record
   below is labelled with an anonymous study ID (P01–P43). Only de-identified
   clinical fields (age, sex, collarette grade, mite count, symptom grade) are
   retained.
   ========================================================================== */

(function (global) {
  "use strict";

  // --- The 43-patient study cohort (de-identified) --------------------------
  // collarette / symptom grades: "none" | "mild" | "moderate" | "severe"
  const DATA = [
    { id: "P01", symptomatic: "yes", collarette: "none",     demodex: 3,  age: 16, sex: "F", symptom: "mild",     types: ["Burning", "Stye"] },
    { id: "P02", symptomatic: "yes", collarette: "mild",     demodex: 0,  age: 28, sex: "M", symptom: "mild",     types: ["Stye"] },
    { id: "P03", symptomatic: "yes", collarette: "mild",     demodex: 2,  age: 46, sex: "F", symptom: "severe",   types: ["Itch", "Stye", "Lash loss"] },
    { id: "P04", symptomatic: "yes", collarette: "mild",     demodex: 8,  age: 64, sex: "M", symptom: "severe",   types: ["Foreign body sensation", "Redness"] },
    { id: "P05", symptomatic: "yes", collarette: "none",     demodex: 2,  age: 67, sex: "M", symptom: "moderate", types: ["Itch"] },
    { id: "P06", symptomatic: "yes", collarette: "none",     demodex: 3,  age: 76, sex: "F", symptom: "severe",   types: ["Foreign body sensation", "Tearing", "Stye"] },
    { id: "P07", symptomatic: "yes", collarette: "moderate", demodex: 1,  age: 81, sex: "M", symptom: "severe",   types: ["Dryness", "Irritation"] },
    { id: "P08", symptomatic: "yes", collarette: "moderate", demodex: 6,  age: 79, sex: "M", symptom: "severe",   types: ["Itch", "Dryness"] },
    { id: "P09", symptomatic: "yes", collarette: "moderate", demodex: 5,  age: 69, sex: "M", symptom: "mild",     types: [] },
    { id: "P10", symptomatic: "yes", collarette: "severe",   demodex: 1,  age: 82, sex: "F", symptom: "severe",   types: ["Dryness"] },
    { id: "P11", symptomatic: "yes", collarette: "mild",     demodex: 0,  age: 77, sex: "F", symptom: "severe",   types: ["Dryness"] },
    { id: "P12", symptomatic: "yes", collarette: "moderate", demodex: 11, age: 85, sex: "F", symptom: "moderate", types: ["Dryness"] },
    { id: "P13", symptomatic: "yes", collarette: "moderate", demodex: 1,  age: 75, sex: "M", symptom: "mild",     types: ["Itch", "Foreign body sensation"] },
    { id: "P14", symptomatic: "yes", collarette: "severe",   demodex: 14, age: 78, sex: "F", symptom: "moderate", types: ["Pain", "Foreign body sensation"] },
    { id: "P15", symptomatic: "yes", collarette: "mild",     demodex: 10, age: 69, sex: "F", symptom: "severe",   types: ["Dryness"] },
    { id: "P16", symptomatic: "yes", collarette: "moderate", demodex: 11, age: 76, sex: "M", symptom: "mild",     types: ["Dryness"] },
    { id: "P17", symptomatic: "yes", collarette: "mild",     demodex: 6,  age: 84, sex: "F", symptom: "severe",   types: ["Itch", "Dryness"] },
    { id: "P18", symptomatic: "no",  collarette: "moderate", demodex: 13, age: 85, sex: "M", symptom: "none",     types: [] },
    { id: "P19", symptomatic: "yes", collarette: "moderate", demodex: 3,  age: 63, sex: "F", symptom: "mild",     types: ["Dryness"] },
    { id: "P20", symptomatic: "yes", collarette: "mild",     demodex: 3,  age: 84, sex: "M", symptom: "moderate", types: ["Dryness"] },
    { id: "P21", symptomatic: "yes", collarette: "severe",   demodex: 20, age: 61, sex: "F", symptom: "mild",     types: ["Foreign body sensation"] },
    { id: "P22", symptomatic: "yes", collarette: "mild",     demodex: 23, age: 78, sex: "F", symptom: "mild",     types: ["Itch"] },
    { id: "P23", symptomatic: "yes", collarette: "moderate", demodex: 10, age: 74, sex: "F", symptom: "mild",     types: ["Itch", "Dryness"] },
    { id: "P24", symptomatic: "no",  collarette: "moderate", demodex: 9,  age: 73, sex: "M", symptom: "none",     types: [] },
    { id: "P25", symptomatic: "no",  collarette: "severe",   demodex: 14, age: 82, sex: "M", symptom: "none",     types: ["Stye"] },
    { id: "P26", symptomatic: "—",   collarette: "moderate", demodex: 2,  age: 81, sex: "F", symptom: "moderate", types: ["Dryness"] },
    { id: "P27", symptomatic: "—",   collarette: "moderate", demodex: 5,  age: 90, sex: "F", symptom: "severe",   types: ["Dryness", "Trichiasis"] },
    { id: "P28", symptomatic: "yes", collarette: "severe",   demodex: 22, age: 66, sex: "M", symptom: "mild",     types: ["Dryness"] },
    { id: "P29", symptomatic: "yes", collarette: "mild",     demodex: 3,  age: 79, sex: "F", symptom: "mild",     types: ["Dryness"] },
    { id: "P30", symptomatic: "yes", collarette: "moderate", demodex: 15, age: 60, sex: "F", symptom: "severe",   types: ["Pain", "Stye"] },
    { id: "P31", symptomatic: "yes", collarette: "mild",     demodex: 0,  age: 69, sex: "F", symptom: "mild",     types: ["Dryness"] },
    { id: "P32", symptomatic: "yes", collarette: "moderate", demodex: 8,  age: 71, sex: "F", symptom: "severe",   types: ["Itch", "Irritation", "Foreign body sensation"] },
    { id: "P33", symptomatic: "yes", collarette: "mild",     demodex: 14, age: 84, sex: "F", symptom: "moderate", types: ["Itch", "Irritation", "Tearing", "Dryness"] },
    { id: "P34", symptomatic: "yes", collarette: "mild",     demodex: 6,  age: 78, sex: "F", symptom: "mild",     types: ["Dryness"] },
    { id: "P35", symptomatic: "yes", collarette: "mild",     demodex: 6,  age: 78, sex: "F", symptom: "mild",     types: ["Itch", "Dryness"] },
    { id: "P36", symptomatic: "yes", collarette: "mild",     demodex: 8,  age: 66, sex: "M", symptom: "mild",     types: ["Stye"] },
    { id: "P37", symptomatic: "yes", collarette: "mild",     demodex: 1,  age: 74, sex: "F", symptom: "mild",     types: ["Itch", "Tearing"] },
    { id: "P38", symptomatic: "no",  collarette: "moderate", demodex: 31, age: 63, sex: "M", symptom: "none",     types: [] },
    { id: "P39", symptomatic: "yes", collarette: "moderate", demodex: 12, age: 87, sex: "F", symptom: "mild",     types: ["Dryness"] },
    { id: "P40", symptomatic: "no",  collarette: "severe",   demodex: 16, age: 35, sex: "F", symptom: "none",     types: [] },
    { id: "P41", symptomatic: "no",  collarette: "severe",   demodex: 16, age: 69, sex: "M", symptom: "none",     types: [] },
    { id: "P42", symptomatic: "no",  collarette: "severe",   demodex: 11, age: 73, sex: "M", symptom: "none",     types: [] },
    { id: "P43", symptomatic: "no",  collarette: "moderate", demodex: 23, age: 83, sex: "M", symptom: "none",     types: [] }
  ];

  // --- Grading rubrics used in the study -----------------------------------
  const RUBRIC = {
    collarette: [
      { grade: "none",     label: "None",     desc: "No collarettes present." },
      { grade: "mild",     label: "Mild",     desc: "A few lashes per eyelid have collarettes." },
      { grade: "moderate", label: "Moderate", desc: "More than 10 collarettes per eye." },
      { grade: "severe",   label: "Severe",   desc: "Every eyelash has collarettes." }
    ],
    symptom: [
      { grade: "none",     label: "None",     desc: "Visit is for something else; patient denies discomfort." },
      { grade: "mild",     label: "Mild",     desc: "Occasional symptoms; ≤1 visit for eye discomfort/stye in the last 5 years." },
      { grade: "moderate", label: "Moderate", desc: "Frequent discomfort persisting for over a year." },
      { grade: "severe",   label: "Severe",   desc: "Persistent discomfort >1 year, or >3 visits for eye discomfort in 5 years." }
    ]
  };

  // --- The two Demodex species that live on humans --------------------------
  const SPECIES = {
    folliculorum: {
      name: "Demodex folliculorum",
      tag: "The lash-follicle dweller",
      length: "0.3 – 0.4 mm",
      home: "Eyelash & hair follicles, near the surface",
      shape: "Long, slender, cigar-shaped body",
      note: "Clusters head-down inside the follicle opening; the species most tied to collarettes and blepharitis.",
      legs: 8
    },
    brevis: {
      name: "Demodex brevis",
      tag: "The deep-gland burrower",
      length: "0.15 – 0.2 mm",
      home: "Sebaceous & meibomian (oil) glands, deeper down",
      shape: "Shorter, stubbier body",
      note: "Lives solo deeper in the oil glands; linked to meibomian gland dysfunction and dry eye.",
      legs: 8
    }
  };

  // --- Epidemiology headline numbers ---------------------------------------
  const EPIDEMIOLOGY = [
    { value: 100, suffix: "%", label: "Prevalence in people over 70 years old", source: "1" },
    { value: 80,  suffix: "%", label: "Prevalence in people over 60 years old", source: "1" },
    { value: 60,  suffix: "%", label: "Share of all blepharitis that is Demodex blepharitis", source: "2" },
    { value: 95,  suffix: "%", label: "Patients infested at a Bay Area ophthalmology clinic", source: "9" }
  ];

  // --- Life cycle stages ----------------------------------------------------
  const LIFECYCLE = [
    { stage: "Egg",    days: "Days 1–2",  text: "Females lay eggs inside the follicle or oil gland." },
    { stage: "Larva",  days: "Days 2–4",  text: "A six-legged larva hatches and begins feeding on skin cells and sebum." },
    { stage: "Nymph",  days: "Days 4–7",  text: "It molts through protonymph and nymph stages, gaining its final legs." },
    { stage: "Adult",  days: "Days 7–14", text: "The eight-legged adult mates at the follicle opening. Whole cycle ≈ 14–18 days." }
  ];

  // --- Conditions associated with Demodex overgrowth -----------------------
  const CONDITIONS = [
    { name: "Blepharitis", icon: "eye", text: "Inflammation of the eyelid margin. Collarettes — waxy cuffs at the lash base — are its pathognomonic (tell-tale) sign." },
    { name: "Meibomian Gland Dysfunction", icon: "drop", text: "Mites damage the oil glands and alter meibum quality, destabilising the tear film." },
    { name: "Dry Eye Disease", icon: "wave", text: "High co-occurrence with demodicosis; a poor tear film also makes a cosier home for mites." },
    { name: "Rosacea", icon: "flame", text: "A well-documented link — facial mites can migrate to the lids and drive ocular rosacea." },
    { name: "Chalazia & Styes", icon: "bump", text: "Blocked, inflamed lid glands are seen more often alongside Demodex infestation." },
    { name: "Anxiety & Depression", icon: "mind", text: "Chronic lid discomfort measurably lowers quality of life and mental wellbeing." }
  ];

  // --- Risk factors ---------------------------------------------------------
  const RISK_FACTORS = [
    "Increasing age", "Rosacea", "Diabetes", "Weakened immune system",
    "High stress", "Greater sun exposure", "Higher alcohol intake", "Smoking"
  ];

  // --- Treatment landscape --------------------------------------------------
  const TREATMENTS = [
    { name: "Lid hygiene & warm compresses", tag: "First line", text: "Daily eyelid cleansing and warm compresses reduce mite load and unclog oil glands. Low-cost and widely feasible.", rank: 1 },
    { name: "Tea-tree oil (terpinen-4-ol)", tag: "Over the counter", text: "Lid wipes and scrubs containing tea-tree derivatives (e.g. terpinen-4-ol) are acaricidal against Demodex.", rank: 2 },
    { name: "Lotilaner (XDEMVY)", tag: "FDA-approved", text: "The first and only FDA-approved drug for Demodex blepharitis — a lotilaner ophthalmic solution that paralyses the mites.", rank: 3 }
  ];

  // --- Bibliography ---------------------------------------------------------
  const REFERENCES = [
    { n: 1,  cite: "Cheng, A. M., Hwang, J., Dermer, H., & Galor, A. (2021). Prevalence of ocular demodicosis in an older population and its association with symptoms and signs of dry eye. Cornea, 40(8), 995–1001.", url: "https://doi.org/10.1097/ICO.0000000000002542" },
    { n: 2,  cite: "Trattler, W., Karpecki, P., Rapoport, Y., et al. (2022). The prevalence of Demodex blepharitis in US eye care clinic patients as determined by collarettes: A pathognomonic sign. Clinical Ophthalmology, 16, 1153–1164.", url: "https://doi.org/10.2147/OPTH.S354692" },
    { n: 3,  cite: "Bitton, E., & Aumond, S. (2021). Demodex and eye disease: A review. Clinical & Experimental Optometry, 104(3), 285–294.", url: "https://doi.org/10.1111/cxo.13123" },
    { n: 4,  cite: "Ayres, B. D., Donnenfeld, E., Farid, M., et al. (2023). Clinical diagnosis and management of Demodex blepharitis: The Demodex expert panel on treatment and eyelid health (DEPTH). Eye, 37, 3249–3255.", url: "https://doi.org/10.1038/s41433-023-02500-4" },
    { n: 5,  cite: "Sędzikowska, A., Osęka, M., & Grytner-Zięcina, B. (2016). Ocular symptoms reported by patients infested with Demodex mites. Acta Parasitologica, 61(4), 808–814.", url: "https://doi.org/10.1515/ap-2016-0112" },
    { n: 6,  cite: "O'Dell, L., Dierker, D. S., Devries, D. K., et al. (2022). Psychosocial impact of Demodex blepharitis. Clinical Ophthalmology, 16, 2979–2987.", url: "https://doi.org/10.2147/OPTH.S374530" },
    { n: 7,  cite: "Chiang, C.-C., Lin, C.-L., Tsai, Y.-Y., et al. (2013). Patients with blepharitis are at elevated risk of anxiety and depression. PLoS ONE, 8(12), e83335.", url: "https://doi.org/10.1371/journal.pone.0083335" },
    { n: 8,  cite: "Nowomiejska, K., Lukasik, P., Brzozowska, A., et al. (2020). Prevalence of ocular demodicosis and ocular surface conditions in patients selected for cataract surgery. Journal of Clinical Medicine, 9(10), 3069.", url: "https://doi.org/10.3390/jcm9103069" },
    { n: 9,  cite: "Original community-based data — de-identified cohort collected at a Bay Area (Pleasanton) ophthalmology clinic. Presented on this site.", url: "" },
    { n: 10, cite: "Elam, A. R., & Tseng, V. L. (2022). Disparities in vision health and eye care. Ophthalmology, 129(10), e89–e91.", url: "https://doi.org/10.1016/j.ophtha.2022.07.010" },
    { n: 11, cite: "K-Cast. (n.d.). FDA-approved treatment for Demodex blepharitis shortens treatment, improves quality of life. Managed Healthcare Executive.", url: "https://www.managedhealthcareexecutive.com/view/fda-approved-treatment-for-demodex-bepharitis-shortens-treatment-improves-quality-of-life" },
    { n: 13, cite: "Besagar, S., Delvadia, R., Srikumar, A., et al. (2022). Association of socioeconomic, demographic, and health care access disparities with severe visual impairment in the US. JAMA Ophthalmology, 140(12), 1219–1226.", url: "https://doi.org/10.1001/jamaophthalmol.2022.4703" },
    { n: 14, cite: "Delvadia, R., Besagar, S., Srikumar, A., et al. (2024). Insights into eye care accessibility: Geospatial distribution of eye care providers and socioeconomic factors by ZIP code. Translational Vision Science & Technology, 13(3), 21.", url: "https://doi.org/10.1167/tvst.13.3.21" },
    { n: 15, cite: "Review of Optometry. (2023, May 30). Lack of eye care access in US reflects socioeconomic trends.", url: "https://www.reviewofoptometry.com/article/lack-of-eye-care-access-in-us-reflects-socioeconomic-trends" }
  ];

  // --- Fun / surprising facts ----------------------------------------------
  const FACTS = [
    "Almost every adult carries Demodex — they are a normal part of the human skin microbiome.",
    "They have no anus. Waste builds up over their ~2-week life and is released only when they die.",
    "Mites are most active at night, crawling across the skin surface to find mates while you sleep.",
    "They have eight stubby legs — placing them with spiders and ticks in the class Arachnida.",
    "Demodex degrade within minutes to hours once removed from the warm follicle."
  ];

  global.DEMODEX = {
    DATA, RUBRIC, SPECIES, EPIDEMIOLOGY, LIFECYCLE,
    CONDITIONS, RISK_FACTORS, TREATMENTS, REFERENCES, FACTS
  };
})(window);
