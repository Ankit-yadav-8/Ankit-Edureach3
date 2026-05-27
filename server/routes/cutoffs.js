import express from "express";
import Cutoff from "../models/Cutoff.js";

const router = express.Router();

// GET /api/cutoffs?year=2024&exam=JEE_ADVANCED&seat_type=OPEN&gender=Gender-Neutral&institute=Bombay&round=1&page=1&limit=100
router.get("/", async (req, res) => {
  try {
    const { year = 2024, round, exam, seat_type, gender, institute, program, quota } = req.query;
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(500, Math.max(1, parseInt(req.query.limit) || 100)); // cap at 500

    const filter = { year: parseInt(year) };
    if (round)     filter.round     = parseInt(round);
    if (exam)      filter.exam      = exam;
    if (seat_type) filter.seat_type = seat_type;
    if (gender)    filter.gender    = gender;
    if (quota)     filter.quota     = quota;
    if (institute) filter.institute = new RegExp(institute, "i");
    if (program)   filter.program   = new RegExp(program, "i");

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Cutoff.find(filter).sort({ closing_rank: 1 }).skip(skip).limit(limit).lean(),
      Cutoff.countDocuments(filter),
    ]);
    res.json({ total, page, pages: Math.ceil(total / limit), data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/years", async (_req, res) => {
  const years = await Cutoff.distinct("year");
  res.json(years.sort((a, b) => b - a));
});

router.get("/institutes", async (req, res) => {
  const filter = req.query.exam ? { exam: req.query.exam } : {};
  const institutes = await Cutoff.distinct("institute", filter);
  res.json(institutes.sort());
});

// distinct filter values for a given year — handy for frontend dropdowns
router.get("/filters", async (req, res) => {
  const year = parseInt(req.query.year) || 2024;
  const [seat_types, quotas, genders, rounds] = await Promise.all([
    Cutoff.distinct("seat_type", { year }),
    Cutoff.distinct("quota", { year }),
    Cutoff.distinct("gender", { year }),
    Cutoff.distinct("round", { year }),
  ]);
  res.json({ seat_types: seat_types.sort(), quotas: quotas.sort(), genders: genders.sort(), rounds: rounds.sort((a, b) => a - b) });
});

export default router;