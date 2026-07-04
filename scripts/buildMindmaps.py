# Deterministic builder for the JEE mind-map chapter->pages mapping.
# Structure was verified directly from the Allen Handbook PDFs:
#  - Physics : per-chapter .p65 source files in each page footer (exact PDF ranges)
#  - Chem/Maths : page-1 TOC start pages, printed->PDF offset is a constant +2
# Image files already exist at public/mindmaps_raw/<subj>/<subj>_page_XXX.png,
# one PNG per PDF page, so a chapter's page list *is* its image list.
import json, os

OFFSET = 2          # printed page P  ->  PDF page P+2  (chem & maths)
LAST = {"physics": 155, "chemistry": 184, "maths": 224}

# ---- PHYSICS: (name, pdfStart, pdfEnd) taken straight from .p65 stems ----
PHYSICS = [
    ("Unit & Dimension", 3, 8), ("Basic Maths & Vectors", 9, 17),
    ("Kinematics", 18, 24), ("Newton's Laws & Friction", 25, 28),
    ("Circular Motion", 29, 31), ("Work, Energy & Power", 32, 35),
    ("Centre of Mass, Collision & Momentum", 36, 39), ("Rotational Motion", 40, 51),
    ("SHM & Oscillations", 52, 55), ("Wave Motion & Doppler Effect", 56, 61),
    ("Elasticity", 62, 68), ("Thermal Physics", 69, 73),
    ("Kinetic Theory of Gases", 74, 78), ("Electrostatics", 79, 83),
    ("Gravitation", 84, 86), ("Current Electricity", 87, 92),
    ("Capacitance", 93, 100), ("Magnetic Effect of Current & Magnetism", 101, 106),
    ("Electromagnetic Induction", 107, 110), ("Alternating Current & EM Waves", 111, 114),
    ("Modern Physics", 115, 124), ("Ray Optics & Optical Instruments", 125, 132),
    ("Wave Optics", 133, 137), ("Error & Measurements", 138, 140),
    ("Semiconductors & Electronics", 141, 155),
]

# ---- CHEMISTRY: (name, section, printedStart) in reading order ----
CHEM = [
    ("Mole Concept", "Physical", 1), ("Thermodynamics", "Physical", 7),
    ("Thermochemistry", "Physical", 18), ("Chemical Equilibrium", "Physical", 20),
    ("Ionic Equilibrium", "Physical", 23), ("Redox Reactions", "Physical", 28),
    ("Electrochemistry", "Physical", 32), ("Chemical Kinetics", "Physical", 39),
    ("Radioactivity", "Physical", 43), ("Liquid Solutions", "Physical", 45),
    ("Solid State", "Physical", 49), ("Gaseous State", "Physical", 53),
    ("Atomic Structure", "Physical", 55), ("Surface Chemistry", "Physical", 58),
    ("Periodic Properties", "Inorganic", 61), ("Chemical Bonding", "Inorganic", 65),
    ("s-Block Elements", "Inorganic", 81), ("p-Block Elements", "Inorganic", 86),
    ("Coordination Chemistry", "Inorganic", 104), ("d-Block (Transition Elements)", "Inorganic", 110),
    ("Metallurgy", "Inorganic", 114), ("Salt Analysis", "Inorganic", 118),
    ("Environmental Pollution", "Inorganic", 124),
    ("IUPAC Nomenclature", "Organic", 127), ("Isomerism", "Organic", 129),
    ("Reaction Mechanism", "Organic", 133), ("Practical Organic Chemistry", "Organic", 135),
    ("Distinction Between Compounds", "Organic", 137), ("Hydrocarbons", "Organic", 142),
    ("Haloalkanes & Grignard Reagents", "Organic", 147), ("Alcohol, Ether & Phenol", "Organic", 151),
    ("Carboxylic Acids", "Organic", 159), ("Amines", "Organic", 165),
    ("Benzene Diazonium Chloride", "Organic", 167), ("Organic Reagents", "Organic", 169),
    ("Organic Name Reactions", "Organic", 174), ("Polymers", "Organic", 178),
    ("Carbohydrates", "Organic", 180),
]

# ---- MATHS: (name, printedStart) ----
MATHS = [
    ("Logarithm", 1), ("Trigonometric Ratios & Identities", 2), ("Trigonometric Equations", 10),
    ("Quadratic Equations", 13), ("Sequences & Series", 17), ("Permutation & Combination", 23),
    ("Binomial Theorem", 28), ("Complex Numbers", 31), ("Determinants", 39), ("Matrices", 44),
    ("Properties & Solution of Triangles", 52), ("Straight Line", 60), ("Circle", 73),
    ("Parabola", 83), ("Ellipse", 91), ("Hyperbola", 98), ("Functions", 105),
    ("Inverse Trigonometric Functions", 124), ("Limits", 132), ("Continuity", 137),
    ("Differentiability", 139), ("Methods of Differentiation", 143), ("Monotonicity", 147),
    ("Maxima & Minima", 152), ("Tangent & Normal", 157), ("Indefinite Integration", 160),
    ("Definite Integration", 166), ("Differential Equations", 170), ("Area Under the Curve", 176),
    ("Vectors", 178), ("3D Coordinate Geometry", 188), ("Probability", 196), ("Statistics", 203),
    ("Mathematical Reasoning", 210), ("Sets", 215), ("Relations", 220),
]

def from_printed(items, subj, has_section=False):
    out = []
    for i, item in enumerate(items):
        if has_section:
            name, section, start = item
        else:
            name, start = item; section = None
        nxt = items[i + 1][2 if has_section else 1] if i + 1 < len(items) else (LAST[subj] - OFFSET + 1)
        pages = list(range(start + OFFSET, nxt + OFFSET))
        ch = {"n": i + 1, "name": name, "pages": pages}
        if section:
            ch["section"] = section
        out.append(ch)
    return out

def from_ranges(items):
    return [{"n": i + 1, "name": name, "pages": list(range(a, b + 1))}
            for i, (name, a, b) in enumerate(items)]

data = {
    "physics":   {"name": "Physics",     "chapters": from_ranges(PHYSICS)},
    "chemistry": {"name": "Chemistry",   "chapters": from_printed(CHEM, "chemistry", True)},
    "maths":     {"name": "Mathematics", "chapters": from_printed(MATHS, "maths")},
}

# ---- validate: pages exist, ordered, no gaps beyond covers/dividers ----
for subj, blob in data.items():
    covered, missing = set(), []
    for ch in blob["chapters"]:
        for p in ch["pages"]:
            covered.add(p)
            fp = f"public/mindmaps_raw/{subj}/{subj}_page_{p:03d}.png"
            if not os.path.exists(fp):
                missing.append(fp)
    allpages = set(range(3, LAST[subj] + 1))  # 1-2 are cover/TOC
    gaps = sorted(allpages - covered)
    print(f"{subj:9}: {len(blob['chapters'])} chapters, {len(covered)} pages, "
          f"uncovered(non-cover)={gaps}, missing_images={len(missing)}")
    if missing:
        print("   FIRST MISSING:", missing[:3])

os.makedirs("src/data", exist_ok=True)
with open("src/data/mindmaps.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
print("Wrote src/data/mindmaps.json")
