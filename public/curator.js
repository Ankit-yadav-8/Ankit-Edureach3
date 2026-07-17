
    const config = {
        physics: {
            pages: 155,
            chapters: [
                "Units & Dimensions", "Kinematics", "Newton's Laws of Motion", "Work, Energy & Power", "Rotational Motion",
                "Gravitation", "Properties of Matter", "Thermodynamics", "Oscillations", "Waves", "Electrostatics",
                "Current Electricity", "Magnetic Effects of Current", "Electromagnetic Induction", "Alternating Current",
                "Ray Optics", "Wave Optics", "Dual Nature of Matter", "Atomic Structure", "Nuclei", "Semiconductor Devices",
                "Communication Systems", "Experimental Physics", "Kinetic Theory of Gases", "EM Waves"
            ]
        },
        chemistry: {
            pages: 184,
            chapters: [
                "Basic Concepts of Chemistry", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Chemical Equilibrium",
                "Ionic Equilibrium", "Electrochemistry", "Chemical Kinetics", "Solutions", "Solid State", "Surface Chemistry",
                "Hydrogen & s-Block", "p-Block Elements", "d & f-Block Elements", "Coordination Compounds",
                "Basic Organic Chemistry", "Hydrocarbons", "Haloalkanes & Haloarenes", "Alcohols, Phenols & Ethers",
                "Aldehydes & Ketones", "Carboxylic Acids", "Amines", "Biomolecules", "Polymers",
                "Chemistry in Everyday Life", "Redox Reactions", "Environmental Chemistry", "States of Matter"
            ]
        },
        maths: {
            pages: 224,
            chapters: [
                "Sets, Relations & Functions", "Complex Numbers", "Quadratic Equations", "Sequences & Series",
                "Permutations & Combinations", "Binomial Theorem", "Matrices & Determinants", "Limits, Continuity",
                "Differentiation", "Integration", "Differential Equations", "Straight Lines & Circles",
                "Conic Sections", "Vectors", "3D Geometry", "Probability", "Trigonometry",
                "Inverse Trigonometric Functions", "Mathematical Reasoning"
            ]
        }
    };

    let currentSubject = "physics";
    let currentPage = 1;
    let mapping = { physics: {}, chemistry: {}, maths: {} };

    // Auto-load existing mappings from localStorage if they exist
    const saved = localStorage.getItem("mindmapMapping");
    if(saved) mapping = JSON.parse(saved);

    function changeSubject() {
        currentSubject = document.getElementById("subjectSelect").value;
        currentPage = 1;
        
        // Populate chapters
        const chapSelect = document.getElementById("chapterSelect");
        chapSelect.innerHTML = "";
        config[currentSubject].chapters.forEach((ch, idx) => {
            const opt = document.createElement("option");
            opt.value = idx + 1; // 1-indexed chapter number
            opt.textContent = `${idx + 1}. ${ch}`;
            chapSelect.appendChild(opt);
        });
        
        chapSelect.onchange = updateView; // Update tag info when chapter changes
        
        document.getElementById("totalPages").textContent = config[currentSubject].pages;
        updateView();
    }

    function updateView() {
        document.getElementById('pageNum').textContent = currentPage;
        const paddedNum = String(currentPage).padStart(3, '0');
        document.getElementById('currentImage').src = `/mindmaps_raw/${currentSubject}/${currentSubject}_page_${paddedNum}.png`;
        
        // Update tag info
        const chapId = document.getElementById("chapterSelect").value;
        const pages = mapping[currentSubject][chapId] || [];
        const info = document.getElementById("tagInfo");
        if(pages.length > 0) {
            info.textContent = `Pages mapped to Chapter ${chapId}: ${pages.join(", ")}`;
        } else {
            info.textContent = `Pages mapped to Chapter ${chapId}: None`;
        }
    }

    function prev() {
        if (currentPage > 1) {
            currentPage--;
            updateView();
        }
    }

    function next() {
        if (currentPage < config[currentSubject].pages) {
            currentPage++;
            updateView();
        }
    }

    function tagPage() {
        const chapId = document.getElementById("chapterSelect").value;
        if (!mapping[currentSubject][chapId]) mapping[currentSubject][chapId] = [];
        
        if (!mapping[currentSubject][chapId].includes(currentPage)) {
            mapping[currentSubject][chapId].push(currentPage);
            mapping[currentSubject][chapId].sort((a,b) => a-b);
            localStorage.setItem("mindmapMapping", JSON.stringify(mapping));
            updateView();
        }
    }

    function removePage() {
        const chapId = document.getElementById("chapterSelect").value;
        if (mapping[currentSubject][chapId]) {
            mapping[currentSubject][chapId] = mapping[currentSubject][chapId].filter(p => p !== currentPage);
            localStorage.setItem("mindmapMapping", JSON.stringify(mapping));
            updateView();
        }
    }

    function exportJson() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mapping, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "mindmaps.json");
        dlAnchorElem.click();
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'SELECT') return;
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'Enter') tagPage();
    });

    // Initial load
    changeSubject();


/* Handlers are bound here rather than as inline onclick="" attributes: the
   site-wide CSP blocks inline event handlers, and an unlinked internal tool is
   not a good reason to punch a hole in it. */
document.addEventListener("DOMContentLoaded", function () {
    var map = [
        ["btn-prev", prev], ["btn-next", next], ["btn-tag", tagPage],
        ["btn-remove", removePage], ["btn-export", exportJson]
    ];
    var sel = document.getElementById("subjectSelect");
    if (sel) sel.addEventListener("change", changeSubject);
    for (var i = 0; i < map.length; i++) {
        var el = document.getElementById(map[i][0]);
        if (el) el.addEventListener("click", map[i][1]);
    }
});
