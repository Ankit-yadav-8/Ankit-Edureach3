const fs = require('fs');

const extraMyths = [
  { myth: "You need to be a topper to succeed.", reality: "Consistency and practical skills matter far more than just grades." },
  { myth: "It's impossible to switch fields later.", reality: "Engineering teaches problem-solving; graduates successfully pivot to finance, management, and design." },
  { myth: "Only top-tier colleges get placements.", reality: "Skills, projects, and off-campus drives can level the playing field regardless of your college." }
];

let content = fs.readFileSync('src/data/branches.js', 'utf8');

// The myths array is currently 3 items long. We want to add these 3 extra myths to every myths array.
// A regex to find the myths array and inject the extra items.
// We can parse the JS file, but since it's a simple array, we can use regex to find the end of the myths array.
// myths: [ { ... }, { ... }, { ... } ],

const regex = /(myths:\s*\[[\s\S]*?)(\s*\],)/g;

content = content.replace(regex, (match, p1, p2) => {
  // Check if we already injected (prevent duplicate injection if run twice)
  if (p1.includes("You need to be a topper to succeed.")) return match;

  const injected = extraMyths.map(m => `\n      { myth: "${m.myth}", reality: "${m.reality}" }`).join(',');
  return `${p1},${injected}${p2}`;
});

fs.writeFileSync('src/data/branches.js', content);
console.log('Done injecting extra myths.');
