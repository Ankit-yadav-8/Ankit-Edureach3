/* ExamBuzz — the engineering counselling hub for the 2026 admission cycle.
   A week-by-week counselling timeline (auto-marking the current week), a
   counselling-window table by exam, and the overall month map. Replaces
   the old news + radar + calendar layout entirely. */
import { useEffect, useMemo } from "react";
import Seo from "../components/Seo.jsx";
import { Radio, Check, CalendarClock, GraduationCap } from "lucide-react";
import { CL } from "../components/home/clTheme.js";
import {
  COUNSELLING_WEEKS, COUNSELLING_BY_EXAM, OVERALL_TIMELINE,
  weekOrdinal, nowOrdinal,
} from "../data/counsellingTimeline.js";

const PHASE = {
  done: { label: "Done", fg: CL.muted,  bg: "rgba(33,29,46,.06)", dot: CL.muted },
  live: { label: "This week", fg: "#0a8f5b", bg: CL.greenSoft, dot: CL.green },
  soon: { label: "Upcoming", fg: CL.coralDk, bg: CL.coralSoft, dot: CL.coral },
};

export default function ExamBuzz() {
  useEffect(() => { document.title = "Exam Buzz — Engineering Counselling Timeline 2026 · College Parichay"; }, []);

  const liveOrd = useMemo(() => {
    const nowOrd = nowOrdinal();
    let live = -1;
    for (const w of COUNSELLING_WEEKS) {
      const o = weekOrdinal(w.y, w.m, w.w);
      if (o <= nowOrd) live = o;
    }
    return live;
  }, []);

  const phaseOf = (w) => {
    const o = weekOrdinal(w.y, w.m, w.w);
    return o < liveOrd ? "done" : o === liveOrd ? "live" : "soon";
  };

  return (
    <div style={{ background: CL.cream, minHeight: "100vh" }}>
      <Seo path="/exam-buzz" />

      {/* header */}
      <div style={{ paddingTop: 104, paddingBottom: 24, background: CL.cream, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${CL.cream3} 1.2px, transparent 1.2px)`, backgroundSize: "26px 26px", opacity: 0.6, pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 760 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11.5, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", color: CL.coralDk, background: CL.coralSoft, border: `1px solid ${CL.coral}33`, padding: "6px 14px", borderRadius: 50 }}>
            <Radio size={13} /> Exam Buzz · Counselling Live
          </span>
          <h1 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(2.1rem,5vw,3.2rem)", color: CL.ink, letterSpacing: "-1.4px", margin: "18px auto 14px", lineHeight: 1.08 }}>
            The 2026 counselling timeline, <span style={{ color: CL.coral }}>week by week.</span>
          </h1>
          <p style={{ color: CL.body, fontSize: "1.08rem", lineHeight: 1.7, maxWidth: 620, margin: "0 auto" }}>
            Every JoSAA, CSAB, BITSAT, COMEDK and state-counselling window for the 2026 engineering admission season — with the current week marked live so you always know what's next.
          </p>
        </div>
      </div>

      <style>{CSS}</style>

      {/* ── week-by-week timeline ── */}
      <section className="container eb-section">
        <h2 className="eb-h2"><CalendarClock size={20} color={CL.coral} /> Week-by-week counselling calendar</h2>
        <div className="eb-timeline">
          {COUNSELLING_WEEKS.map((w) => {
            const ph = phaseOf(w);
            const p = PHASE[ph];
            return (
              <div key={w.label} className={`eb-row eb-row--${ph}`}>
                <div className="eb-rail">
                  <span className="eb-node" style={{ background: ph === "done" ? "#fff" : p.dot, borderColor: p.dot, color: p.dot }}>
                    {ph === "done" && <Check size={12} strokeWidth={3} />}
                    {ph === "live" && <span className="eb-node-pulse" />}
                  </span>
                </div>
                <div className="eb-card">
                  <div className="eb-card-head">
                    <span className="eb-period">{w.label}</span>
                    <span className="eb-tag" style={{ color: p.fg, background: p.bg }}>
                      {ph === "live" && <span className="eb-tag-dot" />}{p.label}
                    </span>
                  </div>
                  <div className="eb-events">
                    {w.events.map((e) => (
                      <span key={e} className="eb-event"><span className="eb-event-dot" style={{ background: p.dot }} />{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── counselling window by exam ── */}
      <section className="eb-band">
        <div className="container eb-section" style={{ paddingTop: 56, paddingBottom: 56 }}>
          <h2 className="eb-h2"><GraduationCap size={20} color={CL.coral} /> Counselling window — by exam</h2>
          <div className="eb-exam-grid">
            {COUNSELLING_BY_EXAM.map((r) => (
              <div key={r.exam} className="eb-exam-card" style={{ borderLeft: `3px solid ${r.tone}` }}>
                <div className="eb-exam-name">{r.exam}</div>
                <div className="eb-exam-window">
                  <span><span className="eb-exam-k">Starts</span>{r.start}</span>
                  <span className="eb-exam-arrow">→</span>
                  <span><span className="eb-exam-k">Ends</span>{r.end}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── overall admission map ── */}
      <section className="container eb-section" style={{ paddingBottom: 88 }}>
        <h2 className="eb-h2"><Radio size={20} color={CL.coral} /> The season at a glance</h2>
        <div className="eb-overall">
          {OVERALL_TIMELINE.map((o, i) => (
            <div key={o.month} className="eb-step">
              <div className="eb-step-n">{i + 1}</div>
              <div className="eb-step-month">{o.month}</div>
              <div className="eb-step-act">{o.activity}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const CSS = `
.eb-section { max-width:960px; }
.eb-h2 { display:flex; align-items:center; gap:10px; font:800 clamp(1.4rem,3vw,1.9rem)/1.2 ${CL.display}; color:${CL.ink}; letter-spacing:-.6px; margin:0 0 30px; }

/* week timeline */
.eb-timeline { position:relative; }
.eb-row { display:grid; grid-template-columns:34px 1fr; gap:16px; }
.eb-rail { position:relative; display:flex; justify-content:center; }
.eb-rail::before { content:""; position:absolute; top:0; bottom:0; width:2px; background:${CL.cream3}; }
.eb-row:first-child .eb-rail::before { top:14px; }
.eb-row:last-child .eb-rail::before { bottom:calc(100% - 14px); }
.eb-node { position:relative; z-index:1; margin-top:4px; width:22px; height:22px; border-radius:50%; border:2px solid; display:grid; place-items:center; flex-shrink:0; }
.eb-row--live .eb-node { box-shadow:0 0 0 5px ${CL.green}22; }
.eb-node-pulse { position:absolute; inset:-2px; border-radius:50%; border:2px solid ${CL.green}; animation:ebPulse 1.8s ease-out infinite; }
@keyframes ebPulse { 0%{transform:scale(1);opacity:.7;} 100%{transform:scale(2.4);opacity:0;} }

.eb-card { background:#fff; border:1px solid ${CL.line}; border-radius:16px; padding:16px 18px; margin-bottom:16px; box-shadow:0 6px 20px rgba(33,29,46,.04); transition:transform .2s, box-shadow .2s; }
.eb-card:hover { transform:translateY(-3px); box-shadow:0 14px 30px rgba(33,29,46,.09); }
.eb-row--live .eb-card { border:1.5px solid ${CL.green}; box-shadow:0 12px 30px ${CL.green}1f; }
.eb-row--done .eb-card { background:#FAFAFB; }
.eb-row--done .eb-event { color:${CL.body}; }
.eb-card-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px; flex-wrap:wrap; }
.eb-period { font:800 1.02rem/1.2 ${CL.display}; color:${CL.ink}; letter-spacing:-.3px; }
.eb-tag { display:inline-flex; align-items:center; gap:6px; font:800 10px/1 ${CL.display}; letter-spacing:.08em; text-transform:uppercase; padding:5px 11px; border-radius:50px; }
.eb-tag-dot { width:6px; height:6px; border-radius:50%; background:currentColor; animation:ebDot 1.5s ease-in-out infinite; }
@keyframes ebDot { 0%,100%{transform:scale(.9);opacity:1;} 50%{transform:scale(1.5);opacity:.4;} }
.eb-events { display:flex; flex-wrap:wrap; gap:8px 18px; }
.eb-event { display:inline-flex; align-items:center; gap:8px; font:600 .86rem/1.4 sans-serif; color:${CL.ink2}; }
.eb-event-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

/* by-exam grid */
.eb-band { background:${CL.cream2}; border-top:1px solid ${CL.line}; border-bottom:1px solid ${CL.line}; }
.eb-exam-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr)); gap:14px; }
.eb-exam-card { background:#fff; border:1px solid ${CL.line}; border-radius:14px; padding:15px 16px; box-shadow:0 4px 14px rgba(33,29,46,.04); }
.eb-exam-name { font:800 .96rem/1.3 ${CL.display}; color:${CL.ink}; margin-bottom:10px; }
.eb-exam-window { display:flex; align-items:flex-end; gap:12px; font:600 .86rem/1.3 sans-serif; color:${CL.ink2}; }
.eb-exam-window > span { display:flex; flex-direction:column; gap:3px; }
.eb-exam-k { font:800 9px/1 ${CL.display}; letter-spacing:.09em; text-transform:uppercase; color:${CL.muted}; }
.eb-exam-arrow { color:${CL.muted}; align-self:center; }

/* overall */
.eb-overall { display:grid; grid-template-columns:repeat(6,1fr); gap:12px; }
.eb-step { background:#fff; border:1px solid ${CL.line}; border-radius:16px; padding:18px 14px; text-align:center; box-shadow:0 6px 18px rgba(33,29,46,.04); }
.eb-step-n { width:30px; height:30px; margin:0 auto 12px; border-radius:50%; display:grid; place-items:center; background:${CL.coralSoft}; color:${CL.coralDk}; font:800 .9rem/1 ${CL.display}; }
.eb-step-month { font:800 1rem/1.2 ${CL.display}; color:${CL.ink}; margin-bottom:6px; }
.eb-step-act { font:500 .8rem/1.4 sans-serif; color:${CL.body}; }

@media (max-width:820px) { .eb-overall { grid-template-columns:repeat(3,1fr); } }
@media (max-width:480px) {
  .eb-overall { grid-template-columns:repeat(2,1fr); }
  .eb-row { grid-template-columns:26px 1fr; gap:12px; }
}
@media (prefers-reduced-motion: reduce) { .eb-node-pulse { animation:none; } }
`;
