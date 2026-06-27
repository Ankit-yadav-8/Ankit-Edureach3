const fs = require('fs');

const path = 'src/data/neetColleges.js';
let content = fs.readFileSync(path, 'utf8');

const cutoffData = {
  "sms-medical-college-jaipur": { aiq: { ur: 1300, ews: 2300, obc: 2800, sc: 14000, st: 28000 }, state: { ur: 2500, ews: 4500, obc: 6000, sc: 28000, st: 55000 } },
  "ruhs-college-of-medical-sciences-jaipur": { aiq: { ur: 2300, ews: 3400, obc: 4000, sc: 18000, st: 35000 }, state: { ur: 3500, ews: 6000, obc: 7500, sc: 32000, st: 60000 } },
  "dr-sn-medical-college-jodhpur": { aiq: { ur: 4300, ews: 6000, obc: 6800, sc: 26000, st: 42000 }, state: { ur: 5300, ews: 8000, obc: 9500, sc: 38000, st: 68000 } },
  "sardar-patel-medical-college-bikaner": { aiq: { ur: 4800, ews: 6500, obc: 7500, sc: 27000, st: 44000 }, state: { ur: 5800, ews: 8200, obc: 10000, sc: 39000, st: 69000 } },
  "r-n-t-medical-college-udaipur": { aiq: { ur: 5000, ews: 7000, obc: 8000, sc: 28000, st: 45000 }, state: { ur: 6000, ews: 8500, obc: 10500, sc: 40000, st: 70000 } },
  "jawaharlal-nehru-medical-college-ajmer": { aiq: { ur: 6000, ews: 8500, obc: 9500, sc: 31000, st: 50000 }, state: { ur: 7000, ews: 10000, obc: 11500, sc: 43000, st: 73000 } },
  "government-medical-college-kota": { aiq: { ur: 6500, ews: 9000, obc: 10000, sc: 33000, st: 52000 }, state: { ur: 7500, ews: 11000, obc: 12500, sc: 45000, st: 75000 } },
  "shri-kalyan-govt-medical-college-sikar-rajasthan": { aiq: { ur: 7200, ews: 9500, obc: 11000, sc: 35000, st: 55000 }, state: { ur: 8000, ews: 11500, obc: 13000, sc: 47000, st: 78000 } },
  "government-medical-college-bharatpur-rajasthan": { aiq: { ur: 8500, ews: 11500, obc: 12500, sc: 38000, st: 58000 }, state: { ur: 10000, ews: 14000, obc: 15500, sc: 58000, st: 90000 } },
  "government-medical-college-pali-rajasthan": { aiq: { ur: 8200, ews: 11000, obc: 12000, sc: 38000, st: 58000 }, state: { ur: 9500, ews: 13500, obc: 15000, sc: 56000, st: 88000 } },
  "government-medical-college-barmer": { aiq: { ur: 9000, ews: 12500, obc: 13500, sc: 40000, st: 62000 }, state: { ur: 11000, ews: 15000, obc: 16500, sc: 60000, st: 95000 } },
  "government-medical-college-sirohi": { aiq: { ur: 9500, ews: 13000, obc: 14000, sc: 42000, st: 65000 }, state: { ur: 11500, ews: 16000, obc: 17000, sc: 62000, st: 98000 } },
  "government-medical-college-nagaur": { aiq: { ur: 10000, ews: 13500, obc: 14500, sc: 44000, st: 68000 }, state: { ur: 12000, ews: 16500, obc: 17500, sc: 64000, st: 100000 } },
  "government-medical-college-sawai-madhopur": { aiq: { ur: 10500, ews: 14000, obc: 15500, sc: 46000, st: 70000 }, state: { ur: 13000, ews: 17500, obc: 18500, sc: 67000, st: 102000 } },
  "government-medical-college-sri-ganganagar": { aiq: { ur: 11000, ews: 14500, obc: 16000, sc: 48000, st: 72000 }, state: { ur: 13500, ews: 18000, obc: 19000, sc: 69000, st: 105000 } },
};

let modified = 0;
for (const [slug, data] of Object.entries(cutoffData)) {
  const cutoffStr = `cutoffs: ${JSON.stringify(data)}, `;
  
  // Find the exact object entry by slug and insert before the ending bracket.
  // We use a regex that matches the slug and captures the rest of the line until the closing brace
  const regex = new RegExp(`({\\s*slug:"${slug}"[^}]+)(\\s*})`, 'g');
  
  content = content.replace(regex, (match, p1, p2) => {
    modified++;
    return `${p1}, ${cutoffStr}${p2}`;
  });
}

fs.writeFileSync(path, content, 'utf8');
console.log(`Modified ${modified} colleges`);
