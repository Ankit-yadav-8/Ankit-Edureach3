/* ExamCalendar — College Parichay's own "season roadmap" for the 2026–27
   admission cycle. A single vertical spine threads month by month from the
   first exam to the next cycle; the spine fills up to the live month, each
   month lists its exams/results/counselling as family-coloured chips, and
   past months dim while the current one is spotlighted. Used on the home
   page and /exam-buzz. */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarRange, ArrowRight, MapPin } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

/* exam-family palette — each chip carries the colour of its family */
const FAM = {
  jee:    { dot: CL.coral,  label: "JEE" },
  adv:    { dot: CL.blue,   label: "JEE Advanced" },
  neet:   { dot: CL.green,  label: "NEET" },
  council:{ dot: CL.violet, label: "Counselling" },
  state:  { dot: CL.amber,  label: "State exams" },
  other:  { dot: CL.muted,  label: "Boards & other" },
};

/* 2026–27 cycle — the live month (per the current date) is June 2026.
   Past months are "done", June is "live", everything after is "upcoming". */
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
  done:     { label: "Done", fg: CL.muted,   bg: "rgba(33,29,46,.06)", ring: CL.cream3 },
  live:     { label: "Now",  fg: "#0a8f5b",  bg: CL.greenSoft,         ring: CL.green  },
  upcoming: { label: "Soon", fg: CL.coralDk, bg: CL.coralSoft,         ring: CL.coral  },
};

const LIVE_INDEX = MONTHS.findIndex((m) => m.phase === "live");
const FILL_PCT = ((LIVE_INDEX + 0.5) / MONTHS.length) * 100;

function EventChip({ e }) {
  const f = FAM[e.fam] || FAM.other;
  return (
    <div className="ec-chip" style={{ "--dot": f.dot }}>
      <span className="ec-chip-dot" />
      <span>
        <span className="ec-chip-name">{e.name}</span>
        {e.sub && <span className="ec-chip-sub">{e.sub}</span>}
      </span>
    </div>
  );
}

export default function ExamCalendar({
  surface = CL.cream,
  eyebrow = "Admission Calendar · 2026–27 Cycle",
  heading = true,
}) {
  const nav = useNavigate();
  return (
    <section id="exam-calendar" style={{ background: surface, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      <style>{CSS}</style>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {heading && (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 30 }}>
            <div style={{ maxWidth: 660 }}>
              <span style={clEyebrow}><CalendarRange size={13} /> {eyebrow}</span>
              <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.7rem)", color: CL.ink, letterSpacing: "-1px", margin: "16px 0 10px", lineHeight: 1.12 }}>
                One road through the <span style={{ color: CL.coral }}>whole season.</span>
              </h2>
              <p style={{ color: CL.body, fontSize: "1.02rem", lineHeight: 1.7 }}>
                Every exam, result and counselling window of the 2026–27 cycle, in order — walk it top to bottom and always know exactly where you stand.
              </p>
            </div>
            {/* family legend */}
            <div className="ec-legend">
              {Object.values(FAM).map((f) => (
                <span key={f.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: CL.body, fontWeight: 600 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: f.dot }} /> {f.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Roadmap ── */}
        <div className="ec-road">
          <span className="ec-spine" aria-hidden />
          <span className="ec-spine-fill" style={{ height: `${FILL_PCT}%` }} aria-hidden />

          {MONTHS.map((m, i) => {
            const ph = PHASE[m.phase];
            const live = m.phase === "live";
            const done = m.phase === "done";
            return (
              <motion.div
                key={`${m.mon}-${m.yr}`}
                className="ec-month"
                data-phase={m.phase}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: done ? 0.72 : 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.04 }}
              >
                {/* node */}
                <div className="ec-node-cell">
                  <span className="ec-node" style={{
                    background: done ? ph.ring : CL.card,
                    borderColor: ph.ring,
                    boxShadow: live ? `0 0 0 5px ${CL.green}22` : "none",
                  }}>
                    {live && <span className="ec-node-pulse" />}
                  </span>
                </div>

                {/* body: month tab + events */}
                <div className="ec-body">
                  <div className="ec-tab" style={{ borderColor: live ? CL.green : CL.line, outline: live ? `3px solid ${CL.green}1f` : "none" }}>
                    <div>
                      <span className="ec-mon">{m.mon}</span>
                      <span className="ec-yr">{m.yr}</span>
                    </div>
                    <span className="ec-phase" style={{ color: ph.fg, background: ph.bg }}>
                      {live ? "● Now" : ph.label}
                    </span>
                    {live && (
                      <span className="ec-here"><MapPin size={11} /> You are here</span>
                    )}
                  </div>
                  <div className="ec-events">
                    {m.events.map((e) => <EventChip key={e.name} e={e} />)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button onClick={() => nav("/exam-buzz")} style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            background: CL.coral, color: "#fff", border: "none", borderRadius: 50,
            padding: "13px 26px", fontFamily: CL.display, fontWeight: 800, fontSize: 14.5,
            cursor: "pointer", boxShadow: "0 10px 26px rgba(255, 105, 61,.35)",
          }}>
            Open the live counselling radar <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.ec-legend { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; }
.ec-road { position: relative; max-width: 860px; margin: 0 auto; padding-left: 8px; }
.ec-spine {
  position: absolute; left: 25px; top: 10px; bottom: 10px; width: 3px;
  background: ${CL.cream3}; border-radius: 3px;
}
.ec-spine-fill {
  position: absolute; left: 25px; top: 10px; width: 3px; border-radius: 3px;
  background: linear-gradient(${CL.coral}, ${CL.green});
}
.ec-month {
  position: relative; display: grid; grid-template-columns: 52px minmax(0, 1fr);
  align-items: start; margin-bottom: 22px;
}
.ec-node-cell { display: grid; place-items: center; padding-top: 10px; }
.ec-node {
  position: relative; width: 16px; height: 16px; border-radius: 50%;
  border: 3px solid; z-index: 2;
}
.ec-node-pulse {
  position: absolute; inset: -3px; border-radius: 50%; background: ${CL.green};
  opacity: .35; animation: ecPulse 1.8s ease-out infinite;
}
@keyframes ecPulse { 0% { transform: scale(1); opacity: .5; } 70%,100% { transform: scale(2.4); opacity: 0; } }
.ec-body { display: grid; grid-template-columns: 132px minmax(0, 1fr); gap: 18px; align-items: start; }
.ec-tab {
  position: relative; background: ${CL.card}; border: 1px solid ${CL.line};
  border-radius: 14px; box-shadow: ${CL.shadow}; padding: 12px 14px;
  display: flex; flex-direction: column; gap: 8px;
}
.ec-mon { font: 800 1.15rem/1 ${CL.display}; color: ${CL.ink}; letter-spacing: -.4px; }
.ec-yr { font-size: 11px; color: ${CL.muted}; font-weight: 700; margin-left: 6px; }
.ec-phase {
  align-self: flex-start; font: 800 9.5px/1 ${CL.display}; letter-spacing: .06em;
  text-transform: uppercase; padding: 4px 10px; border-radius: 50px;
}
.ec-here {
  display: inline-flex; align-items: center; gap: 4px; font: 800 10px/1 ${CL.display};
  color: #0a8f5b; letter-spacing: .02em;
}
.ec-events { display: flex; flex-wrap: wrap; gap: 9px; padding-top: 2px; }
.ec-chip {
  display: inline-flex; align-items: flex-start; gap: 9px; background: ${CL.card};
  border: 1px solid ${CL.line}; border-left: 3px solid var(--dot);
  border-radius: 12px; padding: 9px 13px 9px 11px; box-shadow: 0 1px 3px rgba(33,29,46,.05);
  max-width: 260px; transition: transform .18s, box-shadow .18s;
}
.ec-chip:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(33,29,46,.1); }
.ec-chip-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--dot); margin-top: 4px; flex-shrink: 0; }
.ec-chip-name { display: block; font: 800 12.5px/1.25 ${CL.display}; color: ${CL.ink}; }
.ec-chip-sub { display: block; font-size: 11px; color: ${CL.body}; margin-top: 2px; line-height: 1.3; }

@media (max-width: 680px) {
  .ec-month { grid-template-columns: 40px minmax(0, 1fr); }
  .ec-spine, .ec-spine-fill { left: 19px; }
  .ec-body { grid-template-columns: minmax(0, 1fr); gap: 10px; }
  .ec-tab { flex-direction: row; align-items: center; justify-content: flex-start; gap: 12px; flex-wrap: wrap; }
  .ec-chip { max-width: none; }
}
`;
