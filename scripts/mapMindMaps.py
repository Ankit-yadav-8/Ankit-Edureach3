import fitz
import json

chapters = {
    "physics": [
        "Units & Dimensions", "Kinematics", "Newton's Laws of Motion", "Work, Energy & Power", "Rotational Motion",
        "Gravitation", "Properties of Matter", "Thermodynamics", "Oscillations", "Waves", "Electrostatics",
        "Current Electricity", "Magnetic Effects of Current", "Electromagnetic Induction", "Alternating Current",
        "Ray Optics", "Wave Optics", "Dual Nature of Matter", "Atomic Structure", "Nuclei", "Semiconductor Devices",
        "Communication Systems", "Experimental Physics", "Kinetic Theory of Gases", "EM Waves"
    ],
    "chemistry": [
        "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Chemical Equilibrium",
        "Ionic Equilibrium", "Electrochemistry", "Chemical Kinetics", "Solutions", "Solid State", "Surface Chemistry",
        "Hydrogen & s-Block", "p-Block Elements", "d & f-Block Elements", "Coordination Compounds",
        "Basic Organic Chemistry", "Hydrocarbons", "Haloalkanes & Haloarenes", "Alcohols, Phenols & Ethers",
        "Aldehydes & Ketones", "Carboxylic Acids", "Amines", "Biomolecules", "Polymers",
        "Chemistry in Everyday Life", "Redox Reactions", "Environmental Chemistry", "States of Matter"
    ],
    "maths": [
        "Sets, Relations & Functions", "Complex Numbers", "Quadratic Equations", "Sequences & Series",
        "Permutations & Combinations", "Binomial Theorem", "Matrices & Determinants", "Limits, Continuity",
        "Differentiation", "Integration", "Differential Equations", "Straight Lines & Circles",
        "Conic Sections", "Vectors", "3D Geometry", "Probability", "Trigonometry",
        "Inverse Trigonometric Functions", "Mathematical Reasoning"
    ]
}

pdfs = {
    "physics": "public/Allen_Handbook_Physics_JEEAdvanced_2024.pdf",
    "chemistry": r"public\Allen Handbook Chemistry @JEEAdvanced_2024.pdf_",
    "maths": r"public\Allen Handbook Mathematics @JEEAdvanced_2024.pdf_"
}

mapping = {"physics": {}, "chemistry": {}, "maths": {}}

for subject, pdf_path in pdfs.items():
    print(f"Processing {subject}...")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Failed to open {pdf_path}: {e}")
        continue
        
    chapter_starts = {}
    ch_list = [c.lower() for c in chapters[subject]]
    
    for i in range(len(doc)):
        text = doc[i].get_text("text").lower().replace("\n", " ")
        
        for idx, ch in enumerate(ch_list):
            # To avoid false positives, we might look for "chapter" or just the name
            if ch in text:
                if idx+1 not in chapter_starts:
                    chapter_starts[idx+1] = i + 1 # 1-indexed page
                    
    # Now guess mind maps. It's usually the page before the next chapter.
    for idx in range(1, len(ch_list) + 1):
        if idx in chapter_starts and (idx+1) in chapter_starts:
            mindmap_page = chapter_starts[idx+1] - 1
            mapping[subject][idx] = mindmap_page
        elif idx in chapter_starts:
            # Last chapter? Assume last page.
            mapping[subject][idx] = len(doc)
        else:
            # Fallback
            mapping[subject][idx] = 1
            
with open("src/data/mindmaps.json", "w") as f:
    json.dump(mapping, f, indent=2)
    
print("Mapping saved to src/data/mindmaps.json")
