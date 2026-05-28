/**
 * collegePredictor.worker.js
 * ───────────────────────────────────────────────────────────────
 * Runs predictions off the main thread.
 *
 * A Web Worker has its OWN module instance of realCutoffEngine.js,
 * so its `DB` starts empty. We load the CSVs here — but only ONCE.
 * loadCutoffDB() is idempotent (it caches its promise), so as long
 * as this worker is kept alive (see useCollegePredictor.js) the
 * 8-year load happens a single time and every later prediction is
 * instant.
 *
 * We also kick the load off at module top level so it begins the
 * moment the worker spins up (on page mount) — usually finishing
 * while the user is still filling in rank / filters.
 */

import { predictColleges, predictCollegesGrouped } from "../utils/collegePredictor.js";
import { loadCutoffDB } from "../utils/realCutoffEngine.js";

// Pre-warm: start loading immediately, don't wait for the first click.
loadCutoffDB();

self.onmessage = async ({ data }) => {
  const { reqId, type, opts } = data;
  try {
    await loadCutoffDB();   // resolves instantly if already loaded/loading

    const result = type === "grouped"
      ? predictCollegesGrouped(opts)
      : predictColleges(opts);

    self.postMessage({ ok: true, reqId, result });
  } catch (err) {
    self.postMessage({ ok: false, reqId, error: err?.message || "Prediction failed" });
  }
};