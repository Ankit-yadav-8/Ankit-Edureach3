import { predictColleges, predictCollegesGrouped } from "../utils/collegePredictor.js";

self.onmessage = ({ data }) => {
  try {
    const { type, opts } = data;
    const result = type === "grouped"
      ? predictCollegesGrouped(opts)
      : predictColleges(opts);
    self.postMessage({ ok: true, result });
  } catch (err) {
    self.postMessage({ ok: false, error: err.message });
  }
};