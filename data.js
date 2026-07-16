/* ============================================================================
   data.js  ·  De-identified study data and research content for the site.

   PRIVACY NOTE: The source spreadsheet held real Medical Record Numbers (MRNs).
   Those are protected identifiers and have been removed. Each record below uses
   an anonymous study ID (P01 to P43). Only de-identified clinical fields (age,
   sex, collarette grade, mite count, symptom grade) are kept.
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
    { id: "P26", symptomatic: "n/a", collarette: "moderate", demodex: 2,  age: 81, sex: "F", symptom: "moderate", types: ["Dryness"] },
    { id: "P27", symptomatic: "n/a", collarette: "moderate", demodex: 5,  age: 90, sex: "F", symptom: "severe",   types: ["Dryness", "Trichiasis"] },
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
      { grade: "none",     label: "None",     desc: "No collarettes on any lash." },
      { grade: "mild",     label: "Mild",     desc: "A few lashes per eyelid have collarettes." },
      { grade: "moderate", label: "Moderate", desc: "More than 10 collarettes per eye." },
      { grade: "severe",   label: "Severe",   desc: "Every eyelash has collarettes." }
    ],
    symptom: [
      { grade: "none",     label: "None",     desc: "Here for something else, and says there is no discomfort." },
      { grade: "mild",     label: "Mild",     desc: "Occasional symptoms. One or fewer visits for eye discomfort or a stye in the last 5 years." },
      { grade: "moderate", label: "Moderate", desc: "Frequent discomfort lasting more than a year." },
      { grade: "severe",   label: "Severe",   desc: "Constant discomfort for over a year, or more than 3 visits for eye discomfort in 5 years." }
    ]
  };

  // --- The two Demodex species that live on humans --------------------------
  const SPECIES = {
    folliculorum: {
      name: "Demodex folliculorum",
      tag: "Lives in the lash follicle",
      length: "0.3 to 0.4 mm",
      home: "Eyelash and hair follicles, close to the surface",
      shape: "Long, slim, cigar-shaped body",
      note: "Several of them pack head-down into one follicle. This is the species most often blamed for collarettes and blepharitis.",
      legs: 8
    },
    brevis: {
      name: "Demodex brevis",
      tag: "Burrows into the oil glands",
      length: "0.15 to 0.2 mm",
      home: "Sebaceous and meibomian (oil) glands, deeper down",
      shape: "Shorter, stubbier body",
      note: "It usually lives alone, deeper in the oil glands. It gets tied to blocked glands and dry eye.",
      legs: 8
    }
  };

  // --- Epidemiology headline numbers ---------------------------------------
  const EPIDEMIOLOGY = [
    { value: 100, suffix: "%", label: "of people over 70 carry Demodex", source: "1" },
    { value: 80,  suffix: "%", label: "of people over 60 carry Demodex", source: "1" },
    { value: 60,  suffix: "%", label: "of all blepharitis is Demodex blepharitis", source: "2" },
    { value: 95,  suffix: "%", label: "of patients at a Bay Area clinic were infested", source: "9" }
  ];

  // --- Life cycle stages ----------------------------------------------------
  const LIFECYCLE = [
    { stage: "Egg",   days: "Days 1 to 2",  text: "The female lays eggs inside a follicle or oil gland." },
    { stage: "Larva", days: "Days 2 to 4",  text: "A six-legged larva hatches and starts feeding on skin cells and sebum." },
    { stage: "Nymph", days: "Days 4 to 7",  text: "It molts through a couple of stages and grows its last pair of legs." },
    { stage: "Adult", days: "Days 7 to 14", text: "The eight-legged adult mates at the mouth of the follicle. The whole thing takes about two weeks." }
  ];

  // --- Conditions associated with Demodex overgrowth -----------------------
  const CONDITIONS = [
    { name: "Blepharitis", icon: "eye", text: "Inflammation along the eyelid margin. Its clearest sign is a collarette, the waxy cuff at the base of a lash." },
    { name: "Meibomian gland dysfunction", icon: "drop", text: "The mites damage the oil glands and change the quality of their oil, which makes the tear film less stable." },
    { name: "Dry eye disease", icon: "wave", text: "It often turns up alongside Demodex. A weak tear film also gives the mites a more comfortable place to live." },
    { name: "Rosacea", icon: "flame", text: "A well-known link. Face mites can move to the lids and feed ocular rosacea." },
    { name: "Chalazia and styes", icon: "bump", text: "Blocked, inflamed lid glands show up more often when Demodex is around." },
    { name: "Anxiety and low mood", icon: "mind", text: "Constant lid irritation wears people down and can lower quality of life." }
  ];

  // --- Risk factors ---------------------------------------------------------
  const RISK_FACTORS = [
    "Older age", "Rosacea", "Diabetes", "A weakened immune system",
    "High stress", "Lots of sun exposure", "Heavier alcohol use", "Smoking"
  ];

  // --- Treatment landscape --------------------------------------------------
  const TREATMENTS = [
    { name: "Lid hygiene and warm compresses", tag: "First thing to try", text: "Cleaning the lids every day and using warm compresses cuts the mite load and helps the oil glands drain. It is cheap, and almost anyone can do it.", rank: 1 },
    { name: "Tea tree oil (terpinen-4-ol)", tag: "Over the counter", text: "Lid wipes and scrubs with tea tree ingredients like terpinen-4-ol actually kill Demodex.", rank: 2 },
    { name: "Lotilaner (XDEMVY)", tag: "FDA approved", text: "The first and only drug the FDA has approved for Demodex blepharitis. It is an eye drop that paralyzes the mites.", rank: 3 }
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
    { n: 9,  cite: "Original community-based data. A de-identified cohort collected at a Bay Area (Pleasanton) ophthalmology clinic, and the dataset shown on this site.", url: "" },
    { n: 10, cite: "Elam, A. R., & Tseng, V. L. (2022). Disparities in vision health and eye care. Ophthalmology, 129(10), e89–e91.", url: "https://doi.org/10.1016/j.ophtha.2022.07.010" },
    { n: 11, cite: "K-Cast. (n.d.). FDA-approved treatment for Demodex blepharitis shortens treatment, improves quality of life. Managed Healthcare Executive.", url: "https://www.managedhealthcareexecutive.com/view/fda-approved-treatment-for-demodex-bepharitis-shortens-treatment-improves-quality-of-life" },
    { n: 13, cite: "Besagar, S., Delvadia, R., Srikumar, A., et al. (2022). Association of socioeconomic, demographic, and health care access disparities with severe visual impairment in the US. JAMA Ophthalmology, 140(12), 1219–1226.", url: "https://doi.org/10.1001/jamaophthalmol.2022.4703" },
    { n: 14, cite: "Delvadia, R., Besagar, S., Srikumar, A., et al. (2024). Insights into eye care accessibility: Geospatial distribution of eye care providers and socioeconomic factors by ZIP code. Translational Vision Science & Technology, 13(3), 21.", url: "https://doi.org/10.1167/tvst.13.3.21" },
    { n: 15, cite: "Review of Optometry. (2023, May 30). Lack of eye care access in US reflects socioeconomic trends.", url: "https://www.reviewofoptometry.com/article/lack-of-eye-care-access-in-us-reflects-socioeconomic-trends" }
  ];

  // --- Fun / surprising facts ----------------------------------------------
  const FACTS = [
    "Almost every adult carries Demodex. They are a normal part of the skin's tiny ecosystem.",
    "They have no way to poop. Waste builds up over their roughly two-week life and only comes out when they die.",
    "They are night owls. They crawl across the skin in the dark to find mates while you sleep.",
    "With eight legs, they count as arachnids, so they are cousins of spiders and ticks.",
    "Take one out of its warm follicle and it dries out and dies within minutes to hours."
  ];

  global.DEMODEX = {
    DATA, RUBRIC, SPECIES, EPIDEMIOLOGY, LIFECYCLE,
    CONDITIONS, RISK_FACTORS, TREATMENTS, REFERENCES, FACTS
  };
})(window);
