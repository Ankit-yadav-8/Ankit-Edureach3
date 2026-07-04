const fs = require('fs');

const reorderedSlugs = [
  "ai-data-science",
  "cs-it",
  "mathematics-computing",
  "electronics-electrical",
  "sciences-applied",
  "chemical",
  "mechanical-robotics",
  "aerospace-avionics",
  "civil-architecture",
  "materials-mining",
  "production-industrial",
  "biotech-biosciences",
  "mining-earth",
  "petroleum-energy",
  "naval-ocean"
];

const updates = {
  "ai-data-science": { salary: "₹28 LPA", growth: "Very High", risk: 45 },
  "cs-it": { salary: "₹30 LPA", growth: "Very High", risk: 40 },
  "mathematics-computing": { salary: "₹27 LPA", growth: "Very High", risk: 42 },
  "electronics-electrical": { salary: "₹24 LPA", growth: "Very High", risk: 40 },
  "sciences-applied": { salary: "₹21 LPA", growth: "High", risk: 35 },
  "chemical": { salary: "₹17 LPA", growth: "Stable", risk: 33 },
  "mechanical-robotics": { salary: "₹18 LPA", growth: "Stable", risk: 32 },
  "aerospace-avionics": { salary: "₹19 LPA", growth: "Growing", risk: 34 },
  "civil-architecture": { salary: "₹15 LPA", growth: "Growing", risk: 31 },
  "materials-mining": { salary: "₹16 LPA", growth: "Growing", risk: 29 },
  "production-industrial": { salary: "₹18 LPA", growth: "High", risk: 30 },
  "biotech-biosciences": { salary: "₹15 LPA", growth: "Emerging", risk: 35 },
  "mining-earth": { salary: "₹16 LPA", growth: "Stable", risk: 27 },
  "petroleum-energy": { salary: "₹18 LPA", growth: "Cyclical", risk: 35 },
  "naval-ocean": { salary: "₹17 LPA", growth: "Niche", risk: 31 }
};

let content = fs.readFileSync('src/data/branches.js', 'utf8');

// Update stats
for (const [slug, data] of Object.entries(updates)) {
  const slugRegex = new RegExp(`(slug:\\s*["']${slug}["'][\\s\\S]*?stats:\\s*\\{\\s*jobGrowth:\\s*["']).*?(["'],\\s*medianSalary:\\s*["']).*?(["'],\\s*aiRisk:\\s*)\\d+(\\s*\\})`);
  content = content.replace(slugRegex, `$1${data.growth}$2${data.salary}$3${data.risk}$4`);
}

// Reorder array
const startStr = "export const BRANCHES = [";
const startIdx = content.indexOf(startStr) + startStr.length;

let depth = 1;
let endIdx = -1;
for (let i = startIdx; i < content.length; i++) {
  if (content[i] === '[') depth++;
  if (content[i] === ']') depth--;
  if (depth === 0) {
    endIdx = i;
    break;
  }
}

const preamble = content.slice(0, startIdx);
const arrayContent = content.slice(startIdx, endIdx);
const postamble = content.slice(endIdx);

// Now split the arrayContent into individual branch objects.
// Since each object starts with `{` and ends with `}`, we can parse it by matching the top-level objects.
const objects = [];
let objStart = -1;
depth = 0;
for (let i = 0; i < arrayContent.length; i++) {
  if (arrayContent[i] === '{') {
    if (depth === 0) objStart = i;
    depth++;
  } else if (arrayContent[i] === '}') {
    depth--;
    if (depth === 0 && objStart !== -1) {
      // Find trailing comma if any
      let j = i + 1;
      while (j < arrayContent.length && /\s/.test(arrayContent[j])) j++;
      if (arrayContent[j] === ',') j++;
      objects.push(arrayContent.slice(objStart, j));
      objStart = -1;
    }
  }
}

const blocksMap = {};
for (const objStr of objects) {
  const match = objStr.match(/slug:\s*["']([^"']+)["']/);
  if (match) {
    blocksMap[match[1]] = objStr;
  }
}

// Map the reordered slugs to their block strings
let newArrayContent = '\n' + reorderedSlugs.map(slug => '  ' + blocksMap[slug].trim()).join(',\n\n') + '\n';

fs.writeFileSync('src/data/branches.js', preamble + newArrayContent + postamble);
console.log('Successfully updated and reordered.');
