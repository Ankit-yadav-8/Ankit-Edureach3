const fs = require('fs');

const recruitersMap = {
  "cs-it": ["Google", "Microsoft", "Amazon", "Adobe", "Flipkart", "Apple", "Meta", "Netflix", "Uber", "Atlassian", "Goldman Sachs", "Tower Research", "Rubrik", "DE Shaw", "NVIDIA", "Intel", "Cisco", "IBM"],
  "ai-data-science": ["OpenAI", "DeepMind", "Google", "Microsoft", "Meta", "Amazon", "NVIDIA", "Tesla", "Palantir", "Databricks", "Snowflake", "IBM", "Scale AI"],
  "electrical-electronics": ["Intel", "Qualcomm", "Texas Instruments", "NVIDIA", "Samsung", "AMD", "Broadcom", "Apple", "TSMC", "Cisco", "GE", "Siemens", "Schneider Electric"],
  "mechanical": ["Tata Motors", "Mahindra", "Bajaj", "Maruti Suzuki", "L&T", "Boeing", "Airbus", "GE Aviation", "Rolls Royce", "Bosch", "Siemens", "Dassault Systemes"],
  "civil-architecture": ["L&T", "Tata Projects", "Shapoorji Pallonji", "HCC", "AFCONS", "DLF", "Godrej Properties", "Bechtel", "Jacobs", "Ramboll", "Arup"],
  "chemical": ["Reliance", "BPCL", "HPCL", "IOCL", "ONGC", "BASF", "Dow Chemical", "DuPont", "Dr Reddy's", "Sun Pharma", "Cipla"],
  "materials-metallurgical": ["Tata Steel", "JSW Steel", "Hindalco", "Vedanta", "SAIL", "Applied Materials", "Intel", "TSMC", "Reliance", "Boeing"],
  "biotechnology": ["Biocon", "Dr Reddy's", "Serum Institute", "Sun Pharma", "Bharat Biotech", "Novozymes", "Illumina", "Thermo Fisher", "Pfizer"],
  "mathematics-computing": ["Jane Street", "Optiver", "Tower Research", "Goldman Sachs", "Morgan Stanley", "J.P. Morgan", "Google", "Microsoft", "Amazon", "WorldQuant"],
  "applied-physics": ["ISRO", "DRDO", "BARC", "Intel", "Applied Materials", "TSMC", "ASML", "IBM Quantum", "IBM Research", "GE Healthcare"],
  "aerospace": ["ISRO", "DRDO", "Boeing", "Airbus", "HAL", "GE Aviation", "Rolls Royce", "Pratt & Whitney", "Bellatrix Aerospace", "Skyroot"],
  "mining": ["Coal India", "Vedanta", "Tata Steel", "Hindalco", "NMDC", "HZL", "Rio Tinto", "BHP", "NLC India", "Sandvik"],
  "petroleum-energy": ["ONGC", "OIL", "Reliance", "Cairn", "Schlumberger", "Halliburton", "Baker Hughes", "BP", "Shell", "ExxonMobil", "Chevron"],
  "production-industrial": ["ITC", "HUL", "P&G", "L&T", "Tata Motors", "Maruti Suzuki", "Amazon Operations", "Flipkart Supply Chain", "TVS", "Bosch"],
  "naval-ocean": ["Mazagon Dock", "Cochin Shipyard", "L&T Shipbuilding", "Garden Reach", "Indian Register of Shipping", "Shell", "BP", "Maersk"]
};

let content = fs.readFileSync('src/data/branchExtra.js', 'utf8');

for (const [slug, recruiters] of Object.entries(recruitersMap)) {
  const searchStr = `"${slug}": {`;
  if (content.includes(searchStr)) {
    const replaceStr = `"${slug}": {\n    "recruiters": ${JSON.stringify(recruiters, null, 6).replace(/\]/g, '    ]')},`;
    content = content.replace(searchStr, replaceStr);
  }
}

fs.writeFileSync('src/data/branchExtra.js', content);
console.log('Done injecting recruiters.');
