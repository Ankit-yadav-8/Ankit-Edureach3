const fs = require('fs');

const semestersData = {
  "cs-it": [
    { term: "Semester 1", desc: "Foundation & Programming", courses: ["Mathematics I (Calculus)", "Physics for Computing", "Engineering Graphics", "Intro to C Programming", "Communication Skills"] },
    { term: "Semester 2", desc: "Advanced Math & Data Structures", courses: ["Mathematics II (Discrete)", "Data Structures & Algorithms", "Basic Electrical Engineering", "Object-Oriented Programming (C++)", "Digital Logic Design"] },
    { term: "Semester 3", desc: "Core CS Systems", courses: ["Design & Analysis of Algorithms", "Computer Organization & Architecture", "Database Management Systems", "Software Engineering", "Mathematics III (Prob & Stat)"] },
    { term: "Semester 4", desc: "OS & Networks", courses: ["Operating Systems", "Computer Networks", "Theory of Computation", "Web Technologies (Frontend)", "Microprocessors & Microcontrollers"] },
    { term: "Semester 5", desc: "Advanced Systems & AI", courses: ["Artificial Intelligence", "Compiler Design", "Backend Development", "Elective I (e.g. Machine Learning)", "Elective II (e.g. Cryptography)"] },
    { term: "Semester 6", desc: "Industry Readiness", courses: ["Cloud Computing", "Information Security", "Elective III (e.g. BlockChain)", "Mini Project", "Internship Preparation"] },
    { term: "Semester 7", desc: "Specialization & Major Project", courses: ["Elective IV (e.g. Big Data)", "Elective V (e.g. Computer Vision)", "Major Project Phase I", "Open Elective"] },
    { term: "Semester 8", desc: "Industry Internship / Thesis", courses: ["Major Project Phase II", "Industry Internship (6 Months)", "Ethics in IT"] }
  ],
  "electrical-electronics": [
    { term: "Semester 1", desc: "Foundation & Sciences", courses: ["Mathematics I", "Physics", "Engineering Graphics", "Intro to Programming", "Workshop Practice"] },
    { term: "Semester 2", desc: "Basic Circuits & Math", courses: ["Mathematics II", "Basic Electrical Circuits", "Chemistry", "Network Analysis", "Material Science"] },
    { term: "Semester 3", desc: "Core Electrical", courses: ["Analog Electronics", "Digital Electronics", "Electromagnetic Theory", "Signals and Systems", "Electrical Machines I"] },
    { term: "Semester 4", desc: "Advanced Core", courses: ["Electrical Machines II", "Control Systems", "Microprocessors", "Power Systems I", "Measurements & Instrumentation"] },
    { term: "Semester 5", desc: "Power & Power Electronics", courses: ["Power Electronics", "Power Systems II", "Linear Integrated Circuits", "Elective I (e.g. Renewables)", "Elective II"] },
    { term: "Semester 6", desc: "Drives & Automation", courses: ["Electric Drives", "Digital Signal Processing", "Microcontrollers", "Mini Project", "Elective III"] },
    { term: "Semester 7", desc: "Specialization & Project", courses: ["High Voltage Engineering", "Elective IV (e.g. Smart Grids)", "Major Project Phase I", "Open Elective"] },
    { term: "Semester 8", desc: "Industry/Research", courses: ["Major Project Phase II", "Industry Internship", "Professional Ethics"] }
  ],
  "mechanical": [
    { term: "Semester 1", desc: "Foundation & Sciences", courses: ["Mathematics I", "Physics", "Engineering Graphics", "Mechanics", "Workshop Practice"] },
    { term: "Semester 2", desc: "Basic Engineering", courses: ["Mathematics II", "Chemistry", "Basic Electrical", "Intro to Programming", "Material Science"] },
    { term: "Semester 3", desc: "Core Mechanics", courses: ["Thermodynamics", "Strength of Materials", "Kinematics of Machinery", "Fluid Mechanics", "Machine Drawing"] },
    { term: "Semester 4", desc: "Applied Mechanics", courses: ["Applied Thermodynamics", "Dynamics of Machinery", "Manufacturing Processes I", "Fluid Machinery", "Machine Design I"] },
    { term: "Semester 5", desc: "Design & Manufacturing", courses: ["Heat Transfer", "Machine Design II", "Manufacturing Processes II", "CAD/CAM", "Elective I (e.g. FEA)"] },
    { term: "Semester 6", desc: "Advanced Topics", courses: ["Industrial Engineering", "Operations Research", "Metrology & Measurements", "Mini Project", "Elective II (e.g. Robotics)"] },
    { term: "Semester 7", desc: "Specialization & Project", courses: ["Automobile Engineering", "Elective III (e.g. Aerospace)", "Major Project Phase I", "Open Elective"] },
    { term: "Semester 8", desc: "Industry/Research", courses: ["Major Project Phase II", "Industry Internship", "Professional Ethics"] }
  ],
  "civil-architecture": [
    { term: "Semester 1", desc: "Foundation & Sciences", courses: ["Mathematics I", "Physics", "Engineering Mechanics", "Engineering Graphics", "Communication Skills"] },
    { term: "Semester 2", desc: "Basic Engineering", courses: ["Mathematics II", "Chemistry", "Basic Electrical", "Intro to Programming", "Building Materials"] },
    { term: "Semester 3", desc: "Core Civil I", courses: ["Solid Mechanics", "Fluid Mechanics I", "Surveying", "Building Construction", "Engineering Geology"] },
    { term: "Semester 4", desc: "Core Civil II", courses: ["Structural Analysis I", "Fluid Mechanics II", "Concrete Technology", "Transportation Engineering I", "Soil Mechanics"] },
    { term: "Semester 5", desc: "Design & Analysis", courses: ["Structural Analysis II", "Design of RC Structures", "Environmental Engineering I", "Foundation Engineering", "Elective I"] },
    { term: "Semester 6", desc: "Advanced Civil", courses: ["Design of Steel Structures", "Transportation Engineering II", "Environmental Engineering II", "Mini Project", "Elective II"] },
    { term: "Semester 7", desc: "Specialization & Project", courses: ["Construction Management", "Estimation & Costing", "Major Project Phase I", "Elective III"] },
    { term: "Semester 8", desc: "Industry/Research", courses: ["Major Project Phase II", "Industry Internship", "Professional Ethics"] }
  ],
  "ai-data-science": [
    { term: "Semester 1", desc: "Foundation & Programming", courses: ["Mathematics I (Linear Algebra)", "Intro to Python Programming", "Engineering Graphics", "Physics for Computing", "Communication Skills"] },
    { term: "Semester 2", desc: "Math & Data Structures", courses: ["Mathematics II (Prob & Stat)", "Data Structures", "Object-Oriented Programming", "Digital Logic", "Basic Electrical"] },
    { term: "Semester 3", desc: "Core CS & Data", courses: ["Design & Analysis of Algorithms", "Database Management Systems", "Intro to Data Science", "Computer Organization", "Discrete Math"] },
    { term: "Semester 4", desc: "Machine Learning Foundations", courses: ["Machine Learning I", "Operating Systems", "Data Mining & Warehousing", "Optimization Techniques", "Web Technologies"] },
    { term: "Semester 5", desc: "Deep Learning & AI", courses: ["Deep Learning", "Artificial Intelligence", "Big Data Analytics", "Elective I (e.g. NLP)", "Cloud Computing"] },
    { term: "Semester 6", desc: "Advanced AI Applications", courses: ["Computer Vision", "Reinforcement Learning", "Elective II (e.g. MLOps)", "Mini Project", "Internship Prep"] },
    { term: "Semester 7", desc: "Specialization", courses: ["Elective III (e.g. GenAI)", "Elective IV (e.g. Robotics)", "Major Project Phase I", "Open Elective"] },
    { term: "Semester 8", desc: "Industry/Thesis", courses: ["Major Project Phase II", "Industry Internship (6 Months)", "AI Ethics & Policy"] }
  ],
  "chemical": [
    { term: "Semester 1", desc: "Foundation & Sciences", courses: ["Mathematics I", "Physics", "Chemistry I", "Intro to Programming", "Engineering Graphics"] },
    { term: "Semester 2", desc: "Basic Engineering", courses: ["Mathematics II", "Chemistry II", "Basic Electrical", "Engineering Mechanics", "Process Calculations"] },
    { term: "Semester 3", desc: "Core Chemical I", courses: ["Fluid Mechanics", "Chemical Engineering Thermodynamics I", "Material Science", "Mechanical Operations", "Organic Chemistry"] },
    { term: "Semester 4", desc: "Core Chemical II", courses: ["Heat Transfer", "Mass Transfer I", "Chemical Engineering Thermodynamics II", "Numerical Methods", "Physical Chemistry"] },
    { term: "Semester 5", desc: "Reactor Design & Control", courses: ["Chemical Reaction Engineering I", "Mass Transfer II", "Process Dynamics & Control", "Elective I (e.g. Polymer Tech)", "Industrial Chemistry"] },
    { term: "Semester 6", desc: "Advanced Chemical", courses: ["Chemical Reaction Engineering II", "Process Equipment Design", "Transport Phenomena", "Mini Project", "Elective II"] },
    { term: "Semester 7", desc: "Plant Design", courses: ["Plant Design & Economics", "Elective III (e.g. Petroleum Tech)", "Major Project Phase I", "Open Elective"] },
    { term: "Semester 8", desc: "Industry/Research", courses: ["Major Project Phase II", "Industry Internship", "Safety & Ethics"] }
  ]
};

let content = fs.readFileSync('src/data/branchExtra.js', 'utf8');

for (const [slug, semesters] of Object.entries(semestersData)) {
  const searchRegex = new RegExp(`("${slug}":\\s*\\{[\\s\\S]*?)"semesters":\\s*\\[[\\s\\S]*?\\],`);
  
  if (content.match(searchRegex)) {
    const replaceStr = `$1"semesters": ${JSON.stringify(semesters, null, 6).replace(/\n/g, '\n    ')},`;
    content = content.replace(searchRegex, replaceStr);
  } else {
    // If it doesn't match the regex (maybe it doesn't have semesters yet), we can skip or inject it.
    console.log(`Could not find semesters for ${slug}`);
  }
}

fs.writeFileSync('src/data/branchExtra.js', content);
console.log('Done injecting detailed semesters.');
