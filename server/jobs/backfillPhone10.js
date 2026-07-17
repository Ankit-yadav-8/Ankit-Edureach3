import Enrollment from "../models/Enrollment.js";

/**
 * One-time back-fill of Enrollment.phone10 for rows written before the field
 * existed.
 *
 * "My plans" finds an enrolment by account id, email OR phone. `phone` is free
 * text (+91, spaces, dashes), so the old lookup used a /\d{10}$/ suffix regex —
 * which no index can serve, making every dashboard open scan the whole
 * collection. phone10 stores the normalised digits so that branch becomes an
 * indexed equality match.
 *
 * The match has to stay correct while old rows lack the field, and "only fall
 * back when nothing else matched" is NOT correct: a student whose email matches
 * one enrolment and whose phone matches another would silently lose the second.
 * So every row gets the field once, here, and the query can then rely on it.
 *
 * Safe to run on every boot: it only touches rows that are missing the value,
 * so it's a no-op from the second start onwards.
 */
export async function backfillPhone10() {
  try {
    const stale = await Enrollment.find({
      phone: { $nin: [null, ""] },
      $or: [{ phone10: { $exists: false } }, { phone10: null }, { phone10: "" }],
    }).select("_id phone").lean();

    if (!stale.length) return;

    const ops = stale
      .map((e) => {
        const d = String(e.phone || "").replace(/\D/g, "");
        if (d.length < 10) return null;
        return { updateOne: { filter: { _id: e._id }, update: { $set: { phone10: d.slice(-10) } } } };
      })
      .filter(Boolean);

    if (!ops.length) return;
    const r = await Enrollment.bulkWrite(ops, { ordered: false });
    console.log(`[backfill] phone10 set on ${r.modifiedCount} enrolment(s)`);
  } catch (e) {
    // Never take the server down for a back-fill: the field only makes the
    // lookup faster, and a failure here just leaves it to the next boot.
    console.error("[backfill] phone10 failed:", e.message);
  }
}
