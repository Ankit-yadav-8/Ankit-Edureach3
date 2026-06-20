/* ExamTimeline — a campusloom-styled "exam time" section for the home page.
   Clean white cards on the shared surface: each key 2026 milestone shows its
   window, a status pill, what it unlocks, and a link to the relevant page. */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, FileText, Trophy, GraduationCap, Stethoscope, Landmark, ArrowRight, CalendarClock } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

const EVENTS = [
  { icon: FileText, accent: CL.coral, name: "JEE Main · Session 1", date: "Jan 22 – 29, 2026", status: "done", unlock: "Qualifies for JEE Advanced · NIT/IIIT/GFTI via JoSAA", to: "/jee-main" },
  { icon: FileText, accent: CL.coral, name: "JEE Main · Session 2", date: "Apr 1 – 8, 2026", status: "upcoming", unlock: "Best of two sessions counted for your final rank", to: "/jee-main" },
  { icon: Trophy, accent: CL.violet, name: "JEE Advanced 2026", date: "May 18, 2026", status: "upcoming", unlock: "Gateway to all 23 IITs — Paper 1 + Paper 2", to: "/jee-advanced" },
  { icon: Stethoscope, accent: CL.green, name: "NEET UG 2026", date: "May 03, 2026", status: "upcoming", unlock: "MBBS / BDS across AIQ + state-quota colleges", to: "/neet" },
  { icon: GraduationCap, accent: CL.blue, name: "JoSAA Counselling", date: "Jun 15 – Jul 25, 2026", status: "upcoming", unlock: "6 rounds · IITs, NITs, IIITs & GFTIs", to: "/josaa-2026" },
  { icon: Landmark, accent: CL.amber, name: "CSAB Special Rounds", date: "Jul 20 – Aug 10, 2026", status: "upcoming", unlock: "Second shot at vacant NIT / IIIT / GFTI seats", to: "/planner" },
];

const STATUS = {
  done:     { label: "Completed", fg: CL.muted,  bg: "rgba(33,29,46,.06)" },
  upcoming: { label: "Upcoming",  fg: CL.coralDk, bg: CL.coralSoft },
};

function EventCard({ e, nav }) {
  const s = STATUS[e.status];
  const Ic = e.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      role="button"
      tabIndex={0}
      onClick={() => nav(e.to)}
      onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); nav(e.to); } }}
      style={{
        background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`,
        boxShadow: CL.shadow, padding: "22px 22px 20px", cursor: "pointer",
        display: "flex", flexDirection: "column", height: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ width: 46, height: 46, borderRadius: 13, background: `${e.accent}18`, display: "grid", placeItems: "center" }}>
          <Ic size={22} color={e.accent} />
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".04em", color: s.fg, background: s.bg, padding: "5px 12px", borderRadius: 50 }}>
          {s.label}
        </span>
      </div>

      <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.12rem", color: CL.ink, letterSpacing: "-0.3px", marginBottom: 8 }}>{e.name}</h3>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: e.accent, marginBottom: 12 }}>
        <CalendarDays size={14} /> {e.date}
      </div>
      <p style={{ color: CL.body, fontSize: 13, lineHeight: 1.6, marginBottom: 16, flex: 1 }}>{e.unlock}</p>

      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: CL.coralDk, fontWeight: 700, fontSize: 13, fontFamily: CL.display }}>
        View details <ArrowRight size={15} />
      </span>
    </motion.div>
  );
}

export default function ExamTimeline() {
  const nav = useNavigate();
  return (
    <section id="exam-timeline" style={{ background: CL.cream2, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 44px" }}>
          <span style={clEyebrow}><CalendarClock size={13} /> Exam Time 2026</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4vw,2.7rem)", color: CL.ink, letterSpacing: "-1px", margin: "16px 0 12px", lineHeight: 1.12 }}>
            Every key date, <span style={{ color: CL.coral }}>one timeline.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            From JEE Main to JoSAA &amp; CSAB — the 2026 admission season at a glance, with exactly what each milestone unlocks.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 22 }}>
          {EVENTS.map((e) => <EventCard key={e.name} e={e} nav={nav} />)}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <button onClick={() => nav("/exam-buzz")} style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            background: CL.coral, color: "#fff", border: "none", borderRadius: 50,
            padding: "13px 26px", fontFamily: CL.display, fontWeight: 800, fontSize: 14.5,
            cursor: "pointer", boxShadow: "0 10px 26px rgba(255, 105, 61,.35)",
          }}>
            <CalendarClock size={17} /> See the full exam &amp; counselling radar <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
