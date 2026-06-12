import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Download, Share2, Sparkles } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   JEE ADVANCED 2026 — RESULTS & RANK LIST
   Self-contained, scoped under `.jadv-page`. Bright, light
   pastel theme with rich entrance + ambient animations.
═══════════════════════════════════════════════════════════ */

/* ── DATA ─────────────────────────────────────────────────── */
const HEADER_STATS = [
  { val: "1,87,389", lbl: "Registered" },
  { val: "1,79,694", lbl: "Appeared (Both Papers)" },
  { val: "56,880", lbl: "Qualified" },
  { val: "10,107", lbl: "Female Qualified" },
  { val: "360", lbl: "Max Marks" },
];

const TOP10 = [
  { rank: 1, name: "SHUBHAM KUMAR", zone: "IIT DELHI", marks: 330, cls: "rank-1" },
  { rank: 2, name: "KABEER CHHILLAR", zone: "IIT DELHI", marks: 329, cls: "rank-2" },
  { rank: 3, name: "JATIN CHAHAR", zone: "IIT DELHI", marks: 319, cls: "rank-3" },
  { rank: 4, name: "MOHIT SHEKHER SHUKLA", zone: "IIT MADRAS", marks: 319, cls: "rank-3" },
  { rank: 5, name: "KUCHI SANDEEP", zone: "IIT MADRAS", marks: 318, cls: "rank-n" },
  { rank: 6, name: "B JAYAKRISHNA SRINIVAS", zone: "IIT BOMBAY", marks: 314, cls: "rank-n" },
  { rank: 7, name: "ARNAV GAUTAM", zone: "IIT DELHI", marks: 314, cls: "rank-n" },
  { rank: 8, name: "KANISHK JAIN", zone: "IIT BOMBAY", marks: 313, cls: "rank-n" },
  { rank: 9, name: "MEDISETTI NAGA SAHARSHA", zone: "IIT MADRAS", marks: 312, cls: "rank-n" },
  { rank: 10, name: "DARSH SIKKA", zone: "IIT DELHI", marks: 311, cls: "rank-n" },
];

const CATEGORY_RANK1 = [
  { name: "SHUBHAM KUMAR", zone: "IIT DELHI", badge: "OPEN (CRL)", key: "crl" },
  { name: "B JAYAKRISHNA SRINIVAS", zone: "IIT BOMBAY", badge: "GEN-EWS", key: "ews" },
  { name: "JATIN CHAHAR", zone: "IIT DELHI", badge: "OBC-NCL", key: "obc" },
  { name: "KOVID BOOB", zone: "IIT BOMBAY", badge: "SC", key: "sc" },
  { name: "JATIN KUMAR", zone: "IIT DELHI", badge: "ST", key: "st" },
  { name: "ARSH JAIN", zone: "IIT KANPUR", badge: "CRL-PwD", key: "pwd" },
  { name: "PARVA PAVAN AGRAWAL", zone: "IIT DELHI", badge: "GEN-EWS-PwD", key: "ews" },
  { name: "NANALA NAGA CHAITANYA", zone: "IIT MADRAS", badge: "OBC-NCL-PwD", key: "obc" },
  { name: "NAVTEJ", zone: "IIT ROORKEE", badge: "SC-PwD", key: "sc" },
  { name: "ANCHAL PURI", zone: "IIT KANPUR", badge: "ST-PwD", key: "st" },
];

const ZONE_TOP5 = [
  { zone: "IIT Bombay", rows: [[6, "B JAYAKRISHNA SRINIVAS"], [8, "KANISHK JAIN"], [12, "ARYAN RAGUPATHY"], [13, "MANU PARAMESHWARAN"], [22, "ADITYA PAVANKUMAR THAKUR"]] },
  { zone: "IIT Delhi", rows: [[1, "SHUBHAM KUMAR"], [2, "KABEER CHHILLAR"], [3, "JATIN CHAHAR"], [7, "ARNAV GAUTAM"], [10, "DARSH SIKKA"]] },
  { zone: "IIT Madras", rows: [[4, "MOHIT SHEKHER SHUKLA"], [5, "KUCHI SANDEEP"], [9, "MEDISETTI NAGA SAHARSHA"], [15, "VELDURTHI HARSHITH"], [17, "AARAV GUPTA"]] },
  { zone: "IIT Roorkee", rows: [[11, "NIKUNJ AGRAWAL"], [21, "YAJAT SHINGHAL"], [27, "ABHIPRAYA VERMA"], [30, "AMRIT RAJ"], [36, "ARNAV GANDHI"]] },
  { zone: "IIT Kanpur", rows: [[18, "RIDDHESH ANANT BENDALE"], [55, "PARTH MAHESHWARY"], [68, "ANVESH PATEL"], [131, "ARSH JAIN"], [155, "AARAV SONI"]] },
  { zone: "IIT Bhubaneswar", rows: [[29, "BHAVESH PATRA"], [102, "ALLU ROHITH"], [104, "IPSHIT PAUL"], [148, "ABIR GOSWAMI"], [196, "KRISHNAVARDHAN AGARWAL"]] },
  { zone: "IIT Guwahati", rows: [[122, "YASHRAJ SINGH"], [309, "AKARSH NAMAN"], [319, "NIKET ANAND"], [329, "ARNAV RAJ"], [333, "AYUSHMAN VATSA"]] },
];

const FEMALE_TOPPERS = [
  { rank: 77, name: "AROHI DESHPANDE", zone: "IIT DELHI" },
  { rank: 111, name: "KORUKONDA SRAVYA", zone: "IIT MADRAS" },
  { rank: 158, name: "SANVI PATIDAR", zone: "IIT BOMBAY" },
  { rank: 230, name: "REDDI SAI SAHITHI", zone: "IIT BHUBANESWAR" },
  { rank: 781, name: "AASHI", zone: "IIT ROORKEE" },
  { rank: 859, name: "ANUSHKA AGRAWAL", zone: "IIT KANPUR" },
  { rank: 1857, name: "AGRIMA SINGH", zone: "IIT GUWAHATI" },
];

const ZONE_DIST = [
  ["IIT Madras", "CRL 4", 3, 35, 73, 109, 174, "14,294"],
  ["IIT Bombay", "CRL 6", 2, 23, 47, 68, 120, "12,389"],
  ["IIT Delhi", "CRL 1", 5, 29, 48, 68, 114, "10,697"],
  ["IIT Roorkee", "CRL 11", 0, 9, 20, 30, 46, "5,637"],
  ["IIT Kanpur", "CRL 18", 0, 3, 6, 10, 16, "5,552"],
  ["IIT Bhubaneswar", "CRL 29", 0, 1, 5, 14, 23, "5,428"],
  ["IIT Guwahati", "CRL 122", 0, 0, 1, 1, 7, "2,883"],
];

const QUALIFYING = [
  ["Common Rank List (CRL)", "8", "7.30%", "92", "25.56%"],
  ["OBC-NCL", "7", "6.51%", "82", "22.78%"],
  ["GEN-EWS", "7", "6.51%", "82", "22.78%"],
  ["SC", "4", "3.65%", "46", "12.78%"],
  ["ST", "4", "3.65%", "46", "12.78%"],
  ["CRL-PwD", "4", "3.65%", "46", "12.78%"],
  ["OBC-NCL-PwD", "4", "3.65%", "46", "12.78%"],
  ["GEN-EWS-PwD", "4", "3.65%", "46", "12.78%"],
  ["SC-PwD", "4", "3.65%", "46", "12.78%"],
  ["ST-PwD", "4", "3.65%", "46", "12.78%"],
  ["Preparatory Course (PC)", "2", "1.83%", "23", "6.39%"],
];

const CAT_SUMMARY = [
  ["GEN", "No", "38,987", "37,453", "15,530"],
  ["GEN", "Yes", "1,066", "983", "353"],
  ["OBC-NCL", "No", "69,122", "66,295", "12,030"],
  ["OBC-NCL", "Yes", "1,310", "1,244", "355"],
  ["GEN-EWS", "No", "29,804", "29,024", "6,251"],
  ["GEN-EWS", "Yes", "351", "335", "126"],
  ["SC", "No", "31,368", "29,786", "15,817"],
  ["SC", "Yes", "245", "229", "39"],
  ["ST", "No", "15,056", "14,272", "6,365"],
  ["ST", "Yes", "80", "73", "14"],
];

const GENDER_STATS = [
  { val: "1,39,131", lbl: "Male — Appeared", color: "var(--gold)" },
  { val: "40,562", lbl: "Female — Appeared", color: "var(--rose)" },
  { val: "46,773", lbl: "Male — Qualified", color: "var(--gold)" },
  { val: "10,107", lbl: "Female — Qualified", color: "var(--rose)" },
  { val: "887", lbl: "PwD — Qualified", color: "var(--teal)" },
  { val: "56,880", lbl: "Total Qualified", color: "var(--amber)" },
];

/* ── ANIMATION HELPERS ────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function Reveal({ children, delay = 0, style }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ title, pill, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="section-head">
        <h2>{title}</h2>
        <span className="pill">{pill}</span>
        <div className="bar" />
      </div>
    </Reveal>
  );
}

function ZoneTable({ zone, rows, delay }) {
  return (
    <Reveal delay={delay} style={{ marginBottom: 12 }}>
      <div className="zone-label">{zone} Zone</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>CRL</th><th>Name</th></tr></thead>
          <tbody>
            {rows.map(([r, name]) => (
              <tr key={r}>
                <td><span className={`rank-num ${r === 1 ? "rank-1" : r === 2 ? "rank-2" : r === 3 ? "rank-3" : "rank-n"}`}>{r}</span></td>
                <td className="name-bold">{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

/* ── PAGE ─────────────────────────────────────────────────── */
export default function JeeAdvancedResult() {
  const nav = useNavigate();

  /* Load the page-specific Google Fonts once */
  useEffect(() => {
    const id = "jadv-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="jadv-page">
      <style>{CSS}</style>

      {/* floating action bar */}
      <div className="jadv-actionbar">
        <button className="jadv-back" onClick={() => nav("/")}>
          <ArrowLeft size={16} /> Home
        </button>
        <button
          className="jadv-share"
          onClick={() => {
            if (navigator.share) navigator.share({ title: "JEE Advanced 2026 Results", url: window.location.href }).catch(() => {});
            else { navigator.clipboard?.writeText(window.location.href); }
          }}
        >
          <Share2 size={15} /> Share
        </button>
      </div>

      <div className="wrap">
        {/* HEADER */}
        <motion.div
          className="header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="header-badge"
            animate={{
              y: [0, -5, 0],
              boxShadow: [
                "0 4px 16px rgba(244,123,32,0.25)",
                "0 8px 30px rgba(244,123,32,0.55)",
                "0 4px 16px rgba(244,123,32,0.25)",
              ],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={11} style={{ verticalAlign: "-1px", marginRight: 5 }} />
            Press Release · 1st June 2026
          </motion.div>
          <h1>
            JEE Advanced 2026<br />Results &amp; Rank List
          </h1>
          <div className="header-sub">
            Organized by IIT Roorkee &nbsp;·&nbsp; Exam held on 17th May 2026
          </div>
          <div className="header-stats">
            {HEADER_STATS.map((s, i) => (
              <motion.div
                className="hstat"
                key={s.lbl}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.09 }}
              >
                <div className="hstat-val">{s.val}</div>
                <div className="hstat-lbl">{s.lbl}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ALL INDIA TOPPERS */}
        <SectionHead title="All India Toppers" pill="CRL" />
        <Reveal>
          <div className="toppers-row">
            <motion.div className="topper-card gold-card" whileHover={{ y: -4 }}>
              <div className="tc-crown"><Trophy size={26} color="var(--gold)" /></div>
              <div className="tc-rank">CRL Rank 1 &nbsp;·&nbsp; Overall Topper</div>
              <div className="tc-name">Shubham Kumar</div>
              <div className="tc-zone">IIT Delhi Zone</div>
              <div className="tc-marks"><span className="big">330</span><span className="of">/ 360</span></div>
              <div><span className="tc-tag">All India Rank 1</span></div>
            </motion.div>
            <motion.div className="topper-card teal-card" whileHover={{ y: -4 }}>
              <div className="tc-crown">🌟</div>
              <div className="tc-rank">CRL Rank 77 &nbsp;·&nbsp; Top Female</div>
              <div className="tc-name">Arohi Deshpande</div>
              <div className="tc-zone">IIT Delhi Zone</div>
              <div className="tc-marks"><span className="big" style={{ color: "var(--teal)" }}>280</span><span className="of">/ 360</span></div>
              <div><span className="tc-tag teal">Top Female Candidate</span></div>
            </motion.div>
          </div>
        </Reveal>

        {/* TOP 10 CRL */}
        <SectionHead title="Top 10 — Common Rank List" pill="CRL" />
        <Reveal>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Rank</th><th>Name</th><th>Zone</th><th className="right">Marks</th></tr>
              </thead>
              <tbody>
                {TOP10.map((r) => (
                  <tr key={r.rank}>
                    <td><span className={`rank-num ${r.cls}`}>{r.rank}</span></td>
                    <td><span className="name-bold">{r.name}</span></td>
                    <td><span className="zone-tag">{r.zone}</span></td>
                    <td className="right"><span className="marks-val">{r.marks}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* CATEGORY RANK 1 */}
        <SectionHead title="Rank 1 — Category-Wise" pill="All Categories" />
        <div className="cat-grid">
          {CATEGORY_RANK1.map((c, i) => (
            <Reveal key={c.badge + c.name} delay={(i % 3) * 0.05}>
              <motion.div className="cat-card" whileHover={{ x: 4 }}>
                <div className={`cat-dot dot-${c.key}`} />
                <div className="cat-info">
                  <div className="cat-name">{c.name}</div>
                  <div className="cat-zone">{c.zone}</div>
                </div>
                <div className={`cat-badge badge-${c.key}`}>{c.badge}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* ZONE-WISE TOP 5 */}
        <SectionHead title="Zone-Wise Top 5" pill="7 Zones" />
        {ZONE_TOP5.map((z, i) => (
          <ZoneTable key={z.zone} zone={z.zone} rows={z.rows} delay={(i % 2) * 0.05} />
        ))}

        {/* ZONE-WISE TOP FEMALE */}
        <SectionHead title="Zone-Wise Top Female Candidates" pill="7 Zones" />
        <div className="female-grid">
          {FEMALE_TOPPERS.map((f, i) => (
            <Reveal key={f.name} delay={(i % 3) * 0.05}>
              <motion.div className="female-card" whileHover={{ y: -3 }}>
                <div className="fc-rank">{f.rank}</div>
                <div className="fc-info">
                  <div className="fc-name">{f.name}</div>
                  <div className="fc-zone">{f.zone}</div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* ZONE TOP 500 DISTRIBUTION */}
        <SectionHead title="Zone-Wise Distribution — Top 500" pill="Statistics" />
        <Reveal>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Zone</th><th>Zone Topper (CRL)</th>
                  <th className="right">Top 10</th><th className="right">Top 100</th>
                  <th className="right">Top 200</th><th className="right">Top 300</th>
                  <th className="right">Top 500</th><th className="right">Total Qualified</th>
                </tr>
              </thead>
              <tbody>
                {ZONE_DIST.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td><span className="zone-tag">{row[1]}</span></td>
                    <td className="right">{row[2]}</td>
                    <td className="right">{row[3]}</td>
                    <td className="right">{row[4]}</td>
                    <td className="right">{row[5]}</td>
                    <td className="right">{row[6]}</td>
                    <td className="right"><span className="marks-val">{row[7]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* QUALIFYING MARKS */}
        <SectionHead title="Qualifying Marks — All Rank Lists" pill="Cutoffs" />
        <Reveal>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rank List</th>
                  <th className="right">Min Marks per Subject</th>
                  <th className="right">Min % per Subject</th>
                  <th className="right">Min Aggregate</th>
                  <th className="right">Min % Aggregate</th>
                </tr>
              </thead>
              <tbody>
                {QUALIFYING.map((row) => (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td className="right"><span className="marks-val">{row[1]}</span></td>
                    <td className="right">{row[2]}</td>
                    <td className="right"><span className="marks-val">{row[3]}</span></td>
                    <td className="right">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* CATEGORY-WISE SUMMARY */}
        <SectionHead title="Category-Wise Qualified Summary" pill="All Candidates" />
        <Reveal>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th><th>PwD</th>
                  <th className="right">Registered</th>
                  <th className="right">Appeared</th>
                  <th className="right">Qualified</th>
                </tr>
              </thead>
              <tbody>
                {CAT_SUMMARY.map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td><td>{row[1]}</td>
                    <td className="right">{row[2]}</td>
                    <td className="right">{row[3]}</td>
                    <td className="right"><span className="marks-val">{row[4]}</span></td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={2}>TOTAL</td>
                  <td className="right">1,87,389</td>
                  <td className="right">1,79,694</td>
                  <td className="right"><span className="marks-val" style={{ fontSize: 15 }}>56,880</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* GENDER SUMMARY */}
        <SectionHead title="Gender-Wise Summary" pill="Statistics" />
        <div className="stats-grid">
          {GENDER_STATS.map((s, i) => (
            <Reveal key={s.lbl} delay={(i % 3) * 0.05}>
              <motion.div className="stat-card" whileHover={{ y: -3 }}>
                <div className="sv" style={{ color: s.color }}>{s.val}</div>
                <div className="sl">{s.lbl}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* FOOTER */}
        <div className="jadv-footer">
          <p>Source: <strong>JEE (Advanced) 2026 Official Press Release</strong> · Organized by <strong>IIT Roorkee</strong></p>
          <p style={{ marginTop: 8 }}>Maximum Marks: 360 &nbsp;·&nbsp; Paper 1 + Paper 2: 180 each &nbsp;·&nbsp; Math / Physics / Chemistry: 120 each</p>
          <button className="jadv-cta" onClick={() => nav("/jee-advanced#rank")}>
            <Download size={15} /> Predict Your JEE Advanced Rank
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCOPED CSS — everything lives under `.jadv-page`
═══════════════════════════════════════════════════════════ */
const CSS = `
.jadv-page {
  --orange:#f47b20; --orange2:#ff9f45; --gold:#e0911c; --gold2:#f5b942;
  --amber:#f08a24; --teal:#0bab9b; --rose:#f24e74; --violet:#8b6df0;
  --ink:#2a2342; --muted:#6c6587; --soft:#9a93b3;
  --white:#ffffff; --card:rgba(255,255,255,0.78);
  --border:rgba(244,123,32,0.18); --line:rgba(120,100,170,0.12);
  background:#ffffff;
  color:var(--ink);
  font-family:'DM Sans',sans-serif; min-height:100vh;
  position:relative; overflow-x:hidden;
}
/* ambient floating colour blobs */
.jadv-page::before {
  content:''; position:fixed; inset:-10%; pointer-events:none; z-index:0;
  background:
    radial-gradient(ellipse 38% 32% at 18% 12%, rgba(244,123,32,0.20) 0%, transparent 62%),
    radial-gradient(ellipse 34% 30% at 84% 22%, rgba(11,171,155,0.16) 0%, transparent 62%),
    radial-gradient(ellipse 40% 34% at 75% 82%, rgba(139,109,240,0.16) 0%, transparent 62%),
    radial-gradient(ellipse 32% 28% at 22% 85%, rgba(242,78,116,0.14) 0%, transparent 62%);
  animation:jadvDrift 18s ease-in-out infinite alternate;
}
@keyframes jadvDrift {
  0%   { transform:translate3d(0,0,0) scale(1); }
  50%  { transform:translate3d(2%,-1.5%,0) scale(1.06); }
  100% { transform:translate3d(-2%,2%,0) scale(1.02); }
}
/* floating sparkle dots layer */
.jadv-page::after {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:
    radial-gradient(3px 3px at 20% 30%, rgba(244,123,32,.35), transparent),
    radial-gradient(2px 2px at 70% 60%, rgba(11,171,155,.4), transparent),
    radial-gradient(3px 3px at 40% 80%, rgba(242,78,116,.3), transparent),
    radial-gradient(2px 2px at 85% 20%, rgba(139,109,240,.4), transparent),
    radial-gradient(2px 2px at 55% 15%, rgba(245,185,66,.45), transparent),
    radial-gradient(3px 3px at 10% 70%, rgba(11,171,155,.3), transparent),
    radial-gradient(2px 2px at 90% 75%, rgba(244,123,32,.3), transparent);
  background-repeat:no-repeat;
  animation:jadvFloat 7s ease-in-out infinite alternate;
}
@keyframes jadvFloat {
  from { opacity:.55; transform:translateY(0); }
  to   { opacity:1; transform:translateY(-10px); }
}
@media (prefers-reduced-motion: reduce) {
  .jadv-page::before, .jadv-page::after, .jadv-page * { animation:none !important; }
}

.jadv-page * { margin:0; padding:0; box-sizing:border-box; }
.jadv-page .wrap { position:relative; z-index:1; max-width:1100px; margin:0 auto; padding:24px 24px 80px; }

/* ── action bar ── */
.jadv-actionbar {
  position:sticky; top:0; z-index:30;
  display:flex; justify-content:space-between; align-items:center;
  padding:14px 24px; max-width:1100px; margin:0 auto;
  backdrop-filter:blur(10px);
}
.jadv-back, .jadv-share {
  display:inline-flex; align-items:center; gap:7px;
  font-family:'DM Mono',monospace; font-size:12px; font-weight:500;
  letter-spacing:.5px; padding:8px 16px; border-radius:50px; cursor:pointer;
  border:1px solid var(--border); transition:all .25s cubic-bezier(.22,1,.36,1);
}
.jadv-back { background:rgba(255,255,255,.7); color:var(--ink); box-shadow:0 2px 10px rgba(120,100,170,.08); }
.jadv-back:hover { background:#fff; transform:translateX(-2px); box-shadow:0 6px 18px rgba(120,100,170,.16); }
.jadv-share { background:linear-gradient(135deg,var(--orange),var(--orange2)); color:#fff; border-color:transparent; box-shadow:0 4px 14px rgba(244,123,32,.3); }
.jadv-share:hover { transform:translateY(-1px); box-shadow:0 8px 22px rgba(244,123,32,.45); }

/* ── header ── */
.jadv-page .header { text-align:center; padding:28px 0 36px; border-bottom:1px solid var(--line); margin-bottom:48px; position:relative; }
.jadv-page .header-badge {
  display:inline-flex; align-items:center; background:linear-gradient(135deg,var(--orange),var(--orange2));
  color:#fff; font-family:'DM Mono',monospace; font-size:11px; font-weight:500;
  letter-spacing:2px; text-transform:uppercase; padding:6px 18px; border-radius:20px; margin-bottom:20px;
  box-shadow:0 4px 16px rgba(244,123,32,.25);
}
.jadv-page .header h1 {
  font-family:'Playfair Display',serif; font-size:clamp(2.4rem,6vw,4rem); font-weight:900;
  line-height:1.05; letter-spacing:-1px;
  background:linear-gradient(110deg,var(--orange) 0%,var(--rose) 35%,var(--violet) 70%,var(--teal) 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  margin-bottom:10px; background-size:220% auto; animation:jadvShine 7s linear infinite;
}
@keyframes jadvShine { to { background-position:220% center; } }
.jadv-page .header-sub { color:var(--muted); font-size:14px; letter-spacing:1px; }
.jadv-page .header-stats { display:flex; justify-content:center; gap:36px; flex-wrap:wrap; margin-top:28px; }
.jadv-page .hstat { text-align:center; }
.jadv-page .hstat-val {
  font-family:'Playfair Display',serif; font-size:2rem; font-weight:700; line-height:1;
  background:linear-gradient(135deg,var(--orange),var(--gold)); -webkit-background-clip:text;
  -webkit-text-fill-color:transparent; background-clip:text;
}
.jadv-page .hstat-lbl { font-size:11px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; margin-top:4px; }

/* ── section heads ── */
.jadv-page .section-head { display:flex; align-items:center; gap:12px; margin-bottom:20px; margin-top:52px; }
.jadv-page .section-head h2 { font-family:'Playfair Display',serif; font-size:1.4rem; font-weight:700; color:var(--ink); }
.jadv-page .section-head .pill {
  background:rgba(244,123,32,0.1); border:1px solid var(--border); color:var(--orange);
  font-size:10px; letter-spacing:1.5px; text-transform:uppercase; padding:3px 10px;
  border-radius:20px; font-family:'DM Mono',monospace; white-space:nowrap;
}
.jadv-page .bar { flex:1; height:2px; border-radius:2px; background:linear-gradient(90deg,var(--orange),var(--rose),transparent); }

/* ── toppers ── */
.jadv-page .toppers-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:12px; }
@media(max-width:600px){ .jadv-page .toppers-row { grid-template-columns:1fr; } }
.jadv-page .topper-card {
  background:var(--card); border:1px solid var(--border); border-radius:16px; padding:28px 24px;
  position:relative; overflow:hidden; backdrop-filter:blur(6px);
  box-shadow:0 8px 26px rgba(120,100,170,.1);
  transition:transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s;
}
.jadv-page .topper-card:hover { box-shadow:0 18px 48px rgba(244,123,32,.22); }
.jadv-page .topper-card.gold-card { border-color:rgba(244,123,32,0.4); }
.jadv-page .topper-card.gold-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 70% 60% at 20% 20%, rgba(244,123,32,0.14) 0%, transparent 70%); }
.jadv-page .topper-card.teal-card { border-color:rgba(11,171,155,0.35); }
.jadv-page .topper-card.teal-card::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 70% 60% at 80% 20%, rgba(11,171,155,0.12) 0%, transparent 70%); }
/* sweeping shine across topper cards */
.jadv-page .topper-card::after {
  content:''; position:absolute; top:0; left:-60%; width:50%; height:100%;
  background:linear-gradient(105deg,transparent,rgba(255,255,255,.55),transparent);
  transform:skewX(-18deg); animation:jadvSweep 5.5s ease-in-out infinite;
}
@keyframes jadvSweep { 0%,72%{ left:-60%; } 100%{ left:130%; } }
.jadv-page .tc-crown { font-size:28px; margin-bottom:8px; line-height:1; display:inline-block; animation:jadvSwing 3.2s ease-in-out infinite; transform-origin:50% 0; }
@keyframes jadvSwing { 0%,100%{ transform:rotate(-8deg); } 50%{ transform:rotate(8deg); } }
.jadv-page .tc-rank { font-family:'DM Mono',monospace; font-size:11px; color:var(--muted); letter-spacing:1.5px; text-transform:uppercase; margin-bottom:6px; }
.jadv-page .tc-name { font-family:'Playfair Display',serif; font-size:1.5rem; font-weight:700; color:var(--ink); margin-bottom:6px; position:relative; }
.jadv-page .tc-zone { font-size:12px; color:var(--muted); margin-bottom:14px; }
.jadv-page .tc-marks { display:inline-flex; align-items:baseline; gap:4px; }
.jadv-page .tc-marks .big { font-family:'Playfair Display',serif; font-size:2.4rem; font-weight:700; color:var(--orange); line-height:1; }
.jadv-page .tc-marks .of { font-size:13px; color:var(--muted); }
.jadv-page .tc-tag { display:inline-block; background:rgba(244,123,32,0.14); color:var(--orange); font-size:10px; letter-spacing:1px; text-transform:uppercase; padding:3px 10px; border-radius:20px; margin-top:10px; font-family:'DM Mono',monospace; }
.jadv-page .tc-tag.teal { background:rgba(11,171,155,0.14); color:var(--teal); }

/* ── tables ── */
.jadv-page .table-wrap { background:var(--card); border:1px solid var(--border); border-radius:14px; overflow:hidden; backdrop-filter:blur(6px); box-shadow:0 6px 22px rgba(120,100,170,.08); }
.jadv-page table { width:100%; border-collapse:collapse; }
.jadv-page thead tr { background:linear-gradient(90deg,rgba(244,123,32,0.1),rgba(242,78,116,0.06)); border-bottom:1px solid var(--border); }
.jadv-page thead th { text-align:left; padding:14px 18px; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:var(--orange); font-weight:500; }
.jadv-page thead th.right { text-align:right; }
.jadv-page tbody tr { border-bottom:1px solid var(--line); transition:background .2s, transform .2s; }
.jadv-page tbody tr:last-child { border-bottom:none; }
.jadv-page tbody tr:hover { background:rgba(244,123,32,0.06); }
.jadv-page tbody td { padding:13px 18px; font-size:14px; color:var(--ink); }
.jadv-page tbody td.right { text-align:right; }
.jadv-page .total-row { font-weight:700; background:rgba(244,123,32,0.08); }
.jadv-page .rank-num { display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:8px; font-family:'DM Mono',monospace; font-size:13px; font-weight:600; }
.jadv-page .rank-1 { background:linear-gradient(135deg,#f5b942,#e0911c); color:#fff; box-shadow:0 2px 10px rgba(224,145,28,.4); }
.jadv-page .rank-2 { background:linear-gradient(135deg,#dfe6ee,#bcc6d2); color:#4a5568; }
.jadv-page .rank-3 { background:linear-gradient(135deg,#f0c19a,#d98e57); color:#fff; }
.jadv-page .rank-n { background:rgba(139,109,240,0.1); color:var(--violet); }
.jadv-page .name-bold { font-weight:600; letter-spacing:0.2px; color:var(--ink); }
.jadv-page .zone-tag { display:inline-block; font-size:10px; font-family:'DM Mono',monospace; color:var(--muted); background:rgba(139,109,240,0.08); padding:2px 8px; border-radius:6px; letter-spacing:0.5px; }
.jadv-page .marks-val { font-family:'DM Mono',monospace; font-weight:600; color:var(--teal); }
.jadv-page .zone-label { font-size:12px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; font-family:'DM Mono',monospace; margin-bottom:8px; padding-left:4px; }

/* ── category grid ── */
.jadv-page .cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px; }
.jadv-page .cat-card { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:16px 18px; display:flex; align-items:center; gap:14px; backdrop-filter:blur(6px); transition:border-color .25s, box-shadow .25s, transform .25s; }
.jadv-page .cat-card:hover { border-color:var(--border); box-shadow:0 10px 26px rgba(244,123,32,.14); }
.jadv-page .cat-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; animation:jadvPulse 2.4s ease-in-out infinite; }
@keyframes jadvPulse { 0%,100%{ transform:scale(1); box-shadow:0 0 0 0 currentColor; } 50%{ transform:scale(1.35); } }
.jadv-page .dot-crl { background:var(--gold); color:rgba(224,145,28,.4); } .jadv-page .dot-ews { background:var(--teal); color:rgba(11,171,155,.4); }
.jadv-page .dot-obc { background:var(--amber); color:rgba(240,138,36,.4); } .jadv-page .dot-sc { background:var(--rose); color:rgba(242,78,116,.4); }
.jadv-page .dot-st { background:var(--violet); color:rgba(139,109,240,.4); } .jadv-page .dot-pwd { background:#10b981; color:rgba(16,185,129,.4); }
.jadv-page .cat-info { flex:1; } .jadv-page .cat-name { font-size:14px; font-weight:600; color:var(--ink); }
.jadv-page .cat-zone { font-size:11px; color:var(--muted); margin-top:2px; font-family:'DM Mono',monospace; }
.jadv-page .cat-badge { font-size:10px; font-family:'DM Mono',monospace; letter-spacing:1px; padding:3px 9px; border-radius:6px; text-transform:uppercase; flex-shrink:0; }
.jadv-page .badge-crl { background:rgba(224,145,28,0.14); color:var(--gold); }
.jadv-page .badge-ews { background:rgba(11,171,155,0.14); color:var(--teal); }
.jadv-page .badge-obc { background:rgba(240,138,36,0.14); color:var(--amber); }
.jadv-page .badge-sc { background:rgba(242,78,116,0.14); color:var(--rose); }
.jadv-page .badge-st { background:rgba(139,109,240,0.14); color:var(--violet); }
.jadv-page .badge-pwd { background:rgba(16,185,129,0.14); color:#10b981; }

/* ── female grid ── */
.jadv-page .female-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:12px; }
.jadv-page .female-card { background:var(--card); border:1px solid rgba(242,78,116,0.18); border-radius:12px; padding:14px 16px; display:flex; align-items:center; gap:12px; backdrop-filter:blur(6px); box-shadow:0 4px 16px rgba(242,78,116,.08); transition:transform .25s, box-shadow .25s; }
.jadv-page .female-card:hover { box-shadow:0 10px 26px rgba(242,78,116,.2); }
.jadv-page .fc-rank { font-family:'DM Mono',monospace; font-size:18px; font-weight:600; color:var(--rose); min-width:44px; }
.jadv-page .fc-name { font-size:13px; font-weight:600; color:var(--ink); }
.jadv-page .fc-zone { font-size:11px; color:var(--muted); font-family:'DM Mono',monospace; margin-top:2px; }

/* ── stats grid ── */
.jadv-page .stats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; }
.jadv-page .stat-card { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:20px 18px; text-align:center; backdrop-filter:blur(6px); box-shadow:0 4px 16px rgba(120,100,170,.08); transition:transform .25s, box-shadow .25s; }
.jadv-page .stat-card:hover { box-shadow:0 12px 30px rgba(120,100,170,.16); }
.jadv-page .stat-card .sv { font-family:'Playfair Display',serif; font-size:2.2rem; font-weight:700; line-height:1; margin-bottom:6px; }
.jadv-page .stat-card .sl { font-size:12px; color:var(--muted); letter-spacing:0.5px; }

/* ── footer ── */
.jadv-page .jadv-footer { margin-top:64px; border-top:1px solid var(--line); padding-top:24px; text-align:center; color:var(--muted); font-size:12px; letter-spacing:0.5px; }
.jadv-page .jadv-footer strong { color:var(--orange); }
.jadv-page .jadv-cta {
  display:inline-flex; align-items:center; gap:8px; margin-top:22px;
  background:linear-gradient(135deg,var(--orange),var(--orange2)); color:#fff;
  border:none; border-radius:50px; padding:12px 26px; font-family:'DM Sans',sans-serif;
  font-size:13px; font-weight:700; cursor:pointer; transition:all .25s;
  box-shadow:0 6px 22px rgba(244,123,32,.35); animation:jadvCtaPulse 2.8s ease-in-out infinite;
}
@keyframes jadvCtaPulse {
  0%,100% { box-shadow:0 6px 22px rgba(244,123,32,.3); }
  50%     { box-shadow:0 6px 30px rgba(244,123,32,.55); }
}
.jadv-page .jadv-cta:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 12px 34px rgba(244,123,32,.5); }
`;
