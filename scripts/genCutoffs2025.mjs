import fs from "fs"; import path from "path";
global.fetch = async (url) => {
  const fp = path.join(process.cwd(), "public", url.replace(/^\//,""));
  if (!fs.existsSync(fp)) return { ok:false, async text(){return"";}, async json(){return[];} };
  const t = fs.readFileSync(fp,"utf8");
  return { ok:true, async text(){return t;}, async json(){return JSON.parse(t);} };
};
const { loadPredictorDB } = await import("../src/utils/realCutoffEngine.js");
const { predictColleges } = await import("../src/utils/collegePredictor.js");
const { CATEGORIES } = await import("../src/data/colleges.js");
await loadPredictorDB();

const TYPES = ["IIT","NIT","IIIT","GFTI"];
const base = {}; // slug -> branchCode -> cat -> [jr1open, jr1close, finalclose]
for (const cat of CATEGORIES) {
  const rows = predictColleges({ rank: 1, category: cat, rankType: "category", types: TYPES });
  for (const r of rows) {
    base[r.slug]                       ??= {};
    base[r.slug][r.branchCode]         ??= {};
    base[r.slug][r.branchCode][cat]    = [r.opening, r.r1Closing, r.closing];
  }
}
const slugs = Object.keys(base).sort();
let out = "/* ============================================================\n";
out += "   cutoffs2025.js — AUTO-GENERATED from public/data/josaa_2025.csv\n";
out += "   Real JoSAA 2025 opening/closing ranks per college · branch · category.\n";
out += "   Shape: slug -> branchCode -> CATEGORY -> [JR1 opening, JR1 closing, FINAL closing]\n";
out += "   Regenerate with: node scripts/genCutoffs2025.mjs\n";
out += "   ============================================================ */\n\n";
out += "export const BASE_CUTOFF_2025 = " + JSON.stringify(base) + ";\n";
fs.writeFileSync("src/data/cutoffs2025.js", out);
const branches = slugs.reduce((a,s)=>a+Object.keys(base[s]).length,0);
console.log(`Wrote src/data/cutoffs2025.js — ${slugs.length} colleges, ${branches} college-branch entries.`);
console.log("Sample VNIT CSE OPEN:", JSON.stringify(base["nit-nagpur"]?.cse?.OPEN), "| ECE OPEN:", JSON.stringify(base["nit-nagpur"]?.ece?.OPEN));
