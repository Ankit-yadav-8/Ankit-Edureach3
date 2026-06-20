/* ExamCalendar — a campusloom-style horizontal "exam calendar" for the
   2026–27 admission cycle. Month columns auto-scroll across the rail with a
   live progress bar, soft shadow/fade ends and event pills colour-coded by
   exam family. Built to replace the old card-grid ExamTimeline on the home
   page and the news block on /exam-buzz. */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarRange, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CL, clEyebrow } from "./clTheme.js";

/* exam-family palette — each pill carries the colour of its family */
const FAM = {
  jee:    { fg: "#C2540A", bg: "#FDEBDC", dot: CL.coral,  label: "JEE" },
  adv:    { fg: "#5B21B6", bg: "#EDE6F7", dot: "#7C3AED", label: "JEE Advanced" },
  neet:   { fg: "#0A7A4E", bg: "#D8F3E6", dot: CL.green,  label: "NEET" },
  council:{ fg: "#1D4ED8", bg: "#E2ECFF", dot: CL.blue,   label: "Counselling" },
  state:  { fg: "#9A6610", bg: "#FBEBCF", dot: CL.amber,  label: "State exams" },
  other:  { fg: "#0E7490", bg: "#D6F1F0", dot: "#0EA5A4", label: "Boards & other" },
};

/* 2026–27 cycle — current month (per the live date) is June 2026.
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
  done:     { label: "Done",  fg: CL.muted,   bg: "rgba(33,29,46,.06)", ring: CL.cream3 },
  live:     { label: "Now",   fg: "#0a8f5b",  bg: CL.greenSoft,         ring: CL.green  },
  upcoming: { label: "Soon",  fg: CL.coralDk, bg: CL.coralSoft,         ring: CL.coral  },
};

const COL_W = 188; // px per month column

function EventPill({ e }) {
  const f = FAM[e.fam] || FAM.other;
  return (
    <div style={{
      background: f.bg, borderRadius: 12, padding: "9px 11px",
      borderLeft: `3px solid ${f.dot}`, position: "relative",
      boxShadow: "0 1px 3px rgba(33,29,46,.05)",
    }}>
      <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 12.5, color: f.fg, lineHeight: 1.25 }}>
        {e.name}
      </div>
      {e.sub && (
        <div style={{ fontSize: 11, color: CL.body, fontStyle: "italic", marginTop: 2, lineHeight: 1.3 }}>
          {e.sub}
        </div>
      )}
    </div>
  );
}

export default function ExamCalendar({
  surface = CL.cream,
  eyebrow = "Exam Calendar · 2026–27 Cycle",
  heading = true,
}) {
  const nav      = useNavigate();
  const scroller = useRef(null);
  const posRef   = useRef(0);
  const dirRef   = useRef(1);
  const paused   = useRef(false);
  const frame    = useRef(null);
  const [progress, setProgress] = useState({ thumb: 30, left: 0 });

  /* sync the custom progress bar with the current scroll position */
  const syncProgress = (el) => {
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const thumb = Math.max(12, (el.clientWidth / el.scrollWidth) * 100);
    const left  = max > 0 ? (el.scrollLeft / max) * (100 - thumb) : 0;
    setProgress({ thumb, left });
  };

  /* auto-scroll: gentle ping-pong across the rail, pausing on hover/touch */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const SPEED = 0.4; // px / frame
    posRef.current = el.scrollLeft;
    syncProgress(el);
    const tick = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (!paused.current && max > 4) {
        posRef.current += SPEED * dirRef.current;
        if (posRef.current >= max) { posRef.current = max; dirRef.current = -1; }
        else if (posRef.current <= 0) { posRef.current = 0; dirRef.current = 1; }
        el.scrollLeft = posRef.current;
        syncProgress(el);
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    posRef.current = el.scrollLeft;
    syncProgress(el);
  };

  const nudge = (dir) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * COL_W * 2, behavior: "smooth" });
  };

  return (
    <section id="exam-calendar" style={{ background: surface, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {heading && (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 30 }}>
            <div style={{ maxWidth: 640 }}>
              <span style={clEyebrow}><CalendarRange size={13} /> {eyebrow}</span>
              <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.7rem)", color: CL.ink, letterSpacing: "-1px", margin: "16px 0 10px", lineHeight: 1.12 }}>
                The full admission season, <span style={{ color: CL.coral, fontStyle: "italic" }}>month by month.</span>
              </h2>
              <p style={{ color: CL.body, fontSize: "1.02rem", lineHeight: 1.7, fontStyle: "italic" }}>
                Every exam, result &amp; counselling window of the 2026–27 cycle on one moving rail — scroll through, or just watch it glide.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              {[-1, 1].map((d) => (
                <button key={d} onClick={() => nudge(d)} aria-label={d < 0 ? "Scroll left" : "Scroll right"}
                  style={{
                    width: 42, height: 42, borderRadius: "50%", background: CL.coralSoft,
                    border: `1.5px solid ${CL.coral}55`, color: CL.coralDk,
                    display: "grid", placeItems: "center", cursor: "pointer", transition: "all .2s",
                  }}>
                  {d < 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Rail ── */}
        <div style={{ position: "relative" }}>
          {/* shadow / fade ends */}
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 14, width: 56, zIndex: 3, pointerEvents: "none", background: `linear-gradient(to right, ${surface}, transparent)` }} />
          <div style={{ position: "absolute", top: 0, right: 0, bottom: 14, width: 56, zIndex: 3, pointerEvents: "none", background: `linear-gradient(to left, ${surface}, transparent)` }} />

          <div
            ref={scroller}
            onScroll={onScroll}
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
            onTouchStart={() => { paused.current = true; }}
            style={{ overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: 4 }}
          >
            <style>{`#exam-calendar ::-webkit-scrollbar{display:none}`}</style>
            <div style={{ display: "flex", gap: 14, minWidth: "min-content", position: "relative", paddingTop: 8 }}>

              {MONTHS.map((m) => {
                const ph = PHASE[m.phase];
                return (
                  <div key={`${m.mon}-${m.yr}`} style={{ width: COL_W, flexShrink: 0, display: "flex", flexDirection: "column", position: "relative" }}>
                    {/* month head */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: CL.card, border: `1px solid ${m.phase === "live" ? CL.green : CL.line}`,
                      borderRadius: 13, padding: "9px 13px", boxShadow: CL.shadow,
                      position: "relative", zIndex: 2,
                      outline: m.phase === "live" ? `3px solid ${CL.green}22` : "none",
                    }}>
                      <div>
                        <span style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 16, color: CL.ink, letterSpacing: "-.3px" }}>{m.mon}</span>
                        <span style={{ fontSize: 11, color: CL.muted, fontWeight: 700, marginLeft: 5 }}>{m.yr}</span>
                      </div>
                      <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: ph.fg, background: ph.bg, padding: "3px 9px", borderRadius: 50 }}>
                        {m.phase === "live" ? "● Now" : ph.label}
                      </span>
                    </div>

                    {/* node on the rail (with a connector segment behind it) */}
                    <div style={{ display: "grid", placeItems: "center", height: 22, position: "relative", zIndex: 2 }}>
                      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, transform: "translateY(-50%)", background: `linear-gradient(90deg, ${CL.cream3}, ${CL.coral}44, ${CL.cream3})`, borderRadius: 2 }} />
                      <span style={{ position: "relative", width: 11, height: 11, borderRadius: "50%", background: CL.card, border: `3px solid ${ph.ring}`, boxShadow: m.phase === "live" ? `0 0 0 4px ${CL.green}22` : "none" }} />
                    </div>

                    {/* events */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {m.events.map((e) => <EventPill key={e.name} e={e} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* progress scrollbar */}
          <div style={{ marginTop: 16, height: 6, borderRadius: 50, background: CL.cream3, position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 0, bottom: 0,
              width: `${progress.thumb}%`, left: `${progress.left}%`,
              background: `linear-gradient(90deg, ${CL.coral}, ${CL.coralDk})`,
              borderRadius: 50, transition: "left .08s linear",
            }} />
          </div>
        </div>

        {/* legend + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 26 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
            {Object.values(FAM).map((f) => (
              <span key={f.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: CL.body, fontWeight: 600 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: f.dot }} /> {f.label}
              </span>
            ))}
          </div>
          <button onClick={() => nav("/exam-buzz")} style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            background: CL.coral, color: "#fff", border: "none", borderRadius: 50,
            padding: "12px 24px", fontFamily: CL.display, fontWeight: 800, fontSize: 14,
            cursor: "pointer", boxShadow: "0 10px 26px rgba(244,126,32,.35)",
          }}>
            Open the live counselling radar <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
