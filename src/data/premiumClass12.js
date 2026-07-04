export const PREMIUM_CLASS_12 = {
  Physics: [
    {
      title: "Electric Charges and Fields",
      description: "Learn the fundamentals of electrostatics, including electric charge, Coulomb's law, electric field, electric field lines, and Gauss's law. This chapter forms the foundation for Electrostatics and Modern Physics.",
      outcomes: ["Electric Charge", "Coulomb's Law", "Electric Field", "Electric Flux", "Gauss's Law"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "10-12 Hours", prerequisites: "Basic Vector Algebra"
    },
    {
      title: "Electrostatic Potential and Capacitance",
      description: "Understand electric potential, potential energy, equipotential surfaces, capacitors, dielectric materials, and energy stored in capacitors.",
      outcomes: ["Electric Potential", "Potential Difference", "Capacitors", "Dielectrics", "Energy Storage"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "12-14 Hours", prerequisites: "Electric Charges and Fields"
    },
    {
      title: "Current Electricity",
      description: "Study electric current, drift velocity, Ohm's law, resistance, Kirchhoff's laws, Wheatstone bridge, potentiometer, and electrical circuits.",
      outcomes: ["Electric Current", "Ohm's Law", "Kirchhoff's Laws", "Potentiometer", "Wheatstone Bridge"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "14-16 Hours", prerequisites: "Electrostatics"
    },
    {
      title: "Moving Charges and Magnetism",
      description: "Explore magnetic effects of electric current, Biot-Savart law, Ampere's law, Lorentz force, cyclotron, and motion of charged particles.",
      outcomes: ["Magnetic Field", "Lorentz Force", "Ampere's Law", "Cyclotron", "Force on Current"],
      difficulty: 5, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "15-18 Hours", prerequisites: "Vectors, Current Electricity"
    },
    {
      title: "Magnetism and Matter",
      description: "Understand magnets, Earth's magnetic field, magnetic materials, hysteresis, and magnetic properties of substances.",
      outcomes: ["Bar Magnet", "Earth's Magnetism", "Magnetic Materials", "Hysteresis", "Magnetization"],
      difficulty: 3, jeeMain: 3, jeeAdv: 3, priority: "Tier 3", studyTime: "6-8 Hours", prerequisites: "Moving Charges"
    },
    {
      title: "Electromagnetic Induction",
      description: "Study Faraday's law, Lenz's law, induced EMF, eddy currents, self-induction, mutual induction, and practical applications of EMI.",
      outcomes: ["Faraday's Law", "Lenz's Law", "Self Induction", "Mutual Induction", "Eddy Currents"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "10-12 Hours", prerequisites: "Magnetism"
    },
    {
      title: "Alternating Current",
      description: "Learn alternating current, AC circuits, RMS values, transformers, resonance, power factor, and LCR circuits.",
      outcomes: ["AC Circuits", "RMS Value", "Transformers", "LCR Circuit", "Resonance"],
      difficulty: 4, jeeMain: 4, jeeAdv: 5, priority: "Tier 2", studyTime: "10-12 Hours", prerequisites: "EMI, Mathematics"
    },
    {
      title: "Electromagnetic Waves",
      description: "Understand the origin, properties, and applications of electromagnetic waves across the complete electromagnetic spectrum.",
      outcomes: ["EM Waves", "Spectrum", "Wave Properties", "Maxwell's Theory", "Applications"],
      difficulty: 2, jeeMain: 3, jeeAdv: 3, priority: "Tier 3", studyTime: "4-6 Hours", prerequisites: "AC Circuits"
    },
    {
      title: "Ray Optics and Optical Instruments",
      description: "Master reflection, refraction, mirrors, lenses, total internal reflection, optical instruments, and image formation.",
      outcomes: ["Reflection", "Refraction", "Lenses", "Mirrors", "Optical Instruments"],
      difficulty: 5, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "14-16 Hours", prerequisites: "Basic Geometry"
    },
    {
      title: "Wave Optics",
      description: "Study interference, diffraction, polarization, Young's Double Slit Experiment, and wave nature of light.",
      outcomes: ["Interference", "Diffraction", "Polarization", "YDSE", "Wave Nature"],
      difficulty: 4, jeeMain: 4, jeeAdv: 5, priority: "Tier 2", studyTime: "12-14 Hours", prerequisites: "Ray Optics, Waves"
    },
    {
      title: "Dual Nature of Radiation and Matter",
      description: "Explore the dual nature of light and matter through the photoelectric effect, de Broglie hypothesis, and wave-particle duality.",
      outcomes: ["Photoelectric Effect", "de Broglie Theory", "Matter Waves", "Einstein Equation"],
      difficulty: 3, jeeMain: 4, jeeAdv: 4, priority: "Tier 2", studyTime: "8-10 Hours", prerequisites: "Atomic Physics Basics"
    },
    {
      title: "Atoms",
      description: "Understand Bohr's atomic model, hydrogen spectrum, energy levels, and atomic transitions.",
      outcomes: ["Bohr Model", "Hydrogen Spectrum", "Energy Levels", "Atomic Structure"],
      difficulty: 2, jeeMain: 3, jeeAdv: 3, priority: "Tier 3", studyTime: "6-8 Hours", prerequisites: "Dual Nature"
    },
    {
      title: "Nuclei",
      description: "Study nuclear structure, radioactivity, nuclear reactions, binding energy, mass defect, and nuclear fission and fusion.",
      outcomes: ["Radioactivity", "Nuclear Reactions", "Mass Defect", "Binding Energy", "Fission & Fusion"],
      difficulty: 3, jeeMain: 4, jeeAdv: 4, priority: "Tier 2", studyTime: "8-10 Hours", prerequisites: "Atoms"
    },
    {
      title: "Semiconductor Electronics",
      description: "Learn semiconductor physics, diodes, transistors, logic gates, digital electronics, and their applications in modern electronic devices.",
      outcomes: ["Semiconductors", "PN Junction", "Diodes", "Transistors", "Logic Gates"],
      difficulty: 3, jeeMain: 5, jeeAdv: 4, priority: "Tier 2", studyTime: "10-12 Hours", prerequisites: "Current Electricity"
    }
  ],
  Chemistry: [
    {
      title: "Solutions",
      description: "Learn about different types of solutions, concentration units, Raoult's law, colligative properties, and abnormal molecular mass.",
      outcomes: ["Types of Solutions", "Concentration Terms", "Raoult's Law", "Colligative Properties", "Osmotic Pressure"],
      difficulty: 3, jeeMain: 4, jeeAdv: 4, priority: "Tier 2", studyTime: "10-12 Hours", prerequisites: "Mole Concept"
    },
    {
      title: "Electrochemistry",
      description: "Understand electrochemical cells, Nernst equation, conductivity, electrolysis, batteries, and corrosion. High weightage chapter.",
      outcomes: ["Galvanic Cells", "Nernst Equation", "Electrolysis", "Batteries", "Conductance"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "12-15 Hours", prerequisites: "Redox Reactions, Thermodynamics"
    },
    {
      title: "Chemical Kinetics",
      description: "Study reaction rates, rate laws, integrated rate equations, Arrhenius equation, activation energy, and factors affecting reaction speed.",
      outcomes: ["Rate Law", "Order of Reaction", "Half-Life", "Arrhenius Equation", "Activation Energy"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "10-12 Hours", prerequisites: "Basic Calculus"
    },
    {
      title: "d- and f-Block Elements",
      description: "Explore transition and inner transition elements, electronic configurations, oxidation states, magnetic properties, and colored compounds.",
      outcomes: ["Transition Elements", "Lanthanides", "Actinides", "Oxidation States", "Magnetic Properties"],
      difficulty: 3, jeeMain: 4, jeeAdv: 4, priority: "Tier 2", studyTime: "8-10 Hours", prerequisites: "Periodic Properties"
    },
    {
      title: "Coordination Compounds",
      description: "Master ligands, coordination number, nomenclature, isomerism, crystal field theory, and bonding in coordination compounds.",
      outcomes: ["Ligands", "Coordination Number", "Nomenclature", "Isomerism", "Crystal Field Theory"],
      difficulty: 5, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "12-14 Hours", prerequisites: "Chemical Bonding, d-block"
    },
    {
      title: "Haloalkanes and Haloarenes",
      description: "Learn the preparation, properties, and reactions of alkyl and aryl halides along with important reaction mechanisms.",
      outcomes: ["Alkyl Halides", "Aryl Halides", "SN1 & SN2", "Elimination Reactions", "Uses"],
      difficulty: 3, jeeMain: 4, jeeAdv: 4, priority: "Tier 2", studyTime: "10-12 Hours", prerequisites: "GOC, Hydrocarbons"
    },
    {
      title: "Alcohols, Phenols and Ethers",
      description: "Study the structure, preparation, physical properties, and reactions of alcohols, phenols, and ethers.",
      outcomes: ["Alcohols", "Phenols", "Ethers", "Acidity", "Important Reactions"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "12-14 Hours", prerequisites: "Haloalkanes"
    },
    {
      title: "Aldehydes, Ketones and Carboxylic Acids",
      description: "Understand carbonyl compounds, their preparation, properties, named reactions, and applications in Organic Chemistry.",
      outcomes: ["Aldehydes", "Ketones", "Carboxylic Acids", "Named Reactions", "Reaction Mechanisms"],
      difficulty: 5, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "14-16 Hours", prerequisites: "Alcohols, Phenols"
    },
    {
      title: "Amines",
      description: "Learn the classification, preparation, reactions, basicity, and importance of amines and diazonium salts.",
      outcomes: ["Amines", "Diazonium Salts", "Basicity", "Preparation", "Reactions"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "10-12 Hours", prerequisites: "Carbonyl Compounds"
    },
    {
      title: "Biomolecules",
      description: "Study carbohydrates, proteins, vitamins, nucleic acids, enzymes, and their significance in biological systems.",
      outcomes: ["Carbohydrates", "Proteins", "DNA & RNA", "Vitamins", "Enzymes"],
      difficulty: 2, jeeMain: 3, jeeAdv: 3, priority: "Tier 3", studyTime: "6-8 Hours", prerequisites: "Basic Organic Chemistry"
    },
    {
      title: "Polymers",
      description: "Understand natural and synthetic polymers, polymerization methods, biodegradable polymers, and industrial applications.",
      outcomes: ["Addition Polymerization", "Condensation Polymerization", "Synthetic Polymers", "Biopolymers", "Applications"],
      difficulty: 2, jeeMain: 3, jeeAdv: 2, priority: "Tier 3", studyTime: "4-6 Hours", prerequisites: "Organic Basics"
    },
    {
      title: "Chemistry in Everyday Life",
      description: "Explore medicines, drugs, food additives, soaps, detergents, and the role of Chemistry in daily life.",
      outcomes: ["Medicines", "Antiseptics", "Detergents", "Food Preservatives", "Drug Classification"],
      difficulty: 1, jeeMain: 2, jeeAdv: 1, priority: "Tier 4", studyTime: "3-4 Hours", prerequisites: "None"
    },
    {
      title: "Solid State",
      description: "Study crystal lattices, unit cells, packing efficiency, defects in solids, and electrical and magnetic properties of crystalline materials.",
      outcomes: ["Crystal Structure", "Unit Cell", "Packing Efficiency", "Defects", "Magnetic Properties"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "10-12 Hours", prerequisites: "Basic Geometry"
    },
    {
      title: "Surface Chemistry",
      description: "Learn adsorption, colloids, catalysis, emulsions, and surface phenomena with applications in industrial and biological systems.",
      outcomes: ["Adsorption", "Catalysis", "Colloids", "Emulsions", "Surface Phenomena"],
      difficulty: 3, jeeMain: 3, jeeAdv: 3, priority: "Tier 3", studyTime: "6-8 Hours", prerequisites: "Chemical Kinetics"
    },
    {
      title: "Practical Chemistry",
      description: "Develop laboratory skills through qualitative analysis, volumetric experiments, salt analysis, and practical techniques.",
      outcomes: ["Salt Analysis", "Titration", "Laboratory Techniques", "Qualitative Analysis", "Safety Procedures"],
      difficulty: 2, jeeMain: 1, jeeAdv: 1, priority: "Tier 4", studyTime: "5-6 Hours", prerequisites: "Stoichiometry"
    },
    {
      title: "Environmental Chemistry & Green Chemistry",
      description: "Understand sustainable chemical practices, pollution control, green chemistry principles, and environmental protection.",
      outcomes: ["Green Chemistry", "Sustainable Processes", "Pollution Control", "Waste Management", "Environmental Protection"],
      difficulty: 1, jeeMain: 1, jeeAdv: 1, priority: "Tier 4", studyTime: "3-4 Hours", prerequisites: "None"
    }
  ],
  Mathematics: [
    {
      title: "Relations and Functions",
      description: "Build the foundation of higher Mathematics by understanding relations, functions, types of functions, composition, and inverse functions.",
      outcomes: ["Types of Functions", "Domain & Range", "Composite Functions", "Inverse Functions", "Binary Operations"],
      difficulty: 3, jeeMain: 3, jeeAdv: 4, priority: "Tier 2", studyTime: "8-10 Hours", prerequisites: "Class 11 Relations & Functions"
    },
    {
      title: "Inverse Trigonometric Functions",
      description: "Learn inverse trigonometric functions, principal values, identities, properties, and their applications in Calculus.",
      outcomes: ["Inverse Trig Functions", "Principal Values", "Identities", "Graphs", "Properties"],
      difficulty: 3, jeeMain: 4, jeeAdv: 4, priority: "Tier 2", studyTime: "6-8 Hours", prerequisites: "Trigonometry"
    },
    {
      title: "Matrices",
      description: "Study matrices, matrix operations, determinants, inverse matrices, and their applications in solving systems of linear equations.",
      outcomes: ["Matrix Operations", "Types of Matrices", "Transpose", "Inverse Matrix", "Linear Equations"],
      difficulty: 3, jeeMain: 4, jeeAdv: 4, priority: "Tier 2", studyTime: "8-10 Hours", prerequisites: "Basic Algebra"
    },
    {
      title: "Determinants",
      description: "Master determinants, their properties, minors, cofactors, adjoints, and applications in solving algebraic equations and geometry problems.",
      outcomes: ["Determinants", "Cofactors", "Adjoint", "Matrix Inverse", "Applications"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "10-12 Hours", prerequisites: "Matrices"
    },
    {
      title: "Continuity and Differentiability",
      description: "Understand limits, continuity, differentiability, derivatives of inverse and implicit functions, forming the backbone of Calculus.",
      outcomes: ["Continuity", "Differentiability", "Chain Rule", "Implicit Differentiation", "Logarithmic Differentiation"],
      difficulty: 5, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "12-14 Hours", prerequisites: "Limits and Derivatives"
    },
    {
      title: "Applications of Derivatives",
      description: "Apply derivatives to solve problems involving increasing/decreasing functions, maxima-minima, tangents, normals, approximations, and optimization.",
      outcomes: ["Monotonicity", "Maxima & Minima", "Tangents", "Normals", "Optimization"],
      difficulty: 5, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "14-16 Hours", prerequisites: "Continuity & Differentiability"
    },
    {
      title: "Integrals",
      description: "Learn indefinite and definite integration, standard formulas, substitution, integration by parts, partial fractions, and integral properties.",
      outcomes: ["Indefinite Integrals", "Definite Integrals", "Integration Techniques", "Properties", "Standard Results"],
      difficulty: 5, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "18-20 Hours", prerequisites: "Differentiation"
    },
    {
      title: "Applications of Integrals",
      description: "Use integration to calculate the area under curves, enclosed regions, and solve practical problems involving geometric applications.",
      outcomes: ["Area Under Curve", "Area Between Curves", "Definite Integrals", "Geometric Applications"],
      difficulty: 4, jeeMain: 4, jeeAdv: 5, priority: "Tier 2", studyTime: "8-10 Hours", prerequisites: "Integrals, Conic Sections"
    },
    {
      title: "Differential Equations",
      description: "Study the formation and solution of differential equations with applications in Mathematics, Physics, Engineering, and real-world modeling.",
      outcomes: ["Differential Equations", "Variable Separation", "General Solution", "Particular Solution", "Applications"],
      difficulty: 4, jeeMain: 4, jeeAdv: 4, priority: "Tier 2", studyTime: "10-12 Hours", prerequisites: "Integrals"
    },
    {
      title: "Vector Algebra",
      description: "Master vectors, vector operations, dot product, cross product, scalar triple product, and applications in Geometry and Physics.",
      outcomes: ["Vector Addition", "Dot Product", "Cross Product", "Direction Cosines", "Applications"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "10-12 Hours", prerequisites: "Basic Geometry"
    },
    {
      title: "Three Dimensional Geometry",
      description: "Explore lines and planes in three-dimensional space using vector methods, distance formulas, and geometric applications.",
      outcomes: ["3D Coordinates", "Line in Space", "Plane", "Distance Formula", "Angle Between Lines"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "12-14 Hours", prerequisites: "Vector Algebra"
    },
    {
      title: "Linear Programming",
      description: "Learn optimization techniques using graphical methods to solve real-world business, economics, and engineering problems.",
      outcomes: ["Constraints", "Objective Function", "Feasible Region", "Optimization", "Graphical Method"],
      difficulty: 2, jeeMain: 2, jeeAdv: 1, priority: "Tier 3", studyTime: "4-6 Hours", prerequisites: "Linear Inequalities"
    },
    {
      title: "Probability",
      description: "Study conditional probability, Bayes' theorem, random variables, probability distributions, and their applications in statistics and data analysis.",
      outcomes: ["Conditional Probability", "Bayes' Theorem", "Random Variables", "Probability Distribution", "Mean & Variance"],
      difficulty: 4, jeeMain: 5, jeeAdv: 5, priority: "Tier 1", studyTime: "10-12 Hours", prerequisites: "Class 11 Probability"
    }
  ],
  Biology: [
    {
      title: "Sexual Reproduction in Flowering Plants",
      description: "Learn about the morphology, structure, and processes of sexual reproduction in angiosperms.",
      outcomes: ["Flower Structure", "Microsporogenesis", "Megasporogenesis", "Pollination", "Fertilization"],
      difficulty: 3, neet: 4, priority: "Tier 2", studyTime: "8-10 Hours", prerequisites: "Morphology of Flowering Plants"
    },
    {
      title: "Human Reproduction",
      description: "Detailed study of the male and female reproductive systems, gametogenesis, and embryonic development.",
      outcomes: ["Male System", "Female System", "Gametogenesis", "Menstrual Cycle", "Pregnancy & Parturition"],
      difficulty: 4, neet: 5, priority: "Tier 1", studyTime: "10-12 Hours", prerequisites: "Basic Human Physiology"
    },
    {
      title: "Reproductive Health",
      description: "Understand the importance of reproductive health, methods of birth control, and sexually transmitted diseases.",
      outcomes: ["Population Explosion", "Birth Control Methods", "MTP", "STDs", "Infertility & ART"],
      difficulty: 2, neet: 3, priority: "Tier 3", studyTime: "5-6 Hours", prerequisites: "Human Reproduction"
    },
    {
      title: "Principles of Inheritance and Variation",
      description: "Study Mendelian genetics, inheritance patterns, chromosomal disorders, and genetic variations.",
      outcomes: ["Mendel's Laws", "Incomplete Dominance", "Chromosomal Theory", "Sex Determination", "Genetic Disorders"],
      difficulty: 5, neet: 5, priority: "Tier 1", studyTime: "14-16 Hours", prerequisites: "Cell Division"
    },
    {
      title: "Molecular Basis of Inheritance",
      description: "Explore the structure of DNA and RNA, DNA replication, transcription, translation, and gene expression regulation.",
      outcomes: ["DNA Structure", "DNA Replication", "Transcription", "Genetic Code", "Translation"],
      difficulty: 5, neet: 5, priority: "Tier 1", studyTime: "15-18 Hours", prerequisites: "Biomolecules"
    },
    {
      title: "Evolution",
      description: "Trace the origin of life, theories of evolution, mechanisms of speciation, and human evolution.",
      outcomes: ["Origin of Life", "Evidences for Evolution", "Darwin's Theory", "Hardy-Weinberg Principle", "Human Evolution"],
      difficulty: 4, neet: 4, priority: "Tier 2", studyTime: "10-12 Hours", prerequisites: "Genetics"
    },
    {
      title: "Human Health and Disease",
      description: "Learn about common human diseases, the immune system, vaccination, and drug/alcohol abuse.",
      outcomes: ["Common Diseases", "Immunity", "AIDS & Cancer", "Drugs & Alcohol Abuse"],
      difficulty: 3, neet: 5, priority: "Tier 1", studyTime: "10-12 Hours", prerequisites: "Basic Human Physiology"
    },
    {
      title: "Microbes in Human Welfare",
      description: "Discover the beneficial roles of microbes in household products, industrial processes, sewage treatment, and agriculture.",
      outcomes: ["Household Microbes", "Industrial Microbes", "Sewage Treatment", "Biogas Production", "Biocontrol Agents"],
      difficulty: 2, neet: 3, priority: "Tier 3", studyTime: "6-8 Hours", prerequisites: "Biological Classification"
    },
    {
      title: "Biotechnology: Principles and Processes",
      description: "Understand the core principles of genetic engineering and the tools and processes of recombinant DNA technology.",
      outcomes: ["Genetic Engineering", "Restriction Enzymes", "Cloning Vectors", "PCR", "Downstream Processing"],
      difficulty: 4, neet: 4, priority: "Tier 2", studyTime: "10-12 Hours", prerequisites: "Molecular Basis of Inheritance"
    },
    {
      title: "Biotechnology and its Applications",
      description: "Explore the practical applications of biotechnology in agriculture, medicine, and transgenic animals.",
      outcomes: ["Bt Cotton", "Pest Resistant Plants", "Genetically Engineered Insulin", "Gene Therapy", "Transgenic Animals"],
      difficulty: 3, neet: 4, priority: "Tier 2", studyTime: "8-10 Hours", prerequisites: "Biotech Principles"
    },
    {
      title: "Organisms and Populations",
      description: "Study ecology at the organismal and population levels, including organism-environment interactions and population attributes.",
      outcomes: ["Abiotic Factors", "Adaptations", "Population Attributes", "Population Growth", "Population Interactions"],
      difficulty: 3, neet: 4, priority: "Tier 2", studyTime: "8-10 Hours", prerequisites: "Basic Biology"
    },
    {
      title: "Ecosystem",
      description: "Understand the structure and function of ecosystems, energy flow, nutrient cycling, and ecological succession.",
      outcomes: ["Ecosystem Structure", "Productivity & Decomposition", "Energy Flow", "Ecological Pyramids", "Nutrient Cycling"],
      difficulty: 3, neet: 3, priority: "Tier 3", studyTime: "8-10 Hours", prerequisites: "Organisms and Populations"
    },
    {
      title: "Biodiversity and Conservation",
      description: "Learn about the levels of biodiversity, its importance, patterns of distribution, and conservation strategies.",
      outcomes: ["Levels of Biodiversity", "Patterns of Biodiversity", "Loss of Biodiversity", "In-situ Conservation", "Ex-situ Conservation"],
      difficulty: 2, neet: 3, priority: "Tier 3", studyTime: "6-8 Hours", prerequisites: "Ecology Basics"
    }
  ]
};
