import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Cutoff from "./models/Cutoff.js";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, "data", "josaa_cutoffs.csv"); // -> server/data/josaa_cutoffs.csv

async function importData() {
  if (!process.env.MONGO_URI) { console.error("❌ MONGO_URI missing in server/.env"); process.exit(1); }
  if (!fs.existsSync(CSV_PATH)) { console.error(`❌ CSV not found at ${CSV_PATH}`); process.exit(1); }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  await Cutoff.deleteMany({});
  console.log("🗑️  Cleared old cutoff data");

  const records = [];
  fs.createReadStream(CSV_PATH)
    .pipe(csv())
    .on("data", (row) => {
      const closing = parseFloat(row["Closing Rank"]);
      if (!closing || closing <= 0) return; // skip blank / header-junk rows
      const institute = row["Institute"];
      records.push({
        institute,
        program:      row["Academic Program Name"],
        quota:        row["Quota"],
        seat_type:    row["Seat Type"],
        gender:       row["Gender"],
        opening_rank: parseFloat(row["Opening Rank"]) || closing,
        closing_rank: closing,
        round:        parseInt(row["Round"]) || 0,
        year:         parseInt(row["Year"]) || 0,
        exam: institute?.toLowerCase().includes("indian institute of technology")
              ? "JEE_ADVANCED"
              : "JEE_MAIN",
      });
    })
    .on("end", async () => {
      console.log(`📦 Valid records: ${records.length.toLocaleString()}`);
      const batchSize = 2000;
      for (let i = 0; i < records.length; i += batchSize) {
        await Cutoff.insertMany(records.slice(i, i + batchSize), { ordered: false });
        process.stdout.write(`\r⏳ Inserted ${Math.min(i + batchSize, records.length).toLocaleString()} / ${records.length.toLocaleString()}`);
      }
      console.log("\n\n📊 Records by year:");
      for (const y of [...new Set(records.map((r) => r.year))].sort()) {
        console.log(`   ${y}: ${records.filter((r) => r.year === y).length.toLocaleString()}`);
      }
      console.log("\n✅ Import complete!");
      await mongoose.disconnect();
    })
    .on("error", (e) => { console.error("❌ CSV read error:", e.message); process.exit(1); });
}

importData().catch((e) => { console.error(e); process.exit(1); });