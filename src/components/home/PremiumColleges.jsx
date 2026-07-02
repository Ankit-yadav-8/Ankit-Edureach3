/* PremiumColleges — "Premium colleges that take your JEE rank" home section.
   Top institutes outside JoSAA you can apply to directly with a JEE score,
   shown as a clean responsive table (rows stack into cards on mobile). */
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const ROWS = [
  { name: "IISc Bangalore", place: "Bengaluru, Karnataka", type: "JEE Advanced",
    how: "Apply via IISc portal — separate from JoSAA", programs: "BS Research — Physics, Chemistry, Materials, Maths" },
  { name: "IIST Trivandrum", place: "Thiruvananthapuram, Kerala", type: "JEE Advanced",
    how: "Apply via iist.ac.in — not in JoSAA", programs: "Aerospace Engg, Avionics, Physical Sciences" },
  { name: "IIIT Hyderabad", place: "Hyderabad, Telangana", type: "JEE Main",
    how: "Direct Mode counseling — iiit.ac.in", programs: "CSE, ECE, Computational Linguistics, CLD" },
  { name: "IIIT Bangalore", place: "Bengaluru, Karnataka", type: "JEE Main",
    how: "Apply via iiitb.ac.in institutional counseling", programs: "iMTech CS, iMTech ECE (5-year integrated)" },
  { name: "DTU / NSUT / IIIT Delhi", place: "New Delhi", type: "JEE Main",
    how: "JAC Delhi centralised counselling", programs: "CS, ECE, Mechanical, Civil + interdisciplinary programs" },
  { name: "DA-IICT Gandhinagar", place: "Gandhinagar, Gujarat", type: "JEE Main",
    how: "All India Seats via daiict.ac.in", programs: "ICT, Mathematics & Computing, ICT + CS" },
  { name: "Amrita / Thapar / BIT Mesra", place: "Multiple Locations", type: "JEE Main",
    how: "Apply via respective portals with JEE Main rank", programs: "CS, ECE, Mechanical, Chemical and more" },
  { name: "Plaksha University", place: "Mohali, Punjab", type: "JEE Main",
    how: "JEE Main + Plaksha interview — plaksha.edu.in", programs: "B.Tech — Technology, Liberal Arts & Management" },
];

function TypeBadge({ type }) {
  const adv = type === "JEE Advanced";
  return (
    <span style={{
      display: "inline-flex", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap",
      color: adv ? CL.coralDk : CL.blue,
      background: adv ? CL.coralSoft : "rgba(58,134,255,.12)",
      border: `1px solid ${adv ? CL.coral + "44" : "rgba(58,134,255,.3)"}`,
      padding: "5px 12px", borderRadius: 50,
    }}>{type}</span>
  );
}

export default function PremiumColleges() {
  return (
    <section style={{ background: CL.cream, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 760, marginBottom: 34 }}>
          <span style={clEyebrow}><span style={{ width: 7, height: 7, borderRadius: "50%", background: CL.coral }} /> JEE score accepted here</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: CL.ink, letterSpacing: "-1px", margin: "16px 0 10px", lineHeight: 1.12 }}>
            Premium colleges that take your <span style={{ color: CL.coral }}>JEE rank</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.02rem", lineHeight: 1.6 }}>
            Outside JoSAA — apply directly to their portals with your JEE score.
          </p>
        </div>

        <div style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 20, boxShadow: CL.shadow, overflow: "hidden" }}>
          {/* header row (desktop) */}
          <div className="pc-row pc-head" style={{ color: CL.muted }}>
            <div>Institution</div><div>JEE Type</div><div>How to Apply</div><div>Programs</div>
          </div>
          {ROWS.map((r, i) => (
            <motion.div
              key={r.name}
              className="pc-row"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: (i % 4) * 0.04 }}
              style={{ borderTop: `1px solid ${CL.line}` }}
            >
              <div data-label="Institution">
                <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14.5, color: CL.ink }}>{r.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: CL.muted, marginTop: 3 }}>
                  <MapPin size={11} /> {r.place}
                </div>
              </div>
              <div data-label="JEE Type"><TypeBadge type={r.type} /></div>
              <div data-label="How to Apply" style={{ fontSize: 13, color: CL.body, lineHeight: 1.5 }}>{r.how}</div>
              <div data-label="Programs" style={{ fontSize: 13, color: CL.body, lineHeight: 1.5 }}>{r.programs}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .pc-row {
          display: grid;
          grid-template-columns: 1.3fr 0.8fr 1.7fr 1.7fr;
          gap: 18px; align-items: center;
          padding: 18px 24px;
        }
        .pc-head {
          font-size: 11px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
        }
        @media (max-width: 760px) {
          .pc-head { display: none; }
          .pc-row { grid-template-columns: 1fr; gap: 8px; padding: 18px 18px; }
          .pc-row > div[data-label]::before {
            content: attr(data-label);
            display: block; font-size: 10px; font-weight: 800; letter-spacing: .06em;
            text-transform: uppercase; color: #9A949F; margin-bottom: 3px;
          }
        }
      `}</style>
    </section>
  );
}
