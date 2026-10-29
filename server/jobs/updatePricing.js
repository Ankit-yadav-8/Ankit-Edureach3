import Enrollment from "../models/Enrollment.js";

/**
 * Migration job: updates Yukeeth Prathap and Yuvan Prathap international tier
 * mentorship records from 1 rupee test payment to actual ₹13,999 pricing in MongoDB.
 */
export async function updatePricingJob() {
  try {
    const res = await Enrollment.updateMany(
      {
        $or: [
          { email: { $in: ["yukeethjee@gmail.com", "yuvanjee28@gmail.com"] } },
          { name: { $regex: /yukeeth|yuvan/i } }
        ],
        amount: { $lt: 1000 }
      },
      {
        $set: {
          amount: 13999,
          originalAmount: 13999
        }
      }
    );
    if (res.modifiedCount > 0) {
      console.log(`✅ [PRICING UPDATE] Updated ${res.modifiedCount} enrollment(s) for Yukeeth & Yuvan to ₹13,999.`);
    }
  } catch (err) {
    console.error("⚠️ [PRICING UPDATE FAILED]:", err.message);
  }
}
