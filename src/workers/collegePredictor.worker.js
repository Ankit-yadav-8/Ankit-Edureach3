import { predictColleges, predictCollegesGrouped } from "../utils/collegePredictor.js";
import { loadPredictorDB } from "../utils/realCutoffEngine.js";  // ← changed

// Pre-warm: fetch only josaa_2025.csv the moment the worker spins up.
loadPredictorDB();  // ← changed

self.onmessage = async ({ data }) => {
  const { reqId, type, opts } = data;
  try {
    await loadPredictorDB();  // ← changed; resolves instantly if already loaded

    const result = type === "grouped"
      ? predictCollegesGrouped(opts)
      : predictColleges(opts);

    self.postMessage({ ok: true, reqId, result });
  } catch (err) {
    self.postMessage({ ok: false, reqId, error: err?.message || "Prediction failed" });
  }
};