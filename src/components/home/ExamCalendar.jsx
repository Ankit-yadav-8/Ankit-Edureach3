/* ExamCalendar — A simple, clean, grid-based admission season calendar.
   Displays each month as a card with events. Past months are grayed out,
   the current month is highlighted, and upcoming months are standard. */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarRange, ArrowRight } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

/* exam-family palette */
const FAM = {
  jee:    { dot: CL.coral,  label: "JEE" },
  adv:    { dot: CL.blue,   label: "JEE Advanced" },
  neet:   { dot: CL.green,  label: "NEET" },
  council:{ dot: CL.violet, label: "Counselling" },
  state:  { dot: CL.amber,  label: "State exams" },
  other:  { dot: CL.muted,  label: "Boards & other" },
};

/* 2026–27 cycle */
const MONTHS = [
  { mon: "Jan", yr: "2026", phase: "done", events: [
    { fam: "jee",   name: "JEE Main · Session 1", sub: "Jan 22 – 29" },
  ]},
  { mon: "Feb", yr: "2026", phase: "done", events: [
    { fam: "other", name: "Board Practicals", sub: "CBSE / State" },
  ]},
  { mon: "Mar", yr: "2026", phase: "done", events: [
    { fam: "other", name: "Board Theory Exams", sub: "Class 12" },
    { fam: "jee",   name: "BITSAT Registration", sub: "Opens" },
  ]},
  { mon: "Apr", yr: "2026", phase: "done", events: [
    { fam: "jee",   name: "JEE Main · Session 2", sub: "Apr 1 – 8" },
    { fam: "other", name: "CUET-UG Window", sub: "Central universities" },
  ]},
  { mon: "May", yr: "2026", phase: "done", events: [
    { fam: "neet",  name: "NEET-UG 2026", sub: "May 3" },
    { fam: "adv",   name: "JEE Advanced 2026", sub: "May 18 · P1 + P2" },
    { fam: "jee",   name: "BITSAT · Session 1", sub: "Late May" },
  ]},
  { mon: "Jun", yr: "2026", phase: "live", events: [
    { fam: "adv",     name: "JEE Advanced Results", sub: "AIR declared" },
    { fam: "council", name: "JoSAA Counselling", sub: "IITs · NITs · IIITs" },
    { fam: "jee",     name: "BITSAT Counselling", sub: "Iterations begin" },
    { fam: "jee",     name: "COMEDK Counselling", sub: "Karnataka private" },
  ]},
  { mon: "Jul", yr: "2026", phase: "upcoming", events: [
    { fam: "council", name: "CSAB Special Rounds", sub: "Vacant NIT / IIIT / GFTI" },
    { fam: "state",   name: "State Counselling", sub: "KCET · WBJEE · MHT CET · KEAM" },
    { fam: "council", name: "College Seat Allotment", sub: "Final rounds" },
  ]},
  { mon: "Aug", yr: "2026", phase: "upcoming", events: [
    { fam: "council", name: "Final Reporting", sub: "Fee + document upload" },
    { fam: "other",   name: "Classes Begin", sub: "First-year onboarding" },
  ]},
  { mon: "Sep", yr: "2026", phase: "upcoming", events: [
    { fam: "council", name: "Spot Round Vacancies", sub: "Institute level" },
  ]},
  { mon: "Oct", yr: "2026", phase: "upcoming", events: [
    { fam: "other",   name: "Internal Branch Sliding", sub: "Where offered" },
  ]},
  { mon: "Nov", yr: "2026", phase: "upcoming", events: [
    { fam: "jee",     name: "JEE Main 2027 Notification", sub: "NTA brochure" },
  ]},
  { mon: "Dec", yr: "2026", phase: "upcoming", events: [
    { fam: "jee",     name: "JEE Main 2027 Registration", sub: "Cycle restarts" },
  ]},
];

const PHASE = {
  done:     { label: "Done", fg: CL.muted, bg: "rgba(33,29,46,.06)", border: "transparent" },
  live:     { label: "Now",  fg: "#0a8f5b", bg: CL.greenSoft, border: CL.green },
  upcoming: { label: "Soon", fg: CL.coralDk, bg: CL.coralSoft, border: CL.coral },
};

export default function ExamCalendar({
  surface = CL.cream,
  eyebrow = "Admission Calendar · 2026–27 Cycle",
  heading = true,
}) {
  const nav = useNavigate();
  return (
    <section id="exam-calendar" style={{ background: surface, padding: "84px 0", position: "relative" }}>
      <style>{CSS}</style>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {heading && (
          <div style={{ marginBottom: 48, textAlign: "center", maxWidth: 700, margin: "0 auto 48px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <span style={clEyebrow}><CalendarRange size={13} /> {eyebrow}</span>
            </div>
            <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2rem,4.5vw,2.8rem)", color: CL.ink, letterSpacing: "-1px", lineHeight: 1.15 }}>
              The complete <span style={{ color: CL.coral }}>admission season.</span>
            </h2>
            <p style={{ color: CL.body, fontSize: "1.1rem", lineHeight: 1.6, margin: "16px auto 28px" }}>
              Every major exam, result, and counselling window organized by month so you never miss a deadline.
            </p>
            {/* family legend */}
            <div className="ec-legend">
              {Object.values(FAM).map((f) => (
                <span key={f.label} className="ec-legend-item">
                  <span className="ec-legend-dot" style={{ background: f.dot }} /> {f.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Grid Layout ── */}
        <div className="ec-grid">
          {MONTHS.map((m, i) => {
            const ph = PHASE[m.phase];
            const live = m.phase === "live";
            const done = m.phase === "done";
            
            return (
              <motion.div
                key={`${m.mon}-${m.yr}`}
                className={`ec-card ${done ? "ec-card-done" : ""}`}
                style={{
                  borderColor: live ? ph.border : CL.line,
                  boxShadow: live ? `0 12px 32px ${CL.green}25` : "0 4px 12px rgba(33,29,46,.03)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: done ? 0.65 : 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
              >
                <div className="ec-card-header">
                  <div className="ec-card-title">
                    <span className="ec-mon">{m.mon}</span>
                    <span className="ec-yr">{m.yr}</span>
                  </div>
                  <span className="ec-phase" style={{ color: ph.fg, background: ph.bg }}>
                    {live && <span className="ec-live-dot" />}
                    {ph.label}
                  </span>
                </div>
                
                <div className="ec-events">
                  {m.events.map((e, idx) => {
                    const f = FAM[e.fam] || FAM.other;
                    return (
                      <div key={idx} className="ec-event">
                        <div className="ec-event-dot" style={{ background: f.dot }} />
                        <div className="ec-event-text">
                          <span className="ec-event-name">{e.name}</span>
                          {e.sub && <span className="ec-event-sub">{e.sub}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 54 }}>
          <button onClick={() => nav("/exam-buzz")} className="ec-cta">
            Explore live counselling updates <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ec-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 24px; align-items: center; }
.ec-legend-item { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; color: ${CL.body}; font-weight: 600; }
.ec-legend-dot { width: 10px; height: 10px; border-radius: 4px; }

.ec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1150px;
  margin: 0 auto;
}

.ec-card {
  background: ${CL.card};
  border: 1px solid ${CL.line};
  border-radius: 20px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.ec-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(33,29,46,.08) !important;
}

.ec-card-done {
  filter: grayscale(0.8);
}

.ec-card-done:hover {
  filter: grayscale(0);
  opacity: 1 !important;
}

.ec-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid ${CL.line};
  padding-bottom: 16px;
}

.ec-card-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.ec-mon { font: 800 1.8rem/1 ${CL.display}; color: ${CL.ink}; letter-spacing: -0.5px; }
.ec-yr { font: 700 1rem/1 sans-serif; color: ${CL.muted}; }

.ec-phase {
  display: inline-flex; align-items: center; gap: 6px;
  font: 800 10.5px/1 ${CL.display}; letter-spacing: 0.08em;
  text-transform: uppercase; padding: 6px 14px; border-radius: 50px;
}

.ec-live-dot {
  width: 6px; height: 6px; border-radius: 50%; background: currentColor;
  animation: pulseDot 1.5s ease-in-out infinite;
}

@keyframes pulseDot {
  0% { transform: scale(0.9); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.4; }
  100% { transform: scale(0.9); opacity: 1; }
}

.ec-events {
  display: flex; flex-direction: column; gap: 18px;
}

.ec-event {
  display: flex; align-items: flex-start; gap: 14px;
}

.ec-event-dot {
  width: 14px; height: 14px; border-radius: 4px; margin-top: 3px; flex-shrink: 0;
}

.ec-event-text {
  display: flex; flex-direction: column; gap: 4px;
}

.ec-event-name {
  font: 700 1.05rem/1.3 ${CL.display}; color: ${CL.ink};
}

.ec-event-sub {
  font: 400 0.95rem/1.4 sans-serif; color: ${CL.body};
}

.ec-cta {
  display: inline-flex; align-items: center; gap: 10px;
  background: ${CL.coral}; color: #fff; border: none; border-radius: 50px;
  padding: 16px 36px; font: 800 1.05rem/1 ${CL.display}; cursor: pointer;
  box-shadow: 0 10px 26px rgba(255, 105, 61, 0.35); transition: transform 0.2s, box-shadow 0.2s;
}

.ec-cta:hover {
  transform: translateY(-2px); box-shadow: 0 14px 32px rgba(255, 105, 61, 0.45);
}

@media (max-width: 680px) {
  .ec-grid { grid-template-columns: 1fr; }
  .ec-card { padding: 20px; gap: 20px; }
}
`;
