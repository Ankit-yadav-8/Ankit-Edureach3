/* ────────────────────────────────────────────────────────────────
   Chapter → Mind-map mapping.

   The mind-map sheets in `mindmaps.json` are organised under JEE-style
   chapter names (Allen-derived), which don't line up 1:1 with the NCERT
   syllabus chapter titles used on the Class 11 / Class 12 pages. This file
   maps each NCERT chapter (by class → subject → title) to the mind-map
   chapter number(s) `n` inside `mindmaps.json`, so the "Mind Map" button on
   every chapter card opens the correct sheet(s).

   Notes:
   • Biology has no mind maps — those chapters simply won't show the button.
   • A chapter may map to several mind-map chapters; their pages are merged
     into one flip-through gallery.
   • Chapters with no sensible map are omitted (button hidden).
   ──────────────────────────────────────────────────────────────── */
import mindmaps from "./mindmaps.json";

// NCERT subject label → mindmaps.json subject key
const SUBJECT_ID = {
  Physics: "physics",
  Chemistry: "chemistry",
  Mathematics: "maths",
  Biology: null,
};

// class → subject → NCERT title → [mind-map chapter numbers]
const MAP = {
  "11": {
    Physics: {
      "Units and Measurements": [1, 24],
      "Motion in a Straight Line": [3],
      "Motion in a Plane": [2, 3],
      "Laws of Motion": [4, 5],
      "Work, Energy and Power": [6],
      "System of Particles and Rotational Motion": [8, 7],
      "Gravitation": [15],
      "Mechanical Properties of Solids": [11],
      "Thermal Properties of Matter": [12],
      "Thermodynamics": [12],
      "Kinetic Theory": [13],
      "Oscillations": [9],
      "Waves": [10],
    },
    Chemistry: {
      "Some Basic Concepts of Chemistry": [1],
      "Structure of Atom": [13],
      "Chemical Bonding and Molecular Structure": [16],
      "Thermodynamics": [2, 3],
      "Equilibrium": [4, 5],
      "Redox Reactions": [6],
      "Classification of Elements and Periodicity in Properties": [15],
      "The s-Block Elements": [17],
      "The p-Block Elements": [18],
      "Organic Chemistry – Some Basic Principles and Techniques": [24, 25, 26],
      "Hydrocarbons": [29],
      "Environmental Chemistry": [23],
      "States of Matter": [12],
    },
    Mathematics: {
      "Sets": [35],
      "Relations and Functions": [36, 17],
      "Trigonometric Functions": [2, 3],
      "Complex Numbers and Quadratic Equations": [8, 4],
      "Permutations and Combinations": [6],
      "Binomial Theorem": [7],
      "Sequences and Series": [5],
      "Straight Lines": [12],
      "Conic Sections": [13, 14, 15, 16],
      "Introduction to Three-Dimensional Geometry": [31],
      "Limits and Derivatives": [19, 22],
      "Statistics": [33],
      "Probability": [32],
    },
  },
  "12": {
    Physics: {
      "Electric Charges and Fields": [14],
      "Electrostatic Potential and Capacitance": [14, 17],
      "Current Electricity": [16],
      "Moving Charges and Magnetism": [18],
      "Magnetism and Matter": [18],
      "Electromagnetic Induction": [19],
      "Alternating Current": [20],
      "Electromagnetic Waves": [20],
      "Ray Optics and Optical Instruments": [22],
      "Wave Optics": [23],
      "Dual Nature of Radiation and Matter": [21],
      "Atoms": [21],
      "Nuclei": [21],
      "Semiconductor Electronics": [25],
    },
    Chemistry: {
      "Solutions": [10],
      "Electrochemistry": [7],
      "Chemical Kinetics": [8],
      "Surface Chemistry": [14],
      "The p-Block Elements": [18],
      "The d- and f-Block Elements": [20],
      "Coordination Compounds": [19],
      "Haloalkanes and Haloarenes": [30],
      "Alcohols, Phenols and Ethers": [31],
      "Aldehydes, Ketones and Carboxylic Acids": [32],
      "Amines": [33, 34],
      "Biomolecules": [38],
      "Polymers": [37],
    },
    Mathematics: {
      "Relations and Functions": [36, 17],
      "Inverse Trigonometric Functions": [18],
      "Matrices": [10],
      "Determinants": [9],
      "Continuity and Differentiability": [20, 21, 22],
      "Applications of Derivatives": [23, 24, 25],
      "Integrals": [26, 27],
      "Applications of Integrals": [29],
      "Differential Equations": [28],
      "Vector Algebra": [30],
      "Three-Dimensional Geometry": [31],
      "Probability": [32],
    },
  },
};

/**
 * Resolve the mind map(s) for a chapter.
 * @returns {{ subjectId: string, name: string, pages: number[] } | null}
 */
export function getChapterMindmap(classLevel, subject, title) {
  const subjectId = SUBJECT_ID[subject];
  if (!subjectId) return null;

  const nums = MAP[String(classLevel)]?.[subject]?.[title];
  if (!nums || !nums.length) return null;

  const blob = mindmaps[subjectId];
  if (!blob) return null;

  const pages = [];
  for (const n of nums) {
    const ch = blob.chapters.find((c) => c.n === n);
    if (ch?.pages) pages.push(...ch.pages);
  }
  if (!pages.length) return null;

  return { subjectId, name: title, pages };
}
