
import { predictColleges, predictCollegesGrouped } from "../utils/collegePredictor.js";
import { loadCutoffDB } from "../utils/realCutoffEngine.js";

self.onmessage = async ({ data }) => {
  try {
    const { type, opts } = data;

    // Ensure JoSAA CSVs are loaded *in this worker's context* first.
    await loadCutoffDB();

    const result = type === "grouped"
      ? predictCollegesGrouped(opts)
      : predictColleges(opts);

    self.postMessage({ ok: true, result });
  } catch (err) {
    self.postMessage({ ok: false, error: err?.message || "Prediction failed" });
  }
};