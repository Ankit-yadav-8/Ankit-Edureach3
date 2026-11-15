import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

/* ════════════════════════════════════════════════
   HERO - 2-Column Split Editorial Hub Layout
   Matches JEE 2027 Mentorship design:
   - Bold neo-brutalist typography with squiggly underline
   - Neo-brutalist orange box pill badge
   - High-contrast primary CTA ("Explore Mentorship")
   - High-contrast secondary CTA ("About Us")
   - Direct WhatsApp mentor contact hint
   - Floating 1-on-1 desk illustration visual on RHS
════════════════════════════════════════════════ */

const CORAL     = "#FF5A36";
const INK       = "#1B1B1B";
const TEXT_SOFT = "#8A8272";
const BASE      = "#FFFFFF";
const SHADOW_DK = "rgba(0,0,0,0.08)";
const SHADOW_LT = "#FFFFFF";

const pressed = `inset 4px 4px 8px ${SHADOW_DK}, inset -4px -4px 8px ${SHADOW_LT}`;

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
            {/* Left Column: Headline, Pill, Subtitle, Actions, Reassurance */}
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

            {/* Right Column: Hero Illustration Visual - 1-on-1 JEE Mentorship & IITian Guidance */}
            <div className="mj-hero-illustration-col">
              <div className="mj-hero-illustration-wrapper">
                <picture>
                  <source srcSet="/images/home_hero_jee_mentorship.webp" type="image/webp" />
                  <img
                    src="/images/home_hero_jee_mentorship.jpg"
                    alt="CampusPoint 1-on-1 IITian Mentorship and JEE Rank Prediction"
                    className="mj-hero-illustration-img"
                    width="680"
                    height="450"
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
              </div>
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
          grid-template-columns: 1fr 1fr;
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
        .mj-hero-sub {
          font: 400 clamp(1.02rem, 1.35vw, 1.18rem)/1.6 'DM Sans', sans-serif;
          color: #4A4A4A;
          max-width: 540px;
          margin: 18px 0 24px;
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

        /* Right Column Illustration Visual */
        .mj-hero-illustration-col {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
        }
        .mj-hero-illustration-wrapper {
          position: relative;
          width: 100%;
          max-width: 580px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mj-hero-illustration-wrapper::before {
          display: none;
        }
        .mj-hero-bg, .mj-orb {
          display: none;
        }

        /* Responsive Hero Layout */
        @media (max-width: 960px) {
          .mj-hero-seo {
            padding: 160px 0 44px;
          }
          .mj-hero-seo-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 32px;
          }
          .mj-hero-copy-col {
            text-align: center;
          }
          .mj-hero-line2 {
            align-items: center;
          }
          .mj-hero-sub {
            margin-left: auto;
            margin-right: auto;
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
          .mj-hero-illustration-wrapper {
            max-width: 380px;
            margin: 0 auto;
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
          .mj-hero-illustration-wrapper {
            max-width: 320px;
          }
        }
      `}</style>
    </>
  );
}
