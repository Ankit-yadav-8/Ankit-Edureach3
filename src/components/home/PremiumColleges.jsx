/* PremiumColleges — "Premium colleges that take your JEE rank" home section.
   Top institutes outside JoSAA you can apply to directly with a JEE score,
   shown as a clean responsive table (rows stack into cards on mobile). */
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const ROWS = [
  { name: "IIIT Hyderabad", place: "Hyderabad, Telangana", type: "JEE Main",
    how: "Admission through UGEE, JEE Main, Olympiad & DASA. Institute-level counselling independent of JoSAA.", programs: "Computer Science, ECE, AI, Machine Learning, Robotics, Computational Linguistics, Data Science, MS by Research, internationally recognized research culture." },
  { name: "IISc Bangalore", place: "Bengaluru, Karnataka", type: "JEE Advanced",
    how: "Apply through the IISc Undergraduate Admissions Portal. Selection based on JEE Advanced merit with institute counselling.", programs: "BS Research in Physics, Chemistry, Mathematics, Biology, Materials, Earth & Climate Sciences with research internships and global collaborations." },
  { name: "DA-IICT Gandhinagar", place: "Gandhinagar, Gujarat", type: "JEE Main",
    how: "Institute counselling using JEE Main ranks through the DA-IICT admission portal.", programs: "ICT, Mathematics & Computing, Computer Science, Electronics, AI, Information Security, Data Science, Communication Technologies." },
  { name: "IIST Trivandrum", place: "Thiruvananthapuram, Kerala", type: "JEE Advanced",
    how: "Separate admission through the IIST portal after JEE Advanced qualification.", programs: "Aerospace Engineering, Avionics, Engineering Physics, Space Technology, Propulsion Systems, ISRO-linked academic ecosystem." },
  { name: "DTU", place: "New Delhi", type: "JEE Main",
    how: "Admission through JAC Delhi counselling.", programs: "Computer Engineering, Software Engineering, Mathematics & Computing, Mechanical, Civil, Electrical, Engineering Physics, strong alumni network and placements." },
  { name: "NSUT Delhi", place: "New Delhi", type: "JEE Main",
    how: "Admission through JAC Delhi centralized counselling.", programs: "Computer Science, Information Technology, AI & Machine Learning, Data Science, Electronics, Instrumentation, Mechanical Engineering." },
  { name: "IIIT Bangalore", place: "Bengaluru, Karnataka", type: "JEE Main",
    how: "Institute admission through IIIT-B counselling process.", programs: "Integrated iMTech CSE & ECE, AI, Data Science, Cyber Security, Digital Society, research-oriented curriculum with industry partnerships." },
  { name: "PEC Chandigarh", place: "Chandigarh", type: "JEE Main",
    how: "Admission through JoSAA and CSAB counselling.", programs: "Computer Science, Aerospace, Mechanical, Civil, Electrical, Electronics, Metallurgical Engineering and innovation-driven research." },
  { name: "LNMIIT Jaipur", place: "Jaipur, Rajasthan", type: "JEE Main",
    how: "Apply through LNMIIT admission portal using JEE Main percentile.", programs: "Computer Science, Communication & Computer Engineering, Electronics, Mechanical, AI, Data Science with semester exchange opportunities." },
  { name: "IIIT Delhi", place: "New Delhi", type: "JEE Main",
    how: "Admission through JAC Delhi.", programs: "CSE, CSAI, CSSS, ECE, Computational Biology, Design & Digital Media, interdisciplinary research and startup incubation." },
  { name: "IIPE Visakhapatnam", place: "Visakhapatnam, Andhra Pradesh", type: "JEE Advanced",
    how: "Admission through JoSAA counselling.", programs: "Petroleum Engineering, Chemical Engineering, Mechanical Engineering, Computer Science, Energy Engineering, Oil & Gas Technologies." },
  { name: "RGIPT Amethi", place: "Amethi, Uttar Pradesh", type: "JEE Adv / Main",
    how: "Admission through JoSAA and institute counselling depending on the program.", programs: "Petroleum Engineering, Chemical, Mechanical, Computer Science, AI, Energy Engineering with PSU collaborations." },
  { name: "IIIT Sri City", place: "Sri City, Andhra Pradesh", type: "JEE Main",
    how: "Admission through JoSAA & CSAB counselling.", programs: "Computer Science, Electronics & Communication, AI, Data Analytics, international collaborations, coding-focused environment." },
  { name: "IIITDM Kancheepuram", place: "Chennai, Tamil Nadu", type: "JEE Main",
    how: "Admission through JoSAA centralized counselling.", programs: "Computer Science, Electronics, Mechanical, Smart Manufacturing, Product Design, Robotics and AI." },
  { name: "NFSU Gandhinagar", place: "Gandhinagar, Gujarat", type: "JEE Main",
    how: "Apply through the NFSU admission portal with institute-level counselling.", programs: "Cyber Security, Computer Engineering, Digital Forensics, AI, Data Science, Robotics, Homeland Security Technologies." },
  { name: "JK Lakshmipat University", place: "Jaipur, Rajasthan", type: "JEE Main",
    how: "Apply through the university admission portal using JEE Main score or university selection process.", programs: "Computer Science, AI, Cyber Security, Electronics, Design Engineering, Entrepreneurship and Innovation." },
  { name: "BITS Pilani", place: "Pilani, Rajasthan", type: "BITSAT",
    how: "Admission through BITSAT online counselling conducted by BITS Pilani.", programs: "Computer Science, Electronics, Mechanical, Chemical, Mathematics & Computing, Economics, Dual Degrees, Practice School internships and global campuses." },
  { name: "LNCT University Bhopal", place: "Bhopal, Madhya Pradesh", type: "JEE Main / State",
    how: "Admission through MP state counselling and institute admissions.", programs: "Computer Science, AI & ML, Data Science, Cyber Security, Electronics, Mechanical, Civil, industry-focused curriculum and innovation labs." },
];

function TypeBadge({ type }) {
  let color = CL.blue;
  let bg = "rgba(58,134,255,.12)";
  let border = "rgba(58,134,255,.3)";
  
  if (type.includes("Adv")) {
    color = CL.coralDk;
    bg = CL.coralSoft;
    border = CL.coral + "44";
  } else if (type.includes("BITSAT")) {
    color = "#0e9c90";
    bg = "rgba(14,156,144,.12)";
    border = "rgba(14,156,144,.3)";
  } else if (type.includes("State")) {
    color = "#8b5cf6";
    bg = "rgba(139,92,246,.12)";
    border = "rgba(139,92,246,.3)";
  }

  return (
    <span style={{
      display: "inline-flex", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap",
      color,
      background: bg,
      border: `1px solid ${border}`,
      padding: "5px 12px", borderRadius: 50,
    }}>{type}</span>
  );
}

export default function PremiumColleges() {
  return (
    <section style={{ background: CL.cream, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 760, marginBottom: 34 }}>
          <span style={clEyebrow}><span style={{ width: 7, height: 7, borderRadius: "50%", background: CL.coral }} /> JEE Scores Valid Here</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: CL.ink, letterSpacing: "-1px", margin: "16px 0 10px", lineHeight: 1.12 }}>
            Top-Tier Institutions Accepting Your <span style={{ color: CL.coral }}>JEE Rank</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.02rem", lineHeight: 1.6 }}>
            Independent of JoSAA — use your JEE score to apply directly on their official websites.
          </p>
        </div>

        <div style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 20, boxShadow: CL.shadow, overflow: "hidden" }}>
          {/* header row (desktop) */}
          <div className="pc-row pc-head" style={{ color: CL.muted, borderBottom: `1px solid ${CL.line}` }}>
            <div>Institution</div><div>JEE Type</div><div>How to Apply</div><div>Programs</div>
          </div>
          <div className="pc-scroll-area">
            {ROWS.map((r, i) => (
              <motion.div
                key={r.name}
                className="pc-row"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.04 }}
                style={{ borderBottom: `1px solid ${CL.line}` }}
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
        .pc-scroll-area {
          max-height: 580px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,105,61,0.4) transparent;
        }
        .pc-scroll-area::-webkit-scrollbar { width: 8px; }
        .pc-scroll-area::-webkit-scrollbar-thumb { background: rgba(255,105,61,0.4); border-radius: 50px; }
        .pc-scroll-area .pc-row:last-child { border-bottom: none !important; }
        @media (max-width: 760px) {
          .pc-head { display: none; }
          .pc-scroll-area { max-height: none; overflow-y: visible; }
          .pc-row { grid-template-columns: 1fr; gap: 8px; padding: 18px 18px; border-bottom: 1px solid ${CL.line} !important; }
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
