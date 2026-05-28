import { predictColleges, predictCollegesGrouped } from "../utils/collegePredictor.js";
import { loadCutoffDB, isDBReady } from "../utils/realCutoffEngine.js";

self.onmessage = async ({ data }) => {
  try {
    // Wait for real cutoff DB to finish loading before predicting
    if (!isDBReady()) {
      await loadCutoffDB();
    }
    const { type, opts } = data;
    const result = type === "grouped"
      ? predictCollegesGrouped(opts)
      : predictColleges(opts);
    self.postMessage({ ok: true, result });
  } catch (err) {
    self.postMessage({ ok: false, error: err.message });
  }
};