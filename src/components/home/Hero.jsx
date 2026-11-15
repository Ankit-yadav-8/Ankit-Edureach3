import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Phone,
  Video,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Target,
  ShieldCheck,
  Clock,
} from "lucide-react";

/* ════════════════════════════════════════════════
   HERO - 2-Column Split Editorial Layout
   - Bold neo-brutalist typography with squiggly underline
   - High-contrast CTAs ("Explore Mentorship" & "About Us")
   - Pure white background (#FFFFFF)
   - Working Interactive Laptop Screen displaying Google Meet Mentorship Video Call
   - Refined 3D Origami Paper Airplane sign with flight trail & micro-animations
   - Floating neo-brutalist sticky notes for daily targets, doubt solving & backlogs
════════════════════════════════════════════════ */

const CORAL     = "#FF5A36";
const INK       = "#1B1B1B";
const TEXT_SOFT = "#8A8272";
const BASE      = "#FFFFFF";
const SHADOW_DK = "rgba(0,0,0,0.08)";
const SHADOW_LT = "#FFFFFF";

const pressed = `inset 4px 4px 8px ${SHADOW_DK}, inset -4px -4px 8px ${SHADOW_LT}`;

/* ── Refined Paper Airplane Sign with Curved Dotted Flight Trail ── */
function PaperAirplaneSign() {
  return (
    <div className="mj-plane-sign" aria-label="Target Top 1% AIR">
      {/* Dynamic Curved Dotted Flight Trail */}
      <svg
        className="mj-plane-trail-svg"
        viewBox="0 0 170 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 12 112 C 40 118, 72 96, 82 68 C 92 40, 122 30, 150 14"
          stroke="#FF7A3C"
          strokeWidth="2.4"
          strokeDasharray="5 5"
          strokeLinecap="round"
        />
        {/* Tiny energy particles along the flight path */}
        <circle cx="82" cy="68" r="2.2" fill="#FF7A3C" opacity="0.75" />
        <circle cx="48" cy="110" r="2" fill="#FF7A3C" opacity="0.5" />
        <circle cx="120" cy="38" r="2" fill="#FF7A3C" opacity="0.6" />
      </svg>

      {/* Modern 3D Folded Origami Airplane with Coral Accents */}
      <div className="mj-plane-body">
        <svg
          className="mj-plane-origami"
          viewBox="0 0 74 62"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bottom Keel Fold (Depth Shadow) */}
          <polygon
            points="8,48 70,8 36,54"
            fill="#FF5A36"
            stroke="#1B1B1B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Inner Underbody Shadow */}
          <polygon
            points="36,54 70,8 44,34"
            fill="#E04820"
            stroke="#1B1B1B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Main Top Wing (Crisp White with High-Contrast Border) */}
          <polygon
            points="8,48 70,8 26,18"
            fill="#FFFFFF"
            stroke="#1B1B1B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Starboard Wing Fold */}
          <polygon
            points="26,18 70,8 44,34"
            fill="#F6F1EC"
            stroke="#1B1B1B"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          {/* Crease Line */}
          <line
            x1="26"
            y1="18"
            x2="70"
            y2="8"
            stroke="#1B1B1B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Rank Pill attached to the paper plane */}
        <div className="mj-plane-badge">
          <Sparkles size={11} color="#FF5A36" />
          <span>Target AIR &lt; 500</span>
        </div>
      </div>
    </div>
  );
}

/* ── Interactive Working Laptop Screen with Live Google Meet Call ── */
function WorkingLaptopScreen() {
  const [activeTab, setActiveTab] = useState("meet"); // "meet" | "daily" | "autopsy"
  const [tasks, setTasks] = useState([
    { id: 1, text: "Physics: Rotational Dynamics (25 Adv PYQs)", tag: "+4 Marks", done: true },
    { id: 2, text: "Chemistry: Coordination Compounds Rev.", tag: "Done", done: true },
    { id: 3, text: "Maths: Definite Integration Short Notes", tag: "Tonight", done: false },
  ]);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="mj-device-showcase">
      {/* 1. Refined Paper Airplane Sign (Top Right) */}
      <PaperAirplaneSign />

      {/* 2. Floating Top-Left Note: 1-on-1 IITian Mentor */}
      <div className="mj-sticky-note mj-note-tl">
        <div className="mj-note-header">
          <span className="mj-note-pin" aria-hidden="true">📌</span>
          <span className="mj-note-title">1-on-1 IITian Mentor</span>
        </div>
        <p className="mj-note-desc">Weekly strategy call & daily WhatsApp roadmap</p>
      </div>

      {/* 3. Floating Bottom-Left Note: Zero Backlogs */}
      <div className="mj-sticky-note mj-note-bl">
        <div className="mj-note-header">
          <ShieldCheck size={14} color="#16A34A" />
          <span className="mj-note-title">Zero Backlogs Plan</span>
        </div>
        <p className="mj-note-desc">Personalized catchup schedule</p>
      </div>

      {/* 4. Floating Bottom-Right Note: 24x7 Doubt Solving */}
      <div className="mj-sticky-note mj-note-br">
        <div className="mj-note-header">
          <Clock size={14} color="#FF5A36" />
          <span className="mj-note-title">24×7 Doubt Solving</span>
        </div>
        <p className="mj-note-desc">Verified IITians reply in &lt; 15 mins</p>
      </div>

      {/* 5. The Working Laptop Mockup Hardware */}
      <div className="mj-laptop-chassis">
        {/* Laptop Lid Screen */}
        <div className="mj-laptop-lid">
          {/* Top Bezel with Webcam Dot */}
          <div className="mj-laptop-bezel-top">
            <div className="mj-laptop-camera" />
          </div>

          {/* Active Screen Display */}
          <div className="mj-laptop-screen">
            {/* Window Chrome Titlebar */}
            <div className="mj-os-titlebar">
              <div className="mj-os-traffic-lights">
                <span className="mj-os-dot mj-dot-red" />
                <span className="mj-os-dot mj-dot-yellow" />
                <span className="mj-os-dot mj-dot-green" />
              </div>
              <div className="mj-os-window-title">
                meet.google.com/cp-iitian-mentorship
              </div>
              <div className="mj-os-mentor-status">
                <span className="mj-pulse-dot" />
                <span>IIT Roorkee Mentor Online</span>
              </div>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="mj-os-tabbar">
              <button
                type="button"
                className={`mj-os-tab-btn ${activeTab === "meet" ? "active" : ""}`}
                onClick={() => setActiveTab("meet")}
              >
                <Video size={13} />
                <span>Live Google Meet Call</span>
              </button>
              <button
                type="button"
                className={`mj-os-tab-btn ${activeTab === "daily" ? "active" : ""}`}
                onClick={() => setActiveTab("daily")}
              >
                <Target size={13} />
                <span>Daily Targets</span>
              </button>
              <button
                type="button"
                className={`mj-os-tab-btn ${activeTab === "autopsy" ? "active" : ""}`}
                onClick={() => setActiveTab("autopsy")}
              >
                <BarChart2 size={13} />
                <span>Test Autopsy</span>
              </button>
            </div>

            {/* Tab 1: Live Google Meet Video Call Session */}
            {activeTab === "meet" && (
              <div className="mj-os-meet-stage mj-fade-in">
                <div className="mj-os-meet-frame">
                  <picture>
                    <source srcSet="/images/google_meet_mentorship.webp" type="image/webp" />
                    <img
                      src="/images/google_meet_mentorship.jpg"
                      alt="Real CampusPoint 1-on-1 and Group Mentorship Google Meet Session"
                      className="mj-os-meet-img"
                      width="1376"
                      height="768"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </picture>

                  {/* Live Call Badge Overlay */}
                  <div className="mj-meet-live-badge">
                    <span className="mj-meet-pulse-dot" />
                    <span>LIVE · 1-on-1 Session</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2 Content: Daily Targets */}
            {activeTab === "daily" && (
              <div className="mj-os-screen-content mj-fade-in">
                {/* Progress Header */}
                <div className="mj-os-progress-card">
                  <div className="mj-os-card-header">
                    <span className="mj-os-subheading">Today's Action Plan · Day 46</span>
                    <span className="mj-os-badge-pill">{progressPercent}% Done</span>
                  </div>
                  <div className="mj-os-progress-track">
                    <div
                      className="mj-os-progress-bar"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Interactive Task Checklist */}
                <div className="mj-os-checklist">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`mj-os-task-row ${task.done ? "is-done" : ""}`}
                      onClick={() => toggleTask(task.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className={`mj-os-checkbox ${task.done ? "checked" : ""}`}>
                        {task.done && <CheckCircle2 size={13} color="#FFFFFF" />}
                      </div>
                      <span className="mj-os-task-text">{task.text}</span>
                      <span className="mj-os-task-tag">{task.tag}</span>
                    </div>
                  ))}
                </div>

                {/* Live Mentor Feedback */}
                <div className="mj-os-mentor-card">
                  <div className="mj-os-mentor-avatar">IITR</div>
                  <div className="mj-os-mentor-msg">
                    <div className="mj-os-mentor-meta">
                      <strong>Ankit Kumar</strong> · IIT Roorkee Mentor
                    </div>
                    <p className="mj-os-mentor-text">
                      "🔥 Great problem speed! Revise Question 18 multi-correct concept tonight before 11 PM."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3 Content: Test Autopsy */}
            {activeTab === "autopsy" && (
              <div className="mj-os-screen-content mj-fade-in">
                <div className="mj-os-autopsy-header">
                  <div>
                    <span className="mj-os-subheading">Mock Test #14 Detailed Autopsy</span>
                    <div className="mj-os-score-display">
                      <span className="mj-os-score-num">228</span>
                      <span className="mj-os-score-denom">/ 300</span>
                      <span className="mj-os-score-top">Top 1.1% Rank</span>
                    </div>
                  </div>
                </div>

                {/* Subject Performance Breakdown */}
                <div className="mj-os-subject-grid">
                  <div className="mj-os-sub-bar-row">
                    <div className="mj-os-sub-label">
                      <span>Physics</span>
                      <strong>84/100</strong>
                    </div>
                    <div className="mj-os-sub-track">
                      <div className="mj-os-sub-fill" style={{ width: "84%", background: "#10B981" }} />
                    </div>
                  </div>
                  <div className="mj-os-sub-bar-row">
                    <div className="mj-os-sub-label">
                      <span>Chemistry</span>
                      <strong>82/100</strong>
                    </div>
                    <div className="mj-os-sub-track">
                      <div className="mj-os-sub-fill" style={{ width: "82%", background: "#3B82F6" }} />
                    </div>
                  </div>
                  <div className="mj-os-sub-bar-row">
                    <div className="mj-os-sub-label">
                      <span>Maths</span>
                      <strong>62/100</strong>
                    </div>
                    <div className="mj-os-sub-track">
                      <div className="mj-os-sub-fill" style={{ width: "62%", background: "#F59E0B" }} />
                    </div>
                  </div>
                </div>

                {/* Error Leak & Mentor Prescription */}
                <div className="mj-os-autopsy-alert">
                  <span className="mj-os-alert-badge">⚠️ Error Flag</span>
                  <p>
                    <strong>-12 marks</strong> lost to calculation slips in Calculus Q18 & Q22.
                    <br />
                    <em>Fix: 3-pass paper strategy to recover +16 marks in next mock.</em>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Laptop Aluminum Base & Hinge Shelf */}
        <div className="mj-laptop-base">
          <div className="mj-laptop-thumb-notch" />
        </div>
        <div className="mj-laptop-shadow" />
      </div>
    </div>
  );
}

/* ── breakpoints ── */
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w <= 430)  return "xs";
    if (w <= 768)  return "mobile";
    if (w <= 1024) return "tablet";
    return "desktop";
  });
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 430)  setBp("xs");
      else if (w <= 768)  setBp("mobile");
      else if (w <= 1024) setBp("tablet");
      else setBp("desktop");
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return { isXs: bp === "xs", isMobile: bp === "mobile" || bp === "xs", isTablet: bp === "tablet" };
}

/* ── 3-step journey: Mentorship → Rank → Dream College ── */
const STEPS = [
  { n: "01", title: "Mentorship", to: "/mentorship/jee-2027", desc: "A 1-on-1 IITian / doctor mentor with daily targets and weekly test analysis." },
  { n: "02", title: "Rank", to: "/jee-main", desc: "Your mentor lifts your rank with 1-on-1 doubt solving and a plan to clear every backlog." },
  { n: "03", title: "Dream College", to: "/for-you", desc: "Guided by your mentor every step, you'll reach your dream college." },
];
const stepsContainer = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };
const stepVariant = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

function JourneyLine() {
  return (
    <div aria-hidden style={{ position: "absolute", top: 27, left: "16%", right: "16%", height: 3, zIndex: 0,
      background: `linear-gradient(90deg, ${CORAL} 0%, ${CORAL} 40%, ${SHADOW_DK} 40%, ${SHADOW_DK} 100%)`, borderRadius: 2 }} />
  );
}

function HeroSteps({ isMobile }) {
  return (
    <motion.div
      variants={stepsContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}
      style={{ maxWidth: 980, margin: isMobile ? "2.4rem auto 0" : "3rem auto 0", position: "relative" }}
    >
      {!isMobile && <JourneyLine />}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", columnGap: isMobile ? 16 : 24, rowGap: isMobile ? 34 : 0 }}>
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n} variants={stepVariant}
            style={{ textAlign: "center", position: "relative", zIndex: 1, gridColumn: isMobile && i === 0 ? "1 / -1" : "auto" }}
          >
            <div style={{
              width: 54, height: 54, borderRadius: "50%", margin: "0 auto 16px",
              background: i === 0 ? CORAL : BASE,
              boxShadow: i === 0 ? `inset 3px 3px 6px rgba(0,0,0,0.15), inset -3px -3px 6px rgba(255,255,255,0.3)` : pressed,
              display: "grid", placeItems: "center",
            }}>
              <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 17, color: i === 0 ? "#fff" : CORAL }}>{s.n}</span>
            </div>
            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: isMobile ? 16 : 18, color: INK, marginBottom: 8 }}>{s.title}</div>
            <p style={{ margin: "0 auto", maxWidth: isMobile ? 230 : 250, fontSize: isMobile ? 12.5 : 13.5, color: TEXT_SOFT, lineHeight: 1.55, fontFamily: "'Inter',system-ui,sans-serif" }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Hero({ onSearch }) {
  const { isMobile } = useBreakpoint();
  const waUrl = "https://wa.me/918290066127?text=Hi%20CampusPoint%2C%20I%20want%20to%20know%20more%20about%20mentorship%20plans";

  return (
    <>
      {/* ── 2-Column Split Hero (Editorial Hub Layout - Pure White Background) ── */}
      <section className="mj-hero-seo">
        <div className="mj-wrap">
          <div className="mj-hero-seo-grid">
            {/* Left Column: Headline, Pill, Actions, Reassurance */}
            <div className="mj-hero-copy-col">
              <h1 className="mj-hero-h1">
                <span className="mj-hero-line1">
                  <span className="mj-hero-word-break">Personalized</span>
                  <span className="mj-hero-squiggle-wrap">
                    1-on-1
                    <svg className="mj-hero-squiggle" viewBox="0 0 160 14" fill="none" aria-hidden="true">
                      <path
                        d="M3 9C20 2 36 14 54 8C72 2 88 14 106 8C124 2 140 14 157 8"
                        stroke="#FF693D"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </span>
                <span className="mj-hero-line2">
                  <span className="mj-hero-line2-lead">for your</span>
                  <span className="mj-hero-box-pill">JEE Mentorship.</span>
                </span>
              </h1>

              {/* Action Buttons: Primary "Explore Mentorship" & Secondary "About Us" */}
              <div className="mj-hero-editorial-actions" style={{ marginTop: "28px" }}>
                <Link
                  to="/mentorship"
                  className="mj-hero-btn-primary"
                >
                  Explore Mentorship <ArrowRight size={17} />
                </Link>
                <Link
                  to="/about"
                  className="mj-hero-btn-secondary"
                >
                  About Us <ArrowRight size={17} />
                </Link>
              </div>

              {/* Direct WhatsApp Mentor Reassurance */}
              <div className="mj-hero-wa-hint">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone size={14} /> Have questions? Chat with an IITian Mentor on WhatsApp
                </a>
              </div>
            </div>

            {/* Right Column: Working Interactive Laptop Screen Display */}
            <div className="mj-hero-illustration-col">
              <WorkingLaptopScreen />
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-Step Journey (Mentorship → Rank → Dream College) ── */}
      <section style={{ width: "100%", background: BASE, paddingBottom: isMobile ? 64 : 84, paddingTop: 20 }}>
        <div className="container" style={{ paddingInline: "1.5rem" }}>
          <HeroSteps isMobile={isMobile} />
        </div>
      </section>

      {/* ── Scoped Styling for Hero ── */}
      <style>{`
        .mj-hero-seo {
          position: relative;
          padding: clamp(165px, 15vw, 215px) 0 clamp(48px, 5vw, 72px);
          overflow: hidden;
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
        }
        .mj-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .mj-hero-seo-grid {
          display: grid;
          grid-template-columns: 1fr 1.12fr;
          align-items: center;
          gap: clamp(28px, 4.5vw, 56px);
          max-width: 1240px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .mj-hero-copy-col {
          text-align: left;
        }

        /* Bold Editorial Typography */
        .mj-hero-h1 {
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: clamp(2.3rem, 4.4vw, 4.1rem);
          line-height: 1.12;
          letter-spacing: -0.03em;
          color: #1B1B1B;
          margin: 0 0 16px;
        }
        .mj-hero-line1 {
          display: block;
          font-weight: 800;
          color: #1B1B1B;
          margin-bottom: 6px;
        }
        .mj-hero-word-break {
          display: block;
          margin-bottom: 2px;
        }
        .mj-hero-squiggle-wrap {
          position: relative;
          display: inline-block;
          white-space: nowrap;
        }
        .mj-hero-squiggle {
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 100%;
          height: 10px;
          overflow: visible;
          pointer-events: none;
        }
        .mj-hero-line2 {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          font-weight: 800;
          color: #1B1B1B;
        }
        .mj-hero-line2-lead {
          display: block;
          font-weight: 800;
          color: #1B1B1B;
        }
        .mj-hero-box-pill {
          display: inline-block;
          vertical-align: middle;
          background: #FF7A3C;
          color: #FFFFFF;
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 0.94em;
          padding: 2px 14px 4px 14px;
          border-radius: 9px;
          border: 2.5px solid #1B1B1B;
          box-shadow: 3.5px 3.5px 0px #1B1B1B;
          letter-spacing: -0.02em;
          line-height: 1.15;
          white-space: nowrap;
        }

        /* Editorial Action Buttons */
        .mj-hero-editorial-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .mj-hero-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          background: #1B1B1B;
          color: #FFFFFF;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 0.98rem;
          border-radius: 12px;
          border: 2px solid #1B1B1B;
          box-shadow: 3px 3px 0px #FF7A3C;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          text-decoration: none;
        }
        .mj-hero-btn-primary:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0px #FF7A3C;
          background: #2B2B2B;
          color: #FFFFFF;
        }
        .mj-hero-btn-primary:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #FF7A3C;
        }

        .mj-hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 24px;
          background: #FFFFFF;
          color: #1B1B1B;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 0.98rem;
          border-radius: 12px;
          border: 2px solid #1B1B1B;
          box-shadow: 3px 3px 0px #1B1B1B;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          text-decoration: none;
        }
        .mj-hero-btn-secondary:hover {
          transform: translate(-2px, -2px);
          box-shadow: 5px 5px 0px #1B1B1B;
          background: #FAF7F2;
          color: #1B1B1B;
        }
        .mj-hero-btn-secondary:active {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0px #1B1B1B;
        }

        .mj-hero-wa-hint {
          margin-top: 4px;
        }
        .mj-hero-wa-hint a {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font: 600 0.88rem/1.4 'DM Sans', sans-serif;
          color: #555555;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .mj-hero-wa-hint a:hover {
          color: #FF5C35;
        }

        /* ════════════════════════════════════════════════
           WORKING LAPTOP & REFINED PAPER PLANE STYLING
        ════════════════════════════════════════════════ */
        .mj-hero-illustration-col {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
        }

        .mj-device-showcase {
          position: relative;
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
          padding: 20px 10px 10px;
        }

        /* ── Refined Paper Airplane Sign ── */
        .mj-plane-sign {
          position: absolute;
          top: -24px;
          right: -8px;
          z-index: 10;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .mj-plane-trail-svg {
          width: 140px;
          height: 95px;
          position: absolute;
          bottom: 12px;
          right: 22px;
          overflow: visible;
        }
        .mj-plane-body {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: mjFloatPlane 3.4s ease-in-out infinite;
        }
        .mj-plane-origami {
          width: 62px;
          height: 52px;
          filter: drop-shadow(3px 4px 0px rgba(27,27,27,0.7));
          transform: rotate(-3deg);
        }
        .mj-plane-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #FFFFFF;
          border: 1.8px solid #1B1B1B;
          box-shadow: 2.5px 2.5px 0px #1B1B1B;
          border-radius: 999px;
          padding: 2.5px 10px;
          font: 800 10.5px/1 'Sora', sans-serif;
          color: #1B1B1B;
          margin-top: -6px;
          white-space: nowrap;
        }

        @keyframes mjFloatPlane {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-9px) rotate(-3deg);
          }
        }

        /* ── Floating Sticky Notes ── */
        .mj-sticky-note {
          position: absolute;
          z-index: 6;
          border: 2px solid #1B1B1B;
          box-shadow: 3px 3px 0px #1B1B1B;
          border-radius: 12px;
          padding: 8px 12px;
          pointer-events: auto;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .mj-sticky-note:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 12;
        }
        .mj-note-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 2px;
        }
        .mj-note-pin {
          font-size: 13px;
        }
        .mj-note-title {
          font: 800 11.5px/1.2 'Sora', sans-serif;
          color: #1B1B1B;
        }
        .mj-note-desc {
          margin: 0;
          font: 500 10.5px/1.3 'Inter', sans-serif;
          color: #4A4A4A;
        }

        .mj-note-tl {
          top: 10px;
          left: -22px;
          background: #FFFDF0;
          max-width: 175px;
          transform: rotate(-3.5deg);
        }
        .mj-note-bl {
          bottom: 16px;
          left: -20px;
          background: #F0FDF4;
          max-width: 170px;
          transform: rotate(2.5deg);
        }
        .mj-note-br {
          bottom: 16px;
          right: -16px;
          background: #FFF7ED;
          max-width: 175px;
          transform: rotate(-2.5deg);
        }

        /* ── Laptop Chassis & Lid ── */
        .mj-laptop-chassis {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
        }
        .mj-laptop-lid {
          width: 100%;
          background: #18191E;
          border: 2px solid #1B1B1B;
          border-radius: 16px 16px 4px 4px;
          box-shadow: 0 20px 42px -12px rgba(27,27,27,0.2), 4px 4px 0px #1B1B1B;
          padding: 6px 6px 8px;
          box-sizing: border-box;
        }
        .mj-laptop-bezel-top {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 10px;
        }
        .mj-laptop-camera {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #0A0A0C;
          box-shadow: inset 0 0 1px #3B82F6;
        }
        .mj-laptop-screen {
          width: 100%;
          background: #14161C;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid #2D333F;
          text-align: left;
        }

        /* Laptop Base Deck */
        .mj-laptop-base {
          width: 106%;
          max-width: 575px;
          height: 12px;
          background: linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 100%);
          border: 2px solid #1B1B1B;
          border-top: none;
          border-radius: 0 0 16px 16px;
          position: relative;
          box-shadow: 0 4px 6px rgba(0,0,0,0.06);
          display: flex;
          justify-content: center;
        }
        .mj-laptop-thumb-notch {
          width: 62px;
          height: 4px;
          background: #94A3B8;
          border-radius: 0 0 5px 5px;
        }
        .mj-laptop-shadow {
          width: 88%;
          height: 14px;
          background: radial-gradient(ellipse at center, rgba(27,27,27,0.18) 0%, rgba(27,27,27,0) 70%);
          margin-top: 2px;
        }

        /* ── Screen Titlebar ── */
        .mj-os-titlebar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 11px;
          background: #1A1D24;
          border-bottom: 1px solid #2A2F3D;
        }
        .mj-os-traffic-lights {
          display: flex;
          gap: 5px;
        }
        .mj-os-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .mj-dot-red    { background: #FF5F56; }
        .mj-dot-yellow { background: #FFBD2E; }
        .mj-dot-green  { background: #27C93F; }

        .mj-os-window-title {
          font: 600 11px/1 'Sora', sans-serif;
          color: #94A3B8;
          letter-spacing: -0.01em;
        }
        .mj-os-mentor-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font: 600 10.5px/1 'DM Sans', sans-serif;
          color: #4ADE80;
          background: rgba(34, 197, 94, 0.15);
          padding: 2.5px 8px;
          border-radius: 999px;
          border: 1px solid rgba(74, 222, 128, 0.3);
        }
        .mj-pulse-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ADE80;
          box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          animation: mjPulse 2s infinite;
        }
        @keyframes mjPulse {
          0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
          70% { box-shadow: 0 0 0 5px rgba(74, 222, 128, 0); }
          100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
        }

        /* ── Screen Tabbar ── */
        .mj-os-tabbar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          padding: 6px 10px;
          background: #14161C;
          border-bottom: 1px solid #232733;
        }
        .mj-os-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 6px 4px;
          border-radius: 7px;
          border: 1.5px solid transparent;
          background: #1E222B;
          font: 700 10.5px/1 'Sora', sans-serif;
          color: #94A3B8;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .mj-os-tab-btn:hover {
          background: #282D3A;
          color: #FFFFFF;
        }
        .mj-os-tab-btn.active {
          background: #FF5A36;
          color: #FFFFFF;
          border-color: #FF5A36;
          box-shadow: 1.5px 1.5px 0px #1B1B1B;
        }

        /* ── Screen Content Area ── */
        .mj-fade-in {
          animation: mjFadeIn 0.22s ease-out;
        }
        @keyframes mjFadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Google Meet Stage (Tab 1) */
        .mj-os-meet-stage {
          position: relative;
          width: 100%;
          background: #111317;
          overflow: hidden;
        }
        .mj-os-meet-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          display: block;
          overflow: hidden;
          background: #111317;
        }
        .mj-os-meet-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .mj-meet-live-badge {
          position: absolute;
          top: 9px;
          right: 11px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(15, 23, 42, 0.84);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          padding: 3px 9px;
          font: 700 10px/1 'Sora', sans-serif;
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          pointer-events: none;
        }
        .mj-meet-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #EF4444;
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.8);
          animation: mjLivePulse 1.8s infinite;
        }
        @keyframes mjLivePulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.8); }
          70% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        /* Tab 2: Daily Targets UI */
        .mj-os-screen-content {
          padding: 10px 12px 14px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: #FAFAFA;
        }
        .mj-os-progress-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 7px 10px;
        }
        .mj-os-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mj-os-subheading {
          font: 700 11px/1.2 'Sora', sans-serif;
          color: #1E293B;
        }
        .mj-os-badge-pill {
          font: 800 10px/1 'Sora', sans-serif;
          color: #FF5A36;
          background: #FFF0EB;
          padding: 2px 6px;
          border-radius: 5px;
        }
        .mj-os-progress-track {
          height: 6px;
          background: #F1F5F9;
          border-radius: 999px;
          overflow: hidden;
          margin-top: 5px;
        }
        .mj-os-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #FF7A3C 0%, #FF5A36 100%);
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .mj-os-checklist {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .mj-os-task-row {
          display: flex;
          align-items: center;
          gap: 7px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 7px;
          padding: 5.5px 8px;
          cursor: pointer;
          user-select: none;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .mj-os-task-row:hover {
          border-color: #CBD5E1;
          background: #F8FAFC;
        }
        .mj-os-task-row.is-done {
          border-color: #BBF7D0;
          background: #F0FDF4;
        }
        .mj-os-checkbox {
          width: 15px;
          height: 15px;
          border-radius: 4px;
          border: 1.5px solid #CBD5E1;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          background: #FFFFFF;
          transition: all 0.15s ease;
        }
        .mj-os-checkbox.checked {
          background: #16A34A;
          border-color: #16A34A;
        }
        .mj-os-task-text {
          font: 500 11px/1.3 'Inter', sans-serif;
          color: #1E293B;
          flex: 1;
        }
        .mj-os-task-row.is-done .mj-os-task-text {
          text-decoration: line-through;
          color: #64748B;
        }
        .mj-os-task-tag {
          font: 700 9.5px/1 'Sora', sans-serif;
          padding: 2px 5px;
          border-radius: 4px;
          background: #F1F5F9;
          color: #475569;
        }

        .mj-os-mentor-card {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          background: #FFFFFF;
          border: 1.5px solid #FFEDD5;
          border-radius: 8px;
          padding: 7px 9px;
        }
        .mj-os-mentor-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #FF5A36;
          color: #FFFFFF;
          font: 800 9.5px/26px 'Sora', sans-serif;
          text-align: center;
          flex-shrink: 0;
        }
        .mj-os-mentor-meta {
          font: 700 10.5px/1.2 'Sora', sans-serif;
          color: #1B1B1B;
        }
        .mj-os-mentor-text {
          font: 400 10.5px/1.3 'DM Sans', sans-serif;
          color: #475569;
          margin: 2px 0 0;
        }

        /* Tab 3: Test Autopsy UI */
        .mj-os-autopsy-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mj-os-score-display {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-top: 3px;
        }
        .mj-os-score-num {
          font: 800 19px/1 'Sora', sans-serif;
          color: #1B1B1B;
        }
        .mj-os-score-denom {
          font: 600 11.5px/1 'Sora', sans-serif;
          color: #94A3B8;
        }
        .mj-os-score-top {
          font: 800 10px/1 'Sora', sans-serif;
          color: #16A34A;
          background: #DCFCE7;
          padding: 2px 7px;
          border-radius: 999px;
          margin-left: 8px;
        }

        .mj-os-subject-grid {
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 7px 9px;
        }
        .mj-os-sub-bar-row {
          display: flex;
          flex-direction: column;
          gap: 2.5px;
        }
        .mj-os-sub-label {
          display: flex;
          justify-content: space-between;
          font: 600 10.5px/1 'Inter', sans-serif;
          color: #334155;
        }
        .mj-os-sub-track {
          height: 4.5px;
          background: #F1F5F9;
          border-radius: 999px;
          overflow: hidden;
        }
        .mj-os-sub-fill {
          height: 100%;
          border-radius: 999px;
        }

        .mj-os-autopsy-alert {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 7px;
          padding: 6px 9px;
          font: 400 10.5px/1.3 'DM Sans', sans-serif;
          color: #991B1B;
        }
        .mj-os-alert-badge {
          display: inline-block;
          font: 800 9.5px/1 'Sora', sans-serif;
          background: #FEE2E2;
          color: #DC2626;
          padding: 1px 5px;
          border-radius: 3px;
          margin-bottom: 2px;
        }
        .mj-os-autopsy-alert p {
          margin: 2px 0 0;
        }

        /* ── Responsive Layout Breakpoints ── */
        @media (max-width: 960px) {
          .mj-hero-seo {
            padding: 160px 0 44px;
          }
          .mj-hero-seo-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 36px;
          }
          .mj-hero-copy-col {
            text-align: center;
          }
          .mj-hero-line2 {
            align-items: center;
          }
          .mj-hero-editorial-actions {
            justify-content: center;
          }
          .mj-hero-wa-hint {
            text-align: center;
          }
          .mj-hero-illustration-col {
            order: 2;
          }
          .mj-device-showcase {
            max-width: 480px;
          }
          .mj-note-tl {
            left: -8px;
            top: -4px;
          }
          .mj-note-bl {
            left: -8px;
            bottom: 0px;
          }
          .mj-note-br {
            right: -8px;
            bottom: 0px;
          }
        }

        @media (max-width: 640px) {
          .mj-hero-seo {
            padding: 145px 0 36px;
          }
          .mj-hero-h1 {
            font-size: clamp(1.85rem, 6.8vw, 2.4rem);
            line-height: 1.18;
          }
          .mj-hero-editorial-actions {
            flex-direction: column;
            width: 100%;
          }
          .mj-hero-btn-primary,
          .mj-hero-btn-secondary {
            width: 100%;
            justify-content: center;
          }
          .mj-device-showcase {
            max-width: 100%;
            padding: 14px 4px 6px;
          }
          /* Keep mobile neat and clean */
          .mj-note-tl,
          .mj-note-bl,
          .mj-note-br {
            display: none;
          }
          .mj-plane-sign {
            top: -20px;
            right: 4px;
          }
          .mj-plane-origami {
            width: 48px;
            height: 40px;
          }
          .mj-plane-trail-svg {
            width: 100px;
            height: 70px;
          }
        }
      `}</style>
    </>
  );
}
