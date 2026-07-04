const fs = require('fs');

// IIT Average Packages mapping for the branches
// We will increase the medianSalary in branches.js stats block.
const salaryUpdates = {
  "cs-it": "₹28 LPA",
  "electrical-electronics": "₹22 LPA",
  "mechanical": "₹17 LPA",
  "civil-architecture": "₹15 LPA",
  "ai-data-science": "₹26 LPA",
  "chemical": "₹16 LPA",
  "aerospace": "₹15 LPA",
  "materials-metallurgy": "₹14 LPA",
  "biotechnology": "₹13 LPA",
  "math-computing": "₹27 LPA",
  "robotics-mechatronics": "₹18 LPA",
  "engineering-physics": "₹19 LPA",
  "industrial-production": "₹14 LPA",
  "energy-environmental": "₹12 LPA",
  "textile-manufacturing": "₹11 LPA"
};

let content = fs.readFileSync('src/data/branches.js', 'utf8');

for (const [slug, newSalary] of Object.entries(salaryUpdates)) {
  // Regex to find the stats block for the specific branch
  // Format: stats: { jobGrowth: "...", medianSalary: "...", aiRisk: ... }
  const slugRegex = new RegExp(`slug:\\s*["']${slug}["'][\\s\\S]*?stats:\\s*\\{[^}]*medianSalary:\\s*["'][^"']+["'][^}]*\\}`);
  
  content = content.replace(slugRegex, (match) => {
    return match.replace(/medianSalary:\s*["'][^"']+["']/, `medianSalary: "${newSalary}"`);
  });
}

fs.writeFileSync('src/data/branches.js', content);
console.log('Done updating salaries to IIT averages.');
