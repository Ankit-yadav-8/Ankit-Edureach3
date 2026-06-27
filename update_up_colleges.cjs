const fs = require('fs');

// 1. Read the CSV
const csv = fs.readFileSync('public/data/UP_Govt_Medical_Colleges_Cutoff_Ranges.csv', 'utf8');
const lines = csv.trim().split('\n');
const getUpper = (rangeStr) => {
  if (!rangeStr) return null;
  const parts = rangeStr.split('-');
  return parseInt(parts[parts.length - 1], 10);
};

const csvData = [];
for (let i = 1; i < lines.length; i++) {
  let line = lines[i];
  if (!line.trim()) continue;
  let cols = [];
  let inQuotes = false;
  let curr = "";
  for (let char of line) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) { cols.push(curr); curr = ""; }
    else curr += char;
  }
  cols.push(curr);
  csvData.push({
    name: cols[0].trim(),
    cutoffs: {
      aiq: { ur: getUpper(cols[5]), ews: getUpper(cols[7]), obc: getUpper(cols[9]), sc: getUpper(cols[11]), st: getUpper(cols[13]) },
      state: { ur: getUpper(cols[6]), ews: getUpper(cols[8]), obc: getUpper(cols[10]), sc: getUpper(cols[12]), st: getUpper(cols[14]) }
    }
  });
}

// 2. Read the JS file
let content = fs.readFileSync('src/data/neetColleges.js', 'utf8');

// 3. Extract all slugs and names
const slugNameRegex = /{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g;
let match;
const jsColleges = [];
while ((match = slugNameRegex.exec(content)) !== null) {
  jsColleges.push({ slug: match[1], name: match[2] });
}

// 4. Map CSV names to JS slugs
function simplify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const mapped = [];
for (const csvCol of csvData) {
  let bestMatch = null;
  let bestScore = -1;
  const sCsv = simplify(csvCol.name);
  
  for (const jsCol of jsColleges) {
    const sJs = simplify(jsCol.name);
    // Simple substring or matching logic
    if (sJs.includes(sCsv) || sCsv.includes(sJs)) {
      bestMatch = jsCol.slug;
      break;
    }
    // Try matching words
    const wCsv = sCsv.replace(/autonomous|medical|college|society|government|institute/g, '');
    const wJs = sJs.replace(/autonomous|medical|college|society|government|institute/g, '');
    if (wCsv.length > 3 && (wJs.includes(wCsv) || wCsv.includes(wJs))) {
      bestMatch = jsCol.slug;
      break;
    }
  }
  
  if (bestMatch) {
    mapped.push({ slug: bestMatch, csvName: csvCol.name, cutoffs: csvCol.cutoffs });
  } else {
    console.log("Could not find match for:", csvCol.name);
  }
}

// 5. Safely replace in JS file using exact slugs
let modified = 0;
for (const m of mapped) {
  const cutoffStr = `cutoffs: ${JSON.stringify(m.cutoffs)}, `;
  // Find EXACT slug and replace before the closing brace of that object
  const regex = new RegExp(`({\\s*slug:"${m.slug}"[^}]+)(\\s*})`, 'g');
  
  content = content.replace(regex, (match, p1, p2) => {
    // If it already has cutoffs, we don't duplicate (though it shouldn't)
    if (p1.includes('cutoffs:')) {
      p1 = p1.replace(/,\s*cutoffs:\s*{[^}]*?}\s*/, '');
    }
    modified++;
    return `${p1}, ${cutoffStr}${p2}`;
  });
}

fs.writeFileSync('src/data/neetColleges.js', content, 'utf8');
console.log(`Modified ${modified} UP colleges successfully.`);
